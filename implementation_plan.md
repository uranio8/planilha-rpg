# 📋 Plano de Implementação: Espaçamento e Harmonização de Características & Traços da Ficha (ISSUE-113)

## 📌 Contexto e Diagnóstico
Na imagem enviada pelo usuário da aba **📜 Traços & Características**, foram identificados problemas críticos de layout e compressão:
1. **Compressão Artificial Dupla e Espaço Vazio Sobrando**:
   - A aba possuía `max-height: 280px; overflow-y: auto;` em `src/js/players.js` (linha ~2008).
   - Internamente, cada lista de classe possuía outro limitador rígido `max-height: 220px; overflow-y: auto;` em `src/styles/head_css.html` (linha ~3819).
   - Isso forçava scrollbars internas desnecessárias e comprimia os cards num bloco minúsculo, deixando uma enorme área vazia e escura na parte inferior da coluna central da ficha Roll20 (enquanto a coluna 1 de perícias possui ~700px de altura).
2. **Corte Vertical de Textos e Descrições**:
   - A classe `.feature-snippet` possuía `-webkit-line-clamp: 2` com `overflow: hidden`, cortando abruptamente frases no meio da linha (como visto em "Retomar o Fôlego").
3. **Falta de Respiro e Espaçamento entre Cards**:
   - Os cards de características (`.unlocked-feature-item`) utilizavam `gap: 4px` e `padding: 6px 8px`, gerando poluição visual e baixa legibilidade tátil.
   - O seletor de Especialidade Marcial (`.feature-fighting-style-box`) ficava espremido dentro do card sem margens adequadas.

---

## 🎯 Objetivos da Melhoria
1. **Remover as Travas Artificiais de Altura**:
   - Substituir os `max-height: 280px` e `max-height: 220px` por um layout flexível e espaçado (`min-height: 480px; max-height: 680px; overflow-y: auto;`), preenchendo harmonicamente o espaço da coluna central e eliminando o vazio inferior.
2. **Eliminar Cortes Bruscos de Texto (`-webkit-line-clamp`)**:
   - Expandir a visualização do resumo para exibir o texto com clareza (`line-height: 1.5; font-size: 11.5px;`), permitindo leitura confortável sem cortes pela metade.
3. **Design Espaçado e Confortável dos Cards de Habilidades**:
   - Cards com `padding: 12px 14px; border-radius: 8px; margin-bottom: 8px; background: rgba(15, 23, 42, 0.75); border: 1px solid rgba(255, 255, 255, 0.08);`.
   - Efeito hover refinado com leve elevação e borda dourada suave (`border-color: rgba(245, 158, 11, 0.4)`).
   - Cabeçalhos de classe (`🌲 Habilidades de Guerreiro (Nível 4):`) destacados com divisor visual sutil, espaçamento superior e tipografia ouro antigo.
4. **Respiro no Seletor de Estilo de Luta e Subclasses**:
   - `.feature-fighting-style-box` com padding de `10px 12px`, bordas arredondadas e select estilizado com altura confortável (34px) e espaçamento respirável.

---

## 🏗️ Módulos e Arquivos Afetados
1. **`src/styles/head_css.html`**:
   - Atualização e expansão de `.unlocked-features-list`, `.unlocked-feature-item`, `.feature-snippet`, `.feature-fighting-style-box`, e `.feature-inline-select`.
2. **`src/js/players.js`**:
   - Ajuste do container da Aba 4 (`traits`) e harmonização do container de inventário/notas para aproveitar a altura natural da ficha Roll20.
3. **`test_runner.js`**:
   - Suíte 81 validando a integridade das regras de espaçamento e renderização da aba de características.
4. **`builder.js`**:
   - Recompilação de `planilha do rpg.html` e `index.html`.
5. **`issues/README.md`**:
   - Registro da **ISSUE-113**.

---

## 🛡️ Impactos e Riscos
- **Persistência (`localStorage`)**: Zero impacto (apenas visual e espaçamento).
- **Mecânicas D&D 5E**: Zero impacto (habilidades e seletores continuam funcionando perfeitamente).
- **Testes Existentes**: Preservação dos 1360 testes já aprovados.

---

## 🧪 Estratégia de Verificação
- Compilação via `node builder.js`.
- Execução de `node test_runner.js` garantindo 100% de sucesso.
- Inspeção visual garantindo que o espaço foi preenchido de maneira elegante, legível e sem cortes.
