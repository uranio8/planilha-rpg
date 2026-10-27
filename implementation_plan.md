# 📋 Plano de Implementação: Características de Classe/Talentos e Paginação A4 em 2 Folhas (ISSUE-152)

Este plano corrige os dois problemas evidenciados no diálogo de impressão e no download individual de fichas:
1. **Características de Classe e Talentos vazias**: O bloco da coluna 3 estava em branco para heróis como *Alaster* (Guerreiro 4 / Draconato) porque o sistema lia apenas o campo de texto livre `p.features`, ignorando as habilidades oficiais desbloqueadas da classe (`getUnlockedClassFeatures`), especialidades marciais (`p.fightingStyle`), traços raciais da espécie (`findSpeciesData`) e talentos (`p.feats`/ASI).
2. **Modelo truncado em 1 folha de papel ("1 folha de papel" no Chrome)**: No `@media print`, os containers ancestrais (`.modal-body` e `.print-a4-preview-viewport`) continham `max-height: 90vh` e `overflow-y: auto`, o que faz os motores Chromium/Blink e Firefox tratarem o modal como uma caixa scrollável limitada à tela, descartando todo o conteúdo que transborda a primeira página e impedindo a quebra para a Página 2.

---

## 🎯 Escopo das Alterações

### 1. `src/js/players.js` (Helper Universal de Características & Folha A4)
- **Implementar `getPlayerAllFeaturesAndTraits(p)`**:
  - Reúne e compila em uma lista estruturada:
    1. **Habilidades Oficiais de Classe por Nível** (Guerreiro 4: Estilo de Luta, Retomar o Fôlego, Surto de Ação, Arquétipo Marcial/Campeão, Crítico Aprimorado, ASI Nv 4).
    2. **Especialidades Marciais e Escolhas** (ex: Arquearia, Defesa, Duelismo, etc.).
    3. **Traços Raciais da Espécie** (ex: Draconato: Ancestralidade Dracônica, Arma de Sopro, Resistência a Dano).
    4. **Talentos e Marcos de Nível** (`p.feats` e escolhas de ASI).
    5. **Anotações Livres do Jogador** (`p.features`).
- **Renderização Rica na Coluna 3 da Página 1**:
  - Exibir cada habilidade com marcador `✦`, nome em destaque, categoria/origem e descrição resumida para consulta rápida na mesa.
  - Formatação tipográfica compacta e elegante (`.a4-feature-entry`, `.a4-feature-tag`, `.a4-feature-desc`).

### 2. `src/js/pdf_export.js` (Exportação no PDF Editável AcroForm)
- Atualizar o preenchimento inicial do campo `Features_Traits`:
  - Utilizar `getPlayerAllFeaturesAndTraits(p)` para pré-carregar automaticamente todas as características de classe, raça e talentos no PDF editável, permitindo que o jogador/mestre visualize e edite livremente no Adobe Acrobat ou Foxit.

### 3. `src/styles/head_css.html` (Garantia de 2 Folhas de Papel no `@media print`)
- **Desbloqueio de Ancestrais Scrolláveis**:
  - Forçar `overflow: visible !important;`, `max-height: none !important;`, `height: auto !important;` e `display: block !important;` em `#modal-print`, `#modal-print .modal-body`, `.print-a4-preview-viewport` e `#print-sheet-content`.
- **Dimensões e Quebras Oficiais A4**:
  - Configurar `.a4-print-page` com `height: 275mm !important; max-height: 275mm !important; box-sizing: border-box !important; break-inside: avoid !important; page-break-after: always !important; break-after: page !important;`.
  - Configurar `.a4-print-page:last-child` com `page-break-after: auto !important; break-after: auto !important;`.
  - Configurar `@page { size: A4 portrait; margin: 6mm 8mm; }`.

---

## 🧪 Estratégia de Verificação e Testes Automatizados

1. **Atualização do Script E2E** (`test_pdf_and_print_session.js`):
   - Adicionar teste com o herói **Alaster** (Guerreiro 4 / Draconato com `p.features = ''`).
   - Validar que `getPlayerAllFeaturesAndTraits(sampleAlaster)` extrai pelo menos 6 características de classe e 3 traços raciais.
   - Validar que o HTML da folha A4 renderiza as características de Guerreiro 4 e Draconato na coluna 3.
   - Validar que o PDF editável gerado contém as características no campo `Features_Traits`.
   - Validar que o CSS de `@media print` não possui `overflow: auto` ou `max-height` ativo em nenhum container ancestral de `#modal-print`.
2. **Nova Bateria 121 em `test_runner.js`**:
   - Garantir 100% de aprovação de todos os testes unitários e de integração.
3. **Build Final**:
   - Executar `node builder.js` e validar tamanho da bundle.

---

## 🔒 Critérios de Aceite & Status de Validação

- [x] A coluna "CARACTERÍSTICAS DE CLASSE & TALENTOS" da folha A4 exibe automaticamente as habilidades da classe e traços de raça do herói mesmo se o campo de texto livre estiver em branco.
- [x] O campo `Features_Traits` do PDF editável baixado é pré-preenchido com todas as habilidades de classe e talentos do personagem.
- [x] No diálogo de impressão do navegador (Ctrl+P ou botão Imprimir), a visualização exibe **exatamente 2 folhas de papel** (em vez de 1), com quebra perfeita entre a Página 1 e a Página 2.
- [x] 100% dos testes aprovados em `node test_runner.js` (2133/2133 testes aprovados na Bateria 121).
