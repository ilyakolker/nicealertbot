import { OrefAlert, Lang } from './types';
import { ALERT_TYPES, formatAlertMessage } from './translations';
import { fetchOrefAlert } from './oref';
import { getMatchingSubscribers, logAlert, updateAlertSentCount, setSubscriberActive } from './db';
import { sendTelegramMessage } from './telegram';

const seenIds = new Set<string>();
export let lastCheckTime = new Date();
export let totalAlertsSent = 0;

export function startPoller(): void {
  const interval = Number(process.env.POLL_INTERVAL_MS) || 5000;
  setInterval(async () => {
    try {
      const alert = await fetchOrefAlert();
      lastCheckTime = new Date();
      if (!alert?.id || seenIds.has(alert.id)) return;
      seenIds.add(alert.id);
      if (seenIds.size > 500) {
        seenIds.delete(seenIds.values().next().value!);
      }
      await processAlert(alert);
    } catch (err) {
      console.error('Poll error:', err);
    }
  }, interval);
  console.log(`✅ Poller started (interval: ${interval}ms)`);
}

async function processAlert(alert: OrefAlert): Promise<void> {
  const titleEn = ALERT_TYPES[alert.title] ?? alert.title;
  await logAlert(alert.id, alert.title, titleEn, alert.data, 0);

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

  await updateAlertSentCount(alert.id, count);
  totalAlertsSent += count;
  console.log(`Alert ${alert.id}: sent to ${count}/${subscribers.length} subscribers`);
}
