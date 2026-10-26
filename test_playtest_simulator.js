/**
 * 🎲 SIMULADOR DE MESA MULTI-AGENTE (PLAYTEST SIMULATOR)
 * D&D 5E Assistant & VTT - Planilha RPG
 * 
 * Simula sessões autônomas de jogo com:
 * 1. DMAgent (Agente Mestre de Masmorras)
 * 2. PlayerAgent (Agentes Jogadores com Personas Arquetípicas: Mago, Guerreiro)
 * 3. PlaytestSimulator (Orquestrador de Sessão, Sincronização & Auditoria Visual)
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

/**
 * Cria ambiente simulado de navegador idêntico ao test_runner.js
 */
function createPlaytestSandbox() {
  const domElements = {};

  const getOrCreateEl = (id) => {
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
        querySelectorAll: () => [],
        querySelector: () => null,
        appendChild: () => {},
        setAttribute: (k, v) => { domElements[id][k] = v; },
        getAttribute: (k) => domElements[id][k] || null,
        addEventListener: () => {},
        removeEventListener: () => {}
      };
    }
    return domElements[id];
  };

  const sandbox = {
    console: { log: () => {}, warn: () => {}, error: () => {} },
    document: {
      getElementById: (id) => getOrCreateEl(id),
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
          addEventListener: () => {},
          removeEventListener: () => {}
        };
        return el;
      },
      querySelector: (sel) => {
        if (sel && sel.startsWith('#')) return getOrCreateEl(sel.slice(1));
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
        style: {},
        appendChild: () => {}
      },
      documentElement: { style: { setProperty: () => {} } },
      getElementsByName: () => [],
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
      history: { replaceState: () => {} },
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
      setItem(k, v) { this.data[k] = String(v); },
      getItem(k) { return this.data[k] || null; },
      removeItem(k) { delete this.data[k]; },
      clear() { this.data = {}; }
    },
    prompt: (msg, def) => (def !== undefined ? String(def) : '10'),
    confirm: () => true,
    alert: () => {},
    setTimeout: (fn) => fn(),
    clearTimeout: () => {},
    setInterval: () => 1,
    clearInterval: () => {},
    Buffer: Buffer,
    atob: (str) => Buffer.from(str, 'base64').toString('binary'),
    btoa: (str) => Buffer.from(str, 'binary').toString('base64'),
    CONDITIONS_LIST: [
      { id: 'caido', name: 'Caído' },
      { id: 'envenenado', name: 'Envenenado' }
    ],
    BroadcastChannel: function(name) {
      return {
        name,
        postMessage: () => {},
        onmessage: null,
        close: () => {}
      };
    },
    navigator: { vibrate: () => {} },
    addEventListener: () => {},
    removeEventListener: () => {}
  };

  sandbox.global = sandbox;
  sandbox.globalThis = sandbox;

  vm.createContext(sandbox);

  // Carrega fontes de src/
  const srcDir = path.join(__dirname, 'src');
  const filesToLoad = [
    path.join(srcDir, 'data', 'rules_xp.js'),
    path.join(srcDir, 'data', 'feats.js'),
    path.join(srcDir, 'data', 'spells.js'),
    path.join(srcDir, 'data', 'monsters.js'),
    path.join(srcDir, 'data', 'equipment.js'),
    path.join(srcDir, 'data', 'classes.js'),
    path.join(srcDir, 'data', 'species.js'),
    path.join(srcDir, 'data', 'campaigns.js'),
    path.join(srcDir, 'data', 'hirelings.js'),
    path.join(srcDir, 'data', 'bastions.js'),
    path.join(srcDir, 'js', 'audio_synth.js'),
    path.join(srcDir, 'js', 'qrcode_lib.js'),
    path.join(srcDir, 'js', 'core.js'),
    path.join(srcDir, 'js', 'combat.js'),
    path.join(srcDir, 'js', 'players.js'),
    path.join(srcDir, 'js', 'compendium.js'),
    path.join(srcDir, 'js', 'classes.js'),
    path.join(srcDir, 'js', 'species.js'),
    path.join(srcDir, 'js', 'campaigns.js'),
    path.join(srcDir, 'js', 'dice_roller.js'),
    path.join(srcDir, 'js', 'vtt_grid.js'),
    path.join(srcDir, 'js', 'screen_sync.js'),
    path.join(srcDir, 'js', 'firebase_sync.js')
  ];

  filesToLoad.forEach(f => {
    if (fs.existsSync(f)) {
      const code = fs.readFileSync(f, 'utf8');
      vm.runInContext(code, sandbox);
    }
  });

  return { sandbox, domElements };
}

