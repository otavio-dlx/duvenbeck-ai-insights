-- SQL dump generated from server/db.ts
-- Includes CREATE statements for `tags` and `manual_order` tables
-- Date: 2025-10-24

BEGIN;

-- Drop existing objects if present (safe to run repeatedly)
DROP INDEX IF EXISTS tags_idea_tag_unique_idx;
DROP INDEX IF EXISTS tags_idea_tag_unique_ci_idx;
DROP TABLE IF EXISTS manual_order;
DROP TABLE IF EXISTS tags;

-- tags table
CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  idea_text TEXT NOT NULL,
  tag_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Ensure case-insensitive uniqueness on (idea_text, tag_text)
-- The code drops old index `tags_idea_tag_unique_idx` if present, then creates a CI unique index
CREATE UNIQUE INDEX IF NOT EXISTS tags_idea_tag_unique_ci_idx
  ON tags (idea_text, lower(tag_text));

-- manual_order table
CREATE TABLE manual_order (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL DEFAULT 'default',
  department TEXT,
  idea_ids TEXT[] NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, department)
);

COMMIT;

-- Notes:
-- 1) This dump reflects the table creation SQL used by the project code (server/db.ts).
-- 2) If you need to also move data, export rows from the source DB (e.g. using psql \copy or pg_dump) and import into the target after running this script.
-- 3) Example import using psql:
--    psql "postgresql://user:password@host:port/dbname" -f server/db_dump.sql
-- 4) To dump data to SQL INSERTs you can run:
--    pg_dump --data-only --inserts --table=tags --table=manual_order "postgresql://..." > data_inserts.sql
