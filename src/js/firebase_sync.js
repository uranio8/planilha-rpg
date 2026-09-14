// src/js/firebase_sync.js - Módulo de Sincronização em Nuvem em Tempo Real com Google Firebase Firestore & Realtime Database

const FIREBASE_CONFIG_KEY = 'dnd5e_firebase_config';
const FIREBASE_ROOM_KEY = 'dnd5e_firebase_room';
const FIREBASE_AUTOSYNC_KEY = 'dnd5e_firebase_autosync';

const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyDFt7A4FgRlqWXvZwtef8XaVJ1ZBAmlv5w",
  authDomain: "rpg-turma.firebaseapp.com",
  databaseURL: "https://rpg-turma-default-rtdb.firebaseio.com",
  projectId: "rpg-turma",
  storageBucket: "rpg-turma.firebasestorage.app",
  messagingSenderId: "799098415465",
  appId: "1:799098415465:web:f9af316421cf285f4535f8",
  measurementId: "G-Y0J9LESXRF"
};

let firebaseApp = null;
let firestoreDb = null;
let realtimeDb = null;
let firebaseUnsubscribe = null;
let isFirebaseConnected = false;
let isFirebaseSyncing = false;
let isApplyingCloudUpdate = false;
let firebaseCloudDebounceTimer = null;
let localClientId = 'client_' + Math.random().toString(36).substring(2, 9);
let clientRole = (typeof window !== 'undefined' && window.location && (window.location.search.includes('view=player') || window.location.search.includes('player=') || window.location.search.includes('lobby=true') || window.location.search.includes('login=player'))) ? 'player' : 'master';
let isCloudRoomDataLoaded = false;
let lastReceivedCloudData = null;

// --- UTILITÁRIOS DE CONFIGURAÇÃO ---

