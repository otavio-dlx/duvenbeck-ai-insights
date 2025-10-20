import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Function to validate if frontend data matches documentation
const validateDataConsistency = () => {
  const dataDir = path.resolve(__dirname, "../data");
  const docsDir = path.resolve(__dirname, "../../docs/departments");

  const departmentDataFiles = fs
    .readdirSync(dataDir)
    .filter(
      (file) =>
        file.endsWith(".ts") && !["types.ts", "participants.ts"].includes(file)
    );

  const departmentDocsFiles = fs
    .readdirSync(docsDir)
    .filter((file) => file.endsWith(".md"));

  return { departmentDataFiles, departmentDocsFiles };
};

describe("Data Consistency Between Frontend and Documentation", () => {
  it("should have corresponding documentation for each department data file", () => {
    const { departmentDataFiles, departmentDocsFiles } =
      validateDataConsistency();

    for (const dataFile of departmentDataFiles) {
      const departmentName = dataFile.replace(".ts", "");
      const expectedDocFile = `${departmentName}.md`;

      expect(departmentDocsFiles).toContain(expectedDocFile);
    }
  });

  it("should validate department data structure matches expected format", async () => {
    const { departmentDataFiles } = validateDataConsistency();

    for (const file of departmentDataFiles) {
      const departmentName = file.replace(".ts", "");
      const mod = await import(`../data/${departmentName}.ts`);

      if (!mod.ideas) continue;

      // Validate home structure
      expect(mod.ideas.home).toBeDefined();
      expect(Array.isArray(mod.ideas.home)).toBe(true);

      if (mod.ideas.home.length > 0) {
        const homeInfo = mod.ideas.home[0];
        expect(homeInfo.date).toBeDefined();
        expect(homeInfo.department).toBeDefined();
        expect(homeInfo.collaboardLink).toBeDefined();
      }

      // Validate ideas structure
      expect(mod.ideas.ideas).toBeDefined();
      expect(Array.isArray(mod.ideas.ideas)).toBe(true);

      for (const idea of mod.ideas.ideas) {
        // Required fields
        expect(idea.finalPrio).toBeDefined();
        expect(idea.ideaKey).toBeDefined();
        expect(idea.problemKey).toBeDefined();
        expect(idea.solutionKey).toBeDefined();
        expect(idea.owner).toBeDefined();

        // Numeric metrics must be in valid range (0-5)
        expect(idea.complexity).toBeGreaterThanOrEqual(0);
        expect(idea.complexity).toBeLessThanOrEqual(5);
        expect(idea.cost).toBeGreaterThanOrEqual(0);
        expect(idea.cost).toBeLessThanOrEqual(5);
        expect(idea.roi).toBeGreaterThanOrEqual(0);
        expect(idea.roi).toBeLessThanOrEqual(5);
        expect(idea.risk).toBeGreaterThanOrEqual(0);
        expect(idea.risk).toBeLessThanOrEqual(5);
        expect(idea.strategicAlignment).toBeGreaterThanOrEqual(0);
        expect(idea.strategicAlignment).toBeLessThanOrEqual(5);
      }
    }
  });

  it("should validate priority calculations are consistent", async () => {
    const { departmentDataFiles } = validateDataConsistency();

    for (const file of departmentDataFiles) {
      const departmentName = file.replace(".ts", "");
      const mod = await import(`../data/${departmentName}.ts`);

      if (!mod.ideas?.ideas) continue;

      // Validate final priorities are in ascending order or valid
      for (const idea of mod.ideas.ideas) {
        // Validate finalPrio is a valid number or string
        expect(idea.finalPrio).toBeDefined();

        // If number, must be positive
        if (typeof idea.finalPrio === "number") {
          expect(idea.finalPrio).toBeGreaterThan(0);
        }

        // If string, must follow pattern like "1-A", "2-B", "A", etc.
        if (typeof idea.finalPrio === "string") {
          expect(idea.finalPrio).toMatch(/^(\d+(-[A-Z])?|[A-Z])$/);
        }
      }
    }
  });

  describe("Translation Keys Validation", () => {
    const enTranslations = JSON.parse(
      fs.readFileSync(
        path.resolve(__dirname, "../i18n/locales/en.json"),
        "utf-8"
      )
    );
    const deTranslations = JSON.parse(
      fs.readFileSync(
        path.resolve(__dirname, "../i18n/locales/de.json"),
        "utf-8"
      )
    );

    const getNestedValue = (
      obj: Record<string, unknown>,
      key: string
    ): unknown => {
      const keys = key.split(".");
      let current = obj;
      for (const k of keys) {
        if (current && typeof current === "object" && k in current) {
          current = current[k] as Record<string, unknown>;
        } else {
          return undefined;
        }
      }
      return current;
    };

    it("should validate main translation keys exist", async () => {
      const { departmentDataFiles } = validateDataConsistency();
      const keysToCheck = ["ideaKey", "problemKey", "solutionKey"];

      for (const file of departmentDataFiles) {
        const departmentName = file.replace(".ts", "");
        const mod = await import(`../data/${departmentName}.ts`);

        if (!mod.ideas?.ideas) continue;

        for (const idea of mod.ideas.ideas) {
          for (const keyField of keysToCheck) {
            const translationKey = idea[keyField];
            if (translationKey && typeof translationKey === "string") {
              const enValue = getNestedValue(enTranslations, translationKey);
              const deValue = getNestedValue(deTranslations, translationKey);

              expect(
                enValue,
                `EN: ${translationKey} in ${departmentName}`
              ).toBeDefined();
              expect(
                deValue,
                `DE: ${translationKey} in ${departmentName}`
              ).toBeDefined();
            }
          }
        }
      }
    });

    it("should validate note translation keys exist", async () => {
      const { departmentDataFiles } = validateDataConsistency();
      const noteKeys = [
        "complexityNoteKey",
        "costNoteKey",
        "roiNoteKey",
        "riskNoteKey",
        "strategicNoteKey",
      ];

      for (const file of departmentDataFiles) {
        const departmentName = file.replace(".ts", "");
        const mod = await import(`../data/${departmentName}.ts`);

        if (!mod.ideas?.ideas) continue;

        for (const idea of mod.ideas.ideas) {
          for (const keyField of noteKeys) {
            const translationKey = idea[keyField];
            if (translationKey && typeof translationKey === "string") {
              const enValue = getNestedValue(enTranslations, translationKey);
              const deValue = getNestedValue(deTranslations, translationKey);

              expect(
                enValue,
                `EN note: ${translationKey} in ${departmentName}`
              ).toBeDefined();
              expect(
                deValue,
                `DE note: ${translationKey} in ${departmentName}`
              ).toBeDefined();
            }
          }
        }
      }
    });
  });

  it("should validate documentation contains information matching data files", async () => {
    const { departmentDataFiles } = validateDataConsistency();
    const docsDir = path.resolve(__dirname, "../../docs/departments");

    for (const file of departmentDataFiles) {
      const departmentName = file.replace(".ts", "");
      const mod = await import(`../data/${departmentName}.ts`);

      if (!mod.ideas?.ideas || mod.ideas.ideas.length === 0) continue;

      const docFile = path.join(docsDir, `${departmentName}.md`);
      if (!fs.existsSync(docFile)) continue;

      const docContent = fs.readFileSync(docFile, "utf-8");
      const homeInfo = mod.ideas.home[0];

      // Validate documentation contains basic information
      if (homeInfo?.department) {
        // Documentation should mention the department
        expect(docContent.toLowerCase()).toContain(
          homeInfo.department.toLowerCase()
        );
      }

      if (homeInfo?.date) {
        // Documentation may contain the date (flexible format)
        const year = homeInfo.date.split("-")[0];
        expect(docContent).toContain(year);
      }

      // Check if there are mentions of metrics like complexity, cost, ROI, etc.
      const hasMetricsTable =
        docContent.includes("Complexity") ||
        docContent.includes("Cost") ||
        docContent.includes("ROI");

      if (mod.ideas.ideas.length > 0) {
        // If there are ideas, there should be some structure in the documentation
        expect(hasMetricsTable || docContent.includes("##")).toBe(true);
      }
    }
  });
});
