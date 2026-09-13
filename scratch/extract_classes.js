const https = require('https');
const fs = require('fs');
const path = require('path');

const URLS = {
  barbaro: 'https://www.segredosdealancia.com.br/2024/08/5e2024-barbaro.html',
  bardo: 'https://www.segredosdealancia.com.br/2024/08/5e2024-bardo.html',
  bruxo: 'https://www.segredosdealancia.com.br/2024/08/5e2024-bruxo.html',
  clerigo: 'https://www.segredosdealancia.com.br/2024/08/5e2024-clerigo.html',
  druida: 'https://www.segredosdealancia.com.br/2024/08/5e2024-druida.html',
  feiticeiro: 'https://www.segredosdealancia.com.br/2024/08/5e2024-feiticeiro.html',
  guerreiro: 'https://www.segredosdealancia.com.br/2024/08/5e2024-guerreiro.html',
  ladino: 'https://www.segredosdealancia.com.br/2024/08/5e2024-ladino.html',
  mago: 'https://www.segredosdealancia.com.br/2024/08/5e2024-mago.html',
  monge: 'https://www.segredosdealancia.com.br/2024/08/5e2024-monge.html',
  paladino: 'https://www.segredosdealancia.com.br/2024/08/5e2024-paladino.html',
  patrulheiro: 'https://www.segredosdealancia.com.br/2024/08/5e2024-patrulheiro.html'
};

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function run() {
  for (const [key, url] of Object.entries(URLS)) {
    console.log(`Fetching ${key}...`);
    try {
      const html = await fetchUrl(url);
      const outDir = path.join(__dirname, 'raw_classes');
      if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
      fs.writeFileSync(path.join(outDir, `${key}.html`), html, 'utf8');
      console.log(`Saved ${key}.html (${html.length} bytes)`);
    } catch (e) {
      console.error(`Error fetching ${key}:`, e.message);
    }
  }
}

run();
