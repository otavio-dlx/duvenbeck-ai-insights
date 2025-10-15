import { GoogleGenerativeAI } from "@google/generative-ai";

interface ChatRequest {
  message: string;
  context: string;
}

interface ChatResponse {
  response: string;
  success: boolean;
  error?: string;
}

export class GeminiApiService {
  private readonly apiKey: string;
  private readonly genAI: GoogleGenerativeAI;

  constructor() {
    this.apiKey =
      import.meta.env.VITE_GEMINI_API_KEY ||
      import.meta.env.GEMINI_API_KEY ||
      "";

    if (!this.apiKey) {
      console.warn(
        "Gemini API key not found in environment variables. Please set VITE_GEMINI_API_KEY in your .env file."
      );
    }

    this.genAI = new GoogleGenerativeAI(this.apiKey);
  }

  private createSystemPrompt(context: string): string {
    return `You are a helpful AI assistant for Duvenbeck's AI Workshop. You have access to workshop data containing ideas, priorities, and insights from various departments.

IMPORTANT GUIDELINES:
- Only answer questions related to the workshop data provided in the context
- Be concise and professional
- When mentioning specific ideas, include the owner's name
- If asked about data not in the context, politely explain you can only discuss the workshop data
- Format your responses clearly with bullet points or numbered lists when appropriate
- Always be factual and don't make assumptions about data not provided

WORKSHOP DATA CONTEXT:
${context}

Please answer questions based only on this workshop data.`;
  }

  private sanitizeApiKey(): boolean {
    return this.apiKey.length > 0 && this.apiKey.startsWith("AIza");
  }

  async sendChatMessage(request: ChatRequest): Promise<ChatResponse> {
    try {
      if (!this.sanitizeApiKey()) {
        throw new Error("Invalid or missing API key");
      }

      const systemPrompt = this.createSystemPrompt(request.context);
      const userPrompt = `${systemPrompt}\n\nUser Question: ${request.message}`;

      console.log("Using model: gemini-2.0-flash");

      const model = this.genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      });

      const result = await model.generateContent(userPrompt);
      const response = result.response;
      const text = response.text();

      if (!text || text.trim().length === 0) {
        throw new Error("Model returned empty response");
      }

      console.log("Successfully generated response");
      return {
        response: text.trim(),
        success: true,
      };
    } catch (error) {
      console.error("Gemini API Error:", error);

      return {
        response: "",
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  isConfigured(): boolean {
    return this.sanitizeApiKey();
  }
}

export const geminiApiService = new GeminiApiService();