/**
 * 🏰 DMAgent: Agente que simula o papel do Mestre de Jogo
 */
class DMAgent {
  constructor(sandbox) {
    this.sandbox = sandbox;
    this.name = 'Mestre Arcano';
    this.encounterRounds = 0;
  }

  /**
   * Adiciona monstros ao combate ativo a partir do bestiário
   */
  spawnMonsterEncounter(monsterName, count = 1) {
    return vm.runInContext(`
      (() => {
        const added = [];
        const m = (typeof MONSTERS_DATA !== 'undefined' ? MONSTERS_DATA : []).find(x => 
          x.name.toLowerCase().includes('${monsterName.toLowerCase()}')
        ) || { name: '${monsterName}', hp: 15, ca: 13, cr: '1/4' };

        for (let i = 1; i <= ${count}; i++) {
          const cId = 'mob_' + Date.now() + '_' + i;
          const combatant = {
            id: cId,
            name: ${count} > 1 ? (m.name + ' ' + i) : m.name,
            hp: m.hp,
            maxHp: m.hp,
            ca: m.ca || 12,
            type: 'monster',
            init: Math.floor(Math.random() * 20) + 1,
            conditions: []
          };
          COMBATANTS.push(combatant);
          if (typeof state !== 'undefined' && state.combatants && state.combatants !== COMBATANTS) {
            state.combatants.push(combatant);
          }
          added.push(combatant);
        }
        if (typeof sortCombatants === 'function') sortCombatants();
        if (typeof renderCombat === 'function') renderCombat();
        return added;
      })();
    `, this.sandbox);
  }

  /**
   * Rola iniciativas de todos os participantes e inicia o combate
   */
  startCombat() {
    this.encounterRounds = 1;
    return vm.runInContext(`
      (() => {
        combatActive = true;
        currentTurn = 0;
        currentRound = 1;
        if (typeof sortCombatants === 'function') sortCombatants();
        if (typeof renderCombat === 'function') renderCombat();
        return { combatActive, currentRound };
      })();
    `, this.sandbox);
  }

  /**
   * Aplica dano a alvos específicos
   */
  applyDamage(targetId, amount) {
    return vm.runInContext(`
      (() => {
        const list = (typeof COMBATANTS !== 'undefined' && COMBATANTS.length) ? COMBATANTS : ((typeof state !== 'undefined' && state.combatants) ? state.combatants : []);
        const target = list.find(c => c.id === '${targetId}' || c.playerId === '${targetId}');
        if (target) {
          target.hp = Math.max(0, target.hp - ${amount});
          if (target.type === 'player' || target.playerId) {
            const pId = target.playerId || target.id;
            const p = PLAYERS.find(x => x.id === pId);
            if (p) p.hp = target.hp;
          }
          if (typeof renderCombat === 'function') renderCombat();
          if (typeof renderPlayers === 'function') renderPlayers();
          return { targetName: target.name, remainingHp: target.hp };
        }
        return null;
      })();
    `, this.sandbox);
  }

  /**
   * Concede recompensas de XP e Moedas aos heróis
   */
  distributeBatchRewards(xpAmount, goldAmount, playerIds = []) {
    return vm.runInContext(`
      (() => {
        const targets = PLAYERS.filter(p => !${playerIds.length} || ${JSON.stringify(playerIds)}.includes(p.id));
        const shareGold = targets.length > 0 ? Math.floor(${goldAmount} / targets.length) : 0;
        const shareXp = targets.length > 0 ? Math.floor(${xpAmount} / targets.length) : 0;

        targets.forEach(p => {
          p.xp = (parseInt(p.xp, 10) || 0) + shareXp;
          if (!p.coins) p.coins = { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 };
          p.coins.gp = (parseInt(p.coins.gp, 10) || 0) + shareGold;
          p.gold = p.coins.gp;
        });

        if (typeof renderPlayers === 'function') renderPlayers();
        return { beneficiaries: targets.length, shareGold, shareXp };
      })();
    `, this.sandbox);
  }

