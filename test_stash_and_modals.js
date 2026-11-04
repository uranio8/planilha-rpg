const assert = require('assert');

// Mock browser environment for unit testing
global.window = global;
global.document = {
  elements: {},
  addEventListener: () => {},
  removeEventListener: () => {},
  getElementById(id) {
    if (!this.elements[id]) {
      this.elements[id] = {
        id,
        style: {},
        value: '',
        innerText: '',
        innerHTML: '',
        classList: {
          classes: new Set(),
          add(c) { this.classes.add(c); },
          remove(c) { this.classes.delete(c); },
          contains(c) { return this.classes.has(c); }
        },
        querySelectorAll(sel) { return []; },
        focus() {}
      };
    }
    return this.elements[id];
  },
  querySelectorAll(sel) {
    return [];
  },
  body: {
    classList: {
      contains(c) { return false; }
    }
  }
};
global.localStorage = {
  data: {},
  getItem(k) { return this.data[k] || null; },
  setItem(k, v) { this.data[k] = String(v); },
  removeItem(k) { delete this.data[k]; }
};

// Carregar módulos
const core = require('./src/js/core.js');
const campaigns = require('./src/js/campaigns.js');
const compendium = require('./src/js/compendium.js');

console.log('--- TESTANDO MODAIS DARK FANTASY & CONTABILIDADE DO BAÚ (ISSUE-175) ---');

// 1. Testar customPrompt, customConfirm, customAlert
let alertTriggered = false;
core.customAlert('Operação realizada com sucesso!', 'Teste');
assert.strictEqual(document.getElementById('modal-custom-dialog').style.display, 'flex', 'customAlert deve exibir o modal');
assert.ok(document.getElementById('custom-dialog-title').innerText.includes('Teste'), 'Título do dialog deve ser exibido');
core.closeCustomDialog();
assert.strictEqual(document.getElementById('modal-custom-dialog').style.display, 'none', 'closeCustomDialog deve ocultar modal');

let confirmResult = null;
core.customConfirm({
  title: 'Confirmar Exclusão',
  message: 'Deseja excluir?',
  onConfirm: () => { confirmResult = true; }
});
assert.strictEqual(document.getElementById('modal-custom-dialog').style.display, 'flex');
core.submitCustomDialog();
assert.strictEqual(confirmResult, true, 'onConfirm deve ser chamado ao submeter dialog');

let promptResult = null;
core.customPrompt({
  title: 'Digite um valor',
  message: 'Quantidade:',
  defaultValue: '5',
  onConfirm: (val) => { promptResult = val; }
});
document.getElementById('custom-dialog-input').value = '15';
core.submitCustomDialog();
assert.strictEqual(promptResult, '15', 'customPrompt deve repassar valor digitado ao callback');
console.log('✅ 1. Sistema Universal de Custom Dialogs (Alert, Confirm, Prompt) aprovado!');

// 2. Testar openHeroSelectModal
global.PLAYERS = [
  { id: 'p1', name: 'Yoshikage Kira', className: 'Paladino', level: 8, student: 'Herói 1', hp: 60, maxHp: 60, gold: 120 },
  { id: 'p2', name: 'Deraravely', className: 'Guerreiro', level: 8, student: 'Herói 2', hp: 75, maxHp: 75, gold: 80 }
];

let selectedHeroId = null;
core.openHeroSelectModal({
  title: 'Escolha um Guerreiro',
  subtitle: 'Teste de Seleção',
  onSelect: (hero) => { selectedHeroId = hero.id; }
});
assert.strictEqual(document.getElementById('modal-hero-select').style.display, 'flex', 'Modal Hero Select deve abrir');
assert.ok(document.getElementById('hero-select-modal-title').innerText.includes('Escolha um Guerreiro'));
core.onHeroCardSelected('p2');
assert.strictEqual(selectedHeroId, 'p2', 'Herói selecionado deve ser repassado ao callback');
assert.strictEqual(document.getElementById('modal-hero-select').style.display, 'none', 'Modal deve fechar após seleção');
console.log('✅ 2. Modal Hero Select (Seleção Visual de Personagens) aprovado!');

