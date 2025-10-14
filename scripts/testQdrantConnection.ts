import { QdrantClient } from "@qdrant/js-client-rest";
import * as dotenv from "dotenv";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, "../.env") });

async function testQdrantConnection() {
  console.log("🔍 Testing Qdrant Connection...\n");

  const qdrantUrl = process.env.VITE_QDRANT_URL;
  const qdrantApiKey = process.env.VITE_QDRANT_API_KEY;

  if (!qdrantUrl || !qdrantApiKey) {
    console.error("❌ Missing Qdrant credentials in .env file");
    console.log("   Required: VITE_QDRANT_URL and VITE_QDRANT_API_KEY");
    process.exit(1);
  }

  console.log("✅ Credentials found");
  console.log(`   URL: ${qdrantUrl}`);
  console.log(`   API Key: ${qdrantApiKey.substring(0, 20)}...`);

  try {
    const client = new QdrantClient({
      url: qdrantUrl,
      apiKey: qdrantApiKey,
    });

    console.log("\n📡 Connecting to Qdrant...");

    const collectionName = "duvenbeck_workshop_ideas";
    const collection = await client.getCollection(collectionName);

    console.log("\n✅ Connection successful!");
    console.log(`\n📊 Collection Info:`);
    console.log(`   Name: ${collectionName}`);
    console.log(`   Points: ${collection.points_count}`);
    if (collection.config.params.vectors) {
      console.log(`   Vector Size: ${collection.config.params.vectors.size}`);
      console.log(`   Distance: ${collection.config.params.vectors.distance}`);
    }

    // Try a simple search
    console.log("\n🔎 Testing search functionality...");
    const searchResults = await client.search(collectionName, {
      vector: new Array(768).fill(0.1),
      limit: 3,
    });

    console.log(`   Found ${searchResults.length} results`);
    if (searchResults.length > 0) {
      console.log("\n   Sample result:");
      const firstResult = searchResults[0];
      console.log(`   - ID: ${firstResult.id}`);
      console.log(`   - Score: ${firstResult.score}`);
      console.log(`   - Department: ${firstResult.payload?.department}`);
      console.log(`   - Type: ${firstResult.payload?.type}`);
    }

    console.log("\n✅ All tests passed!");
    console.log("🎉 Your Qdrant vector database is ready to use!\n");
  } catch (error) {
    console.error("\n❌ Connection failed:", error);
    console.log("\n💡 Troubleshooting:");
    console.log("   1. Check if the URL is correct");
    console.log("   2. Verify the API key is valid");
    console.log(
      "   3. Ensure the collection exists (run: npm run upload-to-vector-db)"
    );
    console.log("   4. Check your network connection\n");
    process.exit(1);
  }
}

testQdrantConnection();
