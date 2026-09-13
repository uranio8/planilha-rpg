// src/js/firebase_sync.js - Módulo de Sincronização em Nuvem em Tempo Real com Google Firebase Firestore

const FIREBASE_CONFIG_KEY = 'dnd5e_firebase_config';
const FIREBASE_ROOM_KEY = 'dnd5e_firebase_room';
const FIREBASE_AUTOSYNC_KEY = 'dnd5e_firebase_autosync';

let firebaseApp = null;
let firestoreDb = null;
let firebaseUnsubscribe = null;
let isFirebaseConnected = false;
let isFirebaseSyncing = false;
let isApplyingCloudUpdate = false;
let firebaseCloudDebounceTimer = null;
let localClientId = 'client_' + Math.random().toString(36).substring(2, 9);

// --- UTILITÁRIOS DE CONFIGURAÇÃO ---

function getStoredFirebaseConfig() {
  try {
    const raw = localStorage.getItem(FIREBASE_CONFIG_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

function saveFirebaseConfigToStorage(configObj) {
  try {
    if (!configObj) {
      localStorage.removeItem(FIREBASE_CONFIG_KEY);
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
  return localStorage.getItem(FIREBASE_AUTOSYNC_KEY) !== 'false';
}

function setFirebaseAutoSyncEnabled(enabled) {
  localStorage.setItem(FIREBASE_AUTOSYNC_KEY, enabled ? 'true' : 'false');
}

// --- INICIALIZAÇÃO DO FIREBASE ---

let realtimeDb = null;

function initFirebaseSync() {
  const config = getStoredFirebaseConfig();
  if (!config || !config.apiKey || (!config.projectId && !config.databaseURL)) {
    updateFirebaseUiStatus('offline', 'Modo Local');
    return false;
  }

  if (typeof firebase === 'undefined') {
    console.warn('SDK do Firebase não encontrado no navegador.');
    updateFirebaseUiStatus('offline', 'SDK Indisponível');
    return false;
  }

  try {
    if (!firebase.apps || firebase.apps.length === 0) {
      firebaseApp = firebase.initializeApp(config);
    } else {
      firebaseApp = firebase.apps[0];
    }

    // Suporte tanto para Realtime Database quanto para Firestore
    if (typeof firebase.database === 'function' && (config.databaseURL || !config.projectId)) {
      realtimeDb = firebase.database();
    }
    if (typeof firebase.firestore === 'function') {
      try {
        firestoreDb = firebase.firestore();
        firestoreDb.enablePersistence({ synchronizeTabs: true }).catch(err => {});
      } catch (e) {}
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
    updateFirebaseUiStatus('error', 'Erro na Chave');
    return false;
  }
}

// --- ESCUTA EM TEMPO REAL (REALTIME SNAPSHOTS) ---

function startFirebaseRoomListener(roomId) {
  if (!firestoreDb) return;

  if (firebaseUnsubscribe) {
    firebaseUnsubscribe();
    firebaseUnsubscribe = null;
  }

  const roomDocRef = firestoreDb.collection('dnd_rooms').doc(roomId);

  firebaseUnsubscribe = roomDocRef.onSnapshot(
    docSnapshot => {
      if (!docSnapshot.exists) {
        console.log(`Sala '${roomId}' ainda não possui dados na nuvem. Criando ao salvar.`);
        return;
      }

      const cloudData = docSnapshot.data();
      if (!cloudData) return;

      // Evita aplicar a alteração que este próprio cliente acabou de emitir
      if (cloudData.lastUpdatedBy === localClientId) {
        return;
      }

      console.log('☁️ Alteração remota recebida do Firebase!');
      applyCloudDataToLocal(cloudData);
    },
    error => {
      console.warn('Erro na escuta em tempo real do Firebase:', error);
      updateFirebaseUiStatus('error', 'Sem Acesso');
    }
  );
}

function applyCloudDataToLocal(cloudData) {
  if (!cloudData) return;
  isApplyingCloudUpdate = true;

  try {
    // 1. Atualiza Fichas de Jogadores
    if (cloudData.players && Array.isArray(cloudData.players)) {
      PLAYERS = cloudData.players.map(p => {
        if (!p.skillProficiencies) p.skillProficiencies = [];
        if (!p.saveProficiencies) p.saveProficiencies = [];
        if (!p.actionLogs) p.actionLogs = [];
        if (p.playerNotes === undefined) p.playerNotes = '';
        return p;
      });
      if (typeof renderPlayers === 'function') renderPlayers();
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

    // Salva no cache local (localStorage) sem re-despachar para a nuvem
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        players: PLAYERS,
        state: state,
        gridState: (typeof gridState !== 'undefined') ? gridState : null
      }));
    } catch (e) {}

    updateFirebaseUiStatus('connected', `Sincronizado`);
    if (typeof playFX === 'function') playFX('dice');
  } catch (e) {
    console.error('Erro ao aplicar dados recebidos da nuvem:', e);
  } finally {
    setTimeout(() => {
      isApplyingCloudUpdate = false;
    }, 200);
  }
}

// --- DESPACHO DE ALTERAÇÕES LOCAIS PARA A NUVEM ---

function syncLocalChangesToFirebase(immediate = false) {
  if (!isFirebaseConnected || !firestoreDb || isApplyingCloudUpdate) return;
  if (!isFirebaseAutoSyncEnabled()) return;

  if (firebaseCloudDebounceTimer) {
    clearTimeout(firebaseCloudDebounceTimer);
    firebaseCloudDebounceTimer = null;
  }

  const delay = immediate ? 0 : 600;

  firebaseCloudDebounceTimer = setTimeout(() => {
    executeCloudSave();
  }, delay);
}

function executeCloudSave() {
  if (!isFirebaseConnected || !firestoreDb) return;

  const roomId = getStoredFirebaseRoom();
  const roomDocRef = firestoreDb.collection('dnd_rooms').doc(roomId);

  const payload = {
    players: (typeof PLAYERS !== 'undefined') ? PLAYERS : [],
    state: (typeof state !== 'undefined') ? state : { combatants: [], round: 1, current: 0 },
    lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
    lastUpdatedBy: localClientId,
    lastUpdateIso: new Date().toISOString()
  };

  updateFirebaseUiStatus('syncing', 'Salvando na Nuvem...');

  roomDocRef.set(payload, { merge: true })
    .then(() => {
      updateFirebaseUiStatus('connected', `Nuvem: ${roomId}`);
    })
    .catch(err => {
      console.warn('Erro ao salvar no Firestore:', err);
      updateFirebaseUiStatus('error', 'Falha ao Salvar');
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

  if (!config) {
    diagEl.innerHTML = `
      <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 8px; padding: 10px; font-size: 12px; color: #fca5a5;">
        ❌ <b>Nenhuma chave configurada.</b> O sistema está operando em <b>Modo Local (Offline)</b>.
      </div>
    `;
    return;
  }

  diagEl.innerHTML = `
    <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 8px; padding: 10px; font-size: 12px; color: #6ee7b7;">
      ✅ <b>Projeto Conectado:</b> ${config.projectId || 'Firebase'} • <b>Sala Ativa:</b> <code>${room}</code><br>
      <span style="font-size: 11px; color: var(--text-muted);">Sincronização em tempo real ativa entre computadores e celulares conectados a esta sala.</span>
    </div>
  `;
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
    setFirebaseAutoSyncEnabled(autoSync);
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

    // Converte sintaxe JS (chaves sem aspas) para JSON válido se necessário
    let parsedConfig;
    try {
      parsedConfig = JSON.parse(raw);
    } catch (e) {
      // Tenta avaliar de forma segura com Function
      parsedConfig = new Function(`return (${raw});`)();
    }

    if (!parsedConfig || !parsedConfig.apiKey || !parsedConfig.projectId) {
      alert('Erro: A configuração colada não parece válida. Certifique-se de que ela contenha "apiKey" e "projectId".');
      return;
    }

    saveFirebaseConfigToStorage(parsedConfig);
    setStoredFirebaseRoom(roomId);
    setFirebaseAutoSyncEnabled(autoSync);

    const connected = initFirebaseSync();
    if (connected) {
      alert('🎉 Conexão com o Google Firebase estabelecida com sucesso!\nSuas fichas e combate agora sincronizam na nuvem em tempo real.');
      // Envia os dados atuais como carga inicial
      syncLocalChangesToFirebase(true);
      closeFirebaseModal();
    } else {
      alert('A chave foi salva, mas o Firebase retornou erro de conexão. Verifique se o Firestore está criado no Console do Firebase.');
    }
  } catch (err) {
    alert('Erro ao processar o texto da configuração: ' + err.message);
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
  if (!isFirebaseConnected || !firestoreDb) {
    alert('Conecte o Firebase primeiro.');
    return;
  }
  const roomId = getStoredFirebaseRoom();
  updateFirebaseUiStatus('syncing', 'Buscando dados...');

  firestoreDb.collection('dnd_rooms').doc(roomId).get()
    .then(doc => {
      if (doc.exists) {
        applyCloudDataToLocal(doc.data());
        alert('⬇️ Fichas e estado de combate atualizados a partir da nuvem!');
      } else {
        alert(`A sala '${roomId}' ainda não possui dados na nuvem.`);
      }
    })
    .catch(err => {
      alert('Erro ao buscar dados da nuvem: ' + err.message);
    });
}
