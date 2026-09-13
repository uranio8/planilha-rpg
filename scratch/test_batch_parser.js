const https = require('https');
const fs = require('fs');

const links = require('./extract_links.js'); // or load from scratch

async function fetchMonster(slug) {
  return new Promise((resolve) => {
    https.get(`https://pocketdm.com.br/monstros/${slug}`, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ slug, status: res.statusCode, body: data });
      });
    }).on('error', (err) => resolve({ slug, status: 500, error: err.message }));
  });
}

function parseMonsterData(slug, html) {
  if (!html || html.length < 500) return null;

  // 1. Headline and Name
  const headlineMatch = html.match(/"headline":"([^"]+)"/);
  let name = slug;
  if (headlineMatch) {
    name = headlineMatch[1].split('—')[0].replace(/·.*/, '').trim();
  } else {
    const titleMatch = html.match(/<title>([^<]+)<\/title>/);
    if (titleMatch) name = titleMatch[1].split('5e')[0].split('—')[0].trim();
  }

  // 2. Meta description
  const metaDesc = html.match(/<meta[^>]+name="description"[^>]+content="([^"]+)"/i) || html.match(/<meta[^>]+property="og:description"[^>]+content="([^"]+)"/i);
  const descText = metaDesc ? metaDesc[1] : '';

  // Extract Size and Type: e.g. "Grande aberração, CA 17..." or "Pequeno humanoide, CA 15..."
  let sizeType = '';
  const sizeTypeMatch = descText.match(/:\s*([A-Za-zÀ-ÿ]+(?:\s+[A-Za-zÀ-ÿ]+)?),\s*CA/i);
  if (sizeTypeMatch) {
    sizeType = sizeTypeMatch[1];
  }

  // 3. CA
  let ac = 10;
  const acMatch = descText.match(/CA\s*(\d+)/i) || html.match(/CA\s*(\d+)/i) || html.match(/Classe de Armadura\s*(\d+)/i);
  if (acMatch) ac = parseInt(acMatch[1], 10);

  // 4. PV
  let hp = 10;
  const hpMatch = descText.match(/PV\s*(\d+)/i) || html.match(/(\d+)\s*pontos de vida/i) || html.match(/Pontos de Vida\s*(\d+)/i);
  if (hpMatch) hp = parseInt(hpMatch[1], 10);

  // 5. CR / ND
  let cr = '1';
  const crMatch = descText.match(/CR\s*([\d\/]+)/i) || html.match(/ND\s*([\d\/]+)/i) || html.match(/"headline":".*?CR\s*([\d\/]+)/i);
  if (crMatch) cr = crMatch[1];

  // 6. Speed & Combat Details from FAQ or text
  let speed = '9m';
  const faqSpeedMatch = html.match(/deslocamento\s*([^.]+)\./i);
  if (faqSpeedMatch) {
    speed = faqSpeedMatch[1].replace(/<[^>]+>/g, '').trim();
  }

  // 7. Actions / Attacks
  let attack = '';
  const actionsMatch = html.match(/<h2[^>]*>Ações<\/h2>([\s\S]*?)(<h2|<\/section|<footer|<div class="ad)/i);
  if (actionsMatch) {
    attack = actionsMatch[1].replace(/<[^>]+>/g, ' ').replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
  }
  if (!attack || attack.length < 10) {
    // Fallback to description
    attack = descText;
  }
  if (attack.length > 350) {
    attack = attack.substring(0, 347) + '...';
  }

  // Determine Source / Tag
  let source = 'MM';
  if (html.includes('Monster Manual (2024)') || html.includes('SRD 5.2')) {
    source = 'MM 2024';
  } else if (html.includes('Monster Manual (2014)') || html.includes('SRD 5.1')) {
    source = 'MM';
  }

  return {
    name,
    source,
    cr,
    ac,
    hp,
    speed,
    attack,
    type: sizeType || 'Humanoide'
  };
}

async function testBatch() {
  const sampleSlugs = ['aboleth', 'goblin', 'dragao-vermelho-adulto', 'carnical', 'esqueleto', 'zumbi', 'orc', 'behir', 'basilisco', 'balor'];
  const results = [];
  for (const s of sampleSlugs) {
    const res = await fetchMonster(s);
    if (res.status === 200) {
      const parsed = parseMonsterData(s, res.body);
      results.push(parsed);
    }
  }
  console.log('Sample parsed batch of 10:');
  console.log(JSON.stringify(results, null, 2));
}

testBatch();
