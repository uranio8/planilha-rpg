# 📋 Plano de Implementação: Sistema de Evolução de Bastiões (De Fazenda a Metrópole), Renome e Modernização de Modais (ISSUE-181)

## 📌 Contexto & Solicitação do Usuário

O usuário solicitou uma grande evolução no sistema de Bastiões do grupo (D&D 2024 / 5.5):
> *"vamos melhorar os modais aqui, podemos adicionar uma mercanica para os bastiões de tipo "ah, vcs iniciam como uma fazenda, dps upam para vila, etc" para dar um ar de o bastião estar melhorando com base o tempo passa e eles conseguem novas melhorais para ele e até mesmo renome"*

### 🔍 Diagnóstico do Estado Atual:
1. **Falta de Progressão Temática de Povoado**:
   * O bastião atualmente possui apenas um número estático (`bastion.level = 5`), sem transmitir a sensação orgânica de crescimento onde o grupo começa em uma fazenda humilde, acampamento ou refúgio e vai expandindo com o passar das semanas.
2. **Ausência de Sistema de Renome / Prestígio**:
   * Não existe acúmulo de Renome baseado no tempo (semanas ativas), ordens cumpridas, salas construídas ou defesas heróicas contra invasores.
3. **Uso de `window.prompt` Nativo nos Modais de Bastião**:
   * Funções críticas como `promptEditBastionInfo()` e `promptUpgradeBastionWalls()` ainda utilizam diálogos nativos `window.prompt(...)`, que são visualmente pobres, bloqueantes e destoam da interface dark fantasy rica do sistema.

---

## 🎯 Objetivos da Implementação

### 1. 🌾 Estágios Canônicos de Assentamento do Bastião (`BASTION_SETTLEMENT_TIERS`)
Criar uma esteira de 5 estágios progressivos de povoamento:
* **Estágio 1 — 🌾 Fazenda / Refúgio Pioneiro** (Tier 1):
  * *Descrição*: Um lote humilde de terra com cabana de madeira, pasto e vala defensiva. Os primeiros colonos buscam proteção.
  * *Renome Requerido*: 0 a 99 (Título: *Pioneiros Desconhecidos*)
  * *Capacidade de Salas Especiais*: Até 2 instalações
  * *Guarnição Máxima*: 4 defensores
  * *Renda Semanal da Terra*: +10 PO por avanço de turno (trocas agrícolas locais)
* **Estágio 2 — 🏡 Aldeia / Entreposto Fortificado** (Tier 2):
  * *Descrição*: Uma aldeia crescente com artesãos, pequenos comércios e paliçada de troncos.
  * *Renome Requerido*: 100 a 299 (Título: *Aldeia Notável*)
  * *Capacidade de Salas Especiais*: Até 4 instalações
  * *Guarnição Máxima*: 8 defensores
  * *Renda Semanal da Terra*: +25 PO por semana
  * *Requisitos de Evolução*: 2 semanas ativas, 1 sala construída, 100 Renome e 150 PO de obra.
* **Estágio 3 — 🏰 Vila Próspera / Feudo Nobre** (Tier 3):
  * *Descrição*: Uma vila movimentada com guildas incipientes, taverna acolhedora e muralhas de pedra. Peregrinos e mercadores viajam para cá.
  * *Renome Requerido*: 300 a 599 (Título: *Vila Famosa Regional*)
  * *Capacidade de Salas Especiais*: Até 6 instalações
  * *Guarnição Máxima*: 12 defensores
  * *Renda Semanal da Terra*: +60 PO por semana
  * *Requisitos de Evolução*: 4 semanas ativas, 3 salas construídas, 300 Renome e 400 PO de obra.
* **Estágio 4 — 🏯 Cidadela / Cidade Autônoma** (Tier 4):
  * *Descrição*: Um grande centro militar e comercial com portão de ferro, baluartes imponentes, mercado arcano e guarnição regular.
  * *Renome Requerido*: 600 a 999 (Título: *Grande Domínio Continental*)
  * *Capacidade de Salas Especiais*: Até 8 instalações
  * *Guarnição Máxima*: 16 defensores
  * *Renda Semanal da Terra*: +120 PO por semana
  * *Requisitos de Evolução*: 8 semanas ativas, 5 salas construídas, 600 Renome e 1.000 PO de obra.
* **Estágio 5 — 👑 Metrópole Lendária / Fortaleza Capital** (Tier 5):
  * *Descrição*: A joia do reino ou capital soberana. Maravilhas arcanas, fortificações rúnicas e renome lendário por todo o plano.
  * *Renome Requerido*: 1.000+ (Título: *Baluarte Lendário do Mundo*)
  * *Capacidade de Salas Especiais*: Até 12 instalações
  * *Guarnição Máxima*: 24 defensores
  * *Renda Semanal da Terra*: +250 PO por semana
  * *Requisitos de Evolução*: 12 semanas ativas, 7 salas construídas, 1.000 Renome e 2.500 PO de obra.

---

### 2. ⭐ Sistema Dinâmico de Renome & Prestígio (`bastion.renown`)
* O Renome representa a reputação e notoriedade do Bastião no mundo de D&D.
* **Fontes de Ganho de Renome**:
  * **Avançar Turno (7 Dias)**: +10 Renome (comunidade viva e produtiva).
  * **Construir Instalação Especial**: +25 Renome.
  * **Concluir Ordem de Instalação**: +15 Renome.
  * **Defesa Bem-Sucedida de Ataque no d100**: +40 Renome.
  * **Financiar Festival Popular / Banquete** (botão `🎉 Financiar Festival`): Custa 50 PO e concede +30 Renome imediatamente, registrando no log e na crônica.
