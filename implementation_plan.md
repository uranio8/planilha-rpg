# 📋 Plano de Implementação: Correção Definitiva de Impressão/Download A4 e Inversão de Atributos (ISSUE-179)

## 📌 Contexto & Análise do Problema (Diagnóstico com Especialistas)

O usuário solicitou:
> *"analise o que esta acontecendo quando tentamos fazer o download da ficha, outro ponto é q o modificador de atributo esta invertido com o valor de atributo. Procura na internet e com especialistas as melhores formas de gerar esse documento em pdf A4"*
> *(Com envio de capturas demonstrando quebras em 3 e 4 páginas no Chrome, cabeçalho isolado na Página 1, banner de dicas impresso no papel, e valores de atributos invertidos)*

---

### 🔍 Diagnóstico Técnico das Causas Raiz:

#### 1. Por que a ficha gerou 3 a 4 páginas com a Página 1 vazia sob o cabeçalho?
* **Vazamento do Banner de Dicas (`#modal-print-tip-banner`)**:
  * No arquivo `src/ui/ui.html` (linha 3167), o bloco informativo de alerta (*"Dica de Impressão: Ao imprimir no navegador..."*) não possuía a classe `.no-print` nem estava contemplado na regra `@media print { ... display: none !important; }`.
  * Como resultado, esse banner ocupava **~25mm de altura física** no topo absoluto da folha de papel antes da própria ficha (visível na captura `media_1793967680528_c2112b1f.jpg`).
* **Efeito Cascata no Algoritmo de Paginação do Chromium (Chrome / Edge)**:
  * Quando o usuário imprime no Chrome com `Margens: Padrão` (~12mm) e `Cabeçalhos e rodapés` ativado (~15mm adicionais no topo e base), a altura útil imprimível de uma folha A4 cai de 297mm para apenas **~250mm**.
  * A Página 1 da ficha começava com o Banner (25mm) seguido do Cabeçalho da Ficha (28mm) = **53mm**.
  * A área restante na folha era de apenas **197mm**.
  * O grid de 3 colunas (`.a4-page1-columns`), com suas caixas de atributos, PV e ataques possuindo `break-inside: avoid;`, necessita de ~220mm de altura.
  * O motor de impressão do Chrome determinou que 220mm não cabiam nos 197mm restantes. Portanto, **forçou uma quebra de página logo abaixo do cabeçalho**!
  * **Consequência visual**: A Página 1 ficou com apenas o cabeçalho e um imenso vazio branco embaixo (conforme captura `media_1793916179173_7b7f5982.png`).
  * As colunas foram empurradas para a folha seguinte. Como o container possuía `page-break-after: always;`, isso cascateou gerando uma 3ª folha (com os ataques e magias flutuando, conforme captura `media_1793916258206_7365e791.png`) e uma 4ª folha para o verso da ficha.

#### 2. Inversão entre Valor do Atributo e Modificador:
* Em `src/js/players.js` (linhas 11531-11536):
  * A classe `.a4-stat-mod` (tamanho 13.5pt bold central) estava recebendo o modificador (`+5`, `-2`, `+0`).
  * A classe `.a4-stat-score` (oval pequena de 6.5pt na base) estava recebendo o valor do atributo (`20`, `6`, `10`).
* No padrão canônico oficial de D&D 5E e conforme apontado pelo usuário, o **Valor do Atributo (Score)** deve figurar no campo central de grande destaque (ex: `20`, `14`, `16`, `6`), enquanto o **Modificador** deve ocupar o medalhão/oval delimitado na base com seu sinal correspondente (ex: `+5`, `+2`, `+3`, `-2`).

#### 3. Duplicação de Nível na Classe (`Bruxo 8 8` e `Guerreiro 5 / Bárbaro 3 8`):
* Em `src/js/players.js` (linha 11424), o código fazia `${p.className} ${p.level}`.
* Para personagens em que `className` já trazia o nível ou multiclasse (como `Bruxo 8` ou `Guerreiro 5 / Bárbaro 3`), o nível era concatenado novamente ao final, gerando a duplicação feia no cabeçalho.

---

### 🌐 Recomendações dos Especialistas & Padrões da Indústria (W3C Paged Media & Chrome Engine):

A pesquisa técnica internacional em especificações W3C e melhores práticas de geradores de fichas (Roll20, D&D Beyond, MPMB, Paged.js) destaca as seguintes regras de ouro:

1. **`@page { size: A4 portrait; margin: 0; }`**:
   * Definir a margem da página em zero no `@page` anula automaticamente os cabeçalhos/rodapés injetados pelo navegador (título da página, URL, data e carimbo de página do Chrome), liberando a tela A4 integral de $210\text{mm} \times 297\text{mm}$.
2. **Padding Interno Explícito no Container (`box-sizing: border-box;`)**:
   * A folha `.a4-print-page` deve ter dimensões estritas de $210\text{mm} \times 297\text{mm}$ com `padding: 7mm 9mm; box-sizing: border-box;`. Isso cria uma margem física perfeita no papel impresso sem depender de opções variáveis de margem do navegador do usuário.
3. **Controle Estrito de Quebras (`break-after` e `break-inside`)**:
   * A Página 1 deve ter `page-break-after: always; break-after: page;`.
   * A Página 2 (última) deve ter `page-break-after: avoid; break-after: avoid;` para garantir matematicamente que uma 3ª página em branco jamais seja criada.
