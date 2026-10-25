# Plano de Implementação - Correção do Balão de Magia/Item, Exclusão de Fichas e Ergonomia Intuitiva do Inventário (ISSUE-134)

## 📌 Contexto e Diagnóstico

O usuário reportou três problemas críticos na experiência com as fichas de personagens (com capturas de tela anexadas):
1. **Balão da Magia (💬) não diz o que a magia faz**:
   - No card da magia (ex: *Passo Nebuloso*), o botão do balão `💬` disparava `sharePlayerSpellToFeed()`, que apenas enviava um trecho truncado de 140 caracteres para o log de combate em segundo plano, sem abrir nada na tela da ficha do jogador.
   - O usuário espera que ao clicar no balão (ou no card), a aplicação explique e exiba claramente **o que a magia faz** (tempo de conjuração, alcance, duração, componentes e descrição completa dos efeitos D&D 5E).
2. **Exclusão de Ficha não apaga**:
   - No cabeçalho da ficha (barra de ferramentas superior do card), o botão de lixeira chamava `deletePlayer('${p.id}')`.
   - No entanto, a função implementada em `src/js/players.js` chamava-se `deletePlayerDirect(id)`. Como `deletePlayer` não existia nem estava exportada em `window`, o navegador disparava um erro silencioso (`ReferenceError: deletePlayer is not defined`) e a ficha nunca era excluída.
   - Além disso, a função não disparava a sincronização com o Firebase (`syncLocalChangesToFirebase`), o que permitia que o banco de dados em tempo real restaurasse a ficha.
3. **Itens do Inventário pouco intuitivos**:
   - O indicador de "Equipado" era uma bolinha vermelha estática `🔴` (`.roll20-item-equipped-toggle.active`), que parecia um botão de gravação ou erro, sem nenhum texto ou ícone explicativo.
   - O botão `⚡ Usar` aparecia inclusive para armaduras e armas, e ao ser clicado diminuía a quantidade do item permanente, "consumindo" o equipamento.
   - O balão `💬` no item apenas postava o nome e quantidade no chat, sem exibir as propriedades, dano, classe de armadura ou descrição do item.

---

## 🎯 Proposta de Solução

### 1. 📖 Balão e Visualização Completa de Magias ("O que a magia faz")
- **Comportamento do Balão `💬`**:
  - Configurar o botão para abrir o Modal Tátil de Resumo da Magia (`openSpellQuickView(sName, p.id)`).
  - Atualizar o tooltip para: `"Ver o que a magia faz (Descrição completa)"`.
  - No modal `modal-spell-quick-view`, adicionar o botão `💬 Compartilhar no Chat` para permitir enviar a descrição completa ao feed quando desejado.
- **Enriquecimento no Chat (`sharePlayerSpellToFeed`)**:
  - Exibir a descrição integral da magia (sem truncar em 140 caracteres).
  - Exibir um toast ou notificação visual na tela para que o usuário receba feedback imediato mesmo na aba de Fichas.

### 2. 🗑️ Correção Definitiva da Exclusão de Fichas
- **Criação do Alias e Exportação**:
  - Criar `function deletePlayer(id) { deletePlayerDirect(id); }`.
  - Exportar no `window`: `window.deletePlayer = deletePlayer;` e `window.deletePlayerDirect = deletePlayerDirect;`.
- **Sincronização Total**:
  - Adicionar `if (typeof syncLocalChangesToFirebase === 'function') syncLocalChangesToFirebase(true);` dentro de `deletePlayerDirect(id)`.
  - Garantir limpeza em cascata: `PLAYERS`, `state.combatants`, tokens do VTT no grid tático e persistência no `localStorage`.

### 3. ✨ Ergonomia Intuitiva para Itens do Inventário
- **Botão de Equipar Claro e Elegante**:
  - Substituir a bolinha vermelha `🔴` por um botão de status intuitivo:
    - **Equipado**: Badge/botão verde-esmeralda com ícone e texto `🛡️ Equipado` ou `⚔️ Equipado` (com brilho sutil).
    - **Não Equipado**: Botão neutro com texto `Equipar` e tooltip explicativo.
- **Filtro Inteligente no Botão `⚡ Usar`**:
  - Ocultar o botão `⚡` para armaduras, escudos e itens que não sejam consumíveis, impedindo que o jogador perca equipamentos por engano.
  - Para consumíveis (poções, rações, pergaminhos, tochas), manter o botão com o ícone contextual (`🧪 Beber`, `📜 Usar`, `🍖 Comer`, etc.).
