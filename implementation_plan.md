# Plano de Implementação - Overhaul do Baú/Bolsa do Grupo (Histórico Rico de Vendas e Adições) & Sistema Universal de Modais Personalizados Dark Fantasy [ISSUE-175]

## 1. Contexto e Objetivos

O usuário solicitou melhorias em dois pilares centrais da experiência do usuário:
1. **Sistema de Bolsa e Baú do Grupo**: Em especial o **histórico de vendas, adições e movimentações** (evidenciado na imagem 1), tornando-o estruturado, detalhado, com filtros, busca, badges de tipo de operação e suporte à **venda de itens** diretamente pelo baú com cálculo de valor e registro contábil.
2. **Modais e Pop-ups Personalizados para o Nosso Sistema**: Substituição definitiva de diálogos nativos do navegador (`prompt()`, `alert()`, `confirm()`) que aparecem com layout padrão cinza do navegador (evidenciado na imagem 2 no fluxo de *Conceder Talento* onde é pedido para digitar o número do herói no teclado). Implementação de modais temáticos Dark Fantasy com seleção tátil por clique em cards de heróis com avatar, nome e classe, além de modais específicos para movimentação de ouro, divisão de tesouro e venda de itens.

---

## 2. Escopo das Modificações

### A. Sistema de Diálogos & Modais Personalizados Dark Fantasy (`src/js/core.js`, `src/ui/ui.html`, `src/styles/head_css.html`)
1. **Modal de Seleção de Herói (`#modal-hero-select` / `openHeroSelectModal`)**:
   - Substitui prompts que pedem para "digitar o número do personagem" (ex: *Conceder Talento*, *Entregar Item do Compêndio*, *Transferir Item do Baú*, *Conceder Dádiva/Bênção*).
   - Apresenta grade de cards visuais clicáveis dos heróis cadastrados/ativos com:
     - Avatar e ícone da classe/raça.
     - Nome do personagem e do aluno/jogador.
     - Classe, Subclasse, Nível e Barra de PV atual/máximo.
     - Efeito hover dourado e seleção com 1 clique (executa o callback e fecha o modal suavemente).
2. **Motor Universal de Diálogos Customizados (`customPrompt`, `customConfirm`, `customAlert`)**:
   - Container `#modal-custom-dialog` com estética Dark Fantasy (gradiente abissal, bordas douradas/âmbar, tipografia Cinzel/Inter, micro-animações `@keyframes modalSpringPop`).
   - `customPrompt({ title, message, defaultValue, placeholder, type, min, max, presets, confirmText, cancelText })`:
     - Retorna `Promise<string|null>` e aceita callback opcional para compatibilidade.
     - Suporte a chips de presets numéricos rápidos (`[1] [5] [10] [50] [100] [Max]`).
   - `customConfirm({ title, message, confirmText, cancelText, danger })`:
     - Retorna `Promise<boolean>`, com destaque visual em vermelho para ações destrutivas (ex: limpar histórico, excluir item).
   - `customAlert({ title, message, type: 'info'|'warning'|'success'|'error', okText })`:
     - Alerta visual com ícone temático e fechamento acessível via clique ou `Esc`.

### B. Novo Histórico Rico de Movimentações do Baú (`src/js/campaigns.js`, `src/ui/ui.html`, `src/styles/head_css.html`)
1. **Estrutura Contábil das Movimentações (`partyStash.history`)**:
   - Cada entrada de histórico passa a registrar metadados:
     - `type`: `'gold_in'` (Entrada de Ouro), `'gold_out'` (Saída/Gasto de Ouro), `'gold_split'` (Divisão de Tesouro), `'item_in'` (Item Adicionado/Espólio), `'item_out'` (Item Retirado), `'item_edit'` (Item Modificado), `'item_sold'` (Item Vendido/Convertido em PO).
     - `amount`: Valor numérico (PO ou quantidade de itens).
     - `text`: Descrição legível e detalhada.
     - `reason`: Motivo informado ("Dinheiro do orc", "Venda de Kit", "Recompensa de Masmorra").
     - `heroName`: Nome do personagem envolvido no depósito/retirada/compra.
     - `date`: Data formatada (com suporte a hora se disponível).
2. **Design Moderno dos Cards de Histórico (`.stash-history-card`)**:
   - Substituição da linha simplória com barra lateral por cards temáticos estruturados:
     - Badge semântica colorida com ícone (`💰 Depósito`, `💸 Retirada`, `⚖️ Divisão`, `📦 Item Guardado`, `🏷️ Venda de Item`).
     - Valor destacado em tipografia destacada (`+240 PO`, `-600 PO`, `+2x Kit de Primeiros Socorros`).
     - Subtítulo com motivo e portador/responsável.
     - Data formatada em padrão legível com badge sutil.
     - Botão de exclusão pontual com confirmação personalizada.
3. **Barra de Ferramentas de Auditoria do Baú**:
   - Chips de filtro: `🌐 Todas`, `💰 Ouro (+/-)`, `⚖️ Divisões`, `📦 Itens`, `🏷️ Vendas`.
   - Campo de busca instantânea (`stash-history-search`) filtrando por nome de item, motivo ou herói.
   - Botão para alternar exibição dos últimos registros (8-10) ou **Histórico Completo Expandido**.

