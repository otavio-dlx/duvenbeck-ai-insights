import { GoogleGenerativeAI } from "@google/generative-ai";
import { QdrantClient } from "@qdrant/js-client-rest";
import { randomUUID } from "crypto";
import * as dotenv from "dotenv";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

// Import all data files
import * as accountingData from "../src/data/accounting.js";
import * as centralSolutionDesignData from "../src/data/central_solution_design.js";
import * as complianceData from "../src/data/compliance.js";
import * as contractLogisticsData from "../src/data/contract_logistics.js";
import * as controllingData from "../src/data/controlling.js";
import * as corpDevData from "../src/data/corp_dev.js";
import * as esgData from "../src/data/esg.js";
import * as hrData from "../src/data/hr.js";
import * as itBusinessSolutionRoadData from "../src/data/it_business_solution_road.js";
import * as itPlatformServicesData from "../src/data/it_plataform_services_digital_workplace.js";
import * as itSharedServicesData from "../src/data/it_shared_services.js";
import * as marketingCommunicationsData from "../src/data/marketing_communications.js";
import * as participantsData from "../src/data/participants.js";
import * as qehsData from "../src/data/qehs.js";
import * as roadSalesData from "../src/data/road_sales.js";
import * as strategicKamData from "../src/data/strategic_kam.js";

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, "../.env") });

interface NewFormatIdea {
  finalPrio: number;
  ideaKey: string;
  problemKey: string;
  solutionKey: string;
  owner: string;
  priority: string;
  complexity?: number;
  complexityNoteKey?: string;
  cost?: number;
  costNoteKey?: string;
  roi?: number;
  roiNoteKey?: string;
  risk?: number;
  riskNoteKey?: string;
  strategicAlignment?: number;
  strategicNoteKey?: string;
}

interface VectorPoint {
  id: string;
  vector: number[];
  payload: {
    originalId: string;
    text: string;
    department: string;
    ideaKey: string;
    owner: string;
    priority: string;
    finalPrio: number;
    type: "idea" | "problem" | "solution";
    complexity?: number;
    cost?: number;
    roi?: number;
    risk?: number;
    strategicAlignment?: number;
  };
}

const departmentDataSources = {
  Accounting: accountingData,
  "Central Solution Design": centralSolutionDesignData,
  Compliance: complianceData,
  "Contract Logistics": contractLogisticsData,
  Controlling: controllingData,
  "Corporate Development": corpDevData,
  ESG: esgData,
  HR: hrData,
  "IT Business Solution Road": itBusinessSolutionRoadData,
  "IT Platform Services": itPlatformServicesData,
  "IT Shared Services": itSharedServicesData,
  "Marketing Communications": marketingCommunicationsData,
  Participants: participantsData,
  QEHS: qehsData,
  "Road Sales": roadSalesData,
  "Strategic KAM": strategicKamData,
};

async function generateEmbedding(
  text: string,
  genAI: GoogleGenerativeAI
): Promise<number[]> {
  try {
    const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
    const result = await model.embedContent(text);
    return result.embedding.values;
  } catch (error) {
    console.error(
      "Error generating embedding for text:",
      text.substring(0, 50),
      error
    );
    throw error;
  }
}

