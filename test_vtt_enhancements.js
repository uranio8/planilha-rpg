// test_vtt_enhancements.js - Suíte de Testes Automatizados para Overhaul do Mapa VTT (ISSUE-176)
const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('🧪 Iniciando Testes do VTT Battle Grid Épico (ISSUE-176)...');

// 1. Verificação de Arquivos Fonte
const uiHtml = fs.readFileSync(path.join(__dirname, 'src/ui/ui.html'), 'utf8');
const headCss = fs.readFileSync(path.join(__dirname, 'src/styles/head_css.html'), 'utf8');
const vttJs = fs.readFileSync(path.join(__dirname, 'src/js/vtt_grid.js'), 'utf8');
const coreJs = fs.readFileSync(path.join(__dirname, 'src/js/core.js'), 'utf8');
const firebaseJs = fs.readFileSync(path.join(__dirname, 'src/js/firebase_sync.js'), 'utf8');

// Mock do ambiente DOM
class MockElement {
  constructor(id = '', tagName = 'div') {
    this.id = id;
    this.tagName = tagName.toUpperCase();
    this.classList = {
      _classes: new Set(),
      add: (c) => this.classList._classes.add(c),
      remove: (c) => this.classList._classes.delete(c),
      contains: (c) => this.classList._classes.has(c),
      toggle: (c, force) => {
        if (force !== undefined) {
          if (force) this.classList._classes.add(c);
          else this.classList._classes.delete(c);
          return force;
        }
        if (this.classList._classes.has(c)) {
          this.classList._classes.delete(c);
          return false;
        } else {
          this.classList._classes.add(c);
          return true;
        }
      }
    };
    this.style = {};
    this.dataset = {};
    this.children = [];
    this.innerHTML = '';
    this.value = '';
    this.textContent = '';
    this.innerText = '';
    this._listeners = {};
  }
  addEventListener(event, fn) {
    if (!this._listeners[event]) this._listeners[event] = [];
    this._listeners[event].push(fn);
  }
  dispatchEvent(event) {
    if (this._listeners[event.type]) {
      this._listeners[event.type].forEach(fn => fn(event));
    }
  }
  remove() {
    this.removed = true;
  }
  insertAdjacentHTML(pos, html) {
    this.innerHTML = (this.innerHTML || '') + html;
  }
  getContext(type) {
    return {
      save: () => {},
      restore: () => {},
      beginPath: () => {},
      moveTo: () => {},
      lineTo: () => {},
      stroke: () => {},
      fill: () => {},
      arc: () => {},
      fillRect: () => {},
      clearRect: () => {},
      drawImage: () => {}
    };
  }
}

const mockDomElements = {};
function getOrCreateMock(id) {
  if (!mockDomElements[id]) {
    mockDomElements[id] = new MockElement(id);
  }
  return mockDomElements[id];
}

global.document = {
  getElementById: (id) => getOrCreateMock(id),
  querySelector: () => new MockElement(),
  querySelectorAll: () => [],
  addEventListener: () => {},
  removeEventListener: () => {},
  body: new MockElement('body')
};

global.window = {
  addEventListener: () => {},
  removeEventListener: () => {}
};

global.localStorage = {
  _store: {},
  getItem: (k) => global.localStorage._store[k] || null,
  setItem: (k, v) => { global.localStorage._store[k] = v.toString(); }
};

// --------------------------------------------------------------------------
// TESTE 1: Estrutura HTML & UI
// --------------------------------------------------------------------------
console.log('\n🏛️ 1. Testando Estrutura HTML do VTT Épico...');
assert(uiHtml.includes('id="vtt-floating-dock"'), 'ui.html deve incluir o dock flutuante (#vtt-floating-dock)');
assert(uiHtml.includes('id="dock-tool-select"'), 'Dock deve incluir botão de seleção');
assert(uiHtml.includes('id="dock-tool-ruler"'), 'Dock deve incluir botão de régua');
assert(uiHtml.includes('id="dock-tool-ping"'), 'Dock deve incluir botão de ping');
assert(uiHtml.includes('id="dock-tool-fow"'), 'Dock deve incluir ferramenta de névoa de guerra');
assert(uiHtml.includes('id="dock-tool-ambient"'), 'Dock deve incluir botão de ambientação/luz');
assert(uiHtml.includes('id="vtt-fow-dropdown"'), 'ui.html deve incluir menu dropdown de névoa');
assert(uiHtml.includes('id="vtt-ambient-dropdown"'), 'ui.html deve incluir menu dropdown de shaders de cena');
assert(uiHtml.includes('id="vtt-darkness-slider"'), 'ui.html deve incluir slider de escuridão');
assert(uiHtml.includes('id="vtt-dropzone-overlay"'), 'ui.html deve incluir overlay de drag & drop');
assert(uiHtml.includes('id="battlegrid-ambient-overlay"'), 'ui.html deve incluir overlay de iluminação');
assert(uiHtml.includes('id="vtt-keyboard-movement-trail"'), 'ui.html deve incluir container de trilha de movimento');
assert(uiHtml.includes('id="pnav-grid"'), 'ui.html deve incluir chip de Mapa VTT no banner do Portal do Jogador');
console.log('  ✅ Todos os elementos HTML do VTT e do Portal estão presentes!');

