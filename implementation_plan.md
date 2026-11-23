# 📋 Plano de Implementação: Bastião Vivo — Dilemas & Visitantes, Galeria de Troféus e Lealdade/Missões do Staff (ISSUE-185)

## 📌 Contexto & Solicitação do Usuário

Para tornar o Bastião verdadeiramente vivo e envolvente na mesa (evitando a chamada *"Bastion Bubble"* apontada pela comunidade de D&D 2024 e *Strongholds & Followers*), o usuário aprovou a inclusão dos 3 pilares abaixo:
1. **Dilemas, Petições dos Cidadãos & Visitantes Memoráveis** (com escolhas morais e impacto real).
2. **Galeria de Troféus de Chefões Derrotados** (orgulho visual e bônus temáticos para o grupo).
3. **Vínculo, Lealdade & Missões Pessoais do Staff** (NPCs com história, status Veterano e recompensas exclusivas).

---

## 🎯 Objetivos da Implementação (ISSUE-185)

### 1. 🎭 Dilemas, Petições & Visitantes Memoráveis (`BASTION_DILEMMAS_CATALOG`)
* **Catálogo Rico em `src/data/bastions.js`**:
  * Banco de dilemas e visitantes inspirados em mesas reais de D&D (ex.: *Refugiados nos Portões*, *O Artesão Mestre Escondido*, *O Ex-Monstro Procurando Emprego*, *O Bardo Impostor*, *O Auditor Real*, *Caravana Sob Ataque*, *Artefato Senciente em Greve*).
  * Cada dilema possui **2 ou 3 opções de escolha** com consequências claras (Ouro, População, Felicidade, Renome ou Defensores).
* **Fluxo no Jogo**:
  * A cada turno semanal (`advanceBastionTurn`), se não houver dilema pendente, há chance de surgir uma **Petição / Visitante Pendente** (`bastion.pendingDilemma`), ou o Mestre pode sortear um manualmente (`🎲 Novo Dilema / Visitante`) na sub-aba `✨ Evolução & Cidade`.
  * Os jogadores veem o dilema ativo em destaque no modal somente-leitura para debater e votar em mesa, e o Mestre aplica a decisão escolhida com 1 clique (`resolveBastionDilemma(choiceIdx)`).

---

### 2. 🏆 Galeria de Troféus de Chefões Derrotados (`bastion.trophies`)
* **Registro de Troféus**:
  * Formulário inline rápido na sub-aba `🏛️ Visão Geral & Salas` (e/ou `✨ Evolução & Cidade`) onde o Mestre registra o chefão derrotado:
    * Nome do Monstro/Chefe, ND e Dia/Contexto da vitória.
  * Ao adicionar um troféu, concede imediatamente **`+15 Renome`** e **`+5% Felicidade`** ao Bastião.
  * **Visível para os Jogadores**: A Galeria de Troféus aparece no modal somente-leitura `#modal-player-bastion-view` para que o grupo veja suas conquistas penduradas no Salão Principal.

---

### 3. 🤝 Lealdade, Status Veterano & Missões Pessoais do Staff
* **Evolução dos NPCs (`bastion.staff`)**:
  * Cada especialista contratado passa a ter:
    * `loyalty` (`0` a `100%`, inicia em `50%`).
    * `personalQuest` (Missão Pessoal / Favor opcional definido pelo Mestre ou sorteado de `BASTION_STAFF_QUEST_TEMPLATES`).
    * `questCompleted` (`true/false`) e `veteran` (`true/false` — conquistado ao atingir `80%+` de lealdade ou completar sua missão pessoal).
  * **Impacto Mecânico Real**:
    * Pagar salários em dia aumenta `+5%` de lealdade por semana; atrasar reduz `-15%`.
    * Quando `questCompleted === true` (botão **`🏅 Concluir Missão`** no card do NPC), o NPC ganha status **⭐ Veterano** e reduz em **`-1 dia`** extra as ordens da sala que gerencia.

---

## 📁 Arquivos e Módulos Afetados

| Arquivo | Componente / Responsabilidade |
|---|---|
| `src/data/bastions.js` | Catálogos `BASTION_DILEMMAS_CATALOG` e `BASTION_STAFF_QUEST_TEMPLATES` |
| `src/js/campaigns.js` | Lógica de Dilemas (`triggerRandomBastionDilemma`, `resolveBastionDilemma`), Troféus (`addBastionTrophy`, `removeBastionTrophy`), Lealdade/Missões do Staff (`completeStaffPersonalQuest`, evolução em `advanceBastionTurn`), e exibição nas sub-abas do Mestre e na visão somente-leitura dos jogadores (`renderPlayerBastionViewerModal`) |
| `src/styles/head_css.html` | Estilos para cards de Dilema com botões de escolha, Troféus dourados e badge Veterano/Lealdade do Staff |
| `test_runner.js` | Bateria 152 validando dilemas e resoluções, troféus e lealdade/missão pessoal do Staff |
| `issues/README.md` | Registro oficial da ISSUE-185 |

---

## ⚠️ Possíveis Impactos & Riscos Mitigados

* **Retrocompatibilidade**: Bastiões existentes no `localStorage` recebem `trophies: []` e `pendingDilemma: null` defensivamente em `getCampaignBastion`, sem perda de dados.
* **Zero `window.prompt`**: Todos os cadastros de Troféus e Missões Pessoais usam inputs inline estilizados.

---

## 🧪 Estratégia de Verificação

1. **Compilação (`node builder.js`)**: Gerar `planilha do rpg.html` e `index.html`.
2. **Testes Automatizados (`node test_runner.js`)**: Validar 100% de aprovação incluindo a nova **Bateria 152**.

---

> ⚠️ **Aguardando sua aprovação explícita conforme a Regra 1 do `AGENTS.md` para iniciar a implementação nos arquivos sob `src/`.**
