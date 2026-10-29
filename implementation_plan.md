# 📋 Plano de Implementação: Overhaul e Modernização da Aba de Combate (ISSUE-171)

## 📌 Contexto e Objetivos
O usuário solicitou melhorias profundas na **Aba de Combate**, focando em:
1. **Layout e Hierarquia Visual**: Interface inspirada nos principais VTTs modernos (**Foundry VTT**, **D&D Beyond Encounter Tracker**, **Owlbear Rodeo** e **Roll20**).
2. **Facilidade de Manipulação de Valores**:
   - Ajuste ultra-rápido de PV com suporte a operações matemáticas diretas no input (`-8`, `+12`, `/2`, etc.), eliminando atritos durante sessões agitadas.
   - Suporte nativo e oficial D&D 5E a **PV Temporário (Temp HP)** com barra/chip visual azul elétrico/ciano, absorvendo dano antes do PV real.
   - Seleção de Alvo por 1 Clique (clicar no card de um combatente define-o imediatamente como Alvo do despachante ou foca seus detalhes, sem precisar caçar nomes em dropdowns).
3. **Card de Combatente Redesenhado (Foundry VTT Style)**:
   - Badges destacadas com ícones: `🛡️ CA`, `👟 Deslocamento`, `🎲 Iniciativa`, `PV/MaxPV`.
   - Barra de PV dinâmica com transição suave, estado *Sangrando* (<= 50%) e *Crítico/Caído* (0 PV / Death Saves).
   - Chips táteis de Condições com remoção e adição rápida.
4. **Despachante de Dano & Cura Inteligente**:
   - Botões pré-formatados: `⚔️ Dano Cheio`, `🛡️ ½ Dano (Save/Resist.)`, `💥 2× (Vulnerável)`, `💚 Curar`, `🛡️ +PV Temp`.
   - Atalhos numéricos rápidos (`1`, `5`, `10`, `20`, `Max`).
5. **Barra de Controle de Rodada e Turno (Encounter Header)**:
   - Contador de rodada com botões táteis de avançar/retroceder (`⏮️`, `⏭️ Rodada`).
   - Placar rápido do encontro (ex: `👥 4 Heróis Ativos` vs `👾 3 Inimigos | 💀 1 Derrotado`).
   - Botão rápido para remover criaturas derrotadas (0 PV) com 1 clique.

---

## 🏗️ Módulos e Arquivos Afetados

1. **`src/js/combat.js`**:
   - Suporte a `tempHp` (PV temporário) em combatentes e sincronização com fichas (`PLAYERS`).
   - Avaliação matemática em inputs de PV (ex: suporte a strings do tipo `"-12"`, `"+15"`, `"10+5"`).
   - Função `setCombatTarget(combatantId)` para selecionar alvo com 1 clique direto na lista.
   - Botões e despachante com suporte a dano absorvido por PV temporário e adição de Temp HP.
   - Botão de limpar combatentes derrotados (`clearDefeatedCombatants`).
   - Atualização da função `renderCombat()` e `renderCombatantCard()` com o novo layout VTT.

2. **`src/styles/head_css.html`**:
   - Estilização moderna inspirada no Foundry VTT para `.combatant-item` (Glassmorphism dark fantasy, bordas neon temáticas para turno ativo/próximo).
   - Estilo para barra e badge de **PV Temporário** (`.temp-hp-bar`, `.temp-hp-badge`).
   - Estilização do cabeçalho da rodada (`.combat-flow-header`), placar de combatentes e controles de turno.
   - Grid responsivo para a lista de combatentes e painel de ações.

3. **`src/ui/ui.html`**:
   - Atualização da estrutura HTML do `#tab-combat` para acomodar os novos botões, placar e controles modernos.

4. **`test_runner.js`**:
   - Adição da **Bateria 140: Overhaul da Aba de Combate e Manipulação VTT (ISSUE-171)**.
   - Validação de cálculos matemáticos no input de PV, absorção de dano por Temp HP, seleção rápida de alvo e integridade de UI.

---

## 🛡️ Impactos e Compatibilidade

- **Persistência (`localStorage`)**:
  - A chave `dnd_tracker_state_v3` continuará 100% compatível, adicionando `tempHp: number` defensivamente (`c.tempHp = c.tempHp || 0`).
  - Sincronização bidirecional entre `state.combatants` e `PLAYERS` preservará tanto PV quanto PV Temporário.
- **Modo Telão (`screen_sync.js`) e Sincronização na Nuvem (`firebase_sync.js`)**:
  - As atualizações de PV e Temp HP serão propagadas de forma transparente via `broadcastStateSync()`.

---

## 🧪 Estratégia de Verificação

1. **Testes Automatizados**:
   - Executar `node test_runner.js` garantindo que todos os 2476+ testes existentes e os novos da Bateria 140 passem com 100% de sucesso.
   - Executar `node test_ui_integrity.js` garantindo que todos os botões e abas funcionem sem exceções.
2. **Verificação Manual e Visual**:
   - Compilar via `node builder.js`.
   - Validar visualmente o novo layout moderno, botões de atalho, absorção de Temp HP e alternância de turno.
