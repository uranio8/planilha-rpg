// src/js/campaigns.js - Gerenciamento de Campanhas, Heróis Vinculados, Diário e Inventário do Grupo

let CAMPAIGNS_STATE = {
  activeCampaignId: "camp_1",
  campaigns: (typeof INITIAL_CAMPAIGNS !== 'undefined') ? JSON.parse(JSON.stringify(INITIAL_CAMPAIGNS)) : []
};

function getActiveCampaign() {
  if (!CAMPAIGNS_STATE.campaigns || CAMPAIGNS_STATE.campaigns.length === 0) {
    CAMPAIGNS_STATE.campaigns = (typeof INITIAL_CAMPAIGNS !== 'undefined') ? JSON.parse(JSON.stringify(INITIAL_CAMPAIGNS)) : [];
    CAMPAIGNS_STATE.activeCampaignId = CAMPAIGNS_STATE.campaigns[0]?.id || "camp_1";
  }
  let camp = CAMPAIGNS_STATE.campaigns.find(c => c.id === CAMPAIGNS_STATE.activeCampaignId);
  if (!camp && CAMPAIGNS_STATE.campaigns.length > 0) {
    camp = CAMPAIGNS_STATE.campaigns[0];
    CAMPAIGNS_STATE.activeCampaignId = camp.id;
  }
  return camp;
}

function saveCampaignsState() {
  try {
    localStorage.setItem('dnd5e_prisco_campaigns_v1', JSON.stringify(CAMPAIGNS_STATE));
    if (typeof showSaveStatus === 'function') showSaveStatus();
    if (typeof broadcastCampaignState === 'function') broadcastCampaignState();
    if (typeof syncLocalChangesToFirebase === 'function') syncLocalChangesToFirebase();
  } catch (e) {
    console.warn('Erro ao salvar campanhas:', e);
  }
}

function loadCampaignsState() {
  try {
    const raw = localStorage.getItem('dnd5e_prisco_campaigns_v1');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.campaigns) && parsed.campaigns.length > 0) {
        CAMPAIGNS_STATE = parsed;
        return true;
      }
    }
  } catch (e) {}
  return false;
}

function broadcastCampaignState() {
  if (typeof syncChannel !== 'undefined' && syncChannel) {
    syncChannel.postMessage({
      type: 'CAMPAIGNS_UPDATE',
      campaignsState: CAMPAIGNS_STATE
    });
  }
}

// --- RENDERIZAÇÃO DA ABA DE CAMPANHAS ---
function renderCampaigns() {
  const camp = getActiveCampaign();
  if (!camp) return;

  // Atualiza badges e seletores
  const selCamp = document.getElementById('sel-active-campaign');
  if (selCamp) {
    selCamp.innerHTML = CAMPAIGNS_STATE.campaigns.map(c => `
      <option value="${c.id}" ${c.id === camp.id ? 'selected' : ''}>${c.name} (${c.status === 'active' ? '🟢 Ativa' : (c.status === 'paused' ? '🟡 Pausada' : '🏁 Concluída')})</option>
    `).join('');
  }

  // Header Info
  const titleEl = document.getElementById('camp-title-display');
  const descEl = document.getElementById('camp-desc-display');
  const statusBadge = document.getElementById('camp-status-badge');
  const heroesCountBadge = document.getElementById('camp-heroes-count');
  const sessionsCountBadge = document.getElementById('camp-sessions-count');

  if (titleEl) titleEl.innerText = camp.name;
  if (descEl) descEl.innerText = camp.desc || 'Nenhuma descrição cadastrada.';
  if (statusBadge) {
    statusBadge.className = `badge ${camp.status === 'active' ? 'badge-cls' : (camp.status === 'paused' ? 'badge-sub' : 'badge-lvl')}`;
    statusBadge.innerText = camp.status === 'active' ? '🟢 Em Andamento' : (camp.status === 'paused' ? '🟡 Pausada' : '🏁 Concluída');
  }

  const campPlayers = (camp.playerIds || []).map(id => PLAYERS.find(p => p.id === id)).filter(p => p);
  if (heroesCountBadge) heroesCountBadge.innerText = `${campPlayers.length} Heróis`;
  if (sessionsCountBadge) sessionsCountBadge.innerText = `${(camp.sessions || []).length} Sessões`;

  // 0. Renderiza Dashboard de Visão Geral (DM3)
  renderCampaignDashboard(camp, campPlayers);

  // 1. Renderiza Heróis Vinculados
  renderCampaignHeroes(camp, campPlayers);

  // 2. Renderiza Diário de Sessões
  renderCampaignSessions(camp);

  // 3. Renderiza Inventário & Tesouro Coletivo (Party Stash)
  renderCampaignPartyStash(camp, campPlayers);
}

// --- DASHBOARD DE VISÃO GERAL DA CAMPANHA (DM3) ---

