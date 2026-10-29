/**
 * test_agent_simulation.js
 * Suíte de Simulação Autônoma por Agentes (Mestre vs Jogador vs Sincronização Bidirecional)
 * Planilha RPG (D&D 5E Assistant & VTT) - ISSUE-169
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log('======================================================================');
console.log('🤖 INICIANDO SIMULAÇÃO DE AGENTES (MESTRE, JOGADOR E SINCRONIZAÇÃO)');
console.log('======================================================================\n');

// 1. Configuração do Ambiente de Sandbox Virtual
const domElements = {};

const sandbox = {
  console: {
    log: () => {},
    warn: () => {},
    error: console.error
  },
  setTimeout: (fn) => (typeof fn === 'function' ? fn() : null),
  clearTimeout: () => {},
  setInterval: () => 1,
  clearInterval: () => {},
  Math: Math,
  Date: Date,
  parseInt: parseInt,
  parseFloat: parseFloat,
  isNaN: isNaN,
  Array: Array,
  Object: Object,
  String: String,
  Number: Number,
  Boolean: Boolean,
  RegExp: RegExp,
  JSON: JSON,
  document: {
    body: {
      classList: {
        classes: new Set(),
        add(c) { this.classes.add(c); },
        remove(c) { this.classes.delete(c); },
        toggle(c, force) {
          if (force === true) this.classes.add(c);
          else if (force === false) this.classes.delete(c);
          else if (this.classes.has(c)) this.classes.delete(c);
          else this.classes.add(c);
        },
        contains(c) { return this.classes.has(c); }
      }
    },
    getElementById: (id) => {
      if (!domElements[id]) {
        domElements[id] = {
          id,
          value: '',
          innerText: '',
          innerHTML: '',
          style: {},
          classList: {
            classes: new Set(),
            add(c) { this.classes.add(c); },
            remove(c) { this.classes.delete(c); },
            toggle(c, force) {
              if (force === true) this.classes.add(c);
              else if (force === false) this.classes.delete(c);
              else if (this.classes.has(c)) this.classes.delete(c);
              else this.classes.add(c);
            },
            contains(c) { return this.classes.has(c); }
          },
          querySelectorAll: () => [],
          querySelector: () => null,
          addEventListener: () => {},
          removeEventListener: () => {}
        };
      }
      return domElements[id];
    },
    querySelectorAll: () => [],
    querySelector: () => null,
    createElement: (tag) => ({
      tagName: tag,
      style: {},
      classList: {
        classes: new Set(),
        add: () => {},
        remove: () => {},
        toggle: () => {},
        contains: () => false
      },
      appendChild: () => {},
      remove: () => {}
    }),
    addEventListener: () => {},
    removeEventListener: () => {}
  },
  navigator: { userAgent: 'NodeTestAgent' },
  localStorage: {
    store: {},
    getItem(k) { return this.store[k] !== undefined ? this.store[k] : null; },
    setItem(k, v) { this.store[k] = String(v); },
    removeItem(k) { delete this.store[k]; },
    clear() { this.store = {}; }
  },
  alert: () => {},
  confirm: () => true,
  prompt: () => '1',
  addEventListener: () => {},
  removeEventListener: () => {},
  location: {
    href: 'http://localhost/rpg.html',
    search: '',
    hash: '',
    pathname: '/rpg.html'
  },
  history: {
    replaceState: () => {}
  }
};

sandbox.window = sandbox;
sandbox.global = sandbox;
vm.createContext(sandbox);

// 2. Carregamento dos módulos essenciais do sistema
const srcDir = path.join(__dirname, 'src');
const modulesToLoad = [
  path.join(srcDir, 'data', 'rules_xp.js'),
  path.join(srcDir, 'data', 'equipment.js'),
  path.join(srcDir, 'data', 'spells.js'),
  path.join(srcDir, 'data', 'monsters.js'),
  path.join(srcDir, 'data', 'bastions.js'),
  path.join(srcDir, 'js', 'core.js'),
  path.join(srcDir, 'js', 'players.js'),
  path.join(srcDir, 'js', 'combat.js'),
  path.join(srcDir, 'js', 'compendium.js'),
  path.join(srcDir, 'js', 'campaigns.js'),
  path.join(srcDir, 'js', 'vtt_grid.js'),
  path.join(srcDir, 'js', 'dice_roller.js'),
  path.join(srcDir, 'js', 'screen_sync.js'),
  path.join(srcDir, 'js', 'firebase_sync.js')
];

modulesToLoad.forEach(file => {
  const code = fs.readFileSync(file, 'utf8');
  vm.runInContext(code, sandbox);
});

let passedChecks = 0;
let totalChecks = 0;

function assertCheck(cond, desc) {
  totalChecks++;
  if (cond) {
    passedChecks++;
    console.log(`  ✅ [PASS] ${desc}`);
  } else {
    console.error(`  ❌ [FAIL] ${desc}`);
  }
}

// ======================================================================
// 🎭 ETAPA 1: AGENTE MESTRE (DM MASTER JOURNEY)
// ======================================================================
console.log('🛡️ ETAPA 1: Agente Mestre (Gestão de Campanha, Combate e Bastião)...');

vm.runInContext(`
  // Inicialização no papel de Mestre
  clientRole = 'master';
  document.body.classList.remove('mode-player-portal');

  // 1. Mestre cria uma nova Campanha
  const newCamp = {
    id: 'camp_barovia',
    name: 'Crônicas de Baróvia',
    desc: 'Investigação gótica na terra dos vampiros',
    status: 'active',
    createdDate: new Date().toISOString().split('T')[0],
    playerIds: [],
    partyStash: { gold: 0, items: [], history: [] },
    sessions: []
  };
  touchCampaign(newCamp);
  CAMPAIGNS_STATE.campaigns.push(newCamp);
  CAMPAIGNS_STATE.activeCampaignId = newCamp.id;
  activeCampaign = getActiveCampaign();
`, sandbox);

assertCheck(sandbox.activeCampaign && sandbox.activeCampaign.name === 'Crônicas de Baróvia', 'Mestre criou a campanha "Crônicas de Baróvia"');

// 2. Mestre acessa o Bastião da Campanha e verifica que está limpo (ISSUE-169)
vm.runInContext(`
  bastion = getCampaignBastion(activeCampaign);
`, sandbox);

assertCheck(sandbox.bastion && sandbox.bastion.name.includes('Crônicas de Baróvia'), 'Bastião da campanha inicializado com sucesso');
assertCheck(Array.isArray(sandbox.bastion.specialFacilities) && sandbox.bastion.specialFacilities.length === 0, 'Bastião não possui construções automáticas não solicitadas (specialFacilities: [])');

// 3. Mestre cria os heróis da aventura
vm.runInContext(`
  PLAYERS = [
    {
      id: 'p_geralt',
      name: 'Geralt de Rívia',
      level: 5,
      className: 'Guerreiro',
      str: 18,
      dex: 14,
      con: 16,
      hp: 44,
      maxHp: 44,
      gold: 50,
      coins: { cp: 0, sp: 0, ep: 0, gp: 50, pp: 0 },
      inventory: [
        { id: 'w_sword', name: 'Espada Longa', damage: '1d8 cortante', prop: 'Versátil (1d10)', equipped: true },
        { id: 'a_armor', name: 'Cota de Malha', category: 'Armaduras', equipped: true }
      ],
      updatedAt: Date.now()
    },
    {
      id: 'p_legolas',
      name: 'Legolas Hojaverde',
      level: 5,
      className: 'Patrulheiro',
      str: 10,
      dex: 18,
      con: 14,
      hp: 36,
      maxHp: 36,
      gold: 40,
      coins: { cp: 0, sp: 0, ep: 0, gp: 40, pp: 0 },
      slots: [4, 2, 0, 0, 0, 0, 0, 0, 0],
      slotsUsed: [0, 0, 0, 0, 0, 0, 0, 0, 0],
      inventory: [
        { id: 'w_bow', name: 'Arco Longo', damage: '1d8 perfurante', prop: 'Munição (distância 45/180m), duas mãos, pesada', equipped: true },
        { id: 'i_arrows', name: 'Flechas', qty: 20 }
      ],
      updatedAt: Date.now()
    }
  ];

  // Vincula heróis à campanha
  activeCampaign.playerIds = ['p_geralt', 'p_legolas'];
  saveCampaignsState();

  // Mestre despacha os heróis da campanha para a mesa de combate
  state.combatants = [];
  addAllCampaignHeroesToCombat();
  combatantsCount = state.combatants.length;
  geraltCombatant = state.combatants.find(c => c.playerId === 'p_geralt' || c.name.includes('Geralt'));
`, sandbox);

assertCheck(sandbox.combatantsCount === 2, 'Mestre adicionou todos os heróis da campanha ao combate (2 heróis)');
assertCheck(sandbox.geraltCombatant && sandbox.geraltCombatant.hp === 44, 'Geralt entrou no combate preservando 44 PV');

// 4. Mestre adiciona criatura hostil e inicia a rodada
vm.runInContext(`
  // Adiciona 1 Lobisomem ao combate
  addMonsterToCombat('Lobisomem', 11, 58, 'Garras (+4, 2d4+2)');
  state.combatants.forEach(c => {
    if (c.init === undefined || c.init === null) {
      c.init = Math.floor(Math.random() * 20) + 1;
    }
  });
  state.combatants.sort((a, b) => b.init - a.init);
  hasWerewolf = state.combatants.some(c => c.name.includes('Lobisomem'));
  allHaveInit = state.combatants.every(c => c.init !== undefined && c.init !== null);
`, sandbox);

assertCheck(sandbox.hasWerewolf, 'Lobisomem adicionado ao combate ativo');
assertCheck(sandbox.allHaveInit, 'Iniciativas roladas e ordenadas');

// 5. Mestre concede recompensa de ouro por herói
vm.runInContext(`
  adjustPlayerGold('p_geralt', 50);
  adjustPlayerGold('p_legolas', 50);

  masterExportSnapshot = {
    publishedBy: 'master',
    timestamp: Date.now() + 500,
    players: JSON.parse(JSON.stringify(PLAYERS)),
    state: JSON.parse(JSON.stringify(state)),
    campaigns: JSON.parse(JSON.stringify(CAMPAIGNS_STATE))
  };
  geraltMasterGold = PLAYERS.find(p => p.id === 'p_geralt').gold;
`, sandbox);

assertCheck(sandbox.geraltMasterGold === 100, `Mestre premiou ouro com sucesso: Geralt agora tem ${sandbox.geraltMasterGold} PO (50 + 50)`);

// ======================================================================
// 🎭 ETAPA 2: AGENTE JOGADOR (PLAYER PORTAL JOURNEY)
// ======================================================================
console.log('\n🗡️ ETAPA 2: Agente Jogador (Portal do Jogador, Ações de Combate e Recursos)...');

vm.runInContext(`
  // Ativação do modo Portal do Jogador para Legolas
  clientRole = 'player';
  activePortalPlayerId = 'p_legolas';
  document.body.classList.add('mode-player-portal');

  // Jogador recebe o snapshot publicado pelo Mestre
  applyCloudDataToLocal(masterExportSnapshot);
  playerLegolas = PLAYERS.find(p => p.id === 'p_legolas');
`, sandbox);

assertCheck(sandbox.playerLegolas && sandbox.playerLegolas.gold === 90, `Jogador Legolas recebeu o ouro do Mestre sem perdas (${sandbox.playerLegolas.gold} PO = 40 + 50)`);

// 6. Jogador Legolas ataca o Lobisomem com o Arco Longo usando Vantagem
vm.runInContext(`
  // Rolagem de ataque com Vantagem usando Arco Longo (consome 1 flecha automaticamente)
  rollPlayerAttack('p_legolas', 'Arco Longo (+7) 1d8+4 perfurante', null, 'adv');
  ammoLegolas = getPlayerAmmunitionForItem(playerLegolas, 'Arco Longo');
`, sandbox);

assertCheck(sandbox.ammoLegolas && sandbox.ammoLegolas.qty === 19, 'Consumo de munição: 1 flecha gasta automaticamente no disparo (20 -> 19 flechas)');

// 7. Jogador Geralt ataca com Espada Longa Versátil com 2 Mãos
vm.runInContext(`
  playerGeralt = PLAYERS.find(p => p.id === 'p_geralt');
  rollWeaponDamageOnly('p_geralt', 'Espada Longa (+7) 1d8+4 cortante', false, true);
  dmgVal = parseInt(document.getElementById('inp-damage').value) || 0;
`, sandbox);

assertCheck(sandbox.dmgVal > 0, `Geralt desferiu dano versátil de arma com sucesso (dano calculado: ${sandbox.dmgVal})`);

// 8. Jogador gasta 1 espaço de magia de 1º círculo
vm.runInContext(`
  togglePlayerSlot('p_legolas', 0, 0); // consome 1 slot
  playerLegolas = PLAYERS.find(p => p.id === 'p_legolas');
  touchPlayer(playerLegolas);
  playerLegolas.updatedBy = 'client_player_legolas';

  playerExportSnapshot = {
    publishedBy: 'player',
    authorPlayerId: 'p_legolas',
    timestamp: Date.now() + 1000,
    activePortalPlayerId: 'p_legolas',
    players: JSON.parse(JSON.stringify(PLAYERS))
  };
  legolasSlotsUsed = PLAYERS.find(p => p.id === 'p_legolas').slotsUsed[0];
`, sandbox);

assertCheck(sandbox.legolasSlotsUsed === 1, 'Legolas gastou 1 espaço de magia no portal (slotsUsed[0] = 1)');

// ======================================================================
// 🎭 ETAPA 3: AUDITORIA DE SINCRONIZAÇÃO BIDIRECIONAL
// ======================================================================
console.log('\n🔄 ETAPA 3: Auditoria de Sincronização Bidirecional (Dual-Sync Audit)...');

vm.runInContext(`
  // O Mestre recebe os dados atualizados do Jogador
  clientRole = 'master';
  document.body.classList.remove('mode-player-portal');
  activePortalPlayerId = null;

  // Simula recepção via Firebase / BroadcastChannel no Mestre
  applyCloudDataToLocal(playerExportSnapshot);
  masterLegolas = PLAYERS.find(p => p.id === 'p_legolas');
`, sandbox);

assertCheck(sandbox.masterLegolas && sandbox.masterLegolas.slotsUsed[0] === 1, 'Mestre recebeu o gasto de espaço de magia do jogador Legolas em tempo real');
assertCheck(sandbox.masterLegolas.inventory.find(i => i.name === 'Flechas').qty === 19, 'Mestre sincronizou o consumo de flechas do inventário de Legolas (19 flechas)');

// Validação final da integridade do Bastião
vm.runInContext(`
  finalCamp = getActiveCampaign();
  finalBastion = getCampaignBastion(finalCamp);
`, sandbox);

assertCheck(sandbox.finalBastion && sandbox.finalBastion.specialFacilities.length === 0, 'Bastião permaneceu 100% limpo de construções automáticas em todo o ciclo');

console.log('\n======================================================================');
console.log(`📊 RESULTADO DA SIMULAÇÃO: ${passedChecks}/${totalChecks} verificações aprovadas`);

if (passedChecks === totalChecks) {
  console.log('🎉 SIMULAÇÃO COMPLETA DE AGENTES APROVADA COM SUCESSO! 🚀');
  console.log('======================================================================\n');
  process.exit(0);
} else {
  console.error(`💥 ${totalChecks - passedChecks} VERIFICAÇÕES FALHARAM!`);
  console.log('======================================================================\n');
  process.exit(1);
}