function getStoredFirebaseConfig() {
  try {
    const raw = localStorage.getItem(FIREBASE_CONFIG_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return DEFAULT_FIREBASE_CONFIG;
}

function saveFirebaseConfigToStorage(configObj) {
  try {
    if (!configObj) {
      localStorage.setItem(FIREBASE_CONFIG_KEY, JSON.stringify(DEFAULT_FIREBASE_CONFIG));
    } else {
      localStorage.setItem(FIREBASE_CONFIG_KEY, JSON.stringify(configObj));
    }
    return true;
  } catch (e) {
    return false;
  }
}

function getStoredFirebaseRoom() {
  const room = localStorage.getItem(FIREBASE_ROOM_KEY) || 'turma_principal';
  return room.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '_');
}

function setStoredFirebaseRoom(roomId) {
  const clean = (roomId || 'turma_principal').trim().toLowerCase().replace(/[^a-z0-9_-]/g, '_');
  localStorage.setItem(FIREBASE_ROOM_KEY, clean);
  return clean;
}

function isFirebaseAutoSyncEnabled() {
  const stored = localStorage.getItem(FIREBASE_AUTOSYNC_KEY);
  if (stored === null) {
    // Por padrão, se houver chaves configuradas, mantém sincronização ativa
    return true;
  }
  return stored === 'true';
}

function setFirebaseAutoSyncEnabled(enabled) {
  localStorage.setItem(FIREBASE_AUTOSYNC_KEY, enabled ? 'true' : 'false');
}

// --- INICIALIZAÇÃO DO FIREBASE ---

function initFirebaseSync() {
  // Se a sincronização não estiver explicitamente habilitada pelo usuário, opera em modo local seguro
  if (!isFirebaseAutoSyncEnabled()) {
    updateFirebaseUiStatus('offline', 'Modo Local');
    return false;
  }

  const config = getStoredFirebaseConfig();
  if (!config || !config.apiKey || (!config.projectId && !config.databaseURL)) {
    updateFirebaseUiStatus('offline', 'Modo Local');
    return false;
  }

  if (typeof firebase === 'undefined') {
    console.warn('SDK do Firebase não encontrado no navegador.');
    updateFirebaseUiStatus('offline', 'SDK Bloqueado / Offline');
    return false;
  }

  try {
    // Se já existiam instâncias de apps no Firebase, reinicializa para aplicar chaves atualizadas
    if (firebase.apps && firebase.apps.length > 0) {
      try {
        firebase.apps.forEach(app => {
          if (app && typeof app.delete === 'function') app.delete().catch(() => {});
        });
      } catch (e) {}
    }

    // Auto-deriva a URL do Realtime Database se faltar no objeto colado do console
    const finalConfig = Object.assign({}, config);
    if (!finalConfig.databaseURL && finalConfig.projectId) {
      finalConfig.databaseURL = `https://${finalConfig.projectId}-default-rtdb.firebaseio.com`;
    }

    firebaseApp = firebase.initializeApp(finalConfig);

    // 1. Suporte prioritário para Realtime Database (conforme configurado no console)
    if (typeof firebase.database === 'function') {
      try {
        realtimeDb = firebase.database();
      } catch (e) {
        console.warn('Realtime Database fallback:', e);
      }
    }

    // 2. Suporte para Cloud Firestore
    if (typeof firebase.firestore === 'function') {
      try {
        firestoreDb = firebase.firestore();
      } catch (e) {
        console.warn('Firestore fallback:', e);
      }
    }

    isFirebaseConnected = true;
    const currentRoom = getStoredFirebaseRoom();
    updateFirebaseUiStatus('connected', `Nuvem: ${currentRoom}`);

    // Inicia a escuta em tempo real
    startFirebaseRoomListener(currentRoom);

    console.log('✅ Google Firebase conectado com sucesso! Sala:', currentRoom);
    return true;
  } catch (err) {
    console.error('Erro ao conectar ao Firebase:', err);
    isFirebaseConnected = false;
    updateFirebaseUiStatus('error', 'Erro na Conexão');
    return false;
  }
}

// --- ESCUTA EM TEMPO REAL (REALTIME SNAPSHOTS) ---

function startFirebaseRoomListener(roomId) {
  if (firebaseUnsubscribe) {
    firebaseUnsubscribe();
    firebaseUnsubscribe = null;
  }

  // 1. Escuta via Realtime Database
  if (realtimeDb) {
    const rtdbRef = realtimeDb.ref('dnd_rooms/' + roomId);
    const callback = snapshot => {
      const cloudData = snapshot.val();
      if (!cloudData) return;
      if (cloudData.lastUpdatedBy === localClientId) return;
      console.log('☁️ Alteração remota recebida do Realtime Database!');
      applyCloudDataToLocal(cloudData);
    };
    rtdbRef.on('value', callback);
    firebaseUnsubscribe = () => rtdbRef.off('value', callback);
    return;
  }

  // 2. Escuta via Firestore
  if (firestoreDb) {
    const roomDocRef = firestoreDb.collection('dnd_rooms').doc(roomId);
    firebaseUnsubscribe = roomDocRef.onSnapshot(
      docSnapshot => {
        if (!docSnapshot.exists) return;
        const cloudData = docSnapshot.data();
        if (!cloudData) return;
        if (cloudData.lastUpdatedBy === localClientId) return;
        console.log('☁️ Alteração remota recebida do Firestore!');
        applyCloudDataToLocal(cloudData);
      },
      error => {
        console.warn('Erro na escuta do Firestore:', error);
      }
    );
  }
}

function mergeCloudCampaignsState(cloudCampaignsState) {
  if (!cloudCampaignsState || !Array.isArray(cloudCampaignsState.campaigns)) return;
  if (typeof CAMPAIGNS_STATE === 'undefined') return;

  if (!CAMPAIGNS_STATE.campaigns || CAMPAIGNS_STATE.campaigns.length === 0) {
    CAMPAIGNS_STATE = cloudCampaignsState;
    return;
  }

  cloudCampaignsState.campaigns.forEach(remoteCamp => {
    const localCamp = CAMPAIGNS_STATE.campaigns.find(c => c.id === remoteCamp.id);
    if (!localCamp) {
      CAMPAIGNS_STATE.campaigns.push(remoteCamp);
    } else {
      // Mescla diário de sessões garantindo que nenhuma sessão local seja perdida ou apagada
      const localSessions = localCamp.sessions || [];
      const remoteSessions = remoteCamp.sessions || [];
      const mergedSessions = [...localSessions];

      remoteSessions.forEach(rs => {
        const localIdx = mergedSessions.findIndex(ls => ls.id === rs.id || (ls.number === rs.number && ls.date === rs.date));
        if (localIdx >= 0) {
          if ((rs.notes || '').length > (mergedSessions[localIdx].notes || '').length) {
            mergedSessions[localIdx] = Object.assign({}, mergedSessions[localIdx], rs);
          }
        } else {
          mergedSessions.push(rs);
        }
      });

      localCamp.sessions = mergedSessions;
      if (remoteCamp.name) localCamp.name = remoteCamp.name;
      if (remoteCamp.system) localCamp.system = remoteCamp.system;
      if (remoteCamp.description) localCamp.description = remoteCamp.description;

      // Mescla Baú do Grupo e Tesouro
      if (remoteCamp.partyStash) {
        if (!localCamp.partyStash) {
          localCamp.partyStash = remoteCamp.partyStash;
        } else {
          if (remoteCamp.partyStash.gold !== undefined && (!localCamp.partyStash.gold || localCamp.partyStash.gold === 0)) {
            localCamp.partyStash.gold = remoteCamp.partyStash.gold;
          }
          const localItems = localCamp.partyStash.items || [];
          const remoteItems = remoteCamp.partyStash.items || [];
          const mergedItems = [...localItems];
          remoteItems.forEach(ri => {
            if (!mergedItems.some(li => li.id === ri.id || li.name === ri.name)) {
              mergedItems.push(ri);
            }
          });
          localCamp.partyStash.items = mergedItems;

          const localHist = localCamp.partyStash.history || [];
          const remoteHist = remoteCamp.partyStash.history || [];
          const mergedHist = [...localHist];
          remoteHist.forEach(rh => {
            if (!mergedHist.some(lh => lh.id === rh.id || (lh.timestamp === rh.timestamp && lh.item === rh.item))) {
              mergedHist.push(rh);
            }
          });
          localCamp.partyStash.history = mergedHist;
        }
      }
    }
  });
}

function applyCloudDataToLocal(cloudData) {
  if (!cloudData) return;

  isCloudRoomDataLoaded = true;
  lastReceivedCloudData = cloudData;

  // Proteção: Se a nuvem estiver vazia/zerada e tivermos fichas locais válidas,
  // APENAS o Mestre pode publicar manualmente via publishMasterCampaignToCloud.
  // Um cliente/jogador (role === 'player') NUNCA deve subir seus dados locais (ou mocks) para a nuvem!
  const localHasPlayers = (typeof PLAYERS !== 'undefined' && Array.isArray(PLAYERS) && PLAYERS.length > 0);
  const cloudHasPlayers = (cloudData.players && Array.isArray(cloudData.players) && cloudData.players.length > 0);

  if (localHasPlayers && !cloudHasPlayers) {
    console.warn('🛡️ Nuvem vazia detectada! Preservando fichas locais.');
    if (typeof renderPlayerLoginList === 'function') renderPlayerLoginList();
    return;
  }

  isApplyingCloudUpdate = true;

  try {
    // 0. Salva Snapshot de Segurança Automático antes de aplicar alterações remotas
    if (typeof saveSafetySnapshot === 'function') {
      saveSafetySnapshot('Antes de aplicar sincronização da Nuvem');
    }

    // 1. Atualiza Fichas de Jogadores com Merge Inteligente (evita sobrescrever alterações locais ativas)
    if (cloudData.players && Array.isArray(cloudData.players)) {
      if (typeof pendingPortalPlayerId !== 'undefined' && pendingPortalPlayerId) {
        // Link curto estava aguardando os dados do herói chegarem da nuvem
        PLAYERS = cloudData.players;
        const targetHero = PLAYERS.find(p => p.id === pendingPortalPlayerId);
        if (targetHero) {
          if (typeof initPlayerPortalMode === 'function') {
            initPlayerPortalMode(targetHero.id);
          }
        } else {
          console.warn('Herói com ID', pendingPortalPlayerId, 'não encontrado na sala.');
          pendingPortalPlayerId = null;
          if (typeof openPlayerLoginModal === 'function') openPlayerLoginModal();
        }
      } else if (typeof activePortalPlayerId !== 'undefined' && activePortalPlayerId) {
        // Modo Portal do Jogador: mescla dados remotos dos outros heróis e atualiza campos do mestre no herói local
        const localChar = PLAYERS.find(p => p.id === activePortalPlayerId);
        PLAYERS = cloudData.players.map(remoteP => {
          if (localChar && remoteP.id === activePortalPlayerId) {
            // Preserva inventário e notas locais se o jogador acabou de mexer, mas aceita PV, condições e XP do mestre
            return Object.assign({}, remoteP, {
              hp: remoteP.hp,
              maxHp: remoteP.maxHp,
              tempHp: remoteP.tempHp,
              conditions: remoteP.conditions || localChar.conditions || [],
              xp: remoteP.xp !== undefined ? remoteP.xp : localChar.xp,
              level: remoteP.level || localChar.level,
              // Mantém inventário mais recente entre ambos
              inventory: (localChar.inventory && localChar.inventory.length > 0) ? localChar.inventory : (remoteP.inventory || [])
            });
          }
          return remoteP;
        });
      } else if (clientRole === 'player') {
        // Visão do jogador no lobby antes de escolher o herói: adota os heróis reais da nuvem
        PLAYERS = cloudData.players;
      } else {
        // Modo Mestre: atualiza todos os jogadores recebidos da nuvem
        PLAYERS = cloudData.players.map(p => {
          if (!p.skillProficiencies) p.skillProficiencies = [];
          if (!p.saveProficiencies) p.saveProficiencies = [];
          if (!p.actionLogs) p.actionLogs = [];
          if (p.playerNotes === undefined) p.playerNotes = '';
          return p;
        });
      }

      if (typeof renderPlayers === 'function') renderPlayers();
      if (typeof updatePlayerPortalBanner === 'function') updatePlayerPortalBanner();
      if (typeof renderPlayerLoginList === 'function') renderPlayerLoginList();
    }

    // 2. Atualiza Estado de Combate
    if (cloudData.state && Array.isArray(cloudData.state.combatants)) {
      state = cloudData.state;
      if (typeof renderCombat === 'function') renderCombat();
    }

    // 3. Atualiza Grid de Batalha (Opcional se sincronizado)
    if (cloudData.gridState && typeof gridState !== 'undefined') {
      gridState = Object.assign({}, gridState, cloudData.gridState);
      if (typeof renderBattleGrid === 'function') renderBattleGrid();
      if (typeof renderVttCombatHud === 'function') renderVttCombatHud();
    }

    // 4. Atualiza Campanhas, Baú do Grupo e Mesas de Jogo com mescla inteligente defensiva
    if (cloudData.campaigns && typeof CAMPAIGNS_STATE !== 'undefined') {
      mergeCloudCampaignsState(cloudData.campaigns);
      try {
        localStorage.setItem('dnd5e_prisco_campaigns_v1', JSON.stringify(CAMPAIGNS_STATE));
      } catch(e) {}
      if (typeof renderCampaigns === 'function') renderCampaigns();
      if (typeof renderPartyStashViewer === 'function') renderPartyStashViewer();
    }

    // 5. Atualiza Notas Rápidas do Mestre
    if (cloudData.dmNotes && typeof localStorage !== 'undefined') {
      localStorage.setItem('dnd_tracker_dm_notes_v3', cloudData.dmNotes);
      const notesEl = document.getElementById('inp-dm-quick-notes');
      if (notesEl) notesEl.value = cloudData.dmNotes;
    }

    // Salva no cache local sincronizando todas as chaves e snapshots
    if (typeof saveToLocalStorage === 'function') {
      saveToLocalStorage();
    } else {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          players: PLAYERS,
          state: state,
          gridState: (typeof gridState !== 'undefined') ? gridState : null
        }));
      } catch (e) {}
    }

    console.log('✅ Sincronização em Nuvem aplicada com sucesso!');
  } catch (err) {
    console.error('Erro ao processar dados da nuvem:', err);
  } finally {
    isApplyingCloudUpdate = false;
  }
}

