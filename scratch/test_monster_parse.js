const https = require('https');
const fs = require('fs');

function fetchUrl(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ url, status: res.statusCode, body: data });
      });
    }).on('error', (err) => resolve({ url, status: 500, error: err.message }));
  });
}

// Function to parse monster stat block from HTML
function parseMonsterHtml(html, href) {
  // Title & Names
  const titleMatch = html.match(/<title>([^<]+)<\/title>/);
  const fullTitle = titleMatch ? titleMatch[1] : '';
  
  // Extract Type, Size, Alignment (e.g. "Grande aberração, leal e mau")
  const typeMatch = html.match(/(Pequeno|Médio|Grande|Enorme|Imenso|Miúdo)\s+([^,<\n]+),\s*([^<\n]+)/i);
  
  // CA
  const acMatch = html.match(/Classe de Armadura\s*<\/?[^>]*>\s*(\d+)/i) || html.match(/Classe de Armadura\s*(\d+)/i) || html.match(/CA\s*(\d+)/i);
  
  // PV
  const hpMatch = html.match(/Pontos de Vida\s*<\/?[^>]*>\s*(\d+)\s*\(([^)]+)\)/i) || html.match(/Pontos de Vida\s*(\d+)/i);
  
  // Movimento / Speed
  const speedMatch = html.match(/Movimento\s*<\/?[^>]*>\s*([^<\n]+)/i) || html.match(/Deslocamento\s*<\/?[^>]*>\s*([^<\n]+)/i);
  
  // CR / ND
  const crMatch = html.match(/Nível de Desafio\s*<\/?[^>]*>\s*([\d\/]+)/i) || html.match(/CR\s*([\d\/]+)/i);
  
  // Extract main actions/attacks
  let attackText = '';
  const actionsIdx = html.indexOf('Ações');
  if (actionsIdx !== -1) {
    const actionsBlock = html.substring(actionsIdx, actionsIdx + 1500);
    // Strip tags
    const cleanActions = actionsBlock.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    attackText = cleanActions.substring(0, 300);
  }

  return {
    href,
    title: fullTitle,
    typeLine: typeMatch ? `${typeMatch[1]} ${typeMatch[2]}, ${typeMatch[3]}` : '',
    ac: acMatch ? parseInt(acMatch[1], 10) : null,
    hp: hpMatch ? parseInt(hpMatch[1], 10) : null,
    hitDice: hpMatch && hpMatch[2] ? hpMatch[2] : '',
    speed: speedMatch ? speedMatch[1].replace(/<[^>]+>/g, '').trim() : '9m',
    cr: crMatch ? crMatch[1] : '1',
    attackText
  };
}

async function testSample() {
  const samples = ['/monstros/aboleth', '/monstros/goblin', '/monstros/dragao-vermelho-adulto', '/monstros/beholder'];
  for (const s of samples) {
    const res = await fetchUrl('https://pocketdm.com.br' + s);
    console.log(`Fetched ${s} (status ${res.status}, length ${res.body?.length})`);
    if (res.status === 200) {
      fs.writeFileSync(`scratch/${s.replace('/monstros/', '')}.html`, res.body, 'utf8');
      console.log('Parsed:', parseMonsterHtml(res.body, s));
    }
  }
}

testSample();
