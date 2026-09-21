// scratch/test_user_scenarios.js
// Simulação realista das duas abas (Mestre e Jogador) executando o código exato de src/

const fs = require('fs');
const path = require('path');
const vm = require('vm');

// Mock simples de BroadcastChannel que conecta canais com mesmo nome
const channels = {};
class MockBroadcastChannel {
  constructor(name) {
    this.name = name;
    if (!channels[name]) channels[name] = new Set();
    channels[name].add(this);
    this.onmessage = null;
  }
  postMessage(data) {
    const subs = channels[this.name];
    if (subs) {
      for (const ch of subs) {
        if (ch !== this && ch.onmessage) {
          // Despacho assíncrono como no browser
          setImmediate(() => {
            if (ch.onmessage) ch.onmessage({ data: JSON.parse(JSON.stringify(data)) });
          });
        }
      }
    }
  }
  close() {
    if (channels[this.name]) channels[this.name].delete(this);
  }
}

// Mock de Firebase Realtime Database para simular dois dispositivos diferentes (sem BroadcastChannel)
const firebaseDbStore = {};
const firebaseListeners = {};

const mockFirebase = {
  apps: [],
  initializeApp: (config) => {
    return { name: '[DEFAULT]' };
  },
  database: () => ({
    ref: (path) => ({
      on: (event, callback) => {
        if (!firebaseListeners[path]) firebaseListeners[path] = new Set();
        firebaseListeners[path].add(callback);
        if (firebaseDbStore[path]) {
          callback({ val: () => JSON.parse(JSON.stringify(firebaseDbStore[path])) });
        }
      },
      off: (event, callback) => {
        if (firebaseListeners[path]) firebaseListeners[path].delete(callback);
      },
      set: (val) => {
        firebaseDbStore[path] = JSON.parse(JSON.stringify(val));
        if (firebaseListeners[path]) {
          for (const cb of firebaseListeners[path]) {
            setImmediate(() => cb({ val: () => JSON.parse(JSON.stringify(val)) }));
          }
        }
        return Promise.resolve();
      },
      update: (val) => {
        firebaseDbStore[path] = Object.assign(firebaseDbStore[path] || {}, JSON.parse(JSON.stringify(val)));
        if (firebaseListeners[path]) {
          for (const cb of firebaseListeners[path]) {
            setImmediate(() => cb({ val: () => JSON.parse(JSON.stringify(firebaseDbStore[path])) }));
          }
        }
        return Promise.resolve();
      },
      child: (subPath) => ({
        transaction: (fn) => {
          const current = firebaseDbStore[path] ? firebaseDbStore[path][subPath] : null;
          const updated = fn(current ? JSON.parse(JSON.stringify(current)) : null);
          if (firebaseDbStore[path]) {
            firebaseDbStore[path][subPath] = updated;
          } else {
            firebaseDbStore[path] = { [subPath]: updated };
          }
          if (firebaseListeners[path]) {
            for (const cb of firebaseListeners[path]) {
              setImmediate(() => cb({ val: () => JSON.parse(JSON.stringify(firebaseDbStore[path])) }));
            }
          }
          return Promise.resolve({ committed: true });
        }
      })
    })
  })
};

const sharedStorage = {};
const storageListeners = new Set();

function createLocalStorage(instanceName) {
  return {
    getItem(k) { return sharedStorage[k] || null; },
    setItem(k, v) {
      const oldVal = sharedStorage[k];
      sharedStorage[k] = String(v);
      for (const listener of storageListeners) {
        if (listener.instanceName !== instanceName) {
          setImmediate(() => listener.fn({ key: k, oldValue: oldVal, newValue: String(v) }));
        }
      }
    },
    removeItem(k) {
      delete sharedStorage[k];
      for (const listener of storageListeners) {
        if (listener.instanceName !== instanceName) {
          setImmediate(() => listener.fn({ key: k, oldValue: null, newValue: null }));
        }
      }
    },
    clear() {
      for (const k in sharedStorage) delete sharedStorage[k];
    }
  };
}

