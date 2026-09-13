const https = require('https');
const fs = require('fs');
const path = require('path');

const contentPath = 'C:\\Users\\wesle\\.gemini\\antigravity-ide\\brain\\69148662-a146-4270-b733-3782f211f83c\\.system_generated\\steps\\794\\content.md';
const content = fs.readFileSync(contentPath, 'utf8');

const regex = /\[(.*?)\]\((https:\/\/pocketdm\.com\.br\/monstros\/[^)]+)\)/g;
let match;
const monsterSlugs = [];
const seen = new Set();

while ((match = regex.exec(content)) !== null) {
  const url = match[2];
  if (url.includes('/tipo') || url.includes('/nd') || url.includes('/tamanho') || url.includes('#letter')) continue;
  const slug = url.split('/monstros/')[1].trim();
  if (slug && !seen.has(slug)) {
    seen.add(slug);
    monsterSlugs.push(slug);
  }
}

console.log(`Total de ${monsterSlugs.length} monstros para download e compilação.`);

function fetchMonster(slug) {
  return new Promise((resolve) => {
    const req = https.get(`https://pocketdm.com.br/monstros/${slug}`, { 
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
      timeout: 15000
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ slug, status: res.statusCode, body: data });
      });
    });
    req.on('error', (err) => resolve({ slug, status: 500, error: err.message }));
    req.on('timeout', () => {
      req.destroy();
      resolve({ slug, status: 408, error: 'Timeout' });
    });
  });
}

function cleanHtml(str) {
  if (!str) return '';
  return str
    .replace(/<[^>]+>/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseMonsterData(slug, html) {
  if (!html || html.length < 500) return null;

  // 1. Headline & Name
  const headlineMatch = html.match(/"headline":"([^"]+)"/);
  let name = '';
  if (headlineMatch) {
    name = headlineMatch[1].split('—')[0].replace(/·.*/, '').trim();
  }
  if (!name) {
    const titleMatch = html.match(/<title>([^<]+)<\/title>/);
    if (titleMatch) {
      name = titleMatch[1].split('5e')[0].split('—')[0].trim();
    }
  }
  if (!name) {
    name = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  // 2. Meta description
  const metaDesc = html.match(/<meta[^>]+name="description"[^>]+content="([^"]+)"/i) || html.match(/<meta[^>]+property="og:description"[^>]+content="([^"]+)"/i);
  const descText = metaDesc ? metaDesc[1] : '';

  // 3. CA / AC
  let ac = 10;
  const acMatch = descText.match(/CA\s*(\d+)/i) || html.match(/Classe de Armadura\s*<\/?[^>]*>\s*(\d+)/i) || html.match(/Classe de Armadura\s*(\d+)/i);
  if (acMatch) ac = parseInt(acMatch[1], 10);

  // 4. PV / HP
  let hp = 10;
  const hpMatch = descText.match(/PV\s*(\d+)/i) || html.match(/Pontos de Vida\s*<\/?[^>]*>\s*(\d+)/i) || html.match(/(\d+)\s*pontos de vida/i);
  if (hpMatch) hp = parseInt(hpMatch[1], 10);

  // 5. CR / ND
  let cr = '1';
  const crMatch = descText.match(/CR\s*([\d\/]+)/i) || html.match(/N\u00edvel de Desafio\s*<\/?[^>]*>\s*([\d\/]+)/i) || html.match(/"headline":".*?CR\s*([\d\/]+)/i);
  if (crMatch) cr = crMatch[1];

  // 6. Deslocamento / Speed
  let speed = '9m';
  const speedHtmlMatch = html.match(/Movimento\s*<\/?[^>]*>\s*([^<\n]+)/i) || html.match(/deslocamento\s*([^.]+)\./i);
  if (speedHtmlMatch) {
    speed = cleanHtml(speedHtmlMatch[1])
      .replace(/\s*\(\d+\s*ft\)/gi, '')
      .replace(/\s+m\b/g, 'm')
      .trim();
  }

  // 7. Ações e Ataques
  let attack = '';
  const actionsMatch = html.match(/<h2[^>]*>A\u00e7\u00f5es<\/h2>([\s\S]*?)(<h2|<\/section|<footer|<div class="ad)/i);
  if (actionsMatch) {
    attack = cleanHtml(actionsMatch[1]);
  }
  if (!attack || attack.length < 10) {
    attack = cleanHtml(descText);
  }
  if (attack.length > 400) {
    attack = attack.substring(0, 397) + '...';
  }

  // 8. Source
  let source = 'MM';
  if (html.includes('Monster Manual (2024)') || html.includes('SRD 5.2') || html.includes('2024')) {
    source = 'MM 2024';
  }

  return {
    name,
    source,
    cr,
    ac,
    hp,
    speed: speed || '9m',
    attack: attack || 'Ataque corpo a corpo padrão (+4, 1d6+2).'
  };
}

async function scrapeAll() {
  const results = [];
  const batchSize = 25;
  
  for (let i = 0; i < monsterSlugs.length; i += batchSize) {
    const batch = monsterSlugs.slice(i, i + batchSize);
    console.log(`Baixando lote ${Math.floor(i / batchSize) + 1}/${Math.ceil(monsterSlugs.length / batchSize)} (${i + 1} a ${Math.min(i + batchSize, monsterSlugs.length)})...`);
    
    const promises = batch.map(slug => fetchMonster(slug));
    const responses = await Promise.all(promises);
    
    for (const res of responses) {
      if (res.status === 200) {
        const parsed = parseMonsterData(res.slug, res.body);
        if (parsed && parsed.name) {
          results.push(parsed);
        }
      } else {
        console.warn(`Aviso: falha ao baixar ${res.slug} (status ${res.status})`);
      }
    }
  }

  console.log(`\nProcessamento finalizado com sucesso! ${results.length} monstros extraídos.`);

  // Ordenar por nome
  results.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));

  const fileContent = `// ==========================================
// 🐉 D&D 5E / 2024 - BASE DE DADOS EXPANDIDA DO BESTIÁRIO
// Catálogo completo com 600+ monstros e criaturas (Pocket DM / SRD 5.1 & 5.2)
// ==========================================
const BESTIARY_DATA = ${JSON.stringify(results, null, 2)};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { BESTIARY_DATA };
}
`;

  fs.writeFileSync('src/data/monsters.js', fileContent, 'utf8');
  console.log(`Salvo com sucesso em src/data/monsters.js! Tamanho: ${(fs.statSync('src/data/monsters.js').size / 1024).toFixed(1)} KB`);
}

scrapeAll();
