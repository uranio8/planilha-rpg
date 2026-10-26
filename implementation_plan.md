# 📋 Plano de Implementação - ISSUE-138: Experiência Mobile Next-Gen (Bottom Sheets, Thumb HUD Vital, Progressive Disclosure, Modo Combate & Haptic Feedback)

---

## 🎯 1. Contexto e Objetivos

Com base na pesquisa aprofundada de referências de mercado (**D&D Beyond**, **Pathbuilder 2e**, **Fight Club 5e** e princípios de ergonomia da *Thumb Zone* da Nielsen Norman Group), este plano unifica o melhor de cada frente para transformar a ficha do jogador no smartphone em uma interface tátil, fluida e manipulável com **uma única mão** durante a mesa de RPG.

### Pilares da Transformação Mobile:
1. **Bottom Sheets Deslizantes (Mobile-First)**: Em smartphones (`max-width: 768px`), substituir janelas modais flutuantes no centro da tela por Bottom Sheets que sobem suavemente a partir da borda inferior com indicador visual de arraste (*drag handle*), facilitando o fechamento e visualização na zona natural do polegar.
2. **HUD Vital Fixo no Rodapé (*Thumb HUD*)**: Barra ancorada acima da dock móvel permitindo ajustar PV (`±PV`), rolar `d20` com 1 toque e monitorar/cancelar Concentração ativa sem necessidade de rolar a página.
3. **Cards Táteis com *Progressive Disclosure***: Elementos com altura mínima ergonômica (≥ 44-48px), permitindo visualizar o essencial (Ataque, Dano, Círculo de Magia) e expandir detalhes oficiais com 1 toque.
4. **Modo Foco em Combate (*Combat Focus Mode*)**: Alternador rápido para ocultar dados passivos de exploração (biografias, notas longas, lista detalhada de perícias) e focar 100% em ações de combate, armas equipadas, reações e magias preparadas.
5. **Feedback Tátil Háptico (*Haptic Micro-interactions*)**: Vibração sutil e prazerosa (`navigator.vibrate`) em rolagens de 20 Natural / Crítico, aplicações de PV e gasto de espaços de magia.

---

## 🏗️ 2. Módulos Afetados

| Módulo / Arquivo | Modificações Planejadas |
| :--- | :--- |
| **`src/styles/head_css.html`** | 1. Implementar estilos responsivos de **Bottom Sheet** para `#modal-spell-quick-view`, `#modal-item-quick-view` e `#modal-combat-damage-heal` em `@media (max-width: 768px)` com `border-radius: 20px 20px 0 0`, animação `slideUpBottomSheet` e `.sheet-drag-handle`.<br>2. Estilizar o **HUD Vital Fixo no Rodapé** (`.mobile-vital-thumb-hud`) com barra de PV dinâmica, botão de d20 e chip de concentração.<br>3. Estilizar a classe do **Modo Foco em Combate** (`.body-combat-focus`).<br>4. Ajustar touch targets para tamanho mínimo de 44-48px. |
| **`src/ui/ui.html`** | 1. Inserir a estrutura do *drag handle* nos modais táteis de magia e itens.<br>2. Inserir a barra fixa do Thumb HUD Vital (`#mobile-vital-thumb-hud`) no portal do jogador com botão de alternância do Modo Foco em Combate. |
| **`src/js/players.js`** | 1. Implementar funções do Thumb HUD: atualização reativa da barra de PV, atalho de d20, alternância do modo foco em combate (`toggleCombatFocusMode`).<br>2. Integrar suporte defensivo a vibração háptica (`triggerHapticFeedback`).<br>3. Otimizar a abertura dos modais de magia e itens em modo Bottom Sheet no mobile. |
| **`src/js/combat.js`** | Integrar `triggerHapticFeedback` nas aplicações de dano/cura e rolagens críticas. |
| **`test_runner.js`** | Adicionar a **Bateria 106** validando Bottom Sheets, Thumb HUD, Modo Foco em Combate, feedback háptico e persistência de preferências mobile. |
| **`issues/README.md`** | Registrar a documentação completa da **ISSUE-138**. |

---

## 🛡️ 3. Impactos em Persistência, Combate e Sincronização

- **Persistência (`localStorage`)**: Preferência do Modo Foco (`dnd_combat_focus_mode`) salva sem interferir nas chaves oficiais de heróis e campanhas.
- **Sincronização em Tempo Real (Firebase)**: Mutações disparadas a partir do Thumb HUD (ajuste de PV, gasto de slots) utilizam a fila offline persistida (`enqueueOfflineMutation` e `flushOfflineMutationQueue` da ISSUE-137), garantindo zero perda de dados.
- **Desktop e Tablets**: A experiência em computadores e iPads permanece preservada com o layout completo de 3 colunas Roll20 2024. As Bottom Sheets e Thumb HUD ativam-se exclusivamente sob a media query de smartphones (`max-width: 768px`).

---

## 📋 4. Lista de Tarefas (Tasks)

- [ ] **Task 1**: Adicionar estilos CSS em `src/styles/head_css.html` para Bottom Sheets móveis, drag handles, Thumb HUD vital e Modo Foco em Combate.
- [ ] **Task 2**: Adicionar o markup do Thumb HUD Vital e drag handles nos modais de resumo em `src/ui/ui.html`.
- [ ] **Task 3**: Implementar em `src/js/players.js` a lógica do Thumb HUD, alternância de Modo Combate, atualização reativa de concentração e suporte a feedback háptico (`triggerHapticFeedback`).
- [ ] **Task 4**: Integrar chamada de feedback háptico em `src/js/combat.js` ao rolar d20 e aplicar dano/cura.
- [ ] **Task 5**: Compilar com `node builder.js`.
- [ ] **Task 6**: Criar a Bateria 106 em `test_runner.js` cobrindo Bottom Sheets, Thumb HUD, Modo Combate e Haptics, validando 100% de testes verdes.
- [ ] **Task 7**: Registrar a ISSUE-138 em `issues/README.md`.
- [ ] **Task 8**: Commit atômico no Git e push para `origin/main`.
- [ ] **Task 9**: Apresentar resultado detalhado ao usuário.

---

## 🧪 5. Estratégia de Verificação

1. Execução de `node builder.js` para garantir compilação standalone sem erros de sintaxe.
2. Execução de `node test_runner.js` validando a aprovação de todas as baterias anteriores (1855 testes) + novos testes da Bateria 106.
3. Teste funcional de viewport mobile simulando smartphone vertical (390x844).