function renderCampaignDashboard(camp, campPlayers) {
  const container = document.getElementById('campaign-dashboard-panel');
  if (!container) return;

  const totalXp = campPlayers.reduce((acc, p) => acc + (p.xp || 0), 0);
  const avgLevel = campPlayers.length > 0 ? (campPlayers.reduce((acc, p) => acc + (p.level || 1), 0) / campPlayers.length).toFixed(1) : '1.0';
  const totalGold = camp.partyStash?.gold || 0;
  const totalItems = camp.partyStash?.items ? camp.partyStash.items.reduce((acc, it) => acc + (it.qty || 1), 0) : 0;
  const sessionsCount = (camp.sessions || []).length;
  const totalChronicleXp = (camp.sessions || []).reduce((acc, s) => acc + (s.xpAwarded || 0), 0);

  // Marcos de Nível 5E
  const XP_LEVELS = [0, 300, 900, 2700, 6500, 14000, 23000, 34000, 48000, 64000, 85000, 100000, 120000, 140000, 165000, 195000, 225000, 265000, 305000, 355000];
  const nextLvlNum = Math.min(20, Math.floor(parseFloat(avgLevel)) + 1);
  const nextXpGoal = XP_LEVELS[nextLvlNum - 1] || 355000;
  const currentAvgXp = campPlayers.length > 0 ? Math.round(totalXp / campPlayers.length) : 0;
  const xpProgPct = Math.min(100, Math.round((currentAvgXp / (nextXpGoal || 1)) * 100));

  container.innerHTML = `
    <div class="camp-dash-grid">
      <div class="camp-dash-card">
        <div class="camp-dash-icon">👥</div>
        <div>
          <div class="camp-dash-label">Heróis no Grupo</div>
          <div class="camp-dash-val">${campPlayers.length} <small style="font-size: 11px; font-weight: normal; color: var(--text-dim);">ativos</small></div>
          <div style="font-size: 10px; color: var(--text-muted); margin-top: 2px;">Nível Médio: <b>${avgLevel}</b></div>
        </div>
      </div>

      <div class="camp-dash-card">
        <div class="camp-dash-icon">⭐</div>
        <div>
          <div class="camp-dash-label">XP Total do Grupo</div>
          <div class="camp-dash-val" style="color: var(--primary);">${totalXp.toLocaleString()} <small style="font-size: 11px; font-weight: normal; color: var(--text-dim);">XP</small></div>
          <div style="font-size: 10px; color: var(--accent-blue); margin-top: 2px;">Média: ${currentAvgXp} / ${nextXpGoal} (Nv ${nextLvlNum})</div>
          <div class="hp-bar-bg" style="height: 4px; margin-top: 4px; width: 100%;">
            <div class="hp-bar-fill" style="width: ${xpProgPct}%; background-color: var(--primary);"></div>
          </div>
        </div>
      </div>

      <div class="camp-dash-card">
        <div class="camp-dash-icon">💰</div>
        <div>
          <div class="camp-dash-label">Tesouro Coletivo</div>
          <div class="camp-dash-val" style="color: var(--primary-light);">${totalGold} <small style="font-size: 11px; font-weight: normal; color: var(--text-dim);">PO</small></div>
          <div style="font-size: 10px; color: var(--text-muted); margin-top: 2px;">${totalItems} itens no baú</div>
        </div>
      </div>

      <div class="camp-dash-card">
        <div class="camp-dash-icon">📖</div>
        <div>
          <div class="camp-dash-label">Sessões Jogadas</div>
          <div class="camp-dash-val">${sessionsCount} <small style="font-size: 11px; font-weight: normal; color: var(--text-dim);">encontros</small></div>
          <div style="font-size: 10px; color: var(--accent-green); margin-top: 2px;">+${totalChronicleXp} XP concedidos</div>
        </div>
      </div>
    </div>
  `;
}

function renderCampaignHeroes(camp, campPlayers) {
  const container = document.getElementById('camp-heroes-grid');
  if (!container) return;

  if (campPlayers.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 20px; background: rgba(0,0,0,0.2); border: 1px dashed var(--border-color); border-radius: 8px; color: var(--text-muted); font-size: 12px;">
        Nenhum personagem vinculado a esta campanha ainda.
        <br><button class="btn-action" style="margin-top: 8px; padding: 5px 12px; font-size: 11px;" onclick="openCampaignHeroesModal()">➕ Vincular Fichas de Alunos</button>
      </div>
    `;
    return;
  }

  container.innerHTML = campPlayers.map(p => {
    const hpPct = Math.max(0, Math.min(100, Math.round((p.hp / p.maxHp) * 100)));
    const hpColor = hpPct > 50 ? 'var(--accent-green)' : (hpPct > 25 ? '#eab308' : 'var(--accent-red)');
    return `
      <div class="hero-chip-card" onclick="openPlayerModal('${p.id}')" title="Clique para editar a ficha completa">
        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
          <div>
            <div style="font-weight:700; color:#fff; font-size:13px;">${p.name}</div>
            <div style="font-size:11px; color:var(--text-muted); margin-top:2px;">👤 ${p.student} • <span style="color:var(--primary-light);">${p.className}</span></div>
          </div>
          <span class="badge badge-src" style="font-size:9px;">Nv ${p.level}</span>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px; font-size:11px;">
          <span>CA: <b>${p.ac}</b></span>
          <span>PV: <b style="color:${hpColor};">${p.hp}/${p.maxHp}</b></span>
          <span>PO: <b>${p.gold || 0}</b></span>
        </div>
      </div>
    `;
  }).join('');
}

function renderCampaignSessions(camp) {
  const container = document.getElementById('camp-sessions-timeline');
  if (!container) return;

  const sessions = (camp.sessions || []).slice().sort((a, b) => b.number - a.number);

  if (sessions.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 30px; background: rgba(0,0,0,0.2); border: 1px dashed var(--border-color); border-radius: 8px; color: var(--text-muted); font-size: 12px;">
        📖 Nenhuma crônica de sessão registrada nesta campanha.
        <br><button class="btn-action" style="margin-top: 10px; padding: 6px 14px; font-size: 12px;" onclick="openSessionModal()">➕ Escrever Diário da Sessão 1</button>
      </div>
    `;
    return;
  }

  container.innerHTML = sessions.map(s => `
    <div class="session-log-card">
      <div class="session-log-header">
        <div>
          <div style="display:flex; align-items:center; gap:8px;">
            <span class="session-number-badge">Sessão ${s.number}</span>
            <span style="font-size:15px; font-weight:800; color:#fff; font-family:var(--font-title);">${s.title}</span>
          </div>
          <div style="font-size:11px; color:var(--text-muted); margin-top:3px;">
            📅 ${s.date || 'Data não informada'} • 🗺️ ${s.location || 'Local desconhecido'} • ⭐ <b>+${s.xpAwarded || 0} XP</b> por jogador
          </div>
        </div>
        <div style="display:flex; gap:6px;">
          <button class="btn-secondary" style="padding:4px 8px; font-size:11px;" onclick="openSessionModal('${s.id}')" title="Editar Registro da Sessão">✏️</button>
          <button class="btn-secondary" style="padding:4px 8px; font-size:11px; color:#f87171;" onclick="deleteSessionLog('${s.id}')" title="Excluir Registro">🗑️</button>
        </div>
      </div>

      <div class="session-notes-body">
        ${(s.notes || '').replace(/\n/g, '<br>')}
      </div>

      ${s.keyNpcs ? `
        <div style="margin-top:8px; font-size:11px; color:var(--primary-light);">
          👥 <b>NPCs e Encontros:</b> <span style="color:#cbd5e1;">${s.keyNpcs}</span>
        </div>
      ` : ''}
    </div>
  `).join('');
}

