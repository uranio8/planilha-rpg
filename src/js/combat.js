// src_js_combat.js - Initiative, combat rounds, attacks, damage dispatcher and dice rolling

function renderCombat() {
  const list = document.getElementById('list-combatants');
  const selAtt = document.getElementById('sel-attacker');
  const selTar = document.getElementById('sel-target');
  const cntLbl = document.getElementById('lbl-comb-count');
  const roundLbl = document.getElementById('lbl-round');
  const activeDetails = document.getElementById('active-details');
  const activeTypeBadge = document.getElementById('lbl-active-type');

  if (roundLbl) roundLbl.innerText = state.round;
  if (cntLbl) cntLbl.innerText = `${state.combatants.length} ativos`;

  // Preenche selects do despachante
  const options = state.combatants.map((c, i) => `<option value="${c.id}">${c.name} (${c.hp}/${c.maxHp} PV)</option>`).join('');
  if (selAtt) selAtt.innerHTML = options;
  if (selTar) selTar.innerHTML = options;

  if (state.combatants.length > 0 && selAtt && selAtt.options && selAtt.options.length > 0) {
    const active = state.combatants[state.turnIndex];
    if (active) selAtt.value = active.id;
    if (selTar && selTar.options && selTar.options.length > 0) {
      if (selTar.options.length === 1) {
        selTar.selectedIndex = 0;
      } else {
        selTar.selectedIndex = (state.turnIndex + 1) % state.combatants.length;
      }
    }
  }

  // Render lista de combatentes
  if (!list) return;
  if (state.combatants.length === 0) {
    list.innerHTML = `<div style="color: var(--text-dim); text-align: center; padding: 24px; font-size: 12px;">Nenhum combatente na mesa.<br>Clique em "Novo Combatente" ou adicione do Bestiário / Fichas.</div>`;
    if (activeDetails) activeDetails.innerHTML = `<div style="color: var(--text-dim); text-align: center; padding: 20px;">Nenhum combate ativo.</div>`;
    if (typeof updateCombatDifficulty === 'function') updateCombatDifficulty();
    if (typeof renderPlayerView === 'function') renderPlayerView();
    return;
  }

  list.innerHTML = state.combatants.map((c, i) => {
    const isActive = i === state.turnIndex;
    const hpPct = Math.max(0, Math.min(100, Math.round((c.hp / c.maxHp) * 100)));
    const hpColor = hpPct > 50 ? 'var(--accent-green)' : (hpPct > 25 ? '#eab308' : 'var(--accent-red)');
    const isDying = c.hp === 0;
    const isBloodied = c.hp > 0 && hpPct <= 50;
    const isCritical = c.hp > 0 && hpPct <= 25;

    const condsBadges = (c.conditions || []).map(condId => {
      const found = CONDITIONS_LIST.find(x => x.id === condId);
      return `<span class="cond-tag" onclick="removeCond('${c.id}', '${condId}')" title="${found ? found.desc : ''}">${found ? found.name : condId} ✕</span>`;
    }).join('');

    return `
      <div class="combatant-item ${isActive ? 'glow' : ''} ${isDying ? 'dying' : (isBloodied ? 'bloodied' : '')} ${isCritical ? 'hp-critical' : ''}">
        <div class="combatant-header">
          <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
            <button class="btn-secondary" style="padding: 1px 6px; font-weight: 800; font-family: var(--font-mono); color: var(--primary); font-size: 13px; cursor: pointer; border: 1px dashed rgba(245,158,11,0.5);" onclick="editCombatantInit('${c.id}')" title="Clique para editar a Iniciativa">${c.init}</button>
            <span class="combatant-name" style="${isDying ? 'text-decoration: line-through; color: var(--accent-red);' : ''}">${c.name}</span>
            ${c.type === 'player' ? '<span class="badge badge-cls">Aluno</span>' : '<span class="badge badge-cr">Monstro</span>'}
            ${isDying ? '<span class="badge" style="background: rgba(239, 68, 68, 0.2); color: #f87171; border-color: #ef4444; font-size: 10px;">💀 0 PV</span>' : (isBloodied ? '<span class="badge" style="background: rgba(234, 179, 8, 0.2); color: #eab308; border-color: #eab308; font-size: 10px;">🩸 Sangrando</span>' : '')}
          </div>
          <div style="display: flex; gap: 4px; align-items: center;">
            <button class="btn-secondary" style="padding: 2px 6px; font-size: 10px;" onclick="editCombatantInit('${c.id}')" title="Editar Iniciativa">🎲</button>
            <button class="btn-secondary" style="padding: 2px 6px; font-size: 10px;" onclick="openCondModal('${c.id}')" title="Adicionar Condições / Status">🏷️</button>
            <button class="btn-secondary" style="padding: 2px 6px; font-size: 10px; color: #f87171;" onclick="removeCombatant('${c.id}')" title="Remover do Combate">✕</button>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: var(--text-muted); margin-top: 2px;">
          <span>CA: <b style="color: #fff;">${c.ac}</b></span>
          <div style="display: flex; align-items: center; gap: 6px;">
            <span>PV: <b style="color: ${hpColor};">${c.hp}</b> / ${c.maxHp}</span>
            <div style="display: flex; gap: 2px;">
              <button class="btn-hp-adj minus" style="width: 20px; height: 20px; font-size: 10px; padding: 0;" onclick="quickAdjustCombatantHp('${c.id}', -5)" title="Subtrair 5 PV">-5</button>
              <button class="btn-hp-adj minus" style="width: 20px; height: 20px; font-size: 10px; padding: 0;" onclick="quickAdjustCombatantHp('${c.id}', -1)" title="Subtrair 1 PV">-1</button>
              <button class="btn-hp-adj plus" style="width: 20px; height: 20px; font-size: 10px; padding: 0;" onclick="quickAdjustCombatantHp('${c.id}', 1)" title="Adicionar 1 PV">+1</button>
              <button class="btn-hp-adj plus" style="width: 20px; height: 20px; font-size: 10px; padding: 0;" onclick="quickAdjustCombatantHp('${c.id}', 5)" title="Adicionar 5 PV">+5</button>
            </div>
          </div>
        </div>

        <div class="hp-bar-bg" style="margin-top: 4px;">
          <div class="hp-bar-fill" style="width: ${hpPct}%; background-color: ${hpColor};"></div>
        </div>

        ${condsBadges ? `<div class="conditions-container">${condsBadges}</div>` : ''}
      </div>
    `;
  }).join('');

  // Combatente Ativo
  const active = state.combatants[state.turnIndex];
  if (active && activeDetails && activeTypeBadge) {
    activeTypeBadge.className = `badge ${active.type === 'player' ? 'badge-cls' : 'badge-cr'}`;
    activeTypeBadge.innerText = active.type === 'player' ? 'Aluno (Jogador)' : 'Monstro / Inimigo';

    const hpPct = Math.max(0, Math.min(100, Math.round((active.hp / active.maxHp) * 100)));
    const hpColor = hpPct > 50 ? 'var(--accent-green)' : (hpPct > 25 ? '#eab308' : 'var(--accent-red)');

    activeDetails.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <div style="font-size: 18px; font-weight: 800; font-family: var(--font-title); color: #fff;">${active.name}</div>
          <div style="font-size: 12px; color: var(--text-muted);">Iniciativa: <b style="color: var(--primary);">${active.init}</b> • CA: <b style="color: #fff;">${active.ac}</b> • PV: <b style="color: ${hpColor};">${active.hp} / ${active.maxHp}</b></div>
        </div>
        <button class="btn-action" style="padding: 6px 12px;" onclick="openCondModal('${active.id}')">🏷️ Status</button>
      </div>

      <div class="hp-bar-bg" style="height: 10px;">
        <div class="hp-bar-fill" style="width: ${hpPct}%; background-color: ${hpColor};"></div>
      </div>

      <div style="background: #080c16; padding: 10px; border-radius: 8px; border: 1px solid var(--border-color); font-size: 12px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
          <b style="color: var(--primary-light);">⚔️ Ações & Ataques do Turno:</b>
          <span style="font-size: 10px; color: var(--text-muted);">Clique para Rolar</span>
        </div>
        <div style="color: #e2e8f0; margin-top: 4px;">
          ${(active.type === 'monster' || !active.type || active.type === 'npc')
            ? parseAndRenderMonsterActions(active.actions || 'Ataque padrão (+4 para acertar, 1d6+2 dano físico)', active.name, active.id)
            : (active.actions || 'Ataque padrão (+4 para acertar, 1d6+2 dano físico)')}
        </div>
      </div>

      ${(active.type === 'player') ? (() => {
        const playerObj = typeof findPlayerForCombatant === 'function' 
          ? findPlayerForCombatant(active, typeof PLAYERS !== 'undefined' ? PLAYERS : [])
          : (typeof PLAYERS !== 'undefined' ? PLAYERS.find(p => (active.playerId && p.id === active.playerId) || active.name.includes(p.name)) : null);
        if (!playerObj) return '';
        let extraHtml = '';
        
        // Death saves a 0 PV
        if (active.hp <= 0) {
          playerObj.deathSaves = playerObj.deathSaves || { success: 0, fail: 0 };
          extraHtml += `
            <div class="death-saves-box" style="margin-top: 8px; background: rgba(0,0,0,0.4); border: 1px solid rgba(239,68,68,0.4); padding: 8px; border-radius: 8px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                <span style="font-size: 11px; font-weight: 800; color: #f87171;">💀 Salvaguardas contra a Morte</span>
                <button class="btn-action" style="font-size: 10px; padding: 2px 8px; background: linear-gradient(135deg, #ef4444, #991b1b);" onclick="rollDeathSave('${playerObj.id}')">🎲 Rolar (d20)</button>
              </div>
              <div style="display: flex; justify-content: space-around; align-items: center; font-size: 11px;">
                <div style="display: flex; align-items: center; gap: 6px;">
                  <span style="color: #34d399; font-weight: bold;">Sucessos:</span>
                  <div class="save-dots" style="display: flex; gap: 4px;">
                    <div class="save-dot ${playerObj.deathSaves.success >= 1 ? 'success' : ''}" onclick="toggleDeathSave('${playerObj.id}', 'success', 1)" style="width:12px; height:12px; border-radius:50%; border:1px solid #34d399; cursor:pointer; background:${playerObj.deathSaves.success >= 1 ? '#10b981' : 'transparent'};"></div>
                    <div class="save-dot ${playerObj.deathSaves.success >= 2 ? 'success' : ''}" onclick="toggleDeathSave('${playerObj.id}', 'success', 2)" style="width:12px; height:12px; border-radius:50%; border:1px solid #34d399; cursor:pointer; background:${playerObj.deathSaves.success >= 2 ? '#10b981' : 'transparent'};"></div>
                    <div class="save-dot ${playerObj.deathSaves.success >= 3 ? 'success' : ''}" onclick="toggleDeathSave('${playerObj.id}', 'success', 3)" style="width:12px; height:12px; border-radius:50%; border:1px solid #34d399; cursor:pointer; background:${playerObj.deathSaves.success >= 3 ? '#10b981' : 'transparent'};"></div>
                  </div>
                </div>
                <div style="display: flex; align-items: center; gap: 6px;">
                  <span style="color: #f87171; font-weight: bold;">Falhas:</span>
                  <div class="save-dots" style="display: flex; gap: 4px;">
                    <div class="save-dot ${playerObj.deathSaves.fail >= 1 ? 'failure' : ''}" onclick="toggleDeathSave('${playerObj.id}', 'fail', 1)" style="width:12px; height:12px; border-radius:50%; border:1px solid #ef4444; cursor:pointer; background:${playerObj.deathSaves.fail >= 1 ? '#ef4444' : 'transparent'};"></div>
                    <div class="save-dot ${playerObj.deathSaves.fail >= 2 ? 'failure' : ''}" onclick="toggleDeathSave('${playerObj.id}', 'fail', 2)" style="width:12px; height:12px; border-radius:50%; border:1px solid #ef4444; cursor:pointer; background:${playerObj.deathSaves.fail >= 2 ? '#ef4444' : 'transparent'};"></div>
                    <div class="save-dot ${playerObj.deathSaves.fail >= 3 ? 'failure' : ''}" onclick="toggleDeathSave('${playerObj.id}', 'fail', 3)" style="width:12px; height:12px; border-radius:50%; border:1px solid #ef4444; cursor:pointer; background:${playerObj.deathSaves.fail >= 3 ? '#ef4444' : 'transparent'};"></div>
                  </div>
                </div>
              </div>
            </div>
          `;
        }

        if (playerObj.preparedSpells && playerObj.preparedSpells.length > 0) {
          const castStats = typeof getPlayerSpellcastingStats === 'function' ? getPlayerSpellcastingStats(playerObj) : null;
          extraHtml += `
            <div style="background: #080c16; padding: 8px 10px; border-radius: 8px; border: 1px solid var(--border-color); font-size: 12px; margin-top: 6px;">
              <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:4px;">
                <div style="display:flex; align-items:center; gap:6px;">
                  <b style="color: var(--primary-light);">✨ Magias (Ação Rápida):</b>
                  ${castStats && castStats.isCaster ? `
                    <span class="badge badge-lvl" style="font-size:10px; padding:1px 6px;" title="${castStats.formula}">CD ${castStats.saveDc}</span>
                    <button class="btn-secondary" style="font-size:10px; padding:1px 6px; color:#fbbf24; border-color:#f59e0b;" onclick="rollPlayerSpellAttack('${playerObj.id}')" title="Rolar Ataque Mágico (d20 ${castStats.attackBonus})">🎲 Atk: ${castStats.attackBonus}</button>
                  ` : ''}
                </div>
                <span style="font-size:10px; color:var(--text-muted);">${(playerObj.slots || []).map((max, idx) => max > 0 ? `${idx+1}º: ${max - (playerObj.slotsUsed[idx]||0)}/${max}` : '').filter(x => x).join(' | ')}</span>
              </div>
              <div style="display:flex; flex-wrap:wrap; gap:4px; margin-top:6px;">
                ${playerObj.preparedSpells.map(sName => {
                  const sp = typeof SPELLS_DATA !== 'undefined' ? SPELLS_DATA.find(s => s.name.toLowerCase() === sName.toLowerCase()) : null;
                  const lvlBadge = sp ? (sp.level === 0 ? 'Truque' : `${sp.level}º`) : '';
                  return `
                    <button class="btn-secondary" style="font-size:10px; padding:3px 7px; display:inline-flex; align-items:center; gap:4px; border-color:rgba(59,130,246,0.4);" onclick="castPlayerSpellPrompt('${playerObj.id}', '${(sName||'').replace(/'/g, "\\'")}')">
                      <span>${sName}</span> <span style="font-size:8px; opacity:0.8; color:var(--primary-light); font-weight:bold;">${lvlBadge}</span>
                    </button>
                  `;
                }).join('')}
              </div>
            </div>
          `;
        }
        return extraHtml;
      })() : ''}
    `;
  }

  if (typeof updateCombatDifficulty === 'function') updateCombatDifficulty();
  if (typeof updateTurnTimerUI === 'function') updateTurnTimerUI();
  if (typeof renderPlayerView === 'function') renderPlayerView();
  if (typeof renderVttCombatHud === 'function') renderVttCombatHud();
}

function nextTurn() {
  if (state.combatants.length === 0) return;
  state.turnIndex++;
  if (state.turnIndex >= state.combatants.length) {
    state.turnIndex = 0;
    state.round++;
    addLog(`🚩 <b>Início da Rodada ${state.round}</b>`);
  }
  if (typeof turnTimerAutoReset !== 'undefined' && turnTimerAutoReset) {
    resetTurnTimer();
    startTurnTimer();
  }
  const currentCombatant = state.combatants[state.turnIndex];
  const turnNarrative = `É a vez de <b>${currentCombatant ? currentCombatant.name : 'combatente'}</b> agir!`;
  renderCombat();
  if (typeof renderPlayerView === 'function') renderPlayerView(turnNarrative);
  saveToLocalStorage();
}

// --- M6: TEMPORIZADOR DE TURNO DE COMBATE ---
let turnTimerDuration = 60;
let turnTimerRemaining = 60;
let turnTimerRunning = false;
let turnTimerInterval = null;
let turnTimerAutoReset = true;

function initTurnTimer() {
  updateTurnTimerUI();
}

function startTurnTimer() {
  if (turnTimerRunning) return;
  turnTimerRunning = true;
  if (turnTimerRemaining <= 0) turnTimerRemaining = turnTimerDuration;
  updateTurnTimerUI();
  broadcastTurnTimer();

  if (turnTimerInterval) clearInterval(turnTimerInterval);
  turnTimerInterval = setInterval(() => {
    if (turnTimerRemaining > 0) {
      turnTimerRemaining--;
      updateTurnTimerUI();
      broadcastTurnTimer();
      if (turnTimerRemaining === 10) {
        if (typeof playFX === 'function') playFX('fumble');
      }
      if (turnTimerRemaining === 0) {
        turnTimerRunning = false;
        clearInterval(turnTimerInterval);
        if (typeof playFX === 'function') playFX('fumble');
        updateTurnTimerUI();
        broadcastTurnTimer();
      }
    }
  }, 1000);
}

function pauseTurnTimer() {
  turnTimerRunning = false;
  if (turnTimerInterval) clearInterval(turnTimerInterval);
  updateTurnTimerUI();
  broadcastTurnTimer();
}

function toggleTurnTimer() {
  if (turnTimerRunning) pauseTurnTimer();
  else startTurnTimer();
}

function resetTurnTimer() {
  turnTimerRemaining = turnTimerDuration;
  updateTurnTimerUI();
  broadcastTurnTimer();
}

function addTurnTimerSeconds(sec = 15) {
  turnTimerRemaining = Math.min(600, turnTimerRemaining + sec);
  updateTurnTimerUI();
  broadcastTurnTimer();
}

function setTurnTimerDuration(sec) {
  turnTimerDuration = Math.max(5, parseInt(sec) || 60);
  turnTimerRemaining = turnTimerDuration;
  updateTurnTimerUI();
  broadcastTurnTimer();
}

function toggleTurnTimerAutoReset() {
  turnTimerAutoReset = !turnTimerAutoReset;
  const chk = document.getElementById('chk-timer-autoreset');
  if (chk) chk.checked = turnTimerAutoReset;
}

function updateTurnTimerUI() {
  const display = document.getElementById('combat-timer-display');
  const bar = document.getElementById('combat-timer-bar');
  const btnToggle = document.getElementById('btn-timer-toggle');

  if (display) {
    const mins = Math.floor(turnTimerRemaining / 60);
    const secs = turnTimerRemaining % 60;
    display.innerText = `${mins > 0 ? mins + ':' : ''}${String(secs).padStart(2, '0')}s`;
    if (turnTimerRemaining <= 10) {
      display.style.color = '#f87171';
    } else if (turnTimerRemaining <= 25) {
      display.style.color = '#facc15';
    } else {
      display.style.color = '#34d399';
    }
  }

  if (bar && turnTimerDuration > 0) {
    const pct = Math.max(0, Math.min(100, (turnTimerRemaining / turnTimerDuration) * 100));
    bar.style.width = `${pct}%`;
    bar.style.backgroundColor = turnTimerRemaining <= 10 ? 'var(--accent-red)' : (turnTimerRemaining <= 25 ? '#eab308' : 'var(--accent-green)');
  }

  if (btnToggle) {
    btnToggle.innerHTML = turnTimerRunning ? '⏸️' : '▶️';
    btnToggle.title = turnTimerRunning ? 'Pausar Temporizador' : 'Iniciar Temporizador';
  }
}

function broadcastTurnTimer() {
  if (typeof syncChannel !== 'undefined' && syncChannel) {
    try {
      syncChannel.postMessage({
        type: 'TURN_TIMER_SYNC',
        remaining: turnTimerRemaining,
        duration: turnTimerDuration,
        running: turnTimerRunning,
        combatant: state.combatants[state.turnIndex]?.name || 'Combatente'
      });
    } catch (e) {}
  }
}

// --- DM1: BALANCEADOR & GERADOR DE ENCONTROS (XP / ND) ---
let encounterDraftMonsters = [];
let encounterCustomPartyLevels = null;

function openEncounterBuilderModal() {
  const modal = document.getElementById('modal-encounter-builder');
  if (!modal) return;

  if (!encounterCustomPartyLevels) {
    encounterCustomPartyLevels = (typeof PLAYERS !== 'undefined' ? PLAYERS : [])
      .filter(p => p.present !== false)
      .map(p => p.level || 1);
    if (encounterCustomPartyLevels.length === 0) encounterCustomPartyLevels = [2, 2, 2, 2];
  }

  populateEncounterMonsterSelect();
  renderEncounterBuilder();
  modal.classList.add('open');
}

function populateEncounterMonsterSelect() {
  const sel = document.getElementById('enc-select-monster-add');
  if (!sel) return;
  if (typeof MONSTERS_DB === 'undefined' || !Array.isArray(MONSTERS_DB)) return;
  const currentVal = sel.value;
  sel.innerHTML = '<option value="">➕ Selecione um monstro para adicionar ao encontro...</option>' +
    [...MONSTERS_DB].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR')).map(m => {
      const xp = typeof getMonsterXp === 'function' ? getMonsterXp(m.cr) : '';
      return `<option value="${m.name}">🐉 ${m.name} (ND ${m.cr}${xp ? ` • ${xp} XP` : ''} • CA ${m.ac} • ${m.hp} PV)</option>`;
    }).join('');
  if (currentVal) sel.value = currentVal;
}

function addSelectedMonsterToEncounter() {
  const sel = document.getElementById('enc-select-monster-add');
  if (!sel || !sel.value) {
    alert('Selecione uma criatura na lista.');
    return;
  }
  const mon = typeof MONSTERS_DB !== 'undefined' ? MONSTERS_DB.find(m => m.name === sel.value) : null;
  if (mon) {
    addMonsterToEncounterDraft(mon.name, mon.cr, mon.ac, mon.hp, mon.actions);
    sel.value = '';
  }
}

function closeEncounterBuilderModal() {
  const modal = document.getElementById('modal-encounter-builder');
  if (modal) modal.classList.remove('open');
}

function renderEncounterBuilder() {
  const partyContainer = document.getElementById('enc-party-members');
  const monstersContainer = document.getElementById('enc-draft-monsters');
  const summaryBox = document.getElementById('enc-summary-box');

  const partyLevels = encounterCustomPartyLevels || [2, 2, 2, 2];
  const partyTh = typeof getPartyXpThresholds === 'function' ? getPartyXpThresholds(partyLevels) : { easy: 200, medium: 400, hard: 600, deadly: 800, daily: 2400, count: 4 };

  // Render Party Levels
  if (partyContainer) {
    partyContainer.innerHTML = partyLevels.map((lvl, idx) => `
      <div class="enc-party-chip">
        <span style="font-size:11px; font-weight:700;">Herói ${idx + 1}:</span>
        <select style="background:#080c16; border:1px solid var(--border-color); color:#fff; border-radius:4px; font-size:11px; padding:2px;" onchange="updateEncounterPartyMember(${idx}, this.value)">
          ${Array.from({ length: 20 }, (_, i) => i + 1).map(l => `
            <option value="${l}" ${l === lvl ? 'selected' : ''}>Nv ${l}</option>
          `).join('')}
        </select>
        <button class="btn-secondary" style="padding: 1px 5px; font-size: 10px; color:#f87171;" onclick="removeEncounterPartyMember(${idx})" title="Remover herói">✕</button>
      </div>
    `).join('') + `
      <button class="btn-secondary" style="padding: 4px 8px; font-size: 11px; border-style:dashed;" onclick="addEncounterPartyMember()">➕ Adicionar Herói</button>
    `;
  }

  // Render Draft Monsters
  if (monstersContainer) {
    if (encounterDraftMonsters.length === 0) {
      monstersContainer.innerHTML = `<div style="color:var(--text-dim); font-size:11px; padding:12px; text-align:center; border:1px dashed var(--border-color); border-radius:6px;">Nenhum monstro adicionado ao encontro.<br>Busque criaturas abaixo para compor o desafio.</div>`;
    } else {
      monstersContainer.innerHTML = encounterDraftMonsters.map((m, idx) => {
        const xp = typeof getMonsterXp === 'function' ? getMonsterXp(m.cr) : 100;
        return `
          <div class="enc-monster-draft-row">
            <div style="flex:1;">
              <b style="color:#fff; font-size:12px;">${m.name}</b>
              <span style="font-size:10px; color:var(--primary-light);"> (ND ${m.cr} • ${xp} XP)</span>
            </div>
            <div style="display:flex; align-items:center; gap:4px;">
              <span class="monster-qty-label" style="font-size:10px;">Qtd:</span>
              <input type="number" min="1" max="50" value="${m.qty}" class="monster-qty-input" style="width:44px; height:24px; font-size:13px;" onchange="updateEncounterMonsterQty(${idx}, this.value)">
              <button class="btn-secondary" style="padding:2px 6px; font-size:10px; color:#f87171;" onclick="removeEncounterDraftMonster(${idx})">✕</button>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  // Summary & Difficulty Gauge
  const diffData = typeof calculateEncounterDifficulty === 'function' 
    ? calculateEncounterDifficulty(partyLevels, encounterDraftMonsters)
    : { rawXp: 0, adjustedXp: 0, multiplier: 1.0, monsterCount: 0, difficultyLabel: 'Trivial', difficultyColor: '#94a3b8', thresholds: partyTh };

  if (summaryBox) {
    const xpPerPlayer = Math.round(diffData.rawXp / Math.max(1, partyLevels.length));
    summaryBox.innerHTML = `
      <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:6px; margin-bottom:8px; text-align:center; font-size:10px;">
        <div class="enc-th-badge" style="border-color:var(--accent-green);"><span>Fácil</span><b style="display:block; color:#fff; font-size:11px;">${partyTh.easy} XP</b></div>
        <div class="enc-th-badge" style="border-color:#eab308;"><span>Médio</span><b style="display:block; color:#fff; font-size:11px;">${partyTh.medium} XP</b></div>
        <div class="enc-th-badge" style="border-color:#f97316;"><span>Difícil</span><b style="display:block; color:#fff; font-size:11px;">${partyTh.hard} XP</b></div>
        <div class="enc-th-badge" style="border-color:var(--accent-red);"><span>Mortal</span><b style="display:block; color:#fff; font-size:11px;">${partyTh.deadly} XP</b></div>
      </div>

      <div style="background:#090e1a; border:2px solid ${diffData.difficultyColor}; border-radius:8px; padding:10px; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <div style="font-size:14px; font-weight:800; color:${diffData.difficultyColor};">${diffData.difficultyLabel}</div>
          <div style="font-size:11px; color:var(--text-muted); margin-top:2px;">
            XP Bruto: <b style="color:#fff;">${diffData.rawXp}</b> (${xpPerPlayer} XP/herói) • Multiplicador: <b>${diffData.multiplier}x</b> (${diffData.monsterCount} monstros)
          </div>
        </div>
        <div style="text-align:right;">
          <span style="font-size:10px; color:var(--text-dim); display:block;">XP AJUSTADO:</span>
          <span style="font-size:18px; font-weight:900; font-family:var(--font-mono); color:${diffData.difficultyColor};">${diffData.adjustedXp} XP</span>
        </div>
      </div>
    `;
  }
}

