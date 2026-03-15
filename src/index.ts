import 'dotenv/config';
import express from 'express';
import { initDb, runMigrations, getActiveSubscriberCount } from './db';
import { registerWebhook, setBotCommands } from './telegram';
import { handleUpdate } from './bot';
import { startPoller, lastCheckTime, totalAlertsSent } from './poller';
import { loadCities } from './oref';
import { TelegramUpdate } from './types';

const app = express();
app.use(express.json());

// CORS for /health
app.use('/health', (_req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  next();
});

app.get('/health', async (_req, res) => {
  try {
    const activeSubscribers = await getActiveSubscriberCount();
    res.json({
      status: 'ok',
      lastCheck: lastCheckTime.toISOString(),
      secondsSinceLastCheck: Math.floor((Date.now() - lastCheckTime.getTime()) / 1000),
      totalAlertsSent,
      activeSubscribers,
    });
  } catch (err) {
    res.status(500).json({ status: 'error', error: String(err) });
  }
});

app.post('/telegram/webhook', (req, res) => {
  const secret = req.headers['x-telegram-bot-api-secret-token'];
  if (secret !== process.env.WEBHOOK_SECRET) {
    res.status(403).json({ error: 'Forbidden' });
    return;
  }
  const update = req.body as TelegramUpdate;
  // Process async, respond immediately
  handleUpdate(update).catch(err => console.error('Webhook handler error:', err));
  res.status(200).json({ ok: true });
});

async function main() {
  try {
    // 1. Database
    initDb();
    await runMigrations();

    // 2. Load cities
    await loadCities();

    // 3. Webhook
    const renderUrl = process.env.RENDER_URL;
    if (renderUrl) {
      await registerWebhook(`${renderUrl}/telegram/webhook`, process.env.WEBHOOK_SECRET!);
    } else {
      console.warn('⚠️ RENDER_URL not set — webhook not registered');
    }

    // 3. Bot commands
    await setBotCommands();

    // 4. Poller
    startPoller();

    // 5. Express
    const port = Number(process.env.PORT) || 3000;
    app.listen(port, () => {
      console.log(`✅ NiceAlert Bot v1.1 running on port ${port}`);
    });
  } catch (err) {
    console.error('Fatal startup error:', err);
    process.exit(1);
  }
}

main();