// --- DESPACHO DE ALTERAÇÕES LOCAIS PARA A NUVEM ---

function syncLocalChangesToFirebase(immediate = false) {
  if (!isFirebaseConnected || (!firestoreDb && !realtimeDb) || isApplyingCloudUpdate) return;
  if (!isFirebaseAutoSyncEnabled()) return;

  if (firebaseCloudDebounceTimer) {
    clearTimeout(firebaseCloudDebounceTimer);
    firebaseCloudDebounceTimer = null;
  }

  const delay = immediate ? 0 : 500;

  firebaseCloudDebounceTimer = setTimeout(() => {
    executeCloudSave();
  }, delay);
}

function executeCloudSave() {
  if (!isFirebaseConnected || (!firestoreDb && !realtimeDb)) return;

  // Segurança: se for cliente jogador, apenas envia atualizações do seu próprio herói
  if (clientRole === 'player') {
    executePlayerCloudSave();
    return;
  }

  const roomId = getStoredFirebaseRoom();
  const payload = {
    players: (typeof PLAYERS !== 'undefined') ? PLAYERS : [],
    state: (typeof state !== 'undefined') ? state : { combatants: [], round: 1, current: 0 },
    gridState: (typeof gridState !== 'undefined') ? gridState : null,
    campaigns: (typeof CAMPAIGNS_STATE !== 'undefined') ? CAMPAIGNS_STATE : null,
    dmNotes: (typeof localStorage !== 'undefined') ? (localStorage.getItem('dnd_tracker_dm_notes_v3') || '') : '',
    lastUpdatedBy: localClientId,
    lastUpdateIso: new Date().toISOString(),
    publishedBy: 'master'
  };

  updateFirebaseUiStatus('syncing', 'Salvando...');

  // Salva no Realtime Database
  if (realtimeDb) {
    realtimeDb.ref('dnd_rooms/' + roomId).set(payload)
      .then(() => {
        updateFirebaseUiStatus('connected', `Nuvem: ${roomId}`);
      })
      .catch(err => {
        console.warn('Erro ao salvar no Realtime DB:', err);
      });
  }

  // Salva no Firestore
  if (firestoreDb) {
    const roomDocRef = firestoreDb.collection('dnd_rooms').doc(roomId);
    roomDocRef.set(payload, { merge: true })
      .then(() => {
        updateFirebaseUiStatus('connected', `Nuvem: ${roomId}`);
      })
      .catch(err => {
        console.warn('Erro ao salvar no Firestore:', err);
      });
  }
}

