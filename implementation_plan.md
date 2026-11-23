# 📋 Plano de Implementação: Reforma de Modais & Revisão de Layouts (ISSUE-187)

## 📌 Contexto & Solicitação do Usuário

O usuário solicitou uma revisão de layouts e arranjos do sistema para facilitar a leitura das informações e reformar modais que apresentam problemas visuais — especialmente **símbolos, ícones ou nomes saindo da caixa**, títulos cortados/apagados ou grades espremidas.

---

## 🎯 Diagnóstico & Objetivos da Modificação (ISSUE-187 — `v3.13.1`)

### 1. 🪟 Reforma Global de Modais (`src/styles/head_css.html` & `src/ui/ui.html`)
* **Títulos de Modal com Emojis/Símbolos e Quebra Segura**:
  * Problema encontrado: `.modal-header h2, .modal-header h3, .modal-header .modal-title` utilizava `-webkit-background-clip: text` e `-webkit-text-fill-color: transparent`, o que apaga/distorce emojis e símbolos (ex.: `🏰`, `🧭`, `⚔️`, `✨`) e, sem `min-width: 0; flex: 1; overflow-wrap: anywhere; flex-wrap: wrap;`, faz títulos longos empurrarem o botão `✕` (`.modal-close`) para fora do cabeçalho.
  * Correção: Substituir o fill transparente por cor sólida de alto contraste (`#fef08a` com `text-shadow` sutil), adicionar `min-width: 0; flex: 1; flex-wrap: wrap; overflow-wrap: anywhere; line-height: 1.3;` e garantir que `.modal-close` tenha `flex-shrink: 0`.
* **Contenção Horizontal Rigorosa (`.modal-body`, `.modal-box`, `.modal-content`)**:
  * Adicionar `box-sizing: border-box; overflow-x: hidden;` e `max-width: 100%; min-width: 0; box-sizing: border-box;` para `input`, `select` e `textarea` dentro de modais, impedindo que campos ou badges estiquem o modal para fora da tela.
* **Modais de Ficha, Magias, Perícias e Level Up (`.skill-modal-card`, `.levelup-card`, `.ddb-builder-modal`)**:
  * Garantir `min-width: 0; flex: 1;` nos blocos internos (`.skill-modal-hero-left`, `.skill-modal-header-left`, `.ddb-hero-left`) e `overflow-wrap: anywhere;` nos títulos (`.skill-modal-title`, `.ddb-hero-name`) para que nomes extensos e tags nunca escapem da caixa.
  * Garantir rolagem interna limpa no corpo dos modais de detalhe para que botões/textos não sejam cortados.
* **Responsividade em Grades Internas de Modais**:
  * Em `@media (max-width: 640px)`, garantir que grades de 2 a 5 colunas dentro de `.modal-body` adaptem colunas estreitas e filhos tenham `min-width: 0`.

### 2. 📐 Revisão de Layouts e Leitura de Informações (`src/styles/head_css.html`)
* **Contenção de Nomes, Badges e Símbolos em Cards**:
  * Aplicar `min-width: 0` e `overflow-wrap: anywhere` nos títulos e cabeçalhos flex/grid de:
    * Fichas de Jogadores (`.player-title-row`, `.player-title`, `.class-badge`)
    * Combatentes (`.combatant-header`, `.combatant-name`, `.combatant-stats-row`)
    * Bastião (`.bastion-facility-header`, `.bastion-facility-name`, `.bastion-title-wrap`, `.bastion-title-text`, `.bastion-kpi-card`)
    * Armas no Modal (`.modal-weapon-top`, `.modal-weapon-name`)
    * Atlas de Cidades (`.atlas-city-card-top`, `.atlas-city-name`, `.atlas-attraction-box`)
* **Melhoria de Hierarquia Visual & Legibilidade**:
  * Refinar espaçamento (`gap`, `padding`), alinhamento e contraste em cards de informação densa (`.bastion-kpi-card`, `.atlas-attraction-box`, `.ddb-builder-hero-bar`), mantendo a estética Dark Fantasy e a responsividade mobile.

### 3. 🔖 Versionamento & Verificação (`src/js/core.js`, `src/ui/ui.html`, `test_runner.js`, `issues/README.md`)
* Atualizar versão da aplicação para `v3.13.1`.
* Adicionar **[Bateria 154]** em `test_runner.js` validando as regras de contenção (`overflow-x: hidden`, `min-width: 0`, `overflow-wrap: anywhere`, remoção de `-webkit-text-fill-color: transparent` em títulos de modal) e executar `node builder.js` + `node test_runner.js` (incluindo `test_ui_integrity.js`).

---

## 📁 Arquivos e Módulos Afetados

| Arquivo | Modificação |
|---|---|
| `src/styles/head_css.html` | Reforma global de modais, contenção `min-width: 0` / `overflow-wrap`, correção de títulos com emojis e refinamento de espaçamento/hierarquia dos cards |
| `src/ui/ui.html` | Ajustes pontuais de estrutura/classes em modais com grades apertadas e atualização do badge de versão para `v3.13.1` |
| `src/js/core.js` | Atualização de `APP_VERSION` para `'3.13.1'` |
| `test_runner.js` | Atualização de versão esperada (`3.13.1`) e adição da Bateria 154 |
| `issues/README.md` | Registro da ISSUE-187 |

---

## ⚠️ Possíveis Impactos & Riscos

* **Persistência (`localStorage`) e Combate/Sincronização**: Nenhum impacto — alterações puramente visuais/CSS e estruturais de layout.
* **Impressão A4 (`@media print`)**: As regras de reforma global de modais não alterarão as diretivas específicas de `@media print` para `#modal-print`.

---

> ⚠️ **Aguardando sua aprovação explícita conforme a Regra 1 do `AGENTS.md` para iniciar a implementação nos arquivos sob `src/`.**
