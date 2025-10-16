import i18n from "@/i18n/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

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
  private readonly collectionName = "duvenbeck_workshop_ideas";
  private documents: VectorDocument[] = [];
  private isInitialized = false;
  private readonly useQdrant: boolean;

  constructor() {
    this.apiKey =
      import.meta.env.VITE_GEMINI_API_KEY ||
      import.meta.env.GEMINI_API_KEY ||
      "";

    this.genAI = new GoogleGenerativeAI(this.apiKey);

    // Check if we should use Qdrant (via API)
    const hasQdrantConfig = !!(
      import.meta.env.VITE_QDRANT_URL && import.meta.env.VITE_QDRANT_API_KEY
    );

    this.useQdrant = hasQdrantConfig;

    if (hasQdrantConfig) {
      console.log("RAG service will use Qdrant via API endpoint");
    } else {
      console.log("RAG service will use in-memory search");
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
    try {
      // Use i18n directly to translate
      return i18n.t(key);
    } catch (error) {
      console.warn(`Translation failed for key: ${key}`, error);
      return key;
    }
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

        if (this.useQdrant) {
          // Just verify the API endpoint is available
          console.log("Using Qdrant via API endpoint");
          // We'll rely on the API route to handle Qdrant connection
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
    try {
      console.log(`Searching via API for: "${query}"`);

      // Call the API route instead of Qdrant directly
      const response = await fetch("/api/rag/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query, limit }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("API search failed:", response.status, errorData);
        return [];
      }

      const data = await response.json();
      console.log(`API returned ${data.results?.length || 0} results`);

      return data.results || [];
    } catch (error) {
      console.error("API search failed:", error);
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
      console.log(
        `🔍 searchSimilar called with query: "${query}", limit: ${limit}`
      );
      console.log(`   useQdrant: ${this.useQdrant}`);

      // Use Qdrant API if available
      if (this.useQdrant) {
        console.log(`   Attempting Qdrant API search...`);
        const results = await this.searchWithQdrant(query, limit);
        console.log(`   Qdrant API search returned ${results.length} results`);
        if (results.length > 0) {
          return results;
        }
        console.log(
          "Qdrant API returned no results, falling back to in-memory search"
        );
      } else {
        console.log(`   Skipping Qdrant, using in-memory search`);
        console.log(`   documents.length: ${this.documents.length}`);
      }

      // Fallback to in-memory search
      const memoryResults = await this.searchInMemory(query, limit);
      console.log(
        `   In-memory search returned ${memoryResults.length} results`
      );
      return memoryResults;
    } catch (error) {
      console.error("Error searching documents:", error);
      return [];
    }
  }

  async generateRAGResponse(query: string): Promise<string> {
    try {
      // Search for relevant documents
      const searchResults = await this.searchSimilar(query, 10);

      console.log(
        `Found ${searchResults.length} search results for query: "${query}"`
      );

      // Handle cases with no search results
      if (searchResults.length === 0) {
        // Still ask the LLM to respond appropriately (greeting, off-topic, etc.)
        const model = this.genAI.getGenerativeModel({
          model: "gemini-2.0-flash",
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 512,
          },
        });

        const noDataPrompt = `You are an AI assistant for Duvenbeck's AI Workshop (October 6-8, 2025, online event).

I searched for relevant workshop data but found NOTHING related to this query.

USER QUESTION: ${query}

INSTRUCTIONS:
- If this is a greeting (hi, hello, etc.): Respond warmly and briefly introduce yourself. Invite them to ask about the workshop.
- If this seems workshop-related: Politely explain you don't have specific information on that topic in the workshop data.
- If this is clearly off-topic: Politely explain your scope is limited to the Duvenbeck AI Workshop (Oct 6-8, 2025) and you cannot discuss other topics.

Keep your response brief and friendly.`;

        const result = await model.generateContent(noDataPrompt);
        return result.response.text();
      }

      // Build context from search results with translated text
      const context = searchResults
        .map((result) => {
          const { department, owner, priority, type, text } = result.payload;
          // Translate the key to get actual readable text
          const translatedText = this.getTranslatedText(text);
          console.log(`Translating "${text}" -> "${translatedText}"`);
          return `[${department} - ${type.toUpperCase()}] (Owner: ${owner}, Priority: ${priority}): ${translatedText}`;
        })
        .join("\n\n");

      console.log(
        "Context to be sent to LLM:",
        context.substring(0, 500) + "..."
      );

      // Generate response using context
      const model = this.genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        },
      });

      const prompt = `You are an AI assistant for Duvenbeck's AI Workshop (October 6-8, 2025, online event).

USER QUESTION: ${query}

CRITICAL DECISION: Is this a GREETING/CHITCHAT or a REAL WORKSHOP QUESTION?

GREETINGS/CHITCHAT (respond conversationally, DO NOT use workshop data):
- Single words: "hi", "hello", "hey", "thanks", "bye"
- Social phrases: "how are you", "good morning", "thank you"
- Small talk: "nice to meet you"

REAL WORKSHOP QUESTIONS (USE the workshop data below):
- Asks about ideas, problems, or solutions: "What ideas does X have?", "Show me Y ideas"
- Asks about departments: "Tell me about compliance", "What did HR propose?"
- Asks about priorities, owners, or specific content
- ANY question with "what", "show", "tell", "list", "which" about workshop topics

WORKSHOP DATA:
${context}

INSTRUCTIONS:
1. If this is a greeting/chitchat: Respond warmly without mentioning workshop data. Example: "Hi! I'm your AI assistant for the Duvenbeck AI Workshop (October 6-8, 2025). I can help you explore ideas, problems, and solutions from different departments. What would you like to know?"

2. If this is a real workshop question: Answer using the workshop data above:
   - List the relevant items with Department, Owner, Priority, and Type
   - Use simple numbered lists (1., 2., 3.)
   - Be specific and comprehensive
   - Use plain text only (no markdown formatting)

Provide your response:`;

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