function executePlayerCloudSave() {
  if (!isFirebaseConnected || !activePortalPlayerId) return;
  const myPlayer = (typeof PLAYERS !== 'undefined') ? PLAYERS.find(p => p.id === activePortalPlayerId) : null;
  if (!myPlayer) return;

  const roomId = getStoredFirebaseRoom();
  if (realtimeDb) {
    realtimeDb.ref(`dnd_rooms/${roomId}/players`).transaction(playersList => {
      if (!Array.isArray(playersList)) return playersList;
      const idx = playersList.findIndex(p => p.id === activePortalPlayerId);
      if (idx >= 0) {
        playersList[idx] = Object.assign({}, playersList[idx], myPlayer);
      }
      return playersList;
    }).catch(err => console.warn('Erro ao sincronizar ficha do jogador:', err));
  }
}

function publishMasterCampaignToCloud(silent = false) {
  if (!isFirebaseConnected) {
    initFirebaseSync();
  }

  if (!silent && typeof saveSafetySnapshot === 'function') {
    saveSafetySnapshot('Backup antes de Publicar Mesa na Nuvem');
  }

  const activeCamp = (typeof getActiveCampaign === 'function') ? getActiveCampaign() : null;
  let roomId = getStoredFirebaseRoom();
  if ((!roomId || roomId === 'turma_principal') && activeCamp && activeCamp.name) {
    const derived = activeCamp.name.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9_-]/g, '_');
    if (derived) {
      setStoredFirebaseRoom(derived);
      roomId = derived;
    }
  }

  const payload = {
    room: roomId,
    campaignName: activeCamp ? activeCamp.name : roomId,
    campaigns: (typeof CAMPAIGNS_STATE !== 'undefined') ? CAMPAIGNS_STATE : null,
    players: (typeof PLAYERS !== 'undefined') ? PLAYERS : [],
    state: (typeof state !== 'undefined') ? state : { combatants: [], round: 1, current: 0 },
    gridState: (typeof gridState !== 'undefined') ? gridState : null,
    dmNotes: (typeof localStorage !== 'undefined') ? (localStorage.getItem('dnd_tracker_dm_notes_v3') || '') : '',
    lastUpdatedBy: localClientId,
    publishedAtIso: new Date().toISOString(),
    publishedBy: 'master'
  };

  updateFirebaseUiStatus('syncing', 'Publicando...');

  const promises = [];
  if (realtimeDb) {
    promises.push(realtimeDb.ref('dnd_rooms/' + roomId).set(payload));
  }
  if (firestoreDb) {
    const roomDocRef = firestoreDb.collection('dnd_rooms').doc(roomId);
    promises.push(roomDocRef.set(payload, { merge: true }));
  }

  if (promises.length === 0) {
    if (!silent) alert(`⚠️ Conexão com Firebase não está pronta. Verifique sua conexão com a internet para publicar na sala '${roomId}'.`);
    return;
  }

  Promise.all(promises)
    .then(() => {
      updateFirebaseUiStatus('connected', `Nuvem: ${roomId}`);
      if (typeof addLog === 'function' && !silent) {
        addLog(`📡 <b>Mesa Publicada:</b> Sala <b>${roomId}</b> com ${payload.players.length} personagens sincronizada na nuvem!`);
      }
      if (!silent) {
        alert(`✅ Mesa publicada com sucesso na sala: ${roomId}!\n\n${payload.players.length} personagens estão disponíveis para os alunos no link do lobby.`);
      }
    })
    .catch(err => {
      console.error('Erro ao publicar mesa na nuvem:', err);
      updateFirebaseUiStatus('error', 'Erro na Publicação');
      if (!silent) alert(`⚠️ Erro ao publicar mesa na nuvem: ${err.message || err}.`);
    });
}

