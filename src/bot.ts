import {
  TelegramUpdate, TelegramMessage, TelegramCallbackQuery,
  InlineKeyboardMarkup, Lang, SearchState,
} from './types';
import { t, formatAlertMessage, ALERT_TYPES } from './translations';
import {
  upsertSubscriber, getSubscriber, addCity, removeCity, setAllIsrael, unsetAllIsrael,
  updateLang, setSubscriberActive,
} from './db';
import {
  sendTelegramMessage, answerCallbackQuery, editMessageText,
} from './telegram';
import { searchOrefCities } from './oref';

const searchStates = new Map<number, SearchState>();

function detectLang(languageCode?: string): Lang {
  if (!languageCode) return 'he';
  return (languageCode === 'he' || languageCode === 'iw') ? 'he' : 'en';
}

function allIsraelButton(lang: Lang): InlineKeyboardMarkup {
  return {
    inline_keyboard: [[{ text: t('allIsrael', lang), callback_data: 'all_israel' }]],
  };
}

async function promptCitySearch(chatId: number, lang: Lang, context: 'setup' | 'update' = 'setup') {
  searchStates.set(chatId, { awaitingSearch: true, context });
  await sendTelegramMessage(chatId, t('promptCity', lang), allIsraelButton(lang));
}

async function sendSoundInstructions(chatId: number, lang: Lang) {
  const kb: InlineKeyboardMarkup = {
    inline_keyboard: [[{ text: t('soundDoneBtn', lang), callback_data: 'sound_done' }]],
  };
  await sendTelegramMessage(chatId, t('soundInstructions', lang), kb);
}

async function getSubLang(chatId: number): Promise<Lang> {
  const sub = await getSubscriber(chatId);
  return (sub?.lang as Lang) ?? 'he';
}

async function getLocationDisplay(chatId: number, lang: Lang): Promise<string> {
  const sub = await getSubscriber(chatId);
  if (!sub) return lang === 'he' ? 'לא נבחר' : 'Not set';
  if (sub.all_israel) return lang === 'he' ? 'כל הארץ 🇮🇱' : 'All Israel 🇮🇱';
  if (sub.cities.length === 0) return lang === 'he' ? 'לא נבחר' : 'Not set';
  return sub.cities.join(', ');
}

async function showCityManagement(chatId: number, lang: Lang): Promise<void> {
  const sub = await getSubscriber(chatId);
  if (!sub) return;

  const rows: { text: string; callback_data: string }[][] = [];

  if (sub.all_israel) {
    rows.push([{ text: `❌ ${t('allIsrael', lang)}`, callback_data: 'rm_all_israel' }]);
  } else {
    for (const city of sub.cities) {
      rows.push([{ text: `❌ ${city}`, callback_data: `rm:${city}` }]);
    }
    rows.push([{ text: t('addMore', lang), callback_data: 'add_city' }]);
    rows.push([{ text: t('allIsrael', lang), callback_data: 'all_israel' }]);
  }

  let header: string;
  if (sub.all_israel) {
    header = lang === 'he' ? '📍 רשום לכל הארץ 🇮🇱' : '📍 Subscribed to All Israel 🇮🇱';
  } else if (sub.cities.length > 0) {
    header = `${t('currentCities', lang)}\n${sub.cities.join(', ')}`;
  } else {
    header = t('noCities', lang);
  }

  await sendTelegramMessage(chatId, header, { inline_keyboard: rows });
}

export async function handleUpdate(update: TelegramUpdate): Promise<void> {
  try {
    if (update.callback_query) {
      await handleCallback(update.callback_query);
    } else if (update.message) {
      await handleMessage(update.message);
    }
  } catch (err) {
    console.error('handleUpdate error:', err);
  }
}