function addEncounterPartyMember() {
  encounterCustomPartyLevels = encounterCustomPartyLevels || [2, 2, 2, 2];
  encounterCustomPartyLevels.push(2);
  renderEncounterBuilder();
}

function removeEncounterPartyMember(idx) {
  if (!encounterCustomPartyLevels || encounterCustomPartyLevels.length <= 1) return;
  encounterCustomPartyLevels.splice(idx, 1);
  renderEncounterBuilder();
}

function updateEncounterPartyMember(idx, newLevel) {
  if (!encounterCustomPartyLevels) return;
  encounterCustomPartyLevels[idx] = parseInt(newLevel) || 1;
  renderEncounterBuilder();
}

function addMonsterToEncounterDraft(monName, cr, ac, hp, attack) {
  const existing = encounterDraftMonsters.find(m => m.name === monName);
  if (existing) {
    existing.qty++;
  } else {
    encounterDraftMonsters.push({
      name: monName,
      cr: cr || '1',
      ac: ac || 12,
      hp: hp || 15,
      attack: attack || '',
      qty: 1
    });
  }
  renderEncounterBuilder();
}

function updateEncounterMonsterQty(idx, qty) {
  if (!encounterDraftMonsters[idx]) return;
  encounterDraftMonsters[idx].qty = Math.max(1, parseInt(qty) || 1);
  renderEncounterBuilder();
}

