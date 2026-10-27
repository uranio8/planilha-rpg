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

  // Mapeamento canônico das 18 perícias do D&D 5E com os atributos base
  const DND_SKILLS_MAPPING = [
    { key: 'acrobatics', pt: 'Acrobacia', stat: 'DES', attrKey: 'dex' },
    { key: 'animalHandling', pt: 'Adestrar Animais', stat: 'SAB', attrKey: 'wis' },
    { key: 'arcana', pt: 'Arcanismo', stat: 'INT', attrKey: 'int' },
    { key: 'athletics', pt: 'Atletismo', stat: 'FOR', attrKey: 'str' },
    { key: 'performance', pt: 'Atuação', stat: 'CAR', attrKey: 'cha' },
    { key: 'deception', pt: 'Blefar', stat: 'CAR', attrKey: 'cha' },
    { key: 'stealth', pt: 'Furtividade', stat: 'DES', attrKey: 'dex' },
    { key: 'history', pt: 'História', stat: 'INT', attrKey: 'int' },
    { key: 'intimidation', pt: 'Intimidação', stat: 'CAR', attrKey: 'cha' },
    { key: 'insight', pt: 'Intuição', stat: 'SAB', attrKey: 'wis' },
    { key: 'investigation', pt: 'Investigação', stat: 'INT', attrKey: 'int' },
    { key: 'medicine', pt: 'Medicina', stat: 'SAB', attrKey: 'wis' },
    { key: 'nature', pt: 'Natureza', stat: 'INT', attrKey: 'int' },
    { key: 'perception', pt: 'Percepção', stat: 'SAB', attrKey: 'wis' },
    { key: 'persuasion', pt: 'Persuasão', stat: 'CAR', attrKey: 'cha' },
    { key: 'sleightOfHand', pt: 'Prestidigitação', stat: 'DES', attrKey: 'dex' },
    { key: 'religion', pt: 'Religião', stat: 'INT', attrKey: 'int' },
    { key: 'survival', pt: 'Sobrevivência', stat: 'SAB', attrKey: 'wis' }
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
    const page1 = doc.addPage([595.28, 841.89]); // A4 em pontos (72 dpi)
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
    fCharName.setText(p.name || '');
    fCharName.addToPage(page1, { x: 32, y: p1Height - 70, width: 170, height: 18 });

    // Grid de Metadados do Cabeçalho
    const metaCols = [
      { label: 'CLASSE E NÍVEL', name: 'ClassLevel', val: `${p.className || ''} ${p.level || 1}`, x: 215, y: p1Height - 48, w: 110 },
      { label: 'ANTECEDENTE', name: 'Background', val: p.background || '', x: 335, y: p1Height - 48, w: 105 },
      { label: 'JOGADOR / ALUNO', name: 'PlayerName', val: p.student || '', x: 450, y: p1Height - 48, w: 110 },
      { label: 'RAÇA / ESPÉCIE', name: 'Race', val: p.race || '', x: 215, y: p1Height - 78, w: 110 },
      { label: 'TENDÊNCIA', name: 'Alignment', val: p.alignment || 'Neutro', x: 335, y: p1Height - 78, w: 105 },
      { label: 'EXP (XP)', name: 'XP', val: String(p.xp || 0), x: 450, y: p1Height - 78, w: 110 }
    ];

    metaCols.forEach(m => {
      page1.drawText(m.label, { x: m.x, y: m.y - 4, size: 6.5, font: fontBold, color: cMuted });
      const tf = form.createTextField(m.name);
      tf.setText(m.val);
      tf.addToPage(page1, { x: m.x, y: m.y + 7, width: m.w, height: 16 });
    });

    // ------------------------------------------
    // COLUNA 1: ATRIBUTOS E MODIFICADORES COM AUTO-CÁLCULO
    // ------------------------------------------
    const statsDefs = [
      { key: 'FOR', label: 'FORÇA', val: p.str || 10, y: p1Height - 165 },
      { key: 'DES', label: 'DESTREZA', val: p.dex || 10, y: p1Height - 235 },
      { key: 'CON', label: 'CONSTITUIÇÃO', val: p.con || 10, y: p1Height - 305 },
      { key: 'INT', label: 'INTELIGÊNCIA', val: p.int || 10, y: p1Height - 375 },
      { key: 'SAB', label: 'SABEDORIA', val: p.wis || 10, y: p1Height - 445 },
      { key: 'CAR', label: 'CARISMA', val: p.cha || 10, y: p1Height - 515 }
    ];

    statsDefs.forEach(s => {
      // Moldura do Atributo
      page1.drawRectangle({
        x: 24, y: s.y,
        width: 60, height: 60,
        color: cWhite,
        borderColor: cBorder,
        borderWidth: 1.2
      });

      // Título do Atributo
      page1.drawText(s.label, {
        x: 27, y: s.y + 49,
        size: 7,
        font: fontBold,
        color: cDark
      });

      // Campo do Modificador (Central, Grande, Calculado)
      const modFieldName = `${s.key}_MOD`;
      const modField = form.createTextField(modFieldName);
      const initialMod = Math.floor((Number(s.val) - 10) / 2);
      modField.setText((initialMod >= 0 ? '+' : '') + initialMod);
      modField.addToPage(page1, { x: 30, y: s.y + 19, width: 48, height: 26 });

      // Campo do Escore Base (Pequeno, Editável)
      page1.drawRectangle({
        x: 37, y: s.y + 4,
        width: 34, height: 14,
        color: cGrayBg,
        borderColor: cBorder,
        borderWidth: 1
      });
      const scoreField = form.createTextField(s.key);
      scoreField.setText(String(s.val));
      scoreField.addToPage(page1, { x: 39, y: s.y + 5, width: 30, height: 12 });

      // Script de Auto-Cálculo de Modificador no Acrobat JS
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
    const calcProfInitial = Math.floor(((p.level || 1) - 1) / 4) + 2;
    fProf.setText('+' + calcProfInitial);
    fProf.addToPage(page1, { x: 100, y: p1Height - 156, width: 22, height: 18 });

    // ------------------------------------------
    // TESTES DE RESISTÊNCIA (SALVAGUARDAS) VINCULADOS
    // ------------------------------------------
    page1.drawRectangle({ x: 96, y: p1Height - 275, width: 104, height: 108, color: cWhite, borderColor: cBorder, borderWidth: 1 });
    page1.drawText('TESTES DE RESISTÊNCIA', { x: 102, y: p1Height - 175, size: 7, font: fontBold, color: cDark });

    const saveStats = [
      { key: 'FOR', pt: 'Força', y: p1Height - 192 },
      { key: 'DES', pt: 'Destreza', y: p1Height - 207 },
      { key: 'CON', pt: 'Constituição', y: p1Height - 222 },
      { key: 'INT', pt: 'Inteligência', y: p1Height - 237 },
      { key: 'SAB', pt: 'Sabedoria', y: p1Height - 252 },
      { key: 'CAR', pt: 'Carisma', y: p1Height - 267 }
    ];

    saveStats.forEach(sv => {
      const chkName = `Check_Save_${sv.key}`;
      const valName = `Save_${sv.key}`;
      const chk = form.createCheckBox(chkName);
      const isProf = p.savingThrows && p.savingThrows.includes(sv.key.toLowerCase());
      if (isProf) chk.check();
      chk.addToPage(page1, { x: 100, y: sv.y, width: 10, height: 10 });

      const tv = form.createTextField(valName);
      const baseStat = p[sv.key.toLowerCase()] || 10;
      const baseMod = Math.floor((baseStat - 10) / 2);
      const totalSave = baseMod + (isProf ? calcProfInitial : 0);
      tv.setText((totalSave >= 0 ? '+' : '') + totalSave);
      tv.addToPage(page1, { x: 114, y: sv.y - 1, width: 18, height: 12 });

      page1.drawText(sv.pt, { x: 136, y: sv.y + 2, size: 7.5, font: fontRegular, color: cDark });

      // Script de Auto-Cálculo de Salvaguarda
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

    DND_SKILLS_MAPPING.forEach((sk, idx) => {
      const yLine = p1Height - 306 - (idx * 15.5);
      const chkName = `Check_Skill_${sk.key}`;
      const valName = `Skill_${sk.key}`;

      const chk = form.createCheckBox(chkName);
      const isProf = p.skills && (p.skills.includes(sk.key) || p.skills.includes(sk.pt.toLowerCase()));
      if (isProf) chk.check();
      chk.addToPage(page1, { x: 100, y: yLine, width: 9, height: 9 });

      const tv = form.createTextField(valName);
      const baseStat = p[sk.attrKey] || 10;
      const baseMod = Math.floor((baseStat - 10) / 2);
      const totalSkill = baseMod + (isProf ? calcProfInitial : 0);
      tv.setText((totalSkill >= 0 ? '+' : '') + totalSkill);
      tv.addToPage(page1, { x: 112, y: yLine - 1, width: 18, height: 11 });

      page1.drawText(`${sk.pt} (${sk.stat})`, { x: 133, y: yLine + 2, size: 6.5, font: fontRegular, color: cDark });

      // Script de Auto-Cálculo de Perícia
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

    // Percepção Passiva
    page1.drawRectangle({ x: 24, y: p1Height - 582, width: 176, height: 22, color: cWhite, borderColor: cBorder, borderWidth: 1 });
    const fPassPerc = form.createTextField('Passive_Perception');
    const percProf = p.skills && (p.skills.includes('perception') || p.skills.includes('percepção'));
    const initialPass = 10 + Math.floor(((p.wis || 10) - 10) / 2) + (percProf ? calcProfInitial : 0);
    fPassPerc.setText(String(initialPass));
    fPassPerc.addToPage(page1, { x: 28, y: p1Height - 578, width: 22, height: 14 });
    page1.drawText('SABEDORIA PASSIVA (PERCEPÇÃO)', { x: 54, y: p1Height - 574, size: 6.5, font: fontBold, color: cDark });

    const passPercJs = `
      var p = Number(this.getField("Skill_perception").value) || 0;
      event.value = 10 + p;
    `;
    attachFieldCalculation(doc, PDFLib, fPassPerc, passPercJs);
    calculationFieldsOrder.push(fPassPerc);

    // Outras Proficiências e Idiomas
    page1.drawRectangle({ x: 24, y: p1Height - 805, width: 176, height: 215, color: cWhite, borderColor: cBorder, borderWidth: 1 });
    page1.drawText('OUTRAS PROFICIÊNCIAS & IDIOMAS', { x: 30, y: p1Height - 598, size: 7, font: fontBold, color: cDark });
    const fProfLang = form.createTextField('Proficiencies_Languages');
    fProfLang.enableMultiline();
    let initialProfText = (p.languages ? `Idiomas: ${p.languages}\n` : 'Idiomas: Comum\n');
    if (p.proficiencies) initialProfText += `Armaduras/Armas: ${p.proficiencies}\n`;
    fProfLang.setText(initialProfText);
    fProfLang.addToPage(page1, { x: 28, y: p1Height - 800, width: 168, height: 195 });

    // ------------------------------------------
    // COLUNA 2: COMBATE, PV, ATAQUES & MAGIAS
    // ------------------------------------------
    // Caixas de CA, Iniciativa e Deslocamento
    const dexModInitial = Math.floor(((p.dex || 10) - 10) / 2);
    const combatBoxes = [
      { label: 'CLASSE DE ARMADURA', name: 'AC', val: String(p.ac || 10), x: 215, w: 56 },
      { label: 'INICIATIVA', name: 'Initiative', val: (p.initiative !== undefined ? (p.initiative >= 0 ? '+' + p.initiative : '' + p.initiative) : (dexModInitial >= 0 ? '+' + dexModInitial : '' + dexModInitial)), x: 277, w: 56 },
      { label: 'DESLOCAMENTO', name: 'Speed', val: `${p.speed || 9}m`, x: 339, w: 56 }
    ];

    combatBoxes.forEach(cb => {
      page1.drawRectangle({ x: cb.x, y: p1Height - 165, width: cb.w, height: 50, color: cWhite, borderColor: cBorder, borderWidth: 1.2 });
      page1.drawText(cb.label, { x: cb.x + 3, y: p1Height - 124, size: 5.5, font: fontBold, color: cMuted });
      const f = form.createTextField(cb.name);
      f.setText(cb.val);
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
    fHpMax.setText(String(p.hpMax || 10));
    fHpMax.addToPage(page1, { x: 325, y: p1Height - 183, width: 62, height: 14 });

    page1.drawText('PONTOS DE VIDA ATUAIS', { x: 250, y: p1Height - 200, size: 7, font: fontBold, color: cDark });
    const fHpCur = form.createTextField('HP_Current');
    fHpCur.setText(String(p.hpCurrent || p.hpMax || 10));
    fHpCur.addToPage(page1, { x: 245, y: p1Height - 238, width: 120, height: 32 });

    page1.drawText('PONTOS DE VIDA TEMPORÁRIOS', { x: 235, y: p1Height - 250, size: 6.5, font: fontBold, color: cMuted });
    const fHpTemp = form.createTextField('HP_Temp');
    fHpTemp.setText(String(p.hpTemp || '0'));
    fHpTemp.addToPage(page1, { x: 245, y: p1Height - 270, width: 120, height: 16 });

    // Dados de Vida e Salvaguardas contra a Morte
    page1.drawRectangle({ x: 215, y: p1Height - 335, width: 86, height: 55, color: cWhite, borderColor: cBorder, borderWidth: 1 });
    page1.drawText('DADOS DE VIDA', { x: 225, y: p1Height - 290, size: 6.5, font: fontBold, color: cDark });
    const fHitDice = form.createTextField('Hit_Dice');
    fHitDice.setText(`${p.level || 1}d${p.hitDice || 8}`);
    fHitDice.addToPage(page1, { x: 222, y: p1Height - 325, width: 72, height: 28 });

    page1.drawRectangle({ x: 309, y: p1Height - 335, width: 86, height: 55, color: cWhite, borderColor: cBorder, borderWidth: 1 });
    page1.drawText('SALVAS / MORTE', { x: 318, y: p1Height - 290, size: 6.5, font: fontBold, color: cDark });
    page1.drawText('Sucessos:', { x: 314, y: p1Height - 306, size: 6, font: fontRegular, color: cDark });
    form.createCheckBox('DeathSave_S1').addToPage(page1, { x: 350, y: p1Height - 308, width: 8, height: 8 });
    form.createCheckBox('DeathSave_S2').addToPage(page1, { x: 362, y: p1Height - 308, width: 8, height: 8 });
    form.createCheckBox('DeathSave_S3').addToPage(page1, { x: 374, y: p1Height - 308, width: 8, height: 8 });

    page1.drawText('Falhas:', { x: 314, y: p1Height - 322, size: 6, font: fontRegular, color: cDark });
    form.createCheckBox('DeathSave_F1').addToPage(page1, { x: 350, y: p1Height - 324, width: 8, height: 8 });
    form.createCheckBox('DeathSave_F2').addToPage(page1, { x: 362, y: p1Height - 324, width: 8, height: 8 });
    form.createCheckBox('DeathSave_F3').addToPage(page1, { x: 374, y: p1Height - 324, width: 8, height: 8 });

    // Tabela de Ataques e Conjuração
    page1.drawRectangle({ x: 215, y: p1Height - 575, width: 180, height: 234, color: cWhite, borderColor: cBorder, borderWidth: 1 });
    page1.drawText('ATAQUES & CONJURAÇÃO', { x: 250, y: p1Height - 350, size: 8, font: fontBold, color: cDark });
    page1.drawText('NOME DO ATAQUE', { x: 220, y: p1Height - 364, size: 6, font: fontBold, color: cMuted });
    page1.drawText('BÔNUS', { x: 298, y: p1Height - 364, size: 6, font: fontBold, color: cMuted });
    page1.drawText('DANO / TIPO', { x: 335, y: p1Height - 364, size: 6, font: fontBold, color: cMuted });

    // 4 Linhas estruturadas de ataques editáveis
    const initialAttacks = p.attacks || [
      { name: 'Espada Longa', bonus: '+5', damage: '1d8+3 cortante' },
      { name: 'Arco Curto', bonus: '+4', damage: '1d6+2 perfurante' }
    ];

    for (let i = 0; i < 4; i++) {
      const yAtk = p1Height - 380 - (i * 20);
      const atk = initialAttacks[i] || { name: '', bonus: '', damage: '' };

      const fName = form.createTextField(`Attack_Name_${i + 1}`);
      fName.setText(atk.name || '');
      fName.addToPage(page1, { x: 218, y: yAtk, width: 76, height: 14 });

      const fBon = form.createTextField(`Attack_Bonus_${i + 1}`);
      fBon.setText(atk.bonus || '');
      fBon.addToPage(page1, { x: 298, y: yAtk, width: 32, height: 14 });

      const fDmg = form.createTextField(`Attack_Damage_${i + 1}`);
      fDmg.setText(atk.damage || '');
      fDmg.addToPage(page1, { x: 334, y: yAtk, width: 57, height: 14 });
    }

    // Área de Texto Adicional de Magias/Ataques
    const fAtkNotes = form.createTextField('Attacks_Notes');
    fAtkNotes.enableMultiline();
    fAtkNotes.setText(p.attackNotes || 'Anotações táticas de combate, truques de ataque ou manobras especiais.');
    fAtkNotes.addToPage(page1, { x: 218, y: p1Height - 570, width: 174, height: 100 });

    // ------------------------------------------
    // COLUNA 3: PERSONALIDADE, IDEAIS, CARACTERÍSTICAS
    // ------------------------------------------
    const traitsBoxes = [
      { label: 'TRAÇOS DE PERSONALIDADE', name: 'Personality_Traits', val: p.personality || '', y: p1Height - 170, h: 55 },
      { label: 'IDEAIS', name: 'Ideals', val: p.ideals || '', y: p1Height - 232, h: 55 },
      { label: 'VÍNCULOS', name: 'Bonds', val: p.bonds || '', y: p1Height - 294, h: 55 },
      { label: 'DEFEITOS', name: 'Flaws', val: p.flaws || '', y: p1Height - 356, h: 55 }
    ];

    traitsBoxes.forEach(tb => {
      page1.drawRectangle({ x: 405, y: tb.y, width: 166, height: tb.h, color: cWhite, borderColor: cBorder, borderWidth: 1 });
      page1.drawText(tb.label, { x: 412, y: tb.y + tb.h - 10, size: 6.5, font: fontBold, color: cMuted });
      const f = form.createTextField(tb.name);
      f.enableMultiline();
      f.setText(tb.val);
      f.addToPage(page1, { x: 409, y: tb.y + 3, width: 158, height: tb.h - 16 });
    });

    // Características e Habilidades (Features & Traits)
    page1.drawRectangle({ x: 405, y: p1Height - 575, width: 166, height: 212, color: cWhite, borderColor: cBorder, borderWidth: 1 });
    page1.drawText('CARACTERÍSTICAS & HABILIDADES', { x: 412, y: p1Height - 373, size: 7, font: fontBold, color: cDark });
    const fFeatures = form.createTextField('Features_Traits');
    fFeatures.enableMultiline();
    let initialFeatText = '';
    if (p.classFeatures && Array.isArray(p.classFeatures)) {
      initialFeatText = p.classFeatures.map(feat => `• ${feat.name || feat}: ${feat.desc || ''}`).join('\n\n');
    }
    fFeatures.setText(initialFeatText || p.notes || '');
    fFeatures.addToPage(page1, { x: 409, y: p1Height - 570, width: 158, height: 190 });

    // Rodapé da Página 1
    page1.drawText(`Ficha D&D 5E Editável • ${p.name || 'Personagem'} • Página 1 de 2 • Clube de RPG`, {
      x: 32, y: 18, size: 8, font: fontRegular, color: cMuted
    });

    // ==========================================
    // PÁGINA 2: INVENTÁRIO, MOEDAS, GRIMÓRIO DE MAGIAS COM AUTO-CÁLCULO
    // ==========================================
    const page2 = doc.addPage([595.28, 841.89]);
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

    page2.drawText(`${p.name || 'Personagem'} (${p.className || ''})`, {
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
      { label: 'CLASSE CONJURADORA', name: 'Spellcasting_Class', val: p.spellcastingClass || p.className || '', x: 30, w: 120 },
      { label: 'HABILIDADE CHAVE', name: 'Spellcasting_Ability', val: p.spellAbility || 'INT', x: 160, w: 90 },
      { label: 'CD DE RESISTÊNCIA', name: 'Spell_Save_DC', val: '', x: 260, w: 100 },
      { label: 'BÔNUS DE ATAQUE', name: 'Spell_Attack_Bonus', val: '', x: 370, w: 100 }
    ];

    spellMeta.forEach(sm => {
      page2.drawText(sm.label, { x: sm.x, y: p2Height - 105, size: 6.5, font: fontBold, color: cMuted });
      const tf = form.createTextField(sm.name);
      tf.addToPage(page2, { x: sm.x, y: p2Height - 138, width: sm.w, height: 30 });

      // Auto-cálculo da CD e Bônus Mágico vinculados à habilidade chave
      if (sm.name === 'Spell_Save_DC') {
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
        tf.setText(sm.val);
      }
    });

    // ------------------------------------------
    // GRIMÓRIO: CÍRCULOS DE MAGIA (TRUQUES ATÉ 5º CÍRCULO)
    // ------------------------------------------
    page2.drawRectangle({ x: 20, y: p2Height - 485, width: 340, height: 310, color: cWhite, borderColor: cBorder, borderWidth: 1 });
    page2.drawText('GRIMÓRIO & MAGIAS PREPARADAS', { x: 30, y: p2Height - 180, size: 8, font: fontBold, color: cDark });

    const fSpells = form.createTextField('Spells_List');
    fSpells.enableMultiline();
    let initialSpellText = '';
    if (p.spells && Array.isArray(p.spells)) {
      initialSpellText = p.spells.map(s => {
        if (typeof s === 'string') return `• ${s}`;
        return `• ${s.name || ''} (Círculo ${s.level !== undefined ? s.level : '0'}${s.prepared ? ' - Preparada' : ''})`;
      }).join('\n');
    }
    fSpells.setText(initialSpellText || '• Truques:\n• 1º Círculo:\n• 2º Círculo:');
    fSpells.addToPage(page2, { x: 28, y: p2Height - 480, width: 324, height: 290 });

    // ------------------------------------------
    // INVENTÁRIO, MOEDAS E TESOUROS
    // ------------------------------------------
    page2.drawRectangle({ x: 375, y: p2Height - 485, width: 200, height: 310, color: cWhite, borderColor: cBorder, borderWidth: 1 });
    page2.drawText('EQUIPAMENTO & TESOURO', { x: 385, y: p2Height - 180, size: 8, font: fontBold, color: cDark });

    // Moedas (PC, PP, PE, PO, PL)
    const coinsDef = [
      { label: 'PC', name: 'Coin_CP', val: String(p.cp || 0), x: 385 },
      { label: 'PP', name: 'Coin_SP', val: String(p.sp || 0), x: 425 },
      { label: 'PE', name: 'Coin_EP', val: String(p.ep || 0), x: 465 },
      { label: 'PO', name: 'Coin_GP', val: String(p.gp || 0), x: 505 },
      { label: 'PL', name: 'Coin_PP', val: String(p.pp || 0), x: 545 }
    ];

    coinsDef.forEach(cn => {
      page2.drawText(cn.label, { x: cn.x + 4, y: p2Height - 194, size: 6.5, font: fontBold, color: cMuted });
      const f = form.createTextField(cn.name);
      f.setText(cn.val);
      f.addToPage(page2, { x: cn.x, y: p2Height - 215, width: 32, height: 16 });
    });

    // Campo de Inventário Geral
    const fEquip = form.createTextField('Equipment_List');
    fEquip.enableMultiline();
    let initialEquipText = '';
    if (p.equipment && Array.isArray(p.equipment)) {
      initialEquipText = p.equipment.map(eq => typeof eq === 'string' ? eq : `${eq.name} (x${eq.qty || 1})`).join('\n');
    }
    fEquip.setText(initialEquipText || p.inventory || 'Mochila de Aventureiro, Ração de Viagem (10 dias), Tochas, Odre.');
    fEquip.addToPage(page2, { x: 383, y: p2Height - 480, width: 184, height: 255 });

    // ------------------------------------------
    // HISTÓRIA, APARÊNCIA E ANOTAÇÕES
    // ------------------------------------------
    page2.drawRectangle({ x: 20, y: 35, width: p1Width - 40, height: p2Height - 530, color: cWhite, borderColor: cBorder, borderWidth: 1 });
    page2.drawText('HISTÓRIA DO PERSONAGEM, ALIADOS E ANOTAÇÕES', { x: 30, y: p2Height - 508, size: 8, font: fontBold, color: cDark });

    const fStory = form.createTextField('Character_Backstory');
    fStory.enableMultiline();
    fStory.setText(p.backstory || p.notes || 'Origem do herói, anotações de campanha, juramentos e alianças.');
    fStory.addToPage(page2, { x: 28, y: 45, width: p1Width - 56, height: p2Height - 565 });

    // Rodapé da Página 2
    page2.drawText(`Ficha D&D 5E Editável • ${p.name || 'Personagem'} • Página 2 de 2 • Clube de RPG`, {
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
    const curId = (typeof currentPrintPlayerId !== 'undefined' && currentPrintPlayerId)
      || (typeof document !== 'undefined' && document.getElementById('pm-id') ? document.getElementById('pm-id').value : null);
    if (curId) {
      exportPlayerEditablePdf(curId);
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
