# Plano de Implementação — ISSUE-167: Correção Crítica de Persistência de Ouro/Fichas, Resolução de Conflitos de Sincronização (Firebase & BroadcastChannel) e Atualização Imediata no Portal do Jogador

## 1. Contexto & Diagnóstico Completo

O usuário relatou:
> *"algumas informações do sistema estão se perdendo como o ouro, mudança na ficha e tal e as informações não estão sendo atualizadas para os jogadores"*

Após uma investigação profunda em `src/js/players.js`, `src/js/firebase_sync.js`, `src/js/screen_sync.js`, `src/js/campaigns.js` e `src/js/core.js`, identificamos **6 causas raízes interconectadas** que explicam exatamente a perda de moedas, mudanças sobrescritas e falha de recebimento pelos jogadores:

---

### Diagnóstico das Causas Raízes:

1. **Dessincronização Crítica entre `p.gold` e `p.coins.gp` (`src/js/core.js:2169` & `src/js/players.js`)**:
   - O sistema mantém duas propriedades de moedas: `p.gold` (número simples) e `p.coins` (`{ cp, sp, ep, gp, pp }`).
   - No `loadFromLocalStorage()` de `core.js`, havia a regra:
     ```javascript
     if (p.gold !== undefined && p.gold !== p.coins.gp) {
       p.coins.gp = p.gold; // <--- SOBREESCREVIA O OURO DAS MOEDAS COM O VALOR ANTIGO DE p.gold!
     }
     ```
   - Toda vez que moedas eram alteradas no modal de moedas (`p.coins.gp`), ao recarregar ou sincronizar, o valor antigo de `p.gold` sobrescrevia `p.coins.gp`, revertendo o ouro do herói!
   - Na função `adjustPlayerGold(id, amount)`, atualizava apenas `p.gold`, esquecendo de atualizar `p.coins.gp`, sem carimbar `touchPlayer(p)`, sem chamar `syncLocalChangesToFirebase(true)` e sem chamar `broadcastStateSync()`.

2. **Rejeição de Alterações do Mestre no Portal do Jogador (`src/js/firebase_sync.js:639`)**:
   - Quando o Mestre edita uma ficha (ouro, itens, magias, PV, notas), ele publica para a nuvem (`publishedBy: 'master'`).
   - Porém, no celular/navegador do aluno (`applyCloudDataToLocal`), a lógica de mesclagem continha:
     ```javascript
     const isLocalNewer = localPlayerUpdated >= remotePlayerUpdated;
     ```
   - Devido ao sinal `>=` e pequenos desvios de relógio (clock skew) entre celular e PC, `isLocalNewer` avaliava como `true` no celular do aluno.
   - O celular do aluno **rejeitava** o ouro, itens, magias e características enviadas pelo Mestre e mantinha os dados locais antigos (`coins: isLocalNewer ? localChar.coins : remoteP.coins`).
   - Imediatamente depois, o celular do aluno disparava `executePlayerCloudSave()`, enviando os dados velhos de volta para o Firebase, **sobrescrevendo e revertendo as alterações do Mestre no servidor e na planilha!**

3. **Loop de Sobrescrita do Hash da URL (`#pdata=...`) (`src/js/players.js:11867`)**:
   - Ao abrir o link compartilhado com `#pdata=...` (WhatsApp / QR Code), os dados embutidos na URL eram importados.
   - Porém, o `#pdata=` permanecia permanentemente no hash da URL.
   - A cada F5 ou recarregamento do navegador do jogador, o sistema lia novamente o `#pdata=` estático e antigo da URL e sobrescrevia os heróis atualizados em `PLAYERS`, sem checar se a versão local já era mais recente (`updatedAt`), e sem limpar o hash via `history.replaceState`.

4. **BroadcastChannel Incompleto e Sem Persistência (`src/js/screen_sync.js:145`)**:
   - Ao receber `STATE_SYNC` via `BroadcastChannel` (segunda aba/segunda tela/mesmo navegador), `PLAYERS` era atualizado na memória, mas `saveToLocalStorage()` **não era chamado**. Se o jogador atualizasse a aba, tudo se perdia.
   - `updatePlayerPortalBanner()` não era disparado.
   - O payload do `STATE_SYNC` omitia `campaigns` (Campanhas, Baú do Grupo e Cofre da Guilda), impedindo a sincronização em tempo real de itens e tesouros compartilhados.

5. **Ações Sem Despacho de Sincronização Imediata**:
   - `distributeBatchRewards()` (recompensas em lote) não chamava `broadcastStateSync()` e chamava o Firebase com debounce em vez de envio imediato.
   - `adjustPlayerGold()` não chamava sincronização.
   - `withdrawCoinsFromStash()` e `depositCoinsToStash()` em `campaigns.js` não chamavam `broadcastStateSync()`.

