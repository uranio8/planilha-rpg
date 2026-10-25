# Plano de Implementação - Aba Própria de Bastiões com Gestão Multi-Campanha (ISSUE-131)

## 📌 Contexto e Objetivos

Atualmente, o sistema de Bastiões Coletivos (D&D 2024 / 5.5 adaptado em PO - ISSUE-118) fica embutido no final da aba de **Campanhas** (`#tab-campaigns`), abaixo do Dashboard, Diário de Sessões, Baú Coletivo e Lacaios Contratados. 

O usuário solicitou:
1. **Aba própria dedicada para os Bastiões**: Uma nova aba no menu principal (`#tab-bastions`), proporcionando foco total à administração da fortaleza.
2. **Seletor de Bastião por Campanha**: O Mestre poderá alternar rapidamente entre os bastiões de cada campanha cadastrada (ex: Mesa 1, Mesa 2) para administrá-los de forma individual e independente, sem misturar instalações, ordens, histórico ou defensores.

---

## 🏗️ Módulos Afetados e Proposta de Solução

### 1. Estrutura HTML da Nova Aba (`src/ui/ui.html`)
- **Adição da Aba na Navegação Principal**:
  - Inserir botão de navegação `🏰 Bastião` na navbar (`.main-navbar` ou no menu dropdown `🛡️ Mestre` / Drawer móvel).
  - Incluir no drawer móvel `#drawer-menu` o item `drawer-btn-bastions`.
- **Criação do Painel `#tab-bastions` (`.tab-pane`)**:
  - Cabeçalho com barra de controles (`.controls-bar`):
    - Seletor de Campanha/Bastião (`#sel-bastion-active-campaign`), permitindo ao Mestre selecionar qual campanha deseja inspecionar/gerenciar.
    - Badges de resumo (Nível, Semana, Defensores, Muralhas, Ouro do Baú).
    - Botões rápidos: `➕ Emitir Ordem`, `🏗️ Nova Instalação`, `🧱 Aprimorar Muralhas`, `🎲 Avançar Turno (7 Dias)`, `✏️ Renomear/Editar Bastião`.
  - Área principal de visualização:
    - Container `#bastion-view-container` onde a fortaleza da campanha selecionada será renderizada de forma rica e limpa.
    - Suporte a empty state elegante caso a campanha selecionada ainda não possua bastião fundado (com botão `🏰 Fundar Bastião da Campanha`).

### 2. Lógica de Gestão e Renderização (`src/js/campaigns.js` e `src/js/core.js`)
- **Gerenciamento do Bastião Ativo na Aba**:
  - Variável de estado `selectedBastionCampaignId`: rastreia a campanha selecionada na aba de Bastiões (inicializada com `CAMPAIGNS_STATE.activeCampaignId`).
  - Função `renderBastionsTab(targetCampId)`:
    - Popula o select `#sel-bastion-active-campaign` com todas as campanhas cadastradas.
    - Resolve a campanha alvo e obtém seu bastião via `getCampaignBastion(camp)`.
    - Renderiza a fortaleza, instalações especiais, patronos e ordens em andamento daquela campanha específica.
  - Função `switchBastionCampaign(campId)`:
    - Atualiza a visualização instantaneamente ao trocar o select, garantindo total isolamento entre campanhas.
  - Atualização dos modais (`openBastionActionModal`, `openBastionAddFacilityModal`, `advanceBastionTurn`):
    - Devem operar sobre a campanha atualmente selecionada na aba (`selectedBastionCampaignId`), permitindo avançar turno, emitir ordens e adicionar instalações na campanha escolhida pelo Mestre.
- **Integração com `switchTab` em `src/js/core.js`**:
  - Tratar `tabId === 'bastions'` chamando `renderBastionsTab()`.
  - Adicionar `'bastions'` à navegação do Mestre e configurar permissão segura para o Portal do Jogador (apenas leitura do bastião de sua própria campanha).

### 3. Estilização Dark Fantasy e Responsividade (`src/styles/head_css.html`)
- Layout panorâmico para a nova aba `#tab-bastions`.
- Adaptação responsiva no mobile: controles em flex-wrap, botões confortáveis e cards táteis de instalações.

---

## 🧪 Estratégia de Testes Automatizados (`test_runner.js`)

Criar a **Bateria 99** em `test_runner.js`:
1. Validar que o HTML compilado contém a nova aba `#tab-bastions` e o seletor `#sel-bastion-active-campaign`.
2. Validar que a função `renderBastionsTab` é exportada e renderiza o bastião da campanha ativa.
3. Validar a alternância entre Campanhas no Bastião (`switchBastionCampaign`):
   - Criar Campanha A com Bastião "Fortaleza da Colina" e Campanha B com Bastião "Torre Arcana".
   - Ao alternar para Campanha B, a interface exibe as instalações e nome da "Torre Arcana" sem interferir na Campanha A.
4. Validar que o avanço de turno e emissão de ordens na aba de Bastiões afetam estritamente a campanha selecionada.

---

## 📋 Status de Conclusão e Governança (AGENTS.md)
- [x] Plano aprovado pelo usuário.
- [x] Código fonte implementado sob `src/ui/ui.html`, `src/styles/head_css.html`, `src/js/core.js` e `src/js/campaigns.js`.
- [x] Compilação realizada com sucesso via `node builder.js`.
- [x] Bateria 99 implementada e 100% aprovada (1717/1717 testes passando).
- [x] Registro efetuado em `issues/README.md`.
