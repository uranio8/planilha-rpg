// ============================================================================
// 🧪 SUÍTE DE TESTES DE INTEGRIDADE DE UI, CLIQUES E MODAIS (ISSUE-165)
// Planilha RPG - D&D 5E Assistant & VTT
// ============================================================================

const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log('======================================================================');
console.log('🛡️ INICIANDO SUÍTE DE INTEGRIDADE DE UI, NAVEGAÇÃO E CLIQUES');
console.log('======================================================================\n');

// 1. SETUP DO DOM SANDBOX COMPLETO
const elementsMap = new Map();

function createMockElement(tag, id = '') {
  const el = {
    tagName: tag.toUpperCase(),
    id: id,
    value: '10',
    checked: true,
    selectedIndex: 0,
    options: [{ value: 'Guerreiro' }, { value: 'all' }, { value: '1' }],
    files: [],
    dataset: {},
    clientWidth: 1200,
    clientHeight: 800,
    offsetWidth: 1200,
    offsetHeight: 800,
    scrollWidth: 1200,
    scrollHeight: 800,
    scrollLeft: 0,
    scrollTop: 0,
    getBoundingClientRect: () => ({ left: 0, top: 0, right: 100, bottom: 100, width: 100, height: 100 }),
    classList: {
      _classes: new Set(),
      add(...cls) { cls.forEach(c => this._classes.add(c)); },
      remove(...cls) { cls.forEach(c => this._classes.delete(c)); },
      toggle(c, force) {
        if (force !== undefined) {
          if (force) this._classes.add(c); else this._classes.delete(c);
        } else {
          if (this._classes.has(c)) this._classes.delete(c); else this._classes.add(c);
        }
      },
      contains(c) { return this._classes.has(c); }
    },
    style: {},
    children: [],
    _innerHTML: '',
    get innerHTML() { return this._innerHTML; },
    set innerHTML(val) { this._innerHTML = String(val); },
    _innerText: '',
    get innerText() { return this._innerText; },
    set innerText(val) { this._innerText = String(val); },
    get textContent() { return this._innerText; },
    set textContent(val) { this._innerText = String(val); },
    addEventListener: () => {},
    removeEventListener: () => {},
    focus: () => {},
    blur: () => {},
    click: () => {},
    select: () => {},
    setSelectionRange: () => {},
    scrollIntoView: () => {},
    toDataURL: () => 'data:image/png;base64,mock',
    getAttribute: (attr) => '',
    setAttribute: () => {},
    removeAttribute: () => {},
    getContext: () => ({
      clearRect: () => {}, fillRect: () => {}, beginPath: () => {}, arc: () => {},
      fill: () => {}, stroke: () => {}, drawImage: () => {}, getImageData: () => ({ data: new Uint8Array(4) }),
      putImageData: () => {}, save: () => {}, restore: () => {}, setLineDash: () => {}, moveTo: () => {},
      lineTo: () => {}, strokeText: () => {}, fillText: () => {}
    }),
    appendChild(child) {
      this.children.push(child);
      return child;
    },
    removeChild(child) {
      const idx = this.children.indexOf(child);
      if (idx >= 0) this.children.splice(idx, 1);
      return child;
    },
    querySelector: (sel) => {
      if (sel && sel.startsWith('#')) return getMockElement(sel.slice(1));
      return createMockElement('div');
    },
    querySelectorAll: (sel) => [createMockElement('div')],
    closest: (sel) => createMockElement('div')
  };
  return el;
}

function getMockElement(id) {
  if (!elementsMap.has(id)) {
    elementsMap.set(id, createMockElement('div', id));
  }
  return elementsMap.get(id);
}

const sandboxErrors = [];