function removeEncounterDraftMonster(idx) {
  encounterDraftMonsters.splice(idx, 1);
  renderEncounterBuilder();
}

function clearEncounterDraft() {
  encounterDraftMonsters = [];
  renderEncounterBuilder();
}

function dispatchEncounterToCombat(clearExisting = false) {
  if (encounterDraftMonsters.length === 0) {
    alert('Adicione ao menos um monstro ao encontro!');
    return;
  }

  if (clearExisting) {
    state.combatants = state.combatants.filter(c => c.type === 'player');
  }

  let totalAdded = 0;
  encounterDraftMonsters.forEach(m => {
    const existingCount = state.combatants.filter(x => x.name === m.name || x.name.startsWith(m.name + ' #')).length;
    for (let i = 1; i <= m.qty; i++) {
      const number = existingCount + i;
      const initRoll = Math.floor(Math.random() * 20) + 1;
      const monsterName = m.qty === 1 && existingCount === 0 ? m.name : `${m.name} #${number}`;

      state.combatants.push({
        id: 'c_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4) + '_' + i,
        name: monsterName,
        init: initRoll,
        ac: m.ac,
        hp: m.hp,
        maxHp: m.hp,
        type: 'monster',
        conditions: [],
        actions: m.attack
      });
      totalAdded++;
    }
  });

  state.combatants.sort((a, b) => b.init - a.init);
  if (typeof addLog === 'function') {
    addLog(`⚔️ <b>Encontro Balanceado Despachado:</b> ${totalAdded} monstros adicionados ao combate com iniciativa.`);
  }

  closeEncounterBuilderModal();
  renderCombat();
  if (typeof switchTab === 'function') switchTab('combat');
  saveToLocalStorage();
}

