const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log('======================================================================');
console.log('🧪 SIMULADOR TOTAL DE CLIQUES EM TODOS OS BOTÕES DA APLICAÇÃO');
console.log('======================================================================\n');

// 1. Setup DOM sandbox robusto
const elementsMap = new Map();

function createMockElement(tag, id = '') {
  const el = {
    tagName: tag.toUpperCase(),
    id: id,
    value: '10',
    checked: true,
    selectedIndex: 0,
    options: [{ value: 'Guerreiro' }, { value: 'all' }],
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
      toggle(c) { if (this._classes.has(c)) this._classes.delete(c); else this._classes.add(c); },
      contains(c) { return this._classes.has(c); }
    },
    style: {},
    children: [],
    _innerHTML: '',
    get innerHTML() { return this._innerHTML; },
    set innerHTML(val) {
      this._innerHTML = String(val);
      // parse simple children if needed
    },
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
    select: () => {},
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
      if (sel.startsWith('#')) return getMockElement(sel.slice(1));
      return createMockElement('div');
    },
    querySelectorAll: () => [],
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

const sandbox = {
  console: {
    log: () => {},
    warn: () => {},
    error: (msg, ...args) => console.log('  [SANDBOX CONSOLE.ERROR]:', msg, ...args)
  },
  document: {
    getElementById: (id) => getMockElement(id),
    querySelector: (sel) => {
      if (sel.startsWith('#')) return getMockElement(sel.slice(1));
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
  history: { replaceState: () => {} },
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

// 2. Carregar todos os scripts
const srcDir = path.join(__dirname, 'src');
const loadFile = (rel) => fs.readFileSync(path.join(srcDir, rel), 'utf8');

const filesToLoad = [
  'data/rules_xp.js', 'data/spells.js', 'data/monsters.js', 'data/equipment.js',
  'data/classes.js', 'data/species.js', 'data/campaigns.js',
  'js/audio_synth.js', 'js/core.js', 'js/firebase_sync.js', 'js/combat.js',
  'js/players.js', 'js/compendium.js', 'js/classes.js', 'js/species.js',
  'js/campaigns.js', 'js/dice_roller.js', 'js/vtt_grid.js', 'js/screen_sync.js'
];

filesToLoad.forEach(f => {
  try {
    vm.runInContext(loadFile(f), sandbox);
  } catch(e) {
    console.error(`Erro ao carregar ${f}:`, e);
  }
});

// Inicializar dados padrão
vm.runInContext(`
  if (typeof initApp === 'function') initApp();
  renderCombat();
  renderPlayers();
  renderCampaigns();
  renderBestiary();
  renderSpells();
  renderEquipment();
`, sandbox);

// 3. Extrair TODOS os botões e elementos com onclick de ui.html
const uiHtml = fs.readFileSync('src/ui/ui.html', 'utf8');
const clickRegex = /<([a-zA-Z0-9]+)\b([^>]*\sonclick=(?:"([^"]*)"|'([^']*)')[^>]*)>(.*?)<\/\1>/gis;
let m;
const clickTargets = [];
while ((m = clickRegex.exec(uiHtml)) !== null) {
  const code = m[3] !== undefined ? m[3] : m[4];
  clickTargets.push({ tag: m[1], code: code, text: m[5].replace(/<[^>]+>/g, '').trim().slice(0, 30) });
}

console.log(`Total de ações onclick extraídas de ui.html: ${clickTargets.length}\n`);

let passed = 0;
let failed = 0;
const errors = [];

clickTargets.forEach((ct, index) => {
  try {
    // Executa o handler simulando o evento
    vm.runInContext(`
      (function() {
        const event = { stopPropagation: () => {}, preventDefault: () => {}, target: null };
        ${ct.code}
      })()
    `, sandbox);
    passed++;
  } catch (err) {
    failed++;
    errors.push({ index: index + 1, text: ct.text, code: ct.code, error: err.message, stack: err.stack });
  }
});

console.log(`\n======================================================================`);
console.log(`RESULTADO DO TESTE DE CLIQUES:`);
console.log(`✅ Aprovados: ${passed}`);
console.log(`❌ Falhas: ${failed}`);
console.log(`======================================================================`);

if (errors.length > 0) {
  console.log('\n❌ DETALHES DAS FALHAS ENCONTRADAS:');
  errors.forEach(e => {
    console.log(`\n[#${e.index}] Elemento: "${e.text}"`);
    console.log(`  Código: ${e.code}`);
    console.log(`  Erro: ${e.error}`);
  });
}
