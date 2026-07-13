import { describe, it, expect } from 'vitest';
import { sanitizeInput } from './sanitize';

describe('sanitizeInput', () => {
  it('returns empty string if input is falsy', () => {
    expect(sanitizeInput('')).toBe('');
    expect(sanitizeInput(null as unknown as string)).toBe('');
  });

  it('removes HTML tags and attributes', () => {
    const input = '<script>alert("xss")</script>Hello <b onmouseover="alert()">World</b>';
    expect(sanitizeInput(input)).toBe('Hello World');
  });

  it('keeps plain text unchanged', () => {
    expect(sanitizeInput('Plain text is fine.')).toBe('Plain text is fine.');
  });
});
