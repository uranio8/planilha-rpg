// ========================================================
// TESTE ONLINE LIVE NO SERVIDOR RTDB (turma_principal)
// ========================================================
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

async function runOnlineServerLiveTest() {
  console.log('🌐 ======================================================');
  console.log('   INICIANDO TESTES ONLINE NO SERVIDOR REALTIME DATABASE');
  console.log('   Alvo: ' + FIREBASE_BASE_URL);
  console.log('========================================================\n');

  // 1. Conexão inicial e verificação da sala única
  console.log('📡 [Passo 1/6] Verificando integridade da sala "turma_principal"...');
  const getInitial = await httpRequest(FIREBASE_BASE_URL, 'GET');
  if (getInitial.status !== 200 || !getInitial.data) {
    throw new Error(`Falha ao conectar no servidor Firebase (HTTP ${getInitial.status})`);
  }
  const cloudRoom = getInitial.data;
  let playersList = Array.isArray(cloudRoom.players) ? cloudRoom.players : Object.values(cloudRoom.players || {});
  console.log(`✅ Servidor online respondendo com sucesso! (${playersList.length} heróis encontrados)`);

  const kiraIndex = playersList.findIndex(p => p.name.includes('Yoshigake Kira'));
  if (kiraIndex === -1) {
    throw new Error('Personagem Yoshigake Kira não encontrado no servidor!');
  }
  let kira = playersList[kiraIndex];
  console.log(`👤 Herói Selecionado para Teste: ${kira.name} (${kira.className} Nv ${kira.level})`);
  console.log(`   - PV Inicial: ${kira.hp || kira.currentHp || kira.maxHp || 43}/${kira.maxHp || 43}`);
  console.log(`   - Espaços Gastos Inicial: [${(kira.slotsUsed || [0,0,0,0,0]).join(', ')}]`);

  // 2. Mestre altera funções e estado na mesa
  console.log('\n👑 [Passo 2/6] MESTRE: Alterando funções e estado na mesa...');
  const newMasterHp = 38; // Mestre aplica dano de armadilha
  const newDmNotes = `[Sessão Online ${new Date().toLocaleTimeString()}] Grupo explorando as ruínas esquecidas.`;
  
  // Atualiza Yoshigake Kira e notas do Mestre no servidor
  playersList[kiraIndex].hp = newMasterHp;
  playersList[kiraIndex].currentHp = newMasterHp;
  playersList[kiraIndex].tempHp = 5; // Mestre concedeu 5 PV Temporários
  playersList[kiraIndex].updatedAt = Date.now();
  playersList[kiraIndex].updatedBy = 'master_device_desktop';

  const masterPatchPayload = {
    players: playersList,
    dmNotes: newDmNotes,
    publishedBy: 'master',
    lastUpdatedBy: 'master_device_desktop',
    lastUpdateIso: new Date().toISOString()
  };

  const patchMasterRes = await httpRequest(FIREBASE_BASE_URL, 'PATCH', masterPatchPayload);
  if (patchMasterRes.status !== 200) {
    throw new Error(`Mestre não conseguiu salvar no servidor (HTTP ${patchMasterRes.status})`);
  }
  console.log(`✅ MESTRE salvou no servidor com sucesso:`);
  console.log(`   - PV alterado para: ${newMasterHp} PV (+5 PV Temporários)`);
  console.log(`   - Notas Rápidas do Mestre atualizadas: "${newDmNotes}"`);

  // 3. Aluno verifica se recebeu a atualização do Mestre
  console.log('\n🎒 [Passo 3/6] ALUNO: Consultando servidor do ponto de vista do jogador...');
  const studentPoll = await httpRequest(FIREBASE_BASE_URL, 'GET');
  const studentData = studentPoll.data;
  const studentPlayers = Array.isArray(studentData.players) ? studentData.players : Object.values(studentData.players || {});
  const studentKira = studentPlayers.find(p => p.id === kira.id);

  if (!studentKira) {
    throw new Error('Aluno não encontrou sua ficha no servidor!');
  }
  console.log(`✅ Ficha do Aluno sincronizada na visão do jogador:`);
  console.log(`   - PV recebido na tela do Aluno: ${studentKira.hp || studentKira.currentHp} PV (Esperado: 38)`);
  console.log(`   - PV Temporário recebido: ${studentKira.tempHp} PV (Esperado: 5)`);
  console.log(`   - Notas do Mestre sincronizadas no aparelho do aluno: "${studentData.dmNotes}"`);
  
  if ((studentKira.hp || studentKira.currentHp) !== 38 || studentKira.tempHp !== 5) {
    throw new Error('Falha: Os dados alterados pelo Mestre não refletiram no Aluno!');
  }

  // 4. Aluno conjura uma magia (gastando espaço de 1º círculo)
  console.log('\n✨ [Passo 4/6] ALUNO: Conjurando magia "Bênção" (1º Círculo)...');
  const spellName = 'Bênção';
  const spellLevel = 1;
  const currentSlotsUsed = Array.isArray(studentKira.slotsUsed) ? [...studentKira.slotsUsed] : [0, 0, 0, 0, 0];
  
  // Gasta 1 espaço de 1º círculo
  currentSlotsUsed[spellLevel - 1] = (currentSlotsUsed[spellLevel - 1] || 0) + 1;
  studentKira.slotsUsed = currentSlotsUsed;
  studentKira.concentrationSpell = spellName;
  studentKira.updatedAt = Date.now();
  studentKira.updatedBy = 'student_portal_mobile';

  console.log(`   - Magia conjurada: ${spellName}`);
  console.log(`   - Espaço consumido: 1º Círculo`);
  console.log(`   - Novos slotsUsed do Aluno: [${studentKira.slotsUsed.join(', ')}]`);
  console.log(`   - Concentração iniciada em: ${studentKira.concentrationSpell}`);

  // Simula o executePlayerCloudSave do aluno enviando para o RTDB
  const studentPatchPayload = {
    [`players/${kiraIndex}`]: studentKira,
    publishedBy: 'player',
    lastUpdatedBy: 'student_portal_mobile',
    lastUpdateIso: new Date().toISOString()
  };

  const studentSaveRes = await httpRequest(FIREBASE_BASE_URL, 'PATCH', studentPatchPayload);
  if (studentSaveRes.status !== 200) {
    throw new Error(`Aluno não conseguiu salvar conjuração no servidor (HTTP ${studentSaveRes.status})`);
  }
  console.log(`✅ ALUNO despachou a conjuração para o servidor na nuvem!`);

  // 5. Mestre recebe atualização do Aluno e verifica ficha e combate
  console.log('\n👑 [Passo 5/6] MESTRE: Verificando recebimento da magia e gasto do espaço...');
  const masterCheck = await httpRequest(FIREBASE_BASE_URL, 'GET');
  const masterData = masterCheck.data;
  const updatedPlayers = Array.isArray(masterData.players) ? masterData.players : Object.values(masterData.players || {});
  const masterKiraView = updatedPlayers.find(p => p.id === kira.id);

  console.log(`✅ Verificação do Mestre:`);
  console.log(`   - Último publicador na nuvem: ${masterData.publishedBy}`);
  console.log(`   - Concentração ativa no herói: ${masterKiraView.concentrationSpell}`);
  console.log(`   - Espaços de Magia Gastos no Mestre: [${masterKiraView.slotsUsed.join(', ')}]`);
  console.log(`   - Espaço de 1º Círculo gasto: ${masterKiraView.slotsUsed[0]} (Esperado: 1)`);

  if (masterKiraView.slotsUsed[0] !== 1) {
    throw new Error(`Falha: Espaço de magia não foi atualizado na visão do mestre (obtido: ${masterKiraView.slotsUsed[0]})`);
  }
  if (masterKiraView.concentrationSpell !== 'Bênção') {
    throw new Error(`Falha: Concentração não atualizou no mestre!`);
  }

  // 6. Restauração e limpeza do estado para deixar a mesa pronta
  console.log('\n🧹 [Passo 6/6] Restaurando PV e Espaços de Magia para a mesa original...');
  masterKiraView.hp = 43;
  masterKiraView.currentHp = 43;
  masterKiraView.tempHp = 0;
  masterKiraView.slotsUsed = [0, 0, 0, 0, 0];
  masterKiraView.concentrationSpell = null;
  masterKiraView.updatedAt = Date.now();
  masterKiraView.updatedBy = 'master_clean_reset';

  const resetPayload = {
    [`players/${kiraIndex}`]: masterKiraView,
    publishedBy: 'master',
    lastUpdatedBy: 'master_clean_reset',
    lastUpdateIso: new Date().toISOString()
  };
  await httpRequest(FIREBASE_BASE_URL, 'PATCH', resetPayload);
  console.log(`✅ Estado de ${masterKiraView.name} restaurado para 43/43 PV e slotsUsed zerados [0, 0, 0, 0, 0].`);

  console.log('\n🎉 ======================================================');
  console.log('   TODOS OS TESTES ONLINE NO SERVIDOR PASSARAM COM SUCESSO!');
  console.log('   - Mestre alterou funções e Aluno recebeu em tempo real.');
  console.log('   - Aluno conjurou magia, gastou espaço e Mestre recebeu em tempo real.');
  console.log('========================================================\n');
}

runOnlineServerLiveTest().catch(err => {
  console.error('\n❌ ERRO NO TESTE ONLINE:', err);
  process.exit(1);
});
