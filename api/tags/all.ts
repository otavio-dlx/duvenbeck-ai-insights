import type { VercelRequest, VercelResponse } from "@vercel/node";
import { dbEnabled, pool } from "../../server/db.js";

export default async function handler(
  _req: VercelRequest,
  res: VercelResponse
) {
  try {
    if (!dbEnabled)
      return res.status(503).json({ error: "Database not configured" });

    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT idea_text, tag_text as text, created_at FROM tags ORDER BY idea_text, created_at DESC`
      );
      const map: Record<
        string,
        Array<{ text: string; created_at: string }>
      > = {};
      type Row = { idea_text: string; text: string; created_at: string };
      for (const row of result.rows as Array<Row>) {
        if (!map[row.idea_text]) map[row.idea_text] = [];
        map[row.idea_text].push({ text: row.text, created_at: row.created_at });
      }
      return res.json({ tagsByIdea: map });
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("api/tags/all error:", err);
    return res.status(500).json({ error: "Failed to fetch all tags" });
  }
}
