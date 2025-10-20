import {
  db,
  translations,
  type NewTranslation,
  type Translation,
} from "@/lib/database";
import { and, eq, like } from "drizzle-orm";

export class TranslationsService {
  /**
   * Get translation by key and language
   */
  static async getTranslation(
    translationKey: string,
    language: string
  ): Promise<string | null> {
    const result = await db
      .select({ value: translations.value })
      .from(translations)
      .where(
        and(
          eq(translations.translationKey, translationKey),
          eq(translations.language, language)
        )
      )
      .limit(1);

    return result[0]?.value || null;
  }

  /**
   * Get all translations for a specific language
   */
  static async getTranslationsForLanguage(
    language: string
  ): Promise<Record<string, string>> {
    const result = await db
      .select({
        key: translations.translationKey,
        value: translations.value,
      })
      .from(translations)
      .where(eq(translations.language, language));

    const translationMap: Record<string, string> = {};
    for (const row of result) {
      translationMap[row.key] = row.value;
    }

    return translationMap;
  }

  /**
   * Get translations for multiple keys in a specific language
   */
  static async getTranslationsForKeys(
    translationKeys: string[],
    language: string
  ): Promise<Record<string, string>> {
    if (translationKeys.length === 0) return {};

    const result = await db
      .select({
        key: translations.translationKey,
        value: translations.value,
      })
      .from(translations)
      .where(
        and(
          eq(translations.language, language),
          // Use OR with multiple eq conditions since inArray isn't available for text
          ...translationKeys.map((key) => eq(translations.translationKey, key))
        )
      );

    const translationMap: Record<string, string> = {};
    for (const row of result) {
      translationMap[row.key] = row.value;
    }

    return translationMap;
  }

  /**
   * Search translations by pattern
   */
  static async searchTranslations(
    searchPattern: string,
    language: string
  ): Promise<Translation[]> {
    const pattern = `%${searchPattern.toLowerCase()}%`;

    return await db
      .select()
      .from(translations)
      .where(
        and(
          eq(translations.language, language),
          like(translations.value, pattern)
        )
      );
  }

  /**
   * Get all translations for a specific category
   */
  static async getTranslationsByCategory(
    category: string,
    language: string
  ): Promise<Record<string, string>> {
    const result = await db
      .select({
        key: translations.translationKey,
        value: translations.value,
      })
      .from(translations)
      .where(
        and(
          eq(translations.language, language),
          eq(translations.category, category)
        )
      );

    const translationMap: Record<string, string> = {};
    for (const row of result) {
      translationMap[row.key] = row.value;
    }

    return translationMap;
  }

  /**
   * Create or update a translation
   */
  static async setTranslation(
    translationKey: string,
    language: string,
    value: string,
    category?: string
  ): Promise<void> {
    // Try to update first
    const updateResult = await db
      .update(translations)
      .set({
        value,
        category,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(translations.translationKey, translationKey),
          eq(translations.language, language)
        )
      );

    // If no rows were updated, insert new translation
    if (!updateResult) {
      await db.insert(translations).values({
        id: `${translationKey}-${language}`,
        translationKey,
        language,
        value,
        category,
      });
    }
  }

  /**
   * Create multiple translations at once
   */
  static async setTranslations(
    translationsData: Array<{
      key: string;
      language: string;
      value: string;
      category?: string;
    }>
  ): Promise<void> {
    if (translationsData.length === 0) return;

    const newTranslations: NewTranslation[] = translationsData.map((t) => ({
      id: `${t.key}-${t.language}`,
      translationKey: t.key,
      language: t.language,
      value: t.value,
      category: t.category,
    }));

    await db.insert(translations).values(newTranslations).onConflictDoNothing();
  }

  /**
   * Delete a translation
   */
  static async deleteTranslation(
    translationKey: string,
    language: string
  ): Promise<void> {
    await db
      .delete(translations)
      .where(
        and(
          eq(translations.translationKey, translationKey),
          eq(translations.language, language)
        )
      );
  }

  /**
   * Get all available languages
   */
  static async getAvailableLanguages(): Promise<string[]> {
    const result = await db
      .select({ language: translations.language })
      .from(translations);

    const languages = new Set<string>();
    for (const row of result) {
      languages.add(row.language);
    }

    return Array.from(languages);
  }

  /**
   * Get translation coverage (percentage of keys translated for each language)
   */
  static async getTranslationCoverage(): Promise<
    Array<{ language: string; coverage: number; totalKeys: number }>
  > {
    const result = await db
      .select({
        language: translations.language,
        key: translations.translationKey,
      })
      .from(translations);

    // Group by language and count unique keys
    const languageStats = new Map<string, Set<string>>();
    for (const row of result) {
      if (!languageStats.has(row.language)) {
        languageStats.set(row.language, new Set());
      }
      languageStats.get(row.language)?.add(row.key);
    }

    // Calculate total unique keys across all languages
    const allKeys = new Set<string>();
    for (const keys of languageStats.values()) {
      for (const key of keys) {
        allKeys.add(key);
      }
    }

    const totalKeys = allKeys.size;

    return Array.from(languageStats.entries()).map(([language, keys]) => ({
      language,
      coverage: totalKeys > 0 ? Math.round((keys.size / totalKeys) * 100) : 0,
      totalKeys: keys.size,
    }));
  }

  /**
   * Find missing translations (keys that exist in one language but not another)
   */
  static async findMissingTranslations(
    sourceLanguage: string,
    targetLanguage: string
  ): Promise<string[]> {
    const sourceKeys = await db
      .select({ key: translations.translationKey })
      .from(translations)
      .where(eq(translations.language, sourceLanguage));

    const targetKeys = await db
      .select({ key: translations.translationKey })
      .from(translations)
      .where(eq(translations.language, targetLanguage));

    const sourceKeySet = new Set(sourceKeys.map((row) => row.key));
    const targetKeySet = new Set(targetKeys.map((row) => row.key));

    const missingKeys: string[] = [];
    for (const key of sourceKeySet) {
      if (!targetKeySet.has(key)) {
        missingKeys.push(key);
      }
    }

    return missingKeys;
  }
}
