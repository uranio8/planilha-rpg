# 📋 Plano de Implementação - ISSUE-172: Correção de Salvamento e Persistência de Magias

## 📌 Contexto e Diagnóstico

O usuário relatou: *"escolhi as magias dos personagens, mas quando fecho a ficha, ele não esta salvando as magias"*, solicitando também: *"adicione ao plano de implementação um teste real entrando pelo site dos agentes"*.

Após investigação detalhada no ciclo de vida de magias nas fichas (`src/js/players.js`, `src/js/screen_sync.js`, `src/js/core.js` e `src/ui/ui.html`), foram identificadas as seguintes causas raízes:

1. **Fechamento sem Salvamento no Seletor de Magias (`modal-spell-picker`)**:
   - Quando o usuário escolhe magias no modal do compêndio e fecha a tela clicando fora (no fundo escuro `.modal-overlay`), o listener genérico em `src/js/screen_sync.js` remove diretamente a classe `.open` sem invocar `closeSpellPickerModal()` nem `saveSpellPickerSelection()`.
   - Quando fecha pressionando a tecla `Escape`, `closeAllModals()` também remove `.open` sem disparar o salvamento.
   - Em `closeSpellPickerModal()`, o auto-salvamento dependia exclusivamente de `pickerHasChanges`, que podia ser falso se o usuário navegou em abas do mago, transcreveu magia (`copySpellToSpellbook`) ou teve qualquer inconsistência de estado.
   - A limpeza de `unpreparedSpells` apagava indevidamente magias não preparadas de conjuradores divinos e preparados.

2. **Parser Quebrado de Magias em `savePlayerSheet()` e `openPlayerModal()`**:
   - No modal de edição da ficha (`#modal-player`), o campo `pm-spells` recebe o texto gerado por `buildPlayerSpellsSummary()` (ex: `"Truques: Raio de Fogo. Preparadas: Mísseis Mágicos, Escudo Arcano."`).
   - Em `savePlayerSheet()`, o regex `.split(/[\n,;]+/)` **não separava por ponto final (`.`)**. Isso gerava tokens como `"Raio de Fogo.  Mísseis Mágicos"` e `"Escudo Arcano."`, que falhavam na busca exata em `SPELLS_DATA`, descartando todas as magias!
   - Além disso, a comparação exigia correspondência exata de acentos (ex: `"misseis magicos"` falhava contra `"Mísseis Mágicos"`).
   - O objeto `data` construído em `savePlayerSheet()` omitia propriedades essenciais como `_spellsSyncedFromPicker`, `unpreparedSpells` e `knownSpells`, fazendo com que a sincronização posterior e o `getPlayerKnownSpells` considerassem a ficha como desincronizada.

3. **Ausência de Botão de Escolha de Magias dentro do Modal da Ficha (`modal-player`)**:
   - Na etapa 4 (*4. Atributos & Magias*) do Criador/Editor de Personagens (`#modal-player`), havia apenas um campo de texto livre `pm-spells`, sem botão para abrir o seletor do compêndio D&D 5E (`modal-spell-picker`) e sem visualização em tempo real das magias escolhidas.

---

## 🎯 Objetivos da Correção

1. **Blindagem de Fechamento do Seletor de Magias (`modal-spell-picker`)**:
   - Garantir que qualquer fechamento (botão `✕`, botão `Fechar`, clique no backdrop `.modal-overlay` ou tecla `Escape`) **sempre** execute `saveSpellPickerSelection(true)` e persista as magias no herói e no `localStorage`.
   - Limpar e preservar corretamente `preparedSpells`, `spellbookSpells`, `unpreparedSpells` e `_spellsSyncedFromPicker`.

2. **Parser Robusto e Tolerante de Magias em `savePlayerSheet()` e `parseSpellNamesFromRawText()`**:
   - Tratar quebras por ponto final (`.`), vírgula (`,`), ponto e vírgula (`;`) e quebras de linha (`\n`).
   - Normalizar acentos (NFD) e maiúsculas/minúsculas para encontrar correspondência com `SPELLS_DATA`.
   - Preservar magias personalizadas ou não catalogadas em vez de descartá-las silenciosamente.
   - Preservar `_spellsSyncedFromPicker`, `unpreparedSpells` e `knownSpells` no objeto salvo.

