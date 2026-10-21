# 📋 Plano de Implementação: Modernização Estética dos Botões da Ficha (ISSUE-112)

## 📌 Contexto e Diagnóstico
Nas imagens enviadas pelo usuário, três grupos de botões na ficha de personagem estão com aparência nativa do navegador (fundo cinza-claro/branco `#efefef`, bordas cinzas chanfradas duras e sem contraste temático):
1. **Toolbar superior do herói** (Imagem 1):
   - Botões `✏️` (Editar), `📱` (Compartilhar/QR), `📏` (Modo Compacto) e `🗑️` (Excluir).
   - Estão renderizados como `<button class="btn-micro">`, porém a classe `.btn-micro` não possuía regras CSS explícitas, herdando os estilos nativos brancos do User-Agent.
2. **Descanso Curto e Longo** (Imagem 2):
   - Botões `🏕️ Curto` e `🌙 Longo` no cabeçalho do HP Card Roll20 e no painel de cargas de classe.
   - Atualmente usam `.btn-micro` genérico sem identidade visual de descanso/acampamento.
3. **Ações da Tabela de Ataques e Itens** (Imagem 3):
   - Botões `⚔️ + Arma` e `➕ Item` no topo da aba de Combate.
   - Botão de rolagem de apenas dano `💥` e botão de compartilhar no chat `💬` (`.btn-chat-feed`).

---

## 🎯 Objetivos
- Eliminar completamente qualquer fundo branco nativo ou borda chanfrada estilo Windows 95 dos botões da ficha.
- Implementar o padrão **Dark Fantasy Premium D&D 5E**:
  - Superfícies translúcidas com efeito vidro (`backdrop-filter: blur`, `background: rgba(...)`).
  - Bordas com brilho suave e cantos arredondados (`border-radius: 6px`).
  - Estados `:hover` com elevação suave (`transform: translateY(-1px)`), micro-iluminação dourada/temática e feedback `:active` tátil.
  - Variações semânticas de cores ricas:
    - **Ações de Edição/Utilidade** (`✏️`, `📱`, `📏`): Ardósia escura translúcida com brilho ciano/ouro.
    - **Ações de Exclusão** (`🗑️`): Destaque rubi carmesim no hover com borda avermelhada.
    - **Descanso Curto (`🏕️ Curto`)**: Tons âmbar/dourado de fogueira (`rgba(245, 158, 11, ...)`).
    - **Descanso Longo (`🌙 Longo`)**: Tons azul-noite estelar (`rgba(99, 102, 241, ...)`).
    - **Adicionar Arma (`⚔️ + Arma`)**: Vermelho combate com micro-brilho carmesim.
    - **Adicionar Item (`➕ Item`)**: Azul safira/mochila com micro-brilho ciano.
    - **Dano Rápido (`💥`)**: Pílula de impacto com brilho vermelho-rosa.
    - **Compartilhar no Chat (`💬`)**: Balão tátil ametista/púrpura com micro-animação.

---

## 🏗️ Módulos e Arquivos Afetados
1. **`src/styles/head_css.html`**:
   - Definição completa e padronizada de `.btn-micro`, `.player-actions-group .btn-micro`, `.roll20-btn-rest-short`, `.roll20-btn-rest-long`, `.roll20-btn-add-weapon`, `.roll20-btn-add-item`, `.btn-chat-feed`, e `.btn-damage-only`.
   - Garantia de `appearance: none; -webkit-appearance: none;` para neutralizar estilos nativos do navegador.
2. **`src/js/players.js`**:
   - Atualização das tags HTML em `renderPlayers()` para atribuir as classes semânticas temáticas nos botões correspondentes, mantendo retrocompatibilidade total.
3. **`test_runner.js`**:
   - Adição da **Suíte 80** validando a presença e integridade das novas classes e estilos de botões compilados.
4. **`builder.js`**:
   - Recompilação dos arquivos standalone `planilha do rpg.html` e `index.html`.
5. **`issues/README.md`**:
   - Registro oficial da **ISSUE-112**.

---

## 🛡️ Impactos e Riscos
- **Persistência (`localStorage`)**: Zero impacto (apenas apresentação visual e layout de botões).
- **Sincronização / Firebase**: Zero impacto (as funções invocadas pelos cliques permanecem idênticas).
- **Compatibilidade**: Zero regressão nos 1344 testes já aprovados.

---

## 🧪 Estratégia de Verificação
1. `node builder.js` — Compilação sem erros.
2. `node test_runner.js` — 100% de testes aprovados em todas as suítes (80 suítes).
3. Inspeção visual dos botões no navegador garantindo alto contraste e estética Dark Fantasy.
