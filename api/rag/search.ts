import { GoogleGenerativeAI } from "@google/generative-ai";
import { QdrantClient } from "@qdrant/js-client-rest";
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

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

    // Generate embedding for the query
    const model = genAI.getGenerativeModel({
      model: "text-embedding-004",
    });
    const result = await model.embedContent(query);
    const queryEmbedding = result.embedding.values;

    // Search in Qdrant
    const searchResults = await qdrantClient.search(
      "duvenbeck_workshop_ideas",
      {
        vector: queryEmbedding,
        limit,
      }
    );

    // Format results
    const formattedResults = searchResults.map((item) => ({
      id: item.id.toString(),
      score: item.score || 0,
      payload: {
        text: (item.payload?.text as string) || "",
        department: (item.payload?.department as string) || "",
        ideaKey: (item.payload?.ideaKey as string) || "",
        owner: (item.payload?.owner as string) || "",
        priority: (item.payload?.priority as string) || "",
        finalPrio: (item.payload?.finalPrio as string | number) || "",
        type: (item.payload?.type as "idea" | "problem" | "solution") || "idea",
      },
    }));

    return res.status(200).json({ results: formattedResults });
  } catch (error) {
    console.error("Error in RAG search API:", error);
    return res.status(500).json({
      error: "Failed to search",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