3. **Integração de Escolha de Magias dentro do Modal da Ficha (`modal-player`)**:
   - Adicionar botão interativo **`✨ Escolher Magias no Compêndio`** na seção de Magias de `#modal-player`.
   - Adicionar container de chips visuais das magias selecionadas em tempo real dentro do modal da ficha.
   - Permitir escolher magias durante a criação ou edição e sincronizar imediatamente com a ficha.

4. **Teste Real E2E dos Agentes no Site (`test_spells_agent_e2e.js`)**:
   - Criar um script dedicado de simulação ponta a ponta simulando agentes reais entrando na aplicação (`planilha do rpg.html` / standalone):
     - **Agente Jogador**: Abre a ficha do seu personagem, acessa a aba de magias, clica em "Escolher Magias", seleciona truques e magias de 1º/2º círculo, fecha a janela pelo botão `✕`, pelo botão `Fechar` e por clique externo no backdrop.
     - **Agente Mestre**: Cria um novo personagem e edita um personagem existente pelo modal `#modal-player`, clica no botão "Escolher Magias no Compêndio", seleciona magias e salva a ficha.
     - **Auditoria de Persistência**: Simula fechamento e reabertura da página (reload via `loadFromLocalStorage`), confirmando que 100% das magias permanecem salvas, exibidas nos cards, com contadores de slots e preparo íntegros.

5. **Compatibilidade e Bateria 141 no Test Runner**:
   - Adicionar **Bateria 141** no `test_runner.js` validando todos os cenários de salvamento, fechamento por backdrop/ESC, parser tolerante e persistência.
   - Validar integridade via `node test_ui_integrity.js` e compilar standalone via `node builder.js`.

---

## 📁 Módulos e Arquivos Afetados

- `src/js/players.js`:
  - Aprimorar `closeSpellPickerModal()` e `saveSpellPickerSelection()` para auto-salvamento incondicional e resiliente.
  - Atualizar `openSpellPickerModal()` para suportar ser chamado a partir de `#modal-player` (mantendo o herói ativo ou em edição).
  - Corrigir o parser de magias em `savePlayerSheet()` com normalização de acentos, suporte a pontuação (`.`) e preservação de campos `_spellsSyncedFromPicker`, `unpreparedSpells` e `knownSpells`.
  - Atualizar `renderModalSpellsPreview()` para exibir chips de magias selecionadas no modal da ficha.
- `src/ui/ui.html`:
  - Adicionar botão `✨ Escolher Magias no Compêndio` e container `#pm-spells-chips-preview` dentro de `#modal-player` (aba 4: Atributos & Magias).
  - Configurar `onclick="if(event.target===this) closeSpellPickerModal()"` no `#modal-spell-picker`.
- `src/js/screen_sync.js`:
  - No listener de clique de `.modal-overlay` e no handler de `Escape`, direcionar o fechamento de `modal-spell-picker` para `closeSpellPickerModal()`.
- `test_spells_agent_e2e.js`:
  - Novo script E2E de simulação de agentes reais operando o fluxo de seleção, fechamento e persistência de magias.
- `test_runner.js`:
  - Adicionar **Bateria 141** testando exaustivamente o ciclo de vida e salvamento de magias.
- `issues/README.md`:
  - Registrar **ISSUE-172**.

---

## 🧪 Estratégia de Verificação

1. **Teste Real E2E dos Agentes (`node test_spells_agent_e2e.js`)**:
   - Execução do fluxo completo de Mestre e Jogador abrindo, escolhendo magias, fechando a ficha e verificando persistência.
2. **Testes Automatizados Unitários (`node test_runner.js`)**:
   - Validação da Bateria 141 com 100% de aprovação em todos os testes do runner.
3. **Suíte de Integridade de UI (`node test_ui_integrity.js`)**:
   - Garantir 100% das ações de clique em `ui.html`.
4. **Compilação (`node builder.js`)**:
   - Gerar `planilha do rpg.html` e `index.html` íntegros e sincronizados.
