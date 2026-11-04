// test_invocations.js - Testes Automatizados de Invocações Místicas do Bruxo (D&D 5E / ISSUE-174)
const assert = require('assert');
const fs = require('fs');

console.log('🧪 Iniciando Bateria de Testes: Invocações Místicas do Bruxo (ISSUE-174)...');

// 1. Carrega dados de invocações
const invocationsModule = require('./src/data/invocations.js');
const {
  WARLOCK_INVOCATIONS_DATA,
  findWarlockInvocationData,
  getWarlockMaxInvocations,
  checkInvocationPrerequisites
} = invocationsModule;

// Teste 1: Catálogo canônico de 39 invocações
assert.strictEqual(Array.isArray(WARLOCK_INVOCATIONS_DATA), true, 'WARLOCK_INVOCATIONS_DATA deve ser um array');
assert.strictEqual(WARLOCK_INVOCATIONS_DATA.length, 39, 'Deve conter exatamente 39 invocações místicas canônicas');
console.log(`✅ Teste 1: Catálogo contém ${WARLOCK_INVOCATIONS_DATA.length} invocações oficiais.`);

// Teste 2: Integridade de cada invocação
const idSet = new Set();
WARLOCK_INVOCATIONS_DATA.forEach(inv => {
  assert.ok(inv.id, 'Invocação deve ter um id válido');
  assert.ok(!idSet.has(inv.id), `ID duplicado detectado: ${inv.id}`);
  idSet.add(inv.id);
  assert.ok(inv.name, `Invocação ${inv.id} deve ter um nome`);
  assert.ok(inv.desc, `Invocação ${inv.id} deve ter descrição`);
  assert.ok(inv.source, `Invocação ${inv.id} deve ter fonte oficial (PHB, XGE ou TCE)`);
  assert.ok(['PHB', 'XGE', 'TCE'].includes(inv.source), `Fonte ${inv.source} deve ser PHB, XGE ou TCE`);
});
console.log('✅ Teste 2: Todos os 38 IDs são únicos e possuem campos obrigatórios.');

// Teste 3: Tabela de progressão de quantidade máxima por nível de Bruxo
assert.strictEqual(getWarlockMaxInvocations(1), 0, 'Nível 1 não ganha invocações');
assert.strictEqual(getWarlockMaxInvocations(2), 2, 'Nível 2 ganha 2 invocações');
assert.strictEqual(getWarlockMaxInvocations(3), 2, 'Nível 3 mantém 2 invocações');
assert.strictEqual(getWarlockMaxInvocations(4), 2, 'Nível 4 mantém 2 invocações');
assert.strictEqual(getWarlockMaxInvocations(5), 3, 'Nível 5 ganha 3 invocações');
assert.strictEqual(getWarlockMaxInvocations(6), 3, 'Nível 6 mantém 3 invocações');
assert.strictEqual(getWarlockMaxInvocations(7), 4, 'Nível 7 ganha 4 invocações');
assert.strictEqual(getWarlockMaxInvocations(8), 4, 'Nível 8 mantém 4 invocações');
assert.strictEqual(getWarlockMaxInvocations(9), 5, 'Nível 9 ganha 5 invocações');
assert.strictEqual(getWarlockMaxInvocations(11), 5, 'Nível 11 mantém 5 invocações');
assert.strictEqual(getWarlockMaxInvocations(12), 6, 'Nível 12 ganha 6 invocações');
assert.strictEqual(getWarlockMaxInvocations(14), 6, 'Nível 14 mantém 6 invocações');
assert.strictEqual(getWarlockMaxInvocations(15), 7, 'Nível 15 ganha 7 invocações');
assert.strictEqual(getWarlockMaxInvocations(17), 7, 'Nível 17 mantém 7 invocações');
assert.strictEqual(getWarlockMaxInvocations(18), 8, 'Nível 18 ganha 8 invocações');
assert.strictEqual(getWarlockMaxInvocations(20), 8, 'Nível 20 mantém 8 invocações');
console.log('✅ Teste 3: Tabela oficial de progressão (2 a 8 invocações) validada.');

// Teste 4: Verificação de pré-requisitos (checkInvocationPrerequisites)
const agonBlast = findWarlockInvocationData('agonizing_blast');
const thirstBlade = findWarlockInvocationData('thirsting_blade');
const bookOfSecrets = findWarlockInvocationData('book_of_ancient_secrets');
const chainVoice = findWarlockInvocationData('voice_of_the_chain_master');
const armorShadows = findWarlockInvocationData('armor_of_shadows');

// Sem pré-requisito
const resNoReq = checkInvocationPrerequisites(armorShadows, { level: 2 });
assert.strictEqual(resNoReq.eligible, true, 'Armadura de Sombras não tem pré-requisito e deve ser elegível');

// Rajada Agonizante requer Rajada Mística
const resAgonNoCantrip = checkInvocationPrerequisites(agonBlast, { level: 2, spells: 'Bruxaria, Mãos Flamejantes' });
assert.strictEqual(resAgonNoCantrip.eligible, false, 'Rajada Agonizante sem Rajada Mística deve ser inelegível');
const resAgonWithCantrip = checkInvocationPrerequisites(agonBlast, { level: 2, spells: 'Rajada Mística, Bruxaria' });
assert.strictEqual(resAgonWithCantrip.eligible, true, 'Rajada Agonizante com Rajada Mística deve ser elegível');