---

## 2. Objetivos da Implementação (ISSUE-167)

### 2.1 Unificação e Sincronização Canônica de Ouro e Moedas
- Criar a função canônica `syncPlayerCoinsAndGold(p)`:
  - Garante que `p.coins` sempre exista com `{ cp, sp, ep, gp, pp }`.
  - Garante que `p.gold === p.coins.gp` em **100% das leituras e gravações**.
  - No `loadFromLocalStorage()`, nunca descartar o maior/mais recente valor de ouro entre `p.gold` e `p.coins.gp`.
  - Atualizar `adjustPlayerGold(id, amount)` para sincronizar `p.coins.gp`, carimbar `touchPlayer(p)`, salvar em `localStorage`, sincronizar no Firebase (`syncLocalChangesToFirebase(true)`) e transmitir via `broadcastStateSync()`.

### 2.2 Resolução Definitiva de Conflitos na Nuvem (`firebase_sync.js`)
- Blindar a mesclagem remota no Portal do Jogador:
  - Quando a atualização vem do Mestre (`cloudData.publishedBy === 'master'`):
    - As alterações do Mestre em `coins`, `gold`, `inventory`, `attacks`, `features`, `spells`, `preparedSpells`, `slots`, `hp`, `maxHp`, `notes` e atributos são **canônicas e têm prioridade absoluta**.
    - O celular do aluno adota imediatamente as alterações do Mestre sem descartar dados por timestamps de relógio defasados.
  - Evitar que o Portal do Jogador reenvie dados velhos logo após receber um snapshot do Mestre.
  - Bloquear loops de ping-pong com proteção de flag `isApplyingCloudUpdate`.

### 2.3 Sanitização da URL no Portal do Jogador (`players.js`)
- Ao importar uma ficha via `#pdata=...` na inicialização:
  - Verificar se a ficha local já existente possui dados válidos e mais recentes que os dados embutidos no link.
  - Limpar o hash da URL via `window.history.replaceState(null, '', window.location.pathname + window.location.search)` imediatamente após a importação inicial, impedindo que F5/reloads futuros regridam a ficha.

### 2.4 Blindagem e Expansão do `BroadcastChannel` (`screen_sync.js`)
- No `broadcastStateSync()`:
  - Incluir `campaigns: (typeof CAMPAIGNS_STATE !== 'undefined') ? CAMPAIGNS_STATE : null` no payload transmitido.
- No `onmessage` do `syncChannel`:
  - Salvar imediatamente com `saveToLocalStorage()` ao receber novos dados de jogadores e combate.
  - Chamar `updatePlayerPortalBanner()` e atualizar o Baú do Grupo se `campaigns` estiver presente.
  - Garantir re-renderização completa e responsiva.

---

## 3. Arquivos e Módulos Afetados

| Arquivo | Modificação Planejada |
|---|---|
| `src/js/players.js` | Helper `syncPlayerCoinsAndGold(p)`, sanitização do `#pdata=` com `history.replaceState`, chamada de sync completa em `adjustPlayerGold()` e `distributeBatchRewards()`. |
| `src/js/firebase_sync.js` | Autoridade estrita de `publishedBy === 'master'` sobre moedas, inventário e fichas, eliminação de regressões por clock skew no Portal do Jogador. |
| `src/js/screen_sync.js` | Inclusão de `campaigns` no `broadcastStateSync()`, persistência automática `saveToLocalStorage()` e chamada de `updatePlayerPortalBanner()` no `onmessage`. |
| `src/js/core.js` | Harmonização não-destrutiva de `p.gold` e `p.coins.gp` em `loadFromLocalStorage()` (sem sobrescrever valores maiores de moedas). |
| `src/js/campaigns.js` | Adicionar chamada de `broadcastStateSync()` em transações do Baú do Grupo e Cofre de Bastion. |
| `test_runner.js` | Adicionar **Bateria 136** testando persistência e sincronização de ouro, preservação de moedas e resolução de conflitos Mestre/Jogador. |
| `issues/README.md` | Documentar a resolução da **ISSUE-167**. |

---

## 4. Estratégia de Verificação e Testes
1. Executar `node test_ui_integrity.js` garantindo 100% de integridade nos 617 cliques e 11 abas.
2. Executar `node builder.js` para compilar o HTML standalone atualizado.
3. Executar `node test_runner.js` garantindo 100% de aprovação (2.435+ testes).
4. Executar simulação de transações de moedas, edição de fichas e sincronização bidirecional Mestre ➔ Jogador sem perda de dados.
