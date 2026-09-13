// src_js_screen_sync.js - Classroom Projector Screen, Real-Time BroadcastChannel & Lifecycle

const syncChannel = (typeof BroadcastChannel !== 'undefined') ? new BroadcastChannel('dnd5e_prisco_sync') : null;
let playerViewWindow = null;


const XP_THRESHOLDS = {
  1: [25, 50, 75, 100],
  2: [50, 100, 150, 200],
  3: [75, 150, 225, 400],
  4: [125, 250, 375, 500],
  5: [250, 500, 750, 1100],
  6: [300, 600, 900, 1400],
  7: [350, 750, 1100, 1700],
  8: [450, 900, 1400, 2100],
  9: [550, 1100, 1600, 2400],
  10: [600, 1200, 1900, 2800],
  11: [800, 1600, 2400, 3600],
  12: [1000, 2000, 3000, 4500],
  13: [1100, 2200, 3400, 5100],
  14: [1250, 2500, 3800, 5700],
  15: [1400, 2800, 4300, 6400],
  16: [1600, 3200, 4800, 7200],
  17: [2000, 3900, 5900, 8800],
  18: [2100, 4200, 6300, 9500],
  19: [2400, 4900, 7300, 10900],
  20: [2800, 5700, 8500, 12700]
};

const CR_XP_MAP = {
  "0": 10, "1/8": 25, "1/4": 50, "1/2": 100, "1": 200, "2": 450, "3": 700, "4": 1100,
  "5": 1800, "6": 2300, "7": 2900, "8": 3900, "9": 5000, "10": 5900, "11": 7200,
  "12": 8400, "13": 10000, "14": 11500, "15": 13000, "16": 15000, "17": 18000,
  "18": 20000, "19": 22000, "20": 25000, "21": 33000, "22": 41000, "23": 50000,
  "24": 62000, "30": 155000
};

function updateCombatDifficulty() {
  const badge = document.getElementById('combat-difficulty-badge');
  if (!badge) return;

  const playerCombatants = state.combatants.filter(c => c.type === 'player');
  const monsterCombatants = state.combatants.filter(c => c.type === 'monster' && c.hp > 0);

  if (playerCombatants.length === 0 || monsterCombatants.length === 0) {
    badge.className = 'diff-meter diff-trivial';
    badge.innerText = 'Encontro: Trivial';
    return;
  }

  let budget = [0, 0, 0, 0];
  playerCombatants.forEach(pc => {
    const found = PLAYERS.find(p => pc.name.includes(p.name));
    const lvl = found ? Math.max(1, Math.min(20, found.level)) : 2;
    const t = XP_THRESHOLDS[lvl] || XP_THRESHOLDS[2];
    budget[0] += t[0];
    budget[1] += t[1];
    budget[2] += t[2];
    budget[3] += t[3];
  });

  let rawMonsterXp = 0;
  monsterCombatants.forEach(m => {
    const cleanName = m.name.toLowerCase();
    const foundMonster = (typeof BESTIARY_DATA !== 'undefined') ? BESTIARY_DATA.find(b => cleanName.includes(b.name.toLowerCase())) : null;
    if (foundMonster && CR_XP_MAP[foundMonster.cr]) {
      rawMonsterXp += CR_XP_MAP[foundMonster.cr];
    } else {
      rawMonsterXp += Math.max(10, Math.round(m.maxHp * 15));
    }
  });

  let count = monsterCombatants.length;
  let mult = 1;
  if (count === 2) mult = 1.5;
  else if (count >= 3 && count <= 6) mult = 2;
  else if (count >= 7 && count <= 10) mult = 2.5;
  else if (count >= 11 && count <= 14) mult = 3;
  else if (count >= 15) mult = 4;

  const adjustedXp = Math.round(rawMonsterXp * mult);

  if (adjustedXp < budget[0]) {
    badge.className = 'diff-meter diff-trivial';
    badge.innerText = `Trivial (${adjustedXp} XP)`;
  } else if (adjustedXp < budget[1]) {
    badge.className = 'diff-meter diff-easy';
    badge.innerText = `🟢 Fácil (${adjustedXp} XP)`;
  } else if (adjustedXp < budget[2]) {
    badge.className = 'diff-meter diff-medium';
    badge.innerText = `🟡 Médio (${adjustedXp} XP)`;
  } else if (adjustedXp < budget[3]) {
    badge.className = 'diff-meter diff-hard';
    badge.innerText = `🟠 Difícil (${adjustedXp} XP)`;
  } else {
    badge.className = 'diff-meter diff-deadly';
    badge.innerText = `🔴 Mortal 💀 (${adjustedXp} XP)`;
  }
}

