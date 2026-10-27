# Plano de Implementação - Modernização Visual & Paleta Nobre da Ficha A4 em PDF (ISSUE-149)

## 🎯 Contexto e Objetivos

O usuário solicitou:
> *"está excelente o pdf, vamos apenas pesquisar na internet uma melhoria tecnica em questão visual, colorir um pouco mais ou uma mudança mais personalizada no layout pra ficar mais bonitinho"*

O objetivo é transformar a ficha A4 em 2 páginas em uma peça visualmente nobre, colorida e charmosa, inspirada nos melhores redesigns visuais da comunidade D&D 5E, mantendo a fidelidade das regras e o respeito ao consumo de tinta na impressão física.

---

## 🎨 Especificação do Design System Nobre D&D

### 1. Cabeçalho Épico & Identidade Visual
- **Título do Personagem**:
  - Banner estilizado com borda dupla dourada/bronze (`#d97706`) e fundo escuro nobre gradiente (`linear-gradient(135deg, #0f172a 0%, #1e293b 100%)`).
  - Nome do herói em tipografia *Cinzel* com cor dourada suave (`#fef08a`), e tag do sistema em dourado antigo (`#f59e0b`).
- **Grade de Metadados**:
  - Caixas com fundo suave pergaminho (`#f8fafc`), borda esquerda dourada sutil (`#f59e0b`) e labels em maiúsculas refinadas.

### 2. Painéis Táteis & Color-Coding Funcional
- **Atributos em Medalhão**:
  - Caixas de atributos verticais com topo colorido em azul meia-noite (`#0f172a`), modificador em destaque com fundo branco e escore base em mini-pill oval cinza perolado (`#e2e8f0`).
- **Combate de Alto Impacto**:
  - **CA, Iniciativa e Deslocamento**: caixas no estilo brasão/escudo com acentos de cor temáticos (Iniciativa em âmbar `#d97706`, CA em azul profundo `#1e3a8a`, Deslocamento em verde bosque `#065f46`).
  - **Pontos de Vida (PV)**: cabeçalho com barra esmeralda (`#ecfdf5`), PV atual em destaque vivo e slots temporários em azul safira suave (`#eff6ff`).
- **Perícias e Salvaguardas**:
  - Bullets de proficiência preenchidos (`●`) com a cor dourada/âmbar brilhante (`#d97706`) sobre fundo suave, destacando instantaneamente as especialidades do herói.
- **Tabela de Ataques**:
  - Cabeçalho com fundo suave `#f1f5f9`, linhas alternadas delicadas (`#ffffff` e `#fbfcfd`), e bônus de acerto envolto em uma pill arredondada com borda dourada.
- **Cofre de Moedas (Página 2)**:
  - Células coloridas por tipo de metal: **PO** em amarelo ouro suave (`#fef3c7`), **PP** em prata perolada (`#f1f5f9`), **PC** em cobre suave (`#ffedd5`), **PE** em bronze electrum (`#fef9c3`) e **PL** em platina suave (`#e0e7ff`).
- **Grimório & Magias**:
  - Títulos de níveis de magia com selos arcanos em azul/índigo (`#0284c7`) e marcadores estelares (`✦`).

### 3. Otimização de Impressão (`@media print`)
- No modo de impressão de papel ou PDF para gráfica, preserva o contraste de texto 100% legível com fundos claros, garantindo que mesmo em impressoras monocromáticas os elementos saiam com nitidez impecável.

---

## 🛠️ Modificações Propostas

### 1. `src/styles/head_css.html`
- Atualização das classes `.a4-*` para incorporar as novas bordas, gradientes, fundos temáticos e medalhões.
- Definição de regras para `.a4-sheet-header`, `.a4-stat-card`, `.a4-combat-pill`, `.a4-hp-box`, `.a4-coin-cell`, `.a4-bullet.active`, etc.

### 2. `src/js/players.js`
- Enriquecer a estrutura gerada em `printPlayerSheet`:
  - Adicionar classes semânticas de cor nas células de combate e atributos.
  - Formatar os marcadores de proficiência e badges de dano.

### 3. `test_runner.js`
- Adicionar **Bateria 118**:
  - Validar a presença das novas regras de cores e medalhões no CSS compilado.
  - Validar renderização dos atributos, moedas coloridas e tabela de ataques.
  - Validar 100% de sucesso nos 2076+ testes.

---

## 🔒 Critérios de Aceite e Verificação

1. Ao abrir o modal de download da ficha (`📥`), as 2 páginas A4 surgem com design vibrante, elegante e estilizado (cabeçalho nobre, medalhões de combate e cores sutis).
2. O salvamento em PDF / impressão gera um documento colorido de alta resolução.
3. Compilação executada sem erros (`node builder.js`).
4. Suíte completa de testes aprovada com 100% de sucesso (`node test_runner.js`).

---

## ✅ Status de Execução

- [x] Design System Nobre Colorido D&D 5E implementado em `src/styles/head_css.html`.
- [x] Classes semânticas e marcação temática enriquecida em `src/js/players.js`.
- [x] Compilação gerada com sucesso via `node builder.js` (`planilha do rpg.html` e `index.html`).
- [x] Bateria 118 implementada e aprovada em `test_runner.js` (2091/2091 testes passando - 100% de sucesso).
- [x] Registro efetuado em `issues/README.md` (ISSUE-149).
- [x] Código sincronizado no GitHub via git seguro (`origin main`).