// Listener para disparar dano direto com tecla Enter no despachante
document.addEventListener('DOMContentLoaded', () => {
  const inpDmg = document.getElementById('inp-damage');
  if (inpDmg) {
    inpDmg.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        applyCombatAction('damage');
      }
    });
  }
});

function resetCombat() {
  state.round = 1;
  state.turnIndex = 0;
  if (typeof startTurnTimer === 'function') startTurnTimer();
  addLog('🔄 Combate reiniciado na Rodada 1.');
  renderCombat();
  saveToLocalStorage();
}

function clearCombat() {
  if (confirm('Deseja limpar todos os combatentes da mesa?')) {
    state.combatants = [];
    state.round = 1;
    state.turnIndex = 0;
    if (typeof turnTimerInterval !== 'undefined') clearInterval(turnTimerInterval);
    addLog('🗑️ Mesa de combate limpa.');
    renderCombat();
    saveToLocalStorage();
  }
}

function rollMonsterInit() {
  state.combatants.forEach(c => {
    if (c.type === 'monster') {
      c.init = Math.floor(Math.random() * 20) + 1;
    }
  });
  state.combatants.sort((a, b) => b.init - a.init);
  addLog('🎲 Iniciativa dos monstros rolada novamente.');
  renderCombat();
  saveToLocalStorage();
}

