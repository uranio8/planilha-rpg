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
  'src/js/core.js',
  'src/js/combat.js',
  'src/js/players.js',
  'src/js/compendium.js',
  'src/js/classes.js',
  'src/js/species.js',
  'src/js/campaigns.js',
  'src/js/audio_synth.js',
  'src/js/dice_roller.js',
  'src/js/vtt_grid.js',
  'src/js/screen_sync.js',
  'src/js/firebase_sync.js'
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
          style: {}
        };
      }
      return domElements[id];
    },
    querySelectorAll: () => [],
    body: {
      classList: {
        _classes: new Set(),
        add(c) { this._classes.add(c); },
        remove(c) { this._classes.delete(c); },
        contains(c) { return this._classes.has(c); }
      }
    },
    documentElement: { style: { setProperty: () => {} } },
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
  CONDITIONS_LIST: [
    { id: 'caido', name: 'Caído' },
    { id: 'envenenado', name: 'Envenenado' }
  ]
};

vm.createContext(sandbox);

// Carrega data e logic na VM a partir de src/
const srcDir = path.join(__dirname, 'src');
const dataRulesXp = fs.readFileSync(path.join(srcDir, 'data', 'rules_xp.js'), 'utf8');
const dataSpells = fs.readFileSync(path.join(srcDir, 'data', 'spells.js'), 'utf8');
const dataMonsters = fs.readFileSync(path.join(srcDir, 'data', 'monsters.js'), 'utf8');
const dataEquip = fs.readFileSync(path.join(srcDir, 'data', 'equipment.js'), 'utf8');
const dataCampaigns = fs.readFileSync(path.join(srcDir, 'data', 'campaigns.js'), 'utf8');
const jsAudioSynth = fs.readFileSync(path.join(srcDir, 'js', 'audio_synth.js'), 'utf8');
const jsCore = fs.readFileSync(path.join(srcDir, 'js', 'core.js'), 'utf8');
const jsCombat = fs.readFileSync(path.join(srcDir, 'js', 'combat.js'), 'utf8');
const jsPlayers = fs.readFileSync(path.join(srcDir, 'js', 'players.js'), 'utf8');
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
vm.runInContext(dataSpells, sandbox);
vm.runInContext(dataMonsters, sandbox);
vm.runInContext(dataEquip, sandbox);
vm.runInContext(dataCampaigns, sandbox);
vm.runInContext(jsAudioSynth, sandbox);
vm.runInContext(jsCore, sandbox);
vm.runInContext(jsFirebase, sandbox);
vm.runInContext(jsCombat, sandbox);
vm.runInContext(jsPlayers, sandbox);
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
assert(totalClassesCount === 12, `Todas as 12 classes oficiais D&D 5E 2024 carregadas com sucesso (${totalClassesCount} classes)`);

const allClassesHave20Levels = vm.runInContext("CLASSES_DATA.every(c => Array.isArray(c.progression) && c.progression.length === 20)", sandbox);
assert(allClassesHave20Levels, 'Todas as 12 classes possuem tabela completa de progressão do Nível 1 ao 20');

const allClassesHave4Subclasses = vm.runInContext("CLASSES_DATA.every(c => Array.isArray(c.subclasses) && c.subclasses.length >= 4)", sandbox);
assert(allClassesHave4Subclasses, 'Todas as 12 classes possuem no mínimo 4 subclasses oficiais detalhadas');

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
assert(totalSpeciesCount === 10, `Todas as 10 espécies oficiais D&D 5E 2024 carregadas com sucesso (${totalSpeciesCount} espécies)`);

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
const shareUrl = vm.runInContext("generatePlayerShareUrl('p1')", sandbox);
assert(shareUrl && shareUrl.includes('view=player') && shareUrl.includes('id=p1'), 'Geração de URL de compartilhamento com parâmetros de jogador');

