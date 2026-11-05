# 📋 Plano de Implementação: Fichas A4 Sem Quebras, Modais Temáticos e Histórico do Baú

Este plano aborda com precisão cirúrgica os problemas identificados nas imagens enviadas pelo usuário, além da modernização dos modais nativos e do histórico do Baú/Bolsa do Grupo.

---

## 🔍 1. Diagnóstico das Imagens Enviadas

### 📸 Problemas Detectados nos Prints:
1. **Quebra Incorreta para 3 Páginas (*Page Spill*)**:
   - O diálogo de impressão do Chrome indica **"3 páginas"** (em vez de estritamente 2).
   - No caso de **Arkhalis** (Imagem 1), a Página 3 aparece vazia apenas com uma barra lateral residual.
   - No caso de **Deraravely** (Imagens 2 e 4), a **Página 1 ficou quase toda em branco** (apenas com o cabeçalho) e o conteúdo da coluna de combate/ataques foi empurrado para a **Página 3**, quebrando a integridade visual da ficha.
   - Na **Página 2** (Imagem 3), notas e características no rodapé estão encostando e transbordando na borda inferior da folha.
2. **Causa Raiz Técnica**:
   - A folha A4 possui exatamente **297mm** de altura vertical.
   - O CSS `@media print` fixava `.a4-print-page` com `height: 275mm !important;` e `padding: 5mm 6mm !important;`.
   - Quando o navegador imprime com margens padrão (10–12mm) e cabeçalhos/rodapés do navegador ativados (mais ~20mm), a área útil diminui para menos de **250mm**.
   - Como $275\text{ mm} > 250\text{ mm}$, o Chrome força a quebra da página ao meio.
   - Como os cartões possuíam regras de `break-inside: avoid`, a grade de 3 colunas não coube após o cabeçalho e foi empurrada para frente, gerando a página 1 em branco e o miolo na página 3.
   - Faltava no CSS a regra `-webkit-print-color-adjust: exact !important; print-color-adjust: exact !important;`, fazendo com que gradientes e fundos sumam se "Gráficos de segundo plano" estiver desmarcado.

---

## 🎯 2. Objetivos da Implementação

### Parte A: Folhas A4 Canônicas à Prova de Falhas (2 Páginas Estritas)
- Ajustar `@page` para margens zero controladas (`@page { size: A4 portrait; margin: 0; }`), garantindo que o navegador não roube espaço vertical da folha.
- Adicionar `print-color-adjust: exact !important; -webkit-print-color-adjust: exact !important;` para preservar fundos e bordas temáticas mesmo com a opção do navegador desmarcada.
- Ajustar `.a4-print-page` para caber com precisão milimétrica em A4 (`max-height: 297mm; height: 297mm; box-sizing: border-box; overflow: hidden !important; padding: 6mm 8mm;`).
- Compactar verticalmente as caixas da Página 1 e Página 2 (cabeçalho, características de classe, tabela de ataques e lista de magias) para que heróis de qualquer nível e com multiclasse caibam sempre com folga confortável na Página 1.
- Adicionar aviso no modal de impressão orientando as opções recomendadas do navegador.

### Parte B: Substituição de `prompt()` e `confirm()` Nativos por Modais Temáticos
- Substituir o prompt nativo cinza (`uranio8.github.io diz: Digite o número do personagem que receberá o talento...`) por uma modal temática D&D 5E (`#modal-rpg-picker`):
  - Exibe a lista de personagens em **cartões visuais clicáveis** com avatar, nome, classe, nível e aluno.
  - Não requer digitação de números: basta 1 clique no herói desejado.
  - Aplicável para conceder Talentos, Itens e Magias do Compêndio/Bestiário.
- Substituir confirmações genéricas de exclusão e limpeza de histórico por modais de diálogo temáticos (`showRpgConfirmModal(title, message, onConfirm)`).

### Parte C: Novo Histórico e Experiência do Baú / Bolsa do Grupo
- Reformular o container de "Movimentações Recentes do Baú":
  - Estilo cartões de transação temática (badge verde para depósitos/vendas, vermelho para retiradas/ajustes, dourado para divisões de moedas entre heróis, azul para itens).
  - Identificação de data, tipo de transação e heróis envolvidos.
  - Filtros rápidos: `Todos`, `Moedas/PO`, `Itens`, `Divisões`.
  - Botão de limpar histórico com confirmação temática estilizada.

---

## 🗂️ 3. Arquivos e Módulos Afetados

| Arquivo | Modificações Planejadas |
|---|---|
| `src/styles/head_css.html` | Regras de `@media print`, `@page { margin: 0; }`, `-webkit-print-color-adjust: exact`, limites de altura estritos `297mm`, `overflow: hidden`, estilos dos novos cards de transação do baú e estilos da modal de seleção de herói. |
| `src/js/players.js` | Ajustes de densidade e layout de `printPlayerSheet` (Página 1 e 2), evitando overflow de características e ataques. |
| `src/ui/ui.html` | Inclusão da nova modal `#modal-rpg-picker` (para concessão visual de talentos/itens) e `#modal-rpg-confirm` (para confirmações temáticas); novo layout do histórico do baú. |
| `src/js/core.js` | Funções utilitárias globais `showRpgPickerModal` e `showRpgConfirmModal`. |
| `src/js/compendium.js` | Atualização das funções de concessão de talentos e itens para utilizarem `showRpgPickerModal` em vez de `prompt()`. |
| `src/js/combat.js` / `src/js/campaigns.js` | Integração do novo renderizador de histórico do baú com badges e filtros. |

---

## 🧪 4. Estratégia de Verificação e Testes

1. **Testes Automatizados**:
   - `node builder.js` para compilar o `planilha do rpg.html`.
   - `node test_runner.js` garantindo 100% de sucesso na suíte geral.
   - Script automatizado de validação de impressão A4 verificando alturas, classes e ausência de overflow para todos os 9 personagens.
2. **Verificação Visual Manual**:
   - Simulação das folhas A4 de Deraravely e Arkhalis no navegador, confirmando exatamente **2 páginas** no diálogo de impressão.
   - Teste de concessão de talento pelo Bestiário/Grimório sem nenhum `prompt` nativo.
   - Teste de movimentações no Baú do Grupo com os novos filtros e cartões temáticos.
