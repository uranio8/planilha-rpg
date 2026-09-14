# 🤖 Diretrizes para Agentes de IA - Planilha RPG

Bem-vindo ao repositório do **Planilha RPG (D&D 5E Assistant & VTT)**. Este documento orienta agentes de IA e desenvolvedores sobre as regras de arquitetura, padrões de engenharia, governança de código, testes automatizados e fluxos de trabalho.

---

## 📌 Regras Fundamentais e Governança

### 1. 📋 Aprovação Prévia de Plano (`implementation_plan.md`)
- **Nenhuma linha de código fonte sob `src/` deve ser alterada antes de criar ou atualizar o Plano de Implementação (`implementation_plan.md`) e receber a aprovação explícita do usuário.**
- O plano deve detalhar:
  - Objetivos da modificação e contexto.
  - Arquivos e módulos afetados (`src/js/*`, `src/styles/*`, `src/ui/*`, `src/data/*`).
  - Possíveis impactos em persistência (`localStorage`), combate ou sincronização.
  - Estratégia de verificação automatizada (`node test_runner.js`) e manual.

### 2. 🚫 Política Estrita de Git (Zero Perda de Código)
- **Comandos Destrutivos Proibidos**: Nunca execute comandos que possam descartar alterações locais ou sobrescrever histórico, tais como:
  - `git reset --hard`
  - `git clean -fd`
  - `git checkout .`
  - `git push --force`
  - `git rebase` (evitar rebase não solicitado).
- **Fluxo Seguro de Git**:
  - Prefira `git pull --no-rebase` para preservar o histórico.
  - Realize commits atômicos com mensagens claras e semânticas.
  - Em caso de conflitos, resolva preservando cuidadosamente ambas as contribuições sem perder dados.

### 3. 🔖 Versionamento Contínuo (SemVer)
- Toda alteração estrutural ou de release deve manter a consistência de versão da aplicação (ex: exibida no cabeçalho/menu e no `src/js/core.js`):
  - **Patch (vX.X.+1)**: Correções de bugs, pequenas correções visuais e melhorias de performance.
  - **Minor (vX.+1.0)**: Novas funcionalidades, novas abas, novos sistemas de regras D&D ou novos recursos no VTT.
  - **Major (v+1.0.0)**: Mudanças arquiteturais profundas, refatoração estrutural de estado ou quebra de compatibilidade no schema do `localStorage`.

---

## 📚 Diretrizes de Engenharia e Padrões

Antes de criar novas funcionalidades, corrigir bugs ou adicionar testes, consulte os guias oficiais:

- 🛠️ [**Padrões de Desenvolvimento** (Features, Bugfixes e Boas Práticas)](guidelines/development_standards.md)
- 🧪 [**Padrões de Testes** (Validação, Integridade e Verificação)](guidelines/testing_standards.md)
- 🔍 [**Diagnóstico e Rastreamento de Problemas** (Bug Tracker e Issues)](guidelines/troubleshooting_standards.md)
- 📋 [**Quadro Geral de Issues e Correções**](issues/README.md)

---

## 🏗️ Visão Geral da Arquitetura e Módulos

O projeto adota uma arquitetura modular organizada dentro da pasta `src/`, compilada em uma única aplicação standalone (`planilha do rpg.html`):

1. **`builder.js`**: Script Node.js responsável por concatenar e gerar o arquivo final `planilha do rpg.html`.
   - **Regra Fundamental**: Toda modificação de código deve ser feita nos arquivos sob `src/` e em seguida o comando `node builder.js` deve ser executado para atualizar a build.
2. **`src/styles/head_css.html`**:
   - **CSS Vanilla Puro**: Uso exclusivo de CSS nativo com variáveis CSS padronizadas (`--bg-primary`, `--accent-gold`, etc.). **Proibido o uso de TailwindCSS ou frameworks CSS externos** sem solicitação explícita.
   - **Estética D&D Premium**: Atmosfera dark/fantasia épica, tipografia consistente (Cinzel/Inter), micro-animações, estados `:hover` e alto contraste para legibilidade em mesa.
3. **`src/ui/ui.html`**: Estrutura HTML das abas (Fichas, Combate, Bestiário, Grimório, Equipamentos, VTT Grid, Frequência, Campanhas, Telão).
4. **Módulos JS (`src/js/*.js`)**:
   - `src/js/core.js`: Inicialização, persistência em `localStorage`, navegação por abas, modal e utilitários.
   - `src/js/combat.js`: Gerenciador de iniciativa, rodadas, despachante de dano/cura, dados D&D, condições e histórico de turnos.
   - `src/js/players.js`: Fichas completas D&D 5E, cálculo de atributos/proficiências, descansos curto/longo, magias preparadas e impressão.
   - `src/js/compendium.js`: Catálogo interativo de monstros, magias, itens e busca no compêndio.
   - `src/js/vtt_grid.js`: Grid tático interativo VTT com drag & drop de tokens, névoa de guerra (fog of war), medição de alcance e iluminação.
   - `src/js/campaigns.js`: Gerenciamento de campanhas, diários de sessão e anotações do mestre.
   - `src/js/screen_sync.js` / `firebase_sync.js`: Sincronização BroadcastChannel / Firebase e visualização no modo telão para jogadores.
5. **Bases de Dados (`src/data/*.js`)**:
   - `src/data/monsters.js`, `src/data/spells.js`, `src/data/equipment.js`.

---

## 🧪 Suíte de Testes Automatizados (`test_runner.js`)

O projeto possui uma suíte de testes automatizados em Node.js para validar a integridade da aplicação sem depender de browser.

### Como Executar os Testes:
```bash
node test_runner.js
```

### O que a Suíte Valida Automaticamente:
1. **Sintaxe e Integridade dos Arquivos**: Verifica se todos os arquivos sob `src/` existem e se a sintaxe JavaScript de cada módulo é 100% válida.
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
2. **Sempre execute o compilador e os testes**: Após modificar qualquer arquivo em `src/*`, execute obrigatoriamente:
   ```bash
   node builder.js
   node test_runner.js
   ```
3. **Mantenha Compatibilidade do `localStorage`**:
   - Chaves oficiais utilizadas:
     - `dnd_tracker_state_v3`
     - `dnd_tracker_players_v3`
     - `dnd_tracker_grid_v3`
     - `dnd_tracker_campaigns_v1`
   - Trate propriedades nulas ou indefinidas defensivamente (ex.: `(p.className || '').toLowerCase()`).
4. **Sincronização Total de Estado**:
   - Toda alteração em PV ou dados de combatentes que representem jogadores (`type === 'player'`) deve refletir na ficha (`PLAYERS`) e disparar `renderPlayers()`.
   - Toda alteração nas fichas deve atualizar o combatente correspondente e disparar `renderCombat()`.
5. **Documente novas melhorias em `issues/README.md`**.

---

## 📋 Protocolo de Validação Pré-Entrega (Checklist)

- [ ] Plano de Implementação aprovado previamente pelo usuário (`implementation_plan.md`).
- [ ] Código implementado nos arquivos fonte modulares `src/*`.
- [ ] Compilação realizada com sucesso (`node builder.js`).
- [ ] Bateria de testes automatizados aprovada com 100% de sucesso (`node test_runner.js`).
- [ ] Verificação visual/comportamental das interfaces e microinterações.
- [ ] Nenhuma perda de código no Git (sem commits destrutivos ou resets forçados).
- [ ] Registro atualizado no [Quadro Geral de Issues](issues/README.md).
