const fs = require('fs');
const path = require('path');

const contentPath = 'C:\\Users\\wesle\\.gemini\\antigravity-ide\\brain\\69148662-a146-4270-b733-3782f211f83c\\.system_generated\\steps\\794\\content.md';
const content = fs.readFileSync(contentPath, 'utf8');

// Match lines like: [AbolethCR 10](https://pocketdm.com.br/monstros/aboleth)
// [AAbominação YetiYeti AbominationCR 12r/](https://pocketdm.com.br/monstros/abominacao-yeti)
// [AbutreVultureCR 0](https://pocketdm.com.br/monstros/abutre)
const regex = /\[(.*?)\]\((https:\/\/pocketdm\.com\.br\/monstros\/[^)]+)\)/g;

let match;
const monsters = [];

while ((match = regex.exec(content)) !== null) {
  const rawText = match[1];
  const url = match[2];
  
  if (url.includes('/tipo') || url.includes('/nd') || url.includes('/tamanho') || url.includes('#letter')) continue;

  monsters.push({
    rawText,
    url,
    slug: url.split('/monstros/')[1]
  });
}

console.log(`Encontrados ${monsters.length} monstros listados.`);
console.log('Primeiros 10:', monsters.slice(0, 10));
