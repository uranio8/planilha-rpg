const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Cria script para rodar com chrome headless
const htmlPath = path.resolve('planilha do rpg.html');
const outPdf = path.resolve('test_print_arkhalis.pdf');

// Vamos criar um arquivo HTML temporário onde o modal de impressão já abre carregado com Arkhalis
let html = fs.readFileSync(htmlPath, 'utf8');

// Adiciona script no final para abrir o modal de impressão do Arkhalis automaticamente
html = html.replace('</body>', `
<script>
  window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      if (typeof printPlayerSheet === 'function') {
        const p = PLAYERS.find(x => x.name && x.name.toLowerCase().includes('arkhalis')) || PLAYERS[0];
        if (p) printPlayerSheet(p.id);
      }
    }, 500);
  });
</script>
</body>
`);

const testHtmlPath = path.resolve('test_print_page.html');
fs.writeFileSync(testHtmlPath, html, 'utf8');

console.log('Gerando PDF com Chrome Headless...');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
try {
  execSync(`"${chromePath}" --headless=new --disable-gpu --run-all-compositor-stages-before-draw --virtual-time-budget=5000 --print-to-pdf="${outPdf}" "file://${testHtmlPath.replace(/\\/g, '/')}"`, { stdio: 'inherit' });
  console.log('PDF gerado com sucesso:', outPdf);
} catch (e) {
  console.error('Erro ao rodar chrome headless:', e);
}