// 3. Testar Histórico Contábil do Baú e Formatação de Cards
const cardHtml1 = campaigns.renderStashHistoryCardHtml({
  type: 'gold_in',
  text: '+250 PO (Saque de Goblins)',
  amount: '+250 PO',
  date: '2026-11-04',
  author: 'Yoshikage Kira',
  origIdx: 0
});
assert.ok(cardHtml1.includes('stash-history-card gold_in'), 'Deve ter classe gold_in');
assert.ok(cardHtml1.includes('Entrada'), 'Badge deve indicar Entrada');
assert.ok(cardHtml1.includes('+250 PO'), 'Deve exibir o amount badge');
assert.ok(cardHtml1.includes('04/11/2026'), 'Deve formatar a data para DD/MM/AAAA');

const cardHtml2 = campaigns.renderStashHistoryCardHtml({
  type: 'item_sold',
  text: 'Venda de 2x Espada Longa por +30 PO',
  amount: '+30 PO',
  date: '2026-11-04',
  origIdx: 1
});
assert.ok(cardHtml2.includes('item_sold'), 'Deve ter classe item_sold');
assert.ok(cardHtml2.includes('Venda'), 'Badge deve indicar Venda');
console.log('✅ 3. Renderização de Cards do Histórico Contábil aprovada!');

// 4. Testar Venda de Itens do Baú e Liquidação
const mockCampaign = {
  id: 'c1',
  name: 'Campanha Teste',
  partyStash: {
    gold: 100,
    items: [
      { id: 'it_sword', name: 'Espada Longa', qty: 3, category: 'Armas', weight: 1.5, carrier: 'Baú do Grupo' }
    ],
    history: []
  }
};
global.CAMPAIGNS_STATE = { campaigns: [mockCampaign], activeCampaignId: 'c1' };

campaigns.openSellPartyItemModal('it_sword');
// Mock elements for sell modal
document.getElementById('inp-sell-item-qty').value = '2';
document.getElementById('inp-sell-item-price').value = '15'; // 15 PO each
campaigns.submitSellPartyItem();

assert.strictEqual(mockCampaign.partyStash.gold, 130, 'Ouro do baú deve aumentar em 2x15 = 30 PO (100 -> 130)');
assert.strictEqual(mockCampaign.partyStash.items[0].qty, 1, 'Estoque do item deve ser reduzido de 3 para 1');
assert.strictEqual(mockCampaign.partyStash.history.length, 1, 'Deve registrar no histórico contábil');
assert.strictEqual(mockCampaign.partyStash.history[0].type, 'item_sold', 'Tipo de histórico deve ser item_sold');
assert.ok(mockCampaign.partyStash.history[0].text.includes('Venda de 2x "Espada Longa"'));
console.log('✅ 4. Venda de itens do baú (liquidação e crédito de tesouro) aprovada!');

// 5. Testar Divisão de Ouro entre Heróis
// Mock split modal checkboxes
document.querySelectorAll = function(sel) {
  if (sel.includes('.split-gold-hero-checkbox')) {
    return [
      { value: 'p1', checked: true },
      { value: 'p2', checked: true }
    ];
  }
  return [];
};
mockCampaign.partyStash.gold = 131; // 131 PO divided by 2 = 65 each, 1 remainder
campaigns.submitSplitGoldModal();

assert.strictEqual(mockCampaign.partyStash.gold, 1, 'Sobra no baú deve ser 1 PO');
assert.strictEqual(global.PLAYERS[0].gold, 120 + 65, 'Herói 1 deve receber 65 PO');
assert.strictEqual(global.PLAYERS[1].gold, 80 + 65, 'Herói 2 deve receber 65 PO');
const splitHist = mockCampaign.partyStash.history.find(h => h.type === 'gold_split');
assert.ok(splitHist, 'Deve registrar transação de divisão no histórico contábil');
console.log('✅ 5. Partilha de tesouro (Split Gold) calculada e sincronizada!');

console.log('🎉 TODOS OS TESTES DE BAÚ, HISTÓRICO E MODAIS DARK FANTASY PASSARAM COM SUCESSO!');
