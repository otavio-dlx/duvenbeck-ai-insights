import type { VercelRequest, VercelResponse } from "@vercel/node";
import { pool, dbEnabled } from "../server/db.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const method = req.method || "GET";

  try {
  if (!dbEnabled) return res.status(503).json({ error: "Database not configured" });

  if (method === "GET") {
      const ideaText = String(req.query.ideaText || "");
      const client = await pool.connect();
      try {
        const result = await client.query(
          `SELECT tag_text as text FROM tags WHERE idea_text = $1 ORDER BY created_at DESC`,
          [ideaText]
        );
        return res.json({ tags: result.rows.map((r) => ({ text: r.text })) });
      } finally {
        client.release();
      }
    }

    if (method === "POST") {
      const { ideaText, tagText } = req.body || {};
      if (!ideaText || !tagText)
        return res
          .status(400)
          .json({ error: "ideaText and tagText are required" });

      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        const normalizedTag = String(tagText).trim();

        const countRes = await client.query(
          `SELECT COUNT(*)::int AS cnt FROM tags WHERE idea_text = $1`,
          [ideaText]
        );
        const cnt = Number.parseInt(countRes.rows[0].cnt, 10);
        if (cnt >= 5) {
          await client.query("ROLLBACK");
          return res.status(400).json({ error: "Max 5 tags allowed per idea" });
        }

        try {
          await client.query(
            `INSERT INTO tags (idea_text, tag_text) VALUES ($1, $2)`,
            [ideaText, normalizedTag]
          );
        } catch (err) {
          // Unique violation or other insert error
          console.error("insert tag error:", err);
          await client.query("ROLLBACK");
          return res.status(409).json({ error: "Tag already exists for idea" });
        }

        await client.query("COMMIT");
        return res.json({ ok: true });
      } finally {
        client.release();
      }
    }

    if (method === "PUT") {
      const { ideaText, oldTagText, newTagText } = req.body || {};
      if (!ideaText || !oldTagText || !newTagText)
        return res
          .status(400)
          .json({ error: "ideaText, oldTagText and newTagText are required" });

      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        const normalizedNew = String(newTagText).trim();
        const normalizedOld = String(oldTagText).trim();

        const dup = await client.query(
          `SELECT 1 FROM tags WHERE idea_text = $1 AND lower(tag_text) = lower($2)`,
          [ideaText, normalizedNew]
        );
        if ((dup?.rowCount ?? 0) > 0) {
          await client.query("ROLLBACK");
          return res
            .status(409)
            .json({ error: "New tag text already exists for idea" });
        }

        await client.query(
          `UPDATE tags SET tag_text = $3 WHERE idea_text = $1 AND tag_text = $2`,
          [ideaText, normalizedOld, normalizedNew]
        );
        await client.query("COMMIT");
        return res.json({ ok: true });
      } finally {
        client.release();
      }
    }

    if (method === "DELETE") {
      const { ideaText, tagText } = req.body || {};
      if (!ideaText || !tagText)
        return res
          .status(400)
          .json({ error: "ideaText and tagText are required" });

      const client = await pool.connect();
      try {
        await client.query(
          `DELETE FROM tags WHERE idea_text = $1 AND tag_text = $2`,
          [ideaText, tagText]
        );
        return res.json({ ok: true });
      } finally {
        client.release();
      }
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error("api/tags error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
