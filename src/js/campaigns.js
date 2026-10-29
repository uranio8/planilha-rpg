var CAMPAIGNS_STATE = (typeof CAMPAIGNS_STATE !== 'undefined' && CAMPAIGNS_STATE) ? CAMPAIGNS_STATE : {
  activeCampaignId: "camp_1",
  campaigns: (typeof INITIAL_CAMPAIGNS !== 'undefined') ? JSON.parse(JSON.stringify(INITIAL_CAMPAIGNS)) : []
};
if (typeof window !== 'undefined') {
  window.CAMPAIGNS_STATE = CAMPAIGNS_STATE;
}
var hasPendingPlayerStashSync = false;
if (typeof window !== 'undefined') {
  window.hasPendingPlayerStashSync = hasPendingPlayerStashSync;
}


function touchCampaign(campaignOrId) {
  if (!campaignOrId) return null;
  const camp = (typeof campaignOrId === 'string')
    ? (CAMPAIGNS_STATE && Array.isArray(CAMPAIGNS_STATE.campaigns) ? CAMPAIGNS_STATE.campaigns.find(c => c.id === campaignOrId) : null)
    : campaignOrId;
  if (camp) {
    camp.updatedAt = Date.now();
    if (camp.partyStash) {
      camp.partyStash.updatedAt = Date.now();
    }
  }
  return camp;
}

function touchPartyStash(campaignOrId) {
  const camp = touchCampaign(campaignOrId);
  if (camp) {
    if (!camp.partyStash) camp.partyStash = { gold: 0, items: [], history: [] };
    camp.partyStash.updatedAt = Date.now();
  }
  return camp;
}

function trackDeletedCampaignId(campId) {
  if (!campId || typeof localStorage === 'undefined') return;
  try {
    const raw = localStorage.getItem('dnd5e_deleted_campaign_ids');
    let list = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(list)) list = [];
    if (!list.includes(campId)) {
      list.push(campId);
      localStorage.setItem('dnd5e_deleted_campaign_ids', JSON.stringify(list));
    }
  } catch (e) {}
}

function getDeletedCampaignIds() {
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem('dnd5e_deleted_campaign_ids');
      if (raw) return JSON.parse(raw) || [];
    }
  } catch (e) {}
  return [];
}

function trackDeletedPartyItemId(itemId) {
  if (!itemId || typeof localStorage === 'undefined') return;
  try {
    const raw = localStorage.getItem('dnd5e_deleted_stash_item_ids');
    let list = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(list)) list = [];
    if (!list.includes(itemId)) {
      list.push(itemId);
      localStorage.setItem('dnd5e_deleted_stash_item_ids', JSON.stringify(list));
    }
  } catch (e) {}
}

function getDeletedPartyItemIds() {
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem('dnd5e_deleted_stash_item_ids');
      if (raw) return JSON.parse(raw) || [];
    }
  } catch (e) {}
  return [];
}

function getActiveCampaign() {
  if (!CAMPAIGNS_STATE.campaigns || CAMPAIGNS_STATE.campaigns.length === 0) {
    CAMPAIGNS_STATE.campaigns = (typeof INITIAL_CAMPAIGNS !== 'undefined') ? JSON.parse(JSON.stringify(INITIAL_CAMPAIGNS)) : [];
    CAMPAIGNS_STATE.activeCampaignId = CAMPAIGNS_STATE.campaigns[0]?.id || "camp_1";
  }

  // Se estiver no portal do jogador ou cliente jogador, prioriza a campanha onde o herói ativo está alocado
  if (typeof activePortalPlayerId !== 'undefined' && activePortalPlayerId) {
    const heroCamp = CAMPAIGNS_STATE.campaigns.find(c => Array.isArray(c.playerIds) && c.playerIds.some(pid => String(pid) === String(activePortalPlayerId)));
    if (heroCamp) {
      CAMPAIGNS_STATE.activeCampaignId = heroCamp.id;
      return heroCamp;
    }
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
    const camp = getActiveCampaign();
    if (camp) touchCampaign(camp);
    const serialized = JSON.stringify(CAMPAIGNS_STATE);
    const setStorage = (k, v) => (typeof safeLocalStorageSet === 'function' ? safeLocalStorageSet(k, v) : localStorage.setItem(k, v));
    setStorage('dnd5e_prisco_campaigns_v1', serialized);
    setStorage('dnd_tracker_campaigns_v1', serialized);

    // Atualiza dentro do payload STORAGE_KEY do core se existir
    try {
      if (typeof STORAGE_KEY !== 'undefined') {
        const fullRaw = localStorage.getItem(STORAGE_KEY);
        if (fullRaw) {
          const fullParsed = JSON.parse(fullRaw);
          fullParsed.campaignsState = CAMPAIGNS_STATE;
          setStorage(STORAGE_KEY, JSON.stringify(fullParsed));
        }
      }
    } catch(e) {}

    // Backup de segurança resiliente
    try {
      localStorage.setItem('dnd5e_campaigns_backup_safety', serialized);
    } catch(e) {}

    // Espelhamento no Cofre IndexedDB
    try {
      if (typeof idbSet === 'function') {
        idbSet('dnd5e_prisco_campaigns_v1', CAMPAIGNS_STATE);
        idbSet('dnd_tracker_campaigns_v1', CAMPAIGNS_STATE);
      }
    } catch(e) {}

    if (typeof showSaveStatus === 'function') showSaveStatus();
    if (typeof broadcastCampaignState === 'function') broadcastCampaignState();
    if (typeof syncLocalChangesToFirebase === 'function') syncLocalChangesToFirebase(true);
  } catch (e) {
    console.warn('Erro ao salvar campanhas:', e);
  }
}

function loadCampaignsState() {
  try {
    let raw = localStorage.getItem('dnd5e_prisco_campaigns_v1');
    if (!raw) {
      raw = localStorage.getItem('dnd_tracker_campaigns_v1');
    }
    if (!raw && typeof STORAGE_KEY !== 'undefined') {
      try {
        const full = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        if (full && full.campaignsState) {
          raw = JSON.stringify(full.campaignsState);
        }
      } catch(e) {}
    }
    if (!raw) {
      raw = localStorage.getItem('dnd5e_campaigns_backup_safety');
    }

    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.campaigns) && parsed.campaigns.length > 0) {
        const deletedIds = getDeletedCampaignIds();
        parsed.campaigns = parsed.campaigns.filter(c => !deletedIds.includes(c.id));
        if (parsed.campaigns.length > 0) {
          // Sanitização de sessões de teste legadas (Mina Perdida de Phandelver / Gundren Rockseeker)
          parsed.campaigns.forEach(c => {
            if (c.sessions && Array.isArray(c.sessions)) {
              c.sessions = c.sessions.filter(s => {
                const title = (s.title || '').toLowerCase();
                const notes = (s.notes || '').toLowerCase();
                return !title.includes('trilha triboar') && !title.includes('redbrands') && !notes.includes('gundren rockseeker');
              });
            }
            if (c.partyStash && c.partyStash.history && Array.isArray(c.partyStash.history)) {
              c.partyStash.history = c.partyStash.history.filter(h => {
                const txt = (h.text || '').toLowerCase();
                return !txt.includes('gundren rockseeker') && !txt.includes('redbrands');
              });
              if (c.partyStash.gold === 320 && c.partyStash.items && c.partyStash.items.some(i => i.name && i.name.includes('Wave Echo Cave'))) {
                c.partyStash.gold = 0;
                c.partyStash.items = [];
              }
            }
          });
          CAMPAIGNS_STATE = parsed;
          const activeCamp = getActiveCampaign();

          if (activeCamp && (!activeCamp.sessions || activeCamp.sessions.length === 0)) {
            if (typeof recoverSessionsFromSnapshots === 'function') {
              recoverSessionsFromSnapshots(true);
            }
          }
          return true;
        }
      }
    }
  } catch (e) {
    console.warn('Erro ao carregar campanhas:', e);
  }
  return false;
}

function broadcastCampaignState() {
  if (typeof isApplyingRemoteSync !== 'undefined' && isApplyingRemoteSync) return;
  if (typeof syncChannel !== 'undefined' && syncChannel) {
    syncChannel.postMessage({
      type: 'CAMPAIGNS_UPDATE',
      timestamp: Date.now(),
      campaignsState: CAMPAIGNS_STATE
    });
  }
}

