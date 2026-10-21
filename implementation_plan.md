# 📋 Plano de Implementação: Formatação Rica e Estruturação Visual dos Textos de Características (ISSUE-114)

## 📌 Contexto e Diagnóstico
Na imagem enviada pelo usuário da lista de características de Mago (*Grimório & Conjurador*, *Recuperação Arcana*, *Tradição Arcana*, *Portento*):
1. **Markdown Cru e Ilegível**:
   - Os textos estão sendo renderizados diretamente com marcadores markdown visíveis (`**Grimório**:`, `**Copiar Magias**:`, `**Descanso Curto**`, `*Escola de Evocação*`), sem conversão para HTML rico.
2. **Sopa de Letrinhas em Bloco Único**:
   - Múltiplas regras e tópicos separados por `•` estão colados no mesmo parágrafo corrido, dificultando a leitura rápida durante a sessão de jogo.
3. **Ausência de Destaque Semântico**:
   - Dados (`dois d20`), moedas (`50 PO`), tempos (`2 horas`, `Descanso Curto`), fórmulas de CD (`CD 8 + prof + mod INT`) e círculos mágicos (`1º círculo`) não possuem diferenciação cromática.

---

## 🎯 Objetivos da Melhoria
1. **Parser de Tópicos e Formatação Estruturada (`formatFeatureSnippet`)**:
   - Se a descrição contiver múltiplos tópicos marcados por `•` ou quebras de linha:
     - Separar o conceito introdutório da habilidade.
     - Renderizar cada regra/tópico como um card de linha independente (`.feature-bullet-row`) com marcador dourado (`✦`), eliminando o bloco de texto massivo.
   - Se for um texto narrativo/contínuo, aplicar quebras de parágrafo naturais e espaçamento entrelinhas generoso (`line-height: 1.6;`).
2. **Processamento Universal de Markdown e Micro-Destaques**:
   - Converter `**texto**` em negrito dourado brilhante (`<strong class="hl-keyword">...</strong>`).
   - Converter `*texto*` em itálico com contraste suave (`<em>...</em>`).
   - Destacar dados D&D com ícone e badge (`🎲 1d10`, `🎲 dois d20`).
   - Destacar moedas D&D com badge dourada (`🪙 50 PO`).
   - Destacar tempos e descansos com badge âmbar (`⏱️ 2 horas`, `⏱️ Descanso Curto`).
   - Destacar círculos de magia com badge ciano/ametista (`🔮 1º círculo`).
3. **Estilização Visual Dark Fantasy em `src/styles/head_css.html`**:
   - `.feature-snippet-intro`: texto conceitual introdutório nítido com cor `#cbd5e1`.
   - `.feature-bullets-list`: container em coluna com espaçamento vertical harmonioso (`gap: 6px; margin-top: 8px;`).
   - `.feature-bullet-row`: card de tópico com borda lateral dourada (`border-left: 2px solid var(--accent-gold)`), fundo sutil e padding interno (`6px 10px`).
   - `.hl-keyword`, `.hl-dice`, `.hl-gold`, `.hl-time`, `.hl-circle`: badges com alto contraste, legibilidade tátil e visual D&D moderno.

---

## 🏗️ Módulos e Arquivos Afetados
1. **`src/styles/head_css.html`**:
   - Definição dos estilos `.feature-snippet-intro`, `.feature-bullets-list`, `.feature-bullet-row`, `.feature-bullet-dot`, e refinamento das classes `.hl-*`.
2. **`src/js/players.js`**:
   - Implementação de `formatFeatureSnippet(desc)` e integração em `renderPlayerUnlockedFeatures(p, actionFilter)`.
3. **`test_runner.js`**:
   - Suíte 82 validando a formatação rica, parsing de markdown e geração de tópicos estruturados.
4. **`builder.js`**:
   - Recompilação de `planilha do rpg.html` e `index.html`.
5. **`issues/README.md`**:
   - Registro da **ISSUE-114**.

---

## 🛡️ Impactos e Riscos
- **Persistência / localStorage**: Zero impacto.
- **Sincronização / Firebase**: Zero impacto.
- **Performance**: Funções regex leves e puramente síncronas durante a renderização da aba ativa.

---

## 🧪 Estratégia de Verificação
- Compilação via `node builder.js`.
- Bateria de testes em `node test_runner.js` com 100% de sucesso.
- Validação visual dos cards de Mago, Guerreiro e Bárbaro garantindo legibilidade imediata de cada tópico.
