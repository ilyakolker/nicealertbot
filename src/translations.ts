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
    he: '🚨 ברוך הבא ל-NiceAlert Bot!\n\nקבל התראות פיקוד העורף לפי העיר שתבחר — עם הצליל שלך.\n\nהשהייה ממוצעת מרגע האזעקה: ~5 שניות.',
    en: '🚨 Welcome to NiceAlert Bot!\n\nReceive Pikud HaOref alerts for your chosen city — with your custom sound.\n\nAverage delay from alert issuance: ~5 seconds.',
  },
  promptCity: {
    he: '📍 הקלד את שם העיר שלך:\n\nאו כתוב "כל הארץ" לקבלת כל ההתראות.',
    en: '📍 Type your city name:\n\nOr type "all" to receive all alerts.',
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
  cityAdded: {
    he: (city: string) => `✅ עיר נוספה: ${city}`,
    en: (city: string) => `✅ City added: ${city}`,
  },
  cityRemoved: {
    he: (city: string) => `✅ עיר הוסרה: ${city}`,
    en: (city: string) => `✅ City removed: ${city}`,
  },
  currentCities: {
    he: '📍 הערים שלך:',
    en: '📍 Your cities:',
  },
  noCities: {
    he: 'לא נבחרו ערים',
    en: 'No cities selected',
  },
  addMore: {
    he: '➕ הוסף עיר',
    en: '➕ Add city',
  },
  done: {
    he: '✅ סיימתי',
    en: '✅ Done',
  },
  allIsraelSaved: {
    he: '✅ נרשמת לכל הארץ 🇮🇱',
    en: '✅ Subscribed to all of Israel 🇮🇱',
  },
  soundInstructions: {
    he: '🎵 כיצד להגדיר צליל מותאם אישית:\n\n1. לחץ על שם הבוט בחלק העליון\n2. לחץ על "השתק"\n3. בחר "התאמה אישית"\n4. לחץ על "צליל"\n5. בחר צליל מהרשימה, או לחץ + להעלאת קובץ משלך (עד 300KB — MP3, OGG, AAC)\n\n✅ הצליל ישמע בכל התראה — גם כשהמסך נעול!',
    en: '🎵 How to set a custom notification sound:\n\n1. Tap the bot\'s name at the top\n2. Tap "Mute"\n3. Select "Customize"\n4. Tap "Sound"\n5. Pick from the list, or tap + to upload your own file (up to 300KB — MP3, OGG, AAC)\n\n✅ The sound will play on every alert — even when your screen is locked!',
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
/location — ניהול ערים
/mystatus — הצגת מצב נוכחי
/sound — הגדרת צליל התראה
/language — שינוי שפה
/test — שליחת התראת בדיקה
/stop — השהיית התראות
/resume — חידוש התראות
/help — תפריט עזרה`,
    en: `📋 <b>Command list:</b>

/start — Start + register
/location — Manage cities
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

export function formatAlertMessage(title: string, areas: string[], time: string, lang: Lang, userCities?: string[]): string {
  let matchedAreas: string[] = [];
  let otherAreas: string[] = [];

  if (userCities && userCities.length > 0) {
    const userSet = new Set(userCities);
    for (const area of areas) {
      if (userSet.has(area)) {
        matchedAreas.push(area);
      } else {
        otherAreas.push(area);
      }
    }
  } else {
    otherAreas = areas;
  }

  const parts: string[] = [];
  if (matchedAreas.length > 0) {
    parts.push(`⚠️ <b>${matchedAreas.join(', ')}</b>`);
  }
  const othersToShow = otherAreas.slice(0, 15);
  if (othersToShow.length > 0) {
    parts.push(othersToShow.join(', '));
  }
  if (otherAreas.length > 15) {
    const more = otherAreas.length - 15;
    parts.push(lang === 'he' ? `ועוד ${more} אזורים...` : `and ${more} more areas...`);
  }

  const areaList = parts.join('\n');
  if (lang === 'he') {
    return `🚨 <b>${title}</b>\n\n📍 <b>אזורים מושפעים:</b>\n${areaList}\n\n🕑 ${time}`;
  }
  return `🚨 <b>${title}</b>\n\n📍 <b>Affected areas:</b>\n${areaList}\n\n🕑 ${time}`;
}
