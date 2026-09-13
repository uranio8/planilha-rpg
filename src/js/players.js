let activePortalPlayerId = null;

function getPlayerCarryCapacity(p) {
  const str = p.str || 10;
  const maxKg = Math.round(str * 7.5 * 10) / 10;
  const heavyKg = Math.round(str * 2.5 * 10) / 10;
  
  let itemsWeight = 0;
  if (p.inventory && Array.isArray(p.inventory)) {
    p.inventory.forEach(it => {
      itemsWeight += (parseFloat(it.weight) || 0) * (parseInt(it.qty) || 1);
    });
  }
  
  // Moedas: 50 moedas = 0.5 kg (ou seja, 1 moeda = 0.01 kg)
  const coins = p.coins || { cp: 0, sp: 0, ep: 0, gp: p.gold || 0, pp: 0 };
  const totalCoins = (coins.cp || 0) + (coins.sp || 0) + (coins.ep || 0) + (coins.gp || 0) + (coins.pp || 0);
  const coinsWeight = Math.round((totalCoins * 0.01) * 10) / 10;
  
  const totalWeight = Math.round((itemsWeight + coinsWeight) * 10) / 10;
  const pct = Math.min(100, Math.max(0, Math.round((totalWeight / maxKg) * 100)));
  const isEncumbered = totalWeight > heavyKg;
  const isOverloaded = totalWeight > maxKg;

  return {
    totalWeight,
    itemsWeight: Math.round(itemsWeight * 10) / 10,
    coinsWeight,
    maxKg,
    heavyKg,
    pct,
    isEncumbered,
    isOverloaded
  };
}

function getPlayerCoinPurse(p) {
  p.coins = p.coins || { cp: 0, sp: 0, ep: 0, gp: p.gold || 0, pp: 0 };
  const totalGp = (p.coins.cp || 0) / 100 + (p.coins.sp || 0) / 10 + (p.coins.ep || 0) / 2 + (p.coins.gp || 0) + (p.coins.pp || 0) * 10;
  p.gold = Math.floor(totalGp);
  return {
    coins: p.coins,
    totalGp: Math.round(totalGp * 100) / 100
  };
}

function getPlayerXpProgress(p) {
  const lvl = Math.min(20, Math.max(1, p.level || 1));
  const currentFloor = (typeof DND5E_XP_TABLE !== 'undefined' ? DND5E_XP_TABLE[lvl - 1] : 0) || 0;
  const nextTarget = (typeof DND5E_XP_TABLE !== 'undefined' && DND5E_XP_TABLE[lvl] !== undefined) ? DND5E_XP_TABLE[lvl] : null;
  const currentXp = p.xp || 0;

  if (lvl >= 20 || nextTarget === null) {
    return {
      current: currentXp,
      target: currentFloor,
      nextTarget: currentFloor,
      pct: 100,
      isMax: true,
      text: `Nv 20 (Nível Máximo) • ${currentXp} XP`
    };
  }

  const span = Math.max(1, nextTarget - currentFloor);
  const progressInLevel = Math.max(0, currentXp - currentFloor);
  const pct = Math.min(100, Math.max(0, Math.round((progressInLevel / span) * 100)));

  return {
    current: currentXp,
    target: currentFloor,
    nextTarget,
    pct,
    isMax: false,
    text: `XP: ${currentXp} / ${nextTarget} (${pct}% para Nv ${lvl + 1})`
  };
}

function addPlayerXpPrompt(id) {
  const p = PLAYERS.find(x => x.id === id);
  if (!p) return;
  const val = prompt(`Adicionar XP para ${p.name} (Atual: ${p.xp || 0} XP):`, '100');
  if (val !== null) {
    const addXp = parseInt(val) || 0;
    if (addXp !== 0) {
      p.xp = Math.max(0, (p.xp || 0) + addXp);
      addLog(`✨ <b>${p.name}</b> recebeu ${addXp > 0 ? '+' : ''}${addXp} XP (Total: ${p.xp} XP)!`);
      addPlayerActionLog(p.id, '✨', `Ganhou ${addXp > 0 ? '+' : ''}${addXp} XP (Total: ${p.xp} XP)`, 'xp');

      const nextLvlTarget = typeof DND5E_XP_TABLE !== 'undefined' ? DND5E_XP_TABLE[p.level] : null;
      if (nextLvlTarget && p.xp >= nextLvlTarget && p.level < 20) {
        if (typeof playFX === 'function') playFX('crit');
        addLog(`🎉 <b>${p.name} acumulou XP suficiente para o Nível ${p.level + 1}!</b>`);
      }

      renderPlayers();
      saveToLocalStorage();
    }
  }
}

function addPlayerActionLog(id, icon, text, type = 'general') {
  const p = PLAYERS.find(x => x.id === id);
  if (!p) return;
  if (!p.actionLogs) p.actionLogs = [];
  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  p.actionLogs.unshift({
    timestamp: timeStr,
    icon: icon || '⚡',
    text,
    type
  });
  if (p.actionLogs.length > 30) p.actionLogs.pop();
  saveToLocalStorage();
}

function clearPlayerActionLogs(id) {
  const p = PLAYERS.find(x => x.id === id);
  if (!p) return;
  p.actionLogs = [];
  renderPlayers();
  saveToLocalStorage();
}

let playerNotesDebounceTimer = null;
function handlePlayerNotesInput(id, text) {
  const p = PLAYERS.find(x => x.id === id);
  if (!p) return;
  p.playerNotes = text;

  const statusEl = document.getElementById(`notes-status-${id}`);
  if (statusEl) {
    statusEl.innerText = '💾 Salvando...';
    statusEl.style.color = 'var(--primary-light)';
  }

  if (playerNotesDebounceTimer) clearTimeout(playerNotesDebounceTimer);
  playerNotesDebounceTimer = setTimeout(() => {
    saveToLocalStorage();
    if (statusEl) {
      statusEl.innerText = '✅ Salvo';
      statusEl.style.color = 'var(--accent-green)';
      setTimeout(() => {
        if (statusEl) {
          statusEl.innerText = 'Salvo automaticamente';
          statusEl.style.color = 'var(--text-muted)';
        }
      }, 1500);
    }
  }, 400);
}

