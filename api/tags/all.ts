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
      // Log raw result shape for debugging on serverless (Vercel)
      try {
        console.info("api/tags/all - raw query result:", JSON.stringify(result));
      } catch (e) {
        // ignore JSON stringify errors
      }

      // Normalize rows for different DB client shapes:
      // - pg: { rows: [...] }
      // - some serverless adapters: returns Array of rows directly
      // - other adapters: may return { data: [...] } or object-like rows
      let rows: Array<Record<string, any>> = [];
      if (Array.isArray(result)) {
        rows = result as any;
      } else if (result && Array.isArray((result as any).rows)) {
        rows = (result as any).rows;
      } else if (result && Array.isArray((result as any).data)) {
        rows = (result as any).data;
      } else if (result && (result as any).rows && typeof (result as any).rows === "object") {
        // e.g. rows returned as an object map — convert to array
        rows = Object.values((result as any).rows) as any;
      } else {
        console.error("api/tags/all - unexpected query result shape", result);
        return res.status(500).json({ error: "Unexpected DB response shape" });
      }

      const map: Record<string, Array<{ text: string; created_at: string }>> = {};
      for (const r of rows) {
        const idea_text = String(r.idea_text ?? r.idea ?? r.ideaText ?? "");
        const text = String(r.text ?? r.tag_text ?? r.tag ?? "");
        const created_at = String(r.created_at ?? r.createdAt ?? "");
        if (!map[idea_text]) map[idea_text] = [];
        map[idea_text].push({ text, created_at });
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
