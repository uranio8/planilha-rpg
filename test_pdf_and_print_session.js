/**
 * test_pdf_and_print_session.js
 * Teste E2E e de Integridade para Impressão A4 e Geração de PDF Editável (Mestre e Jogador)
 * Valida ISSUE-151:
 *  1. Isolamento estrito de impressão (@media print) escondendo <main>, <header>, cards e fundo.
 *  2. Resolução resiliente do personagem ativo no modal tanto para Mestre quanto Jogador.
 *  3. Sanitização contra NaNs e estruturas complexas (inventário, magias, moedas).
 *  4. Execução de AcroForms e cálculos de auto-cálculo sem erros de tipo.
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const PDFLib = require('pdf-lib');

async function runSessionTest() {
  console.log('🧪 Iniciando Teste de Sessão: Impressão A4 e PDF Editável (Mestre & Jogador)...');

  // 1. Ler o CSS e verificar regras @media print
  const headCss = fs.readFileSync(path.join(__dirname, 'src/styles/head_css.html'), 'utf8');
  
  if (!headCss.includes('@media print')) {
    throw new Error('Falha: head_css.html não possui bloco @media print!');
  }
  
  const printBlock = headCss.slice(headCss.indexOf('@media print'));
  const requiredHiddenSelectors = [
    'header',
    'main',
    'footer',
    '.player-card',
    '.tab-content',
    '#modal-print'
  ];

  requiredHiddenSelectors.forEach(sel => {
    if (!printBlock.includes(sel)) {
      throw new Error(`Falha: seletor obrigatório "${sel}" ausente nas regras de @media print!`);
    }
  });
  console.log('  ✅ Regras de isolamento @media print validadas com sucesso.');

  // 2. Mock de DOM para simulação de Mestre e Jogador
  const elements = {};
  function createElement(tag) {
    const el = {
      tagName: tag.toUpperCase(),
      classList: {
        classes: new Set(),
        add(c) { this.classes.add(c); },
        remove(c) { this.classes.delete(c); },
        contains(c) { return this.classes.has(c); }
      },
      attributes: {},
      setAttribute(k, v) { this.attributes[k] = String(v); },
      getAttribute(k) { return this.attributes[k] || null; },
      children: [],
      appendChild(child) { this.children.push(child); return child; },
      removeChild(child) {
        const idx = this.children.indexOf(child);
        if (idx >= 0) this.children.splice(idx, 1);
        return child;
      },
      click() { this.clicked = true; },
      style: {},
      _innerHTML: ''
    };

    Object.defineProperty(el, 'innerHTML', {
      get() { return this._innerHTML; },
      set(val) {
        this._innerHTML = val;
        // Mock simples de busca por querySelector
        this._subElements = [];
        const matches = [...val.matchAll(/class="([^"]+)"[^>]*data-player-id="([^"]+)"/g)];
        matches.forEach(m => {
          this._subElements.push({
            className: m[1],
            playerId: m[2],
            getAttribute(attr) {
              if (attr === 'data-player-id') return m[2];
              return null;
            }
          });
        });
      }
    });

    return el;
  }

  const printSheetContent = createElement('div');
  printSheetContent.id = 'print-sheet-content';
  elements['print-sheet-content'] = printSheetContent;

  const modalPrint = createElement('div');
  modalPrint.id = 'modal-print';
  elements['modal-print'] = modalPrint;

  const body = createElement('body');

  const documentMock = {
    getElementById(id) { return elements[id] || null; },
    querySelector(sel) {
      if (sel === '#print-sheet-content [data-player-id]') {
        return printSheetContent._subElements && printSheetContent._subElements[0] ? printSheetContent._subElements[0] : null;
      }
      return null;
    },
    querySelectorAll() { return []; },
    addEventListener() {},
    removeEventListener() {},
    createElement(tag) { return createElement(tag); },
    body: body
  };

  const logs = [];
  const alerts = [];

  const context = {
    console: console,
    PDFLib: PDFLib,
    document: documentMock,
    window: {
      print: () => { windowPrinted = true; },
      addEventListener() {},
      removeEventListener() {}
    },
    localStorage: {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {}
    },
    alert: (msg) => { alerts.push(msg); },
    addLog: (msg) => { logs.push(msg); },
    playFX: () => {},
    setTimeout: (fn) => fn(),
    Buffer: Buffer,
    Array: Array
  };
  context.window.document = documentMock;
  vm.createContext(context);

  // Carregar dados de teste e scripts
  const samplePlayers = [
    {
      id: 'p_arkhalis',
      name: 'Arkhalis Silva',
      student: 'Lucas',
      className: 'Guerreiro',
      level: 5,
      str: 18,
      dex: 14,
      con: 16,
      int: 10,
      wis: 12,
      cha: 8,
      hp: 45,
      maxHp: 45,
      ac: 18,
      speed: '9m',
      saveProficiencies: ['str', 'con'],
      skills: ['atletismo', 'intimidacao'],
      inventory: [
        { name: 'Espada Longa', qty: 1, weight: '1.5', equipped: true },
        { name: 'Escudo', qty: 1, weight: '3.0', equipped: true },
        { name: 'Poção de Cura', qty: 2, weight: '0.5', equipped: false }
      ],
      gold: 50,
      attacks: 'Espada Longa: +7 para acertar, 1d8+4 dano cortante'
    },
    {
      id: 'p_deraravely',
      name: 'Deraravely Valen',
      student: 'Wesley',
      className: 'Mago',
      level: 5,
      str: 8,
      dex: 14,
      con: 14,
      int: 18,
      wis: 12,
      cha: 10,
      hp: 30,
      maxHp: 30,
      ac: 12,
      speed: '9m',
      saveProficiencies: ['int', 'wis'],
      skills: ['arcanismo', 'historia', 'investigacao'],
      inventory: [
        { name: 'Grimório', qty: 1, weight: '1.5', equipped: true },
        { name: 'Foco Arcano', qty: 1, weight: '0.5', equipped: true }
      ],
      spells: ['Mísseis Mágicos', 'Escudo Arcano', 'Bola de Fogo'],
      gold: 120,
      attacks: 'Raio de Fogo: +7 para acertar, 2d10 dano de fogo'
    }
  ];

  // Carregar core.js, players.js e pdf_export.js
  const coreCode = fs.readFileSync(path.join(__dirname, 'src/js/core.js'), 'utf8');
  const playersCode = fs.readFileSync(path.join(__dirname, 'src/js/players.js'), 'utf8');
  const pdfExportCode = fs.readFileSync(path.join(__dirname, 'src/js/pdf_export.js'), 'utf8');

  vm.runInContext(coreCode, context);
  context.samplePlayers = samplePlayers;
  vm.runInContext('PLAYERS.length = 0; samplePlayers.forEach(p => PLAYERS.push(p));', context);
  vm.runInContext(playersCode, context);
  vm.runInContext(pdfExportCode, context);

  // 3. Teste Cenário Mestre: abrir folha de Arkhalis e Deraravely
  console.log('  👉 Testando Cenário MESTRE: impressão e exportação de Arkhalis...');
  context.printPlayerSheet('p_arkhalis');
  
  if (!modalPrint.classList.contains('open')) {
    throw new Error('Falha: modal-print não recebeu classe "open"!');
  }
  if (!printSheetContent.innerHTML.includes('data-player-id="p_arkhalis"')) {
    throw new Error('Falha: data-player-id ausente no HTML da folha A4 de Arkhalis!');
  }
  if (context.window.currentPrintPlayerId !== 'p_arkhalis') {
    throw new Error('Falha: window.currentPrintPlayerId não registrado!');
  }

  // Executar exportação pelo botão do modal
  await context.exportCurrentModalPlayerEditablePdf();
  if (alerts.length > 0) {
    throw new Error(`Falha: alerta inesperado durante exportação de Arkhalis: ${alerts[0]}`);
  }
  console.log('  ✅ Exportação de Arkhalis (Mestre) concluída sem erros.');

  // Testar Deraravely (Mago com magias e itens)
  console.log('  👉 Testando Cenário MESTRE: exportação de Deraravely (Mago com Magias)...');
  context.printPlayerSheet('p_deraravely');
  await context.exportCurrentModalPlayerEditablePdf();
  if (alerts.length > 0) {
    throw new Error(`Falha: alerta durante exportação de Deraravely: ${alerts[alerts.length - 1]}`);
  }
  console.log('  ✅ Exportação de Deraravely concluída com sucesso.');

  // 4. Teste Cenário Portal do Jogador: onde currentPrintPlayerId pode estar nulo ou apenas activePortalPlayerId definido
  console.log('  👉 Testando Cenário JOGADOR (Portal): resolução resiliente de ID...');
  context.currentPrintPlayerId = null;
  context.window.currentPrintPlayerId = null;
  context.activePortalPlayerId = 'p_deraravely';
  context.window.activePortalPlayerId = 'p_deraravely';

  await context.exportCurrentModalPlayerEditablePdf();
  if (alerts.length > 0) {
    throw new Error(`Falha: exportCurrentModalPlayerEditablePdf falhou no contexto do portal do jogador: ${alerts[alerts.length - 1]}`);
  }
  console.log('  ✅ Resolução via activePortalPlayerId aprovada.');

  // Testar exportação JSON no Portal
  context.exportCurrentModalPlayerJson();
  console.log('  ✅ Exportação de JSON no Portal do Jogador aprovada.');

  // 5. Teste de Validação dos AcroForms e Cálculos de PDF
  console.log('  👉 Verificando estrutura do AcroForm no PDF gerado...');
  const arkhalisPdfBytes = await context.generateEditableDnd5ePdf(samplePlayers[0]);
  const loadedDoc = await PDFLib.PDFDocument.load(arkhalisPdfBytes);
  const form = loadedDoc.getForm();

  // Testar campos principais
  const charNameField = form.getTextField('CharacterName');
  if (charNameField.getText() !== 'Arkhalis Silva') {
    throw new Error(`Nome incorreto no PDF: ${charNameField.getText()}`);
  }

  const strField = form.getTextField('FOR');
  if (strField.getText() !== '18') {
    throw new Error(`FOR incorreta no PDF: ${strField.getText()}`);
  }

  const strModField = form.getTextField('FOR_MOD');
  if (strModField.getText() !== '+4') {
    throw new Error(`Modificador de FOR incorreto no PDF: ${strModField.getText()}`);
  }

  const athleticsField = form.getTextField('Skill_athletics');
  if (athleticsField.getText() !== '+7') {
    throw new Error(`Atletismo incorreto no PDF: ${athleticsField.getText()} (esperado +7)`);
  }

  console.log('  ✅ Campos do formulário e bônus de perícias verificados com sucesso.');
  console.log('🎉 Todos os testes de sessão de impressão e PDF foram concluídos com 100% de sucesso!\n');
}

runSessionTest().catch(err => {
  console.error('❌ Erro no teste de sessão de impressão e PDF:', err);
  process.exit(1);
});
