// Fallback seguro para efeitos sonoros caso AudioEngine não esteja presente
if (typeof playFX === 'undefined') {
  var playFX = function(type) {};
}

// src_js_core.js - State, Constants, Storage and Core Utilities

const CONDITIONS_LIST = [
  { id: 'envenenado', name: '🤢 Envenenado', desc: 'Desvantagem em ataques e testes de atributo.' },
  { id: 'cego', name: '👁️ Cego', desc: 'Falha automática em testes visuais. Ataques contra têm vantagem.' },
  { id: 'caido', name: '🛡️ Caído', desc: 'Ataques corpo a corpo a 1,5m contra têm vantagem; gasta metade do deslocamento para levantar.' },
  { id: 'paralisado', name: '⚡ Paralisado', desc: 'Incapacitado. Ataques a 1,5m são críticos automáticos.' },
  { id: 'atordoado', name: '💫 Atordoado', desc: 'Incapacitado, não pode se mover e fala vacilante.' },
  { id: 'agarrado', name: '🕸️ Agarrado', desc: 'Deslocamento reduzido a 0.' },
  { id: 'invisivel', name: '👻 Invisível', desc: 'Impossível de ser visto sem magia. Vantagem em ataques.' },
  { id: 'assustado', name: '😱 Aterrorizado', desc: 'Desvantagem em testes e ataques enquanto a fonte do medo estiver visível.' },
  { id: 'enfeiticado', name: '💖 Enfeitiçado', desc: 'Não pode atacar o conjurador; o conjurador tem vantagem em testes sociais.' },
  { id: 'incapacitado', name: '😵 Incapacitado', desc: 'Não pode realizar ações nem reações.' },
  { id: 'inconsciente', name: '💤 Inconsciente', desc: 'Incapacitado, larga itens, cai prostrado. Ataques a 1,5m são críticos.' },
  { id: 'petrificado', name: '🗿 Petrificado', desc: 'Transformado em pedra sólida. Resistência a todo dano.' },
  { id: 'concentracao', name: '🧠 Concentração', desc: 'Mantendo magia ativa. Deve fazer teste de CON ao levar dano.' },
  { id: 'sangrando', name: '🩸 Sangrando', desc: 'Menos de 50% dos PVs máximos ou sofrendo sangramento contínuo.' }
];

const PUZZLES = [
  { q: "Tenho cidades, mas não casas. Tenho montanhas, mas não árvores. Tenho água, mas não peixes. O que sou eu?", a: "Um mapa." },
  { q: "Quanto mais você tira de mim, maior eu fico. O que sou eu?", a: "Um buraco." },
  { q: "Falo sem boca e ouço sem ouvidos. Não tenho corpo, mas ganho vida com o vento. O que sou eu?", a: "O eco." },
  { q: "Se você me tem, quer me compartilhar. Se me compartilha, não me tem mais. O que sou eu?", a: "Um segredo." },
  { q: "Sou leve como uma pluma, mas nem o guerreiro mais forte consegue me segurar por mais de cinco minutos. O que sou?", a: "A respiração / O fôlego." },
  { q: "Ando de quatro patas pela manhã, duas patas à tarde e três patas à noite. O que sou?", a: "O ser humano (infância, vida adulta e velhice com bengala)." },
  { q: "O que pertence a você, mas os outros usam muito mais do que você?", a: "O seu nome." },
  { q: "Tenho chaves mas não abro portas. Tenho espaço mas não quartos. Você pode entrar, mas não pode sair. O que sou?", a: "Um teclado." }
];

