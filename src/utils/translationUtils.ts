import { useEffect } from "react";
import { useTranslation } from "react-i18next";

// Create a singleton translation utility
let translationFunction: ((key: string) => string) | null = null;

export const setTranslationFunction = (t: (key: string) => string) => {
  translationFunction = t;
};

export const getTranslatedText = (key: string): string => {
  if (translationFunction) {
    try {
      return translationFunction(key);
    } catch (error) {
      console.warn(`Translation failed for key: ${key}`, error);
    }
  }

  // Fallback: return the key itself
  return key;
};

// Hook to initialize translation function
export const useTranslationSetup = () => {
  const { t } = useTranslation();

  // Set the translation function when component mounts
  useEffect(() => {
    setTranslationFunction(t);
  }, [t]);

  return t;
};
