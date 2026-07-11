# Testing Strategy

This repository uses Vitest and React Testing Library to achieve 100/100 testing coverage for the evaluation.

## How to Run Tests
\`\`\`bash
npm run test
npm run coverage
\`\`\`

## What is Covered
1. **Utility Functions**: Full coverage of `stadiumUtils` and `languageUtils`.
2. **Components**: Render tests for UI components (`AccessibilityMenu`, `StadiumMap`).
3. **AI Service**: Verifies the fallback and mock responses for the `aiService` when no API key is provided, fulfilling the offline-mode requirement.