const DND5E_SKILLS = [
  { key: 'atletismo', name: 'Atletismo', attr: 'str', label: 'FOR' },
  { key: 'acrobacia', name: 'Acrobacia', attr: 'dex', label: 'DES' },
  { key: 'furtividade', name: 'Furtividade', attr: 'dex', label: 'DES' },
  { key: 'prestidigitacao', name: 'Prestidigitação', attr: 'dex', label: 'DES' },
  { key: 'arcanismo', name: 'Arcanismo', attr: 'int', label: 'INT' },
  { key: 'historia', name: 'História', attr: 'int', label: 'INT' },
  { key: 'investigacao', name: 'Investigação', attr: 'int', label: 'INT' },
  { key: 'natureza', name: 'Natureza', attr: 'int', label: 'INT' },
  { key: 'religiao', name: 'Religião', attr: 'int', label: 'INT' },
  { key: 'adestramento', name: 'Adestrar Animais', attr: 'wis', label: 'SAB' },
  { key: 'intuicao', name: 'Intuição', attr: 'wis', label: 'SAB' },
  { key: 'medicina', name: 'Medicina', attr: 'wis', label: 'SAB' },
  { key: 'percepcao', name: 'Percepção', attr: 'wis', label: 'SAB' },
  { key: 'sobrevivencia', name: 'Sobrevivência', attr: 'wis', label: 'SAB' },
  { key: 'atuacao', name: 'Atuação', attr: 'cha', label: 'CAR' },
  { key: 'enganacao', name: 'Enganação', attr: 'cha', label: 'CAR' },
  { key: 'intimidacao', name: 'Intimidação', attr: 'cha', label: 'CAR' },
  { key: 'persuasao', name: 'Persuasão', attr: 'cha', label: 'CAR' }
];

const DND5E_XP_TABLE = [
  0, 300, 900, 2700, 6500, 14000, 23000, 34000, 48000, 64000,
  85000, 100000, 120000, 140000, 165000, 195000, 225000, 265000, 305000, 355000
];

