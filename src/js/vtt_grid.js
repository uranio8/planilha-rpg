// src_js_vtt_grid.js - Virtual Tabletop Grid, Tokens (1x1 a 4x4), Pan & Zoom, AoE, Marcadores, Névoa, Pings, Cenas e Desenhos

let gridState = {
  theme: 'bg-dungeon',
  lineStyle: 'default',
  showCoords: false,
  customImage: null,
  cellSize: 50,
  width: 1200,
  height: 800,
  weather: 'none',
  fowEnabled: false,
  fowDataUrl: null,
  zoom: 1.0,
  panX: 0,
  panY: 0,
  markers: [], // { id, label, x, y }
  aoeTemplates: [], // { id, type, label, x, y, width, height }
  tokens: [], // { id, combatantId, name, type, x, y, size: 'medium', altitude: 0, hidden: false }
  drawings: [] // { color, size, points: [{x, y}] }
};

// GESTOR DE CENAS E MULTI-MAPAS
let scenesState = {
  activeSceneId: 'scene-1',
  scenes: [
    {
      id: 'scene-1',
      name: '🏰 1. Entrada da Masmorra',
      theme: 'bg-dungeon',
      lineStyle: 'default',
      showCoords: false,
      customImage: null,
      cellSize: 50,
      width: 1200,
      height: 800,
      weather: 'none',
      fowEnabled: false,
      fowDataUrl: null,
      markers: [],
      aoeTemplates: [],
      tokens: [],
      drawings: []
    }
  ]
};

// Debounced saveToLocalStorage para movimentações e arraste contínuo no VTT
let _vttSaveTimeout = null;
function debouncedVttSave(delay = 400) {
  if (_vttSaveTimeout) clearTimeout(_vttSaveTimeout);
  _vttSaveTimeout = setTimeout(() => {
    saveToLocalStorage();
    _vttSaveTimeout = null;
  }, delay);
}

// ESTADO DAS FERRAMENTAS DO VTT
let activeVttTool = 'select'; // 'select' | 'ruler' | 'draw' | 'ping'
let activeDrawingColor = '#f59e0b';
let activeDrawingSize = 3; // 2 = fino, 3 = médio, 6 = grosso
let isDrawingStroke = false;
let currentDrawingPath = [];
let drawingUndoStack = []; // Stack de strokes para Ctrl+Z
let rulerOrigin = null;
let isRulerMeasuring = false;

let draggingToken = null;
let draggingMarker = null;
let draggingAoE = null;
let dragOffset = { x: 0, y: 0 };
let measuringOrigin = null;
let isPanModeActive = false;
let isPanningViewport = false;
let panStart = { x: 0, y: 0 };
let activeContextMenuTokenId = null;
let fowBrushCellMultiplier = 1.5; // 1x=small, 1.5x=medium, 2.5x=large

// --- B1: FUNÇÃO UTILITÁRIA UNIFICADA DE CONVERSÃO DE COORDENADAS ---
// Converte coordenadas de tela (clientX/Y) para coordenadas do board (espaço nativo do mapa)
function clientToBoard(clientX, clientY) {
  const board = document.getElementById('battlegrid-board');
  if (!board) return { x: 0, y: 0 };
  const rect = board.getBoundingClientRect();
  const z = gridState.zoom || 1.0;
  return {
    x: (clientX - rect.left) / z,
    y: (clientY - rect.top) / z
  };
}

// Converte coordenadas de tela para o canvas de desenho (que tem resolução nativa)
// O canvas CSS tem 100%/100% mas a resolução interna é 1200x800
// getBoundingClientRect() retorna dimensões visuais pós-zoom → scaleX corrige
function clientToCanvas(clientX, clientY, canvasEl) {
  if (!canvasEl) return { x: 0, y: 0 };
  const rect = canvasEl.getBoundingClientRect();
  const scaleX = canvasEl.width / rect.width;
  const scaleY = canvasEl.height / rect.height;
  return {
    x: (clientX - rect.left) * scaleX,
    y: (clientY - rect.top) * scaleY
  };
}

// --- CLIMA E EFEITOS AMBIENTAIS ---
function setWeatherEffect(weatherType) {
  gridState.weather = weatherType;
  const overlay = document.getElementById('pv-weather-layer');
  if (overlay) {
    if (weatherType === 'none') {
      overlay.style.display = 'none';
      overlay.className = 'weather-overlay';
    } else {
      overlay.style.display = 'block';
      overlay.className = `weather-overlay weather-${weatherType}`;
    }
  }
  const sel = document.getElementById('sel-weather-effect');
  if (sel) sel.value = weatherType;
  broadcastGridState();
  saveToLocalStorage();
}

// --- ESTILO DE LINHAS DE GRADE ---
function setGridLineStyle(style) {
  gridState.lineStyle = style;
  const board = document.getElementById('battlegrid-board');
  const pvBoard = document.getElementById('pv-battlegrid-board');
  const sel = document.getElementById('sel-grid-line-style');
  if (sel) sel.value = style;

  [board, pvBoard].forEach(b => {
    if (b) {
      b.classList.remove('grid-lines-gold', 'grid-lines-dark', 'grid-lines-hidden');
      if (style === 'gold') b.classList.add('grid-lines-gold');
      else if (style === 'dark') b.classList.add('grid-lines-dark');
      else if (style === 'hidden') b.classList.add('grid-lines-hidden');
    }
  });

  broadcastGridState();
  saveToLocalStorage();
}

// --- RÉGUA DE COORDENADAS TÁTICAS (A-Z / 1-50) ---
function toggleGridCoordinates() {
  gridState.showCoords = !gridState.showCoords;
  const btn = document.getElementById('btn-toggle-coords');
  if (btn) {
    if (gridState.showCoords) {
      btn.style.background = 'var(--primary)';
      btn.style.color = '#000';
      btn.style.fontWeight = '700';
    } else {
      btn.style.background = 'var(--bg-surface-elevated)';
      btn.style.color = 'var(--text-main)';
      btn.style.fontWeight = 'normal';
    }
  }
  renderGridCoordinates();
  broadcastGridState();
  saveToLocalStorage();
}

function renderGridCoordinates() {
  const topEl = document.getElementById('grid-coord-top');
  const leftEl = document.getElementById('grid-coord-left');
  if (!topEl || !leftEl) return;

  if (!gridState.showCoords) {
    topEl.style.display = 'none';
    leftEl.style.display = 'none';
    return;
  }

  const w = gridState.width || 1200;
  const h = gridState.height || 800;
  const cSize = gridState.cellSize || 50;
  const cols = Math.floor(w / cSize);
  const rows = Math.floor(h / cSize);

  topEl.style.display = 'flex';
  topEl.style.width = `${w}px`;
  leftEl.style.display = 'flex';
  leftEl.style.height = `${h}px`;

  // Gera letras de coluna (A, B... Z, AA, AB...)
  const getColLetter = (index) => {
    let letter = '';
    let temp = index;
    while (temp >= 0) {
      letter = String.fromCharCode((temp % 26) + 65) + letter;
      temp = Math.floor(temp / 26) - 1;
    }
    return letter;
  };

  let topHtml = '';
  for (let c = 0; c < cols; c++) {
    topHtml += `<div class="grid-coord-cell" style="width: ${cSize}px; height: 24px;">${getColLetter(c)}</div>`;
  }
  topEl.innerHTML = topHtml;

  let leftHtml = '';
  for (let r = 0; r < rows; r++) {
    leftHtml += `<div class="grid-coord-cell" style="width: 24px; height: ${cSize}px;">${r + 1}</div>`;
  }
  leftEl.innerHTML = leftHtml;
}

// --- SISTEMA DE ZOOM & PAN INTELIGENTE (ZOOM-TO-CURSOR & MULTI-PAN) ---
let isSpacePressed = false;
let hasPannedWithRightClick = false;
let panStartPointer = { x: 0, y: 0 };
let isCombatantsDrawerOpen = false;

function zoomBattleGrid(delta, clientX, clientY) {
  const currentZoom = gridState.zoom || 1.0;
  const targetZoom = Math.max(0.35, Math.min(2.5, currentZoom + delta));
  zoomBattleGridToTarget(targetZoom, clientX, clientY);
}

function zoomBattleGridToTarget(targetZoom, clientX, clientY) {
  const oldZoom = gridState.zoom || 1.0;
  const newZoom = Math.max(0.35, Math.min(2.5, Math.round(targetZoom * 100) / 100));
  const viewport = document.getElementById('battlegrid-viewport');
  
  if (!viewport || oldZoom === newZoom) {
    gridState.zoom = newZoom;
    applyGridTransform();
    return;
  }

  const rect = (viewport && typeof viewport.getBoundingClientRect === 'function')
    ? viewport.getBoundingClientRect()
    : { left: 0, top: 0, width: 1200, height: 800 };
  const vx = (clientX !== undefined && clientX !== null ? clientX : (rect.left + rect.width / 2)) - rect.left;
  const vy = (clientY !== undefined && clientY !== null ? clientY : (rect.top + rect.height / 2)) - rect.top;

  const oldPanX = gridState.panX || 0;
  const oldPanY = gridState.panY || 0;

  // Preserva a posição do ponto sob o cursor (zoom-to-cursor)
  const newPanX = vx - (vx - oldPanX) * (newZoom / oldZoom);
  const newPanY = vy - (vy - oldPanY) * (newZoom / oldZoom);

  gridState.zoom = newZoom;
  gridState.panX = Math.round(newPanX);
  gridState.panY = Math.round(newPanY);

  applyGridTransform();
  saveToLocalStorage();
}

function resetBattleGridZoom() {
  const viewport = document.getElementById('battlegrid-viewport');
  const vpW = viewport ? viewport.clientWidth : 1200;
  const vpH = viewport ? viewport.clientHeight : 800;
  const mapW = gridState.width || 1200;
  const mapH = gridState.height || 800;

  gridState.zoom = 1.0;
  gridState.panX = Math.round((vpW - mapW) / 2);
  gridState.panY = Math.round((vpH - mapH) / 2);
  applyGridTransform();
  saveToLocalStorage();
}

function fitBattleGridToView() {
  const viewport = document.getElementById('battlegrid-viewport');
  if (!viewport) return;

  const vpW = viewport.clientWidth;
  const vpH = viewport.clientHeight;
  const mapW = gridState.width || 1200;
  const mapH = gridState.height || 800;

  const scale = Math.min((vpW - 40) / mapW, (vpH - 40) / mapH, 1.5);
  gridState.zoom = Math.max(0.35, Math.min(2.0, Math.round(scale * 100) / 100));
  gridState.panX = Math.round((vpW - mapW * gridState.zoom) / 2);
  gridState.panY = Math.round((vpH - mapH * gridState.zoom) / 2);
  applyGridTransform();
  saveToLocalStorage();
}

function focusActiveToken() {
  const currentActive = state.combatants[state.turnIndex];
  if (!currentActive) {
    fitBattleGridToView();
    return;
  }
  const token = (gridState.tokens || []).find(t => t.combatantId === currentActive.id);
  const viewport = document.getElementById('battlegrid-viewport');
  if (!viewport) return;

  const cSize = gridState.cellSize || 50;
  const tokX = token ? token.x + cSize / 2 : (gridState.width || 1200) / 2;
  const tokY = token ? token.y + cSize / 2 : (gridState.height || 800) / 2;

  const vpW = viewport.clientWidth;
  const vpH = viewport.clientHeight;
  const z = gridState.zoom || 1.0;

  gridState.panX = Math.round(vpW / 2 - tokX * z);
  gridState.panY = Math.round(vpH / 2 - tokY * z);
  applyGridTransform();
  triggerGridPing(tokX, tokY);
  saveToLocalStorage();
}

function toggleGridFullscreen() {
  const container = document.querySelector('.battlegrid-container');
  if (!container) return;
  const isFull = container.classList.toggle('is-fullscreen');
  const btn = document.getElementById('btn-toggle-fullscreen');
  if (btn) {
    btn.innerHTML = isFull ? '✕' : '⛶';
    btn.title = isFull ? 'Sair da Tela Cheia' : 'Modo Tela Cheia';
  }
  setTimeout(() => {
    fitBattleGridToView();
  }, 100);
}

function toggleCombatantsDrawer() {
  isCombatantsDrawerOpen = !isCombatantsDrawerOpen;
  const drawer = document.getElementById('grid-combatants-drawer');
  const btn = document.getElementById('btn-toggle-combatants-drawer');
  if (drawer) {
    drawer.classList.toggle('open', isCombatantsDrawerOpen);
  }
  if (btn) {
    btn.classList.toggle('active', isCombatantsDrawerOpen);
  }
  renderGridCombatantsDrawer();
}

