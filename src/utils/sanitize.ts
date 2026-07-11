import DOMPurify from 'dompurify';

/**
 * A robust HTML sanitizer using DOMPurify to prevent XSS and injection attacks.
 */
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  // Strips all HTML tags and attributes entirely, since we only expect plain text from users
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
};