function renderCampaignPartyStash(camp, campPlayers) {
  const goldDisplay = document.getElementById('stash-gold-amount');
  const itemsTbody = document.getElementById('stash-items-tbody');
  const historyList = document.getElementById('stash-history-list');

  const stash = camp.partyStash || { gold: 0, items: [], history: [] };

  if (goldDisplay) goldDisplay.innerText = `${stash.gold || 0} PO`;

  if (itemsTbody) {
    if (!stash.items || stash.items.length === 0) {
      itemsTbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:15px; color:var(--text-muted);">O baú coletivo está vazio. Adicione itens encontrados na aventura!</td></tr>`;
    } else {
      itemsTbody.innerHTML = stash.items.map(it => `
        <tr>
          <td><b style="color:#fff;">${it.name}</b></td>
          <td style="text-align:center;"><span class="badge badge-lvl">${it.qty || 1}</span></td>
          <td><span style="font-size:11px; color:var(--text-muted);">${it.category || 'Geral'}</span></td>
          <td><span class="carrier-badge">🎒 ${it.carrier || 'Baú do Grupo'}</span></td>
          <td style="text-align:right;">
            <button class="btn-secondary" style="padding:3px 6px; font-size:10px;" onclick="openPartyItemModal('${it.id}')" title="Editar item">✏️</button>
            <button class="btn-secondary" style="padding:3px 6px; font-size:10px; color:#f87171;" onclick="deletePartyItem('${it.id}')" title="Remover item">🗑️</button>
          </td>
        </tr>
      `).join('');
    }
  }

  if (historyList) {
    const hist = (stash.history || []).slice(-6).reverse();
    if (hist.length === 0) {
      historyList.innerHTML = `<div style="color:var(--text-muted); font-size:11px; text-align:center;">Nenhuma movimentação registrada.</div>`;
    } else {
      historyList.innerHTML = hist.map(h => `
        <div class="stash-history-item ${h.type || 'gold_in'}">
          <span>${h.text}</span>
          <span style="font-size:10px; color:var(--text-dim);">${h.date || ''}</span>
        </div>
      `).join('');
    }
  }
}

// --- OPERAÇÕES DE CAMPANHA ---
function handleCampaignSelect(campaignId) {
  CAMPAIGNS_STATE.activeCampaignId = campaignId;
  saveCampaignsState();
  renderCampaigns();
  const camp = getActiveCampaign();
  if (camp && camp.name && typeof setStoredFirebaseRoom === 'function') {
    const roomCode = camp.name.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9_-]/g, '_');
    if (roomCode) setStoredFirebaseRoom(roomCode);
  }
}

function copyLobbyShareLink() {
  const href = (typeof window !== 'undefined' && window.location && window.location.href) ? window.location.href : 'https://uranio8.github.io/planilha-rpg/';
  const base = href.split('?')[0].split('#')[0];
  const room = (typeof getStoredFirebaseRoom === 'function') ? getStoredFirebaseRoom() : 'turma_principal';
  const lobbyUrl = `${base}?room=${encodeURIComponent(room)}&lobby=true`;

  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(lobbyUrl);
    } else {
      prompt('Copie o link do Lobby da Turma:', lobbyUrl);
      return;
    }
    alert(`📋 Link do Lobby copiado com sucesso!\n\n${lobbyUrl}\n\nEnvie este link para os alunos no WhatsApp ou Discord.`);
  } catch (e) {
    prompt('Copie o link do Lobby da Turma:', lobbyUrl);
  }
}

function openCampaignModal(campaignId = null) {
  const modal = document.getElementById('modal-campaign-form');
  if (!modal) return;

  const isEdit = !!campaignId;
  const camp = isEdit ? CAMPAIGNS_STATE.campaigns.find(c => c.id === campaignId) : null;

  document.getElementById('camp-form-modal-title').innerText = isEdit ? '✏️ Editar Campanha' : '➕ Nova Campanha de RPG';
  document.getElementById('inp-camp-id').value = camp ? camp.id : '';
  document.getElementById('inp-camp-name').value = camp ? camp.name : '';
  document.getElementById('inp-camp-desc').value = camp ? camp.desc : '';
  document.getElementById('inp-camp-status').value = camp ? camp.status : 'active';

  modal.classList.add('open');
}

function closeCampaignModal() {
  const modal = document.getElementById('modal-campaign-form');
  if (modal) modal.classList.remove('open');
}

function saveCampaignForm() {
  const id = document.getElementById('inp-camp-id').value;
  const name = document.getElementById('inp-camp-name').value.trim();
  const desc = document.getElementById('inp-camp-desc').value.trim();
  const status = document.getElementById('inp-camp-status').value;

  if (!name) {
    alert('Por favor, informe o nome da campanha.');
    return;
  }

  if (id) {
    // Editar
    const camp = CAMPAIGNS_STATE.campaigns.find(c => c.id === id);
    if (camp) {
      camp.name = name;
      camp.desc = desc;
      camp.status = status;
    }
  } else {
    // Criar nova
    const newId = 'camp_' + Date.now();
    const newCamp = {
      id: newId,
      name,
      desc,
      createdDate: new Date().toISOString().split('T')[0],
      status,
      playerIds: PLAYERS.map(p => p.id), // associa os existentes por padrão
      partyStash: { gold: 0, items: [], history: [] },
      sessions: []
    };
    CAMPAIGNS_STATE.campaigns.push(newCamp);
    CAMPAIGNS_STATE.activeCampaignId = newId;
  }

  saveCampaignsState();
  closeCampaignModal();
  renderCampaigns();
  if (typeof addLog === 'function') addLog(`📜 <b>Campanha:</b> "${name}" salva com sucesso.`);
}

function deleteCurrentCampaign() {
  const camp = getActiveCampaign();
  if (!camp) return;
  if (CAMPAIGNS_STATE.campaigns.length <= 1) {
    alert('Você deve manter pelo menos uma campanha ativa.');
    return;
  }
  if (!confirm(`Tem certeza que deseja excluir a campanha "${camp.name}"? Todos os diários e o baú do grupo desta campanha serão removidos.`)) return;

  CAMPAIGNS_STATE.campaigns = CAMPAIGNS_STATE.campaigns.filter(c => c.id !== camp.id);
  CAMPAIGNS_STATE.activeCampaignId = CAMPAIGNS_STATE.campaigns[0].id;

  saveCampaignsState();
  renderCampaigns();
  if (typeof addLog === 'function') addLog(`🗑️ <b>Campanha Excluída:</b> "${camp.name}".`);
}