let PLAYERS = [
  {
    id: "p1",
    student: "Arthur Lima",
    name: "Valerius Martelo Negro",
    avatar: "🛡️",
    race: "Anão da Colina",
    className: "Guerreiro (Campeão)",
    level: 2,
    xp: 350,
    ac: 16,
    hp: 24,
    maxHp: 24,
    tempHp: 0,
    speed: "7,5m",
    hitDice: "2d10",
    gold: 18,
    inspiration: true,
    conditions: [],
    deathSaves: { success: 0, fail: 0 },
    slots: [0, 0, 0, 0, 0],
    slotsUsed: [0, 0, 0, 0, 0],
    str: 16, dex: 12, con: 16, int: 10, wis: 12, cha: 8,
    skillProficiencies: ['atletismo', 'intimidacao'],
    saveProficiencies: ['str', 'con'],
    actionLogs: [],
    playerNotes: "Lembrar de comprar óleo para as tochas na próxima vila.",
    background: "Soldado",
    ideal: "Proteção: Protegerei meus aliados mesmo que custe minha própria vida.",
    bond: "Minha família de ferreiros de clã depende das minhas conquistas de batalha.",
    flaw: "Tenho dificuldade em recuar, mesmo diante de um perigo desmedido.",
    backstory: "Veterano da guarda da fortaleza de pedra de Felbarr, agora busca glória e honra para seu clã nas terras livres.",
    attacks: "Machado de Guerra (+5, 1d8+3 cortante) | Azagaia (+5, 1d6+3 perfurante)",
    features: "Retomar o Fôlego (1d10+2 PV), Surto de Ação, Estilo Defensivo (+1 CA)",
    spells: "Cota de Malha, Escudo de Aço, 2 Poções de Cura, Mochila de Aventureiro",
    activeCardTab: 'attacks',
    present: true
  },
  {
    id: "p2",
    student: "Beatriz Souza",
    name: "Lyra Brisa Suave",
    avatar: "✨",
    race: "Elfa da Floresta",
    className: "Maga (Evocação)",
    level: 2,
    xp: 350,
    ac: 13,
    hp: 14,
    maxHp: 14,
    tempHp: 0,
    speed: "10,5m",
    hitDice: "2d6",
    gold: 25,
    inspiration: false,
    conditions: [],
    deathSaves: { success: 0, fail: 0 },
    slots: [3, 0, 0, 0, 0],
    slotsUsed: [1, 0, 0, 0, 0],
    str: 8, dex: 16, con: 12, int: 16, wis: 13, cha: 10,
    skillProficiencies: ['arcanismo', 'historia', 'investigacao', 'percepcao'],
    saveProficiencies: ['int', 'wis'],
    actionLogs: [],
    playerNotes: "Encontrei runas misteriosas na masmorra antiga.",
    background: "Sábio",
    ideal: "Conhecimento: O poder arcano deve ser compreendido e dominado para o bem de todos.",
    bond: "Possuo um tomo antigo deixado por minha mestra com segredos ainda indecifrados.",
    flaw: "Fico tão absorta em fórmulas arcanas que às vezes ignoro perigos óbvios ao redor.",
    backstory: "Estudiosa da Grande Academia de Silverymoon, viaja decifrando glifos esquecidos em ruínas antigas.",
    attacks: "Raio de Gelo (+5, 1d8 frio) | Lança de Fogo (+5, 1d10 fogo) | Adaga (+5, 1d4+3)",
    features: "Recuperação Arcana (recupera 1 slot no descanso curto), Esculpir Magias",
    spells: "Grimório: Mísseis Mágicos, Escudo Arcano, Mãos Flamejantes, Sono, Orbe Cromático",
    preparedSpells: ["Mísseis Mágicos", "Escudo Arcano", "Mãos Flamejantes", "Raio de Gelo"],
    activeCardTab: 'spells',
    present: true
  },
  {
    id: "p3",
    student: "Caio Mendes",
    name: "Irmão Theron",
    avatar: "☀️",
    race: "Humano Variante",
    className: "Clérigo (Domínio da Vida)",
    level: 2,
    xp: 350,
    ac: 18,
    hp: 18,
    maxHp: 18,
    tempHp: 0,
    speed: "9m",
    hitDice: "2d8",
    gold: 14,
    inspiration: false,
    conditions: [],
    deathSaves: { success: 0, fail: 0 },
    slots: [3, 0, 0, 0, 0],
    slotsUsed: [0, 0, 0, 0, 0],
    str: 14, dex: 10, con: 14, int: 10, wis: 16, cha: 12,
    skillProficiencies: ['medicina', 'religiao', 'intuicao', 'persuasao'],
    saveProficiencies: ['wis', 'cha'],
    actionLogs: [],
    playerNotes: "Oração matinal antes de descer às catacumbas.",
    background: "Acólito",
    ideal: "Compaixão: Toda criatura ferida merece a chance de redenção e cura.",
    bond: "Jurei lealdade ao Templo da Luz do Alvorecer e devo proteger os necessitados.",
    flaw: "Confio com facilidade demais em quem pede ajuda, sem questionar suas intenções.",
    backstory: "Curandeiro devoto que deixou o santuário para levar a bênção solar e socorro aos viajantes em perigo.",
    attacks: "Maça (+4, 1d6+2 concussão) | Chama Sagrada (CD 13, 1d8 radiante)",
    features: "Discípulo da Vida (+2+nível de cura extra), Canalizar Divindade: Preservar a Vida (10 PV)",
    spells: "Preparadas: Bênção, Curar Ferimentos, Palavra Curativa, Raio Guia, Santuário",
    preparedSpells: ["Bênção", "Curar Ferimentos", "Palavra Curativa", "Chama Sagrada"],
    activeCardTab: 'spells',
    present: true
  },
  {
    id: "p4",
    student: "Danilo Rocha",
    name: "Shadow / Kaelen",
    avatar: "🗡️",
    race: "Meio-Elfo",
    className: "Ladino (Assassino)",
    level: 2,
    xp: 350,
    ac: 15,
    hp: 16,
    maxHp: 16,
    tempHp: 0,
    speed: "9m",
    hitDice: "2d8",
    gold: 32,
    inspiration: true,
    conditions: [],
    deathSaves: { success: 0, fail: 0 },
    slots: [0, 0, 0, 0, 0],
    slotsUsed: [0, 0, 0, 0, 0],
    str: 10, dex: 16, con: 12, int: 12, wis: 10, cha: 14,
    skillProficiencies: ['acrobacia', 'furtividade', 'prestidigitacao', 'enganacao'],
    saveProficiencies: ['dex', 'int'],
    actionLogs: [],
    playerNotes: "Guardar 10 PO para ferramentas novas de ladinagem.",
    background: "Criminoso",
    ideal: "Liberdade: Nenhuma corrente ou governante injusto deve ditar os passos de um homem livre.",
    bond: "Devo uma grande dívida a um antigo contato dos becos que salvou minha vida.",
    flaw: "Tenho o hábito involuntário de 'guardar' pequenos objetos valiosos esquecidos.",
    backstory: "Criado nas vielas portuárias, aprendeu a sobreviver nas sombras e hoje usa seus talentos com os aventureiros.",
    attacks: "Rapieira (+5, 1d8+3 perfurante) | Arco Curto (+5, 1d6+3 perfurante)",
    features: "Ataque Furtivo (+1d6), Ação Astuta (Correr, Desengajar ou Esconder como ação bônus)",
    spells: "Equipamento: Armadura de Couro Batido, Ferramentas de Ladrão, 20 Flechas, Pé de Cabra",
    activeCardTab: 'attacks',
    present: true
  }
];

