# 📋 Plano de Implementação - ISSUE-170

## 📱 Refinamento Responsivo Mobile-First da Ficha do Jogador, Eliminação de Cortes Laterais e Prevenção de Scroll Horizontal em Celulares

---

### 1. 🎯 Contexto e Objetivos

Com base nos testes realizados com o emulador de celular (resolução de 390×844 em alta densidade de pixels Retina 2×, padrão iPhone 14 / Galaxy recente), a aplicação apresentou excelente legibilidade, contraste e usabilidade no Portal do Jogador.

No entanto, em telas estreitas de smartphones (360px a 420px), foram identificados 4 pontos de atrito visual e responsividade:
1. **Atributos Pares Espremidos**: Na grade `.roll20-abilities-bar` em duas colunas, chips de `SALVA` da coluna da direita (DES, INT, CAR) sofrem aperto lateral ou corte de margem.
2. **Card de Defesa e Deslocamento (`CLASSE ARM.` e `DESLOC.`)**: O bloco `.roll20-ac-speed-box` encosta rente à borda direita em 390px, demandando `box-sizing: border-box` estrito e padding balanceado.
3. **Cabeçalho de Ataques Comprimido**: O título `⚔️ ATAQUES & ARMAS CALCULADAS` e os botões rápidos `⚔️ + Arma` e `➕ Item` estão em uma linha rígida horizontal com `justify-content: space-between`, empurrando os botões para fora da tela no celular.
4. **Navegação de Abas Horizontais**: Tanto as abas principais do topo quanto as sub-abas da ficha (`.roll20-tabs-header`) precisam de rolagem por toque (*touch-action: pan-x*) suave e sem scrollbar invasiva.

---

### 2. 🗂️ Arquivos e Módulos Afetados

1. **`src/styles/head_css.html`**:
   - Refinamento do breakpoint móvel `@media (max-width: 500px)` e `@media (max-width: 390px)`.
   - Ajuste em `.roll20-abilities-bar`: `gap: 6px`, `min-width: 0` e `box-sizing: border-box`.
   - Ajuste em `.roll20-sub-chip`: `min-width: 0`, `padding: 4px 1px`, `overflow: hidden`, texto de salvaguarda responsivo.
   - Ajuste em `.roll20-ac-speed-box`: padding proporcional (`8px 12px`), alinhamento centrado e respiro lateral.
   - Classe `.roll20-atk-header-row`: `display: flex; flex-wrap: wrap; gap: 6px; justify-content: space-between; align-items: center;` para o cabeçalho de ataques quebrar em 2 linhas limpas no celular.
   - Suavização de `.roll20-tabs-header`: `-webkit-overflow-scrolling: touch`, sem quebra de layout e com toque natural.
2. **`src/js/players.js`**:
   - Adicionar a classe semântica `.roll20-atk-header-row` no cabeçalho de armas calculadas da ficha.
3. **`test_runner.js`**:
   - Adição da **Bateria 139**: Testes de Responsividade Mobile-First, ausência de transbordo horizontal e integridade de layout para telas de 360px a 390px.
4. **`issues/README.md`**:
   - Registro da conclusão da **ISSUE-170**.

---

### 3. ⚠️ Riscos e Impactos em Persistência / Sincronização

- **Persistência (`localStorage`)**: **Zero impacto**. Trata-se de aperfeiçoamento de CSS e classes visuais; nenhuma estrutura de dados ou chave de armazenamento é modificada.
- **Sincronização (Firebase / BroadcastChannel)**: **Zero impacto**. O fluxo de atualização entre mestre e alunos permanece 100% idêntico.
- **Desktop e Telão**: **Zero impacto**. Todos os ajustes estão isolados em `@media (max-width: 500px)` e classes auxiliares, mantendo a experiência em tablets, notebooks e modo telão intocada.

---

### 4. 🧪 Estratégia de Verificação Automatizada

- [ ] Execução do compilador: `node builder.js`.
- [ ] Execução da suíte de integridade de UI: `node test_ui_integrity.js` (617/617 cliques).
- [ ] Execução do runner de testes automatizados: `node test_runner.js` com a **Bateria 139** (100% de sucesso).
- [ ] Captura de nova screenshot em emulador móvel (390×844) confirmando visualmente a eliminação de qualquer corte lateral.
- [ ] Commit e push limpos no Git.
