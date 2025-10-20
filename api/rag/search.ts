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

    // When we have explicit filters (department/type), use scroll API to get ALL matching items
    // This ensures we get everything that matches the filter, not just semantically similar items
    if (hasExplicitFilters) {
      console.log(
        `Using filter-only search for department=${department}, type=${type}`
      );
      console.log(`Filter conditions:`, JSON.stringify(must, null, 2));

      const scrollResult = await qdrantClient.scroll(COLLECTION_NAME, {
        filter: must.length > 0 ? { must } : undefined,
        limit: 100, // Get up to 100 items
        with_vector: false, // We don't need the vectors back
        with_payload: true,
      });

      // Convert scroll results to search format (with dummy scores since we're not doing semantic search)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      searchResults = scrollResult.points.map((point: any) => ({
        id: point.id,
        score: 1, // Dummy score - all filtered items are equally relevant
        payload: point.payload,
      }));

      console.log(`Filter-only search returned ${searchResults.length} items`);

      // Debug: log what departments we actually got
      const depts = [
        ...new Set(searchResults.map((r) => r.payload?.department)),
      ];
      console.log(`Departments in scroll results:`, depts);
    } else {
      // No explicit filters - use semantic search
      console.log(`Using semantic search with query: "${query}"`);

      // Generate embedding for the query
      const embeddingResponse = await genAI
        .getGenerativeModel({ model: "text-embedding-004" })
        .embedContent(query);

      const queryEmbedding = embeddingResponse.embedding.values;

      // Search in Qdrant
      const searchParams: {
        vector: number[];
        limit: number;
        filter?: { must: unknown[] };
      } = {
        vector: queryEmbedding,
        limit: limit,
      };

      if (must.length > 0) {
        searchParams.filter = { must };
      }

      searchResults = await qdrantClient.search(COLLECTION_NAME, searchParams);
    }

    console.log(`Found ${searchResults.length} results from Qdrant`);

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
