// src/js/dice_roller.js - Rolador de Dados Global Flutuante, Histórico e Sincronização Telão

let GLOBAL_DICE_HISTORY = [];
let isDiceDrawerOpen = false;

function initDiceRoller() {
  try {
    const raw = sessionStorage.getItem('dnd5e_prisco_dice_history');
    if (raw) {
      GLOBAL_DICE_HISTORY = JSON.parse(raw);
    }
  } catch (e) {}
}

function saveDiceHistory() {
  try {
    sessionStorage.setItem('dnd5e_prisco_dice_history', JSON.stringify(GLOBAL_DICE_HISTORY.slice(0, 20)));
  } catch (e) {}
}

function toggleGlobalDiceDrawer(forceState) {
  const drawer = document.getElementById('global-dice-drawer');
  if (!drawer) return;
  if (typeof forceState === 'boolean') {
    isDiceDrawerOpen = forceState;
  } else {
    isDiceDrawerOpen = !isDiceDrawerOpen;
  }
  
  if (isDiceDrawerOpen) {
    drawer.classList.add('open');
    renderGlobalDiceHistory();
  } else {
    drawer.classList.remove('open');
  }
}

function rollGlobalDice(sides, count = 1, mod = 0, mode = 'normal', label = '') {
  sides = parseInt(sides) || 20;
  count = Math.max(1, parseInt(count) || 1);
  mod = parseInt(mod) || 0;

  let rolls = [];
  let total = 0;
  let isCrit = false;
  let isFumble = false;
  let breakdownStr = '';

  if (sides === 20 && (mode === 'adv' || mode === 'dis')) {
    const r1 = Math.floor(Math.random() * 20) + 1;
    const r2 = Math.floor(Math.random() * 20) + 1;
    const chosen = mode === 'adv' ? Math.max(r1, r2) : Math.min(r1, r2);
    const discarded = mode === 'adv' ? Math.min(r1, r2) : Math.max(r1, r2);
    total = chosen + mod;
    isCrit = chosen === 20;
    isFumble = chosen === 1;
    const tag = mode === 'adv' ? 'Vantagem' : 'Desvantagem';
    breakdownStr = `2d20 [${r1}, ${r2}] ➔ Usado ${chosen} (${tag})${mod !== 0 ? (mod > 0 ? ' +' + mod : ' ' + mod) : ''}`;
  } else {
    for (let i = 0; i < count; i++) {
      const r = Math.floor(Math.random() * sides) + 1;
      rolls.push(r);
      total += r;
    }
    total += mod;
    if (sides === 20 && count === 1) {
      if (rolls[0] === 20) isCrit = true;
      if (rolls[0] === 1) isFumble = true;
    }
    breakdownStr = `${count}d${sides} [${rolls.join(', ')}]${mod !== 0 ? (mod > 0 ? ' +' + mod : ' ' + mod) : ''}`;
  }

  const resultObj = {
    id: 'roll_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    sides,
    count,
    mod,
    mode,
    label: label || `Rolagem d${sides}`,
    total,
    isCrit,
    isFumble,
    breakdown: breakdownStr
  };

  GLOBAL_DICE_HISTORY.unshift(resultObj);
  if (GLOBAL_DICE_HISTORY.length > 30) GLOBAL_DICE_HISTORY.pop();
  saveDiceHistory();

  // Efeitos Sonoros e Logs
  if (isCrit) {
    if (typeof playFX === 'function') playFX('crit');
    if (typeof addLog === 'function') addLog(`🔥 <b>CRÍTICO (Nat 20)!</b> Rolagem de <b>${resultObj.label}</b>: <b>${total}</b> (${breakdownStr})`);
  } else if (isFumble) {
    if (typeof playFX === 'function') playFX('fumble');
    if (typeof addLog === 'function') addLog(`💀 <b>FALHA CRÍTICA (Nat 1)!</b> Rolagem de <b>${resultObj.label}</b>: <b>${total}</b> (${breakdownStr})`);
  } else {
    if (typeof playFX === 'function') playFX('sword');
    if (typeof addLog === 'function') addLog(`🎲 Rolagem de <b>${resultObj.label}</b>: <b>${total}</b> (${breakdownStr})`);
  }

  // Atualiza Banner do Modal e Drawer Flutuante
  updateDiceResultUI(resultObj);

  // Broadcast via Web Channel para sincronizar com Telão
  if (typeof syncChannel !== 'undefined' && syncChannel) {
    try {
      syncChannel.postMessage({
        type: 'GLOBAL_DICE_ROLL',
        roll: resultObj
      });
    } catch (e) {}
  }

  renderGlobalDiceHistory();
  return resultObj;
}