  /**
   * Deposita tesouro ou item no Baú do Grupo
   */
  depositToPartyStash(itemName, qty = 1, gold = 0) {
    return vm.runInContext(`
      (() => {
        const camp = typeof getActiveCampaign === 'function' ? getActiveCampaign() : null;
        if (camp) {
          if (!camp.partyStash) camp.partyStash = { items: [], gold: 0 };
          camp.partyStash.gold = (camp.partyStash.gold || 0) + ${gold};
          if ('${itemName}') {
            const existing = camp.partyStash.items.find(i => i.name.toLowerCase() === '${itemName.toLowerCase()}');
            if (existing) {
              existing.qty = (existing.qty || 1) + ${qty};
            } else {
              camp.partyStash.items.push({ name: '${itemName}', qty: ${qty}, weight: '0.5 kg' });
            }
          }
          if (typeof saveCampaignsState === 'function') saveCampaignsState();
          return { totalGold: camp.partyStash.gold, itemCount: camp.partyStash.items.length };
        }
        return null;
      })();
    `, this.sandbox);
  }
}

/**
 * 🧙‍♂️ PlayerAgent: Agente que simula um jogador com uma persona tática
 */
class PlayerAgent {
  constructor(sandbox, playerId, persona = 'wizard') {
    this.sandbox = sandbox;
    this.playerId = playerId;
    this.persona = persona; // 'wizard' | 'warrior'
    this.actionHistory = [];
  }

  /**
   * Obtém os dados do jogador a partir do estado global
   */
  getData() {
    return vm.runInContext(`
      PLAYERS.find(p => p.id === '${this.playerId}') || null;
    `, this.sandbox);
  }

  /**
   * Prepara uma lista de magias respeitando as regras do D&D 5E
   */
  prepareSpells(spellNames = []) {
    return vm.runInContext(`
      (() => {
        const p = PLAYERS.find(x => x.id === '${this.playerId}');
        if (!p) return false;
        if (!p.preparedSpells) p.preparedSpells = [];

        ${JSON.stringify(spellNames)}.forEach(spName => {
          if (!p.preparedSpells.includes(spName)) {
            p.preparedSpells.push(spName);
          }
        });
        if (typeof renderPlayers === 'function') renderPlayers();
        return p.preparedSpells;
      })();
    `, this.sandbox);
  }

  /**
   * Lança uma magia consumindo o espaço correspondente
   */
  castSpell(spellName, circle = 1, isConcentration = false) {
    return vm.runInContext(`
      (() => {
        const p = PLAYERS.find(x => x.id === '${this.playerId}');
        if (!p) return { success: false, reason: 'Player not found' };

        if (!p.spellSlots) {
          if (typeof ensurePlayerSpellSlots === 'function') ensurePlayerSpellSlots(p);
        }

        const slotIdx = ${circle} - 1;
        if (p.spellSlots && p.spellSlots[slotIdx] && p.spellSlots[slotIdx].current > 0) {
          p.spellSlots[slotIdx].current -= 1;
          
          if (${isConcentration}) {
            p.concentration = {
              spellName: '${spellName}',
              startedAt: Date.now()
            };
          }

          if (typeof renderPlayers === 'function') renderPlayers();
          return {
            success: true,
            spell: '${spellName}',
            circle: ${circle},
            slotsRemaining: p.spellSlots[slotIdx].current,
            isConcentrating: !!p.concentration
          };
        }
        return { success: false, reason: 'Sem slots de magia disponíveis no círculo ' + ${circle} };
      })();
    `, this.sandbox);
  }

  /**
   * Equipa ou desequipa um item do inventário
   */
  toggleEquipItem(itemIndex) {
    return vm.runInContext(`
      (() => {
        const p = PLAYERS.find(x => x.id === '${this.playerId}');
        if (p && p.inventory && p.inventory[${itemIndex}]) {
          p.inventory[${itemIndex}].equipped = !p.inventory[${itemIndex}].equipped;
          if (typeof renderPlayers === 'function') renderPlayers();
          return p.inventory[${itemIndex}].equipped;
        }
        return null;
      })();
    `, this.sandbox);
  }

