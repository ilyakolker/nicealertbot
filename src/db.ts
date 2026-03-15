import postgres from 'postgres';
import { Subscriber, Lang } from './types';

let sql: ReturnType<typeof postgres>;

export function initDb() {
  sql = postgres(process.env.DATABASE_URL!, { ssl: 'require' });
  console.log('✅ Database connected');
}

export async function runMigrations() {
  await sql`
    CREATE TABLE IF NOT EXISTS subscribers (
      id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      chat_id      BIGINT NOT NULL UNIQUE,
      city         TEXT,
      all_israel   BOOLEAN DEFAULT false,
      lang         TEXT DEFAULT 'he',
      active       BOOLEAN DEFAULT true,
      created_at   TIMESTAMPTZ DEFAULT NOW(),
      updated_at   TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS idx_sub_active  ON subscribers(active)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_sub_chat_id ON subscribers(chat_id)`;

  // Migrate from single city to cities array
  await sql`ALTER TABLE subscribers ADD COLUMN IF NOT EXISTS cities TEXT[] DEFAULT '{}'`;
  await sql`UPDATE subscribers SET cities = ARRAY[city] WHERE city IS NOT NULL AND cities = '{}'`;
  await sql`ALTER TABLE subscribers DROP COLUMN IF EXISTS city`;
  await sql`DROP INDEX IF EXISTS idx_sub_city`;
  await sql`CREATE INDEX IF NOT EXISTS idx_sub_cities ON subscribers USING GIN(cities)`;

  await sql`
    CREATE TABLE IF NOT EXISTS alert_log (
      id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      alert_id     TEXT NOT NULL UNIQUE,
      title_he     TEXT,
      title_en     TEXT,
      areas        TEXT[],
      detected_at  TIMESTAMPTZ DEFAULT NOW(),
      sent_count   INTEGER DEFAULT 0
    )
  `;
  console.log('✅ Migrations complete');
}

export async function upsertSubscriber(chatId: number, lang: Lang): Promise<void> {
  await sql`
    INSERT INTO subscribers (chat_id, lang, active)
    VALUES (${chatId}, ${lang}, true)
    ON CONFLICT (chat_id)
    DO UPDATE SET active = true, lang = ${lang}, updated_at = NOW()
  `;
}

export async function getSubscriber(chatId: number): Promise<Subscriber | null> {
  const rows = await sql<Subscriber[]>`
    SELECT * FROM subscribers WHERE chat_id = ${chatId} LIMIT 1
  `;
  return rows.length > 0 ? rows[0] : null;
}

export async function addCity(chatId: number, city: string): Promise<void> {
  await sql`
    UPDATE subscribers
    SET cities = array_append(cities, ${city}),
        all_israel = false,
        updated_at = NOW()
    WHERE chat_id = ${chatId}
    AND NOT (${city} = ANY(cities))
  `;
}

export async function removeCity(chatId: number, city: string): Promise<void> {
  await sql`
    UPDATE subscribers
    SET cities = array_remove(cities, ${city}),
        updated_at = NOW()
    WHERE chat_id = ${chatId}
  `;
}

export async function setAllIsrael(chatId: number): Promise<void> {
  await sql`
    UPDATE subscribers
    SET all_israel = true, cities = '{}'::text[], updated_at = NOW()
    WHERE chat_id = ${chatId}
  `;
}

export async function updateLang(chatId: number, lang: Lang): Promise<void> {
  await sql`
    UPDATE subscribers SET lang = ${lang}, updated_at = NOW()
    WHERE chat_id = ${chatId}
  `;
}

export async function setSubscriberActive(chatId: number, active: boolean): Promise<void> {
  await sql`
    UPDATE subscribers SET active = ${active}, updated_at = NOW()
    WHERE chat_id = ${chatId}
  `;
}

export async function getMatchingSubscribers(areas: string[]): Promise<{ chat_id: number; lang: Lang }[]> {
  const rows = await sql<{ chat_id: number; lang: string }[]>`
    SELECT chat_id, lang FROM subscribers
    WHERE active = true
    AND (cities && ${sql.array(areas)}::text[] OR all_israel = true)
  `;
  return rows.map(r => ({ chat_id: Number(r.chat_id), lang: r.lang as Lang }));
}

export async function getActiveSubscriberCount(): Promise<number> {
  const rows = await sql<{ count: string }[]>`
    SELECT COUNT(*) as count FROM subscribers WHERE active = true
  `;
  return parseInt(rows[0].count, 10);
}

export async function logAlert(
  alertId: string, titleHe: string, titleEn: string, areas: string[], sentCount: number
): Promise<void> {
  await sql`
    INSERT INTO alert_log (alert_id, title_he, title_en, areas, sent_count)
    VALUES (${alertId}, ${titleHe}, ${titleEn}, ${sql.array(areas)}, ${sentCount})
    ON CONFLICT (alert_id) DO NOTHING
  `;
}

export async function updateAlertSentCount(alertId: string, count: number): Promise<void> {
  await sql`
    UPDATE alert_log SET sent_count = ${count} WHERE alert_id = ${alertId}
  `;
}

export async function getRecentAlerts(limit: number = 10) {
  return await sql`
    SELECT * FROM alert_log ORDER BY detected_at DESC LIMIT ${limit}
  `;
}