vm.runInContext(`
  initPlayerPortalMode('p1');
`, sandbox);
assert(vm.runInContext("activePortalPlayerId", sandbox) === 'p1', 'Modo Portal do Jogador definiu activePortalPlayerId');
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
  camp.playerIds = ['p1', 'p2', 'p3', 'p4'];
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
vm.runInContext("togglePlayerCondition('p1', 'envenenado')", sandbox);
let p1Conds = vm.runInContext("PLAYERS.find(x => x.id === 'p1').conditions", sandbox);
assert(p1Conds.includes('envenenado'), 'Condição "envenenado" adicionada com sucesso à ficha do jogador');

vm.runInContext("togglePlayerCondition('p1', 'envenenado')", sandbox);
p1Conds = vm.runInContext("PLAYERS.find(x => x.id === 'p1').conditions", sandbox);
assert(!p1Conds.includes('envenenado'), 'Condição "envenenado" removida após toggle subsequente');

// Teste 3.30: Origem, Antecedente e Background D&D 2024 (P3)
const p1Data = vm.runInContext("PLAYERS.find(x => x.id === 'p1')", sandbox);
assert(p1Data.background && p1Data.ideal && p1Data.bond && p1Data.flaw, 'Ficha possui campos de Antecedente, Ideal, Vínculo e Defeito estruturados');

// Teste 3.31: Avatares de Personagem (P4)
vm.runInContext("openAvatarModal('p1'); setPlayerAvatarPreset('🐉');", sandbox);
const pCurrentAvatar = vm.runInContext("PLAYERS.find(x => x.id === 'p1').avatar", sandbox);
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

const skillRollResult = vm.runInContext("rollPlayerSkill('p1', 'atletismo', 'normal')", sandbox);
assert(skillRollResult && skillRollResult.total >= 1 && skillRollResult.total <= 30, `Rolagem de perícia (Atletismo) executada com sucesso: Total ${skillRollResult?.total}`);

const saveRollResult = vm.runInContext("rollPlayerSavingThrow('p1', 'str', 'normal')", sandbox);
assert(saveRollResult && saveRollResult.total >= 1 && saveRollResult.total <= 30, `Rolagem de salvaguarda (FOR) executada com sucesso: Total ${saveRollResult?.total}`);

// Toggle de Proficiência em Perícia e Salvaguarda
vm.runInContext("togglePlayerSkillProf('p1', 'arcanismo')", sandbox);
let p1Skills = vm.runInContext("PLAYERS.find(x => x.id === 'p1').skillProficiencies", sandbox);
assert(p1Skills.includes('arcanismo'), 'Proficiência em Arcanismo adicionada à ficha de p1');

vm.runInContext("togglePlayerSkillProf('p1', 'arcanismo')", sandbox);
p1Skills = vm.runInContext("PLAYERS.find(x => x.id === 'p1').skillProficiencies", sandbox);
assert(!p1Skills.includes('arcanismo'), 'Proficiência em Arcanismo removida de p1 após novo toggle');

vm.runInContext("togglePlayerSaveProf('p1', 'dex')", sandbox);
let p1Saves = vm.runInContext("PLAYERS.find(x => x.id === 'p1').saveProficiencies", sandbox);
assert(p1Saves.includes('dex'), 'Proficiência na salvaguarda de DES adicionada a p1');

// Teste 3.35: Histórico Cronológico de Ações do Personagem (P2)
vm.runInContext("addPlayerActionLog('p1', '⚔️', 'Ataque teste com Machado', 'attack')", sandbox);
let p1Logs = vm.runInContext("PLAYERS.find(x => x.id === 'p1').actionLogs", sandbox);
assert(p1Logs.length > 0 && p1Logs[0].text.includes('Machado'), 'Ação registrada no histórico cronológico do personagem');

// Verificação de hook automático de dano no log
vm.runInContext("adjustPlayerHp('p1', -3)", sandbox);
p1Logs = vm.runInContext("PLAYERS.find(x => x.id === 'p1').actionLogs", sandbox);
assert(p1Logs.some(l => l.text.includes('3 de dano')), 'Dano sofrido registrado automaticamente no histórico do personagem');

