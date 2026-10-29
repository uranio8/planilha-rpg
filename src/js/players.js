
var activePortalPlayerId = (typeof activePortalPlayerId !== 'undefined') ? activePortalPlayerId : null;
var pendingPortalPlayerId = (typeof pendingPortalPlayerId !== 'undefined') ? pendingPortalPlayerId : null;
if (typeof window !== 'undefined') {
  window.activePortalPlayerId = activePortalPlayerId;
  window.pendingPortalPlayerId = pendingPortalPlayerId;
}

function touchPlayer(playerOrId) {
  if (!playerOrId) return null;
  const p = (typeof playerOrId === 'string')
    ? (typeof PLAYERS !== 'undefined' ? PLAYERS.find(x => x.id === playerOrId) : null)
    : playerOrId;
  if (p) {
    p.updatedAt = Date.now();
  }
  return p;
}

if (typeof window !== 'undefined') {
  window.touchPlayer = touchPlayer;
}

// Helpers de Estilização & Gameplay para Fichas (Pacote Completo)
function getPlayerClassBadge(p) {
  const cls = (p.className || '').toLowerCase();
  let icon = '🛡️';
  let cssClass = 'class-fighter';

  if (cls.includes('bárbaro') || cls.includes('barbaro') || cls.includes('barbarian')) { icon = '🪓'; cssClass = 'class-barbarian'; }
  else if (cls.includes('bardo') || cls.includes('bard')) { icon = '🎵'; cssClass = 'class-bard'; }
  else if (cls.includes('clérigo') || cls.includes('clerigo') || cls.includes('cleric')) { icon = '✨'; cssClass = 'class-cleric'; }
  else if (cls.includes('druida') || cls.includes('druid')) { icon = '🌿'; cssClass = 'class-druid'; }
  else if (cls.includes('guerreiro') || cls.includes('fighter')) { icon = '⚔️'; cssClass = 'class-fighter'; }
  else if (cls.includes('monge') || cls.includes('monk')) { icon = '👊'; cssClass = 'class-monk'; }
  else if (cls.includes('paladino') || cls.includes('paladin')) { icon = '🛡️'; cssClass = 'class-paladin'; }
  else if (cls.includes('patrulheiro') || cls.includes('ranger')) { icon = '🏹'; cssClass = 'class-ranger'; }
  else if (cls.includes('ladino') || cls.includes('rogue')) { icon = '🗡️'; cssClass = 'class-rogue'; }
  else if (cls.includes('feiticeiro') || cls.includes('sorcerer')) { icon = '🔮'; cssClass = 'class-sorcerer'; }
  else if (cls.includes('bruxo') || cls.includes('warlock')) { icon = '👁️'; cssClass = 'class-warlock'; }
  else if (cls.includes('mago') || cls.includes('wizard')) { icon = '📖'; cssClass = 'class-wizard'; }

  return `<span class="class-badge ${cssClass}">${icon} ${p.className || 'Aventureiro'}</span>`;
}

function getPlayerRestStatus(p) {
  if (p.hp <= 0) {
    return { label: '💀 Inconsciente', css: 'unconscious', title: '0 PV - Necessita de Estabilização ou Cura' };
  }
  const totalSlots = (p.slots || []).reduce((a, b) => a + b, 0);
  const usedSlots = (p.slotsUsed || []).reduce((a, b) => a + b, 0);
  const hpPct = p.maxHp > 0 ? (p.hp / p.maxHp) : 1;

  if (hpPct <= 0.35 || (totalSlots > 0 && usedSlots / totalSlots >= 0.8)) {
    return { label: '🔴 Exausto', css: 'exhausted', title: 'PV crítico ou quase sem magias' };
  }
  if (hpPct <= 0.75 || usedSlots > 0) {
    return { label: '🟡 Cansado', css: 'tired', title: 'Sofreu dano ou gastou recursos' };
  }
  return { label: '🟢 Descansado', css: 'rested', title: 'PV cheio e recursos disponíveis' };
}

function togglePlayerCardCompact(id) {
  const p = PLAYERS.find(x => x.id === id);
  if (!p) return;
  p.compact = !p.compact;
  renderPlayers();
  saveToLocalStorage();
}

function applyQuickDamage(id) {
  const input = document.getElementById(`hp-quick-val-${id}`);
  const val = input ? parseInt(input.value, 10) : 0;
  if (val > 0) {
    adjustPlayerHp(id, -val);
    if (input) input.value = '';
  }
}

function applyQuickHeal(id) {
  const input = document.getElementById(`hp-quick-val-${id}`);
  const val = input ? parseInt(input.value, 10) : 0;
  if (val > 0) {
    adjustPlayerHp(id, val);
    if (input) input.value = '';
  }
}

// ========================================================
// 🛡️ REGRAS D&D 5E DE ARMADURAS, ESCUDOS & CLASSE DE ARMADURA (CA)
// ========================================================
const DND5E_ARMOR_DATA = {
  'acolchoada': { ac: 11, type: 'light', name: 'Armadura Acolchoada' },
  'armadura acolchoada': { ac: 11, type: 'light', name: 'Armadura Acolchoada' },
  'couro': { ac: 11, type: 'light', name: 'Armadura de Couro' },
  'armadura de couro': { ac: 11, type: 'light', name: 'Armadura de Couro' },
  'couro batido': { ac: 12, type: 'light', name: 'Armadura de Couro Batido' },
  'armadura de couro batido': { ac: 12, type: 'light', name: 'Armadura de Couro Batido' },
  'gibão de peles': { ac: 12, type: 'medium', name: 'Gibão de Peles' },
  'gibao de peles': { ac: 12, type: 'medium', name: 'Gibão de Peles' },
  'camisa de cota de malha': { ac: 13, type: 'medium', name: 'Camisa de Cota de Malha' },
  'cota de malha leve': { ac: 13, type: 'medium', name: 'Camisa de Cota de Malha' },
  'brunea': { ac: 14, type: 'medium', name: 'Brunea' },
  'cota de escamas': { ac: 14, type: 'medium', name: 'Cota de Escamas' },
  'peitoral': { ac: 14, type: 'medium', name: 'Peitoral' },
  'peitoral de aco': { ac: 14, type: 'medium', name: 'Peitoral de Aço' },
  'peitoral de aço': { ac: 14, type: 'medium', name: 'Peitoral de Aço' },
  'meia-armadura': { ac: 15, type: 'medium', name: 'Meia-Armadura' },
  'meia armadura': { ac: 15, type: 'medium', name: 'Meia-Armadura' },
  'cota de anéis': { ac: 14, type: 'heavy', name: 'Cota de Anéis' },
  'cota de aneis': { ac: 14, type: 'heavy', name: 'Cota de Anéis' },
  'cota de malha': { ac: 16, type: 'heavy', name: 'Cota de Malha' },
  'armadura de cota de malha': { ac: 16, type: 'heavy', name: 'Cota de Malha' },
  'cota de talas': { ac: 17, type: 'heavy', name: 'Cota de Talas' },
  'placas': { ac: 18, type: 'heavy', name: 'Armadura de Placas' },
  'armadura de placas': { ac: 18, type: 'heavy', name: 'Armadura de Placas' },
  'armadura completa': { ac: 18, type: 'heavy', name: 'Armadura de Placas' }
};

function isArmorItem(name) {
  if (!name) return false;
  const n = String(name).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  if (isShieldItem(name)) return false;
  return !!DND5E_ARMOR_DATA[n] || n.includes('armadura') || n.includes('cota de') || n.includes('peitoral') || n.includes('brunea') || n.includes('placas') || n.includes('gibao');
}

function isShieldItem(name) {
  if (!name) return false;
  const n = String(name).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  return n.includes('escudo') || n.includes('shield');
}

function isWeaponItem(name) {
  if (!name) return false;
  const n = String(name).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  if (isArmorItem(name) || isShieldItem(name)) return false;
  if (typeof EQUIPMENT_DATA !== 'undefined' && Array.isArray(EQUIPMENT_DATA)) {
    const found = EQUIPMENT_DATA.find(e => (e.category || '').toLowerCase().includes('armas') && (e.name.toLowerCase() === n || n.includes(e.name.toLowerCase()) || e.name.toLowerCase().includes(n)));
    if (found) return true;
  }
  const weaponKeywords = ['espada', 'adaga', 'arco', 'besta', 'machado', 'martelo', 'lanca', 'rapieira', 'florete', 'cimitarra', 'maca', 'bordao', 'tridente', 'chicote', 'mangual', 'alabarda', 'glaive', 'azagaia', 'zarabatana', 'funda', 'clava', 'pique'];
  return weaponKeywords.some(kw => n.includes(kw));
}

function syncPlayerEquippedWeaponsAndAttacks(p) {
  if (!p) return;
  p.inventory = Array.isArray(p.inventory) ? p.inventory : [];

  // Armas equipadas no inventário
  const equippedWeapons = p.inventory.filter(it => it.equipped && isWeaponItem(it.name));

  if (equippedWeapons.length > 0) {
    const formatted = [];
    equippedWeapons.forEach(w => {
      const stats = typeof calculateWeaponAttackStats === 'function' ? calculateWeaponAttackStats(p, w) : null;
      if (stats && stats.formattedText) formatted.push(stats.formattedText);
      else formatted.push(w.name);
    });
    p.attacks = formatted.join(', ');
  } else if (p.attacks && typeof p.attacks === 'string' && p.attacks.trim() && p.inventory.length === 0) {
    // Reconcilia armas declaradas em p.attacks para o inventário (respeitando vírgulas internas de dano)
    const rawList = p.attacks.split(/(?:\||\n|;|\s*,\s*(?![^(]*\)))/).map(s => s.trim()).filter(Boolean);
    rawList.forEach((attStr, idx) => {
      const cleanName = attStr.split('(')[0].replace(/[⚔️🗡️🏹★]/g, '').trim();
      if (!cleanName || cleanName.toLowerCase().includes('desarmado')) return;
      if (isWeaponItem(cleanName)) {
        const normAtt = cleanName.toLowerCase();
        const existing = p.inventory.find(it => {
          const itNorm = (it.name || '').toLowerCase().trim();
          const itBase = itNorm.split('(')[0].trim();
          return itNorm === normAtt || itBase === normAtt || itNorm.includes(normAtt) || normAtt.includes(itBase);
        });
        if (existing) {
          existing.equipped = true;
        } else {
          const eqObj = typeof EQUIPMENT_DATA !== 'undefined' ? EQUIPMENT_DATA.find(e => e.name.toLowerCase() === cleanName.toLowerCase() || e.name.toLowerCase().includes(cleanName.toLowerCase())) : null;
          p.inventory.push({
            id: 'item_wpn_sync_' + Date.now() + '_' + idx,
            name: eqObj ? eqObj.name : cleanName,
            category: 'Armas',
            qty: 1,
            weight: eqObj && eqObj.weight ? eqObj.weight : 2,
            cost: eqObj && eqObj.cost ? eqObj.cost : '10 PO',
            equipped: true
          });
        }
      }
    });
  }
}

function getArmorItemStats(name) {
  if (!name) return { ac: 10, type: 'none' };
  const n = String(name).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  if (DND5E_ARMOR_DATA[n]) return DND5E_ARMOR_DATA[n];
  for (const k in DND5E_ARMOR_DATA) {
    if (n.includes(k)) return DND5E_ARMOR_DATA[k];
  }
  if (n.includes('placas') || n.includes('talas')) return { ac: 17, type: 'heavy' };
  if (n.includes('malha')) return { ac: 16, type: 'heavy' };
  if (n.includes('couro batido')) return { ac: 12, type: 'light' };
  if (n.includes('couro')) return { ac: 11, type: 'light' };
  return { ac: 11, type: 'light' };
}

function calculatePlayerAcFromEquipment(player) {
  if (!player) return 10;
  const dexMod = Math.floor(((player.dex || 10) - 10) / 2);
  const conMod = Math.floor(((player.con || 10) - 10) / 2);
  const wisMod = Math.floor(((player.wis || 10) - 10) / 2);
  const cls = String(player.className || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const sub = String(player.subclass || player.subclassName || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const fStyle = String(player.fightingStyle || '').toLowerCase();

  const inventory = Array.isArray(player.inventory) ? player.inventory : [];
  const equippedArmors = inventory.filter(it => it.equipped && isArmorItem(it.name));
  const equippedShields = inventory.filter(it => it.equipped && isShieldItem(it.name));

  let baseAc = 10 + dexMod;

  if (equippedArmors.length === 0) {
    if (cls.includes('barbaro')) {
      baseAc = 10 + dexMod + conMod;
    } else if (cls.includes('monge')) {
      if (equippedShields.length === 0) {
        baseAc = 10 + dexMod + wisMod;
      } else {
        baseAc = 10 + dexMod;
      }
    } else if (sub.includes('drac') || (cls.includes('feiticeiro') && player.subclassIdx === 0)) {
      baseAc = 13 + dexMod;
    }
  } else {
    const armor = equippedArmors[0];
    const armStats = getArmorItemStats(armor.name);
    if (armStats.type === 'light') {
      baseAc = armStats.ac + dexMod;
    } else if (armStats.type === 'medium') {
      baseAc = armStats.ac + Math.min(dexMod, 2);
    } else if (armStats.type === 'heavy') {
      baseAc = armStats.ac;
    } else {
      baseAc = armStats.ac + dexMod;
    }
    // Estilo de Luta: Defesa (+1 na CA quando estiver usando armadura)
    if (fStyle === 'defense') {
      baseAc += 1;
    }
  }

  if (equippedShields.length > 0) {
    baseAc += 2;
  }

  return Math.max(1, baseAc);
}

function getPlayerAcCalculationInfo(player) {
  if (!player) return { ac: 10, details: 'Padrão: 10' };
  const dexMod = Math.floor(((player.dex || 10) - 10) / 2);
  const conMod = Math.floor(((player.con || 10) - 10) / 2);
  const wisMod = Math.floor(((player.wis || 10) - 10) / 2);
  const cls = String(player.className || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const sub = String(player.subclass || player.subclassName || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const fStyle = String(player.fightingStyle || '').toLowerCase();

  const inventory = Array.isArray(player.inventory) ? player.inventory : [];
  const equippedArmors = inventory.filter(it => it.equipped && isArmorItem(it.name));
  const equippedShields = inventory.filter(it => it.equipped && isShieldItem(it.name));

  let baseAc = 10 + dexMod;
  let formulaParts = [];
  let modeName = '';

  if (equippedArmors.length === 0) {
    if (cls.includes('barbaro')) {
      baseAc = 10 + dexMod + conMod;
      modeName = 'Defesa sem Armadura (Bárbaro)';
      formulaParts.push('10 base');
      formulaParts.push(`${dexMod >= 0 ? '+' : ''}${dexMod} DES`);
      formulaParts.push(`${conMod >= 0 ? '+' : ''}${conMod} CON`);
    } else if (cls.includes('monge')) {
      if (equippedShields.length === 0) {
        baseAc = 10 + dexMod + wisMod;
        modeName = 'Defesa sem Armadura (Monge)';
        formulaParts.push('10 base');
        formulaParts.push(`${dexMod >= 0 ? '+' : ''}${dexMod} DES`);
        formulaParts.push(`${wisMod >= 0 ? '+' : ''}${wisMod} SAB`);
      } else {
        baseAc = 10 + dexMod;
        modeName = 'Sem Armadura (Escudo desativa Monge)';
        formulaParts.push('10 base');
        formulaParts.push(`${dexMod >= 0 ? '+' : ''}${dexMod} DES`);
      }
    } else if (sub.includes('drac') || (cls.includes('feiticeiro') && player.subclassIdx === 0)) {
      baseAc = 13 + dexMod;
      modeName = 'Resiliência Dracônica';
      formulaParts.push('13 base');
      formulaParts.push(`${dexMod >= 0 ? '+' : ''}${dexMod} DES`);
    } else {
      modeName = 'Sem Armadura';
      formulaParts.push('10 base');
      formulaParts.push(`${dexMod >= 0 ? '+' : ''}${dexMod} DES`);
    }
  } else {
    const armor = equippedArmors[0];
    const armStats = getArmorItemStats(armor.name);
    modeName = armStats.name || armor.name;
    if (armStats.type === 'light') {
      baseAc = armStats.ac + dexMod;
      formulaParts.push(`${armStats.ac} [${armStats.name || 'Armadura'}]`);
      formulaParts.push(`${dexMod >= 0 ? '+' : ''}${dexMod} DES`);
    } else if (armStats.type === 'medium') {
      const appliedDex = Math.min(dexMod, 2);
      baseAc = armStats.ac + appliedDex;
      formulaParts.push(`${armStats.ac} [${armStats.name || 'Armadura'}]`);
      formulaParts.push(`${appliedDex >= 0 ? '+' : ''}${appliedDex} DES (máx +2)`);
    } else if (armStats.type === 'heavy') {
      baseAc = armStats.ac;
      formulaParts.push(`${armStats.ac} [${armStats.name || 'Armadura'}]`);
    } else {
      baseAc = armStats.ac + dexMod;
      formulaParts.push(`${armStats.ac} [${armStats.name || 'Armadura'}]`);
      formulaParts.push(`${dexMod >= 0 ? '+' : ''}${dexMod} DES`);
    }

    if (fStyle === 'defense') {
      baseAc += 1;
      formulaParts.push('+1 Estilo Defesa');
    }
  }

  if (equippedShields.length > 0) {
    baseAc += 2;
    formulaParts.push('+2 Escudo');
  }

  const finalAc = Math.max(1, baseAc);
  const details = `${modeName}: ${formulaParts.join(' ')} = CA ${finalAc}`;

  return {
    ac: finalAc,
    modeName,
    details,
    hasArmor: equippedArmors.length > 0,
    hasShield: equippedShields.length > 0,
    hasDefenseStyle: fStyle === 'defense' && equippedArmors.length > 0
  };
}

function ensurePlayerCalculatedAc(player) {
  if (!player) return 10;
  const newAc = calculatePlayerAcFromEquipment(player);
  player.ac = newAc;
  if (typeof state !== 'undefined' && state.combatants && Array.isArray(state.combatants)) {
    const c = state.combatants.find(x => x.playerId === player.id || (x.type === 'player' && x.name === player.name));
    if (c) {
      c.ac = newAc;
    }
  }
  return newAc;
}

function getPlayerEquippedArmorKey(player) {
  if (!player || !Array.isArray(player.inventory)) return 'none';
  const arm = player.inventory.find(it => it.equipped && isArmorItem(it.name));
  if (!arm) return 'none';
  const n = String(arm.name).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  if (DND5E_ARMOR_DATA[n]) return n;
  for (const k in DND5E_ARMOR_DATA) {
    if (n === k) return k;
  }
  for (const k in DND5E_ARMOR_DATA) {
    if (n.includes(k)) return k;
  }
  for (const k in DND5E_ARMOR_DATA) {
    if (k.includes(n)) return k;
  }
  return n;
}

function hasPlayerEquippedShield(player) {
  if (!player || !Array.isArray(player.inventory)) return false;
  return player.inventory.some(it => it.equipped && isShieldItem(it.name));
}

function setPlayerEquippedArmor(playerId, armorKey, hasShield) {
  const p = PLAYERS.find(x => x.id === playerId);
  if (!p) return;
  if (!Array.isArray(p.inventory)) p.inventory = [];

  p.inventory.forEach(it => {
    if (isArmorItem(it.name) || isShieldItem(it.name)) {
      it.equipped = false;
    }
  });

  if (armorKey && armorKey !== 'none') {
    const armStats = getArmorItemStats(armorKey);
    const armName = armStats.name || armorKey;
    const existingArm = p.inventory.find(it => isArmorItem(it.name) && (it.name.toLowerCase().includes(armorKey.toLowerCase()) || armorKey.toLowerCase().includes(it.name.toLowerCase())));
    if (existingArm) {
      existingArm.equipped = true;
    } else {
      p.inventory.push({
        id: 'item_arm_' + Date.now(),
        name: armName,
        qty: 1,
        weight: armStats.type === 'heavy' ? 20 : (armStats.type === 'medium' ? 12 : 5),
        equipped: true
      });
    }
  }

  if (hasShield) {
    const existingShield = p.inventory.find(it => isShieldItem(it.name));
    if (existingShield) {
      existingShield.equipped = true;
    } else {
      p.inventory.push({
        id: 'item_shd_' + Date.now(),
        name: 'Escudo',
        qty: 1,
        weight: 6,
        equipped: true
      });
    }
  }

  ensurePlayerCalculatedAc(p);
  if (typeof touchPlayer === 'function') touchPlayer(p);
  renderPlayers();
  if (typeof renderCombat === 'function') renderCombat();
  saveToLocalStorage();
  if (typeof syncLocalChangesToFirebase === 'function') syncLocalChangesToFirebase(true);
  if (typeof broadcastStateSync === 'function') broadcastStateSync();
  if (typeof showToast === 'function') showToast(`🛡️ Equipamentos de ${p.name} atualizados (CA: ${p.ac})!`, 'success');
}

function togglePlayerItemEquipped(playerId, itemIdx) {

  const p = PLAYERS.find(x => x.id === playerId);
  if (!p || !p.inventory || !p.inventory[itemIdx]) return;
  const item = p.inventory[itemIdx];
  item.equipped = !item.equipped;

  if (item.equipped && isArmorItem(item.name)) {
    p.inventory.forEach((it, idx) => {
      if (idx !== itemIdx && isArmorItem(it.name)) {
        it.equipped = false;
      }
    });
  }

  let statusMsg = '';
  if (isArmorItem(item.name) || isShieldItem(item.name)) {
    const newAc = calculatePlayerAcFromEquipment(p);
    p.ac = newAc;
    statusMsg = `${item.equipped ? 'Equipou' : 'Guardou'} ${item.name} ➔ CA atualizada para ${newAc}`;
    if (typeof showToast === 'function') showToast(`🛡️ CA de ${p.name} atualizada para ${newAc}!`);
  } else {
    statusMsg = item.equipped ? `Equipou ${item.name}` : `Guardou ${item.name} na mochila`;
  }

  touchPlayer(p);
  addPlayerActionLog(p.id, '🛡️', statusMsg, 'general');
  renderPlayers();
  saveToLocalStorage();
  if (typeof syncLocalChangesToFirebase === 'function') syncLocalChangesToFirebase(true);
  if (typeof broadcastStateSync === 'function') broadcastStateSync();
}

function togglePlayerItemAttunement(playerId, itemIdx) {
  const p = PLAYERS.find(x => x.id === playerId);
  if (!p || !p.inventory || !p.inventory[itemIdx]) return;
  const item = p.inventory[itemIdx];

  const currentAttuned = p.inventory.filter(it => it.attuned).length;
  if (!item.attuned && currentAttuned >= 3) {
    if (typeof showToast === 'function') {
      showToast('⚠️ Limite de Sintonização atingido! Um personagem pode ter no máximo 3 itens mágicos sintonizados (D&D 5E).');
    } else if (typeof alert === 'function') {
      alert('⚠️ Limite de Sintonização atingido! Um personagem pode ter no máximo 3 itens mágicos sintonizados (D&D 5E).');
    }
    return;
  }

  item.attuned = !item.attuned;
  touchPlayer(p);
  const msg = item.attuned ? `Sintonizou com "${item.name}" 💎` : `Encerrou sintonização com "${item.name}"`;
  addPlayerActionLog(p.id, '💎', msg, 'general');
  if (typeof showToast === 'function') showToast(`💎 ${msg}`);
  renderPlayers();
  saveToLocalStorage();
  if (typeof syncLocalChangesToFirebase === 'function') syncLocalChangesToFirebase(true);
  if (typeof broadcastStateSync === 'function') broadcastStateSync();
}

// ========================================================
// 🎲 CONTROLE DE DADOS FÍSICOS DA MESA (EXPANDIDO PARA TODA A FICHA)
// ========================================================
let activePhysicalRollContext = null;

function togglePlayerDiceMode(playerId) {
  const p = PLAYERS.find(x => x.id === playerId);
  if (!p) return;
  p.diceMode = (p.diceMode === 'physical') ? 'virtual' : 'physical';
  touchPlayer(p);
  const modeLabel = p.diceMode === 'physical' ? '🎲 Dados Físicos da Mesa' : '💻 Dados Virtuais do App';
  if (typeof showToast === 'function') showToast(`Modo de rolagem de ${p.name}: ${modeLabel}`);
  renderPlayers();
  saveToLocalStorage();
  if (typeof syncLocalChangesToFirebase === 'function') syncLocalChangesToFirebase(true);
  if (typeof broadcastStateSync === 'function') broadcastStateSync();
}

function openPhysicalD20Modal(context) {
  activePhysicalRollContext = context;
  const modal = document.getElementById('modal-physical-dice-input');
  const titleEl = document.getElementById('physical-dice-title');
  const subEl = document.getElementById('physical-dice-subtitle');
  const inpEl = document.getElementById('inp-physical-d20-direct');
  if (titleEl) titleEl.innerText = context.title || 'Dado Físico da Mesa';
  if (subEl) subEl.innerText = context.subtitle || 'Selecione ou digite o valor tirado no d20 real (1 a 20)';
  if (inpEl) {
    inpEl.value = '';
    setTimeout(() => {
      if (inpEl) inpEl.focus();
    }, 50);
  }
  if (modal) modal.classList.add('active');
}

function closePhysicalDiceModal() {
  const modal = document.getElementById('modal-physical-dice-input');
  if (modal) modal.classList.remove('active');
  activePhysicalRollContext = null;
}

function submitPhysicalD20Roll(val) {
  const d20 = parseInt(val, 10);
  if (isNaN(d20) || d20 < 1 || d20 > 20) {
    if (typeof showToast === 'function') showToast('⚠️ Por favor, informe um valor de d20 válido entre 1 e 20.');
    else alert('Por favor, informe um valor de d20 válido entre 1 e 20.');
    return;
  }
  const ctx = activePhysicalRollContext;
  closePhysicalDiceModal();
  if (!ctx) return;
  executePhysicalRollWithD20(ctx, d20);
}

function submitPhysicalD20DirectInput() {
  const inpEl = document.getElementById('inp-physical-d20-direct');
  const val = inpEl ? inpEl.value : '';
  submitPhysicalD20Roll(val);
}

function switchActiveRollToVirtual() {
  const ctx = activePhysicalRollContext;
  closePhysicalDiceModal();
  if (!ctx) return;
  executePhysicalRollWithD20(ctx, null);
}

function executePhysicalRollWithD20(ctx, d20Val) {
  if (!ctx) return;
  if (ctx.type === 'attack') {
    rollPlayerAttack(ctx.playerId, ctx.rawAttackText, d20Val);
  } else if (ctx.type === 'skill') {
    rollPlayerSkill(ctx.playerId, ctx.skillKey, ctx.mode, d20Val);
  } else if (ctx.type === 'save') {
    rollPlayerSavingThrow(ctx.playerId, ctx.attrName, ctx.mode, d20Val);
  } else if (ctx.type === 'attr') {
    rollPlayerAttr(ctx.playerId, ctx.attrName, d20Val);
  } else if (ctx.type === 'spellAttack') {
    rollPlayerSpellAttack(ctx.playerId, d20Val);
  }
}

// ========================================================
// ⏱️ ECONOMIA DE TURNO & CONCENTRAÇÃO ATIVA (D&D BEYOND STYLE)
// ========================================================
function getAttackActionType(rawAttackText) {
  if (!rawAttackText) return 'action';
  const txt = String(rawAttackText).toLowerCase();
  if (txt.includes('bônus') || txt.includes('bonus') || txt.includes('secundária') || txt.includes('secundaria') || txt.includes('offhand')) {
    return 'bonus';
  }
  if (txt.includes('reação') || txt.includes('reacao') || txt.includes('oportunidade')) {
    return 'reaction';
  }
  return 'action';
}

function getSpellActionType(sp) {
  if (!sp) return 'action';
  let spellObj = sp;
  if (typeof sp === 'string') {
    spellObj = (typeof SPELLS_DATA !== 'undefined')
      ? SPELLS_DATA.find(s => s.name.toLowerCase() === sp.toLowerCase())
      : null;
  } else if (typeof sp === 'object' && !sp.time && !sp.castTime && sp.name) {
    spellObj = (typeof SPELLS_DATA !== 'undefined')
      ? SPELLS_DATA.find(s => s.name.toLowerCase() === sp.name.toLowerCase())
      : sp;
  }
  const ct = String((spellObj && (spellObj.time || spellObj.castTime)) || (typeof sp === 'string' ? '' : (sp.time || sp.castTime || ''))).toLowerCase();
  if (ct.includes('bônus') || ct.includes('bonus')) return 'bonus';
  if (ct.includes('reação') || ct.includes('reacao') || ct.includes('reaction')) return 'reaction';
  return 'action';
}

function setPlayerActionFilter(playerId, filter) {
  const p = PLAYERS.find(x => x.id === playerId);
  if (!p) return;
  p.actionEconomyFilter = filter || 'all';
  renderPlayers();
}

function setPlayerConcentration(playerId, spellName) {
  const p = PLAYERS.find(x => x.id === playerId);
  if (!p) return;
  p.concentrationSpell = spellName;
  touchPlayer(p);
  addLog(`🧘 <b>${p.name}</b> agora está concentrando em <b>${spellName}</b>.`);
  addPlayerActionLog(p.id, '🧘', `Iniciou concentração em ${spellName}`, 'spell');
  if (typeof showToast === 'function') showToast(`🧘 Concentração: ${spellName}`);
  renderPlayers();
  saveToLocalStorage();
  if (typeof syncLocalChangesToFirebase === 'function') syncLocalChangesToFirebase(true);
  if (typeof broadcastStateSync === 'function') broadcastStateSync();
}

function clearPlayerConcentration(playerId) {
  const p = PLAYERS.find(x => x.id === playerId);
  if (!p) return;
  const prev = p.concentrationSpell;
  p.concentrationSpell = null;
  touchPlayer(p);
  if (prev) {
    addLog(`🧘 <b>${p.name}</b> encerrou a concentração em <b>${prev}</b>.`);
    addPlayerActionLog(p.id, '🧘', `Encerrou concentração em ${prev}`, 'spell');
    if (typeof showToast === 'function') showToast(`Concentração encerrada: ${prev}`);
  }
  renderPlayers();
  saveToLocalStorage();
  if (typeof syncLocalChangesToFirebase === 'function') syncLocalChangesToFirebase(true);
  if (typeof broadcastStateSync === 'function') broadcastStateSync();
}

// ========================================================
// ⚡ CONTADORES TÁTEIS & RECURSOS RÁPIDOS (DOCK DE 1-TOQUE - ISSUE-102)
// ========================================================
function renderPlayerResourceQuickDock(p) {
  initPlayerFeatureCharges(p);
  if (!p.featureCharges || p.featureCharges.length === 0) return '';

  const pills = p.featureCharges.map(f => {
    const remaining = f.max - f.used;
    const isAvail = remaining > 0;

    if (f.id === 'lay_on_hands') {
      return `
        <div class="resource-quick-chip lay-on-hands" title="Cura pelas Mãos (Paladino D&D 5E): Toque em -1 ou -5 para gastar e curar">
          <span>🤲 Mãos:</span>
          <span class="resource-counter-badge"><b class="res-cur">${remaining}</b><span class="res-sep">/</span><span class="res-max">${f.max} PV</span></span>
          <div style="display:inline-flex; gap:3px; margin-left:4px;">
            <button type="button" class="resource-stepper-btn" onclick="usePlayerLayOnHandsQuick('${p.id}', 1)" title="Curar 1 PV">-1</button>
            <button type="button" class="resource-stepper-btn" onclick="usePlayerLayOnHandsQuick('${p.id}', 5)" title="Curar 5 PV">-5</button>
          </div>
        </div>
      `;
    }

    if (f.id === 'second_wind') {
      return `
        <button type="button" class="resource-quick-chip ${!isAvail ? 'exhausted' : ''}" 
                onclick="usePlayerSecondWindQuick('${p.id}')" 
                title="Retomar o Fôlego (Guerreiro): Cura 1d10 + Nível de Guerreiro (${p.level}) em Ação Bônus">
          <span>💨 Fôlego</span>
          <span class="resource-counter-badge"><b class="res-cur">${remaining}</b><span class="res-sep">/</span><span class="res-max">${f.max}</span></span>
        </button>
      `;
    }

    if (f.id === 'action_surge') {
      return `
        <button type="button" class="resource-quick-chip ${!isAvail ? 'exhausted' : ''}" 
                onclick="usePlayerActionSurgeQuick('${p.id}')" 
                title="Surto de Ação (Guerreiro): 1 Ação adicional no turno">
          <span>⚡ Surto</span>
          <span class="resource-counter-badge"><b class="res-cur">${remaining}</b><span class="res-sep">/</span><span class="res-max">${f.max}</span></span>
        </button>
      `;
    }

    return `
      <button type="button" class="resource-quick-chip ${!isAvail ? 'exhausted' : ''}" 
              onclick="${isAvail ? `usePlayerFeatureCharge('${p.id}', '${f.id}', 1)` : `restorePlayerFeatureCharge('${p.id}', '${f.id}', 1)`}" 
              title="${f.name} (${f.restType === 'short' ? 'Recupera em Descanso Curto' : 'Recupera em Descanso Longo'}) • ${isAvail ? 'Clique para usar 1' : 'Esgotado (clique para restaurar 1)'}">
        <span>${f.icon || '⚡'} ${f.name}</span>
        <span class="resource-counter-badge"><b class="res-cur">${remaining}</b><span class="res-sep">/</span><span class="res-max">${f.max}</span></span>
      </button>
    `;
  }).join('');

  return `<div class="resource-quick-dock"><span class="resource-quick-dock-label">⚡ Recursos:</span>${pills}</div>`;
}

// ========================================================
// ⏱️ MOTOR DE ECONOMIA DE AÇÕES (D&D 5E - ISSUE-101)
// ========================================================
function getFeatureActionType(f, player) {
  if (!f) return 'passive';
  const name = String(f.name || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const desc = String(f.desc || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // 1. Surto de Ação (Ação Principal / Especial)
  if (name.includes('surto de acao') || name.includes('action surge')) {
    return 'action';
  }

  // 2. Ação Bônus (Bonus Action)
  if (
    name.includes('retomar o folego') ||
    name.includes('second wind') ||
    name.includes('furia') ||
    name.includes('rage') ||
    name.includes('acao astuta') ||
    name.includes('acao arrojada') ||
    name.includes('cunning action') ||
    name.includes('inspiracao bardica') ||
    name.includes('bardic inspiration') ||
    name.includes('passo do vento') ||
    name.includes('defesa paciente') ||
    name.includes('rajada de golpes') ||
    name.includes('passo das sombras') ||
    name.includes('palavra') ||
    name.includes('luz bonus') ||
    name.includes('healing word') ||
    desc.includes('como uma acao bonus') ||
    desc.includes('gasta uma acao bonus') ||
    desc.includes('com uma acao bonus') ||
    desc.includes('usando uma acao bonus') ||
    desc.includes('em acao bonus') ||
    desc.includes('as a bonus action')
  ) {
    return 'bonus';
  }

  // 3. Reação (Reaction)
  if (
    name.includes('esquiva sobrenatural') ||
    name.includes('uncanny dodge') ||
    name.includes('aparar') ||
    name.includes('reacao defensiva') ||
    name.includes('repreensao') ||
    desc.includes('como uma reacao') ||
    desc.includes('com uma reacao') ||
    desc.includes('usando uma reacao') ||
    desc.includes('em resposta a') ||
    desc.includes('as a reaction')
  ) {
    return 'reaction';
  }

  // 4. Ação Principal (Action)
  if (
    name.includes('cura pelas maos') ||
    name.includes('lay on hands') ||
    name.includes('sentido divino') ||
    name.includes('divine sense') ||
    name.includes('canalizar divindade') ||
    name.includes('channel divinity') ||
    name.includes('forma selvagem') ||
    name.includes('wild shape') ||
    desc.includes('como uma acao') ||
    desc.includes('gasta uma acao') ||
    desc.includes('usar uma acao') ||
    desc.includes('com uma acao') ||
    desc.includes('acao para') ||
    desc.includes('as an action')
  ) {
    return 'action';
  }

  return 'passive';
}

function renderUniversalCombatActions(actionFilter) {
  if (actionFilter === 'all' || !actionFilter) {
    return `
      <div class="universal-actions-card">
        <div class="universal-actions-header"><span>⚔️ Ações Universais de Combate (D&D 5E):</span></div>
        <div class="universal-actions-chips">
          <span class="universal-act-chip" title="Realiza 1 ou mais ataques com suas armas ou desarmado">⚔️ <b>Atacar</b></span>
          <span class="universal-act-chip" title="Dobra seu deslocamento para a rodada atual">🏃 <b>Disparada (Dash)</b></span>
          <span class="universal-act-chip" title="Seu movimento não provoca ataques de oportunidade pelo resto do turno">💨 <b>Desengajar</b></span>
          <span class="universal-act-chip" title="Ataques contra você têm desvantagem e testes de DES têm vantagem">🛡️ <b>Esquiva (Dodge)</b></span>
          <span class="universal-act-chip" title="Concede vantagem no próximo teste de perícia ou ataque de um aliado">🤝 <b>Ajudar (Help)</b></span>
          <span class="universal-act-chip" title="Realiza um teste de Furtividade para se esconder">👁️ <b>Esconder-se</b></span>
          <span class="universal-act-chip" title="Beber uma poção, puxar alavancas ou interagir com o cenário">🧪 <b>Usar Objeto</b></span>
        </div>
      </div>
    `;
  } else if (actionFilter === 'action') {
    return `
      <div class="universal-actions-card">
        <div class="universal-actions-header"><span>⚔️ Ações Universais de Combate (D&D 5E):</span></div>
        <div class="universal-actions-chips">
          <span class="universal-act-chip" title="Realiza 1 ou mais ataques com suas armas ou desarmado">⚔️ <b>Atacar</b></span>
          <span class="universal-act-chip" title="Dobra seu deslocamento para a rodada atual">🏃 <b>Disparada (Dash)</b></span>
          <span class="universal-act-chip" title="Seu movimento não provoca ataques de oportunidade pelo resto do turno">💨 <b>Desengajar</b></span>
          <span class="universal-act-chip" title="Ataques contra você têm desvantagem e testes de DES têm vantagem">🛡️ <b>Esquiva (Dodge)</b></span>
          <span class="universal-act-chip" title="Concede vantagem no próximo teste de perícia ou ataque de um aliado">🤝 <b>Ajudar (Help)</b></span>
          <span class="universal-act-chip" title="Realiza um teste de Furtividade para se esconder">👁️ <b>Esconder-se</b></span>
          <span class="universal-act-chip" title="Beber uma poção, puxar alavancas ou interagir com o cenário">🧪 <b>Usar Objeto</b></span>
        </div>
      </div>
    `;
  } else if (actionFilter === 'bonus') {
    return `
      <div class="universal-actions-card">
        <div class="universal-actions-header" style="color: #fde047;"><span>⚡ Ações Bônus Universais (D&D 5E):</span></div>
        <div class="universal-actions-chips">
          <span class="universal-act-chip" title="Ao atacar com arma leve corpo a corpo em uma mão, use a ação bônus para atacar com arma leve na outra mão">🗡️ <b>Combate com Duas Armas</b></span>
          <span class="universal-act-chip" title="Lançar magia com tempo de conjuração de 1 ação bônus">✨ <b>Magia Bônus</b></span>
          <span class="universal-act-chip" title="Habilidades de classe (ex: Retomar o Fôlego, Fúria, Ação Astuta) e magias de 1 Ação Bônus">✨ <b>Recursos & Magias de Bônus</b></span>
        </div>
      </div>
    `;
  } else if (actionFilter === 'reaction') {
    return `
      <div class="universal-actions-card">
        <div class="universal-actions-header" style="color: #d8b4fe;"><span>🛡️ Reações Universais (D&D 5E):</span></div>
        <div class="universal-actions-chips">
          <span class="universal-act-chip" title="Ataque corpo a corpo imediato contra criatura que sair do seu alcance sem Desengajar">⚔️ <b>Ataque de Oportunidade</b></span>
          <span class="universal-act-chip" title="Magias defensivas como Escudo Arcano, Contramágica, Queda Suave ou Esquiva Sobrenatural">🔮 <b>Magias & Habilidades Reativas</b></span>
        </div>
      </div>
    `;
  }
  return '';
}

function usePlayerLayOnHandsQuick(playerId, amount = 1) {
  const p = PLAYERS.find(x => x.id === playerId);
  if (!p) return;
  initPlayerFeatureCharges(p);
  const charge = p.featureCharges.find(f => f.id === 'lay_on_hands');
  if (!charge) return;
  if (charge.used + amount > charge.max) {
    if (typeof showToast === 'function') showToast('⚠️ Reserva de Cura pelas Mãos insuficiente!');
    return;
  }
  charge.used += amount;
  const oldHp = p.hp;
  p.hp = Math.min(p.maxHp, p.hp + amount);
  const actualHeal = p.hp - oldHp;
  touchPlayer(p);
  if (typeof playFX === 'function') playFX('heal');
  const msg = `🤲 <b>${p.name}</b> usou Cura pelas Mãos (-${amount} da reserva) e recuperou +${actualHeal} PV (HP: ${p.hp}/${p.maxHp}, Reserva restante: ${charge.max - charge.used}/${charge.max}).`;
  addLog(msg);
  addPlayerActionLog(p.id, '🤲', `Cura pelas Mãos: +${actualHeal} PV (Reserva: ${charge.max - charge.used}/${charge.max})`, 'heal');
  if (typeof showToast === 'function') showToast(`🤲 +${actualHeal} PV recuperados!`);
  renderPlayers();
  saveToLocalStorage();
  if (typeof syncLocalChangesToFirebase === 'function') syncLocalChangesToFirebase(true);
  if (typeof broadcastStateSync === 'function') broadcastStateSync();
}

function usePlayerSecondWindQuick(playerId) {
  const p = PLAYERS.find(x => x.id === playerId);
  if (!p) return;
  initPlayerFeatureCharges(p);
  const charge = p.featureCharges.find(f => f.id === 'second_wind');
  if (!charge || charge.used >= charge.max) {
    if (typeof showToast === 'function') showToast('⚠️ Retomar o Fôlego já foi utilizado! Faça um Descanso Curto.');
    return;
  }
  charge.used += 1;
  const roll = Math.floor(Math.random() * 10) + 1;
  const healAmount = roll + (p.level || 1);
  const oldHp = p.hp;
  p.hp = Math.min(p.maxHp, p.hp + healAmount);
  const actualHeal = p.hp - oldHp;
  touchPlayer(p);
  if (typeof playFX === 'function') playFX('heal');
  const msg = `💨 <b>${p.name}</b> usou Retomar o Fôlego (1d10[${roll}] + ${p.level}) e curou +${actualHeal} PV (HP: ${p.hp}/${p.maxHp})!`;
  addLog(msg);
  addPlayerActionLog(p.id, '💨', `Retomar o Fôlego: +${actualHeal} PV (1d10[${roll}]+${p.level})`, 'heal');
  if (typeof showToast === 'function') showToast(`💨 Retomar o Fôlego: +${actualHeal} PV!`);
  renderPlayers();
  saveToLocalStorage();
  if (typeof syncLocalChangesToFirebase === 'function') syncLocalChangesToFirebase(true);
  if (typeof broadcastStateSync === 'function') broadcastStateSync();
}

function usePlayerActionSurgeQuick(playerId) {
  const p = PLAYERS.find(x => x.id === playerId);
  if (!p) return;
  initPlayerFeatureCharges(p);
  const charge = p.featureCharges.find(f => f.id === 'action_surge');
  if (!charge || charge.used >= charge.max) {
    if (typeof showToast === 'function') showToast('⚠️ Surto de Ação já foi utilizado! Faça um Descanso Curto.');
    return;
  }
  charge.used += 1;
  touchPlayer(p);
  if (typeof playFX === 'function') playFX('sword');
  const msg = `⚡ <b>${p.name}</b> ativou <b>Surto de Ação (Action Surge)</b>! Ganhou 1 Ação adicional neste turno!`;
  addLog(msg);
  addPlayerActionLog(p.id, '⚡', 'Ativou Surto de Ação (Ação adicional)', 'feature');
  if (typeof showToast === 'function') showToast('⚡ Surto de Ação Ativado!');
  renderPlayers();
  saveToLocalStorage();
  if (typeof syncLocalChangesToFirebase === 'function') syncLocalChangesToFirebase(true);
  if (typeof broadcastStateSync === 'function') broadcastStateSync();
}

function formatCleanItemWeight(weight) {
  if (weight === null || weight === undefined || weight === '') return '';
  const clean = String(weight).replace(/\s*kg/gi, '').trim();
  return clean ? `${clean} kg` : '';
}

function getItemActionInfo(itemName) {
  const n = (itemName || '').toLowerCase();
  if (n.includes('flecha') || n.includes('arrow') || n.includes('virote') || n.includes('balas') || n.includes('dardo') || n.includes('munição') || n.includes('municao')) {
    return { icon: '🏹', label: 'Disparar', verb: 'Disparar', sound: 'sword', isConsumable: true, isHealPotion: false };
  }
  if (n.includes('poção') || n.includes('pocao') || n.includes('potion')) {
    const isHeal = n.includes('cura') || n.includes('healing');
    return { icon: '🧪', label: 'Beber', verb: 'Beber', sound: 'heal', isConsumable: true, isHealPotion: isHeal };
  }
  if (n.includes('ração') || n.includes('racao') || n.includes('comida') || n.includes('odre') || n.includes('água') || n.includes('agua')) {
    return { icon: '🍖', label: 'Comer', verb: 'Comer', sound: 'heal', isConsumable: true, isHealPotion: false };
  }
  if (n.includes('tocha') || n.includes('vela')) {
    return { icon: '🔥', label: 'Acender', verb: 'Acender', sound: 'spell', isConsumable: true, isHealPotion: false };
  }
  if (n.includes('pergaminho') || n.includes('scroll')) {
    return { icon: '📜', label: 'Ler/Usar', verb: 'Ler/Usar', sound: 'spell', isConsumable: true, isHealPotion: false };
  }
  return { icon: '⚡', label: 'Usar', verb: 'Usar', sound: 'sword', isConsumable: true, isHealPotion: false };
}

function usePlayerInventoryItem(playerId, itemIdx) {
  const p = PLAYERS.find(x => x.id === playerId);
  if (!p || !p.inventory || !p.inventory[itemIdx]) return;
  const it = p.inventory[itemIdx];
  const currentQty = parseInt(it.qty, 10) || 1;

  if (currentQty <= 0) {
    alert(`Você não possui mais unidades de "${it.name}"!`);
    return;
  }

  // Decrementa 1 unidade daquele item
  it.qty = Math.max(0, currentQty - 1);
  touchPlayer(p);
  const remaining = it.qty;
  const actionInfo = getItemActionInfo(it.name);
  const nameLower = (it.name || '').toLowerCase();

  let effectMsg = '';

  // Efeitos interativos para itens comuns de D&D 5E
  if (nameLower.includes('poção') || nameLower.includes('pocao') || nameLower.includes('potion')) {
    if (nameLower.includes('cura') || nameLower.includes('healing')) {
      let healRoll = 0;
      if (nameLower.includes('suprema') || nameLower.includes('supreme')) {
        healRoll = Array.from({ length: 10 }, () => Math.floor(Math.random() * 4) + 1).reduce((a, b) => a + b, 0) + 20;
      } else if (nameLower.includes('superior')) {
        healRoll = Array.from({ length: 8 }, () => Math.floor(Math.random() * 4) + 1).reduce((a, b) => a + b, 0) + 8;
      } else if (nameLower.includes('maior') || nameLower.includes('greater')) {
        healRoll = Array.from({ length: 4 }, () => Math.floor(Math.random() * 4) + 1).reduce((a, b) => a + b, 0) + 4;
      } else {
        const d1 = Math.floor(Math.random() * 4) + 1;
        const d2 = Math.floor(Math.random() * 4) + 1;
        healRoll = d1 + d2 + 2;
      }
      const prevHp = p.hp;
      p.hp = Math.min(p.maxHp, p.hp + healRoll);
      effectMsg = ` • Recuperou +${healRoll} PV (${prevHp} ➔ ${p.hp}/${p.maxHp} PV)`;

      const comb = (typeof findCombatantForPlayer === 'function')
        ? findCombatantForPlayer(p, typeof state !== 'undefined' ? state.combatants : [])
        : ((typeof state !== 'undefined' && state.combatants) ? state.combatants.find(c => (c.playerId && c.playerId === p.id) || c.name.includes(p.name)) : null);
      if (comb) { comb.hp = p.hp; if (typeof renderCombat === 'function') renderCombat(); }
    }
  }

  if (typeof playFX === 'function') playFX(actionInfo.sound || 'sword');

  const logStr = `${actionInfo.label.toLowerCase()} 1x <b>${it.name}</b>${effectMsg} (${remaining}x restantes)`;
  addLog(`${actionInfo.icon} <b>${p.name}</b> ${logStr}`);
  addPlayerActionLog(p.id, actionInfo.icon, `${actionInfo.label} 1x ${it.name}${effectMsg} (${remaining}x restantes)`, 'item');

  renderPlayers();
  saveToLocalStorage();
}

let playerSkillSearchTerms = {};
function filterSkillsCard(playerId, term) {
  playerSkillSearchTerms[playerId] = (term || '').toLowerCase().trim();
  const container = document.getElementById(`skills-grid-${playerId}`);
  if (!container) return;
  const items = container.querySelectorAll('.skill-card-item, .skill-attr-group-header');
  const q = playerSkillSearchTerms[playerId];
  items.forEach(el => {
    if (el.classList.contains('skill-attr-group-header')) {
      el.style.display = q ? 'none' : 'flex';
      return;
    }
    const name = el.getAttribute('data-skill-name') || '';
    if (!q || name.includes(q)) {
      el.style.display = 'flex';
    } else {
      el.style.display = 'none';
    }
  });
}

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

function syncPlayerCoinsAndGold(p) {
  if (!p) return null;
  p.coins = p.coins || { cp: 0, sp: 0, ep: 0, gp: (p.gold !== undefined ? Number(p.gold) : 0), pp: 0 };
  p.coins.cp = Number(p.coins.cp || 0);
  p.coins.sp = Number(p.coins.sp || 0);
  p.coins.ep = Number(p.coins.ep || 0);
  p.coins.gp = Number(p.coins.gp || 0);
  p.coins.pp = Number(p.coins.pp || 0);
  const totalGp = (p.coins.cp / 100) + (p.coins.sp / 10) + (p.coins.ep / 2) + p.coins.gp + (p.coins.pp * 10);
  p.gold = Math.floor(totalGp);
  return p;
}

function getPlayerCoinPurse(p) {
  p = syncPlayerCoinsAndGold(p) || p;
  const totalGp = (p.coins.cp || 0) / 100 + (p.coins.sp || 0) / 10 + (p.coins.ep || 0) / 2 + (p.coins.gp || 0) + (p.coins.pp || 0) * 10;
  return {
    coins: p.coins,
    gold: p.gold,
    totalGp: Math.round(totalGp * 100) / 100
  };
}

// --- FUNÇÕES AUXILIARES ROLL20 (D&D 5E 2024 SHEET) ---

// ISSUE-164: Ataques Especiais de Classe, Raça e Truques Ofensivos Conhecidos
function getPlayerSpecialClassAttacks(p) {
  if (!p) return [];
  const specialAttacks = [];
  const prof = getProfBonus(p.level || 1);
  const strMod = Math.floor(((p.str || 10) - 10) / 2);
  const dexMod = Math.floor(((p.dex || 10) - 10) / 2);
  const conMod = Math.floor(((p.con || 10) - 10) / 2);
  const intMod = Math.floor(((p.int || 10) - 10) / 2);
  const wisMod = Math.floor(((p.wis || 10) - 10) / 2);
  const chaMod = Math.floor(((p.cha || 10) - 10) / 2);

  const getEffectiveClassLevel = (player, classKw) => {
    const kw = classKw.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const classes = typeof getPlayerClassesList === 'function' ? getPlayerClassesList(player) : [];
    let lvl = 0;
    classes.forEach(c => {
      const cName = (c.className || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      if (cName.includes(kw)) {
        lvl += parseInt(c.level, 10) || 0;
      }
    });
    if (lvl > 0) return lvl;
    const pClass = (player.className || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (pClass.includes(kw)) {
      return parseInt(player.level, 10) || 1;
    }
    return 0;
  };

  // 1. Ladino (Rogue): Ataque Furtivo (Sneak Attack)
  const rogueLvl = getEffectiveClassLevel(p, 'ladino') || getEffectiveClassLevel(p, 'rogue');
  if (rogueLvl >= 1) {
    const sneakDiceCount = Math.ceil(rogueLvl / 2);
    specialAttacks.push({
      name: 'Ataque Furtivo (Sneak Attack)',
      badge: '🗡️ Furtivo',
      badgeClass: 'badge-sneak',
      type: 'Dano Adicional • 1×/Turno',
      range: 'Arma Acuidade/Dist.',
      toHit: '—',
      toHitVal: 0,
      hitBonus: '—',
      bonus: '—',
      hit: '—',
      damage: `+${sneakDiceCount}d6`,
      dmg: `+${sneakDiceCount}d6`,
      damageType: 'Dano da Arma',
      notes: '1× por turno ao atingir com arma de acuidade ou à distância tendo Vantagem ou aliado a 1,5m',
      isSpecialAttack: true,
      isDamageBonusOnly: true,
      rawAttackText: `Ataque Furtivo (+0) ${sneakDiceCount}d6 dano extra`
    });
  }

  // 2. Paladino (Paladin): Destruição Divina & Canalizar Divindade
  const paladinLvl = getEffectiveClassLevel(p, 'paladino') || getEffectiveClassLevel(p, 'paladin');
  if (paladinLvl >= 2) {
    specialAttacks.push({
      name: 'Destruição Divina (Divine Smite)',
      badge: '✨ Divino',
      badgeClass: 'badge-smite',
      type: 'Dano Adicional • No Acerto',
      range: 'Corpo a Corpo',
      toHit: '—',
      toHitVal: 0,
      hitBonus: '—',
      bonus: '—',
      hit: '—',
      damage: '+2d8 a +5d8',
      dmg: '+2d8 a +5d8',
      damageType: 'Radiante',
      notes: 'Ao atingir C.a.C.: gasta 1 espaço (2d8 no 1º círc. +1d8/círc. acima, máx 5d8; +1d8 vs Morto-Vivo/Corruptor)',
      isSpecialAttack: true,
      isDamageBonusOnly: true,
      rawAttackText: 'Destruição Divina (+0) 2d8 radiante'
    });
  }
  if (paladinLvl >= 3) {
    const subNorm = ((p.subclass || '') + ' ' + (p.className || '')).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const chaBonus = Math.max(1, chaMod);
    if (subNorm.includes('devocao') || subNorm.includes('devotion') || !p.subclass) {
      specialAttacks.push({
        name: 'Arma Sagrada (Canalizar Divindade)',
        badge: '✨ Sagrada',
        badgeClass: 'badge-sacred',
        type: 'Canalizar Divindade • Ação',
        range: 'Arma Empunhada',
        toHit: `+${chaBonus}`,
        toHitVal: chaBonus,
        hitBonus: `+${chaBonus}`,
        bonus: `+${chaBonus}`,
        hit: `+${chaBonus}`,
        damage: 'Luz 6m',
        dmg: 'Luz 6m',
        damageType: 'Mágico',
        notes: `Adiciona +${chaBonus} (Carisma) a todas as jogadas de ataque com a arma por 1 minuto`,
        isSpecialAttack: true,
        rawAttackText: `Arma Sagrada (+${chaBonus}) 0 luz`
      });
    }
    if (subNorm.includes('conquista') || subNorm.includes('conquest') || subNorm.includes('vinganca') || subNorm.includes('vengeance') || subNorm.includes('guerra') || subNorm.includes('war')) {
      specialAttacks.push({
        name: 'Ataque Guiado (Canalizar Divindade)',
        badge: '🎯 Guiado',
        badgeClass: 'badge-guided',
        type: 'Canalizar Divindade • Reação',
        range: 'Pessoal',
        toHit: '+10',
        toHitVal: 10,
        hitBonus: '+10',
        bonus: '+10',
        hit: '+10',
        damage: 'Bônus no Acerto',
        dmg: 'Bônus no Acerto',
        damageType: 'Especial',
        notes: '+10 de bônus na jogada de ataque após rolar o d20',
        isSpecialAttack: true,
        rawAttackText: 'Ataque Guiado (+10) 0 especial'
      });
    }
  }

  // 3. Bárbaro (Barbarian): Dano em Fúria (Rage)
  const barbLvl = getEffectiveClassLevel(p, 'barbaro') || getEffectiveClassLevel(p, 'barbarian');
  if (barbLvl >= 1) {
    const rageBonus = barbLvl >= 16 ? 4 : (barbLvl >= 9 ? 3 : 2);
    specialAttacks.push({
      name: 'Dano em Fúria (Rage)',
      badge: '💢 Fúria',
      badgeClass: 'badge-rage',
      type: 'Dano Adicional • Bônus',
      range: 'Corpo a Corpo',
      toHit: '—',
      toHitVal: 0,
      hitBonus: '—',
      bonus: '—',
      hit: '—',
      damage: `+${rageBonus}`,
      dmg: `+${rageBonus}`,
      damageType: 'Dano da Arma',
      notes: `Adiciona +${rageBonus} ao dano de ataques corpo a corpo usando FOR durante a Fúria`,
      isSpecialAttack: true,
      isDamageBonusOnly: true,
      rawAttackText: `Dano em Fúria (+0) +${rageBonus} dano extra`
    });
  }

  // 4. Monge (Monk): Golpe Desarmado (Artes Marciais)
  const monkLvl = getEffectiveClassLevel(p, 'monge') || getEffectiveClassLevel(p, 'monk');
  if (monkLvl >= 1) {
    const martialDie = monkLvl >= 17 ? '1d10' : (monkLvl >= 11 ? '1d8' : (monkLvl >= 5 ? '1d6' : '1d4'));
    const monkMod = Math.max(strMod, dexMod);
    const monkHit = prof + monkMod;
    const monkHitStr = monkHit >= 0 ? `+${monkHit}` : `${monkHit}`;
    const monkDmgStr = `${martialDie}${monkMod !== 0 ? (monkMod > 0 ? '+' + monkMod : monkMod) : ''}`;
    specialAttacks.push({
      name: 'Golpe Desarmado (Artes Marciais)',
      badge: '🥋 Marcial',
      badgeClass: 'badge-monk',
      type: 'Ação Bônus • C.a.C.',
      range: '1,5m',
      toHit: monkHitStr,
      toHitVal: monkHit,
      hitBonus: monkHitStr,
      bonus: monkHitStr,
      hit: monkHitStr,
      damage: monkDmgStr,
      dmg: monkDmgStr,
      damageType: 'Concussão',
      notes: 'Ação Bônus ao atacar com arma de monge ou desarmado; usa Destreza no acerto e dano',
      isSpecialAttack: true,
      rawAttackText: `Golpe Desarmado (${monkHitStr}) ${monkDmgStr} concussão`
    });
  }

  // 5. Draconato (Dragonborn): Arma de Sopro
  const raceNorm = (p.race || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (raceNorm.includes('draconato') || raceNorm.includes('dragonborn')) {
    const pLvl = parseInt(p.level, 10) || 1;
    const breathDice = pLvl >= 16 ? '5d6' : (pLvl >= 11 ? '4d6' : (pLvl >= 6 ? '3d6' : '2d6'));
    const breathDc = 8 + prof + conMod;
    specialAttacks.push({
      name: 'Arma de Sopro (Draconato)',
      badge: '🔥 Sopro',
      badgeClass: 'badge-breath',
      type: 'Ação • 1×/Descanso',
      range: 'Cone 4,5m / Linha 9m',
      toHit: `CD ${breathDc}`,
      toHitVal: breathDc,
      hitBonus: `CD ${breathDc}`,
      bonus: `CD ${breathDc}`,
      hit: `CD ${breathDc}`,
      damage: breathDice,
      dmg: breathDice,
      damageType: 'Ancestralidade',
      notes: `Salvaguarda CD ${breathDc} (DES ou CON conforme ancestralidade); metade do dano se passar`,
      isSpecialAttack: true,
      rawAttackText: `Arma de Sopro (CD ${breathDc}) ${breathDice} dano elemental`
    });
  }

  // 6. Rajada Mística & Truques de Ataque Conhecidos
  const knownSpells = typeof getPlayerKnownSpells === 'function' ? getPlayerKnownSpells(p) : [];
  const spellsNorm = knownSpells.map(s => (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''));
  const warlockLvl = getEffectiveClassLevel(p, 'bruxo') || getEffectiveClassLevel(p, 'warlock');
  const hasEldritchBlast = spellsNorm.some(s => s.includes('rajada mistica') || s.includes('eldritch blast')) ||
    (warlockLvl >= 1 && (p.spells || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes('rajada'));

  if (hasEldritchBlast) {
    const charLvl = parseInt(p.level, 10) || 1;
    const beams = charLvl >= 17 ? 4 : (charLvl >= 11 ? 3 : (charLvl >= 5 ? 2 : 1));
    const traitsText = [p.traits, p.features, p.classFeatures, (p.customFeatures || []).map(f => f.name + ' ' + f.desc).join(' ')].join(' ').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const hasAgonizing = traitsText.includes('rajada agonizante') || traitsText.includes('agonizing blast');
    const blastDmgMod = hasAgonizing && chaMod > 0 ? `+${chaMod}` : '';
    const spellStats = typeof getPlayerSpellcastingStats === 'function' ? getPlayerSpellcastingStats(p) : null;
    const blastHit = (spellStats && spellStats.attackBonus) ? spellStats.attackBonus : (prof + chaMod >= 0 ? `+${prof + chaMod}` : `${prof + chaMod}`);
    const blastHitVal = (spellStats && spellStats.attackModNum !== undefined) ? spellStats.attackModNum : (prof + chaMod);
    specialAttacks.push({
      name: 'Rajada Mística (Eldritch Blast)',
      badge: '🟣 Truque',
      badgeClass: 'badge-cantrip',
      type: 'Magia de Ataque • 1 Ação',
      range: '36m',
      toHit: blastHit,
      toHitVal: blastHitVal,
      hitBonus: blastHit,
      bonus: blastHit,
      hit: blastHit,
      damage: `${beams > 1 ? beams + '× ' : ''}1d10${blastDmgMod}`,
      dmg: `${beams > 1 ? beams + '× ' : ''}1d10${blastDmgMod}`,
      damageType: 'Energia',
      notes: `${beams} feixe(s) de 1d10 de energia${hasAgonizing ? ` (+${chaMod} por feixe)` : ''}; alcance 36m`,
      isSpecialAttack: true,
      rawAttackText: `Rajada Mística (${blastHit}) 1d10${blastDmgMod} energia`
    });
  }

  // 7. Outros Truques Ofensivos Conhecidos (Raio de Fogo, Raio de Gelo, Toque Chocante)
  const spellStats = typeof getPlayerSpellcastingStats === 'function' ? getPlayerSpellcastingStats(p) : null;
  const sAtkBonus = (spellStats && spellStats.attackBonus) ? spellStats.attackBonus : (prof + Math.max(intMod, wisMod, chaMod) >= 0 ? `+${prof + Math.max(intMod, wisMod, chaMod)}` : `${prof + Math.max(intMod, wisMod, chaMod)}`);
  const sAtkVal = (spellStats && spellStats.attackModNum !== undefined) ? spellStats.attackModNum : (prof + Math.max(intMod, wisMod, chaMod));
  const cLvl = parseInt(p.level, 10) || 1;
  const cantripDiceCount = cLvl >= 17 ? 4 : (cLvl >= 11 ? 3 : (cLvl >= 5 ? 2 : 1));

  if (spellsNorm.some(s => s.includes('raio de fogo') || s.includes('fire bolt'))) {
    specialAttacks.push({
      name: 'Raio de Fogo (Fire Bolt)',
      badge: '🔥 Truque',
      badgeClass: 'badge-cantrip',
      type: 'Magia de Ataque • 1 Ação',
      range: '36m',
      toHit: sAtkBonus,
      toHitVal: sAtkVal,
      hitBonus: sAtkBonus,
      bonus: sAtkBonus,
      hit: sAtkBonus,
      damage: `${cantripDiceCount}d10`,
      dmg: `${cantripDiceCount}d10`,
      damageType: 'Fogo',
      notes: 'Incendeia objetos inflamáveis que não estejam sendo vestidos ou carregados',
      isSpecialAttack: true,
      rawAttackText: `Raio de Fogo (${sAtkBonus}) ${cantripDiceCount}d10 fogo`
    });
  }
  if (spellsNorm.some(s => s.includes('raio de gelo') || s.includes('ray of frost'))) {
    specialAttacks.push({
      name: 'Raio de Gelo (Ray of Frost)',
      badge: '❄️ Truque',
      badgeClass: 'badge-cantrip',
      type: 'Magia de Ataque • 1 Ação',
      range: '18m',
      toHit: sAtkBonus,
      toHitVal: sAtkVal,
      hitBonus: sAtkBonus,
      bonus: sAtkBonus,
      hit: sAtkBonus,
      damage: `${cantripDiceCount}d8`,
      dmg: `${cantripDiceCount}d8`,
      damageType: 'Frio',
      notes: 'Reduz o deslocamento do alvo em 3m até o início do seu próximo turno',
      isSpecialAttack: true,
      rawAttackText: `Raio de Gelo (${sAtkBonus}) ${cantripDiceCount}d8 frio`
    });
  }
  if (spellsNorm.some(s => s.includes('toque chocante') || s.includes('shocking grasp'))) {
    specialAttacks.push({
      name: 'Toque Chocante (Shocking Grasp)',
      badge: '⚡ Truque',
      badgeClass: 'badge-cantrip',
      type: 'Magia de Ataque • Toque',
      range: 'Toque',
      toHit: sAtkBonus,
      toHitVal: sAtkVal,
      hitBonus: sAtkBonus,
      bonus: sAtkBonus,
      hit: sAtkBonus,
      damage: `${cantripDiceCount}d8`,
      dmg: `${cantripDiceCount}d8`,
      damageType: 'Elétrico',
      notes: 'Vantagem no acerto se o alvo vestir armadura metálica; o alvo não pode realizar reações até o próximo turno',
      isSpecialAttack: true,
      rawAttackText: `Toque Chocante (${sAtkBonus}) ${cantripDiceCount}d8 elétrico`
    });
  }

  // 8. Patrulheiro (Ranger): Marca do Caçador (Hunter's Mark)
  const rangerLvl = getEffectiveClassLevel(p, 'patrulheiro') || getEffectiveClassLevel(p, 'ranger');
  const hasHuntersMark = spellsNorm.some(s => s.includes('marca do cacador') || s.includes('hunters mark') || s.includes('hunter mark')) || (rangerLvl >= 1);
  if (hasHuntersMark) {
    specialAttacks.push({
      name: "Marca do Caçador (Hunter's Mark)",
      badge: '🏹 Marca',
      badgeClass: 'badge-hunter',
      type: 'Dano Adicional • Ação Bônus',
      range: '27m',
      toHit: '—',
      toHitVal: 0,
      hitBonus: '—',
      bonus: '—',
      hit: '—',
      damage: '+1d6',
      dmg: '+1d6',
      damageType: 'Dano da Arma',
      notes: 'Causa +1d6 de dano adicional em cada acerto de arma contra o alvo marcado (Concentração)',
      isSpecialAttack: true,
      isDamageBonusOnly: true,
      rawAttackText: "Marca do Caçador (+0) 1d6 dano extra"
    });
  }

  // 9. Bruxo (Warlock): Bruxaria (Hex) & Maldição da Lâmina Maldita
  const hasHex = spellsNorm.some(s => s.includes('bruxaria') || s.includes('hex')) || (warlockLvl >= 1 && (p.spells || '').toLowerCase().includes('hex'));
  if (hasHex) {
    specialAttacks.push({
      name: 'Bruxaria (Hex)',
      badge: '💀 Maldição',
      badgeClass: 'badge-hex',
      type: 'Dano Adicional • Ação Bônus',
      range: '27m',
      toHit: '—',
      toHitVal: 0,
      hitBonus: '—',
      bonus: '—',
      hit: '—',
      damage: '+1d6',
      dmg: '+1d6',
      damageType: 'Necrótico',
      notes: 'Causa +1d6 de dano necrótico em cada acerto de ataque contra o alvo amaldiçoado (Concentração)',
      isSpecialAttack: true,
      isDamageBonusOnly: true,
      rawAttackText: 'Bruxaria (+0) 1d6 necrótico'
    });
  }

  const subNorm = ((p.subclass || '') + ' ' + (p.className || '')).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (subNorm.includes('lamina maldita') || subNorm.includes('hexblade') || ((p.traits || '') + ' ' + (p.features || '')).toLowerCase().includes('hexblade')) {
    specialAttacks.push({
      name: 'Maldição da Lâmina Maldita (Hexblade)',
      badge: '🗡️ Hexblade',
      badgeClass: 'badge-hexblade',
      type: 'Dano Adicional • Ação Bônus',
      range: '9m',
      toHit: '—',
      toHitVal: 0,
      hitBonus: '—',
      bonus: '—',
      hit: '—',
      damage: `+${prof}`,
      dmg: `+${prof}`,
      damageType: 'Dano da Arma',
      notes: `Adiciona +${prof} (Bônus de Proficiência) ao dano contra o alvo amaldiçoado; acertos críticos com 19-20`,
      isSpecialAttack: true,
      isDamageBonusOnly: true,
      rawAttackText: `Maldição da Lâmina Maldita (+0) +${prof} dano extra`
    });
  }

  // 10. Clérigo (Cleric): Golpe Divino (Divine Strike)
  const clericLvl = getEffectiveClassLevel(p, 'clerigo') || getEffectiveClassLevel(p, 'cleric');
  if (clericLvl >= 8) {
    const strikeDice = clericLvl >= 14 ? '2d8' : '1d8';
    specialAttacks.push({
      name: 'Golpe Divino (Divine Strike)',
      badge: '⚡ Golpe Divino',
      badgeClass: 'badge-divine-strike',
      type: 'Dano Adicional • 1×/Turno',
      range: 'Corpo a Corpo',
      toHit: '—',
      toHitVal: 0,
      hitBonus: '—',
      bonus: '—',
      hit: '—',
      damage: `+${strikeDice}`,
      dmg: `+${strikeDice}`,
      damageType: 'Radiante / Trovoada',
      notes: `1× por turno ao atingir com ataque de arma: adiciona +${strikeDice} de dano extra`,
      isSpecialAttack: true,
      isDamageBonusOnly: true,
      rawAttackText: `Golpe Divino (+0) ${strikeDice} radiante`
    });
  }

  return specialAttacks;
}

// ISSUE-168: Controle de Munição e Projéteis para Armas à Distância
function getPlayerAmmunitionForItem(p, weaponName, propRaw = '') {
  if (!p || !p.inventory || !Array.isArray(p.inventory)) return null;
  const wNorm = (weaponName || '').toLowerCase();
  const pNorm = (propRaw || '').toLowerCase();

  let ammoType = null;
  let ammoLabel = '';
  let ammoIcon = '🏹';

  if (wNorm.includes('arco') || wNorm.includes('bow')) {
    ammoType = 'arrow';
    ammoLabel = 'flechas';
    ammoIcon = '🏹';
  } else if (wNorm.includes('besta') || wNorm.includes('crossbow')) {
    ammoType = 'bolt';
    ammoLabel = 'virotes';
    ammoIcon = '🎯';
  } else if (wNorm.includes('funda') || wNorm.includes('sling')) {
    ammoType = 'bullet';
    ammoLabel = 'balas';
    ammoIcon = '🪨';
  } else if (wNorm.includes('zarabatana') || wNorm.includes('blowgun')) {
    ammoType = 'needle';
    ammoLabel = 'agulhas';
    ammoIcon = '📍';
  } else if (pNorm.includes('munição') || pNorm.includes('municao')) {
    ammoType = 'ammo';
    ammoLabel = 'projéteis';
    ammoIcon = '🏹';
  }

  if (!ammoType) return null;

  const ammoItem = p.inventory.find(it => {
    const iName = (it.name || '').toLowerCase();
    if (ammoType === 'arrow') return iName.includes('flecha') || iName.includes('arrow');
    if (ammoType === 'bolt') return iName.includes('virote') || iName.includes('bolt');
    if (ammoType === 'bullet') return iName.includes('bala') || iName.includes('bullet') || iName.includes('pedra');
    if (ammoType === 'needle') return iName.includes('agulha') || iName.includes('needle');
    return iName.includes('munição') || iName.includes('municao');
  });

  const qty = ammoItem ? (parseInt(ammoItem.qty, 10) || 1) : 0;
  return {
    ammoType,
    ammoLabel,
    ammoIcon,
    qty,
    itemId: ammoItem ? ammoItem.id : null,
    itemName: ammoItem ? ammoItem.name : (ammoType === 'arrow' ? 'Flechas' : (ammoType === 'bolt' ? 'Virotes' : 'Munição'))
  };
}

function consumePlayerAmmunition(p, weaponName, propRaw = '') {
  if (!p || !p.inventory || !Array.isArray(p.inventory)) return null;
  const ammoInfo = getPlayerAmmunitionForItem(p, weaponName, propRaw);
  if (!ammoInfo) return null;

  if (!ammoInfo.itemId) {
    return { success: false, remaining: 0, label: ammoInfo.ammoLabel, empty: true };
  }
  const item = p.inventory.find(it => it.id === ammoInfo.itemId);
  if (!item || !item.qty || item.qty <= 0) {
    return { success: false, remaining: 0, label: ammoInfo.ammoLabel, empty: true };
  }
  item.qty = Math.max(0, item.qty - 1);
  if (typeof touchPlayer === 'function') touchPlayer(p);
  if (typeof saveToLocalStorage === 'function') saveToLocalStorage();
  if (typeof syncLocalChangesToFirebase === 'function') syncLocalChangesToFirebase(true);
  if (typeof broadcastStateSync === 'function') broadcastStateSync();
  return { success: true, remaining: item.qty, label: ammoInfo.ammoLabel, empty: item.qty === 0 };
}

// ISSUE-168: Cálculo do Número de Ataques por Ação (Extra Attack)
function getPlayerExtraAttacksCount(p) {
  if (!p) return 1;
  const classes = typeof getPlayerClassesList === 'function' ? getPlayerClassesList(p) : [];
  let maxAttacks = 1;

  const checkClassAttacks = (className, level) => {
    const cNorm = (className || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const lvl = parseInt(level, 10) || 1;
    if (cNorm.includes('guerreiro') || cNorm.includes('fighter')) {
      if (lvl >= 20) return 4;
      if (lvl >= 11) return 3;
      if (lvl >= 5) return 2;
    }
    if (cNorm.includes('barbaro') || cNorm.includes('barbarian') ||
      cNorm.includes('paladino') || cNorm.includes('paladin') ||
      cNorm.includes('patrulheiro') || cNorm.includes('ranger') ||
      cNorm.includes('monge') || cNorm.includes('monk')) {
      if (lvl >= 5) return 2;
    }
    if (cNorm.includes('bardo') || cNorm.includes('bard')) {
      const sub = ((p.subclass || '') + ' ' + (p.subclassName || '')).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      if ((sub.includes('valor') || sub.includes('espadas') || sub.includes('swords')) && lvl >= 6) return 2;
    }
    if (cNorm.includes('bruxo') || cNorm.includes('warlock')) {
      const traits = ((p.traits || '') + ' ' + (p.features || '')).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      if ((traits.includes('lamina sedenta') || traits.includes('thirsting blade')) && lvl >= 5) return 2;
    }
    return 1;
  };

  if (classes.length > 0) {
    classes.forEach(c => {
      const atks = checkClassAttacks(c.className, c.level);
      if (atks > maxAttacks) maxAttacks = atks;
    });
  } else {
    maxAttacks = checkClassAttacks(p.className, p.level);
  }
  return maxAttacks;
}

function getPlayerCalculatedAttacks(p, options = {}) {
  if (!p) return [];
  const prof = getProfBonus(p.level || 1);
  const strMod = Math.floor(((p.str || 10) - 10) / 2);
  const dexMod = Math.floor(((p.dex || 10) - 10) / 2);

  const attacks = [];
  const equipData = typeof EQUIPMENT_DATA !== 'undefined' ? EQUIPMENT_DATA : [];

  // 1. Armas e Itens Equipados no Inventário
  if (p.inventory && Array.isArray(p.inventory)) {
    p.inventory.forEach((it, idx) => {
      if (!it.equipped) return;

      const equipMatch = equipData.find(e => e.name.toLowerCase() === (it.name || '').toLowerCase());
      const dmgRaw = it.damage || (equipMatch ? equipMatch.damage : '');
      const propRaw = it.prop || (equipMatch ? equipMatch.prop : '') || '';

      const isRanged = propRaw.toLowerCase().includes('distância') || propRaw.toLowerCase().includes('munição') || propRaw.toLowerCase().includes('alcance') || it.name.toLowerCase().includes('arco') || it.name.toLowerCase().includes('besta');
      const isFinesse = propRaw.toLowerCase().includes('acuidade') || propRaw.toLowerCase().includes('finesse');

      let attrMod = strMod;
      if (isRanged) {
        attrMod = dexMod;
      } else if (isFinesse) {
        attrMod = Math.max(strMod, dexMod);
      }

      // ISSUE-141: Ignora estritamente armaduras, vestimentas e escudos na tabela de armas/ataques
      const isArmor = it.category === 'Armaduras' || it.category === 'Escudos' ||
        (equipMatch && (equipMatch.category === 'Armaduras' || equipMatch.category === 'Escudos' || equipMatch.category === 'Armor' || equipMatch.category === 'Shield')) ||
        (it.name && (
          it.name.toLowerCase().includes('cota de malha') ||
          it.name.toLowerCase().includes('armadura') ||
          it.name.toLowerCase().includes('placas') ||
          it.name.toLowerCase().includes('gibão') ||
          it.name.toLowerCase().includes('couro') ||
          it.name.toLowerCase().includes('escudo') ||
          it.name.toLowerCase().includes('camisão') ||
          it.name.toLowerCase().includes('peitoral')
        ) && !it.name.toLowerCase().includes('espada') && !it.name.toLowerCase().includes('adaga') && !it.name.toLowerCase().includes('arco'));

      if (isArmor) return;

      const isWeapon = it.category === 'Armas' ||
        (equipMatch && (equipMatch.category === 'Armas' || equipMatch.category === 'Weapons')) ||
        (typeof isWeaponItem === 'function' && isWeaponItem(it.name)) ||
        (/^\d+d\d+/i.test(dmgRaw)) ||
        it.name.toLowerCase().includes('espada') ||
        it.name.toLowerCase().includes('adaga') ||
        it.name.toLowerCase().includes('arco') ||
        it.name.toLowerCase().includes('besta') ||
        it.name.toLowerCase().includes('machado') ||
        it.name.toLowerCase().includes('martelo') ||
        it.name.toLowerCase().includes('lança') ||
        it.name.toLowerCase().includes('clava') ||
        it.name.toLowerCase().includes('maça') ||
        it.name.toLowerCase().includes('mangual') ||
        it.name.toLowerCase().includes('alabarda') ||
        it.name.toLowerCase().includes('foice') ||
        it.name.toLowerCase().includes('bordão') ||
        it.name.toLowerCase().includes('aduela') ||
        it.name.toLowerCase().includes('rapieira') ||
        it.name.toLowerCase().includes('cimitarra') ||
        it.name.toLowerCase().includes('tridente') ||
        it.name.toLowerCase().includes('zarabatana') ||
        it.name.toLowerCase().includes('dardo') ||
        it.name.toLowerCase().includes('funda');

      if (!isWeapon) return;

      const toHit = prof + attrMod;
      const toHitStr = toHit >= 0 ? `+${toHit}` : `${toHit}`;

      let baseDice = '1d6';
      let dmgType = 'Concussão';
      if (dmgRaw && /^\d+d\d+/i.test(dmgRaw)) {
        const match = dmgRaw.match(/(\d+d\d+)(?:\s+([a-zA-Zçãáéíóú]+))?/i);
        if (match) {
          baseDice = match[1];
          if (match[2]) dmgType = match[2];
        } else {
          baseDice = dmgRaw;
        }
      } else if (equipMatch && equipMatch.damage && /^\d+d\d+/i.test(equipMatch.damage)) {
        const match = equipMatch.damage.match(/(\d+d\d+)(?:\s+([a-zA-Zçãáéíóú]+))?/i);
        if (match) {
          baseDice = match[1];
          if (match[2]) dmgType = match[2];
        } else {
          baseDice = equipMatch.damage;
        }
      } else if (it.name.toLowerCase().includes('espada')) {
        baseDice = '1d8';
        dmgType = 'Cortante';
      } else if (it.name.toLowerCase().includes('adaga')) {
        baseDice = '1d4';
        dmgType = 'Perfurante';
      } else if (it.name.toLowerCase().includes('arco')) {
        baseDice = '1d8';
        dmgType = 'Perfurante';
      } else if (it.name.toLowerCase().includes('besta')) {
        baseDice = '1d8';
        dmgType = 'Perfurante';
      }

      const totalDmgMod = attrMod;
      const dmgModStr = totalDmgMod >= 0 ? `+${totalDmgMod}` : `${totalDmgMod}`;
      const finalDmg = `${baseDice}${totalDmgMod !== 0 ? dmgModStr : ''}`;
      const rangeStr = isRanged ? '24/96m' : '1,5m';

      // ISSUE-168: Suporte a dano versátil para armas de 1 mão vs 2 mãos
      const isVersatile = propRaw.toLowerCase().includes('versátil') || propRaw.toLowerCase().includes('versatile') || (equipMatch && (equipMatch.prop || '').toLowerCase().includes('versátil'));
      let vDie = null;
      let vDmg = null;
      let rawVAttackText = null;
      if (isVersatile) {
        const vMatch = (propRaw + ' ' + (equipMatch?.prop || '')).match(/vers[áa]til\s*\(([^)]+)\)/i);
        vDie = vMatch ? vMatch[1].trim() : (baseDice === '1d8' ? '1d10' : (baseDice === '1d6' ? '1d8' : null));
        if (vDie) {
          vDmg = `${vDie}${totalDmgMod !== 0 ? dmgModStr : ''}`;
          rawVAttackText = `${it.name} (${toHitStr}) ${vDmg} ${dmgType}`;
        }
      }

      const ammoInfo = isRanged ? getPlayerAmmunitionForItem(p, it.name, propRaw) : null;

      attacks.push({
        name: it.name,
        type: isRanged ? 'Distância' : 'Corpo a Corpo',
        range: rangeStr,
        toHit: toHitStr,
        toHitVal: toHit,
        hitBonus: toHitStr,
        bonus: toHitStr,
        hit: toHitStr,
        damage: finalDmg,
        dmg: finalDmg,
        damageType: dmgType,
        notes: propRaw || 'Arma equipada',
        isEquipped: true,
        itemIndex: idx,
        isVersatile: Boolean(isVersatile && vDmg),
        versatileDice: vDie,
        versatileDamage: vDmg,
        rawVersatileAttackText: rawVAttackText,
        ammo: ammoInfo,
        rawAttackText: `${it.name} (${toHitStr}) ${finalDmg} ${dmgType}`
      });
    });
  }

  // Helper de normalização para desduplicação robusta (ex: "Espada Longa (Longsword)" == "Espada Longa")
  const normalizeWeaponBase = (str) => {
    return (str || '')
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/\(.*?\)/g, '')
      .replace(/[⚔️🗡️🏹★✨💢🥋🔥🟣⚡🎯]/g, '')
      .trim();
  };

  // 2. Ataques declarados em p.attacks (suporta tanto Array quanto String formatada 5E)
  const rawAttacksList = Array.isArray(p.attacks)
    ? p.attacks
    : (typeof p.attacks === 'string' && p.attacks.trim() ? p.attacks.split(/(?:\||\n|;|\s*,\s*(?![^(]*\)))/).map(s => s.trim()).filter(Boolean) : []);

  if (rawAttacksList.length > 0) {
    p.inventory = Array.isArray(p.inventory) ? p.inventory : [];

    rawAttacksList.forEach(attStr => {
      if (!attStr || typeof attStr !== 'string') return;
      const cleanName = attStr.split('(')[0].replace(/[⚔️🗡️🏹★✨💢🥋🔥🟣⚡🎯]/g, '').trim();
      if (!cleanName) return;

      const normCleanBase = normalizeWeaponBase(cleanName);
      // ISSUE-141: Desduplica armas já calculadas a partir do inventário equipado
      if (attacks.some(a => {
        const aNorm = normalizeWeaponBase(a.name);
        return aNorm === normCleanBase || aNorm.includes(normCleanBase) || normCleanBase.includes(aNorm);
      })) return;

      // Busca no catálogo oficial de equipamentos D&D 5E
      const normClean = cleanName.toLowerCase();
      const equipMatch = equipData.find(e => {
        const eNorm = (e.name || '').toLowerCase().trim();
        const eBase = eNorm.split('(')[0].trim();
        return eNorm === normClean || eBase === normClean || eNorm.includes(normClean) || normClean.includes(eBase);
      });

      // Auto-reconciliação: se a arma não existe no inventário do herói, adiciona-a como equipada
      const existingInInv = p.inventory.find(it => {
        const itNorm = (it.name || '').toLowerCase().trim();
        const itBase = itNorm.split('(')[0].trim();
        return itNorm === normClean || itBase === normClean || itNorm.includes(normClean) || normClean.includes(itBase) ||
          (equipMatch && (itNorm === equipMatch.name.toLowerCase() || itBase === equipMatch.name.toLowerCase().split('(')[0].trim()));
      });
      if (!existingInInv) {
        if (p.inventory.length === 0) {
          p.inventory.push({
            id: 'item_wpn_sync_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
            name: equipMatch ? equipMatch.name : cleanName,
            category: 'Armas',
            qty: 1,
            weight: equipMatch && equipMatch.weight ? equipMatch.weight : 2,
            cost: equipMatch && equipMatch.cost ? equipMatch.cost : '10 PO',
            equipped: true
          });
        }
      } else if (!existingInInv.equipped) {
        existingInInv.equipped = true;
      }

      // Calcula estatísticas oficiais de acerto e dano da arma
      if (typeof calculateWeaponAttackStats === 'function') {
        const stats = calculateWeaponAttackStats(p, equipMatch || cleanName);
        if (stats) {
          const ammoInfo = stats.isRanged ? getPlayerAmmunitionForItem(p, stats.name, stats.properties) : null;
          attacks.push({
            name: stats.name,
            type: stats.isRanged ? 'Distância' : 'Corpo a Corpo',
            range: stats.isRanged ? '24/96m' : '1,5m',
            toHit: stats.hitStr,
            toHitVal: stats.hitBonus,
            hitBonus: stats.hitStr,
            bonus: stats.hitStr,
            hit: stats.hitStr,
            damage: stats.damageFormula,
            dmg: stats.damageFormula,
            damageType: stats.damageType,
            notes: stats.properties || 'Arma equipada',
            isEquipped: true,
            isVersatile: stats.isVersatile,
            versatileDice: stats.versatileDie,
            versatileDamage: stats.versatileDamageFormula,
            rawVersatileAttackText: stats.rawVersatileAttackText,
            ammo: ammoInfo,
            rawAttackText: stats.formattedText
          });
          return;
        }
      }

      const hitMatch = attStr.match(/([+-]\d+)/);
      const dmgMatch = attStr.match(/(\d+d\d+(?:\s*[+-]\s*\d+)?)/i);
      const toHitStr = hitMatch ? hitMatch[1] : (strMod + prof >= 0 ? `+${strMod + prof}` : `${strMod + prof}`);
      const dmgStr = dmgMatch ? dmgMatch[1] : `1d6${strMod >= 0 ? '+' + strMod : strMod}`;

      attacks.push({
        name: cleanName,
        type: 'Ação',
        range: '1,5m',
        toHit: toHitStr,
        toHitVal: parseInt(toHitStr, 10) || 0,
        hitBonus: toHitStr,
        bonus: toHitStr,
        hit: toHitStr,
        damage: dmgStr,
        dmg: dmgStr,
        damageType: 'Dano',
        notes: 'Ataque cadastrado',
        isEquipped: true,
        rawAttackText: attStr
      });
    });
  }

  // 3. Fallback: Se não tem nenhum ataque, adiciona Ataque Desarmado
  if (attacks.length === 0) {
    const unarmHit = prof + strMod;
    const unarmHitStr = unarmHit >= 0 ? `+${unarmHit}` : `${unarmHit}`;
    const unarmDmg = Math.max(1, 1 + strMod);
    attacks.push({
      name: 'Ataque Desarmado',
      type: 'Corpo a Corpo',
      range: '1,5m',
      toHit: unarmHitStr,
      toHitVal: unarmHit,
      hitBonus: unarmHitStr,
      bonus: unarmHitStr,
      hit: unarmHitStr,
      damage: `${unarmDmg}`,
      dmg: `${unarmDmg}`,
      damageType: 'Concussão',
      notes: 'Golpe corporal básico',
      isEquipped: true,
      rawAttackText: `Ataque Desarmado (${unarmHitStr}) ${unarmDmg} concussão`
    });
  }

  // 4. ISSUE-164: Ataques Especiais de Classe, Raça e Truques Ofensivos Conhecidos
  if (options.weaponsOnly !== true && typeof getPlayerSpecialClassAttacks === 'function') {
    const specials = getPlayerSpecialClassAttacks(p);
    specials.forEach(sp => {
      const spNorm = normalizeWeaponBase(sp.name);
      if (!attacks.some(a => {
        const aNorm = normalizeWeaponBase(a.name);
        return aNorm === spNorm || aNorm.includes(spNorm) || spNorm.includes(aNorm);
      })) {
        attacks.push(sp);
      }
    });

    // Se possui Golpe Desarmado (Artes Marciais) do Monge, remove o fallback básico de 1 dano
    if (attacks.some(a => a.name.includes('Artes Marciais'))) {
      const fallbackIdx = attacks.findIndex(a => a.name === 'Ataque Desarmado');
      if (fallbackIdx !== -1) {
        attacks.splice(fallbackIdx, 1);
      }
    }
  }

  return attacks;
}

function togglePlayerItemEquipped(playerId, itemIndex) {
  const p = PLAYERS.find(x => x.id === playerId);
  if (!p || !p.inventory || !p.inventory[itemIndex]) return;

  p.inventory[itemIndex].equipped = !p.inventory[itemIndex].equipped;
  if (typeof calculatePlayerAcFromEquipment === 'function') {
    p.ac = calculatePlayerAcFromEquipment(p);
  }
  if (typeof syncPlayerEquippedWeaponsAndAttacks === 'function') {
    syncPlayerEquippedWeaponsAndAttacks(p);
  }
  if (typeof touchPlayer === 'function') touchPlayer(p);

  const it = p.inventory[itemIndex];
  if (it.equipped) {
    if (typeof playFX === 'function') playFX('equip');
    addLog(`⚔️ <b>${p.name}</b> equipou <b>${it.name}</b>.`);
  } else {
    addLog(`🎒 <b>${p.name}</b> desequipou <b>${it.name}</b>.`);
  }

  if (typeof syncCombatantWithPlayer === 'function') syncCombatantWithPlayer(p);
  renderPlayers();
  if (typeof renderCombat === 'function') renderCombat();
  saveToLocalStorage();
  if (typeof syncLocalChangesToFirebase === 'function') syncLocalChangesToFirebase(true);
  if (typeof broadcastStateSync === 'function') broadcastStateSync();
}

function setPlayerCardRoll20Tab(playerId, tabName) {
  const p = PLAYERS.find(x => x.id === playerId);
  if (!p) return;
  p.activeRoll20Tab = tabName;
  p.activeCardTab = tabName;
  renderPlayers();
  saveToLocalStorage();
}

function applyRoll20QuickDamage(playerId) {
  const input = document.getElementById(`roll20-hp-input-${playerId}`) || document.getElementById(`roll20-hp-in-${playerId}`);
  const val = input ? parseInt(input.value, 10) : 0;
  if (!val || val <= 0) return;
  adjustPlayerHp(playerId, -val);
  if (input) input.value = '1';
}

function applyRoll20QuickHeal(playerId) {
  const input = document.getElementById(`roll20-hp-input-${playerId}`) || document.getElementById(`roll20-hp-in-${playerId}`);
  const val = input ? parseInt(input.value, 10) : 0;
  if (!val || val <= 0) return;
  adjustPlayerHp(playerId, val);
  if (input) input.value = '1';
}

function sharePlayerCalculatedAttackToFeed(playerId, atkIndex) {
  const p = PLAYERS.find(x => x.id === playerId);
  if (!p) return;
  const attacks = getPlayerCalculatedAttacks(p);
  const atk = attacks[atkIndex];
  if (!atk) return;

  const msg = atk.isDamageBonusOnly
    ? `⚡ <b>${p.name}</b> aciona: <b>${atk.name}</b> | Dano Extra: <b>${atk.damage}</b> (${atk.damageType})${atk.notes ? ' • ' + atk.notes : ''}`
    : `⚔️ <b>${p.name}</b> compartilha ataque: <b>${atk.name}</b> | Acerto: <b>${atk.toHit}</b> | Dano: <b>${atk.damage}</b> (${atk.damageType}) | Alcance: ${atk.range}${atk.notes ? ' • ' + atk.notes : ''}`;
  addLog(msg);
  addPlayerActionLog(p.id, atk.isDamageBonusOnly ? '⚡' : '⚔️', `Compartilhou ${atk.name} (${atk.damage})`, 'attack');
  if (typeof playFX === 'function') playFX('dice');
  if (typeof syncLocalChangesToFirebase === 'function') syncLocalChangesToFirebase(true);
}

function sharePlayerSpellToFeed(playerId, spellName) {
  const p = PLAYERS.find(x => x.id === playerId);
  if (!p) return;
  const sp = typeof SPELLS_DATA !== 'undefined' ? SPELLS_DATA.find(s => s.name.toLowerCase() === (spellName || '').toLowerCase()) : null;
  const desc = sp ? (sp.desc || sp.description || '') : 'Sem descrição detalhada.';
  const lvl = sp ? (sp.level === 0 ? 'Truque' : `${sp.level}º Círculo`) : 'Magia';
  const range = sp ? (sp.range || '18m') : '';
  const time = sp ? (sp.time || '1 Ação') : '';
  const dur = sp ? (sp.duration || 'Instantâneo') : '';
  const msg = `✨ <b>${p.name}</b> conjura / compartilha: <b>${spellName}</b> (${lvl}) | Alcance: ${range}${time ? ' • Tempo: ' + time : ''}${dur ? ' • Dur: ' + dur : ''} <br><div style="margin-top:3px; color:#cbd5e1; font-size:11px; line-height:1.4;">${desc}</div>`;
  addLog(msg);
  addPlayerActionLog(p.id, '✨', `Compartilhou magia: ${spellName}`, 'spell');
  if (typeof playFX === 'function') playFX('spell');
  if (typeof showToast === 'function') showToast(`Magia "${spellName}" compartilhada no chat da mesa!`, 'info');
  if (typeof syncLocalChangesToFirebase === 'function') syncLocalChangesToFirebase(true);
}

function sharePlayerItemToFeed(playerId, itemIndex) {
  const p = PLAYERS.find(x => x.id === playerId);
  if (!p || !p.inventory || !p.inventory[itemIndex]) return;
  const it = p.inventory[itemIndex];
  let eq = null;
  if (typeof EQUIPMENT_DATA !== 'undefined' && Array.isArray(EQUIPMENT_DATA)) {
    const clean = (it.name || '').toLowerCase().trim();
    eq = EQUIPMENT_DATA.find(e => e.name.toLowerCase() === clean || clean.includes(e.name.toLowerCase()) || e.name.toLowerCase().includes(clean));
  }
  const desc = it.desc || it.prop || (eq ? eq.prop : '') || 'Item padrão de aventura.';
  const cat = it.category || (eq ? eq.category : 'Item');
  const damageOrAc = (eq ? (eq.damage || (eq.ac ? `CA ${eq.ac}` : '')) : (it.damage || (it.ac ? `CA ${it.ac}` : ''))) || '';
  const weightStr = typeof formatCleanItemWeight === 'function' ? formatCleanItemWeight(it.weight) : (it.weight ? `${it.weight} kg` : '');
  const msg = `🎒 <b>${p.name}</b> exibe o item: <b>${it.name}</b> (${cat}${damageOrAc ? ' • ' + damageOrAc : ''}) • Qtd: ${it.qty || 1} ${weightStr ? '• ' + weightStr : ''}<br><div style="margin-top:3px; color:#cbd5e1; font-size:11px; line-height:1.4;">${desc}</div>`;
  addLog(msg);
  addPlayerActionLog(p.id, '🎒', `Exibiu item: ${it.name}`, 'inventory');
  if (typeof showToast === 'function') showToast(`Item "${it.name}" compartilhado no chat da mesa!`, 'info');
  if (typeof syncLocalChangesToFirebase === 'function') syncLocalChangesToFirebase(true);
}

function sharePlayerTraitToFeed(playerId, traitName, traitDesc) {
  const p = PLAYERS.find(x => x.id === playerId);
  if (!p) return;
  const msg = `📜 <b>${p.name}</b> utiliza/apresenta: <b>${traitName}</b><br><small style="color:#94a3b8;">${(traitDesc || '').substring(0, 160)}...</small>`;
  addLog(msg);
  addPlayerActionLog(p.id, '📜', `Habilidade: ${traitName}`, 'feature');
  if (typeof playFX === 'function') playFX('crit');
  if (typeof syncLocalChangesToFirebase === 'function') syncLocalChangesToFirebase(true);
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

      if (typeof touchPlayer === 'function') touchPlayer(p);
      renderPlayers();
      saveToLocalStorage();
      if (typeof syncLocalChangesToFirebase === 'function') syncLocalChangesToFirebase(true);
      if (typeof broadcastStateSync === 'function') broadcastStateSync();
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
    if (typeof touchPlayer === 'function') touchPlayer(p);
    saveToLocalStorage();
    if (typeof syncLocalChangesToFirebase === 'function') syncLocalChangesToFirebase();
    if (typeof broadcastStateSync === 'function') broadcastStateSync();
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


function populateCampaignFilterOptions() {
  const sel = document.getElementById('filter-player-campaign');
  if (!sel) return;

  const savedVal = typeof localStorage !== 'undefined' ? localStorage.getItem('dnd5e_player_filter_campaign') : null;
  const currentVal = sel.value || savedVal || 'all';
  const camps = (typeof CAMPAIGNS_STATE !== 'undefined' && Array.isArray(CAMPAIGNS_STATE.campaigns)) ? CAMPAIGNS_STATE.campaigns : [];
  const players = (typeof PLAYERS !== 'undefined' && Array.isArray(PLAYERS)) ? PLAYERS : [];

  let optionsHtml = `<option value="all">🏰 Todas as Campanhas (${players.length})</option>`;

  camps.forEach(c => {
    const count = players.filter(p => (Array.isArray(c.playerIds) && c.playerIds.some(pid => String(pid) === String(p.id))) || p.campaignId === c.id).length;
    optionsHtml += `<option value="${c.id}">🏰 ${c.name || 'Campanha'} (${count})</option>`;
  });

  const unassignedCount = players.filter(p => {
    const inAny = camps.some(c => (Array.isArray(c.playerIds) && c.playerIds.some(pid => String(pid) === String(p.id))) || p.campaignId === c.id);
    return !inAny;
  }).length;
  optionsHtml += `<option value="none">👤 Sem Campanha (${unassignedCount})</option>`;

  if (sel.innerHTML !== optionsHtml) {
    sel.innerHTML = optionsHtml;
    const optList = (sel && sel.options) ? Array.from(sel.options) : [];
    if (optList.length > 0 && optList.some(o => o.value === currentVal)) {
      sel.value = currentVal;
    } else {
      sel.value = currentVal || 'all';
    }
  }
}

function onPlayerCampaignFilterChange() {
  const sel = document.getElementById('filter-player-campaign');
  if (sel && typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem('dnd5e_player_filter_campaign', sel.value);
    } catch (e) { }
  }
  renderPlayers();
}

function filterPlayersByCampaign(campaignId) {
  const val = campaignId || 'all';
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem('dnd5e_player_filter_campaign', val);
    } catch (e) { }
  }
  const sel = typeof document !== 'undefined' ? document.getElementById('filter-player-campaign') : null;
  if (sel) {
    sel.value = val;
  }
  if (typeof renderPlayers === 'function') {
    renderPlayers();
  }
}

function setCampaignFilter(campaignId) {
  filterPlayersByCampaign(campaignId);
}

function clearCampaignFilter() {
  filterPlayersByCampaign('all');
}

function getCurrentlySelectedCampaign() {
  const sel = document.getElementById('filter-player-campaign');
  const val = sel ? sel.value : ((typeof localStorage !== 'undefined' ? localStorage.getItem('dnd5e_player_filter_campaign') : 'all') || 'all');
  if (!val || val === 'all' || val === 'none') return null;
  const camps = (typeof CAMPAIGNS_STATE !== 'undefined' && Array.isArray(CAMPAIGNS_STATE.campaigns)) ? CAMPAIGNS_STATE.campaigns : [];
  return camps.find(c => c.id === val) || null;
}

function getCurrentlyFilteredPlayers() {
  const rawQ = document.getElementById('filter-player-q')?.value || '';
  const q = typeof normalizeStr === 'function' ? normalizeStr(rawQ) : rawQ.toLowerCase().trim();
  const sel = document.getElementById('filter-player-campaign');
  const campFilter = sel ? sel.value : ((typeof localStorage !== 'undefined' ? localStorage.getItem('dnd5e_player_filter_campaign') : 'all') || 'all');
  const camps = (typeof CAMPAIGNS_STATE !== 'undefined' && Array.isArray(CAMPAIGNS_STATE.campaigns)) ? CAMPAIGNS_STATE.campaigns : [];
  const targetCamp = camps.find(c => c.id === campFilter);

  const players = (typeof PLAYERS !== 'undefined' && Array.isArray(PLAYERS)) ? PLAYERS : [];

  return players.filter(p => {
    if (typeof activePortalPlayerId !== 'undefined' && activePortalPlayerId && p.id !== activePortalPlayerId) return false;

    // Filtro por Campanha
    if (campFilter !== 'all') {
      if (campFilter === 'none') {
        const inAny = camps.some(c => (Array.isArray(c.playerIds) && c.playerIds.some(pid => String(pid) === String(p.id))) || p.campaignId === c.id);
        if (inAny) return false;
      } else if (targetCamp) {
        const isMember = (Array.isArray(targetCamp.playerIds) && targetCamp.playerIds.some(pid => String(pid) === String(p.id))) || p.campaignId === targetCamp.id;
        if (!isMember) return false;
      }
    }

    // Filtro por Busca Textual
    if (!q) return true;
    const pName = typeof normalizeStr === 'function' ? normalizeStr(p.name) : (p.name || '').toLowerCase();
    const pStudent = typeof normalizeStr === 'function' ? normalizeStr(p.student) : (p.student || '').toLowerCase();
    const pClass = typeof normalizeStr === 'function' ? normalizeStr(p.className) : (p.className || '').toLowerCase();
    const pRace = typeof normalizeStr === 'function' ? normalizeStr(p.race) : (p.race || '').toLowerCase();
    return pName.includes(q) || pStudent.includes(q) || pClass.includes(q) || pRace.includes(q);
  });
}

// ISSUE-157: Estados dinâmicos de navegação, traços e magias
let sheetTraitCategoryFilters = {};
let sheetTraitSearchQueries = {};
let sheetTraitExpandedAll = {};
let sheetTraitOpenItems = new Set();
let sheetSpellCircleFilters = {};
let sheetSpellSearchQueries = {};

function renderHeroQuickNav(filteredPlayers) {
  const container = document.getElementById('hero-quick-nav-container');
  if (!container) return;
  if (!filteredPlayers || filteredPlayers.length === 0) {
    container.style.display = 'none';
    container.innerHTML = '';
    return;
  }

  container.style.display = 'flex';
  container.innerHTML = filteredPlayers.map(p => {
    const maxHp = p.maxHp || 1;
    const hp = p.hp != null ? p.hp : maxHp;
    const hpPct = maxHp > 0 ? Math.max(0, Math.min(100, Math.round((hp / maxHp) * 100))) : 0;
    const isCritical = hpPct <= 25;
    const isWounded = hpPct < 100;
    const hpStatusClass = isCritical ? 'hp-critical' : (isWounded ? 'hp-warning' : 'hp-healthy');
    const avatarHtml = p.avatar
      ? `<img src="${p.avatar}" alt="${escapeAttr(p.name)}" class="hero-quick-avatar" onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\\'hero-quick-avatar\\'>🧙</div>';">`
      : `<div class="hero-quick-avatar">🧙</div>`;

    return `
      <div class="hero-quick-chip" onclick="jumpToPlayerCard('${p.id}')" title="Ir direto para a ficha de ${escapeAttr(p.name)} (${p.className || 'Herói'} Nv ${p.level})">
        ${avatarHtml}
        <div class="hero-quick-details">
          <div class="hero-quick-name">${p.name}</div>
          <div class="hero-quick-meta">
            <span>Nv ${p.level} ${p.className || ''}</span>
            <span class="hero-quick-hp-pill ${hpStatusClass}">${hp}/${maxHp} PV</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function jumpToPlayerCard(playerId) {
  const card = document.getElementById(`player-card-${playerId}`);
  if (!card) return;
  if (typeof card.scrollIntoView === 'function') {
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  if (card.classList) {
    card.classList.remove('hero-card-highlight');
    try { void card.offsetWidth; } catch (e) { }
    card.classList.add('hero-card-highlight');
    setTimeout(() => {
      try { card.classList.remove('hero-card-highlight'); } catch (e) { }
    }, 2200);
  }
}

function setPlayerTraitCategoryFilter(playerId, category) {
  sheetTraitCategoryFilters[playerId] = category;
  renderPlayers();
}

function handlePlayerTraitSearch(playerId, query) {
  sheetTraitSearchQueries[playerId] = query;
  renderPlayers();
  setTimeout(() => {
    const inp = document.getElementById(`inp-trait-search-${playerId}`);
    if (inp) {
      inp.focus();
      inp.selectionStart = inp.selectionEnd = inp.value.length;
    }
  }, 10);
}

function togglePlayerTraitsExpandAll(playerId) {
  sheetTraitExpandedAll[playerId] = !sheetTraitExpandedAll[playerId];
  if (!sheetTraitExpandedAll[playerId]) {
    for (const key of Array.from(sheetTraitOpenItems)) {
      if (key.startsWith(`${playerId}_`)) {
        sheetTraitOpenItems.delete(key);
      }
    }
  }
  renderPlayers();
}

function togglePlayerFeatureAccordion(featKey, event) {
  if (event) event.stopPropagation();
  if (sheetTraitOpenItems.has(featKey)) {
    sheetTraitOpenItems.delete(featKey);
  } else {
    sheetTraitOpenItems.add(featKey);
  }
  renderPlayers();
}

function setPlayerSpellCircleFilter(playerId, circle) {
  sheetSpellCircleFilters[playerId] = circle;
  renderPlayers();
}

function handlePlayerSpellSearch(playerId, query) {
  sheetSpellSearchQueries[playerId] = query;
  renderPlayers();
  setTimeout(() => {
    const inp = document.getElementById(`inp-spell-search-${playerId}`);
    if (inp) {
      inp.focus();
      inp.selectionStart = inp.selectionEnd = inp.value.length;
    }
  }, 10);
}

function togglePlayerCircleSlot(playerId, circleIdx, slotIdx, event) {
  if (event) event.stopPropagation();
  if (typeof togglePlayerSlot === 'function') {
    togglePlayerSlot(playerId, circleIdx, slotIdx);
  }
}

function renderPlayers() {
  const grid = document.getElementById('grid-players');
  const badge = document.getElementById('cnt-players');
  const sort = document.getElementById('filter-player-sort')?.value || 'name';

  if (typeof populateCampaignFilterOptions === 'function') {
    populateCampaignFilterOptions();
  }

  let filtered = typeof getCurrentlyFilteredPlayers === 'function' ? getCurrentlyFilteredPlayers() : (typeof PLAYERS !== 'undefined' ? PLAYERS : []);
  const selectedCamp = typeof getCurrentlySelectedCampaign === 'function' ? getCurrentlySelectedCampaign() : null;

  // Atualiza badge de status da campanha na barra de ferramentas
  const statusEl = document.getElementById('player-campaign-filter-status');
  if (statusEl) {
    if (selectedCamp) {
      statusEl.style.display = 'inline-flex';
      statusEl.innerHTML = `🏰 Mesa: <b>${selectedCamp.name}</b> (${filtered.length} heróis)`;
    } else {
      const sel = document.getElementById('filter-player-campaign');
      if (sel && sel.value === 'none') {
        statusEl.style.display = 'inline-flex';
        statusEl.innerHTML = `👤 Sem Campanha (${filtered.length} heróis)`;
      } else {
        statusEl.style.display = 'none';
      }
    }
  }

  // Atualiza botões de ação em lote conforme o escopo da campanha
  const btnCombat = document.getElementById('btn-batch-combat');
  const btnRewards = document.getElementById('btn-batch-rewards');
  const btnShortRest = document.getElementById('btn-batch-short-rest');
  const btnLongRest = document.getElementById('btn-batch-long-rest');

  if (selectedCamp) {
    if (btnCombat) {
      btnCombat.innerText = `⚔️ Mesa no Combate (${filtered.length})`;
      btnCombat.title = `Adicionar os ${filtered.length} heróis da mesa "${selectedCamp.name}" ao combate ativo`;
      btnCombat.classList.add('btn-batch-camp-active');
    }
    if (btnRewards) {
      btnRewards.innerText = `🎁 Recompensas (${selectedCamp.name.substring(0, 15)})`;
      btnRewards.title = `Distribuir XP e Moedas para a mesa "${selectedCamp.name}"`;
      btnRewards.classList.add('btn-batch-camp-active');
    }
    if (btnShortRest) {
      btnShortRest.innerText = `☕ Curto (${filtered.length})`;
      btnShortRest.title = `Descanso Curto (1h) para os ${filtered.length} heróis de "${selectedCamp.name}"`;
      btnShortRest.classList.add('btn-batch-camp-active');
    }
    if (btnLongRest) {
      btnLongRest.innerText = `🌙 Longo (${filtered.length})`;
      btnLongRest.title = `Descanso Longo (8h) para os ${filtered.length} heróis de "${selectedCamp.name}"`;
      btnLongRest.classList.add('btn-batch-camp-active');
    }
  } else {
    if (btnCombat) {
      btnCombat.innerText = '⚔️ Todos no Combate';
      btnCombat.title = 'Adicionar todas as fichas de alunos ao combate ativo de uma vez';
      btnCombat.classList.remove('btn-batch-camp-active');
    }
    if (btnRewards) {
      btnRewards.innerText = '🎁 Recompensas';
      btnRewards.title = 'Distribuir Experiência e Moedas em lote para o grupo';
      btnRewards.classList.remove('btn-batch-camp-active');
    }
    if (btnShortRest) {
      btnShortRest.innerText = '☕ Curto (Todos)';
      btnShortRest.title = 'Descanso Curto para todo o grupo (1h)';
      btnShortRest.classList.remove('btn-batch-camp-active');
    }
    if (btnLongRest) {
      btnLongRest.innerText = '🌙 Longo (Todos)';
      btnLongRest.title = 'Descanso Longo para todo o grupo (8h - restaura PV, magias e dados)';
      btnLongRest.classList.remove('btn-batch-camp-active');
    }
  }

  if (sort === 'name') filtered.sort((a, b) => a.name.localeCompare(b.name));
  else if (sort === 'student') filtered.sort((a, b) => a.student.localeCompare(b.student));
  else if (sort === 'level') filtered.sort((a, b) => b.level - a.level);
  else if (sort === 'hp') filtered.sort((a, b) => (b.hp / b.maxHp) - (a.hp / a.maxHp));

  if (badge) badge.innerText = filtered.length;
  if (typeof renderHeroQuickNav === 'function') {
    renderHeroQuickNav(filtered);
  }
  if (!grid) return;

  filtered.forEach(p => {
    if (typeof syncPlayerEquippedWeaponsAndAttacks === 'function') {
      syncPlayerEquippedWeaponsAndAttacks(p);
    }
  });

  grid.innerHTML = filtered.map(p => {
    const prof = getProfBonus(p.level);
    const wisMod = Math.floor((p.wis - 10) / 2);
    const dexMod = Math.floor((p.dex - 10) / 2);
    const isWisProf = (p.skillProficiencies || []).includes('percepcao') || (p.skillProficiencies || []).includes('perception');
    const isWisExpert = (p.skillExpertises || []).includes('percepcao') || (p.skillExpertises || []).includes('perception');
    const hasObservant = (typeof hasPlayerFeat === 'function') && (hasPlayerFeat(p, 'observador') || hasPlayerFeat(p, 'observant'));
    const passPerc = 10 + wisMod + (isWisExpert ? (prof * 2) : (isWisProf ? prof : 0)) + (hasObservant ? 5 : 0);
    const activeTab = p.activeCardTab || 'skills';

    // Normaliza slots e dados (ISSUE-136: Auto-cálculo de slots para conjuradores)
    if (typeof ensurePlayerSpellSlots === 'function') {
      ensurePlayerSpellSlots(p);
    } else {
      p.slots = p.slots || [0, 0, 0, 0, 0, 0, 0, 0, 0];
      p.slotsUsed = p.slotsUsed || [0, 0, 0, 0, 0, 0, 0, 0, 0];
    }
    p.deathSaves = p.deathSaves || { success: 0, fail: 0 };
    p.tempHp = p.tempHp || 0;
    p.gold = p.gold || 0;
    p.coins = p.coins || { cp: 0, sp: 0, ep: 0, gp: p.gold || 0, pp: 0 };
    p.inventory = p.inventory || [];
    p.conditions = p.conditions || [];
    p.avatar = p.avatar || '👤';
    p.skillProficiencies = p.skillProficiencies || [];
    p.skillExpertises = p.skillExpertises || [];
    p.saveProficiencies = p.saveProficiencies || [];
    p.actionLogs = p.actionLogs || [];
    p.playerNotes = p.playerNotes !== undefined ? p.playerNotes : '';

    const carry = getPlayerCarryCapacity(p);
    const purse = getPlayerCoinPurse(p);
    const hdPool = typeof getPlayerHitDicePool === 'function' ? getPlayerHitDicePool(p) : { dieType: 'd8', total: p.level || 1, available: p.level || 1, spent: 0 };
    const restStatus = getPlayerRestStatus(p);
    const classBadgeHtml = getPlayerClassBadge(p);

    // Contagem de elementos para Badges numéricas de Abas Roll20 e Filtros (ISSUE-157)
    const allKnownSpells = typeof getPlayerKnownSpells === 'function' ? getPlayerKnownSpells(p) : ((p.preparedSpells || []));
    const totalSpellsCount = allKnownSpells.length;
    const totalInvCount = (p.inventory || []).length;
    const heroFeatsList = typeof getPlayerFeats === 'function' ? getPlayerFeats(p) : [];
    const heroClassesList = typeof getPlayerClassesList === 'function' ? getPlayerClassesList(p) : [];
    let heroClassFeatsCount = 0;
    heroClassesList.forEach(cls => {
      if (typeof getUnlockedClassFeatures === 'function') {
        heroClassFeatsCount += getUnlockedClassFeatures(cls.className, cls.level, cls.subclassIdx || 0).length;
      }
    });
    const speciesDataObj = typeof findSpeciesData === 'function' ? findSpeciesData(p.race) : null;
    const heroRacialTraitsCount = (speciesDataObj && Array.isArray(speciesDataObj.traits)) ? speciesDataObj.traits.length : 0;
    const totalTraitsCount = heroClassFeatsCount + heroRacialTraitsCount + heroFeatsList.length + (p.features ? 1 : 0);

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

    // Slots de magia coloridos por círculo (M-L6)
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
          bubbles += `<button type="button" class="slot-bubble spell-gem-pip lvl-${lvlIdx + 1} ${isUsed ? 'used spent' : ''}" title="${isUsed ? 'Gasto (clique para restaurar)' : 'Disponível (clique para gastar)'}" onclick="togglePlayerSlot('${p.id}', ${lvlIdx}, ${i})"></button>`;
        }
        return `
              <div class="slot-row">
                <span class="slot-label">${lvlIdx + 1}º Círculo (${maxSlots - used}/${maxSlots})</span>
                <div class="slot-bubbles spell-slot-gems">${bubbles}</div>
              </div>
            `;
      }).join('')}
        </div>
      `;
    }

    // M3 & M-A1: Feature charges UI
    let featureChargesHtml = '';
    if (p.featureCharges && p.featureCharges.length > 0) {
      featureChargesHtml = `
        <div class="player-charges-container" style="background: rgba(0,0,0,0.25); border: 1px solid var(--border-color); border-radius: 8px; padding: 8px;">
          <div style="font-size: 10px; font-weight: 800; color: var(--primary-light); text-transform: uppercase; margin-bottom: 6px; display: flex; justify-content: space-between; align-items: center;">
            <span>⚡ Habilidades & Cargas de Classe:</span>
            <div style="display: flex; gap: 4px;">
              <button class="btn-micro" onclick="playerShortRest('${p.id}')" title="Descanso Curto (1h)">🏕️ Curto</button>
              <button class="btn-micro" onclick="playerLongRest('${p.id}')" title="Descanso Longo (8h)">🌙 Longo</button>
            </div>
          </div>
          <div style="display: flex; flex-direction: column; gap: 4px;">
            ${p.featureCharges.map(f => {
        const remaining = f.max - f.used;
        if (f.max > 10) {
          return `
                  <div class="charge-row-counter" style="display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.3); padding: 4px 6px; border-radius: 4px; font-size: 11px;">
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
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <button class="btn-action" style="padding: 5px 8px; font-size: 11px; white-space: nowrap;" onclick="rollPlayerDeathSave('${p.id}')">🎲 Rolar Salvação</button>
            <button class="btn-secondary" style="padding: 3px 6px; font-size: 10px; border-color: #ef4444; color: #f87171; white-space: nowrap;" onclick="openDeathSavesModal('${p.id}')" title="Abrir Painel Completo de Testes da Morte (Físico / Digital)">📋 Painel / Mesa</button>
          </div>
        </div>
      `;
    }

    // Ataques formatados com Economia de Ação (D&D Beyond)
    const rawAttacks = p.attacks || '';
    const attacksArray = (rawAttacks.includes('|') ? rawAttacks.split('|') : rawAttacks.split(/(?<=\)),/g))
      .map(a => a.trim())
      .filter(a => a);

    const actionFilter = p.actionEconomyFilter || 'all';
    const filteredAttacks = attacksArray.filter(att => {
      if (actionFilter === 'all') return true;
      return getAttackActionType(att) === actionFilter;
    });

    const attacksHtml = filteredAttacks.map(att => {
      const atkAct = getAttackActionType(att);
      const atkBadge = atkAct === 'bonus' ? '<span class="action-economy-tag bonus">Bônus</span>' : (atkAct === 'reaction' ? '<span class="action-economy-tag reaction">Reação</span>' : '<span class="action-economy-tag action">Ação</span>');
      return `
        <div class="attack-item-row">
          <span class="attack-info">⚔️ ${att} ${atkBadge}</span>
          <div style="display: flex; gap: 4px; align-items: center;">
            <button class="btn-action" style="padding: 4px 8px; font-size: 11px; white-space: nowrap;" onclick="rollPlayerAttack('${p.id}', '${att.replace(/'/g, "\\'")}')" title="Rolar Ataque Completo">🎲 Ataque</button>
            <button class="btn-secondary btn-card-damage-roll" style="margin-top: 0; padding: 4px 8px; font-size: 10.5px; white-space: nowrap;" onclick="rollWeaponDamageOnly('${p.id}', '${att.replace(/'/g, "\\'")}')" title="Rolar Apenas Dano">💥 Dano</button>
          </div>
        </div>
      `;
    }).join('');

    const isCritical = p.hp > 0 && p.maxHp > 0 && (p.hp / p.maxHp) <= 0.25;
    const activeRoll20Tab = p.activeRoll20Tab || 'combat';
    const calculatedAttacks = getPlayerCalculatedAttacks(p);

    const intMod = Math.floor(((p.int || 10) - 10) / 2);
    const chaMod = Math.floor(((p.cha || 10) - 10) / 2);
    const isInvestProf = (p.skillProficiencies || []).includes('investigacao') || (p.skillProficiencies || []).includes('investigation');
    const isInvestExp = (p.skillExpertises || []).includes('investigacao') || (p.skillExpertises || []).includes('investigation');
    const passInv = 10 + intMod + (isInvestExp ? (prof * 2) : (isInvestProf ? prof : 0)) + (hasObservant ? 5 : 0);

    const isInsightProf = (p.skillProficiencies || []).includes('intuicao') || (p.skillProficiencies || []).includes('insight');
    const isInsightExp = (p.skillExpertises || []).includes('intuicao') || (p.skillExpertises || []).includes('insight');
    const passIns = 10 + wisMod + (isInsightExp ? (prof * 2) : (isInsightProf ? prof : 0));

    const acInfo = getPlayerAcCalculationInfo(p);
    const displayAc = p.ac || acInfo.ac;

    return `
      <div id="player-card-${p.id}" data-player-id="${p.id}" class="player-card roll20-sheet ${activePortalPlayerId && p.id === activePortalPlayerId ? 'portal-view' : ''} ${p.compact ? 'is-compact' : ''} ${isCritical ? 'hp-critical' : ''} cls-${(classBadgeHtml.match(/class-(\w+)/) || ['', ''])[1]}">
        
        <!-- 1. TOPO ROLL20: HERO CARD + HIT POINTS CARD -->
        <div class="roll20-top-grid">
          <!-- CARD DE PERFIL DO HERÓI -->
          <div class="roll20-hero-card">
            <div class="roll20-avatar-box" onclick="openAvatarModal('${p.id}')" title="Alterar Avatar / Foto">
              <div class="roll20-avatar-img-wrap">
                ${avatarDisplay}
              </div>
              <div class="roll20-level-shield" title="Nível ${p.level}">Nv ${p.level}</div>
            </div>

            <div class="roll20-hero-info">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">
                <div class="roll20-hero-name" title="${p.name}">${p.name}</div>
                <div class="player-toolbar" onclick="event.stopPropagation();">
                  <div class="player-actions-group" onclick="event.stopPropagation();">
                    <button type="button" class="btn-micro roll20-btn-tool" onclick="openPlayerModal('${p.id}')" title="Editar Ficha Completa">✏️</button>
                    <button type="button" class="btn-micro roll20-btn-tool" onclick="printPlayerSheet('${p.id}')" title="Baixar Ficha / Salvar em PDF (A4 Oficial D&D 5E)">📥</button>
                    <button type="button" class="btn-micro roll20-btn-tool" onclick="openSharePlayerModal('${p.id}')" title="Compartilhar Link/QR Code">📱</button>
                    <button type="button" class="btn-micro roll20-btn-tool" onclick="togglePlayerCardCompact('${p.id}')" title="Alternar Modo Compacto">📏</button>
                    <span class="roll20-tool-divider"></span>
                    <button type="button" class="btn-micro roll20-btn-tool roll20-btn-tool-del" onclick="deletePlayer('${p.id}')" title="Excluir Personagem">🗑️</button>
                  </div>
                </div>
              </div>

              <div class="roll20-hero-subtitle">
                <b>${p.className}</b> • <span>${p.race}</span> • <span style="color: #64748b;">${p.student || 'Aluno'}</span>
              </div>

              <div style="font-size: 11px; color: #94a3b8; display: flex; gap: 10px; margin-top: 2px;">
                <span>Exp: <b>${p.xp || 0}</b></span>
                <span>Bônus Profic: <b style="color: var(--accent-gold);">+${prof}</b></span>
              </div>

              <div class="roll20-hero-actions-row">
                <button type="button" class="btn-insp ${p.inspiration ? 'active' : ''}" onclick="togglePlayerInspiration('${p.id}')" title="Inspiração Heroica (D&D 5E)">
                  ⭐ Inspiração ${p.inspiration ? '✓' : ''}
                </button>
                <button type="button" class="roll20-btn-init" onclick="rollPlayerInit('${p.id}')" title="Rolar Teste de Iniciativa (d20 ${typeof getPlayerInitiativeBonus === 'function' ? (getPlayerInitiativeBonus(p) >= 0 ? '+' + getPlayerInitiativeBonus(p) : getPlayerInitiativeBonus(p)) : (dexMod >= 0 ? '+' + dexMod : dexMod)})">
                  <span>🎲</span> INICIATIVA ${typeof getPlayerInitiativeBonus === 'function' ? (getPlayerInitiativeBonus(p) >= 0 ? '+' + getPlayerInitiativeBonus(p) : getPlayerInitiativeBonus(p)) : (dexMod >= 0 ? '+' + dexMod : dexMod)}
                </button>
                <button type="button" class="btn-secondary" style="font-size: 10.5px; padding: 4px 8px;" onclick="openLevelUpWizard('${p.id}')" title="Subir de Nível e Multiclasse">
                  🔼 Nv
                </button>
                <button type="button" class="btn-secondary" style="font-size: 10.5px; padding: 4px 8px;" onclick="openPlayerClassesModal('${p.id}')" title="Gerenciar Classes">
                  🔀 Classes
                </button>
                <button type="button" class="btn-secondary" style="font-size: 10.5px; padding: 4px 8px; color: #facc15;" onclick="openMasterGrantFeatModal('${p.id}')" title="Conceder ou Gerenciar Talentos">
                  ⭐ Talentos
                </button>
              </div>
            </div>
          </div>

          <!-- CARD DE PONTOS DE VIDA (HIT POINTS ROLL20) -->
          <div class="roll20-hp-card">
            <div class="roll20-hp-header">
              <span>HIT POINTS</span>
              <div style="display: flex; gap: 6px;">
                <button type="button" class="btn-micro roll20-btn-rest-short" onclick="playerShortRest('${p.id}')" title="Descanso Curto (1h)">🏕️ Curto</button>
                <button type="button" class="btn-micro roll20-btn-rest-long" onclick="playerLongRest('${p.id}')" title="Descanso Longo (8h)">🌙 Longo</button>
              </div>
            </div>

            <div class="roll20-hp-main-row">
              <div class="roll20-hp-numbers">
                <span class="roll20-hp-current" style="color: ${hpColor};">${p.hp}</span>
                <span class="roll20-hp-slash">/</span>
                <span class="roll20-hp-max">${p.maxHp}</span>
                ${p.tempHp > 0 ? `<span class="roll20-hp-temp">+${p.tempHp} Temp</span>` : ''}
              </div>

              <!-- STEPPER DE DANO / CURA INSTANTÂNEO -->
              <div class="roll20-hp-stepper-box">
                <button type="button" class="roll20-btn-hp-dmg" onclick="applyRoll20QuickDamage('${p.id}')" title="Aplicar Dano">💔 Dano</button>
                <input type="number" id="roll20-hp-input-${p.id}" class="roll20-hp-input" value="1" min="1" max="999" onfocus="this.select()" onclick="this.select()" onkeydown="if(event.key==='Enter'){event.preventDefault();applyRoll20QuickDamage('${p.id}');}">
                <button type="button" class="roll20-btn-hp-heal" onclick="applyRoll20QuickHeal('${p.id}')" title="Aplicar Cura">💚 Cura</button>
              </div>
            </div>

            <!-- BARRA DE VIDA VISUAL -->
            <div class="hp-bar-bg" style="height: 7px; margin: 2px 0;">
              <div class="hp-bar-fill" style="width: ${hpPct}%; background-color: ${hpColor};"></div>
            </div>

            <!-- LINHA DE DADOS DE VIDA -->
            <div class="roll20-hitdice-row">
              <span>Hit Dice: <b>${hdPool.dieType}</b> (${hdPool.available}/${hdPool.total} disp.)</span>
              <button type="button" class="btn-micro roll20-btn-hd-heal" onclick="openShortRestModal('${p.id}')" title="Gastar Dado de Vida para Curar">🎲 Curar c/ Dado</button>
            </div>
          </div>
        </div>

        <!-- 2. BARRA DE ATRIBUTOS & SALVAGUARDAS UNIFICADOS (ABILITIES ROLL20) -->
        <div class="roll20-abilities-bar">
          ${[
        { key: 'str', label: 'FOR', name: 'Força' },
        { key: 'dex', label: 'DES', name: 'Destreza' },
        { key: 'con', label: 'CON', name: 'Constituição' },
        { key: 'int', label: 'INT', name: 'Inteligência' },
        { key: 'wis', label: 'SAB', name: 'Sabedoria' },
        { key: 'cha', label: 'CAR', name: 'Carisma' }
      ].map(attr => {
        const raw = p[attr.key] || 10;
        const baseMod = Math.floor((raw - 10) / 2);
        const isSaveProf = (p.saveProficiencies || []).includes(attr.key);
        const saveMod = baseMod + (isSaveProf ? prof : 0);
        const modSign = baseMod >= 0 ? `+${baseMod}` : `${baseMod}`;
        const saveSign = saveMod >= 0 ? `+${saveMod}` : `${saveMod}`;

        return `
              <div class="roll20-ability-box">
                <div class="roll20-ability-header" title="${attr.name} (${attr.label})">
                  <span style="font-weight: 800; letter-spacing: 0.5px;">${attr.label}</span>
                  <span class="roll20-ability-val">${raw}</span>
                </div>
                <div class="roll20-mod-save-row">
                  <div class="roll20-sub-chip" onclick="rollPlayerAttr('${p.id}', '${attr.key}')" title="Rolar Teste de ${attr.name} (${attr.label}: ${modSign})">
                    <span class="roll20-chip-val">${modSign}</span>
                    <span class="roll20-chip-lbl">Mod</span>
                  </div>
                  <div class="roll20-sub-chip ${isSaveProf ? 'proficient' : ''}" onclick="rollPlayerSavingThrow('${p.id}', '${attr.key}')" title="Rolar Salvaguarda de ${attr.name} (${attr.label}: ${saveSign})${isSaveProf ? ' • Proficiente' : ''}">
                    <span class="roll20-chip-val">${saveSign}</span>
                    <span class="roll20-chip-lbl">${isSaveProf ? '★ Salva' : 'Salva'}</span>
                  </div>
                </div>
              </div>
            `;
      }).join('')}

          <!-- BLOCO LATERAL AC / SPEED -->
          <div class="roll20-ac-speed-box">
            <div class="roll20-ac-row" title="${escapeAttr(acInfo.details || 'Classe de Armadura (CA)')}">
              <span title="Classe de Armadura (CA)">CLASSE ARM.</span>
              <span class="roll20-ac-shield">${displayAc}</span>
            </div>
            <div class="roll20-speed-row" title="Deslocamento por rodada">
              <span title="Deslocamento">DESLOC.</span>
              <span style="font-weight: 800; color: #fff;">${p.speed || '9m'}</span>
            </div>
          </div>
        </div>

        <!-- 3. GRADE PRINCIPAL EM 3 COLUNAS ROLL20 -->
        <div class="roll20-columns-grid">
          
          <!-- ==============================================
               COLUNA 1: PERÍCIAS & PROFICIÊNCIAS ROLL20
          =============================================== -->
          <div class="roll20-col-skills">
            <div class="roll20-panel">
              <div class="roll20-panel-title">
                <span>🎯 PERÍCIAS (PB: +${prof})</span>
                <button class="btn-micro" onclick="openPlayerSkillsModal('${p.id}')" title="Configurar Proficiências e Especializações">⚙️</button>
              </div>

              <!-- TABELA ROLL20 DE PERÍCIAS -->
              <div class="roll20-skills-list">
                ${(() => {
        const skillsList = typeof DND5E_SKILLS !== 'undefined' ? DND5E_SKILLS : [];
        return skillsList.map(sk => {
          const isProf = (p.skillProficiencies || []).includes(sk.key);
          const isExpert = (p.skillExpertises || []).includes(sk.key);
          const baseMod = Math.floor(((p[sk.attr] || 10) - 10) / 2);
          const profBonus = isExpert ? (prof * 2) : (isProf ? prof : 0);
          const totalMod = baseMod + profBonus;
          const modStr = totalMod >= 0 ? `+${totalMod}` : `${totalMod}`;
          const dotClass = isExpert ? 'expert' : (isProf ? 'active' : '');
          return `
                      <div class="roll20-skill-item" onclick="rollPlayerSkill('${p.id}', '${sk.key}')" title="Rolar teste de ${sk.name} (${modStr})${isExpert ? ' • Especialista (+2x PB)' : (isProf ? ' • Proficiente' : '')}">
                        <div class="roll20-skill-left">
                          <span class="roll20-prof-dot ${dotClass}"></span>
                          <span class="roll20-skill-attr">${(sk.label || sk.attr).toUpperCase()}</span>
                          <span class="roll20-skill-name">${sk.name}</span>
                        </div>
                        <span class="roll20-skill-bonus ${isProf ? 'is-prof' : ''}">${modStr}</span>
                      </div>
                    `;
        }).join('');
      })()}
              </div>

              <!-- BLOCO DE TREINAMENTOS E IDIOMAS -->
              <div class="roll20-proficiencies-block" style="border-top: 1px solid rgba(255,255,255,0.06); padding-top: 6px; font-size: 11px;">
                <div style="font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">🗣️ IDIOMAS</div>
                <div style="color: #cbd5e1; margin-bottom: 4px;">${p.languages || 'Comum'}</div>

                <div style="font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">🛠️ FERRAMENTAS</div>
                <div style="color: #cbd5e1; margin-bottom: 4px;">${(p.toolProficiencies && p.toolProficiencies.length > 0) ? p.toolProficiencies.join(', ') : 'Nenhuma ferramenta configurada.'}</div>

                <div style="font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">🛡️ ARMADURAS & ARMAS</div>
                <div style="color: #cbd5e1;">${p.armorProficiencies ? p.armorProficiencies : 'Padrão da classe.'}</div>
              </div>
            </div>
          </div>

          <!-- ==============================================
               COLUNA 2: ABAS CENTRAIS ROLL20
          =============================================== -->
          <div class="roll20-col-main">

            <!-- NAVEGAÇÃO DE ABAS ROLL20 COM BADGES NUMÉRICAS (ISSUE-157) -->
            <div class="roll20-tabs-header">
              <button type="button" class="roll20-tab-link ${activeRoll20Tab === 'combat' ? 'active' : ''}" onclick="setPlayerCardRoll20Tab('${p.id}', 'combat')">⚔️ Ações</button>
              <button type="button" class="roll20-tab-link ${activeRoll20Tab === 'spells' ? 'active' : ''}" onclick="setPlayerCardRoll20Tab('${p.id}', 'spells')">
                <span>✨ Magias</span>
                <span class="tab-badge-pill">${totalSpellsCount}</span>
              </button>
              <button type="button" class="roll20-tab-link ${activeRoll20Tab === 'inventory' ? 'active' : ''}" onclick="setPlayerCardRoll20Tab('${p.id}', 'inventory')">
                <span>🎒 Mochila</span>
                <span class="tab-badge-pill">${totalInvCount}</span>
              </button>
              <button type="button" class="roll20-tab-link ${activeRoll20Tab === 'hirelings' ? 'active' : ''}" onclick="setPlayerCardRoll20Tab('${p.id}', 'hirelings')">👥 Lacaios & Bastião</button>
              <button type="button" class="roll20-tab-link ${activeRoll20Tab === 'traits' ? 'active' : ''}" onclick="setPlayerCardRoll20Tab('${p.id}', 'traits')">
                <span>📜 Traços</span>
                <span class="tab-badge-pill">${totalTraitsCount}</span>
              </button>
              <button type="button" class="roll20-tab-link ${activeRoll20Tab === 'notes' ? 'active' : ''}" onclick="setPlayerCardRoll20Tab('${p.id}', 'notes')">📝 Notas</button>
              <button type="button" class="roll20-tab-link ${activeRoll20Tab === 'about' ? 'active' : ''}" onclick="setPlayerCardRoll20Tab('${p.id}', 'about')">👤 Sobre</button>
            </div>

            <!-- CONTEÚDO DINÂMICO DAS ABAS ROLL20 -->
            <div class="roll20-tab-body" style="padding-top: 10px;">
              
              <!-- ABA 1: COMBATE & AÇÕES -->
              <div class="roll20-tab-panel" style="display: ${activeRoll20Tab === 'combat' ? 'block' : 'none'};">
                <div class="roll20-atk-header-row">
                  <div class="roll20-atk-title-wrap">
                    <span class="roll20-panel-title" style="margin: 0; border: none; padding: 0;">⚔️ ATAQUES & ARMAS CALCULADAS</span>
                    ${(typeof getPlayerExtraAttacksCount === 'function' && getPlayerExtraAttacksCount(p) > 1) ? `<span class="extra-attack-badge" title="Pode realizar ${getPlayerExtraAttacksCount(p)} ataques na ação Atacar">⚔️ ${getPlayerExtraAttacksCount(p)} Ataques / Ação</span>` : ''}
                  </div>
                  <div class="roll20-atk-header-actions">
                    <button type="button" class="btn-micro roll20-btn-add-weapon" onclick="openWeaponPickerModal('${p.id}')" title="Adicionar arma rápida do acervo D&D">⚔️ + Arma</button>
                    <button type="button" class="btn-micro roll20-btn-add-item" onclick="openAddPlayerItemModal('${p.id}')" title="Adicionar item ao inventário">➕ Item</button>
                  </div>
                </div>

                <!-- TABELA DE ATAQUES ROLL20 (COM ROLAGEM TOUCH RESPONSIVA - ISSUE-139) -->
                <div class="table-responsive-wrap">
                  <table class="roll20-attacks-table">
                    <thead>
                      <tr>
                        <th>Arma / Ataque</th>
                        <th style="text-align: center;">Alcance</th>
                        <th style="text-align: center;">Acerto</th>
                        <th>Dano & Tipo</th>
                        <th style="text-align: right;">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${calculatedAttacks.length > 0 ? calculatedAttacks.map((atk, aIdx) => `
                        <tr class="roll20-atk-row ${atk.isSpecialAttack ? 'is-special-attack' : ''}">
                          <td>
                            <div class="roll20-atk-name" title="${escapeAttr(atk.notes || '')}">
                              <span>${atk.name}</span>
                              ${atk.badge ? `<span class="roll20-atk-badge ${atk.badgeClass || ''}">${atk.badge}</span>` : ''}
                              ${atk.isEquipped ? '<span style="color:var(--accent-gold); font-size:10px;" title="Equipado no Inventário">★</span>' : ''}
                            </div>
                            <div style="font-size: 9.5px; color: #64748b;">${atk.type} ${atk.notes ? '• ' + atk.notes : ''}</div>
                          </td>
                          <td style="text-align: center; color: #94a3b8; font-size: 11px;">
                            ${atk.range}
                            ${atk.ammo ? `
                              <span class="ammo-chip ${atk.ammo.qty <= 0 ? 'ammo-empty' : ''}" title="${atk.ammo.qty} ${atk.ammo.ammoLabel} no inventário (${atk.ammo.itemName})">
                                ${atk.ammo.ammoIcon} ${atk.ammo.qty}
                              </span>
                            ` : ''}
                          </td>
                          <td style="text-align: center;">
                            ${atk.isDamageBonusOnly ? `
                              <span style="font-size: 11px; color: #64748b; font-weight: 700;" title="Dano ou bônus adicional aplicado no acerto">—</span>
                            ` : `
                              <div style="display: inline-flex; align-items: center; justify-content: center; gap: 2px;">
                                <button type="button" class="roll20-btn-roll-atk" onclick="rollPlayerAttack('${p.id}', '${escapeAttr(atk.rawAttackText)}')" oncontextmenu="event.preventDefault(); openAttackAdvantageMenu(event, '${p.id}', '${escapeAttr(atk.rawAttackText)}', ${atk.isVersatile ? 'true' : 'false'});" title="${(atk.toHit || '').startsWith('CD') ? 'Salvaguarda: ' + atk.toHit : 'Rolar Ataque Completo (d20 ' + atk.toHit + ') • Botão Direito p/ Vantagem/Desvantagem'}">
                                  🎲 ${atk.toHit}
                                </button>
                                ${!(atk.toHit || '').startsWith('CD') ? `
                                  <button type="button" class="btn-micro" style="padding: 1px 4px; font-size: 9px; opacity: 0.75; min-width: auto;" onclick="openAttackAdvantageMenu(event, '${p.id}', '${escapeAttr(atk.rawAttackText)}', ${atk.isVersatile ? 'true' : 'false'})" title="Opções de Vantagem / Desvantagem">▾</button>
                                ` : ''}
                              </div>
                            `}
                          </td>
                          <td style="color: #f8fafc; font-size: 11px;">
                            <b style="color: #fbbf24;">${atk.damage}</b> <span style="font-size: 10px; color: #94a3b8;">${atk.damageType}</span>
                            ${atk.isVersatile && atk.versatileDamage ? `
                              <div class="roll20-versatile-subtext" title="Dano empunhando com 2 mãos">2 Mãos: <b style="color: #f59e0b;">${atk.versatileDamage}</b></div>
                            ` : ''}
                          </td>
                          <td style="text-align: right; white-space: nowrap;">
                            <div class="attack-actions-cell">
                              ${atk.isVersatile ? `
                                <div class="btn-versatile-wrap">
                                  <button type="button" class="btn-micro btn-versatile-1h" onclick="rollWeaponDamageOnly('${p.id}', '${escapeAttr(atk.rawAttackText)}', false)" title="Rolar dano com 1 mão (${atk.damage})">💥 1M</button>
                                  <button type="button" class="btn-micro btn-versatile-2h" onclick="rollWeaponDamageOnly('${p.id}', '${escapeAttr(atk.rawVersatileAttackText || atk.rawAttackText)}', false, true)" title="Rolar dano com 2 mãos (${atk.versatileDamage})">💥 2M</button>
                                </div>
                              ` : `
                                <button type="button" class="btn-micro roll20-btn-damage-only" onclick="rollWeaponDamageOnly('${p.id}', '${escapeAttr(atk.rawAttackText)}')" title="${atk.isDamageBonusOnly ? 'Rolar Dano Extra / Bônus' : 'Rolar Apenas Dano'}">💥</button>
                              `}
                              <button type="button" class="btn-chat-feed" onclick="sharePlayerCalculatedAttackToFeed('${p.id}', ${aIdx})" title="Compartilhar ataque no chat da mesa">💬</button>
                            </div>
                          </td>
                        </tr>
                      `).join('') : `
                        <tr>
                          <td colspan="5" style="text-align: center; color: var(--text-dim); padding: 12px; font-style: italic;">
                            Nenhuma arma equipada no inventário. Equipe uma arma na aba <b>Inventário</b> ou clique em <b>+ Arma</b>.
                          </td>
                        </tr>
                      `}
                    </tbody>
                  </table>
                </div>

                <!-- RECURSOS TÁTEIS & CARGAS RÁPIDAS DA CLASSE -->
                <div style="margin-top: 12px;">
                  ${renderPlayerResourceQuickDock(p)}
                </div>

                <!-- ECONOMIA DE TURNO (D&D 5E) -->
                <div style="margin-top: 10px;">
                  <div class="action-economy-nav">
                    <button type="button" class="action-economy-chip ${actionFilter === 'all' ? 'active' : ''}" onclick="setPlayerActionFilter('${p.id}', 'all')">Todas</button>
                    <button type="button" class="action-economy-chip ${actionFilter === 'action' ? 'active' : ''}" onclick="setPlayerActionFilter('${p.id}', 'action')">⚔️ Ação</button>
                    <button type="button" class="action-economy-chip ${actionFilter === 'bonus' ? 'active' : ''}" onclick="setPlayerActionFilter('${p.id}', 'bonus')">⚡ Bônus</button>
                    <button type="button" class="action-economy-chip ${actionFilter === 'reaction' ? 'active' : ''}" onclick="setPlayerActionFilter('${p.id}', 'reaction')">🛡️ Reação</button>
                  </div>
                  ${renderUniversalCombatActions(actionFilter)}
                </div>
              </div>

              <!-- ABA 2: MAGIAS & CONJURAÇÃO (ISSUE-116) -->
              <div class="roll20-tab-panel" style="display: ${activeRoll20Tab === 'spells' ? 'block' : 'none'};">
                <div class="roll20-spells-tab-header">
                  <span class="roll20-panel-title" style="margin: 0; border: none; padding: 0;">🔮 GRIMÓRIO & ESPAÇOS DE MAGIA</span>
                  <button type="button" class="btn-secondary player-spell-picker-btn" onclick="openSpellPickerModal('${p.id}')">📖 Gerenciar Magias</button>
                </div>

                <!-- HUD DE CONJURAÇÃO -->
                ${(() => {
        const castStats = getPlayerSpellcastingStats(p);
        if (!castStats.isCaster && (!p.preparedSpells || p.preparedSpells.length === 0) && (!p.slots || !p.slots.some(s => s > 0))) {
          return '<div style="color: var(--text-dim); font-size: 11px; padding: 8px; text-align: center; font-style: italic;">Este personagem não possui habilidades de conjuração configuradas.</div>';
        }
        return `
                    <div class="spellcasting-hud-bar">
                      <div class="spell-stat-chip" title="CD de Salvaguarda de Magia: Inimigos devem tirar ${castStats.saveDc} ou mais no d20 para resistir às suas magias (${castStats.formula})">
                        <span class="spell-stat-label">CD DA MAGIA</span>
                        <span class="spell-stat-val cd-val">CD ${castStats.saveDc}</span>
                      </div>
                      <button type="button" class="spell-stat-chip rollable" onclick="rollPlayerSpellAttack('${p.id}')" title="Clique para Rolar Ataque Mágico (d20 ${castStats.attackBonus})">
                        <span class="spell-stat-label">ATAQUE MÁGICO 🎲</span>
                        <span class="spell-stat-val atk-val">${castStats.attackBonus}</span>
                      </button>
                      <div class="spell-stat-chip" title="Atributo-Chave: ${castStats.ability} (Modificador ${castStats.modStr}) • Bônus de Proficiência: +${castStats.profBonus}">
                        <span class="spell-stat-label">ATRIBUTO-CHAVE</span>
                        <span class="spell-stat-val mod-val">${castStats.ability} (${castStats.modStr})</span>
                      </div>
                    </div>
                  `;
      })()}

                <!-- SLOTS DE MAGIA -->
                ${slotsHtml}

                <!-- TODAS AS MAGIAS CONHECIDAS E SELETOR DE PREPARAÇÃO DA SESSÃO -->
                <div style="margin-top: 8px;">
                  ${(() => {
        if (typeof ensurePlayerSpellSlots === 'function') ensurePlayerSpellSlots(p);
        const allKnown = typeof getPlayerKnownSpells === 'function' ? getPlayerKnownSpells(p) : ((p.preparedSpells || []));
        const prepInfo = typeof getMaxPreparedSpells === 'function' ? getMaxPreparedSpells(p) : { isKnownCaster: false, maxLeveled: 0, formula: '' };
        const curPrepFilter = (typeof sheetSpellFilters !== 'undefined' && sheetSpellFilters[p.id]) ? sheetSpellFilters[p.id] : 'all';
        const curCircleFilter = sheetSpellCircleFilters[p.id] || 'all';
        const curSearchQuery = (sheetSpellSearchQueries[p.id] || '').trim().toLowerCase();

        const prepLeveledCount = allKnown.filter(sName => {
          const sp = typeof SPELLS_DATA !== 'undefined' ? SPELLS_DATA.find(s => s.name.toLowerCase() === sName.toLowerCase()) : null;
          const isCantrip = sp ? sp.level === 0 : false;
          return !isCantrip && (p.preparedSpells || []).includes(sName);
        }).length;

        const prepTotalCount = allKnown.filter(sName => {
          const sp = typeof SPELLS_DATA !== 'undefined' ? SPELLS_DATA.find(s => s.name.toLowerCase() === sName.toLowerCase()) : null;
          const isCantrip = sp ? sp.level === 0 : false;
          return isCantrip || (p.preparedSpells || []).includes(sName);
        }).length;

        let list = allKnown;
        if (curPrepFilter === 'prepared') {
          list = list.filter(sName => {
            const sp = typeof SPELLS_DATA !== 'undefined' ? SPELLS_DATA.find(s => s.name.toLowerCase() === sName.toLowerCase()) : null;
            const isCantrip = sp ? sp.level === 0 : false;
            return isCantrip || (p.preparedSpells || []).includes(sName);
          });
        }

        if (curSearchQuery) {
          list = list.filter(sName => {
            const sp = typeof SPELLS_DATA !== 'undefined' ? SPELLS_DATA.find(s => s.name.toLowerCase() === sName.toLowerCase()) : null;
            const nameMatches = sName.toLowerCase().includes(curSearchQuery);
            const schoolMatches = sp && sp.school && sp.school.toLowerCase().includes(curSearchQuery);
            const descMatches = sp && sp.desc && sp.desc.toLowerCase().includes(curSearchQuery);
            return nameMatches || schoolMatches || descMatches;
          });
        }

        // Dicionário por nível de magia: 0 = Truques, 1 a 9 = Círculos
        const spellsByLevel = {};
        for (let i = 0; i <= 9; i++) spellsByLevel[i] = [];

        list.forEach(sName => {
          const sp = typeof SPELLS_DATA !== 'undefined' ? SPELLS_DATA.find(s => s.name.toLowerCase() === sName.toLowerCase()) : null;
          const lvl = sp ? (sp.level != null ? sp.level : 1) : 1;
          const validLvl = Math.max(0, Math.min(9, lvl));
          spellsByLevel[validLvl].push({ name: sName, data: sp });
        });

        // Lista de círculos disponíveis para filtrar
        const availableCircles = [];
        if (spellsByLevel[0].length > 0 || allKnown.some(sName => {
          const sp = typeof SPELLS_DATA !== 'undefined' ? SPELLS_DATA.find(s => s.name.toLowerCase() === sName.toLowerCase()) : null;
          return sp && sp.level === 0;
        })) {
          availableCircles.push(0);
        }
        for (let lvl = 1; lvl <= 9; lvl++) {
          const maxSlots = (p.slots || [])[lvl - 1] || 0;
          if (spellsByLevel[lvl].length > 0 || maxSlots > 0) {
            availableCircles.push(lvl);
          }
        }

        let prepBarHtml = '';
        if (prepInfo.isPreparedCaster || (!prepInfo.isKnownCaster && prepInfo.maxLeveled > 0)) {
          const isOver = prepInfo.maxLeveled > 0 && prepLeveledCount > prepInfo.maxLeveled;
          prepBarHtml = `
                        <div class="sheet-spells-prep-bar">
                          <div class="sheet-spells-prep-info">
                            <span>🔮 <b>Preparadas para a Sessão:</b> <b class="prep-count-num ${isOver ? 'over' : ''}">${prepLeveledCount} / ${prepInfo.maxLeveled}</b> <span style="color:#94a3b8; font-size:10.5px;">(${prepInfo.formula})</span></span>
                          </div>
                          <div class="sheet-spell-filter-chips">
                            <button type="button" class="sheet-spell-filter-chip ${curPrepFilter === 'all' ? 'active' : ''}" onclick="setSheetSpellFilter('${p.id}', 'all')">🌐 Todas (${allKnown.length})</button>
                            <button type="button" class="sheet-spell-filter-chip ${curPrepFilter === 'prepared' ? 'active' : ''}" onclick="setSheetSpellFilter('${p.id}', 'prepared')">⭐ Apenas Preparadas (${prepTotalCount})</button>
                          </div>
                        </div>
                      `;
        } else if (prepInfo.isKnownCaster) {
          prepBarHtml = `
                        <div class="sheet-spells-prep-bar">
                          <div class="sheet-spells-prep-info">
                            <span>🔮 <b>Magias Conhecidas (${prepInfo.className}):</b> <b class="prep-count-num">${allKnown.length} ${prepInfo.maxLeveled ? '/ ' + prepInfo.maxLeveled : ''}</b></span>
                          </div>
                          <div class="sheet-spell-filter-chips">
                            <span style="font-size:10.5px; color:#a7f3d0;">✨ Todas sempre ativas para a sessão</span>
                          </div>
                        </div>
                      `;
        }

        const spellToolbarHtml = `
                      <div class="spells-toolbar">
                        <div class="spell-circle-chips">
                          <button type="button" class="spell-circle-chip ${curCircleFilter === 'all' ? 'active' : ''}" onclick="setPlayerSpellCircleFilter('${p.id}', 'all')">🌐 Todos (${list.length})</button>
                          ${availableCircles.map(lvl => {
          const countInCircle = spellsByLevel[lvl].length;
          const label = lvl === 0 ? '✨ Truques' : `🔮 ${lvl}º Círc.`;
          return `<button type="button" class="spell-circle-chip ${curCircleFilter === String(lvl) ? 'active' : ''}" onclick="setPlayerSpellCircleFilter('${p.id}', '${lvl}')">${label} (${countInCircle})</button>`;
        }).join('')}
                        </div>
                        <input type="text" class="spell-search-input" id="inp-spell-search-${p.id}" placeholder="🔍 Filtrar magias por nome, escola ou efeito..." value="${escapeAttr(sheetSpellSearchQueries[p.id] || '')}" oninput="handlePlayerSpellSearch('${p.id}', this.value)">
                      </div>
                    `;

        const renderSpellCard = (sItem) => {
          const sName = sItem.name;
          const sp = sItem.data;
          const isCantrip = sp && sp.level === 0;
          const lvlBadge = sp ? (isCantrip ? 'Truque' : `${sp.level}º Círc.`) : 'Magia';
          const school = sp ? sp.school : '';
          const range = sp ? sp.range : '';
          const diceInfo = typeof getSpellDiceInfo === 'function' ? getSpellDiceInfo(sp || sName, p) : null;
          const isPrep = isCantrip || (p.preparedSpells || []).includes(sName);

          // Detecção Canônica 5E: Concentração, Ritual, Tempo
          const descLower = (sp ? (sp.desc || '') : '').toLowerCase();
          const isConc = sp ? (sp.concentration || descLower.includes('concentraç')) : false;
          const isRitual = sp ? (sp.ritual || descLower.includes('ritual')) : false;
          const castTimeRaw = sp ? (sp.casting_time || sp.castTime || '') : '';
          let castTimeTag = '';
          if (castTimeRaw) {
            const ctLower = castTimeRaw.toLowerCase();
            if (ctLower.includes('bônus') || ctLower.includes('bonus')) {
              castTimeTag = '<span class="spell-tag-badge casttime" title="Tempo: Ação Bônus">⚡ Bônus</span>';
            } else if (ctLower.includes('reação') || ctLower.includes('reacao')) {
              castTimeTag = '<span class="spell-tag-badge casttime" title="Tempo: Reação">🛡️ Reação</span>';
            } else if (ctLower.includes('ação') || ctLower.includes('acao')) {
              castTimeTag = '<span class="spell-tag-badge casttime" title="Tempo: 1 Ação">⚔️ 1 Ação</span>';
            }
          }

          return `
                        <div class="spell-action-chip player-spell-card-tactile ${isPrep ? 'is-prep' : 'is-unprep'}" onclick="openSpellQuickView('${escapeAttr(sName)}', '${p.id}', event)">
                          <div class="spell-chip-top">
                            <div class="spell-chip-name" title="${escapeAttr(sName)}">${sName}</div>
                            <div style="display:flex; align-items:center; gap:4px;">
                              <button type="button" class="btn-chat-feed" onclick="event.stopPropagation(); openSpellQuickView('${escapeAttr(sName)}', '${p.id}', event)" title="Ver o que a magia faz (Descrição completa)">💬</button>
                              <span class="spell-chip-lvl ${isCantrip ? 'cantrip' : 'leveled'}">${lvlBadge}</span>
                              <button type="button" class="btn-chat-feed" style="color:#f87171; border-color:rgba(248,113,113,0.3); padding:1px 5px; font-size:10px;" onclick="event.stopPropagation(); removeSpellFromPlayer('${p.id}', '${escapeAttr(sName)}', event)" title="Remover esta magia da ficha">✕</button>
                            </div>
                          </div>
                          <div class="spell-chip-subinfo">
                            ${school ? `<span>${school}</span>` : ''}
                            ${range ? `<span>• ${range}</span>` : ''}
                          </div>
                          <div style="display:flex; gap:3px; flex-wrap:wrap; margin-top:3px;">
                            ${isConc ? '<span class="spell-tag-badge conc" title="Exige Concentração (C)">⚠️ Concentração</span>' : ''}
                            ${isRitual ? '<span class="spell-tag-badge ritual" title="Pode ser conjurada como Ritual (R)">🔮 Ritual</span>' : ''}
                            ${castTimeTag}
                          </div>
                          ${diceInfo ? `
                            <div class="spell-chip-dice-row">
                              <button type="button" class="spell-dice-pill ${diceInfo.isHeal ? 'heal' : 'damage'}" onclick="event.stopPropagation(); rollPlayerSpellDice('${p.id}', '${escapeAttr(diceInfo.spellName || sName)}')" title="Clique para Rolar ${escapeAttr(diceInfo.label)}">
                                <span>${diceInfo.icon}</span> <span>${diceInfo.label}</span> 🎲
                              </button>
                            </div>
                          ` : ''}
                          <div class="spell-chip-actions-bar" onclick="event.stopPropagation()">
                            <button type="button" class="btn-spell-cast" onclick="event.stopPropagation(); castPlayerSpellPrompt('${p.id}', '${escapeAttr(sName)}')" title="Lançar Magia">⚡ Lançar</button>
                            ${isCantrip ? `
                              <span class="badge" style="background: rgba(16,185,129,0.2); color:#6ee7b7; border: 1px solid rgba(16,185,129,0.4); font-size: 9.5px; padding: 2px 6px;">
                                ✨ Truque
                              </span>
                            ` : (prepInfo.isKnownCaster ? `
                              <span class="badge badge-spell-known" title="Magia Conhecida Fixa (D&D 5E)">
                                🔮 Conhecida
                              </span>
                            ` : `
                              <button type="button" class="btn-spell-prep-toggle ${isPrep ? 'active' : ''}" onclick="event.stopPropagation(); togglePlayerSpellPrepared('${p.id}', '${escapeAttr(sName)}')" title="Clique para ${isPrep ? 'desmarcar' : 'preparar para a sessão'}">
                                ${isPrep ? '⭐ Preparada' : '💤 Não prep'}
                              </button>
                            `)}
                          </div>
                        </div>
                      `;
        };

        let circlesToRender = curCircleFilter === 'all'
          ? availableCircles
          : [parseInt(curCircleFilter, 10)];

        let groupsHtml = '';
        circlesToRender.forEach(lvl => {
          const circleSpells = spellsByLevel[lvl] || [];
          if (circleSpells.length === 0 && curCircleFilter === 'all') return;

          let circleTitle = lvl === 0 ? '✨ Truques & Preces Básicas' : `🔮 ${lvl}º Círculo`;
          let slotsBarHtml = '';

          if (lvl === 0) {
            slotsBarHtml = `
                          <div class="spell-circle-slots-bar">
                            <span style="font-size:10px; color:#6ee7b7; font-weight:600;">Infinito / À Vontade</span>
                          </div>
                        `;
          } else {
            const maxSlots = (p.slots || [])[lvl - 1] || 0;
            const usedSlots = (p.slotsUsed || [])[lvl - 1] || 0;
            const avail = Math.max(0, maxSlots - usedSlots);

            let fallbackZeroSlotsHtml = '<span style="font-size:9.5px; color:#94a3b8;">Sem espaços</span>';
            if (maxSlots === 0 && Array.isArray(p.slots)) {
              const higherSlotIdx = p.slots.findIndex((cnt, idx) => idx > (lvl - 1) && (cnt || 0) > 0);
              if (higherSlotIdx >= 0) {
                const pactLvl = higherSlotIdx + 1;
                const pactMax = p.slots[higherSlotIdx] || 0;
                const pactUsed = (p.slotsUsed || [])[higherSlotIdx] || 0;
                const pactAvail = Math.max(0, pactMax - pactUsed);
                const isWarlock = ((p.className || '').toLowerCase().includes('bruxo') || (p.className || '').toLowerCase().includes('warlock') || (Array.isArray(p.multiclass) && p.multiclass.some(m => (m.className || '').toLowerCase().includes('bruxo'))));
                fallbackZeroSlotsHtml = `<span style="font-size:10px; color:#c084fc; font-weight:600;" title="Conjura usando espaço de ${pactLvl}º Círculo">${isWarlock ? '🔮 Espaços de Pacto' : '🔮 Usa Círc. Superior'} (${pactAvail}/${pactMax} de ${pactLvl}º Círc.)</span>`;
              }
            }

            slotsBarHtml = `
                          <div class="spell-circle-slots-bar" title="Espaços de ${lvl}º Círculo: ${avail}/${maxSlots} disponíveis">
                            ${maxSlots > 0 ? Array.from({ length: maxSlots }).map((_, slotIdx) => {
              const isSpent = slotIdx < usedSlots;
              return `<div class="spell-circle-slot-bubble ${isSpent ? 'spent' : 'available'}" onclick="togglePlayerCircleSlot('${p.id}', ${lvl - 1}, ${slotIdx}, event)" title="${isSpent ? 'Espaço Gasto (Clique para restaurar)' : 'Espaço Disponível (Clique para gastar)'}"></div>`;
            }).join('') : fallbackZeroSlotsHtml}
                            <span class="spell-circle-slot-count-text">${maxSlots > 0 ? `${avail}/${maxSlots} slots` : ''}</span>
                          </div>
                        `;
          }

          groupsHtml += `
                        <div class="spell-circle-group">
                          <div class="spell-circle-header">
                            <div class="spell-circle-title">
                              <span>${circleTitle}</span>
                              <span class="spell-circle-count">${circleSpells.length}</span>
                            </div>
                            ${slotsBarHtml}
                          </div>
                          ${circleSpells.length > 0 ? `
                            <div class="player-spells-chips-grid">
                              ${circleSpells.map(renderSpellCard).join('')}
                            </div>
                          ` : `
                            <div style="font-size: 10.5px; color: var(--text-dim); font-style: italic; padding: 6px 4px;">Nenhuma magia encontrada neste círculo.</div>
                          `}
                        </div>
                      `;
        });

        if (!groupsHtml) {
          groupsHtml = `
                        <div style="text-align: center; padding: 20px; background: rgba(0,0,0,0.25); border: 1px dashed var(--border-color); border-radius: 8px; font-size: 11.5px; color: var(--text-dim); margin-top: 6px;">
                          ${curSearchQuery ? `Nenhuma magia encontrada para o termo <b>"${escapeAttr(curSearchQuery)}"</b>.` : (curPrepFilter === 'prepared'
              ? 'Nenhuma magia foi preparada ainda para esta sessão.<br><span style="font-size:10.5px; color:#cbd5e1;">Mude para <b>"🌐 Todas as Conhecidas"</b> acima para escolher as que deseja preparar.</span>'
              : 'Nenhuma magia cadastrada ou conhecida no momento.<br><span style="font-size:10.5px; color:#cbd5e1;">Clique no botão abaixo para escolher do compêndio D&D 5E.</span>')}
                          <div style="margin-top: 8px;">
                            <button type="button" class="btn-action" style="font-size: 11px; padding: 4px 10px;" onclick="openSpellPickerModal('${p.id}')">✨ Escolher Magias</button>
                          </div>
                        </div>
                      `;
        }

        return `
                      ${prepBarHtml}
                      ${spellToolbarHtml}
                      <div class="player-spells-grouped-container">
                        ${groupsHtml}
                      </div>
                    `;
      })()}
                </div>
              </div>

              <!-- ABA 3: INVENTÁRIO, PESO & MOCHILA -->
              <div class="roll20-tab-panel" style="display: ${activeRoll20Tab === 'inventory' ? 'block' : 'none'};">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                  <span class="roll20-panel-title" style="margin: 0; border: none; padding: 0;">🎒 INVENTÁRIO & CAPACIDADE DE CARGA</span>
                  <div style="display: flex; gap: 4px;">
                    <button type="button" class="btn-action" style="font-size: 10px; padding: 3px 8px;" onclick="openAddPlayerItemModal('${p.id}')">➕ Item</button>
                    <button type="button" class="btn-secondary" style="font-size: 10px; padding: 3px 8px;" onclick="openPlayerCoinsModal('${p.id}')">🪙 Moedas</button>
                  </div>
                </div>

                <!-- CARTEIRA DE MOEDAS ROLL20 -->
                <div class="roll20-coins-row" style="margin-bottom: 8px;">
                  <div class="roll20-coin-box"><span class="roll20-coin-val">${(p.coins && p.coins.cp) || 0}</span><span>PC</span></div>
                  <div class="roll20-coin-box"><span class="roll20-coin-val">${(p.coins && p.coins.sp) || 0}</span><span>PP</span></div>
                  <div class="roll20-coin-box"><span class="roll20-coin-val">${(p.coins && p.coins.ep) || 0}</span><span>PE</span></div>
                  <div class="roll20-coin-box"><span class="roll20-coin-val">${(p.coins && p.coins.gp) || p.gold || 0}</span><span>PO</span></div>
                  <div class="roll20-coin-box"><span class="roll20-coin-val">${(p.coins && p.coins.pp) || 0}</span><span>PL</span></div>
                </div>

                <!-- BARRA RÁPIDA DO BAÚ DO GRUPO -->
                <div class="party-stash-quickbar">
                  <div class="stash-info">
                    <span>🎒 Baú Coletivo:</span>
                    <span class="stash-gold-pill">${((typeof getActiveCampaign === 'function' ? getActiveCampaign()?.partyStash?.gold : 0) || 0)} PO</span>
                  </div>
                  <div style="display: flex; gap: 4px;">
                    <button type="button" class="btn-micro" onclick="openPartyStashModal()" title="Abrir Baú Coletivo & Suprimentos do Grupo" style="color: #facc15; padding: 2px 7px;">🎒 Ver Baú</button>
                    <button type="button" class="btn-micro" onclick="openPartyItemModal()" title="Adicionar item diretamente ao Baú do Grupo" style="color: #38bdf8; padding: 2px 7px;">➕ No Baú</button>
                  </div>
                </div>

                <!-- STATUS DE PESO E CARGA ROLL20 -->
                <div class="roll20-weight-status-bar" style="margin-bottom: 8px;">
                  <span>⚖️ Carga (FOR ${p.str || 10}): <b style="color: ${carry.isOverloaded ? '#f87171' : (carry.isEncumbered ? '#facc15' : '#34d399')};">${carry.totalWeight} kg</b> / ${carry.maxKg} kg</span>
                  <span style="color: var(--text-dim); font-size: 10px;">${carry.pct}% ${carry.isOverloaded ? '⚠️ SOBRECARREGADO' : (carry.isEncumbered ? '⚡ PESADO' : '✅')}</span>
                </div>
                <div class="hp-bar-bg" style="height: 6px; margin-bottom: 8px;">
                  <div class="hp-bar-fill" style="width: ${carry.pct}%; background-color: ${carry.isOverloaded ? 'var(--accent-red)' : (carry.isEncumbered ? '#eab308' : 'var(--accent-green)')};"></div>
                </div>

                <!-- LISTA DE ITENS DO INVENTÁRIO -->
                <div style="display: flex; flex-direction: column; gap: 6px; min-height: 380px; max-height: 640px; overflow-y: auto; padding-right: 4px;">
                  ${(p.inventory && p.inventory.length > 0) ? p.inventory.map((it, idx) => {
        const actionInfo = typeof getItemActionInfo === 'function' ? getItemActionInfo(it.name) : { icon: '⚡', label: 'Usar', isConsumable: false };
        const itemQty = parseInt(it.qty, 10) || 0;
        const catLower = (it.category || '').toLowerCase();
        const nameLower = (it.name || '').toLowerCase();
        const isArmorOrShield = catLower.includes('armadura') || catLower.includes('escudo') || nameLower.includes('armadura') || nameLower.includes('escudo');
        const isWeapon = catLower.includes('arma') || catLower.includes('weapon') || (typeof isPlayerWeaponItem === 'function' && isPlayerWeaponItem(it.name));
        const isConsumable = !!(actionInfo.isConsumable && !isArmorOrShield && !isWeapon);
        const cleanWeightStr = typeof formatCleanItemWeight === 'function' ? formatCleanItemWeight(it.weight) : (it.weight ? String(it.weight).replace(/\s*kg/gi, '').trim() + ' kg' : '');
        const weightDisplay = cleanWeightStr ? ` • ${cleanWeightStr}` : '';
        return `
                      <div class="inventory-item-row ${it.equipped ? 'equipped' : ''}">
                        <div class="inventory-item-info" style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-right: 6px; cursor: pointer;" onclick="openItemQuickView('${p.id}', ${idx})" title="Clique para ver o que este item faz">
                          <span style="font-weight: 700; color: #fff;">${it.equipped ? '⚔️ ' : ''}${it.name}${it.attuned ? ' <span title="Item Mágico Sintonizado" style="color:#38bdf8; font-size:10px;">💎</span>' : ''}</span>
                          <span style="font-size: 9px; color: var(--text-dim);">${weightDisplay}</span>
                        </div>
                        <div class="inventory-item-actions" style="display: inline-flex; align-items: center; gap: 4px; flex-shrink: 0; white-space: nowrap;">
                          ${isConsumable ? `
                            <button type="button" class="btn-item-use ${itemQty <= 0 ? 'empty' : ''}" onclick="usePlayerInventoryItem('${p.id}', ${idx})" title="${itemQty > 0 ? `${actionInfo.label} 1x ${it.name}` : 'Item esgotado'}" ${itemQty <= 0 ? 'disabled' : ''}>
                              ${actionInfo.icon}
                            </button>
                          ` : ''}
                          <button type="button" class="btn-item-equip-badge ${it.equipped ? 'equipped active' : 'unequipped'}" onclick="togglePlayerItemEquipped('${p.id}', ${idx})" title="${it.equipped ? 'Equipado! Clique para desequipar' : 'Guardado na mochila. Clique para equipar e calcular CA/Ataques'}">
                            ${it.equipped ? '🛡️ Equipado' : 'Equipar'}
                          </button>
                          <div style="display: inline-flex; align-items: center; gap: 2px; background: rgba(0,0,0,0.25); padding: 1px 3px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.06); flex-shrink: 0;">
                            <button type="button" class="btn-micro" onclick="adjustPlayerItemQty('${p.id}', ${idx}, -1)" title="Diminuir" style="padding: 1px 4px; font-size: 9px;">−</button>
                            <span style="font-weight: 800; min-width: 14px; text-align: center; color: ${itemQty > 0 ? 'var(--primary-light)' : 'var(--text-dim)'}; font-size: 10px;">${itemQty}x</span>
                            <button type="button" class="btn-micro" onclick="adjustPlayerItemQty('${p.id}', ${idx}, 1)" title="Aumentar" style="padding: 1px 4px; font-size: 9px;">+</button>
                          </div>
                          <button type="button" class="btn-stash-send" onclick="sendPlayerItemToPartyStash('${p.id}', ${idx})" title="Guardar no Baú do Grupo" style="flex-shrink: 0;">📦 Baú</button>
                          <button type="button" class="btn-micro" style="color: #facc15; padding: 1px 4px; font-size: 9px; flex-shrink: 0;" onclick="openTradeItemModal('${p.id}', ${idx})" title="Doar ou transferir para outro herói ou Baú">🤝</button>
                          <button type="button" class="btn-micro" style="color: #cbd5e1; padding: 1px 4px; font-size: 9px; flex-shrink: 0;" onclick="openEditPlayerItemModal('${p.id}', ${idx})" title="Editar propriedades deste item">✏️</button>
                          <button type="button" class="btn-chat-feed" onclick="openItemQuickView('${p.id}', ${idx})" title="Ver o que este item faz (Descrição completa)" style="flex-shrink: 0;">💬</button>
                          <button type="button" class="btn-micro" style="color: #f87171; padding: 1px 4px; font-size: 9px; flex-shrink: 0;" onclick="removePlayerItem('${p.id}', ${idx})" title="Remover item">🗑️</button>
                        </div>
                      </div>
                    `;
      }).join('') : `
                    <div style="text-align: center; padding: 16px; color: var(--text-dim); font-size: 11px; font-style: italic;">
                      A mochila está vazia. Clique em <b>➕ Item</b> para adicionar equipamentos.
                    </div>
                  `}
                </div>
              </div>

              <!-- ABA 4: TRAÇOS & CARACTERÍSTICAS (ISSUE-157: VISUALIZAÇÃO EXPANDIDA, BUSCA E FILTROS) -->
              <div class="roll20-tab-panel" style="display: ${activeRoll20Tab === 'traits' ? 'block' : 'none'};">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                  <span class="roll20-panel-title" style="margin: 0; border: none; padding: 0;">📜 CARACTERÍSTICAS & TALENTOS D&D 5E</span>
                  <div style="display: flex; gap: 4px;">
                    <button type="button" class="btn-micro" style="color: #facc15; font-size: 10px; padding: 2px 7px;" onclick="openMasterGrantFeatModal('${p.id}')" title="Conceder Talento pelo Mestre">⭐ + Talento</button>
                    <button type="button" class="btn-micro" style="color: #38bdf8; font-size: 10px; padding: 2px 7px;" onclick="openAsiChoiceModal('${p.id}')" title="Aumento no Valor de Atributo ou Escolha de Talento">📈 ASI</button>
                  </div>
                </div>

                ${(() => {
        const catFilter = sheetTraitCategoryFilters[p.id] || 'all';
        const searchQuery = (sheetTraitSearchQueries[p.id] || '').trim().toLowerCase();
        const isExpAll = !!sheetTraitExpandedAll[p.id];

        const toolbarHtml = `
                    <div class="traits-toolbar">
                      <div class="trait-filter-chips">
                        <button type="button" class="trait-filter-chip ${catFilter === 'all' ? 'active' : ''}" onclick="setPlayerTraitCategoryFilter('${p.id}', 'all')">🌐 Todos (${totalTraitsCount})</button>
                        <button type="button" class="trait-filter-chip ${catFilter === 'species' ? 'active' : ''}" onclick="setPlayerTraitCategoryFilter('${p.id}', 'species')">🧬 Raça (${heroRacialTraitsCount})</button>
                        <button type="button" class="trait-filter-chip ${catFilter === 'class' ? 'active' : ''}" onclick="setPlayerTraitCategoryFilter('${p.id}', 'class')">🌳 Classe (${heroClassFeatsCount})</button>
                        <button type="button" class="trait-filter-chip ${catFilter === 'feats' ? 'active' : ''}" onclick="setPlayerTraitCategoryFilter('${p.id}', 'feats')">⭐ Talentos & ASI (${heroFeatsList.length})</button>
                      </div>
                      <div style="display:flex; gap:6px; align-items:center;">
                        <input type="text" class="trait-search-input" id="inp-trait-search-${p.id}" placeholder="🔍 Filtrar características por nome ou regra..." value="${escapeAttr(sheetTraitSearchQueries[p.id] || '')}" oninput="handlePlayerTraitSearch('${p.id}', this.value)">
                        <button type="button" class="trait-accordion-toggle" onclick="togglePlayerTraitsExpandAll('${p.id}')">${isExpAll ? '⊟ Recolher' : '⊞ Expandir'}</button>
                      </div>
                    </div>
                  `;

        const showSpecies = catFilter === 'all' || catFilter === 'species';
        const showClass = catFilter === 'all' || catFilter === 'class';
        const showFeats = catFilter === 'all' || catFilter === 'feats';

        const featsHtml = showFeats && typeof renderPlayerFeatsSection === 'function'
          ? renderPlayerFeatsSection(p, searchQuery, isExpAll, sheetTraitOpenItems) : '';
        const racialHtml = showSpecies && typeof renderPlayerRacialTraits === 'function'
          ? renderPlayerRacialTraits(p, searchQuery, isExpAll, sheetTraitOpenItems) : '';
        const classHtml = showClass
          ? (searchQuery || isExpAll || (sheetTraitOpenItems && sheetTraitOpenItems.size > 0)
            ? renderPlayerUnlockedFeatures(p, 'all', searchQuery, isExpAll, sheetTraitOpenItems)
            : renderPlayerUnlockedFeatures(p, 'all')) : '';

        const otherFeatures = p.features ? `<div style="font-size: 11px; color: var(--text-dim); margin-top: 8px; border-top: 1px solid rgba(255,255,255,0.07); padding-top: 6px;"><b>Outras Características:</b> ${typeof formatFeatureSnippet === 'function' ? formatFeatureSnippet(p.features) : p.features}</div>` : '';

        return `
                    ${toolbarHtml}
                    ${featsHtml}
                    <div class="roll20-traits-container" style="margin-top: 10px;">
                      ${racialHtml}
                      ${classHtml}
                    </div>
                    ${otherFeatures}
                  `;
      })()}
              </div>

              <!-- ABA 5: NOTAS PRIVADAS -->
              <div class="roll20-tab-panel" style="display: ${activeRoll20Tab === 'notes' ? 'block' : 'none'};">
                <div class="player-notes-container">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                    <span class="roll20-panel-title" style="margin: 0; border: none; padding: 0;">📝 BLOCO DE NOTAS PRIVADO</span>
                    <span id="notes-status-${p.id}" style="font-size: 10px; color: var(--text-muted);">Salvo automaticamente</span>
                  </div>
                  <textarea class="player-notes-textarea" placeholder="Escreva aqui anotações pessoais, nomes de NPCs, pistas de missões..." oninput="handlePlayerNotesInput('${p.id}', this.value)">${escapeAttr(p.playerNotes || '')}</textarea>
                </div>
              </div>

              <!-- ABA 6: SOBRE & HISTÓRIA -->
              <div class="roll20-tab-panel" style="display: ${activeRoll20Tab === 'about' ? 'block' : 'none'};">
                <div class="background-info-card">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <span style="font-size: 12px; font-weight: 800; color: var(--primary-light);">🎭 Origem: <b style="color: #fff;">${p.background || 'Aventureiro'}</b></span>
                    <button type="button" class="btn-secondary" style="font-size: 10px; padding: 2px 8px;" onclick="openPlayerModal('${p.id}')">✏️ Editar</button>
                  </div>
                  <div style="font-size: 11px; margin-bottom: 8px;" class="origin-field-box">
                    <span class="origin-label">🎭 Traço de Personalidade:</span>
                    <div class="origin-text">${p.personality || 'Nenhum traço de personalidade definido.'}</div>
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

              <!-- ABA 7: LACAIOS & CONTRATADOS DO HERÓI (OLD DRAGON 2 / 5E 100% PO) -->
              <div class="roll20-tab-panel" style="display: ${activeRoll20Tab === 'hirelings' ? 'block' : 'none'};">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                  <span class="roll20-panel-title" style="margin: 0; border: none; padding: 0;">👥 LACAIOS & AJUDANTES CONTRATADOS</span>
                  <button type="button" class="btn-action" style="font-size: 10px; padding: 3px 8px;" onclick="openAddCampaignHirelingModal('${p.id}')">➕ Contratar Lacaio</button>
                </div>

                <!-- CARD DE LIMITE POR CARISMA DO HERÓI -->
                <div class="party-stash-quickbar" style="margin-bottom: 10px;">
                  <div class="stash-info">
                    <span>👑 <b>Liderança (Carisma ${p.cha || 10}):</b> Limite de Ajudantes: <b style="color: #fef08a;">${(typeof calculateHirelingCharismaLimit === 'function' ? calculateHirelingCharismaLimit(p.cha) : (p.cha > 8 ? Math.max(0, Math.floor((p.cha - 10) / 2) + 1) : 0))}</b></span>
                    <span style="font-size: 10.5px; color: var(--text-dim);">(Atual: ${(p.hirelings || []).filter(h => h.type === 'helper').length} ajudantes)</span>
                  </div>
                  <div style="font-size: 10px; color: ${(p.cha || 10) <= 8 ? '#f87171' : '#34d399'};">
                    ${(p.cha || 10) <= 8 ? '⚠️ CAR ≤ 8: Não pode contratar ajudantes' : '✅ Autorizado a contratar'}
                  </div>
                </div>

                <!-- LISTA DE LACAIOS DO HERÓI -->
                <div style="display: flex; flex-direction: column; gap: 8px; min-height: 200px;">
                  ${(!p.hirelings || p.hirelings.length === 0) ? `
                    <div style="text-align: center; padding: 24px; color: var(--text-dim); font-size: 11px; font-style: italic; background: rgba(15, 23, 42, 0.4); border-radius: 8px;">
                      ${p.name} não possui nenhum ajudante, mercenário ou aprendiz contratado.<br>
                      Clique em <b>➕ Contratar Lacaio</b> para admitir tocheiros, escolta militar ou aprendizes de classe!
                    </div>
                  ` : p.hirelings.map(h => {
        const statusClass = h.status === 'fled' ? 'status-pill-fled' : (h.status === 'injured' ? 'status-pill-injured' : (h.status === 'away' ? 'status-pill-away' : 'status-pill-acting'));
        const statusLabel = h.status === 'fled' ? '🏃 Fugiu' : (h.status === 'injured' ? '🔴 Ferido' : (h.status === 'away' ? '🟡 Missão' : '🟢 Ativo'));
        return `
                      <div class="hireling-card ${h.status === 'fled' ? 'fled' : ''}" style="margin-bottom: 4px;">
                        <div class="hireling-header">
                          <div>
                            <div class="hireling-name-badge">
                              <span>${h.name}</span>
                              <span class="hireling-cost-tag">💰 ${h.cost} PO / ${h.costPeriod || 'semana'}${h.foodCost ? ` (+${h.foodCost} PO comida)` : ''}</span>
                              <span class="status-pill ${statusClass}">${statusLabel}</span>
                            </div>
                            <div style="font-size: 10px; color: var(--text-dim); margin-top: 2px;">
                              ${h.description || 'Lacaio a serviço de ' + p.name}
                            </div>
                          </div>
                          <div style="display: flex; gap: 3px;">
                            <button type="button" class="btn-micro" onclick="sendHirelingToCombat('${h.id}', '${p.id}')" title="Enviar para o combate / VTT como aliado" style="color: #38bdf8; padding: 2px 5px;">⚔️ Combate</button>
                            <button type="button" class="btn-micro" onclick="rollSingleHirelingMorale('${h.id}', '${p.id}')" title="Rolar teste de moral" style="color: #facc15; padding: 2px 5px;">🎲 Moral</button>
                            <button type="button" class="btn-micro" onclick="dismissCampaignHireling('${h.id}', '${p.id}')" title="Dispensar lacaio" style="color: #f87171; padding: 2px 5px;">🗑️</button>
                          </div>
                        </div>

                        <div class="hireling-stats-row">
                          <span class="hireling-stat-pill">❤️ PV: <b>${h.hp || 4}/${h.maxHp || 4}</b></span>
                          <span class="hireling-stat-pill">🛡️ CA: <b>${h.ac || 10}</b></span>
                          <span class="hireling-stat-pill">🦁 Moral: <b>${h.morale || 7} (CD ${h.moraleDc || 10})</b></span>
                          ${(h.attacks || []).map(a => `<span class="hireling-stat-pill" style="color: #fed7aa;">⚔️ ${a.name} (+${a.bonus}, ${a.damage})</span>`).join('')}
                          ${h.specialFeature ? `<span class="hireling-stat-pill" style="color: #c4b5fd;">${h.specialFeature}</span>` : ''}
                        </div>

                        <div class="hireling-mission-box">
                          <span style="font-size: 12px;">🎯</span>
                          <input type="text" class="hireling-mission-input" value="${h.mission || h.defaultMission || 'Ajudar nas tarefas do herói'}"
                            placeholder="Defina a função / ordem atual para este lacaio..."
                            onchange="updateHirelingMission('${h.id}', this.value, '${p.id}')">
                          <select style="background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(148, 163, 184, 0.2); color: #cbd5e1; font-size: 10px; border-radius: 4px; padding: 1px 4px;"
                            onchange="updateHirelingStatus('${h.id}', this.value, '${p.id}')">
                            <option value="acting" ${h.status === 'acting' || !h.status ? 'selected' : ''}>🟢 Ativo</option>
                            <option value="away" ${h.status === 'away' ? 'selected' : ''}>🟡 Missão</option>
                            <option value="injured" ${h.status === 'injured' ? 'selected' : ''}>🔴 Ferido</option>
                            <option value="fled" ${h.status === 'fled' ? 'selected' : ''}>🏃 Fugiu</option>
                          </select>
                        </div>
                      </div>
                    `;
      }).join('')}
                </div>

                <!-- 🏰 SALAS SOB GESTÃO DESTE HERÓI NO BASTIÃO DO GRUPO (D&D 2024 / 5.5) -->
                <div style="margin-top: 14px; border-top: 1px solid var(--border-color); padding-top: 10px;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <span class="roll20-panel-title" style="margin: 0; border: none; padding: 0; font-size: 11px;">🏰 SALAS NO BASTIÃO COLETIVO</span>
                    <button type="button" class="btn-secondary" style="font-size: 10px; padding: 2px 7px;" onclick="if(typeof openBastionActionModal==='function') openBastionActionModal()">⚡ Ações do Bastião</button>
                  </div>

                  ${(() => {
        const activeCamp = (typeof getActiveCampaign === 'function') ? getActiveCampaign() : null;
        const bastion = (activeCamp && typeof getCampaignBastion === 'function') ? getCampaignBastion(activeCamp) : null;
        if (!bastion) {
          return `<div style="font-size: 11px; color: var(--text-dim); font-style: italic;">Nenhum Bastião ativo na campanha vinculada.</div>`;
        }
        const myFacilities = (bastion.specialFacilities || []).filter(f => String(f.patronId) === String(p.id));
        if (myFacilities.length === 0) {
          return `
                        <div style="font-size: 11px; color: var(--text-dim); background: rgba(0,0,0,0.25); padding: 8px 10px; border-radius: 6px; border: 1px dashed rgba(255,255,255,0.1);">
                          📍 ${p.name} ainda não possui salas atribuídas no <b>${bastion.name}</b>.<br>
                          Acesse a aba <b>Campanhas</b> para vincular uma sala especial a este herói!
                        </div>
                      `;
        }
        return `
                      <div style="display: flex; flex-direction: column; gap: 6px;">
                        ${myFacilities.map(f => {
          const cat = (typeof BASTION_SPECIAL_FACILITIES_CATALOG !== 'undefined') ? BASTION_SPECIAL_FACILITIES_CATALOG[f.key] : null;
          const icon = cat ? cat.icon : '🏛️';
          const order = f.currentOrder;
          return `
                            <div style="background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(245, 158, 11, 0.25); border-radius: 6px; padding: 8px 10px; font-size: 11px;">
                              <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span style="font-weight: 800; color: #fff;">${icon} ${f.name}</span>
                                <span class="badge badge-lvl" style="font-size: 9px;">Nv.${cat?.levelReq || 5}</span>
                              </div>
                              <div style="margin-top: 4px; color: ${order ? '#a7f3d0' : '#94a3b8'};">
                                ${order ? `⚙️ <b>Ordem ativa:</b> ${order.name} (${order.daysLeft} dias restantes)` : 'Nenhuma ordem ativa.'}
                              </div>
                            </div>
                          `;
        }).join('')}
                      </div>
                    `;
      })()}
                </div>
              </div>

            </div>
          </div>

          <!-- ==============================================
               COLUNA 3: DEFESAS, CONDIÇÕES & SENTIDOS ROLL20
          =============================================== -->
          <div class="roll20-col-side">
            <!-- SALVAGUARDAS CONTRA A MORTE SE HP <= 0 -->
            ${deathSavesHtml}

            <!-- CONDIÇÕES & STATUS -->
            <div class="roll20-panel">
              <div class="roll20-panel-title">
                <span>CONDIÇÕES & STATUS</span>
                <button type="button" class="btn-micro" onclick="openPlayerCondModal('${p.id}')" title="Adicionar / Remover Condições">➕</button>
              </div>
              <div class="player-conds-chips" style="margin-top: 4px;">
                ${(p.conditions && p.conditions.length > 0) ? p.conditions.map(cId => {
        const condObj = (typeof CONDITIONS_LIST !== 'undefined' ? CONDITIONS_LIST.find(c => c.id === cId) : null) || { name: cId, desc: '' };
        return `<span class="player-cond-chip" onclick="togglePlayerCondition('${p.id}', '${cId}')" title="${escapeAttr(condObj.desc || '')} • Clique para remover">${condObj.name} ✕</span>`;
      }).join('') : '<span style="color: var(--text-dim); font-size: 10px; font-style: italic;">Normal (Sem condições ativas)</span>'}
              </div>
            </div>

            <!-- SENTIDOS PASSIVOS ROLL20 -->
            <div class="roll20-panel" style="margin-top: 10px;">
              <div class="roll20-panel-title">
                <span>SENTIDOS PASSIVOS</span>
              </div>
              <div style="display: flex; flex-direction: column; gap: 4px; font-size: 11px;">
                <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.2); padding: 4px 6px; border-radius: 4px;">
                  <span style="color: #94a3b8;">Percepção Passiva (SAB)</span>
                  <span style="font-weight: 800; color: #fbbf24; font-size: 12px;">${passPerc}</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.2); padding: 4px 6px; border-radius: 4px;">
                  <span style="color: #94a3b8;">Investigação Passiva (INT)</span>
                  <span style="font-weight: 800; color: #38bdf8; font-size: 12px;">${passInv}</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.2); padding: 4px 6px; border-radius: 4px;">
                  <span style="color: #94a3b8;">Intuição Passiva (SAB)</span>
                  <span style="font-weight: 800; color: #a78bfa; font-size: 12px;">${passIns}</span>
                </div>
              </div>
            </div>

            <!-- DEFESAS & IMUNIDADES -->
            <div class="roll20-panel" style="margin-top: 10px;">
              <div class="roll20-panel-title">
                <span>DEFESAS & RESISTÊNCIAS</span>
              </div>
              <div style="font-size: 11px; color: #cbd5e1; line-height: 1.4;">
                ${p.damageResistances ? `<div style="margin-bottom: 2px;">🛡️ <b>Resistências:</b> ${p.damageResistances}</div>` : ''}
                ${p.damageImmunities ? `<div style="margin-bottom: 2px;">✨ <b>Imunidades:</b> ${p.damageImmunities}</div>` : ''}
                ${p.damageVulnerabilities ? `<div style="margin-bottom: 2px;">⚠️ <b>Vulnerabilidades:</b> ${p.damageVulnerabilities}</div>` : ''}
                ${(!p.damageResistances && !p.damageImmunities && !p.damageVulnerabilities) ? '<span style="color: var(--text-dim); font-size: 10px; font-style: italic;">Nenhuma resistência especial cadastrada.</span>' : ''}
              </div>
            </div>

            <!-- BANNER DE CONCENTRAÇÃO ATIVA -->
            ${p.concentrationSpell ? `
              <div class="concentration-banner" style="margin-top: 10px;">
                <div class="concentration-text">
                  <span class="concentration-pulse"></span>
                  <span>Concentrando em: <b>${p.concentrationSpell}</b></span>
                </div>
                <button type="button" class="concentration-stop-btn" onclick="clearPlayerConcentration('${p.id}')" title="Encerrar Concentração">✕</button>
              </div>
            ` : ''}
          </div>

        </div>
      </div>
    `;
  }).join('');

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; padding: 40px 20px; text-align: center; background: rgba(15, 23, 42, 0.6); border: 2px dashed #334155; border-radius: 12px; margin: 16px 0;">
        <div style="font-size: 36px; margin-bottom: 12px;">🛡️</div>
        <div style="font-size: 16px; font-weight: 700; color: #f8fafc; margin-bottom: 8px;">Nenhum personagem cadastrado ou visível</div>
        <div style="font-size: 13px; color: #94a3b8; max-width: 480px; margin: 0 auto 18px; line-height: 1.5;">Não encontramos fichas com o filtro atual. Se você acabou de chegar ou perdeu fichas após uma limpeza do navegador, você pode criar uma nova ou restaurar de um ponto automático de segurança.</div>
        <div style="display: flex; justify-content: center; gap: 12px; flex-wrap: wrap;">
          <button class="btn-primary" onclick="openPlayerModal()" style="font-size: 12px; padding: 8px 16px; cursor: pointer;">➕ Criar Nova Ficha</button>
          <button class="btn-secondary" onclick="openSnapshotsModal()" style="font-size: 12px; padding: 8px 16px; border-color: #3b82f6; color: #60a5fa; cursor: pointer;">🛡️ Recuperar Backup / Snapshot</button>
          <button class="btn-secondary" onclick="importData()" style="font-size: 12px; padding: 8px 16px; border-color: #64748b; color: #cbd5e1; cursor: pointer;">📂 Carregar Arquivo JSON</button>
        </div>
      </div>
    `;
  }

  // ISSUE-138: Atualização reativa do Thumb HUD Vital Mobile
  if (typeof updateMobileVitalThumbHud === 'function') {
    const activeHero = (typeof activePortalPlayerId !== 'undefined' && activePortalPlayerId ? PLAYERS.find(p => p.id === activePortalPlayerId) : null) || filtered[0] || PLAYERS[0];
    updateMobileVitalThumbHud(activeHero);
  }
}

// =========================================================================
// 🖐️ ISSUE-138: EXPERIÊNCIA MOBILE NEXT-GEN (THUMB HUD & HAPTICS)
// =========================================================================

function triggerHapticFeedback(pattern = [15]) {
  if (typeof window !== 'undefined' && 'navigator' in window && typeof navigator.vibrate === 'function') {
    try {
      navigator.vibrate(pattern);
    } catch (e) { }
  }
}

function updateMobileVitalThumbHud(player) {
  if (typeof document === 'undefined') return;
  const hud = document.getElementById('mobile-vital-thumb-hud');
  if (!hud) return;

  const activeHero = player || (typeof activePortalPlayerId !== 'undefined' && activePortalPlayerId ? PLAYERS.find(p => p.id === activePortalPlayerId) : null) || PLAYERS[0];
  if (!activeHero) return;

  // 1. Atualização do Pill de PV
  const hpValEl = document.getElementById('thumb-hud-hp-val');
  const hpIconEl = document.getElementById('thumb-hud-hp-icon');
  const hpPillEl = document.getElementById('thumb-hud-hp');

  const curHp = activeHero.hp !== undefined ? activeHero.hp : (activeHero.currentHp || 0);
  const maxHp = activeHero.maxHp || 1;
  const tempHp = activeHero.tempHp || 0;
  const hpPct = curHp / maxHp;

  if (hpValEl) {
    hpValEl.innerText = `${curHp}/${maxHp} PV${tempHp > 0 ? ` (+${tempHp})` : ''}`;
  }

  if (hpPillEl) {
    hpPillEl.classList.remove('hp-warning', 'hp-danger');
    if (hpPct <= 0.25 || curHp === 0) {
      hpPillEl.classList.add('hp-danger');
      if (hpIconEl) hpIconEl.innerText = '🩸';
    } else if (hpPct <= 0.5) {
      hpPillEl.classList.add('hp-warning');
      if (hpIconEl) hpIconEl.innerText = '💛';
    } else {
      if (hpIconEl) hpIconEl.innerText = '💚';
    }
  }

  // 2. Atualização de Concentração Ativa
  const concChip = document.getElementById('thumb-hud-concentration');
  const concNameEl = document.getElementById('thumb-hud-conc-name');
  if (concChip && concNameEl) {
    if (activeHero.concentrationSpell) {
      concChip.classList.add('active');
      concNameEl.innerText = activeHero.concentrationSpell;
    } else {
      concChip.classList.remove('active');
    }
  }

  // 3. Rótulo do botão de Foco em Combate
  const focusLabelEl = document.getElementById('label-combat-focus');
  if (focusLabelEl) {
    const isFocus = typeof document !== 'undefined' && document.body.classList.contains('combat-focus-mode');
    focusLabelEl.innerText = isFocus ? '📜 Completa' : '⚔️ Foco';
  }
}

function promptPlayerMobileHp() {
  triggerHapticFeedback([20]);
  const activeHero = (typeof activePortalPlayerId !== 'undefined' && activePortalPlayerId ? PLAYERS.find(p => p.id === activePortalPlayerId) : null) || PLAYERS[0];
  if (!activeHero) return;

  // Se houver modal tátil de combate ou de vida, abre com valores táteis
  if (typeof openCombatDamageHealModal === 'function' && typeof state !== 'undefined' && Array.isArray(state.combatants)) {
    const comb = state.combatants.find(c => c.playerId === activeHero.id || c.name === activeHero.name);
    if (comb) {
      openCombatDamageHealModal(comb.id);
      return;
    }
  }

  // Fallback rápido usando modal interativo com haptics
  const deltaStr = prompt(`Vida de ${activeHero.name} (${activeHero.hp}/${activeHero.maxHp} PV)\nDigite dano (-X) ou cura (+X):`, '-5');
  if (deltaStr === null) return;
  const val = parseInt(deltaStr, 10);
  if (!isNaN(val)) {
    if (val < 0) {
      triggerHapticFeedback([25]);
      activeHero.hp = Math.max(0, (activeHero.hp || 0) + val);
    } else {
      triggerHapticFeedback([15, 30]);
      activeHero.hp = Math.min(activeHero.maxHp || 999, (activeHero.hp || 0) + val);
    }
    activeHero.currentHp = activeHero.hp;
    activeHero.updatedAt = Date.now();
    saveToLocalStorage();
    renderPlayers();
    if (typeof executePlayerCloudSave === 'function') executePlayerCloudSave();
    if (typeof showToast === 'function') showToast(`❤️ Vida atualizada para ${activeHero.hp}/${activeHero.maxHp} PV!`, 'success');
  }
}

function breakPlayerConcentration() {
  triggerHapticFeedback([30]);
  const activeHero = (typeof activePortalPlayerId !== 'undefined' && activePortalPlayerId ? PLAYERS.find(p => p.id === activePortalPlayerId) : null) || PLAYERS[0];
  if (!activeHero || !activeHero.concentrationSpell) return;

  const spellName = activeHero.concentrationSpell;
  activeHero.concentrationSpell = null;
  activeHero.updatedAt = Date.now();
  saveToLocalStorage();
  renderPlayers();
  if (typeof executePlayerCloudSave === 'function') executePlayerCloudSave();
  if (typeof showToast === 'function') showToast(`✨ Concentração em '${spellName}' encerrada.`, 'info');
}

function toggleCombatFocusMode() {
  triggerHapticFeedback([20]);
  if (typeof document === 'undefined' || !document.body || !document.body.classList) return;

  let isFocus = false;
  if (typeof document.body.classList.toggle === 'function') {
    isFocus = document.body.classList.toggle('combat-focus-mode');
  } else if (typeof document.body.classList.contains === 'function' && document.body.classList.contains('combat-focus-mode')) {
    if (typeof document.body.classList.remove === 'function') document.body.classList.remove('combat-focus-mode');
    isFocus = false;
  } else {
    if (typeof document.body.classList.add === 'function') document.body.classList.add('combat-focus-mode');
    isFocus = true;
  }

  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('dnd_combat_focus_mode', isFocus ? 'true' : 'false');
    }
  } catch (e) { }

  updateMobileVitalThumbHud();
  if (typeof showToast === 'function') {
    showToast(isFocus ? '⚔️ Modo Foco em Combate ativado!' : '📜 Ficha Completa restaurada.', 'info');
  }
}

function rollDirectD20FromHud() {
  const d20 = Math.floor(Math.random() * 20) + 1;
  if (d20 === 20) {
    triggerHapticFeedback([40, 60, 40]);
    if (typeof showToast === 'function') showToast(`🎲 D20 NATURAL 20! ACERTO CRÍTICO! 🔥`, 'success');
  } else if (d20 === 1) {
    triggerHapticFeedback([60]);
    if (typeof showToast === 'function') showToast(`🎲 D20 Natural 1... Falha Crítica! 💀`, 'error');
  } else {
    triggerHapticFeedback([15]);
    if (typeof showToast === 'function') showToast(`🎲 Rolagem d20: [ ${d20} ]`, 'info');
  }

  if (typeof addCombatLog === 'function') {
    addCombatLog(`🎲 Rolagem Rápida no Mobile: d20 ➔ **${d20}**`);
  }
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
    touchPlayer(p);
    if (typeof playFX === 'function') playFX('spell');
    addLog(`${charge.icon || '⚡'} <b>${p.name}</b> usou <b>${charge.name}</b> (${charge.max - charge.used}/${charge.max} restantes).`);
    addPlayerActionLog(p.id, charge.icon || '⚡', `Usou ${charge.name} (${charge.max - charge.used}/${charge.max})`, 'feature');
    renderPlayers();
    saveToLocalStorage();
    if (typeof syncLocalChangesToFirebase === 'function') syncLocalChangesToFirebase(true);
    if (typeof broadcastStateSync === 'function') broadcastStateSync();
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
    touchPlayer(p);
    addLog(`✨ <b>${p.name}</b> recuperou carga de <b>${charge.name}</b> (${charge.max - charge.used}/${charge.max}).`);
    addPlayerActionLog(p.id, charge.icon || '✨', `Recuperou ${charge.name} (${charge.max - charge.used}/${charge.max})`, 'feature');
    renderPlayers();
    saveToLocalStorage();
    if (typeof syncLocalChangesToFirebase === 'function') syncLocalChangesToFirebase(true);
    if (typeof broadcastStateSync === 'function') broadcastStateSync();
  }
}

function adjustPlayerHp(id, delta) {
  const p = PLAYERS.find(x => x.id === id);
  if (!p) return;

  touchPlayer(p);
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
    if (typeof showToast === 'function') {
      const toastType = p.hp === 0 ? 'error' : (p.hp <= p.maxHp * 0.25 ? 'warning' : 'info');
      showToast(`⚔️ ${p.name}: ${delta} PV (${p.hp}/${p.maxHp})`, toastType);
    }

    // Regra D&D 5E: Teste de Concentração ao sofrer dano (CD = max(10, dano/2))
    if (p.concentrationSpell && dmg > 0 && p.hp > 0) {
      const concDc = Math.max(10, Math.floor(dmg / 2));
      if (typeof triggerConcentrationCheck === 'function') {
        setTimeout(() => triggerConcentrationCheck(p.id, p.concentrationSpell, dmg, concDc), 150);
      }
    }

    if (p.hp === 0) {
      if (p.concentrationSpell) {
        addLog(`🧘 <b>${p.name}</b> perdeu a concentração em <b>${p.concentrationSpell}</b> ao cair inconsciente!`);
        addPlayerActionLog(p.id, '🧘', `Perdeu concentração em ${p.concentrationSpell} (inconsciente)`, 'spell');
        p.concentrationSpell = null;
      }
      if (prev === 0) {
        // Já estava a 0 PV e sofreu dano adicional (Regra oficial D&D 5e: +1 falha no teste da morte)
        p.deathSaves = p.deathSaves || { success: 0, fail: 0 };
        p.deathSaves.fail = Math.min(3, (p.deathSaves.fail || 0) + 1);
        addLog(`💀 <b>${p.name}</b> sofreu dano a 0 PV e recebeu 1 FALHA no teste contra a morte (${p.deathSaves.fail}/3)!`);
        addPlayerActionLog(p.id, '💀', `Sofreu dano a 0 PV: +1 falha no teste contra a morte (${p.deathSaves.fail}/3)`, 'damage');
        if (p.deathSaves.fail >= 3) {
          addLog(`⚰️ <b>${p.name}</b> acumulou 3 falhas de morte e pereceu!`);
          if (typeof playFX === 'function') playFX('fumble');
          if (typeof showToast === 'function') showToast(`⚰️ ${p.name} faleceu!`, 'error');
        }
      } else {
        // Caiu a 0 PV pela primeira vez
        p.deathSaves = { success: 0, fail: 0 };
        addLog(`💀 <b>${p.name}</b> caiu inconsciente a 0 PV!`);
        addPlayerActionLog(p.id, '💀', `Caiu inconsciente a 0 PV!`, 'damage');
        if (typeof playFX === 'function') playFX('fumble');
      }

      // Abre automaticamente o painel de salvaguardas da morte no portal
      if (typeof openDeathSavesModal === 'function') {
        setTimeout(() => openDeathSavesModal(p.id), 250);
      }
    }
  } else {
    p.hp = Math.min(p.maxHp, p.hp + delta);
    // Se estava a 0 PV e recebeu cura, recobra a consciência e zera salvaguardas da morte (Regra oficial D&D 5e)
    if (prev === 0 && p.hp > 0) {
      p.deathSaves = { success: 0, fail: 0 };
      addLog(`✨ <b>${p.name}</b> recobrou a consciência e os testes da morte foram zerados!`);
      addPlayerActionLog(p.id, '✨', `Recobrou a consciência (testes da morte zerados)`, 'heal');
      if (typeof closeDeathSavesModal === 'function') {
        closeDeathSavesModal();
      }
    }
    addLog(`💚 <b>${p.name}</b> recuperou ${delta} PV (${prev} ➔ ${p.hp} PV)`);
    addPlayerActionLog(p.id, '💚', `Recuperou ${delta} PV (${prev} ➔ ${p.hp} PV)`, 'heal');
    if (typeof playFX === 'function') playFX('heal');
    if (typeof showToast === 'function') {
      showToast(`💚 ${p.name}: +${delta} PV (${p.hp}/${p.maxHp})`, 'success');
    }
  }

  const comb = typeof findCombatantForPlayer === 'function'
    ? findCombatantForPlayer(p, typeof state !== 'undefined' && state ? state.combatants : [])
    : (typeof state !== 'undefined' && state && state.combatants ? state.combatants.find(c => (c.playerId && c.playerId === p.id) || c.name.includes(p.name)) : null);
  if (comb) { comb.hp = p.hp; if (typeof renderCombat === 'function') renderCombat(); }

  renderPlayers();

  // Micro-interação cromática tátil (Dano / Cura)
  if (typeof document !== 'undefined') {
    const pulseTarget = document.getElementById(`hp-val-${id}`) || document.getElementById(`player-card-${id}`) || document.querySelector(`.player-hp-box[data-id="${id}"]`);
    if (pulseTarget) {
      const pClass = delta < 0 ? 'damage-pulse' : 'heal-pulse';
      pulseTarget.classList.remove('damage-pulse', 'heal-pulse');
      void pulseTarget.offsetWidth;
      pulseTarget.classList.add(pClass);
      setTimeout(() => pulseTarget.classList.remove(pClass), 800);
    }
  }

  saveToLocalStorage();
  if (typeof syncLocalChangesToFirebase === 'function') syncLocalChangesToFirebase(true);
  if (typeof broadcastStateSync === 'function') broadcastStateSync();
}

function setPlayerTempHp(id) {
  const p = PLAYERS.find(x => x.id === id);
  if (!p) return;
  const val = prompt(`Definir PV Temporários para ${p.name}:`, p.tempHp || 5);
  if (val !== null) {
    p.tempHp = parseInt(val) || 0;
    touchPlayer(p);
    addLog(`🛡️ <b>${p.name}</b> ganhou ${p.tempHp} PV Temporários.`);
    addPlayerActionLog(p.id, '🛡️', `Recebeu ${p.tempHp} PV Temporários`, 'heal');
    renderPlayers();
    saveToLocalStorage();
    if (typeof syncLocalChangesToFirebase === 'function') syncLocalChangesToFirebase(true);
    if (typeof broadcastStateSync === 'function') broadcastStateSync();
  }
}

function adjustPlayerGold(id, amount) {
  const p = PLAYERS.find(x => x.id === id);
  if (!p) return;
  syncPlayerCoinsAndGold(p);
  const newGp = Math.max(0, (p.coins.gp || 0) + amount);
  p.coins.gp = newGp;
  p.gold = newGp;
  touchPlayer(p);
  addLog(`💰 <b>${p.name}</b> ${amount >= 0 ? '+' : ''}${amount} PO (Total: ${p.gold} PO)`);
  addPlayerActionLog(p.id, '💰', `${amount >= 0 ? '+' : ''}${amount} PO (Total: ${p.gold} PO)`, 'gold');
  renderPlayers();
  saveToLocalStorage();
  if (typeof syncLocalChangesToFirebase === 'function') syncLocalChangesToFirebase(true);
  if (typeof broadcastStateSync === 'function') broadcastStateSync();
}

function rollPlayerAttr(id, attrName, customD20) {
  const p = PLAYERS.find(x => x.id === id);
  if (!p) return;

  const attrLabels = { str: 'Força', dex: 'Destreza', con: 'Constituição', int: 'Inteligência', wis: 'Sabedoria', cha: 'Carisma' };
  const label = attrLabels[attrName] || attrName.toUpperCase();

  if (customD20 === undefined && p.diceMode === 'physical') {
    openPhysicalD20Modal({
      playerId: id,
      type: 'attr',
      title: `🎲 Teste de Atributo Físico: ${p.name}`,
      subtitle: `Rolagem de ${label} (d20 real)`,
      attrName: attrName
    });
    return;
  }

  const raw = p[attrName] || 10;
  const mod = Math.floor((raw - 10) / 2);
  const r = (customD20 !== null && customD20 !== undefined) ? parseInt(customD20, 10) : (Math.floor(Math.random() * 20) + 1);
  const total = r + mod;

  const physicalTag = (customD20 !== null && customD20 !== undefined) ? ' 🎲(Mesa)' : '';
  const breakdown = `d20 [${r}${physicalTag}] ${mod >= 0 ? '+' : ''}${mod}`;
  const banner = document.getElementById('dice-banner');
  if (banner) {
    banner.style.display = 'block';
    document.getElementById('dice-total-number').innerText = total;
    document.getElementById('dice-breakdown-text').innerText = `${p.name} - Teste de ${label}: ${breakdown}`;
  }


  if (r === 20) { if (typeof playFX === 'function') playFX('crit'); }
  else if (r === 1) { if (typeof playFX === 'function') playFX('fumble'); }
  else { if (typeof playFX === 'function') playFX('sword'); }

  addLog(`🎲 <b>${p.name}</b> rolou Teste de <b>${label}</b>${physicalTag}: <b>${total}</b> (${breakdown})`);
  addPlayerActionLog(p.id, '🎲', `Teste de ${label}${physicalTag}: Total ${total} (${breakdown})`, 'check');
  renderPlayers();
  return { d20: r, total, mod };
}

function rollPlayerSkill(id, skillKey, mode = 'normal', customD20) {
  const p = PLAYERS.find(x => x.id === id);
  if (!p) return null;
  const skill = (typeof DND5E_SKILLS !== 'undefined' ? DND5E_SKILLS.find(s => s.key === skillKey) : null) || { key: skillKey, name: skillKey, attr: 'str', label: 'FOR' };

  if (customD20 === undefined && p.diceMode === 'physical') {
    openPhysicalD20Modal({
      playerId: id,
      type: 'skill',
      title: `🎯 Perícia Física: ${p.name}`,
      subtitle: `Teste de ${skill.name} (${skill.label || ''})`,
      skillKey: skillKey,
      mode: mode
    });
    return null;
  }

  const attrVal = p[skill.attr] || 10;
  const attrMod = Math.floor((attrVal - 10) / 2);
  const isProf = (p.skillProficiencies || []).includes(skillKey);
  const isExpert = (p.skillExpertises || []).includes(skillKey);
  const prof = getProfBonus(p.level);
  const profMultiplier = isExpert ? (prof * 2) : (isProf ? prof : 0);
  const totalMod = attrMod + profMultiplier;
  const expertTag = isExpert ? ' (Especialista ★★)' : (isProf ? ' (Proficiente ★)' : '');
  const rollLabel = `${p.name} - ${skill.name}${expertTag}`;

  let result;
  if (customD20 !== null && customD20 !== undefined) {
    const d20 = parseInt(customD20, 10);
    const tot = d20 + totalMod;
    const bd = `d20 [${d20} 🎲(Mesa)] ${totalMod >= 0 ? '+' + totalMod : totalMod}`;
    result = { total: tot, breakdown: bd, isCrit: d20 === 20, isFumble: d20 === 1 };
    addLog(`🎯 <b>${p.name}</b> rolou Perícia <b>${skill.name}</b>${expertTag}: <b>${tot}</b> (${bd})`);
  } else if (typeof rollGlobalDice === 'function') {
    result = rollGlobalDice(20, 1, totalMod, mode, rollLabel);
  } else {
    const d20 = Math.floor(Math.random() * 20) + 1;
    const tot = d20 + totalMod;
    const bd = `d20 [${d20}] ${totalMod >= 0 ? '+' + totalMod : totalMod}`;
    result = { total: tot, breakdown: bd, isCrit: d20 === 20, isFumble: d20 === 1 };
    addLog(`🎯 <b>${p.name}</b> rolou Perícia <b>${skill.name}</b>${expertTag}: <b>${tot}</b> (${bd})`);
  }

  addPlayerActionLog(p.id, '🎯', `Perícia ${skill.name}${expertTag}: Total ${result.total} (${result.breakdown || ''})`, 'skill');
  renderPlayers();
  return result;
}

function rollPlayerSavingThrow(id, attrName, mode = 'normal', customD20) {
  const p = PLAYERS.find(x => x.id === id);
  if (!p) return null;
  const attrLabels = { str: 'Força', dex: 'Destreza', con: 'Constituição', int: 'Inteligência', wis: 'Sabedoria', cha: 'Carisma' };
  const label = attrLabels[attrName] || attrName.toUpperCase();

  if (customD20 === undefined && p.diceMode === 'physical') {
    openPhysicalD20Modal({
      playerId: id,
      type: 'save',
      title: `🛡️ Salvaguarda Física: ${p.name}`,
      subtitle: `Teste de Resistência de ${label}`,
      attrName: attrName,
      mode: mode
    });
    return null;
  }

  const attrVal = p[attrName] || 10;
  const attrMod = Math.floor((attrVal - 10) / 2);
  const isProf = (p.saveProficiencies || []).includes(attrName);
  const prof = getProfBonus(p.level);
  const totalMod = attrMod + (isProf ? prof : 0);
  const rollLabel = `${p.name} - Salvaguarda de ${label}`;

  let result;
  if (customD20 !== null && customD20 !== undefined) {
    const d20 = parseInt(customD20, 10);
    const tot = d20 + totalMod;
    const bd = `d20 [${d20} 🎲(Mesa)] ${totalMod >= 0 ? '+' + totalMod : totalMod}`;
    result = { total: tot, breakdown: bd, isCrit: d20 === 20, isFumble: d20 === 1 };
    addLog(`🛡️ <b>${p.name}</b> rolou Salvaguarda de <b>${label}</b>: <b>${tot}</b> (${bd})`);
  } else if (typeof rollGlobalDice === 'function') {
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
  p.skillExpertises = p.skillExpertises || [];
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
  p.skillProficiencies = p.skillProficiencies || [];
  p.skillExpertises = p.skillExpertises || [];

  const countersEl = document.getElementById('skills-modal-counters');
  if (countersEl) {
    const norm = (p.className || '').toLowerCase();
    const isRogue = norm.includes('ladino') || norm.includes('rogue');
    const isBard = norm.includes('bardo') || norm.includes('bard');
    let recExpertise = isRogue ? (p.level >= 6 ? '4' : '2') : (isBard ? (p.level >= 10 ? '4' : (p.level >= 3 ? '2' : '0')) : null);
    let note = `Proficiências: ${p.skillProficiencies.length} • Especializações: ${p.skillExpertises.length}`;
    if (recExpertise) note += ` (Sugerido para ${p.className}: ${recExpertise})`;
    countersEl.innerText = note;
  }

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
          <div style="flex:1; min-width:0;">
            <div style="font-weight:700; font-size:11.5px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${a.name}</div>
            <div style="font-size:9.5px; color:var(--text-muted);">${mod >= 0 ? '+' + mod : mod} ${isProf ? `(+${prof})` : ''}</div>
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
      const isProf = p.skillProficiencies.includes(s.key);
      const isExpert = p.skillExpertises.includes(s.key);
      const mod = Math.floor(((p[s.attr] || 10) - 10) / 2);
      const profVal = isExpert ? (prof * 2) : (isProf ? prof : 0);
      const totalMod = mod + profVal;
      const modStr = totalMod >= 0 ? `+${totalMod}` : `${totalMod}`;
      return `
        <div class="skill-modal-chip ${isExpert ? 'expert' : (isProf ? 'active' : '')}" onclick="togglePlayerSkillProf('${p.id}', '${s.key}')">
          <input type="checkbox" ${isProf || isExpert ? 'checked' : ''} onclick="event.stopPropagation(); togglePlayerSkillProf('${p.id}', '${s.key}')">
          <div style="flex:1; min-width:0;">
            <div style="font-weight:700; font-size:11.5px; display:flex; align-items:center; gap:4px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
              <span>${s.name}</span>
              <span style="font-size:10px; color:var(--primary-light); font-weight:normal;">(${s.label})</span>
            </div>
            <div style="font-size:9.5px; color:var(--text-muted); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
              ${isExpert ? `🌟 Especialista (+${prof * 2})` : (isProf ? `★ Proficiente (+${prof})` : `Base (${mod >= 0 ? '+' + mod : mod})`)}
            </div>
          </div>
          <button class="btn-expert-toggle ${isExpert ? 'active' : ''}" onclick="togglePlayerSkillExpertise('${p.id}', '${s.key}', event)" title="Alternar Especialização / Expertise (Dobra bônus de proficiência)">
            ${isExpert ? '★★ Perito' : '🌟 Exp'}
          </button>
          <span class="skill-mod-badge ${isExpert ? 'expert' : (isProf ? 'prof' : '')}">${modStr}</span>
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
  if (typeof touchPlayer === 'function') touchPlayer(p);
  renderSkillsModalContent();
  renderPlayers();
  saveToLocalStorage();
  if (typeof syncLocalChangesToFirebase === 'function') syncLocalChangesToFirebase();
}

function togglePlayerSkillProf(id, skillKey) {
  const p = PLAYERS.find(x => x.id === id);
  if (!p) return;
  p.skillProficiencies = p.skillProficiencies || [];
  p.skillExpertises = p.skillExpertises || [];

  if (p.skillProficiencies.includes(skillKey)) {
    p.skillProficiencies = p.skillProficiencies.filter(x => x !== skillKey);
    p.skillExpertises = p.skillExpertises.filter(x => x !== skillKey);
  } else {
    p.skillProficiencies.push(skillKey);
  }
  if (typeof touchPlayer === 'function') touchPlayer(p);
  renderSkillsModalContent();
  renderPlayers();
  saveToLocalStorage();
  if (typeof syncLocalChangesToFirebase === 'function') syncLocalChangesToFirebase();
}

function togglePlayerSkillExpertise(id, skillKey, e) {
  if (e) e.stopPropagation();
  const p = PLAYERS.find(x => x.id === id);
  if (!p) return;
  p.skillProficiencies = p.skillProficiencies || [];
  p.skillExpertises = p.skillExpertises || [];

  if (p.skillExpertises.includes(skillKey)) {
    p.skillExpertises = p.skillExpertises.filter(x => x !== skillKey);
  } else {
    if (!p.skillProficiencies.includes(skillKey)) {
      p.skillProficiencies.push(skillKey);
    }
    p.skillExpertises.push(skillKey);
    if (typeof playFX === 'function') playFX('crit');
  }
  if (typeof touchPlayer === 'function') touchPlayer(p);
  renderSkillsModalContent();
  renderPlayers();
  saveToLocalStorage();
  if (typeof syncLocalChangesToFirebase === 'function') syncLocalChangesToFirebase();
}

function closePlayerSkillsModal() {
  const modal = document.getElementById('modal-player-skills');
  if (modal) modal.classList.remove('open');
  activeSkillsModalPlayerId = null;
}


// ===================================================
// ⚔️ MOTOR DE ARMAS E ATAQUES AUTOMÁTICOS (D&D BEYOND)
// ===================================================

function isWeaponProficient(player, weapon) {
  if (!player || !weapon) return true;
  const cls = (player.className || '').toLowerCase();
  const cat = (weapon.category || '').toLowerCase();
  const wName = (weapon.name || '').toLowerCase();

  // Bárbaro, Guerreiro, Paladino, Patrulheiro: proficiência com todas as armas simples e marciais
  if (cls.includes('guerreiro') || cls.includes('fighter') ||
    cls.includes('barbaro') || cls.includes('bárbaro') || cls.includes('barbarian') ||
    cls.includes('paladino') || cls.includes('paladin') ||
    cls.includes('patrulheiro') || cls.includes('ranger')) {
    return true;
  }

  const isSimple = cat.includes('simples') || cat.includes('simple');
  const isMartial = cat.includes('marciais') || cat.includes('martial');

  // Ladino e Bardo: Armas simples + Espada Curta, Espada Longa, Rapieira, Besta de Mão
  if (cls.includes('ladino') || cls.includes('rogue') || cls.includes('bardo') || cls.includes('bard')) {
    if (isSimple) return true;
    if (wName.includes('espada curta') || wName.includes('espada longa') || wName.includes('rapieira') || wName.includes('besta de mão') || wName.includes('besta de mao')) {
      return true;
    }
    return false;
  }

  // Clérigo: Armas simples (e marciais se subclasse Guerra/Tempestade)
  if (cls.includes('clerigo') || cls.includes('clérigo') || cls.includes('cleric')) {
    const sub = (player.subclass || '').toLowerCase();
    if (sub.includes('guerra') || sub.includes('tempestade') || sub.includes('war') || sub.includes('tempest')) return true;
    return isSimple;
  }

  // Monge: Armas simples e Espada Curta
  if (cls.includes('monge') || cls.includes('monk')) {
    if (isSimple) return true;
    if (wName.includes('espada curta')) return true;
    return false;
  }

  // Druida: Clava, Adaga, Dardo, Azagaia, Maça, Bordão, Cimitarra, Foice, Funda, Lança
  if (cls.includes('druida') || cls.includes('druid')) {
    const druidWeapons = ['clava', 'adaga', 'dardo', 'azagaia', 'maca', 'maça', 'bordao', 'bordão', 'cimitarra', 'foice', 'funda', 'lanca', 'lança'];
    return druidWeapons.some(dw => wName.includes(dw));
  }

  // Mago e Feiticeiro: Adaga, Dardo, Funda, Bordão, Besta Leve
  if (cls.includes('mago') || cls.includes('wizard') || cls.includes('feiticeiro') || cls.includes('sorcerer')) {
    const wizWeapons = ['adaga', 'dardo', 'funda', 'bordao', 'bordão', 'besta leve'];
    return wizWeapons.some(ww => wName.includes(ww));
  }

  // Bruxo: Armas simples (e marciais se Pacto da Lâmina / Hexblade)
  if (cls.includes('bruxo') || cls.includes('warlock')) {
    const sub = (player.subclass || '').toLowerCase();
    const feats = (player.features || '').toLowerCase();
    if (sub.includes('lâmina') || sub.includes('lamina') || sub.includes('hexblade') || feats.includes('pacto da lâmina') || feats.includes('pacto da lamina')) return true;
    return isSimple;
  }

  return isSimple;
}

function calculateWeaponAttackStats(player, weaponOrName) {
  if (!player) return null;
  let weapon = null;

  if (typeof weaponOrName === 'string') {
    const term = weaponOrName.toLowerCase().trim();
    if (typeof EQUIPMENT_DATA !== 'undefined' && Array.isArray(EQUIPMENT_DATA)) {
      weapon = EQUIPMENT_DATA.find(w => w.name.toLowerCase().includes(term) || term.includes(w.name.split('(')[0].toLowerCase().trim()));
    }
    if (!weapon) {
      weapon = {
        name: weaponOrName,
        category: 'Armas Simples',
        damage: '1d6 cortante',
        prop: ''
      };
    }
  } else if (typeof weaponOrName === 'object') {
    weapon = weaponOrName;
  }

  if (!weapon) return null;

  const prop = (weapon.prop || '').toLowerCase();
  const cat = (weapon.category || '').toLowerCase();
  const wName = (weapon.name || '').toLowerCase();

  const isFinesse = prop.includes('acuidade') || prop.includes('finesse');
  const isRanged = prop.includes('distância') || prop.includes('distancia') || prop.includes('munição') || prop.includes('municao') || cat.includes('distância') || cat.includes('distancia');
  const isThrown = prop.includes('arremesso');

  const str = typeof getPlayerAttr === 'function' ? getPlayerAttr(player, 'str') : (player.str || 10);
  const dex = typeof getPlayerAttr === 'function' ? getPlayerAttr(player, 'dex') : (player.dex || 10);
  const strMod = Math.floor((str - 10) / 2);
  const dexMod = Math.floor((dex - 10) / 2);

  let keyAttr = 'str';
  let attrMod = strMod;

  if (isRanged && !isThrown) {
    keyAttr = 'dex';
    attrMod = dexMod;
  } else if (isFinesse) {
    if (dexMod > strMod) {
      keyAttr = 'dex';
      attrMod = dexMod;
    } else {
      keyAttr = 'str';
      attrMod = strMod;
    }
  } else if (isThrown) {
    if (isFinesse && dexMod > strMod) {
      keyAttr = 'dex';
      attrMod = dexMod;
    } else {
      keyAttr = 'str';
      attrMod = strMod;
    }
  }

  // Monge: artes marciais permitem usar Destreza em armas de monge
  const cls = (player.className || '').toLowerCase();
  if (cls.includes('monge') && dexMod > strMod) {
    const isHeavyOrTwoHanded = prop.includes('pesada') || (prop.includes('duas mãos') && !prop.includes('versátil'));
    if (!isHeavyOrTwoHanded) {
      keyAttr = 'dex';
      attrMod = dexMod;
    }
  }

  // Bônus de estilo de luta (ex: Arquearia dá +2 no ataque à distância)
  let extraHitBonus = 0;
  let extraDmgBonus = 0;
  const fStyle = (player.fightingStyle || '').toLowerCase();
  if (fStyle.includes('archery') || fStyle.includes('arquearia')) {
    if (isRanged) extraHitBonus += 2;
  }
  if (fStyle.includes('dueling') || fStyle.includes('duelo')) {
    if (!isRanged && !prop.includes('duas mãos')) extraDmgBonus += 2;
  }
  if (fStyle.includes('thrown') || fStyle.includes('arremessador')) {
    if (isThrown) extraDmgBonus += 2;
  }

  const prof = isWeaponProficient(player, weapon);
  const pb = typeof getProfBonus === 'function' ? getProfBonus(player.level || 1) : 2;
  const hitBonus = attrMod + (prof ? pb : 0) + extraHitBonus;

  // Extrai dado e tipo de dano
  const rawDmg = weapon.damage || '1d6 cortante';
  const dmgMatch = rawDmg.match(/(\d+d\d+)/i);
  const die = dmgMatch ? dmgMatch[1] : '1d6';

  let dmgType = '';
  if (rawDmg.toLowerCase().includes('cortante')) dmgType = 'cortante';
  else if (rawDmg.toLowerCase().includes('perfurante')) dmgType = 'perfurante';
  else if (rawDmg.toLowerCase().includes('contundente') || rawDmg.toLowerCase().includes('concussão') || rawDmg.toLowerCase().includes('concussao')) dmgType = 'contundente';

  const totalDmgMod = attrMod + extraDmgBonus;
  const dmgFormula = `${die}${totalDmgMod !== 0 ? (totalDmgMod > 0 ? '+' + totalDmgMod : totalDmgMod) : ''}`;
  const hitStr = hitBonus >= 0 ? `+${hitBonus}` : `${hitBonus}`;

  // ISSUE-168: Suporte para armas Versáteis (1 mão vs 2 mãos)
  const isVersatile = prop.includes('versátil') || prop.includes('versatile');
  let versatileDie = null;
  let versatileDamageFormula = null;
  let versatileText = null;
  let rawVersatileAttackText = null;
  if (isVersatile) {
    const vMatch = prop.match(/vers[áa]til\s*\(([^)]+)\)/i);
    versatileDie = vMatch ? vMatch[1].trim() : (die === '1d8' ? '1d10' : (die === '1d6' ? '1d8' : null));
    if (versatileDie) {
      versatileDamageFormula = `${versatileDie}${totalDmgMod !== 0 ? (totalDmgMod > 0 ? '+' + totalDmgMod : totalDmgMod) : ''}`;
      versatileText = `${versatileDamageFormula}${dmgType ? ' ' + dmgType : ''}`;
      rawVersatileAttackText = `${weapon.name.split('(')[0].trim()} (${hitStr}) ${versatileText}`;
    }
  }

  const simpleName = weapon.name.split('(')[0].trim();
  const fullAttackStr = `${simpleName} (${hitStr}, ${dmgFormula}${dmgType ? ' ' + dmgType : ''})`;

  return {
    name: simpleName,
    fullName: weapon.name,
    keyAttr,
    attrMod,
    isProficient: prof,
    pb,
    hit: hitBonus,
    hitBonus,
    hitStr,
    damageDie: die,
    damageMod: totalDmgMod,
    damageType: dmgType,
    damageFormula: dmgFormula,
    damageText: `${dmgFormula}${dmgType ? ' ' + dmgType : ''}`,
    isVersatile: Boolean(isVersatile && versatileDamageFormula),
    versatileDie,
    versatileDamageFormula,
    versatileText,
    rawVersatileAttackText,
    isRanged,
    attackBonus: hitBonus,
    chosenAttr: keyAttr,
    formattedText: fullAttackStr,
    properties: weapon.prop || ''
  };
}

// ===================================================
// 🛡️ BÔNUS DE PV POR SUBCLASSE, RAÇA E ORIGEM
// ===================================================

function getPlayerBonusHpPerLevel(player, className) {
  if (!player) return { bonus: 0, reason: '', valueOf() { return 0; } };
  let bonus = 0;
  const reasons = [];

  const race = (player.race || '').toLowerCase();
  const sub = (player.subclass || player.subclassName || '').toLowerCase();
  const cls = (className || player.className || '').toLowerCase();
  const features = Array.isArray(player.features)
    ? player.features.join(' ').toLowerCase()
    : String(player.features || '').toLowerCase();

  // 1. Anão da Colina (Hill Dwarf) - Tenacidade Anã: +1 PV por nível do personagem
  if (race.includes('colina') || race.includes('hill') || features.includes('tenacidade anã') || features.includes('tenacidade ana')) {
    bonus += 1;
    reasons.push('Anão da Colina');
  }

  // 2. Feiticeiro da Linhagem Dracônica - Resiliência Dracônica: +1 PV por nível de Feiticeiro
  const isDraconicSorcerer = (cls.includes('feiticeiro') || cls.includes('sorcerer')) &&
    (sub.includes('drac') || (player.subclassIdx === 0 && (cls.includes('feiticeiro') || cls.includes('sorcerer'))) || features.includes('resiliência dracônica') || features.includes('resiliencia draconica') || features.includes('linhagem dracônica') || features.includes('linhagem draconica'));
  if (isDraconicSorcerer) {
    bonus += 1;
    reasons.push('Linhagem Dracônica');
  }

  // 3. Talento Robusto (Tough Feat): +2 PV por nível
  const hasRobusto = features.includes('robusto') || features.includes('robustez') || features.includes('tough') || (player.feats && player.feats.some(f => (typeof f === 'string' ? f.toLowerCase().includes('robust') || f.toLowerCase().includes('tough') : f.id === 'robusto' || (f.name && f.name.toLowerCase().includes('robust')))));
  if (hasRobusto) {
    bonus += 2;
    reasons.push('Talento Robusto');
  }

  return {
    bonus: bonus,
    reason: reasons.join(', '),
    valueOf() { return this.bonus; },
    toString() { return String(this.bonus); }
  };
}

function calculateRecommendedMaxHp(player) {
  if (!player) return 10;
  const cls = (player.className || 'Guerreiro').split('/')[0].trim();
  const hitDieStr = typeof getHitDieForClass === 'function' ? getHitDieForClass(cls) : '1d10';
  const dieSides = typeof getHitDieSides === 'function' ? getHitDieSides(hitDieStr) : (parseInt(hitDieStr.replace('d', '')) || 10);
  const conMod = Math.floor(((player.con || 10) - 10) / 2);
  const lvl = Math.max(1, parseInt(player.level, 10) || 1);
  const hpBonusObj = getPlayerBonusHpPerLevel(player, cls);
  const bonusHpPerLevel = typeof hpBonusObj === 'object' ? (hpBonusObj.bonus || 0) : (Number(hpBonusObj) || 0);

  // Nível 1: Dado cheio + CON + Bônus
  let total = dieSides + conMod + bonusHpPerLevel;

  // Níveis 2 a N: Média fixa (dieSides / 2 + 1) + CON + Bônus
  if (lvl > 1) {
    const avgPerLvl = Math.max(1, Math.floor(dieSides / 2) + 1 + conMod + bonusHpPerLevel);
    total += avgPerLvl * (lvl - 1);
  }

  return Math.max(1, total);
}

// ===================================================
// 🗡️ MODAL E CONTROLES DO SELETOR DE ARMAS D&D BEYOND
// ===================================================

let activeWeaponPickerPlayerId = null;
let activeWeaponPickerTarget = 'player'; // 'player' (adiciona direto na ficha) ou 'modal' (adiciona no input #pm-attacks)

function openWeaponPickerModal(playerId = null, target = 'player') {
  activeWeaponPickerTarget = target;
  if (playerId) {
    activeWeaponPickerPlayerId = playerId;
  } else if (!activeWeaponPickerPlayerId && typeof PLAYERS !== 'undefined' && PLAYERS.length > 0) {
    activeWeaponPickerPlayerId = PLAYERS[0].id;
  }

  const modal = document.getElementById('modal-weapon-picker');
  if (!modal) return;

  const p = target === 'modal'
    ? (typeof getModalSimulatedPlayer === 'function' ? getModalSimulatedPlayer() : null)
    : (PLAYERS ? PLAYERS.find(x => x.id === activeWeaponPickerPlayerId) : null);
  const heroInfo = document.getElementById('weapon-picker-hero-info');
  const subTitle = document.getElementById('weapon-picker-subtitle');

  if (p) {
    const pb = typeof getProfBonus === 'function' ? getProfBonus(p.level || 1) : 2;
    const strMod = Math.floor(((p.str || 10) - 10) / 2);
    const dexMod = Math.floor(((p.dex || 10) - 10) / 2);
    if (subTitle) subTitle.innerText = `Calculando estatísticas para ${p.name || 'Personagem'} (${p.className} Nv ${p.level || 1})`;
    if (heroInfo) {
      heroInfo.innerHTML = `
        👤 <b>${p.name || 'Personagem'}</b> • FOR: ${p.str || 10} (${strMod >= 0 ? '+' : ''}${strMod}) | DES: ${p.dex || 10} (${dexMod >= 0 ? '+' : ''}${dexMod}) | Bônus de Proficiência: <b>+${pb}</b>
      `;
    }
  }

  renderWeaponPickerList('', '');
  modal.classList.add('open');
}

function closeWeaponPickerModal() {
  const modal = document.getElementById('modal-weapon-picker');
  if (modal) modal.classList.remove('open');
}

function handleWeaponSearchInput(val) {
  const catSel = document.getElementById('sel-weapon-cat');
  const cat = catSel ? catSel.value : '';
  renderWeaponPickerList(val, cat);
}

function handleWeaponCategoryChange(cat) {
  const inp = document.getElementById('inp-weapon-search');
  const term = inp ? inp.value : '';
  renderWeaponPickerList(term, cat);
}

function renderWeaponPickerList(filterText = '', categoryFilter = '') {
  const listEl = document.getElementById('weapon-picker-list');
  if (!listEl) return;

  if (typeof EQUIPMENT_DATA === 'undefined' || !Array.isArray(EQUIPMENT_DATA)) {
    listEl.innerHTML = '<div style="color:var(--text-muted); padding:10px;">Catálogo de equipamentos não carregado.</div>';
    return;
  }

  const p = activeWeaponPickerTarget === 'modal'
    ? (typeof getModalSimulatedPlayer === 'function' ? getModalSimulatedPlayer() : null)
    : (PLAYERS ? PLAYERS.find(x => x.id === activeWeaponPickerPlayerId) : null);
  const normFilter = (filterText || '').toLowerCase().trim();
  const normCat = (categoryFilter || '').toLowerCase().trim();

  const weapons = EQUIPMENT_DATA.filter(item => {
    const cat = (item.category || '').toLowerCase();
    if (!cat.includes('armas')) return false;
    if (normCat && !cat.includes(normCat)) return false;
    if (normFilter) {
      const matchName = item.name.toLowerCase().includes(normFilter);
      const matchProp = (item.prop || '').toLowerCase().includes(normFilter);
      if (!matchName && !matchProp) return false;
    }
    return true;
  });

  if (weapons.length === 0) {
    listEl.innerHTML = '<div style="color:var(--text-muted); padding:20px; text-align:center; grid-column:1/-1;">Nenhuma arma encontrada com os filtros informados.</div>';
    return;
  }

  listEl.innerHTML = weapons.map(w => {
    const stats = p ? calculateWeaponAttackStats(p, w) : null;
    const isProf = stats ? stats.isProficient : false;
    const hitLabel = stats ? stats.hitStr : '+0';
    const dmgLabel = stats ? `${stats.damageFormula} ${stats.damageType}` : w.damage;
    const attrLabel = stats ? (stats.keyAttr === 'dex' ? 'DES' : 'FOR') : 'FOR';

    return `
      <div class="weapon-card-item ${isProf ? 'proficient' : 'non-proficient'}" onclick="selectWeaponForPlayer('${w.name.replace(/'/g, "\\'")}')">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 6px;">
          <div>
            <div style="font-weight: 800; font-size: 13px; color: #fff;">${w.name}</div>
            <div style="font-size: 10px; color: var(--text-dim);">${w.category} • ${w.cost}</div>
          </div>
          <span style="font-size: 10px; padding: 2px 6px; border-radius: 4px; font-weight: 700; background: ${isProf ? 'rgba(16,185,129,0.2); color:#34d399;' : 'rgba(148,163,184,0.15); color:#94a3b8;'}">
            ${isProf ? '✓ Proficiente' : 'Sem Profic.'}
          </span>
        </div>

        <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-top: 2px;">
          <span class="weapon-calc-badge" title="Bônus de Acerto (${attrLabel} ${stats ? (stats.attrMod >= 0 ? '+' + stats.attrMod : stats.attrMod) : ''} ${isProf ? '+ PB ' + (stats ? stats.pb : 2) : ''})">
            🎯 Acerto: <b>${hitLabel}</b>
          </span>
          <span class="weapon-calc-badge" style="background: rgba(245,158,11,0.15); color: var(--accent-gold); border-color: rgba(245,158,11,0.3);">
            💥 Dano: <b>${dmgLabel}</b>
          </span>
        </div>

        ${w.prop ? `<div style="font-size: 10px; color: var(--text-muted); line-height: 1.3;">${w.prop}</div>` : ''}

        <button class="btn-action" style="padding: 4px 8px; font-size: 11px; margin-top: 4px; width: 100%;" onclick="event.stopPropagation(); selectWeaponForPlayer('${w.name.replace(/'/g, "\\'")}')">
          ➕ Adicionar ao Arsenal
        </button>
      </div>
    `;
  }).join('');
}

function selectWeaponForPlayer(weaponName) {
  const target = (typeof activeWeaponPickerTarget !== 'undefined' && activeWeaponPickerTarget) ? activeWeaponPickerTarget : 'player';
  if (target === 'modal') {
    if (typeof addModalWeapon === 'function') {
      addModalWeapon(weaponName);
    }
    if (typeof closeWeaponPickerModal === 'function') closeWeaponPickerModal();
    return;
  }

  const targetPlayerId = (typeof activeWeaponPickerPlayerId !== 'undefined' && activeWeaponPickerPlayerId) ? activeWeaponPickerPlayerId : (typeof PLAYERS !== 'undefined' && PLAYERS && PLAYERS[0] ? PLAYERS[0].id : null);
  const p = (typeof PLAYERS !== 'undefined' && PLAYERS) ? PLAYERS.find(x => x.id === targetPlayerId) : null;
  if (!p) return;

  const weaponObj = typeof EQUIPMENT_DATA !== 'undefined'
    ? EQUIPMENT_DATA.find(w => w.name.toLowerCase() === weaponName.toLowerCase() || w.name.toLowerCase().includes(weaponName.toLowerCase()))
    : { name: weaponName, damage: '1d6 cortante', category: 'Armas Simples', prop: '' };

  const stats = p ? calculateWeaponAttackStats(p, weaponObj || weaponName) : null;
  const attackText = stats ? stats.formattedText : `${weaponName} (+0, 1d6)`;

  // 1. Atualiza p.attacks
  const current = (p.attacks || '').trim();
  p.attacks = current ? `${current} | ${attackText}` : attackText;

  // 2. Sincroniza imediatamente com o Inventário do herói
  p.inventory = Array.isArray(p.inventory) ? p.inventory : [];
  const normW = (weaponName || '').toLowerCase().trim();
  const wBase = normW.split('(')[0].trim();
  const existingInInv = p.inventory.find(it => {
    const itNorm = (it.name || '').toLowerCase().trim();
    const itBase = itNorm.split('(')[0].trim();
    return itNorm === normW || itBase === wBase || itNorm.includes(wBase) || wBase.includes(itBase);
  });
  if (existingInInv) {
    existingInInv.equipped = true;
  } else {
    p.inventory.push({
      id: 'item_wpn_' + Date.now(),
      name: weaponObj && weaponObj.name ? weaponObj.name : weaponName,
      category: 'Armas',
      qty: 1,
      weight: weaponObj && weaponObj.weight ? weaponObj.weight : 2,
      cost: weaponObj && weaponObj.cost ? weaponObj.cost : '10 PO',
      equipped: true
    });
  }

  if (typeof touchPlayer === 'function') touchPlayer(p);
  if (typeof renderPlayers === 'function') renderPlayers();
  if (typeof saveToLocalStorage === 'function') saveToLocalStorage();
  if (typeof syncLocalChangesToFirebase === 'function') syncLocalChangesToFirebase(true);
  if (typeof broadcastStateSync === 'function') broadcastStateSync();

  if (typeof showToast === 'function') {
    showToast(`⚔️ ${stats ? stats.name : weaponName} equipada e adicionada ao inventário de ${p.name}! (Acerto: ${stats ? stats.hitStr : '+0'} | Dano: ${stats ? stats.damageFormula : '1d6'})`, 'success');
  }
  if (typeof playFX === 'function') playFX('sword');

  if (typeof closeWeaponPickerModal === 'function') closeWeaponPickerModal();
}

function equipBackpackItemAsAttack(playerId, itemIdx) {
  const p = PLAYERS ? PLAYERS.find(x => x.id === playerId) : null;
  if (!p || !p.inventory || !p.inventory[itemIdx]) return;

  const item = p.inventory[itemIdx];
  item.equipped = true;
  const stats = calculateWeaponAttackStats(p, item);
  if (!stats) return;

  const current = (p.attacks || '').trim();
  if (!current.includes(stats.name)) {
    p.attacks = current ? `${current} | ${stats.formattedText}` : stats.formattedText;
  }

  if (typeof touchPlayer === 'function') touchPlayer(p);
  renderPlayers();
  saveToLocalStorage();
  if (typeof syncLocalChangesToFirebase === 'function') syncLocalChangesToFirebase(true);
  if (typeof broadcastStateSync === 'function') broadcastStateSync();

  if (typeof showToast === 'function') {
    showToast(`🗡️ ${stats.name} equipada como ataque ativo de ${p.name}! (${stats.hitStr}, ${stats.damageFormula})`, 'success');
  }
  if (typeof playFX === 'function') playFX('sword');
}


function openAttackAdvantageMenu(event, playerId, rawAttackText, isVersatile = false) {
  if (event) {
    if (typeof event.preventDefault === 'function') event.preventDefault();
    if (typeof event.stopPropagation === 'function') event.stopPropagation();
  }
  const existing = document.getElementById('roll20-adv-menu-floater');
  if (existing) existing.remove();

  const menu = document.createElement('div');
  menu.id = 'roll20-adv-menu-floater';
  menu.className = 'roll20-adv-menu';

  const x = event ? (event.clientX || event.pageX || 100) : 100;
  const y = event ? (event.clientY || event.pageY || 100) : 100;
  const winW = typeof window !== 'undefined' ? window.innerWidth : 800;
  const winH = typeof window !== 'undefined' ? window.innerHeight : 600;
  menu.style.left = `${Math.min(winW - 170, Math.max(10, x - 20))}px`;
  menu.style.top = `${Math.min(winH - 150, Math.max(10, y + 10))}px`;

  menu.innerHTML = `
    <button type="button" class="roll20-adv-item" onclick="rollPlayerAttack('${playerId}', '${escapeAttr(rawAttackText)}', null, 'normal', ${isVersatile ? 'true' : 'false'}); closeAttackAdvantageMenu();">
      🎲 Rolagem Normal
    </button>
    <button type="button" class="roll20-adv-item adv-item-adv" onclick="rollPlayerAttack('${playerId}', '${escapeAttr(rawAttackText)}', null, 'adv', ${isVersatile ? 'true' : 'false'}); closeAttackAdvantageMenu();">
      🟢 Com Vantagem (2d20)
    </button>
    <button type="button" class="roll20-adv-item adv-item-dis" onclick="rollPlayerAttack('${playerId}', '${escapeAttr(rawAttackText)}', null, 'dis', ${isVersatile ? 'true' : 'false'}); closeAttackAdvantageMenu();">
      🔴 Com Desvantagem (2d20)
    </button>
  `;

  if (typeof document !== 'undefined' && document.body) {
    document.body.appendChild(menu);
    const closeHandler = (e) => {
      if (!menu.contains(e.target)) {
        closeAttackAdvantageMenu();
        document.removeEventListener('click', closeHandler);
      }
    };
    setTimeout(() => document.addEventListener('click', closeHandler), 50);
  }
}

function closeAttackAdvantageMenu() {
  if (typeof document !== 'undefined') {
    const m = document.getElementById('roll20-adv-menu-floater');
    if (m) m.remove();
  }
}

function rollPlayerAttack(id, rawAttackText, customD20, rollMode = 'normal', isVersatile = false) {
  const p = PLAYERS.find(x => x.id === id);
  if (!p) return;

  if (customD20 === undefined && p.diceMode === 'physical') {
    openPhysicalD20Modal({
      playerId: id,
      type: 'attack',
      title: `⚔️ Ataque Físico: ${p.name}`,
      subtitle: `Rolagem de ataque: ${rawAttackText}`,
      rawAttackText: rawAttackText
    });
    return;
  }

  const hitMatch = rawAttackText.match(/([+-]\d+)/);
  const dmgMatch = rawAttackText.match(/(\d+d\d+(?:\s*[+-]\s*\d+)?)/i);

  const hitBonus = hitMatch ? parseInt(hitMatch[1], 10) : Math.floor(((p.str || 10) - 10) / 2) + getProfBonus(p.level || 1);

  let d20 = 10;
  let d20_1 = 10;
  let d20_2 = 10;
  let hitModeTag = '';

  if (customD20 !== null && customD20 !== undefined) {
    d20 = parseInt(customD20, 10);
  } else if (rollMode === 'adv') {
    d20_1 = Math.floor(Math.random() * 20) + 1;
    d20_2 = Math.floor(Math.random() * 20) + 1;
    d20 = Math.max(d20_1, d20_2);
    hitModeTag = ` [Vantagem: ${d20_1}, ${d20_2} ➔ ${d20}]`;
  } else if (rollMode === 'dis') {
    d20_1 = Math.floor(Math.random() * 20) + 1;
    d20_2 = Math.floor(Math.random() * 20) + 1;
    d20 = Math.min(d20_1, d20_2);
    hitModeTag = ` [Desvantagem: ${d20_1}, ${d20_2} ➔ ${d20}]`;
  } else {
    d20 = Math.floor(Math.random() * 20) + 1;
    hitModeTag = ` [${d20}]`;
  }

  const totalHit = d20 + hitBonus;
  let isCrit = d20 === 20;
  let isFumble = d20 === 1;

  // Dano: se versátil, ajusta dado para 2 mãos
  let dmgFormula = dmgMatch ? dmgMatch[1].replace(/\s+/g, '') : '1d8+3';
  if (isVersatile) {
    if (dmgFormula.startsWith('1d8')) dmgFormula = dmgFormula.replace('1d8', '1d10');
    else if (dmgFormula.startsWith('1d6')) dmgFormula = dmgFormula.replace('1d6', '1d8');
  }

  let dmgParts = dmgFormula.split(/[+-]/);
  let dicePart = dmgParts[0];
  let dmgMod = dmgFormula.includes('+') ? parseInt(dmgFormula.split('+')[1], 10) : (dmgFormula.includes('-') ? -parseInt(dmgFormula.split('-')[1], 10) : 0);

  let [diceCount, diceSides] = dicePart.split('d').map(x => parseInt(x, 10));
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

  const weaponName = rawAttackText.split('(')[0].replace(/[⚔️🗡️🏹★✨💢🥋🔥🟣⚡🎯]/g, '').trim() || 'Arma';

  // Desconta munição se for arma com projétil
  let ammoMsg = '';
  if (typeof consumePlayerAmmunition === 'function') {
    const ammoRes = consumePlayerAmmunition(p, weaponName);
    if (ammoRes) {
      if (ammoRes.success) {
        ammoMsg = ` • 🏹 1 ${ammoRes.label} (restam: ${ammoRes.remaining})`;
      } else if (ammoRes.empty) {
        ammoMsg = ` • ⚠️ <b>Sem ${ammoRes.label} no inventário!</b>`;
      }
    }
  }

  const physicalTag = (customD20 !== null && customD20 !== undefined) ? ' 🎲(Mesa)' : '';
  const hitBreakdown = `d20${hitModeTag}${physicalTag} ${hitBonus >= 0 ? '+' : ''}${hitBonus} ➔ <b>${totalHit}</b> para acertar`;
  const dmgBreakdown = `${diceCount}d${diceSides} [${dmgRolls.join(', ')}] ${dmgMod !== 0 ? (dmgMod > 0 ? '+ ' + dmgMod : '- ' + Math.abs(dmgMod)) : ''} ➔ <b>${totalDmg}</b> de dano${isVersatile ? ' (2 Mãos)' : ''}`;

  let logMsg = `⚔️ <b>${p.name}</b> atacou com <b>${weaponName}${isVersatile ? ' (2 Mãos)' : ''}</b>: ${hitBreakdown} | ${dmgBreakdown}${ammoMsg}`;
  if (isCrit) logMsg = '🔥 <b>ACERTO CRÍTICO!</b> ' + logMsg;
  if (isFumble) logMsg = '💀 <b>FALHA CRÍTICA (Nat 1)!</b> ' + logMsg;

  addLog(logMsg);
  addPlayerActionLog(p.id, '⚔️', `Ataque ${weaponName}${hitModeTag}${isVersatile ? ' (2M)' : ''}: Acerto ${totalHit} | Dano ${totalDmg}${ammoMsg}`, 'attack');
  if (typeof playFX === 'function') playFX(isCrit ? 'crit' : (isFumble ? 'fumble' : 'sword'));

  if (typeof showLiveDiceRoll === 'function') {
    showLiveDiceRoll(`⚔️ Ataque - ${p.name}`, totalHit, `${hitBreakdown} | Dano: ${totalDmg}`, isCrit, isFumble);
  }

  if (typeof broadcastCombatState === 'function') {
    broadcastCombatState(logMsg);
  }

  const banner = document.getElementById('dice-banner');
  if (banner) {
    banner.style.display = 'block';
    const totalEl = document.getElementById('dice-total-number');
    const breakEl = document.getElementById('dice-breakdown-text');
    if (totalEl) totalEl.innerText = totalHit;
    if (breakEl) breakEl.innerText = `${p.name}: Acerto ${totalHit} | Dano: ${totalDmg}`;
  }

  // Preenche o despachante de dano no combate para conveniência
  const inpDmg = document.getElementById('inp-damage');
  if (inpDmg && totalDmg > 0) inpDmg.value = totalDmg;

  renderPlayers();
  return { d20, totalHit, totalDmg, isCrit, isFumble, rollMode, isVersatile };
}

function rollWeaponDamageOnly(id, rawAttackText, isCrit = false, isVersatile = false) {
  const p = PLAYERS.find(x => x.id === id);
  if (!p) return;

  const dmgMatch = rawAttackText.match(/(\d+d\d+(?:\s*[+-]\s*\d+)?)/i);
  let dmgFormula = dmgMatch ? dmgMatch[1].replace(/\s+/g, '') : '';
  let isFixedNumber = false;
  let fixedVal = 0;

  if (!dmgFormula) {
    const fixedMatch = rawAttackText.match(/(?:dano|bônus|bonus|\))\s*([+-]?\d+)/i) || rawAttackText.match(/([+-]\d+)\s*(?:dano|bônus|cortante|concussão|perfurante|extra)/i);
    if (fixedMatch) {
      isFixedNumber = true;
      fixedVal = parseInt(fixedMatch[1], 10) || 0;
    } else {
      dmgFormula = '1d8+3';
    }
  }

  if (isVersatile && dmgFormula) {
    if (dmgFormula.startsWith('1d8')) dmgFormula = dmgFormula.replace('1d8', '1d10');
    else if (dmgFormula.startsWith('1d6')) dmgFormula = dmgFormula.replace('1d6', '1d8');
  }

  let dmgRolls = [];
  let totalDmg = 0;
  let diceCount = 1;
  let diceSides = 8;
  let dmgMod = 0;

  if (isFixedNumber) {
    totalDmg = fixedVal;
    dmgRolls = [fixedVal];
  } else {
    let dmgParts = dmgFormula.split(/[+-]/);
    let dicePart = dmgParts[0];
    dmgMod = dmgFormula.includes('+') ? parseInt(dmgFormula.split('+')[1], 10) : (dmgFormula.includes('-') ? -parseInt(dmgFormula.split('-')[1], 10) : 0);

    const splitDice = dicePart.split('d').map(x => parseInt(x, 10));
    diceCount = splitDice[0] || 1;
    diceSides = splitDice[1] || 8;

    if (isCrit) diceCount *= 2;

    for (let i = 0; i < diceCount; i++) {
      const r = Math.floor(Math.random() * diceSides) + 1;
      dmgRolls.push(r);
      totalDmg += r;
    }
    totalDmg += dmgMod;
  }

  const weaponName = rawAttackText.split('(')[0].replace(/[⚔️🗡️🏹★✨💢🥋🔥🟣⚡🎯]/g, '').trim() || 'Arma';
  const dmgBreakdown = isFixedNumber
    ? `<b>${totalDmg >= 0 ? '+' + totalDmg : totalDmg}</b>`
    : `${diceCount}d${diceSides} [${dmgRolls.join(', ')}] ${dmgMod !== 0 ? (dmgMod > 0 ? '+ ' + dmgMod : '- ' + Math.abs(dmgMod)) : ''} ➔ <b>${totalDmg}</b>`;
  const logMsg = `💥 <b>${p.name}</b> rolou dano com <b>${weaponName}${isVersatile ? ' (2 Mãos)' : ''}</b>: ${dmgBreakdown} de dano${isCrit ? ' 🔥 (CRÍTICO!)' : ''}`;

  addLog(logMsg);
  addPlayerActionLog(p.id, '💥', `Dano ${weaponName}${isVersatile ? ' (2 Mãos)' : ''}: ${totalDmg} (${dmgBreakdown})`, 'damage');
  if (typeof playFX === 'function') playFX(isCrit ? 'crit' : 'sword');

  // Preenche o campo de dano na central de combate se disponível
  const inpDmg = document.getElementById('inp-damage');
  if (inpDmg && totalDmg > 0) inpDmg.value = totalDmg;

  if (typeof showLiveDiceRoll === 'function') {
    showLiveDiceRoll(`💥 Dano - ${p.name}`, totalDmg, `${weaponName}${isVersatile ? ' (2M)' : ''}: ${dmgBreakdown}`, isCrit, false);
  }

  const banner = document.getElementById('dice-banner');
  if (banner) {
    banner.style.display = 'block';
    const totalEl = document.getElementById('dice-total-number');
    const breakEl = document.getElementById('dice-breakdown-text');
    if (totalEl) totalEl.innerText = totalDmg;
    if (breakEl) breakEl.innerText = `${p.name} - ${weaponName}${isVersatile ? ' (2M)' : ''}: ${totalDmg} Dano`;
  }

  return { totalDmg, dmgRolls, diceCount, diceSides, isCrit, isVersatile };
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

  if (typeof touchPlayer === 'function') touchPlayer(p);
  renderPlayers();
  if (typeof renderCombat === 'function') renderCombat();
  saveToLocalStorage();
  if (typeof syncLocalChangesToFirebase === 'function') syncLocalChangesToFirebase(true);
  if (typeof broadcastStateSync === 'function') broadcastStateSync();
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

  const comb = typeof findCombatantForPlayer === 'function'
    ? findCombatantForPlayer(p, typeof state !== 'undefined' && state ? state.combatants : [])
    : (typeof state !== 'undefined' && state.combatants ? state.combatants.find(c => (c.playerId && c.playerId === p.id) || c.name.includes(p.name)) : null);
  if (comb) { comb.hp = p.hp; if (typeof renderCombat === 'function') renderCombat(); }

  if (typeof playFX === 'function') playFX('heal');
  const featMsg = restoredFeatures.length > 0 ? ` e restaurou cargas de: ${restoredFeatures.join(', ')}` : '';
  addLog(`☕ <b>${p.name}</b> fez um Descanso Curto: rolou 1d${sides}+${conMod} e recuperou <b>${healed} PV</b> (${p.hp}/${p.maxHp})${featMsg}.`);
  addPlayerActionLog(p.id, '☕', `Descanso Curto: recuperou ${healed} PV (${p.hp}/${p.maxHp})${featMsg}`, 'rest');

  if (typeof touchPlayer === 'function') touchPlayer(p);
  renderPlayers();
  if (typeof renderCombat === 'function') renderCombat();
  saveToLocalStorage();
  if (typeof syncLocalChangesToFirebase === 'function') syncLocalChangesToFirebase(true);
  if (typeof broadcastStateSync === 'function') broadcastStateSync();
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

    ${hd.available > 0 && p.hp < p.maxHp ? `
      <div style="background: rgba(245, 158, 11, 0.08); border: 1px dashed rgba(245, 158, 11, 0.4); border-radius: 8px; padding: 8px 12px; margin-top: 8px; display: flex; align-items: center; justify-content: space-between; gap: 8px; flex-wrap: wrap;">
        <span style="font-size: 11px; color: var(--accent-gold); font-weight: 700;">🎲✏️ Dado Físico da Mesa:</span>
        <div style="display: flex; align-items: center; gap: 6px;">
          <input type="number" id="inp-shortrest-physical-val" min="1" max="${hd.dieSides}" placeholder="1 a ${hd.dieSides}" style="width: 75px; text-align: center; padding: 4px 6px; font-weight: 800; font-size: 14px; border: 1px solid var(--accent-gold); background: #0f172a; color: #fff; border-radius: 4px;">
          <button class="btn-action" style="font-size: 11px; padding: 5px 10px; background: linear-gradient(135deg, #d97706, #b45309);" onclick="applyShortRestPhysicalDie('${p.id}')">Curar Dado Físico</button>
        </div>
      </div>
    ` : ''}

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

function applyShortRestPhysicalDie(playerIdOrVal, directVal = null) {
  let targetId = typeof playerIdOrVal === 'string' ? playerIdOrVal : (typeof activeShortRestPlayerId !== 'undefined' ? activeShortRestPlayerId : null);
  let val = typeof playerIdOrVal === 'number' ? playerIdOrVal : directVal;

  if (val === null || val === undefined) {
    const inp = document.getElementById('inp-shortrest-physical-val');
    if (inp) val = parseInt(inp.value, 10);
  }

  if (!targetId && typeof PLAYERS !== 'undefined' && PLAYERS.length > 0) {
    targetId = PLAYERS[0].id;
  }
  const p = PLAYERS.find(x => x.id === targetId);
  if (!p) return;
  const hd = getPlayerHitDicePool(p);
  if (typeof val !== 'number' || isNaN(val) || val < 1 || val > hd.dieSides) {
    if (typeof alert === 'function') alert(`Por favor digite um número válido entre 1 e ${hd.dieSides} (o que caiu no seu dado físico)!`);
    return;
  }
  rollShortRestHitDie(targetId, val);
}

function rollShortRestHitDie(playerId, customRoll = null) {
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
  const dieRoll = (typeof customRoll === 'number' && customRoll >= 1 && customRoll <= hd.dieSides)
    ? customRoll
    : Math.floor(Math.random() * hd.dieSides) + 1;
  const totalHealed = Math.max(1, dieRoll + conMod);

  p.spentHitDice = (p.spentHitDice || 0) + 1;
  const prevHp = p.hp;
  p.hp = Math.min(p.maxHp, p.hp + totalHealed);
  const actualHealed = p.hp - prevHp;

  const comb = typeof findCombatantForPlayer === 'function'
    ? findCombatantForPlayer(p, typeof state !== 'undefined' && state ? state.combatants : [])
    : (typeof state !== 'undefined' && state.combatants ? state.combatants.find(c => (c.playerId && c.playerId === p.id) || c.name.includes(p.name)) : null);
  if (comb) { comb.hp = p.hp; if (typeof renderCombat === 'function') renderCombat(); }

  if (typeof playFX === 'function') playFX('heal');

  const bd = `1${hd.dieType} [${dieRoll}] ${conMod >= 0 ? '+' + conMod : conMod} = ${totalHealed} PV`;
  addLog(`🏕️ <b>${p.name}</b> gastou 1 Dado de Vida (${bd}): recuperou <b>+${actualHealed} PV</b> (${prevHp} ➔ ${p.hp}/${p.maxHp} PV). Dados restantes: ${hd.available - 1}/${hd.total}`);
  addPlayerActionLog(p.id, '🏕️', `Descanso Curto: rolou 1${hd.dieType} (${bd}) e recuperou +${actualHealed} PV (${p.hp}/${p.maxHp})`, 'rest');

  if (typeof showLiveDiceRoll === 'function') {
    showLiveDiceRoll(`🏕️ Descanso Curto - ${p.name}`, totalHealed, `Dado de Vida 1${hd.dieType} (${bd})`);
  }

  if (typeof touchPlayer === 'function') touchPlayer(p);
  renderShortRestModalContent(p);
  renderPlayers();
  saveToLocalStorage();
  if (typeof syncLocalChangesToFirebase === 'function') syncLocalChangesToFirebase();
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
      if (p.slotsUsed) p.slotsUsed = Array.isArray(p.slots) ? p.slots.map(() => 0) : [0, 0, 0, 0, 0, 0, 0, 0, 0];
    }

    addLog(`🏕️ <b>${p.name}</b> finalizou o Descanso Curto: habilidades de classe e fôlego restaurados!`);
    addPlayerActionLog(p.id, '🏕️', `Concluiu Descanso Curto (habilidades restauradas)`, 'rest');
    if (typeof playFX === 'function') playFX('crit');
    if (typeof touchPlayer === 'function') touchPlayer(p);
  }

  closeShortRestModal();
  renderPlayers();
  if (typeof renderCombat === 'function') renderCombat();
  saveToLocalStorage();
  if (typeof syncLocalChangesToFirebase === 'function') syncLocalChangesToFirebase(true);
  if (typeof broadcastStateSync === 'function') broadcastStateSync();
}

function playerLongRest(id) {
  const p = PLAYERS.find(x => x.id === id);
  if (!p) return;

  p.hp = p.maxHp;
  p.tempHp = 0;
  p.deathSaves = { success: 0, fail: 0 };
  if (p.slotsUsed) p.slotsUsed = Array.isArray(p.slots) ? p.slots.map(() => 0) : [0, 0, 0, 0, 0, 0, 0, 0, 0];

  // Recupera metade dos dados de vida gastos (mínimo 1)
  const recoveredDice = Math.max(1, Math.floor((p.level || 1) / 2));
  p.spentHitDice = Math.max(0, (p.spentHitDice || 0) - recoveredDice);

  // M3: Restaura todas as habilidades no Descanso Longo
  initPlayerFeatureCharges(p);
  p.featureCharges.forEach(f => {
    f.used = 0;
  });

  const comb = typeof findCombatantForPlayer === 'function'
    ? findCombatantForPlayer(p, typeof state !== 'undefined' && state ? state.combatants : [])
    : (typeof state !== 'undefined' && state.combatants ? state.combatants.find(c => (c.playerId && c.playerId === p.id) || c.name.includes(p.name)) : null);
  if (comb) { comb.hp = p.hp; comb.conditions = []; if (typeof renderCombat === 'function') renderCombat(); }

  if (typeof playFX === 'function') playFX('heal');
  addLog(`🌙 <b>${p.name}</b> completou um Descanso Longo: PV restaurados ao máximo, magias, ${recoveredDice} dados de vida e todas as cargas de classe recuperadas!`);
  addPlayerActionLog(p.id, '🌙', `Descanso Longo: PV restaurados ao máximo, magias, dados de vida e cargas recuperadas`, 'rest');

  if (typeof touchPlayer === 'function') touchPlayer(p);
  renderPlayers();
  if (typeof renderCombat === 'function') renderCombat();
  saveToLocalStorage();
  if (typeof syncLocalChangesToFirebase === 'function') syncLocalChangesToFirebase(true);
  if (typeof broadcastStateSync === 'function') broadcastStateSync();
}

function partyLongRestAll() {
  const targetPlayers = (typeof getCurrentlyFilteredPlayers === 'function' ? getCurrentlyFilteredPlayers() : (typeof PLAYERS !== 'undefined' ? PLAYERS : [])) || [];
  if (targetPlayers.length === 0) {
    alert('Nenhum herói encontrado para descansar.');
    return;
  }
  const selectedCamp = typeof getCurrentlySelectedCampaign === 'function' ? getCurrentlySelectedCampaign() : null;
  const promptMsg = selectedCamp
    ? `Conceder Descanso Longo (8h) para os ${targetPlayers.length} aventureiros da mesa "${selectedCamp.name}"? Todos recuperarão PV total, magias, dados de vida e habilidades.`
    : `Conceder Descanso Longo (8h) para TODOS os ${targetPlayers.length} alunos? Todos recuperarão PV total, magias, dados de vida e habilidades.`;

  if (confirm(promptMsg)) {
    targetPlayers.forEach(p => {
      p.hp = p.maxHp;
      p.tempHp = 0;
      p.deathSaves = { success: 0, fail: 0 };
      p.slotsUsed = Array.isArray(p.slots) ? p.slots.map(() => 0) : [0, 0, 0, 0, 0, 0, 0, 0, 0];
      const recoveredDice = Math.max(1, Math.floor((p.level || 1) / 2));
      p.spentHitDice = Math.max(0, (p.spentHitDice || 0) - recoveredDice);
      initPlayerFeatureCharges(p);
      p.featureCharges.forEach(f => {
        f.used = 0;
      });
      const comb = typeof findCombatantForPlayer === 'function'
        ? findCombatantForPlayer(p, typeof state !== 'undefined' && state ? state.combatants : [])
        : (typeof state !== 'undefined' && state.combatants ? state.combatants.find(c => (c.playerId && c.playerId === p.id) || c.name.includes(p.name)) : null);
      if (comb) { comb.hp = p.hp; comb.conditions = []; }
      const logText = selectedCamp ? `Descanso Longo da Mesa (${selectedCamp.name})` : `Descanso Longo em Grupo`;
      addPlayerActionLog(p.id, '🌙', `${logText}: PV total, magias, dados de vida e cargas restauradas`, 'rest');
      if (typeof touchPlayer === 'function') touchPlayer(p);
    });
    if (typeof playFX === 'function') playFX('crit');
    const logMsg = selectedCamp
      ? `✨ <b>DESCANSO LONGO (Mesa: ${selectedCamp.name}):</b> Os ${targetPlayers.length} aventureiros recuperaram vida, magias, dados de vida e habilidades ao máximo!`
      : '✨ <b>DESCANSO LONGO DO GRUPO:</b> Todos os aventureiros recuperaram vida, magias, dados de vida e habilidades ao máximo!';
    addLog(logMsg);
    renderPlayers();
    if (typeof renderCombat === 'function') renderCombat();
    saveToLocalStorage();
    if (typeof syncLocalChangesToFirebase === 'function') syncLocalChangesToFirebase(true);
    if (typeof broadcastStateSync === 'function') broadcastStateSync();
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
  if (typeof touchPlayer === 'function') touchPlayer(p);
  renderPlayers();
  saveToLocalStorage();
  if (typeof syncLocalChangesToFirebase === 'function') syncLocalChangesToFirebase(true);
  if (typeof broadcastStateSync === 'function') broadcastStateSync();
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

  if (typeof touchPlayer === 'function') touchPlayer(p);
  const comb = (typeof findCombatantForPlayer === 'function')
    ? findCombatantForPlayer(p, typeof state !== 'undefined' && state ? state.combatants : [])
    : null;
  if (comb) {
    comb.hp = p.hp;
    if (typeof renderCombat === 'function') renderCombat();
  }
  addLog(msg);
  renderPlayers();
  saveToLocalStorage();
  if (typeof syncLocalChangesToFirebase === 'function') syncLocalChangesToFirebase(true);
  if (typeof broadcastStateSync === 'function') broadcastStateSync();
}

function rollDeathSave(id) {
  return rollPlayerDeathSave(id);
}

// =========================================================
// 💀 PAINEL DE SALVAGUARDAS DA MORTE (0 PV - DADOS DIGITAIS OU FÍSICOS)
// =========================================================
let currentDeathSavesPlayerId = null;

function openDeathSavesModal(playerId) {
  const targetId = playerId || activePortalPlayerId || (typeof PLAYERS !== 'undefined' && PLAYERS[0] ? PLAYERS[0].id : null);
  const p = PLAYERS ? PLAYERS.find(x => x.id === targetId) : null;
  if (!p) return;
  currentDeathSavesPlayerId = targetId;
  p.deathSaves = p.deathSaves || { success: 0, fail: 0 };

  const modal = document.getElementById('modal-death-saves');
  if (!modal) return;

  const charNameEl = document.getElementById('ds-modal-char-name');
  if (charNameEl) charNameEl.innerText = `${p.name} (0/${p.maxHp} PV)`;

  updateDeathSavesModalView(p);
  modal.classList.add('open');
}

function closeDeathSavesModal() {
  const modal = document.getElementById('modal-death-saves');
  if (modal) modal.classList.remove('open');
  currentDeathSavesPlayerId = null;
}

function updateDeathSavesModalView(p) {
  if (!p) return;
  p.deathSaves = p.deathSaves || { success: 0, fail: 0 };
  const s = p.deathSaves.success || 0;
  const f = p.deathSaves.fail || 0;

  for (let i = 1; i <= 3; i++) {
    const sDot = document.getElementById(`ds-s-${i}`);
    if (sDot) sDot.classList.toggle('active', i <= s);
    const fDot = document.getElementById(`ds-f-${i}`);
    if (fDot) fDot.classList.toggle('active', i <= f);
  }

  const statusText = document.getElementById('ds-modal-status-text');
  if (statusText) {
    if (f >= 3) {
      statusText.innerHTML = '<span style="color: #ef4444; font-weight: 800;">⚰️ O herói acumulou 3 falhas e faleceu.</span>';
    } else if (s >= 3) {
      statusText.innerHTML = '<span style="color: #10b981; font-weight: 800;">💚 O herói acumulou 3 sucessos e estabilizou!</span>';
    } else {
      statusText.innerText = `Sucessos: ${s}/3 | Falhas: ${f}/3`;
    }
  }
}

function toggleDeathSaveManual(type, index) {
  const targetId = currentDeathSavesPlayerId || activePortalPlayerId;
  const p = PLAYERS ? PLAYERS.find(x => x.id === targetId) : null;
  if (!p) return;
  p.deathSaves = p.deathSaves || { success: 0, fail: 0 };

  if (p.deathSaves[type] === index) {
    p.deathSaves[type] = index - 1;
  } else {
    p.deathSaves[type] = index;
  }

  checkDeathSaveThresholds(p);
  updateDeathSavesModalView(p);
  if (typeof touchPlayer === 'function') touchPlayer(p);
  renderPlayers();
  if (typeof renderCombat === 'function') renderCombat();
  saveToLocalStorage();
  if (typeof syncLocalChangesToFirebase === 'function') syncLocalChangesToFirebase(true);
}

function addDeathSaveManual(type) {
  const targetId = currentDeathSavesPlayerId || activePortalPlayerId;
  const p = PLAYERS ? PLAYERS.find(x => x.id === targetId) : null;
  if (!p) return;
  p.deathSaves = p.deathSaves || { success: 0, fail: 0 };
  p.deathSaves[type] = Math.min(3, (p.deathSaves[type] || 0) + 1);

  addLog(`🎲 <b>${p.name}</b> registrou +1 ${type === 'success' ? 'SUCESSO' : 'FALHA'} manual no teste da morte (${p.deathSaves[type]}/3).`);
  addPlayerActionLog(p.id, type === 'success' ? '✨' : '💀', `+1 ${type === 'success' ? 'Sucesso' : 'Falha'} da Morte (Manual: ${p.deathSaves[type]}/3)`, 'save');

  checkDeathSaveThresholds(p);
  updateDeathSavesModalView(p);
  if (typeof touchPlayer === 'function') touchPlayer(p);
  renderPlayers();
  if (typeof renderCombat === 'function') renderCombat();
  saveToLocalStorage();
  if (typeof syncLocalChangesToFirebase === 'function') syncLocalChangesToFirebase(true);
}

function setDeathSaveSpecial(special) {
  const targetId = currentDeathSavesPlayerId || activePortalPlayerId;
  const p = PLAYERS ? PLAYERS.find(x => x.id === targetId) : null;
  if (!p) return;
  p.deathSaves = p.deathSaves || { success: 0, fail: 0 };

  if (special === 'nat20') {
    p.hp = 1;
    p.deathSaves = { success: 0, fail: 0 };
    addLog(`🔥 <b>20 NATURAL NA MESA!</b> <b>${p.name}</b> recobrou a consciência com <b>1 PV</b>!`);
    addPlayerActionLog(p.id, '🔥', '20 Nat na Mesa! Recobrou consciência com 1 PV!', 'save');
    if (typeof playFX === 'function') playFX('crit');
    updateDeathSavesModalView(p);
    setTimeout(() => closeDeathSavesModal(), 1200);
  } else if (special === 'nat1') {
    p.deathSaves.fail = Math.min(3, (p.deathSaves.fail || 0) + 2);
    addLog(`💀 <b>1 NATURAL NA MESA!</b> <b>${p.name}</b> acumulou <b>+2 FALHAS</b> da morte (${p.deathSaves.fail}/3)!`);
    addPlayerActionLog(p.id, '💀', `1 Nat na Mesa: +2 falhas (${p.deathSaves.fail}/3)`, 'save');
    if (typeof playFX === 'function') playFX('fumble');
    checkDeathSaveThresholds(p);
    updateDeathSavesModalView(p);
  }

  if (typeof touchPlayer === 'function') touchPlayer(p);
  renderPlayers();
  if (typeof renderCombat === 'function') renderCombat();
  saveToLocalStorage();
  if (typeof syncLocalChangesToFirebase === 'function') syncLocalChangesToFirebase(true);
}

function resetDeathSavesManual() {
  const targetId = currentDeathSavesPlayerId || activePortalPlayerId;
  const p = PLAYERS ? PLAYERS.find(x => x.id === targetId) : null;
  if (!p) return;
  p.deathSaves = { success: 0, fail: 0 };
  addLog(`🔄 Testes da morte de <b>${p.name}</b> foram resetados.`);
  updateDeathSavesModalView(p);
  if (typeof touchPlayer === 'function') touchPlayer(p);
  renderPlayers();
  if (typeof renderCombat === 'function') renderCombat();
  saveToLocalStorage();
  if (typeof syncLocalChangesToFirebase === 'function') syncLocalChangesToFirebase(true);
}

function checkDeathSaveThresholds(p) {
  if (!p || !p.deathSaves) return;
  if (p.deathSaves.success >= 3) {
    p.hp = 1;
    p.deathSaves = { success: 0, fail: 0 };
    addLog(`💚 <b>${p.name} ESTABILIZOU</b> com 1 PV!`);
    addPlayerActionLog(p.id, '💚', 'Estabilizou com 1 PV!', 'save');
    if (typeof playFX === 'function') playFX('heal');
  } else if (p.deathSaves.fail >= 3) {
    addLog(`⚰️ <b>${p.name} faleceu heroicamente.</b>`);
    addPlayerActionLog(p.id, '⚰️', 'Faleceu heroicamente.', 'damage');
    if (typeof playFX === 'function') playFX('fumble');
  }
}

function rollDeathSaveFromModal() {
  const targetId = currentDeathSavesPlayerId || activePortalPlayerId;
  if (!targetId) return;
  rollPlayerDeathSave(targetId);
  const p = PLAYERS ? PLAYERS.find(x => x.id === targetId) : null;
  if (p) updateDeathSavesModalView(p);
}

// =========================================================
// 🧘 MODAL DE TESTE DE CONCENTRAÇÃO (D&D 5E)
// =========================================================
let activeConcentrationCheck = null;

function triggerConcentrationCheck(playerId, spellName, damage, dc) {
  const p = PLAYERS ? PLAYERS.find(x => x.id === playerId) : null;
  if (!p) return;

  activeConcentrationCheck = { playerId, spellName, damage, dc };
  const conScore = p.con !== undefined ? p.con : (p.attributes?.con || 10);
  const conMod = Math.floor((conScore - 10) / 2);

  const modal = document.getElementById('modal-concentration-check');
  if (!modal) return;

  const spellEl = document.getElementById('conc-modal-spell-name');
  if (spellEl) spellEl.innerText = spellName;

  const dmgEl = document.getElementById('conc-modal-dmg-val');
  if (dmgEl) dmgEl.innerText = damage;

  const dcEl = document.getElementById('conc-modal-dc-val');
  if (dcEl) dcEl.innerText = dc;

  const modEl = document.getElementById('conc-modal-con-mod');
  if (modEl) modEl.innerText = (conMod >= 0 ? `+${conMod}` : `${conMod}`);

  modal.classList.add('open');
}

function closeConcentrationModal() {
  const modal = document.getElementById('modal-concentration-check');
  if (modal) modal.classList.remove('open');
  activeConcentrationCheck = null;
}

function submitConcentrationRoll(type) {
  if (!activeConcentrationCheck) {
    closeConcentrationModal();
    return;
  }
  const { playerId, spellName, dc } = activeConcentrationCheck;
  const p = PLAYERS ? PLAYERS.find(x => x.id === playerId) : null;
  if (!p) {
    closeConcentrationModal();
    return;
  }

  const conScore = p.con !== undefined ? p.con : (p.attributes?.con || 10);
  const conMod = Math.floor((conScore - 10) / 2);

  if (type === 'digital') {
    const d20 = Math.floor(Math.random() * 20) + 1;
    const total = d20 + conMod;
    const passed = total >= dc;

    if (passed) {
      addLog(`✨ <b>${p.name} MANTEVE a concentração</b> em <b>${spellName}</b>! (Rolagem: <b>${total}</b> [d20: ${d20} + CON: ${conMod}] vs CD ${dc})`);
      addPlayerActionLog(p.id, '✨', `Concentração Mantida: ${total} vs CD ${dc}`, 'save');
      if (typeof playFX === 'function') playFX('heal');
      if (typeof showToast === 'function') showToast(`✨ Concentração mantida em ${spellName}!`, 'success');
    } else {
      p.concentrationSpell = null;
      addLog(`💥 <b>${p.name} FALHOU</b> na salvaguarda de CON e <b>PERDEU a concentração</b> em <b>${spellName}</b>! (Rolagem: <b>${total}</b> [d20: ${d20} + CON: ${conMod}] vs CD ${dc})`);
      addPlayerActionLog(p.id, '💥', `Concentração Perdida em ${spellName}: ${total} vs CD ${dc}`, 'spell');
      if (typeof playFX === 'function') playFX('fumble');
      if (typeof showToast === 'function') showToast(`💥 Concentração perdida em ${spellName}!`, 'error');
    }
  } else if (type === 'manual_pass') {
    addLog(`✨ <b>${p.name} passou no teste de concentração</b> com dado físico (CD ${dc}) e manteve <b>${spellName}</b>!`);
    addPlayerActionLog(p.id, '✨', `Concentração Mantida (Dado Físico: CD ${dc})`, 'save');
    if (typeof playFX === 'function') playFX('heal');
  } else if (type === 'manual_fail') {
    p.concentrationSpell = null;
    addLog(`💥 <b>${p.name} falhou na salvaguarda física</b> e perdeu a concentração em <b>${spellName}</b>!`);
    addPlayerActionLog(p.id, '💥', `Concentração Perdida (Dado Físico: CD ${dc})`, 'spell');
    if (typeof playFX === 'function') playFX('fumble');
  }

  if (typeof touchPlayer === 'function') touchPlayer(p);
  renderPlayers();
  saveToLocalStorage();
  if (typeof syncLocalChangesToFirebase === 'function') syncLocalChangesToFirebase(true);
  closeConcentrationModal();
}

// =========================================================
// 📱 DOCK FLUTUANTE DE AÇÕES RÁPIDAS MOBILE
// =========================================================
function scrollToPlayerSection(section) {
  const activeId = activePortalPlayerId || (typeof PLAYERS !== 'undefined' && PLAYERS[0] ? PLAYERS[0].id : null);
  const p = PLAYERS ? PLAYERS.find(x => x.id === activeId) : null;

  if (section === 'hp') {
    const hpCard = document.querySelector('.roll20-hp-card, .roll20-top-grid, .player-card');
    if (hpCard) {
      hpCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    return;
  }

  if (section === 'spells') {
    if (activeId && typeof setPlayerCardRoll20Tab === 'function') {
      setPlayerCardRoll20Tab(activeId, 'spells');
    }
    setTimeout(() => {
      const spellsHeader = document.querySelector('.roll20-spells-tab-header, .spellcasting-hud-bar, .slots-grid');
      if (spellsHeader) {
        spellsHeader.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
    return;
  }

  if (section === 'attacks') {
    if (activeId && typeof setPlayerCardRoll20Tab === 'function') {
      setPlayerCardRoll20Tab(activeId, 'combat');
    }
    setTimeout(() => {
      const atkTable = document.querySelector('.roll20-attacks-table, .action-economy-nav');
      if (atkTable) {
        atkTable.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
    return;
  }

  if (section === 'inventory') {
    if (activeId && typeof setPlayerCardRoll20Tab === 'function') {
      setPlayerCardRoll20Tab(activeId, 'inventory');
    }
    setTimeout(() => {
      const invHeader = document.querySelector('.roll20-weight-status-bar, .inventory-item-row');
      if (invHeader) {
        invHeader.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
    return;
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openQuickD20Modal() {
  const activeId = activePortalPlayerId || (typeof PLAYERS !== 'undefined' && PLAYERS[0] ? PLAYERS[0].id : null);
  const p = PLAYERS ? PLAYERS.find(x => x.id === activeId) : null;
  const name = p ? p.name : 'Jogador';

  const d20 = Math.floor(Math.random() * 20) + 1;
  const isCrit = d20 === 20;
  const isFumble = d20 === 1;

  const resultText = isCrit ? '🔥 20 NATURAL! ACERTO CRÍTICO!' : (isFumble ? '💀 1 NATURAL! FALHA CRÍTICA!' : `Resultado: ${d20}`);
  addLog(`🎲 <b>${name}</b> rolou d20 puro: <b>${d20}</b> ${isCrit ? '🔥' : (isFumble ? '💀' : '')}`);
  if (p) addPlayerActionLog(p.id, '🎲', `Rolou d20 puro: ${d20}`, 'roll');

  if (typeof showLiveDiceRoll === 'function') {
    showLiveDiceRoll(name, d20, resultText);
  }
  if (typeof playFX === 'function') playFX(isCrit ? 'crit' : (isFumble ? 'fumble' : 'dice'));
}

function escapeAttr(str) {
  if (!str) return '';
  return String(str).replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

function isMagicalSubclass(className, subclassIdx, subclassName = '') {
  const normClass = String(className || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const normSub = String(subclassName || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  if (normSub.includes('trapaceiro') || normSub.includes('trickster') || normSub.includes('cavaleiro mistico') || normSub.includes('cavaleiro arcano') || normSub.includes('eldritch knight')) {
    return true;
  }

  // Ladino: subclasse de índice 2 é Trapaceiro Arcano (Arcane Trickster)
  if (normClass.includes('ladino') || normClass.includes('rogue')) {
    if (subclassIdx === 2 || normSub.includes('arcano') || normSub.includes('trickster') || normSub.includes('trapaceiro')) return true;
  }

  // Guerreiro: subclasse de índice 2 é Cavaleiro Místico (Eldritch Knight)
  if (normClass.includes('guerreiro') || normClass.includes('fighter')) {
    if (subclassIdx === 2 || normSub.includes('mistico') || normSub.includes('arcano') || normSub.includes('eldritch')) return true;
  }

  // Suporte caso a subclasse esteja escrita diretamente no campo de classe (ex: "Ladino (Trapaceiro Arcano)")
  if (normClass.includes('trapaceiro') || normClass.includes('trickster') || normClass.includes('cavaleiro mistico') || normClass.includes('eldritch knight')) {
    return true;
  }

  return false;
}

function getPlayerSubclassName(p, classItem = null) {
  if (!p) return '';
  const targetClass = classItem ? classItem.className : p.className;
  const subIdx = classItem ? (classItem.subclassIdx !== undefined ? classItem.subclassIdx : 0) : (p.subclassIdx !== undefined ? p.subclassIdx : 0);
  if (p.subclass && !classItem && typeof p.subclass === 'string') return p.subclass;
  if (typeof findClassData === 'function') {
    const clsData = findClassData(targetClass);
    if (clsData && clsData.subclasses && clsData.subclasses[subIdx]) {
      return clsData.subclasses[subIdx].name;
    }
  }
  return '';
}

function isSpellcasterClass(className, subclassIdx = 0, subclassName = '') {
  const norm = String(className || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (norm.includes('mago') || norm.includes('clerigo') || norm.includes('druida') || norm.includes('feiticeiro') || norm.includes('bardo') || norm.includes('paladino') || norm.includes('patrulheiro') || norm.includes('bruxo') || norm.includes('warlock') || norm.includes('ranger') || norm.includes('wizard') || norm.includes('sorcerer') || norm.includes('cleric') || norm.includes('druid') || norm.includes('bard') || norm.includes('paladin')) {
    return true;
  }
  return isMagicalSubclass(className, subclassIdx, subclassName);
}

function calculateSpellSlots(className, level, subclassIdx = null) {
  const norm = (className || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  level = parseInt(level) || 1;
  const isThird = isMagicalSubclass(className, subclassIdx);

  // Full Casters: Bardo, Clérigo, Druida, Feiticeiro, Mago (9 círculos D&D 5E)
  if (norm.includes('bardo') || norm.includes('clerigo') || norm.includes('druida') || norm.includes('feiticeiro') || norm.includes('mago') || norm.includes('wizard') || norm.includes('cleric') || norm.includes('druid') || norm.includes('sorcerer') || norm.includes('bard')) {
    const fullTable = [
      [2, 0, 0, 0, 0, 0, 0, 0, 0], // Nv 1
      [3, 0, 0, 0, 0, 0, 0, 0, 0], // Nv 2
      [4, 2, 0, 0, 0, 0, 0, 0, 0], // Nv 3
      [4, 3, 0, 0, 0, 0, 0, 0, 0], // Nv 4
      [4, 3, 2, 0, 0, 0, 0, 0, 0], // Nv 5
      [4, 3, 3, 0, 0, 0, 0, 0, 0], // Nv 6
      [4, 3, 3, 1, 0, 0, 0, 0, 0], // Nv 7
      [4, 3, 3, 2, 0, 0, 0, 0, 0], // Nv 8
      [4, 3, 3, 3, 1, 0, 0, 0, 0], // Nv 9
      [4, 3, 3, 3, 2, 0, 0, 0, 0], // Nv 10
      [4, 3, 3, 3, 2, 1, 0, 0, 0], // Nv 11
      [4, 3, 3, 3, 2, 1, 0, 0, 0], // Nv 12
      [4, 3, 3, 3, 2, 1, 1, 0, 0], // Nv 13
      [4, 3, 3, 3, 2, 1, 1, 0, 0], // Nv 14
      [4, 3, 3, 3, 2, 1, 1, 1, 0], // Nv 15
      [4, 3, 3, 3, 2, 1, 1, 1, 0], // Nv 16
      [4, 3, 3, 3, 2, 1, 1, 1, 1], // Nv 17
      [4, 3, 3, 3, 3, 1, 1, 1, 1], // Nv 18
      [4, 3, 3, 3, 3, 2, 1, 1, 1], // Nv 19
      [4, 3, 3, 3, 3, 2, 2, 1, 1]  // Nv 20
    ];
    return fullTable[Math.min(20, Math.max(1, level)) - 1];
  }

  // Half Casters: Paladino, Patrulheiro
  if (norm.includes('paladino') || norm.includes('patrulheiro') || norm.includes('ranger') || norm.includes('paladin')) {
    if (level < 2) return [0, 0, 0, 0, 0, 0, 0, 0, 0];
    if (level === 2) return [2, 0, 0, 0, 0, 0, 0, 0, 0];
    if (level <= 4) return [3, 0, 0, 0, 0, 0, 0, 0, 0];
    if (level <= 6) return [4, 2, 0, 0, 0, 0, 0, 0, 0];
    if (level <= 8) return [4, 3, 0, 0, 0, 0, 0, 0, 0];
    if (level <= 10) return [4, 3, 2, 0, 0, 0, 0, 0, 0];
    if (level <= 12) return [4, 3, 3, 0, 0, 0, 0, 0, 0];
    if (level <= 14) return [4, 3, 3, 1, 0, 0, 0, 0, 0];
    if (level <= 16) return [4, 3, 3, 2, 0, 0, 0, 0, 0];
    if (level <= 18) return [4, 3, 3, 3, 1, 0, 0, 0, 0];
    return [4, 3, 3, 3, 2, 0, 0, 0, 0];
  }

  // Warlock / Bruxo: Pact Magic
  if (norm.includes('bruxo') || norm.includes('warlock')) {
    if (level === 1) return [1, 0, 0, 0, 0, 0, 0, 0, 0];
    if (level === 2) return [2, 0, 0, 0, 0, 0, 0, 0, 0];
    if (level <= 4) return [0, 2, 0, 0, 0, 0, 0, 0, 0];
    if (level <= 6) return [0, 0, 2, 0, 0, 0, 0, 0, 0];
    if (level <= 8) return [0, 0, 0, 2, 0, 0, 0, 0, 0];
    if (level <= 10) return [0, 0, 0, 0, 2, 0, 0, 0, 0];
    if (level <= 16) return [0, 0, 0, 0, 3, 0, 0, 0, 0];
    return [0, 0, 0, 0, 4, 0, 0, 0, 0];
  }

  // Third Casters: Ladino Trapaceiro Arcano (subclasse 2) / Guerreiro Cavaleiro Místico (subclasse 2)
  if (isThird || norm.includes('arcano') || norm.includes('eldritch') || norm.includes('trickster')) {
    if (level < 3) return [0, 0, 0, 0, 0, 0, 0, 0, 0];
    if (level <= 3) return [2, 0, 0, 0, 0, 0, 0, 0, 0];
    if (level <= 6) return [3, 0, 0, 0, 0, 0, 0, 0, 0];
    if (level <= 9) return [4, 2, 0, 0, 0, 0, 0, 0, 0];
    if (level <= 12) return [4, 3, 0, 0, 0, 0, 0, 0, 0];
    if (level <= 15) return [4, 3, 2, 0, 0, 0, 0, 0, 0];
    if (level <= 18) return [4, 3, 3, 0, 0, 0, 0, 0, 0];
    return [4, 3, 3, 1, 0, 0, 0, 0, 0];
  }

  return [0, 0, 0, 0, 0, 0, 0, 0, 0];
}

function getHitDieForClass(className) {
  const norm = (className || '').toLowerCase();
  if (norm.includes('bárbaro') || norm.includes('barbaro')) return '1d12';
  if (norm.includes('guerreiro') || norm.includes('paladino') || norm.includes('patrulheiro')) return '1d10';
  if (norm.includes('mago') || norm.includes('feiticeiro')) return '1d6';
  return '1d8'; // Bardo, Clérigo, Druida, Ladino, Monge, Bruxo
}

const FIGHTING_STYLES = {
  archery: { id: 'archery', name: 'Arquearia', icon: '🏹', desc: '+2 de bônus nas jogadas de ataque realizadas com armas de ataque à distância.' },
  defense: { id: 'defense', name: 'Defesa', icon: '🛡️', desc: '+1 de bônus na Classe de Armadura (CA) enquanto estiver usando uma armadura.' },
  dueling: { id: 'dueling', name: 'Duelo', icon: '⚔️', desc: '+2 de bônus nas jogadas de dano quando empunhar uma arma corpo a corpo em uma mão e nenhuma outra arma.' },
  twoweapon: { id: 'twoweapon', name: 'Combate com Duas Armas', icon: '🗡️⚔️', desc: 'Adiciona o modificador de atributo no dano do ataque bônus da segunda arma.' },
  protection: { id: 'protection', name: 'Proteção', icon: '🛡️⚡', desc: 'Quando uma criatura atacar um alvo que não seja você a até 1,5m, use sua Reação para impor desvantagem no ataque (precisa de escudo).' },
  interception: { id: 'interception', name: 'Intercepção', icon: '🎯', desc: 'Quando uma criatura a até 1,5m sofrer dano, use sua Reação para reduzir o dano em 1d10 + Bônus de Proficiência.' },
  greatweapon: { id: 'greatweapon', name: 'Luta com Armas Grandes', icon: '🔨', desc: 'Ao tirar 1 ou 2 no dano com arma de duas mãos ou versátil empunhada com as duas mãos, pode rolar o dado novamente.' },
  unarmed: { id: 'unarmed', name: 'Combatente Desarmado', icon: '🥊', desc: 'Golpes desarmados causam 1d6 (ou 1d8 com as duas mãos livres) + FOR de dano contundente.' },
  thrown: { id: 'thrown', name: 'Arremessador', icon: '🪓', desc: '+2 de bônus nas jogadas de dano com armas de arremesso.' },
  blind: { id: 'blind', name: 'Luta às Cegas', icon: '👁️', desc: 'Você possui Visão às Cegas (Blindsight) com alcance de 3 metros (10 pés).' },
  blessed: { id: 'blessed', name: 'Guerreiro Abençoado', icon: '🔮', desc: 'Você aprende 2 Truques da lista de magias de Clérigo que contam como magias de Paladino.' },
  druidic: { id: 'druidic', name: 'Guerreiro Druídico', icon: '🍃', desc: 'Você aprende 2 Truques da lista de magias de Druida que contam como magias de Patrulheiro.' }
};

function setPlayerFightingStyle(playerId, styleKey, event) {
  if (event && event.stopPropagation) event.stopPropagation();
  const p = PLAYERS.find(x => String(x.id) === String(playerId));
  if (!p) return;

  p.fightingStyle = styleKey || '';
  ensurePlayerCalculatedAc(p);

  const styleObj = (typeof FIGHTING_STYLES !== 'undefined' && FIGHTING_STYLES[styleKey]) ? FIGHTING_STYLES[styleKey] : null;
  const styleName = styleObj ? (styleObj.icon + ' ' + styleObj.name) : 'Nenhum';

  touchPlayer(p);
  addPlayerActionLog(p.id, '⚔️', 'Definiu o Estilo de Luta: ' + styleName, 'general');
  if (typeof addLog === 'function') {
    addLog('⚔️ <b>' + escapeAttr(p.name) + '</b> adotou o Estilo de Luta: <b>' + escapeAttr(styleName) + '</b> (CA: ' + p.ac + ')');
  }

  saveToLocalStorage();
  if (typeof syncLocalChangesToFirebase === 'function') syncLocalChangesToFirebase(true);
  if (typeof broadcastStateSync === 'function') broadcastStateSync();
  renderPlayers();
  if (typeof renderCombat === 'function') renderCombat();

  if (typeof showToast === 'function') {
    showToast('⚔️ Estilo de Luta: ' + styleName + ' ativado! (CA: ' + p.ac + ')');
  }
}

const DND5E_KNOWN_SPELLS_TABLE = {
  bardo: [0, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 15, 16, 18, 19, 19, 20, 22, 22, 22],
  feiticeiro: [0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 12, 13, 13, 14, 14, 15, 15, 15, 15],
  bruxo: [0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15],
  patrulheiro: [0, 0, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11],
  cavaleiro_arcano: [0, 0, 0, 3, 4, 4, 4, 5, 6, 6, 7, 8, 8, 9, 10, 10, 11, 11, 11, 12, 13],
  trapaceiro_arcano: [0, 0, 0, 3, 4, 4, 4, 5, 6, 6, 7, 8, 8, 9, 10, 10, 11, 11, 11, 12, 13]
};

const DND5E_CANTRIPS_KNOWN_TABLE = {
  bardo: [0, 2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
  clérigo: [0, 3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  druida: [0, 2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
  feiticeiro: [0, 4, 4, 4, 5, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
  mago: [0, 3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  bruxo: [0, 2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
  cavaleiro_arcano: [0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
  trapaceiro_arcano: [0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4]
};

function getMaxPreparedSpells(p) {
  if (!p) return { max: 0, maxLeveled: 0, maxCantrips: 0, formula: 'Nenhuma', isPreparedCaster: false, isKnownCaster: false };
  const lvl = Math.max(1, Math.min(20, parseInt(p.level, 10) || 1));
  const norm = (p.className || '').toLowerCase();
  const intMod = Math.floor(((p.int || 10) - 10) / 2);
  const wisMod = Math.floor(((p.wis || 10) - 10) / 2);
  const chaMod = Math.floor(((p.cha || 10) - 10) / 2);

  // 1. CONJURADORES DE MAGIAS PREPARADAS
  if (norm.includes('mago') || norm.includes('wizard')) {
    const max = Math.max(1, lvl + intMod);
    const cantrips = DND5E_CANTRIPS_KNOWN_TABLE.mago[lvl] || 3;
    return {
      type: 'prepared',
      max,
      maxLeveled: max,
      maxCantrips: cantrips,
      formula: `Nível (${lvl}) + INT (${intMod >= 0 ? '+' : ''}${intMod}) = ${max}`,
      isPreparedCaster: true,
      isKnownCaster: false,
      attrLabel: 'INT',
      className: 'Mago'
    };
  }

  if (norm.includes('clérigo') || norm.includes('clerigo')) {
    const max = Math.max(1, lvl + wisMod);
    const cantrips = DND5E_CANTRIPS_KNOWN_TABLE.clérigo[lvl] || 3;
    return {
      type: 'prepared',
      max,
      maxLeveled: max,
      maxCantrips: cantrips,
      formula: `Nível (${lvl}) + SAB (${wisMod >= 0 ? '+' : ''}${wisMod}) = ${max}`,
      isPreparedCaster: true,
      isKnownCaster: false,
      attrLabel: 'SAB',
      className: 'Clérigo'
    };
  }

  if (norm.includes('druida')) {
    const max = Math.max(1, lvl + wisMod);
    const cantrips = DND5E_CANTRIPS_KNOWN_TABLE.druida[lvl] || 2;
    return {
      type: 'prepared',
      max,
      maxLeveled: max,
      maxCantrips: cantrips,
      formula: `Nível (${lvl}) + SAB (${wisMod >= 0 ? '+' : ''}${wisMod}) = ${max}`,
      isPreparedCaster: true,
      isKnownCaster: false,
      attrLabel: 'SAB',
      className: 'Druida'
    };
  }

  if (norm.includes('paladino')) {
    const halfLvl = Math.max(1, Math.floor(lvl / 2));
    const max = Math.max(1, halfLvl + chaMod);
    const cantrips = p.fightingStyle === 'blessed' ? 2 : 0;
    return {
      type: 'prepared',
      max,
      maxLeveled: max,
      maxCantrips: cantrips,
      formula: `Metade do Nível (${halfLvl}) + CAR (${chaMod >= 0 ? '+' : ''}${chaMod}) = ${max}`,
      isPreparedCaster: true,
      isKnownCaster: false,
      attrLabel: 'CAR',
      className: 'Paladino'
    };
  }

  // 2. CONJURADORES DE MAGIAS CONHECIDAS (LIMITES D&D 5E POR NÍVEL)
  if (norm.includes('bardo')) {
    const max = DND5E_KNOWN_SPELLS_TABLE.bardo[lvl] || 4;
    const cantrips = DND5E_CANTRIPS_KNOWN_TABLE.bardo[lvl] || 2;
    return {
      type: 'known',
      max,
      maxLeveled: max,
      maxCantrips: cantrips,
      formula: `Tabela D&D 5E de Bardo Nv ${lvl} = ${max} magias conhecidas`,
      isPreparedCaster: false,
      isKnownCaster: true,
      attrLabel: 'CAR',
      className: 'Bardo'
    };
  }

  if (norm.includes('feiticeiro')) {
    const max = DND5E_KNOWN_SPELLS_TABLE.feiticeiro[lvl] || 2;
    const cantrips = DND5E_CANTRIPS_KNOWN_TABLE.feiticeiro[lvl] || 4;
    return {
      type: 'known',
      max,
      maxLeveled: max,
      maxCantrips: cantrips,
      formula: `Tabela D&D 5E de Feiticeiro Nv ${lvl} = ${max} magias conhecidas`,
      isPreparedCaster: false,
      isKnownCaster: true,
      attrLabel: 'CAR',
      className: 'Feiticeiro'
    };
  }

  if (norm.includes('bruxo') || norm.includes('warlock')) {
    const max = DND5E_KNOWN_SPELLS_TABLE.bruxo[lvl] || 2;
    const cantrips = DND5E_CANTRIPS_KNOWN_TABLE.bruxo[lvl] || 2;
    return {
      type: 'known',
      max,
      maxLeveled: max,
      maxCantrips: cantrips,
      formula: `Tabela D&D 5E de Bruxo Nv ${lvl} = ${max} magias conhecidas`,
      isPreparedCaster: false,
      isKnownCaster: true,
      attrLabel: 'CAR',
      className: 'Bruxo'
    };
  }

  if (norm.includes('patrulheiro') || norm.includes('ranger')) {
    const max = DND5E_KNOWN_SPELLS_TABLE.patrulheiro[lvl] || 0;
    const cantrips = p.fightingStyle === 'druidic' ? 2 : 0;
    return {
      type: 'known',
      max,
      maxLeveled: max,
      maxCantrips: cantrips,
      formula: `Tabela D&D 5E de Patrulheiro Nv ${lvl} = ${max} magias conhecidas`,
      isPreparedCaster: false,
      isKnownCaster: true,
      attrLabel: 'SAB',
      className: 'Patrulheiro'
    };
  }

  const subName = getPlayerSubclassName(p);
  const subIdx = (p.subclassIdx !== undefined) ? p.subclassIdx : 0;
  const isArcaneTrickster = isMagicalSubclass(p.className, subIdx, subName) && (norm.includes('ladino') || norm.includes('rogue') || subName.toLowerCase().includes('trapaceiro') || subName.toLowerCase().includes('trickster') || norm.includes('trapaceiro'));
  const isEldritchKnight = isMagicalSubclass(p.className, subIdx, subName) && (norm.includes('guerreiro') || norm.includes('fighter') || subName.toLowerCase().includes('cavaleiro') || subName.toLowerCase().includes('eldritch') || norm.includes('cavaleiro'));

  if (isEldritchKnight || norm.includes('cavaleiro') || norm.includes('eldritch')) {
    const isUnlocked = lvl >= 3;
    const max = isUnlocked ? (DND5E_KNOWN_SPELLS_TABLE.cavaleiro_arcano[lvl] || 0) : 0;
    const cantrips = isUnlocked ? (DND5E_CANTRIPS_KNOWN_TABLE.cavaleiro_arcano[lvl] || 0) : 0;
    return {
      type: isUnlocked ? 'known' : 'none',
      max,
      maxLeveled: max,
      maxCantrips: cantrips,
      formula: isUnlocked
        ? `Tabela D&D 5E de Cavaleiro Místico Nv ${lvl} = ${max} magias conhecidas`
        : `Ganha conjuração de magias no Nível 3`,
      isPreparedCaster: false,
      isKnownCaster: isUnlocked,
      attrLabel: 'INT',
      className: 'Cavaleiro Místico'
    };
  }

  if (isArcaneTrickster || norm.includes('trapaceiro') || norm.includes('trickster')) {
    const isUnlocked = lvl >= 3;
    const max = isUnlocked ? (DND5E_KNOWN_SPELLS_TABLE.trapaceiro_arcano[lvl] || 0) : 0;
    const cantrips = isUnlocked ? (DND5E_CANTRIPS_KNOWN_TABLE.trapaceiro_arcano[lvl] || 0) : 0;
    return {
      type: isUnlocked ? 'known' : 'none',
      max,
      maxLeveled: max,
      maxCantrips: cantrips,
      formula: isUnlocked
        ? `Tabela D&D 5E de Trapaceiro Arcano Nv ${lvl} = ${max} magias conhecidas`
        : `Ganha conjuração de magias no Nível 3`,
      isPreparedCaster: false,
      isKnownCaster: isUnlocked,
      attrLabel: 'INT',
      className: 'Trapaceiro Arcano'
    };
  }

  return {
    type: 'none',
    max: Array.isArray(p.preparedSpells) ? p.preparedSpells.length : 0,
    maxLeveled: Array.isArray(p.preparedSpells) ? p.preparedSpells.length : 0,
    maxCantrips: 0,
    formula: `Sem conjuração de classe`,
    isPreparedCaster: false,
    isKnownCaster: false,
    attrLabel: null,
    className: p.className || 'Classe'
  };
}

function getPlayerSpellcastingStats(p) {
  if (!p) return { isCaster: false, ability: 'INT', abilityKey: 'int', abilityMod: 0, modStr: '+0', profBonus: 2, saveDc: 10, attackBonus: '+2', attackModNum: 2, formula: 'CD 10' };
  const lvl = parseInt(p.level, 10) || 1;
  const prof = getProfBonus(lvl);
  const norm = (p.className || '').toLowerCase();
  const subName = getPlayerSubclassName(p);
  const subIdx = (p.subclassIdx !== undefined) ? p.subclassIdx : 0;
  const isMagicalSub = isMagicalSubclass(p.className, subIdx, subName);

  let abilityKey = 'int';
  let abilityLabel = 'INT';
  let isCaster = true;

  if (norm.includes('mago') || norm.includes('wizard') || norm.includes('cavaleiro') || norm.includes('eldritch') || norm.includes('trapaceiro') || norm.includes('trickster') || isMagicalSub) {
    abilityKey = 'int';
    abilityLabel = 'INT';
  } else if (norm.includes('clérigo') || norm.includes('clerigo') || norm.includes('druida') || norm.includes('patrulheiro') || norm.includes('ranger')) {
    abilityKey = 'wis';
    abilityLabel = 'SAB';
  } else if (norm.includes('bardo') || norm.includes('feiticeiro') || norm.includes('sorcerer') || norm.includes('bruxo') || norm.includes('warlock') || norm.includes('paladino')) {
    abilityKey = 'cha';
    abilityLabel = 'CAR';
  } else {
    // Classes não-conjuradoras puras (Guerreiro, Bárbaro, Ladino, Monge)
    if ((p.slots && p.slots.some(s => s > 0)) || (p.preparedSpells && p.preparedSpells.length > 0)) {
      const intVal = p.int || 10;
      const wisVal = p.wis || 10;
      const chaVal = p.cha || 10;
      if (wisVal >= intVal && wisVal >= chaVal) { abilityKey = 'wis'; abilityLabel = 'SAB'; }
      else if (chaVal >= intVal && chaVal >= wisVal) { abilityKey = 'cha'; abilityLabel = 'CAR'; }
      else { abilityKey = 'int'; abilityLabel = 'INT'; }
    } else {
      isCaster = false;
    }
  }

  const rawAttr = p[abilityKey] || 10;
  const mod = Math.floor((rawAttr - 10) / 2);
  const saveDc = 8 + prof + mod;
  const attackModNum = prof + mod;
  const attackBonus = attackModNum >= 0 ? `+${attackModNum}` : `${attackModNum}`;
  const modStr = mod >= 0 ? `+${mod}` : `${mod}`;

  return {
    isCaster,
    ability: abilityLabel,
    abilityLabel,
    abilityKey,
    abilityMod: mod,
    modStr,
    profBonus: prof,
    saveDc,
    attackBonus,
    attackModNum,
    formula: `CD = 8 + Prof (+${prof}) + ${abilityLabel} (${modStr}) = ${saveDc}`
  };
}

function rollPlayerSpellAttack(playerId, customD20) {
  const p = PLAYERS.find(x => x.id === playerId);
  if (!p) return;

  if (customD20 === undefined && p.diceMode === 'physical') {
    openPhysicalD20Modal({
      playerId: playerId,
      type: 'spellAttack',
      title: `🔮 Ataque Mágico Físico: ${p.name}`,
      subtitle: `Rolagem de ataque mágico (d20 real)`
    });
    return;
  }

  const stats = getPlayerSpellcastingStats(p);
  const d20 = (customD20 !== null && customD20 !== undefined) ? parseInt(customD20, 10) : (Math.floor(Math.random() * 20) + 1);
  const isCrit = d20 === 20;
  const isFumble = d20 === 1;
  const total = d20 + stats.attackModNum;

  const physicalTag = (customD20 !== null && customD20 !== undefined) ? ' 🎲(Mesa)' : '';
  const title = `Ataque Mágico (${stats.ability})${physicalTag}`;
  const detail = `d20 (${d20}${physicalTag}) ${stats.attackBonus} = ${total}`;

  if (typeof playFX === 'function') {
    playFX(isCrit ? 'crit' : (isFumble ? 'fumble' : 'dice'));
  }

  if (typeof showLiveDiceRoll === 'function') {
    showLiveDiceRoll(title, `${total}`, `${p.name} • ${detail}${isCrit ? ' 🔥 CRÍTICO!' : ''}`);
  }

  const logMsg = `🎲 <b>${p.name}</b> rolou <b>Ataque Mágico</b>${physicalTag}: [d20 (${d20}) ${stats.attackBonus}] = <b>${total}</b>${isCrit ? ' <span style="color:#fbbf24; font-weight:bold;">🔥 CRÍTICO!</span>' : ''}${isFumble ? ' <span style="color:#f87171; font-weight:bold;">💀 FALHA CRÍTICA!</span>' : ''}`;
  if (typeof addLog === 'function') addLog(logMsg);
  if (typeof addPlayerActionLog === 'function') addPlayerActionLog(p.id, '🔮', `Ataque Mágico${physicalTag}: ${total} (d20:${d20} ${stats.attackBonus})`, 'dice');

  if (typeof broadcastCombatState === 'function') {
    broadcastCombatState(logMsg);
  }
  return { d20, total, isCrit, isFumble };
}

const sheetSpellFilters = {};
function setSheetSpellFilter(playerId, filter) {
  sheetSpellFilters[playerId] = filter || 'all';
  if (typeof renderPlayers === 'function') renderPlayers();
}

function buildPlayerSpellsSummary(spellList) {
  if (!Array.isArray(spellList) || spellList.length === 0) return '';
  const cantrips = [];
  const leveled = [];
  spellList.forEach(sName => {
    if (!sName || typeof sName !== 'string') return;
    const clean = sName.trim();
    if (!clean) return;
    const s = typeof SPELLS_DATA !== 'undefined' ? SPELLS_DATA.find(x => x.name.toLowerCase() === clean.toLowerCase()) : null;
    if (s && s.level === 0) cantrips.push(s.name);
    else leveled.push(s ? s.name : clean);
  });
  let summary = '';
  if (cantrips.length > 0) summary += `Truques: ${cantrips.join(', ')}\n`;
  if (leveled.length > 0) summary += `Preparadas: ${leveled.join(', ')}`;
  return summary.trim();
}

function parseSpellNamesFromRawText(rawSpellsText) {
  const result = [];
  if (!rawSpellsText || typeof rawSpellsText !== 'string' || typeof SPELLS_DATA === 'undefined') return result;
  const cleanedLines = rawSpellsText
    .replace(/truques\s*:/gi, ',')
    .replace(/preparadas\s*:/gi, ',')
    .replace(/magias\s*:/gi, ',')
    .split(/[\n,;]+/)
    .map(tok => tok.trim().toLowerCase())
    .filter(Boolean);

  cleanedLines.forEach(token => {
    const exact = SPELLS_DATA.find(sp => sp.name.toLowerCase() === token);
    if (exact) {
      if (!result.includes(exact.name)) result.push(exact.name);
      return;
    }
    if (typeof SPELL_PHRASE_ALIASES !== 'undefined' && SPELL_PHRASE_ALIASES[token]) {
      const targetPt = SPELL_PHRASE_ALIASES[token].toLowerCase();
      const aliased = SPELLS_DATA.find(sp => sp.name.toLowerCase() === targetPt);
      if (aliased && !result.includes(aliased.name)) result.push(aliased.name);
    }
  });
  return result;
}

function getPlayerKnownSpells(p) {
  if (!p) return [];
  const knownSet = new Set();
  const isWiz = typeof isWizardPlayer === 'function' ? isWizardPlayer(p) : false;
  const hasInitializedPrep = Array.isArray(p.preparedSpells) && (p.preparedSpells.length > 0 || p._spellsSyncedFromPicker === true);

  if (hasInitializedPrep) {
    p.preparedSpells.forEach(s => { if (s && typeof s === 'string' && s.trim()) knownSet.add(s.trim()); });
    if (Array.isArray(p.unpreparedSpells)) {
      p.unpreparedSpells.forEach(s => { if (s && typeof s === 'string' && s.trim()) knownSet.add(s.trim()); });
    }
    if (isWiz && Array.isArray(p.spellbookSpells)) {
      p.spellbookSpells.forEach(s => { if (s && typeof s === 'string' && s.trim()) knownSet.add(s.trim()); });
    }
  } else {
    // Inicialização de ficha legada (quando preparedSpells ainda não foi populado)
    if (p.spells && typeof p.spells === 'string') {
      parseSpellNamesFromRawText(p.spells).forEach(s => knownSet.add(s));
    }
    if (knownSet.size === 0) {
      if (Array.isArray(p.spellbookSpells)) {
        p.spellbookSpells.forEach(s => { if (s && typeof s === 'string' && s.trim()) knownSet.add(s.trim()); });
      }
      if (Array.isArray(p.knownSpells)) {
        p.knownSpells.forEach(s => { if (s && typeof s === 'string' && s.trim()) knownSet.add(s.trim()); });
      }
    }
    if (knownSet.size > 0 && (!Array.isArray(p.preparedSpells) || p.preparedSpells.length === 0)) {
      p.preparedSpells = Array.from(knownSet);
    }
  }

  const list = Array.from(knownSet);
  // Mantém spellbookSpells e knownSpells limpos e sincronizados (sem ressuscitar magias desmarcadas)
  p.spellbookSpells = [...list];
  if (Array.isArray(p.knownSpells)) {
    p.knownSpells = [...list];
  }

  // Ordenação por círculo e nome
  list.sort((a, b) => {
    const spA = typeof SPELLS_DATA !== 'undefined' ? SPELLS_DATA.find(s => s.name.toLowerCase() === a.toLowerCase()) : null;
    const spB = typeof SPELLS_DATA !== 'undefined' ? SPELLS_DATA.find(s => s.name.toLowerCase() === b.toLowerCase()) : null;
    const lvlA = spA ? spA.level : 99;
    const lvlB = spB ? spB.level : 99;
    if (lvlA !== lvlB) return lvlA - lvlB;
    return a.localeCompare(b, 'pt-BR');
  });

  return list;
}

function removeSpellFromPlayer(playerId, spellName, e) {
  if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
  const p = PLAYERS.find(x => x.id === playerId);
  if (!p || !spellName) return;

  const targetLower = spellName.trim().toLowerCase();
  if (Array.isArray(p.preparedSpells)) {
    p.preparedSpells = p.preparedSpells.filter(s => (s || '').trim().toLowerCase() !== targetLower);
  }
  if (Array.isArray(p.unpreparedSpells)) {
    p.unpreparedSpells = p.unpreparedSpells.filter(s => (s || '').trim().toLowerCase() !== targetLower);
  }
  if (Array.isArray(p.spellbookSpells)) {
    p.spellbookSpells = p.spellbookSpells.filter(s => (s || '').trim().toLowerCase() !== targetLower);
  }
  if (Array.isArray(p.knownSpells)) {
    p.knownSpells = p.knownSpells.filter(s => (s || '').trim().toLowerCase() !== targetLower);
  }
  p._spellsSyncedFromPicker = true;
  p.spells = buildPlayerSpellsSummary(p.preparedSpells || []);

  p.updatedAt = Date.now();
  p.updatedBy = typeof localClientId !== 'undefined' ? localClientId : 'local';

  if (typeof touchPlayer === 'function') touchPlayer(p);
  if (typeof addLog === 'function') addLog(`🗑️ <b>${p.name}</b> removeu a magia <b>${spellName}</b> de sua ficha.`);
  if (typeof showToast === 'function') showToast(`🗑️ Magia "${spellName}" removida da ficha`, 'info');
  renderPlayers();
  if (typeof renderCombat === 'function') renderCombat();
  saveToLocalStorage();
  if (typeof executePlayerCloudSave === 'function' && typeof activePortalPlayerId !== 'undefined' && activePortalPlayerId === p.id) {
    executePlayerCloudSave();
  } else if (typeof syncLocalChangesToFirebase === 'function') {
    syncLocalChangesToFirebase(true);
  }
  if (typeof broadcastStateSync === 'function') broadcastStateSync();
}

function togglePlayerSpellPrepared(playerId, spellName) {
  const p = PLAYERS.find(x => x.id === playerId);
  if (!p) return;
  p.preparedSpells = p.preparedSpells || [];
  p.unpreparedSpells = Array.isArray(p.unpreparedSpells) ? p.unpreparedSpells : [];
  if (!p.spellbookSpells) p.spellbookSpells = [];

  // Garante que a magia continue em spellbookSpells (nunca some da ficha do herói ao apenas alternar preparo!)
  if (!p.spellbookSpells.includes(spellName)) {
    p.spellbookSpells.push(spellName);
  }

  const isPrep = p.preparedSpells.includes(spellName);
  if (isPrep) {
    p.preparedSpells = p.preparedSpells.filter(s => s !== spellName);
    if (!p.unpreparedSpells.includes(spellName)) p.unpreparedSpells.push(spellName);
    if (typeof addLog === 'function') addLog(`💤 <b>${p.name}</b> desmarcou a magia <b>${spellName}</b> das preparadas da sessão.`);
    if (typeof showToast === 'function') showToast(`💤 "${spellName}" desmarcada das preparadas`, 'info');
  } else {
    p.preparedSpells.push(spellName);
    p.unpreparedSpells = p.unpreparedSpells.filter(s => s !== spellName);
    if (typeof playFX === 'function') playFX('heal');
    if (typeof addLog === 'function') addLog(`⭐ <b>${p.name}</b> preparou a magia <b>${spellName}</b> para a sessão.`);
    if (typeof showToast === 'function') showToast(`⭐ "${spellName}" preparada para a sessão!`, 'success');
  }

  p._spellsSyncedFromPicker = true;
  p.spells = buildPlayerSpellsSummary(p.preparedSpells);

  // Carimbo temporal e autoria para precedência no sync (ISSUE-141)
  p.updatedAt = Date.now();
  p.updatedBy = typeof localClientId !== 'undefined' ? localClientId : 'local';

  if (typeof touchPlayer === 'function') touchPlayer(p);
  renderPlayers();
  if (typeof renderCombat === 'function') renderCombat();
  saveToLocalStorage();
  if (typeof executePlayerCloudSave === 'function' && typeof activePortalPlayerId !== 'undefined' && activePortalPlayerId === p.id) {
    executePlayerCloudSave();
  } else if (typeof syncLocalChangesToFirebase === 'function') {
    syncLocalChangesToFirebase(true);
  }
  if (typeof broadcastStateSync === 'function') broadcastStateSync();
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

  // 3. Fallback: Longest match first ou correspondência parcial
  const sortedSpecies = [...SPECIES_DATA].sort((a, b) => b.name.length - a.name.length);
  found = sortedSpecies.find(s => {
    const sName = s.name.toLowerCase();
    const sId = s.id.toLowerCase();
    return q.includes(sName) || q.includes(sId) || sName.includes(q) || sId.includes(q);
  });

  return found || null;
}

const DND5E_SUBCLASS_UNLOCK_LEVEL = {
  clerigo: 1,
  cleric: 1,
  bruxo: 1,
  warlock: 1,
  feiticeiro: 1,
  sorcerer: 1,
  druida: 2,
  druid: 2,
  mago: 2,
  wizard: 2,
  barbaro: 3,
  barbarian: 3,
  bardo: 3,
  bard: 3,
  guerreiro: 3,
  fighter: 3,
  ladino: 3,
  rogue: 3,
  monge: 3,
  monk: 3,
  paladino: 3,
  paladin: 3,
  patrulheiro: 3,
  ranger: 3
};

function getSubclassUnlockLevel(className) {
  if (!className) return 3;
  const norm = String(className).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  for (const [key, lvl] of Object.entries(DND5E_SUBCLASS_UNLOCK_LEVEL)) {
    if (norm.includes(key)) return lvl;
  }
  return 3;
}

function getClassAsiLevels(className) {
  const norm = String(className || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  if (norm.includes('guerreiro') || norm.includes('fighter')) {
    return [4, 6, 8, 12, 14, 16, 19];
  }
  if (norm.includes('ladino') || norm.includes('rogue')) {
    return [4, 8, 10, 12, 16, 19];
  }
  return [4, 8, 12, 16, 19];
}

function isClassAsiLevel(className, classLevel) {
  const lvl = parseInt(classLevel, 10);
  if (isNaN(lvl) || lvl < 4) return false;
  return getClassAsiLevels(className).includes(lvl);
}

function resolveSubclassIndex(className, subclassIdx = 0, subclassName = '') {
  if (typeof CLASSES_DATA === 'undefined') return subclassIdx || 0;
  const cls = (typeof findClassData === 'function') ? findClassData(className) : null;
  if (!cls || !cls.subclasses || cls.subclasses.length === 0) return subclassIdx || 0;

  if (subclassName && typeof subclassName === 'string') {
    const normTarget = subclassName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
    if (normTarget && normTarget !== 'padrao' && normTarget !== 'default') {
      const idx = cls.subclasses.findIndex(s => {
        const sNorm = (s.name || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
        return sNorm === normTarget || sNorm.includes(normTarget) || normTarget.includes(sNorm);
      });
      if (idx >= 0) return idx;
    }
  }

  const numIdx = parseInt(subclassIdx, 10);
  if (!isNaN(numIdx) && numIdx >= 0 && numIdx < cls.subclasses.length) {
    return numIdx;
  }
  return 0;
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

  const reqSubLvl = getSubclassUnlockLevel(className || (cls && cls.name));
  if (level >= reqSubLvl && cls.subclasses && cls.subclasses[subclassIdx]) {
    const sub = cls.subclasses[subclassIdx];
    if (sub.features) {
      sub.features.forEach(f => {
        if (f.level <= level) {
          unlocked.push({ ...f, source: sub.name, isSubclass: true });
        }
      });
    }
  }

  // 🎯 MARCOS CANÔNICOS DE ASI (AUMENTO NO VALOR DE HABILIDADE / TALENTO - ISSUE-143)
  const asiLevels = (typeof getClassAsiLevels === 'function') ? getClassAsiLevels(cls.name || className) : [4, 8, 12, 16, 19];
  if (Array.isArray(asiLevels)) {
    asiLevels.forEach(asiLvl => {
      if (asiLvl <= level) {
        unlocked.push({
          level: asiLvl,
          name: `Aumento no Valor de Habilidade (${asiLvl}º Nível)`,
          type: 'Evolução',
          desc: `No ${asiLvl}º nível da sua classe, você pode aumentar um valor de atributo à sua escolha em 2, ou dois valores de atributo à sua escolha em 1 (até o máximo de 20). Usando a regra opcional de talentos, você pode, em vez disso, escolher um talento oficial de D&D 5E.`,
          source: `${cls.name} • Marco do ${asiLvl}º Nível`,
          isSubclass: false,
          isAsi: true,
          asiLevel: asiLvl
        });
      }
    });
  }

  // Ordena características por nível ascendente
  unlocked.sort((a, b) => (parseInt(a.level, 10) || 0) - (parseInt(b.level, 10) || 0));

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
    subclassIdx: parseInt(p.subclassIdx, 10) || 0,
    subclass: p.subclass || ''
  }];
}

// --- 🎲 DICIONÁRIO E MOTOR DE DADOS DE MAGIAS (DANO E CURA) ---
const DND5E_SPELL_DICE_DATA = {
  // Truques com escalonamento (Nv 1: 1d, Nv 5: 2d, Nv 11: 3d, Nv 17: 4d)
  'raio de fogo': { baseDice: '1d10', diceCount: 1, type: 'fogo', icon: '🔥', isCantripScale: true },
  'fire bolt': { baseDice: '1d10', diceCount: 1, type: 'fogo', icon: '🔥', isCantripScale: true },
  'rajada mistica': { baseDice: '1d10', diceCount: 1, type: 'energia', icon: '🟣', isBeamScale: true },
  'eldritch blast': { baseDice: '1d10', diceCount: 1, type: 'energia', icon: '🟣', isBeamScale: true },
  'toque chocante': { baseDice: '1d8', diceCount: 1, type: 'elétrico', icon: '⚡', isCantripScale: true },
  'shocking grasp': { baseDice: '1d8', diceCount: 1, type: 'elétrico', icon: '⚡', isCantripScale: true },
  'raio de gelo': { baseDice: '1d8', diceCount: 1, type: 'frio', icon: '❄️', isCantripScale: true },
  'ray of frost': { baseDice: '1d8', diceCount: 1, type: 'frio', icon: '❄️', isCantripScale: true },
  'espirro acido': { baseDice: '1d6', diceCount: 1, type: 'ácido', icon: '🧪', isCantripScale: true },
  'acid splash': { baseDice: '1d6', diceCount: 1, type: 'ácido', icon: '🧪', isCantripScale: true },
  'toque arrepiante': { baseDice: '1d8', diceCount: 1, type: 'necrótico', icon: '💀', isCantripScale: true },
  'chill touch': { baseDice: '1d8', diceCount: 1, type: 'necrótico', icon: '💀', isCantripScale: true },
  'rajada de veneno': { baseDice: '1d12', diceCount: 1, type: 'veneno', icon: '☠️', isCantripScale: true },
  'poison spray': { baseDice: '1d12', diceCount: 1, type: 'veneno', icon: '☠️', isCantripScale: true },
  'chama sagrada': { baseDice: '1d8', diceCount: 1, type: 'radiante', icon: '✨', isCantripScale: true },
  'sacred flame': { baseDice: '1d8', diceCount: 1, type: 'radiante', icon: '✨', isCantripScale: true },
  'chicote de espinhos': { baseDice: '1d6', diceCount: 1, type: 'perfurante', icon: '🌿', isCantripScale: true },
  'thorn whip': { baseDice: '1d6', diceCount: 1, type: 'perfurante', icon: '🌿', isCantripScale: true },
  'bordao mistico': { baseDice: '1d8', type: 'concussão', icon: '🪵', addAttr: true },
  'shillelagh': { baseDice: '1d8', type: 'concussão', icon: '🪵', addAttr: true },

  // Nível 1
  'curar ferimentos': { baseDice: '1d8', type: 'cura', icon: '💚', isHeal: true, addAttr: true },
  'cure wounds': { baseDice: '1d8', type: 'cura', icon: '💚', isHeal: true, addAttr: true },
  'palavra curativa': { baseDice: '1d4', type: 'cura', icon: '💚', isHeal: true, addAttr: true },
  'healing word': { baseDice: '1d4', type: 'cura', icon: '💚', isHeal: true, addAttr: true },
  'misseis magicos': { baseDice: '1d4+1', type: 'energia', icon: '✨', label: '3x (1d4+1) Energia', rawFormula: '3d4+3' },
  'magic missile': { baseDice: '1d4+1', type: 'energia', icon: '✨', label: '3x (1d4+1) Energia', rawFormula: '3d4+3' },
  'maos flamejantes': { baseDice: '3d6', type: 'fogo', icon: '🔥' },
  'burning hands': { baseDice: '3d6', type: 'fogo', icon: '🔥' },
  'onda trovejante': { baseDice: '2d8', type: 'trovão', icon: '⚡' },
  'thunderwave': { baseDice: '2d8', type: 'trovão', icon: '⚡' },
  'raio de bruxa': { baseDice: '1d12', type: 'elétrico', icon: '⚡' },
  'witch bolt': { baseDice: '1d12', type: 'elétrico', icon: '⚡' },
  'raio guiado': { baseDice: '4d6', type: 'radiante', icon: '✨' },
  'guiding bolt': { baseDice: '4d6', type: 'radiante', icon: '✨' },
  'infligir ferimentos': { baseDice: '3d10', type: 'necrótico', icon: '💀' },
  'inflict wounds': { baseDice: '3d10', type: 'necrótico', icon: '💀' },
  'repreensao infernal': { baseDice: '2d10', type: 'fogo', icon: '🔥' },
  'hellish rebuke': { baseDice: '2d10', type: 'fogo', icon: '🔥' },
  'orbe cromatico': { baseDice: '3d8', type: 'elemental', icon: '🌈' },
  'chromatic orb': { baseDice: '3d8', type: 'elemental', icon: '🌈' },
  'auxilio divino': { baseDice: '1d4', type: 'radiante', icon: '⚔️', label: '+1d4 Radiante', rawFormula: '1d4' },
  'divine favor': { baseDice: '1d4', type: 'radiante', icon: '⚔️', label: '+1d4 Radiante', rawFormula: '1d4' },
  'bruxaria': { baseDice: '1d6', type: 'necrótico', icon: '🟣', label: '+1d6 Necrótico', rawFormula: '1d6' },
  'hex': { baseDice: '1d6', type: 'necrótico', icon: '🟣', label: '+1d6 Necrótico', rawFormula: '1d6' },
  'marca do cacador': { baseDice: '1d6', type: 'dano', icon: '🎯', label: '+1d6 Dano', rawFormula: '1d6' },
  'hunter\'s mark': { baseDice: '1d6', type: 'dano', icon: '🎯', label: '+1d6 Dano', rawFormula: '1d6' },

  // Nível 2
  'despedacar': { baseDice: '3d8', type: 'trovão', icon: '💥' },
  'shatter': { baseDice: '3d8', type: 'trovão', icon: '💥' },
  'raio ardente': { baseDice: '2d6', type: 'fogo', icon: '🔥', label: '3x 2d6 Fogo', rawFormula: '2d6' },
  'scorching ray': { baseDice: '2d6', type: 'fogo', icon: '🔥', label: '3x 2d6 Fogo', rawFormula: '2d6' },
  'arma espiritual': { baseDice: '1d8', type: 'força', icon: '⚔️', addAttr: true },
  'spiritual weapon': { baseDice: '1d8', type: 'força', icon: '⚔️', addAttr: true },
  'oracao curativa': { baseDice: '2d8', type: 'cura', icon: '💚', isHeal: true, addAttr: true },
  'prayer of healing': { baseDice: '2d8', type: 'cura', icon: '💚', isHeal: true, addAttr: true },
  'flecha acida de melf': { baseDice: '4d4', type: 'ácido', icon: '🧪', label: '4d4 + 2d4 Ácido', rawFormula: '4d4' },
  'melf\'s acid arrow': { baseDice: '4d4', type: 'ácido', icon: '🧪', label: '4d4 + 2d4 Ácido', rawFormula: '4d4' },
  'esfera flamejante': { baseDice: '2d6', type: 'fogo', icon: '🔥' },
  'flaming sphere': { baseDice: '2d6', type: 'fogo', icon: '🔥' },

  // Nível 3
  'bola de fogo': { baseDice: '8d6', type: 'fogo', icon: '💥' },
  'fireball': { baseDice: '8d6', type: 'fogo', icon: '💥' },
  'relampago': { baseDice: '8d6', type: 'elétrico', icon: '⚡' },
  'lightning bolt': { baseDice: '8d6', type: 'elétrico', icon: '⚡' },
  'espiritos guardioes': { baseDice: '3d8', type: 'radiante/necrótico', icon: '🛡️' },
  'spirit guardians': { baseDice: '3d8', type: 'radiante/necrótico', icon: '🛡️' },
  'palavra de cura em massa': { baseDice: '1d4', type: 'cura', icon: '💚', isHeal: true, addAttr: true },
  'mass healing word': { baseDice: '1d4', type: 'cura', icon: '💚', isHeal: true, addAttr: true },
  'toque vampirico': { baseDice: '3d6', type: 'necrótico', icon: '🧛' },
  'vampiric touch': { baseDice: '3d6', type: 'necrótico', icon: '🧛' }
};

function getSpellDiceInfo(spellOrName, player = null) {
  if (!spellOrName) return null;
  const name = typeof spellOrName === 'string' ? spellOrName : (spellOrName.name || '');
  const normName = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

  const sp = typeof SPELLS_DATA !== 'undefined'
    ? SPELLS_DATA.find(s => s.name.toLowerCase() === name.toLowerCase())
    : (typeof spellOrName === 'object' ? spellOrName : null);

  const pLvl = player ? (parseInt(player.level) || 1) : 1;
  const isCantrip = sp ? sp.level === 0 : false;

  let spellMod = 0;
  if (player && typeof getPlayerSpellcastingStats === 'function') {
    const stats = getPlayerSpellcastingStats(player);
    spellMod = stats.abilityMod !== undefined ? stats.abilityMod : (stats.modNum || 0);
  }

  const cantripScale = pLvl >= 17 ? 4 : (pLvl >= 11 ? 3 : (pLvl >= 5 ? 2 : 1));

  const known = DND5E_SPELL_DICE_DATA[normName];
  if (known) {
    let dice = known.baseDice;
    let label = known.label;
    let rawFormula = known.rawFormula || dice;

    if (known.isCantripScale) {
      const dieType = known.baseDice.replace(/^\d+/, '');
      const count = cantripScale * (known.diceCount || 1);
      dice = `${count}${dieType}`;
      rawFormula = dice;
      label = `${dice} ${known.type.charAt(0).toUpperCase() + known.type.slice(1)}`;
    } else if (known.isBeamScale) {
      dice = `${cantripScale}x 1d10`;
      rawFormula = `${cantripScale}d10`;
      label = `${dice} ${known.type.charAt(0).toUpperCase() + known.type.slice(1)}`;
    } else if (known.addAttr) {
      const modStr = spellMod >= 0 ? `+${spellMod}` : `${spellMod}`;
      dice = `${known.baseDice} ${modStr}`;
      rawFormula = `${known.baseDice}${modStr}`;
      label = `${known.baseDice}${modStr} ${known.type.charAt(0).toUpperCase() + known.type.slice(1)}`;
    } else if (!label) {
      label = `${dice} ${known.type.charAt(0).toUpperCase() + known.type.slice(1)}`;
    }

    return {
      name,
      dice,
      type: known.type,
      icon: known.icon || '🎲',
      label,
      rawFormula,
      isDamage: !known.isHeal,
      isHeal: !!known.isHeal
    };
  }

  if (sp && sp.desc) {
    const m = sp.desc.match(/(\d+d\d+(\s*[\+\-]\s*\d+)?)\s*(pontos de\s*)?(de\s*)?(dano\s+)?(de\s+)?(ácido|elétrico|fogo|frio|concussão|necrótico|perfurante|veneno|psíquico|radiante|cortante|trovejante|força|energia)?/i);
    const healMatch = sp.desc.match(/recupera\s+(\d+d\d+(\s*[\+\-]\s*\d+)?)/i);

    if (healMatch) {
      return {
        name,
        dice: healMatch[1],
        type: 'cura',
        icon: '💚',
        label: `${healMatch[1]} Cura`,
        rawFormula: healMatch[1].replace(/\s+/g, ''),
        isDamage: false,
        isHeal: true
      };
    }

    if (m) {
      let diceFormula = m[1].trim();
      const dmgType = m[7] ? m[7].toLowerCase() : 'dano';
      const iconMap = {
        'fogo': '🔥', 'elétrico': '⚡', 'frio': '❄️', 'ácido': '🧪', 'veneno': '☠️',
        'necrótico': '💀', 'radiante': '✨', 'trovejante': '💥', 'força': '🟣',
        'energia': '🟣', 'psíquico': '🧠'
      };

      if (isCantrip && diceFormula.match(/^1d\d+/)) {
        const dieType = diceFormula.replace(/^1/, '');
        diceFormula = `${cantripScale}${dieType}`;
      }

      return {
        name,
        dice: diceFormula,
        type: dmgType,
        icon: iconMap[dmgType] || '⚔️',
        label: `${diceFormula} ${dmgType.charAt(0).toUpperCase() + dmgType.slice(1)}`,
        rawFormula: diceFormula.replace(/\s+/g, ''),
        isDamage: true,
        isHeal: false
      };
    }
  }

  return null;
}

function rollPlayerSpellDice(playerId, spellName) {
  const p = PLAYERS.find(x => x.id === playerId);
  if (!p) return null;

  const diceInfo = getSpellDiceInfo(spellName, p);
  if (!diceInfo || !diceInfo.rawFormula) {
    if (typeof showToast === 'function') showToast(`A magia ${spellName} não possui fórmula de dados direta.`);
    return null;
  }

  const formula = diceInfo.rawFormula;
  const actionKind = diceInfo.isHeal ? 'Cura' : 'Dano';
  const rollLabel = `${p.name} - ${spellName} (${actionKind})`;

  let total = 0;
  let breakdown = '';
  let isCrit = false;

  if (typeof rollGlobalFormula === 'function') {
    const res = rollGlobalFormula(formula, rollLabel);
    if (res) {
      total = res.total;
      breakdown = res.breakdown || '';
      isCrit = !!res.isCrit;
    }
  } else {
    const match = formula.replace(/\s+/g, '').match(/^(\d*)d(\d+)([+-]\d+)?$/i);
    if (match) {
      const count = match[1] ? parseInt(match[1]) : 1;
      const sides = parseInt(match[2]);
      const mod = match[3] ? parseInt(match[3]) : 0;
      let sum = 0;
      const rolls = [];
      for (let i = 0; i < count; i++) {
        const r = Math.floor(Math.random() * sides) + 1;
        rolls.push(r);
        sum += r;
      }
      total = sum + mod;
      breakdown = `${count}d${sides} [${rolls.join(', ')}]${mod !== 0 ? (mod > 0 ? ' +' + mod : ' ' + mod) : ''}`;
    } else {
      total = parseInt(formula) || 0;
      breakdown = `Fixo: ${total}`;
    }
  }

  if (typeof playFX === 'function') playFX('dice');

  const logMsg = `🎲 <b>${p.name}</b> rolou <b>${actionKind} de ${spellName}</b> (${diceInfo.label}): <b>${total}</b> <span style="font-size:11px; opacity:0.8;">(${breakdown})</span>`;
  if (typeof addLog === 'function') addLog(logMsg);
  if (typeof addPlayerActionLog === 'function') {
    addPlayerActionLog(p.id, diceInfo.icon, `Rolou ${actionKind} de ${spellName}: ${total} (${diceInfo.label})`, 'dice');
  }

  if (typeof showLiveDiceRoll === 'function') {
    showLiveDiceRoll(`🎲 ${spellName} (${actionKind})`, `${total}`, `${p.name} • ${diceInfo.label} (${breakdown})`, isCrit);
  }

  if (typeof broadcastCombatState === 'function') {
    broadcastCombatState(logMsg);
  }

  return { total, breakdown, formula, label: diceInfo.label };
}

// --- 🛡️ RESOLUÇÃO DINÂMICA DE VALORES EM CARACTERÍSTICAS DA FICHA ---
function formatPlayerFeatureForDisplay(feature, p, clsItem = null) {
  if (!feature) return feature;
  const f = { ...feature };
  if (!p) return f;

  const pLvl = parseInt(clsItem ? clsItem.level : (p.level || 1)) || 1;
  const dexMod = Math.floor(((typeof getPlayerAttr === 'function' ? getPlayerAttr(p, 'des') : (p.dex || 10)) - 10) / 2);
  const conMod = Math.floor(((typeof getPlayerAttr === 'function' ? getPlayerAttr(p, 'con') : (p.con || 10)) - 10) / 2);
  const wisMod = Math.floor(((typeof getPlayerAttr === 'function' ? getPlayerAttr(p, 'sab') : (p.wis || 10)) - 10) / 2);
  const chaMod = Math.floor(((typeof getPlayerAttr === 'function' ? getPlayerAttr(p, 'car') : (p.cha || 10)) - 10) / 2);
  const intMod = Math.floor(((typeof getPlayerAttr === 'function' ? getPlayerAttr(p, 'int') : (p.int || 10)) - 10) / 2);
  const strMod = Math.floor(((typeof getPlayerAttr === 'function' ? getPlayerAttr(p, 'for') : (p.str || 10)) - 10) / 2);
  const prof = typeof getProfBonus === 'function' ? getProfBonus(p.level || pLvl) : Math.ceil(pLvl / 4) + 1;

  let name = f.name || '';
  let desc = f.desc || '';
  const normName = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const normCls = String((clsItem ? clsItem.className : p.className) || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const normDesc = String(desc || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // 0. Estilo de Luta
  if (normName.includes('estilo de luta') || normName.includes('fighting style')) {
    const curStyleKey = p.fightingStyle || '';
    const styleObj = (typeof FIGHTING_STYLES !== 'undefined' && FIGHTING_STYLES[curStyleKey]) ? FIGHTING_STYLES[curStyleKey] : null;
    if (styleObj) {
      name = 'Estilo de Luta (' + styleObj.name + ')';
      desc = '<b>Especialidade Adotada:</b> ' + styleObj.icon + ' <b>' + styleObj.name + '</b> — ' + styleObj.desc;
    } else {
      name = 'Estilo de Luta (Escolha Pendente)';
    }
  }

  // 0.1 Aumento no Valor de Habilidade / Talento por Nível (ISSUE-143)
  else if (f.isAsi || normName.includes('aumento no valor de habilidade') || normName.includes('aumento no valor de atributo')) {
    const asiLvl = f.asiLevel || f.level || 4;
    const clsKey = (clsItem ? clsItem.className : (p.className || '')).toLowerCase();
    const asiKey = `${clsKey}_lvl_${asiLvl}`;
    const choice = (p.asiChoices && p.asiChoices[asiKey]) || null;
    if (choice) {
      name = `Aumento de Habilidade / Talento (${asiLvl}º Nv: ${choice.label})`;
      desc = `<b>Escolha Registrada:</b> ⭐ <b>${choice.label}</b>.<br>• Benefício oficial de ${asiLvl}º nível da classe já integrado e ativo na ficha.`;
    } else {
      name = `Aumento no Valor de Habilidade (${asiLvl}º Nível)`;
      desc = `No ${asiLvl}º nível da sua classe, você tem direito a um <b>Aumento no Valor de Habilidade</b> (+2 em um atributo ou +1 em dois atributos) ou a um <b>Talento oficial</b> de D&D 5E.<br>• <span style="color:#f87171; font-weight:700;">⚠️ Escolha ainda pendente para este nível.</span>`;
    }
  }

  // 1. Defesa sem Armadura
  if (normName.includes('defesa sem armadura') || normName.includes('unarmored defense')) {
    const isBarbarian = normCls.includes('barbaro') || normDesc.includes('constituicao');
    const isMonk = normCls.includes('monge') || normDesc.includes('sabedoria');

    if (isBarbarian) {
      const caVal = 10 + dexMod + conMod;
      name = `Defesa sem Armadura (CA ${caVal})`;
      desc = desc.replace(/(10\s*\+\s*seu\s+modificador[^.]*|10\s*\+\s*[^.\n]*)/i, `10 + DES (${dexMod >= 0 ? '+' : ''}${dexMod}) + CON (${conMod >= 0 ? '+' : ''}${conMod}) = <b class="feature-calc-val">CA ${caVal}</b>`);
    } else if (isMonk) {
      const caVal = 10 + dexMod + wisMod;
      name = `Defesa sem Armadura (CA ${caVal})`;
      desc = desc.replace(/(10\s*\+\s*seu\s+modificador[^.]*|10\s*\+\s*[^.\n]*)/i, `10 + DES (${dexMod >= 0 ? '+' : ''}${dexMod}) + SAB (${wisMod >= 0 ? '+' : ''}${wisMod}) = <b class="feature-calc-val">CA ${caVal}</b>`);
    }
  }

  // 2. Resiliência Dracônica (Feiticeiro)
  else if (normName.includes('resiliencia draconica') || normName.includes('draconic resilience')) {
    const caVal = 13 + dexMod;
    name = `Resiliência Dracônica (CA ${caVal}, +${pLvl} PV)`;
  }

  // 3. Cura pelas Mãos (Paladino)
  else if (normName.includes('cura pelas maos') || normName.includes('lay on hands')) {
    const pool = 5 * pLvl;
    name = `Cura pelas Mãos (${pool} PV)`;
  }

  // 4. Sentido Divino (Paladino)
  else if (normName.includes('sentido divino') || normName.includes('divine sense')) {
    const uses = 1 + Math.max(1, chaMod);
    name = `Sentido Divino (${uses} usos/dia)`;
  }

  // 5. Ataque Furtivo (Ladino)
  else if (normName.includes('ataque furtivo') || normName.includes('sneak attack')) {
    const dice = Math.ceil(pLvl / 2) + 'd6';
    name = `Ataque Furtivo (${dice})`;
  }

  // 6. Fúria (Bárbaro)
  else if (normName === 'furia' || normName.startsWith('furia')) {
    const rages = pLvl >= 20 ? 'Ilimitada' : (pLvl >= 17 ? '6' : (pLvl >= 12 ? '5' : (pLvl >= 6 ? '4' : (pLvl >= 3 ? '3' : '2'))));
    const dmgBonus = pLvl >= 16 ? '+4' : (pLvl >= 9 ? '+3' : '+2');
    name = `Fúria (${rages}/dia, ${dmgBonus} Dano)`;
  }

  // 7. Artes Marciais (Monge)
  else if (normName.includes('artes marciais') || normName.includes('martial arts')) {
    const die = pLvl >= 17 ? '1d10' : (pLvl >= 11 ? '1d8' : (pLvl >= 5 ? '1d6' : '1d4'));
    name = `Artes Marciais (${die})`;
  }

  // 8. Inspiração Bárdica (Bardo)
  else if (normName.includes('inspiracao bardica') || normName.includes('bardic inspiration')) {
    const die = pLvl >= 15 ? 'd12' : (pLvl >= 10 ? 'd10' : (pLvl >= 5 ? 'd8' : 'd6'));
    const uses = Math.max(1, chaMod);
    name = `Inspiração Bárdica (${die}, ${uses} usos)`;
  }

  // 9. Retomar o Fôlego (Guerreiro)
  else if (normName.includes('retomar o folego') || normName.includes('second wind')) {
    name = `Retomar o Fôlego (1d10 + ${pLvl} PV)`;
  }

  // 10. Surto de Ação (Guerreiro)
  else if (normName.includes('surto de acao') || normName.includes('action surge')) {
    const uses = pLvl >= 17 ? '2 usos' : '1 uso';
    name = `Surto de Ação (${uses})`;
  }

  // 11. Pontos de Ki (Monge)
  else if (normName.includes('pontos de ki') || normName.includes('ki')) {
    const kiCd = 8 + prof + wisMod;
    name = `Pontos de Ki (${pLvl} Pontos, CD ${kiCd})`;
  }

  // 12. Pontos de Feitiçaria (Feiticeiro)
  else if (normName.includes('pontos de feiticeira') || normName.includes('pontos de feiticaria') || normName.includes('sorcery points')) {
    name = `Pontos de Feitiçaria (${pLvl} Pontos)`;
  }

  // Substituições genéricas em fórmulas explícitas como "(10 + des + con)"
  name = name.replace(/\(10\s*\+\s*des\s*\+\s*con\)/gi, `(CA ${10 + dexMod + conMod})`);
  name = name.replace(/\(10\s*\+\s*des\s*\+\s*sab\)/gi, `(CA ${10 + dexMod + wisMod})`);
  name = name.replace(/\(13\s*\+\s*des\)/gi, `(CA ${13 + dexMod})`);
  name = name.replace(/\(5\s*[x*]\s*n[ií]vel\)/gi, `(${5 * pLvl} PV)`);

  desc = desc.replace(/\(10\s*\+\s*des\s*\+\s*con\)/gi, `(CA ${10 + dexMod + conMod})`);
  desc = desc.replace(/\(10\s*\+\s*des\s*\+\s*sab\)/gi, `(CA ${10 + dexMod + wisMod})`);

  f.name = name;
  f.desc = desc;
  return f;
}

// --- ⚡ RESUMO DIRETO E OBJETIVO DE TRAÇOS E HABILIDADES (ISSUE-163) ---
function normalizeTraitLookupKey(str) {
  if (!str) return '';
  return String(str)
    .split('(')[0]
    .split('—')[0]
    .split('-')[0]
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ');
}

function getPlayerLanguagesString(p) {
  if (!p) return 'Comum';
  if (typeof p.languages === 'string' && p.languages.trim()) return p.languages.trim();
  if (Array.isArray(p.languages) && p.languages.length > 0) return p.languages.join(', ');
  if (p.race && typeof findSpeciesData === 'function') {
    const sp = findSpeciesData(p.race);
    if (sp && Array.isArray(sp.traits)) {
      const langTrait = sp.traits.find(t => t.name && t.name.toLowerCase().includes('idioma'));
      if (langTrait) {
        const raw = (langTrait.description || langTrait.desc || '').replace(/\*\*/g, '');
        const m = raw.match(/escrever\s+([^.]+)\./i);
        if (m && m[1]) return m[1].replace(/\s+e\s+/gi, ', ').trim();
      }
    }
  }
  return 'Comum';
}

function getPlayerTraitQuickSummary(feature, p, clsItem = null) {
  if (!feature) return { name: '', tag: 'Passivo', usage: '', summary: '' };
  const rawName = String(feature.name || '').trim();
  const rawDesc = String(feature.desc || feature.description || '').trim();
  const pObj = p || {};

  const pLvl = parseInt(clsItem ? clsItem.level : (pObj.level || 1)) || 1;
  const totalLvl = parseInt(pObj.level) || pLvl;
  const strVal = typeof getPlayerAttr === 'function' ? getPlayerAttr(pObj, 'for') : (parseInt(pObj.str) || 10);
  const dexVal = typeof getPlayerAttr === 'function' ? getPlayerAttr(pObj, 'des') : (parseInt(pObj.dex) || 10);
  const conVal = typeof getPlayerAttr === 'function' ? getPlayerAttr(pObj, 'con') : (parseInt(pObj.con) || 10);
  const intVal = typeof getPlayerAttr === 'function' ? getPlayerAttr(pObj, 'int') : (parseInt(pObj.int) || 10);
  const wisVal = typeof getPlayerAttr === 'function' ? getPlayerAttr(pObj, 'sab') : (parseInt(pObj.wis) || 10);
  const chaVal = typeof getPlayerAttr === 'function' ? getPlayerAttr(pObj, 'car') : (parseInt(pObj.cha) || 10);

  const strMod = Math.floor((strVal - 10) / 2);
  const dexMod = Math.floor((dexVal - 10) / 2);
  const conMod = Math.floor((conVal - 10) / 2);
  const intMod = Math.floor((intVal - 10) / 2);
  const wisMod = Math.floor((wisVal - 10) / 2);
  const chaMod = Math.floor((chaVal - 10) / 2);
  const prof = typeof getProfBonus === 'function' ? getProfBonus(totalLvl) : (Math.ceil(totalLvl / 4) + 1);

  const clsName = String((clsItem ? clsItem.className : pObj.className) || '').trim();
  const normCls = clsName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // Subclasse escolhida pelo jogador
  let subclassName = pObj.subclass || '';
  if (!subclassName && clsName && typeof findClassData === 'function') {
    const cd = findClassData(clsName);
    const subIdx = clsItem && clsItem.subclassIdx !== undefined ? clsItem.subclassIdx : (pObj.subclassIdx || 0);
    if (cd && Array.isArray(cd.subclasses) && cd.subclasses[subIdx]) {
      subclassName = cd.subclasses[subIdx].name;
    }
  }
  if (!subclassName) subclassName = 'Subclasse escolhida';

  // Habilidade de conjuração e CD
  let spellMod = intMod;
  let spellAttrLabel = 'Inteligência';
  if (normCls.includes('clerigo') || normCls.includes('druida') || normCls.includes('patrulheiro') || normCls.includes('ranger') || normCls.includes('monge')) {
    spellMod = wisMod;
    spellAttrLabel = 'Sabedoria';
  } else if (normCls.includes('bardo') || normCls.includes('bruxo') || normCls.includes('warlock') || normCls.includes('feiticeiro') || normCls.includes('paladino')) {
    spellMod = chaMod;
    spellAttrLabel = 'Carisma';
  }
  const spellDc = 8 + prof + spellMod;
  const spellAtkVal = prof + spellMod;
  const spellAtk = (spellAtkVal >= 0 ? '+' : '') + spellAtkVal;
  const chaSpellDc = 8 + prof + chaMod;

  // Estilo de luta
  let fightingStyleSummary = 'Escolha 1 estilo marcial (+2 ataque à distância, +1 CA de armadura, +2 dano em 1 mão, etc.).';
  if (pObj.fightingStyle && typeof FIGHTING_STYLES !== 'undefined' && FIGHTING_STYLES[pObj.fightingStyle]) {
    const st = FIGHTING_STYLES[pObj.fightingStyle];
    fightingStyleSummary = `${st.name}: ${st.desc}`;
  }

  // Legado Infernal por nível
  let infernalLegacySummary = 'Conhece o truque Taumaturgia (à vontade).';
  if (totalLvl >= 5) {
    infernalLegacySummary = `Taumaturgia (à vontade) • Repreensão Infernal em 2º círc. (1×/Descanso Longo, Reação, CD ${chaSpellDc}) • Escuridão (1×/Descanso Longo).`;
  } else if (totalLvl >= 3) {
    infernalLegacySummary = `Taumaturgia (à vontade) • Repreensão Infernal em 2º círc. (1×/Descanso Longo, Reação, CD ${chaSpellDc}).`;
  }

  // Defesa sem Armadura (Bárbaro vs Monge)
  const isMonkUnarmored = normCls.includes('monge') || rawDesc.toLowerCase().includes('sabedoria');
  const unarmoredAc = isMonkUnarmored
    ? `${10 + dexMod + wisMod} (10 + DES ${dexMod >= 0 ? '+' : ''}${dexMod} + SAB ${wisMod >= 0 ? '+' : ''}${wisMod})`
    : `${10 + dexMod + conMod} (10 + DES ${dexMod >= 0 ? '+' : ''}${dexMod} + CON ${conMod >= 0 ? '+' : ''}${conMod})`;

  const vars = {
    level: pLvl,
    totalLevel: totalLvl,
    prof: prof,
    halfProf: Math.floor(prof / 2),
    halfProfCeil: Math.ceil(prof / 2),
    doubleProf: prof * 2,
    strModNum: strMod,
    dexModNum: dexMod,
    conModNum: conMod,
    intModNum: intMod,
    wisModNum: wisMod,
    chaModNum: chaMod,
    chaModSigned: (chaMod >= 0 ? '+' : '') + chaMod,
    subclassName: subclassName,
    spellAttrLabel: spellAttrLabel,
    spellDc: spellDc,
    spellAtk: spellAtk,
    chaSpellDc: chaSpellDc,
    fightingStyleSummary: fightingStyleSummary,
    infernalLegacySummary: infernalLegacySummary,
    unarmoredAc: unarmoredAc,
    draconicAc: 13 + dexMod,
    rageUses: pLvl >= 20 ? 'Ilimitado' : (pLvl >= 17 ? 6 : (pLvl >= 12 ? 5 : (pLvl >= 6 ? 4 : (pLvl >= 3 ? 3 : 2)))),
    rageDmg: pLvl >= 16 ? '+4' : (pLvl >= 9 ? '+3' : '+2'),
    brutalDice: pLvl >= 17 ? 3 : (pLvl >= 13 ? 2 : 1),
    bardicDie: pLvl >= 15 ? '1d12' : (pLvl >= 10 ? '1d10' : (pLvl >= 5 ? '1d8' : '1d6')),
    bardicUses: Math.max(1, chaMod),
    bardicRest: pLvl >= 5 ? 'Descanso Curto' : 'Descanso Longo',
    songOfRestDie: pLvl >= 17 ? '1d12' : (pLvl >= 13 ? '1d10' : (pLvl >= 9 ? '1d8' : '1d6')),
    pactSlots: pLvl >= 17 ? 4 : (pLvl >= 11 ? 3 : (pLvl >= 2 ? 2 : 1)),
    pactCircle: Math.min(5, Math.ceil(pLvl / 2)),
    invocationsCount: pLvl >= 18 ? 8 : (pLvl >= 15 ? 7 : (pLvl >= 12 ? 6 : (pLvl >= 9 ? 5 : (pLvl >= 7 ? 4 : (pLvl >= 5 ? 3 : (pLvl >= 2 ? 2 : 0)))))),
    tempHpObscuro: Math.max(1, chaMod + pLvl),
    channelUses: pLvl >= 18 ? 3 : (pLvl >= 6 ? 2 : 1),
    destroyUndeadCr: pLvl >= 17 ? '4' : (pLvl >= 14 ? '3' : (pLvl >= 11 ? '2' : (pLvl >= 8 ? '1' : '1/2'))),
    preserveLifePool: 5 * pLvl,
    wisUses: Math.max(1, wisMod),
    wildShapeHours: Math.max(1, Math.floor(pLvl / 2)),
    moonDruidCr: pLvl >= 6 ? Math.floor(pLvl / 3) : 1,
    arcaneRecoveryLevels: Math.ceil(pLvl / 2),
    arcaneWardHp: (2 * pLvl) + intMod,
    actionSurgeUses: pLvl >= 17 ? 2 : 1,
    indomitableUses: pLvl >= 17 ? 3 : (pLvl >= 13 ? 2 : 1),
    maneuverDc: 8 + prof + Math.max(strMod, dexMod),
    sneakDice: Math.ceil(pLvl / 2) + 'd6',
    martialDie: pLvl >= 17 ? '1d10' : (pLvl >= 11 ? '1d8' : (pLvl >= 5 ? '1d6' : '1d4')),
    kiDc: 8 + prof + wisMod,
    monkSpeedBonus: pLvl >= 18 ? 9 : (pLvl >= 14 ? 7.5 : (pLvl >= 10 ? 6 : (pLvl >= 6 ? 4.5 : 3))),
    slowFallRed: 5 * pLvl,
    divineSenseUses: 1 + Math.max(0, chaMod),
    layOnHands: 5 * pLvl,
    auraBonus: Math.max(1, chaMod),
    breathSaveDc: 8 + prof + conMod,
    breathDamage: totalLvl >= 16 ? '5d6' : (totalLvl >= 11 ? '4d6' : (totalLvl >= 6 ? '3d6' : '2d6'))
  };

  const replaceVars = str => {
    if (!str) return '';
    return String(str).replace(/\{([a-zA-Z0-9_]+)\}/g, (_, k) => (vars[k] !== undefined ? String(vars[k]) : ''));
  };

  const lookupKey = normalizeTraitLookupKey(rawName);
  const fullNormKey = rawName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

  // Caso especial: ASI
  if (feature.isAsi || fullNormKey.includes('aumento no valor de habilidade') || fullNormKey.includes('aumento no valor de atributo') || fullNormKey.startsWith('aumento de habilidade')) {
    const asiLvl = feature.asiLevel || feature.level || 4;
    const asiKey = `${clsName.toLowerCase()}_lvl_${asiLvl}`;
    const choice = (pObj.asiChoices && pObj.asiChoices[asiKey]) || null;
    if (choice) {
      return {
        name: `ASI Nv ${asiLvl}: ${choice.label}`,
        tag: 'Passivo',
        usage: 'Ativo na ficha',
        summary: `Escolha de ${asiLvl}º nível aplicada: ${choice.label}.`
      };
    }
    return {
      name: `Aumento de Atributo / Talento (Nv ${asiLvl})`,
      tag: 'Passivo',
      usage: 'Marco de Nível',
      summary: '+2 em um atributo, +1 em dois atributos ou 1 Talento oficial.'
    };
  }

  // Busca no dicionário TRAIT_QUICK_RULES
  const dict = (typeof TRAIT_QUICK_RULES !== 'undefined' && TRAIT_QUICK_RULES) ? TRAIT_QUICK_RULES : null;
  let rule = null;
  if (dict) {
    rule = dict[lookupKey] || dict[fullNormKey] || null;
    if (!rule) {
      const matchedKey = Object.keys(dict).find(k => lookupKey.startsWith(k) || k.startsWith(lookupKey));
      if (matchedKey && lookupKey.length >= 4) {
        rule = dict[matchedKey];
      }
    }
  }

  // Busca em FEATS_DATA se for talento
  if (!rule && typeof FEATS_DATA !== 'undefined' && Array.isArray(FEATS_DATA)) {
    const foundFeat = FEATS_DATA.find(ft => normalizeTraitLookupKey(ft.name) === lookupKey);
    if (foundFeat) {
      const cleanSummary = String(foundFeat.summary || foundFeat.description || '').replace(/\*\*/g, '').split('\n')[0];
      return {
        name: foundFeat.name,
        tag: 'Talento',
        usage: foundFeat.prerequisite ? `Pré-req: ${foundFeat.prerequisite}` : 'Passivo / Ativo',
        summary: cleanSummary
      };
    }
  }

  if (rule) {
    return {
      name: rawName,
      tag: replaceVars(rule.tag || 'Passivo'),
      usage: replaceVars(rule.usage || ''),
      summary: replaceVars(rule.summary || '')
    };
  }

  // Fallback inteligente: determina tag de ação, extrai recarga e enxuga o texto
  const actType = typeof getFeatureActionType === 'function' ? getFeatureActionType({ name: rawName, desc: rawDesc }, pObj) : 'passive';
  const tagLabel = actType === 'bonus' ? 'Ação Bônus' : (actType === 'reaction' ? 'Reação' : (actType === 'action' ? 'Ação' : 'Passivo'));

  let usage = '';
  const lowDesc = rawDesc.toLowerCase();
  if (lowDesc.includes('descanso curto ou longo')) usage = '1×/Descanso Curto';
  else if (lowDesc.includes('descanso longo')) usage = 'Descanso Longo';
  else if (lowDesc.includes('descanso curto')) usage = 'Descanso Curto';

  let cleanText = rawDesc
    .replace(/<[^>]+>/g, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/^(no|a partir do)\s+\d+[º°]\s+n[ií]vel,\s*/i, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (cleanText.length > 180) {
    const firstSentence = cleanText.split(/(?<=[.!])\s+/)[0];
    cleanText = firstSentence && firstSentence.length <= 200 ? firstSentence : (cleanText.slice(0, 177).trim() + '...');
  }

  return {
    name: rawName,
    tag: tagLabel,
    usage: usage,
    summary: cleanText
  };
}

const PLAYER_FEATURES_CACHE = {};

function registerFeatureForModal(name, desc, type, source) {
  const key = 'feat_' + Math.random().toString(36).substring(2, 10);
  PLAYER_FEATURES_CACHE[key] = { name, desc, type, source };
  return key;
}

function openPlayerFeatureModalByKey(key) {
  const feat = PLAYER_FEATURES_CACHE[key];
  if (!feat) return;
  openPlayerFeatureModal(feat.name, feat.desc, feat.type, feat.source);
}

function formatFeatureSnippet(rawDesc) {
  if (!rawDesc) return '';
  const desc = String(rawDesc).trim();

  // Divide por tópicos sinalizados por '•' ou quebras de linha
  if (desc.includes('•') || desc.includes('\n')) {
    let chunks = [];
    if (desc.includes('•')) {
      chunks = desc.split('•').map(c => c.trim()).filter(Boolean);
    } else {
      chunks = desc.split(/\r?\n+/).map(c => c.trim()).filter(Boolean);
    }

    if (chunks.length <= 1) {
      return typeof highlightInlineRules === 'function' ? highlightInlineRules(chunks[0] || desc) : desc;
    }

    let html = '';
    let startIndex = 0;

    // Se o primeiro pedaço não começar como tópico rotulado (**X**:), tratamos como introdução conceitual
    const firstChunk = chunks[0];
    const isLabeledTopic = /^\*\*.*?\*\*:/.test(firstChunk);
    if (!isLabeledTopic && firstChunk.length > 5) {
      const formattedIntro = typeof highlightInlineRules === 'function' ? highlightInlineRules(firstChunk) : firstChunk;
      html += `<div class="feature-snippet-intro">${formattedIntro}</div>`;
      startIndex = 1;
    }

    html += '<div class="feature-bullets-list">';
    for (let i = startIndex; i < chunks.length; i++) {
      const chunk = chunks[i];
      if (!chunk) continue;
      const formattedChunk = typeof highlightInlineRules === 'function' ? highlightInlineRules(chunk) : chunk;
      html += `
        <div class="feature-bullet-row">
          <span class="feature-bullet-dot">✦</span>
          <div class="feature-bullet-text">${formattedChunk}</div>
        </div>
      `;
    }
    html += '</div>';
    return html;
  }

  // Caso seja texto contínuo, aplica highlightInlineRules
  return typeof highlightInlineRules === 'function' ? highlightInlineRules(desc) : desc;
}

function renderPlayerUnlockedFeatures(p, actionFilter = 'all', textFilter = '', isExpandedAll = false, openItemsSet = null) {
  const classesList = getPlayerClassesList(p);
  let html = '';
  let totalFeaturesCount = 0;
  let matchingFeaturesCount = 0;

  classesList.forEach(clsItem => {
    const unlocked = getUnlockedClassFeatures(clsItem.className, clsItem.level, clsItem.subclassIdx || 0);
    if (unlocked.length > 0) {
      totalFeaturesCount += unlocked.length;

      // Filtra de acordo com a economia de ações e busca textual
      const matching = unlocked.filter(f => {
        if (actionFilter !== 'all') {
          const actType = getFeatureActionType(f, p);
          if (actType !== actionFilter) return false;
        }
        if (textFilter) {
          const q = textFilter.toLowerCase();
          const nameMatches = (f.name || '').toLowerCase().includes(q);
          const descMatches = (f.desc || '').toLowerCase().includes(q);
          if (!nameMatches && !descMatches) return false;
        }
        return true;
      });

      if (matching.length === 0) return;
      matchingFeaturesCount += matching.length;

      html += `
        <div class="feature-class-group-header">
          <span>🌳</span> <span>Habilidades de ${clsItem.className} (Nível ${clsItem.level}):</span>
        </div>
        <div class="unlocked-features-list">
          ${matching.map(f => {
        const formatted = formatPlayerFeatureForDisplay(f, p, clsItem);
        const actType = getFeatureActionType(f, p);
        const actTagLabel = actType === 'bonus' ? 'Bônus' : (actType === 'reaction' ? 'Reação' : (actType === 'action' ? 'Ação' : 'Passiva'));
        const actBadgeHtml = `<span class="action-economy-tag ${actType}">${actTagLabel}</span>`;

        const isFightingStyleFeature = f.name && f.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes('estilo de luta');
        let fightingStyleActionHtml = '';
        if (isFightingStyleFeature) {
          const curStyle = p.fightingStyle || '';
          const styleObj = (typeof FIGHTING_STYLES !== 'undefined' && FIGHTING_STYLES[curStyle]) ? FIGHTING_STYLES[curStyle] : null;
          fightingStyleActionHtml = '<div class="feature-fighting-style-box" onclick="event.stopPropagation();">' +
            '<div class="feature-fighting-style-header">' +
            '<span>⚔️ Escolha de Especialidade Marcial:</span>' +
            (styleObj ? '<span class="feature-active-style-badge">' + styleObj.icon + ' ' + styleObj.name + '</span>' : '<span style="color:#f87171; font-size:10px;">⚠️ Escolha Pendente</span>') +
            '</div>' +
            '<select class="feature-inline-select" onchange="setPlayerFightingStyle(\'' + p.id + '\', this.value, event)" title="Selecione o seu Estilo de Luta para aplicar bônus imediatos na ficha">' +
            '<option value="">-- Selecione o Estilo de Luta --</option>' +
            Object.values(FIGHTING_STYLES).map(st => '<option value="' + st.id + '" ' + (curStyle === st.id ? 'selected' : '') + '>' + st.icon + ' ' + st.name + ': ' + st.desc + '</option>').join('') +
            '</select>' +
            '</div>';
        }

        // Box de Aumento no Valor de Habilidade / Talento por Marco de Nível (ISSUE-143)
        const isAsiFeature = f.isAsi || (f.name && f.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes('aumento no valor de'));
        let asiActionHtml = '';
        if (isAsiFeature) {
          const asiLvl = f.asiLevel || f.level || 4;
          const clsKey = (clsItem ? clsItem.className : (p.className || '')).toLowerCase();
          const asiKey = `${clsKey}_lvl_${asiLvl}`;
          const choice = (p.asiChoices && p.asiChoices[asiKey]) || null;
          if (choice) {
            asiActionHtml = '<div class="feature-asi-box" onclick="event.stopPropagation();">' +
              '<div class="feature-asi-header">' +
              '<span>📈 Marco do ' + asiLvl + 'º Nível:</span>' +
              '<span class="feature-asi-status-badge active">✅ ' + choice.label + '</span>' +
              '</div>' +
              '<div style="display:flex; justify-content:flex-end; margin-top:4px;">' +
              '<button type="button" class="btn-secondary feature-asi-btn" onclick="openAsiChoiceModal(\'' + p.id + '\', ' + asiLvl + ', \'' + clsItem.className + '\')" title="Alterar a escolha deste nível">' +
              '✏️ Alterar Escolha' +
              '</button>' +
              '</div>' +
              '</div>';
          } else {
            asiActionHtml = '<div class="feature-asi-box pending" onclick="event.stopPropagation();">' +
              '<div class="feature-asi-header">' +
              '<span>📈 Marco do ' + asiLvl + 'º Nível:</span>' +
              '<span class="feature-asi-status-badge pending">⚠️ Escolha Pendente</span>' +
              '</div>' +
              '<div style="display:flex; justify-content:flex-end; margin-top:4px;">' +
              '<button type="button" class="btn-action feature-asi-btn" onclick="openAsiChoiceModal(\'' + p.id + '\', ' + asiLvl + ', \'' + clsItem.className + '\')" title="Fazer a escolha de Atributo ou Talento">' +
              '📈 Escolher Atributo ou Talento' +
              '</button>' +
              '</div>' +
              '</div>';
          }
        }

        const featKey = registerFeatureForModal(formatted.name, formatted.desc, formatted.type || (actTagLabel + ' de Classe'), formatted.source || clsItem.className);
        const rawBaseName = (f.name ? f.name.split('(')[0] : (formatted.name ? formatted.name.split('(')[0] : '')).trim();
        const featCleanName = rawBaseName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
        const accordionKey = `${p.id}_class_${featCleanName}`;
        const isOpen = isExpandedAll || (openItemsSet && openItemsSet.has(accordionKey));
        const quickInfo = typeof getPlayerTraitQuickSummary === 'function' ? getPlayerTraitQuickSummary(f, p, clsItem) : null;
        const quickUsageBadge = (quickInfo && quickInfo.usage) ? `<span class="feature-usage-pill">⏱️ ${quickInfo.usage}</span>` : '';

        return `
            <div class="unlocked-feature-item feature-class ${isOpen ? 'open' : ''}" onclick="togglePlayerFeatureAccordion('${accordionKey}', event)" title="Clique para expandir / recolher detalhes">
              <div style="display:flex; justify-content:space-between; align-items:center; gap: 4px;">
                <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
                  <span class="feature-chevron ${isOpen ? 'open' : ''}">${isOpen ? '▼' : '▶'}</span>
                  <span style="font-weight:700; color:#fff; font-size:12px;">${formatted.name}</span>
                  ${actBadgeHtml}
                  ${quickUsageBadge}
                </div>
                <div style="display:flex; align-items:center; gap:4px;">
                  <button type="button" class="btn-chat-feed" onclick="event.stopPropagation(); openPlayerFeatureModalByKey('${featKey}')" title="Ver detalhes completos em pop-up">💬</button>
                  <span class="badge ${formatted.isSubclass ? 'badge-sub' : 'badge-cls'}" style="font-size:9px;">Nv ${formatted.level}</span>
                </div>
              </div>
              <div class="feature-snippet">
                ${quickInfo && quickInfo.summary ? `<div class="feature-direct-summary">⚡ ${quickInfo.summary}</div>` : formatFeatureSnippet(formatted.desc)}
              </div>
              <div class="feature-full-desc ${isOpen ? 'open' : ''}">
                ${typeof highlightInlineRules === 'function' ? highlightInlineRules(formatted.desc) : formatted.desc}
              </div>
              ${fightingStyleActionHtml}
              ${asiActionHtml}
            </div>
            `;
      }).join('')}
        </div>
      `;
    }
  });

  if (actionFilter !== 'all' && matchingFeaturesCount === 0) {
    const actFilterLabel = actionFilter === 'bonus' ? 'Ação Bônus' : (actionFilter === 'reaction' ? 'Reação' : 'Ação');
    return `<div style="background: rgba(0,0,0,0.25); border: 1px dashed var(--border-color); padding: 8px; border-radius: 6px; text-align: center; color: var(--text-muted); font-size: 11px;">Nenhuma característica de classe com custo de ${actFilterLabel}.</div>`;
  }

  if (totalFeaturesCount === 0 && !p.features) {
    return `<div style="background: rgba(0,0,0,0.25); border: 1px dashed var(--border-color); padding: 10px; border-radius: 6px; text-align: center; color: var(--text-muted); font-size: 11px;">Nenhuma habilidade de classe registrada.</div>`;
  }

  return html;
}

function renderPlayerRacialTraits(p, textFilter = '', isExpandedAll = false, openItemsSet = null) {
  if (!p || !p.race) return '';
  const sp = typeof findSpeciesData === 'function' ? findSpeciesData(p.race) : null;
  if (!sp || !Array.isArray(sp.traits) || sp.traits.length === 0) return '';

  const traits = sp.traits.filter(t => {
    if (t.name && t.name.toLowerCase().includes('aumento no valor')) return false;
    if (textFilter) {
      const q = textFilter.toLowerCase();
      const nameMatches = (t.name || '').toLowerCase().includes(q);
      const descMatches = ((t.description || t.desc) || '').toLowerCase().includes(q);
      if (!nameMatches && !descMatches) return false;
    }
    return true;
  });

  if (traits.length === 0) return '';

  return `
    <div class="feature-class-group-header feature-race-group-header">
      <span>${sp.icon || '🧬'}</span> <span>Traços Raciais da Espécie: <b>${sp.name}</b> (${p.race})</span>
    </div>
    <div class="unlocked-features-list">
      ${traits.map(t => {
    const desc = t.description || t.desc || '';
    const featKey = registerFeatureForModal(t.name, desc, t.type || 'Traço Racial', sp.name);
    const rawTraitBaseName = (t.name ? t.name.split('(')[0] : '').trim();
    const traitCleanName = rawTraitBaseName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
    const accordionKey = `${p.id}_race_${traitCleanName}`;
    const isOpen = isExpandedAll || (openItemsSet && openItemsSet.has(accordionKey));
    const quickInfo = typeof getPlayerTraitQuickSummary === 'function' ? getPlayerTraitQuickSummary({ name: t.name, desc: desc, type: t.type }, p) : null;
    const quickUsageBadge = (quickInfo && quickInfo.usage) ? `<span class="feature-usage-pill">⏱️ ${quickInfo.usage}</span>` : '';

    return `
        <div class="unlocked-feature-item feature-species ${isOpen ? 'open' : ''}" onclick="togglePlayerFeatureAccordion('${accordionKey}', event)" title="Clique para expandir / recolher detalhes do traço racial">
          <div style="display:flex; justify-content:space-between; align-items:center; gap: 4px;">
            <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
              <span class="feature-chevron ${isOpen ? 'open' : ''}">${isOpen ? '▼' : '▶'}</span>
              <span style="font-weight:700; color:#fff; font-size:12px;">${t.name}</span>
              <span class="action-economy-tag passive">${(quickInfo && quickInfo.tag) ? quickInfo.tag : (t.type || 'Racial')}</span>
              ${quickUsageBadge}
            </div>
            <div style="display:flex; align-items:center; gap:4px;">
              <button type="button" class="btn-chat-feed" onclick="event.stopPropagation(); openPlayerFeatureModalByKey('${featKey}')" title="Ver detalhes do traço em pop-up">💬</button>
              <span class="badge badge-race" style="font-size:9px;">Raça</span>
            </div>
          </div>
          <div class="feature-snippet">
            ${quickInfo && quickInfo.summary ? `<div class="feature-direct-summary">⚡ ${quickInfo.summary}</div>` : (typeof formatFeatureSnippet === 'function' ? formatFeatureSnippet(desc) : desc)}
          </div>
          <div class="feature-full-desc ${isOpen ? 'open' : ''}">
            ${typeof highlightInlineRules === 'function' ? highlightInlineRules(desc) : desc}
          </div>
        </div>
        `;
  }).join('')}
    </div>
  `;
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
function openSpellQuickSummaryModal(spellName, playerId = null, event = null) {
  if (event) event.stopPropagation();
  const modal = document.getElementById('modal-spell-summary');
  if (!modal) return;

  const sp = (typeof SPELLS_DATA !== 'undefined' && Array.isArray(SPELLS_DATA))
    ? SPELLS_DATA.find(s => s.name.toLowerCase() === (spellName || '').toLowerCase())
    : null;

  if (!sp) {
    if (typeof showToast === 'function') showToast(`Magia "${spellName}" não encontrada no catálogo.`, 'warning');
    return;
  }

  const p = (playerId && typeof PLAYERS !== 'undefined' && Array.isArray(PLAYERS))
    ? PLAYERS.find(x => x.id === playerId)
    : null;

  const isCantrip = sp.level === 0;
  const circleText = isCantrip ? 'Truque' : `${sp.level}º Círculo`;
  const spAct = typeof getSpellActionType === 'function' ? getSpellActionType(sp) : 'action';
  const spActLabel = spAct === 'bonus' ? 'Ação Bônus' : (spAct === 'reaction' ? 'Reação' : 'Ação');
  const isConc = (sp.duration || '').toLowerCase().includes('concentra') || (sp.desc || '').toLowerCase().includes('concentra');
  const isRitual = (sp.components || '').toLowerCase().includes('r') || (sp.time || '').toLowerCase().includes('ritual') || (sp.desc || '').toLowerCase().includes('ritual');

  const nameEl = document.getElementById('spell-summary-name');
  if (nameEl) nameEl.innerText = sp.name;

  const metaEl = document.getElementById('spell-summary-meta');
  if (metaEl) {
    metaEl.innerHTML = `
      <span>${circleText}</span>
      <span>•</span>
      <span style="color:#c084fc;">${sp.school || 'Magia'}</span>
      ${sp.classes && sp.classes.length > 0 ? `<span>•</span> <span>${sp.classes.slice(0, 3).join(', ')}</span>` : ''}
    `;
  }

  const tagsContainer = document.getElementById('spell-summary-tags-container');
  if (tagsContainer) {
    tagsContainer.innerHTML = `
      <span class="skill-tag-pill ${isCantrip ? 'gold' : ''}">${circleText}</span>
      <span class="skill-tag-pill" style="border-color:rgba(192,132,252,0.4); color:#c084fc;">${sp.school || 'Magia'}</span>
      <span class="action-economy-tag ${spAct}">${spActLabel}</span>
      ${isConc ? '<span class="badge badge-cr" style="font-size:10px;">🧠 Concentração</span>' : ''}
      ${isRitual ? '<span class="badge badge-src" style="font-size:10px;">📜 Ritual</span>' : ''}
    `;
  }

  const timeEl = document.getElementById('spell-summary-time');
  if (timeEl) timeEl.innerText = sp.time || sp.castTime || '1 ação';

  const rangeEl = document.getElementById('spell-summary-range');
  if (rangeEl) rangeEl.innerText = sp.range || 'Pessoal';

  const durEl = document.getElementById('spell-summary-duration');
  if (durEl) durEl.innerText = sp.duration || 'Instantânea';

  const compEl = document.getElementById('spell-summary-components');
  if (compEl) compEl.innerText = sp.components || 'V, S';

  const casterBox = document.getElementById('spell-summary-caster-box');
  const statusTag = document.getElementById('spell-summary-status-tag');
  const btnCast = document.getElementById('btn-spell-summary-cast');
  const btnRoll = document.getElementById('btn-spell-summary-roll');

  if (p) {
    const castStats = typeof getPlayerSpellcastingStats === 'function' ? getPlayerSpellcastingStats(p) : { saveDc: 10, attackBonus: '+2', ability: 'INT', modStr: '+0', profBonus: 2 };
    if (casterBox) casterBox.style.display = 'flex';

    const casterNameEl = document.getElementById('spell-summary-caster-name');
    if (casterNameEl) casterNameEl.innerText = `${p.name} (${p.className || 'Herói'})`;

    const cdBadge = document.getElementById('spell-summary-cd-badge');
    if (cdBadge) cdBadge.innerText = `CD ${castStats.saveDc} (${castStats.ability})`;

    const atkBadge = document.getElementById('spell-summary-atk-badge');
    if (atkBadge) atkBadge.innerText = `Ataque ${castStats.attackBonus}`;

    const slotsBadge = document.getElementById('spell-summary-slots-badge');
    if (slotsBadge) {
      if (isCantrip) {
        slotsBadge.innerText = 'Truque (Livre)';
      } else {
        const slotIdx = sp.level - 1;
        const maxSlots = (p.slots || [])[slotIdx] || 0;
        const usedSlots = (p.slotsUsed || [])[slotIdx] || 0;
        const remSlots = Math.max(0, maxSlots - usedSlots);
        slotsBadge.innerText = `${remSlots}/${maxSlots} Espaços Nv ${sp.level}`;
      }
    }

    const isPrepared = (p.preparedSpells || []).some(s => s.toLowerCase() === sp.name.toLowerCase());
    if (statusTag) {
      statusTag.innerHTML = isPrepared
        ? '<span style="color:#34d399; font-weight:700;">⭐ Magia Ativa / Preparada na Ficha</span>'
        : '<span style="color:var(--text-dim);">⚠️ Magia Não Preparada</span>';
    }

    if (btnCast) {
      btnCast.style.display = 'inline-flex';
      btnCast.onclick = () => {
        closeSpellQuickSummaryModal();
        if (typeof castPlayerSpellPrompt === 'function') {
          castPlayerSpellPrompt(p.id, sp.name);
        }
      };
    }

    const diceInfo = typeof getSpellDiceInfo === 'function' ? getSpellDiceInfo(sp, p) : null;
    if (diceInfo && btnRoll) {
      btnRoll.style.display = 'inline-flex';
      btnRoll.innerText = `🎲 Rolar ${diceInfo.label}`;
      btnRoll.onclick = () => {
        if (typeof rollPlayerSpellDice === 'function') rollPlayerSpellDice(p.id, sp.name);
      };
    } else if (btnRoll) {
      btnRoll.style.display = 'none';
    }
  } else {
    if (casterBox) casterBox.style.display = 'none';
    if (statusTag) statusTag.innerText = '';
    if (btnCast) btnCast.style.display = 'none';
    if (btnRoll) btnRoll.style.display = 'none';
  }

  const descEl = document.getElementById('spell-summary-desc');
  if (descEl) {
    const formattedDesc = typeof highlightInlineRules === 'function'
      ? highlightInlineRules(sp.desc || '')
      : (sp.desc || '').replace(/\n/g, '<br>');
    descEl.innerHTML = formattedDesc;
  }

  modal.classList.add('open');
}

function closeSpellQuickSummaryModal() {
  const modal = document.getElementById('modal-spell-summary');
  if (modal) modal.classList.remove('open');
}

function openSpellQuickView(spellName, playerId = null, event = null) {
  if (event) event.stopPropagation();
  if (typeof triggerHapticFeedback === 'function') triggerHapticFeedback([15]);
  const modal = document.getElementById('modal-spell-quick-view');
  if (!modal) {
    if (typeof openSpellQuickSummaryModal === 'function') {
      openSpellQuickSummaryModal(spellName, playerId, event);
    }
    return;
  }

  const sp = (typeof SPELLS_DATA !== 'undefined' && Array.isArray(SPELLS_DATA))
    ? SPELLS_DATA.find(s => s.name.toLowerCase() === (spellName || '').toLowerCase())
    : null;

  const isCantrip = sp && sp.level === 0;
  const circleText = sp ? (isCantrip ? 'Truque' : `${sp.level}º Círculo`) : 'Magia';
  const school = sp ? sp.school : '';
  const time = sp ? (sp.time || sp.castTime || '1 Ação') : '1 Ação';
  const range = sp ? (sp.range || 'Pessoal') : 'Pessoal';
  const duration = sp ? (sp.duration || 'Instantâneo') : 'Instantâneo';
  const desc = sp ? (sp.desc || 'Sem descrição cadastrada.') : 'Magia D&D 5E.';

  const nameEl = document.getElementById('sqv-name');
  const typeEl = document.getElementById('sqv-type');
  const timeEl = document.getElementById('sqv-time');
  const rangeEl = document.getElementById('sqv-range');
  const durEl = document.getElementById('sqv-duration');
  const descEl = document.getElementById('sqv-desc');
  const btnCast = document.getElementById('sqv-btn-cast');

  if (nameEl) nameEl.textContent = spellName;
  if (typeEl) typeEl.textContent = `${circleText} • ${school || 'Magia'}`;
  if (timeEl) timeEl.textContent = time;
  if (rangeEl) rangeEl.textContent = range;
  if (durEl) durEl.textContent = duration;
  if (descEl) descEl.innerHTML = desc;

  const btnShare = document.getElementById('sqv-btn-share');
  if (btnShare) {
    btnShare.onclick = () => {
      closeSpellQuickView();
      if (playerId && typeof sharePlayerSpellToFeed === 'function') {
        sharePlayerSpellToFeed(playerId, spellName);
      }
    };
  }

  if (btnCast) {
    btnCast.onclick = () => {
      closeSpellQuickView();
      if (playerId && typeof castPlayerSpellPrompt === 'function') {
        castPlayerSpellPrompt(playerId, spellName);
      }
    };
  }

  modal.classList.add('open');
  modal.style.display = 'flex';
}

function closeSpellQuickView() {
  const modal = document.getElementById('modal-spell-quick-view');
  if (modal) {
    modal.classList.remove('open');
    modal.style.display = 'none';
  }
}

// ISSUE-134: Resumo Rápido de Itens (O que o item faz)
function openItemQuickView(playerId, itemIndex, event = null) {
  if (event) event.stopPropagation();
  if (typeof triggerHapticFeedback === 'function') triggerHapticFeedback([15]);
  const modal = document.getElementById('modal-item-quick-view');
  if (!modal) return;

  const p = PLAYERS.find(x => x.id === playerId);
  if (!p || !p.inventory || !p.inventory[itemIndex]) return;
  const it = p.inventory[itemIndex];

  let eq = null;
  if (typeof EQUIPMENT_DATA !== 'undefined' && Array.isArray(EQUIPMENT_DATA)) {
    const clean = (it.name || '').toLowerCase().trim();
    eq = EQUIPMENT_DATA.find(e => e.name.toLowerCase() === clean || clean.includes(e.name.toLowerCase()) || e.name.toLowerCase().includes(clean));
  }

  const cat = it.category || (eq ? eq.category : '') || 'Equipamento Geral';
  const cost = it.cost || (eq ? eq.cost : '') || '-';
  const damage = it.damage || (eq ? eq.damage : '') || '-';
  const weight = it.weight ? `${it.weight} kg` : (eq ? eq.weight : '-');
  const qty = parseInt(it.qty, 10) || 1;
  const desc = it.desc || it.prop || (eq ? eq.prop : '') || 'Item padrão de aventura. Não possui regras adicionais cadastradas.';

  let icon = '🎒';
  const catLower = cat.toLowerCase();
  const nameLower = (it.name || '').toLowerCase();
  if (catLower.includes('armadura') || catLower.includes('escudo') || nameLower.includes('escudo')) icon = '🛡️';
  else if (catLower.includes('arma') || nameLower.includes('espada') || nameLower.includes('arco') || nameLower.includes('machado')) icon = '⚔️';
  else if (catLower.includes('poção') || nameLower.includes('poção') || nameLower.includes('pocao')) icon = '🧪';
  else if (catLower.includes('pergaminho') || nameLower.includes('pergaminho')) icon = '📜';
  else if (nameLower.includes('tocha') || nameLower.includes('fogo')) icon = '🔥';
  else if (it.attuned) icon = '💎';

  const iconEl = document.getElementById('iqv-icon');
  const nameEl = document.getElementById('iqv-name');
  const typeEl = document.getElementById('iqv-type');
  const dmgEl = document.getElementById('iqv-damage');
  const weightEl = document.getElementById('iqv-weight');
  const qtyEl = document.getElementById('iqv-qty');
  const descEl = document.getElementById('iqv-desc');
  const btnShare = document.getElementById('iqv-btn-share');
  const btnTrade = document.getElementById('iqv-btn-trade');
  const btnEdit = document.getElementById('iqv-btn-edit');
  const btnEquip = document.getElementById('iqv-btn-equip');
  const btnUse = document.getElementById('iqv-btn-use');

  if (iconEl) iconEl.textContent = icon;
  if (nameEl) nameEl.textContent = it.name;
  if (typeEl) typeEl.textContent = `${cat} • ${cost}`;
  if (dmgEl) dmgEl.textContent = damage;
  if (weightEl) weightEl.textContent = weight;
  if (qtyEl) qtyEl.textContent = `${qty}x`;
  if (descEl) descEl.innerHTML = desc;

  if (btnShare) {
    btnShare.onclick = () => {
      closeItemQuickView();
      sharePlayerItemToFeed(playerId, itemIndex);
    };
  }

  if (btnTrade) {
    btnTrade.onclick = () => {
      closeItemQuickView();
      if (typeof openTradeItemModal === 'function') {
        openTradeItemModal(playerId, itemIndex);
      }
    };
  }

  if (btnEdit) {
    btnEdit.onclick = () => {
      closeItemQuickView();
      if (typeof openEditPlayerItemModal === 'function') {
        openEditPlayerItemModal(playerId, itemIndex);
      }
    };
  }

  if (btnEquip) {
    btnEquip.textContent = it.equipped ? '❌ Desequipar' : '🛡️ Equipar';
    btnEquip.style.background = it.equipped ? 'rgba(239, 68, 68, 0.8)' : '#10b981';
    btnEquip.onclick = () => {
      closeItemQuickView();
      togglePlayerItemEquipped(playerId, itemIndex);
    };
  }

  const actionInfo = typeof getItemActionInfo === 'function' ? getItemActionInfo(it.name) : { isConsumable: false };
  const isArmorOrShield = catLower.includes('armadura') || catLower.includes('escudo');
  const isWeapon = catLower.includes('arma');
  const isConsumable = actionInfo.isConsumable && !isArmorOrShield && !isWeapon;

  if (btnUse) {
    if (isConsumable) {
      btnUse.style.display = 'inline-block';
      btnUse.textContent = `${actionInfo.icon || '⚡'} ${actionInfo.label || 'Usar'}`;
      btnUse.onclick = () => {
        closeItemQuickView();
        usePlayerInventoryItem(playerId, itemIndex);
      };
    } else {
      btnUse.style.display = 'none';
    }
  }

  modal.classList.add('open');
  modal.style.display = 'flex';
}

function closeItemQuickView() {
  const modal = document.getElementById('modal-item-quick-view');
  if (modal) {
    modal.classList.remove('open');
    modal.style.display = 'none';
  }
}


function isWizardPlayer(p) {
  if (!p) return false;
  const norm = (p.className || '').toLowerCase();
  if (norm.includes('mago') || norm.includes('wizard')) return true;
  if (Array.isArray(p.classes)) {
    return p.classes.some(c => (c.className || c.name || '').toLowerCase().includes('mago'));
  }
  return false;
}

function ensurePlayerSpellbook(p) {
  if (!p) return;
  if (!Array.isArray(p.spellbookSpells)) {
    p.spellbookSpells = Array.isArray(p.preparedSpells) ? [...p.preparedSpells] : [];
  }
  if (Array.isArray(p.preparedSpells)) {
    p.preparedSpells.forEach(sName => {
      if (!p.spellbookSpells.includes(sName)) {
        p.spellbookSpells.push(sName);
      }
    });
  }
}

function getSpellCopyCost(spellObj, player) {
  if (!spellObj) return { gold: 0, hours: 0, isDiscounted: false, canAfford: true, curGold: 0 };
  const lvl = spellObj.level || 0;
  if (lvl === 0) return { gold: 0, hours: 0, isDiscounted: false, canAfford: true, curGold: 0 };

  let isDiscounted = false;
  if (player) {
    const sub = (player.subclass || '').toLowerCase();
    const school = (spellObj.school || '').toLowerCase();
    if (sub && school && (sub.includes(school) || school.includes(sub))) {
      isDiscounted = true;
    }
  }

  const goldPerCircle = isDiscounted ? 25 : 50;
  const hoursPerCircle = isDiscounted ? 1 : 2;
  const gold = lvl * goldPerCircle;
  const hours = lvl * hoursPerCircle;

  const curGold = (player && player.coins && player.coins.gp !== undefined)
    ? player.coins.gp
    : ((player && player.gold) ? player.gold : 0);
  const canAfford = curGold >= gold;

  return { gold, hours, isDiscounted, canAfford, curGold };
}

function copySpellToSpellbook(playerId, spellName, isFree = false) {
  const p = PLAYERS.find(x => x.id === playerId);
  if (!p) return;
  ensurePlayerSpellbook(p);

  if (p.spellbookSpells.includes(spellName)) {
    if (typeof showToast === 'function') showToast(`A magia "${spellName}" já consta no seu Grimório!`, 'warning');
    return;
  }

  const sp = typeof SPELLS_DATA !== 'undefined' ? SPELLS_DATA.find(s => s.name.toLowerCase() === spellName.toLowerCase()) : null;
  const costInfo = getSpellCopyCost(sp, p);

  if (!isFree && costInfo.gold > 0) {
    if (!costInfo.canAfford) {
      if (typeof showToast === 'function') showToast(`Ouro insuficiente! A transcrição de ${spellName} requer ${costInfo.gold} PO (saldo: ${costInfo.curGold} PO).`, 'error');
      return;
    }
    if (p.coins && p.coins.gp !== undefined) {
      p.coins.gp = Math.max(0, p.coins.gp - costInfo.gold);
      p.gold = p.coins.gp;
    } else {
      p.gold = Math.max(0, (p.gold || 0) - costInfo.gold);
    }
  }

  p.spellbookSpells.push(spellName);

  // Auto-preparação: se o herói ainda tiver vagas livres de preparação diária, já inclui nas preparadas para a sessão!
  if (!p.preparedSpells) p.preparedSpells = [];
  const prepInfo = typeof getMaxPreparedSpells === 'function' ? getMaxPreparedSpells(p) : null;
  const currentPrepLeveled = p.preparedSpells.filter(s => {
    const spObj = typeof SPELLS_DATA !== 'undefined' ? SPELLS_DATA.find(x => x.name.toLowerCase() === s.toLowerCase()) : null;
    return !spObj || spObj.level > 0;
  }).length;
  let autoPrepped = false;
  if (prepInfo && prepInfo.maxLeveled && currentPrepLeveled < prepInfo.maxLeveled) {
    if (!p.preparedSpells.includes(spellName)) {
      p.preparedSpells.push(spellName);
      autoPrepped = true;
    }
  }

  if (typeof touchPlayer === 'function') touchPlayer(p);
  if (typeof saveToLocalStorage === 'function') saveToLocalStorage();

  const costMsg = isFree || costInfo.gold === 0 ? 'gratuitamente' : `gastando ${costInfo.gold} PO e ${costInfo.hours} horas`;
  const prepMsg = autoPrepped ? ' e preparada para a sessão!' : '';
  if (typeof addLog === 'function') {
    addLog(`📖 <b>${p.name}</b> transcreveu a magia <b>${spellName}</b> no seu Grimório (${costMsg})${prepMsg}.`);
  }
  if (typeof showToast === 'function') {
    showToast(`✨ "${spellName}" transcrita no Grimório! (${costMsg})${prepMsg}`, 'success');
  }
  if (typeof playFX === 'function') playFX('spell');

  renderSpellPickerList();
  if (typeof renderPlayers === 'function') renderPlayers();
  if (typeof syncLocalChangesToFirebase === 'function') syncLocalChangesToFirebase(true);
}

function castSpellAsRitual(playerId, spellName) {
  const p = PLAYERS.find(x => x.id === playerId);
  if (!p) return;
  if (typeof addLog === 'function') {
    addLog(`🧙‍♂️ <b>${p.name}</b> conjura <b>${spellName}</b> como <b>RITUAL</b> (+10 min de conjuração, sem consumir espaço de magia).`);
  }
  if (typeof showToast === 'function') {
    showToast(`📜 Ritual "${spellName}" iniciado (+10 min)!`, 'success');
  }
  if (typeof playFX === 'function') playFX('spell');
  if (typeof broadcastStateSync === 'function') broadcastStateSync();
}

const playerSpellbookViews = {};
function togglePlayerSpellbookView(playerId) {
  playerSpellbookViews[playerId] = playerSpellbookViews[playerId] === 'spellbook' ? 'prepared' : 'spellbook';
  renderPlayers();
}

let pickerMode = 'prep'; // 'prep' | 'book' | 'copy'
function switchPickerMode(mode) {
  pickerMode = mode || 'prep';
  const btnPrep = document.getElementById('tab-btn-picker-prep');
  const btnBook = document.getElementById('tab-btn-picker-book');
  const btnCopy = document.getElementById('tab-btn-picker-copy');
  if (btnPrep) btnPrep.classList.toggle('active', pickerMode === 'prep');
  if (btnBook) btnBook.classList.toggle('active', pickerMode === 'book');
  if (btnCopy) btnCopy.classList.toggle('active', pickerMode === 'copy');
  renderSpellPickerList();
}
function getCompatibleClassKey(className, subclassIdx = null, subclassName = '') {
  const norm = (className || '').toLowerCase();
  if (norm.includes('bardo')) return 'Bardo';
  if (norm.includes('bruxo') || norm.includes('warlock')) return 'Bruxo';
  if (norm.includes('clérigo') || norm.includes('clerigo')) return 'Clérigo';
  if (norm.includes('druida')) return 'Druida';
  if (norm.includes('feiticeiro')) return 'Feiticeiro';
  if (norm.includes('mago') || norm.includes('wizard')) return 'Mago';
  if (norm.includes('paladino')) return 'Paladino';
  if (norm.includes('patrulheiro') || norm.includes('ranger')) return 'Patrulheiro';

  // Subclasses mágicas do Ladino (Trapaceiro Arcano) e Guerreiro (Cavaleiro Místico) usam a lista de Mago
  if (isMagicalSubclass(className, subclassIdx, subclassName)) {
    return 'Mago';
  }

  return null;
}

function getPlayerCompatibleClassKeys(p) {
  if (!p) return [];
  const keys = new Set();

  // 1. Se o herói tiver lista estruturada de classes (ex: p.classes)
  if (Array.isArray(p.classes)) {
    p.classes.forEach(c => {
      const cName = typeof c === 'string' ? c : (c.name || c.className || '');
      const sIdx = typeof c === 'object' ? (c.subclassIdx ?? null) : null;
      const sName = typeof c === 'object' ? (c.subclass || '') : '';
      const key = getCompatibleClassKey(cName, sIdx, sName);
      if (key) keys.add(key);
    });
  }

  // 2. Extrai de p.className dividindo por barras, hífens ou vírgulas (ex: "Feiticeiro 3 / Bruxo 2")
  const fullClassName = (p.className || '').toString();
  const parts = fullClassName.split(/[\/\+&,;]|\be\b/i).map(s => s.trim()).filter(Boolean);
  if (parts.length > 1) {
    parts.forEach(part => {
      const key = getCompatibleClassKey(part, p.subclassIdx, p.subclass);
      if (key) keys.add(key);
    });
  } else {
    // Também checa se múltiplas classes estão mencionadas no mesmo texto
    const norm = fullClassName.toLowerCase();
    const standardKeys = [
      { key: 'Bardo', match: 'bardo' },
      { key: 'Bruxo', match: 'bruxo', alt: 'warlock' },
      { key: 'Clérigo', match: 'clérigo', alt: 'clerigo' },
      { key: 'Druida', match: 'druida' },
      { key: 'Feiticeiro', match: 'feiticeiro', alt: 'sorcerer' },
      { key: 'Mago', match: 'mago', alt: 'wizard' },
      { key: 'Paladino', match: 'paladino' },
      { key: 'Patrulheiro', match: 'patrulheiro', alt: 'ranger' }
    ];
    standardKeys.forEach(({ key, match, alt }) => {
      if (norm.includes(match) || (alt && norm.includes(alt))) {
        keys.add(key);
      }
    });
  }

  // 3. Checa subclasse mágica
  if (isMagicalSubclass(p.className, p.subclassIdx, p.subclass)) {
    keys.add('Mago');
  }

  if (keys.size === 0) {
    const fallback = getCompatibleClassKey(p.className, p.subclassIdx, p.subclass);
    if (fallback) keys.add(fallback);
  }
  return Array.from(keys);
}

let currentPickerPlayerId = null;
let pickerSelectedSpells = new Set();
let pickerInitialSpells = new Set();
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
  const isWiz = isWizardPlayer(p);
  if (isWiz) {
    ensurePlayerSpellbook(p);
  }
  pickerMode = 'prep';
  pickerHasChanges = false;

  // Sincroniza e obtém as magias da ficha para que os checkboxes reflitam fielmente a ficha
  const knownOnSheet = typeof getPlayerKnownSpells === 'function' ? getPlayerKnownSpells(p) : [];
  let initialSpells = (Array.isArray(p.preparedSpells) && (p.preparedSpells.length > 0 || p._spellsSyncedFromPicker))
    ? [...p.preparedSpells]
    : [...knownOnSheet];

  pickerInitialSpells = new Set(initialSpells);
  pickerSelectedSpells = new Set(initialSpells);
  pickerSearchQuery = '';
  pickerClassFilter = 'auto';
  pickerCircleFilter = 'all';
  pickerSchoolFilter = 'all';
  pickerActionFilter = 'all';
  pickerShowOnlySelected = false;
  pickerExpandedSpell = null;

  const modal = document.getElementById('modal-spell-picker');
  const classFilterSelect = document.getElementById('picker-class-filter');
  const actionFilterSelect = document.getElementById('picker-action-filter');
  const searchInput = document.getElementById('picker-search-input');
  const btnOnlySelected = document.getElementById('btn-picker-only-selected');
  const wizardTabs = document.getElementById('picker-wizard-tabs');
  const copyBanner = document.getElementById('picker-copy-banner');
  const saveBtn = document.getElementById('btn-save-spell-picker');

  if (classFilterSelect) classFilterSelect.value = 'auto';
  if (actionFilterSelect) actionFilterSelect.value = 'all';
  if (searchInput) searchInput.value = '';
  if (btnOnlySelected) btnOnlySelected.classList.remove('active');

  const prepInfo = typeof getMaxPreparedSpells === 'function' ? getMaxPreparedSpells(p) : { isKnownCaster: false };
  if (saveBtn) {
    saveBtn.innerText = prepInfo.isKnownCaster ? 'Salvar Magias Conhecidas' : 'Salvar Magias da Sessão';
  }

  if (wizardTabs) {
    wizardTabs.style.display = isWiz ? 'flex' : 'none';
  }
  if (copyBanner) {
    copyBanner.style.display = 'none';
  }

  const btnPrep = document.getElementById('tab-btn-picker-prep');
  const btnBook = document.getElementById('tab-btn-picker-book');
  const btnCopy = document.getElementById('tab-btn-picker-copy');
  if (btnPrep) btnPrep.classList.add('active');
  if (btnBook) btnBook.classList.remove('active');
  if (btnCopy) btnCopy.classList.remove('active');

  if (modal) {
    const nameEl = document.getElementById('picker-player-name');
    const classEl = document.getElementById('picker-player-class');
    if (nameEl) nameEl.innerText = p.name;
    if (classEl) classEl.innerText = `${p.className} (Nível ${p.level})`;
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
  const bookCountBadge = document.getElementById('picker-book-count');
  const playerGoldBadge = document.getElementById('picker-player-gold');
  const copyBanner = document.getElementById('picker-copy-banner');
  if (!container) return;

  const p = (typeof PLAYERS !== 'undefined' && Array.isArray(PLAYERS)) ? (PLAYERS.find(x => x.id === currentPickerPlayerId) || PLAYERS[0] || null) : null;
  const heroClassKey = p ? getCompatibleClassKey(p.className, p.subclassIdx, p.subclass) : null;
  const heroClassKeys = p ? getPlayerCompatibleClassKeys(p) : [];
  const isWiz = isWizardPlayer(p);
  if (isWiz && p) ensurePlayerSpellbook(p);

  if (countBadge) countBadge.innerText = pickerSelectedSpells.size;
  if (countBtnBadge) countBtnBadge.innerText = pickerSelectedSpells.size;
  if (bookCountBadge && p) bookCountBadge.innerText = (p.spellbookSpells || []).length;

  const curGold = (p && p.coins && p.coins.gp !== undefined) ? p.coins.gp : ((p && p.gold) ? p.gold : 0);
  if (playerGoldBadge) playerGoldBadge.innerText = `${curGold} PO`;

  if (copyBanner) {
    copyBanner.style.display = 'none'; // Unificado com prepBox para visual limpo e sem redundância
  }

  const tipEl = document.getElementById('picker-instructions-tip');
  if (tipEl) {
    if (pickerMode === 'copy') {
      tipEl.innerHTML = `💡 <b>Como funciona:</b> Clique em <b>"🖋️ Transcrever"</b> para copiar uma nova magia para seu Grimório pagando ouro e tempo, ou <b>"✨ Grátis"</b> para magias aprendidas ao subir de nível.`;
    } else if (pickerMode === 'book') {
      tipEl.innerHTML = `💡 <b>Meu Grimório:</b> Todas as suas magias aprendidas. Marque a caixinha nas que deseja deixar preparadas para o dia e clique em <b>"Salvar Magias Preparadas"</b>.`;
    } else {
      tipEl.innerHTML = `💡 <b>Como funciona:</b> Clique em qualquer magia para marcá-la (você pode selecionar de <b>qualquer classe</b>). Ao finalizar, clique em <b>"Salvar Magias Preparadas"</b> abaixo.`;
    }
  }

  const saveBtn = document.getElementById('btn-save-spell-picker');
  if (saveBtn) {
    saveBtn.style.display = pickerMode === 'copy' ? 'none' : 'inline-block';
  }

  const prepBox = document.getElementById('picker-prep-meter-box');
  if (prepBox && p) {
    if (pickerMode === 'copy') {
      prepBox.innerHTML = `
        <div class="prepared-spells-meter" style="background:rgba(245,158,11,0.08); border-color:rgba(245,158,11,0.3); padding:8px 12px; display:flex; align-items:center; justify-content:space-between; gap:10px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:16px;">🖋️</span>
            <div>
              <b style="color:var(--accent-gold); font-size:12px;">Oficina de Transcrição Arcana:</b>
              <span style="font-size:11.5px; color:#cbd5e1; margin-left:4px;">Custa <b>50 PO</b> e <b>2h</b> por círculo (ou <b>25 PO / 1h</b> para Tradição Arcana).</span>
            </div>
          </div>
          <div style="display:flex; align-items:center; gap:8px; flex-shrink:0;">
            <span style="font-size:11.5px; font-weight:700; color:#fbbf24; background:rgba(0,0,0,0.3); padding:3px 8px; border-radius:6px; border:1px solid rgba(251,191,36,0.3);">🪙 Saldo: <b id="picker-player-gold">${curGold} PO</b></span>
            <span class="badge" style="background:rgba(245,158,11,0.2); color:#fbbf24; border:1px solid rgba(245,158,11,0.4); font-size:11px;">📖 Grimório: ${(p.spellbookSpells || []).length}</span>
          </div>
        </div>
      `;
    } else {
      const prepInfo = getMaxPreparedSpells(p);
      const leveledCount = Array.from(pickerSelectedSpells).filter(sName => {
        const s = typeof SPELLS_DATA !== 'undefined' ? SPELLS_DATA.find(x => x.name.toLowerCase() === sName.toLowerCase()) : null;
        return !s || s.level > 0;
      }).length;
      const cantripsCount = Array.from(pickerSelectedSpells).filter(sName => {
        const s = typeof SPELLS_DATA !== 'undefined' ? SPELLS_DATA.find(x => x.name.toLowerCase() === sName.toLowerCase()) : null;
        return s && s.level === 0;
      }).length;

      if (prepInfo.isPreparedCaster) {
        const isOverLeveled = leveledCount > prepInfo.maxLeveled;
        const isOverCantrips = prepInfo.maxCantrips > 0 && cantripsCount > prepInfo.maxCantrips;
        const isOver = isOverLeveled || isOverCantrips;

        prepBox.innerHTML = `
          <div class="prepared-spells-meter" style="${isOver ? 'background:rgba(239,68,68,0.15); border-color:rgba(239,68,68,0.4); color:#fca5a5;' : ''}">
            <span style="font-size: 14px;">🔮</span>
            <div style="flex: 1;">
              <div>
                <b>Magias Preparadas Diariamente:</b> <span style="font-weight:800; color:#fff;">${leveledCount} / ${prepInfo.maxLeveled}</span> (${prepInfo.formula})
              </div>
              <div style="font-size: 10px; color:${isOverCantrips ? '#f87171' : 'var(--primary-light)'}; margin-top:2px;">
                ✨ Truques Conhecidos: <b>${cantripsCount} ${prepInfo.maxCantrips > 0 ? `/ ${prepInfo.maxCantrips}` : ''}</b> ${isOverCantrips ? '(Limite de truques excedido)' : ''}
              </div>
            </div>
            <span class="badge ${isOver ? 'badge-warn' : 'badge-cls'}" style="font-size: 10px;">${isOver ? '⚠️ Acima do Limite' : '✅ Válido'}</span>
          </div>
        `;
      } else if (prepInfo.isKnownCaster) {
        const isOverLeveled = leveledCount > prepInfo.maxLeveled;
        const isOverCantrips = prepInfo.maxCantrips > 0 && cantripsCount > prepInfo.maxCantrips;
        const isOver = isOverLeveled || isOverCantrips;

        prepBox.innerHTML = `
          <div class="prepared-spells-meter" style="${isOver ? 'background:rgba(239,68,68,0.15); border-color:rgba(239,68,68,0.4); color:#fca5a5;' : 'background:rgba(168,85,247,0.1); border-color:rgba(168,85,247,0.3);'}">
            <span style="font-size: 14px;">📖</span>
            <div style="flex: 1;">
              <div>
                <b>Magias Conhecidas (${prepInfo.className}):</b> <span style="font-weight:800; color:#fff;">${leveledCount} / ${prepInfo.maxLeveled}</span> (${prepInfo.formula})
              </div>
              <div style="font-size: 10px; color:${isOverCantrips ? '#f87171' : 'var(--primary-light)'}; margin-top:2px;">
                ✨ Truques Conhecidos: <b>${cantripsCount} ${prepInfo.maxCantrips > 0 ? `/ ${prepInfo.maxCantrips}` : ''}</b> ${isOverCantrips ? '(Limite de truques excedido)' : ''}
              </div>
            </div>
            <span class="badge ${isOver ? 'badge-warn' : 'badge-sub'}" style="font-size: 10px;">${isOver ? '⚠️ Acima do Limite' : '✅ Válido'}</span>
          </div>
        `;
      } else {
        prepBox.innerHTML = `
          <div class="prepared-spells-meter">
            <span style="font-size: 14px;">📜</span>
            <div style="flex: 1;">
              <b>Conjurador Especial / Customizado:</b> ${pickerSelectedSpells.size} magias selecionadas pelo Mestre.
            </div>
          </div>
        `;
      }
    }
  }

  let spells = typeof SPELLS_DATA !== 'undefined' ? SPELLS_DATA : [];

  if (isWiz && p && (pickerMode === 'book' || (pickerMode === 'prep' && (p.spellbookSpells || []).length > 0 && !pickerShowOnlySelected))) {
    // No modo 'book', mostra apenas magias que estão no grimório
    if (pickerMode === 'book') {
      spells = spells.filter(s => (p.spellbookSpells || []).includes(s.name));
    }
  }

  // Filtragem por apenas selecionadas
  if (pickerShowOnlySelected) {
    spells = spells.filter(s => pickerSelectedSpells.has(s.name));
  } else if (pickerMode !== 'copy') {
    // Filtragem por classe no modo normal
    if (pickerClassFilter === 'auto') {
      if (heroClassKeys.length > 0) {
        // Mostra magias das classes do herói (incluindo multiclasse) OU qualquer magia já selecionada pelo herói (patrono, raça, talento, etc.)
        spells = spells.filter(s =>
          pickerSelectedSpells.has(s.name) ||
          (Array.isArray(s.classes) && heroClassKeys.some(k => s.classes.includes(k)))
        );
      } else if (pickerSelectedSpells.size > 0) {
        spells = spells.filter(s => pickerSelectedSpells.has(s.name));
      }
    } else if (pickerClassFilter !== 'all') {
      spells = spells.filter(s => Array.isArray(s.classes) && s.classes.includes(pickerClassFilter));
    }
  } else {
    // Modo COPY: se classe for auto, filtra por Mago ou classe do herói
    if (pickerClassFilter === 'auto') {
      spells = spells.filter(s => Array.isArray(s.classes) && s.classes.includes('Mago'));
    } else if (pickerClassFilter !== 'all') {
      spells = spells.filter(s => Array.isArray(s.classes) && s.classes.includes(pickerClassFilter));
    }
  }

  const q = pickerSearchQuery.toLowerCase().trim();
  const filtered = spells.filter(s => {
    if (q && !s.name.toLowerCase().includes(q) && !(s.desc || '').toLowerCase().includes(q)) return false;
    if (pickerCircleFilter !== 'all' && String(s.level) !== pickerCircleFilter) return false;
    if (pickerSchoolFilter !== 'all' && s.school !== pickerSchoolFilter) return false;
    if (typeof pickerActionFilter !== 'undefined' && pickerActionFilter !== 'all') {
      if (getSpellActionType(s) !== pickerActionFilter) return false;
    }
    return true;
  });

  if (filtered.length === 0) {
    if (pickerMode === 'book') {
      container.innerHTML = `<div style="text-align:center; padding:30px; color:var(--text-muted); font-size:12px;">Seu Grimório ainda não possui magias com este filtro.<br><button class="btn-action" style="margin-top:10px;" onclick="switchPickerMode('copy')">🖋️ Transcrever Novas Magias no Grimório</button></div>`;
    } else {
      container.innerHTML = `<div style="text-align:center; padding:30px; color:var(--text-muted); font-size:12px;">Nenhuma magia encontrada com os filtros selecionados.<br><span style="font-size:11px; color:var(--primary-light);">Dica: selecione "🌐 Todas as Magias" para ver o catálogo completo.</span></div>`;
    }
    return;
  }

  if (pickerMode === 'copy') {
    container.innerHTML = filtered.map(s => {
      const isAlreadyInBook = (p.spellbookSpells || []).includes(s.name);
      const circleLabel = s.level === 0 ? 'Truque' : `${s.level}º Círculo`;
      const isExpanded = pickerExpandedSpell === s.name;
      const costInfo = getSpellCopyCost(s, p);

      return `
        <div class="spellbook-copy-item ${isAlreadyInBook ? 'in-book' : ''}">
          <div style="flex:1;">
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:4px;">
              <span style="font-weight:700; color:#fff; font-size:13px;">${s.name}</span>
              <div style="display:flex; align-items:center; gap:6px;">
                <span class="badge ${s.level === 0 ? 'badge-cls' : 'badge-lvl'}" style="font-size:10px;">${circleLabel}</span>
                <button type="button" class="btn-secondary" style="padding:1px 6px; font-size:10px;" onclick="toggleSpellDetailInPicker('${escapeAttr(s.name)}', event)">
                  ${isExpanded ? '▲ Fechar' : 'ℹ️ Detalhes'}
                </button>
              </div>
            </div>
            <div style="font-size:11px; color:var(--text-muted); margin-top:2px;">
              ${s.school || 'Magia'} • Alcance: <b>${s.range || 'Pessoal'}</b> • Tempo: <b>${s.time || s.castTime || '1 ação'}</b>
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
          <div style="display:flex; align-items:center; gap:6px; flex-shrink:0;">
            ${isAlreadyInBook ? `
              <span class="badge" style="background:rgba(52,211,153,0.15); color:#34d399; border:1px solid rgba(52,211,153,0.3); font-size:11px; padding:4px 8px;">
                ✓ No Grimório
              </span>
            ` : `
              <div style="display:flex; flex-direction:column; align-items:flex-end; gap:3px;">
                <div style="display:flex; gap:4px;">
                  <span class="spellbook-cost-pill ${costInfo.canAfford ? 'afford' : 'expensive'}" title="${costInfo.isDiscounted ? 'Desconto de Tradição Arcana (50% de ouro e tempo)!' : ''}">
                    💰 ${costInfo.gold} PO ${costInfo.isDiscounted ? '★ Tradição' : ''}
                  </span>
                  <span class="spellbook-cost-pill time">⏱️ ${costInfo.hours}h</span>
                </div>
                <div style="display:flex; gap:4px; margin-top:2px;">
                  <button type="button" class="btn-action" style="padding:2px 8px; font-size:11px;" ${!costInfo.canAfford ? 'disabled style="opacity:0.5;"' : ''} onclick="copySpellToSpellbook('${p.id}', '${escapeAttr(s.name)}', false)" title="Transcrever gastando ${costInfo.gold} PO e ${costInfo.hours} horas">
                    🖋️ Transcrever
                  </button>
                  <button type="button" class="btn-secondary" style="padding:2px 6px; font-size:10px;" onclick="copySpellToSpellbook('${p.id}', '${escapeAttr(s.name)}', true)" title="Transcrever gratuitamente (ex: magia aprendida por subir de nível)">
                    ✨ Grátis
                  </button>
                </div>
              </div>
            `}
          </div>
        </div>
      `;
    }).join('');
    return;
  }

  // Modo padrão (prep ou book)
  container.innerHTML = filtered.map(s => {
    const isSelected = pickerSelectedSpells.has(s.name);
    const circleLabel = s.level === 0 ? 'Truque' : `${s.level}º Círculo`;
    const classPills = Array.isArray(s.classes) ? s.classes.join(', ') : '';
    const castTimeText = s.time || s.castTime || '1 ação';
    const isExpanded = pickerExpandedSpell === s.name;
    const spAct = getSpellActionType(s);
    const spActBadge = spAct === 'bonus'
      ? '<span class="action-economy-tag bonus" style="font-size:9px; margin-left:6px; padding:1px 5px;">Bônus</span>'
      : (spAct === 'reaction'
        ? '<span class="action-economy-tag reaction" style="font-size:9px; margin-left:6px; padding:1px 5px;">Reação</span>'
        : '');

    return `
      <div class="picker-spell-item ${isSelected ? 'selected' : ''}" onclick="toggleSpellInPicker('${escapeAttr(s.name)}')">
        <div style="display:flex; align-items:flex-start; gap:10px; width:100%;">
          <input type="checkbox" ${isSelected ? 'checked' : ''} style="margin-top:4px; cursor:pointer;" onclick="event.stopPropagation(); toggleSpellInPicker('${escapeAttr(s.name)}')">
          <div style="flex:1;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span style="font-weight:700; color:${isSelected ? 'var(--primary-light)' : '#fff'}; font-size:13px;">${s.name}${spActBadge}</span>
              <div style="display:flex; align-items:center; gap:6px;">
                <span class="badge ${s.level === 0 ? 'badge-cls' : 'badge-lvl'}" style="font-size:10px;">${circleLabel}</span>
                <button type="button" class="btn-secondary" style="padding:1px 6px; font-size:10px;" onclick="toggleSpellDetailInPicker('${escapeAttr(s.name)}', event)" title="Ver descrição da magia">
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

let pickerActionFilter = 'all';

function handlePickerActionFilter(action) {
  pickerActionFilter = action || 'all';
  renderSpellPickerList();
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

let pickerHasChanges = false;

function toggleSpellInPicker(spellName) {
  if (pickerSelectedSpells.has(spellName)) {
    pickerSelectedSpells.delete(spellName);
  } else {
    pickerSelectedSpells.add(spellName);
    if (typeof playFX === 'function') playFX('heal');
  }
  pickerHasChanges = true;
  renderSpellPickerList();
}

function saveSpellPickerSelection(isSilent = false) {
  const p = (typeof PLAYERS !== 'undefined' && Array.isArray(PLAYERS)) ? (PLAYERS.find(x => x.id === currentPickerPlayerId) || PLAYERS[0] || null) : null;
  if (!p) return;

  const selectedArr = Array.from(pickerSelectedSpells);
  const removedInModal = Array.from(pickerInitialSpells || []).filter(s => !pickerSelectedSpells.has(s));

  p.preparedSpells = selectedArr;
  p._spellsSyncedFromPicker = true;

  if (Array.isArray(p.unpreparedSpells)) {
    p.unpreparedSpells = p.unpreparedSpells.filter(s => pickerSelectedSpells.has(s));
  }

  const isWiz = typeof isWizardPlayer === 'function' ? isWizardPlayer(p) : false;
  if (isWiz) {
    if (!Array.isArray(p.spellbookSpells)) p.spellbookSpells = [];
    if (removedInModal.length > 0 || pickerMode === 'book') {
      p.spellbookSpells = p.spellbookSpells.filter(s => !removedInModal.includes(s));
    }
    selectedArr.forEach(sName => {
      if (!p.spellbookSpells.includes(sName)) {
        p.spellbookSpells.push(sName);
      }
    });
  } else {
    p.spellbookSpells = [...selectedArr, ...(p.unpreparedSpells || [])];
  }

  if (Array.isArray(p.knownSpells)) {
    p.knownSpells = [...p.spellbookSpells];
  }

  p.spells = buildPlayerSpellsSummary(p.preparedSpells);

  pickerHasChanges = false;
  const modal = document.getElementById('modal-spell-picker');
  if (modal) modal.classList.remove('open');

  // Carimbo temporal e autoria para precedência no sync (ISSUE-141)
  p.updatedAt = Date.now();
  p.updatedBy = typeof localClientId !== 'undefined' ? localClientId : 'local';

  if (typeof touchPlayer === 'function') touchPlayer(p);
  renderPlayers();
  if (typeof renderCombat === 'function') renderCombat();
  saveToLocalStorage();
  if (typeof executePlayerCloudSave === 'function' && typeof activePortalPlayerId !== 'undefined' && activePortalPlayerId === p.id) {
    executePlayerCloudSave();
  } else if (typeof syncLocalChangesToFirebase === 'function') {
    syncLocalChangesToFirebase(true);
  }
  if (typeof broadcastStateSync === 'function') broadcastStateSync();
  if (!isSilent) {
    if (typeof playFX === 'function') playFX('heal');
    if (typeof showToast === 'function') showToast(`✨ Magias salvas com sucesso (${p.preparedSpells.length} preparadas)!`, 'success');
  }
  addLog(`📖 <b>${p.name}</b> atualizou suas magias (${p.preparedSpells.length} magias ativas salvas).`);
}

function closeSpellPickerModal() {
  const modal = document.getElementById('modal-spell-picker');
  if (modal && modal.classList.contains('open')) {
    // Se houve alterações feitas pelo jogador, auto-salva para garantir que nada seja perdido!
    if (pickerHasChanges && currentPickerPlayerId) {
      saveSpellPickerSelection(true);
      if (typeof showToast === 'function') showToast(`✨ Magias selecionadas foram salvas automaticamente!`, 'success');
    }
    modal.classList.remove('open');
  }
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

  const spAct = getSpellActionType(sp || spellName);
  const actBadgeText = spAct === 'bonus' ? ' • ⚡ Ação Bônus' : (spAct === 'reaction' ? ' • 🛡️ Reação' : ' • ⚔️ Ação');
  const diceInfo = typeof getSpellDiceInfo === 'function' ? getSpellDiceInfo(sp || spellName, p) : null;
  const diceBadgeText = diceInfo ? ` • 🎲 ${diceInfo.label}` : '';
  document.getElementById('cast-spell-meta').innerText = sp ? `${sp.level === 0 ? 'Truque' : sp.level + 'º Círculo'} (${sp.school || 'Magia'}) • Tempo: ${sp.time || sp.castTime || '1 ação'}${actBadgeText}${diceBadgeText} • Alcance: ${sp.range || 'Pessoal'} • Duração: ${sp.duration || 'Instantânea'}` : 'Magia D&D 5E';
  document.getElementById('cast-spell-desc').innerHTML = sp ? sp.desc.replace(/\n/g, '<br>') : 'Sem descrição detalhada.';

  const slotsOptionsContainer = document.getElementById('cast-slot-options');

  // Se p.slots não existir ou estiver zerado, auto-calcula para conjuradores
  if ((!p.slots || p.slots.every(s => s === 0)) && typeof calculateMulticlassSpellSlots === 'function') {
    const calc = calculateMulticlassSpellSlots(p);
    if (calc && calc.some(s => s > 0)) {
      p.slots = calc;
      p.slotsUsed = p.slots.map(() => 0);
    }
  }

  const slots = (Array.isArray(p.slots) && p.slots.length > 0) ? [...p.slots] : [0, 0, 0, 0, 0, 0, 0, 0, 0];
  while (slots.length < 9) slots.push(0);
  const slotsUsed = (Array.isArray(p.slotsUsed) && p.slotsUsed.length > 0) ? [...p.slotsUsed] : slots.map(() => 0);
  while (slotsUsed.length < 9) slotsUsed.push(0);

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
    if (!Array.isArray(p.slots) || p.slots.length < 9) {
      const defSlots = (typeof calculateMulticlassSpellSlots === 'function' ? calculateMulticlassSpellSlots(p) : null) || [0, 0, 0, 0, 0, 0, 0, 0, 0];
      p.slots = Array.isArray(p.slots) ? [...p.slots] : [...defSlots];
      while (p.slots.length < 9) p.slots.push(defSlots[p.slots.length] || 0);
    }
    if (!Array.isArray(p.slotsUsed) || p.slotsUsed.length < p.slots.length) {
      p.slotsUsed = Array.isArray(p.slotsUsed) ? [...p.slotsUsed] : [];
      while (p.slotsUsed.length < p.slots.length) p.slotsUsed.push(0);
    }

    const lvlIdx = slotLevel - 1;
    const maxAtLvl = p.slots[lvlIdx] || 0;
    if (maxAtLvl > 0) {
      p.slotsUsed[lvlIdx] = Math.min(maxAtLvl, (p.slotsUsed[lvlIdx] || 0) + 1);
    } else {
      p.slotsUsed[lvlIdx] = (p.slotsUsed[lvlIdx] || 0) + 1;
      p.slots[lvlIdx] = Math.max(p.slots[lvlIdx] || 0, p.slotsUsed[lvlIdx]);
    }
  }

  const slotText = slotLevel === 0 ? (sp && sp.level === 0 ? 'como Truque' : 'sem gastar espaço') : `gastando 1 espaço de ${slotLevel}º Círculo`;

  if (typeof playFX === 'function') playFX('spell');

  const logMsg = `✨ <b>${p.name}</b> conjurou <b>${spellName}</b> (${slotText})!`;
  addLog(logMsg);
  addPlayerActionLog(p.id, '✨', `Conjurou ${spellName} (${slotText})`, 'spell');

  if (sp && (sp.duration || '').toLowerCase().includes('concentr')) {
    p.concentrationSpell = spellName;
    addLog(`🧘 <b>${p.name}</b> iniciou concentração em <b>${spellName}</b>.`);
    addPlayerActionLog(p.id, '🧘', `Iniciou concentração em ${spellName}`, 'spell');
  }

  if (typeof showLiveDiceRoll === 'function') {
    showLiveDiceRoll(`✨ ${spellName}`, slotLevel === 0 ? 'Truque' : `${slotLevel}º Círculo`, `${p.name} conjurou`);
  }

  if (typeof broadcastCombatState === 'function') {
    broadcastCombatState(logMsg);
  }

  if (typeof touchPlayer === 'function') touchPlayer(p);
  renderPlayers();
  if (typeof renderCombat === 'function') renderCombat();
  saveToLocalStorage();
  if (typeof syncLocalChangesToFirebase === 'function') syncLocalChangesToFirebase(true);
  if (typeof broadcastStateSync === 'function') broadcastStateSync();
}

function closeCastSpellModal() {
  const modal = document.getElementById('modal-cast-spell');
  if (modal) modal.classList.remove('open');
}

// ============================================================================
// 🎲 ISSUE-122: CRIAÇÃO & EDIÇÃO AVANÇADA DE PERSONAGENS D&D 5E
// 4d6 Drop Lowest, Array Padrão, Otimização por Classe e Cálculo de PV Nível 1
// ============================================================================

function getClassAttributePriority(className) {
  const norm = (className || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (norm.includes('barbar')) return ['str', 'con', 'dex', 'wis', 'cha', 'int'];
  if (norm.includes('bardo') || norm.includes('bard')) return ['cha', 'dex', 'con', 'int', 'wis', 'str'];
  if (norm.includes('cleric') || norm.includes('clerigo')) return ['wis', 'con', 'str', 'dex', 'cha', 'int'];
  if (norm.includes('druid') || norm.includes('druida')) return ['wis', 'con', 'dex', 'int', 'cha', 'str'];
  if (norm.includes('fighter') || norm.includes('guerreiro')) return ['str', 'con', 'dex', 'wis', 'cha', 'int'];
  if (norm.includes('monk') || norm.includes('monge')) return ['dex', 'wis', 'con', 'str', 'cha', 'int'];
  if (norm.includes('paladin') || norm.includes('paladino')) return ['str', 'cha', 'con', 'wis', 'dex', 'int'];
  if (norm.includes('ranger') || norm.includes('patrulheiro') || norm.includes('guardiao')) return ['dex', 'wis', 'con', 'str', 'cha', 'int'];
  if (norm.includes('rogue') || norm.includes('ladino')) return ['dex', 'con', 'int', 'wis', 'cha', 'str'];
  if (norm.includes('sorcerer') || norm.includes('feiticeiro')) return ['cha', 'con', 'dex', 'wis', 'int', 'str'];
  if (norm.includes('warlock') || norm.includes('bruxo')) return ['cha', 'con', 'dex', 'wis', 'int', 'str'];
  if (norm.includes('wizard') || norm.includes('mago')) return ['int', 'con', 'dex', 'wis', 'cha', 'str'];
  if (norm.includes('artificer') || norm.includes('artifice')) return ['int', 'con', 'dex', 'wis', 'str', 'cha'];
  return ['str', 'dex', 'con', 'int', 'wis', 'cha'];
}

function calculateLevel1Hp(className, conValue) {
  const norm = (className || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const conMod = Math.floor(((conValue || 10) - 10) / 2);
  let baseHitDie = 8;
  if (norm.includes('barbar')) baseHitDie = 12;
  else if (norm.includes('fighter') || norm.includes('guerreiro') || norm.includes('paladin') || norm.includes('paladino') || norm.includes('ranger') || norm.includes('patrulheiro') || norm.includes('guardiao')) baseHitDie = 10;
  else if (norm.includes('wizard') || norm.includes('mago') || norm.includes('sorcerer') || norm.includes('feiticeiro')) baseHitDie = 6;
  else baseHitDie = 8;
  return Math.max(1, baseHitDie + conMod);
}

function getSuggestedClassAttacks(className, strMod = 2, dexMod = 2) {
  const norm = (className || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const prof = 2;
  const strAtk = prof + strMod;
  const dexAtk = prof + dexMod;
  const signStr = strAtk >= 0 ? `+${strAtk}` : `${strAtk}`;
  const signDex = dexAtk >= 0 ? `+${dexAtk}` : `${dexAtk}`;
  const strDmgSign = strMod >= 0 ? `+${strMod}` : `${strMod}`;
  const dexDmgSign = dexMod >= 0 ? `+${dexMod}` : `${dexMod}`;

  if (norm.includes('barbar')) return `Machado Grande (${signStr}, 1d12${strDmgSign} cortante), Azagaia (${signStr}, 1d6${strDmgSign} perfurante)`;
  if (norm.includes('guerreiro') || norm.includes('fighter')) return `Espada Longa (${signStr}, 1d8${strDmgSign} cortante), Arco Longo (${signDex}, 1d8${dexDmgSign} perfurante)`;
  if (norm.includes('paladino') || norm.includes('paladin')) return `Espada Longa (${signStr}, 1d8${strDmgSign} cortante), Azagaia (${signStr}, 1d6${strDmgSign} perfurante)`;
  if (norm.includes('patrulheiro') || norm.includes('ranger') || norm.includes('guardiao')) return `Espada Curta (${signDex}, 1d6${dexDmgSign} perfurante), Arco Longo (${signDex}, 1d8${dexDmgSign} perfurante)`;
  if (norm.includes('ladino') || norm.includes('rogue')) return `Rapieira (${signDex}, 1d8${dexDmgSign} perfurante), Arco Curto (${signDex}, 1d6${dexDmgSign} perfurante)`;
  if (norm.includes('monge') || norm.includes('monk')) return `Bordão (${signDex}, 1d8${dexDmgSign} contundente), Ataque Desarmado (${signDex}, 1d4${dexDmgSign} contundente)`;
  if (norm.includes('clerigo') || norm.includes('cleric')) return `Maça (${signStr}, 1d6${strDmgSign} contundente), Chama Sagrada (CD 13 SAB, 1d8 radiante)`;
  if (norm.includes('druida') || norm.includes('druid')) return `Cimitarra (${signDex}, 1d6${dexDmgSign} cortante), Bordão (${signStr}, 1d6${strDmgSign} contundente)`;
  if (norm.includes('bardo') || norm.includes('bard')) return `Florete (${signDex}, 1d8${dexDmgSign} perfurante), Zombaria Viciosa (CD 13 CAR, 1d4 psíquico)`;
  if (norm.includes('bruxo') || norm.includes('warlock')) return `Adaga (${signDex}, 1d4${dexDmgSign} perfurante), Raio Místico (${signDex}, 1d10 energia)`;
  if (norm.includes('mago') || norm.includes('wizard')) return `Adaga (${signDex}, 1d4${dexDmgSign} perfurante), Raio de Fogo (${signDex}, 1d10 fogo)`;
  if (norm.includes('feiticeiro') || norm.includes('sorcerer')) return `Besta Leve (${signDex}, 1d8${dexDmgSign} perfurante), Raio de Fogo (${signDex}, 1d10 fogo)`;
  return `Espada Longa (${signStr}, 1d8${strDmgSign} cortante)`;
}

// ============================================================================
// 🧬 ISSUE-142: BÔNUS RACIAIS CANÔNICOS D&D 5E & MAPEAMENTO DE ATRIBUTOS
// ============================================================================

function getRacialAbilityBonuses(raceName) {
  const norm = String(raceName || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  const bonuses = { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0, label: 'Nenhum (+0)' };

  if (norm.includes('draconato') || norm.includes('dragonborn')) {
    bonuses.str = 2;
    bonuses.cha = 1;
    bonuses.label = 'Draconato (+2 FOR, +1 CAR)';
  } else if (norm.includes('anao') || norm.includes('dwarf')) {
    bonuses.con = 2;
    if (norm.includes('montanha') || norm.includes('mountain')) {
      bonuses.str = 2;
      bonuses.label = 'Anão da Montanha (+2 CON, +2 FOR)';
    } else if (norm.includes('colina') || norm.includes('hill')) {
      bonuses.wis = 1;
      bonuses.label = 'Anão da Colina (+2 CON, +1 SAB)';
    } else if (norm.includes('duergar') || norm.includes('cinzento')) {
      bonuses.str = 1;
      bonuses.label = 'Anão Duergar (+2 CON, +1 FOR)';
    } else {
      bonuses.label = 'Anão (+2 CON)';
    }
  } else if (norm.includes('meio-elfo') || norm.includes('meio elfo') || norm.includes('half-elf') || norm.includes('half elf')) {
    bonuses.cha = 2;
    bonuses.dex = 1;
    bonuses.con = 1;
    bonuses.label = 'Meio-Elfo (+2 CAR, +1 DES, +1 CON)';
  } else if (norm.includes('elfo') || norm.includes('elf')) {
    bonuses.dex = 2;
    if (norm.includes('alto') || norm.includes('high')) {
      bonuses.int = 1;
      bonuses.label = 'Alto Elfo (+2 DES, +1 INT)';
    } else if (norm.includes('floresta') || norm.includes('wood')) {
      bonuses.wis = 1;
      bonuses.label = 'Elfo da Floresta (+2 DES, +1 SAB)';
    } else if (norm.includes('drow') || norm.includes('negro') || norm.includes('dark')) {
      bonuses.cha = 1;
      bonuses.label = 'Elfo Drow (+2 DES, +1 CAR)';
    } else if (norm.includes('eladrin')) {
      bonuses.cha = 1;
      bonuses.label = 'Elfo Eladrin (+2 DES, +1 CAR)';
    } else if (norm.includes('shadar-kai') || norm.includes('shadarkai')) {
      bonuses.con = 1;
      bonuses.label = 'Elfo Shadar-kai (+2 DES, +1 CON)';
    } else {
      bonuses.label = 'Elfo (+2 DES)';
    }
  } else if (norm.includes('halfling')) {
    bonuses.dex = 2;
    if (norm.includes('pes leves') || norm.includes('pes-leves') || norm.includes('lightfoot')) {
      bonuses.cha = 1;
      bonuses.label = 'Halfling Pés-Leves (+2 DES, +1 CAR)';
    } else if (norm.includes('robusto') || norm.includes('stout')) {
      bonuses.con = 1;
      bonuses.label = 'Halfling Robusto (+2 DES, +1 CON)';
    } else {
      bonuses.label = 'Halfling (+2 DES)';
    }
  } else if (norm.includes('humano') || norm.includes('human')) {
    bonuses.str = 1;
    bonuses.dex = 1;
    bonuses.con = 1;
    bonuses.int = 1;
    bonuses.wis = 1;
    bonuses.cha = 1;
    bonuses.label = 'Humano (+1 em Todos os 6 Atributos)';
  } else if (norm.includes('gnomo') || norm.includes('gnome')) {
    bonuses.int = 2;
    if (norm.includes('floresta') || norm.includes('forest')) {
      bonuses.dex = 1;
      bonuses.label = 'Gnomo da Floresta (+2 INT, +1 DES)';
    } else if (norm.includes('rocha') || norm.includes('rock')) {
      bonuses.con = 1;
      bonuses.label = 'Gnomo da Rocha (+2 INT, +1 CON)';
    } else {
      bonuses.label = 'Gnomo (+2 INT)';
    }
  } else if (norm.includes('meio-orc') || norm.includes('meio orc') || norm.includes('half-orc') || norm.includes('half orc')) {
    bonuses.str = 2;
    bonuses.con = 1;
    bonuses.label = 'Meio-Orc (+2 FOR, +1 CON)';
  } else if (norm.includes('tiefling')) {
    bonuses.cha = 2;
    bonuses.int = 1;
    bonuses.label = 'Tiefling (+2 CAR, +1 INT)';
  } else if (norm.includes('aasimar')) {
    bonuses.cha = 2;
    bonuses.wis = 1;
    bonuses.label = 'Aasimar (+2 CAR, +1 SAB)';
  } else if (norm.includes('golias') || norm.includes('goliath')) {
    bonuses.str = 2;
    bonuses.con = 1;
    bonuses.label = 'Golias (+2 FOR, +1 CON)';
  } else if (norm.includes('tabaxi')) {
    bonuses.dex = 2;
    bonuses.cha = 1;
    bonuses.label = 'Tabaxi (+2 DES, +1 CAR)';
  } else if (norm.includes('kenku')) {
    bonuses.dex = 2;
    bonuses.wis = 1;
    bonuses.label = 'Kenku (+2 DES, +1 SAB)';
  } else if (norm.includes('firbolg')) {
    bonuses.wis = 2;
    bonuses.str = 1;
    bonuses.label = 'Firbolg (+2 SAB, +1 FOR)';
  } else if (norm.includes('lagarto') || norm.includes('lizardfolk')) {
    bonuses.con = 2;
    bonuses.wis = 1;
    bonuses.label = 'Povo-Lagarto (+2 CON, +1 SAB)';
  } else if (norm.includes('tritao') || norm.includes('triton')) {
    bonuses.str = 1;
    bonuses.con = 1;
    bonuses.cha = 1;
    bonuses.label = 'Tritão (+1 FOR, +1 CON, +1 CAR)';
  } else if (norm.includes('aarakocra')) {
    bonuses.dex = 2;
    bonuses.wis = 1;
    bonuses.label = 'Aarakocra (+2 DES, +1 SAB)';
  } else if (norm.includes('genasi')) {
    bonuses.con = 2;
    if (norm.includes('agua') || norm.includes('water')) {
      bonuses.wis = 1;
      bonuses.label = 'Genasi da Água (+2 CON, +1 SAB)';
    } else if (norm.includes('ar') || norm.includes('air')) {
      bonuses.dex = 1;
      bonuses.label = 'Genasi do Ar (+2 CON, +1 DES)';
    } else if (norm.includes('terra') || norm.includes('earth')) {
      bonuses.str = 1;
      bonuses.label = 'Genasi da Terra (+2 CON, +1 FOR)';
    } else {
      bonuses.int = 1;
      bonuses.label = 'Genasi (+2 CON, +1 INT)';
    }
  } else if (norm.includes('gith')) {
    bonuses.int = 1;
    if (norm.includes('githzerai')) {
      bonuses.wis = 2;
      bonuses.label = 'Githzerai (+2 SAB, +1 INT)';
    } else {
      bonuses.str = 2;
      bonuses.label = 'Githyanki (+2 FOR, +1 INT)';
    }
  } else if (norm.includes('tortle') || norm.includes('tartaruga')) {
    bonuses.str = 2;
    bonuses.wis = 1;
    bonuses.label = 'Tortle (+2 FOR, +1 SAB)';
  } else if (norm.includes('harengon') || norm.includes('coelho')) {
    bonuses.dex = 2;
    bonuses.wis = 1;
    bonuses.label = 'Harengon (+2 DES, +1 SAB)';
  } else if (norm.includes('fada') || norm.includes('fairy')) {
    bonuses.dex = 2;
    bonuses.cha = 1;
    bonuses.label = 'Fada (+2 DES, +1 CAR)';
  } else if (norm.includes('metamorfo') || norm.includes('changeling')) {
    bonuses.cha = 2;
    bonuses.dex = 1;
    bonuses.label = 'Metamorfo (+2 CAR, +1 DES)';
  } else if (norm.includes('yuan-ti') || norm.includes('yuanti')) {
    bonuses.cha = 2;
    bonuses.int = 1;
    bonuses.label = 'Yuan-ti (+2 CAR, +1 INT)';
  } else if (norm.includes('duergar')) {
    bonuses.con = 2;
    bonuses.str = 1;
    bonuses.label = 'Anão Duergar (+2 CON, +1 FOR)';
  } else if (norm.includes('eladrin')) {
    bonuses.dex = 2;
    bonuses.cha = 1;
    bonuses.label = 'Elfo Eladrin (+2 DES, +1 CAR)';
  } else if (norm.includes('shadar-kai') || norm.includes('shadarkai')) {
    bonuses.dex = 2;
    bonuses.con = 1;
    bonuses.label = 'Elfo Shadar-kai (+2 DES, +1 CON)';
  }

  return bonuses;
}

function roll4d6DropLowest() {
  const rolls = [
    Math.floor(Math.random() * 6) + 1,
    Math.floor(Math.random() * 6) + 1,
    Math.floor(Math.random() * 6) + 1,
    Math.floor(Math.random() * 6) + 1
  ];
  rolls.sort((a, b) => a - b);
  const dropped = rolls[0];
  const total = rolls[1] + rolls[2] + rolls[3];
  return { total, rolls, dropped };
}

function rollAttributes4d6Modal() {
  const classSel = document.getElementById('pm-class-select');
  const classInput = document.getElementById('pm-class');
  const className = classSel ? (classSel.value === 'custom' ? (classInput ? classInput.value : 'Guerreiro') : classSel.value) : 'Guerreiro';

  const rolledScores = [];
  for (let i = 0; i < 6; i++) {
    const res = roll4d6DropLowest();
    rolledScores.push(res.total);
  }

  rolledScores.sort((a, b) => b - a);
  const priority = getClassAttributePriority(className);
  const assigned = {};
  priority.forEach((attrKey, idx) => {
    assigned[attrKey] = rolledScores[idx];
    const baseEl = document.getElementById(`pm-base-${attrKey}`);
    if (baseEl) baseEl.value = rolledScores[idx];
    const el = document.getElementById(`pm-${attrKey}`);
    if (el) el.value = rolledScores[idx];
  });

  if (typeof updateModalAttributeModifiers === 'function') updateModalAttributeModifiers();
  if (typeof updateModalCalculatedAc === 'function') updateModalCalculatedAc();

  const lvl = parseInt(document.getElementById('pm-level')?.value) || 1;
  const isNew = !document.getElementById('pm-id')?.value;
  if (isNew || lvl === 1) {
    const conVal = parseInt(document.getElementById('pm-con')?.value) || assigned['con'] || 14;
    const hpVal = calculateLevel1Hp(className, conVal);
    const hpEl = document.getElementById('pm-maxhp');
    if (hpEl) hpEl.value = hpVal;
  }

  if (typeof playFX === 'function') playFX('dice');
  const msg = `🎲 <b>4d6 Drop Lowest Rolado com Sucesso!</b><br>Valores base obtidos: <b>${rolledScores.join(', ')}</b><br>Distribuídos estrategicamente para <b>${className}</b> com bônus raciais somados!`;
  if (typeof showToast === 'function') showToast(msg, 'success');
  else alert(`🎲 4d6 Drop Lowest: ${rolledScores.join(', ')} distribuídos para ${className}!`);
}

function applyStandardArrayModal() {
  const classSel = document.getElementById('pm-class-select');
  const classInput = document.getElementById('pm-class');
  const className = classSel ? (classSel.value === 'custom' ? (classInput ? classInput.value : 'Guerreiro') : classSel.value) : 'Guerreiro';

  const standardScores = [15, 14, 13, 12, 10, 8];
  const priority = getClassAttributePriority(className);
  const assigned = {};
  priority.forEach((attrKey, idx) => {
    assigned[attrKey] = standardScores[idx];
    const baseEl = document.getElementById(`pm-base-${attrKey}`);
    if (baseEl) baseEl.value = standardScores[idx];
    const el = document.getElementById(`pm-${attrKey}`);
    if (el) el.value = standardScores[idx];
  });

  if (typeof updateModalAttributeModifiers === 'function') updateModalAttributeModifiers();
  if (typeof updateModalCalculatedAc === 'function') updateModalCalculatedAc();

  const lvl = parseInt(document.getElementById('pm-level')?.value) || 1;
  const isNew = !document.getElementById('pm-id')?.value;
  if (isNew || lvl === 1) {
    const conVal = parseInt(document.getElementById('pm-con')?.value) || assigned['con'] || 14;
    const hpVal = calculateLevel1Hp(className, conVal);
    const hpEl = document.getElementById('pm-maxhp');
    if (hpEl) hpEl.value = hpVal;
  }

  if (typeof playFX === 'function') playFX('heal');
  const msg = `📊 <b>Array Padrão Aplicado (15, 14, 13, 12, 10, 8)</b><br>Valores base organizados para <b>${className}</b> com bônus raciais somados!`;
  if (typeof showToast === 'function') showToast(msg, 'info');
  else alert(`📊 Array Padrão aplicado para ${className}!`);
}

function optimizeAttributesForClassModal() {
  const classSel = document.getElementById('pm-class-select');
  const classInput = document.getElementById('pm-class');
  const className = classSel ? (classSel.value === 'custom' ? (classInput ? classInput.value : 'Guerreiro') : classSel.value) : 'Guerreiro';

  const currentScores = [
    parseInt(document.getElementById('pm-base-str')?.value) || parseInt(document.getElementById('pm-str')?.value) || 10,
    parseInt(document.getElementById('pm-base-dex')?.value) || parseInt(document.getElementById('pm-dex')?.value) || 10,
    parseInt(document.getElementById('pm-base-con')?.value) || parseInt(document.getElementById('pm-con')?.value) || 10,
    parseInt(document.getElementById('pm-base-int')?.value) || parseInt(document.getElementById('pm-int')?.value) || 10,
    parseInt(document.getElementById('pm-base-wis')?.value) || parseInt(document.getElementById('pm-wis')?.value) || 10,
    parseInt(document.getElementById('pm-base-cha')?.value) || parseInt(document.getElementById('pm-cha')?.value) || 10
  ];

  currentScores.sort((a, b) => b - a);
  const priority = getClassAttributePriority(className);
  const assigned = {};
  priority.forEach((attrKey, idx) => {
    assigned[attrKey] = currentScores[idx];
    const baseEl = document.getElementById(`pm-base-${attrKey}`);
    if (baseEl) baseEl.value = currentScores[idx];
    const el = document.getElementById(`pm-${attrKey}`);
    if (el) el.value = currentScores[idx];
  });

  if (typeof updateModalAttributeModifiers === 'function') updateModalAttributeModifiers();
  if (typeof updateModalCalculatedAc === 'function') updateModalCalculatedAc();

  const lvl = parseInt(document.getElementById('pm-level')?.value) || 1;
  const isNew = !document.getElementById('pm-id')?.value;
  if (isNew || lvl === 1) {
    const conVal = parseInt(document.getElementById('pm-con')?.value) || assigned['con'] || 14;
    const hpVal = calculateLevel1Hp(className, conVal);
    const hpEl = document.getElementById('pm-maxhp');
    if (hpEl) hpEl.value = hpVal;
  }

  const msg = `⚡ <b>Atributos Reordenados p/ ${className}!</b><br>Valores base reordenados por prioridade da classe e recalculados com bônus raciais!`;
  if (typeof showToast === 'function') showToast(msg, 'info');
  else alert(`⚡ Atributos reordenados para ${className}!`);
}

// ===================================================
// ⚔️ MODAL PLAYER: ARMAS, ACERTO, DANO E AUTOMAÇÃO
// ===================================================

let modalEquippedWeapons = [];

function getModalSimulatedPlayer() {
  const pId = document.getElementById('pm-id')?.value;
  const existing = pId ? (typeof PLAYERS !== 'undefined' ? PLAYERS.find(x => String(x.id) === String(pId)) : null) : null;
  const classSel = document.getElementById('pm-class-select');
  const classInput = document.getElementById('pm-class');
  const className = classSel ? (classSel.value === 'custom' ? (classInput ? classInput.value : 'Guerreiro') : classSel.value) : (classInput ? classInput.value : 'Guerreiro');
  const subclassSel = document.getElementById('pm-subclass-select');
  const subclassIdx = subclassSel ? parseInt(subclassSel.value) || 0 : 0;
  const level = parseInt(document.getElementById('pm-level')?.value) || 1;
  const raceSel = document.getElementById('pm-race-select');
  const raceInput = document.getElementById('pm-race');
  const race = raceSel ? (raceSel.value === 'custom' ? (raceInput ? raceInput.value : 'Humano') : raceSel.value) : (raceInput ? raceInput.value : 'Humano');
  const fightingStyle = document.getElementById('pm-fighting-style')?.value || (existing ? existing.fightingStyle : '') || '';

  return {
    id: pId || 'temp_modal_player',
    name: document.getElementById('pm-name')?.value || 'Herói',
    className,
    subclassIdx,
    subclass: (subclassSel && subclassSel.options && subclassSel.options[subclassSel.selectedIndex]?.text) || (existing ? existing.subclass : '') || '',
    level,
    race,
    fightingStyle,
    str: parseInt(document.getElementById('pm-str')?.value) || 10,
    dex: parseInt(document.getElementById('pm-dex')?.value) || 10,
    con: parseInt(document.getElementById('pm-con')?.value) || 10,
    int: parseInt(document.getElementById('pm-int')?.value) || 10,
    wis: parseInt(document.getElementById('pm-wis')?.value) || 10,
    cha: parseInt(document.getElementById('pm-cha')?.value) || 10
  };
}

function getRacialAndClassSpeed(raceName, className, level, armorKey = 'none') {
  const normRace = (raceName || '').toLowerCase().trim();
  const normClass = (className || '').toLowerCase().trim();
  const lvl = parseInt(level) || 1;
  const normArmor = (armorKey || '').toLowerCase().trim();

  let baseSpeed = 9; // metros (padrão 30ft)

  // Pequenas raças ou lentas oficiais 5E
  if (normRace.includes('anão') || normRace.includes('anao') || normRace.includes('dwarf') ||
    normRace.includes('halfling') || normRace.includes('gnomo') || normRace.includes('gnome')) {
    baseSpeed = 7.5;
  } else if (normRace.includes('floresta') || normRace.includes('bosque') || normRace.includes('wood elf')) {
    baseSpeed = 10.5;
  } else if (normRace.includes('centauro')) {
    baseSpeed = 12;
  }

  // Bônus de classe: Bárbaro (Movimento Rápido Nv 5+: +3m se não usar armadura pesada)
  const isHeavyArmor = ['cota de aneis', 'cota de malha', 'cota de talas', 'armadura de placas'].includes(normArmor);
  if (normClass.includes('bárbaro') || normClass.includes('barbaro')) {
    if (lvl >= 5 && !isHeavyArmor) {
      baseSpeed += 3;
    }
  }

  // Bônus de classe: Monge (Movimento sem Armadura Nv 2+: sem armadura e sem escudo)
  const hasShield = document.getElementById('pm-shield-check')?.checked;
  if (normClass.includes('monge') && (normArmor === 'none' || !normArmor) && !hasShield) {
    if (lvl >= 18) baseSpeed += 9;
    else if (lvl >= 14) baseSpeed += 7.5;
    else if (lvl >= 10) baseSpeed += 6;
    else if (lvl >= 6) baseSpeed += 4.5;
    else if (lvl >= 2) baseSpeed += 3;
  }

  return `${String(baseSpeed).replace('.', ',')}m`;
}

function getRecommendedMaxHp(className, conVal, level) {
  const lvl = Math.max(1, parseInt(level) || 1);
  const con = parseInt(conVal) || 10;
  const conMod = Math.floor((con - 10) / 2);
  const hd = typeof getHitDieForClass === 'function' ? getHitDieForClass(className) : '1d8';
  const dieNumMatch = hd.match(/d(\d+)/i);
  const dieMax = dieNumMatch ? parseInt(dieNumMatch[1]) : 8;
  const dieAvg = Math.floor(dieMax / 2) + 1; // d6=4, d8=5, d10=6, d12=7

  const lv1Hp = Math.max(1, dieMax + conMod);
  if (lvl === 1) return lv1Hp;

  const perLevelGain = Math.max(1, dieAvg + conMod);
  return lv1Hp + (perLevelGain * (lvl - 1));
}

function updateSuggestedHpLabelModal() {
  const btn = document.getElementById('btn-suggest-hp');
  if (!btn) return;
  const classSel = document.getElementById('pm-class-select');
  const classInput = document.getElementById('pm-class');
  const className = classSel ? (classSel.value === 'custom' ? (classInput ? classInput.value : 'Guerreiro') : classSel.value) : 'Guerreiro';
  const conVal = parseInt(document.getElementById('pm-con')?.value) || 10;
  const lvl = parseInt(document.getElementById('pm-level')?.value) || 1;
  const suggested = getRecommendedMaxHp(className, conVal, lvl);
  btn.innerHTML = `💡 Sugerir (${suggested} PV)`;
  btn.dataset.suggestedHp = suggested;
}

function applySuggestedHpModal() {
  const btn = document.getElementById('btn-suggest-hp');
  const suggested = btn && btn.dataset.suggestedHp ? parseInt(btn.dataset.suggestedHp) : null;
  const hpInp = document.getElementById('pm-maxhp');
  if (hpInp && suggested) {
    hpInp.value = suggested;
    if (typeof showToast === 'function') {
      showToast(`💚 PV Máximo ajustado para ${suggested} PV (Cálculo Oficial 5E)!`, 'success');
    }
    if (typeof playFX === 'function') playFX('heal');
  }
}

function toggleManualSlotsModal() {
  const container = document.getElementById('pm-slots-container');
  if (container) {
    container.style.display = container.style.display === 'none' ? 'grid' : 'none';
  }
}

function toggleManualAttacksInputModal() {
  const wrapper = document.getElementById('pm-attacks-text-wrapper');
  if (wrapper) {
    wrapper.style.display = wrapper.style.display === 'none' ? 'block' : 'none';
  }
}

function populateModalQuickWeaponSelect() {
  const sel = document.getElementById('pm-quick-weapon-select');
  if (!sel) return;

  if (typeof EQUIPMENT_DATA === 'undefined' || !Array.isArray(EQUIPMENT_DATA)) {
    sel.innerHTML = '<option value="">(Equipamentos não carregados)</option>';
    return;
  }

  const weapons = EQUIPMENT_DATA.filter(it => (it.category || '').toLowerCase().includes('armas'));
  const simpleMelee = [];
  const martialMelee = [];
  const ranged = [];

  weapons.forEach(w => {
    const cat = (w.category || '').toLowerCase();
    const prop = (w.prop || '').toLowerCase();
    if (cat.includes('distância') || cat.includes('distancia') || prop.includes('distância') || prop.includes('distancia')) {
      ranged.push(w);
    } else if (cat.includes('marciais')) {
      martialMelee.push(w);
    } else {
      simpleMelee.push(w);
    }
  });

  sel.innerHTML = `
    <option value="">-- Selecione uma arma do catálogo --</option>
    <optgroup label="Armas Simples Corpo a Corpo">
      ${simpleMelee.map(w => `<option value="${w.name}">${w.name} (${w.damage})</option>`).join('')}
    </optgroup>
    <optgroup label="Armas Marciais Corpo a Corpo">
      ${martialMelee.map(w => `<option value="${w.name}">${w.name} (${w.damage})</option>`).join('')}
    </optgroup>
    <optgroup label="Armas à Distância">
      ${ranged.map(w => `<option value="${w.name}">${w.name} (${w.damage})</option>`).join('')}
    </optgroup>
  `;
}

function addModalEquippedWeaponFromSelect() {
  const sel = document.getElementById('pm-quick-weapon-select');
  if (!sel || !sel.value) return;
  addModalWeapon(sel.value);
  sel.value = '';
}

function addModalWeapon(weaponName) {
  if (!weaponName) return;
  if (!modalEquippedWeapons.includes(weaponName)) {
    modalEquippedWeapons.push(weaponName);
  }
  renderModalEquippedWeapons();
  if (typeof showToast === 'function') {
    showToast(`⚔️ ${weaponName} equipada com acerto e dano calculados!`, 'success');
  }
  if (typeof playFX === 'function') playFX('sword');
}

function removeModalWeapon(index) {
  if (index >= 0 && index < modalEquippedWeapons.length) {
    const removed = modalEquippedWeapons.splice(index, 1);
    renderModalEquippedWeapons();
    if (typeof showToast === 'function') {
      showToast(`🗑️ ${removed[0]} removida dos ataques equipados.`, 'info');
    }
  }
}

function renderModalEquippedWeapons() {
  const grid = document.getElementById('pm-weapons-grid');
  const atkInput = document.getElementById('pm-attacks');
  if (!grid) return;

  const simPlayer = getModalSimulatedPlayer();

  if (modalEquippedWeapons.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; padding: 10px; text-align: center; color: var(--text-muted); font-size: 11px; background: rgba(0,0,0,0.2); border-radius: 6px; border: 1px dashed rgba(255,255,255,0.08);">
        Nenhuma arma equipada no momento. Selecione uma arma acima ou adicione pelo catálogo para calcular o acerto e dano automaticamente!
      </div>
    `;
    if (atkInput && !atkInput.dataset.manualEdited) {
      atkInput.value = '';
    }
    return;
  }

  const formattedAttacks = [];

  grid.innerHTML = modalEquippedWeapons.map((wpnName, idx) => {
    const stats = calculateWeaponAttackStats(simPlayer, wpnName);
    if (!stats) return '';

    formattedAttacks.push(stats.formattedText);
    const isProf = stats.isProficient;
    const keyAttrLabel = stats.keyAttr === 'dex' ? 'DES' : 'FOR';

    return `
      <div class="modal-weapon-card ${isProf ? 'proficient' : 'non-proficient'}">
        <div class="modal-weapon-top">
          <div class="modal-weapon-name">⚔️ ${stats.name}</div>
          <button type="button" class="modal-weapon-del-btn" onclick="removeModalWeapon(${idx})" title="Desequipar arma">✕</button>
        </div>
        <div class="modal-weapon-stats-row">
          <span class="modal-weapon-badge-hit" title="Acerto baseado em ${keyAttrLabel} (${stats.attrMod >= 0 ? '+' : ''}${stats.attrMod}) ${isProf ? '+ Proficiência (+' + stats.pb + ')' : ''}">
            🎯 Acerto: <b>${stats.hitStr}</b>
          </span>
          <span class="modal-weapon-badge-dmg" title="Fórmula oficial de dano 5E">
            💥 Dano: <b>${stats.damageFormula} ${stats.damageType}</b>
          </span>
        </div>
        ${stats.properties ? `<div class="modal-weapon-prop">${stats.properties}</div>` : ''}
      </div>
    `;
  }).join('');

  if (atkInput && !atkInput.dataset.manualEdited) {
    atkInput.value = formattedAttacks.join(', ');
  }
}

function onModalAttacksManualInput() {
  const atkInput = document.getElementById('pm-attacks');
  if (atkInput) {
    atkInput.dataset.manualEdited = 'true';
  }
}

function onModalStatChange() {
  if (typeof updateModalAttributeModifiers === 'function') updateModalAttributeModifiers();
  if (typeof updateModalCalculatedAc === 'function') updateModalCalculatedAc();
  if (typeof updateSuggestedHpLabelModal === 'function') updateSuggestedHpLabelModal();
  if (typeof renderModalEquippedWeapons === 'function') renderModalEquippedWeapons();
}

function onPlayerModalClassOrLevelChange(preserveSlotsIfSet = false) {
  const classSel = document.getElementById('pm-class-select');
  const classInput = document.getElementById('pm-class');
  const subclassSel = document.getElementById('pm-subclass-select');
  const levelInput = document.getElementById('pm-level');
  const hitDiceInput = document.getElementById('pm-hitdice');
  const raceSel = document.getElementById('pm-race-select');
  const raceInput = document.getElementById('pm-race');

  const selectedClassName = classSel ? (classSel.value === 'custom' ? (classInput ? classInput.value : 'Guerreiro') : classSel.value) : (classInput ? classInput.value : 'Guerreiro');
  const selectedRace = raceSel ? (raceSel.value === 'custom' ? (raceInput ? raceInput.value : 'Humano') : raceSel.value) : (raceInput ? raceInput.value : 'Humano');
  const level = parseInt(levelInput ? levelInput.value : 1) || 1;

  if (classInput && classSel && classSel.value !== 'custom') {
    classInput.value = selectedClassName;
  }
  if (raceInput && raceSel && raceSel.value !== 'custom') {
    raceInput.value = selectedRace;
  }

  if (hitDiceInput) {
    const hd = getHitDieForClass(selectedClassName);
    hitDiceInput.value = `${level}${hd.replace(/^[0-9]+/, '')}`;
  }

  // Se for criação de novo personagem ou nível 1, sugere PV e armas iniciais adequadas
  const isNewChar = !document.getElementById('pm-id')?.value;
  if (isNewChar && level === 1) {
    const conVal = parseInt(document.getElementById('pm-con')?.value) || 10;
    const hpInput = document.getElementById('pm-maxhp');
    if (hpInput) {
      hpInput.value = calculateLevel1Hp(selectedClassName, conVal);
    }
  }

  // Atualiza Deslocamento vinculado à Raça e Bônus de Classe (Bárbaro/Monge)
  const speedInp = document.getElementById('pm-speed');
  if (speedInp) {
    const armorSel = document.getElementById('pm-armor-select');
    const autoSpeed = getRacialAndClassSpeed(selectedRace, selectedClassName, level, armorSel ? armorSel.value : 'none');
    if (isNewChar || speedInp.value === '9m' || speedInp.value === '7.5m' || speedInp.value === '7,5m' || !speedInp.value) {
      speedInp.value = autoSpeed;
    }
  }

  if (subclassSel && typeof CLASSES_DATA !== 'undefined') {
    const cls = findClassData(selectedClassName);
    if (cls && cls.subclasses) {
      const pending = subclassSel.dataset.pendingSubIdx;
      const currentSubVal = pending !== undefined ? parseInt(pending) : (parseInt(subclassSel.value) || 0);
      delete subclassSel.dataset.pendingSubIdx;
      subclassSel.innerHTML = cls.subclasses.map((s, idx) => `
        <option value="${idx}" ${idx === currentSubVal ? 'selected' : ''}>${s.name}</option>
      `).join('');
      subclassSel.disabled = false;
    } else {
      delete subclassSel.dataset.pendingSubIdx;
      const pId = document.getElementById('pm-id')?.value;
      const existing = pId ? PLAYERS.find(x => String(x.id) === String(pId)) : null;
      const existingSubName = existing && existing.subclass ? existing.subclass : 'Padrão / Sem Subclasse';
      subclassSel.innerHTML = `<option value="0">${existingSubName}</option>`;
      subclassSel.disabled = true;
    }
  }

  const subIdx = subclassSel ? parseInt(subclassSel.value) || 0 : 0;
  const isCaster = typeof isSpellcasterClass === 'function' ? isSpellcasterClass(selectedClassName, subIdx) : false;

  // Verifica se deve preservar slots existentes (se não estiverem zerados)
  const currentSlots = [];
  for (let i = 1; i <= 9; i++) {
    currentSlots.push(parseInt(document.getElementById(`pm-slot-${i}`)?.value) || 0);
  }

  const hasCustomSlots = preserveSlotsIfSet && currentSlots.some(s => s > 0);
  const slots = hasCustomSlots ? currentSlots : calculateSpellSlots(selectedClassName, level, subIdx);

  for (let i = 1; i <= 9; i++) {
    const slotInput = document.getElementById(`pm-slot-${i}`);
    if (slotInput) slotInput.value = slots[i - 1] || 0;
  }

  // Alterna exibição de slots para classes não-conjuradoras
  const nonCasterNotice = document.getElementById('pm-non-caster-box');
  const slotsContainer = document.getElementById('pm-slots-container');
  if (nonCasterNotice && slotsContainer) {
    if (!isCaster && !hasCustomSlots) {
      nonCasterNotice.style.display = 'flex';
      slotsContainer.style.display = 'none';
    } else {
      nonCasterNotice.style.display = 'none';
      slotsContainer.style.display = 'grid';
    }
  }

  // Atualiza CA calculada automaticamente para a classe e atributos
  if (typeof updateModalCalculatedAc === 'function') {
    updateModalCalculatedAc();
  }

  // Atualiza chip de sugestão de PV
  updateSuggestedHpLabelModal();

  // Recalcula cards de armas equipadas
  renderModalEquippedWeapons();

  const previewBox = document.getElementById('pm-features-preview');
  if (previewBox) {
    const unlocked = getUnlockedClassFeatures(selectedClassName, level, subIdx);
    if (unlocked.length > 0) {
      previewBox.innerHTML = unlocked.map(f => {
        const actType = typeof getFeatureActionType === 'function' ? getFeatureActionType(f) : 'passive';
        const actLabel = actType === 'bonus' ? 'Bônus' : (actType === 'reaction' ? 'Reação' : (actType === 'action' ? 'Ação' : 'Passiva'));
        const formattedDesc = typeof formatFeatureSnippet === 'function' ? formatFeatureSnippet(f.desc) : (f.desc || '');
        return `
          <div class="pm-feature-item">
            <div class="pm-feature-header">
              <div class="pm-feature-name">
                <span>✨</span>
                <span>${f.name}</span>
              </div>
              <div class="pm-feature-badges">
                <span class="badge ${f.isSubclass ? 'badge-sub' : 'badge-cls'}" style="font-size: 9px;">Nv ${f.level}</span>
                <span class="action-economy-tag ${actType}" style="font-size: 8.5px;">${actLabel}</span>
              </div>
            </div>
            <div class="pm-feature-body">
              ${formattedDesc}
            </div>
          </div>
        `;
      }).join('');
    } else {
      previewBox.innerHTML = `<span style="color:var(--text-dim); font-size:11px;">Nenhuma habilidade de classe listada para este nível.</span>`;
    }
  }

  // ISSUE-160: Sincroniza os painéis interativos do D&D Beyond Character Builder
  if (typeof renderModalClassBuilderCards === 'function') renderModalClassBuilderCards();
  if (typeof renderModalClassSkillsPicker === 'function') renderModalClassSkillsPicker();
  if (typeof renderModalSpeciesBuilderCards === 'function') renderModalSpeciesBuilderCards();
  if (typeof renderModalTraitSuggestions === 'function') renderModalTraitSuggestions();
  if (typeof renderModalStartingEquipmentChoices === 'function') renderModalStartingEquipmentChoices();
  if (typeof updateDdbHeroSummaryBar === 'function') updateDdbHeroSummaryBar();
}

function updateModalCalculatedAc() {
  const pId = document.getElementById('pm-id')?.value;
  const existing = pId ? PLAYERS.find(x => String(x.id) === String(pId)) : null;
  const classSel = document.getElementById('pm-class-select');
  const classInput = document.getElementById('pm-class');
  const selectedClassName = classSel ? (classSel.value === 'custom' ? (classInput ? classInput.value : 'Guerreiro') : classSel.value) : (classInput ? classInput.value : 'Guerreiro');
  const subclassSel = document.getElementById('pm-subclass-select');
  const subIdx = subclassSel ? parseInt(subclassSel.value) || 0 : 0;

  const armorSel = document.getElementById('pm-armor-select');
  const shieldChk = document.getElementById('pm-shield-check');
  const selectedArmorKey = armorSel ? armorSel.value : (existing ? getPlayerEquippedArmorKey(existing) : 'none');
  const hasShield = shieldChk ? shieldChk.checked : (existing ? hasPlayerEquippedShield(existing) : false);

  let simulatedInventory = [];
  if (selectedArmorKey && selectedArmorKey !== 'none') {
    simulatedInventory.push({ name: selectedArmorKey, equipped: true });
  }
  if (hasShield) {
    simulatedInventory.push({ name: 'Escudo', equipped: true });
  }

  const tempPlayer = {
    dex: parseInt(document.getElementById('pm-dex')?.value) || 10,
    con: parseInt(document.getElementById('pm-con')?.value) || 10,
    wis: parseInt(document.getElementById('pm-wis')?.value) || 10,
    className: selectedClassName,
    subclassIdx: subIdx,
    fightingStyle: (existing && existing.fightingStyle) || document.getElementById('pm-fighting-style')?.value || '',
    inventory: simulatedInventory
  };

  const calculated = calculatePlayerAcFromEquipment(tempPlayer);
  const acInput = document.getElementById('pm-ac');
  if (acInput) {
    acInput.value = calculated;
  }

  // Atualiza badge de fórmula explicativa de CA
  const formulaEl = document.getElementById('pm-ca-formula');
  if (formulaEl) {
    const dexMod = Math.floor(((tempPlayer.dex || 10) - 10) / 2);
    const conMod = Math.floor(((tempPlayer.con || 10) - 10) / 2);
    const wisMod = Math.floor(((tempPlayer.wis || 10) - 10) / 2);
    const normClass = (selectedClassName || '').toLowerCase();

    if (selectedArmorKey === 'none' || !selectedArmorKey) {
      if (normClass.includes('bárbaro') || normClass.includes('barbaro')) {
        formulaEl.innerHTML = `🛡️ Defesa Bárbaro: 10 + DES (${dexMod >= 0 ? '+' : ''}${dexMod}) + CON (${conMod >= 0 ? '+' : ''}${conMod})${hasShield ? ' + Escudo (+2)' : ''} = <b>${calculated}</b>`;
      } else if (normClass.includes('monge') && !hasShield) {
        formulaEl.innerHTML = `🛡️ Defesa Monge: 10 + DES (${dexMod >= 0 ? '+' : ''}${dexMod}) + SAB (${wisMod >= 0 ? '+' : ''}${wisMod}) = <b>${calculated}</b>`;
      } else {
        formulaEl.innerHTML = `🛡️ Sem Armadura: 10 + DES (${dexMod >= 0 ? '+' : ''}${dexMod})${hasShield ? ' + Escudo (+2)' : ''} = <b>${calculated}</b>`;
      }
    } else {
      const armData = typeof getArmorItemStats === 'function' ? getArmorItemStats(selectedArmorKey) : null;
      const armName = armData ? armData.name : selectedArmorKey;
      formulaEl.innerHTML = `🛡️ ${armName}${hasShield ? ' + Escudo (+2)' : ''} = <b>${calculated}</b>`;
    }
  }

  if (typeof updateModalAttributeModifiers === 'function') updateModalAttributeModifiers();
  if (typeof updateSuggestedHpLabelModal === 'function') updateSuggestedHpLabelModal();
  if (typeof renderModalEquippedWeapons === 'function') renderModalEquippedWeapons();

  return calculated;
}

function updateModalAttributeModifiers() {
  const raceSel = document.getElementById('pm-race-select');
  const raceInput = document.getElementById('pm-race');
  const raceName = raceSel ? (raceSel.value === 'custom' ? (raceInput ? raceInput.value : 'Humano') : raceSel.value) : (raceInput ? raceInput.value : 'Humano');
  const rBonuses = typeof getRacialAbilityBonuses === 'function' ? getRacialAbilityBonuses(raceName) : { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0, label: 'Nenhum (+0)' };

  // Atualiza barra de resumo do bônus racial
  const summaryEl = document.getElementById('pm-race-summary-text');
  if (summaryEl) {
    summaryEl.innerHTML = `🧬 <b>Bônus Racial Ativo:</b> <span style="color: #4ade80; font-weight: 700;">${rBonuses.label || 'Nenhum (+0)'}</span>`;
  }

  const stats = [
    { key: 'str', id: 'pm-str', baseId: 'pm-base-str', finalId: 'pm-final-str', bonusId: 'pm-race-bonus-str', modId: 'pm-mod-str' },
    { key: 'dex', id: 'pm-dex', baseId: 'pm-base-dex', finalId: 'pm-final-dex', bonusId: 'pm-race-bonus-dex', modId: 'pm-mod-dex' },
    { key: 'con', id: 'pm-con', baseId: 'pm-base-con', finalId: 'pm-final-con', bonusId: 'pm-race-bonus-con', modId: 'pm-mod-con' },
    { key: 'int', id: 'pm-int', baseId: 'pm-base-int', finalId: 'pm-final-int', bonusId: 'pm-race-bonus-int', modId: 'pm-mod-int' },
    { key: 'wis', id: 'pm-wis', baseId: 'pm-base-wis', finalId: 'pm-final-wis', bonusId: 'pm-race-bonus-wis', modId: 'pm-mod-wis' },
    { key: 'cha', id: 'pm-cha', baseId: 'pm-base-cha', finalId: 'pm-final-cha', bonusId: 'pm-race-bonus-cha', modId: 'pm-mod-cha' }
  ];

  stats.forEach(st => {
    const baseInp = document.getElementById(st.baseId);
    const finalInp = document.getElementById(st.id);
    const finalDisplay = document.getElementById(st.finalId);
    const bonusBadge = document.getElementById(st.bonusId);
    const pill = document.getElementById(st.modId);

    const bonus = rBonuses[st.key] || 0;

    let baseVal;
    if (baseInp && baseInp.value !== '') {
      baseVal = parseInt(baseInp.value) || 10;
    } else if (finalInp && finalInp.value !== '') {
      baseVal = Math.max(1, (parseInt(finalInp.value) || 10) - bonus);
      if (baseInp) baseInp.value = baseVal;
    } else {
      baseVal = 10;
      if (baseInp) baseInp.value = 10;
    }

    const finalVal = baseVal + bonus;

    if (finalInp) finalInp.value = finalVal;
    if (finalDisplay) finalDisplay.textContent = finalVal;

    if (bonusBadge) {
      if (bonus > 0) {
        bonusBadge.textContent = `+${bonus} Raça`;
        bonusBadge.className = 'stat-race-badge positive';
      } else if (bonus < 0) {
        bonusBadge.textContent = `${bonus} Raça`;
        bonusBadge.className = 'stat-race-badge negative';
      } else {
        bonusBadge.textContent = `+0`;
        bonusBadge.className = 'stat-race-badge neutral';
      }
    }

    if (pill) {
      const mod = Math.floor((finalVal - 10) / 2);
      const sign = mod >= 0 ? '+' : '';
      pill.textContent = `${sign}${mod}`;
      if (mod < 0) {
        pill.classList.add('neg');
      } else {
        pill.classList.remove('neg');
      }
    }
  });

  if (typeof updateSuggestedHpLabelModal === 'function') updateSuggestedHpLabelModal();
  if (typeof renderModalEquippedWeapons === 'function') renderModalEquippedWeapons();
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

  modalEquippedWeapons = [];
  const atkInput = document.getElementById('pm-attacks');
  if (atkInput) delete atkInput.dataset.manualEdited;

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

    // Sincroniza seletor de armadura e escudo
    const armorSel = document.getElementById('pm-armor-select');
    if (armorSel) {
      armorSel.value = getPlayerEquippedArmorKey(p) || 'none';
    }
    const shieldChk = document.getElementById('pm-shield-check');
    if (shieldChk) {
      shieldChk.checked = hasPlayerEquippedShield(p);
    }

    document.getElementById('pm-ac').value = calculatePlayerAcFromEquipment(p) || p.ac || 10;
    document.getElementById('pm-maxhp').value = p.maxHp;
    document.getElementById('pm-speed').value = p.speed || '9m';
    document.getElementById('pm-gold').value = (p.coins && p.coins.gp !== undefined) ? p.coins.gp : (p.gold || 15);
    const rBonuses = typeof getRacialAbilityBonuses === 'function' ? getRacialAbilityBonuses(p.race) : {};
    ['str', 'dex', 'con', 'int', 'wis', 'cha'].forEach(attr => {
      const baseEl = document.getElementById(`pm-base-${attr}`);
      if (baseEl) {
        if (p.baseAttributes && p.baseAttributes[attr] !== undefined) {
          baseEl.value = p.baseAttributes[attr];
        } else {
          baseEl.value = Math.max(1, (p[attr] || 10) - (rBonuses[attr] || 0));
        }
      }
      const finalEl = document.getElementById(`pm-${attr}`);
      if (finalEl) finalEl.value = p[attr] || 10;
    });
    document.getElementById('pm-attacks').value = p.attacks || '';
    document.getElementById('pm-features').value = p.features || '';
    document.getElementById('pm-spells').value = p.spells || '';

    // Sincroniza armas equipadas para o modal
    if (p && Array.isArray(p.inventory)) {
      p.inventory.forEach(item => {
        if (item.equipped) {
          const found = typeof EQUIPMENT_DATA !== 'undefined'
            ? EQUIPMENT_DATA.find(w => (w.category || '').toLowerCase().includes('armas') && (w.name.toLowerCase() === item.name.toLowerCase() || item.name.toLowerCase().includes(w.name.toLowerCase())))
            : null;
          if (found && !modalEquippedWeapons.includes(found.name)) {
            modalEquippedWeapons.push(found.name);
          }
        }
      });
    }

    if (modalEquippedWeapons.length === 0 && p && p.attacks) {
      const rawAttacks = p.attacks.split(/[,|;]+/).map(s => s.trim()).filter(s => s);
      rawAttacks.forEach(raw => {
        const wNameMatch = raw.split('(')[0].trim();
        if (wNameMatch && typeof EQUIPMENT_DATA !== 'undefined') {
          const found = EQUIPMENT_DATA.find(w => (w.category || '').toLowerCase().includes('armas') && (w.name.toLowerCase().includes(wNameMatch.toLowerCase()) || wNameMatch.toLowerCase().includes(w.name.toLowerCase())));
          if (found && !modalEquippedWeapons.includes(found.name)) {
            modalEquippedWeapons.push(found.name);
          }
        }
      });
    }

    // Novos campos de Origem & Background (P3)
    const bgInp = document.getElementById('pm-background');
    if (bgInp) bgInp.value = p.background || 'Aventureiro';
    const persInp = document.getElementById('pm-personality');
    if (persInp) persInp.value = p.personality || '';
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

    // ISSUE-160: Campos de Detalhes & Características Físicas (D&D Beyond)
    const setValIfEl = (elId, val) => {
      const el = document.getElementById(elId);
      if (el) el.value = val || '';
    };
    setValIfEl('pm-alignment', p.alignment || 'Neutro e Bom');
    setValIfEl('pm-faith', p.faith || '');
    setValIfEl('pm-lifestyle', p.lifestyle || 'Modesto');
    setValIfEl('pm-gender', p.gender || '');
    setValIfEl('pm-age', p.age || '');
    setValIfEl('pm-height', p.height || '');
    setValIfEl('pm-weight', p.weight || '');
    setValIfEl('pm-eyes', p.eyes || '');
    setValIfEl('pm-skin', p.skin || '');
    setValIfEl('pm-hair', p.hair || '');

    if (typeof window !== 'undefined') {
      window._modalSelectedClassSkills = Array.isArray(p.skillProficiencies) ? [...p.skillProficiencies] : [];
      window._modalStartingInventory = Array.isArray(p.inventory) ? JSON.parse(JSON.stringify(p.inventory)) : [];
      window._modalStartingEquipChoices = {};
    }

    const fsSel = document.getElementById('pm-fighting-style');
    if (fsSel) {
      fsSel.value = p.fightingStyle || '';
    }

    const slots = p.slots || [0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (let i = 1; i <= 9; i++) {
      const slotEl = document.getElementById(`pm-slot-${i}`);
      if (slotEl) slotEl.value = slots[i - 1] || 0;
    }

    document.getElementById('pm-badges').value = (p.badges || []).join(', ');

    const subclassSel = document.getElementById('pm-subclass-select');
    if (subclassSel) {
      subclassSel.dataset.pendingSubIdx = (p && p.subclassIdx !== undefined) ? p.subclassIdx : 0;
    }

    if (delBtn) delBtn.style.display = 'block';
  } else {
    const subclassSel = document.getElementById('pm-subclass-select');
    if (subclassSel) {
      subclassSel.dataset.pendingSubIdx = 0;
    }
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
    const defaultBases = { str: 15, dex: 14, con: 13, int: 12, wis: 10, cha: 8 };
    ['str', 'dex', 'con', 'int', 'wis', 'cha'].forEach(attr => {
      const baseEl = document.getElementById(`pm-base-${attr}`);
      if (baseEl) baseEl.value = defaultBases[attr];
      const finalEl = document.getElementById(`pm-${attr}`);
      if (finalEl) finalEl.value = defaultBases[attr];
    });
    document.getElementById('pm-attacks').value = 'Espada Longa (+4, 1d8+2 cortante)';
    document.getElementById('pm-features').value = '';
    document.getElementById('pm-spells').value = '';

    // Armas padrão de Guerreiro inicial
    modalEquippedWeapons = ['Espada Longa', 'Besta Pesada'];

    // Novos campos de Origem & Background (P3)
    const bgInp = document.getElementById('pm-background');
    if (bgInp) bgInp.value = 'Soldado';
    const persInp = document.getElementById('pm-personality');
    if (persInp) persInp.value = '';
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

    // ISSUE-160: Limpa campos de Detalhes & Características Físicas
    const setValIfEl = (elId, val) => {
      const el = document.getElementById(elId);
      if (el) el.value = val || '';
    };
    setValIfEl('pm-alignment', 'Neutro e Bom');
    setValIfEl('pm-faith', '');
    setValIfEl('pm-lifestyle', 'Modesto');
    setValIfEl('pm-gender', '');
    setValIfEl('pm-age', '');
    setValIfEl('pm-height', '');
    setValIfEl('pm-weight', '');
    setValIfEl('pm-eyes', '');
    setValIfEl('pm-skin', '');
    setValIfEl('pm-hair', '');

    if (typeof window !== 'undefined') {
      window._modalSelectedClassSkills = [];
      window._modalStartingInventory = [];
      window._modalStartingEquipChoices = {};
    }

    const fsSel = document.getElementById('pm-fighting-style');
    if (fsSel) fsSel.value = '';

    document.getElementById('pm-badges').value = '⭐ Presença 100%';
    document.getElementById('pm-slot-1').value = 0;
    document.getElementById('pm-slot-2').value = 0;
    document.getElementById('pm-slot-3').value = 0;
    document.getElementById('pm-slot-4').value = 0;
    document.getElementById('pm-slot-5').value = 0;
    if (delBtn) delBtn.style.display = 'none';
  }

  populateModalQuickWeaponSelect();
  onPlayerModalClassOrLevelChange(true);
  updateModalAttributeModifiers();
  updateModalCalculatedAc();
  updateSuggestedHpLabelModal();
  renderModalEquippedWeapons();
  if (typeof window !== 'undefined') window._modalPendingBackgroundSkills = [];
  if (typeof onModalBackgroundChange === 'function') {
    onModalBackgroundChange(document.getElementById('pm-background')?.value || '');
  }
  if (typeof initDdbCharacterBuilderModal === 'function') {
    initDdbCharacterBuilderModal();
  }

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

  let slots = [];
  for (let i = 1; i <= 9; i++) {
    const el = document.getElementById(`pm-slot-${i}`);
    slots.push(el ? (parseInt(el.value) || 0) : 0);
  }

  const rawBadges = document.getElementById('pm-badges').value || '';
  const badges = rawBadges.split(',').map(b => b.trim()).filter(b => b);

  const subclassSel = document.getElementById('pm-subclass-select');
  const classSel = document.getElementById('pm-class-select');
  const classNameVal = classSel && classSel.value !== 'custom' ? classSel.value : (document.getElementById('pm-class').value || 'Guerreiro');
  const clsObj = typeof findClassData === 'function' ? findClassData(classNameVal) : null;

  let subclassIdx = 0;
  let subclassName = '';
  if (subclassSel && !subclassSel.disabled && subclassSel.value !== undefined && subclassSel.value !== '') {
    subclassIdx = parseInt(subclassSel.value) || 0;
    if (clsObj && clsObj.subclasses && clsObj.subclasses[subclassIdx]) {
      subclassName = clsObj.subclasses[subclassIdx].name;
    } else {
      subclassName = existing ? (existing.subclass || '') : '';
    }
  } else if (existing) {
    subclassIdx = existing.subclassIdx !== undefined ? existing.subclassIdx : 0;
    subclassName = existing.subclass || '';
  }

  const charLevel = parseInt(document.getElementById('pm-level').value) || 1;
  const isCaster = isSpellcasterClass(classNameVal, subclassIdx, subclassName);
  if (isCaster && slots.every(s => s === 0)) {
    slots = calculateSpellSlots(classNameVal, charLevel, subclassIdx);
  }

  const raceSel = document.getElementById('pm-race-select');
  const raceVal = raceSel && raceSel.value !== 'custom' ? raceSel.value : (document.getElementById('pm-race').value || 'Humano');

  const bgVal = document.getElementById('pm-background') ? document.getElementById('pm-background').value.trim() : (existing ? existing.background || 'Aventureiro' : 'Aventureiro');
  const persVal = document.getElementById('pm-personality') ? document.getElementById('pm-personality').value.trim() : (existing ? existing.personality || '' : '');
  const idealVal = document.getElementById('pm-ideal') ? document.getElementById('pm-ideal').value.trim() : (existing ? existing.ideal || '' : '');
  const bondVal = document.getElementById('pm-bond') ? document.getElementById('pm-bond').value.trim() : (existing ? existing.bond || '' : '');
  const flawVal = document.getElementById('pm-flaw') ? document.getElementById('pm-flaw').value.trim() : (existing ? existing.flaw || '' : '');
  const storyVal = document.getElementById('pm-backstory') ? document.getElementById('pm-backstory').value.trim() : (existing ? existing.backstory || '' : '');
  const avatarVal = document.getElementById('pm-avatar') ? document.getElementById('pm-avatar').value.trim() : (existing ? existing.avatar || '👤' : '👤');

  const fsSel = document.getElementById('pm-fighting-style');
  const fightingStyle = fsSel ? fsSel.value : (existing ? existing.fightingStyle || '' : '');

  // Determina salvaguardas padrão se for criação de novo personagem
  let defaultSaves = [];
  if (!existing && typeof findClassData === 'function') {
    if (clsObj && clsObj.savingThrows) {
      const saveMap = {
        'força': 'str', 'forca': 'str', 'strength': 'str',
        'destreza': 'dex', 'dexterity': 'dex',
        'constituição': 'con', 'constituicao': 'con', 'constitution': 'con',
        'inteligência': 'int', 'inteligencia': 'int', 'intelligence': 'int',
        'sabedoria': 'wis', 'wisdom': 'wis',
        'carisma': 'cha', 'charisma': 'cha'
      };
      defaultSaves = clsObj.savingThrows.map(s => saveMap[s.toLowerCase()] || s.toLowerCase()).filter(s => ['str', 'dex', 'con', 'int', 'wis', 'cha'].includes(s));
    }
  }

  // Sincroniza a armadura e escudo selecionados no inventário
  const armorSel = document.getElementById('pm-armor-select');
  const shieldChk = document.getElementById('pm-shield-check');
  let currentInv = existing && Array.isArray(existing.inventory) ? JSON.parse(JSON.stringify(existing.inventory)) : [];

  if (armorSel && armorSel.value !== undefined) {
    const chosenArmor = armorSel.value;
    if (chosenArmor === 'none') {
      currentInv.forEach(item => {
        if (isArmorItem(item.name)) item.equipped = false;
      });
    } else if (isArmorItem(chosenArmor)) {
      currentInv.forEach(item => {
        if (isArmorItem(item.name)) item.equipped = false;
      });
      const armStats = getArmorItemStats(chosenArmor);
      const armName = armStats.name || chosenArmor;
      const existingArm = currentInv.find(it => isArmorItem(it.name) && (it.name.toLowerCase().includes(chosenArmor.toLowerCase()) || chosenArmor.toLowerCase().includes(it.name.toLowerCase())));
      if (existingArm) {
        existingArm.equipped = true;
      } else {
        currentInv.push({
          id: 'item_arm_' + Date.now(),
          name: armName,
          qty: 1,
          weight: armStats.type === 'heavy' ? 20 : (armStats.type === 'medium' ? 12 : 5),
          equipped: true
        });
      }
    }
  }

  if (shieldChk && shieldChk.checked !== undefined) {
    const hasShield = !!shieldChk.checked;
    if (!hasShield) {
      currentInv.forEach(item => {
        if (isShieldItem(item.name)) item.equipped = false;
      });
    } else {
      const existingShield = currentInv.find(it => isShieldItem(it.name));
      if (existingShield) {
        existingShield.equipped = true;
      } else {
        currentInv.push({
          id: 'item_shd_' + Date.now(),
          name: 'Escudo',
          qty: 1,
          weight: 6,
          equipped: true
        });
      }
    }
  }

  // Sincroniza armas equipadas do modal no inventário
  if (Array.isArray(modalEquippedWeapons)) {
    // Desequipa armas no inventário que foram removidas do modal
    currentInv.forEach(it => {
      if (isWeaponItem(it.name) || it.category === 'Armas') {
        const isStillInModal = modalEquippedWeapons.some(wName => {
          const normW = (wName || '').toLowerCase().trim();
          const itNorm = (it.name || '').toLowerCase().trim();
          return itNorm === normW || itNorm.includes(normW) || normW.includes(itNorm);
        });
        if (!isStillInModal) {
          it.equipped = false;
        }
      }
    });

    // Equipa ou insere as armas presentes no modal
    const isNewOrEmptyInv = !existing || !Array.isArray(existing.inventory) || existing.inventory.length === 0;
    modalEquippedWeapons.forEach((wName, i) => {
      const normW = (wName || '').toLowerCase().trim();
      if (!normW) return;
      const existingWpn = currentInv.find(it => {
        const itNorm = (it.name || '').toLowerCase().trim();
        const itBase = itNorm.split('(')[0].trim();
        const wBase = normW.split('(')[0].trim();
        return itNorm === normW || itBase === wBase || itNorm.includes(wBase) || wBase.includes(itBase);
      });
      if (existingWpn) {
        existingWpn.equipped = true;
      } else if (isNewOrEmptyInv) {
        const eqObj = typeof EQUIPMENT_DATA !== 'undefined' ? EQUIPMENT_DATA.find(w => w.name.toLowerCase().trim() === normW || w.name.toLowerCase().includes(normW)) : null;
        currentInv.push({
          id: 'item_wpn_' + Date.now() + '_' + i,
          name: eqObj ? eqObj.name : wName,
          category: 'Armas',
          qty: 1,
          weight: eqObj && eqObj.weight ? eqObj.weight : 3,
          cost: eqObj && eqObj.cost ? eqObj.cost : '10 PO',
          equipped: true
        });
      }
    });
  }

  // ISSUE-160: Mescla itens do Equipamento Inicial / Mochila do Modal
  if (typeof window !== 'undefined' && Array.isArray(window._modalStartingInventory)) {
    window._modalStartingInventory.forEach((stItem, idx) => {
      if (!stItem || !stItem.name) return;
      const normName = String(stItem.name).toLowerCase().trim();
      const alreadyExists = currentInv.find(it => String(it.name || '').toLowerCase().trim() === normName);
      if (!alreadyExists) {
        currentInv.push({
          id: stItem.id || ('item_st_' + Date.now() + '_' + idx),
          name: stItem.name,
          category: stItem.category || 'Equipamento de Aventura',
          qty: parseInt(stItem.qty, 10) || 1,
          weight: stItem.weight !== undefined ? stItem.weight : 1,
          cost: stItem.cost || '1 PO',
          equipped: !!stItem.equipped
        });
      }
    });
  }

  let currentPrepared = existing && Array.isArray(existing.preparedSpells) ? [...existing.preparedSpells] : [];
  let currentBook = existing && Array.isArray(existing.spellbookSpells) ? [...existing.spellbookSpells] : [...currentPrepared];
  const spellsInputVal = document.getElementById('pm-spells') ? document.getElementById('pm-spells').value.trim() : '';

  if (spellsInputVal) {
    const cleanSpellsText = spellsInputVal
      .replace(/truques\s*:/gi, '')
      .replace(/preparadas\s*:/gi, '')
      .replace(/magias\s*:/gi, '');
    const spellTokens = cleanSpellsText.split(/[\n,;]+/).map(s => s.trim()).filter(s => s.length > 0);
    spellTokens.forEach(token => {
      let matchedName = null;
      if (typeof SPELLS_DATA !== 'undefined') {
        const found = SPELLS_DATA.find(sp => sp.name.toLowerCase() === token.toLowerCase());
        if (found) matchedName = found.name;
      }
      if (matchedName) {
        if (!currentPrepared.some(s => s.toLowerCase() === matchedName.toLowerCase())) {
          currentPrepared.push(matchedName);
        }
        if (!currentBook.some(s => s.toLowerCase() === matchedName.toLowerCase())) {
          currentBook.push(matchedName);
        }
      }
    });
  }

  const data = {
    id: id || 'p_' + Date.now(),
    student, name,
    avatar: avatarVal || '👤',
    race: raceVal,
    className: classNameVal,
    subclassIdx,
    subclass: subclassName,
    fightingStyle,
    level: parseInt(document.getElementById('pm-level').value) || 1,
    xp: parseInt(document.getElementById('pm-xp').value) || 0,
    hitDice: document.getElementById('pm-hitdice').value || '1d10',
    ac: parseInt(document.getElementById('pm-ac').value) || calculatePlayerAcFromEquipment({
      ...(existing || {}),
      dex: parseInt(document.getElementById('pm-dex').value) || 10,
      con: parseInt(document.getElementById('pm-con').value) || 10,
      wis: parseInt(document.getElementById('pm-wis').value) || 10,
      className: classNameVal,
      subclassIdx,
      fightingStyle: (existing && existing.fightingStyle) || fightingStyle,
      inventory: currentInv
    }) || 10,
    hp: existing ? Math.min(maxHp, existing.hp) : maxHp,
    maxHp,
    tempHp: existing ? existing.tempHp : 0,
    speed: document.getElementById('pm-speed').value || '9m',
    gold: parseInt(document.getElementById('pm-gold').value) || 0,
    coins: existing && existing.coins ? { ...existing.coins, gp: parseInt(document.getElementById('pm-gold').value) || 0 } : { cp: 0, sp: 0, ep: 0, gp: parseInt(document.getElementById('pm-gold').value) || 0, pp: 0 },
    inventory: currentInv,

    customSpells: existing && Array.isArray(existing.customSpells) ? existing.customSpells : [],
    customAttacks: existing && Array.isArray(existing.customAttacks) ? existing.customAttacks : [],
    attunedItems: existing && Array.isArray(existing.attunedItems) ? existing.attunedItems : [],
    spentHitDice: existing && typeof existing.spentHitDice === 'number' ? existing.spentHitDice : 0,
    inspiration: existing ? existing.inspiration : false,
    conditions: existing ? (existing.conditions || []) : [],
    deathSaves: existing ? existing.deathSaves : { success: 0, fail: 0 },
    slots,
    slotsUsed: existing && Array.isArray(existing.slotsUsed) ? existing.slotsUsed : [0, 0, 0, 0, 0, 0, 0, 0, 0],
    spellbookSpells: currentBook,
    preparedSpells: currentPrepared,
    skillProficiencies: (() => {
      const baseSkills = existing && Array.isArray(existing.skillProficiencies) ? [...existing.skillProficiencies] : [];
      const pendingBg = (typeof window !== 'undefined' && Array.isArray(window._modalPendingBackgroundSkills)) ? window._modalPendingBackgroundSkills : [];
      const selectedCls = (typeof window !== 'undefined' && Array.isArray(window._modalSelectedClassSkills)) ? window._modalSelectedClassSkills : [];
      [...pendingBg, ...selectedCls].forEach(sk => {
        if (sk && !baseSkills.includes(sk)) baseSkills.push(sk);
      });
      return baseSkills;
    })(),
    skillExpertises: existing && existing.skillExpertises ? existing.skillExpertises : [],
    saveProficiencies: existing && existing.saveProficiencies ? existing.saveProficiencies : defaultSaves,
    featureCharges: existing && existing.featureCharges ? existing.featureCharges : [],
    feats: existing && Array.isArray(existing.feats) ? existing.feats : [],
    actionLogs: existing && existing.actionLogs ? existing.actionLogs : [],
    playerNotes: existing && existing.playerNotes !== undefined ? existing.playerNotes : '',
    background: bgVal,
    personality: persVal,
    ideal: idealVal,
    bond: bondVal,
    flaw: flawVal,
    backstory: storyVal,
    alignment: document.getElementById('pm-alignment')?.value || (existing ? existing.alignment || 'Neutro e Bom' : 'Neutro e Bom'),
    faith: document.getElementById('pm-faith')?.value?.trim() || (existing ? existing.faith || '' : ''),
    lifestyle: document.getElementById('pm-lifestyle')?.value || (existing ? existing.lifestyle || 'Modesto' : 'Modesto'),
    gender: document.getElementById('pm-gender')?.value?.trim() || (existing ? existing.gender || '' : ''),
    age: document.getElementById('pm-age')?.value?.trim() || (existing ? existing.age || '' : ''),
    height: document.getElementById('pm-height')?.value?.trim() || (existing ? existing.height || '' : ''),
    weight: document.getElementById('pm-weight')?.value?.trim() || (existing ? existing.weight || '' : ''),
    eyes: document.getElementById('pm-eyes')?.value?.trim() || (existing ? existing.eyes || '' : ''),
    skin: document.getElementById('pm-skin')?.value?.trim() || (existing ? existing.skin || '' : ''),
    hair: document.getElementById('pm-hair')?.value?.trim() || (existing ? existing.hair || '' : ''),
    baseAttributes: {
      str: parseInt(document.getElementById('pm-base-str')?.value) || (parseInt(document.getElementById('pm-str').value) || 10),
      dex: parseInt(document.getElementById('pm-base-dex')?.value) || (parseInt(document.getElementById('pm-dex').value) || 10),
      con: parseInt(document.getElementById('pm-base-con')?.value) || (parseInt(document.getElementById('pm-con').value) || 10),
      int: parseInt(document.getElementById('pm-base-int')?.value) || (parseInt(document.getElementById('pm-int').value) || 10),
      wis: parseInt(document.getElementById('pm-base-wis')?.value) || (parseInt(document.getElementById('pm-wis').value) || 10),
      cha: parseInt(document.getElementById('pm-base-cha')?.value) || (parseInt(document.getElementById('pm-cha').value) || 10)
    },
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
    present: true,
    updatedAt: Date.now()
  };

  if (id) {
    const idx = PLAYERS.findIndex(x => x.id === id);
    if (idx !== -1) PLAYERS[idx] = data;
    const comb = typeof findCombatantForPlayer === 'function'
      ? findCombatantForPlayer(data, state ? state.combatants : [])
      : (state && state.combatants ? state.combatants.find(c => (c.playerId && c.playerId === id) || c.name.includes(data.name)) : null);
    if (comb) {
      comb.playerId = id;
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
    // ISSUE-122: Vincula automaticamente o novo personagem à campanha ativa
    if (typeof CAMPAIGNS_STATE !== 'undefined' && CAMPAIGNS_STATE.campaigns && CAMPAIGNS_STATE.campaigns.length > 0) {
      const activeCamp = CAMPAIGNS_STATE.campaigns.find(c => c.id === CAMPAIGNS_STATE.activeCampaignId) || CAMPAIGNS_STATE.campaigns[0];
      if (activeCamp) {
        if (!Array.isArray(activeCamp.playerIds)) activeCamp.playerIds = [];
        if (!activeCamp.playerIds.includes(data.id)) {
          activeCamp.playerIds.push(data.id);
          if (typeof touchCampaign === 'function') touchCampaign(activeCamp);
          if (typeof saveCampaignsState === 'function') saveCampaignsState();
          if (typeof renderCampaigns === 'function') renderCampaigns();
        }
      }
    }
  }

  closePlayerModal();
  renderPlayers();
  if (typeof touchPlayer === 'function') touchPlayer(data);
  if (typeof updatePlayerPortalBanner === 'function') updatePlayerPortalBanner();
  saveToLocalStorage();
  if (typeof syncLocalChangesToFirebase === 'function') syncLocalChangesToFirebase(true);
  if (typeof broadcastStateSync === 'function') broadcastStateSync();
  if (typeof saveSafetySnapshot === 'function') {
    saveSafetySnapshot(`Salvou ficha de ${data.name}`);
  }
}

function trackDeletedPlayerId(id) {
  if (!id) return;
  try {
    if (typeof localStorage === 'undefined') return;
    let list = [];
    const raw = localStorage.getItem('dnd5e_deleted_player_ids');
    if (raw) list = JSON.parse(raw);
    if (!Array.isArray(list)) list = [];
    if (!list.includes(id)) {
      list.push(id);
      if (list.length > 100) list = list.slice(-100);
      localStorage.setItem('dnd5e_deleted_player_ids', JSON.stringify(list));
    }
  } catch (e) { }
}

function deletePlayerDirect(id) {
  const p = PLAYERS.find(x => x.id === id);
  if (!p) return;
  if (confirm(`Tem certeza que deseja excluir permanentemente a ficha de:\n"${p.name}" (Aluno: ${p.student})?`)) {
    if (typeof saveSafetySnapshot === 'function') {
      saveSafetySnapshot(`Antes de excluir ficha de ${p.name}`);
    }
    trackDeletedPlayerId(id);
    PLAYERS = PLAYERS.filter(x => x.id !== id);

    if (state && Array.isArray(state.combatants)) {
      const prevCount = state.combatants.length;
      state.combatants = state.combatants.filter(c => (c.playerId ? c.playerId !== id : (c.name !== p.name && c.name !== `${p.name} (${p.student})` && !c.name.startsWith(p.name + ' '))));
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
    if (typeof syncLocalChangesToFirebase === 'function') syncLocalChangesToFirebase(true);
    addLog(`🗑️ Ficha de <b>${p.name}</b> (${p.student}) foi excluída permanentemente.`);
  }
}

// ISSUE-134: Alias canônico para exclusão de fichas chamada pelos botões de toolbar
function deletePlayer(id) {
  return deletePlayerDirect(id);
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
  if (typeof saveSafetySnapshot === 'function') {
    saveSafetySnapshot(`Clonou ficha de ${p.name}`);
  }
  addLog(`📋 Ficha clonada: <b>${clone.name}</b>`);
}

function addAllPlayersToCombat() {
  const targetPlayers = (typeof getCurrentlyFilteredPlayers === 'function' ? getCurrentlyFilteredPlayers() : (typeof PLAYERS !== 'undefined' ? PLAYERS : [])) || [];
  if (targetPlayers.length === 0) {
    alert('Nenhuma ficha de aluno encontrada para entrar no combate!');
    return;
  }
  const selectedCamp = typeof getCurrentlySelectedCampaign === 'function' ? getCurrentlySelectedCampaign() : null;
  const confirmMsg = selectedCamp
    ? `Deseja adicionar todos os ${targetPlayers.length} alunos da mesa "${selectedCamp.name}" ao combate ativo?`
    : `Deseja adicionar todas as ${targetPlayers.length} fichas ao combate ativo?`;

  if (!confirm(confirmMsg)) return;

  let addedCount = 0;
  targetPlayers.forEach(p => {
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
  const logMsg = selectedCamp
    ? `⚔️ <b>${addedCount} alunos da mesa "${selectedCamp.name}"</b> entraram no combate.`
    : `⚔️ <b>${addedCount} alunos</b> entraram no combate.`;
  addLog(logMsg);
  if (typeof renderCombat === 'function') renderCombat();
  if (typeof renderVTT === 'function') renderVTT();
  if (typeof renderPlayerView === 'function') renderPlayerView();
  saveToLocalStorage();
  switchTab('combat');
}

function partyShortRestAll() {
  const targetPlayers = (typeof getCurrentlyFilteredPlayers === 'function' ? getCurrentlyFilteredPlayers() : (typeof PLAYERS !== 'undefined' ? PLAYERS : [])) || [];
  if (targetPlayers.length === 0) {
    alert('Nenhum herói encontrado para descansar.');
    return;
  }
  const selectedCamp = typeof getCurrentlySelectedCampaign === 'function' ? getCurrentlySelectedCampaign() : null;
  const promptMsg = selectedCamp
    ? `Realizar Descanso Curto (1 hora) para os ${targetPlayers.length} aventureiros da mesa "${selectedCamp.name}"?`
    : `Realizar Descanso Curto (1 hora) para todos os ${targetPlayers.length} alunos?`;

  if (!confirm(promptMsg)) return;

  targetPlayers.forEach(p => {
    const conMod = Math.max(0, Math.floor((p.con - 10) / 2));
    const heal = Math.floor(Math.random() * 6) + 1 + conMod;
    p.hp = Math.min(p.maxHp, p.hp + heal);
    const comb = typeof findCombatantForPlayer === 'function'
      ? findCombatantForPlayer(p, state ? state.combatants : [])
      : (state && state.combatants ? state.combatants.find(c => (c.playerId && c.playerId === p.id) || c.name.includes(p.name)) : null);
    if (comb) comb.hp = p.hp;
    const logText = selectedCamp ? `Descanso Curto da Mesa (${selectedCamp.name})` : `Descanso Curto em Grupo`;
    addPlayerActionLog(p.id, '☕', `${logText}: Recuperou ${heal} PV (${p.hp}/${p.maxHp})`, 'rest');
    if (typeof touchPlayer === 'function') touchPlayer(p);
  });
  renderPlayers();
  if (typeof renderCombat === 'function') renderCombat();
  saveToLocalStorage();
  if (typeof syncLocalChangesToFirebase === 'function') syncLocalChangesToFirebase(true);
  if (typeof broadcastStateSync === 'function') broadcastStateSync();
  const logMsg = selectedCamp
    ? `☕ <b>Descanso Curto (Mesa: ${selectedCamp.name})</b>: ${targetPlayers.length} aventureiros descansaram 1h e recuperaram energia.`
    : `☕ <b>Descanso Curto (Grupo)</b>: O grupo descansou 1h e recuperou energia e PV.`;
  addLog(logMsg);
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

function getPlayerAllFeaturesAndTraits(p) {
  if (!p) return [];
  const list = [];
  const addedNames = new Set();

  function addEntry(category, name, desc, clsItem = null, rawFeatureObj = null) {
    if (!name) return;
    const cleanName = String(name).trim();
    const baseKey = typeof normalizeTraitLookupKey === 'function'
      ? normalizeTraitLookupKey(cleanName)
      : cleanName.toLowerCase();
    const fullKey = cleanName.toLowerCase();
    if (!baseKey || addedNames.has(baseKey) || addedNames.has(fullKey)) return;
    addedNames.add(baseKey);
    addedNames.add(fullKey);

    const featInput = rawFeatureObj || { name: cleanName, desc: desc || '' };
    const quick = typeof getPlayerTraitQuickSummary === 'function'
      ? getPlayerTraitQuickSummary(featInput, p, clsItem)
      : { name: cleanName, tag: 'Passivo', usage: '', summary: desc || '' };

    const shortDesc = (quick && quick.summary) ? quick.summary : (desc ? String(desc).trim() : '');
    const displayName = (quick && quick.name) ? quick.name : cleanName;

    list.push({
      category: category || 'Habilidade',
      name: displayName,
      tag: (quick && quick.tag) || 'Passivo',
      usage: (quick && quick.usage) || '',
      shortDesc: shortDesc,
      fullDesc: desc ? String(desc).trim() : shortDesc,
      desc: shortDesc
    });
  }

  // 1. Habilidades Oficiais de Classe por Nível (incluindo Multiclasse)
  const classesList = (typeof getPlayerClassesList === 'function')
    ? getPlayerClassesList(p)
    : [{ className: p.className, level: parseInt(p.level) || 1, subclassIdx: p.subclassIdx || 0 }];

  if (typeof getUnlockedClassFeatures === 'function') {
    classesList.forEach(c => {
      const unlocked = getUnlockedClassFeatures(c.className, c.level, c.subclassIdx || 0);
      unlocked.forEach(f => {
        const fNameNorm = String(f.name || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const isAsi = f.isAsi || fNameNorm.includes('aumento no valor de habilidade') || fNameNorm.includes('aumento no valor de atributo');
        if (isAsi) {
          const asiLvl = f.asiLevel || f.level || 4;
          const asiKey = `${String(c.className || '').toLowerCase()}_lvl_${asiLvl}`;
          const choice = (p.asiChoices && p.asiChoices[asiKey]) || null;
          if (!choice) return; // Omite marcos genéricos de ASI sem escolha específica para não poluir a ficha
        }
        let detail = f.desc || f.description || '';
        if (f.name && f.name.toLowerCase().includes('estilo de luta') && p.fightingStyle) {
          const st = (typeof FIGHTING_STYLES !== 'undefined') ? FIGHTING_STYLES[p.fightingStyle] : null;
          if (st) detail = `Especialidade: ${st.name}. ${st.desc}`;
        }
        addEntry(`Classe (${c.className} Nv ${f.level || c.level})`, f.name, detail, c, f);
      });
    });
  }

  // 2. Traços Raciais da Espécie (D&D 5E)
  if (p.race && typeof findSpeciesData === 'function') {
    const sp = findSpeciesData(p.race);
    if (sp && Array.isArray(sp.traits)) {
      sp.traits.forEach(t => {
        const tLow = (t.name || '').toLowerCase();
        if (tLow.includes('aumento no valor') || tLow === 'idiomas' || tLow.startsWith('idiomas ')) return;
        addEntry(`Raça (${sp.name})`, t.name, t.description || t.desc || '', null, { name: t.name, desc: t.description || t.desc || '', type: t.type });
      });
    }
  }

  // 3. Talentos Oficiais / Escolhas de ASI
  if (Array.isArray(p.feats) && p.feats.length > 0) {
    p.feats.forEach(feat => {
      const fName = typeof feat === 'string' ? feat : (feat.name || 'Talento');
      const fDesc = typeof feat === 'object' ? (feat.desc || feat.description || '') : '';
      addEntry('Talento', fName, fDesc);
    });
  }

  // 4. Características Customizadas ou Anotações do Jogador (p.features)
  if (typeof p.features === 'string' && p.features.trim()) {
    const lines = p.features.split('\n').map(l => l.trim()).filter(Boolean);
    lines.forEach(l => {
      const cleanLine = l.replace(/^[•\-\*✦]\s*/, '');
      if (!cleanLine.includes(':') && cleanLine.includes(',')) {
        cleanLine.split(',').map(s => s.trim()).filter(Boolean).forEach(subName => {
          addEntry('Personalizado', subName, '');
        });
      } else {
        const parts = cleanLine.split(/:(.+)/);
        const name = parts[0] ? parts[0].trim() : cleanLine;
        const desc = parts[1] ? parts[1].trim() : '';
        addEntry('Personalizado', name, desc);
      }
    });
  } else if (Array.isArray(p.features) && p.features.length > 0) {
    p.features.forEach(f => {
      const name = typeof f === 'string' ? f : (f.name || '');
      const desc = typeof f === 'object' ? (f.desc || '') : '';
      addEntry('Personalizado', name, desc);
    });
  }

  return list;
}

let currentPrintPlayerId = null;

function printPlayerSheet(id) {
  const p = PLAYERS.find(x => x.id === id);
  if (!p) return;
  currentPrintPlayerId = id;
  if (typeof window !== 'undefined') {
    window.currentPrintPlayerId = id;
  }

  const prof = getProfBonus(p.level);

  // Atributos e Modificadores
  const strVal = parseInt(p.str) || 10;
  const dexVal = parseInt(p.dex) || 10;
  const conVal = parseInt(p.con) || 10;
  const intVal = parseInt(p.int) || 10;
  const wisVal = parseInt(p.wis) || 10;
  const chaVal = parseInt(p.cha) || 10;

  const strMod = Math.floor((strVal - 10) / 2);
  const dexMod = Math.floor((dexVal - 10) / 2);
  const conMod = Math.floor((conVal - 10) / 2);
  const intMod = Math.floor((intVal - 10) / 2);
  const wisMod = Math.floor((wisVal - 10) / 2);
  const chaMod = Math.floor((chaVal - 10) / 2);

  const attrMap = {
    str: { name: 'FOR', label: 'Força', val: strVal, mod: strMod },
    dex: { name: 'DES', label: 'Destreza', val: dexVal, mod: dexMod },
    con: { name: 'CON', label: 'Constituição', val: conVal, mod: conMod },
    int: { name: 'INT', label: 'Inteligência', val: intVal, mod: intMod },
    wis: { name: 'SAB', label: 'Sabedoria', val: wisVal, mod: wisMod },
    cha: { name: 'CAR', label: 'Carisma', val: chaVal, mod: chaMod }
  };

  const fmtMod = m => (m >= 0 ? `+${m}` : `${m}`);

  // Testes de Resistência (Saving Throws)
  const saveProfs = Array.isArray(p.saveProficiencies) ? p.saveProficiencies : [];
  const savesHtml = ['str', 'dex', 'con', 'int', 'wis', 'cha'].map(key => {
    const info = attrMap[key];
    const isProf = saveProfs.includes(key);
    const bonus = info.mod + (isProf ? prof : 0);
    return `
      <div class="a4-save-item">
        <span class="a4-bullet ${isProf ? 'active' : ''}">${isProf ? '●' : '○'}</span>
        <span class="a4-mod-badge">${fmtMod(bonus)}</span>
        <span class="a4-save-label">${info.label} (${info.name})</span>
      </div>
    `;
  }).join('');

  // Perícias (Skills D&D 5E)
  const skillProfs = Array.isArray(p.skillProficiencies) ? p.skillProficiencies : [];
  const skillsList = (typeof DND5E_SKILLS !== 'undefined' && Array.isArray(DND5E_SKILLS)) ? DND5E_SKILLS : [
    { key: 'atletismo', name: 'Atletismo', attr: 'str', label: 'FOR' },
    { key: 'acrobacia', name: 'Acrobacia', attr: 'dex', label: 'DES' },
    { key: 'furtividade', name: 'Furtividade', attr: 'dex', label: 'DES' },
    { key: 'prestidigitacao', name: 'Prestidigitação', attr: 'dex', label: 'DES' },
    { key: 'arcanismo', name: 'Arcanismo', attr: 'int', label: 'INT' },
    { key: 'historia', name: 'História', attr: 'int', label: 'INT' },
    { key: 'investigacao', name: 'Investigação', attr: 'int', label: 'INT' },
    { key: 'natureza', name: 'Natureza', attr: 'int', label: 'INT' },
    { key: 'religiao', name: 'Religião', attr: 'int', label: 'INT' },
    { key: 'adestramento', name: 'Adestrar Animais', attr: 'wis', label: 'SAB' },
    { key: 'intuicao', name: 'Intuição', attr: 'wis', label: 'SAB' },
    { key: 'medicina', name: 'Medicina', attr: 'wis', label: 'SAB' },
    { key: 'percepcao', name: 'Percepção', attr: 'wis', label: 'SAB' },
    { key: 'sobrevivencia', name: 'Sobrevivência', attr: 'wis', label: 'SAB' },
    { key: 'atuacao', name: 'Atuação', attr: 'cha', label: 'CAR' },
    { key: 'enganacao', name: 'Enganação', attr: 'cha', label: 'CAR' },
    { key: 'intimidacao', name: 'Intimidação', attr: 'cha', label: 'CAR' },
    { key: 'persuasao', name: 'Persuasão', attr: 'cha', label: 'CAR' }
  ];

  const skillsHtml = skillsList.map(sk => {
    const isProf = skillProfs.includes(sk.key);
    const attrInfo = attrMap[sk.attr] || { mod: 0 };
    const bonus = attrInfo.mod + (isProf ? prof : 0);
    return `
      <div class="a4-skill-row">
        <span class="a4-bullet ${isProf ? 'active' : ''}">${isProf ? '●' : '○'}</span>
        <span class="a4-skill-mod">${fmtMod(bonus)}</span>
        <span class="a4-skill-name">${sk.name} <span class="a4-skill-attr">(${sk.label})</span></span>
      </div>
    `;
  }).join('');

  // Sentidos Passivos do D&D 5E (Percepção, Investigação e Intuição)
  const isPercepProf = skillProfs.includes('percepcao') || skillProfs.includes('perception');
  const passPerc = 10 + wisMod + (isPercepProf ? prof : 0);

  const isInvestProf = skillProfs.includes('investigacao') || skillProfs.includes('investigation');
  const passInvest = 10 + intMod + (isInvestProf ? prof : 0);

  const isInsightProf = skillProfs.includes('intuicao') || skillProfs.includes('insight');
  const passInsight = 10 + wisMod + (isInsightProf ? prof : 0);

  // Formatação consistente de Multiclasse
  const formattedClassLevel = (p.multiclass && typeof p.multiclass === 'string' && p.multiclass.trim())
    ? `${p.multiclass} (Nv ${p.level || 1})`
    : `${p.className || 'Aventureiro'} ${p.level || 1}`;

  // Salvaguardas contra a morte ativas
  const curDeathSuccess = Number(p.deathSaves?.success || (p.death_saves?.success)) || 0;
  const curDeathFail = Number(p.deathSaves?.fail || (p.death_saves?.fail)) || 0;
  const deathSuccCircles = [1, 2, 3].map(i => i <= curDeathSuccess ? '●' : '○').join(' ');
  const deathFailCircles = [1, 2, 3].map(i => i <= curDeathFail ? '●' : '○').join(' ');

  // Dados de vida restantes vs totais
  const spentHd = Number(p.spentHitDice) || 0;
  const totalHdCount = p.level || 1;
  const remHdCount = Math.max(0, totalHdCount - spentHd);

  // Inventário e Peso
  const inventory = Array.isArray(p.inventory) ? p.inventory : [];
  let totalWeight = 0;
  inventory.forEach(it => {
    const w = parseFloat(String(it.weight || '0').replace(',', '.')) || 0;
    const q = parseInt(it.qty) || 1;
    totalWeight += (w * q);
  });
  const carryLimit = strVal * 7.5;
  const pushLimit = strVal * 15;
  const coins = p.coins || { cp: 0, sp: 0, ep: 0, gp: p.gold || 0, pp: 0 };

  // Conjuração e Magias
  const cName = (p.className || '').toLowerCase();
  let spellAttrKey = 'int';
  let spellAttrLabel = 'INT';
  if (cName.includes('clérigo') || cName.includes('clerigo') || cName.includes('druida') || cName.includes('patrulheiro') || cName.includes('ranger') || cName.includes('monge')) {
    spellAttrKey = 'wis';
    spellAttrLabel = 'SAB';
  } else if (cName.includes('bardo') || cName.includes('bruxo') || cName.includes('warlock') || cName.includes('feiticeiro') || cName.includes('sorcerer') || cName.includes('paladino')) {
    spellAttrKey = 'cha';
    spellAttrLabel = 'CAR';
  }
  const spellMod = attrMap[spellAttrKey].mod;
  const spellSaveDc = 8 + prof + spellMod;
  const spellAtkBonus = fmtMod(prof + spellMod);

  // Espaços de Magia
  const slots = Array.isArray(p.slots) ? p.slots : [0, 0, 0, 0, 0, 0, 0, 0, 0];
  const slotsUsed = Array.isArray(p.slotsUsed) ? p.slotsUsed : [0, 0, 0, 0, 0, 0, 0, 0, 0];
  const hasSpells = slots.some(s => s > 0) || (Array.isArray(p.preparedSpells) && p.preparedSpells.length > 0) || !!p.spells;

  // Ataques & Armas
  const calcedAttacksList = (typeof getPlayerCalculatedAttacks === 'function') ? getPlayerCalculatedAttacks(p) : [];
  const attacksText = calcedAttacksList.length > 0
    ? calcedAttacksList.map(a => `<b>${a.name}</b> ${a.toHit && a.toHit !== '—' ? '(' + a.toHit + ')' : ''} — <span style="color:#d97706;">${a.damage}</span> ${a.damageType || ''}${a.notes ? ` <i>(${a.notes})</i>` : ''}`).join('<br>')
    : (typeof p.attacks === 'string'
      ? p.attacks.replace(/\n/g, '<br>')
      : (Array.isArray(p.attacks) ? p.attacks.map(a => typeof a === 'string' ? a : (a.name || '')).filter(Boolean).join('<br>') : 'Nenhum ataque registrado.'));

  const container = document.getElementById('print-sheet-content');
  if (!container) return;

  container.innerHTML = `
    <!-- ========================================== -->
    <!-- PÁGINA 1: COMBATE, ATRIBUTOS E HABILIDADES -->
    <!-- ========================================== -->
    <div class="a4-print-page a4-page-1" data-player-id="${p.id}">
      <!-- CABEÇALHO D&D OFICIAL -->
      <div class="a4-sheet-header">
        <div class="a4-sheet-title-box">
          <div class="a4-char-name">${p.name || 'Herói Sem Nome'}</div>
          <div class="a4-char-tag">FICHA DE PERSONAGEM • D&D 5E</div>
        </div>
        <div class="a4-sheet-meta-grid">
          <div class="a4-meta-cell">
            <span class="a4-meta-label">Classe & Nível</span>
            <span class="a4-meta-val">${formattedClassLevel}</span>
          </div>
          <div class="a4-meta-cell">
            <span class="a4-meta-label">Antecedente</span>
            <span class="a4-meta-val">${p.background || 'Aventureiro'}</span>
          </div>
          <div class="a4-meta-cell">
            <span class="a4-meta-label">Nome do Aluno / Jogador</span>
            <span class="a4-meta-val">${p.student || '-'}</span>
          </div>
          <div class="a4-meta-cell">
            <span class="a4-meta-label">Raça</span>
            <span class="a4-meta-val">${p.race || 'Humano'}</span>
          </div>
          <div class="a4-meta-cell">
            <span class="a4-meta-label">Tendência / Alinhamento</span>
            <span class="a4-meta-val">${p.alignment || 'Neutro e Bom'}</span>
          </div>
          <div class="a4-meta-cell">
            <span class="a4-meta-label">Experiência (XP)</span>
            <span class="a4-meta-val">${p.xp || 0} XP</span>
          </div>
        </div>
      </div>

      <!-- CORPO PRINCIPAL: 3 COLUNAS HARMONIZADAS -->
      <div class="a4-page1-columns">
        <!-- COLUNA 1: ATRIBUTOS, SALVAGUARDAS E PERÍCIAS -->
        <div class="a4-col-left">
          <div class="a4-stats-and-skills">
            <!-- 6 ATRIBUTOS -->
            <div class="a4-stats-stack">
              ${['str', 'dex', 'con', 'int', 'wis', 'cha'].map(k => `
                <div class="a4-stat-card">
                  <div class="a4-stat-name">${attrMap[k].name}</div>
                  <div class="a4-stat-mod">${fmtMod(attrMap[k].mod)}</div>
                  <div class="a4-stat-score">${attrMap[k].val}</div>
                </div>
              `).join('')}
            </div>

            <!-- INSPIRAÇÃO, PROFICIÊNCIA, SAVES E SKILLS -->
            <div class="a4-skills-stack">
              <div class="a4-badge-box">
                <span class="a4-badge-box-icon">${p.inspiration ? '⭐' : '○'}</span>
                <div>
                  <div class="a4-badge-box-title">Inspiração</div>
                  <div class="a4-badge-box-sub">${p.inspiration ? 'Ativa' : 'Não'}</div>
                </div>
              </div>

              <div class="a4-badge-box">
                <span class="a4-badge-box-mod">+${prof}</span>
                <div>
                  <div class="a4-badge-box-title">Bônus de Proficiência</div>
                  <div class="a4-badge-box-sub">Nível ${p.level}</div>
                </div>
              </div>

              <!-- TESTES DE RESISTÊNCIA -->
              <div class="a4-bordered-box">
                <div class="a4-box-title">Testes de Resistência</div>
                <div class="a4-saves-list">${savesHtml}</div>
              </div>

              <!-- PERÍCIAS (D&D 5E) -->
              <div class="a4-bordered-box">
                <div class="a4-box-title">Perícias (Skills)</div>
                <div class="a4-skills-list">${skillsHtml}</div>
              </div>

              <!-- SENTIDOS PASSIVOS DO MESTRE (PERCEPÇÃO, INVESTIGAÇÃO E INTUIÇÃO) -->
              <div class="a4-bordered-box" style="margin-top: 2px;">
                <div class="a4-box-title">Sentidos Passivos (Mestre)</div>
                <div class="a4-passive-grid">
                  <div class="a4-passive-item">
                    <span class="a4-passive-val">${passPerc}</span>
                    <span class="a4-passive-info"><b>Percepção</b> (10 + Sab${isPercepProf ? ' + Prof' : ''})</span>
                  </div>
                  <div class="a4-passive-item">
                    <span class="a4-passive-val">${passInvest}</span>
                    <span class="a4-passive-info"><b>Investigação</b> (10 + Int${isInvestProf ? ' + Prof' : ''})</span>
                  </div>
                  <div class="a4-passive-item">
                    <span class="a4-passive-val">${passInsight}</span>
                    <span class="a4-passive-info"><b>Intuição</b> (10 + Sab${isInsightProf ? ' + Prof' : ''})</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- OUTRAS PROFICIÊNCIAS E IDIOMAS -->
          <div class="a4-bordered-box" style="margin-top: 6px;">
            <div class="a4-box-title">Outras Proficiências & Idiomas</div>
            <div class="a4-box-content-sm">
              <div><b>Idiomas:</b> ${typeof getPlayerLanguagesString === 'function' ? getPlayerLanguagesString(p) : (p.languages || 'Comum')}</div>
              <div><b>Armaduras:</b> ${p.armorProficiencies || 'Todas / Padrão da Classe'}</div>
              <div><b>Armas:</b> ${p.weaponProficiencies || 'Simples e Marciais'}</div>
              ${p.tools ? `<div><b>Ferramentas:</b> ${p.tools}</div>` : ''}
            </div>
          </div>
        </div>

        <!-- COLUNA 2: COMBATE, VIDA, ATAQUES E SLOTS -->
        <div class="a4-col-center">
          <!-- CA, INICIATIVA E DESLOCAMENTO -->
          <div class="a4-combat-top-grid">
            <div class="a4-combat-pill a4-combat-ac">
              <span class="a4-combat-label">Classe Armadura</span>
              <span class="a4-combat-val">${p.ac || 10}</span>
              <span class="a4-combat-sub">CA 🛡️</span>
            </div>
            <div class="a4-combat-pill a4-combat-init">
              <span class="a4-combat-label">Iniciativa</span>
              <span class="a4-combat-val">${fmtMod(dexMod)}</span>
              <span class="a4-combat-sub">DES ⚡</span>
            </div>
            <div class="a4-combat-pill a4-combat-speed">
              <span class="a4-combat-label">Deslocamento</span>
              <span class="a4-combat-val">${p.speed || '9m'}</span>
              <span class="a4-combat-sub">Velocidade 👟</span>
            </div>
          </div>

          <!-- PONTOS DE VIDA -->
          <div class="a4-hp-box">
            <div class="a4-hp-top-bar">
              <span><b>Pontos de Vida (PV) Máximos:</b> ${p.maxHp}</span>
              <span><b>Atual:</b> ${p.hp}</span>
            </div>
            <div class="a4-hp-tracking-area">
              <div class="a4-hp-slot">
                <span class="a4-hp-slot-title">PV Atual em Mesa</span>
                <span class="a4-hp-slot-num">${p.hp}</span>
              </div>
              <div class="a4-hp-slot">
                <span class="a4-hp-slot-title">PV Temporários</span>
                <span class="a4-hp-slot-num">${p.tempHp || '—'}</span>
              </div>
            </div>
          </div>
          ${Array.isArray(p.conditions) && p.conditions.length > 0 ? `
            <div class="a4-active-conditions-banner">
              ⚠️ <b>Condições Ativas:</b> ${p.conditions.join(', ')}
            </div>
          ` : ''}

          <!-- DADOS DE VIDA & DEATH SAVES -->
          <div class="a4-dice-death-grid">
            <div class="a4-bordered-box">
              <div class="a4-box-title">Dados de Vida</div>
              <div style="text-align: center; padding: 4px 0;">
                <div style="font-size: 13pt; font-weight: 800;">${p.hitDice || `${p.level}d8`}</div>
                <div style="font-size: 7pt; color: #555;">Total: ${totalHdCount} | Restantes: <b>${remHdCount}</b></div>
              </div>
            </div>

            <div class="a4-bordered-box">
              <div class="a4-box-title">Salvaguardas Contra a Morte</div>
              <div class="a4-death-saves-row">
                <span class="a4-death-label">Sucessos:</span>
                <span class="a4-death-circles" style="letter-spacing: 2px; font-weight: bold;">${deathSuccCircles}</span>
              </div>
              <div class="a4-death-saves-row">
                <span class="a4-death-label">Falhas:</span>
                <span class="a4-death-circles" style="letter-spacing: 2px; font-weight: bold; color: #b91c1c;">${deathFailCircles}</span>
              </div>
            </div>
          </div>

          <!-- ATAQUES & CONJURAÇÃO -->
          <div class="a4-bordered-box a4-attacks-section">
            <div class="a4-box-title">Ataques & Armas / Conjuração</div>
            <div class="a4-attacks-table-wrap">
              <table class="a4-attacks-table">
                <thead>
                  <tr>
                    <th>Nome / Arma</th>
                    <th style="width: 50px; text-align: center;">Ataque</th>
                    <th>Dano & Tipo</th>
                  </tr>
                </thead>
                <tbody>
                  ${inventory.filter(it => it.equipped && (it.name.toLowerCase().includes('espada') || it.name.toLowerCase().includes('arco') || it.name.toLowerCase().includes('machado') || it.name.toLowerCase().includes('adaga') || it.name.toLowerCase().includes('martelo') || it.name.toLowerCase().includes('lança') || it.name.toLowerCase().includes('cajado'))).slice(0, 3).map(it => `
                    <tr>
                      <td><b>${it.name}</b></td>
                      <td style="text-align: center;">${fmtMod(prof + (it.name.toLowerCase().includes('arco') || it.name.toLowerCase().includes('adaga') ? dexMod : strMod))}</td>
                      <td>${it.desc ? it.desc.split('.')[0] : '1d8 cortante'}</td>
                    </tr>
                  `).join('') || `
                    <tr>
                      <td colspan="3" style="text-align: center; color: #666; font-size: 7.5pt; padding: 4px;">Utilize os ataques listados abaixo:</td>
                    </tr>
                  `}
                </tbody>
              </table>
            </div>
            <div class="a4-attacks-notes">
              ${attacksText}
            </div>
          </div>

          <!-- ESPAÇOS DE MAGIA (SLOTS) -->
          ${hasSpells ? `
            <div class="a4-bordered-box" style="margin-top: 6px;">
              <div class="a4-box-title">Espaços de Magia (Spell Slots)</div>
              <div class="a4-spell-slots-grid">
                ${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(lvl => {
    const maxSlot = slots[lvl - 1] || 0;
    const usedSlot = slotsUsed[lvl - 1] || 0;
    const remSlot = Math.max(0, maxSlot - usedSlot);
    if (maxSlot === 0 && lvl > 3) return '';
    let slotCircles = '';
    for (let sc = 0; sc < maxSlot; sc++) {
      slotCircles += (sc < remSlot ? '○ ' : '● ');
    }
    return `
                    <div class="a4-slot-pill ${maxSlot > 0 ? 'active' : ''}">
                      <div class="a4-slot-lvl">Nv ${lvl}</div>
                      <div class="a4-slot-dots">
                        ${maxSlot > 0 ? `<span class="a4-slot-circles">${slotCircles.trim()}</span> <small>(${remSlot}/${maxSlot})</small>` : '—'}
                      </div>
                    </div>
                  `;
  }).join('')}
              </div>
            </div>
          ` : ''}
        </div>

        <!-- COLUNA 3: TRAÇOS, CARACTERÍSTICAS E TALENTOS -->
        <div class="a4-col-right">
          <div class="a4-bordered-box a4-features-box">
            <div class="a4-box-title">Características de Classe & Talentos</div>
            <div class="a4-features-content">
              ${(() => {
      const allFeats = getPlayerAllFeaturesAndTraits(p);
      if (allFeats.length === 0) {
        return '<div style="color: #666; font-size: 7.5pt; font-style: italic;">Nenhuma característica especial registrada.</div>';
      }
      return allFeats.map(feat => `
                  <div class="a4-feature-item">
                    <div class="a4-feature-item-header">
                      <span class="a4-feature-bullet">✦</span>
                      <b class="a4-feature-name">${feat.name}</b>
                      ${feat.tag ? `<span class="a4-feature-tag">${feat.tag}</span>` : ''}
                      ${feat.usage ? `<span class="a4-feature-usage">${feat.usage}</span>` : ''}
                      ${feat.category ? `<span class="a4-feature-category">${feat.category}</span>` : ''}
                    </div>
                    ${feat.desc ? `<div class="a4-feature-desc">${feat.desc.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')}</div>` : ''}
                  </div>
                `).join('');
    })()}
            </div>
          </div>
        </div>
      </div>

      <!-- RODAPÉ DA PÁGINA 1 -->
      <div class="a4-page-footer">
        <span><b>${p.name}</b> • Aluno: ${p.student || '-'} • D&D 5E</span>
        <span class="a4-page-number">Página 1 de 2</span>
        <span>Clube de RPG Prisco Bezerra</span>
      </div>
    </div>

    <!-- ======================================================= -->
    <!-- PÁGINA 2: INTERPRETAÇÃO, INVENTÁRIO, GRIMÓRIO E NOTAS  -->
    <!-- ======================================================= -->
    <div class="a4-print-page a4-page-2" data-player-id="${p.id}">
      <!-- CABEÇALHO RESUMIDO DA PÁGINA 2 -->
      <div class="a4-sheet-header a4-header-p2">
        <div class="a4-sheet-title-box">
          <div class="a4-char-name" style="font-size: 15pt;">${p.name || 'Herói Sem Nome'}</div>
          <div class="a4-char-tag">INVENTÁRIO, ANTECEDENTES & GRIMÓRIO DETALHADO</div>
        </div>
        <div class="a4-header-p2-meta">
          <span><b>Classe:</b> ${formattedClassLevel}</span>
          <span><b>Aluno:</b> ${p.student || '-'}</span>
          <span><b>Data:</b> ${new Date().toLocaleDateString('pt-BR')}</span>
        </div>
      </div>

      <!-- CORPO PRINCIPAL PÁGINA 2: 3 COLUNAS -->
      <div class="a4-page2-columns">
        <!-- COLUNA 1: PERSONALIDADE, VÍNCULOS E HISTÓRIA -->
        <div class="a4-col-p2-left">
          <div class="a4-bordered-box">
            <div class="a4-box-title">Traços de Personalidade</div>
            <div class="a4-rp-text">${p.personality || 'Determinado, focado em ajudar seus companheiros de jornada.'}</div>
          </div>

          <div class="a4-bordered-box" style="margin-top: 6px;">
            <div class="a4-box-title">Ideais</div>
            <div class="a4-rp-text">${p.ideal || 'Honra, justiça e busca pelo conhecimento ancestral.'}</div>
          </div>

          <div class="a4-bordered-box" style="margin-top: 6px;">
            <div class="a4-box-title">Vínculos</div>
            <div class="a4-rp-text">${p.bond || 'Lealdade incondicional aos companheiros de guilda.'}</div>
          </div>

          <div class="a4-bordered-box" style="margin-top: 6px;">
            <div class="a4-box-title">Defeitos</div>
            <div class="a4-rp-text">${p.flaw || 'Dificuldade em recuar perante uma injustiça ou desafio.'}</div>
          </div>

          <!-- HISTÓRIA E CONQUISTAS ESCOLARES -->
          <div class="a4-bordered-box" style="margin-top: 6px; flex: 1;">
            <div class="a4-box-title">Conquistas & Medalhas Escolares</div>
            <div class="a4-box-content-sm">
              ${(Array.isArray(p.badges) && p.badges.length > 0) ? p.badges.map(b => `<div class="a4-badge-tag">${b}</div>`).join('') : '<div style="color: #666;">Nenhuma medalha registrada ainda.</div>'}
            </div>
          </div>
        </div>

        <!-- COLUNA 2: TESOURO, MOEDAS E EQUIPAMENTOS -->
        <div class="a4-col-p2-center">
          <!-- TESOURO / MOEDAS D&D -->
          <div class="a4-bordered-box">
            <div class="a4-box-title">Riquezas & Moedas</div>
            <div class="a4-coins-grid">
              <div class="a4-coin-cell a4-coin-cp"><b>PC:</b> ${coins.cp || 0}</div>
              <div class="a4-coin-cell a4-coin-sp"><b>PP:</b> ${coins.sp || 0}</div>
              <div class="a4-coin-cell a4-coin-ep"><b>PE:</b> ${coins.ep || 0}</div>
              <div class="a4-coin-cell a4-coin-gp"><b>PO:</b> ${coins.gp || p.gold || 0}</div>
              <div class="a4-coin-cell a4-coin-pp"><b>PL:</b> ${coins.pp || 0}</div>
            </div>
          </div>

          <!-- TABELA DE INVENTÁRIO -->
          <div class="a4-bordered-box a4-inventory-box">
            <div class="a4-box-title">Inventário & Equipamentos Carregados</div>
            <div class="a4-inv-table-wrap">
              <table class="a4-inv-table">
                <thead>
                  <tr>
                    <th style="width: 25px;">Qtd</th>
                    <th>Item</th>
                    <th style="width: 45px; text-align: right;">Peso</th>
                    <th style="width: 60px; text-align: center;">Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${inventory.length > 0 ? inventory.map(it => {
      const cleanW = String(it.weight || '').replace(/\s*kg/gi, '').trim();
      return `
                      <tr>
                        <td style="text-align: center; font-weight: bold;">${it.qty || 1}x</td>
                        <td><b>${it.name}</b></td>
                        <td style="text-align: right;">${cleanW ? cleanW + ' kg' : '—'}</td>
                        <td style="text-align: center; font-size: 7pt;">${it.equipped ? '🛡️ Equipado' : 'Mochila'}</td>
                      </tr>
                    `;
    }).join('') : `
                    <tr>
                      <td colspan="4" style="text-align: center; color: #666; padding: 10px;">Mochila vazia.</td>
                    </tr>
                  `}
                </tbody>
              </table>
            </div>

            <div class="a4-carry-capacity-bar">
              <span><b>Carga Atual:</b> ${totalWeight.toFixed(1)} kg</span>
              <span><b>Capacidade:</b> ${carryLimit} kg</span>
              <span><b>Empurrar:</b> ${pushLimit} kg</span>
            </div>
          </div>
        </div>

        <!-- COLUNA 3: GRIMÓRIO, CONJURAÇÃO E DIÁRIO DE AVENTURA -->
        <div class="a4-col-p2-right">
          <!-- PAINEL DE CONJURAÇÃO -->
          <div class="a4-bordered-box">
            <div class="a4-box-title">Conjuração de Magias D&D 5E</div>
            <div class="a4-spell-meta-grid">
              <div class="a4-spell-meta-cell">
                <span class="a4-spell-meta-lbl">Habilidade Chave</span>
                <span class="a4-spell-meta-val">${spellAttrLabel}</span>
              </div>
              <div class="a4-spell-meta-cell">
                <span class="a4-spell-meta-lbl">CD Resistência</span>
                <span class="a4-spell-meta-val">${spellSaveDc}</span>
              </div>
              <div class="a4-spell-meta-cell">
                <span class="a4-spell-meta-lbl">Bônus de Ataque</span>
                <span class="a4-spell-meta-val">${spellAtkBonus}</span>
              </div>
            </div>
          </div>

          <!-- GRIMÓRIO / MAGIAS PREPARADAS -->
          <div class="a4-bordered-box" style="margin-top: 6px; flex: 1;">
            <div class="a4-box-title">Grimório & Magias Conhecidas</div>
            <div class="a4-spellbook-list">
              ${(() => {
      const spellsArr = (Array.isArray(p.preparedSpells) && p.preparedSpells.length > 0)
        ? p.preparedSpells
        : (Array.isArray(p.spells) && p.spells.length > 0 ? p.spells : []);

      if (spellsArr.length > 0) {
        return spellsArr.map(s => {
          const sName = typeof s === 'string' ? s : (s.name || 'Magia');
          const sLvl = typeof s === 'object' && s.level !== undefined ? (s.level === 0 ? 'Truque' : `Nv ${s.level}`) : '';
          return `
                      <div class="a4-spell-entry">
                        <span class="a4-spell-entry-bullet">✦</span>
                        <span class="a4-spell-entry-name">${sName}</span>
                        ${sLvl ? `<span class="a4-spell-entry-lvl">${sLvl}</span>` : ''}
                      </div>
                    `;
        }).join('');
      }
      if (typeof p.spells === 'string' && p.spells.trim()) {
        return `<div style="font-size: 8pt; line-height: 1.4;">${p.spells.replace(/\n/g, '<br>')}</div>`;
      }
      return '<div style="color: #666; font-size: 7.5pt;">Nenhuma magia preparada.</div>';
    })()}
            </div>
          </div>

          <!-- DIÁRIO / NOTAS DO JOGADOR -->
          <div class="a4-bordered-box" style="margin-top: 6px;">
            <div class="a4-box-title">Diário de Missões & Anotações</div>
            <div class="a4-notes-lines">
              ${typeof p.playerNotes === 'string' && p.playerNotes.trim()
      ? p.playerNotes.replace(/\n/g, '<br>')
      : (Array.isArray(p.playerNotes) && p.playerNotes.length > 0
        ? p.playerNotes.join('<br>')
        : `
                        <div class="a4-ruled-line"></div>
                        <div class="a4-ruled-line"></div>
                        <div class="a4-ruled-line"></div>
                        <div class="a4-ruled-line"></div>
                      `)}
            </div>
          </div>
        </div>
      </div>

      <!-- RODAPÉ DA PÁGINA 2 -->
      <div class="a4-page-footer">
        <span><b>${p.name}</b> • Aluno: ${p.student || '-'} • D&D 5E</span>
        <span class="a4-page-number">Página 2 de 2</span>
        <span>Clube de RPG Prisco Bezerra</span>
      </div>
    </div>
  `;

  const mPrint = document.getElementById('modal-print');
  if (mPrint) mPrint.classList.add('open');
}

function closePrintModal() {
  const mPrint = document.getElementById('modal-print');
  if (mPrint) mPrint.classList.remove('open');
}

function printCurrentModalPlayerSheet() {
  const curId = document.getElementById('pm-id') ? document.getElementById('pm-id').value : null;
  if (curId) {
    printPlayerSheet(curId);
  }
}

function triggerPlayerBrowserPrint() {
  window.print();
}

function exportSinglePlayerJson(id) {
  const p = PLAYERS.find(x => x.id === id);
  if (!p) {
    if (typeof alert === 'function') alert('Personagem não encontrado para exportação.');
    return;
  }
  try {
    const jsonStr = JSON.stringify(p, null, 2);
    let url = '';
    if (typeof Blob !== 'undefined' && typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function') {
      const blob = new Blob([jsonStr], { type: 'application/json' });
      url = URL.createObjectURL(blob);
    } else {
      url = 'data:application/json;charset=utf-8,' + encodeURIComponent(jsonStr);
    }
    const safeName = (p.name || 'personagem').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '_');
    const filename = `ficha_${safeName}_dnd5e.json`;
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    if (document.body && typeof document.body.appendChild === 'function') {
      document.body.appendChild(a);
    }
    a.click();
    if (document.body && typeof document.body.removeChild === 'function') {
      document.body.removeChild(a);
    }
    if (typeof URL !== 'undefined' && typeof URL.revokeObjectURL === 'function' && url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
    if (typeof playFX === 'function') playFX('heal');
    if (typeof addLog === 'function') {
      addLog(`📥 Ficha de <b>${p.name}</b> exportada com sucesso como [${filename}]!`);
    }
  } catch (e) {
    console.error('Erro ao exportar ficha individual:', e);
    if (typeof alert === 'function') alert('Erro ao exportar ficha: ' + e.message);
  }
}

function exportCurrentModalPlayerJson() {
  let curId = (typeof currentPrintPlayerId !== 'undefined' && currentPrintPlayerId)
    || (typeof window !== 'undefined' && window.currentPrintPlayerId)
    || (typeof activePortalPlayerId !== 'undefined' && activePortalPlayerId)
    || (typeof window !== 'undefined' && window.activePortalPlayerId)
    || (typeof document !== 'undefined' && document.getElementById('pm-id') ? document.getElementById('pm-id').value : null);

  if (!curId && typeof document !== 'undefined') {
    const el = document.querySelector('#print-sheet-content [data-player-id]');
    if (el) curId = el.getAttribute('data-player-id');
  }

  if (!curId && typeof PLAYERS !== 'undefined' && Array.isArray(PLAYERS) && PLAYERS.length === 1) {
    curId = PLAYERS[0].id;
  }

  if (curId) {
    exportSinglePlayerJson(curId);
  } else {
    if (typeof alert === 'function') alert('Não foi possível identificar o personagem para exportação de JSON.');
  }
}

if (typeof window !== 'undefined') {
  window.getPlayerAllFeaturesAndTraits = getPlayerAllFeaturesAndTraits;
  window.printPlayerSheet = printPlayerSheet;
  window.closePrintModal = closePrintModal;
  window.printCurrentModalPlayerSheet = printCurrentModalPlayerSheet;
  window.triggerPlayerBrowserPrint = triggerPlayerBrowserPrint;
  window.exportSinglePlayerJson = exportSinglePlayerJson;
  window.exportCurrentModalPlayerJson = exportCurrentModalPlayerJson;
}

if (typeof global !== 'undefined') {
  global.getPlayerAllFeaturesAndTraits = getPlayerAllFeaturesAndTraits;
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
    slots: Array.isArray(p.slots) ? p.slots : [0, 0, 0, 0, 0, 0, 0, 0, 0],
    slotsUsed: Array.isArray(p.slotsUsed) ? p.slotsUsed : [0, 0, 0, 0, 0, 0, 0, 0, 0],
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
    spellbookSpells: Array.isArray(p.spellbookSpells) ? p.spellbookSpells : [],
    customSpells: Array.isArray(p.customSpells) ? p.customSpells : [],
    features: p.features || '',
    featureCharges: Array.isArray(p.featureCharges) ? p.featureCharges : [],
    inventory: Array.isArray(p.inventory) ? p.inventory : [],
    playerNotes: p.playerNotes || '',
    subclassIdx: parseInt(p.subclassIdx) || 0,
    multiclass: Array.isArray(p.multiclass) ? p.multiclass : [],
    updatedAt: p.updatedAt || Date.now()
  };

  try {
    const jsonStr = JSON.stringify(clean);
    const base64 = (typeof btoa === 'function')
      ? btoa(encodeURIComponent(jsonStr).replace(/%([0-9A-F]{2})/g, (m, p1) => String.fromCharCode('0x' + p1)))
      : (typeof Buffer !== 'undefined' ? Buffer.from(jsonStr, 'utf8').toString('base64') : '');
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
  const room = (typeof getStoredFirebaseRoom === 'function') ? getStoredFirebaseRoom() : 'turma_principal';
  let url = `${base}?view=player&id=${encodeURIComponent(playerId)}&room=${encodeURIComponent(room)}`;

  if (embedData) {
    const payload = serializePlayerForShare(p);
    if (payload) {
      url += `#pdata=${payload}`;
    }
  }
  return url;
}

function getShortPlayerShareUrl(playerId) {
  const room = (typeof getStoredFirebaseRoom === 'function') ? getStoredFirebaseRoom() : 'turma_principal';
  const queryStr = `room=${encodeURIComponent(room)}&player=${encodeURIComponent(playerId)}`;
  if (typeof getCanonicalPublicUrl === 'function') {
    return getCanonicalPublicUrl(queryStr);
  }
  return `https://uranio8.github.io/planilha-rpg/?${queryStr}`;
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
  const inpUrlShort = document.getElementById('inp-share-url-short');
  const qrContainer = document.getElementById('share-qrcode-render');
  const btnCopy = document.getElementById('btn-copy-share');
  const btnCopyShort = document.getElementById('btn-copy-share-short');

  if (charNameEl) charNameEl.innerText = `${p.name} (${p.student})`;
  if (charMetaEl) charMetaEl.innerText = `${p.race} • ${p.className} • Nível ${p.level} • CA ${p.ac} • ${p.hp}/${p.maxHp} PV`;

  const shareUrl = generatePlayerShareUrl(playerId, true);
  const shortUrl = getShortPlayerShareUrl(playerId);

  // Auto-publica silenciosamente a mesa na nuvem para garantir que o link curto encontre os dados
  if (typeof publishMasterCampaignToCloud === 'function' && clientRole !== 'player') {
    publishMasterCampaignToCloud(true);
  }

  if (inpUrl) inpUrl.value = shareUrl;
  if (inpUrlShort) inpUrlShort.value = shortUrl;

  if (btnCopy) {
    btnCopy.innerText = '📋 Copiar';
    btnCopy.style.background = '';
  }
  if (btnCopyShort) {
    btnCopyShort.innerText = '📋 Copiar Link Curto';
    btnCopyShort.style.background = '';
  }

  // Renderiza QR Code com URL curta otimizada (SVG vetorial 100% offline)
  const qrTargetUrl = shortUrl || shareUrl;
  if (qrContainer) {
    if (typeof renderQrCodeToContainer === 'function') {
      renderQrCodeToContainer(qrContainer, qrTargetUrl, 220);
    } else {
      qrContainer.innerHTML = `
        <img src="https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(qrTargetUrl)}" 
             alt="QR Code da Ficha de ${p.name}" 
             style="width: 220px; height: 220px; display: block; border-radius: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.5);"
             onerror="this.onerror=null; this.src='https://quickchart.io/qr?size=220&text=${encodeURIComponent(qrTargetUrl)}';">
      `;
    }
  }

  modal.classList.add('open');
}

function closeSharePlayerModal() {
  const modal = document.getElementById('modal-share-sheet');
  if (modal) modal.classList.remove('open');
}

function copyShortShareLink() {
  const inp = document.getElementById('inp-share-url-short');
  const btn = document.getElementById('btn-copy-share-short');
  if (!inp) return;
  inp.select();
  inp.setSelectionRange(0, 99999);

  // Garante publicação mais recente na nuvem ao copiar
  if (typeof publishMasterCampaignToCloud === 'function' && clientRole !== 'player') {
    publishMasterCampaignToCloud(true);
  }

  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(inp.value);
    } else {
      document.execCommand('copy');
    }
    if (btn) {
      btn.innerText = '✅ Link Curto Copiado!';
      btn.style.background = 'linear-gradient(135deg, #10b981, #047857)';
      setTimeout(() => {
        if (btn) {
          btn.innerText = '📋 Copiar Link Curto';
          btn.style.background = '';
        }
      }, 2000);
    }
    if (typeof addLog === 'function') addLog('💻 <b>Link Curto Copiado:</b> Link simplificado para computador copiado com sucesso.');
  } catch (e) {
    alert('Link selecionado. Pressione Ctrl+C para copiar.');
  }
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

function openLevelUpWizardForActivePlayer() {
  const targetId = activePortalPlayerId || (typeof PLAYERS !== 'undefined' && PLAYERS[0] ? PLAYERS[0].id : null);
  if (targetId && typeof openLevelUpWizard === 'function') {
    openLevelUpWizard(targetId);
  }
}

function updatePlayerPortalBanner() {
  const banner = document.getElementById('player-portal-banner');
  const titleEl = document.getElementById('portal-char-title');
  const subEl = document.getElementById('portal-char-sub');
  const badgeEl = document.getElementById('portal-sync-status-badge');
  const avatarEl = document.getElementById('portal-hero-avatar');
  const turnAlertEl = document.getElementById('portal-turn-active-indicator');
  const btnLevelUpEl = document.getElementById('portal-btn-levelup');

  if (typeof pendingPortalPlayerId !== 'undefined' && pendingPortalPlayerId && !activePortalPlayerId) {
    if (banner) banner.style.display = 'flex';
    if (titleEl) titleEl.innerText = `Sincronizando...`;
    if (subEl) subEl.innerText = `Carregando ficha do seu herói na mesa...`;
    if (avatarEl) avatarEl.innerText = '⏳';
    if (badgeEl) {
      badgeEl.className = 'portal-sync-badge sync-syncing';
      badgeEl.innerText = '🟡 Sincronizando...';
    }
    if (turnAlertEl) turnAlertEl.style.display = 'none';
    if (btnLevelUpEl) btnLevelUpEl.style.display = 'none';
    return;
  }

  if (!activePortalPlayerId) return;
  const p = PLAYERS.find(x => x.id === activePortalPlayerId);
  if (!p) return;

  // Avatar baseado na classe do personagem
  const classAvatars = { barbaro: '🪓', bardo: '🎵', clerigo: '⛪', druida: '🌿', guerreiro: '⚔️', monge: '🥊', paladino: '🛡️', patrulheiro: '🏹', ladino: '🗡️', feiticeiro: '🌀', bruxo: '👁️', mago: '🧙', artilheiro: '💣', inventor: '⚙️' };
  const classKey = String(p.className || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z]/g, '');
  const avatar = classAvatars[classKey] || '🧙';

  if (banner) banner.style.display = 'flex';
  if (avatarEl) avatarEl.innerText = avatar;
  if (titleEl) titleEl.innerText = `${p.name}`;
  if (subEl) subEl.innerText = `${p.student ? p.student + ' • ' : ''}${p.race || ''} ${p.className || ''} Nv.${p.level || 1} • ${p.hp || 0}/${p.maxHp || 10} PV`;
  if (badgeEl && !badgeEl.classList.contains('sync-syncing')) {
    badgeEl.className = 'portal-sync-badge sync-online';
    badgeEl.innerText = '🟢 Sincronizado';
  }

  if (btnLevelUpEl) {
    btnLevelUpEl.style.display = 'inline-flex';
  }

  // Verifica se combate está ativo e se é a vez do jogador atual
  let isPlayerTurn = false;
  if (typeof state !== 'undefined' && state && Array.isArray(state.combatants) && state.combatants.length > 0) {
    const curIdx = (state.turnIndex !== undefined ? state.turnIndex : (state.turn || 0));
    const activeCombatant = state.combatants[curIdx];
    if (activeCombatant) {
      const matchId = (activeCombatant.playerId && activeCombatant.playerId === p.id) || activeCombatant.id === p.id;
      const matchName = String(activeCombatant.name || '').toLowerCase().includes(String(p.name || '').toLowerCase());
      if (matchId || matchName) {
        isPlayerTurn = true;
      }
    }
  }

  if (banner) {
    banner.classList.toggle('player-turn-pulse', isPlayerTurn);
  }

  if (turnAlertEl) {
    if (isPlayerTurn) {
      if (turnAlertEl.style.display !== 'inline-flex') {
        turnAlertEl.style.display = 'inline-flex';
        if (typeof playFX === 'function') playFX('crit');
        if (typeof addLog === 'function') addLog(`⚔️ <b>SUA VEZ!</b> É o seu turno de agir no combate!`);
        if (typeof showToast === 'function') showToast(`⚔️ ${p.name}: É a sua vez de agir!`, 'warning');
      }
    } else {
      turnAlertEl.style.display = 'none';
    }
  }
}


function initPlayerPortalMode(playerId) {
  if (!playerId) return;

  const normTarget = String(playerId).trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const p = PLAYERS.find(x => {
    if (x.id === playerId) return true;
    const charName = String(x.name || '').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const studName = String(x.student || '').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return charName === normTarget || studName === normTarget || (charName && charName.includes(normTarget)) || (studName && studName.includes(normTarget));
  });

  if (!p) {
    // Herói ainda não está na memória local (ex: aguardando resposta do Firebase)
    pendingPortalPlayerId = playerId;
    activePortalPlayerId = null;
    if (typeof clientRole !== 'undefined') clientRole = 'player';
    if (typeof document !== 'undefined' && document.body && document.body.classList) {
      document.body.classList.add('mode-player-portal');
    }
    updatePlayerPortalBanner();
    switchTab('players');
    return;
  }

  pendingPortalPlayerId = null;
  activePortalPlayerId = p.id;
  if (typeof clientRole !== 'undefined') clientRole = 'player';
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('dnd5e_last_portal_player_id', p.id);
      localStorage.setItem('dnd5e_auth_player_id', p.id);
      localStorage.setItem('dnd5e_session_role', 'player');
    }
  } catch (e) { }
  if (typeof document !== 'undefined' && document.body && document.body.classList) {
    document.body.classList.add('mode-player-portal');
  }

  updatePlayerPortalBanner();
  renderPlayers();

  // Força aba inicial em Minha Ficha
  switchTab('players');
}

function exitPlayerPortalMode() {
  // Se o usuário tentar voltar para o painel do Mestre:
  // Se já estiver com sessão do mestre autorizada OU nenhum PIN foi configurado pelo mestre:
  const pinConfigured = (typeof isMasterPinConfigured === 'function') ? isMasterPinConfigured() : false;
  if (!pinConfigured || (typeof isMasterAuthorized === 'function' && isMasterAuthorized())) {
    if (typeof confirm === 'function') {
      const ok = confirm('Deseja realmente sair da sua ficha de jogador e voltar para a visão do Mestre?');
      if (!ok) return;
    }
    _executeExitPortalToMaster();
    return;
  }

  // Se NÃO for mestre autenticado, exige autenticação do PIN
  if (typeof requestMasterAccess === 'function') {
    requestMasterAccess(() => {
      _executeExitPortalToMaster();
    });
  } else {
    _executeExitPortalToMaster();
  }
}

function _executeExitPortalToMaster() {
  pendingPortalPlayerId = null;
  activePortalPlayerId = null;
  if (typeof clientRole !== 'undefined') clientRole = 'master';
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('dnd5e_last_portal_player_id');
      localStorage.removeItem('dnd5e_auth_player_id');
      localStorage.setItem('dnd5e_session_role', 'master');
    }
  } catch (e) { }
  if (typeof document !== 'undefined' && document.body && document.body.classList) {
    document.body.classList.remove('mode-player-portal');
  }
  const banner = document.getElementById('player-portal-banner');
  if (banner) banner.style.display = 'none';
  dismissPlayerReturnBanner();
  renderPlayers();
  switchTab('combat');
}

// --- CONTROLES DA TELA DE BOAS-VINDAS E BANNER DE RETORNO DO ALUNO ---

function openWelcomeScreen() {
  if (typeof document === 'undefined') return;
  const overlay = document.getElementById('welcome-screen');
  if (overlay) overlay.classList.add('open');
  if (document.body && document.body.classList) {
    document.body.classList.add('mode-welcome-screen');
  }
}

function closeWelcomeScreen() {
  if (typeof document === 'undefined') return;
  const overlay = document.getElementById('welcome-screen');
  if (overlay) overlay.classList.remove('open');
  if (document.body && document.body.classList) {
    document.body.classList.remove('mode-welcome-screen');
  }
}

function handleWelcomeSelect(role) {
  if (role === 'player') {
    if (typeof clientRole !== 'undefined') clientRole = 'player';
    if (typeof setClientRole === 'function') setClientRole('player');
    try {
      if (typeof localStorage !== 'undefined') localStorage.setItem('dnd5e_session_role', 'player');
    } catch (e) { }
    closeWelcomeScreen();
    openPlayerLoginModal();
  } else if (role === 'master') {
    const onMasterSuccess = () => {
      try {
        if (typeof localStorage !== 'undefined') localStorage.setItem('dnd5e_session_role', 'master');
      } catch (e) { }
      if (typeof clientRole !== 'undefined') clientRole = 'master';
      if (typeof setClientRole === 'function') setClientRole('master');
      closeWelcomeScreen();
      if (typeof switchTab === 'function') switchTab('combat');
    };

    if (typeof requestMasterAccess === 'function') {
      requestMasterAccess(onMasterSuccess);
    } else if (typeof openMasterPinModal === 'function') {
      openMasterPinModal(onMasterSuccess);
    }
  }
}

function resumeLastPlayerSession() {
  try {
    if (typeof localStorage === 'undefined') return;
    const savedId = localStorage.getItem('dnd5e_last_portal_player_id');
    if (savedId) {
      dismissPlayerReturnBanner();
      initPlayerPortalMode(savedId);
    }
  } catch (e) { }
}

function dismissPlayerReturnBanner() {
  if (typeof document === 'undefined') return;
  const banner = document.getElementById('player-return-banner');
  if (banner) banner.style.display = 'none';
}

function openRoomQrCodeModal() {
  if (typeof document === 'undefined') return;
  const modal = document.getElementById('modal-room-qrcode');
  if (!modal) return;

  const currentRoom = (typeof getStoredFirebaseRoom === 'function') ? getStoredFirebaseRoom() : 'turma_principal';
  const queryStr = `room=${encodeURIComponent(currentRoom)}&lobby=true`;
  const lobbyUrl = (typeof getCanonicalPublicUrl === 'function')
    ? getCanonicalPublicUrl(queryStr)
    : `https://uranio8.github.io/planilha-rpg/?${queryStr}`;

  const txtRoom = document.getElementById('txt-qrcode-room-name');
  if (txtRoom) txtRoom.innerText = currentRoom;

  if (typeof renderQrCodeToContainer === 'function') {
    renderQrCodeToContainer('img-room-qrcode', lobbyUrl, 220);
  } else {
    const imgEl = document.getElementById('img-room-qrcode');
    if (imgEl && imgEl.tagName && imgEl.tagName.toLowerCase() === 'img') {
      imgEl.onerror = function () {
        this.onerror = null;
        this.src = `https://quickchart.io/qr?size=240&text=${encodeURIComponent(lobbyUrl)}`;
      };
      imgEl.src = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(lobbyUrl)}`;
    }
  }

  modal.classList.add('open');
}

function closeRoomQrCodeModal() {
  if (typeof document === 'undefined') return;
  const modal = document.getElementById('modal-room-qrcode');
  if (modal) modal.classList.remove('open');
}

function checkPlayerPortalUrl() {
  try {
    const params = new URLSearchParams(window.location.search);

    // Conecta automaticamente à sala do mestre especificada na URL
    const roomParam = params.get('room');
    if (roomParam) {
      if (typeof setStoredFirebaseRoom === 'function') {
        setStoredFirebaseRoom(roomParam);
      }
      if (typeof setFirebaseAutoSyncEnabled === 'function') {
        setFirebaseAutoSyncEnabled(true);
      }
      if (typeof initFirebaseSync === 'function') {
        setTimeout(() => initFirebaseSync(), 100);
      }
    }

    // Suporte a Reset Seguro de PIN do Mestre via URL
    if (params.get('reset_master_pin') === 'true' || params.get('reset_pin') === 'true') {
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem('dnd5e_master_pin');
          localStorage.removeItem('dnd5e_master_session_exp');
          localStorage.removeItem('dnd5e_session_role');
        }
      } catch (e) { }
      if (typeof showToast === 'function') {
        showToast('🔑 PIN do Mestre foi resetado com sucesso.', 'warning');
      }
    }

    // 1. Verifica se há payload de dados codificado no Hash (#pdata=...) ou na Busca (?pdata=...)
    let encodedData = '';
    const hash = window.location.hash || '';
    if (hash.includes('pdata=')) {
      encodedData = hash.split('pdata=')[1].split('&')[0];
    } else if (hash.includes('import_player=')) {
      encodedData = hash.split('import_player=')[1].split('&')[0];
    }

    if (!encodedData && params.get('pdata')) {
      encodedData = params.get('pdata');
    }

    if (encodedData) {
      const importedPlayer = deserializePlayerFromShare(encodedData);
      if (importedPlayer && importedPlayer.id) {
        // Atualiza ou insere o jogador na lista local apenas se não houver versão local mais recente
        const existingIdx = PLAYERS.findIndex(x => x.id === importedPlayer.id);
        const existingHero = existingIdx >= 0 ? PLAYERS[existingIdx] : null;
        const isExistingNewer = existingHero && (existingHero.updatedAt || 0) > (importedPlayer.updatedAt || 0);

        if (!isExistingNewer) {
          syncPlayerCoinsAndGold(importedPlayer);
          if (existingIdx >= 0) {
            PLAYERS[existingIdx] = Object.assign({}, PLAYERS[existingIdx], importedPlayer);
          } else {
            PLAYERS.push(importedPlayer);
          }
          saveToLocalStorage();
        }

        // Limpa o hash #pdata= da URL para não re-importar em F5 futuros
        try {
          if (typeof window !== 'undefined' && window.history && window.history.replaceState) {
            const cleanUrl = window.location.pathname + window.location.search;
            window.history.replaceState(null, '', cleanUrl);
          }
        } catch (e) { }

        initPlayerPortalMode(importedPlayer.id);

        if (typeof addLog === 'function') {
          addLog(`✨ <b>Ficha Sincronizada:</b> Ficha de <b>${importedPlayer.name}</b> (${importedPlayer.student}) carregada com sucesso neste dispositivo!`);
        }
        return true;
      }
    }

    const view = params.get('view');
    const playerId = params.get('id') || params.get('playerId') || params.get('player');

    if ((view === 'player' || params.has('player')) && playerId) {
      initPlayerPortalMode(playerId);
      return true;
    }

    // Se a URL solicita abertura direta do lobby / seleção de herói
    if (params.get('login') === 'player' || params.get('player_login') === 'true' || params.get('lobby') === 'true') {
      if (typeof clientRole !== 'undefined') clientRole = 'player';
      setTimeout(() => {
        openPlayerLoginModal();
      }, 200);
      return false;
    }

    // 2. VERIFICAÇÃO DE SESSÃO SALVA DE ALUNO (SEMPRE PRIORITÁRIA PARA NÃO PERDER O PORTAL)
    let lastPlayerId = null;
    let savedRole = null;
    try {
      if (typeof localStorage !== 'undefined') {
        lastPlayerId = localStorage.getItem('dnd5e_last_portal_player_id');
        savedRole = localStorage.getItem('dnd5e_session_role');
      }
    } catch (e) { }

    if (lastPlayerId) {
      const savedHero = Array.isArray(PLAYERS) ? PLAYERS.find(p => p.id === lastPlayerId) : null;
      if (savedHero) {
        // Exibe banner de boas-vindas de volta e inicializa ficha no modo portal
        const returnBanner = document.getElementById('player-return-banner');
        const heroNameEl = document.getElementById('return-player-name');
        if (heroNameEl) heroNameEl.innerText = `${savedHero.name} (${savedHero.student || 'Personagem'})`;
        if (returnBanner) returnBanner.style.display = 'flex';

        initPlayerPortalMode(savedHero.id);
        return true;
      }
    }

    if (savedRole === 'player') {
      setTimeout(() => {
        openPlayerLoginModal();
      }, 150);
      return false;
    }

    // 3. VERIFICAÇÃO DE SESSÃO DO MESTRE AUTORIZADA NESTE NAVEGADOR
    const isMasterAuth = (typeof isMasterAuthorized === 'function') ? isMasterAuthorized() : false;

    if (isMasterAuth && savedRole === 'master') {
      // Mestre autorizado com sessão ativa: desativa portal se não houver pedido de jogador
      activePortalPlayerId = null;
      if (typeof document !== 'undefined' && document.body && document.body.classList) {
        document.body.classList.remove('mode-player-portal');
        document.body.classList.remove('mode-welcome-screen');
      }
      const banner = document.getElementById('player-portal-banner');
      if (banner) banner.style.display = 'none';
      return false;
    }

    // 4. VISITANTE SEM SESSÃO ATIVA (NOVO DISPOSITIVO OU ALUNO): ABRE TELA DE BOAS-VINDAS
    activePortalPlayerId = null;
    if (typeof document !== 'undefined' && document.body && document.body.classList) {
      document.body.classList.remove('mode-player-portal');
    }
    const banner = document.getElementById('player-portal-banner');
    if (banner) banner.style.display = 'none';

    openWelcomeScreen();

  } catch (e) {
    console.warn('Erro ao processar URL do portal do jogador:', e);
  }
  return false;
}

// --- MODAL DE LOGIN / ENTRADA RÁPIDA DE JOGADOR NO COMPUTADOR ---

let loginCloudTimeoutHandle = null;

function togglePlayerLoginRoomConfig() {
  const box = document.getElementById('player-login-custom-room-box');
  if (!box) return;
  box.style.display = (box.style.display === 'none' || !box.style.display) ? 'flex' : 'none';
  if (box.style.display === 'flex') {
    const inp = document.getElementById('inp-login-room');
    if (inp) {
      inp.value = (typeof getStoredFirebaseRoom === 'function') ? getStoredFirebaseRoom() : 'turma_principal';
      if (typeof inp.focus === 'function') inp.focus();
    }
  }
}

function openPlayerLoginModal() {
  const modal = document.getElementById('modal-player-login');
  if (!modal) return;

  const currentRoom = (typeof getStoredFirebaseRoom === 'function') ? getStoredFirebaseRoom() : 'turma_principal';
  const inpRoom = document.getElementById('inp-login-room');
  if (inpRoom) {
    inpRoom.value = currentRoom;
  }

  const statusText = document.getElementById('player-login-status-text');
  if (statusText) {
    const isConn = (typeof isFirebaseConnected !== 'undefined' && isFirebaseConnected);
    statusText.innerText = isConn ? '🟢 Servidor Principal Conectado' : '🟢 Conectando ao Servidor Principal...';
  }

  const inpFilter = document.getElementById('inp-filter-login-players');
  if (inpFilter) inpFilter.value = '';

  renderPlayerLoginList();
  modal.classList.add('open');
}

function closePlayerLoginModal() {
  const modal = document.getElementById('modal-player-login');
  if (modal) modal.classList.remove('open');
}

function refreshLoginRoom() {
  const inpRoom = document.getElementById('inp-login-room');
  if (!inpRoom) return;
  const newRoom = inpRoom.value.trim() || 'turma_principal';
  if (typeof setStoredFirebaseRoom === 'function') {
    setStoredFirebaseRoom(newRoom);
  }
  if (typeof setFirebaseAutoSyncEnabled === 'function') {
    setFirebaseAutoSyncEnabled(true);
  }
  if (typeof initFirebaseSync === 'function') {
    initFirebaseSync();
  }
  const statusText = document.getElementById('player-login-status-text');
  if (statusText) {
    statusText.innerText = `🟢 Sincronizado à Mesa (${newRoom})`;
  }
  const box = document.getElementById('player-login-custom-room-box');
  if (box) box.style.display = 'none';
  if (typeof addLog === 'function') {
    addLog(`🌐 Conectando à sala <b>${newRoom}</b>...`);
  }
  setTimeout(() => {
    renderPlayerLoginList();
  }, 400);
}

function setQuickLoginRoom(roomId) {
  const inp = document.getElementById('inp-login-room');
  if (inp) inp.value = roomId;
  refreshLoginRoom();
}

function renderPlayerLoginList() {
  const container = document.getElementById('player-login-list-container');
  if (!container) return;

  const currentRoom = (typeof getStoredFirebaseRoom === 'function') ? getStoredFirebaseRoom() : 'turma_principal';
  const inpFilter = document.getElementById('inp-filter-login-players');
  const term = (inpFilter && inpFilter.value) ? inpFilter.value.trim().toLowerCase() : '';

  // Determina se estamos aguardando dados da nuvem
  const isUrlWithRoom = typeof window !== 'undefined' && window.location && window.location.search && window.location.search.includes('room=');
  const isLoaded = typeof isCloudRoomDataLoaded !== 'undefined' ? isCloudRoomDataLoaded : true;

  // Se o aluno acessou por link com sala e a nuvem ainda não respondeu, exibe estado com timeout resiliente
  if (isUrlWithRoom && !isLoaded && (!PLAYERS || PLAYERS.length === 0 || (PLAYERS.length === 5 && PLAYERS[0]?.id === 'p1'))) {
    if (!loginCloudTimeoutHandle && typeof setTimeout === 'function') {
      loginCloudTimeoutHandle = setTimeout(() => {
        loginCloudTimeoutHandle = null;
        if (typeof isCloudRoomDataLoaded !== 'undefined') isCloudRoomDataLoaded = true;
        renderPlayerLoginList();
      }, 2500);
    }

    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 36px 16px; color: var(--text-muted);">
        <div style="font-size: 32px; margin-bottom: 10px; animation: pulse 1.5s infinite;">🔄</div>
        <div style="font-size: 15px; font-weight: 700; color: #fff;">Conectando à mesa "${currentRoom}"...</div>
        <div style="font-size: 12px; margin-top: 6px; color: var(--primary-light);">Baixando os personagens reais da campanha... Aguarde um instante.</div>
      </div>
    `;
    return;
  }

  // No portal de login de alunos, exibe TODOS os heróis cadastrados para busca direta por aluno ou personagem
  const candidates = Array.isArray(PLAYERS) ? PLAYERS : [];

  const filtered = candidates.filter(p => {
    if (!term) return true;
    const nameMatch = (p.name || '').toLowerCase().includes(term);
    const studentMatch = (p.student || '').toLowerCase().includes(term);
    const classMatch = (p.className || '').toLowerCase().includes(term);
    const raceMatch = (p.race || '').toLowerCase().includes(term);
    return nameMatch || studentMatch || classMatch || raceMatch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 28px 14px; color: var(--text-muted); background: rgba(0,0,0,0.25); border-radius: 8px; border: 1px dashed var(--border-color);">
        <div style="font-size: 30px; margin-bottom: 8px;">👥</div>
        <div style="font-size: 15px; font-weight: 700; color: #fff;">
          ${term ? 'Nenhum personagem encontrado com essa busca' : `Nenhum herói publicado na sala "${currentRoom}"`}
        </div>
        <div style="font-size: 12px; margin-top: 6px; color: var(--accent-gold);">
          ${term ? 'Tente buscar com outro nome de herói ou aluno.' : 'Peça ao Mestre para abrir a planilha e clicar no botão <b>"📤 Publicar Mesa"</b>.'}
        </div>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(p => {
    const isCurrent = activePortalPlayerId === p.id;
    const initial = (p.name || '?').charAt(0).toUpperCase();
    const maxHp = p.maxHp || 10;
    const currentHp = (p.hp !== undefined && p.hp !== null) ? p.hp : ((p.currentHp !== undefined && p.currentHp !== null) ? p.currentHp : maxHp);
    const hpPct = Math.max(0, Math.min(100, Math.round((currentHp / maxHp) * 100)));
    const hpColor = hpPct > 50 ? '#10b981' : (hpPct > 25 ? '#f59e0b' : '#ef4444');

    return `
      <div class="player-login-card ${isCurrent ? 'active' : ''}" onclick="selectLoginCharacter('${p.id}')">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="width: 40px; height: 40px; border-radius: 8px; background: linear-gradient(135deg, rgba(235, 180, 56, 0.2), rgba(0,0,0,0.5)); border: 1px solid var(--accent-gold); display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: 800; color: var(--accent-gold); flex-shrink: 0; line-height: 1; overflow: hidden;">
            ${p.avatar ? `<img src="${p.avatar}" style="width:100%;height:100%;object-fit:cover;border-radius:7px;" onerror="this.outerHTML='${initial}'">` : initial}
          </div>
          <div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1;">
            <div style="font-weight: 800; font-size: 14px; color: #fff; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; font-family: var(--font-title);">${p.name || 'Sem Nome'}</div>
            <div style="font-size: 11px; color: var(--primary-light); text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">👤 ${p.student || 'Aventureiro'}</div>
          </div>
        </div>

        <div style="margin-top: 6px; font-size: 11px; color: var(--text-muted); display: flex; align-items: center; justify-content: space-between; gap: 6px;">
          <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">🛡️ ${p.race || 'Raça'} • ${p.className || 'Classe'} (Nv. ${p.level || 1})</span>
          <span style="color: var(--accent-gold); font-weight: 700; flex-shrink: 0;">CA ${p.ac || 10}</span>
        </div>

        <div style="margin-top: 4px; display: flex; align-items: center; justify-content: space-between; font-size: 11px;">
          <span style="color: ${hpColor}; font-weight: 700;">❤️ ${currentHp}/${maxHp} PV</span>
          <span style="color: var(--primary-light); font-size: 10px;">${hpPct}% Vitalidade</span>
        </div>

        <div style="margin-top: 6px;">
          <button class="btn-action" style="width: 100%; font-size: 11.5px; padding: 6px 0; border-radius: 5px; pointer-events: none; font-weight: 700;">
            ${isCurrent ? '✅ Personagem Ativo' : '🎮 Entrar com este Herói'}
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function selectLoginCharacter(playerId) {
  const p = PLAYERS.find(x => x.id === playerId);
  if (!p) return;

  // Persiste a sessão do aluno para retorno automático em futuros acessos
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('dnd5e_last_portal_player_id', playerId);
      localStorage.setItem('dnd5e_session_role', 'player');
      const currentRoom = (typeof getStoredFirebaseRoom === 'function') ? getStoredFirebaseRoom() : 'turma_principal';
      localStorage.setItem('dnd5e_last_portal_room', currentRoom);
    }
  } catch (e) { }

  if (typeof dismissPlayerReturnBanner === 'function') {
    dismissPlayerReturnBanner();
  }
  if (typeof closeWelcomeScreen === 'function') {
    closeWelcomeScreen();
  }

  initPlayerPortalMode(playerId);
  closePlayerLoginModal();

  // Atualiza a URL no navegador sem recarregar para facilitar bookmark / compartilhamento
  try {
    if (typeof window !== 'undefined' && window.history && window.history.replaceState) {
      const room = (typeof getStoredFirebaseRoom === 'function') ? getStoredFirebaseRoom() : 'turma_principal';
      const cleanUrl = `${window.location.pathname}?room=${encodeURIComponent(room)}&player=${encodeURIComponent(playerId)}`;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  } catch (e) {
    // Silencioso em caso de restrição de ambiente
  }

  if (typeof addLog === 'function') {
    addLog(`🎮 <b>Entrou como Jogador:</b> Você está controlando a ficha de <b>${p.name}</b> (${p.student}). Bom jogo!`);
  }
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
    const comb = typeof findCombatantForPlayer === 'function'
      ? findCombatantForPlayer(p, state.combatants)
      : state.combatants.find(c => (c.playerId && c.playerId === id) || c.name.includes(p.name));
    if (comb) {
      comb.conditions = [...p.conditions];
      if (typeof renderCombat === 'function') renderCombat();
    }
  }

  if (typeof touchPlayer === 'function') touchPlayer(p);
  renderPlayers();
  saveToLocalStorage();
  if (typeof syncLocalChangesToFirebase === 'function') syncLocalChangesToFirebase(true);
  if (typeof broadcastStateSync === 'function') broadcastStateSync();
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
  reader.onload = function (e) {
    const img = new Image();
    img.onload = function () {
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
  modal.classList.add('open');
}

function closePlayerCoinsModal() {
  const modal = document.getElementById('modal-player-coins');
  if (modal) modal.classList.remove('open');
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
  touchPlayer(p);

  addPlayerActionLog(p.id, '🪙', `Atualizou carteira: ${purse.totalGp} PO total (${cp}pc, ${sp}pp, ${ep}pe, ${gp}po, ${pp}pl)`, 'general');
  if (typeof playFX === 'function') playFX('crit');
  closePlayerCoinsModal();
  renderPlayers();
  saveToLocalStorage();
  if (typeof syncLocalChangesToFirebase === 'function') syncLocalChangesToFirebase(true);
  if (typeof broadcastStateSync === 'function') broadcastStateSync();
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
  modal.classList.add('open');
}

function closeAddPlayerItemModal() {
  const modal = document.getElementById('modal-add-player-item');
  if (modal) modal.classList.remove('open');
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
  touchPlayer(p);
  if (typeof playFX === 'function') playFX('crit');
  closeAddPlayerItemModal();
  renderPlayers();
  saveToLocalStorage();
  if (typeof syncLocalChangesToFirebase === 'function') syncLocalChangesToFirebase(true);
  if (typeof broadcastStateSync === 'function') broadcastStateSync();
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
  touchPlayer(p);

  addPlayerActionLog(p.id, '🎒', `Adicionou item personalizado: ${name} (${qty}x)`, 'general');
  if (typeof playFX === 'function') playFX('crit');
  closeAddPlayerItemModal();
  renderPlayers();
  saveToLocalStorage();
  if (typeof syncLocalChangesToFirebase === 'function') syncLocalChangesToFirebase(true);
  if (typeof broadcastStateSync === 'function') broadcastStateSync();
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
  touchPlayer(p);
  renderPlayers();
  saveToLocalStorage();
  if (typeof syncLocalChangesToFirebase === 'function') syncLocalChangesToFirebase(true);
  if (typeof broadcastStateSync === 'function') broadcastStateSync();
}

function removePlayerItem(playerId, itemIndex) {
  const p = PLAYERS.find(x => x.id === playerId);
  if (!p || !p.inventory || !p.inventory[itemIndex]) return;

  const removedName = p.inventory[itemIndex].name;
  if (confirm(`Remover "${removedName}" do inventário de ${p.name}?`)) {
    p.inventory.splice(itemIndex, 1);
    touchPlayer(p);
    addPlayerActionLog(p.id, '🗑️', `Removeu do inventário: ${removedName}`, 'general');
    renderPlayers();
    saveToLocalStorage();
    if (typeof syncLocalChangesToFirebase === 'function') syncLocalChangesToFirebase(true);
    if (typeof broadcastStateSync === 'function') broadcastStateSync();
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
  if (classesList.length === 1) {
    const single = classesList[0];
    const subIdx = single.subclassIdx !== undefined ? single.subclassIdx : (player.subclassIdx !== undefined ? player.subclassIdx : 0);
    return calculateSpellSlots(single.className, single.level, subIdx);
  }

  let casterLevel = 0;
  let warlockLevel = 0;

  classesList.forEach(c => {
    const norm = c.className.toLowerCase();
    const lvl = c.level;
    const subIdx = c.subclassIdx !== undefined ? c.subclassIdx : (player.subclassIdx !== undefined ? player.subclassIdx : 0);
    const subName = c.subclass || (player.subclass && classesList.length === 1 ? player.subclass : '');
    const isThird = isMagicalSubclass(c.className, subIdx, subName);

    // Conjuradores Totais (100%)
    if (norm.includes('mago') || norm.includes('clérigo') || norm.includes('clerigo') || norm.includes('druida') || norm.includes('bardo') || norm.includes('feiticeiro')) {
      casterLevel += lvl;
    }
    // Meio Conjuradores (50%)
    else if (norm.includes('paladino') || norm.includes('patrulheiro') || norm.includes('ranger')) {
      casterLevel += Math.floor(lvl / 2);
    }
    // Terço Conjuradores (33%) - Ladino Trapaceiro Arcano / Guerreiro Cavaleiro Místico
    else if (isThird || norm.includes('arcano') || norm.includes('eldritch') || norm.includes('trickster')) {
      casterLevel += Math.floor(lvl / 3);
    }
    // Bruxo (Pact Magic)
    else if (norm.includes('bruxo') || norm.includes('warlock')) {
      warlockLevel += lvl;
    }
  });

  const baseSlots = calculateSpellSlots('mago', Math.max(1, casterLevel));
  // Se não tiver nenhum conjurador tradicional, zera os slots normais
  const finalSlots = casterLevel > 0 ? baseSlots : [0, 0, 0, 0, 0, 0, 0, 0, 0];

  // Adiciona os slots de pacto do bruxo
  if (warlockLevel > 0) {
    const warlockSlots = calculateSpellSlots('bruxo', warlockLevel);
    for (let i = 0; i < 9; i++) {
      finalSlots[i] = (finalSlots[i] || 0) + (warlockSlots[i] || 0);
    }
  }

  return finalSlots;
}

// ============================================================================
// 🔮 ISSUE-136: CÁLCULO E NORMALIZAÇÃO CANÔNICA DE ESPAÇOS DE MAGIA (SLOTS D&D 5E)
// Garante que conjuradores tenham sempre seus slots calculados tanto no Mestre quanto no Jogador
// ============================================================================
function ensurePlayerSpellSlots(player) {
  if (!player) return null;

  // Se não possuir slots ou se todos os círculos estiverem zerados, auto-calcula para conjuradores
  const hasNonZeroSlots = Array.isArray(player.slots) && player.slots.some(s => s > 0);
  if (!hasNonZeroSlots && typeof calculateMulticlassSpellSlots === 'function') {
    const calc = calculateMulticlassSpellSlots(player);
    if (calc && calc.some(s => s > 0)) {
      player.slots = [...calc];
      if (!Array.isArray(player.slotsUsed) || player.slotsUsed.length < player.slots.length) {
        player.slotsUsed = player.slots.map(() => 0);
      }
    }
  }

  // Normalização defensiva para 9 círculos D&D 5E
  if (!Array.isArray(player.slots)) {
    player.slots = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  }
  while (player.slots.length < 9) player.slots.push(0);

  if (!Array.isArray(player.slotsUsed)) {
    player.slotsUsed = player.slots.map(() => 0);
  }
  while (player.slotsUsed.length < player.slots.length) player.slotsUsed.push(0);

  return player.slots;
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

  const existingSubName = primaryClass.subclass || (classesList.length === 1 ? p.subclass : '');
  const existingSubIdx = primaryClass.subclassIdx !== undefined ? primaryClass.subclassIdx : (classesList.length === 1 ? p.subclassIdx : 0);
  const resolvedSubIdx = resolveSubclassIndex(primaryClass.className, existingSubIdx, existingSubName);

  levelUpWizardState = {
    playerId,
    targetPlayerId: playerId,
    step: 1,
    selectedClassKey: primaryClass.className,
    selectedClass: primaryClass.className,
    isNewClass: false,
    targetClassLevel: primaryClass.level + 1,
    selectedSubclassIdx: resolvedSubIdx,
    subclassRespec: false,
    asi: {
      mode: 'single',
      singleAttr: 'str',
      dualAttr1: 'str',
      dualAttr2: 'dex',
      feat: 'Robustez (Tough)'
    },
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

    // Gerenciamento Inteligente de Subclasse D&D 5E
    const reqSubLvl = getSubclassUnlockLevel(clsName);
    let subclassSelectHtml = '';
    const currentClasses = getPlayerClassesList(p);
    const existingClassItem = currentClasses.find(c => c.className.toLowerCase() === clsName.toLowerCase());
    const existingSubName = existingClassItem ? (existingClassItem.subclass || (currentClasses.length === 1 ? p.subclass : '')) : '';
    const hasChosenSubclass = Boolean(existingSubName && existingSubName.trim() && existingSubName.toLowerCase() !== 'padrao' && existingSubName.toLowerCase() !== 'default');

    if (clsData && clsData.subclasses && clsData.subclasses.length > 0) {
      if (targetLvl < reqSubLvl) {
        subclassSelectHtml = `
          <div style="margin: 12px 20px; padding: 10px 14px; background: rgba(255,255,255,0.02); border: 1px dashed rgba(255,255,255,0.1); border-radius: 8px; font-size: 11.5px; color: var(--text-muted); display: flex; align-items: center; gap: 8px;">
            <span>🔒</span>
            <span>A <b>Especialização / Subclasse</b> de ${clsName} é desbloqueada no <b>Nível ${reqSubLvl}</b>.</span>
          </div>
        `;
      } else if (targetLvl === reqSubLvl || !hasChosenSubclass || levelUpWizardState.subclassRespec) {
        subclassSelectHtml = `
          <div class="subclass-locked-card" style="margin: 12px 20px; padding: 14px; background: rgba(245,158,11,0.08); border: 1.5px solid var(--accent-gold); border-radius: 10px; box-shadow: 0 4px 15px rgba(245,158,11,0.12);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <div style="font-size: 12.5px; font-weight: 800; color: var(--accent-gold); display: flex; align-items: center; gap: 6px;">
                <span>🌟</span>
                <span>Escolha sua Especialização / Subclasse (${targetLvl === reqSubLvl ? `Desbloqueada no Nível ${reqSubLvl}` : `Nível ${targetLvl}`}):</span>
              </div>
              ${levelUpWizardState.subclassRespec ? `
                <button type="button" class="btn-secondary" style="padding: 2px 8px; font-size: 10px;" onclick="cancelLevelUpSubclassRespec()">
                  ✖ Cancelar Alteração
                </button>
              ` : ''}
            </div>
            <select class="filter-select" style="width: 100%; font-weight: 700; font-size: 13px;" onchange="selectLevelUpSubclass(parseInt(this.value))">
              ${clsData.subclasses.map((sub, idx) => `
                <option value="${idx}" ${idx === levelUpWizardState.selectedSubclassIdx ? 'selected' : ''}>
                  ${sub.name}
                </option>
              `).join('')}
            </select>
            <div style="font-size: 11px; color: var(--text-muted); margin-top: 6px;">
              A subclasse concede arquétipos e habilidades exclusivas para o seu herói a partir deste nível.
            </div>
          </div>
        `;
      } else {
        const curSub = clsData.subclasses[levelUpWizardState.selectedSubclassIdx] || clsData.subclasses[0];
        const displaySubName = curSub ? curSub.name : (existingSubName || 'Ativa');
        subclassSelectHtml = `
          <div class="subclass-locked-card" style="margin: 12px 20px; padding: 12px 14px; background: rgba(30, 41, 59, 0.6); border: 1px solid rgba(245,158,11,0.3); border-radius: 10px; display: flex; justify-content: space-between; align-items: center; gap: 12px;">
            <div>
              <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: var(--accent-gold); font-weight: 800; display: flex; align-items: center; gap: 5px;">
                <span>🌟</span> Subclasse Ativa (Escolhida no Nv ${reqSubLvl})
              </div>
              <div style="font-size: 14px; font-weight: 800; color: #fff; margin-top: 2px;">
                ${displaySubName}
              </div>
            </div>
            <button type="button" class="btn-secondary" style="padding: 4px 10px; font-size: 11px; border-color: rgba(245,158,11,0.4); color: var(--accent-gold);" onclick="triggerLevelUpSubclassRespec()">
              🔄 Alterar Subclasse
            </button>
          </div>
        `;
      }

      // Inclui traços da subclasse para este nível
      const curSub = clsData.subclasses[levelUpWizardState.selectedSubclassIdx] || clsData.subclasses[0];
      if (curSub && curSub.features) {
        const subFeats = curSub.features.filter(f => f.level === targetLvl);
        subFeats.forEach(sf => {
          newFeatures.push({ ...sf, isSubclass: true, source: curSub.name });
        });
      }
    }

    // ================= ASI (Aumento no Valor de Atributo) =================
    const isAsiLevel = isClassAsiLevel(clsName, targetLvl);
    let asiHtml = '';
    if (isAsiLevel) {
      if (!levelUpWizardState.asi) {
        levelUpWizardState.asi = {
          mode: 'single',
          singleAttr: 'str',
          dualAttr1: 'str',
          dualAttr2: 'dex',
          feat: 'Robustez (Tough)'
        };
      }
      const asi = levelUpWizardState.asi;
      const attrNames = [
        { key: 'str', label: 'Força', icon: '💪' },
        { key: 'dex', label: 'Destreza', icon: '🎯' },
        { key: 'con', label: 'Constituição', icon: '🛡️' },
        { key: 'int', label: 'Inteligência', icon: '🧠' },
        { key: 'wis', label: 'Sabedoria', icon: '🦉' },
        { key: 'cha', label: 'Carisma', icon: '👑' }
      ];

      const getPreviewAttr = (key, delta) => {
        const curr = getPlayerAttr(p, key);
        const next = Math.min(20, curr + delta);
        const currMod = Math.floor((curr - 10) / 2);
        const nextMod = Math.floor((next - 10) / 2);
        const currModStr = (currMod >= 0 ? '+' : '') + currMod;
        const nextModStr = (nextMod >= 0 ? '+' : '') + nextMod;
        return { curr, next, currModStr, nextModStr, diffMod: nextMod !== currMod };
      };

      let asiModeControls = '';
      if (asi.mode === 'single') {
        const prev = getPreviewAttr(asi.singleAttr, 2);
        asiModeControls = `
          <div style="margin-top: 10px;">
            <div style="font-size: 11.5px; color: var(--text-muted); margin-bottom: 6px;">
              Selecione o atributo para receber <b>+2 pontos</b> (máximo 20):
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)); gap: 8px;">
              ${attrNames.map(a => {
          const isSelected = asi.singleAttr === a.key;
          const pInfo = getPreviewAttr(a.key, 2);
          return `
                  <button type="button" class="btn-secondary asi-attr-btn ${isSelected ? 'active' : ''}" 
                          onclick="setLevelUpAsiSingle('${a.key}')" 
                          style="display: flex; flex-direction: column; align-items: center; padding: 8px 6px; gap: 3px; border-radius: 8px; border: 1.5px solid ${isSelected ? 'var(--accent-gold)' : 'rgba(255,255,255,0.1)'}; background: ${isSelected ? 'rgba(245,158,11,0.15)' : 'rgba(0,0,0,0.2)'};">
                    <span style="font-size: 16px;">${a.icon}</span>
                    <span style="font-size: 12px; font-weight: 700; color: ${isSelected ? 'var(--accent-gold)' : '#fff'};">${a.label}</span>
                    <span style="font-size: 10.5px; color: ${isSelected ? '#34d399' : 'var(--text-muted)'}; font-weight: 600;">
                      ${pInfo.curr} ➔ <b>${pInfo.next}</b>
                    </span>
                  </button>
                `;
        }).join('')}
            </div>
            <div style="margin-top: 10px; padding: 8px 12px; background: rgba(16,185,129,0.08); border: 1px solid rgba(16,185,129,0.25); border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 12px; color: #e2e8f0;">
                Prévia: <b>${attrNames.find(x => x.key === asi.singleAttr)?.label}</b> aumentará de <b>${prev.curr} (${prev.currModStr})</b> para <b style="color: #34d399;">${prev.next} (${prev.nextModStr})</b>
              </span>
              ${prev.diffMod ? `<span class="badge" style="background: rgba(16,185,129,0.2); color: #34d399; font-size: 10px;">Modificador +1!</span>` : ''}
            </div>
          </div>
        `;
      } else if (asi.mode === 'dual') {
        const prev1 = getPreviewAttr(asi.dualAttr1, 1);
        const prev2 = getPreviewAttr(asi.dualAttr2, 1);
        asiModeControls = `
          <div style="margin-top: 10px; display: flex; flex-direction: column; gap: 10px;">
            <div style="font-size: 11.5px; color: var(--text-muted);">
              Selecione <b>dois atributos distintos</b> para receber <b>+1 ponto cada</b>:
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div>
                <label style="font-size: 11px; font-weight: 700; color: var(--primary-light); display: block; margin-bottom: 4px;">
                  1º Atributo (+1):
                </label>
                <select class="filter-select" style="width: 100%;" onchange="setLevelUpAsiDual(1, this.value)">
                  ${attrNames.map(a => `
                    <option value="${a.key}" ${asi.dualAttr1 === a.key ? 'selected' : ''}>
                      ${a.icon} ${a.label} (${getPlayerAttr(p, a.key)})
                    </option>
                  `).join('')}
                </select>
                <div style="font-size: 11px; color: #34d399; margin-top: 4px;">
                  ➔ ${prev1.curr} (${prev1.currModStr}) ➔ <b>${prev1.next} (${prev1.nextModStr})</b>
                </div>
              </div>
              <div>
                <label style="font-size: 11px; font-weight: 700; color: var(--primary-light); display: block; margin-bottom: 4px;">
                  2º Atributo (+1):
                </label>
                <select class="filter-select" style="width: 100%;" onchange="setLevelUpAsiDual(2, this.value)">
                  ${attrNames.map(a => `
                    <option value="${a.key}" ${asi.dualAttr2 === a.key ? 'selected' : ''}>
                      ${a.icon} ${a.label} (${getPlayerAttr(p, a.key)})
                    </option>
                  `).join('')}
                </select>
                <div style="font-size: 11px; color: #34d399; margin-top: 4px;">
                  ➔ ${prev2.curr} (${prev2.currModStr}) ➔ <b>${prev2.next} (${prev2.nextModStr})</b>
                </div>
              </div>
            </div>
            ${asi.dualAttr1 === asi.dualAttr2 ? `
              <div style="padding: 6px 10px; background: rgba(239,68,68,0.15); border: 1px solid rgba(239,68,68,0.3); border-radius: 6px; font-size: 11px; color: #fca5a5;">
                ⚠️ Pela regra de D&D 5E, os dois atributos devem ser diferentes. Caso queira +2 no mesmo atributo, use a opção <b>+2 em um Atributo</b> acima.
              </div>
            ` : ''}
          </div>
        `;
      } else {
        const featOptions = [
          'Robustez (Tough)',
          'Sentinela (Sentinel)',
          'Atirador Aguçado (Sharpshooter)',
          'Mestre de Armas Grandes (Great Weapon Master)',
          'Mestre em Armas de Haste (Polearm Master)',
          'Conjurador de Guerra (War Caster)',
          'Mestre do Escudo (Shield Master)',
          'Sortudo (Lucky)',
          'Resiliente (Resilient)',
          'Alerta (Alert)',
          'Observador (Observant)',
          'Iniciado em Magia (Magic Initiate)'
        ];
        asiModeControls = `
          <div style="margin-top: 10px;">
            <div style="font-size: 11.5px; color: var(--text-muted); margin-bottom: 6px;">
              Escolha ou digite o <b>Talento (Feat)</b> recebido em vez do aumento de atributo:
            </div>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <select class="filter-select" style="flex: 1; min-width: 200px;" onchange="setLevelUpAsiFeat(this.value)">
                ${featOptions.map(f => `
                  <option value="${f}" ${asi.feat === f ? 'selected' : ''}>${f}</option>
                `).join('')}
              </select>
              <input type="text" class="filter-input" style="flex: 1; min-width: 160px; font-size: 12px;" 
                     placeholder="Ou digite outro talento..." 
                     value="${asi.feat || ''}" 
                     oninput="setLevelUpAsiFeat(this.value)">
            </div>
            <div style="font-size: 11px; color: var(--text-dim); margin-top: 6px;">
              O talento será registrado no diário de evolução e traços da ficha.
            </div>
          </div>
        `;
      }

      asiHtml = `
        <div class="levelup-asi-card" style="margin: 14px 20px; padding: 14px; background: linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(15, 23, 42, 0.6) 100%); border: 1.5px solid #10b981; border-radius: 12px; box-shadow: 0 4px 20px rgba(16,185,129,0.15);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <div style="font-size: 13px; font-weight: 800; color: #34d399; display: flex; align-items: center; gap: 6px;">
              <span>📈</span>
              <span>Aumento no Valor de Atributo (ASI) - Nível ${targetLvl}</span>
            </div>
            <span class="badge" style="background: rgba(16,185,129,0.2); color: #34d399; font-size: 10px; font-weight: 700;">
              D&D 5E Oficial
            </span>
          </div>
          <p style="font-size: 11px; color: var(--text-muted); margin: 0 0 10px 0;">
            Você alcançou um marco de classe que aprimora suas capacidades físicas ou mentais:
          </p>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button type="button" class="btn-secondary ${asi.mode === 'single' ? 'active' : ''}" 
                    style="font-size: 11px; padding: 5px 12px; ${asi.mode === 'single' ? 'border-color: #10b981; background: rgba(16,185,129,0.2); color: #fff;' : ''}" 
                    onclick="setLevelUpAsiMode('single')">
              💪 +2 em um Atributo
            </button>
            <button type="button" class="btn-secondary ${asi.mode === 'dual' ? 'active' : ''}" 
                    style="font-size: 11px; padding: 5px 12px; ${asi.mode === 'dual' ? 'border-color: #10b981; background: rgba(16,185,129,0.2); color: #fff;' : ''}" 
                    onclick="setLevelUpAsiMode('dual')">
              ⚖️ +1 em dois Atributos
            </button>
            <button type="button" class="btn-secondary ${asi.mode === 'feat' ? 'active' : ''}" 
                    style="font-size: 11px; padding: 5px 12px; ${asi.mode === 'feat' ? 'border-color: #10b981; background: rgba(16,185,129,0.2); color: #fff;' : ''}" 
                    onclick="setLevelUpAsiMode('feat')">
              📜 Escolher Talento (Feat)
            </button>
          </div>
          ${asiModeControls}
        </div>
      `;
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
      ${asiHtml}
      ${featuresListHtml}
    `;
  }

  // ================= PASSO 3: INCREMENTO DE PV & CONFIRMAÇÃO =================
  else if (levelUpWizardState.step === 3) {
    const clsName = levelUpWizardState.selectedClassKey || levelUpWizardState.selectedClass;
    const hitDieStr = getHitDieForClass(clsName); // ex: '1d10'
    const dieSides = getHitDieSides(hitDieStr);
    const conMod = Math.floor((getPlayerAttr(p, 'con') - 10) / 2);
    const hpBonusObj = typeof getPlayerBonusHpPerLevel === 'function' ? getPlayerBonusHpPerLevel(p, clsName) : { bonus: 0, reason: '' };
    const bonusHp = hpBonusObj.bonus || 0;
    const bonusReason = hpBonusObj.reason || '';
    const avgGain = Math.max(1, Math.floor(dieSides / 2) + 1 + conMod + bonusHp);
    const rolledGain = levelUpWizardState.rolledHp !== null
      ? Math.max(1, levelUpWizardState.rolledHp + conMod + bonusHp)
      : null;

    const chosenGain = (levelUpWizardState.hpMethod === 'roll' || levelUpWizardState.hpMethod === 'physical') && rolledGain !== null ? rolledGain : avgGain;
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
              🎲 Rolar no App
            </button>
            <button class="btn-secondary ${levelUpWizardState.hpMethod === 'physical' ? 'active' : ''}" onclick="setLevelUpHpMethod('physical')" style="font-size: 11px;">
              🎲✏️ Dado Físico da Mesa
            </button>
          </div>
        </div>

        ${bonusHp > 0 ? `
          <div style="margin-top: 4px;">
            <span class="hp-bonus-badge">✨ +${bonusHp} PV ativo (${bonusReason})</span>
          </div>
        ` : ''}

        ${levelUpWizardState.hpMethod === 'roll' ? `
          <div style="display: flex; align-items: center; gap: 8px; margin-top: 6px;">
            <button class="btn-action" style="padding: 6px 12px; font-size: 11px;" onclick="rollLevelUpHpDice(${dieSides})">
              🎲 Rolar ${hitDieStr}
            </button>
            ${levelUpWizardState.rolledHp !== null ? `
              <span style="font-size: 13px; font-weight: 800; color: var(--accent-gold);">
                [${levelUpWizardState.rolledHp}] + ${conMod >= 0 ? '+' + conMod : conMod} (CON)${bonusHp > 0 ? ` + ${bonusHp} (${bonusReason})` : ''} ➔ <b>+${rolledGain} PV</b>
              </span>
            ` : `<span style="font-size: 11px; color: var(--text-muted);">Clique para rolar o dado virtual</span>`}
          </div>
        ` : ''}

        ${levelUpWizardState.hpMethod === 'physical' ? `
          <div style="display: flex; flex-direction: column; gap: 8px; padding: 10px; background: rgba(245, 158, 11, 0.08); border: 1px dashed rgba(245, 158, 11, 0.4); border-radius: 8px; margin-top: 6px;">
            <div style="font-size: 11.5px; color: var(--accent-gold); font-weight: 700;">
              🎲 Resultado Rolado no Dado Físico da Mesa (1 a ${dieSides}):
            </div>
            <div style="display: flex; align-items: center; gap: 10px;">
              <input type="number" id="inp-levelup-physical-val" min="1" max="${dieSides}" 
                     value="${levelUpWizardState.rolledHp !== null ? levelUpWizardState.rolledHp : ''}" 
                     placeholder="Ex: 7" 
                     oninput="setLevelUpPhysicalRolledHp(this.value, ${dieSides})" 
                     style="width: 80px; text-align: center; font-size: 16px; font-weight: 800; padding: 6px; border: 2px solid var(--accent-gold); background: #0f172a; color: #fff; border-radius: 6px;">
              <div style="font-size: 12px; color: #e2e8f0;">
                ${levelUpWizardState.rolledHp !== null ? `
                  <b>[${levelUpWizardState.rolledHp} no dado físico]</b> + ${conMod >= 0 ? '+' + conMod : conMod} CON ${bonusHp > 0 ? `+ ${bonusHp} (${bonusReason})` : ''} ➔ <b style="color: #34d399; font-size: 14px;">+${rolledGain} PV Máximo</b>
                ` : '<span style="color: var(--text-muted);">Digite o número tirado no dado físico da mesa</span>'}
              </div>
            </div>
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

  const existingSubName = found ? (found.subclass || (currentClasses.length === 1 ? p.subclass : '')) : '';
  const existingSubIdx = found ? (found.subclassIdx !== undefined ? found.subclassIdx : (currentClasses.length === 1 ? p.subclassIdx : 0)) : 0;
  levelUpWizardState.selectedSubclassIdx = resolveSubclassIndex(classKey, existingSubIdx, existingSubName);
  levelUpWizardState.subclassRespec = false;

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

function triggerLevelUpSubclassRespec() {
  levelUpWizardState.subclassRespec = true;
  renderLevelUpWizardStep();
}

function cancelLevelUpSubclassRespec() {
  levelUpWizardState.subclassRespec = false;
  renderLevelUpWizardStep();
}

function setLevelUpAsiMode(mode) {
  if (!levelUpWizardState.asi) levelUpWizardState.asi = {};
  levelUpWizardState.asi.mode = mode;
  renderLevelUpWizardStep();
}

function setLevelUpAsiSingle(attrKey) {
  if (!levelUpWizardState.asi) levelUpWizardState.asi = {};
  levelUpWizardState.asi.singleAttr = attrKey;
  renderLevelUpWizardStep();
}

function setLevelUpAsiDual(slotIdx, attrKey) {
  if (!levelUpWizardState.asi) levelUpWizardState.asi = {};
  if (slotIdx === 1) levelUpWizardState.asi.dualAttr1 = attrKey;
  if (slotIdx === 2) levelUpWizardState.asi.dualAttr2 = attrKey;
  renderLevelUpWizardStep();
}

function setLevelUpAsiFeat(featName) {
  if (!levelUpWizardState.asi) levelUpWizardState.asi = {};
  levelUpWizardState.asi.feat = featName;
}

function setLevelUpPhysicalRolledHp(val, dieSides) {
  const p = PLAYERS.find(x => x.id === levelUpWizardState.playerId);
  if (!p) return;
  const num = parseInt(val, 10);
  if (!isNaN(num) && num >= 1 && num <= dieSides) {
    levelUpWizardState.rolledHp = num;
  } else {
    levelUpWizardState.rolledHp = null;
  }
  const clsName = levelUpWizardState.selectedClassKey || levelUpWizardState.selectedClass;
  const conMod = Math.floor((getPlayerAttr(p, 'con') - 10) / 2);
  const bonusHp = (typeof getPlayerBonusHpPerLevel === 'function') ? getPlayerBonusHpPerLevel(p, clsName) : 0;
  levelUpWizardState.calculatedHpGain = levelUpWizardState.rolledHp !== null
    ? Math.max(1, levelUpWizardState.rolledHp + conMod + bonusHp)
    : Math.max(1, Math.floor(dieSides / 2) + 1 + conMod + bonusHp);
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
  if (levelUpWizardState.step === 2) {
    const clsName = levelUpWizardState.selectedClassKey || levelUpWizardState.selectedClass;
    const targetLvl = levelUpWizardState.targetClassLevel;
    if (isClassAsiLevel(clsName, targetLvl) && levelUpWizardState.asi) {
      if (levelUpWizardState.asi.mode === 'dual' && levelUpWizardState.asi.dualAttr1 === levelUpWizardState.asi.dualAttr2) {
        alert('⚠️ Regra D&D 5E: Escolha dois atributos distintos para a opção +1 / +1 (ou use a opção +2 em um único atributo).');
        return;
      }
    }
  }

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

  const clsData = typeof findClassData === 'function' ? findClassData(clsName) : null;
  const chosenSubName = (clsData && clsData.subclasses && clsData.subclasses[subIdx])
    ? clsData.subclasses[subIdx].name
    : '';

  // Atualiza ou adiciona a classe na lista de multiclasse
  const existingIdx = classesList.findIndex(c => c.className.toLowerCase() === clsName.toLowerCase());
  if (existingIdx >= 0) {
    classesList[existingIdx].level = targetLvl;
    classesList[existingIdx].subclassIdx = subIdx;
    if (chosenSubName) classesList[existingIdx].subclass = chosenSubName;
  } else {
    classesList.push({
      className: clsName,
      level: targetLvl,
      subclassIdx: subIdx,
      subclass: chosenSubName
    });
  }

  p.multiclass = classesList;
  p.level = classesList.reduce((sum, c) => sum + c.level, 0);

  // Se a classe evoluída for a principal (ou única), atualiza também no nível raiz do jogador
  if (classesList.length === 1 || classesList[0].className.toLowerCase() === clsName.toLowerCase()) {
    p.subclassIdx = subIdx;
    if (chosenSubName) {
      p.subclass = chosenSubName;
    }
  }

  // Atualiza string amigável de classes
  p.className = classesList.map(c => `${c.className} ${c.level}`).join(' / ');

  // Atualiza reserva de Dados de Vida combinados
  p.hitDice = classesList.map(c => `${c.level}${getHitDieForClass(c.className).replace(/^[0-9]+/, '')}`).join(' + ');

  // ================= APLICAÇÃO DE ASI (Aumento de Atributos) =================
  const isAsi = isClassAsiLevel(clsName, targetLvl);
  let asiSummaryLog = '';

  if (isAsi && levelUpWizardState.asi) {
    const asi = levelUpWizardState.asi;
    const oldCon = getPlayerAttr(p, 'con');
    const oldConMod = Math.floor((oldCon - 10) / 2);

    if (asi.mode === 'single') {
      const attr = asi.singleAttr || 'str';
      const curVal = getPlayerAttr(p, attr);
      const newVal = Math.min(20, curVal + 2);
      p[attr] = newVal;
      const attrLabel = { str: 'Força', dex: 'Destreza', con: 'Constituição', int: 'Inteligência', wis: 'Sabedoria', cha: 'Carisma' }[attr] || attr;
      asiSummaryLog = `📈 ASI: +2 em ${attrLabel} (${curVal} ➔ ${newVal})`;
    } else if (asi.mode === 'dual') {
      const a1 = asi.dualAttr1 || 'str';
      const a2 = asi.dualAttr2 || 'dex';
      const v1 = getPlayerAttr(p, a1);
      const v2 = getPlayerAttr(p, a2);
      const n1 = Math.min(20, v1 + 1);
      const n2 = Math.min(20, v2 + 1);
      p[a1] = n1;
      p[a2] = n2;
      const lbl = key => ({ str: 'Força', dex: 'Destreza', con: 'Constituição', int: 'Inteligência', wis: 'Sabedoria', cha: 'Carisma' }[key] || key);
      asiSummaryLog = `📈 ASI: +1 em ${lbl(a1)} (${v1} ➔ ${n1}) e +1 em ${lbl(a2)} (${v2} ➔ ${n2})`;
    } else if (asi.mode === 'feat') {
      const featName = asi.feat || 'Talento';
      if (!Array.isArray(p.features)) p.features = [];
      p.features.push(`Talento: ${featName}`);
      asiSummaryLog = `📜 Talento Adquirido: ${featName}`;
    }

    // Regra Oficial D&D 5E: Se o modificador de Constituição aumentar, concede PV retroativo para todos os níveis do personagem!
    const newCon = getPlayerAttr(p, 'con');
    const newConMod = Math.floor((newCon - 10) / 2);
    if (newConMod > oldConMod) {
      const retroHp = (newConMod - oldConMod) * p.level;
      p.maxHp = (p.maxHp || 10) + retroHp;
      p.hp = (p.hp || p.maxHp) + retroHp;
      asiSummaryLog += ` | 🛡️ +${retroHp} PV Retroativo (Aumento de Mod CON)`;
    }

    // Se Destreza ou Constituição mudaram, recalcula a CA
    if (typeof ensurePlayerCalculatedAc === 'function') {
      ensurePlayerCalculatedAc(p);
    }
  }

  // Cálculo de ganho de PV
  const hitDieStr = getHitDieForClass(clsName);
  const dieSides = getHitDieSides(hitDieStr);
  const conMod = Math.floor((getPlayerAttr(p, 'con') - 10) / 2);
  const bonusHp = (typeof getPlayerBonusHpPerLevel === 'function') ? getPlayerBonusHpPerLevel(p, clsName) : 0;
  const avgGain = Math.max(1, Math.floor(dieSides / 2) + 1 + conMod + bonusHp);
  const chosenGain = ((levelUpWizardState.hpMethod === 'roll' || levelUpWizardState.hpMethod === 'physical') && levelUpWizardState.rolledHp !== null)
    ? Math.max(1, levelUpWizardState.rolledHp + conMod + bonusHp)
    : avgGain;

  p.maxHp = (p.maxHp || 10) + chosenGain;
  p.hp = Math.min(p.maxHp, (p.hp || p.maxHp) + chosenGain); // Cura o ganho

  // Atualiza Espaços de Magia Multiclasse
  p.slots = calculateMulticlassSpellSlots(p);

  // Registra no histórico de ações e log
  const logMsg = `🎉 <b>${p.name}</b> subiu para o <b>Nível ${p.level}</b> (${p.className})! (+${chosenGain} PV Máximo)${asiSummaryLog ? `<br>${asiSummaryLog}` : ''}`;
  addLog(logMsg);
  addPlayerActionLog(p.id, '🔼', `Subiu de Nível: ${p.className} | +${chosenGain} PV (Max: ${p.maxHp})${asiSummaryLog ? ` | ${asiSummaryLog}` : ''}`, 'general');
  if (typeof playFX === 'function') playFX('crit');

  closeLevelUpModal();
  if (typeof touchPlayer === 'function') touchPlayer(p);
  renderPlayers();
  if (typeof renderCombat === 'function') renderCombat();
  if (typeof updatePlayerPortalBanner === 'function') updatePlayerPortalBanner();
  saveToLocalStorage();
  if (typeof syncLocalChangesToFirebase === 'function') syncLocalChangesToFirebase(true);
  if (typeof broadcastStateSync === 'function') broadcastStateSync();
}

// --- SISTEMA DE TROCA DIRETA DE ITENS ENTRE HERÓIS (TRADE DE MOCHILA) ---
let activeTradeContext = { donorId: null, itemIdx: null, maxQty: 1 };

function openTradeItemModal(donorId, itemIdx) {
  const donor = (typeof PLAYERS !== 'undefined') ? PLAYERS.find(p => p.id === donorId) : null;
  if (!donor || !donor.inventory || !donor.inventory[itemIdx]) return;

  const item = donor.inventory[itemIdx];
  const maxQty = parseInt(item.qty, 10) || 1;
  activeTradeContext = { donorId, itemIdx, maxQty };

  const modal = document.getElementById('modal-trade-item');
  const nameEl = document.getElementById('trade-item-name');
  const metaEl = document.getElementById('trade-item-meta');
  const iconEl = document.getElementById('trade-item-icon');
  const selReceiver = document.getElementById('sel-trade-receiver');
  const inpQty = document.getElementById('inp-trade-qty');

  if (nameEl) nameEl.innerText = item.name || 'Item';
  const tradeItemWeight = typeof formatCleanItemWeight === 'function' ? formatCleanItemWeight(item.weight) : (item.weight ? `${item.weight} kg` : '');
  if (metaEl) metaEl.innerText = `Doador: ${donor.name} • Disponível: ${maxQty}x ${tradeItemWeight ? `(${tradeItemWeight} cada)` : ''}`;
  if (iconEl) {
    const actionInfo = typeof getItemActionInfo === 'function' ? getItemActionInfo(item.name) : { icon: '🎒' };
    iconEl.innerText = actionInfo.icon || '🎒';
  }
  if (inpQty) {
    inpQty.value = 1;
    inpQty.max = maxQty;
  }

  // Preenche destinatários disponíveis (Baú Coletivo + todos os outros heróis)
  if (selReceiver) {
    const otherHeroes = (typeof PLAYERS !== 'undefined') ? PLAYERS.filter(p => p.id !== donorId) : [];
    let opts = '<option value="PARTY_STASH">🎒 Baú Coletivo do Grupo</option>';
    otherHeroes.forEach(h => {
      opts += `<option value="${h.id}">${h.name} (${h.student || 'Aluno'}) - ${h.className || ''}</option>`;
    });
    selReceiver.innerHTML = opts;
  }

  if (modal) modal.classList.add('open');
}

function closeTradeItemModal() {
  const modal = document.getElementById('modal-trade-item');
  if (modal) modal.classList.remove('open');
  activeTradeContext = { donorId: null, itemIdx: null, maxQty: 1 };
}

function adjustTradeQty(delta) {
  const inp = document.getElementById('inp-trade-qty');
  if (!inp) return;
  let cur = parseInt(inp.value, 10) || 1;
  cur = Math.max(1, Math.min(activeTradeContext.maxQty || 1, cur + delta));
  inp.value = cur;
}

function setTradeQtyMax() {
  const inp = document.getElementById('inp-trade-qty');
  if (inp) inp.value = activeTradeContext.maxQty || 1;
}

function confirmTradeItem() {
  if (!activeTradeContext.donorId || activeTradeContext.itemIdx === null) return;
  const selReceiver = document.getElementById('sel-trade-receiver');
  const inpQty = document.getElementById('inp-trade-qty');
  const receiverId = selReceiver ? selReceiver.value : null;
  const qty = inpQty ? Math.max(1, Math.min(activeTradeContext.maxQty, parseInt(inpQty.value, 10) || 1)) : 1;

  if (!receiverId) {
    alert('Por favor, selecione um destinatário para o item.');
    return;
  }

  if (receiverId === 'PARTY_STASH') {
    if (typeof sendPlayerItemToPartyStash === 'function') {
      sendPlayerItemToPartyStash(activeTradeContext.donorId, activeTradeContext.itemIdx, qty);
    }
    closeTradeItemModal();
    return;
  }

  transferPlayerItem(activeTradeContext.donorId, activeTradeContext.itemIdx, receiverId, qty);
  closeTradeItemModal();
}

function transferPlayerItem(donorId, itemIdx, receiverId, qty) {
  const donor = (typeof PLAYERS !== 'undefined') ? PLAYERS.find(p => p.id === donorId) : null;
  const receiver = (typeof PLAYERS !== 'undefined') ? PLAYERS.find(p => p.id === receiverId) : null;
  if (!donor || !donor.inventory || !donor.inventory[itemIdx] || !receiver) {
    return { success: false, error: 'Doador ou recebedor inválido' };
  }

  const it = donor.inventory[itemIdx];
  const itemQty = parseInt(it.qty, 10) || 1;
  const reqQty = parseInt(qty, 10) || 1;
  if (reqQty > itemQty || reqQty <= 0) {
    return { success: false, error: 'Quantidade indisponível para transferência' };
  }
  const transferQty = reqQty;
  const itemName = it.name;

  // Subtrai ou remove do doador
  if (itemQty <= transferQty) {
    donor.inventory.splice(itemIdx, 1);
  } else {
    it.qty = itemQty - transferQty;
  }
  touchPlayer(donor);

  // Adiciona ao recebedor (se já tiver item com mesmo nome, soma a quantidade)
  receiver.inventory = receiver.inventory || [];
  const existingIdx = receiver.inventory.findIndex(ri => (ri.name || '').toLowerCase() === (itemName || '').toLowerCase());
  if (existingIdx >= 0) {
    receiver.inventory[existingIdx].qty = (parseInt(receiver.inventory[existingIdx].qty, 10) || 1) + transferQty;
  } else {
    const newItem = Object.assign({}, it, {
      id: 'it_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      qty: transferQty,
      equipped: false
    });
    receiver.inventory.push(newItem);
  }
  touchPlayer(receiver);

  // Logs
  if (typeof addPlayerActionLog === 'function') {
    addPlayerActionLog(donor.id, '🤝', `Passou ${transferQty}x ${itemName} para ${receiver.name}`, 'general');
    addPlayerActionLog(receiver.id, '🤝', `Recebeu ${transferQty}x ${itemName} de ${donor.name}`, 'general');
  }
  if (typeof addLog === 'function') {
    addLog(`🤝 <b>Troca de Itens:</b> <b>${donor.name}</b> passou ${transferQty}x <b>${itemName}</b> para <b>${receiver.name}</b>.`);
  }
  if (typeof playFX === 'function') playFX('sword');

  if (typeof saveToLocalStorage === 'function') saveToLocalStorage();
  if (typeof syncLocalChangesToFirebase === 'function') syncLocalChangesToFirebase(true);
  if (typeof broadcastStateSync === 'function') broadcastStateSync();
  if (typeof renderPlayers === 'function') renderPlayers();
  if (typeof showToast === 'function') {
    showToast(`🤝 ${transferQty}x ${itemName} entregue para ${receiver.name}!`, 'success');
  }
  return { success: true, transferredQty: transferQty };
}

// --- EDIÇÃO DE ITENS DA MOCHILA DO HERÓI (ISSUE-156) ---
let activeEditPlayerItemContext = { playerId: null, itemIdx: null };

function openEditPlayerItemModal(playerId, itemIdx) {
  const p = (typeof PLAYERS !== 'undefined') ? PLAYERS.find(x => x.id === playerId) : null;
  if (!p || !p.inventory || !p.inventory[itemIdx]) return;
  const it = p.inventory[itemIdx];
  activeEditPlayerItemContext = { playerId, itemIdx };

  const modal = document.getElementById('modal-edit-player-item');
  if (!modal) return;

  const inpName = document.getElementById('inp-edit-pitem-name');
  const inpQty = document.getElementById('inp-edit-pitem-qty');
  const inpWeight = document.getElementById('inp-edit-pitem-weight');
  const inpCat = document.getElementById('inp-edit-pitem-cat');
  const inpCost = document.getElementById('inp-edit-pitem-cost');
  const inpDesc = document.getElementById('inp-edit-pitem-desc');

  if (inpName) inpName.value = it.name || '';
  if (inpQty) inpQty.value = parseInt(it.qty, 10) || 1;
  if (inpWeight) inpWeight.value = (it.weight !== undefined && !isNaN(parseFloat(it.weight))) ? parseFloat(it.weight) : 0;
  if (inpCat) inpCat.value = it.category || '';
  if (inpCost) inpCost.value = it.cost || '';
  if (inpDesc) inpDesc.value = it.desc || it.prop || '';

  modal.classList.add('open');
}

function closeEditPlayerItemModal() {
  const modal = document.getElementById('modal-edit-player-item');
  if (modal) modal.classList.remove('open');
  activeEditPlayerItemContext = { playerId: null, itemIdx: null };
}

function saveEditedPlayerItem() {
  const { playerId, itemIdx } = activeEditPlayerItemContext;
  if (!playerId || itemIdx === null) return;
  const p = (typeof PLAYERS !== 'undefined') ? PLAYERS.find(x => x.id === playerId) : null;
  if (!p || !p.inventory || !p.inventory[itemIdx]) return;
  const it = p.inventory[itemIdx];

  const name = document.getElementById('inp-edit-pitem-name')?.value.trim();
  if (!name) {
    alert('Por favor, informe o nome do item.');
    return;
  }
  const qty = Math.max(1, parseInt(document.getElementById('inp-edit-pitem-qty')?.value, 10) || 1);
  const weight = Math.max(0, parseFloat(document.getElementById('inp-edit-pitem-weight')?.value) || 0);
  const category = document.getElementById('inp-edit-pitem-cat')?.value.trim() || 'Equipamento';
  const cost = document.getElementById('inp-edit-pitem-cost')?.value.trim() || '-';
  const desc = document.getElementById('inp-edit-pitem-desc')?.value.trim() || '';

  it.name = name;
  it.qty = qty;
  it.weight = weight;
  it.category = category;
  it.cost = cost;
  it.desc = desc;

  touchPlayer(p);
  if (typeof renderPlayers === 'function') renderPlayers();
  if (typeof saveToLocalStorage === 'function') saveToLocalStorage();
  if (typeof syncLocalChangesToFirebase === 'function') syncLocalChangesToFirebase(true);
  if (typeof broadcastStateSync === 'function') broadcastStateSync();
  if (typeof showToast === 'function') showToast(`✏️ Item "${it.name}" atualizado com sucesso!`, 'success');
  closeEditPlayerItemModal();
}

// --- SISTEMA DE DISTRIBUIÇÃO DE SAQUE & XP EM LOTE (MESTRE) ---
let batchRewardSelectedHeroIds = new Set();

function openBatchRewardsModal() {
  const modal = document.getElementById('modal-batch-rewards');
  if (!modal) return;

  // Seleciona os heróis da mesa ativa (ou todos se nenhuma mesa filtrada) por padrão
  const targetPlayers = (typeof getCurrentlyFilteredPlayers === 'function' ? getCurrentlyFilteredPlayers() : (typeof PLAYERS !== 'undefined' ? PLAYERS : [])) || [];
  batchRewardSelectedHeroIds = new Set(targetPlayers.map(p => p.id));
  renderBatchRewardHeroList();

  const inpXp = document.getElementById('inp-batch-xp-total');
  const inpCp = document.getElementById('inp-batch-cp');
  const inpSp = document.getElementById('inp-batch-sp');
  const inpEp = document.getElementById('inp-batch-ep');
  const inpGp = document.getElementById('inp-batch-gp');
  const inpPp = document.getElementById('inp-batch-pp');

  if (inpXp) inpXp.value = '';
  if (inpCp) inpCp.value = '';
  if (inpSp) inpSp.value = '';
  if (inpEp) inpEp.value = '';
  if (inpGp) inpGp.value = '';
  if (inpPp) inpPp.value = '';

  updateBatchRewardCalculations();
  modal.classList.add('open');
}

function closeBatchRewardsModal() {
  const modal = document.getElementById('modal-batch-rewards');
  if (modal) modal.classList.remove('open');
}

function renderBatchRewardHeroList() {
  const container = document.getElementById('batch-reward-hero-list');
  if (!container) return;

  const heroes = (typeof PLAYERS !== 'undefined' && Array.isArray(PLAYERS)) ? PLAYERS : [];
  if (heroes.length === 0) {
    container.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; color: var(--text-muted); font-size: 11px; padding: 12px;">Nenhum herói cadastrado na mesa.</div>`;
    return;
  }

  container.innerHTML = heroes.map(h => {
    const isSelected = batchRewardSelectedHeroIds.has(h.id);
    const avatar = h.avatar || '👤';
    const isImg = typeof avatar === 'string' && (avatar.startsWith('http') || avatar.startsWith('data:image'));
    const avatarHtml = isImg
      ? `<img src="${avatar}" style="width: 30px; height: 30px; border-radius: 6px; object-fit: cover; border: 1px solid var(--border-color); flex-shrink: 0;">`
      : `<div style="width: 30px; height: 30px; border-radius: 6px; background: rgba(0,0,0,0.5); border: 1px solid var(--border-color); display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0;">${avatar}</div>`;

    return `
      <div class="reward-hero-chip ${isSelected ? 'selected' : ''}" onclick="toggleBatchRewardHero('${h.id}')" style="cursor: pointer; user-select: none;">
        <div style="display: flex; align-items: center; gap: 8px; flex: 1; min-width: 0;">
          <input type="checkbox" ${isSelected ? 'checked' : ''} onclick="event.stopPropagation(); toggleBatchRewardHero('${h.id}')" style="cursor: pointer; width: 16px; height: 16px; accent-color: var(--accent-gold); flex-shrink: 0;">
          ${avatarHtml}
          <div style="flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 1px;">
            <div style="display: flex; align-items: center; gap: 5px;">
              <b style="color: #fff; font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${h.name}</b>
              <span class="badge badge-lvl" style="font-size: 9px; padding: 1px 4px; flex-shrink: 0;">Nv ${h.level || 1}</span>
            </div>
            <div style="font-size: 10.5px; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
              👤 <span style="color: var(--primary-light); font-weight: 600;">${h.student || 'Aluno'}</span> • ${h.className || 'Aventureiro'}
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function toggleBatchRewardHero(heroId) {
  if (batchRewardSelectedHeroIds.has(heroId)) {
    batchRewardSelectedHeroIds.delete(heroId);
  } else {
    batchRewardSelectedHeroIds.add(heroId);
  }
  renderBatchRewardHeroList();
  updateBatchRewardCalculations();
}

function toggleAllBatchRewardHeroes(select) {
  if (select) {
    batchRewardSelectedHeroIds = new Set((typeof PLAYERS !== 'undefined' ? PLAYERS : []).map(p => p.id));
  } else {
    batchRewardSelectedHeroIds.clear();
  }
  renderBatchRewardHeroList();
  updateBatchRewardCalculations();
}

function selectCurrentCampaignBatchRewardHeroes() {
  const filtered = (typeof getCurrentlyFilteredPlayers === 'function')
    ? getCurrentlyFilteredPlayers()
    : ((typeof getFilteredPlayers === 'function') ? getFilteredPlayers() : (typeof PLAYERS !== 'undefined' ? PLAYERS : []));
  batchRewardSelectedHeroIds = new Set((filtered || []).map(p => p.id));
  renderBatchRewardHeroList();
  updateBatchRewardCalculations();
}

function setBatchXpQuick(amount) {
  const inpXp = document.getElementById('inp-batch-xp-total');
  if (!inpXp) return;
  const cur = parseInt(inpXp.value, 10) || 0;
  inpXp.value = cur + amount;
  updateBatchRewardCalculations();
}

function updateBatchRewardCalculations() {
  const n = batchRewardSelectedHeroIds.size;
  const inpXp = document.getElementById('inp-batch-xp-total');
  const inpGp = document.getElementById('inp-batch-gp');
  const xpBadge = document.getElementById('batch-xp-per-hero-badge');
  const goldBadge = document.getElementById('batch-gold-per-hero-badge');

  const totalXp = inpXp ? (parseInt(inpXp.value, 10) || 0) : 0;
  const totalGp = inpGp ? (parseInt(inpGp.value, 10) || 0) : 0;

  if (xpBadge) {
    const perHero = n > 0 ? Math.floor(totalXp / n) : 0;
    xpBadge.innerText = `${perHero.toLocaleString()} XP / herói (${n} selecionados)`;
  }
  if (goldBadge) {
    const perHero = n > 0 ? (Math.round((totalGp / n) * 10) / 10) : 0;
    goldBadge.innerText = `${perHero} PO / herói (${n} selecionados)`;
  }
}

function distributeBatchRewards(opts = null) {
  let selectedIds = batchRewardSelectedHeroIds;
  let totalXp = 0;
  let cp = 0, sp = 0, ep = 0, gp = 0, pp = 0;

  if (opts && typeof opts === 'object') {
    if (opts.recipientIds && Array.isArray(opts.recipientIds)) {
      selectedIds = new Set(opts.recipientIds);
    }
    totalXp = parseInt(opts.totalXp, 10) || 0;
    if (opts.coins) {
      cp = parseInt(opts.coins.cp, 10) || 0;
      sp = parseInt(opts.coins.sp, 10) || 0;
      ep = parseInt(opts.coins.ep, 10) || 0;
      gp = parseInt(opts.coins.gp, 10) || 0;
      pp = parseInt(opts.coins.pp, 10) || 0;
    }
  } else {
    const inpXp = document.getElementById('inp-batch-xp-total');
    const inpCp = document.getElementById('inp-batch-cp');
    const inpSp = document.getElementById('inp-batch-sp');
    const inpEp = document.getElementById('inp-batch-ep');
    const inpGp = document.getElementById('inp-batch-gp');
    const inpPp = document.getElementById('inp-batch-pp');

    totalXp = inpXp ? (parseInt(inpXp.value, 10) || 0) : 0;
    cp = inpCp ? (parseInt(inpCp.value, 10) || 0) : 0;
    sp = inpSp ? (parseInt(inpSp.value, 10) || 0) : 0;
    ep = inpEp ? (parseInt(inpEp.value, 10) || 0) : 0;
    gp = inpGp ? (parseInt(inpGp.value, 10) || 0) : 0;
    pp = inpPp ? (parseInt(inpPp.value, 10) || 0) : 0;
  }

  const n = selectedIds.size;
  if (n === 0) {
    if (!opts && typeof alert === 'function') alert('Por favor, selecione ao menos um aventureiro para receber as recompensas.');
    return { success: false, error: 'Nenhum aventureiro selecionado' };
  }

  if (totalXp === 0 && cp === 0 && sp === 0 && ep === 0 && gp === 0 && pp === 0) {
    if (!opts && typeof alert === 'function') alert('Preencha ao menos um valor de XP ou Moedas para distribuir.');
    return { success: false, error: 'Nenhum valor para distribuir' };
  }

  const xpShare = Math.floor(totalXp / n);
  const cpShare = Math.floor(cp / n);
  const spShare = Math.floor(sp / n);
  const epShare = Math.floor(ep / n);
  const gpShare = Math.floor(gp / n);
  const ppShare = Math.floor(pp / n);

  const rewardedNames = [];

  selectedIds.forEach(id => {
    const p = (typeof PLAYERS !== 'undefined') ? PLAYERS.find(x => x.id === id) : null;
    if (!p) return;

    rewardedNames.push(p.name);
    if (xpShare > 0) {
      p.xp = (p.xp || 0) + xpShare;
    }

    p.coins = p.coins || { cp: 0, sp: 0, ep: 0, gp: p.gold || 0, pp: 0 };
    if (cpShare > 0) p.coins.cp = (p.coins.cp || 0) + cpShare;
    if (spShare > 0) p.coins.sp = (p.coins.sp || 0) + spShare;
    if (epShare > 0) p.coins.ep = (p.coins.ep || 0) + epShare;
    if (gpShare > 0) p.coins.gp = (p.coins.gp || 0) + gpShare;
    if (ppShare > 0) p.coins.pp = (p.coins.pp || 0) + ppShare;
    p.gold = (p.coins.gp || 0);

    touchPlayer(p);

    if (typeof addPlayerActionLog === 'function') {
      const parts = [];
      if (xpShare > 0) parts.push(`+${xpShare} XP`);
      if (gpShare > 0) parts.push(`+${gpShare} PO`);
      if (spShare > 0) parts.push(`+${spShare} PP`);
      if (cpShare > 0) parts.push(`+${cpShare} PC`);
      addPlayerActionLog(p.id, '🎁', `Recompensa Coletiva: ${parts.join(', ')}`, 'xp');
    }
  });

  // Log geral
  if (typeof addLog === 'function') {
    const summary = [];
    if (totalXp > 0) summary.push(`<b>${totalXp} XP</b> (${xpShare}/herói)`);
    if (gp > 0) summary.push(`<b>${gp} PO</b>`);
    if (sp > 0) summary.push(`<b>${sp} PP</b>`);
    addLog(`🎁 <b>Recompensa da Turma:</b> Mestre distribuiu ${summary.join(' e ')} para ${n} heróis (${rewardedNames.slice(0, 3).join(', ')}${n > 3 ? '...' : ''})!`);
  }
  if (typeof playFX === 'function') playFX('crit');

  if (typeof saveToLocalStorage === 'function') saveToLocalStorage();
  if (typeof syncLocalChangesToFirebase === 'function') syncLocalChangesToFirebase(true);
  if (typeof broadcastStateSync === 'function') broadcastStateSync();
  if (typeof renderPlayers === 'function') renderPlayers();
  closeBatchRewardsModal();

  if (typeof showToast === 'function') {
    showToast(`🎁 Recompensas distribuídas com sucesso para ${n} heróis!`, 'success');
  }
  return { success: true, count: n, xpShare, gpShare };
}

// --- MODAL DE COMBATE E INICIATIVA PARA O PORTAL DO JOGADOR ---
function openPlayerCombatModal() {
  const modal = document.getElementById('modal-player-combat');
  if (!modal) return;
  modal.classList.add('active');
  renderPlayerCombatModalContent();
}

function closePlayerCombatModal() {
  const modal = document.getElementById('modal-player-combat');
  if (modal) modal.classList.remove('active');
}

function renderPlayerCombatModalContent() {
  const listEl = document.getElementById('player-combat-list');
  const roundEl = document.getElementById('player-combat-round-badge');
  if (!listEl) return;

  if (typeof state === 'undefined' || !state || !Array.isArray(state.combatants) || state.combatants.length === 0) {
    if (roundEl) roundEl.innerText = 'Nenhum combate em andamento';
    listEl.innerHTML = `
      <div style="text-align: center; padding: 40px 20px; color: var(--text-muted);">
        <div style="font-size: 38px; margin-bottom: 12px; opacity: 0.6;">⚔️</div>
        <div style="font-size: 15px; font-weight: 700; margin-bottom: 6px; color: var(--text-primary);">Nenhum Combate Ativo</div>
        <div style="font-size: 13px;">O Mestre ainda não iniciou uma cena de combate ou iniciativa. Quando a batalha começar, você verá a ordem dos turnos aqui em tempo real!</div>
      </div>
    `;
    return;
  }

  if (roundEl) {
    roundEl.innerText = `Rodada ${state.round || 1} • Turno ${(state.turn || 0) + 1}/${state.combatants.length}`;
  }

  const curTurnIdx = state.turn || 0;
  const activeChar = (typeof activePortalPlayerId !== 'undefined') ? PLAYERS.find(p => p.id === activePortalPlayerId) : null;

  let html = `<div style="display: flex; flex-direction: column; gap: 8px;">`;

  state.combatants.forEach((c, idx) => {
    const isActive = idx === curTurnIdx;
    const isMe = (activeChar && ((c.playerId && c.playerId === activeChar.id) || c.id === activeChar.id || String(c.name || '').includes(activeChar.name)));
    const isAlly = c.type === 'player';

    // Determina exibição de PV
    let hpDisplay = '';
    let hpPercent = 100;
    if (c.maxHp > 0) {
      hpPercent = Math.max(0, Math.min(100, Math.round(((c.hp || 0) / c.maxHp) * 100)));
    }

    if (isAlly || isMe) {
      hpDisplay = `<span style="font-weight: 700; color: ${hpPercent < 25 ? 'var(--danger)' : (hpPercent < 50 ? 'var(--accent-gold)' : 'var(--success)')};">${c.hp || 0}/${c.maxHp || 10} PV</span>`;
    } else {
      // Para monstros / inimigos: exibe status narrativo em vez de número exato
      let statusText = '🟢 Saudável';
      let statusColor = 'var(--success)';
      if (hpPercent <= 0) {
        statusText = '💀 Derrotado';
        statusColor = 'var(--text-muted)';
      } else if (hpPercent < 25) {
        statusText = '🔴 Quase Derrotado';
        statusColor = 'var(--danger)';
      } else if (hpPercent < 50) {
        statusText = '🟡 Ferido';
        statusColor = 'var(--accent-gold)';
      }
      hpDisplay = `<span style="font-size: 11px; font-weight: 700; color: ${statusColor};">${statusText}</span>`;
    }

    const conditionsBadges = (c.conditions && c.conditions.length > 0)
      ? `<div style="display: flex; flex-wrap: wrap; gap: 3px; margin-top: 4px;">${c.conditions.map(cond => `<span class="condition-badge" style="font-size: 10px; padding: 1px 6px;">${cond}</span>`).join('')}</div>`
      : '';

    html += `
      <div class="player-combat-card ${isActive ? 'active-turn' : ''} ${isMe ? 'is-me' : ''}">
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 10px;">
          <div style="display: flex; align-items: center; gap: 10px; min-width: 0;">
            <div style="display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 50%; background: ${isActive ? 'var(--accent-gold)' : 'rgba(255,255,255,0.06)'}; color: ${isActive ? '#000' : 'var(--text-muted)'}; font-weight: 800; font-size: 12px; flex-shrink: 0;">
              ${idx + 1}
            </div>
            <div style="min-width: 0;">
              <div style="font-weight: 700; font-size: 13px; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: flex; align-items: center; gap: 6px;">
                <span>${c.name}</span>
                ${isMe ? `<span style="background: var(--accent-gold); color: #000; font-size: 9px; font-weight: 800; padding: 1px 5px; border-radius: 4px;">VOCÊ</span>` : ''}
                ${isActive ? `<span style="background: var(--danger); color: #fff; font-size: 9px; font-weight: 800; padding: 1px 5px; border-radius: 4px; animation: pulseGlow 1.5s infinite;">TURNO ATUAL</span>` : ''}
              </div>
              <div style="font-size: 11px; color: var(--text-muted);">
                Iniciativa: <b>${c.init !== undefined ? c.init : '-'}</b> ${c.ac ? `• CA: <b>${c.ac}</b>` : ''}
              </div>
            </div>
          </div>
          <div style="text-align: right; flex-shrink: 0;">
            ${hpDisplay}
            <div style="width: 70px; height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; margin-top: 4px; overflow: hidden;">
              <div style="width: ${hpPercent}%; height: 100%; background: ${hpPercent < 25 ? 'var(--danger)' : (hpPercent < 50 ? 'var(--accent-gold)' : 'var(--success)')}; transition: width 0.3s ease;"></div>
            </div>
          </div>
        </div>
        ${conditionsBadges}
      </div>
    `;
  });

  html += `</div>`;
  listEl.innerHTML = html;
}

// --- GERENCIADOR DE CLASSES & MULTICLASSE (D&D 5E) ---
let editingClassesPlayerId = null;
let workingClassesList = [];

function openPlayerClassesModal(playerId) {
  if (!playerId) {
    const pmId = document.getElementById('pm-id')?.value;
    playerId = pmId;
  }
  const p = PLAYERS.find(x => x.id === playerId);
  if (!p) return;

  editingClassesPlayerId = playerId;
  const current = getPlayerClassesList(p);
  workingClassesList = JSON.parse(JSON.stringify(current));
  if (workingClassesList.length === 0) {
    workingClassesList = [{ className: p.className || 'Guerreiro', level: p.level || 1, subclassIdx: p.subclassIdx || 0, subclass: p.subclass || '' }];
  }

  const modal = document.getElementById('modal-player-classes');
  if (!modal) return;

  const subtitle = document.getElementById('mc-modal-player-subtitle');
  if (subtitle) {
    subtitle.innerHTML = `Configurando classes de <b>${escapeAttr(p.name)}</b> (${escapeAttr(p.student || 'Jogador')})`;
  }

  renderPlayerClassesModalContent();
  modal.classList.add('open');
}

function closePlayerClassesModal() {
  const modal = document.getElementById('modal-player-classes');
  if (modal) modal.classList.remove('open');
  editingClassesPlayerId = null;
  workingClassesList = [];
}

function renderPlayerClassesModalContent() {
  const container = document.getElementById('mc-classes-container');
  if (!container) return;

  const availableClasses = (typeof CLASSES_DATA !== 'undefined') ? CLASSES_DATA : [];

  let html = '';
  workingClassesList.forEach((clsItem, idx) => {
    const clsData = (typeof findClassData === 'function' ? findClassData(clsItem.className) : null) || availableClasses.find(c => c.name.toLowerCase() === (clsItem.className || '').toLowerCase()) || availableClasses[0];
    const reqSubLvl = typeof getSubclassUnlockLevel === 'function' ? getSubclassUnlockLevel(clsItem.className) : 3;
    const hasSubclassUnlocked = (clsItem.level || 1) >= reqSubLvl;
    const subclasses = (clsData && clsData.subclasses) ? clsData.subclasses : [];

    html += `
      <div class="multiclass-row-card" style="background:#0f172a; border:1px solid var(--border-color); border-radius:8px; padding:10px; display:flex; flex-direction:column; gap:8px;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:20px;">${clsData ? clsData.icon : '⚔️'}</span>
            <span style="font-weight:800; color:#fff; font-size:13px;">Classe ${idx + 1}${idx === 0 ? ' (Principal)' : ' (Multiclasse)'}</span>
          </div>
          ${workingClassesList.length > 1 ? `
            <button class="btn-micro" type="button" onclick="removePlayerClassRow(${idx})" style="color:#f87171; border-color:rgba(248,113,113,0.3);" title="Remover esta classe">🗑️ Remover</button>
          ` : ''}
        </div>

        <div style="display:grid; grid-template-columns: 2fr 1fr 2fr; gap:8px; align-items:flex-end;">
          <div>
            <label style="font-size:10px; color:var(--text-muted); font-weight:700;">Classe D&D 5E</label>
            <select class="filter-select" style="width:100%; font-size:12px; font-weight:700;" onchange="updatePlayerClassRow(${idx}, 'className', this.value)">
              ${availableClasses.map(c => `
                <option value="${c.name}" ${c.name.toLowerCase() === (clsItem.className || '').toLowerCase() ? 'selected' : ''}>
                  ${c.icon} ${c.name}
                </option>
              `).join('')}
            </select>
          </div>

          <div>
            <label style="font-size:10px; color:var(--text-muted); font-weight:700;">Nível (1-20)</label>
            <input type="number" min="1" max="20" value="${clsItem.level || 1}" class="filter-input" style="width:100%; font-weight:800; text-align:center;" oninput="updatePlayerClassRow(${idx}, 'level', parseInt(this.value) || 1)">
          </div>

          <div>
            <label style="font-size:10px; color:var(--text-muted); font-weight:700;">Subclasse ${hasSubclassUnlocked ? `<span style="color:var(--accent-gold);">(Nv ${reqSubLvl}+)</span>` : `<span style="color:#94a3b8;">(Desbloqueia Nv ${reqSubLvl})</span>`}</label>
            ${hasSubclassUnlocked && subclasses.length > 0 ? `
              <select class="filter-select" style="width:100%; font-size:11px;" onchange="updatePlayerClassRow(${idx}, 'subclassIdx', parseInt(this.value))">
                ${subclasses.map((s, sIdx) => `
                  <option value="${sIdx}" ${sIdx === (clsItem.subclassIdx || 0) ? 'selected' : ''}>
                    ${s.name}
                  </option>
                `).join('')}
              </select>
            ` : `
              <input type="text" disabled value="Disponível no Nível ${reqSubLvl}" style="width:100%; font-size:10px; color:#64748b; background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.05); padding:6px; border-radius:4px;">
            `}
          </div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;

  const totalLevel = workingClassesList.reduce((sum, c) => sum + (c.level || 1), 0);
  const hitDiceParts = workingClassesList.map(c => `${c.level || 1}${getHitDieForClass(c.className).replace(/^[0-9]+/, '')}`).join(' + ');
  const prof = typeof getProfBonus === 'function' ? getProfBonus(totalLevel) : Math.ceil(totalLevel / 4) + 1;

  const lvlEl = document.getElementById('mc-summary-level');
  if (lvlEl) lvlEl.innerText = `Nv ${totalLevel}`;
  const hdEl = document.getElementById('mc-summary-hitdice');
  if (hdEl) hdEl.innerText = hitDiceParts;
  const profEl = document.getElementById('mc-summary-prof');
  if (profEl) profEl.innerText = `+${prof}`;
}

function addPlayerClassRow() {
  const availableClasses = (typeof CLASSES_DATA !== 'undefined') ? CLASSES_DATA : [];
  const existingNames = workingClassesList.map(c => (c.className || '').toLowerCase());
  const unused = availableClasses.find(c => !existingNames.includes(c.name.toLowerCase())) || availableClasses[0];
  const newClassName = unused ? unused.name : 'Guerreiro';

  workingClassesList.push({
    className: newClassName,
    level: 1,
    subclassIdx: 0,
    subclass: ''
  });
  renderPlayerClassesModalContent();
}

function removePlayerClassRow(idx) {
  if (workingClassesList.length <= 1) {
    if (typeof showToast === 'function') showToast('O personagem deve ter pelo menos uma classe.', 'warn');
    return;
  }
  workingClassesList.splice(idx, 1);
  renderPlayerClassesModalContent();
}

function updatePlayerClassRow(idx, field, value) {
  if (!workingClassesList[idx]) return;
  workingClassesList[idx][field] = value;
  if (field === 'className') {
    workingClassesList[idx].subclassIdx = 0;
    const clsData = typeof findClassData === 'function' ? findClassData(value) : null;
    if (clsData && clsData.subclasses && clsData.subclasses[0]) {
      workingClassesList[idx].subclass = clsData.subclasses[0].name;
    } else {
      workingClassesList[idx].subclass = '';
    }
  } else if (field === 'subclassIdx') {
    const clsData = typeof findClassData === 'function' ? findClassData(workingClassesList[idx].className) : null;
    if (clsData && clsData.subclasses && clsData.subclasses[value]) {
      workingClassesList[idx].subclass = clsData.subclasses[value].name;
    }
  }
  renderPlayerClassesModalContent();
}

function savePlayerClassesModal() {
  if (!editingClassesPlayerId) return;
  const p = PLAYERS.find(x => x.id === editingClassesPlayerId);
  if (!p) return;

  if (workingClassesList.length === 0) {
    if (typeof showToast === 'function') showToast('Adicione ao menos uma classe.', 'warn');
    return;
  }

  workingClassesList.forEach(c => {
    c.level = Math.max(1, Math.min(20, parseInt(c.level, 10) || 1));
    c.subclassIdx = parseInt(c.subclassIdx, 10) || 0;
    const clsData = typeof findClassData === 'function' ? findClassData(c.className) : null;
    if (clsData && clsData.subclasses && clsData.subclasses[c.subclassIdx]) {
      c.subclass = clsData.subclasses[c.subclassIdx].name;
    }
  });

  p.multiclass = JSON.parse(JSON.stringify(workingClassesList));
  p.level = workingClassesList.reduce((sum, c) => sum + c.level, 0);

  if (workingClassesList.length === 1) {
    p.className = workingClassesList[0].className;
    p.subclassIdx = workingClassesList[0].subclassIdx;
    p.subclass = workingClassesList[0].subclass || '';
  } else {
    p.className = workingClassesList.map(c => `${c.className} ${c.level}`).join(' / ');
    p.subclassIdx = workingClassesList[0].subclassIdx;
    p.subclass = workingClassesList[0].subclass || '';
  }

  p.hitDice = workingClassesList.map(c => `${c.level}${getHitDieForClass(c.className).replace(/^[0-9]+/, '')}`).join(' + ');
  p.slots = calculateMulticlassSpellSlots(p);
  ensurePlayerCalculatedAc(p);

  const pmId = document.getElementById('pm-id')?.value;
  if (pmId === p.id) {
    const classInp = document.getElementById('pm-class');
    if (classInp) classInp.value = p.className;
    const lvlInp = document.getElementById('pm-level');
    if (lvlInp) lvlInp.value = p.level;
    const hdInp = document.getElementById('pm-hitdice');
    if (hdInp) hdInp.value = p.hitDice;
    updateModalCalculatedAc();
  }

  addPlayerActionLog(p.id, '🎭', `Classes atualizadas: ${p.className} (Nível Total ${p.level})`, 'general');
  addLog(`🎭 <b>${p.name}</b> teve suas classes atualizadas para <b>${p.className}</b> (Nível Total ${p.level})`);

  if (typeof touchPlayer === 'function') touchPlayer(p);
  renderPlayers();
  if (typeof renderCombat === 'function') renderCombat();
  saveToLocalStorage();
  if (typeof syncLocalChangesToFirebase === 'function') syncLocalChangesToFirebase(true);
  if (typeof broadcastStateSync === 'function') broadcastStateSync();

  closePlayerClassesModal();
  if (typeof showToast === 'function') showToast(`Classes de ${p.name} salvas com sucesso!`, 'success');
}

// ============================================================================
// ⭐ D&D 5E FEATS (TALENTOS) & SISTEMA OFICIAL DE ASI (ISSUE-124)
// ============================================================================

function getPlayerFeats(p) {
  if (!p) return [];
  if (!Array.isArray(p.feats)) {
    p.feats = [];
  }
  return p.feats.map(entry => {
    if (typeof entry === 'string') {
      const f = (typeof findFeatByName === 'function') ? findFeatByName(entry) : null;
      return f ? {
        id: f.id,
        name: f.name,
        nameEn: f.nameEn,
        icon: f.icon,
        category: f.category,
        summary: f.summary,
        benefits: f.benefits,
        prereq: f.prereq,
        statBonus: f.statBonus,
        initiativeBonus: f.initiativeBonus,
        hpPerLevel: f.hpPerLevel,
        source: 'master'
      } : {
        id: entry.toLowerCase().replace(/\s+/g, '_'),
        name: entry,
        nameEn: '',
        icon: '📜',
        category: 'Geral',
        summary: '',
        benefits: [],
        prereq: 'Nenhum',
        source: 'master'
      };
    }
    const f = (typeof findFeatById === 'function') ? findFeatById(entry.id) : null;
    return {
      id: entry.id,
      name: entry.name || (f ? f.name : entry.id),
      nameEn: entry.nameEn || (f ? f.nameEn : ''),
      icon: (f ? f.icon : '📜') || '📜',
      category: (f ? f.category : 'Geral') || 'Geral',
      summary: (f ? f.summary : '') || '',
      benefits: (f ? f.benefits : []) || [],
      prereq: (f ? f.prereq : 'Nenhum') || 'Nenhum',
      statBonus: (f ? f.statBonus : null),
      initiativeBonus: (f ? f.initiativeBonus : null),
      hpPerLevel: (f ? f.hpPerLevel : null),
      source: entry.source || 'master',
      level: entry.level || 1,
      chosenStat: entry.chosenStat || null,
      grantedAt: entry.grantedAt || null
    };
  });
}

function hasPlayerFeat(p, featIdOrName) {
  if (!p) return false;
  const target = String(featIdOrName || '').toLowerCase().trim();
  const feats = getPlayerFeats(p);
  const found = feats.some(f =>
    f.id.toLowerCase() === target ||
    f.name.toLowerCase() === target ||
    (f.nameEn && f.nameEn.toLowerCase() === target)
  );
  if (found) return true;

  // Checagem em features legadas caso exista formato texto "Talento: Alerta"
  if (Array.isArray(p.features)) {
    return p.features.some(ft => typeof ft === 'string' && ft.toLowerCase().includes(target));
  } else if (typeof p.features === 'string') {
    return p.features.toLowerCase().includes(target);
  }
  return false;
}

function getPlayerInitiativeBonus(p) {
  if (!p) return 0;
  const dexMod = Math.floor(((p.dex !== undefined ? p.dex : 10) - 10) / 2);
  const hasAlert = hasPlayerFeat(p, 'alerta') || hasPlayerFeat(p, 'alert');
  return dexMod + (hasAlert ? 5 : 0);
}

function rollPlayerInit(id, customD20) {
  const p = PLAYERS.find(x => x.id === id);
  if (!p) return null;

  if (customD20 === undefined && p.diceMode === 'physical') {
    if (typeof openPhysicalD20Modal === 'function') {
      openPhysicalD20Modal({
        playerId: id,
        type: 'init',
        title: `🎲 Iniciativa Física: ${p.name}`,
        subtitle: `Rolagem de Iniciativa (d20 real)`
      });
      return null;
    }
  }

  const dexMod = Math.floor(((p.dex !== undefined ? p.dex : 10) - 10) / 2);
  const hasAlert = hasPlayerFeat(p, 'alerta') || hasPlayerFeat(p, 'alert');
  const totalMod = dexMod + (hasAlert ? 5 : 0);

  const r = (customD20 !== null && customD20 !== undefined) ? parseInt(customD20, 10) : (Math.floor(Math.random() * 20) + 1);
  const total = r + totalMod;

  const physicalTag = (customD20 !== null && customD20 !== undefined) ? ' 🎲(Mesa)' : '';
  const breakdown = `d20 [${r}${physicalTag}] ${dexMod >= 0 ? '+' : ''}${dexMod}${hasAlert ? ' +5 [Alerta]' : ''}`;

  const banner = document.getElementById('dice-banner');
  if (banner) {
    banner.style.display = 'block';
    const totalEl = document.getElementById('dice-total-number');
    const bkdEl = document.getElementById('dice-breakdown-text');
    if (totalEl) totalEl.innerText = total;
    if (bkdEl) bkdEl.innerText = `${p.name} - Iniciativa: ${breakdown}`;
  }

  if (typeof playFX === 'function') {
    if (r === 20) playFX('crit');
    else if (r === 1) playFX('fumble');
    else playFX('dice');
  }

  // Sincroniza diretamente na tabela de combate caso exista o combatente
  if (typeof state !== 'undefined' && Array.isArray(state.combatants)) {
    const comb = state.combatants.find(c => (c.playerId && c.playerId === p.id) || (c.type === 'player' && c.name.includes(p.name)));
    if (comb) {
      comb.init = total;
      if (typeof sortCombatantsByInit === 'function') sortCombatantsByInit();
      if (typeof renderCombat === 'function') renderCombat();
    }
  }

  if (typeof addLog === 'function') {
    addLog(`🎲 <b>${p.name}</b> rolou <b>Iniciativa</b>${physicalTag}: <b>${total}</b> (${breakdown})`);
  }
  if (typeof addPlayerActionLog === 'function') {
    addPlayerActionLog(p.id, '⚡', `Iniciativa${physicalTag}: Total ${total} (${breakdown})`, 'check');
  }

  renderPlayers();
  return { d20: r, total, totalMod, dexMod, hasAlert };
}

function grantFeatToPlayer(playerId, featId, options = {}) {
  const p = PLAYERS.find(x => x.id === playerId);
  if (!p) {
    alert('Personagem não encontrado.');
    return false;
  }
  const f = typeof findFeatById === 'function' ? findFeatById(featId) : null;
  if (!f) {
    alert('Talento não encontrado no acervo oficial.');
    return false;
  }

  p.feats = p.feats || [];

  // Checa se já possui
  const existing = p.feats.find(item => (typeof item === 'string' ? item.toLowerCase() === f.id.toLowerCase() : item.id === f.id));
  if (existing && f.id !== 'adepto_elemental') {
    alert(`O personagem ${p.name} já possui o talento "${f.name}".`);
    return false;
  }

  // Aplicação mecânica de bônus imediatos
  // 1. Half-Feat: aumento de atributo
  let chosenStat = options.chosenStat || null;
  if (f.statBonus && f.statBonus.choice && f.statBonus.choice.length > 0) {
    if (!chosenStat) {
      if (f.statBonus.choice.length === 1) {
        chosenStat = f.statBonus.choice[0];
      } else {
        const choiceLabels = f.statBonus.choice.map(s => s.toUpperCase()).join(' ou ');
        const promptChoice = prompt(`Este talento concede +${f.statBonus.amount || 1} em um atributo (${choiceLabels}).\nDigite o atributo desejado:`, f.statBonus.choice[0]);
        if (promptChoice && f.statBonus.choice.includes(promptChoice.toLowerCase().trim())) {
          chosenStat = promptChoice.toLowerCase().trim();
        } else {
          chosenStat = f.statBonus.choice[0];
        }
      }
    }

    if (chosenStat && p[chosenStat] !== undefined) {
      const oldVal = p[chosenStat];
      const newVal = Math.min(20, oldVal + (f.statBonus.amount || 1));
      p[chosenStat] = newVal;

      // Se Constituição aumentou, concede PV retroativo
      if (chosenStat === 'con') {
        const oldMod = Math.floor((oldVal - 10) / 2);
        const newMod = Math.floor((newVal - 10) / 2);
        if (newMod > oldMod) {
          const retroHp = (newMod - oldMod) * (p.level || 1);
          p.maxHp = (p.maxHp || 10) + retroHp;
          p.hp = (p.hp || p.maxHp) + retroHp;
        }
      }
      if (chosenStat === 'dex' || chosenStat === 'con') {
        if (typeof ensurePlayerCalculatedAc === 'function') ensurePlayerCalculatedAc(p);
      }
    }
  }

  // 2. Robusto (+2 PV por nível)
  if (f.id === 'robusto') {
    const extraHp = (p.level || 1) * 2;
    p.maxHp = (p.maxHp || 10) + extraHp;
    p.hp = (p.hp || p.maxHp) + extraHp;
  }

  // Registra no histórico do herói
  p.feats.push({
    id: f.id,
    name: f.name,
    nameEn: f.nameEn,
    source: options.source || 'master',
    level: options.level || p.level || 1,
    chosenStat: chosenStat,
    grantedAt: new Date().toISOString()
  });

  if (typeof touchPlayer === 'function') touchPlayer(p);
  if (typeof saveToLocalStorage === 'function') saveToLocalStorage();
  if (typeof syncLocalChangesToFirebase === 'function') syncLocalChangesToFirebase();
  if (typeof broadcastStateSync === 'function') broadcastStateSync();

  if (typeof addLog === 'function') {
    addLog(`⭐ <b>${p.name}</b> adquiriu o talento <b>${f.name}</b> (${f.nameEn})!`);
  }
  if (typeof addPlayerActionLog === 'function') {
    addPlayerActionLog(p.id, '⭐', `Talento adquirido: ${f.name}`, 'level');
  }
  if (typeof playFX === 'function') playFX('level');

  renderPlayers();
  if (typeof renderCombat === 'function') renderCombat();
  return true;
}

function removeFeatFromPlayer(playerId, featId) {
  const p = PLAYERS.find(x => x.id === playerId);
  if (!p || !Array.isArray(p.feats)) return false;

  const idx = p.feats.findIndex(item => (typeof item === 'string' ? item.toLowerCase() === featId.toLowerCase() : item.id === featId));
  if (idx < 0) return false;

  const item = p.feats[idx];
  const featName = typeof item === 'string' ? item : item.name;

  // Reverte bônus mecânicos
  if (featId === 'robusto') {
    const extraHp = (p.level || 1) * 2;
    p.maxHp = Math.max(1, (p.maxHp || 10) - extraHp);
    p.hp = Math.min(p.maxHp, p.hp);
  }
  if (typeof item === 'object' && item.chosenStat && p[item.chosenStat] !== undefined) {
    p[item.chosenStat] = Math.max(1, p[item.chosenStat] - 1);
    if (item.chosenStat === 'dex' || item.chosenStat === 'con') {
      if (typeof ensurePlayerCalculatedAc === 'function') ensurePlayerCalculatedAc(p);
    }
  }

  p.feats.splice(idx, 1);
  if (typeof touchPlayer === 'function') touchPlayer(p);
  if (typeof saveToLocalStorage === 'function') saveToLocalStorage();
  if (typeof syncLocalChangesToFirebase === 'function') syncLocalChangesToFirebase();
  if (typeof broadcastStateSync === 'function') broadcastStateSync();

  if (typeof addLog === 'function') {
    addLog(`🗑️ O talento <b>${featName}</b> foi removido de <b>${p.name}</b>.`);
  }

  renderPlayers();
  return true;
}

function openFeatDetailModal(featId) {
  const f = (typeof findFeatById === 'function') ? findFeatById(featId) : ((typeof findFeatByName === 'function') ? findFeatByName(featId) : null);
  if (!f) return;

  const modal = document.getElementById('modal-skill-detail');
  if (!modal) return;

  const iconEl = document.getElementById('skill-modal-icon');
  if (iconEl) iconEl.innerText = f.icon || '⭐';

  const titleEl = document.getElementById('skill-modal-title');
  if (titleEl) titleEl.innerText = f.name;

  const metaEl = document.getElementById('skill-modal-meta');
  if (metaEl) {
    metaEl.innerHTML = `
      <span>⭐ Talento Oficial D&D 5E</span>
      <span>•</span>
      <span>${f.nameEn || ''}</span>
      <span>•</span>
      <span style="color: var(--accent-gold);">${f.category}</span>
    `;
  }

  const typeEl = document.getElementById('skill-modal-type');
  if (typeEl) {
    typeEl.className = 'skill-tag-pill gold';
    typeEl.innerText = f.prereq && f.prereq.toLowerCase() !== 'nenhum' ? `⚠️ Pré-requisito: ${f.prereq}` : '✅ Sem pré-requisito';
  }

  const descContainer = document.getElementById('skill-modal-desc');
  if (descContainer) {
    let topicsHtml = (f.benefits || []).map(b => `<li style="margin-bottom: 6px;">${typeof highlightInlineRules === 'function' ? highlightInlineRules(b) : b}</li>`).join('');
    descContainer.innerHTML = `
      <div class="skill-concept-box" style="margin-bottom: 12px; font-size: 13px; line-height: 1.5; color: #f1f5f9;">
        ${f.summary}
      </div>
      <div style="font-weight: 700; color: #facc15; font-size: 12px; margin-bottom: 6px; text-transform: uppercase;">
        ⚡ Benefícios & Regras Oficiais:
      </div>
      <ul style="padding-left: 20px; font-size: 12px; color: #cbd5e1; line-height: 1.6;">
        ${topicsHtml}
      </ul>
    `;
  }

  modal.classList.add('open');
}

function renderPlayerFeatsSection(p, textFilter = '', isExpandedAll = false, openItemsSet = null) {
  let feats = getPlayerFeats(p);
  if (feats.length === 0) {
    return `
      <div class="player-no-feats-box" style="background: rgba(15, 23, 42, 0.4); border: 1px dashed rgba(255,255,255,0.08); border-radius: 8px; padding: 10px 14px; display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
        <span style="font-size: 20px;">⭐</span>
        <div>
          <b style="color: #cbd5e1; font-size: 12px;">Nenhum talento adquirido</b>
          <p style="margin: 2px 0 0 0; font-size: 10.5px; color: #64748b;">
            Adquira talentos ao evoluir níveis de classe (ASI) ou receba bênçãos narrativas concedidas pelo Mestre da mesa.
          </p>
        </div>
      </div>
    `;
  }

  if (textFilter) {
    const q = textFilter.toLowerCase();
    feats = feats.filter(f => {
      const nameMatches = (f.name || '').toLowerCase().includes(q);
      const catMatches = (f.category || '').toLowerCase().includes(q);
      const summaryMatches = (f.summary || (f.benefits && f.benefits[0]) || '').toLowerCase().includes(q);
      return nameMatches || catMatches || summaryMatches;
    });
    if (feats.length === 0) {
      return `<div style="font-size: 11px; color: var(--text-dim); font-style: italic; padding: 6px 4px; margin-bottom: 8px;">Nenhum talento correspondente à busca.</div>`;
    }
  }

  return `
    <div class="player-feats-cards-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 8px; margin-bottom: 12px;">
      ${feats.map(f => {
    let tag = '';
    if (f.chosenStat) tag = `<span class="feat-badge-pill purple">+1 ${f.chosenStat.toUpperCase()}</span>`;
    else if (f.initiativeBonus) tag = `<span class="feat-badge-pill gold">+${f.initiativeBonus} Init</span>`;
    else if (f.hpPerLevel) tag = `<span class="feat-badge-pill green">+2 PV/nv</span>`;

    return `
          <div class="player-feat-card" onclick="openFeatDetailModal('${f.id}')" title="Clique para ler regras completas" style="background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(250, 204, 21, 0.25); border-left: 3px solid #facc15; border-radius: 8px; padding: 8px 10px; cursor: pointer; transition: all 0.2s;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 6px;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 18px;">${f.icon}</span>
                <div>
                  <b style="color: #fff; font-size: 12px;">${f.name}</b>
                  <div style="font-size: 9.5px; color: #94a3b8;">${f.category} ${tag}</div>
                </div>
              </div>
              <button type="button" class="btn-micro" style="color: #f87171; font-size: 10px; padding: 1px 5px;" onclick="event.stopPropagation(); if(confirm('Remover o talento ${f.name} de ${p.name}?')) removeFeatFromPlayer('${p.id}', '${f.id}')" title="Remover Talento">🗑️</button>
            </div>
            <div style="font-size: 10.5px; color: #cbd5e1; margin-top: 5px; line-height: 1.35; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">
              ${f.summary || (f.benefits && f.benefits[0]) || ''}
            </div>
          </div>
        `;
  }).join('')}
    </div>
  `;
}

// --- MODAL DO MESTRE: CONCESSÃO DIRETA DE TALENTOS ---
let activeMasterGrantPlayerId = null;

function openMasterGrantFeatModal(playerId) {
  activeMasterGrantPlayerId = playerId;
  const p = PLAYERS.find(x => x.id === playerId);
  if (!p) return;

  const modal = document.getElementById('modal-master-grant-feat');
  if (!modal) return;

  const titleEl = document.getElementById('master-grant-feat-title');
  const subEl = document.getElementById('master-grant-feat-subtitle');
  if (titleEl) titleEl.innerText = `⭐ Conceder Talento Oficial: ${p.name}`;
  if (subEl) subEl.innerText = `${p.className || 'Herói'} Nível ${p.level || 1} • Concessão direta pelo Mestre`;

  const sInp = document.getElementById('master-feat-search-input');
  if (sInp) sInp.value = '';

  const catSel = document.getElementById('master-feat-cat-select');
  if (catSel) catSel.value = 'all';

  renderMasterGrantFeatList();
  modal.classList.add('open');
}

function closeMasterGrantFeatModal() {
  const modal = document.getElementById('modal-master-grant-feat');
  if (modal) modal.classList.remove('open');
  activeMasterGrantPlayerId = null;
}

function renderMasterGrantFeatList() {
  if (!activeMasterGrantPlayerId) return;
  const p = PLAYERS.find(x => x.id === activeMasterGrantPlayerId);
  if (!p) return;

  // 1. Renderiza lista de talentos ativos atuais do herói
  const currentContainer = document.getElementById('master-grant-current-feats');
  if (currentContainer) {
    const pFeats = getPlayerFeats(p);
    if (pFeats.length === 0) {
      currentContainer.innerHTML = '<span style="font-size: 11px; color: var(--text-dim); font-style: italic;">Nenhum talento concedido até o momento.</span>';
    } else {
      currentContainer.innerHTML = pFeats.map(f => `
        <span class="feat-active-pill" style="display: inline-flex; align-items: center; gap: 6px; background: rgba(30, 41, 59, 0.8); border: 1px solid rgba(250, 204, 21, 0.3); border-radius: 6px; padding: 3px 8px; font-size: 11px; color: #fff; margin: 2px 4px 2px 0;">
          <span>${f.icon} ${f.name}</span>
          <button type="button" onclick="removeFeatFromPlayer('${p.id}', '${f.id}'); renderMasterGrantFeatList();" style="background: none; border: none; color: #f87171; cursor: pointer; font-size: 10px; padding: 0 2px;" title="Revogar Talento">✕</button>
        </span>
      `).join('');
    }
  }

  // 2. Renderiza acervo completo com filtro
  const listContainer = document.getElementById('master-grant-feats-list');
  if (!listContainer) return;

  const rawQ = document.getElementById('master-feat-search-input')?.value || '';
  const q = rawQ.toLowerCase().trim();
  const catFilter = document.getElementById('master-feat-cat-select')?.value || 'all';

  const allFeats = typeof FEATS_DATA !== 'undefined' ? FEATS_DATA : [];
  const filtered = allFeats.filter(f => {
    if (catFilter !== 'all') {
      const cat = (f.category || '').toLowerCase();
      if (catFilter === 'combat' && !cat.includes('combate') && !cat.includes('controle')) return false;
      if (catFilter === 'magic' && !cat.includes('magia')) return false;
      if (catFilter === 'physical' && !cat.includes('físico') && !cat.includes('sobrevivência')) return false;
      if (catFilter === 'stealth' && !cat.includes('percepção') && !cat.includes('furtividade')) return false;
      if (catFilter === 'special' && (cat.includes('combate') || cat.includes('magia') || cat.includes('físico') || cat.includes('percepção') || cat.includes('furtividade'))) return false;
    }
    if (q) {
      const matchName = f.name.toLowerCase().includes(q);
      const matchEn = (f.nameEn || '').toLowerCase().includes(q);
      const matchPrereq = (f.prereq || '').toLowerCase().includes(q);
      const matchSumm = (f.summary || '').toLowerCase().includes(q);
      if (!matchName && !matchEn && !matchPrereq && !matchSumm) return false;
    }
    return true;
  });

  if (filtered.length === 0) {
    listContainer.innerHTML = '<div style="text-align: center; color: var(--text-dim); font-size: 11px; padding: 20px;">Nenhum talento correspondente ao filtro.</div>';
    return;
  }

  listContainer.innerHTML = filtered.map(f => {
    const alreadyHas = hasPlayerFeat(p, f.id);
    const prereqCheck = typeof checkFeatPrerequisites === 'function' ? checkFeatPrerequisites(p, f) : { met: true, reason: 'Nenhum' };
    const prereqBadge = !prereqCheck.met
      ? `<span style="color: #f87171; font-size: 10px; font-weight: 700;">⚠️ ${prereqCheck.reason}</span>`
      : (f.prereq && f.prereq.toLowerCase() !== 'nenhum' ? `<span style="color: #38bdf8; font-size: 10px;">Requisito: ${f.prereq}</span>` : '<span style="color: #34d399; font-size: 10px;">Sem pré-requisitos</span>');

    return `
      <div style="background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 8px 12px; display: flex; justify-content: space-between; align-items: center; gap: 10px;">
        <div style="flex: 1; overflow: hidden;">
          <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
            <span style="font-size: 16px;">${f.icon}</span>
            <b style="color: #fff; font-size: 12.5px;">${f.name}</b>
            <span style="font-size: 10px; color: #94a3b8;">(${f.nameEn})</span>
            <span class="badge badge-cls" style="font-size: 9px;">${f.category}</span>
          </div>
          <div style="font-size: 10.5px; color: #cbd5e1; margin-top: 3px; line-height: 1.3;">${f.summary}</div>
          <div style="margin-top: 4px;">${prereqBadge}</div>
        </div>
        <div style="display: flex; gap: 4px; align-items: center;">
          <button type="button" class="btn-secondary" style="font-size: 10px; padding: 4px 8px;" onclick="openFeatDetailModal('${f.id}')">📖 Regras</button>
          ${alreadyHas ? `
            <span style="font-size: 10.5px; color: #a7f3d0; font-weight: 700; padding: 4px 8px;">✅ Concedido</span>
          ` : `
            <button type="button" class="btn-action" style="font-size: 10.5px; padding: 4px 10px; background: linear-gradient(135deg, #10b981, #059669);" onclick="grantFeatToPlayer('${p.id}', '${f.id}', { source: 'master' }); renderMasterGrantFeatList();">
              ➕ Conceder
            </button>
          `}
        </div>
      </div>
    `;
  }).join('');
}

// --- MODAL DE ESCOLHA DE ASI (ATRIBUTOS OU TALENTO) DO JOGADOR ---
let activeAsiPlayerId = null;
let activeAsiTargetLevel = null;
let activeAsiClassKey = '';
let activeAsiModalMode = 'stats'; // 'stats' ou 'feat'
let selectedAsiFeatId = null;

function openAsiChoiceModal(playerId, targetLevel = null, classKey = '') {
  activeAsiPlayerId = playerId;
  activeAsiTargetLevel = targetLevel;
  activeAsiClassKey = classKey;
  activeAsiModalMode = 'stats';
  selectedAsiFeatId = null;

  const p = PLAYERS.find(x => x.id === playerId);
  if (!p) return;

  const modal = document.getElementById('modal-player-asi');
  if (!modal) return;

  const titleEl = document.getElementById('player-asi-modal-title');
  const subEl = document.getElementById('player-asi-modal-subtitle');
  if (titleEl) titleEl.innerText = `📈 Escolha de ASI: ${p.name}`;
  if (subEl) subEl.innerText = `${p.className} • Escolha oficial entre Aumento de Atributo ou Talento D&D 5E`;

  // Preenche select single
  const singleSel = document.getElementById('asi-stat-single-select');
  const dual1Sel = document.getElementById('asi-stat-dual-1-select');
  const dual2Sel = document.getElementById('asi-stat-dual-2-select');
  const attrs = [
    { key: 'str', label: 'Força' },
    { key: 'dex', label: 'Destreza' },
    { key: 'con', label: 'Constituição' },
    { key: 'int', label: 'Inteligência' },
    { key: 'wis', label: 'Sabedoria' },
    { key: 'cha', label: 'Carisma' }
  ];

  if (singleSel) {
    singleSel.innerHTML = attrs.map(a => {
      const cur = p[a.key] || 10;
      const next = Math.min(20, cur + 2);
      const isMax = cur >= 20;
      return `<option value="${a.key}" ${isMax ? 'disabled' : ''}>${a.label} (${cur} ➔ ${next}) ${isMax ? '[Teto 20 Atingido]' : ''}</option>`;
    }).join('');
  }

  if (dual1Sel) {
    dual1Sel.innerHTML = attrs.map((a, idx) => {
      const cur = p[a.key] || 10;
      const next = Math.min(20, cur + 1);
      const isMax = cur >= 20;
      return `<option value="${a.key}" ${idx === 0 ? 'selected' : ''} ${isMax ? 'disabled' : ''}>${a.label} (${cur} ➔ ${next})</option>`;
    }).join('');
  }

  if (dual2Sel) {
    dual2Sel.innerHTML = attrs.map((a, idx) => {
      const cur = p[a.key] || 10;
      const next = Math.min(20, cur + 1);
      const isMax = cur >= 20;
      return `<option value="${a.key}" ${idx === 1 ? 'selected' : ''} ${isMax ? 'disabled' : ''}>${a.label} (${cur} ➔ ${next})</option>`;
    }).join('');
  }

  selectAsiModalMode('stats');
  updateAsiStatsDistributionView();
  updateAsiStatsPreview();
  filterAsiModalFeats();

  modal.classList.add('open');
}

function closeAsiChoiceModal() {
  const modal = document.getElementById('modal-player-asi');
  if (modal) modal.classList.remove('open');
  activeAsiPlayerId = null;
}

function selectAsiModalMode(mode) {
  activeAsiModalMode = mode;
  const statsCard = document.getElementById('card-asi-mode-stats');
  const featCard = document.getElementById('card-asi-mode-feat');
  const statsView = document.getElementById('asi-stats-options-container');
  const featView = document.getElementById('asi-feat-options-container');

  if (statsCard) statsCard.classList.toggle('active', mode === 'stats');
  if (featCard) featCard.classList.toggle('active', mode === 'feat');
  if (statsView) statsView.style.display = mode === 'stats' ? 'block' : 'none';
  if (featView) featView.style.display = mode === 'feat' ? 'block' : 'none';
}

function updateAsiStatsDistributionView() {
  const radios = (typeof document !== 'undefined' && document.getElementsByName)
    ? Array.from(document.getElementsByName('asi_stat_dist_type'))
    : ((typeof document !== 'undefined' && document.querySelectorAll)
      ? Array.from(document.querySelectorAll('input[name="asi_stat_dist_type"]'))
      : []);
  let type = 'single';
  for (const r of radios) {
    if (r && r.checked) { type = r.value; break; }
  }
  const sBox = document.getElementById('asi-stat-single-box');
  const dBox = document.getElementById('asi-stat-dual-box');
  if (sBox) sBox.style.display = type === 'single' ? 'block' : 'none';
  if (dBox) dBox.style.display = type === 'dual' ? 'block' : 'none';
  updateAsiStatsPreview();
}

function updateAsiStatsPreview() {
  if (!activeAsiPlayerId) return;
  const p = PLAYERS.find(x => x.id === activeAsiPlayerId);
  if (!p) return;

  const previewPanel = document.getElementById('asi-stats-preview-panel');
  if (!previewPanel) return;

  const radios = document.getElementsByName('asi_stat_dist_type');
  let distType = 'single';
  for (const r of radios) {
    if (r.checked) { distType = r.value; break; }
  }

  const gains = { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 };
  if (distType === 'single') {
    const stat = document.getElementById('asi-stat-single-select')?.value || 'str';
    gains[stat] = 2;
  } else {
    const s1 = document.getElementById('asi-stat-dual-1-select')?.value || 'str';
    const s2 = document.getElementById('asi-stat-dual-2-select')?.value || 'dex';
    gains[s1] += 1;
    gains[s2] += 1;
  }

  const attrs = [
    { key: 'str', label: 'FOR' },
    { key: 'dex', label: 'DES' },
    { key: 'con', label: 'CON' },
    { key: 'int', label: 'INT' },
    { key: 'wis', label: 'SAB' },
    { key: 'cha', label: 'CAR' }
  ];

  previewPanel.innerHTML = `
    <div style="font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; margin-bottom: 6px;">
      📊 Prévia dos Atributos & Modificadores Finais:
    </div>
    <div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 6px; text-align: center;">
      ${attrs.map(a => {
    const cur = p[a.key] || 10;
    const gain = gains[a.key] || 0;
    const next = Math.min(20, cur + gain);
    const curMod = Math.floor((cur - 10) / 2);
    const nextMod = Math.floor((next - 10) / 2);
    const changed = gain > 0;
    return `
          <div style="background: ${changed ? 'rgba(250, 204, 21, 0.15)' : 'rgba(15, 23, 42, 0.6)'}; border: 1px solid ${changed ? 'rgba(250, 204, 21, 0.4)' : 'rgba(255,255,255,0.08)'}; border-radius: 6px; padding: 6px 2px;">
            <div style="font-size: 10px; font-weight: 800; color: #94a3b8;">${a.label}</div>
            <div style="font-size: 14px; font-weight: 800; color: ${changed ? '#facc15' : '#fff'};">${next}</div>
            <div style="font-size: 9.5px; color: ${changed && nextMod > curMod ? '#34d399' : '#64748b'};">
              ${nextMod >= 0 ? '+' + nextMod : nextMod} ${changed ? `(+${gain})` : ''}
            </div>
          </div>
        `;
  }).join('')}
    </div>
  `;
}

function filterAsiModalFeats() {
  const container = document.getElementById('asi-feats-list-container');
  if (!container) return;

  const p = PLAYERS.find(x => x.id === activeAsiPlayerId);
  const q = (document.getElementById('asi-feat-search-input')?.value || '').toLowerCase().trim();
  const catFilter = document.getElementById('asi-feat-cat-select')?.value || 'all';

  const featsList = typeof FEATS_DATA !== 'undefined' ? FEATS_DATA : [];
  const filtered = featsList.filter(f => {
    if (catFilter !== 'all') {
      const cat = (f.category || '').toLowerCase();
      if (catFilter === 'combat' && !cat.includes('combate') && !cat.includes('controle')) return false;
      if (catFilter === 'magic' && !cat.includes('magia')) return false;
      if (catFilter === 'physical' && !cat.includes('físico') && !cat.includes('sobrevivência')) return false;
      if (catFilter === 'stealth' && !cat.includes('percepção') && !cat.includes('furtividade')) return false;
      if (catFilter === 'special' && (cat.includes('combate') || cat.includes('magia') || cat.includes('físico') || cat.includes('percepção') || cat.includes('furtividade'))) return false;
    }
    if (q) {
      const matchName = f.name.toLowerCase().includes(q);
      const matchEn = (f.nameEn || '').toLowerCase().includes(q);
      const matchPrereq = (f.prereq || '').toLowerCase().includes(q);
      const matchSumm = (f.summary || '').toLowerCase().includes(q);
      if (!matchName && !matchEn && !matchPrereq && !matchSumm) return false;
    }
    return true;
  });

  if (filtered.length === 0) {
    container.innerHTML = '<div style="text-align:center; padding: 20px; color: var(--text-dim); font-size: 11px;">Nenhum talento encontrado.</div>';
    return;
  }

  container.innerHTML = filtered.map(f => {
    const isSelected = selectedAsiFeatId === f.id;
    const prereqCheck = (p && typeof checkFeatPrerequisites === 'function') ? checkFeatPrerequisites(p, f) : { met: true, reason: 'Nenhum' };
    const hasPrereq = f.prereq && f.prereq.toLowerCase() !== 'nenhum';

    return `
      <div class="asi-feat-select-card ${isSelected ? 'selected' : ''}" onclick="selectAsiModalFeat('${f.id}')" style="background: ${isSelected ? 'rgba(250, 204, 21, 0.15)' : 'rgba(15, 23, 42, 0.6)'}; border: 1px solid ${isSelected ? '#facc15' : 'rgba(255,255,255,0.08)'}; border-radius: 8px; padding: 8px 12px; cursor: pointer; transition: all 0.2s;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 18px;">${f.icon}</span>
            <div>
              <b style="color: ${isSelected ? '#facc15' : '#fff'}; font-size: 12.5px;">${f.name}</b>
              <span style="font-size: 10px; color: #94a3b8;">(${f.nameEn}) • ${f.category}</span>
            </div>
          </div>
          <button type="button" class="btn-micro" style="font-size: 10px; padding: 2px 6px;" onclick="event.stopPropagation(); openFeatDetailModal('${f.id}')">📖 Regras</button>
        </div>
        <div style="font-size: 11px; color: #cbd5e1; margin-top: 4px; line-height: 1.35;">${f.summary}</div>
        <div style="margin-top: 4px;">
          ${!prereqCheck.met
        ? `<span style="font-size: 10px; color: #f87171; font-weight: 700;">⚠️ ${prereqCheck.reason}</span>`
        : (hasPrereq ? `<span style="font-size: 10px; color: #38bdf8;">Requisito: ${f.prereq}</span>` : '<span style="font-size: 10px; color: #34d399;">Sem pré-requisitos</span>')}
        </div>
      </div>
    `;
  }).join('');
}

function selectAsiModalFeat(featId) {
  selectedAsiFeatId = featId;
  const f = typeof findFeatById === 'function' ? findFeatById(featId) : null;
  const halfChoiceBox = document.getElementById('asi-feat-half-choice-box');
  const halfChoiceSel = document.getElementById('asi-feat-stat-choice-select');

  if (f && f.statBonus && f.statBonus.choice && f.statBonus.choice.length > 0) {
    if (halfChoiceBox && halfChoiceSel) {
      halfChoiceBox.style.display = 'block';
      const labels = { str: 'Força (+1)', dex: 'Destreza (+1)', con: 'Constituição (+1)', int: 'Inteligência (+1)', wis: 'Sabedoria (+1)', cha: 'Carisma (+1)' };
      halfChoiceSel.innerHTML = f.statBonus.choice.map(s => `<option value="${s}">${labels[s] || s.toUpperCase()}</option>`).join('');
    }
  } else {
    if (halfChoiceBox) halfChoiceBox.style.display = 'none';
  }

  filterAsiModalFeats();
}

function saveAsiChoiceModal() {
  if (!activeAsiPlayerId) return;
  const p = PLAYERS.find(x => x.id === activeAsiPlayerId);
  if (!p) return;

  let choiceLabel = '';
  let choiceDetails = {};

  if (activeAsiModalMode === 'stats') {
    const radios = document.getElementsByName('asi_stat_dist_type');
    let distType = 'single';
    for (const r of radios) {
      if (r.checked) { distType = r.value; break; }
    }

    const oldCon = p.con || 10;
    const oldConMod = Math.floor((oldCon - 10) / 2);

    if (distType === 'single') {
      const stat = document.getElementById('asi-stat-single-select')?.value || 'str';
      const cur = p[stat] || 10;
      const next = Math.min(20, cur + 2);
      p[stat] = next;
      const lbl = { str: 'Força', dex: 'Destreza', con: 'Constituição', int: 'Inteligência', wis: 'Sabedoria', cha: 'Carisma' }[stat] || stat;
      choiceLabel = `+2 em ${lbl}`;
      choiceDetails = { type: 'stat', dist: 'single', stat, gain: 2 };
      addLog(`📈 <b>${p.name}</b> aplicou ASI: <b>+2 em ${lbl}</b> (${cur} ➔ ${next})`);
      addPlayerActionLog(p.id, '📈', `ASI: +2 em ${lbl} (${cur} ➔ ${next})`, 'level');
    } else {
      const s1 = document.getElementById('asi-stat-dual-1-select')?.value || 'str';
      const s2 = document.getElementById('asi-stat-dual-2-select')?.value || 'dex';
      if (s1 === s2) {
        alert('Selecione dois atributos distintos para a opção de +1 e +1.');
        return;
      }
      const c1 = p[s1] || 10;
      const c2 = p[s2] || 10;
      const n1 = Math.min(20, c1 + 1);
      const n2 = Math.min(20, c2 + 1);
      p[s1] = n1;
      p[s2] = n2;
      const lbl = key => ({ str: 'Força', dex: 'Destreza', con: 'Constituição', int: 'Inteligência', wis: 'Sabedoria', cha: 'Carisma' }[key] || key);
      choiceLabel = `+1 em ${lbl(s1)} e +1 em ${lbl(s2)}`;
      choiceDetails = { type: 'stat', dist: 'dual', s1, s2, gain: 1 };
      addLog(`📈 <b>${p.name}</b> aplicou ASI: <b>+1 em ${lbl(s1)}</b> (${c1} ➔ ${n1}) e <b>+1 em ${lbl(s2)}</b> (${c2} ➔ ${n2})`);
      addPlayerActionLog(p.id, '📈', `ASI: +1 em ${lbl(s1)} e +1 em ${lbl(s2)}`, 'level');
    }

    // Regra oficial D&D 5E: Aumento retroativo de PV caso Constituição suba
    const newCon = p.con || 10;
    const newConMod = Math.floor((newCon - 10) / 2);
    if (newConMod > oldConMod) {
      const retroGain = (newConMod - oldConMod) * (p.level || 1);
      p.maxHp = (p.maxHp || 10) + retroGain;
      p.hp = (p.hp || p.maxHp) + retroGain;
      addLog(`🛡️ <b>${p.name}</b> ganhou <b>+${retroGain} PV Retroativos</b> pelo aumento de Modificador de Constituição!`);
    }

    if (typeof ensurePlayerCalculatedAc === 'function') ensurePlayerCalculatedAc(p);
  } else {
    // Escolha de Talento
    if (!selectedAsiFeatId) {
      alert('Por favor, selecione um talento na lista para confirmar a evolução.');
      return;
    }
    const chosenStat = document.getElementById('asi-feat-stat-choice-select')?.value || null;
    const featObj = typeof findFeatById === 'function' ? findFeatById(selectedAsiFeatId) : null;
    choiceLabel = `Talento: ${featObj ? featObj.name : selectedAsiFeatId}`;
    choiceDetails = { type: 'feat', featId: selectedAsiFeatId, chosenStat };
    const success = grantFeatToPlayer(p.id, selectedAsiFeatId, { source: 'asi', chosenStat });
    if (!success) return;
  }

  // 🎯 Registro oficial da escolha do marco de nível (ISSUE-143)
  if (!p.asiChoices || typeof p.asiChoices !== 'object') {
    p.asiChoices = {};
  }
  const clsKey = (activeAsiClassKey || p.className || 'guerreiro').toLowerCase();
  const targetLvl = parseInt(activeAsiTargetLevel, 10) || parseInt(p.level, 10) || 4;
  const asiKey = `${clsKey}_lvl_${targetLvl}`;
  p.asiChoices[asiKey] = {
    level: targetLvl,
    classKey: clsKey,
    label: choiceLabel,
    details: choiceDetails,
    timestamp: Date.now()
  };

  if (typeof touchPlayer === 'function') touchPlayer(p);
  if (typeof saveToLocalStorage === 'function') saveToLocalStorage();
  if (typeof syncLocalChangesToFirebase === 'function') syncLocalChangesToFirebase();
  if (typeof broadcastStateSync === 'function') broadcastStateSync();

  renderPlayers();
  if (typeof renderCombat === 'function') renderCombat();
  closeAsiChoiceModal();
  if (typeof showToast === 'function') showToast(`Evolução de ASI de ${p.name} (${choiceLabel}) salva com sucesso!`, 'success');
}

// Vincula no window para navegadores
if (typeof window !== 'undefined') {
  window.openPlayerClassesModal = openPlayerClassesModal;
  window.closePlayerClassesModal = closePlayerClassesModal;
  window.renderPlayerClassesModalContent = renderPlayerClassesModalContent;
  window.addPlayerClassRow = addPlayerClassRow;
  window.removePlayerClassRow = removePlayerClassRow;
  window.updatePlayerClassRow = updatePlayerClassRow;
  window.savePlayerClassesModal = savePlayerClassesModal;

  window.getPlayerEquippedArmorKey = getPlayerEquippedArmorKey;
  window.hasPlayerEquippedShield = hasPlayerEquippedShield;
  window.setPlayerEquippedArmor = setPlayerEquippedArmor;

  window.PLAYER_FEATURES_CACHE = PLAYER_FEATURES_CACHE;
  window.registerFeatureForModal = registerFeatureForModal;
  window.openPlayerFeatureModalByKey = openPlayerFeatureModalByKey;

  window.openTradeItemModal = openTradeItemModal;
  window.closeTradeItemModal = closeTradeItemModal;
  window.adjustTradeQty = adjustTradeQty;
  window.setTradeQtyMax = setTradeQtyMax;
  window.confirmTradeItem = confirmTradeItem;
  window.transferPlayerItem = transferPlayerItem;


  window.openBatchRewardsModal = openBatchRewardsModal;
  window.closeBatchRewardsModal = closeBatchRewardsModal;
  window.renderBatchRewardHeroList = renderBatchRewardHeroList;
  window.toggleBatchRewardHero = toggleBatchRewardHero;
  window.toggleAllBatchRewardHeroes = toggleAllBatchRewardHeroes;
  window.selectCurrentCampaignBatchRewardHeroes = selectCurrentCampaignBatchRewardHeroes;
  window.setBatchXpQuick = setBatchXpQuick;
  window.updateBatchRewardCalculations = updateBatchRewardCalculations;
  window.distributeBatchRewards = distributeBatchRewards;
  window.syncPlayerCoinsAndGold = syncPlayerCoinsAndGold;
  window.getPlayerAmmunitionForItem = getPlayerAmmunitionForItem;
  window.consumePlayerAmmunition = consumePlayerAmmunition;
  window.getPlayerExtraAttacksCount = getPlayerExtraAttacksCount;
  window.openAttackAdvantageMenu = openAttackAdvantageMenu;
  window.closeAttackAdvantageMenu = closeAttackAdvantageMenu;

  window.openPlayerCombatModal = openPlayerCombatModal;
  window.closePlayerCombatModal = closePlayerCombatModal;
  window.renderPlayerCombatModalContent = renderPlayerCombatModalContent;
  window.openLevelUpWizardForActivePlayer = openLevelUpWizardForActivePlayer;

  window.isMagicalSubclass = isMagicalSubclass;
  window.isSpellcasterClass = isSpellcasterClass;
  window.getPlayerSubclassName = getPlayerSubclassName;
  window.calculateSpellSlots = calculateSpellSlots;
  window.calculateMulticlassSpellSlots = calculateMulticlassSpellSlots;
  window.getMaxPreparedSpells = getMaxPreparedSpells;
  window.getPlayerSpellcastingStats = getPlayerSpellcastingStats;
  window.getCompatibleClassKey = getCompatibleClassKey;
  window.getPlayerCompatibleClassKeys = getPlayerCompatibleClassKeys;
  window.togglePlayerLoginRoomConfig = togglePlayerLoginRoomConfig;

  // ISSUE-87: Armaduras, Sintonização, Modo Físico & Economia de Ações
  window.DND5E_ARMOR_DATA = DND5E_ARMOR_DATA;
  window.isArmorItem = isArmorItem;
  window.isShieldItem = isShieldItem;
  window.getArmorItemStats = getArmorItemStats;
  window.calculatePlayerAcFromEquipment = calculatePlayerAcFromEquipment;
  window.getPlayerAcCalculationInfo = getPlayerAcCalculationInfo;
  window.ensurePlayerCalculatedAc = ensurePlayerCalculatedAc;
  window.setPlayerFightingStyle = setPlayerFightingStyle;
  window.updateModalCalculatedAc = updateModalCalculatedAc;
  window.togglePlayerItemAttunement = togglePlayerItemAttunement;
  window.togglePlayerDiceMode = togglePlayerDiceMode;
  window.openPhysicalD20Modal = openPhysicalD20Modal;
  window.closePhysicalDiceModal = closePhysicalDiceModal;
  window.submitPhysicalD20Roll = submitPhysicalD20Roll;
  window.submitPhysicalD20DirectInput = submitPhysicalD20DirectInput;
  window.switchActiveRollToVirtual = switchActiveRollToVirtual;
  window.executePhysicalRollWithD20 = executePhysicalRollWithD20;
  window.getAttackActionType = getAttackActionType;
  window.getSpellActionType = getSpellActionType;
  window.setPlayerActionFilter = setPlayerActionFilter;
  window.setPlayerConcentration = setPlayerConcentration;
  window.clearPlayerConcentration = clearPlayerConcentration;
  window.renderPlayerResourceQuickDock = renderPlayerResourceQuickDock;
  window.usePlayerLayOnHandsQuick = usePlayerLayOnHandsQuick;
  window.usePlayerSecondWindQuick = usePlayerSecondWindQuick;
  window.usePlayerActionSurgeQuick = usePlayerActionSurgeQuick;
  window.handlePickerActionFilter = handlePickerActionFilter;
  window.setQuickLoginRoom = setQuickLoginRoom;
  window.rollPlayerAttack = rollPlayerAttack;
  window.rollPlayerSkill = rollPlayerSkill;
  window.rollPlayerSavingThrow = rollPlayerSavingThrow;
  window.rollPlayerAttr = rollPlayerAttr;
  window.rollPlayerSpellAttack = rollPlayerSpellAttack;
  window.getPlayerKnownSpells = getPlayerKnownSpells;
  window.setSheetSpellFilter = setSheetSpellFilter;
  window.sheetSpellFilters = sheetSpellFilters;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    touchPlayer,
    togglePlayerItemEquipped,
    usePlayerInventoryItem,
    addItemToPlayerFromCatalog,
    submitCustomItemToPlayer,
    adjustPlayerItemQty,
    removePlayerItem,
    adjustPlayerHp,
    renderPlayers,
    deletePlayer,
    deletePlayerDirect,
    openItemQuickView,
    closeItemQuickView,
    ensurePlayerSpellSlots,
    savePlayerSheet,
    trackDeletedPlayerId,
    getDeletedPlayerIds,
    openTradeItemModal,
    closeTradeItemModal,
    adjustTradeQty,
    setTradeQtyMax,
    confirmTradeItem,
    transferPlayerItem,
    openBatchRewardsModal,
    closeBatchRewardsModal,
    renderBatchRewardHeroList,
    toggleBatchRewardHero,
    toggleAllBatchRewardHeroes,
    selectCurrentCampaignBatchRewardHeroes,
    setBatchXpQuick,
    updateBatchRewardCalculations,
    distributeBatchRewards,
    openPlayerCombatModal,
    closePlayerCombatModal,
    renderPlayerCombatModalContent,
    openLevelUpWizardForActivePlayer,
    isMagicalSubclass,
    isSpellcasterClass,
    getPlayerSubclassName,
    calculateSpellSlots,
    calculateMulticlassSpellSlots,
    getMaxPreparedSpells,
    getPlayerSpellcastingStats,
    getCompatibleClassKey,
    getPlayerCompatibleClassKeys,
    togglePlayerLoginRoomConfig,

    // ISSUE-87: Armaduras, Sintonização, Modo Físico & Economia de Ações
    DND5E_ARMOR_DATA,
    isArmorItem,
    isShieldItem,
    getArmorItemStats,
    calculatePlayerAcFromEquipment,
    getPlayerAcCalculationInfo,
    ensurePlayerCalculatedAc,
    setPlayerFightingStyle,
    updateModalCalculatedAc,
    togglePlayerItemAttunement,
    togglePlayerDiceMode,
    openPhysicalD20Modal,
    closePhysicalDiceModal,
    submitPhysicalD20Roll,
    submitPhysicalD20DirectInput,
    switchActiveRollToVirtual,
    executePhysicalRollWithD20,
    getAttackActionType,
    getSpellActionType,
    setPlayerActionFilter,
    setPlayerConcentration,
    clearPlayerConcentration,
    renderPlayerResourceQuickDock,
    usePlayerLayOnHandsQuick,
    usePlayerSecondWindQuick,
    usePlayerActionSurgeQuick,
    handlePickerActionFilter,
    setQuickLoginRoom,
    rollPlayerAttack,
    rollPlayerSkill,
    rollPlayerSavingThrow,
    rollPlayerAttr,
    rollPlayerSpellAttack,

    // ISSUE-97: Resolução Dinâmica de Características & Dados de Dano de Magias
    DND5E_SPELL_DICE_DATA,
    getSpellDiceInfo,
    rollPlayerSpellDice,
    formatPlayerFeatureForDisplay,

    // ISSUE-99: Gerenciador de Classes, Leitura Segura e Armaduras
    openPlayerClassesModal,
    closePlayerClassesModal,
    renderPlayerClassesModalContent,
    addPlayerClassRow,
    removePlayerClassRow,
    updatePlayerClassRow,
    savePlayerClassesModal,
    getPlayerEquippedArmorKey,
    hasPlayerEquippedShield,
    setPlayerEquippedArmor,
    registerFeatureForModal,
    openPlayerFeatureModalByKey,
    PLAYER_FEATURES_CACHE,

    // ISSUE-100/101/102: Economia de Ações em Características e Ações Universais
    getFeatureActionType,
    renderUniversalCombatActions,

    // ISSUE-103: Resumo Rápido de Magias, Grimório de Magos & Transcrição
    openSpellQuickSummaryModal,
    closeSpellQuickSummaryModal,
    isWizardPlayer,
    ensurePlayerSpellbook,
    getSpellCopyCost,
    copySpellToSpellbook,
    castSpellAsRitual,
    togglePlayerSpellbookView,
    switchPickerMode,
    playerSpellbookViews,
    getPlayerKnownSpells,
    setSheetSpellFilter,
    sheetSpellFilters,

    // ISSUE-105: Experiência do Jogador, Concentração e Salvaguardas da Morte
    openDeathSavesModal,
    closeDeathSavesModal,
    toggleDeathSaveManual,
    addDeathSaveManual,
    setDeathSaveSpecial,
    resetDeathSavesManual,
    rollDeathSaveFromModal,
    triggerConcentrationCheck,
    closeConcentrationModal,
    submitConcentrationRoll,
    scrollToPlayerSection,
    openQuickD20Modal,
    rollWeaponDamageOnly,

    // ISSUE-108: Resumo Tátil de Magias
    openSpellQuickView,
    closeSpellQuickView,

    // ISSUE-111: Roll20 2024 Layout Overhaul
    getPlayerCalculatedAttacks,
    getPlayerSpecialClassAttacks,
    togglePlayerItemEquipped,
    setPlayerCardRoll20Tab,
    applyRoll20QuickDamage,
    applyRoll20QuickHeal,
    sharePlayerCalculatedAttackToFeed,
    sharePlayerSpellToFeed,
    sharePlayerItemToFeed,
    sharePlayerTraitToFeed,

    // ISSUE-122: Criação & Edição Avançada de Personagens
    getClassAttributePriority,
    calculateLevel1Hp,
    getSuggestedClassAttacks,
    roll4d6DropLowest,
    rollAttributes4d6Modal,
    applyStandardArrayModal,
    optimizeAttributesForClassModal,

    // ISSUE-124: Talentos Oficiais D&D 5E e Progressão ASI
    getPlayerFeats,
    hasPlayerFeat,
    getPlayerInitiativeBonus,
    rollPlayerInit,
    grantFeatToPlayer,
    removeFeatFromPlayer,
    openFeatDetailModal,
    renderPlayerFeatsSection,
    openMasterGrantFeatModal,
    closeMasterGrantFeatModal,
    renderMasterGrantFeatList,
    openAsiChoiceModal,
    closeAsiChoiceModal,
    selectAsiModalMode,
    updateAsiStatsDistributionView,
    updateAsiStatsPreview,
    filterAsiModalFeats,
    selectAsiModalFeat,
    saveAsiChoiceModal
  };
}


if (typeof window !== 'undefined') {
  window.DND5E_SPELL_DICE_DATA = DND5E_SPELL_DICE_DATA;
  window.getSpellDiceInfo = getSpellDiceInfo;
  window.rollPlayerSpellDice = rollPlayerSpellDice;
  window.formatPlayerFeatureForDisplay = formatPlayerFeatureForDisplay;
  window.getFeatureActionType = getFeatureActionType;
  window.renderUniversalCombatActions = renderUniversalCombatActions;

  // ISSUE-103: Resumo Rápido de Magias, Grimório de Magos & Transcrição
  window.openSpellQuickSummaryModal = openSpellQuickSummaryModal;
  window.closeSpellQuickSummaryModal = closeSpellQuickSummaryModal;
  window.isWizardPlayer = isWizardPlayer;
  window.ensurePlayerSpellbook = ensurePlayerSpellbook;
  window.getSpellCopyCost = getSpellCopyCost;
  window.copySpellToSpellbook = copySpellToSpellbook;
  window.castSpellAsRitual = castSpellAsRitual;
  window.togglePlayerSpellbookView = togglePlayerSpellbookView;
  window.switchPickerMode = switchPickerMode;
  window.playerSpellbookViews = playerSpellbookViews;

  // ISSUE-105: Experiência do Jogador, Concentração e Salvaguardas da Morte
  window.openDeathSavesModal = openDeathSavesModal;
  window.closeDeathSavesModal = closeDeathSavesModal;
  window.toggleDeathSaveManual = toggleDeathSaveManual;
  window.addDeathSaveManual = addDeathSaveManual;
  window.setDeathSaveSpecial = setDeathSaveSpecial;
  window.resetDeathSavesManual = resetDeathSavesManual;
  window.rollDeathSaveFromModal = rollDeathSaveFromModal;
  window.triggerConcentrationCheck = triggerConcentrationCheck;
  window.closeConcentrationModal = closeConcentrationModal;
  window.submitConcentrationRoll = submitConcentrationRoll;
  window.scrollToPlayerSection = scrollToPlayerSection;
  window.openQuickD20Modal = openQuickD20Modal;
  window.rollWeaponDamageOnly = rollWeaponDamageOnly;

  // ISSUE-108: Resumo Tátil de Magias
  window.openSpellQuickView = openSpellQuickView;
  window.closeSpellQuickView = closeSpellQuickView;

  // ISSUE-111: Roll20 2024 Layout Overhaul
  window.getPlayerCalculatedAttacks = getPlayerCalculatedAttacks;
  window.getPlayerSpecialClassAttacks = getPlayerSpecialClassAttacks;
  window.togglePlayerItemEquipped = togglePlayerItemEquipped;
  window.setPlayerCardRoll20Tab = setPlayerCardRoll20Tab;
  window.applyRoll20QuickDamage = applyRoll20QuickDamage;
  window.applyRoll20QuickHeal = applyRoll20QuickHeal;
  window.sharePlayerCalculatedAttackToFeed = sharePlayerCalculatedAttackToFeed;
  window.sharePlayerSpellToFeed = sharePlayerSpellToFeed;
  window.sharePlayerItemToFeed = sharePlayerItemToFeed;
  // ISSUE-114 & ISSUE-115: Formatação de Textos e Modal de Edição
  window.formatFeatureSnippet = formatFeatureSnippet;
  window.updateModalAttributeModifiers = updateModalAttributeModifiers;

  // ISSUE-122: Criação & Edição Avançada de Personagens
  window.getClassAttributePriority = getClassAttributePriority;
  window.calculateLevel1Hp = calculateLevel1Hp;
  window.getSuggestedClassAttacks = getSuggestedClassAttacks;
  window.roll4d6DropLowest = roll4d6DropLowest;
  window.rollAttributes4d6Modal = rollAttributes4d6Modal;
  window.applyStandardArrayModal = applyStandardArrayModal;
  window.optimizeAttributesForClassModal = optimizeAttributesForClassModal;

  // ISSUE-124: Talentos Oficiais D&D 5E e Progressão ASI
  window.getPlayerFeats = getPlayerFeats;
  window.hasPlayerFeat = hasPlayerFeat;
  window.getPlayerInitiativeBonus = getPlayerInitiativeBonus;
  window.rollPlayerInit = rollPlayerInit;
  window.grantFeatToPlayer = grantFeatToPlayer;
  window.removeFeatFromPlayer = removeFeatFromPlayer;
  window.openFeatDetailModal = openFeatDetailModal;
  window.renderPlayerFeatsSection = renderPlayerFeatsSection;
  window.openMasterGrantFeatModal = openMasterGrantFeatModal;
  window.closeMasterGrantFeatModal = closeMasterGrantFeatModal;
  window.renderMasterGrantFeatList = renderMasterGrantFeatList;
  window.openAsiChoiceModal = openAsiChoiceModal;
  window.closeAsiChoiceModal = closeAsiChoiceModal;
  window.selectAsiModalMode = selectAsiModalMode;
  window.updateAsiStatsDistributionView = updateAsiStatsDistributionView;
  window.updateAsiStatsPreview = updateAsiStatsPreview;
  window.filterAsiModalFeats = filterAsiModalFeats;
  window.selectAsiModalFeat = selectAsiModalFeat;
  window.saveAsiChoiceModal = saveAsiChoiceModal;

  // ISSUE-134: Resumo de Itens e Exclusão de Ficha
  window.deletePlayer = deletePlayer;
  window.deletePlayerDirect = deletePlayerDirect;
  window.openItemQuickView = openItemQuickView;
  window.closeItemQuickView = closeItemQuickView;

  // ISSUE-136: Espaços de Magia Universal
  window.ensurePlayerSpellSlots = ensurePlayerSpellSlots;

  // ISSUE-138: Experiência Mobile Next-Gen (Thumb HUD & Haptics)
  window.triggerHapticFeedback = triggerHapticFeedback;
  window.updateMobileVitalThumbHud = updateMobileVitalThumbHud;
  window.promptPlayerMobileHp = promptPlayerMobileHp;
  window.breakPlayerConcentration = breakPlayerConcentration;
  window.toggleCombatFocusMode = toggleCombatFocusMode;
  window.rollDirectD20FromHud = rollDirectD20FromHud;

  // ISSUE-142: Geração de Atributos e Bônus Raciais Canônicos D&D 5E
  window.getRacialAbilityBonuses = getRacialAbilityBonuses;
  window.roll4d6DropLowest = roll4d6DropLowest;
  // ISSUE-143: Progressão Canônica de ASI e Talentos D&D 5E
  window.getClassAsiLevels = getClassAsiLevels;
  window.isClassAsiLevel = isClassAsiLevel;
  window.openAsiChoiceModal = openAsiChoiceModal;
  window.closeAsiChoiceModal = closeAsiChoiceModal;
  window.selectAsiModalMode = selectAsiModalMode;
  window.selectAsiModalFeat = selectAsiModalFeat;
  window.filterAsiModalFeats = filterAsiModalFeats;
  window.saveAsiChoiceModal = saveAsiChoiceModal;
  window.updateAsiStatsDistributionView = updateAsiStatsDistributionView;
  window.updateAsiStatsPreview = updateAsiStatsPreview;

  // ISSUE-145: Filtro Dinâmico de Campanhas e Ações Coletivas por Mesa
  window.getCurrentlyFilteredPlayers = getCurrentlyFilteredPlayers;
  window.getCurrentlySelectedCampaign = getCurrentlySelectedCampaign;
  window.filterPlayersByCampaign = filterPlayersByCampaign;
  window.setCampaignFilter = setCampaignFilter;
  window.clearCampaignFilter = clearCampaignFilter;
  window.populateCampaignFilterOptions = populateCampaignFilterOptions;

  // ISSUE-146: Sanitização de Peso e Layout Blindado
  window.formatCleanItemWeight = formatCleanItemWeight;

  // ISSUE-154: Renderização de Traços Raciais da Espécie
  window.renderPlayerRacialTraits = renderPlayerRacialTraits;

  // ISSUE-156: Trocas e Edição da Mochila
  window.openTradeItemModal = openTradeItemModal;
  window.closeTradeItemModal = closeTradeItemModal;
  window.adjustTradeQty = adjustTradeQty;
  window.setTradeQtyMax = setTradeQtyMax;
  window.confirmTradeItem = confirmTradeItem;
  window.transferPlayerItem = transferPlayerItem;
  window.openEditPlayerItemModal = openEditPlayerItemModal;
  window.closeEditPlayerItemModal = closeEditPlayerItemModal;
  window.saveEditedPlayerItem = saveEditedPlayerItem;

  // ISSUE-157: Quick Switcher de Heróis, Traços e Magias por Círculo
  window.renderHeroQuickNav = renderHeroQuickNav;
  window.jumpToPlayerCard = jumpToPlayerCard;
  window.setPlayerTraitCategoryFilter = setPlayerTraitCategoryFilter;
  window.handlePlayerTraitSearch = handlePlayerTraitSearch;
  window.togglePlayerTraitsExpandAll = togglePlayerTraitsExpandAll;
  window.togglePlayerFeatureAccordion = togglePlayerFeatureAccordion;
  window.setPlayerSpellCircleFilter = setPlayerSpellCircleFilter;
  window.handlePlayerSpellSearch = handlePlayerSpellSearch;
  window.togglePlayerCircleSlot = togglePlayerCircleSlot;
  window.renderPlayerUnlockedFeatures = renderPlayerUnlockedFeatures;

  // ISSUE-159: Antecedentes Interativos D&D 5E
  window.findBackgroundData = findBackgroundData;
  window.onModalBackgroundChange = onModalBackgroundChange;
  window.rollBackgroundTraitsModal = rollBackgroundTraitsModal;
  window.applyBackgroundBenefitsModal = applyBackgroundBenefitsModal;
}

// ============================================================================
// 📜 ISSUE-159: SISTEMA DE ANTECEDENTES INTERATIVOS (BACKGROUNDS_DATA)
// ============================================================================
function findBackgroundData(bgQuery) {
  if (!bgQuery || typeof BACKGROUNDS_DATA === 'undefined' || !Array.isArray(BACKGROUNDS_DATA)) return null;
  const norm = String(bgQuery).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  if (!norm) return null;
  return BACKGROUNDS_DATA.find(bg => {
    const bgName = String(bg.name || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const bgEn = String(bg.nameEn || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const bgId = String(bg.id || '').toLowerCase();
    return bgId === norm || bgName === norm || bgEn === norm || bgName.includes(norm) || norm.includes(bgName);
  }) || null;
}

function onModalBackgroundChange(bgVal) {
  const query = bgVal !== undefined ? bgVal : (typeof document !== 'undefined' ? (document.getElementById('pm-background')?.value || '') : '');
  const bg = findBackgroundData(query);
  const bar = typeof document !== 'undefined' ? document.getElementById('pm-background-summary-bar') : null;

  if (typeof renderModalBackgroundQuickChips === 'function') renderModalBackgroundQuickChips();
  if (typeof renderModalTraitSuggestions === 'function') renderModalTraitSuggestions();
  if (typeof renderModalClassSkillsPicker === 'function') renderModalClassSkillsPicker();
  if (typeof renderModalStartingEquipmentChoices === 'function') renderModalStartingEquipmentChoices();
  if (typeof updateDdbHeroSummaryBar === 'function') updateDdbHeroSummaryBar();

  if (!bar) return bg;

  if (!bg) {
    bar.style.display = 'none';
    bar.innerHTML = '';
    return null;
  }

  bar.style.display = 'block';
  const skillsStr = Array.isArray(bg.skillLabels) ? bg.skillLabels.join(' & ') : '';
  const equipStr = Array.isArray(bg.equipment) ? bg.equipment.join(', ') : '';
  bar.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: space-between; gap: 6px; flex-wrap: wrap;">
      <span style="color: #fbbf24; font-weight: 800;">${bg.icon || '📜'} ${bg.name} (${bg.nameEn || ''})</span>
      <span style="background: rgba(16,185,129,0.18); color: #34d399; border: 1px solid rgba(16,185,129,0.35); border-radius: 99px; padding: 1px 7px; font-size: 9.5px; font-weight: 700;">🎯 Perícias: ${skillsStr}</span>
    </div>
    <div style="margin-top: 3px; color: #cbd5e1; font-size: 10px;">
      <b>Característica (${bg.featureName}):</b> ${bg.featureDesc}
    </div>
    ${equipStr ? `<div style="margin-top: 3px; color: #94a3b8; font-size: 9.5px;"><b>🎒 Equipamento de Origem:</b> ${equipStr} (${bg.startingGold || 10} PO)</div>` : ''}
  `;
  return bg;
}

function rollBackgroundTraitsModal(which = 'all') {
  const bgVal = typeof document !== 'undefined' ? (document.getElementById('pm-background')?.value || 'Soldado') : 'Soldado';
  const bg = findBackgroundData(bgVal) || (typeof BACKGROUNDS_DATA !== 'undefined' && BACKGROUNDS_DATA[0] ? BACKGROUNDS_DATA[0] : null);
  if (!bg) return null;

  const pickRandom = (arr) => (Array.isArray(arr) && arr.length > 0) ? arr[Math.floor(Math.random() * arr.length)] : '';
  const rolled = {};

  if (which === 'all' || which === 'personality') {
    rolled.personality = pickRandom(bg.personalityTraits);
    const el = typeof document !== 'undefined' ? document.getElementById('pm-personality') : null;
    if (el && rolled.personality) el.value = rolled.personality;
  }
  if (which === 'all' || which === 'ideal') {
    rolled.ideal = pickRandom(bg.ideals);
    const el = typeof document !== 'undefined' ? document.getElementById('pm-ideal') : null;
    if (el && rolled.ideal) el.value = rolled.ideal;
  }
  if (which === 'all' || which === 'bond') {
    rolled.bond = pickRandom(bg.bonds);
    const el = typeof document !== 'undefined' ? document.getElementById('pm-bond') : null;
    if (el && rolled.bond) el.value = rolled.bond;
  }
  if (which === 'all' || which === 'flaw') {
    rolled.flaw = pickRandom(bg.flaws);
    const el = typeof document !== 'undefined' ? document.getElementById('pm-flaw') : null;
    if (el && rolled.flaw) el.value = rolled.flaw;
  }

  if (typeof playFX === 'function') playFX('dice');
  if (typeof showToast === 'function') {
    showToast(`🎲 Tabelas de ${bg.name} sorteadas com sucesso!`, 'info');
  }
  return rolled;
}

function applyBackgroundBenefitsModal() {
  const bgVal = typeof document !== 'undefined' ? (document.getElementById('pm-background')?.value || '') : '';
  const bg = findBackgroundData(bgVal);
  if (!bg) {
    if (typeof showToast === 'function') showToast('Selecione um antecedente oficial D&D 5E primeiro (ex: Acólito, Criminoso, Sábio, Soldado).', 'warning');
    return null;
  }

  if (typeof window !== 'undefined') {
    window._modalPendingBackgroundSkills = Array.isArray(bg.skills) ? [...bg.skills] : [];
  }

  // Se estiver editando um personagem existente, já garante as perícias nele também
  const pId = typeof document !== 'undefined' ? document.getElementById('pm-id')?.value : '';
  if (pId && typeof PLAYERS !== 'undefined' && Array.isArray(PLAYERS)) {
    const p = PLAYERS.find(x => String(x.id) === String(pId));
    if (p) {
      if (!Array.isArray(p.skillProficiencies)) p.skillProficiencies = [];
      (bg.skills || []).forEach(sk => {
        if (sk && !p.skillProficiencies.includes(sk)) p.skillProficiencies.push(sk);
      });
    }
  }

  // Adiciona a característica do antecedente ao campo de Características & Talentos se ainda não constar
  const featInp = typeof document !== 'undefined' ? document.getElementById('pm-features') : null;
  if (featInp && bg.featureName) {
    const curText = featInp.value || '';
    if (!curText.toLowerCase().includes(bg.featureName.toLowerCase())) {
      const featureLine = `[Antecedente - ${bg.name}] ${bg.featureName}: ${bg.featureDesc}`;
      featInp.value = curText.trim() ? `${curText.trim()}\n${featureLine}` : featureLine;
    }
  }

  // Atualiza PO inicial caso seja ficha nova com PO padrão
  const goldInp = typeof document !== 'undefined' ? document.getElementById('pm-gold') : null;
  if (goldInp && (!pId) && bg.startingGold) {
    goldInp.value = bg.startingGold;
  }

  onModalBackgroundChange(bg.name);
  if (typeof playFX === 'function') playFX('heal');
  if (typeof showToast === 'function') {
    showToast(`⚡ Benefícios de ${bg.name} aplicados: Perícias (${(bg.skillLabels || []).join(', ')}) + ${bg.featureName}!`, 'success');
  }
  return {
    background: bg.name,
    skills: bg.skills,
    featureName: bg.featureName,
    startingGold: bg.startingGold
  };
}

// ============================================================================
// 🧙‍♂️ ISSUE-160: CRIADOR DE PERSONAGENS ESTILO D&D BEYOND (ABAS, SUGESTÕES & EQUIPAMENTOS)
// ============================================================================
const DDB_BUILDER_STEPS = [
  { key: 'home', label: '⚙️ HOME' },
  { key: 'class', label: '1. Classe' },
  { key: 'background', label: '2. Antecedente' },
  { key: 'species', label: '3. Raça / Espécie' },
  { key: 'abilities', label: '4. Atributos' },
  { key: 'equipment', label: '5. Equipamento' }
];

let activeDdbBuilderStep = 'home';
let ddbShowAllSteps = false;
let activeDdbEquipMode = 'equipment';

function initDdbCharacterBuilderModal() {
  ddbShowAllSteps = false;
  activeDdbEquipMode = 'equipment';
  const stage = typeof document !== 'undefined' ? document.querySelector('.ddb-builder-stage') : null;
  if (stage) stage.classList.remove('show-all-steps');
  const toggleBtn = typeof document !== 'undefined' ? document.getElementById('btn-ddb-toggle-all') : null;
  if (toggleBtn) {
    toggleBtn.classList.remove('active');
    toggleBtn.textContent = '📋 Ver Tudo';
  }
  renderModalClassBuilderCards();
  renderModalClassSkillsPicker();
  renderModalBackgroundQuickChips();
  renderModalTraitSuggestions();
  renderModalSpeciesBuilderCards();
  renderModalStartingEquipmentChoices();
  renderModalStartingInventoryList();
  updateDdbHeroSummaryBar();
  switchPlayerModalStep('home');
}

function switchPlayerModalStep(stepKey) {
  const valid = DDB_BUILDER_STEPS.find(s => s.key === stepKey) ? stepKey : 'home';
  activeDdbBuilderStep = valid;

  if (typeof document === 'undefined') return activeDdbBuilderStep;

  const tabs = document.querySelectorAll('#ddb-builder-nav .ddb-step-tab');
  tabs.forEach(t => {
    if (t.dataset.step === valid) t.classList.add('active');
    else t.classList.remove('active');
  });

  const panes = document.querySelectorAll('.ddb-builder-stage .ddb-step-pane');
  panes.forEach(p => {
    if (p.dataset.step === valid) p.classList.add('active');
    else p.classList.remove('active');
  });

  const idx = DDB_BUILDER_STEPS.findIndex(s => s.key === valid);
  const prevBtn = document.getElementById('btn-ddb-prev-step');
  const nextBtn = document.getElementById('btn-ddb-next-step');
  const sidePrev = document.getElementById('btn-ddb-side-prev');
  const sideNext = document.getElementById('btn-ddb-side-next');

  if (prevBtn) {
    if (idx > 0) {
      prevBtn.style.display = 'inline-flex';
      prevBtn.textContent = `◀ ${DDB_BUILDER_STEPS[idx - 1].label}`;
    } else {
      prevBtn.style.display = 'none';
    }
  }
  if (nextBtn) {
    if (idx >= 0 && idx < DDB_BUILDER_STEPS.length - 1) {
      nextBtn.style.display = 'inline-flex';
      nextBtn.textContent = `Próxima Etapa: ${DDB_BUILDER_STEPS[idx + 1].label} ▶`;
    } else {
      nextBtn.style.display = 'none';
    }
  }
  if (sidePrev) sidePrev.style.display = idx > 0 ? 'flex' : 'none';
  if (sideNext) sideNext.style.display = idx < DDB_BUILDER_STEPS.length - 1 ? 'flex' : 'none';

  updateDdbHeroSummaryBar();
  return activeDdbBuilderStep;
}

function nextPlayerModalStep() {
  const idx = DDB_BUILDER_STEPS.findIndex(s => s.key === activeDdbBuilderStep);
  if (idx >= 0 && idx < DDB_BUILDER_STEPS.length - 1) {
    return switchPlayerModalStep(DDB_BUILDER_STEPS[idx + 1].key);
  }
  return activeDdbBuilderStep;
}

function prevPlayerModalStep() {
  const idx = DDB_BUILDER_STEPS.findIndex(s => s.key === activeDdbBuilderStep);
  if (idx > 0) {
    return switchPlayerModalStep(DDB_BUILDER_STEPS[idx - 1].key);
  }
  return activeDdbBuilderStep;
}

function togglePlayerModalAllSteps() {
  ddbShowAllSteps = !ddbShowAllSteps;
  if (typeof document !== 'undefined') {
    const stage = document.querySelector('.ddb-builder-stage');
    const toggleBtn = document.getElementById('btn-ddb-toggle-all');
    if (stage) {
      if (ddbShowAllSteps) stage.classList.add('show-all-steps');
      else stage.classList.remove('show-all-steps');
    }
    if (toggleBtn) {
      toggleBtn.classList.toggle('active', ddbShowAllSteps);
      toggleBtn.textContent = ddbShowAllSteps ? '🧭 Modo Abas' : '📋 Ver Tudo';
    }
  }
  return ddbShowAllSteps;
}

function updateDdbHeroSummaryBar() {
  if (typeof document === 'undefined') return;
  const nameVal = document.getElementById('pm-name')?.value?.trim() || 'Novo Aventureiro';
  const studentVal = document.getElementById('pm-student')?.value?.trim() || '';
  const avatarVal = document.getElementById('pm-avatar')?.value?.trim() || '👤';
  const classSel = document.getElementById('pm-class-select');
  const classVal = (classSel && classSel.value !== 'custom') ? classSel.value : (document.getElementById('pm-class')?.value || 'Guerreiro');
  const raceSel = document.getElementById('pm-race-select');
  const raceVal = (raceSel && raceSel.value !== 'custom') ? raceSel.value : (document.getElementById('pm-race')?.value || 'Humano');
  const lvlVal = parseInt(document.getElementById('pm-level')?.value, 10) || 1;
  const bgVal = document.getElementById('pm-background')?.value?.trim() || 'Aventureiro';
  const acVal = parseInt(document.getElementById('pm-ac')?.value, 10) || 10;
  const hpVal = parseInt(document.getElementById('pm-maxhp')?.value, 10) || 10;
  const goldVal = parseInt(document.getElementById('pm-gold')?.value, 10) || 0;

  const avatarEl = document.getElementById('ddb-hero-avatar-preview');
  if (avatarEl) {
    if (avatarVal.startsWith('data:image') || avatarVal.startsWith('http')) {
      avatarEl.innerHTML = `<img src="${avatarVal}" alt="Avatar">`;
    } else {
      avatarEl.textContent = avatarVal;
    }
  }
  const nameEl = document.getElementById('ddb-hero-name-preview');
  if (nameEl) nameEl.textContent = studentVal ? `${nameVal} (${studentVal})` : nameVal;

  const subEl = document.getElementById('ddb-hero-sub-preview');
  if (subEl) subEl.textContent = `${raceVal} • ${classVal} Nv ${lvlVal} • ${bgVal}`;

  const pillAc = document.getElementById('ddb-hero-pill-ac');
  if (pillAc) pillAc.textContent = `🛡️ CA ${acVal}`;
  const pillHp = document.getElementById('ddb-hero-pill-hp');
  if (pillHp) pillHp.textContent = `❤️ PV ${hpVal}`;
  const pillGold = document.getElementById('ddb-hero-pill-gold');
  if (pillGold) pillGold.textContent = `🪙 ${goldVal} PO`;

  const cardClass = document.getElementById('ddb-home-card-class');
  if (cardClass) cardClass.textContent = `Selecionada: ${classVal} (Nv ${lvlVal})`;
  const cardBg = document.getElementById('ddb-home-card-bg');
  if (cardBg) cardBg.textContent = `Origem: ${bgVal}`;
  const cardRace = document.getElementById('ddb-home-card-race');
  if (cardRace) cardRace.textContent = `Espécie: ${raceVal}`;
}

function renderModalClassBuilderCards() {
  if (typeof document === 'undefined' || typeof CLASSES_DATA === 'undefined') return;
  const listEl = document.getElementById('ddb-class-cards-list');
  if (!listEl) return;

  const classSel = document.getElementById('pm-class-select');
  const curClass = (classSel && classSel.value !== 'custom') ? classSel.value : (document.getElementById('pm-class')?.value || 'Guerreiro');
  const normCur = String(curClass).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

  listEl.innerHTML = CLASSES_DATA.map(cls => {
    const normCls = String(cls.name).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
    const isSel = normCls === normCur || normCur.includes(normCls);
    const hdShort = (cls.hitDie || 'd8').split(' ')[0];
    const savesStr = Array.isArray(cls.savingThrows) ? cls.savingThrows.join(', ') : '';
    const subCount = Array.isArray(cls.subclasses) ? cls.subclasses.length : 0;

    return `
      <div class="ddb-entity-card ${isSel ? 'selected' : ''}" onclick="selectModalClassCard('${cls.name.replace(/'/g, "\\'")}')">
        <div class="ddb-entity-card-top">
          <div class="ddb-entity-icon">${cls.icon || '⚔️'}</div>
          <div>
            <div class="ddb-entity-title">${cls.name}</div>
            <div class="ddb-entity-meta">Livro do Jogador (2014) • ${hdShort} • ${subCount} Subclasses</div>
          </div>
          <span class="ddb-entity-chevron">${isSel ? '✓' : '❯'}</span>
        </div>
        ${isSel ? `
          <div style="font-size: 10.5px; color: #cbd5e1; border-top: 1px dashed rgba(255,255,255,0.12); padding-top: 5px; line-height: 1.35;">
            <div><b>Papel:</b> ${cls.role || '-'} | <b>Salvaguardas:</b> ${savesStr}</div>
            <div style="color: #94a3b8; margin-top: 2px;">${cls.summary || ''}</div>
          </div>
        ` : ''}
      </div>
    `;
  }).join('');
}

function selectModalClassCard(className) {
  if (!className) return;
  if (typeof document !== 'undefined') {
    const classSel = document.getElementById('pm-class-select');
    const classInp = document.getElementById('pm-class');
    if (classSel) {
      const match = Array.from(classSel.options).find(o => o.value.toLowerCase() === className.toLowerCase());
      if (match) classSel.value = match.value;
    }
    if (classInp) classInp.value = className;
    if (typeof window !== 'undefined') window._modalStartingEquipChoices = {};
    onPlayerModalClassOrLevelChange();
  }
  return className;
}

const DND5E_SKILL_LABELS_MAP = {
  atletismo: 'Atletismo (FOR)',
  acrobacia: 'Acrobacia (DES)',
  furtividade: 'Furtividade (DES)',
  prestidigitacao: 'Prestidigitação (DES)',
  arcanismo: 'Arcanismo (INT)',
  historia: 'História (INT)',
  investigacao: 'Investigação (INT)',
  natureza: 'Natureza (INT)',
  religiao: 'Religião (INT)',
  adestramento: 'Adestrar Animais (SAB)',
  intuicao: 'Intuição (SAB)',
  medicina: 'Medicina (SAB)',
  percepcao: 'Percepção (SAB)',
  sobrevivencia: 'Sobrevivência (SAB)',
  atuacao: 'Atuação (CAR)',
  enganacao: 'Enganação (CAR)',
  intimidacao: 'Intimidação (CAR)',
  persuasao: 'Persuasão (CAR)'
};

function renderModalClassSkillsPicker() {
  if (typeof document === 'undefined') return;
  const pickerEl = document.getElementById('ddb-class-skills-picker');
  const counterEl = document.getElementById('ddb-class-skills-counter');
  if (!pickerEl) return;

  const classSel = document.getElementById('pm-class-select');
  const curClass = (classSel && classSel.value !== 'custom') ? classSel.value : (document.getElementById('pm-class')?.value || 'Guerreiro');
  const clsEq = typeof getClassStartingEquipmentData === 'function' ? getClassStartingEquipmentData(curClass) : null;
  if (!clsEq) return;

  const maxSkills = clsEq.skillCount || 2;
  const options = Array.isArray(clsEq.skillOptions) ? clsEq.skillOptions : [];
  if (typeof window !== 'undefined' && !Array.isArray(window._modalSelectedClassSkills)) {
    window._modalSelectedClassSkills = [];
  }
  const selected = (typeof window !== 'undefined' && Array.isArray(window._modalSelectedClassSkills)) ? window._modalSelectedClassSkills : [];

  const bgVal = document.getElementById('pm-background')?.value || '';
  const bg = findBackgroundData(bgVal);
  const bgSkills = (bg && Array.isArray(bg.skills)) ? bg.skills : [];

  const chosenClassCount = selected.filter(sk => options.includes(sk) && !bgSkills.includes(sk)).length;
  if (counterEl) {
    counterEl.textContent = `${chosenClassCount} / ${maxSkills} escolhidas`;
  }

  pickerEl.innerHTML = options.map(skKey => {
    const label = DND5E_SKILL_LABELS_MAP[skKey] || skKey;
    const isFromBg = bgSkills.includes(skKey);
    const isSelected = selected.includes(skKey) || isFromBg;
    return `
      <button type="button" class="ddb-skill-choice-chip ${isFromBg ? 'bg-granted' : (isSelected ? 'selected' : '')}"
              onclick="toggleModalClassSkillChoice('${skKey}')"
              title="${isFromBg ? 'Já concedida pelo Antecedente (' + (bg ? bg.name : '') + ')' : 'Clique para selecionar perícia da classe'}">
        <span>${isSelected ? '✓' : '○'}</span>
        <span>${label}</span>
        ${isFromBg ? `<small style="font-size:9px; opacity:0.85;">(Antecedente)</small>` : ''}
      </button>
    `;
  }).join('');
}

function toggleModalClassSkillChoice(skillKey) {
  if (!skillKey || typeof window === 'undefined') return [];
  if (!Array.isArray(window._modalSelectedClassSkills)) window._modalSelectedClassSkills = [];

  const classSel = typeof document !== 'undefined' ? document.getElementById('pm-class-select') : null;
  const curClass = (classSel && classSel.value !== 'custom') ? classSel.value : (typeof document !== 'undefined' ? (document.getElementById('pm-class')?.value || 'Guerreiro') : 'Guerreiro');
  const clsEq = typeof getClassStartingEquipmentData === 'function' ? getClassStartingEquipmentData(curClass) : { skillCount: 2, skillOptions: [] };
  const maxSkills = clsEq.skillCount || 2;
  const allowed = Array.isArray(clsEq.skillOptions) ? clsEq.skillOptions : [];

  const idx = window._modalSelectedClassSkills.indexOf(skillKey);
  if (idx >= 0) {
    window._modalSelectedClassSkills.splice(idx, 1);
  } else {
    const currentInPool = window._modalSelectedClassSkills.filter(k => allowed.includes(k));
    if (currentInPool.length >= maxSkills) {
      const oldest = currentInPool[0];
      const oldIdx = window._modalSelectedClassSkills.indexOf(oldest);
      if (oldIdx >= 0) window._modalSelectedClassSkills.splice(oldIdx, 1);
    }
    window._modalSelectedClassSkills.push(skillKey);
  }

  renderModalClassSkillsPicker();
  return window._modalSelectedClassSkills;
}

function renderModalBackgroundQuickChips() {
  if (typeof document === 'undefined' || typeof BACKGROUNDS_DATA === 'undefined') return;
  const container = document.getElementById('ddb-background-quick-chips');
  if (!container) return;

  const curBgVal = (document.getElementById('pm-background')?.value || '').trim().toLowerCase();
  container.innerHTML = BACKGROUNDS_DATA.map(bg => {
    const isAct = curBgVal === bg.name.toLowerCase() || curBgVal === (bg.id || '').toLowerCase();
    return `
      <button type="button" class="ddb-bg-chip ${isAct ? 'active' : ''}" onclick="selectModalBackgroundChip('${bg.name.replace(/'/g, "\\'")}')" title="${bg.name}: Perícias ${(bg.skillLabels || []).join(' & ')}">
        ${bg.icon || '📜'} ${bg.name}
      </button>
    `;
  }).join('');
}

function selectModalBackgroundChip(bgName) {
  if (!bgName) return;
  if (typeof document !== 'undefined') {
    const inp = document.getElementById('pm-background');
    if (inp) inp.value = bgName;
  }
  onModalBackgroundChange(bgName);
  return bgName;
}

function getModalTraitSuggestionsData() {
  const bgVal = typeof document !== 'undefined' ? (document.getElementById('pm-background')?.value || 'Soldado') : 'Soldado';
  const bg = findBackgroundData(bgVal) || (typeof BACKGROUNDS_DATA !== 'undefined' && BACKGROUNDS_DATA[0] ? BACKGROUNDS_DATA[0] : null);

  const classSel = typeof document !== 'undefined' ? document.getElementById('pm-class-select') : null;
  const curClass = (classSel && classSel.value !== 'custom') ? classSel.value : (typeof document !== 'undefined' ? (document.getElementById('pm-class')?.value || 'Guerreiro') : 'Guerreiro');
  const clsEq = typeof getClassStartingEquipmentData === 'function' ? getClassStartingEquipmentData(curClass) : null;

  const buildList = (bgArr, clsArr) => {
    const items = [];
    if (bg && Array.isArray(bgArr)) {
      bgArr.forEach(text => items.push({ sourceType: 'bg', sourceName: bg.name, text }));
    }
    if (clsEq && Array.isArray(clsArr)) {
      clsArr.forEach(text => items.push({ sourceType: 'cls', sourceName: clsEq.className, text }));
    }
    return items;
  };

  return {
    personality: buildList(bg ? bg.personalityTraits : [], clsEq && clsEq.traitSuggestions ? clsEq.traitSuggestions.personality : []),
    ideal: buildList(bg ? bg.ideals : [], clsEq && clsEq.traitSuggestions ? clsEq.traitSuggestions.ideal : []),
    bond: buildList(bg ? bg.bonds : [], clsEq && clsEq.traitSuggestions ? clsEq.traitSuggestions.bond : []),
    flaw: buildList(bg ? bg.flaws : [], clsEq && clsEq.traitSuggestions ? clsEq.traitSuggestions.flaw : [])
  };
}

function renderModalTraitSuggestions() {
  if (typeof document === 'undefined') return;
  const data = getModalTraitSuggestionsData();
  const fieldMap = [
    { key: 'personality', inpId: 'pm-personality', boxId: 'ddb-suggestions-personality' },
    { key: 'ideal', inpId: 'pm-ideal', boxId: 'ddb-suggestions-ideal' },
    { key: 'bond', inpId: 'pm-bond', boxId: 'ddb-suggestions-bond' },
    { key: 'flaw', inpId: 'pm-flaw', boxId: 'ddb-suggestions-flaw' }
  ];

  fieldMap.forEach(f => {
    const box = document.getElementById(f.boxId);
    if (!box) return;
    const curVal = (document.getElementById(f.inpId)?.value || '').trim();
    const list = data[f.key] || [];
    box.innerHTML = list.map((item, idx) => {
      const isAct = curVal && curVal === item.text;
      const safeText = item.text.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '&quot;');
      return `
        <button type="button" class="ddb-trait-suggestion-chip ${isAct ? 'active' : ''}"
                onclick="pickModalTraitSuggestion('${f.key}', '${safeText}')">
          <span class="ddb-trait-suggestion-tag ${item.sourceType === 'cls' ? 'cls' : ''}">${item.sourceType === 'cls' ? '⚔️ ' : '📜 '}${item.sourceName}</span>
          <span>${item.text}</span>
        </button>
      `;
    }).join('');
  });
}

function pickModalTraitSuggestion(fieldKey, textValue) {
  const idMap = {
    personality: 'pm-personality',
    ideal: 'pm-ideal',
    bond: 'pm-bond',
    flaw: 'pm-flaw'
  };
  const targetId = idMap[fieldKey];
  if (!targetId) return null;
  if (typeof document !== 'undefined') {
    const inp = document.getElementById(targetId);
    if (inp) inp.value = textValue;
  }
  renderModalTraitSuggestions();
  if (typeof showToast === 'function') {
    showToast('✨ Sugestão de traço aplicada na ficha!', 'success');
  }
  return textValue;
}

function renderModalSpeciesBuilderCards() {
  if (typeof document === 'undefined' || typeof SPECIES_DATA === 'undefined') return;
  const listEl = document.getElementById('ddb-species-cards-list');
  if (!listEl) return;

  const raceSel = document.getElementById('pm-race-select');
  const curRace = (raceSel && raceSel.value !== 'custom') ? raceSel.value : (document.getElementById('pm-race')?.value || 'Humano');
  const normCur = String(curRace).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

  listEl.innerHTML = SPECIES_DATA.map(sp => {
    const normSp = String(sp.name).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
    const lineages = Array.isArray(sp.lineages) ? sp.lineages : [];
    const hasLineageMatch = lineages.some(l => normCur === String(l.name).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim());
    const isSel = normSp === normCur || normCur.includes(normSp) || hasLineageMatch;
    const srcLabel = sp.source || 'Livro do Jogador (2014)';

    return `
      <div class="ddb-entity-card ${isSel ? 'selected' : ''}" onclick="selectModalSpeciesCard('${sp.name.replace(/'/g, "\\'")}')">
        <div class="ddb-entity-card-top">
          <div class="ddb-entity-icon">${sp.icon || '🧬'}</div>
          <div>
            <div class="ddb-entity-title">${sp.name} ${lineages.length > 1 ? `<span style="color:#94a3b8; font-weight:700;">(${lineages.length})</span>` : ''}</div>
            <div class="ddb-entity-meta">${srcLabel} • ${sp.abilityScoreSummary || ''}</div>
          </div>
          <span class="ddb-entity-chevron">${isSel ? '✓' : '❯'}</span>
        </div>
        ${isSel ? `
          <div class="ddb-lineage-pills" onclick="event.stopPropagation()">
            ${lineages.map(lin => {
      const isLinAct = normCur === String(lin.name).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
      return `<button type="button" class="ddb-lineage-pill ${isLinAct ? 'active' : ''}" onclick="selectModalSpeciesCard('${lin.name.replace(/'/g, "\\'")}', '${sp.name.replace(/'/g, "\\'")}')">${lin.icon || '✨'} ${lin.name}</button>`;
    }).join('')}
          </div>
          <div style="font-size: 10px; color: #cbd5e1; margin-top: 4px; line-height: 1.35;">
            <b>Deslocamento:</b> ${sp.speed || '9 metros'} | <b>Traços:</b> ${(sp.traits || []).map(t => t.name).join(', ')}
          </div>
        ` : ''}
      </div>
    `;
  }).join('');
}

function selectModalSpeciesCard(raceOrLineageName, parentSpeciesName) {
  if (!raceOrLineageName) return null;
  if (typeof document !== 'undefined') {
    const raceSel = document.getElementById('pm-race-select');
    const raceInp = document.getElementById('pm-race');
    if (raceSel) {
      const targetLookup = parentSpeciesName || raceOrLineageName;
      const match = Array.from(raceSel.options).find(o => o.value.toLowerCase() === targetLookup.toLowerCase());
      if (match) raceSel.value = match.value;
    }
    if (raceInp) raceInp.value = raceOrLineageName;

    // Se selecionou uma sub-raça específica (ex: Alto Elfo, Anão da Montanha), garante que getRacialAbilityBonuses a utilize
    if (parentSpeciesName && raceSel && raceOrLineageName !== parentSpeciesName) {
      let opt = Array.from(raceSel.options).find(o => o.value.toLowerCase() === raceOrLineageName.toLowerCase());
      if (!opt) {
        opt = document.createElement('option');
        opt.value = raceOrLineageName;
        opt.textContent = `✨ ${raceOrLineageName}`;
        raceSel.appendChild(opt);
      }
      raceSel.value = raceOrLineageName;
    }
    onPlayerModalClassOrLevelChange();
    updateModalAttributeModifiers();
    updateModalCalculatedAc();
  }
  return raceOrLineageName;
}

function setModalStartingEquipmentMode(mode) {
  activeDdbEquipMode = (mode === 'gold') ? 'gold' : 'equipment';
  if (typeof document !== 'undefined') {
    const btnItems = document.getElementById('btn-ddb-equip-mode-items');
    const btnGold = document.getElementById('btn-ddb-equip-mode-gold');
    const boxItems = document.getElementById('ddb-starting-equipment-box');
    const boxGold = document.getElementById('ddb-starting-gold-box');

    if (btnItems) btnItems.classList.toggle('active', activeDdbEquipMode === 'equipment');
    if (btnGold) btnGold.classList.toggle('active', activeDdbEquipMode === 'gold');
    if (boxItems) boxItems.style.display = activeDdbEquipMode === 'equipment' ? 'block' : 'none';
    if (boxGold) boxGold.style.display = activeDdbEquipMode === 'gold' ? 'block' : 'none';
  }
  renderModalStartingEquipmentChoices();
  return activeDdbEquipMode;
}

function renderModalStartingEquipmentChoices() {
  if (typeof document === 'undefined') return;
  const equipBox = document.getElementById('ddb-starting-equipment-box');
  const goldBox = document.getElementById('ddb-starting-gold-box');
  if (!equipBox && !goldBox) return;

  const classSel = document.getElementById('pm-class-select');
  const curClass = (classSel && classSel.value !== 'custom') ? classSel.value : (document.getElementById('pm-class')?.value || 'Guerreiro');
  const clsEq = typeof getClassStartingEquipmentData === 'function' ? getClassStartingEquipmentData(curClass) : null;
  if (!clsEq) return;

  const bgVal = document.getElementById('pm-background')?.value || 'Soldado';
  const bg = findBackgroundData(bgVal);

  if (typeof window !== 'undefined' && (!window._modalStartingEquipChoices || typeof window._modalStartingEquipChoices !== 'object')) {
    window._modalStartingEquipChoices = {};
  }
  const choiceState = (typeof window !== 'undefined' && window._modalStartingEquipChoices) ? window._modalStartingEquipChoices : {};

  if (equipBox) {
    const choicesHtml = (clsEq.choices || []).map(ch => {
      const selectedKey = choiceState[ch.id] || (ch.options && ch.options[0] ? ch.options[0].key : 'a');
      choiceState[ch.id] = selectedKey;
      return `
        <div class="ddb-equip-choice-card">
          <div class="ddb-equip-choice-title">⚔️ ${clsEq.className} — ${ch.title}</div>
          ${(ch.options || []).map(opt => `
            <label class="ddb-equip-option-row">
              <input type="radio" name="ddb_eq_${ch.id}" value="${opt.key}" ${selectedKey === opt.key ? 'checked' : ''}
                     onchange="selectModalStartingEquipOption('${ch.id}', '${opt.key}')">
              <span>${opt.label}</span>
            </label>
          `).join('')}
        </div>
      `;
    }).join('');

    const fixedItemsNames = (clsEq.fixedEquipment || []).map(it => `${it.qty > 1 ? it.qty + 'x ' : ''}${it.name}`);
    if (clsEq.fixedArmor && clsEq.fixedArmor !== 'none') fixedItemsNames.unshift(`Armadura: ${clsEq.fixedArmor}`);
    if (clsEq.fixedShield) fixedItemsNames.push('Escudo (+2 CA)');

    const bgEquipNames = bg && Array.isArray(bg.equipmentItems) ? bg.equipmentItems : (bg && Array.isArray(bg.equipment) ? bg.equipment : []);

    equipBox.innerHTML = `
      <div style="margin-top: 8px;">
        ${choicesHtml}
        <div class="ddb-equip-choice-card" style="border-color: rgba(16, 185, 129, 0.3);">
          <div class="ddb-equip-choice-title" style="color: #6ee7b7;">🎒 Equipamento Fixo da Classe (${clsEq.className}) & Antecedente (${bg ? bg.name : bgVal})</div>
          <div style="font-size: 11.5px; color: #cbd5e1; line-height: 1.45;">
            <div>• <b>Itens da Classe:</b> ${fixedItemsNames.length > 0 ? fixedItemsNames.join(', ') : 'Conforme escolhas acima'}</div>
            ${bg ? `<div>• <b>Itens do Antecedente (${bg.name}):</b> ${bgEquipNames.join(', ')} + <b>${bg.startingGold || 10} PO</b></div>` : ''}
          </div>
        </div>
        <button type="button" class="btn-action" style="width: 100%; justify-content: center; padding: 9px 14px; font-size: 12.5px; font-weight: 800; background: linear-gradient(135deg, #10b981, #059669);" onclick="applyModalStartingEquipmentToSheet()">
          🎒 Aplicar Equipamento Inicial Selecionado na Ficha
        </button>
      </div>
    `;
  }

  if (goldBox) {
    goldBox.innerHTML = `
      <div class="ddb-equip-choice-card" style="text-align: center; padding: 16px;">
        <div style="font-size: 13px; font-weight: 800; color: #fde68a;">🪙 Riqueza Inicial Oficial por Classe (${clsEq.className})</div>
        <div style="font-size: 12px; color: #cbd5e1; margin: 6px 0 12px 0;">
          Fórmula do Livro do Jogador: <b style="color:#fff;">${clsEq.startingGoldFormula}</b> (Média: ${clsEq.avgGold} PO)
        </div>
        <button type="button" class="btn-action" style="padding: 8px 18px; font-size: 12px; font-weight: 800;" onclick="rollModalStartingClassGold()">
          🎲 Rolar Ouro Inicial (${clsEq.startingGoldFormula})
        </button>
      </div>
    `;
  }
}

function selectModalStartingEquipOption(choiceId, optionKey) {
  if (!choiceId || !optionKey) return;
  if (typeof window !== 'undefined') {
    if (!window._modalStartingEquipChoices) window._modalStartingEquipChoices = {};
    window._modalStartingEquipChoices[choiceId] = optionKey;
  }
  return optionKey;
}

function applyModalStartingEquipmentToSheet() {
  const classSel = typeof document !== 'undefined' ? document.getElementById('pm-class-select') : null;
  const curClass = (classSel && classSel.value !== 'custom') ? classSel.value : (typeof document !== 'undefined' ? (document.getElementById('pm-class')?.value || 'Guerreiro') : 'Guerreiro');
  const clsEq = typeof getClassStartingEquipmentData === 'function' ? getClassStartingEquipmentData(curClass) : null;
  if (!clsEq) return null;

  const choiceState = (typeof window !== 'undefined' && window._modalStartingEquipChoices) ? window._modalStartingEquipChoices : {};
  let chosenArmor = clsEq.fixedArmor || 'none';
  let chosenShield = !!clsEq.fixedShield;
  const chosenWeapons = Array.isArray(clsEq.fixedWeapons) ? [...clsEq.fixedWeapons] : [];
  const chosenItems = Array.isArray(clsEq.fixedEquipment) ? JSON.parse(JSON.stringify(clsEq.fixedEquipment)) : [];

  (clsEq.choices || []).forEach(ch => {
    const selKey = choiceState[ch.id] || (ch.options && ch.options[0] ? ch.options[0].key : 'a');
    const opt = (ch.options || []).find(o => o.key === selKey) || (ch.options && ch.options[0]);
    if (!opt) return;
    if (opt.armor) chosenArmor = opt.armor;
    if (opt.shield !== undefined) chosenShield = !!opt.shield;
    if (Array.isArray(opt.weapons)) {
      opt.weapons.forEach(w => {
        if (w && !chosenWeapons.includes(w)) chosenWeapons.push(w);
      });
    }
    if (Array.isArray(opt.items)) {
      opt.items.forEach(it => chosenItems.push({ ...it }));
    }
  });

  // Inclui os itens do Antecedente selecionado
  const bgVal = typeof document !== 'undefined' ? (document.getElementById('pm-background')?.value || 'Soldado') : 'Soldado';
  const bg = findBackgroundData(bgVal);
  const bgItemsList = bg && Array.isArray(bg.equipmentItems) ? bg.equipmentItems : (bg && Array.isArray(bg.equipment) ? bg.equipment : []);
  bgItemsList.forEach(eqName => {
    chosenItems.push({
      name: eqName,
      qty: 1,
      weight: 1,
      category: 'Equipamento de Aventura',
      equipped: false
    });
  });

  // Atualiza Armadura e Escudo no DOM
  if (typeof document !== 'undefined') {
    const armorSel = document.getElementById('pm-armor-select');
    if (armorSel) armorSel.value = chosenArmor || 'none';
    const shieldChk = document.getElementById('pm-shield-check');
    if (shieldChk) shieldChk.checked = !!chosenShield;
    const goldInp = document.getElementById('pm-gold');
    if (goldInp && bg && bg.startingGold) {
      goldInp.value = bg.startingGold;
    }
  }

  modalEquippedWeapons = [...chosenWeapons];
  if (typeof window !== 'undefined') {
    window._modalStartingInventory = chosenItems;
  }

  updateModalCalculatedAc();
  renderModalEquippedWeapons();
  renderModalStartingInventoryList();
  updateDdbHeroSummaryBar();

  if (typeof playFX === 'function') playFX('sword');
  if (typeof showToast === 'function') {
    showToast(`🎒 Equipamento inicial de ${clsEq.className} aplicado (Armas: ${chosenWeapons.join(', ') || 'Padrão'}, Itens na mochila: ${chosenItems.length})!`, 'success');
  }

  return {
    className: clsEq.className,
    armor: chosenArmor,
    shield: chosenShield,
    weapons: modalEquippedWeapons,
    inventory: chosenItems
  };
}

function rollModalStartingClassGold() {
  const classSel = typeof document !== 'undefined' ? document.getElementById('pm-class-select') : null;
  const curClass = (classSel && classSel.value !== 'custom') ? classSel.value : (typeof document !== 'undefined' ? (document.getElementById('pm-class')?.value || 'Guerreiro') : 'Guerreiro');
  const clsEq = typeof getClassStartingEquipmentData === 'function' ? getClassStartingEquipmentData(curClass) : null;
  if (!clsEq) return 0;

  let sum = 0;
  const count = clsEq.diceCount || 4;
  const sides = clsEq.diceSides || 4;
  const mult = clsEq.multiplier || 10;
  for (let i = 0; i < count; i++) {
    sum += Math.floor(Math.random() * sides) + 1;
  }
  const totalGold = sum * mult;

  if (typeof document !== 'undefined') {
    const goldInp = document.getElementById('pm-gold');
    if (goldInp) goldInp.value = totalGold;
  }
  updateDdbHeroSummaryBar();
  if (typeof playFX === 'function') playFX('dice');
  if (typeof showToast === 'function') {
    showToast(`🪙 Ouro inicial rolado (${clsEq.startingGoldFormula}): ${totalGold} PO!`, 'success');
  }
  return totalGold;
}

function renderModalStartingInventoryList() {
  if (typeof document === 'undefined') return;
  const listEl = document.getElementById('ddb-modal-inventory-list');
  const headingEl = document.getElementById('ddb-current-inv-heading');
  if (!listEl) return;

  const items = (typeof window !== 'undefined' && Array.isArray(window._modalStartingInventory)) ? window._modalStartingInventory : [];
  let totalWeight = 0;
  items.forEach(it => {
    totalWeight += (parseFloat(it.weight) || 0) * (parseInt(it.qty, 10) || 1);
  });

  if (headingEl) {
    headingEl.textContent = `Inventário & Moedas (${items.length} itens na mochila • Peso: ${totalWeight.toFixed(1)} kg)`;
  }

  if (items.length === 0) {
    listEl.innerHTML = `<span style="font-size: 11px; color: var(--text-muted);">Nenhum item extra na mochila ainda. Clique em "🎒 Aplicar Equipamento Inicial Selecionado na Ficha" acima ou adicione itens manualmente.</span>`;
    return;
  }

  listEl.innerHTML = items.map((it, idx) => `
    <span class="ddb-inv-item-pill">
      <span>📦 ${it.qty > 1 ? `<b>${it.qty}x</b> ` : ''}${it.name}</span>
      <button type="button" class="ddb-inv-item-del" onclick="removeModalStartingInventoryItem(${idx})" title="Remover item">✕</button>
    </span>
  `).join('');
}

function addExtraItemToModalInventory(itemNameParam) {
  const rawName = itemNameParam !== undefined ? itemNameParam : (typeof document !== 'undefined' ? (document.getElementById('ddb-inp-extra-item')?.value || '') : '');
  const cleanName = String(rawName).trim();
  if (!cleanName) return null;

  if (typeof window !== 'undefined') {
    if (!Array.isArray(window._modalStartingInventory)) window._modalStartingInventory = [];
    const eqMatch = (typeof EQUIPMENT_DATA !== 'undefined' && Array.isArray(EQUIPMENT_DATA))
      ? EQUIPMENT_DATA.find(e => e.name.toLowerCase() === cleanName.toLowerCase())
      : null;
    window._modalStartingInventory.push({
      name: eqMatch ? eqMatch.name : cleanName,
      qty: 1,
      weight: eqMatch && eqMatch.weight ? parseFloat(eqMatch.weight) || 1 : 1,
      category: eqMatch && eqMatch.category ? eqMatch.category : 'Equipamento de Aventura',
      equipped: false
    });
  }

  if (typeof document !== 'undefined') {
    const inp = document.getElementById('ddb-inp-extra-item');
    if (inp) inp.value = '';
  }
  renderModalStartingInventoryList();
  return cleanName;
}

function removeModalStartingInventoryItem(index) {
  if (typeof window !== 'undefined' && Array.isArray(window._modalStartingInventory)) {
    if (index >= 0 && index < window._modalStartingInventory.length) {
      window._modalStartingInventory.splice(index, 1);
    }
  }
  renderModalStartingInventoryList();
}

// ==========================================================================
// 📜 ITEM 1: GERADOR INTERATIVO "ESTA É A SUA VIDA" (XANATHAR CAP. 1 - ISSUE-161)
// ==========================================================================

function rollXanatharLifePathModal(mode = 'all') {
  const tables = (typeof XANATHAR_LIFE_EVENTS_TABLES !== 'undefined') ? XANATHAR_LIFE_EVENTS_TABLES : null;
  if (!tables) return null;

  const pick = (arr) => Array.isArray(arr) && arr.length > 0 ? arr[Math.floor(Math.random() * arr.length)] : '';
  const classSel = typeof document !== 'undefined' ? document.getElementById('pm-class-select') : null;
  const curClass = (classSel && classSel.value !== 'custom') ? classSel.value : (typeof document !== 'undefined' ? (document.getElementById('pm-class')?.value || 'Guerreiro') : 'Guerreiro');

  const birthplace = pick(tables.birthplace);
  const parents = pick(tables.parents);
  const siblings = pick(tables.siblings);
  const childhood = pick(tables.childhoodMemories);
  const classOrigin = (tables.classTraining && tables.classTraining[curClass]) ? tables.classTraining[curClass] : 'Despertou sua vocação de aventureiro enfrentando perigos reais.';
  const event1 = pick(tables.lifeEvents);
  const event2 = pick(tables.lifeEvents.filter(e => e !== event1)) || event1;
  const ally = pick(tables.allies);
  const enemy = pick(tables.enemies);

  const backstoryEl = typeof document !== 'undefined' ? document.getElementById('pm-backstory') : null;
  const alliesEl = typeof document !== 'undefined' ? document.getElementById('pm-allies') : null;
  const enemiesEl = typeof document !== 'undefined' ? document.getElementById('pm-enemies') : null;

  if (mode === 'all' || mode === 'origin') {
    const originParagraph = `• Origem & Família: Nascido ${birthplace.charAt(0).toLowerCase() + birthplace.slice(1)} ${parents} Irmãos: ${siblings}\n• Infância: ${childhood}\n• Vocação (${curClass}): ${classOrigin}`;
    if (backstoryEl) {
      if (mode === 'all' || !backstoryEl.value.trim()) {
        const eventsBlock = mode === 'all' && event1
          ? `\n• Eventos de Vida (${event1.category}): ${event1.text}${event2 ? `\n• Marco Adicional (${event2.category}): ${event2.text}` : ''}`
          : '';
        backstoryEl.value = originParagraph + eventsBlock;
      } else {
        backstoryEl.value = backstoryEl.value.trim() + '\n' + originParagraph;
      }
    }
  } else if (mode === 'event' && event1) {
    const evLine = `• Evento de Vida (${event1.category}): ${event1.text}`;
    if (backstoryEl) {
      backstoryEl.value = backstoryEl.value.trim() ? `${backstoryEl.value.trim()}\n${evLine}` : evLine;
    }
  }

  if (mode === 'all' || mode === 'relations') {
    if (alliesEl && ally) alliesEl.value = ally;
    if (enemiesEl && enemy) enemiesEl.value = enemy;
  }

  if (typeof playFX === 'function') playFX('dice');
  if (typeof showToast === 'function') {
    showToast('📜 História "Esta é a Sua Vida" (Guia de Xanathar) gerada na ficha!', 'success');
  }

  return {
    birthplace,
    parents,
    siblings,
    childhood,
    classOrigin,
    event: event1 ? `${event1.category}: ${event1.text}` : '',
    ally,
    enemy,
    backstory: backstoryEl ? backstoryEl.value : ''
  };
}

if (typeof window !== 'undefined') {
  window.initDdbCharacterBuilderModal = initDdbCharacterBuilderModal;
  window.switchPlayerModalStep = switchPlayerModalStep;
  window.nextPlayerModalStep = nextPlayerModalStep;
  window.prevPlayerModalStep = prevPlayerModalStep;
  window.togglePlayerModalAllSteps = togglePlayerModalAllSteps;
  window.updateDdbHeroSummaryBar = updateDdbHeroSummaryBar;
  window.renderModalClassBuilderCards = renderModalClassBuilderCards;
  window.selectModalClassCard = selectModalClassCard;
  window.renderModalClassSkillsPicker = renderModalClassSkillsPicker;
  window.toggleModalClassSkillChoice = toggleModalClassSkillChoice;
  window.renderModalBackgroundQuickChips = renderModalBackgroundQuickChips;
  window.selectModalBackgroundChip = selectModalBackgroundChip;
  window.getModalTraitSuggestionsData = getModalTraitSuggestionsData;
  window.renderModalTraitSuggestions = renderModalTraitSuggestions;
  window.pickModalTraitSuggestion = pickModalTraitSuggestion;
  window.renderModalSpeciesBuilderCards = renderModalSpeciesBuilderCards;
  window.selectModalSpeciesCard = selectModalSpeciesCard;
  window.setModalStartingEquipmentMode = setModalStartingEquipmentMode;
  window.renderModalStartingEquipmentChoices = renderModalStartingEquipmentChoices;
  window.selectModalStartingEquipOption = selectModalStartingEquipOption;
  window.applyModalStartingEquipmentToSheet = applyModalStartingEquipmentToSheet;
  window.rollModalStartingClassGold = rollModalStartingClassGold;
  window.renderModalStartingInventoryList = renderModalStartingInventoryList;
  window.addExtraItemToModalInventory = addExtraItemToModalInventory;
  window.removeModalStartingInventoryItem = removeModalStartingInventoryItem;
  window.rollXanatharLifePathModal = rollXanatharLifePathModal;
  window.removeSpellFromPlayer = removeSpellFromPlayer;
  window.buildPlayerSpellsSummary = buildPlayerSpellsSummary;
  window.parseSpellNamesFromRawText = parseSpellNamesFromRawText;
}

if (typeof global !== 'undefined') {
  global.renderPlayerRacialTraits = renderPlayerRacialTraits;
  global.renderPlayerUnlockedFeatures = renderPlayerUnlockedFeatures;
  global.openTradeItemModal = openTradeItemModal;
  global.closeTradeItemModal = closeTradeItemModal;
  global.adjustTradeQty = adjustTradeQty;
  global.setTradeQtyMax = setTradeQtyMax;
  global.confirmTradeItem = confirmTradeItem;
  global.transferPlayerItem = transferPlayerItem;
  global.openEditPlayerItemModal = openEditPlayerItemModal;
  global.closeEditPlayerItemModal = closeEditPlayerItemModal;
  global.saveEditedPlayerItem = saveEditedPlayerItem;
  global.renderHeroQuickNav = renderHeroQuickNav;
  global.jumpToPlayerCard = jumpToPlayerCard;
  global.setPlayerTraitCategoryFilter = setPlayerTraitCategoryFilter;
  global.handlePlayerTraitSearch = handlePlayerTraitSearch;
  global.togglePlayerTraitsExpandAll = togglePlayerTraitsExpandAll;
  global.togglePlayerFeatureAccordion = togglePlayerFeatureAccordion;
  global.setPlayerSpellCircleFilter = setPlayerSpellCircleFilter;
  global.handlePlayerSpellSearch = handlePlayerSpellSearch;
  global.togglePlayerCircleSlot = togglePlayerCircleSlot;
  global.findBackgroundData = findBackgroundData;
  global.onModalBackgroundChange = onModalBackgroundChange;
  global.rollBackgroundTraitsModal = rollBackgroundTraitsModal;
  global.applyBackgroundBenefitsModal = applyBackgroundBenefitsModal;
  global.initDdbCharacterBuilderModal = initDdbCharacterBuilderModal;
  global.switchPlayerModalStep = switchPlayerModalStep;
  global.nextPlayerModalStep = nextPlayerModalStep;
  global.prevPlayerModalStep = prevPlayerModalStep;
  global.togglePlayerModalAllSteps = togglePlayerModalAllSteps;
  global.updateDdbHeroSummaryBar = updateDdbHeroSummaryBar;
  global.renderModalClassBuilderCards = renderModalClassBuilderCards;
  global.selectModalClassCard = selectModalClassCard;
  global.renderModalClassSkillsPicker = renderModalClassSkillsPicker;
  global.toggleModalClassSkillChoice = toggleModalClassSkillChoice;
  global.renderModalBackgroundQuickChips = renderModalBackgroundQuickChips;
  global.selectModalBackgroundChip = selectModalBackgroundChip;
  global.getModalTraitSuggestionsData = getModalTraitSuggestionsData;
  global.renderModalTraitSuggestions = renderModalTraitSuggestions;
  global.pickModalTraitSuggestion = pickModalTraitSuggestion;
  global.renderModalSpeciesBuilderCards = renderModalSpeciesBuilderCards;
  global.selectModalSpeciesCard = selectModalSpeciesCard;
  global.setModalStartingEquipmentMode = setModalStartingEquipmentMode;
  global.renderModalStartingEquipmentChoices = renderModalStartingEquipmentChoices;
  global.selectModalStartingEquipOption = selectModalStartingEquipOption;
  global.applyModalStartingEquipmentToSheet = applyModalStartingEquipmentToSheet;
  global.rollModalStartingClassGold = rollModalStartingClassGold;
  global.renderModalStartingInventoryList = renderModalStartingInventoryList;
  global.addExtraItemToModalInventory = addExtraItemToModalInventory;
  global.removeModalStartingInventoryItem = removeModalStartingInventoryItem;
  global.rollXanatharLifePathModal = rollXanatharLifePathModal;
  global.removeSpellFromPlayer = removeSpellFromPlayer;
  global.buildPlayerSpellsSummary = buildPlayerSpellsSummary;
  global.getPlayerSpecialClassAttacks = getPlayerSpecialClassAttacks;
  global.parseSpellNamesFromRawText = parseSpellNamesFromRawText;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getPlayerSpecialClassAttacks,
    getRacialAbilityBonuses,
    roll4d6DropLowest,
    rollAttributes4d6Modal,
    applyStandardArrayModal,
    optimizeAttributesForClassModal,
    updateModalAttributeModifiers,
    openAsiChoiceModal,
    closeAsiChoiceModal,
    selectAsiModalMode,
    selectAsiModalFeat,
    filterAsiModalFeats,
    saveAsiChoiceModal,
    formatPlayerFeatureForDisplay,
    getClassAsiLevels,
    isClassAsiLevel,
    getCurrentlyFilteredPlayers,
    getCurrentlySelectedCampaign,
    filterPlayersByCampaign,
    setCampaignFilter,
    clearCampaignFilter,
    populateCampaignFilterOptions,
    formatCleanItemWeight,
    renderPlayerRacialTraits,
    renderPlayerUnlockedFeatures,
    openTradeItemModal,
    closeTradeItemModal,
    adjustTradeQty,
    setTradeQtyMax,
    confirmTradeItem,
    transferPlayerItem,
    openEditPlayerItemModal,
    closeEditPlayerItemModal,
    saveEditedPlayerItem,
    renderHeroQuickNav,
    jumpToPlayerCard,
    setPlayerTraitCategoryFilter,
    handlePlayerTraitSearch,
    togglePlayerTraitsExpandAll,
    togglePlayerFeatureAccordion,
    setPlayerSpellCircleFilter,
    handlePlayerSpellSearch,
    togglePlayerCircleSlot,
    findBackgroundData,
    onModalBackgroundChange,
    rollBackgroundTraitsModal,
    applyBackgroundBenefitsModal,
    initDdbCharacterBuilderModal,
    switchPlayerModalStep,
    nextPlayerModalStep,
    prevPlayerModalStep,
    togglePlayerModalAllSteps,
    updateDdbHeroSummaryBar,
    renderModalClassBuilderCards,
    selectModalClassCard,
    renderModalClassSkillsPicker,
    toggleModalClassSkillChoice,
    renderModalBackgroundQuickChips,
    selectModalBackgroundChip,
    getModalTraitSuggestionsData,
    renderModalTraitSuggestions,
    pickModalTraitSuggestion,
    renderModalSpeciesBuilderCards,
    selectModalSpeciesCard,
    setModalStartingEquipmentMode,
    renderModalStartingEquipmentChoices,
    selectModalStartingEquipOption,
    applyModalStartingEquipmentToSheet,
    rollModalStartingClassGold,
    renderModalStartingInventoryList,
    addExtraItemToModalInventory,
    removeModalStartingInventoryItem,
    rollXanatharLifePathModal,
    removeSpellFromPlayer,
    buildPlayerSpellsSummary,
    parseSpellNamesFromRawText,
    syncPlayerCoinsAndGold,
    getPlayerAmmunitionForItem,
    consumePlayerAmmunition,
    getPlayerExtraAttacksCount,
    openAttackAdvantageMenu,
    closeAttackAdvantageMenu
  };
}




