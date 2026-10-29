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

// ============================================================================
// 🧠 ITEM 5: LOUCURA, FERIMENTOS PERSISTENTES & DANO MACIÇO (DMG CAP. 8 & 9 - ISSUE-161)
// ============================================================================

const DMG_COMBAT_TRAUMA_TABLES = {
  shortTermMadness: [
    { roll: '01-20', duration: '1d10 minutos', condition: 'Paralisado', text: 'O personagem recua para dentro de sua própria mente e fica Paralisado. O efeito termina se o personagem sofrer qualquer dano.' },
    { roll: '21-30', duration: '1d10 minutos', condition: 'Incapacitado', text: 'O personagem fica Incapacitado e passa a duração gritando, rindo ou chorando histericamente.' },
    { roll: '31-40', duration: '1d10 minutos', condition: 'Amedrontado', text: 'O personagem fica Amedrontado e deve usar sua ação e movimento em cada turno para fugir da fonte do medo.' },
    { roll: '41-50', duration: '1d10 minutos', condition: null, text: 'O personagem começa a balbuciar e fica incapaz de falar normalmente ou conjurar magias com componente verbal.' },
    { roll: '51-60', duration: '1d10 minutos', condition: null, text: 'O personagem deve usar sua ação a cada rodada para atacar a criatura mais próxima.' },
    { roll: '61-70', duration: '1d10 minutos', condition: 'Atordoado', text: 'O personagem vivencia alucinações vívidas e tem Desvantagem em testes de atributo.' },
    { roll: '71-75', duration: '1d10 minutos', condition: null, text: 'O personagem faz qualquer coisa que qualquer um mandar que não seja obviamente autodestrutiva.' },
    { roll: '76-80', duration: '1d10 minutos', condition: null, text: 'O personagem sente uma compulsão irresistível de comer algo estranho, como terra, limo ou pedras.' },
    { roll: '81-90', duration: '1d10 minutos', condition: 'Atordoado', text: 'O personagem fica Atordoado pelo choque mental.' },
    { roll: '91-100', duration: '1d10 minutos', condition: 'Inconsciente', text: 'O personagem cai Inconsciente pelo trauma psíquico.' }
  ],
  longTermMadness: [
    { roll: '01-10', duration: '1d10 × 10 horas', condition: null, text: 'O personagem sente-se compelido a repetir uma atividade específica sem parar (lavar as mãos, rezar, contar moedas).' },
    { roll: '11-20', duration: '1d10 × 10 horas', condition: null, text: 'O personagem vivencia alucinações vívidas e tem Desvantagem em todos os testes de atributo.' },
    { roll: '21-30', duration: '1d10 × 10 horas', condition: 'Amedrontado', text: 'O personagem sofre de paranoia extrema e tem Desvantagem em testes de Sabedoria e Carisma.' },
    { roll: '31-40', duration: '1d10 × 10 horas', condition: null, text: 'O personagem sente aversão intensa por algo (geralmente a fonte da loucura), como se estivesse sob efeito de Antipatia.' },
    { roll: '41-45', duration: '1d10 × 10 horas', condition: null, text: 'O personagem sofre de um poderoso delírio; escolha uma poção e o personagem imagina estar sob seu efeito.' },
    { roll: '46-55', duration: '1d10 × 10 horas', condition: null, text: 'O personagem fica apegado a um "amuleto da sorte" (objeto ou pessoa) e tem Desvantagem em ataques, testes e salvaguardas se ficar a mais de 9m dele.' },
    { roll: '56-65', duration: '1d10 × 10 horas', condition: 'Cego', text: 'O personagem fica Cego (25%) ou Surdo (75%) psicossomático.' },
    { roll: '66-75', duration: '1d10 × 10 horas', condition: null, text: 'O personagem sofre tremores incontroláveis e tem Desvantagem em ataques, testes e salvaguardas de Força e Destreza.' },
    { roll: '76-85', duration: '1d10 × 10 horas', condition: null, text: 'O personagem sofre de amnésia parcial; conhece sua identidade e traços raciais, mas não reconhece aliados nem lembra do que aconteceu antes da loucura.' },
    { roll: '86-100', duration: '1d10 × 10 horas', condition: 'Inconsciente', text: 'O personagem perde a habilidade de falar ou cai em torpor profundo.' }
  ],
  indefiniteMadness: [
    { roll: '01-15', text: '"Estar bêbado ou entorpecido me mantém são."' },
    { roll: '16-25', text: '"Eu fico com tudo o que posso encontrar e acumulo objetos sem valor."' },
    { roll: '26-30', text: '"Eu tento me tornar mais parecido com outra pessoa que conheço — adotando suas roupas, maneirismos e nome."' },
    { roll: '31-35', text: '"Eu devo dobrar a verdade, exagerar ou mentir para parecer interessante para outras pessoas."' },
    { roll: '36-45', text: '"Alcançar meu objetivo é a única coisa que me interessa, e eu ignorarei tudo o mais para persegui-lo."' },
    { roll: '46-50', text: '"Acho difícil me importar com qualquer coisa que aconteça ao meu redor."' },
    { roll: '51-55', text: '"Não gosto do jeito que as pessoas me julgam o tempo todo."' },
    { roll: '56-70', text: '"Sou a pessoa mais inteligente, sábia, forte, rápida e bonita que conheço."' },
    { roll: '71-80', text: '"Estou convencido de que poderosos inimigos estão me caçando, e seus agentes estão em toda parte."' },
    { roll: '81-85', text: '"Há apenas uma pessoa em quem posso confiar. E apenas eu posso ver esse amigo especial."' },
    { roll: '86-95', text: '"Não posso levar nada a sério. Quanto mais séria a situação, mais engraçada eu a acho."' },
    { roll: '96-100', text: '"Descobri que eu realmente gosto de matar pessoas."' }
  ],
  lingeringInjuries: [
    { d20: 1, name: 'Perder um Olho', desc: 'Desvantagem em testes de Sabedoria (Percepção) baseados em visão e em jogadas de ataque à distância. Magia Regeneração restaura o olho.' },
    { d20: 2, name: 'Perder um Braço ou Mão', desc: 'Não pode mais segurar nada com duas mãos e só pode segurar um único objeto por vez. Magia Regeneração restaura o membro.' },
    { d20: 3, name: 'Perder um Pé ou Perna', desc: 'Deslocamento reduzido à metade (exige bengala ou muleta) e cai Caído após usar a ação Disparada sem passar em Destreza CD 10.' },
    { d20: 4, name: 'Mancar (Limp)', desc: 'Deslocamento a pé reduzido em 1,5m (5 pés). Deve passar em salvaguarda de Destreza CD 10 após Disparada ou cai Caído. Cura mágica remove.' },
    { d20: 5, name: 'Ferimento Interno', desc: 'Ao tentar realizar uma ação em combate, deve passar em salvaguarda de Constituição CD 15 ou perde a ação e não pode usar reações até o próximo turno. Cura mágica ou 10 dias de repouso removem.' },
    { d20: 6, name: 'Costelas Quebradas', desc: 'Mesmo efeito de Ferimento Interno, mas a CD da salvaguarda de Constituição é 10.' },
    { d20: 7, name: 'Cicatriz Horrível', desc: 'Desfigurado: tem Desvantagem em testes de Carisma (Persuasão) e Vantagem em testes de Carisma (Intimidação).' },
    { d20: 8, name: 'Ferida Infeccionada (Festering Wound)', desc: 'Seu PV máximo é reduzido em 1 a cada 24 horas que a ferida persistir. Cura mágica ou Medicina CD 15 (3 sucessos) fecha a ferida.' },
    { d20: 9, name: 'Cicatriz Menor', desc: 'A cicatriz não tem efeito mecânico adverso, servindo como marca honrosa de sobrevivência em batalha.' }
  ],
  systemShock: [
    { d10: 1, condition: 'Inconsciente', text: 'A criatura cai a 0 pontos de vida imediatamente.' },
    { d10: 2, condition: 'Inconsciente', text: 'A criatura cai a 0 pontos de vida, mas está estável.' },
    { d10: 3, condition: 'Atordoado', text: 'A criatura fica Atordoada até o final de seu próximo turno.' },
    { d10: 4, condition: null, text: 'A criatura não pode usar Reações e tem Desvantagem em ataques e testes até o final de seu próximo turno.' },
    { d10: 5, condition: null, text: 'A criatura não pode usar Reações até o final de seu próximo turno.' }
  ]
};