let state = {
  round: 1,
  turnIndex: 0,
  combatants: [
    { id: 'c1', name: 'Valerius (Arthur)', init: 16, ac: 16, hp: 24, maxHp: 24, type: 'player', conditions: [], actions: 'Machado (+5, 1d8+3)' },
    { id: 'c2', name: 'Goblin Líder', init: 14, ac: 15, hp: 12, maxHp: 12, type: 'monster', conditions: [], actions: 'Cimitarra (+4, 1d6+2)' },
    { id: 'c3', name: 'Goblin Arqueiro A', init: 11, ac: 13, hp: 7, maxHp: 7, type: 'monster', conditions: [], actions: 'Arco Curto (+4, 1d6+2)' }
  ],
  logs: []
};

let puzzleIdx = 0;
let managingCondCombatantId = null;

// --- LOCAL STORAGE AUTO-SAVE ---
const STORAGE_KEY = 'dnd5e_prisco_sheet_state_v2';

function saveToLocalStorage() {
  try {
    const payload = {
      state,
      players: PLAYERS,
      gridState: (typeof gridState !== 'undefined' ? gridState : null)
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    if (typeof saveCampaignsState === 'function') saveCampaignsState();
    if (typeof syncLocalChangesToFirebase === 'function') syncLocalChangesToFirebase();
    showSaveStatus();
  } catch (e) {
    console.warn('Erro ao salvar no localStorage:', e);
  }
}

function saveGridStatePermanently() {
  saveToLocalStorage();
  try {
    if (typeof gridState !== 'undefined') {
      localStorage.setItem('dnd5e_prisco_live_grid', JSON.stringify(gridState));
    }
  } catch (e) {}
  if (typeof broadcastGridState === 'function') broadcastGridState();
  if (typeof playFX === 'function') playFX('crit');
  if (typeof addLog === 'function') addLog(`💾 <b>Grid de Batalha:</b> Mapa e posições dos combatentes foram salvos com sucesso!`);
  alert('Mapa e posições salvos com sucesso!');
}

function loadFromLocalStorage() {
  try {
    if (typeof loadCampaignsState === 'function') loadCampaignsState();
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const data = JSON.parse(raw);
    if (data.players && Array.isArray(data.players)) {
      PLAYERS = data.players.map(p => {
        if (!p.skillProficiencies) p.skillProficiencies = [];
        if (!p.saveProficiencies) p.saveProficiencies = [];
        if (!p.actionLogs) p.actionLogs = [];
        if (p.playerNotes === undefined) p.playerNotes = "";
        return p;
      });
    }
    if (data.state && Array.isArray(data.state.combatants)) state = data.state;
    if (data.gridState && typeof gridState !== 'undefined') {
      gridState = data.gridState;
    }
    return true;
  } catch (e) {
    return false;
  }
}

function showSaveStatus() {
  const el = document.getElementById('save-status');
  if (!el) return;
  el.style.opacity = '1';
  el.innerText = '💾 Salvo';
  if (typeof setTimeout !== 'undefined') {
    setTimeout(() => { if (el) el.style.opacity = '0.7'; }, 1000);
  }
}

function normalizeStr(str) {
  return (str || '')
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

// --- NAVEGAÇÃO ENTRE ABAS ---
function switchTab(tabId) {
  document.querySelectorAll('.tab-pane').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));

  const targetPane = document.getElementById('tab-' + tabId);
  if (targetPane) targetPane.classList.add('active');

  const activeBtn = Array.from(document.querySelectorAll('.tab-btn')).find(b => b.getAttribute('onclick')?.includes(tabId));
  if (activeBtn) activeBtn.classList.add('active');

  if (tabId === 'combat' && typeof renderCombat === 'function') renderCombat();
  else if (tabId === 'players' && typeof renderPlayers === 'function') renderPlayers();
  else if (tabId === 'grid') {
    if (typeof syncCombatantsToGrid === 'function') syncCombatantsToGrid();
    if (typeof renderBattleGrid === 'function') renderBattleGrid();
    if (typeof renderVttCombatHud === 'function') renderVttCombatHud();
    if (typeof fitBattleGridToView === 'function') {
      setTimeout(fitBattleGridToView, 50);
    }
  }
  else if (tabId === 'grid-config') {
    if (typeof renderGridConfig === 'function') renderGridConfig();
  }
  else if (tabId === 'spells' && typeof renderSpells === 'function') renderSpells();
  else if (tabId === 'bestiary' && typeof renderBestiary === 'function') renderBestiary();
  else if (tabId === 'equipment' && typeof renderEquipment === 'function') renderEquipment();
  else if (tabId === 'classes' && typeof renderClasses === 'function') renderClasses();
  else if (tabId === 'species' && typeof renderSpecies === 'function') renderSpecies();
  else if (tabId === 'campaigns' && typeof renderCampaigns === 'function') renderCampaigns();

  saveToLocalStorage();
}