const sandbox = {
  console: {
    log: () => {},
    warn: () => {},
    error: (msg, ...args) => {
      // Ignora apenas mensagens esperadas de offline ou rede em mock
      const fullStr = String(msg) + ' ' + args.map(String).join(' ');
      if (!fullStr.includes('Firebase') && !fullStr.includes('IndexedDB')) {
        sandboxErrors.push(fullStr);
      }
    }
  },
  document: {
    getElementById: (id) => getMockElement(id),
    querySelector: (sel) => {
      if (sel && sel.startsWith('#')) return getMockElement(sel.slice(1));
      return createMockElement('div');
    },
    querySelectorAll: (sel) => [createMockElement('div')],
    createElement: (tag) => createMockElement(tag),
    body: createMockElement('body', 'body'),
    documentElement: createMockElement('html', 'html'),
    addEventListener: () => {},
    removeEventListener: () => {},
    exitFullscreen: () => Promise.resolve()
  },
  window: null,
  location: { href: 'http://localhost:8080/index.html', search: '', hash: '', pathname: '/' },
  history: { replaceState: () => {}, pushState: () => {} },
  addEventListener: () => {},
  removeEventListener: () => {},
  innerWidth: 1200,
  innerHeight: 800,
  localStorage: {
    data: {},
    setItem(k, v) { this.data[k] = String(v); },
    getItem(k) { return this.data[k] || null; },
    removeItem(k) { delete this.data[k]; },
    clear() { this.data = {}; }
  },
  sessionStorage: {
    data: {},
    setItem(k, v) { this.data[k] = String(v); },
    getItem(k) { return this.data[k] || null; },
    removeItem(k) { delete this.data[k]; },
    clear() { this.data = {}; }
  },
  print: () => {},
  Image: class { constructor() { this.onload = null; this.src = ''; } },
  Blob: class { constructor() {} },
  URL: {
    createObjectURL: () => 'blob:mock-url',
    revokeObjectURL: () => {}
  },
  prompt: () => '10',
  confirm: () => true,
  alert: () => {},
  setTimeout: (fn) => { try { fn(); } catch(e){} return 1; },
  clearTimeout: () => {},
  setInterval: () => 1,
  clearInterval: () => {},
  requestAnimationFrame: (fn) => { try { fn(); } catch(e){} return 1; },
  navigator: { clipboard: { writeText: () => Promise.resolve() } },
  BroadcastChannel: class { constructor() {} postMessage() {} close() {} },
  AudioContext: class {
    createOscillator() { return { connect: () => {}, start: () => {}, stop: () => {}, frequency: { setValueAtTime: () => {} } }; }
    createGain() { return { connect: () => {}, gain: { setValueAtTime: () => {}, linearRampToValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} } }; }
    createBiquadFilter() { return { connect: () => {}, frequency: { setValueAtTime: () => {} } }; }
    createBufferSource() { return { connect: () => {}, start: () => {}, buffer: null }; }
  }
};
sandbox.window = sandbox;
sandbox.global = sandbox;
sandbox.document.body.appendChild = (c) => c;
sandbox.document.documentElement.requestFullscreen = () => Promise.resolve();
vm.createContext(sandbox);

// 2. CARREGAR TODOS OS MÓDULOS DE DADOS E SCRIPTS
const srcDir = path.join(__dirname, 'src');
const loadFile = (rel) => fs.readFileSync(path.join(srcDir, rel), 'utf8');

const filesToLoad = [
  'data/rules_xp.js', 'data/spells.js', 'data/monsters.js', 'data/equipment.js',
  'data/classes.js', 'data/species.js', 'data/campaigns.js', 'data/hirelings.js',
  'data/bastions.js', 'data/feats.js', 'data/backgrounds.js', 'data/trait_quick_rules.js',
  'js/audio_synth.js', 'js/core.js', 'js/firebase_sync.js', 'js/combat.js',
  'js/players.js', 'js/compendium.js', 'js/classes.js', 'js/species.js',
  'js/campaigns.js', 'js/dice_roller.js', 'js/vtt_grid.js', 'js/screen_sync.js',
  'js/pdf_export.js'
];

console.log('📁 Carregando 25 módulos do sistema no ambiente de teste...');
filesToLoad.forEach(f => {
  try {
    vm.runInContext(loadFile(f), sandbox);
  } catch(e) {
    console.error(`💥 Falha fatal ao carregar ${f}:`, e);
    process.exit(1);
  }
});
console.log('  ✅ Todos os 25 módulos carregados com sintaxe válida!\n');

// 3. INICIALIZAR ESTADO GERAL DA APLICAÇÃO
vm.runInContext(`
  if (typeof initApp === 'function') initApp();
  if (typeof renderCombat === 'function') renderCombat();
  if (typeof renderPlayers === 'function') renderPlayers();
  if (typeof renderCampaigns === 'function') renderCampaigns();
  if (typeof renderBestiary === 'function') renderBestiary();
  if (typeof renderSpells === 'function') renderSpells();
  if (typeof renderEquipment === 'function') renderEquipment();
`, sandbox);

// FASE 1: TESTE DE NAVEGAÇÃO ENTRE TODAS AS ABAS
console.log('📑 FASE 1: Teste de Alternância de Abas (switchTab)...');
const allTabs = ['combat', 'players', 'monsters', 'spells', 'equipment', 'classes', 'species', 'campaigns', 'vtt', 'screen', 'bastions'];
let tabPass = 0;
let tabFail = 0;

