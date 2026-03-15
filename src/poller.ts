import { OrefHistoryEntry, Lang } from './types';
import { ALERT_TYPES, formatAlertMessage } from './translations';
import { fetchAlertHistory } from './oref';
import { getMatchingSubscribers, logAlert, updateAlertSentCount, setSubscriberActive } from './db';
import { sendTelegramMessage } from './telegram';

let lastSeenRid = 0;
let initialized = false;
export let lastCheckTime = new Date();
export let totalAlertsSent = 0;

export function startPoller(): void {
  const interval = Number(process.env.POLL_INTERVAL_MS) || 5000;
  setInterval(async () => {
    try {
      const entries = await fetchAlertHistory();
      lastCheckTime = new Date();
      if (entries.length === 0) return;

      if (!initialized) {
        // First run: just record the highest rid, don't send old alerts
        lastSeenRid = Math.max(...entries.map(e => e.rid));
        initialized = true;
        console.log(`✅ Poller initialized, lastSeenRid: ${lastSeenRid}`);
        return;
      }

      // Filter new entries only, skip "event ended" (category 13)
      const newEntries = entries
        .filter(e => e.rid > lastSeenRid && e.category !== 13)
        .sort((a, b) => a.rid - b.rid);

      if (newEntries.length === 0) return;

      // Update lastSeenRid to the max of ALL entries (including category 13)
      lastSeenRid = Math.max(...entries.map(e => e.rid));

      // Group by alertDate to batch cities in the same alert wave
      const groups = new Map<string, OrefHistoryEntry[]>();
      for (const entry of newEntries) {
        const key = `${entry.alertDate}_${entry.category}`;
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key)!.push(entry);
      }

      for (const [, group] of groups) {
        await processAlertGroup(group);
      }
    } catch (err) {
      console.error('Poll error:', err);
    }
  }, interval);
  console.log(`✅ Poller started (interval: ${interval}ms)`);
}

async function processAlertGroup(entries: OrefHistoryEntry[]): Promise<void> {
  const areas = entries.map(e => e.data);
  const titleHe = entries[0].category_desc;
  const titleEn = ALERT_TYPES[titleHe] ?? titleHe;
  const alertId = `${entries[0].alertDate}_${entries[0].category}`;
  const time = entries[0].time.slice(0, 5); // HH:MM

  await logAlert(alertId, titleHe, titleEn, areas, 0);

  const subscribers = await getMatchingSubscribers(areas);

  let count = 0;
  for (const sub of subscribers) {
    const lang = sub.lang as Lang;
    const title = lang === 'en' ? titleEn : titleHe;
    const text = formatAlertMessage(title, areas, time, lang);
    const ok = await sendTelegramMessage(sub.chat_id, text);
    if (ok) {
      count++;
    } else {
      await setSubscriberActive(sub.chat_id, false);
    }
  }

  await updateAlertSentCount(alertId, count);
  totalAlertsSent += count;
  console.log(`Alert ${alertId}: ${areas.join(', ')} — sent to ${count}/${subscribers.length} subscribers`);
}