// --- HERÓIS DA CAMPANHA ---
function openCampaignHeroesModal() {
  const camp = getActiveCampaign();
  if (!camp) return;

  const modal = document.getElementById('modal-campaign-heroes');
  const container = document.getElementById('campaign-heroes-picker-list');
  if (!modal || !container) return;

  const currentIds = new Set(camp.playerIds || []);

  container.innerHTML = PLAYERS.map(p => {
    const isChecked = currentIds.has(p.id);
    return `
      <label class="hero-picker-item ${isChecked ? 'selected' : ''}">
        <input type="checkbox" value="${p.id}" ${isChecked ? 'checked' : ''} onchange="this.parentElement.classList.toggle('selected', this.checked)">
        <div style="flex:1;">
          <div style="font-weight:700; color:#fff;">${p.name} <span class="badge badge-src" style="font-size:9px;">Nv ${p.level}</span></div>
          <div style="font-size:11px; color:var(--text-muted);">👤 ${p.student} • ${p.race} • ${p.className}</div>
        </div>
      </label>
    `;
  }).join('');

  modal.classList.add('open');
}

function closeCampaignHeroesModal() {
  const modal = document.getElementById('modal-campaign-heroes');
  if (modal) modal.classList.remove('open');
}

function saveCampaignHeroesSelection() {
  const camp = getActiveCampaign();
  if (!camp) return;

  const container = document.getElementById('campaign-heroes-picker-list');
  if (!container) return;

  const selectedIds = [];
  container.querySelectorAll('input[type="checkbox"]:checked').forEach(cb => {
    selectedIds.push(cb.value);
  });

  camp.playerIds = selectedIds;
  saveCampaignsState();
  closeCampaignHeroesModal();
  renderCampaigns();
  if (typeof addLog === 'function') addLog(`👥 <b>Heróis Atualizados:</b> ${selectedIds.length} heróis vinculados à campanha "${camp.name}".`);
}

function addAllCampaignHeroesToCombat() {
  const camp = getActiveCampaign();
  if (!camp || !camp.playerIds || camp.playerIds.length === 0) {
    alert('Nenhum herói vinculado a esta campanha para adicionar ao combate.');
    return;
  }

  let added = 0;
  camp.playerIds.forEach(pId => {
    const p = PLAYERS.find(x => x.id === pId);
    if (p) {
      const existing = state.combatants.find(c => c.playerId === p.id || c.name === `${p.name} (${p.student})`);
      if (!existing) {
        const dexMod = Math.floor((p.dex - 10) / 2);
        const autoInit = Math.floor(Math.random() * 20) + 1 + dexMod;
        state.combatants.push({
          id: 'c_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
          playerId: p.id,
          name: `${p.name} (${p.student})`,
          init: autoInit,
          ac: p.ac,
          hp: p.hp !== undefined ? p.hp : p.maxHp,
          maxHp: p.maxHp,
          type: 'player',
          conditions: [],
          actions: p.attacks
        });
        added++;
      }
    }
  });

  state.combatants.sort((a, b) => b.init - a.init);
  if (typeof renderCombat === 'function') renderCombat();
  if (typeof saveToLocalStorage === 'function') saveToLocalStorage();
  switchTab('combat');
  if (typeof addLog === 'function') addLog(`⚔️ <b>${added} heróis da campanha "${camp.name}"</b> adicionados ao combate.`);
}

// --- DIÁRIO DE SESSÕES ---
let currentEditSessionId = null;

function openSessionModal(sessionId = null) {
  const camp = getActiveCampaign();
  if (!camp) return;

  currentEditSessionId = sessionId;
  const modal = document.getElementById('modal-campaign-session');
  if (!modal) return;

  const isEdit = !!sessionId;
  const sess = isEdit ? (camp.sessions || []).find(s => s.id === sessionId) : null;
  const nextNum = (camp.sessions && camp.sessions.length > 0) ? Math.max(...camp.sessions.map(s => s.number || 1)) + 1 : 1;

  document.getElementById('session-modal-title').innerText = isEdit ? `✏️ Editar Sessão ${sess.number}` : `📖 Registrar Sessão ${nextNum}`;
  document.getElementById('inp-sess-num').value = sess ? sess.number : nextNum;
  document.getElementById('inp-sess-date').value = sess ? sess.date : new Date().toISOString().split('T')[0];
  document.getElementById('inp-sess-title').value = sess ? sess.title : '';
  document.getElementById('inp-sess-loc').value = sess ? (sess.location || '') : '';
  document.getElementById('inp-sess-xp').value = sess ? (sess.xpAwarded || 0) : 100;
  document.getElementById('inp-sess-npcs').value = sess ? (sess.keyNpcs || '') : '';
  document.getElementById('inp-sess-notes').value = sess ? sess.notes : '';

  modal.classList.add('open');
}

function closeSessionModal() {
  const modal = document.getElementById('modal-campaign-session');
  if (modal) modal.classList.remove('open');
}

function saveSessionLog() {
  const camp = getActiveCampaign();
  if (!camp) return;

  const num = parseInt(document.getElementById('inp-sess-num').value) || 1;
  const date = document.getElementById('inp-sess-date').value;
  const title = document.getElementById('inp-sess-title').value.trim();
  const location = document.getElementById('inp-sess-loc').value.trim();
  const xp = parseInt(document.getElementById('inp-sess-xp').value) || 0;
  const npcs = document.getElementById('inp-sess-npcs').value.trim();
  const notes = document.getElementById('inp-sess-notes').value.trim();

  if (!title) {
    alert('Por favor, informe o título da sessão.');
    return;
  }

  camp.sessions = camp.sessions || [];

  if (currentEditSessionId) {
    const sess = camp.sessions.find(s => s.id === currentEditSessionId);
    if (sess) {
      sess.number = num;
      sess.date = date;
      sess.title = title;
      sess.location = location;
      sess.xpAwarded = xp;
      sess.keyNpcs = npcs;
      sess.notes = notes;
    }
  } else {
    camp.sessions.push({
      id: 'sess_' + Date.now(),
      number: num,
      date,
      title,
      location,
      xpAwarded: xp,
      keyNpcs: npcs,
      notes
    });
  }

  saveCampaignsState();
  closeSessionModal();
  renderCampaigns();
  if (typeof addLog === 'function') addLog(`📖 <b>Diário de Sessão:</b> Sessão ${num} ("${title}") registrada com sucesso.`);
}

