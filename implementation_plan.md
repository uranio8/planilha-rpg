# 📋 Plano de Implementação: Visão Somente-Leitura do Bastião para Jogadores, Relógio de Dias da Campanha, Pesquisa de Criaturas & Bestiário Descoberto e Profundidade da População (ISSUE-184)

## 📌 Contexto & Solicitação do Usuário

O usuário solicitou quatro evoluções integradas para conectar o Bastião diretamente à experiência dos jogadores na mesa:
1. **Visão Somente-Leitura para Jogadores**: Que os jogadores vejam na ficha/portal o que o Bastião está produzindo, o ouro do Cofre, os NPCs contratados e informações gerais — **sem permissão para editar produções ou criar NPCs**.
2. **Sistema de Passagem de Dias do Jogo**: Um relógio da campanha onde o Mestre pode avançar `+1`, `+3`, `+7` ou `N` dias, fazendo o Bastião acompanhar automaticamente (reduzindo o tempo das ordens e fechando turnos semanais a cada 7 dias).
3. **Pesquisa de Criaturas & Bestiário Próprio do Grupo**: Ao pesquisar criaturas (ex.: Biblioteca / Arquivo), permitir selecionar a criatura estudada e registrar fraquezas/história; ao concluir, liberar a entrada no **Bestiário Descoberto do Grupo** acessível aos jogadores ("estamos descobrindo o mundo").
4. **Profundidade & Peso da População**: Dar impacto real para os jogadores terem um Bastião populoso e feliz.

---

## 🎯 Objetivos da Implementação (ISSUE-184)

### 1. 👁️ Portal & Ficha do Jogador: Visão Somente-Leitura do Bastião
* **Novo Modal Exclusivo de Leitura (`#modal-player-bastion-view`)**:
  * Acessível pelo botão rápido **`🏰 Ver Bastião`** dentro da barra da ficha do jogador (ao lado de `🎒 Ver Baú`) e pelo chip **`🏰 Bastião`** no Portal do Jogador (`#pnav-bastion`).
  * **100% Somente-Leitura**: Nenhum botão de criar/excluir sala, contratar NPC, emitir ordem, mexer no Cofre ou avançar turno aparece para o jogador.
  * **Abas internas para o jogador**:
    1. **🏰 Fortaleza & Produção**: Nome, Tier, Nível, População (`X/Máx`), Felicidade (`X%` e humor), Ouro no Cofre (`bank.gold`), Defensores, Muralha e cards das instalações mostrando **o que está sendo produzido agora e quantos dias faltam** (`daysLeft`), além dos **NPCs encarregados / Staff**.
    2. **📖 Bestiário Descoberto**: Catálogo vivo com todas as criaturas já pesquisadas ou reveladas ao grupo nessa campanha (`camp.discoveredBestiary`), exibindo ND, tipo/estatísticas resumidas, **história/lore** e **fraquezas/segredos descobertos**.

---

### 2. ⏳ Relógio de Dias da Campanha (`camp.calendar` & `advanceCampaignDays(days)`)
* **Estrutura na Campanha**:
  * `camp.calendar = { currentDay: 1, dayBuffer: 0 }` (exibido no cabeçalho do Bastião e na aba Campanhas como **Dia X de Campanha • Semana Y**).
* **Controles do Mestre**:
  * Barra rápida no Bastião com botões **`+1 Dia`**, **`+3 Dias`**, **`+7 Dias (Semana)`** e input numérico **`+N Dias`**.
* **Sincronização Automática com o Bastião**:
  * Ao avançar `N` dias:
    1. `currentDay += N` e `dayBuffer += N`.
    2. Todas as ordens em andamento nas instalações reduzem `daysLeft -= N`. Qualquer ordem que chegar a `<= 0` é **concluída imediatamente** (entregando itens no Baú, recrutas ou desbloqueando criatura pesquisada no Bestiário do Grupo!).
    3. A cada `7` dias acumulados em `dayBuffer`, o sistema executa automaticamente 1 ciclo semanal completo (renda territorial + impostos da população no Cofre, folha do Staff, atualização de Felicidade/População, `+10 Renome` e evento `d100`).

---

### 3. 🔬 Pesquisa de Criaturas & Bestiário Descoberto pelo Grupo
* **Seleção de Criatura na Ordem de Pesquisa (`research_lore` e `consult_lost_tomes`)**:
  * No catálogo (`BASTION_ACTIONS_CATALOG`), essas ordens recebem `hasMonsterSelector: true`.
  * No modal `#modal-bastion-action`, ao selecionar uma ordem de pesquisa, exibe-se um campo de busca/seleção conectado ao `BESTIARY_DATA` (600+ criaturas) + 2 campos opcionais do Mestre:
    * **Fraquezas & Táticas Descobertas** (ex.: *Vulnerável a Fogo; evita luz solar*).
    * **História / Notas da Campanha** (ex.: *Serve ao culto do dragão nas colinas*).
