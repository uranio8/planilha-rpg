# 📋 Plano de Implementação: Melhorias e Correções no Baú do Grupo e Baú dos Personagens (ISSUE-156)

## 📌 Contexto & Objetivos

Após auditoria aprofundada dos fluxos de inventário sob as óticas de **Mestre (DM)** e **Jogadores (Alunos)**, foram identificados gargalos funcionais, inconsistências mecânicas e oportunidades de melhoria no trânsito de itens e moedas entre as mochilas dos heróis e o baú coletivo da campanha:

1. **Preservação de Peso e Metadados na Movimentação de Itens**:
   - **Bug do Peso Hardcoded**: Ao retirar um item do Baú do Grupo para a mochila de um herói (`takePartyItemToPlayer`), o sistema sobrescreve o peso para `weight: 0.5` kg fixo, ignorando o peso real do item (ex: Cota de Malha de 25 kg passa a pesar 0.5 kg). Além disso, `category` e `desc` não são preservados.
   - **Perda de Peso no Depósito**: A função `addItemToPartyStash` não recebe nem armazena `weight`, descartando o peso cadastrado quando o herói guarda o item no baú coletivo.
   - **Transferência de Quantidade Parcial**: Quando um item possui quantidade empilhada (ex: 10x Ração, 5x Poções), o sistema move ou retira apenas 1 unidade fixa por clique, sem permitir escolher a quantidade a transferir.

2. **Fluxo Financeiro Realista de Ouro (Mestre vs Jogador)**:
   - **Depósito e Retirada Sem Impacto na Carteira**: Atualmente, `promptAdjustPartyGold` apenas incrementa ou decrementa o ouro do baú a partir do nada, sem debitar da carteira do jogador ao depositar, nem creditar no saldo pessoal do herói ao retirar. Um jogador podia depositar ouro inexistente ou retirar ouro sem receber na ficha.
   - **Comportamento Distinto por Papel (Role)**:
     - **Como Jogador**: O depósito deve debitar estritamente de `p.gold` / `p.coins.gp` (validando se possui saldo suficiente) e creditar no baú. A retirada deve debitar do baú e creditar na carteira do herói.
     - **Como Mestre**: Deve permitir tanto a injeção/gasto direto de tesouro da aventura (recompensa de masmorra, despesas da mesa) quanto a transferência direta de/para um herói selecionado.
   - **Acesso à Divisão de Ouro no Modal do Baú**: O botão `💰 Dividir Ouro` (`splitPartyGold`) existe apenas na aba restrita de Campanhas do Mestre; no modal `#modal-party-stash-view` acessível aos jogadores, essa funcionalidade não estava disponível.

3. **Interação Tátil de Troca e Doação entre Mochilas (`modal-trade-item`)**:
   - A modal de troca `openTradeItemModal` já possui suporte para selecionar destinatário (outro herói ou Baú do Grupo) e quantidade com botão "Máx", porém **não possuía botão de acesso** nas linhas do inventário da ficha nem no visualizador rápido do item.

4. **Edição Tátil de Itens na Mochila do Personagem ("Baú do Personagem")**:
   - Adicionar a capacidade de editar itens existentes na mochila (nome, peso, notas/efeitos e quantidade) diretamente pela ficha ou pelo visualizador rápido `openItemQuickView`, sem obrigar o jogador a excluir e cadastrar novamente.

5. **Reatividade Instantânea de Carga / Encumbrance**:
   - Garantir que a barra de peso (`carry.totalWeight`) e os status de sobrecarga (Normal, Pesado, Sobrecarregado) recalculem instantaneamente na tela ao enviar itens para o baú do grupo ou resgatá-los.

---

## 🎯 Proposta de Modificações e Módulos Afetados

### 1. `src/js/campaigns.js` (Motor do Baú do Grupo & Transações)
- **Atualizar `addItemToPartyStash`**:
  - Aceitar parâmetro `weight = 0` e persistir `it.weight = Number(weight) || 0`.
  - Se `weight` não for informado, buscar fallback automático no catálogo canônico `EQUIPMENT_DATA`.
- **Atualizar `sendPlayerItemToPartyStash`**:
  - Repassar `item.weight`, `item.category` e `item.desc` para `addItemToPartyStash`.
  - Se o item tiver `qty > 1` e `qty` não for especificado na chamada, solicitar quantidade a transferir (1 até `itemQty`).
- **Atualizar `takePartyItemToPlayer`**:
  - Se o item no baú tiver `it.qty > 1`, solicitar quantidade a retirar (1 até `it.qty`).
  - Copiar fielmente `weight` (preservando o peso do item ou do catálogo), `category` e `desc`.
  - Chamar `touchPlayer(targetPlayer)` e recalcular carga do herói.
