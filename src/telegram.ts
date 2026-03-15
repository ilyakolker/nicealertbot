import fetch from 'node-fetch';
import { InlineKeyboardMarkup } from './types';

const TOKEN = () => process.env.TELEGRAM_BOT_TOKEN!;
const API = () => `https://api.telegram.org/bot${TOKEN()}`;

export async function sendTelegramMessage(
  chatId: number,
  text: string,
  replyMarkup?: InlineKeyboardMarkup
): Promise<boolean> {
  try {
    const body: Record<string, any> = {
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
    };
    if (replyMarkup) body.reply_markup = replyMarkup;

    const res = await fetch(`${API()}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (res.ok) return true;

    const data = (await res.json()) as any;
    const code = data?.error_code;

    if (code === 403) {
      console.warn(`User ${chatId} blocked the bot`);
      return false;
    }

    if (code === 429) {
      const retryAfter = data?.parameters?.retry_after ?? 5;
      console.warn(`Rate limited, retrying after ${retryAfter}s for chat ${chatId}`);
      await new Promise(r => setTimeout(r, retryAfter * 1000));
      const retry = await fetch(`${API()}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      return retry.ok;
    }

    console.error(`sendMessage error ${code} for chat ${chatId}:`, data?.description);
    return false;
  } catch (err) {
    console.error(`sendMessage exception for chat ${chatId}:`, err);
    return false;
  }
}

export async function answerCallbackQuery(callbackQueryId: string, text?: string): Promise<void> {
  try {
    const body: Record<string, any> = { callback_query_id: callbackQueryId };
    if (text) body.text = text;
    await fetch(`${API()}/answerCallbackQuery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch (err) {
    console.error('answerCallbackQuery error:', err);
  }
}

export async function editMessageText(
  chatId: number,
  messageId: number,
  text: string,
  replyMarkup?: InlineKeyboardMarkup
): Promise<void> {
  try {
    const body: Record<string, any> = {
      chat_id: chatId,
      message_id: messageId,
      text,
      parse_mode: 'HTML',
    };
    if (replyMarkup) body.reply_markup = replyMarkup;
    await fetch(`${API()}/editMessageText`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch (err) {
    console.error('editMessageText error:', err);
  }
}

export async function registerWebhook(url: string, secret: string): Promise<void> {
  try {
    const res = await fetch(`${API()}/setWebhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url,
        secret_token: secret,
        allowed_updates: ['message', 'callback_query'],
      }),
    });
    const data = await res.json();
    console.log('Webhook registration:', data);
  } catch (err) {
    console.error('registerWebhook error:', err);
  }
}

export async function setBotCommands(): Promise<void> {
  const commands = [
    { command: 'start', description: 'התחלה / Start' },
    { command: 'location', description: 'שינוי עיר / Change city' },
    { command: 'mystatus', description: 'מצב נוכחי / Current status' },
    { command: 'sound', description: 'צליל התראה / Alert sound' },
    { command: 'language', description: 'שפה / Language' },
    { command: 'test', description: 'התראת בדיקה / Test alert' },
    { command: 'stop', description: 'השהיה / Pause' },
    { command: 'resume', description: 'חידוש / Resume' },
    { command: 'help', description: 'עזרה / Help' },
  ];
  try {
    await fetch(`${API()}/setMyCommands`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ commands }),
    });
    console.log('✅ Bot commands registered');
  } catch (err) {
    console.error('setBotCommands error:', err);
  }
}