async function handleMessage(msg: TelegramMessage): Promise<void> {
  const chatId = msg.chat.id;
  const text = msg.text?.trim() ?? '';

  if (text.startsWith('/')) {
    const command = text.split('@')[0].split(' ')[0].toLowerCase();
    switch (command) {
      case '/start': return cmdStart(msg);
      case '/location': return cmdLocation(chatId);
      case '/mystatus': return cmdMyStatus(chatId);
      case '/sound': return cmdSound(chatId);
      case '/language': return cmdLanguage(chatId);
      case '/test': return cmdTest(chatId);
      case '/stop': return cmdStop(chatId);
      case '/resume': return cmdResume(chatId);
      case '/help': return cmdHelp(chatId);
      default: {
        const lang = await getSubLang(chatId);
        await sendTelegramMessage(chatId, t('unknown', lang));
      }
    }
    return;
  }

  // Non-command text
  const state = searchStates.get(chatId);
  if (state?.awaitingSearch) {
    await handleCitySearch(chatId, text);
    return;
  }

  // Not in search mode, unknown text — auto-start if not registered
  const sub = await getSubscriber(chatId);
  if (!sub) {
    return cmdStart(msg);
  }
  const lang = (sub.lang as Lang) ?? 'he';
  await sendTelegramMessage(chatId, t('unknown', lang));
}

async function cmdStart(msg: TelegramMessage): Promise<void> {
  const chatId = msg.chat.id;
  const lang = detectLang(msg.from?.language_code);
  await upsertSubscriber(chatId, lang);
  await sendTelegramMessage(chatId, t('welcome', lang));
  await promptCitySearch(chatId, lang, 'setup');
}

async function cmdLocation(chatId: number): Promise<void> {
  const sub = await getSubscriber(chatId);
  if (!sub) {
    await sendTelegramMessage(chatId, t('notRegistered', 'he'));
    return;
  }
  const lang = sub.lang as Lang;
  await showCityManagement(chatId, lang);
}

async function cmdMyStatus(chatId: number): Promise<void> {
  const sub = await getSubscriber(chatId);
  if (!sub) {
    await sendTelegramMessage(chatId, t('notRegistered', 'he'));
    return;
  }
  const lang = sub.lang as Lang;
  const city = await getLocationDisplay(chatId, lang);
  const date = new Date(sub.created_at).toLocaleDateString(lang === 'he' ? 'he-IL' : 'en-US');
  const msg = t('statusMsg', lang)(city, sub.active, date);
  await sendTelegramMessage(chatId, msg);
}

async function cmdSound(chatId: number): Promise<void> {
  const lang = await getSubLang(chatId);
  const kb: InlineKeyboardMarkup = {
    inline_keyboard: [[{ text: t('soundDoneBtn', lang), callback_data: 'sound_done' }]],
  };
  await sendTelegramMessage(chatId, t('soundInstructions', lang), kb);
}

async function cmdLanguage(chatId: number): Promise<void> {
  const lang = await getSubLang(chatId);
  const kb: InlineKeyboardMarkup = {
    inline_keyboard: [[
      { text: '🇮🇱 עברית', callback_data: 'lang_he' },
      { text: '🇬🇧 English', callback_data: 'lang_en' },
    ]],
  };
  await sendTelegramMessage(chatId, t('langSelect', lang), kb);
}

async function cmdTest(chatId: number): Promise<void> {
  const sub = await getSubscriber(chatId);
  if (!sub || (sub.cities.length === 0 && !sub.all_israel)) {
    const lang = sub?.lang as Lang ?? 'he';
    await sendTelegramMessage(chatId, t('testNoCity', lang));
    return;
  }
  const lang = sub.lang as Lang;
  const areas = sub.all_israel
    ? ['תל אביב - מרכז העיר', 'חיפה - מרכז הכרמל', 'באר שבע - מרכז']
    : sub.cities;
  const title = lang === 'he' ? 'ירי רקטות וטילים' : 'Rocket and missile fire';
  const time = new Date().toLocaleTimeString('he-IL', { hour12: false });
  const text = formatAlertMessage(title, areas, time, lang);
  await sendTelegramMessage(chatId, text);
  await sendTelegramMessage(chatId, t('testAlert', lang));
}

async function cmdStop(chatId: number): Promise<void> {
  const lang = await getSubLang(chatId);
  await setSubscriberActive(chatId, false);
  await sendTelegramMessage(chatId, t('stopConfirm', lang));
}

