# Plano de Implementação - Sistema Oficial de Invocações Místicas do Bruxo (D&D 5E) [ISSUE-174]

## 1. Contexto e Objetivo
O usuário solicitou disponibilizar as possíveis **Invocações Místicas (Eldritch Invocations)** que o Bruxo pode escolher.
Atualmente no sistema:
- O Bruxo calcula a quantidade de invocações por nível (`classes.js` e `players.js`), mas não existe um catálogo de dados oficial com as invocações nem um seletor visual no Criador/Editor de Personagens (`#modal-player`) ou na aba de Classes.
- Personagens como Claker e Caim possuem invocações digitadas apenas em texto livre, sem validação de pré-requisitos (nível de bruxo, truque *Rajada Mística*, Dádiva do Pacto da Lâmina/Tomo/Corrente) nem facilidade de escolha com 1 clique.

O objetivo da **ISSUE-174** é implementar o catálogo oficial com **38 Invocações Místicas D&D 5E** (Livro do Jogador, Guia de Xanathar e Caldeirão de Tasha), com seletor interativo, validação de pré-requisitos, contador pelo nível do Bruxo e integração total às fichas, compêndio e exportações.

---

## 2. Escopo das Modificações

### A. Base de Dados Oficial: `src/data/invocations.js`
Criar o módulo de dados canônico `WARLOCK_INVOCATIONS_DATA` contendo 38 invocações com:
- `id`: identificador único (ex: `'agonizing_blast'`, `'armor_of_shadows'`, `'book_of_ancient_secrets'`).
- `name`: Nome em português (ex: `'Rajada Agonizante'`, `'Armadura das Sombras'`, `'Visão Diabólica'`).
- `originalName`: Nome original em inglês (ex: `'Agonizing Blast'`).
- `minLevel`: Nível mínimo de Bruxo necessário (`1`, `5`, `7`, `9`, `12`, `15`).
- `pactRequired`: Pacto necessário (`null`, `'tome'`, `'blade'`, `'chain'`).
- `cantripRequired`: Truque necessário (`'Rajada Mística'` ou `null`).
- `spellGranted`: Magia concedida à vontade ou por espaço de pacto (ex: `'Armadura Arcana'`, `'Disfarçar-se'`).
- `type`: Categoria (`'Ativo'`, `'Passivo'`, `'Modificador de Rajada'`, `'Magia à Vontade'`).
- `description`: Texto completo das regras oficiais em português.
- `summary`: Resumo direto de 1 linha para consulta rápida em mesa.

### B. Compilador e Testes (`builder.js` e `test_runner.js`)
- Incluir `src/data/invocations.js` em `builder.js` dentro da ordem correta de concatenação de scripts.
- Atualizar verificações de integridade em `test_runner.js`.

### C. Interface do Criador/Editor de Ficha (`src/ui/ui.html` e `src/styles/head_css.html`)
- No Step 1 (Classe) do modal `#modal-player`, quando a classe selecionada for **Bruxo** e o Nível for $\ge 2$:
  - Exibir o painel interativo `#ddb-warlock-invocations-box`:
    - Cabeçalho com contador dinâmico de invocações: `🔮 Invocações Místicas: X de Y escolhidas` (Y = 2 no Nv 2-4, 3 no Nv 5-6, 4 no Nv 7-8, etc.).
    - Barra de filtros: `Todos`, `Pré-requisitos Atendidos`, `Rajada Mística`, `Pacto da Lâmina`, `Pacto do Tomo`, `Pacto da Corrente`.
    - Campo de busca instantânea de invocações.
    - Grade de cards `.ddb-invocation-card` com indicador de status (selecionada, disponível, bloqueada por pré-requisito com aviso claro).
    - Clique para alternar seleção respeitando o limite do nível com feedback visual em tempo real.
- Estilização Dark Fantasy Premium: tema púrpura arcana (`#a855f7`, `#c084fc`), badges de pré-requisito e destaque dourado ao selecionar.