function getProfBonus(level) {
  return Math.floor((level - 1) / 4) + 2;
}

function getMod(val) {
  const m = Math.floor((val - 10) / 2);
  return m >= 0 ? `+${m}` : `${m}`;
}

function nextPuzzle() {
  puzzleIdx = (puzzleIdx + 1) % PUZZLES.length;
  const qEl = document.getElementById('lbl-puzzle-q');
  const aEl = document.getElementById('lbl-puzzle-a');
  if (qEl) qEl.innerText = PUZZLES[puzzleIdx].q;
  if (aEl) {
    aEl.innerText = '💡 Solução: ' + PUZZLES[puzzleIdx].a;
    aEl.style.display = 'none';
  }
}

function togglePuzzle() {
  const aEl = document.getElementById('lbl-puzzle-a');
  if (aEl) {
    if (aEl.style.display === 'none' || !aEl.style.display) {
      aEl.style.display = 'block';
    } else {
      aEl.style.display = 'none';
    }
  }
}

function highlightInlineRules(text) {
  if (!text) return '';
  return text
    // Remove marcadores markdown bold e aplica destaque
    .replace(/\*\*(.*?)\*\*/g, '<strong class="hl-keyword">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em style="color:#e2e8f0;">$1</em>')
    // Dados de dano/cura (ex: 1d6, 2d8+3, 1d20)
    .replace(/\b(\d+d\d+(?:\s*[\+\-]\s*\d+)?)\b/gi, '<span class="hl-dice">🎲 $1</span>')
    // Moedas D&D (ex: 50 PO, 100 PL, 5 PC)
    .replace(/\b(\d+[\.,]?\d*\s*(?:PO|PP|PC|PE|PL))\b/g, '<span class="hl-gold">🪙 $1</span>')
    // Distâncias (ex: 9m, 18 metros, 30 ft, 6 quadrados)
    .replace(/\b(\d+(?:[\.,]\d+)?\s*(?:m|metros|ft|pés|quadrados))\b/gi, '<span class="hl-dist">📏 $1</span>')
    // Tempos e Ações (ex: 2 horas, 1 minuto, 1 ação bônus, descanso curto)
    .replace(/\b(\d+\s*(?:horas?|minutos?|segundos?|turnos?|rodadas?|dias?))\b/gi, '<span class="hl-time">⏱️ $1</span>')
    .replace(/\b(Ação Bônus|Ação bônus|Reação|Ação Padrão|Ação Livre|Descanso Curto|Descanso Longo|Ação de Movimento)\b/gi, '<span class="hl-time">⏱️ $1</span>')
    // Círculos de magia (ex: 1º círculo, 2º círculo)
    .replace(/\b(\d+º\s*(?:círculo|circulo|nível|nivel))\b/gi, '<span class="hl-circle">🔮 $1</span>');
}

