// Auto-discovery loader for dataset modules in `src/data/*`.
// Uses Vite's `import.meta.glob` to lazily import all modules that export `ideas`.

import i18next from "i18next";
import { MatrixRow, TranslatedString } from "../data/types";

type IdeasModule = {
  ideas: Record<string, unknown>;
};

export function getLocalizedString(str: TranslatedString | string): string {
  if (typeof str === "string") return str;
  const currentLang = i18next.language;
  return str[currentLang as keyof TranslatedString] || str.de || str.en || "";
}

export function processMatrixRow(
  row: Record<string, unknown>,
  source: string
): MatrixRow | null {
  const getString = (key: string): string => {
    const value = row[key];
    return typeof value === "string" ? value : "";
  };

  const getNumber = (key: string): number => {
    const value = row[key];
    return typeof value === "number" ? value : 0;
  };

  // Skip rows where Idee is empty or equals "Idee" (header row)
  const idea = getString("Idee");
  if (!idea || idea === "Idee") {
    return null;
  }

  // Create the matrix row
  return {
    id: getString("Unnamed: 0"),
    source,
    idea: {
      de: idea,
      en: getString("Idea") || idea,
    },
    problem: {
      de: getString("Problem"),
      en: getString("Problem_EN") || getString("Problem"),
    },
    solution: {
      de: getString("Lösung"),
      en: getString("Solution") || getString("Lösung"),
    },
    owner: getString("Ideenverantwortlicher"),
    priority: getString("Priorität (A, B, C)"),
    complexity: getNumber("Komplexität"),
    explanation: {
      de: getString("Erläuterung"),
      en: getString("Explanation") || getString("Erläuterung"),
    },
    cost: getNumber("Kosten (€)"),
    costExplanation: {
      de: getString("Erläuterung.1"),
      en: getString("CostExplanation") || getString("Erläuterung.1"),
    },
    roi: getNumber("ROI"),
    roiExplanation: {
      de: getString("Erläuterung.2"),
      en: getString("ROIExplanation") || getString("Erläuterung.2"),
    },
    risk: getNumber("Risiko"),
    riskExplanation: {
      de: getString("Erläuterung.3"),
      en: getString("RiskExplanation") || getString("Erläuterung.3"),
    },
    strategicAlignment: getNumber("Strategische Ausrichtung"),
    strategyExplanation: {
      de: getString("Erläuterung.4"),
      en: getString("StrategyExplanation") || getString("Erläuterung.4"),
    },
    finalPriority: getString("Final prio") || getString("Final Prios"),
    weightedScore: getNumber("Gewichtete Punktzahl"),
  };
}

export async function loadAllData(): Promise<Record<string, IdeasModule>> {
  // Keep for compatibility: load all data (not used by new on-demand helpers)
  const modules = import.meta.glob("../data/*.ts") as Record<
    string,
    () => Promise<Record<string, unknown> | IdeasModule>
  >;
  const res: Record<string, IdeasModule> = {};

  await Promise.all(
    Object.entries(modules).map(async ([path, importer]) => {
      try {
        const mod = await importer();
        const parts = path.split("/");
        const last = parts[parts.length - 1] || path;
        const key = last.replace(/\.ts$/, "");
        if ((mod as IdeasModule)?.ideas) res[key] = mod as IdeasModule;
      } catch (err) {
        console.warn(`Failed to import dataset module ${path}:`, err);
      }
    })
  );

  return res;
}

export async function listDataKeys(): Promise<string[]> {
  // Derive keys directly from the glob entries without importing modules.
  const modules = import.meta.glob("../data/*.ts");
  const keys = Object.keys(modules).map((path) => {
    const parts = path.split("/");
    const last = parts[parts.length - 1] || path;
    return last.replace(/\.ts$/, "");
  });
  return keys.sort((a, b) => a.localeCompare(b));
}

export async function getIdeasFor(
  key: string
): Promise<Record<string, unknown> | null> {
  try {
    // Import the specific dataset module on-demand.
    const mod = (await import(`../data/${key}.ts`)) as {
      ideas?: Record<string, unknown>;
    };
    return mod?.ideas ?? null;
  } catch (err) {
    console.warn(`Failed to import dataset ${key}:`, err);
    return null;
  }
}