function deleteSessionLog(sessionId) {
  const camp = getActiveCampaign();
  if (!camp || !camp.sessions) return;
  const sess = camp.sessions.find(s => s.id === sessionId);
  if (!sess) return;
  if (!confirm(`Excluir o registro da Sessão ${sess.number} ("${sess.title}")?`)) return;

  camp.sessions = camp.sessions.filter(s => s.id !== sessionId);
  saveCampaignsState();
  renderCampaigns();
  if (typeof addLog === 'function') addLog(`🗑️ <b>Sessão Excluída:</b> Sessão ${sess.number}.`);
}

// --- BAÚ DO GRUPO & TESOURO (PARTY STASH) ---
function promptAdjustPartyGold(type) {
  const camp = getActiveCampaign();
  if (!camp) return;
  camp.partyStash = camp.partyStash || { gold: 0, items: [], history: [] };

  const promptMsg = type === 'add' ? 'Quantas Peças de Ouro (PO) deseja ADICIONAR ao Baú do Grupo?' : 'Quantas Peças de Ouro (PO) deseja RETIRAR do Baú do Grupo?';
  const valStr = prompt(promptMsg, '50');
  if (valStr === null) return;
  const val = parseInt(valStr);
  if (isNaN(val) || val <= 0) return;

  const reason = prompt('Motivo / Origem da transação (ex: Recompensa da missão, Compra de suprimentos):', type === 'add' ? 'Recompensa de missão' : 'Gastos em suprimentos') || 'Transação';

  if (type === 'add') {
    camp.partyStash.gold = (camp.partyStash.gold || 0) + val;
    camp.partyStash.history.push({
      date: new Date().toISOString().split('T')[0],
      text: `+${val} PO (${reason})`,
      type: 'gold_in'
    });
  } else {
    camp.partyStash.gold = Math.max(0, (camp.partyStash.gold || 0) - val);
    camp.partyStash.history.push({
      date: new Date().toISOString().split('T')[0],
      text: `-${val} PO (${reason})`,
      type: 'gold_out'
    });
  }

  saveCampaignsState();
  if (typeof saveToLocalStorage === 'function') saveToLocalStorage();
  renderCampaigns();
  renderPartyStashViewer();
  if (typeof addLog === 'function') addLog(`💰 <b>Baú do Grupo:</b> ${type === 'add' ? '+' : '-'}${val} PO (${reason}). Saldo: ${camp.partyStash.gold} PO.`);
}

function splitPartyGold() {
  const camp = getActiveCampaign();
  if (!camp) return;
  const campPlayers = (camp.playerIds || []).map(id => PLAYERS.find(p => p.id === id)).filter(p => p);

  if (campPlayers.length === 0) {
    alert('Nenhum herói vinculado a esta campanha para receber a divisão de ouro.');
    return;
  }

  const currentGold = camp.partyStash?.gold || 0;
  if (currentGold <= 0) {
    alert('O baú do grupo não possui ouro para dividir.');
    return;
  }

  const each = Math.floor(currentGold / campPlayers.length);
  const remainder = currentGold % campPlayers.length;

  if (!confirm(`Dividir ${currentGold} PO igualmente entre os ${campPlayers.length} heróis da campanha?\n• Cada um receberá: ${each} PO\n• Sobra no baú: ${remainder} PO`)) return;

  campPlayers.forEach(p => {
    p.gold = (p.gold || 0) + each;
  });

  camp.partyStash.gold = remainder;
  camp.partyStash.history.push({
    date: new Date().toISOString().split('T')[0],
    text: `Divisão de ${currentGold} PO (${each} PO para cada um dos ${campPlayers.length} heróis)`,
    type: 'gold_out'
  });

  saveCampaignsState();
  if (typeof saveToLocalStorage === 'function') saveToLocalStorage();
  renderCampaigns();
  renderPartyStashViewer();
  if (typeof renderPlayers === 'function') renderPlayers();
  if (typeof addLog === 'function') addLog(`💰 <b>Divisão de Tesouro:</b> ${each} PO distribuídos para cada um dos ${campPlayers.length} heróis. Sobra: ${remainder} PO.`);
}

// --- ITENS DO BAÚ ---
let currentEditItemId = null;

function openPartyItemModal(itemId = null) {
  const camp = getActiveCampaign();
  if (!camp) return;

  currentEditItemId = itemId;
  const modal = document.getElementById('modal-party-item');
  if (!modal) return;

  const isEdit = !!itemId;
  const it = isEdit ? (camp.partyStash?.items || []).find(x => x.id === itemId) : null;
  const campPlayers = (camp.playerIds || []).map(id => PLAYERS.find(p => p.id === id)).filter(p => p);

  document.getElementById('party-item-modal-title').innerText = isEdit ? '✏️ Editar Item do Grupo' : '➕ Adicionar Item ao Baú do Grupo';
  document.getElementById('inp-pitem-name').value = it ? it.name : '';
  document.getElementById('inp-pitem-qty').value = it ? it.qty : 1;
  document.getElementById('inp-pitem-cat').value = it ? (it.category || 'Equipamento de Aventura') : 'Equipamento de Aventura';
  document.getElementById('inp-pitem-desc').value = it ? (it.desc || '') : '';

  const selCarrier = document.getElementById('inp-pitem-carrier');
  if (selCarrier) {
    selCarrier.innerHTML = `
      <option value="Baú do Grupo" ${(!it || it.carrier === 'Baú do Grupo') ? 'selected' : ''}>Baú do Grupo</option>
      <option value="Mochila Coletiva" ${(it && it.carrier === 'Mochila Coletiva') ? 'selected' : ''}>Mochila Coletiva / Carroça</option>
      ${campPlayers.map(p => `
        <option value="${p.name}" ${(it && it.carrier === p.name) ? 'selected' : ''}>${p.name} (${p.student})</option>
      `).join('')}
    `;
  }

  modal.classList.add('open');
}

function closePartyItemModal() {
  const modal = document.getElementById('modal-party-item');
  if (modal) modal.classList.remove('open');
}

