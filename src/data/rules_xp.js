// src/data/rules_xp.js - Tabelas e Regras de Balanceamento de Encontros D&D 5E (DMG / SRD 5.2)

const DND5E_CR_TO_XP = {
  '0': 10,
  '1/8': 25,
  '0.125': 25,
  '1/4': 50,
  '0.25': 50,
  '1/2': 100,
  '0.5': 100,
  '1': 200,
  '2': 450,
  '3': 700,
  '4': 1100,
  '5': 1800,
  '6': 2300,
  '7': 2900,
  '8': 3900,
  '9': 5000,
  '10': 5900,
  '11': 7200,
  '12': 8400,
  '13': 10000,
  '14': 11500,
  '15': 13000,
  '16': 15000,
  '17': 18000,
  '18': 20000,
  '19': 22000,
  '20': 25000,
  '21': 33000,
  '22': 41000,
  '23': 50000,
  '24': 62000,
  '25': 75000,
  '26': 90000,
  '27': 105000,
  '28': 120000,
  '29': 135000,
  '30': 155000
};

// Limiares de XP por Nível de Personagem (Fácil, Médio, Difícil, Mortal, Diário)
const DND5E_ENCOUNTER_THRESHOLDS = {
  1:  { easy: 25,   medium: 50,   hard: 75,   deadly: 100,   daily: 300 },
  2:  { easy: 50,   medium: 100,  hard: 150,  deadly: 200,   daily: 600 },
  3:  { easy: 75,   medium: 150,  hard: 225,  deadly: 400,   daily: 1200 },
  4:  { easy: 125,  medium: 250,  hard: 375,  deadly: 500,   daily: 1700 },
  5:  { easy: 250,  medium: 500,  hard: 750,  deadly: 1100,  daily: 3500 },
  6:  { easy: 300,  medium: 600,  hard: 900,  deadly: 1400,  daily: 4000 },
  7:  { easy: 350,  medium: 750,  hard: 1100, deadly: 1700,  daily: 5000 },
  8:  { easy: 450,  medium: 900,  hard: 1400, deadly: 2100,  daily: 6000 },
  9:  { easy: 550,  medium: 1100, hard: 1600, deadly: 2400,  daily: 7500 },
  10: { easy: 600,  medium: 1200, hard: 1900, deadly: 2800,  daily: 9000 },
  11: { easy: 800,  medium: 1600, hard: 2400, deadly: 3600,  daily: 10500 },
  12: { easy: 1000, medium: 2000, hard: 3000, deadly: 4500,  daily: 11500 },
  13: { easy: 1100, medium: 2200, hard: 3400, deadly: 5100,  daily: 13500 },
  14: { easy: 1250, medium: 2500, hard: 3800, deadly: 5700,  daily: 15000 },
  15: { easy: 1400, medium: 2800, hard: 4300, deadly: 6400,  daily: 18000 },
  16: { easy: 1600, medium: 3200, hard: 4800, deadly: 7200,  daily: 20000 },
  17: { easy: 2000, medium: 3900, hard: 5900, deadly: 8800,  daily: 25000 },
  18: { easy: 2100, medium: 4200, hard: 6300, deadly: 9500,  daily: 27000 },
  19: { easy: 2400, medium: 4900, hard: 7300, deadly: 10900, daily: 30000 },
  20: { easy: 2800, medium: 5700, hard: 8500, deadly: 12700, daily: 40000 }
};

function getMonsterXp(crStr) {
  if (crStr === undefined || crStr === null) return 10;
  const clean = String(crStr).trim().replace('ND ', '').replace('CR ', '');
  if (DND5E_CR_TO_XP[clean] !== undefined) return DND5E_CR_TO_XP[clean];
  const num = parseFloat(clean);
  if (!isNaN(num)) {
    const floorKey = String(Math.floor(num));
    if (DND5E_CR_TO_XP[floorKey] !== undefined) return DND5E_CR_TO_XP[floorKey];
  }
  return 10;
}

