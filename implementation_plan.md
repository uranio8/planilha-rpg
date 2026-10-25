# Plano de Implementação - Correção da Visualização Mobile, Sincronização de Espaços de Magia (Slots) e Resiliência de Nuvem (ISSUE-136)

## 📌 Contexto e Diagnóstico

O usuário enviou duas capturas de tela demonstrando dois problemas críticos no portal mobile de jogadores:
1. **Visualização nos Dispositivos Móveis Comprometida (Espaço Vazio & Rolagem Desgovernada)**:
   - Na captura enviada, a tela do celular exibe um enorme espaço vazio escuro no topo, saltando direto para *"CONDIÇÕES & STATUS"* e *"SENTIDOS PASSIVOS"*, enquanto a barra de vida, dados de combate e atributos sumiram para fora da área visível.
   - **Causa Raiz 1 (Dock Mobile `scrollToPlayerSection`)**:
     A dock inferior fixa possui os botões `Vida`, `Magias`, `Ataques`, `d20`, `Mochila`.
     Ao clicar em `Vida`, a função `scrollToPlayerSection('hp')` não encontrava as classes novas e caía no fallback `.player-card` (um elemento de mais de 3.000 pixels de altura), invocando `.scrollIntoView({ block: 'center' })`. O navegador então centralizava o elemento inteiro, rolando a página para a **metade do card** (exatamente onde começam as Condições & Status), escondendo toda a vida e o cabeçalho no topo.
     Além disso, clicar em `Magias`, `Ataques` ou `Mochila` não alternava a aba ativa do card (`activeRoll20Tab`), fazendo com que o scroll falhasse porque a seção desejada estava com `display: none`.
   - **Causa Raiz 2 (Ordem das 3 Colunas no Mobile)**:
     Em telas estreitas (≤ 1079px), `.roll20-columns-grid` empilhava as colunas na ordem original do DOM:
     *Coluna 1 (18 Perícias - 480px)* ➔ *Coluna 2 (Abas Centrais: Ações, Magias, Inventário)* ➔ *Coluna 3 (Condições e Defesas)*.
     O jogador era obrigado a rolar mais de 500px de perícias antes de visualizar suas magias e ataques.

2. **Espaços de Magia (Spell Slots) Desincronizados entre Mestre e Jogadores**:
   - Conforme reportado: *"há jogadores que conjuraram magias e pro mestre mostra que não tem espaços de magia, mas para os jogadores tem"*.
   - **Causa Raiz A (Slots não auto-calculados de forma universal)**:
     A função `calculateMulticlassSpellSlots(p)` só era disparada no level up ou no clique de lançar magia. Para classes conjuradoras (Mago, Clérigo, Druida, Feiticeiro, Bruxo, Bardo, Paladino, Guardião), se `p.slots` iniciasse zerado `[0, 0, 0, 0, 0]`, o mestre nunca via nenhum slot (0/0) na lista de combate ou na ficha, enquanto o jogador calculava os slots localmente ao conjurar.
   - **Causa Raiz B (Sincronização de Slots e `slotsUsed` no Merge)**:
     No merge de `applyCloudDataToLocal()`, quando o Mestre recebia o herói ou quando o jogador recebia um snapshot da nuvem com slots zerados, os slots podiam ser sobrescritos.
   - **Causa Raiz C (`🔴 Erro de Sync` no Mobile por Timeout Baixo de 5s)**:
     Na primeira captura de tela, o badge superior exibe `🔴 Erro de Sync`. Em `executePlayerCloudSave()`, havia um `safetyTimeout` rígido de apenas 5 segundos (5000ms). Em redes móveis 3G/4G, a latência de SSL e handshake do Firebase frequentemente ultrapassa 5 segundos, fazendo o `Promise.race` abortar com erro e impedir que o gasto de magias chegue à mesa do Mestre.

---

## 🎯 Proposta de Solução Detalhada

### 1. 📱 Correção da Visualização Mobile e Ergonomia da Dock
- **Refatoração Completa de `scrollToPlayerSection(section)`**:
  - Detectar o herói ativo (`activePortalPlayerId` ou primeiro jogador).
  - Ao clicar em `Vida` (`hp`): rolar suavemente até `.roll20-hp-card` com alinhamento `block: 'start'` e compensação do banner fixo.
  - Ao clicar em `Magias` (`spells`): disparar `setPlayerCardRoll20Tab(activeId, 'spells')` para exibir a aba de magias e rolar suavemente até `.roll20-spells-tab-header`.
  - Ao clicar em `Ataques` (`attacks`): disparar `setPlayerCardRoll20Tab(activeId, 'combat')` e rolar até a tabela de ataques.
  - Ao clicar em `Mochila` (`inventory`): disparar `setPlayerCardRoll20Tab(activeId, 'inventory')` e rolar até o inventário.