function savePartyItem() {
  const camp = getActiveCampaign();
  if (!camp) return;
  camp.partyStash = camp.partyStash || { gold: 0, items: [], history: [] };
  camp.partyStash.items = camp.partyStash.items || [];

  const name = document.getElementById('inp-pitem-name').value.trim();
  const qty = parseInt(document.getElementById('inp-pitem-qty').value) || 1;
  const category = document.getElementById('inp-pitem-cat').value;
  const carrier = document.getElementById('inp-pitem-carrier').value;
  const desc = document.getElementById('inp-pitem-desc').value.trim();

  if (!name) {
    alert('Por favor, informe o nome do item.');
    return;
  }

  if (currentEditItemId) {
    const it = camp.partyStash.items.find(x => x.id === currentEditItemId);
    if (it) {
      it.name = name;
      it.qty = qty;
      it.category = category;
      it.carrier = carrier;
      it.desc = desc;
    }
  } else {
    camp.partyStash.items.push({
      id: 'it_' + Date.now(),
      name,
      qty,
      category,
      carrier,
      desc
    });
    camp.partyStash.history.push({
      date: new Date().toISOString().split('T')[0],
      text: `+${qty}x ${name} adicionado (${carrier})`,
      type: 'item_in'
    });
  }

  saveCampaignsState();
  if (typeof saveToLocalStorage === 'function') saveToLocalStorage();
  closePartyItemModal();
  renderCampaigns();
  renderPartyStashViewer();
  if (typeof addLog === 'function') addLog(`🎒 <b>Baú do Grupo:</b> Item "${name}" (${qty}x) salvo com sucesso.`);
}

function deletePartyItem(itemId) {
  const camp = getActiveCampaign();
  if (!camp || !camp.partyStash?.items) return;
  const it = camp.partyStash.items.find(x => x.id === itemId);
  if (!it) return;

  if (!confirm(`Remover "${it.name}" (${it.qty}x) do inventário do grupo?`)) return;

  camp.partyStash.items = camp.partyStash.items.filter(x => x.id !== itemId);
  camp.partyStash.history.push({
    date: new Date().toISOString().split('T')[0],
    text: `-${it.qty}x ${it.name} removido do grupo`,
    type: 'item_out'
  });

  saveCampaignsState();
  if (typeof saveToLocalStorage === 'function') saveToLocalStorage();
  renderCampaigns();
  renderPartyStashViewer();
  if (typeof addLog === 'function') addLog(`🗑️ <b>Baú do Grupo:</b> "${it.name}" removido.`);
}

// --- VISUALIZADOR MODAL DO BAÚ DO GRUPO (PARA JOGADORES E MESTRE) ---
function openPartyStashModal() {
  const modal = document.getElementById('modal-party-stash-view');
  if (!modal) return;
  renderPartyStashViewer();
  modal.classList.add('open');
}

function closePartyStashModal() {
  const modal = document.getElementById('modal-party-stash-view');
  if (modal) modal.classList.remove('open');
}

function renderPartyStashViewer() {
  const modal = document.getElementById('modal-party-stash-view');
  if (!modal) return;

  const camp = getActiveCampaign();
  if (!camp) return;

  const stash = camp.partyStash || { gold: 0, items: [], history: [] };

  const goldEl = document.getElementById('party-stash-modal-gold');
  if (goldEl) goldEl.innerText = `${stash.gold || 0} PO`;

  const tbody = document.getElementById('party-stash-modal-tbody');
  if (tbody) {
    if (!stash.items || stash.items.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:20px; color:var(--text-muted);">O baú coletivo está vazio.</td></tr>`;
    } else {
      tbody.innerHTML = stash.items.map(it => `
        <tr>
          <td>
            <b style="color:#fff;">${it.name}</b>
            ${it.desc ? `<div style="font-size:10px; color:var(--text-dim);">${it.desc}</div>` : ''}
          </td>
          <td style="text-align:center;"><span class="badge badge-lvl">${it.qty || 1}</span></td>
          <td><span style="font-size:11px; color:var(--text-muted);">${it.category || 'Geral'}</span></td>
          <td><span class="carrier-badge">🎒 ${it.carrier || 'Baú do Grupo'}</span></td>
          <td style="text-align:right;">
            <button class="btn-secondary" style="padding:2px 6px; font-size:10px;" onclick="takePartyItemToPlayer('${it.id}')" title="Pegar 1x para minha mochila">📥 Pegar</button>
            <button class="btn-secondary" style="padding:2px 6px; font-size:10px;" onclick="openPartyItemModal('${it.id}')" title="Editar item">✏️</button>
            <button class="btn-secondary" style="padding:2px 6px; font-size:10px; color:#f87171;" onclick="deletePartyItem('${it.id}')" title="Remover item">🗑️</button>
          </td>
        </tr>
      `).join('');
    }
  }

  const histEl = document.getElementById('party-stash-modal-history');
  if (histEl) {
    const hist = (stash.history || []).slice(-6).reverse();
    if (hist.length === 0) {
      histEl.innerHTML = `<div style="color:var(--text-muted); font-size:11px; text-align:center;">Nenhuma movimentação registrada.</div>`;
    } else {
      histEl.innerHTML = hist.map(h => `
        <div class="stash-history-item ${h.type || 'gold_in'}" style="font-size:10.5px; padding:3px 6px;">
          <span>${h.text}</span>
          <span style="font-size:9px; color:var(--text-dim);">${h.date || ''}</span>
        </div>
      `).join('');
    }
  }
}

function takePartyItemToPlayer(itemId) {
  const camp = getActiveCampaign();
  if (!camp || !camp.partyStash?.items) return;
  const it = camp.partyStash.items.find(x => x.id === itemId);
  if (!it) return;

  const targetPlayer = (activePortalPlayerId && PLAYERS.find(p => p.id === activePortalPlayerId)) || PLAYERS[0];
  if (!targetPlayer) {
    alert('Nenhum herói disponível para receber o item.');
    return;
  }

  targetPlayer.inventory = targetPlayer.inventory || [];
  const existing = targetPlayer.inventory.find(x => x.name.toLowerCase() === it.name.toLowerCase());
  if (existing) {
    existing.qty = (parseInt(existing.qty) || 0) + 1;
  } else {
    targetPlayer.inventory.push({
      name: it.name,
      qty: 1,
      equipped: false,
      weight: 0.5
    });
  }

  if (it.qty > 1) {
    it.qty -= 1;
  } else {
    camp.partyStash.items = camp.partyStash.items.filter(x => x.id !== itemId);
  }

  camp.partyStash.history.push({
    date: new Date().toISOString().split('T')[0],
    text: `1x ${it.name} transferido para a mochila de ${targetPlayer.name}`,
    type: 'item_out'
  });

  saveCampaignsState();
  if (typeof saveToLocalStorage === 'function') saveToLocalStorage();
  renderPartyStashViewer();
  renderCampaignPartyStash(camp, (camp.playerIds || []).map(id => PLAYERS.find(p => p.id === id)).filter(p => p));
  if (typeof renderPlayers === 'function') renderPlayers();
  if (typeof addLog === 'function') addLog(`🎒 <b>Baú do Grupo:</b> 1x "${it.name}" transferido para a mochila de <b>${targetPlayer.name}</b>.`);
}

