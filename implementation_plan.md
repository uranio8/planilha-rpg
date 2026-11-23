# 📋 Plano de Implementação: Reformulação do Sistema de Bastião, Correção de Bugs, Felicidade & População (SimCity) e Novo Layout (ISSUE-183)

## 📌 Contexto & Solicitação do Usuário

Após auditar o sistema atual de Bastião, foram identificados valores iniciais hardcoded ("fantasmas"), inconsistências econômicas entre o Baú da Campanha e o Cofre do Bastião, furos mecânicos e sobrecarga visual no topo da tela. O usuário solicitou:
> *"vsmaos melhorar essa mencaica de bastião e reformular esse layout, verifiquei que algumas mecanicas estão meio bugadas e colocando valores que não coloquei, vamos mapear esse sistema para entender melhor como funciona"*
> *"Sim, vamos colocar no plano de implementação a questão de felicidade do bastião que poderá aumentar o numero de pessoas que está nela e a quantidade maxima sera com base no nivel do bastião, tipo sim city por exemplo."*

---

## 🔍 Diagnóstico dos Bugs & Valores Fantasmas Atuais

1. **Valores Hardcoded na Inicialização (`getCampaignBastion` em `src/js/campaigns.js`)**:
   * `renown: 25`, `defenders: 4`, `level: 5` e `turnCount: 1` são injetados automaticamente na criação, fazendo o jogador ver recursos e níveis que nunca adicionou.
2. **Economia Dividida (Baú da Campanha vs Cofre do Bastião)**:
   * `advanceBastionTurn()` credita a renda semanal no **Baú da Campanha** (`partyStash.gold`), mas debita salários do Staff e exige pagamento de ordens exclusivamente do **Cofre do Bastião** (`bank.gold`).
   * O checklist de evolução soma `Baú + Cofre`, mas `confirmBastionSettlementUpgrade()` exige o valor inteiro em uma única fonte.
3. **Bugs Mecânicos**:
   * **Exploit de Renome**: Criar uma sala custa `0 PO` e dá `+25 Renome`, mas `removeBastionFacility()` não remove o renome ao desmantelá-la.
   * **Sobrescrita Silenciosa de Ordem**: `triggerActivateBastionAction()` permite iniciar nova ordem numa sala já ocupada, apagando a anterior sem aviso nem reembolso.
   * **Teto de Defensores Travado**: `advanceBastionTurn()` trava recrutas em `Math.min(12, ...)`, ignorando `tier.maxDefenders` (`4` até `24`).
   * **Uso Residual de `window.prompt`**: Item personalizado em `triggerActivateBastionAction()` ainda usa dois `prompt()` nativos.
4. **Sobrecarga Visual do Layout**:
   * 8 badges no cabeçalho + barra de progresso + 4 cards de pré-requisitos + barra de 5 botões empilhados antes mesmo de mostrar as instalações, além de rolagem longa para Cofre, Staff e Histórico.

---

## 🎯 Objetivos da Implementação (ISSUE-183)

### 1. 🧹 Valores Iniciais Reais & Correção das Mecânicas
* **Inicialização Limpa (`getCampaignBastion`)**:
  * `renown: 0`, `defenders: 0`, `turnCount: 0`, `population: 0`, `happiness: 50` (Estável).
  * `level`: calculado dinamicamente pelo nível dos heróis vinculados à campanha (`getBastionPartyLevel(camp)`), com fallback para `1` se a campanha não tiver heróis (em vez de `5` fixo), permitindo também ajuste manual pelo Mestre no modal de edição.
* **Economia Unificada & Transparente**:
  * Renda territorial semanal e impostos da população passam a ser creditados no **Cofre do Bastião** (`bastion.bank.gold`), sustentando automaticamente o pagamento de Staff e ordens.
  * `triggerActivateBastionAction()` passa a exibir e permitir escolher a fonte de ouro (**Cofre do Bastião** ou **Baú da Campanha**).
* **Blindagem de Regras**:
  * **Proteção de Ordem Ativa**: Bloqueia/alerta com confirmação antes de substituir uma ordem em andamento, evitando perda acidental de ouro.
  * **Teto Dinâmico de Defensores**: Recrutamento e eventos respeitam `tier.maxDefenders` (`4, 8, 12, 16, 24`).
  * **Anti-Exploit de Renome**: Desmantelar uma instalação via `removeBastionFacility()` deduz `-25 Renome` (mínimo `0`).
  * **Fim dos `prompt()` Nativos**: Item personalizado na ordem de fabricação passa a usar campos inline no modal `#modal-bastion-action`.

---

### 2. 😊 Mecânica Estilo SimCity: Felicidade (`happiness`) & População (`population`)
* **Indicador de Felicidade (`0%` a `100%`, inicia em `50%`)**:
  * **5 Estados de Humor da População**:
    * `80–100%` 🤩 **Radiante**: Atrai `+2` a `+3` moradores/semana, **`+25%` na renda territorial** e **`+5` Renome bônus**.
    * `60–79%` 😊 **Feliz**: Atrai `+1` a `+2` moradores/semana e renda normal.
    * `40–59%` 😐 **Estável**: Mantém população (pode atrair `+1` morador se houver segurança e vagas).
    * `20–39%` 😟 **Insatisfeita**: Êxodo de `-1` morador/semana e **`-25%` na renda territorial**.
    * `0–19%` 😠 **Em Crise**: Êxodo de `-2` moradores/semana e **renda territorial suspensa (`0 PO`)**.
  * **Fatores que Influenciam a Felicidade a cada Turno (`advanceBastionTurn`)**:
    * Salários do Staff pagos em dia (`+3%`) vs falta de saldo (`-15%`).
    * Instalações de bem-estar/cultura construídas (Taberna, Jardim, Estufa, Santuário, Teatro: `+3%` cada, máx `+12%`).
    * Muralhas construídas (`+2%` a `+6%` pela sensação de segurança).
    * Ataque sofrido sem defensores (`-15%`) vs defesa bem-sucedida (`+5%`).
    * **Financiar Festival (`fundBastionFestival`)**: Concede **`+20%` de Felicidade** além dos `+30` de Renome.
    * **Controle do Mestre**: Botões rápidos de ajuste narrativo (`-10%` / `+10%`) na sub-aba de Evolução & Cidade.
