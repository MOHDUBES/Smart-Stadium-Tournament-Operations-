const fs = require('fs');
const path = require('path');

const srcDirs = [
  path.join(__dirname, 'src/components'),
  path.join(__dirname, 'src/pages')
];

function generateTest(filePath, componentName) {
  const relativePath = './' + path.basename(filePath, path.extname(filePath));
  return `// @ts-nocheck
import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ${componentName} from '${relativePath}';

describe('${componentName}', () => {
  it('renders without crashing', () => {
    const { container } = render(<${componentName} />);
    expect(container).toBeTruthy();
  });
});
`;
}

srcDirs.forEach(dir => {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    if (file.endsWith('.tsx') && !file.endsWith('.test.tsx')) {
      const componentName = path.basename(file, '.tsx');
      const testPath = path.join(dir, `${componentName}.test.tsx`);
      if (!fs.existsSync(testPath)) {
        console.log(`Generating test for ${componentName}`);
        fs.writeFileSync(testPath, generateTest(path.join(dir, file), componentName));
      }
    }
  });
});
console.log('Test generation complete.');
