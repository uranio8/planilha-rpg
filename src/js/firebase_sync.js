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
let hasPendingCloudSync = false;
let cloudSaveStatusTimeout = null;
let localClientId = 'client_' + Math.random().toString(36).substring(2, 9);
var clientRole = (typeof window !== 'undefined' && window.location && (window.location.search.includes('view=player') || window.location.search.includes('player=') || window.location.search.includes('lobby=true') || window.location.search.includes('login=player'))) 
  ? 'player' 
  : ((typeof isMasterAuthorized === 'function' && isMasterAuthorized()) ? 'master' : 'player');

function setClientRole(role) {
  clientRole = role;
  if (typeof window !== 'undefined') window.clientRole = role;
}

function getClientRole() {
  return clientRole;
}

if (typeof window !== 'undefined') {
  window.setClientRole = setClientRole;
  window.getClientRole = getClientRole;
  window.clientRole = clientRole;
}
let isCloudRoomDataLoaded = false;
let lastReceivedCloudData = null;
let cloudSyncCooldownUntil = 0;

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
  return 'turma_principal';
}

function setStoredFirebaseRoom(roomId) {
  try {
    if (typeof localStorage !== 'undefined') localStorage.setItem(FIREBASE_ROOM_KEY, 'turma_principal');
  } catch (e) {}
  return 'turma_principal';
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

    // Se havia alterações locais geradas antes da conexão firmar, despacha para a nuvem
    if (hasPendingCloudSync && clientRole === 'master') {
      hasPendingCloudSync = false;
      setTimeout(() => {
        if (typeof syncLocalChangesToFirebase === 'function') {
          syncLocalChangesToFirebase(true);
        }
      }, 300);
    }

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
      if (!cloudData) {
        isCloudRoomDataLoaded = true;
        if (typeof renderPlayerLoginList === 'function') renderPlayerLoginList();
        // SITUAÇÃO 1: Se a sala na nuvem estiver vazia e o usuário for o Mestre com dados locais, auto-publica silenciosamente
        if (clientRole !== 'player' && typeof publishMasterCampaignToCloud === 'function') {
          const localHasPlayers = (typeof PLAYERS !== 'undefined' && Array.isArray(PLAYERS) && PLAYERS.length > 0);
          if (localHasPlayers) {
            console.log('🚀 Sala vazia no Realtime Database detectada. Auto-publicando estado inicial do mestre...');
            publishMasterCampaignToCloud(true);
          }
        }
        return;
      }
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
        if (!docSnapshot.exists) {
          isCloudRoomDataLoaded = true;
          if (typeof renderPlayerLoginList === 'function') renderPlayerLoginList();
          // SITUAÇÃO 1: Se o documento da sala no Firestore não existir e o usuário for Mestre com dados locais, auto-publica
          if (clientRole !== 'player' && typeof publishMasterCampaignToCloud === 'function') {
            const localHasPlayers = (typeof PLAYERS !== 'undefined' && Array.isArray(PLAYERS) && PLAYERS.length > 0);
            if (localHasPlayers) {
              console.log('🚀 Sala vazia no Firestore detectada. Auto-publicando estado inicial do mestre...');
              publishMasterCampaignToCloud(true);
            }
          }
          return;
        }
        const cloudData = docSnapshot.data();
        if (!cloudData) {
          isCloudRoomDataLoaded = true;
          if (typeof renderPlayerLoginList === 'function') renderPlayerLoginList();
          if (clientRole !== 'player' && typeof publishMasterCampaignToCloud === 'function') {
            const localHasPlayers = (typeof PLAYERS !== 'undefined' && Array.isArray(PLAYERS) && PLAYERS.length > 0);
            if (localHasPlayers) {
              console.log('🚀 Dados vazios no Firestore. Auto-publicando estado inicial do mestre...');
              publishMasterCampaignToCloud(true);
            }
          }
          return;
        }
        if (cloudData.lastUpdatedBy === localClientId) return;
        console.log('☁️ Alteração remota recebida do Firestore!');
        applyCloudDataToLocal(cloudData);
      },
      error => {
        console.warn('Erro na escuta do Firestore:', error);
        isCloudRoomDataLoaded = true;
        if (typeof renderPlayerLoginList === 'function') renderPlayerLoginList();
      }
    );
  }
}

