// Auto-discovery loader for dataset modules in `src/data/*`.
// Uses Vite's `import.meta.glob` to lazily import all modules that export `ideas`.

type IdeasModule = {
  ideas: Record<string, unknown>;
};

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