function applyCombatAction(type, customNarrative = null) {
  const attId = document.getElementById('sel-attacker')?.value;
  const tarId = document.getElementById('sel-target')?.value;
  const dmg = parseInt(document.getElementById('inp-damage')?.value) || 0;

  const att = state.combatants.find(c => c.id === attId);
  const tar = state.combatants.find(c => c.id === tarId);

  if (!tar) { alert('Selecione um alvo válido!'); return; }

  const prevHp = tar.hp;
  let narrativeBanner = '';

  if (type === 'damage' || type === 'crit') {
    tar.hp = Math.max(0, tar.hp - dmg);
    let msg = `[R${state.round}] ⚔️ <b>${att ? att.name : 'Atacante'}</b> causou <b>${dmg}</b> de dano em <b>${tar.name}</b> (${prevHp} ➔ ${tar.hp} PV)`;
    if (customNarrative) {
      msg = `${customNarrative} • ` + msg;
    }
    if (type === 'crit') {
      msg = '🔥 <b>CRÍTICO!</b> ' + msg;
      narrativeBanner = `🔥 <b>ACERTO CRÍTICO!</b> ${att ? att.name : 'Atacante'} causou <b>${dmg} de dano massivo</b> em ${tar.name}!`;
    } else {
      narrativeBanner = `⚔️ <b>${att ? att.name : 'Atacante'}</b> acertou o golpe causando <b>${dmg} de dano</b> em ${tar.name}!`;
    }

    // Alerta de Concentração
    const hasConc = (tar.conditions || []).includes('concentracao');
    if (hasConc && tar.hp > 0 && dmg > 0) {
      const dc = Math.max(10, Math.floor(dmg / 2));
      msg += `<br><span style="color: var(--primary); font-weight: bold;">⚠️ ${tar.name} deve fazer teste de CONSTITUIÇÃO CD ${dc} para manter a Concentração!</span>`;
      narrativeBanner += ` (Teste de Concentração CD ${dc})`;
    }
    if (tar.hp === 0) {
      msg += `<br><span style="color: var(--accent-red); font-weight: bold;">💀 ${tar.name} caiu a 0 PV!</span>`;
      narrativeBanner = `💀 <b>${tar.name}</b> foi derrotado em combate!`;
    }

    // Regra D&D 5E: Dano sofrido a 0 PV adiciona falhas no teste contra a morte
    if (tar.type === 'player' && prevHp === 0 && dmg > 0) {
      const pl = typeof findPlayerForCombatant === 'function'
        ? findPlayerForCombatant(tar, typeof PLAYERS !== 'undefined' ? PLAYERS : [])
        : (typeof PLAYERS !== 'undefined' ? PLAYERS.find(p => (tar.playerId && p.id === tar.playerId) || tar.name.includes(p.name)) : null);
      if (pl) {
        pl.deathSaves = pl.deathSaves || { success: 0, fail: 0 };
        const addedFails = type === 'crit' ? 2 : 1;
        pl.deathSaves.fail = Math.min(3, pl.deathSaves.fail + addedFails);
        msg += `<br><span style="color: #f87171; font-weight: bold;">💀 Dano a 0 PV! ${pl.name} sofreu +${addedFails} Falha(s) na Salvaguarda da Morte (${pl.deathSaves.fail}/3)!</span>`;
        if (typeof addPlayerActionLog === 'function') {
          addPlayerActionLog(pl.id, '💀', `Dano a 0 PV: +${addedFails} falha(s) de morte (${pl.deathSaves.fail}/3)`, 'save');
        }
        if (pl.deathSaves.fail >= 3 || dmg >= tar.maxHp) {
          msg += `<br><span style="color: #ef4444; font-size: 13px; font-weight: 800;">⚰️ ${pl.name} MORREU em combate!</span>`;
          narrativeBanner = `⚰️ <b>${pl.name}</b> sucumbiu e faleceu em combate!`;
          if (typeof playFX === 'function') playFX('death');
        }
      }
    }

    addLog(msg);
    if (typeof playFX === 'function') playFX(type === 'crit' ? 'crit' : 'sword');
    if (typeof showToast === 'function') {
      const toastType = tar.hp === 0 ? 'error' : (tar.hp <= tar.maxHp * 0.25 ? 'warning' : 'info');
      showToast(`⚔️ ${tar.name}: -${dmg} PV (${tar.hp}/${tar.maxHp})`, toastType);
    }
  } else if (type === 'heal') {
    tar.hp = Math.min(tar.maxHp, tar.hp + dmg);
    addLog(`💚 [R${state.round}] <b>${att ? att.name : 'Curandeiro'}</b> curou <b>${dmg}</b> PV em <b>${tar.name}</b> (${prevHp} ➔ ${tar.hp} PV)`);
    narrativeBanner = `💚 <b>${att ? att.name : 'Curandeiro'}</b> restaurou <b>+${dmg} PV</b> para ${tar.name}!`;
    if (typeof playFX === 'function') playFX('heal');
    if (typeof showToast === 'function') {
      showToast(`💚 ${tar.name}: +${dmg} PV (${tar.hp}/${tar.maxHp})`, 'success');
    }
  }

  // Sincroniza PV e Death Saves de volta para a ficha do jogador caso seja um Aluno
  if (tar.type === 'player' && typeof PLAYERS !== 'undefined') {
    const pl = typeof findPlayerForCombatant === 'function'
      ? findPlayerForCombatant(tar, PLAYERS)
      : PLAYERS.find(p => (tar.playerId && p.id === tar.playerId) || tar.name.includes(p.name));
    if (pl) {
      pl.hp = tar.hp;
      if (type === 'heal' && tar.hp > 0) {
        pl.deathSaves = { success: 0, fail: 0 };
      }
      if (typeof renderPlayers === 'function') renderPlayers();
    }
  }

  const inp = document.getElementById('inp-damage');
  if (inp) inp.value = '';
  renderCombat();
  if (typeof renderPlayerView === 'function') renderPlayerView(narrativeBanner);
  saveToLocalStorage();
}