function mergeCloudCampaignsState(cloudCampaignsState) {
  if (!cloudCampaignsState || !Array.isArray(cloudCampaignsState.campaigns)) return;
  if (typeof CAMPAIGNS_STATE === 'undefined') return;

  // Recupera tombstones para não ressuscitar campanhas ou itens deletados
  let deletedCampaignIds = [];
  if (typeof getDeletedCampaignIds === 'function') {
    deletedCampaignIds = getDeletedCampaignIds();
  } else {
    try {
      if (typeof localStorage !== 'undefined') {
        const rawDel = localStorage.getItem('dnd5e_deleted_campaign_ids');
        if (rawDel) deletedCampaignIds = JSON.parse(rawDel);
      }
    } catch(e) {}
  }
  if (!Array.isArray(deletedCampaignIds)) deletedCampaignIds = [];

  let deletedPartyItemIds = [];
  if (typeof getDeletedPartyItemIds === 'function') {
    deletedPartyItemIds = getDeletedPartyItemIds();
  } else {
    try {
      if (typeof localStorage !== 'undefined') {
        const rawDelItems = localStorage.getItem('dnd5e_deleted_stash_item_ids');
        if (rawDelItems) deletedPartyItemIds = JSON.parse(rawDelItems);
      }
    } catch(e) {}
  }
  if (!Array.isArray(deletedPartyItemIds)) deletedPartyItemIds = [];

  const sanitizeRemoteCamp = (c) => {
    if (!c) return c;
    const clean = Object.assign({}, c);
    if (clean.partyStash && Array.isArray(clean.partyStash.items)) {
      clean.partyStash = Object.assign({}, clean.partyStash, {
        items: clean.partyStash.items.filter(it => !deletedPartyItemIds.includes(it.id))
      });
    }
    return clean;
  };

  if (!CAMPAIGNS_STATE.campaigns || CAMPAIGNS_STATE.campaigns.length === 0) {
    const validRemote = (cloudCampaignsState.campaigns || []).filter(c => !deletedCampaignIds.includes(c.id)).map(sanitizeRemoteCamp);
    CAMPAIGNS_STATE = JSON.parse(JSON.stringify(Object.assign({}, cloudCampaignsState, { campaigns: validRemote })));
    return;
  }

  // Detecta se o aparelho local possui apenas a campanha inicial de exemplo (vazia)
  // e a nuvem possui dados reais de campanha (sessões, baú ou IDs de campanha customizados)
  const localIsOnlyEmptyDefault = (
    CAMPAIGNS_STATE.campaigns.length === 1 &&
    CAMPAIGNS_STATE.campaigns[0].id === 'camp_1' &&
    (!CAMPAIGNS_STATE.campaigns[0].sessions || CAMPAIGNS_STATE.campaigns[0].sessions.length === 0)
  );

  const cloudHasRealData = cloudCampaignsState.campaigns.some(c => 
    c.id !== 'camp_1' || (c.sessions && c.sessions.length > 0) || (c.partyStash && c.partyStash.items && c.partyStash.items.length > 0)
  );

  if (localIsOnlyEmptyDefault && cloudHasRealData) {
    const validRemote = cloudCampaignsState.campaigns.filter(c => !deletedCampaignIds.includes(c.id)).map(sanitizeRemoteCamp);
    CAMPAIGNS_STATE = JSON.parse(JSON.stringify(Object.assign({}, cloudCampaignsState, { campaigns: validRemote })));
    return;
  }

  // Sincroniza campanha ativa se indicada pela nuvem e se não tiver sido deletada
  if (cloudCampaignsState.activeCampaignId && !deletedCampaignIds.includes(cloudCampaignsState.activeCampaignId)) {
    if (CAMPAIGNS_STATE.campaigns.some(c => c.id === cloudCampaignsState.activeCampaignId) || cloudCampaignsState.campaigns.some(c => c.id === cloudCampaignsState.activeCampaignId)) {
      CAMPAIGNS_STATE.activeCampaignId = cloudCampaignsState.activeCampaignId;
    }
  }

  cloudCampaignsState.campaigns.forEach(remoteCamp => {
    if (!remoteCamp || !remoteCamp.id) return;
    if (deletedCampaignIds.includes(remoteCamp.id)) return; // Nunca ressuscita campanha excluída

    const localCamp = CAMPAIGNS_STATE.campaigns.find(c => c.id === remoteCamp.id);
    if (!localCamp) {
      CAMPAIGNS_STATE.campaigns.push(sanitizeRemoteCamp(remoteCamp));
    } else {
      const localCampUpdated = localCamp.updatedAt || 0;
      const remoteCampUpdated = remoteCamp.updatedAt || 0;

      if (remoteCampUpdated >= localCampUpdated) {
        if (remoteCamp.name) localCamp.name = remoteCamp.name;
        if (remoteCamp.system) localCamp.system = remoteCamp.system;
        if (remoteCamp.description) localCamp.description = remoteCamp.description;
        if (remoteCamp.updatedAt) localCamp.updatedAt = remoteCamp.updatedAt;
      }

      // Mescla diário de sessões garantindo que nenhuma sessão local seja perdida ou apagada
      const localSessions = localCamp.sessions || [];
      const remoteSessions = remoteCamp.sessions || [];
      const mergedSessions = [...localSessions];

      remoteSessions.forEach(rs => {
        const localIdx = mergedSessions.findIndex(ls => ls.id === rs.id || (ls.number === rs.number && ls.date === rs.date));
        if (localIdx >= 0) {
          const localSess = mergedSessions[localIdx];
          const remoteTime = rs.updatedAt || 0;
          const localTime = localSess.updatedAt || 0;
          if (remoteTime > 0 || localTime > 0) {
            if (remoteTime > localTime) {
              mergedSessions[localIdx] = Object.assign({}, localSess, rs);
            }
          } else {
            // Fallback de compatibilidade caso timestamps ainda não existam
            if ((rs.notes || '').length > (localSess.notes || '').length) {
              mergedSessions[localIdx] = Object.assign({}, localSess, rs);
            }
          }
        } else {
          mergedSessions.push(rs);
        }
      });

      localCamp.sessions = mergedSessions;

      // Mescla Baú do Grupo e Tesouro com controle de timestamps e tombstones
      if (remoteCamp.partyStash) {
        if (!localCamp.partyStash) {
          localCamp.partyStash = Object.assign({}, remoteCamp.partyStash);
          if (localCamp.partyStash.items) {
            localCamp.partyStash.items = localCamp.partyStash.items.filter(it => !deletedPartyItemIds.includes(it.id));
          }
        } else {
          const localStashUpdated = (localCamp.partyStash && localCamp.partyStash.updatedAt) || 0;
          const remoteStashUpdated = (remoteCamp.partyStash && remoteCamp.partyStash.updatedAt) || 0;

          // Mescla Baú do Grupo e Tesouro com controle de timestamps, tombstones e autoridade do Mestre
          const isPlayerClient = (typeof clientRole !== 'undefined' && clientRole === 'player');
          if (isPlayerClient || remoteStashUpdated >= localStashUpdated) {
            // Nuvem do Mestre é autoridade máxima ou é mais recente
            if (remoteCamp.partyStash.gold !== undefined) {
              localCamp.partyStash.gold = remoteCamp.partyStash.gold;
            }
            const remoteItems = (remoteCamp.partyStash.items || []).filter(ri => !deletedPartyItemIds.includes(ri.id));
            localCamp.partyStash.items = remoteItems;
            localCamp.partyStash.updatedAt = Math.max(remoteStashUpdated, localStashUpdated);
          } else {
            // Local tem baú mais recente e é Mestre: preserva ouro e itens locais, filtrando excluídos
            if (localCamp.partyStash.items) {
              localCamp.partyStash.items = localCamp.partyStash.items.filter(li => !deletedPartyItemIds.includes(li.id));
            }
          }

          // Histórico: mescla eventos preservando novos registros
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

  // Normaliza players caso o Realtime Database retorne como objeto/dicionário indexado ({ "0": {...}, "1": {...} })
  if (cloudData.players && typeof cloudData.players === 'object' && !Array.isArray(cloudData.players)) {
    cloudData.players = Object.values(cloudData.players).filter(p => p && typeof p === 'object' && p.id);
  }

  isCloudRoomDataLoaded = true;
  lastReceivedCloudData = cloudData;
  cloudSyncCooldownUntil = Date.now() + 500;

  // Proteção: Se a nuvem estiver vazia/zerada e tivermos fichas locais válidas,
  // APENAS o Mestre pode publicar manualmente via publishMasterCampaignToCloud.
  // Um cliente/jogador (role === 'player') NUNCA deve subir seus dados locais (ou mocks) para a nuvem!
  const localHasPlayers = (typeof PLAYERS !== 'undefined' && Array.isArray(PLAYERS) && PLAYERS.length > 0);
  const cloudHasPlayers = (cloudData.players && Array.isArray(cloudData.players) && cloudData.players.length > 0);
  const cloudHasOtherData = (cloudData.campaigns || cloudData.state || cloudData.gridState || cloudData.dmNotes !== undefined);

  if (localHasPlayers && !cloudHasPlayers && !cloudHasOtherData) {
    console.warn('🛡️ Nuvem vazia detectada! Preservando fichas locais.');
    if (typeof renderPlayerLoginList === 'function') renderPlayerLoginList();
    if (clientRole !== 'player' && typeof publishMasterCampaignToCloud === 'function') {
      console.log('🚀 Auto-publicando fichas locais do mestre para a nuvem recém-criada...');
      publishMasterCampaignToCloud(true);
    }
    return;
  }

  isApplyingCloudUpdate = true;

  // Salva hash sincronizado do PIN do mestre da sala (se disponível)
  if (cloudData.masterPinHash && typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem('dnd5e_cloud_master_pin_hash', cloudData.masterPinHash);
    } catch (e) {}
  }

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
            const localPlayerUpdated = localChar.updatedAt || 0;
            const remotePlayerUpdated = remoteP.updatedAt || 0;
            const isLocalNewer = localPlayerUpdated >= remotePlayerUpdated;
            const isLocalLevelHigher = (localChar.level || 1) > (remoteP.level || 1);
            const isStaleRemoteSnapshot = isLocalLevelHigher && (remotePlayerUpdated <= localPlayerUpdated);

            // Notificação para o jogador quando PV for alterado pelo mestre (apenas se snapshot não for anterior ao level up)
            const hpDiff = (remoteP.hp !== undefined ? remoteP.hp : localChar.hp) - (localChar.hp !== undefined ? localChar.hp : localChar.maxHp);
            if (hpDiff !== 0 && !isStaleRemoteSnapshot && typeof addLog === 'function') {
              if (hpDiff < 0) {
                addLog(`⚔️ <b>Atenção:</b> Você sofreu ${Math.abs(hpDiff)} de dano! (${localChar.hp} ➔ ${remoteP.hp} PV)`);
                if (typeof playFX === 'function') playFX('sword');
              } else {
                addLog(`💚 <b>Cura recebida:</b> +${hpDiff} PV recuperados! (${localChar.hp} ➔ ${remoteP.hp} PV)`);
                if (typeof playFX === 'function') playFX('heal');
              }
            }

            const keepLocalSlots = isLocalNewer && Array.isArray(localChar.slotsUsed);
            const keepLocalFeatures = isLocalNewer && Array.isArray(localChar.featureCharges);

            const resolvedLevel = Math.max(localChar.level || 1, remoteP.level || 1);
            const resolvedMaxHp = isLocalLevelHigher
              ? Math.max(localChar.maxHp || 10, remoteP.maxHp || 10)
              : (remoteP.maxHp !== undefined ? remoteP.maxHp : localChar.maxHp);

            // Se for snapshot defasado pré-level-up, preserva PV local atual; senão aceita dano/cura do mestre
            const resolvedHp = isStaleRemoteSnapshot
              ? (localChar.hp !== undefined ? localChar.hp : resolvedMaxHp)
              : (remoteP.hp !== undefined ? Math.min(resolvedMaxHp, remoteP.hp) : localChar.hp);

            return Object.assign({}, remoteP, {
              hp: resolvedHp,
              maxHp: resolvedMaxHp,
              tempHp: remoteP.tempHp !== undefined ? remoteP.tempHp : localChar.tempHp,
              conditions: remoteP.conditions || localChar.conditions || [],
              xp: remoteP.xp !== undefined ? remoteP.xp : localChar.xp,
              level: resolvedLevel,
              className: isLocalLevelHigher ? (localChar.className || remoteP.className) : (remoteP.className || localChar.className),
              race: isLocalLevelHigher ? (localChar.race || remoteP.race) : (remoteP.race || localChar.race),
              multiclass: isLocalLevelHigher ? (localChar.multiclass || remoteP.multiclass) : (remoteP.multiclass || localChar.multiclass),
              hitDice: isLocalLevelHigher ? (localChar.hitDice || remoteP.hitDice) : (remoteP.hitDice || localChar.hitDice),
              hitDiceCurrent: isLocalLevelHigher ? (localChar.hitDiceCurrent !== undefined ? localChar.hitDiceCurrent : remoteP.hitDiceCurrent) : (remoteP.hitDiceCurrent !== undefined ? remoteP.hitDiceCurrent : localChar.hitDiceCurrent),
              slots: isLocalLevelHigher ? (localChar.slots || remoteP.slots) : (remoteP.slots || localChar.slots),
              slotsUsed: keepLocalSlots ? localChar.slotsUsed : (remoteP.slotsUsed || localChar.slotsUsed || [0, 0, 0, 0, 0]),
              preparedSpells: (localChar.preparedSpells && localChar.preparedSpells.length > 0) ? localChar.preparedSpells : (remoteP.preparedSpells || []),
              spells: (localChar.spells && localChar.spells.length > 0) ? localChar.spells : (remoteP.spells || localChar.spells),
              featureCharges: keepLocalFeatures ? localChar.featureCharges : (remoteP.featureCharges || localChar.featureCharges || []),
              // Mantém inventário mais recente entre ambos
              inventory: (localChar.inventory && localChar.inventory.length > 0) ? localChar.inventory : (remoteP.inventory || []),
              // Preserva moedas do jogador local
              coins: localChar.coins !== undefined ? localChar.coins : (remoteP.coins || { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 }),
              updatedAt: Math.max(localPlayerUpdated, remotePlayerUpdated)
            });
          }
          return remoteP;
        });
      } else if (clientRole === 'player') {
        // Visão do jogador no lobby antes de escolher o herói: adota os heróis reais da nuvem
        PLAYERS = cloudData.players;
      } else {
        // Modo Mestre: SMART MERGE ANTI-PERDA DE FICHAS
        // 1. Obtém lista de exclusões intencionais locais
        let deletedPlayerIds = [];
        try {
          if (typeof localStorage !== 'undefined') {
            const rawDel = localStorage.getItem('dnd5e_deleted_player_ids');
            if (rawDel) deletedPlayerIds = JSON.parse(rawDel);
          }
        } catch (e) {}
        if (!Array.isArray(deletedPlayerIds)) deletedPlayerIds = [];

        const remoteList = Array.isArray(cloudData.players) ? cloudData.players : [];
        const localList = (typeof PLAYERS !== 'undefined' && Array.isArray(PLAYERS)) ? PLAYERS : [];

        // Detecta se nuvem tem apenas mocks default (p1..p5) e local já possui personagens reais
        const isRemoteOnlyMocks = remoteList.length > 0 && remoteList.every(p => ['p1','p2','p3','p4','p5'].includes(p.id));
        const localHasCustomPlayers = localList.some(p => !['p1','p2','p3','p4','p5'].includes(p.id));

        // Detecta se o LOCAL possui apenas mocks padrão (ex: celular ou navegador aberto pela 1ª vez)
        // e a NUVEM já possui personagens reais criados pelo mestre
        const isLocalOnlyDefaultMocks = localList.length > 0 && localList.every(p => 
          ['p1','p2','p3','p4','p5'].includes(p.id) || 
          (p.level === 1 && (p.maxHp || 0) <= 9 && ['p_1788965925056', 'p_1788966076171', 'p_1789144892638'].includes(p.id))
        );
        const remoteHasCustomPlayers = remoteList.some(p => !['p1','p2','p3','p4','p5'].includes(p.id));

        // Se local só tem mocks iniciais e a nuvem tem heróis reais, descarta os mocks para adotar as fichas da nuvem
        const effectiveLocalList = (isLocalOnlyDefaultMocks && remoteHasCustomPlayers) ? [] : localList;

        const mergedMap = new Map();

        // Insere personagens locais (preservando todo trabalho local legítimo)
        for (const localP of effectiveLocalList) {
          if (localP && localP.id) {
            mergedMap.set(localP.id, Object.assign({}, localP));
          }
        }

        // Mescla com personagens remotos da nuvem
        for (const remoteP of remoteList) {
          if (!remoteP || !remoteP.id) continue;
          // Se foi explicitamente deletado pelo mestre localmente, não ressuscita
          if (deletedPlayerIds.includes(remoteP.id)) continue;

          // Se a nuvem tem apenas mocks antigos e o mestre já tem fichas reais personalizadas, não aceita mocks
          if (isRemoteOnlyMocks && localHasCustomPlayers && ['p1','p2','p3','p4','p5'].includes(remoteP.id) && !mergedMap.has(remoteP.id)) {
            continue;
          }

          if (mergedMap.has(remoteP.id)) {
            const currentLocal = mergedMap.get(remoteP.id);
            const remoteUpdated = remoteP.updatedAt || 0;
            const localUpdated = currentLocal.updatedAt || 0;

            const isRemoteLevelHigher = (remoteP.level || 1) > (currentLocal.level || 1);
            // Origem do jogador: se o payload foi publicado por um jogador ou possui updatedBy remoto
            const isPlayerOrigin = (cloudData.publishedBy === 'player') || (remoteP.updatedBy && remoteP.updatedBy !== localClientId);

            let mergedPlayer;
            if (isRemoteLevelHigher) {
              // Nuvem tem nível superior: adota a evolução da nuvem obrigatoriamente
              mergedPlayer = Object.assign({}, currentLocal, remoteP, {
                level: remoteP.level,
                maxHp: Math.max(remoteP.maxHp || 0, currentLocal.maxHp || 0),
                hp: Math.max(remoteP.hp || remoteP.currentHp || remoteP.maxHp || 0, currentLocal.hp || currentLocal.maxHp || 0),
                className: remoteP.className,
                slots: remoteP.slots || currentLocal.slots,
                spells: remoteP.spells || currentLocal.spells,
                hitDice: remoteP.hitDice || currentLocal.hitDice
              });
            } else if (isPlayerOrigin) {
              // Atualização vinda diretamente do portal do jogador: adota PV, condições, cargas, moedas e inventário do herói
              mergedPlayer = Object.assign({}, currentLocal, remoteP);
            } else if (remoteUpdated >= localUpdated) {
              mergedPlayer = Object.assign({}, currentLocal, remoteP);
            } else if (localUpdated === 0 && remoteUpdated === 0) {
              // Ambos sem carimbo específico: adota dados remotos
              mergedPlayer = Object.assign({}, currentLocal, remoteP);
            } else {
              // Local é mais recente: preserva campos locais
              mergedPlayer = Object.assign({}, remoteP, currentLocal);
            }

            // Blindagem: resolvedLevel e resolvedMaxHp nunca regridem acidentalmente
            mergedPlayer.level = Math.max(currentLocal.level || 1, remoteP.level || 1);
            mergedPlayer.maxHp = Math.max(currentLocal.maxHp || 1, remoteP.maxHp || 1);
            mergedMap.set(remoteP.id, mergedPlayer);
          } else {
            // Personagem novo vindo da nuvem
            mergedMap.set(remoteP.id, Object.assign({}, remoteP));
          }
        }

        PLAYERS = Array.from(mergedMap.values()).map(p => {
          if (!p.skillProficiencies) p.skillProficiencies = [];
          if (!p.saveProficiencies) p.saveProficiencies = [];
          if (!p.actionLogs) p.actionLogs = [];
          if (p.playerNotes === undefined) p.playerNotes = '';
          return p;
        });

        // Sincroniza HP e Condições dos combatentes com as fichas atualizadas (jogador pode ter alterado HP/condições no portal)
        if (typeof state !== 'undefined' && state && Array.isArray(state.combatants)) {
          let hasCombatChanges = false;
          state.combatants.forEach(comb => {
            if (comb.type === 'player') {
              const matchedPlayer = (typeof findPlayerForCombatant === 'function')
                ? findPlayerForCombatant(comb, PLAYERS)
                : PLAYERS.find(p => (comb.playerId && comb.playerId === p.id) || p.id === comb.id || comb.name.includes(p.name));
              if (matchedPlayer) {
                if (matchedPlayer.hp !== undefined && (comb.hp !== matchedPlayer.hp || comb.maxHp !== matchedPlayer.maxHp)) {
                  comb.hp = matchedPlayer.hp;
                  comb.maxHp = matchedPlayer.maxHp;
                  hasCombatChanges = true;
                }
                if (Array.isArray(matchedPlayer.conditions)) {
                  comb.conditions = [...matchedPlayer.conditions];
                  hasCombatChanges = true;
                }
              }
            }
          });
        }
      }

      if (typeof renderPlayers === 'function') renderPlayers();
      if (typeof renderCombat === 'function' && clientRole !== 'player') renderCombat();
      if (typeof updatePlayerPortalBanner === 'function') updatePlayerPortalBanner();
      if (typeof renderPlayerLoginList === 'function') renderPlayerLoginList();

    }

    // 2. Atualiza Estado de Combate (apenas se publicado pelo Mestre ou origem legítima, nunca sobrescrito por snapshot de jogador)
    if (cloudData.state && Array.isArray(cloudData.state.combatants) && cloudData.publishedBy !== 'player') {
      state = cloudData.state;
      if (typeof renderCombat === 'function') renderCombat();
      if (typeof updatePlayerPortalBanner === 'function') updatePlayerPortalBanner();
      if (typeof renderPlayerCombatModalContent === 'function') {
        const modal = document.getElementById('modal-player-combat');
        if (modal && modal.classList.contains('active')) {
          renderPlayerCombatModalContent();
        }
      }
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
      if (typeof updateAllPartyStashElements === 'function') updateAllPartyStashElements();
    }

    // 5. Atualiza Notas Rápidas do Mestre (respeitando foco de digitação local)
    if (cloudData.dmNotes !== undefined && typeof localStorage !== 'undefined') {
      const notesEl = document.getElementById('inp-dm-quick-notes');
      if (!notesEl || document.activeElement !== notesEl) {
        localStorage.setItem('dnd_tracker_dm_notes_v3', cloudData.dmNotes);
        if (notesEl) notesEl.value = cloudData.dmNotes;
        const activeCamp = (typeof getActiveCampaign === 'function') ? getActiveCampaign() : null;
        if (activeCamp) activeCamp.dmNotes = cloudData.dmNotes;
      }
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
  if (isApplyingCloudUpdate) return;

  if (immediate) {
    if (firebaseCloudDebounceTimer) {
      clearTimeout(firebaseCloudDebounceTimer);
      firebaseCloudDebounceTimer = null;
    }
    cloudSyncCooldownUntil = 0;
    if (!isFirebaseAutoSyncEnabled()) return;
    if (!isFirebaseConnected || (!firestoreDb && !realtimeDb)) {
      hasPendingCloudSync = true;
      if (typeof initFirebaseSync === 'function' && !isFirebaseConnected) {
        setTimeout(() => initFirebaseSync(), 50);
      }
      return;
    }
    executeCloudSave();
    return;
  }

  if (Date.now() < cloudSyncCooldownUntil) {
    if (!firebaseCloudDebounceTimer) {
      const waitTime = Math.max(50, cloudSyncCooldownUntil - Date.now() + 50);
      firebaseCloudDebounceTimer = setTimeout(() => {
        firebaseCloudDebounceTimer = null;
        executeCloudSave();
      }, waitTime);
    }
    return;
  }
  if (!isFirebaseAutoSyncEnabled()) return;

  if (!isFirebaseConnected || (!firestoreDb && !realtimeDb)) {
    hasPendingCloudSync = true;
    if (typeof initFirebaseSync === 'function' && !isFirebaseConnected) {
      setTimeout(() => initFirebaseSync(), 50);
    }
    return;
  }

  if (firebaseCloudDebounceTimer) {
    clearTimeout(firebaseCloudDebounceTimer);
    firebaseCloudDebounceTimer = null;
  }

  firebaseCloudDebounceTimer = setTimeout(() => {
    firebaseCloudDebounceTimer = null;
    executeCloudSave();
  }, 500);
}

