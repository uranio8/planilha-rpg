const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

let html = fs.readFileSync('planilha do rpg.html', 'utf8');

// Modifica para que no carregamento o modal-print já esteja aberto com Arkhalis
html = html.replace('id="modal-print" class="modal-overlay"', 'id="modal-print" class="modal-overlay open"');

// Injeta o conteúdo da ficha de Arkhalis diretamente no HTML estático para que o Chrome headless pegue no primeiro paint
// Primeiro pegamos os dados de Arkhalis
const coreJs = fs.readFileSync('src/js/core.js', 'utf8');
const playersJs = fs.readFileSync('src/js/players.js', 'utf8');

const testHtml = path.resolve('test_rendered_print.html');
const testPdf = path.resolve('test_rendered_print.pdf');

// Adiciona script auto-executável síncrono antes do fechamento do body
html = html.replace('</body>', `
<script>
  // Executa imediatamente para garantir que #print-sheet-content esteja populado
  try {
    const ark = PLAYERS.find(x => x.name && x.name.toLowerCase().includes('arkhalis')) || PLAYERS[0];
    if (ark) {
      // Simula a versão do usuário onde level é 8 e className pode ser Mago 8
      ark.level = 8;
      ark.className = 'Mago 8';
      printPlayerSheet(ark.id);
    }
  } catch(e) { console.error(e); }
</script>
</body>
`);

fs.writeFileSync(testHtml, html, 'utf8');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
execSync(`"${chromePath}" --headless=new --disable-gpu --run-all-compositor-stages-before-draw --virtual-time-budget=3000 --print-to-pdf="${testPdf}" "file://${testHtml.replace(/\\/g, '/')}"`, { stdio: 'inherit' });
console.log('PDF gerado:', testPdf);
