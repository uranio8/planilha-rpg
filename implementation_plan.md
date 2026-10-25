# Plano de Implementação - Bastiões 2.0: Custos pelo Cofre do Banco, Evolução de NPCs e Automação de Funções por Ícone (ISSUE-133)

Este documento descreve o plano arquitetural para aprofundar a economia e a mecânica do Bastião:
1. **Cobrança Exclusiva pelo Cofre do Banco (`bastion.bank.gold`)**: Upgrades de muralhas, emissão de ordens pagas e salários dos NPCs debitam exclusivamente do Banco da Fortaleza.
2. **Sistema de Evolução e Níveis de Maestria dos NPCs (`npc.level` 1 a 5)**: Melhoria de itens, redução de tempo de produção, missões superiores e reajuste semanal de soldo.
3. **Automação Inteligente de Ícone ➔ Cargo & Especialidade**: Ao escolher o ícone, o cargo padrão e o traço de especialidade são preenchidos instantaneamente, com correção do corte visual do select.
4. **Folha de Pagamento Automática do Staff no Avanço de Turno**.

---

## 🎯 Detalhamento dos Requisitos

### 1. Cobrança Centralizada no Cofre do Banco (`bastion.bank.gold`)
- **Atividades que consomem ouro do Banco**:
  - **Aprimoramento de Muralhas (`promptUpgradeBastionWalls`)**:
    - Paliçada de Madeira: 250 PO debitados de `bastion.bank.gold`.
    - Muralhas de Pedra: 1000 PO debitados de `bastion.bank.gold`.
    - Validação: Se `bastion.bank.gold < custo`, exibe aviso: *"Saldo insuficiente no Cofre do Banco da Fortaleza (Disponível: X PO). Deposite fundos no Banco do Bastião antes de realizar a obra!"*
  - **Ordens de Produção Pagas (`triggerActivateBastionAction`)**:
    - Ao encomendar itens na Forja, Laboratório ou Grêmio de Ladrões com custo em PO (ex: Espada Longa +1 por 200 PO, Poção por 100 PO), o débito ocorre em `bastion.bank.gold`.
  - **Folha Salarial Semanal no Avanço de Turno (`advanceBastionTurn`)**:
    - O custo total semanal dos salários do staff (`totalStaffPayroll`) é debitado automaticamente do Banco.
    - Se o cofre tiver saldo suficiente: registra no extrato bancário do cofre (`-X PO: Pagamento semanal do Staff`).
    - Se não houver saldo suficiente: avisa o Mestre sobre a greve/descontentamento dos especialistas por falta de pagamento.

### 2. Sistema de Nível e Maestria de Especialistas (`npc.level` de 1 a 5)
- **Níveis de Maestria**:
  - ⭐ **Nv 1 - Aprendiz / Prático**: Salário base (2 PO/sem). Produção padrão.
  - ⭐⭐ **Nv 2 - Artífice Qualificado**: Salário (5 PO/sem). Reduz tempo de fabricação das ordens de sua sala em -2 dias.
  - ⭐⭐⭐ **Nv 3 - Mestre de Ofício**: Salário (10 PO/sem). Reduz tempo em -4 dias e permite fabricar itens Incomuns/Raros com 15% de desconto no custo de materiais.
  - ⭐⭐⭐⭐ **Nv 4 - Grão-Mestre**: Salário (20 PO/sem). Reduz tempo pela metade (-7 dias / 1 semana a menos) e desbloqueia missões e itens de prestígio superior.
  - ⭐⭐⭐⭐⭐ **Nv 5 - Lenda Viva**: Salário (35 PO/sem). Produção em dobro (chance de duplicar poções/pergaminhos/armas) e bônus de moral permanente na fortaleza.
- **Progressão do NPC**:
  - O NPC ganha experiência de serviço (turnos trabalhados e ordens concluídas sob sua gestão).
  - O Mestre pode clicar em `[⭐ Promover Especialista]` no card do NPC ou no modal para subir o nível do NPC, ajustando automaticamente o soldo semanal.

### 3. Vínculo Reativo Ícone ➔ Cargo, Especialidade e Correção Visual
- **Mapeamento Automático (`BASTION_STAFF_ICON_PRESETS`)**:
  - 🔨 -> Cargo: *"Armeiro-Chefe / Ferreiro"* | Especialidade: *"Forjamento de armas marciais e armaduras reforçadas"* | Salário: 3 PO
  - ⚗️ -> Cargo: *"Alquimista Chefe"* | Especialidade: *"Manipulação de poções, elixires e reagentes raros"* | Salário: 4 PO
  - 🛡️ -> Cargo: *"Comandante da Guarda"* | Especialidade: *"Defesa tática, treinamento de recrutas e sentinelas"* | Salário: 4 PO
  - 📜 -> Cargo: *"Arquivista & Bibliotecário"* | Especialidade: *"Tradução de textos arcanos, pesquisa e cópia de pergaminhos"* | Salário: 3 PO
  - 🍷 -> Cargo: *"Taverneiro da Fortaleza"* | Especialidade: *"Hospitalidade, culinária festiva e coleta de rumores"* | Salário: 2 PO
  - 🌿 -> Cargo: *"Herbologista & Botânico"* | Especialidade: *"Cultivo de ervas medicinais, antídotos e pomadas curativas"* | Salário: 2 PO
  - 🧙‍♂️ -> Cargo: *"Conselheiro Arcano"* | Especialidade: *"Identificação mágica, rituais e manufatura de maravilhas"* | Salário: 6 PO
  - 🏹 -> Cargo: *"Capitão dos Arqueiros"* | Especialidade: *"Tiro de precisão, fabricação de flechas e vigia elevada"* | Salário: 3 PO
  - 🗝️ -> Cargo: *"Senescal & Administrador"* | Especialidade: *"Gestão contábil, compras da fortaleza e superintendência"* | Salário: 5 PO
  - 🌾 -> Cargo: *"Feitor Agrícola"* | Especialidade: *"Silos de cereais, pomares e abastecimento em cercos"* | Salário: 2 PO
  - 🐴 -> Cargo: *"Mestre dos Cavalos"* | Especialidade: *"Criação de montarias de guerra e carruagens"* | Salário: 3 PO
  - 🍽️ -> Cargo: *"Cozinheiro-Chefe"* | Especialidade: *"Refeições substanciais revigorantes (+1 dado de vida)"* | Salário: 2 PO
  - ⚖️ -> Cargo: *"Tesoureiro do Banco"* | Especialidade: *"Guarda do cofre, investimentos e auditoria de moedas"* | Salário: 4 PO
  - 👤 -> Cargo: *"Especialista Geral"* | Especialidade: *"Manutenção de cômodos e serviços diversos"* | Salário: 2 PO