function executeCloudSave() {
  if (firebaseCloudDebounceTimer) {
    clearTimeout(firebaseCloudDebounceTimer);
    firebaseCloudDebounceTimer = null;
  }
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
    masterPinHash: (typeof getMasterPinHash === 'function') ? getMasterPinHash() : '',
    lastUpdatedBy: localClientId,
    lastUpdateIso: new Date().toISOString(),
    publishedBy: 'master'
  };

  updateFirebaseUiStatus('syncing', 'Salvando...');

  if (cloudSaveStatusTimeout) clearTimeout(cloudSaveStatusTimeout);
  cloudSaveStatusTimeout = setTimeout(() => {
    updateFirebaseUiStatus(isFirebaseConnected ? 'connected' : 'offline', isFirebaseConnected ? `Nuvem: ${roomId}` : 'Modo Local');
  }, 2500);

  const savePromises = [];

  // Salva no Realtime Database (fonte principal de alta velocidade)
  if (realtimeDb) {
    savePromises.push(realtimeDb.ref('dnd_rooms/' + roomId).set(payload));
  }

  // Salva no Firestore secundariamente com tratamento defensivo (não bloqueia caso 404/desativado)
  if (firestoreDb) {
    try {
      const roomDocRef = firestoreDb.collection('dnd_rooms').doc(roomId);
      roomDocRef.set(payload, { merge: true }).catch(err => {
        console.warn('Firestore fallback silencioso (mestre):', err);
      });
    } catch (err) {
      console.warn('Firestore set ignorado:', err);
    }
  }

  if (savePromises.length > 0) {
    Promise.all(savePromises)
      .then(() => {
        if (cloudSaveStatusTimeout) clearTimeout(cloudSaveStatusTimeout);
        updateFirebaseUiStatus('connected', `Nuvem: ${roomId}`);
      })
      .catch(err => {
        if (cloudSaveStatusTimeout) clearTimeout(cloudSaveStatusTimeout);
        console.warn('Erro ao salvar no Realtime DB:', err);
        updateFirebaseUiStatus('connected', `Nuvem: ${roomId}`);
      });
  }
}

