import { GoogleGenerativeAI } from "@google/generative-ai";
import { QdrantClient } from "@qdrant/js-client-rest";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { pool, ensureTagsTable } from "./db";

dotenv.config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// RAG Search endpoint
app.post("/api/rag/search", async (req, res) => {
  try {
    const { query, limit = 10, department = null, type = null } = req.body;

    console.log(`[API] Received request:`, { query, limit, department, type });

    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    const qdrantUrl = process.env.VITE_QDRANT_URL;
    const qdrantApiKey = process.env.VITE_QDRANT_API_KEY;
    const geminiApiKey = process.env.VITE_GEMINI_API_KEY;

    if (!qdrantUrl || !qdrantApiKey || !geminiApiKey) {
      console.error("Missing environment variables");
      return res.status(500).json({ error: "Server configuration error" });
    }

    // Initialize clients
    const qdrantClient = new QdrantClient({
      url: qdrantUrl,
      apiKey: qdrantApiKey,
    });

    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const COLLECTION_NAME = "duvenbeck_workshop_ideas";

    // If we have explicit filters (department and/or type), we should return ALL matching items
    // not just semantically similar ones
    const hasExplicitFilters = !!department || !!type;

    console.log(
      `[API] hasExplicitFilters = ${hasExplicitFilters} (department="${department}", type="${type}")`
    );

    // Build filter conditions
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const must: any[] = [];

    if (department) {
      must.push({
        key: "department",
        match: { value: department },
      });
    }

    if (type) {
      must.push({
        key: "type",
        match: { value: type },
      });
    }

    let searchResults;

    // When we have explicit filters (department/type), use search API with filters and high limit
    // Scroll API requires indexes which we don't have set up
    if (hasExplicitFilters) {
      console.log(
        `Using filtered search for department=${department}, type=${type}`
      );
      console.log(`Filter conditions:`, JSON.stringify(must, null, 2));

      const embeddingModel = genAI.getGenerativeModel({
        model: "text-embedding-004",
      });

      // Generate embedding for the query
      console.log(`Generating embedding for query: "${query}"`);
      const embeddingResult = await embeddingModel.embedContent(query);
      const queryEmbedding = embeddingResult.embedding.values;

      // Use search with filters and high limit to get ALL filtered items
      console.log("Searching in Qdrant with filters...");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const searchParams: any = {
        vector: queryEmbedding,
        limit: 200, // High limit to get all items from a department
        with_payload: true,
        filter: { must },
      };

      searchResults = await qdrantClient.search(COLLECTION_NAME, searchParams);

      console.log(`Filtered search returned ${searchResults.length} items`);

      // Debug: log what departments we actually got
      const depts = [
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...new Set(searchResults.map((r: any) => r.payload?.department)),
      ];
      console.log(`Departments in filtered results:`, depts);
    } else {
      // No explicit filters - use semantic search
      console.log(`Using semantic search with query: "${query}"`);

      const embeddingModel = genAI.getGenerativeModel({
        model: "text-embedding-004",
      });

      // Generate embedding for the query
      console.log(`Generating embedding for query: "${query}"`);
      const embeddingResult = await embeddingModel.embedContent(query);
      const queryEmbedding = embeddingResult.embedding.values;

      // Search in Qdrant
      console.log("Searching in Qdrant...");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const searchParams: any = {
        vector: queryEmbedding,
        limit: limit,
        with_payload: true,
      };

      if (must.length > 0) {
        searchParams.filter = { must };
      }

      searchResults = await qdrantClient.search(COLLECTION_NAME, searchParams);
    }

    console.log(`Found ${searchResults.length} results from Qdrant`);

    // Format results
    const results = searchResults.map((point) => ({
      id: point.id,
      score: point.score,
      payload: point.payload,
    }));

    res.json({ results });
  } catch (error) {
    console.error("Error in RAG search:", error);
    res.status(500).json({
      error: "Search failed",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Tags CRUD endpoints
// GET /api/tags?ideaText=...
app.get("/api/tags", async (req, res) => {
  const ideaText = String(req.query.ideaText || "");
  try {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT tag_text as text FROM tags WHERE idea_text = $1 ORDER BY created_at DESC`,
        [ideaText]
      );
      res.json({ tags: result.rows.map((r) => ({ text: r.text })) });
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("Error fetching tags:", err);
    res.status(500).json({ error: "Failed to fetch tags" });
  }
});

// GET /api/tags/all - return all tags grouped by idea
app.get("/api/tags/all", async (req, res) => {
  try {
    const client = await pool.connect();
    try {
      const result = await client.query(`SELECT idea_text, tag_text as text, created_at FROM tags ORDER BY idea_text, created_at DESC`);
      const map: Record<string, Array<{ text: string; created_at: string }>> = {};
      result.rows.forEach((r) => {
        if (!map[r.idea_text]) map[r.idea_text] = [];
        map[r.idea_text].push({ text: r.text, created_at: r.created_at });
      });
      res.json({ tagsByIdea: map });
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("Error fetching all tags:", err);
    res.status(500).json({ error: "Failed to fetch all tags" });
  }
});

// POST /api/tags { ideaText, tagText }
app.post("/api/tags", async (req, res) => {
  const { ideaText, tagText } = req.body;
  if (!ideaText || !tagText) return res.status(400).json({ error: "ideaText and tagText are required" });
  try {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      // Normalize tag text
      const normalizedTag = String(tagText).trim();

      // Check current tag count for the idea
      const countRes = await client.query(`SELECT COUNT(*)::int AS cnt FROM tags WHERE idea_text = $1`, [ideaText]);
      const cnt = parseInt(countRes.rows[0].cnt, 10);
      if (cnt >= 5) {
        await client.query("ROLLBACK");
        return res.status(400).json({ error: "Max 5 tags allowed per idea" });
      }
      // Insert, rely on unique index to prevent duplicates
      try {
        await client.query(`INSERT INTO tags (idea_text, tag_text) VALUES ($1, $2)`, [ideaText, normalizedTag]);
      } catch (err) {
        // Unique violation
        await client.query("ROLLBACK");
        return res.status(409).json({ error: "Tag already exists for idea" });
      }
      await client.query("COMMIT");
      res.json({ ok: true });
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("Error inserting tag:", err);
    res.status(500).json({ error: "Failed to insert tag" });
  }
});

// PUT /api/tags { ideaText, oldTagText, newTagText }
app.put("/api/tags", async (req, res) => {
  const { ideaText, oldTagText, newTagText } = req.body;
  if (!ideaText || !oldTagText || !newTagText) return res.status(400).json({ error: "ideaText, oldTagText and newTagText are required" });
  try {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      // Normalize tag texts
      const normalizedNew = String(newTagText).trim();
      const normalizedOld = String(oldTagText).trim();

      // If newTagText already exists (case-insensitive), it's a conflict
      const dup = await client.query(`SELECT 1 FROM tags WHERE idea_text = $1 AND lower(tag_text) = lower($2)`, [ideaText, normalizedNew]);
      if ((dup?.rowCount ?? 0) > 0) {
        await client.query("ROLLBACK");
        return res.status(409).json({ error: "New tag text already exists for idea" });
      }
      await client.query(`UPDATE tags SET tag_text = $3 WHERE idea_text = $1 AND tag_text = $2`, [ideaText, normalizedOld, normalizedNew]);
      await client.query("COMMIT");
      res.json({ ok: true });
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("Error updating tag:", err);
    res.status(500).json({ error: "Failed to update tag" });
  }
});

// DELETE /api/tags { ideaText, tagText }
app.delete("/api/tags", async (req, res) => {
  const { ideaText, tagText } = req.body;
  if (!ideaText || !tagText) return res.status(400).json({ error: "ideaText and tagText are required" });
  try {
    const client = await pool.connect();
    try {
      await client.query(
        `DELETE FROM tags WHERE idea_text = $1 AND tag_text = $2`,
        [ideaText, tagText]
      );
      res.json({ ok: true });
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("Error deleting tag:", err);
    res.status(500).json({ error: "Failed to delete tag" });
  }
});

app.listen(PORT, () => {
  console.log(`\n🚀 API Server running at http://localhost:${PORT}`);
  console.log(`📍 Endpoints:`);
  console.log(`   - POST http://localhost:${PORT}/api/rag/search`);
  console.log(`   - GET  http://localhost:${PORT}/api/health\n`);
  // Ensure tags table exists at startup
  ensureTagsTable()
    .then(() => console.log("Tags table ensured"))
    .catch((_err) => console.error("Failed to ensure tags table:", _err)); // eslint-disable-line @typescript-eslint/no-unused-vars
});