function getPartyXpThresholds(playerLevels) {
  if (!Array.isArray(playerLevels) || playerLevels.length === 0) {
    playerLevels = [1, 1, 1, 1]; // Padrão 4 heróis nível 1
  }

  const totals = { easy: 0, medium: 0, hard: 0, deadly: 0, daily: 0, count: playerLevels.length };

  playerLevels.forEach(lvl => {
    const levelNum = Math.min(20, Math.max(1, parseInt(lvl) || 1));
    const th = DND5E_ENCOUNTER_THRESHOLDS[levelNum] || DND5E_ENCOUNTER_THRESHOLDS[1];
    totals.easy += th.easy;
    totals.medium += th.medium;
    totals.hard += th.hard;
    totals.deadly += th.deadly;
    totals.daily += th.daily;
  });

  return totals;
}

function getEncounterMultiplier(monsterCount, partySize = 4) {
  monsterCount = Math.max(1, parseInt(monsterCount) || 1);
  partySize = Math.max(1, parseInt(partySize) || 4);

  let baseMult = 1.0;
  if (monsterCount === 1) baseMult = 1.0;
  else if (monsterCount === 2) baseMult = 1.5;
  else if (monsterCount >= 3 && monsterCount <= 6) baseMult = 2.0;
  else if (monsterCount >= 7 && monsterCount <= 10) baseMult = 2.5;
  else if (monsterCount >= 11 && monsterCount <= 14) baseMult = 3.0;
  else if (monsterCount >= 15) baseMult = 4.0;

  // Compensação por tamanho do grupo
  if (partySize < 3) {
    // Grupo pequeno (< 3): usa próximo multiplicador mais alto
    if (baseMult === 1.0) baseMult = 1.5;
    else if (baseMult === 1.5) baseMult = 2.0;
    else if (baseMult === 2.0) baseMult = 2.5;
    else if (baseMult === 2.5) baseMult = 3.0;
    else if (baseMult === 3.0) baseMult = 4.0;
    else baseMult = 5.0;
  } else if (partySize >= 6) {
    // Grupo grande (6+): usa próximo multiplicador mais baixo
    if (baseMult === 1.5) baseMult = 1.0;
    else if (baseMult === 2.0) baseMult = 1.5;
    else if (baseMult === 2.5) baseMult = 2.0;
    else if (baseMult === 3.0) baseMult = 2.5;
    else if (baseMult === 4.0) baseMult = 3.0;
    else if (baseMult === 5.0) baseMult = 4.0;
  }

  return baseMult;
}

function calculateEncounterDifficulty(playerLevels, monsterList) {
  const partyThresholds = getPartyXpThresholds(playerLevels);
  
  if (!Array.isArray(monsterList) || monsterList.length === 0) {
    return {
      rawXp: 0,
      adjustedXp: 0,
      multiplier: 1.0,
      monsterCount: 0,
      difficulty: 'Trivial',
      difficultyLabel: 'Trivial (Nenhum monstro)',
      difficultyColor: 'var(--text-dim)',
      thresholds: partyThresholds
    };
  }

  let rawXp = 0;
  let totalMonsters = 0;

  monsterList.forEach(m => {
    const qty = Math.max(1, parseInt(m.qty || m.count) || 1);
    const xpEach = typeof m.xp === 'number' ? m.xp : getMonsterXp(m.cr);
    rawXp += xpEach * qty;
    totalMonsters += qty;
  });

  const multiplier = getEncounterMultiplier(totalMonsters, partyThresholds.count);
  const adjustedXp = Math.round(rawXp * multiplier);

  let difficulty = 'Trivial';
  let difficultyLabel = '🟢 Trivial';
  let difficultyColor = '#94a3b8';

  if (adjustedXp >= partyThresholds.deadly) {
    difficulty = 'Deadly';
    difficultyLabel = '💀 Mortal (Deadly)';
    difficultyColor = 'var(--accent-red)';
  } else if (adjustedXp >= partyThresholds.hard) {
    difficulty = 'Hard';
    difficultyLabel = '🟠 Difícil (Hard)';
    difficultyColor = '#f97316';
  } else if (adjustedXp >= partyThresholds.medium) {
    difficulty = 'Medium';
    difficultyLabel = '🟡 Médio (Medium)';
    difficultyColor = '#eab308';
  } else if (adjustedXp >= partyThresholds.easy) {
    difficulty = 'Easy';
    difficultyLabel = '🟢 Fácil (Easy)';
    difficultyColor = 'var(--accent-green)';
  }

  return {
    rawXp,
    adjustedXp,
    multiplier,
    monsterCount: totalMonsters,
    difficulty,
    difficultyLabel,
    difficultyColor,
    thresholds: partyThresholds
  };
}