### D. Lógica de Negócio e Fichas (`src/js/players.js` e `src/js/core.js`)
- Funções em `src/js/players.js`:
  - `getWarlockMaxInvocations(level)`: Retorna o limite oficial de invocações por nível.
  - `checkInvocationPrerequisites(inv, playerOrData)`: Valida se o herói atende nível de bruxo, truques e pacto.
  - `renderModalWarlockInvocations(player)`: Renderiza os cards interativos no modal.
  - `toggleModalWarlockInvocation(invId)`: Alterna seleção de invocação e sincroniza com a ficha.
  - Sincronização automática em `savePlayerSheet`: Salva array `p.invocations` e atualiza `p.features` garantindo que as invocações constem na lista de características.
  - Na visualização da ficha Roll20 (`renderPlayers`): Na aba "📜 Traços", renderizar as invocações com badge dedicada `🔮 Invocação Mística` e resumo de efeito.
- Atualização em `src/js/core.js`:
  - Configurar `invocations` nos heróis bruxos padrão:
    - **Claker (Bruxo 5)**: `["agonizing_blast", "armor_of_shadows", "devils_sight"]` (3/3 invocações).
    - **Caim Vonsilford (Bruxo 3)**: `["agonizing_blast", "armor_of_shadows"]` (2/2 invocações).

### E. Consulta no Compêndio de Classes (`src/js/classes.js`)
- Na aba "Classes & Habilidades", ao visualizar a classe Bruxo, disponibilizar seção expansível com o catálogo completo das 38 Invocações Místicas para leitura e planejamento do jogador.

---

## 3. Plano de Verificação e Testes

1. **Testes Automatizados de Dados (`test_invocations.js`)**:
   - Validar se o catálogo contém todas as 38 invocações oficiais.
   - Validar integridade de campos (`id`, `name`, `minLevel`, `description`).
   - Validar limites de invocações por nível (nível 1: 0; nível 2-4: 2; nível 5-6: 3; nível 20: 8).
   - Validar pré-requisitos: checagem de nível, checagem de truque Rajada Mística e checagem de pactos (Lâmina, Tomo, Corrente).
2. **Integração no Test Runner (`test_runner.js`)**:
   - Adicionar **Bateria 143** cobrindo dados, renderização e seleção de invocações.
3. **Compilação e Integridade de Telas**:
   - `node builder.js` -> compilação com sucesso do standalone.
   - `node test_ui_integrity.js` -> 100% das abas, modais e cliques aprovados.
   - `node test_runner.js` -> 100% de aprovação de toda a suíte.

---

## 4. Relatório de Execução e Status
- [x] **Base de Dados Oficial (`src/data/invocations.js`)**: 39 invocações oficiais de D&D 5E (PHB, XGE, TCE), helpers `findWarlockInvocationData`, `getWarlockMaxInvocations`, `checkInvocationPrerequisites`.
- [x] **Compilador e Scripts (`builder.js`)**: Concatenação correta de `dataInvocations` no bundle standalone `planilha do rpg.html`.
- [x] **Interface de Seleção (`src/ui/ui.html` e `src/styles/head_css.html`)**: Painel `#ddb-warlock-invocations-box`, contador dinâmico, chips de filtro rápido (*Todas*, *Elegíveis*, *Rajada*, *Lâmina*, *Tomo*, *Corrente*), busca instantânea e grid tátil de cards.
- [x] **Lógica de Fichas e Ataques (`src/js/players.js` e `src/js/core.js`)**:
  - Integração com cálculo de ataques: Rajada Mística com *Rajada Agonizante* soma modificador de Carisma por feixe.
  - Renderização na aba 📜 Traços da ficha com chip de filtro `🔮 Invocações` e badge temática.
  - Associação canônica para Claker (Bruxo 5, 3 invocações) e Caim Vonsilford (Bruxo 3, 2 invocações) com auto-migração retroativa em `loadFromLocalStorage()`.
- [x] **Compêndio de Classes (`src/js/classes.js`)**: Seção temática de referência rápida com as 39 invocações ao visualizar o Bruxo.
- [x] **Suíte de Testes Dedicada (`test_invocations.js`)**: 7 testes com 100% de aprovação.
- [x] **Bateria 143 em `test_runner.js`**: 2562/2562 testes automatizados aprovados (100% de sucesso).
- [x] **Auditoria de Integridade de UI (`test_ui_integrity.js`)**: 11/11 abas, 10/10 modais e 639/639 ações de clique aprovadas.
- [x] **Documentação em `issues/README.md`**: Registro formal da ISSUE-174.