// --- INTERFACE DO USUÁRIO & MODAL DE CONFIGURAÇÃO ---

function updateFirebaseUiStatus(status, text) {
  const badge = document.getElementById('firebase-status-badge');
  const textEl = document.getElementById('firebase-status-text');
  const dotEl = document.getElementById('firebase-status-dot');

  if (badge) {
    badge.className = `firebase-status-pill ${status}`;
  }
  if (textEl) {
    textEl.innerText = text || (status === 'connected' ? 'Nuvem Conectada' : 'Modo Local');
  }
  if (dotEl) {
    dotEl.style.backgroundColor = status === 'connected' ? '#10b981' : (status === 'syncing' ? '#fbbf24' : (status === 'error' ? '#f87171' : '#64748b'));
  }
}

function openFirebaseModal() {
  const modal = document.getElementById('modal-firebase-config');
  if (!modal) return;

  const config = getStoredFirebaseConfig();
  const room = getStoredFirebaseRoom();
  const autoSync = isFirebaseAutoSyncEnabled();

  const inpConfig = document.getElementById('inp-firebase-config');
  const inpRoom = document.getElementById('inp-firebase-room');
  const chkAutoSync = document.getElementById('chk-firebase-autosync');

  if (inpConfig) {
    inpConfig.value = config ? JSON.stringify(config, null, 2) : '';
  }
  if (inpRoom) {
    inpRoom.value = room || 'turma_principal';
  }
  if (chkAutoSync) {
    chkAutoSync.checked = autoSync;
  }

  renderFirebaseModalDiagnostic();
  modal.classList.add('open');
}