function applyHalfDamage() {
  const inp = document.getElementById('inp-damage');
  const val = parseInt(inp?.value, 10);
  if (isNaN(val) || val <= 0) {
    alert('Digite o valor do dano base primeiro!');
    return;
  }
  const halfVal = Math.floor(val / 2);
  inp.value = halfVal;
  applyCombatAction('damage', `🛡️ Metade do Dano (Resistência / Teste CD): ${halfVal} PV`);
}

function applyDoubleDamage() {
  const inp = document.getElementById('inp-damage');
  const val = parseInt(inp?.value, 10);
  if (isNaN(val) || val <= 0) {
    alert('Digite o valor do dano base primeiro!');
    return;
  }
  const doubleVal = val * 2;
  inp.value = doubleVal;
  applyCombatAction('damage', `💥 Dobro do Dano (Vulnerabilidade): ${doubleVal} PV`);
}

function addLog(msg) {
  if (typeof state === 'undefined' || !state) return;
  state.logs = state.logs || [];
  state.logs.unshift({ time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }), text: msg });
  renderLogs();
}

function renderLogs() {
  const el = document.getElementById('list-logs');
  if (!el) return;
  if (state.logs.length === 0) {
    el.innerHTML = '<div style="color: var(--text-dim); text-align: center; padding: 20px;">Nenhuma ação registrada.</div>';
    return;
  }
  el.innerHTML = state.logs.map(l => `
    <div style="background: #080c16; padding: 6px 10px; border-radius: 6px; border: 1px solid var(--border-color); line-height: 1.4;">
      <span style="color: var(--text-dim); font-size: 10px;">[${l.time}]</span> ${l.text}
    </div>
  `).join('');
}

function undoLog() {
  if (state.logs.length > 0) {
    state.logs.shift();
    renderLogs();
    saveToLocalStorage();
  }
}

function removeCombatant(id) {
  state.combatants = state.combatants.filter(c => c.id !== id);
  if (state.turnIndex >= state.combatants.length) state.turnIndex = 0;
  renderCombat();
  saveToLocalStorage();
}

function editCombatantInit(id) {
  const c = state.combatants.find(x => x.id === id);
  if (!c) return;
  const val = prompt(`Alterar valor de Iniciativa para ${c.name}:`, c.init);
  if (val !== null && val.trim() !== '') {
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed)) {
      c.init = parsed;
      state.combatants.sort((a, b) => b.init - a.init);
      addLog(`🎲 Iniciativa de <b>${c.name}</b> alterada para <b>${c.init}</b>`);
      renderCombat();
      saveToLocalStorage();
    }
  }
}

