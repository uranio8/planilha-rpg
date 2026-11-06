# 📋 Plano de Implementação: Overhaul Visual, Identidade Épica de Cores e Eliminação da Página 3 em Branco (ISSUE-180)

## 📌 Contexto & Diagnóstico da Solicitação do Usuário

O usuário enviou as capturas do diálogo de impressão do navegador (Chrome) demonstrando os problemas nas fichas de diferentes personagens (**Arkhalis**, **Deraravely** e **Claker**):
> *"esta assim agora, tem coisa q n da pra ver pq ta preto ou azul escuro, vams melhorar o layout visual e de cores, dando uma identidade mais viva"*

### 🔍 Diagnóstico Técnico Detalhado dos Problemas:

1. **Textos Pretos Sobre Fundos Escuros (Ilegibilidade Total nos Badges e Cabeçalhos)**:
   * **Causa Raiz**: No arquivo `src/styles/head_css.html:9665` (sob `@media print`), existe a regra genérica:
     `.print-document-sheet *, .a4-print-page * { color: #000000 !important; }`
     Esta regra força **todo e qualquer texto a ficar preto `#000000`**.
   * Quando combinada com elementos que usam fundos escuros:
     - `.a4-feature-tag` possui `background: #1e293b;` (azul ardósia escuro). Com o texto forçado a preto, todas as tags de características (`PASSIVO`, `CONTINUO`, `AÇÃO BÔNUS`, `LIVRE`) tornam-se **blocos pretos 100% ilegíveis**!
     - `.a4-sheet-title-box` possui gradiente escuro (`#0f172a`), fazendo com que o nome do herói (`CLAKER`, `ARKHALIS`, `DERARAVELY`) fique preto sobre azul-escuro.
     - `.a4-stat-name` usa fundo `#0f172a`, gerando faixas pretas.
   * **Comportamento do Chrome sem "Gráficos de segundo plano"**:
     Nas capturas do usuário, a opção **[ ] Gráficos de segundo plano** está desmarcada (padrão do Chrome). Quando desmarcada, o navegador remove fundos coloridos, tornando textos brancos invisíveis e gerando inconsistências severas.

2. **Causa Raiz da Página 3 em Branco / Transbordada**:
   * Em `src/styles/head_css.html:9642`, a altura das páginas está fixada em `height: 295mm !important; min-height: 295mm !important; max-height: 295mm !important;`.
   * Uma folha A4 física tem $297\text{mm}$.
   * No diálogo de impressão do Chrome, quando o usuário usa **Margens: "Padrão"** (10-15mm) e **[x] Cabeçalhos e rodapés** (8mm adicionais), a altura útil imprimível da folha cai para aproximadamente **$262\text{mm}$ a $270\text{mm}$**.
   * Como $295\text{mm} > 267\text{mm}$, o Chrome é matematicamente forçado a criar quebras de página forçadas, empurrando o conteúdo para uma 3ª página (ou criando uma 3ª folha em branco residual com a barra lateral cinza).
   * **Comprovação Experimental**: Realizamos testes reais com o motor headless do Chrome:
     - `Height 295mm`: Gera **3 páginas**.
     - `Height 265mm`: Gera **EXATAMENTE 2 PÁGINAS CANÔNICAS**, tanto para personagens conjuradores (Arkhalis/Claker) quanto para guerreiros multiclasse com muitas características (Deraravely).

3. **Identidade Visual Sombria & Sem Vida**:
   * O usuário pediu expressamente: *"dando uma identidade mais viva"*.
   * Fichas canônicas e livros de D&D 5E utilizam uma paleta nobre e quente de alta fantasia: pergaminho marfim, carmesim dragão nobre, ouro âmbar polido, roxo arcano, verde esmeralda e azul cobalto.

---

## 🎯 Objetivos e Solução Proposta

### 1. 🎨 Nova Identidade Visual Épica de Alta Fantasia D&D 5E:
* **Cabeçalho Nobre em Pergaminho Marfim**:
  * Substituir o bloco preto do `.a4-sheet-title-box` por um fundo marfim pergaminho suave (`background: #fffbeb; border: 1.5px solid #b45309; border-left: 5px solid #991b1b;`).
  * **Nome do Herói** em **Carmesim Dragão Nobre** (`color: #991b1b !important; -webkit-text-fill-color: #991b1b !important; font-family: 'Cinzel', serif; font-size: 16pt; font-weight: 900; letter-spacing: 1px;`).
  * **Subtítulo** em **Dourado Âmbar** (`color: #b45309 !important; -webkit-text-fill-color: #b45309 !important; font-weight: 800; font-size: 6.5pt;`).
  * Funciona com 100% de nitidez com gráficos de fundo ativados OU desativados.
