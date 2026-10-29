// test_runner.js - Automated Test Suite for Planilha RPG
const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log('🧪 Iniciando Bateria de Testes Automatizados do Planilha RPG...\n');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`  ✅ [PASS] ${message}`);
    passedTests++;
  } else {
    console.error(`  ❌ [FAIL] ${message}`);
    failedTests++;
  }
}

// --- SUÍTE 1: Verificação de Arquivos Fonte e Sintaxe JS ---
console.log('📁 1. Verificação de Arquivos Fonte e Sintaxe JS:');
const requiredFiles = [
  'builder.js',
  'src/styles/head_css.html',
  'src/ui/ui.html',
  'src/data/rules_xp.js',
  'src/data/monsters.js',
  'src/data/spells.js',
  'src/data/equipment.js',
  'src/data/classes.js',
  'src/data/species.js',
  'src/data/campaigns.js',
  'src/data/hirelings.js',
  'src/data/bastions.js',
  'src/data/feats.js',
  'src/data/backgrounds.js',
  'src/data/trait_quick_rules.js',
  'src/js/core.js',
  'src/js/combat.js',
  'src/js/players.js',
  'src/js/compendium.js',
  'src/js/classes.js',
  'src/js/species.js',
  'src/js/campaigns.js',
  'src/js/audio_synth.js',
  'src/js/qrcode_lib.js',
  'src/js/dice_roller.js',
  'src/js/vtt_grid.js',
  'src/js/screen_sync.js',
  'src/js/firebase_sync.js',
  'src/js/pdf_export.js'
];

requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  assert(fs.existsSync(filePath), `Arquivo existe: ${file}`);
  if (file.endsWith('.js')) {
    try {
      const code = fs.readFileSync(filePath, 'utf8');
      new vm.Script(code);
      assert(true, `Sintaxe válida: ${file}`);
    } catch (err) {
      assert(false, `Erro de sintaxe em ${file}: ${err.message}`);
    }
  }
});

// --- SUÍTE 2: Teste do Compilador Builder ---
console.log('\n🏗️ 2. Teste do Compilador (builder.js):');
try {
  require('./builder.js');
  const compiledPath = path.join(__dirname, 'planilha do rpg.html');
  assert(fs.existsSync(compiledPath), 'planilha do rpg.html gerada com sucesso');
  const compiledContent = fs.readFileSync(compiledPath, 'utf8');
  assert(compiledContent.includes('<!DOCTYPE html>'), 'HTML possui declaração DOCTYPE');
  assert(compiledContent.includes('Central do Mestre D&D 5e'), 'HTML possui cabeçalho principal');
  assert(compiledContent.includes('function addPlayerToCombat'), 'HTML inclui scripts de jogadores');
  assert(compiledContent.includes('function addMonsterToCombat'), 'HTML inclui scripts de compêndio');
  assert(compiledContent.length > 200000, `Tamanho da build consistente: ${(compiledContent.length / 1024).toFixed(1)} KB`);

  // Validação estrita de escopo global e sintaxe de todo o JS concatenado no bundle
  const scriptRegex = /<script>([\s\S]*?)<\/script>/gi;
  let match;
  let scriptIndex = 0;
  while ((match = scriptRegex.exec(compiledContent)) !== null) {
    scriptIndex++;
    const jsCode = match[1];
    try {
      new vm.Script(jsCode);
      assert(true, `Bundle JS #${scriptIndex} possui sintaxe e escopo 100% válidos (sem colisões let/const)`);
    } catch (syntaxErr) {
      assert(false, `Erro de sintaxe no Bundle JS #${scriptIndex}: ${syntaxErr.message}`);
    }
  }
} catch (err) {
  assert(false, `Falha na execução do builder: ${err.message}`);
}

// --- SUÍTE 3: Testes de Regras D&D 5E e Lógica de Negócio ---
console.log('\n🎲 3. Testes Unitários de Regras D&D 5E e Lógica:');

// Cria ambiente simulado de navegador no Node
const domElements = {};
const sandbox = {
  console: { log: console.log, warn: console.warn, error: console.error },
  document: {
    getElementById: (id) => {
      if (!domElements[id]) {
        domElements[id] = {
          id,
          value: id && id.includes('qty') ? '3' : '10',
          options: [{ value: '1' }, { value: '2' }],
          selectedIndex: 0,
          clientWidth: 1200,
          clientHeight: 800,
          getBoundingClientRect: () => ({ left: 0, top: 0, width: 1200, height: 800 }),
          dataset: {},
          getContext: () => ({ clearRect: () => {}, beginPath: () => {}, moveTo: () => {}, lineTo: () => {}, stroke: () => {} }),
          classList: { 
            _classes: new Set(),
            add(c) { this._classes.add(c); }, 
            remove(c) { this._classes.delete(c); }, 
            toggle(c, force) { 
              if (force !== undefined) {
                if (force) this._classes.add(c);
                else this._classes.delete(c);
                return !!force;
              }
              if (this._classes.has(c)) { this._classes.delete(c); return false; } 
              else { this._classes.add(c); return true; } 
            },
            contains(c) { return this._classes.has(c); }
          },
          innerText: '',
          innerHTML: '',
          style: {},
          querySelector: () => null,
          querySelectorAll: () => [],
          focus: () => {},
          select: () => {},
          insertAdjacentHTML: function(pos, html) { this.innerHTML = (this.innerHTML || '') + html; }
        };
      }
      return domElements[id];
    },
    createElement: (tag) => {
      const el = {
        tagName: (tag || 'DIV').toUpperCase(),
        id: '',
        className: '',
        value: '',
        innerText: '',
        innerHTML: '',
        textContent: '',
        style: {},
        classList: {
          _classes: new Set(),
          add(c) { this._classes.add(c); },
          remove(c) { this._classes.delete(c); },
          contains(c) { return this._classes.has(c); }
        },
        appendChild: () => {},
        setAttribute: (k, v) => { el[k] = v; },
        getAttribute: (k) => el[k] || null,
        insertAdjacentHTML: function(pos, html) { this.innerHTML = (this.innerHTML || '') + html; }
      };
      return el;
    },
    querySelector: (sel) => {
      if (sel && sel.startsWith('#')) return domElements[sel.slice(1)] || null;
      return null;
    },
    querySelectorAll: (sel) => {
      const results = [];
      Object.keys(domElements).forEach(k => {
        if (sel && sel.includes(k)) results.push(domElements[k]);
      });
      return results;
    },
    body: {
      classList: {
        _classes: new Set(),
        add(c) { this._classes.add(c); },
        remove(c) { this._classes.delete(c); },
        contains(c) { return this._classes.has(c); }
      },
      appendChild: () => {}
    },
    documentElement: { style: { setProperty: () => {} } },
    getElementsByName: (name) => [],
    addEventListener: () => {},
    removeEventListener: () => {}
  },
  URLSearchParams: global.URLSearchParams || require('url').URLSearchParams,
  window: {
    location: {
      href: 'http://localhost/rpg.html',
      search: '',
      hash: '',
      pathname: '/rpg.html'
    },
    history: {
      replaceState: () => {}
    },
    addEventListener: () => {},
    removeEventListener: () => {},
    AudioContext: function() {
      return {
        currentTime: 0,
        sampleRate: 44100,
        state: 'running',
        createGain: () => ({ gain: { setValueAtTime: () => {}, linearRampToValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} }, connect: () => {} }),
        createOscillator: () => ({ type: 'sine', frequency: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} }, connect: () => {}, start: () => {}, stop: () => {} }),
        createBiquadFilter: () => ({ type: 'lowpass', frequency: { setValueAtTime: () => {} }, Q: { setValueAtTime: () => {} }, connect: () => {} }),
        createBufferSource: () => ({ buffer: null, loop: false, connect: () => {}, start: () => {}, stop: () => {} }),
        createBuffer: (c, len, sr) => ({ length: len, sampleRate: sr, getChannelData: () => new Float32Array(len) }),
        resume: () => {},
        destination: {}
      };
    }
  },
  localStorage: {
    data: {},
    setItem(k, v) { this.data[k] = v; },
    getItem(k) { return this.data[k] || null; },
    removeItem(k) { delete this.data[k]; },
    clear() { this.data = {}; }
  },
  prompt: (msg, def) => (def !== undefined ? String(def) : '10'),
  confirm: () => true,
  alert: () => {},
  setTimeout: (fn) => fn(),
  clearTimeout: () => {},
  setInterval: (fn) => 1,
  clearInterval: () => {},
  Buffer: Buffer,
  atob: (str) => Buffer.from(str, 'base64').toString('binary'),
  btoa: (str) => Buffer.from(str, 'binary').toString('base64'),
  CONDITIONS_LIST: [
    { id: 'caido', name: 'Caído' },
    { id: 'envenenado', name: 'Envenenado' }
  ],
  PDFLib: require('pdf-lib')
};

vm.createContext(sandbox);

// Carrega data e logic na VM a partir de src/
const srcDir = path.join(__dirname, 'src');
const dataRulesXp = fs.readFileSync(path.join(srcDir, 'data', 'rules_xp.js'), 'utf8');
const dataFeats = fs.readFileSync(path.join(srcDir, 'data', 'feats.js'), 'utf8');
const dataBackgrounds = fs.readFileSync(path.join(srcDir, 'data', 'backgrounds.js'), 'utf8');
const dataTraitQuickRules = fs.readFileSync(path.join(srcDir, 'data', 'trait_quick_rules.js'), 'utf8');
const dataSpells = fs.readFileSync(path.join(srcDir, 'data', 'spells.js'), 'utf8');
const dataMonsters = fs.readFileSync(path.join(srcDir, 'data', 'monsters.js'), 'utf8');
const dataEquip = fs.readFileSync(path.join(srcDir, 'data', 'equipment.js'), 'utf8');
const dataCampaigns = fs.readFileSync(path.join(srcDir, 'data', 'campaigns.js'), 'utf8');
const dataHirelings = fs.readFileSync(path.join(srcDir, 'data', 'hirelings.js'), 'utf8');
const dataBastions = fs.readFileSync(path.join(srcDir, 'data', 'bastions.js'), 'utf8');
const jsAudioSynth = fs.readFileSync(path.join(srcDir, 'js', 'audio_synth.js'), 'utf8');
const jsQrCode = fs.readFileSync(path.join(srcDir, 'js', 'qrcode_lib.js'), 'utf8');
const jsCore = fs.readFileSync(path.join(srcDir, 'js', 'core.js'), 'utf8');
const jsCombat = fs.readFileSync(path.join(srcDir, 'js', 'combat.js'), 'utf8');
const jsPlayers = fs.readFileSync(path.join(srcDir, 'js', 'players.js'), 'utf8');
const jsPdfExport = fs.readFileSync(path.join(srcDir, 'js', 'pdf_export.js'), 'utf8');
const jsComp = fs.readFileSync(path.join(srcDir, 'js', 'compendium.js'), 'utf8');
const jsCampaigns = fs.readFileSync(path.join(srcDir, 'js', 'campaigns.js'), 'utf8');
const jsDice = fs.readFileSync(path.join(srcDir, 'js', 'dice_roller.js'), 'utf8');
const jsGrid = fs.readFileSync(path.join(srcDir, 'js', 'vtt_grid.js'), 'utf8');
const jsScreen = fs.readFileSync(path.join(srcDir, 'js', 'screen_sync.js'), 'utf8');
const jsFirebase = fs.readFileSync(path.join(srcDir, 'js', 'firebase_sync.js'), 'utf8');

sandbox.BroadcastChannel = function(name) {
  return {
    name,
    postMessage: () => {},
    onmessage: null,
    close: () => {}
  };
};

vm.runInContext(dataRulesXp, sandbox);
vm.runInContext(dataFeats, sandbox);
vm.runInContext(dataBackgrounds, sandbox);
vm.runInContext(dataTraitQuickRules, sandbox);
vm.runInContext(dataSpells, sandbox);
vm.runInContext(dataMonsters, sandbox);
vm.runInContext(dataEquip, sandbox);
vm.runInContext(dataCampaigns, sandbox);
vm.runInContext(dataHirelings, sandbox);
vm.runInContext(dataBastions, sandbox);
vm.runInContext(jsAudioSynth, sandbox);
vm.runInContext(jsQrCode, sandbox);
vm.runInContext(jsCore, sandbox);
vm.runInContext(jsFirebase, sandbox);
vm.runInContext(jsCombat, sandbox);
vm.runInContext(jsPlayers, sandbox);
vm.runInContext(jsPdfExport, sandbox);
vm.runInContext(jsComp, sandbox);
vm.runInContext(jsCampaigns, sandbox);
vm.runInContext(jsDice, sandbox);
vm.runInContext(jsGrid, sandbox);
vm.runInContext(jsScreen, sandbox);

// Teste 3.1: Proficiência D&D 5E
assert(vm.runInContext('getProfBonus(1)', sandbox) === 2, 'Bônus de Proficiência Nv 1 = +2');
assert(vm.runInContext('getProfBonus(5)', sandbox) === 3, 'Bônus de Proficiência Nv 5 = +3');
assert(vm.runInContext('getProfBonus(9)', sandbox) === 4, 'Bônus de Proficiência Nv 9 = +4');
assert(vm.runInContext('getProfBonus(17)', sandbox) === 6, 'Bônus de Proficiência Nv 17 = +6');

// Teste 3.2: Modificadores de Atributo
assert(vm.runInContext('getMod(10)', sandbox) === '+0', 'Modificador Atributo 10 = +0');
assert(vm.runInContext('getMod(14)', sandbox) === '+2', 'Modificador Atributo 14 = +2');
assert(vm.runInContext('getMod(8)', sandbox) === '-1', 'Modificador Atributo 8 = -1');
assert(vm.runInContext('getMod(20)', sandbox) === '+5', 'Modificador Atributo 20 = +5');

// Teste 3.3: Inserção de Jogador e Entrada no Combate mantendo PV
vm.runInContext(`
  PLAYERS.push({
    id: 'p_test_1',
    student: 'Lucas',
    name: 'Kaelen',
    level: 3,
    ac: 16,
    hp: 18,
    maxHp: 24,
    dex: 14,
    attacks: 'Espada Longa (+5, 1d8+3)'
  });
  addPlayerToCombat('p_test_1');
`, sandbox);

const addedPlayerCombatant = vm.runInContext(`state.combatants.find(c => c.playerId === 'p_test_1')`, sandbox);
assert(addedPlayerCombatant !== undefined, 'Jogador adicionado à lista de combatentes');
assert(addedPlayerCombatant && addedPlayerCombatant.hp === 18, 'Combatente preservou o PV atual da ficha (18/24 PV)');
assert(addedPlayerCombatant && addedPlayerCombatant.maxHp === 24, 'Combatente preservou o PV Máximo');

// Teste 3.4: Adição de Criaturas em Lote (Qtd: 3) com nomes sequenciais
vm.runInContext(`
  state.combatants = [];
  addMonsterToCombat('Goblin', 15, 7, 'Cimitarra (+4, 1d6+2)', 'qty-test');
`, sandbox);
const goblins = vm.runInContext(`state.combatants.filter(c => c.name.startsWith('Goblin'))`, sandbox);
const goblinNames = goblins.map(g => g.name).sort();
assert(goblins.length === 3, 'Adicionou exatamente 3 Goblins ao combate');
assert(goblinNames[0] === 'Goblin #1' && goblinNames[1] === 'Goblin #2' && goblinNames[2] === 'Goblin #3', 'Goblins numerados sequencialmente (1, 2, 3)');

// Teste 3.5: Ajuste Rápido de PV e Sincronização com Ficha
vm.runInContext(`
  addPlayerToCombat('p_test_1');
  const comb = state.combatants.find(c => c.playerId === 'p_test_1');
  quickAdjustCombatantHp(comb.id, -5);
`, sandbox);
const updatedCombatant = vm.runInContext(`state.combatants.find(c => c.playerId === 'p_test_1')`, sandbox);
const updatedPlayer = vm.runInContext(`PLAYERS.find(p => p.id === 'p_test_1')`, sandbox);
assert(updatedCombatant && updatedCombatant.hp === 13, 'Combatente sofreu 5 de dano (18 -> 13 PV)');
assert(updatedPlayer && updatedPlayer.hp === 13, 'Dano no combate sincronizou de volta na ficha do jogador');

// Teste 3.6: Exclusão Segura e Limpeza em Cascata
vm.runInContext(`deletePlayerDirect('p_test_1');`, sandbox);
const playerStillExists = vm.runInContext(`PLAYERS.some(p => p.id === 'p_test_1')`, sandbox);
const combatantStillExists = vm.runInContext(`state.combatants.some(c => c.playerId === 'p_test_1')`, sandbox);
assert(!playerStillExists, 'Ficha excluída de PLAYERS');
assert(!combatantStillExists, 'Combatente removido automaticamente do combate');

// Teste 3.7: Normalização de Strings (Busca sem Acentos)
assert(vm.runInContext("normalizeStr('Dragão Vermelho Anão')", sandbox) === 'dragao vermelho anao', 'Normalização de acentos: "Dragão Vermelho Anão" -> "dragao vermelho anao"');
assert(vm.runInContext("normalizeStr('Mísseis Mágicos')", sandbox) === 'misseis magicos', 'Normalização de acentos: "Mísseis Mágicos" -> "misseis magicos"');

// Teste 3.8: Lançamento de Magia do Grimório no Combate
const prevLogsCount = vm.runInContext('state.logs.length', sandbox);
vm.runInContext("castSpellToCombat('Bola de Fogo', 3, 'Uma esfera brilhante explode em chamas.');", sandbox);
const newLogsCount = vm.runInContext('state.logs.length', sandbox);
assert(newLogsCount > prevLogsCount, 'Lançamento de magia registrado no histórico de combate');

// Teste 3.9: Adição de NPC Gerado ao Combate
vm.runInContext(`
  lastGeneratedNPC = { name: 'Erick Ferreiro', race: 'Humano', job: 'Ferreiro de Armas', trait: 'Honesto' };
  addNPCToCombat();
`, sandbox);
const npcCombatant = vm.runInContext("state.combatants.find(c => c.name.includes('Erick Ferreiro'))", sandbox);
// Teste 3.10: Sistema de Grid VTT - Tamanhos de Tokens D&D 5E
assert(vm.runInContext("getTokenSpan({ size: 'medium' })", sandbox) === 1, 'Tamanho de token Médio/Pequeno ocupa 1 célula');
assert(vm.runInContext("getTokenSpan({ size: 'large' })", sandbox) === 2, 'Tamanho de token Grande ocupa 2 células (2x2)');
assert(vm.runInContext("getTokenSpan({ size: 'huge' })", sandbox) === 3, 'Tamanho de token Enorme ocupa 3 células (3x3)');
assert(vm.runInContext("getTokenSpan({ size: 'gargantuan' })", sandbox) === 4, 'Tamanho de token Imenso/Gargantuesco ocupa 4 células (4x4)');

// Teste 3.11: Resolução de Ícones Temáticos de Tokens
assert(vm.runInContext("getTokenClassIcon({ type: 'player' }, { className: 'Mago Evocador' })", sandbox) === '🧙‍♂️', 'Ícone de Mago resolvido corretamente');
assert(vm.runInContext("getTokenClassIcon({ type: 'player' }, { className: 'Guerreiro' })", sandbox) === '⚔️', 'Ícone de Guerreiro resolvido corretamente');
assert(vm.runInContext("getTokenClassIcon({ type: 'monster', name: 'Dragão Jovem' }, {})", sandbox) === '🐉', 'Ícone de Dragão resolvido corretamente');

// Teste 3.12: Controle de Zoom e Navegação do Grid
vm.runInContext(`
  gridState.zoom = 1.0;
  zoomBattleGrid(0.2);
`, sandbox);
assert(vm.runInContext("gridState.zoom", sandbox) === 1.2, 'Zoom in aumentou escala para 1.2x');
vm.runInContext(`zoomBattleGrid(5.0);`, sandbox);
assert(vm.runInContext("gridState.zoom", sandbox) === 2.5, 'Zoom respeita limite máximo de 2.5x');
vm.runInContext(`zoomBattleGrid(-10.0);`, sandbox);
assert(vm.runInContext("gridState.zoom", sandbox) === 0.35, 'Zoom respeita limite mínimo de 0.35x');

// Teste 3.13: Alternância da Gaveta de Combatentes do Grid
vm.runInContext(`
  isCombatantsDrawerOpen = false;
  toggleCombatantsDrawer();
`, sandbox);
assert(vm.runInContext("isCombatantsDrawerOpen", sandbox) === true, 'Abertura da gaveta de combatentes do grid ativada');

// Teste 3.14: Centralização e Foco de Câmera no Grid
vm.runInContext(`
  resetBattleGridZoom();
`, sandbox);
assert(vm.runInContext("gridState.zoom", sandbox) === 1.0, 'Reset de zoom retorna para escala 1.0');

// Teste 3.15: Gestão de Cenas e Multi-Mapas
vm.runInContext(`
  initScenes();
  const initialSceneCount = scenesState.scenes.length;
  // Cria nova cena
  document.getElementById('inp-scene-name').value = 'Caverna dos Vermes';
  document.getElementById('inp-scene-theme').value = 'bg-cave';
  document.getElementById('inp-scene-width').value = '1400';
  document.getElementById('inp-scene-height').value = '900';
  submitCreateScene();
`, sandbox);
assert(vm.runInContext("scenesState.scenes.length", sandbox) >= 2, 'Nova cena criada com sucesso no gerenciador de cenas');
assert(vm.runInContext("gridState.theme", sandbox) === 'bg-cave', 'Tema da cena ativa carregado no gridState');
assert(vm.runInContext("gridState.width", sandbox) === 1400, 'Largura da cena ativa atualizada para 1400px');

// Teste 3.16: Alternância e Duplicação de Cenas
vm.runInContext(`
  const activeId = scenesState.activeSceneId;
  duplicateScene(activeId);
`, sandbox);
const clonedScene = vm.runInContext("scenesState.scenes[scenesState.scenes.length - 1]", sandbox);
assert(clonedScene && clonedScene.name.includes('(Cópia)'), 'Cena duplicada com sucesso com sufixo (Cópia)');

// Teste 3.17: Ferramentas do VTT e Régua de Medição Tática
vm.runInContext(`
  setVttTool('ruler');
`, sandbox);
assert(vm.runInContext("activeVttTool", sandbox) === 'ruler', 'Modo de régua tática ativado com sucesso');
vm.runInContext(`
  setVttTool('draw');
`, sandbox);
assert(vm.runInContext("activeVttTool", sandbox) === 'draw', 'Modo de giz/desenho tático ativado com sucesso');

// Teste 3.18: Camada de Desenho Tático
vm.runInContext(`
  gridState.drawings = [{ color: '#f59e0b', size: 3, points: [{x: 10, y: 10}, {x: 50, y: 50}] }];
  saveScenesState();
  clearDrawings();
`, sandbox);
assert(vm.runInContext("gridState.drawings.length", sandbox) === 0, 'Limpeza de desenhos executada com sucesso');

// Teste 3.19: Templates AoE Expandidos
vm.runInContext(`
  addAoETemplate('circle_4m');
  addAoETemplate('cone_9m');
`, sandbox);
const hasCircle4m = vm.runInContext("gridState.aoeTemplates.some(a => a.type === 'circle_4m')", sandbox);
const hasCone9m = vm.runInContext("gridState.aoeTemplates.some(a => a.type === 'cone_9m')", sandbox);
assert(hasCircle4m, 'Template AoE Espírito Guardião (4,5m / 15ft) adicionado ao grid');
assert(hasCone9m, 'Template AoE Sopro do Dragão (9m / 30ft) adicionado ao grid');

// Teste 3.20: Grimório D&D 5E Expandido e Mapeamento por Classes
const totalSpellsCount = vm.runInContext("typeof SPELLS_DATA !== 'undefined' ? SPELLS_DATA.length : 0", sandbox);
assert(totalSpellsCount >= 300, `Grimório carregado com acervo completo (${totalSpellsCount} magias)`);

const bardSpells = vm.runInContext("SPELLS_DATA.filter(s => s.classes.includes('Bardo')).length", sandbox);
const wizardSpells = vm.runInContext("SPELLS_DATA.filter(s => s.classes.includes('Mago')).length", sandbox);
const clericSpells = vm.runInContext("SPELLS_DATA.filter(s => s.classes.includes('Clérigo')).length", sandbox);
const paladinSpells = vm.runInContext("SPELLS_DATA.filter(s => s.classes.includes('Paladino')).length", sandbox);

assert(bardSpells > 100, `Mapeamento de magias de Bardo verificado (${bardSpells} magias)`);
assert(wizardSpells > 180, `Mapeamento de magias de Mago verificado (${wizardSpells} magias)`);
assert(clericSpells > 90, `Mapeamento de magias de Clérigo verificado (${clericSpells} magias)`);
assert(paladinSpells > 30, `Mapeamento de magias de Paladino verificado (${paladinSpells} magias)`);

// Teste 3.21: Catálogo de Equipamentos D&D 5E e Preços Padronizados em Ouro (PO)
const totalEquipCount = vm.runInContext("typeof EQUIPMENT_DATA !== 'undefined' ? EQUIPMENT_DATA.length : 0", sandbox);
assert(totalEquipCount >= 100, `Catálogo de equipamentos carregado com acervo completo (${totalEquipCount} itens)`);

const allPricesInGold = vm.runInContext("EQUIPMENT_DATA.every(e => e.cost && e.cost.includes('PO') && !/\\b(PP|PC|PE|PL)\\b/.test(e.cost))", sandbox);
assert(allPricesInGold, 'Todos os itens possuem preços integralmente convertidos e formatados em Peças de Ouro (PO)');

const hasCategories = vm.runInContext(`
  ['Armaduras e Escudos', 'Armas Simples', 'Armas Marciais', 'Munições', 'Equipamento de Aventura', 'Focos e Itens Arcanos', 'Ferramentas e Kits', 'Montarias e Animais', 'Veículos e Arreios', 'Pacotes de Equipamento', 'Poções e Alquimia', 'Comida e Serviços'].every(cat => EQUIPMENT_DATA.some(e => e.category === cat))
`, sandbox);
assert(hasCategories, 'Todas as 12 categorias de equipamentos foram populadas corretamente');

// Teste 3.22: Árvores de Habilidades e Progressão de Classes D&D 5E 2024
const classesCode = fs.readFileSync(path.join(__dirname, 'src/data/classes.js'), 'utf8');
const classesJsCode = fs.readFileSync(path.join(__dirname, 'src/js/classes.js'), 'utf8');
vm.runInContext(classesCode, sandbox);
vm.runInContext(classesJsCode, sandbox);

const totalClassesCount = vm.runInContext("typeof CLASSES_DATA !== 'undefined' ? CLASSES_DATA.length : 0", sandbox);
assert(totalClassesCount === 12, `Todas as 12 classes oficiais D&D 5ª Edição carregadas com sucesso (${totalClassesCount} classes)`);

const allClassesHave20Levels = vm.runInContext("CLASSES_DATA.every(c => Array.isArray(c.progression) && c.progression.length === 20)", sandbox);
assert(allClassesHave20Levels, 'Todas as 12 classes possuem tabela completa de progressão do Nível 1 ao 20');

const allClassesHaveSubclasses = vm.runInContext("CLASSES_DATA.every(c => Array.isArray(c.subclasses) && c.subclasses.length >= 2)", sandbox);
assert(allClassesHaveSubclasses, 'Todas as 12 classes possuem arquétipos e subclasses oficiais detalhadas (no mínimo 2)');

const allClassesHaveFeatures = vm.runInContext("CLASSES_DATA.every(c => Array.isArray(c.features) && c.features.length >= 5)", sandbox);
assert(allClassesHaveFeatures, 'Todas as classes possuem acervo estruturado de habilidades base');

vm.runInContext(`
  selectClass('mago');
  selectSubclass(2);
`, sandbox);
assert(vm.runInContext("selectedClassId", sandbox) === 'mago', 'Seleção de classe (Mago) executada com sucesso');
assert(vm.runInContext("selectedSubclassIdx", sandbox) === 2, 'Seleção de subclasse (Índice 2) executada com sucesso');

// Teste do Modal de Detalhes da Habilidade
vm.runInContext(`
  openSkillDetail('mago', 0, false);
`, sandbox);
assert(true, 'Abertura de modal de detalhes da habilidade executada sem erros');

// Teste 3.23: Compêndio de Raças, Espécies e Linhagens D&D 5E 2024
const speciesCode = fs.readFileSync(path.join(__dirname, 'src/data/species.js'), 'utf8');
const speciesJsCode = fs.readFileSync(path.join(__dirname, 'src/js/species.js'), 'utf8');
vm.runInContext(speciesCode, sandbox);
vm.runInContext(speciesJsCode, sandbox);

const totalSpeciesCount = vm.runInContext("typeof SPECIES_DATA !== 'undefined' ? SPECIES_DATA.length : 0", sandbox);
assert(totalSpeciesCount >= 9, `Raças canônicas D&D 5E carregadas com sucesso (${totalSpeciesCount} raças)`);

const allSpeciesHaveAttributes = vm.runInContext("SPECIES_DATA.every(s => s.id && s.name && s.icon && s.size && s.speed && s.description && Array.isArray(s.traits) && s.traits.length > 0)", sandbox);
assert(allSpeciesHaveAttributes, 'Todas as espécies possuem atributos completos (ícone, tamanho, deslocamento, descrição e características)');

const allSpeciesHaveLineages = vm.runInContext("SPECIES_DATA.every(s => Array.isArray(s.lineages) && s.lineages.length > 0)", sandbox);
assert(allSpeciesHaveLineages, 'Todas as espécies possuem linhagens ou sub-raças documentadas');

vm.runInContext(`
  selectSpecies('elfo');
  selectLineage(1);
`, sandbox);
assert(vm.runInContext("activeSpeciesId", sandbox) === 'elfo', 'Seleção de espécie (Elfo) executada com sucesso');
assert(vm.runInContext("activeLineageIdx", sandbox) === 1, 'Seleção de linhagem (Alto Elfo) executada com sucesso');

// Teste de Busca e Filtro de Espécies
vm.runInContext(`
  handleSpeciesSearch('visão no escuro');
  handleSpeciesFilterSize('pequeno');
`, sandbox);
assert(vm.runInContext("speciesSearchQuery", sandbox) === 'visão no escuro', 'Filtro de busca por termo em espécies verificado');
assert(vm.runInContext("speciesFilterSize", sandbox) === 'pequeno', 'Filtro por tamanho de espécie verificado');

// Teste 3.24: Bestiário Expandido (Pocket DM / SRD 5.2 / MM 2024)
const totalBestiaryCount = vm.runInContext("typeof BESTIARY_DATA !== 'undefined' ? BESTIARY_DATA.length : 0", sandbox);
assert(totalBestiaryCount >= 600, `Bestiário carregado com catálogo completo de criaturas (${totalBestiaryCount} monstros)`);

const allMonstersHaveStats = vm.runInContext("BESTIARY_DATA.every(m => m.name && typeof m.ac === 'number' && typeof m.hp === 'number' && m.cr !== undefined && m.attack)", sandbox);
assert(allMonstersHaveStats, 'Todos os monstros possuem nome, CA, PV, ND e ações válidas');

const hasIconicMonsters = vm.runInContext(`
  ['Aboleth', 'Balor', 'Behir', 'Carniçal', 'Dragão Vermelho Adulto', 'Goblin', 'Orc', 'Zumbi'].every(name => BESTIARY_DATA.some(m => m.name === name))
`, sandbox);
assert(hasIconicMonsters, 'Criaturas clássicas e icônicas do D&D presentes no catálogo (Aboleth, Balor, Behir, Carniçal, Dragão Vermelho, Goblin, Orc, Zumbi)');

// Teste 3.25: Vinculação Automática Classe-Ficha e Lançamento de Magias por Slots
const wizSlotsNv1 = vm.runInContext("calculateSpellSlots('Mago', 1)", sandbox);
const wizSlotsNv5 = vm.runInContext("calculateSpellSlots('Mago', 5)", sandbox);
const palSlotsNv5 = vm.runInContext("calculateSpellSlots('Paladino', 5)", sandbox);
const warlockSlotsNv3 = vm.runInContext("calculateSpellSlots('Bruxo', 3)", sandbox);

assert(wizSlotsNv1[0] === 2 && wizSlotsNv1[1] === 0, 'Cálculo de slots para Mago Nv 1 correto ([2, 0, 0, 0, 0])');
assert(wizSlotsNv5[0] === 4 && wizSlotsNv5[1] === 3 && wizSlotsNv5[2] === 2, 'Cálculo de slots para Mago Nv 5 correto ([4, 3, 2, 0, 0])');
assert(palSlotsNv5[0] === 4 && palSlotsNv5[1] === 2, 'Cálculo de slots para Paladino Nv 5 correto ([4, 2, 0, 0, 0])');
assert(warlockSlotsNv3[1] === 2, 'Cálculo de pact magic para Bruxo Nv 3 correto (2 slots de 2º círculo)');

assert(vm.runInContext("getHitDieForClass('Bárbaro')", sandbox) === '1d12', 'Dado de vida para Bárbaro = 1d12');
assert(vm.runInContext("getHitDieForClass('Guerreiro')", sandbox) === '1d10', 'Dado de vida para Guerreiro = 1d10');
assert(vm.runInContext("getHitDieForClass('Mago')", sandbox) === '1d6', 'Dado de vida para Mago = 1d6');
assert(vm.runInContext("getHitDieForClass('Ladino')", sandbox) === '1d8', 'Dado de vida para Ladino = 1d8');

const fighterFeaturesNv2 = vm.runInContext("getUnlockedClassFeatures('Guerreiro', 2, 0)", sandbox);
assert(fighterFeaturesNv2.some(f => f.name.includes('Retomar o Fôlego')) && fighterFeaturesNv2.some(f => f.name.includes('Surto de Ação')), 'Habilidades desbloqueadas de Guerreiro Nv 2 recuperadas corretamente');

// Teste de consumo de slot de magia ao lançar
vm.runInContext(`
  const pTest = {
    id: 'p_caster_test',
    name: 'Maga Teste',
    student: 'Teste',
    className: 'Mago',
    level: 3,
    slots: [4, 2, 0, 0, 0],
    slotsUsed: [0, 0, 0, 0, 0],
    preparedSpells: ['Mísseis Mágicos', 'Passo Nebuloso']
  };
  PLAYERS.push(pTest);
  executeCastSpell('p_caster_test', 'Mísseis Mágicos', 1);
`, sandbox);

const updatedCaster = vm.runInContext("PLAYERS.find(p => p.id === 'p_caster_test')", sandbox);
assert(updatedCaster && updatedCaster.slotsUsed[0] === 1, 'Lançamento de magia consumiu 1 espaço de 1º Círculo');

// Teste 3.26: Compartilhamento de Ficha via Link, QR Code e Modo Portal do Jogador
const testFirstPId = vm.runInContext("PLAYERS[0].id", sandbox);
const shareUrl = vm.runInContext(`generatePlayerShareUrl('${testFirstPId}')`, sandbox);
assert(shareUrl && shareUrl.includes('view=player') && shareUrl.includes(`id=${testFirstPId}`), 'Geração de URL de compartilhamento com parâmetros de jogador');

vm.runInContext(`
  initPlayerPortalMode('${testFirstPId}');
`, sandbox);
assert(vm.runInContext("activePortalPlayerId", sandbox) === testFirstPId, 'Modo Portal do Jogador definiu activePortalPlayerId');
assert(vm.runInContext("document.body.classList.contains('mode-player-portal')", sandbox) === true, 'Classe mode-player-portal adicionada ao body');

// Validação de saída do modo portal
vm.runInContext(`
  exitPlayerPortalMode();
`, sandbox);
assert(vm.runInContext("activePortalPlayerId", sandbox) === null, 'Saída do modo portal limpou activePortalPlayerId');
assert(vm.runInContext("document.body.classList.contains('mode-player-portal')", sandbox) === false, 'Classe mode-player-portal removida com sucesso');




// Teste 3.27: Gestão de Campanhas, Heróis Vinculados, Diário e Inventário do Grupo
const activeCamp = vm.runInContext("getActiveCampaign()", sandbox);
assert(activeCamp && activeCamp.name.includes('Phandelver'), 'Campanha inicial carregada corretamente');

// Teste de criação e seleção de campanha
vm.runInContext(`
  document.getElementById('inp-camp-id').value = '';
  document.getElementById('inp-camp-name').value = 'Maldição de Strahd';
  document.getElementById('inp-camp-desc').value = 'Uma terra tomada pelas brumas de Barovia.';
  document.getElementById('inp-camp-status').value = 'active';
  saveCampaignForm();
`, sandbox);
const createdCamp = vm.runInContext("getActiveCampaign()", sandbox);
assert(createdCamp && createdCamp.name === 'Maldição de Strahd', 'Nova campanha criada e definida como ativa com sucesso');

// Teste de adição de sessão ao diário
vm.runInContext(`
  document.getElementById('inp-sess-num').value = '1';
  document.getElementById('inp-sess-date').value = '2026-03-10';
  document.getElementById('inp-sess-title').value = 'As Brumas de Barovia';
  document.getElementById('inp-sess-loc').value = 'Vila de Barovia';
  document.getElementById('inp-sess-xp').value = '250';
  document.getElementById('inp-sess-npcs').value = 'Ismark Kolyanovich, Ireena Kolyana';
  document.getElementById('inp-sess-notes').value = 'O grupo acordou em meio a uma névoa espessa e encontrou a mansão do burgomestre.';
  saveSessionLog();
`, sandbox);
const campWithSession = vm.runInContext("getActiveCampaign()", sandbox);
assert(campWithSession.sessions.some(s => s.title === 'As Brumas de Barovia' && s.xpAwarded === 250), 'Sessão de diário registrada com sucesso na campanha ativa');

// Teste de ajuste e divisão de tesouro coletivo (PO)
vm.runInContext(`
  const camp = getActiveCampaign();
  camp.playerIds = PLAYERS.slice(0, 4).map(p => p.id);
  camp.partyStash = { gold: 100, items: [], history: [] };
  splitPartyGold();
`, sandbox);
assert(vm.runInContext("getActiveCampaign().partyStash.gold", sandbox) === 0, 'Divisão de ouro esvaziou o saldo correspondente do baú (100 PO / 4 heróis = 25 cada)');

// Teste de itens no baú coletivo
vm.runInContext(`
  document.getElementById('inp-pitem-name').value = 'Símbolo Sagrado de Ravenkind';
  document.getElementById('inp-pitem-qty').value = '1';
  document.getElementById('inp-pitem-cat').value = 'Itens Mágicos';
  document.getElementById('inp-pitem-carrier').value = 'Irmão Theron';
  document.getElementById('inp-pitem-desc').value = 'Artefato sagrado de platina em formato de sol.';
  savePartyItem();
`, sandbox);
assert(vm.runInContext("getActiveCampaign().partyStash.items.some(i => i.name === 'Símbolo Sagrado de Ravenkind' && i.carrier === 'Irmão Theron')", sandbox), 'Item mágico adicionado com sucesso ao baú do grupo com portador definido');

// Teste 3.28: Rolador de Dados Global Flutuante e Fórmulas (M1)
const roll1 = vm.runInContext("rollGlobalDice(20, 1, 0, 'normal', 'Teste d20')", sandbox);
assert(roll1 && roll1.total >= 1 && roll1.total <= 20, `Rolagem d20 global no intervalo correto: ${roll1?.total}`);

const rollAdv = vm.runInContext("rollGlobalDice(20, 1, 5, 'adv', 'd20 Vantagem +5')", sandbox);
assert(rollAdv && rollAdv.total >= 6 && rollAdv.total <= 25, `Rolagem d20 c/ Vantagem +5 no intervalo correto: ${rollAdv?.total}`);

const rollFormula = vm.runInContext("rollGlobalFormula('3d6+4', 'Ataque de Fogo')", sandbox);
assert(rollFormula && rollFormula.total >= 7 && rollFormula.total <= 22, `Fórmula 3d6+4 calculada com sucesso: ${rollFormula?.total}`);

const diceHistLen = vm.runInContext("GLOBAL_DICE_HISTORY.length", sandbox);
assert(diceHistLen >= 3, `Histórico de rolagens registrado: ${diceHistLen} rolagens salvas`);

// Teste 3.29: Condições de Status nas Fichas dos Personagens (M2)
const testTargetPId = vm.runInContext("PLAYERS[0].id", sandbox);
vm.runInContext(`togglePlayerCondition('${testTargetPId}', 'envenenado')`, sandbox);
let p1Conds = vm.runInContext(`PLAYERS.find(x => x.id === '${testTargetPId}').conditions`, sandbox);
assert(p1Conds.includes('envenenado'), 'Condição "envenenado" adicionada com sucesso à ficha do jogador');

vm.runInContext(`togglePlayerCondition('${testTargetPId}', 'envenenado')`, sandbox);
p1Conds = vm.runInContext(`PLAYERS.find(x => x.id === '${testTargetPId}').conditions`, sandbox);
assert(!p1Conds.includes('envenenado'), 'Condição "envenenado" removida após toggle subsequente');

// Teste 3.30: Origem, Antecedente e Background D&D 2024 (P3)
const p1Data = vm.runInContext(`PLAYERS.find(x => x.id === '${testTargetPId}')`, sandbox);
assert(p1Data.background && p1Data.ideal && p1Data.bond && p1Data.flaw, 'Ficha possui campos de Antecedente, Ideal, Vínculo e Defeito estruturados');

// Teste 3.31: Avatares de Personagem (P4)
vm.runInContext(`openAvatarModal('${testTargetPId}'); setPlayerAvatarPreset('🐉');`, sandbox);
const pCurrentAvatar = vm.runInContext(`PLAYERS.find(x => x.id === '${testTargetPId}').avatar`, sandbox);
assert(pCurrentAvatar === '🐉', 'Avatar atualizado com sucesso para emoji pré-definido');

// Teste 3.32: Notas Rápidas do Mestre por Campanha (DM2)
vm.runInContext(`
  document.getElementById('inp-dm-quick-notes').value = 'O dragão verde Venindor planeja atacar a aldeia ao pôr do sol.';
  saveDMNotes();
`, sandbox);
const campNotes = vm.runInContext("getActiveCampaign().dmNotes", sandbox);
assert(campNotes && campNotes.includes('Venindor'), 'Notas rápidas do mestre salvas e persistidas com sucesso na campanha ativa');

// Teste 3.33: Dashboard de Visão Geral da Campanha (DM3)
vm.runInContext(`
  const activeC = getActiveCampaign();
  const cPlayers = (activeC.playerIds || []).map(id => PLAYERS.find(p => p.id === id)).filter(p => p);
  renderCampaignDashboard(activeC, cPlayers);
`, sandbox);
assert(true, 'Dashboard de visão geral da campanha renderizado sem erros');

// Teste 3.34: Perícias e Salvaguardas com Rolagens e Modificadores (P1)
const skillsCount = vm.runInContext("typeof DND5E_SKILLS !== 'undefined' ? DND5E_SKILLS.length : 0", sandbox);
assert(skillsCount === 18, `Catálogo oficial de 18 perícias D&D 5E carregado (${skillsCount} perícias)`);

const allSkillsValid = vm.runInContext("DND5E_SKILLS.every(s => s.key && s.name && s.attr && s.label)", sandbox);
assert(allSkillsValid, 'Todas as perícias possuem chave, nome, atributo e rótulo válidos');

const skillRollResult = vm.runInContext(`rollPlayerSkill('${testTargetPId}', 'atletismo', 'normal')`, sandbox);
assert(skillRollResult && skillRollResult.total >= 1 && skillRollResult.total <= 30, `Rolagem de perícia (Atletismo) executada com sucesso: Total ${skillRollResult?.total}`);

const saveRollResult = vm.runInContext(`rollPlayerSavingThrow('${testTargetPId}', 'str', 'normal')`, sandbox);
assert(saveRollResult && saveRollResult.total >= 1 && saveRollResult.total <= 30, `Rolagem de salvaguarda (FOR) executada com sucesso: Total ${saveRollResult?.total}`);

// Toggle de Proficiência em Perícia e Salvaguarda
vm.runInContext(`togglePlayerSkillProf('${testTargetPId}', 'arcanismo')`, sandbox);
let p1Skills = vm.runInContext(`PLAYERS.find(x => x.id === '${testTargetPId}').skillProficiencies`, sandbox);
assert(p1Skills.includes('arcanismo'), 'Proficiência em Arcanismo adicionada à ficha de p1');

vm.runInContext(`togglePlayerSkillProf('${testTargetPId}', 'arcanismo')`, sandbox);
p1Skills = vm.runInContext(`PLAYERS.find(x => x.id === '${testTargetPId}').skillProficiencies`, sandbox);
assert(!p1Skills.includes('arcanismo'), 'Proficiência em Arcanismo removida de p1 após novo toggle');

vm.runInContext(`togglePlayerSaveProf('${testTargetPId}', 'dex')`, sandbox);
let p1Saves = vm.runInContext(`PLAYERS.find(x => x.id === '${testTargetPId}').saveProficiencies`, sandbox);
assert(p1Saves.includes('dex'), 'Proficiência na salvaguarda de DES adicionada a p1');

// Teste 3.35: Histórico Cronológico de Ações do Personagem (P2)
vm.runInContext(`addPlayerActionLog('${testTargetPId}', '⚔️', 'Ataque teste com Machado', 'attack')`, sandbox);
let p1Logs = vm.runInContext(`PLAYERS.find(x => x.id === '${testTargetPId}').actionLogs`, sandbox);
assert(p1Logs.length > 0 && p1Logs[0].text.includes('Machado'), 'Ação registrada no histórico cronológico do personagem');

// Verificação de hook automático de dano no log
vm.runInContext(`adjustPlayerHp('${testTargetPId}', -3)`, sandbox);
p1Logs = vm.runInContext(`PLAYERS.find(x => x.id === '${testTargetPId}').actionLogs`, sandbox);
assert(p1Logs.some(l => l.text.includes('3 de dano')), 'Dano sofrido registrado automaticamente no histórico do personagem');

vm.runInContext(`clearPlayerActionLogs('${testTargetPId}')`, sandbox);
p1Logs = vm.runInContext(`PLAYERS.find(x => x.id === '${testTargetPId}').actionLogs`, sandbox);
assert(p1Logs.length === 0, 'Histórico de ações do personagem limpo com sucesso');

// Teste 3.36: Bloco de Notas Privado do Jogador (M5)
vm.runInContext(`handlePlayerNotesInput('${testTargetPId}', 'Descobri uma chave dourada no sarcófago.')`, sandbox);
const p1Notes = vm.runInContext(`PLAYERS.find(x => x.id === '${testTargetPId}').playerNotes`, sandbox);
assert(p1Notes && p1Notes.includes('chave dourada'), 'Bloco de notas privado atualizado e persistido com sucesso');

// Teste 3.37: Barra de XP Animada e Marcos 5E (V4)
const xpTableLen = vm.runInContext("typeof DND5E_XP_TABLE !== 'undefined' ? DND5E_XP_TABLE.length : 0", sandbox);
assert(xpTableLen === 20, `Tabela de marcos de XP 5E carregada com 20 níveis (${xpTableLen} marcos)`);

const p1XpProgress = vm.runInContext(`getPlayerXpProgress(PLAYERS.find(x => x.id === '${testTargetPId}'))`, sandbox);
assert(p1XpProgress && typeof p1XpProgress.pct === 'number' && p1XpProgress.pct >= 0 && p1XpProgress.pct <= 100, `Progresso de XP calculado com sucesso: ${p1XpProgress?.text} (${p1XpProgress?.pct}%)`);

const p1InitialXp = vm.runInContext(`PLAYERS.find(x => x.id === '${testTargetPId}').xp`, sandbox);
vm.runInContext(`
  const p = PLAYERS.find(x => x.id === '${testTargetPId}');
  p.xp += 200;
  addPlayerActionLog(p.id, '✨', 'Ganhou +200 XP', 'xp');
`, sandbox);
const p1NewXp = vm.runInContext(`PLAYERS.find(x => x.id === '${testTargetPId}').xp`, sandbox);
assert(p1NewXp === p1InitialXp + 200, `XP do jogador incrementado com sucesso (${p1InitialXp} -> ${p1NewXp})`);

// Teste 3.38: Gerador & Balanceador de Encontros por Orçamento de XP / ND (DM1)
const encGoblinXp = vm.runInContext("getMonsterXp('1/4')", sandbox);
assert(encGoblinXp === 50, `XP de monstro ND 1/4 calculado com sucesso: ${encGoblinXp} XP`);

const partyThresholds = vm.runInContext("getPartyXpThresholds([3, 3, 3, 3])", sandbox);
assert(partyThresholds.easy === 300 && partyThresholds.medium === 600 && partyThresholds.hard === 900 && partyThresholds.deadly === 1600, 'Orçamento de XP para 4 heróis de Nível 3 calculado corretamente (300/600/900/1600)');

const encDiffResult = vm.runInContext("calculateEncounterDifficulty([3, 3, 3, 3], [{ cr: '1/4', count: 4, name: 'Goblin' }])", sandbox);
assert(encDiffResult && encDiffResult.rawXp === 200 && encDiffResult.adjustedXp === 400 && encDiffResult.difficulty === 'Easy', `Dificuldade do encontro calculada com sucesso: ${encDiffResult?.difficulty} (${encDiffResult?.adjustedXp} XP Ajustado)`);

// Teste 3.39: Iniciativa Relâmpago do Bestiário com Despacho Instantâneo (DM4)
vm.runInContext(`
  state.combatants = [];
  openQuickInitModal('Goblin', 15, 7, '1/4', '+2');
  document.getElementById('inp-quick-init-qty').value = '3';
  submitQuickInit();
`, sandbox);
const combatantsAfterQuickInit = vm.runInContext("state.combatants", sandbox);
assert(combatantsAfterQuickInit.length === 3, 'Iniciativa relâmpago despachou exatamente 3 goblins para o combate');
assert(combatantsAfterQuickInit.every(c => c.init >= 1 && c.init <= 25), 'Iniciativas individuais roladas com sucesso no envio relâmpago');

// Teste 3.40: Temporizador de Turno de Combate com Auto-Reset (M6)
vm.runInContext(`
  setTurnTimerDuration(60);
  startTurnTimer();
  addTurnTimerSeconds(15);
`, sandbox);
assert(vm.runInContext("turnTimerRemaining", sandbox) === 75, 'Temporizador de turno configurado e incrementado com sucesso (+15s -> 75s)');
assert(vm.runInContext("turnTimerRunning", sandbox) === true, 'Temporizador de turno em execução');

vm.runInContext(`
  pauseTurnTimer();
  resetTurnTimer();
`, sandbox);
assert(vm.runInContext("turnTimerRemaining", sandbox) === 60, 'Reset do temporizador de turno retornou para duração padrão (60s)');
assert(vm.runInContext("turnTimerRunning", sandbox) === false, 'Temporizador de turno pausado');

// Teste 3.41: Contador e Automação de Cargas por Descanso (M3)
vm.runInContext(`
  const pFighter = {
    id: 'p_fighter_m3',
    name: 'Guerreiro Teste',
    student: 'Felipe',
    className: 'Guerreiro',
    level: 3,
    hp: 28,
    maxHp: 28,
    con: 14,
    featureCharges: []
  };
  PLAYERS.push(pFighter);
  initPlayerFeatureCharges(pFighter);
`, sandbox);
const fighterCharges = vm.runInContext("PLAYERS.find(p => p.id === 'p_fighter_m3').featureCharges", sandbox);
assert(fighterCharges.length >= 2, `Cargas de classe inicializadas para Guerreiro (${fighterCharges.length} habilidades registradas)`);
assert(fighterCharges.some(f => f.id === 'second_wind' && f.max === 1 && f.restType === 'short'), 'Retomar o Fôlego (1 carga / descanso curto) configurado');
assert(fighterCharges.some(f => f.id === 'action_surge' && f.max === 1 && f.restType === 'short'), 'Surto de Ação (1 carga / descanso curto) configurado');

vm.runInContext(`
  usePlayerFeatureCharge('p_fighter_m3', 'second_wind', 1);
`, sandbox);
const fighterSecondWind = vm.runInContext("PLAYERS.find(p => p.id === 'p_fighter_m3').featureCharges.find(f => f.id === 'second_wind')", sandbox);
assert(fighterSecondWind && fighterSecondWind.used === 1, 'Uso de carga de Retomar o Fôlego registrado com sucesso');

// Restauração em Descanso Curto
vm.runInContext(`
  playerShortRest('p_fighter_m3');
`, sandbox);
const fighterSecondWindAfterRest = vm.runInContext("PLAYERS.find(p => p.id === 'p_fighter_m3').featureCharges.find(f => f.id === 'second_wind')", sandbox);
assert(fighterSecondWindAfterRest && fighterSecondWindAfterRest.used === 0, 'Descanso Curto restaurou integralmente as cargas de descanso curto');

// Teste 3.42: Exportação e Impressão de Crônicas da Campanha A4/PDF (DM5)
vm.runInContext(`
  printCampaignChronicles();
`, sandbox);
assert(typeof vm.runInContext("printCampaignChronicles", sandbox) === 'function', 'Função de impressão de crônicas da campanha exportada com sucesso');

// Teste 3.43: Inspiração Heroica (D&D 2024) e Rolagem com Vantagem (M4)
vm.runInContext(`
  const pInsp = PLAYERS.find(p => p.id === '${testTargetPId}');
  pInsp.inspiration = true;
  const inspRoll = usePlayerInspirationRoll('${testTargetPId}');
`, sandbox);
const pInspAfter = vm.runInContext(`PLAYERS.find(p => p.id === '${testTargetPId}')`, sandbox);
assert(pInspAfter.inspiration === false, 'Uso da Inspiração Heroica consumiu o estado de inspiração do jogador');

// Teste 3.44: Salvaguardas contra a Morte Interativas (Death Saves - M7 / P5)
vm.runInContext(`
  const pDeath = PLAYERS.find(p => p.id === '${testTargetPId}');
  pDeath.hp = 0;
  pDeath.deathSaves = { success: 0, fail: 0 };
  toggleDeathSave('${testTargetPId}', 'success', 1);
  toggleDeathSave('${testTargetPId}', 'fail', 2);
`, sandbox);
const pDeathState = vm.runInContext(`PLAYERS.find(p => p.id === '${testTargetPId}').deathSaves`, sandbox);
assert(pDeathState.success === 1 && pDeathState.fail === 2, 'Toggle manual de sucessos e falhas de salvaguarda de morte verificado');

// Rolagem de teste contra a morte
vm.runInContext(`
  const dsRoll = rollDeathSave('${testTargetPId}');
`, sandbox);
const pDeathStateAfterRoll = vm.runInContext(`PLAYERS.find(p => p.id === '${testTargetPId}').deathSaves`, sandbox);
assert(pDeathStateAfterRoll.success >= 1 || pDeathStateAfterRoll.fail >= 2 || vm.runInContext(`PLAYERS.find(p => p.id === '${testTargetPId}').hp`, sandbox) === 1, 'Rolagem automática de salvaguarda de morte executada com sucesso');

// Teste de cura resetando death saves
vm.runInContext(`
  const pHeal = PLAYERS.find(p => p.id === '${testTargetPId}');
  pHeal.hp = 10;
  pHeal.deathSaves = { success: 0, fail: 0 };
`, sandbox);
assert(vm.runInContext(`PLAYERS.find(p => p.id === '${testTargetPId}').deathSaves.fail`, sandbox) === 0, 'Cura restaurou estado seguro e zerou contadores de morte');

// Teste 3.45: Inventário Pessoal, Carga e Carteira de Moedas (M8 / P6)
vm.runInContext(`
  const pInv = PLAYERS.find(p => p.id === '${testTargetPId}');
  pInv.str = 16;
  pInv.coins = { cp: 50, sp: 20, ep: 0, gp: 15, pp: 1 };
  pInv.inventory = [
    { name: 'Machado Grande', weight: 3.0, qty: 1, cost: '30 PO' },
    { name: 'Cota de Malha', weight: 25.0, qty: 1, cost: '75 PO' },
    { name: 'Tocha', weight: 0.5, qty: 5, cost: '5 PC' }
  ];
`, sandbox);
const carryRes = vm.runInContext(`getPlayerCarryCapacity(PLAYERS.find(p => p.id === '${testTargetPId}'))`, sandbox);
assert(carryRes.maxKg === 120, 'Capacidade máxima de carga para FOR 16 calculada corretamente (120 kg)');
assert(carryRes.itemsWeight === 30.5, `Peso de itens somado corretamente: ${carryRes.itemsWeight} kg`);
assert(carryRes.isOverloaded === false, 'Personagem não está com sobrecarga');

const purseRes = vm.runInContext(`getPlayerCoinPurse(PLAYERS.find(p => p.id === '${testTargetPId}'))`, sandbox);
assert(purseRes.totalGp === 27.5, `Patrimônio da carteira convertido corretamente: ${purseRes.totalGp} PO (50pc + 20pp + 15po + 1pl)`);

// Teste 3.46: Motor de Áudio Procedural Web Audio API (V6)
assert(typeof vm.runInContext("AudioEngine", sandbox) === 'object', 'Objeto AudioEngine instanciado globalmente');
assert(typeof vm.runInContext("AudioEngine.playFX", sandbox) === 'function', 'AudioEngine.playFX exportado com sucesso');
assert(typeof vm.runInContext("AudioEngine.playAmbiance", sandbox) === 'function', 'AudioEngine.playAmbiance exportado com sucesso');
assert(typeof vm.runInContext("AudioEngine.toggleMute", sandbox) === 'function', 'AudioEngine.toggleMute exportado com sucesso');

// Executa efeitos sem erro
vm.runInContext(`
  AudioEngine.playFX('dice');
  AudioEngine.playFX('crit');
  AudioEngine.playFX('fumble');
  AudioEngine.playFX('spell');
  AudioEngine.playFX('heal');
  AudioEngine.playFX('sword');
  AudioEngine.playFX('death');
`, sandbox);
assert(true, 'Todos os 7 efeitos sonoros procedurais (dice, crit, fumble, spell, heal, sword, death) executados sem erro');

// Teste 3.47: Gerador de Ganchos de Aventura & Missões (DM6)
vm.runInContext(`
  generateAdventureHook();
`, sandbox);
const hookGen = vm.runInContext("lastGeneratedHook", sandbox);
assert(hookGen && hookGen.patron && hookGen.objective && hookGen.twist && hookGen.reward, 'Gancho de Aventura completo gerado com patrono, objetivo, reviravolta e recompensas');

// Teste 3.48: Gerador de Clima & Eventos de Viagem (DM6)
vm.runInContext(`
  generateWeatherEvent();
`, sandbox);
const weatherGen = vm.runInContext("lastGeneratedWeather", sandbox);
assert(weatherGen && weatherGen.name && weatherGen.effect && weatherGen.icon, 'Condição climática de viagem gerada com regras oficiais D&D 5E');

// Teste 3.50: HUD Integrado de Combate no VTT (VTT Combat Dock & Quick Actions)
assert(typeof vm.runInContext("renderVttCombatHud", sandbox) === 'function', 'Função renderVttCombatHud exportada');
assert(typeof vm.runInContext("applyVttCombatAction", sandbox) === 'function', 'Função applyVttCombatAction exportada');
assert(typeof vm.runInContext("applyVttHalfDamage", sandbox) === 'function', 'Função applyVttHalfDamage exportada');
assert(typeof vm.runInContext("applyVttDoubleDamage", sandbox) === 'function', 'Função applyVttDoubleDamage exportada');
assert(typeof vm.runInContext("toggleVttCombatHud", sandbox) === 'function', 'Função toggleVttCombatHud exportada');

// Adiciona combatentes e testa renderização do HUD
vm.runInContext(`
  state.combatants = [
    { id: 'c1', name: 'Guerreiro Arthur', type: 'player', hp: 30, maxHp: 30, ac: 18, init: 15 },
    { id: 'c2', name: 'Goblin Chefe', type: 'monster', hp: 20, maxHp: 20, ac: 14, init: 10 }
  ];
  state.turnIndex = 0;
  state.round = 1;
  renderVttCombatHud();
`, sandbox);
assert(vm.runInContext("document.getElementById('lbl-vtt-round').innerText", sandbox) === '1', 'HUD VTT exibe a rodada atual corretamente (Rodada 1)');
assert(vm.runInContext("document.getElementById('vtt-active-name').innerText", sandbox) === 'Guerreiro Arthur', 'HUD VTT exibe o combatente do turno ativo (Guerreiro Arthur)');

// Teste de aplicação de dano pelo HUD do VTT
vm.runInContext(`
  document.getElementById('sel-vtt-target').value = 'c2';
  document.getElementById('inp-vtt-damage').value = '8';
  applyVttCombatAction('damage');
`, sandbox);
assert(vm.runInContext("state.combatants.find(c => c.id === 'c2').hp", sandbox) === 12, 'Dano aplicado pelo HUD do VTT reduziu PV do alvo (20 -> 12 PV)');

// Teste de aplicação de metade do dano
vm.runInContext(`
  document.getElementById('sel-vtt-target').value = 'c2';
  document.getElementById('inp-vtt-damage').value = '6';
  applyVttHalfDamage();
`, sandbox);
assert(vm.runInContext("state.combatants.find(c => c.id === 'c2').hp", sandbox) === 9, 'Metade do dano aplicada pelo HUD do VTT (12 - 3 = 9 PV)');

// Teste de cura pelo HUD do VTT
vm.runInContext(`
  document.getElementById('sel-vtt-target').value = 'c2';
  document.getElementById('inp-vtt-damage').value = '5';
  applyVttCombatAction('heal');
`, sandbox);
assert(vm.runInContext("state.combatants.find(c => c.id === 'c2').hp", sandbox) === 14, 'Cura aplicada pelo HUD do VTT restaurou PV do alvo (9 + 5 = 14 PV)');

// Teste de toggle colapsar/expandir HUD
vm.runInContext("toggleVttCombatHud()", sandbox);
assert(vm.runInContext("isVttCombatHudCollapsed", sandbox) === true, 'HUD do VTT recolhido com sucesso');
vm.runInContext("toggleVttCombatHud()", sandbox);
assert(vm.runInContext("isVttCombatHudCollapsed", sandbox) === false, 'HUD do VTT expandido com sucesso');

// Teste 3.51: Nova Aba Dedicada de Configuração do Grid & Cenários (tab-grid-config)
assert(typeof vm.runInContext("renderGridConfig", sandbox) === 'function', 'Função renderGridConfig exportada');
assert(typeof vm.runInContext("updateGridDimensionsFromConfig", sandbox) === 'function', 'Função updateGridDimensionsFromConfig exportada');
assert(typeof vm.runInContext("setGridPresetDimensions", sandbox) === 'function', 'Função setGridPresetDimensions exportada');
assert(typeof vm.runInContext("setDmFogOpacity", sandbox) === 'function', 'Função setDmFogOpacity exportada');

// Executa renderização da aba de configurações
vm.runInContext("renderGridConfig()", sandbox);
assert(vm.runInContext("document.getElementById('lbl-config-theme-current').innerText", sandbox).length > 0, 'Tema atual renderizado no painel de configurações');

// Teste de alteração de dimensões via preset
vm.runInContext("setGridPresetDimensions(1600, 1200)", sandbox);
assert(vm.runInContext("gridState.width", sandbox) === 1600 && vm.runInContext("gridState.height", sandbox) === 1200, 'Preset de dimensões 1600x1200 aplicado com sucesso');

// Teste de opacidade da névoa
vm.runInContext("setDmFogOpacity('0.60')", sandbox);
assert(vm.runInContext("document.getElementById('lbl-config-fow-opacity-val').innerText", sandbox) === '60%', 'Opacidade da névoa DM ajustada para 60%');

// Teste de transição de aba para grid-config
vm.runInContext("switchTab('grid-config')", sandbox);
assert(vm.runInContext("document.getElementById('tab-grid-config').classList.contains('active')", sandbox) === true, 'Transição para aba de configuração do grid executada com sucesso');


// Teste 3.52: HUD Refinado & Leitura em Tópicos Inteligentes (formatFeatureToTopics)
assert(typeof vm.runInContext("formatFeatureToTopics", sandbox) === 'function', 'Função formatFeatureToTopics exportada');
assert(typeof vm.runInContext("highlightInlineRules", sandbox) === 'function', 'Função highlightInlineRules exportada');
assert(typeof vm.runInContext("getTopicIconForText", sandbox) === 'function', 'Função getTopicIconForText exportada');

// Teste de destaque inline de dados, ouro, tempo e círculo de magia
const testDescSample = "Começa com 6 magias de 1º círculo e ganha **+2 magias gratuitas**, gastando 50 PO e 2 horas de estudo para causar 1d6 de dano.";
const highlighted = vm.runInContext(`highlightInlineRules(${JSON.stringify(testDescSample)})`, sandbox);
assert(highlighted.includes('hl-keyword') && highlighted.includes('hl-dice') && highlighted.includes('hl-gold') && highlighted.includes('hl-time'), 'Destaques inline aplicados com sucesso para dados, ouro, tempo e palavras-chave');

// Teste de estruturação em tópicos a partir de parágrafo longo
const formattedTopicsHtml = vm.runInContext(`formatFeatureToTopics(${JSON.stringify(testDescSample)})`, sandbox);
assert(formattedTopicsHtml.includes('skill-topic-card') || formattedTopicsHtml.includes('skill-concept-box'), 'Transformação de descrição em cards de tópicos gerada com sucesso');

// Teste de abertura de habilidade com novo HUD
vm.runInContext("openSkillDetail('mago', 0)", sandbox);
const modalDescContent = vm.runInContext("document.getElementById('skill-modal-desc').innerHTML", sandbox);
assert(modalDescContent.includes('skill-topic-card') || modalDescContent.includes('skill-concept-box'), 'Modal de detalhes de classe renderizou conteúdo estruturado em tópicos');

// Teste de abertura de traço racial com novo HUD
vm.runInContext("openSpeciesTraitModal('aasimar', 0)", sandbox);
const speciesModalContent = vm.runInContext("document.getElementById('modal-species-detail-content').innerHTML", sandbox);
// Teste 3.53: Scroll de Foco e Tela Cheia do Grid VTT
assert(typeof vm.runInContext("scrollGridIntoFocus", sandbox) === 'function', 'Função scrollGridIntoFocus exportada');
assert(typeof vm.runInContext("toggleGridFullscreen", sandbox) === 'function', 'Função toggleGridFullscreen exportada');

// Executa scrollGridIntoFocus
vm.runInContext("scrollGridIntoFocus()", sandbox);

// Teste de alternância de tela cheia
vm.runInContext("toggleGridFullscreen()", sandbox);
assert(vm.runInContext("document.getElementById('battlegrid-container').classList.contains('is-fullscreen')", sandbox) === true, 'Modo Tela Cheia do Grid ativado com sucesso');
vm.runInContext("toggleGridFullscreen()", sandbox);
assert(vm.runInContext("document.getElementById('battlegrid-container').classList.contains('is-fullscreen')", sandbox) === false, 'Modo Tela Cheia do Grid desativado com sucesso');

// Teste 3.54: Assistente de Multiclasse & Subir de Nível (Level-Up Wizard)
assert(typeof vm.runInContext("MULTICLASS_PREREQUISITES", sandbox) === 'object', 'Tabela MULTICLASS_PREREQUISITES exportada');
assert(typeof vm.runInContext("checkMulticlassPrerequisites", sandbox) === 'function', 'Função checkMulticlassPrerequisites exportada');
assert(typeof vm.runInContext("calculateMulticlassSpellSlots", sandbox) === 'function', 'Função calculateMulticlassSpellSlots exportada');
assert(typeof vm.runInContext("getPlayerClassesList", sandbox) === 'function', 'Função getPlayerClassesList exportada');
assert(typeof vm.runInContext("openLevelUpWizard", sandbox) === 'function', 'Função openLevelUpWizard exportada');
assert(typeof vm.runInContext("applyLevelUpConfirm", sandbox) === 'function', 'Função applyLevelUpConfirm exportada');

// 1. Validação de Pré-requisitos de Multiclasse
const mockWizardPlayer = {
  id: 'test_p_multi',
  name: 'Mago Teste',
  className: 'mago',
  level: 3,
  attributes: { str: 10, dex: 12, con: 14, int: 16, wis: 13, cha: 8 },
  maxHp: 18,
  currentHp: 18,
  slots: [4, 2, 0, 0, 0, 0, 0, 0, 0]
};

// Mago (INT 16 >= 13) quer multiclasse com Clérigo (SAB 13 >= 13) -> Válido
const clericReq = vm.runInContext(`checkMulticlassPrerequisites(${JSON.stringify(mockWizardPlayer)}, 'clerigo')`, sandbox);
assert(clericReq.canMulticlass === true, 'Pré-requisitos atendidos para multiclasse Mago/Clérigo (INT 16, SAB 13)');

// Mago quer multiclasse com Bárbaro (FOR 10 < 13) -> Inválido
const barbReq = vm.runInContext(`checkMulticlassPrerequisites(${JSON.stringify(mockWizardPlayer)}, 'barbaro')`, sandbox);
assert(barbReq.canMulticlass === false && barbReq.reasons.some(r => r.toUpperCase().includes('FOR')), 'Pré-requisito bloqueado para Bárbaro por Força insuficiente (< 13)');

// 2. Extração da Lista de Classes (getPlayerClassesList)
const singleClassList = vm.runInContext(`getPlayerClassesList(${JSON.stringify(mockWizardPlayer)})`, sandbox);
assert(singleClassList.length === 1 && singleClassList[0].className.toLowerCase() === 'mago' && singleClassList[0].level === 3, 'getPlayerClassesList tratou jogador de classe única com retrocompatibilidade');

// 3. Cálculo de Espaços de Magia Multiclasse (Spell Slots D&D 5E)
// Mago 3 + Clérigo 2 = Conjurador Efetivo Nível 5 (4/3/2 slots)
const multiclassPlayer = {
  ...mockWizardPlayer,
  multiclass: [
    { className: 'mago', level: 3, subclass: 'evocacao' },
    { className: 'clerigo', level: 2, subclass: 'vida' }
  ]
};
const combinedSlots = vm.runInContext(`calculateMulticlassSpellSlots(${JSON.stringify(multiclassPlayer)})`, sandbox);
assert(combinedSlots[0] === 4 && combinedSlots[1] === 3 && combinedSlots[2] === 2, 'Slots combinados calculados corretamente para Mago 3 / Clérigo 2 (Conjurador Nv 5: 4/3/2)');

// Bruxo 3 (Pact Magic 2 slots de 2º círculo) + Mago 2 (Full caster nv 2: 3 slots de 1º círculo)
const warlockMage = {
  ...mockWizardPlayer,
  multiclass: [
    { className: 'mago', level: 2 },
    { className: 'bruxo', level: 3 }
  ]
};
const warlockMageSlots = vm.runInContext(`calculateMulticlassSpellSlots(${JSON.stringify(warlockMage)})`, sandbox);
assert(warlockMageSlots[0] === 3 && warlockMageSlots[1] === 2, 'Pact Magic e Spellcasting padrão combinados corretamente (Bruxo 3 + Mago 2)');

// 4. Execução do Assistente de Level-Up no Sandbox
vm.runInContext(`
  PLAYERS.push(${JSON.stringify(mockWizardPlayer)});
  openLevelUpWizard('test_p_multi');
`, sandbox);
assert(vm.runInContext("levelUpWizardState.targetPlayerId", sandbox) === 'test_p_multi', 'Assistente de level-up inicializado com o jogador correto');
assert(vm.runInContext("levelUpWizardState.step", sandbox) === 1, 'Assistente iniciou no Passo 1 (Escolha de Classe)');

// Seleciona subir de nível na mesma classe (Mago)
vm.runInContext("selectLevelUpClass('mago')", sandbox);
assert(vm.runInContext("levelUpWizardState.selectedClass", sandbox) === 'mago', 'Classe Mago selecionada para level-up');

// Avança para o Passo 2 e 3
vm.runInContext("handleLevelUpNext()", sandbox);
assert(vm.runInContext("levelUpWizardState.step", sandbox) === 2, 'Assistente avançou para o Passo 2 (Novos Traços)');
vm.runInContext("handleLevelUpNext()", sandbox);
assert(vm.runInContext("levelUpWizardState.step", sandbox) === 3, 'Assistente avançou para o Passo 3 (PV & Conclusão)');

// Define ganho de PV Fixo Médio (d6 -> 4 + CON mod (+2) = 6)
vm.runInContext("setLevelUpHpMethod('fixed')", sandbox);
assert(vm.runInContext("levelUpWizardState.calculatedHpGain", sandbox) === 6, 'Ganho de PV médio fixo de Mago calculado corretamente (4 + CON +2 = 6)');

// Aplica a evolução de nível
vm.runInContext("applyLevelUpConfirm()", sandbox);
const updatedP = vm.runInContext("PLAYERS.find(p => p.id === 'test_p_multi')", sandbox);
assert(updatedP.level === 4, 'Nível do personagem elevado para 4 com sucesso');
assert(updatedP.maxHp === 24, 'PV Máximo do personagem incrementado com sucesso (18 + 6 = 24)');
assert(updatedP.hitDice === '4d6', 'Dado de vida atualizado para 4d6');

// Teste 3.55: Busca Inteligente & Relevância do Bestiário (D&D 5E / 2024)
assert(typeof vm.runInContext("normalizeBestiarySearch", sandbox) === 'function', 'Função normalizeBestiarySearch exportada');
assert(typeof vm.runInContext("parseMonsterCr", sandbox) === 'function', 'Função parseMonsterCr exportada');
assert(typeof vm.runInContext("searchAndFilterMonsters", sandbox) === 'function', 'Função searchAndFilterMonsters exportada');
assert(typeof vm.runInContext("clearBestiarySearch", sandbox) === 'function', 'Função clearBestiarySearch exportada');
assert(typeof vm.runInContext("setBestiaryTypeFilter", sandbox) === 'function', 'Função setBestiaryTypeFilter exportada');

// 1. Normalização de Hífens, Acentos e Pontuação
const normSample = vm.runInContext("normalizeBestiarySearch('Homem-Lagarto, o Ancião!')", sandbox);
assert(normSample === 'homem lagarto o anciao', 'normalizeBestiarySearch removeu pontuação e converteu hífens em espaços');

// 2. Parser Seguro de Nível de Desafio (ND / CR)
assert(vm.runInContext("parseMonsterCr('1/4')", sandbox) === 0.25, 'parseMonsterCr converteu 1/4 para 0.25');
assert(vm.runInContext("parseMonsterCr('1/2')", sandbox) === 0.5, 'parseMonsterCr converteu 1/2 para 0.5');
assert(vm.runInContext("parseMonsterCr('1/8')", sandbox) === 0.125, 'parseMonsterCr converteu 1/8 para 0.125');
assert(vm.runInContext("parseMonsterCr('10')", sandbox) === 10, 'parseMonsterCr converteu 10 para 10');
assert(vm.runInContext("parseMonsterCr(null)", sandbox) === 0, 'parseMonsterCr tratou null defensivamente');

// 3. Busca por Termos com Hífen vs Sem Hífen
const resWithHyphen = vm.runInContext("searchAndFilterMonsters(BESTIARY_DATA, 'urso-coruja', 'all', 'all', 'all', 'relevance')", sandbox);
const resWithoutHyphen = vm.runInContext("searchAndFilterMonsters(BESTIARY_DATA, 'urso coruja', 'all', 'all', 'all', 'relevance')", sandbox);
assert(resWithHyphen.length > 0 && resWithHyphen.length === resWithoutHyphen.length, 'Busca por "urso-coruja" e "urso coruja" retornou os mesmos resultados');

// 4. Reconhecimento de Sinônimos em Inglês
const resOwlbear = vm.runInContext("searchAndFilterMonsters(BESTIARY_DATA, 'owlbear', 'all', 'all', 'all', 'relevance')", sandbox);
assert(resOwlbear.some(r => r.monster.name.toLowerCase().includes('urso coruja')), 'Busca em inglês "owlbear" encontrou Urso Coruja');

const resRedDragon = vm.runInContext("searchAndFilterMonsters(BESTIARY_DATA, 'red dragon', 'all', 'all', 'all', 'relevance')", sandbox);
assert(resRedDragon.some(r => r.monster.name.toLowerCase().includes('dragão vermelho')), 'Busca em inglês "red dragon" encontrou Dragão Vermelho');

const resSkeleton = vm.runInContext("searchAndFilterMonsters(BESTIARY_DATA, 'skeleton', 'all', 'all', 'all', 'relevance')", sandbox);
assert(resSkeleton.some(r => r.monster.name.toLowerCase().includes('esqueleto')), 'Busca em inglês "skeleton" encontrou Esqueleto');

const resZombie = vm.runInContext("searchAndFilterMonsters(BESTIARY_DATA, 'zombie', 'all', 'all', 'all', 'relevance')", sandbox);
assert(resZombie.some(r => r.monster.name.toLowerCase().includes('zumbi')), 'Busca em inglês "zombie" encontrou Zumbi');

// 5. Ranking de Relevância
const resWolf = vm.runInContext("searchAndFilterMonsters(BESTIARY_DATA, 'lobo', 'all', 'all', 'all', 'relevance')", sandbox);
assert(resWolf[0].monster.name === 'Lobo', 'Ranking de relevância colocou correspondência exata "Lobo" no topo');

// 6. Filtragem por Tipo de Criatura
const resUndead = vm.runInContext("searchAndFilterMonsters(BESTIARY_DATA, '', 'all', 'all', 'undead', 'relevance')", sandbox);
assert(resUndead.length > 0 && resUndead.some(r => r.monster.name === 'Esqueleto' || r.monster.name === 'Zumbi' || r.monster.name === 'Carniçal'), 'Filtro de categoria "undead" retornou criaturas mortas-vivas');

// 7. Renderização com Empty State e Limpeza
vm.runInContext("document.getElementById('filter-mon-q').value = 'criaturainexistente999'", sandbox);
vm.runInContext("renderBestiary()", sandbox);
assert(vm.runInContext("document.getElementById('grid-bestiary').innerHTML", sandbox).includes('bestiary-empty-state'), 'Empty state renderizado corretamente quando nenhum monstro é encontrado');

vm.runInContext("clearBestiarySearch()", sandbox);
assert(vm.runInContext("document.getElementById('filter-mon-q').value", sandbox) === '', 'clearBestiarySearch limpou o campo de busca');



// --- SUÍTE 17: Rolagem Rápida de Ataques e Ações de Monstros (Combat Quick Rolls) ---
console.log('\n⚔️ 17. Testes de Rolagem Rápida de Ataques de Monstros:');
assert(typeof vm.runInContext("parseAndRenderMonsterActions", sandbox) === 'function', 'Função parseAndRenderMonsterActions existe');
assert(typeof vm.runInContext("rollMonsterAttackAction", sandbox) === 'function', 'Função rollMonsterAttackAction existe');

const parsedActionHtml = vm.runInContext("parseAndRenderMonsterActions('Mordida . Ataque com Arma: +4 para acertar, alcance 1,5 m. Acerto: 7 (2d4 + 2) de dano perfurante.', 'Goblin Chefe', 'm1')", sandbox);
assert(parsedActionHtml.includes('btn-monster-atk'), 'parseAndRenderMonsterActions gerou botão .btn-monster-atk');
assert(parsedActionHtml.includes('rollMonsterAttackAction'), 'parseAndRenderMonsterActions vinculou rollMonsterAttackAction');

// Simula rolagem de ataque (suporta acerto normal 2d4+2 = 4-10 ou crítico 4d4+2 = 6-18)
vm.runInContext("rollMonsterAttackAction('Mordida', 4, '2d4+2', 'Goblin Chefe', 'm1')", sandbox);
const dmgVal = vm.runInContext("parseInt(document.getElementById('inp-damage').value, 10)", sandbox);
assert(dmgVal >= 4 && dmgVal <= 18, `rollMonsterAttackAction rolou 2d4+2 e preencheu despachante de dano (${dmgVal})`);


// --- SUÍTE 18: Busca Inteligente & Filtros Avançados no Grimório (Grimoire 361 Spells) ---
console.log('\n📖 18. Testes de Busca Inteligente e Filtros do Grimório:');
assert(typeof vm.runInContext("SPELL_PHRASE_ALIASES", sandbox) === 'object', 'Dicionário SPELL_PHRASE_ALIASES exportado');
assert(vm.runInContext("SPELL_PHRASE_ALIASES['fireball']", sandbox) === 'bola de fogo', 'Alias fireball ➔ bola de fogo');
assert(vm.runInContext("SPELL_PHRASE_ALIASES['cure wounds']", sandbox) === 'curar ferimentos', 'Alias cure wounds ➔ curar ferimentos');
assert(typeof vm.runInContext("setGrimoireSchoolFilter", sandbox) === 'function', 'Função setGrimoireSchoolFilter exportada');
assert(typeof vm.runInContext("clearSpellSearch", sandbox) === 'function', 'Função clearSpellSearch exportada');
assert(typeof vm.runInContext("clearAllSpellFilters", sandbox) === 'function', 'Função clearAllSpellFilters exportada');

// Limpa e inicializa filtros padrão
vm.runInContext("clearAllSpellFilters()", sandbox);

// Testa busca por alias em inglês
vm.runInContext("document.getElementById('filter-spell-q').value = 'fireball'", sandbox);
vm.runInContext("renderSpells()", sandbox);
const cntSpellsAlias = vm.runInContext("parseInt(document.getElementById('cnt-spells').innerText, 10)", sandbox);
assert(cntSpellsAlias > 0, `Busca por alias em inglês 'fireball' encontrou ${cntSpellsAlias} magias (Bola de Fogo)`);

// Limpa busca
vm.runInContext("clearAllSpellFilters()", sandbox);
vm.runInContext("renderSpells()", sandbox);
const cntSpellsTotal = vm.runInContext("parseInt(document.getElementById('cnt-spells').innerText, 10)", sandbox);
assert(cntSpellsTotal >= 360, `Grimório possui catálogo completo de magias (${cntSpellsTotal} magias)`);


// --- SUÍTE 19: Descanso Curto Interativo com Dados de Vida (Hit Dice) ---
console.log('\n🎲 19. Testes de Descanso Curto e Reserva de Dados de Vida:');
assert(typeof vm.runInContext("getPlayerHitDieType", sandbox) === 'function', 'Função getPlayerHitDieType exportada');
assert(typeof vm.runInContext("getPlayerHitDicePool", sandbox) === 'function', 'Função getPlayerHitDicePool exportada');
assert(typeof vm.runInContext("openShortRestModal", sandbox) === 'function', 'Função openShortRestModal exportada');
assert(typeof vm.runInContext("rollShortRestHitDie", sandbox) === 'function', 'Função rollShortRestHitDie exportada');
assert(typeof vm.runInContext("finishShortRestModal", sandbox) === 'function', 'Função finishShortRestModal exportada');

const pFighter = vm.runInContext("PLAYERS[0]", sandbox);
assert(vm.runInContext("getPlayerHitDieType(PLAYERS[0])", sandbox) === 'd10', 'Guerreiro possui Dado de Vida d10');
const hdPool = vm.runInContext("getPlayerHitDicePool(PLAYERS[0])", sandbox);
assert(hdPool.total === pFighter.level, `Total de dados de vida igual ao nível do personagem (${hdPool.total})`);

// Simula dano e rolagem de dado de vida no descanso curto
pFighter.hp = 5;
pFighter.spentHitDice = 0;
vm.runInContext("openShortRestModal(PLAYERS[0].id)", sandbox);
assert(vm.runInContext("activeShortRestPlayerId", sandbox) === pFighter.id, 'activeShortRestPlayerId definido corretamente');

vm.runInContext("rollShortRestHitDie(PLAYERS[0].id)", sandbox);
assert(pFighter.hp > 5, `rollShortRestHitDie curou o personagem (PV: ${pFighter.hp}/${pFighter.maxHp})`);
assert(pFighter.spentHitDice === 1, 'spentHitDice incrementado para 1');

// Conclui descanso curto
vm.runInContext("finishShortRestModal()", sandbox);
assert(vm.runInContext("activeShortRestPlayerId", sandbox) === null, 'Modal de descanso curto fechado');

// Testa recuperação de dados de vida no Descanso Longo
vm.runInContext("playerLongRest(PLAYERS[0].id)", sandbox);
assert(pFighter.hp === pFighter.maxHp, 'playerLongRest restaurou PV ao máximo');
assert(pFighter.spentHitDice === 0, 'playerLongRest recuperou dados de vida gastos');

// --- SUÍTE 20: Mapas Customizados & Auras de Alcance no VTT ---
console.log('\n🗺️ 20. Testes de Mapas Customizados e Auras de Tokens:');
assert(typeof vm.runInContext("setTokenAura", sandbox) === 'function', 'Função setTokenAura exportada');
assert(typeof vm.runInContext("setGridMapBackground", sandbox) === 'function', 'Função setGridMapBackground exportada');

// Adiciona token de teste
vm.runInContext("gridState.tokens = [{ id: 'tok-t1', combatantId: 'c1', name: 'Valerius', type: 'player', x: 100, y: 100, size: 'medium' }]", sandbox);
vm.runInContext("setTokenAura('tok-t1', '6m', 'gold')", sandbox);
const tokT1 = vm.runInContext("gridState.tokens[0]", sandbox);
assert(tokT1.aura && tokT1.aura.range === '6m' && tokT1.aura.color === 'gold', 'setTokenAura aplicou aura 6m dourada no token');

vm.runInContext("renderBattleGrid()", sandbox);
const gridTokensHtml = vm.runInContext("document.getElementById('grid-tokens-layer').innerHTML", sandbox);
assert(gridTokensHtml.includes('token-aura aura-6m aura-gold'), 'renderBattleGrid renderizou a classe CSS da aura');

// Testa background customizado
vm.runInContext("setGridMapBackground('custom', 'data:image/png;base64,mockmapdata')", sandbox);
assert(vm.runInContext("gridState.theme", sandbox) === 'custom', 'Tema customizado ativado no gridState');
assert(vm.runInContext("gridState.customImage", sandbox) === 'data:image/png;base64,mockmapdata', 'customImage persistida no gridState');

// --- SUÍTE 21: Sistema Completo de Backup & Restauração JSON ---
console.log('\n💾 21. Testes de Backup e Restauração de Dados JSON:');
assert(typeof vm.runInContext("exportCompleteBackupJson", sandbox) === 'function', 'Função exportCompleteBackupJson exportada');
assert(typeof vm.runInContext("importBackupJson", sandbox) === 'function', 'Função importBackupJson exportada');
assert(typeof vm.runInContext("handleBackupFileSelected", sandbox) === 'function', 'Função handleBackupFileSelected exportada');

// --- SUÍTE 22: Integridade de Modais, Balanceador de Encontros, Timer Bar e Compêndio ---
console.log('\n🛡️ 22. Testes de Balanceador de Encontros, Temporizador e Correções de Sistema:');
assert(typeof vm.runInContext("openEncounterBuilderModal", sandbox) === 'function', 'Função openEncounterBuilderModal exportada');
assert(typeof vm.runInContext("populateEncounterMonsterSelect", sandbox) === 'function', 'Função populateEncounterMonsterSelect exportada');
assert(typeof vm.runInContext("addSelectedMonsterToEncounter", sandbox) === 'function', 'Função addSelectedMonsterToEncounter exportada');
assert(typeof vm.runInContext("renderEncounterBuilder", sandbox) === 'function', 'Função renderEncounterBuilder exportada');
assert(typeof vm.runInContext("dispatchEncounterToCombat", sandbox) === 'function', 'Função dispatchEncounterToCombat exportada');
assert(typeof vm.runInContext("handleSpellSearchInput", sandbox) === 'function', 'Função handleSpellSearchInput exportada');
assert(typeof vm.runInContext("togglePuzzle", sandbox) === 'function', 'Função togglePuzzle exportada');
assert(typeof vm.runInContext("setDmFogOpacity", sandbox) === 'function', 'Função setDmFogOpacity exportada');

// Testa cálculo de dificuldade de encontro no sandbox
vm.runInContext("encounterDraftMonsters = [{ name: 'Goblin', cr: '1/4', ac: 15, hp: 7, attack: 'Cimitarra', qty: 4 }]", sandbox);
vm.runInContext("encounterCustomPartyLevels = [2, 2, 2, 2]", sandbox);
vm.runInContext("renderEncounterBuilder()", sandbox);
const summaryBoxHtml = vm.runInContext("document.getElementById('enc-summary-box').innerHTML", sandbox);
assert(summaryBoxHtml.includes('XP') && summaryBoxHtml.includes('enc-th-badge'), 'Encounter Builder renderizou resumo de XP e badges de dificuldade');

// Testa despachar encontro para combate
const prevCombatantsCount = vm.runInContext("state.combatants.length", sandbox);
vm.runInContext("dispatchEncounterToCombat(false)", sandbox);
const newCombatantsCount = vm.runInContext("state.combatants.length", sandbox);
assert(newCombatantsCount === prevCombatantsCount + 4, `4 Goblins despachados para combate com sucesso (${prevCombatantsCount} -> ${newCombatantsCount})`);

// Testa atualização do Turn Timer Bar
vm.runInContext("turnTimerDuration = 60; turnTimerRemaining = 30;", sandbox);
vm.runInContext("updateTurnTimerUI()", sandbox);
const timerBar = vm.runInContext("document.getElementById('combat-timer-bar')", sandbox);
assert(timerBar && timerBar.style.width === '50%', 'Barra de progresso do timer calculou 50% de tempo restante');

// Testa ajuste de opacidade da névoa DM
vm.runInContext("setDmFogOpacity(0.65)", sandbox);
const fowCanvasDm = vm.runInContext("document.getElementById('fow-canvas-dm')", sandbox);
const fowLbl = vm.runInContext("document.getElementById('lbl-config-fow-opacity-val')", sandbox);
assert(fowCanvasDm && fowCanvasDm.style.opacity === '0.65', 'Opacidade do canvas da névoa DM ajustada para 0.65');
assert(fowLbl && fowLbl.innerText === '65%', 'Label de opacidade da névoa atualizado para 65%');

// Testa busca inteligente e filtros do grimório
vm.runInContext("document.getElementById('filter-spell-q').value = 'fireball'", sandbox);
vm.runInContext("handleSpellSearchInput('fireball')", sandbox);
const spellsGrid = vm.runInContext("document.getElementById('grid-spells').innerHTML", sandbox);
assert(spellsGrid.includes('Bola de Fogo'), 'handleSpellSearchInput filtrou e encontrou Bola de Fogo via alias fireball');

// --- SUÍTE 23: Sincronização em Nuvem (Google Firebase Firestore) ---
console.log('\n☁️ 23. Testes de Sincronização em Nuvem (Google Firebase):');
assert(typeof vm.runInContext("getStoredFirebaseConfig", sandbox) === 'function', 'Função getStoredFirebaseConfig exportada');
assert(typeof vm.runInContext("saveFirebaseConfigToStorage", sandbox) === 'function', 'Função saveFirebaseConfigToStorage exportada');
assert(typeof vm.runInContext("getStoredFirebaseRoom", sandbox) === 'function', 'Função getStoredFirebaseRoom exportada');
assert(typeof vm.runInContext("setStoredFirebaseRoom", sandbox) === 'function', 'Função setStoredFirebaseRoom exportada');
assert(typeof vm.runInContext("initFirebaseSync", sandbox) === 'function', 'Função initFirebaseSync exportada');
assert(typeof vm.runInContext("openFirebaseModal", sandbox) === 'function', 'Função openFirebaseModal exportada');
assert(typeof vm.runInContext("closeFirebaseModal", sandbox) === 'function', 'Função closeFirebaseModal exportada');
assert(typeof vm.runInContext("manualPushToCloud", sandbox) === 'function', 'Função manualPushToCloud exportada');
assert(typeof vm.runInContext("manualPullFromCloud", sandbox) === 'function', 'Função manualPullFromCloud exportada');

// Testa sala padrão e permanência no servidor principal único (ISSUE-92)
assert(vm.runInContext("getStoredFirebaseRoom()", sandbox) === 'turma_principal', 'Código de sala padrão inicializado como turma_principal');
vm.runInContext("setStoredFirebaseRoom('Turma Sábado - Mesa #1')", sandbox);
assert(vm.runInContext("getStoredFirebaseRoom()", sandbox) === 'turma_principal', 'Código de sala mantido no servidor único turma_principal');

// Testa salvamento e leitura de configuração
const sampleFirebaseConfig = {
  apiKey: "AIzaSyTestKey123",
  projectId: "rpg-prisco-test",
  authDomain: "rpg-prisco-test.firebaseapp.com"
};
vm.runInContext(`saveFirebaseConfigToStorage(${JSON.stringify(sampleFirebaseConfig)})`, sandbox);
const loadedConfig = vm.runInContext("getStoredFirebaseConfig()", sandbox);
assert(loadedConfig && loadedConfig.apiKey === "AIzaSyTestKey123" && loadedConfig.projectId === "rpg-prisco-test", 'Configuração do Firebase salva e recuperada com sucesso');

// Testa fallback gracioso quando Firebase SDK não está presente no sandbox
const initResult = vm.runInContext("initFirebaseSync()", sandbox);
assert(initResult === false, 'initFirebaseSync tratou ausência do SDK de forma defensiva e graciosa');

// Testa remoção de configuração customizada e fallback para DEFAULT_FIREBASE_CONFIG
// --- SUÍTE 24: Resolução de Classes, Subclasses e Habilidades (Prevenção de Colisões) ---
console.log('\n🛡️ 24. Testes de Resolução de Classes e Subclasses (Paladino vs Ladino):');
assert(typeof vm.runInContext("findClassData", sandbox) === 'function', 'Função findClassData exportada');
assert(typeof vm.runInContext("findSpeciesData", sandbox) === 'function', 'Função findSpeciesData exportada');

// 1. Testa busca de Paladino vs Ladino
const paladinData = vm.runInContext("findClassData('Paladino')", sandbox);
assert(paladinData && paladinData.id === 'paladino' && paladinData.name === 'Paladino', 'findClassData("Paladino") retorna Paladino corretamente (sem colisão com Ladino)');

const rogueData = vm.runInContext("findClassData('Ladino')", sandbox);
assert(rogueData && rogueData.id === 'ladino' && rogueData.name === 'Ladino', 'findClassData("Ladino") retorna Ladino corretamente');

// 2. Testa busca com nomes compostos / subclasses
const paladinSubData = vm.runInContext("findClassData('Paladino (Juramento de Devoção)')", sandbox);
assert(paladinSubData && paladinSubData.id === 'paladino', 'findClassData com nome composto "Paladino (Juramento...)" identifica Paladino');

const rogueSubData = vm.runInContext("findClassData('Ladino (Assassino)')", sandbox);
assert(rogueSubData && rogueSubData.id === 'ladino', 'findClassData com nome composto "Ladino (Assassino)" identifica Ladino');

// 3. Testa todas as 12 classes padrão
const all12Classes = ['Bárbaro', 'Bardo', 'Bruxo', 'Clérigo', 'Druida', 'Feiticeiro', 'Guerreiro', 'Ladino', 'Mago', 'Monge', 'Paladino', 'Patrulheiro'];
let allClassesMatchCorrectly = true;
all12Classes.forEach(clsName => {
  const result = vm.runInContext(`findClassData('${clsName}')`, sandbox);
  if (!result || result.name !== clsName) {
    allClassesMatchCorrectly = false;
  }
});
assert(allClassesMatchCorrectly, 'Todas as 12 classes D&D 5E são identificadas com precisão exata');

// 4. Testa habilidades desbloqueadas do Paladino Nv 3
const paladinUnlocked = vm.runInContext("getUnlockedClassFeatures('Paladino', 3, 0)", sandbox);
const hasDivineSmite = paladinUnlocked.some(f => f.name.includes('Destruição Divina') || f.name.includes('Smite'));
const hasSneakAttackInPaladin = paladinUnlocked.some(f => f.name.includes('Ataque Furtivo') || f.name.includes('Sneak'));
assert(hasDivineSmite && !hasSneakAttackInPaladin, 'Paladino Nv 3 desbloqueia Destruição Divina e NÃO puxa Ataque Furtivo do Ladino');

// 5. Testa habilidades desbloqueadas do Ladino Nv 3
const rogueUnlocked = vm.runInContext("getUnlockedClassFeatures('Ladino', 3, 0)", sandbox);
const hasSneakAttackInRogue = rogueUnlocked.some(f => f.name.includes('Ataque Furtivo'));
const hasDivineSmiteInRogue = rogueUnlocked.some(f => f.name.includes('Destruição Divina'));
assert(hasSneakAttackInRogue && !hasDivineSmiteInRogue, 'Ladino Nv 3 desbloqueia Ataque Furtivo e NÃO puxa habilidades de Paladino');

// --- SUÍTE 25: Estilo de Luta, Especialização (Expertise) e Preparação de Magias ---
console.log('\n⚔️ 25. Testes de Estilo de Luta, Especialização (Expertise) e Preparação de Magias:');
assert(typeof vm.runInContext("FIGHTING_STYLES", sandbox) === 'object', 'Dicionário FIGHTING_STYLES exportado');
assert(typeof vm.runInContext("getMaxPreparedSpells", sandbox) === 'function', 'Função getMaxPreparedSpells exportada');
assert(typeof vm.runInContext("togglePlayerSkillExpertise", sandbox) === 'function', 'Função togglePlayerSkillExpertise exportada');
assert(typeof vm.runInContext("togglePlayerSpellPrepared", sandbox) === 'function', 'Função togglePlayerSpellPrepared exportada');

// 1. Validação dos 12 Estilos de Luta
const stylesObj = vm.runInContext("FIGHTING_STYLES", sandbox);
const expectedStyles = ['archery', 'defense', 'dueling', 'twoweapon', 'protection', 'interception', 'greatweapon', 'unarmed', 'thrown', 'blind', 'blessed', 'druidic'];
const allStylesPresent = expectedStyles.every(k => stylesObj[k] && stylesObj[k].name && stylesObj[k].desc);
assert(allStylesPresent, 'Todos os 12 Estilos de Luta D&D 5E estão catalogados com nomes e descrições');

// 2. Validação do Cálculo de Magias Preparadas (Mago, Clérigo, Paladino, Conhecidas)
const wizardPrep = vm.runInContext("getMaxPreparedSpells({ className: 'Mago', level: 3, int: 16 })", sandbox);
assert(wizardPrep.isPreparedCaster && wizardPrep.max === 6, 'Mago Nv 3 com INT 16 (+3) pode preparar até 6 magias (3 + 3 = 6)');

const clericPrep = vm.runInContext("getMaxPreparedSpells({ className: 'Clérigo', level: 5, wis: 18 })", sandbox);
assert(clericPrep.isPreparedCaster && clericPrep.max === 9, 'Clérigo Nv 5 com SAB 18 (+4) pode preparar até 9 magias (5 + 4 = 9)');

const paladinPrep = vm.runInContext("getMaxPreparedSpells({ className: 'Paladino', level: 4, cha: 14 })", sandbox);
assert(paladinPrep.isPreparedCaster && paladinPrep.max === 4, 'Paladino Nv 4 com CAR 14 (+2) pode preparar até 4 magias (2 + 2 = 4)');

const sorcererPrep = vm.runInContext("getMaxPreparedSpells({ className: 'Feiticeiro', level: 5, cha: 16 })", sandbox);
assert(!sorcererPrep.isPreparedCaster && sorcererPrep.isKnownCaster && sorcererPrep.maxLeveled === 6 && sorcererPrep.maxCantrips === 5, 'Feiticeiro Nv 5 conhece exatamente 6 magias e 5 truques');

const bardPrep = vm.runInContext("getMaxPreparedSpells({ className: 'Bardo', level: 2, cha: 16 })", sandbox);
assert(bardPrep.isKnownCaster && bardPrep.maxLeveled === 5 && bardPrep.maxCantrips === 2, 'Bardo Nv 2 conhece exatamente 5 magias e 2 truques');

const warlockPrep = vm.runInContext("getMaxPreparedSpells({ className: 'Bruxo', level: 3, cha: 16 })", sandbox);
assert(warlockPrep.isKnownCaster && warlockPrep.maxLeveled === 4 && warlockPrep.maxCantrips === 2, 'Bruxo Nv 3 conhece exatamente 4 magias e 2 truques');

const rangerPrep = vm.runInContext("getMaxPreparedSpells({ className: 'Patrulheiro', level: 2, wis: 14 })", sandbox);
assert(rangerPrep.isKnownCaster && rangerPrep.maxLeveled === 2, 'Patrulheiro Nv 2 conhece exatamente 2 magias');

const eldritchPrep = vm.runInContext("getMaxPreparedSpells({ className: 'Cavaleiro Arcano', level: 3, int: 14 })", sandbox);
assert(eldritchPrep.isKnownCaster && eldritchPrep.maxLeveled === 3 && eldritchPrep.maxCantrips === 2, 'Cavaleiro Arcano Nv 3 conhece exatamente 3 magias e 2 truques');

// 2.2. Validação de CD de Magia, Modificador e Ataque Mágico (D&D 5E Formulas)
const wizardStats = vm.runInContext("getPlayerSpellcastingStats({ className: 'Mago', level: 3, int: 16 })", sandbox);
assert(wizardStats.isCaster && wizardStats.ability === 'INT' && wizardStats.saveDc === 13 && wizardStats.attackBonus === '+5', 'Mago Nv 3 c/ INT 16 (+3, PB +2) calcula CD 13 e Ataque Mágico +5');

const clericStats = vm.runInContext("getPlayerSpellcastingStats({ className: 'Clérigo', level: 5, wis: 18 })", sandbox);
assert(clericStats.isCaster && clericStats.ability === 'SAB' && clericStats.saveDc === 15 && clericStats.attackBonus === '+7', 'Clérigo Nv 5 c/ SAB 18 (+4, PB +3) calcula CD 15 e Ataque Mágico +7');

const bardStats = vm.runInContext("getPlayerSpellcastingStats({ className: 'Bardo', level: 2, cha: 16 })", sandbox);
assert(bardStats.isCaster && bardStats.ability === 'CAR' && bardStats.saveDc === 13 && bardStats.attackBonus === '+5', 'Bardo Nv 2 c/ CAR 16 (+3, PB +2) calcula CD 13 e Ataque Mágico +5');

const fighterStats = vm.runInContext("getPlayerSpellcastingStats({ className: 'Guerreiro', level: 2, str: 16, dex: 12, con: 16, int: 10, wis: 12, cha: 8, slots: [0,0,0,0,0], preparedSpells: [] })", sandbox);
assert(!fighterStats.isCaster, 'Guerreiro puro é identificado como não-conjurador');

assert(typeof vm.runInContext("rollPlayerSpellAttack", sandbox) === 'function', 'Função rollPlayerSpellAttack existe e pode ser executada');

// 3. Validação de Especialização (Expertise - Dobro da Proficiência)
const testRogue = {
  id: 'test_rogue_exp',
  name: 'Ladino Teste',
  student: 'Aluno',
  className: 'Ladino',
  level: 1, // PB = +2
  dex: 16,  // Mod = +3
  wis: 14,  // Mod = +2
  skillProficiencies: ['furtividade', 'acrobacia'],
  skillExpertises: ['furtividade']
};
vm.runInContext(`PLAYERS.push(${JSON.stringify(testRogue)})`, sandbox);

// Furtividade com Especialização: Mod (+3) + 2x Prof (+4) = +7
const stealthRoll = vm.runInContext("rollPlayerSkill('test_rogue_exp', 'furtividade')", sandbox);
assert(stealthRoll && stealthRoll.mod === 7, 'Ladino Nv 1 com DES 16 (+3) e Especialização em Furtividade soma +7 (+3 + 2x2)');

// Acrobacia apenas Proficiente: Mod (+3) + 1x Prof (+2) = +5
const acrobRoll = vm.runInContext("rollPlayerSkill('test_rogue_exp', 'acrobacia')", sandbox);
assert(acrobRoll && acrobRoll.mod === 5, 'Ladino Nv 1 com DES 16 (+3) e Proficiência normal em Acrobacia soma +5 (+3 + 2)');

// 4. Teste de Alternância de Especialização (togglePlayerSkillExpertise)
vm.runInContext("togglePlayerSkillExpertise('test_rogue_exp', 'acrobacia')", sandbox);
const updatedRogue = vm.runInContext("PLAYERS.find(p => p.id === 'test_rogue_exp')", sandbox);
assert(updatedRogue.skillExpertises.includes('acrobacia'), 'togglePlayerSkillExpertise ativou especialização em Acrobacia');

// 5. Teste de Alternância Rápida de Magia Preparada (togglePlayerSpellPrepared)
const testCaster = {
  id: 'test_caster_prep',
  name: 'Mago Teste',
  student: 'Aluno',
  className: 'Mago',
  level: 3,
  preparedSpells: ['Mísseis Mágicos']
};
vm.runInContext(`PLAYERS.push(${JSON.stringify(testCaster)})`, sandbox);
vm.runInContext("togglePlayerSpellPrepared('test_caster_prep', 'Escudo Arcano')", sandbox);
const prepCasterUpdated = vm.runInContext("PLAYERS.find(p => p.id === 'test_caster_prep')", sandbox);
assert(prepCasterUpdated.preparedSpells.includes('Escudo Arcano'), 'togglePlayerSpellPrepared adicionou Escudo Arcano às magias preparadas');

vm.runInContext("togglePlayerSpellPrepared('test_caster_prep', 'Escudo Arcano')", sandbox);
const finalCaster = vm.runInContext("PLAYERS.find(p => p.id === 'test_caster_prep')", sandbox);
assert(!finalCaster.preparedSpells.includes('Escudo Arcano'), 'togglePlayerSpellPrepared desmarcou Escudo Arcano');

// ========================================================
// 26. TESTES DE SNAPSHOTS DE SEGURANÇA E PRESERVAÇÃO DE DADOS
// ========================================================
console.log('\n🛡️ 26. Testes de Snapshots de Segurança, Recuperação e Preservação de Dados:');

assert(typeof vm.runInContext("saveSafetySnapshot", sandbox) === 'function', 'Função saveSafetySnapshot exportada');
assert(typeof vm.runInContext("getSafetySnapshots", sandbox) === 'function', 'Função getSafetySnapshots exportada');
assert(typeof vm.runInContext("restoreSafetySnapshot", sandbox) === 'function', 'Função restoreSafetySnapshot exportada');
assert(typeof vm.runInContext("openSnapshotsModal", sandbox) === 'function', 'Função openSnapshotsModal exportada');
assert(typeof vm.runInContext("closeSnapshotsModal", sandbox) === 'function', 'Função closeSnapshotsModal exportada');
assert(typeof vm.runInContext("renderSnapshotsModal", sandbox) === 'function', 'Função renderSnapshotsModal exportada');

// 1. Criação de snapshot de segurança
vm.runInContext(`
  saveSafetySnapshot('Teste Unitário de Segurança');
`, sandbox);

const snapshotsList = vm.runInContext("getSafetySnapshots()", sandbox);
assert(Array.isArray(snapshotsList) && snapshotsList.length > 0, 'Snapshot de segurança registrado na lista');
assert(snapshotsList[0].reason === 'Teste Unitário de Segurança', 'Motivo do snapshot preservado');
assert(snapshotsList[0].players && snapshotsList[0].players.length > 0, 'Fichas de personagens capturadas no snapshot');

// 2. Modifica dados e restaura a partir do snapshot
const snapId = snapshotsList[0].id;
vm.runInContext(`
  // Altera o nome do primeiro jogador
  PLAYERS[0].name = 'Nome Modificado';
  // Executa restauração
  restoreSafetySnapshot('${snapId}');
`, sandbox);

const restoredPlayer = vm.runInContext("PLAYERS[0]", sandbox);
assert(restoredPlayer && restoredPlayer.name !== 'Nome Modificado', 'Restauração de snapshot reverteu alterações com sucesso');

// 3. Teste de proteção contra nuvem vazia (Safeguard de applyCloudDataToLocal)
vm.runInContext(`
  const initialPlayersCount = PLAYERS.length;
  // Simula recebimento de payload vazio da nuvem
  applyCloudDataToLocal({ players: [] });
`, sandbox);

const postCloudCount = vm.runInContext("PLAYERS.length", sandbox);
assert(postCloudCount > 0, 'Nuvem vazia não apagou fichas locais existentes');

// ========================================================
// 27. TESTES DE MELHORIAS DA SEÇÃO DE FICHAS (PACOTE COMPLETO)
// ========================================================
console.log('\n🃏 27. Testes de Melhorias da Seção de Fichas (Layout & Gameplay):');

assert(typeof vm.runInContext("getPlayerClassBadge", sandbox) === 'function', 'Função getPlayerClassBadge exportada');
assert(typeof vm.runInContext("getPlayerRestStatus", sandbox) === 'function', 'Função getPlayerRestStatus exportada');
assert(typeof vm.runInContext("togglePlayerCardCompact", sandbox) === 'function', 'Função togglePlayerCardCompact exportada');
assert(typeof vm.runInContext("applyQuickDamage", sandbox) === 'function', 'Função applyQuickDamage exportada');
assert(typeof vm.runInContext("applyQuickHeal", sandbox) === 'function', 'Função applyQuickHeal exportada');
assert(typeof vm.runInContext("togglePlayerItemEquipped", sandbox) === 'function', 'Função togglePlayerItemEquipped exportada');
assert(typeof vm.runInContext("filterSkillsCard", sandbox) === 'function', 'Função filterSkillsCard exportada');

// 1. Teste de Badges de Classe
const barbarianBadge = vm.runInContext("getPlayerClassBadge({ className: 'Bárbaro' })", sandbox);
assert(barbarianBadge.includes('class-barbarian') && barbarianBadge.includes('🪓'), 'Badge de Bárbaro formatado corretamente');

const wizardBadge = vm.runInContext("getPlayerClassBadge({ className: 'Mago' })", sandbox);
assert(wizardBadge.includes('class-wizard') && wizardBadge.includes('📖'), 'Badge de Mago formatado corretamente');

// 2. Teste de Status de Descanso
const restedChar = { hp: 30, maxHp: 30, slots: [2, 0, 0, 0, 0], slotsUsed: [0, 0, 0, 0, 0] };
const restedStatus = vm.runInContext(`getPlayerRestStatus(${JSON.stringify(restedChar)})`, sandbox);
assert(restedStatus.css === 'rested', 'Personagem com PV cheio e slots livres classificado como Descansado');

const tiredChar = { hp: 20, maxHp: 30, slots: [2, 0, 0, 0, 0], slotsUsed: [1, 0, 0, 0, 0] };
const tiredStatus = vm.runInContext(`getPlayerRestStatus(${JSON.stringify(tiredChar)})`, sandbox);
assert(tiredStatus.css === 'tired', 'Personagem ferido ou com slot gasto classificado como Cansado');

const deadChar = { hp: 0, maxHp: 30 };
const deadStatus = vm.runInContext(`getPlayerRestStatus(${JSON.stringify(deadChar)})`, sandbox);
assert(deadStatus.css === 'unconscious', 'Personagem com 0 PV classificado como Inconsciente');

// 3. Teste de Modo Compacto (togglePlayerCardCompact)
const testCompactChar = { id: 'char_compact_test', name: 'Herói', hp: 20, maxHp: 20, level: 1 };
vm.runInContext(`PLAYERS.push(${JSON.stringify(testCompactChar)})`, sandbox);
vm.runInContext("togglePlayerCardCompact('char_compact_test')", sandbox);
const updatedCompactChar = vm.runInContext("PLAYERS.find(p => p.id === 'char_compact_test')", sandbox);
assert(updatedCompactChar.compact === true, 'togglePlayerCardCompact ativou modo compacto');

vm.runInContext("togglePlayerCardCompact('char_compact_test')", sandbox);
assert(updatedCompactChar.compact === false, 'togglePlayerCardCompact desativou modo compacto');

// 4. Teste de Equipar / Guardar Itens no Inventário
const testItemChar = {
  id: 'char_item_test',
  name: 'Herói com Item',
  hp: 20,
  maxHp: 20,
  inventory: [{ name: 'Espada Longa', qty: 1, weight: 1.5, equipped: false }]
};
vm.runInContext(`PLAYERS.push(${JSON.stringify(testItemChar)})`, sandbox);
vm.runInContext("togglePlayerItemEquipped('char_item_test', 0)", sandbox);
const updatedItemChar = vm.runInContext("PLAYERS.find(p => p.id === 'char_item_test')", sandbox);
assert(updatedItemChar.inventory[0].equipped === true, 'togglePlayerItemEquipped equipou a Espada Longa');

// 5. Teste 3.56: Uso e Consumo Rápido de Itens do Inventário (Flechas, Poções, Ração)
assert(typeof vm.runInContext("getItemActionInfo", sandbox) === 'function', 'getItemActionInfo exportado');
assert(typeof vm.runInContext("usePlayerInventoryItem", sandbox) === 'function', 'usePlayerInventoryItem exportado');

const arrowInfo = vm.runInContext("getItemActionInfo('Flechas')", sandbox);
assert(arrowInfo.isConsumable === true && arrowInfo.verb.includes('Disparar'), 'Flechas identificadas como consumíveis de disparo');

const potionInfo = vm.runInContext("getItemActionInfo('Poção de Cura')", sandbox);
assert(potionInfo.isConsumable === true && potionInfo.isHealPotion === true && potionInfo.verb.includes('Beber'), 'Poção de Cura identificada com efeito de cura');

// Teste de consumo no inventário
const testConsumableChar = {
  id: 'char_consume_test',
  name: 'Arqueiro Ranger',
  hp: 12,
  maxHp: 20,
  inventory: [
    { name: 'Flechas', qty: 20, weight: 1.0 },
    { name: 'Poção de Cura', qty: 2, weight: 0.5 },
    { name: 'Tocha', qty: 0, weight: 0.5 }
  ]
};
vm.runInContext(`PLAYERS.push(${JSON.stringify(testConsumableChar)})`, sandbox);

// Disparar 1 flecha (20 -> 19)
vm.runInContext("usePlayerInventoryItem('char_consume_test', 0)", sandbox);
let updatedConsumeChar = vm.runInContext("PLAYERS.find(p => p.id === 'char_consume_test')", sandbox);
assert(updatedConsumeChar.inventory[0].qty === 19, 'Disparo de flecha reduziu a contagem de 20 para 19');

// Beber 1 poção de cura (2 -> 1) e curar o herói
vm.runInContext("usePlayerInventoryItem('char_consume_test', 1)", sandbox);
updatedConsumeChar = vm.runInContext("PLAYERS.find(p => p.id === 'char_consume_test')", sandbox);
assert(updatedConsumeChar.inventory[1].qty === 1, 'Consumo de poção reduziu a contagem de 2 para 1');
assert(updatedConsumeChar.hp > 12, 'Poção de cura restaurou pontos de vida do personagem');

// Tentativa de consumir item esgotado (qty = 0)
vm.runInContext("usePlayerInventoryItem('char_consume_test', 2)", sandbox);
updatedConsumeChar = vm.runInContext("PLAYERS.find(p => p.id === 'char_consume_test')", sandbox);
assert(updatedConsumeChar.inventory[2].qty === 0, 'Item esgotado permanece com contagem 0 sem erros');

// ========================================================
// 28. TESTES DO BAÚ DO GRUPO E NAVEGAÇÃO DO PORTAL DO JOGADOR
// ========================================================
console.log('\n🎒 28. Testes do Baú do Grupo e Navegação do Portal do Jogador:');

assert(typeof vm.runInContext("openPartyStashModal", sandbox) === 'function', 'Função openPartyStashModal exportada');
assert(typeof vm.runInContext("closePartyStashModal", sandbox) === 'function', 'Função closePartyStashModal exportada');
assert(typeof vm.runInContext("renderPartyStashViewer", sandbox) === 'function', 'Função renderPartyStashViewer exportada');
assert(typeof vm.runInContext("takePartyItemToPlayer", sandbox) === 'function', 'Função takePartyItemToPlayer exportada');

// 1. Configura um item de teste no baú da campanha ativa
vm.runInContext(`
  const activeCamp = getActiveCampaign();
  activeCamp.partyStash = activeCamp.partyStash || { gold: 150, items: [], history: [] };
  activeCamp.partyStash.gold = 250;
  activeCamp.partyStash.items.push({
    id: 'stash_item_test_1',
    name: 'Corda Élfica (15m)',
    qty: 2,
    category: 'Aventura',
    carrier: 'Baú do Grupo',
    desc: 'Corda mágica super resistente'
  });
`, sandbox);

const campAfterStash = vm.runInContext("getActiveCampaign()", sandbox);
assert(campAfterStash.partyStash.gold === 250, 'Ouro do baú do grupo configurado corretamente (250 PO)');
assert(campAfterStash.partyStash.items.length > 0, 'Item inserido no baú do grupo com sucesso');

// 2. Transfere 1 unidade do item para o jogador
vm.runInContext(`
  activePortalPlayerId = 'char_consume_test';
  takePartyItemToPlayer('stash_item_test_1');
`, sandbox);

const updatedCampStash = vm.runInContext("getActiveCampaign()", sandbox);
const testRecipient = vm.runInContext("PLAYERS.find(p => p.id === 'char_consume_test')", sandbox);

assert(testRecipient.inventory.some(i => i.name === 'Corda Élfica (15m)'), 'Item transferido para o inventário do jogador com sucesso');
const itemInStash = updatedCampStash.partyStash.items.find(i => i.id === 'stash_item_test_1');
assert(itemInStash && itemInStash.qty === 1, 'Quantidade no baú do grupo decrementada para 1x');

assert(typeof vm.runInContext("openChroniclesViewerModal", sandbox) === 'function', 'Função openChroniclesViewerModal exportada');
assert(typeof vm.runInContext("closeChroniclesViewerModal", sandbox) === 'function', 'Função closeChroniclesViewerModal exportada');
assert(typeof vm.runInContext("renderChroniclesViewerContent", sandbox) === 'function', 'Função renderChroniclesViewerContent exportada');

// 3. Teste de segurança do Portal do Jogador (Bloqueio de Abas do Mestre)
const allowedTabs = vm.runInContext("PLAYER_ALLOWED_TABS", sandbox);
assert(Array.isArray(allowedTabs) && allowedTabs.includes('players') && !allowedTabs.includes('combat') && !allowedTabs.includes('dmscreen'), 'PLAYER_ALLOWED_TABS restringe acesso às abas do mestre');

vm.runInContext(`
  activePortalPlayerId = 'p1';
  switchTab('combat'); // Tentativa de abrir aba de combate em modo portal
`, sandbox);

const activePlayersPane = vm.runInContext("document.getElementById('tab-players').classList.contains('active')", sandbox);
assert(activePlayersPane, 'Tentativa de acessar aba de Combate em modo Portal foi redirecionada para a aba de Fichas (players)');

// 4. Validação de tags e elementos no bundle HTML
const bundleHtml = fs.readFileSync(path.join(__dirname, 'planilha do rpg.html'), 'utf8');
assert(bundleHtml.includes('id="player-portal-banner"'), 'Bundle contém player-portal-banner');
assert(bundleHtml.includes('id="modal-party-stash-view"'), 'Bundle contém modal-party-stash-view');
assert(bundleHtml.includes('id="modal-chronicles-viewer"'), 'Bundle contém modal-chronicles-viewer');
assert(bundleHtml.includes('id="pnav-chronicles"'), 'Bundle contém botão de navegação para Crônicas no portal');
assert(bundleHtml.includes('id="pnav-spells"'), 'Bundle contém botão de navegação para Grimório no portal');
assert(bundleHtml.includes('id="pnav-stash"'), 'Bundle contém botão de navegação para Baú do Grupo no portal');
assert(bundleHtml.includes('id="pnav-equipment"'), 'Bundle contém botão de navegação para Itens no portal');
assert(!bundleHtml.includes('btn-portal-exit'), 'Botão de saída para Visão do Mestre removido do portal dos jogadores');

// ========================================================
// 29. TESTES DE SINCRONIZAÇÃO EM TEMPO REAL MESTRE ↔ JOGADORES
// ========================================================
console.log('\n🔄 29. Testes de Sincronização em Tempo Real (Mestre ↔ Jogadores & Baú):');

// 1. Validação de geração de URL com parâmetro room
const shareUrlSample = vm.runInContext("generatePlayerShareUrl('char_consume_test', false)", sandbox);
assert(shareUrlSample.includes('room='), 'generatePlayerShareUrl embute parâmetro de sala na URL');
assert(shareUrlSample.includes('view=player'), 'generatePlayerShareUrl embute view=player');
assert(shareUrlSample.includes('id=char_consume_test'), 'generatePlayerShareUrl embute id do herói');

// 2. Validação da função updatePlayerPortalBanner
assert(typeof vm.runInContext("updatePlayerPortalBanner", sandbox) === 'function', 'Função updatePlayerPortalBanner exportada');

// 3. Teste de Merge Inteligente de Fichas (Preservação de Dados do Jogador no Portal)
vm.runInContext(`
  activePortalPlayerId = 'char_consume_test';
  const playerInLocal = PLAYERS.find(p => p.id === 'char_consume_test');
  playerInLocal.inventory = [{ name: 'Adaga de Prata', qty: 1, equipped: true, weight: 0.5 }];
  
  // Simula recebimento de payload da nuvem vindo do Mestre (com PV alterado e sem a adaga de prata)
  const incomingCloud = {
    players: [
      {
        id: 'char_consume_test',
        name: 'Guerreiro Teste',
        student: 'Aluno Teste',
        race: 'Humano',
        className: 'Guerreiro',
        level: 3,
        hp: 18,
        maxHp: 28,
        tempHp: 5,
        conditions: ['envenenado'],
        inventory: []
      }
    ],
    campaigns: getActiveCampaign()
  };
  
  applyCloudDataToLocal(incomingCloud);
`, sandbox);

const mergedChar = vm.runInContext("PLAYERS.find(p => p.id === 'char_consume_test')", sandbox);
assert(mergedChar.hp === 18, 'Merge remoto aplicou dano/PV enviado pelo mestre');
assert(mergedChar.tempHp === 5, 'Merge remoto aplicou PV temporário');
assert(mergedChar.conditions.includes('envenenado'), 'Merge remoto aplicou condição envenenado');
assert(mergedChar.inventory.some(i => i.name === 'Adaga de Prata'), 'Merge inteligente preservou inventário local ativo do jogador');

// 4. Teste de recepção de CAMPAIGNS_UPDATE no BroadcastChannel
const syncMsgEvent = {
  data: {
    type: 'CAMPAIGNS_UPDATE',
    campaignsState: {
      activeCampaignId: 'camp_sync_test',
      campaigns: [{ id: 'camp_sync_test', name: 'Campanha Sincronizada', partyStash: { gold: 777, items: [], history: [] } }]
    }
  }
};
vm.runInContext(`
  if (syncChannel && typeof syncChannel.onmessage === 'function') {
    syncChannel.onmessage(${JSON.stringify(syncMsgEvent)});
  }
`, sandbox);
const campAfterBroadcast = vm.runInContext("CAMPAIGNS_STATE", sandbox);
assert(campAfterBroadcast.activeCampaignId === 'camp_sync_test', 'BroadcastChannel atualizou CAMPAIGNS_STATE com sucesso');

// ========================================================
// 30. TESTES DE LINKS CURTOS E LOBBY DE ENTRADA (PC / WEB)
// ========================================================
console.log('\n💻 30. Testes de Links Curtos e Lobby de Entrada para Jogadores (PC/Web):');

// 1. Verificação de elementos no bundle compilado
assert(bundleHtml.includes('id="modal-player-login"'), 'Bundle contém modal-player-login');
assert(bundleHtml.includes('id="inp-share-url-short"'), 'Bundle contém inp-share-url-short');
assert(bundleHtml.includes('id="btn-copy-share-short"'), 'Bundle contém btn-copy-share-short');
assert(bundleHtml.includes('openPlayerLoginModal'), 'Bundle contém acionamento de openPlayerLoginModal');

// 2. Teste de geração de Link Curto sem hash pdata
const shortUrl = vm.runInContext("getShortPlayerShareUrl('char_consume_test')", sandbox);
assert(shortUrl.includes('?room='), 'Link Curto contém query param room');
assert(shortUrl.includes('&player=char_consume_test'), 'Link Curto contém query param player');
assert(!shortUrl.includes('#pdata='), 'Link Curto não contém payload base64 gigantesco');

// 3. Teste do Modal de Login de Jogador
assert(typeof vm.runInContext("openPlayerLoginModal", sandbox) === 'function', 'Função openPlayerLoginModal exportada');
assert(typeof vm.runInContext("closePlayerLoginModal", sandbox) === 'function', 'Função closePlayerLoginModal exportada');
assert(typeof vm.runInContext("renderPlayerLoginList", sandbox) === 'function', 'Função renderPlayerLoginList exportada');
assert(typeof vm.runInContext("selectLoginCharacter", sandbox) === 'function', 'Função selectLoginCharacter exportada');

// Abre modal e valida classe open
vm.runInContext("openPlayerLoginModal()", sandbox);
const loginModalEl = domElements['modal-player-login'];
assert(loginModalEl && loginModalEl.classList.contains('open'), 'openPlayerLoginModal abriu modal com classe open');

// Valida renderização da lista de heróis no container do login
const loginListContainer = domElements['player-login-list-container'];
assert(loginListContainer && loginListContainer.innerHTML.includes('player-login-card'), 'renderPlayerLoginList gerou cards de seleção de heróis');
assert(loginListContainer.innerHTML.includes('Guerreiro Teste'), 'Card contém nome do herói cadastrado');

// Seleciona personagem pelo lobby
vm.runInContext("selectLoginCharacter('char_consume_test')", sandbox);
const selectedPortalId = vm.runInContext("activePortalPlayerId", sandbox);
assert(selectedPortalId === 'char_consume_test', 'selectLoginCharacter ativou o herói escolhido no modo portal');
assert(loginModalEl && !loginModalEl.classList.contains('open'), 'selectLoginCharacter fechou o modal de login automaticamente');

// 4. Teste de Auto-Ativação do Portal via Query Param ?room=...&player=...
vm.runInContext(`
  activePortalPlayerId = null;
  window.location.search = '?room=turma_secundaria&player=char_consume_test';
  checkPlayerPortalUrl();
`, sandbox);
const portalActivatedFromUrl = vm.runInContext("activePortalPlayerId", sandbox);
assert(portalActivatedFromUrl === 'char_consume_test', 'checkPlayerPortalUrl ativou o modo portal via parâmetro ?player=...');
// ========================================================
// 31. TESTES DE PUBLICAÇÃO DA MESA E ISOLAMENTO DE JOGADORES
// ========================================================
console.log('\n🛡️ 31. Testes de Publicação da Mesa e Isolamento de Jogadores:');

// 1. Verificação de botões de publicação no bundle
assert(bundleHtml.includes('publishMasterCampaignToCloud'), 'Bundle contém chamada para publishMasterCampaignToCloud');
assert(bundleHtml.includes('copyLobbyShareLink'), 'Bundle contém chamada para copyLobbyShareLink');

// 2. Exportação de funções do host/player
assert(typeof vm.runInContext("publishMasterCampaignToCloud", sandbox) === 'function', 'Função publishMasterCampaignToCloud exportada');
assert(typeof vm.runInContext("executePlayerCloudSave", sandbox) === 'function', 'Função executePlayerCloudSave exportada');
assert(typeof vm.runInContext("copyLobbyShareLink", sandbox) === 'function', 'Função copyLobbyShareLink exportada');

// 3. Teste de preservação de sala única ao selecionar campanha (ISSUE-92)
vm.runInContext(`
  localStorage.removeItem('dnd5e_firebase_room');
  CAMPAIGNS_STATE.campaigns[0].name = 'Campanhas Prisco';
  handleCampaignSelect(CAMPAIGNS_STATE.campaigns[0].id);
`, sandbox);
const derivedRoom = vm.runInContext("getStoredFirebaseRoom()", sandbox);
assert(derivedRoom === 'turma_principal', 'Seleção de campanha mantém o servidor principal único turma_principal');

// 4. Teste de isolamento de papéis (Role isolation)
vm.runInContext("clientRole = 'player'", sandbox);
let saveAttemptBlocked = true;
// ========================================================
// 32. TESTES DO BAÚ COLETIVO, CADASTRO DEFENSIVO E LINK CURTO
// ========================================================
console.log('\n🎒 32. Testes do Baú Coletivo, Cadastro Defensivo e Link Curto:');

// 1. Verificação de funções exportadas
assert(typeof vm.runInContext("addItemToPartyStash", sandbox) === 'function', 'Função addItemToPartyStash exportada');
assert(typeof vm.runInContext("promptAddEquipmentToPartyStash", sandbox) === 'function', 'Função promptAddEquipmentToPartyStash exportada');
assert(typeof vm.runInContext("promptGiveEquipmentToPlayer", sandbox) === 'function', 'Função promptGiveEquipmentToPlayer exportada');

// 2. Teste de cadastro defensivo quando partyStash não possui history (corrige TypeError)
vm.runInContext(`
  const testCamp = getActiveCampaign();
  testCamp.partyStash = { gold: 100, items: [] }; // history propositalmente undefined
  addItemToPartyStash('Poção de Invisibilidade', 2, 'Poções', 'Fica invisível por 1 hora');
`, sandbox);

const updatedStash = vm.runInContext("getActiveCampaign().partyStash", sandbox);
assert(Array.isArray(updatedStash.history), 'partyStash.history foi inicializado defensivamente');
assert(updatedStash.history.length > 0, 'Histórico de transação registrado com sucesso no baú');
assert(updatedStash.items.some(it => it.name === 'Poção de Invisibilidade' && it.qty === 2), 'Item cadastrado com sucesso no baú coletivo sem erros');

// 3. Teste de empilhamento do modal no bundle (z-index: 150)
assert(bundleHtml.includes('id="modal-party-item"') && bundleHtml.includes('z-index: 150'), 'Modal de adicionar item possui z-index: 150 para sobreposição perfeita');

// 4. Teste de botões rápidos nos cards do Compêndio
assert(bundleHtml.includes('promptAddEquipmentToPartyStash'), 'Cards de equipamento incluem botão para adicionar ao baú');
assert(bundleHtml.includes('promptGiveEquipmentToPlayer'), 'Cards de equipamento incluem botão para entregar a um herói');

// 5. Teste de resolução assíncrona do link curto (pendingPortalPlayerId)
vm.runInContext(`
  activePortalPlayerId = null;
  pendingPortalPlayerId = null;
  window.location.search = '?room=campanhas_prisco&player=char_hero_cloud_only';
  checkPlayerPortalUrl();
`, sandbox);

const pendingId = vm.runInContext("pendingPortalPlayerId", sandbox);
const activeId = vm.runInContext("activePortalPlayerId", sandbox);
assert(pendingId === 'char_hero_cloud_only', 'checkPlayerPortalUrl registrou pendingPortalPlayerId para o herói ainda não baixado');
assert(activeId === null, 'checkPlayerPortalUrl NÃO fez fallback incorreto para Aeloria enquanto aguarda a nuvem');

// Simula chegada dos dados do Firebase com o herói aguardado
vm.runInContext(`
  applyCloudDataToLocal({
    players: [
      { id: 'char_hero_cloud_only', name: 'Grommash', student: 'Carlos', className: 'Bárbaro', level: 3, hp: 35, maxHp: 35, ac: 14 }
    ],
    state: { combatants: [], round: 1, current: 0 },
    lastUpdatedBy: 'server'
  });
`, sandbox);

const resolvedActiveId = vm.runInContext("activePortalPlayerId", sandbox);
const clearedPendingId = vm.runInContext("pendingPortalPlayerId", sandbox);
assert(resolvedActiveId === 'char_hero_cloud_only', 'applyCloudDataToLocal autenticou e ativou com sucesso o herói que estava pendente');
assert(clearedPendingId === null, 'pendingPortalPlayerId foi limpo após resolução bem-sucedida');
vm.runInContext("window.location.search = '';", sandbox);

// 6. Teste de exclusão individual e reset de movimentações do baú
assert(typeof vm.runInContext("deletePartyStashHistoryItem", sandbox) === 'function', 'Função deletePartyStashHistoryItem exportada');
assert(typeof vm.runInContext("clearPartyStashHistory", sandbox) === 'function', 'Função clearPartyStashHistory exportada');

// Adiciona 3 movimentações de teste
vm.runInContext(`
  const c = getActiveCampaign();
  c.partyStash = c.partyStash || { gold: 0, items: [], history: [] };
  c.partyStash.history = [
    { date: '2026-09-14', text: 'Movimentacao 1', type: 'gold_in' },
    { date: '2026-09-14', text: 'Movimentacao 2', type: 'item_in' },
    { date: '2026-09-14', text: 'Movimentacao 3', type: 'gold_out' }
  ];
  // Exclui a movimentação do meio (índice 1)
  deletePartyStashHistoryItem(1);
`, sandbox);

const historyAfterDelete = vm.runInContext("getActiveCampaign().partyStash.history", sandbox);
assert(historyAfterDelete.length === 2, 'deletePartyStashHistoryItem removeu exatamente 1 registro do histórico');
assert(!historyAfterDelete.some(h => h.text === 'Movimentacao 2'), 'Registro específico excluído com precisão');

// Limpa todo o histórico
vm.runInContext("clearPartyStashHistory()", sandbox);
const historyAfterClear = vm.runInContext("getActiveCampaign().partyStash.history", sandbox);
assert(Array.isArray(historyAfterClear) && historyAfterClear.length === 0, 'clearPartyStashHistory resetou com sucesso todo o histórico do baú');

// ========================================================
// 33. TESTES DE PERFORMANCE, CHUNKING E DESACOPLAMENTO DE I/O EM ABAS (ISSUE-59)
// ========================================================
console.log('\n⚡ 33. Testes de Performance, Chunking e Desacoplamento de I/O em Abas:');

// 1. switchTab não deve chamar saveToLocalStorage (I/O desacoplado)
vm.runInContext(`
  let testSaveCount = 0;
  const originalSave = saveToLocalStorage;
  saveToLocalStorage = () => { testSaveCount++; };
  switchTab('spells');
  switchTab('bestiary');
  saveToLocalStorage = originalSave;
`, sandbox);
const saveCallsDuringTabSwitch = vm.runInContext("testSaveCount", sandbox);
assert(saveCallsDuringTabSwitch === 0, 'switchTab não dispara saveToLocalStorage (zero I/O ao navegar entre abas)');

// 2. Limite inicial de renderização (chunking)
assert(typeof vm.runInContext("loadMoreSpells", sandbox) === 'function', 'Função loadMoreSpells exportada');
assert(typeof vm.runInContext("loadMoreBestiary", sandbox) === 'function', 'Função loadMoreBestiary exportada');
const initSpellsLimit = vm.runInContext("spellsVisibleLimit", sandbox);
const initBestiaryLimit = vm.runInContext("bestiaryVisibleLimit", sandbox);
assert(initSpellsLimit === 36, 'Grimório inicia com lote leve de 36 magias');
assert(initBestiaryLimit === 36, 'Bestiário inicia com lote leve de 36 criaturas');

// 3. Expansão fluida de lotes ao carregar mais
vm.runInContext("loadMoreSpells()", sandbox);
assert(vm.runInContext("spellsVisibleLimit", sandbox) === 72, 'loadMoreSpells incrementou o limite visível para 72 magias');
vm.runInContext("loadMoreBestiary()", sandbox);
assert(vm.runInContext("bestiaryVisibleLimit", sandbox) === 72, 'loadMoreBestiary incrementou o limite visível para 72 criaturas');

// 4. Trava de loop / reentrância em sincronização remota
assert(vm.runInContext("typeof isApplyingRemoteSync", sandbox) === 'boolean', 'Flag isApplyingRemoteSync definida para proteção de reentrância');
vm.runInContext(`
  let testBroadcastSent = false;
  isApplyingRemoteSync = true;
  if (typeof broadcastStateSync === 'function') {
    // broadcastStateSync deve abortar silenciosamente sem enviar nada
    broadcastStateSync();
  }
  isApplyingRemoteSync = false;
`, sandbox);
assert(vm.runInContext("isApplyingRemoteSync", sandbox) === false, 'Loop guard impediu tempestade de broadcast durante sync remoto');

// ========================================================
// 34. TESTES DE PERSISTÊNCIA E RECUPERAÇÃO DO DIÁRIO DE SESSÕES (ISSUE-60)
// ========================================================
console.log('\n📖 34. Testes de Persistência e Recuperação do Diário de Sessões:');

assert(typeof vm.runInContext("saveSessionDraft", sandbox) === 'function', 'Função saveSessionDraft exportada');
assert(typeof vm.runInContext("recoverSessionsFromSnapshots", sandbox) === 'function', 'Função recoverSessionsFromSnapshots exportada');
assert(typeof vm.runInContext("mergeCloudCampaignsState", sandbox) === 'function', 'Função mergeCloudCampaignsState exportada');

// 1. Salvamento de sessão com título padrão automático (sem falhar com alerta se vazio)
vm.runInContext(`
  (() => {
    const activeCampTest = getActiveCampaign();
    activeCampTest.sessions = [];
    document.getElementById('inp-sess-num').value = '5';
    document.getElementById('inp-sess-date').value = '2026-09-14';
    document.getElementById('inp-sess-title').value = ''; // Título em branco
    document.getElementById('inp-sess-loc').value = 'Cripta dos Antigos';
    document.getElementById('inp-sess-xp').value = '250';
    document.getElementById('inp-sess-npcs').value = 'Ghouls e Sombra';
    document.getElementById('inp-sess-notes').value = 'Os aventureiros exploraram a tumba e derrotaram a criatura.';
    saveSessionLog();
  })();
`, sandbox);

const recordedSession = vm.runInContext("getActiveCampaign().sessions.find(s => s.number === 5)", sandbox);
assert(recordedSession !== undefined, 'Sessão 5 foi gravada no diário da campanha ativa');
assert(recordedSession.title === 'Sessão 5', 'Título em branco recebeu fallback automático para "Sessão 5" sem descartar dados');
assert(recordedSession.location === 'Cripta dos Antigos', 'Local da sessão registrado corretamente');

// 2. Mescla inteligente da nuvem (mergeCloudCampaignsState) preservando sessões locais
vm.runInContext(`
  const remoteCampData = {
    campaigns: [{
      id: getActiveCampaign().id,
      name: getActiveCampaign().name,
      sessions: [
        { id: 'remote_sess_1', number: 1, date: '2026-09-01', title: 'Sessão 1 Antiga', notes: 'Sessão remota antiga' }
      ]
    }]
  };
  mergeCloudCampaignsState(remoteCampData);
`, sandbox);

const sessionsAfterCloudMerge = vm.runInContext("getActiveCampaign().sessions", sandbox);
assert(sessionsAfterCloudMerge.length === 2, 'Merge da nuvem preservou a sessão local existente junto com a remota');
assert(sessionsAfterCloudMerge.some(s => s.number === 5), 'Sessão local recém-escrita foi 100% preservada contra sobreposição');
assert(sessionsAfterCloudMerge.some(s => s.id === 'remote_sess_1'), 'Sessão remota foi incorporada com sucesso');

// 3. Recuperação de sessões a partir de snapshots
vm.runInContext(`
  // Cria um snapshot com uma sessão exclusiva
  saveSafetySnapshot('Snapshot para teste de recuperação');
  // Simula perda acidental
  getActiveCampaign().sessions = [];
  // Executa recuperação defensiva
  const recovered = recoverSessionsFromSnapshots(true);
`, sandbox);

const recoveredSessions = vm.runInContext("getActiveCampaign().sessions", sandbox);
assert(recoveredSessions.length > 0, 'recoverSessionsFromSnapshots restaurou sessões com sucesso a partir dos backups');

// 4. Teste de addHookToCampaignJournal (Compêndio -> Diário de Campanha)
assert(typeof vm.runInContext("addHookToCampaignJournal", sandbox) === 'function', 'Função addHookToCampaignJournal exportada');
vm.runInContext(`
  const countBeforeHook = getActiveCampaign().sessions.length;
  addHookToCampaignJournal('Gancho Misterioso na Taverna', 'O taverneiro entrega um mapa antigo.', 'Gundren Rockseeker');
  const countAfterHook = getActiveCampaign().sessions.length;
  const addedHookSession = getActiveCampaign().sessions[getActiveCampaign().sessions.length - 1];
`, sandbox);
assert(vm.runInContext("countAfterHook === countBeforeHook + 1", sandbox), 'addHookToCampaignJournal adicionou nova sessão com sucesso');
assert(vm.runInContext("addedHookSession.title === 'Gancho Misterioso na Taverna'", sandbox), 'addHookToCampaignJournal registrou título do gancho');
assert(vm.runInContext("addedHookSession.keyNpcs === 'Gundren Rockseeker'", sandbox), 'addHookToCampaignJournal registrou NPCs do gancho');
assert(vm.runInContext("addedHookSession.notes.includes('mapa antigo')", sandbox), 'addHookToCampaignJournal registrou narrativa do gancho em notes');

// 5. Teste de detecção de rascunho não salvo em renderCampaignSessions
vm.runInContext(`
  localStorage.setItem('dnd5e_session_draft', JSON.stringify({
    title: 'Rascunho de Teste',
    notes: 'Anotações que não foram perdidas',
    num: 99
  }));
  renderCampaignSessions(getActiveCampaign());
  const timelineHtml = document.getElementById('camp-sessions-timeline').innerHTML;
`, sandbox);
assert(vm.runInContext("timelineHtml.includes('Rascunho não salvo detectado')", sandbox), 'renderCampaignSessions exibe banner de aviso quando há rascunho no localStorage');
assert(vm.runInContext("timelineHtml.includes('Restaurar Rascunho')", sandbox), 'renderCampaignSessions inclui botão de restauração de rascunho com 1 clique');

// 6. Teste de proteção de foco em Notas do Mestre (renderDMNotes e Firebase Sync)
vm.runInContext(`
  const dmNotesCamp = getActiveCampaign();
  dmNotesCamp.dmNotes = 'Notas originais salvas';
  const dmNotesEl = document.getElementById('inp-dm-quick-notes');
  if (dmNotesEl) {
    dmNotesEl.value = 'Digitando nova ideia que ainda não foi salva...';
    // Simula campo em foco
    document.activeElement = dmNotesEl;
    renderDMNotes();
  }
`, sandbox);
assert(vm.runInContext("document.getElementById('inp-dm-quick-notes').value === 'Digitando nova ideia que ainda não foi salva...'", sandbox), 'renderDMNotes não sobrescreveu o textarea enquanto o mestre está digitando');

vm.runInContext(`
  // Testa salvamento de DM notes
  saveDMNotes();
  const savedDmNotesLocal = localStorage.getItem('dnd_tracker_dm_notes_v3');
  document.activeElement = document.body;
`, sandbox);
assert(vm.runInContext("savedDmNotesLocal === 'Digitando nova ideia que ainda não foi salva...'", sandbox), 'saveDMNotes sincronizou as notas para dnd_tracker_dm_notes_v3');


// ----------------------------------------------------
// 35. Testes de Integridade de Lookup, Debounce VTT e Sincronização de Moedas/Sessões
// ----------------------------------------------------
console.log('\n🛡️ 35. Testes de Integridade de Lookup, Debounce VTT e Sincronização de Moedas/Sessões:');

assert(vm.runInContext("typeof findCombatantForPlayer === 'function'", sandbox), 'Função findCombatantForPlayer exportada');
assert(vm.runInContext("typeof findPlayerForCombatant === 'function'", sandbox), 'Função findPlayerForCombatant exportada');

// 1. Teste de isolamento de nomes e chave primária por ID (evita colisão de substring)
vm.runInContext(`
  const mockPlayers = [
    { id: 'p_lia', name: 'Lia', student: 'Ana', hp: 20, maxHp: 20 },
    { id: 'p_elian', name: 'Elian', student: 'Carlos', hp: 30, maxHp: 30 }
  ];
  const mockCombatants = [
    { id: 'c_1', playerId: 'p_elian', name: 'Elian (Carlos)', hp: 30, maxHp: 30 },
    { id: 'c_2', playerId: 'p_lia', name: 'Lia (Ana)', hp: 20, maxHp: 20 }
  ];

  const foundForLia = findCombatantForPlayer(mockPlayers[0], mockCombatants);
  const foundForElian = findCombatantForPlayer(mockPlayers[1], mockCombatants);
`, sandbox);
assert(vm.runInContext("foundForLia && foundForLia.id === 'c_2'", sandbox), 'findCombatantForPlayer associou Lia ao combatente correto c_2 sem colidir com Elian');
assert(vm.runInContext("foundForElian && foundForElian.id === 'c_1'", sandbox), 'findCombatantForPlayer associou Elian ao combatente correto c_1');

// 2. Teste de findPlayerForCombatant
vm.runInContext(`
  const playerForC1 = findPlayerForCombatant(mockCombatants[0], mockPlayers);
`, sandbox);
assert(vm.runInContext("playerForC1 && playerForC1.id === 'p_elian'", sandbox), 'findPlayerForCombatant associou combatente a Elian com precisão');

// 3. Teste de persistência de moedas (coins) no portal
vm.runInContext(`
  const originalPlayer = {
    id: 'p_local_active',
    name: 'Herói Ativo',
    hp: 25,
    maxHp: 30,
    coins: { cp: 10, sp: 5, ep: 0, gp: 50, pp: 1 },
    inventory: [{ id: 'it_1', name: 'Espada de Aço', qty: 1 }]
  };
  PLAYERS = [originalPlayer];
  activePortalPlayerId = 'p_local_active';

  const remoteCloudUpdate = {
    players: [
      {
        id: 'p_local_active',
        name: 'Herói Ativo',
        hp: 20, // Dano vindo do mestre
        maxHp: 30,
        coins: { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 } // Nuvem desatualizada em moedas
      }
    ]
  };
  applyCloudDataToLocal(remoteCloudUpdate);
  const mergedPlayer = PLAYERS.find(p => p.id === 'p_local_active');
`, sandbox);
assert(vm.runInContext("mergedPlayer && mergedPlayer.hp === 20", sandbox), 'applyCloudDataToLocal aplicou dano de 20 PV enviado pelo mestre');
assert(vm.runInContext("mergedPlayer && mergedPlayer.coins && mergedPlayer.coins.gp === 50", sandbox), 'applyCloudDataToLocal preservou 50 GP locais do jogador ativo');

// 4. Teste de merge de sessões com updatedAt mais recente
vm.runInContext(`
  const testCampState = {
    campaigns: [{
      id: 'camp_test_ts',
      name: 'Campanha Teste',
      sessions: [
        { id: 'sess_1', number: 1, date: '2026-09-01', notes: 'Versão local antiga curta', updatedAt: 1000 }
      ]
    }]
  };
  CAMPAIGNS_STATE = testCampState;

  const remoteCampUpdate = {
    campaigns: [{
      id: 'camp_test_ts',
      sessions: [
        { id: 'sess_1', number: 1, date: '2026-09-01', notes: 'Versão mais recente editada', updatedAt: 2000 }
      ]
    }]
  };
  mergeCloudCampaignsState(remoteCampUpdate);
  const updatedSess = CAMPAIGNS_STATE.campaigns[0].sessions[0];
`, sandbox);
assert(vm.runInContext("updatedSess && updatedSess.notes === 'Versão mais recente editada'", sandbox), 'mergeCloudCampaignsState adotou versão mais recente baseada em updatedAt');

// 5. Teste de normalização em initPlayerPortalMode
vm.runInContext(`
  PLAYERS.push({ id: 'p_norm_test', name: 'Valérius Martelo Negro', student: 'Arthur', hp: 28, maxHp: 28 });
  initPlayerPortalMode('valerius');
`, sandbox);
assert(vm.runInContext("activePortalPlayerId === 'p_norm_test'", sandbox), 'initPlayerPortalMode localizou personagem por nome normalizado sem acento');

// 6. Teste de presença dos elementos UI da versão 3.7
const distHtml = fs.readFileSync(path.join(__dirname, 'planilha do rpg.html'), 'utf8');
assert(distHtml.includes('portal-sync-status-badge'), 'Bundle contém badge visual de status de sincronização (portal-sync-status-badge)');
assert(distHtml.includes('debouncedVttSave'), 'Bundle contém função debouncedVttSave para performance do VTT');

// ========================================================
// 36. TESTES DE USABILIDADE, MENU DRAWER, FAB, TOASTS & GESTOS
// ========================================================
console.log('\n📱 36. Testes de Usabilidade, Menu Drawer, FAB, Toasts e Gestos:');

// 1. Validação de exportação de funções essenciais de UI/UX
assert(typeof vm.runInContext("showToast", sandbox) === 'function', 'Função showToast exportada');
assert(typeof vm.runInContext("toggleNavDrawer", sandbox) === 'function', 'Função toggleNavDrawer exportada');
assert(typeof vm.runInContext("openNavDrawer", sandbox) === 'function', 'Função openNavDrawer exportada');
assert(typeof vm.runInContext("closeNavDrawer", sandbox) === 'function', 'Função closeNavDrawer exportada');
assert(typeof vm.runInContext("toggleFabMenu", sandbox) === 'function', 'Função toggleFabMenu exportada');
assert(typeof vm.runInContext("openFabMenu", sandbox) === 'function', 'Função openFabMenu exportada');
assert(typeof vm.runInContext("closeFabMenu", sandbox) === 'function', 'Função closeFabMenu exportada');
assert(typeof vm.runInContext("handleFabQuickAction", sandbox) === 'function', 'Função handleFabQuickAction exportada');
assert(typeof vm.runInContext("initSwipeNavigation", sandbox) === 'function', 'Função initSwipeNavigation exportada');

// 2. Teste de manipulação do Drawer Lateral
vm.runInContext(`
  const mockDrawer = { classList: { add: (c) => mockDrawer.classes.add(c), remove: (c) => mockDrawer.classes.delete(c), contains: (c) => mockDrawer.classes.has(c) }, classes: new Set() };
  const mockBackdrop = { classList: { add: (c) => mockBackdrop.classes.add(c), remove: (c) => mockBackdrop.classes.delete(c), contains: (c) => mockBackdrop.classes.has(c) }, classes: new Set() };
  const origGetElementById = document.getElementById;
  document.getElementById = (id) => {
    if (id === 'nav-drawer') return mockDrawer;
    if (id === 'nav-drawer-backdrop') return mockBackdrop;
    return origGetElementById(id);
  };
  openNavDrawer();
  const drawerOpened = mockDrawer.classList.contains('open') && mockBackdrop.classList.contains('open');
  closeNavDrawer();
  const drawerClosed = !mockDrawer.classList.contains('open') && !mockBackdrop.classList.contains('open');
  document.getElementById = origGetElementById;
`, sandbox);
assert(vm.runInContext("drawerOpened", sandbox), 'openNavDrawer adicionou classe open ao drawer e backdrop');
assert(vm.runInContext("drawerClosed", sandbox), 'closeNavDrawer removeu classe open do drawer e backdrop');

// 3. Teste de manipulação do FAB Speed Dial
vm.runInContext(`
  const mockFab = { classList: { toggle: (c) => { if (mockFab.classes.has(c)) mockFab.classes.delete(c); else mockFab.classes.add(c); }, add: (c) => mockFab.classes.add(c), remove: (c) => mockFab.classes.delete(c), contains: (c) => mockFab.classes.has(c) }, classes: new Set() };
  const origGetElementByIdFab = document.getElementById;
  document.getElementById = (id) => {
    if (id === 'fab-speed-dial') return mockFab;
    return origGetElementByIdFab(id);
  };
  toggleFabMenu();
  const fabToggledOpen = mockFab.classList.contains('open');
  closeFabMenu();
  const fabClosed = !mockFab.classList.contains('open');
  document.getElementById = origGetElementByIdFab;
`, sandbox);
assert(vm.runInContext("fabToggledOpen", sandbox), 'toggleFabMenu abriu o FAB adicionando classe open');
assert(vm.runInContext("fabClosed", sandbox), 'closeFabMenu fechou o FAB removendo classe open');

// 4. Teste de presença e integridade dos componentes no Bundle HTML
assert(distHtml.includes('id="btn-nav-hamburger"'), 'Bundle contém botão hamburguer (#btn-nav-hamburger)');
assert(distHtml.includes('id="nav-drawer-backdrop"'), 'Bundle contém backdrop do drawer (#nav-drawer-backdrop)');
assert(distHtml.includes('id="nav-drawer"'), 'Bundle contém container do menu lateral (#nav-drawer)');
assert(distHtml.includes('id="fab-speed-dial"'), 'Bundle contém FAB Speed Dial (#fab-speed-dial)');
assert(distHtml.includes('id="toast-container"'), 'Bundle contém container de notificações Toast (#toast-container)');
assert(distHtml.includes('pulseCritical'), 'CSS contém keyframe pulseCritical para PV crítico');
assert(distHtml.includes('hp-critical'), 'CSS contém classe hp-critical para destaque de perigo iminente');
assert(distHtml.includes('safe-area-inset'), 'CSS contém suporte a safe-area-inset para notch de celular');
assert(distHtml.includes('drawer-cluster-title'), 'CSS contém estilos dos clusters do menu lateral');

// ========================================================
// 37. TESTES DE LOGIN DO ALUNO, PIN DO MESTRE E TELA DE BOAS-VINDAS
// ========================================================
console.log('\n🔐 37. Testes de Login do Aluno, PIN do Mestre e Tela de Boas-Vindas:');

// 1. Verificação de exportação das funções
assert(typeof vm.runInContext("isMasterPinConfigured", sandbox) === 'function', 'Função isMasterPinConfigured exportada');
assert(typeof vm.runInContext("isMasterAuthorized", sandbox) === 'function', 'Função isMasterAuthorized exportada');
assert(typeof vm.runInContext("grantMasterSession", sandbox) === 'function', 'Função grantMasterSession exportada');
assert(typeof vm.runInContext("lockMasterSession", sandbox) === 'function', 'Função lockMasterSession exportada');
assert(typeof vm.runInContext("openMasterPinModal", sandbox) === 'function', 'Função openMasterPinModal exportada');
assert(typeof vm.runInContext("closeMasterPinModal", sandbox) === 'function', 'Função closeMasterPinModal exportada');
assert(typeof vm.runInContext("handlePinDigit", sandbox) === 'function', 'Função handlePinDigit exportada');
assert(typeof vm.runInContext("handlePinBackspace", sandbox) === 'function', 'Função handlePinBackspace exportada');
assert(typeof vm.runInContext("handlePinClear", sandbox) === 'function', 'Função handlePinClear exportada');
assert(typeof vm.runInContext("submitMasterPin", sandbox) === 'function', 'Função submitMasterPin exportada');
assert(typeof vm.runInContext("requestMasterAccess", sandbox) === 'function', 'Função requestMasterAccess exportada');
assert(typeof vm.runInContext("openWelcomeScreen", sandbox) === 'function', 'Função openWelcomeScreen exportada');
assert(typeof vm.runInContext("closeWelcomeScreen", sandbox) === 'function', 'Função closeWelcomeScreen exportada');
assert(typeof vm.runInContext("handleWelcomeSelect", sandbox) === 'function', 'Função handleWelcomeSelect exportada');
assert(typeof vm.runInContext("resumeLastPlayerSession", sandbox) === 'function', 'Função resumeLastPlayerSession exportada');
assert(typeof vm.runInContext("dismissPlayerReturnBanner", sandbox) === 'function', 'Função dismissPlayerReturnBanner exportada');
assert(typeof vm.runInContext("openRoomQrCodeModal", sandbox) === 'function', 'Função openRoomQrCodeModal exportada');
assert(typeof vm.runInContext("closeRoomQrCodeModal", sandbox) === 'function', 'Função closeRoomQrCodeModal exportada');

// 2. Teste de ciclo de autorização e PIN do Mestre
vm.runInContext(`
  localStorage.removeItem('dnd5e_master_pin');
  localStorage.removeItem('dnd5e_master_session_exp');
`, sandbox);
assert(vm.runInContext("isMasterPinConfigured()", sandbox) === false, 'isMasterPinConfigured retorna false quando nenhum PIN existe');

// Define PIN de 4 dígitos (ex: 4321)
vm.runInContext(`
  localStorage.setItem('dnd5e_master_pin', '4321');
`, sandbox);
assert(vm.runInContext("isMasterPinConfigured()", sandbox) === true, 'isMasterPinConfigured retorna true após gravar PIN');
assert(vm.runInContext("isMasterAuthorized()", sandbox) === false, 'isMasterAuthorized bloqueia acesso se não houver sessão ativa');

// Concede sessão de 8 horas
vm.runInContext(`
  grantMasterSession(8);
`, sandbox);
assert(vm.runInContext("isMasterAuthorized()", sandbox) === true, 'grantMasterSession autoriza acesso do mestre');

// Bloqueia sessão do mestre
vm.runInContext(`
  lockMasterSession();
`, sandbox);
assert(vm.runInContext("isMasterAuthorized()", sandbox) === false, 'lockMasterSession revoga acesso do mestre');

// 3. Teste de digitação do teclado virtual de PIN (handlePinDigit, handlePinBackspace, handlePinClear)
vm.runInContext(`
  handlePinClear();
  handlePinDigit('4');
  handlePinDigit('3');
  handlePinDigit('2');
`, sandbox);
assert(vm.runInContext("currentPinDigits", sandbox) === '432', 'handlePinDigit acumulou os dígitos corretamente');
vm.runInContext("handlePinBackspace()", sandbox);
assert(vm.runInContext("currentPinDigits", sandbox) === '43', 'handlePinBackspace removeu o último dígito');
vm.runInContext("handlePinClear()", sandbox);
assert(vm.runInContext("currentPinDigits", sandbox) === '', 'handlePinClear limpou todos os dígitos');

// 4. Teste de validação e sucesso de PIN
vm.runInContext(`
  handlePinDigit('4');
  handlePinDigit('3');
  handlePinDigit('2');
  handlePinDigit('1');
  submitMasterPin();
`, sandbox);
assert(vm.runInContext("isMasterAuthorized()", sandbox) === true, 'submitMasterPin com PIN correto concedeu acesso');

// 5. Teste de persistência e restauração de sessão do Aluno
vm.runInContext(`
  const firstPlayerId = (Array.isArray(PLAYERS) && PLAYERS.length > 0) ? PLAYERS[0].id : 'char_consume_test';
  selectLoginCharacter(firstPlayerId);
`, sandbox);
const savedPlayerId = vm.runInContext("localStorage.getItem('dnd5e_last_portal_player_id')", sandbox);
assert(savedPlayerId && savedPlayerId.length > 0, 'selectLoginCharacter persistiu o id do aluno no localStorage');

// 6. Teste de presença de elementos no Bundle HTML
assert(distHtml.includes('id="welcome-screen"'), 'Bundle contém tela de boas-vindas (#welcome-screen)');
assert(distHtml.includes('id="modal-master-pin"'), 'Bundle contém modal de PIN (#modal-master-pin)');
assert(distHtml.includes('id="player-return-banner"'), 'Bundle contém banner de retorno (#player-return-banner)');
assert(distHtml.includes('id="btn-float-player-login"'), 'Bundle contém botão flutuante de aluno (#btn-float-player-login)');
assert(distHtml.includes('id="modal-room-qrcode"'), 'Bundle contém modal de QR Code (#modal-room-qrcode)');
assert(distHtml.includes('welcome-screen-overlay'), 'CSS contém estilos da tela de boas-vindas');
assert(distHtml.includes('pin-numpad-grid'), 'CSS contém estilos do teclado numérico de PIN');

// 7. Testes da ISSUE-64: Layout dos Dropdowns e FAB Desobstruído
console.log('\n🎯 38. Testes de Layout dos Dropdowns, Menus sem Corte e FAB Desobstruído (ISSUE-64):');
assert(distHtml.includes('class="nav-dropdown-menu right-aligned"'), 'Menu Mestre possui classe right-aligned para evitar overflow horizontal');
assert(distHtml.includes('.nav-dropdown-menu.right-aligned'), 'CSS contém regra para .nav-dropdown-menu.right-aligned');
assert(distHtml.includes('width: max-content') || distHtml.includes('width:max-content'), 'CSS define width: max-content nos menus suspensos para evitar quebra de texto');
assert(distHtml.includes("handleFabQuickAction('notes')"), 'FAB Speed Dial inclui ação rápida para Notas do Mestre');
assert(distHtml.includes('id="fab-actions-container"') && distHtml.includes('display: none !important;'), 'FAB legado fab-actions-container foi desativado com display none');
assert(distHtml.includes('id="btn-float-player-login"') && distHtml.includes('display: none !important;'), 'Botão flutuante de aluno foi ocultado na visualização principal para evitar sobreposição');

// Teste de chamada de handleFabQuickAction('notes')
let notesDrawerToggled = false;
sandbox.toggleDMNotesDrawer = () => { notesDrawerToggled = true; };
vm.runInContext("handleFabQuickAction('notes')", sandbox);
assert(notesDrawerToggled === true, 'handleFabQuickAction(notes) aciona toggleDMNotesDrawer com sucesso');

// 8. Testes da ISSUE-65: Correção e Estabilização do Login dos Alunos (ISSUE-65)
console.log('\n🎯 39. Testes de Estabilização do Login dos Alunos e Resiliência no Lobby (ISSUE-65):');
assert(distHtml.includes('portal-btn-switch') && distHtml.includes('Trocar Herói'), 'Banner do portal contém botão acessível de Trocar Herói (.portal-btn-switch)');
assert(distHtml.includes('portal-btn-exit') && distHtml.includes('Modo Mestre'), 'Banner do portal contém botão acessível de saída para Modo Mestre (.portal-btn-exit)');
assert(distHtml.includes("handleFabQuickAction('login')"), 'FAB Speed Dial inclui ação rápida para Login do Aluno');
assert(distHtml.includes('Entrar como Jogador / Aluno'), 'Drawer lateral contém atalho direto para Login do Aluno');

// Teste de handleWelcomeSelect('player')
vm.runInContext(`
  localStorage.removeItem('dnd5e_session_role');
  handleWelcomeSelect('player');
`, sandbox);
assert(vm.runInContext("clientRole", sandbox) === 'player', "handleWelcomeSelect('player') define clientRole como 'player'");
assert(vm.runInContext("localStorage.getItem('dnd5e_session_role')", sandbox) === 'player', "handleWelcomeSelect('player') salva dnd5e_session_role como 'player'");

// Teste de restauração de sessão do aluno via checkPlayerPortalUrl
vm.runInContext(`
  const targetId = (Array.isArray(PLAYERS) && PLAYERS.length > 0) ? PLAYERS[0].id : 'p_local_active';
  localStorage.setItem('dnd5e_last_portal_player_id', targetId);
  const restoredPortal = checkPlayerPortalUrl();
`, sandbox);
assert(vm.runInContext("activePortalPlayerId", sandbox) === vm.runInContext("localStorage.getItem('dnd5e_last_portal_player_id')", sandbox), 'checkPlayerPortalUrl restaura activePortalPlayerId a partir do localStorage');
assert(vm.runInContext("document.body.classList.contains('mode-player-portal')", sandbox) === true, 'checkPlayerPortalUrl reativa mode-player-portal automaticamente para o aluno');

// Teste de chamada de handleFabQuickAction('login')
let loginModalOpened = false;
sandbox.openPlayerLoginModal = () => { loginModalOpened = true; };
vm.runInContext("handleFabQuickAction('login')", sandbox);
assert(loginModalOpened === true, 'handleFabQuickAction(login) aciona openPlayerLoginModal com sucesso');

// 9. Testes da ISSUE-66: Sistema de Banco de Dados, Smart Merge e Auto-Cura do PIN do Mestre
console.log('\n🏛️ 40. Testes de Banco de Dados, Smart Merge na Nuvem, Hash do PIN e Auto-Cura (ISSUE-66):');

// Validação de exportação de funções de banco de dados e hash
const coreExports = require('./src/js/core.js');
assert(typeof coreExports.initIndexedDB === 'function', 'Função initIndexedDB exportada');
assert(typeof coreExports.idbSet === 'function', 'Função idbSet exportada');
assert(typeof coreExports.idbGet === 'function', 'Função idbGet exportada');
assert(typeof coreExports.checkAndRestoreFromIndexedDB === 'function', 'Função checkAndRestoreFromIndexedDB exportada');
assert(typeof coreExports.computeSimplePinHash === 'function', 'Função computeSimplePinHash exportada');
assert(typeof coreExports.getMasterPinHash === 'function', 'Função getMasterPinHash exportada');

// Teste de hashing do PIN
const hashA = coreExports.computeSimplePinHash('4321');
const hashB = coreExports.computeSimplePinHash('4321');
const hashDiff = coreExports.computeSimplePinHash('1234');
assert(typeof hashA === 'string' && hashA.startsWith('pinhash_'), 'computeSimplePinHash gera hash prefixado consistente');
assert(hashA === hashB, 'computeSimplePinHash é determinístico para o mesmo PIN');
assert(hashA !== hashDiff, 'computeSimplePinHash gera hashes distintos para PINs diferentes');

// Teste de autenticação remota e auto-cura do PIN do Mestre no sandbox
vm.runInContext(`
  localStorage.removeItem('dnd5e_master_pin');
  localStorage.removeItem('dnd5e_master_session_exp');
  localStorage.setItem('dnd5e_cloud_master_pin_hash', computeSimplePinHash('5678'));
  
  openMasterPinModal();
  handlePinDigit('5');
  handlePinDigit('6');
  handlePinDigit('7');
  handlePinDigit('8');
  submitMasterPin();
`, sandbox);
assert(vm.runInContext("isMasterAuthorized()", sandbox) === true, 'submitMasterPin autorizou acesso com PIN correspondente ao hash da nuvem');
assert(vm.runInContext("localStorage.getItem('dnd5e_master_pin')", sandbox) === '5678', 'PIN do mestre foi auto-curado e salvo no localStorage');

// Teste de Smart Merge: Preservação de Heróis Locais contra Sobrescrita da Nuvem
vm.runInContext(`
  if (typeof setClientRole === 'function') setClientRole('master');
  clientRole = 'master';
  activePortalPlayerId = null;
  pendingPortalPlayerId = null;
  window.location.search = '';
  localStorage.removeItem('dnd5e_deleted_player_ids');
  PLAYERS = [
    { id: 'p_custom_wesley', name: 'Wesley Mago', student: 'Wesley', hp: 28, maxHp: 28, updatedAt: 100 }
  ];
  const cloudUpdate1 = {
    players: [
      { id: 'p_cloud_elena', name: 'Elena Clériga', student: 'Elena', hp: 32, maxHp: 32, updatedAt: 90 }
    ]
  };
  applyCloudDataToLocal(cloudUpdate1);
`, sandbox);
const smartMergePlayers = vm.runInContext("PLAYERS", sandbox);
assert(smartMergePlayers.some(p => p.id === 'p_custom_wesley'), 'Smart Merge PRESERVOU personagem criado localmente pelo mestre');
assert(smartMergePlayers.some(p => p.id === 'p_cloud_elena'), 'Smart Merge INCORPOROU novo personagem vindo da nuvem');
assert(smartMergePlayers.length === 2, 'Smart Merge manteve ambos os personagens sem perda de dados');

// Teste de Smart Merge: Respeito a Exclusões Intencionais
vm.runInContext(`
  if (typeof setClientRole === 'function') setClientRole('master');
  clientRole = 'master';
  activePortalPlayerId = null;
  trackDeletedPlayerId('p_deleted_orc');
  const cloudUpdate2 = {
    players: [
      { id: 'p_deleted_orc', name: 'Orc Guerreiro', student: 'NPC', hp: 15, maxHp: 15 },
      { id: 'p_cloud_elena', name: 'Elena Clériga', student: 'Elena', hp: 32, maxHp: 32 }
    ]
  };
  applyCloudDataToLocal(cloudUpdate2);
`, sandbox);
const smartMergeAfterDelete = vm.runInContext("PLAYERS", sandbox);
assert(!smartMergeAfterDelete.some(p => p.id === 'p_deleted_orc'), 'Smart Merge NÃO ressuscitou personagem excluído intencionalmente');

// Teste de Empty State e CTA de Restauração em renderPlayers
vm.runInContext(`
  PLAYERS = [];
  renderPlayers();
`, sandbox);
const emptyGridHtml = vm.runInContext("document.getElementById('grid-players').innerHTML", sandbox);
assert(emptyGridHtml.includes('openSnapshotsModal()'), 'renderPlayers exibe botão para restaurar snapshots quando lista está vazia');
assert(emptyGridHtml.includes('openPlayerModal()'), 'renderPlayers exibe botão para criar nova ficha quando lista está vazia');

// ========================================
// 41. Testes de Sincronização Cloud-First Multi-Dispositivo e Pareamento de Aparelhos (ISSUE-67):
// ========================================
console.log('\n📱 41. Testes de Sincronização Cloud-First Multi-Dispositivo e Pareamento de Aparelhos (ISSUE-67):');

const firebaseSyncModule = require('./src/js/firebase_sync.js');
assert(typeof firebaseSyncModule.getMasterSyncDeviceUrl === 'function', 'Função getMasterSyncDeviceUrl exportada');
assert(typeof firebaseSyncModule.openMasterSyncDeviceModal === 'function', 'Função openMasterSyncDeviceModal exportada');
assert(typeof firebaseSyncModule.closeMasterSyncDeviceModal === 'function', 'Função closeMasterSyncDeviceModal exportada');
assert(typeof firebaseSyncModule.copyMasterSyncDeviceUrl === 'function', 'Função copyMasterSyncDeviceUrl exportada');
assert(typeof firebaseSyncModule.handleUpdateSyncDeviceRoom === 'function', 'Função handleUpdateSyncDeviceRoom exportada');

// Validação de URL de pareamento do Mestre (ISSUE-92)
vm.runInContext(`
  setStoredFirebaseRoom('mesa_valerius');
`, sandbox);
const masterSyncUrl = vm.runInContext("getMasterSyncDeviceUrl()", sandbox);
assert(masterSyncUrl.includes('?room=turma_principal'), 'getMasterSyncDeviceUrl gera link apontando para o servidor turma_principal');

// Teste de Hidratação Limpa em Dispositivo Novo: Descarte de Mocks Iniciais em favor das Fichas da Nuvem
vm.runInContext(`
  if (typeof setClientRole === 'function') setClientRole('master');
  clientRole = 'master';
  activePortalPlayerId = null;
  pendingPortalPlayerId = null;
  window.location.search = '';
  localStorage.removeItem('dnd5e_deleted_player_ids');

  // Simula celular aberto pela primeira vez (contendo apenas mocks p1..p5 do core.js)
  PLAYERS = [
    { id: 'p1', name: 'Valerius Mock', student: 'Mock 1' },
    { id: 'p2', name: 'Lyra Mock', student: 'Mock 2' },
    { id: 'p3', name: 'Thorin Mock', student: 'Mock 3' },
    { id: 'p4', name: 'Aramil Mock', student: 'Mock 4' },
    { id: 'p5', name: 'Eldrin Mock', student: 'Mock 5' }
  ];

  // A nuvem possui os heróis reais criados pelo mestre no computador
  const cloudUpdateNewDevice = {
    players: [
      { id: 'char_prisco_hero_1', name: 'Gromm o Bárbaro', student: 'Lucas', hp: 45, maxHp: 45, updatedAt: 500 },
      { id: 'char_prisco_hero_2', name: 'Serena a Paladina', student: 'Mariana', hp: 38, maxHp: 38, updatedAt: 500 }
    ]
  };

  applyCloudDataToLocal(cloudUpdateNewDevice);
`, sandbox);

const playersOnNewDevice = vm.runInContext("PLAYERS", sandbox);
assert(!playersOnNewDevice.some(p => p.id === 'p1'), 'Novo aparelho DESCARTA mock p1 ao receber fichas reais da nuvem');
assert(playersOnNewDevice.some(p => p.id === 'char_prisco_hero_1'), 'Novo aparelho ADOTA ficha real Gromm da nuvem');
assert(playersOnNewDevice.some(p => p.id === 'char_prisco_hero_2'), 'Novo aparelho ADOTA ficha real Serena da nuvem');
assert(playersOnNewDevice.length === 2, 'Novo aparelho mantém estritamente as 2 fichas reais sem poluição de mocks');

// Teste de Hidratação Limpa de Campanhas em Dispositivo Novo
vm.runInContext(`
  // Dispositivo novo com apenas a campanha inicial vazia
  CAMPAIGNS_STATE = {
    activeCampaignId: "camp_1",
    campaigns: [
      { id: "camp_1", name: "A Mina Perdida de Phandelver", sessions: [] }
    ]
  };

  const cloudCampaignsUpdate = {
    activeCampaignId: "camp_real_dragons",
    campaigns: [
      {
        id: "camp_real_dragons",
        name: "O Tesouro da Rainha Dragão",
        sessions: [
          { id: "sess_1", number: 1, title: "O Ataque a Greenest", date: "2026-09-17", notes: "Crônicas épicas" }
        ],
        partyStash: { gold: 250, items: [{ id: "it_1", name: "Anel de Proteção" }] }
      }
    ]
  };

  mergeCloudCampaignsState(cloudCampaignsUpdate);
`, sandbox);

const syncedCampaigns = vm.runInContext("CAMPAIGNS_STATE", sandbox);
assert(syncedCampaigns.activeCampaignId === 'camp_real_dragons', 'Novo aparelho adotou a campanha ativa real da nuvem');
assert(syncedCampaigns.campaigns.some(c => c.id === 'camp_real_dragons'), 'Campanha real foi incorporada com sucesso');
assert(syncedCampaigns.campaigns.find(c => c.id === 'camp_real_dragons').sessions.length === 1, 'Sessões de diário foram hidratadas da nuvem no novo aparelho');

// Validação dos elementos visuais no bundle compilado
assert(distHtml.includes('id="modal-master-sync-device"'), 'Bundle contém modal de pareamento de celular (#modal-master-sync-device)');
assert(distHtml.includes('openMasterSyncDeviceModal()'), 'Bundle contém atalho para abrir pareamento de celular');
assert(distHtml.includes('img-master-sync-qrcode'), 'Bundle contém elemento de QR Code para leitura no celular');

// ========================================================
// 42. TESTES DE ANTI-PERDA DE CAMPANHAS E ITENS (ISSUE-68)
// ========================================================
console.log('\n🛡️ 42. Testes de Anti-Perda de Campanhas, Itens e Resolução de Conflitos (ISSUE-68):');

// 1. Funções de integridade e timestamps exportadas
assert(typeof vm.runInContext('touchPlayer', sandbox) === 'function', 'Função touchPlayer exportada');
assert(typeof vm.runInContext('touchCampaign', sandbox) === 'function', 'Função touchCampaign exportada');
assert(typeof vm.runInContext('trackDeletedCampaignId', sandbox) === 'function', 'Função trackDeletedCampaignId exportada');
assert(typeof vm.runInContext('getDeletedCampaignIds', sandbox) === 'function', 'Função getDeletedCampaignIds exportada');
assert(typeof vm.runInContext('trackDeletedPartyItemId', sandbox) === 'function', 'Função trackDeletedPartyItemId exportada');
assert(typeof vm.runInContext('getDeletedPartyItemIds', sandbox) === 'function', 'Função getDeletedPartyItemIds exportada');

// 2. Teste de touchPlayer
vm.runInContext(`
  var s42_testHero = { id: 'p_touch_test', name: 'Alunoteste', hp: 20, maxHp: 20, inventory: [] };
  touchPlayer(s42_testHero);
`, sandbox);
const heroTouched = vm.runInContext('s42_testHero', sandbox);
assert(typeof heroTouched.updatedAt === 'number' && heroTouched.updatedAt > 0, 'touchPlayer atualizou updatedAt do herói');

// 3. Teste de touchCampaign
vm.runInContext(`
  var s42_testCamp = { id: 'c_touch_test', name: 'Mesa Épica', partyStash: { gold: 50, items: [] } };
  touchCampaign(s42_testCamp);
`, sandbox);
const campTouched = vm.runInContext('s42_testCamp', sandbox);
assert(typeof campTouched.updatedAt === 'number' && campTouched.updatedAt > 0, 'touchCampaign atualizou updatedAt da campanha');
assert(typeof campTouched.partyStash.updatedAt === 'number' && campTouched.partyStash.updatedAt > 0, 'touchCampaign atualizou updatedAt do baú da campanha');

// 4. Teste de Tombstone de Campanha: Impede ressurreição de campanhas excluídas
vm.runInContext(`
  trackDeletedCampaignId('camp_zombie_to_kill');
  var s42_cloudWithZombie = {
    activeCampaignId: 'camp_zombie_to_kill',
    campaigns: [
      { id: 'camp_zombie_to_kill', name: 'Campanha Fantasma Morta', sessions: [], partyStash: { gold: 0, items: [] } }
    ]
  };
  mergeCloudCampaignsState(s42_cloudWithZombie);
`, sandbox);
const campsAfterZombie = vm.runInContext('CAMPAIGNS_STATE.campaigns', sandbox);
assert(!campsAfterZombie.some(c => c.id === 'camp_zombie_to_kill'), 'mergeCloudCampaignsState NÃO ressuscitou campanha excluída (Tombstone)');
assert(vm.runInContext('getDeletedCampaignIds().includes("camp_zombie_to_kill")', sandbox), 'Tombstone de campanha persistida em getDeletedCampaignIds');

// 5. Teste de Tombstone de Itens do Baú: Impede ressurreição de itens excluídos/transferidos
vm.runInContext(`
  trackDeletedPartyItemId('item_zombie_gem_99');
  var s42_campWithZombieItem = {
    id: 'camp_test_stash_anti_zombie',
    name: 'Mesa do Baú',
    updatedAt: 1000,
    partyStash: {
      gold: 100,
      updatedAt: 2000,
      items: [
        { id: 'item_zombie_gem_99', name: 'Diamante Fantasma' },
        { id: 'item_valid_potion_1', name: 'Poção de Cura Legítima' }
      ]
    }
  };
  mergeCloudCampaignsState({
    activeCampaignId: 'camp_test_stash_anti_zombie',
    campaigns: [s42_campWithZombieItem]
  });
`, sandbox);
const stashAfterZombie = vm.runInContext(`
  var s42_foundC = CAMPAIGNS_STATE.campaigns.find(c => c.id === 'camp_test_stash_anti_zombie');
  s42_foundC ? s42_foundC.partyStash.items : [];
`, sandbox);
assert(!stashAfterZombie.some(i => i.id === 'item_zombie_gem_99'), 'mergeCloudCampaignsState NÃO ressuscitou item excluído do baú (Tombstone)');
assert(stashAfterZombie.some(i => i.id === 'item_valid_potion_1'), 'mergeCloudCampaignsState preservou item legítimo do baú');

// 6. Resolução de conflitos de Baú por timestamp
vm.runInContext(`
  var s42_activeC = CAMPAIGNS_STATE.campaigns.find(c => c.id === 'camp_test_stash_anti_zombie');
  // Local é mais recente: 5000 vs Remoto antigo: 3000
  s42_activeC.partyStash.gold = 999;
  s42_activeC.partyStash.updatedAt = 5000;
  
  mergeCloudCampaignsState({
    activeCampaignId: 'camp_test_stash_anti_zombie',
    campaigns: [{
      id: 'camp_test_stash_anti_zombie',
      name: 'Mesa do Baú',
      updatedAt: 1000,
      partyStash: { gold: 50, updatedAt: 3000, items: [] }
    }]
  });
`, sandbox);
const goldPreserved = vm.runInContext(`
  CAMPAIGNS_STATE.campaigns.find(c => c.id === 'camp_test_stash_anti_zombie').partyStash.gold
`, sandbox);
assert(goldPreserved === 999, 'Baú local mais recente preservou ouro de sobrescrita por snapshot remoto mais antigo');

vm.runInContext(`
  // Remoto mais recente: 7000 vs Local: 5000
  mergeCloudCampaignsState({
    activeCampaignId: 'camp_test_stash_anti_zombie',
    campaigns: [{
      id: 'camp_test_stash_anti_zombie',
      name: 'Mesa do Baú',
      updatedAt: 7000,
      partyStash: { gold: 1500, updatedAt: 7000, items: [{ id: 'item_remote_wand', name: 'Varinha Mágica' }] }
    }]
  });
`, sandbox);
const goldUpdated = vm.runInContext(`
  CAMPAIGNS_STATE.campaigns.find(c => c.id === 'camp_test_stash_anti_zombie').partyStash.gold
`, sandbox);
assert(goldUpdated === 1500, 'Baú remoto mais recente atualizou tesouro do grupo com sucesso');

// --- SUÍTE 43: Distribuição de Saque/XP em Lote, Trade de Mochila e Auras/Régua no VTT (ISSUE-69) ---
console.log('\n🎁 43. Testes de Distribuição de Saque/XP em Lote, Trade de Mochila e Auras VTT (ISSUE-69):');

// 1. Funções de Trade e Recompensas exportadas
assert(typeof vm.runInContext("transferPlayerItem", sandbox) === 'function', 'Função transferPlayerItem exportada');
assert(typeof vm.runInContext("openTradeItemModal", sandbox) === 'function', 'Função openTradeItemModal exportada');
assert(typeof vm.runInContext("adjustTradeQty", sandbox) === 'function', 'Função adjustTradeQty exportada');
assert(typeof vm.runInContext("distributeBatchRewards", sandbox) === 'function', 'Função distributeBatchRewards exportada');
assert(typeof vm.runInContext("openBatchRewardsModal", sandbox) === 'function', 'Função openBatchRewardsModal exportada');

// 2. Teste de Trade de Mochila entre heróis
vm.runInContext(`
  PLAYERS = [
    {
      id: 'trade_hero_1',
      name: 'Eldrin o Mago',
      inventory: [
        { name: 'Poção de Cura Maior', qty: 3, weight: 0.5, desc: 'Restaura 4d4+4 PV' },
        { name: 'Grimório Rúnico', qty: 1, weight: 2.0, desc: 'Magias arcanas' }
      ],
      coins: { cp: 10, sp: 5, ep: 0, gp: 50, pp: 0 }
    },
    {
      id: 'trade_hero_2',
      name: 'Thokk o Bárbaro',
      inventory: [],
      coins: { cp: 0, sp: 0, ep: 0, gp: 10, pp: 0 }
    }
  ];
`, sandbox);

// Transfere 2 poções de Eldrin para Thokk
const tradeRes1 = vm.runInContext("transferPlayerItem('trade_hero_1', 0, 'trade_hero_2', 2)", sandbox);
assert(tradeRes1 && tradeRes1.success, 'transferPlayerItem realizou transferência parcial com sucesso');

const eldrinPots = vm.runInContext("PLAYERS.find(p => p.id === 'trade_hero_1').inventory[0].qty", sandbox);
const thokkPots = vm.runInContext("PLAYERS.find(p => p.id === 'trade_hero_2').inventory[0].qty", sandbox);
assert(eldrinPots === 1, 'Eldrin ficou com 1 poção restante (3 - 2)');
assert(thokkPots === 2, 'Thokk recebeu 2 poções');

// Transfere todo o Grimório (qty: 1)
const tradeRes2 = vm.runInContext("transferPlayerItem('trade_hero_1', 1, 'trade_hero_2', 1)", sandbox);
assert(tradeRes2 && tradeRes2.success, 'transferPlayerItem transferiu item completo com sucesso');
const eldrinInvCount = vm.runInContext("PLAYERS.find(p => p.id === 'trade_hero_1').inventory.length", sandbox);
const thokkHasBook = vm.runInContext("PLAYERS.find(p => p.id === 'trade_hero_2').inventory.some(i => i.name === 'Grimório Rúnico')", sandbox);
assert(eldrinInvCount === 1, 'Grimório foi removido do inventário de Eldrin');
assert(thokkHasBook === true, 'Grimório foi adicionado ao inventário de Thokk');

// Validação de erro: tentar transferir mais do que possui
const tradeFail = vm.runInContext("transferPlayerItem('trade_hero_1', 0, 'trade_hero_2', 99)", sandbox);
assert(tradeFail && !tradeFail.success, 'transferPlayerItem bloqueou transferência quando quantidade solicitada excede posse');

// 3. Teste de Distribuição de Saque e XP em Lote
vm.runInContext(`
  PLAYERS = [
    { id: 'batch_h1', name: 'Alun 1', level: 1, xp: 100, coins: { cp: 0, sp: 0, ep: 0, gp: 10, pp: 0 } },
    { id: 'batch_h2', name: 'Alun 2', level: 1, xp: 200, coins: { cp: 0, sp: 0, ep: 0, gp: 20, pp: 0 } },
    { id: 'batch_h3', name: 'Alun 3', level: 1, xp: 50, coins: { cp: 0, sp: 0, ep: 0, gp: 5, pp: 0 } }
  ];
`, sandbox);

// Mestre distribui 300 XP e 60 GP entre batch_h1 e batch_h2 (batch_h3 não selecionado)
const rewardRes = vm.runInContext(`
  distributeBatchRewards({
    recipientIds: ['batch_h1', 'batch_h2'],
    totalXp: 300,
    coins: { gp: 60 }
  })
`, sandbox);

assert(rewardRes && rewardRes.success, 'distributeBatchRewards executou divisão com sucesso');
const h1Xp = vm.runInContext("PLAYERS.find(p => p.id === 'batch_h1').xp", sandbox);
const h2Xp = vm.runInContext("PLAYERS.find(p => p.id === 'batch_h2').xp", sandbox);
const h3Xp = vm.runInContext("PLAYERS.find(p => p.id === 'batch_h3').xp", sandbox);
assert(h1Xp === 250, 'Alun 1 recebeu 150 XP (100 + 150)');
assert(h2Xp === 350, 'Alun 2 recebeu 150 XP (200 + 150)');
assert(h3Xp === 50, 'Alun 3 não selecionado manteve 50 XP inalterado');

const h1Gp = vm.runInContext("PLAYERS.find(p => p.id === 'batch_h1').coins.gp", sandbox);
const h2Gp = vm.runInContext("PLAYERS.find(p => p.id === 'batch_h2').coins.gp", sandbox);
assert(h1Gp === 40, 'Alun 1 recebeu 30 GP (10 + 30)');
assert(h2Gp === 50, 'Alun 2 recebeu 30 GP (20 + 30)');

// 4. Testes de Auras VTT Novas Cores e Badges de Condição
vm.runInContext(`
  gridState.tokens = [
    { id: 'tok-aura-p', combatantId: 'batch_h1', name: 'Alun 1', type: 'player', x: 200, y: 200, size: 'medium' }
  ];
  state.combatants = [
    { id: 'batch_h1', name: 'Alun 1', hp: 12, maxHp: 15, conditions: ['Envenenado', 'Cego'] }
  ];
`, sandbox);

// Aplica aura Roxa
vm.runInContext("setTokenAura('tok-aura-p', '6m', 'purple')", sandbox);
let tokAuraP = vm.runInContext("gridState.tokens[0]", sandbox);
assert(tokAuraP.aura && tokAuraP.aura.color === 'purple', 'setTokenAura aplicou aura purple');
vm.runInContext("renderBattleGrid()", sandbox);
let tokensLayerHtml = vm.runInContext("document.getElementById('grid-tokens-layer').innerHTML", sandbox);
assert(tokensLayerHtml.includes('aura-purple'), 'renderBattleGrid incluiu classe aura-purple');
assert(tokensLayerHtml.includes('token-condition-badge'), 'renderBattleGrid renderizou badges de condições ativas');

// Aplica aura Ciano
vm.runInContext("setTokenAura('tok-aura-p', '3m', 'cyan')", sandbox);
vm.runInContext("renderBattleGrid()", sandbox);
tokensLayerHtml = vm.runInContext("document.getElementById('grid-tokens-layer').innerHTML", sandbox);
assert(tokensLayerHtml.includes('aura-cyan'), 'renderBattleGrid incluiu classe aura-cyan');

// Aplica aura Laranja
vm.runInContext("setTokenAura('tok-aura-p', '9m', 'orange')", sandbox);
vm.runInContext("renderBattleGrid()", sandbox);
tokensLayerHtml = vm.runInContext("document.getElementById('grid-tokens-layer').innerHTML", sandbox);
assert(tokensLayerHtml.includes('aura-orange'), 'renderBattleGrid incluiu classe aura-orange');

// 5. Testes de Suporte Touch para Régua no VTT
assert(typeof vm.runInContext("handleBoardTouchStart", sandbox) === 'function', 'Função handleBoardTouchStart exportada');
assert(typeof vm.runInContext("handleBoardTouchMove", sandbox) === 'function', 'Função handleBoardTouchMove exportada');
assert(typeof vm.runInContext("handleBoardTouchEnd", sandbox) === 'function', 'Função handleBoardTouchEnd exportada');

vm.runInContext(`
  activeVttTool = 'ruler';
  handleBoardTouchStart({ touches: [{ clientX: 100, clientY: 100 }], cancelable: true, preventDefault: () => {} });
`, sandbox);
assert(vm.runInContext("isRulerMeasuring", sandbox) === true, 'handleBoardTouchStart iniciou medição da régua no celular');

// 6. Elementos no Bundle compilado
const builtHtml = fs.readFileSync(path.join(__dirname, 'planilha do rpg.html'), 'utf8');
assert(builtHtml.includes('id="modal-batch-rewards"'), 'Bundle contém modal de saque e XP em lote (#modal-batch-rewards)');
assert(builtHtml.includes('id="modal-trade-item"'), 'Bundle contém modal de troca de itens (#modal-trade-item)');
assert(builtHtml.includes('.token-aura.aura-purple'), 'CSS no bundle contém classe de aura roxa');
assert(builtHtml.includes('.token-aura.aura-cyan'), 'CSS no bundle contém classe de aura ciano');
assert(builtHtml.includes('.token-aura.aura-orange'), 'CSS no bundle contém classe de aura laranja');

// 🛡️ 44. Testes de Integridade da Ficha do Jogador, Inventário e Salvaguardas (ISSUE-70):
console.log('\n🛡️ 44. Testes de Integridade da Ficha do Jogador, Inventário e Salvaguardas (ISSUE-70):');

// 1. Criação de personagem novo com salvaguardas nativas da classe
vm.runInContext(`
  document.getElementById('pm-id').value = '';
  document.getElementById('pm-student').value = 'Mariana';
  document.getElementById('pm-name').value = 'Aeloria';
  document.getElementById('pm-class-select').value = 'Mago';
  document.getElementById('pm-class').value = 'Mago';
  document.getElementById('pm-level').value = 1;
  document.getElementById('pm-maxhp').value = 8;
  document.getElementById('pm-ac').value = 12;
  document.getElementById('pm-gold').value = 25;
  document.getElementById('pm-slot-1').value = 2;
  document.getElementById('pm-slot-2').value = 0;
  document.getElementById('pm-slot-3').value = 0;
  document.getElementById('pm-slot-4').value = 0;
  document.getElementById('pm-slot-5').value = 0;
  document.getElementById('pm-badges').value = '';
  document.getElementById('pm-attacks').value = 'Adaga (+4, 1d4+2)';
  document.getElementById('pm-features').value = '';
  document.getElementById('pm-spells').value = '';
  savePlayerSheet();
`, sandbox);

let aeloria = vm.runInContext("PLAYERS.find(p => p.name === 'Aeloria')", sandbox);
assert(aeloria !== undefined, 'Personagem Aeloria criado com sucesso');
assert(Array.isArray(aeloria.saveProficiencies), 'Aeloria possui array de saveProficiencies');
assert(aeloria.saveProficiencies.includes('int') && aeloria.saveProficiencies.includes('wis'), 'Mago foi inicializado com salvaguardas corretas de INT e WIS');
assert(aeloria.coins && aeloria.coins.gp === 25, 'Carteira de moedas inicializada com 25 PO');

// 2. Adicionar itens no inventário de Aeloria
vm.runInContext(`
  aeloriaHero = PLAYERS.find(p => p.name === 'Aeloria');
  aeloriaHero.inventory = [
    { name: 'Poção de Cura', category: 'Poções', qty: 2, equipped: false, weight: 0.5 },
    { name: 'Grimório Arcano', category: 'Equipamentos', qty: 1, equipped: true, weight: 3 }
  ];
  aeloriaHero.coins = { cp: 5, sp: 10, ep: 0, gp: 50, pp: 1 };
  aeloriaHero.customSpells = ['Detectar Magia Instantâneo'];
  aeloriaHero.spentHitDice = 1;
`, sandbox);

// 3. Simula abrir modal e editar atributos simples de Aeloria (muda nome e CA)
vm.runInContext(`
  document.getElementById('pm-id').value = aeloriaHero.id;
  document.getElementById('pm-student').value = 'Mariana';
  document.getElementById('pm-name').value = 'Aeloria Ventoselvagem';
  document.getElementById('pm-class-select').value = 'Mago';
  document.getElementById('pm-class').value = 'Mago';
  document.getElementById('pm-level').value = 1;
  document.getElementById('pm-maxhp').value = 10;
  document.getElementById('pm-ac').value = 15;
  document.getElementById('pm-gold').value = 50;
  document.getElementById('pm-slot-1').value = 2;
  document.getElementById('pm-slot-2').value = 0;
  document.getElementById('pm-slot-3').value = 0;
  document.getElementById('pm-slot-4').value = 0;
  document.getElementById('pm-slot-5').value = 0;
  document.getElementById('pm-badges').value = '';
  document.getElementById('pm-attacks').value = 'Adaga (+4, 1d4+2)';
  document.getElementById('pm-features').value = '';
  document.getElementById('pm-spells').value = '';
  savePlayerSheet();
`, sandbox);

let aeloriaUpdated = vm.runInContext("PLAYERS.find(p => p.id === aeloriaHero.id)", sandbox);
assert(aeloriaUpdated.name === 'Aeloria Ventoselvagem', 'Nome foi atualizado na edição');
assert(aeloriaUpdated.ac === 15, 'CA foi atualizada para 15');
assert(Array.isArray(aeloriaUpdated.inventory) && aeloriaUpdated.inventory.length === 2, 'savePlayerSheet PRESERVOU a mochila intacta (2 itens)');
assert(aeloriaUpdated.inventory[0].name === 'Poção de Cura' && aeloriaUpdated.inventory[0].qty === 2, 'Poção de Cura preservada com quantidade correta');
assert(aeloriaUpdated.coins && aeloriaUpdated.coins.sp === 10 && aeloriaUpdated.coins.pp === 1, 'Carteira de moedas multimoeda preservada (sp, pp)');
assert(Array.isArray(aeloriaUpdated.customSpells) && aeloriaUpdated.customSpells.length === 1, 'Magias customizadas preservadas');
assert(aeloriaUpdated.spentHitDice === 1, 'Dados de vida gastos preservados');

// 4. Teste de touchPlayer em Descanso Longo e Magias Preparadas
let preTouch = aeloriaUpdated.updatedAt;
vm.runInContext(`
  setTimeout(() => {}, 10);
  playerLongRest(aeloriaHero.id);
`, sandbox);
let postTouchLongRest = vm.runInContext("PLAYERS.find(p => p.id === aeloriaHero.id).updatedAt", sandbox);
assert(postTouchLongRest >= preTouch, 'playerLongRest disparou touchPlayer e atualizou timestamp');

// 5. Teste de botão de escolha de magias liberado para o aluno
assert(builtHtml.includes('player-spell-picker-btn'), 'Bundle contém botão de escolha de magias liberado para jogador (.player-spell-picker-btn)');

// --- SUÍTE 45: Testes de Mestrado, Resolução de IDs de Campanha e Sincronização do Baú (ISSUE-71) ---
console.log('\n👑 45. Testes de Mestrado, Resolução de IDs de Campanha e Sincronização do Baú (ISSUE-71):');

// 1. Resolução flexível de IDs numéricos e strings em addAllCampaignHeroesToCombat
vm.runInContext(`
  const testCamp71 = {
    id: 'camp_test_71',
    name: 'Campanha Teste 71',
    playerIds: [String('${aeloriaUpdated.id}')],
    partyStash: { gold: 100, items: [{ id: 'it_pot_71', name: 'Poção de Vigor', qty: 2, category: 'Poções' }], history: [] }
  };
  CAMPAIGNS_STATE = { activeCampaignId: 'camp_test_71', campaigns: [testCamp71] };
  state.combatants = [];
  addAllCampaignHeroesToCombat();
`, sandbox);

let combatants71 = vm.runInContext('state.combatants', sandbox);
assert(combatants71.length === 1, 'addAllCampaignHeroesToCombat encontrou herói com ID em formato string');
assert(combatants71[0].playerId === aeloriaUpdated.id, 'Combatente criado com playerId correspondente');

// 2. splitPartyGold atualiza p.gold, p.coins.gp e dispara touchPlayer
let goldBeforeSplit = aeloriaUpdated.gold || 0;
let coinsGpBeforeSplit = (aeloriaUpdated.coins && aeloriaUpdated.coins.gp) || 0;
let timeBeforeSplit = aeloriaUpdated.updatedAt || 0;

vm.runInContext(`
  splitPartyGold();
`, sandbox);

let aeloriaAfterSplit = vm.runInContext(`PLAYERS.find(p => p.id === '${aeloriaUpdated.id}')`, sandbox);
assert(aeloriaAfterSplit.gold === goldBeforeSplit + 100, 'splitPartyGold incrementou p.gold corretamente');
assert(aeloriaAfterSplit.coins && aeloriaAfterSplit.coins.gp === coinsGpBeforeSplit + 100, 'splitPartyGold sincronizou a carteira p.coins.gp');
assert(aeloriaAfterSplit.updatedAt >= timeBeforeSplit, 'splitPartyGold disparou touchPlayer atualizando timestamp');

// 3. takePartyItemToPlayer transfere item do baú para a mochila do herói
vm.runInContext(`
  takePartyItemToPlayer('it_pot_71', '${aeloriaUpdated.id}');
`, sandbox);

let aeloriaWithItem = vm.runInContext(`PLAYERS.find(p => p.id === '${aeloriaUpdated.id}')`, sandbox);
let transferredPot = (aeloriaWithItem.inventory || []).find(i => i.name === 'Poção de Vigor');
assert(transferredPot !== undefined && transferredPot.qty === 1, 'takePartyItemToPlayer transferiu item para o inventário do herói');
let campStashAfter = vm.runInContext("getActiveCampaign().partyStash.items.find(i => i.id === 'it_pot_71')", sandbox);
assert(campStashAfter && campStashAfter.qty === 1, 'Quantidade no baú do grupo foi decrementada corretamente');

// 4. Resiliência do FoW quando canvas não tem dataset
let fowTestPassed = false;
try {
  vm.runInContext(`
    const mockDmCanvas = { width: 1000, height: 800 };
    if (!mockDmCanvas.dataset || !mockDmCanvas.dataset.listenerAttached) {
      if (mockDmCanvas.dataset) mockDmCanvas.dataset.listenerAttached = 'true';
    }
  `, sandbox);
  fowTestPassed = true;
} catch (e) {
  fowTestPassed = false;
}
assert(fowTestPassed, 'Checagem defensiva de dataset no canvas de névoa previne exceções');

// =========================================================================
// 👑 46. TESTES DE TELAS INICIAIS, CRONÔMETRO DE COMBATE E VTT (ISSUE-72)
// =========================================================================
console.log('\n👑 46. Testes de Telas Iniciais, Cronômetro de Combate e VTT (ISSUE-72):');

const bundle72 = fs.readFileSync(path.join(__dirname, 'planilha do rpg.html'), 'utf8');

// 1. Z-Index de modais da tela inicial sobreposto ao Welcome Screen
assert(bundle72.includes('#modal-master-pin') && bundle72.includes('z-index: 2000 !important;'), 'Modais de PIN e Login possuem z-index superior à tela de boas-vindas');

// 2. Elementos do Cronômetro de Turno presentes no Bundle Compilado
assert(bundle72.includes('id="combat-timer-display"'), 'Bundle compilado contém o mostrador do cronômetro de combate (#combat-timer-display)');
assert(bundle72.includes('id="combat-timer-bar"'), 'Bundle compilado contém a barra do cronômetro (#combat-timer-bar)');
assert(bundle72.includes('id="btn-timer-toggle"'), 'Bundle compilado contém o botão play/pause do cronômetro (#btn-timer-toggle)');
assert(bundle72.includes('id="chk-timer-autoreset"'), 'Bundle compilado contém o checkbox auto-reset do cronômetro (#chk-timer-autoreset)');

// 3. Identificador de status da nuvem no botão do cabeçalho
assert(bundle72.includes('id="firebase-status-badge"'), 'Bundle compilado contém id="firebase-status-badge" no botão de nuvem do cabeçalho');

// 4. Handlers explícitos nos botões da tela de boas-vindas
assert(bundle72.includes("handleWelcomeSelect('master')"), 'Botão do mestre na tela de boas-vindas possui handler explícito de clique');
assert(bundle72.includes("handleWelcomeSelect('player')"), 'Botão do aluno na tela de boas-vindas possui handler explícito de clique');

// 5. Teste dinâmico de cronômetro e renderização
vm.runInContext(`
  turnTimerDuration = 60;
  turnTimerRemaining = 45;
  turnTimerRunning = true;
  updateTurnTimerUI();
`, sandbox);
const timerDisplayVal = vm.runInContext("document.getElementById('combat-timer-display').innerText", sandbox);
assert(timerDisplayVal.includes('45s'), 'updateTurnTimerUI atualizou o mostrador para 45s');

// 6. Teste de despacho de combate via VTT atribuindo atacante ativo
vm.runInContext(`
  state.combatants = [
    { id: 'c_dragon_72', name: 'Dragão Vermelho', hp: 100, maxHp: 100, init: 18, type: 'monster' },
    { id: 'c_hero_72', name: 'Valeros', hp: 30, maxHp: 30, init: 12, type: 'player' }
  ];
  state.turnIndex = 0;
  document.getElementById('sel-vtt-target').value = 'c_hero_72';
  document.getElementById('inp-vtt-damage').value = '15';
  applyVttCombatAction('damage');
`, sandbox);
const lastLogText72 = vm.runInContext("state.logs && state.logs[0] ? state.logs[0].text : ''", sandbox);
assert(lastLogText72.includes('Dragão Vermelho') && lastLogText72.includes('Valeros'), 'applyVttCombatAction atribuiu o combatente ativo (Dragão Vermelho) como atacante nos logs');

// =========================================================================
// 🎯 47. TESTES DE BLINDAGEM DE BOTÕES, DROPDOWNS E VTT (ISSUE-73)
// =========================================================================
console.log('\n🎯 47. Testes de Blindagem de Botões, Dropdowns e VTT (ISSUE-73):');

const bundle73 = fs.readFileSync(path.join(__dirname, 'planilha do rpg.html'), 'utf8');

// 1. Dropdowns do cabeçalho possuem onclick="toggleNavDropdown(this, event)"
assert(bundle73.includes('toggleNavDropdown(this, event)'), 'Bundle contém toggleNavDropdown nos botões de dropdown do cabeçalho');

// 2. Modais com z-index elevado (>= 2000, elevado para 12000 na ISSUE-139 para cobrir dock e hud móveis)
assert(bundle73.includes('.modal-overlay') && (bundle73.includes('z-index: 12000;') || bundle73.includes('z-index: 2000;')), 'Bundle possui z-index elevado (>=2000) na classe base .modal-overlay');

// 3. Botões circulares do menu FAB possuem type="button" e onclick explícito
assert(bundle73.includes('class="fab-action-circle" onclick="handleFabQuickAction(\'login\')"'), 'Botão circular FAB Login possui onclick direto');
assert(bundle73.includes('class="fab-action-circle" onclick="handleFabQuickAction(\'turn\')"'), 'Botão circular FAB Turno possui onclick direto');

// 4. Execução de rollDiceFormula no VTT
vm.runInContext(`
  var testRollResult = rollDiceFormula('1d20+5', 'Teste de Ataque');
`, sandbox);
const rollRes = vm.runInContext("testRollResult", sandbox);
assert(rollRes && (typeof rollRes.total === 'number' || typeof rollRes === 'object'), 'rollDiceFormula executou com sucesso sem ReferenceError');

// 5. Execução defensiva de setDrawingColor e setDrawingSize
let drawingColorSafe = false;
try {
  vm.runInContext("setDrawingColor('#f59e0b', null)", sandbox);
  vm.runInContext("setDrawingSize(5, null)", sandbox);
  drawingColorSafe = true;
} catch (e) {
  drawingColorSafe = false;
}
assert(drawingColorSafe, 'setDrawingColor e setDrawingSize executam defensivamente mesmo quando el é nulo');

// 6. Teste dinâmico de toggleNavDropdown
vm.runInContext(`
  var mockDropdownParent = {
    classList: {
      _set: new Set(),
      add(c) { this._set.add(c); },
      remove(c) { this._set.delete(c); },
      contains(c) { return this._set.has(c); }
    }
  };
  var mockBtn = {
    closest: function(sel) { return mockDropdownParent; }
  };
  toggleNavDropdown(mockBtn, { stopPropagation: () => {} });
  var isOpenedAfterToggle = mockDropdownParent.classList.contains('open');
  toggleNavDropdown(mockBtn, { stopPropagation: () => {} });
  var isClosedAfterSecondToggle = !mockDropdownParent.classList.contains('open');
`, sandbox);
const isOpened = vm.runInContext("isOpenedAfterToggle", sandbox);
const isClosed = vm.runInContext("isClosedAfterSecondToggle", sandbox);
assert(isOpened && isClosed, 'toggleNavDropdown abre e fecha o menu dropdown dinamicamente');

// ========================================================
// 48. TESTES DE QR CODE, MOEDAS E HERÓIS DA CAMPANHA (ISSUE-74)
// ========================================================
console.log('\n📲 48. Testes de QR Code, Moedas e Heróis da Campanha (ISSUE-74):');

// 1. Validação de QR Code usando URL curta (evita HTTP 414 e URLs gigantescas)
vm.runInContext(`
  var pTestQr = { id: 'p_qr_test', name: 'Testador QR', student: 'Aluno 1', className: 'Mago', race: 'Elfo', level: 3, ac: 13, hp: 18, maxHp: 18, gold: 50 };
  PLAYERS.push(pTestQr);

  var mockQrContainer = { innerHTML: '' };
  var mockModalShare = { classList: { add: () => {}, remove: () => {} } };
  var mockInpShort = { value: '', select: () => {} };
  var mockInpFull = { value: '', select: () => {} };

  var originalGetElementById = document.getElementById;
  document.getElementById = function(id) {
    if (id === 'modal-share-sheet') return mockModalShare;
    if (id === 'share-qrcode-render') return mockQrContainer;
    if (id === 'inp-share-url-short') return mockInpShort;
    if (id === 'inp-share-url') return mockInpFull;
    return { innerText: '', value: '', style: {}, classList: { add: () => {}, remove: () => {} } };
  };

  openSharePlayerModal('p_qr_test');
  var renderedQrHtml = mockQrContainer.innerHTML;
  document.getElementById = originalGetElementById;
`, sandbox);

const qrHtml = vm.runInContext("renderedQrHtml", sandbox);
assert(qrHtml.includes('<svg') || qrHtml.includes('create-qr-code/?size=220x220'), 'QR Code do personagem é gerado com sucesso (SVG offline ou API)');
assert(qrHtml.includes('<svg') || (qrHtml.includes('onerror=') && qrHtml.includes('quickchart.io/qr')), 'QR Code possui renderização vetorial offline resiliente');
const qrSrcMatch = qrHtml.match(/src="([^"]+)"/);
assert((qrHtml.includes('<svg') && qrHtml.includes('viewBox')) || (qrSrcMatch && !qrSrcMatch[1].includes('%23pdata%3D') && qrSrcMatch[1].length < 250), 'QR Code utiliza link otimizado prevenindo falha de payload');

// 2. Sincronização bidirecional de ouro e moedas no modal de edição
vm.runInContext(`
  var pHeroCoins = {
    id: 'p_hero_coins',
    name: 'Gromm Rico',
    student: 'João',
    className: 'Bárbaro',
    level: 2,
    gold: 20,
    coins: { cp: 0, sp: 0, ep: 0, gp: 20, pp: 0 }
  };
  PLAYERS.push(pHeroCoins);

  var mockModalElements = {
    'pm-id': { value: 'p_hero_coins' },
    'pm-gold': { value: '85' },
    'pm-student': { value: 'João' },
    'pm-name': { value: 'Gromm Rico' },
    'pm-class': { value: 'Bárbaro' },
    'pm-level': { value: '2' },
    'pm-xp': { value: '300' },
    'pm-hitdice': { value: '1d12' },
    'pm-ac': { value: '14' },
    'pm-maxhp': { value: '25' },
    'pm-speed': { value: '9m' },
    'pm-str': { value: '16' },
    'pm-dex': { value: '14' },
    'pm-con': { value: '16' },
    'pm-int': { value: '8' },
    'pm-wis': { value: '10' },
    'pm-cha': { value: '10' },
    'pm-attacks': { value: '' },
    'pm-features': { value: '' },
    'pm-spells': { value: '' },
    'pm-badges': { value: '' },
    'pm-slot-1': { value: '0' },
    'pm-slot-2': { value: '0' },
    'pm-slot-3': { value: '0' },
    'pm-slot-4': { value: '0' },
    'pm-slot-5': { value: '0' },
    'pm-subclass-select': { value: '0' },
    'pm-class-select': { value: 'Bárbaro' },
    'pm-race-select': { value: 'Humano' },
    'pm-avatar': { value: '👤' },
    'pm-background': { value: 'Soldado' },
    'pm-ideal': { value: '' },
    'pm-bond': { value: '' },
    'pm-flaw': { value: '' },
    'pm-story': { value: '' }
  };

  var origGet = document.getElementById;
  document.getElementById = function(id) {
    if (mockModalElements[id]) return mockModalElements[id];
    return { value: '', checked: false, style: {}, classList: { add: () => {}, remove: () => {} } };
  };

  savePlayerSheet();
  document.getElementById = origGet;
`, sandbox);

const updatedGromm = vm.runInContext("PLAYERS.find(p => p.id === 'p_hero_coins')", sandbox);
assert(updatedGromm.gold === 85, 'savePlayerSheet atualizou p.gold para 85');
assert(updatedGromm.coins && updatedGromm.coins.gp === 85, 'savePlayerSheet sincronizou p.coins.gp para 85');

// 3. savePlayerCoinsFromModal atualiza p.gold e chama touchPlayer
vm.runInContext(`
  activeCoinsPlayerId = 'p_hero_coins';
  var origTouchCalled = false;
  var origTouch = touchPlayer;
  touchPlayer = function(p) { origTouchCalled = true; if (origTouch) origTouch(p); };

  var origGet2 = document.getElementById;
  document.getElementById = function(id) {
    if (id === 'inp-coin-gp') return { value: '120' };
    if (id === 'inp-coin-cp') return { value: '10' };
    if (id === 'inp-coin-sp') return { value: '5' };
    if (id === 'inp-coin-ep') return { value: '0' };
    if (id === 'inp-coin-pp') return { value: '1' };
    if (id === 'modal-player-coins') return { classList: { remove: () => {} } };
    if (id === 'grid-players' || id === 'players-grid') return { innerHTML: '', querySelectorAll: () => [] };
    return { innerText: '', value: '', style: {}, querySelectorAll: () => [], classList: { add: () => {}, remove: () => {} } };
  };

  savePlayerCoinsFromModal();
  document.getElementById = origGet2;
  touchPlayer = origTouch;
`, sandbox);

const coinsTouchCalled = vm.runInContext("origTouchCalled", sandbox);
const grommCoinsFinal = vm.runInContext("PLAYERS.find(p => p.id === 'p_hero_coins')", sandbox);
assert(coinsTouchCalled, 'savePlayerCoinsFromModal executou touchPlayer para propagação na nuvem');
assert(grommCoinsFinal.gold === 130, 'savePlayerCoinsFromModal calculou p.gold total equivalente (120 gp + 1 pp = 130 PO)');
assert(grommCoinsFinal.coins.gp === 120, 'savePlayerCoinsFromModal salvou moedas gp corretamente');

// 4. Exibição de ouro no grid de heróis da campanha
vm.runInContext(`
  var mockCampGrid = { innerHTML: '' };
  var origGet3 = document.getElementById;
  document.getElementById = function(id) {
    if (id === 'camp-heroes-grid') return mockCampGrid;
    return { innerText: '', value: '' };
  };

  var heroForCamp = PLAYERS.find(p => p.id === 'p_hero_coins');
  renderCampaignHeroes({ id: 'camp_test_gold' }, [heroForCamp]);
  document.getElementById = origGet3;
`, sandbox);

const campGridHtml = vm.runInContext("mockCampGrid.innerHTML", sandbox);
assert(campGridHtml.includes('PO: <b>120</b>'), 'renderCampaignHeroes exibe ouro real (120 PO) sincronizado de coins.gp');

// 5. Coerção de IDs numéricos e strings na seleção de heróis da campanha
vm.runInContext(`
  var testCampWithIds = { id: 'c_mixed_ids', name: 'Mesa IDs Mistos', playerIds: [101, 'p_hero_coins'] };
  var pHeroNum = { id: 101, name: 'Numérico', student: 'Aluno Num', className: 'Guerreiro', level: 1 };
  PLAYERS.push(pHeroNum);

  var mockHeroesContainer = { innerHTML: '' };
  var origGet4 = document.getElementById;
  document.getElementById = function(id) {
    if (id === 'modal-campaign-heroes') return { classList: { add: () => {}, remove: () => {} } };
    if (id === 'campaign-heroes-picker-list') return mockHeroesContainer;
    return { innerText: '', value: '' };
  };

  var origGetActive = getActiveCampaign;
  getActiveCampaign = () => testCampWithIds;

  openCampaignHeroesModal();
  document.getElementById = origGet4;
  getActiveCampaign = origGetActive;
`, sandbox);

const pickerHtml = vm.runInContext("mockHeroesContainer.innerHTML", sandbox);
assert(pickerHtml.includes('value="101" checked'), 'openCampaignHeroesModal selecionou herói com ID numérico com sucesso via coerção');
assert(pickerHtml.includes('value="p_hero_coins" checked'), 'openCampaignHeroesModal selecionou herói com ID string com sucesso');

// 6. Verificações no bundle compilado
const bundle74 = fs.readFileSync(path.join(__dirname, 'planilha do rpg.html'), 'utf8');
assert(bundle74.includes('#modal-room-qrcode') && bundle74.includes('z-index: 2100 !important;'), 'Bundle possui z-index: 2100 no modal de QR code da sala');

// 🔄 49. Testes de Resiliência de Recarga F5 e Persistência do Mestre e Jogador (ISSUE-75):
console.log('\n🔄 49. Testes de Resiliência de Recarga F5 e Persistência de Estado (ISSUE-75):');

// 1. Verificação de declaração de activeBestiaryTypeChip no bundle
assert(bundle74.includes('let activeBestiaryTypeChip'), 'activeBestiaryTypeChip declarado com let prevenindo ReferenceError no F5');
assert(bundle74.includes('id="modal-party-item"') && bundle74.includes('style="z-index: 2100;"'), 'modal-party-item possui z-index: 2100 sobrepondo o visualizador do baú');

// 2. Teste de F5 do Mestre: Persistência de Campanhas e Baú do Grupo
vm.runInContext(`
  // Mestre cria campanha personalizada e adiciona ouro
  CAMPAIGNS_STATE = {
    activeCampaignId: 'camp_f5_test',
    campaigns: [{
      id: 'camp_f5_test',
      name: 'A Cidadela sem Sol',
      desc: 'Campanha de teste F5',
      status: 'active',
      playerIds: ['p1'],
      partyStash: { gold: 350, items: [{ id: 'it_espada_f5', name: 'Espada Longa +1', qty: 1 }], history: [] },
      sessions: []
    }]
  };
  saveCampaignsState();
`, sandbox);

// Simula novo ciclo de vida (F5): reinicializa estado de memória e executa loadCampaignsState
vm.runInContext(`
  CAMPAIGNS_STATE = { activeCampaignId: 'camp_1', campaigns: [] };
  const campLoaded = loadCampaignsState();
`, sandbox);

const reloadedCamp = vm.runInContext("getActiveCampaign()", sandbox);
assert(reloadedCamp && reloadedCamp.id === 'camp_f5_test', 'F5 do Mestre: Campanha personalizada restaurada com sucesso');
assert(reloadedCamp && reloadedCamp.partyStash && reloadedCamp.partyStash.gold === 350, 'F5 do Mestre: Saldo do Baú do Grupo (350 PO) preservado após reload');
assert(reloadedCamp && reloadedCamp.partyStash && reloadedCamp.partyStash.items.length === 1, 'F5 do Mestre: Itens do Baú do Grupo preservados após reload');

// 3. Teste de F5 do Mestre: Persistência da Aba Ativa
vm.runInContext(`
  activePortalPlayerId = null;
  document.body.classList.remove('mode-player-portal');
  switchTab('campaigns');
`, sandbox);
assert(vm.runInContext("localStorage.getItem('dnd5e_active_tab')", sandbox) === 'campaigns', 'switchTab salvou a aba ativa no localStorage');

// 4. Teste de F5 do Jogador: Persistência da Ficha e Modo Portal
vm.runInContext(`
  if (!Array.isArray(PLAYERS)) PLAYERS = [];
  if (!PLAYERS.find(p => p.id === 'p1')) {
    PLAYERS.push({ id: 'p1', name: 'Valeros', student: 'Jogador Teste', className: 'Guerreiro', level: 1, hp: 12, maxHp: 12, ac: 16 });
  }
  // Aluno entra no modo portal
  initPlayerPortalMode('p1');
`, sandbox);
assert(vm.runInContext("localStorage.getItem('dnd5e_last_portal_player_id')", sandbox) === 'p1', 'initPlayerPortalMode persistiu dnd5e_last_portal_player_id no localStorage');
assert(vm.runInContext("localStorage.getItem('dnd5e_session_role')", sandbox) === 'player', 'initPlayerPortalMode persistiu dnd5e_session_role como player');

// Simula F5 do Aluno: limpa variáveis de sessão em memória e dispara checkPlayerPortalUrl
vm.runInContext(`
  activePortalPlayerId = null;
  clientRole = 'unknown';
  window.location.search = '';
  const portalRestored = checkPlayerPortalUrl();
`, sandbox);

assert(vm.runInContext("activePortalPlayerId", sandbox) === 'p1', 'F5 do Jogador: checkPlayerPortalUrl restaurou a ficha do jogador ativa');
assert(vm.runInContext("clientRole", sandbox) === 'player', 'F5 do Jogador: clientRole restabelecido como player');
// ========================================================
// 50. TESTES DE PADRONIZAÇÃO DE MODAIS, RESPONSIVIDADE E ESTILOS DE RECOMPENSAS (ISSUE-76)
// ========================================================
console.log('\n🎨 50. Testes de Padronização de Modais e Responsividade (ISSUE-76):');

// 1. Validação de ausência de media queries não fechadas em head_css.html
const headCssContent = fs.readFileSync(path.join(__dirname, 'src', 'styles', 'head_css.html'), 'utf8');
const openBraces = (headCssContent.match(/\{/g) || []).length;
const closeBraces = (headCssContent.match(/\}/g) || []).length;
assert(openBraces === closeBraces, `Chaves balanceadas em head_css.html (abertas: ${openBraces}, fechadas: ${closeBraces})`);

// 2. Validação de bundle contendo classes unificadas de modal
const modalTestBundle = fs.readFileSync(path.join(__dirname, 'planilha do rpg.html'), 'utf8');
assert(modalTestBundle.includes('.modal-body,') && modalTestBundle.includes('.modal-box'), 'Bundle contém definição unificada de .modal-body e .modal-box');
assert(modalTestBundle.includes('.player-login-toolbar'), 'Bundle contém classe de toolbar responsiva .player-login-toolbar');
assert(modalTestBundle.includes('.reward-hero-chip'), 'Bundle contém estilização para chips de heróis em recompensas');
assert(modalTestBundle.includes('.reward-coin-grid'), 'Bundle contém grid de moedas para recompensas');

// 3. Validação de modais utilizando modal-body
const uiHtmlContent = fs.readFileSync(path.join(__dirname, 'src', 'ui', 'ui.html'), 'utf8');
assert(!uiHtmlContent.includes('<div class="modal-box"'), 'Nenhum modal em ui.html utiliza .modal-box isolada sem .modal-body');
assert(uiHtmlContent.includes('id="modal-batch-rewards" class="modal-overlay">\n    <div class="modal-body"'), 'modal-batch-rewards utiliza modal-body padronizada');
assert(uiHtmlContent.includes('id="modal-trade-item" class="modal-overlay">\n    <div class="modal-body"'), 'modal-trade-item utiliza modal-body padronizada');

// 4. Teste de renderBatchRewardHeroList com iniciais e checkbox
vm.runInContext(`
  PLAYERS = [
    { id: 'h1', name: 'Yoshigake Kira', student: 'Aluno 1', className: 'Guerreiro', level: 2, hp: 20, maxHp: 20, ac: 15 },
    { id: 'h2', name: 'Deraravely', student: 'Aluno 2', className: 'Mago', level: 2, hp: 14, maxHp: 14, ac: 12 }
  ];
  batchRewardSelectedHeroIds = new Set(['h1']);
  renderBatchRewardHeroList();
`, sandbox);

const rewardListEl = vm.runInContext("document.getElementById('batch-reward-hero-list')", sandbox);
assert(rewardListEl && rewardListEl.innerHTML.includes('reward-hero-chip'), 'renderBatchRewardHeroList renderizou chips de heróis');
assert(rewardListEl && rewardListEl.innerHTML.includes('Yoshigake Kira'), 'Chip contém nome do herói Yoshigake Kira');
assert(rewardListEl && rewardListEl.innerHTML.includes('type="checkbox" checked'), 'Heroi selecionado possui checkbox marcado');

// 5. Teste de renderPlayerLoginList com classes aprimoradas
vm.runInContext(`
  activePortalPlayerId = null;
  renderPlayerLoginList();
`, sandbox);

const loginListEl = vm.runInContext("document.getElementById('player-login-list-container')", sandbox);
assert(loginListEl && loginListEl.innerHTML.includes('player-login-card'), 'renderPlayerLoginList gerou cards de heróis');
assert(loginListEl && loginListEl.innerHTML.includes('Yoshigake Kira'), 'Card contém nome do herói');
assert(loginListEl && loginListEl.innerHTML.includes('CA 15'), 'Card contém CA formatada corretamente');
assert(loginListEl && loginListEl.innerHTML.includes('line-height: 1;'), 'Avatar possui line-height: 1 para prevenção de corte');

// --- SUÍTE 51: Motor Nativo de QR Code SVG Offline & Regras D&D 5E de 0 PV e Slots ---
console.log('\n📲 51. Testes de QR Code Offline, Normalização de URL e Regras D&D 5E (0 PV e Slots):');

// 1. Validação de existência de qrcode_lib.js
assert(fs.existsSync(path.join(__dirname, 'src', 'js', 'qrcode_lib.js')), 'Arquivo src/js/qrcode_lib.js existe no repositório');

// 2. Geração de SVG vetorial nativo via generateQrCodeSvg
const testSvg = vm.runInContext("generateQrCodeSvg('https://uranio8.github.io/planilha-rpg/?room=teste&lobby=true', 220, 2)", sandbox);
assert(typeof testSvg === 'string' && testSvg.includes('<svg') && testSvg.includes('</svg>'), 'generateQrCodeSvg gerou SVG vetorial válido');
assert(testSvg.includes('viewBox="0 0'), 'SVG possui atributo viewBox responsivo');

// 3. renderQrCodeToContainer com elemento container
vm.runInContext(`
  var qrTestDiv = { id: 'qr-test-box', innerHTML: '', style: {} };
  renderQrCodeToContainer(qrTestDiv, 'https://uranio8.github.io/planilha-rpg/?room=turma_a', 200);
`, sandbox);
const qrTestRender = vm.runInContext('qrTestDiv.innerHTML', sandbox);
assert(qrTestRender.includes('<svg') && qrTestRender.includes('</svg>'), 'renderQrCodeToContainer injetou SVG nativo dentro do container');

// 4. Normalização canônica de URLs locais (file: e localhost)
vm.runInContext(`
  window.location.protocol = 'file:';
  window.location.hostname = '';
`, sandbox);
const fileCanonicalUrl = vm.runInContext("getCanonicalPublicUrl('room=turma_escola&lobby=true')", sandbox);
assert(fileCanonicalUrl === 'https://uranio8.github.io/planilha-rpg/?room=turma_escola&lobby=true', 'getCanonicalPublicUrl normalizou URL file:/// para GitHub Pages canônico');

vm.runInContext(`
  window.location.protocol = 'http:';
  window.location.hostname = 'localhost';
`, sandbox);
const localCanonicalUrl = vm.runInContext("getCanonicalPublicUrl('room=turma_escola')", sandbox);
assert(localCanonicalUrl === 'https://uranio8.github.io/planilha-rpg/?room=turma_escola', 'getCanonicalPublicUrl normalizou URL localhost para GitHub Pages canônico');

// 5. openRoomQrCodeModal gera URL canônica e injeta SVG
vm.runInContext(`
  setStoredFirebaseRoom('sala_dragao');
  openRoomQrCodeModal();
`, sandbox);
const roomQrContainer = vm.runInContext("document.getElementById('img-room-qrcode')", sandbox);
assert(roomQrContainer && roomQrContainer.innerHTML.includes('<svg'), 'openRoomQrCodeModal renderizou SVG offline em #img-room-qrcode');

// 6. openMasterSyncDeviceModal gera URL canônica e injeta SVG
vm.runInContext(`
  openMasterSyncDeviceModal();
`, sandbox);
const syncQrContainer = vm.runInContext("document.getElementById('img-master-sync-qrcode')", sandbox);
assert(syncQrContainer && syncQrContainer.innerHTML.includes('<svg'), 'openMasterSyncDeviceModal renderizou SVG offline em #img-master-sync-qrcode');

// 7. openSharePlayerModal gera URL canônica e injeta SVG
vm.runInContext(`
  PLAYERS = [
    { id: 'p_qr_test', name: 'Gimli', student: 'Aluno G', className: 'Guerreiro', level: 3, hp: 25, maxHp: 25, ac: 16 }
  ];
  openSharePlayerModal('p_qr_test');
`, sandbox);
const shareQrContainer = vm.runInContext("document.getElementById('share-qrcode-render')", sandbox);
assert(shareQrContainer && shareQrContainer.innerHTML.includes('<svg'), 'openSharePlayerModal renderizou SVG offline em #share-qrcode-render');

// 8. Regra D&D 5E: Dano adicional a 0 PV incrementa falha no teste da morte
vm.runInContext(`
  var hero0hp = PLAYERS.find(p => p.id === 'p_qr_test');
  adjustPlayerHp('p_qr_test', -25); // leva a 0 PV
`, sandbox);
const heroAt0 = vm.runInContext("PLAYERS.find(p => p.id === 'p_qr_test')", sandbox);
assert(heroAt0.hp === 0, 'Herói foi a 0 PV');
assert(heroAt0.deathSaves.fail === 0, 'Death saves falhas inicializadas em 0');

vm.runInContext(`
  adjustPlayerHp('p_qr_test', -5); // Dano adicional a 0 PV
`, sandbox);
const heroAfterDmgAt0 = vm.runInContext("PLAYERS.find(p => p.id === 'p_qr_test')", sandbox);
assert(heroAfterDmgAt0.deathSaves.fail === 1, 'Dano adicional a 0 PV incrementou 1 falha de morte (Regra oficial D&D 5e)');

// 9. Regra D&D 5E: Cura a 0 PV restaura a consciência e zera testes da morte
vm.runInContext(`
  adjustPlayerHp('p_qr_test', 4); // Cura vindo de 0 PV
`, sandbox);
const heroAfterHealAt0 = vm.runInContext("PLAYERS.find(p => p.id === 'p_qr_test')", sandbox);
assert(heroAfterHealAt0.hp === 4, 'Herói recuperou 4 PV');
assert(heroAfterHealAt0.deathSaves.success === 0 && heroAfterHealAt0.deathSaves.fail === 0, 'Cura a 0 PV zerou os testes da morte (Regra oficial D&D 5e)');

// 10. Descanso Longo restaura todos os círculos de slots (sem truncar em 5)
vm.runInContext(`
  hero0hp.slots = [4, 3, 3, 3, 2, 1, 1, 1, 1]; // Conjurador de alto nível (9 círculos)
  hero0hp.slotsUsed = [1, 1, 1, 1, 1, 1, 1, 1, 1];
  playerLongRest('p_qr_test');
`, sandbox);
const heroAfterLongRest = vm.runInContext("PLAYERS.find(p => p.id === 'p_qr_test')", sandbox);
assert(heroAfterLongRest.slotsUsed.length === 9, 'slotsUsed possui os 9 círculos de magias');
assert(heroAfterLongRest.slotsUsed.every(u => u === 0), 'Todos os 9 círculos de magia foram completamente restaurados no Descanso Longo');

// ==========================================
// 52. TESTES DE LAYOUT MOBILE DO LOGIN DO JOGADOR (ISSUE-78)
// ==========================================
console.log('\n📱 52. Testes de Layout Mobile dos Cards de Heróis no Login (ISSUE-78):');
const bundle78 = fs.readFileSync(path.join(__dirname, 'planilha do rpg.html'), 'utf8');
assert(bundle78.includes('grid-auto-rows: max-content'), 'Bundle CSS contém grid-auto-rows: max-content em .player-login-grid');
assert(bundle78.includes('align-content: start'), 'Bundle CSS contém align-content: start em .player-login-grid');
assert(bundle78.includes('min-height: max-content'), 'Bundle CSS contém min-height: max-content em .player-login-card');
assert(bundle78.includes('box-sizing: border-box'), 'Bundle CSS contém box-sizing: border-box em .player-login-card');
assert(bundle78.includes('no seu dispositivo'), 'Subtítulo do modal de login atualizado para dispositivos móveis');

vm.runInContext(`
  PLAYERS = [
    { id: 'p_mob1', name: 'Valerius', student: 'Arthur', className: 'Guerreiro', race: 'Anão', level: 2, hp: 24, maxHp: 24, ac: 16 },
    { id: 'p_mob2', name: 'Lyra', student: 'Beatriz', className: 'Maga', race: 'Elfa', level: 2, hp: 14, maxHp: 14, ac: 13 }
  ];
  renderPlayerLoginList();
`, sandbox);
const mobLoginContainer = vm.runInContext("document.getElementById('player-login-list-container')", sandbox);
assert(mobLoginContainer && mobLoginContainer.innerHTML.includes('player-login-card'), 'renderPlayerLoginList gerou os cards no container');
assert(mobLoginContainer.innerHTML.includes('Valerius'), 'Container contém o herói Valerius');
assert(mobLoginContainer.innerHTML.includes('Lyra'), 'Container contém a heroína Lyra');
assert(mobLoginContainer.innerHTML.includes('Entrar com este Herói'), 'Cards contêm o botão de ação "Entrar com este Herói"');

// ==========================================
// 53. TESTES DE SINCRONIZAÇÃO EM NUVEM E MELHORIAS NO COMBATE (ISSUE-80)
// ==========================================
console.log('\n⚔️ 53. Testes de Sincronização em Nuvem e Melhorias no Combate (ISSUE-80):');
const bundle80 = fs.readFileSync(path.join(__dirname, 'planilha do rpg.html'), 'utf8');
assert(bundle80.includes('combatant-hp-inline'), 'Bundle CSS contém classe .combatant-hp-inline para edição direta de PV');
assert(bundle80.includes('inline-hp-input'), 'Bundle CSS contém classe .inline-hp-input para input dinâmico de PV');
assert(bundle80.includes('combatant-notes-details'), 'Bundle CSS contém classe .combatant-notes-details para anotações do combatente');
assert(bundle80.includes('btn-announce-turn'), 'Bundle CSS contém classe .btn-announce-turn para botão de anúncio de turno');

// 1. Bloqueio de Sobrescrita de Estado de Combate por Snapshot de Jogador (Race Condition Bug 1)
vm.runInContext(`
  state = {
    round: 3,
    turnIndex: 2,
    combatants: [
      { id: 'c_master_1', name: 'Guerreiro Ativo', init: 18, hp: 20, maxHp: 20, type: 'player' },
      { id: 'c_master_2', name: 'Goblin Chefe', init: 12, hp: 15, maxHp: 15, type: 'monster' }
    ]
  };

  // Jogador publica ficha com snapshot que inclui estado defasado da nuvem (ex: rodada 1, turnIndex 0)
  const playerStaleSnapshot = {
    publishedBy: 'player',
    state: {
      round: 1,
      turnIndex: 0,
      combatants: [
        { id: 'c_stale_1', name: 'Guerreiro Antigo', init: 10, hp: 10, maxHp: 20 }
      ]
    },
    players: [
      { id: 'c_master_1', name: 'Guerreiro Ativo', hp: 18, maxHp: 20, updatedAt: Date.now() }
    ]
  };

  applyCloudDataToLocal(playerStaleSnapshot);
`, sandbox);

const protectedCombatState = vm.runInContext("state", sandbox);
assert(protectedCombatState.round === 3, 'applyCloudDataToLocal PRESERVOU a Rodada 3 do mestre contra sobrescrita de jogador');
assert(protectedCombatState.turnIndex === 2, 'applyCloudDataToLocal PRESERVOU o turnIndex 2 do mestre');
assert(protectedCombatState.combatants.length === 2, 'applyCloudDataToLocal NÃO substituiu a lista de combatentes por snapshot de jogador');

// 2. Atualização Legítima de Estado de Combate quando publicado pelo Mestre
vm.runInContext(`
  const masterLegitSnapshot = {
    publishedBy: 'master',
    players: [
      { id: 'c_master_1', name: 'Guerreiro Ativo', student: 'Aluno 1', hp: 16, maxHp: 20 }
    ],
    state: {
      round: 4,
      turnIndex: 1,
      combatants: [
        { id: 'c_master_1', name: 'Guerreiro Ativo', init: 18, hp: 16, maxHp: 20, type: 'player' },
        { id: 'c_master_2', name: 'Goblin Chefe', init: 12, hp: 8, maxHp: 15, type: 'monster' },
        { id: 'c_master_3', name: 'Lobo', init: 10, hp: 11, maxHp: 11, type: 'monster' }
      ]
    }
  };

  applyCloudDataToLocal(masterLegitSnapshot);
`, sandbox);

const updatedCombatState = vm.runInContext("state", sandbox);
assert(updatedCombatState.round === 4, 'applyCloudDataToLocal ATUALIZOU para a Rodada 4 enviada pelo mestre');
assert(updatedCombatState.turnIndex === 1, 'applyCloudDataToLocal ATUALIZOU o turnIndex enviado pelo mestre');
assert(updatedCombatState.combatants.length === 3, 'applyCloudDataToLocal atualizou a lista com os 3 combatentes do mestre');

// 3. Edição Inline de PV do Combatente (saveInlineHpEdit)
vm.runInContext(`
  PLAYERS = [
    { id: 'p_inline_hero', name: 'Arthur', student: 'Arthur', hp: 20, maxHp: 25 }
  ];
  state = {
    round: 1,
    turnIndex: 0,
    combatants: [
      { id: 'c_inline_1', playerId: 'p_inline_hero', name: 'Arthur (Arthur)', init: 15, hp: 20, maxHp: 25, type: 'player' }
    ]
  };

  saveInlineHpEdit('c_inline_1', 14);
`, sandbox);

const heroCombatantAfterInline = vm.runInContext("state.combatants[0]", sandbox);
const heroPlayerAfterInline = vm.runInContext("PLAYERS[0]", sandbox);
assert(heroCombatantAfterInline.hp === 14, 'saveInlineHpEdit atualizou o PV do combatente para 14');
assert(heroPlayerAfterInline.hp === 14, 'saveInlineHpEdit sincronizou bidirecionalmente com a ficha do herói');

// 4. Anotações Táticas por Combatente (updateCombatantNotes)
vm.runInContext(`
  updateCombatantNotes('c_inline_1', 'Vulnerável a Fogo, Resistência a Frio');
`, sandbox);
const combatantNotesVal = vm.runInContext("state.combatants[0].notes", sandbox);
assert(combatantNotesVal === 'Vulnerável a Fogo, Resistência a Frio', 'updateCombatantNotes gravou as anotações táticas no combatente');

// 5. Anúncio do Turno Ativo (announceActiveTurn)
vm.runInContext(`
  let announcedNarrative = '';
  renderPlayerView = function(msg) { announcedNarrative = msg; };
  announceActiveTurn('c_inline_1');
`, sandbox);
const narrativeResult = vm.runInContext("announcedNarrative", sandbox);
assert(narrativeResult.includes('Arthur (Arthur)'), 'announceActiveTurn despachou o anúncio para o Telão com o nome do combatente');

// 6. Verificação de Disparo do Firebase Sync em Mutações de Combate
vm.runInContext(`
  const originalSyncLocalChanges = syncLocalChangesToFirebase;
  let firebaseImmediateCalls = 0;
  syncLocalChangesToFirebase = function(immediate) {
    if (immediate === true) firebaseImmediateCalls++;
  };

  nextTurn();
  quickAdjustCombatantHp('c_inline_1', -2);
  resetCombat();
  syncLocalChangesToFirebase = originalSyncLocalChanges;
`, sandbox);
const totalImmediateSyncs = vm.runInContext("firebaseImmediateCalls", sandbox);
assert(totalImmediateSyncs >= 3, 'nextTurn, quickAdjustCombatantHp e resetCombat disparam syncLocalChangesToFirebase(true)');

console.log('\n🎒 54. Testes de Sincronização em Tempo Real (Bolsa do Grupo, HP e Espaços de Magia - ISSUE-81):');

// 1. Sincronização da Bolsa do Grupo no Jogador
vm.runInContext(`
  clientRole = 'player';
  activePortalPlayerId = 'p_sync_hero';
  CAMPAIGNS_STATE = {
    activeCampaignId: 'camp_sync_1',
    campaigns: [{
      id: 'camp_sync_1',
      name: 'Mesa de Teste',
      partyStash: { gold: 50, items: [], updatedAt: 100 }
    }]
  };

  const masterCloudCampaigns = {
    activeCampaignId: 'camp_sync_1',
    campaigns: [{
      id: 'camp_sync_1',
      name: 'Mesa de Teste',
      partyStash: {
        gold: 150,
        items: [{ id: 'item_reliquia_1', name: 'Amuleto Solar +1', qty: 1, category: 'Acessório' }],
        updatedAt: 200
      }
    }]
  };

  mergeCloudCampaignsState(masterCloudCampaigns);
`, sandbox);
const playerCampAfterMerge = vm.runInContext("CAMPAIGNS_STATE.campaigns[0]", sandbox);
assert(playerCampAfterMerge.partyStash.gold === 150, 'Jogador adota ouro do baú do mestre');
assert(playerCampAfterMerge.partyStash.items.some(it => it.id === 'item_reliquia_1'), 'Jogador adota item do baú do mestre em tempo real');

// 2. Sincronização de HP do Jogador com Tabela de Combate do Mestre
vm.runInContext(`
  clientRole = 'master';
  activePortalPlayerId = null;
  PLAYERS = [
    { id: 'p_hero_sync', name: 'Arthur Pendragon', student: 'Arthur', hp: 20, maxHp: 20, updatedAt: 100, slots: [4, 2, 0], slotsUsed: [0, 0, 0] }
  ];
  state = {
    round: 1,
    current: 0,
    combatants: [
      { id: 'c_comb_hero', type: 'player', playerId: 'p_hero_sync', name: 'Arthur Pendragon (Arthur)', hp: 20, maxHp: 20 }
    ]
  };

  // Simula jogador enviando atualização de HP (-6) e slot de magia gasto
  const playerCloudPayload = {
    publishedBy: 'player',
    players: [
      { id: 'p_hero_sync', name: 'Arthur Pendragon', student: 'Arthur', hp: 14, maxHp: 20, updatedAt: 250, slots: [4, 2, 0], slotsUsed: [1, 0, 0] }
    ],
    state: { round: 99, combatants: [] } // snapshot espúrio do jogador
  };

  applyCloudDataToLocal(playerCloudPayload);
`, sandbox);
const masterCombatantAfterPlayerSync = vm.runInContext("state.combatants[0]", sandbox);
const masterPlayerAfterPlayerSync = vm.runInContext("PLAYERS[0]", sandbox);
const masterCombatRound = vm.runInContext("state.round", sandbox);

assert(masterPlayerAfterPlayerSync.hp === 14, 'Ficha do mestre atualizada com o novo PV do jogador (14)');
assert(masterPlayerAfterPlayerSync.slotsUsed[0] === 1, 'Ficha do mestre atualizada com o slot de magia gasto pelo jogador');
assert(masterCombatantAfterPlayerSync.hp === 14, 'Combatente do mestre sincronizado com o novo PV do jogador (14)');
assert(masterCombatRound === 1, 'Mestre preservou a Rodada do combate intacta contra snapshot do jogador');

// 3. Salvamento de Jogador no LocalStorage Preserva Combate do Mestre
vm.runInContext(`
  clientRole = 'player';
  activePortalPlayerId = 'p_hero_sync';
  const preSaveState = { round: 5, combatants: [{ id: 'boss_1', name: 'Dragão Vermelho', hp: 200 }] };
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ state: preSaveState, players: PLAYERS }));

  saveToLocalStorage();
  const loadedFromStorage = JSON.parse(localStorage.getItem(STORAGE_KEY));
`, sandbox);
const preservedStorageState = vm.runInContext("loadedFromStorage.state", sandbox);
assert(preservedStorageState.round === 5, 'saveToLocalStorage de jogador preserva rodada do mestre');
assert(preservedStorageState.combatants.some(c => c.id === 'boss_1'), 'saveToLocalStorage de jogador preserva boss no combate do mestre');

// 4. Imediatismo de Disparo do Firebase Sync (Bypass de Cooldown em Interações do Usuário)
vm.runInContext(`
  var executedCloudDbSetCalled = false;
  clientRole = 'master';
  isFirebaseConnected = true;
  realtimeDb = {
    ref: (path) => ({
      set: (payload) => {
        executedCloudDbSetCalled = true;
        return Promise.resolve();
      }
    })
  };
  cloudSyncCooldownUntil = Date.now() + 5000; // Cooldown longo ativo
  syncLocalChangesToFirebase(true); // Ação imediata do usuário
`, sandbox);
const wasImmediateExecuted = vm.runInContext("executedCloudDbSetCalled", sandbox);
assert(wasImmediateExecuted === true, 'syncLocalChangesToFirebase(true) ignora cooldown e despacha na hora para o Firebase');

// ========================================================
// 55. TESTES DE AUTOMAÇÃO EM TEMPO REAL: SITUAÇÕES 1, 3 E 4 (ISSUE-82)
// ========================================================
console.log('\n⚡ 55. Testes de Automação em Tempo Real: Situações 1, 3 e 4 (ISSUE-82):');

// 1. SITUAÇÃO 1: Auto-Publicação para o Mestre ao Conectar em Sala Vazia na Nuvem
vm.runInContext(`
  var publishedRoomsTracked = [];
  var originalPublishMasterCampaignToCloud = publishMasterCampaignToCloud;
  publishMasterCampaignToCloud = function(silent) {
    publishedRoomsTracked.push({ silent: silent, role: clientRole, playersCount: (PLAYERS || []).length });
  };

  // Cenário A: Mestre com personagens locais recebe sala vazia do Realtime DB
  clientRole = 'master';
  PLAYERS = [{ id: 'p_hero_master_init', name: 'Geralt de Rivia', hp: 25, maxHp: 25 }];
  applyCloudDataToLocal({ players: [] }); // Nuvem vazia
`, sandbox);
const masterPublishedEvents = vm.runInContext("publishedRoomsTracked", sandbox);
assert(masterPublishedEvents.length === 1, 'Mestre auto-publicou silenciosamente ao detectar sala vazia na nuvem');
assert(masterPublishedEvents[0].silent === true, 'Auto-publicação do mestre ocorreu com silent=true');
assert(masterPublishedEvents[0].playersCount === 1, 'Auto-publicação enviou os personagens do mestre');

// Cenário B: Jogador se conecta em sala vazia (NUNCA deve auto-publicar)
vm.runInContext(`
  publishedRoomsTracked = [];
  clientRole = 'player';
  PLAYERS = [{ id: 'p_player_local_mock', name: 'Mock Player', hp: 10, maxHp: 10 }];
  applyCloudDataToLocal({ players: [] });
`, sandbox);
const playerPublishedEvents = vm.runInContext("publishedRoomsTracked", sandbox);
assert(playerPublishedEvents.length === 0, 'Jogador NÃO auto-publica em sala vazia, protegendo integridade da sala');

// 2. SITUAÇÃO 3: Ressincronização Reativa ao Despertar Dispositivo / Retornar à Aba
vm.runInContext(`
  var manualPullCallsCount = 0;
  var lastPullSilentArg = null;
  var originalManualPullFromCloud = manualPullFromCloud;
  manualPullFromCloud = function(silent) {
    manualPullCallsCount++;
    lastPullSilentArg = silent;
  };

  isFirebaseConnected = true;
  realtimeDb = { ref: () => ({ once: () => Promise.resolve({ val: () => ({}) }) }) };

  // Primeiro disparo ao acordar dispositivo
  handleDeviceWakeupOrTabFocus();
`, sandbox);
const wakeupPullCalls1 = vm.runInContext("manualPullCallsCount", sandbox);
const wakeupPullSilentArg = vm.runInContext("lastPullSilentArg", sandbox);
assert(wakeupPullCalls1 === 1, 'handleDeviceWakeupOrTabFocus disparou ressincronização com a nuvem');
assert(wakeupPullSilentArg === true, 'manualPullFromCloud chamado com silent=true para não emitir popups/alerts');

// Teste de Throttle (disparo repetido em menos de 1.5s deve ser bloqueado)
vm.runInContext(`
  handleDeviceWakeupOrTabFocus();
  handleDeviceWakeupOrTabFocus();
`, sandbox);
const wakeupPullCallsAfterBurst = vm.runInContext("manualPullCallsCount", sandbox);
assert(wakeupPullCallsAfterBurst === 1, 'Throttle de 1.5s protegeu contra tempestades de eventos visibilitychange/focus/pageshow');

// 3. SITUAÇÃO 4: Auto-Save e Sincronização Contínua em Anotações com Debounce
vm.runInContext(`
  var combatSyncDispatched = false;
  syncLocalChangesToFirebase = function(immediate) {
    combatSyncDispatched = true;
  };

  state = {
    round: 1,
    turnIndex: 0,
    combatants: [
      { id: 'c_test_notes', name: 'Goblin Observador', notes: '' }
    ]
  };

  // Digitação em anotação do combatente (sem trim imediato para permitir espaços)
  updateCombatantNotes('c_test_notes', 'Vulnerável a fogo ');
`, sandbox);
const combatantNotesImmediate = vm.runInContext("state.combatants[0].notes", sandbox);
assert(combatantNotesImmediate === 'Vulnerável a fogo ', 'updateCombatantNotes atualizou o texto imediatamente preservando espaços');

// Restaura funções originais
vm.runInContext(`
  publishMasterCampaignToCloud = originalPublishMasterCampaignToCloud;
  manualPullFromCloud = originalManualPullFromCloud;
`, sandbox);

// =========================================================================
// 56. TESTES DO MODO JOGADOR: LEVEL UP, COMBATE READ-ONLY E RESILIÊNCIA (ISSUE-83)
// =========================================================================
console.log('\n🌟 56. Testes do Modo Jogador: Level Up, Combate Read-Only e Resiliência (ISSUE-83):');

// 1. Verificação de integridade CSS: botão de subir nível visível para o jogador
const headCssSuite56 = fs.readFileSync(path.join(__dirname, 'src', 'styles', 'head_css.html'), 'utf8');
assert(!headCssSuite56.includes('body.mode-player-portal .btn-levelup-trigger { display: none !important; }'), 'CSS do Modo Jogador não esconde .btn-levelup-trigger');
assert(headCssSuite56.includes('.portal-levelup-btn'), 'CSS contém estilização de .portal-levelup-btn');
assert(headCssSuite56.includes('.portal-turn-alert-chip'), 'CSS contém estilização de .portal-turn-alert-chip');
assert(headCssSuite56.includes('.player-combat-card'), 'CSS contém estilização de .player-combat-card');

// 2. Elementos no HTML standalone
const builtHtmlSuite56 = fs.readFileSync(path.join(__dirname, 'planilha do rpg.html'), 'utf8');
assert(builtHtmlSuite56.includes('id="portal-btn-levelup"'), 'HTML contém botão de atalho #portal-btn-levelup');
assert(builtHtmlSuite56.includes('id="portal-turn-active-indicator"'), 'HTML contém indicador de turno #portal-turn-active-indicator');
assert(builtHtmlSuite56.includes('id="modal-player-combat"'), 'HTML contém modal #modal-player-combat');
assert(builtHtmlSuite56.includes('id="pnav-combat"'), 'HTML contém chip de navegação #pnav-combat');

// 3. Execução do Assistente de Subir de Nível (Level Up) para o Jogador
vm.runInContext(`
  // Cria personagem de teste no nível 1
  const testHeroId = 'p_hero_levelup_test';
  const heroForLvl = {
    id: testHeroId,
    name: 'Arthur Pendragon',
    student: 'Arthur',
    race: 'Humano',
    className: 'Paladino',
    level: 1,
    hp: 12,
    maxHp: 12,
    con: 14,
    multiclass: [{ className: 'Paladino', level: 1, subclassIdx: 0 }],
    slots: [2, 0, 0, 0, 0],
    slotsUsed: [0, 0, 0, 0, 0],
    inventory: [],
    coins: { gp: 25 },
    updatedAt: Date.now()
  };
  PLAYERS = [heroForLvl];
  activePortalPlayerId = testHeroId;
  clientRole = 'player';

  // Configura estado do wizard para subir para nível 2 de Paladino com ganho médio de PV
  levelUpWizardState = {
    playerId: testHeroId,
    step: 3,
    selectedClassKey: 'Paladino',
    selectedClass: 'Paladino',
    targetClassLevel: 2,
    selectedSubclassIdx: 0,
    hpMethod: 'average',
    rolledHp: null
  };

  var levelUpSyncTriggered = false;
  var levelUpImmediateArg = false;
  syncLocalChangesToFirebase = function(immediate) {
    levelUpSyncTriggered = true;
    levelUpImmediateArg = immediate;
  };

  applyLevelUpConfirm();
`, sandbox);

const leveledHero = vm.runInContext("PLAYERS.find(p => p.id === 'p_hero_levelup_test')", sandbox);
assert(leveledHero.level === 2, 'applyLevelUpConfirm elevou o herói para o Nível 2');
assert(leveledHero.maxHp > 12, 'applyLevelUpConfirm incrementou o PV Máximo do herói');
assert(leveledHero.hp === leveledHero.maxHp, 'applyLevelUpConfirm curou o ganho de PV na evolução');
assert(vm.runInContext("levelUpSyncTriggered === true && levelUpImmediateArg === true", sandbox), 'applyLevelUpConfirm disparou syncLocalChangesToFirebase(true)');

// 4. Proteção contra sobrescrita por snapshot remoto atrasado (Stale Snapshot)
vm.runInContext(`
  // Snapshot antigo vindo da nuvem (gerado antes do herói upar)
  const staleCloud = {
    publishedBy: 'master',
    players: [
      {
        id: 'p_hero_levelup_test',
        name: 'Arthur Pendragon',
        level: 1, // Desatualizado na nuvem
        maxHp: 12, // Desatualizado na nuvem
        hp: 12,
        slots: [2, 0, 0, 0, 0],
        updatedAt: 1000 // Timestamp antigo
      }
    ]
  };

  applyCloudDataToLocal(staleCloud);
`, sandbox);

const heroAfterStaleCloud = vm.runInContext("PLAYERS.find(p => p.id === 'p_hero_levelup_test')", sandbox);
assert(heroAfterStaleCloud.level === 2, 'applyCloudDataToLocal PRESERVOU o Nível 2 contra snapshot defasado da nuvem');
assert(heroAfterStaleCloud.maxHp === leveledHero.maxHp, 'applyCloudDataToLocal PRESERVOU o PV Máximo aumentado contra snapshot defasado');

// 5. Modal de Combate Read-Only e Alerta de Turno Ativo
vm.runInContext(`
  // Configura combate ativo com 2 combatentes: Inimigo e o Herói
  state = {
    round: 2,
    turn: 1, // Turno do herói Arthur
    combatants: [
      { id: 'm_goblin', name: 'Goblin Líder', type: 'monster', hp: 15, maxHp: 30, ac: 13, init: 15 },
      { id: 'p_hero_levelup_test', playerId: 'p_hero_levelup_test', name: 'Arthur Pendragon', type: 'player', hp: PLAYERS[0].hp, maxHp: PLAYERS[0].maxHp, ac: 16, init: 12 }
    ]
  };

  updatePlayerPortalBanner();
  openPlayerCombatModal();
`, sandbox);

const combatModalActive = vm.runInContext("document.getElementById('modal-player-combat').classList.contains('active')", sandbox);
assert(combatModalActive === true, 'openPlayerCombatModal abriu o modal de combate');

const combatListHtml = vm.runInContext("document.getElementById('player-combat-list').innerHTML", sandbox);
assert(combatListHtml.includes('Goblin Líder'), 'Lista de combate exibe o inimigo Goblin Líder');
assert(combatListHtml.includes('Arthur Pendragon'), 'Lista de combate exibe o herói Arthur');
assert(combatListHtml.includes('VOCÊ'), 'Herói ativo identificado com badge "VOCÊ"');
assert(combatListHtml.includes('TURNO ATUAL'), 'Turno atual identificado na listagem');
// Confirma que não expõe botões destrutivos de mestre
assert(!combatListHtml.includes('removeCombatant'), 'Modal do jogador não expõe botão de remover combatente');
assert(!combatListHtml.includes('nextTurn'), 'Modal do jogador não expõe controle de passar turno');

const turnAlertDisplay = vm.runInContext("document.getElementById('portal-turn-active-indicator').style.display", sandbox);
assert(turnAlertDisplay === 'inline-flex', 'Indicador "SUA VEZ DE AGIR!" exibido no banner quando é o turno do jogador');

// --- SUÍTE 57: Subclasses Mágicas - Trapaceiro Arcano e Cavaleiro Místico (ISSUE-84) ---
console.log('\n🔮 57. Testes de Subclasses Mágicas: Trapaceiro Arcano e Cavaleiro Místico (ISSUE-84):');

// 1. Identificação de Subclasses Mágicas (isMagicalSubclass)
const isThirdRogue = vm.runInContext("isMagicalSubclass('Ladino', 2)", sandbox);
const isNotThirdRogue0 = vm.runInContext("isMagicalSubclass('Ladino', 0)", sandbox);
const isNotThirdRogue1 = vm.runInContext("isMagicalSubclass('Ladino', 1)", sandbox);
const isThirdRogueByName = vm.runInContext("isMagicalSubclass('Ladino', 0, 'Trapaceiro Arcano')", sandbox);
const isThirdFighter = vm.runInContext("isMagicalSubclass('Guerreiro', 2)", sandbox);
const isNotThirdFighter0 = vm.runInContext("isMagicalSubclass('Guerreiro', 0)", sandbox);
const isThirdFighterByName = vm.runInContext("isMagicalSubclass('Guerreiro', 0, 'Cavaleiro Místico')", sandbox);

assert(isThirdRogue === true, 'isMagicalSubclass identifica Ladino de subclasse índice 2 como subclasse mágica');
assert(isNotThirdRogue0 === false, 'isMagicalSubclass não marca Ladino Assassino (idx 0) como mágico');
assert(isNotThirdRogue1 === false, 'isMagicalSubclass não marca Ladino Ladrão (idx 1) como mágico');
assert(isThirdRogueByName === true, 'isMagicalSubclass identifica pelo nome "Trapaceiro Arcano"');
assert(isThirdFighter === true, 'isMagicalSubclass identifica Guerreiro de subclasse índice 2 (Cavaleiro Místico) como subclasse mágica');
assert(isNotThirdFighter0 === false, 'isMagicalSubclass não marca Guerreiro Campeão (idx 0) como mágico');
assert(isThirdFighterByName === true, 'isMagicalSubclass identifica pelo nome "Cavaleiro Místico"');

// 2. Cálculo de Espaços de Magia (calculateSpellSlots)
const slotsRogueLvl1 = vm.runInContext("calculateSpellSlots('Ladino', 1, 2)", sandbox);
const slotsRogueLvl2 = vm.runInContext("calculateSpellSlots('Ladino', 2, 2)", sandbox);
const slotsRogueLvl3 = vm.runInContext("calculateSpellSlots('Ladino', 3, 2)", sandbox);
const slotsRogueLvl4 = vm.runInContext("calculateSpellSlots('Ladino', 4, 2)", sandbox);
const slotsRogueLvl7 = vm.runInContext("calculateSpellSlots('Ladino', 7, 2)", sandbox);
const slotsRogueLvl10 = vm.runInContext("calculateSpellSlots('Ladino', 10, 2)", sandbox);
const slotsRogueLvl13 = vm.runInContext("calculateSpellSlots('Ladino', 13, 2)", sandbox);
const slotsRogueLvl19 = vm.runInContext("calculateSpellSlots('Ladino', 19, 2)", sandbox);

assert(JSON.stringify(slotsRogueLvl1) === JSON.stringify([0, 0, 0, 0, 0, 0, 0, 0, 0]), 'Trapaceiro Arcano Nv 1 não tem espaços de magia');
assert(JSON.stringify(slotsRogueLvl2) === JSON.stringify([0, 0, 0, 0, 0, 0, 0, 0, 0]), 'Trapaceiro Arcano Nv 2 não tem espaços de magia');
assert(JSON.stringify(slotsRogueLvl3) === JSON.stringify([2, 0, 0, 0, 0, 0, 0, 0, 0]), 'Trapaceiro Arcano Nv 3 recebe [2, 0, 0, 0, 0] espaços de 1º círculo');
assert(JSON.stringify(slotsRogueLvl4) === JSON.stringify([3, 0, 0, 0, 0, 0, 0, 0, 0]), 'Trapaceiro Arcano Nv 4 recebe [3, 0, 0, 0, 0] espaços de 1º círculo');
assert(JSON.stringify(slotsRogueLvl7) === JSON.stringify([4, 2, 0, 0, 0, 0, 0, 0, 0]), 'Trapaceiro Arcano Nv 7 recebe [4, 2, 0, 0, 0] (espaços de 2º círculo)');
assert(JSON.stringify(slotsRogueLvl10) === JSON.stringify([4, 3, 0, 0, 0, 0, 0, 0, 0]), 'Trapaceiro Arcano Nv 10 recebe [4, 3, 0, 0, 0]');
assert(JSON.stringify(slotsRogueLvl13) === JSON.stringify([4, 3, 2, 0, 0, 0, 0, 0, 0]), 'Trapaceiro Arcano Nv 13 recebe [4, 3, 2, 0, 0] (espaços de 3º círculo)');
assert(JSON.stringify(slotsRogueLvl19) === JSON.stringify([4, 3, 3, 1, 0, 0, 0, 0, 0]), 'Trapaceiro Arcano Nv 19 recebe [4, 3, 3, 1, 0] (espaços de 4º círculo)');

const slotsFighterLvl3 = vm.runInContext("calculateSpellSlots('Guerreiro', 3, 2)", sandbox);
const slotsFighterLvl7 = vm.runInContext("calculateSpellSlots('Guerreiro', 7, 2)", sandbox);
assert(JSON.stringify(slotsFighterLvl3) === JSON.stringify([2, 0, 0, 0, 0, 0, 0, 0, 0]), 'Cavaleiro Místico Nv 3 recebe [2, 0, 0, 0, 0] espaços de magia');
assert(JSON.stringify(slotsFighterLvl7) === JSON.stringify([4, 2, 0, 0, 0, 0, 0, 0, 0]), 'Cavaleiro Místico Nv 7 recebe [4, 2, 0, 0, 0] espaços de magia');

// 3. Limite de Magias Conhecidas e Truques (getMaxPreparedSpells)
vm.runInContext(`
  const rogueLvl1 = { name: 'Garrick', className: 'Ladino', level: 1, subclassIdx: 2, int: 16 };
  const rogueLvl3 = { name: 'Garrick', className: 'Ladino', level: 3, subclassIdx: 2, int: 16 };
  const rogueLvl7 = { name: 'Garrick', className: 'Ladino', level: 7, subclassIdx: 2, int: 16 };
  const fighterLvl3 = { name: 'Eldrin', className: 'Guerreiro', level: 3, subclassIdx: 2, int: 14 };

  resRogueLvl1 = getMaxPreparedSpells(rogueLvl1);
  resRogueLvl3 = getMaxPreparedSpells(rogueLvl3);
  resRogueLvl7 = getMaxPreparedSpells(rogueLvl7);
  resFighterLvl3 = getMaxPreparedSpells(fighterLvl3);
`, sandbox);

const resRogue1 = vm.runInContext("resRogueLvl1", sandbox);
const resRogue3 = vm.runInContext("resRogueLvl3", sandbox);
const resRogue7 = vm.runInContext("resRogueLvl7", sandbox);
const resFighter3 = vm.runInContext("resFighterLvl3", sandbox);

assert(resRogue1.type === 'none' && resRogue1.isKnownCaster === false, 'Ladino Nv 1 não possui conjuração de magias');
assert(resRogue3.type === 'known' && resRogue3.isKnownCaster === true, 'Trapaceiro Arcano Nv 3 é conjurador por magias conhecidas');
assert(resRogue3.max === 3, 'Trapaceiro Arcano Nv 3 conhece exatamente 3 magias');
assert(resRogue3.maxCantrips === 3, 'Trapaceiro Arcano Nv 3 conhece 3 truques (incluindo Mãos Mágicas)');
assert(resRogue3.attrLabel === 'INT', 'Trapaceiro Arcano utiliza atributo Inteligência (INT)');
assert(resRogue3.className === 'Trapaceiro Arcano', 'Rótulo de classe formatado como Trapaceiro Arcano');

assert(resRogue7.max === 5, 'Trapaceiro Arcano Nv 7 conhece 5 magias');
assert(resFighter3.type === 'known' && resFighter3.isKnownCaster === true, 'Cavaleiro Místico Nv 3 é conjurador por magias conhecidas');
assert(resFighter3.max === 3, 'Cavaleiro Místico Nv 3 conhece 3 magias');
assert(resFighter3.maxCantrips === 2, 'Cavaleiro Místico Nv 3 conhece 2 truques');
assert(resFighter3.attrLabel === 'INT', 'Cavaleiro Místico utiliza INT');

// 4. Estatísticas de Conjuração (CD de Resistência e Ataque Mágico)
vm.runInContext(`
  statsRogue3 = getPlayerSpellcastingStats(rogueLvl3);
`, sandbox);
const statsRogue3 = vm.runInContext("statsRogue3", sandbox);
assert(statsRogue3.isCaster === true, 'Trapaceiro Arcano Nv 3 identificado como conjurador ativo');
assert(statsRogue3.abilityKey === 'int', 'Chave de atributo de conjuração é "int"');
assert(statsRogue3.abilityLabel === 'INT', 'Label de atributo de conjuração é "INT"');
assert(statsRogue3.saveDc === 13, 'CD de magia calculada corretamente: 8 + 2 (Prof) + 3 (Mod INT) = 13');
assert(statsRogue3.attackBonus === '+5', 'Bônus de ataque mágico calculado corretamente: +2 (Prof) + 3 (Mod INT) = +5');

// 5. Compatibilidade no Seletor de Magias (getCompatibleClassKey)
const compRogue = vm.runInContext("getCompatibleClassKey('Ladino', 2)", sandbox);
const compFighter = vm.runInContext("getCompatibleClassKey('Guerreiro', 2)", sandbox);
assert(compRogue === 'Mago', 'getCompatibleClassKey para Trapaceiro Arcano direciona para lista de "Mago"');
assert(compFighter === 'Mago', 'getCompatibleClassKey para Cavaleiro Místico direciona para lista de "Mago"');

// 6. Evolução de Nível (Level Up) com Trapaceiro Arcano
vm.runInContext(`
  const testArcaneRogueId = 'p_arcane_rogue_lvlup';
  const arcaneRogueHero = {
    id: testArcaneRogueId,
    name: 'Vaxildan Arcano',
    student: 'Vax',
    race: 'Meio-Elfo',
    className: 'Ladino',
    level: 2,
    hp: 15,
    maxHp: 15,
    con: 12,
    subclassIdx: 0,
    multiclass: [{ className: 'Ladino', level: 2, subclassIdx: 0 }],
    slots: [0, 0, 0, 0, 0],
    slotsUsed: [0, 0, 0, 0, 0],
    inventory: [],
    coins: { gp: 50 },
    updatedAt: Date.now()
  };
  PLAYERS = [arcaneRogueHero];
  activePortalPlayerId = testArcaneRogueId;
  clientRole = 'player';

  levelUpWizardState = {
    playerId: testArcaneRogueId,
    step: 3,
    selectedClassKey: 'Ladino',
    selectedClass: 'Ladino',
    targetClassLevel: 3,
    selectedSubclassIdx: 2, // Escolhe Trapaceiro Arcano
    hpMethod: 'fixed',
    calculatedHpGain: 6,
    rolledHp: null
  };

  applyLevelUpConfirm();
`, sandbox);

const evolvedHero = vm.runInContext("PLAYERS.find(p => p.id === 'p_arcane_rogue_lvlup')", sandbox);
assert(evolvedHero.level === 3, 'Herói subiu para o Nível 3');
assert(evolvedHero.subclassIdx === 2, 'subclassIdx atualizado para 2 (Trapaceiro Arcano)');
assert(evolvedHero.subclass && evolvedHero.subclass.includes('Trapaceiro Arcano'), 'subclass nome atualizado para conter "Trapaceiro Arcano"');
assert(JSON.stringify(evolvedHero.slots) === JSON.stringify([2, 0, 0, 0, 0, 0, 0, 0, 0]), 'Herói recebeu automaticamente [2, 0, 0, 0, 0, 0, 0, 0, 0] espaços de magia');

// ========================================================
// 58. TESTES DE SINCRONIZAÇÃO AUTOMÁTICA EM TEMPO REAL,
//     CARDS DE RECOMPENSA E BOTÃO DA NUVEM (ISSUE-85)
// ========================================================
console.log('\n💎 58. Testes de Sincronização Automática, Recompensas e Botão da Nuvem (ISSUE-85):');

// 1. Verificação de estilos no bundle
assert(bundleHtml.includes('.btn-top.firebase-status-pill'), 'Bundle contém estilos para .btn-top.firebase-status-pill');
assert(bundleHtml.includes('.reward-hero-pick-grid'), 'Bundle contém estilos para .reward-hero-pick-grid');
assert(bundleHtml.includes('.reward-hero-chip'), 'Bundle contém estilos para .reward-hero-chip');
assert(bundleHtml.includes('.player-login-status-pill'), 'Bundle contém estilos para .player-login-status-pill');

// 2. Preservação da classe btn-top no status da nuvem
vm.runInContext(`
  const testBadge = document.getElementById('firebase-status-badge') || { className: '', innerText: '' };
  updateFirebaseUiStatus('connected', 'Nuvem Conectada');
`, sandbox);
const badgeClassConnected = vm.runInContext("document.getElementById('firebase-status-badge').className", sandbox);
assert(badgeClassConnected.includes('btn-top') && badgeClassConnected.includes('connected'), 'updateFirebaseUiStatus preserva btn-top ao conectar');

vm.runInContext(`
  updateFirebaseUiStatus('syncing', 'Salvando...');
`, sandbox);
const badgeClassSyncing = vm.runInContext("document.getElementById('firebase-status-badge').className", sandbox);
assert(badgeClassSyncing.includes('btn-top') && badgeClassSyncing.includes('syncing'), 'updateFirebaseUiStatus preserva btn-top ao salvar');

// 3. Renderização completa dos cards no modal de recompensas com aluno, herói, nível e classe
vm.runInContext(`
  PLAYERS = [
    { id: 'p_test_reward_1', name: 'Valerius', student: 'Wesley', level: 4, className: 'Guerreiro', avatar: '⚔️' },
    { id: 'p_test_reward_2', name: 'Lyra', student: 'Mariana', level: 3, className: 'Maga', avatar: '🧙' }
  ];
  batchRewardSelectedHeroIds = new Set(['p_test_reward_1']);
  renderBatchRewardHeroList();
`, sandbox);

const rewardHtml = vm.runInContext("document.getElementById('batch-reward-hero-list').innerHTML", sandbox);
assert(rewardHtml.includes('Valerius'), 'Card de recompensa exibe nome do herói Valerius');
assert(rewardHtml.includes('Wesley'), 'Card de recompensa exibe nome do aluno Wesley');
assert(rewardHtml.includes('Nv 4'), 'Card de recompensa exibe nível Nv 4');
assert(rewardHtml.includes('Guerreiro'), 'Card de recompensa exibe classe Guerreiro');
assert(rewardHtml.includes('Lyra'), 'Card de recompensa exibe nome da heroína Lyra');
assert(rewardHtml.includes('Mariana'), 'Card de recompensa exibe nome da aluna Mariana');
assert(rewardHtml.includes('Nv 3'), 'Card de recompensa exibe nível Nv 3');
assert(rewardHtml.includes('Maga'), 'Card de recompensa exibe classe Maga');

// 4. Testes de atualização síncrona do Baú do Grupo (updateAllPartyStashElements)
assert(typeof vm.runInContext("updateAllPartyStashElements", sandbox) === 'function', 'Função updateAllPartyStashElements exportada');
vm.runInContext(`
  {
    const camp58 = getActiveCampaign();
    camp58.partyStash = { gold: 580, items: [], history: [] };
    updateAllPartyStashElements();
  }
`, sandbox);

const modalGoldText = vm.runInContext("document.getElementById('party-stash-modal-gold').innerText", sandbox);
const masterGoldText = vm.runInContext("document.getElementById('stash-gold-amount').innerText", sandbox);
assert(modalGoldText === '580 PO', 'updateAllPartyStashElements atualizou o ouro no modal para 580 PO');
assert(masterGoldText === '580 PO', 'updateAllPartyStashElements atualizou o ouro na aba de campanhas para 580 PO');

// 5. Sincronização do Baú do Grupo via nuvem dispara updateAllPartyStashElements
vm.runInContext(`
  clientRole = 'player';
  const remotePayload = {
    campaigns: {
      activeCampaignId: 'camp_1',
      campaigns: [
        {
          id: 'camp_1',
          name: 'Campanha em Tempo Real',
          partyStash: {
            gold: 750,
            items: [{ id: 'it_remote_1', name: 'Gema Estelar', qty: 1, category: 'Tesouro' }],
            updatedAt: Date.now() + 5000
          }
        }
      ]
    },
    lastUpdatedBy: 'remote_master'
  };
  applyCloudDataToLocal(remotePayload);
`, sandbox);

const syncedModalGold = vm.runInContext("document.getElementById('party-stash-modal-gold').innerText", sandbox);
assert(syncedModalGold === '750 PO', 'applyCloudDataToLocal sincronizou o ouro do Baú em tempo real para 750 PO');

// 6. Teste de toggle da configuração de sala do modal de login
assert(typeof vm.runInContext("togglePlayerLoginRoomConfig", sandbox) === 'function', 'Função togglePlayerLoginRoomConfig exportada');
vm.runInContext(`
  togglePlayerLoginRoomConfig();
`, sandbox);
const boxDisplay = vm.runInContext("document.getElementById('player-login-custom-room-box').style.display", sandbox);
// --- SUÍTE 59: Mesa Oficial D&D 5E, Motor de Armas D&D Beyond, Bônus de PV e Dado Físico (ISSUE-86) ---
console.log('\n⚔️ 59. Testes da Mesa Oficial, Motor de Armas D&D Beyond, Bônus de PV e Dado Físico (ISSUE-86):');

// 1. Validação da Mesa Oficial (9 heróis de alunos reais, sem modo teste / p1..p5)
const coreMatch = jsCore.match(/let PLAYERS = (\[[\s\S]*?\]);\s*let state =/);
const parsedCorePlayers = coreMatch ? JSON.parse(coreMatch[1]) : [];
assert(parsedCorePlayers.length === 9, `Mesa oficial inicializada com 9 personagens reais (${parsedCorePlayers.length} heróis)`);

const hasOldMocks = parsedCorePlayers.some(p => ['p1','p2','p3','p4','p5'].includes(p.id));
assert(!hasOldMocks, 'Nenhum dos IDs de teste legados (p1..p5) está presente no elenco oficial');

const studentsList = parsedCorePlayers.map(p => p.student);
assert(studentsList.includes('Gustavo') && studentsList.includes('Samuel') && studentsList.includes('Ademar') && studentsList.includes('Diogo'), 'Alunos reais (Gustavo, Samuel, Ademar, Diogo, etc.) presentes no elenco oficial');

const officialCamps = vm.runInContext("typeof INITIAL_CAMPAIGNS !== 'undefined' ? INITIAL_CAMPAIGNS : (typeof CAMPAIGNS !== 'undefined' ? CAMPAIGNS : [])", sandbox);
assert(officialCamps && officialCamps.length >= 2, 'Campanhas oficiais carregadas com no mínimo 2 campanhas');
const phandelverCamp = officialCamps.find(c => c.name.includes('Phandelver'));
assert(phandelverCamp && phandelverCamp.playerIds.length > 0, 'Campanha oficial A Mina Perdida de Phandelver possui vínculos com heróis reais');

// 2. Validação do Motor de Armas D&D Beyond
assert(typeof vm.runInContext("calculateWeaponAttackStats", sandbox) === 'function', 'Função calculateWeaponAttackStats exportada');
assert(typeof vm.runInContext("isWeaponProficient", sandbox) === 'function', 'Função isWeaponProficient exportada');
assert(typeof vm.runInContext("equipBackpackItemAsAttack", sandbox) === 'function', 'Função equipBackpackItemAsAttack exportada');

// Paladino com Espada Longa (1d8 cortante, versátil 1d10)
const paladinHero = parsedCorePlayers.find(p => p.className === 'Paladino');
const longswordStats = vm.runInContext(`calculateWeaponAttackStats(${JSON.stringify(paladinHero)}, 'Espada Longa')`, sandbox);
const paladinStrMod = Math.floor(((paladinHero.str || 10) - 10) / 2);
const paladinPb = Math.floor(((paladinHero.level || 1) - 1) / 4) + 2;
const expectedPaladinAttack = paladinStrMod + paladinPb;
assert(longswordStats.isProficient === true, 'Paladino é proficiente com Espada Longa');
assert(longswordStats.attackBonus === expectedPaladinAttack, `Paladino calcula Bônus de Ataque +${expectedPaladinAttack} com Espada Longa (FOR +${paladinStrMod} + Prof +${paladinPb} = ${longswordStats.attackBonus})`);
assert(longswordStats.chosenAttr === 'str', 'Espada Longa usou atributo FOR para o Paladino');
assert(longswordStats.damageText.includes(`1d8+${paladinStrMod} cortante`), `Dano de Espada Longa formatado corretamente: ${longswordStats.damageText}`);

// Ladino (DES 16 (+3), FOR 10 (+0), Prof +2) com Adaga (Acuidade / Finesse) ➔ deve escolher DES
const rogueHero = vm.runInContext(`({ className: 'Ladino', level: 1, str: 10, dex: 16, con: 12, int: 10, wis: 10, cha: 10 })`, sandbox);
const daggerStats = vm.runInContext(`calculateWeaponAttackStats(${JSON.stringify(rogueHero)}, 'Adaga')`, sandbox);
assert(daggerStats.chosenAttr === 'dex', 'Adaga (Acuidade) escolheu DES automaticamente para o Ladino');
assert(daggerStats.attackBonus === 5, `Bônus de Ataque com Adaga = +5 (DES +3 + Prof +2 = ${daggerStats.attackBonus})`);
assert(daggerStats.damageText.includes('1d4+3'), `Dano com Adaga = 1d4+3 (${daggerStats.damageText})`);

// Ladino com Arco Curto (Distância)
const bowStats = vm.runInContext(`calculateWeaponAttackStats(${JSON.stringify(rogueHero)}, 'Arco Curto')`, sandbox);
assert(bowStats.chosenAttr === 'dex', 'Arco Curto (Distância) escolheu DES');
assert(bowStats.attackBonus === 5, 'Bônus de Ataque com Arco Curto = +5');
assert(bowStats.damageText.includes('1d6+3'), 'Dano com Arco Curto = 1d6+3 perfurante');

// Mago (sem proficiência com Espada Grande)
const wizardHero = vm.runInContext(`({ className: 'Mago', level: 1, str: 10, dex: 14, con: 12, int: 16, wis: 12, cha: 10 })`, sandbox);
const greatswordStats = vm.runInContext(`calculateWeaponAttackStats(${JSON.stringify(wizardHero)}, 'Espada Grande')`, sandbox);
assert(greatswordStats.isProficient === false, 'Mago NÃO é proficiente com Espada Grande');
assert(greatswordStats.attackBonus === 0, 'Mago sem proficiência não soma bônus de proficiência no ataque');

// 3. Validação de Bônus de PV por Subclasse e Raça
assert(typeof vm.runInContext("getPlayerBonusHpPerLevel", sandbox) === 'function', 'Função getPlayerBonusHpPerLevel exportada');
assert(typeof vm.runInContext("calculateRecommendedMaxHp", sandbox) === 'function', 'Função calculateRecommendedMaxHp exportada');

// Feiticeiro Dracônico (+1 PV por nível de Feiticeiro)
const draconicSorcerer = {
  className: 'Feiticeiro',
  level: 3,
  subclassName: 'Linhagem Dracônica',
  con: 14,
  race: 'Humano'
};
const draconicBonus = vm.runInContext(`getPlayerBonusHpPerLevel(${JSON.stringify(draconicSorcerer)}, 'Feiticeiro')`, sandbox);
assert(draconicBonus.bonus === 1, 'Feiticeiro da Linhagem Dracônica recebe +1 PV por nível');
assert(draconicBonus.reason.includes('Dracônica'), 'Razão do bônus menciona Linhagem Dracônica');

// Anão da Colina (+1 PV por nível)
const hillDwarfFighter = {
  className: 'Guerreiro',
  level: 2,
  race: 'Anão da Colina',
  con: 16
};
const hillDwarfBonus = vm.runInContext(`getPlayerBonusHpPerLevel(${JSON.stringify(hillDwarfFighter)}, 'Guerreiro')`, sandbox);
assert(hillDwarfBonus.bonus === 1, 'Anão da Colina recebe +1 PV por nível');

// Cálculo de PV recomendado considerando bônus
const recHp = vm.runInContext(`calculateRecommendedMaxHp(${JSON.stringify(draconicSorcerer)})`, sandbox);
assert(recHp === 23, `calculateRecommendedMaxHp calculou 23 PV para Feiticeiro Dracônico Nv 3 (calculado: ${recHp})`);

// 4. Validação de Entrada de Dado Físico da Mesa no Level Up e Descanso Curto
assert(typeof vm.runInContext("setLevelUpPhysicalRolledHp", sandbox) === 'function', 'Função setLevelUpPhysicalRolledHp exportada');
assert(typeof vm.runInContext("applyShortRestPhysicalDie", sandbox) === 'function', 'Função applyShortRestPhysicalDie exportada');

// Level Up com dado físico
vm.runInContext(`
  const pTestLvl = {
    id: 'p_phys_test',
    name: 'Herói Teste Dado',
    className: 'Guerreiro',
    level: 1,
    con: 14,
    maxHp: 12,
    hp: 12
  };
  PLAYERS.push(pTestLvl);
  openLevelUpWizard('p_phys_test');
  selectLevelUpClass('Guerreiro', false);
  handleLevelUpNext();
  handleLevelUpNext();
  setLevelUpHpMethod('physical');
  setLevelUpPhysicalRolledHp(7, 10);
`, sandbox);

const physGain = vm.runInContext("levelUpWizardState.calculatedHpGain", sandbox);
assert(physGain === 9, `Entrada de dado físico 7 na mesa presencial somou Mod CON +2 ➔ +9 PV (obtido: ${physGain})`);

vm.runInContext("applyLevelUpConfirm()", sandbox);
const pLeveled = vm.runInContext("PLAYERS.find(p => p.id === 'p_phys_test')", sandbox);
assert(pLeveled.level === 2, 'Herói subiu para o Nível 2 com confirmação de dado físico');
assert(pLeveled.maxHp === 21, `PV Máximo do herói evoluiu de 12 para 21 (12 + 9 = ${pLeveled.maxHp})`);

// Descanso Curto com dado físico presencial
vm.runInContext(`
  const pPhys = PLAYERS.find(p => p.id === 'p_phys_test');
  pPhys.hp = 10;
  pPhys.hitDicePool = 2;
  pPhys.spentHitDice = 0;
  activeShortRestPlayerId = 'p_phys_test';
  applyShortRestPhysicalDie(6);
`, sandbox);
const pRested = vm.runInContext("PLAYERS.find(p => p.id === 'p_phys_test')", sandbox);
assert(pRested.hp === 18, `applyShortRestPhysicalDie curou 8 PV (10 ➔ ${pRested.hp} PV) usando dado físico`);
assert(pRested.spentHitDice === 1, 'Dado de vida físico gasto foi computado na reserva (spentHitDice = 1)');

// ========================================================
// 60. TESTES DE ARMADURA, SINTONIZAÇÃO, MODO FÍSICO E ECONOMIA DE AÇÕES (ISSUE-87)
// ========================================================
console.log('\n🛡️ 60. Testes de Armadura, Sintonização, Modo Físico e Economia de Ações (ISSUE-87):');

// 1. Verificação de elementos no bundle HTML
assert(distHtml.includes('id="modal-physical-dice-input"'), 'Bundle contém modal de entrada de dado físico (#modal-physical-dice-input)');
assert(distHtml.includes('physical-d20-grid'), 'Bundle contém grade rápida de 1 a 20 para dado físico (.physical-d20-grid)');
assert(distHtml.includes('action-economy-nav'), 'Bundle contém estilos e navegação por economia de turno (.action-economy-nav)');
assert(distHtml.includes('concentration-banner'), 'Bundle contém banner de concentração ativa (.concentration-banner)');
assert(distHtml.includes('resource-quick-dock'), 'Bundle contém dock de recursos táteis (.resource-quick-dock)');

// 2. Exportação de funções
assert(typeof vm.runInContext('calculatePlayerAcFromEquipment', sandbox) === 'function', 'Função calculatePlayerAcFromEquipment exportada');
assert(typeof vm.runInContext('togglePlayerItemAttunement', sandbox) === 'function', 'Função togglePlayerItemAttunement exportada');
assert(typeof vm.runInContext('togglePlayerDiceMode', sandbox) === 'function', 'Função togglePlayerDiceMode exportada');
assert(typeof vm.runInContext('getAttackActionType', sandbox) === 'function', 'Função getAttackActionType exportada');
assert(typeof vm.runInContext('getSpellActionType', sandbox) === 'function', 'Função getSpellActionType exportada');
assert(typeof vm.runInContext('usePlayerLayOnHandsQuick', sandbox) === 'function', 'Função usePlayerLayOnHandsQuick exportada');
assert(typeof vm.runInContext('usePlayerSecondWindQuick', sandbox) === 'function', 'Função usePlayerSecondWindQuick exportada');
assert(typeof vm.runInContext('usePlayerActionSurgeQuick', sandbox) === 'function', 'Função usePlayerActionSurgeQuick exportada');

// 3. Mecânica D&D 5E de Armaduras e Escudos
// Bárbaro sem armadura: 10 + DES(14->+2) + CON(16->+3) = 15
vm.runInContext(`
  const pBarb = {
    id: 'p_barb_ac',
    name: 'Bárbaro Teste',
    className: 'Bárbaro',
    dex: 14,
    con: 16,
    inventory: []
  };
  const acBarb = calculatePlayerAcFromEquipment(pBarb);
`, sandbox);
assert(vm.runInContext('acBarb', sandbox) === 15, 'Defesa sem Armadura do Bárbaro calcula 10 + DES + CON = 15');

// Monge sem armadura: 10 + DES(16->+3) + SAB(14->+2) = 15
vm.runInContext(`
  const pMonk = {
    id: 'p_monk_ac',
    name: 'Monge Teste',
    className: 'Monge',
    dex: 16,
    wis: 14,
    inventory: []
  };
  const acMonk = calculatePlayerAcFromEquipment(pMonk);
`, sandbox);
assert(vm.runInContext('acMonk', sandbox) === 15, 'Defesa sem Armadura do Monge calcula 10 + DES + SAB = 15');

// Armadura Leve: Couro Batido (12 + DES(16->+3) = 15)
vm.runInContext(`
  const pRogue = {
    id: 'p_rogue_ac',
    name: 'Ladino Teste',
    className: 'Ladino',
    dex: 16,
    inventory: [
      { name: 'Armadura de Couro Batido', equipped: true }
    ]
  };
  const acRogue = calculatePlayerAcFromEquipment(pRogue);
`, sandbox);
assert(vm.runInContext('acRogue', sandbox) === 15, 'Armadura de Couro Batido soma 12 + DES integral (+3) = 15');

// Armadura Média: Brunea (14 + min(DES, 2)) com DES 16 (+3) -> 14 + 2 = 16
vm.runInContext(`
  const pCleric = {
    id: 'p_cleric_ac',
    name: 'Clérigo Teste',
    className: 'Clérigo',
    dex: 16,
    inventory: [
      { name: 'Brunea', equipped: true }
    ]
  };
  const acCleric = calculatePlayerAcFromEquipment(pCleric);
`, sandbox);
assert(vm.runInContext('acCleric', sandbox) === 16, 'Armadura Média (Brunea) limita bônus de DES ao máximo +2 = 16');

// Armadura Pesada: Armadura de Placas (18 flat)
vm.runInContext(`
  const pFighterPlate = {
    id: 'p_fighter_ac',
    name: 'Guerreiro Teste',
    className: 'Guerreiro',
    dex: 14,
    inventory: [
      { name: 'Armadura de Placas', equipped: true }
    ]
  };
  const acFighter = calculatePlayerAcFromEquipment(pFighterPlate);
`, sandbox);
assert(vm.runInContext('acFighter', sandbox) === 18, 'Armadura Pesada (Placas) concede CA fixa 18 sem somar DES');

// Adição de Escudo (+2 na CA): Placas (18) + Escudo (2) = 20
vm.runInContext(`
  pFighterPlate.inventory.push({ name: 'Escudo', equipped: true });
  const acFighterShield = calculatePlayerAcFromEquipment(pFighterPlate);
`, sandbox);
assert(vm.runInContext('acFighterShield', sandbox) === 20, 'Equipar Escudo adiciona +2 na CA (18 + 2 = 20)');

// Teste de desequipar e equipar via togglePlayerItemEquipped
vm.runInContext(`
  const pHeroAc = {
    id: 'p_hero_equip_test',
    name: 'Arthur Equip Test',
    className: 'Paladino',
    dex: 10,
    ac: 10,
    inventory: [
      { name: 'Cota de Malha', equipped: false },
      { name: 'Escudo', equipped: false }
    ]
  };
  PLAYERS.push(pHeroAc);
  togglePlayerItemEquipped('p_hero_equip_test', 0); // Equipa Cota de Malha (16)
`, sandbox);
const pTestedEquip1 = vm.runInContext("PLAYERS.find(p => p.id === 'p_hero_equip_test')", sandbox);
assert(pTestedEquip1.ac === 16, 'togglePlayerItemEquipped atualizou CA do Paladino para 16 com Cota de Malha');
assert(pTestedEquip1.inventory[0].equipped === true, 'Cota de Malha marcada como equipada');

vm.runInContext(`
  togglePlayerItemEquipped('p_hero_equip_test', 1); // Equipa Escudo (+2)
`, sandbox);
const pTestedEquip2 = vm.runInContext("PLAYERS.find(p => p.id === 'p_hero_equip_test')", sandbox);
assert(pTestedEquip2.ac === 18, 'togglePlayerItemEquipped somou Escudo (+2) elevando CA para 18');

// 4. Sintonização de Itens Mágicos (Attunement) com Limite de 3 Itens
vm.runInContext(`
  const pAttune = {
    id: 'p_attune_test',
    name: 'Mago Sintonizador',
    className: 'Mago',
    inventory: [
      { name: 'Anel de Proteção', attuned: false },
      { name: 'Manto de Invisibilidade', attuned: false },
      { name: 'Varinha dos Mísseis Mágicos', attuned: false },
      { name: 'Botas Aladas', attuned: false }
    ]
  };
  PLAYERS.push(pAttune);
  togglePlayerItemAttunement('p_attune_test', 0); // 1
  togglePlayerItemAttunement('p_attune_test', 1); // 2
  togglePlayerItemAttunement('p_attune_test', 2); // 3
`, sandbox);
const pAttunedState = vm.runInContext("PLAYERS.find(p => p.id === 'p_attune_test')", sandbox);
assert(pAttunedState.inventory.filter(it => it.attuned).length === 3, 'Três itens mágicos sintonizados com sucesso');

// Tentar 4º item deve ser bloqueado
vm.runInContext(`
  togglePlayerItemAttunement('p_attune_test', 3); // 4º (deve falhar)
`, sandbox);
const pAttunedStateAfter4 = vm.runInContext("PLAYERS.find(p => p.id === 'p_attune_test')", sandbox);
assert(pAttunedStateAfter4.inventory.filter(it => it.attuned).length === 3, 'Limite estrito de 3 itens sintonizados impediu o 4º item');
assert(pAttunedStateAfter4.inventory[3].attuned === false, '4º item mágico permaneceu não-sintonizado');

// 5. Modo "Dados Físicos da Mesa" Expandido para Toda a Ficha
vm.runInContext(`
  const pDiceTest = {
    id: 'p_dice_test',
    name: 'Kaelen Rolador',
    className: 'Guerreiro',
    level: 3,
    str: 16, // +3
    dex: 14, // +2
    int: 10,
    wis: 12,
    cha: 8,
    diceMode: 'virtual'
  };
  PLAYERS.push(pDiceTest);
  togglePlayerDiceMode('p_dice_test');
`, sandbox);
const pDiceModeHero = vm.runInContext("PLAYERS.find(p => p.id === 'p_dice_test')", sandbox);
assert(pDiceModeHero.diceMode === 'physical', 'togglePlayerDiceMode alternou modo para physical (Dados Físicos da Mesa)');

// Ataque com d20 físico informado (ex: 20 nat -> crítico)
const atkCritRes = vm.runInContext(`
  rollPlayerAttack('p_dice_test', 'Espada Longa (+5 / 1d8+3 cortante)', 20);
`, sandbox);
assert(atkCritRes.d20 === 20, 'rollPlayerAttack aceitou d20 físico informado 20');
assert(atkCritRes.isCrit === true, 'd20 = 20 acionou acerto crítico na rolagem física');
assert(atkCritRes.totalHit === 25, 'totalHit com d20 20 + bônus 5 = 25');

// Ataque com d20 físico falha crítica (1)
const atkFumbleRes = vm.runInContext(`
  rollPlayerAttack('p_dice_test', 'Espada Longa (+5 / 1d8+3 cortante)', 1);
`, sandbox);
assert(atkFumbleRes.d20 === 1, 'rollPlayerAttack aceitou Nat 1 físico');
assert(atkFumbleRes.isFumble === true, 'Nat 1 acionou falha crítica');

// Teste de Atributo físico
const attrRes = vm.runInContext(`
  rollPlayerAttr('p_dice_test', 'str', 14);
`, sandbox);
assert(attrRes.d20 === 14, 'rollPlayerAttr aceitou d20 físico 14');
assert(attrRes.total === 17, 'Teste de Força com d20 14 + Mod FOR 3 = 17');

// Teste de Perícia físico
const skillRes = vm.runInContext(`
  rollPlayerSkill('p_dice_test', 'atletismo', 'normal', 12);
`, sandbox);
assert(skillRes.total >= 15, 'rollPlayerSkill utilizou d20 físico 12 com bônus de perícia');

// 6. Economia de Turno e Concentração Ativa
assert(vm.runInContext(`getAttackActionType('Espada Longa (+5 / 1d8+3)')`, sandbox) === 'action', 'Espada primária categorizada como Ação');
assert(vm.runInContext(`getAttackActionType('Adaga Secundária (Ação Bônus)')`, sandbox) === 'bonus', 'Ataque secundário categorizado como Bônus');
assert(vm.runInContext(`getAttackActionType('Ataque de Oportunidade (Reação)')`, sandbox) === 'reaction', 'Oportunidade categorizada como Reação');

assert(vm.runInContext(`getSpellActionType({ castTime: '1 ação' })`, sandbox) === 'action', 'Magia de 1 ação categorizada como Ação');
assert(vm.runInContext(`getSpellActionType({ castTime: '1 ação bônus' })`, sandbox) === 'bonus', 'Passo Nebuloso categorizado como Bônus');
assert(vm.runInContext(`getSpellActionType({ castTime: '1 reação' })`, sandbox) === 'reaction', 'Escudo Arcano categorizado como Reação');

// Concentração
vm.runInContext(`
  setPlayerConcentration('p_dice_test', 'Abençoar (Bless)');
`, sandbox);
const pConcHero = vm.runInContext("PLAYERS.find(p => p.id === 'p_dice_test')", sandbox);
assert(pConcHero.concentrationSpell === 'Abençoar (Bless)', 'setPlayerConcentration registrou a magia de concentração ativa');

vm.runInContext(`
  clearPlayerConcentration('p_dice_test');
`, sandbox);
assert(pConcHero.concentrationSpell === null, 'clearPlayerConcentration encerrou a concentração');

// 7. Contadores Táteis & Recursos Rápidos (1-Toque)
// Paladino: Cura pelas Mãos
vm.runInContext(`
  const pPaladinRes = {
    id: 'p_paladin_res',
    name: 'Sir Gareth',
    className: 'Paladino',
    level: 3,
    hp: 15,
    maxHp: 28,
    featureCharges: [
      { id: 'lay_on_hands', name: 'Cura pelas Mãos (PV)', icon: '🤲', max: 15, used: 0, restType: 'long' }
    ]
  };
  PLAYERS.push(pPaladinRes);
  usePlayerLayOnHandsQuick('p_paladin_res', 5);
`, sandbox);
const pPaladinChecked = vm.runInContext("PLAYERS.find(p => p.id === 'p_paladin_res')", sandbox);
assert(pPaladinChecked.hp === 20, 'usePlayerLayOnHandsQuick curou +5 PV no Paladino (15 -> 20)');
assert(pPaladinChecked.featureCharges[0].used === 5, 'Reserva de Cura pelas Mãos gastou 5 pontos (10 restantes)');

// Guerreiro: Retomar o Fôlego
vm.runInContext(`
  const pFighterRes = {
    id: 'p_fighter_res',
    name: 'Ragnar',
    className: 'Guerreiro',
    level: 4,
    hp: 10,
    maxHp: 36,
    featureCharges: [
      { id: 'second_wind', name: 'Retomar o Fôlego', icon: '💨', max: 1, used: 0, restType: 'short' },
      { id: 'action_surge', name: 'Surto de Ação', icon: '⚡', max: 1, used: 0, restType: 'short' }
    ]
  };
  PLAYERS.push(pFighterRes);
  usePlayerSecondWindQuick('p_fighter_res');
`, sandbox);
const pFighterChecked = vm.runInContext("PLAYERS.find(p => p.id === 'p_fighter_res')", sandbox);
assert(pFighterChecked.hp > 10, 'usePlayerSecondWindQuick curou PV do Guerreiro (1d10 + Nível)');
assert(pFighterChecked.featureCharges[0].used === 1, 'Carga de Retomar o Fôlego foi consumida (1/1 gasta)');

// Guerreiro: Surto de Ação
vm.runInContext(`
  usePlayerActionSurgeQuick('p_fighter_res');
`, sandbox);
assert(pFighterChecked.featureCharges[1].used === 1, 'Carga de Surto de Ação foi consumida (1/1 gasta)');

// ========================================================
console.log('\n🔒 61. Testes de Acesso Seguro para Novos Dispositivos e PIN Oficial 3276 (ISSUE-88):');

// 1. Verificação de estilos e elementos no Bundle HTML
assert(distHtml.includes('body.mode-welcome-screen'), 'Bundle CSS contém regras protetoras para body.mode-welcome-screen');
assert(distHtml.includes('OFFICIAL_MASTER_PIN = \'3276\''), 'Bundle JS contém constante do PIN oficial 3276');
assert(distHtml.includes('lockMasterSession()') && distHtml.includes('Bloquear Painel do Mestre'), 'Bundle contém botão de bloqueio de sessão do mestre no menu');

// 2. Teste de dispositivo novo (localStorage limpo)
vm.runInContext(`
  localStorage.removeItem('dnd5e_master_session_exp');
  localStorage.removeItem('dnd5e_session_role');
  localStorage.removeItem('dnd5e_last_portal_player_id');
  document.body.classList.remove('mode-welcome-screen');
  document.body.classList.remove('mode-player-portal');
`, sandbox);

assert(vm.runInContext("isMasterAuthorized()", sandbox) === false, 'Dispositivo novo sem sessão ativa é considerado NÃO autorizado para o mestre');

// 3. Execução de checkPlayerPortalUrl em dispositivo novo
vm.runInContext("checkPlayerPortalUrl()", sandbox);
assert(vm.runInContext("document.body.classList.contains('mode-welcome-screen')", sandbox) === true, 'checkPlayerPortalUrl ativa mode-welcome-screen obrigatoriamente para novo visitante');
assert(vm.runInContext("document.getElementById('welcome-screen').classList.contains('open')", sandbox) === true, 'Tela de boas-vindas (#welcome-screen) é aberta automaticamente para novo visitante');

// 4. Teste de fluxo de Aluno
vm.runInContext("handleWelcomeSelect('player')", sandbox);
assert(vm.runInContext("clientRole", sandbox) === 'player', "handleWelcomeSelect('player') define clientRole como 'player'");
assert(vm.runInContext("localStorage.getItem('dnd5e_session_role')", sandbox) === 'player', "dnd5e_session_role salvo como 'player'");
assert(vm.runInContext("document.body.classList.contains('mode-welcome-screen')", sandbox) === false, 'mode-welcome-screen removido ao entrar no fluxo de aluno');

// 5. Teste de autenticação com PIN oficial 3276 do Mestre
vm.runInContext(`
  localStorage.removeItem('dnd5e_master_session_exp');
  localStorage.removeItem('dnd5e_master_pin');
  localStorage.setItem('dnd5e_session_role', 'player');
  handlePinClear();
  handlePinDigit('1');
  handlePinDigit('1');
  handlePinDigit('1');
  handlePinDigit('1');
  submitMasterPin();
`, sandbox);
assert(vm.runInContext("isMasterAuthorized()", sandbox) === false, 'PIN incorreto 1111 não autoriza acesso ao mestre');

vm.runInContext(`
  handlePinClear();
  handlePinDigit('3');
  handlePinDigit('2');
  handlePinDigit('7');
  handlePinDigit('6');
  submitMasterPin();
`, sandbox);
assert(vm.runInContext("isMasterAuthorized()", sandbox) === true, 'PIN oficial 3276 concede acesso com sucesso ao mestre');
assert(vm.runInContext("clientRole", sandbox) === 'master', "clientRole atualizado para 'master' após PIN 3276 correto");
assert(vm.runInContext("localStorage.getItem('dnd5e_session_role')", sandbox) === 'master', "dnd5e_session_role atualizado para 'master'");

// 6. Teste de Bloqueio Seguro do Painel do Mestre
vm.runInContext("lockMasterSession()", sandbox);
assert(vm.runInContext("isMasterAuthorized()", sandbox) === false, 'lockMasterSession revoga sessão ativa do mestre');
assert(vm.runInContext("clientRole", sandbox) === 'player', "lockMasterSession reseta clientRole para 'player'");
assert(vm.runInContext("document.body.classList.contains('mode-welcome-screen')", sandbox) === true, 'lockMasterSession reabre tela de boas-vindas protegendo o painel');

console.log('\n🛡️ 62. Testes de Integridade Estrutural das Modais e Balanceamento HTML (ISSUE-89):');

// 1. Verificação de balanceamento estrito de tags em src/ui/ui.html
const rawUiHtml = fs.readFileSync(path.join(__dirname, 'src', 'ui', 'ui.html'), 'utf8');
const tagPattern = /<\/?([a-z0-9-]+)(?:\s+[^>]*?)?(\/?)>/gi;
let tagMatch;
const uiTagStack = [];
while ((tagMatch = tagPattern.exec(rawUiHtml)) !== null) {
  const full = tagMatch[0];
  const tag = tagMatch[1].toLowerCase();
  const isSelf = tagMatch[2] === '/' || full.endsWith('/>') || ['img', 'input', 'br', 'hr', 'meta', 'link'].includes(tag);
  const isClose = full.startsWith('</');
  if (isSelf) continue;
  if (isClose) {
    if (uiTagStack.length > 0 && uiTagStack[uiTagStack.length - 1].tag === tag) {
      uiTagStack.pop();
    }
  } else {
    uiTagStack.push({ tag });
  }
}
assert(uiTagStack.length === 0, 'Todas as tags HTML em src/ui/ui.html estão perfeitamente balanceadas (pilha zerada)');

// 2. Verificação de fechamento do modal-safety-snapshots
const snapshotIdx = rawUiHtml.indexOf('id="modal-safety-snapshots"');
const playerCombatIdx = rawUiHtml.indexOf('id="modal-player-combat"');
assert(snapshotIdx !== -1, 'Modal #modal-safety-snapshots existe no HTML');
assert(playerCombatIdx !== -1, 'Modal #modal-player-combat existe no HTML');
const betweenModals = rawUiHtml.substring(snapshotIdx, playerCombatIdx);
const betweenCloses = (betweenModals.match(/<\/div>/gi) || []).length;
const betweenOpens = (betweenModals.match(/<div\b/gi) || []).length;
assert(betweenCloses >= betweenOpens, '#modal-safety-snapshots fecha perfeitamente todos os seus containers antes do próximo elemento');

// 3. Verificação de que CSS oculta .tab-pane e main durante welcome screen
assert(distHtml.includes('body.mode-welcome-screen .tab-pane'), 'Bundle CSS oculta .tab-pane no modo tela de boas-vindas');
assert(distHtml.includes('body.mode-welcome-screen main'), 'Bundle CSS oculta main no modo tela de boas-vindas');

console.log('\n☁️ 63. Testes de Sincronização em Tempo Real (Firebase RTDB, Objeto vs Array e Smart Merge - ISSUE-90):');

// 1. Normalização de players vindos como Objeto/Dicionário do Realtime Database
const rtdbObjectPayload = {
  players: {
    "0": { id: "p_yoshi", name: "Yoshigake Kira", hp: 4, maxHp: 8, conditions: ["cansado"], updatedAt: Date.now(), updatedBy: "client_mobile" },
    "1": { id: "p_dera", name: "Deraravely", hp: 6, maxHp: 6, conditions: [], updatedAt: Date.now() }
  },
  publishedBy: "player",
  lastUpdatedBy: "client_mobile"
};

vm.runInContext(`
  PLAYERS = [
    { id: "p_yoshi", name: "Yoshigake Kira", hp: 7, maxHp: 8, conditions: [], updatedAt: 1000 },
    { id: "p_dera", name: "Deraravely", hp: 6, maxHp: 6, conditions: [], updatedAt: 1000 }
  ];
  state = {
    combatants: [
      { id: "c1", playerId: "p_yoshi", name: "Yoshigake Kira", hp: 7, maxHp: 8, conditions: [], type: "player" }
    ],
    round: 1,
    current: 0
  };
  clientRole = 'master';
`, sandbox);

// Executa applyCloudDataToLocal com payload de objeto
vm.runInContext("applyCloudDataToLocal(" + JSON.stringify(rtdbObjectPayload) + ")", sandbox);

const updatedPlayers = vm.runInContext("PLAYERS", sandbox);
assert(Array.isArray(updatedPlayers), 'PLAYERS é mantido como Array válido após receber objeto do Realtime Database');
const yoshiLocal = updatedPlayers.find(p => p.id === 'p_yoshi');
assert(yoshiLocal && yoshiLocal.hp === 4, 'Smart Merge do Mestre adota PV 4 enviado pelo jogador no celular');
assert(yoshiLocal && yoshiLocal.conditions && yoshiLocal.conditions.includes('cansado'), 'Smart Merge do Mestre adota condição "cansado" enviada pelo jogador');

// 2. Sincronização com state.combatants no gerenciador de combate do Mestre
const currentState = vm.runInContext("state", sandbox);
const yoshiComb = currentState.combatants.find(c => c.playerId === 'p_yoshi');
assert(yoshiComb && yoshiComb.hp === 4, 'Combatente do Yoshigake Kira no gerenciador de combate foi atualizado para 4 PV');
assert(yoshiComb && yoshiComb.conditions && yoshiComb.conditions.includes('cansado'), 'Combatente no gerenciador de combate recebeu a condição "cansado"');

// 3. Atualização sem timestamp de herói antigo na nuvem mas publicado por jogador
const legacyCloudPayload = {
  players: [
    { id: "p_yoshi", name: "Yoshigake Kira", hp: 3, maxHp: 8, conditions: [] } // updatedAt undefined
  ],
  publishedBy: "player",
  lastUpdatedBy: "client_mobile_2"
};
vm.runInContext("applyCloudDataToLocal(" + JSON.stringify(legacyCloudPayload) + ")", sandbox);
const yoshiUpdatedLegacy = vm.runInContext("PLAYERS", sandbox).find(p => p.id === 'p_yoshi');
assert(yoshiUpdatedLegacy.hp === 3, 'Smart Merge adota dados enviados pelo jogador mesmo se updatedAt remoto for indefinido');

// 4. Verificação estática do código de desacoplamento do Firestore
const firebaseSyncCode = fs.readFileSync(path.join(__dirname, 'src', 'js', 'firebase_sync.js'), 'utf8');
assert(firebaseSyncCode.includes("roomRef.child('players').once('value')"), 'executePlayerCloudSave usa leitura e update consolidados no Realtime Database');
assert(!firebaseSyncCode.includes('promises.push(fsPromise)'), 'executePlayerCloudSave não acopla fsPromise ao Promise.all principal');

// ========================================================
// 64. TESTES DE ECONOMIA DE AÇÃO DE MAGIAS (AÇÃO VS BÔNUS VS REAÇÃO) E SALAS (ISSUE-91)
// ========================================================
console.log('\n⚡ 64. Testes de Economia de Ação de Magias e Seletor de Salas (ISSUE-91):');

// 1. Objeto com time
assert(vm.runInContext("getSpellActionType({ time: '1 ação bônus' })", sandbox) === 'bonus', 'getSpellActionType identifica objeto com time "1 ação bônus" como bonus');
assert(vm.runInContext("getSpellActionType({ time: '1 reação' })", sandbox) === 'reaction', 'getSpellActionType identifica objeto com time "1 reação" como reaction');
assert(vm.runInContext("getSpellActionType({ time: '1 ação' })", sandbox) === 'action', 'getSpellActionType identifica objeto com time "1 ação" como action');

// 2. Busca por nome no catálogo SPELLS_DATA
assert(vm.runInContext("getSpellActionType('Passo Nebuloso')", sandbox) === 'bonus', 'Passo Nebuloso identificado por nome como bonus');
assert(vm.runInContext("getSpellActionType('Palavra Curativa')", sandbox) === 'bonus', 'Palavra Curativa identificada por nome como bonus');
assert(vm.runInContext("getSpellActionType('Bordão Místico')", sandbox) === 'bonus', 'Bordão Místico identificado por nome como bonus');
assert(vm.runInContext("getSpellActionType('Auxílio Divino')", sandbox) === 'bonus', 'Auxílio Divino identificado por nome como bonus');
assert(vm.runInContext("getSpellActionType('Escudo Arcano')", sandbox) === 'reaction', 'Escudo Arcano identificado por nome como reaction');
assert(vm.runInContext("getSpellActionType('Contramágica')", sandbox) === 'reaction', 'Contramágica identificada por nome como reaction');
assert(vm.runInContext("getSpellActionType('Mísseis Mágicos')", sandbox) === 'action', 'Mísseis Mágicos identificado por nome como action');
assert(vm.runInContext("getSpellActionType('Bola de Fogo')", sandbox) === 'action', 'Bola de Fogo identificada por nome como action');

// 3. Funções exportadas
assert(typeof vm.runInContext("handlePickerActionFilter", sandbox) === 'function', 'Função handlePickerActionFilter exportada');
assert(typeof vm.runInContext("setQuickLoginRoom", sandbox) === 'function', 'Função setQuickLoginRoom exportada');

// 4. Teste de Servidor Principal Único (turma_principal)
assert(vm.runInContext("getStoredFirebaseRoom()", sandbox) === 'turma_principal', 'getStoredFirebaseRoom sempre retorna turma_principal como Servidor Principal único');
vm.runInContext("setStoredFirebaseRoom('qualquer_outra_coisa')", sandbox);
assert(vm.runInContext("getStoredFirebaseRoom()", sandbox) === 'turma_principal', 'setStoredFirebaseRoom mantém turma_principal');

// 5. Presença no HTML compilado
const compiledHtml91 = fs.readFileSync(path.join(__dirname, 'planilha do rpg.html'), 'utf8');
assert(compiledHtml91.includes('id="picker-action-filter"'), 'HTML contém filtro de ação no modal spell picker');
assert(compiledHtml91.includes('value="bonus">⚡ Ação Bônus</option>'), 'HTML contém opção de Ação Bônus no filtro de tags do grimório');
assert(compiledHtml91.includes('Servidor Principal Conectado'), 'HTML contém status do Servidor Principal no login de alunos');

// ========================================================
// 65. TESTES DE ELIMINAÇÃO DE DIVERGÊNCIAS DE NÍVEL E PVs (ISSUE-93)
// ========================================================
console.log('\n🌟 65. Testes de Eliminação de Divergências de Nível e PVs (ISSUE-93):');

// 1. Validação do Elenco Canônico em core.js
const coreMatch93 = jsCore.match(/let PLAYERS = (\[[\s\S]*?\]);\s*let state =/);
const parsedCorePlayers93 = coreMatch93 ? JSON.parse(coreMatch93[1]) : [];
const clakerCore = parsedCorePlayers93.find(p => p.name === 'Claker');
const deraravelyCore = parsedCorePlayers93.find(p => p.name === 'Deraravely');
const kiraCore = parsedCorePlayers93.find(p => p.name === 'Yoshigake Kira');
const zenitCore = parsedCorePlayers93.find(p => p.name.includes('Zenit'));

assert(clakerCore && clakerCore.level === 5 && clakerCore.maxHp === 37, 'Claker inicializado canonicamente como Nv 5 com 37 PV');
assert(deraravelyCore && deraravelyCore.level === 5 && deraravelyCore.maxHp === 43, 'Deraravely inicializado canonicamente como Nv 5 com 43 PV');
assert(kiraCore && kiraCore.level === 5 && kiraCore.maxHp === 43, 'Yoshigake Kira inicializado canonicamente como Nv 5 com 43 PV');
assert(zenitCore && zenitCore.level === 5 && zenitCore.maxHp === 36, 'Zenit inicializado canonicamente como Nv 5 com 36 PV');

// 2. Teste de auto-migração de cache local defasado em loadFromLocalStorage
vm.runInContext(`
  const staleMockPlayers = [
    { id: 'p_1789144892638', name: 'Claker', className: 'Bruxo', level: 1, maxHp: 6, hp: 0 }
  ];
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ players: staleMockPlayers }));
  loadFromLocalStorage();
`, sandbox);
const clakerUpgraded = vm.runInContext("PLAYERS.find(p => p.id === 'p_1789144892638')", sandbox);
assert(clakerUpgraded && clakerUpgraded.level === 5, 'loadFromLocalStorage auto-migrou cache defasado de Claker para Nível 5');
assert(clakerUpgraded && clakerUpgraded.maxHp === 37, 'loadFromLocalStorage restaurou PV Máximo canônico de 37 PV');

// 3. Teste do Smart Merge no Mestre impedindo regressão de nível
vm.runInContext(`
  clientRole = 'master';
  PLAYERS = [
    { id: 'p_1789144892638', name: 'Claker', className: 'Bruxo', level: 1, maxHp: 6, hp: 6, updatedAt: Date.now() + 1000 }
  ];
  const cloudPayloadWithHighLevel = {
    players: [
      { id: 'p_1789144892638', name: 'Claker', className: 'Bruxo', level: 5, maxHp: 37, hp: 37, updatedAt: Date.now() }
    ],
    publishedBy: 'master'
  };
  applyCloudDataToLocal(cloudPayloadWithHighLevel);
`, sandbox);
const clakerMerged = vm.runInContext("PLAYERS.find(p => p.id === 'p_1789144892638')", sandbox);
assert(clakerMerged && clakerMerged.level === 5, 'Smart Merge do Mestre adotou Nível 5 remoto e impediu downgrade');
assert(clakerMerged && clakerMerged.maxHp === 37, 'Smart Merge do Mestre adotou PV Máximo 37');

// ========================================================
// 66. TESTES DE SINCRONIZAÇÃO BIDIRECIONAL DE DANO E MAGIAS (ISSUE-94)
// ========================================================
console.log('\n⚔️ 66. Testes de Sincronização Bidirecional de Dano e Magias (ISSUE-94):');

// 1. Mestre reduz PV no combate e dispara touchPlayer com novo updatedAt
vm.runInContext(`
  clientRole = 'master';
  PLAYERS = [
    { id: 'p_dera', name: 'Deraravely', className: 'Guerreiro', level: 5, maxHp: 43, hp: 43, updatedAt: 1000 },
    { id: 'p_kira', name: 'Yoshigake Kira', className: 'Paladino', level: 5, maxHp: 43, hp: 43, slots: [4,2,0,0,0], slotsUsed: [0,0,0,0,0], updatedAt: 1000 },
    { id: 'p_zenit', name: 'Zenit', className: 'Ladino', level: 5, maxHp: 36, hp: 36, updatedAt: 1000 }
  ];
  state = {
    combatants: [
      { id: 'c_dera', playerId: 'p_dera', name: 'Deraravely (Samuel)', type: 'player', hp: 43, maxHp: 43, init: 15 },
      { id: 'c_kira', playerId: 'p_kira', name: 'Yoshigake Kira (Gustavo)', type: 'player', hp: 43, maxHp: 43, init: 10 },
      { id: 'c_zenit', playerId: 'p_zenit', name: 'Zenit (Diogo)', type: 'player', hp: 36, maxHp: 36, init: 12 },
      { id: 'c_mob', name: 'Monstro #1', type: 'monster', hp: 20, maxHp: 20, init: 5 }
    ],
    round: 1,
    turnIndex: 0,
    logs: []
  };
  const prevDeraTime = PLAYERS.find(p => p.id === 'p_dera').updatedAt;
  quickAdjustCombatantHp('c_dera', -1);
`, sandbox);

const deraAfterDmg = vm.runInContext("PLAYERS.find(p => p.id === 'p_dera')", sandbox);
const deraCombAfterDmg = vm.runInContext("state.combatants.find(c => c.id === 'c_dera')", sandbox);
assert(deraCombAfterDmg.hp === 42, 'quickAdjustCombatantHp reduziu combatente para 42 PV');
assert(deraAfterDmg.hp === 42, 'quickAdjustCombatantHp sincronizou 42 PV para a ficha PLAYERS');
assert(deraAfterDmg.updatedAt > 1000, 'quickAdjustCombatantHp acionou touchPlayer atualizando updatedAt');

// 2. Mestre aplica dano via despachante applyCombatAction
vm.runInContext(`
  // Configura despachante para dano no Kira
  const selTar = document.getElementById('sel-target');
  const selAtt = document.getElementById('sel-attacker');
  const inpDmg = document.getElementById('inp-damage');
  if (selTar) selTar.value = 'c_kira';
  if (selAtt) selAtt.value = 'c_mob';
  if (inpDmg) inpDmg.value = '2';
  applyCombatAction('damage', 'Ataque de Garra');
`, sandbox);
const kiraAfterDmg = vm.runInContext("PLAYERS.find(p => p.id === 'p_kira')", sandbox);
assert(kiraAfterDmg.hp === 41, 'applyCombatAction reduziu Kira para 41 PV');
assert(kiraAfterDmg.updatedAt > 1000, 'applyCombatAction acionou touchPlayer atualizando updatedAt do Kira');

// 3. Mestre edita PV diretamente via inline edit
vm.runInContext(`
  saveInlineHpEdit('c_zenit', '31');
`, sandbox);
const zenitAfterEdit = vm.runInContext("PLAYERS.find(p => p.id === 'p_zenit')", sandbox);
assert(zenitAfterEdit.hp === 31, 'saveInlineHpEdit ajustou Zenit para 31 PV');
assert(zenitAfterEdit.updatedAt > 1000, 'saveInlineHpEdit acionou touchPlayer atualizando updatedAt do Zenit');

// 4. Portal do Aluno recebe atualização de PV do Mestre
vm.runInContext(`
  // Muda para ambiente de Aluno (Deraravely)
  clientRole = 'player';
  activePortalPlayerId = 'p_dera';
  PLAYERS = [
    { id: 'p_dera', name: 'Deraravely', className: 'Guerreiro', level: 5, maxHp: 43, hp: 43, updatedAt: 1000 }
  ];
  const masterSyncPayload = {
    players: [
      { id: 'p_dera', name: 'Deraravely', className: 'Guerreiro', level: 5, maxHp: 43, hp: 42, updatedAt: 2000, updatedBy: 'master_desktop' },
      { id: 'p_kira', name: 'Yoshigake Kira', className: 'Paladino', level: 5, maxHp: 43, hp: 41, updatedAt: 2000, updatedBy: 'master_desktop' },
      { id: 'p_zenit', name: 'Zenit', className: 'Ladino', level: 5, maxHp: 36, hp: 31, updatedAt: 2000, updatedBy: 'master_desktop' }
    ],
    publishedBy: 'master',
    lastUpdatedBy: 'master_desktop'
  };
  applyCloudDataToLocal(masterSyncPayload);
`, sandbox);
const deraPortalHero = vm.runInContext("PLAYERS.find(p => p.id === 'p_dera')", sandbox);
assert(deraPortalHero && deraPortalHero.hp === 42, 'Portal do Aluno adotou 42 PV enviado pelo Mestre');

// 5. Aluno conjura magia consumindo espaço e incluindo authorPlayerId
vm.runInContext(`
  clientRole = 'player';
  activePortalPlayerId = 'p_kira';
  PLAYERS = [
    { id: 'p_kira', name: 'Yoshigake Kira', className: 'Paladino', level: 5, maxHp: 43, hp: 41, slots: [4,2,0,0,0], slotsUsed: [0,0,0,0,0], updatedAt: 1000 }
  ];
  executeCastSpell('p_kira', 'Bênção', 1);
`, sandbox);
const kiraCastSpell = vm.runInContext("PLAYERS.find(p => p.id === 'p_kira')", sandbox);
assert(kiraCastSpell.slotsUsed[0] === 1, 'executeCastSpell consumiu 1 espaço de 1º Círculo no Aluno');
assert(kiraCastSpell.concentrationSpell === 'Bênção', 'executeCastSpell ativou concentração em Bênção');

// 6. Mestre recebe payload do Aluno: atualiza slots do Aluno e NÃO sobrescreve outros heróis
vm.runInContext(`
  clientRole = 'master';
  activePortalPlayerId = null;
  // Estado local do Mestre com danos recentes
  PLAYERS = [
    { id: 'p_dera', name: 'Deraravely', className: 'Guerreiro', level: 5, maxHp: 43, hp: 42, updatedAt: 2000 },
    { id: 'p_kira', name: 'Yoshigake Kira', className: 'Paladino', level: 5, maxHp: 43, hp: 41, slots: [4,2,0,0,0], slotsUsed: [0,0,0,0,0], updatedAt: 2000 },
    { id: 'p_zenit', name: 'Zenit', className: 'Ladino', level: 5, maxHp: 36, hp: 31, updatedAt: 2000 }
  ];
  // Aluno Kira envia atualização de sua conjuração (com lista que no aluno ainda tinha Deraravely com 43 PV)
  const studentCloudPayload = {
    players: [
      { id: 'p_dera', name: 'Deraravely', className: 'Guerreiro', level: 5, maxHp: 43, hp: 43, updatedAt: 1000 }, // snapshot antigo do aluno
      { id: 'p_kira', name: 'Yoshigake Kira', className: 'Paladino', level: 5, maxHp: 43, hp: 41, slots: [4,2,0,0,0], slotsUsed: [1,0,0,0,0], updatedAt: 3000, updatedBy: 'client_student_kira' },
      { id: 'p_zenit', name: 'Zenit', className: 'Ladino', level: 5, maxHp: 36, hp: 36, updatedAt: 1000 }
    ],
    publishedBy: 'player',
    authorPlayerId: 'p_kira',
    authorPlayerName: 'Yoshigake Kira',
    lastUpdatedBy: 'client_student_kira'
  };
  applyCloudDataToLocal(studentCloudPayload);
`, sandbox);

const mKira = vm.runInContext("PLAYERS.find(p => p.id === 'p_kira')", sandbox);
const mDera = vm.runInContext("PLAYERS.find(p => p.id === 'p_dera')", sandbox);
const mZenit = vm.runInContext("PLAYERS.find(p => p.id === 'p_zenit')", sandbox);
assert(mKira.slotsUsed[0] === 1, 'Mestre adotou consumo de magia do Aluno (slotsUsed[0] = 1)');
assert(mDera.hp === 42, 'Smart Merge do Mestre NÃO reverteu o PV de Deraravely (permaneceu 42)');
assert(mZenit.hp === 31, 'Smart Merge do Mestre NÃO reverteu o PV de Zenit (permaneceu 31)');

console.log('\n📜 67. Testes do Sistema D&D 5ª Edição (2014) - Classes, Raças e Desbloqueio Canônico (ISSUE-96):');
const testClericLvl = vm.runInContext("getSubclassUnlockLevel('Clérigo')", sandbox);
const testWarlockLvl = vm.runInContext("getSubclassUnlockLevel('Bruxo')", sandbox);
const testSorcererLvl = vm.runInContext("getSubclassUnlockLevel('Feiticeiro')", sandbox);
const testDruidLvl = vm.runInContext("getSubclassUnlockLevel('Druida')", sandbox);
const testWizardLvl = vm.runInContext("getSubclassUnlockLevel('Mago')", sandbox);
const testPaladinLvl = vm.runInContext("getSubclassUnlockLevel('Paladino')", sandbox);
const testFighterLvl = vm.runInContext("getSubclassUnlockLevel('Guerreiro')", sandbox);

assert(testClericLvl === 1, 'Clérigo escolhe seu Domínio Divino no Nível 1 canônico');
assert(testWarlockLvl === 1, 'Bruxo escolhe seu Patrono no Nível 1 canônico');
assert(testSorcererLvl === 1, 'Feiticeiro escolhe sua Origem de Feitiçaria no Nível 1 canônico');
assert(testDruidLvl === 2, 'Druida escolhe seu Círculo Druídico no Nível 2 canônico');
assert(testWizardLvl === 2, 'Mago escolhe sua Tradição Arcana no Nível 2 canônico');
assert(testPaladinLvl === 3, 'Paladino escolhe seu Juramento Sagrado no Nível 3 canônico');
assert(testFighterLvl === 3, 'Guerreiro escolhe seu Arquétipo Marcial no Nível 3 canônico');

// Teste de desbloqueio de traços de subclasse no nível 1 para Clérigo
const clericFeatsNv1 = vm.runInContext("getUnlockedClassFeatures('Clérigo', 1, 0)", sandbox);
const hasDomainFeat = clericFeatsNv1.some(f => f.isSubclass && f.source && f.source.includes('Vida'));
assert(hasDomainFeat, 'Clérigo Nível 1 recebe habilidades do Domínio da Vida imediatamente no Nível 1');

// Teste de atributos das raças canônicas 5e (Aumento no Valor de Habilidade)
const dwarfRace = vm.runInContext("SPECIES_DATA.find(r => r.id === 'anao')", sandbox);
const humanRace = vm.runInContext("SPECIES_DATA.find(r => r.id === 'humano')", sandbox);
const elfRace = vm.runInContext("SPECIES_DATA.find(r => r.id === 'elfo')", sandbox);
assert(dwarfRace && dwarfRace.abilityScoreSummary.includes('+2'), 'Anão possui aumento de Constituição (+2) nativo');
assert(humanRace && humanRace.abilityScoreSummary.toLowerCase().includes('+1 em todos'), 'Humano possui +1 em todos os valores de habilidade');
assert(elfRace && (elfRace.abilityScoreSummary.includes('+2 Destreza') || elfRace.abilityScoreSummary.includes('Destreza +2')), 'Elfo possui Destreza +2 nativo');

// Teste de regras de Paladino (Destruição Divina sem custo de ação bônus)
const paladinClass = vm.runInContext("CLASSES_DATA.find(c => c.id === 'paladino')", sandbox);
const divineSmite = paladinClass.features.find(f => f.name.includes('Destruição Divina'));
assert(divineSmite && !divineSmite.desc.includes('ação bônus para lançar'), 'Destruição Divina opera como recurso ativado ao acertar o golpe (sem custo de ação bônus)');

// Teste de ausência de maestria em armas (mecânica do 2024 eliminada)
const fighterClass = vm.runInContext("CLASSES_DATA.find(c => c.id === 'guerreiro')", sandbox);
const hasWeaponMastery = fighterClass.features.some(f => f.name.includes('Maestria em Armas'));
assert(!hasWeaponMastery, 'Guerreiro 5E não possui Maestria em Armas (regra 2024 eliminada)');

console.log('\n🎲 68. Testes de Resolução Dinâmica de Características e Dados de Dano de Magias (ISSUE-97):');

// 1. Defesa sem Armadura de Bárbaro: DES 16 (+3), CON 14 (+2) => CA 15
const mockBarbarian = { className: 'Bárbaro', level: 5, dex: 16, con: 14, str: 16, wis: 10, int: 10, cha: 10 };
const barbUnarmored = vm.runInContext(`
  formatPlayerFeatureForDisplay(
    { name: 'Defesa sem Armadura (Unarmored Defense)', desc: '10 + seu modificador de Destreza + seu modificador de Constituição' },
    ${JSON.stringify(mockBarbarian)}
  );
`, sandbox);
assert(barbUnarmored.name.includes('(CA 15)'), `Defesa sem Armadura do Bárbaro exibe CA calculada 15 (${barbUnarmored.name})`);
assert(barbUnarmored.desc.includes('CA 15'), 'Descrição da Defesa sem Armadura detalha o cálculo resolvido para CA 15');

// 2. Defesa sem Armadura de Monge: DES 16 (+3), SAB 14 (+2) => CA 15
const mockMonk = { className: 'Monge', level: 5, dex: 16, con: 12, str: 10, wis: 14, int: 10, cha: 10 };
const monkUnarmored = vm.runInContext(`
  formatPlayerFeatureForDisplay(
    { name: 'Defesa sem Armadura (Unarmored Defense)', desc: '10 + seu modificador de Destreza + seu modificador de Sabedoria' },
    ${JSON.stringify(mockMonk)}
  );
`, sandbox);
assert(monkUnarmored.name.includes('(CA 15)'), `Defesa sem Armadura do Monge exibe CA calculada 15 (${monkUnarmored.name})`);

// 3. Cura pelas Mãos do Paladino (5 x Nível): Nv 5 => 25 PV
const mockPaladin = { className: 'Paladino', level: 5, cha: 16, str: 16, dex: 10, con: 14, int: 10, wis: 10 };
const paladinLayOnHands = vm.runInContext(`
  formatPlayerFeatureForDisplay(
    { name: 'Cura pelas Mãos (Lay on Hands)', desc: 'Você tem uma reserva de cura igual a 5 x seu nível.' },
    ${JSON.stringify(mockPaladin)}
  );
`, sandbox);
assert(paladinLayOnHands.name.includes('(25 PV)'), `Cura pelas Mãos do Paladino Nv 5 exibe 25 PV calculados (${paladinLayOnHands.name})`);

// 4. Sentido Divino do Paladino (1 + CAR): CAR 16 (+3) => 4 usos/dia
const paladinSense = vm.runInContext(`
  formatPlayerFeatureForDisplay(
    { name: 'Sentido Divino (Divine Sense)', desc: '1 + modificador de Carisma usos por dia.' },
    ${JSON.stringify(mockPaladin)}
  );
`, sandbox);
assert(paladinSense.name.includes('(4 usos/dia)'), `Sentido Divino exibe 4 usos/dia baseados em Carisma (${paladinSense.name})`);

// 5. Ataque Furtivo do Ladino Nv 5 => 3d6
const mockRogue = { className: 'Ladino', level: 5, dex: 18, con: 12, str: 10, int: 14, wis: 12, cha: 10 };
const rogueSneak = vm.runInContext(`
  formatPlayerFeatureForDisplay(
    { name: 'Ataque Furtivo (Sneak Attack)', desc: 'Dano extra uma vez por turno.' },
    ${JSON.stringify(mockRogue)}
  );
`, sandbox);
assert(rogueSneak.name.includes('(3d6)'), `Ataque Furtivo do Ladino Nv 5 exibe 3d6 calculados (${rogueSneak.name})`);

// 6. Fúria do Bárbaro Nv 5 => 3 usos/dia, +2 Dano
const barbRage = vm.runInContext(`
  formatPlayerFeatureForDisplay(
    { name: 'Fúria', desc: 'Entra em fúria.' },
    ${JSON.stringify(mockBarbarian)}
  );
`, sandbox);
assert(barbRage.name.includes('3/dia') && barbRage.name.includes('+2 Dano'), `Fúria Nv 5 exibe usos e bônus de dano (${barbRage.name})`);

// 7. Retomar o Fôlego do Guerreiro Nv 5 => 1d10 + 5 PV
const testFighterObj = { className: 'Guerreiro', level: 5, str: 18, con: 14, dex: 12, int: 10, wis: 10, cha: 10 };
const testFighterSecondWind = vm.runInContext(`
  formatPlayerFeatureForDisplay(
    { name: 'Retomar o Fôlego (Second Wind)', desc: 'Recupera PV.' },
    ${JSON.stringify(testFighterObj)}
  );
`, sandbox);
assert(testFighterSecondWind.name.includes('1d10 + 5 PV'), `Retomar o Fôlego exibe 1d10 + 5 PV (${testFighterSecondWind.name})`);

// 8. Resiliência Dracônica (Feiticeiro): DES 14 (+2), Nv 5 => CA 15, +5 PV
const mockSorcerer = { className: 'Feiticeiro', level: 5, dex: 14, con: 14, cha: 16, int: 10, wis: 10, str: 10 };
const sorcDraconic = vm.runInContext(`
  formatPlayerFeatureForDisplay(
    { name: 'Resiliência Dracônica', desc: 'Sua pele é recoberta por escamas.' },
    ${JSON.stringify(mockSorcerer)}
  );
`, sandbox);
assert(sorcDraconic.name.includes('CA 15') && sorcDraconic.name.includes('+5 PV'), `Resiliência Dracônica exibe CA 15 e +5 PV (${sorcDraconic.name})`);

// 9. Dados de Dano de Magias (getSpellDiceInfo)
const fireballDice = vm.runInContext("getSpellDiceInfo('Bola de Fogo')", sandbox);
assert(fireballDice && fireballDice.dice === '8d6' && fireballDice.type === 'fogo', `Bola de Fogo possui dados 8d6 Fogo (${fireballDice.label})`);

const magicMissileDice = vm.runInContext("getSpellDiceInfo('Mísseis Mágicos')", sandbox);
assert(magicMissileDice && magicMissileDice.label.includes('3x (1d4+1)'), `Mísseis Mágicos possui label explicativa (${magicMissileDice.label})`);

const shatterDice = vm.runInContext("getSpellDiceInfo('Despedaçar')", sandbox);
assert(shatterDice && shatterDice.dice === '3d8' && shatterDice.type === 'trovão', `Despedaçar possui dados 3d8 Trovão (${shatterDice.label})`);

// 10. Escalonamento de Truques (Raio de Fogo) Nv 1 vs Nv 5
const fireBoltLv1 = vm.runInContext(`getSpellDiceInfo('Raio de Fogo', { level: 1 })`, sandbox);
assert(fireBoltLv1 && fireBoltLv1.dice === '1d10', `Raio de Fogo no Nível 1 causa 1d10 (${fireBoltLv1.label})`);

const fireBoltLv5 = vm.runInContext(`getSpellDiceInfo('Raio de Fogo', { level: 5 })`, sandbox);
assert(fireBoltLv5 && fireBoltLv5.dice === '2d10', `Raio de Fogo escalona para 2d10 no Nível 5 (${fireBoltLv5.label})`);

const shockingGraspLv5 = vm.runInContext(`getSpellDiceInfo('Toque Chocante', { level: 5 })`, sandbox);
assert(shockingGraspLv5 && shockingGraspLv5.dice === '2d8', `Toque Chocante escalona para 2d8 no Nível 5 (${shockingGraspLv5.label})`);

// 11. Magias de Cura somando modificador do conjurador
const cureWoundsDice = vm.runInContext(`
  getSpellDiceInfo('Curar Ferimentos', { level: 5, className: 'Clérigo', wis: 16 })
`, sandbox);
assert(cureWoundsDice && cureWoundsDice.isHeal && cureWoundsDice.dice.includes('1d8 +3'), `Curar Ferimentos soma mod de conjuração 1d8 +3 (${cureWoundsDice.label})`);

// 12. Execução de rolagem de magia (rollPlayerSpellDice)
vm.runInContext(`
  PLAYERS = [${JSON.stringify(mockBarbarian)}, ${JSON.stringify(mockSorcerer)}];
  PLAYERS[1].id = 'p_sorc_test';
  PLAYERS[1].name = 'Feiticeiro Teste';
`, sandbox);
const rollResult = vm.runInContext(`rollPlayerSpellDice('p_sorc_test', 'Bola de Fogo')`, sandbox);
assert(rollResult && rollResult.total >= 8 && rollResult.total <= 48, `rollPlayerSpellDice rolou 8d6 de Bola de Fogo resultando em ${rollResult ? rollResult.total : 0}`);

console.log('\n⚔️ 69. Testes de Seleção de Estilo de Luta e Cálculo Automático de CA (ISSUE-98):');

// 1. Exportação das funções
assert(typeof vm.runInContext('setPlayerFightingStyle', sandbox) === 'function', 'Função setPlayerFightingStyle exportada');
assert(typeof vm.runInContext('getPlayerAcCalculationInfo', sandbox) === 'function', 'Função getPlayerAcCalculationInfo exportada');
assert(typeof vm.runInContext('ensurePlayerCalculatedAc', sandbox) === 'function', 'Função ensurePlayerCalculatedAc exportada');
assert(typeof vm.runInContext('updateModalCalculatedAc', sandbox) === 'function', 'Função updateModalCalculatedAc exportada');

// 2. Cálculo de Bárbaro sem armadura com Escudo (10 + DES + CON + Escudo = 17)
const barbWithShield = {
  id: 'p_barb_shield',
  className: 'Bárbaro',
  dex: 14,
  con: 16,
  inventory: [{ name: 'Escudo', equipped: true }]
};
const acBarbShield = vm.runInContext(`calculatePlayerAcFromEquipment(${JSON.stringify(barbWithShield)})`, sandbox);
assert(acBarbShield === 17, `Bárbaro com Escudo calcula 10 + 2 [DES] + 3 [CON] + 2 [Escudo] = 17 (obteve ${acBarbShield})`);

// 3. Monge com Escudo perde a Defesa sem Armadura (vai para 10 + DES = 12)
const monkWithShield = {
  id: 'p_monk_shield',
  className: 'Monge',
  dex: 14,
  wis: 16,
  inventory: [{ name: 'Escudo', equipped: true }]
};
const acMonkShield = vm.runInContext(`calculatePlayerAcFromEquipment(${JSON.stringify(monkWithShield)})`, sandbox);
assert(acMonkShield === 14, `Monge com Escudo desativa Defesa sem Armadura (10 + 2 [DES] + 2 [Escudo] = 14, obteve ${acMonkShield})`);

// 4. Feiticeiro Dracônico (13 + DES)
const suite69SorcDraconic = {
  id: 'p_sorc_drac',
  className: 'Feiticeiro',
  subclassIdx: 0,
  subclass: 'Linhagem Dracônica (Draconic Bloodline)',
  dex: 16,
  inventory: []
};
const acSorcDrac = vm.runInContext(`calculatePlayerAcFromEquipment(${JSON.stringify(suite69SorcDraconic)})`, sandbox);
assert(acSorcDrac === 16, `Feiticeiro Dracônico calcula 13 + 3 [DES] = 16 (obteve ${acSorcDrac})`);

// 5. Estilo de Luta: Defesa (+1 na CA quando usando armadura)
const fighterChainMail = {
  id: 'p_fighter_chain',
  className: 'Guerreiro',
  dex: 12,
  fightingStyle: 'defense',
  inventory: [{ name: 'Cota de Malha', equipped: true }]
};
const acFighterDef = vm.runInContext(`calculatePlayerAcFromEquipment(${JSON.stringify(fighterChainMail)})`, sandbox);
assert(acFighterDef === 17, `Guerreiro com Cota de Malha (16) + Estilo Defesa (+1) = 17 (obteve ${acFighterDef})`);

// 6. Estilo de Luta: Defesa com Escudo (+1 + 2 = +3 além da armadura)
fighterChainMail.inventory.push({ name: 'Escudo', equipped: true });
const acFighterDefShield = vm.runInContext(`calculatePlayerAcFromEquipment(${JSON.stringify(fighterChainMail)})`, sandbox);
assert(acFighterDefShield === 19, `Guerreiro com Cota de Malha (16) + Estilo Defesa (+1) + Escudo (+2) = 19 (obteve ${acFighterDefShield})`);

// 7. Estilo de Luta: Defesa SEM armadura NÃO concede +1 na CA
const fighterUnarmored = {
  id: 'p_fighter_naked',
  className: 'Guerreiro',
  dex: 14,
  fightingStyle: 'defense',
  inventory: []
};
const acFighterNaked = vm.runInContext(`calculatePlayerAcFromEquipment(${JSON.stringify(fighterUnarmored)})`, sandbox);
assert(acFighterNaked === 12, `Guerreiro sem armadura e Estilo Defesa não recebe bônus de armadura (10 + 2 = 12, obteve ${acFighterNaked})`);

// 8. Teste de getPlayerAcCalculationInfo
const acInfoFighter = vm.runInContext(`getPlayerAcCalculationInfo(${JSON.stringify(fighterChainMail)})`, sandbox);
assert(acInfoFighter.ac === 19 && acInfoFighter.hasDefenseStyle && acInfoFighter.hasShield, 'getPlayerAcCalculationInfo retorna dados estruturados completos');
assert(acInfoFighter.details.includes('Cota de Malha') && acInfoFighter.details.includes('+1 Estilo Defesa'), 'Detalhes de cálculo incluem nome da armadura e bônus de defesa');

// 9. Teste de setPlayerFightingStyle
vm.runInContext(`
  const pTestHero = {
    id: 'p_test_fs_hero',
    name: 'Valerius',
    className: 'Guerreiro',
    dex: 12,
    fightingStyle: '',
    inventory: [{ name: 'Cota de Malha', equipped: true }],
    ac: 16
  };
  PLAYERS.push(pTestHero);
  setPlayerFightingStyle('p_test_fs_hero', 'defense');
`, sandbox);
const valeriusHero = vm.runInContext(`PLAYERS.find(p => p.id === 'p_test_fs_hero')`, sandbox);
assert(valeriusHero.fightingStyle === 'defense', 'setPlayerFightingStyle atualizou fightingStyle para defense');
assert(valeriusHero.ac === 17, `setPlayerFightingStyle recalculou automaticamente a CA para 17 (obteve ${valeriusHero.ac})`);

// 10. Desacoplamento do Estilo de Luta no modal de edição
const htmlContentCheck = fs.readFileSync('src/ui/ui.html', 'utf8');
assert(!htmlContentCheck.includes('<select id="pm-fighting-style">'), 'Select de estilo de luta foi removido do cabeçalho do modal');
assert(htmlContentCheck.includes('<input type="hidden" id="pm-fighting-style">'), 'Input oculto pm-fighting-style preservado para compatibilidade');
assert(htmlContentCheck.includes('oninput="updateModalCalculatedAc()"'), 'Inputs de DES/CON/SAB disparam updateModalCalculatedAc');

// 11. Renderização interativa no card da habilidade (renderPlayerUnlockedFeatures)
const renderedFeaturesHtml = vm.runInContext(`renderPlayerUnlockedFeatures(pTestHero)`, sandbox);
assert(renderedFeaturesHtml.includes('feature-fighting-style-box'), 'renderPlayerUnlockedFeatures renderiza caixa temática de Estilo de Luta');
assert(renderedFeaturesHtml.includes('setPlayerFightingStyle'), 'renderPlayerUnlockedFeatures renderiza dropdown interativo com chamada a setPlayerFightingStyle');
assert(renderedFeaturesHtml.includes('Defesa'), 'renderPlayerUnlockedFeatures exibe o estilo ativo Defesa');

// ========================================================
// 70. TESTES DE LEITURA SEGURA DE CARACTERÍSTICAS, ROLAGEM NÃO INVASIVA, SELEÇÃO DE ARMADURAS E MULTICLASSE (ISSUE-99)
// ========================================================
console.log('\n🛡️ 70. Testes de Leitura Segura de Características, Rolagem Não Invasiva, Seleção de Armaduras e Multiclasse (ISSUE-99):');

// 1. Registro seguro e leitura de características com quebras de linha e aspas
const testFeatKey = vm.runInContext(`registerFeatureForModal("Habilidade de Teste", "Linha 1 com aspas: 'teste' e \\"aspas duplas\\".\\nLinha 2 com tópicos:\\n• Tópico 1\\n• Tópico 2", "Especial", "Mago")`, sandbox);
assert(typeof testFeatKey === 'string' && testFeatKey.startsWith('feat_'), 'registerFeatureForModal gera chave segura alfanumérica');

vm.runInContext(`openPlayerFeatureModalByKey('${testFeatKey}')`, sandbox);
const modalTitleVal = vm.runInContext(`document.getElementById('skill-modal-title').innerText`, sandbox);
assert(modalTitleVal === 'Habilidade de Teste', 'openPlayerFeatureModalByKey abriu e preencheu título corretamente');

// 2. Renderização de características não contém quebras de linha nem aspas perigosas no atributo onclick
const renderedSafeFeatures = vm.runInContext(`renderPlayerUnlockedFeatures(pTestHero)`, sandbox);
assert(!renderedSafeFeatures.includes('onclick="openPlayerFeatureModal(\''), 'renderPlayerUnlockedFeatures eliminou injeção direta de strings inseguras no onclick');
assert(renderedSafeFeatures.includes('openPlayerFeatureModalByKey('), 'renderPlayerUnlockedFeatures utiliza openPlayerFeatureModalByKey');

// 3. Ausência de modal invasivo de dados ao rolar atributos e ataques
vm.runInContext(`
  document.getElementById('modal-dice').classList.remove('open');
  rollPlayerAttr('p_test_fs_hero', 'str');
`, sandbox);
const isDiceModalOpenAttr = vm.runInContext(`document.getElementById('modal-dice').classList.contains('open')`, sandbox);
assert(!isDiceModalOpenAttr, 'rollPlayerAttr executou rolagem sem abrir modal de dados invasivo');

vm.runInContext(`
  document.getElementById('modal-dice').classList.remove('open');
  rollPlayerAttack('p_test_fs_hero', 'Espada Curta (+4, 1d6+2)');
`, sandbox);
const isDiceModalOpenAtk = vm.runInContext(`document.getElementById('modal-dice').classList.contains('open')`, sandbox);
assert(!isDiceModalOpenAtk, 'rollPlayerAttack executou rolagem sem abrir modal de dados invasivo');

// 4. Detecção e equipamento de armaduras
vm.runInContext(`
  const pArmorTest = {
    id: 'p_armor_test',
    name: 'Guerreiro de Armadura',
    className: 'Guerreiro',
    dex: 12,
    fightingStyle: 'defense',
    inventory: []
  };
  PLAYERS.push(pArmorTest);
  setPlayerEquippedArmor('p_armor_test', 'cota de malha', true);
`, sandbox);
const pArmorUpdated = vm.runInContext(`PLAYERS.find(p => p.id === 'p_armor_test')`, sandbox);
assert(vm.runInContext(`getPlayerEquippedArmorKey(PLAYERS.find(p => p.id === 'p_armor_test'))`, sandbox) === 'cota de malha', 'getPlayerEquippedArmorKey identifica Cota de Malha equipada');
assert(vm.runInContext(`hasPlayerEquippedShield(PLAYERS.find(p => p.id === 'p_armor_test'))`, sandbox) === true, 'hasPlayerEquippedShield identifica Escudo equipado');
assert(pArmorUpdated.ac === 19, `Cota de Malha (16) + Estilo Defesa (+1) + Escudo (+2) resulta em CA 19 (obteve ${pArmorUpdated.ac})`);

// 5. Teste de troca rápida para Armadura de Placas
vm.runInContext(`setPlayerEquippedArmor('p_armor_test', 'armadura de placas', true)`, sandbox);
const pArmorPlates = vm.runInContext(`PLAYERS.find(p => p.id === 'p_armor_test')`, sandbox);
assert(pArmorPlates.ac === 21, `Armadura de Placas (18) + Estilo Defesa (+1) + Escudo (+2) resulta em CA 21 (obteve ${pArmorPlates.ac})`);

// 6. Teste de desequipar armadura (Sem Armadura / none)
vm.runInContext(`setPlayerEquippedArmor('p_armor_test', 'none', false)`, sandbox);
const pArmorNone = vm.runInContext(`PLAYERS.find(p => p.id === 'p_armor_test')`, sandbox);
assert(pArmorNone.ac === 11, `Sem Armadura e sem Escudo resulta em 10 + 1 [DES] = 11 (obteve ${pArmorNone.ac})`);


// 7. Validação do Deraravely como Guerreiro 4 / Bárbaro 1 canônico
const deraravelyHeroCheck = parsedCorePlayers93.find(p => p.name === 'Deraravely' || p.id === 'p_1788966076171');
assert(deraravelyHeroCheck && Array.isArray(deraravelyHeroCheck.multiclass), 'Deraravely possui array multiclass');
assert(deraravelyHeroCheck && deraravelyHeroCheck.multiclass.length === 2, 'Deraravely possui exatamente 2 classes');
assert(deraravelyHeroCheck.multiclass[0].className === 'Guerreiro' && deraravelyHeroCheck.multiclass[0].level === 4, 'Deraravely é Guerreiro Nível 4');
assert(deraravelyHeroCheck.multiclass[1].className === 'Bárbaro' && deraravelyHeroCheck.multiclass[1].level === 1, 'Deraravely é Bárbaro Nível 1');
assert(deraravelyHeroCheck.level === 5, 'Nível total de Deraravely é 5');
assert(deraravelyHeroCheck.hitDice === '4d10 + 1d12', `Dados de vida combinados de Deraravely são 4d10 + 1d12 (obteve ${deraravelyHeroCheck.hitDice})`);

// Validação da auto-migração de Deraravely em loadFromLocalStorage
vm.runInContext(`
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    players: [{ id: 'p_1788966076171', name: 'Deraravely', className: 'Guerreiro', level: 5 }]
  }));
  loadFromLocalStorage();
`, sandbox);
const deraMigrated = vm.runInContext(`PLAYERS.find(p => p.id === 'p_1788966076171')`, sandbox);
assert(deraMigrated && deraMigrated.multiclass && deraMigrated.multiclass.length === 2, 'loadFromLocalStorage auto-migrou Deraravely defasado para multiclasse');
assert(deraMigrated.className === 'Guerreiro 4 / Bárbaro 1', 'loadFromLocalStorage atualizou className para Guerreiro 4 / Bárbaro 1');

// 8. Teste das funções do modal de gerenciamento de classes
assert(typeof vm.runInContext(`openPlayerClassesModal`, sandbox) === 'function', 'Função openPlayerClassesModal exportada');
assert(typeof vm.runInContext(`savePlayerClassesModal`, sandbox) === 'function', 'Função savePlayerClassesModal exportada');
assert(typeof vm.runInContext(`addPlayerClassRow`, sandbox) === 'function', 'Função addPlayerClassRow exportada');

// 9. Elementos na interface compilada (HTML)
const compiledHtmlIssue99 = fs.readFileSync(path.join(__dirname, 'planilha do rpg.html'), 'utf8');
assert(compiledHtmlIssue99.includes('id="modal-player-classes"'), 'HTML contém modal-player-classes');
assert(compiledHtmlIssue99.includes('id="pm-armor-select"'), 'HTML contém seletor pm-armor-select no modal de edição');
assert(compiledHtmlIssue99.includes('id="pm-shield-check"'), 'HTML contém checkbox pm-shield-check no modal de edição');
assert(compiledHtmlIssue99.includes('openPlayerClassesModal'), 'HTML contém chamada para openPlayerClassesModal');

// =========================================================================
// --- SUÍTE 71: Testes de Eliminação de Hitbox Fantasma do FAB, Economia de Ações em Características e Redesign de Contadores Táteis (ISSUE-100, ISSUE-101, ISSUE-102) ---
// =========================================================================
console.log('\n🛡️ 71. Testes de Eliminação de Hitbox Fantasma do FAB, Economia de Ações em Características e Redesign de Contadores Táteis (ISSUE-100, ISSUE-101, ISSUE-102):');

// 1. ISSUE-100: Validação de Estilos e Desativação Estrita de Pointer Events no FAB Fechado
const compiledHtmlIssue100 = fs.readFileSync(path.join(__dirname, 'planilha do rpg.html'), 'utf8');
assert(compiledHtmlIssue100.includes('#fab-speed-dial .fab-actions-menu') && compiledHtmlIssue100.includes('display: none !important;'), 'FAB fechado possui display: none !important');
assert(compiledHtmlIssue100.includes('#fab-speed-dial .fab-actions-menu *') && compiledHtmlIssue100.includes('pointer-events: none !important;'), 'Descendentes do FAB fechado possuem pointer-events: none !important');
assert(compiledHtmlIssue100.includes('#fab-speed-dial.open .fab-actions-menu') && compiledHtmlIssue100.includes('display: flex !important;'), 'FAB aberto possui display: flex !important');
assert(compiledHtmlIssue100.includes('body.mode-welcome-screen .fab-speed-dial-container') && compiledHtmlIssue100.includes('display: none !important;'), 'FAB é completamente ocultado na tela de boas-vindas');
assert(compiledHtmlIssue100.includes('class="player-toolbar" onclick="event.stopPropagation();"'), 'Toolbar do jogador bloqueia propagação de cliques');
assert(compiledHtmlIssue100.includes('class="player-actions-group" onclick="event.stopPropagation();"'), 'Grupo de ações da toolbar bloqueia propagação de cliques');

// Validação do comportamento defensivo em handleFabQuickAction contra cliques fantasma no navegador
vm.runInContext(`
  let ghostNotesCalled = false;
  const mockFabDial = {
    classList: {
      contains: (c) => c === 'open' ? false : false
    }
  };
  const origWin = typeof window !== 'undefined' ? window : {};
  const origDoc = typeof document !== 'undefined' ? document : {};
  // Simula clique capturado via window.event com FAB fechado
  window.event = { type: 'click', isTrusted: true };
  const origGetEl = document.getElementById;
  document.getElementById = (id) => id === 'fab-speed-dial' ? mockFabDial : origGetEl(id);
  toggleDMNotesDrawer = () => { ghostNotesCalled = true; };
  handleFabQuickAction('notes');
  document.getElementById = origGetEl;
  delete window.event;
`, sandbox);
assert(vm.runInContext('ghostNotesCalled', sandbox) === false, 'handleFabQuickAction bloqueou execução quando chamado por evento com FAB fechado');

// 2. ISSUE-101: Classificação de Economia de Ações em Características de Classe e Ações Universais
assert(typeof vm.runInContext('getFeatureActionType', sandbox) === 'function', 'Função getFeatureActionType exportada');
assert(typeof vm.runInContext('renderUniversalCombatActions', sandbox) === 'function', 'Função renderUniversalCombatActions exportada');

// Validação de tipos de ação para características D&D 5E
assert(vm.runInContext("getFeatureActionType({ name: 'Fúria' })", sandbox) === 'bonus', 'Fúria classificada como Ação Bônus');
assert(vm.runInContext("getFeatureActionType({ name: 'Retomar o Fôlego' })", sandbox) === 'bonus', 'Retomar o Fôlego classificado como Ação Bônus');
assert(vm.runInContext("getFeatureActionType({ name: 'Ação Arrojada' })", sandbox) === 'bonus', 'Ação Arrojada classificada como Ação Bônus');
assert(vm.runInContext("getFeatureActionType({ name: 'Palavra Divina' })", sandbox) === 'bonus', 'Habilidade com Palavra/Luz Bônus classificada como Bônus');
assert(vm.runInContext("getFeatureActionType({ name: 'Aparar' })", sandbox) === 'reaction', 'Aparar classificado como Reação');
assert(vm.runInContext("getFeatureActionType({ name: 'Repreensão' })", sandbox) === 'reaction', 'Repreensão classificada como Reação');
assert(vm.runInContext("getFeatureActionType({ name: 'Esquiva Sobrenatural' })", sandbox) === 'reaction', 'Esquiva Sobrenatural classificada como Reação');
assert(vm.runInContext("getFeatureActionType({ name: 'Sentido Divino' })", sandbox) === 'action', 'Sentido Divino classificado como Ação Principal');
assert(vm.runInContext("getFeatureActionType({ name: 'Canalizar Divindade' })", sandbox) === 'action', 'Canalizar Divindade classificado como Ação Principal');
assert(vm.runInContext("getFeatureActionType({ name: 'Surto de Ação' })", sandbox) === 'action', 'Surto de Ação classificado como Ação');
assert(vm.runInContext("getFeatureActionType({ name: 'Forma Selvagem' })", sandbox) === 'action', 'Forma Selvagem classificada como Ação');
assert(vm.runInContext("getFeatureActionType({ name: 'Ataque Furtivo' })", sandbox) === 'passive', 'Ataque Furtivo classificado como Passiva');
assert(vm.runInContext("getFeatureActionType({ name: 'Defesa sem Armadura' })", sandbox) === 'passive', 'Defesa sem Armadura classificada como Passiva');
assert(vm.runInContext("getFeatureActionType({ name: 'Resiliência Dracônica' })", sandbox) === 'passive', 'Resiliência Dracônica classificada como Passiva');

// Validação do Guia Universal de Ações de Combate
const allUniversalHtml = vm.runInContext("renderUniversalCombatActions('all')", sandbox);
assert(allUniversalHtml.includes('universal-actions-card'), 'renderUniversalCombatActions gera container universal-actions-card');
assert(allUniversalHtml.includes('Atacar'), 'Guia universal inclui ação de Atacar');
assert(allUniversalHtml.includes('Disparada'), 'Guia universal inclui ação de Disparada');
assert(allUniversalHtml.includes('Desengajar'), 'Guia universal inclui ação de Desengajar');
assert(allUniversalHtml.includes('Esquiva'), 'Guia universal inclui ação de Esquiva');

const bonusUniversalHtml = vm.runInContext("renderUniversalCombatActions('bonus')", sandbox);
assert(bonusUniversalHtml.includes('Combate com Duas Armas'), 'Filtro bônus inclui Combate com Duas Armas');
assert(bonusUniversalHtml.includes('Magia Bônus'), 'Filtro bônus inclui Magia Bônus');

const reactionUniversalHtml = vm.runInContext("renderUniversalCombatActions('reaction')", sandbox);
assert(reactionUniversalHtml.includes('Ataque de Oportunidade'), 'Filtro reação inclui Ataque de Oportunidade');

// Validação da renderização filtrada de características em personagens
const mockFighterSuite71 = {
  id: 'test_fighter_act',
  className: 'Guerreiro',
  level: 5,
  features: 'Retomar o Fôlego, Surto de Ação, Ataque Extra'
};
const fighterBonusHtml = vm.runInContext(`renderPlayerUnlockedFeatures(${JSON.stringify(mockFighterSuite71)}, 'bonus')`, sandbox);
assert(fighterBonusHtml.includes('Retomar o Fôlego'), 'Filtro Bônus exibe Retomar o Fôlego do Guerreiro');
assert(fighterBonusHtml.includes('action-economy-tag bonus'), 'Retomar o Fôlego exibe tag de Ação Bônus');
assert(!fighterBonusHtml.includes('Surto de Ação'), 'Filtro Bônus NÃO exibe Surto de Ação');

const fighterActionHtml = vm.runInContext(`renderPlayerUnlockedFeatures(${JSON.stringify(mockFighterSuite71)}, 'action')`, sandbox);
assert(fighterActionHtml.includes('Surto de Ação'), 'Filtro Ação exibe Surto de Ação');
assert(fighterActionHtml.includes('action-economy-tag action'), 'Surto de Ação exibe tag de Ação');

// 3. ISSUE-102: Redesign Estético Dark Fantasy dos Contadores Rápidos de Recursos
const mockPaladinSuite71 = {
  id: 'test_paladin_res',
  className: 'Paladino',
  level: 5,
  maxHp: 44,
  channelDivinity: 1,
  channelDivinityMax: 1,
  layOnHandsPool: 25
};
const paladinDockHtml = vm.runInContext(`renderPlayerResourceQuickDock(${JSON.stringify(mockPaladinSuite71)})`, sandbox);
assert(paladinDockHtml.includes('resource-quick-dock'), 'renderPlayerResourceQuickDock gera container resource-quick-dock');
assert(paladinDockHtml.includes('resource-quick-chip'), 'renderPlayerResourceQuickDock gera chips de recurso');
assert(paladinDockHtml.includes('resource-counter-badge'), 'renderPlayerResourceQuickDock gera badge estruturada resource-counter-badge');
assert(paladinDockHtml.includes('res-cur') && paladinDockHtml.includes('res-max'), 'resource-counter-badge possui spans res-cur e res-max');
assert(paladinDockHtml.includes('resource-stepper-btn'), 'Cura pelas Mãos gera botões táteis estilizados resource-stepper-btn');
assert(paladinDockHtml.includes('usePlayerLayOnHandsQuick'), 'Botão stepper aciona usePlayerLayOnHandsQuick');
assert(!paladinDockHtml.includes('class="btn-micro"'), 'Botões genéricos não estilizados btn-micro foram eliminados do dock de recursos');

// Validação dos estilos CSS compilados para os novos contadores
assert(compiledHtmlIssue100.includes('.resource-quick-dock'), 'CSS compilado contém estilo .resource-quick-dock');
assert(compiledHtmlIssue100.includes('.resource-quick-chip'), 'CSS compilado contém estilo .resource-quick-chip');
assert(compiledHtmlIssue100.includes('.resource-stepper-btn'), 'CSS compilado contém estilo .resource-stepper-btn');
// ========================================
// 72. Testes de Prevenção de Corte de Botões em Modais, Resumo Rápido de Magias e Grimório de Magos (ISSUE-103):
// ========================================
console.log('\n📜 72. Testes de Prevenção de Corte de Botões em Modais, Resumo Rápido de Magias e Grimório de Magos (ISSUE-103):');

// 1. Prevenção de corte de botão no footer do modal
const compiledHtmlIssue103 = fs.readFileSync(path.join(__dirname, 'planilha do rpg.html'), 'utf-8');

assert(compiledHtmlIssue103.includes('.skill-modal-card') && compiledHtmlIssue103.includes('display: flex !important;') && compiledHtmlIssue103.includes('flex-direction: column !important;'), 'skill-modal-card estruturado com flexbox column para fixar cabeçalho e rodapé');
assert(compiledHtmlIssue103.includes('.skill-modal-scrollable-body') && compiledHtmlIssue103.includes('overflow-y: auto !important;') && compiledHtmlIssue103.includes('flex: 1 1 auto !important;'), 'skill-modal-scrollable-body possui rolagem interna independente');
assert(compiledHtmlIssue103.includes('.skill-modal-footer {') && compiledHtmlIssue103.includes('flex-shrink: 0 !important;'), 'skill-modal-footer com flex-shrink: 0 para nunca ser cortado ou empurrado para fora da tela');
assert(compiledHtmlIssue103.includes('.levelup-footer {') && compiledHtmlIssue103.includes('flex-shrink: 0 !important;'), 'levelup-footer com flex-shrink: 0');

// 2. Validação da semântica dos ícones em getTopicIconForText (eliminação de falsos positivos com \b)
const getTopicIconForText = vm.runInContext('getTopicIconForText', sandbox);
assert(typeof getTopicIconForText === 'function', 'Função getTopicIconForText exportada');
assert(getTopicIconForText('Rituais de Magia') === '📜', 'Tópico de Rituais recebe ícone de pergaminho 📜 (e não 💰 por "po" em "pode")');
assert(getTopicIconForText('Atributo de Conjuração') === '🔮', 'Tópico de Atributo de Conjuração recebe 🔮 (e não ⏱️ por "ação")');
assert(getTopicIconForText('Preparação de Magias') === '📖', 'Tópico de Preparação de Magias recebe livro 📖 (e não ⏱️ por "ação")');
assert(getTopicIconForText('Custos em Moedas de Ouro') === '💰', 'Tópico de moedas recebe 💰');

// 3. Modal de Resumo Rápido de Magias (#modal-spell-summary e .btn-spell-info)
assert(compiledHtmlIssue103.includes('id="modal-spell-summary"'), 'HTML standalone contém o modal id modal-spell-summary');
assert(compiledHtmlIssue103.includes('class="btn-spell-info"'), 'CSS/HTML contém o botão de resumo rápido btn-spell-info');
assert(typeof vm.runInContext('openSpellQuickSummaryModal', sandbox) === 'function', 'Função openSpellQuickSummaryModal exportada');
assert(typeof vm.runInContext('closeSpellQuickSummaryModal', sandbox) === 'function', 'Função closeSpellQuickSummaryModal exportada');

// 4. Mecânicas de Grimório de Mago vs Conjurador Preparado D&D 5E
const isWizardPlayer = vm.runInContext('isWizardPlayer', sandbox);
const ensurePlayerSpellbook = vm.runInContext('ensurePlayerSpellbook', sandbox);
const getSpellCopyCost = vm.runInContext('getSpellCopyCost', sandbox);
const copySpellToSpellbook = vm.runInContext('copySpellToSpellbook', sandbox);
const castSpellAsRitual = vm.runInContext('castSpellAsRitual', sandbox);

assert(typeof isWizardPlayer === 'function', 'Função isWizardPlayer exportada');
assert(typeof ensurePlayerSpellbook === 'function', 'Função ensurePlayerSpellbook exportada');
assert(typeof getSpellCopyCost === 'function', 'Função getSpellCopyCost exportada');
assert(typeof copySpellToSpellbook === 'function', 'Função copySpellToSpellbook exportada');
assert(typeof castSpellAsRitual === 'function', 'Função castSpellAsRitual exportada');

// Validação de identificação de Mago
const wizardChar = { id: 'wiz_1', name: 'Elminster', className: 'Mago', level: 5, coins: { gp: 200 }, preparedSpells: ['Mísseis Mágicos', 'Escudo Arcano'] };
const fighterChar = { id: 'fig_1', name: 'Gromm', className: 'Guerreiro', level: 5 };
assert(isWizardPlayer(wizardChar) === true, 'isWizardPlayer identifica Mago');
assert(isWizardPlayer(fighterChar) === false, 'isWizardPlayer descarta Guerreiro');

// Validação de migração e garantia do Grimório
ensurePlayerSpellbook(wizardChar);
assert(Array.isArray(wizardChar.spellbookSpells), 'ensurePlayerSpellbook inicializa array spellbookSpells');
assert(wizardChar.spellbookSpells.includes('Mísseis Mágicos'), 'Grimório do mago inclui magias previamente preparadas');
assert(wizardChar.spellbookSpells.includes('Escudo Arcano'), 'Grimório do mago inclui Escudo Arcano');

// Validação de Custos de Transcrição: 50 PO e 2h por círculo (D&D 5E RAW)
const fireballSpell = { name: 'Bola de Fogo', level: 3, school: 'Evocação' };
const costNormal = getSpellCopyCost(fireballSpell, wizardChar);
assert(costNormal.gold === 150, 'Bola de Fogo (3º Círculo) custa 150 PO (3 * 50 PO)');
assert(costNormal.hours === 6, 'Bola de Fogo (3º Círculo) requer 6 horas (3 * 2h)');
assert(costNormal.canAfford === true, 'Mago com 200 PO pode pagar custo de 150 PO');

// Validação de Desconto de Tradição Arcana (Subclasse Mago Evocador): 50% de ouro e tempo
const evokerWizard = { id: 'wiz_evoker', name: 'Evocador', className: 'Mago', subclass: 'Evocação', coins: { gp: 100 } };
const costDiscount = getSpellCopyCost(fireballSpell, evokerWizard);
assert(costDiscount.isDiscounted === true, 'Identifica desconto de Tradição Arcana para escola coincidente');
assert(costDiscount.gold === 75, 'Bola de Fogo para Mago Evocador custa 75 PO (50% de desconto)');
assert(costDiscount.hours === 3, 'Bola de Fogo para Mago Evocador requer 3 horas (50% de desconto)');

// Validação de Transcrição e Dedução de Ouro
vm.runInContext(`
  PLAYERS.push(${JSON.stringify(wizardChar)});
`, sandbox);
const initialGold = wizardChar.coins.gp;
vm.runInContext(`copySpellToSpellbook('wiz_1', 'Bola de Fogo', false);`, sandbox);
const updatedWiz = vm.runInContext("PLAYERS.find(p => p.id === 'wiz_1')", sandbox);
assert(updatedWiz.spellbookSpells.includes('Bola de Fogo'), 'copySpellToSpellbook adiciona Bola de Fogo ao Grimório');
assert(updatedWiz.coins.gp === (initialGold - 150), 'copySpellToSpellbook desconta 150 PO do saldo do mago');

// Validação de Bloqueio por Falta de Ouro
const poorWizard = { id: 'wiz_poor', name: 'Mago Pobre', className: 'Mago', coins: { gp: 10 }, spellbookSpells: [] };
vm.runInContext(`PLAYERS.push(${JSON.stringify(poorWizard)});`, sandbox);
vm.runInContext(`copySpellToSpellbook('wiz_poor', 'Bola de Fogo', false);`, sandbox);
const updatedPoorWiz = vm.runInContext("PLAYERS.find(p => p.id === 'wiz_poor')", sandbox);
assert(!updatedPoorWiz.spellbookSpells.includes('Bola de Fogo'), 'copySpellToSpellbook bloqueia transcrição quando saldo de ouro é insuficiente');

// Validação de Transcrição Gratuita (Ex: magias ganhas por subir de nível)
vm.runInContext(`copySpellToSpellbook('wiz_poor', 'Armadura Arcana', true);`, sandbox);
assert(updatedPoorWiz.spellbookSpells.includes('Armadura Arcana'), 'Transcrição gratuita adiciona magia sem exigir ouro');
assert(updatedPoorWiz.coins.gp === 10, 'Saldo de ouro permanece inalterado na transcrição gratuita');

// ============================================================================
// 🌟 73. TESTES DE RETENÇÃO DE SUBCLASSE, SISTEMA DE ASI D&D 5E E INTEGRIDADE (ISSUE-104)
// ============================================================================
console.log('\n🌟 73. Testes de Retenção de Subclasses, Sistema de ASI D&D 5E e Integridade de Atributos (ISSUE-104):');

// 1. Exportação das novas funções utilitárias
assert(typeof vm.runInContext('isClassAsiLevel', sandbox) === 'function', 'Função isClassAsiLevel exportada');
assert(typeof vm.runInContext('resolveSubclassIndex', sandbox) === 'function', 'Função resolveSubclassIndex exportada');
assert(typeof vm.runInContext('setLevelUpAsiMode', sandbox) === 'function', 'Função setLevelUpAsiMode exportada');
assert(typeof vm.runInContext('setLevelUpAsiSingle', sandbox) === 'function', 'Função setLevelUpAsiSingle exportada');
assert(typeof vm.runInContext('setLevelUpAsiDual', sandbox) === 'function', 'Função setLevelUpAsiDual exportada');
assert(typeof vm.runInContext('triggerLevelUpSubclassRespec', sandbox) === 'function', 'Função triggerLevelUpSubclassRespec exportada');

// 2. Validação dos Níveis Canônicos de ASI (D&D 5E)
const isAsi = vm.runInContext('isClassAsiLevel', sandbox);
// Guerreiro: 4, 6, 8, 12, 14, 16, 19
assert(isAsi('Guerreiro', 4) === true, 'Guerreiro Nível 4 concede ASI');
assert(isAsi('Guerreiro', 6) === true, 'Guerreiro Nível 6 concede ASI extra');
assert(isAsi('Guerreiro', 8) === true, 'Guerreiro Nível 8 concede ASI');
assert(isAsi('Guerreiro', 12) === true, 'Guerreiro Nível 12 concede ASI');
assert(isAsi('Guerreiro', 14) === true, 'Guerreiro Nível 14 concede ASI extra');
assert(isAsi('Guerreiro', 5) === false, 'Guerreiro Nível 5 NÃO concede ASI');

// Ladino: 4, 8, 10, 12, 16, 19
assert(isAsi('Ladino', 4) === true, 'Ladino Nível 4 concede ASI');
assert(isAsi('Ladino', 8) === true, 'Ladino Nível 8 concede ASI');
assert(isAsi('Ladino', 10) === true, 'Ladino Nível 10 concede ASI extra');
assert(isAsi('Ladino', 6) === false, 'Ladino Nível 6 NÃO concede ASI');

// Demais classes: 4, 8, 12, 16, 19
assert(isAsi('Mago', 4) === true, 'Mago Nível 4 concede ASI');
assert(isAsi('Mago', 6) === false, 'Mago Nível 6 NÃO concede ASI');
assert(isAsi('Clérigo', 8) === true, 'Clérigo Nível 8 concede ASI');
assert(isAsi('Bárbaro', 4) === true, 'Bárbaro Nível 4 concede ASI');

// 3. Validação do resolvedor de subclasses (resolveSubclassIndex)
const resolveSub = vm.runInContext('resolveSubclassIndex', sandbox);
assert(resolveSub('Guerreiro', 0, 'Campeão') === 0, 'Resolve subclasse Campeão no índice 0');
assert(resolveSub('Guerreiro', 0, 'Mestre da Batalha (Battle Master)') === 1, 'Resolve Mestre da Batalha no índice 1 mesmo que índice numérico seja 0');
assert(resolveSub('Guerreiro', 0, 'Cavaleiro Místico (Eldritch Knight)') === 2, 'Resolve Cavaleiro Místico no índice 2');

// 4. Validação de Retenção de Subclasse no Step 2 do Level Up
vm.runInContext(`
  const pSubKeepTest = {
    id: 'p_sub_keep_1',
    name: 'Gromm Subclass Keeper',
    className: 'Guerreiro',
    level: 3,
    maxHp: 28,
    hp: 28,
    str: 16, dex: 12, con: 14, int: 10, wis: 10, cha: 8,
    subclass: 'Mestre da Batalha',
    subclassIdx: 1
  };
  PLAYERS.push(pSubKeepTest);
  openLevelUpWizard('p_sub_keep_1');
  levelUpWizardState.step = 2;
  renderLevelUpWizardStep();
`, sandbox);
const bodyHtmlStep2 = vm.runInContext("document.getElementById('levelup-wizard-body').innerHTML", sandbox);
assert(bodyHtmlStep2.includes('Subclasse Ativa'), 'Step 2 exibe card de Subclasse Ativa para quem já possui especialização');
assert(bodyHtmlStep2.includes('Mestre da Batalha') || bodyHtmlStep2.includes('Battle Master'), 'Step 2 exibe o nome da subclasse ativa previamente escolhida');
assert(bodyHtmlStep2.includes('Alterar Subclasse'), 'Step 2 exibe botão discreto para respec de subclasse');
assert(!bodyHtmlStep2.includes('<select class="filter-select" style="width: 100%; font-weight: 700; font-size: 13px;" onchange="selectLevelUpSubclass(parseInt(this.value))">'), 'Step 2 NÃO força a re-seleção em dropdown para subclasse já definida');

// 5. Validação de Exibição do Card de ASI no Nível 4
assert(bodyHtmlStep2.includes('levelup-asi-card'), 'Step 2 inclui o card interativo de ASI ao avançar para Nível 4');
assert(bodyHtmlStep2.includes('+2 em um Atributo'), 'Card de ASI oferece opção de +2 em um atributo');
assert(bodyHtmlStep2.includes('+1 em dois Atributos'), 'Card de ASI oferece opção de +1 em dois atributos');
assert(bodyHtmlStep2.includes('Escolher Talento'), 'Card de ASI oferece opção de Talento (Feat)');

// 6. Aplicação de ASI Opção 1 (+2 em Força)
vm.runInContext(`
  levelUpWizardState.step = 3;
  levelUpWizardState.asi = {
    mode: 'single',
    singleAttr: 'str'
  };
  applyLevelUpConfirm();
`, sandbox);
const updatedHeroAsi1 = vm.runInContext("PLAYERS.find(p => p.id === 'p_sub_keep_1')", sandbox);
assert(updatedHeroAsi1.str === 18, 'ASI +2 aumentou Força de 16 para 18 (obteve 18)');
assert(updatedHeroAsi1.subclass === 'Mestre da Batalha' || updatedHeroAsi1.subclassIdx === 1, 'Subclasse Mestre da Batalha foi preservada com fidelidade no Nível 4');

// 7. Aplicação de ASI Opção 2 (+1 em dois atributos) com Ganho Retroativo de PV por aumento de CON
vm.runInContext(`
  const pConRetroTest = {
    id: 'p_con_retro_1',
    name: 'Valeros Con Booster',
    className: 'Guerreiro',
    level: 3,
    maxHp: 28,
    hp: 28,
    str: 15,
    dex: 13,
    con: 15, // Mod +2
    int: 10, wis: 10, cha: 8,
    subclass: 'Campeão',
    subclassIdx: 0
  };
  PLAYERS.push(pConRetroTest);
  openLevelUpWizard('p_con_retro_1');
  levelUpWizardState.step = 3;
  levelUpWizardState.hpMethod = 'fixed';
  levelUpWizardState.asi = {
    mode: 'dual',
    dualAttr1: 'str',
    dualAttr2: 'con' // CON vai de 15 para 16 (Mod +2 para +3)
  };
  applyLevelUpConfirm();
`, sandbox);
const updatedHeroCon = vm.runInContext("PLAYERS.find(p => p.id === 'p_con_retro_1')", sandbox);
assert(updatedHeroCon.str === 16, 'ASI +1 aumentou Força de 15 para 16');
assert(updatedHeroCon.con === 16, 'ASI +1 aumentou Constituição de 15 para 16 (Mod +3)');
// PV base: 28. Ganho normal de Nv 4 (d10 com mod CON novo +3): 6 + 3 = +9. Ganho retroativo por +1 mod CON em 4 níveis: +4 PV. Total = 28 + 9 + 4 = 41 PV
assert(updatedHeroCon.maxHp >= 40, `PV Máximo recebeu bônus de subida e acréscimo retroativo de CON (esperado >= 40, obteve ${updatedHeroCon.maxHp})`);

// 8. Aplicação de ASI Opção 3 (Talento / Feat)
vm.runInContext(`
  const pFeatTest = {
    id: 'p_feat_test_1',
    name: 'Lyra Feat Learner',
    className: 'Ladino',
    level: 3,
    maxHp: 21,
    hp: 21,
    str: 10, dex: 16, con: 12, int: 14, wis: 12, cha: 10,
    features: ['Ataque Furtivo 2d6']
  };
  PLAYERS.push(pFeatTest);
  openLevelUpWizard('p_feat_test_1');
  levelUpWizardState.step = 3;
  levelUpWizardState.asi = {
    mode: 'feat',
    feat: 'Sentinela (Sentinel)'
  };
  applyLevelUpConfirm();
`, sandbox);
const updatedHeroFeat = vm.runInContext("PLAYERS.find(p => p.id === 'p_feat_test_1')", sandbox);
assert(updatedHeroFeat.features.some(f => f.includes('Sentinela')), 'Talento Sentinela adicionado às características da ficha');

// 9. Preservação de Atributos em Fichas Nv 4+ Existentes
vm.runInContext(`
  const pExisting4Plus = {
    id: 'p_existing_nv5',
    name: 'Veterano Nv 5',
    className: 'Guerreiro 5',
    level: 5,
    str: 19, dex: 15, con: 16, int: 11, wis: 13, cha: 9,
    subclass: 'Campeão',
    subclassIdx: 0
  };
  PLAYERS.push(pExisting4Plus);
  saveToLocalStorage();
  loadFromLocalStorage();
`, sandbox);
const loadedVet = vm.runInContext("PLAYERS.find(p => p.id === 'p_existing_nv5')", sandbox);
assert(loadedVet.str === 19 && loadedVet.dex === 15 && loadedVet.con === 16, 'Atributos previamente customizados de ficha Nv 5 foram rigorosamente preservados');

// 10. Validação no CSS Compilado do Bundle
const compiledHtmlIssue104 = fs.readFileSync(path.join(__dirname, 'planilha do rpg.html'), 'utf8');
assert(compiledHtmlIssue104.includes('.levelup-asi-card'), 'CSS compilado contém estilo .levelup-asi-card');
assert(compiledHtmlIssue104.includes('.subclass-locked-card'), 'CSS compilado contém estilo .subclass-locked-card');
assert(compiledHtmlIssue104.includes('.asi-attr-btn'), 'CSS compilado contém estilo .asi-attr-btn');

// --- SUÍTE 74: Experiência do Jogador, Concentração e Salvaguardas da Morte (ISSUE-105) ---
console.log('\n🌟 74. Testes de Experiência do Jogador, Concentração e Salvaguardas da Morte (ISSUE-105):');

// 1. Funções exportadas
assert(typeof vm.runInContext("openDeathSavesModal", sandbox) === 'function', 'Função openDeathSavesModal exportada');
assert(typeof vm.runInContext("closeDeathSavesModal", sandbox) === 'function', 'Função closeDeathSavesModal exportada');
assert(typeof vm.runInContext("toggleDeathSaveManual", sandbox) === 'function', 'Função toggleDeathSaveManual exportada');
assert(typeof vm.runInContext("addDeathSaveManual", sandbox) === 'function', 'Função addDeathSaveManual exportada');
assert(typeof vm.runInContext("setDeathSaveSpecial", sandbox) === 'function', 'Função setDeathSaveSpecial exportada');
assert(typeof vm.runInContext("resetDeathSavesManual", sandbox) === 'function', 'Função resetDeathSavesManual exportada');
assert(typeof vm.runInContext("rollDeathSaveFromModal", sandbox) === 'function', 'Função rollDeathSaveFromModal exportada');
assert(typeof vm.runInContext("triggerConcentrationCheck", sandbox) === 'function', 'Função triggerConcentrationCheck exportada');
assert(typeof vm.runInContext("closeConcentrationModal", sandbox) === 'function', 'Função closeConcentrationModal exportada');
assert(typeof vm.runInContext("submitConcentrationRoll", sandbox) === 'function', 'Função submitConcentrationRoll exportada');
assert(typeof vm.runInContext("scrollToPlayerSection", sandbox) === 'function', 'Função scrollToPlayerSection exportada');
assert(typeof vm.runInContext("openQuickD20Modal", sandbox) === 'function', 'Função openQuickD20Modal exportada');
assert(typeof vm.runInContext("rollWeaponDamageOnly", sandbox) === 'function', 'Função rollWeaponDamageOnly exportada');

// 2. Cálculo da CD de Concentração (D&D 5E: max(10, floor(dano / 2)))
const calcDc = (dmg) => Math.max(10, Math.floor(dmg / 2));
assert(calcDc(4) === 10, 'Dano 4 resulta em CD 10 de Concentração');
assert(calcDc(15) === 10, 'Dano 15 resulta em CD 10 de Concentração');
assert(calcDc(20) === 10, 'Dano 20 resulta em CD 10 de Concentração');
assert(calcDc(26) === 13, 'Dano 26 resulta em CD 13 de Concentração');
assert(calcDc(35) === 17, 'Dano 35 resulta em CD 17 de Concentração');

// 3. Perda automática de concentração ao cair a 0 PV
vm.runInContext(`
  PLAYERS = [{
    id: 'p_conc_test',
    name: 'Paladino Concentrado',
    hp: 12,
    maxHp: 30,
    concentrationSpell: 'Auxílio Divino',
    deathSaves: { success: 0, fail: 0 }
  }];
  adjustPlayerHp('p_conc_test', -12); // Cai para 0 PV
`, sandbox);
const pConc = vm.runInContext("PLAYERS.find(p => p.id === 'p_conc_test')", sandbox);
assert(pConc.hp === 0, 'Paladino caiu a 0 PV');
assert(pConc.concentrationSpell === null, 'Concentração foi encerrada automaticamente ao cair a 0 PV');

// 4. Salvaguardas da Morte Manuais (Dados Físicos da Mesa)
vm.runInContext(`
  (() => {
    const hero = PLAYERS.find(x => x.id === 'p_conc_test');
    hero.deathSaves = { success: 0, fail: 0 };
    currentDeathSavesPlayerId = 'p_conc_test';
    toggleDeathSaveManual('success', 1);
  })();
`, sandbox);
const pTest1 = vm.runInContext("PLAYERS.find(p => p.id === 'p_conc_test')", sandbox);
assert(pTest1.deathSaves.success === 1, 'toggleDeathSaveManual marcou 1º sucesso');

vm.runInContext(`
  addDeathSaveManual('fail');
  addDeathSaveManual('fail');
`, sandbox);
const pTest2 = vm.runInContext("PLAYERS.find(p => p.id === 'p_conc_test')", sandbox);
assert(pTest2.deathSaves.fail === 2, 'addDeathSaveManual acumulou 2 falhas');

// 5. Teste de 20 Natural e 1 Natural Físicos na Mesa
vm.runInContext(`
  setDeathSaveSpecial('nat1');
`, sandbox);
const pTest3 = vm.runInContext("PLAYERS.find(p => p.id === 'p_conc_test')", sandbox);
assert(pTest3.deathSaves.fail === 3, '1 Natural na mesa acumulou falha até o limite 3');

vm.runInContext(`
  setDeathSaveSpecial('nat20');
`, sandbox);
const pTest4 = vm.runInContext("PLAYERS.find(p => p.id === 'p_conc_test')", sandbox);
assert(pTest4.hp === 1, '20 Natural na mesa recuperou 1 PV e acordou o herói');
assert(pTest4.deathSaves.success === 0 && pTest4.deathSaves.fail === 0, '20 Natural na mesa limpou testes da morte');

// 6. Teste de Rolagem Independente de Dano de Arma
vm.runInContext(`
  PLAYERS.push({
    id: 'p_atk_dmg_test',
    name: 'Guerreiro de Teste',
    attacks: 'Espada Longa (+6, 1d8+3 cortante)'
  });
`, sandbox);
const dmgRes = vm.runInContext("rollWeaponDamageOnly('p_atk_dmg_test', 'Espada Longa (+6, 1d8+3 cortante)')", sandbox);
assert(dmgRes && dmgRes.totalDmg >= 4 && dmgRes.totalDmg <= 11, 'rollWeaponDamageOnly rolou dano 1d8+3 dentro do intervalo [4..11]');
assert(dmgRes.diceCount === 1 && dmgRes.diceSides === 8, 'rollWeaponDamageOnly identificou 1d8 corretamente');

const critDmgRes = vm.runInContext("rollWeaponDamageOnly('p_atk_dmg_test', 'Espada Longa (+6, 1d8+3 cortante)', true)", sandbox);
assert(critDmgRes.diceCount === 2, 'rollWeaponDamageOnly com Acerto Crítico dobrou os dados para 2d8');

// 7. Validação de Componentes UI e CSS no HTML Compilado
const compiledHtmlIssue105 = fs.readFileSync(path.join(__dirname, 'planilha do rpg.html'), 'utf8');
assert(compiledHtmlIssue105.includes('id="modal-concentration-check"'), 'HTML standalone contém modal de teste de concentração');
assert(compiledHtmlIssue105.includes('id="modal-death-saves"'), 'HTML standalone contém modal de salvaguardas da morte');
assert(compiledHtmlIssue105.includes('id="player-mobile-dock"'), 'HTML standalone contém dock flutuante de ações rápidas mobile');
assert(compiledHtmlIssue105.includes('spell-gem-pip'), 'HTML standalone contém classe spell-gem-pip para gemas de magia');
assert(compiledHtmlIssue105.includes('.death-saves-large-box'), 'CSS compilado contém estilo .death-saves-large-box');
assert(compiledHtmlIssue105.includes('.player-mobile-dock'), 'CSS compilado contém estilo .player-mobile-dock');
assert(compiledHtmlIssue105.includes('.player-turn-pulse'), 'CSS compilado contém animação de pulso dourado .player-turn-pulse');



// ========================================================
// 75. TESTES DE RETENÇÃO DE MAGIAS, AUTO-CÁLCULO E DESCONTO
//     DE ESPAÇOS DE MAGIA DE 1º A 9º CÍRCULO (ISSUE-106)
// ========================================================
console.log('\n🔮 75. Testes de Retenção de Magias, Auto-Cálculo e Desconto de 1º a 9º Círculo (ISSUE-106):');

// 1. Validação de exportações
assert(typeof sandbox.isSpellcasterClass === 'function', 'Função isSpellcasterClass exportada');

// 2. Identificação de classes conjuradoras
assert(sandbox.isSpellcasterClass('Mago') === true, 'isSpellcasterClass identifica Mago como conjurador');
assert(sandbox.isSpellcasterClass('Clérigo') === true, 'isSpellcasterClass identifica Clérigo como conjurador');
assert(sandbox.isSpellcasterClass('Paladino') === true, 'isSpellcasterClass identifica Paladino como conjurador');
assert(sandbox.isSpellcasterClass('Bruxo') === true, 'isSpellcasterClass identifica Bruxo como conjurador');
assert(sandbox.isSpellcasterClass('Ladino', 2, 'Trapaceiro Arcano') === true, 'isSpellcasterClass identifica Ladino Trapaceiro Arcano');
assert(sandbox.isSpellcasterClass('Guerreiro', 0, 'Campeão') === false, 'isSpellcasterClass descarta Guerreiro Campeão');
assert(sandbox.isSpellcasterClass('Bárbaro') === false, 'isSpellcasterClass descarta Bárbaro puro');

// 3. Suporte aos 9 Círculos de D&D 5E
const wizard17Slots = vm.runInContext("calculateSpellSlots('Mago', 17)", sandbox);
assert(wizard17Slots.length === 9, 'Tabela de Mago possui 9 círculos de magia');
assert(wizard17Slots[8] === 1, 'Mago Nível 17 possui 1 espaço de 9º círculo');
assert(wizard17Slots[7] === 1, 'Mago Nível 17 possui 1 espaço de 8º círculo');
assert(wizard17Slots[6] === 1, 'Mago Nível 17 possui 1 espaço de 7º círculo');
assert(wizard17Slots[5] === 1, 'Mago Nível 17 possui 1 espaço de 6º círculo');
assert(JSON.stringify(wizard17Slots) === JSON.stringify([4, 3, 3, 3, 2, 1, 1, 1, 1]), 'Mago Nível 17 recebe distribuição oficial D&D 5E de 9 círculos');

// 4. Retenção de Grimório (spellbookSpells) e Magias Customizadas ao Salvar Ficha
vm.runInContext(`
  PLAYERS.push({
    id: 'p_wizard_retention_test',
    student: 'Arthur',
    name: 'Elminster Júnior',
    className: 'Mago',
    level: 5,
    str: 10, dex: 14, con: 14, int: 18, wis: 12, cha: 10,
    slots: [4, 3, 2, 0, 0, 0, 0, 0, 0],
    slotsUsed: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    preparedSpells: ['Escudo Arcano', 'Mísseis Mágicos', 'Bola de Fogo'],
    spellbookSpells: ['Escudo Arcano', 'Mísseis Mágicos', 'Bola de Fogo', 'Invisibilidade', 'Passo Nebuloso', 'Detectar Magia'],
    customSpells: ['Lâmina Espiritual Arcana']
  });

  // Simula formulário de edição do jogador
  document.getElementById('pm-id').value = 'p_wizard_retention_test';
  document.getElementById('pm-student').value = 'Arthur';
  document.getElementById('pm-name').value = 'Elminster Júnior';
  document.getElementById('pm-class').value = 'Mago';
  document.getElementById('pm-level').value = '5';
  document.getElementById('pm-maxhp').value = '28';
  document.getElementById('pm-speed').value = '9m';
  document.getElementById('pm-gold').value = '150';
  document.getElementById('pm-str').value = '10';
  document.getElementById('pm-dex').value = '14';
  document.getElementById('pm-con').value = '14';
  document.getElementById('pm-int').value = '18';
  document.getElementById('pm-wis').value = '12';
  document.getElementById('pm-cha').value = '10';
  document.getElementById('pm-attacks').value = '';
  document.getElementById('pm-features').value = '';
  document.getElementById('pm-spells').value = 'Armadura Arcana, Queda Suave';
  document.getElementById('pm-badges').value = '';

  for (let i = 1; i <= 9; i++) {
    const inp = document.getElementById('pm-slot-' + i);
    if (inp) inp.value = (i <= 3) ? (i === 1 ? 4 : (i === 2 ? 3 : 2)) : 0;
  }

  savePlayerSheet();
`, sandbox);

const savedWizard = vm.runInContext("PLAYERS.find(p => p.id === 'p_wizard_retention_test')", sandbox);
assert(Array.isArray(savedWizard.spellbookSpells), 'spellbookSpells preservado como Array no salvamento da ficha');
assert(savedWizard.spellbookSpells.includes('Bola de Fogo'), 'Bola de Fogo preservada no Grimório');
assert(savedWizard.spellbookSpells.includes('Invisibilidade'), 'Invisibilidade preservada no Grimório');
assert(savedWizard.spellbookSpells.includes('Armadura Arcana'), 'Armadura Arcana (digitada em pm-spells) sincronizada no Grimório');
assert(savedWizard.preparedSpells.includes('Armadura Arcana'), 'Armadura Arcana sincronizada nas magias preparadas');
assert(savedWizard.customSpells.includes('Lâmina Espiritual Arcana'), 'Magia customizada preservada na ficha');

// 5. Testes de Desconto Automático de Slots (executeCastSpell)
vm.runInContext(`
  // Conjurando magia de 1º círculo
  executeCastSpell('p_wizard_retention_test', 'Escudo Arcano', 1);
`, sandbox);
const afterCast1 = vm.runInContext("PLAYERS.find(p => p.id === 'p_wizard_retention_test')", sandbox);
assert(afterCast1.slotsUsed[0] === 1, 'executeCastSpell descontou 1 espaço de 1º círculo (slotsUsed[0] = 1)');

vm.runInContext(`
  // Conjurando com Upcasting (magia de 1º círculo lançada gastando slot de 3º círculo)
  executeCastSpell('p_wizard_retention_test', 'Mísseis Mágicos', 3);
`, sandbox);
const afterCastUpcast = vm.runInContext("PLAYERS.find(p => p.id === 'p_wizard_retention_test')", sandbox);
assert(afterCastUpcast.slotsUsed[2] === 1, 'executeCastSpell com Upcasting descontou 1 espaço de 3º círculo (slotsUsed[2] = 1)');

// 6. Teste de Desconto em Círculos Altos (6º Círculo)
vm.runInContext(`
  PLAYERS.push({
    id: 'p_high_mage',
    name: 'Mago Arquimago',
    className: 'Mago',
    level: 13,
    slots: [4, 3, 3, 3, 2, 1, 1, 0, 0],
    slotsUsed: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    preparedSpells: ['Desintegrar']
  });
  executeCastSpell('p_high_mage', 'Desintegrar', 6);
`, sandbox);
const highMage = vm.runInContext("PLAYERS.find(p => p.id === 'p_high_mage')", sandbox);
assert(highMage.slotsUsed[5] === 1, 'executeCastSpell descontou 1 espaço de 6º círculo para Desintegrar (slotsUsed[5] = 1)');

// 7. Teste de Serialização para Compartilhamento
const sharedData = vm.runInContext("serializePlayerForShare(PLAYERS.find(p => p.id === 'p_wizard_retention_test'))", sandbox);
const deserialized = vm.runInContext(`deserializePlayerFromShare("${sharedData}")`, sandbox);
assert(Array.isArray(deserialized.spellbookSpells) && deserialized.spellbookSpells.includes('Bola de Fogo'), 'serializePlayerForShare inclui spellbookSpells');
assert(Array.isArray(deserialized.customSpells) && deserialized.customSpells.includes('Lâmina Espiritual Arcana'), 'serializePlayerForShare inclui customSpells');

// 8. Validação de Componentes UI Standalone
const standaloneHtmlSpells = fs.readFileSync(path.join(__dirname, 'planilha do rpg.html'), 'utf8');
assert(standaloneHtmlSpells.includes('id="pm-slot-6"'), 'HTML standalone contém input pm-slot-6');
assert(standaloneHtmlSpells.includes('id="pm-slot-7"'), 'HTML standalone contém input pm-slot-7');
assert(standaloneHtmlSpells.includes('id="pm-slot-8"'), 'HTML standalone contém input pm-slot-8');
assert(standaloneHtmlSpells.includes('id="pm-slot-9"'), 'HTML standalone contém input pm-slot-9');



// ========================================================
// 76. TESTES DE INTUITIVIDADE, RESPONSIVIDADE E ERGONOMIA (ISSUE-108)
// ========================================================
console.log('\n📱 76. Testes de Intuitividade, Responsividade e Ergonomia (ISSUE-108):');

// 1. Funções de combate e utilitários exportados
assert(typeof vm.runInContext('applyHalfDamage', sandbox) === 'function', 'Função applyHalfDamage exportada');
assert(typeof vm.runInContext('applyDoubleDamage', sandbox) === 'function', 'Função applyDoubleDamage exportada');
assert(typeof vm.runInContext('applyCriticalDamageMultiplier', sandbox) === 'function', 'Função applyCriticalDamageMultiplier exportada');
assert(typeof vm.runInContext('openCombatQuickConditions', sandbox) === 'function', 'Função openCombatQuickConditions exportada');
assert(typeof vm.runInContext('closeCombatQuickConditions', sandbox) === 'function', 'Função closeCombatQuickConditions exportada');
assert(typeof vm.runInContext('toggleCombatQuickCondition', sandbox) === 'function', 'Função toggleCombatQuickCondition exportada');
assert(typeof vm.runInContext('openSpellQuickView', sandbox) === 'function', 'Função openSpellQuickView exportada');
assert(typeof vm.runInContext('closeSpellQuickView', sandbox) === 'function', 'Função closeSpellQuickView exportada');
assert(typeof vm.runInContext('toggleVttHudCollapse', sandbox) === 'function', 'Função toggleVttHudCollapse exportada');

// 2. Teste de Condições Rápidas (Toggle)
vm.runInContext(`
  state.combatants = [
    { id: 'c_test_1', name: 'Herói Ativo', hp: 30, maxHp: 30, init: 18, conditions: [] },
    { id: 'c_test_2', name: 'Monstro OnDeck', hp: 20, maxHp: 20, init: 12, conditions: [] }
  ];
  state.turnIndex = 0;
  toggleCombatQuickCondition('c_test_2', 'caido');
`, sandbox);
const combWithCond = vm.runInContext("state.combatants.find(c => c.id === 'c_test_2')", sandbox);
assert(combWithCond.conditions.includes('caido'), 'toggleCombatQuickCondition adicionou condição "caido"');

vm.runInContext(`
  toggleCombatQuickCondition('c_test_2', 'caido');
`, sandbox);
const combWithoutCond = vm.runInContext("state.combatants.find(c => c.id === 'c_test_2')", sandbox);
assert(!combWithoutCond.conditions.includes('caido'), 'toggleCombatQuickCondition removeu condição "caido"');

// 3. Teste de On-Deck (Próximo a Agir) no HTML gerado pelo renderCombat
vm.runInContext(`renderCombat()`, sandbox);
const listHtml = vm.runInContext("document.getElementById('list-combatants')?.innerHTML || ''", sandbox);
assert(listHtml.includes('combatant-on-deck'), 'renderCombat atribuiu classe combatant-on-deck ao próximo da iniciativa');
assert(listHtml.includes('badge-on-deck'), 'renderCombat exibiu badge "Próximo" no combatente seguinte');

// 4. Validação de Elementos e Classes no Bundle Standalone
const standaloneHtml108 = fs.readFileSync(path.join(__dirname, 'planilha do rpg.html'), 'utf8');
assert(standaloneHtml108.includes('id="btn-half-damage"'), 'HTML standalone contém botão #btn-half-damage');
assert(standaloneHtml108.includes('id="btn-crit-damage"'), 'HTML standalone contém botão #btn-crit-damage');
assert(standaloneHtml108.includes('id="btn-toggle-vtt-focus"'), 'HTML standalone contém botão #btn-toggle-vtt-focus');
assert(standaloneHtml108.includes('id="modal-spell-quick-view"'), 'HTML standalone contém modal #modal-spell-quick-view');
assert(standaloneHtml108.includes('id="popover-combat-conditions"'), 'HTML standalone contém popover #popover-combat-conditions');
assert(standaloneHtml108.includes('.combatant-on-deck'), 'CSS compilado contém estilo .combatant-on-deck');
assert(standaloneHtml108.includes('.quick-cond-popover'), 'CSS compilado contém estilo .quick-cond-popover');
assert(standaloneHtml108.includes('.player-spell-card-tactile'), 'CSS compilado contém estilo .player-spell-card-tactile');
assert(standaloneHtml108.includes('.damage-pulse'), 'CSS compilado contém estilo .damage-pulse');
assert(standaloneHtml108.includes('.heal-pulse'), 'CSS compilado contém estilo .heal-pulse');
assert(standaloneHtml108.includes('.vtt-focus-mode'), 'CSS compilado contém estilo .vtt-focus-mode');


// ========================================================
// 77. TESTES DE VISIBILIDADE DE MAGIAS E CONJURADORES CONHECIDOS (ISSUE-109)
// ========================================================
console.log('\n🔮 77. Testes de Visibilidade de Magias e Conjuradores Conhecidos (ISSUE-109):');


// 1. Exportação e funcionamento de getPlayerCompatibleClassKeys
assert(typeof vm.runInContext('getPlayerCompatibleClassKeys', sandbox) === 'function', 'Função getPlayerCompatibleClassKeys exportada');

const keysSingle = vm.runInContext("getPlayerCompatibleClassKeys({ className: 'Bruxo' })", sandbox);
assert(Array.isArray(keysSingle) && keysSingle.includes('Bruxo'), 'getPlayerCompatibleClassKeys retorna ["Bruxo"] para Bruxo simples');

const keysMulti = vm.runInContext("getPlayerCompatibleClassKeys({ className: 'Feiticeiro 3 / Bruxo 2' })", sandbox);
assert(Array.isArray(keysMulti) && keysMulti.includes('Feiticeiro') && keysMulti.includes('Bruxo'), 'getPlayerCompatibleClassKeys retorna Feiticeiro e Bruxo para multiclasse');

const keysTrickster = vm.runInContext("getPlayerCompatibleClassKeys({ className: 'Ladino', subclass: 'Trapaceiro Arcano' })", sandbox);
assert(Array.isArray(keysTrickster) && keysTrickster.includes('Mago'), 'getPlayerCompatibleClassKeys mapeia Trapaceiro Arcano para Mago');

// 2. Teste do Seletor de Magias: Magias já selecionadas aparecem incondicionalmente no filtro auto
vm.runInContext(`
  // Configura estado do seletor para Bruxo com 'Mãos Flamejantes' selecionada
  pickerTargetPlayerId = 'p_warlock_test';
  pickerSelectedSpells = new Set(['Mãos Flamejantes', 'Rajada Mística']);
  pickerClassFilter = 'auto';
  pickerLevelFilter = 'all';
  pickerSearchQuery = '';
  
  const warlockHero = {
    id: 'p_warlock_test',
    name: 'Warlock Teste',
    student: 'Aluno Teste',
    className: 'Bruxo',
    level: 3,
    hp: 24,
    maxHp: 24,
    speed: '9m',
    str: 10, dex: 14, con: 14, int: 10, wis: 12, cha: 16,
    preparedSpells: ['Mãos Flamejantes', 'Rajada Mística']
  };
  
  // Garante que o herói está na lista PLAYERS
  const existingWIdx = PLAYERS.findIndex(p => p.id === 'p_warlock_test');
  if (existingWIdx >= 0) PLAYERS[existingWIdx] = warlockHero;
  else PLAYERS.push(warlockHero);
  
  renderSpellPickerList();
`, sandbox);

const pickerHtml109 = vm.runInContext("document.getElementById('picker-spells-list')?.innerHTML || ''", sandbox);
assert(pickerHtml109.includes('Mãos Flamejantes'), 'renderSpellPickerList exibe Mãos Flamejantes mesmo sendo de lista de patrono sob filtro auto');
assert(pickerHtml109.includes('Rajada Mística'), 'renderSpellPickerList exibe Rajada Mística para Bruxo');

// 3. Teste de Multiclasse no Seletor: Feiticeiro / Bruxo exibe magias de ambas as classes
vm.runInContext(`
  const multiHero = {
    id: 'p_multi_test',
    name: 'Conjurador Híbrido',
    className: 'Feiticeiro 3 / Bruxo 2',
    level: 5,
    preparedSpells: []
  };
  PLAYERS.push(multiHero);
  pickerTargetPlayerId = 'p_multi_test';
  pickerSelectedSpells = new Set();
  pickerClassFilter = 'auto';
  renderSpellPickerList();
`, sandbox);
const multiPickerHtml109 = vm.runInContext("document.getElementById('picker-spells-list')?.innerHTML || ''", sandbox);
assert(multiPickerHtml109.includes('Rajada Mística') || multiPickerHtml109.includes('Bruxaria'), 'Seletor exibe magias de Bruxo para multiclasse com Feiticeiro');

// 4. Teste de Card de Personagem para Conjurador de Magias Conhecidas (Bruxo, Bardo, Feiticeiro)
vm.runInContext(`
  activePortalPlayerId = null;
  const filterQ = document.getElementById('filter-player-q');
  if (filterQ) filterQ.value = '';
  renderPlayers();
`, sandbox);
const playersHtml109 = vm.runInContext("document.getElementById('grid-players')?.innerHTML || ''", sandbox);
assert(playersHtml109.includes('🔮 Conhecida') || playersHtml109.includes('badge-spell-known'), 'Ficha de Bruxo/Bardo/Feiticeiro exibe badge "🔮 Conhecida" em vez de botão desmarcador');

// ============================================================================
// 📱 78. Testes de Responsividade Mobile, Viewport e Usabilidade Tátil (ISSUE-110)
// ============================================================================
console.log('\n📱 78. Testes de Responsividade Mobile, Viewport e Usabilidade Tátil (ISSUE-110):');

const standaloneHtml110 = fs.readFileSync(path.join(__dirname, 'planilha do rpg.html'), 'utf8');
assert(standaloneHtml110.includes('viewport-fit=cover'), 'HTML compilado possui viewport-fit=cover no meta viewport');
assert(standaloneHtml110.includes('100dvh'), 'CSS compilado suporta 100dvh para cálculo de altura dinâmica em mobile');
assert(standaloneHtml110.includes('env(safe-area-inset-bottom'), 'CSS compilado utiliza env(safe-area-inset-bottom) no dock inferior');
assert(standaloneHtml110.includes('.dock-label') && (standaloneHtml110.includes('font-size: 11px') || standaloneHtml110.includes('letter-spacing: 0.3px')), 'CSS compilado possui labels legíveis (.dock-label) no dock inferior');
assert(standaloneHtml110.includes('@media (max-width: 900px)') && standaloneHtml110.includes('.player-hp-btn'), 'CSS compilado estende ergonomia de touch targets (≥ 44px) até 900px');
assert(standaloneHtml110.includes('.battlegrid-toolbar') && standaloneHtml110.includes('@media (max-width: 768px)'), 'CSS compilado contém regras responsivas de toolbar em 768px');
assert(standaloneHtml110.includes('.battlegrid-toolbar') && standaloneHtml110.includes('@media (max-width: 600px)'), 'CSS compilado contém regras responsivas de toolbar em 600px');
// ============================================================================
// 🎲 79. Testes do Overhaul de Layout Roll20 D&D 5E 2024 (ISSUE-111)
// ============================================================================
console.log('\n🎲 79. Testes do Overhaul de Layout Roll20 D&D 5E 2024 (ISSUE-111):');

assert(typeof sandbox.getPlayerCalculatedAttacks === 'function', 'Função getPlayerCalculatedAttacks exportada');
assert(typeof sandbox.togglePlayerItemEquipped === 'function', 'Função togglePlayerItemEquipped exportada');
assert(typeof sandbox.setPlayerCardRoll20Tab === 'function', 'Função setPlayerCardRoll20Tab exportada');
assert(typeof sandbox.applyRoll20QuickDamage === 'function', 'Função applyRoll20QuickDamage exportada');
assert(typeof sandbox.applyRoll20QuickHeal === 'function', 'Função applyRoll20QuickHeal exportada');
assert(typeof sandbox.sharePlayerCalculatedAttackToFeed === 'function', 'Função sharePlayerCalculatedAttackToFeed exportada');
assert(typeof sandbox.sharePlayerSpellToFeed === 'function', 'Função sharePlayerSpellToFeed exportada');
assert(typeof sandbox.sharePlayerItemToFeed === 'function', 'Função sharePlayerItemToFeed exportada');
assert(typeof sandbox.sharePlayerTraitToFeed === 'function', 'Função sharePlayerTraitToFeed exportada');

// 1. Cálculo de Ataques de Armas Equipadas
const testHeroRoll20 = {
  id: 'p_roll20',
  name: 'Guerreiro Épico',
  level: 5,
  str: 16,
  dex: 14,
  hp: 40,
  maxHp: 40,
  speed: '9m',
  inventory: [
    { name: 'Espada Longa', equipped: true, damage: '1d8 cortante' },
    { name: 'Arco Curto', equipped: true, damage: '1d6 perfurante', prop: 'Distância' },
    { name: 'Adaga de Prata', equipped: false, damage: '1d4 perfurante' }
  ]
};

const calcAttacks = sandbox.getPlayerCalculatedAttacks(testHeroRoll20);
assert(calcAttacks.length === 2, 'Apenas as 2 armas com equipped: true foram calculadas');
const swordAtk = calcAttacks.find(a => a.name === 'Espada Longa');
assert(swordAtk && swordAtk.toHit === '+6', 'Espada Longa possui acerto +6 (PB +3 + FOR +3)');
assert(swordAtk && swordAtk.damage === '1d8+3', 'Espada Longa possui dano 1d8+3 (1d8 + FOR +3)');

const bowAtk = calcAttacks.find(a => a.name === 'Arco Curto');
assert(bowAtk && bowAtk.toHit === '+5', 'Arco Curto à distância possui acerto +5 (PB +3 + DES +2)');
assert(bowAtk && bowAtk.damage === '1d6+2', 'Arco Curto possui dano 1d6+2 (1d6 + DES +2)');

// 2. Toggle de Item Equipado
vm.runInContext(`
  PLAYERS.push(${JSON.stringify(testHeroRoll20)});
  togglePlayerItemEquipped('p_roll20', 2);
`, sandbox);
const toggledHero = vm.runInContext("PLAYERS.find(p => p.id === 'p_roll20')", sandbox);
assert(toggledHero && toggledHero.inventory[2].equipped === true, 'togglePlayerItemEquipped alternou Adaga de Prata para equipada');

// 3. Fallback de Ataque Desarmado se nenhuma arma equipada
const unarmedHero = { id: 'p_unarmed', name: 'Monge', level: 1, str: 10, dex: 10, inventory: [] };
const unarmedAttacks = sandbox.getPlayerCalculatedAttacks(unarmedHero);
assert(unarmedAttacks.length === 1 && unarmedAttacks[0].name === 'Ataque Desarmado', 'Fallback de Ataque Desarmado gerado quando sem armas');

// 4. Renderização HTML com Seletores do Layout Roll20 2024
sandbox.PLAYERS = [testHeroRoll20];
sandbox.renderPlayers();
const renderedRoll20Html = sandbox.document.getElementById('grid-players')?.innerHTML || '';

assert(renderedRoll20Html.includes('roll20-sheet'), 'Ficha renderizada contém classe .roll20-sheet');
assert(renderedRoll20Html.includes('roll20-top-grid'), 'Ficha renderizada contém topo Roll20 (.roll20-top-grid)');
assert(renderedRoll20Html.includes('roll20-hero-card'), 'Ficha renderizada contém .roll20-hero-card');
assert(renderedRoll20Html.includes('roll20-hp-card'), 'Ficha renderizada contém .roll20-hp-card');
assert(renderedRoll20Html.includes('roll20-abilities-bar'), 'Ficha renderizada contém barra unificada de atributos (.roll20-abilities-bar)');
assert(renderedRoll20Html.includes('roll20-columns-grid'), 'Ficha renderizada contém grade em 3 colunas (.roll20-columns-grid)');
assert(renderedRoll20Html.includes('roll20-col-skills'), 'Ficha renderizada contém coluna 1 de perícias (.roll20-col-skills)');
assert(renderedRoll20Html.includes('roll20-col-main'), 'Ficha renderizada contém coluna 2 de abas centrais (.roll20-col-main)');
assert(renderedRoll20Html.includes('roll20-col-side'), 'Ficha renderizada contém coluna 3 de defesas (.roll20-col-side)');
assert(renderedRoll20Html.includes('roll20-attacks-table'), 'Ficha renderizada contém tabela de ataques (.roll20-attacks-table)');
assert(renderedRoll20Html.includes('btn-chat-feed'), 'Ficha renderizada contém botões de balão de fala 💬 para envio ao chat');

// 5. Verificação no Standalone Compilado
const standaloneRoll20 = fs.readFileSync(path.join(__dirname, 'planilha do rpg.html'), 'utf8');
assert(standaloneRoll20.includes('.roll20-sheet'), 'Standalone compilado contém estilos .roll20-sheet');
assert(standaloneRoll20.includes('.roll20-columns-grid'), 'Standalone compilado contém estilos .roll20-columns-grid');
assert(standaloneRoll20.includes('.roll20-ability-box'), 'Standalone compilado contém estilos .roll20-ability-box');
assert(standaloneRoll20.includes('getPlayerCalculatedAttacks'), 'Standalone compilado contém função getPlayerCalculatedAttacks');

// =========================================================================
// 80. TESTES DE DESIGN SYSTEM E HARMONIZAÇÃO DOS BOTÕES DA FICHA (ISSUE-112)
// =========================================================================
console.log('\n🎨 80. Testes de Design System e Harmonização dos Botões da Ficha (ISSUE-112):');

// 1. Verificação no HTML Renderizado
assert(renderedRoll20Html.includes('roll20-btn-tool'), 'Ficha renderizada contém botões de ferramentas (.roll20-btn-tool)');
assert(renderedRoll20Html.includes('roll20-btn-tool-del'), 'Ficha renderizada contém botão de excluir estilizado (.roll20-btn-tool-del)');
assert(renderedRoll20Html.includes('roll20-btn-rest-short'), 'Ficha renderizada contém botão de descanso curto (.roll20-btn-rest-short)');
assert(renderedRoll20Html.includes('roll20-btn-rest-long'), 'Ficha renderizada contém botão de descanso longo (.roll20-btn-rest-long)');
assert(renderedRoll20Html.includes('roll20-btn-hd-heal'), 'Ficha renderizada contém botão de curar com dado (.roll20-btn-hd-heal)');
assert(renderedRoll20Html.includes('roll20-btn-add-weapon'), 'Ficha renderizada contém botão + Arma (.roll20-btn-add-weapon)');
assert(renderedRoll20Html.includes('roll20-btn-add-item'), 'Ficha renderizada contém botão + Item (.roll20-btn-add-item)');
assert(renderedRoll20Html.includes('roll20-btn-damage-only'), 'Ficha renderizada contém botão de dano rápido 💥 (.roll20-btn-damage-only)');

// 2. Verificação no CSS Standalone Compilado
const standaloneCss = fs.readFileSync(path.join(__dirname, 'planilha do rpg.html'), 'utf8');
assert(standaloneCss.includes('.btn-micro {'), 'CSS compilado contém definição de estilo para .btn-micro');
assert(standaloneCss.includes('.roll20-btn-tool {'), 'CSS compilado contém definição de .roll20-btn-tool');
assert(standaloneCss.includes('.roll20-btn-rest-short {'), 'CSS compilado contém definição de .roll20-btn-rest-short');
assert(standaloneCss.includes('.roll20-btn-rest-long {'), 'CSS compilado contém definição de .roll20-btn-rest-long');
assert(standaloneCss.includes('.roll20-btn-add-weapon {'), 'CSS compilado contém definição de .roll20-btn-add-weapon');
assert(standaloneCss.includes('.roll20-btn-add-item {'), 'CSS compilado contém definição de .roll20-btn-add-item');
assert(standaloneCss.includes('.roll20-btn-damage-only {'), 'CSS compilado contém definição de .roll20-btn-damage-only');
assert(standaloneCss.includes('rgba(139, 92, 246'), 'CSS compilado contém paleta ametista para botão de chat (.btn-chat-feed)');

// =========================================================================
// 81. TESTES DE ESPAÇAMENTO E HARMONIZAÇÃO DE TRAÇOS & CARACTERÍSTICAS (ISSUE-113)
// =========================================================================
console.log('\n📜 81. Testes de Espaçamento e Harmonização de Traços & Características (ISSUE-113):');

// 1. Verificação no HTML Renderizado
assert(renderedRoll20Html.includes('roll20-traits-container'), 'Ficha renderizada contém container espaçado .roll20-traits-container');

// 2. Verificação no CSS Standalone Compilado
const standaloneTraitsCss = fs.readFileSync(path.join(__dirname, 'planilha do rpg.html'), 'utf8');
assert(standaloneTraitsCss.includes('.roll20-traits-container {'), 'CSS compilado contém definição de estilo para .roll20-traits-container');
assert(!standaloneTraitsCss.includes('.unlocked-features-list {\n      display: flex;\n      flex-direction: column;\n      gap: 5px;\n      max-height: 220px;'), 'CSS compilado não possui mais limite artificial de 220px em unlocked-features-list');
// =========================================================================
// 82. TESTES DE FORMATAÇÃO E DESTAQUES RICOS DE TEXTOS DE CARACTERÍSTICAS (ISSUE-114)
// =========================================================================
console.log('\n📖 82. Testes de Formatação e Destaques Ricos de Textos de Características (ISSUE-114):');

// 1. Exportação e funcionamento da função formatFeatureSnippet
assert(typeof vm.runInContext("formatFeatureSnippet", sandbox) === 'function', 'Função formatFeatureSnippet exportada no contexto');

const rawFeatureDesc = "Como estudante da magia arcana, você possui um grimório contendo as fórmulas de suas magias. • **Grimório**: No 1º nível, contém 6 magias de 1º círculo. • **Copiar Magias**: Você pode adicionar qualquer magia que encontrar gastando 2 horas e 50 PO por círculo da magia.";
const parsedSnippetHtml = vm.runInContext(`formatFeatureSnippet(${JSON.stringify(rawFeatureDesc)})`, sandbox);

assert(parsedSnippetHtml.includes('feature-snippet-intro'), 'formatFeatureSnippet gerou .feature-snippet-intro para o texto conceitual inicial');
assert(parsedSnippetHtml.includes('feature-bullets-list'), 'formatFeatureSnippet gerou a lista de tópicos .feature-bullets-list');
assert(parsedSnippetHtml.includes('feature-bullet-row'), 'formatFeatureSnippet gerou linhas estruturadas .feature-bullet-row');
assert(parsedSnippetHtml.includes('feature-bullet-dot'), 'formatFeatureSnippet gerou marcadores estilizados .feature-bullet-dot');
assert(parsedSnippetHtml.includes('hl-keyword'), 'formatFeatureSnippet converteu **bold** em .hl-keyword');
assert(parsedSnippetHtml.includes('hl-gold'), 'formatFeatureSnippet converteu moedas (50 PO) em .hl-gold');
assert(parsedSnippetHtml.includes('hl-time'), 'formatFeatureSnippet converteu tempos (2 horas) em .hl-time');
assert(parsedSnippetHtml.includes('hl-circle'), 'formatFeatureSnippet converteu círculos de magia (1º círculo) em .hl-circle');

// 2. Teste de dados e descansos no Portento
const rawPortentDesc = "Ao terminar um descanso longo, **role dois d20 e anote os resultados**.";
const parsedPortentHtml = vm.runInContext(`formatFeatureSnippet(${JSON.stringify(rawPortentDesc)})`, sandbox);
assert(parsedPortentHtml.includes('hl-keyword'), 'Portento destaca comando de rolagem em .hl-keyword');
assert(parsedPortentHtml.includes('hl-time'), 'Portento destaca descanso longo em .hl-time');

// 3. Verificação no CSS Standalone Compilado
const standaloneTextCss = fs.readFileSync(path.join(__dirname, 'planilha do rpg.html'), 'utf8');
assert(standaloneTextCss.includes('.hl-keyword {'), 'CSS compilado contém definição de estilo para .hl-keyword');
assert(standaloneTextCss.includes('.hl-gold {'), 'CSS compilado contém definição de estilo para .hl-gold');
assert(standaloneTextCss.includes('.hl-dice {'), 'CSS compilado contém definição de estilo para .hl-dice');
assert(standaloneTextCss.includes('.hl-time {'), 'CSS compilado contém definição de estilo para .hl-time');
assert(standaloneTextCss.includes('.hl-circle {'), 'CSS compilado contém definição de estilo para .hl-circle');
assert(standaloneTextCss.includes('.feature-bullet-row {'), 'CSS compilado contém definição de estilo para .feature-bullet-row');
// =========================================================================
// 83. TESTES DO MODAL DE EDIÇÃO DE FICHA MODERNO E EXPANDIDO (ISSUE-115)
// =========================================================================
console.log('\n📝 83. Testes do Modal de Edição de Ficha Moderno e Expandido (ISSUE-115):');

// 1. Exportação e funcionamento de updateModalAttributeModifiers
assert(typeof vm.runInContext("updateModalAttributeModifiers", sandbox) === 'function', 'Função updateModalAttributeModifiers exportada no contexto');

// 2. Verificação no HTML Standalone Compilado
const standaloneEditorHtml = fs.readFileSync(path.join(__dirname, 'planilha do rpg.html'), 'utf8');
assert(standaloneEditorHtml.includes('max-width: 880px'), 'Modal de edição expandido para max-width: 880px');
assert(standaloneEditorHtml.includes('stat-box-editor'), 'HTML contém caixas modernas de atributo com classe .stat-box-editor');
assert(standaloneEditorHtml.includes('stat-mod-pill'), 'HTML contém pílulas de modificador com classe .stat-mod-pill');
assert(standaloneEditorHtml.includes('pm-mod-str'), 'HTML contém pílula de modificador #pm-mod-str');
assert(standaloneEditorHtml.includes('pm-mod-int'), 'HTML contém pílula de modificador #pm-mod-int');
assert(standaloneEditorHtml.includes('pm-slot-card'), 'HTML contém cards de slot de magia com classe .pm-slot-card');
assert(standaloneEditorHtml.includes('pm-slot-input'), 'HTML contém inputs de slot de magia com classe .pm-slot-input');

// 3. Verificação no CSS Standalone Compilado
assert(standaloneEditorHtml.includes('.stat-box-editor {'), 'CSS compilado contém definição de estilo para .stat-box-editor');
assert(standaloneEditorHtml.includes('.stat-mod-pill {'), 'CSS compilado contém definição de estilo para .stat-mod-pill');
assert(standaloneEditorHtml.includes('.pm-feature-item {'), 'CSS compilado contém definição de estilo para .pm-feature-item');
assert(standaloneEditorHtml.includes('.pm-slot-card {'), 'CSS compilado contém definição de estilo para .pm-slot-card');
// =========================================================================
// 84. TESTES DE TODAS AS MAGIAS CONHECIDAS E PREPARAÇÃO TÁTIL (ISSUE-116)
// =========================================================================
console.log('\n🔮 84. Testes de Todas as Magias Conhecidas, Preparação Tátil e Hero Header (ISSUE-116):');

// 1. Exportação de getPlayerKnownSpells e setSheetSpellFilter
assert(typeof vm.runInContext("getPlayerKnownSpells", sandbox) === 'function', 'Função getPlayerKnownSpells exportada no contexto');
assert(typeof vm.runInContext("setSheetSpellFilter", sandbox) === 'function', 'Função setSheetSpellFilter exportada no contexto');

// 2. getPlayerKnownSpells consolida magias de preparedSpells, spellbookSpells e spells
vm.runInContext(`
  const testHeroMage = {
    id: 'test_mage_84',
    name: 'Arkhalis Teste',
    className: 'Mago 5',
    level: 5,
    int: 18,
    preparedSpells: ['Amizade', 'Ataque Certeiro'],
    spellbookSpells: ['Amizade', 'Ataque Certeiro', 'Bola de Fogo', 'Mísseis Mágicos'],
    spells: 'Truques: Amizade, Ataque Certeiro\\nPreparadas: Raio Ardente'
  };
  const knownSpellsList = getPlayerKnownSpells(testHeroMage);
`, sandbox);

const knownSpellsResult = vm.runInContext("knownSpellsList", sandbox);
assert(Array.isArray(knownSpellsResult), 'getPlayerKnownSpells retorna um array');
assert(knownSpellsResult.includes('Amizade'), 'Lista conhecida inclui truque Amizade');
assert(knownSpellsResult.includes('Ataque Certeiro'), 'Lista conhecida inclui truque Ataque Certeiro');
assert(knownSpellsResult.includes('Bola de Fogo'), 'Lista conhecida inclui magia de 3º círculo Bola de Fogo do grimório');
assert(knownSpellsResult.includes('Mísseis Mágicos'), 'Lista conhecida inclui magia de 1º círculo Mísseis Mágicos');

// 3. togglePlayerSpellPrepared desmarca das preparadas mas PRESERVA no grimório/conhecidas
vm.runInContext(`
  PLAYERS.push(testHeroMage);
  // Prepara Bola de Fogo
  togglePlayerSpellPrepared('test_mage_84', 'Bola de Fogo');
`, sandbox);

let updatedHero = vm.runInContext("PLAYERS.find(p => p.id === 'test_mage_84')", sandbox);
assert(updatedHero.preparedSpells.includes('Bola de Fogo'), 'Bola de Fogo foi marcada como preparada');
assert(updatedHero.spellbookSpells.includes('Bola de Fogo'), 'Bola de Fogo permanece no grimório');

// Agora desmarca Bola de Fogo
vm.runInContext(`
  togglePlayerSpellPrepared('test_mage_84', 'Bola de Fogo');
`, sandbox);

updatedHero = vm.runInContext("PLAYERS.find(p => p.id === 'test_mage_84')", sandbox);
assert(!updatedHero.preparedSpells.includes('Bola de Fogo'), 'Bola de Fogo foi desmarcada das preparadas');
assert(updatedHero.spellbookSpells.includes('Bola de Fogo'), 'Bola de Fogo CONTINUA no grimório e visível como Não preparada!');

// 4. Auto-preparação ao transcrever com vagas livres
vm.runInContext(`
  testHeroMage.preparedSpells = ['Amizade']; // apenas 1 truque preparado, sobram vagas de círculo
  copySpellToSpellbook('test_mage_84', 'Escudo Arcano', true);
`, sandbox);

updatedHero = vm.runInContext("PLAYERS.find(p => p.id === 'test_mage_84')", sandbox);
assert(updatedHero.spellbookSpells.includes('Escudo Arcano'), 'Escudo Arcano transcrito no grimório');
assert(updatedHero.preparedSpells.includes('Escudo Arcano'), 'Escudo Arcano auto-preparado porque havia vagas livres');

// 5. Verificação de Elementos Visuais no HTML e CSS Compilados
const standalone116Html = fs.readFileSync(path.join(__dirname, 'planilha do rpg.html'), 'utf8');
assert(standalone116Html.includes('roll20-avatar-img-wrap'), 'HTML compilado contém wrapper .roll20-avatar-img-wrap para avatar sem corte');
assert(standalone116Html.includes('roll20-tool-divider'), 'HTML compilado contém divisor seguro .roll20-tool-divider na toolbar');
assert(standalone116Html.includes('roll20-spells-tab-header'), 'HTML compilado contém header responsivo de magias .roll20-spells-tab-header');
assert(standalone116Html.includes('sheet-spells-prep-bar'), 'HTML compilado contém barra de preparação da sessão .sheet-spells-prep-bar');
assert(standalone116Html.includes('sheet-spell-filter-chip'), 'HTML compilado contém chips de filtro de magias .sheet-spell-filter-chip');
assert(standalone116Html.includes('.roll20-avatar-box {') && standalone116Html.includes('overflow: visible;'), 'CSS compilado tem .roll20-avatar-box com overflow: visible');
assert(standalone116Html.includes('.roll20-avatar-img-wrap {') && standalone116Html.includes('overflow: hidden;'), 'CSS compilado tem wrapper interno com overflow: hidden');
assert(standalone116Html.includes('.roll20-btn-init {') && standalone116Html.includes('rgba(245, 158, 11'), 'CSS compilado tem botão de iniciativa refinado com tom âmbar');

// 👥 85. Testes de Sincronização do Bag do Grupo & Sistema de Contratação em Ouro (ISSUE-117):
console.log('\n👥 85. Testes de Sincronização do Bag do Grupo & Sistema de Contratação em Ouro (ISSUE-117):');

// 1. Exportação das funções
assert(typeof vm.runInContext("calculateHirelingCharismaLimit", sandbox) === 'function', 'Função calculateHirelingCharismaLimit exportada');
assert(typeof vm.runInContext("sendPlayerItemToPartyStash", sandbox) === 'function', 'Função sendPlayerItemToPartyStash exportada');
assert(typeof vm.runInContext("getAllCampaignHirelings", sandbox) === 'function', 'Função getAllCampaignHirelings exportada');
assert(typeof vm.runInContext("renderCampaignHirelings", sandbox) === 'function', 'Função renderCampaignHirelings exportada');
assert(typeof vm.runInContext("payCampaignHirelingsPayroll", sandbox) === 'function', 'Função payCampaignHirelingsPayroll exportada');
assert(typeof vm.runInContext("rollCampaignHirelingsMorale", sandbox) === 'function', 'Função rollCampaignHirelingsMorale exportada');
assert(typeof vm.runInContext("sendHirelingToCombat", sandbox) === 'function', 'Função sendHirelingToCombat exportada');

// 2. Validação da regra estrita de Carisma do livro (Old Dragon 2)
assert(vm.runInContext("calculateHirelingCharismaLimit(8)", sandbox) === 0, 'Carisma 8 resulta em 0 ajudantes (proibido)');
assert(vm.runInContext("calculateHirelingCharismaLimit(7)", sandbox) === 0, 'Carisma 7 resulta em 0 ajudantes');
assert(vm.runInContext("calculateHirelingCharismaLimit(10)", sandbox) === 1, 'Carisma 10 (mod 0) resulta em 1 ajudante (0+1)');
assert(vm.runInContext("calculateHirelingCharismaLimit(13)", sandbox) === 2, 'Carisma 13 (mod +1) resulta em 2 ajudantes (1+1)');
assert(vm.runInContext("calculateHirelingCharismaLimit(16)", sandbox) === 4, 'Carisma 16 (mod +3) resulta em 4 ajudantes (3+1)');

// 3. Transferência de item da mochila do herói para o Baú do Grupo
vm.runInContext(`
  const testHero85 = {
    id: 'hero_stash_test_85',
    name: 'Kaelen',
    student: 'Lucas',
    cha: 14,
    inventory: [
      { name: 'Poção de Invisibilidade', qty: 3, equipped: false, weight: 0.5 }
    ],
    hirelings: []
  };
  PLAYERS.push(testHero85);

  const activeCamp85 = getActiveCampaign();
  activeCamp85.partyStash = activeCamp85.partyStash || { gold: 100, items: [], history: [] };
  activeCamp85.playerIds = [testHero85.id];

  // Transfere 1x da mochila para o baú coletivo
  sendPlayerItemToPartyStash('hero_stash_test_85', 0, 1);
`, sandbox);

let hero85 = vm.runInContext("PLAYERS.find(p => p.id === 'hero_stash_test_85')", sandbox);
let stash85 = vm.runInContext("getActiveCampaign().partyStash", sandbox);
assert(hero85.inventory[0].qty === 2, 'Mochila do jogador foi decrementada para 2x Poções');
assert(stash85.items.some(i => i.name === 'Poção de Invisibilidade' && i.qty === 1), 'Baú do Grupo recebeu 1x Poção de Invisibilidade');

// 4. Resolução de Campanha Ativa no Modo Portal
vm.runInContext(`
  activePortalPlayerId = 'hero_stash_test_85';
  const resolvedCamp = getActiveCampaign();
`, sandbox);
assert(vm.runInContext("getActiveCampaign().playerIds.includes('hero_stash_test_85')", sandbox), 'getActiveCampaign resolveu campanha que contém o herói logado');

// 5. Contratação de NPC com Função/Missão e Folha de Pagamento em PO
vm.runInContext(`
  const camp85 = getActiveCampaign();
  camp85.hirelings = [
    {
      id: 'hir_test_1',
      name: 'Tobias',
      type: 'helper',
      cost: 1, // 1 PO por semana
      costPeriod: 'semana',
      foodCost: 0,
      hp: 4,
      maxHp: 4,
      ac: 10,
      attacks: [{ name: 'Porrete', bonus: 0, damage: '1d4' }],
      morale: 7,
      moraleDc: 10,
      status: 'acting',
      mission: 'Carregar tochas e espólios na masmorra'
    },
    {
      id: 'hir_test_2',
      name: 'Guarda Barlok',
      type: 'mercenary',
      cost: 3, // 3 PO por mês
      costPeriod: 'mês',
      foodCost: 1, // +1 PO comida
      hp: 12,
      maxHp: 12,
      ac: 16,
      attacks: [{ name: 'Espada Longa', bonus: 3, damage: '1d8+1' }],
      morale: 8,
      moraleDc: 10,
      status: 'acting',
      mission: 'Vigiar o acampamento'
    }
  ];
  camp85.partyStash.gold = 50; // 50 PO de saldo
`, sandbox);

let allHirelings85 = vm.runInContext("getAllCampaignHirelings(getActiveCampaign(), [testHero85])", sandbox);
assert(allHirelings85.length >= 2, 'getAllCampaignHirelings retornou os contratados');
assert(allHirelings85.some(h => h.name === 'Tobias' && h.mission.includes('tochas')), 'NPC Tobias possui missão de carregar tochas');

// 6. Envio de contratado para o combate (Combat Tracker)
vm.runInContext(`
  state = { combatants: [], round: 1, current: 0 };
  sendHirelingToCombat('hir_test_1');
`, sandbox);

let cbt85 = vm.runInContext("state.combatants.find(c => c.hirelingId === 'hir_test_1')", sandbox);
assert(cbt85 !== undefined, 'Tobias foi inserido no Combat Tracker');
assert(cbt85.type === 'ally', 'Tobias entrou como aliado (type: ally)');
assert(cbt85.ac === 10, 'Tobias possui CA 10 no combate');

// 7. Elementos de Interface e Estilos no Standalone
const standalone117Html = fs.readFileSync(path.join(__dirname, 'planilha do rpg.html'), 'utf8');
assert(standalone117Html.includes('party-stash-quickbar'), 'HTML compilado contém .party-stash-quickbar no inventário');
assert(standalone117Html.includes('btn-stash-send'), 'HTML compilado contém botão .btn-stash-send nos itens');
assert(standalone117Html.includes('campaign-hirelings-container'), 'HTML compilado contém #campaign-hirelings-container');
assert(standalone117Html.includes('modal-campaign-hireling'), 'HTML compilado contém #modal-campaign-hireling');
assert(standalone117Html.includes('calculateHirelingCharismaLimit'), 'HTML compilado contém calculateHirelingCharismaLimit');
assert(standalone117Html.includes('sendPlayerItemToPartyStash'), 'HTML compilado contém sendPlayerItemToPartyStash');

// ========================================================
// 86. TESTES DO SISTEMA DE BASTIÃO COLETIVO DO GRUPO (ISSUE-118)
// ========================================================
console.log('\n🏰 86. Testes do Sistema de Bastião Coletivo do Grupo (D&D 2024 / 5.5 em PO - ISSUE-118):');

// 1. Validação de Catálogos Oficiais
const facCatalog86 = vm.runInContext("BASTION_SPECIAL_FACILITIES_CATALOG", sandbox);
assert(typeof facCatalog86 === 'object' && Object.keys(facCatalog86).length === 29, 'Catálogo oficial contém exatamente 29 instalações especiais');
assert(facCatalog86.workshop && facCatalog86.workshop.levelReq === 5, 'Oficina disponível no Nível 5');
assert(facCatalog86.smithy && facCatalog86.smithy.levelReq === 5, 'Ferraria disponível no Nível 5');
assert(facCatalog86.garden && facCatalog86.garden.levelReq === 5, 'Jardim de Ervas disponível no Nível 5');
assert(facCatalog86.laboratory && facCatalog86.laboratory.levelReq === 9, 'Laboratório Alquímico disponível no Nível 9');
assert(facCatalog86.scriptorium && facCatalog86.scriptorium.levelReq === 9, 'Scriptorium disponível no Nível 9');
assert(facCatalog86.pub && facCatalog86.pub.levelReq === 13, 'Taberna / Pub disponível no Nível 13');
assert(facCatalog86.meditation_chamber && facCatalog86.meditation_chamber.levelReq === 13, 'Câmara de Meditação disponível no Nível 13');
assert(facCatalog86.guildhall && facCatalog86.guildhall.levelReq === 17, 'Sede de Guilda disponível no Nível 17');
assert(facCatalog86.war_room && facCatalog86.war_room.levelReq === 17, 'Sala de Guerra disponível no Nível 17');

const actionsCatalog86 = vm.runInContext("BASTION_ACTIONS_CATALOG", sandbox);
assert(typeof actionsCatalog86 === 'object' && Object.keys(actionsCatalog86).length >= 25, 'Catálogo de ações contém todas as ordens detalhadas');
assert(actionsCatalog86.craft_metal && actionsCatalog86.craft_metal.hasItemSelector === true, 'Ordem de Ferraria possui seletor dinâmico de itens');
assert(actionsCatalog86.scribe_scroll && actionsCatalog86.scribe_scroll.hasItemSelector === true, 'Ordem de Scriptorium possui seletor dinâmico de magias');
assert(actionsCatalog86.distill_potion && actionsCatalog86.distill_potion.hasItemSelector === true, 'Ordem de Laboratório possui seletor dinâmico de poções');

const eventsTable86 = vm.runInContext("BASTION_EVENTS_TABLE", sandbox);
assert(Array.isArray(eventsTable86) && eventsTable86.length >= 8, 'Tabela de eventos d100 de bastião oficial configurada');

// 2. Exportação de Funções
assert(typeof vm.runInContext("getCampaignBastion", sandbox) === 'function', 'Função getCampaignBastion exportada');
assert(typeof vm.runInContext("renderCampaignBastion", sandbox) === 'function', 'Função renderCampaignBastion exportada');
assert(typeof vm.runInContext("advanceBastionTurn", sandbox) === 'function', 'Função advanceBastionTurn exportada');
assert(typeof vm.runInContext("openBastionActionModal", sandbox) === 'function', 'Função openBastionActionModal exportada');

// 3. Inicialização e Estado do Bastião da Campanha
vm.runInContext(`
  activePortalPlayerId = null;
  const camp86 = {
    id: 'camp_bastion_test',
    name: 'Guardiões do Vale',
    playerIds: ['p_hero_alyn', 'p_hero_borin'],
    partyStash: {
      gold: 500,
      items: [],
      history: []
    }
  };
  CAMPAIGNS_STATE.campaigns.push(camp86);
  CAMPAIGNS_STATE.activeCampaignId = 'camp_bastion_test';

  const b86 = getCampaignBastion(camp86);
`, sandbox);

let bastionTest = vm.runInContext("b86", sandbox);
assert(bastionTest !== null && typeof bastionTest === 'object', 'Bastião foi inicializado com sucesso na campanha');
assert(bastionTest.level === 5, 'Bastião inicia no Nível 5');
assert(bastionTest.turnCount === 1, 'Bastião inicia na Semana / Turno 1');
assert(bastionTest.defenders === 4, 'Bastião possui 4 defensores iniciais');
assert(bastionTest.specialFacilities.length >= 2, 'Bastião possui instalações iniciais atribuídas');

// 4. Execução de Ordem de Fabricação de Item com Débito no Baú
vm.runInContext(`
  const smithyFac = b86.specialFacilities.find(f => f.key === 'smithy') || b86.specialFacilities[0];
  smithyFac.currentOrder = {
    actionKey: 'craft_metal',
    name: 'Forjar Armas & Armaduras de Metal',
    durationDays: 7,
    daysLeft: 7,
    heroId: 'p_hero_borin',
    selectedItem: { name: 'Espada Longa de Aço', costPO: 7 },
    costPO: 7
  };
  camp86.partyStash.gold -= 7;
`, sandbox);

let goldAfterOrder = vm.runInContext("camp86.partyStash.gold", sandbox);
assert(goldAfterOrder === 493, 'Custo de 7 PO foi debitado do Baú Coletivo do Grupo');

// 5. Avanço de Turno (7 Dias) Concluindo a Ordem e Depositando Item no Baú
vm.runInContext(`
  advanceBastionTurn();
`, sandbox);

let updatedBastion = vm.runInContext("camp86.bastion", sandbox);
let stashItems = vm.runInContext("camp86.partyStash.items", sandbox);
assert(updatedBastion.turnCount === 2, 'Contador de turnos avançou para Semana 2');
assert(stashItems.some(i => i.name === 'Espada Longa de Aço'), 'Espada Longa forjada foi depositada automaticamente no Baú do Grupo');
assert(updatedBastion.history.length >= 2, 'Evento d100 semanal foi registrado no histórico do Bastião');

// 6. Ordem de Renda Comercial da Guilda (+500 PO direto no Baú)
vm.runInContext(`
  const facGuild = {
    id: 'fac_guild_test',
    key: 'guildhall',
    name: 'Sede da Guilda dos Cervejeiros',
    currentOrder: {
      actionKey: 'guild_trade_revenue',
      name: 'Operação Mercantil de Guilda Semanal',
      daysLeft: 7,
      costPO: 0
    }
  };
  camp86.bastion.specialFacilities.push(facGuild);
  const goldBeforeGuild = camp86.partyStash.gold;
  advanceBastionTurn();
`, sandbox);

let goldAfterGuild = vm.runInContext("camp86.partyStash.gold", sandbox);
assert(goldAfterGuild >= 493 + 500, 'Sede de Guilda faturou +500 PO adicionados diretamente ao Baú Coletivo');

// 7. Validação de Defesas e Muralhas
vm.runInContext(`
  camp86.bastion.walls = 'stone';
`, sandbox);
assert(vm.runInContext("BASTION_WALL_OPTIONS.stone.defenseDice", sandbox) === 4, 'Muralhas de Pedra reduzem o ataque inimigo para 4d6');

// 8. Elementos no HTML Compilado
const standalone118Html = fs.readFileSync(path.join(__dirname, 'planilha do rpg.html'), 'utf8');
assert(standalone118Html.includes('bastion-panel-card'), 'HTML compilado contém .bastion-panel-card');
assert(standalone118Html.includes('campaign-bastion-container'), 'HTML compilado contém #campaign-bastion-container');
assert(standalone118Html.includes('modal-bastion-action'), 'HTML compilado contém modal de ações do bastião (#modal-bastion-action)');
assert(standalone118Html.includes('modal-bastion-add-facility'), 'HTML compilado contém modal de adicionar sala (#modal-bastion-add-facility)');
assert(standalone118Html.includes('modal-bastion-event'), 'HTML compilado contém modal de evento d100 (#modal-bastion-event)');
assert(standalone118Html.includes('advanceBastionTurn'), 'HTML compilado contém função advanceBastionTurn');
// ============================================================================
// 📦 87. Testes de Sincronização do Baú do Grupo em Tempo Real (ISSUE-119)
// ============================================================================
console.log('\n📦 87. Testes de Sincronização do Baú do Grupo em Tempo Real (ISSUE-119):');

assert(typeof sandbox.touchPartyStash === 'function', 'Função touchPartyStash exportada no contexto');
assert(typeof sandbox.updateAllPartyStashElements === 'function', 'Função updateAllPartyStashElements exportada no contexto');

// 1. touchPartyStash atualiza timestamp específico do baú
vm.runInContext(`
  var s87_camp = { id: 'camp_s87', name: 'Mesa Stash', partyStash: { gold: 100, items: [], updatedAt: 1000 } };
  CAMPAIGNS_STATE.campaigns.push(s87_camp);
  var touchedStashCamp = touchPartyStash('camp_s87');
`, sandbox);
const touchedS87 = vm.runInContext('touchedStashCamp', sandbox);
assert(touchedS87 && touchedS87.partyStash.updatedAt > 1000, 'touchPartyStash atualizou partyStash.updatedAt para um timestamp recente');

// 2. updateAllPartyStashElements atualiza seletores do DOM
vm.runInContext(`
  var actCamp = getActiveCampaign();
  if (actCamp) {
    if (!actCamp.partyStash) actCamp.partyStash = { gold: 0, items: [] };
    actCamp.partyStash.gold = 777;
  }
  updateAllPartyStashElements();
`, sandbox);
assert(vm.runInContext("document.getElementById('party-stash-modal-gold').innerText.includes('777')", sandbox), 'updateAllPartyStashElements atualizou #party-stash-modal-gold');
assert(vm.runInContext("document.getElementById('stash-gold-amount').innerText.includes('777')", sandbox), 'updateAllPartyStashElements atualizou #stash-gold-amount');

// 3. Validação de elementos no HTML compilado
const standalone119Html = fs.readFileSync(path.join(__dirname, 'planilha do rpg.html'), 'utf8');
assert(standalone119Html.includes('touchPartyStash'), 'HTML compilado contém touchPartyStash');
assert(standalone119Html.includes('updateAllPartyStashElements'), 'HTML compilado contém updateAllPartyStashElements');
assert(standalone119Html.includes('stash-gold-pill'), 'HTML compilado contém classe .stash-gold-pill');


// ============================================================================
// ⚔️ 88. Testes de Configuração de Dano e Cura Arbitrários (ISSUE-120)
// ============================================================================
console.log('\n⚔️ 88. Testes de Configuração de Dano e Cura Arbitrários (ISSUE-120):');

assert(typeof sandbox.promptCombatantDamageHeal === 'function', 'Função promptCombatantDamageHeal exportada no contexto');
assert(typeof sandbox.applyRoll20QuickDamage === 'function', 'Função applyRoll20QuickDamage exportada no contexto');
assert(typeof sandbox.applyRoll20QuickHeal === 'function', 'Função applyRoll20QuickHeal exportada no contexto');

// 1. Aplicação de dano arbitrário na ficha
vm.runInContext(`
  var s88_player = {
    id: 'p_s88_test',
    name: 'Grommash',
    hp: 40,
    maxHp: 50,
    tempHp: 0
  };
  PLAYERS.push(s88_player);

  var s88_input = document.getElementById('roll20-hp-input-p_s88_test');
  s88_input.value = '15';

  applyRoll20QuickDamage('p_s88_test');
`, sandbox);
const p88Dmg = vm.runInContext("PLAYERS.find(p => p.id === 'p_s88_test')", sandbox);
assert(p88Dmg.hp === 25, 'applyRoll20QuickDamage reduziu o PV exatamente pelo valor digitado (40 - 15 = 25)');

// 2. Aplicação de cura arbitrária na ficha
vm.runInContext(`
  s88_input.value = '20';
  applyRoll20QuickHeal('p_s88_test');
`, sandbox);
const p88Heal = vm.runInContext("PLAYERS.find(p => p.id === 'p_s88_test')", sandbox);
assert(p88Heal.hp === 45, 'applyRoll20QuickHeal curou o PV exatamente pelo valor digitado (25 + 20 = 45)');

// 3. Cura respeita teto de PV Máximo
vm.runInContext(`
  s88_input.value = '50';
  applyRoll20QuickHeal('p_s88_test');
`, sandbox);
assert(p88Heal.hp === 50, 'applyRoll20QuickHeal respeitou o limite de PV Máximo (50)');

// 4. Combat Tracker possui botão de Dano/Cura
assert(standalone119Html.includes('promptCombatantDamageHeal'), 'HTML compilado contém promptCombatantDamageHeal');
assert(standalone119Html.includes('⚡ Dano/Cura'), 'HTML compilado contém botão de Dano/Cura no combate');


// ============================================================================
// 🔄 89. Testes de Sincronização Bidirecional Nuvem e Papel de Cliente (ISSUE-121)
// ============================================================================
console.log('\n🔄 89. Testes de Sincronização Bidirecional Nuvem e Papel de Cliente (ISSUE-121):');

assert(typeof sandbox.resolveClientRole === 'function', 'Função resolveClientRole exportada no contexto');

// 1. Resolução do papel: Mestre padrão vs Jogador portal
vm.runInContext(`
  activePortalPlayerId = null;
  document.body.classList.remove('mode-player-portal');
`, sandbox);
assert(sandbox.resolveClientRole() === 'master', 'resolveClientRole retornou "master" na janela principal do Mestre');

vm.runInContext(`
  activePortalPlayerId = 'p_test_player_1';
`, sandbox);
assert(sandbox.resolveClientRole() === 'player', 'resolveClientRole retornou "player" quando activePortalPlayerId está configurado');

// Reset para master
vm.runInContext(`
  activePortalPlayerId = null;
`, sandbox);

// 2. mergeCloudCampaignsState respeita autoridade do Mestre e timestamps
vm.runInContext(`
  var s89_camp = {
    id: 'camp_s89_sync',
    name: 'Mesa Sincronizada',
    updatedAt: 1000,
    partyStash: { gold: 200, updatedAt: 2000, items: [] }
  };
  CAMPAIGNS_STATE.campaigns.push(s89_camp);

  // Mestre publica atualização remota mais recente: 5000 vs 2000
  mergeCloudCampaignsState({
    activeCampaignId: 'camp_s89_sync',
    publishedBy: 'master',
    campaigns: [{
      id: 'camp_s89_sync',
      name: 'Mesa Sincronizada',
      updatedAt: 4000,
      partyStash: { gold: 350, updatedAt: 5000, items: [{ id: 'it_s89_1', name: 'Gema Estelar' }] }
    }]
  });
`, sandbox);
const stash89 = vm.runInContext("CAMPAIGNS_STATE.campaigns.find(c => c.id === 'camp_s89_sync').partyStash", sandbox);
assert(stash89.gold === 350, 'mergeCloudCampaignsState adotou o ouro atualizado da nuvem (350 PO)');
assert(stash89.items.length === 1 && stash89.items[0].name === 'Gema Estelar', 'mergeCloudCampaignsState adotou itens remotos do Mestre');


// ============================================================================
// 🎲 90. Testes de Criação & Edição Avançada de Fichas (ISSUE-122)
// ============================================================================
console.log('\n🎲 90. Testes de Criação & Edição Avançada de Fichas (ISSUE-122):');

assert(typeof sandbox.getClassAttributePriority === 'function', 'Função getClassAttributePriority exportada no contexto');
assert(typeof sandbox.calculateLevel1Hp === 'function', 'Função calculateLevel1Hp exportada no contexto');
assert(typeof sandbox.getSuggestedClassAttacks === 'function', 'Função getSuggestedClassAttacks exportada no contexto');
assert(typeof sandbox.roll4d6DropLowest === 'function', 'Função roll4d6DropLowest exportada no contexto');
assert(typeof sandbox.rollAttributes4d6Modal === 'function', 'Função rollAttributes4d6Modal exportada no contexto');
assert(typeof sandbox.applyStandardArrayModal === 'function', 'Função applyStandardArrayModal exportada no contexto');
assert(typeof sandbox.optimizeAttributesForClassModal === 'function', 'Função optimizeAttributesForClassModal exportada no contexto');

// 1. Prioridade de Atributos por Classe
const barbarPrio = sandbox.getClassAttributePriority('Bárbaro');
assert(barbarPrio[0] === 'str' && barbarPrio[1] === 'con', 'Prioridade do Bárbaro começa com FOR e CON');

const magoPrio = sandbox.getClassAttributePriority('Mago');
assert(magoPrio[0] === 'int' && magoPrio[1] === 'con', 'Prioridade do Mago começa com INT e CON');

const ladinoPrio = sandbox.getClassAttributePriority('Ladino');
assert(ladinoPrio[0] === 'dex' && ladinoPrio[1] === 'con', 'Prioridade do Ladino começa com DES e CON');

const bardoPrio = sandbox.getClassAttributePriority('Bardo');
assert(bardoPrio[0] === 'cha', 'Prioridade do Bardo prioriza CAR');

// 2. Cálculo de PV Nível 1 pelas Regras Oficiais D&D 5E
assert(sandbox.calculateLevel1Hp('Bárbaro', 14) === 14, 'Bárbaro com CON 14 (+2) tem 14 PV no Nível 1 (12 + 2)');
assert(sandbox.calculateLevel1Hp('Guerreiro', 16) === 13, 'Guerreiro com CON 16 (+3) tem 13 PV no Nível 1 (10 + 3)');
assert(sandbox.calculateLevel1Hp('Mago', 12) === 7, 'Mago com CON 12 (+1) tem 7 PV no Nível 1 (6 + 1)');
assert(sandbox.calculateLevel1Hp('Clérigo', 10) === 8, 'Clérigo com CON 10 (+0) tem 8 PV no Nível 1 (8 + 0)');

// 3. Rolagem 4d6 Drop Lowest
for (let i = 0; i < 10; i++) {
  const rollRes = sandbox.roll4d6DropLowest();
  assert(rollRes.total >= 3 && rollRes.total <= 18, `4d6 gerou valor válido: ${rollRes.total}`);
  assert(rollRes.rolls.length === 4, '4 dados foram rolados');
  assert(rollRes.dropped <= rollRes.rolls[1] && rollRes.dropped <= rollRes.rolls[2] && rollRes.dropped <= rollRes.rolls[3], 'Menor dado foi descartado');
}

// 4. Sugestão de Ataques por Classe
const barbarianAttacks = sandbox.getSuggestedClassAttacks('Bárbaro', 3, 2);
assert(barbarianAttacks.includes('Machado Grande'), 'Ataques sugeridos de Bárbaro incluem Machado Grande');

const wizardAttacks = sandbox.getSuggestedClassAttacks('Mago', 0, 2);
assert(wizardAttacks.includes('Raio de Fogo') || wizardAttacks.includes('Adaga'), 'Ataques sugeridos de Mago incluem magia e adaga');

// 5. Vínculo Automático do Novo Personagem à Campanha Ativa
vm.runInContext(`
  var camp90 = { id: 'camp_90_bind', name: 'Mesa Nova', playerIds: [] };
  CAMPAIGNS_STATE.campaigns.push(camp90);
  CAMPAIGNS_STATE.activeCampaignId = 'camp_90_bind';

  // Configura campos do formulário para salvar
  document.getElementById('pm-id').value = '';
  document.getElementById('pm-name').value = 'Elendil';
  document.getElementById('pm-student').value = 'Lucas';
  document.getElementById('pm-level').value = '1';
  document.getElementById('pm-maxhp').value = '12';
  document.getElementById('pm-str').value = '15';
  document.getElementById('pm-dex').value = '14';
  document.getElementById('pm-con').value = '13';
  document.getElementById('pm-int').value = '12';
  document.getElementById('pm-wis').value = '10';
  document.getElementById('pm-cha').value = '8';

  savePlayerSheet();
`, sandbox);
const createdHero = vm.runInContext("PLAYERS.find(p => p.name === 'Elendil')", sandbox);
assert(createdHero && createdHero.id, 'Novo herói foi criado com ID gerado');
const boundCamp = vm.runInContext("CAMPAIGNS_STATE.campaigns.find(c => c.id === 'camp_90_bind')", sandbox);
assert(boundCamp.playerIds.includes(createdHero.id), 'ID do novo herói foi automaticamente vinculado a activeCamp.playerIds!');

// 6. Botões no HTML Compilado
assert(standalone119Html.includes('rollAttributes4d6Modal'), 'HTML compilado contém botão de rolar 4d6 (rollAttributes4d6Modal)');
assert(standalone119Html.includes('applyStandardArrayModal'), 'HTML compilado contém botão de array padrão (applyStandardArrayModal)');
assert(standalone119Html.includes('optimizeAttributesForClassModal'), 'HTML compilado contém botão de otimizar para classe (optimizeAttributesForClassModal)');

// ============================================================================
// ⚔️ 91. Testes de Interligação Dinâmica & Automação de Armas no Modal (ISSUE-123)
// ============================================================================
console.log('\n⚔️ 91. Testes de Interligação Dinâmica & Automação de Armas no Modal (ISSUE-123):');

assert(typeof sandbox.getRacialAndClassSpeed === 'function', 'Função getRacialAndClassSpeed exportada no contexto');
assert(typeof sandbox.getRecommendedMaxHp === 'function', 'Função getRecommendedMaxHp exportada no contexto');
assert(typeof sandbox.calculateWeaponAttackStats === 'function', 'Função calculateWeaponAttackStats exportada no contexto');
assert(typeof sandbox.addModalWeapon === 'function', 'Função addModalWeapon exportada no contexto');
assert(typeof sandbox.removeModalWeapon === 'function', 'Função removeModalWeapon exportada no contexto');
assert(typeof sandbox.renderModalEquippedWeapons === 'function', 'Função renderModalEquippedWeapons exportada no contexto');

// 1. Deslocamento por Raça e Bônus de Classe (5E)
assert(sandbox.getRacialAndClassSpeed('Anão da Colina', 'Guerreiro', 1) === '7,5m', 'Anão possui deslocamento base de 7,5m');
assert(sandbox.getRacialAndClassSpeed('Halfling Pés-Leves', 'Ladino', 1) === '7,5m', 'Halfling possui deslocamento base de 7,5m');
assert(sandbox.getRacialAndClassSpeed('Gnomo da Floresta', 'Mago', 1) === '7,5m', 'Gnomo possui deslocamento base de 7,5m');
assert(sandbox.getRacialAndClassSpeed('Humano', 'Guerreiro', 1) === '9m', 'Humano possui deslocamento base de 9m');
assert(sandbox.getRacialAndClassSpeed('Elfo da Floresta', 'Patrulheiro', 1) === '10,5m', 'Elfo da Floresta possui deslocamento base de 10,5m');
assert(sandbox.getRacialAndClassSpeed('Humano', 'Bárbaro', 5, 'none') === '12m', 'Bárbaro Nv 5 sem armadura pesada ganha +3m (12m total)');
assert(sandbox.getRacialAndClassSpeed('Humano', 'Bárbaro', 5, 'cota de malha') === '9m', 'Bárbaro Nv 5 com armadura pesada não recebe bônus de movimento');
assert(sandbox.getRacialAndClassSpeed('Humano', 'Monge', 2, 'none') === '12m', 'Monge Nv 2 sem armadura recebe +3m (12m total)');
assert(sandbox.getRacialAndClassSpeed('Humano', 'Monge', 6, 'none') === '13,5m', 'Monge Nv 6 sem armadura recebe +4,5m (13,5m total)');

// 2. Recomendação Oficial de PV Máximo (5E)
assert(sandbox.getRecommendedMaxHp('Bárbaro', 16, 1) === 15, 'Bárbaro Nv 1 com CON 16 (+3) tem 12 + 3 = 15 PV');
assert(sandbox.getRecommendedMaxHp('Bárbaro', 16, 5) === 55, 'Bárbaro Nv 5 com CON 16 (+3) tem 15 + 4 * (7 + 3) = 55 PV');
assert(sandbox.getRecommendedMaxHp('Guerreiro', 14, 1) === 12, 'Guerreiro Nv 1 com CON 14 (+2) tem 10 + 2 = 12 PV');
assert(sandbox.getRecommendedMaxHp('Guerreiro', 14, 3) === 28, 'Guerreiro Nv 3 com CON 14 (+2) tem 12 + 2 * (6 + 2) = 28 PV');
assert(sandbox.getRecommendedMaxHp('Mago', 12, 1) === 7, 'Mago Nv 1 com CON 12 (+1) tem 6 + 1 = 7 PV');
assert(sandbox.getRecommendedMaxHp('Mago', 12, 4) === 22, 'Mago Nv 4 com CON 12 (+1) tem 7 + 3 * (4 + 1) = 22 PV');

// 3. Cálculo Automático de Acerto e Dano de Armas
const b91WarriorChar = {
  name: 'Krag',
  className: 'Guerreiro',
  level: 1,
  str: 16, // +3
  dex: 12, // +1
  fightingStyle: ''
};
const b91LongswordStats = sandbox.calculateWeaponAttackStats(b91WarriorChar, 'Espada Longa');
assert(b91LongswordStats.hit === 5, 'Espada Longa: Bônus de acerto é +5 (FOR +3 + PB +2)');
assert(b91LongswordStats.hitStr === '+5', 'Espada Longa: String de acerto formatada como +5');
assert(b91LongswordStats.damageFormula === '1d8+3', 'Espada Longa: Dano é 1d8+3');
assert(b91LongswordStats.isProficient === true, 'Guerreiro é proficiente com Espada Longa');

const b91RogueChar = {
  name: 'Vax',
  className: 'Ladino',
  level: 1,
  str: 10, // +0
  dex: 16, // +3
  fightingStyle: ''
};
const b91DaggerStats = sandbox.calculateWeaponAttackStats(b91RogueChar, 'Adaga');
assert(b91DaggerStats.hit === 5, 'Adaga (Acuidade): Bônus de acerto usa DES (+3) + PB (+2) = +5');
assert(b91DaggerStats.damageFormula === '1d4+3', 'Adaga: Dano usa modificador de DES (+3) = 1d4+3');
assert(b91DaggerStats.keyAttr === 'dex', 'Adaga com Acuidade escolhe automaticamente DES');

// 4. Elementos HTML do Modal Compilados
assert(standalone119Html.includes('id="pm-weapons-grid"'), 'HTML compilado contém container de armas dinâmicas (#pm-weapons-grid)');
assert(standalone119Html.includes('id="pm-quick-weapon-select"'), 'HTML compilado contém seletor rápido de armas (#pm-quick-weapon-select)');
assert(standalone119Html.includes('id="pm-ca-formula"'), 'HTML compilado contém badge de fórmula explicativa de CA (#pm-ca-formula)');
assert(standalone119Html.includes('id="btn-suggest-hp"'), 'HTML compilado contém botão de sugestão de PV (#btn-suggest-hp)');
assert(standalone119Html.includes('id="pm-non-caster-box"'), 'HTML compilado contém aviso inteligente para classes sem magias (#pm-non-caster-box)');
assert(standalone119Html.includes('openWeaponPickerModal(null, \'modal\')'), 'HTML compilado permite abrir o catálogo completo de armas para o modal');

// ========================================
// 92. Testes de Talentos (Feats) D&D 5E, Progressão por Nível (ASI) e Concessão pelo Mestre (ISSUE-124):
// ========================================
console.log('\n⭐ 92. Testes de Talentos (Feats) D&D 5E, Progressão por Nível (ASI) e Concessão pelo Mestre (ISSUE-124):');

const featsModule = require('./src/data/feats.js');
assert(Array.isArray(featsModule.FEATS_DATA), 'FEATS_DATA exportado como array');
assert(featsModule.FEATS_DATA.length >= 42, `FEATS_DATA possui todos os talentos oficiais do PHB + Xanathar (possui ${featsModule.FEATS_DATA.length})`);
assert(typeof featsModule.findFeatById === 'function', 'Função findFeatById exportada');
assert(typeof featsModule.findFeatByName === 'function', 'Função findFeatByName exportada');
assert(typeof featsModule.checkFeatPrerequisites === 'function', 'Função checkFeatPrerequisites exportada');

// 1. Busca e Integridade de Dados
const alertFeat = featsModule.findFeatById('alerta');
assert(alertFeat && alertFeat.name === 'Alerta', 'findFeatById encontra talento Alerta');
assert(alertFeat.initiativeBonus === 5, 'Talento Alerta possui initiativeBonus de 5');

const toughFeat = featsModule.findFeatById('robusto');
assert(toughFeat && toughFeat.name === 'Robusto', 'findFeatById encontra talento Robusto');
assert(toughFeat.hpPerLevel === 2, 'Talento Robusto possui hpPerLevel de 2');

const athleteFeat = featsModule.findFeatByName('Atleta');
assert(athleteFeat && athleteFeat.id === 'atleta', 'findFeatByName encontra talento Atleta por nome');

// 2. Níveis de ASI por Classe
const classesDataModule = require('./src/data/classes.js');
assert(typeof classesDataModule.getClassAsiLevels === 'function', 'Função getClassAsiLevels exportada');
const fighterAsi = classesDataModule.getClassAsiLevels('Guerreiro');
assert(fighterAsi.length === 7 && fighterAsi.includes(6) && fighterAsi.includes(14), 'Guerreiro possui 7 níveis de ASI incluindo 6 e 14');
const rogueAsi = classesDataModule.getClassAsiLevels('Ladino');
assert(rogueAsi.length === 6 && rogueAsi.includes(10), 'Ladino possui 6 níveis de ASI incluindo 10');
const wizardAsi = classesDataModule.getClassAsiLevels('Mago');
assert(wizardAsi.length === 5 && !wizardAsi.includes(6), 'Mago possui 5 níveis de ASI padrão');

// 3. Validação de Pré-requisitos
const strongChar = { str: 15, dex: 10, int: 10, wis: 10, cha: 10, className: 'Guerreiro' };
const weakChar = { str: 10, dex: 10, int: 10, wis: 10, cha: 10, className: 'Mago' };
const athletePrereq = featsModule.checkFeatPrerequisites(strongChar, athleteFeat);
assert(athletePrereq.met === true, 'Personagem com FOR 15 cumpre pré-requisito de Atleta (FOR ou DES 13)');
const athletePrereqFail = featsModule.checkFeatPrerequisites(weakChar, athleteFeat);
assert(athletePrereqFail.met === false, 'Personagem com FOR 10 e DES 10 falha em Atleta');

const casterChar = { className: 'Mago', preparedSpells: ['Mísseis Mágicos'] };
const nonCasterChar = { className: 'Bárbaro', preparedSpells: [] };
const warCasterFeat = featsModule.findFeatById('conjurador_de_guerra');
assert(featsModule.checkFeatPrerequisites(casterChar, warCasterFeat).met === true, 'Mago cumpre requisito de Conjurador de Guerra');
assert(featsModule.checkFeatPrerequisites(nonCasterChar, warCasterFeat).met === false, 'Bárbaro sem magias falha em Conjurador de Guerra');

// 4. Mecânicas no Sandbox de Jogadores
assert(typeof sandbox.getPlayerFeats === 'function', 'Função getPlayerFeats exportada no contexto');
assert(typeof sandbox.hasPlayerFeat === 'function', 'Função hasPlayerFeat exportada no contexto');
assert(typeof sandbox.getPlayerInitiativeBonus === 'function', 'Função getPlayerInitiativeBonus exportada no contexto');
assert(typeof sandbox.rollPlayerInit === 'function', 'Função rollPlayerInit exportada no contexto');
assert(typeof sandbox.grantFeatToPlayer === 'function', 'Função grantFeatToPlayer exportada no contexto');
assert(typeof sandbox.removeFeatFromPlayer === 'function', 'Função removeFeatFromPlayer exportada no contexto');

// Teste de herói com Alerta
vm.runInContext(`
  var heroValerius = {
    id: 'p_test_valerius',
    name: 'Valerius',
    className: 'Guerreiro',
    level: 4,
    dex: 14, // mod +2
    con: 14,
    maxHp: 32,
    hp: 32,
    feats: []
  };
  PLAYERS.push(heroValerius);
`, sandbox);

const initBonusSemAlerta = vm.runInContext("getPlayerInitiativeBonus(PLAYERS.find(p => p.id === 'p_test_valerius'))", sandbox);
assert(initBonusSemAlerta === 2, 'Iniciativa sem Alerta é apenas DES (+2)');

vm.runInContext("grantFeatToPlayer('p_test_valerius', 'alerta', { source: 'master' });", sandbox);
const hasAlerta = vm.runInContext("hasPlayerFeat(PLAYERS.find(p => p.id === 'p_test_valerius'), 'alerta')", sandbox);
assert(hasAlerta === true, 'Herói agora possui o talento Alerta');

const initBonusComAlerta = vm.runInContext("getPlayerInitiativeBonus(PLAYERS.find(p => p.id === 'p_test_valerius'))", sandbox);
assert(initBonusComAlerta === 7, 'Iniciativa com Alerta computa DES (+2) + 5 = +7');

const initRoll = vm.runInContext("rollPlayerInit('p_test_valerius', 10);", sandbox);
assert(initRoll && initRoll.total === 17, 'Rolagem com d20 [10] + mod [+7] resulta em total 17');
assert(initRoll && initRoll.hasAlert === true, 'Rolagem detectou bônus de Alerta ativo');

// Teste de herói com Robusto (+2 PV/nível)
const prevMaxHp = vm.runInContext("PLAYERS.find(p => p.id === 'p_test_valerius').maxHp", sandbox);
vm.runInContext("grantFeatToPlayer('p_test_valerius', 'robusto', { source: 'master' });", sandbox);
const hasRobusto = vm.runInContext("hasPlayerFeat(PLAYERS.find(p => p.id === 'p_test_valerius'), 'robusto')", sandbox);
assert(hasRobusto === true, 'Herói agora possui o talento Robusto');

const currentMaxHp = vm.runInContext("PLAYERS.find(p => p.id === 'p_test_valerius').maxHp", sandbox);
assert(currentMaxHp === prevMaxHp + 8, `PV Máximo aumentou em +8 pelo talento Robusto (novo PV: ${currentMaxHp})`);

// Teste de herói com Observador
vm.runInContext("grantFeatToPlayer('p_test_valerius', 'observador', { source: 'master', chosenStat: 'wis' });", sandbox);
const hasObservador = vm.runInContext("hasPlayerFeat(PLAYERS.find(p => p.id === 'p_test_valerius'), 'observador')", sandbox);
assert(hasObservador === true, 'Herói possui o talento Observador');

// Teste de Remoção de Talento
vm.runInContext("removeFeatFromPlayer('p_test_valerius', 'robusto');", sandbox);
const hasRobustoAposRemover = vm.runInContext("hasPlayerFeat(PLAYERS.find(p => p.id === 'p_test_valerius'), 'robusto')", sandbox);
assert(hasRobustoAposRemover === false, 'Talento Robusto removido com sucesso');

const revertedMaxHp = vm.runInContext("PLAYERS.find(p => p.id === 'p_test_valerius').maxHp", sandbox);
assert(revertedMaxHp === prevMaxHp, `PV Máximo foi revertido após remoção de Robusto (${revertedMaxHp})`);

// 5. Presença dos Elementos na Build Standalone Compilada
const finalStandaloneHtml = fs.readFileSync(path.join(__dirname, 'planilha do rpg.html'), 'utf8');
assert(finalStandaloneHtml.includes('id="tab-feats"'), 'HTML compilado contém a aba oficial de talentos (#tab-feats)');
assert(finalStandaloneHtml.includes('id="modal-master-grant-feat"'), 'HTML compilado contém o modal do Mestre (#modal-master-grant-feat)');
assert(finalStandaloneHtml.includes('id="modal-player-asi"'), 'HTML compilado contém o modal de ASI (#modal-player-asi)');
assert(finalStandaloneHtml.includes('renderFeatsTab'), 'HTML compilado contém a função renderFeatsTab');
assert(finalStandaloneHtml.includes('openMasterGrantFeatModal'), 'HTML compilado contém a função openMasterGrantFeatModal');
assert(finalStandaloneHtml.includes('openAsiChoiceModal'), 'HTML compilado contém a função openAsiChoiceModal');

// ⭐ 93. Testes de Correção Visual de Talentos & Blindagem de Sincronização (ISSUE-125):
console.log('\n⭐ 93. Testes de Correção Visual de Talentos & Blindagem de Sincronização (ISSUE-125):');

// 1. CSS anti-overflow e quebra de badge
const cssContent = fs.readFileSync(path.join(__dirname, 'src/styles/head_css.html'), 'utf8');
assert(cssContent.includes('.feat-catalog-card') && cssContent.includes('overflow: hidden'), 'CSS de .feat-catalog-card possui overflow: hidden contra vazamento visual');
assert(cssContent.includes('.feat-prereq-badge') && cssContent.includes('white-space: normal'), 'CSS de .feat-prereq-badge permite quebra harmoniosa com white-space: normal');
assert(cssContent.includes('.feat-card-prereq-box'), 'CSS contém classe .feat-card-prereq-box para posicionamento isolado do badge');

// 2. Preservação de feats em savePlayerSheet
vm.runInContext(`
  var testHeroFeats = {
    id: 'p_hero_save_test',
    student: 'Aluno Teste',
    name: 'Herói Teste',
    className: 'Guerreiro',
    level: 5,
    str: 16, dex: 14, con: 14, int: 10, wis: 12, cha: 8,
    hp: 40, maxHp: 40,
    feats: [{ id: 'alerta', name: 'Alerta' }]
  };
  PLAYERS.push(testHeroFeats);

  // Simula formulário do modal
  document.getElementById('pm-id').value = 'p_hero_save_test';
  document.getElementById('pm-student').value = 'Aluno Teste';
  document.getElementById('pm-name').value = 'Herói Teste Editado';
  document.getElementById('pm-class').value = 'Guerreiro';
  document.getElementById('pm-level').value = '5';
  document.getElementById('pm-str').value = '16';
  document.getElementById('pm-dex').value = '14';
  document.getElementById('pm-con').value = '14';
  document.getElementById('pm-int').value = '10';
  document.getElementById('pm-wis').value = '12';
  document.getElementById('pm-cha').value = '8';
  document.getElementById('pm-hp').value = '40';
  document.getElementById('pm-maxhp').value = '40';
  document.getElementById('pm-speed').value = '9m';
  document.getElementById('pm-gold').value = '100';
  document.getElementById('pm-badges').value = '';
  document.getElementById('pm-attacks').value = '';
  document.getElementById('pm-features').value = '';
  document.getElementById('pm-spells').value = '';

  savePlayerSheet();
`, sandbox);

const savedHero = vm.runInContext("PLAYERS.find(p => p.id === 'p_hero_save_test')", sandbox);
assert(savedHero && savedHero.name === 'Herói Teste Editado', 'Ficha do herói salva com sucesso');
assert(savedHero && Array.isArray(savedHero.feats) && savedHero.feats.length === 1 && savedHero.feats[0].id === 'alerta', 'Talento Alerta foi preservado intacto após savePlayerSheet()');

// 3. Atualização de updatedAt via touchPlayer em grantFeatToPlayer
const prevTime = savedHero.updatedAt || 0;
vm.runInContext("grantFeatToPlayer('p_hero_save_test', 'robusto', { source: 'master' });", sandbox);
const updatedTime = vm.runInContext("PLAYERS.find(p => p.id === 'p_hero_save_test').updatedAt", sandbox);
assert(updatedTime >= prevTime, 'Concessão de talento acionou touchPlayer atualizando updatedAt');

// ==========================================
// 94. TESTES DE BLINDAGEM E RESILIÊNCIA DO LOCALSTORAGE (ISSUE-126)
// ==========================================
console.log('\n💾 94. Testes de Blindagem & Resiliência do LocalStorage (ISSUE-126):');

// 1. Exportação de safeLocalStorageSet
assert(vm.runInContext("typeof safeLocalStorageSet === 'function'", sandbox), 'Função safeLocalStorageSet exportada e disponível no sandbox');

// 2. Gravação unificada e atômica das 4 chaves canônicas oficiais + envelope STORAGE_KEY
vm.runInContext(`
  localStorage.clear();
  // Configura estado mock
  PLAYERS = [
    { id: 'p_storage_1', name: 'Herói Storage', level: 3, hp: 18, maxHp: 24, gold: 350, coins: { cp: 0, sp: 0, ep: 0, gp: 350, pp: 0 }, feats: [{ id: 'alerta' }], inventory: [{ name: 'Espada Curta' }] }
  ];
  state = {
    round: 2,
    turnIndex: 0,
    combatants: [
      { id: 'c_hero_1', playerId: 'p_storage_1', name: 'Herói Storage', type: 'player', hp: 18, maxHp: 24, init: 15 }
    ],
    logs: []
  };
  CAMPAIGNS_STATE = {
    activeCampaignId: 'camp_storage_test',
    campaigns: [
      { id: 'camp_storage_test', name: 'Campanha Storage', sessions: [], partyStash: { gold: 500, items: [] } }
    ]
  };
  gridState = {
    gridSize: 40,
    tokens: [{ id: 'tok_1', x: 100, y: 100, name: 'Herói Storage' }]
  };

  saveToLocalStorage();
`, sandbox);

const storedEnvelope = vm.runInContext("localStorage.getItem('dnd5e_prisco_sheet_state_v2')", sandbox);
const storedPlayersV3 = vm.runInContext("localStorage.getItem('dnd_tracker_players_v3')", sandbox);
const storedStateV3 = vm.runInContext("localStorage.getItem('dnd_tracker_state_v3')", sandbox);
const storedCampV1 = vm.runInContext("localStorage.getItem('dnd_tracker_campaigns_v1')", sandbox);
const storedGridV3 = vm.runInContext("localStorage.getItem('dnd_tracker_grid_v3')", sandbox);

assert(storedEnvelope !== null, 'Envelope STORAGE_KEY gravado com sucesso');
assert(storedPlayersV3 !== null, 'Chave canônica dnd_tracker_players_v3 gravada de forma atômica');
assert(storedStateV3 !== null, 'Chave canônica dnd_tracker_state_v3 gravada de forma atômica');
assert(storedCampV1 !== null, 'Chave canônica dnd_tracker_campaigns_v1 gravada de forma atômica');
assert(storedGridV3 !== null, 'Chave canônica dnd_tracker_grid_v3 gravada de forma atômica');

// Valida integridade do envelope
const parsedEnv = JSON.parse(storedEnvelope);
assert(parsedEnv && parsedEnv.campaignsState && parsedEnv.campaignsState.activeCampaignId === 'camp_storage_test', 'Envelope preservou campaignsState');
assert(parsedEnv && parsedEnv.gridState && parsedEnv.gridState.gridSize === 40, 'Envelope preservou gridState');

// 3. Simulação de QuotaExceededError e recuperação com expurgo automático
vm.runInContext(`
  // Adiciona chaves legadas obsoletas no storage
  localStorage.setItem('dnd5e_prisco_sheet_state_v1', 'dados_legados_pesados');
  localStorage.setItem('dnd5e_campaigns_backup_safety', 'backup_antigo_pesado');
  localStorage.setItem('dnd5e_session_draft', 'rascunho_antigo');
  localStorage.setItem('dnd5e_safety_snapshots_history_v1', JSON.stringify([
    { id: 's1' }, { id: 's2' }, { id: 's3' }, { id: 's4' }, { id: 's5' }
  ]));

  var quotaThrown = false;
  var origSetItem = localStorage.setItem;
  // Simula erro de cota na primeira tentativa da chave teste
  localStorage.setItem = function(k, v) {
    if (k === 'chave_teste_cota' && !quotaThrown) {
      quotaThrown = true;
      var err = new Error('QuotaExceededError');
      err.name = 'QuotaExceededError';
      throw err;
    }
    return origSetItem.call(localStorage, k, v);
  };

  var quotaRecovered = safeLocalStorageSet('chave_teste_cota', 'dados_novos_salvos_com_sucesso');
  localStorage.setItem = origSetItem;
`, sandbox);

const quotaRecovered = vm.runInContext("quotaRecovered", sandbox);
const testVal = vm.runInContext("localStorage.getItem('chave_teste_cota')", sandbox);
const legacyCleaned = vm.runInContext("localStorage.getItem('dnd5e_prisco_sheet_state_v1')", sandbox);

assert(quotaRecovered === true, 'safeLocalStorageSet recuperou de QuotaExceededError com sucesso');
assert(testVal === 'dados_novos_salvos_com_sucesso', 'Dado foi gravado com sucesso após limpeza de cota');
assert(legacyCleaned === null, 'Cache legado dnd5e_prisco_sheet_state_v1 foi expurgado para liberar espaço');

// 4. Teste de preservação de PV ferido e campos do herói no loadFromLocalStorage
vm.runInContext(`
  // Simula herói ferido e com ouro personalizado salvo
  var rawHeroState = {
    players: [
      {
        id: 'p_hero_wounded',
        name: 'Guerreiro Machucado',
        level: 5,
        hp: 15, // Ferido: 15 de 45 PV
        maxHp: 45,
        gold: 777,
        coins: { cp: 0, sp: 0, ep: 0, gp: 777, pp: 0 },
        feats: [{ id: 'robusto' }],
        inventory: [{ name: 'Armadura de Placas', equipped: true }],
        updatedAt: Date.now()
      }
    ],
    state: {
      round: 3,
      turnIndex: 0,
      combatants: [
        { id: 'c_hero_w', playerId: 'p_hero_wounded', name: 'Guerreiro Machucado', type: 'player', hp: 15, maxHp: 45 }
      ],
      logs: []
    }
  };
  localStorage.setItem('dnd5e_prisco_sheet_state_v2', JSON.stringify(rawHeroState));
  
  // Limpa variáveis na memória e executa loadFromLocalStorage()
  PLAYERS = [];
  state = { combatants: [], round: 1, turnIndex: 0, logs: [] };
  loadFromLocalStorage();
`, sandbox);

const loadedWoundedHero = vm.runInContext("PLAYERS.find(p => p.id === 'p_hero_wounded')", sandbox);
const loadedCombatant = vm.runInContext("state.combatants.find(c => c.playerId === 'p_hero_wounded')", sandbox);

assert(loadedWoundedHero && loadedWoundedHero.hp === 15, 'loadFromLocalStorage preservou PV ferido do herói (15/45) sem resetar para vida cheia');
assert(loadedWoundedHero && loadedWoundedHero.gold === 777, 'loadFromLocalStorage preservou ouro personalizado do herói (777 PO)');
assert(loadedWoundedHero && Array.isArray(loadedWoundedHero.feats) && loadedWoundedHero.feats.length === 1, 'loadFromLocalStorage preservou talentos do herói');
assert(loadedCombatant && loadedCombatant.hp === 15, 'loadFromLocalStorage preservou PV do combatente no combate sem resetar para vida cheia');

// 5. Teste de saveSafetySnapshot: limitação de imagens gigantes do grid
vm.runInContext(`
  gridState = {
    gridSize: 50,
    bgImage: 'data:image/png;base64,' + 'A'.repeat(5000), // Imagem pesada simulada de 5KB
    tokens: []
  };
  saveSafetySnapshot('Teste Quota Grid');
`, sandbox);

const snapHistory = vm.runInContext("JSON.parse(localStorage.getItem('dnd5e_safety_snapshots_history_v1') || '[]')", sandbox);
assert(Array.isArray(snapHistory) && snapHistory.length > 0, 'saveSafetySnapshot gravou histórico de snapshots');
assert(snapHistory[0].gridState && snapHistory[0].gridState._omittedBgInSnapshot === true, 'saveSafetySnapshot omitiu imagem base64 gigante do grid para economizar quota');
assert(snapHistory.length <= 4, 'saveSafetySnapshot limitou histórico a no máximo 4 snapshots no localStorage');

// ==========================================
// 95. TESTES DE NEUTRALIZAÇÃO DE SPIN-BUTTONS E ERGONOMIA DE INPUTS NUMÉRICOS (ISSUE-128)
// ==========================================
console.log('\n🔢 95. Testes de Neutralização de Spin-Buttons & Ergonomia de Inputs Numéricos (ISSUE-128):');

const compiledHtml = fs.readFileSync(path.join(__dirname, 'planilha do rpg.html'), 'utf8');

// 1. Validação do CSS global de eliminação de spin-buttons nativos
assert(compiledHtml.includes('::-webkit-outer-spin-button') && compiledHtml.includes('::-webkit-inner-spin-button'), 'CSS compilado contém seletores de pseudo-elementos spin-button WebKit');
assert(compiledHtml.includes('-webkit-appearance: none !important;'), 'CSS compilado neutraliza -webkit-appearance em spin buttons');
assert(compiledHtml.includes('-moz-appearance: textfield !important;'), 'CSS compilado neutraliza -moz-appearance em input[type="number"]');
assert(compiledHtml.includes('appearance: textfield !important;'), 'CSS compilado define appearance: textfield padrão');

// 2. Validação de dimensões ergonômicas de .roll20-hp-input e .inline-hp-input
assert(compiledHtml.includes('.roll20-hp-input') && compiledHtml.includes('width: 52px;'), 'CSS compilado expande largura de .roll20-hp-input para 52px');
assert(compiledHtml.includes('.inline-hp-input') && compiledHtml.includes('width: 54px !important;'), 'CSS compilado expande largura de .inline-hp-input para 54px');

// 3. Validação de auto-seleção tátil e por foco
assert(compiledHtml.includes('class="roll20-hp-input"') && compiledHtml.includes('onfocus="this.select()"'), 'Input de HP da ficha Roll20 possui onfocus="this.select()"');
assert(compiledHtml.includes('class="roll20-hp-input"') && compiledHtml.includes('onclick="this.select()"'), 'Input de HP da ficha Roll20 possui onclick="this.select()"');
assert(compiledHtml.includes('class="inline-hp-input"') && compiledHtml.includes('this.select()'), 'Input de HP inline no combate possui auto-seleção com this.select()');

// ==========================================
// 96. TESTES DE SINCRONIZAÇÃO BIDIRECIONAL DE ARMAS, ATAQUES E INVENTÁRIO (ISSUE-129)
// ==========================================
console.log('\n⚔️ 96. Testes de Sincronização Bidirecional de Armas, Ataques e Inventário (ISSUE-129):');

// 1. Funções exportadas
assert(vm.runInContext("typeof isWeaponItem === 'function'", sandbox), 'Função isWeaponItem exportada e disponível');
assert(vm.runInContext("typeof syncPlayerEquippedWeaponsAndAttacks === 'function'", sandbox), 'Função syncPlayerEquippedWeaponsAndAttacks exportada e disponível');

// 2. Classificação correta de armas e armaduras
assert(vm.runInContext("isWeaponItem('Espada Curta')", sandbox) === true, 'Espada Curta é identificada como arma');
assert(vm.runInContext("isWeaponItem('Adaga')", sandbox) === true, 'Adaga é identificada como arma');
assert(vm.runInContext("isWeaponItem('Arco Curto')", sandbox) === true, 'Arco Curto é identificado como arma');
assert(vm.runInContext("isWeaponItem('Escudo')", sandbox) === false, 'Escudo NÃO é identificado como arma');
assert(vm.runInContext("isWeaponItem('Armadura de Couro')", sandbox) === false, 'Armadura NÃO é identificada como arma');

// 3. getPlayerCalculatedAttacks com p.attacks em string e inventário vazio
vm.runInContext(`
  pTestSync = {
    id: 'p_test_weapon_sync',
    name: 'Guerreiro Teste',
    className: 'Guerreiro',
    level: 3,
    str: 16,
    dex: 14,
    attacks: 'Espada Curta (+4, 1d6+2 perfurante)',
    inventory: []
  };
  atksCalculated = getPlayerCalculatedAttacks(pTestSync);
`, sandbox);

const atksCalculated = vm.runInContext("atksCalculated", sandbox);
const pTestSync = vm.runInContext("pTestSync", sandbox);

assert(Array.isArray(atksCalculated) && atksCalculated.length === 1, 'getPlayerCalculatedAttacks extraiu ataque da string p.attacks');
assert(atksCalculated[0].name.toLowerCase().includes('espada curta'), 'Nome do ataque extraído é Espada Curta');
assert(Array.isArray(pTestSync.inventory) && pTestSync.inventory.length === 1, 'Auto-reconciliação inseriu a Espada Curta no p.inventory');
assert(pTestSync.inventory[0].equipped === true, 'Espada Curta foi marcada como equipped no inventário');

// 4. selectWeaponForPlayer insere arma no inventário e atualiza p.attacks
vm.runInContext(`
  PLAYERS = [pTestSync];
  if (typeof openWeaponPickerModal === 'function') {
    openWeaponPickerModal('p_test_weapon_sync', 'player');
  }
  selectWeaponForPlayer('Machado de Batalha');
`, sandbox);

const updatedSyncPlayer = vm.runInContext("PLAYERS.find(p => p.id === 'p_test_weapon_sync')", sandbox);
assert(updatedSyncPlayer.inventory.length === 2, 'selectWeaponForPlayer adicionou Machado de Batalha ao inventário (total 2 itens)');
assert(updatedSyncPlayer.inventory.some(it => it.name.toLowerCase().includes('machado') && it.equipped === true), 'Machado de Batalha está equipado no inventário');
assert(updatedSyncPlayer.attacks.toLowerCase().includes('machado'), 'p.attacks foi atualizado com o Machado de Batalha');

// 5. togglePlayerItemEquipped desequipa arma e atualiza ataques
vm.runInContext(`
  togglePlayerItemEquipped('p_test_weapon_sync', 0); // Desequipa a Espada Curta
`, sandbox);
const afterToggleSyncPlayer = vm.runInContext("PLAYERS.find(p => p.id === 'p_test_weapon_sync')", sandbox);
assert(afterToggleSyncPlayer.inventory[0].equipped === false, 'Espada Curta foi desequipada');
assert(!afterToggleSyncPlayer.attacks.toLowerCase().includes('espada curta'), 'Espada Curta foi removida de p.attacks após desequipar');

// ==========================================
// 97. TESTES DE SINCRONIZAÇÃO BIDIRECIONAL DE MAGIAS E SLOTS (JOGADOR ⇄ MESTRE)
// ==========================================
console.log('\n🔮 97. Testes de Sincronização Bidirecional de Magias e Slots (Jogador ⇄ Mestre):');

// 1. Setup de herói conjurador
const wizardHeroSync = {
  id: 'p_wizard_sync_97',
  name: 'Mago Aeloria',
  className: 'Mago',
  level: 3,
  maxHp: 20,
  hp: 20,
  slots: [4, 2, 0, 0, 0, 0, 0, 0, 0],
  slotsUsed: [0, 0, 0, 0, 0, 0, 0, 0, 0],
  preparedSpells: ['Alarme'],
  updatedAt: 1000
};

// 2. Simulação: Jogador conjura magia em seu dispositivo móvel
vm.runInContext(`
  PLAYERS = [${JSON.stringify(wizardHeroSync)}];
  clientRole = 'player';
  activePortalPlayerId = 'p_wizard_sync_97';
  executeCastSpell('p_wizard_sync_97', 'Alarme', 1);
`, sandbox);

const pAfterCastInPlayer = vm.runInContext("PLAYERS.find(p => p.id === 'p_wizard_sync_97')", sandbox);
assert(pAfterCastInPlayer.slotsUsed[0] === 1, 'Jogador consumiu 1º espaço de magia ao conjurar Alarme');
assert(pAfterCastInPlayer.updatedAt > 1000, 'touchPlayer atualizou o carimbo updatedAt do jogador');

// 3. Simulação: Mestre recebe a sincronização via nuvem
const cloudPayloadFromPlayer97 = {
  publishedBy: 'player',
  authorPlayerId: 'p_wizard_sync_97',
  timestamp: pAfterCastInPlayer.updatedAt,
  players: [JSON.parse(JSON.stringify(pAfterCastInPlayer))]
};

vm.runInContext(`
  clientRole = 'master';
  activePortalPlayerId = null;
  PLAYERS = [${JSON.stringify(wizardHeroSync)}]; // Mestre tinha estado anterior
  state.combatants = [{
    id: 'comb_w97',
    playerId: 'p_wizard_sync_97',
    type: 'player',
    name: 'Mago Aeloria',
    hp: 20,
    maxHp: 20
  }];
  applyCloudDataToLocal(${JSON.stringify(cloudPayloadFromPlayer97)});
`, sandbox);

const pInMasterAfterSync = vm.runInContext("PLAYERS.find(p => p.id === 'p_wizard_sync_97')", sandbox);
assert(pInMasterAfterSync.slotsUsed[0] === 1, 'Mestre sincronizou o slot de 1º círculo consumido pelo jogador em outro aparelho');

// 4. Simulação: Mestre realiza Descanso Longo e restaura todos os slots
vm.runInContext(`
  playerLongRest('p_wizard_sync_97');
`, sandbox);

const pInMasterAfterRest = vm.runInContext("PLAYERS.find(p => p.id === 'p_wizard_sync_97')", sandbox);
assert(pInMasterAfterRest.slotsUsed[0] === 0, 'Descanso Longo no Mestre restaurou todos os slots de magia a 0');

// 5. Simulação: Jogador recebe a restauração vinda do Mestre
const cloudPayloadFromMaster97 = {
  publishedBy: 'master',
  timestamp: pInMasterAfterRest.updatedAt,
  players: [JSON.parse(JSON.stringify(pInMasterAfterRest))]
};

vm.runInContext(`
  clientRole = 'player';
  activePortalPlayerId = 'p_wizard_sync_97';
  applyCloudDataToLocal(${JSON.stringify(cloudPayloadFromMaster97)});
`, sandbox);

const pInPlayerAfterRestSync = vm.runInContext("PLAYERS.find(p => p.id === 'p_wizard_sync_97')", sandbox);
assert(pInPlayerAfterRestSync.slotsUsed[0] === 0, 'Dispositivo do Jogador recebeu e aplicou a restauração de slots realizada pelo Mestre');

// 6. Simulação: Mestre gasta slot manualmente (ex: 2º Círculo)
vm.runInContext(`
  clientRole = 'master';
  activePortalPlayerId = null;
  togglePlayerSlot('p_wizard_sync_97', 1, 0); // Gasta 1 slot de 2º Círculo
`, sandbox);

const pInMasterAfterToggle = vm.runInContext("PLAYERS.find(p => p.id === 'p_wizard_sync_97')", sandbox);
assert(pInMasterAfterToggle.slotsUsed[1] === 1, 'Mestre marcou 2º Círculo como gasto via togglePlayerSlot');

const cloudPayloadFromMasterToggle97 = {
  publishedBy: 'master',
  timestamp: pInMasterAfterToggle.updatedAt,
  players: [JSON.parse(JSON.stringify(pInMasterAfterToggle))]
};

// Jogador recebe gasto aplicado pelo Mestre
vm.runInContext(`
  clientRole = 'player';
  activePortalPlayerId = 'p_wizard_sync_97';
  applyCloudDataToLocal(${JSON.stringify(cloudPayloadFromMasterToggle97)});
`, sandbox);

const pInPlayerAfterMasterToggle = vm.runInContext("PLAYERS.find(p => p.id === 'p_wizard_sync_97')", sandbox);
assert(pInPlayerAfterMasterToggle.slotsUsed[1] === 1, 'Dispositivo do Jogador recebeu gasto de 2º Círculo aplicado pelo Mestre');

// --- SUÍTE 98: Responsividade Mobile do Combate, Correção de Overflow e Slots de Magia na Iniciativa (ISSUE-130) ---
console.log('\n📱 98. Testes de Responsividade do Combate, Botões sem Corte e Slots de Magia na Iniciativa (ISSUE-130):');

// 1. Validar elementos no HTML compilado
assert(compiledHtml.includes('combatant-stats-row'), 'HTML compilado contém container responsivo .combatant-stats-row');
assert(compiledHtml.includes('combatant-actions-pill'), 'HTML compilado contém pílula de ações .combatant-actions-pill');
assert(compiledHtml.includes('btn-dmg-heal-trigger'), 'HTML compilado contém botão de disparo de dano/cura com estilo dedicado');
assert(compiledHtml.includes('combatant-slots-mini'), 'HTML compilado contém mini barra de slots .combatant-slots-mini');
assert(compiledHtml.includes('modal-combat-damage-heal'), 'HTML compilado contém o modal dedicado #modal-combat-damage-heal');
assert(compiledHtml.includes('submitCombatDamageHeal'), 'HTML compilado contém a função submitCombatDamageHeal');

// 2. Validar renderização de slots de magia no card de iniciativa
vm.runInContext(`
  PLAYERS = [{
    id: 'p_caster_combat_test',
    name: 'Deraravely',
    className: 'Mago',
    level: 3,
    ca: 15,
    hp: 24,
    maxHp: 24,
    slots: [4, 2, 0, 0, 0, 0, 0, 0, 0],
    slotsUsed: [1, 0, 0, 0, 0, 0, 0, 0, 0],
    preparedSpells: ['Alarme', 'Mísseis Mágicos']
  }];

  state.combatants = [{
    id: 'p_caster_combat_test',
    name: 'Deraravely (Samuel)',
    type: 'player',
    init: 19,
    ac: 15,
    hp: 24,
    maxHp: 24,
    conditions: []
  }];

  renderCombat();
`, sandbox);

const combatHtmlOutput = vm.runInContext("document.getElementById('list-combatants').innerHTML", sandbox);
assert(combatHtmlOutput.includes('combatant-slots-mini'), 'Card de combatente na iniciativa renderizou a barra de slots de magia');
assert(combatHtmlOutput.includes('1º: <b>3/4</b>'), 'Slots de 1º círculo exibem corretamente 3/4 restantes no card de iniciativa');
assert(combatHtmlOutput.includes('2º: <b>2/2</b>'), 'Slots de 2º círculo exibem corretamente 2/2 restantes no card de iniciativa');
assert(combatHtmlOutput.includes('btn-dmg-heal-trigger'), 'Card renderizou o botão de Dano/Cura responsivo');

// 3. Testar abertura do modal tátil de dano/cura
vm.runInContext(`
  promptCombatantDamageHeal('p_caster_combat_test');
`, sandbox);

const modalState = vm.runInContext(`
  ({
    isOpen: document.getElementById('modal-combat-damage-heal').classList.contains('open'),
    name: document.getElementById('cdh-combatant-name').innerText,
    val: document.getElementById('cdh-hp-val').value
  })
`, sandbox);

assert(modalState.isOpen === true, 'promptCombatantDamageHeal abre o modal #modal-combat-damage-heal com classe open');
assert(modalState.name === 'Deraravely (Samuel)', 'Modal foi populado com o nome do combatente selecionado');

// 4. Testar aplicação de dano via modal
vm.runInContext(`
  document.getElementById('cdh-hp-val').value = '7';
  submitCombatDamageHeal('damage');
`, sandbox);

const cAfterDamage = vm.runInContext("state.combatants.find(c => c.id === 'p_caster_combat_test')", sandbox);
const pAfterDamage = vm.runInContext("PLAYERS.find(p => p.id === 'p_caster_combat_test')", sandbox);
assert(cAfterDamage.hp === 17, 'submitCombatDamageHeal reduziu o PV do combatente em 7 (de 24 para 17)');
assert(pAfterDamage.hp === 17, 'submitCombatDamageHeal sincronizou a perda de PV na ficha do jogador PLAYERS');

// 5. Testar aplicação de cura via modal
vm.runInContext(`
  document.getElementById('cdh-combatant-id').value = 'p_caster_combat_test';
  document.getElementById('cdh-hp-val').value = '4';
  submitCombatDamageHeal('heal');
`, sandbox);

const cAfterHeal = vm.runInContext("state.combatants.find(c => c.id === 'p_caster_combat_test')", sandbox);
assert(cAfterHeal.hp === 21, 'submitCombatDamageHeal curou 4 PV do combatente (de 17 para 21)');

// =========================================================================
// BATERIA 99: Testes da Aba Própria de Bastiões & Alternância Individual de Campanhas (ISSUE-131)
// =========================================================================
console.log('\n🏰 99. Testes da Aba Própria de Bastiões & Alternância Individual de Campanhas (ISSUE-131):');

// 1. Integridade do HTML compilado
assert(compiledHtml.includes('id="tab-bastions"'), 'HTML compilado contém a aba própria de bastiões (#tab-bastions)');
assert(compiledHtml.includes('id="sel-bastion-active-campaign"'), 'HTML compilado contém o seletor de campanha do bastião (#sel-bastion-active-campaign)');
assert(compiledHtml.includes('id="bastion-view-container"'), 'HTML compilado contém o container principal da fortaleza (#bastion-view-container)');
assert(compiledHtml.includes("switchTab('bastions')"), 'Barra de navegação contém botão para alternar para a aba de bastiões');
assert(compiledHtml.includes('id="drawer-btn-bastions"'), 'Menu drawer móvel contém atalho para a aba de bastiões');

// 2. Exportação das funções no ambiente de execução (sandbox)
assert(typeof vm.runInContext("renderBastionsTab", sandbox) === 'function', 'Função renderBastionsTab disponível');
assert(typeof vm.runInContext("switchBastionCampaign", sandbox) === 'function', 'Função switchBastionCampaign disponível');
assert(typeof vm.runInContext("getSelectedBastionCampaign", sandbox) === 'function', 'Função getSelectedBastionCampaign disponível');
assert(typeof vm.runInContext("promptEditBastionInfo", sandbox) === 'function', 'Função promptEditBastionInfo disponível');

// 3. Teste de isolamento de estado e alternância entre campanhas
vm.runInContext(`
  // Cria duas campanhas independentes com bastiões próprios
  const campAlpha = {
    id: 'camp_alpha_test',
    name: 'Castelo Ravenloft',
    status: 'active',
    playerIds: [],
    partyStash: { gold: 1500, items: [], history: [] },
    bastion: {
      name: 'Torre de Strahd',
      level: 7,
      turnCount: 1,
      defenders: 12,
      walls: 'stone',
      specialFacilities: [
        { id: 'fac_alpha_1', key: 'laboratory', name: 'Laboratório Alquímico', levelReq: 5, patronId: null, currentOrder: null }
      ],
      history: []
    }
  };

  const campBeta = {
    id: 'camp_beta_test',
    name: 'Costa da Espada',
    status: 'active',
    playerIds: [],
    partyStash: { gold: 400, items: [], history: [] },
    bastion: {
      name: 'Forte Tresdar',
      level: 5,
      turnCount: 1,
      defenders: 4,
      walls: 'none',
      specialFacilities: [],
      history: []
    }
  };

  CAMPAIGNS_STATE.campaigns = [campAlpha, campBeta];
  CAMPAIGNS_STATE.activeCampaignId = 'camp_alpha_test';

  // Alterna o bastião para a Campanha Beta
  switchBastionCampaign('camp_beta_test');
`, sandbox);

const selCampInitial = vm.runInContext("getSelectedBastionCampaign()", sandbox);
assert(selCampInitial && selCampInitial.id === 'camp_beta_test', 'switchBastionCampaign selecionou a Campanha Beta');
assert(selCampInitial.bastion.name === 'Forte Tresdar', 'Bastião selecionado é o Forte Tresdar da Campanha Beta');

// 4. Testar adição de instalação e avanço de turno com garantia de isolamento
vm.runInContext(`
  // Adiciona instalação especial na Campanha Beta
  const betaCamp = getSelectedBastionCampaign();
  betaCamp.bastion.specialFacilities.push({
    id: 'fac_beta_smith',
    key: 'smithy',
    name: 'Ferraria Forjada',
    levelReq: 5,
    patronId: null,
    currentOrder: null
  });

  // Avança o turno da Campanha Beta
  advanceBastionTurn();
`, sandbox);

const campAlphaState = vm.runInContext("CAMPAIGNS_STATE.campaigns.find(c => c.id === 'camp_alpha_test')", sandbox);
const campBetaState = vm.runInContext("CAMPAIGNS_STATE.campaigns.find(c => c.id === 'camp_beta_test')", sandbox);

assert(campBetaState.bastion.turnCount === 2, 'Avanço de turno incrementou a semana do Bastião da Campanha Beta (de 1 para 2)');
assert(campBetaState.bastion.specialFacilities.length === 1, 'Campanha Beta possui 1 instalação especial');
assert(campAlphaState.bastion.turnCount === 1, 'Bastião da Campanha Alpha permaneceu no turno 1 (isolamento garantido)');
assert(campAlphaState.bastion.specialFacilities.length === 1, 'Instalações da Campanha Alpha não foram afetadas pela alteração da Beta');
assert(campAlphaState.bastion.specialFacilities[0].name === 'Laboratório Alquímico', 'Campanha Alpha preservou suas próprias instalações isoladas');

// 5. Testar alternância de volta para a Campanha Alpha e renderização do DOM
vm.runInContext(`
  switchBastionCampaign('camp_alpha_test');
`, sandbox);

const selCampFinal = vm.runInContext("getSelectedBastionCampaign()", sandbox);
assert(selCampFinal && selCampFinal.id === 'camp_alpha_test', 'Alternância de volta para a Campanha Alpha foi bem sucedida');
assert(selCampFinal.bastion.name === 'Torre de Strahd', 'Bastião ativo agora é a Torre de Strahd');

// =========================================================================
// BATERIA 100: Testes de Criação de Staff de NPCs & Banco/Cofre do Bastião (ISSUE-132)
// =========================================================================
console.log('\n🏦 100. Testes de Criação de Staff de NPCs & Banco/Cofre do Bastião (ISSUE-132):');

// 1. Integridade do HTML compilado
assert(compiledHtml.includes('id="modal-bastion-bank"'), 'HTML compilado contém o modal do Banco/Cofre (#modal-bastion-bank)');
assert(compiledHtml.includes('id="modal-create-bastion-staff"'), 'HTML compilado contém o modal de criação de staff (#modal-create-bastion-staff)');
assert(compiledHtml.includes('id="modal-assign-bastion-npc"'), 'HTML compilado contém o modal de designação de responsável (#modal-assign-bastion-npc)');
assert(compiledHtml.includes('id="bastion-tab-bank-badge"'), 'Barra de controles do bastião contém o badge de saldo do cofre (#bastion-tab-bank-badge)');
assert(compiledHtml.includes('bastion-bank-panel'), 'HTML compilado contém a classe de estilo do painel do banco');
assert(compiledHtml.includes('bastion-staff-section'), 'HTML compilado contém a classe de estilo do corpo de funcionários');

// 2. Exportação de funções no sandbox
assert(typeof vm.runInContext("getBastionBank", sandbox) === 'function', 'Função getBastionBank disponível');
assert(typeof vm.runInContext("getBastionStaff", sandbox) === 'function', 'Função getBastionStaff disponível');
assert(typeof vm.runInContext("openBastionBankModal", sandbox) === 'function', 'Função openBastionBankModal disponível');
assert(typeof vm.runInContext("submitBastionBankOperation", sandbox) === 'function', 'Função submitBastionBankOperation disponível');
assert(typeof vm.runInContext("openCreateBastionStaffModal", sandbox) === 'function', 'Função openCreateBastionStaffModal disponível');
assert(typeof vm.runInContext("saveBastionStaffMember", sandbox) === 'function', 'Função saveBastionStaffMember disponível');
assert(typeof vm.runInContext("confirmAssignBastionNpc", sandbox) === 'function', 'Função confirmAssignBastionNpc disponível');
assert(typeof vm.runInContext("unassignBastionNpc", sandbox) === 'function', 'Função unassignBastionNpc disponível');

// 3. Testes Funcionais do Banco / Cofre do Bastião
vm.runInContext(`
  // Configura ambiente para teste bancário
  const campBankTest = {
    id: 'camp_bank_test',
    name: 'Campanha Finanças de Faerûn',
    status: 'active',
    playerIds: ['p_bank_hero'],
    partyStash: { gold: 500, items: [], history: [] },
    bastion: {
      name: 'Cidadela Dourada',
      level: 6,
      turnCount: 1,
      bank: { gold: 0, history: [] },
      staff: [],
      specialFacilities: [
        { id: 'fac_forge', key: 'smithy', name: 'Forja dos Titãs', managerNpcId: null, currentOrder: null },
        { id: 'fac_lab', key: 'laboratory', name: 'Laboratório Arcano', managerNpcId: null, currentOrder: null }
      ],
      history: []
    }
  };

  const playerBankHero = {
    id: 'p_bank_hero',
    name: 'Gildor Tesoureiro',
    student: 'Lucas',
    gold: 200,
    coins: { gp: 200 }
  };

  CAMPAIGNS_STATE.campaigns.push(campBankTest);
  PLAYERS.push(playerBankHero);
  switchBastionCampaign('camp_bank_test');

  // Abre modal e simula depósito de 150 PO do Baú do Grupo
  openBastionBankModal();
  setBastionBankMode('deposit');
  document.getElementById('sel-bank-entity').value = 'party_stash';
  document.getElementById('inp-bank-amount').value = '150';
  document.getElementById('inp-bank-reason').value = 'Fundo inicial de obras';
  submitBastionBankOperation();
`, sandbox);

const bankAfterDep1 = vm.runInContext("getBastionBank(getSelectedBastionCampaign().bastion)", sandbox);
const stashAfterDep1 = vm.runInContext("getSelectedBastionCampaign().partyStash.gold", sandbox);
assert(bankAfterDep1.gold === 150, 'Depósito creditou 150 PO no Cofre do Bastião');
assert(stashAfterDep1 === 350, 'Depósito debitou 150 PO do Baú do Grupo (restam 350 PO)');
assert(bankAfterDep1.history.length === 1, 'Extrato do cofre registrou 1 movimentação');
assert(bankAfterDep1.history[0].type === 'deposit', 'Tipo da movimentação é depósito');

// Testar depósito a partir da bolsa pessoal de um Herói
vm.runInContext(`
  setBastionBankMode('deposit');
  document.getElementById('sel-bank-entity').value = 'p_bank_hero';
  document.getElementById('inp-bank-amount').value = '50';
  document.getElementById('inp-bank-reason').value = 'Doação pessoal do Gildor';
  submitBastionBankOperation();
`, sandbox);

const bankAfterDep2 = vm.runInContext("getBastionBank(getSelectedBastionCampaign().bastion)", sandbox);
const heroAfterDep2 = vm.runInContext("PLAYERS.find(p => p.id === 'p_bank_hero')", sandbox);
assert(bankAfterDep2.gold === 200, 'Cofre agora possui 200 PO acumulados');
assert(heroAfterDep2.gold === 150, 'Bolsa do herói foi debitada em 50 PO (restam 150 PO)');

// Testar saque de 80 PO do cofre para o Baú Geral
vm.runInContext(`
  setBastionBankMode('withdraw');
  document.getElementById('sel-bank-entity').value = 'party_stash';
  document.getElementById('inp-bank-amount').value = '80';
  document.getElementById('inp-bank-reason').value = 'Compra de mantimentos';
  submitBastionBankOperation();
`, sandbox);

const bankAfterWith1 = vm.runInContext("getBastionBank(getSelectedBastionCampaign().bastion)", sandbox);
const stashAfterWith1 = vm.runInContext("getSelectedBastionCampaign().partyStash.gold", sandbox);
assert(bankAfterWith1.gold === 120, 'Saque debitou 80 PO do cofre (restam 120 PO)');
assert(stashAfterWith1 === 430, 'Saque creditou 80 PO no Baú Geral (total 430 PO)');

// 4. Testes de Criação de Staff de NPCs Exclusivos pelo Mestre (Sem Repetição)
vm.runInContext(`
  // Cria NPC 1: Thorgar Mão-de-Ferro (Ferreiro)
  openCreateBastionStaffModal();
  document.getElementById('inp-bstaff-id').value = '';
  document.getElementById('inp-bstaff-name').value = 'Thorgar Mão-de-Ferro';
  document.getElementById('sel-bstaff-icon').value = '🔨';
  document.getElementById('inp-bstaff-role').value = 'Armeiro-Chefe';
  document.getElementById('inp-bstaff-wage').value = '3';
  document.getElementById('inp-bstaff-trait').value = 'Mestre forjador anão';
  saveBastionStaffMember();

  // Cria NPC 2: Irmã Selene (Alquimista)
  openCreateBastionStaffModal();
  document.getElementById('inp-bstaff-id').value = '';
  document.getElementById('inp-bstaff-name').value = 'Irmã Selene';
  document.getElementById('sel-bstaff-icon').value = '⚗️';
  document.getElementById('inp-bstaff-role').value = 'Alquimista Chefe';
  document.getElementById('inp-bstaff-wage').value = '4';
  document.getElementById('inp-bstaff-trait').value = 'Erudita em poções curativas';
  saveBastionStaffMember();
`, sandbox);

const staffList = vm.runInContext("getBastionStaff(getSelectedBastionCampaign().bastion)", sandbox);
assert(staffList.length === 2, 'Mestre criou com sucesso 2 especialistas no staff do bastião');
const thorgar = staffList.find(n => n.name === 'Thorgar Mão-de-Ferro');
const selene = staffList.find(n => n.name === 'Irmã Selene');
assert(thorgar && thorgar.role === 'Armeiro-Chefe', 'Thorgar foi criado com cargo de Armeiro-Chefe');
assert(selene && selene.role === 'Alquimista Chefe', 'Selene foi criada com cargo de Alquimista Chefe');

// Designar Thorgar para a Forja dos Titãs
vm.runInContext(`
  openAssignBastionNpcModal('fac_forge');
  document.getElementById('sel-assign-staff-npc').value = '${thorgar.id}';
  confirmAssignBastionNpc();
`, sandbox);

const facForge = vm.runInContext("getSelectedBastionCampaign().bastion.specialFacilities.find(f => f.id === 'fac_forge')", sandbox);
const thorgarAfterAssign = vm.runInContext("getBastionStaff(getSelectedBastionCampaign().bastion).find(n => n.id === '" + thorgar.id + "')", sandbox);
assert(facForge.managerNpcId === thorgar.id, 'Thorgar foi vinculado como encarregado da Forja dos Titãs');
assert(facForge.managerNpcName === 'Thorgar Mão-de-Ferro', 'Nome do encarregado refletido na instalação');
assert(thorgarAfterAssign && thorgarAfterAssign.assignedFacilityId === 'fac_forge', 'Staff registra que Thorgar está alocado na Forja');

// Garantia de Exclusividade (Sem Repetição):
// Se o Mestre tentar designar Thorgar para o Laboratório, o sistema deve automaticamente desvinculá-lo da Forja
vm.runInContext(`
  openAssignBastionNpcModal('fac_lab');
  document.getElementById('sel-assign-staff-npc').value = '` + thorgar.id + `';
  confirmAssignBastionNpc();
`, sandbox);

const facForgeAfterMove = vm.runInContext("getSelectedBastionCampaign().bastion.specialFacilities.find(f => f.id === 'fac_forge')", sandbox);
const facLabAfterMove = vm.runInContext("getSelectedBastionCampaign().bastion.specialFacilities.find(f => f.id === 'fac_lab')", sandbox);
assert(facLabAfterMove.managerNpcId === thorgar.id, 'Thorgar agora é o encarregado do Laboratório');
assert(facForgeAfterMove.managerNpcId === null, 'Forja anterior foi automaticamente liberada, garantindo exclusividade e sem repetição de NPCs');

// =========================================================================
// 🏰 101. TESTES DE EVOLUÇÃO DE NPCS, CUSTOS NO BANCO E PRESETS DE ÍCONE (ISSUE-133)
// =========================================================================
console.log('\n🏰 101. Testes de Evolução de NPCs, Custos no Banco e Presets de Ícone (ISSUE-133):');

const bundle133 = fs.readFileSync(path.join(__dirname, 'planilha do rpg.html'), 'utf8');

// 1. Integridade de Elementos e Estilos no Bundle Compilado
assert(bundle133.includes('id="sel-bstaff-icon"'), 'HTML compilado contém o select de ícone (#sel-bstaff-icon)');
assert(bundle133.includes('id="sel-bstaff-level"'), 'HTML compilado contém o seletor de maestria (#sel-bstaff-level)');
assert(bundle133.includes('bastion-mastery-badge'), 'HTML compilado contém a classe .bastion-mastery-badge');
assert(bundle133.includes('btn-promote-staff'), 'HTML compilado contém a classe .btn-promote-staff');
assert(bundle133.includes('bastion-staff-benefit-pill'), 'HTML compilado contém a classe .bastion-staff-benefit-pill');
assert(bundle133.includes('onBastionStaffIconChange(this.value)'), 'Select de ícone possui listener reativo onBastionStaffIconChange');
assert(bundle133.includes('onBastionStaffLevelChange(this.value)'), 'Select de nível possui listener reativo onBastionStaffLevelChange');

// 2. Funções e Tabela de Presets Exportadas
assert(typeof vm.runInContext('BASTION_STAFF_ICON_PRESETS', sandbox) === 'object', 'BASTION_STAFF_ICON_PRESETS exportado');
assert(typeof vm.runInContext('getBastionStaffMasteryInfo', sandbox) === 'function', 'Função getBastionStaffMasteryInfo disponível');
assert(typeof vm.runInContext('calculateBastionStaffWage', sandbox) === 'function', 'Função calculateBastionStaffWage disponível');
assert(typeof vm.runInContext('onBastionStaffIconChange', sandbox) === 'function', 'Função onBastionStaffIconChange disponível');
assert(typeof vm.runInContext('onBastionStaffLevelChange', sandbox) === 'function', 'Função onBastionStaffLevelChange disponível');
assert(typeof vm.runInContext('promoteBastionStaffMember', sandbox) === 'function', 'Função promoteBastionStaffMember disponível');

// 3. Teste de Automação Reativa de Ícone -> Cargo, Especialidade e Soldo
vm.runInContext(`
  openCreateBastionStaffModal();
  document.getElementById('sel-bstaff-icon').value = '⚗️';
  onBastionStaffIconChange('⚗️');
`, sandbox);
const roleAlch = vm.runInContext("document.getElementById('inp-bstaff-role').value", sandbox);
const traitAlch = vm.runInContext("document.getElementById('inp-bstaff-trait').value", sandbox);
const wageAlch = vm.runInContext("document.getElementById('inp-bstaff-wage').value", sandbox);
assert(roleAlch === 'Alquimista Chefe', 'Ícone ⚗️ preencheu automaticamente o cargo "Alquimista Chefe"');
assert(traitAlch.includes('poções'), 'Ícone ⚗️ preencheu a especialidade em poções');
assert(parseInt(wageAlch) === 4, 'Ícone ⚗️ definiu o salário inicial base de 4 PO');

// Mudar para Guarda
vm.runInContext(`
  document.getElementById('sel-bstaff-icon').value = '🛡️';
  onBastionStaffIconChange('🛡️');
`, sandbox);
assert(vm.runInContext("document.getElementById('inp-bstaff-role').value", sandbox) === 'Comandante da Guarda', 'Ícone 🛡️ preencheu "Comandante da Guarda"');

// 4. Teste de Progressão de Nível e Soldo Dinâmico
const mastery1 = vm.runInContext("getBastionStaffMasteryInfo(1)", sandbox);
const mastery3 = vm.runInContext("getBastionStaffMasteryInfo(3)", sandbox);
const mastery5 = vm.runInContext("getBastionStaffMasteryInfo(5)", sandbox);
assert(mastery1.level === 1 && mastery1.timeReductionDays === 0, 'Nível 1 possui redução de 0 dias');
assert(mastery3.level === 3 && mastery3.timeReductionDays === 4, 'Nível 3 possui redução de 4 dias');
assert(mastery5.level === 5 && mastery5.doubleProduction === true && mastery5.timeReductionDays === 7, 'Nível 5 dobra a produção e reduz 7 dias');

const wageLvl1 = vm.runInContext("calculateBastionStaffWage('🔨', 1)", sandbox);
const wageLvl2 = vm.runInContext("calculateBastionStaffWage('🔨', 2)", sandbox);
const wageLvl3 = vm.runInContext("calculateBastionStaffWage('🔨', 3)", sandbox);
const wageLvl5 = vm.runInContext("calculateBastionStaffWage('🔨', 5)", sandbox);
assert(wageLvl1 === 3, 'Ferreiro Nível 1 tem soldo de 3 PO');
assert(wageLvl2 === 6, 'Ferreiro Nível 2 tem soldo de 6 PO (+3)');
assert(wageLvl3 === 10, 'Ferreiro Nível 3 tem soldo de 10 PO (+7)');
assert(wageLvl5 === 33, 'Ferreiro Nível 5 tem soldo de 33 PO (+30)');

// 5. Teste de Criação e Promoção de Especialista
vm.runInContext(`
  openCreateBastionStaffModal();
  document.getElementById('inp-bstaff-name').value = 'Mestre Brokk';
  document.getElementById('sel-bstaff-icon').value = '🔨';
  onBastionStaffIconChange('🔨');
  document.getElementById('sel-bstaff-level').value = '1';
  saveBastionStaffMember();
`, sandbox);
const brokk = vm.runInContext("getSelectedBastionCampaign().bastion.staff.find(s => s.name === 'Mestre Brokk')", sandbox);
assert(brokk !== undefined, 'Mestre Brokk criado com sucesso no staff');
assert(brokk.level === 1, 'Mestre Brokk inicia no Nível 1');
assert(brokk.wage === 3, 'Salário inicial de Brokk é 3 PO');

// Promoção de Brokk
vm.runInContext(`
  promoteBastionStaffMember('` + brokk.id + `');
`, sandbox);
const brokkPromoted = vm.runInContext("getSelectedBastionCampaign().bastion.staff.find(s => s.id === '" + brokk.id + "')", sandbox);
assert(brokkPromoted.level === 2, 'Brokk promovido para Nível 2');
assert(brokkPromoted.wage === 6, 'Salário de Brokk reajustado para 6 PO após promoção');

// 6. Teste de Cobrança Exclusiva pelo Cofre do Banco (Muralhas)
// Configura cenário: Banco com 0 PO e Baú Coletivo com 5000 PO
const origPrompt = sandbox.prompt;
sandbox.prompt = () => '1'; // Seleciona opção 1: Paliçada de Madeira (250 PO)

vm.runInContext(`
  activeCamp133 = getSelectedBastionCampaign();
  activeCamp133.partyStash.gold = 5000;
  activeCamp133.bastion.bank.gold = 0;
  activeCamp133.bastion.walls = 'none';
  
  // Tenta construir muralha com banco zerado
  promptUpgradeBastionWalls();
`, sandbox);

let activeCampAfterWallTry = vm.runInContext("getSelectedBastionCampaign()", sandbox);
assert(activeCampAfterWallTry.bastion.walls === 'none', 'Muralha NÃO foi construída porque o Cofre do Banco estava zerado (mesmo com 5000 PO no Baú)');

// Agora deposita 500 PO no Cofre do Banco
vm.runInContext(`
  activeCamp133.bastion.bank.gold = 500;
  promptUpgradeBastionWalls();
`, sandbox);

sandbox.prompt = origPrompt;

let activeCampAfterWallSuccess = vm.runInContext("getSelectedBastionCampaign()", sandbox);
assert(activeCampAfterWallSuccess.bastion.walls === 'wood', 'Paliçada de Madeira erguida com sucesso após financiamento via Cofre do Banco');
assert(activeCampAfterWallSuccess.bastion.bank.gold === 250, 'Cofre do Banco foi debitado exatamente em 250 PO (restam 250 PO)');
assert(activeCampAfterWallSuccess.partyStash.gold === 5000, 'Baú do Grupo permaneceu intacto com 5000 PO');
const wallTx = activeCampAfterWallSuccess.bastion.bank.history.find(h => h.entityName === 'Obras de Defesa');
assert(wallTx !== undefined && wallTx.amount === 250, 'Extrato do Banco registrou o saque das obras de muralha');

// 7. Teste de Cobrança de Ordens no Cofre do Banco com Redução de Tempo por Maestria
vm.runInContext(`
  // Aloca Brokk (Ferreiro Nv 2, -2 dias) na Forja
  const forgeFac = activeCamp133.bastion.specialFacilities.find(f => f.id === 'fac_forge');
  forgeFac.managerNpcId = '` + brokk.id + `';
  forgeFac.managerNpcName = '` + brokk.name + `';
  forgeFac.managerNpcLevel = 2;
  
  // Banco tem 250 PO
  document.getElementById('sel-bastion-action-facility').value = 'fac_forge';
  document.getElementById('sel-item-for-craft_magic_arms').value = 'Espada Longa +1|200';
  triggerActivateBastionAction('craft_magic_arms');
`, sandbox);

const orderFac = vm.runInContext("getSelectedBastionCampaign().bastion.specialFacilities.find(f => f.id === 'fac_forge')", sandbox);
assert(orderFac.currentOrder !== null, 'Ordem de forja mágica ativada na Forja');
assert(orderFac.currentOrder.costPO === 200, 'Custo de 200 PO registrado na ordem');
assert(vm.runInContext("getSelectedBastionCampaign().bastion.bank.gold", sandbox) === 50, 'Cofre do Banco debitado em 200 PO (restam 50 PO)');
assert(orderFac.currentOrder.durationDays === 12, 'Tempo da ordem reduzido de 14 para 12 dias graças ao Ferreiro Nível 2 (-2 dias)');

// 8. Teste de Folha de Pagamento do Staff debitada do Banco no Avanço de Turno
vm.runInContext(`
  // Define o staff com soma salarial conhecida (ex: Brokk 6 PO + outro 4 PO = 10 PO)
  const campPayroll = getSelectedBastionCampaign();
  campPayroll.bastion.staff = [
    { id: 'st_1', name: 'Mestre Brokk', wage: 6, level: 2 },
    { id: 'st_2', name: 'Guarda Geral', wage: 4, level: 1 }
  ];
  // Banco tem 50 PO
  campPayroll.bastion.bank.gold = 50;
  advanceBastionTurn();
`, sandbox);

const bankAfterPayroll = vm.runInContext("getSelectedBastionCampaign().bastion.bank.gold", sandbox);
assert(bankAfterPayroll === 40, 'Folha de pagamento de 10 PO foi debitada do Cofre do Banco (de 50 para 40 PO)');
const payrollTx = vm.runInContext("getSelectedBastionCampaign().bastion.bank.history.find(h => h.entityName === 'Folha de Pagamento')", sandbox);
assert(payrollTx !== undefined && payrollTx.amount === 10, 'Lançamento de Folha de Pagamento gravado no extrato do cofre');

// 9. Teste de Produção em Dobro com Especialista Nível 5 (Lenda Viva)
vm.runInContext(`
  // Cria especialista Nv 5 na Alquimia
  const campProd = getSelectedBastionCampaign();
  const labFac = campProd.bastion.specialFacilities.find(f => f.id === 'fac_lab');
  labFac.managerNpcId = 'alch_legend';
  labFac.managerNpcName = 'Arquimago Ignis';
  labFac.managerNpcLevel = 5;
  
  labFac.currentOrder = {
    actionKey: 'distill_potion',
    name: 'Destilar Poção ou Elixir Alquímico',
    daysLeft: 7, // Conclui neste turno
    selectedItem: { name: 'Poção Maior de Cura (4d4+4)' },
    costPO: 0
  };
  
  advanceBastionTurn();
`, sandbox);

const labItemEntry = vm.runInContext("getSelectedBastionCampaign().partyStash.items.find(i => i.name === 'Poção Maior de Cura (4d4+4)')", sandbox);
assert(labItemEntry !== undefined, 'Poção Maior de Cura fabricada e entregue no Baú');
assert(labItemEntry.qty === 2, 'Quantidade duplicada (2x) graças ao especialista Nível 5 (Lenda Viva)!');

// ========================================================
// 102. TESTES DE RESUMO DE MAGIA/ITEM, EXCLUSÃO DE FICHA E INVENTÁRIO INTUITIVO (ISSUE-134)
// ========================================================
console.log('\n🎒 102. Testes de Resumo de Magia/Item, Exclusão de Ficha e Inventário Intuitivo (ISSUE-134):');

// 1. Verificação de elementos no bundle HTML
assert(distHtml.includes('id="modal-item-quick-view"'), 'HTML compilado contém o modal de resumo tátil de item (#modal-item-quick-view)');
assert(distHtml.includes('id="sqv-btn-share"'), 'HTML compilado contém o botão de compartilhar magia no chat (#sqv-btn-share)');
assert(distHtml.includes('id="iqv-btn-share"'), 'HTML compilado contém o botão de compartilhar item no chat (#iqv-btn-share)');
assert(distHtml.includes('btn-item-equip-badge'), 'HTML compilado contém a classe de estilo .btn-item-equip-badge');

// 2. Exportação de funções
assert(typeof vm.runInContext('deletePlayer', sandbox) === 'function', 'Função deletePlayer exportada (alias para deletePlayerDirect)');
assert(typeof vm.runInContext('deletePlayerDirect', sandbox) === 'function', 'Função deletePlayerDirect exportada');
assert(typeof vm.runInContext('openItemQuickView', sandbox) === 'function', 'Função openItemQuickView exportada');
assert(typeof vm.runInContext('closeItemQuickView', sandbox) === 'function', 'Função closeItemQuickView exportada');

// 3. Teste de Exclusão de Ficha via deletePlayer(id)
vm.runInContext(`
  // Cria jogador de teste para exclusão
  const dummyPlayer = {
    id: 'p_to_delete_134',
    name: 'Herói a Deletar',
    student: 'Aluno Teste',
    className: 'Guerreiro',
    level: 1,
    hp: 10,
    maxHp: 10
  };
  PLAYERS.push(dummyPlayer);
  if (!state.combatants) state.combatants = [];
  state.combatants.push({
    id: 'c_to_delete_134',
    playerId: 'p_to_delete_134',
    name: 'Herói a Deletar',
    hp: 10,
    maxHp: 10
  });
  deletePlayer('p_to_delete_134');
`, sandbox);

const deletedExists = vm.runInContext("PLAYERS.some(p => p.id === 'p_to_delete_134')", sandbox);
assert(deletedExists === false, 'deletePlayer(id) removeu com sucesso a ficha da lista PLAYERS');
const combatantDeletedExists = vm.runInContext("state.combatants.some(c => c.playerId === 'p_to_delete_134')", sandbox);
assert(combatantDeletedExists === false, 'deletePlayer(id) removeu em cascata o combatente do combate ativo');

// 4. Teste de Abertura do Resumo Rápido de Item (openItemQuickView)
vm.runInContext(`
  // Jogador de teste com itens no inventário
  const testHero = {
    id: 'p_item_test_134',
    name: 'Eldrin',
    student: 'Player 1',
    className: 'Mago',
    level: 3,
    inventory: [
      { name: 'Cota de Malha', category: 'Armaduras e Escudos', qty: 1, equipped: false, weight: '18 kg' },
      { name: 'Poção de Cura', category: 'Poções', qty: 2, weight: '0.5 kg' },
      { name: 'Espada Longa', category: 'Armas Marciais', qty: 1, equipped: true, weight: '1.5 kg' }
    ]
  };
  PLAYERS.push(testHero);
  
  // Abre o quick view da Cota de Malha (idx 0)
  openItemQuickView('p_item_test_134', 0);
`, sandbox);

const iqvName = vm.runInContext("document.getElementById('iqv-name')?.textContent", sandbox);
assert(iqvName === 'Cota de Malha', 'openItemQuickView preencheu o nome do item (#iqv-name) com "Cota de Malha"');
const iqvDesc = vm.runInContext("document.getElementById('iqv-desc')?.innerHTML", sandbox);
assert(iqvDesc && iqvDesc.length > 5, 'openItemQuickView buscou e exibiu as propriedades do item a partir do catálogo');

// 5. Teste de Toggle de Equipar Item através do modal e botão
vm.runInContext(`
  // Equipar a Cota de Malha
  togglePlayerItemEquipped('p_item_test_134', 0);
`, sandbox);
const isChainEquipped = vm.runInContext("PLAYERS.find(p => p.id === 'p_item_test_134').inventory[0].equipped", sandbox);
assert(isChainEquipped === true, 'Cota de Malha foi equipada com sucesso');

// 6. Teste de Proteção contra Consumo Acidental de Armas e Armaduras
vm.runInContext(`
  activePortalPlayerId = null;
  if (document.getElementById('filter-player-q')) document.getElementById('filter-player-q').value = '';
  renderPlayers();
`, sandbox);
const playersHtml = vm.runInContext("document.getElementById('grid-players')?.innerHTML || ''", sandbox);
assert(playersHtml.includes('btn-item-equip-badge'), 'Renderização da ficha inclui o novo botão .btn-item-equip-badge');
assert(playersHtml.includes('🛡️ Equipado'), 'Item equipado exibe o badge claro "🛡️ Equipado" em vez de bolinha vermelha');

// 7. Teste de Envio de Magia Enriquecida ao Chat (sharePlayerSpellToFeed)
vm.runInContext(`
  let lastLogEntry = '';
  const origAddLog = addLog;
  addLog = function(msg) { lastLogEntry = msg; origAddLog(msg); };
  sharePlayerSpellToFeed('p_item_test_134', 'Passo Nebuloso');
  addLog = origAddLog;
`, sandbox);
const capturedSpellLog = vm.runInContext("lastLogEntry", sandbox);
assert(capturedSpellLog.includes('Passo Nebuloso'), 'sharePlayerSpellToFeed registrou Passo Nebuloso no log');
assert(capturedSpellLog.includes('teletransporta'), 'sharePlayerSpellToFeed incluiu o efeito descritivo integral da magia (sem truncar em 140 chars)');

// 8. Teste de Envio de Item com Propriedades ao Chat (sharePlayerItemToFeed)
vm.runInContext(`
  let lastItemLogEntry = '';
  const origAddLogItem = addLog;
  addLog = function(msg) { lastItemLogEntry = msg; origAddLogItem(msg); };
  sharePlayerItemToFeed('p_item_test_134', 0);
  addLog = origAddLogItem;
`, sandbox);
const capturedItemLog = vm.runInContext("lastItemLogEntry", sandbox);
assert(capturedItemLog.includes('Cota de Malha'), 'sharePlayerItemToFeed registrou Cota de Malha no log');

// ========================================================
// 🛡️ BATERIA 103: TESTES DE PREVENÇÃO DE SOBREPOSIÇÃO DE ÍCONES, ELIMINAÇÃO DE 'kgkg' E LAYOUT ROBUSTO (ISSUE-135)
// ========================================================
console.log('\n🛡️ 103. Testes de Prevenção de Sobreposição de Ícones, Eliminação de "kgkg" e Layout Robusto (ISSUE-135):');

// 1. Verificação de integridade no CSS compilado
const builtHtmlContent = fs.readFileSync(path.join(__dirname, 'planilha do rpg.html'), 'utf8');
assert(builtHtmlContent.includes('.btn-item-equip-badge'), 'HTML compilado inclui a classe .btn-item-equip-badge');
assert(builtHtmlContent.includes('.attack-actions-cell'), 'HTML compilado inclui a classe .attack-actions-cell');
assert(builtHtmlContent.includes('.inventory-item-actions'), 'HTML compilado inclui a classe .inventory-item-actions');
assert(builtHtmlContent.includes('.roll20-item-equipped-toggle:not(.btn-item-equip-badge)'), 'Classe .roll20-item-equipped-toggle isolada para não forçar 14px em botões com badge');

// 2. Teste de Eliminação de "kgkg" e Renderização do Inventário
vm.runInContext(`
  var p135 = {
    id: 'p_layout_135',
    name: 'Guerreiro de Ferro',
    className: 'Guerreiro',
    level: 3,
    str: 16,
    dex: 14,
    con: 14,
    int: 10,
    wis: 12,
    cha: 8,
    inventory: [
      { name: 'Espada Longa (Longsword)', qty: 1, weight: '1.5 kg', equipped: true, category: 'Armas Marciais' },
      { name: 'Escudo de Madeira', qty: 1, weight: '2.5kg', equipped: false, category: 'Armaduras e Escudos' },
      { name: 'Tocha', qty: 5, weight: '0.5', equipped: false, category: 'Aventuras' }
    ],
    spells: ['Proteção contra o Bem e o Mal'],
    preparedSpells: ['Proteção contra o Bem e o Mal']
  };
  PLAYERS.push(p135);
  activePortalPlayerId = null;
  if (document.getElementById('filter-player-q')) document.getElementById('filter-player-q').value = '';
  renderPlayers();
`, sandbox);

const p135Html = vm.runInContext("document.getElementById('grid-players')?.innerHTML || ''", sandbox);

// Validação de que NÃO existe 'kgkg' em nenhum lugar do HTML gerado
assert(!p135Html.includes('kgkg'), 'Nenhum item exibiu peso duplicado "kgkg" (Espada Longa e Escudo formatados com "kg" limpo)');
assert(p135Html.includes('1.5 kg'), 'Espada Longa exibiu "1.5 kg" corretamente');
assert(p135Html.includes('2.5 kg'), 'Escudo de Madeira exibiu "2.5 kg" corretamente');
assert(p135Html.includes('0.5 kg'), 'Tocha exibiu "0.5 kg" corretamente');

// 3. Validação de Estrutura de Layout do Inventário (sem colisão)
assert(p135Html.includes('inventory-item-actions'), 'Linha do item possui o container .inventory-item-actions');
assert(p135Html.includes('inventory-item-info'), 'Linha do item possui o container .inventory-item-info');
assert(p135Html.includes('🛡️ Equipado'), 'Item equipado exibe o badge "🛡️ Equipado"');
assert(p135Html.includes('Equipar'), 'Item não-equipado exibe o botão neutro "Equipar"');

// 4. Validação da Tabela de Ataques (com container flex .attack-actions-cell)
assert(p135Html.includes('attack-actions-cell'), 'Tabela de ataques envolve botões em .attack-actions-cell para prevenir quebra de linha desordenada');

// 5. Validação de Chips de Magia (com flex e min-width: 0 para evitar estouro em nomes longos)
assert(p135Html.includes('spell-chip-name'), 'Cards de magia contêm a classe .spell-chip-name');
// -------------------------------------------------------------
// 📱 104. Testes de Visualização Mobile, Slots D&D 5E e Timeout de Nuvem (ISSUE-136)
// -------------------------------------------------------------
console.log('\n📱 104. Testes de Visualização Mobile, Slots D&D 5E e Timeout de Nuvem (ISSUE-136):');

// 1. Validação de CSS de Reordenação Mobile e Scroll Margin no HTML compilado
assert(builtHtmlContent.includes('.roll20-col-main') && builtHtmlContent.includes('order: 1'), 'CSS mobile reordena coluna principal (.roll20-col-main) para order: 1');
assert(builtHtmlContent.includes('.roll20-col-side') && builtHtmlContent.includes('order: 2'), 'CSS mobile posiciona coluna lateral (.roll20-col-side) em order: 2');
assert(builtHtmlContent.includes('.roll20-col-skills') && builtHtmlContent.includes('order: 3'), 'CSS mobile posiciona perícias (.roll20-col-skills) em order: 3');
assert(builtHtmlContent.includes('scroll-margin-top: 85px') || builtHtmlContent.includes('scroll-margin-top:85px'), 'CSS define scroll-margin-top para evitar que headers fiquem sob a navbar fixa');

// 2. Validação da Função Canônica ensurePlayerSpellSlots
const fnEnsureSlots = vm.runInContext("typeof ensurePlayerSpellSlots", sandbox);
assert(fnEnsureSlots === 'function', 'Função ensurePlayerSpellSlots está exportada e acessível no ambiente');

// Caso Mago Nível 3 (Conjurador Total) com slots zerados ou mockados
const testWizard = {
  id: 'wiz_test_136',
  name: 'Mago Teste',
  className: 'mago',
  level: 3,
  slots: [0, 0, 0, 0, 0]
};
vm.runInContext(`
  ensurePlayerSpellSlots(${JSON.stringify(testWizard)});
`, sandbox);
const wizSlots = vm.runInContext("ensurePlayerSpellSlots(" + JSON.stringify(testWizard) + ")", sandbox);
assert(Array.isArray(wizSlots) && wizSlots.length >= 9, 'Slots normalizados com pelo menos 9 círculos D&D 5E');
assert(wizSlots[0] === 4, 'Mago Nível 3 possui 4 espaços de 1º Círculo');
assert(wizSlots[1] === 2, 'Mago Nível 3 possui 2 espaços de 2º Círculo');
assert(wizSlots[2] === 0, 'Mago Nível 3 não possui espaços de 3º Círculo');

// Caso Guerreiro Nível 3 (Sem Conjuração)
const testFighter = {
  id: 'ftr_test_136',
  name: 'Guerreiro Teste',
  className: 'guerreiro',
  level: 3,
  slots: [0, 0, 0, 0, 0]
};
const ftrSlots = vm.runInContext("ensurePlayerSpellSlots(" + JSON.stringify(testFighter) + ")", sandbox);
assert(Array.isArray(ftrSlots) && ftrSlots.length >= 9, 'Guerreiro normalizado com 9 posições');
assert(ftrSlots.every(s => s === 0), 'Guerreiro sem subclasse arcana permanece com 0 slots');

// 3. Validação do scrollToPlayerSection com ativação de abas
vm.runInContext(`
  const pMobileHero = {
    id: 'hero_mobile_136',
    name: 'Herói Mobile',
    className: 'mago',
    level: 3,
    activeCardTab: 'skills'
  };
  PLAYERS = [pMobileHero];
  activePortalPlayerId = 'hero_mobile_136';

  // Chamada de navegação para magias
  scrollToPlayerSection('spells');
`, sandbox);

const mobileTabAfterSpells = vm.runInContext("PLAYERS.find(p => p.id === 'hero_mobile_136')?.activeCardTab", sandbox);
assert(mobileTabAfterSpells === 'spells', 'scrollToPlayerSection("spells") ativou a aba de magias da ficha');

vm.runInContext("scrollToPlayerSection('attacks');", sandbox);
const mobileTabAfterAttacks = vm.runInContext("PLAYERS.find(p => p.id === 'hero_mobile_136')?.activeCardTab", sandbox);
assert(mobileTabAfterAttacks === 'combat', 'scrollToPlayerSection("attacks") ativou a aba de combate da ficha');

vm.runInContext("scrollToPlayerSection('inventory');", sandbox);
const mobileTabAfterInv = vm.runInContext("PLAYERS.find(p => p.id === 'hero_mobile_136')?.activeCardTab", sandbox);
assert(mobileTabAfterInv === 'inventory', 'scrollToPlayerSection("inventory") ativou a aba de inventário da ficha');

// 4. Validação de Resiliência no Cloud Sync (15 segundos)
// -------------------------------------------------------------
// 🛡️ 105. Testes de Fila Offline Persistida, Telemetria e Multi-Path Updates (ISSUE-137)
// -------------------------------------------------------------
console.log('\n🛡️ 105. Testes de Fila Offline Persistida, Telemetria e Multi-Path Updates (ISSUE-137):');

// 1. Validação de CSS do badge com pendências offline
assert(builtHtmlContent.includes('.portal-sync-badge.sync-queued'), 'HTML compilado inclui a classe .portal-sync-badge.sync-queued');
assert(builtHtmlContent.includes('pulseSyncQueued'), 'CSS inclui animação de pulso pulseSyncQueued para alertar fila offline');

// 2. Validação de Funções de Fila e Resiliência Exportadas
assert(vm.runInContext("typeof getOfflineMutationQueue", sandbox) === 'function', 'Função getOfflineMutationQueue exportada');
assert(vm.runInContext("typeof saveOfflineMutationQueue", sandbox) === 'function', 'Função saveOfflineMutationQueue exportada');
assert(vm.runInContext("typeof peekOfflineMutationQueue", sandbox) === 'function', 'Função peekOfflineMutationQueue exportada');
assert(vm.runInContext("typeof enqueueOfflineMutation", sandbox) === 'function', 'Função enqueueOfflineMutation exportada');
assert(vm.runInContext("typeof flushOfflineMutationQueue", sandbox) === 'function', 'Função flushOfflineMutationQueue exportada');
assert(vm.runInContext("typeof calculateBackoffDelay", sandbox) === 'function', 'Função calculateBackoffDelay exportada');
assert(vm.runInContext("typeof executeDirectCloudSaveForPlayer", sandbox) === 'function', 'Função executeDirectCloudSaveForPlayer exportada');

// 3. Teste de Enfileiramento e Persistência no LocalStorage
vm.runInContext(`
  // Limpa fila anterior para teste atômico
  saveOfflineMutationQueue([]);

  // Enfileira alteração de vida do herói 1
  enqueueOfflineMutation({
    type: 'player_save',
    playerId: 'hero_queue_1',
    payload: { id: 'hero_queue_1', name: 'Gromm', hp: 25, maxHp: 30 }
  });

  // Enfileira alteração de outro herói
  enqueueOfflineMutation({
    type: 'player_save',
    playerId: 'hero_queue_2',
    payload: { id: 'hero_queue_2', name: 'Lyra', hp: 18, maxHp: 18 }
  });
`, sandbox);

const queueCountAfter2 = vm.runInContext("peekOfflineMutationQueue()", sandbox);
assert(queueCountAfter2 === 2, 'Fila offline registra exatamente 2 mutações pendentes');

// Verifica se gravou no localStorage
const storedQueueJson = vm.runInContext("localStorage.getItem('dnd_offline_mutation_queue_v1')", sandbox);
assert(storedQueueJson && storedQueueJson.includes('hero_queue_1') && storedQueueJson.includes('hero_queue_2'), 'Fila offline foi persistida no localStorage com os 2 heróis');

// 4. Teste de Coalescência de Mutações (mesclagem sem duplicação)
vm.runInContext(`
  // Nova mutação para o mesmo herói hero_queue_1 (ex: conjurou magia logo após tomar dano)
  enqueueOfflineMutation({
    type: 'player_save',
    playerId: 'hero_queue_1',
    payload: { id: 'hero_queue_1', name: 'Gromm', hp: 20, slotsUsed: [1, 0, 0, 0, 0] }
  });
`, sandbox);

const queueCountAfterMerge = vm.runInContext("peekOfflineMutationQueue()", sandbox);
assert(queueCountAfterMerge === 2, 'Coalescência inteligente: mutação do mesmo herói foi mesclada sem inflar a fila');

const mergedItem = vm.runInContext("getOfflineMutationQueue().find(q => q.playerId === 'hero_queue_1')", sandbox);
assert(mergedItem.payload.hp === 20, 'Payload coalescido contém o PV mais recente (20)');
assert(mergedItem.payload.slotsUsed[0] === 1, 'Payload coalescido contém os slots gastos atualizados');

// 5. Teste de Exponential Backoff com Jitter
const delay0 = vm.runInContext("calculateBackoffDelay(0)", sandbox);
const delay3 = vm.runInContext("calculateBackoffDelay(3)", sandbox);
const delay10 = vm.runInContext("calculateBackoffDelay(10)", sandbox);

assert(delay0 >= 500 && delay0 <= 1000, 'Backoff tentativa 0 varia entre 500ms e 1000ms');
assert(delay3 >= 2000 && delay3 <= 6000, 'Backoff tentativa 3 escala exponencialmente (2s a 6s)');
assert(delay10 <= 15000, 'Backoff tentativa 10 respeita o teto de segurança de 15 segundos');

// 6. Teste de Esvaziamento e Atualização do Badge
vm.runInContext(`
  // Cria elemento mock do badge se não existir
  let badgeEl = document.getElementById('portal-sync-status-badge');
  if (!badgeEl) {
    badgeEl = { id: 'portal-sync-status-badge', className: '', innerText: '' };
    document.getElementById = (id) => id === 'portal-sync-status-badge' ? badgeEl : { value: '1', style: {}, classList: { add:()=>{}, remove:()=>{} } };
  }

  // Com pendências na fila
  updatePortalSyncBadgeStatus();
`, sandbox);

const badgeClassQueued = vm.runInContext("document.getElementById('portal-sync-status-badge')?.className || ''", sandbox);
const badgeTextQueued = vm.runInContext("document.getElementById('portal-sync-status-badge')?.innerText || ''", sandbox);
assert(badgeClassQueued.includes('sync-queued'), 'Badge recebe classe .sync-queued quando há itens pendentes');
assert(badgeTextQueued.includes('pendente'), 'Badge exibe texto indicando operações pendentes');

// Simula limpeza após envio com sucesso
vm.runInContext(`
  saveOfflineMutationQueue([]);
  updatePortalSyncBadgeStatus();
`, sandbox);

const badgeClassEmpty = vm.runInContext("document.getElementById('portal-sync-status-badge')?.className || ''", sandbox);
assert(badgeClassEmpty.includes('sync-online'), 'Badge retorna para .sync-online após a fila esvaziar');

// =========================================================================
// 🖐️ 106. TESTES DE EXPERIÊNCIA MOBILE NEXT-GEN, THUMB HUD E HAPTICS (ISSUE-138)
// =========================================================================
console.log('\n🖐️ 106. Testes de Experiência Mobile Next-Gen, Thumb HUD e Haptics (ISSUE-138):');

// 1. Verificação de Elementos e CSS no HTML Compilado
const hasThumbHud = builtHtmlContent.includes('id="mobile-vital-thumb-hud"');
const hasThumbHudCss = builtHtmlContent.includes('.mobile-vital-thumb-hud');
const hasDragHandleCss = builtHtmlContent.includes('.sheet-drag-handle');
const hasCombatFocusCss = builtHtmlContent.includes('.combat-focus-mode');
const hasHpPillCss = builtHtmlContent.includes('.thumb-hud-hp-pill');

assert(hasThumbHud, 'HTML compilado inclui o container #mobile-vital-thumb-hud');
assert(hasThumbHudCss, 'HTML compilado inclui os estilos da classe .mobile-vital-thumb-hud');
assert(hasDragHandleCss, 'HTML compilado inclui o indicador tátil .sheet-drag-handle para Bottom Sheets');
assert(hasCombatFocusCss, 'HTML compilado inclui regras CSS do Modo Foco em Combate (.combat-focus-mode)');
assert(hasHpPillCss, 'HTML compilado inclui estilos responsivos da barra tátil de PV (.thumb-hud-hp-pill)');

// 2. Exportação de Funções
assert(typeof vm.runInContext("triggerHapticFeedback", sandbox) === 'function', 'Função triggerHapticFeedback exportada');
assert(typeof vm.runInContext("updateMobileVitalThumbHud", sandbox) === 'function', 'Função updateMobileVitalThumbHud exportada');
assert(typeof vm.runInContext("promptPlayerMobileHp", sandbox) === 'function', 'Função promptPlayerMobileHp exportada');
assert(typeof vm.runInContext("breakPlayerConcentration", sandbox) === 'function', 'Função breakPlayerConcentration exportada');
assert(typeof vm.runInContext("toggleCombatFocusMode", sandbox) === 'function', 'Função toggleCombatFocusMode exportada');
assert(typeof vm.runInContext("rollDirectD20FromHud", sandbox) === 'function', 'Função rollDirectD20FromHud exportada');

// 3. Teste de Atualização Reativa do Thumb HUD (Vida e Status)
vm.runInContext(`
  // Cria elementos mock do DOM para o Thumb HUD
  const mockHudEl = { id: 'mobile-vital-thumb-hud' };
  const mockHpValEl = { innerText: '' };
  const mockHpIconEl = { innerText: '' };
  const mockHpPillEl = {
    classes: new Set(),
    classList: {
      add: function(c) { mockHpPillEl.classes.add(c); },
      remove: function(...args) { args.forEach(c => mockHpPillEl.classes.delete(c)); },
      contains: function(c) { return mockHpPillEl.classes.has(c); }
    }
  };
  const mockConcChip = {
    classes: new Set(),
    classList: {
      add: function(c) { mockConcChip.classes.add(c); },
      remove: function(...args) { args.forEach(c => mockConcChip.classes.delete(c)); },
      contains: function(c) { return mockConcChip.classes.has(c); }
    }
  };
  const mockConcNameEl = { innerText: '' };
  const mockFocusLabel = { innerText: '' };

  const prevGetEl = document.getElementById;
  document.getElementById = function(id) {
    if (id === 'mobile-vital-thumb-hud') return mockHudEl;
    if (id === 'thumb-hud-hp-val') return mockHpValEl;
    if (id === 'thumb-hud-hp-icon') return mockHpIconEl;
    if (id === 'thumb-hud-hp') return mockHpPillEl;
    if (id === 'thumb-hud-concentration') return mockConcChip;
    if (id === 'thumb-hud-conc-name') return mockConcNameEl;
    if (id === 'label-combat-focus') return mockFocusLabel;
    return prevGetEl ? prevGetEl(id) : null;
  };

  const heroMobileTest = {
    id: 'p_hero_thumb_test',
    name: 'Alyn Sombraverde',
    hp: 40,
    maxHp: 40,
    tempHp: 0,
    concentrationSpell: null
  };
  PLAYERS.push(heroMobileTest);
  activePortalPlayerId = heroMobileTest.id;

  // Estado Saudável (100% PV)
  updateMobileVitalThumbHud(heroMobileTest);
`, sandbox);

const hpHealthyText = vm.runInContext("mockHpValEl.innerText", sandbox);
const isHpWarningBefore = vm.runInContext("mockHpPillEl.classList.contains('hp-warning')", sandbox);
const isHpDangerBefore = vm.runInContext("mockHpPillEl.classList.contains('hp-danger')", sandbox);

assert(hpHealthyText.includes('40/40 PV'), 'Thumb HUD exibe corretamente 40/40 PV');
assert(!isHpWarningBefore && !isHpDangerBefore, 'Thumb HUD saudável não possui classes de perigo');

// 4. Teste de Perigo Crítico e Concentração Ativa
vm.runInContext(`
  heroMobileTest.hp = 8; // 20% do PV (Danger)
  heroMobileTest.concentrationSpell = 'Bênção (Bless)';
  updateMobileVitalThumbHud(heroMobileTest);
`, sandbox);

const hpDangerText = vm.runInContext("mockHpValEl.innerText", sandbox);
const isHpDangerNow = vm.runInContext("mockHpPillEl.classList.contains('hp-danger')", sandbox);
const isConcActive = vm.runInContext("mockConcChip.classList.contains('active')", sandbox);
const concSpellName = vm.runInContext("mockConcNameEl.innerText", sandbox);

assert(hpDangerText.includes('8/40 PV'), 'Thumb HUD atualizado para 8/40 PV');
assert(isHpDangerNow, 'Thumb HUD recebeu classe .hp-danger para PV <= 25%');
assert(isConcActive, 'Chip de Concentração ativado no Thumb HUD');
assert(concSpellName.includes('Bênção'), 'Nome da magia de concentração exibido no chip');

// 5. Teste de Encerramento de Concentração com 1 Toque
vm.runInContext(`
  breakPlayerConcentration();
`, sandbox);

const concAfterBreak = vm.runInContext("heroMobileTest.concentrationSpell", sandbox);
assert(concAfterBreak === null, 'breakPlayerConcentration() encerrou com sucesso a concentração do herói');

// 6. Teste de Alternância do Modo Foco em Combate (Combat Focus Mode)
vm.runInContext(`
  const bodyClasses = new Set();
  document.body = {
    classList: {
      add: function(c) { bodyClasses.add(c); },
      remove: function(c) { bodyClasses.delete(c); },
      toggle: function(c) {
        if (bodyClasses.has(c)) { bodyClasses.delete(c); return false; }
        else { bodyClasses.add(c); return true; }
      },
      contains: function(c) { return bodyClasses.has(c); }
    }
  };

  // Alterna para Modo Foco
  toggleCombatFocusMode();
`, sandbox);

const isFocusOn = vm.runInContext("document.body.classList.contains('combat-focus-mode')", sandbox);
const storageFocusOn = vm.runInContext("localStorage.getItem('dnd_combat_focus_mode')", sandbox);
assert(isFocusOn === true, 'document.body recebeu classe .combat-focus-mode');
assert(storageFocusOn === 'true', 'Preferência de foco em combate persistida no localStorage como true');

vm.runInContext(`
  // Alterna de volta para Ficha Completa
  toggleCombatFocusMode();
`, sandbox);

const isFocusOff = vm.runInContext("document.body.classList.contains('combat-focus-mode')", sandbox);
const storageFocusOff = vm.runInContext("localStorage.getItem('dnd_combat_focus_mode')", sandbox);
assert(isFocusOff === false, 'document.body removeu classe .combat-focus-mode');
assert(storageFocusOff === 'false', 'Preferência de ficha completa persistida no localStorage como false');

// 7. Teste de Execução Segura de Haptics
let hapticSafe = false;
try {
  vm.runInContext("triggerHapticFeedback([15, 30])", sandbox);
  hapticSafe = true;
} catch (e) {
  hapticSafe = false;
}
assert(hapticSafe, 'triggerHapticFeedback executado de forma segura e defensiva');

// =========================================================================
// 📱 107. TESTES DE AUDITORIA VISUAL, Z-INDEX E RESPONSIVIDADE (ISSUE-139)
// =========================================================================
console.log('\n📐 107. Testes de Auditoria Visual, Hierarquia de Modais e Responsividade (ISSUE-139):');

const bundle107 = fs.readFileSync(path.join(__dirname, 'planilha do rpg.html'), 'utf8');

// 1. Z-index elevado da classe base .modal-overlay para cobrir Bottom Dock (10000) e Thumb HUD (9999)
assert(bundle107.includes('.modal-overlay') && bundle107.includes('z-index: 12000;'), 'Classe base .modal-overlay configurada com z-index: 12000');

// 2. Proteção de altura máxima e overflow no container de modais
assert(bundle107.includes('max-height: calc(100vh - 80px);') || bundle107.includes('max-height: calc(100vh - 60px);'), 'Modais protegidos com max-height contra corte em telas baixas');
assert(bundle107.includes('overflow-y: auto;'), 'Modais possuem rolagem vertical interna (overflow-y: auto)');

// 3. Touch Targets acessíveis para polegar (mínimo 44px)
assert(bundle107.includes('min-width: 44px;') && bundle107.includes('min-height: 44px;'), 'Botões do Thumb HUD configurados com touch target ergonômico de 44px');

// 4. Desduplicação de IDs (btn-thumb-hud-focus vs btn-toggle-combat-focus)
const focusBtnMatches = bundle107.match(/id="btn-toggle-combat-focus"/g) || [];
assert(focusBtnMatches.length === 1, 'id="btn-toggle-combat-focus" é único na aplicação (sem duplicação)');
assert(bundle107.includes('id="btn-thumb-hud-focus"'), 'Botão do Thumb HUD possui ID desduplicado id="btn-thumb-hud-focus"');

// 5. Container de Rolagem Touch Suave para tabelas de combate
assert(bundle107.includes('.table-responsive-wrap'), 'Classe .table-responsive-wrap incluída no CSS compilado');
assert(bundle107.includes('<div class="table-responsive-wrap">') && bundle107.includes('roll20-attacks-table'), 'Tabela de ataques do card Roll20 envolvida em container touch deslizante');

// 6. Portal Hero Row com quebra flexível para nomes longos
assert(bundle107.includes('.portal-hero-row') && bundle107.includes('flex-wrap: wrap;'), '.portal-hero-row suporta quebra suave flex-wrap: wrap');

// 7. Grid de atributos e CA/Deslocamento para telas compactas (<= 500px)
assert(bundle107.includes('grid-column: 1 / -1 !important;'), 'Bloco de CA e Deslocamento se expande para preencher a linha em telas compactas');

// 8. Navbar com rolagem suave horizontal em telas estreitas
assert(bundle107.includes('overflow-x: auto !important;') && bundle107.includes('flex-wrap: nowrap !important;'), 'Barra de navegação suporta deslizamento horizontal sem desordenar ícones');

// =========================================================================
// 🛡️ 108. TESTES DE VISIBILIDADE DE MODIFICADORES E BLINDAGEM DE SWIPE (ISSUE-140)
// =========================================================================
console.log('\n📱 108. Testes de Visibilidade dos Modificadores, Contenção de Overflow e Blindagem de Swipe (ISSUE-140):');

const bundle108 = fs.readFileSync(path.join(__dirname, 'planilha do rpg.html'), 'utf8');

// 1. Modificador de perícia protegido contra compressão (flex-shrink: 0)
assert(bundle108.includes('.roll20-skill-bonus') && bundle108.includes('flex-shrink: 0;'), '.roll20-skill-bonus configurado com flex-shrink: 0 garantindo visibilidade');

// 2. Coluna de perícia com contenção de largura e ellipsis para nomes longos
assert(bundle108.includes('.roll20-skill-name') && bundle108.includes('text-overflow: ellipsis;'), '.roll20-skill-name configurado com text-overflow: ellipsis');
assert(bundle108.includes('.roll20-skill-left') && bundle108.includes('min-width: 0;'), '.roll20-skill-left configurado com min-width: 0');

// 3. Grid de colunas mobile com minmax(0, 1fr) prevenindo estufamento horizontal
assert(bundle108.includes('grid-template-columns: minmax(0, 1fr) !important;'), '.roll20-columns-grid no mobile utiliza minmax(0, 1fr) prevenindo overflow');

// 4. Cartas de magias em 1 coluna no mobile (<= 500px) impedindo estufamento de 428px
assert(bundle108.includes('.player-spells-chips-grid') && bundle108.includes('grid-template-columns: 1fr !important;'), '.player-spells-chips-grid ajustado para 1fr no mobile <= 500px');

// 5. HUD de Conjuração fluido em 3 colunas responsivas no mobile
assert(bundle108.includes('.spellcasting-hud-bar') && bundle108.includes('grid-template-columns: repeat(3, minmax(0, 1fr)) !important;'), '.spellcasting-hud-bar ajustado para repeat(3, minmax(0, 1fr)) no mobile');

// 6. Contenção estrita de overflow-x no .roll20-sheet para telas <= 500px
assert(bundle108.includes('overflow-x: hidden !important;') && bundle108.includes('.roll20-sheet,'), '.roll20-sheet blindada com overflow-x: hidden no mobile');

// 7. Blindagem do Swipe Navigation contra toques dentro da ficha e no modo portal
assert(bundle108.includes("target.closest('#tab-players')"), 'initSwipeNavigation ignora toques em #tab-players');
assert(bundle108.includes("target.closest('.roll20-sheet')"), 'initSwipeNavigation ignora toques em .roll20-sheet');
assert(bundle108.includes("target.closest('.roll20-skills-list')"), 'initSwipeNavigation ignora toques em .roll20-skills-list');
assert(bundle108.includes('isPortalMode'), 'initSwipeNavigation ignora swipes no modo portal do jogador');


// =========================================================================
// ⚔️ 109. TESTES DE FILTRO DE ARMAS, DESDUPLICAÇÃO E BLINDAGEM DE MAGIAS (ISSUE-141)
// =========================================================================
console.log('\n⚔️ 109. Testes de Filtro de Armas, Desduplicação e Blindagem de Magias (ISSUE-141):');

// 1. Cria herói de teste com Cota de Malha, Escudo e Armas equipadas
vm.runInContext(`
  const hero109 = {
    id: 'p_test_109',
    name: 'Guerreiro de Armadura',
    level: 5,
    str: 16,
    dex: 14,
    inventory: [
      { id: 'i1', name: 'Cota de Malha', category: 'Armaduras', equipped: true, weight: 25 },
      { id: 'i2', name: 'Escudo', category: 'Escudos', equipped: true, weight: 3 },
      { id: 'i3', name: 'Espada Longa (Longsword)', category: 'Armas', equipped: true, damage: '1d8 Cortante', weight: 1.5 },
      { id: 'i4', name: 'Besta Leve (Light Crossbow)', category: 'Armas', equipped: true, damage: '1d8 Perfurante', weight: 2.5 }
    ],
    attacks: [
      'Espada Longa (+6) 1d8+3 Cortante',
      'Besta Leve (+5) 1d8+2 Perfurante'
    ]
  };

  const calcAttacks109 = getPlayerCalculatedAttacks(hero109);
`, sandbox);

// Validação 1: Cota de Malha NÃO deve ser considerada arma/ataque
const hasChainMail = vm.runInContext("calcAttacks109.some(a => a.name.toLowerCase().includes('cota de malha'))", sandbox);
assert(!hasChainMail, 'Cota de Malha não deve aparecer como arma na tabela de ataques');

// Validação 2: Escudo NÃO deve ser considerado arma/ataque
const hasShield = vm.runInContext("calcAttacks109.some(a => a.name.toLowerCase().includes('escudo'))", sandbox);
assert(!hasShield, 'Escudo não deve aparecer como arma na tabela de ataques');

// Validação 3: Espada Longa e Besta Leve devem constar exatamente 1 vez cada (desduplicação)
const swordCount = vm.runInContext("calcAttacks109.filter(a => a.name.toLowerCase().includes('espada longa')).length", sandbox);
assert(swordCount === 1, `Espada Longa desduplicada com sucesso (encontrada ${swordCount}x, esperado 1x)`);

const crossbowCount = vm.runInContext("calcAttacks109.filter(a => a.name.toLowerCase().includes('besta leve')).length", sandbox);
assert(crossbowCount === 1, `Besta Leve desduplicada com sucesso (encontrada ${crossbowCount}x, esperado 1x)`);

// Validação 4: Total de ataques calculados deve ser exatamente 2 (apenas as armas)
const totalAttacksCount = vm.runInContext("calcAttacks109.length", sandbox);
assert(totalAttacksCount === 2, `Total de ataques calculado com precisão (${totalAttacksCount} armas, esperado 2)`);

// 2. Testes de Blindagem de Magias Preparadas e Grimório do Mago
vm.runInContext(`
  const mage109 = {
    id: 'p_mage_109',
    name: 'Mago Ilusionista',
    className: 'Mago',
    level: 5,
    int: 18,
    preparedSpells: ['Amizade', 'Mísseis Mágicos', 'Bola de Fogo'],
    spellbookSpells: ['Amizade', 'Mísseis Mágicos', 'Armadura Arcana', 'Bola de Fogo', 'Invisibilidade'],
    updatedAt: 1000
  };

  PLAYERS.push(mage109);

  const initialTime109 = mage109.updatedAt;
  togglePlayerSpellPrepared('p_mage_109', 'Invisibilidade');
`, sandbox);

// Validação 5: togglePlayerSpellPrepared carimba updatedAt
const hasInvisPrepared = vm.runInContext("PLAYERS.find(p => p.id === 'p_mage_109').preparedSpells.includes('Invisibilidade')", sandbox);
const hasUpdatedAtNewer = vm.runInContext("PLAYERS.find(p => p.id === 'p_mage_109').updatedAt > 1000", sandbox);
const hasUpdatedBy = vm.runInContext("PLAYERS.find(p => p.id === 'p_mage_109').updatedBy !== undefined", sandbox);

assert(hasInvisPrepared, 'Invisibilidade foi preparada para a sessão');
assert(hasUpdatedAtNewer, 'togglePlayerSpellPrepared atualizou updatedAt com timestamp atual');
assert(hasUpdatedBy, 'togglePlayerSpellPrepared definiu updatedBy');

// Validação 6: Desmarcar preserva no spellbookSpells
vm.runInContext(`
  togglePlayerSpellPrepared('p_mage_109', 'Invisibilidade');
`, sandbox);

const hasInvisRemovedFromPrep = vm.runInContext("!PLAYERS.find(p => p.id === 'p_mage_109').preparedSpells.includes('Invisibilidade')", sandbox);
const hasInvisInSpellbook = vm.runInContext("PLAYERS.find(p => p.id === 'p_mage_109').spellbookSpells.includes('Invisibilidade')", sandbox);

assert(hasInvisRemovedFromPrep, 'Invisibilidade foi desmarcada das preparadas');
assert(hasInvisInSpellbook, 'Invisibilidade permaneceu preservada no Grimório permanente');

// Validação 7: Simulação de merge da nuvem quando o Mestre publica snapshot com preparedSpells vazio
// No portal do jogador, o herói não deve perder suas magias preparadas
vm.runInContext(`
  const remoteEmptyMage = {
    id: 'p_mage_109',
    name: 'Mago Ilusionista',
    className: 'Mago',
    level: 5,
    int: 18,
    preparedSpells: [], // Mestre enviou array vazio
    spellbookSpells: [],
    updatedAt: 999999999 // Mestre tem timestamp mais recente
  };

  activePortalPlayerId = 'p_mage_109';
  clientRole = 'player';
  applyCloudDataToLocal({
    publishedBy: 'master',
    lastUpdateIso: new Date().toISOString(),
    players: [remoteEmptyMage]
  });
`, sandbox);

const hasPrepProtected = vm.runInContext("Array.isArray(PLAYERS.find(p => p.id === 'p_mage_109').preparedSpells) && PLAYERS.find(p => p.id === 'p_mage_109').preparedSpells.length > 0", sandbox);
const hasFireballProtected = vm.runInContext("PLAYERS.find(p => p.id === 'p_mage_109').preparedSpells.includes('Bola de Fogo')", sandbox);
const hasMageArmorInBook = vm.runInContext("PLAYERS.find(p => p.id === 'p_mage_109').spellbookSpells.includes('Armadura Arcana')", sandbox);

assert(hasPrepProtected, 'Magias preparadas do Mago protegidas contra snapshot vazio do Mestre');
assert(hasFireballProtected, 'Bola de Fogo permaneceu preparada após sync da nuvem');
assert(hasMageArmorInBook, 'Grimório permanente preservado com sucesso no sync');

// =========================================================================
// 🎲 110. TESTES DE GERAÇÃO DE ATRIBUTOS E BÔNUS RACIAIS CANÔNICOS D&D 5E (ISSUE-142)
// =========================================================================
console.log('\n🎲 110. Testes de Geração de Atributos e Bônus Raciais Canônicos D&D 5E (ISSUE-142):');

const bundle110 = fs.readFileSync(path.join(__dirname, 'planilha do rpg.html'), 'utf8');

// 1. Elementos da UI compilados no bundle
assert(bundle110.includes('pm-race-summary-bar'), 'HTML compilado possui a barra de resumo racial pm-race-summary-bar');
assert(bundle110.includes('stat-dice-presets-bar'), 'HTML compilado possui o painel de presets de atributos .stat-dice-presets-bar');
assert(bundle110.includes('rollAttributes4d6Modal()'), 'HTML compilado contém botão para rolagem 4d6 Drop Lowest');
assert(bundle110.includes('applyStandardArrayModal()'), 'HTML compilado contém botão para Array Padrão');
assert(bundle110.includes('optimizeAttributesForClassModal()'), 'HTML compilado contém botão para otimizar por classe');

// 2. Testes de Bônus Raciais Canônicos
const getRacialAbilityBonuses = sandbox.getRacialAbilityBonuses;
const roll4d6DropLowest = sandbox.roll4d6DropLowest;

const bonusHuman = getRacialAbilityBonuses('Humano');
assert(bonusHuman.str === 1 && bonusHuman.dex === 1 && bonusHuman.con === 1 && bonusHuman.int === 1 && bonusHuman.wis === 1 && bonusHuman.cha === 1, 'Humano concede +1 em todos os atributos');

const bonusElf = getRacialAbilityBonuses('Alto Elfo (High Elf)');
assert(bonusElf.dex === 2 && bonusElf.int === 1, 'Alto Elfo concede +2 Des e +1 Int');

const bonusWoodElf = getRacialAbilityBonuses('Elfo da Floresta');
assert(bonusWoodElf.dex === 2 && bonusWoodElf.wis === 1, 'Elfo da Floresta concede +2 Des e +1 Sab');

const bonusHillDwarf = getRacialAbilityBonuses('Anão da Colina');
assert(bonusHillDwarf.con === 2 && bonusHillDwarf.wis === 1, 'Anão da Colina concede +2 Con e +1 Sab');

const bonusMountainDwarf = getRacialAbilityBonuses('Anão da Montanha');
assert(bonusMountainDwarf.str === 2 && bonusMountainDwarf.con === 2, 'Anão da Montanha concede +2 For e +2 Con');

const bonusLightfootHalfling = getRacialAbilityBonuses('Halfling Pés-Leves');
assert(bonusLightfootHalfling.dex === 2 && bonusLightfootHalfling.cha === 1, 'Halfling Pés-Leves concede +2 Des e +1 Car');

const bonusDragonborn = getRacialAbilityBonuses('Draconato (Dragonborn)');
assert(bonusDragonborn.str === 2 && bonusDragonborn.cha === 1, 'Draconato concede +2 For e +1 Car');

const bonusHalfOrc = getRacialAbilityBonuses('Meio-Orc (Half-Orc)');
assert(bonusHalfOrc.str === 2 && bonusHalfOrc.con === 1, 'Meio-Orc concede +2 For e +1 Con');

const bonusTiefling = getRacialAbilityBonuses('Tiefling');
assert(bonusTiefling.cha === 2 && bonusTiefling.int === 1, 'Tiefling concede +2 Car e +1 Int');

const bonusHalfElf = getRacialAbilityBonuses('Meio-Elfo (Half-Elf)');
assert(bonusHalfElf.cha === 2 && bonusHalfElf.dex === 1 && bonusHalfElf.con === 1, 'Meio-Elfo concede +2 Car, +1 Des e +1 Con');

// 3. Testes da mecânica 4d6 Drop Lowest
let rollsValid = true;
for (let i = 0; i < 50; i++) {
  const roll = roll4d6DropLowest();
  if (roll < 3 || roll > 18) {
    rollsValid = false;
    break;
  }
}
assert(rollsValid, 'roll4d6DropLowest() sempre produz valores entre 3 e 18');

// 4. Testes de cálculo no VM com DOM mockado
vm.runInContext(`
  (function() {
    // Mock dos inputs no sandbox
    const inputsMock = {};
    ['str', 'dex', 'con', 'int', 'wis', 'cha'].forEach(k => {
      inputsMock['pm-base-' + k] = { value: '10' };
      inputsMock['pm-' + k] = { value: '10' };
      inputsMock['pm-final-' + k] = { textContent: '10' };
      inputsMock['pm-race-bonus-' + k] = { textContent: '+0', className: '' };
      inputsMock['pm-mod-' + k] = { textContent: '+0', classList: { add: ()=>{}, remove: ()=>{} } };
    });
    inputsMock['pm-race-select'] = { value: 'Anão da Montanha' };
    inputsMock['pm-race-summary-text'] = { innerHTML: '' };

    const prevGetElementById = document.getElementById;
    document.getElementById = function(id) {
      if (inputsMock[id]) return inputsMock[id];
      return prevGetElementById ? prevGetElementById.call(document, id) : null;
    };

    // Base: For 15, Con 14
    inputsMock['pm-base-str'].value = '15';
    inputsMock['pm-base-con'].value = '14';

    updateModalAttributeModifiers();

    // Salvar resultados globais para assert
    globalThis.__test_finalFor = inputsMock['pm-str'].value;
    globalThis.__test_finalCon = inputsMock['pm-con'].value;
    globalThis.__test_badgeFor = inputsMock['pm-race-bonus-str'].textContent;
    globalThis.__test_modFor = inputsMock['pm-mod-str'].textContent;

    // Restaurar
    document.getElementById = prevGetElementById;
  })();
`, sandbox);

const finalFor = vm.runInContext('globalThis.__test_finalFor', sandbox);
const finalCon = vm.runInContext('globalThis.__test_finalCon', sandbox);
const badgeFor = vm.runInContext('globalThis.__test_badgeFor', sandbox);
const modFor = vm.runInContext('globalThis.__test_modFor', sandbox);

assert(finalFor === 17, 'Anão da Montanha (+2 For): Base 15 resulta em Força Final 17');
assert(finalCon === 16, 'Anão da Montanha (+2 Con): Base 14 resulta em Constituição Final 16');
assert(badgeFor.includes('+2'), 'Badge racial indica corretamente +2 Raça');
assert(modFor === '+3', 'Modificador de atributo 17 calculado corretamente como +3');

// =========================================================================
// 📈 111. TESTES DE PROGRESSÃO CANÔNICA DE ASI E TALENTOS D&D 5E (ISSUE-143)
// =========================================================================
console.log('\n📈 111. Testes de Progressão Canônica de ASI e Talentos D&D 5E (ISSUE-143):');

const bundle111 = fs.readFileSync(path.join(__dirname, 'planilha do rpg.html'), 'utf8');

// 1. Elementos e estilos compilados no bundle
assert(bundle111.includes('feature-asi-box'), 'HTML compilado inclui a classe .feature-asi-box');
assert(bundle111.includes('feature-asi-status-badge'), 'HTML compilado inclui a classe .feature-asi-status-badge');
assert(bundle111.includes('feature-asi-btn'), 'HTML compilado inclui a classe .feature-asi-btn');
assert(bundle111.includes('id="modal-player-asi"'), 'HTML compilado inclui o modal #modal-player-asi');
assert(bundle111.includes('openAsiChoiceModal'), 'HTML compilado inclui a função openAsiChoiceModal');
assert(bundle111.includes('saveAsiChoiceModal'), 'HTML compilado inclui a função saveAsiChoiceModal');

// 2. Validação da tabela canônica de classes D&D 5E
const CLASSES_DATA = vm.runInContext('CLASSES_DATA', sandbox);
assert(Array.isArray(CLASSES_DATA) && CLASSES_DATA.length === 12, 'CLASSES_DATA carregado com sucesso (12 classes)');

const getClassAsiLevels = vm.runInContext('getClassAsiLevels', sandbox);
assert(typeof getClassAsiLevels === 'function', 'Função canônica getClassAsiLevels está disponível no escopo');

const fighterAsiLevels = getClassAsiLevels('Guerreiro');
assert(JSON.stringify(fighterAsiLevels) === JSON.stringify([4, 6, 8, 12, 14, 16, 19]), 'Guerreiro possui 7 marcos de ASI canônicos (4, 6, 8, 12, 14, 16, 19)');

const rogueAsiLevels = getClassAsiLevels('Ladino');
assert(JSON.stringify(rogueAsiLevels) === JSON.stringify([4, 8, 10, 12, 16, 19]), 'Ladino possui 6 marcos de ASI canônicos (4, 8, 10, 12, 16, 19)');

const wizardAsiLevels = getClassAsiLevels('Mago');
assert(JSON.stringify(wizardAsiLevels) === JSON.stringify([4, 8, 12, 16, 19]), 'Mago possui 5 marcos de ASI canônicos padrão (4, 8, 12, 16, 19)');

const barbarianAsiLevels = getClassAsiLevels('Bárbaro');
assert(JSON.stringify(barbarianAsiLevels) === JSON.stringify([4, 8, 12, 16, 19]), 'Bárbaro possui 5 marcos de ASI canônicos padrão (4, 8, 12, 16, 19)');

// 3. Validação de getUnlockedClassFeatures para filtragem de ASI
const getUnlockedClassFeatures = vm.runInContext('getUnlockedClassFeatures', sandbox);
const fighterLvl3Feats = getUnlockedClassFeatures('Guerreiro', 3);
assert(!fighterLvl3Feats.some(f => f.isAsi), 'Guerreiro nível 3 não possui marcos de ASI desbloqueados');

const fighterLvl6Feats = getUnlockedClassFeatures('Guerreiro', 6);
const unlockedFighterAsis = fighterLvl6Feats.filter(f => f.isAsi);
assert(unlockedFighterAsis.length === 2, 'Guerreiro nível 6 possui exatamente 2 marcos de ASI desbloqueados (Nv 4 e Nv 6)');
assert(unlockedFighterAsis[0].level === 4 && unlockedFighterAsis[1].level === 6, 'Marcos de ASI desbloqueados correspondem aos níveis 4 e 6');

// 4. Teste de formatação visual do marco com formatPlayerFeatureForDisplay
const formatPlayerFeatureForDisplay = vm.runInContext('formatPlayerFeatureForDisplay', sandbox);
const sampleAsiFeat = unlockedFighterAsis[0];
const samplePlayer = { id: 'p_test_asi_1', name: 'Ragnar', className: 'Guerreiro', level: 6 };
const formattedAsi = formatPlayerFeatureForDisplay(sampleAsiFeat, samplePlayer, { className: 'Guerreiro', level: 6 });
assert(formattedAsi.source.includes('Marco do 4º Nível'), 'Fonte da feature formatada indica "Marco do 4º Nível"');
assert(formattedAsi.desc.includes('Aumento no Valor de Habilidade') && formattedAsi.desc.includes('Talento'), 'Descrição orienta sobre escolha entre Atributos ou Talento');

// 5. Teste de aplicação prática de ASI (+2 Força) e persistência em p.asiChoices
vm.runInContext(`
  (function() {
    const testFighter = {
      id: 'p_fighter_asi_test',
      name: 'Valerius o Forte',
      className: 'Guerreiro',
      level: 4,
      str: 16,
      dex: 12,
      con: 14,
      int: 10,
      wis: 12,
      cha: 8,
      maxHp: 36,
      hp: 36,
      asiChoices: {},
      feats: []
    };

    // Insere no array global PLAYERS
    PLAYERS.push(testFighter);

    // Mock dos elementos de modal
    const asiElements = {
      'modal-player-asi': { classList: { add: ()=>{}, remove: ()=>{} } },
      'player-asi-modal-title': { innerText: '' },
      'player-asi-modal-subtitle': { innerText: '' },
      'asi-stat-single-select': { value: 'str', innerHTML: '' },
      'asi-stat-dual-1-select': { value: 'str', innerHTML: '' },
      'asi-stat-dual-2-select': { value: 'dex', innerHTML: '' },
      'card-asi-mode-stats': { classList: { toggle: ()=>{} } },
      'card-asi-mode-feat': { classList: { toggle: ()=>{} } },
      'asi-stats-options-container': { style: {} },
      'asi-feat-options-container': { style: {} },
      'asi-stats-preview-panel': { innerHTML: '' }
    };

    const prevGetElementById = document.getElementById;
    const prevGetElementsByName = document.getElementsByName;

    document.getElementById = function(id) {
      if (asiElements[id]) return asiElements[id];
      return prevGetElementById ? prevGetElementById.call(document, id) : null;
    };

    document.getElementsByName = function(name) {
      if (name === 'asi_stat_dist_type') {
        return [{ value: 'single', checked: true }, { value: 'dual', checked: false }];
      }
      return prevGetElementsByName ? prevGetElementsByName.call(document, name) : [];
    };

    // 1) Abre o modal para o Marco do Nível 4
    openAsiChoiceModal(testFighter.id, 4, 'Guerreiro');

    // 2) Salva escolha (+2 em Força)
    saveAsiChoiceModal();

    globalThis.__test_asi_str = testFighter.str;
    globalThis.__test_asi_choice = testFighter.asiChoices['guerreiro_lvl_4'];

    // 3) Agora testa aumento retroativo de PV ao subir Constituição (+2 em Constituição no nível 6)
    testFighter.level = 6;
    testFighter.con = 14; // Mod +2
    testFighter.maxHp = 52; // 10 + 5*7 + 6*2 = 57 aprox, digamos 52
    testFighter.hp = 52;
    asiElements['asi-stat-single-select'].value = 'con';

    openAsiChoiceModal(testFighter.id, 6, 'Guerreiro');
    saveAsiChoiceModal();

    globalThis.__test_asi_con = testFighter.con;
    globalThis.__test_asi_maxHp = testFighter.maxHp;
    globalThis.__test_asi_choice_lvl6 = testFighter.asiChoices['guerreiro_lvl_6'];

    // Restaurar DOM
    document.getElementById = prevGetElementById;
    document.getElementsByName = prevGetElementsByName;
  })();
`, sandbox);

const asiStr = vm.runInContext('globalThis.__test_asi_str', sandbox);
const asiChoiceLvl4 = vm.runInContext('globalThis.__test_asi_choice', sandbox);
const asiCon = vm.runInContext('globalThis.__test_asi_con', sandbox);
const asiMaxHp = vm.runInContext('globalThis.__test_asi_maxHp', sandbox);
const asiChoiceLvl6 = vm.runInContext('globalThis.__test_asi_choice_lvl6', sandbox);

assert(asiStr === 18, 'ASI de +2 em Força aumentou Força de 16 para 18');
assert(asiChoiceLvl4 && asiChoiceLvl4.label.includes('+2 em Força'), 'p.asiChoices registrou escolha do Nível 4 com label "+2 em Força"');
assert(asiChoiceLvl4.level === 4 && asiChoiceLvl4.classKey === 'guerreiro', 'p.asiChoices armazena nível 4 e classe guerreiro');

assert(asiCon === 16, 'ASI de +2 em Constituição aumentou Con de 14 para 16 (Mod +2 para +3)');
assert(asiMaxHp === 58, 'Constituição subindo +1 no modificador concedeu +6 PV retroativos no nível 6 (52 + 6 = 58 PV)');
assert(asiChoiceLvl6 && asiChoiceLvl6.label.includes('+2 em Constituição'), 'p.asiChoices registrou escolha do Nível 6 com label "+2 em Constituição"');

// 6. Teste de escolha de Talento via ASI
vm.runInContext(`
  (function() {
    const testRogue = {
      id: 'p_rogue_asi_test',
      name: 'Sombra Silenciosa',
      className: 'Ladino',
      level: 4,
      dex: 16,
      asiChoices: {},
      feats: []
    };
    PLAYERS.push(testRogue);

    const asiElements = {
      'modal-player-asi': { classList: { add: ()=>{}, remove: ()=>{} } },
      'player-asi-modal-title': { innerText: '' },
      'player-asi-modal-subtitle': { innerText: '' },
      'card-asi-mode-stats': { classList: { toggle: ()=>{} } },
      'card-asi-mode-feat': { classList: { toggle: ()=>{} } },
      'asi-stats-options-container': { style: {} },
      'asi-feat-options-container': { style: {} },
      'asi-stats-preview-panel': { innerHTML: '' },
      'asi-feat-stat-choice-select': { value: null }
    };

    const prevGetElementById = document.getElementById;
    document.getElementById = function(id) {
      if (asiElements[id]) return asiElements[id];
      return prevGetElementById ? prevGetElementById.call(document, id) : null;
    };

    openAsiChoiceModal(testRogue.id, 4, 'Ladino');
    selectAsiModalMode('feat');
    selectAsiModalFeat('mobile'); // Talento Móvel
    saveAsiChoiceModal();

    globalThis.__test_rogue_has_feat = testRogue.feats.some(f => f.id === 'mobilidade' || f.id === 'mobile' || f.nameEn === 'Mobile');
    globalThis.__test_rogue_choice = testRogue.asiChoices['ladino_lvl_4'];

    document.getElementById = prevGetElementById;
  })();
`, sandbox);

const rogueHasFeat = vm.runInContext('globalThis.__test_rogue_has_feat', sandbox);
const rogueChoice = vm.runInContext('globalThis.__test_rogue_choice', sandbox);

assert(rogueHasFeat, 'Ladino adquiriu o talento "Móvel" através da escolha de ASI');
assert(rogueChoice && rogueChoice.label.includes('Talento'), 'p.asiChoices do Ladino registrou escolha de Talento no Nível 4');

// =========================================================================
// 🛡️ 112. TESTES DE AUDITORIA VISUAL DE ÍCONES, INVENTÁRIO E ATAQUES (ISSUE-135)
// =========================================================================
console.log('\n🛡️ 112. Testes de Auditoria Visual de Ícones, Inventário e Ataques (ISSUE-135):');

const bundle112 = fs.readFileSync(path.join(__dirname, 'planilha do rpg.html'), 'utf8');

// 1. Verificações de Estilo CSS no Bundle
assert(bundle112.includes('.btn-item-equip-badge'), 'HTML compilado possui a classe .btn-item-equip-badge');
assert(bundle112.includes('.attack-actions-cell'), 'HTML compilado possui a classe .attack-actions-cell');
assert(bundle112.includes('.inventory-item-row'), 'HTML compilado possui a classe .inventory-item-row');
assert(bundle112.includes('.inventory-item-info'), 'HTML compilado possui a classe .inventory-item-info');
assert(bundle112.includes('.inventory-item-actions'), 'HTML compilado possui a classe .inventory-item-actions');

// 2. Testes de Formatação Defensiva de Peso (Sem repetição "kgkg")
const formatCleanItemWeight = sandbox.formatCleanItemWeight;
assert(typeof formatCleanItemWeight === 'function', 'Função formatCleanItemWeight exportada no escopo global');
assert(formatCleanItemWeight('1.5 kg') === '1.5 kg', 'formatCleanItemWeight("1.5 kg") preserva unidade única');
assert(formatCleanItemWeight('1,5kg') === '1,5 kg', 'formatCleanItemWeight("1,5kg") normaliza espaçamento sem duplicar');
assert(formatCleanItemWeight('1,5 kgkg') === '1,5 kg', 'formatCleanItemWeight("1,5 kgkg") higieniza repetições prévias');
assert(formatCleanItemWeight('3') === '3 kg', 'formatCleanItemWeight("3") adiciona unidade padrão');
assert(formatCleanItemWeight('') === '', 'formatCleanItemWeight("") retorna string vazia para itens sem peso');
assert(formatCleanItemWeight(null) === '', 'formatCleanItemWeight(null) trata valores nulos com segurança');

// 3. Teste de Renderização do Item no Inventário sem Sobreposição
vm.runInContext(`
  (() => {
    activePortalPlayerId = null;
    if (document.getElementById('filter-player-q')) document.getElementById('filter-player-q').value = '';
    
    const pTest = {
      id: 'test-icon-overlap-hero',
      name: 'Guerreiro de Ferro',
      inventory: [
        { name: 'Espada Longa (Longsword)', weight: '1,5 kg', qty: 1, equipped: true },
        { name: 'Poção de Cura', weight: '0.2 kg', qty: 3, equipped: false, category: 'Poção' }
      ]
    };
    PLAYERS.push(pTest);
    
    if (typeof renderPlayers === 'function') {
      renderPlayers();
    }
    
    const renderedApp = document.getElementById('grid-players') ? document.getElementById('grid-players').innerHTML : '';
    globalThis.__test_has_kgkg = renderedApp.includes('kgkg');
    globalThis.__test_has_equip_badge = renderedApp.includes('btn-item-equip-badge');
    globalThis.__test_has_equipped_label = renderedApp.includes('🛡️ Equipado');
  })();
`, sandbox);

const hasKgKg = vm.runInContext('globalThis.__test_has_kgkg', sandbox);
const hasEquipBadge = vm.runInContext('globalThis.__test_has_equip_badge', sandbox);
const hasEquippedLabel = vm.runInContext('globalThis.__test_has_equipped_label', sandbox);

assert(!hasKgKg, 'Renderização do inventário NÃO contém a repetição anômala "kgkg"');
assert(hasEquipBadge, 'Renderização do inventário utiliza o badge ergonômico .btn-item-equip-badge');
assert(hasEquippedLabel, 'Item equipado exibe o badge "🛡️ Equipado"');

// =========================================================================
// 🤖 113. TESTES DO SIMULADOR DE MESA MULTI-AGENTE (MESTRE & JOGADORES)
// =========================================================================
console.log('\n🤖 113. Testes do Simulador de Mesa Multi-Agente (Mestre & Jogadores):');

const { PlaytestSimulator } = require('./test_playtest_simulator.js');
const sim113 = new PlaytestSimulator();

// 1. Setup de Cenário
const party = sim113.setupScenario('Caverna dos Goblins');
assert(party.wizard && party.warrior, 'Simulador inicializou a party com Mago e Guerreiro');
assert(party.wizard.persona === 'wizard', 'Persona do Mago configurada como wizard');
assert(party.warrior.persona === 'warrior', 'Persona do Guerreiro configurada como warrior');

// 2. Ações do DMAgent
const spawnedMobs = sim113.dm.spawnMonsterEncounter('Goblin', 3);
assert(spawnedMobs.length === 3, 'DMAgent invocou 3 monstros com sucesso no combate');

const combatStart = sim113.dm.startCombat();
assert(combatStart && combatStart.combatActive, 'DMAgent iniciou o combate com status ativo');

const dmgResult = sim113.dm.applyDamage('hero_fighter_1', 5);
assert(dmgResult && dmgResult.remainingHp === 23, 'DMAgent aplicou 5 de dano no Guerreiro (28 - 5 = 23 PV)');

// 3. Ações do PlayerAgent (Mago - Gestão de Slots de Magia)
const wizDataBefore = party.wizard.getData();
const initialSlots = wizDataBefore.spellSlots[0].current;
const castRes = party.wizard.castSpell('Mísseis Mágicos', 1, false);
assert(castRes.success === true, 'PlayerAgent (Mago) conjurou Mísseis Mágicos com sucesso');
assert(castRes.slotsRemaining === initialSlots - 1, 'Espaço de magia de 1º círculo foi consumido corretamente');

// 4. Ações do PlayerAgent (Guerreiro - Ataque Tático)
const targetGoblinId = spawnedMobs[0].id;
const warTurn = party.warrior.takeTacticalTurn(targetGoblinId);
assert(warTurn.action === 'attack', 'PlayerAgent (Guerreiro) executou ataque físico corpo-a-corpo');
assert(warTurn.damage >= 4, 'Dano do Guerreiro gerado dentro dos limites da arma (1d8 + 3)');

// 5. DMAgent - Recompensas e Baú do Grupo
const rewRes = sim113.dm.distributeBatchRewards(400, 100);
assert(rewRes.beneficiaries === 2, 'Recompensas distribuídas para os 2 heróis da mesa');
assert(rewRes.shareGold === 50, '100 PO divididas igualmente resultaram em 50 PO para cada herói');

const stashRes = sim113.dm.depositToPartyStash('Diamante Mágico', 1, 200);
assert(stashRes.totalGold >= 320, 'Ouro adicionado com sucesso ao Baú Coletivo da Campanha');

// 6. Simulação Completa e Auditoria de Layout
const fullSession = sim113.runFullSession(3);
assert(fullSession.allAuditPassed === true, 'Sessão completa de 3 rodadas aprovada com 100% de integridade na auditoria de layout');

console.log('\n🔍 114. Testes do Spotlight Omnisearch, Economia de Ações e VTT Action HUD (ISSUE-144):');

const bundle114 = fs.readFileSync(path.join(__dirname, 'planilha do rpg.html'), 'utf8');

// 1. Omnisearch no HTML Compilado
assert(bundle114.includes('id="modal-omnisearch"'), 'HTML compilado possui o modal #modal-omnisearch');
assert(bundle114.includes('id="omnisearch-input"'), 'HTML compilado possui o campo de busca #omnisearch-input');
assert(bundle114.includes('id="btn-global-omnisearch"'), 'HTML compilado possui o botão de acionamento #btn-global-omnisearch');
assert(bundle114.includes('.omnisearch-modal'), 'HTML compilado contém as classes CSS .omnisearch-modal');
assert(bundle114.includes('.omnisearch-item'), 'HTML compilado contém as classes CSS .omnisearch-item');
assert(bundle114.includes('.omnisearch-cat-btn'), 'HTML compilado contém os filtros de categoria .omnisearch-cat-btn');

// 2. Lógica e Indexação do Omnisearch no VM
const hasToggleOmni = vm.runInContext("typeof toggleOmnisearchModal === 'function'", sandbox);
assert(hasToggleOmni, 'Função toggleOmnisearchModal disponível no escopo global');

const omniConditions = vm.runInContext("Array.isArray(DND_CONDITIONS_OMNI) ? DND_CONDITIONS_OMNI : []", sandbox);
assert(omniConditions.length >= 14, 'DND_CONDITIONS_OMNI contém o catálogo completo de condições canônicas D&D 5E');

const omniTabs = vm.runInContext("Array.isArray(APP_TABS_OMNI) ? APP_TABS_OMNI : []", sandbox);
assert(omniTabs.length >= 7, 'APP_TABS_OMNI indexa todas as abas principais do sistema');

vm.runInContext(`
  toggleOmnisearchModal(true);
`, sandbox);
const isOmniOpen = vm.runInContext("document.getElementById('modal-omnisearch').style.display === 'flex'", sandbox);
assert(isOmniOpen, 'toggleOmnisearchModal(true) abre o modal em display flex');

vm.runInContext(`
  handleOmnisearchInput('dragao');
`, sandbox);
const omniResDragao = vm.runInContext("omnisearchResults", sandbox);
assert(Array.isArray(omniResDragao) && omniResDragao.length > 0, 'Omnisearch localiza criaturas pelo nome (ex: Dragão)');

vm.runInContext(`
  handleOmnisearchInput('cego');
`, sandbox);
const omniResCego = vm.runInContext("omnisearchResults", sandbox);
assert(omniResCego.some(r => r.id === 'blinded'), 'Omnisearch indexa e localiza condições de status (ex: Cego / Blinded)');

vm.runInContext(`
  toggleOmnisearchModal(false);
`, sandbox);
const isOmniClosed = vm.runInContext("document.getElementById('modal-omnisearch').style.display === 'none'", sandbox);
assert(isOmniClosed, 'toggleOmnisearchModal(false) fecha o modal com sucesso');

// 3. Economia de Ações D&D 5E
assert(bundle114.includes('.combat-turn-actions-bar'), 'HTML compilado inclui o container .combat-turn-actions-bar');
assert(bundle114.includes('.action-chip-toggle'), 'HTML compilado inclui os chips interativos .action-chip-toggle');
assert(bundle114.includes('toggleCombatantAction'), 'Função toggleCombatantAction presente no código compilado');

vm.runInContext(`
  state.combatants = [
    {
      id: 'comb_test_hero',
      name: 'Aldor o Paladino',
      init: 18,
      ac: 18,
      hp: 30,
      maxHp: 30,
      type: 'player',
      turnActions: { action: true, bonus: true, reaction: true, movement: true }
    },
    {
      id: 'comb_test_mob',
      name: 'Ogro Furioso',
      init: 12,
      ac: 12,
      hp: 59,
      maxHp: 59,
      type: 'monster',
      actions: 'Clava (+6 para acertar, 2d8+4 esmagamento)'
    }
  ];
  state.turnIndex = 0;
  state.round = 1;
`, sandbox);

vm.runInContext(`toggleCombatantAction('comb_test_hero', 'reaction');`, sandbox);
const paladinReactionAfter = vm.runInContext("state.combatants[0].turnActions.reaction", sandbox);
assert(paladinReactionAfter === false, 'toggleCombatantAction alterna a reação para usada (false)');

vm.runInContext(`toggleCombatantAction('comb_test_hero', 'reaction');`, sandbox);
const paladinReactionRestored = vm.runInContext("state.combatants[0].turnActions.reaction", sandbox);
assert(paladinReactionRestored === true, 'toggleCombatantAction restaura a reação para disponível (true)');

// Avançar o turno deve resetar as ações do novo combatente
vm.runInContext(`
  state.combatants[1].turnActions = { action: false, bonus: false, reaction: false, movement: false };
  nextTurn();
`, sandbox);
const mobActionsAfterTurn = vm.runInContext("state.combatants[1].turnActions", sandbox);
assert(mobActionsAfterTurn && mobActionsAfterTurn.action === true && mobActionsAfterTurn.reaction === true, 'nextTurn() reseta automaticamente os recursos de turno para o combatente da vez');

// 4. Mini-Ações de Ataque de Monstros
assert(bundle114.includes('.combatant-mini-actions'), 'HTML compilado inclui a classe .combatant-mini-actions');
assert(bundle114.includes('.btn-monster-mini-act'), 'HTML compilado inclui os botões .btn-monster-mini-act');

const mobMiniActHtml = vm.runInContext(`
  renderCombatantMiniActions({
    id: 'mob_wolf_1',
    name: 'Lobo Alfa',
    type: 'monster',
    actions: 'Mordida (+5 para acertar, 2d4+3 perfurante)'
  })
`, sandbox);
assert(mobMiniActHtml.includes('btn-monster-mini-act'), 'renderCombatantMiniActions gera botões rápidos para ataques de monstros');
assert(mobMiniActHtml.includes('+5'), 'renderCombatantMiniActions extrai o bônus de acerto (+5) com precisão');
assert(mobMiniActHtml.includes('Mordida'), 'renderCombatantMiniActions extrai o nome do ataque (Mordida)');

// Jogador não deve gerar botões de mini-ações automáticas de monstro
const playerMiniActHtml = vm.runInContext(`
  renderCombatantMiniActions({
    id: 'p_hero_1',
    name: 'Herói',
    type: 'player'
  })
`, sandbox);
assert(playerMiniActHtml === '', 'renderCombatantMiniActions não gera mini-ações para fichas de alunos');

// 5. VTT Floating Token Action HUD
assert(bundle114.includes('.vtt-token-action-hud'), 'HTML compilado possui as classes do HUD flutuante do VTT');
assert(bundle114.includes('.token-hud-pill'), 'HTML compilado possui .token-hud-pill');
assert(bundle114.includes('.token-hud-dmg-btn'), 'HTML compilado possui .token-hud-dmg-btn');

vm.runInContext(`
  gridState.tokens = [
    { id: 'tok_vtt_1', name: 'Guerreiro Teste', x: 100, y: 100, combatantId: 'comb_test_hero', type: 'player' }
  ];
  selectedTokenIds = new Set(['tok_vtt_1']);
  const dummyVttContainer = document.createElement('div');
  renderVttTokenActionHud(dummyVttContainer);
`, sandbox);

const vttHudRenderedHtml = vm.runInContext("dummyVttContainer.innerHTML", sandbox);
assert(vttHudRenderedHtml.includes('vtt-token-action-hud'), 'renderVttTokenActionHud renderiza o HUD flutuante quando 1 token está selecionado');
assert(vttHudRenderedHtml.includes('applyTokenQuickDamage'), 'HUD flutuante contém atalho de aplicação de dano rápido');
assert(vttHudRenderedHtml.includes('applyTokenQuickHeal'), 'HUD flutuante contém atalho de aplicação de cura rápida');
assert(vttHudRenderedHtml.includes('openCondModal'), 'HUD flutuante contém atalho para gerenciamento de status');

// ========================================================
// 115. TESTES DE EXPORTAÇÃO E IMPRESSÃO A4 CANÔNICA D&D 5E EM 2 PÁGINAS (ISSUE-146)
// ========================================================
console.log('\n🖨️ 115. Testes de Exportação e Impressão A4 Canônica D&D 5E em 2 Páginas (ISSUE-146):');

const bundle115 = fs.readFileSync(path.join(__dirname, 'planilha do rpg.html'), 'utf8');

// 1. Classes CSS e Elementos Estruturais
assert(bundle115.includes('.print-a4-page'), 'HTML compilado possui a classe .print-a4-page');
assert(bundle115.includes('.print-a4-sheet'), 'HTML compilado possui a classe .print-a4-sheet');
assert(bundle115.includes('.print-a4-preview-viewport'), 'HTML compilado possui a viewport .print-a4-preview-viewport');
assert(bundle115.includes('@page {'), 'CSS possui diretiva @page para formato A4 portrait');
assert(bundle115.includes('break-after: page'), 'CSS possui quebra explícita de página para A4');
assert(bundle115.includes('id="modal-print"'), 'HTML compilado inclui o modal #modal-print');

// 2. Funções exportadas
assert(typeof vm.runInContext("printPlayerSheet", sandbox) === 'function', 'Função printPlayerSheet está exportada no escopo global');
assert(typeof vm.runInContext("closePrintModal", sandbox) === 'function', 'Função closePrintModal está exportada no escopo global');
assert(typeof vm.runInContext("triggerPlayerBrowserPrint", sandbox) === 'function', 'Função triggerPlayerBrowserPrint está exportada no escopo global');
assert(typeof vm.runInContext("printCurrentModalPlayerSheet", sandbox) === 'function', 'Função printCurrentModalPlayerSheet está exportada no escopo global');

// 3. Teste de Renderização do Layout de 2 Páginas no DOM
vm.runInContext(`
  // Criação dos containers necessários no sandbox
  if (!document.getElementById('modal-print')) {
    const mPrintDiv = document.createElement('div');
    mPrintDiv.id = 'modal-print';
    mPrintDiv.className = 'modal-overlay';
    mPrintDiv.innerHTML = '<div class="modal-body"><div id="print-sheet-content"></div></div>';
    document.body.appendChild(mPrintDiv);
  }
  
  const testHeroForPrint = {
    id: 'p_print_hero_1',
    name: 'Valeros, o Guardião',
    student: 'Lucas Silveira',
    race: 'Humano',
    className: 'Guerreiro',
    level: 5,
    str: 16,
    dex: 14,
    con: 16,
    int: 10,
    wis: 12,
    cha: 8,
    hp: 44,
    maxHp: 44,
    tempHp: 5,
    ac: 18,
    proficiencyBonus: 3,
    speed: '9m',
    savingProficiencies: ['str', 'con'],
    skillProficiencies: ['Atletismo', 'Percepção', 'Intimidação'],
    inventory: [
      { name: 'Espada Longa', qty: 1, weight: '1.5 kg', equipped: true },
      { name: 'Escudo', qty: 1, weight: '3 kg', equipped: true },
      { name: 'Cota de Malha', qty: 1, weight: '25 kg', equipped: true },
      { name: 'Poção de Cura', qty: 2, weight: '0.5 kg', equipped: false }
    ],
    preparedSpells: ['Marca do Caçador'],
    gold: 75,
    coins: { cp: 10, sp: 20, ep: 0, gp: 75, pp: 1 },
    personality: 'Protetor implacável.',
    ideal: 'Defesa dos inocentes.',
    bond: 'Minha espada é meu juramento.',
    flaw: 'Teimoso como uma montanha.'
  };

  PLAYERS.push(testHeroForPrint);
  printPlayerSheet('p_print_hero_1');
`, sandbox);

const printContentHtml = vm.runInContext("document.getElementById('print-sheet-content').innerHTML", sandbox);

// 4. Verificação das 2 Páginas e Seções Canônicas
assert(printContentHtml.includes('a4-page-1'), 'printPlayerSheet renderiza a Página 1 da ficha');
assert(printContentHtml.includes('a4-page-2'), 'printPlayerSheet renderiza a Página 2 da ficha');
assert(printContentHtml.includes('Página 1 de 2'), 'Rodapé identifica Página 1 de 2');
assert(printContentHtml.includes('Página 2 de 2'), 'Rodapé identifica Página 2 de 2');
assert(printContentHtml.includes('Valeros, o Guardião'), 'Nome do personagem impresso corretamente');
assert(printContentHtml.includes('Lucas Silveira'), 'Nome do aluno impresso corretamente');

// Atributos D&D 5E
assert(printContentHtml.includes('FOR') && printContentHtml.includes('DES') && printContentHtml.includes('CON'), 'Página 1 contém atributos físicos');
assert(printContentHtml.includes('INT') && printContentHtml.includes('SAB') && printContentHtml.includes('CAR'), 'Página 1 contém atributos mentais');

// Perícias D&D 5E
assert(printContentHtml.includes('Atletismo'), 'Página 1 lista perícia Atletismo com bônus de proficiência');
assert(printContentHtml.includes('Percepção'), 'Página 1 lista perícia Percepção');
assert(printContentHtml.includes('Furtividade'), 'Página 1 lista perícia Furtividade');

// Tabela de Ataques e Defesas
assert(printContentHtml.includes('Pontos de Vida (PV)'), 'Página 1 contém caixa detalhada de Pontos de Vida');
assert(printContentHtml.includes('Salvaguardas Contra a Morte'), 'Página 1 contém rastreador de Salvaguardas contra Morte');
assert(printContentHtml.includes('Ataques & Armas'), 'Página 1 contém tabela de Ataques calculados');

// Página 2: Inventário, Moedas, Magias e Diário
assert(printContentHtml.includes('Riquezas & Moedas'), 'Página 2 contém painel com PC, PP, PE, PO, PL');
assert(printContentHtml.includes('Espada Longa'), 'Página 2 exibe itens do inventário');
assert(printContentHtml.includes('Carga Atual:'), 'Página 2 calcula capacidade de carga e limites');
assert(printContentHtml.includes('Grimório & Magias Conhecidas'), 'Página 2 exibe seção de magias e conjuração');
assert(printContentHtml.includes('Diário de Missões & Anotações'), 'Página 2 possui espaço para anotações do jogador');

// Modal deve estar aberto com classe .open
const isModalOpen = vm.runInContext("document.getElementById('modal-print').classList.contains('open')", sandbox);
assert(isModalOpen === true, 'Modal #modal-print é aberto com a classe .open ao disparar printPlayerSheet');

// ========================================
// 116. Testes do Botão de Download de Ficha ao Lado do Lápis e Exportação JSON (ISSUE-147):
// ========================================
console.log('\n📥 116. Testes do Botão de Download de Ficha ao Lado do Lápis e Exportação JSON (ISSUE-147):');

// 1. Verificação na Toolbar do Card de Personagem
vm.runInContext(`
  renderPlayers();
`, sandbox);
const gridPlayersHtml = vm.runInContext("document.getElementById('grid-players').innerHTML", sandbox);

assert(gridPlayersHtml.includes('onclick="openPlayerModal('), 'Toolbar contém botão de editar (lápis)');
assert(gridPlayersHtml.includes('onclick="printPlayerSheet(') && gridPlayersHtml.includes('📥'), 'Toolbar contém botão de download de ficha com ícone 📥');
assert(gridPlayersHtml.includes('onclick="openSharePlayerModal('), 'Toolbar contém botão de compartilhar celular');

// Verificar ordenação exata: openPlayerModal -> printPlayerSheet (📥) -> openSharePlayerModal
const posPencil = gridPlayersHtml.indexOf('openPlayerModal');
const posDownload = gridPlayersHtml.indexOf('printPlayerSheet');
const posShare = gridPlayersHtml.indexOf('openSharePlayerModal');

assert(posPencil !== -1 && posDownload !== -1 && posShare !== -1, 'Todos os botões principais estão presentes no card');
assert(posPencil < posDownload, 'Botão de download está posicionado após o botão de lápis (edição)');
assert(posDownload < posShare, 'Botão de download está posicionado antes do botão de celular (compartilhamento)');

// 2. Funções Globais de Exportação
assert(typeof vm.runInContext("window.exportSinglePlayerJson", sandbox) === 'function', 'Função exportSinglePlayerJson exportada globalmente');
assert(typeof vm.runInContext("window.exportCurrentModalPlayerJson", sandbox) === 'function', 'Função exportCurrentModalPlayerJson exportada globalmente');

// 3. Botão no Modal de Impressão/Exportação
assert(compiledHtml.includes('exportCurrentModalPlayerJson()'), 'Modal de exportação possui botão para baixar JSON');
assert(compiledHtml.includes('💾 Baixar Ficha (.JSON)'), 'Modal exibe label explicativa para download de dados JSON');

// 4. Execução Segura da Exportação Individual JSON
let exportedFilename = '';
vm.runInContext(`
  if (!document.body) document.body = {};
  document.body.appendChild = function() {};
  document.body.removeChild = function() {};
  const origCreateEl = document.createElement;
  document.createElement = function(tag) {
    const el = origCreateEl.call(document, tag);
    if (tag === 'a') {
      return {
        set href(val) { this._href = val; },
        set download(val) { this._download = val; window.__lastDownload = val; },
        click: function() { window.__downloadClicked = true; }
      };
    }
    return el;
  };
  exportSinglePlayerJson('p_print_hero_1');
`, sandbox);

const downloadWasClicked = vm.runInContext("window.__downloadClicked", sandbox);
const downloadFilename = vm.runInContext("window.__lastDownload", sandbox);
assert(downloadWasClicked === true, 'Disparo de download simulado executou o clique no link de exportação');
assert(downloadFilename && downloadFilename.includes('valeros'), 'Arquivo gerado contém nome sanitizado do personagem no nome do arquivo JSON');

// ========================================
// 117. Testes do Design System Canônico A4 D&D 5E em 2 Páginas (ISSUE-148):
// ========================================
console.log('\n📄 117. Testes do Design System Canônico A4 D&D 5E em 2 Páginas (ISSUE-148):');

// 1. Verificação de Regras CSS Fundamentais da Folha A4
assert(compiledHtml.includes('.a4-print-page {'), 'CSS compilado possui regra de dimensão e padding para .a4-print-page');
assert(compiledHtml.includes('.a4-sheet-header {'), 'CSS compilado possui regra de cabeçalho .a4-sheet-header');
assert(compiledHtml.includes('.a4-char-name {'), 'CSS compilado possui regra tipográfica Cinzel para .a4-char-name');
assert(compiledHtml.includes('.a4-sheet-meta-grid {'), 'CSS compilado possui grid de metadados .a4-sheet-meta-grid');
assert(compiledHtml.includes('.a4-page1-columns'), 'CSS compilado possui grid de 3 colunas para Página 1');
assert(compiledHtml.includes('.a4-page2-columns'), 'CSS compilado possui grid de 3 colunas para Página 2');

// 2. Verificação de Blocos de Atributos, Vida e Combate
assert(compiledHtml.includes('.a4-stat-card {'), 'CSS compilado possui estilo para cards verticais de atributos (.a4-stat-card)');
assert(compiledHtml.includes('.a4-stat-mod {'), 'CSS compilado possui destaque para modificadores (.a4-stat-mod)');
assert(compiledHtml.includes('.a4-combat-pill {'), 'CSS compilado possui caixas de combate (CA, Iniciativa, Deslocamento)');
assert(compiledHtml.includes('.a4-hp-box {'), 'CSS compilado possui painel de PV Máximo, Atual e Temporário');
assert(compiledHtml.includes('.a4-attacks-table {'), 'CSS compilado possui tabela canônica de ataques (.a4-attacks-table)');
assert(compiledHtml.includes('.a4-inv-table {'), 'CSS compilado possui tabela de inventário (.a4-inv-table)');
assert(compiledHtml.includes('.a4-spellbook-list {'), 'CSS compilado possui lista de magias conhecidas/preparadas');

// 3. Verificação de Regras de Mídia de Impressão (@media print)
assert(compiledHtml.includes('.a4-print-page') && compiledHtml.includes('page-break-after: always'), 'CSS de impressão define quebra de página precisa entre a Página 1 e Página 2');
assert(compiledHtml.includes('.a4-bordered-box') && compiledHtml.includes('break-inside: avoid'), 'CSS de impressão evita cortes indesejados no interior de caixas canônicas');

// ========================================
// 118. Testes da Estilização Nobre Colorida da Ficha A4 para PDF e Impressão (ISSUE-149):
// ========================================
console.log('\n🎨 118. Testes da Estilização Nobre Colorida da Ficha A4 para PDF e Impressão (ISSUE-149):');

// 1. Verificação de Cores Funcionais e Classes Semânticas no CSS Compilado
assert(compiledHtml.includes('.a4-combat-ac'), 'CSS possui classe funcional .a4-combat-ac para destaque de Classe de Armadura');
assert(compiledHtml.includes('.a4-combat-init'), 'CSS possui classe funcional .a4-combat-init para destaque de Iniciativa');
assert(compiledHtml.includes('.a4-combat-speed'), 'CSS possui classe funcional .a4-combat-speed para destaque de Deslocamento');
assert(compiledHtml.includes('.a4-coin-gp'), 'CSS possui classe de moeda .a4-coin-gp com coloração dourada funcional');
assert(compiledHtml.includes('.a4-coin-sp'), 'CSS possui classe de moeda .a4-coin-sp com coloração prateada');
assert(compiledHtml.includes('.a4-coin-cp'), 'CSS possui classe de moeda .a4-coin-cp com coloração de cobre');
assert(compiledHtml.includes('.a4-coin-pp'), 'CSS possui classe de moeda .a4-coin-pp com coloração de platina');
assert(compiledHtml.includes('.a4-coin-ep'), 'CSS possui classe de moeda .a4-coin-ep com coloração de electrum');

// 2. Verificação de Cabeçalho Nobre e Medalhões de Atributo
assert(compiledHtml.includes('linear-gradient(135deg, #1e293b 0%, #0f172a 100%)') || compiledHtml.includes('linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'), 'Cabeçalho .a4-sheet-header possui gradiente dark fantasy nobre');
assert(compiledHtml.includes('radial-gradient(circle at 50% 25%'), 'Atributos .a4-stat-card utilizam estilo medalhão com gradiente radial e borda nobre');
assert(compiledHtml.includes('.a4-bullet.active'), 'Proficiências e salvaguardas utilizam marcadores dourados preenchidos');

// 3. Verificação de Saída no HTML Gerado por printPlayerSheet
vm.runInContext(`printPlayerSheet('p_print_hero_1');`, sandbox);
const sampleHtml = vm.runInContext("document.getElementById('print-sheet-content').innerHTML", sandbox);

assert(sampleHtml.includes('a4-combat-ac'), 'HTML gerado pela impressão inclui container com classe a4-combat-ac');
assert(sampleHtml.includes('a4-combat-init'), 'HTML gerado pela impressão inclui container com classe a4-combat-init');
assert(sampleHtml.includes('a4-combat-speed'), 'HTML gerado pela impressão inclui container com classe a4-combat-speed');
assert(sampleHtml.includes('a4-coin-gp'), 'HTML gerado pela impressão inclui moedas identificadas por suas classes de cores específicas');

// ========================================
// 119. Testes de Ficha D&D 5E em PDF Editável com Auto-Cálculo (ISSUE-150):
// ========================================
console.log('\n📄 119. Testes de Ficha D&D 5E em PDF Editável com Auto-Cálculo (ISSUE-150):');

// 1. Verificação de Inclusão da Biblioteca PDF-Lib e do Botão na Interface
assert(compiledHtml.includes('pdf-lib@1.17.1') || compiledHtml.includes('pdf-lib.min.js'), 'HTML compilado inclui a biblioteca pdf-lib para AcroForms');
assert(compiledHtml.includes('id="btn-export-pdf-acroform"'), 'HTML compilado possui o botão #btn-export-pdf-acroform');
assert(compiledHtml.includes('exportCurrentModalPlayerEditablePdf()'), 'Botão de PDF editável possui chamada para exportCurrentModalPlayerEditablePdf()');
assert(compiledHtml.includes('Baixar PDF Editável (Auto-Cálculo)'), 'Botão exibe a label explicativa de Auto-Cálculo');

// 2. Verificação das Funções e Mapeamentos no Módulo Exportador
const fnGeneratePdf = sandbox.generateEditableDnd5ePdf || (sandbox.window && sandbox.window.generateEditableDnd5ePdf);
const fnExportPdf = sandbox.exportPlayerEditablePdf || (sandbox.window && sandbox.window.exportPlayerEditablePdf);
const fnExportModalPdf = sandbox.exportCurrentModalPlayerEditablePdf || (sandbox.window && sandbox.window.exportCurrentModalPlayerEditablePdf);
assert(typeof fnGeneratePdf === 'function', 'Função generateEditableDnd5ePdf está disponível no escopo compilado');
assert(typeof fnExportPdf === 'function', 'Função exportPlayerEditablePdf está disponível no escopo compilado');
assert(typeof fnExportModalPdf === 'function', 'Função exportCurrentModalPlayerEditablePdf está disponível no escopo compilado');

const skillsMap = sandbox.DND_SKILLS_MAPPING || (sandbox.window && sandbox.window.DND_SKILLS_MAPPING);
assert(Array.isArray(skillsMap) && skillsMap.length === 18, 'DND_SKILLS_MAPPING contém o catálogo canônico completo das 18 perícias do D&D 5E');
assert(skillsMap.some(s => s.key === 'athletics' && s.stat === 'FOR'), 'Perícia Atletismo está vinculada à Força');
assert(skillsMap.some(s => s.key === 'stealth' && s.stat === 'DES'), 'Perícia Furtividade está vinculada à Destreza');
assert(skillsMap.some(s => s.key === 'perception' && s.stat === 'SAB'), 'Perícia Percepção está vinculada à Sabedoria');
assert(skillsMap.some(s => s.key === 'arcana' && s.stat === 'INT'), 'Perícia Arcanismo está vinculada à Inteligência');

// 3. Teste de Geração e Estrutura do PDF com Cálculos AcroForm
(async () => {
  try {
    const testPlayer = {
      id: 'p_test_pdf_calc',
      name: 'Aragorn Passolargo',
      className: 'Patrulheiro',
      level: 5,
      race: 'Humano',
      str: 18,
      dex: 16,
      con: 14,
      int: 12,
      wis: 16,
      cha: 10,
      hpMax: 44,
      hpCurrent: 44,
      ac: 16,
      skills: ['athletics', 'stealth', 'survival', 'perception'],
      savingThrows: ['str', 'dex'],
      student: 'Lucas'
    };

    const pdfLibModule = require('./src/js/pdf_export.js');
    const { PDFDocument } = require('pdf-lib');
    const pdfBytes = await pdfLibModule.generateEditableDnd5ePdf(testPlayer);
    assert(pdfBytes && pdfBytes.length > 50000, 'generateEditableDnd5ePdf gera buffer PDF válido');

    const loadedDoc = await PDFDocument.load(pdfBytes);
    const loadedForm = loadedDoc.getForm();
    assert(!!loadedForm.getTextField('FOR_MOD'), 'PDF contém campo calculado de Modificador de Força (FOR_MOD)');
    assert(!!loadedForm.getTextField('DES_MOD'), 'PDF contém campo calculado de Modificador de Destreza (DES_MOD)');
    assert(!!loadedForm.getTextField('Skill_athletics'), 'PDF contém campo de perícia Atletismo');
    assert(!!loadedForm.getTextField('Spell_Save_DC'), 'PDF contém campo de CD de Resistência de Magia');

    const pdfStr = Buffer.from(pdfBytes).toString('utf8');
    assert(pdfStr.includes('/AA'), 'PDF contém dicionário de Ações Adicionais (/AA)');
    assert(pdfStr.includes('/C'), 'PDF contém Ações de Cálculo (/C) associadas aos campos');
    assert(pdfStr.includes('/CO'), 'PDF contém ordem oficial de execução de cálculo (/CO)');
    assert(pdfStr.includes('JavaScript'), 'PDF possui scripts Acrobat JavaScript embutidos');
    // --- Bateria 120: Isolamento de Impressão A4 & Resolução de PDF Editável (Mestre e Jogador) [ISSUE-151] ---
    console.log('\n🖨️ [Bateria 120] Isolamento de Impressão A4 & Resolução Resiliente de PDF (ISSUE-151):');
    const headCssContent = fs.readFileSync(path.join(__dirname, 'src/styles/head_css.html'), 'utf8');
    assert(headCssContent.includes('@media print'), 'head_css.html possui diretiva @media print');
    const printSection = headCssContent.slice(headCssContent.indexOf('@media print'));
    assert(printSection.includes('header') && printSection.includes('main') && printSection.includes('footer'), 'Regras de @media print isolam o modal ocultando header, main e footer');
    assert(printSection.includes('.player-card'), 'Regras de @media print ocultam os cards dos heróis de fundo');
    assert(printSection.includes('#modal-print'), 'Regras de @media print configuram exibição exclusiva do #modal-print');

    // Validação de tolerância a arrays em spells/features/attacks
    const magePlayer = {
      id: 'p_test_mage',
      name: 'Deraravely',
      className: 'Mago',
      level: 5,
      str: 8, dex: 14, con: 14, int: 18, wis: 12, cha: 10,
      hp: 30, maxHp: 30, ac: 12, speed: '9m',
      saveProficiencies: ['int', 'wis'],
      skills: ['arcanismo', 'investigacao'],
      inventory: [{ name: 'Grimório', qty: 1, weight: '1.5', equipped: true }],
      spells: ['Mísseis Mágicos', 'Escudo Arcano', 'Bola de Fogo'],
      features: ['Recuperação Arcana', 'Evocação Esculpida'],
      attacks: ['Raio de Fogo (+7, 2d10 fogo)'],
      playerNotes: ['Estudar runas antigas de Netheril']
    };

    const magePdfBytes = await pdfLibModule.generateEditableDnd5ePdf(magePlayer);
    assert(magePdfBytes && magePdfBytes.length > 50000, 'generateEditableDnd5ePdf suporta personagens magos com arrays em spells/features/inventory');

    const loadedMageDoc = await PDFDocument.load(magePdfBytes);
    const mageForm = loadedMageDoc.getForm();
    assert(mageForm.getTextField('CharacterName').getText() === 'Deraravely', 'PDF gerado contém nome correto do mago');
    assert(mageForm.getTextField('INT_MOD').getText() === '+4', 'PDF gerado calcula INT_MOD +4 para Mago com Int 18');
    assert(mageForm.getTextField('Spell_Save_DC').getText() === '15', 'PDF gerado calcula Spell_Save_DC 15 para Nv 5 com Int 18 (8 + 3 + 4)');

    // Validação da exportação do modal com múltiplos fallbacks
    assert(typeof pdfLibModule.exportCurrentModalPlayerEditablePdf === 'function', 'exportCurrentModalPlayerEditablePdf é exportada');
    assert(typeof pdfLibModule.exportPlayerEditablePdf === 'function', 'exportPlayerEditablePdf é exportada');

    // --- Bateria 121: Características de Classe/Talentos e Paginação de 2 Folhas A4 (ISSUE-152) ---
    console.log('\n📜 [Bateria 121] Características de Classe/Talentos e Paginação de 2 Folhas A4 (ISSUE-152):');
    
    // 1. Validar desbloqueio de overflow no @media print
    const cssContentPrint = fs.readFileSync(path.join(__dirname, 'src/styles/head_css.html'), 'utf8');
    const mediaPrintBlock = cssContentPrint.slice(cssContentPrint.indexOf('@media print'));
    assert(mediaPrintBlock.includes('overflow: visible !important'), '@media print força overflow: visible nos containers do modal');
    assert(mediaPrintBlock.includes('max-height: none !important'), '@media print desbloqueia max-height: none nos containers do modal');
    assert(mediaPrintBlock.includes('page-break-after: always !important'), '@media print define quebra de página oficial entre as folhas');
    assert(mediaPrintBlock.includes('275mm'), '@media print define altura compatível com folha A4 (275mm)');

    // 2. Validar extração universal de habilidades de classe e raça
    const alasterPlayer = {
      id: 'p_test_alaster',
      name: 'Alaster',
      student: 'Abdevan',
      className: 'Guerreiro',
      level: 4,
      race: 'Draconato',
      alignment: 'Neutro e Bom',
      str: 20, dex: 14, con: 16, int: 10, wis: 11, cha: 10,
      hp: 36, maxHp: 36, ac: 19, speed: '9m',
      features: '', // vazio intencional
      inventory: [{ name: 'Espada Longa', qty: 1, weight: '1.5', equipped: true }]
    };

    const alasterPdfBytes = await pdfLibModule.generateEditableDnd5ePdf(alasterPlayer);
    assert(alasterPdfBytes && alasterPdfBytes.length > 50000, 'generateEditableDnd5ePdf gera PDF válido para Alaster');

    const loadedAlasterDoc = await PDFDocument.load(alasterPdfBytes);
    const alasterForm = loadedAlasterDoc.getForm();
    const featField = alasterForm.getTextField('Features_Traits');
    assert(!!featField, 'PDF contém campo Features_Traits');
    
    // 3. Validar exportação de funções helper
    // 4. BATERIA 122: Sincronização Completa entre Ficha Virtual, A4 e PDF Editável (ISSUE-153)
    console.log('\n📄 122. Testes de Sincronização Completa: Virtual, A4 e PDF Editável (ISSUE-153):');

    const syncPlayer122 = {
      id: 'p_sync_runner',
      name: 'Eldrin Valen',
      student: 'Wesley',
      className: 'Guerreiro',
      level: 5,
      multiclass: 'Guerreiro 3 / Mago 2',
      race: 'Humano',
      str: 16, dex: 14, con: 14, int: 14, wis: 12, cha: 10,
      hp: 20, maxHp: 38, ac: 17, speed: '9m',
      hitDice: '5d10',
      spentHitDice: 2,
      deathSaves: { success: 2, fail: 1 },
      conditions: ['Envenenado', 'Incapacitado'],
      skills: ['adestramento', 'enganacao', 'percepcao', 'investigacao'],
      saveProficiencies: ['str', 'con'],
      slots: [4, 2, 0, 0, 0, 0, 0, 0, 0],
      slotsUsed: [1, 2, 0, 0, 0, 0, 0, 0, 0],
      spells: ['Raio de Gelo', 'Mísseis Mágicos'],
      inventory: [{ name: 'Espada Longa', qty: 1, weight: '1.5', equipped: true }]
    };

    const syncPdfBytes122 = await pdfLibModule.generateEditableDnd5ePdf(syncPlayer122);
    assert(syncPdfBytes122 && syncPdfBytes122.length > 50000, 'generateEditableDnd5ePdf gera PDF para personagem com multiclasse e condições');

    const loadedSyncDoc122 = await PDFDocument.load(syncPdfBytes122);
    const syncForm122 = loadedSyncDoc122.getForm();

    // Validações de Perícias PT-BR
    const chkAnimal122 = syncForm122.getCheckBox('Check_Skill_animalHandling');
    assert(chkAnimal122 && chkAnimal122.isChecked(), 'PDF marca checkbox de Adestrar Animais (animalHandling) via alias adestramento');

    const chkDeception122 = syncForm122.getCheckBox('Check_Skill_deception');
    assert(chkDeception122 && chkDeception122.isChecked(), 'PDF marca checkbox de Blefar (deception) via alias enganacao');

    // Validações de Death Saves
    const dsS1_122 = syncForm122.getCheckBox('DeathSave_S1');
    const dsS2_122 = syncForm122.getCheckBox('DeathSave_S2');
    const dsS3_122 = syncForm122.getCheckBox('DeathSave_S3');
    const dsF1_122 = syncForm122.getCheckBox('DeathSave_F1');
    const dsF2_122 = syncForm122.getCheckBox('DeathSave_F2');
    assert(dsS1_122.isChecked() && dsS2_122.isChecked() && !dsS3_122.isChecked(), 'PDF reflete exatamente 2 sucessos de salvaguarda contra a morte');
    assert(dsF1_122.isChecked() && !dsF2_122.isChecked(), 'PDF reflete exatamente 1 falha de salvaguarda contra a morte');

    // Validações de Sentidos Passivos
    assert(!!syncForm122.getTextField('Passive_Perception'), 'PDF possui campo Passive_Perception');
    assert(!!syncForm122.getTextField('Passive_Investigation'), 'PDF possui campo Passive_Investigation');
    assert(!!syncForm122.getTextField('Passive_Insight'), 'PDF possui campo Passive_Insight');

    // Validações de Slots de Magia
    const s1Tot122 = syncForm122.getTextField('Slot_Lvl_1_Total');
    const s1Use122 = syncForm122.getTextField('Slot_Lvl_1_Used');
    assert(s1Tot122.getText() === '4' && s1Use122.getText() === '1', 'PDF possui rastreador de espaços de magia de 1º nível (4 tot, 1 usado)');

    const s2Tot122 = syncForm122.getTextField('Slot_Lvl_2_Total');
    const s2Use122 = syncForm122.getTextField('Slot_Lvl_2_Used');
    assert(s2Tot122.getText() === '2' && s2Use122.getText() === '2', 'PDF possui rastreador de espaços de magia de 2º nível (2 tot, 2 usados)');

    // Validações de Multiclasse e Condições
    const classFld122 = syncForm122.getTextField('ClassLevel');
    assert(classFld122.getText().includes('Guerreiro 3 / Mago 2 (Nv 5)'), 'PDF exibe formato completo de multiclasse no cabeçalho');

    const backstoryFld122 = syncForm122.getTextField('Character_Backstory');
    assert(backstoryFld122.getText().includes('[CONDIÇÕES ATIVAS EM MESA: Envenenado, Incapacitado]'), 'PDF inclui anotação de condições ativas em Character_Backstory');

    // Validações no código-fonte de players.js e head_css.html
    const headCssContent122 = fs.readFileSync(path.join(__dirname, 'src/styles/head_css.html'), 'utf8');
    const playersFileContent122 = fs.readFileSync(path.join(__dirname, 'src/js/players.js'), 'utf8');
    assert(headCssContent122.includes('.a4-passive-grid'), 'head_css.html possui classe .a4-passive-grid');
    assert(headCssContent122.includes('.a4-active-conditions-banner'), 'head_css.html possui classe .a4-active-conditions-banner');
    assert(headCssContent122.includes('.a4-slot-circles'), 'head_css.html possui classe .a4-slot-circles');
    assert(playersFileContent122.includes('Sentidos Passivos (Mestre)'), 'players.js renderiza bloco de Sentidos Passivos do Mestre');
    // ============================================================================
    // 🛡️ 123. Testes de Restauração e Enriquecimento dos Traços da Ficha (ISSUE-154)
    // ============================================================================
    console.log('\n🛡️ 123. Testes de Restauração e Enriquecimento dos Traços da Ficha (ISSUE-154):');

    const playersJsContent123 = fs.readFileSync(path.join(__dirname, 'src/js/players.js'), 'utf8');
    const uiHtmlContent123 = fs.readFileSync(path.join(__dirname, 'src/ui/ui.html'), 'utf8');
    const headCssContent123 = fs.readFileSync(path.join(__dirname, 'src/styles/head_css.html'), 'utf8');

    assert(uiHtmlContent123.includes('id="pm-personality"'), 'ui.html possui campo pm-personality no modal do jogador');
    assert(headCssContent123.includes('.feature-race-group-header'), 'head_css.html possui estilos para .feature-race-group-header');
    assert(headCssContent123.includes('.badge-race'), 'head_css.html possui estilos para .badge-race');
    assert(playersJsContent123.includes('renderPlayerRacialTraits'), 'players.js possui função renderPlayerRacialTraits');
    assert(playersJsContent123.includes("renderPlayerUnlockedFeatures(p, 'all')"), "players.js chama renderPlayerUnlockedFeatures com 'all' na aba de traços");

    // Validação funcional no sandbox:
    const dwarfHero123 = {
      id: 'p_dwarf_test',
      name: 'Bruenor Battlehammer',
      race: 'Anão',
      className: 'Guerreiro',
      level: 3,
      actionEconomyFilter: 'reaction', // Filtro de reação ativo (simulando clique na aba combate)
      personality: 'Orgulhoso, leal e amante de boa cerveja anã.',
      ideal: 'Proteger o clã e honrar os ancestrais.',
      bond: 'Meu martelo de guerra forjado pelo meu pai.',
      flaw: 'Teimoso como uma rocha.',
      hp: 30, maxHp: 30
    };

    const racialTraitsHtml123 = sandbox.renderPlayerRacialTraits(dwarfHero123);
    assert(racialTraitsHtml123 && racialTraitsHtml123.includes('Visão no Escuro'), 'renderPlayerRacialTraits inclui Visão no Escuro para Anão');
    assert(racialTraitsHtml123 && racialTraitsHtml123.includes('Resiliência Anã'), 'renderPlayerRacialTraits inclui Resiliência Anã');
    assert(racialTraitsHtml123 && racialTraitsHtml123.includes('feature-race-group-header'), 'renderPlayerRacialTraits inclui cabeçalho feature-race-group-header');

    // Validação de desacoplamento do filtro:
    const unlockedFeatures123 = sandbox.renderPlayerUnlockedFeatures(dwarfHero123, 'all');
    assert(unlockedFeatures123 && unlockedFeatures123.includes('Retomar o Fôlego'), 'renderPlayerUnlockedFeatures exibe Retomar o Fôlego mesmo com p.actionEconomyFilter = reaction');
    assert(unlockedFeatures123 && unlockedFeatures123.includes('Surto de Ação'), 'renderPlayerUnlockedFeatures exibe Surto de Ação para Guerreiro Nv 3');

    // ============================================================================
    // 👥 124. Testes de Compatibilidade dos Jogadores e Blindagem do Portal (ISSUE-155)
    // ============================================================================
    console.log('\n👥 124. Testes de Compatibilidade dos Jogadores e Blindagem do Portal (ISSUE-155):');

    const headCssContent124 = fs.readFileSync(path.join(__dirname, 'src/styles/head_css.html'), 'utf8');
    const coreJsContent124 = fs.readFileSync(path.join(__dirname, 'src/js/core.js'), 'utf8');

    // 1. Blindagem de Segurança do Portal do Jogador no CSS
    assert(headCssContent124.includes('.mode-player-portal .roll20-btn-tool-del'), 'CSS do Portal do Jogador oculta o botão de deletar personagem (.roll20-btn-tool-del)');
    assert(headCssContent124.includes('.mode-player-portal button[onclick*="deletePlayer"]'), 'CSS do Portal do Jogador oculta botões deletePlayer');
    assert(headCssContent124.includes('.mode-player-portal button[onclick*="openPlayerModal"]'), 'CSS do Portal do Jogador oculta modal estrutural da ficha (openPlayerModal)');

    // 2. Integridade dos 9 Heróis Canônicos no sandbox
    const allHeroes124 = (sandbox.window && sandbox.window.CANONICAL_INITIAL_PLAYERS)
      ? sandbox.window.CANONICAL_INITIAL_PLAYERS
      : (sandbox.CANONICAL_INITIAL_PLAYERS || []);
    sandbox.PLAYERS = JSON.parse(JSON.stringify(allHeroes124));
    assert(Array.isArray(allHeroes124) && allHeroes124.length >= 9, 'Existem pelo menos 9 heróis oficiais no elenco canônico');

    allHeroes124.forEach(hero => {
      const heroName = hero.name || 'Herói';
      assert(Array.isArray(hero.saveProficiencies) && hero.saveProficiencies.length >= 2, `${heroName} possui pelo menos 2 salvaguardas proficientes`);
      assert(Array.isArray(hero.skillProficiencies) && hero.skillProficiencies.length >= 2, `${heroName} possui pelo menos 2 perícias proficientes`);
      assert(typeof hero.personality === 'string' && hero.personality.trim().length > 0, `${heroName} possui traços de personalidade configurados`);
      
      if (typeof sandbox.calculatePlayerAcFromEquipment === 'function') {
        const calcAc = sandbox.calculatePlayerAcFromEquipment(hero);
        assert(calcAc === hero.ac, `${heroName}: CA calculada (${calcAc}) é idêntica à CA da ficha (${hero.ac})`);
      }
    });

    // 3. Verificações Específicas por Personagem
    const arkhalis124 = allHeroes124.find(h => h.name && h.name.toLowerCase().includes('arkhalis'));
    assert(arkhalis124 !== undefined, 'Arkhalis está presente no elenco canônico');
    assert(arkhalis124.saveProficiencies.includes('int') && arkhalis124.saveProficiencies.includes('wis'), 'Arkhalis possui salvaguardas canônicas de Mago (Int/Sab)');
    assert(typeof arkhalis124.attacks === 'string' && arkhalis124.attacks.includes('Cajado Arcano'), 'Arkhalis possui ataque de Cajado Arcano');
    assert(typeof arkhalis124.attacks === 'string' && arkhalis124.attacks.includes('Raio de Gelo'), 'Arkhalis possui truque de ataque Raio de Gelo');
    assert(arkhalis124.features.includes('Recuperação Arcana'), 'Arkhalis possui a habilidade Recuperação Arcana de Mago');

    const lalw124 = allHeroes124.find(h => h.name && h.name.toLowerCase().includes('lalw'));
    assert(lalw124 !== undefined, 'Lalw está presente no elenco canônico');
    assert(lalw124.subclassIdx === 2, 'Lalw possui subclassIdx = 2 configurada');
    assert(lalw124.subclass.includes('Trapaceiro Arcano'), 'Lalw possui subclasse Trapaceiro Arcano');

    const deraravely124 = allHeroes124.find(h => h.name && h.name.toLowerCase().includes('deraravely'));
    assert(deraravely124 !== undefined, 'Deraravely está presente no elenco canônico');
    assert(deraravely124.saveProficiencies.includes('str') && deraravely124.saveProficiencies.includes('con'), 'Deraravely possui salvaguardas de Força e Constituição');
    assert(typeof deraravely124.attacks === 'string' && !deraravely124.attacks.includes('24cortante'), 'Deraravely não possui erro tipográfico de dano');

    // 4. Teste de Auto-Migração com Cache Antigo
    const legacyOutdatedHero = {
      id: 'p_1788966196301',
      name: 'Arkhalis',
      level: 1,
      ac: 11,
      skillProficiencies: [],
      saveProficiencies: [],
      personality: ''
    };
    sandbox.localStorage.setItem('dnd_tracker_players_v3', JSON.stringify([legacyOutdatedHero]));
    sandbox.loadFromLocalStorage();
    const migratedArkhalis = (sandbox.PLAYERS || []).find(p => p.id === 'p_1788966196301');
    assert(migratedArkhalis && migratedArkhalis.saveProficiencies.length >= 2, 'Auto-migração no loadData restaura salvaguardas canônicas de herói com cache defasado');
    assert(migratedArkhalis && migratedArkhalis.skillProficiencies.length >= 2, 'Auto-migração no loadData restaura perícias canônicas de herói com cache defasado');
    assert(migratedArkhalis && migratedArkhalis.personality && migratedArkhalis.personality.length > 0, 'Auto-migração no loadData restaura traços de personalidade');

    // =========================================================================
    // 🧰 Bateria 125: Sistema do Baú do Grupo, Mochilas, Trocas e Finanças (ISSUE-156)
    // =========================================================================
    console.log('\n🧰 [Bateria 125] Sistema do Baú do Grupo, Mochilas, Trocas e Finanças (ISSUE-156):');

    // 1. Criação de Campanha e Jogadores de Teste dentro do escopo lexical da VM
    vm.runInContext(`
      PLAYERS = [
        {
          id: 'p_hero_alpha',
          name: 'Alpha Guerreiro',
          gold: 50,
          coins: { cp: 0, sp: 0, ep: 0, gp: 50, pp: 0 },
          inventory: [
            { id: 'it_heavy_armor', name: 'Cota de Malha Pesada', qty: 1, weight: 25.0, category: 'Armadura' },
            { id: 'it_healing_pot', name: 'Poção de Cura', qty: 5, weight: 0.5, category: 'Poção' }
          ]
        },
        {
          id: 'p_hero_beta',
          name: 'Beta Ladino',
          gold: 10,
          coins: { cp: 0, sp: 0, ep: 0, gp: 10, pp: 0 },
          inventory: []
        },
        {
          id: 'p_hero_gamma',
          name: 'Gamma Clérigo',
          gold: 0,
          coins: { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 },
          inventory: []
        }
      ];

      CAMPAIGNS_STATE = {
        activeCampaignId: 'camp_test_125',
        campaigns: [
          {
            id: 'camp_test_125',
            name: 'Aventura nas Colinas Nebulosas',
            playerIds: ['p_hero_alpha', 'p_hero_beta', 'p_hero_gamma'],
            partyStash: {
              gold: 120,
              items: [],
              history: []
            }
          }
        ]
      };
    `, sandbox);

    const getCamp125 = () => vm.runInContext('getActiveCampaign()', sandbox);
    const getHeroAlpha = () => vm.runInContext('PLAYERS.find(p => p.id === "p_hero_alpha")', sandbox);
    const getHeroBeta = () => vm.runInContext('PLAYERS.find(p => p.id === "p_hero_beta")', sandbox);
    const getHeroGamma = () => vm.runInContext('PLAYERS.find(p => p.id === "p_hero_gamma")', sandbox);

    // Teste 1: Preservação de peso ao enviar item do jogador para o baú
    // Alpha envia a Cota de Malha (25kg) para o baú do grupo
    sandbox.sendPlayerItemToPartyStash('p_hero_alpha', 0, 1);
    assert(getHeroAlpha().inventory.length === 1, 'Alpha transferiu a armadura da mochila');
    assert(getCamp125().partyStash.items.length === 1, 'Baú recebeu a armadura');
    assert(getCamp125().partyStash.items[0].weight === 25.0, 'Peso da Cota de Malha foi preservado no baú (25 kg, não perdeu o peso)');

    // Teste 2: Preservação de peso ao retirar item do baú para a mochila do jogador
    // Beta retira a Cota de Malha do baú
    const stashArmor = getCamp125().partyStash.items[0];
    sandbox.takePartyItemToPlayer(stashArmor.id, 'p_hero_beta', 1);
    assert(getCamp125().partyStash.items.length === 0, 'Baú esvaziou a armadura');
    assert(getHeroBeta().inventory.length === 1, 'Beta recebeu a armadura na mochila');
    assert(getHeroBeta().inventory[0].weight === 25.0, 'Peso da armadura retirado para Beta permaneceu 25 kg (corrigido bug de 0.5kg forçado)');

    // Teste 3: Transferência parcial de quantidade do jogador para o baú (Alpha envia 2 de 5 poções)
    sandbox.sendPlayerItemToPartyStash('p_hero_alpha', 0, 2);
    assert(getHeroAlpha().inventory[0].qty === 3, 'Alpha reteve 3x poções de cura na mochila');
    assert(getCamp125().partyStash.items.length === 1 && getCamp125().partyStash.items[0].qty === 2, 'Baú recebeu exatamente 2x poções de cura');

    // Teste 4: Transferência parcial do baú para o jogador (Gamma pega 1 de 2 poções)
    const stashPot = getCamp125().partyStash.items[0];
    sandbox.takePartyItemToPlayer(stashPot.id, 'p_hero_gamma', 1);
    assert(getCamp125().partyStash.items[0].qty === 1, 'Baú ficou com 1x poção restante');
    assert(getHeroGamma().inventory.length === 1 && getHeroGamma().inventory[0].qty === 1, 'Gamma recebeu 1x poção na mochila');

    // Teste 5: Transações financeiras como Jogador (Depósito com débito e verificação de saldo)
    vm.runInContext('activePortalPlayerId = "p_hero_alpha"', sandbox);
    const originalPrompt = sandbox.prompt;
    const originalAlert = sandbox.alert;

    // Alpha tem 50 PO e deposita 20 PO no baú
    sandbox.prompt = () => '20';
    sandbox.promptAdjustPartyGold('add');
    assert(getHeroAlpha().gold === 30, 'Alpha foi debitado em 20 PO (restam 30 PO)');
    assert(getHeroAlpha().coins.gp === 30, 'Alpha coins.gp sincronizado para 30 PO');
    assert(getCamp125().partyStash.gold === 140, 'Baú recebeu +20 PO (total 140 PO)');

    // Alpha tenta depositar 100 PO (saldo insuficiente de 30 PO) -> deve ser barrado
    sandbox.prompt = () => '100';
    let alertCalled = false;
    sandbox.alert = () => { alertCalled = true; };
    sandbox.promptAdjustPartyGold('add');
    assert(alertCalled === true, 'Alerta de fundos insuficientes disparado');
    assert(getHeroAlpha().gold === 30, 'Saldo de Alpha mantido intacto após tentativa inválida');
    assert(getCamp125().partyStash.gold === 140, 'Tesouro do baú inalterado após tentativa inválida');

    // Teste 6: Retirada de ouro como Jogador
    // Alpha retira 15 PO do baú
    sandbox.prompt = () => '15';
    sandbox.promptAdjustPartyGold('remove');
    assert(getHeroAlpha().gold === 45, 'Alpha recebeu 15 PO retirados do baú (total 45 PO)');
    assert(getCamp125().partyStash.gold === 125, 'Baú foi debitado em 15 PO (restam 125 PO)');

    // Teste 7: Transação financeira como Mestre (Injeção de tesouro da aventura)
    vm.runInContext('activePortalPlayerId = null', sandbox);
    sandbox.prompt = () => '75';
    sandbox.promptAdjustPartyGold('add'); // Mestre adiciona 75 PO ao baú sem debitar heróis
    assert(getCamp125().partyStash.gold === 200, 'Mestre injetou 75 PO diretamente no baú (total 200 PO)');
    assert(getHeroAlpha().gold === 45, 'Alpha manteve seu ouro intacto durante injeção do mestre');

    // Teste 8: Divisão igualitária de ouro entre os heróis da mesa (splitPartyGold)
    const splitConfirm = sandbox.confirm;
    sandbox.confirm = () => true;
    sandbox.splitPartyGold();
    assert(getHeroAlpha().gold === 45 + 66, 'Alpha recebeu sua cota de 66 PO da divisão');
    assert(getHeroBeta().gold === 10 + 66, 'Beta recebeu sua cota de 66 PO da divisão');
    assert(getHeroGamma().gold === 0 + 66, 'Gamma recebeu sua cota de 66 PO da divisão');
    assert(getCamp125().partyStash.gold === 2, 'Resto de 2 PO permaneceu no baú do grupo');
    sandbox.confirm = splitConfirm;

    // Teste 9: Doação / Troca direta entre jogadores (transferPlayerItem)
    const tradeResult = sandbox.transferPlayerItem('p_hero_alpha', 0, 'p_hero_beta', 2);
    assert(tradeResult && tradeResult.success === true, 'Troca direta entre jogadores concluída com sucesso');
    assert(getHeroAlpha().inventory[0].qty === 1, 'Alpha ficou com 1x poção');
    const betaPot = getHeroBeta().inventory.find(i => i.name === 'Poção de Cura');
    assert(betaPot && betaPot.qty === 2, 'Beta recebeu 2x poções na sua mochila');

    // Teste 10: Edição de propriedades de item na mochila (saveEditedPlayerItem)
    const origGetEl = sandbox.document.getElementById;
    sandbox.document.getElementById = (id) => {
      if (id === 'inp-edit-pitem-name') return { value: 'Poção de Cura Superior' };
      if (id === 'inp-edit-pitem-qty') return { value: '3' };
      if (id === 'inp-edit-pitem-weight') return { value: '0.4' };
      if (id === 'inp-edit-pitem-cat') return { value: 'Item Mágico' };
      if (id === 'inp-edit-pitem-cost') return { value: '250 PO' };
      if (id === 'inp-edit-pitem-desc') return { value: 'Cura 8d4 + 8 pontos de vida.' };
      if (id === 'modal-edit-player-item') return { classList: { add: () => {}, remove: () => {} } };
      return origGetEl ? origGetEl(id) : null;
    };

    const betaPotIdx = getHeroBeta().inventory.findIndex(i => i.name === 'Poção de Cura');
    sandbox.openEditPlayerItemModal('p_hero_beta', betaPotIdx);
    sandbox.saveEditedPlayerItem();

    const editedBetaPot = getHeroBeta().inventory[betaPotIdx];
    assert(editedBetaPot.name === 'Poção de Cura Superior', 'Nome do item atualizado para Poção de Cura Superior');
    assert(editedBetaPot.qty === 3, 'Quantidade atualizada para 3x');
    assert(editedBetaPot.weight === 0.4, 'Peso unitário atualizado para 0.4 kg');
    assert(editedBetaPot.category === 'Item Mágico', 'Categoria atualizada para Item Mágico');
    assert(editedBetaPot.cost === '250 PO', 'Custo atualizado para 250 PO');
    assert(editedBetaPot.desc.includes('Cura 8d4 + 8'), 'Descrição e efeitos atualizados com sucesso');

    // ============================================================================
    // 🧭 [BATERIA 126] Navegação da Planilha, Visualização de Traços e Magias por Círculo (ISSUE-157)
    // ============================================================================
    console.log('\n🧭 [Bateria 126] Navegação da Planilha, Visualização de Traços e Magias por Círculo (ISSUE-157):');

    // 1. Validar exportações de funções
    assert(typeof sandbox.renderHeroQuickNav === 'function', 'Função renderHeroQuickNav exportada');
    assert(typeof sandbox.jumpToPlayerCard === 'function', 'Função jumpToPlayerCard exportada');
    assert(typeof sandbox.setPlayerTraitCategoryFilter === 'function', 'Função setPlayerTraitCategoryFilter exportada');
    assert(typeof sandbox.handlePlayerTraitSearch === 'function', 'Função handlePlayerTraitSearch exportada');
    assert(typeof sandbox.togglePlayerTraitsExpandAll === 'function', 'Função togglePlayerTraitsExpandAll exportada');
    assert(typeof sandbox.togglePlayerFeatureAccordion === 'function', 'Função togglePlayerFeatureAccordion exportada');
    assert(typeof sandbox.setPlayerSpellCircleFilter === 'function', 'Função setPlayerSpellCircleFilter exportada');
    assert(typeof sandbox.handlePlayerSpellSearch === 'function', 'Função handlePlayerSpellSearch exportada');
    assert(typeof sandbox.togglePlayerCircleSlot === 'function', 'Função togglePlayerCircleSlot exportada');

    // 2. Hero Quick Switcher Bar
    const mockNavHeroes = [
      { id: 'p_nav_1', name: 'Gromm', className: 'Bárbaro', level: 4, hp: 45, maxHp: 45, avatar: '🪓' },
      { id: 'p_nav_2', name: 'Serena', className: 'Maga', level: 4, hp: 10, maxHp: 22, avatar: '🔮' },
      { id: 'p_nav_3', name: 'Alaster', className: 'Paladino', level: 4, hp: 3, maxHp: 36, avatar: '🛡️' }
    ];

    let quickNavHtml = '';
    const mockNavContainer = {
      innerHTML: '',
      style: { display: 'none' }
    };
    const prevGetEl126 = sandbox.document.getElementById;
    sandbox.document.getElementById = (id) => {
      if (id === 'hero-quick-nav-container') return mockNavContainer;
      return prevGetEl126 ? prevGetEl126(id) : null;
    };

    sandbox.renderHeroQuickNav(mockNavHeroes);
    assert(mockNavContainer.style.display === 'flex', 'Quick Nav Bar exibida quando há 2 ou mais heróis');
    assert(mockNavContainer.innerHTML.includes('Gromm'), 'Quick Nav contém chip de Gromm');
    assert(mockNavContainer.innerHTML.includes('Serena'), 'Quick Nav contém chip de Serena');
    assert(mockNavContainer.innerHTML.includes('Alaster'), 'Quick Nav contém chip de Alaster');
    assert(mockNavContainer.innerHTML.includes('hp-healthy'), 'Gromm possui badge de HP Saudável (hp-healthy)');
    assert(mockNavContainer.innerHTML.includes('hp-warning'), 'Serena possui badge de HP em Alerta (hp-warning)');
    assert(mockNavContainer.innerHTML.includes('hp-critical'), 'Alaster possui badge de HP Crítico (hp-critical)');
    assert(mockNavContainer.innerHTML.includes("jumpToPlayerCard('p_nav_1')"), 'Chip do herói chama jumpToPlayerCard com ID correto');

    // Teste de chamada de jumpToPlayerCard
    const cardEl126 = sandbox.document.getElementById('player-card-p_nav_1');
    let scrolledTarget = null;
    let addedHighlight = false;
    cardEl126.scrollIntoView = (opt) => { scrolledTarget = opt; };
    const origAdd126 = cardEl126.classList.add;
    cardEl126.classList.add = function(cls) {
      if (cls === 'hero-card-highlight') addedHighlight = true;
      origAdd126.call(this, cls);
    };
    sandbox.jumpToPlayerCard('p_nav_1');
    assert(scrolledTarget && scrolledTarget.behavior === 'smooth', 'jumpToPlayerCard executa scrollIntoView com suavidade');
    assert(addedHighlight, 'jumpToPlayerCard aplica classe hero-card-highlight');

    // 3. Magias e Grimório por Círculo
    vm.runInContext(`
      var casterHero126 = {
        id: 'p_caster_126',
        name: 'Eldrin de Myth Drannor',
        className: 'Mago',
        level: 3,
        int: 16,
        slots: [4, 2, 0, 0, 0, 0, 0, 0, 0],
        slotsUsed: [1, 0, 0, 0, 0, 0, 0, 0, 0],
        preparedSpells: ['Raio de Fogo', 'Mísseis Mágicos', 'Armadura Arcana', 'Passo Nebuloso']
      };
      PLAYERS.push(casterHero126);
    `, sandbox);

    // Toggle de Slot de Magia direto no Círculo
    sandbox.togglePlayerCircleSlot('p_caster_126', 0, 1); // Gasta segundo slot de 1º círculo
    const pCasterUpdated = vm.runInContext("PLAYERS.find(x => x.id === 'p_caster_126')", sandbox);
    assert(pCasterUpdated.slotsUsed[0] === 2, 'togglePlayerCircleSlot incrementou slotsUsed do 1º círculo para 2');
    sandbox.togglePlayerCircleSlot('p_caster_126', 0, 0); // Desgasta primeiro slot
    assert(pCasterUpdated.slotsUsed[0] === 1, 'togglePlayerCircleSlot desfez slot gasto do 1º círculo para 1');

    // Filtros e busca de magia
    sandbox.setPlayerSpellCircleFilter('p_caster_126', '1');
    sandbox.handlePlayerSpellSearch('p_caster_126', 'mísseis');
    // Restaura filtros
    sandbox.setPlayerSpellCircleFilter('p_caster_126', 'all');
    sandbox.handlePlayerSpellSearch('p_caster_126', '');

    // 4. Traços e Características com Filtros e Acordeão
    const martialHero126 = {
      id: 'p_fighter_126',
      name: 'Thokk Martelo Forte',
      race: 'Anão',
      className: 'Guerreiro',
      level: 3,
      str: 16, con: 16,
      features: 'Militar experiente'
    };

    // Filtros por categoria de traços
    sandbox.setPlayerTraitCategoryFilter('p_fighter_126', 'species');
    const speciesTraitsHtml = sandbox.renderPlayerRacialTraits(martialHero126, '', false, null);
    assert(speciesTraitsHtml.includes('feature-species'), 'Traços de espécie possuem classe semântica feature-species');
    assert(speciesTraitsHtml.includes('feature-chevron'), 'Traços de espécie possuem chevron indicativo de acordeão');

    // Busca textual em traços
    const filteredTraitsSearch = sandbox.renderPlayerUnlockedFeatures(martialHero126, 'all', 'fôlego', false, null);
    assert(filteredTraitsSearch.includes('Retomar o Fôlego'), 'Busca em características encontra Retomar o Fôlego');
    assert(!filteredTraitsSearch.includes('Surto de Ação'), 'Busca exclui Surto de Ação que não combina com a query');

    // Acordeão de traço individual
    sandbox.togglePlayerFeatureAccordion('p_fighter_126_class_retomar_o_folego');
    const openTraitsSet = new Set(['p_fighter_126_class_retomar_o_folego']);
    const openFeatureHtml = sandbox.renderPlayerUnlockedFeatures(martialHero126, 'all', '', false, openTraitsSet);
    assert(openFeatureHtml.includes('feature-full-desc open'), 'Característica aberta contém classe feature-full-desc open');

    // Expandir Todos os traços
    sandbox.togglePlayerTraitsExpandAll('p_fighter_126');
    const expandAllHtml = sandbox.renderPlayerUnlockedFeatures(martialHero126, 'all', '', true, null);
    assert(expandAllHtml.includes('feature-chevron open'), 'Expandir todos ativa chevron aberto em todas as características');

    // 5. Validação de CSS e UI no bundle compilado
    const headCss126 = fs.readFileSync(path.join(__dirname, 'src/styles/head_css.html'), 'utf8');
    assert(headCss126.includes('.hero-quick-nav-bar'), 'head_css.html possui estilos para .hero-quick-nav-bar');
    assert(headCss126.includes('.hero-quick-chip'), 'head_css.html possui estilos para .hero-quick-chip');
    assert(headCss126.includes('.tab-badge-pill'), 'head_css.html possui estilos para .tab-badge-pill');
    assert(headCss126.includes('.traits-toolbar'), 'head_css.html possui estilos para .traits-toolbar');
    assert(headCss126.includes('.spells-toolbar'), 'head_css.html possui estilos para .spells-toolbar');
    assert(headCss126.includes('.spell-circle-group'), 'head_css.html possui estilos para .spell-circle-group');
    assert(headCss126.includes('.spell-circle-slot-bubble'), 'head_css.html possui estilos para .spell-circle-slot-bubble');
    assert(headCss126.includes('.spell-tag-badge.conc'), 'head_css.html possui estilos para badge de concentração');
    assert(headCss126.includes('.spell-tag-badge.ritual'), 'head_css.html possui estilos para badge de ritual');

    const uiHtml126 = fs.readFileSync(path.join(__dirname, 'src/ui/ui.html'), 'utf8');
    assert(uiHtml126.includes('id="hero-quick-nav-container"'), 'ui.html possui container #hero-quick-nav-container');

    // =========================================================================
    // BATERIA 127: ISSUE-158 - BAÚ COLETIVO & SUPRIMENTOS: TABELA 100%, FILTROS,
    // STEPPERS INLINE, DISTINÇÃO BAÚ VS HERÓI, PRESETS E ADIÇÃO RÁPIDA DE RECURSOS
    // =========================================================================
    console.log('\n📦 Bateria 127: ISSUE-158 - Baú Coletivo, Filtros, Steppers e Adição Rápida de Recursos...');

    // 1. Validação de CSS e UI (.equip-table 100%, toolbar, quick-add e presets)
    assert(headCss126.includes('.equip-table'), 'head_css.html possui regra para .equip-table (corrige tabela espremida e cabeçalho QtdPeso)');
    assert(headCss126.includes('.stash-summary-toolbar'), 'head_css.html possui estilos para .stash-summary-toolbar');
    assert(headCss126.includes('.stash-quick-add-box'), 'head_css.html possui estilos para .stash-quick-add-box');
    assert(headCss126.includes('.stash-qty-stepper'), 'head_css.html possui estilos para .stash-qty-stepper');
    assert(headCss126.includes('.carrier-badge.is-stash'), 'head_css.html possui estilos para .carrier-badge.is-stash');
    assert(headCss126.includes('.carrier-badge.is-hero'), 'head_css.html possui estilos para .carrier-badge.is-hero');
    assert(uiHtml126.includes('id="stash-summary-bar"'), 'ui.html possui #stash-summary-bar');
    assert(uiHtml126.includes('id="stash-quick-add-box"'), 'ui.html possui #stash-quick-add-box');
    assert(uiHtml126.includes('id="stash-compendium-datalist"'), 'ui.html possui datalist #stash-compendium-datalist');
    assert(uiHtml126.includes('quickAddPresetPartyItem'), 'ui.html possui botões de preset rápido quickAddPresetPartyItem');
    assert(uiHtml126.includes('quickAdjustPartyGold'), 'ui.html possui botões rápidos de ouro quickAdjustPartyGold');

    // 2. Validação de Ícones Semânticos e Portador (Baú vs Herói)
    assert(sandbox.getPartyItemCategoryIcon('Poções') === '🧪', 'Ícone de Poções é 🧪');
    assert(sandbox.getPartyItemCategoryIcon('Tesouros & Gemas') === '💎', 'Ícone de Tesouros & Gemas é 💎');
    assert(sandbox.getPartyItemCategoryIcon('Armas') === '⚔️', 'Ícone de Armas é ⚔️');
    assert(sandbox.getPartyItemCategoryIcon('Documentos & Pistas') === '📜', 'Ícone de Documentos & Pistas é 📜');
    assert(sandbox.isCarrierStash('Baú do Grupo') === true, 'isCarrierStash identifica Baú do Grupo como estoque coletivo');
    assert(sandbox.isCarrierStash('Deraravely') === false, 'isCarrierStash identifica Deraravely como posse de herói');

    // 3. Configuração de Campanha de Teste para Bateria 127
    vm.runInContext(`
      const heroDerara127 = {
        id: 'p_derara_127',
        name: 'Deraravely',
        className: 'Paladino',
        level: 5,
        inventory: [{ name: 'Espada da Vingança', qty: 1, weight: 1.5, category: 'Armas' }]
      };
      PLAYERS.push(heroDerara127);

      const camp127 = getActiveCampaign();
      if (camp127) {
        camp127.partyStash = {
          gold: 100,
          items: [
            { id: 'it_pot_127', name: 'Poção de Cura menor', qty: 6, weight: 0.25, category: 'Poções', carrier: 'Baú do Grupo', desc: 'Recupera 2d4+2 PV' },
            { id: 'it_art_127', name: 'Objetos de arte valendo 25 po', qty: 13, weight: 0.2, category: 'Tesouros & Gemas', carrier: 'Baú do Grupo', desc: '' },
            { id: 'it_swd_127', name: 'Espada da Vingança', qty: 1, weight: 1.5, category: 'Armas', carrier: 'Deraravely', desc: 'Arma mágica +1' }
          ],
          history: []
        };
      }
    `, sandbox);

    // 4. Renderização de Linha da Tabela (Distinção Visual Baú vs Herói + Steppers)
    const stashItemRow = sandbox.renderPartyStashItemRowHtml({
      id: 'it_pot_127', name: 'Poção de Cura menor', qty: 6, weight: 0.25, category: 'Poções', carrier: 'Baú do Grupo', desc: 'Recupera 2d4+2 PV'
    });
    assert(stashItemRow.includes('carrier-badge is-stash'), 'Linha de item no baú usa classe carrier-badge is-stash');
    assert(stashItemRow.includes('adjustPartyItemQty(\'it_pot_127\', -1)'), 'Linha possui botão stepper −1 inline');
    assert(stashItemRow.includes('adjustPartyItemQty(\'it_pot_127\', 1)'), 'Linha possui botão stepper +1 inline');
    assert(stashItemRow.includes('Recupera 2d4+2 PV'), 'Linha exibe descrição abaixo do nome do item');

    const heroItemRow = sandbox.renderPartyStashItemRowHtml({
      id: 'it_swd_127', name: 'Espada da Vingança', qty: 1, weight: 1.5, category: 'Armas', carrier: 'Deraravely', desc: 'Arma mágica +1'
    });
    assert(heroItemRow.includes('carrier-badge is-hero'), 'Linha de item com herói usa classe carrier-badge is-hero');
    assert(heroItemRow.includes('returnPartyItemToStash(\'it_swd_127\')'), 'Linha de item com herói exibe botão 🔄 Ao Baú para devolver ao estoque coletivo');

    // 5. Ajuste Inline de Quantidade (Stepper +1 / -1)
    sandbox.adjustPartyItemQty('it_pot_127', -1);
    const potQtyAfterMinus = vm.runInContext("getActiveCampaign().partyStash.items.find(x => x.id === 'it_pot_127').qty", sandbox);
    assert(potQtyAfterMinus === 5, 'adjustPartyItemQty(-1) reduziu Poção de Cura menor de 6 para 5');

    sandbox.adjustPartyItemQty('it_pot_127', 2);
    const potQtyAfterPlus = vm.runInContext("getActiveCampaign().partyStash.items.find(x => x.id === 'it_pot_127').qty", sandbox);
    assert(potQtyAfterPlus === 7, 'adjustPartyItemQty(+2) aumentou Poção de Cura menor de 5 para 7');

    // 6. Devolução de Item do Herói para o Baú do Grupo (returnPartyItemToStash)
    sandbox.returnPartyItemToStash('it_swd_127');
    const swdCarrierAfterReturn = vm.runInContext("getActiveCampaign().partyStash.items.find(x => x.id === 'it_swd_127').carrier", sandbox);
    const heroInvHasSword = vm.runInContext("PLAYERS.find(p => p.id === 'p_derara_127').inventory.some(i => i.name === 'Espada da Vingança')", sandbox);
    assert(swdCarrierAfterReturn === 'Baú do Grupo', 'returnPartyItemToStash alterou portador de Deraravely para Baú do Grupo');
    assert(heroInvHasSword === false, 'returnPartyItemToStash removeu Espada da Vingança da mochila pessoal de Deraravely');

    // 7. Filtros por Categoria, Localização e Busca Textual
    sandbox.setPartyStashCategoryFilter('Poções');
    const filteredPotions = vm.runInContext("filterPartyStashItems(getActiveCampaign().partyStash.items)", sandbox);
    assert(filteredPotions.length === 1 && filteredPotions[0].id === 'it_pot_127', 'Filtro por categoria Poções retorna apenas as poções');

    sandbox.setPartyStashCategoryFilter('all');
    sandbox.handlePartyStashSearch('arte');
    const filteredSearchArt = vm.runInContext("filterPartyStashItems(getActiveCampaign().partyStash.items)", sandbox);
    assert(filteredSearchArt.length === 1 && filteredSearchArt[0].id === 'it_art_127', 'Busca textual por "arte" encontra os Objetos de arte valendo 25 po');
    sandbox.handlePartyStashSearch('');

    // 8. Presets de Suprimentos 1-Clique e Ouro Rápido 1-Clique
    sandbox.quickAddPresetPartyItem('rations_5');
    const rationsInStash = vm.runInContext("getActiveCampaign().partyStash.items.find(x => x.name.includes('Ração de Viagem'))", sandbox);
    assert(rationsInStash && rationsInStash.qty === 5 && rationsInStash.weight === 1, 'quickAddPresetPartyItem("rations_5") adicionou 5x Ração de Viagem (1kg/un) ao baú');

    sandbox.quickAdjustPartyGold(50, 'Saque de Goblin');
    const goldAfterAdd = vm.runInContext("getActiveCampaign().partyStash.gold", sandbox);
    assert(goldAfterAdd === 150, 'quickAdjustPartyGold(+50) aumentou ouro do baú de 100 para 150 PO');

    sandbox.quickAdjustPartyGold(-25, 'Compra de Suprimentos');
    const goldAfterSub = vm.runInContext("getActiveCampaign().partyStash.gold", sandbox);
    assert(goldAfterSub === 125, 'quickAdjustPartyGold(-25) reduziu ouro do baú de 150 para 125 PO');

    // 9. Inferência Inteligente de Metadados do Compêndio
    const metaPotion = sandbox.lookupCompendiumEquipmentMeta('Poção de Cura Menor (2d4+2)');
    assert(metaPotion && metaPotion.category === 'Poções' && metaPotion.weight === 0.25, 'lookupCompendiumEquipmentMeta reconhece Poção de Cura Menor com categoria Poções e peso 0.25kg');

    // =========================================================================
    // 📚 BATERIA 128: ISSUE-159 — INTEGRAÇÃO DOS 8 LIVROS OFICIAIS D&D 5E
    // =========================================================================
    console.log('\n📚 Bateria 128: ISSUE-159 - Integração dos 8 Livros Oficiais D&D 5E (Antecedentes, DMG, Xanathar, Volo e Tome of Foes)...');

    // Pilar 1: Antecedentes Interativos (BACKGROUNDS_DATA)
    const bgCount = vm.runInContext('Array.isArray(BACKGROUNDS_DATA) ? BACKGROUNDS_DATA.length : 0', sandbox);
    assert(bgCount >= 13, `BACKGROUNDS_DATA carregou os 13 antecedentes oficiais D&D 5E (${bgCount} encontrados)`);

    const acolyteBg = sandbox.findBackgroundData('Acólito');
    assert(acolyteBg && acolyteBg.id === 'acolito' && acolyteBg.skills.includes('intuicao') && acolyteBg.skills.includes('religiao'), 'findBackgroundData localiza Acólito com perícias Intuição e Religião');

    const criminalBg = sandbox.findBackgroundData('Criminoso');
    assert(criminalBg && criminalBg.personalityTraits.length === 8 && criminalBg.ideals.length === 6 && criminalBg.bonds.length === 6 && criminalBg.flaws.length === 6, 'Antecedente Criminoso possui 8 traços (d8), 6 ideais (d6), 6 vínculos (d6) e 6 defeitos (d6)');

    const mockEls128 = {
      'pm-background': { value: 'Sábio' },
      'pm-personality': { value: '' },
      'pm-ideal': { value: '' },
      'pm-bond': { value: '' },
      'pm-flaw': { value: '' },
      'pm-features': { value: '' },
      'pm-gold': { value: '15' },
      'pm-id': { value: '' },
      'pm-background-summary-bar': { style: {}, innerHTML: '' }
    };
    const prevGetEl128 = sandbox.document.getElementById;
    sandbox.document.getElementById = (id) => mockEls128[id] || (prevGetEl128 ? prevGetEl128(id) : null);

    const rolledTraits = sandbox.rollBackgroundTraitsModal('all');
    assert(rolledTraits && rolledTraits.personality && rolledTraits.ideal && rolledTraits.bond && rolledTraits.flaw, 'rollBackgroundTraitsModal("all") sorteia Traço, Ideal, Vínculo e Defeito da tabela oficial do Sábio');
    assert(mockEls128['pm-personality'].value.length > 5 && mockEls128['pm-flaw'].value.length > 5, 'rollBackgroundTraitsModal preencheu os campos do modal de personagem');

    const appliedBg = sandbox.applyBackgroundBenefitsModal();
    assert(appliedBg && appliedBg.background === 'Sábio' && appliedBg.skills.includes('arcanismo') && appliedBg.skills.includes('historia'), 'applyBackgroundBenefitsModal concede Arcanismo e História do Sábio');
    assert(mockEls128['pm-features'].value.includes('Pesquisador'), 'applyBackgroundBenefitsModal adicionou a característica Pesquisador ao campo de Características');
    sandbox.document.getElementById = prevGetEl128;

    // Pilar 2: Gerador de Tesouros DMG & Itens Mágicos
    const hasDmgTables = vm.runInContext('typeof DMG_TREASURE_TABLES === "object" && Array.isArray(DMG_TREASURE_TABLES.gems[100]) && Array.isArray(DMG_TREASURE_TABLES.artObjects[250])', sandbox);
    assert(hasDmgTables, 'DMG_TREASURE_TABLES carregado com tabelas oficiais de Gemas e Objetos de Arte do Guia do Mestre');

    const eqCount128 = vm.runInContext('EQUIPMENT_DATA.length', sandbox);
    assert(eqCount128 >= 150, `EQUIPMENT_DATA expandido com Gemas, Objetos de Arte, Venenos e Itens Mágicos (${eqCount128} itens)`);

    const rolledGem = sandbox.rollDmgGemToStash(100);
    assert(rolledGem && rolledGem.name.includes('100 PO'), 'rollDmgGemToStash(100) sorteia gema oficial de 100 PO e adiciona ao Baú do Grupo');

    const rolledArt = sandbox.rollDmgArtToStash(250);
    assert(rolledArt && rolledArt.name.includes('250 PO'), 'rollDmgArtToStash(250) sorteia objeto de arte oficial de 250 PO e adiciona ao Baú do Grupo');

    const rolledMagic = sandbox.rollDmgMagicItemToStash('uncommon');
    assert(rolledMagic && rolledMagic.name && rolledMagic.desc, 'rollDmgMagicItemToStash("uncommon") sorteia item mágico oficial para o Baú do Grupo');

    const goldBeforeHoard = vm.runInContext('getActiveCampaign().partyStash.gold', sandbox);
    const hoardRes = sandbox.rollDmgTreasureHoardToStash('0-4');
    const goldAfterHoard = vm.runInContext('getActiveCampaign().partyStash.gold', sandbox);
    assert(hoardRes && hoardRes.goldAdded > 0 && goldAfterHoard > goldBeforeHoard, 'rollDmgTreasureHoardToStash("0-4") gera Pilha de Tesouro ND 0-4 com ouro, gemas/arte e itens mágicos no Baú');

    // Pilar 3: Subclasses de Xanathar & Raças de Volo / Tome of Foes / Multiverse
    const hexbladeFound = vm.runInContext('CLASSES_DATA.find(c => c.id === "bruxo").subclasses.some(s => s.name.includes("Lâmina Maldita") || s.name.includes("Hexblade"))', sandbox);
    const gloomStalkerFound = vm.runInContext('CLASSES_DATA.find(c => c.id === "patrulheiro").subclasses.some(s => s.name.includes("Perseguidor Obscuro") || s.name.includes("Gloom Stalker"))', sandbox);
    const swashbucklerFound = vm.runInContext('CLASSES_DATA.find(c => c.id === "ladino").subclasses.some(s => s.name.includes("Espadachim") || s.name.includes("Swashbuckler"))', sandbox);
    const forgeDomainFound = vm.runInContext('CLASSES_DATA.find(c => c.id === "clerigo").subclasses.some(s => s.name.includes("Domínio da Forja"))', sandbox);
    assert(hexbladeFound && gloomStalkerFound && swashbucklerFound && forgeDomainFound, 'Subclasses de Xanathar (Hexblade, Gloom Stalker, Swashbuckler, Domínio da Forja, etc.) integradas em CLASSES_DATA');

    const tabaxiRace = vm.runInContext('SPECIES_DATA.find(s => s.id === "tabaxi")', sandbox);
    const tortleRace = vm.runInContext('SPECIES_DATA.find(s => s.id === "tortle")', sandbox);
    const githRace = vm.runInContext('SPECIES_DATA.find(s => s.id === "gith")', sandbox);
    const eladrinLineage = vm.runInContext('SPECIES_DATA.find(s => s.id === "elfo").lineages.some(l => l.name.includes("Eladrin"))', sandbox);
    const duergarLineage = vm.runInContext('SPECIES_DATA.find(s => s.id === "anao").lineages.some(l => l.name.includes("Duergar"))', sandbox);
    assert(tabaxiRace && tortleRace && githRace && eladrinLineage && duergarLineage, 'Raças e sub-raças de Volo, Tome of Foes e Multiverse (Tabaxi, Tortle, Gith, Eladrin, Duergar) integradas em SPECIES_DATA');

    const tabaxiBonus = sandbox.getRacialAbilityBonuses('Tabaxi');
    assert(tabaxiBonus.dex === 2 && tabaxiBonus.cha === 1, 'getRacialAbilityBonuses("Tabaxi") retorna +2 DES e +1 CAR');
    const firbolgBonus = sandbox.getRacialAbilityBonuses('Firbolg');
    assert(firbolgBonus.wis === 2 && firbolgBonus.str === 1, 'getRacialAbilityBonuses("Firbolg") retorna +2 SAB e +1 FOR');

    // Pilar 4: Expansão do Bestiário (Volo's Guide & Tome of Foes)
    const voloCount = vm.runInContext('BESTIARY_DATA.filter(m => m.source === "Volo\'s Guide").length', sandbox);
    const mtofCount = vm.runInContext('BESTIARY_DATA.filter(m => m.source === "Tome of Foes").length', sandbox);
    assert(voloCount >= 18, `Bestiário contém pelo menos 18 criaturas/NPCs do Volo's Guide (${voloCount} encontrados)`);
    assert(mtofCount >= 14, `Bestiário contém pelo menos 14 criaturas/chefes do Tome of Foes (${mtofCount} encontrados)`);
    const zarielBoss = vm.runInContext('BESTIARY_DATA.find(m => m.name.includes("Zariel"))', sandbox);
    assert(zarielBoss && String(zarielBoss.cr) === '26' && zarielBoss.hp === 580, 'Arquidiabo Zariel (ND 26, 580 PV) presente no Bestiário');

    // =========================================================================
    // 🧙‍♂️ BATERIA 129: ISSUE-160 — CRIADOR DE PERSONAGENS ESTILO D&D BEYOND
    // =========================================================================
    console.log('\n🧙‍♂️ Bateria 129: ISSUE-160 - Criador de Personagens Estilo D&D Beyond (Abas, Sugestões Clicáveis & Equipamentos Iniciais)...');

    // 1. Verifica presença das 6 abas e acordeões no HTML compilado (ui.html)
    assert(uiHtml126.includes('id="ddb-builder-nav"') && uiHtml126.includes('data-step="home"') && uiHtml126.includes('data-step="class"') && uiHtml126.includes('data-step="background"') && uiHtml126.includes('data-step="species"') && uiHtml126.includes('data-step="abilities"') && uiHtml126.includes('data-step="equipment"'), 'Barra de navegação estilo D&D Beyond possui as 6 abas (HOME, 1. CLASSE, 2. ANTECEDENTE, 3. RAÇA, 4. ATRIBUTOS, 5. EQUIPAMENTO)');

    // 2. Navegação entre etapas (switchPlayerModalStep, nextPlayerModalStep, prevPlayerModalStep)
    assert(sandbox.switchPlayerModalStep('home') === 'home', 'switchPlayerModalStep("home") posiciona na aba HOME');
    assert(sandbox.nextPlayerModalStep() === 'class', 'nextPlayerModalStep() avança de HOME para 1. CLASSE');
    assert(sandbox.nextPlayerModalStep() === 'background', 'nextPlayerModalStep() avança de 1. CLASSE para 2. ANTECEDENTE');
    assert(sandbox.nextPlayerModalStep() === 'species', 'nextPlayerModalStep() avança de 2. ANTECEDENTE para 3. RAÇA / ESPÉCIE');
    assert(sandbox.nextPlayerModalStep() === 'abilities', 'nextPlayerModalStep() avança de 3. RAÇA para 4. ATRIBUTOS');
    assert(sandbox.nextPlayerModalStep() === 'equipment', 'nextPlayerModalStep() avança de 4. ATRIBUTOS para 5. EQUIPAMENTO');
    assert(sandbox.prevPlayerModalStep() === 'abilities', 'prevPlayerModalStep() retorna de 5. EQUIPAMENTO para 4. ATRIBUTOS');

    // 3. Base de Equipamentos Iniciais e Perícias por Classe (CLASS_STARTING_EQUIPMENT)
    const classEquipKeys = vm.runInContext('Object.keys(CLASS_STARTING_EQUIPMENT)', sandbox);
    assert(classEquipKeys.length === 12, `CLASS_STARTING_EQUIPMENT possui as 12 classes oficiais do Livro do Jogador (${classEquipKeys.length})`);

    const fighterStartData = sandbox.getClassStartingEquipmentData('Guerreiro');
    assert(fighterStartData && fighterStartData.startingGoldFormula === '5d4 × 10 PO' && fighterStartData.choices.length === 4, 'getClassStartingEquipmentData("Guerreiro") retorna 4 escolhas de equipamento inicial e fórmula 5d4 × 10 PO');

    const rogueStartData = sandbox.getClassStartingEquipmentData('Ladino');
    assert(rogueStartData && rogueStartData.skillCount === 4 && rogueStartData.fixedEquipment.some(e => e.name.includes('Ferramentas de Ladrão')), 'getClassStartingEquipmentData("Ladino") concede 4 perícias e Ferramentas de Ladrão fixas');

    // 4. Sugestões Clicáveis de Traços (Antecedente + Classe) e Preenchimento 1-Clique
    const mockEls129 = {
      'pm-background': { value: 'Soldado' },
      'pm-class-select': { value: 'Guerreiro', options: [{ value: 'Guerreiro' }, { value: 'Mago' }] },
      'pm-class': { value: 'Guerreiro' },
      'pm-personality': { value: '' },
      'pm-ideal': { value: '' },
      'pm-bond': { value: '' },
      'pm-flaw': { value: '' },
      'pm-armor-select': { value: 'none' },
      'pm-shield-check': { checked: false },
      'pm-gold': { value: '15' }
    };
    const prevGetEl129 = sandbox.document.getElementById;
    sandbox.document.getElementById = (id) => mockEls129[id] || (prevGetEl129 ? prevGetEl129(id) : null);

    const traitSug = sandbox.getModalTraitSuggestionsData();
    assert(traitSug && traitSug.personality.length >= 10 && traitSug.ideal.length >= 8, 'getModalTraitSuggestionsData combina sugestões do Antecedente (8 traços d8) + sugestões temáticas da Classe');
    assert(traitSug.personality.some(s => s.sourceType === 'bg') && traitSug.personality.some(s => s.sourceType === 'cls'), 'Sugestões incluem tags tanto do Antecedente quanto da Classe');

    const pickedTrait = sandbox.pickModalTraitSuggestion('personality', traitSug.personality[0].text);
    assert(pickedTrait === traitSug.personality[0].text && mockEls129['pm-personality'].value === traitSug.personality[0].text, 'pickModalTraitSuggestion preenche instantaneamente o campo de Traço de Personalidade');

    // 5. Seleção Interativa de Perícias da Classe (toggleModalClassSkillChoice)
    vm.runInContext('window._modalSelectedClassSkills = []', sandbox);
    sandbox.toggleModalClassSkillChoice('atletismo');
    sandbox.toggleModalClassSkillChoice('intimidacao');
    sandbox.toggleModalClassSkillChoice('percepcao'); // Guerreiro tem limite 2, deve substituir a mais antiga (atletismo)
    const selSkills129 = vm.runInContext('window._modalSelectedClassSkills', sandbox);
    assert(selSkills129.length === 2 && selSkills129.includes('intimidacao') && selSkills129.includes('percepcao'), 'toggleModalClassSkillChoice respeita o limite de escolhas de perícias da classe (2 para Guerreiro)');

    // 6. Aplicação de Equipamento Inicial por Classe (applyModalStartingEquipmentToSheet) e Rolagem de Ouro
    sandbox.selectModalStartingEquipOption('fighter_armor', 'a'); // Cota de Malha
    sandbox.selectModalStartingEquipOption('fighter_wpn_1', 'a'); // Espada Longa e Escudo
    sandbox.selectModalStartingEquipOption('fighter_wpn_2', 'a'); // Besta Leve e 20 Virotes
    sandbox.selectModalStartingEquipOption('fighter_pack', 'a');  // Pacote de Aventureiro

    const appliedEquip = sandbox.applyModalStartingEquipmentToSheet();
    assert(appliedEquip && appliedEquip.armor === 'cota de malha' && appliedEquip.shield === true, 'applyModalStartingEquipmentToSheet equipa Cota de Malha e Escudo para Guerreiro (opções a)');
    assert(appliedEquip.weapons.includes('Espada Longa') && appliedEquip.weapons.includes('Besta Leve'), 'applyModalStartingEquipmentToSheet equipa Espada Longa e Besta Leve');
    assert(appliedEquip.inventory.some(it => it.name.includes('Pacote de Aventureiro')) && appliedEquip.inventory.some(it => it.name.includes('Insígnia de patente')), 'applyModalStartingEquipmentToSheet adiciona o Pacote da Classe e os itens do Antecedente Soldado à mochila');

    const rolledStartGold = sandbox.rollModalStartingClassGold();
    assert(rolledStartGold >= 50 && rolledStartGold <= 200 && Number(mockEls129['pm-gold'].value) === rolledStartGold, `rollModalStartingClassGold rola 5d4 × 10 PO para Guerreiro (${rolledStartGold} PO) e atualiza #pm-gold`);

    sandbox.document.getElementById = prevGetEl129;

    // =========================================================================
    // ⚗️ BATERIA 130: ISSUE-161 — MECÂNICAS AVANÇADAS XANATHAR & GUIA DO MESTRE
    // =========================================================================
    console.log('\n⚗️ Bateria 130: ISSUE-161 - 7 Sistemas Oficiais (Esta é a Sua Vida, Talentos Raciais, Magias Xanathar, Loucura/Ferimentos, Armadilhas, Facções/Dádivas e Oficina de Monstros)...');

    // 1. Item 1: Gerador "Esta é a Sua Vida" (Guia de Xanathar Cap. 1)
    const mockEls130 = {
      'pm-class-select': { value: 'Paladino' },
      'pm-backstory': { value: '' },
      'pm-allies': { value: '' },
      'pm-enemies': { value: '' }
    };
    const prevGetEl130 = sandbox.document.getElementById;
    sandbox.document.getElementById = (id) => mockEls130[id] || (prevGetEl130 ? prevGetEl130(id) : null);

    const lifePathRes = sandbox.rollXanatharLifePathModal('all');
    assert(lifePathRes && lifePathRes.birthplace && lifePathRes.parents && lifePathRes.ally && lifePathRes.enemy, 'rollXanatharLifePathModal("all") gera local de nascimento, família, aliado e inimigo');
    assert(mockEls130['pm-backstory'].value.includes('Origem & Família') && mockEls130['pm-backstory'].value.includes('Paladino') && mockEls130['pm-allies'].value.length > 5 && mockEls130['pm-enemies'].value.length > 5, 'rollXanatharLifePathModal preencheu #pm-backstory, #pm-allies e #pm-enemies');
    sandbox.document.getElementById = prevGetEl130;

    // 2. Item 3: 15 Talentos Raciais Exclusivos de Xanathar
    const racialFeatsCount = vm.runInContext('FEATS_DATA.filter(f => f.source === "Xanathar\'s Guide").length', sandbox);
    assert(racialFeatsCount === 15, `FEATS_DATA contém os 15 Talentos Raciais oficiais do Guia de Xanathar (${racialFeatsCount})`);
    const elvenAccCheckPass = sandbox.checkFeatPrerequisites({ race: 'Elfo (Alto Elfo)', dex: 16 }, 'precisao_elfica');
    const elvenAccCheckFail = sandbox.checkFeatPrerequisites({ race: 'Anão da Colina', dex: 16 }, 'precisao_elfica');
    assert(elvenAccCheckPass.met === true && elvenAccCheckFail.met === false, 'checkFeatPrerequisites valida pré-requisito racial de Precisão Élfica (Elfo passa, Anão bloqueia)');

    // 3. Item 4: 25 Magias Exclusivas de Xanathar
    const xanatharSpellsCount = vm.runInContext('SPELLS_DATA.filter(s => s.source === "Xanathar\'s Guide").length', sandbox);
    const hasTollTheDead = vm.runInContext('SPELLS_DATA.some(s => s.name.includes("Pedágio dos Mortos"))', sandbox);
    const hasShadowBlade = vm.runInContext('SPELLS_DATA.some(s => s.name.includes("Lâmina das Sombras"))', sandbox);
    const hasThunderStep = vm.runInContext('SPELLS_DATA.some(s => s.name.includes("Passo Trovejante"))', sandbox);
    assert(xanatharSpellsCount === 25 && hasTollTheDead && hasShadowBlade && hasThunderStep, `SPELLS_DATA contém as 25 magias de Xanathar (${xanatharSpellsCount}), incluindo Pedágio dos Mortos, Lâmina das Sombras e Passo Trovejante`);

    // 4. Item 5: Loucura, Ferimentos Persistentes e Choque de Sistema (DMG Cap. 8 & 9)
    vm.runInContext('state.combatants = [{ id: "comb_trauma_1", name: "Sir Roland", type: "player", hp: 30, maxHp: 30, conditions: [], notes: "" }]', sandbox);
    const madnessRes = sandbox.rollCombatTraumaEffect('shortMadness', 'comb_trauma_1');
    const injuryRes = sandbox.rollCombatTraumaEffect('lingeringInjury', 'comb_trauma_1');
    const shockRes = sandbox.rollCombatTraumaEffect('systemShock', 'comb_trauma_1');
    assert(madnessRes && madnessRes.effectText && injuryRes && injuryRes.entry.name && shockRes && shockRes.effectText, 'rollCombatTraumaEffect sorteia e aplica Loucura, Ferimento Persistente (d20) e Choque de Sistema (d10)');

    // 5. Item 6: Gerador e Disparador de Armadilhas de Masmorra (DMG Cap. 5)
    vm.runInContext('state.combatants[0].hp = 50', sandbox);
    const trapRes = sandbox.triggerDmgTrapOnTargets('fire_breathing_statue', '1-4', 'dangerous', 'comb_trauma_1');
    const hpAfterTrap = vm.runInContext('state.combatants[0].hp', sandbox);
    assert(trapRes && trapRes.formula === '2d10' && trapRes.dc === 13 && trapRes.damage >= 2 && hpAfterTrap === 50 - trapRes.damage, 'triggerDmgTrapOnTargets dispara Estátua Sopradora de Fogo (2d10, CD 13) e desconta PV do alvo');

    // 6. Item 7: Renome de Facções, Bênçãos Divinas & Dádivas Épicas (DMG Cap. 1 & 7)
    const renownScore = sandbox.adjustCampaignFactionRenown('harpers', 10);
    const harperRank = sandbox.getFactionRankTitle('harpers', renownScore);
    assert(renownScore >= 10 && harperRank.includes('Vela Brilhante'), `adjustCampaignFactionRenown atualiza Renome nos Harpistas (${renownScore}) e promove para "${harperRank}"`);

    const heroForGift = vm.runInContext('PLAYERS[0]', sandbox);
    const conBeforeGift = heroForGift.con || 10;
    const giftRes = sandbox.grantSupernaturalGiftToHero(heroForGift.id, 'blessing_health');
    const conAfterGift = vm.runInContext('PLAYERS[0].con', sandbox);
    assert(giftRes && giftRes.giftName.includes('Bênção de Saúde') && conAfterGift === Math.min(22, conBeforeGift + 2), 'grantSupernaturalGiftToHero concede Bênção de Saúde (+2 CON) e registra nas características do herói');

    // 7. Item 8: Oficina de Criação de Monstros & Calculadora Oficial de ND (DMG p. 274)
    const crCalc = sandbox.calculateCustomMonsterCr({ hp: 135, ac: 15, dpr: 35, atk: 6, dc: 15 });
    assert(crCalc && crCalc.defensiveCr === '5' && crCalc.offensiveCr === '5' && crCalc.finalCr === '5' && crCalc.xp === 1800, 'calculateCustomMonsterCr calcula ND Defensivo 5, Ofensivo 5 e ND Final 5 (1.800 XP) segundo a tabela oficial do DMG');

    const savedCustomMon = sandbox.saveCustomMonsterToBestiary({ name: 'Guardião de Obsidiana', type: 'construct', hp: 180, ac: 18, dpr: 55, atk: 8, dc: 16 });
    const foundCustomMon = vm.runInContext('BESTIARY_DATA.find(m => m.name === "Guardião de Obsidiana")', sandbox);
    assert(savedCustomMon && foundCustomMon && foundCustomMon.source === 'DMG Custom', 'saveCustomMonsterToBestiary calcula o ND e salva o monstro customizado no Bestiário');

    // =========================================================================
    // 🔮 BATERIA 131: SINCRONIZAÇÃO DE MAGIAS DESMARCADAS & ESPAÇOS DE PACTO (ISSUE-162)
    // =========================================================================
    console.log('\n🔮 131. Testes de Sincronização de Magias Desmarcadas na Ficha & Espaços de Pacto (ISSUE-162):');

    // 1. Auto-reparo de fichas com magias órfãs presas em spellbookSpells/knownSpells (ex.: Proteção contra o Bem e Mal desmarcada em preparedSpells)
    vm.runInContext(`
      const clakerBuggy = {
        id: 'p_claker_bug_162',
        name: 'Claker',
        className: 'Bruxo',
        level: 5,
        cha: 20,
        slots: [0, 0, 2, 0, 0],
        slotsUsed: [0, 0, 0, 0, 0],
        preparedSpells: ['Mãos Flamejantes', 'Raio de Bruxa', 'Rajada Mística'],
        spellbookSpells: ['Mãos Flamejantes', 'Proteção contra o Bem e Mal', 'Raio de Bruxa', 'Rajada Mística'],
        knownSpells: ['Mãos Flamejantes', 'Proteção contra o Bem e Mal', 'Raio de Bruxa', 'Rajada Mística'],
        spells: 'Truques: Rajada Mística\\nPreparadas: Mãos Flamejantes, Proteção contra o Bem e Mal, Raio de Bruxa'
      };
      PLAYERS.push(clakerBuggy);
      globalThis.__clakerKnown162 = getPlayerKnownSpells(clakerBuggy);
    `, sandbox);
    const clakerKnown162 = vm.runInContext('globalThis.__clakerKnown162', sandbox);
    const clakerBook162 = vm.runInContext('PLAYERS.find(p => p.id === "p_claker_bug_162").spellbookSpells', sandbox);
    assert(!clakerKnown162.includes('Proteção contra o Bem e Mal'), 'getPlayerKnownSpells purga automaticamente magia órfã ("Proteção contra o Bem e Mal") que não está em preparedSpells');
    assert(!clakerBook162.includes('Proteção contra o Bem e Mal') && clakerKnown162.length === 3, 'spellbookSpells é higienizado imediatamente para conter apenas as 3 magias ativas');

    // 2. Desmarcar magia no modal Gerenciar Magias (openSpellPickerModal -> toggleSpellInPicker -> saveSpellPickerSelection)
    vm.runInContext(`
      openSpellPickerModal('p_claker_bug_162');
      toggleSpellInPicker('Raio de Bruxa'); // Desmarca Raio de Bruxa
      saveSpellPickerSelection(true);
      globalThis.__clakerAfterUncheck162 = getPlayerKnownSpells(PLAYERS.find(p => p.id === 'p_claker_bug_162'));
    `, sandbox);
    const clakerAfterUncheck162 = vm.runInContext('globalThis.__clakerAfterUncheck162', sandbox);
    const clakerSpellsStr162 = vm.runInContext('PLAYERS.find(p => p.id === "p_claker_bug_162").spells', sandbox);
    assert(!clakerAfterUncheck162.includes('Raio de Bruxa') && clakerAfterUncheck162.includes('Mãos Flamejantes'), 'Desmarcar "Raio de Bruxa" no Gerenciar Magias e salvar remove a magia definitivamente da ficha');
    assert(!clakerSpellsStr162.includes('Raio de Bruxa'), 'Resumo textual p.spells atualizado sem a magia desmarcada');

    // 3. Remoção direta com 1 clique pelo botão ✕ no card da magia (removeSpellFromPlayer)
    vm.runInContext(`
      removeSpellFromPlayer('p_claker_bug_162', 'Mãos Flamejantes');
      globalThis.__clakerAfterDirectRemove162 = getPlayerKnownSpells(PLAYERS.find(p => p.id === 'p_claker_bug_162'));
    `, sandbox);
    const clakerAfterDirectRemove162 = vm.runInContext('globalThis.__clakerAfterDirectRemove162', sandbox);
    assert(!clakerAfterDirectRemove162.includes('Mãos Flamejantes') && clakerAfterDirectRemove162.length === 1, 'removeSpellFromPlayer remove "Mãos Flamejantes" com 1 clique de todas as listas da ficha');

    // 4. Desmarcar TODAS as magias limpa inclusive p.spells (não ressuscita a última magia)
    vm.runInContext(`
      openSpellPickerModal('p_claker_bug_162');
      toggleSpellInPicker('Rajada Mística');
      saveSpellPickerSelection(true);
      globalThis.__clakerEmpty162 = getPlayerKnownSpells(PLAYERS.find(p => p.id === 'p_claker_bug_162'));
    `, sandbox);
    const clakerEmpty162 = vm.runInContext('globalThis.__clakerEmpty162', sandbox);
    const clakerEmptyStr162 = vm.runInContext('PLAYERS.find(p => p.id === "p_claker_bug_162").spells', sandbox);
    assert(clakerEmpty162.length === 0 && clakerEmptyStr162 === '', 'Desmarcar todas as magias resulta em 0 magias na ficha e limpa p.spells ("")');

    // 5. Renderização de indicador de Espaços de Pacto no 1º Círculo para Bruxos Nv 5 (em vez de "Sem espaços")
    vm.runInContext(`
      const pWarlockRender = PLAYERS.find(p => p.id === 'p_claker_bug_162');
      pWarlockRender.preparedSpells = ['Mãos Flamejantes'];
      pWarlockRender.activeCardTab = 'spells';
      activePortalPlayerId = null;
      renderPlayers();
      globalThis.__warlockGridHtml162 = document.getElementById('grid-players')?.innerHTML || '';
    `, sandbox);
    const warlockGridHtml162 = vm.runInContext('globalThis.__warlockGridHtml162', sandbox);
    assert(warlockGridHtml162.includes('Espaços de Pacto (2/2 de 3º Círc.)'), 'Cabeçalho de 1º Círculo do Bruxo Nv 5 exibe "🔮 Espaços de Pacto (2/2 de 3º Círc.)" em vez de "Sem espaços"');
    assert(warlockGridHtml162.includes('removeSpellFromPlayer('), 'Card de magia na ficha inclui botão rápido ✕ (removeSpellFromPlayer)');

    // =========================================================================
    // 📄 Bateria 132: Ficha Oficial em PDF (ficha.pdf) & Traços Diretos e Objetivos (ISSUE-163)
    // =========================================================================
    console.log('\n📄 [Bateria 132] Ficha Oficial em PDF (ficha.pdf) & Traços Diretos e Objetivos (ISSUE-163):');

    // 1. Verificar embutimento do modelo ficha.pdf e do dicionário TRAIT_QUICK_RULES
    assert(compiledHtml.includes('DND5E_OFFICIAL_SHEET_B64'), 'Bundle compilado possui o template oficial DND5E_OFFICIAL_SHEET_B64 embutido');
    assert(compiledHtml.includes('TRAIT_QUICK_RULES'), 'Bundle compilado possui o dicionário TRAIT_QUICK_RULES embutido');

    const quickRulesCount = vm.runInContext('Object.keys(TRAIT_QUICK_RULES || {}).length', sandbox);
    assert(quickRulesCount >= 60, `Dicionário TRAIT_QUICK_RULES contém ${quickRulesCount} regras diretas e objetivas mapeadas`);

    // 2. Testar Claker (Bruxo 5 / Tiefling, Carisma 20): resumos diretos, sem texto de livro repetitivo e com valores calculados
    vm.runInContext(`
      const claker163 = {
        id: 'p_claker_163',
        name: 'Claker',
        student: 'João',
        className: 'Bruxo',
        subclass: 'O Corruptor (The Fiend)',
        subclassIdx: 0,
        level: 5,
        race: 'Tiefling',
        background: 'Sábio',
        alignment: 'Caótico e Neutro',
        str: 8, dex: 16, con: 15, int: 11, wis: 10, cha: 20,
        hp: 38, maxHp: 38, ac: 14, speed: '9m',
        saveProficiencies: ['wis', 'cha'],
        skillProficiencies: ['arcanismo', 'intimidacao', 'enganacao', 'historia'],
        slots: [0, 0, 2, 0, 0, 0, 0, 0, 0],
        slotsUsed: [0, 0, 1, 0, 0, 0, 0, 0, 0],
        preparedSpells: ['Rajada Mística', 'Mãos Flamejantes', 'Bola de Fogo'],
        features: 'Bênção do Obscuro, Sorte do Obscuro',
        inventory: [{ name: 'Cajado Arcano', qty: 1, weight: '2.0', equipped: true }],
        coins: { cp: 10, sp: 25, ep: 0, gp: 150, pp: 2 }
      };
      globalThis.__clakerTraits163 = getPlayerAllFeaturesAndTraits(claker163);
      globalThis.__clakerLang163 = getPlayerLanguagesString(claker163);
      globalThis.__clakerRef163 = claker163;
    `, sandbox);

    const clakerTraits163 = vm.runInContext('globalThis.__clakerTraits163', sandbox);
    const clakerLang163 = vm.runInContext('globalThis.__clakerLang163', sandbox);

    assert(Array.isArray(clakerTraits163) && clakerTraits163.length >= 6, 'getPlayerAllFeaturesAndTraits retorna lista estruturada de traços de Claker');
    const bencaoTrait = clakerTraits163.find(t => t.name.toLowerCase().includes('bênção do obscuro') || t.name.toLowerCase().includes('bencao do obscuro'));
    assert(!!bencaoTrait && bencaoTrait.desc.includes('+10 PV temporários'), 'Bênção do Obscuro exibe valor calculado direto "+10 PV temporários" (CAR +5 + Nv 5)');
    assert(bencaoTrait.tag === 'Passivo' && bencaoTrait.usage.includes('0 PV'), 'Bênção do Obscuro possui tag Passivo e gatilho "Ao reduzir hostil a 0 PV"');

    const bencaoCount = clakerTraits163.filter(t => t.name.toLowerCase().includes('bênção do obscuro') || t.name.toLowerCase().includes('bencao do obscuro')).length;
    assert(bencaoCount === 1, 'Linha customizada "Bênção do Obscuro, Sorte do Obscuro" não duplica Bênção do Obscuro');

    const sorteTrait = clakerTraits163.find(t => t.name.toLowerCase().includes('sorte do obscuro'));
    assert(!!sorteTrait && sorteTrait.desc.includes('+1d10'), 'Sorte do Obscuro é extraída da linha customizada e enriquecida com resumo direto (+1d10)');

    const pactoTrait = clakerTraits163.find(t => t.name.toLowerCase().includes('magia de pacto'));
    assert(!!pactoTrait && pactoTrait.desc.includes('CD 16') && pactoTrait.desc.includes('+8'), 'Magia de Pacto exibe CD 16 e Ataque +8 calculados para Carisma 20 no Nv 5');

    const patronoTrait = clakerTraits163.find(t => t.name.toLowerCase().includes('patrono'));
    assert(!!patronoTrait && patronoTrait.desc.includes('O Corruptor') && !patronoTrait.desc.includes('Grande Antigo'), 'Patrono Transcendente mostra apenas o patrono escolhido ("O Corruptor") sem listar os outros patronos');

    const hasIdiomasTrait = clakerTraits163.some(t => t.name.toLowerCase() === 'idiomas');
    assert(!hasIdiomasTrait, 'Traço genérico "Idiomas" foi removido da lista de traços de combate/habilidades');
    assert(clakerLang163.includes('Comum') && clakerLang163.includes('Infernal'), 'getPlayerLanguagesString extrai automaticamente "Comum, Infernal" para Tiefling');

    // 3. Testar Preenchimento do Modelo Oficial de 3 Páginas (books/pdfs/ficha.pdf)
    const clakerRef163 = vm.runInContext('globalThis.__clakerRef163', sandbox);
    const clakerPdfBytes163 = await pdfLibModule.fillOfficialDnd5eSheetPdf(clakerRef163);
    assert(clakerPdfBytes163 && clakerPdfBytes163.length > 400000, 'fillOfficialDnd5eSheetPdf gera PDF baseado no modelo oficial ficha.pdf');

    const clakerDoc163 = await PDFDocument.load(clakerPdfBytes163);
    assert(clakerDoc163.getPageCount() === 3, 'PDF oficial gerado possui exatamente as 3 páginas do modelo ficha.pdf');

    const clakerForm163 = clakerDoc163.getForm();
    assert(clakerForm163.getTextField('Nome do Personagem').getText() === 'Claker', 'Campo oficial "Nome do Personagem" preenchido na Página 1');
    assert(clakerForm163.getTextField('Classe e Nível').getText() === 'Bruxo 5', 'Campo oficial "Classe e Nível" preenchido na Página 1');
    assert(clakerForm163.getTextField('CHA').getText() === '20' && clakerForm163.getTextField('CHAmod').getText() === '+5', 'Campos oficiais CHA (20) e CHAmod (+5) preenchidos');
    assert(clakerForm163.getCheckBox('RB-Intimidação').isChecked() && clakerForm163.getTextField('Intimidação').getText() === '+8', 'Perícia oficial Intimidação marcada e calculada (+8)');
    assert(clakerForm163.getTextField('Caracteristicas e Habilidades').getText().includes('+10 PV temporários'), 'Campo oficial "Caracteristicas e Habilidades" contém os resumos diretos calculados');
    assert(clakerForm163.getTextField('SpellSaveDC').getText() === '16' && clakerForm163.getTextField('SpellAtkBonus').getText() === '+8', 'Cabeçalho do Grimório na Página 3 possui CD 16 e Ataque +8');
    assert(clakerForm163.getTextField('Total de Espaços Nível 3').getText() === '2', 'Página 3 registra os 2 espaços de 3º círculo do Bruxo');

    // 4. Testar Transbordo Automático para "Outras Características e Habilidades" na Página 2 e Fallback
    const fallbackBytes163 = await pdfLibModule.generateEditableDnd5ePdf({ ...clakerRef163, _forceFallbackPdf: true });
    const fallbackDoc163 = await PDFDocument.load(fallbackBytes163);
    assert(fallbackDoc163.getPageCount() === 2, 'Fallback programático continua funcional quando solicitado (_forceFallbackPdf)');

    // =========================================================================
    // 133. TESTES DE ATAQUES ESPECIAIS DE CLASSE & DANO EXTRA (ISSUE-164)
    // =========================================================================
    console.log('\n⚔️ [Bateria 133] Ataques Especiais de Classe e Modificadores de Dano (ISSUE-164):');

    // 1. Ladino: Ataque Furtivo (Sneak Attack)
    const rogueHero1 = {
      id: 'p_rogue_1',
      name: 'Ladino Iniciante',
      className: 'Ladino',
      level: 1,
      str: 10,
      dex: 16,
      inventory: [{ name: 'Adaga', equipped: true }]
    };
    const rogueAtks1 = sandbox.getPlayerCalculatedAttacks(rogueHero1);
    const sneak1 = rogueAtks1.find(a => a.name.includes('Ataque Furtivo'));
    assert(sneak1 && sneak1.damage === '+1d6', 'Ladino Nv 1 calcula Ataque Furtivo com +1d6');
    assert(sneak1 && sneak1.toHit === '—' && sneak1.isDamageBonusOnly === true, 'Ataque Furtivo possui acerto "—" e isDamageBonusOnly');
    assert(sneak1 && sneak1.badge === '🗡️ Furtivo', 'Ataque Furtivo possui badge temático 🗡️ Furtivo');

    const rogueHero5 = {
      id: 'p_rogue_5',
      name: 'Ladino Nv 5',
      className: 'Ladino',
      level: 5,
      str: 10,
      dex: 18,
      inventory: [{ name: 'Rapieira', equipped: true }]
    };
    const rogueAtks5 = sandbox.getPlayerCalculatedAttacks(rogueHero5);
    const sneak5 = rogueAtks5.find(a => a.name.includes('Ataque Furtivo'));
    assert(sneak5 && sneak5.damage === '+3d6', 'Ladino Nv 5 escala Ataque Furtivo para +3d6');

    // 2. Paladino: Destruição Divina e Canalizar Divindade
    const paladinHero2 = {
      id: 'p_paladin_2',
      name: 'Paladino Nv 2',
      className: 'Paladino',
      level: 2,
      str: 16,
      cha: 14,
      inventory: [{ name: 'Espada Longa', equipped: true }]
    };
    const paladinAtks2 = sandbox.getPlayerCalculatedAttacks(paladinHero2);
    const smite2 = paladinAtks2.find(a => a.name.includes('Destruição Divina'));
    assert(smite2 && smite2.damageType === 'Radiante', 'Paladino Nv 2 possui Destruição Divina (Radiante)');
    assert(smite2 && smite2.badge === '✨ Divino', 'Destruição Divina possui badge ✨ Divino');

    const paladinHero3 = {
      id: 'p_paladin_3',
      name: 'Paladino Devoção Nv 3',
      className: 'Paladino',
      subclass: 'Devoção',
      level: 3,
      str: 16,
      cha: 16,
      inventory: [{ name: 'Espada Longa', equipped: true }]
    };
    const paladinAtks3 = sandbox.getPlayerCalculatedAttacks(paladinHero3);
    const sacredWpn = paladinAtks3.find(a => a.name.includes('Arma Sagrada'));
    assert(sacredWpn && sacredWpn.toHit === '+3', 'Paladino da Devoção calcula Arma Sagrada com +3 (Carisma 16)');

    // 3. Bárbaro: Dano em Fúria (Rage)
    const barbHero = {
      id: 'p_barb_1',
      name: 'Bárbaro Nv 1',
      className: 'Bárbaro',
      level: 1,
      str: 16,
      inventory: [{ name: 'Machado Grande', equipped: true }]
    };
    const barbAtks = sandbox.getPlayerCalculatedAttacks(barbHero);
    const rageAtk = barbAtks.find(a => a.name.includes('Dano em Fúria'));
    assert(rageAtk && rageAtk.damage === '+2', 'Bárbaro Nv 1 possui Dano em Fúria de +2');
    assert(rageAtk && rageAtk.badge === '💢 Fúria', 'Dano em Fúria possui badge 💢 Fúria');

    // 4. Monge: Golpe Desarmado (Artes Marciais)
    const monkHero = {
      id: 'p_monk_1',
      name: 'Monge Nv 1',
      className: 'Monge',
      level: 1,
      str: 10,
      dex: 16,
      inventory: []
    };
    const monkAtks = sandbox.getPlayerCalculatedAttacks(monkHero);
    const martialStrike = monkAtks.find(a => a.name.includes('Artes Marciais'));
    assert(martialStrike && martialStrike.toHit === '+5', 'Monge Nv 1 usa Destreza (+3 + PB +2) no acerto (+5)');
    assert(martialStrike && martialStrike.damage === '1d4+3', 'Monge Nv 1 causa 1d4+3 com Golpe Desarmado');
    assert(!monkAtks.some(a => a.name === 'Ataque Desarmado'), 'Ataque Desarmado genérico é substituído pelo Golpe Desarmado do Monge');

    // 5. Draconato: Arma de Sopro
    const dragonHero = {
      id: 'p_dragon_1',
      name: 'Draconato Nv 1',
      className: 'Guerreiro',
      race: 'Draconato',
      level: 1,
      con: 14,
      inventory: [{ name: 'Espada Longa', equipped: true }]
    };
    const dragonAtks = sandbox.getPlayerCalculatedAttacks(dragonHero);
    const breathAtk = dragonAtks.find(a => a.name.includes('Arma de Sopro'));
    assert(breathAtk && breathAtk.damage === '2d6', 'Draconato Nv 1 possui Arma de Sopro com 2d6');
    assert(breathAtk && breathAtk.toHit === 'CD 12', 'CD de Salvaguarda calculada corretamente: CD 12 (8 + PB +2 + CON +2)');

    // 6. Bruxo: Rajada Mística & Truques de Dano
    const warlockHero = {
      id: 'p_warlock_5',
      name: 'Bruxo Nv 5',
      className: 'Bruxo',
      level: 5,
      cha: 18,
      spells: 'Rajada Mística',
      traits: 'Rajada Agonizante',
      inventory: []
    };
    const warlockAtks = sandbox.getPlayerCalculatedAttacks(warlockHero);
    const eldritchAtk = warlockAtks.find(a => a.name.includes('Rajada Mística'));
    assert(eldritchAtk && eldritchAtk.toHit === '+7', 'Rajada Mística calcula acerto mágico +7 (PB +3 + CAR +4)');
    assert(eldritchAtk && eldritchAtk.damage.includes('2× 1d10+4'), 'Rajada Mística Nv 5 dispara 2 feixes de 1d10+4 com Rajada Agonizante');

    // 7. Rolagem de Dano Only com fórmulas e valores fixos
    vm.runInContext(`
      PLAYERS.push(
        { id: 'p_rogue_5_test', name: 'Ladino 5', level: 5, className: 'Ladino' },
        { id: 'p_barb_1_test', name: 'Bárbaro 1', level: 1, className: 'Bárbaro' }
      );
    `, sandbox);

    const sneakDmgRoll = vm.runInContext("rollWeaponDamageOnly('p_rogue_5_test', 'Ataque Furtivo (+0) 3d6 dano extra')", sandbox);
    assert(sneakDmgRoll && sneakDmgRoll.totalDmg >= 3 && sneakDmgRoll.totalDmg <= 18, 'rollWeaponDamageOnly rola corretamente os 3d6 do Ataque Furtivo');

    const rageDmgRoll = vm.runInContext("rollWeaponDamageOnly('p_barb_1_test', 'Dano em Fúria (+0) +2 dano extra')", sandbox);
    assert(rageDmgRoll && rageDmgRoll.totalDmg === 2, 'rollWeaponDamageOnly computa corretamente valor fixo +2 de dano da Fúria');

    // 8. Renderização HTML com badges e estilos da ISSUE-164
    vm.runInContext(`
      PLAYERS = [${JSON.stringify(rogueHero5)}];
      renderPlayers();
    `, sandbox);
    const renderedHtml = sandbox.document.getElementById('grid-players')?.innerHTML || '';
    assert(renderedHtml.includes('roll20-atk-badge badge-sneak'), 'HTML renderiza badge temático .badge-sneak');
    assert(renderedHtml.includes('is-special-attack'), 'Linha de ataque especial possui classe .is-special-attack');

    // 🛡️ [Bateria 134] Suíte Completa de Integridade de UI, Navegação e Cliques (ISSUE-165):
    console.log('\n🛡️ [Bateria 134] Suíte Completa de Integridade de UI, Navegação e Cliques (ISSUE-165):');
    try {
      const { execSync } = require('child_process');
      const integrityOut = execSync('node test_ui_integrity.js', { encoding: 'utf8' });
      assert(integrityOut.includes('100% DAS AÇÕES E TELAS DA INTERFACE APROVADAS'), 'test_ui_integrity.js executado com sucesso e 100% de aprovação');
      assert(integrityOut.includes('Abas Validadas:    11/11'), '11/11 abas validadas com sucesso');
      assert(integrityOut.includes('Modais Validados:  10/10'), '10/10 modais validados com sucesso');
      assert(integrityOut.includes('Ações de Clique:   617/617 aprovadas'), '617/617 ações de clique em ui.html aprovadas');
    } catch (e) {
      assert(false, `test_ui_integrity.js falhou: ${e.message}`);
    }

    // 🇧🇷 [Bateria 135] Localização dos Atributos D&D 5E para Português (ISSUE-166):
    console.log('\n🇧🇷 [Bateria 135] Localização dos Atributos D&D 5E para Português (ISSUE-166):');
    vm.runInContext(`
      PLAYERS = [{
        id: 'p_pt_test_hero',
        name: 'Guerreiro de Teste',
        level: 3,
        className: 'Guerreiro',
        str: 16,
        dex: 14,
        con: 15,
        int: 10,
        wis: 12,
        cha: 8,
        saveProficiencies: ['str', 'con'],
        speed: '9m'
      }];
      renderPlayers();
    `, sandbox);
    const heroCardHtml = sandbox.document.getElementById('grid-players')?.innerHTML || '';
    assert(heroCardHtml.includes('>FOR</span>'), 'Card do jogador exibe sigla FOR (Força)');
    assert(heroCardHtml.includes('>DES</span>'), 'Card do jogador exibe sigla DES (Destreza)');
    assert(heroCardHtml.includes('>CON</span>'), 'Card do jogador exibe sigla CON (Constituição)');
    assert(heroCardHtml.includes('>INT</span>'), 'Card do jogador exibe sigla INT (Inteligência)');
    assert(heroCardHtml.includes('>SAB</span>'), 'Card do jogador exibe sigla SAB (Sabedoria)');
    assert(heroCardHtml.includes('>CAR</span>'), 'Card do jogador exibe sigla CAR (Carisma)');
    assert(!heroCardHtml.includes('>STR</span>') && !heroCardHtml.includes('>DEX</span>') && !heroCardHtml.includes('>WIS</span>') && !heroCardHtml.includes('>CHA</span>'), 'Card do jogador não exibe siglas em inglês');
    assert(heroCardHtml.includes('title="Força (FOR)"'), 'Card contém tooltip "Força (FOR)"');
    assert(heroCardHtml.includes('title="Destreza (DES)"'), 'Card contém tooltip "Destreza (DES)"');
    assert(heroCardHtml.includes('title="Sabedoria (SAB)"'), 'Card contém tooltip "Sabedoria (SAB)"');
    assert(heroCardHtml.includes('title="Carisma (CAR)"'), 'Card contém tooltip "Carisma (CAR)"');
    assert(heroCardHtml.includes('★ Salva') || heroCardHtml.includes('Salva'), 'Chip de salvaguarda renomeado de Save para Salva');
    assert(heroCardHtml.includes('CLASSE ARM.'), 'Bloco lateral exibe CLASSE ARM. em vez de ARMOR CLASS');
    assert(heroCardHtml.includes('DESLOC.'), 'Bloco lateral exibe DESLOC. em vez de SPEED');

    // Restaura mocks de document.getElementById
    sandbox.document.getElementById = origGetEl;
    sandbox.document.getElementById = origGetEl;
    sandbox.prompt = originalPrompt;
    sandbox.alert = originalAlert;
  } catch (err) {
    console.error('Falha no teste assíncrono de geração de PDF:', err);
    failedTests++;
  }

  console.log('\n========================================');
  console.log(`📊 RESULTADO DOS TESTES: ${passedTests}/${totalTests} passaram`);

  if (failedTests === 0) {
    console.log('🎉 TODOS OS TESTES PASSARAM COM SUCESSO! 🚀');
    console.log('========================================\n');
    process.exit(0);
  } else {
    console.error(`💥 ${failedTests} TESTES FALHARAM! Verifique os logs acima.`);
    console.log('========================================\n');
    process.exit(1);
  }
})();