// --- NOTAS RÁPIDAS DO MESTRE (DM2 - Ctrl+N) ---

let isDMNotesOpen = false;

function toggleDMNotesDrawer(forceState) {
  const drawer = document.getElementById('dm-quick-notes-drawer');
  if (!drawer) return;

  if (typeof forceState === 'boolean') {
    isDMNotesOpen = forceState;
  } else {
    isDMNotesOpen = !isDMNotesOpen;
  }

  if (isDMNotesOpen) {
    drawer.classList.add('open');
    renderDMNotes();
    const textarea = document.getElementById('inp-dm-quick-notes');
    if (textarea) textarea.focus();
  } else {
    drawer.classList.remove('open');
  }
}

function renderDMNotes() {
  const camp = getActiveCampaign();
  if (!camp) return;

  const textarea = document.getElementById('inp-dm-quick-notes');
  const titleEl = document.getElementById('dm-notes-camp-title');
  const countEl = document.getElementById('dm-notes-char-count');

  if (titleEl) titleEl.innerText = `Notas: ${camp.name}`;
  if (textarea) {
    textarea.value = camp.dmNotes || '';
    if (countEl) countEl.innerText = `${(camp.dmNotes || '').length} caracteres`;
  }
}

let dmNotesDebounceTimer = null;
function handleDMNotesInput() {
  const textarea = document.getElementById('inp-dm-quick-notes');
  const countEl = document.getElementById('dm-notes-char-count');
  const statusEl = document.getElementById('dm-notes-save-status');
  if (!textarea) return;

  if (countEl) countEl.innerText = `${textarea.value.length} caracteres`;
  if (statusEl) statusEl.innerText = 'Salvando...';

  clearTimeout(dmNotesDebounceTimer);
  dmNotesDebounceTimer = setTimeout(() => {
    saveDMNotes();
  }, 400);
}

function saveDMNotes() {
  const camp = getActiveCampaign();
  if (!camp) return;

  const textarea = document.getElementById('inp-dm-quick-notes');
  const statusEl = document.getElementById('dm-notes-save-status');
  if (textarea) {
    camp.dmNotes = textarea.value;
    saveCampaignsState();
    if (statusEl) {
      statusEl.innerText = '💾 Salvo';
      setTimeout(() => { if (statusEl) statusEl.innerText = ''; }, 1500);
    }
  }
}

// Registra atalho de teclado global Ctrl+N / Cmd+N para Notas do Mestre
if (typeof document !== 'undefined') {
  document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
      // Não intercepta se o usuário estiver no Portal do Jogador
      if (document.body && document.body.classList && document.body.classList.contains('mode-player-portal')) {
        return;
      }
      e.preventDefault();
      toggleDMNotesDrawer();
    }
  });
}

// --- DM5: EXPORTAÇÃO E IMPRESSÃO DE CRÔNICAS DA CAMPANHA (A4 / PDF) ---
function printCampaignChronicles() {
  const camp = getActiveCampaign();
  if (!camp) return;

  const campPlayers = (camp.playerIds || []).map(id => PLAYERS.find(p => p.id === id)).filter(p => p);
  const sessions = (camp.sessions || []).slice().sort((a, b) => (a.number || 0) - (b.number || 0));
  const stash = camp.partyStash || { gold: 0, items: [] };

  const modal = document.getElementById('modal-print-chronicles');
  const preview = document.getElementById('chronicles-print-content');
  if (!modal || !preview) {
    if (typeof window !== 'undefined') window.print();
    return;
  }

  let sessionsHtml = '';
  if (sessions.length === 0) {
    sessionsHtml = `<p style="color: #64748b; font-style: italic; text-align: center; padding: 20px;">Nenhum diário de sessão registrado para esta campanha.</p>`;
  } else {
    sessionsHtml = sessions.map(s => `
      <div class="print-session-block" style="margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #cbd5e1; page-break-inside: avoid;">
        <div style="display: flex; justify-content: space-between; align-items: baseline; border-bottom: 2px solid #3b82f6; padding-bottom: 4px; margin-bottom: 8px;">
          <h3 style="margin: 0; color: #1e293b; font-size: 16px;">Sessão ${s.number || 1}: ${s.title || 'Sem título'}</h3>
          <span style="font-size: 12px; color: #64748b; font-weight: bold;">📅 ${s.date || 'Data não informada'}</span>
        </div>
        <div style="display: flex; gap: 16px; font-size: 12px; color: #475569; margin-bottom: 8px; background: #f1f5f9; padding: 6px 10px; border-radius: 4px; flex-wrap: wrap;">
          <span>📍 <b>Local:</b> ${s.location || 'Não informado'}</span>
          <span>⭐ <b>XP Concedido:</b> ${s.xpAwarded || 0} XP</span>
          <span>👤 <b>NPCs / Inimigos:</b> ${s.keyNpcs || 'Nenhum'}</span>
        </div>
        <div style="font-size: 13px; color: #1e293b; line-height: 1.6; white-space: pre-wrap;">${s.notes || 'Sem anotações registradas.'}</div>
      </div>
    `).join('');
  }

  const heroesHtml = campPlayers.length > 0 ? campPlayers.map(p => `
    <div style="border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px 12px; background: #f8fafc; page-break-inside: avoid;">
      <b style="color: #0f172a; font-size: 13px;">${p.name}</b> <span style="font-size: 11px; color: #64748b;">(Nv ${p.level} ${p.race} ${p.className})</span>
      <div style="font-size: 11px; color: #475569; margin-top: 2px;">
        👤 Jogador: <b>${p.student}</b> | CA: <b>${p.ac}</b> | PV: <b>${p.hp}/${p.maxHp}</b> | Ouro: <b>${p.gold || 0} PO</b>
      </div>
    </div>
  `).join('') : '<p style="color: #64748b;">Nenhum herói vinculado.</p>';

  const itemsHtml = (stash.items && stash.items.length > 0) ? stash.items.map(it => `
    <li style="margin-bottom: 4px; font-size: 12px; color: #334155;">
      <b>${it.name}</b> (${it.qty || 1}x) - <i>${it.category || 'Geral'}</i> [🎒 Portador: ${it.carrier || 'Baú do Grupo'}]
    </li>
  `).join('') : '<p style="color: #64748b; font-size: 12px;">Baú vazio.</p>';

  preview.innerHTML = `
    <div class="print-document-sheet" style="font-family: 'Segoe UI', system-ui, sans-serif; color: #0f172a; max-width: 800px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; border-bottom: 3px double #334155; padding-bottom: 15px; margin-bottom: 20px;">
        <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #64748b; font-weight: 700;">D&D 5E Assistant • Crônicas da Campanha</div>
        <h1 style="font-size: 26px; margin: 6px 0; color: #0f172a;">${camp.name}</h1>
        <p style="font-size: 13px; color: #475569; margin: 0 auto; max-width: 650px;">${camp.desc || ''}</p>
        <div style="margin-top: 8px; font-size: 11px; color: #94a3b8;">
          Status: <b>${camp.status === 'active' ? 'Em Andamento' : 'Concluída'}</b> • Data de Exportação: <b>${new Date().toLocaleDateString('pt-BR')}</b>
        </div>
      </div>

      <div style="margin-bottom: 24px;">
        <h2 style="font-size: 16px; color: #1e293b; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; margin-bottom: 10px;">👥 Heróis da Aventura</h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
          ${heroesHtml}
        </div>
      </div>

      <div style="margin-bottom: 24px;">
        <h2 style="font-size: 16px; color: #1e293b; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; margin-bottom: 10px;">💰 Tesouro e Inventário Coletivo</h2>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 10px 14px; border-radius: 6px; font-size: 12px; margin-bottom: 8px;">
          <b>Ouro no Baú:</b> ${stash.gold || 0} Peças de Ouro (PO)
        </div>
        <ul style="padding-left: 20px; margin: 0;">
          ${itemsHtml}
        </ul>
      </div>

      <div>
        <h2 style="font-size: 16px; color: #1e293b; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; margin-bottom: 16px;">📜 Diário de Sessões e Crônicas</h2>
        ${sessionsHtml}
      </div>
    </div>
  `;

  modal.classList.add('open');
}

