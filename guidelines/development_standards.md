# 🛠️ Padrões de Desenvolvimento

Este documento descreve as práticas recomendadas para o desenvolvimento de novas funcionalidades e correções de bugs no projeto **Planilha RPG**.

---

## 1. Fluxo de Edição e Build

- **Nunca edite `planilha do rpg.html` diretamente**: O arquivo `planilha do rpg.html` é gerado automaticamente pelo compilador.
- **Edite os módulos em `src_*`**:
  - CSS / Design: `src_head_css.html`
  - Marcação HTML: `src_ui.html`
  - Lógica JavaScript: `src_js_*.js`
  - Datasets: `src_data_*.js`
- **Recompile sempre**: Após qualquer edição em um arquivo fonte, execute no terminal:
  ```bash
  node builder.js
  ```

---

## 2. Padrões de Código JavaScript

- **Vanilla JS puro**: Não adicione dependências pesadas externas ou frameworks não solicitados.
- **Persistência de Estado**:
  - Qualquer alteração nos estados de jogadores (`PLAYERS`) ou combate (`state`) deve disparar `saveToLocalStorage()`.
  - Assegure-se de manter integridade dos dados e tratamento para propriedades indefinidas (`optional chaining` ou valores padrão).
- **Sincronização entre Módulos**:
  - Mudanças de PV na ficha do jogador devem refletir no combate (`state.combatants`) e vice-versa.
  - Atualizações visuais devem acionar as funções de renderização apropriadas (`renderPlayers()`, `renderCombat()`, `renderVTT()`, etc.).
- **Feedback Visual e Logs**:
  - Ações relevantes em combate ou nas fichas devem registrar entradas no histórico através de `addLog(mensagem)`.
