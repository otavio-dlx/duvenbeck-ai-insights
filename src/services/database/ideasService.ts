import {
  db,
  departments,
  ideas,
  type Idea,
  type NewIdea,
} from "@/lib/database";
import { and, asc, desc, eq, gte, like, lte, or } from "drizzle-orm";

export class IdeasService {
  /**
   * Get all ideas
   */
  static async getAllIdeas(): Promise<Idea[]> {
    return await db.select().from(ideas).orderBy(asc(ideas.finalPrio));
  }

  /**
   * Get ideas by department
   */
  static async getIdeasByDepartment(departmentId: string): Promise<Idea[]> {
    return await db
      .select()
      .from(ideas)
      .where(eq(ideas.departmentId, departmentId))
      .orderBy(asc(ideas.finalPrio));
  }

  /**
   * Get a specific idea by ID
   */
  static async getIdeaById(ideaId: string): Promise<Idea | null> {
    const result = await db
      .select()
      .from(ideas)
      .where(eq(ideas.id, ideaId))
      .limit(1);

    return result[0] || null;
  }

  /**
   * Get ideas by multiple IDs
   */
  static async getIdeasByIds(ideaIds: string[]): Promise<Idea[]> {
    if (ideaIds.length === 0) return [];

    return await db
      .select()
      .from(ideas)
      .where(or(...ideaIds.map((id) => eq(ideas.id, id))));
  }

  /**
   * Search ideas by text (searches in translation keys)
   */
  static async searchIdeas(searchTerm: string): Promise<Idea[]> {
    const pattern = `%${searchTerm.toLowerCase()}%`;

    return await db
      .select()
      .from(ideas)
      .where(
        or(
          like(ideas.ideaKey, pattern),
          like(ideas.problemKey, pattern),
          like(ideas.solutionKey, pattern),
          like(ideas.owner, pattern)
        )
      )
      .orderBy(desc(ideas.priorityScore));
  }

  /**
   * Get ideas with high priority scores
   */
  static async getTopPriorityIdeas(limit = 10): Promise<Idea[]> {
    return await db
      .select()
      .from(ideas)
      .orderBy(desc(ideas.priorityScore))
      .limit(limit);
  }

  /**
   * Get ideas by complexity range
   */
  static async getIdeasByComplexity(
    minComplexity: number,
    maxComplexity: number
  ): Promise<Idea[]> {
    return await db
      .select()
      .from(ideas)
      .where(
        and(
          gte(ideas.complexity, minComplexity),
          lte(ideas.complexity, maxComplexity)
        )
      )
      .orderBy(asc(ideas.complexity));
  }

  /**
   * Get ideas by ROI range
   */
  static async getIdeasByROI(minROI: number, maxROI: number): Promise<Idea[]> {
    return await db
      .select()
      .from(ideas)
      .where(and(gte(ideas.roi, minROI), lte(ideas.roi, maxROI)))
      .orderBy(desc(ideas.roi));
  }

  /**
   * Update an idea
   */
  static async updateIdea(
    ideaId: string,
    updates: Partial<Omit<NewIdea, "id">>
  ): Promise<void> {
    await db
      .update(ideas)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(ideas.id, ideaId));
  }

  /**
   * Update priority score for an idea
   */
  static async updatePriorityScore(
    ideaId: string,
    score: number
  ): Promise<void> {
    await db
      .update(ideas)
      .set({ priorityScore: score.toString(), updatedAt: new Date() })
      .where(eq(ideas.id, ideaId));
  }

  /**
   * Get ideas count by department
   */
  static async getIdeasCountByDepartment(): Promise<
    Array<{ departmentId: string; count: number }>
  > {
    const result = await db
      .select({
        departmentId: ideas.departmentId,
        id: ideas.id,
      })
      .from(ideas);

    // Count manually since Drizzle doesn't have clean GROUP BY yet
    const counts = new Map<string, number>();
    for (const row of result) {
      counts.set(row.departmentId, (counts.get(row.departmentId) || 0) + 1);
    }

    return Array.from(counts.entries()).map(([departmentId, count]) => ({
      departmentId,
      count,
    }));
  }

  /**
   * Create a new idea
   */
  static async createIdea(idea: NewIdea): Promise<Idea> {
    const result = await db.insert(ideas).values(idea).returning();
    return result[0];
  }

  /**
   * Delete an idea
   */
  static async deleteIdea(ideaId: string): Promise<void> {
    await db.delete(ideas).where(eq(ideas.id, ideaId));
  }

  /**
   * Get ideas with their department info
   */
  static async getIdeasWithDepartments(): Promise<
    Array<Idea & { department: { id: string; name: string } }>
  > {
    const result = await db
      .select({
        // Idea fields
        id: ideas.id,
        departmentId: ideas.departmentId,
        workshopSessionId: ideas.workshopSessionId,
        finalPrio: ideas.finalPrio,
        ideaKey: ideas.ideaKey,
        problemKey: ideas.problemKey,
        solutionKey: ideas.solutionKey,
        owner: ideas.owner,
        complexity: ideas.complexity,
        cost: ideas.cost,
        roi: ideas.roi,
        risk: ideas.risk,
        strategicAlignment: ideas.strategicAlignment,
        priorityScore: ideas.priorityScore,
        createdAt: ideas.createdAt,
        updatedAt: ideas.updatedAt,
        // Department fields
        departmentName: departments.name,
      })
      .from(ideas)
      .leftJoin(departments, eq(ideas.departmentId, departments.id));

    return result.map((row) => ({
      ...row,
      department: {
        id: row.departmentId,
        name: row.departmentName || "Unknown",
      },
    }));
  }
}