function renderPlayers() {
  const grid = document.getElementById('grid-players');
  const badge = document.getElementById('cnt-players');
  const rawQ = document.getElementById('filter-player-q')?.value || '';
  const q = typeof normalizeStr === 'function' ? normalizeStr(rawQ) : rawQ.toLowerCase().trim();
  const sort = document.getElementById('filter-player-sort')?.value || 'name';

  let filtered = PLAYERS.filter(p => {
    if (activePortalPlayerId && p.id !== activePortalPlayerId) return false;
    if (!q) return true;
    const pName = typeof normalizeStr === 'function' ? normalizeStr(p.name) : (p.name || '').toLowerCase();
    const pStudent = typeof normalizeStr === 'function' ? normalizeStr(p.student) : (p.student || '').toLowerCase();
    const pClass = typeof normalizeStr === 'function' ? normalizeStr(p.className) : (p.className || '').toLowerCase();
    const pRace = typeof normalizeStr === 'function' ? normalizeStr(p.race) : (p.race || '').toLowerCase();
    return pName.includes(q) || pStudent.includes(q) || pClass.includes(q) || pRace.includes(q);
  });

  if (sort === 'name') filtered.sort((a, b) => a.name.localeCompare(b.name));
  else if (sort === 'student') filtered.sort((a, b) => a.student.localeCompare(b.student));
  else if (sort === 'level') filtered.sort((a, b) => b.level - a.level);
  else if (sort === 'hp') filtered.sort((a, b) => (b.hp / b.maxHp) - (a.hp / a.maxHp));

  if (badge) badge.innerText = filtered.length;
  if (!grid) return;

  grid.innerHTML = filtered.map(p => {
    const prof = getProfBonus(p.level);
    const wisMod = Math.floor((p.wis - 10) / 2);
    const dexMod = Math.floor((p.dex - 10) / 2);
    const passPerc = 10 + wisMod;
    const activeTab = p.activeCardTab || 'attacks';

    // Normaliza slots e dados
    p.slots = p.slots || [0, 0, 0, 0, 0];
    p.slotsUsed = p.slotsUsed || [0, 0, 0, 0, 0];
    p.deathSaves = p.deathSaves || { success: 0, fail: 0 };
    p.tempHp = p.tempHp || 0;
    p.gold = p.gold || 0;
    p.coins = p.coins || { cp: 0, sp: 0, ep: 0, gp: p.gold || 0, pp: 0 };
    p.inventory = p.inventory || [];
    p.conditions = p.conditions || [];
    p.avatar = p.avatar || '👤';
    p.skillProficiencies = p.skillProficiencies || [];
    p.saveProficiencies = p.saveProficiencies || [];
    p.actionLogs = p.actionLogs || [];
    p.playerNotes = p.playerNotes !== undefined ? p.playerNotes : '';

    const carry = getPlayerCarryCapacity(p);
    const purse = getPlayerCoinPurse(p);

    // M3: Inicialização e automação de cargas de habilidades
    initPlayerFeatureCharges(p);

    const hpPct = Math.max(0, Math.min(100, Math.round((p.hp / p.maxHp) * 100)));
    const hpColor = hpPct > 50 ? 'var(--accent-green)' : (hpPct > 25 ? '#eab308' : 'var(--accent-red)');
    const isDown = p.hp <= 0;
    const xpInfo = getPlayerXpProgress(p);

    // Avatar visual
    const avatarDisplay = (p.avatar && (p.avatar.startsWith('data:image') || p.avatar.startsWith('http')))
      ? `<img src="${p.avatar}" class="player-avatar-img" alt="${p.name}">`
      : `<span class="player-avatar-emoji">${p.avatar || '👤'}</span>`;

    // Slots de magia
    const hasSpellSlots = p.slots.some(s => s > 0);
    let slotsHtml = '';
    if (hasSpellSlots) {
      slotsHtml = `
        <div class="slots-grid">
          ${p.slots.map((maxSlots, lvlIdx) => {
            if (maxSlots <= 0) return '';
            const used = p.slotsUsed[lvlIdx] || 0;
            let bubbles = '';
            for (let i = 0; i < maxSlots; i++) {
              const isUsed = i < used;
              bubbles += `<div class="slot-bubble ${isUsed ? 'used' : ''}" title="${isUsed ? 'Gasto (clique para restaurar)' : 'Disponível (clique para gastar)'}" onclick="togglePlayerSlot('${p.id}', ${lvlIdx}, ${i})"></div>`;
            }
            return `
              <div class="slot-row">
                <span class="slot-label">${lvlIdx + 1}º Círculo (${maxSlots - used}/${maxSlots})</span>
                <div class="slot-bubbles">${bubbles}</div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    }

    // M3: Feature charges UI
    let featureChargesHtml = '';
    if (p.featureCharges && p.featureCharges.length > 0) {
      featureChargesHtml = `
        <div class="player-charges-container" style="margin-top: 8px; padding-top: 6px; border-top: 1px dashed rgba(255,255,255,0.08);">
          <div style="font-size: 10px; font-weight: 700; color: var(--primary-light); text-transform: uppercase; margin-bottom: 4px; display: flex; justify-content: space-between;">
            <span>⚡ Habilidades & Cargas (M3):</span>
          </div>
          <div style="display: flex; flex-direction: column; gap: 4px;">
            ${p.featureCharges.map(f => {
              const remaining = f.max - f.used;
              if (f.max > 10) {
                return `
                  <div class="charge-row-counter" style="display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.25); padding: 3px 6px; border-radius: 4px; font-size: 11px;">
                    <span style="color: #e2e8f0;">${f.icon || '⚡'} <b>${f.name}</b> <small style="color: var(--text-muted);">(${f.restType === 'short' ? 'Curto' : 'Longo'})</small></span>
                    <div style="display: flex; align-items: center; gap: 3px;">
                      <button class="btn-micro" onclick="usePlayerFeatureCharge('${p.id}', '${f.id}', 5)" title="Gastar 5">-5</button>
                      <button class="btn-micro" onclick="usePlayerFeatureCharge('${p.id}', '${f.id}', 1)" title="Gastar 1">-1</button>
                      <span style="font-weight: 800; min-width: 32px; text-align: center; color: ${remaining > 0 ? 'var(--accent-green)' : 'var(--accent-red)'};">${remaining}/${f.max}</span>
                      <button class="btn-micro" onclick="restorePlayerFeatureCharge('${p.id}', '${f.id}', 1)" title="Recuperar 1">+1</button>
                      <button class="btn-micro" onclick="restorePlayerFeatureCharge('${p.id}', '${f.id}', 5)" title="Recuperar 5">+5</button>
                    </div>
                  </div>
                `;
              }
              let bubbles = '';
              for (let i = 0; i < f.max; i++) {
                const isUsed = i < f.used;
                bubbles += `<div class="slot-bubble charge-bubble ${isUsed ? 'used' : ''}" title="${isUsed ? 'Gasto (clique para restaurar 1)' : 'Disponível (clique para gastar 1)'}" onclick="${isUsed ? `restorePlayerFeatureCharge('${p.id}', '${f.id}', 1)` : `usePlayerFeatureCharge('${p.id}', '${f.id}', 1)`}"></div>`;
              }
              return `
                <div class="slot-row" style="margin-bottom: 2px;">
                  <span class="slot-label" style="font-size: 10px; color: #cbd5e1;">${f.icon || '⚡'} ${f.name} <small style="color: var(--text-muted);">(${f.restType === 'short' ? 'Curto' : 'Longo'})</small></span>
                  <div class="slot-bubbles">${bubbles}</div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }

    // Death Saves (se tiver 0 PV)
    let deathSavesHtml = '';
    if (isDown) {
      deathSavesHtml = `
        <div class="death-saves-box">
          <div>
            <span style="font-weight: 700; color: #f87171; display: block; font-size: 10px; text-transform: uppercase;">💀 Testes contra a Morte</span>
            <div style="display: flex; gap: 10px; margin-top: 4px; align-items: center;">
              <span style="font-size: 10px; color: var(--accent-green);">Sucessos:</span>
              <div class="save-dots">
                <div class="save-dot ${p.deathSaves.success >= 1 ? 'success' : ''}" onclick="toggleDeathSave('${p.id}', 'success', 1)"></div>
                <div class="save-dot ${p.deathSaves.success >= 2 ? 'success' : ''}" onclick="toggleDeathSave('${p.id}', 'success', 2)"></div>
                <div class="save-dot ${p.deathSaves.success >= 3 ? 'success' : ''}" onclick="toggleDeathSave('${p.id}', 'success', 3)"></div>
              </div>
            </div>
            <div style="display: flex; gap: 10px; margin-top: 2px; align-items: center;">
              <span style="font-size: 10px; color: var(--accent-red);">Falhas:</span>
              <div class="save-dots">
                <div class="save-dot ${p.deathSaves.fail >= 1 ? 'failure' : ''}" onclick="toggleDeathSave('${p.id}', 'fail', 1)"></div>
                <div class="save-dot ${p.deathSaves.fail >= 2 ? 'failure' : ''}" onclick="toggleDeathSave('${p.id}', 'fail', 2)"></div>
                <div class="save-dot ${p.deathSaves.fail >= 3 ? 'failure' : ''}" onclick="toggleDeathSave('${p.id}', 'fail', 3)"></div>
              </div>
            </div>
          </div>
          <button class="btn-action" style="padding: 5px 10px; font-size: 11px;" onclick="rollPlayerDeathSave('${p.id}')">🎲 Rolar Salvação</button>
        </div>
      `;
    }

    // Ataques formatados
    const rawAttacks = p.attacks || '';
    const attacksArray = (rawAttacks.includes('|') ? rawAttacks.split('|') : rawAttacks.split(/(?<=\)),/g))
      .map(a => a.trim())
      .filter(a => a);

    const attacksHtml = attacksArray.map(att => `
      <div class="attack-item-row">
        <span class="attack-info">⚔️ ${att}</span>
        <button class="btn-action" style="padding: 4px 10px; font-size: 11px; white-space: nowrap;" onclick="rollPlayerAttack('${p.id}', '${att.replace(/'/g, "\\'")}')">🎲 Rolar</button>
      </div>
    `).join('');

    return `
      <div class="player-card ${activePortalPlayerId && p.id === activePortalPlayerId ? 'portal-view' : ''}">
        <div class="player-card-top">
          <div class="player-title-row">
            <div style="display: flex; align-items: center; gap: 10px;">
              <div class="player-avatar-badge" onclick="openAvatarModal('${p.id}')" title="Alterar Avatar / Imagem">
                ${avatarDisplay}
                <span class="avatar-edit-overlay">✏️</span>
              </div>
              <div class="player-title">
                <span>${p.name}</span>
                <span class="badge badge-src">Nv ${p.level}</span>
              </div>
            </div>
            <div style="display: flex; gap: 4px; align-items: center;">
              <button class="btn-insp ${p.inspiration ? 'active' : ''}" onclick="togglePlayerInspiration('${p.id}')" title="Alternar Inspiração Heroica (D&D 5E/2024)">
                ⭐ Inspiração
              </button>
              ${p.inspiration ? `
                <button class="btn-action btn-insp-roll" style="padding: 4px 8px; font-size: 10px; background: linear-gradient(135deg, #d97706, #b45309); border: 1px solid #f59e0b; color: #fff; font-weight: 700; border-radius: 4px;" onclick="usePlayerInspirationRoll('${p.id}')" title="Rolar Teste com VANTAGEM (D&D 2024) e consumir Inspiração">
                  🎲 Vantagem
                </button>
              ` : ''}
            </div>
          </div>

          <div class="player-meta">
            👤 <b>${p.student}</b> • <span style="color: #cbd5e1;">${p.race}</span> • <span style="color: var(--primary-light);">${p.className}</span>
          </div>

          <!-- V4: BARRA DE EXPERIÊNCIA (XP) ANIMADA -->
          <div class="player-xp-container">
            <div class="player-xp-header">
              <span style="color: #cbd5e1; font-weight: 700;">✨ ${xpInfo.text}</span>
              <button class="btn-xp-quick" onclick="addPlayerXpPrompt('${p.id}')" title="Adicionar Pontos de Experiência">+ XP</button>
            </div>
            <div class="player-xp-bar-bg">
              <div class="player-xp-bar-fill" style="width: ${xpInfo.pct}%;"></div>
            </div>
          </div>

          ${(p.badges && p.badges.length > 0) ? `
            <div style="display: flex; flex-wrap: wrap; gap: 4px; margin-top: 4px;">
              ${p.badges.map(b => `<span class="achievement-tag">${b}</span>`).join('')}
            </div>
          ` : ''}

          <div class="player-toolbar">
            <button class="btn-action" style="padding: 5px 12px; font-size: 11px; font-weight: 700;" onclick="addPlayerToCombat('${p.id}')" title="Adicionar este jogador ao combate ativo">
              ⚔️ Combate
            </button>
            <button class="btn-levelup-trigger" onclick="openLevelUpWizard('${p.id}')" title="Assistente de Subir de Nível e Multiclasse">
              🔼 Subir Nível
            </button>
            <div class="player-actions-group">
              <button class="btn-secondary" style="padding: 5px 7px; font-size: 11px; color: var(--primary-light); border-color: rgba(245, 158, 11, 0.4);" onclick="openSharePlayerModal('${p.id}')" title="Compartilhar Ficha com o Jogador (Link & QR Code)">📱 QR Code</button>
              <button class="btn-secondary" style="padding: 5px 7px; font-size: 11px;" onclick="playerShortRest('${p.id}')" title="Descanso Curto (1h)">☕ Curto</button>
              <button class="btn-secondary" style="padding: 5px 7px; font-size: 11px;" onclick="playerLongRest('${p.id}')" title="Descanso Longo (8h)">🌙 Longo</button>
              <button class="btn-secondary" style="padding: 5px 7px; font-size: 11px;" onclick="clonePlayerSheet('${p.id}')" title="Duplicar / Clonar esta Ficha">📋 Clonar</button>
              <button class="btn-secondary" style="padding: 5px 7px; font-size: 11px;" onclick="printPlayerSheet('${p.id}')" title="Gerar Ficha Limpa para Impressão A4">🖨️ Imprimir</button>
              <button class="btn-secondary" style="padding: 5px 7px; font-size: 11px;" onclick="openPlayerModal('${p.id}')" title="Editar Ficha Completa">✏️ Editar</button>
              <button class="btn-secondary" style="padding: 5px 7px; font-size: 11px; color: #f87171; border-color: rgba(248, 113, 113, 0.3);" onclick="deletePlayerDirect('${p.id}')" title="Excluir Ficha Permanentemente">🗑️</button>
            </div>
          </div>
        </div>

        <!-- CORPO DA FICHA EM GRID MULTI-COLUNAS -->
        <div class="player-sheet-grid">
          <!-- COLUNA 1: VITALIDADE, DEFESAS, ATRIBUTOS & SALVAGUARDAS -->
          <div class="player-col-vital">
            <div class="hp-section">
              <div class="hp-header-row">
                <div class="hp-val-display">
                  <span style="font-size: 10px; font-weight: 800; color: var(--text-dim); text-transform: uppercase;">PONTOS DE VIDA:</span>
                  <span class="hp-current" style="color: ${hpColor};">${p.hp}</span>
                  <span class="hp-max">/ ${p.maxHp} PV</span>
                  ${p.tempHp > 0 ? `<span class="hp-temp-badge">+${p.tempHp} Temp</span>` : ''}
                </div>

                <div class="hp-btn-group">
                  <button class="btn-hp-adj minus" onclick="adjustPlayerHp('${p.id}', -5)">-5</button>
                  <button class="btn-hp-adj minus" onclick="adjustPlayerHp('${p.id}', -1)">-1</button>
                  <button class="btn-hp-adj plus" onclick="adjustPlayerHp('${p.id}', 1)">+1</button>
                  <button class="btn-hp-adj plus" onclick="adjustPlayerHp('${p.id}', 5)">+5</button>
                  <button class="btn-secondary" style="padding: 4px 7px; font-size: 10px;" onclick="setPlayerTempHp('${p.id}')" title="Definir PV Temporários">🛡️ Temp</button>
                  <button class="btn-secondary" style="padding: 4px 7px; font-size: 10px; color: var(--accent-green);" onclick="adjustPlayerHp('${p.id}', ${p.maxHp})" title="Cura Total">💖 Full</button>
                  <button class="btn-secondary" style="padding: 4px 7px; font-size: 10px; border-color: #d97706; color: #fbbf24;" onclick="openShortRestModal('${p.id}')" title="Descanso Curto (Gastar Dados de Vida e recuperar habilidades)">🏕️ Curto</button>
                  <button class="btn-secondary" style="padding: 4px 7px; font-size: 10px; color: #a78bfa;" onclick="playerLongRest('${p.id}')" title="Descanso Longo (8h - Recupera PV total, magias e todas as cargas)">🌙 Longo</button>
                </div>
              </div>

              <div class="hp-bar-bg" style="height: 8px;">
                <div class="hp-bar-fill" style="width: ${hpPct}%; background-color: ${hpColor};"></div>
              </div>

              ${deathSavesHtml}

              <!-- SEÇÃO DE CONDIÇÕES & STATUS (M2) -->
              <div class="player-conditions-box">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                  <span style="font-size: 10px; font-weight: 800; color: var(--text-dim); text-transform: uppercase;">Condições & Status:</span>
                  <button class="btn-secondary" style="font-size: 10px; padding: 2px 6px;" onclick="openPlayerCondModal('${p.id}')">➕ Alterar Status</button>
                </div>
                <div class="player-conds-chips">
                  ${(p.conditions && p.conditions.length > 0) ? p.conditions.map(cId => {
                    const condObj = (typeof CONDITIONS_LIST !== 'undefined' ? CONDITIONS_LIST.find(c => c.id === cId) : null) || { name: cId, desc: '' };
                    return `<span class="player-cond-chip" onclick="togglePlayerCondition('${p.id}', '${cId}')" title="${escapeAttr(condObj.desc || '')} • Clique para remover">${condObj.name} ✕</span>`;
                  }).join('') : '<span style="color: var(--text-dim); font-size: 10px; font-style: italic;">Normal (Sem condições)</span>'}
                </div>
              </div>
            </div>

            <div class="stat-chips-grid">
              <div class="stat-chip"><span class="stat-chip-label">CA</span><span class="stat-chip-val">${p.ac}</span></div>
              <div class="stat-chip"><span class="stat-chip-label">Profic.</span><span class="stat-chip-val" style="color: var(--primary);">+${prof}</span></div>
              <div class="stat-chip"><span class="stat-chip-label">Iniciat.</span><span class="stat-chip-val" style="color: var(--accent-blue);">${dexMod >= 0 ? '+' + dexMod : dexMod}</span></div>
              <div class="stat-chip"><span class="stat-chip-label">Desloc.</span><span class="stat-chip-val" style="font-size: 12px;">${p.speed}</span></div>
              <div class="stat-chip"><span class="stat-chip-label">Percep. Pass.</span><span class="stat-chip-val">${passPerc}</span></div>
            </div>

            <div class="attrs-chips-grid">
              <button class="attr-btn" onclick="rollPlayerAttr('${p.id}', 'str')" title="Clique para rolar teste de Força">
                <span class="attr-name">FOR</span>
                <span class="attr-mod">${getMod(p.str)}</span>
                <span class="attr-raw">${p.str}</span>
              </button>
              <button class="attr-btn" onclick="rollPlayerAttr('${p.id}', 'dex')" title="Clique para rolar teste de Destreza">
                <span class="attr-name">DES</span>
                <span class="attr-mod">${getMod(p.dex)}</span>
                <span class="attr-raw">${p.dex}</span>
              </button>
              <button class="attr-btn" onclick="rollPlayerAttr('${p.id}', 'con')" title="Clique para rolar teste de Constituição">
                <span class="attr-name">CON</span>
                <span class="attr-mod">${getMod(p.con)}</span>
                <span class="attr-raw">${p.con}</span>
              </button>
              <button class="attr-btn" onclick="rollPlayerAttr('${p.id}', 'int')" title="Clique para rolar teste de Inteligência">
                <span class="attr-name">INT</span>
                <span class="attr-mod">${getMod(p.int)}</span>
                <span class="attr-raw">${p.int}</span>
              </button>
              <button class="attr-btn" onclick="rollPlayerAttr('${p.id}', 'wis')" title="Clique para rolar teste de Sabedoria">
                <span class="attr-name">SAB</span>
                <span class="attr-mod">${getMod(p.wis)}</span>
                <span class="attr-raw">${p.wis}</span>
              </button>
              <button class="attr-btn" onclick="rollPlayerAttr('${p.id}', 'cha')" title="Clique para rolar teste de Carisma">
                <span class="attr-name">CAR</span>
                <span class="attr-mod">${getMod(p.cha)}</span>
                <span class="attr-raw">${p.cha}</span>
              </button>
            </div>

            <!-- SALVAGUARDAS RÁPIDAS NO NÚCLEO -->
            <div class="player-saves-card-box">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                <span style="font-size: 10px; font-weight: 800; color: var(--text-dim); text-transform: uppercase;">🛡️ Salvaguardas & Resistências:</span>
                <button class="btn-secondary" style="font-size: 9px; padding: 2px 6px;" onclick="openPlayerSkillsModal('${p.id}')">⚙️ Editar</button>
              </div>
              <div class="saves-card-bar">
                ${['str', 'dex', 'con', 'int', 'wis', 'cha'].map(attrKey => {
                  const attrNames = { str: 'FOR', dex: 'DES', con: 'CON', int: 'INT', wis: 'SAB', cha: 'CAR' };
                  const isProf = (p.saveProficiencies || []).includes(attrKey);
                  const baseMod = Math.floor(((p[attrKey] || 10) - 10) / 2);
                  const totalMod = baseMod + (isProf ? prof : 0);
                  const modStr = totalMod >= 0 ? '+' + totalMod : `${totalMod}`;
                  return `
                    <div class="save-card-chip ${isProf ? 'prof' : ''}" onclick="rollPlayerSavingThrow('${p.id}', '${attrKey}')" title="Rolar Salvaguarda de ${attrNames[attrKey]} (${modStr})${isProf ? ' • Proficiente' : ''}">
                      <div class="save-chip-name">${attrNames[attrKey]} ${isProf ? '<span class="save-prof-dot"></span>' : ''}</div>
                      <div class="save-chip-val">${modStr}</div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          </div>

          <!-- COLUNA 2: ARSENAL, PODERES & MAGIAS -->
          <div class="player-col-powers">
            ${slotsHtml}
            ${featureChargesHtml}

            <div class="powers-section-box">
              <div class="powers-section-header">
                <span>⚔️ Ataques & Arsenal</span>
              </div>
              <div style="display: flex; flex-direction: column; gap: 4px;">
                ${attacksHtml || '<div style="color: var(--text-dim); font-size: 11px; padding: 6px;">Nenhum ataque configurado.</div>'}
              </div>
            </div>

            <div class="powers-section-box">
              <div class="powers-section-header">
                <span>🔮 Magias Preparadas (${(p.preparedSpells || []).length})</span>
                <button class="btn-secondary" style="font-size: 10px; padding: 2px 6px;" onclick="openSpellPickerModal('${p.id}')">📖 Escolher</button>
              </div>
              ${(p.preparedSpells && p.preparedSpells.length > 0) ? `
                <div class="player-spells-chips-grid">
                  ${p.preparedSpells.map(sName => {
                    const sp = typeof SPELLS_DATA !== 'undefined' ? SPELLS_DATA.find(s => s.name.toLowerCase() === sName.toLowerCase()) : null;
                    const lvlBadge = sp ? (sp.level === 0 ? 'Truque' : `${sp.level}º Círc.`) : 'Magia';
                    const school = sp ? sp.school : '';
                    return `
                      <div class="spell-action-chip" onclick="castPlayerSpellPrompt('${p.id}', '${escapeAttr(sName)}')" title="Clique para conjurar ${escapeAttr(sName)}">
                        <div class="spell-chip-top">
                          <span class="spell-chip-name">${sName}</span>
                          <span class="spell-chip-lvl ${sp && sp.level === 0 ? 'cantrip' : ''}">${lvlBadge}</span>
                        </div>
                        <div class="spell-chip-meta">${school ? school + ' • ' : ''}${sp ? sp.range : ''} ➔ <b>⚡ Lançar</b></div>
                      </div>
                    `;
                  }).join('')}
                </div>
              ` : `
                <div style="background: rgba(0,0,0,0.25); border: 1px dashed var(--border-color); padding: 8px; border-radius: 6px; text-align: center; color: var(--text-muted); font-size: 11px;">
                  Nenhuma magia preparada.<br>
                  <button class="btn-action" style="font-size: 10px; margin-top: 4px; padding: 3px 8px;" onclick="openSpellPickerModal('${p.id}')">✨ Escolher Magias</button>
                </div>
              `}
              ${p.spells ? `<div style="font-size: 10px; color: var(--text-dim); margin-top: 4px; line-height: 1.4; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 3px;"><b>Anotações:</b> ${p.spells}</div>` : ''}
            </div>

            <div class="powers-section-box">
              <div class="powers-section-header">
                <span>📜 Traços & Habilidades</span>
              </div>
              <div style="display: flex; flex-direction: column; gap: 4px; max-height: 250px; overflow-y: auto; padding-right: 2px;">
                ${renderPlayerUnlockedFeatures(p)}
              </div>
              ${p.features ? `<div style="font-size: 10px; color: var(--text-dim); margin-top: 4px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 3px;"><b>Outros Traços:</b> ${p.features}</div>` : ''}
            </div>
          </div>

          <!-- COLUNA 3: PERÍCIAS, MOCHILA, ORIGEM & HISTÓRICO -->
          <div class="player-col-utility">
            <div class="player-tab-nav">
              <button class="p-tab-btn ${activeTab === 'skills' ? 'active' : ''}" onclick="switchPlayerCardTab('${p.id}', 'skills')">🎯 Perícias (${(p.skillProficiencies || []).length})</button>
              <button class="p-tab-btn ${activeTab === 'inventory' ? 'active' : ''}" onclick="switchPlayerCardTab('${p.id}', 'inventory')">🎒 Mochila/PO</button>
              <button class="p-tab-btn ${activeTab === 'background' ? 'active' : ''}" onclick="switchPlayerCardTab('${p.id}', 'background')">📖 Origem</button>
              <button class="p-tab-btn ${activeTab === 'history' ? 'active' : ''}" onclick="switchPlayerCardTab('${p.id}', 'history')">⏳ Histórico (${(p.actionLogs || []).length})</button>
              <button class="p-tab-btn ${activeTab === 'notes' ? 'active' : ''}" onclick="switchPlayerCardTab('${p.id}', 'notes')">📝 Notas</button>
            </div>

            <!-- ABA: PERÍCIAS -->
            <div class="p-tab-content ${activeTab === 'skills' ? 'active' : ''}">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                <span style="font-size: 11px; font-weight: 800; color: var(--primary-light);">🎯 Perícias D&D 5E (Profic: +${prof})</span>
                <button class="btn-secondary" style="font-size: 9px; padding: 2px 6px;" onclick="openPlayerSkillsModal('${p.id}')">⚙️ Proficiências</button>
              </div>
              <div class="skills-card-grid">
                ${(typeof DND5E_SKILLS !== 'undefined' ? DND5E_SKILLS : []).map(sk => {
                  const isProf = (p.skillProficiencies || []).includes(sk.key);
                  const baseMod = Math.floor(((p[sk.attr] || 10) - 10) / 2);
                  const totalMod = baseMod + (isProf ? prof : 0);
                  const modStr = totalMod >= 0 ? '+' + totalMod : `${totalMod}`;
                  return `
                    <div class="skill-card-item ${isProf ? 'prof' : ''}">
                      <div class="skill-card-name">
                        ${isProf ? '<span style="color:var(--primary); font-size:10px;">★</span>' : ''}
                        <span>${sk.name}</span>
                        <span class="skill-card-attr">(${sk.label})</span>
                      </div>
                      <button class="skill-card-roll-btn" onclick="rollPlayerSkill('${p.id}', '${sk.key}')" title="Rolar teste de ${sk.name} (${modStr})">
                        🎲 ${modStr}
                      </button>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>

            <!-- ABA: MOCHILA / INVENTÁRIO / OURO -->
            <div class="p-tab-content ${activeTab === 'inventory' ? 'active' : ''}">
              <div style="background: #080c16; padding: 6px 8px; border-radius: 6px; border: 1px solid var(--border-color); margin-bottom: 6px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                  <span style="font-weight: 800; font-size: 11px; color: #fbbf24;">🪙 Carteira: ${(purse && purse.totalGp !== undefined) ? purse.totalGp : p.gold} PO</span>
                  <button class="btn-secondary" style="font-size: 9px; padding: 2px 6px;" onclick="openPlayerCoinsModal('${p.id}')">⚙️ Moedas</button>
                </div>
                <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 3px; font-size: 9px; text-align: center;">
                  <div style="background: rgba(180,83,9,0.15); border: 1px solid rgba(180,83,9,0.3); padding: 2px; border-radius: 4px; color: #d97706;"><b>${(p.coins && p.coins.cp) || 0}</b> PC</div>
                  <div style="background: rgba(148,163,184,0.15); border: 1px solid rgba(148,163,184,0.3); padding: 2px; border-radius: 4px; color: #e2e8f0;"><b>${(p.coins && p.coins.sp) || 0}</b> PP</div>
                  <div style="background: rgba(56,189,248,0.15); border: 1px solid rgba(56,189,248,0.3); padding: 2px; border-radius: 4px; color: #38bdf8;"><b>${(p.coins && p.coins.ep) || 0}</b> PE</div>
                  <div style="background: rgba(245,158,11,0.15); border: 1px solid rgba(245,158,11,0.3); padding: 2px; border-radius: 4px; color: #f59e0b;"><b>${(p.coins && p.coins.gp) || p.gold || 0}</b> PO</div>
                  <div style="background: rgba(168,85,247,0.15); border: 1px solid rgba(168,85,247,0.3); padding: 2px; border-radius: 4px; color: #c084fc;"><b>${(p.coins && p.coins.pp) || 0}</b> PL</div>
                </div>
              </div>

              <div style="background: #080c16; padding: 6px 8px; border-radius: 6px; border: 1px solid var(--border-color); margin-bottom: 6px;">
                <div style="display: flex; justify-content: space-between; align-items: center; font-size: 10px; margin-bottom: 3px;">
                  <span style="color: var(--text-muted);">⚖️ Carga (FOR ${p.str || 10}): <b style="color: ${carry.isOverloaded ? '#f87171' : (carry.isEncumbered ? '#facc15' : '#34d399')};">${carry.totalWeight} kg</b> / ${carry.maxKg} kg</span>
                  <span style="font-size: 9px; color: var(--text-dim);">${carry.pct}%</span>
                </div>
                <div class="hp-bar-bg" style="height: 5px;">
                  <div class="hp-bar-fill" style="width: ${carry.pct}%; background-color: ${carry.isOverloaded ? 'var(--accent-red)' : (carry.isEncumbered ? '#eab308' : 'var(--accent-green)')};"></div>
                </div>
              </div>

              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                <span style="font-size: 10px; font-weight: 800; color: var(--primary-light);">🎒 Itens (${(p.inventory || []).length})</span>
                <button class="btn-action" style="font-size: 9px; padding: 2px 6px;" onclick="openAddPlayerItemModal('${p.id}')">➕ Item</button>
              </div>

              <div style="display: flex; flex-direction: column; gap: 3px; max-height: 250px; overflow-y: auto;">
                ${(p.inventory && p.inventory.length > 0) ? p.inventory.map((it, idx) => `
                  <div style="background: #080c16; border: 1px solid var(--border-color); border-radius: 4px; padding: 4px 6px; display: flex; justify-content: space-between; align-items: center; font-size: 10px;">
                    <div style="flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-right: 4px;">
                      <span style="font-weight: 700; color: #fff;">${it.name}</span>
                      <span style="font-size: 9px; color: var(--text-dim);">${it.weight ? ' • ' + it.weight + 'kg' : ''}</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 2px;">
                      <button class="btn-micro" onclick="adjustPlayerItemQty('${p.id}', ${idx}, -1)" title="Diminuir quantidade" style="padding: 1px 4px; font-size: 9px;">−</button>
                      <span style="font-weight: 800; min-width: 14px; text-align: center; color: var(--primary-light); font-size: 10px;">${it.qty || 1}x</span>
                      <button class="btn-micro" onclick="adjustPlayerItemQty('${p.id}', ${idx}, 1)" title="Aumentar quantidade" style="padding: 1px 4px; font-size: 9px;">+</button>
                      <button class="btn-micro" style="color: #f87171; padding: 1px 4px; font-size: 9px;" onclick="removePlayerItem('${p.id}', ${idx})" title="Remover item">🗑️</button>
                    </div>
                  </div>
                `).join('') : `
                  <div style="background: #080c16; padding: 6px 8px; border-radius: 4px; border: 1px solid var(--border-color); color: #cbd5e1; font-size: 10px; line-height: 1.4;">
                    ${p.spells || 'Mochila de Aventureiro padrão.'}
                  </div>
                `}
              </div>
            </div>

            <!-- ABA: ORIGEM -->
            <div class="p-tab-content ${activeTab === 'background' ? 'active' : ''}">
              <div class="background-info-card">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                  <span style="font-size: 12px; font-weight: 800; color: var(--primary-light);">🎭 Origem: <b style="color: #fff;">${p.background || 'Aventureiro'}</b></span>
                  <button class="btn-secondary" style="font-size: 10px; padding: 2px 8px;" onclick="openPlayerModal('${p.id}')">✏️ Editar Origem</button>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 11px; margin-bottom: 8px;">
                  <div class="origin-field-box">
                    <span class="origin-label">💡 Ideal:</span>
                    <div class="origin-text">${p.ideal || 'Nenhum ideal definido.'}</div>
                  </div>
                  <div class="origin-field-box">
                    <span class="origin-label">🔗 Vínculo:</span>
                    <div class="origin-text">${p.bond || 'Nenhum vínculo definido.'}</div>
                  </div>
                </div>
                <div style="font-size: 11px; margin-bottom: 8px;" class="origin-field-box">
                  <span class="origin-label">⚡ Defeito:</span>
                  <div class="origin-text">${p.flaw || 'Nenhum defeito definido.'}</div>
                </div>
                <div class="origin-field-box">
                  <span class="origin-label">📜 História & Biografia:</span>
                  <div class="origin-text" style="white-space: pre-wrap; line-height: 1.5; color: #cbd5e1;">${p.backstory || 'Nenhum histórico biográfico registrado.'}</div>
                </div>
              </div>
            </div>

            <!-- ABA: HISTÓRICO -->
            <div class="p-tab-content ${activeTab === 'history' ? 'active' : ''}">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <span style="font-size: 11px; font-weight: 700; color: var(--primary-light);">📜 Histórico de Ações da Sessão</span>
                ${(p.actionLogs && p.actionLogs.length > 0) ? `<button class="btn-secondary" style="font-size: 10px; padding: 2px 6px; color:#f87171;" onclick="clearPlayerActionLogs('${p.id}')">🗑️ Limpar</button>` : ''}
              </div>
              <div class="action-logs-timeline">
                ${(p.actionLogs && p.actionLogs.length > 0) ? p.actionLogs.map(log => `
                  <div class="action-log-entry">
                    <span class="action-log-icon">${log.icon || '⚡'}</span>
                    <div style="flex:1;">
                      <div class="action-log-text">${log.text}</div>
                    </div>
                    <span class="action-log-time">${log.timestamp}</span>
                  </div>
                `).join('') : `
                  <div style="text-align: center; color: var(--text-dim); font-size: 11px; padding: 12px; font-style: italic;">
                    Nenhuma ação recente registrada para este herói. As rolagens de combate, magias, perícias e descansos aparecerão aqui.
                  </div>
                `}
              </div>
            </div>

            <!-- ABA: NOTAS -->
            <div class="p-tab-content ${activeTab === 'notes' ? 'active' : ''}">
              <div class="player-notes-container">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span style="font-size: 11px; font-weight: 700; color: var(--primary-light);">📝 Bloco de Notas Privado</span>
                  <span id="notes-status-${p.id}" style="font-size: 10px; color: var(--text-muted);">Salvo automaticamente</span>
                </div>
                <textarea class="player-notes-textarea" placeholder="Escreva aqui segredos descobertos, nomes de NPCs, pistas da missão, lembretes de inventário..." oninput="handlePlayerNotesInput('${p.id}', this.value)">${escapeAttr(p.playerNotes || '')}</textarea>
                <div class="player-notes-footer">
                  <span>As anotações são salvas localmente e preservadas no portal do jogador.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function switchPlayerCardTab(id, tabName) {
  const p = PLAYERS.find(x => x.id === id);
  if (!p) return;
  p.activeCardTab = tabName;
  renderPlayers();
  saveToLocalStorage();
}

function togglePlayerInspiration(id) {
  const p = PLAYERS.find(x => x.id === id);
  if (!p) return;
  p.inspiration = !p.inspiration;
  if (p.inspiration) {
    if (typeof playFX === 'function') playFX('crit');
    addLog(`⭐ <b>${p.name}</b> recebeu Inspiração Heroica do Mestre!`);
    addPlayerActionLog(p.id, '⭐', `Recebeu Inspiração Heroica do Mestre`, 'general');
  } else {
    addLog(`⭐ <b>${p.name}</b> utilizou sua Inspiração.`);
    addPlayerActionLog(p.id, '⭐', `Utilizou sua Inspiração Heroica`, 'general');
  }
  renderPlayers();
  saveToLocalStorage();
}

function usePlayerInspirationRoll(id) {
  const p = PLAYERS.find(x => x.id === id);
  if (!p) return null;
  if (!p.inspiration) {
    if (typeof addLog === 'function') addLog(`⚠️ <b>${p.name}</b> não possui Inspiração Heroica ativa no momento.`);
    return null;
  }

  // Consome a inspiração sob regras D&D 2024 (vantagem)
  p.inspiration = false;
  const rollLabel = `⭐ Inspiração Heroica (Vantagem) - ${p.name}`;
  let result;
  if (typeof rollGlobalDice === 'function') {
    result = rollGlobalDice(20, 1, 0, 'adv', rollLabel);
  } else {
    const d1 = Math.floor(Math.random() * 20) + 1;
    const d2 = Math.floor(Math.random() * 20) + 1;
    const picked = Math.max(d1, d2);
    result = { total: picked, breakdown: `[${d1}, ${d2}] ➔ maior ${picked}`, isCrit: picked === 20, isFumble: picked === 1 };
    addLog(`⭐ <b>${p.name}</b> usou Inspiração Heroica (2d20 Maior): <b>${picked}</b> (${result.breakdown})`);
  }

  addPlayerActionLog(p.id, '⭐', `Usou Inspiração com Vantagem: ${result.total} (${result.breakdown || ''})`, 'general');
  if (typeof playFX === 'function') playFX('crit');
  renderPlayers();
  saveToLocalStorage();
  return result;
}

// --- M3: AUTOMAÇÃO DE CARGAS DE HABILIDADES POR CLASSE E DESCANSO ---
function initPlayerFeatureCharges(p) {
  if (!p) return [];
  if (!p.featureCharges) p.featureCharges = [];

  const cls = (p.className || '').toLowerCase();
  const lvl = Math.max(1, p.level || 1);
  const chaMod = Math.max(1, Math.floor(((p.cha || 10) - 10) / 2));
  const wisMod = Math.max(1, Math.floor(((p.wis || 10) - 10) / 2));

  const standardFeatures = [];

  if (cls.includes('guerreiro') || cls.includes('fighter')) {
    standardFeatures.push({ id: 'second_wind', name: 'Retomar o Fôlego', icon: '💨', max: 1, restType: 'short' });
    if (lvl >= 2) {
      standardFeatures.push({ id: 'action_surge', name: 'Surto de Ação', icon: '⚡', max: lvl >= 17 ? 2 : 1, restType: 'short' });
    }
    if (lvl >= 9) {
      standardFeatures.push({ id: 'indomitable', name: 'Indomável', icon: '🛡️', max: lvl >= 17 ? 3 : (lvl >= 13 ? 2 : 1), restType: 'long' });
    }
  } else if (cls.includes('bárbaro') || cls.includes('barbaro') || cls.includes('barbarian')) {
    let rages = 2;
    if (lvl >= 20) rages = 99;
    else if (lvl >= 17) rages = 6;
    else if (lvl >= 12) rages = 5;
    else if (lvl >= 6) rages = 4;
    else if (lvl >= 3) rages = 3;
    standardFeatures.push({ id: 'rage', name: 'Fúria', icon: '🔥', max: rages, restType: 'long' });
  } else if (cls.includes('clérigo') || cls.includes('clerigo') || cls.includes('cleric')) {
    if (lvl >= 2) {
      const uses = lvl >= 18 ? 3 : (lvl >= 6 ? 2 : 1);
      standardFeatures.push({ id: 'channel_divinity', name: 'Canalizar Divindade', icon: '✨', max: uses, restType: 'short' });
    }
  } else if (cls.includes('druida') || cls.includes('druid')) {
    if (lvl >= 2) {
      standardFeatures.push({ id: 'wild_shape', name: 'Forma Selvagem', icon: '🐾', max: lvl >= 20 ? 99 : 2, restType: 'short' });
    }
  } else if (cls.includes('bardo') || cls.includes('bard')) {
    standardFeatures.push({ id: 'bardic_insp', name: 'Inspiração de Bardo', icon: '🎵', max: chaMod, restType: lvl >= 5 ? 'short' : 'long' });
  } else if (cls.includes('paladino') || cls.includes('paladin')) {
    standardFeatures.push({ id: 'lay_on_hands', name: 'Cura pelas Mãos (PV)', icon: '🤲', max: lvl * 5, restType: 'long' });
    if (lvl >= 3) {
      standardFeatures.push({ id: 'channel_divinity', name: 'Canalizar Divindade', icon: '✨', max: 1, restType: 'short' });
    }
  } else if (cls.includes('monge') || cls.includes('monk')) {
    if (lvl >= 2) {
      standardFeatures.push({ id: 'ki_points', name: 'Pontos de Ki', icon: '☯️', max: lvl, restType: 'short' });
    }
  } else if (cls.includes('feiticeiro') || cls.includes('sorcerer')) {
    if (lvl >= 2) {
      standardFeatures.push({ id: 'sorcery_points', name: 'Pontos de Feitiçaria', icon: '🔮', max: lvl, restType: 'long' });
    }
  }

  standardFeatures.forEach(std => {
    const existing = p.featureCharges.find(f => f.id === std.id);
    if (existing) {
      existing.name = std.name;
      existing.icon = std.icon;
      existing.max = std.max;
      existing.restType = std.restType;
      existing.used = Math.min(existing.max, existing.used || 0);
    } else {
      p.featureCharges.push({
        id: std.id,
        name: std.name,
        icon: std.icon,
        max: std.max,
        used: 0,
        restType: std.restType
      });
    }
  });

  return p.featureCharges;
}

function usePlayerFeatureCharge(playerId, chargeId, amount = 1) {
  const p = PLAYERS.find(x => x.id === playerId);
  if (!p) return;
  initPlayerFeatureCharges(p);
  const charge = p.featureCharges.find(f => f.id === chargeId);
  if (!charge) return;

  if (charge.used + amount <= charge.max) {
    charge.used += amount;
    if (typeof playFX === 'function') playFX('spell');
    addLog(`${charge.icon || '⚡'} <b>${p.name}</b> usou <b>${charge.name}</b> (${charge.max - charge.used}/${charge.max} restantes).`);
    addPlayerActionLog(p.id, charge.icon || '⚡', `Usou ${charge.name} (${charge.max - charge.used}/${charge.max})`, 'feature');
    renderPlayers();
    saveToLocalStorage();
  } else {
    alert(`Sem cargas restantes de ${charge.name}! Faça um Descanso ${charge.restType === 'short' ? 'Curto ou Longo' : 'Longo'} para recuperar.`);
  }
}

function restorePlayerFeatureCharge(playerId, chargeId, amount = 1) {
  const p = PLAYERS.find(x => x.id === playerId);
  if (!p) return;
  initPlayerFeatureCharges(p);
  const charge = p.featureCharges.find(f => f.id === chargeId);
  if (!charge) return;

  if (charge.used > 0) {
    charge.used = Math.max(0, charge.used - amount);
    addLog(`✨ <b>${p.name}</b> recuperou carga de <b>${charge.name}</b> (${charge.max - charge.used}/${charge.max}).`);
    addPlayerActionLog(p.id, charge.icon || '✨', `Recuperou ${charge.name} (${charge.max - charge.used}/${charge.max})`, 'feature');
    renderPlayers();
    saveToLocalStorage();
  }
}

function adjustPlayerHp(id, delta) {
  const p = PLAYERS.find(x => x.id === id);
  if (!p) return;

  const prev = p.hp;
  if (delta < 0) {
    let dmg = Math.abs(delta);
    if (p.tempHp > 0) {
      if (p.tempHp >= dmg) {
        p.tempHp -= dmg;
        dmg = 0;
      } else {
        dmg -= p.tempHp;
        p.tempHp = 0;
      }
    }
    p.hp = Math.max(0, p.hp - dmg);
    addLog(`⚔️ <b>${p.name}</b> sofreu ${Math.abs(delta)} de dano (${prev} ➔ ${p.hp} PV)`);
    addPlayerActionLog(p.id, '⚔️', `Sofreu ${Math.abs(delta)} de dano (${prev} ➔ ${p.hp} PV)`, 'damage');
    if (typeof playFX === 'function') playFX('sword');
    if (p.hp === 0) {
      p.deathSaves = { success: 0, fail: 0 };
      addLog(`💀 <b>${p.name}</b> caiu inconsciente a 0 PV!`);
      addPlayerActionLog(p.id, '💀', `Caiu inconsciente a 0 PV!`, 'damage');
      if (typeof playFX === 'function') playFX('fumble');
    }
  } else {
    p.hp = Math.min(p.maxHp, p.hp + delta);
    addLog(`💚 <b>${p.name}</b> recuperou ${delta} PV (${prev} ➔ ${p.hp} PV)`);
    addPlayerActionLog(p.id, '💚', `Recuperou ${delta} PV (${prev} ➔ ${p.hp} PV)`, 'heal');
    if (typeof playFX === 'function') playFX('heal');
  }

  const comb = state.combatants.find(c => (c.playerId && c.playerId === p.id) || c.name.includes(p.name));
  if (comb) { comb.hp = p.hp; if (typeof renderCombat === 'function') renderCombat(); }

  renderPlayers();
  saveToLocalStorage();
}

function setPlayerTempHp(id) {
  const p = PLAYERS.find(x => x.id === id);
  if (!p) return;
  const val = prompt(`Definir PV Temporários para ${p.name}:`, p.tempHp || 5);
  if (val !== null) {
    p.tempHp = parseInt(val) || 0;
    addLog(`🛡️ <b>${p.name}</b> ganhou ${p.tempHp} PV Temporários.`);
    addPlayerActionLog(p.id, '🛡️', `Recebeu ${p.tempHp} PV Temporários`, 'heal');
    renderPlayers();
    saveToLocalStorage();
  }
}

function adjustPlayerGold(id, amount) {
  const p = PLAYERS.find(x => x.id === id);
  if (!p) return;
  p.gold = Math.max(0, (p.gold || 0) + amount);
  addLog(`💰 <b>${p.name}</b> ${amount >= 0 ? '+' : ''}${amount} PO (Total: ${p.gold} PO)`);
  addPlayerActionLog(p.id, '💰', `${amount >= 0 ? '+' : ''}${amount} PO (Total: ${p.gold} PO)`, 'gold');
  renderPlayers();
  saveToLocalStorage();
}

function rollPlayerAttr(id, attrName) {
  const p = PLAYERS.find(x => x.id === id);
  if (!p) return;

  const raw = p[attrName] || 10;
  const mod = Math.floor((raw - 10) / 2);
  const r = Math.floor(Math.random() * 20) + 1;
  const total = r + mod;
  const attrLabels = { str: 'Força', dex: 'Destreza', con: 'Constituição', int: 'Inteligência', wis: 'Sabedoria', cha: 'Carisma' };
  const label = attrLabels[attrName] || attrName.toUpperCase();

  const breakdown = `d20 [${r}] ${mod >= 0 ? '+' : ''}${mod}`;
  const banner = document.getElementById('dice-banner');
  if (banner) {
    banner.style.display = 'block';
    document.getElementById('dice-total-number').innerText = total;
    document.getElementById('dice-breakdown-text').innerText = `${p.name} - Teste de ${label}: ${breakdown}`;
    openDiceModal();
  }

  if (r === 20) { if (typeof playFX === 'function') playFX('crit'); }
  else if (r === 1) { if (typeof playFX === 'function') playFX('fumble'); }
  else { if (typeof playFX === 'function') playFX('sword'); }

  addLog(`🎲 <b>${p.name}</b> rolou Teste de <b>${label}</b>: <b>${total}</b> (${breakdown})`);
  addPlayerActionLog(p.id, '🎲', `Teste de ${label}: Total ${total} (${breakdown})`, 'check');
  renderPlayers();
}

function rollPlayerSkill(id, skillKey, mode = 'normal') {
  const p = PLAYERS.find(x => x.id === id);
  if (!p) return null;
  const skill = (typeof DND5E_SKILLS !== 'undefined' ? DND5E_SKILLS.find(s => s.key === skillKey) : null) || { key: skillKey, name: skillKey, attr: 'str', label: 'FOR' };
  const attrVal = p[skill.attr] || 10;
  const attrMod = Math.floor((attrVal - 10) / 2);
  const isProf = (p.skillProficiencies || []).includes(skillKey);
  const prof = getProfBonus(p.level);
  const totalMod = attrMod + (isProf ? prof : 0);
  const rollLabel = `${p.name} - ${skill.name} (${skill.label})`;

  let result;
  if (typeof rollGlobalDice === 'function') {
    result = rollGlobalDice(20, 1, totalMod, mode, rollLabel);
  } else {
    const d20 = Math.floor(Math.random() * 20) + 1;
    const tot = d20 + totalMod;
    const bd = `d20 [${d20}] ${totalMod >= 0 ? '+' + totalMod : totalMod}`;
    result = { total: tot, breakdown: bd, isCrit: d20 === 20, isFumble: d20 === 1 };
    addLog(`🎯 <b>${p.name}</b> rolou Perícia <b>${skill.name}</b>: <b>${tot}</b> (${bd})`);
  }

  addPlayerActionLog(p.id, '🎯', `Perícia ${skill.name}: Total ${result.total} (${result.breakdown || ''})`, 'skill');
  renderPlayers();
  return result;
}

function rollPlayerSavingThrow(id, attrName, mode = 'normal') {
  const p = PLAYERS.find(x => x.id === id);
  if (!p) return null;
  const attrLabels = { str: 'Força', dex: 'Destreza', con: 'Constituição', int: 'Inteligência', wis: 'Sabedoria', cha: 'Carisma' };
  const label = attrLabels[attrName] || attrName.toUpperCase();
  const attrVal = p[attrName] || 10;
  const attrMod = Math.floor((attrVal - 10) / 2);
  const isProf = (p.saveProficiencies || []).includes(attrName);
  const prof = getProfBonus(p.level);
  const totalMod = attrMod + (isProf ? prof : 0);
  const rollLabel = `${p.name} - Salvaguarda de ${label}`;

  let result;
  if (typeof rollGlobalDice === 'function') {
    result = rollGlobalDice(20, 1, totalMod, mode, rollLabel);
  } else {
    const d20 = Math.floor(Math.random() * 20) + 1;
    const tot = d20 + totalMod;
    const bd = `d20 [${d20}] ${totalMod >= 0 ? '+' + totalMod : totalMod}`;
    result = { total: tot, breakdown: bd, isCrit: d20 === 20, isFumble: d20 === 1 };
    addLog(`🛡️ <b>${p.name}</b> rolou Salvaguarda de <b>${label}</b>: <b>${tot}</b> (${bd})`);
  }

  addPlayerActionLog(p.id, '🛡️', `Salvaguarda de ${label}: Total ${result.total} (${result.breakdown || ''})`, 'save');
  renderPlayers();
  return result;
}

let activeSkillsModalPlayerId = null;

function openPlayerSkillsModal(id) {
  const p = PLAYERS.find(x => x.id === id);
  if (!p) return;
  activeSkillsModalPlayerId = id;
  const modal = document.getElementById('modal-player-skills');
  if (!modal) return;

  p.skillProficiencies = p.skillProficiencies || [];
  p.saveProficiencies = p.saveProficiencies || [];

  const nameEl = document.getElementById('skills-modal-player-name');
  if (nameEl) nameEl.innerText = `${p.name} (Nv ${p.level} • Proficiência: +${getProfBonus(p.level)})`;

  renderSkillsModalContent();
  modal.classList.add('open');
}

function renderSkillsModalContent() {
  const p = PLAYERS.find(x => x.id === activeSkillsModalPlayerId);
  if (!p) return;
  const prof = getProfBonus(p.level);

  // 1. Saving Throws
  const savesContainer = document.getElementById('skills-modal-saves-container');
  if (savesContainer) {
    const attrs = [
      { key: 'str', name: 'Força (FOR)' },
      { key: 'dex', name: 'Destreza (DES)' },
      { key: 'con', name: 'Constituição (CON)' },
      { key: 'int', name: 'Inteligência (INT)' },
      { key: 'wis', name: 'Sabedoria (SAB)' },
      { key: 'cha', name: 'Carisma (CAR)' }
    ];
    savesContainer.innerHTML = attrs.map(a => {
      const isProf = (p.saveProficiencies || []).includes(a.key);
      const mod = Math.floor(((p[a.key] || 10) - 10) / 2);
      const totalMod = mod + (isProf ? prof : 0);
      const modStr = totalMod >= 0 ? `+${totalMod}` : `${totalMod}`;
      return `
        <div class="skill-modal-chip ${isProf ? 'active' : ''}" onclick="togglePlayerSaveProf('${p.id}', '${a.key}')">
          <input type="checkbox" ${isProf ? 'checked' : ''} onclick="event.stopPropagation(); togglePlayerSaveProf('${p.id}', '${a.key}')">
          <div style="flex:1;">
            <div style="font-weight:700; font-size:12px;">${a.name}</div>
            <div style="font-size:10px; color:var(--text-muted);">Base: ${mod >= 0 ? '+' + mod : mod} ${isProf ? `+ Prof (+${prof})` : ''}</div>
          </div>
          <span class="skill-mod-badge ${isProf ? 'prof' : ''}">${modStr}</span>
        </div>
      `;
    }).join('');
  }

  // 2. Skills
  const skillsContainer = document.getElementById('skills-modal-skills-container');
  if (skillsContainer) {
    const skillList = typeof DND5E_SKILLS !== 'undefined' ? DND5E_SKILLS : [];
    skillsContainer.innerHTML = skillList.map(s => {
      const isProf = (p.skillProficiencies || []).includes(s.key);
      const mod = Math.floor(((p[s.attr] || 10) - 10) / 2);
      const totalMod = mod + (isProf ? prof : 0);
      const modStr = totalMod >= 0 ? `+${totalMod}` : `${totalMod}`;
      return `
        <div class="skill-modal-chip ${isProf ? 'active' : ''}" onclick="togglePlayerSkillProf('${p.id}', '${s.key}')">
          <input type="checkbox" ${isProf ? 'checked' : ''} onclick="event.stopPropagation(); togglePlayerSkillProf('${p.id}', '${s.key}')">
          <div style="flex:1;">
            <div style="font-weight:700; font-size:12px;">${s.name} <span style="font-size:10px; color:var(--primary-light); font-weight:normal;">(${s.label})</span></div>
            <div style="font-size:10px; color:var(--text-muted);">Atributo: ${s.label} (${mod >= 0 ? '+' + mod : mod}) ${isProf ? `+ Prof (+${prof})` : ''}</div>
          </div>
          <span class="skill-mod-badge ${isProf ? 'prof' : ''}">${modStr}</span>
        </div>
      `;
    }).join('');
  }
}

function togglePlayerSaveProf(id, attrName) {
  const p = PLAYERS.find(x => x.id === id);
  if (!p) return;
  p.saveProficiencies = p.saveProficiencies || [];
  if (p.saveProficiencies.includes(attrName)) {
    p.saveProficiencies = p.saveProficiencies.filter(x => x !== attrName);
  } else {
    p.saveProficiencies.push(attrName);
  }
  renderSkillsModalContent();
  renderPlayers();
  saveToLocalStorage();
}

function togglePlayerSkillProf(id, skillKey) {
  const p = PLAYERS.find(x => x.id === id);
  if (!p) return;
  p.skillProficiencies = p.skillProficiencies || [];
  if (p.skillProficiencies.includes(skillKey)) {
    p.skillProficiencies = p.skillProficiencies.filter(x => x !== skillKey);
  } else {
    p.skillProficiencies.push(skillKey);
  }
  renderSkillsModalContent();
  renderPlayers();
  saveToLocalStorage();
}

function closePlayerSkillsModal() {
  const modal = document.getElementById('modal-player-skills');
  if (modal) modal.classList.remove('open');
  activeSkillsModalPlayerId = null;
}

function rollPlayerAttack(id, rawAttackText) {
  const p = PLAYERS.find(x => x.id === id);
  if (!p) return;

  const hitMatch = rawAttackText.match(/([+-]\d+)/);
  const dmgMatch = rawAttackText.match(/(\d+d\d+(?:\s*[+-]\s*\d+)?)/i);

  const hitBonus = hitMatch ? parseInt(hitMatch[1]) : Math.floor((p.str - 10) / 2) + getProfBonus(p.level);
  const d20 = Math.floor(Math.random() * 20) + 1;
  const totalHit = d20 + hitBonus;

  let isCrit = d20 === 20;
  let isFumble = d20 === 1;

  let dmgFormula = dmgMatch ? dmgMatch[1].replace(/\s+/g, '') : '1d8+3';
  let dmgParts = dmgFormula.split(/[+-]/);
  let dicePart = dmgParts[0];
  let dmgMod = dmgFormula.includes('+') ? parseInt(dmgFormula.split('+')[1]) : (dmgFormula.includes('-') ? -parseInt(dmgFormula.split('-')[1]) : 0);

  let [diceCount, diceSides] = dicePart.split('d').map(x => parseInt(x));
  diceCount = diceCount || 1;
  diceSides = diceSides || 8;

  if (isCrit) diceCount *= 2;

  let dmgRolls = [];
  let totalDmg = 0;
  for (let i = 0; i < diceCount; i++) {
    const r = Math.floor(Math.random() * diceSides) + 1;
    dmgRolls.push(r);
    totalDmg += r;
  }
  totalDmg += dmgMod;

  const hitBreakdown = `d20 [${d20}] ${hitBonus >= 0 ? '+' : ''}${hitBonus} ➔ <b>${totalHit}</b> para acertar`;
  const dmgBreakdown = `${diceCount}d${diceSides} [${dmgRolls.join(', ')}] ${dmgMod !== 0 ? (dmgMod > 0 ? '+ ' + dmgMod : '- ' + Math.abs(dmgMod)) : ''} ➔ <b>${totalDmg}</b> de dano`;

  let logMsg = `⚔️ <b>${p.name}</b> atacou: ${hitBreakdown} | ${dmgBreakdown}`;
  if (isCrit) logMsg = '🔥 <b>ACERTO CRÍTICO!</b> ' + logMsg;
  if (isFumble) logMsg = '💀 <b>FALHA CRÍTICA (Nat 1)!</b> ' + logMsg;

  addLog(logMsg);
  addPlayerActionLog(p.id, '⚔️', `Ataque: ${rawAttackText} ➔ Acerto ${totalHit} | Dano ${totalDmg}`, 'attack');
  if (typeof playFX === 'function') playFX(isCrit ? 'crit' : (isFumble ? 'fumble' : 'sword'));

  const banner = document.getElementById('dice-banner');
  if (banner) {
    banner.style.display = 'block';
    document.getElementById('dice-total-number').innerText = totalHit;
    document.getElementById('dice-breakdown-text').innerText = `${p.name}: Acerto ${totalHit} | Dano: ${totalDmg}`;
    openDiceModal();
  }
  renderPlayers();
}

function togglePlayerSlot(id, lvlIdx, slotIdx) {
  const p = PLAYERS.find(x => x.id === id);
  if (!p || !p.slots) return;

  const currentUsed = p.slotsUsed[lvlIdx] || 0;
  if (slotIdx < currentUsed) {
    p.slotsUsed[lvlIdx] = Math.max(0, currentUsed - 1);
    addPlayerActionLog(p.id, '🔮', `Restaurou 1 espaço de magia de ${lvlIdx + 1}º Círculo`, 'spell');
  } else {
    p.slotsUsed[lvlIdx] = Math.min(p.slots[lvlIdx], currentUsed + 1);
    if (typeof playFX === 'function') playFX('spell');
    addLog(`🔮 <b>${p.name}</b> gastou 1 espaço de magia de ${lvlIdx + 1}º Círculo.`);
    addPlayerActionLog(p.id, '🔮', `Gastou 1 espaço de magia de ${lvlIdx + 1}º Círculo`, 'spell');
  }

  renderPlayers();
  saveToLocalStorage();
}

function playerShortRest(id) {
  const p = PLAYERS.find(x => x.id === id);
  if (!p) return;

  const conMod = Math.floor((p.con - 10) / 2);
  const hd = p.hitDice || '1d8';
  const sides = parseInt(hd.split('d')[1]) || 8;
  const roll = Math.floor(Math.random() * sides) + 1;
  const healed = Math.max(1, roll + conMod);

  p.hp = Math.min(p.maxHp, p.hp + healed);

  // M3: Restaura habilidades de descanso curto
  initPlayerFeatureCharges(p);
  let restoredFeatures = [];
  p.featureCharges.forEach(f => {
    if (f.restType === 'short' && f.used > 0) {
      f.used = 0;
      restoredFeatures.push(f.name);
    }
  });

  if (typeof playFX === 'function') playFX('heal');
  const featMsg = restoredFeatures.length > 0 ? ` e restaurou cargas de: ${restoredFeatures.join(', ')}` : '';
  addLog(`☕ <b>${p.name}</b> fez um Descanso Curto: rolou 1d${sides}+${conMod} e recuperou <b>${healed} PV</b> (${p.hp}/${p.maxHp})${featMsg}.`);
  addPlayerActionLog(p.id, '☕', `Descanso Curto: recuperou ${healed} PV (${p.hp}/${p.maxHp})${featMsg}`, 'rest');

  renderPlayers();
  saveToLocalStorage();
}

// --- DADOS DE VIDA & DESCANSO CURTO (D&D 5E) ---
let activeShortRestPlayerId = null;

function getPlayerHitDieType(p) {
  if (!p) return 'd8';
  const cls = (p.className || '').toLowerCase();
  if (cls.includes('guerreiro') || cls.includes('fighter') || cls.includes('paladino') || cls.includes('paladin') || cls.includes('patrulheiro') || cls.includes('ranger')) {
    return 'd10';
  }
  if (cls.includes('bárbaro') || cls.includes('barbaro') || cls.includes('barbarian')) {
    return 'd12';
  }
  if (cls.includes('mago') || cls.includes('wizard') || cls.includes('feiticeiro') || cls.includes('sorcerer')) {
    return 'd6';
  }
  return 'd8';
}

function getPlayerHitDicePool(p) {
  if (!p) return { dieType: 'd8', dieSides: 8, total: 1, spent: 0, available: 1 };
  const dieType = getPlayerHitDieType(p);
  const dieSides = parseInt(dieType.replace('d', ''), 10) || 8;
  const total = Math.max(1, p.level || 1);
  const spent = Math.max(0, Math.min(total, p.spentHitDice || 0));
  const available = Math.max(0, total - spent);
  return { dieType, dieSides, total, spent, available };
}

function openShortRestModal(playerId) {
  const p = PLAYERS.find(x => x.id === playerId);
  if (!p) return;
  activeShortRestPlayerId = playerId;

  const modal = document.getElementById('modal-short-rest');
  const titleEl = document.getElementById('short-rest-char-title');
  if (titleEl) {
    titleEl.innerText = `${p.name} • ${p.className} (Nível ${p.level || 1})`;
  }

  renderShortRestModalContent(p);

  if (modal) modal.classList.add('open');
}

function closeShortRestModal() {
  const modal = document.getElementById('modal-short-rest');
  if (modal) modal.classList.remove('open');
  activeShortRestPlayerId = null;
}

function renderShortRestModalContent(p) {
  const container = document.getElementById('short-rest-card-content');
  if (!container || !p) return;

  const hd = getPlayerHitDicePool(p);
  const conMod = Math.floor(((p.con || 10) - 10) / 2);
  const conModStr = conMod >= 0 ? `+${conMod}` : `${conMod}`;
  const hpPct = Math.max(0, Math.min(100, Math.round((p.hp / p.maxHp) * 100)));
  const hpColor = hpPct > 50 ? 'var(--accent-green)' : (hpPct > 25 ? '#eab308' : 'var(--accent-red)');

  container.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <div>
        <div style="font-size: 13px; font-weight: 700; color: #fff;">Pontos de Vida Atuais:</div>
        <div style="font-size: 20px; font-weight: 900; color: ${hpColor};">${p.hp} <span style="font-size: 13px; color: var(--text-muted);">/ ${p.maxHp} PV</span></div>
      </div>
      <div style="text-align: right;">
        <div style="font-size: 11px; color: var(--text-dim);">Modificador de CON:</div>
        <div style="font-size: 14px; font-weight: 800; color: var(--primary-light);">${conModStr}</div>
      </div>
    </div>

    <div class="hp-bar-bg" style="height: 8px; margin: 4px 0 10px 0;">
      <div class="hp-bar-fill" style="width: ${hpPct}%; background-color: ${hpColor};"></div>
    </div>

    <div style="background: rgba(0,0,0,0.3); border: 1px solid var(--border-color); border-radius: 8px; padding: 10px; display: flex; justify-content: space-between; align-items: center;">
      <div>
        <div style="font-size: 11px; font-weight: 700; color: #e2e8f0; margin-bottom: 3px;">🎲 Reserva de Dados de Vida (${hd.dieType}):</div>
        <div style="font-size: 13px; font-weight: 800; color: #fbbf24;">
          ${hd.available} de ${hd.total} disponíveis
        </div>
      </div>
      <button class="btn-action btn-roll-hd" onclick="rollShortRestHitDie('${p.id}')" ${hd.available <= 0 || p.hp >= p.maxHp ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>
        🎲 Rolar 1${hd.dieType} (${conModStr})
      </button>
    </div>

    ${p.hp >= p.maxHp ? `
      <div style="color: var(--accent-green); font-size: 11px; text-align: center; font-weight: bold; margin-top: 4px;">
        ✨ Vida totalmente cheia!
      </div>
    ` : (hd.available <= 0 ? `
      <div style="color: #f87171; font-size: 11px; text-align: center; font-weight: bold; margin-top: 4px;">
        ⚠️ Todos os dados de vida foram gastos hoje. Conceda um Descanso Longo para recuperar dados.
      </div>
    ` : '')}
  `;
}

function rollShortRestHitDie(playerId) {
  const p = PLAYERS.find(x => x.id === playerId);
  if (!p) return;

  const hd = getPlayerHitDicePool(p);
  if (hd.available <= 0) {
    alert('Você não tem mais Dados de Vida disponíveis hoje!');
    return;
  }
  if (p.hp >= p.maxHp) {
    alert('Seus Pontos de Vida já estão no máximo!');
    return;
  }

  const conMod = Math.floor(((p.con || 10) - 10) / 2);
  const dieRoll = Math.floor(Math.random() * hd.dieSides) + 1;
  const totalHealed = Math.max(1, dieRoll + conMod);

  p.spentHitDice = (p.spentHitDice || 0) + 1;
  const prevHp = p.hp;
  p.hp = Math.min(p.maxHp, p.hp + totalHealed);
  const actualHealed = p.hp - prevHp;

  const comb = typeof state !== 'undefined' && state.combatants ? state.combatants.find(c => (c.playerId && c.playerId === p.id) || c.name.includes(p.name)) : null;
  if (comb) { comb.hp = p.hp; if (typeof renderCombat === 'function') renderCombat(); }

  if (typeof playFX === 'function') playFX('heal');

  const bd = `1${hd.dieType} [${dieRoll}] ${conMod >= 0 ? '+' + conMod : conMod} = ${totalHealed} PV`;
  addLog(`🏕️ <b>${p.name}</b> gastou 1 Dado de Vida (${bd}): recuperou <b>+${actualHealed} PV</b> (${prevHp} ➔ ${p.hp}/${p.maxHp} PV). Dados restantes: ${hd.available - 1}/${hd.total}`);
  addPlayerActionLog(p.id, '🏕️', `Descanso Curto: rolou 1${hd.dieType} (${bd}) e recuperou +${actualHealed} PV (${p.hp}/${p.maxHp})`, 'rest');

  if (typeof showLiveDiceRoll === 'function') {
    showLiveDiceRoll(`🏕️ Descanso Curto - ${p.name}`, totalHealed, `Dado de Vida 1${hd.dieType} (${bd})`);
  }

  renderShortRestModalContent(p);
  renderPlayers();
  saveToLocalStorage();
}

function finishShortRestModal() {
  if (!activeShortRestPlayerId) {
    closeShortRestModal();
    return;
  }
  const p = PLAYERS.find(x => x.id === activeShortRestPlayerId);
  if (p) {
    initPlayerFeatureCharges(p);
    p.featureCharges.forEach(f => {
      if (f.restType === 'short' && f.used > 0) {
        f.used = 0;
      }
    });

    const cls = (p.className || '').toLowerCase();
    if (cls.includes('bruxo') || cls.includes('warlock')) {
      if (p.slotsUsed) p.slotsUsed = [0, 0, 0, 0, 0];
    }

    addLog(`🏕️ <b>${p.name}</b> finalizou o Descanso Curto: habilidades de classe e fôlego restaurados!`);
    addPlayerActionLog(p.id, '🏕️', `Concluiu Descanso Curto (habilidades restauradas)`, 'rest');
    if (typeof playFX === 'function') playFX('crit');
  }

  closeShortRestModal();
  renderPlayers();
  saveToLocalStorage();
}

function playerLongRest(id) {
  const p = PLAYERS.find(x => x.id === id);
  if (!p) return;

  p.hp = p.maxHp;
  p.tempHp = 0;
  p.deathSaves = { success: 0, fail: 0 };
  if (p.slotsUsed) p.slotsUsed = [0, 0, 0, 0, 0];

  // Recupera metade dos dados de vida gastos (mínimo 1)
  const recoveredDice = Math.max(1, Math.floor((p.level || 1) / 2));
  p.spentHitDice = Math.max(0, (p.spentHitDice || 0) - recoveredDice);

  // M3: Restaura todas as habilidades no Descanso Longo
  initPlayerFeatureCharges(p);
  p.featureCharges.forEach(f => {
    f.used = 0;
  });

  if (typeof playFX === 'function') playFX('heal');
  addLog(`🌙 <b>${p.name}</b> completou um Descanso Longo: PV restaurados ao máximo, magias, ${recoveredDice} dados de vida e todas as cargas de classe recuperadas!`);
  addPlayerActionLog(p.id, '🌙', `Descanso Longo: PV restaurados ao máximo, magias, dados de vida e cargas recuperadas`, 'rest');

  renderPlayers();
  saveToLocalStorage();
}

function partyLongRestAll() {
  if (confirm('Conceder Descanso Longo (8h) para TODOS os alunos? Todos recuperarão PV total, magias, dados de vida e habilidades.')) {
    PLAYERS.forEach(p => {
      p.hp = p.maxHp;
      p.tempHp = 0;
      p.deathSaves = { success: 0, fail: 0 };
      p.slotsUsed = [0, 0, 0, 0, 0];
      const recoveredDice = Math.max(1, Math.floor((p.level || 1) / 2));
      p.spentHitDice = Math.max(0, (p.spentHitDice || 0) - recoveredDice);
      initPlayerFeatureCharges(p);
      p.featureCharges.forEach(f => {
        f.used = 0;
      });
      addPlayerActionLog(p.id, '🌙', `Descanso Longo em Grupo: PV total, magias, dados de vida e cargas restauradas`, 'rest');
    });
    if (typeof playFX === 'function') playFX('crit');
    addLog('✨ <b>DESCANSO LONGO DO GRUPO:</b> Todos os aventureiros recuperaram vida, magias, dados de vida e habilidades ao máximo!');
    renderPlayers();
    saveToLocalStorage();
  }
}


function toggleDeathSave(id, type, index) {
  const p = PLAYERS.find(x => x.id === id);
  if (!p) return;
  p.deathSaves = p.deathSaves || { success: 0, fail: 0 };
  if (p.deathSaves[type] === index) {
    p.deathSaves[type] = index - 1;
  } else {
    p.deathSaves[type] = index;
  }
  renderPlayers();
  saveToLocalStorage();
}

function rollPlayerDeathSave(id) {
  const p = PLAYERS.find(x => x.id === id);
  if (!p) return;
  p.deathSaves = p.deathSaves || { success: 0, fail: 0 };

  const r = Math.floor(Math.random() * 20) + 1;
  let msg = '';

  if (r === 20) {
    p.hp = 1;
    p.deathSaves = { success: 0, fail: 0 };
    msg = `🔥 <b>20 NATURAL!</b> <b>${p.name}</b> recuperou a consciência e levantou com <b>1 PV</b>!`;
    addPlayerActionLog(p.id, '🔥', `Teste contra a Morte: Nat 20! Levantou com 1 PV!`, 'save');
    if (typeof playFX === 'function') playFX('crit');
  } else if (r === 1) {
    p.deathSaves.fail = Math.min(3, p.deathSaves.fail + 2);
    msg = `💀 <b>1 NATURAL!</b> <b>${p.name}</b> sofreu <b>2 FALHAS</b> no teste da morte (${p.deathSaves.fail}/3)!`;
    addPlayerActionLog(p.id, '💀', `Teste contra a Morte: Nat 1! +2 falhas (${p.deathSaves.fail}/3)`, 'save');
    if (typeof playFX === 'function') playFX('fumble');
  } else if (r >= 10) {
    p.deathSaves.success = Math.min(3, p.deathSaves.success + 1);
    msg = `✨ <b>${p.name}</b> obteve um <b>SUCESSO</b> [${r}] no teste da morte (${p.deathSaves.success}/3)!`;
    addPlayerActionLog(p.id, '✨', `Teste contra a Morte: Sucesso [${r}] (${p.deathSaves.success}/3)`, 'save');
    if (typeof playFX === 'function') playFX('heal');
  } else {
    p.deathSaves.fail = Math.min(3, p.deathSaves.fail + 1);
    msg = `💀 <b>${p.name}</b> obteve uma <b>FALHA</b> [${r}] no teste da morte (${p.deathSaves.fail}/3)!`;
    addPlayerActionLog(p.id, '💀', `Teste contra a Morte: Falha [${r}] (${p.deathSaves.fail}/3)`, 'save');
    if (typeof playFX === 'function') playFX('sword');
  }

  if (p.deathSaves.success >= 3) {
    p.hp = 1;
    p.deathSaves = { success: 0, fail: 0 };
    msg += `<br>💚 <b>${p.name} ESTABILIZOU</b> com 1 PV!`;
    addPlayerActionLog(p.id, '💚', `Estabilizou com 1 PV!`, 'save');
  } else if (p.deathSaves.fail >= 3) {
    msg += `<br>⚰️ <b>${p.name} faleceu heroicamente.</b>`;
    addPlayerActionLog(p.id, '⚰️', `Faleceu heroicamente.`, 'damage');
  }

  addLog(msg);
  renderPlayers();
  saveToLocalStorage();
}

function rollDeathSave(id) {
  return rollPlayerDeathSave(id);
}

function escapeAttr(str) {
  if (!str) return '';
  return String(str).replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

function calculateSpellSlots(className, level) {
  const norm = (className || '').toLowerCase();
  level = parseInt(level) || 1;
  
  // Full Casters: Bardo, Clérigo, Druida, Feiticeiro, Mago
  if (norm.includes('bardo') || norm.includes('clérigo') || norm.includes('clerigo') || norm.includes('druida') || norm.includes('feiticeiro') || norm.includes('mago')) {
    const fullTable = [
      [2, 0, 0, 0, 0], // Nv 1
      [3, 0, 0, 0, 0], // Nv 2
      [4, 2, 0, 0, 0], // Nv 3
      [4, 3, 0, 0, 0], // Nv 4
      [4, 3, 2, 0, 0], // Nv 5
      [4, 3, 3, 0, 0], // Nv 6
      [4, 3, 3, 1, 0], // Nv 7
      [4, 3, 3, 2, 0], // Nv 8
      [4, 3, 3, 3, 1], // Nv 9
      [4, 3, 3, 3, 2], // Nv 10
      [4, 3, 3, 3, 2], // Nv 11
      [4, 3, 3, 3, 2], // Nv 12
      [4, 3, 3, 3, 2], // Nv 13
      [4, 3, 3, 3, 2], // Nv 14
      [4, 3, 3, 3, 2], // Nv 15
      [4, 3, 3, 3, 2], // Nv 16
      [4, 3, 3, 3, 2], // Nv 17
      [4, 3, 3, 3, 3], // Nv 18
      [4, 3, 3, 3, 3], // Nv 19
      [4, 3, 3, 3, 3]  // Nv 20
    ];
    return fullTable[Math.min(20, Math.max(1, level)) - 1];
  }

  // Half Casters: Paladino, Patrulheiro
  if (norm.includes('paladino') || norm.includes('patrulheiro')) {
    if (level < 2) return [0, 0, 0, 0, 0];
    if (level === 2) return [2, 0, 0, 0, 0];
    if (level <= 4) return [3, 0, 0, 0, 0];
    if (level <= 6) return [4, 2, 0, 0, 0];
    if (level <= 8) return [4, 3, 0, 0, 0];
    if (level <= 10) return [4, 3, 2, 0, 0];
    if (level <= 12) return [4, 3, 3, 0, 0];
    if (level <= 14) return [4, 3, 3, 1, 0];
    if (level <= 16) return [4, 3, 3, 2, 0];
    if (level <= 18) return [4, 3, 3, 3, 1];
    return [4, 3, 3, 3, 2];
  }

  // Warlock / Bruxo: Pact Magic
  if (norm.includes('bruxo') || norm.includes('warlock')) {
    if (level === 1) return [1, 0, 0, 0, 0];
    if (level === 2) return [2, 0, 0, 0, 0];
    if (level <= 4) return [0, 2, 0, 0, 0];
    if (level <= 6) return [0, 0, 2, 0, 0];
    if (level <= 8) return [0, 0, 0, 2, 0];
    if (level <= 10) return [0, 0, 0, 0, 2];
    if (level <= 16) return [0, 0, 0, 0, 3];
    return [0, 0, 0, 0, 4];
  }

  // Third Casters
  if (norm.includes('arcano') || norm.includes('eldritch') || norm.includes('trickster')) {
    if (level < 3) return [0, 0, 0, 0, 0];
    if (level <= 3) return [2, 0, 0, 0, 0];
    if (level <= 6) return [3, 0, 0, 0, 0];
    if (level <= 9) return [4, 2, 0, 0, 0];
    if (level <= 12) return [4, 3, 0, 0, 0];
    if (level <= 15) return [4, 3, 2, 0, 0];
    if (level <= 18) return [4, 3, 3, 0, 0];
    return [4, 3, 3, 1, 0];
  }

  return [0, 0, 0, 0, 0];
}

function getHitDieForClass(className) {
  const norm = (className || '').toLowerCase();
  if (norm.includes('bárbaro') || norm.includes('barbaro')) return '1d12';
  if (norm.includes('guerreiro') || norm.includes('paladino') || norm.includes('patrulheiro')) return '1d10';
  if (norm.includes('mago') || norm.includes('feiticeiro')) return '1d6';
  return '1d8'; // Bardo, Clérigo, Druida, Ladino, Monge, Bruxo
}

function findClassData(query) {
  if (!query || typeof CLASSES_DATA === 'undefined') return null;
  const q = String(query).trim().toLowerCase();
  if (!q) return null;

  // 1. Exact match by id or name
  let found = CLASSES_DATA.find(c => c.id.toLowerCase() === q || c.name.toLowerCase() === q);
  if (found) return found;

  // 2. Exact match on the primary word (e.g. "Paladino (Devoção)" -> "paladino")
  const firstWord = q.split(/[\s\(/]+/)[0];
  if (firstWord) {
    found = CLASSES_DATA.find(c => c.id.toLowerCase() === firstWord || c.name.toLowerCase() === firstWord);
    if (found) return found;
  }

  // 3. Fallback: Check whole-word or longest match first (prevents "Paladino" matching "Ladino")
  const sortedClasses = [...CLASSES_DATA].sort((a, b) => b.name.length - a.name.length);
  found = sortedClasses.find(c => {
    const cName = c.name.toLowerCase();
    const cId = c.id.toLowerCase();
    const regexName = new RegExp(`\\b${cName}\\b`, 'i');
    const regexId = new RegExp(`\\b${cId}\\b`, 'i');
    return regexName.test(q) || regexId.test(q) || q.includes(cName) || q.includes(cId);
  });

  return found || null;
}

function findSpeciesData(query) {
  if (!query || typeof SPECIES_DATA === 'undefined') return null;
  const q = String(query).trim().toLowerCase();
  if (!q) return null;

  // 1. Exact match by id or name
  let found = SPECIES_DATA.find(s => s.id.toLowerCase() === q || s.name.toLowerCase() === q);
  if (found) return found;

  // 2. Exact match on the primary word
  const firstWord = q.split(/[\s\(/]+/)[0];
  if (firstWord) {
    found = SPECIES_DATA.find(s => s.id.toLowerCase() === firstWord || s.name.toLowerCase() === firstWord);
    if (found) return found;
  }

  // 3. Fallback: Longest match first
  const sortedSpecies = [...SPECIES_DATA].sort((a, b) => b.name.length - a.name.length);
  found = sortedSpecies.find(s => {
    const sName = s.name.toLowerCase();
    const sId = s.id.toLowerCase();
    return q.includes(sName) || q.includes(sId);
  });

  return found || null;
}

function getUnlockedClassFeatures(className, level, subclassIdx = 0) {
  if (typeof CLASSES_DATA === 'undefined') return [];
  const cls = findClassData(className);
  if (!cls) return [];
  
  level = parseInt(level) || 1;
  const unlocked = [];

  if (cls.features) {
    cls.features.forEach(f => {
      if (f.level <= level) {
        unlocked.push({ ...f, source: cls.name, isSubclass: false });
      }
    });
  }

  if (level >= 3 && cls.subclasses && cls.subclasses[subclassIdx]) {
    const sub = cls.subclasses[subclassIdx];
    if (sub.features) {
      sub.features.forEach(f => {
        if (f.level <= level) {
          unlocked.push({ ...f, source: sub.name, isSubclass: true });
        }
      });
    }
  }

  return unlocked;
}

function getPlayerClassesList(p) {
  if (!p) return [];
  if (Array.isArray(p.multiclass) && p.multiclass.length > 0) {
    return p.multiclass;
  }
  return [{
    className: p.className || 'Guerreiro',
    level: parseInt(p.level, 10) || 1,
    subclassIdx: parseInt(p.subclassIdx, 10) || 0
  }];
}

function renderPlayerUnlockedFeatures(p) {
  const classesList = getPlayerClassesList(p);
  let html = '';
  let totalFeaturesCount = 0;

  classesList.forEach(clsItem => {
    const unlocked = getUnlockedClassFeatures(clsItem.className, clsItem.level, clsItem.subclassIdx || 0);
    if (unlocked.length > 0) {
      totalFeaturesCount += unlocked.length;
      html += `
        <div style="font-size: 11px; font-weight: 800; color: var(--primary-light); margin-top: 8px; margin-bottom: 4px; display: flex; align-items: center; gap: 6px;">
          <span>🌳</span> <span>Habilidades de ${clsItem.className} (Nível ${clsItem.level}):</span>
        </div>
        <div class="unlocked-features-list">
          ${unlocked.map(f => `
            <div class="unlocked-feature-item" onclick="openPlayerFeatureModal('${escapeAttr(f.name)}', '${escapeAttr(f.desc)}', '${escapeAttr(f.type || 'Característica')}', '${escapeAttr(f.source || clsItem.className)}')" title="Clique para ver detalhes em tópicos">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <span style="font-weight:700; color:#fff; font-size:12px;">${f.name}</span>
                <span class="badge ${f.isSubclass ? 'badge-sub' : 'badge-cls'}" style="font-size:9px;">Nv ${f.level}</span>
              </div>
              <div style="font-size:11px; color:var(--text-muted); line-height:1.3; margin-top:2px;" class="feature-snippet">
                ${f.desc}
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }
  });

  if (totalFeaturesCount === 0 && !p.features) {
    return `<div style="background: rgba(0,0,0,0.25); border: 1px dashed var(--border-color); padding: 10px; border-radius: 6px; text-align: center; color: var(--text-muted); font-size: 11px;">Nenhuma habilidade de classe registrada.</div>`;
  }

  return html;
}

function openPlayerFeatureModal(name, desc, type, source) {
  const modal = document.getElementById('modal-skill-detail');
  if (!modal) return;
  
  const iconEl = document.getElementById('skill-modal-icon');
  if (iconEl) iconEl.innerText = '🛡️';

  document.getElementById('skill-modal-title').innerText = name;
  document.getElementById('skill-modal-meta').innerHTML = `
    <span>${source || 'Herói'}</span>
    <span>•</span>
    <span>${type || 'Habilidade'}</span>
  `;

  const typeEl = document.getElementById('skill-modal-type');
  if (typeEl) {
    typeEl.className = 'skill-tag-pill';
    typeEl.innerText = type || 'Habilidade';
  }

  const descContainer = document.getElementById('skill-modal-desc');
  if (descContainer) {
    if (typeof formatFeatureToTopics === 'function') {
      descContainer.innerHTML = formatFeatureToTopics(desc || '');
    } else {
      descContainer.innerHTML = `<div class="skill-concept-box">${(desc || '').replace(/\n/g, '<br>')}</div>`;
    }
  }

  modal.classList.add('open');
}

function getCompatibleClassKey(className) {
  const norm = (className || '').toLowerCase();
  if (norm.includes('bardo')) return 'Bardo';
  if (norm.includes('bruxo') || norm.includes('warlock')) return 'Bruxo';
  if (norm.includes('clérigo') || norm.includes('clerigo')) return 'Clérigo';
  if (norm.includes('druida')) return 'Druida';
  if (norm.includes('feiticeiro')) return 'Feiticeiro';
  if (norm.includes('mago') || norm.includes('wizard')) return 'Mago';
  if (norm.includes('paladino')) return 'Paladino';
  if (norm.includes('patrulheiro') || norm.includes('ranger')) return 'Patrulheiro';
  return null;
}

let currentPickerPlayerId = null;
let pickerSelectedSpells = new Set();
let pickerSearchQuery = '';
let pickerClassFilter = 'auto';
let pickerCircleFilter = 'all';
let pickerSchoolFilter = 'all';
let pickerShowOnlySelected = false;
let pickerExpandedSpell = null;

function openSpellPickerModal(playerId) {
  const p = PLAYERS.find(x => x.id === playerId);
  if (!p) return;

  currentPickerPlayerId = playerId;
  
  // Se preparedSpells já existe, usa; senão tenta extrair de p.spells
  let initialSpells = Array.isArray(p.preparedSpells) ? [...p.preparedSpells] : [];
  if (initialSpells.length === 0 && p.spells && typeof SPELLS_DATA !== 'undefined') {
    const rawText = (p.spells || '').toLowerCase();
    SPELLS_DATA.forEach(s => {
      if (rawText.includes(s.name.toLowerCase())) {
        initialSpells.push(s.name);
      }
    });
  }

  pickerSelectedSpells = new Set(initialSpells);
  pickerSearchQuery = '';
  pickerClassFilter = 'auto';
  pickerCircleFilter = 'all';
  pickerSchoolFilter = 'all';
  pickerShowOnlySelected = false;
  pickerExpandedSpell = null;

  const modal = document.getElementById('modal-spell-picker');
  const classFilterSelect = document.getElementById('picker-class-filter');
  const searchInput = document.getElementById('picker-search-input');
  const btnOnlySelected = document.getElementById('btn-picker-only-selected');

  if (classFilterSelect) classFilterSelect.value = 'auto';
  if (searchInput) searchInput.value = '';
  if (btnOnlySelected) btnOnlySelected.classList.remove('active');

  if (modal) {
    document.getElementById('picker-player-name').innerText = p.name;
    document.getElementById('picker-player-class').innerText = `${p.className} (Nível ${p.level})`;
    renderSpellPickerList();
    modal.classList.add('open');
  }
}

function togglePickerShowOnlySelected() {
  pickerShowOnlySelected = !pickerShowOnlySelected;
  const btn = document.getElementById('btn-picker-only-selected');
  if (btn) btn.classList.toggle('active', pickerShowOnlySelected);
  renderSpellPickerList();
}

function toggleSpellDetailInPicker(spellName, e) {
  if (e) e.stopPropagation();
  pickerExpandedSpell = pickerExpandedSpell === spellName ? null : spellName;
  renderSpellPickerList();
}

function renderSpellPickerList() {
  const container = document.getElementById('picker-spells-list');
  const countBadge = document.getElementById('picker-selected-count');
  const countBtnBadge = document.getElementById('picker-btn-selected-count');
  if (!container) return;

  const p = PLAYERS.find(x => x.id === currentPickerPlayerId);
  const heroClassKey = p ? getCompatibleClassKey(p.className) : null;

  if (countBadge) countBadge.innerText = pickerSelectedSpells.size;
  if (countBtnBadge) countBtnBadge.innerText = pickerSelectedSpells.size;

  let spells = typeof SPELLS_DATA !== 'undefined' ? SPELLS_DATA : [];
  
  // Filtragem por apenas selecionadas
  if (pickerShowOnlySelected) {
    spells = spells.filter(s => pickerSelectedSpells.has(s.name));
  } else {
    // Filtragem por classe
    if (pickerClassFilter === 'auto') {
      if (heroClassKey) {
        spells = spells.filter(s => Array.isArray(s.classes) && s.classes.includes(heroClassKey));
      }
    } else if (pickerClassFilter !== 'all') {
      spells = spells.filter(s => Array.isArray(s.classes) && s.classes.includes(pickerClassFilter));
    }
  }

  const q = pickerSearchQuery.toLowerCase().trim();
  const filtered = spells.filter(s => {
    if (q && !s.name.toLowerCase().includes(q) && !(s.desc || '').toLowerCase().includes(q)) return false;
    if (pickerCircleFilter !== 'all' && String(s.level) !== pickerCircleFilter) return false;
    if (pickerSchoolFilter !== 'all' && s.school !== pickerSchoolFilter) return false;
    return true;
  });

  if (filtered.length === 0) {
    container.innerHTML = `<div style="text-align:center; padding:30px; color:var(--text-muted); font-size:12px;">Nenhuma magia encontrada com os filtros selecionados.<br><span style="font-size:11px; color:var(--primary-light);">Dica: selecione "🌐 Todas as Magias" para ver o catálogo completo de 361 magias.</span></div>`;
    return;
  }

  container.innerHTML = filtered.map(s => {
    const isSelected = pickerSelectedSpells.has(s.name);
    const circleLabel = s.level === 0 ? 'Truque' : `${s.level}º Círculo`;
    const classPills = Array.isArray(s.classes) ? s.classes.slice(0, 3).join(', ') : '';
    const castTimeText = s.time || s.castTime || '1 ação';
    const isExpanded = pickerExpandedSpell === s.name;

    return `
      <div class="picker-spell-item ${isSelected ? 'selected' : ''}" onclick="toggleSpellInPicker('${escapeAttr(s.name)}')">
        <div style="display:flex; align-items:flex-start; gap:10px; width:100%;">
          <input type="checkbox" ${isSelected ? 'checked' : ''} style="margin-top:4px; cursor:pointer;" onclick="event.stopPropagation(); toggleSpellInPicker('${escapeAttr(s.name)}')">
          <div style="flex:1;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span style="font-weight:700; color:${isSelected ? 'var(--primary-light)' : '#fff'}; font-size:13px;">${s.name}</span>
              <div style="display:flex; align-items:center; gap:6px;">
                <span class="badge ${s.level === 0 ? 'badge-cls' : 'badge-lvl'}" style="font-size:10px;">${circleLabel}</span>
                <button class="btn-secondary" style="padding:1px 6px; font-size:10px;" onclick="toggleSpellDetailInPicker('${escapeAttr(s.name)}', event)" title="Ver descrição da magia">
                  ${isExpanded ? '▲ Fechar' : 'ℹ️ Detalhes'}
                </button>
              </div>
            </div>
            <div style="font-size:11px; color:var(--text-muted); margin-top:2px;">
              ${s.school || 'Magia'} • Alcance: <b>${s.range || 'Pessoal'}</b> • Tempo: <b>${castTimeText}</b> ${classPills ? `• <span style="color:var(--primary-light);">${classPills}</span>` : ''}
            </div>
            ${isExpanded ? `
              <div style="margin-top:8px; padding:8px 10px; background:rgba(0,0,0,0.4); border-left:3px solid var(--accent-gold); border-radius:4px; font-size:12px; line-height:1.5; color:#e2e8f0;">
                <div style="margin-bottom:4px; color:var(--accent-gold); font-size:10px; font-weight:700; text-transform:uppercase;">
                  Duração: ${s.duration || 'Instantânea'} | Componentes: ${s.components || 'V, S'}
                </div>
                ${typeof highlightInlineRules === 'function' ? highlightInlineRules(s.desc || '') : (s.desc || '').replace(/\n/g, '<br>')}
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function handlePickerClassFilter(classFilter) {
  pickerClassFilter = classFilter;
  renderSpellPickerList();
}

function handlePickerSearch(query) {
  pickerSearchQuery = query;
  renderSpellPickerList();
}

function handlePickerCircleFilter(circle) {
  pickerCircleFilter = circle;
  renderSpellPickerList();
}

function handlePickerSchoolFilter(school) {
  pickerSchoolFilter = school;
  renderSpellPickerList();
}

function toggleSpellInPicker(spellName) {
  if (pickerSelectedSpells.has(spellName)) {
    pickerSelectedSpells.delete(spellName);
  } else {
    pickerSelectedSpells.add(spellName);
    if (typeof playFX === 'function') playFX('heal');
  }
  renderSpellPickerList();
}

function saveSpellPickerSelection() {
  const p = PLAYERS.find(x => x.id === currentPickerPlayerId);
  if (!p) return;

  p.preparedSpells = Array.from(pickerSelectedSpells);
  
  const cantrips = [];
  const leveled = [];
  p.preparedSpells.forEach(sName => {
    const s = typeof SPELLS_DATA !== 'undefined' ? SPELLS_DATA.find(x => x.name.toLowerCase() === sName.toLowerCase()) : null;
    if (s && s.level === 0) cantrips.push(sName);
    else leveled.push(sName);
  });
  
  let summary = '';
  if (cantrips.length > 0) summary += `Truques: ${cantrips.join(', ')}\n`;
  if (leveled.length > 0) summary += `Preparadas: ${leveled.join(', ')}`;
  if (summary) p.spells = summary.trim();

  closeSpellPickerModal();
  renderPlayers();
  if (typeof renderCombat === 'function') renderCombat();
  saveToLocalStorage();
  if (typeof playFX === 'function') playFX('heal');
  addLog(`📖 <b>${p.name}</b> atualizou suas magias preparadas (${p.preparedSpells.length} magias salvas com sucesso).`);
}

function closeSpellPickerModal() {
  const modal = document.getElementById('modal-spell-picker');
  if (modal) modal.classList.remove('open');
}

let activeCastPlayerId = null;
let activeCastSpellName = null;

function castPlayerSpellPrompt(playerId, spellName) {
  const p = PLAYERS.find(x => x.id === playerId);
  if (!p) return;

  const sp = typeof SPELLS_DATA !== 'undefined' ? SPELLS_DATA.find(s => s.name.toLowerCase() === spellName.toLowerCase()) : null;
  const spellLvl = sp ? sp.level : 1;

  if (spellLvl === 0) {
    executeCastSpell(playerId, spellName, 0);
    return;
  }

  activeCastPlayerId = playerId;
  activeCastSpellName = spellName;

  const modal = document.getElementById('modal-cast-spell');
  if (!modal) {
    executeCastSpell(playerId, spellName, spellLvl);
    return;
  }

  document.getElementById('cast-spell-title').innerText = spellName;
  document.getElementById('cast-spell-meta').innerText = sp ? `${sp.level}º Círculo (${sp.school}) • Tempo: ${sp.castTime} • Alcance: ${sp.range} • Duração: ${sp.duration}` : 'Magia D&D 5E';
  document.getElementById('cast-spell-desc').innerHTML = sp ? sp.desc.replace(/\n/g, '<br>') : 'Sem descrição detalhada.';

  const slotsOptionsContainer = document.getElementById('cast-slot-options');
  const slots = p.slots || [0, 0, 0, 0, 0];
  const slotsUsed = p.slotsUsed || [0, 0, 0, 0, 0];

  let optionsHtml = '';
  let firstAvailableSlot = null;

  for (let i = spellLvl - 1; i < slots.length; i++) {
    const max = slots[i] || 0;
    if (max > 0) {
      const used = slotsUsed[i] || 0;
      const remain = Math.max(0, max - used);
      const isUpcast = (i + 1) > spellLvl;
      const isAvail = remain > 0;
      if (isAvail && firstAvailableSlot === null) firstAvailableSlot = i + 1;

      optionsHtml += `
        <label class="cast-slot-option ${!isAvail ? 'disabled' : ''}">
          <input type="radio" name="cast_slot_level" value="${i + 1}" ${firstAvailableSlot === (i + 1) ? 'checked' : ''} ${!isAvail ? 'disabled' : ''}>
          <div style="flex:1;">
            <div style="font-weight:700; color:${isAvail ? '#fff' : 'var(--text-dim)'}; font-size:13px;">
              ${i + 1}º Círculo ${isUpcast ? '<span style="color:var(--gold); font-size:10px;">(Upcasting)</span>' : ''}
            </div>
            <div style="font-size:11px; color:${remain > 0 ? 'var(--accent-green)' : '#f87171'};">
              ${remain > 0 ? `✨ ${remain}/${max} disponíveis` : `❌ Esgotado (${max}/${max} gastos)`}
            </div>
          </div>
        </label>
      `;
    }
  }

  optionsHtml += `
    <label class="cast-slot-option">
      <input type="radio" name="cast_slot_level" value="0" ${firstAvailableSlot === null ? 'checked' : ''}>
      <div style="flex:1;">
        <div style="font-weight:700; color:var(--primary-light); font-size:13px;">Sem gastar espaço / Ritual</div>
        <div style="font-size:11px; color:var(--text-muted);">Uso livre, ritual ou poder inato</div>
      </div>
    </label>
  `;

  slotsOptionsContainer.innerHTML = optionsHtml;
  modal.classList.add('open');
}

function submitCastSpell() {
  const sel = document.querySelector('input[name="cast_slot_level"]:checked');
  const chosenSlot = sel ? parseInt(sel.value) : 0;
  if (activeCastPlayerId && activeCastSpellName) {
    executeCastSpell(activeCastPlayerId, activeCastSpellName, chosenSlot);
  }
  closeCastSpellModal();
}

function executeCastSpell(playerId, spellName, slotLevel) {
  const p = PLAYERS.find(x => x.id === playerId);
  if (!p) return;

  const sp = typeof SPELLS_DATA !== 'undefined' ? SPELLS_DATA.find(s => s.name.toLowerCase() === spellName.toLowerCase()) : null;

  if (slotLevel > 0) {
    p.slotsUsed = p.slotsUsed || [0, 0, 0, 0, 0];
    const lvlIdx = slotLevel - 1;
    p.slotsUsed[lvlIdx] = Math.min((p.slots[lvlIdx] || 0), (p.slotsUsed[lvlIdx] || 0) + 1);
  }

  const slotText = slotLevel === 0 ? (sp && sp.level === 0 ? 'como Truque' : 'sem gastar espaço') : `gastando 1 espaço de ${slotLevel}º Círculo`;
  
  if (typeof playFX === 'function') playFX('spell');
  
  const logMsg = `✨ <b>${p.name}</b> conjurou <b>${spellName}</b> (${slotText})!`;
  addLog(logMsg);
  addPlayerActionLog(p.id, '✨', `Conjurou ${spellName} (${slotText})`, 'spell');

  if (typeof showLiveDiceRoll === 'function') {
    showLiveDiceRoll(`✨ ${spellName}`, slotLevel === 0 ? 'Truque' : `${slotLevel}º Círculo`, `${p.name} conjurou`);
  }

  if (typeof broadcastCombatState === 'function') {
    broadcastCombatState(logMsg);
  }

  renderPlayers();
  if (typeof renderCombat === 'function') renderCombat();
  saveToLocalStorage();
}

function closeCastSpellModal() {
  const modal = document.getElementById('modal-cast-spell');
  if (modal) modal.classList.remove('open');
}

function onPlayerModalClassOrLevelChange() {
  const classSel = document.getElementById('pm-class-select');
  const classInput = document.getElementById('pm-class');
  const subclassSel = document.getElementById('pm-subclass-select');
  const levelInput = document.getElementById('pm-level');
  const hitDiceInput = document.getElementById('pm-hitdice');

  const selectedClassName = classSel ? (classSel.value === 'custom' ? (classInput ? classInput.value : 'Guerreiro') : classSel.value) : (classInput ? classInput.value : 'Guerreiro');
  const level = parseInt(levelInput ? levelInput.value : 1) || 1;

  if (classInput && classSel && classSel.value !== 'custom') {
    classInput.value = selectedClassName;
  }

  if (hitDiceInput) {
    const hd = getHitDieForClass(selectedClassName);
    hitDiceInput.value = `${level}${hd.replace(/^[0-9]+/, '')}`;
  }

  const slots = calculateSpellSlots(selectedClassName, level);
  for (let i = 1; i <= 5; i++) {
    const slotInput = document.getElementById(`pm-slot-${i}`);
    if (slotInput) slotInput.value = slots[i - 1] || 0;
  }

  if (subclassSel && typeof CLASSES_DATA !== 'undefined') {
    const cls = findClassData(selectedClassName);
    if (cls && cls.subclasses) {
      const currentSubVal = parseInt(subclassSel.value) || 0;
      subclassSel.innerHTML = cls.subclasses.map((s, idx) => `
        <option value="${idx}" ${idx === currentSubVal ? 'selected' : ''}>${s.name}</option>
      `).join('');
      subclassSel.disabled = false;
    } else {
      subclassSel.innerHTML = `<option value="0">Padrão / Sem Subclasse</option>`;
      subclassSel.disabled = true;
    }
  }

  const previewBox = document.getElementById('pm-features-preview');
  if (previewBox) {
    const subIdx = subclassSel ? parseInt(subclassSel.value) || 0 : 0;
    const unlocked = getUnlockedClassFeatures(selectedClassName, level, subIdx);
    if (unlocked.length > 0) {
      previewBox.innerHTML = unlocked.map(f => `
        <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.06); padding:6px 8px; border-radius:6px; font-size:11px;">
          <b style="color:var(--primary-light);">${f.name} (Nv ${f.level}):</b> <span style="color:var(--text-muted);">${(f.desc || '').substring(0, 90)}...</span>
        </div>
      `).join('');
    } else {
      previewBox.innerHTML = `<span style="color:var(--text-dim); font-size:11px;">Nenhuma habilidade de classe listada para este nível.</span>`;
    }
  }
}

function openPlayerModal(id) {
  const modal = document.getElementById('modal-player');
  const delBtn = document.getElementById('btn-del-player');

  const classSel = document.getElementById('pm-class-select');
  if (classSel && classSel.options.length <= 1 && typeof CLASSES_DATA !== 'undefined') {
    classSel.innerHTML = CLASSES_DATA.map(c => `<option value="${c.name}">${c.icon} ${c.name}</option>`).join('') + `<option value="custom">✏️ Personalizada / Outra</option>`;
  }

  const raceSel = document.getElementById('pm-race-select');
  if (raceSel && raceSel.options.length <= 1 && typeof SPECIES_DATA !== 'undefined') {
    raceSel.innerHTML = SPECIES_DATA.map(s => `<option value="${s.name}">${s.icon} ${s.name}</option>`).join('') + `<option value="custom">✏️ Personalizada / Outra</option>`;
  }

  if (id) {
    const p = PLAYERS.find(x => x.id === id);
    if (!p) return;
    document.getElementById('player-modal-heading').innerText = `Editar Ficha: ${p.name}`;
    document.getElementById('pm-id').value = p.id;
    document.getElementById('pm-student').value = p.student;
    document.getElementById('pm-name').value = p.name;
    
    if (raceSel) {
      const pRaceNorm = (p.race || '').trim().toLowerCase();
      const optionsArr = Array.from(raceSel.options).filter(o => o.value !== 'custom');
      let matchRace = optionsArr.find(o => o.value.toLowerCase() === pRaceNorm);
      if (!matchRace) {
        const sortedOptions = [...optionsArr].sort((a, b) => b.value.length - a.value.length);
        matchRace = sortedOptions.find(o => {
          const optVal = o.value.toLowerCase().split('(')[0].trim();
          return pRaceNorm.includes(optVal) || optVal.includes(pRaceNorm);
        });
      }
      if (matchRace) raceSel.value = matchRace.value;
      else raceSel.value = 'custom';
    }
    document.getElementById('pm-race').value = p.race;

    if (classSel) {
      const pClassNorm = (p.className || '').trim().toLowerCase();
      const optionsArr = Array.from(classSel.options).filter(o => o.value !== 'custom');
      let matchClass = optionsArr.find(o => o.value.toLowerCase() === pClassNorm);
      if (!matchClass) {
        const sortedOptions = [...optionsArr].sort((a, b) => b.value.length - a.value.length);
        matchClass = sortedOptions.find(o => {
          const optVal = o.value.toLowerCase().split('(')[0].trim();
          return pClassNorm.includes(optVal) || optVal.includes(pClassNorm);
        });
      }
      if (matchClass) classSel.value = matchClass.value;
      else classSel.value = 'custom';
    }
    document.getElementById('pm-class').value = p.className;
    document.getElementById('pm-level').value = p.level;
    document.getElementById('pm-xp').value = p.xp;
    document.getElementById('pm-hitdice').value = p.hitDice || getHitDieForClass(p.className);
    document.getElementById('pm-ac').value = p.ac;
    document.getElementById('pm-maxhp').value = p.maxHp;
    document.getElementById('pm-speed').value = p.speed;
    document.getElementById('pm-gold').value = p.gold || 15;
    document.getElementById('pm-str').value = p.str;
    document.getElementById('pm-dex').value = p.dex;
    document.getElementById('pm-con').value = p.con;
    document.getElementById('pm-int').value = p.int;
    document.getElementById('pm-wis').value = p.wis;
    document.getElementById('pm-cha').value = p.cha;
    document.getElementById('pm-attacks').value = p.attacks || '';
    document.getElementById('pm-features').value = p.features || '';
    document.getElementById('pm-spells').value = p.spells || '';

    // Novos campos de Origem & Background (P3)
    const bgInp = document.getElementById('pm-background');
    if (bgInp) bgInp.value = p.background || 'Aventureiro';
    const idealInp = document.getElementById('pm-ideal');
    if (idealInp) idealInp.value = p.ideal || '';
    const bondInp = document.getElementById('pm-bond');
    if (bondInp) bondInp.value = p.bond || '';
    const flawInp = document.getElementById('pm-flaw');
    if (flawInp) flawInp.value = p.flaw || '';
    const storyInp = document.getElementById('pm-backstory');
    if (storyInp) storyInp.value = p.backstory || '';
    const avatarInp = document.getElementById('pm-avatar');
    if (avatarInp) avatarInp.value = p.avatar || '👤';

    const slots = p.slots || [0, 0, 0, 0, 0];
    document.getElementById('pm-slot-1').value = slots[0] || 0;
    document.getElementById('pm-slot-2').value = slots[1] || 0;
    document.getElementById('pm-slot-3').value = slots[2] || 0;
    document.getElementById('pm-slot-4').value = slots[3] || 0;
    document.getElementById('pm-slot-5').value = slots[4] || 0;

    document.getElementById('pm-badges').value = (p.badges || []).join(', ');

    if (delBtn) delBtn.style.display = 'block';
  } else {
    document.getElementById('player-modal-heading').innerText = 'Criar Nova Ficha de Personagem';
    document.getElementById('pm-id').value = '';
    document.getElementById('pm-student').value = '';
    document.getElementById('pm-name').value = '';
    if (raceSel) raceSel.value = raceSel.options[0]?.value || 'Humano (Human)';
    document.getElementById('pm-race').value = 'Humano';
    if (classSel) classSel.value = classSel.options[0]?.value || 'Guerreiro';
    document.getElementById('pm-class').value = 'Guerreiro';
    document.getElementById('pm-level').value = 1;
    document.getElementById('pm-xp').value = 0;
    document.getElementById('pm-hitdice').value = '1d10';
    document.getElementById('pm-ac').value = 14;
    document.getElementById('pm-maxhp').value = 12;
    document.getElementById('pm-speed').value = '9m';
    document.getElementById('pm-gold').value = 15;
    document.getElementById('pm-str').value = 14;
    document.getElementById('pm-dex').value = 12;
    document.getElementById('pm-con').value = 14;
    document.getElementById('pm-int').value = 10;
    document.getElementById('pm-wis').value = 10;
    document.getElementById('pm-cha').value = 10;
    document.getElementById('pm-attacks').value = 'Espada Longa (+4, 1d8+2 cortante)';
    document.getElementById('pm-features').value = '';
    document.getElementById('pm-spells').value = '';
    
    // Novos campos de Origem & Background (P3)
    const bgInp = document.getElementById('pm-background');
    if (bgInp) bgInp.value = 'Aventureiro';
    const idealInp = document.getElementById('pm-ideal');
    if (idealInp) idealInp.value = '';
    const bondInp = document.getElementById('pm-bond');
    if (bondInp) bondInp.value = '';
    const flawInp = document.getElementById('pm-flaw');
    if (flawInp) flawInp.value = '';
    const storyInp = document.getElementById('pm-backstory');
    if (storyInp) storyInp.value = '';
    const avatarInp = document.getElementById('pm-avatar');
    if (avatarInp) avatarInp.value = '👤';

    document.getElementById('pm-badges').value = '⭐ Presença 100%';
    document.getElementById('pm-slot-1').value = 0;
    document.getElementById('pm-slot-2').value = 0;
    document.getElementById('pm-slot-3').value = 0;
    document.getElementById('pm-slot-4').value = 0;
    document.getElementById('pm-slot-5').value = 0;
    if (delBtn) delBtn.style.display = 'none';
  }

  onPlayerModalClassOrLevelChange();
  if (modal) modal.classList.add('open');
}

function autoLevelUpPrompt() {
  const currentLvl = parseInt(document.getElementById('pm-level').value) || 1;
  if (currentLvl >= 20) {
    alert('O personagem já está no nível máximo (20)!');
    return;
  }
  const nextLvl = currentLvl + 1;
  const con = parseInt(document.getElementById('pm-con').value) || 10;
  const conMod = Math.floor((con - 10) / 2);
  const hitDice = document.getElementById('pm-hitdice').value || '1d8';

  let avgGain = 5;
  if (hitDice.includes('d6')) avgGain = 4;
  else if (hitDice.includes('d8')) avgGain = 5;
  else if (hitDice.includes('d10')) avgGain = 6;
  else if (hitDice.includes('d12')) avgGain = 7;

  const hpIncrease = Math.max(1, avgGain + conMod);
  const currentMaxHp = parseInt(document.getElementById('pm-maxhp').value) || 12;
  const newMaxHp = currentMaxHp + hpIncrease;

  document.getElementById('pm-level').value = nextLvl;
  document.getElementById('pm-maxhp').value = newMaxHp;
  document.getElementById('pm-hitdice').value = `${nextLvl}${hitDice.replace(/^[0-9]+/, '') || 'd8'}`;

  onPlayerModalClassOrLevelChange();

  if (typeof playFX === 'function') playFX('crit');
  alert(`🎉 Parabéns! Subiu para o Nível ${nextLvl}!\n- PV Máximo aumentado em +${hpIncrease} (${currentMaxHp} ➔ ${newMaxHp} PV).\n- Bônus de Proficiência atualizado para +${getProfBonus(nextLvl)}.\n- Espaços de magia e habilidades atualizados.`);
}

function closePlayerModal() {
  const modal = document.getElementById('modal-player');
  if (modal) modal.classList.remove('open');
}

function savePlayerSheet() {
  const id = document.getElementById('pm-id').value;
  const student = document.getElementById('pm-student').value.trim() || 'Estudante';
  const name = document.getElementById('pm-name').value.trim() || 'Herói';

  const existing = id ? PLAYERS.find(x => x.id === id) : null;
  const maxHp = parseInt(document.getElementById('pm-maxhp').value) || 12;

  const slots = [
    parseInt(document.getElementById('pm-slot-1').value) || 0,
    parseInt(document.getElementById('pm-slot-2').value) || 0,
    parseInt(document.getElementById('pm-slot-3').value) || 0,
    parseInt(document.getElementById('pm-slot-4').value) || 0,
    parseInt(document.getElementById('pm-slot-5').value) || 0
  ];

  const rawBadges = document.getElementById('pm-badges').value || '';
  const badges = rawBadges.split(',').map(b => b.trim()).filter(b => b);

  const subclassSel = document.getElementById('pm-subclass-select');
  const subclassIdx = subclassSel ? parseInt(subclassSel.value) || 0 : (existing ? existing.subclassIdx || 0 : 0);

  const classSel = document.getElementById('pm-class-select');
  const classNameVal = classSel && classSel.value !== 'custom' ? classSel.value : (document.getElementById('pm-class').value || 'Guerreiro');

  const raceSel = document.getElementById('pm-race-select');
  const raceVal = raceSel && raceSel.value !== 'custom' ? raceSel.value : (document.getElementById('pm-race').value || 'Humano');

  const bgVal = document.getElementById('pm-background') ? document.getElementById('pm-background').value.trim() : (existing ? existing.background || 'Aventureiro' : 'Aventureiro');
  const idealVal = document.getElementById('pm-ideal') ? document.getElementById('pm-ideal').value.trim() : (existing ? existing.ideal || '' : '');
  const bondVal = document.getElementById('pm-bond') ? document.getElementById('pm-bond').value.trim() : (existing ? existing.bond || '' : '');
  const flawVal = document.getElementById('pm-flaw') ? document.getElementById('pm-flaw').value.trim() : (existing ? existing.flaw || '' : '');
  const storyVal = document.getElementById('pm-backstory') ? document.getElementById('pm-backstory').value.trim() : (existing ? existing.backstory || '' : '');
  const avatarVal = document.getElementById('pm-avatar') ? document.getElementById('pm-avatar').value.trim() : (existing ? existing.avatar || '👤' : '👤');

  const data = {
    id: id || 'p_' + Date.now(),
    student, name,
    avatar: avatarVal || '👤',
    race: raceVal,
    className: classNameVal,
    subclassIdx,
    level: parseInt(document.getElementById('pm-level').value) || 1,
    xp: parseInt(document.getElementById('pm-xp').value) || 0,
    hitDice: document.getElementById('pm-hitdice').value || '1d10',
    ac: parseInt(document.getElementById('pm-ac').value) || 14,
    hp: existing ? Math.min(maxHp, existing.hp) : maxHp,
    maxHp,
    tempHp: existing ? existing.tempHp : 0,
    speed: document.getElementById('pm-speed').value || '9m',
    gold: parseInt(document.getElementById('pm-gold').value) || 15,
    inspiration: existing ? existing.inspiration : false,
    conditions: existing ? (existing.conditions || []) : [],
    deathSaves: existing ? existing.deathSaves : { success: 0, fail: 0 },
    slots,
    slotsUsed: existing ? existing.slotsUsed : [0, 0, 0, 0, 0],
    preparedSpells: existing && existing.preparedSpells ? existing.preparedSpells : [],
    skillProficiencies: existing && existing.skillProficiencies ? existing.skillProficiencies : [],
    saveProficiencies: existing && existing.saveProficiencies ? existing.saveProficiencies : [],
    featureCharges: existing && existing.featureCharges ? existing.featureCharges : [],
    actionLogs: existing && existing.actionLogs ? existing.actionLogs : [],
    playerNotes: existing && existing.playerNotes !== undefined ? existing.playerNotes : '',
    background: bgVal,
    ideal: idealVal,
    bond: bondVal,
    flaw: flawVal,
    backstory: storyVal,
    str: parseInt(document.getElementById('pm-str').value) || 10,
    dex: parseInt(document.getElementById('pm-dex').value) || 10,
    con: parseInt(document.getElementById('pm-con').value) || 10,
    int: parseInt(document.getElementById('pm-int').value) || 10,
    wis: parseInt(document.getElementById('pm-wis').value) || 10,
    cha: parseInt(document.getElementById('pm-cha').value) || 10,
    attacks: document.getElementById('pm-attacks').value || '',
    features: document.getElementById('pm-features').value || '',
    spells: document.getElementById('pm-spells').value || '',
    badges,
    activeCardTab: existing ? existing.activeCardTab : 'attacks',
    present: true
  };

  if (id) {
    const idx = PLAYERS.findIndex(x => x.id === id);
    if (idx !== -1) PLAYERS[idx] = data;
    const comb = state.combatants.find(c => (c.playerId && c.playerId === id) || c.name.includes(data.name));
    if (comb) {
      comb.name = `${data.name} (${data.student})`;
      comb.ac = data.ac;
      comb.hp = Math.min(comb.hp, data.hp);
      comb.maxHp = data.maxHp;
      comb.actions = data.attacks;
      comb.conditions = [...data.conditions];
      if (typeof renderCombat === 'function') renderCombat();
    }
  } else {
    PLAYERS.push(data);
  }

  closePlayerModal();
  renderPlayers();
  saveToLocalStorage();
}

function deletePlayerDirect(id) {
  const p = PLAYERS.find(x => x.id === id);
  if (!p) return;
  if (confirm(`Tem certeza que deseja excluir permanentemente a ficha de:\n"${p.name}" (Aluno: ${p.student})?`)) {
    PLAYERS = PLAYERS.filter(x => x.id !== id);

    if (state && Array.isArray(state.combatants)) {
      const prevCount = state.combatants.length;
      state.combatants = state.combatants.filter(c => c.playerId !== id && !c.name.includes(p.name));
      if (state.turnIndex >= state.combatants.length) state.turnIndex = 0;
      if (state.combatants.length !== prevCount) {
        addLog(`🗑️ <b>${p.name}</b> foi removido do combate.`);
      }
    }

    if (typeof gridTokens !== 'undefined' && Array.isArray(gridTokens)) {
      gridTokens = gridTokens.filter(t => t.combatantId !== id && t.name !== p.name);
    }

    renderPlayers();
    if (typeof renderCombat === 'function') renderCombat();
    if (typeof renderVTT === 'function') renderVTT();
    if (typeof renderPlayerView === 'function') renderPlayerView();
    saveToLocalStorage();
    addLog(`🗑️ Ficha de <b>${p.name}</b> (${p.student}) foi excluída permanentemente.`);
  }
}

function deletePlayerSheet() {
  const id = document.getElementById('pm-id').value;
  if (!id) return;
  deletePlayerDirect(id);
  closePlayerModal();
}

function clonePlayerSheet(id) {
  const p = PLAYERS.find(x => x.id === id);
  if (!p) return;
  const clone = JSON.parse(JSON.stringify(p));
  clone.id = 'p_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
  clone.name = `${p.name} (Cópia)`;
  clone.student = `${p.student} (Cópia)`;
  PLAYERS.push(clone);
  renderPlayers();
  saveToLocalStorage();
  addLog(`📋 Ficha clonada: <b>${clone.name}</b>`);
}

function addAllPlayersToCombat() {
  if (!PLAYERS || PLAYERS.length === 0) {
    alert('Nenhuma ficha de aluno cadastrada para entrar no combate!');
    return;
  }
  if (!confirm(`Deseja adicionar todas as ${PLAYERS.length} fichas ao combate ativo?`)) return;

  let addedCount = 0;
  PLAYERS.forEach(p => {
    const currentHp = (p.hp !== undefined ? p.hp : p.maxHp);
    const dexMod = Math.floor((p.dex - 10) / 2);
    const d20 = Math.floor(Math.random() * 20) + 1;
    const initRoll = d20 + dexMod;

    const existing = state.combatants.find(c => (c.playerId && c.playerId === p.id) || c.name === `${p.name} (${p.student})` || c.name === p.name);
    if (existing) {
      existing.playerId = p.id;
      existing.name = `${p.name} (${p.student})`;
      existing.init = initRoll;
      existing.ac = p.ac;
      existing.hp = currentHp;
      existing.maxHp = p.maxHp;
      existing.actions = p.attacks;
    } else {
      state.combatants.push({
        id: 'c_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        playerId: p.id,
        name: `${p.name} (${p.student})`,
        init: initRoll,
        ac: p.ac,
        hp: currentHp,
        maxHp: p.maxHp,
        type: 'player',
        conditions: [],
        actions: p.attacks
      });
    }
    addedCount++;
  });

  state.combatants.sort((a, b) => b.init - a.init);
  addLog(`⚔️ <b>${addedCount} alunos</b> entraram no combate.`);
  if (typeof renderCombat === 'function') renderCombat();
  if (typeof renderVTT === 'function') renderVTT();
  if (typeof renderPlayerView === 'function') renderPlayerView();
  saveToLocalStorage();
  switchTab('combat');
}

function partyShortRestAll() {
  if (!PLAYERS || PLAYERS.length === 0) return;
  if (!confirm('Realizar Descanso Curto (1 hora) para todo o grupo?')) return;
  PLAYERS.forEach(p => {
    const conMod = Math.max(0, Math.floor((p.con - 10) / 2));
    const heal = Math.floor(Math.random() * 6) + 1 + conMod;
    p.hp = Math.min(p.maxHp, p.hp + heal);
    const comb = state.combatants.find(c => (c.playerId && c.playerId === p.id) || c.name.includes(p.name));
    if (comb) comb.hp = p.hp;
  });
  renderPlayers();
  if (typeof renderCombat === 'function') renderCombat();
  saveToLocalStorage();
  addLog('☕ <b>Descanso Curto (Grupo)</b>: O grupo descansou 1h e recuperou energia e PV.');
  if (typeof playFX === 'function') playFX('heal');
}

function addPlayerToCombat(id) {
  const p = PLAYERS.find(x => x.id === id);
  if (!p) return;

  const currentHp = (p.hp !== undefined ? p.hp : p.maxHp);
  const dexMod = Math.floor((p.dex - 10) / 2);
  const d20 = Math.floor(Math.random() * 20) + 1;
  const autoInit = d20 + dexMod;

  const inputInit = prompt(
    `⚔️ Entrar no Combate: ${p.name} (${p.student})\n` +
    `• PV Atual: ${currentHp}/${p.maxHp} | CA: ${p.ac}\n` +
    `• Rolagem de Iniciativa [d20 (${d20}) + DES (${dexMod >= 0 ? '+' + dexMod : dexMod})] = ${autoInit}\n\n` +
    `Informe a Iniciativa desejada (ou dê OK para confirmar ${autoInit}):`,
    autoInit
  );

  if (inputInit === null) return; // Cancelou
  const parsed = parseInt(inputInit, 10);
  const initRoll = isNaN(parsed) ? autoInit : parsed;

  const existing = state.combatants.find(c => (c.playerId && c.playerId === p.id) || c.name === `${p.name} (${p.student})` || c.name === p.name);
  if (existing) {
    existing.playerId = p.id;
    existing.name = `${p.name} (${p.student})`;
    existing.init = initRoll;
    existing.ac = p.ac;
    existing.hp = currentHp;
    existing.maxHp = p.maxHp;
    existing.actions = p.attacks;
    addLog(`⚔️ <b>${p.name}</b> foi atualizado no combate (Iniciativa: ${initRoll}, PV: ${currentHp}/${p.maxHp})`);
  } else {
    state.combatants.push({
      id: 'c_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      playerId: p.id,
      name: `${p.name} (${p.student})`,
      init: initRoll,
      ac: p.ac,
      hp: currentHp,
      maxHp: p.maxHp,
      type: 'player',
      conditions: [],
      actions: p.attacks
    });
    addLog(`⚔️ <b>${p.name}</b> entrou no combate (Iniciativa: ${initRoll}, PV: ${currentHp}/${p.maxHp})`);
  }

  state.combatants.sort((a, b) => b.init - a.init);
  if (typeof renderCombat === 'function') renderCombat();
  if (typeof renderVTT === 'function') renderVTT();
  if (typeof renderPlayerView === 'function') renderPlayerView();
  saveToLocalStorage();
  switchTab('combat');
}

function printPlayerSheet(id) {
  const p = PLAYERS.find(x => x.id === id);
  if (!p) return;

  const prof = getProfBonus(p.level);
  const wisMod = Math.floor((p.wis - 10) / 2);
  const dexMod = Math.floor((p.dex - 10) / 2);
  const passPerc = 10 + wisMod;

  const container = document.getElementById('print-sheet-content');
  if (!container) return;

  container.innerHTML = `
    <div style="text-align: center; border-bottom: 2px solid #000; padding-bottom: 8px; margin-bottom: 12px;">
      <h1 style="margin: 0; font-size: 24px; font-family: serif; text-transform: uppercase; letter-spacing: 1px;">${p.name}</h1>
      <div style="font-size: 13px; margin-top: 4px;">
        Aluno: <b>${p.student}</b> • Raça: <b>${p.race}</b> • Classe: <b>${p.className}</b> • Nível: <b>${p.level}</b> (Profic. +${prof}) • XP: <b>${p.xp}</b>
      </div>
    </div>

    <!-- COMBATE & VIDA -->
    <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; text-align: center; border: 1px solid #000; padding: 8px; margin-bottom: 12px;">
      <div><b>CA:</b><br><span style="font-size: 18px; font-weight: bold;">${p.ac}</span></div>
      <div><b>PV MÁX:</b><br><span style="font-size: 18px; font-weight: bold;">${p.maxHp}</span></div>
      <div><b>DESLOC:</b><br><span style="font-size: 16px;">${p.speed}</span></div>
      <div><b>INIC:</b><br><span style="font-size: 16px;">${dexMod >= 0 ? '+' + dexMod : dexMod}</span></div>
      <div><b>PERCEP. PASS:</b><br><span style="font-size: 16px;">${passPerc}</span></div>
    </div>

    <!-- 6 ATRIBUTOS -->
    <div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 6px; text-align: center; margin-bottom: 12px;">
      <div style="border: 1px solid #000; padding: 6px;"><b>FOR</b><div style="font-size: 16px; font-weight: bold;">${getMod(p.str)}</div><small>(${p.str})</small></div>
      <div style="border: 1px solid #000; padding: 6px;"><b>DES</b><div style="font-size: 16px; font-weight: bold;">${getMod(p.dex)}</div><small>(${p.dex})</small></div>
      <div style="border: 1px solid #000; padding: 6px;"><b>CON</b><div style="font-size: 16px; font-weight: bold;">${getMod(p.con)}</div><small>(${p.con})</small></div>
      <div style="border: 1px solid #000; padding: 6px;"><b>INT</b><div style="font-size: 16px; font-weight: bold;">${getMod(p.int)}</div><small>(${p.int})</small></div>
      <div style="border: 1px solid #000; padding: 6px;"><b>SAB</b><div style="font-size: 16px; font-weight: bold;">${getMod(p.wis)}</div><small>(${p.wis})</small></div>
      <div style="border: 1px solid #000; padding: 6px;"><b>CAR</b><div style="font-size: 16px; font-weight: bold;">${getMod(p.cha)}</div><small>(${p.cha})</small></div>
    </div>

    <!-- ATAQUES -->
    <div style="border: 1px solid #000; padding: 8px; margin-bottom: 10px;">
      <b style="font-size: 13px; text-transform: uppercase;">⚔️ Ataques & Armas</b>
      <div style="font-size: 12px; margin-top: 4px; line-height: 1.4;">${p.attacks || 'Nenhum ataque especificado.'}</div>
    </div>

    <!-- TRAÇOS E MAGIAS -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
      <div style="border: 1px solid #000; padding: 8px;">
        <b style="font-size: 13px; text-transform: uppercase;">📜 Características & Talentos</b>
        <div style="font-size: 12px; margin-top: 4px; line-height: 1.4;">${p.features || 'Nenhum traço cadastrado.'}</div>
      </div>
      <div style="border: 1px solid #000; padding: 8px;">
        <b style="font-size: 13px; text-transform: uppercase;">🔮 Magias & Equipamentos</b>
        <div style="font-size: 12px; margin-top: 4px; line-height: 1.4;">${p.spells || 'Nenhuma magia cadastrada.'}</div>
      </div>
    </div>

    <div style="border: 1px solid #000; padding: 6px 10px; display: flex; justify-content: space-between; font-size: 12px;">
      <span>💰 <b>Tesouro:</b> ${p.gold || 0} Peças de Ouro (PO)</span>
      <span>🎲 <b>Dado de Vida:</b> ${p.hitDice || '1d8'}</span>
      <span>⭐ <b>Clube de RPG Prisco Bezerra</b></span>
    </div>
  `;

  const mPrint = document.getElementById('modal-print');
  if (mPrint) mPrint.classList.add('open');
}

function closePrintModal() {
  const mPrint = document.getElementById('modal-print');
  if (mPrint) mPrint.classList.remove('open');
}

// --- COMPARTILHAMENTO DE FICHA VIA LINK & QR CODE + PORTAL DO JOGADOR ---

let currentSharePlayerId = null;

function serializePlayerForShare(p) {
  if (!p) return '';
  const clean = {
    id: p.id,
    student: p.student || '',
    name: p.name || '',
    avatar: p.avatar || '👤',
    race: p.race || 'Humano',
    className: p.className || 'Guerreiro',
    level: parseInt(p.level) || 1,
    xp: parseInt(p.xp) || 0,
    ac: parseInt(p.ac) || 10,
    hp: parseInt(p.hp) || 10,
    maxHp: parseInt(p.maxHp) || 10,
    tempHp: parseInt(p.tempHp) || 0,
    speed: p.speed || '9m',
    hitDice: p.hitDice || '1d8',
    gold: parseInt(p.gold) || 0,
    coins: p.coins || { cp: 0, sp: 0, ep: 0, gp: p.gold || 0, pp: 0 },
    inspiration: !!p.inspiration,
    conditions: Array.isArray(p.conditions) ? p.conditions : [],
    deathSaves: p.deathSaves || { success: 0, fail: 0 },
    slots: Array.isArray(p.slots) ? p.slots : [0, 0, 0, 0, 0],
    slotsUsed: Array.isArray(p.slotsUsed) ? p.slotsUsed : [0, 0, 0, 0, 0],
    str: parseInt(p.str) || 10,
    dex: parseInt(p.dex) || 10,
    con: parseInt(p.con) || 10,
    int: parseInt(p.int) || 10,
    wis: parseInt(p.wis) || 10,
    cha: parseInt(p.cha) || 10,
    skillProficiencies: Array.isArray(p.skillProficiencies) ? p.skillProficiencies : [],
    saveProficiencies: Array.isArray(p.saveProficiencies) ? p.saveProficiencies : [],
    background: p.background || '',
    ideal: p.ideal || '',
    bond: p.bond || '',
    flaw: p.flaw || '',
    backstory: p.backstory || '',
    attacks: p.attacks || '',
    spells: p.spells || '',
    preparedSpells: Array.isArray(p.preparedSpells) ? p.preparedSpells : [],
    features: p.features || '',
    featureCharges: Array.isArray(p.featureCharges) ? p.featureCharges : [],
    inventory: Array.isArray(p.inventory) ? p.inventory : [],
    playerNotes: p.playerNotes || '',
    subclassIdx: parseInt(p.subclassIdx) || 0,
    multiclass: Array.isArray(p.multiclass) ? p.multiclass : []
  };

  try {
    const jsonStr = JSON.stringify(clean);
    const base64 = (typeof btoa === 'function') 
      ? btoa(encodeURIComponent(jsonStr).replace(/%([0-9A-F]{2})/g, (m, p1) => String.fromCharCode('0x' + p1)))
      : Buffer.from(jsonStr, 'utf8').toString('base64');
    return base64;
  } catch (e) {
    console.error('Erro ao serializar ficha:', e);
    return '';
  }
}

function deserializePlayerFromShare(encodedStr) {
  if (!encodedStr) return null;
  try {
    const cleanStr = decodeURIComponent(encodedStr.trim().replace(/^#pdata=/, '').replace(/^#import_player=/, '').replace(/^\?pdata=/, ''));
    let jsonStr = '';
    if (typeof atob === 'function') {
      jsonStr = decodeURIComponent(Array.prototype.map.call(atob(cleanStr), c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
    } else {
      jsonStr = Buffer.from(cleanStr, 'base64').toString('utf8');
    }
    const obj = JSON.parse(jsonStr);
    if (obj && (obj.name || obj.id)) return obj;
  } catch (e) {
    console.error('Erro ao desserializar ficha do jogador:', e);
  }
  return null;
}

function generatePlayerShareUrl(playerId, embedData = true) {
  const p = PLAYERS.find(x => x.id === playerId);
  const href = (typeof window !== 'undefined' && window.location && window.location.href) ? window.location.href : 'https://uranio8.github.io/planilha-rpg/';
  if (!p) return href;

  let base = href.split('?')[0].split('#')[0];
  let url = `${base}?view=player&id=${encodeURIComponent(playerId)}`;

  if (embedData) {
    const payload = serializePlayerForShare(p);
    if (payload) {
      url += `#pdata=${payload}`;
    }
  }
  return url;
}

function openSharePlayerModal(playerId) {
  const p = PLAYERS.find(x => x.id === playerId);
  if (!p) return;

  currentSharePlayerId = playerId;
  const modal = document.getElementById('modal-share-sheet');
  if (!modal) return;

  const charNameEl = document.getElementById('share-modal-char-name');
  const charMetaEl = document.getElementById('share-modal-char-meta');
  const inpUrl = document.getElementById('inp-share-url');
  const qrContainer = document.getElementById('share-qrcode-render');
  const btnCopy = document.getElementById('btn-copy-share');

  if (charNameEl) charNameEl.innerText = `${p.name} (${p.student})`;
  if (charMetaEl) charMetaEl.innerText = `${p.race} • ${p.className} • Nível ${p.level} • CA ${p.ac} • ${p.hp}/${p.maxHp} PV`;

  const shareUrl = generatePlayerShareUrl(playerId, true);
  if (inpUrl) inpUrl.value = shareUrl;
  if (btnCopy) {
    btnCopy.innerText = '📋 Copiar';
    btnCopy.style.background = '';
  }

  // Renderiza QR Code com payload embutido
  if (qrContainer) {
    qrContainer.innerHTML = `
      <img src="https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(shareUrl)}" 
           alt="QR Code da Ficha de ${p.name}" 
           style="width: 220px; height: 220px; display: block; border-radius: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.5);"
           onerror="this.onerror=null; this.src='https://quickchart.io/qr?size=220&text=${encodeURIComponent(shareUrl)}';">
    `;
  }

  modal.classList.add('open');
}

function closeSharePlayerModal() {
  const modal = document.getElementById('modal-share-sheet');
  if (modal) modal.classList.remove('open');
}

function copyShareLink() {
  const inp = document.getElementById('inp-share-url');
  const btn = document.getElementById('btn-copy-share');
  if (!inp) return;
  inp.select();
  inp.setSelectionRange(0, 99999);
  
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(inp.value);
    } else {
      document.execCommand('copy');
    }
    if (btn) {
      btn.innerText = '✅ Copiado!';
      btn.style.background = 'linear-gradient(135deg, #10b981, #047857)';
      setTimeout(() => {
        if (btn) {
          btn.innerText = '📋 Copiar';
          btn.style.background = '';
        }
      }, 2000);
    }
    if (typeof addLog === 'function') addLog('📱 <b>Link Copiado:</b> Link de acesso com dados do personagem copiado para a área de transferência.');
  } catch (e) {
    alert('Link selecionado. Pressione Ctrl+C para copiar.');
  }
}

function sharePlayerViaWhatsApp() {
  if (!currentSharePlayerId) return;
  const p = PLAYERS.find(x => x.id === currentSharePlayerId);
  if (!p) return;

  const shareUrl = generatePlayerShareUrl(currentSharePlayerId, true);
  const msg = `🎲 *D&D 5E - Ficha de Personagem*\n👤 *${p.name}* (${p.student})\n🛡️ ${p.race} • ${p.className} (Nível ${p.level})\n\nAbra sua ficha interativa no link abaixo:\n${shareUrl}`;
  const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
  window.open(waUrl, '_blank');
}

function exportSinglePlayerCode() {
  if (!currentSharePlayerId) return;
  const p = PLAYERS.find(x => x.id === currentSharePlayerId);
  if (!p) return;
  const code = serializePlayerForShare(p);
  if (!code) return;
  
  const formatted = `DND5E_PLAYER:${code}`;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(formatted);
    alert(`Código da Ficha de ${p.name} copiado com sucesso! Você pode colá-lo no celular para importar.`);
  } else {
    prompt(`Código de Backup da Ficha de ${p.name}:`, formatted);
  }
}

function openPlayerPortalDirect() {
  if (!currentSharePlayerId) return;
  const shareUrl = generatePlayerShareUrl(currentSharePlayerId, true);
  window.open(shareUrl, '_blank');
}

function initPlayerPortalMode(playerId) {
  const p = PLAYERS.find(x => x.id === playerId) || PLAYERS[0];
  if (!p) return;

  activePortalPlayerId = p.id;
  if (typeof document !== 'undefined' && document.body && document.body.classList) {
    document.body.classList.add('mode-player-portal');
  }

  const banner = document.getElementById('player-portal-banner');
  const titleEl = document.getElementById('portal-char-title');
  const subEl = document.getElementById('portal-char-sub');

  if (banner) banner.style.display = 'flex';
  if (titleEl) titleEl.innerText = `👤 ${p.name} (${p.student})`;
  if (subEl) subEl.innerText = `${p.race} • ${p.className} (Nível ${p.level}) • CA ${p.ac} • ${p.hp}/${p.maxHp} PV`;

  // Força aba inicial em Minha Ficha
  switchTab('players');
}

function exitPlayerPortalMode() {
  activePortalPlayerId = null;
  if (typeof document !== 'undefined' && document.body && document.body.classList) {
    document.body.classList.remove('mode-player-portal');
  }
  const banner = document.getElementById('player-portal-banner');
  if (banner) banner.style.display = 'none';
  renderPlayers();
  switchTab('combat');
}

function checkPlayerPortalUrl() {
  try {
    // 1. Verifica se há payload de dados codificado no Hash (#pdata=...) ou na Busca (?pdata=...)
    let encodedData = '';
    const hash = window.location.hash || '';
    if (hash.includes('pdata=')) {
      encodedData = hash.split('pdata=')[1].split('&')[0];
    } else if (hash.includes('import_player=')) {
      encodedData = hash.split('import_player=')[1].split('&')[0];
    }

    const params = new URLSearchParams(window.location.search);
    if (!encodedData && params.get('pdata')) {
      encodedData = params.get('pdata');
    }

    if (encodedData) {
      const importedPlayer = deserializePlayerFromShare(encodedData);
      if (importedPlayer && importedPlayer.id) {
        // Atualiza ou insere o jogador na lista local
        const existingIdx = PLAYERS.findIndex(x => x.id === importedPlayer.id);
        if (existingIdx >= 0) {
          PLAYERS[existingIdx] = Object.assign({}, PLAYERS[existingIdx], importedPlayer);
        } else {
          PLAYERS.push(importedPlayer);
        }

        saveToLocalStorage();
        initPlayerPortalMode(importedPlayer.id);

        if (typeof addLog === 'function') {
          addLog(`✨ <b>Ficha Sincronizada:</b> Ficha de <b>${importedPlayer.name}</b> (${importedPlayer.student}) carregada e salva com sucesso neste dispositivo!`);
        }
        return true;
      }
    }

    const view = params.get('view');
    const playerId = params.get('id') || params.get('playerId');

    if (view === 'player' && playerId) {
      initPlayerPortalMode(playerId);
      return true;
    }
  } catch (e) {
    console.warn('Erro ao processar URL do portal do jogador:', e);
  }
  return false;
}

// --- CONDIÇÕES DE STATUS NAS FICHAS (M2) ---

let currentCondPlayerId = null;

function togglePlayerCondition(id, condId) {
  const p = PLAYERS.find(x => x.id === id);
  if (!p) return;
  p.conditions = p.conditions || [];
  const idx = p.conditions.indexOf(condId);
  const condObj = (typeof CONDITIONS_LIST !== 'undefined' ? CONDITIONS_LIST.find(c => c.id === condId) : null) || { name: condId };

  if (idx !== -1) {
    p.conditions.splice(idx, 1);
    addLog(`✨ <b>${p.name}</b> recuperou-se da condição <b>${condObj.name}</b>.`);
  } else {
    p.conditions.push(condId);
    if (typeof playFX === 'function') playFX('fumble');
    addLog(`⚠️ <b>${p.name}</b> agora está sob efeito de: <b>${condObj.name}</b>!`);
  }

  if (state && Array.isArray(state.combatants)) {
    const comb = state.combatants.find(c => (c.playerId && c.playerId === id) || c.name.includes(p.name));
    if (comb) {
      comb.conditions = [...p.conditions];
      if (typeof renderCombat === 'function') renderCombat();
    }
  }

  renderPlayers();
  saveToLocalStorage();
}

function openPlayerCondModal(playerId) {
  const p = PLAYERS.find(x => x.id === playerId);
  if (!p) return;
  currentCondPlayerId = playerId;

  const modal = document.getElementById('modal-player-conds');
  const titleEl = document.getElementById('player-conds-modal-title');
  const pickerEl = document.getElementById('player-conds-picker-grid');

  if (titleEl) titleEl.innerText = `Condições de ${p.name}`;
  if (pickerEl && typeof CONDITIONS_LIST !== 'undefined') {
    const activeConds = p.conditions || [];
    pickerEl.innerHTML = CONDITIONS_LIST.map(c => {
      const isActive = activeConds.includes(c.id);
      return `
        <button class="cond-pick-card ${isActive ? 'active' : ''}" onclick="togglePlayerConditionFromModal('${c.id}')">
          <div style="font-weight: 800; font-size: 13px; color: ${isActive ? 'var(--primary-light)' : '#fff'};">${c.name}</div>
          <div style="font-size: 10px; color: var(--text-muted); margin-top: 2px;">${c.desc}</div>
        </button>
      `;
    }).join('');
  }

  if (modal) modal.classList.add('open');
}

function togglePlayerConditionFromModal(condId) {
  if (!currentCondPlayerId) return;
  togglePlayerCondition(currentCondPlayerId, condId);
  openPlayerCondModal(currentCondPlayerId);
}

function closePlayerCondModal() {
  const modal = document.getElementById('modal-player-conds');
  if (modal) modal.classList.remove('open');
  currentCondPlayerId = null;
}

// --- AVATARES DE PERSONAGEM (P4) ---

let currentAvatarPlayerId = null;

const PRESET_AVATARS = [
  "🧙", "🧙‍♂️", "🧙‍♀️", "⚔️", "🛡️", "🏹", "🗡️", "🧝", "🧝‍♂️", "🧝‍♀️",
  "☀️", "🐉", "💀", "🐺", "🦁", "🦅", "🧛", "👑", "🦄", "⚡",
  "🔮", "📜", "🌲", "🥋", "🐻", "🐗", "🦊", "🐍", "🦇", "🔥"
];

function openAvatarModal(playerId) {
  const p = PLAYERS.find(x => x.id === playerId);
  if (!p) return;
  currentAvatarPlayerId = playerId;

  const modal = document.getElementById('modal-avatar-picker');
  const titleEl = document.getElementById('avatar-modal-char-name');
  const previewEl = document.getElementById('avatar-modal-preview');
  const presetsEl = document.getElementById('avatar-presets-grid');

  if (titleEl) titleEl.innerText = `Avatar de ${p.name}`;
  if (previewEl) {
    if (p.avatar && (p.avatar.startsWith('data:image') || p.avatar.startsWith('http'))) {
      previewEl.innerHTML = `<img src="${p.avatar}" style="width: 72px; height: 72px; border-radius: 50%; object-fit: cover; border: 2px solid var(--primary);">`;
    } else {
      previewEl.innerHTML = `<span style="font-size: 44px;">${p.avatar || '👤'}</span>`;
    }
  }

  if (presetsEl) {
    presetsEl.innerHTML = PRESET_AVATARS.map(av => `
      <button class="avatar-preset-btn ${p.avatar === av ? 'selected' : ''}" onclick="setPlayerAvatarPreset('${av}')">${av}</button>
    `).join('');
  }

  if (modal) modal.classList.add('open');
}

function closeAvatarModal() {
  const modal = document.getElementById('modal-avatar-picker');
  if (modal) modal.classList.remove('open');
  currentAvatarPlayerId = null;
}

function setPlayerAvatarPreset(avatarEmoji) {
  if (!currentAvatarPlayerId) return;
  const p = PLAYERS.find(x => x.id === currentAvatarPlayerId);
  if (!p) return;

  p.avatar = avatarEmoji;
  renderPlayers();
  saveToLocalStorage();
  closeAvatarModal();
  addLog(`🎨 <b>${p.name}</b> atualizou seu avatar para ${avatarEmoji}.`);
}

function handleAvatarFileUpload(event) {
  if (!currentAvatarPlayerId || !event.target.files || !event.target.files[0]) return;
  const file = event.target.files[0];
  const p = PLAYERS.find(x => x.id === currentAvatarPlayerId);
  if (!p) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const size = 128;
      canvas.width = size;
      canvas.height = size;
      
      const minDim = Math.min(img.width, img.height);
      const sx = (img.width - minDim) / 2;
      const sy = (img.height - minDim) / 2;
      ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, size, size);
      
      const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
      p.avatar = compressedDataUrl;
      renderPlayers();
      saveToLocalStorage();
      closeAvatarModal();
      addLog(`🖼️ <b>${p.name}</b> fez upload de uma nova foto de avatar.`);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function removePlayerAvatar() {
  if (!currentAvatarPlayerId) return;
  const p = PLAYERS.find(x => x.id === currentAvatarPlayerId);
  if (!p) return;
  p.avatar = '👤';
  renderPlayers();
  saveToLocalStorage();
  closeAvatarModal();
}

// --- M8 / P6: GERENCIAMENTO DE MOEDAS E INVENTÁRIO DO JOGADOR ---
let activeCoinsPlayerId = null;
let activeAddItemPlayerId = null;
let currentAddItemMode = 'catalog';

function openPlayerCoinsModal(id) {
  const p = PLAYERS.find(x => x.id === id);
  if (!p) return;
  activeCoinsPlayerId = id;
  p.coins = p.coins || { cp: 0, sp: 0, ep: 0, gp: p.gold || 0, pp: 0 };
  
  const modal = document.getElementById('modal-player-coins');
  if (!modal) return;
  
  document.getElementById('player-coins-char-name').innerText = `${p.name} • ${p.className}`;
  document.getElementById('inp-coin-cp').value = p.coins.cp || 0;
  document.getElementById('inp-coin-sp').value = p.coins.sp || 0;
  document.getElementById('inp-coin-ep').value = p.coins.ep || 0;
  document.getElementById('inp-coin-gp').value = (p.coins.gp !== undefined) ? p.coins.gp : (p.gold || 0);
  document.getElementById('inp-coin-pp').value = p.coins.pp || 0;
  
  updateCoinsModalTotal();
  modal.style.display = 'flex';
}

function closePlayerCoinsModal() {
  const modal = document.getElementById('modal-player-coins');
  if (modal) modal.style.display = 'none';
  activeCoinsPlayerId = null;
}

function updateCoinsModalTotal() {
  const cp = parseInt(document.getElementById('inp-coin-cp')?.value) || 0;
  const sp = parseInt(document.getElementById('inp-coin-sp')?.value) || 0;
  const ep = parseInt(document.getElementById('inp-coin-ep')?.value) || 0;
  const gp = parseInt(document.getElementById('inp-coin-gp')?.value) || 0;
  const pp = parseInt(document.getElementById('inp-coin-pp')?.value) || 0;
  
  const totalGp = (cp / 100) + (sp / 10) + (ep / 2) + gp + (pp * 10);
  const totalDisplay = document.getElementById('player-coins-total-gp');
  if (totalDisplay) totalDisplay.innerText = `${Math.round(totalGp * 100) / 100} PO`;
}

function savePlayerCoinsFromModal() {
  if (!activeCoinsPlayerId) return;
  const p = PLAYERS.find(x => x.id === activeCoinsPlayerId);
  if (!p) return;
  
  const cp = Math.max(0, parseInt(document.getElementById('inp-coin-cp')?.value) || 0);
  const sp = Math.max(0, parseInt(document.getElementById('inp-coin-sp')?.value) || 0);
  const ep = Math.max(0, parseInt(document.getElementById('inp-coin-ep')?.value) || 0);
  const gp = Math.max(0, parseInt(document.getElementById('inp-coin-gp')?.value) || 0);
  const pp = Math.max(0, parseInt(document.getElementById('inp-coin-pp')?.value) || 0);

  p.coins = { cp, sp, ep, gp, pp };
  const purse = getPlayerCoinPurse(p);
  
  addPlayerActionLog(p.id, '🪙', `Atualizou carteira: ${purse.totalGp} PO total (${cp}pc, ${sp}pp, ${ep}pe, ${gp}po, ${pp}pl)`, 'general');
  if (typeof playFX === 'function') playFX('crit');
  closePlayerCoinsModal();
  renderPlayers();
  saveToLocalStorage();
}

function openAddPlayerItemModal(id) {
  const p = PLAYERS.find(x => x.id === id);
  if (!p) return;
  activeAddItemPlayerId = id;

  const modal = document.getElementById('modal-add-player-item');
  if (!modal) return;

  document.getElementById('add-item-player-name').innerText = `${p.name} • FOR ${p.str || 10}`;
  switchAddItemMode('catalog');
  renderCatalogItemsForModal();
  modal.style.display = 'flex';
}

function closeAddPlayerItemModal() {
  const modal = document.getElementById('modal-add-player-item');
  if (modal) modal.style.display = 'none';
  activeAddItemPlayerId = null;
}

function switchAddItemMode(mode) {
  currentAddItemMode = mode;
  const tabCat = document.getElementById('tab-item-mode-cat');
  const tabCustom = document.getElementById('tab-item-mode-custom');
  const pCat = document.getElementById('panel-add-item-catalog');
  const pCustom = document.getElementById('panel-add-item-custom');

  if (tabCat) tabCat.className = mode === 'catalog' ? 'btn-secondary active' : 'btn-secondary';
  if (tabCustom) tabCustom.className = mode === 'custom' ? 'btn-secondary active' : 'btn-secondary';
  if (pCat) pCat.style.display = mode === 'catalog' ? 'flex' : 'none';
  if (pCustom) pCustom.style.display = mode === 'custom' ? 'flex' : 'none';
}

function renderCatalogItemsForModal() {
  const listEl = document.getElementById('catalog-items-modal-list');
  if (!listEl || typeof EQUIPMENT_DATA === 'undefined') return;

  const rawQ = document.getElementById('inp-catalog-item-search')?.value || '';
  const q = typeof normalizeStr === 'function' ? normalizeStr(rawQ) : rawQ.toLowerCase().trim();
  const cat = document.getElementById('sel-catalog-item-cat')?.value || 'all';

  const filtered = EQUIPMENT_DATA.filter(it => {
    if (q) {
      const name = typeof normalizeStr === 'function' ? normalizeStr(it.name) : it.name.toLowerCase();
      const desc = typeof normalizeStr === 'function' ? normalizeStr(it.desc || '') : (it.desc || '').toLowerCase();
      if (!name.includes(q) && !desc.includes(q)) return false;
    }
    if (cat !== 'all' && it.category !== cat) return false;
    return true;
  });

  listEl.innerHTML = filtered.map((it, idx) => {
    const originalIdx = EQUIPMENT_DATA.indexOf(it);
    return `
      <div style="background: #080c16; border: 1px solid var(--border-color); border-radius: 6px; padding: 6px 10px; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <div style="font-weight: 700; color: #fff; font-size: 12px;">${it.name} <span style="font-size: 10px; color: var(--text-muted); font-weight: normal;">(${it.category})</span></div>
          <div style="font-size: 10.5px; color: var(--text-dim);">${it.weight ? it.weight + ' • ' : ''}${it.cost ? it.cost + ' • ' : ''}${it.desc ? it.desc.substring(0, 60) + '...' : ''}</div>
        </div>
        <button class="btn-action" style="font-size: 10px; padding: 3px 8px;" onclick="addItemToPlayerFromCatalog(${originalIdx})">➕ Adicionar</button>
      </div>
    `;
  }).join('');
}

function addItemToPlayerFromCatalog(itemIdx) {
  if (!activeAddItemPlayerId || typeof EQUIPMENT_DATA === 'undefined') return;
  const p = PLAYERS.find(x => x.id === activeAddItemPlayerId);
  const it = EQUIPMENT_DATA[itemIdx];
  if (!p || !it) return;

  p.inventory = p.inventory || [];
  
  // Extrai peso em kg numérico aproximado
  let numWeight = 0;
  if (it.weight) {
    const match = it.weight.match(/([\d,.]+)/);
    if (match) numWeight = parseFloat(match[1].replace(',', '.')) || 0;
  }

  // Verifica se o item já existe para incrementar quantidade
  const existing = p.inventory.find(x => x.name.toLowerCase() === it.name.toLowerCase());
  if (existing) {
    existing.qty = (existing.qty || 1) + 1;
  } else {
    p.inventory.push({
      name: it.name,
      category: it.category || 'Equipamento',
      weight: numWeight,
      cost: it.cost || '-',
      desc: it.desc || '',
      qty: 1
    });
  }

  addPlayerActionLog(p.id, '🎒', `Adicionou ao inventário: ${it.name} (1x)`, 'general');
  if (typeof playFX === 'function') playFX('crit');
  closeAddPlayerItemModal();
  renderPlayers();
  saveToLocalStorage();
}

function submitCustomItemToPlayer() {
  if (!activeAddItemPlayerId) return;
  const p = PLAYERS.find(x => x.id === activeAddItemPlayerId);
  if (!p) return;

  const name = document.getElementById('inp-custom-item-name')?.value.trim();
  if (!name) {
    alert('Digite o nome do item.');
    return;
  }
  const qty = Math.max(1, parseInt(document.getElementById('inp-custom-item-qty')?.value) || 1);
  const weight = Math.max(0, parseFloat(document.getElementById('inp-custom-item-weight')?.value) || 0);
  const cost = document.getElementById('inp-custom-item-cost')?.value.trim() || '-';
  const category = document.getElementById('inp-custom-item-cat')?.value.trim() || 'Item';
  const desc = document.getElementById('inp-custom-item-desc')?.value.trim() || '';

  p.inventory = p.inventory || [];
  p.inventory.push({ name, qty, weight, cost, category, desc });

  addPlayerActionLog(p.id, '🎒', `Adicionou item personalizado: ${name} (${qty}x)`, 'general');
  if (typeof playFX === 'function') playFX('crit');
  closeAddPlayerItemModal();
  renderPlayers();
  saveToLocalStorage();
}

function adjustPlayerItemQty(playerId, itemIndex, delta) {
  const p = PLAYERS.find(x => x.id === playerId);
  if (!p || !p.inventory || !p.inventory[itemIndex]) return;

  p.inventory[itemIndex].qty = (p.inventory[itemIndex].qty || 1) + delta;
  if (p.inventory[itemIndex].qty <= 0) {
    const removedName = p.inventory[itemIndex].name;
    p.inventory.splice(itemIndex, 1);
    addPlayerActionLog(p.id, '🗑️', `Removeu do inventário: ${removedName}`, 'general');
  }
  renderPlayers();
  saveToLocalStorage();
}

function removePlayerItem(playerId, itemIndex) {
  const p = PLAYERS.find(x => x.id === playerId);
  if (!p || !p.inventory || !p.inventory[itemIndex]) return;

  const removedName = p.inventory[itemIndex].name;
  if (confirm(`Remover "${removedName}" do inventário de ${p.name}?`)) {
    p.inventory.splice(itemIndex, 1);
    addPlayerActionLog(p.id, '🗑️', `Removeu do inventário: ${removedName}`, 'general');
    renderPlayers();
    saveToLocalStorage();
  }
}

// ===================================================
// 🧙‍♂️ ASSISTENTE DE SUBIR DE NÍVEL & MULTICLASSE (D&D 5E / 2024)
// ===================================================

const MULTICLASS_PREREQUISITES = {
  'bárbaro': [{ attr: 'str', label: 'Força', min: 13 }],
  'barbaro': [{ attr: 'str', label: 'Força', min: 13 }],
  'bardo': [{ attr: 'cha', label: 'Carisma', min: 13 }],
  'bruxo': [{ attr: 'cha', label: 'Carisma', min: 13 }],
  'warlock': [{ attr: 'cha', label: 'Carisma', min: 13 }],
  'clérigo': [{ attr: 'wis', label: 'Sabedoria', min: 13 }],
  'clerigo': [{ attr: 'wis', label: 'Sabedoria', min: 13 }],
  'druida': [{ attr: 'wis', label: 'Sabedoria', min: 13 }],
  'feiticeiro': [{ attr: 'cha', label: 'Carisma', min: 13 }],
  'guerreiro': [{ or: [{ attr: 'str', label: 'Força', min: 13 }, { attr: 'dex', label: 'Destreza', min: 13 }] }],
  'fighter': [{ or: [{ attr: 'str', label: 'Força', min: 13 }, { attr: 'dex', label: 'Destreza', min: 13 }] }],
  'ladino': [{ attr: 'dex', label: 'Destreza', min: 13 }],
  'rogue': [{ attr: 'dex', label: 'Destreza', min: 13 }],
  'mago': [{ attr: 'int', label: 'Inteligência', min: 13 }],
  'wizard': [{ attr: 'int', label: 'Inteligência', min: 13 }],
  'monge': [{ attr: 'dex', label: 'Destreza', min: 13 }, { attr: 'wis', label: 'Sabedoria', min: 13 }],
  'monk': [{ attr: 'dex', label: 'Destreza', min: 13 }, { attr: 'wis', label: 'Sabedoria', min: 13 }],
  'paladino': [{ attr: 'str', label: 'Força', min: 13 }, { attr: 'cha', label: 'Carisma', min: 13 }],
  'paladin': [{ attr: 'str', label: 'Força', min: 13 }, { attr: 'cha', label: 'Carisma', min: 13 }],
  'patrulheiro': [{ attr: 'dex', label: 'Destreza', min: 13 }, { attr: 'wis', label: 'Sabedoria', min: 13 }],
  'ranger': [{ attr: 'dex', label: 'Destreza', min: 13 }, { attr: 'wis', label: 'Sabedoria', min: 13 }]
};

function getPlayerAttr(p, attrName) {
  if (!p) return 10;
  const norm = (attrName || '').toLowerCase();
  const mapPtToEn = { 'for': 'str', 'des': 'dex', 'con': 'con', 'int': 'int', 'sab': 'wis', 'car': 'cha' };
  const mapEnToPt = { 'str': 'for', 'dex': 'des', 'con': 'con', 'int': 'int', 'wis': 'sab', 'cha': 'car' };
  const enKey = mapPtToEn[norm] || norm;
  const ptKey = mapEnToPt[norm] || norm;

  if (p[enKey] !== undefined) return Number(p[enKey]) || 10;
  if (p[ptKey] !== undefined) return Number(p[ptKey]) || 10;
  if (p.attributes && p.attributes[enKey] !== undefined) return Number(p.attributes[enKey]) || 10;
  if (p.attributes && p.attributes[ptKey] !== undefined) return Number(p.attributes[ptKey]) || 10;
  return 10;
}

function checkMulticlassPrerequisites(p, targetClassName) {
  if (!p) return { ok: true, canMulticlass: true, details: [], reasons: [] };
  const targetNorm = (targetClassName || '').toLowerCase();
  const reqs = MULTICLASS_PREREQUISITES[targetNorm] || [];
  const details = [];
  const reasons = [];
  let allMet = true;

  reqs.forEach(r => {
    if (r.or) {
      const orMet = r.or.some(opt => getPlayerAttr(p, opt.attr) >= opt.min);
      const orLabels = r.or.map(opt => `${opt.label} (${getPlayerAttr(p, opt.attr)}/${opt.min})`).join(' ou ');
      details.push({ met: orMet, text: orLabels });
      if (!orMet) {
        allMet = false;
        reasons.push(orLabels);
      }
    } else {
      const val = getPlayerAttr(p, r.attr);
      const met = val >= r.min;
      const labelText = `${r.label} (${val}/${r.min})`;
      details.push({ met, text: labelText });
      if (!met) {
        allMet = false;
        reasons.push(labelText);
      }
    }
  });

  return { ok: allMet, canMulticlass: allMet, details, reasons };
}

function calculateMulticlassSpellSlots(player) {
  const classesList = getPlayerClassesList(player);
  let casterLevel = 0;
  let warlockLevel = 0;

  classesList.forEach(c => {
    const norm = c.className.toLowerCase();
    const lvl = c.level;
    // Conjuradores Totais (100%)
    if (norm.includes('mago') || norm.includes('clérigo') || norm.includes('clerigo') || norm.includes('druida') || norm.includes('bardo') || norm.includes('feiticeiro')) {
      casterLevel += lvl;
    }
    // Meio Conjuradores (50%)
    else if (norm.includes('paladino') || norm.includes('patrulheiro') || norm.includes('ranger')) {
      casterLevel += Math.floor(lvl / 2);
    }
    // Terço Conjuradores (33%)
    else if (norm.includes('arcano') || norm.includes('eldritch') || norm.includes('trickster')) {
      casterLevel += Math.floor(lvl / 3);
    }
    // Bruxo (Pact Magic)
    else if (norm.includes('bruxo') || norm.includes('warlock')) {
      warlockLevel += lvl;
    }
  });

  const baseSlots = calculateSpellSlots('mago', Math.max(1, casterLevel));
  // Se não tiver nenhum conjurador tradicional, zera os slots normais
  const finalSlots = casterLevel > 0 ? baseSlots : [0, 0, 0, 0, 0];

  // Adiciona os slots de pacto do bruxo
  if (warlockLevel > 0) {
    const warlockSlots = calculateSpellSlots('bruxo', warlockLevel);
    for (let i = 0; i < 5; i++) {
      finalSlots[i] = (finalSlots[i] || 0) + (warlockSlots[i] || 0);
    }
  }

  return finalSlots;
}

let levelUpWizardState = {
  playerId: null,
  targetPlayerId: null,
  step: 1,
  selectedClassKey: null,
  selectedClass: null,
  isNewClass: false,
  targetClassLevel: 1,
  selectedSubclassIdx: 0,
  hpMethod: 'fixed', // 'fixed' | 'roll'
  calculatedHpGain: 0,
  rolledHp: null
};

function getHitDieSides(hitDieStr) {
  if (!hitDieStr) return 8;
  const parts = String(hitDieStr).split('d');
  return parseInt(parts[1] || parts[0]) || 8;
}

function openLevelUpWizard(playerId) {
  const p = PLAYERS.find(x => x.id === playerId);
  if (!p) return;

  const classesList = getPlayerClassesList(p);
  const primaryClass = classesList[0];
  const hitDieStr = getHitDieForClass(primaryClass.className);
  const dieSides = getHitDieSides(hitDieStr);
  const conMod = Math.floor((getPlayerAttr(p, 'con') - 10) / 2);
  const avgGain = Math.max(1, Math.floor(dieSides / 2) + 1 + conMod);

  levelUpWizardState = {
    playerId,
    targetPlayerId: playerId,
    step: 1,
    selectedClassKey: primaryClass.className,
    selectedClass: primaryClass.className,
    isNewClass: false,
    targetClassLevel: primaryClass.level + 1,
    selectedSubclassIdx: primaryClass.subclassIdx || 0,
    hpMethod: 'fixed',
    calculatedHpGain: avgGain,
    rolledHp: null
  };

  const modal = document.getElementById('modal-level-up');
  const metaEl = document.getElementById('levelup-player-meta');
  if (metaEl) {
    metaEl.innerText = `${p.name} • ${p.className} (Nível Atual: ${p.level})`;
  }

  renderLevelUpWizardStep();
  if (modal) modal.classList.add('open');
}

function closeLevelUpModal() {
  const modal = document.getElementById('modal-level-up');
  if (modal) modal.classList.remove('open');
}

function renderLevelUpWizardStep() {
  const p = PLAYERS.find(x => x.id === levelUpWizardState.playerId);
  if (!p) return;

  const body = document.getElementById('levelup-wizard-body');
  const btnBack = document.getElementById('btn-levelup-back');
  const btnNext = document.getElementById('btn-levelup-next');

  // Atualiza stepper visual
  for (let i = 1; i <= 3; i++) {
    const dot = document.getElementById(`step-dot-${i}`);
    if (dot) {
      dot.className = `levelup-step-dot ${i === levelUpWizardState.step ? 'active' : (i < levelUpWizardState.step ? 'completed' : '')}`;
    }
  }

  if (btnBack) btnBack.style.display = levelUpWizardState.step > 1 ? 'inline-flex' : 'none';
  if (btnNext) {
    btnNext.innerText = levelUpWizardState.step === 3 ? '🎉 Confirmar Evolução' : 'Avançar ➔';
    btnNext.className = levelUpWizardState.step === 3 ? 'btn-action btn-levelup-trigger' : 'btn-action';
  }

  if (!body) return;

  const currentClasses = getPlayerClassesList(p);
  const availableClasses = (typeof CLASSES_DATA !== 'undefined') ? CLASSES_DATA : [];

  // ================= PASSO 1: ESCOLHA DA CLASSE =================
  if (levelUpWizardState.step === 1) {
    let html = `
      <div style="padding: 12px 20px 4px 20px;">
        <div style="font-size: 13px; font-weight: 800; color: #fff; margin-bottom: 4px;">
          1️⃣ Em qual classe você deseja evoluir?
        </div>
        <p style="font-size: 11px; color: var(--text-muted); margin: 0;">
          Você pode avançar um nível em uma das suas classes existentes ou abrir uma nova trilha de <b>Multiclasse</b>.
        </p>
      </div>

      <div style="padding: 0 20px;">
        <div style="font-size: 11px; font-weight: 700; color: var(--primary-light); text-transform: uppercase; margin: 12px 0 6px 0;">
          Classes Atuais do Personagem:
        </div>
        <div class="levelup-choice-grid" style="margin: 0 0 14px 0;">
          ${currentClasses.map(c => {
            const isSel = !levelUpWizardState.isNewClass && levelUpWizardState.selectedClassKey === c.className;
            const clsData = availableClasses.find(x => x.name.toLowerCase() === c.className.toLowerCase() || x.id === c.className.toLowerCase());
            const icon = clsData ? clsData.icon : '⚔️';
            return `
              <div class="levelup-choice-card ${isSel ? 'selected' : ''}" onclick="selectLevelUpClass('${c.className}', false)">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <span style="font-size: 20px;">${icon}</span>
                  <span class="badge badge-cls" style="font-size: 10px;">Atual: Nv ${c.level}</span>
                </div>
                <div style="font-weight: 800; color: #fff; font-size: 14px;">${c.className}</div>
                <div style="font-size: 11px; color: var(--primary-light);">➔ Avançar para Nível <b>${c.level + 1}</b></div>
              </div>
            `;
          }).join('')}
        </div>

        <div style="font-size: 11px; font-weight: 700; color: var(--accent-purple); text-transform: uppercase; margin: 16px 0 6px 0;">
          🔀 Ou Iniciar Nova Multiclasse:
        </div>
        <div class="levelup-choice-grid" style="margin: 0;">
          ${availableClasses.map(c => {
            const isExisting = currentClasses.some(x => x.className.toLowerCase() === c.name.toLowerCase() || x.className.toLowerCase() === c.id);
            if (isExisting) return '';
            const isSel = levelUpWizardState.isNewClass && levelUpWizardState.selectedClassKey === c.name;
            const prereqCheck = checkMulticlassPrerequisites(p, c.name);
            const prereqHtml = prereqCheck.details.map(d => `
              <span class="levelup-prereq-badge ${d.met ? 'valid' : 'warn'}">
                ${d.met ? '✅' : '⚠️'} ${d.text}
              </span>
            `).join(' ');

            return `
              <div class="levelup-choice-card ${isSel ? 'selected' : ''}" onclick="selectLevelUpClass('${c.name}', true)">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <span style="font-size: 18px;">${c.icon}</span>
                  <span class="badge badge-lvl" style="font-size: 9px;">Multiclasse (Nv 1)</span>
                </div>
                <div style="font-weight: 700; color: #fff; font-size: 13px;">${c.name}</div>
                <div style="display: flex; flex-wrap: wrap; gap: 4px; margin-top: 2px;">
                  ${prereqHtml}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
    body.innerHTML = html;
  }

  // ================= PASSO 2: PREVIEW DE TRAÇOS & SUBCLASSE =================
  else if (levelUpWizardState.step === 2) {
    const clsName = levelUpWizardState.selectedClassKey;
    const targetLvl = levelUpWizardState.targetClassLevel;
    const clsData = findClassData(clsName);
    
    // Novas habilidades adquiridas especificamente no targetLvl
    let newFeatures = [];
    if (clsData && clsData.features) {
      newFeatures = clsData.features.filter(f => f.level === targetLvl);
    }

    // Se for nível 3+, checa se precisa escolher ou ver subclasse
    let subclassSelectHtml = '';
    if (targetLvl >= 3 && clsData && clsData.subclasses && clsData.subclasses.length > 0) {
      subclassSelectHtml = `
        <div style="margin: 12px 20px; padding: 12px; background: rgba(245,158,11,0.08); border: 1px solid rgba(245,158,11,0.3); border-radius: 10px;">
          <div style="font-size: 12px; font-weight: 800; color: var(--accent-gold); margin-bottom: 6px;">
            🌟 Especialização / Subclasse (Nível ${targetLvl}):
          </div>
          <select class="filter-select" style="width: 100%; font-weight: 700;" onchange="selectLevelUpSubclass(parseInt(this.value))">
            ${clsData.subclasses.map((sub, idx) => `
              <option value="${idx}" ${idx === levelUpWizardState.selectedSubclassIdx ? 'selected' : ''}>
                ${sub.name}
              </option>
            `).join('')}
          </select>
        </div>
      `;

      // Inclui traços da subclasse para este nível
      const curSub = clsData.subclasses[levelUpWizardState.selectedSubclassIdx] || clsData.subclasses[0];
      if (curSub && curSub.features) {
        const subFeats = curSub.features.filter(f => f.level === targetLvl);
        subFeats.forEach(sf => {
          newFeatures.push({ ...sf, isSubclass: true, source: curSub.name });
        });
      }
    }

    let featuresListHtml = '';
    if (newFeatures.length > 0) {
      featuresListHtml = `
        <div style="display: flex; flex-direction: column; gap: 10px; padding: 0 20px 14px 20px;">
          ${newFeatures.map(f => {
            const formattedDesc = typeof formatFeatureToTopics === 'function' 
              ? formatFeatureToTopics(f.desc || '') 
              : `<div class="skill-concept-box">${f.desc || ''}</div>`;
            return `
              <div class="skill-modal-card" style="padding: 12px; border-color: rgba(255,255,255,0.1);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 6px;">
                  <div style="font-weight: 800; color: #fff; font-size: 14px; font-family: var(--font-title);">
                    ✨ ${f.name}
                  </div>
                  <span class="badge ${f.isSubclass ? 'badge-sub' : 'badge-cls'}" style="font-size: 9px;">
                    ${f.isSubclass ? f.source : clsName} (Nv ${f.level})
                  </span>
                </div>
                ${formattedDesc}
              </div>
            `;
          }).join('')}
        </div>
      `;
    } else {
      featuresListHtml = `
        <div style="margin: 12px 20px; padding: 20px; background: rgba(0,0,0,0.25); border: 1px dashed var(--border-color); border-radius: 10px; text-align: center; color: var(--text-muted); font-size: 12px;">
          Nenhuma nova habilidade exclusiva no nível ${targetLvl}, mas seus Dados de Vida, Espaços de Magia e PV Máximo serão expandidos!
        </div>
      `;
    }

    body.innerHTML = `
      <div style="padding: 12px 20px 8px 20px;">
        <div style="font-size: 13px; font-weight: 800; color: #fff; margin-bottom: 4px;">
          2️⃣ Novos Poderes & Traços: <b>${clsName} (Nível ${targetLvl})</b>
        </div>
        <p style="font-size: 11px; color: var(--text-muted); margin: 0;">
          Confira as novas características que serão incorporadas automaticamente à ficha:
        </p>
      </div>

      ${subclassSelectHtml}
      ${featuresListHtml}
    `;
  }

  // ================= PASSO 3: INCREMENTO DE PV & CONFIRMAÇÃO =================
  else if (levelUpWizardState.step === 3) {
    const clsName = levelUpWizardState.selectedClassKey || levelUpWizardState.selectedClass;
    const hitDieStr = getHitDieForClass(clsName); // ex: '1d10'
    const dieSides = getHitDieSides(hitDieStr);
    const conMod = Math.floor((getPlayerAttr(p, 'con') - 10) / 2);
    const avgGain = Math.max(1, Math.floor(dieSides / 2) + 1 + conMod);
    const rolledGain = levelUpWizardState.rolledHp !== null 
      ? Math.max(1, levelUpWizardState.rolledHp + conMod) 
      : null;

    const chosenGain = levelUpWizardState.hpMethod === 'roll' && rolledGain !== null ? rolledGain : avgGain;
    levelUpWizardState.calculatedHpGain = chosenGain;
    const newMaxHp = (p.maxHp || 10) + chosenGain;
    const newTotalLevel = (p.level || 1) + 1;
    const newProf = getProfBonus(newTotalLevel);

    body.innerHTML = `
      <div style="padding: 12px 20px 4px 20px;">
        <div style="font-size: 13px; font-weight: 800; color: #fff; margin-bottom: 4px;">
          3️⃣ Pontos de Vida (PV) & Recursos Finais
        </div>
        <p style="font-size: 11px; color: var(--text-muted); margin: 0;">
          Dado de Vida da classe <b>${clsName}</b>: <span class="badge badge-lvl">${hitDieStr}</span> + Mod CON (<b>${getMod(getPlayerAttr(p, 'con'))}</b>).
        </p>
      </div>

      <div class="levelup-hp-box">
        <div>
          <div style="font-size: 12px; font-weight: 700; color: #fff; margin-bottom: 6px;">
            Escolha o método de ganho de PV:
          </div>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button class="btn-secondary ${levelUpWizardState.hpMethod === 'fixed' || levelUpWizardState.hpMethod === 'average' ? 'active' : ''}" onclick="setLevelUpHpMethod('fixed')" style="font-size: 11px;">
              🛡️ Média Fixa (+${avgGain} PV)
            </button>
            <button class="btn-secondary ${levelUpWizardState.hpMethod === 'roll' ? 'active' : ''}" onclick="setLevelUpHpMethod('roll')" style="font-size: 11px;">
              🎲 Rolar ${hitDieStr} (+${conMod >= 0 ? '+' : ''}${conMod})
            </button>
          </div>
        </div>

        ${levelUpWizardState.hpMethod === 'roll' ? `
          <div style="display: flex; align-items: center; gap: 8px;">
            <button class="btn-action" style="padding: 6px 12px; font-size: 11px;" onclick="rollLevelUpHpDice(${dieSides})">
              🎲 Rolar Dado
            </button>
            ${levelUpWizardState.rolledHp !== null ? `
              <span style="font-size: 13px; font-weight: 800; color: var(--accent-gold);">
                [${levelUpWizardState.rolledHp}] + ${conMod} = <b>+${rolledGain} PV</b>
              </span>
            ` : `<span style="font-size: 11px; color: var(--text-muted);">Clique para rolar</span>`}
          </div>
        ` : ''}
      </div>

      <!-- RESUMO DA EVOLUÇÃO -->
      <div style="margin: 0 20px 16px 20px; padding: 14px; background: rgba(16,185,129,0.06); border: 1px solid rgba(16,185,129,0.25); border-radius: 10px;">
        <div style="font-size: 12px; font-weight: 800; color: #34d399; margin-bottom: 8px; text-transform: uppercase;">
          📊 Resumo da Evolução:
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 12px; color: #e2e8f0;">
          <div>• Nível Total: <b>${p.level} ➔ ${newTotalLevel}</b></div>
          <div>• Bônus de Proficiência: <b>+${newProf}</b></div>
          <div>• PV Máximo: <b>${p.maxHp} ➔ ${newMaxHp} PV</b> (+${chosenGain})</div>
          <div>• Nova Classe/Nível: <b>${clsName} (Nv ${levelUpWizardState.targetClassLevel})</b></div>
        </div>
      </div>
    `;
  }
}

function selectLevelUpClass(classKey, isNewClass) {
  const p = PLAYERS.find(x => x.id === levelUpWizardState.playerId);
  if (!p) return;

  const currentClasses = getPlayerClassesList(p);
  const found = currentClasses.find(c => c.className.toLowerCase() === classKey.toLowerCase());

  levelUpWizardState.selectedClassKey = classKey;
  levelUpWizardState.selectedClass = classKey;
  levelUpWizardState.isNewClass = !!isNewClass;
  levelUpWizardState.targetClassLevel = found ? found.level + 1 : 1;
  levelUpWizardState.selectedSubclassIdx = found ? found.subclassIdx || 0 : 0;

  const hitDieStr = getHitDieForClass(classKey);
  const dieSides = getHitDieSides(hitDieStr);
  const conMod = Math.floor((getPlayerAttr(p, 'con') - 10) / 2);
  const avgGain = Math.max(1, Math.floor(dieSides / 2) + 1 + conMod);
  levelUpWizardState.calculatedHpGain = avgGain;

  renderLevelUpWizardStep();
}

function selectLevelUpSubclass(subIdx) {
  levelUpWizardState.selectedSubclassIdx = subIdx;
  renderLevelUpWizardStep();
}

function setLevelUpHpMethod(method) {
  levelUpWizardState.hpMethod = method;
  const p = PLAYERS.find(x => x.id === levelUpWizardState.playerId);
  if (p) {
    const clsName = levelUpWizardState.selectedClassKey || levelUpWizardState.selectedClass;
    const hitDieStr = getHitDieForClass(clsName);
    const dieSides = getHitDieSides(hitDieStr);
    const conMod = Math.floor((getPlayerAttr(p, 'con') - 10) / 2);
    const avgGain = Math.max(1, Math.floor(dieSides / 2) + 1 + conMod);
    levelUpWizardState.calculatedHpGain = (method === 'roll' && levelUpWizardState.rolledHp !== null)
      ? Math.max(1, levelUpWizardState.rolledHp + conMod)
      : avgGain;
  }
  renderLevelUpWizardStep();
}

function rollLevelUpHpDice(dieSides) {
  const roll = Math.floor(Math.random() * dieSides) + 1;
  levelUpWizardState.rolledHp = roll;
  const p = PLAYERS.find(x => x.id === levelUpWizardState.playerId);
  if (p) {
    const conMod = Math.floor((getPlayerAttr(p, 'con') - 10) / 2);
    levelUpWizardState.calculatedHpGain = Math.max(1, roll + conMod);
  }
  if (typeof playFX === 'function') playFX('dice');
  renderLevelUpWizardStep();
}

function handleLevelUpNext() {
  if (levelUpWizardState.step < 3) {
    levelUpWizardState.step++;
    renderLevelUpWizardStep();
  } else {
    applyLevelUpConfirm();
  }
}

function handleLevelUpBack() {
  if (levelUpWizardState.step > 1) {
    levelUpWizardState.step--;
    renderLevelUpWizardStep();
  }
}

function applyLevelUpConfirm() {
  const p = PLAYERS.find(x => x.id === levelUpWizardState.playerId);
  if (!p) return;

  const classesList = getPlayerClassesList(p);
  const clsName = levelUpWizardState.selectedClassKey || levelUpWizardState.selectedClass;
  const targetLvl = levelUpWizardState.targetClassLevel;
  const subIdx = levelUpWizardState.selectedSubclassIdx;

  // Atualiza ou adiciona a classe na lista de multiclasse
  const existingIdx = classesList.findIndex(c => c.className.toLowerCase() === clsName.toLowerCase());
  if (existingIdx >= 0) {
    classesList[existingIdx].level = targetLvl;
    classesList[existingIdx].subclassIdx = subIdx;
  } else {
    classesList.push({
      className: clsName,
      level: targetLvl,
      subclassIdx: subIdx
    });
  }

  p.multiclass = classesList;
  p.level = classesList.reduce((sum, c) => sum + c.level, 0);
  
  // Atualiza string amigável de classes
  p.className = classesList.map(c => `${c.className} ${c.level}`).join(' / ');

  // Atualiza reserva de Dados de Vida combinados
  p.hitDice = classesList.map(c => `${c.level}${getHitDieForClass(c.className).replace(/^[0-9]+/, '')}`).join(' + ');

  // Cálculo de ganho de PV
  const hitDieStr = getHitDieForClass(clsName);
  const dieSides = getHitDieSides(hitDieStr);
  const conMod = Math.floor((getPlayerAttr(p, 'con') - 10) / 2);
  const avgGain = Math.max(1, Math.floor(dieSides / 2) + 1 + conMod);
  const chosenGain = (levelUpWizardState.hpMethod === 'roll' && levelUpWizardState.rolledHp !== null)
    ? Math.max(1, levelUpWizardState.rolledHp + conMod)
    : avgGain;

  p.maxHp = (p.maxHp || 10) + chosenGain;
  p.hp = Math.min(p.maxHp, (p.hp || p.maxHp) + chosenGain); // Cura o ganho

  // Atualiza Espaços de Magia Multiclasse
  p.slots = calculateMulticlassSpellSlots(p);

  // Registra no histórico de ações e log
  const logMsg = `🎉 <b>${p.name}</b> subiu para o <b>Nível ${p.level}</b> (${p.className})! (+${chosenGain} PV Máximo)`;
  addLog(logMsg);
  addPlayerActionLog(p.id, '🔼', `Subiu de Nível: ${p.className} | +${chosenGain} PV (Max: ${p.maxHp})`, 'general');
  if (typeof playFX === 'function') playFX('crit');

  closeLevelUpModal();
  renderPlayers();
  if (typeof renderCombat === 'function') renderCombat();
  saveToLocalStorage();
}



