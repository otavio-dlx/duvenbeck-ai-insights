#!/usr/bin/env tsx
import "dotenv/config"; // Load environment variables
import { globSync } from "glob";
import fs from "node:fs";
import path from "node:path";
import {
  db,
  departments,
  ideas,
  translations,
  workshopSessions,
} from "../src/lib/database/index";
import type { DepartmentData, NewFormatIdea } from "../src/types/ideas";

// Import translation files
const deTranslations = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "src/i18n/locales/de.json"), "utf-8")
);
const enTranslations = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "src/i18n/locales/en.json"), "utf-8")
);

// Node.js compatible data loading functions
async function listDataKeys(): Promise<string[]> {
  const dataDir = path.join(process.cwd(), "src/data");
  const files = globSync("*.ts", { cwd: dataDir });
  return files
    .filter((file) => file !== "types.ts" && file !== "participants.ts")
    .map((file) => file.replace(/\.ts$/, ""))
    .sort();
}

async function getIdeasFor(key: string): Promise<DepartmentData | null> {
  try {
    const modulePath = path.join(process.cwd(), "src/data", `${key}.ts`);
    if (!fs.existsSync(modulePath)) {
      return null;
    }

    // Use dynamic import for Node.js
    const module = await import(modulePath);
    return module.ideas || null;
  } catch (error) {
    console.warn(`Failed to load data for ${key}:`, error);
    return null;
  }
}

async function seedDatabase() {
  console.log("🌱 Starting database seeding...");

  try {
    // 1. Seed departments
    console.log("📁 Seeding departments...");
    const dataKeys = await listDataKeys();

    for (const key of dataKeys) {
      const data = (await getIdeasFor(key)) as DepartmentData | null;
      if (!data || !data.home?.[0]) {
        console.warn(`⚠️ No data found for ${key}`);
        continue;
      }

      const homeInfo = data.home[0];

      await db
        .insert(departments)
        .values({
          id: key,
          name: homeInfo.department,
          description: `Workshop data for ${homeInfo.department}`,
          collaboardLink: homeInfo.collaboardLink,
        })
        .onConflictDoNothing();

      console.log(`✅ Department: ${homeInfo.department}`);
    }

    // 2. Seed workshop sessions
    console.log("🎯 Seeding workshop sessions...");
    for (const key of dataKeys) {
      const data = (await getIdeasFor(key)) as DepartmentData | null;
      if (!data || !data.home?.[0]) continue;

      const homeInfo = data.home[0];

      await db
        .insert(workshopSessions)
        .values({
          id: `${key}-workshop-${homeInfo.date}`,
          departmentId: key,
          date: new Date(homeInfo.date),
          collaboardLink: homeInfo.collaboardLink,
        })
        .onConflictDoNothing();

      console.log(`✅ Workshop session: ${key}`);
    }

    // 3. Seed ideas
    console.log("💡 Seeding ideas...");
    let ideaCount = 0;

    for (const key of dataKeys) {
      const data = (await getIdeasFor(key)) as DepartmentData | null;
      if (!data || !data.home?.[0] || !data.ideas) continue;

      const workshopId = `${key}-workshop-${data.home[0].date}`;

      for (const idea of data.ideas) {
        // Handle cases where owner might be empty
        const owner = idea.owner || "Unknown";

        await db
          .insert(ideas)
          .values({
            id: idea.ideaKey.replaceAll(".", "-"),
            departmentId: key,
            workshopSessionId: workshopId,
            finalPrio: String(idea.finalPrio),
            ideaKey: idea.ideaKey,
            problemKey: idea.problemKey,
            solutionKey: idea.solutionKey,
            owner,
            complexity: idea.complexity,
            cost: idea.cost,
            roi: idea.roi,
            risk: idea.risk,
            strategicAlignment: idea.strategicAlignment,
            priorityScore: calculatePriorityScore(idea),
          })
          .onConflictDoNothing();

        ideaCount++;
      }

      console.log(`✅ Ideas for ${key}: ${data.ideas.length} ideas`);
    }

    // 4. Seed translations
    console.log("🌐 Seeding translations...");
    await seedTranslations("de", deTranslations);
    await seedTranslations("en", enTranslations);

    console.log("🎉 Database seeding completed successfully!");
    console.log(
      `📊 Seeded: ${dataKeys.length} departments, ${ideaCount} ideas, ${
        Object.keys(deTranslations).length + Object.keys(enTranslations).length
      } translations`
    );
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

async function seedTranslations(
  language: string,
  translationData: Record<string, unknown>,
  prefix = ""
) {
  for (const [key, value] of Object.entries(translationData)) {
    const translationKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === "object" && value !== null) {
      // Recursively handle nested objects
      await seedTranslations(
        language,
        value as Record<string, unknown>,
        translationKey
      );
    } else if (typeof value === "string") {
      // Insert translation
      await db
        .insert(translations)
        .values({
          id: `${translationKey}-${language}`,
          translationKey,
          language,
          value: value as string,
          category: getCategoryFromKey(translationKey),
        })
        .onConflictDoNothing();
    }
  }
}

function getCategoryFromKey(key: string): string {
  if (key.includes(".ideas.")) return "ideas";
  if (key.includes(".problems.")) return "problems";
  if (key.includes(".solutions.")) return "solutions";
  if (key.includes(".ui.")) return "ui";
  if (key.includes(".common.")) return "common";
  return "general";
}

function calculatePriorityScore(idea: NewFormatIdea): string {
  // Simple priority calculation based on the existing formula
  const impact = (idea.roi + idea.strategicAlignment) / 2;
  const effort = (idea.complexity + idea.cost) / 2;
  const riskFactor = 6 - idea.risk; // Invert risk (lower risk = higher score)

  const score = impact * 0.4 + riskFactor * 0.3 + (6 - effort) * 0.3;
  return score.toFixed(2);
}

// Run the seeder
await seedDatabase();
