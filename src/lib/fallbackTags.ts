import { Tag, TagCategory } from "@/contexts/TaggingContext";

// Extended keyword lists for better tag generation
const FALLBACK_KEYWORDS = {
  technical: [
    "system",
    "technology",
    "software",
    "digital",
    "automation",
    "platform",
    "integration",
    "database",
    "api",
    "security",
    "infrastructure",
    "development",
    "application",
    "solution",
    "tool",
    "interface",
    "analytics",
    "cloud",
  ],
  business: [
    "strategy",
    "revenue",
    "customer",
    "market",
    "growth",
    "value",
    "profit",
    "investment",
    "roi",
    "sales",
    "business",
    "commercial",
    "competitive",
    "opportunity",
    "efficiency",
    "cost",
    "finance",
    "innovation",
    "transformation",
  ],
  process: [
    "workflow",
    "process",
    "operation",
    "management",
    "organization",
    "quality",
    "improvement",
    "optimization",
    "logistics",
    "compliance",
    "governance",
    "procedure",
    "methodology",
    "framework",
    "structure",
    "coordination",
    "communication",
    "collaboration",
    "planning",
    "execution",
  ],
};

/**
 * Generates unique fallback tags based on the idea text content
 */
export function generateFallbackTags(ideaText: string): Tag[] {
  const lowerText = ideaText.toLowerCase();
  const words = lowerText.split(/\s+/).filter((word) => word.length > 3);

  const foundTags: Tag[] = [];
  const categoriesUsed = new Set<TagCategory>();

  // Try to find relevant keywords from each category
  for (const [category, keywords] of Object.entries(FALLBACK_KEYWORDS)) {
    const categoryKey = category as TagCategory;

    // Find keywords that appear in the text
    const matchedKeywords = keywords.filter(
      (keyword) =>
        lowerText.includes(keyword) ||
        words.some((word) => word.includes(keyword) || keyword.includes(word))
    );

    if (matchedKeywords.length > 0 && !categoriesUsed.has(categoryKey)) {
      foundTags.push({
        text: matchedKeywords[0],
        category: categoryKey,
        confidence: 0.7, // Lower confidence for fallback tags
      });
      categoriesUsed.add(categoryKey);
    }
  }

  // Fill remaining slots with generic but varied tags based on text analysis
  const genericTagsByCategory: Record<TagCategory, string[]> = {
    technical: ["solution", "system", "tool"],
    business: ["value", "opportunity", "strategy"],
    process: ["workflow", "improvement", "efficiency"],
  };

  const allCategories: TagCategory[] = ["technical", "business", "process"];

  // Ensure we have 3 tags, filling missing categories
  for (const category of allCategories) {
    if (foundTags.length >= 3) break;

    if (!categoriesUsed.has(category)) {
      const availableTags = genericTagsByCategory[category];
      // Use hash of text to pick different generic tags for different ideas
      const textHash = simpleHash(ideaText);
      const tagIndex = textHash % availableTags.length;

      foundTags.push({
        text: availableTags[tagIndex],
        category,
        confidence: 0.5,
      });
      categoriesUsed.add(category);
    }
  }

  // If we still don't have enough, add more specific tags based on common business terms
  while (foundTags.length < 3) {
    const remainingCategories = allCategories.filter(
      (cat) => foundTags.filter((tag) => tag.category === cat).length === 0
    );

    if (remainingCategories.length > 0) {
      const category = remainingCategories[0];
      const availableTags = genericTagsByCategory[category];
      foundTags.push({
        text: availableTags[0],
        category,
        confidence: 0.3,
      });
    } else {
      // Add additional tags to existing categories
      const textHash = simpleHash(ideaText + foundTags.length);
      const categoryIndex = textHash % allCategories.length;
      const category = allCategories[categoryIndex];
      const availableTags = genericTagsByCategory[category];
      const tagIndex = (textHash + 1) % availableTags.length;

      foundTags.push({
        text: availableTags[tagIndex],
        category,
        confidence: 0.3,
      });
    }
  }

  return foundTags.slice(0, 3);
}

/**
 * Simple hash function to generate consistent but varied results for same input
 */
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}
