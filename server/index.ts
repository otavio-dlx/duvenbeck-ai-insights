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
    const { query, limit = 10 } = req.body;

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
    const embeddingModel = genAI.getGenerativeModel({
      model: "text-embedding-004",
    });

    // Generate embedding for the query
    console.log(`Generating embedding for query: "${query}"`);
    const embeddingResult = await embeddingModel.embedContent(query);
    const queryEmbedding = embeddingResult.embedding.values;

    // Search in Qdrant
    console.log("Searching in Qdrant...");
    const searchResponse = await qdrantClient.search(
      "duvenbeck_workshop_ideas",
      {
        vector: queryEmbedding,
        limit,
        with_payload: true,
      }
    );

    console.log(`Found ${searchResponse.length} results from Qdrant`);

    // Format results
    const results = searchResponse.map((point: any) => ({
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