function executePlayerCloudSave() {
  if (firebaseCloudDebounceTimer) {
    clearTimeout(firebaseCloudDebounceTimer);
    firebaseCloudDebounceTimer = null;
  }
  if (!isFirebaseConnected || !activePortalPlayerId) return;
  const myPlayer = (typeof PLAYERS !== 'undefined') ? PLAYERS.find(p => p.id === activePortalPlayerId) : null;
  if (!myPlayer) return;

  // Carimba o timestamp de atualização e identificador de cliente no próprio herói
  myPlayer.updatedAt = Date.now();
  myPlayer.updatedBy = localClientId;

  const roomId = getStoredFirebaseRoom();
  const nowIso = new Date().toISOString();

  // Badge de sincronização: amarelo durante o envio
  const syncBadge = (typeof document !== 'undefined') ? document.getElementById('portal-sync-status-badge') : null;
  if (syncBadge) {
    syncBadge.className = 'portal-sync-badge sync-syncing';
    syncBadge.innerText = '🟡 Sincronizando...';
  }

  // Prepara promessa principal no Realtime Database
  let rtdbPromise = Promise.resolve();

  if (realtimeDb) {
    const roomRef = realtimeDb.ref(`dnd_rooms/${roomId}`);
    rtdbPromise = roomRef.child('players').once('value').then(snap => {
      const rawPlayers = snap.val();
      let list = Array.isArray(rawPlayers) 
        ? [...rawPlayers] 
        : (rawPlayers && typeof rawPlayers === 'object' ? Object.values(rawPlayers) : []);

      const idx = list.findIndex(p => p && p.id === activePortalPlayerId);
      if (idx >= 0) {
        list[idx] = Object.assign({}, list[idx], myPlayer);
      } else {
        list.push(Object.assign({}, myPlayer));
      }

      const updates = {
        players: list,
        lastUpdatedBy: localClientId,
        lastUpdateIso: nowIso,
        publishedBy: 'player'
      };

      if (typeof CAMPAIGNS_STATE !== 'undefined' && CAMPAIGNS_STATE) {
        updates.campaigns = CAMPAIGNS_STATE;
      }

      return roomRef.update(updates);
    });
  }

  // Firestore secundário com tratamento defensivo (nunca bloqueia caso 404/desativado)
  if (firestoreDb) {
    try {
      const roomDocRef = firestoreDb.collection('dnd_rooms').doc(roomId);
      roomDocRef.get().then(snap => {
        const current = snap.exists ? snap.data() : {};
        let list = Array.isArray(current.players) ? [...current.players] : [];
        const idx = list.findIndex(p => p && p.id === activePortalPlayerId);
        if (idx >= 0) {
          list[idx] = Object.assign({}, list[idx], myPlayer);
        } else {
          list.push(Object.assign({}, myPlayer));
        }
        const fsData = {
          players: list,
          lastUpdatedBy: localClientId,
          lastUpdateIso: nowIso,
          publishedBy: 'player'
        };
        if (typeof CAMPAIGNS_STATE !== 'undefined' && CAMPAIGNS_STATE) {
          fsData.campaigns = CAMPAIGNS_STATE;
        }
        return roomDocRef.set(fsData, { merge: true });
      }).catch(e => {
        console.warn('Firestore fallback silencioso (portal):', e);
      });
    } catch (e) {
      console.warn('Firestore portal ignorado:', e);
    }
  }

  // Timeout de resiliência de 5 segundos
  const safetyTimeout = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Timeout de sincronização com a nuvem')), 5000);
  });

  Promise.race([rtdbPromise, safetyTimeout])
    .then(() => {
      if (syncBadge) {
        syncBadge.className = 'portal-sync-badge sync-online';
        syncBadge.innerText = '🟢 Sincronizado';
      }
    })
    .catch(err => {
      console.warn('Erro ao sincronizar ficha do jogador no Realtime DB:', err);
      if (syncBadge) {
        syncBadge.className = 'portal-sync-badge sync-offline';
        syncBadge.innerText = '🔴 Erro de Sync';
      }
    });
}