- **Correção Visual no Modal**:
  - Ajustar o campo do ícone para exibir somente o emoji no botão/select compacto com largura e altura elegantes (52px x 42px), sem texto truncado ou quebrado.
  - Evento `onchange="onBastionStaffIconChange(this.value)"` que preenche o cargo e especialidade automaticamente caso estejam vazios ou padrão.

---

## 🏗️ Módulos e Arquivos Afetados

1. **`src/ui/ui.html`**:
   - Correção do seletor `#sel-bstaff-icon` para layout limpo sem corte de texto e adição de `onchange="onBastionStaffIconChange(this.value)"`.
   - Inclusão do seletor/exibição de Nível de Maestria no `#modal-create-bastion-staff`.
   - Adição do botão/indicador de Promoção de Nível nos cards do staff.
2. **`src/styles/head_css.html`**:
   - Estilos para badges de maestria de NPCs (`.bastion-mastery-badge`, `.mastery-star`).
   - Ajuste de largura e padding em `#sel-bstaff-icon` evitando truncamento.
3. **`src/js/campaigns.js`**:
   - Tabela `BASTION_STAFF_ICON_PRESETS` com mapeamento automático de ícone para cargo, especialidade e salário.
   - Função `onBastionStaffIconChange(icon)`.
   - Função `promoteBastionStaffMember(npcId)` e `calculateBastionStaffBenefits(npc)`.
   - Atualização de `promptUpgradeBastionWalls()` para verificar e debitar de `bastion.bank.gold`.
   - Atualização de `triggerActivateBastionAction()` para verificar e debitar de `bastion.bank.gold`.
   - Atualização de `advanceBastionTurn()` para:
     - Debitar salários do staff de `bastion.bank.gold` com lançamento no extrato do cofre.
     - Aplicar redução de dias e bônus de produção conforme o nível do NPC encarregado da instalação.
4. **`test_runner.js`**:
   - Criação da **Bateria 101**:
     - Teste de débito exclusivo pelo Banco do Bastião para muralhas e ordens.
     - Teste de bloqueio por saldo insuficiente no Banco mesmo havendo ouro no baú geral.
     - Teste de alteração reativa de Cargo e Especialidade ao mudar o Ícone.
     - Teste de evolução de NPC (Nível 1 ➔ Nível 2 ➔ Nível 3) com ajuste salarial e bônus de produção.
     - Teste de liquidação da folha de pagamento semanal do staff debitada do Cofre.
5. **`issues/README.md`**:
   - Registro da **ISSUE-133**.

---

## 🧪 Estratégia de Verificação

1. **Compilação**: `node builder.js`.
2. **Suíte Completa**: `node test_runner.js` (todas as 101 baterias aprovadas).
3. **Validação Visual e Funcional**: Verificação da inexistência de cortes no select de ícone e teste do fluxo bancário.
4. **Commit & Push**: Versionamento atômico e seguro na branch `main`.

---

## ✅ Status de Execução e Checklist de Entrega

- [x] Cobrança centralizada e exclusiva de obras de muralha e ordens de fabricação no Cofre do Banco (`bastion.bank.gold`).
- [x] Bloqueio e feedback ao usuário caso o cofre não tenha saldo suficiente, mesmo com ouro no baú geral.
- [x] Sistema de Níveis e Maestria de Especialistas (⭐ Nv 1 a ⭐⭐⭐⭐⭐ Nv 5) com progressão de soldo semanal.
- [x] Aplicação de benefícios de maestria: redução de tempo de ordens e produção em dobro (2x) no Nível 5.
- [x] Mapeamento reativo de ícone para cargo padrão, especialidade e soldo (`BASTION_STAFF_ICON_PRESETS`).
- [x] Correção do layout visual do select `#sel-bstaff-icon`, eliminando cortes de texto.
- [x] Folha de pagamento semanal debitada do Cofre do Banco com registro detalhado no extrato bancário.
- [x] Compilado standalone atualizado via `node builder.js`.
- [x] Suíte de testes automatizados com 101 baterias aprovada (1789/1789 testes verdes).
- [x] ISSUE-133 documentada em `issues/README.md`.