4. **Isolamento Total do Modo de Impressão (`.no-print`)**:
   * Todo e qualquer elemento fora da ficha (overlays, backdrops, botões da toolbar, banners de dica e painéis auxiliares) deve ter `.no-print { display: none !important; }`.
5. **Contraste Seguro para Impressão sem Gráficos de Fundo**:
   * Usuários frequentemente imprimem com "Gráficos de segundo plano" desmarcado para economizar tinta. O design das bordas e títulos deve usar bordas sólidas pretas (`border: 1.5px solid #000; color: #000;`) garantindo legibilidade máxima mesmo sem fundos coloridos.
6. **Duas Vias Robustas de Obtenção**:
   * **Via 1 (Salvar PDF / Imprimir em Alta Resolução)**: `window.print()` estilizado com CSS Paged Media perfeito, permitindo salvar em PDF vetorial de altíssima definição pelo Chrome.
   * **Via 2 (Baixar PDF Editável Oficial)**: Geração direta de arquivo `.pdf` via `pdf-lib` baixado instantaneamente no disco, sem passar pelo diálogo de impressão.

---

## 🎯 Objetivos da Modificação

1. **Ocultação Rigorosa de Banners e Menus em `@media print`**:
   * Adicionar classe `.no-print` e ID específico ao banner `#modal-print-tip-banner`.
   * Assegurar que nenhum elemento além de `.a4-print-page` entre no fluxo de impressão.
2. **Paginação Perfeita em 2 Páginas Canônicas**:
   * Configurar `@page { size: A4 portrait; margin: 0; }`.
   * Ajustar as dimensões da folha para $210\text{mm} \times 297\text{mm}$ com padding interno de 7mm no topo/base e 9mm nas laterais.
   * Ajustar a altura das colunas e caixas de modo que todo o conteúdo da Página 1 e Página 2 caiba com folga ergonômica sem estourar.
   * Travar a Página 2 com `break-after: avoid;` eliminando qualquer 3ª página.
3. **Inversão dos Atributos (Score no centro grande, Modificador no medalhão)**:
   * No HTML A4 (`players.js` e `head_css.html`): O valor do atributo (ex: `20`, `14`, `16`) ficará grande no centro (`14pt bold`), e o modificador com sinal (ex: `+5`, `+2`, `+3`) ficará no medalhão inferior (`7.5pt bold`).
   * No PDF Editável (`pdf_export.js`): Campo principal de valor de atributo (`STR`, `DEX`, etc.) na caixa superior e campo de modificador (`STR_MOD`, etc.) no medalhão de cálculo.
4. **Correção de Nível Duplicado na Classe**:
   * Unificar a formatação em `players.js` utilizando a mesma lógica defensiva de `pdf_export.js` (`/\d/.test(className)`).
5. **Resiliência a Gráficos Desmarcados e Otimização do Cabeçalho**:
   * Garantir alto contraste e bordas nítidas para impressão preto-e-branco ou sem fundos coloridos.

---

## 📁 Arquivos e Módulos Afetados

| Arquivo | Componente / Responsabilidade |
|---|---|
| `src/ui/ui.html` | Adição da classe `.no-print` e ID `#modal-print-tip-banner` ao banner de dicas do modal de impressão |
| `src/styles/head_css.html` | Regras `@page { size: A4 portrait; margin: 0; }`, dimensões de `.a4-print-page` para $210\text{mm} \times 297\text{mm}$, ocultação estrita de `#modal-print-tip-banner`, classes de atributos `.a4-stat-score` e `.a4-stat-mod`, e garantia de alto contraste |
| `src/js/players.js` | Inversão dos campos de atributo (Score no centro, Modificador no oval), correção da duplicação de nível em `formattedClassLevel`, e contenção proporcional de alturas de blocos |
| `src/js/pdf_export.js` | Sincronização da inversão no gerador de PDF programático editável para conformidade com o mesmo padrão |
| `issues/README.md` | Registro detalhado da ISSUE-179 |

---

## ⚠️ Possíveis Impactos & Riscos Mitigados

* **Persistência (`localStorage`)**: Risco zero. Nenhuma chave ou schema de dados é alterado.
* **Combate e VTT**: Risco zero. Funções de combate operam de forma isolada.
* **Fidelidade Visual na Tela**: A pré-visualização no `#modal-print` manterá a mesma beleza e fidelidade da folha física.
* **Suíte de Testes**: Preservação de 100% de aprovação no `test_runner.js`.

---

## 🧪 Estratégia de Verificação Automatizada e Manual

1. **Automatizada**:
   * Compilação com `node builder.js`.
   * Execução de `node test_runner.js` validando todas as 2.716+ asserções existentes.
   * Criação de testes dedicados no `test_runner.js` verificando:
     - Presença da classe `.no-print` no banner de dicas.
     - Posicionamento correto do Valor de Atributo (Score) e do Modificador na estrutura HTML gerada.
     - Ausência de duplicação de nível (`Bruxo 8` e `Guerreiro 5 / Bárbaro 3`).
2. **Manual / Inspeção Visual**:
   * Verificação da pré-visualização de impressão para Claker e Deraravely.
   * Validação de que a saída do diálogo de impressão do navegador produz rigorosamente **2 páginas canônicas**, sem 3ª página vazia e sem quebras no meio das tabelas.

---

> ⚠️ **Aguardando aprovação explícita do usuário conforme a Regra 1 de `AGENTS.md` para iniciar as alterações no código sob `src/`.**
