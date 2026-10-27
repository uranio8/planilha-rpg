# Plano de Implementação - Estilização Canônica Oficial A4 D&D 5E em 2 Páginas (ISSUE-148)

## 🎯 Contexto e Objetivos

O usuário reportou:
> *"a ficah esta com problema, em algum lugar do nosso sistema ja haviamos feito como seria essa ficha em pdf, mas não foi aplicado, avmos corrigir"*

### 🔍 Diagnóstico da Causa-Raiz
No gerador modular de ficha (`printPlayerSheet` em `src/js/players.js`), foi implementada uma estrutura HTML canônica oficial de D&D 5E em 2 páginas, dividida em cabeçalho oficial, 3 colunas harmonizadas por página, caixas de atributos, salvaguardas, perícias, tabela de ataques calculados, rastreadores de PV/morte, inventário e grimório.

No entanto, **as regras CSS correspondentes a essas classes (`.a4-print-page`, `.a4-sheet-header`, `.a4-stat-card`, `.a4-page1-columns`, etc.) não foram aplicadas em `src/styles/head_css.html`**. Como consequência:
1. Os cards de atributos não formavam colunas ou caixas de atributos D&D.
2. As 18 perícias e salvaguardas eram empilhadas como texto corrido desordenado.
3. Não havia proporção de página A4 nem limites de margem para exportação em PDF.
4. O documento ficava sem diagramação e ilegível ao imprimir ou salvar em PDF.

---

## 🛠️ Modificações Propostas

### 1. `src/styles/head_css.html`
Implementar o design system completo para a ficha impressa A4 (tanto no modal de preview `#modal-print` quanto em `@media print`):

- **Dimensões & Formato A4 Oficial**:
  - `@page { size: A4 portrait; margin: 6mm; }`
  - `.a4-print-page`: `width: 194mm; min-height: 280mm; background: #fff; color: #0f172a; padding: 7mm 8mm; box-sizing: border-box; page-break-after: always; position: relative;`
- **Cabeçalho Canônico D&D (`.a4-sheet-header`)**:
  - Título do personagem com fonte Cinzel, brasão sutil e subtítulo.
  - Grade de metadados (`.a4-sheet-meta-grid`) com 6 caixas: Classe/Nível, Antecedente, Nome do Jogador, Raça, Tendência e XP.
- **Estrutura de 3 Colunas da Página 1 (`.a4-page1-columns`)**:
  - Coluna 1 (`.a4-col-left`, ~60mm): 6 Atributos em caixas verticais (`.a4-stat-card`) com Modificador grande e escore, Bônus de Proficiência, Inspiração, Salvaguardas com bullets, 18 Perícias com bullets de proficiência e Percepção Passiva.
  - Coluna 2 (`.a4-col-center`, ~74mm): Grid superior de CA, Iniciativa e Deslocamento em formato de escudo/pill, Caixa de PV (Máximo, Atual e Temporário), Dados de Vida & Death Saves (círculos de sucesso/falha), Tabela de Ataques e Grid de Espaços de Magia (1º ao 9º círculo).
  - Coluna 3 (`.a4-col-right`, ~60mm): Características de Classe, Habilidades Raciais e Talentos com diagramação limpa.
- **Estrutura da Página 2 (`.a4-page2-columns`)**:
  - Coluna 1: Traços de Personalidade, Ideais, Vínculos, Defeitos e Medalhas escolares.
  - Coluna 2: Cofre de Moedas (PC, PP, PE, PO, PL), Tabela Completa de Inventário e Carga Atual/Capacidade de Carga.
  - Coluna 3: Painel de Conjuração (Habilidade chave, CD, Bônus de Ataque), Lista de Magias Conhecidas/Preparadas e Bloco de Diário pautado.
- **Rodapé Canônico (`.a4-page-footer`)**:
  - Identificação de páginas (`Página 1 de 2`, `Página 2 de 2`), nome do personagem e do clube.
- **Modo Impressão (`@media print`)**:
  - Ocultação de menus, barras e elementos não imprimíveis.
  - Reset de margens e fundos para impressão limpa em preto/cinza de alta definição (economizando tinta e garantindo legibilidade máxima).

### 2. `test_runner.js`
- Adicionar **Bateria 117**:
  - Validar que `head_css.html` possui todas as regras CSS fundamentais (`.a4-print-page`, `.a4-sheet-header`, `.a4-stat-card`, `.a4-page1-columns`, `.a4-attacks-table`, etc.).
  - Validar que a diretiva `@page` e `page-break-after` estão configuradas.
  - Validar a renderização da ficha com cálculo de todas as perícias, atributos e tabelas.
  - Validar 100% de sucesso nos 2061+ testes existentes.

---

## 🔒 Critérios de Aceite e Verificação

1. Ao clicar em `📥` (Download Ficha) no card, o modal `#modal-print` exibe as 2 páginas perfeitamente diagramadas no formato A4 oficial D&D 5E.
2. Cada página possui caixas delimitadas, cabeçalho estético, colunas proporcionais e tipografia nítida.
3. Ao clicar em `📥 Salvar em PDF / Imprimir`, a impressão/exportação para PDF preserva as 2 páginas separadas sem sobreposições ou quebras no meio de tabelas.
4. Compilação executada com sucesso (`node builder.js`).
5. Suíte de testes aprovada com 100% de sucesso (`node test_runner.js`).
