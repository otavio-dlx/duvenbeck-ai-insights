import { getTranslatedText } from "@/utils/translationUtils";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { QdrantClient } from "@qdrant/js-client-rest";

// Import all data files
import * as accountingData from "@/data/accounting";
import * as centralSolutionDesignData from "@/data/central_solution_design";
import * as complianceData from "@/data/compliance";
import * as contractLogisticsData from "@/data/contract_logistics";
import * as controllingData from "@/data/controlling";
import * as corpDevData from "@/data/corp_dev";
import * as esgData from "@/data/esg";
import * as hrData from "@/data/hr";
import * as itBusinessSolutionRoadData from "@/data/it_business_solution_road";
import * as itPlatformServicesData from "@/data/it_plataform_services_digital_workplace";
import * as itSharedServicesData from "@/data/it_shared_services";
import * as marketingCommunicationsData from "@/data/marketing_communications";
import * as participantsData from "@/data/participants";
import * as qehsData from "@/data/qehs";
import * as roadSalesData from "@/data/road_sales";
import * as strategicKamData from "@/data/strategic_kam";
import { NewFormatIdea } from "@/data/types";

interface VectorDocument {
  id: string;
  text: string;
  metadata: {
    department: string;
    ideaKey: string;
    owner: string;
    priority: string;
    finalPrio: string | number;
    type: "idea" | "problem" | "solution";
  };
}

interface SearchResult {
  id: string;
  score: number;
  payload: VectorDocument["metadata"] & { text: string };
}

export class RAGService {
  private readonly genAI: GoogleGenerativeAI;
  private readonly apiKey: string;
  private readonly qdrantClient: QdrantClient | null = null;
  private readonly qdrantUrl: string;
  private readonly qdrantApiKey: string;
  private readonly collectionName = "duvenbeck_workshop_ideas";
  private documents: VectorDocument[] = [];
  private isInitialized = false;
  private readonly useQdrant: boolean;

  constructor() {
    this.apiKey =
      import.meta.env.VITE_GEMINI_API_KEY ||
      import.meta.env.GEMINI_API_KEY ||
      "";

    this.qdrantUrl = import.meta.env.VITE_QDRANT_URL || "";
    this.qdrantApiKey = import.meta.env.VITE_QDRANT_API_KEY || "";

    this.genAI = new GoogleGenerativeAI(this.apiKey);

    // Initialize Qdrant client if credentials are available
    if (this.qdrantUrl && this.qdrantApiKey) {
      try {
        this.qdrantClient = new QdrantClient({
          url: this.qdrantUrl,
          apiKey: this.qdrantApiKey,
        });
        this.useQdrant = true;
        console.log("Qdrant client initialized successfully");
      } catch (error) {
        console.error("Failed to initialize Qdrant client:", error);
        this.useQdrant = false;
      }
    } else {
      console.log("Qdrant credentials not found, using in-memory search");
      this.useQdrant = false;
    }
  }