  /**
   * Consome uma poção ou item da mochila
   */
  useHealingPotion() {
    return vm.runInContext(`
      (() => {
        const p = PLAYERS.find(x => x.id === '${this.playerId}');
        if (!p || !p.inventory) return null;

        const potIdx = p.inventory.findIndex(i => (i.name || '').toLowerCase().includes('poção de cura') && (i.qty || 0) > 0);
        if (potIdx >= 0) {
          p.inventory[potIdx].qty -= 1;
          const heal = Math.floor(Math.random() * 4) + Math.floor(Math.random() * 4) + 2; // 2d4 + 2
          p.hp = Math.min(p.maxHp, (p.hp || 0) + heal);

          const comb = COMBATANTS.find(c => c.id === p.id);
          if (comb) comb.hp = p.hp;

          if (typeof renderPlayers === 'function') renderPlayers();
          if (typeof renderCombat === 'function') renderCombat();
          return { healed: heal, newHp: p.hp, potionsLeft: p.inventory[potIdx].qty };
        }
        return null;
      })();
    `, this.sandbox);
  }

  /**
   * Decide e executa a melhor ação tática durante o seu turno de combate
   */
  takeTacticalTurn(enemyId) {
    const data = this.getData();
    if (!data) return { action: 'skip', reason: 'no data' };

    // Se o PV estiver criticamente baixo (< 35%), tenta usar poção
    if (data.hp && data.maxHp && (data.hp / data.maxHp) <= 0.35) {
      const healResult = this.useHealingPotion();
      if (healResult) {
        this.actionHistory.push({ round: this.actionHistory.length + 1, action: 'heal', healResult });
        return { action: 'heal', result: healResult };
      }
    }

    // Persona Mago: Tenta lançar magia de dano ou controle
    if (this.persona === 'wizard') {
      const castResult = this.castSpell('Mísseis Mágicos', 1, false);
      if (castResult.success) {
        this.actionHistory.push({ round: this.actionHistory.length + 1, action: 'cast', castResult });
        return { action: 'cast', result: castResult };
      }
    }

    // Persona Guerreiro ou fallback de ataque
    return vm.runInContext(`
      (() => {
        const p = PLAYERS.find(x => x.id === '${this.playerId}');
        const enemy = COMBATANTS.find(c => c.id === '${enemyId}');
        if (enemy) {
          const d8 = Math.floor(Math.random() * 8) + 1;
          const dmg = d8 + 3; // 1d8 + 3 (mínimo 4, máximo 11)
          enemy.hp = Math.max(0, enemy.hp - dmg);
          if (typeof renderCombat === 'function') renderCombat();
          return { action: 'attack', weapon: 'Espada Longa', damage: dmg, enemyRemainingHp: enemy.hp };
        }
        return { action: 'idle' };
      })();
    `, this.sandbox);
  }
}

/**
 * 🕹️ PlaytestSimulator: Orquestrador da simulação completa de sessão
 */
class PlaytestSimulator {
  constructor() {
    const env = createPlaytestSandbox();
    this.sandbox = env.sandbox;
    this.domElements = env.domElements;
    this.dm = new DMAgent(this.sandbox);
    this.players = [];
    this.auditResults = [];
  }

