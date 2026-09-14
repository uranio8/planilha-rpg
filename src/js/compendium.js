// src_js_compendium.js - Spells, Bestiary, Equipment, Attendance, Loot and Encounter Generators

// --- ALIASES EM INGLÊS / PORTUGUÊS PARA MAGIAS ---
const SPELL_PHRASE_ALIASES = {
  'fireball': 'bola de fogo',
  'cure wounds': 'curar ferimentos',
  'healing word': 'palavra de cura',
  'magic missile': 'misseis magicos',
  'magic missiles': 'misseis magicos',
  'shield': 'escudo arcano',
  'mage armor': 'armadura arcana',
  'eldritch blast': 'rajada mistica',
  'haste': 'velocidade',
  'slow': 'lentidao',
  'fly': 'voo',
  'invisibility': 'invisibilidade',
  'greater invisibility': 'invisibilidade maior',
  'counterspell': 'contramagia',
  'dispel magic': 'dissipar magia',
  'revivify': 'reviver',
  'polymorph': 'metamorfose',
  'bless': 'bencao',
  'bane': 'perdicao',
  'guiding bolt': 'raio guiador',
  'sacred flame': 'chama sagrada',
  'spiritual weapon': 'arma espiritual',
  'spirit guardians': 'guardioes espirituais',
  'thunderwave': 'onda trovejante',
  'detect magic': 'detectar magia',
  'misty step': 'passo nebuloso',
  'dimension door': 'porta dimensional',
  'hold person': 'imobilizar pessoa',
  'hold monster': 'imobilizar monstro',
  'web': 'teia',
  'scorching ray': 'raio ardente',
  'feather fall': 'queda suave',
  'vicious mockery': 'zombaria viciosa',
  'hunters mark': 'marca do cacador',
  "hunter's mark": 'marca do cacador',
  'hex': 'bruxaria',
  'toll the dead': 'soar os mortos',
  'inflict wounds': 'infligir ferimentos',
  'guidance': 'orientacao',
  'light': 'luz',
  'darkness': 'escuridao',
  'hypnotic pattern': 'padrao hipnotico',
  'lightning bolt': 'relampago',
  'chain lightning': 'corrente de relampagos',
  'cone of cold': 'cone de frio',
  'finger of death': 'dedo da morte',
  'power word kill': 'palavra de poder matar',
  'wish': 'desejo'
};

function setGrimoireSchoolFilter(schoolName) {
  const sel = document.getElementById('filter-spell-sch');
  if (sel) {
    sel.value = schoolName;
  }
  document.querySelectorAll('.grimoire-filter-chip').forEach(chip => {
    chip.classList.toggle('active', chip.getAttribute('data-school') === schoolName);
  });
  renderSpells();
}

function handleSpellSearchInput(val) {
  renderSpells();
}

function clearSpellSearch() {
  const inp = document.getElementById('filter-spell-q');
  if (inp) {
    inp.value = '';
    inp.focus();
  }
  renderSpells();
}

function clearAllSpellFilters() {
  const inpQ = document.getElementById('filter-spell-q');
  const selCls = document.getElementById('filter-spell-cls');
  const selLvl = document.getElementById('filter-spell-lvl');
  const selSch = document.getElementById('filter-spell-sch');
  const selTag = document.getElementById('filter-spell-tag');
  const selSort = document.getElementById('filter-spell-sort');

  if (inpQ) inpQ.value = '';
  if (selCls) selCls.value = 'all';
  if (selLvl) selLvl.value = 'all';
  if (selSch) selSch.value = 'all';
  if (selTag) selTag.value = 'all';
  if (selSort) selSort.value = 'relevance';

  document.querySelectorAll('.grimoire-filter-chip').forEach(chip => {
    chip.classList.toggle('active', chip.getAttribute('data-school') === 'all');
  });

  renderSpells();
}