  private readonly departmentDataSources = {
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

  private async generateEmbedding(text: string): Promise<number[]> {
    try {
      // Generate a simple hash-based embedding
      return this.createSimpleEmbedding(text);
    } catch (error) {
      console.error("Error generating embedding:", error);
      // Return a simple hash-based embedding as fallback
      return this.createSimpleEmbedding(text);
    }
  }

  private createSimpleEmbedding(text: string): number[] {
    // Create a simple 768-dimension vector based on text characteristics
    const vector = new Array(768).fill(0);

    // Use text length, character codes, and word patterns to create a unique vector
    const words = text.toLowerCase().split(/\s+/);
    const textLength = text.length;

    for (let i = 0; i < Math.min(words.length, 768); i++) {
      const word = words[i];
      let value = 0;

      // Generate a value based on character codes and position
      for (let j = 0; j < word.length; j++) {
        value += word.charCodeAt(j) * (j + 1);
      }

      // Normalize and set the vector value
      vector[i] = (value / textLength) * 0.1;
    }

    // Add some variance based on text characteristics
    vector[0] = textLength / 1000;
    vector[1] = words.length / 100;
    vector[2] = text.match(/[.!?]/g)?.length || 0 / 10;

    return vector;
  }

  private getTranslatedText(key: string): string {
    return getTranslatedText(key);
  }

  private async prepareDocuments(): Promise<VectorDocument[]> {
    console.log("Starting document preparation...");
    const documents: VectorDocument[] = [];

    try {
      for (const [departmentName, data] of Object.entries(
        this.departmentDataSources
      )) {
        console.log(`Processing department: ${departmentName}`);
        const dataObj = data as { ideas?: { ideas?: NewFormatIdea[] } };
        const ideas = dataObj.ideas?.ideas || [];
        console.log(`Found ${ideas.length} ideas in ${departmentName}`);

        for (const idea of ideas) {
          // Use the keys directly as text for now to avoid translation issues
          const ideaText = idea.ideaKey || `Idea from ${departmentName}`;
          const problemText =
            idea.problemKey || `Problem from ${departmentName}`;
          const solutionText =
            idea.solutionKey || `Solution from ${departmentName}`;

          // Create separate documents for idea, problem, and solution
          documents.push(
            {
              id: `${departmentName}_${idea.ideaKey}_idea`,
              text: ideaText,
              metadata: {
                department: departmentName,
                ideaKey: idea.ideaKey,
                owner: idea.owner,
                priority: idea.priority,
                finalPrio: idea.finalPrio,
                type: "idea",
              },
            },
            {
              id: `${departmentName}_${idea.problemKey}_problem`,
              text: problemText,
              metadata: {
                department: departmentName,
                ideaKey: idea.ideaKey,
                owner: idea.owner,
                priority: idea.priority,
                finalPrio: idea.finalPrio,
                type: "problem",
              },
            },
            {
              id: `${departmentName}_${idea.solutionKey}_solution`,
              text: solutionText,
              metadata: {
                department: departmentName,
                ideaKey: idea.ideaKey,
                owner: idea.owner,
                priority: idea.priority,
                finalPrio: idea.finalPrio,
                type: "solution",
              },
            }
          );
        }
      }

      console.log(`Prepared ${documents.length} documents total`);
      return documents;
    } catch (error) {
      console.error("Error in prepareDocuments:", error);
      throw error;
    }
  }

  async initializeCollection(): Promise<void> {
    try {
      console.log("Starting RAG service initialization...");

      if (!this.isInitialized) {
        // Check if API key is available
        if (!this.apiKey) {
          throw new Error(
            "Gemini API key is missing. Please check your environment variables."
          );
        }
        console.log("API key found:", this.apiKey.substring(0, 10) + "...");

        if (this.useQdrant && this.qdrantClient) {
          // Check if Qdrant collection exists
          try {
            const collectionInfo = await this.qdrantClient.getCollection(
              this.collectionName
            );
            console.log(
              `Qdrant collection found with ${collectionInfo.points_count} points`
            );
          } catch {
            console.warn(
              "Qdrant collection not found, falling back to in-memory search"
            );
            // Fall back to in-memory if collection doesn't exist
            console.log("Initializing in-memory document collection...");
            this.documents = await this.prepareDocuments();
          }
        } else {
          console.log("Initializing in-memory document collection...");
          this.documents = await this.prepareDocuments();
        }

        this.isInitialized = true;
        console.log("RAG service initialization completed successfully");
      } else {
        console.log("RAG service already initialized");
      }
    } catch (error) {
      console.error("Error initializing RAG collection:", error);
      throw error;
    }
  }

  private async searchWithQdrant(
    query: string,
    limit: number
  ): Promise<SearchResult[]> {
    if (!this.qdrantClient) {
      return [];
    }

    try {
      // Generate embedding for the query
      const model = this.genAI.getGenerativeModel({
        model: "text-embedding-004",
      });
      const result = await model.embedContent(query);
      const queryEmbedding = result.embedding.values;

      // Search in Qdrant
      const searchResult = await this.qdrantClient.search(this.collectionName, {
        vector: queryEmbedding,
        limit,
      });

      // Convert Qdrant results to our format
      return searchResult.map((item) => ({
        id: item.id.toString(),
        score: item.score || 0,
        payload: {
          text: (item.payload?.text as string) || "",
          department: (item.payload?.department as string) || "",
          ideaKey: (item.payload?.ideaKey as string) || "",
          owner: (item.payload?.owner as string) || "",
          priority: (item.payload?.priority as string) || "",
          finalPrio: (item.payload?.finalPrio as string | number) || "",
          type:
            (item.payload?.type as "idea" | "problem" | "solution") || "idea",
        },
      }));
    } catch (error) {
      console.error("Qdrant search failed:", error);
      return [];
    }
  }

  private async searchInMemory(
    query: string,
    limit: number
  ): Promise<SearchResult[]> {
    const queryLower = query.toLowerCase();
    const results: SearchResult[] = [];

    // Search through documents for text matches
    for (const doc of this.documents) {
      const textLower = doc.text.toLowerCase();
      const words = queryLower.split(/\s+/);
      let score = 0;

      for (const word of words) {
        if (textLower.includes(word)) {
          score += 1;
          if (textLower.includes(queryLower)) {
            score += 2;
          }
        }
      }

      if (score > 0) {
        results.push({
          id: doc.id,
          score: score / words.length,
          payload: {
            text: doc.text,
            ...doc.metadata,
          },
        });
      }
    }

    results.sort((a, b) => b.score - a.score);
    return results.slice(0, limit);
  }

  async searchSimilar(
    query: string,
    limit: number = 5
  ): Promise<SearchResult[]> {
    try {
      // Use Qdrant if available and initialized
      if (this.useQdrant && this.qdrantClient) {
        const results = await this.searchWithQdrant(query, limit);
        if (results.length > 0) {
          return results;
        }
        console.log(
          "Qdrant returned no results, falling back to in-memory search"
        );
      }

      // Fallback to in-memory search
      return await this.searchInMemory(query, limit);
    } catch (error) {
      console.error("Error searching documents:", error);
      return [];
    }
  }

  async generateRAGResponse(query: string): Promise<string> {
    try {
      // Search for relevant documents
      const searchResults = await this.searchSimilar(query, 10);

      if (searchResults.length === 0) {
        return "I couldn't find any relevant information in the workshop data to answer your question.";
      }

      // Build context from search results
      const context = searchResults
        .map((result) => {
          const { department, owner, priority, type, text } = result.payload;
          return `[${department} - ${type.toUpperCase()}] (Owner: ${owner}, Priority: ${priority}): ${text}`;
        })
        .join("\n\n");

      // Generate response using context
      const model = this.genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        },
      });

      const prompt = `You are a helpful AI assistant for Duvenbeck's AI Workshop. Based on the following relevant information from the workshop data, please answer the user's question.

RELEVANT WORKSHOP DATA:
${context}

USER QUESTION: ${query}

Please provide a helpful and accurate response based only on the provided workshop data. If the question cannot be answered with the available data, please say so. Include specific details like owner names and priorities when relevant.`;

      const result = await model.generateContent(prompt);
      const response = result.response;
      return response.text();
    } catch (error) {
      console.error("Error generating RAG response:", error);
      throw error;
    }
  }
}

export const ragService = new RAGService();