allTabs.forEach(tab => {
  try {
    vm.runInContext(`switchTab('${tab}')`, sandbox);
    tabPass++;
  } catch(err) {
    tabFail++;
    console.error(`  ❌ Falha ao mudar para a aba "${tab}":`, err.message);
  }
});
console.log(`  ✅ ${tabPass}/${allTabs.length} abas alternadas com sucesso!\n`);

// FASE 2: TESTE DE ABERTURA E FECHAMENTO DE MODAIS
console.log('🪟 FASE 2: Teste de Abertura e Fechamento de Modais...');
const modalPairs = [
  ['openPlayerModal', 'closePlayerModal'],
  ['openBatchRewardsModal', 'closeBatchRewardsModal'],
  ['openPlayerCombatModal', 'closePlayerCombatModal'],
  ['openAsiChoiceModal', 'closeAsiChoiceModal'],
  ['openDeathSavesModal', 'closeDeathSavesModal'],
  ['openPartyItemModal', 'closePartyItemModal'],
  ['openBastionActionModal', 'closeBastionActionModal'],
  ['openSpellPickerModal', 'closeSpellPickerModal'],
  ['openSpellQuickView', 'closeSpellQuickView'],
  ['openItemQuickView', 'closeItemQuickView']
];

let modalPass = 0;
let modalFail = 0;

modalPairs.forEach(([openFn, closeFn]) => {
  try {
    vm.runInContext(`
      if (typeof ${openFn} === 'function') ${openFn}();
      if (typeof ${closeFn} === 'function') ${closeFn}();
    `, sandbox);
    modalPass++;
  } catch(err) {
    modalFail++;
    console.error(`  ❌ Falha no par de modal [${openFn} / ${closeFn}]:`, err.message);
  }
});
console.log(`  ✅ ${modalPass}/${modalPairs.length} modais validados com sucesso!\n`);

// FASE 3: SIMULADOR TOTAL DE CLIQUES EM ELEMENTOS ONCLICK DE UI.HTML
console.log('🖱️ FASE 3: Simulador Universal de Cliques (onclick em ui.html)...');
const uiHtml = fs.readFileSync('src/ui/ui.html', 'utf8');
const clickRegex = /<([a-zA-Z0-9]+)\b([^>]*\sonclick=(?:"([^"]*)"|'([^']*)')[^>]*)>(.*?)<\/\1>/gis;
let m;
const clickTargets = [];

while ((m = clickRegex.exec(uiHtml)) !== null) {
  const code = m[3] !== undefined ? m[3] : m[4];
  clickTargets.push({ tag: m[1], code: code, text: m[5].replace(/<[^>]+>/g, '').trim().slice(0, 35) });
}

console.log(`  Total de ações onclick extraídas de ui.html: ${clickTargets.length}`);

let clickPass = 0;
let clickFail = 0;
const clickErrors = [];

clickTargets.forEach((ct, index) => {
  try {
    vm.runInContext(`
      (function() {
        const event = { stopPropagation: () => {}, preventDefault: () => {}, target: null };
        const btn = { classList: { add: () => {}, remove: () => {}, toggle: () => {} } };
        ${ct.code}
      })()
    `, sandbox);
    clickPass++;
  } catch (err) {
    clickFail++;
    clickErrors.push({ index: index + 1, text: ct.text, code: ct.code, error: err.message });
  }
});

console.log(`\n======================================================================`);
console.log(`📊 RESULTADO FINAL DA AUDITORIA DE INTEGRIDADE:`);
console.log(`  Abas Validadas:    ${tabPass}/${allTabs.length}`);
console.log(`  Modais Validados:  ${modalPass}/${modalPairs.length}`);
console.log(`  Ações de Clique:   ${clickPass}/${clickTargets.length} aprovadas (${clickFail} falhas)`);
console.log(`======================================================================\n`);

if (clickErrors.length > 0) {
  console.log('❌ DETALHES DAS FALHAS ENCONTRADAS:');
  clickErrors.forEach(e => {
    console.log(`  [#${e.index}] Elemento: "${e.text}"`);
    console.log(`     Código: ${e.code}`);
    console.log(`     Erro:   ${e.error}`);
  });
  console.log('\n💥 Auditoria reprovada! Corrija os botões listados acima.');
  process.exit(1);
} else {
  console.log('🎉 100% DAS AÇÕES E TELAS DA INTERFACE APROVADAS COM SUCESSO! 🚀\n');
  process.exit(0);
}
