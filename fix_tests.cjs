const fs = require('fs');
const file = 'src/services/aiService.test.ts';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/generateAIResponse\((.*?),\s*(['"].*?['"]),\s*(mockData|emptyData)\)/g, 'generateAIResponse($1, { role: $2 as any, stadiumState: $3 })');
content = content.replace(/generateAIResponse\('ajsdklfjsdf',\s*'(.*?)'\s*as.*?, mockData\)/g, 'generateAIResponse(\'ajsdklfjsdf\', { role: \'$1\' as any, stadiumState: mockData })');
fs.writeFileSync(file, content);
console.log('Fixed arguments in aiService.test.ts');
