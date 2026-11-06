# 📋 Plano de Implementação: Blindagem Total contra Cache e Leaks no A4 (ISSUE-179 - Refinamento)

## 📌 Contexto & Análise do Feedback do Usuário

O usuário enviou o PDF gerado (`media_1793969658640_26f3a59f.pdf`) com a mensagem:
> *"ta sendo impresso assim"*

### 🔍 Diagnóstico do Arquivo Enviado pelo Usuário:
1. **O documento agora possui RIGOROSAMENTE 2 PÁGINAS**:
   * A folha 1 e a folha 2 foram unificadas canonicamente, sem páginas 3 ou 4 excedentes!
2. **Entretanto, o PDF gerado às 09:53:53 ainda continha o estado em cache do navegador**:
   * O banner de dicas amarelo ainda figurava no topo da Página 1.
   * A classe ainda exibia `Mago 8 8`.
   * Os atributos ainda exibiam o modificador em cima e o valor embaixo.
3. **Causa Raiz Comprovada**:
   * O navegador do usuário estava executando o bundle anterior em cache de memória/disco (`index.html` de 4.6MB servido pelo GitHub Pages com cache HTTP padrão de 10 minutos).
   * O push anterior (`abad761`) foi concluído às 09:51:30 e o PDF foi gerado às 09:53:53 sem que o navegador tivesse feito um **Hard Refresh (Ctrl + F5)**.
   * Adicionalmente, para garantir blindagem definitiva independente de qualquer comportamento de cache ou motor de impressão:
     - O banner de dicas deve ser movido **para dentro** de `#modal-print-toolbar` (que já é nativamente `display: none !important;` na impressão).
     - `#modal-print .modal-body > *:not(.print-a4-preview-viewport)` deve ser ocultado de forma estrita via CSS.
     - `formattedClassLevel` deve conter regex de desduplicação `/\b(\d+)\s+\1\b/g` para sanitizar casos onde a string no `localStorage` do usuário já esteja gravada como `"Mago 8 8"`.
     - Inclusão de meta tags de `Cache-Control: no-cache` e exibição de badge de versão `v3.9.1` no modal de impressão para auditoria visual imediata.

---

## 🎯 Objetivos do Refinamento

1. **Blindagem Estrutural Contra Impressão de Banners**:
   * Mover o banner de dicas para dentro do `#modal-print-toolbar` (ou torná-lo um tooltip/popover auxiliar), garantindo que nenhum elemento HTML fora da folha A4 possa ser interpretado pelo Chromium.
   * Regra CSS estrita: `#modal-print .modal-body > *:not(.print-a4-preview-viewport) { display: none !important; }`.
2. **Higienização Defensiva contra `"Mago 8 8"` no `localStorage`**:
   * Aplicar regex `/\b(\d+)\s+\1\b/g` no `formattedClassLevel` para eliminar duplicações herdadas de edições manuais anteriores no cache local do navegador.
3. **Controle de Cache do Navegador (Cache-Busting)**:
   * Adicionar meta tags `Cache-Control: no-cache, no-store, must-revalidate`, `Pragma: no-cache` e `Expires: 0` no `<head>` de `src/styles/head_css.html`.
   * Incluir badge `v3.9.1` visível no cabeçalho do `#modal-print` para que o usuário saiba com certeza absoluta se o navegador carregou a nova versão.

---

## 📁 Arquivos Afetados

| Arquivo | Componente / Responsabilidade |
|---|---|
| `src/ui/ui.html` | Mover `#modal-print-tip-banner` para dentro de `#modal-print-toolbar` e exibir badge `v3.9.1` |
| `src/styles/head_css.html` | Meta tags anti-cache no head e regra estrita `#modal-print .modal-body > *:not(.print-a4-preview-viewport)` |
| `src/js/players.js` | Sanitização por regex de duplicações numéricas no `formattedClassLevel` |
| `src/js/core.js` | Atualização de versão para `3.9.1` |
| `test_runner.js` | Teste automatizado para validar a nova regra e ausência de banners no body |

---

## 🧪 Estratégia de Verificação

* Compilação com `node builder.js`.
* Suíte completa com `node test_runner.js` (garantindo 100% de sucesso nas 2.732+ asserções).
* Validação via Chrome Headless confirmando que o PDF final contém Score central grande, Modificador no medalhão, `Mago 8` e zero banners.