function closePrintChroniclesModal() {
  const modal = document.getElementById('modal-print-chronicles');
  if (modal) modal.classList.remove('open');
}

function triggerChroniclesBrowserPrint() {
  if (typeof window !== 'undefined') window.print();
}

// --- LEITOR DE CRÔNICAS & DIÁRIO DE SESSÕES (PARA JOGADORES E MESTRE) ---
function openChroniclesViewerModal() {
  const modal = document.getElementById('modal-chronicles-viewer');
  if (!modal) return;
  renderChroniclesViewerContent();
  modal.classList.add('open');
}

function closeChroniclesViewerModal() {
  const modal = document.getElementById('modal-chronicles-viewer');
  if (modal) modal.classList.remove('open');
}

function renderChroniclesViewerContent() {
  const camp = getActiveCampaign();
  if (!camp) return;

  const titleEl = document.getElementById('chronicles-viewer-camp-name');
  if (titleEl) titleEl.innerText = `${camp.name} • ${(camp.sessions || []).length} Sessões Registradas`;

  const container = document.getElementById('chronicles-viewer-timeline');
  if (!container) return;

  const filterInput = document.getElementById('inp-filter-chronicles');
  const filterText = filterInput ? filterInput.value.toLowerCase().trim() : '';

  let sessions = (camp.sessions || []).slice().sort((a, b) => b.number - a.number);

  if (filterText) {
    sessions = sessions.filter(s =>
      (s.title || '').toLowerCase().includes(filterText) ||
      (s.location || '').toLowerCase().includes(filterText) ||
      (s.keyNpcs || '').toLowerCase().includes(filterText) ||
      (s.notes || '').toLowerCase().includes(filterText) ||
      String(s.number).includes(filterText)
    );
  }

  if (sessions.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px 20px; background: rgba(0,0,0,0.2); border: 1px dashed var(--border-color); border-radius: 8px; color: var(--text-muted); font-size: 13px;">
        📖 ${filterText ? 'Nenhuma crônica encontrada para este termo de busca.' : 'Nenhuma crônica de sessão registrada nesta campanha.'}
      </div>
    `;
    return;
  }

  container.innerHTML = sessions.map(s => `
    <div class="session-log-card" style="background: #080c16; border: 1px solid var(--border-color); border-radius: 8px; padding: 14px; margin-bottom: 6px;">
      <div class="session-log-header" style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 8px;">
        <div>
          <div style="display:flex; align-items:center; gap:8px;">
            <span class="session-number-badge" style="background: rgba(245,158,11,0.2); border: 1px solid rgba(245,158,11,0.4); color: #fbbf24; font-size: 11px; font-weight: 800; padding: 2px 8px; border-radius: 4px;">Sessão ${s.number}</span>
            <span style="font-size:16px; font-weight:800; color:#fff; font-family:var(--font-title);">${s.title}</span>
          </div>
          <div style="font-size:11.5px; color:var(--text-muted); margin-top:4px;">
            📅 ${s.date || 'Data não informada'} • 🗺️ ${s.location || 'Local desconhecido'} • ⭐ <b>+${s.xpAwarded || 0} XP</b> por herói
          </div>
        </div>
      </div>

      <div class="session-notes-body" style="font-size: 12.5px; line-height: 1.6; color: #cbd5e1; background: rgba(0,0,0,0.25); padding: 12px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.04);">
        ${(s.notes || 'Sem anotações detalhadas.').replace(/\n/g, '<br>')}
      </div>

      ${s.keyNpcs ? `
        <div style="margin-top:10px; font-size:11.5px; color:var(--primary-light); background: rgba(245,158,11,0.05); padding: 6px 10px; border-radius: 4px; border: 1px solid rgba(245,158,11,0.15);">
          👥 <b>NPCs, Inimigos & Encontros:</b> <span style="color:#e2e8f0;">${s.keyNpcs}</span>
        </div>
      ` : ''}
    </div>
  `).join('');
}

