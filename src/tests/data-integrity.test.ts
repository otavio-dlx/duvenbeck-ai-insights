import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

// Carregar os arquivos de tradução uma vez
const enTranslations = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../i18n/locales/en.json'), 'utf-8'));
const deTranslations = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../i18n/locales/de.json'), 'utf-8'));

// Função auxiliar para buscar um valor aninhado em um objeto
const getNestedValue = (obj: any, key: string) => {
  if (!key) return undefined;
  return key.split('.').reduce((acc, part) => acc && acc[part], obj);
};

const dataDir = path.resolve(__dirname, '../data');
const departmentDataFiles = fs.readdirSync(dataDir)
  .filter(file => file.endsWith('.ts') && !['types.ts', 'participants.ts'].includes(file));

describe('Data Integrity and Translation Keys', () => {

  it('should find department data files to test', () => {
    expect(departmentDataFiles.length).toBeGreaterThan(0);
  });

  departmentDataFiles.forEach(async (file) => {
    const departmentName = file.replace('.ts', '');
    const mod = await import(`../data/${departmentName}.ts`);

    if (!mod.ideas || !Array.isArray(mod.ideas.ideas)) {
      return; // Pula arquivos que não têm a estrutura esperada
    }

    describe(`Department: ${departmentName}`, () => {
      mod.ideas.ideas.forEach((idea: any, index: number) => {
        const ideaIdentifier = idea.ideaKey || `unidentified-idea-${index}`;

        const keysToTest: (keyof any)[] = [
          'ideaKey',
          'problemKey',
          'solutionKey',
          'complexityNoteKey',
          'costNoteKey',
          'roiNoteKey',
          'riskNoteKey',
          'strategicNoteKey'
        ];

        keysToTest.forEach(key => {
          const translationKey = idea[key];
          if (translationKey) {
            it(`[${ideaIdentifier}] - key '${key}' (${translationKey}) should have a valid English translation`, () => {
              const translation = getNestedValue(enTranslations, translationKey);
              expect(translation, `English translation for ${translationKey} not found`).toBeDefined();
              expect(translation).not.toBeNull();
              expect(translation).not.toBe('');
            });

            it(`[${ideaIdentifier}] - key '${key}' (${translationKey}) should have a valid German translation`, () => {
              const translation = getNestedValue(deTranslations, translationKey);
              expect(translation, `German translation for ${translationKey} not found`).toBeDefined();
              expect(translation).not.toBeNull();
              expect(translation).not.toBe('');
            });
          }
        });
      });
    });
  });
});