* **Desbloqueio Automático + Curadoria Manual do Mestre**:
  * Ao concluir os dias da pesquisa, a criatura entra em `camp.discoveredBestiary` e é anunciada no log.
  * Na sub-aba `📜 Crônica & Eventos` (ou em um botão `📖 Bestiário do Grupo` no painel do Mestre), o Mestre também pode **adicionar, editar ou ocultar** criaturas manualmente conforme o grupo as encontra em combate/exploração.

---

### 4. 🏘️ Mais Peso e Profundidade para População & Felicidade
Além dos impostos semanais (`+5 PO` a cada 10 habitantes), a população e felicidade passam a gerar **impacto mecânico direto para os jogadores**:
1. **Bônus de Descanso no Bastião (Regra de Acampamento/Fortaleza)**:
   * Quando o grupo descansa em um Bastião com **Felicidade $\ge 60\%$**, os jogadores recebem **PV Temporários = Nível do Bastião** (ou `+1d6` em testes sociais na região) — exibido como benefício ativo na visão do jogador!
2. **Marcos Populacionais (Títulos & Benefícios da Cidade)**:
   * **10+ habitantes**: *Comércio Local* (itens mundanos até 25 PO disponíveis na vila).
   * **30+ habitantes**: *Milícia Cívica* (+2 Defensores extras gratuitos no teto de defesa em ataques).
   * **80+ habitantes**: *Centro de Rumores* (1 pista/gancho gratuito por semana no evento ou pesquisa `-2 dias` mais rápida).
   * **200+ habitantes**: *Mercado Regional* (`+15%` de desconto em obras e suprimentos).

---

## 📁 Arquivos e Módulos Afetados

| Arquivo | Componente / Responsabilidade |
|---|---|
| `src/data/bastions.js` | Flag `hasMonsterSelector: true` em `research_lore` e `consult_lost_tomes`, além da tabela `BASTION_POPULATION_MILESTONES` |
| `src/js/campaigns.js` | Relógio `camp.calendar` e `advanceCampaignDays(days)`, integração com ordens e turnos semanais, seletor de criaturas do `BESTIARY_DATA` em `renderActionItemSelectorHtml` / `triggerActivateBastionAction`, desbloqueio em `camp.discoveredBestiary`, funções do Bestiário Descoberto pelo Grupo e modal somente-leitura `openPlayerBastionViewerModal` |
| `src/js/players.js` | Botão rápido `🏰 Ver Bastião` na barra do Baú da ficha do jogador |
| `src/js/core.js` | Inclusão do chip `#pnav-bastion` no Portal do Jogador (abrindo somente o modal de leitura, sem liberar a aba administrativa do Mestre) |
| `src/ui/ui.html` | Novo modal `#modal-player-bastion-view` (somente-leitura para jogadores) e modal `#modal-bastion-bestiary-manager` (curadoria do Mestre) |
| `src/styles/head_css.html` | Estilos do relógio de dias, badges de marcos populacionais e cards do Bestiário Descoberto |
| `test_runner.js` | Bateria 151 validando `advanceCampaignDays`, conclusão de ordens por dias, seleção/desbloqueio de criatura no bestiário descoberto e modo somente-leitura |
| `issues/README.md` | Registro oficial da ISSUE-184 |

---

## ⚠️ Possíveis Impactos & Riscos Mitigados

* **Segurança do Portal do Jogador**: O botão/chip do jogador abre exclusivamente `#modal-player-bastion-view`, que não renderiza controles de escrita nem expõe funções administrativas.
* **Retrocompatibilidade**: Campanhas antigas no `localStorage` recebem `calendar` e `discoveredBestiary: []` de forma defensiva sem perder nenhum dado existente.

---

## 🧪 Estratégia de Verificação

1. **Compilação (`node builder.js`)**: Validar geração sem erros de `planilha do rpg.html` e `index.html`.
2. **Testes Automatizados (`node test_runner.js`)**: Garantir 100% de aprovação com a nova **Bateria 151**.

---

> ⚠️ **Aguardando sua aprovação explícita conforme a Regra 1 do `AGENTS.md` para iniciar a implementação nos arquivos sob `src/`.**