// ============================================================================
// 🪤 ITEM 6: GERADOR DE ARMADILHAS & PERIGOS DE MASMORRA (DMG CAP. 5 - ISSUE-161)
// ============================================================================

const DMG_TRAP_SEVERITY_STATS = {
  setback: {
    label: 'Contratempo (Setback)',
    dc: 10,
    attackBonus: 4,
    damageByTier: { '1-4': '1d10', '5-10': '2d10', '11-16': '4d10', '17-20': '10d10' }
  },
  dangerous: {
    label: 'Perigosa (Dangerous)',
    dc: 13,
    attackBonus: 7,
    damageByTier: { '1-4': '2d10', '5-10': '4d10', '11-16': '10d10', '17-20': '18d10' }
  },
  deadly: {
    label: 'Mortal (Deadly)',
    dc: 18,
    attackBonus: 11,
    damageByTier: { '1-4': '4d10', '5-10': '10d10', '11-16': '18d10', '17-20': '24d10' }
  }
};

const DMG_TRAPS_DATA = [
  { id: 'hidden_pit', name: 'Fosso Oculto (Hidden Pit)', type: 'Mecânica', damageType: 'concussão', saveOrAtk: 'Salvaguarda DES', desc: 'Um alçapão falso cede sob o peso do aventureiro, derrubando-o em um fosso profundo.' },
  { id: 'spiked_pit', name: 'Fosso com Estacas Envenenadas (Spiked Pit)', type: 'Mecânica', damageType: 'perfurante e veneno', saveOrAtk: 'Salvaguarda DES + CON', desc: 'Estacas afiadas no fundo do fosso perfuram a vítima e injetam toxina paralisante.' },
  { id: 'poison_darts', name: 'Dardos Envenenados (Poison Darts)', type: 'Mecânica', damageType: 'perfurante e veneno', saveOrAtk: 'Ataque à Distância', desc: 'Uma placa de pressão dispara múltiplos dardos envenenados das paredes do corredor.' },
  { id: 'rolling_sphere', name: 'Esfera de Pedra Rolante (Rolling Sphere)', type: 'Mecânica', damageType: 'concussão', saveOrAtk: 'Salvaguarda DES', desc: 'Uma imensa esfera de granito rola pelo corredor inclinado esmagando tudo no caminho.' },
  { id: 'fire_breathing_statue', name: 'Estátua Sopradora de Fogo (Fire-Breathing Statue)', type: 'Mágica', damageType: 'fogo', saveOrAtk: 'Salvaguarda DES', desc: 'Uma estátua dracônica exala um cone de chamas mágicas quando alguém pisa nas runas.' },
  { id: 'glyph_of_warding', name: 'Glifo de Vigilância Explosivo (Glyph of Warding)', type: 'Mágica', damageType: 'elétrico/fogo', saveOrAtk: 'Salvaguarda DES', desc: 'Um glifo arcano quase invisível explode com energia elemental ao abrir um baú ou porta.' },
  { id: 'scything_blade', name: 'Lâmina Ceifadora de Pêndulo (Scything Blade)', type: 'Mecânica', damageType: 'cortante', saveOrAtk: 'Ataque Corpo a Corpo', desc: 'Lâminas curvas saem de fendas no teto varrendo o corredor com força letal.' },
  { id: 'collapsing_roof', name: 'Teto Desmoronante (Collapsing Roof)', type: 'Mecânica', damageType: 'concussão', saveOrAtk: 'Salvaguarda DES', desc: 'Um fio de tropeço solta os suportes da câmara, derrubando toneladas de entulho sobre o grupo.' },
  { id: 'falling_net', name: 'Rede de Ferro Suspensa (Falling Net)', type: 'Mecânica', damageType: 'concussão (Impedido)', saveOrAtk: 'Salvaguarda FOR/DES', desc: 'Uma rede pesada com ganchos cai sobre os invasores, prendendo-os (Impedido, FOR CD 10).' },
  { id: 'rune_of_fear', name: 'Runa de Pavor Abissal (Rune of Fear)', type: 'Mágica', damageType: 'psíquico (Amedrontado)', saveOrAtk: 'Salvaguarda SAB', desc: 'Um selo sombrio projeta visões de terror na mente dos intrusos.' }
];