* **Barra de Progresso de Renome**:
  * Exibida no topo do painel do Bastião com o estágio atual (ex: `🏡 Aldeia Notável`), progresso em barra dourada (`120 / 300 Renome`) e botão de destaque `✨ Evoluir Assentamento` quando os requisitos forem alcançados.

---

### 3. 🎨 Modernização Completa dos Modais de Bastião (Zero `window.prompt`)
1. **Novo Modal: `#modal-bastion-settlement-upgrade` (Evolução de Assentamento)**:
   * Interface visual dark fantasy comparando o estágio atual com o próximo.
   * Checklist visual de requisitos:
     * ⏳ Semanas Ativas (`X / Y`)
     * 🏛️ Instalações Construídas (`X / Y`)
     * ⭐ Pontos de Renome (`X / Y`)
     * 💰 Custo de Obra em PO (com opção de debitar do Cofre do Bastião ou Baú da Campanha).
   * Botão de confirmação de evolução com fanfarra sonora (`playFX('crit')`) e celebração no log da mesa.
2. **Novo Modal: `#modal-bastion-edit-info` (Identidade do Bastião)**:
   * Substitui `promptEditBastionInfo()`.
   * Campos: Nome da Fortaleza, Subtítulo / Tipo de Assentamento (Fazenda, Aldeia, Mina, Abadia, Torre Arcana, Cidadela...), Localização e Lema.
3. **Novo Modal: `#modal-bastion-walls` (Aprimoramento de Muralhas)**:
   * Substitui `promptUpgradeBastionWalls()`.
   * Cards visuais interativos para cada nível de fortificação:
     * *Sem Muralhas* (0 PO, 6d6 ataque invasor)
     * *Paliçada de Troncos Reforçada* (250 PO, 5d6 ataque invasor)
     * *Muralhas de Pedra com Ameias* (1.000 PO, 4d6 ataque invasor)
     * *Baluartes Rúnicos / Adamante* (2.500 PO, 3d6 ataque invasor)
   * Seleção da fonte de pagamento (Cofre do Banco do Bastião ou Baú Coletivo da Campanha) e upgrade com 1 clique.
4. **Refinamento dos Modais de Ordem e Adição de Instalações**:
   * Badges de nível mais claros, feedback sonoro e visual aprimorado.

---

## 📁 Arquivos e Módulos Afetados

| Arquivo | Componente / Responsabilidade |
|---|---|
| `src/data/bastions.js` | Definição da constante `BASTION_SETTLEMENT_TIERS` com os 5 estágios, requisitos, limites de salas e rendas semanais; expansão de `BASTION_WALL_OPTIONS` |
| `src/js/campaigns.js` | Lógica de `bastion.settlementStage`, ganho de `bastion.renown`, rendimento semanal em `advanceBastionTurn()`, novos handlers de modais (`openBastionSettlementUpgradeModal()`, `openEditBastionInfoModal()`, `openBastionWallsModal()`, `fundBastionFestival()`) e exclusão de `window.prompt` |
| `src/ui/ui.html` | Estrutura dos 3 novos modais (`#modal-bastion-settlement-upgrade`, `#modal-bastion-edit-info`, `#modal-bastion-walls`) e barra de progresso de Renome/Povoado |
| `src/styles/head_css.html` | Estilos dos novos modais, cards de muralhas, selos de povoado e barra de progresso dourada de Renome |
| `issues/README.md` | Registro oficial da ISSUE-181 |
| `test_runner.js` | Bateria 148 de testes automatizados cobrindo progressão de assentamento, renome, renda semanal e novos modais |

---

## ⚠️ Possíveis Impactos & Riscos Mitigados

* **Compatibilidade de Fichas e Campanhas Antigas**:
  * Bastiões já existentes no `localStorage` receberão backfill defensivo transparente em `getCampaignBastion(camp)`: se `bastion.settlementStage` não existir, será inferido com base no número de salas ou nível atual (mínimo 1), e `bastion.renown` será inicializado com valor compatível sem perda de dados.
* **Zero Comandos Destrutivos Git**: Preservação total de histórico.
* **100% de Aprovação nos Testes Automatizados**: A suíte de testes garantirá que todas as 147 baterias anteriores continuem passando sem qualquer regressão.

---

## 🧪 Estratégia de Verificação

1. **Testes Automatizados (`node test_runner.js`)**:
   * Nova Bateria 148 validando `BASTION_SETTLEMENT_TIERS`, cálculo de renome, evolução de estágio (Fazenda ➔ Aldeia ➔ Vila), depósito da renda semanal e ausência de `window.prompt` nos modais.
2. **Compilação**:
   * `node builder.js` gerando a build final com integridade garantida.
3. **Verificação Manual e Visual**:
   * Abertura do modal de aprimoramento de assentamento, de edição de informações e de muralhas, testando as interações com 1 clique e a barra de renome.

---

> ⚠️ **Aguardando aprovação explícita do usuário conforme a Regra 1 de `AGENTS.md` para iniciar as alterações no código sob `src/`.**
