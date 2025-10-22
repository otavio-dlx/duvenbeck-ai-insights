import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

dotenv.config();

const connectionString =
  process.env.DATABASE_URL || process.env.VITE_DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set in environment");
}

export const pool = new Pool({ connectionString });
export const db = drizzle(pool);

// Ensure tags table exists
export async function ensureTagsTable() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS tags (
        id SERIAL PRIMARY KEY,
        idea_text TEXT NOT NULL,
        tag_text TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT now()
      );
    `);
    // Ensure case-insensitive uniqueness on (idea_text, tag_text) using lower()
    // Drop old index (if any) and create a CI unique index
    try {
      await client.query(`DROP INDEX IF EXISTS tags_idea_tag_unique_idx`);
    } catch (_err) {
      // eslint-disable-line @typescript-eslint/no-unused-vars
      // ignore
    }
    await client.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS tags_idea_tag_unique_ci_idx
        ON tags (idea_text, lower(tag_text));
    `);
  } finally {
    client.release();
  }
}

// Ensure manual_order table exists
export async function ensureManualOrderTable() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS manual_order (
        id SERIAL PRIMARY KEY,
        user_id TEXT NOT NULL DEFAULT 'default',
        department TEXT,
        idea_ids TEXT[] NOT NULL,
        created_at TIMESTAMPTZ DEFAULT now(),
        updated_at TIMESTAMPTZ DEFAULT now(),
        UNIQUE(user_id, department)
      );
    `);
  } finally {
    client.release();
  }
}