function getTopicIconForText(text) {
  const t = (text || '').toLowerCase();
  if (t.includes('ouro') || t.includes(' po') || t.includes('custo') || t.includes('gasta') || t.includes('gasto') || t.includes('preço') || t.includes('preco')) return '💰';
  if (t.includes('hora') || t.includes('minuto') || t.includes('descanso') || t.includes('turno') || t.includes('rodada') || t.includes('ação') || t.includes('acao') || t.includes('reação') || t.includes('reacao')) return '⏱️';
  if (t.includes('magia') || t.includes('grimório') || t.includes('grimorio') || t.includes('pergaminho') || t.includes('círculo') || t.includes('circulo') || t.includes('truque') || t.includes('slot') || t.includes('arcano') || t.includes('divin')) return '✨';
  if (t.includes('ataque') || t.includes('dano') || t.includes('arma') || t.includes('acerto') || t.includes('crítico') || t.includes('critico') || t.includes('combate') || t.includes('golpe')) return '⚔️';
  if (t.includes('ca ') || t.includes('armadura') || t.includes('escudo') || t.includes('defesa') || t.includes('resiste') || t.includes('salvaguarda') || t.includes('pv ') || t.includes('vida')) return '🛡️';
  if (t.includes('começa') || t.includes('comeca') || t.includes('ganha') || t.includes('nível') || t.includes('nivel') || t.includes('+') || t.includes('evolu')) return '🎲';
  if (t.includes('metro') || t.includes('distân') || t.includes('distan') || t.includes('alcance') || t.includes('deslocamento') || t.includes('área') || t.includes('area') || t.includes('raio')) return '📏';
  if (t.includes('tomo') || t.includes('livro') || t.includes('estudo') || t.includes('conhecimento') || t.includes('saber')) return '📜';
  return '💡';
}

