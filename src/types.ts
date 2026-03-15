export type Lang = 'he' | 'en';

export interface Subscriber {
  id: string;
  chat_id: number;
  cities: string[];
  all_israel: boolean;
  lang: Lang;
  active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface AlertLog {
  id: string;
  alert_id: string;
  title_he: string;
  title_en: string;
  areas: string[];
  detected_at: Date;
  sent_count: number;
}

export interface OrefAlert {
  id: string;
  cat: string;
  title: string;
  data: string[];
  desc: string;
}

export interface OrefHistoryEntry {
  data: string;
  date: string;
  time: string;
  alertDate: string;
  category: number;
  category_desc: string;
  rid: number;
}

export interface CityOption {
  label: string;
  value: string;
}

export interface SearchState {
  awaitingSearch: boolean;
  context: 'setup' | 'update';
}

export interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
  callback_query?: TelegramCallbackQuery;
}

export interface TelegramMessage {
  message_id: number;
  from?: TelegramUser;
  chat: TelegramChat;
  date: number;
  text?: string;
}

export interface TelegramUser {
  id: number;
  is_bot: boolean;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

export interface TelegramChat {
  id: number;
  type: string;
  first_name?: string;
  last_name?: string;
  username?: string;
}

export interface TelegramCallbackQuery {
  id: string;
  from: TelegramUser;
  message?: TelegramMessage;
  data?: string;
}

export interface InlineKeyboardButton {
  text: string;
  callback_data?: string;
}

export interface InlineKeyboardMarkup {
  inline_keyboard: InlineKeyboardButton[][];
}
