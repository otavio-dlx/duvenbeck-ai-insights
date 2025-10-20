// Auto-discovery loader for dataset modules in `src/data/*`.
// Uses Vite's `import.meta.glob` to lazily import all modules that export `ideas`.

import i18next from "i18next";
import { LocalizableString, TranslatedString } from "../types/shared";

type IdeasModule = {
  ideas: Record<string, unknown>;
};

export function getLocalizedString(str: LocalizableString): string {
  if (typeof str === "string") {
    // Check if it's a translation key (contains dots)
    if (str.includes(".")) {
      const translation = i18next.t(str);
      // If translation is the same as the key, it means translation wasn't found
      if (translation !== str) {
        return translation;
      }
      console.warn(`Translation key not found: ${str}`);
      return str;
    }
    // If it's just a plain string, return as is
    return str;
  }

  // Handle TranslatedString objects (old format)
  const currentLang = i18next.language;
  return str[currentLang as keyof TranslatedString] || str.de || str.en || "";
}

// Removed processMatrixRow function - focusing on new format only

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
        const last = parts.at(-1) || path;
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
    const last = parts.at(-1) || path;
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