function quickAdjustCombatantHp(id, delta) {
  const c = state.combatants.find(x => x.id === id);
  if (!c) return;
  const prev = c.hp;
  if (delta < 0) {
    c.hp = Math.max(0, c.hp + delta);
    addLog(`⚔️ <b>${c.name}</b> sofreu ${Math.abs(delta)} de dano rápido (${prev} ➔ ${c.hp} PV)`);
    if (typeof playFX === 'function') playFX('sword');
    if (typeof showToast === 'function') {
      const toastType = c.hp === 0 ? 'error' : (c.hp <= c.maxHp * 0.25 ? 'warning' : 'info');
      showToast(`⚔️ ${c.name}: ${delta} PV (${c.hp}/${c.maxHp})`, toastType);
    }
    if (c.hp === 0) {
      addLog(`💀 <b>${c.name}</b> caiu a 0 PV!`);
      if (typeof playFX === 'function') playFX('fumble');
    }
  } else {
    c.hp = Math.min(c.maxHp, c.hp + delta);
    addLog(`💚 <b>${c.name}</b> recuperou ${delta} PV rápidos (${prev} ➔ ${c.hp} PV)`);
    if (typeof playFX === 'function') playFX('heal');
    if (typeof showToast === 'function') {
      showToast(`💚 ${c.name}: +${delta} PV (${c.hp}/${c.maxHp})`, 'success');
    }
  }

  // Sincroniza de volta para PLAYERS caso seja um jogador
  if (c.type === 'player' && typeof PLAYERS !== 'undefined') {
    const pl = typeof findPlayerForCombatant === 'function'
      ? findPlayerForCombatant(c, PLAYERS)
      : PLAYERS.find(p => (c.playerId && p.id === c.playerId) || c.name.includes(p.name));
    if (pl) {
      pl.hp = c.hp;
      if (typeof renderPlayers === 'function') renderPlayers();
    }
  }

  renderCombat();
  if (typeof renderPlayerView === 'function') renderPlayerView();
  saveToLocalStorage();
}

function openAddModal() { document.getElementById('modal-add').classList.add('open'); }
function closeAddModal() { document.getElementById('modal-add').classList.remove('open'); }

function saveNewCombatant() {
  const name = document.getElementById('add-name').value.trim();
  const init = parseInt(document.getElementById('add-init').value) || 10;
  const ac = parseInt(document.getElementById('add-ac').value) || 10;
  const hp = parseInt(document.getElementById('add-hp').value) || 10;
  const type = document.getElementById('add-type').value;
  const actions = document.getElementById('add-actions').value.trim() || 'Ataque padrão (+4, 1d6+2 físico)';

  if (!name) { alert('Informe o nome do combatente!'); return; }

  state.combatants.push({
    id: 'c_' + Date.now(),
    name, init, ac, hp, maxHp: hp, type, conditions: [], actions
  });
  state.combatants.sort((a, b) => b.init - a.init);
  closeAddModal();
  document.getElementById('add-name').value = '';
  renderCombat();
  saveToLocalStorage();
}

// --- GERENCIADOR DE CONDIÇÕES ---
function openCondModal(combatantId) {
  managingCondCombatantId = combatantId;
  const c = state.combatants.find(x => x.id === combatantId);
  if (!c) return;

  document.getElementById('cond-modal-heading').innerText = `Condições de: ${c.name}`;
  const picker = document.getElementById('conds-picker');
  c.conditions = c.conditions || [];

  picker.innerHTML = CONDITIONS_LIST.map(cond => {
    const has = c.conditions.includes(cond.id);
    return `
      <button class="btn-secondary" style="justify-content: flex-start; ${has ? 'border-color: var(--primary); background: rgba(245,158,11,0.15); color: #fff;' : ''}" onclick="toggleCond('${cond.id}')">
        <span>${has ? '✅' : '⚪'}</span> <span>${cond.name}</span>
      </button>
    `;
  }).join('');

  document.getElementById('modal-conds').classList.add('open');
}

function closeCondModal() {
  document.getElementById('modal-conds').classList.remove('open');
  renderCombat();
  saveToLocalStorage();
}

function toggleCond(condId) {
  const c = state.combatants.find(x => x.id === managingCondCombatantId);
  if (!c) return;
  c.conditions = c.conditions || [];
  if (c.conditions.includes(condId)) {
    c.conditions = c.conditions.filter(id => id !== condId);
  } else {
    c.conditions.push(condId);
    addLog(`⚠️ <b>${c.name}</b> recebeu o status: <b>${condId.toUpperCase()}</b>.`);
  }
  openCondModal(managingCondCombatantId);
  saveToLocalStorage();
}

function removeCond(combatantId, condId) {
  const c = state.combatants.find(x => x.id === combatantId);
  if (!c || !c.conditions) return;
  c.conditions = c.conditions.filter(id => id !== condId);
  renderCombat();
  saveToLocalStorage();
}

// --- ROLADOR DE DADOS D&D 5E ---
function openDiceModal() {
  document.getElementById('modal-dice').classList.add('open');
}

function closeDiceModal() {
  document.getElementById('modal-dice').classList.remove('open');
}

function showLiveDiceRoll(title, val, detail, isCrit = false, isFumble = false) {
  if (typeof syncChannel !== 'undefined' && syncChannel) {
    syncChannel.postMessage({
      type: 'DICE_ROLL',
      title, val, detail, isCrit, isFumble
    });
  }

  const overlay = document.getElementById('live-dice-display');
  if (overlay) {
    document.getElementById('ld-title').innerText = title;
    document.getElementById('ld-value').innerText = val;
    document.getElementById('ld-detail').innerText = detail;

    overlay.className = 'live-dice-overlay show' + (isCrit ? ' live-dice-crit' : '');
    setTimeout(() => {
      overlay.classList.remove('show');
    }, 2800);
  }
}