- **Reorganização de Ordem no Mobile (`src/styles/head_css.html`)**:
  - Em telas mobile/tablet (`@media (max-width: 1079px)`):
    - `.roll20-col-main { order: 1; }`: Abas centrais (Ações, Magias, Inventário) no topo logo abaixo do HP e Atributos.
    - `.roll20-col-side { order: 2; }`: Condições, Sentidos e Defesas.
    - `.roll20-col-skills { order: 3; }`: Perícias e Proficiências no final para consulta.
  - Adicionar `scroll-margin-top: 80px;` em `.roll20-hp-card`, `.roll20-tabs-header` e `.roll20-panel` para que nada fique oculto sob o banner sticky do portal.

### 2. 🔮 Sincronização Universal de Espaços de Magia (Slots D&D 5E)
- **Cálculo Reativo Universal de Espaços de Magia (`ensurePlayerSpellSlots(p)`)**:
  - Em `src/js/players.js`, criar a rotina canônica `ensurePlayerSpellSlots(p)` chamada em `renderPlayers()`, `loadFromLocalStorage()` e `applyCloudDataToLocal()`.
  - Se o herói tiver classe conjuradora e `(!p.slots || p.slots.every(s => s === 0))`, calcula automaticamente os espaços de magia oficiais D&D 5E via `calculateMulticlassSpellSlots(p)`.
  - Garante que `p.slotsUsed` seja sempre um array de 9 posições compatível com `p.slots`.
- **Exibição Confiável no Combate e Ficha do Mestre (`combat.js` e `players.js`)**:
  - No card de combatentes de `combat.js`, se o combatente for do tipo aluno (`c.type === 'player'`), invoca `ensurePlayerSpellSlots(pObj)` para garantir que a mini-barra `combatant-slots-mini` (ex: `1º: 4/4 | 2º: 3/3`) seja sempre renderizada para o Mestre.

### 3. ☁️ Resiliência da Conexão Nuvem e Eliminação de `🔴 Erro de Sync`
- **Timeout Resiliente e Tratamento de Rede Móvel (`firebase_sync.js`)**:
  - Aumentar o `safetyTimeout` de 5s para **15 segundos**, compatível com variações de conexões móveis.
  - No `executePlayerCloudSave()`, unificar o salvamento com fallback transparente: se Realtime DB ou Firestore gravarem com sucesso, marca `🟢 Sincronizado`.
  - Preservar `slots` e `slotsUsed` no merge de `applyCloudDataToLocal()`, garantindo que atualizações do aluno sobre consumo de magia sejam aceitas pelo Mestre e transmitidas ao combate.

---

## 🏗️ Módulos e Arquivos Afetados

1. **`src/styles/head_css.html`**:
   - Reordenação das colunas em `@media (max-width: 1079px)` (`.roll20-col-main` order 1).
   - Ajustes de `scroll-margin-top` para rolagem com banner sticky.
2. **`src/js/players.js`**:
   - Criação de `ensurePlayerSpellSlots(p)` e auto-cálculo de slots para conjuradores em `renderPlayers()`.
   - Refatoração de `scrollToPlayerSection(section)` para alternar abas (`setPlayerCardRoll20Tab`) e rolar com `block: 'start'`.
3. **`src/js/combat.js`**:
   - Garantir resolução de slots de magia no mini-painel de combatentes da fila de iniciativa.
4. **`src/js/firebase_sync.js`**:
   - Aumento do timeout para 15s e resiliência de sync no Realtime DB e Firestore.
   - Blindagem do merge de `slots` e `slotsUsed` no Mestre e Jogadores.
5. **`test_runner.js`**:
   - Adição da **Bateria 104** validando auto-cálculo de slots para conjuradores, persistência de `slotsUsed`, navegação por abas da dock mobile e reordenação responsiva.
6. **`issues/README.md`**:
   - Registro da **ISSUE-136**.

---

## 🧪 Estratégia de Verificação

1. **Compilação**: `node builder.js`.
2. **Suíte Automatizada**: `node test_runner.js` (todas as 104 baterias aprovadas com 100% de sucesso).
3. **Simulação de Dispositivos Móveis**:
   - Validação da alternância de abas pela dock mobile.
   - Verificação de cálculo de slots para Mago Nv 5 (Arkhalis: 4 de 1º, 3 de 2º, 2 de 3º) no Mestre e Jogador.
   - Verificação da sincronização de gastos de slots sem erro de sync.
