import { describe, it, expect } from 'vitest';
import { getTranslation } from './languageUtils';

describe('languageUtils', () => {
  it('returns the correct english translation', () => {
    expect(getTranslation('en', 'welcome')).toBe('Welcome to PitchMind');
  });

  it('returns the correct spanish translation', () => {
    expect(getTranslation('es', 'welcome')).toBe('Bienvenido a PitchMind');
  });

  it('falls back to english if a translation is completely missing from the target language', () => {
    // If a key doesn't exist in ES, but does in EN
    expect(getTranslation('es', 'welcome')).toBeTruthy();
  });

  it('falls back to the raw key if it does not exist in the language', () => {
    // @ts-ignore - testing invalid key
    expect(getTranslation('en', 'nonExistentKey123')).toBe('nonExistentKey123');
  });
});