// ============================================================================
// 🏛️ ITEM 7: FACÇÕES & RENOME, BÊNÇÃOS DOS DEUSES & DÁDIVAS ÉPICAS (DMG CAP. 1 & 7 - ISSUE-161)
// ============================================================================

const DMG_FACTIONS_DATA = [
  {
    id: 'harpers',
    name: 'Os Harpistas (The Harpers)',
    icon: '🎵',
    motto: 'Abaixo a tirania; conhecimento e liberdade para todos.',
    ranks: [
      { renown: 1, title: 'Vigilante (Watcher)' },
      { renown: 3, title: 'Sombra da Harpa (Harpshadow)' },
      { renown: 10, title: 'Vela Brilhante (Brightcandle)' },
      { renown: 25, title: 'Sábio Coruja (Wise Owl)' },
      { renown: 50, title: 'Alto Harpista (High Harper)' }
    ]
  },
  {
    id: 'order_gauntlet',
    name: 'Ordem da Manopla (Order of the Gauntlet)',
    icon: '🥊',
    motto: 'Quando o mal ataca, nós revidamos com fé e justiça.',
    ranks: [
      { renown: 1, title: 'Chevall' },
      { renown: 3, title: 'Falcão Marcial (Marcheon)' },
      { renown: 10, title: 'Falcão Branco (Whitehawk)' },
      { renown: 25, title: 'Vindicador (Vindicator)' },
      { renown: 50, title: 'Mão Justa (Righteous Hand)' }
    ]
  },
  {
    id: 'emerald_enclave',
    name: 'Enclave Esmeralda (Emerald Enclave)',
    icon: '🌿',
    motto: 'A ordem natural deve ser preservada contra ameaças antinaturais.',
    ranks: [
      { renown: 1, title: 'Guardião da Primavera (Springwarden)' },
      { renown: 3, title: 'Passolargo do Verão (Summerstrider)' },
      { renown: 10, title: 'Ceifador do Outono (Autumnreaver)' },
      { renown: 25, title: 'Perseguidor do Inverno (Winterstalker)' },
      { renown: 50, title: 'Mestre da Selva (Master of the Wild)' }
    ]
  },
  {
    id: 'lords_alliance',
    name: 'Aliança dos Lordes (Lords\' Alliance)',
    icon: '👑',
    motto: 'A segurança da civilização exige união e força soberana.',
    ranks: [
      { renown: 1, title: 'Manto (Cloak)' },
      { renown: 3, title: 'Faca Vermelha (Redknife)' },
      { renown: 10, title: 'Lâmina Aguçada (Stingblade)' },
      { renown: 25, title: 'Coroa de Guerra (Warduke)' },
      { renown: 50, title: 'Coroa de Leão (Lioncrown)' }
    ]
  },
  {
    id: 'zhentarim',
    name: 'Zhentarim (A Rede Negra)',
    icon: '🐍',
    motto: 'Riqueza, poder e os melhores mercenários que o ouro pode comprar.',
    ranks: [
      { renown: 1, title: 'Presa (Fang)' },
      { renown: 3, title: 'Lobo (Wolf)' },
      { renown: 10, title: 'Víbora (Viper)' },
      { renown: 25, title: 'Ardragon' },
      { renown: 50, title: 'Senhor do Pavor (Dread Lord)' }
    ]
  }
];