function publishMasterCampaignToCloud(silent = false) {
  if (!isFirebaseConnected) {
    initFirebaseSync();
  }

  if (!silent && typeof saveSafetySnapshot === 'function') {
    saveSafetySnapshot('Backup antes de Publicar Mesa na Nuvem');
  }

  const activeCamp = (typeof getActiveCampaign === 'function') ? getActiveCampaign() : null;
  const roomId = getStoredFirebaseRoom();

  const payload = {
    room: roomId,
    campaignName: activeCamp ? activeCamp.name : roomId,
    campaigns: (typeof CAMPAIGNS_STATE !== 'undefined') ? CAMPAIGNS_STATE : null,
    players: (typeof PLAYERS !== 'undefined') ? PLAYERS : [],
    state: (typeof state !== 'undefined') ? state : { combatants: [], round: 1, current: 0 },
    gridState: (typeof gridState !== 'undefined') ? gridState : null,
    dmNotes: (typeof localStorage !== 'undefined') ? (localStorage.getItem('dnd_tracker_dm_notes_v3') || '') : '',
    masterPinHash: (typeof getMasterPinHash === 'function') ? getMasterPinHash() : '',
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
    try {
      const roomDocRef = firestoreDb.collection('dnd_rooms').doc(roomId);
      roomDocRef.set(payload, { merge: true }).catch(err => {
        console.warn('Firestore fallback silencioso (publicar mesa):', err);
      });
    } catch (e) {}
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
    badge.className = `btn-top firebase-status-pill ${status}`;
  }
  if (textEl) {
    textEl.innerText = text || (status === 'connected' ? 'Nuvem Conectada' : 'Modo Local');
  }
  if (dotEl) {
    dotEl.style.backgroundColor = status === 'connected' ? '#10b981' : (status === 'syncing' ? '#fbbf24' : (status === 'error' ? '#f87171' : '#64748b'));
  }

  const playerLoginText = document.getElementById('player-login-status-text');
  if (playerLoginText) {
    const currentRoom = (typeof getStoredFirebaseRoom === 'function') ? getStoredFirebaseRoom() : 'turma_principal';
    playerLoginText.innerText = (status === 'connected')
      ? `🟢 Sincronizado à Mesa (${currentRoom})`
      : (status === 'syncing' ? '🟡 Sincronizando...' : '⚪ Modo Local');
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

function manualPullFromCloud(silent = false) {
  if (!isFirebaseConnected || (!firestoreDb && !realtimeDb)) {
    if (!silent) alert('Conecte o Firebase primeiro.');
    return;
  }
  const roomId = getStoredFirebaseRoom();
  if (!silent) updateFirebaseUiStatus('syncing', 'Buscando dados...');

  // 1. Busca no Realtime Database
  if (realtimeDb) {
    realtimeDb.ref('dnd_rooms/' + roomId).once('value')
      .then(snapshot => {
        const cloudData = snapshot.val();
        if (cloudData) {
          applyCloudDataToLocal(cloudData);
          if (!silent) alert('⬇️ Fichas e estado de combate atualizados a partir do Realtime Database!');
        } else {
          if (!silent) alert(`A sala '${roomId}' ainda não possui dados salvos na nuvem.`);
        }
      })
      .catch(err => {
        if (!silent) alert('Erro ao buscar dados do Realtime Database: ' + err.message);
      });
    return;
  }

  // 2. Busca no Firestore
  if (firestoreDb) {
    firestoreDb.collection('dnd_rooms').doc(roomId).get()
      .then(doc => {
        if (doc.exists) {
          applyCloudDataToLocal(doc.data());
          if (!silent) alert('⬇️ Fichas e estado de combate atualizados a partir do Firestore!');
        } else {
          if (!silent) alert(`A sala '${roomId}' ainda não possui dados na nuvem.`);
        }
      })
      .catch(err => {
        if (!silent) alert('Erro ao buscar dados do Firestore: ' + err.message);
      });
  }
}

// --- RESSINCRONIZAÇÃO REATIVA EM MUDANÇAS DE VISIBILIDADE / FOCO (MOBILE & DESKTOP) ---
let lastWakeupSyncTimestamp = 0;
function handleDeviceWakeupOrTabFocus() {
  const now = Date.now();
  if (now - lastWakeupSyncTimestamp < 1500) return; // Throttle de 1.5s contra tempestade de eventos
  lastWakeupSyncTimestamp = now;

  if (isFirebaseConnected && (realtimeDb || firestoreDb)) {
    console.log('📱 Dispositivo reativado / aba em foco: disparando ressincronização reativa com a nuvem...');
    manualPullFromCloud(true);
  }
}

if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      handleDeviceWakeupOrTabFocus();
    }
  });
}