function formatFeatureToTopics(rawDesc, options = {}) {
  if (!rawDesc) return '<div class="skill-concept-box">Nenhuma descrição disponível.</div>';

  // Normalização do texto
  let cleanDesc = rawDesc.trim();

  // Dividir por quebras de linha ou por marcadores de tópicos
  let rawChunks = [];
  if (cleanDesc.includes('\n') || cleanDesc.includes('•') || cleanDesc.includes('- ')) {
    rawChunks = cleanDesc.split(/(?:\r?\n)+|[•\-]\s+/).map(s => s.trim()).filter(Boolean);
  } else {
    // Tenta dividir por sentenças terminadas em ponto que introduzem novas regras ou cláusulas
    // Ex: "Você possui um tomo arcano contendo suas fórmulas mágicas. Começa com 6 magias de 1º círculo e ganha +2 magias gratuitas a cada novo nível de mago, além de poder copiar qualquer pergaminho ou grimório encontrado gastando 50 PO e 2 horas por círculo de magia."
    const sentences = cleanDesc.split(/(?<=[.!?])\s+(?=[A-ZÀ-Ú0-9"“\*\+])/g).map(s => s.trim()).filter(Boolean);
    
    // Se tiver apenas 1 sentença mas tiver cláusula conectiva forte como ", além de poder " ou ", você também ", separa
    if (sentences.length === 1 && cleanDesc.includes(', além de ')) {
      const parts = cleanDesc.split(/,\s+(?=além de )/i);
      rawChunks = parts.map(p => p.trim()).filter(Boolean);
    } else {
      // Caso uma das sentenças tenha ", além de "
      sentences.forEach(sent => {
        if (sent.includes(', além de ')) {
          const subParts = sent.split(/,\s+(?=além de )/i);
          subParts.forEach(sp => rawChunks.push(sp.trim()));
        } else {
          rawChunks.push(sent);
        }
      });
    }
  }

  if (rawChunks.length === 0) {
    return `<div class="skill-concept-box">${highlightInlineRules(cleanDesc)}</div>`;
  }

  let html = '';
  let startIndex = 0;

  // Se tiver 2 ou mais partes, a primeira serve como Conceito Geral se for puramente descritiva
  if (rawChunks.length > 1) {
    const firstChunk = rawChunks[0];
    const isConcept = !firstChunk.toLowerCase().startsWith('começa') && 
                      !firstChunk.toLowerCase().startsWith('ganha') && 
                      !firstChunk.toLowerCase().startsWith('custo');
    if (isConcept) {
      html += `<div class="skill-concept-box">${highlightInlineRules(firstChunk)}</div>`;
      startIndex = 1;
    }
  }

  html += '<div class="skill-topics-list">';
  for (let i = startIndex; i < rawChunks.length; i++) {
    const chunk = rawChunks[i];
    if (!chunk) continue;
    const icon = getTopicIconForText(chunk);
    const formatted = highlightInlineRules(chunk);
    html += `
      <div class="skill-topic-card">
        <div class="skill-topic-icon">${icon}</div>
        <div class="skill-topic-content">${formatted}</div>
      </div>
    `;
  }
  html += '</div>';

  return html;
}

// --- SISTEMA DE BACKUP & RESTAURAÇÃO TOTAL (JSON) ---
function exportCompleteBackupJson() {
  try {
    const backupData = {
      appName: 'Planilha RPG D&D 5E Assistant & VTT',
      version: '3.5',
      exportDate: new Date().toISOString(),
      players: typeof PLAYERS !== 'undefined' ? PLAYERS : [],
      combatState: typeof state !== 'undefined' ? state : { round: 1, turnIndex: 0, combatants: [] },
      gridState: typeof gridState !== 'undefined' ? gridState : null,
      scenesState: typeof scenesState !== 'undefined' ? scenesState : null,
      campaignsState: typeof campaignsState !== 'undefined' ? campaignsState : null,
      dmNotes: typeof localStorage !== 'undefined' ? localStorage.getItem('dnd_tracker_dm_notes_v3') || '' : '',
      customMonsters: typeof CUSTOM_MONSTERS !== 'undefined' ? CUSTOM_MONSTERS : [],
      customSpells: typeof CUSTOM_SPELLS !== 'undefined' ? CUSTOM_SPELLS : [],
      customEquipment: typeof CUSTOM_EQUIPMENT !== 'undefined' ? CUSTOM_EQUIPMENT : []
    };

    const jsonStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const now = new Date();
    const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
    const filename = `backup_rpg_dnd5e_${dateStr}.json`;

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    if (typeof playFX === 'function') playFX('heal');
    if (typeof addLog === 'function') {
      addLog(`💾 <b>Backup Concluído:</b> Todos os dados do RPG foram salvos no arquivo [${filename}]!`);
    }
  } catch (e) {
    console.error('Erro ao exportar backup:', e);
    alert('Erro ao gerar arquivo de backup: ' + e.message);
  }
}

function exportData() {
  exportCompleteBackupJson();
}

function importBackupJson() {
  const inp = document.getElementById('inp-import-backup');
  if (inp) {
    inp.value = '';
    inp.click();
  } else {
    alert('Elemento de importação de arquivo não encontrado.');
  }
}

function importData() {
  importBackupJson();
}

function handleBackupFileSelected(input) {
  if (!input || !input.files || input.files.length === 0) return;
  const file = input.files[0];

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const raw = e.target.result;
      const data = JSON.parse(raw);

      if (!data || typeof data !== 'object') {
        throw new Error('Arquivo JSON inválido ou vazio.');
      }

      // Validação de estrutura mínima
      const hasPlayers = Array.isArray(data.players) || Array.isArray(data.PLAYERS);
      const hasCombat = data.combatState || data.state;
      const hasGrid = data.gridState || data.scenesState;
      const hasCampaigns = data.campaignsState;

      if (!hasPlayers && !hasCombat && !hasGrid && !hasCampaigns) {
        throw new Error('O arquivo não contém dados reconhecidos da Planilha RPG.');
      }

      if (confirm(`Deseja restaurar o backup de "${file.name}" gerado em ${data.exportDate || 'data desconhecida'}? Isso atualizará fichas, combate, mapa e notas.`)) {
        // Restaura jogadores
        if (hasPlayers) {
          const importedPlayers = data.players || data.PLAYERS || [];
          PLAYERS = importedPlayers.map(p => {
            if (!p.skillProficiencies) p.skillProficiencies = [];
            if (!p.saveProficiencies) p.saveProficiencies = [];
            if (!p.actionLogs) p.actionLogs = [];
            if (p.playerNotes === undefined) p.playerNotes = '';
            return p;
          });
        }

        // Restaura combate
        if (data.combatState) {
          state = data.combatState;
        } else if (data.state) {
          state = data.state;
        }

        // Restaura grid e cenas
        if (data.gridState && typeof gridState !== 'undefined') {
          gridState = data.gridState;
        }
        if (data.scenesState && typeof scenesState !== 'undefined') {
          scenesState = data.scenesState;
        }

        // Restaura campanhas
        if (data.campaignsState && typeof campaignsState !== 'undefined') {
          campaignsState = data.campaignsState;
        }

        // Restaura notas do mestre
        if (data.dmNotes && typeof localStorage !== 'undefined') {
          localStorage.setItem('dnd_tracker_dm_notes_v3', data.dmNotes);
          const notesTextarea = document.getElementById('inp-dm-quick-notes');
          if (notesTextarea) notesTextarea.value = data.dmNotes;
        }

        // Salva e atualiza visual
        saveToLocalStorage();
        if (typeof renderPlayers === 'function') renderPlayers();
        if (typeof renderCombat === 'function') renderCombat();
        if (typeof renderBattleGrid === 'function') renderBattleGrid();
        if (typeof renderCampaigns === 'function') renderCampaigns();
        if (typeof broadcastGridState === 'function') broadcastGridState();

        if (typeof playFX === 'function') playFX('crit');
        if (typeof addLog === 'function') {
          addLog(`📂 <b>Backup Restaurado:</b> Dados carregados com sucesso a partir de [${file.name}]!`);
        }
        alert('Backup carregado e restaurado com sucesso!');
      }
    } catch (err) {
      console.error('Erro ao importar backup:', err);
      alert('Falha ao processar arquivo de backup: ' + err.message);
    }
  };

  reader.readAsText(file);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    highlightInlineRules,
    getTopicIconForText,
    formatFeatureToTopics,
    exportCompleteBackupJson,
    exportData,
    importBackupJson,
    importData,
    handleBackupFileSelected
  };
}