- **Visualizador Rápido de Itens (`openItemQuickView(playerId, itemIndex)`)**:
  - Ao clicar no balão `💬` do item (ou no nome do item), abrir o modal de detalhes do item.
  - O modal exibirá: Nome, Categoria, Custo, Peso, Dano / CA, e as **Propriedades / O que o item faz** (buscado de `EQUIPMENT_DATA` ou da descrição personalizada `it.desc`).
  - No modal, incluir botões: `Equipar / Desequipar`, `Usar` (se consumível) e `💬 Compartilhar no Chat`.

---

## 🏗️ Módulos e Arquivos Afetados

1. **`src/ui/ui.html`**:
   - Criação da estrutura do modal de visualização rápida de itens (`#modal-item-quick-view`).
   - Adição do botão de compartilhamento no `#modal-spell-quick-view`.
2. **`src/styles/head_css.html`**:
   - Estilização moderna dos novos botões de equipar (`.btn-item-equip-badge.equipped` e `.btn-item-equip-badge.unequipped`).
   - Estilos para o `#modal-item-quick-view` compatíveis com o design system Roll20/D&D 5E.
3. **`src/js/players.js`**:
   - Ajustar o clique do balão de magia para abrir `openSpellQuickView` diretamente.
   - Implementar `deletePlayer(id)` e vinculá-lo à `window.deletePlayer`.
   - Adicionar sincronização do Firebase em `deletePlayerDirect(id)`.
   - Implementar `openItemQuickView(playerId, itemIndex)` e `closeItemQuickView()`.
   - Atualizar a renderização da linha de inventário (`inventory-item-row`) com o novo botão de equipar e balão explicativo.
   - Atualizar `sharePlayerItemToFeed` para incluir a descrição/propriedades completas do item.
   - Exportações atualizadas no final do arquivo.
4. **`test_runner.js`**:
   - Adição da **Bateria 102** testando:
     - Exclusão de ficha via `deletePlayer(id)`.
     - Abertura da descrição de magia e item via balão.
     - Toggle de equipar com novos seletores sem quebrar o cálculo de CA.
     - Proteção contra consumo acidental de armas/armaduras.
5. **`issues/README.md`**:
   - Registro da **ISSUE-134**.

---

## 🧪 Estratégia de Verificação

1. **Compilação**: `node builder.js`.
2. **Suíte Completa**: `node test_runner.js` (todas as baterias aprovadas com 100% de sucesso).
3. **Verificação Visual**: Conferir se o balão abre a descrição, se o botão de lixeira apaga a ficha e se os itens estão intuitivos.

---

## ✅ Status de Execução e Checklist de Entrega

- [x] **Balão de Magia 💬**: Ao clicar no balão, abre diretamente o modal tátil de resumo de magia (`openSpellQuickView`), permitindo ver o que a magia faz, tempo, alcance, duração e componentes D&D 5E, com opção de envio ao chat.
- [x] **Exclusão de Ficha 🗑️**: Criado o alias canônico `deletePlayer(id)` vinculado a `deletePlayerDirect(id)` e exposto em `window`, com limpeza completa em `PLAYERS`, `state.combatants`, tokens VTT, salvamento local e sincronização com o Firebase (`syncLocalChangesToFirebase`).
- [x] **Ergonomia do Inventário**:
  - [x] Bolinha vermelha `🔴` substituída pelo badge intuitivo `.btn-item-equip-badge` (`🛡️ Equipado` em verde esmeralda vs `Equipar` neutro).
  - [x] Proteção contra consumo acidental de armas e armaduras (ocultando o botão de consumir `⚡`).
  - [x] Modal tátil de resumo de item (`#modal-item-quick-view`) aberto pelo balão `💬` ou pelo clique no nome do item, exibindo categoria, peso, dano/CA e propriedades detalhadas do compêndio.
  - [x] Envio enriquecido de magias e itens ao chat feed com descrição completa e feedback tátil por toast.
- [x] **Compilador**: `node builder.js` executado e arquivos `planilha do rpg.html` e `index.html` atualizados.
- [x] **Testes**: Bateria 102 adicionada ao `test_runner.js` com 1807/1807 testes aprovados (100% de sucesso).
- [x] **Documentação**: ISSUE-134 registrada em `issues/README.md`.