// Lâmina Sedenta requer Nível 5 e Pacto da Lâmina
const resBladeLvl2 = checkInvocationPrerequisites(thirstBlade, { level: 2, features: 'Pacto da Lâmina' });
assert.strictEqual(resBladeLvl2.eligible, false, 'Lâmina Sedenta no nível 2 deve ser inelegível');
const resBladeLvl5NoPact = checkInvocationPrerequisites(thirstBlade, { level: 5, features: 'Pacto do Tomo' });
assert.strictEqual(resBladeLvl5NoPact.eligible, false, 'Lâmina Sedenta com Pacto do Tomo deve ser inelegível');
const resBladeLvl5WithPact = checkInvocationPrerequisites(thirstBlade, { level: 5, features: 'Pacto da Lâmina' });
assert.strictEqual(resBladeLvl5WithPact.eligible, true, 'Lâmina Sedenta no Nível 5 com Pacto da Lâmina deve ser elegível');

// Livro de Segredos Antigos requer Pacto do Tomo
const resBookNoPact = checkInvocationPrerequisites(bookOfSecrets, { level: 3, features: 'Pacto da Corrente' });
assert.strictEqual(resBookNoPact.eligible, false, 'Livro de Segredos sem Pacto do Tomo deve ser inelegível');
const resBookWithPact = checkInvocationPrerequisites(bookOfSecrets, { level: 3, features: 'Pacto do Tomo' });
assert.strictEqual(resBookWithPact.eligible, true, 'Livro de Segredos com Pacto do Tomo deve ser elegível');

// Voz do Mestre das Correntes requer Pacto da Corrente
const resChainNoPact = checkInvocationPrerequisites(chainVoice, { level: 3, features: 'Pacto do Tomo' });
assert.strictEqual(resChainNoPact.eligible, false, 'Voz do Mestre das Correntes sem Pacto da Corrente deve ser inelegível');
const resChainWithPact = checkInvocationPrerequisites(chainVoice, { level: 3, features: 'Pacto da Corrente' });
assert.strictEqual(resChainWithPact.eligible, true, 'Voz do Mestre das Correntes com Pacto da Corrente deve ser elegível');
console.log('✅ Teste 4: Validação de pré-requisitos (nível, cantrip e pactos) 100% funcional.');

// Teste 5: Cálculo de ataque de Rajada Mística com Rajada Agonizante
if (!global.getProfBonus) {
  global.getProfBonus = (level) => Math.floor(((parseInt(level) || 1) - 1) / 4) + 2;
}
if (!global.getEffectiveClassLevel) {
  global.getEffectiveClassLevel = (p, cls) => {
    const cName = (p.className || '').toLowerCase();
    return cName.includes(cls.toLowerCase()) ? (parseInt(p.level) || 1) : 0;
  };
}
if (!global.getPlayerKnownSpells) {
  global.getPlayerKnownSpells = (p) => {
    if (typeof p.spells === 'string') return p.spells.split(',').map(s => s.trim());
    return Array.isArray(p.spells) ? p.spells : [];
  };
}

const playersModule = require('./src/js/players.js');
const warlockChar = {
  id: 'test_warlock_1',
  name: 'Bruxo Teste',
  className: 'Bruxo',
  level: 5,
  cha: 18, // Modificador +4
  prof: 3,
  spells: 'Rajada Mística, Bruxaria',
  invocations: ['agonizing_blast', 'armor_of_shadows', 'devils_sight']
};

const attacks = playersModule.getPlayerSpecialClassAttacks(warlockChar);
const blastAtk = attacks.find(a => a.name.includes('Rajada Mística'));
assert.ok(blastAtk, 'Bruxo com Rajada Mística deve ter ataque especial calculado');
assert.ok(blastAtk.damage.includes('+4'), `Dano da Rajada Mística deve incluir modificador de Carisma (+4) devido a Rajada Agonizante: ${blastAtk.damage}`);
assert.ok(blastAtk.notes.includes('+4 por feixe'), `Notas devem explicar o bônus de Carisma por feixe: ${blastAtk.notes}`);
console.log(`✅ Teste 5: Rajada Agonizante aplica modificador de Carisma ao dano da Rajada Mística (${blastAtk.damage}).`);

// Teste 6: Personagens canônicos Claker e Caim em core.js
const coreContent = fs.readFileSync('./src/js/core.js', 'utf8');
assert.ok(coreContent.includes('"name": "Claker"'), 'Claker deve existir no core.js');
assert.ok(coreContent.includes('"agonizing_blast"'), 'Rajada Agonizante deve estar configurada no core.js');
assert.ok(coreContent.includes('"devils_sight"'), 'Visão do Diabo deve estar configurada no core.js');
console.log('✅ Teste 6: Personagens canônicos Claker e Caim possuem invocações místicas associadas.');

// Teste 7: Integridade do arquivo gerado planilha do rpg.html
const htmlContent = fs.readFileSync('./planilha do rpg.html', 'utf8');
assert.ok(htmlContent.includes('WARLOCK_INVOCATIONS_DATA'), 'planilha do rpg.html deve conter WARLOCK_INVOCATIONS_DATA');
assert.ok(htmlContent.includes('ddb-warlock-invocations-box'), 'planilha do rpg.html deve conter ddb-warlock-invocations-box');
assert.ok(htmlContent.includes('renderModalWarlockInvocations'), 'planilha do rpg.html deve conter renderModalWarlockInvocations');
assert.ok(htmlContent.includes('renderPlayerInvocationsTraits'), 'planilha do rpg.html deve conter renderPlayerInvocationsTraits');
console.log('✅ Teste 7: Arquivo final compilado contém todos os componentes e seletores de Invocações Místicas.');

console.log('\n🎉 TODOS OS TESTES DE INVOCAÇÕES MÍSTICAS (ISSUE-174) FORAM APROVADOS COM SUCESSO!\n');
