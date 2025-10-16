import { QdrantClient } from "@qdrant/js-client-rest";
import dotenv from "dotenv";

dotenv.config();

const COLLECTION_NAME = "duvenbeck_workshop_ideas";

async function createIndexes() {
  try {
    const qdrantUrl = process.env.VITE_QDRANT_URL;
    const qdrantApiKey = process.env.VITE_QDRANT_API_KEY;

    if (!qdrantUrl || !qdrantApiKey) {
      throw new Error("Missing Qdrant credentials in environment variables");
    }

    console.log("Connecting to Qdrant...");
    const client = new QdrantClient({
      url: qdrantUrl,
      apiKey: qdrantApiKey,
    });

    console.log("\nCreating payload index for 'department' field...");
    await client.createPayloadIndex(COLLECTION_NAME, {
      field_name: "department",
      field_schema: "keyword",
    });
    console.log("✅ Created index for 'department'");

    console.log("\nCreating payload index for 'type' field...");
    await client.createPayloadIndex(COLLECTION_NAME, {
      field_name: "type",
      field_schema: "keyword",
    });
    console.log("✅ Created index for 'type'");

    console.log("\n✨ All indexes created successfully!");
    console.log("\nYou can now use filters on 'department' and 'type' fields.");
  } catch (error) {
    console.error("❌ Error creating indexes:", error);
    if (error instanceof Error) {
      console.error("Error details:", error.message);
    }
  }
}

createIndexes();