function broadcastCombatState(actionNarrative = null) {
  const payload = {
    type: 'COMBAT_UPDATE',
    round: state.round,
    turnIndex: state.turnIndex,
    combatants: state.combatants,
    actionNarrative: actionNarrative
  };
  
  if (syncChannel) {
    syncChannel.postMessage(payload);
  }
  
  try {
    localStorage.setItem('dnd5e_prisco_live_combat', JSON.stringify({
      ...payload,
      timestamp: Date.now()
    }));
  } catch (e) {}
}

if (syncChannel) {
  syncChannel.onmessage = (event) => {
    if (!event.data) return;
    
    if (event.data.type === 'COMBAT_UPDATE') {
      if (document.body.classList.contains('mode-screen-only')) {
        renderStandaloneScreen(event.data);
      }
    } else if (event.data.type === 'DICE_ROLL') {
      if (typeof showLiveDiceRoll === 'function') {
        showLiveDiceRoll(event.data.title, event.data.val, event.data.detail, event.data.isCrit, event.data.isFumble);
      }
    } else if (event.data.type === 'TIMER_TICK') {
      const timerEl = document.getElementById('pv-turn-timer');
      if (timerEl) {
        timerEl.innerText = event.data.timeStr;
        if (event.data.urgent) timerEl.classList.add('urgent');
        else timerEl.classList.remove('urgent');
      }
    } else if (event.data.type === 'TURN_TIMER_SYNC') {
      const timerEl = document.getElementById('pv-turn-timer');
      if (timerEl) {
        const m = Math.floor((event.data.remaining || 0) / 60);
        const s = (event.data.remaining || 0) % 60;
        const timeStr = `⏱️ ${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
        timerEl.innerText = timeStr;
        if (event.data.isUrgent) {
          timerEl.classList.add('urgent');
        } else {
          timerEl.classList.remove('urgent');
        }
        if (event.data.isExpired) {
          timerEl.innerText = '⌛ TEMPO ESGOTADO!';
          timerEl.classList.add('urgent');
        }
      }
    } else if (event.data.type === 'THEME_CHANGE') {
      setPlayerViewTheme(event.data.theme, false);
    } else if (event.data.type === 'GRID_PING') {
      if (typeof renderPingAnimation === 'function') {
        renderPingAnimation(event.data.x, event.data.y, true);
      }
    } else if (event.data.type === 'GRID_UPDATE') {
      gridState = event.data.gridState;
      const pvBoard = document.getElementById('pv-battlegrid-board');
      if (pvBoard) {
        if (gridState.theme === 'custom' && gridState.customImage) {
          pvBoard.className = 'battlegrid-board';
          pvBoard.style.backgroundImage = `url(${gridState.customImage})`;
        } else {
          pvBoard.className = `battlegrid-board ${gridState.theme || 'bg-dungeon'}`;
          pvBoard.style.backgroundImage = '';
        }
        if (gridState.lineStyle) {
          pvBoard.classList.remove('grid-lines-gold', 'grid-lines-dark', 'grid-lines-hidden');
          if (gridState.lineStyle === 'gold') pvBoard.classList.add('grid-lines-gold');
          else if (gridState.lineStyle === 'dark') pvBoard.classList.add('grid-lines-dark');
          else if (gridState.lineStyle === 'hidden') pvBoard.classList.add('grid-lines-hidden');
        }
      }
      if (typeof applyGridDimensions === 'function') applyGridDimensions();
      if (typeof renderBattleGrid === 'function') renderBattleGrid();

      const screenFoW = document.getElementById('fow-canvas-screen');
      if (screenFoW) {
        screenFoW.style.display = gridState.fowEnabled ? 'block' : 'none';
        if (gridState.fowEnabled && gridState.fowDataUrl && typeof loadFoWFromDataUrl === 'function') {
          loadFoWFromDataUrl(gridState.fowDataUrl);
        }
      }

      const overlay = document.getElementById('pv-weather-layer');
      if (overlay) {
        if (!gridState.weather || gridState.weather === 'none') {
          overlay.style.display = 'none';
          overlay.className = 'weather-overlay';
        } else {
          overlay.style.display = 'block';
          overlay.className = `weather-overlay weather-${gridState.weather}`;
        }
      }
      if (typeof redrawAllDrawings === 'function') redrawAllDrawings();
    } else if (event.data.type === 'RULER_UPDATE') {
      if (event.data.active) {
        if (typeof renderRulerSvg === 'function') {
          renderRulerSvg(event.data.startX, event.data.startY, event.data.endX, event.data.endY, true);
        }
      } else {
        if (typeof clearRulerSvg === 'function') {
          clearRulerSvg(true);
        }
      }
    } else if (event.data.type === 'PV_VIEW_MODE') {
      switchPlayerViewMode(event.data.mode, false);
    }
  };
}

window.addEventListener('storage', (e) => {
  if (e.key === 'dnd5e_prisco_live_combat' && e.newValue) {
    if (document.body.classList.contains('mode-screen-only')) {
      try {
        const data = JSON.parse(e.newValue);
        renderStandaloneScreen(data);
      } catch (err) {}
    }
  } else if (e.key === 'dnd5e_prisco_live_grid' && e.newValue) {
    try {
      gridState = JSON.parse(e.newValue);
      const pvBoard = document.getElementById('pv-battlegrid-board');
      if (pvBoard) {
        if (gridState.theme === 'custom' && gridState.customImage) {
          pvBoard.className = 'battlegrid-board';
          pvBoard.style.backgroundImage = `url(${gridState.customImage})`;
        } else {
          pvBoard.className = `battlegrid-board ${gridState.theme || 'bg-dungeon'}`;
          pvBoard.style.backgroundImage = '';
        }
      }
      if (typeof applyGridDimensions === 'function') applyGridDimensions();
      if (typeof renderBattleGrid === 'function') renderBattleGrid();

      const screenFoW = document.getElementById('fow-canvas-screen');
      if (screenFoW) {
        screenFoW.style.display = gridState.fowEnabled ? 'block' : 'none';
        if (gridState.fowEnabled && gridState.fowDataUrl && typeof loadFoWFromDataUrl === 'function') {
          loadFoWFromDataUrl(gridState.fowDataUrl);
        }
      }

      const overlay = document.getElementById('pv-weather-layer');
      if (overlay) {
        if (!gridState.weather || gridState.weather === 'none') {
          overlay.style.display = 'none';
          overlay.className = 'weather-overlay';
        } else {
          overlay.style.display = 'block';
          overlay.className = `weather-overlay weather-${gridState.weather}`;
        }
      }
    } catch (err) {}
  }
});

function setPlayerViewTheme(themeClass, broadcast = true) {
  const modal = document.getElementById('modal-player-view');
  if (modal) {
    modal.className = `player-view-overlay ${themeClass}` + (modal.classList.contains('standalone') ? ' standalone' : '');
  }
  const select = document.getElementById('pv-theme-select');
  if (select) select.value = themeClass;

  if (broadcast && syncChannel) {
    syncChannel.postMessage({ type: 'THEME_CHANGE', theme: themeClass });
  }
}

function openPlayerView() {
  try {
    const isFileProto = window.location.protocol === 'file:';
    const targetUrl = isFileProto ? (window.location.href.split('?')[0] + '?view=screen') : '?view=screen';
    
    playerViewWindow = window.open(
      targetUrl,
      'PriscoTelaoRPG',
      'width=1280,height=800,menubar=no,toolbar=no,location=no,status=no,resizable=yes'
    );
    
    if (playerViewWindow) {
      playerViewWindow.focus();
      setTimeout(broadcastCombatState, 300);
      return;
    }
  } catch (err) {
    console.warn('Bloqueador de popup ou erro ao abrir janela:', err);
  }
  
  const modal = document.getElementById('modal-player-view');
  if (modal) {
    modal.style.display = 'flex';
    renderPlayerView();
  }
}

function closePlayerView() {
  const modal = document.getElementById('modal-player-view');
  if (modal) modal.style.display = 'none';
}

function generatePlayerCardsHtml(combatants, turnIndex) {
  if (!combatants || combatants.length === 0) {
    return `<div style="color: #64748b; font-size: 18px; text-align: center; grid-column: 1 / -1; padding: 60px;">Aguardando início do combate pelo Mestre...</div>`;
  }

  return combatants.map((c, i) => {
    const isActive = i === turnIndex;
    const isPlayer = c.type === 'player';
    const hpPct = Math.max(0, Math.min(100, Math.round((c.hp / c.maxHp) * 100)));

    let statusPill = '';
    if (c.hp <= 0) {
      statusPill = `<span class="pv-status-pill pv-status-down">💀 Derrotado</span>`;
    } else if (hpPct > 75) {
      statusPill = `<span class="pv-status-pill pv-status-healthy">🟢 Saudável</span>`;
    } else if (hpPct > 25) {
      statusPill = `<span class="pv-status-pill pv-status-wounded">🟡 Ferido</span>`;
    } else {
      statusPill = `<span class="pv-status-pill pv-status-bloodied">🔴 Sangrando</span>`;
    }

    let condsHtml = '';
    if (c.conditions && c.conditions.length > 0) {
      condsHtml = `
        <div style="display: flex; flex-wrap: wrap; gap: 4px; margin-top: 4px;">
          ${c.conditions.map(cId => {
            const cond = CONDITIONS_LIST.find(x => x.id === cId);
            return `<span style="font-size: 10px; background: rgba(239, 68, 68, 0.2); border: 1px solid rgba(239,68,68,0.4); color: #fca5a5; padding: 2px 6px; border-radius: 4px;">${cond ? cond.name : cId}</span>`;
          }).join('')}
        </div>
      `;
    }

    const hpColor = hpPct > 50 ? 'var(--accent-green)' : (hpPct > 25 ? '#eab308' : 'var(--accent-red)');

    return `
      <div class="pv-card ${isActive ? 'active-turn' : ''}">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <div style="font-size: 20px; font-weight: 800; font-family: var(--font-title); color: #fff;">
              ${isActive ? '⚔️ ' : ''}${c.name}
            </div>
            <div style="font-size: 12px; color: #94a3b8; margin-top: 2px;">
              Iniciativa: <b style="color: var(--primary); font-size: 14px;">${c.init}</b> • CA: <b style="color: #fff;">${c.ac}</b>
            </div>
          </div>
          ${statusPill}
        </div>

        ${condsHtml}

        ${isPlayer ? `
          <div>
            <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: bold; margin-bottom: 4px;">
              <span>Vida do Herói</span>
              <span style="color: ${hpColor}; font-family: var(--font-mono);">${c.hp} / ${c.maxHp} PV</span>
            </div>
            <div class="hp-bar-bg" style="height: 10px;">
              <div class="hp-bar-fill" style="width: ${hpPct}%; background-color: ${hpColor};"></div>
            </div>
          </div>
        ` : `
          <div class="hp-bar-bg" style="height: 8px;">
            <div class="hp-bar-fill" style="width: ${hpPct}%; background-color: ${hpColor};"></div>
          </div>
        `}
      </div>
    `;
  }).join('');
}

function renderPlayerView(narrativeText = null) {
  broadcastCombatState(narrativeText);
  const modal = document.getElementById('modal-player-view');
  if (!modal || modal.style.display === 'none') return;

  const roundEl = document.getElementById('pv-round');
  if (roundEl) roundEl.innerText = state.round;
  const list = document.getElementById('pv-combat-list');
  if (!list) return;

  if (narrativeText) {
    const banner = document.getElementById('pv-action-banner');
    const textEl = document.getElementById('pv-action-text');
    if (banner && textEl) {
      banner.style.display = 'flex';
      textEl.innerHTML = narrativeText;
    }
  }

  list.innerHTML = generatePlayerCardsHtml(state.combatants, state.turnIndex);
}

function renderStandaloneScreen(data) {
  const roundEl = document.getElementById('pv-round');
  const listEl = document.getElementById('pv-combat-list');
  const banner = document.getElementById('pv-action-banner');
  const textEl = document.getElementById('pv-action-text');

  if (roundEl && data) roundEl.innerText = data.round || 1;
  if (listEl && data) {
    listEl.innerHTML = generatePlayerCardsHtml(data.combatants || [], data.turnIndex || 0);
  }
  if (data.actionNarrative && banner && textEl) {
    banner.style.display = 'flex';
    textEl.innerHTML = data.actionNarrative;
  }
}

function initStandaloneScreenMode() {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('view') === 'screen') {
    document.body.classList.add('mode-screen-only');
    const modal = document.getElementById('modal-player-view');
    if (modal) {
      modal.style.display = 'flex';
      modal.classList.add('standalone');
    }
    
    try {
      const cached = localStorage.getItem('dnd5e_prisco_live_combat');
      if (cached) {
        renderStandaloneScreen(JSON.parse(cached));
      } else {
        renderStandaloneScreen(state);
      }
    } catch (e) {
      renderStandaloneScreen(state);
    }

    try {
      const savedGrid = localStorage.getItem('dnd5e_prisco_live_grid');
      if (savedGrid) {
        gridState = JSON.parse(savedGrid);
        const pvBoard = document.getElementById('pv-battlegrid-board');
        if (pvBoard) {
          if (gridState.theme === 'custom' && gridState.customImage) {
            pvBoard.className = 'battlegrid-board';
            pvBoard.style.backgroundImage = `url(${gridState.customImage})`;
          } else if (gridState.theme) {
            pvBoard.className = `battlegrid-board ${gridState.theme}`;
            pvBoard.style.backgroundImage = '';
          }
        }
        if (typeof renderBattleGrid === 'function') renderBattleGrid();
        if (typeof applyGridDimensions === 'function') applyGridDimensions();

        const screenFoW = document.getElementById('fow-canvas-screen');
        if (screenFoW) {
          screenFoW.style.display = gridState.fowEnabled ? 'block' : 'none';
          if (gridState.fowEnabled && gridState.fowDataUrl && typeof loadFoWFromDataUrl === 'function') {
            loadFoWFromDataUrl(gridState.fowDataUrl);
          }
        }
      }
    } catch (e) {}
  }
}

function switchPlayerViewMode(mode, broadcast = true) {
  const cardsEl = document.getElementById('pv-combat-list');
  const gridEl = document.getElementById('pv-grid-display');
  const btnCards = document.getElementById('pv-view-cards-btn');
  const btnGrid = document.getElementById('pv-view-grid-btn');

  if (mode === 'grid') {
    if (cardsEl) cardsEl.style.display = 'none';
    if (gridEl) gridEl.style.display = 'flex';
    if (btnGrid) { btnGrid.style.background = 'var(--primary)'; btnGrid.style.color = '#000'; btnGrid.style.fontWeight = '700'; }
    if (btnCards) { btnCards.style.background = 'transparent'; btnCards.style.color = '#cbd5e1'; btnCards.style.fontWeight = 'normal'; }
  } else {
    if (cardsEl) cardsEl.style.display = 'grid';
    if (gridEl) gridEl.style.display = 'none';
    if (btnCards) { btnCards.style.background = 'var(--primary)'; btnCards.style.color = '#000'; btnCards.style.fontWeight = '700'; }
    if (btnGrid) { btnGrid.style.background = 'transparent'; btnGrid.style.color = '#cbd5e1'; btnGrid.style.fontWeight = 'normal'; }
  }

  if (broadcast && syncChannel) {
    syncChannel.postMessage({ type: 'PV_VIEW_MODE', mode });
  }
}

// --- ATALHOS DE TECLADO & GERENCIAMENTO DE MODAIS ---
window.addEventListener('keydown', e => {
  // Fecha modais com tecla ESC
  if (e.key === 'Escape' || e.code === 'Escape') {
    closeAllModals();
    return;
  }

  // Ignora atalhos de combate se estiver digitando ou com modal aberto
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT' || e.target.isContentEditable) return;
  if (document.querySelector('.modal-overlay.open') || (document.getElementById('modal-player-view') && document.getElementById('modal-player-view').style.display !== 'none')) return;

  if (e.code === 'Space') {
    e.preventDefault();
    if (typeof nextTurn === 'function') nextTurn();
  } else if (e.code === 'KeyD') {
    if (typeof openDiceModal === 'function') openDiceModal();
  }
});

function closeAllModals() {
  document.querySelectorAll('.modal-overlay.open').forEach(el => el.classList.remove('open'));
  const pv = document.getElementById('modal-player-view');
  if (pv) pv.style.display = 'none';
}

// Auto-save listeners e clique fora para fechar modais
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('open');
      }
    });
  });
});

// --- INICIALIZAÇÃO GERAL ---
function renderAll() {
  if (typeof initScenes === 'function') initScenes();
  if (typeof renderCombat === 'function') renderCombat();
  if (typeof syncCombatantsToGrid === 'function' && (!gridState.tokens || gridState.tokens.length === 0)) {
    syncCombatantsToGrid();
  }
  if (typeof applyGridDimensions === 'function') applyGridDimensions();
  if (gridState.theme === 'custom' && gridState.customImage) {
    const opt = document.getElementById('opt-custom-map');
    const sel = document.getElementById('bg-map-theme');
    if (opt) opt.style.display = 'block';
    if (sel) sel.value = 'custom';
    if (typeof setGridMapBackground === 'function') setGridMapBackground('custom');
  } else if (gridState.theme) {
    const sel = document.getElementById('bg-map-theme');
    if (sel) sel.value = gridState.theme;
    if (typeof setGridMapBackground === 'function') setGridMapBackground(gridState.theme);
  }
  if (typeof renderBattleGrid === 'function') renderBattleGrid();
  if (typeof redrawAllDrawings === 'function') redrawAllDrawings();
  if (typeof renderPlayers === 'function') renderPlayers();
  if (typeof renderSpells === 'function') renderSpells();
  if (typeof renderBestiary === 'function') renderBestiary();
  if (typeof renderEquipment === 'function') renderEquipment();
  if (typeof renderClasses === 'function') renderClasses();
  if (typeof renderSpecies === 'function') renderSpecies();
  if (typeof renderCampaigns === 'function') renderCampaigns();
  if (typeof renderLogs === 'function') renderLogs();
  if (typeof nextPuzzle === 'function') nextPuzzle();
}

window.onload = () => {
  initStandaloneScreenMode();
  loadFromLocalStorage();
  try {
    const savedGrid = localStorage.getItem('dnd5e_prisco_live_grid');
    if (savedGrid) {
      gridState = JSON.parse(savedGrid);
    }
  } catch (e) {}
  if (typeof initScenes === 'function') initScenes();
  renderAll();
  if (typeof checkPlayerPortalUrl === 'function') checkPlayerPortalUrl();
};