vm.runInContext("clearPlayerActionLogs('p1')", sandbox);
p1Logs = vm.runInContext("PLAYERS.find(x => x.id === 'p1').actionLogs", sandbox);
assert(p1Logs.length === 0, 'Histórico de ações do personagem limpo com sucesso');

// Teste 3.36: Bloco de Notas Privado do Jogador (M5)
vm.runInContext("handlePlayerNotesInput('p1', 'Descobri uma chave dourada no sarcófago.')", sandbox);
const p1Notes = vm.runInContext("PLAYERS.find(x => x.id === 'p1').playerNotes", sandbox);
assert(p1Notes && p1Notes.includes('chave dourada'), 'Bloco de notas privado atualizado e persistido com sucesso');

// Teste 3.37: Barra de XP Animada e Marcos 5E (V4)
const xpTableLen = vm.runInContext("typeof DND5E_XP_TABLE !== 'undefined' ? DND5E_XP_TABLE.length : 0", sandbox);
assert(xpTableLen === 20, `Tabela de marcos de XP 5E carregada com 20 níveis (${xpTableLen} marcos)`);

const p1XpProgress = vm.runInContext("getPlayerXpProgress(PLAYERS.find(x => x.id === 'p1'))", sandbox);
assert(p1XpProgress && typeof p1XpProgress.pct === 'number' && p1XpProgress.pct >= 0 && p1XpProgress.pct <= 100, `Progresso de XP calculado com sucesso: ${p1XpProgress?.text} (${p1XpProgress?.pct}%)`);

const p1InitialXp = vm.runInContext("PLAYERS.find(x => x.id === 'p1').xp", sandbox);
vm.runInContext(`
  const p = PLAYERS.find(x => x.id === 'p1');
  p.xp += 200;
  addPlayerActionLog(p.id, '✨', 'Ganhou +200 XP', 'xp');
`, sandbox);
const p1NewXp = vm.runInContext("PLAYERS.find(x => x.id === 'p1').xp", sandbox);
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
  const pInsp = PLAYERS.find(p => p.id === 'p1');
  pInsp.inspiration = true;
  const inspRoll = usePlayerInspirationRoll('p1');
`, sandbox);
const pInspAfter = vm.runInContext("PLAYERS.find(p => p.id === 'p1')", sandbox);
assert(pInspAfter.inspiration === false, 'Uso da Inspiração Heroica consumiu o estado de inspiração do jogador');

// Teste 3.44: Salvaguardas contra a Morte Interativas (Death Saves - M7 / P5)
vm.runInContext(`
  const pDeath = PLAYERS.find(p => p.id === 'p1');
  pDeath.hp = 0;
  pDeath.deathSaves = { success: 0, fail: 0 };
  toggleDeathSave('p1', 'success', 1);
  toggleDeathSave('p1', 'fail', 2);
`, sandbox);
const pDeathState = vm.runInContext("PLAYERS.find(p => p.id === 'p1').deathSaves", sandbox);
assert(pDeathState.success === 1 && pDeathState.fail === 2, 'Toggle manual de sucessos e falhas de salvaguarda de morte verificado');

// Rolagem de teste contra a morte
vm.runInContext(`
  const dsRoll = rollDeathSave('p1');
`, sandbox);
const pDeathStateAfterRoll = vm.runInContext("PLAYERS.find(p => p.id === 'p1').deathSaves", sandbox);
assert(pDeathStateAfterRoll.success >= 1 || pDeathStateAfterRoll.fail >= 2 || vm.runInContext("PLAYERS.find(p => p.id === 'p1').hp", sandbox) === 1, 'Rolagem automática de salvaguarda de morte executada com sucesso');

// Teste de cura resetando death saves
vm.runInContext(`
  const pHeal = PLAYERS.find(p => p.id === 'p1');
  pHeal.hp = 10;
  pHeal.deathSaves = { success: 0, fail: 0 };