* **Atributos Vivos & Cristalinos**:
  * Header do atributo (`.a4-stat-name`): Carmesim Nobre (`background: #991b1b !important; color: #ffffff !important; -webkit-text-fill-color: #ffffff !important; font-weight: 900; font-size: 6.5pt;`).
  * Valor do Atributo no centro (`.a4-stat-score`): Em destaque (`font-size: 14pt; font-weight: 900; color: #0f172a;`).
  * Medalhão do Modificador embaixo (`.a4-stat-mod`): Em formato oval âmbar suave (`background: #fef3c7 !important; border: 1.5px solid #d97706 !important; color: #92400e !important; -webkit-text-fill-color: #92400e !important; font-size: 8pt; font-weight: 900;`).
* **Badges de Habilidades Semânticos (Fim dos Blocos Pretos)**:
  * Substituir o fundo preto `#1e293b` por pastéis luminosos de alto contraste com bordas vivas e texto escuro de alta legibilidade:
    - `PASSIVO`: Roxo arcano suave (`background: #ede9fe !important; border: 1px solid #8b5cf6 !important; color: #5b21b6 !important; -webkit-text-fill-color: #5b21b6 !important;`).
    - `AÇÃO`: Verde esmeralda tático (`background: #dcfce7 !important; border: 1px solid #16a34a !important; color: #14532d !important; -webkit-text-fill-color: #14532d !important;`).
    - `AÇÃO BÔNUS / REAÇÃO`: Laranja rubi ágil (`background: #ffedd5 !important; border: 1px solid #ea580c !important; color: #9a3412 !important; -webkit-text-fill-color: #9a3412 !important;`).
    - `USO / RECARGA` (`1x/Descanso Longo`, `1x/Curto`): Dourado de prestígio (`background: #fef3c7 !important; border: 1px solid #d97706 !important; color: #92400e !important; -webkit-text-fill-color: #92400e !important; font-weight: 700;`).
    - `DISTÂNCIA / ALCANCE`: Azul celeste (`background: #e0f2fe !important; border: 1px solid #0284c7 !important; color: #0369a1 !important; -webkit-text-fill-color: #0369a1 !important;`).
* **Pilares de Combate e Vida**:
  * CA: Azul Escudo Nobre (`background: #f0f9ff; border: 1.5px solid #0284c7; color: #0369a1;`).
  * Iniciativa: Âmbar Relâmpago (`background: #fffbeb; border: 1.5px solid #d97706; color: #92400e;`).
  * Deslocamento: Verde Velocidade (`background: #f0fdf4; border: 1.5px solid #16a34a; color: #15803d;`).
  * Caixa de PV: Faixa superior Carmesim (`background: #b91c1c; color: #ffffff;`).
* **Títulos de Caixas (`.a4-box-title`)**:
  * Pergaminho marfim com traço inferior dourado (`background: #fffbeb !important; border-bottom: 2px solid #b45309 !important; color: #78350f !important; font-family: 'Cinzel', serif; font-weight: 800;`).

### 2. 📄 Garantia Definitiva de 2 Páginas Canônicas (Zero Página 3):
* No `@media print`:
  - Definir `.a4-print-page` com `height: 265mm !important; max-height: 265mm !important; min-height: 0 !important;` e `padding: 5mm 8mm !important;`.
  - Configurar `@page { size: A4 portrait; margin: 6mm 8mm; }`.
  - Travar `.a4-page-2` com `break-after: avoid !important; page-break-after: avoid !important; margin-bottom: 0 !important;`.
  - Ocultar rigorosamente o banner `#modal-print-tip-banner` e quaisquer elementos externos.

---

## 📁 Arquivos e Módulos Afetados

| Arquivo | Componente / Responsabilidade |
|---|---|
| `src/styles/head_css.html` | Cores nobres, pergaminho claro, badges semânticos, remoção da regra forçada `* { color: #000; }`, e ajuste de altura para `265mm` |
| `src/js/players.js` | Injeção de classes semânticas nos badges de características e sanitização rigorosa de nível |
| `src/js/core.js` | Atualização de versão para `v3.9.2` |
| `src/ui/ui.html` | Atualização do badge de versão para `v3.9.2` |
| `issues/README.md` | Registro oficial da ISSUE-180 |
| `test_runner.js` | Testes automatizados cobrindo contraste, 2 páginas e ausência de blocos pretos |

---

## 🧪 Estratégia de Verificação

1. **Testes Automatizados (`node test_runner.js`)**:
   - Validação de ausência de blocos pretos em badges (`.a4-feature-tag`).
   - Validação da altura canônica compatível com Chrome (`265mm`).
   - Validação de quebra canônica de 2 páginas.
2. **Teste com Chrome Headless Real**:
   - Execução de impressão via linha de comando do Chrome para Arkhalis, Deraravely e Claker, validando `pageCount === 2` com 100% de precisão.
3. **Compilação**:
   - Execução de `node builder.js` e verificação no `planilha do rpg.html`.

---

> ⚠️ **Aguardando aprovação explícita do usuário conforme a Regra 1 de `AGENTS.md` para iniciar as alterações no código sob `src/`.**