- **Aprimorar `promptAdjustPartyGold(type, sourcePlayerId = null)`**:
  - Detectar contexto de chamada (Jogador logado no portal via `activePortalPlayerId`, herói da ficha ativa ou Mestre).
  - **Fluxo Jogador**:
    - Se `type === 'add'`: Exibir saldo do herói, validar `val <= p.gold`, debitar `p.gold` e somar ao baú.
    - Se `type === 'remove'`: Validar `val <= camp.partyStash.gold`, debitar do baú e somar a `p.gold`.
    - Registrar no histórico: `+X PO depositados por [Nome]` ou `-X PO retirados por [Nome]`.
  - **Fluxo Mestre**:
    - Oferecer opção de "Tesouro/Despesa Direta do Grupo" ou "Transferir de/para Herói da Campanha".
- **Exportar `splitPartyGold` para o modal do baú**:
  - Integrar botão `💰 Dividir Ouro` dentro de `#modal-party-stash-view`.

### 2. `src/js/players.js` (Mochila do Personagem, Troca e Ações de Inventário)
- **Adicionar Botão de Troca/Doação nas Linhas do Inventário**:
  - Incluir botão `🤝 Trocar / Doar` que aciona `openTradeItemModal(p.id, idx)`.
- **Integrar Ação de Edição de Item na Mochila**:
  - Permitir edição de nome, peso, quantidade e descrição de itens da mochila via modal rápido ou botão dedicado `✏️`.
- **Preservação de Carga e Sincronização**:
  - Garantir que `touchPlayer` dispare atualização imediata das barras de peso em todas as fichas abertas.

### 3. `src/ui/ui.html` & `src/styles/head_css.html` (Interface & Modais)
- **Modal `#modal-party-stash-view`**:
  - Inserir botão `💰 Dividir Ouro` na barra de ações rápidas do tesouro.
  - Inserir coluna ou badge de peso na tabela de itens guardados no baú.
- **Modal `#modal-party-item`**:
  - Adicionar campo numérico para `Peso Unitário (kg)` ao cadastrar ou editar itens manualmente no baú.

---

## 🧪 Estratégia de Verificação e Testes Automatizados

### Bateria 125 em `test_runner.js`:
1. **Preservação de Peso e Atributos no Trânsito Jogador ➔ Baú**:
   - Jogador transfere item de 25 kg (Cota de Malha) para o Baú do Grupo.
   - Validar que o item no baú possui `weight === 25` e a mochila do jogador perdeu exatamente 25 kg de carga.
2. **Preservação de Peso e Atributos no Trânsito Baú ➔ Jogador**:
   - Jogador retira o item do baú para a mochila.
   - Validar que o item na mochila preserva `weight === 25` (não 0.5 kg), mantendo categoria e descrição.
3. **Transferência Parcial de Quantidade**:
   - Jogador transfere 3 de 10 Tochas para o baú.
   - Validar que a mochila fica com 7x e o baú recebe 3x.
4. **Fluxo Financeiro de Depósito do Jogador**:
   - Herói com 50 PO deposita 20 PO no baú.
   - Validar que o saldo do herói cai para 30 PO e o baú sobe +20 PO.
   - Validar que tentativa de depositar valor maior que o saldo (ex: 100 PO) é rejeitada com alerta.
5. **Fluxo Financeiro de Retirada do Jogador**:
   - Herói retira 15 PO do baú.
   - Validar que o baú subtrai 15 PO e a carteira do herói recebe +15 PO.
   - Validar que tentativa de retirar mais do que o saldo do baú é bloqueada.
6. **Fluxo Financeiro do Mestre**:
   - Mestre injeta tesouro de masmorra (+100 PO) sem debitar heróis.
   - Mestre divide 100 PO entre 4 heróis: cada herói recebe 25 PO e o baú fica com 0 PO.
7. **Troca Direta entre Jogadores (`transferPlayerItem`)**:
   - Herói A transfere 1x Poção para Herói B.
   - Validar débito em A e crédito em B sem passar pelo baú.

---

## 📋 Checklist de Entrega
- [x] Plano de Implementação aprovado pelo usuário.
- [x] Código implementado em `src/js/campaigns.js`, `src/js/players.js` e `src/ui/ui.html`.
- [x] Compilação standalone realizada com `node builder.js`.
- [x] 100% de aprovação na suíte de testes (`node test_runner.js`).
- [x] Registro detalhado no Quadro de Issues (`issues/README.md`).
- [x] Commit semântico e push no Git.
