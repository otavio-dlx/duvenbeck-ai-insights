import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

dotenv.config();

const connectionString = process.env.DATABASE_URL || process.env.VITE_DATABASE_URL;

// Do NOT throw at import time — on serverless platforms a missing env var at build/import
// time would make every function fail with a confusing error. Instead, export a
// lightweight `pool` replacement that surfaces a clear error when DB operations are attempted.
let _pool: Pool | null = null;
let _db: ReturnType<typeof drizzle> | null = null;

if (connectionString) {
  _pool = new Pool({ connectionString });
  _db = drizzle(_pool);
} else {
  console.warn("DATABASE_URL / VITE_DATABASE_URL is not set — DB disabled. DB operations will error until configured.");
}

// Export `pool` and `db` but keep types compatible. If DB is not configured, `pool.connect()` will
// throw a clear runtime error instead of failing at import.
const missingDbError = new Error("DATABASE_URL (or VITE_DATABASE_URL) is not set in environment");

export const pool: Pool =
  (_pool as Pool) ||
  // Minimal stand-in that throws on connect/query to keep existing call-sites working.
  ({
    connect: async () => {
      throw missingDbError;
    },
    // Some call-sites use client.query directly on the pool, so provide a query function too.
    query: async () => {
      throw missingDbError;
    },
    // Provide a noop end to satisfy potential callers
    end: async () => {},
  } as unknown as Pool);

export const db = (_db as ReturnType<typeof drizzle>) || (null as unknown as ReturnType<typeof drizzle>);

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
