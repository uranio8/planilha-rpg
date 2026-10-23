# Plano de Implementação - Sistema de Talentos (Feats) D&D 5E, Progressão por Nível (ASI) e Concessão pelo Mestre (ISSUE-124)

## 📌 Contexto e Objetivos

O sistema atual gerencia classes, atributos e níveis, mas ainda não possui a mecânica oficial de **Talentos (Feats)** e **Aumento no Valor de Atributo (Ability Score Improvement - ASI)**.

Conforme solicitado pelo usuário com base na referência [Mestre Charles Corrêa - Lista de Talentos para D&D 5e](https://rpg.charlescorrea.com.br/rpg-role-playing-game/lista-de-talentos-para-dd5e/):
1. **Catálogo Oficial Estruturado de Talentos (`src/data/feats.js`)**:
   - Conter todos os 42 talentos do Livro do Jogador (PHB 5E) com traduções canônicas, nomes originais em inglês, pré-requisitos formais, bônus imediatos (half-feats como `+1 em FOR/DES`) e **descrições intuitivas, diretas e formatadas em tópicos visuais** para facilitar o entendimento imediato dos jogadores durante a partida.
2. **Vinculação de Níveis de ASI / Talento por Classe**:
   - Cada classe ganha a escolha de ASI/Talento nos níveis específicos:
     - **Padrão (10 classes)**: Níveis 4, 8, 12, 16 e 19.
     - **Guerreiro (Fighter)**: Níveis 4, 6, 8, 12, 14, 16 e 19 (7 oportunidades).
     - **Ladino (Rogue)**: Níveis 4, 8, 10, 12, 16 e 19 (6 oportunidades).
3. **Fluxo Interativo de Escolha para o Jogador**:
   - Ao avançar para um nível com ASI/Talento (ou ao clicar no indicador de ASI disponível na ficha Roll20), o jogador abre o modal com duas opções claras:
     - **Opção 1: Aumento de Atributo**: Distribuir `+2 em um atributo` ou `+1 em dois atributos` (respeitando o teto de 20).
     - **Opção 2: Escolher um Talento**: Selecionar um talento do catálogo, com verificação de pré-requisitos (ex: FOR 13, Conjurador, Proficiência em Armadura) e aplicação automática de bônus mecânicos (ex: Atleta concede +1 FOR/DES, Robusto adiciona +2 PV por nível, Alerta adiciona +5 Iniciativa).
4. **Ferramenta de Concessão Direta do Mestre (DM Tools)**:
   - Botão dedicado na ficha e na aba de Campanhas/Personagens: `⭐ Conceder Talento (Mestre)`.
   - Permite ao Mestre adicionar ou remover talentos livremente em qualquer nível (recompensas narrativas, bênçãos divinas, treinamento em downtime ou Humano Variante de 1º nível).
5. **Aba/Seção de Talentos na Ficha Roll20 & Compêndio**:
   - Exibição elegante dos talentos adquiridos na coluna de Traços/Características ou aba dedicada na ficha Roll20, com clique para ver detalhes explicativos completos.
   - Aba ou seção de busca no **Compêndio** para leitura de todos os talentos a qualquer momento.

---

## 🏗️ Módulos e Arquivos Afetados

1. **`src/data/feats.js`** (Novo Arquivo):
   - Exportação global `FEATS_DATA` contendo os 42 talentos com id, nome, nome em inglês, pré-requisitos (`prereq`), resumo intuitivo, benefícios detalhados em tópicos, bônus de atributo (`statBonus`) e categoria.
2. **`builder.js`**:
   - Inclusão de `src/data/feats.js` na ordem de compilação antes de `src/js/players.js` e compêndio.
3. **`src/js/classes.js` / `src/data/classes.js`**:
   - Tabela canônica de níveis de ASI por classe (`CLASS_ASI_LEVELS`) e método auxiliar `getClassAsiLevels(className)`.
4. **`src/js/players.js`**:
   - Armazenamento em `player.feats` (array de strings ou objetos `{ id, name, chosenOption, source: 'asi' | 'master' }`).
   - Função `getPlayerAvailableAsiCount(player)` e `hasPendingAsiChoice(player)`.
   - Modais interativos:
     - `openAsiChoiceModal(playerId, level)`: Escolha entre +2/+1 atributos ou Talento.
     - `openMasterGrantFeatModal(playerId)`: Modal exclusivo do mestre com filtro rápido para conceder talentos.
     - `grantFeatToPlayer(playerId, featId, options)` e `removeFeatFromPlayer(playerId, featId)`.
   - Aplicação de bônus automáticos (Iniciativa de Alerta, PV de Robusto, Atributos de Half-feats, Percepção passiva de Observador).
   - Renderização dos talentos na ficha Roll20 (`renderPlayerFeatsTab`).
5. **`src/ui/ui.html`**:
   - Estrutura HTML do modal de escolha de ASI/Talento (`#modal-player-asi`).
   - Estrutura HTML do modal de concessão do Mestre (`#modal-master-grant-feat`).
   - Seção de talentos no Compêndio (`#compendium-feats-view`).
6. **`src/styles/head_css.html`**:
   - Estilização Dark Fantasy para cards de talentos (`.feat-card`, `.feat-badge`, `.feat-prereq-pill`, `.asi-choice-card`).
7. **`test_runner.js`**:
   - Bateria 92 com testes automatizados cobrindo todos os 42 talentos, regras de ASI por classe, validação de pré-requisitos, concessão do mestre e persistência.

---

## 💾 Impactos em Persistência (`localStorage`), Combate e Sincronização

- **Persistência**: `player.feats` inicializado defensivamente como `player.feats || []` em `loadFromLocalStorage()`, preservando 100% de compatibilidade retrógrada com fichas existentes.
- **Sincronização em Nuvem**: O campo `feats` é serializado junto à ficha do jogador em `saveToLocalStorage()` e transmitido via BroadcastChannel e Firebase.
- **Combate / VTT**: Se o herói tiver o talento *Alerta*, a iniciativa já computa +5; se tiver *Robusto*, o PV Máximo sugerido já contabiliza os bônus.

---

## 🧪 Estratégia de Verificação Automatizada

- **Bateria 92 em `test_runner.js`**:
  - Validar se `FEATS_DATA` possui todos os 42 talentos carregados e com IDs válidos.
  - Validar níveis de ASI para Guerreiro (7 níveis: 4, 6, 8, 12, 14, 16, 19), Ladino (6 níveis) e Mago/Bárbaro (5 níveis).
  - Validar cálculo de pré-requisitos (ex: Conjurador de Guerra exige ser conjurador; Duelista Defensivo exige DES 13).
  - Validar concessão manual de talentos pelo mestre (`grantFeatToPlayer`).
  - Validar aplicação de bônus em atributos e PV (ex: Robusto).
  - Validar compilação com `node builder.js` e execução com 100% de sucesso em `node test_runner.js`.

---

## 📌 Status de Implementação

- [x] **Catálogo Oficial Estruturado de Talentos (`src/data/feats.js`)**: 42 talentos do PHB 5E com pré-requisitos, tópicos visuais e mecânicas.
- [x] **Inclusão no Compilador (`builder.js`)**: `src/data/feats.js` adicionado e compilado com sucesso.
- [x] **Tabela de Níveis de ASI por Classe (`src/data/classes.js`)**: `CLASS_ASI_LEVELS` e `getClassAsiLevels()`.
- [x] **Aba Oficial de Talentos no Compêndio (`src/ui/ui.html` & `src/js/compendium.js`)**: `#tab-feats` com busca, filtros de categoria e concessão com 1-clique.
- [x] **Modal de Concessão do Mestre (`#modal-master-grant-feat`)**: Concessão e revogação livre em qualquer nível.
- [x] **Modal Interativo de Escolha de ASI (`#modal-player-asi`)**: Escolha entre atributos (+2 ou +1/+1) e talentos com validação de pré-requisitos.
- [x] **Bônus Mecânicos Automatizados na Ficha**: +5 Iniciativa para *Alerta*, +2 PV/nível para *Robusto*, +5 Passivas para *Observador*, half-feats.
- [x] **Seção de Talentos na Ficha Roll20 (`renderPlayerFeatsSection`)**: Na aba Traços/Características com detalhes e badges de origem.
- [x] **Estilização Dark Fantasy (`src/styles/head_css.html`)**: Cards, badges e modais totalmente estilizados.
- [x] **Bateria 92 de Testes Automatizados (`test_runner.js`)**: 1628/1628 testes passando (100% de sucesso).
- [x] **Documentação em `issues/README.md`**: ISSUE-124 registrada e detalhada.