* **População (`population`) & Capacidade Máxima por Estágio + Nível**:
  * Fórmula clara e exibida na interface (`getBastionMaxPopulation(bastion)`):
    * **Base do Assentamento** (`BASTION_SETTLEMENT_TIERS`): Tier 1 Fazenda (`10`), Tier 2 Aldeia (`30`), Tier 3 Vila (`80`), Tier 4 Cidadela (`200`), Tier 5 Metrópole (`500`).
    * **Bônus pelo Nível do Bastião**: `+ (level × 2)` vagas extras (ex.: Fazenda Nv. 1 = `12` máx; Aldeia Nv. 5 = `40` máx).
  * **Retorno Econômico da Cidade**:
    * Cada `10` moradores ativos gera **`+5 PO` de impostos/comércio local** por semana no Cofre (quando Felicidade $\ge 40\%$).

---

### 3. 🎨 Reformulação Completa do Layout (Abas Internas & Cabeçalho Limpo)
* **Cabeçalho Compacto e Legível**:
  * Exibe apenas Nome, Localização/Lema, Badge do Tier, Nível do Bastião e **4 métricas essenciais** em destaque: `👥 População (X/Máx)`, `😊 Felicidade (X%)`, `👑 Renome` e `🏦 Cofre (X PO)` (mais acesso rápido ao Baú).
* **Sub-Navegação Interna Organizada (`activeBastionSubTab`)**:
  1. `🏛️ Visão Geral & Salas`: Barra enxuta de ações (`Emitir Ordem`, `Adicionar Instalação`, `Editar`, `Avançar Turno`) + Grid de Instalações Especiais (ou Hero Empty State).
  2. `✨ Evolução & Cidade`: Painel SimCity (barra de Felicidade, fatores de humor, População `X/Máx`, impostos gerados, botão de Festival e ajuste do Mestre) + Roadmap & Checklist dos 4 Pilares de Evolução + Muralhas.
  3. `🏦 Cofre & Staff`: Saldo do Cofre, botão Depositar/Sacar e Corpo de Funcionários & Especialistas.
  4. `📜 Crônica & Eventos`: Último evento `d100` e linha do tempo histórica da fortaleza.

---

## 📁 Arquivos e Módulos Afetados

| Arquivo | Componente / Responsabilidade |
|---|---|
| `src/data/bastions.js` | Adição de `baseMaxPopulation` em cada estágio de `BASTION_SETTLEMENT_TIERS` |
| `src/js/campaigns.js` | Inicialização limpa (`0` fantasmas), sincronização de nível do grupo, helpers `getBastionPartyLevel`, `getBastionMaxPopulation`, `getBastionHappinessInfo`, `adjustBastionHappiness`, `switchBastionSubTab`, lógica de felicidade/população em `advanceBastionTurn`, economia unificada, proteção de ordem ativa, anti-exploit de renome, campos inline de item customizado e novo layout com 4 sub-abas |
| `src/ui/ui.html` | Seletor de fonte de ouro e campos de item customizado no `#modal-bastion-action` |
| `src/styles/head_css.html` | Estilos para a barra de sub-abas internas, cabeçalho compacto de 4 KPIs, painel SimCity de Felicidade/População e barra de humor dinâmica |
| `test_runner.js` | Bateria 150 testando valores iniciais limpos, economia no Cofre, anti-exploit, proteção de ordem, cálculo de `maxPopulation`, impacto da Felicidade e renderização das 4 sub-abas |
| `issues/README.md` | Registro oficial da ISSUE-183 |

---

## ⚠️ Possíveis Impactos & Riscos Mitigados

* **Retrocompatibilidade com Campanhas Salvas no `localStorage`**:
  * Bastiões já existentes preservam seu `renown`, `defenders`, `turnCount` e `specialFacilities` atuais; apenas propriedades novas ausentes (`population`, `happiness`) recebem defaults seguros (`0` e `50`) sem apagar progresso de mesas em andamento.
* **Testes Existentes**:
  * Verificar se algum teste da Bateria 148 assumia `renown >= 25` na inicialização e atualizar a asserção caso necessário para refletir o novo comportamento limpo (`renown === 0`).

---

## 🧪 Estratégia de Verificação

1. **Compilação (`node builder.js`)**: Gerar `planilha do rpg.html` e `index.html` sem erros.
2. **Suíte Automatizada (`node test_runner.js`)**: Garantir 100% de aprovação incluindo a nova **Bateria 150**.
3. **Verificação Visual**: Confirmar renderização limpa do cabeçalho, troca entre as 4 sub-abas e atualização reativa de Felicidade/População/Cofre.

---

> ⚠️ **Aguardando sua aprovação explícita para iniciar as alterações nos arquivos sob `src/` conforme a Regra 1 do `AGENTS.md`.**