async function cmdResume(chatId: number): Promise<void> {
  await setSubscriberActive(chatId, true);
  const lang = await getSubLang(chatId);
  const city = await getLocationDisplay(chatId, lang);
  const msg = t('resumeConfirm', lang)(city);
  await sendTelegramMessage(chatId, msg);
}

async function cmdHelp(chatId: number): Promise<void> {
  const lang = await getSubLang(chatId);
  await sendTelegramMessage(chatId, t('help', lang));
}

async function handleCitySearch(chatId: number, query: string): Promise<void> {
  const lang = await getSubLang(chatId);

  if (query.length < 2) {
    await sendTelegramMessage(chatId, t('minChars', lang));
    return;
  }

  const results = await searchOrefCities(query);

  if (results.length === 0) {
    const noRes = t('noResults', lang)(query);
    await sendTelegramMessage(chatId, noRes, allIsraelButton(lang));
    return;
  }

  const rows: { text: string; callback_data: string }[][] = [];
  for (let i = 0; i < results.length; i += 2) {
    const row: { text: string; callback_data: string }[] = [
      { text: results[i].label, callback_data: `city:${results[i].value}` },
    ];
    if (i + 1 < results.length) {
      row.push({ text: results[i + 1].label, callback_data: `city:${results[i + 1].value}` });
    }
    rows.push(row);
  }
  rows.push([{ text: t('allIsrael', lang), callback_data: 'all_israel' }]);

  await sendTelegramMessage(chatId, `🔍 ${lang === 'he' ? 'תוצאות:' : 'Results:'}`, {
    inline_keyboard: rows,
  });
}

async function handleCallback(cb: TelegramCallbackQuery): Promise<void> {
  const chatId = cb.message?.chat.id;
  if (!chatId) return;
  const data = cb.data ?? '';

  if (data.startsWith('city:')) {
    const city = data.slice(5);
    const state = searchStates.get(chatId);
    await addCity(chatId, city);
    searchStates.delete(chatId);
    const lang = await getSubLang(chatId);
    await answerCallbackQuery(cb.id);
    await sendTelegramMessage(chatId, t('cityAdded', lang)(city));
    if (state?.context === 'setup') {
      await sendSoundInstructions(chatId, lang);
    } else {
      await showCityManagement(chatId, lang);
    }
    return;
  }

  if (data.startsWith('rm:')) {
    const city = data.slice(3);
    await removeCity(chatId, city);
    const lang = await getSubLang(chatId);
    await answerCallbackQuery(cb.id);
    await sendTelegramMessage(chatId, t('cityRemoved', lang)(city));
    await showCityManagement(chatId, lang);
    return;
  }

  switch (data) {
    case 'rm_all_israel': {
      const lang = await getSubLang(chatId);
      await unsetAllIsrael(chatId);
      await answerCallbackQuery(cb.id);
      await showCityManagement(chatId, lang);
      break;
    }
    case 'add_city': {
      const lang = await getSubLang(chatId);
      await answerCallbackQuery(cb.id);
      await promptCitySearch(chatId, lang, 'update');
      break;
    }
    case 'all_israel': {
      await setAllIsrael(chatId);
      searchStates.delete(chatId);
      const lang = await getSubLang(chatId);
      await answerCallbackQuery(cb.id);
      await sendTelegramMessage(chatId, t('allIsraelSaved', lang));
      await sendSoundInstructions(chatId, lang);
      break;
    }
    case 'sound_done': {
      const lang = await getSubLang(chatId);
      await answerCallbackQuery(cb.id);
      const city = await getLocationDisplay(chatId, lang);
      await sendTelegramMessage(chatId, t('setupComplete', lang)(city));
      break;
    }
    case 'lang_he': {
      await updateLang(chatId, 'he');
      await answerCallbackQuery(cb.id);
      await sendTelegramMessage(chatId, t('langChanged', 'he'));
      break;
    }
    case 'lang_en': {
      await updateLang(chatId, 'en');
      await answerCallbackQuery(cb.id);
      await sendTelegramMessage(chatId, t('langChanged', 'en'));
      break;
    }
    default:
      console.warn('Unknown callback data:', data);
      await answerCallbackQuery(cb.id);
  }
}