function createInstance(instanceName, url = 'http://localhost/index.html', separateDevice = false) {
  const domElements = {};
  const localListeners = {};

  const sandbox = {
    console: {
      log: (...args) => console.log(`[${instanceName}]`, ...args),
      warn: (...args) => console.warn(`[${instanceName}] WARN:`, ...args),
      error: (...args) => console.error(`[${instanceName}] ERROR:`, ...args)
    },
    document: {
      getElementById: (id) => {
        if (!domElements[id]) {
          domElements[id] = {
            id,
            value: '',
            options: [],
            selectedIndex: 0,
            clientWidth: 1200,
            clientHeight: 800,
            getBoundingClientRect: () => ({ left: 0, top: 0, width: 1200, height: 800 }),
            dataset: {},
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
            focus: () => {}
          };
        }
        return domElements[id];
      },
      querySelectorAll: (sel) => [],
      querySelector: (sel) => null,
      body: {
        classList: {
          _classes: new Set(),
          add(c) { this._classes.add(c); },
          remove(c) { this._classes.delete(c); },
          contains(c) { return this._classes.has(c); }
        },
        style: {}
      },
      documentElement: { style: { setProperty: () => {} } },
      addEventListener: (evt, fn) => {
        if (!localListeners[evt]) localListeners[evt] = [];
        localListeners[evt].push(fn);
      },
      removeEventListener: () => {}
    },
    URLSearchParams: require('url').URLSearchParams,
    window: null,
    BroadcastChannel: separateDevice ? undefined : MockBroadcastChannel,
    localStorage: separateDevice ? {
      _data: {},
      getItem(k) { return this._data[k] || null; },
      setItem(k, v) { this._data[k] = String(v); },
      removeItem(k) { delete this._data[k]; },
      clear() { this._data = {}; }
    } : createLocalStorage(instanceName),
    firebase: mockFirebase,
    prompt: (msg, def) => (def !== undefined ? String(def) : '10'),
    confirm: () => true,
    alert: (msg) => console.log(`[${instanceName}] ALERT:`, msg),
    setTimeout: setTimeout,
    clearTimeout: clearTimeout,
    setInterval: setInterval,
    clearInterval: clearInterval,
    setImmediate: setImmediate,
    Date: Date,
    Math: Math,
    parseInt: parseInt,
    parseFloat: parseFloat,
    Array: Array,
    Object: Object,
    String: String,
    Number: Number,
    Boolean: Boolean,
    RegExp: RegExp,
    JSON: JSON,
    Promise: Promise,
    Map: Map,
    Set: Set
  };

  const parsedUrl = new (require('url').URL)(url);
  sandbox.window = {
    location: {
      href: url,
      search: parsedUrl.search,
      hash: parsedUrl.hash,
      pathname: parsedUrl.pathname
    },
    history: { replaceState: () => {} },
    addEventListener: (evt, fn) => {
      if (evt === 'storage') {
        storageListeners.add({ instanceName, fn });
      }
      if (!localListeners[evt]) localListeners[evt] = [];
      localListeners[evt].push(fn);
    },
    removeEventListener: () => {},
    localStorage: sandbox.localStorage,
    BroadcastChannel: separateDevice ? undefined : MockBroadcastChannel,
    firebase: mockFirebase,
    document: sandbox.document,
    setTimeout: sandbox.setTimeout,
    clearTimeout: sandbox.clearTimeout,
    setInterval: sandbox.setInterval,
    clearInterval: sandbox.clearInterval
  };
  sandbox.firebase = mockFirebase;
  sandbox.global = sandbox;

  vm.createContext(sandbox);

  const srcDir = path.join(__dirname, '..', 'src');
  const loadFile = (rel) => fs.readFileSync(path.join(srcDir, rel), 'utf8');

  // Carrega os módulos na mesma ordem do builder.js
  const files = [
    'data/rules_xp.js',
    'data/spells.js',
    'data/monsters.js',
    'data/equipment.js',
    'data/classes.js',
    'data/species.js',
    'data/campaigns.js',
    'js/audio_synth.js',
    'js/core.js',
    'js/firebase_sync.js',
    'js/combat.js',
    'js/players.js',
    'js/compendium.js',
    'js/campaigns.js',
    'js/dice_roller.js',
    'js/vtt_grid.js',
    'js/screen_sync.js'
  ];

  for (const f of files) {
    vm.runInContext(loadFile(f), sandbox, { filename: f });
  }

  return { sandbox, domElements };
}

