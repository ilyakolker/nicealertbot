import { OrefHistoryEntry, OrefAlert, Lang } from './types';
import { ALERT_TYPES, formatAlertMessage } from './translations';
import { fetchOrefAlert, fetchAlertHistory } from './oref';
import { getMatchingSubscribers, logAlert, updateAlertSentCount, setSubscriberActive, alertExists } from './db';
import { sendTelegramMessage } from './telegram';

const seenIds = new Set<string>();
export let lastCheckTime = new Date();
export let totalAlertsSent = 0;

export function startPoller(): void {
  // Real-time polling every 1 second for fastest delivery
  setInterval(async () => {
    try {
      const alert = await fetchOrefAlert();
      lastCheckTime = new Date();
      if (!alert?.id || seenIds.has(alert.id)) return;
      seenIds.add(alert.id);
      if (seenIds.size > 500) {
        seenIds.delete(seenIds.values().next().value!);
      }
      await processRealtimeAlert(alert);
    } catch (err) {
      console.error('Realtime poll error:', err);
    }
  }, 1000);
  console.log('✅ Realtime poller started (1s interval)');

  // History backup every 30 seconds to catch anything missed
  let lastSeenRid = 0;
  let historyInitialized = false;

  setInterval(async () => {
    try {
      const entries = await fetchAlertHistory();
      if (entries.length === 0) return;

      if (!historyInitialized) {
        lastSeenRid = Math.max(...entries.map(e => e.rid));
        historyInitialized = true;
        console.log(`✅ History backup initialized, lastSeenRid: ${lastSeenRid}`);
        return;
      }

      const newEntries = entries
        .filter(e => e.rid > lastSeenRid && e.category !== 13)
        .sort((a, b) => a.rid - b.rid);

      if (newEntries.length > 0) {
        lastSeenRid = Math.max(...entries.map(e => e.rid));

        const groups = new Map<string, OrefHistoryEntry[]>();
        for (const entry of newEntries) {
          const key = `${entry.alertDate}_${entry.category}`;
          if (!groups.has(key)) groups.set(key, []);
          groups.get(key)!.push(entry);
        }

        for (const [, group] of groups) {
          await processHistoryGroup(group);
        }
      }
    } catch (err) {
      console.error('History poll error:', err);
    }
  }, 10000);
  console.log('✅ History backup poller started (10s interval)');
}

async function processRealtimeAlert(alert: OrefAlert): Promise<void> {
  const alertId = `realtime_${alert.id}`;

  if (await alertExists(alertId)) {
    console.log(`Alert ${alertId} already sent, skipping`);
    return;
  }

  const titleEn = ALERT_TYPES[alert.title] ?? alert.title;
  await logAlert(alertId, alert.title, titleEn, alert.data, 0);

  const subscribers = await getMatchingSubscribers(alert.data);

  let count = 0;
  for (const sub of subscribers) {
    const lang = sub.lang as Lang;
    const title = lang === 'en' ? titleEn : alert.title;
    const time = new Date().toLocaleTimeString('he-IL', { hour12: false });
    const text = formatAlertMessage(title, alert.data, time, lang);
    const ok = await sendTelegramMessage(sub.chat_id, text);
    if (ok) {
      count++;
    } else {
      await setSubscriberActive(sub.chat_id, false);
    }
  }

  await updateAlertSentCount(alertId, count);
  totalAlertsSent += count;
  console.log(`⚡ Realtime alert ${alert.id}: ${alert.data.join(', ')} — sent to ${count}/${subscribers.length}`);
}

async function processHistoryGroup(entries: OrefHistoryEntry[]): Promise<void> {
  const areas = entries.map(e => e.data);
  const titleHe = entries[0].category_desc;
  const titleEn = ALERT_TYPES[titleHe] ?? titleHe;
  const alertId = `history_${entries[0].alertDate}_${entries[0].category}`;
  const time = entries[0].time.slice(0, 5);

  if (await alertExists(alertId)) {
    return;
  }

  // Check if realtime already sent this (different ID format)
  // Skip if any realtime alert was logged in the last 60 seconds with same areas
  const realtimeAlreadySent = await alertExists(`realtime_${entries[0].alertDate}_${entries[0].category}`);
  if (realtimeAlreadySent) return;

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
  console.log(`📋 History alert ${alertId}: ${areas.join(', ')} — sent to ${count}/${subscribers.length}`);
}