function renderGridCombatantsDrawer() {
  const listEl = document.getElementById('grid-combatants-drawer-list');
  if (!listEl) return;

  const combatants = state.combatants || [];
  if (combatants.length === 0) {
    listEl.innerHTML = '<div style="color: var(--text-muted); font-size: 11px; text-align: center; padding: 12px;">Nenhum combatente ativo no combate.</div>';
    return;
  }

  const currentActive = combatants[state.turnIndex];

  listEl.innerHTML = combatants.map((c) => {
    const isPlayer = c.type === 'player';
    const isActive = currentActive && currentActive.id === c.id;
    const token = (gridState.tokens || []).find(t => t.combatantId === c.id);
    const isHidden = token ? !!token.hidden : false;
    const hpPct = c.maxHp ? Math.max(0, Math.min(100, Math.round((c.hp / c.maxHp) * 100))) : 100;
    const hpColor = hpPct > 50 ? '#10b981' : (hpPct > 25 ? '#eab308' : '#ef4444');

    return `
      <div class="drawer-combatant-card ${isActive ? 'active-turn' : ''} ${isPlayer ? 'is-player' : 'is-monster'}" onclick="focusTokenById('${token ? token.id : ''}')">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div style="font-weight: 700; font-size: 11px; color: ${isPlayer ? 'var(--primary-light)' : '#f87171'}; display: flex; align-items: center; gap: 4px;">
            <span>${isActive ? '➔ ' : ''}${c.name}</span>
          </div>
          <span style="font-size: 10px; font-weight: bold; color: ${hpColor};">${c.hp}/${c.maxHp} PV</span>
        </div>
        <div style="background: rgba(0,0,0,0.5); height: 4px; border-radius: 2px; margin-top: 4px; overflow: hidden;">
          <div style="width: ${hpPct}%; height: 100%; background: ${hpColor};"></div>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px; font-size: 10px;">
          <span style="color: var(--text-dim);">Inic: <b>${c.init}</b> | CA: <b>${c.ac}</b></span>
          <div style="display: flex; gap: 4px;" onclick="event.stopPropagation();">
            ${token ? `<button class="btn-drawer-mini" onclick="toggleTokenHidden('${token.id}')" title="${isHidden ? 'Revelar no Telão' : 'Ocultar no Telão'}">${isHidden ? '👁️' : '👁️‍🗨️'}</button>` : ''}
            <button class="btn-drawer-mini" onclick="quickPingCombatant('${c.id}')" title="Emitir Ping no Mapa">📍</button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function focusTokenById(tokId) {
  if (!tokId) return;
  const token = (gridState.tokens || []).find(t => t.id === tokId);
  if (!token) return;
  const viewport = document.getElementById('battlegrid-viewport');
  if (!viewport) return;

  const cSize = gridState.cellSize || 50;
  const tokX = token.x + cSize / 2;
  const tokY = token.y + cSize / 2;
  const vpW = viewport.clientWidth;
  const vpH = viewport.clientHeight;
  const z = gridState.zoom || 1.0;

  gridState.panX = Math.round(vpW / 2 - tokX * z);
  gridState.panY = Math.round(vpH / 2 - tokY * z);
  applyGridTransform();
  triggerGridPing(tokX, tokY);
  saveToLocalStorage();
}

function quickPingCombatant(cId) {
  const token = (gridState.tokens || []).find(t => t.combatantId === cId);
  if (token) {
    const cSize = gridState.cellSize || 50;
    triggerGridPing(token.x + cSize / 2, token.y + cSize / 2);
  }
}

function applyGridTransform() {
  const layer = document.getElementById('battlegrid-transform-layer');
  const badge = document.getElementById('grid-zoom-level-badge');

  if (badge) {
    badge.innerText = `${Math.round((gridState.zoom || 1.0) * 100)}%`;
  }

  if (layer) {
    const z = gridState.zoom || 1.0;
    const px = gridState.panX || 0;
    const py = gridState.panY || 0;
    layer.style.transform = `translate(${px}px, ${py}px) scale(${z})`;
  }
}

function togglePanMode() {
  isPanModeActive = !isPanModeActive;
  updatePanModeUI();
}

function setPanMode(active) {
  isPanModeActive = !!active;
  updatePanModeUI();
}

function updatePanModeUI() {
  const btnPan = document.getElementById('btn-toggle-pan-mode');
  const btnSelect = document.getElementById('btn-tool-select');
  const viewport = document.getElementById('battlegrid-viewport');

  if (btnPan) {
    if (isPanModeActive) {
      btnPan.classList.add('active');
    } else {
      btnPan.classList.remove('active');
    }
  }
  if (btnSelect) {
    if (!isPanModeActive) {
      btnSelect.classList.add('active');
    } else {
      btnSelect.classList.remove('active');
    }
  }
  if (viewport) {
    if (isPanModeActive || isSpacePressed) viewport.classList.add('mode-pan');
    else viewport.classList.remove('mode-pan');
  }
}

function handleGridWheelZoom(e) {
  // Se o usuário segurar Shift, permite que o navegador faça scroll normal da página
  if (e.shiftKey) {
    return;
  }

  e.preventDefault();
  e.stopPropagation();

  // Suavização do deltaY (evita zoom desenfreado em touchpads e mouses livres)
  const delta = -e.deltaY;
  const clampedDelta = Math.max(-100, Math.min(100, delta));
  
  // Fator exponencial suave para controle milimétrico
  const factor = Math.exp(clampedDelta * 0.0018);
  const currentZoom = gridState.zoom || 1.0;
  let targetZoom = currentZoom * factor;

  // Garante passo mínimo perceptível se o delta for sutil
  if (Math.abs(targetZoom - currentZoom) < 0.02) {
    targetZoom = currentZoom + (delta > 0 ? 0.08 : -0.08);
  }

  zoomBattleGridToTarget(targetZoom, e.clientX, e.clientY);
}

function scrollGridIntoFocus() {
  const container = document.getElementById('battlegrid-container') || document.getElementById('battlegrid-viewport');
  if (container && typeof container.scrollIntoView === 'function') {
    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function toggleGridFullscreen() {
  const container = document.getElementById('battlegrid-container') || document.getElementById('battlegrid-viewport');
  if (!container) return;
  const isFs = container.classList.toggle('is-fullscreen');
  const btn = document.getElementById('btn-toggle-fullscreen');
  if (btn) btn.innerText = isFs ? '❌' : '⛶';
  setTimeout(() => {
    fitBattleGridToView();
  }, 100);
}

function handleViewportMouseDown(e) {
  // Pan com: Botão Direito (2), Botão do Meio (1), ou Botão Esquerdo (0) se modo Pan ativo ou Espaço pressionado
  if (e.button === 2 || e.button === 1 || (e.button === 0 && (isPanModeActive || isSpacePressed))) {
    e.preventDefault();
    if (e.button === 2) hasPannedWithRightClick = false;

    isPanningViewport = true;
    panStartPointer = { x: e.clientX, y: e.clientY };
    panStart = {
      x: e.clientX - (gridState.panX || 0),
      y: e.clientY - (gridState.panY || 0)
    };

    const viewport = document.getElementById('battlegrid-viewport');
    if (viewport) viewport.classList.add('is-panning');

    const onPanMove = (moveEv) => {
      if (!isPanningViewport) return;
      const dx = Math.abs(moveEv.clientX - panStartPointer.x);
      const dy = Math.abs(moveEv.clientY - panStartPointer.y);
      if (dx > 4 || dy > 4) {
        hasPannedWithRightClick = true;
      }

      gridState.panX = moveEv.clientX - panStart.x;
      gridState.panY = moveEv.clientY - panStart.y;
      applyGridTransform();
    };

    const onPanEnd = () => {
      isPanningViewport = false;
      if (viewport) viewport.classList.remove('is-panning');
      document.removeEventListener('mousemove', onPanMove);
      document.removeEventListener('mouseup', onPanEnd);
      saveToLocalStorage();
    };

    document.addEventListener('mousemove', onPanMove);
    document.addEventListener('mouseup', onPanEnd);
  }
}

// --- GESTÃO DE CENAS E MULTI-MAPAS ---
function initScenes() {
  try {
    const saved = localStorage.getItem('dnd5e_prisco_scenes_v2');
    if (saved) {
      scenesState = JSON.parse(saved);
      if (!scenesState.scenes || scenesState.scenes.length === 0) {
        scenesState.scenes = [createDefaultSceneObject('scene-1', '🏰 1. Entrada da Masmorra', gridState.theme || 'bg-dungeon')];
      }
    } else {
      scenesState = {
        activeSceneId: 'scene-1',
        scenes: [createDefaultSceneObject('scene-1', '🏰 1. Entrada da Masmorra', gridState.theme || 'bg-dungeon')]
      };
    }
  } catch (e) {
    console.warn('Erro ao carregar cenas:', e);
  }
  renderSceneSelector();
}

function createDefaultSceneObject(id, name, theme) {
  return {
    id: id,
    name: name,
    theme: theme || 'bg-dungeon',
    lineStyle: gridState.lineStyle || 'default',
    showCoords: !!gridState.showCoords,
    customImage: gridState.customImage || null,
    cellSize: gridState.cellSize || 50,
    width: gridState.width || 1200,
    height: gridState.height || 800,
    weather: gridState.weather || 'none',
    fowEnabled: !!gridState.fowEnabled,
    fowDataUrl: gridState.fowDataUrl || null,
    markers: (gridState.markers || []).map(m => ({ ...m })),
    aoeTemplates: (gridState.aoeTemplates || []).map(a => ({ ...a })),
    tokens: (gridState.tokens || []).map(t => ({ ...t })),
    drawings: (gridState.drawings || []).map(d => ({ ...d }))
  };
}

function saveScenesState() {
  // Atualiza cena ativa atual com o gridState corrente
  if (scenesState && scenesState.scenes) {
    const curScene = scenesState.scenes.find(s => s.id === scenesState.activeSceneId);
    if (curScene) {
      curScene.theme = gridState.theme;
      curScene.lineStyle = gridState.lineStyle;
      curScene.showCoords = gridState.showCoords;
      curScene.customImage = gridState.customImage;
      curScene.cellSize = gridState.cellSize;
      curScene.width = gridState.width;
      curScene.height = gridState.height;
      curScene.weather = gridState.weather;
      curScene.fowEnabled = gridState.fowEnabled;
      curScene.fowDataUrl = gridState.fowDataUrl;
      curScene.markers = gridState.markers || [];
      curScene.aoeTemplates = gridState.aoeTemplates || [];
      curScene.tokens = gridState.tokens || [];
      curScene.drawings = gridState.drawings || [];
    }
  }

  try {
    localStorage.setItem('dnd5e_prisco_scenes_v2', JSON.stringify(scenesState));
  } catch (e) {}
}

function switchScene(sceneId) {
  if (!scenesState || !scenesState.scenes) return;
  saveScenesState(); // Salva estado da cena atual antes de trocar

  const target = scenesState.scenes.find(s => s.id === sceneId);
  if (!target) return;

  scenesState.activeSceneId = sceneId;

  // Carrega propriedades no gridState
  gridState.theme = target.theme || 'bg-dungeon';
  gridState.lineStyle = target.lineStyle || 'default';
  gridState.showCoords = !!target.showCoords;
  gridState.customImage = target.customImage || null;
  gridState.cellSize = target.cellSize || 50;
  gridState.width = target.width || 1200;
  gridState.height = target.height || 800;
  gridState.weather = target.weather || 'none';
  gridState.fowEnabled = !!target.fowEnabled;
  gridState.fowDataUrl = target.fowDataUrl || null;
  gridState.markers = target.markers || [];
  gridState.aoeTemplates = target.aoeTemplates || [];
  gridState.tokens = target.tokens || [];
  gridState.drawings = target.drawings || [];

  // Atualiza UI de tema e grid
  setGridMapBackground(gridState.theme);
  setGridLineStyle(gridState.lineStyle);
  setWeatherEffect(gridState.weather);
  applyGridDimensions();
  renderSceneSelector();
  renderBattleGrid();
  redrawAllDrawings();

  if (gridState.fowEnabled && gridState.fowDataUrl && typeof loadFoWFromDataUrl === 'function') {
    loadFoWFromDataUrl(gridState.fowDataUrl);
  }

  broadcastGridState();
  saveToLocalStorage();
  saveScenesState();
  if (typeof playFX === 'function') playFX('spell');
}

function renderSceneSelector() {
  const sel = document.getElementById('sel-scene-active');
  if (!sel || !scenesState || !scenesState.scenes) return;

  sel.innerHTML = scenesState.scenes.map(s => `
    <option value="${s.id}" ${s.id === scenesState.activeSceneId ? 'selected' : ''}>${s.name}</option>
  `).join('');
}

function openSceneManagerModal() {
  renderScenesManagerList();
  const modal = document.getElementById('modal-scene-manager');
  if (modal) modal.classList.add('open');
}

function closeSceneManagerModal() {
  const modal = document.getElementById('modal-scene-manager');
  if (modal) modal.classList.remove('open');
}

function renderScenesManagerList() {
  const container = document.getElementById('scenes-list-container');
  if (!container || !scenesState || !scenesState.scenes) return;

  container.innerHTML = scenesState.scenes.map(s => {
    const isActive = s.id === scenesState.activeSceneId;
    return `
      <div class="scene-card ${isActive ? 'active-scene' : ''}">
        <div style="flex: 1;">
          <div style="font-weight: 700; font-size: 13px; color: ${isActive ? 'var(--primary)' : 'var(--text-main)'}; display: flex; align-items: center; gap: 6px;">
            <span>${s.name}</span>
            ${isActive ? '<span style="font-size: 10px; background: var(--primary); color: #000; padding: 1px 5px; border-radius: 4px; font-weight: 800;">ATIVA</span>' : ''}
          </div>
          <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">
            ${s.width}x${s.height}px | Célula: ${s.cellSize}px | ${s.tokens ? s.tokens.length : 0} tokens
          </div>
        </div>
        <div style="display: flex; gap: 6px;">
          ${!isActive ? `<button class="btn-action" style="padding: 4px 8px; font-size: 11px;" onclick="switchScene('${s.id}'); renderScenesManagerList();">Abrir</button>` : ''}
          <button class="btn-secondary" style="padding: 4px 8px; font-size: 11px;" onclick="renameScenePrompt('${s.id}')" title="Renomear Cena">✏️</button>
          <button class="btn-secondary" style="padding: 4px 8px; font-size: 11px;" onclick="duplicateScene('${s.id}')" title="Duplicar Cena">📋</button>
          ${scenesState.scenes.length > 1 ? `<button class="btn-secondary" style="padding: 4px 8px; font-size: 11px; color: #ef4444;" onclick="deleteScene('${s.id}')" title="Excluir Cena">🗑️</button>` : ''}
        </div>
      </div>
    `;
  }).join('');
}

function openCreateSceneModal() {
  const inpName = document.getElementById('inp-scene-name');
  if (inpName) inpName.value = `Cena ${scenesState.scenes.length + 1}`;
  const modal = document.getElementById('modal-scene-create');
  if (modal) modal.classList.add('open');
}

function closeCreateSceneModal() {
  const modal = document.getElementById('modal-scene-create');
  if (modal) modal.classList.remove('open');
}

function submitCreateScene() {
  const name = document.getElementById('inp-scene-name')?.value.trim() || `Cena ${scenesState.scenes.length + 1}`;
  const theme = document.getElementById('inp-scene-theme')?.value || 'bg-dungeon';
  const width = parseInt(document.getElementById('inp-scene-width')?.value, 10) || 1200;
  const height = parseInt(document.getElementById('inp-scene-height')?.value, 10) || 800;

  const newId = 'scene_' + Date.now();
  const newScene = {
    id: newId,
    name: name,
    theme: theme,
    lineStyle: 'default',
    showCoords: false,
    customImage: null,
    cellSize: 50,
    width: width,
    height: height,
    weather: 'none',
    fowEnabled: false,
    fowDataUrl: null,
    markers: [],
    aoeTemplates: [],
    tokens: [],
    drawings: []
  };

  saveScenesState();
  scenesState.scenes.push(newScene);
  closeCreateSceneModal();
  switchScene(newId);
  renderScenesManagerList();
}

function duplicateScene(sceneId) {
  const source = scenesState.scenes.find(s => s.id === sceneId);
  if (!source) return;

  const clone = JSON.parse(JSON.stringify(source));
  clone.id = 'scene_' + Date.now();
  clone.name = `${source.name} (Cópia)`;
  scenesState.scenes.push(clone);
  saveScenesState();
  renderSceneSelector();
  renderScenesManagerList();
}

function renameScenePrompt(sceneId) {
  const scene = scenesState.scenes.find(s => s.id === sceneId);
  if (!scene) return;
  const newName = prompt('Digite o novo nome para a cena:', scene.name);
  if (newName && newName.trim()) {
    scene.name = newName.trim();
    saveScenesState();
    renderSceneSelector();
    renderScenesManagerList();
  }
}

function deleteScene(sceneId) {
  if (scenesState.scenes.length <= 1) {
    alert('Você deve manter ao menos uma cena ativa.');
    return;
  }
  if (!confirm('Deseja realmente excluir esta cena?')) return;

  scenesState.scenes = scenesState.scenes.filter(s => s.id !== sceneId);
  if (scenesState.activeSceneId === sceneId) {
    scenesState.activeSceneId = scenesState.scenes[0].id;
    switchScene(scenesState.activeSceneId);
  }
  saveScenesState();
  renderSceneSelector();
  renderScenesManagerList();
}

// --- FERRAMENTAS VISUAIS DO VTT (RÉGUA, PINCEL/GIZ, PING, SELEÇÃO) ---
function setVttTool(tool) {
  activeVttTool = tool;

  // Atualiza botões
  const btnSelect = document.getElementById('btn-tool-select');
  const btnRuler = document.getElementById('btn-tool-ruler');
  const btnDraw = document.getElementById('btn-tool-draw');
  const btnPing = document.getElementById('btn-tool-ping');
  const btnPan = document.getElementById('btn-toggle-pan-mode');
  const drawControls = document.getElementById('vtt-drawing-controls');
  const drawCanvas = document.getElementById('battlegrid-drawing-layer');

  [btnSelect, btnRuler, btnDraw, btnPing, btnPan].forEach(b => {
    if (b) b.classList.remove('active');
  });

  if (drawControls) drawControls.style.display = (tool === 'draw') ? 'inline-flex' : 'none';
  if (drawCanvas) {
    if (tool === 'draw') drawCanvas.classList.add('vtt-drawing-active');
    else drawCanvas.classList.remove('vtt-drawing-active');
  }

  if (tool === 'select') {
    if (btnSelect) btnSelect.classList.add('active');
  } else if (tool === 'ruler') {
    if (btnRuler) btnRuler.classList.add('active');
  } else if (tool === 'draw') {
    if (btnDraw) btnDraw.classList.add('active');
    initDrawingCanvas();
  } else if (tool === 'ping') {
    if (btnPing) btnPing.classList.add('active');
  } else if (tool === 'pan') {
    if (btnPan) btnPan.classList.add('active');
  }

  updateCursorForTool(tool);
  updateActiveToolBadge(tool);
}

// V1: Cursor customizado por ferramenta
function updateCursorForTool(tool) {
  const viewport = document.getElementById('battlegrid-viewport');
  if (!viewport) return;
  viewport.classList.remove('cursor-ruler', 'cursor-draw', 'cursor-ping', 'cursor-pan', 'cursor-select');
  const cursorMap = { ruler: 'cursor-ruler', draw: 'cursor-draw', ping: 'cursor-ping', pan: 'cursor-pan', select: 'cursor-select' };
  if (cursorMap[tool]) viewport.classList.add(cursorMap[tool]);
}

// V2: Badge flutuante de ferramenta ativa
function updateActiveToolBadge(tool) {
  const badge = document.getElementById('vtt-active-tool-badge');
  if (!badge) return;
  const labels = {
    select: '🎯 Tokens',
    ruler: '📏 Régua',
    draw: '✏️ Giz',
    ping: '📍 Ping',
    pan: '🖐️ Mover'
  };
  badge.innerText = labels[tool] || '🎯 Tokens';
  badge.style.display = tool === 'select' ? 'none' : 'flex';
}

function toggleRulerTool() {
  setVttTool(activeVttTool === 'ruler' ? 'select' : 'ruler');
}

function toggleDrawingTool() {
  setVttTool(activeVttTool === 'draw' ? 'select' : 'draw');
}

function togglePingTool() {
  setVttTool(activeVttTool === 'ping' ? 'select' : 'ping');
}

// --- RÉGUA TÁTICA DE MEDIÇÃO ---
function startRulerMeasurement(startX, startY) {
  isRulerMeasuring = true;
  rulerOrigin = { x: startX, y: startY };
  renderRulerSvg(startX, startY, startX, startY, false);
}

function updateRulerMeasurement(curX, curY) {
  if (!isRulerMeasuring || !rulerOrigin) return;
  renderRulerSvg(rulerOrigin.x, rulerOrigin.y, curX, curY, false);

  if (typeof syncChannel !== 'undefined' && syncChannel) {
    syncChannel.postMessage({
      type: 'RULER_UPDATE',
      startX: rulerOrigin.x,
      startY: rulerOrigin.y,
      endX: curX,
      endY: curY,
      active: true
    });
  }
}

function endRulerMeasurement() {
  isRulerMeasuring = false;
  rulerOrigin = null;
  clearRulerSvg(false);

  if (typeof syncChannel !== 'undefined' && syncChannel) {
    syncChannel.postMessage({
      type: 'RULER_UPDATE',
      active: false
    });
  }
}

function clearRulerSvg(isScreen = false) {
  const svg = document.getElementById(isScreen ? 'pv-battlegrid-ruler-svg' : 'battlegrid-ruler-svg');
  if (svg) {
    svg.style.display = 'none';
    svg.innerHTML = '';
  }
}

function renderRulerSvg(startX, startY, endX, endY, isScreen = false) {
  const svg = document.getElementById(isScreen ? 'pv-battlegrid-ruler-svg' : 'battlegrid-ruler-svg');
  if (!svg) return;

  // B2: Definir width/height explícitos para o SVG funcionar corretamente no espaço do board
  const mapW = gridState.width || 1200;
  const mapH = gridState.height || 800;
  if (typeof svg.setAttribute === 'function') {
    svg.setAttribute('width', mapW);
    svg.setAttribute('height', mapH);
    svg.setAttribute('viewBox', `0 0 ${mapW} ${mapH}`);
  }

  const cSize = gridState.cellSize || 50;
  const distPx = Math.hypot(endX - startX, endY - startY);
  const cells = (distPx / cSize).toFixed(1);
  const feet = Math.round((distPx / cSize) * 5);
  const meters = ((distPx / cSize) * 1.5).toFixed(1);

  // Snap das extremidades à grade
  const snap = (v) => Math.round(v / cSize) * cSize;
  const labelX = (startX + endX) / 2;
  const labelY = (startY + endY) / 2 - 14;

  svg.style.display = 'block';
  svg.innerHTML = `
    <defs>
      <filter id="ruler-glow"><feGaussianBlur stdDeviation="2" result="blur"/><feComposite in="SourceGraphic" in2="blur" operator="over"/></filter>
    </defs>
    <line x1="${startX}" y1="${startY}" x2="${endX}" y2="${endY}" stroke="rgba(245,158,11,0.35)" stroke-width="8" stroke-linecap="round" />
    <line x1="${startX}" y1="${startY}" x2="${endX}" y2="${endY}" stroke="#f59e0b" stroke-width="2.5" stroke-dasharray="8,5" stroke-linecap="round" filter="url(#ruler-glow)" />
    <circle cx="${startX}" cy="${startY}" r="6" fill="#f59e0b" stroke="#fff" stroke-width="2" />
    <circle cx="${endX}" cy="${endY}" r="7" fill="#ef4444" stroke="#fff" stroke-width="2" />
    <g transform="translate(${labelX}, ${labelY})">
      <rect x="-65" y="-15" width="130" height="26" rx="13" fill="rgba(9, 14, 29, 0.97)" stroke="#f59e0b" stroke-width="1.5" />
      <text x="0" y="4" fill="#fbbf24" font-size="11.5" font-weight="800" font-family="'Outfit', sans-serif" text-anchor="middle">📏 ${feet} ft · ${meters}m · ${cells}q</text>
    </g>
  `;
}

// --- PINCEL E CAMADA DE DESENHO TÁTICO ---
function setDrawingColor(color, el) {
  activeDrawingColor = color;
  document.querySelectorAll('.drawing-color-dot').forEach(d => d.classList.remove('active'));
  if (el) el.classList.add('active');
}

function clearDrawings() {
  gridState.drawings = [];
  redrawAllDrawings();
  broadcastGridState();
  saveToLocalStorage();
  saveScenesState();
}

function initDrawingCanvas() {
  const canvas = document.getElementById('battlegrid-drawing-layer');
  if (!canvas) return;
  canvas.width = gridState.width || 1200;
  canvas.height = gridState.height || 800;
  canvas.dataset = canvas.dataset || {};

  if (!canvas.dataset.listenerAttached && typeof canvas.addEventListener === 'function') {
    canvas.dataset.listenerAttached = 'true';

    canvas.addEventListener('mousedown', (e) => {
      if (activeVttTool !== 'draw' || e.button !== 0) return;
      isDrawingStroke = true;
      // B3: Usar clientToCanvas que aplica scaleX = canvas.width / rect.width
      // O canvas CSS tem 100%/100% mas resolução nativa 1200x800, escalado por transform-layer
      const pos = clientToCanvas(e.clientX, e.clientY, canvas);
      currentDrawingPath = [pos];
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDrawingStroke || activeVttTool !== 'draw') return;
      const cv = document.getElementById('battlegrid-drawing-layer');
      if (!cv) return;
      const pos = clientToCanvas(e.clientX, e.clientY, cv);
      currentDrawingPath.push(pos);
      redrawAllDrawings();
      drawCurrentStroke(cv, currentDrawingPath, activeDrawingColor, activeDrawingSize);
    });

    document.addEventListener('mouseup', () => {
      if (isDrawingStroke && activeVttTool === 'draw') {
        isDrawingStroke = false;
        if (currentDrawingPath.length > 1) {
          gridState.drawings = gridState.drawings || [];
          const newStroke = { color: activeDrawingColor, size: activeDrawingSize, points: currentDrawingPath };
          gridState.drawings.push(newStroke);
          // B6: Registra no undo stack
          drawingUndoStack.push(gridState.drawings.length - 1);
          if (drawingUndoStack.length > 30) drawingUndoStack.shift();
          broadcastGridState();
          saveToLocalStorage();
          saveScenesState();
        }
        currentDrawingPath = [];
      }
    });
  }
  redrawAllDrawings();
}

// B6: Desfazer último traço (Ctrl+Z)
function undoLastDrawing() {
  if (!gridState.drawings || gridState.drawings.length === 0) return;
  gridState.drawings.pop();
  drawingUndoStack.pop();
  redrawAllDrawings();
  broadcastGridState();
  saveToLocalStorage();
  saveScenesState();
  if (typeof playFX === 'function') playFX('spell');
}

// B7: Tamanho do pincel
function setDrawingSize(size, el) {
  activeDrawingSize = parseInt(size, 10) || 3;
  document.querySelectorAll('.drawing-size-btn').forEach(b => b.classList.remove('active'));
  if (el) el.classList.add('active');
}

function drawCurrentStroke(canvas, points, color, size = 3) {
  if (!canvas || typeof canvas.getContext !== 'function' || !points || points.length < 2) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.strokeStyle = color;
  ctx.lineWidth = size;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.globalAlpha = 0.92;

  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    // Suavização com curva bezier
    if (i < points.length - 1) {
      const mx = (points[i].x + points[i + 1].x) / 2;
      const my = (points[i].y + points[i + 1].y) / 2;
      ctx.quadraticCurveTo(points[i].x, points[i].y, mx, my);
    } else {
      ctx.lineTo(points[i].x, points[i].y);
    }
  }
  ctx.stroke();
  ctx.globalAlpha = 1.0;
}

function redrawAllDrawings() {
  if (typeof document === 'undefined') return;
  const canvases = [
    document.getElementById('battlegrid-drawing-layer'),
    document.getElementById('pv-battlegrid-drawing-layer')
  ];

  canvases.forEach(canvas => {
    if (!canvas || typeof canvas.getContext !== 'function') return;
    canvas.width = gridState.width || 1200;
    canvas.height = gridState.height || 800;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    (gridState.drawings || []).forEach(d => {
      if (!d.points || d.points.length < 2) return;
      ctx.strokeStyle = d.color || '#f59e0b';
      ctx.lineWidth = d.size || 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.globalAlpha = 0.92;

      ctx.beginPath();
      ctx.moveTo(d.points[0].x, d.points[0].y);
      for (let i = 1; i < d.points.length; i++) {
        if (i < d.points.length - 1) {
          const mx = (d.points[i].x + d.points[i + 1].x) / 2;
          const my = (d.points[i].y + d.points[i + 1].y) / 2;
          ctx.quadraticCurveTo(d.points[i].x, d.points[i].y, mx, my);
        } else {
          ctx.lineTo(d.points[i].x, d.points[i].y);
        }
      }
      ctx.stroke();
      ctx.globalAlpha = 1.0;
    });
  });
}

// --- B5: FERRAMENTA DE PING TÁTICO (RADAR WAVE) ---
function triggerGridPingCenter() {
  const w = gridState.width || 1200;
  const h = gridState.height || 800;
  triggerGridPing(w / 2, h / 2);
}

function triggerGridPing(x, y) {
  renderPingAnimation(x, y, false);
  if (typeof playFX === 'function') playFX('spell');

  // Sincroniza via BroadcastChannel para o Telão
  if (typeof syncChannel !== 'undefined' && syncChannel) {
    syncChannel.postMessage({ type: 'GRID_PING', x, y });
  }
}

function renderPingAnimation(x, y, isScreen = false) {
  const layerId = isScreen ? 'pv-grid-pings-layer' : 'grid-pings-layer';
  const layer = document.getElementById(layerId);
  if (!layer) return;

  // B5: Garantir que o layer tem posicionamento absoluto cobrindo todo o board
  layer.style.position = 'absolute';
  layer.style.top = '0';
  layer.style.left = '0';
  layer.style.width = '100%';
  layer.style.height = '100%';
  layer.style.pointerEvents = 'none';
  layer.style.zIndex = '50';

  const pingEl = document.createElement('div');
  pingEl.className = 'vtt-ping-effect';
  // B5: O ping usa margin-left/top -30px para centralizar → left/top = centro desejado
  pingEl.style.position = 'absolute';
  pingEl.style.left = `${x}px`;
  pingEl.style.top = `${y}px`;
  pingEl.innerHTML = `
    <div class="vtt-ping-ripple"></div>
    <div class="vtt-ping-ripple" style="animation-delay: 0.3s;"></div>
    <div class="vtt-ping-dot"></div>
  `;

  layer.appendChild(pingEl);
  setTimeout(() => {
    if (pingEl.parentNode) pingEl.parentNode.removeChild(pingEl);
  }, 1800);
}

// --- MARCADORES DE TERRENO ---
function addMapMarker(label) {
  const cSize = gridState.cellSize || 50;
  const newMarker = {
    id: 'm_' + Date.now(),
    label: label,
    x: 4 * cSize,
    y: 4 * cSize
  };
  gridState.markers = gridState.markers || [];
  gridState.markers.push(newMarker);
  renderBattleGrid();
  broadcastGridState();
  saveToLocalStorage();
  saveScenesState();
  if (typeof playFX === 'function') playFX('sword');
}

function removeMapMarker(id) {
  gridState.markers = (gridState.markers || []).filter(m => m.id !== id);
  renderBattleGrid();
  broadcastGridState();
  saveToLocalStorage();
  saveScenesState();
}

// --- MODELOS DE ÁREA DE MAGIA (AoE) ---
function addAoETemplate(type) {
  const cSize = gridState.cellSize || 50;
  let w = 4 * cSize, h = 4 * cSize, label = 'AoE';

  if (type === 'circle_6m') {
    w = 8 * cSize; h = 8 * cSize; label = '🔴 Bola de Fogo (6m / 20ft)';
  } else if (type === 'circle_4m') {
    w = 6 * cSize; h = 6 * cSize; label = '🟡 Espírito Guardião (4,5m / 15ft)';
  } else if (type === 'cone_4m') {
    w = 6 * cSize; h = 6 * cSize; label = '🔺 Cone de Chamas (4,5m / 15ft)';
  } else if (type === 'cone_9m') {
    w = 12 * cSize; h = 12 * cSize; label = '🔻 Sopro do Dragão (9m / 30ft)';
  } else if (type === 'line_18m') {
    w = 12 * cSize; h = 2 * cSize; label = '⚡ Relâmpago (18m / 60ft)';
  } else if (type === 'cube_3m') {
    w = 4 * cSize; h = 4 * cSize; label = '🟩 Nuvem de Adagas (3m / 10ft)';
  } else if (type === 'cube_6m') {
    w = 8 * cSize; h = 8 * cSize; label = '🟦 Espinheiros (6m / 20ft)';
  }

  const newAoE = {
    id: 'aoe_' + Date.now(),
    type: type,
    label: label,
    x: 6 * cSize,
    y: 3 * cSize,
    width: w,
    height: h
  };

  gridState.aoeTemplates = gridState.aoeTemplates || [];
  gridState.aoeTemplates.push(newAoE);
  renderBattleGrid();
  broadcastGridState();
  saveToLocalStorage();
  saveScenesState();
  if (typeof playFX === 'function') playFX('spell');
}

function removeAoETemplate(id) {
  gridState.aoeTemplates = (gridState.aoeTemplates || []).filter(a => a.id !== id);
  renderBattleGrid();
  broadcastGridState();
  saveToLocalStorage();
  saveScenesState();
}

// --- B4: SISTEMA DE NÉVOA DE GUERRA (FOG OF WAR) ---
let fowBrushMode = 'reveal';
let isDrawingFog = false;

// V5: Seletor de tamanho do brush FoW
function setFowBrushSize(multiplier) {
  fowBrushCellMultiplier = parseFloat(multiplier) || 1.5;
  const sel = document.getElementById('sel-fow-brush-size');
  if (sel) sel.value = multiplier;
}

function toggleFogOfWar() {
  gridState.fowEnabled = !gridState.fowEnabled;
  const btn = document.getElementById('btn-toggle-fow');
  const selBrush = document.getElementById('sel-fow-brush');
  const btnReset = document.getElementById('btn-fow-reset');
  const btnRevealAll = document.getElementById('btn-fow-reveal-all');
  const canvasDm = document.getElementById('fow-canvas-dm');
  const canvasScreen = document.getElementById('fow-canvas-screen');

  if (gridState.fowEnabled) {
    if (btn) { btn.innerText = '🌫️ Ativa'; btn.style.background = '#a855f7'; btn.style.color = '#fff'; btn.style.fontWeight = '700'; }
    if (selBrush) selBrush.style.display = 'inline-block';
    const selBrushSize = document.getElementById('sel-fow-brush-size');
    if (selBrushSize) selBrushSize.style.display = 'inline-block';
    if (btnReset) btnReset.style.display = 'inline-block';
    if (btnRevealAll) btnRevealAll.style.display = 'inline-block';
    if (canvasDm) canvasDm.style.display = 'block';
    if (canvasScreen) canvasScreen.style.display = 'block';

    initFoWCanvases();
    if (!gridState.fowDataUrl) {
      coverAllFog();
    } else {
      loadFoWFromDataUrl(gridState.fowDataUrl);
    }
  } else {
    if (btn) { btn.innerText = '🌫️ Névoa'; btn.style.background = 'var(--bg-surface-elevated)'; btn.style.color = 'var(--text-main)'; btn.style.fontWeight = 'normal'; }
    if (selBrush) selBrush.style.display = 'none';
    const selBrushSize = document.getElementById('sel-fow-brush-size');
    if (selBrushSize) selBrushSize.style.display = 'none';
    if (btnReset) btnReset.style.display = 'none';
    if (btnRevealAll) btnRevealAll.style.display = 'none';
    if (canvasDm) canvasDm.style.display = 'none';
    if (canvasScreen) canvasScreen.style.display = 'none';
  }

  broadcastGridState();
  saveToLocalStorage();
}

function setFogBrushMode(mode) {
  fowBrushMode = mode;
}

let lastFogPos = null;

function initFoWCanvases() {
  const w = gridState.width || 1200;
  const h = gridState.height || 800;

  const canvasDm = document.getElementById('fow-canvas-dm');
  const canvasScreen = document.getElementById('fow-canvas-screen');

  [canvasDm, canvasScreen].forEach(cv => {
    if (cv) {
      cv.width = w;
      cv.height = h;
    }
  });

  if (canvasDm && !canvasDm.dataset.listenerAttached) {
    canvasDm.dataset.listenerAttached = 'true';

    canvasDm.addEventListener('mousedown', (e) => {
      if (!gridState.fowEnabled) return;
      isDrawingFog = true;
      // B4: O fow-canvas-dm tem CSS width:100%/height:100% mas não tem CSS transform próprio.
      // O canvas.width/height é a resolução nativa. canvas.offsetWidth = tamanho CSS display.
      // scaleX = nativo / display → converte pixels de tela para pixels de canvas corretamente.
      const pos = clientToCanvas(e.clientX, e.clientY, canvasDm);
      lastFogPos = pos;
      drawFogAtPoint(lastFogPos.x, lastFogPos.y);
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDrawingFog || !gridState.fowEnabled) return;
      const cv = document.getElementById('fow-canvas-dm');
      if (!cv) return;
      const pos = clientToCanvas(e.clientX, e.clientY, cv);
      drawFogLine(lastFogPos.x, lastFogPos.y, pos.x, pos.y);
      lastFogPos = pos;
    });

    document.addEventListener('mouseup', () => {
      if (isDrawingFog) {
        isDrawingFog = false;
        lastFogPos = null;
        syncFoWData();
      }
    });
  }
}

function drawFogAtPoint(x, y) {
  const canvasDm = document.getElementById('fow-canvas-dm');
  if (!canvasDm) return;
  const ctx = canvasDm.getContext('2d');
  const cSize = gridState.cellSize || 50;
  // V5: Tamanho do brush FoW controlável
  const brushRadius = Math.max(25, cSize * fowBrushCellMultiplier);

  ctx.save();
  if (fowBrushMode === 'reveal') {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, brushRadius, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = '#05070c';
    ctx.beginPath();
    ctx.arc(x, y, brushRadius, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  updateScreenFoWCanvas(canvasDm);
}

function drawFogLine(x1, y1, x2, y2) {
  const canvasDm = document.getElementById('fow-canvas-dm');
  if (!canvasDm) return;
  const ctx = canvasDm.getContext('2d');
  const cSize = gridState.cellSize || 50;
  const brushRadius = Math.max(25, cSize * fowBrushCellMultiplier);

  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.lineWidth = brushRadius * 2;

  if (fowBrushMode === 'reveal') {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  } else {
    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = '#05070c';
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
  ctx.restore();

  updateScreenFoWCanvas(canvasDm);
}

function updateScreenFoWCanvas(canvasDm) {
  const canvasScreen = document.getElementById('fow-canvas-screen');
  if (canvasScreen) {
    const sCtx = canvasScreen.getContext('2d');
    sCtx.clearRect(0, 0, canvasScreen.width, canvasScreen.height);
    sCtx.drawImage(canvasDm, 0, 0);
  }
}

function coverAllFog() {
  const w = gridState.width || 1200;
  const h = gridState.height || 800;
  const canvasDm = document.getElementById('fow-canvas-dm');
  const canvasScreen = document.getElementById('fow-canvas-screen');

  [canvasDm, canvasScreen].forEach(cv => {
    if (cv) {
      const ctx = cv.getContext('2d');
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = '#05070c';
      ctx.fillRect(0, 0, w, h);
    }
  });

  syncFoWData();
  if (typeof playFX === 'function') playFX('spell');
}

function revealAllFog() {
  const w = gridState.width || 1200;
  const h = gridState.height || 800;
  const canvasDm = document.getElementById('fow-canvas-dm');
  const canvasScreen = document.getElementById('fow-canvas-screen');

  [canvasDm, canvasScreen].forEach(cv => {
    if (cv) {
      const ctx = cv.getContext('2d');
      ctx.clearRect(0, 0, w, h);
    }
  });

  syncFoWData();
  if (typeof playFX === 'function') playFX('spell');
}

function syncFoWData() {
  const canvasDm = document.getElementById('fow-canvas-dm');
  if (!canvasDm) return;
  gridState.fowDataUrl = canvasDm.toDataURL('image/png');
  broadcastGridState();
  saveToLocalStorage();
}

function loadFoWFromDataUrl(dataUrl) {
  if (!dataUrl) return;
  const img = new Image();
  img.onload = () => {
    const canvasDm = document.getElementById('fow-canvas-dm');
    const canvasScreen = document.getElementById('fow-canvas-screen');
    [canvasDm, canvasScreen].forEach(cv => {
      if (cv) {
        const ctx = cv.getContext('2d');
        ctx.clearRect(0, 0, cv.width, cv.height);
        ctx.drawImage(img, 0, 0);
      }
    });
  };
  img.src = dataUrl;
}

// --- DIMENSÕES E TAMANHO DE CÉLULA ---
function changeGridCellSize(sizeVal) {
  const size = parseInt(sizeVal, 10) || 50;
  gridState.cellSize = size;
  applyGridDimensions();
  broadcastGridState();
  saveToLocalStorage();
}

function applyGridDimensions() {
  const board = document.getElementById('battlegrid-board');
  const pvBoard = document.getElementById('pv-battlegrid-board');
  const badge = document.getElementById('grid-dimensions-badge');
  const selSize = document.getElementById('sel-grid-size');

  const w = gridState.width || 1200;
  const h = gridState.height || 800;
  const size = gridState.cellSize || 50;
  if (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && typeof document.documentElement.style.setProperty === 'function') {
    document.documentElement.style.setProperty('--grid-cell-size', `${size}px`);
  }

  if (board) {
    board.style.width = `${w}px`;
    board.style.height = `${h}px`;
  }
  if (pvBoard) {
    pvBoard.style.width = `${w}px`;
    pvBoard.style.height = `${h}px`;
  }
  if (badge) {
    const cols = Math.round(w / size);
    const rows = Math.round(h / size);
    badge.innerText = `${w}x${h} (${cols}x${rows} casas)`;
  }
  if (selSize) {
    selSize.value = size.toString();
  }

  renderGridCoordinates();
  renderBattleGrid();
  applyGridTransform();
}

// --- TEMAS DE MAPA & UPLOAD PERSONALIZADO ---
function setGridMapBackground(themeClass) {
  gridState.theme = themeClass;
  const board = document.getElementById('battlegrid-board');
  const pvBoard = document.getElementById('pv-battlegrid-board');
  const sel = document.getElementById('bg-map-theme');
  if (sel) sel.value = themeClass;

  if (themeClass === 'custom' && gridState.customImage) {
    if (board) {
      board.className = 'battlegrid-board';
      board.style.backgroundImage = `url(${gridState.customImage})`;
    }
    if (pvBoard) {
      pvBoard.className = 'battlegrid-board';
      pvBoard.style.backgroundImage = `url(${gridState.customImage})`;
    }
  } else {
    if (board) {
      board.className = `battlegrid-board ${themeClass}`;
      board.style.backgroundImage = '';
    }
    if (pvBoard) {
      pvBoard.className = `battlegrid-board ${themeClass}`;
      pvBoard.style.backgroundImage = '';
    }
  }

  if (gridState.lineStyle) {
    setGridLineStyle(gridState.lineStyle);
  }

  applyGridDimensions();
  broadcastGridState();
  saveToLocalStorage();
}

function handleCustomMapUpload(input) {
  if (!input.files || !input.files[0]) return;
  const file = input.files[0];
  const reader = new FileReader();

  reader.onload = function(e) {
    const dataUrl = e.target.result;
    
    const img = new Image();
    img.onload = function() {
      let w = img.naturalWidth || 1200;
      let h = img.naturalHeight || 800;

      const maxDim = 2400;
      if (w > maxDim || h > maxDim) {
        if (w > h) {
          h = Math.round((h * maxDim) / w);
          w = maxDim;
        } else {
          w = Math.round((w * maxDim) / h);
          h = maxDim;
        }
      }

      const cSize = gridState.cellSize || 50;
      gridState.width = Math.round(w / cSize) * cSize;
      gridState.height = Math.round(h / cSize) * cSize;
      gridState.customImage = dataUrl;
      gridState.theme = 'custom';

      const opt = document.getElementById('opt-custom-map');
      const sel = document.getElementById('bg-map-theme');
      if (opt) opt.style.display = 'block';
      if (sel) sel.value = 'custom';

      setGridMapBackground('custom');
      syncCombatantsToGrid();
      fitBattleGridToView();
      saveToLocalStorage();
      if (typeof playFX === 'function') playFX('spell');
      if (typeof addLog === 'function') addLog(`🗺️ <b>Mapa Personalizado:</b> [${file.name}] ajustado para ${gridState.width}x${gridState.height}px!`);
    };
    img.src = dataUrl;
  };

  reader.readAsDataURL(file);
}

// --- POVOAR COMBATENTES NO GRID ---
function syncCombatantsToGrid() {
  const cSize = gridState.cellSize || 50;
  const maxCols = Math.max(4, Math.floor((gridState.width || 1200) / cSize));

  state.combatants.forEach((c, idx) => {
    let t = (gridState.tokens || []).find(tok => tok.combatantId === c.id);
    if (!t) {
      const col = c.type === 'player' ? 1 : Math.max(2, maxCols - 2);
      const row = 1 + (idx % 14);
      gridState.tokens = gridState.tokens || [];
      gridState.tokens.push({
        id: 'tok_' + c.id,
        combatantId: c.id,
        name: c.name,
        type: c.type,
        size: 'medium',
        altitude: 0,
        hidden: false,
        x: col * cSize,
        y: row * cSize
      });
    }
  });

  const activeIds = state.combatants.map(c => c.id);
  gridState.tokens = (gridState.tokens || []).filter(tok => activeIds.includes(tok.combatantId));

  renderBattleGrid();
  broadcastGridState();
  saveToLocalStorage();
}

function resetGridTokens() {
  const cSize = gridState.cellSize || 50;
  const maxCols = Math.max(4, Math.floor((gridState.width || 1200) / cSize));

  (gridState.tokens || []).forEach((t, i) => {
    const isPlayer = t.type === 'player';
    t.x = (isPlayer ? 1 : Math.max(2, maxCols - 2)) * cSize;
    t.y = (1 + (i % 14)) * cSize;
  });
  renderBattleGrid();
  broadcastGridState();
  saveToLocalStorage();
}

// --- AUXILIARES DE TAMANHO & ÍCONES ---
function getTokenSpan(token) {
  const size = token.size || 'medium';
  if (size === 'large') return 2;
  if (size === 'huge') return 3;
  if (size === 'gargantuan') return 4;
  return 1;
}

function getTokenClassIcon(token, combatant = {}) {
  const c = combatant || {};
  const cName = c.name || (token && token.name) || '';
  if (token && token.type === 'player') {
    const p = (typeof PLAYERS !== 'undefined' && Array.isArray(PLAYERS)) ? PLAYERS.find(x => x && x.name && cName.includes(x.name)) : null;
    const cls = ((p && p.className) || c.className || '').toLowerCase();
    if (cls.includes('barb') || cls.includes('bárbaro')) return '🪓';
    if (cls.includes('bard') || cls.includes('bardo')) return '🎶';
    if (cls.includes('cler') || cls.includes('clérigo')) return '✝️';
    if (cls.includes('druid') || cls.includes('druida')) return '🐺';
    if (cls.includes('fight') || cls.includes('guerreiro')) return '⚔️';
    if (cls.includes('monk') || cls.includes('monge')) return '🥋';
    if (cls.includes('palad') || cls.includes('paladino')) return '🛡️';
    if (cls.includes('rang') || cls.includes('patrulheiro') || cls.includes('ranger')) return '🏹';
    if (cls.includes('rogue') || cls.includes('ladino')) return '🗡️';
    if (cls.includes('sorc') || cls.includes('feiticeiro')) return '⚡';
    if (cls.includes('warl') || cls.includes('bruxo')) return '🔥';
    if (cls.includes('wiz') || cls.includes('mago')) return '🧙‍♂️';
    return '👤';
  } else {
    const name = (token && token.name ? token.name : cName).toLowerCase();
    if (name.includes('drag') || name.includes('draco')) return '🐉';
    if (name.includes('esqueleto') || name.includes('zumbi') || name.includes('nec') || name.includes('múmia')) return '💀';
    if (name.includes('demôn') || name.includes('diabo') || name.includes('fiend')) return '👹';
    if (name.includes('lobo') || name.includes('urso') || name.includes('aranha') || name.includes('fera') || name.includes('rato')) return '🐺';
    if (name.includes('goblin') || name.includes('orc') || name.includes('kobold') || name.includes('troll') || name.includes('ogro')) return '🧌';
    if (name.includes('guard') || name.includes('soldado') || name.includes('cavaleiro')) return '🛡️';
    return '👾';
  }
}

// --- SISTEMA DE SELEÇÃO MÚLTIPLA & ARRASTE EM GRUPO ---
let selectedTokenIds = new Set();
let multiDragInitialPositions = new Map();
let selectionBoxStart = null;

function handleBoardMouseDown(e) {
  // Fecha menus contextuais abertos
  closeTokenContextMenu();

  // B1: Usar função unificada clientToBoard para todas as ferramentas
  const pos = clientToBoard(e.clientX, e.clientY);
  const boardX = pos.x;
  const boardY = pos.y;

  // Alt + Clique ou Ferramenta Ping: emite Ping tático
  if (e.altKey || (activeVttTool === 'ping' && e.button === 0)) {
    triggerGridPing(boardX, boardY);
    return;
  }

  // Ferramenta Régua (Ruler Tool)
  if (activeVttTool === 'ruler' && e.button === 0) {
    startRulerMeasurement(boardX, boardY);

    const onRulerMove = (mvEvt) => {
      const mp = clientToBoard(mvEvt.clientX, mvEvt.clientY);
      updateRulerMeasurement(mp.x, mp.y);
    };

    const onRulerUp = () => {
      document.removeEventListener('mousemove', onRulerMove);
      document.removeEventListener('mouseup', onRulerUp);
      endRulerMeasurement();
    };

    document.addEventListener('mousemove', onRulerMove);
    document.addEventListener('mouseup', onRulerUp);
    return;
  }

  // Se a ferramenta de desenho estiver ativa, o canvas de desenho cuida do evento
  if (activeVttTool === 'draw') return;

  // Se o botão direito (2) ou meio (1) for pressionado, deixa o viewport cuidar do Pan livre
  if (e.button === 2 || e.button === 1) {
    return;
  }

  // Se a névoa de guerra estiver ligada, a névoa cuida do desenho
  if (gridState.fowEnabled) return;

  // Se clicou em um token, marker ou aoe, o drag específico assume
  if (e.target.closest('.grid-token') || e.target.closest('.grid-marker') || e.target.closest('.aoe-template')) return;

  // Inicia caixa de seleção retangular (botão esquerdo) somente se modo Pan não estiver ativo e espaço não estiver pressionado
  if (e.button === 0 && !isPanModeActive && !isSpacePressed) {
    handleBoardSelectionStart(e);
  }
}

// --- SUPORTE TOUCH PARA MOBILE (RÉGUA E PING NO CELULAR) ---
let _rulerTouchClearTimeout = null;

function handleBoardTouchStart(e) {
  if (!e.touches || e.touches.length === 0) return;
  const touch = e.touches[0];
  const pos = clientToBoard(touch.clientX, touch.clientY);
  
  if (activeVttTool === 'ping') {
    if (e.cancelable) e.preventDefault();
    triggerGridPing(pos.x, pos.y);
    return;
  }
  
  if (activeVttTool === 'ruler') {
    if (e.cancelable) e.preventDefault();
    if (_rulerTouchClearTimeout) {
      clearTimeout(_rulerTouchClearTimeout);
      _rulerTouchClearTimeout = null;
    }
    startRulerMeasurement(pos.x, pos.y);
    return;
  }
}

function handleBoardTouchMove(e) {
  if (!e.touches || e.touches.length === 0) return;
  if (activeVttTool === 'ruler' && isRulerMeasuring) {
    if (e.cancelable) e.preventDefault();
    const touch = e.touches[0];
    const pos = clientToBoard(touch.clientX, touch.clientY);
    updateRulerMeasurement(pos.x, pos.y);
  }
}

function handleBoardTouchEnd(e) {
  if (activeVttTool === 'ruler' && isRulerMeasuring) {
    if (e.cancelable) e.preventDefault();
    if (_rulerTouchClearTimeout) clearTimeout(_rulerTouchClearTimeout);
    // Mantém a régua visível por 2.5 segundos para o jogador/mestre ler a distância no celular
    _rulerTouchClearTimeout = setTimeout(() => {
      endRulerMeasurement();
      _rulerTouchClearTimeout = null;
    }, 2500);
  }
}

function handleBoardContextMenu(e) {
  if (hasPannedWithRightClick) {
    e.preventDefault();
    hasPannedWithRightClick = false;
  }
}

function handleGridContextMenu(e) {
  if (hasPannedWithRightClick) {
    e.preventDefault();
    hasPannedWithRightClick = false;
    return;
  }

  const tokEl = e.target.closest('.grid-token');
  if (tokEl) {
    e.preventDefault();
    e.stopPropagation();
    const tokId = tokEl.id.replace('tok-el-', '');
    openTokenContextMenu(e, tokId);
  } else {
    e.preventDefault();
  }
}

function handleBoardSelectionStart(e) {
  if (!e.shiftKey) {
    selectedTokenIds.clear();
    renderBattleGrid();
  }

  const pos = clientToBoard(e.clientX, e.clientY);
  selectionBoxStart = pos;

  const selBox = document.getElementById('grid-selection-box');
  if (selBox) {
    selBox.style.left = `${selectionBoxStart.x}px`;
    selBox.style.top = `${selectionBoxStart.y}px`;
    selBox.style.width = '0px';
    selBox.style.height = '0px';
    selBox.style.display = 'block';
  }

  document.addEventListener('mousemove', handleBoardSelectionMove);
  document.addEventListener('mouseup', handleBoardSelectionEnd);
}

function handleBoardSelectionMove(e) {
  if (!selectionBoxStart) return;
  const board = document.getElementById('battlegrid-board');
  if (!board) return;

  const pos = clientToBoard(e.clientX, e.clientY);
  const currentX = Math.max(0, Math.min(board.clientWidth, pos.x));
  const currentY = Math.max(0, Math.min(board.clientHeight, pos.y));

  const left = Math.min(selectionBoxStart.x, currentX);
  const top = Math.min(selectionBoxStart.y, currentY);
  const width = Math.abs(currentX - selectionBoxStart.x);
  const height = Math.abs(currentY - selectionBoxStart.y);

  const selBox = document.getElementById('grid-selection-box');
  if (selBox) {
    selBox.style.left = `${left}px`;
    selBox.style.top = `${top}px`;
    selBox.style.width = `${width}px`;
    selBox.style.height = `${height}px`;
  }

  const cSize = gridState.cellSize || 50;
  (gridState.tokens || []).forEach(tok => {
    const span = getTokenSpan(tok);
    const tokW = span * cSize;
    const tokH = span * cSize;
    const tokRight = tok.x + tokW;
    const tokBottom = tok.y + tokH;
    const inBox = (tok.x < left + width && tokRight > left && tok.y < top + height && tokBottom > top);
    if (inBox) {
      selectedTokenIds.add(tok.id);
    }
  });

  renderBattleGrid();
}

function handleBoardSelectionEnd() {
  document.removeEventListener('mousemove', handleBoardSelectionMove);
  document.removeEventListener('mouseup', handleBoardSelectionEnd);

  const selBox = document.getElementById('grid-selection-box');
  if (selBox) selBox.style.display = 'none';
  selectionBoxStart = null;
}

// --- RENDERIZAÇÃO DO GRID DE BATALHA ---
function renderBattleGrid() {
  const container = document.getElementById('grid-tokens-layer');
  const pvContainer = document.getElementById('pv-grid-tokens-layer');
  const mLayer = document.getElementById('grid-markers-layer');
  const pvmLayer = document.getElementById('pv-grid-markers-layer');
  const aLayer = document.getElementById('grid-aoe-layer');
  const pvaLayer = document.getElementById('pv-grid-aoe-layer');

  if (!container) return;

  const currentActive = state.combatants[state.turnIndex];

  // 1. Marcadores de Terreno
  const markersHtml = (isReadOnly = false) => (gridState.markers || []).map(m => `
    <div id="marker-${m.id}" class="grid-marker" style="left: ${m.x + 3}px; top: ${m.y + 3}px;"
         ${!isReadOnly ? `onmousedown="startMarkerDrag(event, '${m.id}')"` : ''}>
      ${!isReadOnly ? `<span class="grid-marker-del" onclick="removeMapMarker('${m.id}')" title="Remover">✕</span>` : ''}
      <span>${m.label.split(' ')[0]}</span>
      <span style="font-size: 8px; font-weight: 700; color: #fff; background: rgba(0,0,0,0.7); padding: 1px 3px; border-radius: 3px; margin-top: 2px;">${m.label.split(' ').slice(1).join(' ')}</span>
    </div>
  `).join('');

  if (mLayer) mLayer.innerHTML = markersHtml(false);
  if (pvmLayer) pvmLayer.innerHTML = markersHtml(true);

  // 2. Templates AoE
  const aoeHtml = (isReadOnly = false) => (gridState.aoeTemplates || []).map(a => `
    <div id="aoe-${a.id}" class="aoe-template aoe-${a.type.split('_')[0]}" 
         style="left: ${a.x}px; top: ${a.y}px; width: ${a.width}px; height: ${a.height}px;"
         ${!isReadOnly ? `onmousedown="startAoEDrag(event, '${a.id}')"` : ''}>
      ${!isReadOnly ? `<span class="grid-marker-del" style="display: flex; top: 4px; right: 4px;" onclick="removeAoETemplate('${a.id}')" title="Remover Magia">✕</span>` : ''}
      <span>${a.label}</span>
    </div>
  `).join('');

  if (aLayer) aLayer.innerHTML = aoeHtml(false);
  if (pvaLayer) pvaLayer.innerHTML = aoeHtml(true);

  // 3. Tokens dos Combatentes
  const generateTokensHtml = (isReadOnly = false) => {
    return (gridState.tokens || []).filter(tok => {
      if (isReadOnly && tok.hidden) return false;
      return true;
    }).map(tok => {
      const c = state.combatants.find(x => x.id === tok.combatantId) || { hp: 10, maxHp: 10, conditions: [] };
      const isActive = currentActive && currentActive.id === tok.combatantId;
      const isSelected = selectedTokenIds.has(tok.id);
      const initial = tok.name.charAt(0).toUpperCase();
      const hpPct = c.maxHp ? Math.max(0, Math.min(100, Math.round((c.hp / c.maxHp) * 100))) : 100;
      const hpColor = hpPct > 50 ? '#10b981' : (hpPct > 25 ? '#eab308' : (hpPct > 0 ? '#ef4444' : '#64748b'));
      const sizeClass = `size-${tok.size || 'medium'}`;
      const icon = getTokenClassIcon(tok, c);
      // V4: Anel pulsante quando HP crítico (< 25%)
      const isLowHp = hpPct > 0 && hpPct <= 25;
      const isDead = hpPct === 0;

      // Condições ativas
      const conditions = (c.conditions || []).slice(0, 4);
      const condChipsHtml = conditions.map(cond => {
        let condEmoji = '⚡';
        const cl = cond.toLowerCase();
        if (cl.includes('incon') || cl.includes('sono')) condEmoji = '😴';
        else if (cl.includes('caíd') || cl.includes('prone')) condEmoji = '🧎';
        else if (cl.includes('ceg') || cl.includes('blind')) condEmoji = '🙈';
        else if (cl.includes('ven') || cl.includes('poison')) condEmoji = '☠️';
        else if (cl.includes('med') || cl.includes('fear')) condEmoji = '😱';
        else if (cl.includes('para') || cl.includes('stun')) condEmoji = '⚡';
        else if (cl.includes('pres') || cl.includes('rest')) condEmoji = '🕸️';
        else if (cl.includes('invis')) condEmoji = '👁️‍🗨️';
        return `<span class="token-cond-chip token-condition-badge" title="${cond}">${condEmoji}</span>`;
      }).join('');

      const auraHtml = (tok.aura && tok.aura.range && tok.aura.range !== 'none')
        ? `<div class="token-aura aura-${tok.aura.range} aura-${tok.aura.color || 'gold'}"></div>`
        : '';

      return `
        <div id="tok-el-${tok.id}" 
             class="grid-token ${sizeClass} ${tok.type === 'player' ? 'token-player' : 'token-monster'} ${isActive ? 'active-turn' : ''} ${isSelected ? 'selected' : ''} ${tok.hidden ? 'token-hidden' : ''} ${isLowHp ? 'token-low-hp' : ''} ${isDead ? 'token-dead' : ''}"
             style="left: ${tok.x + 3}px; top: ${tok.y + 3}px;"
             title="${tok.name} (${c.hp}/${c.maxHp} PV · ${hpPct}%) - Clique direito para menu"
             ${!isReadOnly ? `onmousedown="startTokenDrag(event, '${tok.id}')" oncontextmenu="openTokenContextMenu(event, '${tok.id}')"` : ''}>
          
          ${auraHtml}
          <div class="token-hp-ring ${isLowHp ? 'token-hp-ring-pulse' : ''}" style="border-color: ${hpColor};"></div>
          <div class="token-hp-bar"><div class="token-hp-fill" style="width: ${hpPct}%; background-color: ${hpColor};"></div></div>
          
          <div class="token-content"${isDead ? ' style="opacity:0.5;"' : ''}>
            <span class="token-icon">${isDead ? '💀' : icon}</span>
            <span class="token-initial">${initial}</span>
          </div>

          <div class="token-label"${isLowHp && !isDead ? ' style="color:#f87171;font-weight:800;"' : ''}>${tok.name}${isLowHp && !isDead ? ' ⚠️' : ''}</div>
          
          ${condChipsHtml ? `<div class="token-conditions-row token-conditions-badge-bar">${condChipsHtml}</div>` : ''}
          ${tok.altitude ? `<div class="token-altitude-badge">✈️ ${tok.altitude > 0 ? '+' : ''}${tok.altitude}m</div>` : ''}
          ${tok.hidden && !isReadOnly ? `<div class="token-hidden-badge" title="Oculto no Telão">👁️‍🗨️</div>` : ''}
        </div>
      `;
    }).join('');
  };

  container.innerHTML = generateTokensHtml(false);
  if (pvContainer) pvContainer.innerHTML = generateTokensHtml(true);
  if (typeof renderGridCombatantsDrawer === 'function') renderGridCombatantsDrawer();
  if (typeof renderVttCombatHud === 'function') renderVttCombatHud();
  // V2: Atualizar badge de ferramenta ativa
  if (typeof updateActiveToolBadge === 'function') updateActiveToolBadge(activeVttTool);
}

// --- ARRASTE DE MARCADORES E AOE ---
function startMarkerDrag(e, mId) {
  if (e.button !== 0) return;
  e.preventDefault(); e.stopPropagation();
  const marker = (gridState.markers || []).find(m => m.id === mId);
  if (!marker) return;

  const pos = clientToBoard(e.clientX, e.clientY);
  draggingMarker = marker;
  dragOffset = { x: pos.x - marker.x, y: pos.y - marker.y };
  document.addEventListener('mousemove', onMarkerDrag);
  document.addEventListener('mouseup', endMarkerDrag);
}

function onMarkerDrag(e) {
  if (!draggingMarker) return;
  const cSize = gridState.cellSize || 50;
  const pos = clientToBoard(e.clientX, e.clientY);
  let rawX = Math.max(0, Math.min(gridState.width - cSize, pos.x - dragOffset.x));
  let rawY = Math.max(0, Math.min(gridState.height - cSize, pos.y - dragOffset.y));
  draggingMarker.x = Math.round(rawX / cSize) * cSize;
  draggingMarker.y = Math.round(rawY / cSize) * cSize;

  const el = document.getElementById(`marker-${draggingMarker.id}`);
  if (el) { el.style.left = `${draggingMarker.x + 3}px`; el.style.top = `${draggingMarker.y + 3}px`; }
}

function endMarkerDrag() {
  document.removeEventListener('mousemove', onMarkerDrag);
  document.removeEventListener('mouseup', endMarkerDrag);
  if (draggingMarker) { broadcastGridState(); debouncedVttSave(); }
  draggingMarker = null;
}

function startAoEDrag(e, aId) {
  if (e.button !== 0) return;
  e.preventDefault(); e.stopPropagation();
  const aoe = (gridState.aoeTemplates || []).find(a => a.id === aId);
  if (!aoe) return;

  const pos = clientToBoard(e.clientX, e.clientY);
  draggingAoE = aoe;
  dragOffset = { x: pos.x - aoe.x, y: pos.y - aoe.y };
  document.addEventListener('mousemove', onAoEDrag);
  document.addEventListener('mouseup', endAoEDrag);
}

function onAoEDrag(e) {
  if (!draggingAoE) return;
  const cSize = gridState.cellSize || 50;
  const pos = clientToBoard(e.clientX, e.clientY);
  let rawX = Math.max(0, Math.min(gridState.width - draggingAoE.width, pos.x - dragOffset.x));
  let rawY = Math.max(0, Math.min(gridState.height - draggingAoE.height, pos.y - dragOffset.y));
  draggingAoE.x = Math.round(rawX / cSize) * cSize;
  draggingAoE.y = Math.round(rawY / cSize) * cSize;

  const el = document.getElementById(`aoe-${draggingAoE.id}`);
  if (el) { el.style.left = `${draggingAoE.x}px`; el.style.top = `${draggingAoE.y}px`; }
}

function endAoEDrag() {
  document.removeEventListener('mousemove', onAoEDrag);
  document.removeEventListener('mouseup', endAoEDrag);
  if (draggingAoE) { broadcastGridState(); debouncedVttSave(); }
  draggingAoE = null;
}

// --- ARRASTE DE TOKENS & RÉGUA DE DISTÂNCIA ---
function startTokenDrag(e, tokenId) {
  if (e.button !== 0) return;
  e.preventDefault();
  e.stopPropagation();
  closeTokenContextMenu();

  const token = (gridState.tokens || []).find(t => t.id === tokenId);
  if (!token) return;

  if (e.shiftKey) {
    if (selectedTokenIds.has(tokenId)) selectedTokenIds.delete(tokenId);
    else selectedTokenIds.add(tokenId);
    renderBattleGrid();
    return;
  }

  if (!selectedTokenIds.has(tokenId)) {
    selectedTokenIds.clear();
    selectedTokenIds.add(tokenId);
    renderBattleGrid();
  }

  const cSize = gridState.cellSize || 50;
  const span = getTokenSpan(token);
  const pos = clientToBoard(e.clientX, e.clientY);

  draggingToken = token;
  measuringOrigin = { x: token.x + ((span * cSize) / 2), y: token.y + ((span * cSize) / 2) };
  dragOffset = { x: pos.x - token.x, y: pos.y - token.y };

  multiDragInitialPositions.clear();
  selectedTokenIds.forEach(id => {
    const t = (gridState.tokens || []).find(tok => tok.id === id);
    if (t) multiDragInitialPositions.set(id, { x: t.x, y: t.y });
  });

  document.addEventListener('mousemove', onTokenDrag);
  document.addEventListener('mouseup', endTokenDrag);
}

function onTokenDrag(e) {
  if (!draggingToken) return;
  const cSize = gridState.cellSize || 50;
  const leaderSpan = getTokenSpan(draggingToken);
  const pos = clientToBoard(e.clientX, e.clientY);

  let rawX = pos.x - dragOffset.x;
  let rawY = pos.y - dragOffset.y;

  const maxX = (gridState.width || 1200) - (leaderSpan * cSize);
  const maxY = (gridState.height || 800) - (leaderSpan * cSize);

  rawX = Math.max(0, Math.min(maxX, rawX));
  rawY = Math.max(0, Math.min(maxY, rawY));

  const leaderSnappedX = Math.round(rawX / cSize) * cSize;
  const leaderSnappedY = Math.round(rawY / cSize) * cSize;

  const leaderInit = multiDragInitialPositions.get(draggingToken.id) || { x: draggingToken.x, y: draggingToken.y };
  const deltaX = leaderSnappedX - leaderInit.x;
  const deltaY = leaderSnappedY - leaderInit.y;

  selectedTokenIds.forEach(id => {
    const t = (gridState.tokens || []).find(tok => tok.id === id);
    const initPos = multiDragInitialPositions.get(id);
    if (t && initPos) {
      const span = getTokenSpan(t);
      const curMaxX = (gridState.width || 1200) - (span * cSize);
      const curMaxY = (gridState.height || 800) - (span * cSize);

      t.x = Math.max(0, Math.min(curMaxX, initPos.x + deltaX));
      t.y = Math.max(0, Math.min(curMaxY, initPos.y + deltaY));

      const el = document.getElementById(`tok-el-${t.id}`);
      if (el) {
        el.style.left = `${t.x + 3}px`;
        el.style.top = `${t.y + 3}px`;
      }
    }
  });

  // Atualização da régua de medição
  if (measuringOrigin) {
    const curCenter = { x: leaderSnappedX + ((leaderSpan * cSize) / 2), y: leaderSnappedY + ((leaderSpan * cSize) / 2) };
    const dx = (curCenter.x - measuringOrigin.x) / cSize;
    const dy = (curCenter.y - measuringOrigin.y) / cSize;
    const cellsMoved = Math.round(Math.hypot(dx, dy));
    const meters = (cellsMoved * 1.5).toFixed(1);
    const feet = cellsMoved * 5;

    const line = document.getElementById('grid-measure-line');
    const badge = document.getElementById('grid-measure-badge');
    if (line && badge) {
      const distPx = Math.hypot(curCenter.x - measuringOrigin.x, curCenter.y - measuringOrigin.y);
      const angle = Math.atan2(curCenter.y - measuringOrigin.y, curCenter.x - measuringOrigin.x) * (180 / Math.PI);

      line.style.display = 'block';
      line.style.width = `${distPx}px`;
      line.style.left = `${measuringOrigin.x}px`;
      line.style.top = `${measuringOrigin.y}px`;
      line.style.transform = `rotate(${angle}deg)`;

      badge.style.display = 'block';
      badge.style.left = `${(measuringOrigin.x + curCenter.x) / 2}px`;
      badge.style.top = `${(measuringOrigin.y + curCenter.y) / 2 - 16}px`;
      const countStr = selectedTokenIds.size > 1 ? ` (${selectedTokenIds.size} tokens)` : '';
      badge.innerText = `📏 ${meters}m (${feet} ft / ${cellsMoved} casas)${countStr}`;
    }
  }
}

function endTokenDrag() {
  document.removeEventListener('mousemove', onTokenDrag);
  document.removeEventListener('mouseup', endTokenDrag);

  const line = document.getElementById('grid-measure-line');
  const badge = document.getElementById('grid-measure-badge');
  if (line) line.style.display = 'none';
  if (badge) badge.style.display = 'none';

  if (draggingToken) {
    broadcastGridState();
    debouncedVttSave();
    if (typeof playFX === 'function') playFX('sword');
  }

  draggingToken = null;
  measuringOrigin = null;
  multiDragInitialPositions.clear();
}

// --- MENU CONTEXTUAL RÁPIDO DO TOKEN ---
function openTokenContextMenu(e, tokenId) {
  e.preventDefault();
  e.stopPropagation();

  const token = (gridState.tokens || []).find(t => t.id === tokenId);
  if (!token) return;
  activeContextMenuTokenId = tokenId;

  const menu = document.getElementById('grid-token-context-menu');
  const viewport = document.getElementById('battlegrid-viewport');
  if (!menu || !viewport) return;

  const vpRect = viewport.getBoundingClientRect();
  const posX = e.clientX - vpRect.left + 5;
  const posY = e.clientY - vpRect.top + 5;

  const combatant = state.combatants.find(c => c.id === token.combatantId) || { hp: 10, maxHp: 10 };
  const isHidden = !!token.hidden;
  const curSize = token.size || 'medium';

  menu.innerHTML = `
    <div style="font-size: 11px; font-weight: 800; color: var(--primary-light); padding: 4px 8px; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
      <span>${token.name}</span>
      <span style="font-size: 10px; color: var(--text-muted);">${combatant.hp}/${combatant.maxHp} PV</span>
    </div>
    
    <!-- DANO E CURA RÁPIDA -->
    <div style="display: flex; gap: 4px; padding: 4px 6px;">
      <button class="btn-action" style="padding: 2px 6px; font-size: 10px; flex: 1; background: #ef4444;" onclick="applyTokenQuickDamage('${tokenId}', 5)">💥 -5</button>
      <button class="btn-action" style="padding: 2px 6px; font-size: 10px; flex: 1; background: #b91c1c;" onclick="applyTokenQuickDamage('${tokenId}', 10)">💥 -10</button>
      <button class="btn-action" style="padding: 2px 6px; font-size: 10px; flex: 1; background: #10b981;" onclick="applyTokenQuickHeal('${tokenId}', 5)">💚 +5</button>
      <button class="btn-action" style="padding: 2px 6px; font-size: 10px; flex: 1; background: #047857;" onclick="applyTokenQuickHeal('${tokenId}', 10)">💚 +10</button>
    </div>

    <div class="grid-context-divider"></div>

    <!-- TAMANHOS D&D 5E -->
    <div style="font-size: 10px; color: var(--text-dim); padding: 2px 8px; font-weight: 700;">TAMANHO D&D:</div>
    <div class="grid-context-item ${curSize === 'medium' ? 'selected' : ''}" onclick="setTokenSize('${tokenId}', 'medium')">
      <span>${curSize === 'medium' ? '✓ ' : ''}Médio / Pequeno (1x1)</span>
    </div>
    <div class="grid-context-item ${curSize === 'large' ? 'selected' : ''}" onclick="setTokenSize('${tokenId}', 'large')">
      <span>${curSize === 'large' ? '✓ ' : ''}Grande (2x2 - Ogro/Cavalo)</span>
    </div>
    <div class="grid-context-item ${curSize === 'huge' ? 'selected' : ''}" onclick="setTokenSize('${tokenId}', 'huge')">
      <span>${curSize === 'huge' ? '✓ ' : ''}Enorme (3x3 - Gigante)</span>
    </div>
    <div class="grid-context-item ${curSize === 'gargantuan' ? 'selected' : ''}" onclick="setTokenSize('${tokenId}', 'gargantuan')">
      <span>${curSize === 'gargantuan' ? '✓ ' : ''}Imenso (4x4 - Dragão Ancião)</span>
    </div>

    <div class="grid-context-divider"></div>

    <!-- AURAS E ALCANCES (D&D 5E) -->
    <div style="font-size: 10px; color: var(--text-dim); padding: 2px 8px; font-weight: 700;">✨ AURA DE ALCANCE:</div>
    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 3px; padding: 2px 6px;">
      <button class="btn-micro ${(token.aura?.range === 'none' || !token.aura) ? 'active' : ''}" onclick="setTokenAura('${tokenId}', 'none')">Off</button>
      <button class="btn-micro ${token.aura?.range === '3m' ? 'active' : ''}" onclick="setTokenAura('${tokenId}', '3m', '${token.aura?.color || 'gold'}')">3m</button>
      <button class="btn-micro ${token.aura?.range === '6m' ? 'active' : ''}" onclick="setTokenAura('${tokenId}', '6m', '${token.aura?.color || 'gold'}')">6m</button>
      <button class="btn-micro ${token.aura?.range === '9m' ? 'active' : ''}" onclick="setTokenAura('${tokenId}', '9m', '${token.aura?.color || 'gold'}')">9m</button>
    </div>
    ${token.aura && token.aura.range !== 'none' ? `
      <div style="display: flex; gap: 4px; padding: 2px 6px; align-items: center; justify-content: space-between;">
        <span style="font-size: 9px; color: var(--text-muted);">Cor:</span>
        <div style="display: flex; gap: 4px; flex-wrap: wrap;">
          <span style="width: 12px; height: 12px; border-radius: 50%; background: #f59e0b; cursor: pointer; border: ${token.aura.color === 'gold' ? '2px solid #fff' : '1px solid #000'};" onclick="setTokenAura('${tokenId}', '${token.aura.range}', 'gold')" title="Dourada (Bênção / Paladino)"></span>
          <span style="width: 12px; height: 12px; border-radius: 50%; background: #38bdf8; cursor: pointer; border: ${token.aura.color === 'blue' ? '2px solid #fff' : '1px solid #000'};" onclick="setTokenAura('${tokenId}', '${token.aura.range}', 'blue')" title="Azul (Escudo / Proteção)"></span>
          <span style="width: 12px; height: 12px; border-radius: 50%; background: #ef4444; cursor: pointer; border: ${token.aura.color === 'red' ? '2px solid #fff' : '1px solid #000'};" onclick="setTokenAura('${tokenId}', '${token.aura.range}', 'red')" title="Vermelha (Fogo / Agressiva)"></span>
          <span style="width: 12px; height: 12px; border-radius: 50%; background: #10b981; cursor: pointer; border: ${token.aura.color === 'green' ? '2px solid #fff' : '1px solid #000'};" onclick="setTokenAura('${tokenId}', '${token.aura.range}', 'green')" title="Verde (Cura / Natureza)"></span>
          <span style="width: 12px; height: 12px; border-radius: 50%; background: #a855f7; cursor: pointer; border: ${token.aura.color === 'purple' ? '2px solid #fff' : '1px solid #000'};" onclick="setTokenAura('${tokenId}', '${token.aura.range}', 'purple')" title="Roxa (Arcana / Maldição)"></span>
          <span style="width: 12px; height: 12px; border-radius: 50%; background: #06b6d4; cursor: pointer; border: ${token.aura.color === 'cyan' ? '2px solid #fff' : '1px solid #000'};" onclick="setTokenAura('${tokenId}', '${token.aura.range}', 'cyan')" title="Ciano (Gelo / Mística)"></span>
          <span style="width: 12px; height: 12px; border-radius: 50%; background: #f97316; cursor: pointer; border: ${token.aura.color === 'orange' ? '2px solid #fff' : '1px solid #000'};" onclick="setTokenAura('${tokenId}', '${token.aura.range}', 'orange')" title="Laranja (Chama / Solar)"></span>
        </div>
      </div>
    ` : ''}

    <div class="grid-context-divider"></div>

    <!-- STATUS & OCULTAÇÃO -->
    <div class="grid-context-item" onclick="setTokenAltitude('${tokenId}')">
      <span>✈️ Definir Altitude / Voo...</span>
    </div>
    <div class="grid-context-item" onclick="toggleTokenHidden('${tokenId}')">
      <span>${isHidden ? '👁️ Revelar no Telão' : '👁️‍🗨️ Ocultar no Telão (Emboscada)'}</span>
    </div>
    <div class="grid-context-item" style="color: #f87171;" onclick="removeTokenFromGrid('${tokenId}')">
      <span>🗑️ Remover Token do Grid</span>
    </div>
  `;

  menu.style.left = `${posX}px`;
  menu.style.top = `${posY}px`;
  menu.style.display = 'flex';
}

function setTokenAura(tokId, range, color = 'gold') {
  const token = (gridState.tokens || []).find(t => t.id === tokId);
  if (!token) return;
  if (range === 'none') {
    token.aura = null;
  } else {
    token.aura = { range, color };
  }
  renderBattleGrid();
  broadcastGridState();
  saveToLocalStorage();
  closeTokenContextMenu();
}

// --- CENÁRIO & MAPAS CUSTOMIZADOS ---
function setGridMapBackground(theme, customDataUrl = null) {
  gridState.theme = theme;
  if (customDataUrl) {
    gridState.customImage = customDataUrl;
  }

  const board = document.getElementById('battlegrid-board');
  const pvBoard = document.getElementById('pv-battlegrid-board');
  const selTheme = document.getElementById('bg-map-theme');
  const selConfigTheme = document.getElementById('sel-config-map-theme');

  if (selTheme) selTheme.value = theme;
  if (selConfigTheme) selConfigTheme.value = theme;

  const allThemes = ['bg-dungeon', 'bg-forest', 'bg-tavern', 'bg-cave', 'bg-ruins', 'bg-desert', 'bg-tundra', 'bg-ship', 'bg-magma', 'bg-astral', 'custom'];

  [board, pvBoard].forEach(b => {
    if (b) {
      allThemes.forEach(t => b.classList.remove(t));
      if (theme === 'custom' && (customDataUrl || gridState.customImage)) {
        b.classList.add('custom');
        b.style.backgroundImage = `url("${customDataUrl || gridState.customImage}")`;
        b.style.backgroundSize = 'cover';
        b.style.backgroundPosition = 'center';
      } else {
        b.classList.add(theme);
        b.style.backgroundImage = '';
        b.style.backgroundSize = '';
        b.style.backgroundPosition = '';
      }
    }
  });

  saveScenesState();
  broadcastGridState();
  saveToLocalStorage();
}

function handleCustomMapUpload(input) {
  if (!input || !input.files || input.files.length === 0) return;
  const file = input.files[0];
  if (!file.type.startsWith('image/')) {
    alert('Por favor, selecione um arquivo de imagem válido (PNG, JPG, WebP)!');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const dataUrl = e.target.result;
    setGridMapBackground('custom', dataUrl);
    
    const optCustom = document.getElementById('opt-custom-map');
    if (optCustom) optCustom.style.display = 'block';

    if (typeof addLog === 'function') {
      addLog(`🗺️ <b>Novo Mapa de Batalha:</b> Imagem customizada carregada (${file.name})!`);
    }
    if (typeof playFX === 'function') playFX('crit');
  };
  reader.readAsDataURL(file);
}

function triggerCustomMapUpload() {
  const inp = document.getElementById('inp-custom-map-file');
  if (inp) inp.click();
}


function closeTokenContextMenu() {
  const menu = document.getElementById('grid-token-context-menu');
  if (menu) menu.style.display = 'none';
  activeContextMenuTokenId = null;
}

function applyTokenQuickDamage(tokId, dmg) {
  const token = (gridState.tokens || []).find(t => t.id === tokId);
  if (!token) return;
  const combatant = state.combatants.find(c => c.id === token.combatantId);
  if (!combatant) return;

  combatant.hp = Math.max(0, combatant.hp - dmg);
  
  // Sincroniza se for jogador
  if (combatant.type === 'player' && typeof PLAYERS !== 'undefined') {
    const p = PLAYERS.find(x => combatant.name.includes(x.name));
    if (p) p.hp = combatant.hp;
  }

  if (typeof renderCombat === 'function') renderCombat();
  if (typeof renderPlayers === 'function') renderPlayers();
  renderBattleGrid();
  broadcastGridState();
  saveToLocalStorage();
  closeTokenContextMenu();
  if (typeof playFX === 'function') playFX(combatant.hp === 0 ? 'crit' : 'sword');
}

function applyTokenQuickHeal(tokId, heal) {
  const token = (gridState.tokens || []).find(t => t.id === tokId);
  if (!token) return;
  const combatant = state.combatants.find(c => c.id === token.combatantId);
  if (!combatant) return;

  combatant.hp = Math.min(combatant.maxHp, combatant.hp + heal);
  
  if (combatant.type === 'player' && typeof PLAYERS !== 'undefined') {
    const p = PLAYERS.find(x => combatant.name.includes(x.name));
    if (p) p.hp = combatant.hp;
  }

  if (typeof renderCombat === 'function') renderCombat();
  if (typeof renderPlayers === 'function') renderPlayers();
  renderBattleGrid();
  broadcastGridState();
  saveToLocalStorage();
  closeTokenContextMenu();
  if (typeof playFX === 'function') playFX('spell');
}

function setTokenSize(tokId, size) {
  const token = (gridState.tokens || []).find(t => t.id === tokId);
  if (!token) return;
  token.size = size;
  renderBattleGrid();
  broadcastGridState();
  saveToLocalStorage();
  closeTokenContextMenu();
  if (typeof playFX === 'function') playFX('sword');
}

function setTokenAltitude(tokId) {
  const token = (gridState.tokens || []).find(t => t.id === tokId);
  if (!token) return;
  const cur = token.altitude || 0;
  const input = prompt('Digite a altitude em metros (ex: 6 para voo a 6m, 0 para chão, -3 para submerso):', cur);
  if (input !== null) {
    token.altitude = parseInt(input, 10) || 0;
    renderBattleGrid();
    broadcastGridState();
    saveToLocalStorage();
  }
  closeTokenContextMenu();
}

function toggleTokenHidden(tokId) {
  const token = (gridState.tokens || []).find(t => t.id === tokId);
  if (!token) return;
  token.hidden = !token.hidden;
  renderBattleGrid();
  broadcastGridState();
  saveToLocalStorage();
  closeTokenContextMenu();
  if (typeof playFX === 'function') playFX('spell');
}

function removeTokenFromGrid(tokId) {
  gridState.tokens = (gridState.tokens || []).filter(t => t.id !== tokId);
  renderBattleGrid();
  broadcastGridState();
  saveToLocalStorage();
  closeTokenContextMenu();
}

// --- TRANSMISSÃO E PERSISTÊNCIA ---
function broadcastGridState() {
  const payload = {
    type: 'GRID_UPDATE',
    gridState: gridState
  };

  if (typeof syncChannel !== 'undefined' && syncChannel) {
    syncChannel.postMessage(payload);
  }

  try {
    localStorage.setItem('dnd5e_prisco_live_grid', JSON.stringify(gridState));
  } catch (e) {}
}

// --- ESCUTADOR GLOBAL DE TECLADO (ESPAÇO PARA MODO MÃO + CTRL+Z PARA UNDO) ---
if (typeof window !== 'undefined') {
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA' && e.target.tagName !== 'SELECT') {
      isSpacePressed = true;
      const vp = document.getElementById('battlegrid-viewport');
      if (vp) vp.classList.add('mode-pan');
    }
    // B6: Ctrl+Z para desfazer traço de giz
    if ((e.ctrlKey || e.metaKey) && e.code === 'KeyZ' && activeVttTool === 'draw') {
      e.preventDefault();
      undoLastDrawing();
    }
  });

  window.addEventListener('keyup', (e) => {
    if (e.code === 'Space') {
      isSpacePressed = false;
      const vp = document.getElementById('battlegrid-viewport');
      if (vp && !isPanModeActive) vp.classList.remove('mode-pan');
    }
  });
}

// --- HUD / DOCK DE COMBATE RÁPIDO INTEGRADO NO VTT ---
let isVttCombatHudCollapsed = false;

function toggleVttCombatHud() {
  isVttCombatHudCollapsed = !isVttCombatHudCollapsed;
  const hud = document.getElementById('vtt-combat-hud');
  const btn = document.getElementById('btn-toggle-vtt-hud');
  if (hud) hud.classList.toggle('collapsed', isVttCombatHudCollapsed);
  if (btn) btn.innerHTML = isVttCombatHudCollapsed ? '🔽' : '🔼';
}

function renderVttCombatHud() {
  const roundEl = document.getElementById('lbl-vtt-round');
  const nameEl = document.getElementById('vtt-active-name');
  const statsEl = document.getElementById('vtt-active-stats');
  const iconEl = document.getElementById('vtt-active-icon');
  const hpBox = document.getElementById('vtt-active-hp-bar-box');
  const hpFill = document.getElementById('vtt-active-hp-fill');
  const selTarget = document.getElementById('sel-vtt-target');
  const actionsList = document.getElementById('vtt-hud-actions-list');
  const timelineList = document.getElementById('vtt-hud-timeline-list');

  const combatants = state.combatants || [];
  if (roundEl) roundEl.innerText = String(state.round || 1);

  // Atualizar select de alvo
  if (selTarget) {
    const curVal = selTarget.value;
    selTarget.innerHTML = combatants.length > 0 
      ? combatants.map(c => `<option value="${c.id}">${c.name} (${c.hp}/${c.maxHp} PV)</option>`).join('')
      : '<option value="">Sem alvos</option>';
    
    if (curVal && combatants.some(c => c.id === curVal)) {
      selTarget.value = curVal;
    } else if (combatants.length > 0) {
      const targetIdx = (state.turnIndex + 1) % combatants.length;
      if (combatants[targetIdx]) selTarget.value = combatants[targetIdx].id;
    }
  }

  if (combatants.length === 0) {
    if (nameEl) {
      nameEl.innerText = 'Sem combate ativo';
      nameEl.style.color = '#fff';
    }
    if (statsEl) statsEl.innerText = 'Adicione criaturas ou alunos';
    if (iconEl) iconEl.innerText = '⚔️';
    if (hpBox) hpBox.style.display = 'none';
    if (actionsList) actionsList.innerHTML = '<span style="font-size:10px; color:var(--text-dim);">Nenhum combatente na mesa.</span>';
    if (timelineList) timelineList.innerHTML = '<span style="font-size:10px; color:var(--text-dim);">-</span>';
    return;
  }

  const active = combatants[state.turnIndex] || combatants[0];
  const isPlayer = active.type === 'player';
  const hpPct = active.maxHp ? Math.max(0, Math.min(100, Math.round((active.hp / active.maxHp) * 100))) : 100;
  const hpColor = hpPct > 50 ? 'var(--accent-green)' : (hpPct > 25 ? '#eab308' : 'var(--accent-red)');

  if (nameEl) {
    nameEl.innerText = active.name;
    nameEl.style.color = isPlayer ? 'var(--primary-light)' : '#f87171';
  }
  if (statsEl) {
    statsEl.innerHTML = `Inic: <b style="color:var(--primary);">${active.init}</b> | CA: <b style="color:#fff;">${active.ac}</b> | PV: <b style="color:${hpColor};">${active.hp}/${active.maxHp}</b>`;
  }
  if (iconEl) iconEl.innerText = isPlayer ? '🛡️' : '🐉';
  if (hpBox) hpBox.style.display = 'block';
  if (hpFill) {
    hpFill.style.width = `${hpPct}%`;
    hpFill.style.backgroundColor = hpColor;
  }

  // Renderizar Ações Rápidas do Ativo
  if (actionsList) {
    let actionsHtml = '';
    if (isPlayer) {
      const pl = typeof findPlayerForCombatant === 'function'
        ? findPlayerForCombatant(active, typeof PLAYERS !== 'undefined' ? PLAYERS : [])
        : (typeof PLAYERS !== 'undefined' ? PLAYERS.find(p => (active.playerId && p.id === active.playerId) || active.name.includes(p.name)) : null);
      if (pl && Array.isArray(pl.attacks) && pl.attacks.length > 0) {
        actionsHtml = pl.attacks.map(atk => `
          <button class="vtt-action-chip" onclick="rollVttPlayerAttack('${pl.id}', '${(atk.name||'').replace(/'/g, "\\'")}', '${atk.bonus||0}', '${atk.damage||'1d6'}')">
            <span>⚔️ ${atk.name} (${atk.bonus >= 0 ? '+' + atk.bonus : atk.bonus})</span>
          </button>
        `).join('');
      } else if (pl && typeof pl.attacks === 'string' && pl.attacks.trim()) {
        actionsHtml = `
          <button class="vtt-action-chip" onclick="rollDiceFormula('1d20+4', '${active.name} - Ataque')">⚔️ ${pl.attacks.slice(0, 18)}</button>
          <button class="vtt-action-chip" onclick="rollDiceFormula('1d8+2', '${active.name} - Dano')">🎲 1d8+2 Dano</button>
        `;
      } else {
        actionsHtml = `
          <button class="vtt-action-chip" onclick="rollDiceFormula('1d20+4', '${active.name} - Ataque')">⚔️ Ataque (+4)</button>
          <button class="vtt-action-chip" onclick="rollDiceFormula('1d8+2', '${active.name} - Dano')">🎲 1d8+2 Dano</button>
        `;
      }
    } else {
      actionsHtml = `
        <button class="vtt-action-chip" onclick="rollDiceFormula('1d20+4', '${active.name} - Ataque')">⚔️ Ataque (+4)</button>
        <button class="vtt-action-chip" onclick="rollDiceFormula('1d6+2', '${active.name} - Dano')">🎲 1d6+2 Dano</button>
        <button class="vtt-action-chip" onclick="openCondModal('${active.id}')">🏷️ Status</button>
      `;
    }
    actionsList.innerHTML = actionsHtml;
  }

  // Renderizar Timeline de Iniciativa
  if (timelineList) {
    timelineList.innerHTML = combatants.map((c, i) => {
      const isActive = i === state.turnIndex;
      const cIsPlayer = c.type === 'player';
      const cToken = (gridState.tokens || []).find(t => t.combatantId === c.id);
      const cPct = c.maxHp ? Math.max(0, Math.min(100, Math.round((c.hp / c.maxHp) * 100))) : 100;
      const cColor = cPct > 50 ? '#10b981' : (cPct > 25 ? '#eab308' : '#ef4444');
      return `
        <div class="vtt-timeline-token ${isActive ? 'active' : ''}" onclick="focusTokenById('${cToken ? cToken.id : ''}')" title="Clique para centralizar no mapa">
          <span>${cIsPlayer ? '🛡️' : '🐉'}</span>
          <span style="font-size:10px; color:${isActive ? '#fff' : 'var(--text-muted)'};">${c.name.split(' ')[0]}</span>
          <span style="font-size:9px; font-weight:bold; color:${cColor};">${c.hp}</span>
        </div>
      `;
    }).join('');
  }
}

function rollVttPlayerAttack(playerId, atkName, bonus, damageFormula) {
  const bonusNum = parseInt(bonus, 10) || 0;
  const d20 = Math.floor(Math.random() * 20) + 1;
  const totalAtk = d20 + bonusNum;
  let dmgTotal = 4;

  if (typeof rollFormula === 'function') {
    const res = rollFormula(damageFormula || '1d6');
    dmgTotal = res.total || 4;
  } else {
    dmgTotal = Math.floor(Math.random() * 6) + 1 + 2;
  }

  if (typeof addLog === 'function') {
    addLog(`🎲 <b>${atkName}</b>: Ataque = <b>${totalAtk}</b> (d20:${d20}+${bonusNum}) | Dano = <b>${dmgTotal}</b> (${damageFormula})`);
  }
  const inp = document.getElementById('inp-vtt-damage');
  if (inp) inp.value = dmgTotal;
  if (typeof playFX === 'function') playFX('sword');
}

function applyVttCombatAction(type) {
  const tarId = document.getElementById('sel-vtt-target')?.value;
  const dmg = parseInt(document.getElementById('inp-vtt-damage')?.value) || 0;
  
  if (!tarId) { alert('Selecione um alvo válido!'); return; }

  // Sincroniza com os selects e inputs centrais de combate
  const mainSelTar = document.getElementById('sel-target');
  const mainInpDmg = document.getElementById('inp-damage');
  if (mainSelTar) mainSelTar.value = tarId;
  if (mainInpDmg) mainInpDmg.value = dmg;

  if (typeof applyCombatAction === 'function') {
    applyCombatAction(type);
  }

  const inp = document.getElementById('inp-vtt-damage');
  if (inp) inp.value = '';
  renderVttCombatHud();
}

function applyVttHalfDamage() {
  const inp = document.getElementById('inp-vtt-damage');
  const val = parseInt(inp?.value, 10);
  if (isNaN(val) || val <= 0) {
    alert('Digite o valor do dano base primeiro!');
    return;
  }
  const halfVal = Math.floor(val / 2);
  inp.value = halfVal;
  applyVttCombatAction('damage');
}

function applyVttDoubleDamage() {
  const inp = document.getElementById('inp-vtt-damage');
  const val = parseInt(inp?.value, 10);
  if (isNaN(val) || val <= 0) {
    alert('Digite o valor do dano base primeiro!');
    return;
  }
  const doubleVal = val * 2;
  inp.value = doubleVal;
  applyVttCombatAction('damage');
}

// --- ABA DE CONFIGURAÇÕES DO GRID & CENÁRIOS ---
function renderGridConfig() {
  const selScene = document.getElementById('sel-config-scene-active');
  const listScenes = document.getElementById('config-scenes-list');
  const selTheme = document.getElementById('sel-config-map-theme');
  const lblTheme = document.getElementById('lbl-config-theme-current');
  const inpW = document.getElementById('inp-config-grid-w');
  const inpH = document.getElementById('inp-config-grid-h');
  const selCellSize = document.getElementById('sel-config-cell-size');
  const selLineStyle = document.getElementById('sel-config-line-style');
  const lblStats = document.getElementById('lbl-config-grid-stats');
  const lblFowStatus = document.getElementById('lbl-config-fow-status');
  const btnToggleFow = document.getElementById('btn-config-toggle-fow');
  const selWeather = document.getElementById('sel-config-weather');
  const btnCoords = document.getElementById('btn-config-toggle-coords');

  const curSceneId = scenesState.activeSceneId || 'scene-1';
  const curScene = (scenesState.scenes || []).find(s => s.id === curSceneId);

  // Cenas Select & List
  if (selScene) {
    selScene.innerHTML = (scenesState.scenes || []).map(s => `
      <option value="${s.id}" ${s.id === curSceneId ? 'selected' : ''}>${s.name}</option>
    `).join('');
  }

  if (listScenes) {
    listScenes.innerHTML = (scenesState.scenes || []).map(s => {
      const isAct = s.id === curSceneId;
      const tokCount = (s.gridState?.tokens || []).length;
      return `
        <div class="config-scene-item ${isAct ? 'active' : ''}" onclick="switchScene('${s.id}'); renderGridConfig();">
          <div style="display:flex; align-items:center; gap:6px;">
            <span style="font-size:13px;">${isAct ? '🏰' : '🗺️'}</span>
            <b style="color:${isAct ? 'var(--primary-light)' : '#fff'};">${s.name}</b>
            <span style="font-size:10px; color:var(--text-muted);">(${tokCount} tokens • ${s.gridState?.width || 1200}x${s.gridState?.height || 800})</span>
          </div>
          ${isAct ? '<span class="badge badge-cls" style="font-size:9px;">Ativa</span>' : ''}
        </div>
      `;
    }).join('');
  }

  // Tema
  const curTheme = gridState.theme || 'bg-dungeon';
  if (selTheme) selTheme.value = curTheme;
  if (lblTheme) {
    const themeNames = {
      'bg-dungeon': 'Masmorra',
      'bg-forest': 'Floresta',
      'bg-tavern': 'Taverna',
      'bg-cave': 'Caverna',
      'bg-ruins': 'Ruínas',
      'bg-desert': 'Deserto',
      'bg-tundra': 'Tundra',
      'bg-ship': 'Navio',
      'bg-magma': 'Magma',
      'bg-astral': 'Astral',
      'custom': 'Customizado'
    };
    lblTheme.innerText = themeNames[curTheme] || curTheme;
  }

  // Dimensões
  const w = gridState.width || 1200;
  const h = gridState.height || 800;
  const cSize = gridState.cellSize || 50;
  if (inpW) inpW.value = w;
  if (inpH) inpH.value = h;
  if (selCellSize) selCellSize.value = cSize.toString();
  if (selLineStyle) selLineStyle.value = gridState.lineStyle || 'default';
  if (lblStats) {
    const cols = Math.round(w / cSize);
    const rows = Math.round(h / cSize);
    lblStats.innerText = `${cSize}px • ${cols}x${rows} casas (${w}x${h}px)`;
  }

  // Névoa
  if (lblFowStatus && btnToggleFow) {
    const fowActive = !!gridState.fogOfWar;
    lblFowStatus.className = `badge ${fowActive ? 'badge-cls' : 'badge-cr'}`;
    lblFowStatus.innerText = fowActive ? 'Ativada' : 'Desativada';
    btnToggleFow.innerText = fowActive ? 'Desativar Névoa' : 'Ativar Névoa';
  }

  // Clima
  if (selWeather) selWeather.value = gridState.weatherEffect || 'none';
  if (btnCoords) {
    btnCoords.innerText = gridState.showCoords ? 'Coordenadas: Visíveis' : 'Coordenadas: Ocultas';
    btnCoords.classList.toggle('active', !!gridState.showCoords);
  }
}

function updateGridDimensionsFromConfig() {
  const inpW = document.getElementById('inp-config-grid-w');
  const inpH = document.getElementById('inp-config-grid-h');
  const cSize = gridState.cellSize || 50;

  let w = parseInt(inpW?.value, 10) || 1200;
  let h = parseInt(inpH?.value, 10) || 800;

  w = Math.max(400, Math.min(4000, Math.round(w / cSize) * cSize));
  h = Math.max(400, Math.min(4000, Math.round(h / cSize) * cSize));

  gridState.width = w;
  gridState.height = h;

  applyGridDimensions();
  renderBattleGrid();
  renderGridConfig();
  broadcastGridState();
  saveToLocalStorage();
}

function setGridPresetDimensions(w, h) {
  const cSize = gridState.cellSize || 50;
  gridState.width = Math.round(w / cSize) * cSize;
  gridState.height = Math.round(h / cSize) * cSize;
  applyGridDimensions();
  renderBattleGrid();
  renderGridConfig();
  broadcastGridState();
  saveToLocalStorage();
}

function setDmFogOpacity(val) {
  const floatVal = parseFloat(val) || 0.45;
  const canvas = document.getElementById('fow-canvas-dm');
  const lbl = document.getElementById('lbl-config-fow-opacity-val');
  if (canvas) canvas.style.opacity = floatVal.toString();
  if (lbl) lbl.innerText = `${Math.round(floatVal * 100)}%`;
}

function duplicateCurrentScene() {
  const curId = scenesState.activeSceneId || 'scene-1';
  if (typeof duplicateScene === 'function') {
    duplicateScene(curId);
    renderGridConfig();
  }
}

function renameCurrentScenePrompt() {
  const curId = scenesState.activeSceneId || 'scene-1';
  const curScene = (scenesState.scenes || []).find(s => s.id === curId);
  const newName = prompt('Digite o novo nome para a cena:', curScene ? curScene.name : 'Nova Cena');
  if (newName && newName.trim()) {
    if (typeof renameScene === 'function') {
      renameScene(curId, newName.trim());
      renderGridConfig();
    }
  }
}

function deleteCurrentSceneConfirm() {
  const curId = scenesState.activeSceneId || 'scene-1';
  if (scenesState.scenes.length <= 1) {
    alert('Você deve manter pelo menos uma cena!');
    return;
  }
  if (confirm('Tem certeza que deseja excluir a cena ativa?')) {
    if (typeof deleteScene === 'function') {
      deleteScene(curId);
      renderGridConfig();
    }
  }
}

// Exportações para Window e Node.js
if (typeof window !== 'undefined') {
  window.handleBoardTouchStart = handleBoardTouchStart;
  window.handleBoardTouchMove = handleBoardTouchMove;
  window.handleBoardTouchEnd = handleBoardTouchEnd;
  window.setTokenAura = setTokenAura;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ...(typeof module.exports === 'object' ? module.exports : {}),
    handleBoardTouchStart,
    handleBoardTouchMove,
    handleBoardTouchEnd,
    setTokenAura
  };
}