async function runTests() {
  console.log('=== INICIANDO TESTES DE DIAGNÓSTICO MESTRE x JOGADOR (DISPOSITIVOS SEPARADOS VIA FIREBASE) ===\n');

  // 1. Cria a instância do Mestre (PC)
  console.log('1. Inicializando Mestre (PC)...');
  const master = createInstance('MESTRE', 'http://localhost/planilha%20do%20rpg.html?room=sala_teste', true);
  vm.runInContext('if (typeof window.onload === "function") window.onload();', master.sandbox);
  // Publica a campanha inicial para a sala
  vm.runInContext('publishMasterCampaignToCloud(true);', master.sandbox);

  await new Promise(r => setTimeout(r, 200));

  // 2. Cria a instância do Jogador (Celular com link direto)
  console.log('2. Inicializando Jogador (Celular com ?view=player&player=p2&room=sala_teste)...');
  const player = createInstance('JOGADOR', 'http://localhost/planilha%20do%20rpg.html?view=player&player=p2&room=sala_teste', true);
  vm.runInContext('if (typeof window.onload === "function") window.onload();', player.sandbox);

  await new Promise(r => setTimeout(r, 300));

  console.log('\n--- TESTE 1: MESTRE ADICIONA ITEM NA BOLSA DO GRUPO ---');
  // Jogador abre o modal do baú previamente
  console.log('Jogador abre o modal do baú coletivo...');
  vm.runInContext('openPartyStashModal();', player.sandbox);
  const playerStashHtmlBefore = player.domElements['party-stash-modal-tbody'].innerHTML;
  console.log('Itens iniciais no modal do Jogador contém Espada Lunar?', playerStashHtmlBefore.includes('Espada Lunar +1') ? 'SIM' : 'NÃO');

  console.log('Mestre abre o modal de item do grupo...');
  vm.runInContext('openPartyItemModal();', master.sandbox);
  master.domElements['inp-pitem-name'].value = 'Espada Lunar +1';
  master.domElements['inp-pitem-qty'].value = '1';
  master.domElements['inp-pitem-cat'].value = 'Armas Mágicas';
  master.domElements['inp-pitem-carrier'].value = 'Baú do Grupo';
  master.domElements['inp-pitem-desc'].value = 'Brilha com luz prateada na escuridão';

  // O Mestre salva o item
  console.log('Mestre clicando em Salvar Item no Baú (savePartyItem())...');
  vm.runInContext('savePartyItem();', master.sandbox);

  // Aguarda propagação por Firebase Realtime Database
  await new Promise(r => setTimeout(r, 800));

  // Verifica se a UI do modal do Jogador que já estava aberto foi atualizada em tempo real SEM o jogador fechar e abrir de novo
  const playerStashHtmlAfter = player.domElements['party-stash-modal-tbody'].innerHTML;
  const hasItemInPlayerUiLive = playerStashHtmlAfter.includes('Espada Lunar +1');
  console.log('Item "Espada Lunar +1" visível na UI do Jogador EM TEMPO REAL?', hasItemInPlayerUiLive ? '✅ SIM' : '❌ NÃO');


  console.log('\n--- TESTE 2: JOGADOR ALTERA A VIDA (DANO / CURA) ---');
  // O jogador ativo é p2
  const activeHeroId = vm.runInContext('activePortalPlayerId;', player.sandbox) || 'p2';
  console.log('ID do herói ativo no Portal do Jogador:', activeHeroId);

  const heroMasterInitial = vm.runInContext(`PLAYERS.find(p => p.id === "${activeHeroId}");`, master.sandbox);
  const heroPlayerInitial = vm.runInContext(`PLAYERS.find(p => p.id === "${activeHeroId}");`, player.sandbox);
  console.log(`Vida inicial ${activeHeroId} - Mestre: ${heroMasterInitial.hp}/${heroMasterInitial.maxHp}, Jogador: ${heroPlayerInitial.hp}/${heroPlayerInitial.maxHp}`);

  // O Mestre coloca os jogadores no combate
  console.log('Mestre adiciona jogadores ao combate...');
  vm.runInContext('addAllPlayersToCombat();', master.sandbox);
  const combMasterInitial = vm.runInContext(`state.combatants.find(c => (c.playerId && c.playerId === "${activeHeroId}") || c.id === "${activeHeroId}" || c.name.includes("${heroMasterInitial.name}"));`, master.sandbox);
  console.log(`Combatente no Mestre: ${combMasterInitial ? combMasterInitial.name : 'NÃO ENCONTRADO'}, HP: ${combMasterInitial ? combMasterInitial.hp : 'N/A'}`);

  // Agora na aba do JOGADOR: o jogador ativo toma 5 de dano (clica em -5)
  console.log(`Jogador clica em -5 de vida (adjustPlayerHp("${activeHeroId}", -5))...`);
  vm.runInContext(`adjustPlayerHp("${activeHeroId}", -5);`, player.sandbox);

  const heroPlayerAfterDmg = vm.runInContext(`PLAYERS.find(p => p.id === "${activeHeroId}");`, player.sandbox);
  console.log(`Vida ${activeHeroId} no Jogador após dano: ${heroPlayerAfterDmg.hp}/${heroPlayerAfterDmg.maxHp}`);

  // Aguarda propagação por Firebase
  await new Promise(r => setTimeout(r, 800));

  // Verifica no Mestre:
  const heroMasterAfterDmg = vm.runInContext(`PLAYERS.find(p => p.id === "${activeHeroId}");`, master.sandbox);
  const combMasterAfterDmg = vm.runInContext(`state.combatants.find(c => (c.playerId && c.playerId === "${activeHeroId}") || c.id === "${activeHeroId}" || c.name.includes("${heroMasterInitial.name}"));`, master.sandbox);
  console.log(`Vida ${activeHeroId} na Ficha do MESTRE: ${heroMasterAfterDmg ? heroMasterAfterDmg.hp : 'N/A'}/${heroMasterAfterDmg ? heroMasterAfterDmg.maxHp : 'N/A'}`);
  console.log(`Vida ${activeHeroId} no COMBATE do MESTRE: ${combMasterAfterDmg ? combMasterAfterDmg.hp : 'N/A'}/${combMasterAfterDmg ? combMasterAfterDmg.maxHp : 'N/A'}`);
  const hpSyncSuccess = (heroMasterAfterDmg && heroMasterAfterDmg.hp === heroPlayerAfterDmg.hp) && (combMasterAfterDmg && combMasterAfterDmg.hp === heroPlayerAfterDmg.hp);
  console.log('Sincronização de Vida para o Mestre:', hpSyncSuccess ? '✅ SUCESSO' : '❌ FALHOU');

  console.log('\n--- TESTE 3: JOGADOR GASTA SLOT DE MAGIA (com p2 - Maga) ---');
  // Verifica slots iniciais de p2
  const p2PlayerInit = vm.runInContext('PLAYERS.find(p => p.id === "p2");', player.sandbox);
  console.log('Slots máximos de p2:', p2PlayerInit.slots, 'Slots gastos iniciais:', p2PlayerInit.slotsUsed);

  // Jogador gasta 1 slot de 1º círculo (lvlIdx = 0, slotIdx = 0) para p2
  console.log('Jogador clica na bolinha de slot 0 de 1º círculo (togglePlayerSlot("p2", 0, 0))...');
  vm.runInContext('togglePlayerSlot("p2", 0, 0);', player.sandbox);

  const p2PlayerSlotsAfter = vm.runInContext('PLAYERS.find(p => p.id === "p2").slotsUsed;', player.sandbox);
  console.log('Slots gastos no Jogador após toggle:', p2PlayerSlotsAfter);

  // Aguarda propagação por Firebase cobrindo o cooldown
  await new Promise(r => setTimeout(r, 800));

  // Verifica no Mestre se os slots de p2 atualizaram
  const p2MasterSlotsAfter = vm.runInContext('PLAYERS.find(p => p.id === "p2").slotsUsed;', master.sandbox);
  console.log('Slots gastos no Mestre após toggle:', p2MasterSlotsAfter);
  const slotsSyncSuccess = JSON.stringify(p2MasterSlotsAfter) === JSON.stringify(p2PlayerSlotsAfter);
  console.log('Sincronização de Slots de Magia para o Mestre:', slotsSyncSuccess ? '✅ SUCESSO' : '❌ FALHOU');

  // Teste 3B: Jogador conjura magia pelo modal de lançar magia
  console.log('\nJogador lança magia de 1º círculo (executeCastSpell("p2", "Mísseis Mágicos", 1))...');
  vm.runInContext('executeCastSpell("p2", "Mísseis Mágicos", 1);', player.sandbox);
  const p2PlayerSlotsAfterCast = vm.runInContext('PLAYERS.find(p => p.id === "p2").slotsUsed;', player.sandbox);
  console.log('Slots gastos no Jogador após cast:', p2PlayerSlotsAfterCast);

  await new Promise(r => setTimeout(r, 800));
  const p2MasterSlotsAfterCast = vm.runInContext('PLAYERS.find(p => p.id === "p2").slotsUsed;', master.sandbox);
  console.log('Slots gastos no Mestre após cast:', p2MasterSlotsAfterCast);
  const castSyncSuccess = JSON.stringify(p2MasterSlotsAfterCast) === JSON.stringify(p2PlayerSlotsAfterCast);
  console.log('Sincronização de Cast de Magia para o Mestre:', castSyncSuccess ? '✅ SUCESSO' : '❌ FALHOU');
  process.exit(0);
}

runTests().catch(console.error);
