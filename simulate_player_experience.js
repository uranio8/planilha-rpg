// simulate_player_experience.js
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const domElements = {};
const sandbox = {
  console: { log: console.log, warn: console.warn, error: console.error },
  document: {
    getElementById: (id) => {
      if (!domElements[id]) {
        domElements[id] = {
          id,
          value: '',
          options: [{ value: 'Guerreiro' }, { value: 'Mago' }, { value: 'Humano' }, { value: 'Elfo' }],
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
  addEventListener: () => {}, removeEventListener: () => {}, window: {
    location: { href: 'http://localhost/rpg.html', search: '', hash: '', pathname: '/rpg.html' },
    history: { replaceState: () => {} },
    addEventListener: () => {},
    removeEventListener: () => {}
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
  alert: (msg) => console.log('  [ALERT]:', msg),
  setTimeout: (fn) => fn(),
  clearTimeout: () => {},
  setInterval: (fn) => 1,
  clearInterval: () => {}
};

sandbox.window = sandbox;
sandbox.global = sandbox;
vm.createContext(sandbox);

const srcDir = path.join(__dirname, 'src');
const loadFile = (rel) => fs.readFileSync(path.join(srcDir, rel), 'utf8');

vm.runInContext(loadFile('data/rules_xp.js'), sandbox);
vm.runInContext(loadFile('data/spells.js'), sandbox);
vm.runInContext(loadFile('data/monsters.js'), sandbox);
vm.runInContext(loadFile('data/equipment.js'), sandbox);
vm.runInContext(loadFile('data/classes.js'), sandbox);
vm.runInContext(loadFile('data/species.js'), sandbox);
vm.runInContext(loadFile('data/campaigns.js'), sandbox);
vm.runInContext(loadFile('js/audio_synth.js'), sandbox);
vm.runInContext(loadFile('js/core.js'), sandbox);
vm.runInContext(loadFile('js/firebase_sync.js'), sandbox);
vm.runInContext(loadFile('js/combat.js'), sandbox);
vm.runInContext(loadFile('js/players.js'), sandbox);
vm.runInContext(loadFile('js/compendium.js'), sandbox);
vm.runInContext(loadFile('js/campaigns.js'), sandbox);
vm.runInContext(loadFile('js/dice_roller.js'), sandbox);
vm.runInContext(loadFile('js/vtt_grid.js'), sandbox);

console.log('======================================================');
console.log('🧙‍♂️ SIMULAÇÃO DO JOGADOR: CRIANDO E TESTANDO UMA FICHA');
console.log('======================================================\n');

// 1. Criar novo personagem: Aeloria, Maga de Nível 1
console.log('▶ [1] CRIANDO PERSONAGEM NOVO (MAGO NV 1)...');
vm.runInContext(`
  openPlayerModal(null);
  document.getElementById('pm-name').value = 'Aeloria';
  document.getElementById('pm-student').value = 'Lucas';
  document.getElementById('pm-race-select').value = 'Elfo (Elf)';
  document.getElementById('pm-race').value = 'Elfo';
  document.getElementById('pm-class-select').value = 'Mago';
  document.getElementById('pm-class').value = 'Mago';
  document.getElementById('pm-level').value = 1;
  document.getElementById('pm-str').value = 8;
  document.getElementById('pm-dex').value = 14;
  document.getElementById('pm-con').value = 14;
  document.getElementById('pm-int').value = 16;
  document.getElementById('pm-wis').value = 12;
  document.getElementById('pm-cha').value = 10;
  document.getElementById('pm-maxhp').value = 8;
  document.getElementById('pm-ac').value = 12;
  document.getElementById('pm-speed').value = '9m';
  document.getElementById('pm-gold').value = 10;
  savePlayerSheet();
`, sandbox);

const p1 = vm.runInContext(`PLAYERS.find(p => p.name === 'Aeloria')`, sandbox);
if (!p1) {
  console.error('❌ FALHA CRÍTICA: Personagem não foi salvo em PLAYERS!');
} else {
  console.log('  Nome:', p1.name, '| Aluno:', p1.student);
  console.log('  Classe:', p1.className, '| Raça:', p1.race, '| Nível:', p1.level);
  console.log('  PV:', p1.hp, '/', p1.maxHp, '| CA:', p1.ac, '| Deslocamento:', p1.speed);
  console.log('  Dado de Vida:', p1.hitDice);
  console.log('  Slots de Magia:', p1.slots);
  console.log('  Salvaguardas:', p1.saveProficiencies);
  console.log('  Perícias:', p1.skillProficiencies);
  console.log('  Mochila inicial:', p1.inventory);
  console.log('  Moedas iniciais:', p1.coins);
}

// 2. Equipando e adicionando itens à mochila
console.log('\n▶ [2] ADICIONANDO ITENS À MOCHILA & EQUIPANDO...');
vm.runInContext(`
  // Abre modal de adicionar item para p1
  openAddPlayerItemModal('${p1.id}');
  // Adiciona do catálogo (item 0)
  addItemToPlayerFromCatalog(0);
  // Adiciona item customizado (Poção de Cura)
  document.getElementById('inp-custom-item-name').value = 'Poção de Cura';
  document.getElementById('inp-custom-item-qty').value = '2';
  document.getElementById('inp-custom-item-weight').value = '0.5';
  document.getElementById('inp-custom-item-desc').value = 'Restaura 2d4+2 PV';
  submitCustomItemToPlayer();
  // Equipa o item 0
  togglePlayerItemEquipped('${p1.id}', 0);
`, sandbox);

console.log('  Itens na Mochila:', p1.inventory.map(i => `${i.name} (${i.qty}x, equipado: ${i.equipped})`));

// 3. Escolhendo Magias via Spell Picker
console.log('\n▶ [3] ESCOLHENDO MAGIAS NO GRIMÓRIO / SPELL PICKER...');
vm.runInContext(`
  openSpellPickerModal('${p1.id}');
  toggleSpellInPicker('Raio de Fogo');
  toggleSpellInPicker('Mísseis Mágicos');
  toggleSpellInPicker('Escudo Arcano');
  saveSpellPickerSelection();
`, sandbox);

console.log('  Magias preparadas salvas:', p1.preparedSpells);
console.log('  Texto de magias:', p1.spells);

// 4. TESTE DE FOGO: O MESTRE OU O JOGADOR EDITA A FICHA PARA ATUALIZAR A CA
console.log('\n▶ [4] TESTE CRÍTICO: EDITAR A FICHA VIA MODAL (openPlayerModal)...');
vm.runInContext(`
  openPlayerModal('${p1.id}');
  // Altera a CA para 15 (usando Armadura Arcana)
  document.getElementById('pm-ac').value = 15;
  savePlayerSheet();
`, sandbox);

const p1Edited = vm.runInContext(`PLAYERS.find(p => p.id === '${p1.id}')`, sandbox);
console.log('  Nova CA:', p1Edited.ac);
console.log('  Mochila após salvar edição:', p1Edited.inventory);
console.log('  Moedas após salvar edição:', p1Edited.coins);
console.log('  Magias preparadas após salvar edição:', p1Edited.preparedSpells);

if (!p1Edited.inventory || p1Edited.inventory.length === 0) {
  console.error('  ❌ BUG CRÍTICO ENCONTRADO: A mochila do personagem foi COMPLETAMENTE DESTRUÍDA ao salvar no modal!');
} else {
  console.log('  ✅ Mochila foi preservada!');
}

if (!p1Edited.coins) {
  console.error('  ❌ BUG CRÍTICO ENCONTRADO: A carteira de moedas (coins) foi apagada ao salvar no modal!');
} else {
  console.log('  ✅ Moedas foram preservadas!');
}

// 5. Testar Subir de Nível (Level Up Wizard)
console.log('\n▶ [5] TESTANDO SUBIR PARA NÍVEL 2 (Level Up Wizard)...');
vm.runInContext(`
  openLevelUpWizard('${p1.id}');
  levelUpWizardState.hpMethod = 'fixed';
  applyLevelUpConfirm();
`, sandbox);
console.log('  Nível após Level Up:', p1.level);
console.log('  PV Máximo após Level Up:', p1.maxHp);
console.log('  Slots de Magia Nível 2:', p1.slots);
console.log('  Dados de Vida Nível 2:', p1.hitDice);

// 6. Testar Combate, Dano, Cura e Descansos
console.log('\n▶ [6] TESTANDO DANO, SLOTS, GASTO DE DADOS DE VIDA E DESCANSOS...');
vm.runInContext(`
  // Toma 7 de dano
  adjustPlayerHp('${p1.id}', -7);
  // Gasta 1 slot de 1º círculo
  togglePlayerSlot('${p1.id}', 0, 0);
`, sandbox);
console.log('  PV após dano:', p1.hp, '/', p1.maxHp);
console.log('  Slots usados:', p1.slotsUsed);

// Descanso Curto
vm.runInContext(`
  openShortRestModal('${p1.id}');
  rollShortRestHitDie('${p1.id}');
  finishShortRestModal();
`, sandbox);
console.log('  PV após Descanso Curto:', p1.hp, '/', p1.maxHp);
console.log('  Dados de Vida gastos:', p1.spentHitDice);

// Descanso Longo
vm.runInContext(`
  playerLongRest('${p1.id}');
`, sandbox);
console.log('  PV após Descanso Longo:', p1.hp, '/', p1.maxHp);
console.log('  Slots usados após Descanso Longo:', p1.slotsUsed);
console.log('  Dados de Vida gastos após Descanso Longo:', p1.spentHitDice);

// 7. Testar Rolagens de Ataque, Perícia e Salvaguarda
console.log('\n▶ [7] TESTANDO ROLAGENS (ATAQUE, PERÍCIA, SALVAGUARDA)...');
try {
  vm.runInContext(`rollPlayerAttack('${p1.id}', 'Adaga (+4, 1d4+2 perfurante)')`, sandbox);
  console.log('  ✅ Ataque rolado com sucesso');
} catch (e) {
  console.error('  ❌ Erro em rollPlayerAttack:', e.message);
}

try {
  vm.runInContext(`rollPlayerSkill('${p1.id}', 'arcanismo')`, sandbox);
  console.log('  ✅ Perícia rolada com sucesso');
} catch (e) {
  console.error('  ❌ Erro em rollPlayerSkill:', e.message);
}

try {
  vm.runInContext(`rollPlayerSavingThrow('${p1.id}', 'int')`, sandbox);
  console.log('  ✅ Salvaguarda rolada com sucesso');
} catch (e) {
  console.error('  ❌ Erro em rollPlayerSavingThrow:', e.message);
}

// 8. Testar Consumo de Item (Poção de Cura)
console.log('\n▶ [8] TESTANDO CONSUMO RÁPIDO DE ITEM...');
const currentInv = vm.runInContext("PLAYERS.find(p => p.id === '" + p1.id + "').inventory", sandbox);
if (currentInv && currentInv.length > 0) {
  console.log('  Itens presentes na mochila:', currentInv.map(i => i.name));
  const itemIdx = 0;
  const qtyBefore = currentInv[itemIdx].qty;
  vm.runInContext(`usePlayerInventoryItem('${p1.id}', ${itemIdx})`, sandbox);
  const updatedInv = vm.runInContext("PLAYERS.find(p => p.id === '" + p1.id + "').inventory", sandbox);
  console.log(`  Item testado com sucesso! Quantidade: ${qtyBefore} -> ${updatedInv[itemIdx] ? updatedInv[itemIdx].qty : 0}`);
} else {
  console.log('  ⚠️ Inventário vazio!');
}

console.log('\n======================================================');
console.log('🏁 SIMULAÇÃO CONCLUÍDA!');
console.log('======================================================');