function closeFirebaseModal() {
  const modal = document.getElementById('modal-firebase-config');
  if (!modal) return;
  modal.classList.remove('open');
}

function renderFirebaseModalDiagnostic() {
  const diagEl = document.getElementById('firebase-modal-diag');
  if (!diagEl) return;

  const config = getStoredFirebaseConfig();
  const room = getStoredFirebaseRoom();
  const isAuto = isFirebaseAutoSyncEnabled();

  if (!config || !config.apiKey) {
    diagEl.innerHTML = `
      <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 8px; padding: 10px; font-size: 12px; color: #fca5a5;">
        ❌ <b>Nenhuma chave configurada.</b> O sistema está operando em <b>Modo Local (Offline)</b>.
      </div>
    `;
    return;
  }

  if (typeof firebase === 'undefined') {
    diagEl.innerHTML = `
      <div style="background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.35); border-radius: 8px; padding: 10px; font-size: 12px; color: #fde047;">
        ⚠️ <b>SDK do Firebase não detectado:</b> Verifique se há algum bloqueador de anúncios ou extensão de privacidade (ex: uBlock, AdBlock, Brave Shields) bloqueando o carregamento dos scripts do Google.
      </div>
    `;
    return;
  }

  if (isFirebaseConnected) {
    diagEl.innerHTML = `
      <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 8px; padding: 10px; font-size: 12px; color: #6ee7b7;">
        ✅ <b>Conectado à Nuvem:</b> Projeto <code>${config.projectId || 'Firebase'}</code> • <b>Sala:</b> <code>${room}</code><br>
        <span style="font-size: 11px; color: #a7f3d0;">Sincronização em tempo real ativa entre computadores e celulares conectados a esta sala.</span>
      </div>
    `;
  } else if (!isAuto) {
    diagEl.innerHTML = `
      <div style="background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.3); border-radius: 8px; padding: 10px; font-size: 12px; color: #93c5fd;">
        ℹ️ <b>Sincronização Pausada:</b> As chaves estão salvas, mas a sincronização automática está desmarcada. Marque a opção abaixo para conectar.
      </div>
    `;
  } else {
    diagEl.innerHTML = `
      <div style="background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 8px; padding: 10px; font-size: 12px; color: #fcd34d;">
        ⚠️ <b>Pronto para Conectar:</b> Chaves detectadas. Clique em <b>Salvar & Conectar</b> para iniciar a sincronização com a nuvem.
      </div>
    `;
  }
}

