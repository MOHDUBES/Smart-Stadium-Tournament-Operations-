import { translations } from '../data/translations';
import type { SupportedLanguage } from '../data/translations';

/**
 * Safely gets a translated string, falling back to English if the key is missing in the target language.
 */
export const getTranslation = (
  lang: SupportedLanguage,
  key: keyof (typeof translations)['en']
): string => {
  const dictionary = translations[lang] || translations['en'];
  return dictionary[key] || translations['en'][key] || key;
};
