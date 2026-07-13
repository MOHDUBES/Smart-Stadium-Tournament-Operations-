const fs = require('fs');
const path = require('path');

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            
            // Fix catch parameters
            content = content.replace(/catch \([a-zA-Z_]+\) \{/g, 'catch {');
            
            // Fix specific unused variables in aiService.ts
            if (fullPath.endsWith('aiService.ts')) {
                content = content.replace(/let lastCallTime = 0;\nconst API_COOLDOWN = 2000; \/\/ 2 seconds\n/g, '');
            }

            // Fix specific unused imports in Background3D.test.tsx
            if (fullPath.endsWith('Background3D.test.tsx')) {
                content = content.replace(/import { render } from '@testing-library\/react';\n/g, '');
                content = content.replace(/import { MemoryRouter } from 'react-router-dom';\n/g, '');
                content = content.replace(/import Background3D from '.\/Background3D';\n/g, '');
            }

            // Fix specific unused imports in StadiumMap3D.test.tsx
            if (fullPath.endsWith('StadiumMap3D.test.tsx')) {
                content = content.replace(/import { render } from '@testing-library\/react';\n/g, '');
                content = content.replace(/import StadiumMap3D from '.\/StadiumMap3D';\n/g, '');
            }

            // Fix specific unused imports in Logo3D.test.tsx
            if (fullPath.endsWith('Logo3D.test.tsx')) {
                content = content.replace(/import { render } from '@testing-library\/react';\n/g, '');
                content = content.replace(/import { MemoryRouter } from 'react-router-dom';\n/g, '');
                content = content.replace(/import Logo3D from '.\/Logo3D';\n/g, '');
            }

            fs.writeFileSync(fullPath, content);
        }
    }
}

walkDir('./src');
console.log('Fixed unused variables!');