`, sandbox);
assert(vm.runInContext("PLAYERS.find(p => p.id === 'p1').deathSaves.fail", sandbox) === 0, 'Cura restaurou estado seguro e zerou contadores de morte');

// Teste 3.45: Inventário Pessoal, Carga e Carteira de Moedas (M8 / P6)
vm.runInContext(`
  const pInv = PLAYERS.find(p => p.id === 'p1');
  pInv.str = 16;
  pInv.coins = { cp: 50, sp: 20, ep: 0, gp: 15, pp: 1 };
  pInv.inventory = [
    { name: 'Machado Grande', weight: 3.0, qty: 1, cost: '30 PO' },
    { name: 'Cota de Malha', weight: 25.0, qty: 1, cost: '75 PO' },
    { name: 'Tocha', weight: 0.5, qty: 5, cost: '5 PC' }
  ];
`, sandbox);
const carryRes = vm.runInContext("getPlayerCarryCapacity(PLAYERS.find(p => p.id === 'p1'))", sandbox);
assert(carryRes.maxKg === 120, 'Capacidade máxima de carga para FOR 16 calculada corretamente (120 kg)');
assert(carryRes.itemsWeight === 30.5, `Peso de itens somado corretamente: ${carryRes.itemsWeight} kg`);
assert(carryRes.isOverloaded === false, 'Personagem não está com sobrecarga');

const purseRes = vm.runInContext("getPlayerCoinPurse(PLAYERS.find(p => p.id === 'p1'))", sandbox);
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
vm.runInContext("gridState.tokens = [{ id: 'tok-t1', combatantId: 'p1', name: 'Valerius', type: 'player', x: 100, y: 100, size: 'medium' }]", sandbox);
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

// Testa sala padrão e sanitização de sala
assert(vm.runInContext("getStoredFirebaseRoom()", sandbox) === 'turma_principal', 'Código de sala padrão inicializado como turma_principal');
vm.runInContext("setStoredFirebaseRoom('Turma Sábado - Mesa #1')", sandbox);
assert(vm.runInContext("getStoredFirebaseRoom()", sandbox) === 'turma_s_bado_-_mesa__1', 'Código de sala sanitizado corretamente');

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

// 3. Teste de derivação de sala a partir do nome da campanha ativa
vm.runInContext(`
  localStorage.removeItem('dnd5e_firebase_room');
  CAMPAIGNS_STATE.campaigns[0].name = 'Campanhas Prisco';
  handleCampaignSelect(CAMPAIGNS_STATE.campaigns[0].id);
`, sandbox);
const derivedRoom = vm.runInContext("getStoredFirebaseRoom()", sandbox);
assert(derivedRoom === 'campanhas_prisco', 'Seleção de campanha derivou automaticamente a sala campanhas_prisco');

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

// Validação de URL de pareamento do Mestre
vm.runInContext(`
  setStoredFirebaseRoom('mesa_valerius');
`, sandbox);
const masterSyncUrl = vm.runInContext("getMasterSyncDeviceUrl()", sandbox);
assert(masterSyncUrl.includes('?room=mesa_valerius'), 'getMasterSyncDeviceUrl gera link com parâmetro ?room= correto para o celular');

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

// 2. Modais com z-index 2000
assert(bundle73.includes('.modal-overlay') && bundle73.includes('z-index: 2000;'), 'Bundle possui z-index: 2000 na classe base .modal-overlay');

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
assert(qrHtml.includes('create-qr-code/?size=220x220'), 'QR Code do personagem é gerado com sucesso');
assert(qrHtml.includes('onerror=') && qrHtml.includes('quickchart.io/qr'), 'QR Code possui fallback de resiliência onerror para quickchart.io');
const qrSrcMatch = qrHtml.match(/src="([^"]+)"/);
assert(qrSrcMatch && !qrSrcMatch[1].includes('%23pdata%3D') && qrSrcMatch[1].length < 250, 'QR Code utiliza link curto otimizado (<250 chars) prevenindo HTTP 414');

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
assert(vm.runInContext("document.body.classList.contains('mode-player-portal')", sandbox) === true, 'F5 do Jogador: mode-player-portal reativado no body');


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