const DMG_SUPERNATURAL_GIFTS_DATA = [
  { id: 'blessing_health', name: 'Bênção de Saúde (Blessing of Health)', type: 'Bênção Divina', statBonus: { attr: 'con', amount: 2 }, desc: 'Sua Constituição aumenta em +2, até o máximo de 22.' },
  { id: 'blessing_protection', name: 'Bênção de Proteção (Blessing of Protection)', type: 'Bênção Divina', acBonus: 1, desc: 'Você ganha +1 de bônus na CA e em todas as Salvaguardas.' },
  { id: 'blessing_magic_resistance', name: 'Bênção de Resistência à Magia', type: 'Bênção Divina', desc: 'Você tem Vantagem em todas as salvaguardas contra magias e outros efeitos mágicos.' },
  { id: 'blessing_understanding', name: 'Bênção de Compreensão (Blessing of Understanding)', type: 'Bênção Divina', statBonus: { attr: 'wis', amount: 2 }, desc: 'Sua Sabedoria aumenta em +2, até o máximo de 22.' },
  { id: 'blessing_valhalla', name: 'Bênção de Valhalla', type: 'Bênção Divina', desc: 'Concede o poder de invocar 2d4 + 2 espíritos guerreiros berserkers (como uma Trombeta de Valhalla de Prata) 1x a cada 7 dias.' },
  { id: 'charm_vitality', name: 'Amuleto de Vitalidade (Charm of Vitality)', type: 'Amuleto Sobrenatural', desc: 'Como uma ação, você recebe o benefício de uma Poção de Vitalidade (remove exaustão, cura doenças e maximiza Dados de Vida por 24h). Possui 1 uso.' },
  { id: 'charm_heroism', name: 'Amuleto de Heroísmo (Charm of Heroism)', type: 'Amuleto Sobrenatural', desc: 'Como uma ação, concede +10 PV temporários e o efeito da magia Bênção (+1d4 em ataques e salvaguardas) por 1 hora.' },
  { id: 'boon_invincibility', name: 'Dádiva da Invencibilidade (Boon of Invincibility)', type: 'Dádiva Épica', desc: 'Quando você sofre dano de qualquer fonte, você pode reduzir esse dano a 0 (1x por descanso curto ou longo).' },
  { id: 'boon_high_magic', name: 'Dádiva da Alta Magia (Boon of High Magic)', type: 'Dádiva Épica', desc: 'Você ganha um espaço de magia adicional de 9º círculo (desde que já possua um espaço de 9º círculo).' },
  { id: 'boon_recovery', name: 'Dádiva da Recuperação (Boon of Recovery)', type: 'Dádiva Épica', desc: 'Você pode usar uma Ação Bônus para recuperar um número de pontos de vida igual à metade do seu PV máximo (1x por descanso longo).' },
  { id: 'boon_combat_prowess', name: 'Dádiva da Proeza em Combate (Boon of Combat Prowess)', type: 'Dádiva Épica', desc: 'Quando você errar um ataque com arma, você pode escolher acertar em vez disso (1x por descanso curto ou longo).' },
  { id: 'boon_speed', name: 'Dádiva da Velocidade (Boon of Speed)', type: 'Dádiva Épica', desc: 'Seu deslocamento de caminhada aumenta em +9 metros (+30 pés) e você pode usar uma Ação Bônus para Disparada ou Desengajar.' }
];

