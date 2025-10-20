import { db, ideaTags, type IdeaTag, type NewIdeaTag } from "@/lib/database";
import { and, eq, inArray } from "drizzle-orm";

export class IdeaTagsService {
  /**
   * Get all tags for a specific idea
   */
  static async getTagsForIdea(ideaId: string): Promise<IdeaTag[]> {
    return await db.select().from(ideaTags).where(eq(ideaTags.ideaId, ideaId));
  }

  /**
   * Get tags for multiple ideas (bulk operation)
   */
  static async getTagsForIdeas(
    ideaIds: string[]
  ): Promise<Map<string, IdeaTag[]>> {
    if (ideaIds.length === 0) return new Map();

    const tags = await db
      .select()
      .from(ideaTags)
      .where(inArray(ideaTags.ideaId, ideaIds));

    // Group tags by idea ID
    const tagsByIdea = new Map<string, IdeaTag[]>();
    for (const tag of tags) {
      if (!tagsByIdea.has(tag.ideaId)) {
        tagsByIdea.set(tag.ideaId, []);
      }
      const existingTags = tagsByIdea.get(tag.ideaId);
      if (existingTags) {
        existingTags.push(tag);
      }
    }

    return tagsByIdea;
  }

  /**
   * Store tags for an idea (replaces existing tags)
   */
  static async setTagsForIdea(
    ideaId: string,
    tags: string[],
    category = "ai-generated"
  ): Promise<void> {
    // First, delete existing tags for this idea
    await db.delete(ideaTags).where(eq(ideaTags.ideaId, ideaId));

    // Then insert new tags
    if (tags.length > 0) {
      const newTags: NewIdeaTag[] = tags.map((tag, index) => ({
        id: `${ideaId}-tag-${index}`,
        ideaId,
        tag: tag.toLowerCase().trim(),
        category,
        confidence: "0.8", // Default confidence for AI-generated tags
        generatedAt: new Date(),
      }));

      await db.insert(ideaTags).values(newTags);
    }
  }

  /**
   * Add tags to an idea (preserves existing tags)
   */
  static async addTagsToIdea(
    ideaId: string,
    newTags: string[],
    category = "ai-generated"
  ): Promise<void> {
    if (newTags.length === 0) return;

    // Get existing tags to avoid duplicates
    const existingTags = await this.getTagsForIdea(ideaId);
    const existingTagNames = new Set(
      existingTags.map((t) => t.tag.toLowerCase())
    );

    // Filter out duplicates
    const uniqueNewTags = newTags.filter(
      (tag) => !existingTagNames.has(tag.toLowerCase())
    );

    if (uniqueNewTags.length > 0) {
      const tagsToInsert: NewIdeaTag[] = uniqueNewTags.map((tag, index) => ({
        id: `${ideaId}-tag-${Date.now()}-${index}`,
        ideaId,
        tag: tag.toLowerCase().trim(),
        category,
        confidence: "0.8",
        generatedAt: new Date(),
      }));

      await db.insert(ideaTags).values(tagsToInsert);
    }
  }

  /**
   * Get all unique tags with their frequencies
   */
  static async getAllTagsWithFrequency(): Promise<
    Array<{ tag: string; frequency: number; category: string }>
  > {
    const result = await db
      .select({
        tag: ideaTags.tag,
        category: ideaTags.category,
        count: ideaTags.id, // We'll count this
      })
      .from(ideaTags);

    // Count frequencies manually (Drizzle doesn't have a clean COUNT(DISTINCT) yet)
    const tagFrequency = new Map<
      string,
      { frequency: number; category: string }
    >();

    for (const row of result) {
      const key = `${row.tag}-${row.category}`;
      if (tagFrequency.has(key)) {
        const existing = tagFrequency.get(key);
        if (existing) {
          existing.frequency++;
        }
      } else {
        tagFrequency.set(key, { frequency: 1, category: row.category });
      }
    }

    return Array.from(tagFrequency.entries()).map(([key, data]) => ({
      tag: key.split("-").slice(0, -1).join("-"), // Remove category from key
      frequency: data.frequency,
      category: data.category,
    }));
  }

  /**
   * Check if tags exist for an idea
   */
  static async hasTagsForIdea(ideaId: string): Promise<boolean> {
    const tags = await db
      .select({ id: ideaTags.id })
      .from(ideaTags)
      .where(eq(ideaTags.ideaId, ideaId))
      .limit(1);

    return tags.length > 0;
  }

  /**
   * Get ideas by tag
   */
  static async getIdeasByTag(tag: string): Promise<string[]> {
    const result = await db
      .select({ ideaId: ideaTags.ideaId })
      .from(ideaTags)
      .where(eq(ideaTags.tag, tag.toLowerCase()));

    return result.map((row) => row.ideaId);
  }

  /**
   * Delete all tags for an idea
   */
  static async deleteTagsForIdea(ideaId: string): Promise<void> {
    await db.delete(ideaTags).where(eq(ideaTags.ideaId, ideaId));
  }

  /**
   * Update tag confidence score
   */
  static async updateTagConfidence(
    ideaId: string,
    tag: string,
    confidence: number
  ): Promise<void> {
    await db
      .update(ideaTags)
      .set({ confidence: confidence.toString() })
      .where(
        and(eq(ideaTags.ideaId, ideaId), eq(ideaTags.tag, tag.toLowerCase()))
      );
  }
}
