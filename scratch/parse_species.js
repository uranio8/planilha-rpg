const fs = require('fs');

const filePath = 'C:/Users/wesle/.gemini/antigravity-ide/brain/69148662-a146-4270-b733-3782f211f83c/.system_generated/steps/695/content.md';
const raw = fs.readFileSync(filePath, 'utf8');

const entryMatch = raw.match(/<div class=['"]entry['"]>([\s\S]*?)<div class=['"]post-footer/i) ||
                   raw.match(/<div class=['"]entry['"]>([\s\S]*?)<div style=['"]clear:\s*both;/i);

const cleanText = entryMatch[1]
  .replace(/<script[\s\S]*?<\/script>/gi, '')
  .replace(/<style[\s\S]*?<\/style>/gi, '')
  .replace(/&nbsp;/gi, ' ')
  .replace(/<br\s*\/?>/gi, '\n')
  .replace(/<p[^>]*>/gi, '\n')
  .replace(/<\/p>/gi, '\n')
  .replace(/<[^>]+>/g, ' ')
  .replace(/\n\s*\n\s*\n+/g, '\n\n')
  .trim();

fs.writeFileSync('scratch/species_text.txt', cleanText, 'utf8');
console.log('Saved scratch/species_text.txt, length:', cleanText.length);