function getCampaignPlayers(camp) {
  if (!camp || !camp.playerIds) return [];
  if (typeof PLAYERS === 'undefined' || !Array.isArray(PLAYERS)) return [];
  return camp.playerIds.map(id => PLAYERS.find(p => String(p.id) === String(id))).filter(Boolean);
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

  const campPlayers = getCampaignPlayers(camp);
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

  // 4. Renderiza NPCs Contratados & Folha de Pagamento do Grupo (Old Dragon 2 para 5E)
  renderCampaignHirelings(camp, campPlayers);

  // 5. Renderiza Bastião Coletivo do Grupo (D&D 2024 / 5.5 em PO - ISSUE-118)
  renderCampaignBastion(camp, campPlayers);
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
          <span>PO: <b>${(p.coins && p.coins.gp !== undefined) ? p.coins.gp : (p.gold || 0)}</b></span>
        </div>
      </div>
    `;
  }).join('');
}

function renderCampaignSessions(camp) {
  const container = document.getElementById('camp-sessions-timeline');
  if (!container) return;

  const sessions = (camp.sessions || []).slice().sort((a, b) => b.number - a.number);

  // Verifica se há rascunho não salvo armazenado no navegador
  let draftNoticeHtml = '';
  try {
    const rawDraft = localStorage.getItem('dnd5e_session_draft');
    if (rawDraft) {
      const draft = JSON.parse(rawDraft);
      if (draft && (draft.notes || draft.title)) {
        const previewText = (draft.notes || draft.title || '').substring(0, 60);
        draftNoticeHtml = `
          <div style="background: rgba(234, 179, 8, 0.15); border: 1px solid rgba(234, 179, 8, 0.4); border-radius: 8px; padding: 10px 14px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; gap: 10px; flex-wrap: wrap;">
            <div style="font-size: 12px; color: #fde047; display: flex; align-items: center; gap: 6px;">
              <span>⚠️</span>
              <span><b>Rascunho não salvo detectado:</b> "${previewText}..."</span>
            </div>
            <div style="display: flex; gap: 6px;">
              <button class="btn-action" style="padding: 4px 10px; font-size: 11px; background: #eab308; color: #000; font-weight: 700;" onclick="openSessionModal()">Restaurar Rascunho</button>
              <button class="btn-secondary" style="padding: 4px 8px; font-size: 11px;" onclick="localStorage.removeItem('dnd5e_session_draft'); renderCampaignSessions(getActiveCampaign());">Descartar</button>
            </div>
          </div>
        `;
      }
    }
  } catch(e) {}

  if (sessions.length === 0) {
    container.innerHTML = `
      ${draftNoticeHtml}
      <div style="text-align: center; padding: 30px; background: rgba(0,0,0,0.2); border: 1px dashed var(--border-color); border-radius: 8px; color: var(--text-muted); font-size: 12px;">
        📖 Nenhuma crônica de sessão registrada nesta campanha.
        <br><button class="btn-action" style="margin-top: 10px; padding: 6px 14px; font-size: 12px;" onclick="openSessionModal()">➕ Escrever Diário da Sessão 1</button>
      </div>
    `;
    return;
  }

  container.innerHTML = draftNoticeHtml + sessions.map(s => `
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

// --- FILTROS, ÍCONES E UTILITÁRIOS DO BAÚ COLETIVO (ISSUE-158) ---
var activePartyStashFilter = 'all';
var activePartyStashSearch = '';

const PARTY_ITEM_CATEGORY_ICONS = {
  'Poções': '🧪',
  'Tesouros & Gemas': '💎',
  'Armas': '⚔️',
  'Armaduras': '🛡️',
  'Itens Mágicos': '✨',
  'Documentos & Pistas': '📜',
  'Ferramentas': '🧰',
  'Equipamento de Aventura': '🎒',
  'Geral': '🎒'
};

function getPartyItemCategoryIcon(category) {
  if (!category) return '🎒';
  if (PARTY_ITEM_CATEGORY_ICONS[category]) return PARTY_ITEM_CATEGORY_ICONS[category];
  const low = String(category).toLowerCase();
  if (low.includes('poç') || low.includes('poc')) return '🧪';
  if (low.includes('tesouro') || low.includes('gema') || low.includes('arte')) return '💎';
  if (low.includes('arma') && !low.includes('armadura')) return '⚔️';
  if (low.includes('armadura') || low.includes('escudo')) return '🛡️';
  if (low.includes('mágic') || low.includes('magic')) return '✨';
  if (low.includes('doc') || low.includes('pergaminho') || low.includes('pista')) return '📜';
  if (low.includes('ferramenta') || low.includes('kit')) return '🧰';
  return '🎒';
}

function isCarrierStash(carrier) {
  if (!carrier) return true;
  const c = String(carrier).trim();
  return c === 'Baú do Grupo' || c === 'Mochila Coletiva' || c === 'Mochila Coletiva / Carroça';
}

function populateStashCompendiumDatalist() {
  if (typeof document === 'undefined') return;
  const dl = document.getElementById('stash-compendium-datalist');
  if (!dl) return;
  if (dl.children && dl.children.length > 0) return;

  const presetNames = [
    'Poção de Cura Menor (2d4+2)',
    'Poção de Cura Maior (4d4+4)',
    'Ração de Viagem (1 dia)',
    'Tocha',
    'Flechas (20)',
    'Virotes de Besta (20)',
    'Objeto de Arte (25 PO)',
    'Gema Preciosa (50 PO)',
    'Pergaminho Mágico (1º Círculo)',
    'Pergaminho Mágico (2º Círculo)',
    'Kit de Curandeiro',
    'Ferramentas de Ladrão',
    'Corda de Cânhamo (15m)',
    'Pé de Cabra'
  ];

  const seen = new Set();
  const optionsHtml = [];
  presetNames.forEach(name => {
    seen.add(name.toLowerCase());
    optionsHtml.push(`<option value="${name.replace(/"/g, '&quot;')}"></option>`);
  });

  if (typeof EQUIPMENT_DATA !== 'undefined' && Array.isArray(EQUIPMENT_DATA)) {
    EQUIPMENT_DATA.forEach(eq => {
      if (eq && eq.name && !seen.has(eq.name.toLowerCase())) {
        seen.add(eq.name.toLowerCase());
        optionsHtml.push(`<option value="${String(eq.name).replace(/"/g, '&quot;')}"></option>`);
      }
    });
  }

  dl.innerHTML = optionsHtml.join('');
}

function populateQuickAddCarrierSelects(camp, campPlayers) {
  if (typeof document === 'undefined') return;
  const players = campPlayers || (camp && camp.playerIds && camp.playerIds.length > 0 && typeof PLAYERS !== 'undefined'
    ? camp.playerIds.map(id => PLAYERS.find(p => String(p.id) === String(id))).filter(Boolean)
    : (typeof PLAYERS !== 'undefined' ? PLAYERS : [])) || [];

  ['sel-qadd-stash-carrier', 'sel-qadd-modal-carrier'].forEach(selId => {
    const sel = document.getElementById(selId);
    if (!sel) return;
    const prevVal = sel.value || 'Baú do Grupo';
    sel.innerHTML = `
      <option value="Baú do Grupo">📦 Baú do Grupo</option>
      <option value="Mochila Coletiva">🐴 Mochila Coletiva</option>
      ${players.map(p => `<option value="${p.name}">👤 ${p.name}</option>`).join('')}
    `;
    if ([...sel.options || []].some(o => o.value === prevVal)) {
      sel.value = prevVal;
    }
  });
}

function filterPartyStashItems(items) {
  const list = Array.isArray(items) ? items : [];
  const f = activePartyStashFilter || 'all';
  const q = (activePartyStashSearch || '').trim().toLowerCase();

  return list.filter(it => {
    if (!it) return false;
    if (f === 'in_stash' && !isCarrierStash(it.carrier)) return false;
    if (f === 'with_heroes' && isCarrierStash(it.carrier)) return false;
    if (f !== 'all' && f !== 'in_stash' && f !== 'with_heroes') {
      const cat = it.category || 'Equipamento de Aventura';
      if (cat !== f) return false;
    }
    if (q) {
      const hay = `${it.name || ''} ${it.category || ''} ${it.carrier || ''} ${it.desc || ''}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

function renderStashSummaryToolbar(stash, targetElId) {
  if (typeof document === 'undefined') return;
  const bar = document.getElementById(targetElId);
  if (!bar) return;

  const items = Array.isArray(stash?.items) ? stash.items : [];
  const totalDistinct = items.length;
  const totalUnits = items.reduce((acc, it) => acc + (parseInt(it.qty, 10) || 1), 0);
  const totalWeight = items.reduce((acc, it) => {
    const w = parseFloat(it.weight) || 0;
    const q = parseInt(it.qty, 10) || 1;
    return acc + (w * q);
  }, 0);

  const inStashCount = items.filter(it => isCarrierStash(it.carrier)).length;
  const withHeroesCount = items.filter(it => !isCarrierStash(it.carrier)).length;
  const countByCat = (cat) => items.filter(it => (it.category || 'Equipamento de Aventura') === cat).length;

  const chips = [
    { key: 'all', label: '🌐 Todos', count: totalDistinct },
    { key: 'in_stash', label: '📦 No Baú', count: inStashCount },
    { key: 'with_heroes', label: '👤 Com Heróis', count: withHeroesCount },
    { key: 'Poções', label: '🧪 Poções', count: countByCat('Poções') },
    { key: 'Tesouros & Gemas', label: '💎 Tesouros', count: countByCat('Tesouros & Gemas') },
    { key: 'Armas', label: '⚔️ Armas', count: countByCat('Armas') },
    { key: 'Equipamento de Aventura', label: '🎒 Suprimentos', count: countByCat('Equipamento de Aventura') },
    { key: 'Documentos & Pistas', label: '📜 Pergaminhos & Pistas', count: countByCat('Documentos & Pistas') }
  ];

  const searchValEscaped = String(activePartyStashSearch || '').replace(/"/g, '&quot;');

  bar.innerHTML = `
    <div class="stash-filter-chips">
      ${chips.map(c => `
        <button type="button" class="stash-filter-chip ${activePartyStashFilter === c.key ? 'active' : ''}" onclick="setPartyStashCategoryFilter('${c.key}')">
          <span>${c.label}</span>
          <span class="chip-count">${c.count}</span>
        </button>
      `).join('')}
    </div>
    <div class="stash-summary-right">
      <span class="stash-weight-pill" title="Volume e peso total acumulado no inventário do grupo">⚖️ ${totalUnits} unid. • ${Number(totalWeight.toFixed(1))} kg</span>
      <input type="text" class="stash-search-input" placeholder="🔍 Filtrar item, herói ou categoria..." value="${searchValEscaped}" oninput="handlePartyStashSearch(this.value)">
    </div>
  `;
}

function renderPartyStashItemRowHtml(it) {
  const cat = it.category || 'Equipamento de Aventura';
  const icon = getPartyItemCategoryIcon(cat);
  const inStash = isCarrierStash(it.carrier);
  const carrierLabel = inStash ? `📦 ${it.carrier || 'Baú do Grupo'}` : `👤 ${it.carrier}`;
  const carrierClass = inStash ? 'is-stash' : 'is-hero';
  const qty = parseInt(it.qty, 10) || 1;
  const unitW = parseFloat(it.weight) || 0;
  const totalW = Number((unitW * qty).toFixed(2));
  const weightDisplay = unitW > 0
    ? (qty > 1 ? `${totalW} kg <span style="font-size:9px; opacity:0.65;">(${unitW}kg/un)</span>` : `${unitW} kg`)
    : '-';

  return `
    <tr>
      <td>
        <div class="stash-item-name-cell">
          <div class="stash-item-title-row">
            <span style="font-size:14px;">${icon}</span>
            <b style="color:#fff;">${it.name}</b>
          </div>
          ${it.desc ? `<div class="stash-item-desc">${it.desc}</div>` : ''}
        </div>
      </td>
      <td style="text-align:center;">
        <div class="stash-qty-stepper">
          <button type="button" class="btn-stash-qty minus" onclick="adjustPartyItemQty('${it.id}', -1)" title="Consumir / Reduzir 1 unidade">−</button>
          <span class="stash-qty-val">${qty}</span>
          <button type="button" class="btn-stash-qty plus" onclick="adjustPartyItemQty('${it.id}', 1)" title="Adicionar +1 unidade">+</button>
        </div>
      </td>
      <td style="text-align:center;"><span style="font-size:11px; color:var(--text-dim);">${weightDisplay}</span></td>
      <td>
        <span class="stash-cat-pill"><span>${icon}</span> <span>${cat}</span></span>
      </td>
      <td>
        <span class="carrier-badge ${carrierClass}" title="${inStash ? 'Guardado no estoque coletivo do grupo' : 'Em posse de ' + it.carrier}">${carrierLabel}</span>
      </td>
      <td style="text-align:right; white-space:nowrap;">
        ${inStash
          ? `<button type="button" class="btn-secondary" style="padding:3px 7px; font-size:10px; border-color:rgba(56,189,248,0.35); color:#7dd3fc;" onclick="takePartyItemToPlayer('${it.id}')" title="Transferir do baú para a mochila de um herói">📥 Pegar</button>`
          : `<button type="button" class="btn-secondary" style="padding:3px 7px; font-size:10px; border-color:rgba(245,158,11,0.38); color:#fcd34d;" onclick="returnPartyItemToStash('${it.id}')" title="Devolver de ${it.carrier} para o Baú do Grupo">🔄 Ao Baú</button>
             <button type="button" class="btn-secondary" style="padding:3px 6px; font-size:10px;" onclick="takePartyItemToPlayer('${it.id}')" title="Transferir para outro herói">📥</button>`
        }
        <button type="button" class="btn-secondary" style="padding:3px 6px; font-size:10px;" onclick="openPartyItemModal('${it.id}')" title="Editar detalhes do item">✏️</button>
        <button type="button" class="btn-secondary" style="padding:3px 6px; font-size:10px; color:#f87171;" onclick="deletePartyItem('${it.id}')" title="Remover item">🗑️</button>
      </td>
    </tr>
  `;
}

function renderCampaignPartyStash(camp, campPlayers) {
  const goldDisplay = document.getElementById('stash-gold-amount');
  const itemsTbody = document.getElementById('stash-items-tbody');
  const historyList = document.getElementById('stash-history-list');

  const stash = camp.partyStash || { gold: 0, items: [], history: [] };

  if (goldDisplay) goldDisplay.innerText = `${stash.gold || 0} PO`;

  populateStashCompendiumDatalist();
  populateQuickAddCarrierSelects(camp, campPlayers);
  renderStashSummaryToolbar(stash, 'stash-summary-bar');

  if (itemsTbody) {
    if (!stash.items || stash.items.length === 0) {
      itemsTbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:18px; color:var(--text-muted);">O baú coletivo está vazio. Use a <b>Adição Rápida</b> acima ou os botões de suprimentos para adicionar recursos!</td></tr>`;
    } else {
      const filtered = filterPartyStashItems(stash.items);
      if (filtered.length === 0) {
        itemsTbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:16px; color:var(--text-muted);">Nenhum item encontrado para o filtro selecionado. <button type="button" class="btn-secondary" style="padding:2px 8px; font-size:10px; margin-left:6px;" onclick="setPartyStashCategoryFilter('all'); handlePartyStashSearch('');">Limpar Filtros</button></td></tr>`;
      } else {
        itemsTbody.innerHTML = filtered.map(it => renderPartyStashItemRowHtml(it)).join('');
      }
    }
  }

  if (historyList) {
    const rawHist = (stash.history || []);
    const indexed = rawHist.map((h, i) => ({ ...h, origIdx: i }));
    const hist = indexed.slice(-8).reverse();
    if (hist.length === 0) {
      historyList.innerHTML = `<div style="color:var(--text-muted); font-size:11px; text-align:center;">Nenhuma movimentação registrada.</div>`;
    } else {
      historyList.innerHTML = hist.map(h => `
        <div class="stash-history-item ${h.type || 'gold_in'}" style="display: flex; justify-content: space-between; align-items: center; gap: 6px;">
          <span style="flex: 1;">${h.text}</span>
          <div style="display: flex; align-items: center; gap: 4px;">
            <span style="font-size:10px; color:var(--text-dim); white-space: nowrap;">${h.date || ''}</span>
            <button class="btn-secondary" style="padding: 1px 4px; font-size: 9px; color: #f87171; border-color: rgba(239, 68, 68, 0.2); line-height: 1;" onclick="deletePartyStashHistoryItem(${h.origIdx})" title="Excluir este registro">🗑️</button>
          </div>
        </div>
      `).join('');
    }
  }
}

// --- MÓDULO DE NPCS CONTRATADOS & FOLHA DE PAGAMENTO DO GRUPO (OLD DRAGON 2 / 5E 100% PO) ---

function getAllCampaignHirelings(camp, campPlayers) {
  const result = [];
  // 1. Contratados diretos da campanha
  (camp.hirelings || []).forEach(h => {
    result.push({ ...h, isCampHireling: true, employerName: 'Campanha / Grupo', employerPlayerId: null });
  });

  // 2. Contratados agregados de cada herói vinculado
  (campPlayers || []).forEach(p => {
    (p.hirelings || []).forEach(h => {
      result.push({ ...h, isCampHireling: false, employerName: p.name, employerPlayerId: p.id });
    });
  });

  return result;
}

function renderCampaignHirelings(camp, campPlayers) {
  const container = document.getElementById('campaign-hirelings-container');
  if (!container) return;

  const hirelings = getAllCampaignHirelings(camp, campPlayers);
  const activeHirelings = hirelings.filter(h => h.status !== 'fled' && h.status !== 'dismissed');

  // Cálculo da folha de pagamento 100% em PO
  let weeklyCost = 0;
  let monthlyCost = 0;
  let mercenariesCount = 0;

  activeHirelings.forEach(h => {
    const cost = parseInt(h.cost, 10) || 0;
    const food = parseInt(h.foodCost, 10) || 0;

    if (h.type === 'helper' || h.costPeriod === 'semana') {
      weeklyCost += cost;
      monthlyCost += (cost * 4);
    } else if (h.type === 'mercenary' || h.costPeriod === 'mês') {
      mercenariesCount++;
      monthlyCost += (cost + food);
      weeklyCost += Math.ceil((cost + food) / 4);
    } else if (h.type === 'specialist') {
      weeklyCost += cost;
      monthlyCost += (cost * 4);
    }
  });

  // Regra do Sargento: mais de 6 mercenários exige sargento (+50% no soldo médio de 3 PO = +2 PO/mês)
  let sargWarning = '';
  if (mercenariesCount > 6) {
    const sargAdd = Math.ceil(mercenariesCount * 0.5);
    monthlyCost += sargAdd;
    sargWarning = `<div style="font-size:10px; color:#facc15; margin-top:2px;">⚠️ +${sargAdd} PO/mês (Comando de Sargento para pelotão com >6 soldados)</div>`;
  }

  const goldInStash = camp.partyStash?.gold || 0;

  container.innerHTML = `
    <div class="campaign-hirelings-box">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 16px;">👥</span>
          <div>
            <span style="font-size: 14px; font-weight: 800; color: #fff; text-transform: uppercase; letter-spacing: 0.5px;">NPCs Contratados & Folha de Pagamento</span>
            <div style="font-size: 10px; color: var(--text-dim);">Ajudantes, mercenários, aprendizes e especialistas a serviço do grupo</div>
          </div>
        </div>
        <div style="display: flex; gap: 6px;">
          <button type="button" class="btn-action" style="font-size: 11px; padding: 4px 10px;" onclick="openAddCampaignHirelingModal()">➕ Contratar NPC</button>
          <button type="button" class="btn-secondary" style="font-size: 11px; padding: 4px 10px; color: #facc15; border-color: rgba(234, 179, 8, 0.4);" onclick="rollCampaignHirelingsMorale()" title="Rolar moral diário dos ajudantes/mercenários">🎲 Teste de Moral</button>
          <button type="button" class="btn-secondary" style="font-size: 11px; padding: 4px 10px; color: #34d399; border-color: rgba(52, 211, 153, 0.4);" onclick="payCampaignHirelingsPayroll('semana')" title="Pagar salários semanais debitando do baú coletivo">💳 Pagar Folha (Semanal)</button>
        </div>
      </div>

      <!-- Resumo Financeiro da Folha em PO -->
      <div class="camp-payroll-summary">
        <div class="camp-payroll-card">
          <div class="camp-payroll-val">${activeHirelings.length}</div>
          <div class="camp-payroll-lbl">NPCs em Ação</div>
        </div>
        <div class="camp-payroll-card">
          <div class="camp-payroll-val">${weeklyCost} <small style="font-size: 10px; color: var(--text-dim);">PO</small></div>
          <div class="camp-payroll-lbl">Custo Semanal</div>
        </div>
        <div class="camp-payroll-card">
          <div class="camp-payroll-val">${monthlyCost} <small style="font-size: 10px; color: var(--text-dim);">PO</small></div>
          <div class="camp-payroll-lbl">Custo Mensal Estimado</div>
          ${sargWarning}
        </div>
        <div class="camp-payroll-card">
          <div class="camp-payroll-val" style="color: ${goldInStash >= weeklyCost ? '#34d399' : '#f87171'};">${goldInStash} <small style="font-size: 10px; color: var(--text-dim);">PO</small></div>
          <div class="camp-payroll-lbl">Saldo no Baú</div>
        </div>
      </div>

      <!-- Lista de NPCs e Missões -->
      <div class="hirelings-container">
        ${hirelings.length === 0 ? `
          <div style="text-align: center; padding: 18px; color: var(--text-muted); font-size: 11.5px; font-style: italic; background: rgba(15, 23, 42, 0.4); border-radius: 8px;">
            Nenhum ajudante ou mercenário contratado no momento. Clique em <b>➕ Contratar NPC</b> para admitir tocheiros, soldados, aprendizes ou especialistas!
          </div>
        ` : hirelings.map(h => {
          const statusClass = h.status === 'fled' ? 'status-pill-fled' : (h.status === 'injured' ? 'status-pill-injured' : (h.status === 'away' ? 'status-pill-away' : 'status-pill-acting'));
          const statusLabel = h.status === 'fled' ? '🏃 Fugiu / Desaparecido' : (h.status === 'injured' ? '🔴 Ferido / Repouso' : (h.status === 'away' ? '🟡 Missão Externa' : '🟢 Em Ação'));
          return `
            <div class="hireling-card ${h.status === 'fled' ? 'fled' : ''}" id="hireling-card-${h.id}">
              <div class="hireling-header">
                <div>
                  <div class="hireling-name-badge">
                    <span>${h.name}</span>
                    <span class="hireling-cost-tag">💰 ${h.cost} PO / ${h.costPeriod || 'semana'}${h.foodCost ? ` (+${h.foodCost} PO com)` : ''}</span>
                    <span class="status-pill ${statusClass}">${statusLabel}</span>
                  </div>
                  <div style="font-size: 10.5px; color: var(--text-dim); margin-top: 2px;">
                    Vínculo: <b>${h.employerName}</b> • ${h.description || 'NPC contratado'}
                  </div>
                </div>
                <div style="display: flex; gap: 4px;">
                  <button type="button" class="btn-micro" onclick="sendHirelingToCombat('${h.id}', '${h.employerPlayerId || ''}')" title="Enviar para o combate / VTT como aliado" style="color: #38bdf8; padding: 2px 6px;">⚔️ Combate</button>
                  <button type="button" class="btn-micro" onclick="rollSingleHirelingMorale('${h.id}', '${h.employerPlayerId || ''}')" title="Testar moral deste NPC" style="color: #facc15; padding: 2px 6px;">🎲 Moral</button>
                  <button type="button" class="btn-micro" onclick="dismissCampaignHireling('${h.id}', '${h.employerPlayerId || ''}')" title="Dispensar contratado" style="color: #f87171; padding: 2px 6px;">🗑️</button>
                </div>
              </div>

              <!-- Atributos D&D 5E -->
              <div class="hireling-stats-row">
                <span class="hireling-stat-pill">❤️ PV: <b>${h.hp || 4}/${h.maxHp || 4}</b></span>
                <span class="hireling-stat-pill">🛡️ CA: <b>${h.ac || 10}</b></span>
                <span class="hireling-stat-pill">🏃 Desl: <b>${h.speed || '9m'}</b></span>
                <span class="hireling-stat-pill">🦁 Moral: <b>${h.morale || 7} (CD ${h.moraleDc || 10})</b></span>
                ${(h.attacks || []).map(a => `<span class="hireling-stat-pill" style="color: #fed7aa;">⚔️ ${a.name} (+${a.bonus}, ${a.damage})</span>`).join('')}
                ${h.specialFeature ? `<span class="hireling-stat-pill" style="color: #c4b5fd;">${h.specialFeature}</span>` : ''}
              </div>

              <!-- Campo de Função / Missão Ativa -->
              <div class="hireling-mission-box">
                <span style="font-size: 12px;" title="Missão em andamento">🎯</span>
                <input type="text" class="hireling-mission-input" value="${h.mission || h.defaultMission || 'Ajudar nas tarefas do grupo'}" 
                  placeholder="Defina a função / missão atual deste NPC..."
                  onchange="updateHirelingMission('${h.id}', this.value, '${h.employerPlayerId || ''}')">
                <select style="background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(148, 163, 184, 0.2); color: #cbd5e1; font-size: 10px; border-radius: 4px; padding: 1px 4px;"
                  onchange="updateHirelingStatus('${h.id}', this.value, '${h.employerPlayerId || ''}')">
                  <option value="acting" ${h.status === 'acting' || !h.status ? 'selected' : ''}>🟢 Em Ação</option>
                  <option value="away" ${h.status === 'away' ? 'selected' : ''}>🟡 Missão Externa</option>
                  <option value="injured" ${h.status === 'injured' ? 'selected' : ''}>🔴 Ferido</option>
                  <option value="fled" ${h.status === 'fled' ? 'selected' : ''}>🏃 Fugiu</option>
                </select>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

// Atualização de missão e status
function updateHirelingMission(hirelingId, newMission, playerId = null) {
  const camp = getActiveCampaign();
  let found = false;

  if (playerId && typeof PLAYERS !== 'undefined') {
    const p = PLAYERS.find(x => x.id === playerId);
    if (p && Array.isArray(p.hirelings)) {
      const h = p.hirelings.find(x => x.id === hirelingId);
      if (h) {
        h.mission = newMission;
        touchPlayer(p);
        found = true;
      }
    }
  }

  if (!found && camp && Array.isArray(camp.hirelings)) {
    const h = camp.hirelings.find(x => x.id === hirelingId);
    if (h) {
      h.mission = newMission;
      touchCampaign(camp);
      found = true;
    }
  }

  if (found) {
    saveCampaignsState();
    if (typeof saveToLocalStorage === 'function') saveToLocalStorage();
    if (typeof showSaveStatus === 'function') showSaveStatus();
  }
}

function updateHirelingStatus(hirelingId, newStatus, playerId = null) {
  const camp = getActiveCampaign();
  let found = false;

  if (playerId && typeof PLAYERS !== 'undefined') {
    const p = PLAYERS.find(x => x.id === playerId);
    if (p && Array.isArray(p.hirelings)) {
      const h = p.hirelings.find(x => x.id === hirelingId);
      if (h) {
        h.status = newStatus;
        touchPlayer(p);
        found = true;
      }
    }
  }

  if (!found && camp && Array.isArray(camp.hirelings)) {
    const h = camp.hirelings.find(x => x.id === hirelingId);
    if (h) {
      h.status = newStatus;
      touchCampaign(camp);
      found = true;
    }
  }

  if (found) {
    saveCampaignsState();
    if (typeof saveToLocalStorage === 'function') saveToLocalStorage();
    renderCampaigns();
    if (typeof renderPlayers === 'function') renderPlayers();
  }
}

function dismissCampaignHireling(hirelingId, playerId = null) {
  const camp = getActiveCampaign();
  if (!confirm('Deseja realmente dispensar este contratado do grupo?')) return;

  if (playerId && typeof PLAYERS !== 'undefined') {
    const p = PLAYERS.find(x => x.id === playerId);
    if (p && Array.isArray(p.hirelings)) {
      p.hirelings = p.hirelings.filter(x => x.id !== hirelingId);
      touchPlayer(p);
    }
  }

  if (camp && Array.isArray(camp.hirelings)) {
    camp.hirelings = camp.hirelings.filter(x => x.id !== hirelingId);
    touchCampaign(camp);
  }

  saveCampaignsState();
  if (typeof saveToLocalStorage === 'function') saveToLocalStorage();
  renderCampaigns();
  if (typeof renderPlayers === 'function') renderPlayers();
  if (typeof addLog === 'function') addLog('👥 <b>Contratados:</b> Lacaio/Mercenário dispensado do serviço.');
}

// Pagamento da folha com débito direto no baú em PO
function payCampaignHirelingsPayroll(period = 'semana') {
  const camp = getActiveCampaign();
  if (!camp) return;

  const campPlayers = (camp.playerIds || []).map(id => PLAYERS.find(p => String(p.id) === String(id))).filter(p => p);
  const hirelings = getAllCampaignHirelings(camp, campPlayers).filter(h => h.status !== 'fled' && h.status !== 'dismissed');

  if (hirelings.length === 0) {
    alert('Nenhum contratado ativo no momento.');
    return;
  }

  let totalCost = 0;
  hirelings.forEach(h => {
    const cost = parseInt(h.cost, 10) || 0;
    const food = parseInt(h.foodCost, 10) || 0;
    if (period === 'semana') {
      totalCost += (h.type === 'mercenary' ? Math.ceil((cost + food) / 4) : cost);
    } else {
      totalCost += (h.type === 'helper' ? cost * 4 : cost + food);
    }
  });

  const currentGold = camp.partyStash?.gold || 0;
  if (currentGold < totalCost) {
    alert(`Ouro insuficiente no Baú Coletivo!\nCusto da folha: ${totalCost} PO\nSaldo no Baú: ${currentGold} PO\n\nAdicione ouro ao baú antes de pagar.`);
    return;
  }

  if (!confirm(`Confirmar pagamento da folha de salários (${period})?\nValor Total: ${totalCost} PO para ${hirelings.length} contratados.\nSaldo Restante: ${currentGold - totalCost} PO.`)) {
    return;
  }

  camp.partyStash = camp.partyStash || { gold: 0, items: [], history: [] };
  camp.partyStash.gold -= totalCost;
  camp.partyStash.history = camp.partyStash.history || [];
  camp.partyStash.history.push({
    date: new Date().toISOString().split('T')[0],
    text: `💳 Folha de salários paga: -${totalCost} PO (${hirelings.length} NPCs)`,
    type: 'gold_out'
  });

  touchCampaign(camp);
  saveCampaignsState();
  if (typeof saveToLocalStorage === 'function') saveToLocalStorage();
  renderCampaigns();
  if (typeof updateAllPartyStashElements === 'function') updateAllPartyStashElements();

  if (typeof addLog === 'function') {
    addLog(`💰 <b>Folha de Pagamento:</b> ${totalCost} PO debitados do Baú Coletivo para pagamento de ${hirelings.length} contratados.`);
  }
}

// Teste de Moral Diário (Old Dragon 2: Moral 7 a 9 / CD 9 a 10 no d20)
function rollCampaignHirelingsMorale() {
  const camp = getActiveCampaign();
  if (!camp) return;

  const campPlayers = (camp.playerIds || []).map(id => PLAYERS.find(p => String(p.id) === String(id))).filter(p => p);
  const hirelings = getAllCampaignHirelings(camp, campPlayers).filter(h => h.status === 'acting' || h.status === 'away');

  if (hirelings.length === 0) {
    alert('Nenhum ajudante ou mercenário em serviço ativo para testar moral.');
    return;
  }

  let logReport = '🎲 <b>Teste de Moral Diário dos Contratados:</b><br>';
  let anyFled = false;

  hirelings.forEach(h => {
    const d20 = Math.floor(Math.random() * 20) + 1;
    const dc = h.moraleDc || 10;
    // Bônus bondoso/cruel
    const employerBonus = (h.employerTrait === 'kind') ? 1 : (h.employerTrait === 'cruel' ? -1 : 0);
    const total = d20 + employerBonus;
    const passed = total >= dc;

    if (passed) {
      logReport += `• <b>${h.name}</b> (${h.employerName}): d20(${d20})${employerBonus ? (employerBonus > 0 ? '+1' : '-1') : ''} = <b>${total}</b> vs CD ${dc} — <span style="color:#34d399;">Permanece leal ✅</span><br>`;
    } else {
      anyFled = true;
      h.status = 'fled';
      updateHirelingStatus(h.id, 'fled', h.employerPlayerId);
      logReport += `• <b>${h.name}</b> (${h.employerName}): d20(${d20})${employerBonus ? (employerBonus > 0 ? '+1' : '-1') : ''} = <b>${total}</b> vs CD ${dc} — <span style="color:#f87171;">FALHOU e fugiu durante a noite! 🏃💨</span><br>`;
    }
  });

  if (typeof addLog === 'function') addLog(logReport);
  renderCampaigns();
  if (typeof renderPlayers === 'function') renderPlayers();

  if (anyFled) {
    alert('Atenção! Um ou mais contratados falharam no teste de moral e desertaram durante a noite. Verifique o feed de combate/mensagens.');
  } else {
    alert('Todos os contratados passaram no teste de moral e continuam cumprindo suas tarefas bravamente!');
  }
}

function rollSingleHirelingMorale(hirelingId, playerId = null) {
  const camp = getActiveCampaign();
  const campPlayers = (camp.playerIds || []).map(id => PLAYERS.find(p => String(p.id) === String(id))).filter(p => p);
  const h = getAllCampaignHirelings(camp, campPlayers).find(x => x.id === hirelingId);
  if (!h) return;

  const d20 = Math.floor(Math.random() * 20) + 1;
  const dc = h.moraleDc || 10;
  const employerBonus = (h.employerTrait === 'kind') ? 1 : (h.employerTrait === 'cruel' ? -1 : 0);
  const total = d20 + employerBonus;
  const passed = total >= dc;

  const resultMsg = passed
    ? `🦁 <b>${h.name} (Moral):</b> d20(${d20})${employerBonus ? (employerBonus > 0 ? '+1' : '-1') : ''} = <b>${total}</b> vs CD ${dc}. <span style="color:#34d399;">Passou! Firme em seu posto.</span>`
    : `🏃 <b>${h.name} (Moral):</b> d20(${d20})${employerBonus ? (employerBonus > 0 ? '+1' : '-1') : ''} = <b>${total}</b> vs CD ${dc}. <span style="color:#f87171;">Falhou! O medo o domina.</span>`;

  if (typeof addLog === 'function') addLog(resultMsg);
  if (!passed && confirm(`${h.name} falhou no teste de moral (Rolou ${total} vs CD ${dc}). Marcar como que fugiu?`)) {
    updateHirelingStatus(hirelingId, 'fled', playerId);
  }
}

// Envia NPC contratado para o Combat Tracker como aliado
function sendHirelingToCombat(hirelingId, playerId = null) {
  const camp = getActiveCampaign();
  const campPlayers = (camp.playerIds || []).map(id => PLAYERS.find(p => String(p.id) === String(id))).filter(p => p);
  const h = getAllCampaignHirelings(camp, campPlayers).find(x => x.id === hirelingId);
  if (!h) return;

  if (typeof state === 'undefined' || !Array.isArray(state.combatants)) {
    alert('Gerenciador de combate não inicializado.');
    return;
  }

  const existingCombatant = state.combatants.find(c => c.hirelingId === hirelingId);
  if (existingCombatant) {
    alert(`"${h.name}" já está presente no combate (Iniciativa: ${existingCombatant.init})!`);
    return;
  }

  const initRoll = Math.floor(Math.random() * 20) + 1;
  const combatant = {
    id: 'cbt_h_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5),
    hirelingId: h.id,
    name: `${h.name} (${h.employerName})`,
    hp: h.hp || 4,
    maxHp: h.maxHp || 4,
    ac: h.ac || 10,
    init: initRoll,
    type: 'ally',
    actions: (h.attacks || []).map(a => `${a.name} (+${a.bonus}, ${a.damage})`).join(' | ') || 'Ataque improvisado (+0, 1d4)',
    active: false,
    color: '#38bdf8'
  };

  state.combatants.push(combatant);
  state.combatants.sort((a, b) => (b.init || 0) - (a.init || 0));

  if (typeof saveState === 'function') saveState();
  if (typeof renderCombat === 'function') renderCombat();
  if (typeof switchTab === 'function') switchTab('combat');

  if (typeof addLog === 'function') {
    addLog(`⚔️ <b>Contratado no Combate:</b> "${combatant.name}" entrou na batalha com Iniciativa <b>${initRoll}</b>.`);
  }
}

// Modais de Adicionar Contratado
let activeHirelingTargetPlayerId = null;

function openAddCampaignHirelingModal(forPlayerId = null) {
  activeHirelingTargetPlayerId = forPlayerId;
  const modal = document.getElementById('modal-campaign-hireling');
  if (!modal) return;

  const selPreset = document.getElementById('sel-hireling-preset');
  if (selPreset && typeof HIRELINGS_CATALOG !== 'undefined') {
    let opts = '<option value="">-- Escolha um NPC do Catálogo OD2 / 5E --</option>';
    Object.keys(HIRELINGS_CATALOG.categories).forEach(catKey => {
      const cat = HIRELINGS_CATALOG.categories[catKey];
      opts += `<optgroup label="${cat.name}">`;
      cat.items.forEach(it => {
        opts += `<option value="${it.id}">${it.name} (${it.cost} PO/${it.costPeriod}${it.foodCost ? ` +${it.foodCost} PO comida` : ''})</option>`;
      });
      opts += `</optgroup>`;
    });
    selPreset.innerHTML = opts;
  }

  // Preenche empregadores disponíveis
  const selEmployer = document.getElementById('sel-hireling-employer');
  if (selEmployer) {
    const camp = getActiveCampaign();
    const campPlayers = (camp && camp.playerIds ? camp.playerIds.map(id => PLAYERS.find(p => String(p.id) === String(id))).filter(p => p) : PLAYERS) || [];
    let empOpts = '<option value="camp">🏛️ Campanha / Grupo Todo</option>';
    campPlayers.forEach(p => {
      empOpts += `<option value="${p.id}" ${forPlayerId === p.id ? 'selected' : ''}>👤 ${p.name} (Carisma: ${p.cha || 10})</option>`;
    });
    selEmployer.innerHTML = empOpts;
  }

  modal.classList.add('open');
}

function closeAddCampaignHirelingModal() {
  const modal = document.getElementById('modal-campaign-hireling');
  if (modal) modal.classList.remove('open');
  activeHirelingTargetPlayerId = null;
}

function onHirelingPresetChange() {
  const selPreset = document.getElementById('sel-hireling-preset');
  if (!selPreset || !selPreset.value || typeof HIRELINGS_CATALOG === 'undefined') return;

  const presetId = selPreset.value;
  let found = null;
  Object.values(HIRELINGS_CATALOG.categories).forEach(cat => {
    const it = cat.items.find(x => x.id === presetId);
    if (it) found = it;
  });

  if (!found) return;

  const nameInput = document.getElementById('inp-hireling-name');
  const costInput = document.getElementById('inp-hireling-cost');
  const periodSelect = document.getElementById('sel-hireling-period');
  const hpInput = document.getElementById('inp-hireling-hp');
  const acInput = document.getElementById('inp-hireling-ac');
  const missionInput = document.getElementById('inp-hireling-mission');

  if (nameInput) nameInput.value = found.name;
  if (costInput) costInput.value = found.cost;
  if (periodSelect) periodSelect.value = found.costPeriod || 'semana';
  if (hpInput) hpInput.value = found.hp || 4;
  if (acInput) acInput.value = found.ac || 10;
  if (missionInput) missionInput.value = found.defaultMission || '';
}

function saveNewCampaignHireling() {
  const name = document.getElementById('inp-hireling-name')?.value.trim();
  if (!name) {
    alert('Informe o nome do contratado.');
    return;
  }

  const cost = parseInt(document.getElementById('inp-hireling-cost')?.value, 10) || 1;
  const costPeriod = document.getElementById('sel-hireling-period')?.value || 'semana';
  const hp = parseInt(document.getElementById('inp-hireling-hp')?.value, 10) || 4;
  const ac = parseInt(document.getElementById('inp-hireling-ac')?.value, 10) || 10;
  const mission = document.getElementById('inp-hireling-mission')?.value.trim() || 'Ajudar nas tarefas do grupo';
  const employerVal = document.getElementById('sel-hireling-employer')?.value || 'camp';

  // Localiza dados do preset se houver
  const presetId = document.getElementById('sel-hireling-preset')?.value || '';
  let presetData = null;
  if (presetId && typeof HIRELINGS_CATALOG !== 'undefined') {
    Object.values(HIRELINGS_CATALOG.categories).forEach(cat => {
      const it = cat.items.find(x => x.id === presetId);
      if (it) presetData = it;
    });
  }

  const hirelingObj = {
    id: 'hir_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    name: name,
    type: presetData ? presetData.type : 'helper',
    cost: cost,
    costPeriod: costPeriod,
    foodCost: presetData ? (presetData.foodCost || 0) : 0,
    hp: hp,
    maxHp: hp,
    ac: ac,
    speed: presetData ? (presetData.speed || '9m') : '9m',
    attacks: presetData ? (presetData.attacks || []) : [{ name: 'Arma Simples', bonus: 0, damage: '1d4' }],
    morale: presetData ? (presetData.morale || 7) : 7,
    moraleDc: presetData ? (presetData.moraleDc || 10) : 10,
    specialFeature: presetData ? (presetData.specialFeature || '') : '',
    description: presetData ? (presetData.description || '') : 'NPC contratado',
    mission: mission,
    status: 'acting',
    createdAt: Date.now()
  };

  if (employerVal === 'camp') {
    const camp = getActiveCampaign();
    if (!camp) return;
    camp.hirelings = camp.hirelings || [];
    camp.hirelings.push(hirelingObj);
    touchCampaign(camp);
  } else {
    const p = (typeof PLAYERS !== 'undefined') ? PLAYERS.find(x => x.id === employerVal) : null;
    if (p) {
      p.hirelings = p.hirelings || [];
      // Validação de limite por Carisma para Ajudantes
      if (hirelingObj.type === 'helper' && typeof calculateHirelingCharismaLimit === 'function') {
        const limit = calculateHirelingCharismaLimit(p.cha);
        const currentHelpers = p.hirelings.filter(h => h.type === 'helper').length;
        if (currentHelpers >= limit) {
          if (!confirm(`${p.name} possui Carisma ${p.cha || 10} (Limite: ${limit} ajudantes).\nAtualmente já possui ${currentHelpers} ajudantes.\nDeseja contratar mesmo assim ignorando o limite?`)) {
            return;
          }
        }
      }
      p.hirelings.push(hirelingObj);
      touchPlayer(p);
    }
  }

  saveCampaignsState();
  if (typeof saveToLocalStorage === 'function') saveToLocalStorage();
  closeAddCampaignHirelingModal();
  renderCampaigns();
  if (typeof renderPlayers === 'function') renderPlayers();

  if (typeof addLog === 'function') {
    addLog(`👥 <b>Novo Contratado:</b> "${name}" (${cost} PO/${costPeriod}) contratado pelo grupo.`);
  }
}

// --- OPERAÇÕES DE CAMPANHA ---
function handleCampaignSelect(campaignId) {
  CAMPAIGNS_STATE.activeCampaignId = campaignId;
  saveCampaignsState();
  renderCampaigns();
}

function copyLobbyShareLink() {
  const href = (typeof window !== 'undefined' && window.location && window.location.href) ? window.location.href : 'https://uranio8.github.io/planilha-rpg/';
  const base = href.split('?')[0].split('#')[0];
  const lobbyUrl = `${base}?lobby=true`;

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
      touchCampaign(camp);
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
    touchCampaign(newCamp);
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

  const deletedCampId = camp.id;
  trackDeletedCampaignId(deletedCampId);
  CAMPAIGNS_STATE.campaigns = CAMPAIGNS_STATE.campaigns.filter(c => c.id !== deletedCampId);
  CAMPAIGNS_STATE.activeCampaignId = CAMPAIGNS_STATE.campaigns[0].id;
  const newActive = getActiveCampaign();
  if (newActive) touchCampaign(newActive);

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

  const currentIds = new Set((camp.playerIds || []).map(String));

  container.innerHTML = PLAYERS.map(p => {
    const isChecked = currentIds.has(String(p.id));
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
  if (typeof touchCampaign === 'function') touchCampaign(camp);
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
    const p = PLAYERS.find(x => String(x.id) === String(pId));
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
let sessionDraftTimer = null;

function saveSessionDraft() {
  if (sessionDraftTimer) clearTimeout(sessionDraftTimer);
  sessionDraftTimer = setTimeout(() => {
    try {
      const title = document.getElementById('inp-sess-title')?.value || '';
      const notes = document.getElementById('inp-sess-notes')?.value || '';
      const num = document.getElementById('inp-sess-num')?.value || '1';
      const date = document.getElementById('inp-sess-date')?.value || '';
      const loc = document.getElementById('inp-sess-loc')?.value || '';
      const xp = document.getElementById('inp-sess-xp')?.value || '100';
      const npcs = document.getElementById('inp-sess-npcs')?.value || '';

      if (notes.trim() || title.trim()) {
        const draft = { num, date, title, loc, xp, npcs, notes, timestamp: Date.now() };
        localStorage.setItem('dnd5e_session_draft', JSON.stringify(draft));
      }
    } catch(e) {}
  }, 250);
}

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

  // Se for nova sessão e não tiver preenchido nada, restaura rascunho anterior se houver
  if (!isEdit) {
    try {
      const rawDraft = localStorage.getItem('dnd5e_session_draft');
      if (rawDraft) {
        const draft = JSON.parse(rawDraft);
        if (draft && (draft.notes || draft.title)) {
          if (draft.title) document.getElementById('inp-sess-title').value = draft.title;
          if (draft.loc) document.getElementById('inp-sess-loc').value = draft.loc;
          if (draft.xp) document.getElementById('inp-sess-xp').value = draft.xp;
          if (draft.npcs) document.getElementById('inp-sess-npcs').value = draft.npcs;
          if (draft.notes) document.getElementById('inp-sess-notes').value = draft.notes;
          if (draft.date) document.getElementById('inp-sess-date').value = draft.date;
        }
      }
    } catch(e) {}
  }

  modal.classList.add('open');
}

function closeSessionModal() {
  currentEditSessionId = null;
  const modal = document.getElementById('modal-campaign-session');
  if (modal) modal.classList.remove('open');
}

function saveSessionLog() {
  const camp = getActiveCampaign();
  if (!camp) return;

  const num = parseInt(document.getElementById('inp-sess-num').value) || 1;
  const date = document.getElementById('inp-sess-date').value || new Date().toISOString().split('T')[0];
  let title = document.getElementById('inp-sess-title').value.trim();
  const location = document.getElementById('inp-sess-loc').value.trim();
  const xp = parseInt(document.getElementById('inp-sess-xp').value) || 0;
  const npcs = document.getElementById('inp-sess-npcs').value.trim();
  const notes = document.getElementById('inp-sess-notes').value.trim();

  if (!title) {
    title = `Sessão ${num}`;
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
      sess.updatedAt = Date.now();
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
      notes,
      updatedAt: Date.now()
    });
  }

  // Limpa o rascunho temporário
  try {
    localStorage.removeItem('dnd5e_session_draft');
  } catch(e) {}

  saveCampaignsState();
  if (typeof saveToLocalStorage === 'function') saveToLocalStorage();
  if (typeof saveSafetySnapshot === 'function') saveSafetySnapshot(`Registro de Sessão ${num}`);
  if (typeof syncLocalChangesToFirebase === 'function') syncLocalChangesToFirebase(true);

  closeSessionModal();
  renderCampaigns();
  if (typeof addLog === 'function') addLog(`📖 <b>Diário de Sessão:</b> Sessão ${num} ("${title}") registrada com sucesso.`);
}

function recoverSessionsFromSnapshots(silent = false) {
  const camp = getActiveCampaign();
  if (!camp) return 0;
  let recoveredCount = 0;
  try {
    const snapshots = (typeof getSafetySnapshots === 'function') ? getSafetySnapshots() : [];
    camp.sessions = camp.sessions || [];
    snapshots.forEach(snap => {
      if (snap.campaignsState && Array.isArray(snap.campaignsState.campaigns)) {
        const snapCamp = snap.campaignsState.campaigns.find(c => c.id === camp.id || c.name === camp.name);
        if (snapCamp && Array.isArray(snapCamp.sessions)) {
          snapCamp.sessions.forEach(ss => {
            if (!camp.sessions.some(ls => ls.id === ss.id || (ls.number === ss.number && ls.date === ss.date))) {
              camp.sessions.push(ss);
              recoveredCount++;
            }
          });
        }
      }
    });

    if (recoveredCount > 0) {
      saveCampaignsState();
      renderCampaigns();
      if (typeof addLog === 'function') addLog(`📖 <b>Diário Recuperado:</b> ${recoveredCount} sessão(ões) restaurada(s) com sucesso dos backups!`);
      if (!silent) alert(`✅ ${recoveredCount} sessão(ões) de diário recuperada(s) com sucesso dos backups automáticos locais!`);
    } else {
      if (!silent) alert('Nenhum registro anterior de sessão foi encontrado nos backups locais.');
    }
  } catch(e) {
    console.warn('Erro ao recuperar sessões:', e);
  }
  return recoveredCount;
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
function promptAdjustPartyGold(type, sourcePlayerId = null) {
  const camp = getActiveCampaign();
  if (!camp) return;
  camp.partyStash = camp.partyStash || { gold: 0, items: [], history: [] };
  camp.partyStash.items = camp.partyStash.items || [];
  camp.partyStash.history = camp.partyStash.history || [];

  // Identifica o herói se a ação for disparada por um jogador ou portal
  let player = null;
  if (sourcePlayerId && typeof PLAYERS !== 'undefined') {
    player = PLAYERS.find(p => p.id === sourcePlayerId);
  } else if (typeof activePortalPlayerId !== 'undefined' && activePortalPlayerId && typeof PLAYERS !== 'undefined') {
    player = PLAYERS.find(p => p.id === activePortalPlayerId);
  } else if (typeof document !== 'undefined' && document.body && document.body.classList.contains('mode-player-portal') && typeof PLAYERS !== 'undefined' && PLAYERS.length > 0) {
    player = PLAYERS[0];
  }

  // 1. FLUXO DO JOGADOR: Transfere diretamente de/para a carteira pessoal do herói
  if (player) {
    const playerGold = player.gold !== undefined ? player.gold : ((player.coins && player.coins.gp) || 0);
    const stashGold = camp.partyStash.gold || 0;

    if (type === 'add') {
      const promptMsg = `[${player.name}] - Carteira: ${playerGold} PO\n\nQuantas Peças de Ouro (PO) deseja transferir da sua carteira para o Baú do Grupo?`;
      const valStr = prompt(promptMsg, String(Math.min(playerGold, 10)));
      if (valStr === null) return;
      const val = parseInt(valStr, 10);
      if (isNaN(val) || val <= 0) return;

      if (val > playerGold) {
        alert(`Saldo insuficiente! ${player.name} possui apenas ${playerGold} PO em sua carteira.`);
        return;
      }

      player.gold = playerGold - val;
      player.coins = player.coins || { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 };
      player.coins.gp = player.gold;

      camp.partyStash.gold = stashGold + val;
      const reason = prompt('Motivo / Observação do depósito:', 'Depósito no baú coletivo') || 'Depósito do Herói';

      camp.partyStash.history.push({
        date: new Date().toISOString().split('T')[0],
        text: `+${val} PO guardados por ${player.name} (${reason})`,
        type: 'gold_in'
      });

      if (typeof touchPlayer === 'function') touchPlayer(player);
      if (typeof addLog === 'function') addLog(`💰 <b>Baú do Grupo:</b> ${player.name} guardou ${val} PO. (Saldo do Herói: ${player.gold} PO | Baú: ${camp.partyStash.gold} PO)`);
    } else {
      // Retirada do baú para a carteira do herói
      const promptMsg = `[${player.name}] - Saldo no Baú: ${stashGold} PO\n\nQuantas Peças de Ouro (PO) deseja retirar do Baú do Grupo para a carteira de ${player.name}?`;
      const valStr = prompt(promptMsg, String(Math.min(stashGold, 10)));
      if (valStr === null) return;
      const val = parseInt(valStr, 10);
      if (isNaN(val) || val <= 0) return;

      if (val > stashGold) {
        alert(`Saldo insuficiente no Baú do Grupo! O baú possui apenas ${stashGold} PO.`);
        return;
      }

      camp.partyStash.gold = stashGold - val;
      player.gold = playerGold + val;
      player.coins = player.coins || { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 };
      player.coins.gp = player.gold;

      const reason = prompt('Motivo / Finalidade da retirada:', 'Gastos em suprimentos') || 'Retirada do Herói';

      camp.partyStash.history.push({
        date: new Date().toISOString().split('T')[0],
        text: `-${val} PO retirados por ${player.name} (${reason})`,
        type: 'gold_out'
      });

      if (typeof touchPlayer === 'function') touchPlayer(player);
      if (typeof addLog === 'function') addLog(`💰 <b>Baú do Grupo:</b> ${player.name} retirou ${val} PO. (Saldo do Herói: ${player.gold} PO | Baú: ${camp.partyStash.gold} PO)`);
    }
  } else {
    // 2. FLUXO DO MESTRE (DM): Injeção/gasto direto ou transferência de herói
    const promptMsg = type === 'add'
      ? 'Quantas Peças de Ouro (PO) deseja ADICIONAR ao Baú do Grupo (Tesouro da Campanha)?'
      : 'Quantas Peças de Ouro (PO) deseja RETIRAR do Baú do Grupo?';
    const valStr = prompt(promptMsg, '50');
    if (valStr === null) return;
    const val = parseInt(valStr, 10);
    if (isNaN(val) || val <= 0) return;

    const reason = prompt('Motivo / Origem da transação (ex: Recompensa de Masmorra, Compra de Carroça):', type === 'add' ? 'Recompensa de Masmorra' : 'Gastos da Mesa') || 'Transação do Mestre';

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
    if (typeof addLog === 'function') addLog(`💰 <b>Baú do Grupo:</b> ${type === 'add' ? '+' : '-'}${val} PO (${reason}). Saldo: ${camp.partyStash.gold} PO.`);
  }

  touchPartyStash(camp);
  saveCampaignsState();
  if (typeof saveToLocalStorage === 'function') saveToLocalStorage();
  renderCampaigns();
  renderPartyStashViewer();
  if (typeof updateAllPartyStashElements === 'function') updateAllPartyStashElements();
  if (typeof renderPlayers === 'function') renderPlayers();
  if (typeof syncLocalChangesToFirebase === 'function') syncLocalChangesToFirebase(true);
}

function splitPartyGold() {
  const camp = getActiveCampaign();
  if (!camp) return;
  camp.partyStash = camp.partyStash || { gold: 0, items: [], history: [] };
  camp.partyStash.items = camp.partyStash.items || [];
  camp.partyStash.history = camp.partyStash.history || [];

  const campPlayers = (camp.playerIds && camp.playerIds.length > 0 ? camp.playerIds.map(id => PLAYERS.find(p => String(p.id) === String(id))).filter(p => p) : PLAYERS) || [];

  if (campPlayers.length === 0) {
    alert('Nenhum herói disponível para receber a divisão de ouro.');
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
    p.coins = p.coins || { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 };
    p.coins.gp = (p.coins.gp || 0) + each;
    if (typeof touchPlayer === 'function') touchPlayer(p);
  });

  camp.partyStash.gold = remainder;
  camp.partyStash.history.push({
    date: new Date().toISOString().split('T')[0],
    text: `Divisão de ${currentGold} PO (${each} PO para cada um dos ${campPlayers.length} heróis)`,
    type: 'gold_out'
  });

  touchCampaign(camp);
  saveCampaignsState();
  if (typeof saveToLocalStorage === 'function') saveToLocalStorage();
  if (typeof syncLocalChangesToFirebase === 'function') syncLocalChangesToFirebase();
  renderCampaigns();
  renderPartyStashViewer();
  if (typeof renderPlayers === 'function') renderPlayers();
  if (typeof addLog === 'function') addLog(`💰 <b>Divisão de Tesouro:</b> ${each} PO distribuídos para cada um dos ${campPlayers.length} heróis. Sobra: ${remainder} PO.`);
}

// --- ITENS DO BAÚ ---
let currentEditItemId = null;

function openPartyItemModal(itemId = null) {
  const camp = getActiveCampaign();
  if (!camp) {
    alert('Nenhuma campanha ativa selecionada.');
    return;
  }

  currentEditItemId = itemId;
  const modal = document.getElementById('modal-party-item');
  if (!modal) return;

  const isEdit = !!itemId;
  const it = isEdit ? (camp.partyStash?.items || []).find(x => x.id === itemId) : null;
  const campPlayers = (camp.playerIds && camp.playerIds.length > 0 ? camp.playerIds.map(id => PLAYERS.find(p => String(p.id) === String(id))).filter(p => p) : PLAYERS) || [];

  const titleEl = document.getElementById('party-item-modal-title');
  if (titleEl) titleEl.innerText = isEdit ? '✏️ Editar Item do Grupo' : '➕ Adicionar Item ao Baú do Grupo';

  const nameEl = document.getElementById('inp-pitem-name');
  if (nameEl) nameEl.value = it ? it.name : '';

  const qtyEl = document.getElementById('inp-pitem-qty');
  if (qtyEl) qtyEl.value = it ? (it.qty || 1) : 1;

  const weightEl = document.getElementById('inp-pitem-weight');
  if (weightEl) weightEl.value = it ? (it.weight !== undefined ? it.weight : 0) : 0;

  const catEl = document.getElementById('inp-pitem-cat');
  if (catEl) catEl.value = it ? (it.category || 'Equipamento de Aventura') : 'Equipamento de Aventura';

  const descEl = document.getElementById('inp-pitem-desc');
  if (descEl) descEl.value = it ? (it.desc || '') : '';

  const selCarrier = document.getElementById('inp-pitem-carrier');
  if (selCarrier) {
    selCarrier.innerHTML = `
      <option value="Baú do Grupo" ${(!it || it.carrier === 'Baú do Grupo') ? 'selected' : ''}>Baú do Grupo</option>
      <option value="Mochila Coletiva" ${(it && it.carrier === 'Mochila Coletiva') ? 'selected' : ''}>Mochila Coletiva / Carroça</option>
      ${campPlayers.map(p => `
        <option value="${p.name}" ${(it && it.carrier === p.name) ? 'selected' : ''}>${p.name} (${p.student || 'Personagem'})</option>
      `).join('')}
    `;
  }

  modal.classList.add('open');
  setTimeout(() => {
    if (nameEl) nameEl.focus();
  }, 100);
}

function closePartyItemModal() {
  const modal = document.getElementById('modal-party-item');
  if (modal) modal.classList.remove('open');
}

function savePartyItem() {
  const camp = getActiveCampaign();
  if (!camp) {
    alert('Nenhuma campanha ativa selecionada.');
    return;
  }
  camp.partyStash = camp.partyStash || { gold: 0, items: [], history: [] };
  camp.partyStash.items = camp.partyStash.items || [];
  camp.partyStash.history = camp.partyStash.history || [];

  const nameInput = document.getElementById('inp-pitem-name');
  const name = nameInput ? nameInput.value.trim() : '';
  const qty = parseInt(document.getElementById('inp-pitem-qty')?.value) || 1;
  const weight = Math.max(0, parseFloat(document.getElementById('inp-pitem-weight')?.value) || 0);
  const category = document.getElementById('inp-pitem-cat')?.value || 'Equipamento de Aventura';
  const carrier = document.getElementById('inp-pitem-carrier')?.value || 'Baú do Grupo';
  const desc = document.getElementById('inp-pitem-desc')?.value?.trim() || '';

  if (!name) {
    alert('Por favor, informe o nome do item.');
    if (nameInput) nameInput.focus();
    return;
  }

  if (currentEditItemId) {
    const it = camp.partyStash.items.find(x => x.id === currentEditItemId);
    if (it) {
      it.name = name;
      it.qty = qty;
      it.weight = weight;
      it.category = category;
      it.carrier = carrier;
      it.desc = desc;
      camp.partyStash.history.push({
        date: new Date().toISOString().split('T')[0],
        text: `✏️ Item "${name}" atualizado (${qty}x, ${weight ? weight + 'kg, ' : ''}${carrier})`,
        type: 'item_edit'
      });
    }
  } else {
    camp.partyStash.items.push({
      id: 'it_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      name,
      qty,
      weight,
      category,
      carrier,
      desc
    });
    camp.partyStash.history.push({
      date: new Date().toISOString().split('T')[0],
      text: `+${qty}x ${name} adicionado (${weight ? weight + 'kg, ' : ''}${carrier})`,
      type: 'item_in'
    });
  }

  // Sincronização direta com a mochila do herói se um portador for indicado
  if (carrier && carrier !== 'Baú do Grupo' && carrier !== 'Mochila Coletiva' && typeof PLAYERS !== 'undefined') {
    const hero = PLAYERS.find(p => p.name.toLowerCase() === carrier.toLowerCase() || p.id === carrier);
    if (hero) {
      hero.inventory = hero.inventory || [];
      const existingHeroItem = hero.inventory.find(i => i.name.toLowerCase() === name.toLowerCase());
      if (existingHeroItem) {
        existingHeroItem.qty = Math.max(1, qty);
      } else {
        hero.inventory.push({
          name: name,
          qty: qty,
          equipped: false,
          weight: 0.5,
          desc: desc
        });
      }
      if (typeof touchPlayer === 'function') touchPlayer(hero);
      if (typeof renderPlayers === 'function') renderPlayers();
    }
  }

  touchPartyStash(camp);
  saveCampaignsState();
  if (typeof saveToLocalStorage === 'function') saveToLocalStorage();
  closePartyItemModal();
  renderCampaigns();
  renderPartyStashViewer();
  if (typeof updateAllPartyStashElements === 'function') updateAllPartyStashElements();
  if (typeof renderPlayers === 'function') renderPlayers();
  if (typeof syncLocalChangesToFirebase === 'function') syncLocalChangesToFirebase(true);
  if (typeof addLog === 'function') addLog(`🎒 <b>Baú do Grupo:</b> Item "${name}" (${qty}x) salvo com sucesso.`);
}

// Transferência direta da mochila do jogador para o Baú do Grupo
function sendPlayerItemToPartyStash(playerId, itemIdx, qty = null) {
  const p = (typeof PLAYERS !== 'undefined') ? PLAYERS.find(x => x.id === playerId) : null;
  if (!p || !p.inventory || !p.inventory[itemIdx]) return false;

  const item = p.inventory[itemIdx];
  const itemQty = parseInt(item.qty, 10) || 1;
  let transferQty = 1;

  if (qty !== null && !isNaN(parseInt(qty, 10))) {
    transferQty = parseInt(qty, 10);
  } else if (itemQty > 1) {
    const promptChoice = prompt(`Quantas unidades de "${item.name}" deseja guardar no Baú do Grupo?\n(Disponível na mochila: ${itemQty}x)`, '1');
    if (promptChoice === null) return false;
    transferQty = parseInt(promptChoice, 10);
  }

  if (isNaN(transferQty) || transferQty <= 0) transferQty = 1;
  if (transferQty > itemQty) transferQty = itemQty;

  const itemWeight = (item.weight !== undefined && !isNaN(parseFloat(item.weight))) ? parseFloat(item.weight) : 0;
  const itemCategory = item.category || 'Equipamento de Aventura';
  const itemDesc = item.desc || item.prop || '';

  // Remove ou subtrai da mochila do jogador
  if (itemQty <= transferQty) {
    p.inventory.splice(itemIdx, 1);
  } else {
    item.qty = itemQty - transferQty;
  }
  if (typeof touchPlayer === 'function') touchPlayer(p);

  // Adiciona ao Baú do Grupo da campanha ativa
  const camp = (typeof getActiveCampaign === 'function') ? getActiveCampaign() : null;
  if (camp) {
    addItemToPartyStash(item.name, transferQty, itemCategory, itemDesc, 'Baú do Grupo', itemWeight);
  }

  if (typeof saveToLocalStorage === 'function') saveToLocalStorage();
  if (typeof renderPlayers === 'function') renderPlayers();
  if (typeof renderPartyStashViewer === 'function') renderPartyStashViewer();
  if (typeof updateAllPartyStashElements === 'function') updateAllPartyStashElements();
  hasPendingPlayerStashSync = true;
  if (typeof syncLocalChangesToFirebase === 'function') syncLocalChangesToFirebase(true);

  if (typeof addLog === 'function') {
    addLog(`🎒 <b>${p.name}:</b> guardou ${transferQty}x "${item.name}" no Baú do Grupo.`);
  }
  return true;
}

function deletePartyItem(itemId) {
  const camp = getActiveCampaign();
  if (!camp || !camp.partyStash?.items) return;
  camp.partyStash.history = camp.partyStash.history || [];

  const it = camp.partyStash.items.find(x => x.id === itemId);
  if (!it) return;

  if (!confirm(`Remover "${it.name}" (${it.qty}x) do inventário do grupo?`)) return;

  const removedItemId = it.id;
  trackDeletedPartyItemId(removedItemId);
  camp.partyStash.items = camp.partyStash.items.filter(x => x.id !== removedItemId);
  touchPartyStash(camp);
  camp.partyStash.history.push({
    date: new Date().toISOString().split('T')[0],
    text: `-${it.qty}x ${it.name} removido do grupo`,
    type: 'item_out'
  });

  saveCampaignsState();
  if (typeof saveToLocalStorage === 'function') saveToLocalStorage();
  renderCampaigns();
  renderPartyStashViewer();
  if (typeof updateAllPartyStashElements === 'function') updateAllPartyStashElements();
  if (typeof renderPlayers === 'function') renderPlayers();
  if (typeof syncLocalChangesToFirebase === 'function') syncLocalChangesToFirebase(true);
  if (typeof addLog === 'function') addLog(`🗑️ <b>Baú do Grupo:</b> "${it.name}" removido.`);
}

// Função de utilidade para outros módulos (ex: Compêndio) adicionarem itens ao Baú com facilidade
function addItemToPartyStash(name, qty = 1, category = 'Equipamento de Aventura', desc = '', carrier = 'Baú do Grupo', weight = null) {
  const camp = getActiveCampaign();
  if (!camp) return false;
  camp.partyStash = camp.partyStash || { gold: 0, items: [], history: [] };
  camp.partyStash.items = camp.partyStash.items || [];
  camp.partyStash.history = camp.partyStash.history || [];

  let resolvedWeight = 0;
  if (weight !== null && weight !== undefined && !isNaN(parseFloat(weight))) {
    resolvedWeight = Math.max(0, parseFloat(weight));
  } else if (typeof EQUIPMENT_DATA !== 'undefined' && Array.isArray(EQUIPMENT_DATA)) {
    const eq = EQUIPMENT_DATA.find(e => e.name && e.name.toLowerCase() === (name || '').toLowerCase());
    if (eq && eq.weight) {
      const match = String(eq.weight).match(/([\d,.]+)/);
      if (match) resolvedWeight = parseFloat(match[1].replace(',', '.')) || 0;
    }
  }

  const existing = camp.partyStash.items.find(x => x.name.toLowerCase() === name.toLowerCase() && (x.carrier || 'Baú do Grupo') === carrier);
  if (existing) {
    existing.qty = (parseInt(existing.qty) || 0) + qty;
    if ((!existing.weight || existing.weight === 0) && resolvedWeight > 0) {
      existing.weight = resolvedWeight;
    }
  } else {
    camp.partyStash.items.push({
      id: 'it_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      name,
      qty,
      weight: resolvedWeight,
      category,
      carrier,
      desc
    });
  }

  camp.partyStash.history.push({
    date: new Date().toISOString().split('T')[0],
    text: `+${qty}x ${name} adicionado (${resolvedWeight ? resolvedWeight + 'kg, ' : ''}${carrier})`,
    type: 'item_in'
  });

  touchPartyStash(camp);
  saveCampaignsState();
  if (typeof saveToLocalStorage === 'function') saveToLocalStorage();
  renderCampaigns();
  renderPartyStashViewer();
  if (typeof updateAllPartyStashElements === 'function') updateAllPartyStashElements();
  if (typeof renderPlayers === 'function') renderPlayers();
  if (typeof syncLocalChangesToFirebase === 'function') syncLocalChangesToFirebase(true);
  if (typeof addLog === 'function') addLog(`🎒 <b>Baú do Grupo:</b> +${qty}x "${name}" guardado no baú coletivo.`);
  return true;
}

function updateAllPartyStashElements() {
  const camp = (typeof getActiveCampaign === 'function') ? getActiveCampaign() : null;
  const stash = (camp && camp.partyStash) ? camp.partyStash : { gold: 0, items: [], history: [] };
  const gold = stash.gold || 0;

  // 1. Ouro no modal do Baú
  const modalGold = document.getElementById('party-stash-modal-gold');
  if (modalGold) modalGold.innerText = `${gold} PO`;

  // 2. Ouro na aba de Campanhas do Mestre
  const masterGold = document.getElementById('stash-gold-amount');
  if (masterGold) masterGold.innerText = `${gold} PO`;

  // 3. Barra rápida do baú em todas as fichas dos jogadores (.stash-gold-pill)
  if (typeof document !== 'undefined') {
    document.querySelectorAll('.party-stash-quickbar .stash-gold-pill, .stash-gold-pill, .party-stash-quickbar b').forEach(el => {
      el.innerText = `${gold} PO`;
    });
  }

  // 4. Se o modal do baú estiver visível, atualiza a lista de itens e histórico reativamente
  const modal = (typeof document !== 'undefined') ? document.getElementById('modal-party-stash-view') : null;
  if (modal && (modal.classList.contains('open') || modal.classList.contains('active')) && typeof renderPartyStashViewer === 'function') {
    renderPartyStashViewer();
  }
}

// --- VISUALIZADOR MODAL DO BAÚ DO GRUPO (PARA JOGADORES E MESTRE) ---
function openPartyStashModal() {
  const modal = document.getElementById('modal-party-stash-view');
  if (modal) modal.classList.add('open');
  updateAllPartyStashElements();
  renderPartyStashViewer();
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

  const campPlayers = (camp.playerIds && camp.playerIds.length > 0 && typeof PLAYERS !== 'undefined'
    ? camp.playerIds.map(id => PLAYERS.find(p => String(p.id) === String(id))).filter(Boolean)
    : (typeof PLAYERS !== 'undefined' ? PLAYERS : [])) || [];

  populateStashCompendiumDatalist();
  populateQuickAddCarrierSelects(camp, campPlayers);
  renderStashSummaryToolbar(stash, 'modal-stash-summary-bar');

  const tbody = document.getElementById('party-stash-modal-tbody');
  if (tbody) {
    if (!stash.items || stash.items.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:20px; color:var(--text-muted);">O baú coletivo está vazio.</td></tr>`;
    } else {
      const filtered = filterPartyStashItems(stash.items);
      if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:16px; color:var(--text-muted);">Nenhum item encontrado para o filtro selecionado. <button type="button" class="btn-secondary" style="padding:2px 8px; font-size:10px; margin-left:6px;" onclick="setPartyStashCategoryFilter('all'); handlePartyStashSearch('');">Limpar Filtros</button></td></tr>`;
      } else {
        tbody.innerHTML = filtered.map(it => renderPartyStashItemRowHtml(it)).join('');
      }
    }
  }

  const histEl = document.getElementById('party-stash-modal-history');
  if (histEl) {
    const rawHist = (stash.history || []);
    const indexed = rawHist.map((h, i) => ({ ...h, origIdx: i }));
    const hist = indexed.slice(-12).reverse();
    if (hist.length === 0) {
      histEl.innerHTML = `<div style="color:var(--text-muted); font-size:11px; text-align:center;">Nenhuma movimentação registrada.</div>`;
    } else {
      histEl.innerHTML = hist.map(h => `
        <div class="stash-history-item ${h.type || 'gold_in'}" style="font-size:10.5px; padding:3px 6px; display: flex; justify-content: space-between; align-items: center; gap: 6px;">
          <span style="flex: 1;">${h.text}</span>
          <div style="display: flex; align-items: center; gap: 4px;">
            <span style="font-size:9px; color:var(--text-dim); white-space: nowrap;">${h.date || ''}</span>
            <button class="btn-secondary" style="padding: 1px 4px; font-size: 9px; color: #f87171; border-color: rgba(239, 68, 68, 0.2); line-height: 1;" onclick="deletePartyStashHistoryItem(${h.origIdx})" title="Excluir este registro">🗑️</button>
          </div>
        </div>
      `).join('');
    }
  }
}

function clearPartyStashHistory() {
  const camp = getActiveCampaign();
  if (!camp) return;
  camp.partyStash = camp.partyStash || { gold: 0, items: [], history: [] };
  if (!camp.partyStash.history || camp.partyStash.history.length === 0) {
    alert('O histórico de movimentações do baú já está vazio.');
    return;
  }
  if (!confirm('Deseja realmente limpar e resetar todo o histórico de movimentações do baú coletivo desta campanha?')) return;
  camp.partyStash.history = [];
  saveCampaignsState();
  if (typeof saveToLocalStorage === 'function') saveToLocalStorage();
  renderCampaigns();
  renderPartyStashViewer();
  if (typeof syncLocalChangesToFirebase === 'function') syncLocalChangesToFirebase();
  if (typeof addLog === 'function') addLog('🧹 <b>Baú do Grupo:</b> Histórico de movimentações resetado pelo mestre.');
}

function deletePartyStashHistoryItem(origIndex) {
  const camp = getActiveCampaign();
  if (!camp || !camp.partyStash || !Array.isArray(camp.partyStash.history)) return;
  const idx = parseInt(origIndex);
  if (isNaN(idx) || idx < 0 || idx >= camp.partyStash.history.length) return;

  const item = camp.partyStash.history[idx];
  const itemText = item ? item.text : 'registro';

  if (!confirm(`Excluir este registro do histórico?\n"${itemText}"`)) return;

  camp.partyStash.history.splice(idx, 1);
  saveCampaignsState();
  if (typeof saveToLocalStorage === 'function') saveToLocalStorage();
  renderCampaigns();
  renderPartyStashViewer();
  if (typeof syncLocalChangesToFirebase === 'function') syncLocalChangesToFirebase();
}

function takePartyItemToPlayer(itemId, targetPlayerId = null, qty = null) {
  const camp = getActiveCampaign();
  if (!camp || !camp.partyStash?.items) return;
  camp.partyStash.history = camp.partyStash.history || [];

  const it = camp.partyStash.items.find(x => x.id === itemId);
  if (!it) return;

  let targetPlayer = null;
  if (targetPlayerId) {
    targetPlayer = (typeof PLAYERS !== 'undefined') ? PLAYERS.find(p => p.id === targetPlayerId) : null;
  } else if (typeof activePortalPlayerId !== 'undefined' && activePortalPlayerId) {
    targetPlayer = (typeof PLAYERS !== 'undefined') ? PLAYERS.find(p => p.id === activePortalPlayerId) : null;
  } else if (typeof PLAYERS !== 'undefined' && PLAYERS.length === 1) {
    targetPlayer = PLAYERS[0];
  } else if (typeof PLAYERS !== 'undefined' && PLAYERS.length > 1) {
    const heroList = PLAYERS.map((p, i) => `${i + 1}. ${p.name} (${p.student || 'Personagem'})`).join('\n');
    const choice = prompt(`Para qual herói deseja transferir "${it.name}"?\nDigite o número correspondente:\n\n${heroList}`, '1');
    if (!choice) return;
    const idx = parseInt(choice, 10) - 1;
    if (idx >= 0 && idx < PLAYERS.length) {
      targetPlayer = PLAYERS[idx];
    } else {
      alert('Opção inválida.');
      return;
    }
  }

  if (!targetPlayer) {
    alert('Nenhum herói disponível para receber o item.');
    return;
  }

  const itQty = parseInt(it.qty, 10) || 1;
  let takeQty = 1;
  if (qty !== null && !isNaN(parseInt(qty, 10))) {
    takeQty = parseInt(qty, 10);
  } else if (itQty > 1) {
    const promptChoice = prompt(`Quantas unidades de "${it.name}" deseja transferir para a mochila de ${targetPlayer.name}?\n(Disponível no baú: ${itQty}x)`, '1');
    if (promptChoice === null) return;
    takeQty = parseInt(promptChoice, 10);
  }

  if (isNaN(takeQty) || takeQty <= 0) takeQty = 1;
  if (takeQty > itQty) takeQty = itQty;

  // Resolve peso preservado ou busca no catálogo canônico
  let resolvedWeight = (it.weight !== undefined && !isNaN(parseFloat(it.weight))) ? parseFloat(it.weight) : 0;
  if (resolvedWeight === 0 && typeof EQUIPMENT_DATA !== 'undefined' && Array.isArray(EQUIPMENT_DATA)) {
    const eq = EQUIPMENT_DATA.find(e => e.name && e.name.toLowerCase() === (it.name || '').toLowerCase());
    if (eq && eq.weight) {
      const match = String(eq.weight).match(/([\d,.]+)/);
      if (match) resolvedWeight = parseFloat(match[1].replace(',', '.')) || 0;
    }
  }

  targetPlayer.inventory = targetPlayer.inventory || [];
  const existing = targetPlayer.inventory.find(x => x.name.toLowerCase() === it.name.toLowerCase());
  if (existing) {
    existing.qty = (parseInt(existing.qty, 10) || 0) + takeQty;
    if ((!existing.weight || existing.weight === 0) && resolvedWeight > 0) {
      existing.weight = resolvedWeight;
    }
  } else {
    targetPlayer.inventory.push({
      name: it.name,
      qty: takeQty,
      equipped: false,
      weight: resolvedWeight,
      category: it.category || 'Equipamento de Aventura',
      desc: it.desc || ''
    });
  }

  if (itQty <= takeQty) {
    trackDeletedPartyItemId(itemId);
    camp.partyStash.items = camp.partyStash.items.filter(x => x.id !== itemId);
  } else {
    it.qty = itQty - takeQty;
  }

  touchCampaign(camp);
  touchPartyStash(camp);
  if (typeof touchPlayer === 'function') touchPlayer(targetPlayer);

  camp.partyStash.history.push({
    date: new Date().toISOString().split('T')[0],
    text: `${takeQty}x ${it.name} transferido para a mochila de ${targetPlayer.name}`,
    type: 'item_out'
  });

  saveCampaignsState();
  if (typeof saveToLocalStorage === 'function') saveToLocalStorage();
  renderPartyStashViewer();
  if (typeof renderCampaignPartyStash === 'function') {
    renderCampaignPartyStash(camp, (camp.playerIds || []).map(id => PLAYERS.find(p => String(p.id) === String(id))).filter(p => p));
  }
  if (typeof updateAllPartyStashElements === 'function') updateAllPartyStashElements();
  if (typeof renderPlayers === 'function') renderPlayers();
  if (typeof syncLocalChangesToFirebase === 'function') syncLocalChangesToFirebase(true);
  if (typeof addLog === 'function') addLog(`🎒 <b>Baú do Grupo:</b> ${takeQty}x "${it.name}" transferido para a mochila de <b>${targetPlayer.name}</b>.`);
}

// --- AÇÕES RÁPIDAS, STEPPERS, FILTROS E PRESETS DO BAÚ DO GRUPO (ISSUE-158) ---

function setPartyStashCategoryFilter(filterKey) {
  activePartyStashFilter = filterKey || 'all';
  const camp = getActiveCampaign();
  if (camp) {
    const campPlayers = (camp.playerIds && camp.playerIds.length > 0 && typeof PLAYERS !== 'undefined'
      ? camp.playerIds.map(id => PLAYERS.find(p => String(p.id) === String(id))).filter(Boolean)
      : (typeof PLAYERS !== 'undefined' ? PLAYERS : [])) || [];
    renderCampaignPartyStash(camp, campPlayers);
  }
  renderPartyStashViewer();
}

function handlePartyStashSearch(query) {
  activePartyStashSearch = query || '';
  const camp = getActiveCampaign();
  if (camp) {
    const campPlayers = (camp.playerIds && camp.playerIds.length > 0 && typeof PLAYERS !== 'undefined'
      ? camp.playerIds.map(id => PLAYERS.find(p => String(p.id) === String(id))).filter(Boolean)
      : (typeof PLAYERS !== 'undefined' ? PLAYERS : [])) || [];
    renderCampaignPartyStash(camp, campPlayers);
  }
  renderPartyStashViewer();
  if (typeof document !== 'undefined') {
    const activeEl = document.activeElement;
    if (!activeEl || !activeEl.classList || !activeEl.classList.contains('stash-search-input')) {
      const inputs = document.querySelectorAll('.stash-search-input');
      if (inputs.length > 0) {
        const inp = inputs[0];
        inp.focus();
        try { inp.setSelectionRange(inp.value.length, inp.value.length); } catch (e) {}
      }
    }
  }
}

function adjustPartyItemQty(itemId, delta) {
  const camp = getActiveCampaign();
  if (!camp || !camp.partyStash?.items) return false;
  camp.partyStash.history = camp.partyStash.history || [];

  const it = camp.partyStash.items.find(x => x.id === itemId);
  if (!it) return false;

  const d = parseInt(delta, 10) || 0;
  if (d === 0) return false;

  const oldQty = parseInt(it.qty, 10) || 1;
  const newQty = oldQty + d;

  if (newQty <= 0) {
    deletePartyItem(itemId);
    return true;
  }

  it.qty = newQty;

  // Se o item estiver com um herói, sincroniza também na mochila dele
  if (!isCarrierStash(it.carrier) && typeof PLAYERS !== 'undefined') {
    const hero = PLAYERS.find(p => p.name && p.name.toLowerCase() === String(it.carrier).toLowerCase());
    if (hero && Array.isArray(hero.inventory)) {
      const heroItem = hero.inventory.find(i => i.name && i.name.toLowerCase() === String(it.name).toLowerCase());
      if (heroItem) {
        heroItem.qty = newQty;
        if (typeof touchPlayer === 'function') touchPlayer(hero);
      }
    }
  }

  camp.partyStash.history.push({
    date: new Date().toISOString().split('T')[0],
    text: `${d > 0 ? '+' + d : d}x ${it.name} (${newQty}x restantes em ${it.carrier || 'Baú do Grupo'})`,
    type: d > 0 ? 'item_in' : 'item_out'
  });

  touchPartyStash(camp);
  saveCampaignsState();
  if (typeof saveToLocalStorage === 'function') saveToLocalStorage();
  renderCampaigns();
  renderPartyStashViewer();
  if (typeof updateAllPartyStashElements === 'function') updateAllPartyStashElements();
  if (typeof renderPlayers === 'function') renderPlayers();
  if (typeof syncLocalChangesToFirebase === 'function') syncLocalChangesToFirebase(true);
  return true;
}

function returnPartyItemToStash(itemId) {
  const camp = getActiveCampaign();
  if (!camp || !camp.partyStash?.items) return false;
  camp.partyStash.history = camp.partyStash.history || [];

  const it = camp.partyStash.items.find(x => x.id === itemId);
  if (!it) return false;

  const prevCarrier = it.carrier || 'Herói';
  if (isCarrierStash(prevCarrier)) return false;

  // Remove ou subtrai da mochila pessoal do herói se existir lá
  if (typeof PLAYERS !== 'undefined') {
    const hero = PLAYERS.find(p => p.name && p.name.toLowerCase() === String(prevCarrier).toLowerCase());
    if (hero && Array.isArray(hero.inventory)) {
      const idx = hero.inventory.findIndex(i => i.name && i.name.toLowerCase() === String(it.name).toLowerCase());
      if (idx !== -1) {
        const hQty = parseInt(hero.inventory[idx].qty, 10) || 1;
        const itQty = parseInt(it.qty, 10) || 1;
        if (hQty <= itQty) {
          hero.inventory.splice(idx, 1);
        } else {
          hero.inventory[idx].qty = hQty - itQty;
        }
        if (typeof touchPlayer === 'function') touchPlayer(hero);
      }
    }
  }

  // Verifica se já existe o mesmo item no Baú do Grupo para mesclar quantidade
  const existingInStash = camp.partyStash.items.find(x => x.id !== it.id && x.name.toLowerCase() === it.name.toLowerCase() && isCarrierStash(x.carrier));
  const movedQty = parseInt(it.qty, 10) || 1;
  if (existingInStash) {
    existingInStash.qty = (parseInt(existingInStash.qty, 10) || 1) + movedQty;
    trackDeletedPartyItemId(it.id);
    camp.partyStash.items = camp.partyStash.items.filter(x => x.id !== it.id);
  } else {
    it.carrier = 'Baú do Grupo';
  }

  camp.partyStash.history.push({
    date: new Date().toISOString().split('T')[0],
    text: `🔄 ${movedQty}x ${it.name} devolvido de ${prevCarrier} para o Baú do Grupo`,
    type: 'item_in'
  });

  touchPartyStash(camp);
  saveCampaignsState();
  if (typeof saveToLocalStorage === 'function') saveToLocalStorage();
  renderCampaigns();
  renderPartyStashViewer();
  if (typeof updateAllPartyStashElements === 'function') updateAllPartyStashElements();
  if (typeof renderPlayers === 'function') renderPlayers();
  if (typeof syncLocalChangesToFirebase === 'function') syncLocalChangesToFirebase(true);
  if (typeof addLog === 'function') addLog(`📦 <b>Baú do Grupo:</b> ${movedQty}x "${it.name}" devolvido por <b>${prevCarrier}</b> ao Baú.`);
  return true;
}

function lookupCompendiumEquipmentMeta(rawName) {
  const clean = String(rawName || '').trim().toLowerCase();
  if (!clean) return null;

  const presetMap = {
    'poção de cura menor (2d4+2)': { category: 'Poções', weight: 0.25, desc: 'Recupera 2d4 + 2 PV ao beber (1 Ação Bônus / Ação).' },
    'poção de cura maior (4d4+4)': { category: 'Poções', weight: 0.25, desc: 'Recupera 4d4 + 4 PV ao beber.' },
    'ração de viagem (1 dia)': { category: 'Equipamento de Aventura', weight: 1, desc: 'Alimento seco de viagem para 1 dia.' },
    'tocha': { category: 'Equipamento de Aventura', weight: 0.5, desc: 'Ilumina 6m luz plena + 6m penumbra por 1 hora.' },
    'flechas (20)': { category: 'Armas', weight: 0.5, desc: 'Aljava com 20 flechas para arcos.' },
    'virotes de besta (20)': { category: 'Armas', weight: 0.75, desc: 'Estojo com 20 virotes para bestas.' },
    'objeto de arte (25 po)': { category: 'Tesouros & Gemas', weight: 0.2, desc: 'Cálice de prata, estatueta ou joia fina avaliada em 25 PO.' },
    'gema preciosa (50 po)': { category: 'Tesouros & Gemas', weight: 0.05, desc: 'Pedra preciosa lapidada avaliada em 50 PO.' },
    'pergaminho mágico (1º círculo)': { category: 'Documentos & Pistas', weight: 0.05, desc: 'Pergaminho contendo magia de 1º círculo.' },
    'pergaminho mágico (2º círculo)': { category: 'Documentos & Pistas', weight: 0.05, desc: 'Pergaminho contendo magia de 2º círculo.' },
    'kit de curandeiro': { category: 'Ferramentas', weight: 1.5, desc: '10 usos para estabilizar criaturas a 0 PV sem teste.' },
    'ferramentas de ladrão': { category: 'Ferramentas', weight: 0.5, desc: 'Gazuas e limas para abrir fechaduras e desarmar armadilhas.' }
  };

  if (presetMap[clean]) return presetMap[clean];

  if (typeof EQUIPMENT_DATA !== 'undefined' && Array.isArray(EQUIPMENT_DATA)) {
    const eq = EQUIPMENT_DATA.find(e => e.name && e.name.toLowerCase() === clean);
    if (eq) {
      let weight = 0;
      if (eq.weight) {
        const match = String(eq.weight).match(/([\d,.]+)/);
        if (match) weight = parseFloat(match[1].replace(',', '.')) || 0;
      }
      let category = 'Equipamento de Aventura';
      const eqCat = String(eq.category || '').toLowerCase();
      const eqName = String(eq.name || '').toLowerCase();
      if (eqName.includes('poção') || eqName.includes('pocao') || eqName.includes('antídoto')) category = 'Poções';
      else if (eqCat.includes('arma') && !eqCat.includes('armadura')) category = 'Armas';
      else if (eqCat.includes('armadura') || eqCat.includes('escudo')) category = 'Armaduras';
      else if (eqCat.includes('ferramenta') || eqCat.includes('kit')) category = 'Ferramentas';
      else if (eqName.includes('pergaminho') || eqName.includes('livro') || eqName.includes('mapa')) category = 'Documentos & Pistas';
      else if (eqName.includes('gema') || eqName.includes('joia') || eqName.includes('arte')) category = 'Tesouros & Gemas';

      const descParts = [];
      if (eq.damage && eq.damage !== '-') descParts.push(`Dano: ${eq.damage}`);
      if (eq.ac && eq.ac !== '-') descParts.push(`CA: ${eq.ac}`);
      if (eq.prop && eq.prop !== '-') descParts.push(eq.prop);
      if (eq.cost) descParts.push(`Custo: ${eq.cost}`);

      return { category, weight, desc: descParts.join(' • ') };
    }
  }

  // Inferência inteligente por palavras-chave no nome
  if (clean.includes('poção') || clean.includes('pocao') || clean.includes('elixir')) {
    return { category: 'Poções', weight: 0.25, desc: '' };
  }
  if (clean.includes('pergaminho') || clean.includes('mapa') || clean.includes('carta') || clean.includes('diário')) {
    return { category: 'Documentos & Pistas', weight: 0.05, desc: '' };
  }
  if (clean.includes('arte') || clean.includes('gema') || clean.includes('rubi') || clean.includes('diamante') || clean.includes('colar') || clean.includes('coroa')) {
    return { category: 'Tesouros & Gemas', weight: 0.1, desc: '' };
  }
  if (clean.includes('espada') || clean.includes('machado') || clean.includes('arco') || clean.includes('adaga') || clean.includes('lança') || clean.includes('flecha')) {
    return { category: 'Armas', weight: 1.0, desc: '' };
  }
  if (clean.includes('armadura') || clean.includes('escudo') || clean.includes('cota')) {
    return { category: 'Armaduras', weight: 5.0, desc: '' };
  }
  return null;
}

function onQuickAddStashNameInput(val, context = 'camp') {
  if (typeof document === 'undefined') return;
  const meta = lookupCompendiumEquipmentMeta(val);
  if (!meta) return;
  const selId = context === 'modal' ? 'sel-qadd-modal-cat' : 'sel-qadd-stash-cat';
  const selEl = document.getElementById(selId);
  if (selEl && meta.category) {
    selEl.value = meta.category;
  }
}

function onModalPartyItemNameInput(val) {
  if (typeof document === 'undefined') return;
  const meta = lookupCompendiumEquipmentMeta(val);
  if (!meta) return;
  const catEl = document.getElementById('inp-pitem-cat');
  const weightEl = document.getElementById('inp-pitem-weight');
  const descEl = document.getElementById('inp-pitem-desc');
  if (catEl && meta.category) catEl.value = meta.category;
  if (weightEl && (!weightEl.value || parseFloat(weightEl.value) === 0) && meta.weight) {
    weightEl.value = meta.weight;
  }
  if (descEl && !descEl.value && meta.desc) {
    descEl.value = meta.desc;
  }
}

function submitQuickAddPartyItem(context = 'camp') {
  const isModal = context === 'modal';
  const nameEl = document.getElementById(isModal ? 'inp-qadd-modal-name' : 'inp-qadd-stash-name');
  const qtyEl = document.getElementById(isModal ? 'inp-qadd-modal-qty' : 'inp-qadd-stash-qty');
  const catEl = document.getElementById(isModal ? 'sel-qadd-modal-cat' : 'sel-qadd-stash-cat');
  const carrierEl = document.getElementById(isModal ? 'sel-qadd-modal-carrier' : 'sel-qadd-stash-carrier');

  const name = nameEl ? nameEl.value.trim() : '';
  if (!name) {
    if (nameEl) nameEl.focus();
    return false;
  }

  const qty = Math.max(1, parseInt(qtyEl ? qtyEl.value : '1', 10) || 1);
  const meta = lookupCompendiumEquipmentMeta(name);
  const category = (catEl && catEl.value) ? catEl.value : (meta?.category || 'Equipamento de Aventura');
  const carrier = (carrierEl && carrierEl.value) ? carrierEl.value : 'Baú do Grupo';
  const weight = meta?.weight !== undefined ? meta.weight : null;
  const desc = meta?.desc || '';

  const added = addItemToPartyStash(name, qty, category, desc, carrier, weight);
  if (!added) return false;

  // Se o destino já for diretamente um herói, sincroniza também na ficha do herói
  if (!isCarrierStash(carrier) && typeof PLAYERS !== 'undefined') {
    const hero = PLAYERS.find(p => p.name && p.name.toLowerCase() === String(carrier).toLowerCase());
    if (hero) {
      hero.inventory = hero.inventory || [];
      const existingHeroItem = hero.inventory.find(i => i.name && i.name.toLowerCase() === name.toLowerCase());
      if (existingHeroItem) {
        existingHeroItem.qty = (parseInt(existingHeroItem.qty, 10) || 0) + qty;
      } else {
        hero.inventory.push({
          name,
          qty,
          equipped: false,
          weight: weight || 0.5,
          category,
          desc
        });
      }
      if (typeof touchPlayer === 'function') touchPlayer(hero);
      if (typeof saveToLocalStorage === 'function') saveToLocalStorage();
      if (typeof renderPlayers === 'function') renderPlayers();
    }
  }

  if (nameEl) nameEl.value = '';
  if (qtyEl) qtyEl.value = '1';
  return true;
}

function quickAddPresetPartyItem(presetKey) {
  const presets = {
    'potion_heal': {
      name: 'Poção de Cura Menor',
      qty: 1,
      category: 'Poções',
      weight: 0.25,
      desc: 'Recupera 2d4 + 2 PV ao beber.'
    },
    'rations_5': {
      name: 'Ração de Viagem (1 dia)',
      qty: 5,
      category: 'Equipamento de Aventura',
      weight: 1,
      desc: 'Alimento seco para viagem.'
    },
    'torches_5': {
      name: 'Tocha',
      qty: 5,
      category: 'Equipamento de Aventura',
      weight: 0.5,
      desc: 'Luz plena 6m + penumbra 6m por 1h.'
    },
    'arrows_20': {
      name: 'Flechas',
      qty: 20,
      category: 'Armas',
      weight: 0.05,
      desc: 'Munição para arcos curtos e longos.'
    },
    'art_25gp': {
      name: 'Objeto de Arte (25 PO)',
      qty: 1,
      category: 'Tesouros & Gemas',
      weight: 0.2,
      desc: 'Tesouro artístico avaliado em 25 PO.'
    },
    'scroll_lvl1': {
      name: 'Pergaminho Mágico (1º Círculo)',
      qty: 1,
      category: 'Documentos & Pistas',
      weight: 0.05,
      desc: 'Pergaminho de magia de 1º círculo.'
    },
    'healer_kit': {
      name: 'Kit de Curandeiro',
      qty: 1,
      category: 'Ferramentas',
      weight: 1.5,
      desc: '10 usos para estabilizar aliados a 0 PV.'
    }
  };

  const p = presets[presetKey];
  if (!p) return false;

  const carrierEl = (typeof document !== 'undefined') ? document.getElementById('sel-qadd-stash-carrier') : null;
  const carrier = (carrierEl && carrierEl.value) ? carrierEl.value : 'Baú do Grupo';

  return addItemToPartyStash(p.name, p.qty, p.category, p.desc, carrier, p.weight);
}

function quickAdjustPartyGold(delta, customReason = null) {
  const camp = getActiveCampaign();
  if (!camp) return false;
  camp.partyStash = camp.partyStash || { gold: 0, items: [], history: [] };
  camp.partyStash.items = camp.partyStash.items || [];
  camp.partyStash.history = camp.partyStash.history || [];

  const d = parseInt(delta, 10);
  if (isNaN(d) || d === 0) return false;

  const curGold = parseInt(camp.partyStash.gold, 10) || 0;
  if (d > 0) {
    camp.partyStash.gold = curGold + d;
    const reason = customReason || 'Tesouro / Saque Rápido';
    camp.partyStash.history.push({
      date: new Date().toISOString().split('T')[0],
      text: `+${d} PO (${reason})`,
      type: 'gold_in'
    });
  } else {
    const absD = Math.abs(d);
    const actualDeducted = Math.min(curGold, absD);
    if (actualDeducted <= 0 && curGold === 0) return false;
    camp.partyStash.gold = Math.max(0, curGold - absD);
    const reason = customReason || 'Despesa / Suprimentos do Grupo';
    camp.partyStash.history.push({
      date: new Date().toISOString().split('T')[0],
      text: `-${actualDeducted} PO (${reason})`,
      type: 'gold_out'
    });
  }

  touchPartyStash(camp);
  saveCampaignsState();
  if (typeof saveToLocalStorage === 'function') saveToLocalStorage();
  renderCampaigns();
  renderPartyStashViewer();
  if (typeof updateAllPartyStashElements === 'function') updateAllPartyStashElements();
  if (typeof renderPlayers === 'function') renderPlayers();
  if (typeof syncLocalChangesToFirebase === 'function') syncLocalChangesToFirebase(true);
  if (typeof addLog === 'function') {
    addLog(`💰 <b>Baú do Grupo:</b> ${d > 0 ? '+' + d : d} PO (${customReason || (d > 0 ? 'Tesouro' : 'Despesa')}). Saldo: ${camp.partyStash.gold} PO.`);
  }
  return true;
}

function submitInlinePartyGold() {
  if (typeof document === 'undefined') return false;
  const inp = document.getElementById('inp-quick-stash-gold');
  if (!inp) return false;
  const raw = inp.value.trim();
  if (!raw) return false;
  const val = parseInt(raw, 10);
  if (isNaN(val) || val === 0) return false;
  const ok = quickAdjustPartyGold(val, val > 0 ? 'Ajuste Rápido de Tesouro' : 'Gasto Rápido do Grupo');
  if (ok) inp.value = '';
  return ok;
}

// --- GERADOR OFICIAL DE SAQUE E TESOUROS (GUIA DO MESTRE CAP. 7 - ISSUE-159) ---

function getDmgTablesSafe() {
  if (typeof DMG_TREASURE_TABLES !== 'undefined' && DMG_TREASURE_TABLES) return DMG_TREASURE_TABLES;
  return {
    gems: {
      10: [{ name: 'Azurita (Gema 10 PO)', desc: 'Pedra azul escuro mosqueado opaco (10 PO)' }],
      50: [{ name: 'Pedra de Sangue (Gema 50 PO)', desc: 'Cinza escuro com manchas vermelhas (50 PO)' }],
      100: [{ name: 'Ametista (Gema 100 PO)', desc: 'Cristal púrpura profundo (100 PO)' }]
    },
    artObjects: {
      25: [{ name: 'Jarro de Prata Trabalhado (25 PO)', desc: 'Objeto de arte de 25 PO' }],
      250: [{ name: 'Cálice de Prata com Pedras da Lua (250 PO)', desc: 'Objeto de arte de 250 PO' }]
    },
    magicItems: {
      minor: [{ name: 'Poção de Cura Menor', category: 'Poções', weight: 0.25, desc: 'Recupera 2d4 + 2 PV.' }],
      uncommon: [{ name: 'Arma +1', category: 'Armas', weight: 1.5, desc: '+1 ataque e dano.' }],
      rare: [{ name: 'Espada Língua Flamejante', category: 'Armas', weight: 1.5, desc: '+2d6 fogo.' }]
    }
  };
}

function rollDmgGemToStash(tierValue = 50, qty = 1) {
  const tables = getDmgTablesSafe();
  const pool = tables.gems[tierValue] || tables.gems[50] || tables.gems[10];
  if (!pool || pool.length === 0) return null;
  const picked = pool[Math.floor(Math.random() * pool.length)];
  const carrierEl = (typeof document !== 'undefined') ? document.getElementById('sel-qadd-stash-carrier') : null;
  const carrier = (carrierEl && carrierEl.value) ? carrierEl.value : 'Baú do Grupo';
  addItemToPartyStash(picked.name, Math.max(1, parseInt(qty, 10) || 1), 'Tesouros & Gemas', picked.desc, carrier, 0.01);
  return picked;
}

function rollDmgArtToStash(tierValue = 25, qty = 1) {
  const tables = getDmgTablesSafe();
  const pool = tables.artObjects[tierValue] || tables.artObjects[25];
  if (!pool || pool.length === 0) return null;
  const picked = pool[Math.floor(Math.random() * pool.length)];
  const carrierEl = (typeof document !== 'undefined') ? document.getElementById('sel-qadd-stash-carrier') : null;
  const carrier = (carrierEl && carrierEl.value) ? carrierEl.value : 'Baú do Grupo';
  addItemToPartyStash(picked.name, Math.max(1, parseInt(qty, 10) || 1), 'Tesouros & Gemas', picked.desc, carrier, 0.3);
  return picked;
}

function rollDmgMagicItemToStash(rarity = 'uncommon') {
  const tables = getDmgTablesSafe();
  const pool = tables.magicItems[rarity] || tables.magicItems.uncommon || tables.magicItems.minor;
  if (!pool || pool.length === 0) return null;
  const picked = pool[Math.floor(Math.random() * pool.length)];
  const carrierEl = (typeof document !== 'undefined') ? document.getElementById('sel-qadd-stash-carrier') : null;
  const carrier = (carrierEl && carrierEl.value) ? carrierEl.value : 'Baú do Grupo';
  addItemToPartyStash(picked.name, 1, picked.category || 'Itens Mágicos', picked.desc, carrier, picked.weight || 0.5);
  return picked;
}

function rollDmgTreasureHoardToStash(crTier = '0-4') {
  const camp = getActiveCampaign();
  if (!camp) return null;

  const rollDiceSum = (count, sides) => {
    let s = 0;
    for (let i = 0; i < count; i++) s += Math.floor(Math.random() * sides) + 1;
    return s;
  };

  let goldAdded = 0;
  let gemsOrArt = null;
  let magicAdded = [];

  if (crTier === '5-10') {
    // DMG Hoard CR 5-10 convertida para PO equivalentes + objetos de arte/gemas + 1d3 itens mágicos
    goldAdded = (rollDiceSum(6, 6) * 100) + (rollDiceSum(3, 6) * 10);
    const countArt = rollDiceSum(2, 4);
    gemsOrArt = rollDmgArtToStash(25, countArt);
    const mCount = Math.floor(Math.random() * 2) + 1;
    for (let i = 0; i < mCount; i++) {
      const m = rollDmgMagicItemToStash(i === 0 ? 'uncommon' : 'minor');
      if (m) magicAdded.push(m.name);
    }
  } else {
    // DMG Hoard CR 0-4: moedas convertidas em PO (~80 a 220 PO) + 2d6 gemas de 10/50 PO ou objetos de arte de 25 PO + 1 item mágico
    goldAdded = (rollDiceSum(2, 6) * 10) + rollDiceSum(6, 6);
    const countGems = rollDiceSum(1, 4);
    gemsOrArt = Math.random() < 0.5 ? rollDmgGemToStash(50, countGems) : rollDmgArtToStash(25, countGems);
    const m = rollDmgMagicItemToStash('minor');
    if (m) magicAdded.push(m.name);
  }

  quickAdjustPartyGold(goldAdded, `Pilha de Tesouro DMG (ND ${crTier})`);
  return { crTier, goldAdded, gemsOrArt, magicAdded };
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
    if (document.activeElement !== textarea) {
      textarea.value = camp.dmNotes || '';
    }
    if (countEl) countEl.innerText = `${(textarea.value || '').length} caracteres`;
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
    try {
      localStorage.setItem('dnd_tracker_dm_notes_v3', textarea.value);
    } catch(e) {}
    saveCampaignsState();
    if (typeof syncLocalChangesToFirebase === 'function') {
      syncLocalChangesToFirebase();
    }
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

// ==========================================================================
// 🏰 SISTEMA DE BASTIÃO COLETIVO DO GRUPO (D&D 2024 / 5.5 EM PO - ISSUE-118)
// ==========================================================================

let currentBastionLevelFilter = 'all';
let selectedBastionCampaignId = null;

function getSelectedBastionCampaign() {
  if (selectedBastionCampaignId && CAMPAIGNS_STATE && Array.isArray(CAMPAIGNS_STATE.campaigns)) {
    const found = CAMPAIGNS_STATE.campaigns.find(c => c.id === selectedBastionCampaignId);
    if (found) return found;
  }
  return getActiveCampaign();
}

function switchBastionCampaign(campId) {
  if (campId) {
    selectedBastionCampaignId = campId;
  }
  renderBastionsTab(selectedBastionCampaignId);
}

function renderBastionsTab(targetCampId = null) {
  if (targetCampId) {
    selectedBastionCampaignId = targetCampId;
  }
  const camp = getSelectedBastionCampaign();
  if (!camp) return;

  selectedBastionCampaignId = camp.id;

  // Atualiza seletor de campanhas na aba de Bastiões
  const selCamp = document.getElementById('sel-bastion-active-campaign');
  if (selCamp && CAMPAIGNS_STATE && Array.isArray(CAMPAIGNS_STATE.campaigns)) {
    selCamp.innerHTML = CAMPAIGNS_STATE.campaigns.map(c => `
      <option value="${c.id}" ${c.id === camp.id ? 'selected' : ''}>${c.name} (${c.bastion?.name || 'Bastião'})</option>
    `).join('');
  }

  const bastion = getCampaignBastion(camp);
  const wallOpt = (typeof BASTION_WALL_OPTIONS !== 'undefined') ? BASTION_WALL_OPTIONS[bastion.walls || 'none'] : { name: 'Sem Muralhas', defenseDice: 6 };
  const goldAmount = camp.partyStash ? (camp.partyStash.gold || 0) : 0;
  const bank = getBastionBank(bastion);

  // Atualiza badges do topo da aba
  const lvlBadge = document.getElementById('bastion-tab-lvl-badge');
  const turnBadge = document.getElementById('bastion-tab-turn-badge');
  const defBadge = document.getElementById('bastion-tab-def-badge');
  const wallBadge = document.getElementById('bastion-tab-wall-badge');
  const goldBadge = document.getElementById('bastion-tab-gold-badge');
  const bankBadge = document.getElementById('bastion-tab-bank-badge');

  if (lvlBadge) lvlBadge.innerText = `⭐ Nível ${bastion.level || 5}`;
  if (turnBadge) turnBadge.innerText = `⏳ Semana ${bastion.turnCount || 1}`;
  if (defBadge) defBadge.innerText = `🛡️ ${bastion.defenders || 0} Defensores`;
  if (wallBadge) wallBadge.innerText = `🧱 ${wallOpt ? wallOpt.name : 'Muralhas'}`;
  if (goldBadge) goldBadge.innerText = `💰 Baú: ${goldAmount} PO`;
  if (bankBadge) bankBadge.innerText = `🏦 Cofre: ${bank.gold || 0} PO`;

  // Renderiza corpo da fortaleza no container principal da aba #bastion-view-container
  const campPlayers = getCampaignPlayers(camp);
  renderCampaignBastion(camp, campPlayers, 'bastion-view-container');
}

function promptEditBastionInfo() {
  const camp = getSelectedBastionCampaign();
  if (!camp) return;
  const bastion = getCampaignBastion(camp);
  if (!bastion) return;

  const newName = prompt(`Nome da Fortaleza / Bastião (${camp.name}):`, bastion.name || '');
  if (newName === null) return;
  const trimmedName = newName.trim();
  if (trimmedName) bastion.name = trimmedName;

  const newLoc = prompt(`Localização geográfica do Bastião:`, bastion.location || '');
  if (newLoc !== null) {
    bastion.location = newLoc.trim() || 'Fronteiras da Campanha';
  }

  touchCampaign(camp);
  saveCampaignsState();
  if (typeof saveToLocalStorage === 'function') saveToLocalStorage();

  renderBastionsTab(camp.id);
  renderCampaigns();
  if (typeof addLog === 'function') addLog(`🏰 <b>Bastião:</b> Informações da fortaleza atualizadas para "${bastion.name}".`);
}

function getBastionBank(bastion) {
  if (!bastion) return { gold: 0, history: [] };
  bastion.bank = bastion.bank || { gold: 0, history: [] };
  bastion.bank.gold = parseInt(bastion.bank.gold, 10) || 0;
  bastion.bank.history = Array.isArray(bastion.bank.history) ? bastion.bank.history : [];
  return bastion.bank;
}

function getBastionStaff(bastion) {
  if (!bastion) return [];
  bastion.staff = Array.isArray(bastion.staff) ? bastion.staff : [];
  return bastion.staff;
}

function getCampaignBastion(camp) {
  if (!camp) return null;
  if (!camp.bastion) {
    const defaultOwnerId = (camp.playerIds && camp.playerIds.length > 0) ? camp.playerIds[0] : "";
    const secondOwnerId = (camp.playerIds && camp.playerIds.length > 1) ? camp.playerIds[1] : defaultOwnerId;
    camp.bastion = {
      name: "Fortaleza de " + (camp.name || "Aventureiros"),
      location: "Fronteiras da Campanha",
      level: 5,
      turnCount: 1,
      walls: "none",
      defenders: 4,
      bank: { gold: 0, history: [] },
      staff: [],
      specialFacilities: [
        {
          id: "fac_" + Date.now() + "_ws",
          key: "workshop",
          name: "Oficina de Artesanato",
          patronId: defaultOwnerId,
          managerNpcId: null,
          managerNpcName: null,
          managerNpcRole: null,
          currentOrder: null,
          status: "active"
        },
        {
          id: "fac_" + (Date.now() + 1) + "_gd",
          key: "garden",
          name: "Jardim de Ervas",
          patronId: secondOwnerId,
          managerNpcId: null,
          managerNpcName: null,
          managerNpcRole: null,
          currentOrder: null,
          status: "active"
        }
      ],
      activeBuffs: [],
      history: [
        {
          turn: 1,
          date: new Date().toISOString().split('T')[0],
          title: "Fundação do Bastião",
          desc: "O grupo adquiriu a posse da fortaleza conjunta como base permanente de operações."
        }
      ]
    };
    touchCampaign(camp);
    saveCampaignsState();
  }
  if (!camp.bastion.bank) camp.bastion.bank = { gold: 0, history: [] };
  if (!Array.isArray(camp.bastion.staff)) camp.bastion.staff = [];
  return camp.bastion;
}

function renderCampaignBastion(camp, campPlayers, targetContainerId = null) {
  const containerId = targetContainerId || 'campaign-bastion-container';
  const container = document.getElementById(containerId);
  if (!container || !camp) return;

  const bastion = getCampaignBastion(camp);
  if (!bastion) return;

  const wallOpt = (typeof BASTION_WALL_OPTIONS !== 'undefined') ? BASTION_WALL_OPTIONS[bastion.walls || 'none'] : { name: 'Sem Muralhas', defenseDice: 6 };
  const goldAmount = camp.partyStash ? (camp.partyStash.gold || 0) : 0;
  const lastEvent = bastion.history && bastion.history.length > 0 ? bastion.history[bastion.history.length - 1] : null;

  let html = `
    <div class="bastion-panel-card">
      <div class="bastion-header-bar">
        <div>
          <div class="bastion-title-wrap">
            <span style="font-size: 24px;">🏰</span>
            <div>
              <div class="bastion-title-text">${bastion.name}</div>
              <div style="font-size: 11px; color: #cbd5e1; margin-top: 2px;">📍 ${bastion.location} • Base Conjunta da Campanha</div>
            </div>
          </div>
        </div>
        <div class="bastion-badges-row">
          <span class="bastion-stat-pill bastion-stat-pill-lvl" title="Nível do Bastião desbloqueia novas instalações">⭐ Nível ${bastion.level || 5}</span>
          <span class="bastion-stat-pill" style="border-color: #64748b; color: #e2e8f0;" title="Turno semanal de gestão">⏳ Semana ${bastion.turnCount || 1}</span>
          <span class="bastion-stat-pill bastion-stat-pill-def" title="Defensores da guarnição permanente">🛡️ ${bastion.defenders || 0} Defensores</span>
          <span class="bastion-stat-pill" style="border-color: #f59e0b; color: #fef08a;" title="Status das muralhas">🧱 ${wallOpt ? wallOpt.name : 'Muralhas'}</span>
          <span class="bastion-stat-pill bastion-stat-pill-gold" title="Ouro total disponível no Baú do Grupo">💰 Baú: ${goldAmount} PO</span>
        </div>
      </div>

      <!-- Barra de Ações Principais do Bastião -->
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; background: rgba(0,0,0,0.25); padding: 8px 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08);">
        <div style="display: flex; gap: 6px; flex-wrap: wrap;">
          <button type="button" class="btn-action" style="font-size: 12px; font-weight: 800; background: linear-gradient(135deg, #10b981, #059669); color: #fff;" onclick="openBastionActionModal()">
            ➕ Emitir Ordem no Bastião
          </button>
          <button type="button" class="btn-secondary" style="font-size: 11px;" onclick="openBastionAddFacilityModal()">
            🏗️ Adicionar Instalação Especial
          </button>
          <button type="button" class="btn-secondary" style="font-size: 11px; color: #38bdf8; border-color: rgba(56, 189, 248, 0.4);" onclick="promptUpgradeBastionWalls()">
            🧱 Aprimorar Muralhas
          </button>
        </div>
        <div>
          <button type="button" class="btn-action" style="font-size: 12px; font-weight: 800; background: linear-gradient(135deg, #8b5cf6, #6d28d9); color: #fff; box-shadow: 0 0 12px rgba(139, 92, 246, 0.4);" onclick="advanceBastionTurn()">
            🎲 Avançar Turno do Bastião (7 Dias)
          </button>
        </div>
      </div>

      <!-- Grid de Instalações Especiais -->
      <div style="margin-top: 14px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 11px; font-weight: 800; color: var(--primary-light); text-transform: uppercase; letter-spacing: 0.5px;">
            Salas & Instalações Especiais da Fortaleza (${(bastion.specialFacilities || []).length}):
          </span>
          <span style="font-size: 10px; color: #94a3b8;">Cada jogador pode ser gestor de suas salas</span>
        </div>

        <div class="bastion-facilities-grid">
  `;

  if (!bastion.specialFacilities || bastion.specialFacilities.length === 0) {
    html += `
      <div style="grid-column: 1 / -1; text-align: center; padding: 24px; color: #94a3b8; font-size: 12px; background: rgba(0,0,0,0.2); border-radius: 8px;">
        Nenhuma instalação especial construída. Clique em <b>"🏗️ Adicionar Instalação Especial"</b> para começar!
      </div>
    `;
  } else {
    bastion.specialFacilities.forEach(fac => {
      const cat = (typeof BASTION_SPECIAL_FACILITIES_CATALOG !== 'undefined') ? BASTION_SPECIAL_FACILITIES_CATALOG[fac.key] : null;
      const patronHero = campPlayers.find(p => String(p.id) === String(fac.patronId));
      const patronName = patronHero ? patronHero.name : (fac.patronId ? 'Herói Vinculado' : 'Sem Patrono Definido');
      const icon = cat ? cat.icon : '🏛️';
      const order = fac.currentOrder;
      const hasManager = Boolean(fac.managerNpcId && fac.managerNpcName);

      html += `
        <div class="bastion-facility-card">
          <div class="bastion-facility-header">
            <div>
              <div class="bastion-facility-name">
                <span>${icon}</span>
                <span>${fac.name || (cat ? cat.name : 'Instalação')}</span>
              </div>
              <div class="bastion-facility-patron">
                <span>👤 Patrono:</span>
                <strong>${patronName}</strong>
              </div>
            </div>
            <div style="display: flex; gap: 4px;">
              <button type="button" class="btn-micro" style="color: #f87171;" onclick="removeBastionFacility('${fac.id}')" title="Desativar/Excluir esta sala">🗑️</button>
            </div>
          </div>

          <!-- Crachá do NPC Encarregado da Sala (ISSUE-132) -->
          <div class="bastion-facility-manager-row">
            <div class="bastion-facility-manager-info">
              <span style="font-size: 14px;">${fac.managerNpcIcon || '👤'}</span>
              <div>
                ${hasManager ? `
                  <span style="color: #67e8f9; font-weight: 700;">${fac.managerNpcName}</span>
                  <span style="color: #94a3b8; font-size: 10px;"> • ${fac.managerNpcRole || 'Encarregado'}</span>
                ` : `
                  <span style="color: #94a3b8; font-style: italic;">Sem encarregado exclusivo</span>
                `}
              </div>
            </div>
            <div style="display: flex; gap: 4px;">
              <button type="button" class="btn-secondary" style="font-size: 10px; padding: 2px 6px; color: #38bdf8; border-color: rgba(56, 189, 248, 0.4);" onclick="openAssignBastionNpcModal('${fac.id}')" title="Designar ou alterar o NPC encarregado desta sala">
                ${hasManager ? '✏️ Trocar' : '👤 Designar'}
              </button>
              ${hasManager ? `
                <button type="button" class="btn-micro" style="color: #f87171;" onclick="unassignBastionNpc('${fac.id}')" title="Desvincular encarregado">✕</button>
              ` : ''}
            </div>
          </div>

          <div style="font-size: 11px; color: #94a3b8; line-height: 1.4;">
            ${cat ? cat.desc : 'Instalação ativa da base coletiva.'}
          </div>

          <div class="bastion-order-box">
            ${order ? `
              <div class="bastion-order-name">
                <span>⚙️ Ordem Ativa:</span>
                <span>${order.name}</span>
              </div>
              <div class="bastion-order-desc">
                ${order.selectedItem ? `<b>Item em confecção:</b> ${order.selectedItem.name}` : (order.rewardDesc || 'Em execução')}
              </div>
              <div class="bastion-order-progress">
                ⏳ Restam ${order.daysLeft} dias para conclusão (avança a cada turno semanal)
              </div>
            ` : `
              <div style="color: #94a3b8; font-style: italic; display: flex; justify-content: space-between; align-items: center;">
                <span>Sem ordem em andamento.</span>
                <button type="button" class="btn-secondary" style="font-size: 10px; padding: 2px 8px; color: #6ee7b7; border-color: rgba(16, 185, 129, 0.4);" onclick="openBastionActionModal('${fac.id}')">
                  ⚡ Dar Ordem
                </button>
              </div>
            `}
          </div>
        </div>
      `;
    });
  }

  html += `</div></div>`;

  // 1. Painel do Banco / Cofre da Fortaleza (ISSUE-132)
  const bank = getBastionBank(bastion);
  const staff = getBastionStaff(bastion);

  html += `
    <div class="bastion-bank-panel">
      <div style="display: flex; align-items: center; gap: 10px;">
        <span style="font-size: 28px;">🏦</span>
        <div>
          <div style="font-size: 14px; font-weight: 800; color: #fef08a; font-family: var(--font-title);">Cofre Forte & Banco da Fortaleza</div>
          <div style="font-size: 11px; color: #94a3b8;">Depósito seguro de ouro, financiamento de obras e movimentações do grupo</div>
        </div>
      </div>
      <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
        <div style="background: rgba(0,0,0,0.4); border: 1px solid rgba(234, 179, 8, 0.4); border-radius: 8px; padding: 4px 12px; text-align: center;">
          <span style="font-size: 10px; color: #94a3b8; text-transform: uppercase;">Saldo no Cofre:</span>
          <div style="font-size: 18px; font-weight: 900; color: #facc15; font-family: var(--font-mono);">${bank.gold || 0} PO</div>
        </div>
        <div style="display: flex; gap: 6px;">
          <button type="button" class="btn-action" style="font-size: 11px; font-weight: 800; background: linear-gradient(135deg, #10b981, #059669); color: #fff;" onclick="openBastionBankModal()">
            📥 Depositar / Sacar
          </button>
        </div>
      </div>
    </div>

    <!-- 2. Seção do Corpo de Funcionários & Especialistas (Staff - ISSUE-132) -->
    <div class="bastion-staff-section">
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 8px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 20px;">👥</span>
          <div>
            <div style="font-size: 13px; font-weight: 800; color: #38bdf8; text-transform: uppercase; letter-spacing: 0.5px;">Corpo de Funcionários & Especialistas (${staff.length})</div>
            <div style="font-size: 10.5px; color: #94a3b8;">NPCs criados pelo mestre para administrar os cômodos e serviços da fortaleza</div>
          </div>
        </div>
        <div>
          <button type="button" class="btn-action" style="font-size: 11px; font-weight: 800; background: linear-gradient(135deg, #0284c7, #0369a1); color: #fff;" onclick="openCreateBastionStaffModal()">
            ➕ Criar Novo Especialista
          </button>
        </div>
      </div>

      <div class="bastion-staff-grid">
  `;

  if (staff.length === 0) {
    html += `
      <div style="grid-column: 1 / -1; text-align: center; padding: 20px; color: #94a3b8; font-size: 11.5px; background: rgba(0,0,0,0.2); border-radius: 8px;">
        Nenhum especialista cadastrado no staff desta fortaleza. Clique em <b>"➕ Criar Novo Especialista"</b> para designar mestres ferreiros, alquimistas, senescais ou comandantes!
      </div>
    `;
  } else {
    staff.forEach(npc => {
      const assignedFacility = npc.assignedFacilityId ? (bastion.specialFacilities || []).find(f => f.id === npc.assignedFacilityId) : null;
      const mastery = (typeof getBastionStaffMasteryInfo === 'function') ? getBastionStaffMasteryInfo(npc.level || 1) : { level: 1, title: 'Aprendiz', stars: '⭐', timeReductionDays: 0, desc: 'Padrão' };
      html += `
        <div class="bastion-staff-card">
          <div class="bastion-staff-header">
            <div>
              <div class="bastion-staff-name">
                <span>${npc.icon || '👤'}</span>
                <span>${npc.name}</span>
                <span class="bastion-mastery-badge" title="${mastery.title}">${mastery.stars} Nv.${mastery.level}</span>
              </div>
              <div class="bastion-staff-role">${npc.role || 'Especialista'}</div>
            </div>
            <div style="display: flex; gap: 4px; align-items: center;">
              ${(npc.level || 1) < 5 ? `
                <button type="button" class="btn-promote-staff" onclick="promoteBastionStaffMember('${npc.id}')" title="Promover nível de maestria do especialista (aumenta o soldo e benefícios)">
                  ⭐ Promover
                </button>
              ` : ''}
              <button type="button" class="btn-micro" onclick="openCreateBastionStaffModal('${npc.id}')" title="Editar dados do especialista">✏️</button>
              <button type="button" class="btn-micro" style="color: #f87171;" onclick="deleteBastionStaffMember('${npc.id}')" title="Dispensar especialista">🗑️</button>
            </div>
          </div>

          ${npc.trait ? `
            <div style="font-size: 11px; color: #cbd5e1; font-style: italic; background: rgba(0,0,0,0.2); padding: 4px 6px; border-radius: 4px;">
              "${npc.trait}"
            </div>
          ` : ''}

          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px; font-size: 10px; gap: 6px; flex-wrap: wrap;">
            <span class="bastion-staff-benefit-pill" title="${mastery.desc}">
              ${mastery.level === 5 ? '⚡ 2x Produção & -7d' : (mastery.timeReductionDays > 0 ? `⏱️ -${mastery.timeReductionDays} dias` : '⏱️ Tempo padrão')}
            </span>
            <span class="bastion-staff-status-badge ${assignedFacility ? 'bastion-staff-status-assigned' : 'bastion-staff-status-idle'}">
              ${assignedFacility ? `🟢 ${assignedFacility.name}` : `🟡 Disponível`}
            </span>
            <span style="color: #facc15; font-weight: 700;">🪙 ${npc.wage || 0} PO/sem</span>
          </div>
        </div>
      `;
    });
  }

  html += `</div></div>`;

  // Banner do Último Evento Semanal do Bastião
  if (lastEvent) {
    html += `
      <div class="bastion-event-banner">
        <span style="font-size: 20px;">📜</span>
        <div style="flex: 1;">
          <div class="bastion-event-title">Último Acontecimento (Semana ${lastEvent.turn}): ${lastEvent.title}</div>
          <div class="bastion-event-desc">${lastEvent.desc}</div>
        </div>
      </div>
    `;
  }

  html += `</div>`;
  container.innerHTML = html;
}

// =========================================================================
// 🏦 BANCO & COFRE FORTE DO BASTIÃO (ISSUE-132)
// =========================================================================

let currentBastionBankMode = 'deposit'; // 'deposit' ou 'withdraw'

function openBastionBankModal() {
  const camp = getSelectedBastionCampaign();
  if (!camp) return;
  const bastion = getCampaignBastion(camp);
  if (!bastion) return;
  const bank = getBastionBank(bastion);

  const modal = document.getElementById('modal-bastion-bank');
  if (!modal) return;

  const campMeta = document.getElementById('bastion-bank-camp-meta');
  if (campMeta) campMeta.innerText = `${camp.name} • ${bastion.name}`;

  const goldDisp = document.getElementById('bastion-bank-gold-display');
  if (goldDisp) goldDisp.innerText = `${bank.gold || 0} PO`;

  setBastionBankMode('deposit');
  populateBastionBankEntities();
  renderBastionBankHistory();

  modal.style.display = 'flex';
}

function closeBastionBankModal() {
  const modal = document.getElementById('modal-bastion-bank');
  if (modal) modal.style.display = 'none';
}

function setBastionBankMode(mode) {
  currentBastionBankMode = mode;
  const btnDep = document.getElementById('btn-bank-tab-deposit');
  const btnWith = document.getElementById('btn-bank-tab-withdraw');
  const lblEntity = document.getElementById('lbl-bank-entity');
  const btnExec = document.getElementById('btn-bank-execute');

  if (mode === 'deposit') {
    if (btnDep) {
      btnDep.className = 'btn-action';
      btnDep.style.background = 'linear-gradient(135deg, #10b981, #059669)';
      btnDep.style.color = '#fff';
    }
    if (btnWith) {
      btnWith.className = 'btn-secondary';
      btnWith.style.background = '';
      btnWith.style.color = '';
    }
    if (lblEntity) lblEntity.innerText = 'Origem dos Recursos (De onde sai o ouro):';
    if (btnExec) {
      btnExec.innerText = '📥 Confirmar Depósito no Cofre';
      btnExec.style.background = 'linear-gradient(135deg, #10b981, #059669)';
      btnExec.style.color = '#fff';
    }
  } else {
    if (btnWith) {
      btnWith.className = 'btn-action';
      btnWith.style.background = 'linear-gradient(135deg, #f59e0b, #d97706)';
      btnWith.style.color = '#000';
    }
    if (btnDep) {
      btnDep.className = 'btn-secondary';
      btnDep.style.background = '';
      btnDep.style.color = '';
    }
    if (lblEntity) lblEntity.innerText = 'Destino dos Recursos (Para onde vai o ouro):';
    if (btnExec) {
      btnExec.innerText = '📤 Confirmar Saque do Cofre';
      btnExec.style.background = 'linear-gradient(135deg, #f59e0b, #d97706)';
      btnExec.style.color = '#000';
    }
  }

  updateBastionBankEntityLimits();
}

function populateBastionBankEntities() {
  const camp = getSelectedBastionCampaign();
  if (!camp) return;
  const sel = document.getElementById('sel-bank-entity');
  if (!sel) return;

  const campPlayers = getCampaignPlayers(camp);
  const stashGold = camp.partyStash?.gold || 0;

  let opts = `<option value="party_stash">🎒 Baú Coletivo do Grupo (${stashGold} PO disponíveis)</option>`;
  campPlayers.forEach(p => {
    const heroGold = p.gold || (p.coins ? p.coins.gp : 0) || 0;
    opts += `<option value="${p.id}">👤 ${p.name} (${heroGold} PO na bolsa)</option>`;
  });

  sel.innerHTML = opts;
  updateBastionBankEntityLimits();
}

function updateBastionBankEntityLimits() {
  const camp = getSelectedBastionCampaign();
  if (!camp) return;
  const bastion = getCampaignBastion(camp);
  const bank = getBastionBank(bastion);

  const sel = document.getElementById('sel-bank-entity');
  const meta = document.getElementById('bank-entity-balance-meta');
  if (!sel || !meta) return;

  const val = sel.value;
  let maxAvailable = 0;

  if (currentBastionBankMode === 'deposit') {
    if (val === 'party_stash') {
      maxAvailable = camp.partyStash?.gold || 0;
      meta.innerText = `Saldo disponível no Baú Geral: ${maxAvailable} PO`;
    } else {
      const hero = (typeof PLAYERS !== 'undefined' ? PLAYERS.find(p => String(p.id) === String(val)) : null);
      maxAvailable = hero ? (hero.gold || (hero.coins ? hero.coins.gp : 0) || 0) : 0;
      meta.innerText = `Saldo na bolsa de ${hero ? hero.name : 'Herói'}: ${maxAvailable} PO`;
    }
  } else {
    maxAvailable = bank.gold || 0;
    meta.innerText = `Saldo total no Cofre do Bastião para saque: ${maxAvailable} PO`;
  }
}

function addBastionBankAmount(add) {
  const inp = document.getElementById('inp-bank-amount');
  if (!inp) return;
  const cur = parseInt(inp.value, 10) || 0;
  inp.value = cur + add;
}

function setBastionBankMaxAmount() {
  const camp = getSelectedBastionCampaign();
  if (!camp) return;
  const bastion = getCampaignBastion(camp);
  const bank = getBastionBank(bastion);
  const sel = document.getElementById('sel-bank-entity');
  const inp = document.getElementById('inp-bank-amount');
  if (!sel || !inp) return;

  let max = 0;
  if (currentBastionBankMode === 'deposit') {
    if (sel.value === 'party_stash') {
      max = camp.partyStash?.gold || 0;
    } else {
      const hero = (typeof PLAYERS !== 'undefined' ? PLAYERS.find(p => String(p.id) === String(sel.value)) : null);
      max = hero ? (hero.gold || (hero.coins ? hero.coins.gp : 0) || 0) : 0;
    }
  } else {
    max = bank.gold || 0;
  }
  inp.value = Math.max(0, max);
}

function submitBastionBankOperation() {
  const camp = getSelectedBastionCampaign();
  if (!camp) return;
  const bastion = getCampaignBastion(camp);
  const bank = getBastionBank(bastion);

  const sel = document.getElementById('sel-bank-entity');
  const inpAmount = document.getElementById('inp-bank-amount');
  const inpReason = document.getElementById('inp-bank-reason');
  if (!sel || !inpAmount) return;

  const entityKey = sel.value;
  const amount = parseInt(inpAmount.value, 10);
  const reason = inpReason ? inpReason.value.trim() : '';

  if (isNaN(amount) || amount <= 0) {
    alert('Por favor, informe uma quantia válida de Peças de Ouro (PO) maior que zero.');
    return;
  }

  if (currentBastionBankMode === 'deposit') {
    if (entityKey === 'party_stash') {
      camp.partyStash = camp.partyStash || { gold: 0, items: [], history: [] };
      const curStash = camp.partyStash.gold || 0;
      if (curStash < amount) {
        alert(`Saldo insuficiente no Baú Geral (${curStash} PO). Não é possível depositar ${amount} PO.`);
        return;
      }
      camp.partyStash.gold -= amount;
      bank.gold += amount;

      camp.partyStash.history = camp.partyStash.history || [];
      camp.partyStash.history.push({
        date: new Date().toISOString().split('T')[0],
        text: `-${amount} PO transferido para o Cofre do Bastião (${bastion.name})${reason ? ` • ${reason}` : ''}`,
        type: 'gold_out'
      });
      touchPartyStash(camp);

      bank.history.push({
        id: 'tx_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        date: new Date().toISOString().split('T')[0],
        type: 'deposit',
        amount,
        entityType: 'party_stash',
        entityName: 'Baú do Grupo',
        reason: reason || 'Depósito do Baú Geral'
      });

      if (typeof addLog === 'function') {
        addLog(`🏦 <b>Banco do Bastião:</b> +${amount} PO depositado pelo Baú Geral no cofre de "${bastion.name}".`);
      }
    } else {
      const hero = (typeof PLAYERS !== 'undefined' ? PLAYERS.find(p => String(p.id) === String(entityKey)) : null);
      if (!hero) {
        alert('Herói não encontrado.');
        return;
      }
      const heroGold = hero.gold || (hero.coins ? hero.coins.gp : 0) || 0;
      if (heroGold < amount) {
        alert(`Saldo insuficiente na bolsa de ${hero.name} (${heroGold} PO). Não é possível depositar ${amount} PO.`);
        return;
      }
      hero.gold = heroGold - amount;
      if (hero.coins) hero.coins.gp = hero.gold;
      if (typeof touchPlayer === 'function') touchPlayer(hero);

      bank.gold += amount;
      bank.history.push({
        id: 'tx_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        date: new Date().toISOString().split('T')[0],
        type: 'deposit',
        amount,
        entityType: 'player',
        entityId: hero.id,
        entityName: hero.name,
        reason: reason || `Depósito pessoal de ${hero.name}`
      });

      if (typeof addLog === 'function') {
        addLog(`🏦 <b>Banco do Bastião:</b> +${amount} PO depositado por ${hero.name} no cofre de "${bastion.name}".`);
      }
    }
  } else {
    if (bank.gold < amount) {
      alert(`Saldo insuficiente no Cofre do Bastião (${bank.gold} PO). Não é possível sacar ${amount} PO.`);
      return;
    }

    bank.gold -= amount;

    if (entityKey === 'party_stash') {
      camp.partyStash = camp.partyStash || { gold: 0, items: [], history: [] };
      camp.partyStash.gold = (camp.partyStash.gold || 0) + amount;
      camp.partyStash.history = camp.partyStash.history || [];
      camp.partyStash.history.push({
        date: new Date().toISOString().split('T')[0],
        text: `+${amount} PO retirado do Cofre do Bastião (${bastion.name})${reason ? ` • ${reason}` : ''}`,
        type: 'gold_in'
      });
      touchPartyStash(camp);

      bank.history.push({
        id: 'tx_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        date: new Date().toISOString().split('T')[0],
        type: 'withdraw',
        amount,
        entityType: 'party_stash',
        entityName: 'Baú do Grupo',
        reason: reason || 'Saque para o Baú Geral'
      });

      if (typeof addLog === 'function') {
        addLog(`🏦 <b>Banco do Bastião:</b> -${amount} PO sacado do cofre de "${bastion.name}" para o Baú Geral.`);
      }
    } else {
      const hero = (typeof PLAYERS !== 'undefined' ? PLAYERS.find(p => String(p.id) === String(entityKey)) : null);
      if (!hero) {
        alert('Herói não encontrado.');
        return;
      }
      hero.gold = (hero.gold || (hero.coins ? hero.coins.gp : 0) || 0) + amount;
      if (hero.coins) hero.coins.gp = hero.gold;
      if (typeof touchPlayer === 'function') touchPlayer(hero);

      bank.history.push({
        id: 'tx_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        date: new Date().toISOString().split('T')[0],
        type: 'withdraw',
        amount,
        entityType: 'player',
        entityId: hero.id,
        entityName: hero.name,
        reason: reason || `Saque pessoal para ${hero.name}`
      });

      if (typeof addLog === 'function') {
        addLog(`🏦 <b>Banco do Bastião:</b> -${amount} PO sacado do cofre de "${bastion.name}" por ${hero.name}.`);
      }
    }
  }

  touchCampaign(camp);
  saveCampaignsState();
  if (typeof saveToLocalStorage === 'function') saveToLocalStorage();
  if (typeof renderPlayers === 'function') renderPlayers();
  if (typeof updateAllPartyStashElements === 'function') updateAllPartyStashElements();
  if (typeof syncLocalChangesToFirebase === 'function') syncLocalChangesToFirebase(true);

  const goldDisp = document.getElementById('bastion-bank-gold-display');
  if (goldDisp) goldDisp.innerText = `${bank.gold || 0} PO`;
  inpAmount.value = '';
  if (inpReason) inpReason.value = '';
  populateBastionBankEntities();
  renderBastionBankHistory();
  renderBastionsTab(camp.id);
  renderCampaigns();
}

function renderBastionBankHistory() {
  const camp = getSelectedBastionCampaign();
  if (!camp) return;
  const bastion = getCampaignBastion(camp);
  const bank = getBastionBank(bastion);
  const list = document.getElementById('bastion-bank-history-list');
  if (!list) return;

  const raw = bank.history || [];
  if (raw.length === 0) {
    list.innerHTML = `<div style="text-align: center; color: #94a3b8; font-size: 11px; padding: 12px;">Nenhuma movimentação registrada no cofre.</div>`;
    return;
  }

  const txs = raw.slice(-15).reverse();
  list.innerHTML = txs.map(tx => `
    <div class="bank-tx-item ${tx.type === 'deposit' ? 'bank-tx-deposit' : 'bank-tx-withdraw'}">
      <div>
        <b>${tx.type === 'deposit' ? '📥 +' : '📤 -'}${tx.amount} PO</b>
        <span style="color: #94a3b8; margin-left: 6px;">(${tx.entityName || 'Recurso'})</span>
        ${tx.reason ? `<div style="font-size: 10px; color: #cbd5e1; margin-top: 1px;">${tx.reason}</div>` : ''}
      </div>
      <span style="font-size: 10px; color: #64748b; white-space: nowrap;">${tx.date || ''}</span>
    </div>
  `).join('');
}

function clearBastionBankHistory() {
  const camp = getSelectedBastionCampaign();
  if (!camp) return;
  const bastion = getCampaignBastion(camp);
  const bank = getBastionBank(bastion);

  if (!bank.history || bank.history.length === 0) return;
  if (!confirm('Deseja realmente limpar o extrato de movimentações deste cofre?')) return;

  bank.history = [];
  touchCampaign(camp);
  saveCampaignsState();
  if (typeof saveToLocalStorage === 'function') saveToLocalStorage();
  renderBastionBankHistory();
}

// =========================================================================
// 👥 CORPO DE FUNCIONÁRIOS & ESPECIALISTAS DO BASTIÃO (ISSUE-132 / ISSUE-133)
// =========================================================================

const BASTION_STAFF_ICON_PRESETS = {
  '🔨': { role: 'Armeiro-Chefe / Ferreiro', trait: 'Forja de armas marciais de aço temperado e armaduras reforçadas', baseWage: 3 },
  '⚗️': { role: 'Alquimista Chefe', trait: 'Manipulação de poções raras, elixires curativos e ácidos alquímicos', baseWage: 4 },
  '🛡️': { role: 'Comandante da Guarda', trait: 'Estratégia militar, rondas defensivas e treinamento da guarnição', baseWage: 4 },
  '📜': { role: 'Arquivista & Bibliotecário', trait: 'Tradução arcanas, preservação de códices e cópia de pergaminhos', baseWage: 3 },
  '🍷': { role: 'Taverneiro da Fortaleza', trait: 'Hospitalidade, preparação de banquetes e coleta de rumores com viajantes', baseWage: 2 },
  '🌿': { role: 'Herbologista & Botânico', trait: 'Cultivo de plantas medicinais, antídotos para venenos e bálsamos de cura', baseWage: 2 },
  '🧙‍♂️': { role: 'Conselheiro Arcano', trait: 'Identificação de relíquias, supervisão de rituais e encantamentos arcanos', baseWage: 5 },
  '🏹': { role: 'Capitão dos Arqueiros', trait: 'Tiro de precisão, fabricação de virotes especiais e vigia nas ameias', baseWage: 3 },
  '🗝️': { role: 'Senescal & Administrador', trait: 'Superintendência geral da fortaleza, compras e contabilidade', baseWage: 4 },
  '🌾': { role: 'Feitor Agrícola', trait: 'Gestão dos celeiros, estocagem em períodos de cerco e hortas da muralha', baseWage: 2 },
  '🐴': { role: 'Mestre dos Cavalos', trait: 'Criação, adestramento e ferragem de corcéis de guerra e montarias', baseWage: 3 },
  '🍽️': { role: 'Cozinheiro-Chefe', trait: 'Refeições substanciais revigorantes para a guarnição e banquetes nobres', baseWage: 2 },
  '⚖️': { role: 'Tesoureiro do Banco', trait: 'Guarda dos cofres, pesagem de moedas, câmbio e auditoria financeira', baseWage: 4 },
  '👤': { role: 'Especialista Geral', trait: 'Manutenção de cômodos e suporte multifuncional na fortaleza', baseWage: 2 }
};

function getBastionStaffMasteryInfo(level = 1) {
  const lvl = Math.max(1, Math.min(5, parseInt(level) || 1));
  switch (lvl) {
    case 1:
      return { level: 1, title: 'Aprendiz / Prático', stars: '⭐', timeReductionDays: 0, desc: 'Produção padrão sem bônus de tempo.' };
    case 2:
      return { level: 2, title: 'Artífice Qualificado', stars: '⭐⭐', timeReductionDays: 2, desc: 'Reduz o tempo de fabricação da sala em -2 dias.' };
    case 3:
      return { level: 3, title: 'Mestre de Ofício', stars: '⭐⭐⭐', timeReductionDays: 4, desc: 'Reduz o tempo de fabricação da sala em -4 dias.' };
    case 4:
      return { level: 4, title: 'Grão-Mestre', stars: '⭐⭐⭐⭐', timeReductionDays: 7, desc: 'Reduz o tempo de fabricação da sala em -7 dias (1 turno a menos!).' };
    case 5:
      return { level: 5, title: 'Lenda Viva', stars: '⭐⭐⭐⭐⭐', timeReductionDays: 7, doubleProduction: true, desc: 'Reduz tempo em -7 dias E dobra a produção de itens (2x)!' };
    default:
      return { level: 1, title: 'Aprendiz', stars: '⭐', timeReductionDays: 0, desc: 'Produção padrão.' };
  }
}

function calculateBastionStaffWage(icon, level = 1) {
  const preset = BASTION_STAFF_ICON_PRESETS[icon] || { baseWage: 2 };
  const base = preset.baseWage || 2;
  const lvl = Math.max(1, Math.min(5, parseInt(level) || 1));
  const bonusByLevel = [0, 0, 3, 7, 15, 30];
  return base + bonusByLevel[lvl];
}

function onBastionStaffIconChange(icon) {
  const preset = BASTION_STAFF_ICON_PRESETS[icon];
  if (!preset) return;
  const inpRole = document.getElementById('inp-bstaff-role');
  const inpTrait = document.getElementById('inp-bstaff-trait');
  const selLevel = document.getElementById('sel-bstaff-level');
  const inpWage = document.getElementById('inp-bstaff-wage');

  if (inpRole) inpRole.value = preset.role;
  if (inpTrait) inpTrait.value = preset.trait;

  const currentLevel = selLevel ? parseInt(selLevel.value) || 1 : 1;
  const calculatedWage = calculateBastionStaffWage(icon, currentLevel);
  if (inpWage) inpWage.value = calculatedWage;
}

function onBastionStaffLevelChange(level) {
  const selIcon = document.getElementById('sel-bstaff-icon');
  const inpWage = document.getElementById('inp-bstaff-wage');
  const icon = selIcon ? selIcon.value : '👤';
  const calculatedWage = calculateBastionStaffWage(icon, level);
  if (inpWage) inpWage.value = calculatedWage;
}

function promoteBastionStaffMember(npcId) {
  const camp = getSelectedBastionCampaign();
  if (!camp) return;
  const bastion = getCampaignBastion(camp);
  const staff = getBastionStaff(bastion);

  const member = staff.find(x => x.id === npcId);
  if (!member) return;

  const currentLevel = member.level || 1;
  if (currentLevel >= 5) {
    alert(`O especialista ${member.name} já atingiu o nível máximo de maestria (⭐⭐⭐⭐⭐ Nv 5 Lenda Viva)!`);
    return;
  }

  const nextLevel = currentLevel + 1;
  const nextInfo = getBastionStaffMasteryInfo(nextLevel);
  const newWage = calculateBastionStaffWage(member.icon, nextLevel);

  if (!confirm(`Deseja promover "${member.name}" para ${nextInfo.stars} Nv.${nextLevel} (${nextInfo.title})?\n\nBenefício: ${nextInfo.desc}\nNovo salário semanal: ${newWage} PO/semana.`)) {
    return;
  }

  member.level = nextLevel;
  member.wage = newWage;

  touchCampaign(camp);
  saveCampaignsState();
  if (typeof saveToLocalStorage === 'function') saveToLocalStorage();
  if (typeof syncLocalChangesToFirebase === 'function') syncLocalChangesToFirebase(true);

  renderBastionsTab(camp.id);
  renderCampaigns();

  if (typeof addLog === 'function') {
    addLog(`⭐ <b>Staff do Bastião:</b> "${member.name}" foi promovido a <b>${nextInfo.stars} Nv.${nextLevel} (${nextInfo.title})</b>! Soldo: ${newWage} PO/sem.`);
  }
}

function openCreateBastionStaffModal(npcId = null) {
  const camp = getSelectedBastionCampaign();
  if (!camp) return;
  const bastion = getCampaignBastion(camp);
  const staff = getBastionStaff(bastion);

  const modal = document.getElementById('modal-create-bastion-staff');
  if (!modal) return;

  const titleEl = document.getElementById('bastion-staff-modal-title');
  const inpId = document.getElementById('inp-bstaff-id');
  const inpName = document.getElementById('inp-bstaff-name');
  const selIcon = document.getElementById('sel-bstaff-icon');
  const inpRole = document.getElementById('inp-bstaff-role');
  const selLevel = document.getElementById('sel-bstaff-level');
  const inpWage = document.getElementById('inp-bstaff-wage');
  const inpTrait = document.getElementById('inp-bstaff-trait');
  const inpNotes = document.getElementById('inp-bstaff-notes');

  const existing = npcId ? staff.find(x => x.id === npcId) : null;

  if (existing) {
    if (titleEl) titleEl.innerText = `Editar Especialista: ${existing.name}`;
    if (inpId) inpId.value = existing.id;
    if (inpName) inpName.value = existing.name || '';
    if (selIcon) selIcon.value = existing.icon || '🔨';
    if (inpRole) inpRole.value = existing.role || '';
    if (selLevel) selLevel.value = String(existing.level || 1);
    if (inpWage) inpWage.value = (existing.wage !== undefined ? existing.wage : calculateBastionStaffWage(existing.icon || '🔨', existing.level || 1));
    if (inpTrait) inpTrait.value = existing.trait || '';
    if (inpNotes) inpNotes.value = existing.notes || '';
  } else {
    if (titleEl) titleEl.innerText = 'Criar Novo Especialista do Staff';
    if (inpId) inpId.value = '';
    if (inpName) inpName.value = '';
    if (selIcon) selIcon.value = '🔨';
    if (inpRole) inpRole.value = BASTION_STAFF_ICON_PRESETS['🔨'].role;
    if (selLevel) selLevel.value = '1';
    if (inpWage) inpWage.value = String(calculateBastionStaffWage('🔨', 1));
    if (inpTrait) inpTrait.value = BASTION_STAFF_ICON_PRESETS['🔨'].trait;
    if (inpNotes) inpNotes.value = '';
  }

  modal.style.display = 'flex';
  setTimeout(() => { if (inpName && typeof inpName.focus === 'function') inpName.focus(); }, 100);
}

function closeCreateBastionStaffModal() {
  const modal = document.getElementById('modal-create-bastion-staff');
  if (modal) modal.style.display = 'none';
}

function saveBastionStaffMember() {
  const camp = getSelectedBastionCampaign();
  if (!camp) return;
  const bastion = getCampaignBastion(camp);
  const staff = getBastionStaff(bastion);

  const inpId = document.getElementById('inp-bstaff-id')?.value;
  const name = document.getElementById('inp-bstaff-name')?.value.trim();
  const icon = document.getElementById('sel-bstaff-icon')?.value || '👤';
  const role = document.getElementById('inp-bstaff-role')?.value.trim() || 'Especialista';
  const level = parseInt(document.getElementById('sel-bstaff-level')?.value, 10) || 1;
  const wage = parseInt(document.getElementById('inp-bstaff-wage')?.value, 10) || 0;
  const trait = document.getElementById('inp-bstaff-trait')?.value.trim() || '';
  const notes = document.getElementById('inp-bstaff-notes')?.value.trim() || '';

  if (!name) {
    alert('Por favor, informe o nome do especialista / NPC.');
    const el = document.getElementById('inp-bstaff-name');
    if (el && typeof el.focus === 'function') el.focus();
    return;
  }

  if (inpId) {
    const member = staff.find(x => x.id === inpId);
    if (member) {
      member.name = name;
      member.icon = icon;
      member.role = role;
      member.level = level;
      member.wage = wage;
      member.trait = trait;
      member.notes = notes;

      if (member.assignedFacilityId) {
        const fac = (bastion.specialFacilities || []).find(f => f.id === member.assignedFacilityId);
        if (fac) {
          fac.managerNpcName = name;
          fac.managerNpcIcon = icon;
          fac.managerNpcRole = role;
          fac.managerNpcLevel = level;
        }
      }
    }
  } else {
    staff.push({
      id: 'bstaff_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      name,
      icon,
      role,
      level,
      wage,
      trait,
      notes,
      assignedFacilityId: null
    });
  }

  touchCampaign(camp);
  saveCampaignsState();
  if (typeof saveToLocalStorage === 'function') saveToLocalStorage();
  if (typeof syncLocalChangesToFirebase === 'function') syncLocalChangesToFirebase(true);

  closeCreateBastionStaffModal();
  renderBastionsTab(camp.id);
  renderCampaigns();

  if (typeof addLog === 'function') {
    addLog(`👥 <b>Staff do Bastião:</b> Especialista "${name}" (${role} Nv.${level}) registrado no staff de ${bastion.name}.`);
  }
}

function deleteBastionStaffMember(npcId) {
  const camp = getSelectedBastionCampaign();
  if (!camp) return;
  const bastion = getCampaignBastion(camp);
  const staff = getBastionStaff(bastion);

  const idx = staff.findIndex(x => x.id === npcId);
  if (idx === -1) return;
  const member = staff[idx];

  if (!confirm(`Deseja realmente dispensar e remover o especialista "${member.name}" (${member.role}) do Bastião?`)) return;

  (bastion.specialFacilities || []).forEach(fac => {
    if (fac.managerNpcId === npcId) {
      fac.managerNpcId = null;
      fac.managerNpcName = null;
      fac.managerNpcIcon = null;
      fac.managerNpcRole = null;
    }
  });

  staff.splice(idx, 1);

  touchCampaign(camp);
  saveCampaignsState();
  if (typeof saveToLocalStorage === 'function') saveToLocalStorage();
  if (typeof syncLocalChangesToFirebase === 'function') syncLocalChangesToFirebase(true);

  renderBastionsTab(camp.id);
  renderCampaigns();
  if (typeof addLog === 'function') {
    addLog(`👥 <b>Staff do Bastião:</b> Especialista "${member.name}" dispensado de ${bastion.name}.`);
  }
}

function openAssignBastionNpcModal(facilityId) {
  const camp = getSelectedBastionCampaign();
  if (!camp) return;
  const bastion = getCampaignBastion(camp);
  const fac = (bastion.specialFacilities || []).find(f => f.id === facilityId);
  if (!fac) return;

  const modal = document.getElementById('modal-assign-bastion-npc');
  if (!modal) return;

  const roomNameEl = document.getElementById('assign-bastion-npc-room-name');
  if (roomNameEl) roomNameEl.innerText = `${fac.name || 'Instalação'} (${bastion.name})`;

  const inpFacId = document.getElementById('assign-bastion-facility-id');
  if (inpFacId) inpFacId.value = fac.id;

  const sel = document.getElementById('sel-assign-staff-npc');
  if (sel) {
    const staff = getBastionStaff(bastion);
    if (staff.length === 0) {
      sel.innerHTML = `<option value="">Nenhum NPC criado no staff. Clique em "➕ Criar Novo NPC" abaixo!</option>`;
    } else {
      sel.innerHTML = staff.map(npc => {
        const isCurrent = fac.managerNpcId === npc.id;
        let assignedRoomName = '';
        if (npc.assignedFacilityId && npc.assignedFacilityId !== fac.id) {
          const otherFac = (bastion.specialFacilities || []).find(f => f.id === npc.assignedFacilityId);
          if (otherFac) assignedRoomName = ` (⚠️ Já alocado em: ${otherFac.name})`;
        }
        return `
          <option value="${npc.id}" ${isCurrent ? 'selected' : ''}>
            ${npc.icon || '👤'} ${npc.name} • ${npc.role || 'Especialista'}${assignedRoomName}
          </option>
        `;
      }).join('');
    }
  }

  modal.style.display = 'flex';
}

function closeAssignBastionNpcModal() {
  const modal = document.getElementById('modal-assign-bastion-npc');
  if (modal) modal.style.display = 'none';
}

function confirmAssignBastionNpc() {
  const camp = getSelectedBastionCampaign();
  if (!camp) return;
  const bastion = getCampaignBastion(camp);
  const inpFacId = document.getElementById('assign-bastion-facility-id')?.value;
  const fac = (bastion.specialFacilities || []).find(f => f.id === inpFacId);
  if (!fac) return;

  const selNpc = document.getElementById('sel-assign-staff-npc')?.value;
  if (!selNpc) {
    alert('Nenhum especialista selecionado.');
    return;
  }

  const staff = getBastionStaff(bastion);
  const npc = staff.find(x => x.id === selNpc);
  if (!npc) {
    alert('Especialista não encontrado.');
    return;
  }

  // Desvincula de cômodo anterior se houver (sem repetição do mesmo NPC)
  if (npc.assignedFacilityId && npc.assignedFacilityId !== fac.id) {
    const oldFac = (bastion.specialFacilities || []).find(f => f.id === npc.assignedFacilityId);
    if (oldFac) {
      oldFac.managerNpcId = null;
      oldFac.managerNpcName = null;
      oldFac.managerNpcIcon = null;
      oldFac.managerNpcRole = null;
    }
  }

  // Desvincula NPC anterior deste cômodo se houver
  if (fac.managerNpcId && fac.managerNpcId !== npc.id) {
    const prevNpc = staff.find(x => x.id === fac.managerNpcId);
    if (prevNpc) prevNpc.assignedFacilityId = null;
  }

  fac.managerNpcId = npc.id;
  fac.managerNpcName = npc.name;
  fac.managerNpcIcon = npc.icon;
  fac.managerNpcRole = npc.role;
  npc.assignedFacilityId = fac.id;

  touchCampaign(camp);
  saveCampaignsState();
  if (typeof saveToLocalStorage === 'function') saveToLocalStorage();
  if (typeof syncLocalChangesToFirebase === 'function') syncLocalChangesToFirebase(true);

  closeAssignBastionNpcModal();
  renderBastionsTab(camp.id);
  renderCampaigns();

  if (typeof addLog === 'function') {
    addLog(`👤 <b>Bastião:</b> ${npc.icon} ${npc.name} (${npc.role}) agora é o encarregado da ${fac.name}.`);
  }
}

function unassignBastionNpc(facilityId = null) {
  const camp = getSelectedBastionCampaign();
  if (!camp) return;
  const bastion = getCampaignBastion(camp);
  const targetId = facilityId || document.getElementById('assign-bastion-facility-id')?.value;
  const fac = (bastion.specialFacilities || []).find(f => f.id === targetId);
  if (!fac) return;

  if (fac.managerNpcId) {
    const staff = getBastionStaff(bastion);
    const npc = staff.find(x => x.id === fac.managerNpcId);
    if (npc) npc.assignedFacilityId = null;
  }

  const prevName = fac.managerNpcName || 'Responsável';
  fac.managerNpcId = null;
  fac.managerNpcName = null;
  fac.managerNpcIcon = null;
  fac.managerNpcRole = null;

  touchCampaign(camp);
  saveCampaignsState();
  if (typeof saveToLocalStorage === 'function') saveToLocalStorage();
  if (typeof syncLocalChangesToFirebase === 'function') syncLocalChangesToFirebase(true);

  closeAssignBastionNpcModal();
  renderBastionsTab(camp.id);
  renderCampaigns();

  if (typeof addLog === 'function') {
    addLog(`👤 <b>Bastião:</b> ${prevName} foi desvinculado da ${fac.name}.`);
  }
}

// Abre o Modal de Ações com Filtro por Nível e Seletores de Itens
function openBastionActionModal(preselectedFacId = null) {
  const camp = getSelectedBastionCampaign();
  if (!camp) return;

  const bastion = getCampaignBastion(camp);
  if (!bastion) return;
  const bank = getBastionBank(bastion);

  // Atualiza saldo de ouro no modal com foco no Cofre do Banco
  const goldEl = document.getElementById('bastion-modal-gold-badge');
  if (goldEl) goldEl.innerText = `🏦 Cofre do Banco: ${bank.gold || 0} PO (Baú: ${camp.partyStash?.gold || 0} PO)`;

  // Popula seletor de heróis
  const selHero = document.getElementById('sel-bastion-action-hero');
  if (selHero) {
    const heroes = (camp.playerIds || []).map(id => PLAYERS.find(p => String(p.id) === String(id))).filter(p => p);
    selHero.innerHTML = heroes.length > 0 ? heroes.map(h => `
      <option value="${h.id}">${h.name} (${h.className || 'Herói'} Nv.${h.level || 1})</option>
    `).join('') : '<option value="">Sem heróis na campanha</option>';
  }

  // Popula seletor de instalações
  const selFac = document.getElementById('sel-bastion-action-facility');
  if (selFac) {
    selFac.innerHTML = (bastion.specialFacilities || []).map(f => {
      const cat = (typeof BASTION_SPECIAL_FACILITIES_CATALOG !== 'undefined') ? BASTION_SPECIAL_FACILITIES_CATALOG[f.key] : null;
      const mgrLabel = f.managerNpcName ? ` • 👤 ${f.managerNpcName}` : '';
      return `<option value="${f.id}" ${f.id === preselectedFacId ? 'selected' : ''}>${cat ? cat.icon : '🏛️'} ${f.name || cat?.name} (Nv.${cat?.levelReq || 5})${mgrLabel}</option>`;
    }).join('');
  }

  renderBastionActionsList();

  const modal = document.getElementById('modal-bastion-action');
  if (modal) modal.style.display = 'flex';
}

function closeBastionActionModal() {
  const modal = document.getElementById('modal-bastion-action');
  if (modal) modal.style.display = 'none';
}

function setBastionActionFilter(lvl, btnEl) {
  currentBastionLevelFilter = lvl;
  const chips = document.querySelectorAll('.bastion-filter-chip');
  chips.forEach(c => c.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');
  renderBastionActionsList();
}

function renderBastionActionsList() {
  const listContainer = document.getElementById('bastion-actions-list');
  if (!listContainer) return;

  const camp = getSelectedBastionCampaign();
  if (!camp) return;

  const bastion = getCampaignBastion(camp);
  const bank = getBastionBank(bastion);
  const selFac = document.getElementById('sel-bastion-action-facility');
  const selectedFacId = selFac ? selFac.value : null;
  const selectedFac = (bastion?.specialFacilities || []).find(f => f.id === selectedFacId);
  const currentBankGold = bank.gold || 0;

  if (typeof BASTION_ACTIONS_CATALOG === 'undefined') {
    listContainer.innerHTML = '<div style="color:#94a3b8;">Catálogo de ações indisponível.</div>';
    return;
  }

  let actions = Object.values(BASTION_ACTIONS_CATALOG);

  // Se uma instalação estiver selecionada, prioriza as ordens permitidas dela
  if (selectedFac) {
    const cat = BASTION_SPECIAL_FACILITIES_CATALOG[selectedFac.key];
    if (cat && cat.orders && cat.orders.length > 0) {
      actions = actions.filter(act => cat.orders.includes(act.key) || act.facilityKey === selectedFac.key);
    }
  }

  // Filtra por nível se selecionado
  if (currentBastionLevelFilter !== 'all') {
    const reqLvl = parseInt(currentBastionLevelFilter);
    actions = actions.filter(act => act.levelReq === reqLvl);
  }

  if (actions.length === 0) {
    listContainer.innerHTML = `
      <div style="text-align: center; padding: 20px; color: #94a3b8; font-size: 12px; background: rgba(0,0,0,0.2); border-radius: 8px;">
        Nenhuma ação disponível para os filtros selecionados ou para esta instalação.
      </div>
    `;
    return;
  }

  // Identifica bônus do especialista alocado nesta sala
  let timeReduction = 0;
  let mgrInfoText = '';
  if (selectedFac && selectedFac.managerNpcId) {
    const mgr = (bastion.staff || []).find(s => s.id === selectedFac.managerNpcId);
    if (mgr) {
      const minfo = getBastionStaffMasteryInfo(mgr.level || 1);
      timeReduction = minfo.timeReductionDays || 0;
      mgrInfoText = `👤 Encarregado: ${mgr.name} (${minfo.stars} Nv.${minfo.level}) • Desconto: -${timeReduction} dias`;
    }
  }

  listContainer.innerHTML = actions.map(act => {
    let costDisplay = `${act.costPO} PO`;
    if (act.costType === 'metal_half') costDisplay = '50% do valor da tabela em PO';
    if (act.costType === 'spell_circle') costDisplay = '50 PO por círculo de magia';
    if (act.costType === 'item_base') costDisplay = 'Valor base do item em PO';

    const canAfford = currentBankGold >= (act.costPO || 0);
    const effectiveDays = Math.max(1, (act.durationDays || 7) - timeReduction);

    return `
      <div class="bastion-action-card">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; flex-wrap: wrap;">
          <div>
            <div style="font-weight: 800; font-size: 14px; color: #fff; display: flex; align-items: center; gap: 6px;">
              <span>⚡</span>
              <span>${act.name}</span>
            </div>
            <div style="display: flex; gap: 6px; align-items: center; margin-top: 4px; flex-wrap: wrap;">
              <span class="badge badge-lvl" style="font-size: 10px;">⭐ Requer Nível ${act.levelReq}</span>
              <span class="badge badge-gold" style="font-size: 10px;">🏦 Custo: ${costDisplay} (do Banco)</span>
              <span class="badge" style="font-size: 10px; background: rgba(255,255,255,0.1); color: #cbd5e1;">⏳ Tempo: ${effectiveDays} dias ${timeReduction > 0 ? `(era ${act.durationDays}d)` : ''}</span>
            </div>
            ${mgrInfoText ? `<div style="font-size: 10.5px; color: #67e8f9; margin-top: 3px;">${mgrInfoText}</div>` : ''}
          </div>
          <button type="button" class="btn-action" style="padding: 6px 14px; font-size: 11px; font-weight: 800; background: ${canAfford ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'rgba(100,116,139,0.4)'}; color: ${canAfford ? '#000' : '#94a3b8'};"
            onclick="triggerActivateBastionAction('${act.key}')" ${!canAfford && act.costPO > 0 ? 'disabled' : ''}>
            ${canAfford || act.costPO === 0 ? '✔️ Ativar Ordem' : '❌ Sem Saldo no Banco'}
          </button>
        </div>

        <!-- Seletor de Item Dinâmico se a ação permitir confecção de itens -->
        ${act.hasItemSelector ? renderActionItemSelectorHtml(act) : ''}

        <div class="bastion-action-reward-box">
          <b>🎁 Recompensa / Benefício:</b> ${act.rewardDesc}
        </div>
      </div>
    `;
  }).join('');
}

// Renderiza o Seletor de Itens com opções inteligentes integradas ao banco de dados
function renderActionItemSelectorHtml(act) {
  let optionsHtml = '';

  if (act.category === 'metal_arms') {
    const metalWeapons = [
      { name: 'Armadura de Placas Completa', cost: 750, orig: 1500 },
      { name: 'Cota de Malha Pesada', cost: 37, orig: 75 },
      { name: 'Couraça de Aço (Breastplate)', cost: 200, orig: 400 },
      { name: 'Espada Longa de Aço', cost: 7, orig: 15 },
      { name: 'Espadão de Duas Mãos', cost: 25, orig: 50 },
      { name: 'Machado Grande Marcial', cost: 15, orig: 30 },
      { name: 'Escudo Reforçado de Ferro', cost: 5, orig: 10 }
    ];
    optionsHtml = metalWeapons.map(w => `<option value="${w.name}|${w.cost}">${w.name} (Por ${w.cost} PO - 50% desc.)</option>`).join('');
  } else if (act.category === 'magic_arms') {
    const magicArms = [
      { name: 'Espada Longa +1', cost: 200 },
      { name: 'Machado Grande +1', cost: 200 },
      { name: 'Arco Longo +1', cost: 200 },
      { name: 'Escudo +1', cost: 200 },
      { name: 'Armadura de Mithral', cost: 200 }
    ];
    optionsHtml = magicArms.map(m => `<option value="${m.name}|${m.cost}">${m.name} (${m.cost} PO - Incomum)</option>`).join('');
  } else if (act.category === 'potions') {
    const potions = [
      { name: 'Poção Maior de Cura (4d4+4)', cost: 100 },
      { name: 'Poção de Força do Gigante da Colina', cost: 100 },
      { name: 'Poção de Invisibilidade Rápida', cost: 100 },
      { name: 'Poção de Respiração Aquática', cost: 100 },
      { name: 'Antídoto Refinado de Venenos', cost: 50 }
    ];
    optionsHtml = potions.map(p => `<option value="${p.name}|${p.cost}">${p.name} (${p.cost} PO)</option>`).join('');
  } else if (act.category === 'spells') {
    const scrolls = [
      { name: 'Pergaminho de Mísseis Mágicos (1º Círculo)', cost: 50 },
      { name: 'Pergaminho de Escudo Arcano (1º Círculo)', cost: 50 },
      { name: 'Pergaminho de Invisibilidade (2º Círculo)', cost: 100 },
      { name: 'Pergaminho de Passo Nebuloso (2º Círculo)', cost: 100 },
      { name: 'Pergaminho de Bola de Fogo (3º Círculo)', cost: 150 },
      { name: 'Pergaminho de Relâmpago (3º Círculo)', cost: 150 }
    ];
    optionsHtml = scrolls.map(s => `<option value="${s.name}|${s.cost}">${s.name} (${s.cost} PO)</option>`).join('');
  } else if (act.category === 'magic_arcana') {
    const arcanaItems = [
      { name: 'Varinha do Mago de Guerra +1', cost: 200 },
      { name: 'Pérola do Poder', cost: 200 },
      { name: 'Mochila de Carga (Bag of Holding)', cost: 200 },
      { name: 'Corda de Escalada Mágica', cost: 150 },
      { name: 'Óculos Noturnos (Darkvision)', cost: 200 }
    ];
    optionsHtml = arcanaItems.map(a => `<option value="${a.name}|${a.cost}">${a.name} (${a.cost} PO)</option>`).join('');
  } else {
    optionsHtml = `
      <option value="Mochila de Aventureiro Completa|10">Mochila de Aventureiro Completa (10 PO)</option>
      <option value="Kit de Ferramentas de Ladrão|25">Kit de Ferramentas de Ladrão (25 PO)</option>
      <option value="Corda de Seda (15m)|10">Corda de Seda 15m (10 PO)</option>
      <option value="Tochas e Óleo (Kit)|5">Kit de Tochas e Óleo (5 PO)</option>
    `;
  }

  return `
    <div style="background: rgba(0,0,0,0.35); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; padding: 8px 10px;">
      <label style="font-size: 11px; font-weight: 700; color: #fef08a;">📦 Selecione o Item a ser Fabricado:</label>
      <select id="sel-item-for-${act.key}" style="width: 100%; font-size: 12px; margin-top: 4px;">
        ${optionsHtml}
        <option value="CUSTOM">➕ Item Personalizado / Sob Medida...</option>
      </select>
    </div>
  `;
}

function triggerActivateBastionAction(actionKey) {
  const camp = getSelectedBastionCampaign();
  if (!camp) return;

  const bastion = getCampaignBastion(camp);
  const bank = getBastionBank(bastion);
  const selFac = document.getElementById('sel-bastion-action-facility');
  const selHero = document.getElementById('sel-bastion-action-hero');
  const facId = selFac ? selFac.value : null;
  const heroId = selHero ? selHero.value : null;

  const fac = (bastion?.specialFacilities || []).find(f => f.id === facId);
  if (!fac) {
    alert('Por favor, selecione uma instalação válida.');
    return;
  }

  const act = (typeof BASTION_ACTIONS_CATALOG !== 'undefined') ? BASTION_ACTIONS_CATALOG[actionKey] : null;
  if (!act) return;

  let selectedItem = null;
  let finalCost = act.costPO || 0;

  if (act.hasItemSelector) {
    const selItemEl = document.getElementById(`sel-item-for-${act.key}`);
    const selVal = selItemEl ? selItemEl.value : '';
    if (selVal === 'CUSTOM') {
      const customName = prompt('Digite o nome do item personalizado que deseja fabricar:');
      if (!customName) return;
      const customCostStr = prompt('Digite o custo de materiais em PO acordado com o Mestre:', '50');
      finalCost = parseInt(customCostStr) || 0;
      selectedItem = { name: customName, costPO: finalCost, type: 'custom' };
    } else if (selVal.includes('|')) {
      const parts = selVal.split('|');
      selectedItem = { name: parts[0], costPO: parseInt(parts[1]) || 0 };
      finalCost = selectedItem.costPO;
    }
  }

  const currentBankGold = bank.gold || 0;
  if (finalCost > currentBankGold) {
    alert(`Saldo insuficiente no Cofre do Banco da Fortaleza!\n\nCusto dos materiais da ordem: ${finalCost} PO.\nSaldo disponível no Banco: ${currentBankGold} PO.\n\nPor favor, deposite ouro no Banco do Bastião antes de iniciar a obra.`);
    return;
  }

  // Verifica bônus de redução de tempo e maestria do supervisor da instalação
  let timeReduction = 0;
  let mgrLevel = 1;
  let mgrName = fac.managerNpcName || null;
  if (fac.managerNpcId) {
    const mgr = (bastion.staff || []).find(s => s.id === fac.managerNpcId);
    if (mgr) {
      mgrLevel = mgr.level || 1;
      mgrName = mgr.name;
      const minfo = getBastionStaffMasteryInfo(mgrLevel);
      timeReduction = minfo.timeReductionDays || 0;
    }
  }

  const baseDays = act.durationDays || 7;
  const effectiveDays = Math.max(1, baseDays - timeReduction);

  // Deduz exclusivamente do Cofre do Banco da Fortaleza
  if (finalCost > 0) {
    bank.gold -= finalCost;
    bank.history = bank.history || [];
    bank.history.push({
      type: 'withdraw',
      amount: finalCost,
      entityName: fac.name,
      reason: `Materiais para ordem "${act.name}"`,
      date: new Date().toISOString().split('T')[0]
    });
  }

  fac.currentOrder = {
    actionKey: act.key,
    name: act.name,
    durationDays: effectiveDays,
    daysLeft: effectiveDays,
    heroId: heroId,
    managerNpcName: mgrName,
    managerNpcLevel: mgrLevel,
    selectedItem: selectedItem,
    rewardDesc: act.rewardDesc,
    rewardItem: act.rewardItem,
    costPO: finalCost
  };

  touchCampaign(camp);
  saveCampaignsState();
  if (typeof saveToLocalStorage === 'function') saveToLocalStorage();

  closeBastionActionModal();
  renderBastionsTab(camp.id);
  renderCampaigns();
  if (typeof updateAllPartyStashElements === 'function') updateAllPartyStashElements();

  if (typeof addLog === 'function') {
    addLog(`🏰 <b>Bastião:</b> Ordem "${act.name}" iniciada na ${fac.name}. Custo: ${finalCost} PO debitados do Cofre do Banco. Duração: ${effectiveDays} dias.`);
  }
}

// Avança 7 dias no tempo do Bastião, processa ordens concluídas e rola na Tabela d100 de Eventos
function advanceBastionTurn() {
  const camp = getSelectedBastionCampaign();
  if (!camp) return;

  const bastion = getCampaignBastion(camp);
  if (!bastion) return;
  const bank = getBastionBank(bastion);
  const staff = getBastionStaff(bastion);

  bastion.turnCount = (bastion.turnCount || 1) + 1;
  const completedOrders = [];

  // 0. Folha de Pagamento Semanal do Staff debitada do Cofre do Banco (ISSUE-133)
  const totalPayroll = staff.reduce((sum, n) => sum + (n.wage || 0), 0);
  let payrollNotice = "";

  if (totalPayroll > 0) {
    if ((bank.gold || 0) >= totalPayroll) {
      bank.gold -= totalPayroll;
      bank.history = bank.history || [];
      bank.history.push({
        type: 'withdraw',
        amount: totalPayroll,
        entityName: 'Folha de Pagamento',
        reason: `Salário semanal do Staff (${staff.length} especialistas)`,
        date: new Date().toISOString().split('T')[0]
      });
      payrollNotice = `Folha de pagamento semanal (${totalPayroll} PO) quitada via Cofre do Banco.`;
    } else {
      const unpaid = totalPayroll - (bank.gold || 0);
      const paid = bank.gold || 0;
      bank.gold = 0;
      if (paid > 0) {
        bank.history = bank.history || [];
        bank.history.push({
          type: 'withdraw',
          amount: paid,
          entityName: 'Folha Parcial',
          reason: `Pagamento parcial do Staff (${paid}/${totalPayroll} PO)`,
          date: new Date().toISOString().split('T')[0]
        });
      }
      payrollNotice = `⚠️ ALERTA: Saldo bancário insuficiente para a folha do Staff (${totalPayroll} PO necessários, faltaram ${unpaid} PO). Moral dos especialistas abalada!`;
    }
  }

  // 1. Processa as ordens das instalações especiais
  (bastion.specialFacilities || []).forEach(fac => {
    if (fac.currentOrder) {
      fac.currentOrder.daysLeft -= 7;
      if (fac.currentOrder.daysLeft <= 0) {
        completedOrders.push({ fac, order: fac.currentOrder });

        // Identifica se o encarregado é Nível 5 (Lenda Viva) para dobrar a produção
        let isLevel5 = fac.managerNpcLevel === 5 || fac.currentOrder.managerNpcLevel === 5;
        if (!isLevel5 && fac.managerNpcId) {
          const m = staff.find(s => s.id === fac.managerNpcId);
          if (m && m.level === 5) isLevel5 = true;
        }
        const productionMultiplier = isLevel5 ? 2 : 1;

        // Adiciona item concluído no Baú Coletivo
        if (fac.currentOrder.selectedItem) {
          camp.partyStash.items = camp.partyStash.items || [];
          camp.partyStash.items.push({
            id: 'it_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
            name: fac.currentOrder.selectedItem.name,
            qty: productionMultiplier,
            category: 'Fabricação do Bastião',
            carrier: 'Baú do Grupo',
            desc: `Item fabricado no Bastião pela ordem "${fac.currentOrder.name}".`
          });
          const mgrNotice = fac.managerNpcName ? ` (Supervisionado por ${fac.managerNpcName}${isLevel5 ? ' - ⭐ Lenda Viva 2x' : ''})` : '';
          camp.partyStash.history.push({
            date: new Date().toISOString().split('T')[0],
            text: `+${productionMultiplier}x ${fac.currentOrder.selectedItem.name} fabricado na ${fac.name}${mgrNotice}`,
            type: 'item_in'
          });
        } else if (fac.currentOrder.rewardItem) {
          const rItem = fac.currentOrder.rewardItem;
          const finalQty = (rItem.qty || 1) * productionMultiplier;
          const mgrNotice = fac.managerNpcName ? ` (Supervisionado por ${fac.managerNpcName}${isLevel5 ? ' - ⭐ Lenda Viva 2x' : ''})` : '';
          camp.partyStash.items = camp.partyStash.items || [];
          camp.partyStash.items.push({
            id: 'it_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
            name: rItem.name,
            qty: finalQty,
            category: 'Produção do Bastião',
            carrier: 'Baú do Grupo',
            desc: rItem.desc || 'Produzido nas instalações da fortaleza.'
          });
          camp.partyStash.history.push({
            date: new Date().toISOString().split('T')[0],
            text: `+${finalQty}x ${rItem.name} produzido no Bastião (${fac.name})${mgrNotice}`,
            type: 'item_in'
          });
        }

        // Faturamento comercial direto para o Baú
        if (fac.currentOrder.actionKey === 'run_gambling_night') {
          const profit = Math.floor(Math.random() * 90) + 30; // 30 a 120 PO
          camp.partyStash.gold = (camp.partyStash.gold || 0) + profit;
          camp.partyStash.history.push({
            date: new Date().toISOString().split('T')[0],
            text: `+${profit} PO lucro da Noite de Jogatina no Bastião`,
            type: 'gold_in'
          });
        } else if (fac.currentOrder.actionKey === 'trade_commodities') {
          const profit = Math.floor(Math.random() * 100) + 50; // 50 a 150 PO
          camp.partyStash.gold = (camp.partyStash.gold || 0) + profit;
          camp.partyStash.history.push({
            date: new Date().toISOString().split('T')[0],
            text: `+${profit} PO lucro de caravanas no Depósito Comercial`,
            type: 'gold_in'
          });
        } else if (fac.currentOrder.actionKey === 'guild_trade_revenue') {
          camp.partyStash.gold = (camp.partyStash.gold || 0) + 500;
          camp.partyStash.history.push({
            date: new Date().toISOString().split('T')[0],
            text: `+500 PO receita fixa semanal da Sede de Guilda`,
            type: 'gold_in'
          });
        } else if (fac.currentOrder.actionKey === 'recruit_defenders') {
          bastion.defenders = Math.min(12, (bastion.defenders || 0) + 4);
        }

        fac.currentOrder = null;
      }
    }
  });

  // 2. Rola na Tabela de Eventos Semanal de Bastião (d100)
  const d100 = Math.floor(Math.random() * 100) + 1;
  let eventEntry = null;
  if (typeof BASTION_EVENTS_TABLE !== 'undefined') {
    eventEntry = BASTION_EVENTS_TABLE.find(e => d100 >= e.range[0] && d100 <= e.range[1]);
  }
  if (!eventEntry) {
    eventEntry = { title: "Tudo em Paz", icon: "🕊️", desc: "A semana transcorre normalmente no Bastião.", effect: "none" };
  }

  let resolutionText = "";

  // Resolução mecânica do evento
  if (eventEntry.effect === 'attack') {
    const wallOpt = BASTION_WALL_OPTIONS[bastion.walls || 'none'];
    const diceCount = wallOpt ? wallOpt.defenseDice : 6;
    let onesRolled = 0;
    const rolls = [];
    for (let i = 0; i < diceCount; i++) {
      const r = Math.floor(Math.random() * 6) + 1;
      rolls.push(r);
      if (r === 1) onesRolled++;
    }

    if (bastion.defenders > 0) {
      const lost = Math.min(bastion.defenders, onesRolled);
      bastion.defenders -= lost;
      resolutionText = `Defensores resistiram ao ataque! Rolagem de invasão (${diceCount}d6): [${rolls.join(', ')}]. Perdas: ${lost} defensores. Restam: ${bastion.defenders}.`;
    } else {
      resolutionText = `Sem defensores! A fortaleza sofreu danos leves e uma das salas precisará de reparos.`;
    }
  } else if (eventEntry.effect === 'treasure') {
    camp.partyStash.gold = (camp.partyStash.gold || 0) + 150;
    camp.partyStash.history.push({
      date: new Date().toISOString().split('T')[0],
      text: `+150 PO tesouro escondido encontrado no Bastião`,
      type: 'gold_in'
    });
    resolutionText = `Ouro antigo (+150 PO) adicionado diretamente ao Baú Coletivo do Grupo!`;
  } else if (eventEntry.effect === 'blessing') {
    camp.partyStash.gold = (camp.partyStash.gold || 0) + 300;
    camp.partyStash.history.push({
      date: new Date().toISOString().split('T')[0],
      text: `+300 PO bênção divina no Bastião`,
      type: 'gold_in'
    });
    resolutionText = `Bênção sagrada concedida! +300 PO creditados no Baú Coletivo e todos os heróis revigorados!`;
  } else if (eventEntry.effect === 'recruits') {
    bastion.defenders = Math.min(12, (bastion.defenders || 0) + 2);
    resolutionText = `+2 guardas leais voluntários juntaram-se à guarnição da fortaleza!`;
  } else {
    resolutionText = `Nenhum dano sofrido. As atividades rotineiras prosseguem com tranquilidade.`;
  }

  if (payrollNotice) {
    resolutionText = `[Soldo do Staff]: ${payrollNotice} • ${resolutionText}`;
  }

  // Grava histórico
  bastion.history = bastion.history || [];
  bastion.history.push({
    turn: bastion.turnCount,
    date: new Date().toISOString().split('T')[0],
    roll: d100,
    title: eventEntry.title,
    desc: eventEntry.desc,
    resolution: resolutionText
  });

  touchCampaign(camp);
  saveCampaignsState();
  if (typeof saveToLocalStorage === 'function') saveToLocalStorage();

  renderBastionsTab(camp.id);
  renderCampaigns();
  renderPartyStashViewer();
  if (typeof updateAllPartyStashElements === 'function') updateAllPartyStashElements();

  // Exibe o modal de Evento
  const evIcon = document.getElementById('bastion-event-icon');
  const evRoll = document.getElementById('bastion-event-roll-badge');
  const evTitle = document.getElementById('bastion-event-title-display');
  const evDesc = document.getElementById('bastion-event-desc-display');
  const evRes = document.getElementById('bastion-event-resolution-display');

  if (evIcon) evIcon.innerText = eventEntry.icon || '🎲';
  if (evRoll) evRoll.innerText = `Resultado d100: [ ${d100} ] • Turno ${bastion.turnCount}`;
  if (evTitle) evTitle.innerText = eventEntry.title;
  if (evDesc) evDesc.innerText = eventEntry.desc;
  if (evRes) evRes.innerHTML = `<b>Resolução:</b> ${resolutionText}`;

  const evModal = document.getElementById('modal-bastion-event');
  if (evModal) evModal.style.display = 'flex';

  if (typeof addLog === 'function') {
    addLog(`🏰 <b>Turno do Bastião (${bastion.turnCount}):</b> d100 = ${d100} (${eventEntry.title}). ${completedOrders.length} ordens concluídas.`);
  }
}

function closeBastionEventModal() {
  const modal = document.getElementById('modal-bastion-event');
  if (modal) modal.style.display = 'none';
}

function openBastionAddFacilityModal() {
  const camp = getSelectedBastionCampaign();
  if (!camp) return;

  const bastion = getCampaignBastion(camp);
  const selKey = document.getElementById('sel-new-facility-key');
  const selPatron = document.getElementById('sel-new-facility-patron');

  if (selKey && typeof BASTION_SPECIAL_FACILITIES_CATALOG !== 'undefined') {
    selKey.innerHTML = Object.values(BASTION_SPECIAL_FACILITIES_CATALOG).map(f => `
      <option value="${f.key}">Nv.${f.levelReq} • ${f.icon} ${f.name}</option>
    `).join('');
  }

  if (selPatron) {
    const heroes = (camp.playerIds || []).map(id => PLAYERS.find(p => String(p.id) === String(id))).filter(p => p);
    selPatron.innerHTML = heroes.length > 0 ? heroes.map(h => `
      <option value="${h.id}">${h.name} (${h.className || 'Herói'})</option>
    `).join('') : '<option value="">Sem herói específico</option>';
  }

  updateNewFacilityPreview();

  const modal = document.getElementById('modal-bastion-add-facility');
  if (modal) modal.style.display = 'flex';
}

function closeBastionAddFacilityModal() {
  const modal = document.getElementById('modal-bastion-add-facility');
  if (modal) modal.style.display = 'none';
}

function updateNewFacilityPreview() {
  const preview = document.getElementById('new-facility-preview-card');
  const selKey = document.getElementById('sel-new-facility-key');
  if (!preview || !selKey) return;

  const cat = (typeof BASTION_SPECIAL_FACILITIES_CATALOG !== 'undefined') ? BASTION_SPECIAL_FACILITIES_CATALOG[selKey.value] : null;
  if (!cat) {
    preview.innerHTML = '';
    return;
  }

  preview.innerHTML = `
    <div style="font-weight: 800; font-size: 14px; color: #fef08a; display: flex; align-items: center; gap: 6px;">
      <span>${cat.icon}</span>
      <span>${cat.name} (Desbloqueio: Nível ${cat.levelReq})</span>
    </div>
    <div style="margin-top: 4px; color: #e2e8f0;">${cat.desc}</div>
    <div style="margin-top: 6px; font-size: 11px; color: #6ee7b7;">
      <b>Serviçais Dedicados:</b> ${cat.hirelingsCount || 1} contratado(s) mantendo a instalação.
    </div>
  `;
}

function confirmAddBastionFacility() {
  const camp = getSelectedBastionCampaign();
  if (!camp) return;

  const bastion = getCampaignBastion(camp);
  const selKey = document.getElementById('sel-new-facility-key');
  const selPatron = document.getElementById('sel-new-facility-patron');

  const key = selKey ? selKey.value : '';
  const patronId = selPatron ? selPatron.value : '';
  const cat = (typeof BASTION_SPECIAL_FACILITIES_CATALOG !== 'undefined') ? BASTION_SPECIAL_FACILITIES_CATALOG[key] : null;

  if (!cat) return;

  bastion.specialFacilities = bastion.specialFacilities || [];
  bastion.specialFacilities.push({
    id: 'fac_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    key: cat.key,
    name: cat.name,
    patronId: patronId,
    currentOrder: null,
    status: 'active'
  });

  touchCampaign(camp);
  saveCampaignsState();
  if (typeof saveToLocalStorage === 'function') saveToLocalStorage();

  closeBastionAddFacilityModal();
  renderBastionsTab(camp.id);
  renderCampaigns();
  if (typeof addLog === 'function') addLog(`🏗️ <b>Bastião:</b> Nova instalação "${cat.name}" adicionada à fortaleza.`);
}

function removeBastionFacility(facId) {
  const camp = getSelectedBastionCampaign();
  if (!camp) return;

  const bastion = getCampaignBastion(camp);
  if (!bastion || !bastion.specialFacilities) return;

  const fac = bastion.specialFacilities.find(f => f.id === facId);
  if (!fac) return;

  if (confirm(`Deseja realmente desmantelar a instalação "${fac.name}" da fortaleza?`)) {
    bastion.specialFacilities = bastion.specialFacilities.filter(f => f.id !== facId);
    touchCampaign(camp);
    saveCampaignsState();
    if (typeof saveToLocalStorage === 'function') saveToLocalStorage();
    renderBastionsTab(camp.id);
    renderCampaigns();
    if (typeof addLog === 'function') addLog(`🗑️ <b>Bastião:</b> Instalação "${fac.name}" desmantelada.`);
  }
}

function promptUpgradeBastionWalls() {
  const camp = getSelectedBastionCampaign();
  if (!camp) return;

  const bastion = getCampaignBastion(camp);
  if (!bastion) return;
  const bank = getBastionBank(bastion);

  const bankGold = bank.gold || 0;
  const choice = prompt(
    `🏰 APRIMORAMENTO DE MURALHAS DO BASTIÃO\n` +
    `Muralha Atual: ${bastion.walls === 'stone' ? 'Pedra Maciça' : (bastion.walls === 'wood' ? 'Paliçada de Madeira' : 'Nenhuma')}\n` +
    `Saldo no Cofre do Banco: ${bankGold} PO\n\n` +
    `Escolha uma obra para financiar via Cofre do Banco:\n` +
    `1 - Paliçada de Madeira Reforçada (250 PO, Defesa 5d6)\n` +
    `2 - Muralhas de Pedra Maciça (1000 PO, Reduz invasão para 4d6!)\n` +
    `0 - Cancelar`
  );

  if (choice === '1') {
    if (bankGold < 250) {
      alert(`Saldo insuficiente no Cofre do Banco da Fortaleza!\nAs obras de muralha exigem PO guardados no Banco.\n\nNecessário: 250 PO. Disponível no Banco: ${bankGold} PO.\nDeposite ouro no Banco do Bastião antes de iniciar a obra.`);
      return;
    }
    bank.gold -= 250;
    bank.history = bank.history || [];
    bank.history.push({
      type: 'withdraw',
      amount: 250,
      entityName: 'Obras de Defesa',
      reason: 'Construção de Paliçada de Madeira Reforçada',
      date: new Date().toISOString().split('T')[0]
    });
    bastion.walls = 'wood';
    touchCampaign(camp);
    saveCampaignsState();
    renderBastionsTab(camp.id);
    renderCampaigns();
    if (typeof updateAllPartyStashElements === 'function') updateAllPartyStashElements();
    alert('Paliçada de Madeira construída com sucesso ao redor do Bastião! Custo financiado pelo Cofre do Banco.');
  } else if (choice === '2') {
    if (bankGold < 1000) {
      alert(`Saldo insuficiente no Cofre do Banco da Fortaleza!\nAs obras de muralha exigem PO guardados no Banco.\n\nNecessário: 1000 PO. Disponível no Banco: ${bankGold} PO.\nDeposite ouro no Banco do Bastião antes de iniciar a obra.`);
      return;
    }
    bank.gold -= 1000;
    bank.history = bank.history || [];
    bank.history.push({
      type: 'withdraw',
      amount: 1000,
      entityName: 'Obras de Defesa',
      reason: 'Construção de Muralhas de Pedra Maciça',
      date: new Date().toISOString().split('T')[0]
    });
    bastion.walls = 'stone';
    touchCampaign(camp);
    saveCampaignsState();
    renderBastionsTab(camp.id);
    renderCampaigns();
    if (typeof updateAllPartyStashElements === 'function') updateAllPartyStashElements();
    alert('Muralhas de Pedra Maciça e Portão de Ferro erguidos com sucesso! Custo financiado pelo Cofre do Banco.');
  }
}


// Vincula em window para uso no browser
if (typeof window !== 'undefined') {
  window.touchCampaign = touchCampaign;
  window.trackDeletedCampaignId = trackDeletedCampaignId;
  window.getDeletedCampaignIds = getDeletedCampaignIds;
  window.trackDeletedPartyItemId = trackDeletedPartyItemId;
  window.getDeletedPartyItemIds = getDeletedPartyItemIds;
  window.updateAllPartyStashElements = updateAllPartyStashElements;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getActiveCampaign,
    saveCampaignsState,
    loadCampaignsState,
    renderCampaigns,
    renderCampaignPartyStash,
    renderPartyStashViewer,
    updateAllPartyStashElements,
    openPartyStashModal,
    closePartyStashModal,
    openPartyItemModal,
    closePartyItemModal,
    savePartyItem,
    deletePartyItem,
    addItemToPartyStash,
    clearPartyStashHistory,
    deletePartyStashHistoryItem,
    promptAdjustPartyGold,
    splitPartyGold,
    takePartyItemToPlayer,
    sendPlayerItemToPartyStash,
    getAllCampaignHirelings,
    renderCampaignHirelings,
    updateHirelingMission,
    updateHirelingStatus,
    dismissCampaignHireling,
    payCampaignHirelingsPayroll,
    rollCampaignHirelingsMorale,
    rollSingleHirelingMorale,
    sendHirelingToCombat,
    openAddCampaignHirelingModal,
    closeAddCampaignHirelingModal,
    saveNewCampaignHireling,
    onHirelingPresetChange,
    touchCampaign,
    trackDeletedCampaignId,
    getDeletedCampaignIds,
    trackDeletedPartyItemId,
    getDeletedPartyItemIds,
    deleteCurrentCampaign,
    saveCampaignForm,
    getCampaignBastion,
    renderCampaignBastion,
    openBastionActionModal,
    closeBastionActionModal,
    setBastionActionFilter,
    renderBastionActionsList,
    triggerActivateBastionAction,
    advanceBastionTurn,
    closeBastionEventModal,
    openBastionAddFacilityModal,
    closeBastionAddFacilityModal,
    updateNewFacilityPreview,
    confirmAddBastionFacility,
    removeBastionFacility,
    promptUpgradeBastionWalls,
    renderBastionsTab,
    switchBastionCampaign,
    promptEditBastionInfo,
    getSelectedBastionCampaign,
    getCampaignPlayers,
    getBastionBank,
    getBastionStaff,
    openBastionBankModal,
    closeBastionBankModal,
    setBastionBankMode,
    populateBastionBankEntities,
    updateBastionBankEntityLimits,
    addBastionBankAmount,
    setBastionBankMaxAmount,
    submitBastionBankOperation,
    clearBastionBankHistory,
    openCreateBastionStaffModal,
    closeCreateBastionStaffModal,
    saveBastionStaffMember,
    deleteBastionStaffMember,
    openAssignBastionNpcModal,
    closeAssignBastionNpcModal,
    confirmAssignBastionNpc,
    unassignBastionNpc,
    BASTION_STAFF_ICON_PRESETS,
    getBastionStaffMasteryInfo,
    calculateBastionStaffWage,
    onBastionStaffIconChange,
    onBastionStaffLevelChange,
    promoteBastionStaffMember,
    getPartyItemCategoryIcon,
    isCarrierStash,
    filterPartyStashItems,
    renderStashSummaryToolbar,
    renderPartyStashItemRowHtml,
    setPartyStashCategoryFilter,
    handlePartyStashSearch,
    adjustPartyItemQty,
    returnPartyItemToStash,
    lookupCompendiumEquipmentMeta,
    onQuickAddStashNameInput,
    onModalPartyItemNameInput,
    submitQuickAddPartyItem,
    quickAddPresetPartyItem,
    quickAdjustPartyGold,
    submitInlinePartyGold,
    rollDmgGemToStash,
    rollDmgArtToStash,
    rollDmgMagicItemToStash,
    rollDmgTreasureHoardToStash
  };
}

if (typeof window !== 'undefined') {
  window.rollDmgGemToStash = rollDmgGemToStash;
  window.rollDmgArtToStash = rollDmgArtToStash;
  window.rollDmgMagicItemToStash = rollDmgMagicItemToStash;
  window.rollDmgTreasureHoardToStash = rollDmgTreasureHoardToStash;
  window.getPartyItemCategoryIcon = getPartyItemCategoryIcon;
  window.isCarrierStash = isCarrierStash;
  window.filterPartyStashItems = filterPartyStashItems;
  window.renderStashSummaryToolbar = renderStashSummaryToolbar;
  window.renderPartyStashItemRowHtml = renderPartyStashItemRowHtml;
  window.setPartyStashCategoryFilter = setPartyStashCategoryFilter;
  window.handlePartyStashSearch = handlePartyStashSearch;
  window.adjustPartyItemQty = adjustPartyItemQty;
  window.returnPartyItemToStash = returnPartyItemToStash;
  window.lookupCompendiumEquipmentMeta = lookupCompendiumEquipmentMeta;
  window.onQuickAddStashNameInput = onQuickAddStashNameInput;
  window.onModalPartyItemNameInput = onModalPartyItemNameInput;
  window.submitQuickAddPartyItem = submitQuickAddPartyItem;
  window.quickAddPresetPartyItem = quickAddPresetPartyItem;
  window.quickAdjustPartyGold = quickAdjustPartyGold;
  window.submitInlinePartyGold = submitInlinePartyGold;
  window.sendPlayerItemToPartyStash = sendPlayerItemToPartyStash;
  window.openPartyStashModal = openPartyStashModal;
  window.closePartyStashModal = closePartyStashModal;
  window.renderPartyStashViewer = renderPartyStashViewer;
  window.addItemToPartyStash = addItemToPartyStash;
  window.takePartyItemToPlayer = takePartyItemToPlayer;
  window.promptAdjustPartyGold = promptAdjustPartyGold;
  window.splitPartyGold = splitPartyGold;
  window.renderCampaignHirelings = renderCampaignHirelings;
  window.updateHirelingMission = updateHirelingMission;
  window.updateHirelingStatus = updateHirelingStatus;
  window.dismissCampaignHireling = dismissCampaignHireling;
  window.payCampaignHirelingsPayroll = payCampaignHirelingsPayroll;
  window.rollCampaignHirelingsMorale = rollCampaignHirelingsMorale;
  window.rollSingleHirelingMorale = rollSingleHirelingMorale;
  window.sendHirelingToCombat = sendHirelingToCombat;
  window.openAddCampaignHirelingModal = openAddCampaignHirelingModal;
  window.closeAddCampaignHirelingModal = closeAddCampaignHirelingModal;
  window.saveNewCampaignHireling = saveNewCampaignHireling;
  window.onHirelingPresetChange = onHirelingPresetChange;
  window.getCampaignBastion = getCampaignBastion;
  window.renderCampaignBastion = renderCampaignBastion;
  window.openBastionActionModal = openBastionActionModal;
  window.closeBastionActionModal = closeBastionActionModal;
  window.setBastionActionFilter = setBastionActionFilter;
  window.renderBastionActionsList = renderBastionActionsList;
  window.triggerActivateBastionAction = triggerActivateBastionAction;
  window.advanceBastionTurn = advanceBastionTurn;
  window.closeBastionEventModal = closeBastionEventModal;
  window.openBastionAddFacilityModal = openBastionAddFacilityModal;
  window.closeBastionAddFacilityModal = closeBastionAddFacilityModal;
  window.updateNewFacilityPreview = updateNewFacilityPreview;
  window.confirmAddBastionFacility = confirmAddBastionFacility;
  window.removeBastionFacility = removeBastionFacility;
  window.promptUpgradeBastionWalls = promptUpgradeBastionWalls;
  window.renderBastionsTab = renderBastionsTab;
  window.switchBastionCampaign = switchBastionCampaign;
  window.promptEditBastionInfo = promptEditBastionInfo;
  window.getSelectedBastionCampaign = getSelectedBastionCampaign;
  window.getCampaignPlayers = getCampaignPlayers;
  window.getBastionBank = getBastionBank;
  window.getBastionStaff = getBastionStaff;
  window.openBastionBankModal = openBastionBankModal;
  window.closeBastionBankModal = closeBastionBankModal;
  window.setBastionBankMode = setBastionBankMode;
  window.populateBastionBankEntities = populateBastionBankEntities;
  window.updateBastionBankEntityLimits = updateBastionBankEntityLimits;
  window.addBastionBankAmount = addBastionBankAmount;
  window.setBastionBankMaxAmount = setBastionBankMaxAmount;
  window.submitBastionBankOperation = submitBastionBankOperation;
  window.clearBastionBankHistory = clearBastionBankHistory;
  window.openCreateBastionStaffModal = openCreateBastionStaffModal;
  window.closeCreateBastionStaffModal = closeCreateBastionStaffModal;
  window.saveBastionStaffMember = saveBastionStaffMember;
  window.deleteBastionStaffMember = deleteBastionStaffMember;
  window.openAssignBastionNpcModal = openAssignBastionNpcModal;
  window.closeAssignBastionNpcModal = closeAssignBastionNpcModal;
  window.confirmAssignBastionNpc = confirmAssignBastionNpc;
  window.unassignBastionNpc = unassignBastionNpc;
  window.BASTION_STAFF_ICON_PRESETS = BASTION_STAFF_ICON_PRESETS;
  window.getBastionStaffMasteryInfo = getBastionStaffMasteryInfo;
  window.calculateBastionStaffWage = calculateBastionStaffWage;
  window.onBastionStaffIconChange = onBastionStaffIconChange;
  window.onBastionStaffLevelChange = onBastionStaffLevelChange;
  window.promoteBastionStaffMember = promoteBastionStaffMember;
}

// Auto-carregamento imediato na avaliação do módulo
try {
  loadCampaignsState();
} catch (e) {}

