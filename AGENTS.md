# 🤖 Diretrizes para Agentes de IA - Planilha RPG

Bem-vindo ao repositório do **Planilha RPG (D&D 5E Assistant & VTT)**. Este documento orienta agentes de IA e desenvolvedores sobre as regras de arquitetura, padrões de engenharia, testes automatizados e fluxos de trabalho.

---

## 📚 Diretrizes de Engenharia e Padrões

Antes de criar novas funcionalidades, corrigir bugs ou adicionar testes, consulte os guias oficiais:

- 🛠️ [**Padrões de Desenvolvimento** (Features, Bugfixes e Boas Práticas)](guidelines/development_standards.md)
- 🧪 [**Padrões de Testes** (Validação, Integridade e Verificação)](guidelines/testing_standards.md)
- 🔍 [**Diagnóstico e Rastreamento de Problemas** (Bug Tracker e Issues)](guidelines/troubleshooting_standards.md)
- 📋 [**Quadro Geral de Issues e Correções**](issues/README.md)

---

## 🏗️ Visão Geral da Arquitetura

O projeto adota uma arquitetura modular organizada dentro da pasta `src/`, compilada em uma única aplicação standalone (`planilha do rpg.html`):

1. **`builder.js`**: Script Node.js responsável por concatenar e gerar o arquivo final `planilha do rpg.html`.
   - **Regra Fundamental**: Toda modificação de código deve ser feita nos arquivos sob `src/` e em seguida o comando `node builder.js` deve ser executado para atualizar a build.
2. **`src/styles/head_css.html`**: Estilização CSS global, fontes, variáveis de tema e layout responsivo.
3. **`src/ui/ui.html`**: Estrutura HTML das abas (Fichas, Combate, Bestiário, Grimório, Equipamentos, VTT Grid, Frequência, etc.).
4. **Módulos JS (`src/js/*.js`)**:
   - `src/js/core.js`: Inicialização, persistência em `localStorage`, navegação por abas e utilitários.
   - `src/js/combat.js`: Gerenciador de iniciativa, rodadas, despachante de dano/cura, dados D&D e condições.
   - `src/js/players.js`: Gerenciamento de fichas de alunos/jogadores, descansos, impressão e integração com combate.
   - `src/js/compendium.js`: Catálogo de monstros, magias, itens e busca no compêndio.
   - `src/js/vtt_grid.js`: Grid tático interativo VTT com drag & drop de tokens, névoa de guerra e medição.
   - `src/js/screen_sync.js`: Broadcast Channel e modo telão para jogadores.
5. **Bases de Dados (`src/data/*.js`)**:
   - `src/data/monsters.js`, `src/data/spells.js`, `src/data/equipment.js`.

---

## 🧪 Suíte de Testes Automatizados (`test_runner.js`)

O projeto possui uma suíte de testes automatizados completa em Node.js para validar a integridade da aplicação sem depender do navegador.

### Como Executar os Testes:
```bash
node test_runner.js
```

### O que a Suíte Valida Automaticamente:
1. **Sintaxe e Integridade dos Arquivos**: Verifica se todos os arquivos `src_*` existem e se a sintaxe JavaScript de cada módulo é 100% válida.
2. **Compilador Builder**: Executa `builder.js` e valida se o HTML standalone resultante contém todas as seções e funções essenciais.
3. **Mecânicas D&D 5E**:
   - Bônus de Proficiência por nível ($+2$ a $+6$).
   - Modificadores de atributo ($-1$ a $+5$).
   - Entradas de alunos no combate preservando PVs atuais e PVs máximos.
   - Adição de criaturas em lote pelo Bestiário com numeração sequencial e iniciativa individual.
   - Ajustes de dano/cura no combate com sincronização bidirecional nas fichas dos jogadores.
   - Exclusão em cascata (remove da lista `PLAYERS`, limpa o combatente ativo e tokens do VTT).

---

## 🛡️ Regras de Ouro para Agentes de IA

1. **Nunca modifique diretamente o `planilha do rpg.html`**: Qualquer alteração direta nele será sobrescrita na próxima execução do `builder.js`.
2. **Sempre execute o compilador e os testes**: Após modificar qualquer arquivo em `src_*`, rode:
   ```bash
   node builder.js
   node test_runner.js
   ```
3. **Mantenha Compatibilidade do `localStorage`**:
   - Chaves oficiais utilizadas:
     - `dnd_tracker_state_v3`
     - `dnd_tracker_players_v3`
     - `dnd_tracker_grid_v3`
   - Trate propriedades nulas ou indefinidas defensivamente (ex.: `(p.className || '').toLowerCase()`).
4. **Sincronização Total de Estado**:
   - Toda alteração em PV ou dados de combatentes que representem jogadores (`type === 'player'`) deve refletir na ficha (`PLAYERS`) e disparar `renderPlayers()`.
   - Toda alteração nas fichas deve atualizar o combatente correspondente e disparar `renderCombat()`.
5. **Documente novas melhorias em `issues/README.md`**.

---

## 📋 Protocolo de Validação Pré-Entrega (Checklist)

- [ ] Código implementado nos arquivos fonte modulares `src_*`.
- [ ] Compilação realizada com sucesso (`node builder.js`).
- [ ] Bateria de testes automatizados aprovada com 100% de sucesso (`node test_runner.js`).
- [ ] Registro atualizado no [Quadro Geral de Issues](issues/README.md).
