# 📋 Plano de Implementação - ISSUE-140: Correção de Overflow Horizontal, Visibilidade dos Modificadores e Blindagem do Gesto de Swipe

---

## 🎯 1. Contexto e Diagnóstico dos Problemas

O usuário reportou dois problemas interligados ao utilizar a ficha no smartphone (`uranio8.github.io`), comprovados através de três capturas de tela:
1. **Modificadores ocultos/cortados**: Na lista de perícias (Imagem 2), apenas a bolinha e o nome da perícia aparecem (`○ FOR Atletismo`), enquanto os modificadores numéricos (`+3`, `+5`, etc.) e o botão de configuração `⚙️` sumiram. Na aba de magias (Imagem 1), a barra de estatísticas de conjuração (`CD DA MAGIA 15 | ATAC...`) e a segunda carta de magia (`Ataque Certeiro`) também estão cortadas na borda direita.
2. **Pulo involuntário para a lista de magias ao arrastar**: Ao tentar arrastar a tela para o lado para enxergar os modificadores cortados à direita, a aplicação pula diretamente para a lista geral de magias do compêndio (Imagem 3 - "Mostrando 36 de 361 magias").

### 🔍 Causa-Raiz Técnica:
1. **Estufamento de Largura (Overflow Horizontal)**:
   - Em CSS Grid, a regra `.roll20-columns-grid { grid-template-columns: 1fr; }` em telas móveis possui implicitamente `min-width: auto` (ou seja, `min-content`).
   - Elementos internos como `.player-spells-chips-grid` possuem `grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));` (largura mínima de 2 cartas = 428px) e `.spellcasting-hud-bar` possui 3 colunas rígidas (~410px).
   - Em smartphones com largura de tela de 360px a 390px, esses elementos forçam a coluna `.roll20-col-main` a se expandir para além da tela.
   - Consequentemente, a coluna irmã de perícias `.roll20-col-skills` e a caixa `.roll20-panel` também se expandem para mais de 420px.
   - Como `.roll20-skill-item` e `.roll20-panel-title` utilizam `justify-content: space-between;`, os modificadores (`.roll20-skill-bonus`) e a engrenagem `⚙️` são empurrados para além da coordenada 390px, ficando totalmente invisíveis fora do viewport!
2. **Gesto de Swipe Global Invasivo no Modo Portal do Jogador**:
   - Em `src/js/core.js` (função `initSwipeNavigation()`), existe um listener global de `touchstart`/`touchend` que captura qualquer arrasto horizontal (`deltaX < -70`).
   - No modo portal do jogador, a ordem de abas definida é `const PORTAL_TABS_ORDER = ['players', 'spells', 'equipment', 'classes', 'species'];`.
   - Quando o jogador está na sua ficha (`players`) e arrasta o dedo para a esquerda para tentar ver o conteúdo cortado, o swipe dispara `switchTab('spells')`, abrindo a lista geral de magias de forma indesejada.

---

## 🛠️ 2. Soluções Planejadas

### Solução 1: Blindagem e Desativação do Gesto de Swipe dentro da Ficha do Jogador
- Em `src/js/core.js` (`initSwipeNavigation`):
  - Adicionar blindagem para que o swipe de troca de abas **nunca capture toques originados dentro da ficha do jogador** (`target.closest('#tab-players')`, `target.closest('.roll20-sheet')`, `target.closest('.player-card')`).
  - No modo portal do jogador (`isPortalMode`), a navegação entre a ficha e outras ferramentas deve ser feita exclusivamente através dos botões e chips de navegação da interface (ou pela dock inferior), prevenindo qualquer troca acidental de aba durante a rolagem de telas da ficha.

### Solução 2: Blindagem Total de Largura e Responsividade da Ficha Mobile (Zero Overflow)
- Em `src/styles/head_css.html`:
  - Definir `min-width: 0;` em `.roll20-columns-grid`, `.roll20-col-main`, `.roll20-col-side`, `.roll20-col-skills` e na regra mobile `@media (max-width: 1079px) { .roll20-columns-grid { grid-template-columns: minmax(0, 1fr) !important; } }`.
  - Em `.player-spells-chips-grid`: em telas móveis (`@media (max-width: 500px)`), ajustar para `grid-template-columns: 1fr !important;`, garantindo que cada carta de magia ocupe uma linha individual sem estufar a largura.
  - Em `.spellcasting-hud-bar`: em telas móveis, aplicar `grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));` com fontes responsivas e `min-width: 0;` para que CD, Ataque Mágico e Atributo-Chave caibam harmoniosamente nos 390px.
  - Em `.roll20-skill-item`:
    - Adicionar `width: 100%; box-sizing: border-box; min-width: 0;`.
    - Em `.roll20-skill-left`: aplicar `flex: 1; min-width: 0; overflow: hidden;`.
    - Em `.roll20-skill-name`: adicionar `overflow: hidden; text-overflow: ellipsis; white-space: nowrap;`.
    - Em `.roll20-skill-bonus`: definir `flex-shrink: 0;` garantindo que o bônus numérico (`+3`, `+5`, `-1`) fique **sempre visível, fixo e destacado à direita**.
  - Em `.roll20-panel-title`: aplicar `width: 100%; box-sizing: border-box;` e `flex-shrink: 0;` no botão `⚙️`.
  - Em `.roll20-sheet`: garantir `max-width: 100%; width: 100%; box-sizing: border-box; overflow-x: hidden;`.

---

## 🏗️ 3. Módulos Afetados

| Módulo / Arquivo | Modificações Planejadas |
| :--- | :--- |
| **`src/js/core.js`** | Isolar `initSwipeNavigation()` para ignorar eventos dentro de `#tab-players`, `.roll20-sheet`, `.player-card` e no modo portal do jogador. |
| **`src/styles/head_css.html`** | Ajustar `grid-template-columns`, `min-width: 0`, responsividade de `.player-spells-chips-grid` (1fr no mobile), `.spellcasting-hud-bar` e flexbox seguro com `flex-shrink: 0` em `.roll20-skill-bonus`. |
| **`test_runner.js`** | Adicionar a **Bateria 108** validando que o bônus de perícia tem `flex-shrink: 0`, que o grid de colunas possui `minmax(0, 1fr)`, e que eventos de swipe na ficha são ignorados. |
| **`issues/README.md`** | Registrar a documentação completa da **ISSUE-140**. |

---

## 🛡️ 4. Impactos em Persistência e Outras Telas

- **Desktop**: Zero impacto regressivo (as correções são aplicadas em `@media (max-width: 1079px)` e `@media (max-width: 500px)`).
- **Persistência (`localStorage`) e Nuvem**: Sem impacto.
- **VTT Grid e Combate**: Permanecem 100% protegidos contra gestos indevidos.

---

## 📋 5. Lista de Tarefas (Tasks)

- [x] **Task 1**: Atualizar `src/js/core.js` blindando `initSwipeNavigation()` contra toques dentro da ficha (`#tab-players`, `.roll20-sheet`) e no modo portal.
- [x] **Task 2**: Atualizar `src/styles/head_css.html` com regras de `min-width: 0`, `flex-shrink: 0` nos modificadores de perícias e ajuste de 1 coluna para cartas de magias no mobile.
- [x] **Task 3**: Executar compilação com `node builder.js`.
- [x] **Task 4**: Adicionar a **Bateria 108** em `test_runner.js` e rodar a suíte completa garantindo 100% de sucesso.
- [x] **Task 5**: Documentar a ISSUE-140 em `issues/README.md`.
- [x] **Task 6**: Git commit semântico e push para `origin/main`.
- [x] **Task 7**: Apresentar resultado ao usuário.
