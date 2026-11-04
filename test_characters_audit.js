/**
 * test_characters_audit.js - ISSUE-173
 * Validação rigorosa de traços de raça/classe, normalização de slots (9 círculos D&D 5E),
 * resolução do bug de traços corrompidos por vírgulas em parênteses e interatividade de pacto.
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passedTests++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failedTests++;
  }
}

console.log('🧪 Iniciando Auditoria de Personagens e Traços D&D 5E (ISSUE-173)...');

// 1. Carrega core.js e avalia PLAYERS
const coreCode = fs.readFileSync(path.join(__dirname, 'src/js/core.js'), 'utf8');
const playersCode = fs.readFileSync(path.join(__dirname, 'src/js/players.js'), 'utf8');
const compendiumCode = fs.readFileSync(path.join(__dirname, 'src/js/compendium.js'), 'utf8');

const sandbox = {
  window: {},
  document: {
    getElementById: (id) => null,
    querySelector: () => null,
    querySelectorAll: () => [],
    addEventListener: () => {}
  },
  localStorage: { getItem: () => null, setItem: () => {} },
  navigator: {},
  console: console
};
vm.createContext(sandbox);

// Executa core.js
vm.runInContext(coreCode, sandbox);
vm.runInContext(compendiumCode, sandbox);
vm.runInContext(playersCode, sandbox);

const PLAYERS = sandbox.PLAYERS || (sandbox.window && sandbox.window.PLAYERS) || vm.runInContext('PLAYERS', sandbox);
assert(Array.isArray(PLAYERS) && PLAYERS.length === 9, `Deve haver 9 personagens padrão (encontrados: ${PLAYERS ? PLAYERS.length : 0})`);

// 2. Normalização de slots para 9 círculos em todos os personagens
PLAYERS.forEach((p, idx) => {
  assert(Array.isArray(p.slots) && p.slots.length === 9, `[${p.name}] slots deve ter exatamente 9 círculos (tamanho: ${p.slots ? p.slots.length : 0})`);
  assert(Array.isArray(p.slotsUsed) && p.slotsUsed.length === 9, `[${p.name}] slotsUsed deve ter exatamente 9 círculos`);
});

// 3. Auditoria específica de Claker (Bruxo 5 / Tiefling)
const claker = PLAYERS.find(p => p.name === 'Claker');
assert(claker !== undefined, 'Personagem Claker deve existir');
if (claker) {
  assert(claker.slots[0] === 0 && claker.slots[1] === 0 && claker.slots[2] === 2, 'Claker deve ter 2 slots de 3º círculo e 0 nos círculos 1 e 2');
  assert(claker.race === 'Tiefling', 'Claker deve ser da raça Tiefling');
  assert(claker.features.includes('Bênção do Obscuro') && claker.features.includes('Sorte do Obscuro'), 'Claker deve possuir Bênção e Sorte do Obscuro');
  assert(claker.features.includes('Pacto do Tomo') && claker.features.includes('Invocações Místicas'), 'Claker deve possuir Pacto do Tomo e Invocações Místicas');
  
  // Magias raciais Tiefling
  assert(claker.preparedSpells.includes('Taumaturgia'), 'Claker deve conhecer o truque racial Taumaturgia');
  assert(claker.preparedSpells.includes('Repreensão Infernal'), 'Claker deve conhecer a magia racial Repreensão Infernal');
  assert(claker.preparedSpells.includes('Escuridão'), 'Claker deve conhecer a magia racial Escuridão');
}

// 4. Auditoria específica de Yoshigake Kira (Paladino 5)
const yoshigake = PLAYERS.find(p => p.name === 'Yoshigake Kira');
assert(yoshigake !== undefined, 'Personagem Yoshigake Kira deve existir');
if (yoshigake) {
  assert(!yoshigake.features.includes('Retomar o Fôlego'), 'Yoshigake Kira (Paladino) NÃO deve possuir "Retomar o Fôlego" (habilidade de Guerreiro)');
  assert(yoshigake.features.includes('Sentido Divino') && yoshigake.features.includes('Cura pelas Mãos'), 'Yoshigake Kira deve possuir Sentido Divino e Cura pelas Mãos');
  assert(yoshigake.features.includes('Destruição Divina') && yoshigake.features.includes('Saúde Divina'), 'Yoshigake Kira deve possuir Destruição Divina e Saúde Divina');
  assert(yoshigake.fightingStyle === 'defense', 'Yoshigake Kira deve ter Estilo de Luta Defesa configurado');
  assert(yoshigake.slots[0] === 4 && yoshigake.slots[1] === 2, 'Yoshigake Kira (Paladino 5) deve ter 4 slots de 1º círculo e 2 slots de 2º círculo');
}

// 5. Auditoria de Deraravely (Guerreiro 4 / Bárbaro 1 Orc)
const deraravely = PLAYERS.find(p => p.name === 'Deraravely');
assert(deraravely !== undefined, 'Personagem Deraravely deve existir');
if (deraravely) {
  assert(deraravely.features.includes('Crítico Aprimorado'), 'Deraravely (Campeão) deve possuir Crítico Aprimorado');
  assert(deraravely.features.includes('Fúria (2/dia, +2 Dano)'), 'Deraravely deve possuir Fúria');
}

// 6. Teste de splitFeaturesTextSafe (Prevenção de Corrupção por Vírgula dentro de Parênteses)
const splitFeaturesTextSafe = sandbox.splitFeaturesTextSafe;
assert(typeof splitFeaturesTextSafe === 'function', 'splitFeaturesTextSafe deve ser uma função exportada');
if (typeof splitFeaturesTextSafe === 'function') {
  const r1 = splitFeaturesTextSafe('Fúria (2/dia, +2 Dano)');
  assert(r1.length === 1 && r1[0] === 'Fúria (2/dia, +2 Dano)', 'Não deve dividir vírgula dentro de parênteses');

  const r2 = splitFeaturesTextSafe('Ataque Descuidado, Sentido de Perigo');
  assert(r2.length === 2 && r2[0] === 'Ataque Descuidado' && r2[1] === 'Sentido de Perigo', 'Deve dividir vírgulas fora de parênteses');

  const r3 = splitFeaturesTextSafe('Metamagia (Magia Acelerada, Magia Sutil), Fonte de Magia (4 Pontos)');
  assert(r3.length === 2 && r3[0] === 'Metamagia (Magia Acelerada, Magia Sutil)' && r3[1] === 'Fonte de Magia (4 Pontos)', 'Deve lidar com múltiplos blocos com parênteses');
}

// 7. Teste de getPlayerAllFeaturesAndTraits para todos os 9 personagens
const getPlayerAllFeaturesAndTraits = sandbox.getPlayerAllFeaturesAndTraits;
assert(typeof getPlayerAllFeaturesAndTraits === 'function', 'getPlayerAllFeaturesAndTraits deve ser uma função');

PLAYERS.forEach(p => {
  const allFeats = getPlayerAllFeaturesAndTraits(p);
  assert(Array.isArray(allFeats) && allFeats.length > 0, `[${p.name}] Deve retornar lista de características (total: ${allFeats.length})`);

  // Garante que nenhum traço foi quebrado como órfão "+2 Dano)" ou ") sem ("
  const brokenFeat = allFeats.find(f => f.name.trim() === '+2 Dano)' || (f.name.endsWith(')') && !f.name.includes('(')));
  assert(!brokenFeat, `[${p.name}] Não deve haver traços corrompidos por divisão inadequada de vírgulas`);
});

// 8. Relatório Final
console.log(`\n========================================`);
console.log(`RESULTADO DA AUDITORIA: ${passedTests} passaram, ${failedTests} falharam`);
console.log(`========================================`);

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('🎉 Auditoria de Personagens e Traços 100% aprovada!');
}