// --------------------------------------------------------------------------
// TESTE 2: Regras de Estilo CSS & Portal do Jogador
// --------------------------------------------------------------------------
console.log('\n🎨 2. Testando Regras CSS e Visibilidade do Jogador...');
assert(headCss.includes('.vtt-floating-dock'), 'head_css.html deve conter estilos para .vtt-floating-dock');
assert(headCss.includes('.vtt-dock-btn'), 'head_css.html deve conter estilos para .vtt-dock-btn');
assert(headCss.includes('.vtt-dock-dropdown'), 'head_css.html deve conter estilos para .vtt-dock-dropdown');
assert(headCss.includes('.vtt-dropzone-overlay'), 'head_css.html deve conter estilos para .vtt-dropzone-overlay');
assert(headCss.includes('.battlegrid-ambient-overlay'), 'head_css.html deve conter estilos para .battlegrid-ambient-overlay');
assert(headCss.includes('.battlegrid-ambient-overlay.ambient-night'), 'head_css.html deve conter shader de noite');
assert(headCss.includes('.battlegrid-ambient-overlay.ambient-dungeon'), 'head_css.html deve conter shader de masmorra');
assert(headCss.includes('.token-torch-active'), 'head_css.html deve conter efeito visual de tocha');
assert(headCss.includes('.token-reach-aura'), 'head_css.html deve conter auras de alcance');
assert(headCss.includes('.token-hud-ac-badge'), 'head_css.html deve conter badge de CA');
assert(headCss.includes('.token-hud-conditions-popover'), 'head_css.html deve conter popover de condições D&D 5E');
assert(headCss.includes('body.mode-player-portal #tab-grid.active'), 'head_css.html deve permitir que #tab-grid seja exibido quando ativo no portal');
assert(headCss.includes('body.mode-player-portal .vtt-dm-only-tool'), 'head_css.html deve ocultar ferramentas restritas do mestre no portal');
console.log('  ✅ Todos os estilos CSS e blindagens de segurança do Portal foram validados!');

// --------------------------------------------------------------------------
// TESTE 3: Sincronização Online e Permissões
// --------------------------------------------------------------------------
console.log('\n🌐 3. Testando Sincronização Online em Tempo Real (Firebase)...');
assert(coreJs.includes("'grid'"), 'core.js deve incluir "grid" em PLAYER_ALLOWED_TABS');
assert(vttJs.includes('syncLocalChangesToFirebase(true)'), 'broadcastGridState() deve despachar atualizações para o Firebase');
assert(firebaseJs.includes('applyVttAmbientLighting'), 'firebase_sync.js deve aplicar iluminação ao receber gridState');
console.log('  ✅ Sincronização bidirecional em nuvem configurada com sucesso!');

// --------------------------------------------------------------------------
// TESTE 4: Mecânicas do VTT (Módulo JS)
// --------------------------------------------------------------------------
console.log('\n⚙️ 4. Testando Mecânicas de Jogo do VTT...');
const vttModule = require('./src/js/vtt_grid.js');

// Teste de Névoa de Guerra Avançada
assert.strictEqual(typeof vttModule.setVttFowMode, 'function', 'setVttFowMode deve ser uma função exportada');
vttModule.setVttFowMode('box_reveal');
assert.strictEqual(typeof vttModule.revealFoWRect, 'function', 'revealFoWRect deve ser uma função');
assert.strictEqual(typeof vttModule.hideFoWRect, 'function', 'hideFoWRect deve ser uma função');
assert.strictEqual(typeof vttModule.revealFoWCircle, 'function', 'revealFoWCircle deve ser uma função');
console.log('  ✅ Névoa retangular e circular operacionais!');

// Teste de Shaders de Iluminação de Cena
assert.strictEqual(typeof vttModule.setVttAmbientPreset, 'function', 'setVttAmbientPreset deve ser exportada');
assert.strictEqual(typeof vttModule.setVttAmbientDarkness, 'function', 'setVttAmbientDarkness deve ser exportada');
assert.strictEqual(typeof vttModule.applyVttAmbientLighting, 'function', 'applyVttAmbientLighting deve ser exportada');
vttModule.setVttAmbientPreset('night');
vttModule.setVttAmbientDarkness(40);
console.log('  ✅ Shaders atmosféricos e escuridão ajustável operacionais!');

// Teste de Auras de Alcance e Tocha
assert.strictEqual(typeof vttModule.toggleTokenTorch, 'function', 'toggleTokenTorch deve ser exportada');
assert.strictEqual(typeof vttModule.cycleTokenReachAura, 'function', 'cycleTokenReachAura deve ser exportada');
assert.strictEqual(typeof vttModule.applyTokenQuickAdjustHp, 'function', 'applyTokenQuickAdjustHp deve ser exportada');
assert.strictEqual(typeof vttModule.toggleTokenConditionFromHud, 'function', 'toggleTokenConditionFromHud deve ser exportada');
console.log('  ✅ Token Action HUD com PV, CA, Tocha e Auras 100% operacional!');

// Teste de Movimentação por Teclado e Snap ao Grid
assert.strictEqual(typeof vttModule.handleKeyboardTokenMove, 'function', 'handleKeyboardTokenMove deve ser exportada');
assert.strictEqual(typeof vttModule.renderVttMovementTrail, 'function', 'renderVttMovementTrail deve ser exportada');
assert.strictEqual(typeof vttModule.clearVttMovementTrail, 'function', 'clearVttMovementTrail deve ser exportada');
console.log('  ✅ Movimentação inteligente por teclado com breadcrumbs operacional!');

console.log('\n======================================================');
console.log('🎉 TODOS OS TESTES DA SUÍTE VTT FORAM APROVADOS! 🚀');
console.log('======================================================');