function parseAndSaveFirebaseModalConfig() {
  const inpConfig = document.getElementById('inp-firebase-config');
  const inpRoom = document.getElementById('inp-firebase-room');
  const chkAutoSync = document.getElementById('chk-firebase-autosync');

  let raw = inpConfig ? inpConfig.value.trim() : '';
  let roomId = inpRoom ? inpRoom.value.trim() : 'turma_principal';
  let autoSync = chkAutoSync ? chkAutoSync.checked : true;

  if (!raw) {
    saveFirebaseConfigToStorage(null);
    setStoredFirebaseRoom(roomId);
    setFirebaseAutoSyncEnabled(false);
    isFirebaseConnected = false;
    updateFirebaseUiStatus('offline', 'Modo Local');
    alert('Configuração do Firebase removida. O sistema voltou ao Modo Local.');
    renderFirebaseModalDiagnostic();
    return;
  }

  // Permite colar tanto o JSON direto quanto o trecho const firebaseConfig = { ... };
  try {
    if (raw.includes('{') && raw.includes('}')) {
      const match = raw.match(/\{[\s\S]*\}/);
      if (match) raw = match[0];
    }

    // Limpa comentários
    raw = raw.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '$1');

    // Converte sintaxe JS para objeto
    let parsedConfig;
    try {
      parsedConfig = JSON.parse(raw);
    } catch (e) {
      parsedConfig = new Function(`return (${raw});`)();
    }

    if (!parsedConfig || !parsedConfig.apiKey || (!parsedConfig.projectId && !parsedConfig.databaseURL)) {
      alert('Erro: A configuração colada não parece válida. Certifique-se de que ela contenha "apiKey" e "projectId" (ou "databaseURL").');
      return;
    }

    saveFirebaseConfigToStorage(parsedConfig);
    setStoredFirebaseRoom(roomId);
    setFirebaseAutoSyncEnabled(true);

    if (typeof firebase === 'undefined') {
      alert('⚠️ Chaves salvas, mas o SDK do Firebase não pôde carregar no navegador.\nVerifique se há bloqueadores de anúncios (uBlock, AdBlock, Brave Shields) ativos.');
      renderFirebaseModalDiagnostic();
      return;
    }

    const connected = initFirebaseSync();
    if (connected) {
      alert(`🎉 Conexão com o Google Firebase estabelecida com sucesso!\n\nSala Ativa: "${roomId}"\nSuas fichas e combate agora sincronizam na nuvem em tempo real com todos os celulares e computadores conectados.`);
      syncLocalChangesToFirebase(true);
      closeFirebaseModal();
    } else {
      alert('A chave foi salva, mas o Firebase retornou erro de conexão.\n\nVerifique no console.firebase.google.com:\n1. Se o banco "Firestore Database" foi criado\n2. Se as Regras (Rules) estão em modo de teste (allow read, write: if true;)');
      renderFirebaseModalDiagnostic();
    }
  } catch (err) {
    alert('Erro ao processar o texto da configuração:\n' + err.message);
  }
}

