// Simple test script to verify Qdrant connection
import { ragService } from "@/services/ragService";

export const testRAGConnection = async () => {
  try {
    console.log("Testing RAG service connection...");
    await ragService.initializeCollection();
    console.log("✅ RAG service initialized successfully!");

    // Test a simple search
    const results = await ragService.searchSimilar("automation", 3);
    console.log("✅ Search test successful, found", results.length, "results");

    return true;
  } catch (error) {
    console.error("❌ RAG service test failed:", error);
    return false;
  }
};
