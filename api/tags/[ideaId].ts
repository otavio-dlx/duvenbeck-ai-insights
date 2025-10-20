import type { VercelRequest, VercelResponse } from "@vercel/node";
import { IdeaTagsService } from "../../src/services/database/ideaTagsService";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { ideaId } = req.query;

  if (typeof ideaId !== "string") {
    return res.status(400).json({ error: "Idea ID is required" });
  }

  if (req.method === "GET") {
    try {
      const hasExistingTags = await IdeaTagsService.hasTagsForIdea(ideaId);

      if (hasExistingTags) {
        const tags = await IdeaTagsService.getTagsForIdea(ideaId);
        return res.status(200).json({ tags });
      } else {
        return res.status(200).json({ tags: [] });
      }
    } catch (error) {
      console.error("Error fetching tags:", error);
      return res.status(500).json({ error: "Failed to fetch tags" });
    }
  }

  if (req.method === "POST") {
    try {
      const { tags, category = "ai-generated" } = req.body;

      if (!Array.isArray(tags)) {
        return res.status(400).json({ error: "Tags array is required" });
      }

      await IdeaTagsService.setTagsForIdea(ideaId, tags, category);
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error storing tags:", error);
      return res.status(500).json({ error: "Failed to store tags" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