  /**
   * Inicializa um cenário de aventura com heróis e monstros
   */
  setupScenario(scenarioName = 'Cripta dos Esqueletos') {
    // 1. Cria herói Mago e Guerreiro
    vm.runInContext(`
      PLAYERS = [
        {
          id: 'hero_wizard_1',
          name: 'Eldrin, o Mago',
          className: 'Mago',
          level: 3,
          str: 10, dex: 14, con: 12, int: 16, wis: 13, cha: 8,
          hp: 18,
          maxHp: 18,
          ca: 12,
          speed: '9m',
          gold: 25,
          coins: { cp: 0, sp: 0, ep: 0, gp: 25, pp: 0 },
          preparedSpells: ['Mísseis Mágicos', 'Armadura Arcana', 'Passo Nebuloso'],
          spellbookSpells: ['Mísseis Mágicos', 'Armadura Arcana', 'Passo Nebuloso', 'Detectar Magia', 'Raio de Fogo'],
          spellSlots: [
            { circle: 1, current: 4, total: 4 },
            { circle: 2, current: 2, total: 2 }
          ],
          inventory: [
            { name: 'Grimório de Couro', weight: '1.5 kg', qty: 1, equipped: false },
            { name: 'Poção de Cura', weight: '0.2 kg', qty: 2, equipped: false, category: 'Poção' }
          ]
        },
        {
          id: 'hero_fighter_1',
          name: 'Krag, o Guerreiro',
          className: 'Guerreiro',
          level: 3,
          str: 16, dex: 12, con: 15, int: 9, wis: 11, cha: 10,
          hp: 28,
          maxHp: 28,
          ca: 16,
          speed: '9m',
          gold: 15,
          coins: { cp: 0, sp: 0, ep: 0, gp: 15, pp: 0 },
          inventory: [
            { name: 'Espada Longa (Longsword)', weight: '1,5 kg', qty: 1, equipped: true },
            { name: 'Cota de Malha', weight: '25 kg', qty: 1, equipped: true, category: 'Armadura' },
            { name: 'Escudo', weight: '3 kg', qty: 1, equipped: true, category: 'Escudo' },
            { name: 'Poção de Cura', weight: '0.2 kg', qty: 1, equipped: false, category: 'Poção' }
          ]
        }
      ];

      CAMPAIGNS_STATE = {
        activeCampaignId: 'camp_crypt',
        campaigns: [
          {
            id: 'camp_crypt',
            title: '${scenarioName}',
            playerIds: ['hero_wizard_1', 'hero_fighter_1'],
            partyStash: { gold: 120, items: [] }
          }
        ]
      };

      COMBATANTS = [
        { id: 'hero_wizard_1', name: 'Eldrin, o Mago', hp: 18, maxHp: 18, ca: 12, type: 'player', init: 14, conditions: [] },
        { id: 'hero_fighter_1', name: 'Krag, o Guerreiro', hp: 28, maxHp: 28, ca: 16, type: 'player', init: 11, conditions: [] }
      ];
      if (typeof state !== 'undefined') {
        state.combatants = COMBATANTS;
      }
      if (typeof renderPlayers === 'function') renderPlayers();
    `, this.sandbox);

    const wizardAgent = new PlayerAgent(this.sandbox, 'hero_wizard_1', 'wizard');
    const warriorAgent = new PlayerAgent(this.sandbox, 'hero_fighter_1', 'warrior');
    this.players = [wizardAgent, warriorAgent];

    return { wizard: wizardAgent, warrior: warriorAgent };
  }

  /**
   * Executa a auditoria de layout, colisões de texto e sanitização
   */
  auditLayoutAndSanitation() {
    const checks = [];

    // 1. Renderiza o DOM completo
    vm.runInContext(`
      activePortalPlayerId = null;
      if (document.getElementById('filter-player-q')) document.getElementById('filter-player-q').value = '';
      if (typeof renderPlayers === 'function') renderPlayers();
      if (typeof renderCombat === 'function') renderCombat();
    `, this.sandbox);

    const playersHtml = this.sandbox.document.getElementById('grid-players')?.innerHTML || '';
    const combatHtml = this.sandbox.document.getElementById('list-combatants')?.innerHTML || '';
    const fullHtml = playersHtml + '\n' + combatHtml;

    // Checagem de duplicações indesejadas
    const hasKgKg = fullHtml.includes('kgkg');
    checks.push({ test: 'Ausência de repetição "kgkg"', passed: !hasKgKg });

    const hasUndefined = fullHtml.includes('undefined') && !fullHtml.includes('typeof');
    checks.push({ test: 'Ausência de literal "undefined" na interface', passed: !hasUndefined });

    const hasNaN = fullHtml.includes('NaN');
    checks.push({ test: 'Ausência de valores numéricos "NaN"', passed: !hasNaN });

    // Checagem de botões essenciais
    const hasEquipBadge = fullHtml.includes('btn-item-equip-badge');
    checks.push({ test: 'Badge ergonômico .btn-item-equip-badge presente', passed: hasEquipBadge });

    const hasActionsCell = fullHtml.includes('inventory-item-actions');
    checks.push({ test: 'Container estruturado .inventory-item-actions presente', passed: hasActionsCell });

    this.auditResults = checks;
    return checks;
  }