function executeDiceRoll(sides, mode = 'normal') {
  const count = parseInt(document.getElementById('dice-count').value) || 1;
  const mod = parseInt(document.getElementById('dice-mod').value) || 0;

  let rolls = [];
  let total = 0;
  let breakdown = '';
  let isCrit = false;
  let isFumble = false;

  if (mode === 'adv' || mode === 'dis') {
    const r1 = Math.floor(Math.random() * 20) + 1;
    const r2 = Math.floor(Math.random() * 20) + 1;
    const chosen = mode === 'adv' ? Math.max(r1, r2) : Math.min(r1, r2);
    total = chosen + mod;
    breakdown = `2d20 [${r1}, ${r2}] ➔ ${chosen} ${mod !== 0 ? (mod > 0 ? '+ ' + mod : '- ' + Math.abs(mod)) : ''}`;
    
    if (chosen === 20) { isCrit = true; playFX('crit'); }
    else if (chosen === 1) { isFumble = true; playFX('fumble'); }
    else playFX('sword');
  } else {
    for (let i = 0; i < count; i++) {
      const r = Math.floor(Math.random() * sides) + 1;
      rolls.push(r);
      total += r;
    }
    total += mod;
    breakdown = `${count}d${sides} [${rolls.join(', ')}] ${mod !== 0 ? (mod > 0 ? '+ ' + mod : '- ' + Math.abs(mod)) : ''}`;

    if (sides === 20 && rolls.includes(20)) { isCrit = true; playFX('crit'); }
    else if (sides === 20 && rolls.includes(1)) { isFumble = true; playFX('fumble'); }
    else playFX('sword');
  }

  const banner = document.getElementById('dice-banner');
  if (banner) {
    banner.style.display = 'block';
    document.getElementById('dice-total-number').innerText = total;
    document.getElementById('dice-breakdown-text').innerText = breakdown;
  }

  showLiveDiceRoll(`🎲 Rolagem de Dado (d${sides})`, total, breakdown, isCrit, isFumble);
  addLog(`🎲 Rolagem: <b>${total}</b> (${breakdown})`);
}

// --- ROLAGEM RÁPIDA DE ATAQUES E AÇÕES DE MONSTROS ---
function parseAndRenderMonsterActions(rawActions, monsterName = '', combatantId = '') {
  if (!rawActions) return '<div style="color: var(--text-dim); font-style: italic;">Nenhuma ação cadastrada.</div>';

  const chunks = rawActions.split(/(?:\r?\n)+|[•]\s+/).map(s => s.trim()).filter(Boolean);
  if (chunks.length === 0) return `<div>${rawActions}</div>`;

  return `
    <div style="display: flex; flex-direction: column; gap: 6px;">
      ${chunks.map(chunk => {
        const hitMatch = chunk.match(/([+-]\d+)\s*(?:para acertar|de bônus|to hit|\))/i) || chunk.match(/(?:Ataque|Bônus|Acerto)[^\d+-]*?([+-]\d+)/i);
        const dmgMatch = chunk.match(/(\d+d\d+(?:\s*[+-]\s*\d+)?)/i);
        
        let atkName = 'Ataque';
        const nameMatch = chunk.match(/^([A-Za-zÀ-ÿ0-9\s]+?)(?:\.|\:|\(|\-)/);
        if (nameMatch && nameMatch[1].trim().length < 35) {
          atkName = nameMatch[1].trim();
        }

        const hitBonus = hitMatch ? parseInt(hitMatch[1], 10) : 0;
        const dmgFormula = dmgMatch ? dmgMatch[1].replace(/\s+/g, '') : '';
        const hasRoll = dmgFormula || hitMatch;

        const safeAtkName = atkName.replace(/'/g, "\\'");
        const safeDmgFormula = dmgFormula.replace(/'/g, "\\'");
        const safeMonName = (monsterName || '').replace(/'/g, "\\'");
        const safeCombId = (combatantId || '').replace(/'/g, "\\'");

        return `
          <div style="background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.07); border-radius: 6px; padding: 6px 8px; display: flex; flex-direction: column; gap: 4px;">
            <div style="font-size: 11.5px; color: #e2e8f0; line-height: 1.35;">
              ${chunk.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')}
            </div>
            ${hasRoll ? `
              <div style="display: flex; gap: 6px; align-items: center; margin-top: 2px;">
                <button class="btn-monster-atk" onclick="rollMonsterAttackAction('${safeAtkName}', ${hitBonus}, '${safeDmgFormula}', '${safeMonName}', '${safeCombId}')">
                  🎲 Rolar ${atkName} (${hitBonus >= 0 ? '+' + hitBonus : hitBonus}${dmgFormula ? ' • ' + dmgFormula : ''})
                </button>
              </div>
            ` : ''}
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function rollMonsterAttackAction(atkName, toHitBonus, dmgFormula, monName = 'Monstro', combatantId = '') {
  const d20 = Math.floor(Math.random() * 20) + 1;
  const totalHit = d20 + (toHitBonus || 0);
  const isCrit = d20 === 20;
  const isFumble = d20 === 1;

  let dmgTotal = 0;
  let dmgBreakdown = '';
  if (dmgFormula && dmgFormula.includes('d')) {
    const parts = dmgFormula.toLowerCase().split(/[+-]/);
    const dicePart = parts[0];
    const mod = dmgFormula.includes('+') ? parseInt(dmgFormula.split('+')[1], 10) : (dmgFormula.includes('-') ? -parseInt(dmgFormula.split('-')[1], 10) : 0);
    let [count, sides] = dicePart.split('d').map(x => parseInt(x, 10));
    count = count || 1;
    sides = sides || 6;
    if (isCrit) count *= 2;

    const rolls = [];
    for (let i = 0; i < count; i++) {
      const r = Math.floor(Math.random() * sides) + 1;
      rolls.push(r);
      dmgTotal += r;
    }
    dmgTotal = Math.max(1, dmgTotal + mod);
    dmgBreakdown = `${count}d${sides} [${rolls.join(', ')}] ${mod !== 0 ? (mod > 0 ? '+ ' + mod : '- ' + Math.abs(mod)) : ''} = ${dmgTotal}`;
  }

  const inpDmg = document.getElementById('inp-damage');
  if (inpDmg && dmgTotal > 0) {
    inpDmg.value = dmgTotal;
  }
  const selAttacker = document.getElementById('sel-attacker');
  if (selAttacker && combatantId) {
    selAttacker.value = combatantId;
  }

  if (isCrit) {
    if (typeof playFX === 'function') playFX('crit');
  } else if (isFumble) {
    if (typeof playFX === 'function') playFX('fumble');
  } else {
    if (typeof playFX === 'function') playFX('sword');
  }

  const hitStr = `d20 [${d20}] ${toHitBonus >= 0 ? '+' + toHitBonus : toHitBonus} = <b>${totalHit}</b>${isCrit ? ' 🔥 (CRÍTICO!)' : (isFumble ? ' 💀 (FALHA CRÍTICA!)' : '')}`;
  const logMsg = `🐉 <b>${monName}</b> usou <b>${atkName}</b> ➔ Ataque: ${hitStr}${dmgTotal > 0 ? ` | Dano: <b>${dmgTotal}</b> (${dmgBreakdown})` : ''}`;
  
  if (typeof addLog === 'function') addLog(logMsg);
  if (typeof showLiveDiceRoll === 'function') {
    showLiveDiceRoll(`🐉 ${monName} - ${atkName}`, totalHit, `Ataque: ${hitStr} | Dano: ${dmgTotal}`, isCrit, isFumble);
  }
}