function rollGlobalFormula(formulaStr, customLabel = '') {
  if (!formulaStr || !formulaStr.trim()) return null;
  const clean = formulaStr.replace(/\s+/g, '').toLowerCase();

  // Pattern ex: 3d6+4, 1d20-2, 2d8, d20, 10
  const match = clean.match(/^(\d*)d(\d+)([+-]\d+)?$/i);
  if (match) {
    const count = match[1] ? parseInt(match[1]) : 1;
    const sides = parseInt(match[2]);
    const mod = match[3] ? parseInt(match[3]) : 0;
    return rollGlobalDice(sides, count, mod, 'normal', customLabel || formulaStr);
  }

  // Apenas número constante
  if (/^[+-]?\d+$/.test(clean)) {
    const val = parseInt(clean);
    const res = {
      id: 'roll_' + Date.now(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      total: val,
      label: customLabel || 'Valor Fixo',
      breakdown: `Constante: ${val}`
    };
    GLOBAL_DICE_HISTORY.unshift(res);
    saveDiceHistory();
    updateDiceResultUI(res);
    renderGlobalDiceHistory();
    return res;
  }

  alert('Fórmula inválida! Use formatos como 1d20+5, 3d6, 2d8+3, etc.');
  return null;
}

function updateDiceResultUI(res) {
  // Widget flutuante
  const numEl = document.getElementById('floating-dice-result-num');
  const breakEl = document.getElementById('floating-dice-result-breakdown');
  const labelEl = document.getElementById('floating-dice-result-label');
  const boxEl = document.getElementById('floating-dice-last-box');

  if (boxEl) {
    boxEl.style.display = 'block';
    boxEl.classList.remove('crit-glow', 'fumble-glow');
    if (res.isCrit) boxEl.classList.add('crit-glow');
    if (res.isFumble) boxEl.classList.add('fumble-glow');
  }

  if (numEl) {
    numEl.innerText = res.total;
    numEl.style.color = res.isCrit ? 'var(--accent-green)' : (res.isFumble ? 'var(--accent-red)' : 'var(--primary-light)');
  }
  if (breakEl) breakEl.innerText = res.breakdown;
  if (labelEl) labelEl.innerText = res.label || 'Resultado:';

  // Atualiza modal existente também se estiver aberto
  const banner = document.getElementById('dice-banner');
  const totalNum = document.getElementById('dice-total-number');
  const breakText = document.getElementById('dice-breakdown-text');
  const detailText = document.getElementById('dice-detail-text');
  if (banner && totalNum && breakText) {
    banner.style.display = 'block';
    totalNum.innerText = res.total;
    breakText.innerText = res.breakdown;
    if (detailText) detailText.innerText = res.label || 'Resultado da Rolagem';
  }
}

function renderGlobalDiceHistory() {
  const container = document.getElementById('global-dice-history-list');
  if (!container) return;

  if (GLOBAL_DICE_HISTORY.length === 0) {
    container.innerHTML = `<div style="text-align: center; color: var(--text-dim); font-size: 11px; padding: 12px;">Nenhuma rolagem recente.</div>`;
    return;
  }

  container.innerHTML = GLOBAL_DICE_HISTORY.slice(0, 15).map(h => {
    let color = 'var(--text-main)';
    let tag = '';
    if (h.isCrit) {
      color = 'var(--accent-green)';
      tag = `<span class="badge badge-cls" style="background:rgba(16,185,129,0.2); color:#34d399; font-size:9px;">NAT 20</span>`;
    } else if (h.isFumble) {
      color = 'var(--accent-red)';
      tag = `<span class="badge badge-cls" style="background:rgba(239,68,68,0.2); color:#f87171; font-size:9px;">NAT 1</span>`;
    }

    return `
      <div class="dice-history-item" onclick="repeatDiceRoll('${h.id}')" title="Clique para rolar novamente">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="font-weight: 700; font-size: 12px; color: var(--primary-light);">${h.label || 'Rolagem'}</span>
          <div style="display: flex; gap: 4px; align-items: center;">
            ${tag}
            <span style="font-size: 10px; color: var(--text-dim);">${h.timestamp}</span>
          </div>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-top: 2px;">
          <span style="font-size: 11px; color: var(--text-muted);">${h.breakdown}</span>
          <span style="font-size: 16px; font-weight: 900; font-family: var(--font-mono); color: ${color};">${h.total}</span>
        </div>
      </div>
    `;
  }).join('');
}

function repeatDiceRoll(historyId) {
  const item = GLOBAL_DICE_HISTORY.find(x => x.id === historyId);
  if (!item) return;
  rollGlobalDice(item.sides, item.count, item.mod, item.mode, item.label);
}

function clearGlobalDiceHistory() {
  if (confirm('Deseja limpar todo o histórico de rolagens?')) {
    GLOBAL_DICE_HISTORY = [];
    saveDiceHistory();
    renderGlobalDiceHistory();
    const boxEl = document.getElementById('floating-dice-last-box');
    if (boxEl) boxEl.style.display = 'none';
  }
}

// Inicializa ao carregar
if (typeof window !== 'undefined') {
  initDiceRoller();
}