  /**
   * Executa a simulação completa do encontro
   */
  runFullSession(rounds = 3) {
    const log = [];
    log.push(`=== INÍCIO DA SESSÃO MULTI-AGENTE D&D 5E ===`);

    // 1. Setup
    this.setupScenario();
    log.push(`[SETUP] Cenário configurado com 2 heróis (Eldrin, o Mago e Krag, o Guerreiro).`);

    // 2. Mestre convoca monstros
    const monsters = this.dm.spawnMonsterEncounter('Esqueleto', 2);
    log.push(`[DM] Mestre invocou ${monsters.length} Esqueletos na iniciativa.`);

    // 3. Adiciona jogadores ao combate
    vm.runInContext(`
      if (typeof addAllPlayersToCombat === 'function') addAllPlayersToCombat();
    `, this.sandbox);
    this.dm.startCombat();
    log.push(`[DM] Iniciativas roladas e combate iniciado.`);

    // 4. Executa rodadas de combate
    for (let r = 1; r <= rounds; r++) {
      log.push(`\n--- RODADA ${r} ---`);

      // Mestre desfere ataque contra o Guerreiro
      const dmAtk = this.dm.applyDamage('hero_fighter_1', 6);
      if (dmAtk) {
        log.push(`[DM] Esqueleto atacou ${dmAtk.targetName} causando 6 de dano (PV restante: ${dmAtk.remainingHp}).`);
      }

      // Mago conjura magia
      const wizard = this.players[0];
      const targetEnemy = monsters[0] ? monsters[0].id : null;
      const wizAction = wizard.takeTacticalTurn(targetEnemy);
      log.push(`[JOGADOR 1 - Mago] Ação: ${wizAction.action} (${JSON.stringify(wizAction.result || {})})`);

      // Guerreiro ataca
      const warrior = this.players[1];
      const warAction = warrior.takeTacticalTurn(targetEnemy);
      log.push(`[JOGADOR 2 - Guerreiro] Ação: ${warAction.action} (${JSON.stringify(warAction.result || {})})`);
    }

    // 5. Mestre encerra e distribui recompensas
    log.push(`\n--- PÓS-COMBATE: RECOMPENSAS & SAQUES ---`);
    const rewards = this.dm.distributeBatchRewards(300, 50);
    log.push(`[DM] Distribuídos 300 XP e 50 PO para os aventureiros da mesa.`);

    const stashRes = this.dm.depositToPartyStash('Rubi Lapidado', 1, 100);
    log.push(`[DM] Tesouro enviado ao Baú do Grupo: 100 PO e 1x Rubi Lapidado (Total no Baú: ${stashRes ? stashRes.totalGold : 0} PO).`);

    // 6. Auditoria de Layout e integridade
    const audit = this.auditLayoutAndSanitation();
    const allAuditPassed = audit.every(a => a.passed);
    log.push(`\n--- AUDITORIA DE LAYOUT & SANITIZAÇÃO ---`);
    audit.forEach(a => {
      log.push(`[AUDIT] ${a.passed ? '✅' : '❌'} ${a.test}`);
    });

    log.push(`\n=== FIM DA SESSÃO (STATUS AUDITORIA: ${allAuditPassed ? 'APROVADO 100%' : 'FALHA'}) ===`);

    return {
      log,
      allAuditPassed,
      audit,
      monstersCount: monsters.length,
      playersCount: this.players.length
    };
  }
}

// Execução standalone direta via terminal
if (require.main === module) {
  console.log('🚀 Iniciando Simulação de Mesa Multi-Agente...');
  const sim = new PlaytestSimulator();
  const session = sim.runFullSession(3);
  session.log.forEach(l => console.log(l));

  if (session.allAuditPassed) {
    console.log('\n🎉 SIMULAÇÃO E AUDITORIA CONCLUÍDAS COM SUCESSO TOTAL!');
    process.exit(0);
  } else {
    console.error('\n💥 FALHAS DETECTADAS NA AUDITORIA DA SIMULAÇÃO!');
    process.exit(1);
  }
}

module.exports = {
  DMAgent,
  PlayerAgent,
  PlaytestSimulator,
  createPlaytestSandbox
};
