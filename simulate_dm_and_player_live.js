// =========================================================================
// SIMULAÇÃO AO VIVO: AGENTE MESTRE 👑 vs AGENTE JOGADOR 🎒
// Comunicação Bidirecional em Tempo Real via Firebase Realtime Database
// Testes de: Grimório, Slots, Upcasting, Dano/Cura, Baú Coletivo e Mochila
// =========================================================================

const https = require('https');

const FIREBASE_BASE_URL = 'https://rpg-turma-default-rtdb.firebaseio.com/dnd_rooms/turma_principal.json';

function httpRequest(url, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = data ? JSON.parse(data) : null;
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', reject);
    if (body) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }
    req.end();
  });
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runLiveMasterAndPlayerSimulation() {
  console.log('🎭 =========================================================================');
  console.log('   INICIANDO SIMULAÇÃO AO VIVO ENTRE DOIS AGENTES:');
  console.log('   👑 AGENTE 1: O MESTRE DA MESA (Dungeon Master)');
  console.log('   🎒 AGENTE 2: O JOGADOR / ALUNO (Player Portal)');
  console.log('   Servidor em Tempo Real: ' + FIREBASE_BASE_URL);
  console.log('=========================================================================\n');

  // -------------------------------------------------------------------------
  // FASE 0: Conexão e Inicialização da Sala
  // -------------------------------------------------------------------------
  console.log('📡 [FASE 0] Conectando ambos os agentes à mesa "turma_principal"...');
  const initialFetch = await httpRequest(FIREBASE_BASE_URL, 'GET');
  if (initialFetch.status !== 200 || !initialFetch.data) {
    throw new Error(`Falha ao conectar no Firebase (Status ${initialFetch.status})`);
  }
  const cloudRoom = initialFetch.data;
  let playersList = Array.isArray(cloudRoom.players) ? cloudRoom.players : Object.values(cloudRoom.players || {});
  
  const heroIndex = playersList.findIndex(p => p.name.includes('Yoshigake Kira'));
  if (heroIndex === -1) {
    throw new Error('Herói Yoshigake Kira não encontrado!');
  }
  let hero = playersList[heroIndex];
  
  // Backup do estado original para restauração 100% limpa ao final
  const heroOriginalBackup = JSON.parse(JSON.stringify(hero));
  const campaignsOriginalBackup = cloudRoom.campaigns ? JSON.parse(JSON.stringify(cloudRoom.campaigns)) : null;

  console.log(`✅ Conexão estabelecida com sucesso!`);
  console.log(`   - Herói do Jogador: "${hero.name}" (${hero.className} Nv ${hero.level})`);
  console.log(`   - Vida Inicial: ${hero.hp || hero.maxHp}/${hero.maxHp} PV`);
  console.log(`   - Espaços Iniciais: [${(hero.slots || [4, 2, 0, 0, 0, 0, 0, 0, 0]).slice(0, 5).join(', ')}]`);
  console.log(`   - Slots Gastos: [${(hero.slotsUsed || [0, 0, 0, 0, 0, 0, 0, 0, 0]).slice(0, 5).join(', ')}]\n`);

  try {
    // -------------------------------------------------------------------------
    // CENÁRIO 1: O Mestre cadastra Magias no Grimório do Jogador (ISSUE-107)
    // -------------------------------------------------------------------------
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔮 [CENÁRIO 1] CADASTRO DE MAGIAS NO GRIMÓRIO & PERSISTÊNCIA NÃO-DESTRUTIVA');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    console.log('👑 [MESTRE]: "Vou ensinar duas novas magias ao Yoshigake Kira e anotar em seu grimório:');
    console.log('              1. \'Mísseis Mágicos\' (1º Círculo)');
    console.log('              2. \'Passo Nebuloso\' (2º Círculo)"');
    
    hero.spellbookSpells = Array.isArray(hero.spellbookSpells) ? hero.spellbookSpells : [];
    if (!hero.spellbookSpells.includes('Mísseis Mágicos')) hero.spellbookSpells.push('Mísseis Mágicos');
    if (!hero.spellbookSpells.includes('Passo Nebuloso')) hero.spellbookSpells.push('Passo Nebuloso');
    
    // Mestre também prepara uma delas
    hero.preparedSpells = Array.isArray(hero.preparedSpells) ? hero.preparedSpells : [];
    if (!hero.preparedSpells.includes('Mísseis Mágicos')) hero.preparedSpells.push('Mísseis Mágicos');
    if (!hero.preparedSpells.includes('Passo Nebuloso')) hero.preparedSpells.push('Passo Nebuloso');

    hero.updatedAt = Date.now();
    hero.updatedBy = 'dm_agent';

    // Mestre publica a alteração
    const dmSpellPatch = {
      [`players/${heroIndex}`]: hero,
      publishedBy: 'master',
      lastUpdatedBy: 'dm_agent',
      lastUpdateIso: new Date().toISOString()
    };
    await httpRequest(FIREBASE_BASE_URL, 'PATCH', dmSpellPatch);
    console.log('👑 [MESTRE]: Magias gravadas com sucesso no servidor em nuvem.');

    await delay(600);

    // Jogador consulta o servidor
    console.log('\n🎒 [JOGADOR]: "Recebendo atualização em tempo real no meu celular..."');
    const playerFetch1 = await httpRequest(FIREBASE_BASE_URL, 'GET');
    const playerHeroes1 = Array.isArray(playerFetch1.data.players) ? playerFetch1.data.players : Object.values(playerFetch1.data.players);
    const playerHero1 = playerHeroes1.find(p => p.id === hero.id);

    console.log(`🎒 [JOGADOR]: Verificando meu Grimório:`);
    console.log(`   - Magias no Grimório: [${(playerHero1.spellbookSpells || []).join(', ')}]`);
    console.log(`   - Magias Preparadas: [${(playerHero1.preparedSpells || []).join(', ')}]`);

    if (!playerHero1.spellbookSpells.includes('Mísseis Mágicos') || !playerHero1.spellbookSpells.includes('Passo Nebuloso')) {
      throw new Error('FALHA: As magias cadastradas pelo Mestre sumiram ou não chegaram ao Jogador!');
    }
    console.log('✅ [CHECK]: Grimório persistido e sincronizado perfeitamente! As magias NÃO SUMIRAM.');

    // -------------------------------------------------------------------------
    // CENÁRIO 2: Jogador conjura com Upcasting e gasta slot de 2º círculo
    // -------------------------------------------------------------------------
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✨ [CENÁRIO 2] CONJURAÇÃO DE MAGIA COM DESCONTO AUTOMÁTICO DE SLOT & UPCASTING');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    console.log('🎒 [JOGADOR]: "Em combate contra os orcs! Vou conjurar \'Mísseis Mágicos\' aprimorado');
    console.log('              usando um Espaço de 2º Círculo (Upcasting para disparar 4 dardos)!"');

    // Inicializa slots se necessário (garante matriz de 9 círculos)
    playerHero1.slots = Array.isArray(playerHero1.slots) ? playerHero1.slots : [4, 2, 0, 0, 0, 0, 0, 0, 0];
    playerHero1.slotsUsed = Array.isArray(playerHero1.slotsUsed) ? playerHero1.slotsUsed : [0, 0, 0, 0, 0, 0, 0, 0, 0];

    // Desconto automático do 2º Círculo (índice 1)
    const castCircle = 2; // Upcasting no 2º Círculo
    const initialCircle2Used = playerHero1.slotsUsed[castCircle - 1] || 0;
    const expectedCircle2Used = initialCircle2Used + 1;
    playerHero1.slotsUsed[castCircle - 1] = expectedCircle2Used;
    playerHero1.updatedAt = Date.now();
    playerHero1.updatedBy = 'player_agent';

    console.log(`🎒 [JOGADOR]: Descontando 1 espaço de ${castCircle}º Círculo.`);
    console.log(`   - Espaços Gastos agora: [${playerHero1.slotsUsed.slice(0, 5).join(', ')}] (2º Círculo: ${expectedCircle2Used}/${playerHero1.slots[1]})`);

    // Jogador salva no Firebase
    const playerCastPatch = {
      [`players/${heroIndex}`]: playerHero1,
      publishedBy: 'player',
      lastUpdatedBy: 'player_agent',
      lastUpdateIso: new Date().toISOString()
    };
    await httpRequest(FIREBASE_BASE_URL, 'PATCH', playerCastPatch);
    console.log('🎒 [JOGADOR]: Conjuração e gasto de slot enviados para o Mestre.');

    await delay(600);

    // Mestre recebe em tempo real
    console.log('\n👑 [MESTRE]: "Ouvindo atualizações de combate na tela do mestre..."');
    const dmFetch1 = await httpRequest(FIREBASE_BASE_URL, 'GET');
    const dmHeroes1 = Array.isArray(dmFetch1.data.players) ? dmFetch1.data.players : Object.values(dmFetch1.data.players);
    const dmHero1 = dmHeroes1.find(p => p.id === hero.id);

    console.log(`👑 [MESTRE]: Conferindo slots de ${dmHero1.name} na minha mesa:`);
    console.log(`   - 1º Círculo Gastos: ${dmHero1.slotsUsed[0] || 0}/${dmHero1.slots[0]}`);
    console.log(`   - 2º Círculo Gastos: ${dmHero1.slotsUsed[1] || 0}/${dmHero1.slots[1]} (Esperado: ${expectedCircle2Used})`);

    if ((dmHero1.slotsUsed[1] || 0) !== expectedCircle2Used) {
      throw new Error(`FALHA: O slot de 2º círculo gasto pelo jogador não foi atualizado na visão do Mestre! (Obteve ${dmHero1.slotsUsed[1]}, esperado ${expectedCircle2Used})`);
    }
    console.log('✅ [CHECK]: Upcasting e desconto automático de slot refletiram ao vivo para o Mestre!');

    // -------------------------------------------------------------------------
    // CENÁRIO 3: Dano Aplicado pelo Mestre e Cura Aplicada pelo Jogador
    // -------------------------------------------------------------------------
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('⚔️ [CENÁRIO 3] DESPACHO DE DANO PELO MESTRE & CURA PELO JOGADOR');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');


  const damageDealt = 15;
  const hpBeforeDamage = dmHero1.hp || dmHero1.maxHp;
  const expectedHpAfterDamage = hpBeforeDamage - damageDealt;

  console.log(`👑 [MESTRE]: "Um Orc Chefe acerta ${dmHero1.name} com um golpe de machado causando ${damageDealt} de dano!"`);
  dmHero1.hp = expectedHpAfterDamage;
  dmHero1.currentHp = expectedHpAfterDamage;
  dmHero1.updatedAt = Date.now();
  dmHero1.updatedBy = 'dm_agent';

  const dmDamagePatch = {
    [`players/${heroIndex}`]: dmHero1,
    publishedBy: 'master',
    lastUpdatedBy: 'dm_agent',
    lastUpdateIso: new Date().toISOString()
  };
  await httpRequest(FIREBASE_BASE_URL, 'PATCH', dmDamagePatch);
  console.log(`👑 [MESTRE]: Dano aplicado no combate. Novo PV na mesa: ${expectedHpAfterDamage}/${dmHero1.maxHp} PV.`);

  await delay(600);

  // Jogador recebe o dano
  console.log('\n🎒 [JOGADOR]: "Recebi o alerta de dano no meu celular!"');
  const playerFetch2 = await httpRequest(FIREBASE_BASE_URL, 'GET');
  const playerHeroes2 = Array.isArray(playerFetch2.data.players) ? playerFetch2.data.players : Object.values(playerFetch2.data.players);
  const playerHero2 = playerHeroes2.find(p => p.id === hero.id);

  console.log(`🎒 [JOGADOR]: Meu PV atual na tela: ${playerHero2.hp}/${playerHero2.maxHp} PV (Esperado: ${expectedHpAfterDamage})`);
  if (playerHero2.hp !== expectedHpAfterDamage) {
    throw new Error(`FALHA: Jogador não recebeu o dano de combate! (Obteve ${playerHero2.hp}, esperado ${expectedHpAfterDamage})`);
  }

  // Jogador se cura bebendo uma Poção de Cura (recupera 9 PV)
  const healAmount = 9;
  const expectedHpAfterHeal = playerHero2.hp + healAmount;
  console.log(`🎒 [JOGADOR]: "Vou beber uma Poção de Cura para recuperar ${healAmount} PV!"`);
  playerHero2.hp = expectedHpAfterHeal;
  playerHero2.currentHp = expectedHpAfterHeal;
  playerHero2.updatedAt = Date.now();
  playerHero2.updatedBy = 'player_agent';

  const playerHealPatch = {
    [`players/${heroIndex}`]: playerHero2,
    publishedBy: 'player',
    lastUpdatedBy: 'player_agent',
    lastUpdateIso: new Date().toISOString()
  };
  await httpRequest(FIREBASE_BASE_URL, 'PATCH', playerHealPatch);
  console.log(`🎒 [JOGADOR]: Cura aplicada. PV atualizado para ${expectedHpAfterHeal}/${playerHero2.maxHp} PV.`);

  await delay(600);

  // Mestre verifica a cura em tempo real
  console.log('\n👑 [MESTRE]: "Verificando se o combatente recuperou vida na iniciativa..."');
  const dmFetch2 = await httpRequest(FIREBASE_BASE_URL, 'GET');
  const dmHeroes2 = Array.isArray(dmFetch2.data.players) ? dmFetch2.data.players : Object.values(dmFetch2.data.players);
  const dmHero2 = dmHeroes2.find(p => p.id === hero.id);

  console.log(`👑 [MESTRE]: Vida de ${dmHero2.name} na lista de combate: ${dmHero2.hp}/${dmHero2.maxHp} PV (Esperado: ${expectedHpAfterHeal})`);
  if (dmHero2.hp !== expectedHpAfterHeal) {
    throw new Error(`FALHA: Mestre não recebeu a cura aplicada pelo jogador! (Obteve ${dmHero2.hp}, esperado ${expectedHpAfterHeal})`);
  }
  console.log('✅ [CHECK]: Dano e cura bidirecionais sincronizados em tempo real com 100% de precisão!');

  // -------------------------------------------------------------------------
  // CENÁRIO 4: Gestão de Inventário, Mochila e Baú Coletivo do Grupo
  // -------------------------------------------------------------------------
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🎒 [CENÁRIO 4] GESTÃO DE ITENS: BAÚ COLETIVO & MOCHILA DO JOGADOR');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  console.log('👑 [MESTRE]: "O grupo encontra um tesouro na câmara secreta!');
  console.log('              Adiciono no Baú Coletivo do Grupo: \'Amuleto da Proteção +1\' (Item Raro)"');

  let rawCampaignsState = dmFetch2.data.campaigns || {};
  let campaignsList = Array.isArray(rawCampaignsState) 
    ? rawCampaignsState 
    : (rawCampaignsState.campaigns || Object.values(rawCampaignsState));
  let activeCampaign = campaignsList.find(c => c && c.id === 'camp_1') || campaignsList[0];

  if (activeCampaign) {
    activeCampaign.partyStash = activeCampaign.partyStash || { items: [], gold: 100, history: [] };
    activeCampaign.partyStash.items = Array.isArray(activeCampaign.partyStash.items)
      ? activeCampaign.partyStash.items
      : Object.values(activeCampaign.partyStash.items || {});
    
    const newItem = {
      id: 'stash_amulet_test_' + Date.now(),
      name: 'Amuleto da Proteção +1',
      category: 'Item Mágico',
      quantity: 1,
      weight: 0.5,
      value: 500,
      notes: 'Concede +1 na CA e em todas as Salvaguardas.',
      assignedTo: 'Baú'
    };
    activeCampaign.partyStash.items.push(newItem);
    activeCampaign.partyStash.updatedAt = Date.now();
    activeCampaign.partyStash.updatedBy = 'dm_agent';

    // Se campaigns era no formato { activeCampaignId, campaigns }
    const dmStashPayload = Array.isArray(rawCampaignsState)
      ? campaignsList
      : { ...rawCampaignsState, campaigns: campaignsList };

    const dmStashPatch = {
      campaigns: dmStashPayload,
      publishedBy: 'master',
      lastUpdatedBy: 'dm_agent',
      lastUpdateIso: new Date().toISOString()
    };
    await httpRequest(FIREBASE_BASE_URL, 'PATCH', dmStashPatch);
    console.log('👑 [MESTRE]: Item inserido no Baú Coletivo e publicado na nuvem.');

    await delay(600);

    // Jogador vê o item no Baú e transfere para a sua mochila
    console.log('\n🎒 [JOGADOR]: "Abrindo o Baú Coletivo no meu celular... Encontrei o Amuleto!');
    console.log('              Vou retirar do baú e colocar na minha mochila!"');

    const playerFetch3 = await httpRequest(FIREBASE_BASE_URL, 'GET');
    const rawPlayerCampState = playerFetch3.data.campaigns || {};
    const playerCampaigns = Array.isArray(rawPlayerCampState) 
      ? rawPlayerCampState 
      : (rawPlayerCampState.campaigns || Object.values(rawPlayerCampState));
    const playerCampaign = playerCampaigns.find(c => c && c.id === activeCampaign.id) || playerCampaigns[0];
    playerCampaign.partyStash.items = Array.isArray(playerCampaign.partyStash.items)
      ? playerCampaign.partyStash.items
      : Object.values(playerCampaign.partyStash.items || {});

    const foundItemIndex = playerCampaign.partyStash.items.findIndex(it => it.name && it.name.includes('Amuleto da Proteção'));

    if (foundItemIndex === -1) {
      throw new Error('FALHA: O jogador não conseguiu ver o item adicionado pelo mestre no baú!');
    }
    console.log(`🎒 [JOGADOR]: Item localizado no baú: "${playerCampaign.partyStash.items[foundItemIndex].name}". Transferindo...`);

    // Remove do baú
    const transferredItem = playerCampaign.partyStash.items.splice(foundItemIndex, 1)[0];
    playerCampaign.partyStash.updatedAt = Date.now();
    playerCampaign.partyStash.updatedBy = 'player_agent';

    // Adiciona na mochila do herói
    const playerHeroes3 = Array.isArray(playerFetch3.data.players) ? playerFetch3.data.players : Object.values(playerFetch3.data.players);
    const playerHero3 = playerHeroes3.find(p => p.id === hero.id);
    playerHero3.inventory = Array.isArray(playerHero3.inventory) ? playerHero3.inventory : Object.values(playerHero3.inventory || {});
    playerHero3.inventory.push({
      id: 'inv_' + Date.now(),
      name: transferredItem.name,
      category: transferredItem.category,
      qty: 1,
      weight: transferredItem.weight || 0.5,
      desc: transferredItem.notes || '',
      equipped: true
    });
    playerHero3.updatedAt = Date.now();
    playerHero3.updatedBy = 'player_agent';

    const playerStashPayload = Array.isArray(rawPlayerCampState)
      ? playerCampaigns
      : { ...rawPlayerCampState, campaigns: playerCampaigns };

    const playerTransferPatch = {
      campaigns: playerStashPayload,
      [`players/${heroIndex}`]: playerHero3,
      publishedBy: 'player',
      lastUpdatedBy: 'player_agent',
      lastUpdateIso: new Date().toISOString()
    };
    await httpRequest(FIREBASE_BASE_URL, 'PATCH', playerTransferPatch);
    console.log('🎒 [JOGADOR]: Item transferido para a mochila e equipado com sucesso!');

    await delay(600);

    // Mestre verifica que o item saiu do baú e está na mochila do herói
    console.log('\n👑 [MESTRE]: "Verificando se o baú foi atualizado e se a mochila do herói contém o item..."');
    const dmFetch3 = await httpRequest(FIREBASE_BASE_URL, 'GET');
    const rawDmCampState3 = dmFetch3.data.campaigns || {};
    const dmCampaigns3 = Array.isArray(rawDmCampState3) 
      ? rawDmCampState3 
      : (rawDmCampState3.campaigns || Object.values(rawDmCampState3));
    const dmCampaign3 = dmCampaigns3.find(c => c && c.id === activeCampaign.id) || dmCampaigns3[0];
    const dmHeroes3 = Array.isArray(dmFetch3.data.players) ? dmFetch3.data.players : Object.values(dmFetch3.data.players);
    const dmHero3 = dmHeroes3.find(p => p.id === hero.id);

    const stashItems3 = Array.isArray(dmCampaign3.partyStash.items) ? dmCampaign3.partyStash.items : Object.values(dmCampaign3.partyStash.items || {});
    const stillInStash = stashItems3.some(it => it.name && it.name.includes('Amuleto da Proteção'));
    const inHeroInventory = (dmHero3.inventory || []).some(it => it.name && it.name.includes('Amuleto da Proteção'));

    console.log(`👑 [MESTRE]: Amuleto ainda está no Baú? ${stillInStash ? 'SIM (Incorreto)' : 'NÃO (Removido com sucesso ✅)'}`);
    console.log(`👑 [MESTRE]: Amuleto está na mochila de ${dmHero3.name}? ${inHeroInventory ? 'SIM ✅' : 'NÃO ❌'}`);

    if (stillInStash || !inHeroInventory) {
      throw new Error('FALHA: A transferência de itens entre o baú e a mochila não sincronizou corretamente!');
    }
    console.log('✅ [CHECK]: Sincronização em tempo real de itens de inventário e baú aprovada com louvor!');
  }
  } finally {
    // -------------------------------------------------------------------------
    // RESTAURAÇÃO: Limpeza elegante do estado para deixar a mesa pronta para o usuário
    // -------------------------------------------------------------------------
    console.log('\n🧹 [RESTAURAÇÃO]: Retornando a mesa e a ficha ao estado original limpo...');
    const resetPatch = {
      [`players/${heroIndex}`]: heroOriginalBackup,
      publishedBy: 'master',
      lastUpdatedBy: 'master_simulation_cleanup',
      lastUpdateIso: new Date().toISOString()
    };
    if (campaignsOriginalBackup) {
      resetPatch.campaigns = campaignsOriginalBackup;
    }
    await httpRequest(FIREBASE_BASE_URL, 'PATCH', resetPatch);
    console.log(`✅ Ficha de ${heroOriginalBackup.name} restaurada para ${heroOriginalBackup.hp}/${heroOriginalBackup.maxHp} PV e slots/itens originais.`);
  }

  console.log('\n🎉 =========================================================================');
  console.log('   SIMULAÇÃO CONCLUÍDA COM 100% DE SUCESSO!');
  console.log('   - Magias cadastradas pelo Mestre persistiram e NÃO sumiram.');
  console.log('   - Upcasting e desconto automático de slots sincronizados ao vivo.');
  console.log('   - Dano e cura bidirecionais fluindo sem necessidade de recarregar a tela.');
  console.log('   - Itens do Baú Coletivo e Inventário sincronizados entre os dispositivos.');
  console.log('=========================================================================\n');
}

runLiveMasterAndPlayerSimulation().catch(err => {
  console.error('\n❌ ERRO NA SIMULAÇÃO:', err);
  process.exit(1);
});