### C. Novas Funcionalidades do Baú e Bolsa do Grupo (`src/js/campaigns.js`, `src/ui/ui.html`)
1. **Modal Dedicado de Ajuste de Ouro (`#modal-stash-gold-adjust` / `openStashGoldModal`)**:
   - Substitui os 3 `prompt()` sequenciais de `promptAdjustPartyGold`.
   - Abas táteis: `➕ Depositar Ouro` / `➖ Retirar / Gastar Ouro`.
   - Presets táteis rápidos de valores (`+10`, `+50`, `+100`, `+250`, `+500`, `Tudo`).
   - Chips de sugestão de motivo (`⚔️ Recompensa de Masmorra`, `🏷️ Venda de Espólio`, `🍖 Suprimentos & Rações`, `🍺 Despesas de Taverna`, `👑 Ajuste do Mestre`).
   - Saldo atual da carteira pessoal do herói vs saldo do baú exibidos lado a lado com cálculo em tempo real.
2. **Modal Dedicado de Divisão de Tesouro (`#modal-stash-split-gold` / `openSplitGoldModal`)**:
   - Substitui o `confirm()` feio com texto matemático em `splitPartyGold`.
   - Exibe o total de ouro no baú.
   - Lista interativa dos heróis da campanha com checkboxes individuais e botão "Selecionar Todos", permitindo excluir personagens ausentes da sessão.
   - Prévia matemática dinâmica: "Cada um dos X heróis receberá **Y PO** • Sobra no baú: **Z PO**".
3. **Novo Fluxo: Venda de Itens do Baú (`openSellPartyItemModal` / `sellPartyItem`)**:
   - Botão de ação rápida `🏷️ Vender` em cada linha da tabela de itens do baú.
   - Modal com cálculo de valor sugerido de venda (50% do valor oficial de tabela D&D 5E ou valor customizado pelo mestre).
   - Seletor de quantidade a vender (1, metade, tudo).
   - Ao confirmar: deduz a quantidade do item do baú (ou remove se zerar), credita o valor em PO no cofre do baú e registra automaticamente no histórico como transação `item_sold`.

### D. Integração e Substituição nos Compêndios (`src/js/compendium.js`)
- Em `promptGrantFeatToHero(featId)`:
  - Substitui o `prompt()` nativo (imagem 2) pela chamada a `openHeroSelectModal({ title: '⭐ Conceder Talento: "' + feat.name + '"', subtitle: 'Selecione o herói que receberá este talento:', onSelect: (hero) => grantFeatToPlayer(hero.id, feat.id, { source: 'master' }) })`.
- Em entrega de itens e recursos do compêndio para heróis:
  - Adotar `openHeroSelectModal` eliminando a digitação de números em caixas de prompt.

---

## 3. Plano de Verificação e Testes

1. **Testes Automatizados (`test_stash_and_modals.js`)**:
   - Validação da estrutura contábil do histórico do baú (tipos `gold_in`, `gold_out`, `gold_split`, `item_in`, `item_out`, `item_sold`).
   - Teste do fluxo de venda de item: dedução da quantidade, acréscimo de ouro ao baú e registro de histórico.
   - Validação da divisão de ouro com seleção seletiva de heróis.
   - Validação dos métodos do motor de diálogos (`openHeroSelectModal`, `customPrompt`, `customConfirm`, `customAlert`).
2. **Bateria 144 em `test_runner.js`**:
   - Adicionar validações de integridade no `test_runner.js` garantindo que todos os novos seletores, modais e classes CSS estejam presentes e com sintaxe 100% válida.
3. **Integridade de UI e Cliques**:
   - Executar `node test_ui_integrity.js` para assegurar que 100% das abas, modais e ações onclick continuam funcionando.
   - Executar `node builder.js` e `node test_runner.js`.

---

## 4. Arquivos e Módulos Afetados
- `src/ui/ui.html` (novos modais: `#modal-hero-select`, `#modal-custom-dialog`, `#modal-stash-gold-adjust`, `#modal-stash-split-gold`, `#modal-stash-sell-item`, e reestruturação do `#stash-history-list`)
- `src/styles/head_css.html` (CSS dos cards `.stash-history-card`, badges, filtros, e estilos dos novos diálogos Dark Fantasy)
- `src/js/core.js` (motor `openHeroSelectModal`, `customPrompt`, `customConfirm`, `customAlert`)
- `src/js/campaigns.js` (lógica do baú, histórico enriquecido, venda de itens, divisão e ajuste de ouro)
- `src/js/compendium.js` (substituição do prompt nativo por `openHeroSelectModal`)
- `test_stash_and_modals.js` (nova suíte de testes)
- `test_runner.js` (Bateria 144)
- `builder.js`
- `issues/README.md` (registro da ISSUE-175)

---

## 5. Resultados de Validação e Conclusão
- **`node test_stash_and_modals.js`**: 100% de aprovação em todos os 5 cenários contábeis e de modais.
- **`node test_ui_integrity.js`**: 100% de integridade (11/11 abas, 10/10 modais, 681/681 ações de clique aprovadas sem erro).
- **`node test_runner.js`**: 2.636 / 2.599 testes aprovados (100% de sucesso, Bateria 144 concluída com êxito).
- **Compilador (`node builder.js`)**: `planilha do rpg.html` e `index.html` gerados com 4.568,7 KB de forma totalmente funcional e standalone.