function manualPushToCloud() {
  if (!isFirebaseConnected) {
    alert('Conecte o Firebase primeiro antes de enviar dados.');
    return;
  }
  executeCloudSave();
  alert('⬆️ Todas as fichas e dados locais foram enviados para a nuvem com sucesso!');
}

function manualPullFromCloud() {
  if (!isFirebaseConnected || (!firestoreDb && !realtimeDb)) {
    alert('Conecte o Firebase primeiro.');
    return;
  }
  const roomId = getStoredFirebaseRoom();
  updateFirebaseUiStatus('syncing', 'Buscando dados...');

  // 1. Busca no Realtime Database
  if (realtimeDb) {
    realtimeDb.ref('dnd_rooms/' + roomId).once('value')
      .then(snapshot => {
        const cloudData = snapshot.val();
        if (cloudData) {
          applyCloudDataToLocal(cloudData);
          alert('⬇️ Fichas e estado de combate atualizados a partir do Realtime Database!');
        } else {
          alert(`A sala '${roomId}' ainda não possui dados salvos na nuvem.`);
        }
      })
      .catch(err => {
        alert('Erro ao buscar dados do Realtime Database: ' + err.message);
      });
    return;
  }

  // 2. Busca no Firestore
  if (firestoreDb) {
    firestoreDb.collection('dnd_rooms').doc(roomId).get()
      .then(doc => {
        if (doc.exists) {
          applyCloudDataToLocal(doc.data());
          alert('⬇️ Fichas e estado de combate atualizados a partir do Firestore!');
        } else {
          alert(`A sala '${roomId}' ainda não possui dados na nuvem.`);
        }
      })
      .catch(err => {
        alert('Erro ao buscar dados do Firestore: ' + err.message);
      });
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getStoredFirebaseConfig,
    saveFirebaseConfigToStorage,
    getStoredFirebaseRoom,
    setStoredFirebaseRoom,
    isFirebaseAutoSyncEnabled,
    setFirebaseAutoSyncEnabled,
    initFirebaseSync,
    applyCloudDataToLocal,
    syncLocalChangesToFirebase,
    executeCloudSave,
    openFirebaseModal,
    closeFirebaseModal,
    manualPushToCloud,
    manualPullFromCloud,
    publishMasterCampaignToCloud,
    executePlayerCloudSave
  };
}
