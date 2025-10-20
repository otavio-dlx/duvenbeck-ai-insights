import {
  createContext,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from "react";

export type TagCategory = "technical" | "business" | "process";

export interface Tag {
  text: string;
  category: TagCategory;
  confidence?: number;
}

export interface TaggedIdea {
  ideaText: string;
  tags: Tag[];
  timestamp: number;
}

export interface TaggingContextType {
  tagCache: Map<string, TaggedIdea>;
  isLoading: boolean;
  error: string | null;
  getTagsForIdea: (ideaText: string) => Promise<Tag[]>;
  getTagsForIdeaKey: (ideaKey: string) => Promise<Tag[]>;
  clearCache: () => void;
}

const TaggingContext = createContext<TaggingContextType | undefined>(undefined);

// Configuration
const XMEM_API_URL = "https://olserra-xmem.hf.space";
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Tag categorization and color mapping
const TAG_CATEGORIES = {
  technical: [
    "technology",
    "development",
    "system",
    "software",
    "digital",
    "automation",
    "platform",
    "api",
    "database",
    "security",
    "integration",
    "infrastructure",
  ],
  business: [
    "business",
    "strategy",
    "revenue",
    "customer",
    "market",
    "sales",
    "finance",
    "growth",
    "profit",
    "investment",
    "roi",
    "value",
  ],
  process: [
    "process",
    "workflow",
    "efficiency",
    "optimization",
    "management",
    "organization",
    "operation",
    "quality",
    "improvement",
    "logistics",
    "compliance",
    "governance",
  ],
};

function categorizeTag(tagText: string): TagCategory {
  const lowerTag = tagText.toLowerCase();
  console.log("🔍 Categorizing tag:", tagText);

  // Check for exact matches or partial matches in each category
  for (const [category, keywords] of Object.entries(TAG_CATEGORIES)) {
    if (
      keywords.some(
        (keyword) => lowerTag.includes(keyword) || keyword.includes(lowerTag)
      )
    ) {
      console.log("🎯 Tag", tagText, "categorized as", category);
      return category as TagCategory;
    }
  }

  // Default categorization based on common business context
  if (
    lowerTag.includes("cost") ||
    lowerTag.includes("time") ||
    lowerTag.includes("resource")
  ) {
    console.log("🎯 Tag", tagText, "categorized as business (default rule)");
    return "business";
  }

  // Default to process for general operational terms
  console.log("🎯 Tag", tagText, "categorized as process (fallback)");
  return "process";
}

async function callXmemAPI(text: string): Promise<string[]> {
  console.log("🤖 Calling xmem API with text:", text.substring(0, 100) + "...");

  try {
    // Add timeout to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(`${XMEM_API_URL}/tags`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    console.log("🤖 API Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("🤖 API Error response:", errorText);
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log("🤖 API Response data:", data);

    const tags = Array.isArray(data.tags) ? data.tags : [];
    console.log("🤖 Extracted tags:", tags);

    return tags;
  } catch (error) {
    console.error("🤖 Error calling xmem API:", error);
    throw error;
  }
}

function selectTopTags(tags: Tag[]): Tag[] {
  // Ensure we have exactly 3 tags, one from each category if possible
  const tagsByCategory = {
    technical: tags.filter((tag) => tag.category === "technical"),
    business: tags.filter((tag) => tag.category === "business"),
    process: tags.filter((tag) => tag.category === "process"),
  };

  const selectedTags: Tag[] = [];

  // Try to get one tag from each category
  if (tagsByCategory.technical.length > 0) {
    selectedTags.push(tagsByCategory.technical[0]);
  }
  if (tagsByCategory.business.length > 0) {
    selectedTags.push(tagsByCategory.business[0]);
  }
  if (tagsByCategory.process.length > 0) {
    selectedTags.push(tagsByCategory.process[0]);
  }

  // If we don't have 3 tags yet, fill from remaining tags
  const remainingTags = tags.filter((tag) => !selectedTags.includes(tag));
  while (selectedTags.length < 3 && remainingTags.length > 0) {
    const nextTag = remainingTags.shift();
    if (nextTag) {
      selectedTags.push(nextTag);
    }
  }

  return selectedTags.slice(0, 3); // Ensure exactly 3 tags
}

export function TaggingProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  const [tagCache] = useState<Map<string, TaggedIdea>>(new Map());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper function to convert API response tags to UI tags
  const convertApiTagsToUiTags = (
    apiTags: Array<{ tag: string; category: string; confidence?: string }>
  ): Tag[] => {
    return apiTags.map((apiTag) => ({
      text: apiTag.tag,
      category: categorizeTag(apiTag.tag),
      confidence: apiTag.confidence
        ? Number.parseFloat(apiTag.confidence)
        : undefined,
    }));
  };

  // Helper function to generate idea ID from idea key
  const getIdeaIdFromKey = (ideaKey: string): string => {
    return ideaKey.replace(/\./g, "-");
  };

  // New method to get tags for an idea by its key (API call to database)
  const getTagsForIdeaKey = useCallback(
    async (ideaKey: string): Promise<Tag[]> => {
      console.log("🏷️ Getting tags for idea key:", ideaKey);

      const ideaId = getIdeaIdFromKey(ideaKey);

      try {
        setIsLoading(true);
        setError(null);

        // Check if tags exist in database via API
        const response = await fetch(`/api/tags/${ideaId}`);

        if (response.ok) {
          const data = await response.json();
          if (data.tags && data.tags.length > 0) {
            console.log("🏷️ Found existing tags in database");
            const uiTags = convertApiTagsToUiTags(data.tags);
            console.log("🏷️ Returning database tags:", uiTags);
            return uiTags;
          }
        }

        console.log("🏷️ No tags found in database, generating new ones...");

        // If no tags exist, we'll use the fallback system
        const { generateFallbackTags } = await import("@/lib/fallbackTags");
        const fallbackTags = generateFallbackTags(ideaKey);

        // Store the generated tags in database via API
        const tagStrings = fallbackTags.map((tag) => tag.text);
        await fetch(`/api/tags/${ideaId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tags: tagStrings, category: "ai-generated" }),
        });

        console.log("🏷️ Generated and stored new tags:", fallbackTags);
        return fallbackTags;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error occurred";
        console.error("🏷️ Error getting tags for idea key:", errorMessage);
        setError(errorMessage);

        // Return fallback tags
        const { generateFallbackTags } = await import("@/lib/fallbackTags");
        return generateFallbackTags(ideaKey);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const getTagsForIdea = useCallback(
    async (ideaText: string): Promise<Tag[]> => {
      console.log(
        "🏷️ Getting tags for idea text:",
        ideaText.substring(0, 100) + "..."
      );

      // Create a cache key from the idea text
      const cacheKey = ideaText.trim().toLowerCase();

      // Check cache first (for legacy support)
      const cached = tagCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        console.log("🏷️ Using cached tags:", cached.tags);
        return cached.tags;
      }

      console.log("🏷️ No cache found, calling API...");
      setIsLoading(true);
      setError(null);

      try {
        // Call the xmem API
        const rawTags = await callXmemAPI(ideaText);
        console.log("🏷️ Raw tags from API:", rawTags);

        // Convert raw tags to categorized tags
        const categorizedTags: Tag[] = rawTags.map((tagText) => ({
          text: tagText,
          category: categorizeTag(tagText),
          confidence: 1, // xmem doesn't provide confidence scores
        }));

        // Select top 3 tags (one from each category if possible)
        const selectedTags = selectTopTags(categorizedTags);
        console.log("🏷️ Selected tags after categorization:", selectedTags);

        // Cache the result (legacy in-memory cache)
        const taggedIdea: TaggedIdea = {
          ideaText,
          tags: selectedTags,
          timestamp: Date.now(),
        };

        tagCache.set(cacheKey, taggedIdea);
        console.log("🏷️ Cached tags for future use");

        return selectedTags;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error occurred";
        console.error("🏷️ API call failed, using fallback tags:", errorMessage);
        setError(errorMessage);

        // Return smart fallback tags based on idea content
        const { generateFallbackTags } = await import("@/lib/fallbackTags");
        const fallbackTags = generateFallbackTags(ideaText);
        console.log("🏷️ Generated fallback tags:", fallbackTags);
        return fallbackTags;
      } finally {
        setIsLoading(false);
      }
    },
    [tagCache]
  );

  const clearCache = useCallback(() => {
    tagCache.clear();
  }, [tagCache]);

  const value: TaggingContextType = useMemo(
    () => ({
      tagCache,
      isLoading,
      error,
      getTagsForIdea,
      getTagsForIdeaKey,
      clearCache,
    }),
    [tagCache, isLoading, error, getTagsForIdea, getTagsForIdeaKey, clearCache]
  );

  return (
    <TaggingContext.Provider value={value}>{children}</TaggingContext.Provider>
  );
}

export default TaggingContext;
