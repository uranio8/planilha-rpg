// src/js/pdf_export.js - Geração de Ficha D&D 5E Oficial em PDF Editável com Auto-Cálculo (AcroForms)
// Utiliza pdf-lib para criar documento A4 interativo com campos calculáveis e scripts Acrobat JavaScript

(function (global) {
  'use strict';

  // Obter referência à biblioteca PDFLib (carregada globalmente via CDN ou require em ambiente de teste)
  function getPdfLib() {
    if (typeof PDFLib !== 'undefined') return PDFLib;
    if (typeof window !== 'undefined' && window.PDFLib) return window.PDFLib;
    if (typeof require === 'function') {
      try {
        return require('pdf-lib');
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  // Helper de normalização fonética e ortográfica de perícias (remove acentos, pontuação e caixa alta)
  function normalizeSkillKey(str) {
    if (!str) return '';
    return String(str)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '');
  }

  // Mapeamento canônico das 18 perícias do D&D 5E com atributos base e suporte total a aliases PT/EN
  const DND_SKILLS_MAPPING = [
    { key: 'acrobatics', pt: 'Acrobacia', stat: 'DES', attrKey: 'dex', aliases: ['acrobacia', 'acrobatics'] },
    { key: 'animalHandling', pt: 'Adestrar Animais', stat: 'SAB', attrKey: 'wis', aliases: ['adestramento', 'adestrar animais', 'animal handling', 'animalhandling', 'adestrar'] },
    { key: 'arcana', pt: 'Arcanismo', stat: 'INT', attrKey: 'int', aliases: ['arcanismo', 'arcana'] },
    { key: 'athletics', pt: 'Atletismo', stat: 'FOR', attrKey: 'str', aliases: ['atletismo', 'athletics'] },
    { key: 'performance', pt: 'Atuação', stat: 'CAR', attrKey: 'cha', aliases: ['atuacao', 'atuação', 'performance'] },
    { key: 'deception', pt: 'Blefar / Enganação', stat: 'CAR', attrKey: 'cha', aliases: ['enganacao', 'enganação', 'blefar', 'deception'] },
    { key: 'stealth', pt: 'Furtividade', stat: 'DES', attrKey: 'dex', aliases: ['furtividade', 'stealth'] },
    { key: 'history', pt: 'História', stat: 'INT', attrKey: 'int', aliases: ['historia', 'história', 'history'] },
    { key: 'intimidation', pt: 'Intimidação', stat: 'CAR', attrKey: 'cha', aliases: ['intimidacao', 'intimidação', 'intimidation'] },
    { key: 'insight', pt: 'Intuição', stat: 'SAB', attrKey: 'wis', aliases: ['intuicao', 'intuição', 'insight'] },
    { key: 'investigation', pt: 'Investigação', stat: 'INT', attrKey: 'int', aliases: ['investigacao', 'investigação', 'investigation'] },
    { key: 'medicine', pt: 'Medicina', stat: 'SAB', attrKey: 'wis', aliases: ['medicina', 'medicine'] },
    { key: 'nature', pt: 'Natureza', stat: 'INT', attrKey: 'int', aliases: ['natureza', 'nature'] },
    { key: 'perception', pt: 'Percepção', stat: 'SAB', attrKey: 'wis', aliases: ['percepcao', 'percepção', 'perception'] },
    { key: 'persuasion', pt: 'Persuasão', stat: 'CAR', attrKey: 'cha', aliases: ['persuasao', 'persuasão', 'persuasion'] },
    { key: 'sleightOfHand', pt: 'Prestidigitação', stat: 'DES', attrKey: 'dex', aliases: ['prestidigitacao', 'prestidigitação', 'sleight of hand', 'sleightofhand', 'ladinagem'] },
    { key: 'religion', pt: 'Religião', stat: 'INT', attrKey: 'int', aliases: ['religiao', 'religião', 'religion'] },
    { key: 'survival', pt: 'Sobrevivência', stat: 'SAB', attrKey: 'wis', aliases: ['sobrevivencia', 'sobrevivência', 'survival'] }
  ];

  // Helper para injetar script de cálculo Acrobat JS no campo AcroForm
  function attachFieldCalculation(pdfDoc, PDFLib, field, jsCode) {
    if (!field || !field.acroField || !pdfDoc) return;
    try {
      const actionDict = pdfDoc.context.obj({
        Type: 'Action',
        S: 'JavaScript',
        JS: PDFLib.PDFString.of(jsCode)
      });
      let aaDict = field.acroField.dict.get(PDFLib.PDFName.of('AA'));
      if (!aaDict) {
        aaDict = pdfDoc.context.obj({});
        field.acroField.dict.set(PDFLib.PDFName.of('AA'), aaDict);
      }
      aaDict.set(PDFLib.PDFName.of('C'), actionDict);
    } catch (e) {
      console.warn('Não foi possível acoplar cálculo JS no campo:', field.getName(), e);
    }
  }

  // Sanitiza strings para compatibilidade estrita com codificação WinAnsi das fontes padrão Helvetica
  function sanitizeWinAnsi(str) {
    if (!str) return '';
    return String(str)
      .replace(/[^\x00-\x7F\u00A0-\u00FF\u0152\u0153\u0160\u0161\u0178\u017D\u017E\u0192\u02C6\u02DC\u2013\u2014\u2018\u2019\u201A\u201C\u201D\u201E\u2020\u2021\u2022\u2026\u2030\u2039\u203A\u20AC\u2122]/g, '');
  }

  // Atribuição 100% segura e blindada contra NaN, Array, Object ou null
  function safeSetText(field, val) {
    if (!field) return;
    if (val === null || val === undefined) {
      field.setText('');
      return;
    }
    if (typeof val === 'number') {
      if (Number.isNaN(val) || !Number.isFinite(val)) {
        field.setText('');
      } else {
        field.setText(String(val));
      }
      return;
    }
    if (typeof val === 'string') {
      field.setText(sanitizeWinAnsi(val));
      return;
    }
    if (Array.isArray(val)) {
      const formatted = val.map(x => {
        if (x === null || x === undefined) return '';
        if (typeof x === 'string') return x;
        if (typeof x === 'object' && x.name) return `${x.name}${x.qty ? ` (x${x.qty})` : ''}`;
        return String(x);
      }).filter(Boolean).join('\n');
      field.setText(sanitizeWinAnsi(formatted));
      return;
    }
    if (typeof val === 'object') {
      field.setText(sanitizeWinAnsi(val.name || JSON.stringify(val)));
      return;
    }
    field.setText(sanitizeWinAnsi(String(val)));
  }

  // Gera o PDF Editável Interativo com cálculo automático para um personagem do Planilha RPG
  async function generateEditableDnd5ePdf(playerData) {
    const PDFLib = getPdfLib();
    if (!PDFLib) {
      throw new Error('A biblioteca PDF-Lib não foi encontrada. Verifique sua conexão com a internet para carregar o módulo.');
    }

    const { PDFDocument, StandardFonts, rgb, PDFName } = PDFLib;
    const doc = await PDFDocument.create();

    const fontRegular = await doc.embedFont(StandardFonts.Helvetica);
    const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);

    const form = doc.getForm();
    const p = playerData || {};

    // Normalizações robustas de campos (compatíveis com localStorage, Firebase e instâncias legadas)
    const charName = String(p.name || 'Personagem');
    const charClass = String(p.className || '');
    const charLevel = Number(p.level) || 1;
    const charRace = String(p.race || '');
    const charStudent = String(p.student || '');
    const charBg = String(p.background || '');
    const charAlign = String(p.alignment || 'Neutro');
    const charXp = String(p.xp !== undefined ? p.xp : 0);

    const charStr = Number(p.str) || 10;
    const charDex = Number(p.dex) || 10;
    const charCon = Number(p.con) || 10;
    const charInt = Number(p.int) || 10;
    const charWis = Number(p.wis) || 10;
    const charCha = Number(p.cha) || 10;

    const charHpMax = Number(p.hpMax !== undefined ? p.hpMax : (p.maxHp !== undefined ? p.maxHp : 10)) || 10;
    const charHpCur = Number(p.hpCurrent !== undefined ? p.hpCurrent : (p.hp !== undefined ? p.hp : charHpMax)) || charHpMax;
    const charHpTemp = Number(p.hpTemp !== undefined ? p.hpTemp : (p.tempHp !== undefined ? p.tempHp : 0)) || 0;

    const saveProfs = Array.isArray(p.savingThrows) ? p.savingThrows : (Array.isArray(p.saveProficiencies) ? p.saveProficiencies : []);
    const skillProfs = Array.isArray(p.skills) ? p.skills : (Array.isArray(p.skillProficiencies) ? p.skillProficiencies : []);

    // Cores temáticas elegantes para impressão e leitura digital
    const cDark = rgb(0.08, 0.12, 0.18);
    const cGrayBg = rgb(0.96, 0.97, 0.98);
    const cBorder = rgb(0.7, 0.75, 0.82);
    const cGold = rgb(0.75, 0.52, 0.05);
    const cWhite = rgb(1, 1, 1);
    const cMuted = rgb(0.4, 0.45, 0.52);

    // Lista para ordenação de cálculo (/CO)
    const calculationFieldsOrder = [];

    // ==========================================
    // PÁGINA 1: ATRIBUTOS, COMBATE, PERÍCIAS
    // ==========================================
    const page1 = doc.addPage();
    page1.setSize(595.28, 841.89); // A4 em pontos (72 dpi)
    const p1Width = 595.28;
    const p1Height = 841.89;

    // Cabeçalho Principal Decorativo
    page1.drawRectangle({
      x: 20, y: p1Height - 88,
      width: p1Width - 40, height: 68,
      color: cGrayBg,
      borderColor: cGold,
      borderWidth: 1.5
    });

    // Logo / Título D&D 5E
    page1.drawText('D&D 5E FICHA OFICIAL INTERATIVA', {
      x: 32, y: p1Height - 38,
      size: 13,
      font: fontBold,
      color: cGold
    });

    // Campo: Nome do Personagem
    page1.drawText('NOME DO PERSONAGEM', { x: 32, y: p1Height - 80, size: 7, font: fontBold, color: cMuted });
    const fCharName = form.createTextField('CharacterName');
    safeSetText(fCharName, charName);
    fCharName.addToPage(page1, { x: 32, y: p1Height - 70, width: 170, height: 18 });

    // Grid de Metadados do Cabeçalho
    const formattedClassLevel = (p.multiclass && typeof p.multiclass === 'string' && p.multiclass.trim())
      ? `${p.multiclass} (Nv ${charLevel})`
      : `${charClass} ${charLevel}`;

    const metaCols = [
      { label: 'CLASSE E NÍVEL', name: 'ClassLevel', val: formattedClassLevel, x: 215, y: p1Height - 48, w: 110 },
      { label: 'ANTECEDENTE', name: 'Background', val: charBg, x: 335, y: p1Height - 48, w: 105 },
      { label: 'JOGADOR / ALUNO', name: 'PlayerName', val: charStudent, x: 450, y: p1Height - 48, w: 110 },
      { label: 'RAÇA / ESPÉCIE', name: 'Race', val: charRace, x: 215, y: p1Height - 78, w: 110 },
      { label: 'TENDÊNCIA', name: 'Alignment', val: charAlign, x: 335, y: p1Height - 78, w: 105 },
      { label: 'EXP (XP)', name: 'XP', val: charXp, x: 450, y: p1Height - 78, w: 110 }
    ];

    metaCols.forEach(m => {
      page1.drawText(m.label, { x: m.x, y: m.y - 4, size: 6.5, font: fontBold, color: cMuted });
      const tf = form.createTextField(m.name);
      safeSetText(tf, m.val);
      tf.addToPage(page1, { x: m.x, y: m.y + 7, width: m.w, height: 16 });
    });

    // ------------------------------------------
    // COLUNA 1: ATRIBUTOS E MODIFICADORES COM AUTO-CÁLCULO
    // ------------------------------------------
    const statsDefs = [
      { key: 'FOR', label: 'FORÇA', val: charStr, y: p1Height - 165 },
      { key: 'DES', label: 'DESTREZA', val: charDex, y: p1Height - 235 },
      { key: 'CON', label: 'CONSTITUIÇÃO', val: charCon, y: p1Height - 305 },
      { key: 'INT', label: 'INTELIGÊNCIA', val: charInt, y: p1Height - 375 },
      { key: 'SAB', label: 'SABEDORIA', val: charWis, y: p1Height - 445 },
      { key: 'CAR', label: 'CARISMA', val: charCha, y: p1Height - 515 }
    ];

    statsDefs.forEach(s => {
      page1.drawRectangle({
        x: 24, y: s.y,
        width: 60, height: 60,
        color: cWhite,
        borderColor: cBorder,
        borderWidth: 1.2
      });

      page1.drawText(s.label, {
        x: 27, y: s.y + 49,
        size: 7,
        font: fontBold,
        color: cDark
      });

      const modFieldName = `${s.key}_MOD`;
      const modField = form.createTextField(modFieldName);
      const initialMod = Math.floor((s.val - 10) / 2);
      safeSetText(modField, (initialMod >= 0 ? '+' : '') + initialMod);
      modField.addToPage(page1, { x: 30, y: s.y + 19, width: 48, height: 26 });

      page1.drawRectangle({
        x: 37, y: s.y + 4,
        width: 34, height: 14,
        color: cGrayBg,
        borderColor: cBorder,
        borderWidth: 1
      });
      const scoreField = form.createTextField(s.key);
      safeSetText(scoreField, String(s.val));
      scoreField.addToPage(page1, { x: 39, y: s.y + 5, width: 30, height: 12 });

      const calcJs = `
        var v = this.getField("${s.key}").value;
        if (v !== "" && !isNaN(v)) {
          var m = Math.floor((Number(v) - 10) / 2);
          event.value = (m >= 0 ? "+" + m : "" + m);
        } else {
          event.value = "+0";
        }
      `;
      attachFieldCalculation(doc, PDFLib, modField, calcJs);
      calculationFieldsOrder.push(modField);
    });

    // Inspiração e Bônus de Proficiência
    page1.drawRectangle({ x: 96, y: p1Height - 128, width: 104, height: 24, color: cWhite, borderColor: cBorder, borderWidth: 1 });
    page1.drawText('INSPIRAÇÃO', { x: 130, y: p1Height - 119, size: 7.5, font: fontBold, color: cDark });
    const chkInsp = form.createCheckBox('Inspiration');
    if (p.inspiration) chkInsp.check();
    chkInsp.addToPage(page1, { x: 104, y: p1Height - 124, width: 16, height: 16 });

    page1.drawRectangle({ x: 96, y: p1Height - 160, width: 104, height: 26, color: cWhite, borderColor: cBorder, borderWidth: 1 });
    page1.drawText('BÔNUS PROFICIÊNCIA', { x: 126, y: p1Height - 150, size: 6.5, font: fontBold, color: cDark });
    const fProf = form.createTextField('ProfBonus');
    const calcProfInitial = Math.floor((charLevel - 1) / 4) + 2;
    safeSetText(fProf, '+' + calcProfInitial);
    fProf.addToPage(page1, { x: 100, y: p1Height - 156, width: 22, height: 18 });

    // ------------------------------------------
    // TESTES DE RESISTÊNCIA (SALVAGUARDAS) VINCULADOS
    // ------------------------------------------
    page1.drawRectangle({ x: 96, y: p1Height - 275, width: 104, height: 108, color: cWhite, borderColor: cBorder, borderWidth: 1 });
    page1.drawText('TESTES DE RESISTÊNCIA', { x: 102, y: p1Height - 175, size: 7, font: fontBold, color: cDark });

    const saveStats = [
      { key: 'FOR', pt: 'Força', val: charStr, y: p1Height - 192 },
      { key: 'DES', pt: 'Destreza', val: charDex, y: p1Height - 207 },
      { key: 'CON', pt: 'Constituição', val: charCon, y: p1Height - 222 },
      { key: 'INT', pt: 'Inteligência', val: charInt, y: p1Height - 237 },
      { key: 'SAB', pt: 'Sabedoria', val: charWis, y: p1Height - 252 },
      { key: 'CAR', pt: 'Carisma', val: charCha, y: p1Height - 267 }
    ];

    saveStats.forEach(sv => {
      const chkName = `Check_Save_${sv.key}`;
      const valName = `Save_${sv.key}`;
      const chk = form.createCheckBox(chkName);
      const isProf = saveProfs.some(x => String(x).toLowerCase() === sv.key.toLowerCase());
      if (isProf) chk.check();
      chk.addToPage(page1, { x: 100, y: sv.y, width: 10, height: 10 });

      const tv = form.createTextField(valName);
      const baseMod = Math.floor((sv.val - 10) / 2);
      const totalSave = baseMod + (isProf ? calcProfInitial : 0);
      safeSetText(tv, (totalSave >= 0 ? '+' : '') + totalSave);
      tv.addToPage(page1, { x: 114, y: sv.y - 1, width: 18, height: 12 });

      page1.drawText(sv.pt, { x: 136, y: sv.y + 2, size: 7.5, font: fontRegular, color: cDark });

      const saveJs = `
        var m = Number(this.getField("${sv.key}_MOD").value) || 0;
        var p = Number(this.getField("ProfBonus").value) || 2;
        var chk = this.getField("${chkName}").value !== "Off";
        var total = m + (chk ? p : 0);
        event.value = (total >= 0 ? "+" + total : "" + total);
      `;
      attachFieldCalculation(doc, PDFLib, tv, saveJs);
      calculationFieldsOrder.push(tv);
    });

    // ------------------------------------------
    // PERÍCIAS VINCULADAS COM CÁLCULO AUTOMÁTICO
    // ------------------------------------------
    page1.drawRectangle({ x: 96, y: p1Height - 575, width: 104, height: 292, color: cWhite, borderColor: cBorder, borderWidth: 1 });
    page1.drawText('PERÍCIAS', { x: 130, y: p1Height - 290, size: 8, font: fontBold, color: cDark });

    const attrMapValues = { str: charStr, dex: charDex, con: charCon, int: charInt, wis: charWis, cha: charCha };

    DND_SKILLS_MAPPING.forEach((sk, idx) => {
      const yLine = p1Height - 306 - (idx * 15.5);
      const chkName = `Check_Skill_${sk.key}`;
      const valName = `Skill_${sk.key}`;

      const chk = form.createCheckBox(chkName);
      const isProf = skillProfs.some(sp => {
        const normSp = normalizeSkillKey(sp);
        if (!normSp) return false;
        return (sk.aliases && sk.aliases.some(alias => normalizeSkillKey(alias) === normSp)) ||
               normalizeSkillKey(sk.key) === normSp ||
               normalizeSkillKey(sk.pt) === normSp;
      });
      if (isProf) chk.check();
      chk.addToPage(page1, { x: 100, y: yLine, width: 9, height: 9 });

      const tv = form.createTextField(valName);
      const baseStat = attrMapValues[sk.attrKey] || 10;
      const baseMod = Math.floor((baseStat - 10) / 2);
      const totalSkill = baseMod + (isProf ? calcProfInitial : 0);
      safeSetText(tv, (totalSkill >= 0 ? '+' : '') + totalSkill);
      tv.addToPage(page1, { x: 112, y: yLine - 1, width: 18, height: 11 });

      page1.drawText(`${sk.pt} (${sk.stat})`, { x: 133, y: yLine + 2, size: 6.5, font: fontRegular, color: cDark });

      const skillJs = `
        var m = Number(this.getField("${sk.stat}_MOD").value) || 0;
        var p = Number(this.getField("ProfBonus").value) || 2;
        var chk = this.getField("${chkName}").value !== "Off";
        var total = m + (chk ? p : 0);
        event.value = (total >= 0 ? "+" + total : "" + total);
      `;
      attachFieldCalculation(doc, PDFLib, tv, skillJs);
      calculationFieldsOrder.push(tv);
    });

    // ------------------------------------------
    // SENTIDOS PASSIVOS DO MESTRE (PERCEPÇÃO, INVESTIGAÇÃO E INTUIÇÃO)
    // ------------------------------------------
    page1.drawRectangle({ x: 24, y: p1Height - 636, width: 176, height: 58, color: cWhite, borderColor: cBorder, borderWidth: 1 });
    page1.drawText('SENTIDOS PASSIVOS (MESTRE)', { x: 42, y: p1Height - 586, size: 6.5, font: fontBold, color: cDark });

    // 1. Percepção Passiva (SAB)
    const fPassPerc = form.createTextField('Passive_Perception');
    const percProf = skillProfs.some(sp => {
      const n = normalizeSkillKey(sp);
      return n.includes('percep') || n === 'perception';
    });
    const initialPassPerc = 10 + Math.floor((charWis - 10) / 2) + (percProf ? calcProfInitial : 0);
    safeSetText(fPassPerc, String(initialPassPerc));
    fPassPerc.addToPage(page1, { x: 28, y: p1Height - 601, width: 20, height: 11 });
    page1.drawText('Percepção Passiva (SAB)', { x: 52, y: p1Height - 598, size: 6, font: fontRegular, color: cDark });

    const passPercJs = `
      var p = Number(this.getField("Skill_perception").value) || 0;
      event.value = 10 + p;
    `;
    attachFieldCalculation(doc, PDFLib, fPassPerc, passPercJs);
    calculationFieldsOrder.push(fPassPerc);

    // 2. Investigação Passiva (INT)
    const fPassInvest = form.createTextField('Passive_Investigation');
    const investProf = skillProfs.some(sp => {
      const n = normalizeSkillKey(sp);
      return n.includes('investig') || n === 'investigation';
    });
    const initialPassInvest = 10 + Math.floor((charInt - 10) / 2) + (investProf ? calcProfInitial : 0);
    safeSetText(fPassInvest, String(initialPassInvest));
    fPassInvest.addToPage(page1, { x: 28, y: p1Height - 616, width: 20, height: 11 });
    page1.drawText('Investigação Passiva (INT)', { x: 52, y: p1Height - 613, size: 6, font: fontRegular, color: cDark });

    const passInvestJs = `
      var p = Number(this.getField("Skill_investigation").value) || 0;
      event.value = 10 + p;
    `;
    attachFieldCalculation(doc, PDFLib, fPassInvest, passInvestJs);
    calculationFieldsOrder.push(fPassInvest);

    // 3. Intuição Passiva (SAB)
    const fPassInsight = form.createTextField('Passive_Insight');
    const insightProf = skillProfs.some(sp => {
      const n = normalizeSkillKey(sp);
      return n.includes('intui') || n === 'insight';
    });
    const initialPassInsight = 10 + Math.floor((charWis - 10) / 2) + (insightProf ? calcProfInitial : 0);
    safeSetText(fPassInsight, String(initialPassInsight));
    fPassInsight.addToPage(page1, { x: 28, y: p1Height - 631, width: 20, height: 11 });
    page1.drawText('Intuição Passiva (SAB)', { x: 52, y: p1Height - 628, size: 6, font: fontRegular, color: cDark });

    const passInsightJs = `
      var p = Number(this.getField("Skill_insight").value) || 0;
      event.value = 10 + p;
    `;
    attachFieldCalculation(doc, PDFLib, fPassInsight, passInsightJs);
    calculationFieldsOrder.push(fPassInsight);

    // Outras Proficiências e Idiomas
    page1.drawRectangle({ x: 24, y: p1Height - 805, width: 176, height: 164, color: cWhite, borderColor: cBorder, borderWidth: 1 });
    page1.drawText('OUTRAS PROFICIÊNCIAS & IDIOMAS', { x: 30, y: p1Height - 648, size: 6.5, font: fontBold, color: cDark });
    const fProfLang = form.createTextField('Proficiencies_Languages');
    fProfLang.enableMultiline();
    let initialProfText = (p.languages ? `Idiomas: ${p.languages}\n` : 'Idiomas: Comum\n');
    if (p.proficiencies) initialProfText += `Armaduras/Armas: ${p.proficiencies}\n`;
    if (p.armorProficiencies) initialProfText += `Armaduras: ${p.armorProficiencies}\n`;
    if (p.weaponProficiencies) initialProfText += `Armas: ${p.weaponProficiencies}\n`;
    if (p.tools) initialProfText += `Ferramentas: ${p.tools}\n`;
    safeSetText(fProfLang, initialProfText);
    fProfLang.addToPage(page1, { x: 28, y: p1Height - 800, width: 168, height: 148 });

    // ------------------------------------------
    // COLUNA 2: COMBATE, PV, ATAQUES & MAGIAS
    // ------------------------------------------
    const dexModInitial = Math.floor((charDex - 10) / 2);
    const charInitVal = (p.initiative !== undefined && !Number.isNaN(Number(p.initiative)))
      ? (Number(p.initiative) >= 0 ? '+' + p.initiative : '' + p.initiative)
      : (dexModInitial >= 0 ? '+' + dexModInitial : '' + dexModInitial);

    const combatBoxes = [
      { label: 'CLASSE DE ARMADURA', name: 'AC', val: String(p.ac || 10), x: 215, w: 56 },
      { label: 'INICIATIVA', name: 'Initiative', val: charInitVal, x: 277, w: 56 },
      { label: 'DESLOCAMENTO', name: 'Speed', val: `${p.speed || 9}m`, x: 339, w: 56 }
    ];

    combatBoxes.forEach(cb => {
      page1.drawRectangle({ x: cb.x, y: p1Height - 165, width: cb.w, height: 50, color: cWhite, borderColor: cBorder, borderWidth: 1.2 });
      page1.drawText(cb.label, { x: cb.x + 3, y: p1Height - 124, size: 5.5, font: fontBold, color: cMuted });
      const f = form.createTextField(cb.name);
      safeSetText(f, cb.val);
      f.addToPage(page1, { x: cb.x + 6, y: p1Height - 160, width: cb.w - 12, height: 32 });

      if (cb.name === 'Initiative') {
        const initJs = `
          var dexMod = this.getField("DES_MOD").value;
          event.value = dexMod;
        `;
        attachFieldCalculation(doc, PDFLib, f, initJs);
        calculationFieldsOrder.push(f);
      }
    });

    // Bloco de Pontos de Vida (PV)
    page1.drawRectangle({ x: 215, y: p1Height - 275, width: 180, height: 104, color: cWhite, borderColor: cBorder, borderWidth: 1.2 });
    page1.drawText('PONTOS DE VIDA MÁXIMOS:', { x: 222, y: p1Height - 180, size: 6.5, font: fontBold, color: cMuted });
    const fHpMax = form.createTextField('HP_Max');
    safeSetText(fHpMax, String(charHpMax));
    fHpMax.addToPage(page1, { x: 325, y: p1Height - 183, width: 62, height: 14 });

    page1.drawText('PONTOS DE VIDA ATUAIS', { x: 250, y: p1Height - 200, size: 7, font: fontBold, color: cDark });
    const fHpCur = form.createTextField('HP_Current');
    safeSetText(fHpCur, String(charHpCur));
    fHpCur.addToPage(page1, { x: 245, y: p1Height - 238, width: 120, height: 32 });

    page1.drawText('PONTOS DE VIDA TEMPORÁRIOS', { x: 235, y: p1Height - 250, size: 6.5, font: fontBold, color: cMuted });
    const fHpTemp = form.createTextField('HP_Temp');
    safeSetText(fHpTemp, String(charHpTemp));
    fHpTemp.addToPage(page1, { x: 245, y: p1Height - 270, width: 120, height: 16 });

    // Dados de Vida e Salvaguardas contra a Morte
    page1.drawRectangle({ x: 215, y: p1Height - 335, width: 86, height: 55, color: cWhite, borderColor: cBorder, borderWidth: 1 });
    page1.drawText('DADOS DE VIDA', { x: 225, y: p1Height - 290, size: 6.5, font: fontBold, color: cDark });
    const fHitDice = form.createTextField('Hit_Dice');
    const spentHd = Number(p.spentHitDice) || 0;
    const baseHdFormula = p.hitDice ? `${p.hitDice}` : `${charLevel}d8`;
    const hdDisplay = spentHd > 0
      ? `${baseHdFormula}\n(Disp: ${Math.max(0, charLevel - spentHd)}/${charLevel})`
      : baseHdFormula;
    safeSetText(fHitDice, hdDisplay);
    fHitDice.addToPage(page1, { x: 222, y: p1Height - 328, width: 72, height: 32 });

    page1.drawRectangle({ x: 309, y: p1Height - 335, width: 86, height: 55, color: cWhite, borderColor: cBorder, borderWidth: 1 });
    page1.drawText('SALVAS / MORTE', { x: 318, y: p1Height - 290, size: 6.5, font: fontBold, color: cDark });
    
    const curSuccess = Number(p.deathSaves?.success || (p.death_saves?.success)) || 0;
    const curFail = Number(p.deathSaves?.fail || (p.death_saves?.fail)) || 0;

    page1.drawText('Sucessos:', { x: 314, y: p1Height - 306, size: 6, font: fontRegular, color: cDark });
    const dsS1 = form.createCheckBox('DeathSave_S1');
    const dsS2 = form.createCheckBox('DeathSave_S2');
    const dsS3 = form.createCheckBox('DeathSave_S3');
    if (curSuccess >= 1) dsS1.check();
    if (curSuccess >= 2) dsS2.check();
    if (curSuccess >= 3) dsS3.check();
    dsS1.addToPage(page1, { x: 350, y: p1Height - 308, width: 8, height: 8 });
    dsS2.addToPage(page1, { x: 362, y: p1Height - 308, width: 8, height: 8 });
    dsS3.addToPage(page1, { x: 374, y: p1Height - 308, width: 8, height: 8 });

    page1.drawText('Falhas:', { x: 314, y: p1Height - 322, size: 6, font: fontRegular, color: cDark });
    const dsF1 = form.createCheckBox('DeathSave_F1');
    const dsF2 = form.createCheckBox('DeathSave_F2');
    const dsF3 = form.createCheckBox('DeathSave_F3');
    if (curFail >= 1) dsF1.check();
    if (curFail >= 2) dsF2.check();
    if (curFail >= 3) dsF3.check();
    dsF1.addToPage(page1, { x: 350, y: p1Height - 324, width: 8, height: 8 });
    dsF2.addToPage(page1, { x: 362, y: p1Height - 324, width: 8, height: 8 });
    dsF3.addToPage(page1, { x: 374, y: p1Height - 324, width: 8, height: 8 });

    // Tabela de Ataques e Conjuração
    page1.drawRectangle({ x: 215, y: p1Height - 575, width: 180, height: 234, color: cWhite, borderColor: cBorder, borderWidth: 1 });
    page1.drawText('ATAQUES & CONJURAÇÃO', { x: 250, y: p1Height - 350, size: 8, font: fontBold, color: cDark });
    page1.drawText('NOME DO ATAQUE', { x: 220, y: p1Height - 364, size: 6, font: fontBold, color: cMuted });
    page1.drawText('BÔNUS', { x: 298, y: p1Height - 364, size: 6, font: fontBold, color: cMuted });
    page1.drawText('DANO / TIPO', { x: 335, y: p1Height - 364, size: 6, font: fontBold, color: cMuted });

    // Resolução robusta de ataques (suporte a array de objetos, array de strings ou string formatada)
    let initialAttacks = [];
    if (typeof getPlayerCalculatedAttacks === 'function') {
      try {
        const calced = getPlayerCalculatedAttacks(p);
        if (Array.isArray(calced) && calced.length > 0) {
          initialAttacks = calced.map(a => ({ name: a.name || '', bonus: a.hit || a.bonus || '', damage: a.dmg || a.damage || '' }));
        }
      } catch (e) {}
    }
    if (initialAttacks.length === 0) {
      if (Array.isArray(p.attacks)) {
        initialAttacks = p.attacks.map(atk => {
          if (typeof atk === 'string') {
            const m = atk.match(/^([^(]+)(?:\(([^,]+),\s*([^)]+)\))?/);
            return m ? { name: m[1].trim(), bonus: (m[2] || '').trim(), damage: (m[3] || '').trim() } : { name: atk.trim(), bonus: '', damage: '' };
          }
          return atk || { name: '', bonus: '', damage: '' };
        });
      } else if (typeof p.attacks === 'string' && p.attacks.trim()) {
        const parts = p.attacks.split(/(?:\||\n|;)/);
        initialAttacks = parts.map(pt => {
          const m = pt.match(/^([^(]+)(?:\(([^,]+),\s*([^)]+)\))?/);
          return m ? { name: m[1].trim(), bonus: (m[2] || '').trim(), damage: (m[3] || '').trim() } : { name: pt.trim(), bonus: '', damage: '' };
        });
      }
    }
    if (initialAttacks.length === 0) {
      initialAttacks = [
        { name: 'Ataque Desarmado', bonus: '+' + (Math.floor((charStr - 10) / 2) + calcProfInitial), damage: '1 + ' + Math.floor((charStr - 10) / 2) }
      ];
    }

    for (let i = 0; i < 4; i++) {
      const yAtk = p1Height - 380 - (i * 20);
      const atk = initialAttacks[i] || { name: '', bonus: '', damage: '' };

      const fName = form.createTextField(`Attack_Name_${i + 1}`);
      safeSetText(fName, atk.name || '');
      fName.addToPage(page1, { x: 218, y: yAtk, width: 76, height: 14 });

      const fBon = form.createTextField(`Attack_Bonus_${i + 1}`);
      safeSetText(fBon, atk.bonus || '');
      fBon.addToPage(page1, { x: 298, y: yAtk, width: 32, height: 14 });

      const fDmg = form.createTextField(`Attack_Damage_${i + 1}`);
      safeSetText(fDmg, atk.damage || '');
      fDmg.addToPage(page1, { x: 334, y: yAtk, width: 57, height: 14 });
    }

    // Área de Texto Adicional de Magias/Ataques
    const fAtkNotes = form.createTextField('Attacks_Notes');
    fAtkNotes.enableMultiline();
    safeSetText(fAtkNotes, p.attackNotes || 'Anotações táticas de combate, truques de ataque ou manobras especiais.');
    fAtkNotes.addToPage(page1, { x: 218, y: p1Height - 570, width: 174, height: 100 });

    // ------------------------------------------
    // COLUNA 3: PERSONALIDADE, IDEAIS, CARACTERÍSTICAS
    // ------------------------------------------
    const traitsBoxes = [
      { label: 'TRAÇOS DE PERSONALIDADE', name: 'Personality_Traits', val: p.personality || '', y: p1Height - 170, h: 55 },
      { label: 'IDEAIS', name: 'Ideals', val: p.ideals || p.ideal || '', y: p1Height - 232, h: 55 },
      { label: 'VÍNCULOS', name: 'Bonds', val: p.bonds || p.bond || '', y: p1Height - 294, h: 55 },
      { label: 'DEFEITOS', name: 'Flaws', val: p.flaws || p.flaw || '', y: p1Height - 356, h: 55 }
    ];

    traitsBoxes.forEach(tb => {
      page1.drawRectangle({ x: 405, y: tb.y, width: 166, height: tb.h, color: cWhite, borderColor: cBorder, borderWidth: 1 });
      page1.drawText(tb.label, { x: 412, y: tb.y + tb.h - 10, size: 6.5, font: fontBold, color: cMuted });
      const f = form.createTextField(tb.name);
      f.enableMultiline();
      safeSetText(f, tb.val);
      f.addToPage(page1, { x: 409, y: tb.y + 3, width: 158, height: tb.h - 16 });
    });

    // Características e Habilidades (Features & Traits)
    page1.drawRectangle({ x: 405, y: p1Height - 575, width: 166, height: 212, color: cWhite, borderColor: cBorder, borderWidth: 1 });
    page1.drawText('CARACTERÍSTICAS & HABILIDADES', { x: 412, y: p1Height - 373, size: 7, font: fontBold, color: cDark });
    const fFeatures = form.createTextField('Features_Traits');
    fFeatures.enableMultiline();
    let initialFeatText = '';
    const resolveFeaturesFn = (typeof getPlayerAllFeaturesAndTraits === 'function')
      ? getPlayerAllFeaturesAndTraits
      : (typeof window !== 'undefined' && typeof window.getPlayerAllFeaturesAndTraits === 'function' ? window.getPlayerAllFeaturesAndTraits : null);

    if (resolveFeaturesFn) {
      const allFeats = resolveFeaturesFn(p);
      if (Array.isArray(allFeats) && allFeats.length > 0) {
        initialFeatText = allFeats.map(feat => `• ${feat.name}${feat.category ? ` [${feat.category}]` : ''}${feat.desc ? `: ${feat.desc.replace(/\*\*/g, '')}` : ''}`).join('\n\n');
      }
    }

    if (!initialFeatText) {
      if (p.classFeatures && Array.isArray(p.classFeatures)) {
        initialFeatText = p.classFeatures.map(feat => `• ${feat.name || feat}: ${feat.desc || ''}`).join('\n\n');
      } else if (p.features) {
        initialFeatText = typeof p.features === 'string' ? p.features : JSON.stringify(p.features);
      }
    }
    safeSetText(fFeatures, initialFeatText || p.notes || '');
    fFeatures.addToPage(page1, { x: 409, y: p1Height - 570, width: 158, height: 190 });

    // Rodapé da Página 1
    page1.drawText(`Ficha D&D 5E Editável • ${charName} • Página 1 de 2 • Clube de RPG`, {
      x: 32, y: 18, size: 8, font: fontRegular, color: cMuted
    });

    // ==========================================
    // PÁGINA 2: INVENTÁRIO, MOEDAS, GRIMÓRIO DE MAGIAS COM AUTO-CÁLCULO
    // ==========================================
    const page2 = doc.addPage();
    page2.setSize(595.28, 841.89);
    const p2Height = 841.89;

    // Cabeçalho da Página 2
    page2.drawRectangle({
      x: 20, y: p2Height - 65,
      width: p1Width - 40, height: 48,
      color: cGrayBg,
      borderColor: cGold,
      borderWidth: 1.5
    });

    page2.drawText('DETALHES, INVENTÁRIO & CONJURAÇÃO', {
      x: 32, y: p2Height - 34,
      size: 11,
      font: fontBold,
      color: cGold
    });

    page2.drawText(`${charName} (${charClass})`, {
      x: 32, y: p2Height - 50,
      size: 9,
      font: fontRegular,
      color: cDark
    });

    // ------------------------------------------
    // SEÇÃO DE MAGIA COM AUTO-CÁLCULO DE CD E ATAQUE
    // ------------------------------------------
    page2.drawRectangle({ x: 20, y: p2Height - 165, width: p1Width - 40, height: 92, color: cWhite, borderColor: cBorder, borderWidth: 1.2 });
    page2.drawText('CONJURAÇÃO DE MAGIA (D&D 5E)', { x: 30, y: p2Height - 84, size: 9, font: fontBold, color: cDark });

    const spellMeta = [
      { label: 'CLASSE CONJURADORA', name: 'Spellcasting_Class', val: p.spellcastingClass || charClass || '', x: 30, w: 120 },
      { label: 'HABILIDADE CHAVE', name: 'Spellcasting_Ability', val: p.spellAbility || 'INT', x: 160, w: 90 },
      { label: 'CD DE RESISTÊNCIA', name: 'Spell_Save_DC', val: '', x: 260, w: 100 },
      { label: 'BÔNUS DE ATAQUE', name: 'Spell_Attack_Bonus', val: '', x: 370, w: 100 }
    ];

    spellMeta.forEach(sm => {
      page2.drawText(sm.label, { x: sm.x, y: p2Height - 105, size: 6.5, font: fontBold, color: cMuted });
      const tf = form.createTextField(sm.name);
      tf.addToPage(page2, { x: sm.x, y: p2Height - 138, width: sm.w, height: 30 });

      if (sm.name === 'Spell_Save_DC') {
        let spellKeyMod = Math.floor((charInt - 10) / 2);
        const sAb = (p.spellAbility || 'INT').toUpperCase();
        if (sAb.includes('FOR') || sAb.includes('STR')) spellKeyMod = Math.floor((charStr - 10) / 2);
        else if (sAb.includes('DES') || sAb.includes('DEX')) spellKeyMod = Math.floor((charDex - 10) / 2);
        else if (sAb.includes('CON')) spellKeyMod = Math.floor((charCon - 10) / 2);
        else if (sAb.includes('INT')) spellKeyMod = Math.floor((charInt - 10) / 2);
        else if (sAb.includes('SAB') || sAb.includes('WIS')) spellKeyMod = Math.floor((charWis - 10) / 2);
        else if (sAb.includes('CAR') || sAb.includes('CHA')) spellKeyMod = Math.floor((charCha - 10) / 2);

        safeSetText(tf, String(8 + calcProfInitial + spellKeyMod));
        const dcJs = `
          var prof = Number(this.getField("ProfBonus").value) || 2;
          var ab = (this.getField("Spellcasting_Ability").value || "INT").toUpperCase().trim();
          var mod = 0;
          if (ab.indexOf("FOR") >= 0 || ab.indexOf("STR") >= 0) mod = Number(this.getField("FOR_MOD").value) || 0;
          else if (ab.indexOf("DES") >= 0 || ab.indexOf("DEX") >= 0) mod = Number(this.getField("DES_MOD").value) || 0;
          else if (ab.indexOf("CON") >= 0) mod = Number(this.getField("CON_MOD").value) || 0;
          else if (ab.indexOf("INT") >= 0) mod = Number(this.getField("INT_MOD").value) || 0;
          else if (ab.indexOf("SAB") >= 0 || ab.indexOf("WIS") >= 0) mod = Number(this.getField("SAB_MOD").value) || 0;
          else if (ab.indexOf("CAR") >= 0 || ab.indexOf("CHA") >= 0) mod = Number(this.getField("CAR_MOD").value) || 0;
          event.value = 8 + prof + mod;
        `;
        attachFieldCalculation(doc, PDFLib, tf, dcJs);
        calculationFieldsOrder.push(tf);
      } else if (sm.name === 'Spell_Attack_Bonus') {
        let spellKeyMod = Math.floor((charInt - 10) / 2);
        const sAb = (p.spellAbility || 'INT').toUpperCase();
        if (sAb.includes('FOR') || sAb.includes('STR')) spellKeyMod = Math.floor((charStr - 10) / 2);
        else if (sAb.includes('DES') || sAb.includes('DEX')) spellKeyMod = Math.floor((charDex - 10) / 2);
        else if (sAb.includes('CON')) spellKeyMod = Math.floor((charCon - 10) / 2);
        else if (sAb.includes('INT')) spellKeyMod = Math.floor((charInt - 10) / 2);
        else if (sAb.includes('SAB') || sAb.includes('WIS')) spellKeyMod = Math.floor((charWis - 10) / 2);
        else if (sAb.includes('CAR') || sAb.includes('CHA')) spellKeyMod = Math.floor((charCha - 10) / 2);

        const totAtk = calcProfInitial + spellKeyMod;
        safeSetText(tf, (totAtk >= 0 ? '+' : '') + totAtk);
        const atkJs = `
          var prof = Number(this.getField("ProfBonus").value) || 2;
          var ab = (this.getField("Spellcasting_Ability").value || "INT").toUpperCase().trim();
          var mod = 0;
          if (ab.indexOf("FOR") >= 0 || ab.indexOf("STR") >= 0) mod = Number(this.getField("FOR_MOD").value) || 0;
          else if (ab.indexOf("DES") >= 0 || ab.indexOf("DEX") >= 0) mod = Number(this.getField("DES_MOD").value) || 0;
          else if (ab.indexOf("CON") >= 0) mod = Number(this.getField("CON_MOD").value) || 0;
          else if (ab.indexOf("INT") >= 0) mod = Number(this.getField("INT_MOD").value) || 0;
          else if (ab.indexOf("SAB") >= 0 || ab.indexOf("WIS") >= 0) mod = Number(this.getField("SAB_MOD").value) || 0;
          else if (ab.indexOf("CAR") >= 0 || ab.indexOf("CHA") >= 0) mod = Number(this.getField("CAR_MOD").value) || 0;
          var tot = prof + mod;
          event.value = (tot >= 0 ? "+" + tot : "" + tot);
        `;
        attachFieldCalculation(doc, PDFLib, tf, atkJs);
        calculationFieldsOrder.push(tf);
      } else {
        safeSetText(tf, sm.val);
      }
    });

    // ------------------------------------------
    // GRIMÓRIO: CÍRCULOS DE MAGIA E RASTREADOR DE ESPAÇOS
    // ------------------------------------------
    page2.drawRectangle({ x: 20, y: p2Height - 485, width: 340, height: 310, color: cWhite, borderColor: cBorder, borderWidth: 1 });
    page2.drawText('GRIMÓRIO & ESPAÇOS DE MAGIA', { x: 30, y: p2Height - 180, size: 8, font: fontBold, color: cDark });

    // Grid de Espaços de Magia (1º ao 9º Nível com Total e Gastos)
    const rawSlots = Array.isArray(p.slots) ? p.slots : [0,0,0,0,0,0,0,0,0];
    const rawSlotsUsed = Array.isArray(p.slotsUsed) ? p.slotsUsed : [0,0,0,0,0,0,0,0,0];
    page2.drawText('ESPAÇOS (T=Total / U=Usados):', { x: 30, y: p2Height - 193, size: 5.5, font: fontBold, color: cMuted });

    for (let lvl = 1; lvl <= 9; lvl++) {
      const xSlot = 30 + ((lvl - 1) * 36.5);
      page2.drawText(`${lvl}º`, { x: xSlot + 12, y: p2Height - 204, size: 6.5, font: fontBold, color: cDark });

      const fSlotTot = form.createTextField(`Slot_Lvl_${lvl}_Total`);
      safeSetText(fSlotTot, rawSlots[lvl - 1] > 0 ? String(rawSlots[lvl - 1]) : '');
      fSlotTot.addToPage(page2, { x: xSlot, y: p2Height - 222, width: 16, height: 14 });

      const fSlotUse = form.createTextField(`Slot_Lvl_${lvl}_Used`);
      safeSetText(fSlotUse, rawSlotsUsed[lvl - 1] > 0 ? String(rawSlotsUsed[lvl - 1]) : '');
      fSlotUse.addToPage(page2, { x: xSlot + 17, y: p2Height - 222, width: 16, height: 14 });
    }

    page2.drawText('MAGIAS CONHECIDAS / PREPARADAS', { x: 30, y: p2Height - 236, size: 6.5, font: fontBold, color: cMuted });

    const fSpells = form.createTextField('Spells_List');
    fSpells.enableMultiline();
    let initialSpellText = '';
    if (Array.isArray(p.spells)) {
      initialSpellText = p.spells.map(s => {
        if (typeof s === 'string') return `• ${s}`;
        return `• ${s.name || ''} (Círculo ${s.level !== undefined ? s.level : '0'}${s.prepared ? ' - Preparada' : ''})`;
      }).join('\n');
    } else if (typeof p.spells === 'string' && p.spells.trim()) {
      initialSpellText = p.spells;
    } else if (Array.isArray(p.preparedSpells) && p.preparedSpells.length > 0) {
      initialSpellText = p.preparedSpells.map(s => `• ${s} (Preparada)`).join('\n');
    }
    safeSetText(fSpells, initialSpellText || '• Truques:\n• 1º Círculo:\n• 2º Círculo:');
    fSpells.addToPage(page2, { x: 28, y: p2Height - 480, width: 324, height: 238 });

    // ------------------------------------------
    // INVENTÁRIO, MOEDAS E TESOUROS
    // ------------------------------------------
    page2.drawRectangle({ x: 375, y: p2Height - 485, width: 200, height: 310, color: cWhite, borderColor: cBorder, borderWidth: 1 });
    page2.drawText('EQUIPAMENTO & TESOURO', { x: 385, y: p2Height - 180, size: 8, font: fontBold, color: cDark });

    // Moedas (PC, PP, PE, PO, PL)
    const coins = p.coins || { cp: 0, sp: 0, ep: 0, gp: p.gold || 0, pp: 0 };
    const coinsDef = [
      { label: 'PC', name: 'Coin_CP', val: String(coins.cp !== undefined ? coins.cp : (p.cp || 0)), x: 385 },
      { label: 'PP', name: 'Coin_SP', val: String(coins.sp !== undefined ? coins.sp : (p.sp || 0)), x: 425 },
      { label: 'PE', name: 'Coin_EP', val: String(coins.ep !== undefined ? coins.ep : (p.ep || 0)), x: 465 },
      { label: 'PO', name: 'Coin_GP', val: String(coins.gp !== undefined ? coins.gp : (p.gold || p.gp || 0)), x: 505 },
      { label: 'PL', name: 'Coin_PP', val: String(coins.pp !== undefined ? coins.pp : (p.pp || 0)), x: 545 }
    ];

    coinsDef.forEach(cn => {
      page2.drawText(cn.label, { x: cn.x + 4, y: p2Height - 194, size: 6.5, font: fontBold, color: cMuted });
      const f = form.createTextField(cn.name);
      safeSetText(f, cn.val);
      f.addToPage(page2, { x: cn.x, y: p2Height - 215, width: 32, height: 16 });
    });

    // Campo de Inventário Geral
    const fEquip = form.createTextField('Equipment_List');
    fEquip.enableMultiline();
    const rawEquip = Array.isArray(p.equipment) ? p.equipment : (Array.isArray(p.inventory) ? p.inventory : []);
    let initialEquipText = '';
    if (rawEquip.length > 0) {
      initialEquipText = rawEquip.map(eq => {
        if (typeof eq === 'string') return `• ${eq}`;
        return `• ${eq.name || 'Item'} (x${eq.qty || 1})${eq.weight ? ` - ${eq.weight}kg` : ''}${eq.equipped ? ' [Equipado]' : ''}`;
      }).join('\n');
    } else if (typeof p.inventory === 'string') {
      initialEquipText = p.inventory;
    }
    safeSetText(fEquip, initialEquipText || 'Mochila de Aventureiro, Ração de Viagem (10 dias), Tochas, Odre.');
    fEquip.addToPage(page2, { x: 383, y: p2Height - 480, width: 184, height: 255 });

    // ------------------------------------------
    // HISTÓRIA, APARÊNCIA E ANOTAÇÕES
    // ------------------------------------------
    page2.drawRectangle({ x: 20, y: 35, width: p1Width - 40, height: p2Height - 530, color: cWhite, borderColor: cBorder, borderWidth: 1 });
    page2.drawText('HISTÓRIA DO PERSONAGEM, ALIADOS E ANOTAÇÕES', { x: 30, y: p2Height - 508, size: 8, font: fontBold, color: cDark });

    const fStory = form.createTextField('Character_Backstory');
    fStory.enableMultiline();
    let backstoryContent = p.backstory || p.notes || p.playerNotes || 'Origem do herói, anotações de campanha, juramentos e alianças.';
    if (Array.isArray(p.conditions) && p.conditions.length > 0) {
      backstoryContent = `[CONDIÇÕES ATIVAS EM MESA: ${p.conditions.join(', ')}]\n\n` + backstoryContent;
    }
    safeSetText(fStory, backstoryContent);
    fStory.addToPage(page2, { x: 28, y: 45, width: p1Width - 56, height: p2Height - 565 });

    // Rodapé da Página 2
    page2.drawText(`Ficha D&D 5E Editável • ${charName} • Página 2 de 2 • Clube de RPG`, {
      x: 32, y: 18, size: 8, font: fontRegular, color: cMuted
    });

    // ------------------------------------------
    // DEFINIR ORDEM DE CÁLCULO OFICIAL (/CO)
    // ------------------------------------------
    try {
      if (form.acroForm && form.acroForm.dict && calculationFieldsOrder.length > 0) {
        form.acroForm.dict.set(
          PDFName.of('CO'),
          doc.context.obj(calculationFieldsOrder.map(f => f.acroField.ref))
        );
      }
    } catch (e) {
      console.warn('Não foi possível definir /CO no catálogo do PDF:', e);
    }

    const pdfBytes = await doc.save({ useObjectStreams: false });
    return pdfBytes;
  }

  // Exportação e Download direto no navegador
  async function exportPlayerEditablePdf(playerId) {
    try {
      const p = (typeof PLAYERS !== 'undefined' && Array.isArray(PLAYERS))
        ? PLAYERS.find(x => x.id === playerId)
        : null;

      if (!p) {
        if (typeof alert === 'function') alert('Personagem não encontrado para exportação de PDF.');
        return;
      }

      if (typeof addLog === 'function') {
        addLog(`⏳ Gerando Ficha D&D 5E em PDF Editável para <b>${p.name}</b>...`);
      }

      const pdfBytes = await generateEditableDnd5ePdf(p);
      const safeName = (p.name || 'personagem').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '_');
      const filename = `ficha_${safeName}_dnd5e_editavel.pdf`;

      let url = '';
      if (typeof Blob !== 'undefined' && typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function') {
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        url = URL.createObjectURL(blob);
      } else {
        const base64 = typeof Buffer !== 'undefined'
          ? Buffer.from(pdfBytes).toString('base64')
          : btoa(String.fromCharCode.apply(null, pdfBytes));
        url = 'data:application/pdf;base64,' + base64;
      }

      if (typeof document !== 'undefined') {
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        if (document.body) document.body.appendChild(a);
        a.click();
        if (document.body) document.body.removeChild(a);
        if (typeof URL !== 'undefined' && typeof URL.revokeObjectURL === 'function' && url.startsWith('blob:')) {
          setTimeout(() => URL.revokeObjectURL(url), 2000);
        }
      }

      if (typeof playFX === 'function') playFX('heal');
      if (typeof addLog === 'function') {
        addLog(`📄 Ficha em PDF Editável de <b>${p.name}</b> baixada com sucesso como [${filename}]!`);
      }
    } catch (err) {
      console.error('Erro na exportação de PDF editável:', err);
      if (typeof alert === 'function') {
        alert('Erro ao gerar PDF editável: ' + (err.message || err));
      }
    }
  }

  function exportCurrentModalPlayerEditablePdf() {
    let curId = (typeof currentPrintPlayerId !== 'undefined' && currentPrintPlayerId)
      || (typeof window !== 'undefined' && window.currentPrintPlayerId)
      || (typeof activePortalPlayerId !== 'undefined' && activePortalPlayerId)
      || (typeof window !== 'undefined' && window.activePortalPlayerId)
      || (typeof document !== 'undefined' && document.getElementById('pm-id') ? document.getElementById('pm-id').value : null);

    if (!curId && typeof document !== 'undefined') {
      const el = document.querySelector('#print-sheet-content [data-player-id]');
      if (el) curId = el.getAttribute('data-player-id');
    }

    if (!curId && typeof PLAYERS !== 'undefined' && Array.isArray(PLAYERS) && PLAYERS.length === 1) {
      curId = PLAYERS[0].id;
    }

    if (curId) {
      exportPlayerEditablePdf(curId);
    } else {
      if (typeof alert === 'function') {
        alert('Não foi possível identificar o personagem para exportação do PDF.');
      }
    }
  }

  // Exportar funções no escopo global e Node.js
  const targets = [
    typeof window !== 'undefined' ? window : null,
    typeof global !== 'undefined' ? global : null,
    typeof globalThis !== 'undefined' ? globalThis : null
  ].filter(Boolean);

  targets.forEach(t => {
    t.DND_SKILLS_MAPPING = DND_SKILLS_MAPPING;
    t.attachFieldCalculation = attachFieldCalculation;
    t.generateEditableDnd5ePdf = generateEditableDnd5ePdf;
    t.exportPlayerEditablePdf = exportPlayerEditablePdf;
    t.exportCurrentModalPlayerEditablePdf = exportCurrentModalPlayerEditablePdf;
  });

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      DND_SKILLS_MAPPING,
      attachFieldCalculation,
      generateEditableDnd5ePdf,
      exportPlayerEditablePdf,
      exportCurrentModalPlayerEditablePdf
    };
  }

})(typeof window !== 'undefined' ? window : global);
