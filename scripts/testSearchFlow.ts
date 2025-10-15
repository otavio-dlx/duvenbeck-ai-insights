import { GoogleGenerativeAI } from "@google/generative-ai";
import { QdrantClient } from "@qdrant/js-client-rest";
import * as dotenv from "dotenv";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, "../.env") });

async function testSearch() {
  console.log("🔍 Testing Search Flow...\n");

  const qdrantUrl = process.env.VITE_QDRANT_URL;
  const qdrantApiKey = process.env.VITE_QDRANT_API_KEY;
  const geminiApiKey = process.env.VITE_GEMINI_API_KEY;

  if (!qdrantUrl || !qdrantApiKey || !geminiApiKey) {
    console.error("❌ Missing environment variables");
    process.exit(1);
  }

  const client = new QdrantClient({
    url: qdrantUrl,
    apiKey: qdrantApiKey,
  });

  const genAI = new GoogleGenerativeAI(geminiApiKey);
  const collectionName = "duvenbeck_workshop_ideas";

  // Test query
  const testQuery = "What are the HR ideas?";
  console.log(`Query: "${testQuery}"\n`);

  try {
    // Step 1: Generate embedding
    console.log("1️⃣ Generating embedding...");
    const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
    const embeddingResult = await model.embedContent(testQuery);
    const queryEmbedding = embeddingResult.embedding.values;
    console.log(
      `   ✅ Generated ${queryEmbedding.length}-dimensional embedding\n`
    );

    // Step 2: Search Qdrant
    console.log("2️⃣ Searching Qdrant...");
    const searchResults = await client.search(collectionName, {
      vector: queryEmbedding,
      limit: 5,
    });
    console.log(`   ✅ Found ${searchResults.length} results\n`);

    if (searchResults.length === 0) {
      console.log("❌ No results found!");
      console.log(
        "💡 This might be why the chat returns 'no information found'\n"
      );
      process.exit(1);
    }

    // Step 3: Display results
    console.log("3️⃣ Top Results:");
    searchResults.forEach((result, index) => {
      console.log(`\n   Result #${index + 1}:`);
      console.log(`   Score: ${result.score?.toFixed(4)}`);
      console.log(`   Department: ${result.payload?.department}`);
      console.log(`   Type: ${result.payload?.type}`);
      console.log(`   Text: ${result.payload?.text}`);
      console.log(`   Owner: ${result.payload?.owner}`);
      console.log(`   Priority: ${result.payload?.priority}`);
    });

    // Step 4: Test translation
    console.log("\n4️⃣ Testing if text looks like translation keys:");
    const firstText = searchResults[0].payload?.text as string;
    const isTranslationKey = firstText && firstText.includes(".");

    if (isTranslationKey) {
      console.log(`   ✅ Text "${firstText}" looks like a translation key`);
      console.log(
        `   ℹ️  RAG service should translate this before sending to LLM`
      );
    } else {
      console.log(
        `   ⚠️  Text "${firstText}" doesn't look like a translation key`
      );
    }

    console.log("\n✅ Search flow is working!");
    console.log("💡 If chat still shows 'no information', check:");
    console.log("   1. Browser console for 'Found X search results' log");
    console.log("   2. Check if translation is working in browser");
    console.log("   3. Verify Gemini API key is valid\n");
  } catch (error) {
    console.error("\n❌ Test failed:", error);
    process.exit(1);
  }
}

testSearch();
