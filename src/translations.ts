import { Lang } from './types';

export const ALERT_TYPES: Record<string, string> = {
  'ירי רקטות וטילים': 'Rocket and missile fire',
  'חדירת כלי טיס עוין': 'Hostile aircraft intrusion',
  'אירוע רדיולוגי': 'Radiological incident',
  'חומרים מסוכנים': 'Hazardous materials',
  'רעידת אדמה': 'Earthquake',
  'גל צונאמי': 'Tsunami wave',
  'חדירת מחבלים': 'Terrorist infiltration',
  'אזעקה': 'Alert',
  'ירי נשק קל': 'Small arms fire',
  'התרעות פיקוד העורף': 'Home Front Command alert',
};

const strings = {
  welcome: {
    he: '🚨 ברוך הבא ל-NiceAlert Bot!\n\nקבל התראות פיקוד העורף לפי העיר שתבחר — עם הצליל שלך.\n\n⚠️ טלגרם עשוי לעלות 4.60 ש"ח בחנות האפליקציות.\n\nהשהייה ממוצעת מרגע האזעקה: ~5 שניות.',
    en: '🚨 Welcome to NiceAlert Bot!\n\nReceive Pikud HaOref alerts for your chosen city — with your custom sound.\n\n⚠️ Telegram may cost ~$1.20 on the App Store.\n\nAverage delay from alert issuance: ~5 seconds.',
  },
  promptCity: {
    he: '📍 הקלד את שם העיר שלך:',
    en: '📍 Type your city name:',
  },
  allIsrael: {
    he: '🇮🇱 כל הארץ',
    en: '🇮🇱 All Israel',
  },
  minChars: {
    he: '⚠️ הקלד לפחות 2 תווים.',
    en: '⚠️ Type at least 2 characters.',
  },
  noResults: {
    he: (q: string) => `❌ לא נמצאו תוצאות עבור "${q}". נסה שוב:`,
    en: (q: string) => `❌ No results for "${q}". Try again:`,
  },
  citySaved: {
    he: (city: string) => `✅ מיקום נשמר: ${city}`,
    en: (city: string) => `✅ Location saved: ${city}`,
  },
  allIsraelSaved: {
    he: '✅ נרשמת לכל הארץ 🇮🇱',
    en: '✅ Subscribed to all of Israel 🇮🇱',
  },
  soundInstructions: {
    he: '🎵 כיצד להגדיר צליל מותאם אישית:\n\n1. לחץ על שם הצ\'אט הזה בחלק העליון\n2. בחר "התראות"\n3. לחץ על "צליל"\n4. בחר צליל מהרשימה, או לחץ + להעלאת קובץ משלך (עד 300KB — MP3, OGG, AAC)\n\n✅ הצליל ישמע בכל התראה — גם כשהמסך נעול!',
    en: '🎵 How to set a custom notification sound:\n\n1. Tap this chat\'s name at the top\n2. Select "Notifications"\n3. Tap "Sound"\n4. Pick from the list, or tap + to upload your own file (up to 300KB — MP3, OGG, AAC)\n\n✅ The sound will play on every alert — even when your screen is locked!',
  },
  soundDoneBtn: {
    he: '✅ הבנתי',
    en: '✅ Got it',
  },
  setupComplete: {
    he: (city: string) => `🎉 הכל מוכן!\n\n📍 מיקום: ${city}\n🔔 סטטוס: פעיל\n⚠️ השהייה ממוצעת: ~5 שניות\n\n/help לרשימת כל הפקודות`,
    en: (city: string) => `🎉 All set!\n\n📍 Location: ${city}\n🔔 Status: Active\n⚠️ Avg delay: ~5 seconds\n\n/help to see all commands`,
  },
  stopConfirm: {
    he: '⏸ ההתראות הושהו. /resume כדי לחזור.',
    en: '⏸ Alerts paused. /resume to resume.',
  },
  resumeConfirm: {
    he: (city: string) => `▶️ ההתראות חזרו! מיקום: ${city}`,
    en: (city: string) => `▶️ Alerts resumed! Location: ${city}`,
  },
  notRegistered: {
    he: 'עדיין לא נרשמת. לחץ /start כדי להתחיל.',
    en: 'You are not registered yet. Tap /start to begin.',
  },
  testAlert: {
    he: '🔔 התראת בדיקה נשלחה!',
    en: '🔔 Test alert sent!',
  },
  testNoCity: {
    he: 'עדיין לא בחרת עיר. לחץ /start כדי להתחיל.',
    en: 'You haven\'t chosen a city yet. Tap /start to begin.',
  },
  langSelect: {
    he: 'בחר שפה:',
    en: 'Choose language:',
  },
  langChanged: {
    he: '✅ השפה שונתה לעברית.',
    en: '✅ Language changed to English.',
  },
  unknown: {
    he: 'לא הבנתי. /help לרשימת הפקודות.',
    en: 'I didn\'t understand. /help for commands.',
  },
  help: {
    he: `📋 <b>רשימת פקודות:</b>

/start — התחלה + רישום
/location — שינוי עיר
/mystatus — הצגת מצב נוכחי
/sound — הגדרת צליל התראה
/language — שינוי שפה
/test — שליחת התראת בדיקה
/stop — השהיית התראות
/resume — חידוש התראות
/help — תפריט עזרה`,
    en: `📋 <b>Command list:</b>

/start — Start + register
/location — Change city
/mystatus — View current status
/sound — Set alert sound
/language — Change language
/test — Send test alert
/stop — Pause alerts
/resume — Resume alerts
/help — Help menu`,
  },
  statusMsg: {
    he: (city: string, active: boolean, date: string) =>
      `📊 <b>הסטטוס שלך:</b>\n\n📍 מיקום: ${city}\n🔔 סטטוס: ${active ? 'פעיל' : 'מושהה'}\n📅 הצטרפת: ${date}`,
    en: (city: string, active: boolean, date: string) =>
      `📊 <b>Your status:</b>\n\n📍 Location: ${city}\n🔔 Status: ${active ? 'Active' : 'Paused'}\n📅 Joined: ${date}`,
  },
} as const;

export function t(key: keyof typeof strings, lang: Lang): any {
  return strings[key][lang];
}

export function formatAlertMessage(title: string, areas: string[], time: string, lang: Lang): string {
  const areaList = areas.slice(0, 20).join(', ');
  if (lang === 'he') {
    return `🚨 <b>${title}</b>\n\n📍 <b>אזורים מושפעים:</b>\n${areaList}\n\n🕑 ${time}\n⚠️ השהייה ממוצעת: ~5 שניות`;
  }
  return `🚨 <b>${title}</b>\n\n📍 <b>Affected areas:</b>\n${areaList}\n\n🕑 ${time}\n⚠️ Avg delay: ~5 seconds`;
}
