import type { VercelRequest, VercelResponse } from "@vercel/node";
import { dbEnabled, pool } from "../server/db.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const method = req.method || "GET";
  try {
    if (!dbEnabled)
      return res.status(503).json({ error: "Database not configured" });

    if (method === "GET") {
      const department = String(req.query.department || "");
      const userId = String(req.query.userId || "default");
      if (!department)
        return res.status(400).json({ error: "department is required" });
      const client = await pool.connect();
      try {
        const result = await client.query(
          `SELECT idea_ids FROM manual_order WHERE user_id = $1 AND department = $2`,
          [userId, department]
        );
        if (result.rows.length === 0) return res.json({ ideaIds: [] });
        return res.json({ ideaIds: result.rows[0].idea_ids });
      } finally {
        client.release();
      }
    }

    if (method === "POST") {
      const { department, ideaIds } = req.body || {};
      const userId = req.body?.userId || "default";
      if (!department || !Array.isArray(ideaIds)) {
        return res
          .status(400)
          .json({ error: "department and ideaIds array are required" });
      }
      const client = await pool.connect();
      try {
        await client.query(
          `INSERT INTO manual_order (user_id, department, idea_ids, updated_at)
           VALUES ($1, $2, $3, now())
           ON CONFLICT (user_id, department)
           DO UPDATE SET idea_ids = $3, updated_at = now()`,
          [userId, department, ideaIds]
        );
        return res.json({ ok: true });
      } finally {
        client.release();
      }
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error("api/manual-order error:", err);
    return res.status(500).json({ error: "Failed to handle manual-order" });
  }
}
