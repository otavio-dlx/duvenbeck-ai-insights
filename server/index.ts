import { GoogleGenerativeAI } from "@google/generative-ai";
import { QdrantClient } from "@qdrant/js-client-rest";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";

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

app.listen(PORT, () => {
  console.log(`\n🚀 API Server running at http://localhost:${PORT}`);
  console.log(`📍 Endpoints:`);
  console.log(`   - POST http://localhost:${PORT}/api/rag/search`);
  console.log(`   - GET  http://localhost:${PORT}/api/health\n`);
});