// --- GRIMÓRIO DE MAGIAS ---
function renderSpells() {
  const grid = document.getElementById('grid-spells');
  const badge = document.getElementById('cnt-spells');
  const resultsCounter = document.getElementById('spells-meta-stats');
  const rawQ = document.getElementById('filter-spell-q')?.value || '';
  let q = typeof normalizeStr === 'function' ? normalizeStr(rawQ) : rawQ.toLowerCase().trim();

  // Alias lookup em inglês
  if (q && SPELL_PHRASE_ALIASES[q]) {
    q = SPELL_PHRASE_ALIASES[q];
  }

  const cls = document.getElementById('filter-spell-cls')?.value || 'all';
  const lvl = document.getElementById('filter-spell-lvl')?.value || 'all';
  const sch = document.getElementById('filter-spell-sch')?.value || 'all';
  const tag = document.getElementById('filter-spell-tag')?.value || 'all';
  const sortOrder = document.getElementById('filter-spell-sort')?.value || 'relevance';

  if (typeof SPELLS_DATA === 'undefined') return;

  let filtered = SPELLS_DATA.filter(s => {
    if (q) {
      const sName = typeof normalizeStr === 'function' ? normalizeStr(s.name) : s.name.toLowerCase();
      const sDesc = typeof normalizeStr === 'function' ? normalizeStr(s.desc) : (s.desc || '').toLowerCase();
      const sSchool = typeof normalizeStr === 'function' ? normalizeStr(s.school) : (s.school || '').toLowerCase();
      if (!sName.includes(q) && !sDesc.includes(q) && !sSchool.includes(q)) return false;
    }
    if (cls !== 'all' && !(s.classes || []).includes(cls)) return false;
    if (lvl !== 'all' && s.level !== parseInt(lvl, 10)) return false;
    if (sch !== 'all' && s.school !== sch) return false;

    // Filtros por Tag (Concentração / Ritual)
    if (tag === 'concentration' || tag === 'conc') {
      const isConc = (s.duration || '').toLowerCase().includes('concentra') || (s.desc || '').toLowerCase().includes('concentra');
      if (!isConc) return false;
    } else if (tag === 'ritual') {
      const isRitual = (s.components || '').toLowerCase().includes('r') || (s.time || '').toLowerCase().includes('ritual') || (s.desc || '').toLowerCase().includes('ritual');
      if (!isRitual) return false;
    }

    return true;
  });

  // Ordenação
  filtered.sort((a, b) => {
    if (sortOrder === 'level-asc' || sortOrder === 'lvl-asc' || sortOrder === 'relevance') {
      if (a.level !== b.level) return a.level - b.level;
      return a.name.localeCompare(b.name, 'pt-BR');
    }
    if (sortOrder === 'level-desc' || sortOrder === 'lvl-desc') {
      if (a.level !== b.level) return b.level - a.level;
      return a.name.localeCompare(b.name, 'pt-BR');
    }
    if (sortOrder === 'name-asc') {
      return a.name.localeCompare(b.name, 'pt-BR');
    }
    if (sortOrder === 'name-desc') {
      return b.name.localeCompare(a.name, 'pt-BR');
    }
    return 0;
  });

  if (badge) badge.innerText = filtered.length;
  if (resultsCounter) resultsCounter.innerText = `${filtered.length} magias encontradas`;
  if (!grid) return;

  grid.innerHTML = filtered.map(s => {
    let formattedDesc = (s.desc || '')
      .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
      .replace(/\*(.*?)\*/g, '<i>$1</i>');

    const isConcentration = (s.duration || '').toLowerCase().includes('concentra') || (s.desc || '').toLowerCase().includes('concentra');
    const isRitual = (s.components || '').toLowerCase().includes('r') || (s.time || '').toLowerCase().includes('ritual') || (s.desc || '').toLowerCase().includes('ritual');

    const safeSpellName = s.name.replace(/'/g, "\\'");
    const safeSpellDesc = (s.desc || '').replace(/'/g, "\\'");

    return `
      <div class="item-card">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px;">
            <div>
              <div style="font-size: 15px; font-weight: 800; font-family: var(--font-title); color: #fff;">${s.name}</div>
              <div style="font-size: 11px; color: var(--text-muted);">${s.level === 0 ? 'Truque' : s.level + 'º Círculo'} • <span style="color: #c084fc;">${s.school}</span></div>
            </div>
            <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 3px;">
              <span class="badge badge-sch">${s.level === 0 ? 'Truque' : 'Círculo ' + s.level}</span>
              ${isConcentration ? '<span class="badge badge-cr" style="font-size: 9px; padding: 1px 5px;">🧠 Concentração</span>' : ''}
              ${isRitual ? '<span class="badge badge-src" style="font-size: 9px; padding: 1px 5px;">📜 Ritual</span>' : ''}
            </div>
          </div>

          <div style="display: flex; gap: 4px; flex-wrap: wrap; margin-bottom: 8px;">
            ${(s.classes || []).map(c => `<span class="badge badge-cls">${c}</span>`).join('')}
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; background: #080c16; padding: 6px 8px; border-radius: 6px; border: 1px solid var(--border-color); font-size: 11px; margin-bottom: 8px;">
            <div><span style="color: var(--text-dim);">Tempo:</span> <b style="color: #fff;">${s.time || '1 ação'}</b></div>
            <div><span style="color: var(--text-dim);">Alcance:</span> <b style="color: #fff;">${s.range || 'Pessoal'}</b></div>
            <div><span style="color: var(--text-dim);">Duração:</span> <b style="color: #fff;">${s.duration || 'Instantânea'}</b></div>
            <div><span style="color: var(--text-dim);">Comp:</span> <b style="color: #fff;">${s.components || 'V, S'}</b></div>
          </div>

          <div style="font-size: 12px; color: #cbd5e1; line-height: 1.4; margin-bottom: 10px;">${formattedDesc}</div>
        </div>

        <button class="btn-action" style="width: 100%; justify-content: center; font-size: 11px; padding: 6px 10px;" onclick="castSpellToCombat('${safeSpellName}', ${s.level}, '${safeSpellDesc}')">
          ✨ Lançar Magia no Combate
        </button>
      </div>
    `;
  }).join('');
}

function castSpellToCombat(name, level, desc) {
  const lvlStr = level === 0 ? 'Truque (Nv 0)' : `${level}º Círculo`;
  if (typeof addLog === 'function') {
    addLog(`✨ <b>Magia Lançada:</b> [${name} (${lvlStr})] ➔ <i>${desc.substring(0, 110)}...</i>`);
  }
  if (typeof playFX === 'function') playFX('spell');
  if (typeof showLiveDiceRoll === 'function') {
    showLiveDiceRoll(`✨ ${name}`, lvlStr, 'Magia Conjurada no Combate');
  }
  switchTab('combat');
}

// --- BESTIÁRIO INTELIGENTE & BUSCA AVANÇADA (D&D 5E / 2024) ---

function normalizeBestiarySearch(str) {
  return (str || '')
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseMonsterCr(crStr) {
  if (crStr === undefined || crStr === null) return 0;
  const s = String(crStr).trim();
  if (s.includes('/')) {
    const parts = s.split('/');
    const num = parseFloat(parts[0]);
    const den = parseFloat(parts[1]);
    return (den && !isNaN(num) && !isNaN(den)) ? num / den : 0;
  }
  return parseFloat(s) || 0;
}

const BESTIARY_PHRASE_ALIASES = [
  { en: 'red dragon', pt: 'dragao vermelho' },
  { en: 'black dragon', pt: 'dragao negro' },
  { en: 'blue dragon', pt: 'dragao azul' },
  { en: 'green dragon', pt: 'dragao verde' },
  { en: 'white dragon', pt: 'dragao branco' },
  { en: 'gold dragon', pt: 'dragao de ouro' },
  { en: 'silver dragon', pt: 'dragao de prata' },
  { en: 'bronze dragon', pt: 'dragao de bronze' },
  { en: 'brass dragon', pt: 'dragao de latao' },
  { en: 'copper dragon', pt: 'dragao de cobre' },
  { en: 'owlbear', pt: 'urso coruja' },
  { en: 'mind flayer', pt: 'devorador de mentes' },
  { en: 'illithid', pt: 'devorador de mentes' },
  { en: 'gelatinous cube', pt: 'cubo gelatinoso' },
  { en: 'displacer beast', pt: 'besta deslocadora' },
  { en: 'beholder', pt: 'observador' },
  { en: 'mimic', pt: 'mimico' },
  { en: 'skeleton', pt: 'esqueleto' },
  { en: 'zombie', pt: 'zumbi' },
  { en: 'wolf', pt: 'lobo' },
  { en: 'spider', pt: 'aranha' },
  { en: 'bear', pt: 'urso' },
  { en: 'dragon', pt: 'dragao' },
  { en: 'giant', pt: 'gigante' },
  { en: 'vampire', pt: 'vampiro' },
  { en: 'werewolf', pt: 'lobisomem' },
  { en: 'ghoul', pt: 'carnical' },
  { en: 'ghast', pt: 'ghast' },
  { en: 'wight', pt: 'tupico' },
  { en: 'wraith', pt: 'aparicao' },
  { en: 'specter', pt: 'espectro' },
  { en: 'hag', pt: 'bruxa' }
];

const BESTIARY_TYPE_KEYWORDS = {
  undead: ['morto-vivo', 'morto vivo', 'esqueleto', 'zumbi', 'carnical', 'fantasma', 'vampiro', 'lich', 'mumia', 'espectro', 'aparicao', 'sombra', 'necrofago', 'ghoul', 'ghast', 'wight', 'wraith', 'tupico', 'insepulto'],
  dragon: ['dragao', 'dragonete', 'wyrm', 'serpe', 'drake', 'dracolich', 'tartaruga-dragao'],
  beast: ['lobo', 'urso', 'leao', 'tigre', 'aguia', 'coruja', 'javali', 'crocodilo', 'tubarao', 'cobra', 'serpente', 'aranha', 'rato', 'cavalo', 'alce', 'abutre', 'cao', 'morcego', 'sapo', 'pantera', 'leopardo', 'fera', 'besta'],
  humanoid: ['humanoide', 'humano', 'elfo', 'anao', 'orque', 'orc', 'goblin', 'hobgoblin', 'bugbear', 'kobold', 'gnoll', 'ladino', 'guardiao', 'cavaleiro', 'cultista', 'bandido', 'arqueiro', 'mago', 'clerigo', 'bardo', 'druida', 'feiticeiro', 'bruxo', 'guerreiro', 'monge', 'paladino', 'patrulheiro'],
  fiend: ['corruptor', 'demonio', 'diabo', 'infernal', 'abissal', 'succubus', 'incubus', 'pesadelo', 'rakshasa', 'balor', 'pit fiend', 'hezrou', 'vrock', 'marilith', 'glabrezu', 'dretch', 'lemure'],
  giant: ['gigante', 'ogro', 'ogre', 'troll', 'ciclopes', 'ciclope', 'ettino', 'oni'],
  monstrosity: ['monstruosidade', 'urso coruja', 'urso-coruja', 'basilisco', 'quimera', 'manticora', 'medusa', 'hidra', 'grifo', 'harpa', 'hipogrifo', 'esfinge', 'behir', 'gorgon', 'cocatez', 'anquegue', 'remorhaz', 'roper', 'bulette'],
  construct: ['constructo', 'golem', 'armadura animada', 'espada animada', 'escudo animado', 'homunculo', 'colosso', 'automato', 'estatua animada'],
  fey: ['feerico', 'feérico', 'fada', 'pixie', 'sprite', 'driade', 'dríade', 'satir', 'satiro', 'sátiro', 'ninfa', 'bruxa do saco', 'bruxa da noite', 'hag'],
  elemental: ['elemental', 'gargula', 'genio', 'djinn', 'efreeti', 'marid', 'dao', 'mephit', 'fogo vivo', 'trovoada', 'tempestade'],
  aberration: ['aberracao', 'aberração', 'aboleth', 'observador', 'beholder', 'devorador de mentes', 'illithid', 'chuul', 'nothic', 'gibbering mouther', 'monstruosidade aberrante'],
  plant: ['planta', 'treant', 'arbusto', 'miceto', 'micelido', 'fungo', 'folhoso', 'cipo'],
  ooze: ['lodo', 'cubo gelatinoso', 'pudim negro', 'geleia ocre', 'lodo cinzento', 'gosma']
};

let activeBestiaryTypeChip = 'all';

function handleBestiarySearchInput(val) {
  const btnClear = document.getElementById('btn-clear-mon-search');
  if (btnClear) {
    btnClear.style.display = val && val.trim().length > 0 ? 'flex' : 'none';
  }
  renderBestiary();
}

function clearBestiarySearch() {
  const inp = document.getElementById('filter-mon-q');
  if (inp) inp.value = '';
  const btnClear = document.getElementById('btn-clear-mon-search');
  if (btnClear) btnClear.style.display = 'none';
  renderBestiary();
}

function setBestiaryTypeFilter(typeKey) {
  activeBestiaryTypeChip = typeKey;
  const selectEl = document.getElementById('filter-mon-type');
  if (selectEl) selectEl.value = typeKey;

  // Atualiza chips visuais
  const chipsContainer = document.getElementById('bestiary-type-chips');
  if (chipsContainer) {
    chipsContainer.querySelectorAll('.bestiary-filter-chip').forEach(btn => {
      const isThis = btn.getAttribute('onclick')?.includes(`'${typeKey}'`);
      if (isThis) btn.classList.add('active');
      else btn.classList.remove('active');
    });
  }

  renderBestiary();
}

function clearAllBestiaryFilters() {
  const inp = document.getElementById('filter-mon-q');
  if (inp) inp.value = '';
  const btnClear = document.getElementById('btn-clear-mon-search');
  if (btnClear) btnClear.style.display = 'none';

  const selType = document.getElementById('filter-mon-type');
  if (selType) selType.value = 'all';
  const selSrc = document.getElementById('filter-mon-src');
  if (selSrc) selSrc.value = 'all';
  const selCr = document.getElementById('filter-mon-cr');
  if (selCr) selCr.value = 'all';
  const selSort = document.getElementById('filter-mon-sort');
  if (selSort) selSort.value = 'relevance';

  activeBestiaryTypeChip = 'all';
  const chipsContainer = document.getElementById('bestiary-type-chips');
  if (chipsContainer) {
    chipsContainer.querySelectorAll('.bestiary-filter-chip').forEach(btn => {
      if (btn.getAttribute('onclick')?.includes("'all'")) btn.classList.add('active');
      else btn.classList.remove('active');
    });
  }

  renderBestiary();
}

function highlightSearchMatch(text, tokens) {
  if (!text || !tokens || tokens.length === 0) return text;
  let result = text;
  tokens.forEach(tok => {
    if (!tok || tok.length < 2) return;
    try {
      const regex = new RegExp(`(${tok})`, 'gi');
      result = result.replace(regex, '<mark class="mon-hl">$1</mark>');
    } catch(e) {}
  });
  return result;
}

function searchAndFilterMonsters(list, rawQ, srcFilter, crFilter, typeFilter, sortOrder) {
  if (!list) return [];
  const rawNorm = normalizeBestiarySearch(rawQ);

  // Mapeamento de sinônimos / termos em inglês para português
  let translatedNorm = rawNorm;
  if (rawNorm) {
    for (const item of BESTIARY_PHRASE_ALIASES) {
      if (translatedNorm.includes(item.en)) {
        translatedNorm = translatedNorm.replace(new RegExp(item.en, 'g'), item.pt);
      }
    }
  }

  const primaryTokens = rawNorm ? rawNorm.split(' ').filter(Boolean) : [];
  const translatedTokens = translatedNorm ? translatedNorm.split(' ').filter(Boolean) : [];

  const matched = [];

  list.forEach(m => {
    const normName = normalizeBestiarySearch(m.name);
    const normAtk = normalizeBestiarySearch(m.attack);
    const normSource = normalizeBestiarySearch(m.source);
    const fullText = `${normName} ${normAtk} ${normSource}`;

    // 1. Filtro de Texto (Nome / Ações)
    let score = 0;
    let activeTokens = primaryTokens;
    if (primaryTokens.length > 0) {
      const primaryMatch = primaryTokens.every(t => fullText.includes(t));
      const translatedMatch = translatedTokens.length > 0 && translatedTokens.every(t => fullText.includes(t));

      if (!primaryMatch && !translatedMatch) return;

      activeTokens = primaryMatch ? primaryTokens : translatedTokens;
      const activePhrase = primaryMatch ? rawNorm : translatedNorm;

      // Classificação de Relevância
      if (normName === activePhrase || normName === rawNorm) {
        score += 5000;
      } else if (normName.startsWith(activePhrase) || normName.startsWith(rawNorm)) {
        score += 2500;
      } else if (normName.includes(activePhrase) || normName.includes(rawNorm)) {
        score += 1200;
      }

      let nameMatches = 0;
      activeTokens.forEach(t => {
        if (normName.includes(t)) {
          score += 200;
          nameMatches++;
        } else if (normAtk.includes(t)) {
          score += 25;
        }
      });

      if (nameMatches === activeTokens.length) {
        score += 600;
      }
    }

    // 2. Filtro de Fonte (Livro)
    if (srcFilter && srcFilter !== 'all' && m.source !== srcFilter) {
      return;
    }

    // 3. Filtro de ND (Nível de Desafio)
    if (crFilter && crFilter !== 'all') {
      const numCr = parseMonsterCr(m.cr);
      if (crFilter === '6-10') {
        if (numCr < 6 || numCr > 10) return;
      } else if (crFilter === '11-15') {
        if (numCr < 11 || numCr > 15) return;
      } else if (crFilter === '16-20') {
        if (numCr < 16 || numCr > 20) return;
      } else if (crFilter === '21+') {
        if (numCr < 21) return;
      } else {
        const targetCr = parseMonsterCr(crFilter);
        if (numCr !== targetCr) return;
      }
    }

    // 4. Filtro de Tipo de Criatura
    if (typeFilter && typeFilter !== 'all') {
      const keywords = BESTIARY_TYPE_KEYWORDS[typeFilter] || [typeFilter];
      const matchesType = keywords.some(k => fullText.includes(normalizeBestiarySearch(k)));
      if (!matchesType) return;
      score += 50;
    }

    matched.push({ monster: m, score, activeTokens });
  });

  // 5. Ordenação dos Resultados
  matched.sort((a, b) => {
    if (sortOrder === 'name-asc') {
      return a.monster.name.localeCompare(b.monster.name, 'pt-BR');
    }
    if (sortOrder === 'name-desc') {
      return b.monster.name.localeCompare(a.monster.name, 'pt-BR');
    }
    if (sortOrder === 'cr-asc') {
      return parseMonsterCr(a.monster.cr) - parseMonsterCr(b.monster.cr);
    }
    if (sortOrder === 'cr-desc') {
      return parseMonsterCr(b.monster.cr) - parseMonsterCr(a.monster.cr);
    }
    if (sortOrder === 'hp-desc') {
      return (b.monster.hp || 0) - (a.monster.hp || 0);
    }
    // Padrão: Relevância (se houver busca ativa) ou ND/Alfabético
    if (rawNorm) {
      return b.score - a.score || a.monster.name.localeCompare(b.monster.name, 'pt-BR');
    }
    return a.monster.name.localeCompare(b.monster.name, 'pt-BR');
  });

  return matched;
}

function renderBestiary() {
  const grid = document.getElementById('grid-bestiary');
  const badge = document.getElementById('cnt-bestiary');
  const statsEl = document.getElementById('bestiary-meta-stats');
  const btnClear = document.getElementById('btn-clear-mon-search');

  const rawQ = document.getElementById('filter-mon-q')?.value || '';
  const src = document.getElementById('filter-mon-src')?.value || 'all';
  const cr = document.getElementById('filter-mon-cr')?.value || 'all';
  const typeFilter = document.getElementById('filter-mon-type')?.value || activeBestiaryTypeChip || 'all';
  const sortOrder = document.getElementById('filter-mon-sort')?.value || 'relevance';

  if (btnClear) {
    btnClear.style.display = rawQ.trim().length > 0 ? 'flex' : 'none';
  }

  if (typeof BESTIARY_DATA === 'undefined') return;

  const results = searchAndFilterMonsters(BESTIARY_DATA, rawQ, src, cr, typeFilter, sortOrder);

  if (badge) badge.innerText = results.length;
  if (statsEl) {
    const totalCount = BESTIARY_DATA.length;
    if (rawQ.trim() || src !== 'all' || cr !== 'all' || typeFilter !== 'all') {
      statsEl.innerHTML = `Mostrando <b>${results.length}</b> de <b>${totalCount}</b> criaturas encontradas`;
    } else {
      statsEl.innerHTML = `Catálogo completo com <b>${totalCount}</b> criaturas catalogadas (D&D 5E / MM 2024)`;
    }
  }

  if (!grid) return;

  if (results.length === 0) {
    grid.innerHTML = `
      <div class="bestiary-empty-state">
        <div style="font-size: 38px;">🐉🔍</div>
        <div style="font-size: 16px; font-weight: 800; color: #fff;">Nenhuma criatura encontrada</div>
        <p style="font-size: 12px; max-width: 420px; margin: 0; color: var(--text-muted);">
          Nenhum monstro corresponde aos termos e filtros selecionados. Tente simplificar a busca ou redefinir os filtros.
        </p>
        <button class="btn-action" style="padding: 8px 16px; font-size: 12px; margin-top: 4px;" onclick="clearAllBestiaryFilters()">
          🔄 Limpar Busca e Filtros
        </button>
      </div>
    `;
    return;
  }

  grid.innerHTML = results.map(({ monster: m, activeTokens }, idx) => {
    const renderedName = highlightSearchMatch(m.name, activeTokens);
    const renderedAtk = highlightSearchMatch(m.attack, activeTokens);

    return `
      <div class="item-card">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px;">
            <div>
              <div style="font-size: 15px; font-weight: 800; font-family: var(--font-title); color: #fff;">${renderedName}</div>
              <div style="font-size: 11px; color: var(--text-muted);">Livro: <span style="color: var(--primary);">${m.source}</span> • Deslocamento: ${m.speed}</div>
            </div>
            <span class="badge badge-cr">ND ${m.cr}</span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; background: #080c16; padding: 8px; border-radius: 6px; border: 1px solid var(--border-color); font-size: 12px; margin-bottom: 8px;">
            <div><span style="color: var(--text-dim);">Classe de Armadura:</span> <b style="color: #fff;">${m.ac}</b></div>
            <div><span style="color: var(--text-dim);">Pontos de Vida:</span> <b style="color: var(--accent-red);">${m.hp} PV</b></div>
          </div>

          <div style="font-size: 12px; color: #cbd5e1; line-height: 1.4; margin-bottom: 10px;">
            <b style="color: var(--primary-light);">Ações / Ataques:</b><br>${renderedAtk}
          </div>
        </div>

        <div style="display: flex; gap: 6px; align-items: center; margin-top: 8px; flex-wrap: wrap;">
          <div class="monster-qty-stepper" title="Quantidade de criaturas a adicionar">
            <span class="monster-qty-label">Qtd:</span>
            <button type="button" class="monster-qty-btn" onclick="const el=document.getElementById('qty-mon-${idx}'); if(el){ el.value=Math.max(1, (parseInt(el.value)||1)-1); }" title="Diminuir">-</button>
            <input type="number" id="qty-mon-${idx}" class="monster-qty-input" min="1" max="50" value="1">
            <button type="button" class="monster-qty-btn" onclick="const el=document.getElementById('qty-mon-${idx}'); if(el){ el.value=Math.min(50, (parseInt(el.value)||1)+1); }" title="Aumentar">+</button>
          </div>
          <button class="btn-action" style="flex: 1; justify-content: center; font-size: 11.5px; padding: 6px 10px; min-width: 95px;" onclick="addMonsterToCombat('${m.name.replace(/'/g, "\\'")}', ${m.ac}, ${m.hp}, '${m.attack.replace(/'/g, "\\'")}', 'qty-mon-${idx}')">
            ⚔️ Combate
          </button>
          <button class="btn-secondary" style="font-size: 11px; padding: 6px 9px; color: var(--primary-light); border-color: rgba(245, 158, 11, 0.4);" onclick="openQuickInitModal('${m.name.replace(/'/g, "\\'")}', ${m.ac}, ${m.hp}, '${m.attack.replace(/'/g, "\\'")}', '${m.cr}')" title="Iniciativa Relâmpago (DM4)">
            ⚡ Relâmpago
          </button>
          <button class="btn-secondary" style="font-size: 11px; padding: 6px 9px;" onclick="addMonsterToEncounterDraft('${m.name.replace(/'/g, "\\'")}', '${m.cr}', ${m.ac}, ${m.hp}, '${m.attack.replace(/'/g, "\\'")}')" title="Adicionar ao Balanceador de Encontros (DM1)">
            ⚖️ +Encontro
          </button>
        </div>
      </div>
    `;
  }).join('');
}

let activeQuickInitMonster = null;

function openQuickInitModal(name, ac, hp, actions, cr = '1') {
  activeQuickInitMonster = { name, ac, hp, actions, cr };
  const modal = document.getElementById('modal-quick-init');
  if (!modal) {
    addMonsterToCombat(name, ac, hp, actions);
    return;
  }

  const nameEl = document.getElementById('quick-init-monster-name');
  const metaEl = document.getElementById('quick-init-monster-meta');
  const qtyEl = document.getElementById('inp-quick-init-qty');
  const modEl = document.getElementById('inp-quick-init-mod');

  if (nameEl) nameEl.innerText = name;
  if (metaEl) metaEl.innerText = `ND ${cr} • CA ${ac} • ${hp} PV`;
  if (qtyEl) qtyEl.value = 1;
  if (modEl) modEl.value = 0;

  modal.classList.add('open');
}

function closeQuickInitModal() {
  const modal = document.getElementById('modal-quick-init');
  if (modal) modal.classList.remove('open');
  activeQuickInitMonster = null;
}

function submitQuickInit() {
  if (!activeQuickInitMonster) return;
  const qtyEl = document.getElementById('inp-quick-init-qty');
  const modEl = document.getElementById('inp-quick-init-mod');
  const qty = Math.max(1, parseInt(qtyEl ? qtyEl.value : 1) || 1);
  const mod = parseInt(modEl ? modEl.value : 0) || 0;

  const { name, ac, hp, actions } = activeQuickInitMonster;
  const existingCount = state.combatants.filter(x => x.name === name || x.name.startsWith(name + ' #')).length;

  for (let i = 1; i <= qty; i++) {
    const number = existingCount + i;
    const d20 = Math.floor(Math.random() * 20) + 1;
    const initRoll = d20 + mod;
    const monsterName = qty === 1 && existingCount === 0 ? name : `${name} #${number}`;

    state.combatants.push({
      id: 'c_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4) + '_' + i,
      name: monsterName,
      init: initRoll,
      ac,
      hp,
      maxHp: hp,
      type: 'monster',
      conditions: [],
      actions
    });
  }

  state.combatants.sort((a, b) => b.init - a.init);
  if (typeof addLog === 'function') {
    addLog(`⚡ <b>Iniciativa Relâmpago:</b> ${qty}x ${name} adicionado(s) com bônus de iniciativa ${mod >= 0 ? '+' + mod : mod}.`);
  }

  closeQuickInitModal();
  if (typeof renderCombat === 'function') renderCombat();
  if (typeof renderVTT === 'function') renderVTT();
  if (typeof renderPlayerView === 'function') renderPlayerView();
  saveToLocalStorage();
  if (typeof switchTab === 'function') switchTab('combat');
}

function addMonsterToCombat(name, ac, hp, actions, qtyInputId = null) {
  let count = 1;
  if (qtyInputId && document.getElementById(qtyInputId)) {
    const val = parseInt(document.getElementById(qtyInputId).value, 10);
    if (!isNaN(val) && val > 0) count = val;
  } else {
    const promptVal = prompt(`🐉 Quantas criaturas "${name}" deseja adicionar ao combate?`, "1");
    if (promptVal === null) return; // Cancelou
    const val = parseInt(promptVal, 10);
    if (!isNaN(val) && val > 0) count = val;
  }

  // Descobre numeração inicial para evitar nomes duplicados
  const existingCount = state.combatants.filter(x => x.name === name || x.name.startsWith(name + ' #')).length;

  for (let i = 1; i <= count; i++) {
    const number = existingCount + i;
    const initRoll = Math.floor(Math.random() * 20) + 1;
    const monsterName = count === 1 && existingCount === 0 ? name : `${name} #${number}`;

    state.combatants.push({
      id: 'c_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4) + '_' + i,
      name: monsterName,
      init: initRoll,
      ac,
      hp,
      maxHp: hp,
      type: 'monster',
      conditions: [],
      actions
    });
  }

  state.combatants.sort((a, b) => b.init - a.init);
  if (typeof addLog === 'function') {
    addLog(`🐉 <b>${count > 1 ? count + 'x ' : ''}${name}</b> ${count > 1 ? 'foram adicionados' : 'foi adicionado'} ao combate (Iniciativas roladas individualmente).`);
  }
  if (typeof renderCombat === 'function') renderCombat();
  if (typeof renderVTT === 'function') renderVTT();
  if (typeof renderPlayerView === 'function') renderPlayerView();
  saveToLocalStorage();
  switchTab('combat');
}

// --- EQUIPAMENTOS & ITENS ---
function renderEquipment() {
  const grid = document.getElementById('grid-equipment');
  const badge = document.getElementById('cnt-equip');
  const rawQ = document.getElementById('filter-eq-q')?.value || '';
  const q = typeof normalizeStr === 'function' ? normalizeStr(rawQ) : rawQ.toLowerCase().trim();
  const cat = document.getElementById('filter-eq-cat')?.value || 'all';

  if (typeof EQUIPMENT_DATA === 'undefined') return;

  const filtered = EQUIPMENT_DATA.filter(e => {
    if (q) {
      const eName = typeof normalizeStr === 'function' ? normalizeStr(e.name) : e.name.toLowerCase();
      const eProp = typeof normalizeStr === 'function' ? normalizeStr(e.prop) : e.prop.toLowerCase();
      if (!eName.includes(q) && !eProp.includes(q)) return false;
    }
    if (cat !== 'all' && e.category !== cat) return false;
    return true;
  });

  if (badge) badge.innerText = filtered.length;
  if (!grid) return;

  grid.innerHTML = filtered.map(e => {
    const safeName = (e.name || '').replace(/'/g, "\\'");
    const safeCat = (e.category || '').replace(/'/g, "\\'");
    const safeWeight = (e.weight || '1 lb').replace(/'/g, "\\'");
    const safeProp = (e.prop || '').replace(/'/g, "\\'");

    return `
    <div class="item-card">
      <div>
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px;">
          <div>
            <div style="font-size: 15px; font-weight: 800; font-family: var(--font-title); color: #fff;">${e.name}</div>
            <div style="font-size: 11px; color: var(--text-muted);">${e.category}</div>
          </div>
          <span class="badge badge-cls">${e.cost}</span>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; background: #080c16; padding: 6px 8px; border-radius: 6px; border: 1px solid var(--border-color); font-size: 11px; margin-bottom: 8px;">
          <div><span style="color: var(--text-dim);">Dano/CA:</span> <b style="color: #fff;">${e.damage}</b></div>
          <div><span style="color: var(--text-dim);">Peso:</span> <b style="color: #fff;">${e.weight}</b></div>
        </div>

        <div style="font-size: 12px; color: #cbd5e1; line-height: 1.4;">
          <b style="color: var(--primary-light);">Propriedades:</b> ${e.prop}
        </div>

        <div style="display: flex; gap: 6px; margin-top: 10px; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 8px;">
          <button class="btn-secondary" style="flex: 1; font-size: 10px; padding: 4px 6px; border-color: rgba(245,158,11,0.4); color: #fef08a;" onclick="promptAddEquipmentToPartyStash('${safeName}', '${safeCat}', '${safeProp}')" title="Adicionar ao Baú Coletivo do Grupo">🎒 + Baú</button>
          <button class="btn-action" style="flex: 1; font-size: 10px; padding: 4px 6px;" onclick="promptGiveEquipmentToPlayer('${safeName}', '${safeWeight}', '${safeProp}')" title="Dar diretamente para a mochila de um herói">👤 Dar a Herói</button>
        </div>
      </div>
    </div>
  `;
  }).join('');
}

function promptAddEquipmentToPartyStash(name, category, prop) {
  const qtyStr = prompt(`Quantas unidades de "${name}" deseja adicionar ao Baú do Grupo?`, '1');
  if (qtyStr === null) return;
  const qty = parseInt(qtyStr);
  if (isNaN(qty) || qty <= 0) return;

  if (typeof addItemToPartyStash === 'function') {
    addItemToPartyStash(name, qty, category, prop, 'Baú do Grupo');
    alert(`✅ ${qty}x "${name}" adicionado com sucesso ao Baú do Grupo!`);
  } else {
    alert('Função do baú não disponível.');
  }
}

function promptGiveEquipmentToPlayer(name, weightStr, prop) {
  if (typeof PLAYERS === 'undefined' || PLAYERS.length === 0) {
    alert('Nenhum herói cadastrado para receber o item.');
    return;
  }

  const heroList = PLAYERS.map((p, i) => `${i + 1}. ${p.name} (${p.student || 'Personagem'})`).join('\n');
  const choice = prompt(`Para qual herói deseja entregar "${name}"?\nDigite o número correspondente:\n\n${heroList}`, '1');
  if (!choice) return;
  const idx = parseInt(choice) - 1;
  if (idx < 0 || idx >= PLAYERS.length) {
    alert('Herói inválido selecionado.');
    return;
  }

  const targetPlayer = PLAYERS[idx];
  const qtyStr = prompt(`Quantas unidades de "${name}" deseja entregar para ${targetPlayer.name}?`, '1');
  if (qtyStr === null) return;
  const qty = parseInt(qtyStr);
  if (isNaN(qty) || qty <= 0) return;

  const parsedWeight = parseFloat(weightStr) || 0.5;

  targetPlayer.inventory = targetPlayer.inventory || [];
  const existing = targetPlayer.inventory.find(x => x.name.toLowerCase() === name.toLowerCase());
  if (existing) {
    existing.qty = (parseInt(existing.qty) || 0) + qty;
  } else {
    targetPlayer.inventory.push({
      name: name,
      qty: qty,
      equipped: false,
      weight: parsedWeight,
      desc: prop || ''
    });
  }

  if (typeof saveToLocalStorage === 'function') saveToLocalStorage();
  if (typeof renderPlayers === 'function') renderPlayers();
  if (typeof syncLocalChangesToFirebase === 'function') syncLocalChangesToFirebase();
  if (typeof addLog === 'function') addLog(`🎁 <b>Equipamento Entregue:</b> ${qty}x "${name}" entregue para a mochila de <b>${targetPlayer.name}</b>.`);
  alert(`✅ ${qty}x "${name}" entregue para ${targetPlayer.name}!`);
}

// --- GERADORES DE NPCS, TESOUROS E ENCONTROS ---
const NPC_NAMES = {
  Humano: {
    first: ["Alden", "Alistair", "Bray", "Corin", "Derek", "Elena", "Garrett", "Julian", "Kael", "Lydia", "Mara", "Nora", "Owen", "Roland", "Valerie", "Breno", "Catarina", "Erick", "Helena", "Vitor"],
    last: ["Ferreiro", "Carvalho", "Rios", "Bravo", "Cinzento", "da Colina", "Falcão", "Pedreira", "do Vale", "Lança-Viva", "Luz da Manhã", "Vento Forte"]
  },
  Anão: {
    first: ["Balin", "Barend", "Brokk", "Dain", "Durin", "Eberk", "Gardain", "Harbek", "Morgran", "Orsik", "Rurik", "Taklinn", "Thorin", "Vondal", "Hilda", "Gunnloda", "Torbera"],
    last: ["Barba de Prata", "Martelo de Pedra", "Forja-Escudo", "Machado-Rubro", "Quebra-Rocha", "Mina Profunda", "Bigorna Dourada", "Cervejeiro"]
  },
  Elfo: {
    first: ["Adran", "Aelar", "Aramil", "Arannis", "Berrian", "Carrie", "Enna", "Feyre", "Galaeron", "Ivellios", "Laucian", "Mindartis", "Paelias", "Silaqui", "Varis", "Lia", "Meriele"],
    last: ["Folha da Lua", "Brisa do Bosque", "Dança das Sombras", "Rio Claro", "Canto da Floresta", "Pétala Prateada", "Arco Esmeralda"]
  },
  Halfling: {
    first: ["Alton", "Ander", "Corby", "Eldon", "Finnan", "Garret", "Lindal", "Lyle", "Merric", "Milo", "Osborn", "Perrin", "Reed", "Roscoe", "Wellby", "Bree", "Callie", "Kithri"],
    last: ["Pé-Ligeiro", "Chá-Verde", "Colina Alta", "Toca-Rasa", "Bom-Corpo", "Tronco Alto", "Barriga Cheia", "Colhedor"]
  },
  Tiefling: {
    first: ["Akmenos", "Amnon", "Barakas", "Damakos", "Ekemon", "Iados", "Kairon", "Leucis", "Melech", "Mordai", "Morthos", "Pelaios", "Skamos", "Therai", "Kallista", "Orianna"],
    last: ["da Noite", "Chifre Quebrado", "Cinzas", "Labareda", "Pacto Sombrio", "Cicatriz Rubra", "Sem Medo"]
  },
  Draconato: {
    first: ["Arjhan", "Balasar", "Bharash", "Donaar", "Ghesh", "Heskan", "Kriv", "Medrash", "Mehen", "Nadarr", "Pandjed", "Patrin", "Rhogar", "Shamash", "Tarhun", "Torinn", "Akra", "Surina"],
    last: ["Escama Flamejante", "Asa de Bronze", "Garra de Ferro", "Presa de Ouro", "Sopro de Tempestade", "Coração Dracônico"]
  },
  "Meio-Orc": {
    first: ["Dench", "Feng", "Gell", "Henk", "Holg", "Imsh", "Keth", "Krusk", "Mhurren", "Ront", "Shump", "Thokk", "Baggi", "Emen", "Engong", "Myev", "Ovak"],
    last: ["Presa Quebrada", "Punho de Ferro", "Machado Sangrento", "Cicatriz de Guerra", "Uivo da Noite", "Quebra-Crânio"]
  }
};

const NPC_TRAITS = [
  "Extremamente hospitaleiro e oferece chá a todos.",
  "Desconfiado de aventureiros, acha que trazem confusão.",
  "Fala alto e gesticula muito enquanto explica as coisas.",
  "Muito curioso, pergunta sem parar sobre as armas dos alunos.",
  "Sempre calmo e paciente, quase nunca perde a postura.",
  "Orgulhoso de sua cidade e das lendas locais.",
  "Ganancioso, tenta negociar até o último centavo de cobre.",
  "Medroso e assusta-se com facilidade a qualquer ruído."
];

const NPC_VOICES = [
  "Voz rouca e profunda, fala devagar.",
  "Fala sussurrando como se estivesse contando segredos.",
  "Voz melódica e cantarolante.",
  "Sotaque do interior com risadas frequentes.",
  "Tom severo e direto ao ponto, sem rodeios.",
  "Sempre pigarreia antes de responder uma pergunta."
];

const NPC_GOALS = [
  "Juntar dinheiro para pagar uma dívida com a guilda local.",
  "Encontrar seu irmão mais novo que sumiu na floresta próxima.",
  "Proteger o vilarejo de ataques de monstros nas noites de lua cheia.",
  "Construir uma nova estalagem maior na praça central.",
  "Descobrir quem está roubando seus suprimentos à noite.",
  "Aprender um truque de magia para impressionar a corte."
];

const NPC_SECRETS = [
  "Guarda um mapa de um antigo túmulo sob as tábuas do chão de sua casa.",
  "É um ex-aventureiro aposentado que escondeu sua espada mágica no sótão.",
  "Passa informações secretas para o capitão da guarda em troca de proteção.",
  "Sabe a senha secreta para entrar no esconderijo dos contrabandistas.",
  "Viu um vulto encapuzado entrando na torre do mago à meia-noite passada.",
  "Tem uma poção rara de cura escondida para emergências extremas."
];

let lastGeneratedNPC = null;

function generateNPC() {
  let race = document.getElementById('gen-npc-race')?.value || 'any';
  let job = document.getElementById('gen-npc-job')?.value || 'any';

  const races = ["Humano", "Anão", "Elfo", "Halfling", "Tiefling", "Draconato", "Meio-Orc"];
  if (race === 'any') race = races[Math.floor(Math.random() * races.length)];

  const jobs = ["Taverneiro / Estalajadeiro", "Ferreiro de Armas", "Capitão da Guarda", "Herbalista & Alquimista", "Nobre & Magistrado", "Mercador Viajante", "Ladino de Beco", "Sacerdote do Templo", "Caçador da Floresta"];
  if (job === 'any') job = jobs[Math.floor(Math.random() * jobs.length)];

  const raceData = NPC_NAMES[race] || NPC_NAMES["Humano"];
  const firstName = raceData.first[Math.floor(Math.random() * raceData.first.length)];
  const lastName = raceData.last[Math.floor(Math.random() * raceData.last.length)];
  const fullName = `${firstName} ${lastName}`;

  const trait = NPC_TRAITS[Math.floor(Math.random() * NPC_TRAITS.length)];
  const voice = NPC_VOICES[Math.floor(Math.random() * NPC_VOICES.length)];
  const goal = NPC_GOALS[Math.floor(Math.random() * NPC_GOALS.length)];
  const secret = NPC_SECRETS[Math.floor(Math.random() * NPC_SECRETS.length)];

  lastGeneratedNPC = { name: fullName, race, job, trait, voice, goal, secret };

  const resDisplay = document.getElementById('npc-result-display');
  if (resDisplay) resDisplay.style.display = 'flex';
  document.getElementById('npc-res-name').innerText = fullName;
  document.getElementById('npc-res-meta').innerText = `${race} • ${job}`;
  document.getElementById('npc-res-trait').innerText = trait;
  document.getElementById('npc-res-voice').innerText = voice;
  document.getElementById('npc-res-goal').innerText = goal;
  document.getElementById('npc-res-secret').innerText = secret;

  if (typeof playFX === 'function') playFX('spell');
}

function copyNPCToClipboard() {
  if (!lastGeneratedNPC) return;
  const text = `📌 NPC: ${lastGeneratedNPC.name} (${lastGeneratedNPC.race} - ${lastGeneratedNPC.job})\n` +
               `🎭 Traço: ${lastGeneratedNPC.trait}\n` +
               `🗣️ Voz: ${lastGeneratedNPC.voice}\n` +
               `🎯 Objetivo: ${lastGeneratedNPC.goal}\n` +
               `🤫 Segredo: ${lastGeneratedNPC.secret}`;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      alert(`✅ Dados de "${lastGeneratedNPC.name}" copiados para a área de transferência!`);
    });
  } else {
    prompt('Copie os dados do NPC abaixo:', text);
  }
}

function addNPCToCombat() {
  if (!lastGeneratedNPC) {
    alert('Gere um NPC primeiro!');
    return;
  }
  const initRoll = Math.floor(Math.random() * 20) + 1;
  state.combatants.push({
    id: 'c_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
    name: `${lastGeneratedNPC.name} (${lastGeneratedNPC.job})`,
    init: initRoll,
    ac: 13,
    hp: 18,
    maxHp: 18,
    type: 'monster',
    conditions: [],
    actions: `Ataque improvisado (+3, 1d6+1 dano físico) • Traço: ${lastGeneratedNPC.trait}`
  });
  state.combatants.sort((a, b) => b.init - a.init);
  if (typeof addLog === 'function') {
    addLog(`👤 <b>${lastGeneratedNPC.name}</b> (${lastGeneratedNPC.job}) entrou no combate como NPC/Aliado.`);
  }
  if (typeof playFX === 'function') playFX('sword');
  if (typeof renderCombat === 'function') renderCombat();
  if (typeof renderVTT === 'function') renderVTT();
  if (typeof renderPlayerView === 'function') renderPlayerView();
  saveToLocalStorage();
  switchTab('combat');
}

let lastRolledLoot = { cp: 0, sp: 0, gp: 0, pp: 0 };

function generateLoot() {
  const type = document.getElementById('gen-loot-type')?.value || 'hoard';
  const cr = document.getElementById('gen-loot-cr')?.value || '0-4';

  const rollDice = (count, sides) => {
    let tot = 0;
    for (let i = 0; i < count; i++) tot += Math.floor(Math.random() * sides) + 1;
    return tot;
  };

  let cp = 0, sp = 0, gp = 0, pp = 0;
  let gemsText = 'Nenhuma gema.';
  let itemsText = 'Nenhum item mágico.';

  if (cr === '0-4') {
    if (type === 'individual') {
      cp = rollDice(3, 6) * 10;
      sp = rollDice(2, 6) * 5;
      gp = rollDice(1, 6) * 2;
    } else {
      cp = rollDice(6, 6) * 100;
      sp = rollDice(3, 6) * 100;
      gp = rollDice(2, 6) * 10;
      const gemsCount = rollDice(1, 4);
      gemsText = `${gemsCount}x Gemas de 10 PO (Azulita, Olho de Tigre, Quartzo Rosa)`;
      itemsText = "1x Poção de Cura Comum (2d4+2 PV), 1x Pergaminho de Magia (1º Círculo)";
    }
  } else if (cr === '5-10') {
    if (type === 'individual') {
      sp = rollDice(4, 6) * 100;
      gp = rollDice(2, 6) * 10;
      pp = rollDice(1, 6);
    } else {
      sp = rollDice(2, 6) * 100;
      gp = rollDice(2, 6) * 1000;
      pp = rollDice(3, 6) * 10;
      const gemsCount = rollDice(2, 4);
      gemsText = `${gemsCount}x Gemas de 50 PO (Jaspe, Ônix, Granada, Pedra da Lua)`;
      itemsText = "1x Poção de Cura Maior (4d4+4 PV), 1x Bolsa Guardatudo (Bag of Holding)";
    }
  } else if (cr === '11-16') {
    gp = rollDice(4, 6) * 1000;
    pp = rollDice(5, 6) * 100;
    gemsText = "3d6 Gemas de 500 PO (Pérola Negra, Rubi Pequeno, Safira)";
    itemsText = "1x Poção de Cura Superior (8d4+8 PV), 1x Arma +2 / Varinha das Maravilhas";
  } else {
    gp = rollDice(12, 6) * 1000;
    pp = rollDice(8, 6) * 1000;
    gemsText = "5d6 Gemas de 1.000 PO (Diamante Bruto, Esmeralda Radiante)";
    itemsText = "1x Espada Vorpal Lendária, 1x Manual de Saúde Corporal";
  }

  lastRolledLoot = { cp, sp, gp, pp };

  const resBox = document.getElementById('loot-result-display');
  if (resBox) resBox.style.display = 'flex';
  document.getElementById('loot-res-cp').innerText = cp;
  document.getElementById('loot-res-sp').innerText = sp;
  document.getElementById('loot-res-gp').innerText = gp;
  document.getElementById('loot-res-pp').innerText = pp;
  document.getElementById('loot-res-gems').innerText = gemsText;
  document.getElementById('loot-res-items').innerText = itemsText;

  if (typeof playFX === 'function') playFX('crit');
  if (typeof addLog === 'function') addLog(`💰 <b>Tesouro Rolado:</b> ${gp} PO, ${sp} PP, ${cp} PC, ${pp} PL (${gemsText})`);
}

function distributeLootGoldToParty() {
  if (!lastRolledLoot || lastRolledLoot.gp === 0) {
    alert('Nenhum ouro rolado para dividir.');
    return;
  }
  if (PLAYERS.length === 0) return;

  const totalGold = lastRolledLoot.gp;
  const perPlayer = Math.floor(totalGold / PLAYERS.length);
  const remainder = totalGold % PLAYERS.length;

  PLAYERS.forEach(p => {
    p.gold = (p.gold || 0) + perPlayer;
  });

  if (typeof playFX === 'function') playFX('crit');
  if (typeof addLog === 'function') addLog(`🪙 <b>${totalGold} PO</b> divididos entre os ${PLAYERS.length} alunos (+${perPlayer} PO para cada um${remainder > 0 ? `, sobrou ${remainder} PO no baú do grupo` : ''}).`);
  renderPlayers();
  saveToLocalStorage();
  alert(`✅ Cada um dos ${PLAYERS.length} alunos recebeu +${perPlayer} Peças de Ouro!`);
}

const ENCOUNTER_TABLES = {
  floresta: [
    { name: "Emboscada dos Goblins da Mata", desc: "1 Goblin Líder e 3 Goblins Arqueiros escondidos nas copas das árvores.", monsters: [{ name: "Goblin Líder", ac: 15, hp: 14, actions: "Cimitarra (+4, 1d6+2)" }, { name: "Goblin Arqueiro A", ac: 13, hp: 7, actions: "Arco Curto (+4, 1d6+2)" }, { name: "Goblin Arqueiro B", ac: 13, hp: 7, actions: "Arco Curto (+4, 1d6+2)" }] },
    { name: "Alcateia de Lobos da Noite", desc: "2 Lobos Famintos cercando o grupo em tática de matilha.", monsters: [{ name: "Lobo Alfa", ac: 13, hp: 18, actions: "Mordida (+4, 2d4+2 e derruba)" }, { name: "Lobo da Floresta", ac: 13, hp: 11, actions: "Mordida (+4, 2d4+2)" }] },
    { name: "Aranhas Gigantes Tecelãs", desc: "2 Aranhas Gigantes descendo por teias pegajosas.", monsters: [{ name: "Aranha Gigante A", ac: 14, hp: 26, actions: "Mordida (+5, 1d8+3 + 2d8 veneno)" }, { name: "Aranha Gigante B", ac: 14, hp: 26, actions: "Mordida (+5, 1d8+3 + 2d8 veneno)" }] }
  ],
  masmorra: [
    { name: "Sentinelas Esqueléticos", desc: "3 Esqueletos antigos empunhando arcos e espadas enferrujadas.", monsters: [{ name: "Esqueleto Guerreiro A", ac: 13, hp: 13, actions: "Espada Curta (+4, 1d6+2)" }, { name: "Esqueleto Arqueiro", ac: 13, hp: 13, actions: "Arco Curto (+4, 1d6+2)" }, { name: "Esqueleto Guerreiro B", ac: 13, hp: 13, actions: "Espada Curta (+4, 1d6+2)" }] },
    { name: "Zumbis Rastejantes da Cripta", desc: "2 Zumbis lentos com Fortitude de Morto-Vivo.", monsters: [{ name: "Zumbi da Cripta A", ac: 8, hp: 22, actions: "Pancada (+3, 1d6+1)" }, { name: "Zumbi da Cripta B", ac: 8, hp: 22, actions: "Pancada (+3, 1d6+1)" }] },
    { name: "Cubo Gelatinoso Voraz", desc: "Um cubo transparente bloqueando o corredor da masmorra.", monsters: [{ name: "Cubo Gelatinoso", ac: 6, hp: 84, actions: "Engolfar (CD 12 DES, 3d6 ácido)" }] }
  ],
  estrada: [
    { name: "Salteadores de Estrada (Bandidos)", desc: "1 Capitão Bandido e 2 Bandidos exigindo pedágio.", monsters: [{ name: "Capitão Bandido", ac: 15, hp: 25, actions: "Cimitarra (+5, 1d6+3)" }, { name: "Bandido A", ac: 12, hp: 11, actions: "Besta Leve (+3, 1d8+1)" }, { name: "Bandido B", ac: 12, hp: 11, actions: "Cimitarra (+3, 1d6+1)" }] },
    { name: "Bando de Orcs Saqueadores", desc: "2 Orcs furiosos com machados de guerra.", monsters: [{ name: "Orc Furioso A", ac: 13, hp: 15, actions: "Machado Grande (+5, 1d12+3)" }, { name: "Orc Furioso B", ac: 13, hp: 15, actions: "Machado Grande (+5, 1d12+3)" }] }
  ],
  pantano: [
    { name: "Homens-Lagarto Caçadores", desc: "2 Homens-Lagarto armados com clavas de espinhos e escudos de escamas.", monsters: [{ name: "Homem-Lagarto Guarda", ac: 15, hp: 22, actions: "Clava (+4, 1d6+2)" }, { name: "Homem-Lagarto Caçador", ac: 13, hp: 16, actions: "Azagaia (+4, 1d6+2)" }] },
    { name: "Ghoul Necrófago do Lodo", desc: "2 Ghouls paralisantes espreitando sob as águas escuras.", monsters: [{ name: "Ghoul A", ac: 12, hp: 22, actions: "Garras (+4, 2d4+2 paralisante CD 10)" }, { name: "Ghoul B", ac: 12, hp: 22, actions: "Garras (+4, 2d4+2 paralisante CD 10)" }] }
  ],
  cidade: [
    { name: "Espiões da Guilda das Sombras", desc: "2 Ladinos ágeis atacando pelos telhados.", monsters: [{ name: "Espião das Sombras A", ac: 13, hp: 18, actions: "Espada Curta (+4, 1d6+2 + 2d6 furtivo)" }, { name: "Espião das Sombras B", ac: 13, hp: 18, actions: "Besta de Mão (+4, 1d6+2)" }] }
  ]
};

let lastGeneratedEncounter = null;

function generateRandomEncounter() {
  const biome = document.getElementById('gen-enc-biome')?.value || 'floresta';
  const diff = document.getElementById('gen-enc-diff')?.value || 'medio';
  
  const pool = ENCOUNTER_TABLES[biome] || ENCOUNTER_TABLES.floresta;
  const enc = pool[Math.floor(Math.random() * pool.length)];

  lastGeneratedEncounter = enc;

  const resDisplay = document.getElementById('enc-result-display');
  if (resDisplay) resDisplay.style.display = 'block';
  document.getElementById('enc-res-title').innerText = enc.name;
  document.getElementById('enc-res-meta').innerText = `Bioma: ${biome.toUpperCase()} • Dificuldade: ${diff.toUpperCase()} • ${enc.monsters.length} Criaturas`;
  document.getElementById('enc-res-desc').innerHTML = `<b>Descrição:</b> ${enc.desc}<br><br><b>Inimigos Gerados:</b> ` + enc.monsters.map(m => `🔹 ${m.name} (CA ${m.ac}, ${m.hp} PV)`).join(' | ');

  if (typeof playFX === 'function') playFX('battle');
  if (typeof addLog === 'function') addLog(`🌲 Encontro Gerado: <b>${enc.name}</b> (${enc.monsters.length} criaturas).`);
}

function sendEncounterToCombat() {
  if (!lastGeneratedEncounter || !lastGeneratedEncounter.monsters) {
    alert('Gere um encontro primeiro!');
    return;
  }

  lastGeneratedEncounter.monsters.forEach(m => {
    const initRoll = Math.floor(Math.random() * 20) + 1;
    state.combatants.push({
      id: 'c_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      name: m.name,
      init: initRoll,
      ac: m.ac,
      hp: m.hp,
      maxHp: m.hp,
      type: 'monster',
      conditions: [],
      actions: m.actions
    });
  });

  state.combatants.sort((a, b) => b.init - a.init);
  if (typeof addLog === 'function') addLog(`⚔️ Encontro <b>${lastGeneratedEncounter.name}</b> foi adicionado ao Combate!`);
  switchTab('combat');
  if (typeof renderCombat === 'function') renderCombat();
}

// --- M9: DICIONÁRIO DE REGRAS OFICIAIS DE CONDIÇÕES (D&D 5E) ---
const CONDITIONS_RULES_DATA = {
  agarrado: {
    name: "Agarrado (Grappled)",
    icon: "🤼",
    desc: "• O deslocamento da criatura agarrada se torna 0 e ela não pode se beneficiar de qualquer bônus em sua velocidade.\n• A condição se encerra se o agarrador ficar Incapacitado.\n• A condição também se encerra se um efeito remover a criatura do alcance do agarrador (como a magia Onda Trovejante)."
  },
  amaldiçoado: {
    name: "Amaldiçoado (Cursed)",
    icon: "🔮",
    desc: "• Sob efeito de magia ou malefício mágico contínuo.\n• Requer a magia Remover Maldição ou descanso sagrado para purificação."
  },
  aterrorizado: {
    name: "Aterrorizado (Frightened)",
    icon: "😱",
    desc: "• A criatura tem Desvantagem em testes de atributo e jogadas de ataque enquanto a fonte do seu medo estiver em sua linha de visão.\n• A criatura não pode se mover voluntariamente para uma posição mais próxima da fonte do seu medo."
  },
  atordoado: {
    name: "Atordoado (Stunned)",
    icon: "💫",
    desc: "• A criatura está Incapacitada, não pode se mover e fala apenas balbucios.\n• A criatura falha automaticamente em salvaguardas de Força e Destreza.\n• Jogadas de ataque contra a criatura têm Vantagem."
  },
  caído: {
    name: "Caído / Prostrado (Prone)",
    icon: "🛌",
    desc: "• A única opção de movimento da criatura é rastejar (custa o dobro de deslocamento), a menos que gaste metade do seu deslocamento para se levantar.\n• A criatura tem Desvantagem em jogadas de ataque.\n• Jogadas de ataque contra ela têm Vantagem se o atacante estiver a até 1,5m. Caso contrário, o ataque tem Desvantagem."
  },
  cego: {
    name: "Cego (Blinded)",
    icon: "👁️",
    desc: "• A criatura não pode ver e falha automaticamente em qualquer teste de atributo que requira visão.\n• Jogadas de ataque contra a criatura têm Vantagem.\n• As jogadas de ataque da criatura têm Desvantagem."
  },
  concentracao: {
    name: "Concentração (Concentrating)",
    icon: "🧠",
    desc: "• Mantendo o fluxo de uma magia ativa.\n• Sofrer dano exige um teste de resistência de Constituição (CD 10 ou metade do dano sofrido, o que for maior).\n• Ficar Incapacitado ou conjurar outra magia que exija concentração encerra o efeito."
  },
  contido: {
    name: "Contido (Restrained)",
    icon: "🕸️",
    desc: "• O deslocamento da criatura se torna 0 e ela não pode se beneficiar de nenhum bônus de velocidade.\n• Jogadas de ataque contra ela têm Vantagem, e seus próprios ataques têm Desvantagem.\n• A criatura tem Desvantagem em salvaguardas de Destreza."
  },
  enfeitiçado: {
    name: "Enfeitiçado (Charmed)",
    icon: "💖",
    desc: "• Uma criatura enfeitiçada não pode atacar o enfeitiçador nem alvejá-lo com habilidades ou efeitos nocivos.\n• O enfeitiçador tem Vantagem em qualquer teste de interação social para influenciar a criatura."
  },
  ensurdecido: {
    name: "Ensurdecido (Deafened)",
    icon: "👂",
    desc: "• A criatura não pode ouvir e falha automaticamente em qualquer teste de atributo que requira audição."
  },
  envenenado: {
    name: "Envenenado (Poisoned)",
    icon: "🧪",
    desc: "• A criatura tem Desvantagem em jogadas de ataque e testes de atributo."
  },
  incapacitado: {
    name: "Incapacitado (Incapacitated)",
    icon: "😵",
    desc: "• Uma criatura incapacitada não pode realizar Ações nem Reações."
  },
  inconsciente: {
    name: "Inconsciente (Unconscious)",
    icon: "💤",
    desc: "• A criatura está Incapacitada, não pode se mover nem falar e não tem consciência dos arredores.\n• A criatura larga tudo o que estiver segurando e cai prostrada.\n• Falha automaticamente em salvaguardas de Força e Destreza.\n• Ataques contra ela têm Vantagem, e qualquer ataque a até 1,5m que acerte é um Acerto Crítico automático."
  },
  invisível: {
    name: "Invisível (Invisible)",
    icon: "👻",
    desc: "• A criatura é impossível de ser vista sem a ajuda de magia ou sentido especial.\n• Ataques contra a criatura têm Desvantagem, e os ataques da criatura têm Vantagem."
  },
  paralisado: {
    name: "Paralisado (Paralyzed)",
    icon: "⚡",
    desc: "• A criatura está Incapacitada e não pode se mover ou falar.\n• Falha automaticamente em salvaguardas de Força e Destreza.\n• Ataques contra a criatura têm Vantagem, e qualquer ataque a até 1,5m que acerte é um Acerto Crítico automático."
  },
  petrificado: {
    name: "Petrificado (Petrified)",
    icon: "🗿",
    desc: "• A criatura é transformada em pedra sólida. Seu peso é multiplicado por 10 e ela para de envelhecer.\n• Está Incapacitada, não pode se mover nem falar e não tem consciência dos arredores.\n• Ataques contra ela têm Vantagem; tem resistência a todos os danos e imunidade a veneno e doenças."
  },
  sangrando: {
    name: "Sangrando / Grave (Bleeding)",
    icon: "🩸",
    desc: "• A criatura está com menos de metade dos seus Pontos de Vida Máximos (Sangrando) ou sofrendo dano contínuo por rodada."
  }
};

function showConditionRuleModal(condKey) {
  const normKey = (condKey || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  let rule = CONDITIONS_RULES_DATA[normKey];
  if (!rule) {
    // Procura por correspondência parcial
    const match = Object.keys(CONDITIONS_RULES_DATA).find(k => normKey.includes(k) || k.includes(normKey));
    if (match) rule = CONDITIONS_RULES_DATA[match];
  }

  if (!rule) {
    alert(`Regra para a condição '${condKey}' não encontrada.`);
    return;
  }

  const modal = document.getElementById('modal-condition-rule');
  if (modal) {
    document.getElementById('cond-rule-title').innerText = `${rule.icon} ${rule.name}`;
    document.getElementById('cond-rule-desc').innerText = rule.desc;
    modal.style.display = 'flex';
    if (typeof playFX === 'function') playFX('dice');
  } else {
    alert(`${rule.icon} ${rule.name}\n\n${rule.desc}`);
  }
}

function closeConditionRuleModal() {
  const modal = document.getElementById('modal-condition-rule');
  if (modal) modal.style.display = 'none';
}

// --- DM6: GERADOR DE GANCHOS DE AVENTURA & MISSÕES ---
const ADVENTURE_HOOKS_DATA = {
  patrons: [
    "Um nobre caído buscando restaurar a honra e o brasão da sua família",
    "Um mago eremita excêntrico cujos experimentos arcanos fugiram do controle",
    "Um capitão da guarda sob chantagem de uma temível guilda de assassinos",
    "Um clérigo idoso devoto atormentado por visões premonitórias de um culto profano",
    "O espírito inquieto de um antigo paladino que não consegue descansar em paz",
    "Um mestre cervejeiro da taverna cuja receita secreta e ingredientes raros foram roubados",
    "Um caçador de monstros veterano ferido em busca de pupilos para vingança",
    "Uma criança órfã que afirma ter encontrado uma chave brilhante que fala sussurros"
  ],
  locations: [
    "Nas profundezas labirínticas de uma mina de prata abandonada e infestada",
    "Em uma cripta submersa e esquecida abaixo das águas do lago negro",
    "Nas ruínas colossais de uma torre arcana suspensa em um penhasco escarpado",
    "Em uma taverna isolada na encruzilhada durante uma nevasca devastadora",
    "No coração sombrio de uma floresta petrificada onde o som não ecoa",
    "Nos esgotos úmidos e esquecidos sob a grande basílica da capital",
    "Em um templo esquecido dedicado a um deus serpente ancestral",
    "Em um forte militar de fronteira recém-tomado por invasores cruéis"
  ],
  objectives: [
    "Recuperar uma relíquia sagrada milenar antes do próximo eclipse solar",
    "Resgatar aldeões e viajantes capturados para um rito de sacrifício macabro",
    "Eliminar a criatura alfa bestial que lidera ataques noturnos à região",
    "Descobrir quem envenenou o suprimento de água e poços da vila",
    "Decifrar e reforçar o selo rúnico que mantém um portal abissal fechado",
    "Escoltar com segurança uma caravana de refugiados através de um desfiladeiro perigoso",
    "Roubar um tomo proibido de necromancia do cofre de um tirano",
    "Investigar o desaparecimento misterioso de uma patrulha inteira de batedores"
  ],
  twists: [
    "O patrono que contratou o grupo é na verdade o verdadeiro mentor do crime disfarçado!",
    "A criatura que todos temem está apenas tentando proteger filhotes indefesos.",
    "O local está sob uma anomalia temporal mágica (1 hora lá dentro = 1 dia do lado de fora).",
    "Um grupo rival de mercenários foi contratado para o mesmo objetivo com ordens letais.",
    "A relíquia procurada é um artefato consciente e teimoso que tenta manipular a mente de quem a segura.",
    "As autoridades locais foram subornadas e tentarão emboscar os heróis no retorno.",
    "O covil está instável e começará a desabar 3 rodadas após o chefe ser confrontado.",
    "A missão toda é um teste de admissão planejado por uma ordem secreta benevolente."
  ]
};

let lastGeneratedHook = null;

function generateAdventureHook() {
  const patron = ADVENTURE_HOOKS_DATA.patrons[Math.floor(Math.random() * ADVENTURE_HOOKS_DATA.patrons.length)];
  const location = ADVENTURE_HOOKS_DATA.locations[Math.floor(Math.random() * ADVENTURE_HOOKS_DATA.locations.length)];
  const objective = ADVENTURE_HOOKS_DATA.objectives[Math.floor(Math.random() * ADVENTURE_HOOKS_DATA.objectives.length)];
  const twist = ADVENTURE_HOOKS_DATA.twists[Math.floor(Math.random() * ADVENTURE_HOOKS_DATA.twists.length)];
  
  const goldReward = (Math.floor(Math.random() * 6) + 2) * 50;
  const xpReward = (Math.floor(Math.random() * 5) + 3) * 100;

  lastGeneratedHook = {
    title: `Missão: ${objective.substring(0, 45)}...`,
    patron,
    location,
    objective,
    twist,
    reward: `${goldReward} PO + ${xpReward} XP por personagem`
  };

  const display = document.getElementById('hook-result-display');
  if (display) display.style.display = 'block';

  document.getElementById('hook-res-title').innerText = lastGeneratedHook.title;
  document.getElementById('hook-res-patron').innerText = patron;
  document.getElementById('hook-res-location').innerText = location;
  document.getElementById('hook-res-objective').innerText = objective;
  document.getElementById('hook-res-twist').innerText = twist;
  document.getElementById('hook-res-reward').innerText = lastGeneratedHook.reward;

  if (typeof playFX === 'function') playFX('crit');
  if (typeof addLog === 'function') addLog(`📜 <b>Gancho de Missão Gerado:</b> ${lastGeneratedHook.title}`);
}

function copyAdventureHook() {
  if (!lastGeneratedHook) return;
  const text = `📜 ${lastGeneratedHook.title}\n👤 Patrono: ${lastGeneratedHook.patron}\n🗺️ Local: ${lastGeneratedHook.location}\n🎯 Objetivo: ${lastGeneratedHook.objective}\n⚡ Reviravolta: ${lastGeneratedHook.twist}\n💰 Recompensa: ${lastGeneratedHook.reward}`;
  navigator.clipboard.writeText(text).then(() => {
    alert('✅ Gancho de Aventura copiado para a Área de Transferência!');
  }).catch(() => {
    prompt('Copie o texto da missão:', text);
  });
}

function addHookToCampaignJournal() {
  if (!lastGeneratedHook) return;
  if (typeof activeCampaign === 'undefined' || !activeCampaign) {
    alert('Nenhuma campanha ativa no momento.');
    return;
  }
  const sessionEntry = {
    id: 'entry_' + Date.now(),
    date: new Date().toLocaleDateString('pt-BR'),
    title: lastGeneratedHook.title,
    summary: `Missão concedida por: ${lastGeneratedHook.patron}.\nLocal: ${lastGeneratedHook.location}.\nObjetivo: ${lastGeneratedHook.objective}.\nReviravolta Oculta: ${lastGeneratedHook.twist}.\nRecompensa Prometida: ${lastGeneratedHook.reward}.`,
    xpAwarded: 0,
    npcsMet: [lastGeneratedHook.patron.split(' ')[1] || 'Patrono']
  };
  if (!activeCampaign.sessions) activeCampaign.sessions = [];
  activeCampaign.sessions.unshift(sessionEntry);
  if (typeof saveCampaignsToLocalStorage === 'function') saveCampaignsToLocalStorage();
  if (typeof renderCampaigns === 'function') renderCampaigns();
  if (typeof playFX === 'function') playFX('spell');
  alert('✅ Missão registrada automaticamente no Diário de Sessões da Campanha Ativa!');
}

// --- DM6: TABELA & GERADOR DE CLIMA E EVENTOS DE VIAGEM ---
const WEATHER_EVENTS_DATA = [
  { name: "☀️ Céu Limpo & Brisa Suave", effect: "Condições ideais de viagem. Nenhum modificador ou penalidade.", icon: "☀️", vttWeather: "none" },
  { name: "🌧️ Chuva Torrencial & Enxurrada", effect: "Terreno Difícil (deslocamento reduzido à metade em terra). Desvantagem em testes de Percepção (Sabedoria) auditivos e visuais além de 18m.", icon: "🌧️", vttWeather: "rain" },
  { name: "🌫️ Névoa Espessa Sobrenatural", effect: "Área Fortemente Obscurecida além de 9 metros. Criaturas tratam o ambiente como Condição Cego fora dessa distância.", icon: "🌫️", vttWeather: "fog" },
  { name: "❄️ Nevasca Gélida & Vento Cortante", effect: "Frio Extremo (Salvaguarda de CON CD 10 a cada hora de viagem ou ganha 1 nível de Exaustão sem agasalhos pesados). Chamas não-mágicas se apagam.", icon: "❄️", vttWeather: "fog" },
  { name: "🔥 Calor Escaldante & Seca", effect: "Calor Extremo (Consumo dobrado de água. Salvaguarda de CON CD 10 a cada 2h com desvantagem se vestir Armadura Média/Pesada contra Exaustão).", icon: "🔥", vttWeather: "embers" },
  { name: "⚡ Tempestade de Raios Arcana", effect: "No início de cada rodada de combate ao ar livre, 10% de chance de queda de raio (2d10 dano elétrico, salvaguarda de DES CD 13 para metade).", icon: "⚡", vttWeather: "rain" }
];

let lastGeneratedWeather = null;

function generateWeatherEvent() {
  const w = WEATHER_EVENTS_DATA[Math.floor(Math.random() * WEATHER_EVENTS_DATA.length)];
  lastGeneratedWeather = w;

  const display = document.getElementById('weather-result-display');
  if (display) display.style.display = 'block';

  document.getElementById('weather-res-name').innerText = `${w.icon} ${w.name}`;
  document.getElementById('weather-res-effect').innerText = w.effect;

  if (typeof playFX === 'function') playFX('dice');
  if (typeof addLog === 'function') addLog(`🌦️ <b>Clima Rolado:</b> ${w.name} ➔ <i>${w.effect}</i>`);
}

function applyWeatherToGrid() {
  if (!lastGeneratedWeather) return;
  if (typeof setWeatherEffect === 'function' && lastGeneratedWeather.vttWeather) {
    setWeatherEffect(lastGeneratedWeather.vttWeather);
    const sel = document.getElementById('sel-weather-effect');
    if (sel) sel.value = lastGeneratedWeather.vttWeather;
  }
  if (typeof playFX === 'function') playFX('spell');
  alert(`✅ Clima "${lastGeneratedWeather.name}" aplicado ao Grid de Batalha e sincronizado no Telão!`);
}