// ============================================================================
// 🐉 ITEM 8: TABELA DE ESTATÍSTICAS DE MONSTRO POR ND (DMG P. 274 - ISSUE-161)
// ============================================================================

const DMG_MONSTER_CR_TABLE = [
  { cr: '0',   crNum: 0,     prof: 2, ac: 13, hpMin: 1,   hpMax: 6,   atk: 3,  dprMin: 0,   dprMax: 1,   saveDc: 13, xp: 10 },
  { cr: '1/8', crNum: 0.125, prof: 2, ac: 13, hpMin: 7,   hpMax: 35,  atk: 3,  dprMin: 2,   dprMax: 3,   saveDc: 13, xp: 25 },
  { cr: '1/4', crNum: 0.25,  prof: 2, ac: 13, hpMin: 36,  hpMax: 49,  atk: 3,  dprMin: 4,   dprMax: 5,   saveDc: 13, xp: 50 },
  { cr: '1/2', crNum: 0.5,   prof: 2, ac: 13, hpMin: 50,  hpMax: 70,  atk: 3,  dprMin: 6,   dprMax: 8,   saveDc: 13, xp: 100 },
  { cr: '1',   crNum: 1,     prof: 2, ac: 13, hpMin: 71,  hpMax: 85,  atk: 3,  dprMin: 9,   dprMax: 14,  saveDc: 13, xp: 200 },
  { cr: '2',   crNum: 2,     prof: 2, ac: 13, hpMin: 86,  hpMax: 100, atk: 3,  dprMin: 15,  dprMax: 20,  saveDc: 13, xp: 450 },
  { cr: '3',   crNum: 3,     prof: 2, ac: 13, hpMin: 101, hpMax: 115, atk: 4,  dprMin: 21,  dprMax: 26,  saveDc: 13, xp: 700 },
  { cr: '4',   crNum: 4,     prof: 2, ac: 14, hpMin: 116, hpMax: 130, atk: 5,  dprMin: 27,  dprMax: 32,  saveDc: 14, xp: 1100 },
  { cr: '5',   crNum: 5,     prof: 3, ac: 15, hpMin: 131, hpMax: 145, atk: 6,  dprMin: 33,  dprMax: 38,  saveDc: 15, xp: 1800 },
  { cr: '6',   crNum: 6,     prof: 3, ac: 15, hpMin: 146, hpMax: 160, atk: 6,  dprMin: 39,  dprMax: 44,  saveDc: 15, xp: 2300 },
  { cr: '7',   crNum: 7,     prof: 3, ac: 15, hpMin: 161, hpMax: 175, atk: 6,  dprMin: 45,  dprMax: 50,  saveDc: 15, xp: 2900 },
  { cr: '8',   crNum: 8,     prof: 3, ac: 16, hpMin: 176, hpMax: 190, atk: 7,  dprMin: 51,  dprMax: 56,  saveDc: 16, xp: 3900 },
  { cr: '9',   crNum: 9,     prof: 4, ac: 16, hpMin: 191, hpMax: 205, atk: 7,  dprMin: 57,  dprMax: 62,  saveDc: 16, xp: 5000 },
  { cr: '10',  crNum: 10,    prof: 4, ac: 17, hpMin: 206, hpMax: 220, atk: 7,  dprMin: 63,  dprMax: 68,  saveDc: 16, xp: 5900 },
  { cr: '11',  crNum: 11,    prof: 4, ac: 17, hpMin: 221, hpMax: 235, atk: 8,  dprMin: 69,  dprMax: 74,  saveDc: 17, xp: 7200 },
  { cr: '12',  crNum: 12,    prof: 4, ac: 17, hpMin: 236, hpMax: 250, atk: 8,  dprMin: 75,  dprMax: 80,  saveDc: 17, xp: 8400 },
  { cr: '13',  crNum: 13,    prof: 5, ac: 18, hpMin: 251, hpMax: 265, atk: 8,  dprMin: 81,  dprMax: 86,  saveDc: 18, xp: 10000 },
  { cr: '14',  crNum: 14,    prof: 5, ac: 18, hpMin: 266, hpMax: 280, atk: 8,  dprMin: 87,  dprMax: 92,  saveDc: 18, xp: 11500 },
  { cr: '15',  crNum: 15,    prof: 5, ac: 18, hpMin: 281, hpMax: 295, atk: 8,  dprMin: 93,  dprMax: 98,  saveDc: 18, xp: 13000 },
  { cr: '16',  crNum: 16,    prof: 5, ac: 18, hpMin: 296, hpMax: 310, atk: 9,  dprMin: 99,  dprMax: 104, saveDc: 18, xp: 15000 },
  { cr: '17',  crNum: 17,    prof: 6, ac: 19, hpMin: 311, hpMax: 325, atk: 10, dprMin: 105, dprMax: 110, saveDc: 19, xp: 18000 },
  { cr: '18',  crNum: 18,    prof: 6, ac: 19, hpMin: 326, hpMax: 340, atk: 10, dprMin: 111, dprMax: 116, saveDc: 19, xp: 20000 },
  { cr: '19',  crNum: 19,    prof: 6, ac: 19, hpMin: 341, hpMax: 355, atk: 10, dprMin: 117, dprMax: 122, saveDc: 19, xp: 22000 },
  { cr: '20',  crNum: 20,    prof: 6, ac: 19, hpMin: 356, hpMax: 400, atk: 10, dprMin: 123, dprMax: 140, saveDc: 19, xp: 25000 },
  { cr: '21',  crNum: 21,    prof: 7, ac: 19, hpMin: 401, hpMax: 445, atk: 11, dprMin: 141, dprMax: 158, saveDc: 20, xp: 33000 },
  { cr: '22',  crNum: 22,    prof: 7, ac: 19, hpMin: 446, hpMax: 490, atk: 11, dprMin: 159, dprMax: 176, saveDc: 20, xp: 41000 },
  { cr: '23',  crNum: 23,    prof: 7, ac: 19, hpMin: 491, hpMax: 535, atk: 11, dprMin: 177, dprMax: 194, saveDc: 20, xp: 50000 },
  { cr: '24',  crNum: 24,    prof: 7, ac: 19, hpMin: 536, hpMax: 580, atk: 12, dprMin: 195, dprMax: 212, saveDc: 21, xp: 62000 },
  { cr: '25',  crNum: 25,    prof: 8, ac: 19, hpMin: 581, hpMax: 625, atk: 12, dprMin: 213, dprMax: 230, saveDc: 21, xp: 75000 },
  { cr: '26',  crNum: 26,    prof: 8, ac: 19, hpMin: 626, hpMax: 670, atk: 12, dprMin: 231, dprMax: 248, saveDc: 21, xp: 90000 },
  { cr: '27',  crNum: 27,    prof: 8, ac: 19, hpMin: 671, hpMax: 715, atk: 13, dprMin: 249, dprMax: 266, saveDc: 22, xp: 105000 },
  { cr: '28',  crNum: 28,    prof: 8, ac: 19, hpMin: 716, hpMax: 760, atk: 13, dprMin: 267, dprMax: 284, saveDc: 22, xp: 120000 },
  { cr: '29',  crNum: 29,    prof: 9, ac: 19, hpMin: 761, hpMax: 805, atk: 13, dprMin: 285, dprMax: 302, saveDc: 22, xp: 135000 },
  { cr: '30',  crNum: 30,    prof: 9, ac: 19, hpMin: 806, hpMax: 9999,atk: 14, dprMin: 303, dprMax: 9999,saveDc: 23, xp: 155000 }
];