if (typeof window !== 'undefined') {
  window.addEventListener('focus', handleDeviceWakeupOrTabFocus);
  window.addEventListener('pageshow', handleDeviceWakeupOrTabFocus);
  window.addEventListener('online', () => {
    if (!isFirebaseConnected) {
      initFirebaseSync();
    } else {
      handleDeviceWakeupOrTabFocus();
    }
  });
}

// --- PAREAMENTO MULTI-DISPOSITIVO (PC ➔ CELULAR / NAVEGADORES) ---

function getMasterSyncDeviceUrl() {
  const currentRoom = getStoredFirebaseRoom();
  const queryStr = `room=${encodeURIComponent(currentRoom)}`;
  if (typeof getCanonicalPublicUrl === 'function') {
    return getCanonicalPublicUrl(queryStr);
  }
  return `https://uranio8.github.io/planilha-rpg/?${queryStr}`;
}

function openMasterSyncDeviceModal() {
  if (typeof document === 'undefined') return;
  const modal = document.getElementById('modal-master-sync-device');
  if (!modal) return;

  const currentRoom = getStoredFirebaseRoom();
  const syncUrl = getMasterSyncDeviceUrl();

  const inpRoom = document.getElementById('inp-sync-device-room');
  if (inpRoom) inpRoom.value = currentRoom;

  if (typeof renderQrCodeToContainer === 'function') {
    renderQrCodeToContainer('img-master-sync-qrcode', syncUrl, 210);
  } else {
    const imgQr = document.getElementById('img-master-sync-qrcode');
    if (imgQr && imgQr.tagName && imgQr.tagName.toLowerCase() === 'img') {
      imgQr.src = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(syncUrl)}`;
    }
  }

  modal.classList.add('open');
}

function closeMasterSyncDeviceModal() {
  if (typeof document === 'undefined') return;
  const modal = document.getElementById('modal-master-sync-device');
  if (modal) modal.classList.remove('open');
}

function copyMasterSyncDeviceUrl() {
  const syncUrl = getMasterSyncDeviceUrl();
  if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(syncUrl)
      .then(() => {
        if (typeof showToast === 'function') {
          showToast('📋 Link do Celular copiado! Cole no seu navegador do celular.', 'success');
        } else {
          alert('📋 Link copiado com sucesso:\n' + syncUrl);
        }
      })
      .catch(() => {
        prompt('Copie o link abaixo:', syncUrl);
      });
  } else {
    prompt('Copie o link abaixo:', syncUrl);
  }
}

function handleUpdateSyncDeviceRoom() {
  const inp = document.getElementById('inp-sync-device-room');
  if (!inp) return;
  const raw = inp.value.trim();
  if (!raw) return;
  const newRoom = setStoredFirebaseRoom(raw);
  inp.value = newRoom;

  // Reconecta e atualiza QR Code (SVG vetorial 100% offline)
  initFirebaseSync();
  const syncUrl = getMasterSyncDeviceUrl();
  if (typeof renderQrCodeToContainer === 'function') {
    renderQrCodeToContainer('img-master-sync-qrcode', syncUrl, 210);
  } else {
    const imgQr = document.getElementById('img-master-sync-qrcode');
    if (imgQr && imgQr.tagName && imgQr.tagName.toLowerCase() === 'img') {
      imgQr.src = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(syncUrl)}`;
    }
  }

  if (typeof showToast === 'function') {
    showToast(`🌐 Conectado à sala ${newRoom}!`, 'success');
  }
}

// Vincula no window para navegadores
if (typeof window !== 'undefined') {
  window.getMasterSyncDeviceUrl = getMasterSyncDeviceUrl;
  window.openMasterSyncDeviceModal = openMasterSyncDeviceModal;
  window.closeMasterSyncDeviceModal = closeMasterSyncDeviceModal;
  window.copyMasterSyncDeviceUrl = copyMasterSyncDeviceUrl;
  window.handleUpdateSyncDeviceRoom = handleUpdateSyncDeviceRoom;
  window.handleDeviceWakeupOrTabFocus = handleDeviceWakeupOrTabFocus;
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
    mergeCloudCampaignsState,
    syncLocalChangesToFirebase,
    executeCloudSave,
    openFirebaseModal,
    closeFirebaseModal,
    manualPushToCloud,
    manualPullFromCloud,
    publishMasterCampaignToCloud,
    executePlayerCloudSave,
    getMasterSyncDeviceUrl,
    openMasterSyncDeviceModal,
    closeMasterSyncDeviceModal,
    copyMasterSyncDeviceUrl,
    handleUpdateSyncDeviceRoom,
    handleDeviceWakeupOrTabFocus
  };
}