async function uploadToQdrant() {
  console.log("🚀 Starting upload to Qdrant Vector Database...\n");

  // Validate environment variables
  const qdrantUrl = process.env.VITE_QDRANT_URL;
  const qdrantApiKey = process.env.VITE_QDRANT_API_KEY;
  const geminiApiKey =
    process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

  if (!qdrantUrl || !qdrantApiKey || !geminiApiKey) {
    throw new Error(
      "Missing required environment variables. Please check your .env file."
    );
  }

  console.log("✅ Environment variables loaded");
  console.log(`   Qdrant URL: ${qdrantUrl}`);
  console.log(`   Gemini API Key: ${geminiApiKey.substring(0, 10)}...`);

  // Initialize clients
  const qdrantClient = new QdrantClient({
    url: qdrantUrl,
    apiKey: qdrantApiKey,
  });

  const genAI = new GoogleGenerativeAI(geminiApiKey);

  const collectionName = "duvenbeck_workshop_ideas";

  try {
    // Check if collection exists, if not create it
    console.log(`\n📦 Checking collection: ${collectionName}`);

    try {
      await qdrantClient.getCollection(collectionName);
      console.log(`   Collection exists. Deleting to recreate...`);
      await qdrantClient.deleteCollection(collectionName);
      console.log(`   Collection deleted.`);
    } catch {
      console.log(`   Collection doesn't exist yet.`);
    }

    // Create collection with proper vector size (768 for text-embedding-004)
    console.log(`\n🔨 Creating collection...`);
    await qdrantClient.createCollection(collectionName, {
      vectors: {
        size: 768,
        distance: "Cosine",
      },
    });
    console.log(`   ✅ Collection created successfully`);

    // Prepare all documents
    console.log(`\n📝 Preparing documents...`);
    const points: VectorPoint[] = [];
    let totalIdeas = 0;

    for (const [departmentName, data] of Object.entries(
      departmentDataSources
    )) {
      console.log(`   Processing: ${departmentName}`);
      const dataObj = data as { ideas?: { ideas?: NewFormatIdea[] } };
      const ideas = dataObj.ideas?.ideas || [];
      totalIdeas += ideas.length;

      for (const idea of ideas) {
        // Create documents for idea, problem, and solution
        const documents = [
          {
            id: `${departmentName}_${idea.ideaKey}_idea`,
            text: idea.ideaKey,
            type: "idea" as const,
          },
          {
            id: `${departmentName}_${idea.problemKey}_problem`,
            text: idea.problemKey,
            type: "problem" as const,
          },
          {
            id: `${departmentName}_${idea.solutionKey}_solution`,
            text: idea.solutionKey,
            type: "solution" as const,
          },
        ];

        for (const doc of documents) {
          console.log(
            `      Generating embedding for: ${doc.type} - ${doc.text.substring(
              0,
              50
            )}...`
          );
          const embedding = await generateEmbedding(doc.text, genAI);

          points.push({
            id: randomUUID(),
            vector: embedding,
            payload: {
              originalId: doc.id,
              text: doc.text,
              department: departmentName,
              ideaKey: idea.ideaKey,
              owner: idea.owner,
              priority: idea.priority,
              finalPrio: idea.finalPrio,
              type: doc.type,
              complexity: idea.complexity,
              cost: idea.cost,
              roi: idea.roi,
              risk: idea.risk,
              strategicAlignment: idea.strategicAlignment,
            },
          });
        }
      }
      console.log(
        `      ✅ Processed ${ideas.length} ideas from ${departmentName}`
      );
    }

    console.log(`\n📊 Summary:`);
    console.log(
      `   Total departments: ${Object.keys(departmentDataSources).length}`
    );
    console.log(`   Total ideas: ${totalIdeas}`);
    console.log(`   Total vectors to upload: ${points.length}`);

    // Upload to Qdrant in batches
    console.log(`\n⬆️  Uploading to Qdrant...`);
    const batchSize = 100;

    for (let i = 0; i < points.length; i += batchSize) {
      const batch = points.slice(i, i + batchSize);
      console.log(
        `   Uploading batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(
          points.length / batchSize
        )} (${batch.length} points)`
      );

      await qdrantClient.upsert(collectionName, {
        wait: true,
        points: batch,
      });
    }

    console.log(`\n✅ Upload completed successfully!`);
    console.log(`   Collection: ${collectionName}`);
    console.log(`   Total vectors uploaded: ${points.length}`);

    // Verify the upload
    const collectionInfo = await qdrantClient.getCollection(collectionName);
    console.log(`\n🔍 Verification:`);
    console.log(`   Points in collection: ${collectionInfo.points_count}`);
  } catch (error) {
    console.error("\n❌ Error uploading to Qdrant:", error);
    throw error;
  }
}

// Run the upload
uploadToQdrant()
  .then(() => {
    console.log("\n🎉 All done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Fatal error:", error);
    process.exit(1);
  });
