# Plano de Implementação - Personalizações do Bastião: Criação de NPCs do Staff & Banco / Cofre da Fortaleza (ISSUE-132)

Este documento especifica a implementação de personalizações avançadas para os Bastiões (D&D 2024 / 5.5):
1. **Acervo de Staff & Criação de NPCs pelo Mestre (Sem Repetição / Cômodos Exclusivos)**.
2. **Banco / Cofre Forte da Fortaleza com Depósitos e Saques pelo Grupo**.

---

## 🎯 Detalhamento dos Requisitos

### 1. Sistema de Staff & Criação de NPCs pelo Mestre (`bastion.staff`)
- **Criação Personalizada**:
  - O Mestre pode criar NPCs exclusivos para cada Bastião através de um modal dedicado (`#modal-create-bastion-staff`).
  - Campos do NPC:
    - **Nome** (ex: *Thorgar Mão-de-Ferro*, *Irmã Selene*, *Capitão Valen*, *Aldous o Escriba*)
    - **Função / Ocupação** (ex: *Mestre Armeiro*, *Alquimista*, *Comandante da Guarda*, *Arquivista*, *Senescal*)
    - **Ícone / Avatar temático** (ex: 🔨, ⚗️, 🛡️, 📜, 🍷, 🌿)
    - **Salário semanal em PO** (padrão 1 a 5 PO ou sem custo se for servo leal)
    - **Traço / Especialidade** (ex: *Especialista em Armas Marciais*, *Mestre de Poções de Cura*)
- **Exclusividade e Alocação por Cômodo (Sem Repetição)**:
  - Cada NPC criado pertence ao acervo daquele Bastião específico (`bastion.staff`).
  - Cada NPC pode estar alocado em no máximo 1 instalação especial por vez (`assignedFacilityId` ou livre).
  - Ao abrir o seletor para designar o responsável de uma instalação (`#modal-assign-bastion-npc`), o sistema lista apenas os NPCs criados que estão **disponíveis** (ou permite reatribuir retirando da sala anterior com confirmação), impedindo duplicar o mesmo NPC em múltiplos cômodos.
  - Exibição de uma lista/painel **👥 Corpo de Funcionários & Especialistas** no Bastião, permitindo ao Mestre ver todos os membros do staff, criar novos, editar ou dispensar.
  - Conexão com ordens: nas ordens de fabricação/pesquisa, o NPC alocado é identificado nominalmente no progresso e conclusão da ordem.

### 2. Banco / Cofre Forte da Fortaleza (`bastion.bank`)
- **Estrutura de Dados**:
  ```javascript
  bastion.bank = {
    gold: 0,
    history: [] // { id, date, amount, type: 'deposit'|'withdraw', source: 'party_stash'|'player', playerName, reason }
  };
  ```
- **Depósito no Banco (`depositToBastionBank`)**:
  - Opção 1: Depositar a partir do **Baú Geral da Campanha** (`camp.partyStash.gold`).
  - Opção 2: Depositar a partir do **Ouro pessoal de um Herói** (`hero.gold` / `hero.coins.gp`).
  - O ouro é debitado da fonte e somado ao cofre da fortaleza com registro no extrato.
- **Saque do Banco (`withdrawFromBastionBank`)**:
  - Retirar ouro do cofre do Bastião e enviar para o Baú Geral ou para o inventário pessoal de um Herói.
  - Validação estrita de saldo insuficiente.
- **Interface e Extrato**:
  - Card dedicado **🏦 Cofre do Bastião** com saldo em PO, botões táteis rápidos `[📥 Depositar]`, `[📤 Sacar]` e `[📜 Extrato Bancário]`.
  - Sincronização em tempo real nas fichas dos jogadores e no Baú do Grupo.

---

## 🏗️ Módulos e Arquivos Afetados

1. **`src/ui/ui.html`**:
   - Modal de Criação / Edição de NPC do Bastião (`#modal-create-bastion-staff`).
   - Modal de Designação de NPC para Instalação (`#modal-assign-bastion-npc`).
   - Modal de Banco do Bastião (`#modal-bastion-bank`) para depósitos, saques e extrato contábil.
   - Painel de Staff de NPCs e Card de Banco dentro da aba de Bastiões (`#tab-bastions`).
2. **`src/styles/head_css.html`**:
   - Estilos Dark Fantasy com temas dourados/bancários e crachás de funcionários (`.bastion-bank-card`, `.bastion-staff-grid`, `.bastion-npc-badge`, `.bank-tx-item`).
3. **`src/js/campaigns.js`**:
   - Gerenciamento de Staff:
     - `getBastionStaff(bastion)`: inicialização defensiva da lista de funcionários.
     - `openCreateBastionStaffModal(npcId = null)` e `closeCreateBastionStaffModal()`.
     - `saveBastionStaffMember()`.
     - `deleteBastionStaffMember(npcId)`.
     - `openAssignBastionNpcModal(facilityId)` e `closeAssignBastionNpcModal()`.
     - `confirmAssignBastionNpc()`.
     - `unassignBastionNpc(facilityId)`.
   - Gerenciamento de Banco:
     - `getBastionBank(bastion)`.
     - `depositToBastionBank(amount, source, playerId, reason)`.
     - `withdrawFromBastionBank(amount, destination, playerId, reason)`.
     - `openBastionBankModal()` e `closeBastionBankModal()`.
     - `renderBastionBankView()`.
   - Atualização de `renderCampaignBastion` e `renderBastionsTab` para renderizar o cofre, o staff e o encarregado de cada sala.
   - Exportações das funções em `module.exports` e em `window`.
4. **`test_runner.js`**:
   - Implementação da **Bateria 100**:
     - Criação de novos NPCs exclusivos pelo Mestre no Bastião.
     - Validação de exclusividade: garantir que um NPC alocado a uma sala não seja duplicado.
     - Teste de depósito e saque de ouro do Banco (via Baú do Grupo e via bolsa do Herói).
     - Teste de isolamento de Staff e Banco entre duas campanhas distintas.
5. **`issues/README.md`**:
   - Registro da **ISSUE-132**.

---

## 🧪 Estratégia de Verificação

1. **Compilação**:
   ```bash
   node builder.js
   ```
2. **Execução da Suíte Completa de Testes**:
   ```bash
   node test_runner.js
   ```
   Validar 100% de sucesso nas 100 baterias de testes automatizados.
3. **Commit & Push**:
   Versionamento seguro e atômico no branch `main`.

---

## 📋 Status de Conclusão e Governança (AGENTS.md)
- [x] Plano aprovado pelo usuário.
- [x] Criação de NPCs exclusivos do Staff de cada Bastião implementada em `src/js/campaigns.js` e `src/ui/ui.html`.
- [x] Exclusividade por cômodo implementada (impedindo repetição do mesmo NPC em múltiplos cômodos).
- [x] Banco & Cofre do Bastião implementado com suporte a depósitos e saques pelo Baú do Grupo e bolsas dos Heróis.
- [x] Recompilado via `node builder.js`.
- [x] Bateria 100 implementada e 100% aprovada (1747/1747 testes passando).
- [x] Registro da ISSUE-132 documentado em `issues/README.md`.
