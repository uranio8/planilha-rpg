// scratch/audit_system.js - Automated deep scanner for HTML/JS consistency and bugs
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const srcDir = path.join(__dirname, '..', 'src');
const uiHtml = fs.readFileSync(path.join(srcDir, 'ui', 'ui.html'), 'utf8');

const jsFiles = [
  'data/rules_xp.js',
  'data/monsters.js',
  'data/spells.js',
  'data/equipment.js',
  'data/classes.js',
  'data/species.js',
  'data/campaigns.js',
  'js/audio_synth.js',
  'js/core.js',
  'js/combat.js',
  'js/players.js',
  'js/compendium.js',
  'js/classes.js',
  'js/species.js',
  'js/campaigns.js',
  'js/dice_roller.js',
  'js/vtt_grid.js',
  'js/screen_sync.js'
];

let allJsCode = '';
jsFiles.forEach(f => {
  allJsCode += '\n' + fs.readFileSync(path.join(srcDir, f), 'utf8');
});

console.log('🔍 INICIANDO AUDITORIA PROFUNDA DE BUGS E CONSISTÊNCIA DO SISTEMA...\n');

// 1. Extrair todos os IDs do HTML
const idRegex = /id=["']([a-zA-Z0-9\-_]+)["']/g;
const declaredIds = new Set();
let match;
while ((match = idRegex.exec(uiHtml)) !== null) {
  declaredIds.add(match[1]);
}

console.log(`📊 Total de IDs declarados em ui.html: ${declaredIds.size}`);

// 2. Extrair todas as chamadas document.getElementById('...') no JS
const getElemRegex = /getElementById\(['"]([a-zA-Z0-9\-_]+)['"]\)/g;
const usedIds = new Set();
while ((match = getElemRegex.exec(allJsCode)) !== null) {
  usedIds.add(match[1]);
}

console.log(`📊 Total de getElementById no JS: ${usedIds.size}`);

const missingIds = [];
usedIds.forEach(id => {
  // Ignora IDs que começam com prefixos gerados dinamicamente em runtime
  if (
    id.startsWith('tok-el-') ||
    id.startsWith('marker-') ||
    id.startsWith('aoe-') ||
    id.startsWith('notes-status-') ||
    id.startsWith('campaign-') ||
    id.startsWith('player-') ||
    id.startsWith('spell-') ||
    id.startsWith('equip-') ||
    id.startsWith('cls-') ||
    id.startsWith('spc-') ||
    id.startsWith('comb-')
  ) {
    return;
  }
  if (!declaredIds.has(id)) {
    missingIds.push(id);
  }
});

console.log(`⚠️ IDs chamados no JS que NÃO foram encontrados em ui.html (${missingIds.length}):`);
missingIds.forEach(id => console.log(`   - ${id}`));

// 3. Extrair todas as chamadas de funções em handlers inline do HTML (onclick, onchange, oninput, etc)
const handlerRegex = /on[a-z]+=["']([^"']+)["']/gi;
const calledFunctions = new Set();
while ((match = handlerRegex.exec(uiHtml)) !== null) {
  const handlerCode = match[1];
  // Extrai nomes de funções chamadas
  const fnMatch = handlerCode.match(/([a-zA-Z0-9_$]+)\s*\(/g);
  if (fnMatch) {
    fnMatch.forEach(fm => {
      const fnName = fm.replace('(', '').trim();
      if (!['if', 'for', 'while', 'switch', 'catch', 'alert', 'confirm', 'prompt', 'parseInt', 'parseFloat', 'Math'].includes(fnName)) {
        calledFunctions.add(fnName);
      }
    });
  }
}

console.log(`\n📊 Total de funções chamadas em handlers do HTML: ${calledFunctions.size}`);

// 4. Executa todo o JS em sandbox VM para listar todas as funções globais declaradas
const domElements = {};
const sandbox = {
  document: {
    getElementById: (id) => domElements[id] || { value: '', classList: { add(){}, remove(){}, toggle(){} }, innerText: '', innerHTML: '', style: {} },
    querySelectorAll: () => [],
    addEventListener: () => {},
    body: { appendChild(){}, removeChild(){}, classList: { add(){}, remove(){} } }
  },
  window: { addEventListener: () => {} },
  localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
  navigator: {},
  AudioContext: class { createOscillator(){ return { connect(){}, start(){}, stop(){} }; } createGain(){ return { connect(){}, gain: { setValueAtTime(){}, linearRampToValueAtTime(){}, exponentialRampToValueAtTime(){} } }; } },
  BroadcastChannel: class { postMessage(){} onmessage = null; }
};
vm.createContext(sandbox);

try {
  vm.runInContext(allJsCode, sandbox);
  console.log('✅ Todo o código JS foi executado no VM Sandbox sem erros de sintaxe ou colisão!');
} catch (err) {
  console.error('❌ Erro na execução do JS:', err);
}

const missingFunctions = [];
calledFunctions.forEach(fn => {
  if (typeof sandbox[fn] !== 'function') {
    missingFunctions.push(fn);
  }
});

console.log(`\n⚠️ Funções invocadas no HTML mas NÃO declaradas no JS (${missingFunctions.length}):`);
missingFunctions.forEach(fn => console.log(`   - ${fn}()`));

// 5. Verificar event listeners, querySelectors órfãos e edge cases
console.log('\n🔍 Fim do scanner preliminar.');
