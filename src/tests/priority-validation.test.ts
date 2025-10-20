import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Helper to calculate priority based on metrics
const calculatePriorityScore = (
  complexity: number,
  cost: number,
  roi: number,
  risk: number,
  strategic: number
): number => {
  // Implementation based on priority-calculator logic
  // ROI and strategic alignment are positive, complexity, cost and risk are negative
  const positiveScore = roi + strategic;
  const negativeScore = complexity + cost + risk;
  return positiveScore - negativeScore;
};

describe("Priority Calculations Validation", () => {
  describe("Priority Calculations", () => {
    it("should validate priority calculations are mathematically consistent", async () => {
      const dataDir = path.resolve(__dirname, "../data");
      const departmentDataFiles = fs
        .readdirSync(dataDir)
        .filter(
          (file) =>
            file.endsWith(".ts") &&
            !["types.ts", "participants.ts"].includes(file)
        );

      for (const file of departmentDataFiles) {
        const departmentName = file.replace(".ts", "");
        const mod = await import(`../data/${departmentName}.ts`);

        if (!mod.ideas?.ideas) continue;

        const ideasWithScores = mod.ideas.ideas.map((idea: unknown) => {
          const typedIdea = idea as Record<string, unknown>;
          return {
            ...typedIdea,
            calculatedScore: calculatePriorityScore(
              typedIdea.complexity as number,
              typedIdea.cost as number,
              typedIdea.roi as number,
              typedIdea.risk as number,
              typedIdea.strategicAlignment as number
            ),
          };
        });

        // Sort by calculated score (higher score = higher priority = lower final number)
        const sortedByScore = [...ideasWithScores].sort(
          (a, b) => b.calculatedScore - a.calculatedScore
        );

        // Validate if finalPrio order matches score order
        validatePriorityOrder(sortedByScore, departmentName);
      }
    });
  });

  const validatePriorityOrder = (
    sortedIdeas: Array<Record<string, unknown>>,
    departmentName: string
  ) => {
    for (let i = 0; i < sortedIdeas.length - 1; i++) {
      const current = sortedIdeas[i];
      const next = sortedIdeas[i + 1];

      // If scores are different, final priorities should reflect this
      if (current.calculatedScore !== next.calculatedScore) {
        const currentPrio = extractPriorityNumber(current.finalPrio);
        const nextPrio = extractPriorityNumber(next.finalPrio);

        const currentKey = current.ideaKey as string;
        const nextKey = next.ideaKey as string;
        const currentScore = current.calculatedScore as number;
        const nextScore = next.calculatedScore as number;

        expect(
          currentPrio,
          `In ${departmentName}: ${currentKey} (score: ${currentScore}) should have lower finalPrio than ${nextKey} (score: ${nextScore})`
        ).toBeLessThanOrEqual(nextPrio);
      }
    }
  };

  const extractPriorityNumber = (finalPrio: unknown): number => {
    if (typeof finalPrio === "string") {
      return Number.parseInt(finalPrio.split("-")[0] || finalPrio, 10);
    }
    return finalPrio as number;
  };

  it("should validate all metrics are within valid ranges", async () => {
    const dataDir = path.resolve(__dirname, "../data");
    const departmentDataFiles = fs
      .readdirSync(dataDir)
      .filter(
        (file) =>
          file.endsWith(".ts") &&
          !["types.ts", "participants.ts"].includes(file)
      );

    const metrics = ["complexity", "cost", "roi", "risk", "strategicAlignment"];

    for (const file of departmentDataFiles) {
      const departmentName = file.replace(".ts", "");
      const mod = await import(`../data/${departmentName}.ts`);

      if (!mod.ideas?.ideas) continue;

      for (const idea of mod.ideas.ideas) {
        for (const metric of metrics) {
          const value = idea[metric];
          expect(
            value,
            `${metric} in ${departmentName}:${idea.ideaKey} must be between 1-5`
          ).toBeGreaterThanOrEqual(1);
          expect(
            value,
            `${metric} in ${departmentName}:${idea.ideaKey} must be between 1-5`
          ).toBeLessThanOrEqual(5);
          expect(
            Number.isInteger(value),
            `${metric} in ${departmentName}:${idea.ideaKey} must be an integer`
          ).toBe(true);
        }
      }
    }
  });

  it("should validate owner field is consistently formatted", async () => {
    const dataDir = path.resolve(__dirname, "../data");
    const departmentDataFiles = fs
      .readdirSync(dataDir)
      .filter(
        (file) =>
          file.endsWith(".ts") &&
          !["types.ts", "participants.ts"].includes(file)
      );

    for (const file of departmentDataFiles) {
      const departmentName = file.replace(".ts", "");
      const mod = await import(`../data/${departmentName}.ts`);

      if (!mod.ideas?.ideas) continue;

      for (const idea of mod.ideas.ideas) {
        expect(
          idea.owner,
          `Owner in ${departmentName}:${idea.ideaKey} must be defined`
        ).toBeDefined();
        expect(
          typeof idea.owner,
          `Owner in ${departmentName}:${idea.ideaKey} must be a string`
        ).toBe("string");
        expect(
          idea.owner.trim().length,
          `Owner in ${departmentName}:${idea.ideaKey} must not be empty`
        ).toBeGreaterThan(0);
      }
    }
  });

  it("should validate department home info matches expected format", async () => {
    const dataDir = path.resolve(__dirname, "../data");
    const departmentDataFiles = fs
      .readdirSync(dataDir)
      .filter(
        (file) =>
          file.endsWith(".ts") &&
          !["types.ts", "participants.ts"].includes(file)
      );

    for (const file of departmentDataFiles) {
      const departmentName = file.replace(".ts", "");
      const mod = await import(`../data/${departmentName}.ts`);

      if (!mod.ideas?.home) continue;

      expect(Array.isArray(mod.ideas.home)).toBe(true);

      if (mod.ideas.home.length > 0) {
        const homeInfo = mod.ideas.home[0];

        // Validate date format
        if (homeInfo.date) {
          expect(homeInfo.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);

          // Validate if it's a valid date
          const dateObj = new Date(homeInfo.date);
          expect(dateObj.getTime()).not.toBeNaN();
        }

        // Validate collaboard URL
        if (homeInfo.collaboardLink) {
          expect(homeInfo.collaboardLink).toMatch(/^https?:\/\/.+/);
        }

        // Validate department name
        if (homeInfo.department) {
          expect(typeof homeInfo.department).toBe("string");
          expect(homeInfo.department.trim().length).toBeGreaterThan(0);
        }
      }
    }
  });

  it("should validate ideas have unique keys within department", async () => {
    const dataDir = path.resolve(__dirname, "../data");
    const departmentDataFiles = fs
      .readdirSync(dataDir)
      .filter(
        (file) =>
          file.endsWith(".ts") &&
          !["types.ts", "participants.ts"].includes(file)
      );

    for (const file of departmentDataFiles) {
      const departmentName = file.replace(".ts", "");
      const mod = await import(`../data/${departmentName}.ts`);

      if (!mod.ideas?.ideas) continue;

      const ideaKeys = mod.ideas.ideas.map(
        (idea: unknown) => (idea as Record<string, unknown>).ideaKey
      );
      const uniqueKeys = new Set(ideaKeys);

      expect(
        uniqueKeys.size,
        `All idea keys in ${departmentName} must be unique`
      ).toBe(ideaKeys.length);

      // Validate all ideaKeys follow the pattern department.ideas.identifier
      for (const key of ideaKeys) {
        if (typeof key === "string") {
          expect(key).toMatch(/^[a-z_0-9]+\.ideas\.[a-z_0-9]+$/);
          expect(key.startsWith(departmentName.replace(/-/g, "_") + "."),
          `Key "${key}" in department "${departmentName}" does not start with "${departmentName.replace(/-/g, "_")}."`).toBe(
            true
          );
        }
      }
    }
  });
});
