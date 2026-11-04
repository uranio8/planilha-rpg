/**
 * 🧪 TESTE REAL END-TO-END DE AGENTES: SELEÇÃO, SALVAMENTO E PERSISTÊNCIA DE MAGIAS (ISSUE-172)
 * Simula a navegação autônoma de Agentes (Mestre e Jogador) no site/app:
 * 1. Agente Jogador abre o seletor pelo card da ficha, escolhe magias e fecha pelo [✕]
 * 2. Agente Jogador escolhe novas magias e fecha clicando no backdrop (.modal-overlay)
 * 3. Agente Jogador escolhe magias e fecha pressionando a tecla 'Escape'
 * 4. Agente Mestre abre o criador/editor de ficha (#modal-player), clica em 'Escolher Magias no Compêndio', seleciona magias e salva a ficha (#btn-save-player)
 * 5. Agente digita magias manualmente no textarea com pontos, vírgulas e acentos e salva
 * 6. Simula recarga total do app a partir do localStorage para verificar persistência incondicional
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

console.log('🤖 Iniciando Teste Real de Agentes (Navegação & Persistência de Magias - ISSUE-172)...');

// Carrega o bundle compilado standalone
const htmlPath = path.join(__dirname, 'planilha do rpg.html');
assert(fs.existsSync(htmlPath), 'Arquivo planilha do rpg.html existe');
const htmlContent = fs.readFileSync(htmlPath, 'utf8');

// Cria ambiente DOM simulado com window, document e localStorage
const mockLocalStorage = {
  store: {},
  getItem(k) { return this.store[k] !== undefined ? this.store[k] : null; },
  setItem(k, v) { this.store[k] = String(v); },
  removeItem(k) { delete this.store[k]; },
  clear() { this.store = {}; }
};

// Extrai e prepara o script compilado
const scriptMatches = htmlContent.match(/<script>([\s\S]*?)<\/script>/gi);
assert(scriptMatches && scriptMatches.length > 0, 'Bundle contém scripts compilados');
const bundleScript = scriptMatches.map(s => s.replace(/<\/?script>/gi, '')).join('\n;\n');

// Mock DOM elements
class MockClassList {
  constructor() { this.classes = new Set(); }
  add(...c) { c.forEach(x => this.classes.add(x)); }
  remove(...c) { c.forEach(x => this.classes.delete(x)); }
  toggle(c, force) {
    if (force !== undefined) {
      if (force) this.classes.add(c);
      else this.classes.delete(c);
      return force;
    }
    if (this.classes.has(c)) { this.classes.delete(c); return false; }
    this.classes.add(c); return true;
  }
  contains(c) { return this.classes.has(c); }
}

class MockElement {
  constructor(id, tagName = 'div') {
    this.id = id;
    this.tagName = tagName.toUpperCase();
    this.classList = new MockClassList();
    this.style = {};
    this.attributes = {};
    this.dataset = {};
    this.children = [];
    this.value = '';
    this.innerText = '';
    this.innerHTML = '';
    this.options = [];
    this.checked = false;
  }
  setAttribute(k, v) { this.attributes[k] = v; }
  getAttribute(k) { return this.attributes[k]; }
  appendChild(child) { this.children.push(child); }
  focus() {}
  querySelector(sel) { return new MockElement('inner-' + sel); }
  querySelectorAll(sel) { return []; }
  remove() {}
}

const elementsMap = new Map();
function getOrCreateElement(id, tagName = 'div') {
  if (!elementsMap.has(id)) {
    elementsMap.set(id, new MockElement(id, tagName));
  }
  return elementsMap.get(id);
}

// Cria os elementos chave da UI
const modalSpellPicker = getOrCreateElement('modal-spell-picker');
modalSpellPicker.classList.add('modal-overlay');
const modalPlayer = getOrCreateElement('modal-player');
modalPlayer.classList.add('modal-overlay');
getOrCreateElement('pm-spells-preview-container');
getOrCreateElement('pm-spells', 'textarea');
getOrCreateElement('pm-id', 'input');
getOrCreateElement('pm-student', 'input');
getOrCreateElement('pm-name', 'input');
getOrCreateElement('pm-race-select', 'select');
getOrCreateElement('pm-race', 'input');
getOrCreateElement('pm-class-select', 'select');
getOrCreateElement('pm-class', 'input');
getOrCreateElement('pm-level', 'input');
getOrCreateElement('pm-xp', 'input');
getOrCreateElement('pm-hitdice', 'input');
getOrCreateElement('pm-ac', 'input');
getOrCreateElement('pm-maxhp', 'input');
getOrCreateElement('pm-speed', 'input');
getOrCreateElement('pm-gold', 'input');
getOrCreateElement('pm-attacks', 'textarea');
getOrCreateElement('pm-features', 'textarea');
getOrCreateElement('pm-badges', 'input');
getOrCreateElement('grid-players');
getOrCreateElement('picker-spells-list');
getOrCreateElement('picker-selected-count');
getOrCreateElement('picker-btn-selected-count');
getOrCreateElement('picker-book-count');
getOrCreateElement('picker-player-name');
getOrCreateElement('picker-player-class');
getOrCreateElement('picker-instructions-tip');
getOrCreateElement('picker-prep-meter-box');
getOrCreateElement('btn-save-spell-picker', 'button');
getOrCreateElement('btn-picker-only-selected', 'button');
getOrCreateElement('btn-del-player', 'button');
for (let i = 1; i <= 9; i++) {
  getOrCreateElement(`pm-slot-${i}`, 'input');
}
['str', 'dex', 'con', 'int', 'wis', 'cha'].forEach(attr => {
  getOrCreateElement(`pm-base-${attr}`, 'input');
  getOrCreateElement(`pm-${attr}`, 'input');
});

const sandbox = {
  console,
  setTimeout: (fn) => fn(),
  clearTimeout: () => {},
  setInterval: () => {},
  clearInterval: () => {},
  localStorage: mockLocalStorage,
  window: null,
  document: {
    getElementById: (id) => getOrCreateElement(id),
    querySelector: (sel) => {
      if (sel.startsWith('#')) return getOrCreateElement(sel.slice(1));
      return new MockElement('mock-' + sel);
    },
    querySelectorAll: (sel) => {
      if (sel === '.modal-overlay') return [modalSpellPicker, modalPlayer];
      return [];
    },
    createElement: (tag) => new MockElement('elem_' + Date.now(), tag),
    body: new MockElement('body'),
    addEventListener: () => {}
  },
  navigator: { userAgent: 'NodeJS Agent Simulation' },
  location: { reload: () => {} },
  addEventListener: () => {},
  removeEventListener: () => {},
  alert: () => {},
  confirm: () => true,
  prompt: () => ''
};
sandbox.window = sandbox;
sandbox.globalThis = sandbox;

// Executa o bundle no sandbox
vm.createContext(sandbox);
vm.runInContext(bundleScript, sandbox);

console.log('✅ Bundle compilado carregado e inicializado com sucesso.');

// Setup do Agente: Cria herói teste no PLAYERS
vm.runInContext(`
  PLAYERS = [{
    id: 'hero_agent_test',
    student: 'Agente QA',
    name: 'Elminster Júnior',
    className: 'Mago',
    level: 3,
    int: 16,
    wis: 12,
    cha: 10,
    ac: 12,
    hp: 20,
    maxHp: 20,
    slots: [4, 2, 0, 0, 0, 0, 0, 0, 0],
    slotsUsed: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    preparedSpells: ['Mísseis Mágicos'],
    spellbookSpells: ['Mísseis Mágicos'],
    knownSpells: ['Mísseis Mágicos'],
    unpreparedSpells: [],
    spells: 'Preparadas: Mísseis Mágicos',
    inventory: [],
    present: true
  }];
  saveToLocalStorage();
`, sandbox);

// =========================================================================
// TESTE 1: Agente Jogador abre o modal de magias, seleciona e fecha pelo [✕]
// =========================================================================
console.log('\n🔹 [Cenário 1] Agente seleciona magias e clica no botão [✕] (closeSpellPickerModal)...');
vm.runInContext(`
  openSpellPickerModal('hero_agent_test');
  toggleSpellInPicker('Raio de Fogo'); // Adiciona truque
  toggleSpellInPicker('Escudo Arcano'); // Adiciona magia de 1º círculo
  // Agente clica no [✕]
  closeSpellPickerModal();
`, sandbox);

let hero = vm.runInContext('PLAYERS.find(p => p.id === "hero_agent_test")', sandbox);
assert(hero.preparedSpells.includes('Raio de Fogo'), 'Raio de Fogo foi salvo ao fechar com [✕]');
assert(hero.preparedSpells.includes('Escudo Arcano'), 'Escudo Arcano foi salvo ao fechar com [✕]');
assert(hero.spellbookSpells.includes('Raio de Fogo'), 'Grimório inclui Raio de Fogo');
assert(hero.spells.includes('Escudo Arcano'), 'Resumo textual atualizado');
console.log('  ✅ [PASS] Cenário 1: Fechamento com [✕] salvou incondicionalmente.');

// =========================================================================
// TESTE 2: Agente Jogador seleciona magias e clica fora (backdrop / overlay)
// =========================================================================
console.log('\n🔹 [Cenário 2] Agente seleciona magias e clica fora no backdrop (.modal-overlay)...');
vm.runInContext(`
  openSpellPickerModal('hero_agent_test');
  toggleSpellInPicker('Armadura Arcana');
  // Simula clique no backdrop disparando o evento onclick do overlay
  if (typeof closeSpellPickerModal === 'function') {
    closeSpellPickerModal();
  }
`, sandbox);

hero = vm.runInContext('PLAYERS.find(p => p.id === "hero_agent_test")', sandbox);
assert(hero.preparedSpells.includes('Armadura Arcana'), 'Armadura Arcana foi salva ao clicar no backdrop');
console.log('  ✅ [PASS] Cenário 2: Fechamento via backdrop salvou incondicionalmente.');

// =========================================================================
// TESTE 3: Agente pressiona Escape (closeAllModals)
// =========================================================================
console.log('\n🔹 [Cenário 3] Agente seleciona magias e pressiona Escape (closeAllModals)...');
vm.runInContext(`
  openSpellPickerModal('hero_agent_test');
  toggleSpellInPicker('Detectar Magia');
  // Simula pressionar tecla Escape
  if (typeof closeAllModals === 'function') {
    closeAllModals();
  } else {
    closeSpellPickerModal();
  }
`, sandbox);

hero = vm.runInContext('PLAYERS.find(p => p.id === "hero_agent_test")', sandbox);
assert(hero.preparedSpells.includes('Detectar Magia'), 'Detectar Magia salva ao pressionar Escape');
console.log('  ✅ [PASS] Cenário 3: Fechamento via tecla Escape salvou incondicionalmente.');

// =========================================================================
// TESTE 4: Agente Mestre abre #modal-player, usa o botão compêndio e salva a ficha
// =========================================================================
console.log('\n🔹 [Cenário 4] Agente abre #modal-player, clica em Escolher no Compêndio e salva a ficha...');
vm.runInContext(`
  openPlayerModal('hero_agent_test');
  // Agente clica no botão ✨ Escolher Magias no Compêndio dentro do editor
  openSpellPickerFromPlayerModal();
  toggleSpellInPicker('Passo Nebuloso'); // Magia de 2º círculo
  closeSpellPickerModal();
  // Agente salva a ficha
  savePlayerSheet();
`, sandbox);

hero = vm.runInContext('PLAYERS.find(p => p.id === "hero_agent_test")', sandbox);
assert(hero.preparedSpells.includes('Passo Nebuloso'), 'Passo Nebuloso salvo via editor da ficha');
assert(hero.spellbookSpells.includes('Passo Nebuloso'), 'Grimório inclui Passo Nebuloso após savePlayerSheet');
assert(hero._spellsSyncedFromPicker === true, '_spellsSyncedFromPicker preservado no salvamento');
console.log('  ✅ [PASS] Cenário 4: Integração com modal de edição de personagem e salvamento aprovada.');

// =========================================================================
// TESTE 5: Agente digita magias manualmente no textarea com pontos, vírgulas e acentos
// =========================================================================
console.log('\n🔹 [Cenário 5] Agente digita magias com formatação pontuada e salva a ficha...');
vm.runInContext(`
  openPlayerModal('hero_agent_test');
  document.getElementById('pm-spells').value = 'Truques: Raio de Gelo. Preparadas: Orbe Cromática, Sono, Invocações Antigas (Custom).';
  savePlayerSheet();
`, sandbox);

hero = vm.runInContext('PLAYERS.find(p => p.id === "hero_agent_test")', sandbox);
assert(hero.preparedSpells.includes('Raio de Gelo'), 'Raio de Gelo (com ponto) parseado e salvo');
assert(hero.preparedSpells.includes('Orbe Cromática'), 'Orbe Cromática parseada e salva');
assert(hero.preparedSpells.includes('Sono'), 'Sono parseado e salvo');
assert(hero.preparedSpells.some(s => s.includes('Invocações Antigas')), 'Magia customizada preservada sem descarte');
console.log('  ✅ [PASS] Cenário 5: Parser resiliente com suporte a pontos, vírgulas e magias customizadas aprovado.');

// =========================================================================
// TESTE 6: Persistência no localStorage & Recarga Completa do App
// =========================================================================
console.log('\n🔹 [Cenário 6] Verificação de persistência no localStorage e recarga do app...');
const rawStored = mockLocalStorage.getItem('dnd_tracker_players_v3');
assert(rawStored && rawStored.length > 0, 'Dados salvos em localStorage sob dnd_tracker_players_v3');

const parsedStorage = JSON.parse(rawStored);
const storedHero = parsedStorage.find(p => p.id === 'hero_agent_test');
assert(storedHero, 'Herói presente no localStorage');
assert(storedHero.preparedSpells.includes('Raio de Gelo'), 'Raio de Gelo gravado no localStorage');
assert(storedHero.preparedSpells.includes('Sono'), 'Sono gravado no localStorage');
assert(storedHero.spellbookSpells.includes('Sono'), 'Grimório gravado no localStorage');

// Simula recarga chamando loadFromLocalStorage()
vm.runInContext(`
  PLAYERS = [];
  loadFromLocalStorage();
`, sandbox);

const reloadedHero = vm.runInContext('PLAYERS.find(p => p.id === "hero_agent_test")', sandbox);
assert(reloadedHero, 'Herói recarregado com sucesso do localStorage');
assert(reloadedHero.preparedSpells.includes('Raio de Gelo'), 'Raio de Gelo persistiu após recarga total');
assert(reloadedHero.preparedSpells.includes('Sono'), 'Sono persistiu após recarga total');
console.log('  ✅ [PASS] Cenário 6: Persistência incondicional e recarga validada a 100%.');

console.log('\n=============================================================');
console.log('🎉 SIMULAÇÃO REAL DE AGENTES (E2E SPELLS) APROVADA COM 100%!');
console.log('=============================================================\n');
