// Shared types to avoid circular imports

export interface TranslatedString {
  de: string;
  en: string;
}

// Union type to handle both old format (TranslatedString) and new format (translation key)
export type LocalizableString = TranslatedString | string;