if (typeof window !== 'undefined') {
  window.DMG_COMBAT_TRAUMA_TABLES = DMG_COMBAT_TRAUMA_TABLES;
  window.DMG_TRAP_SEVERITY_STATS = DMG_TRAP_SEVERITY_STATS;
  window.DMG_TRAPS_DATA = DMG_TRAPS_DATA;
  window.DMG_FACTIONS_DATA = DMG_FACTIONS_DATA;
  window.DMG_SUPERNATURAL_GIFTS_DATA = DMG_SUPERNATURAL_GIFTS_DATA;
  window.DMG_MONSTER_CR_TABLE = DMG_MONSTER_CR_TABLE;
}
if (typeof global !== 'undefined') {
  global.DMG_COMBAT_TRAUMA_TABLES = DMG_COMBAT_TRAUMA_TABLES;
  global.DMG_TRAP_SEVERITY_STATS = DMG_TRAP_SEVERITY_STATS;
  global.DMG_TRAPS_DATA = DMG_TRAPS_DATA;
  global.DMG_FACTIONS_DATA = DMG_FACTIONS_DATA;
  global.DMG_SUPERNATURAL_GIFTS_DATA = DMG_SUPERNATURAL_GIFTS_DATA;
  global.DMG_MONSTER_CR_TABLE = DMG_MONSTER_CR_TABLE;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    DND5E_CR_TO_XP,
    DND5E_ENCOUNTER_THRESHOLDS,
    getMonsterXp,
    getPartyXpThresholds,
    getEncounterMultiplier,
    calculateEncounterDifficulty,
    DMG_COMBAT_TRAUMA_TABLES,
    DMG_TRAP_SEVERITY_STATS,
    DMG_TRAPS_DATA,
    DMG_FACTIONS_DATA,
    DMG_SUPERNATURAL_GIFTS_DATA,
    DMG_MONSTER_CR_TABLE
  };
}
