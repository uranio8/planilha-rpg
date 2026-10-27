# Plano de Implementação - Correção da Impressão A4 (28 Páginas ➔ 2 Páginas) e Blindagem de Download de Fichas (ISSUE-151)

## 🎯 Contexto e Diagnóstico

O usuário enviou duas capturas de tela e relatou:
> *"a geração do pdf individual esta com problema, utilize os agentes para fazer o teste dos jogadores e do mestre no download das fichas, para que possa testar e ver o que esta acontecendo"*

### 🔍 Diagnóstico das Capturas de Tela Enviadas:
1. **Captura 1 (Modal A4 do Arkhalis)**:
   - O modal de pré-visualização `#modal-print` renderiza a ficha de 2 páginas perfeitamente na tela.
2. **Captura 2 (Janela de Impressão da EPSON L3250)**:
   - A impressora acusou: **"Imprimir 28 folhas de papel"**!
   - A folha exibida na impressão **não é o modal do Arkhalis**, mas sim a tela inteira do site (a aba de Fichas com o card do Alaster e de todos os outros heróis).
   - **Causa Raiz**: O CSS `@media print` em `src/styles/head_css.html` ocultava apenas a navbar e botões, mas deixava `<header>`, `<main>` e todos os cards de todos os personagens da turma visíveis no fluxo de impressão. Como a turma possui múltiplos heróis com dezenas de itens e magias, o navegador tentava imprimir o site inteiro por trás do modal, gerando 28 páginas.
3. **Resolução de ID do Herói na Exportação**:
   - `exportCurrentModalPlayerEditablePdf()` dependia exclusivamente de `currentPrintPlayerId` sem fallback para o modo Portal do Jogador (`activePortalPlayerId`). Se o aluno/mestre clicar em baixar no portal ou se a variável sofrer atraso de ciclo de evento, o download não encontrava o herói.

---

## 🛠️ Modificações Propostas

### 1. `src/styles/head_css.html` (Isolamento Estrito de Impressão)
- No bloco `@media print`:
  - Ocultar expressamente `<header>`, `<main>`, `<footer>`, `.player-return-banner`, `.player-portal-banner`, `.tabs-nav`, `.controls-bar`, `.top-actions`, `.tab-pane`, `.player-card`, `.roll20-sheet`, e qualquer modal diferente de `#modal-print`.
  - Garantir que `#modal-print` seja o **único** elemento visível na impressão:
    - Quebra de página exata após a Página 1 (`.a4-print-page:first-child { page-break-after: always !important; }`).
    - Nenhuma quebra após a Página 2 (`.a4-print-page:last-child { page-break-after: auto !important; }`).
  - **Resultado**: A janela de impressão exibirá exatamente **2 folhas de papel**, imprimindo a ficha A4 limpa sem nenhuma interferência do site ao fundo.

### 2. `src/js/pdf_export.js` (Resolução Universal de Herói no Download)
- Em `exportCurrentModalPlayerEditablePdf()`:
  - Adicionar resolução em cascata: `currentPrintPlayerId` $\rightarrow$ `activePortalPlayerId` $\rightarrow$ `document.getElementById('pm-id')` $\rightarrow$ primeiro herói de `PLAYERS` caso haja contexto unitário.
  - Alerta amigável e preventivo em caso de ausência de herói selecionado.

### 3. Simulador Automatizado E2E de Impressão & Download (`test_pdf_and_print_session.js`)
- Criar script automatizado executando testes para:
  1. **Modo Mestre**: Abrir o modal de impressão de heróis (Arkhalis, Deraravely, Alaster, etc.), validar download de PDF editável e verificar que o CSS de impressão isola as 2 páginas sem vazar o `<main>`.
  2. **Modo Jogador (Portal do Aluno)**: Logar como jogador, acionar o download da ficha individual e validar que gera o arquivo PDF com dados corretos.
- Adicionar Bateria 120 em `test_runner.js`.

---

## 🔒 Critérios de Aceite & Status de Validação

- [x] Ao abrir o modal de impressão e clicar em **`[🖨️ Imprimir / Salvar A4]`**, o diálogo de impressão do navegador exibe **exatamente 2 páginas** (em vez de 28), contendo apenas a ficha A4 nobre sem menus, banners ou cards de outros personagens.
- [x] O botão **`[📄 Baixar PDF Editável (Auto-Cálculo)]`** funciona de forma confiável tanto no modo Mestre quanto no modo Jogador (Portal do Aluno), com resolução em cascata multi-role.
- [x] Blindagem contra `NaN` e tipos complexos em inventário, magias, ataques e notas.
- [x] Script `test_pdf_and_print_session.js` simulando os fluxos completos do Mestre e Jogador executado com 100% de aprovação.
- [x] Compilação executada via `node builder.js`.
- [x] Bateria 120 adicionada e 100% dos testes aprovados via `node test_runner.js` (2124/2124 testes).
