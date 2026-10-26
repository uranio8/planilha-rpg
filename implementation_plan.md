# Plano de Implementação: Omnisearch Universal, Economia de Ações, Mini-Ações de Monstros e Token Action HUD (ISSUE-145)

## 📌 Contexto e Objetivos

Com base na pesquisa de melhores práticas em VTTs modernos (**Foundry VTT**, **Owlbear Rodeo**, **D&D Beyond** e **Alchemy RPG**), implementaremos 4 funcionalidades fundamentais de usabilidade e agilidade tática:

1. **Spotlight Omnisearch Universal (`Ctrl + K` / `Cmd + K`)**: Busca global rápida para encontrar qualquer monstro, magia, item, ficha ou condição instantaneamente.
2. **Aba Tática de Economia de Ações D&D 5E na Ficha**: Organização inteligente do repertório do herói em **Ação Padrão**, **Ação Bônus**, **Reação** e **Ações Universais**, eliminando a indecisão nos turnos.
3. **Mini-Ações dos Monstros Direto na Lista de Combate**: Ações e ataques rápidos dos monstros visíveis e roláveis com 1 clique diretamente na Ordem de Iniciativa, sem necessidade de navegar até o Bestiário.
4. **Token Action HUD no Grid VTT**: Menu flutuante de ações táteis que surge ao selecionar qualquer token no tabuleiro do VTT (ataque rápido, ajuste de vida, condição, CA e visualização de ficha).

---

## 🏗️ Arquitetura Detalhada por Módulo

### 1. 🔍 Spotlight Omnisearch Universal (`Ctrl + K` / `Cmd + K`)
- **Arquivos**: `src/ui/ui.html`, `src/styles/head_css.html`, `src/js/core.js`.
- **Interface**:
  - Modal `#modal-omnisearch` em estilo glassmorphism moderno com backdrop blur.
  - Input `#omnisearch-input` com foco automático, ícone de lupa e contador de resultados.
  - Lista `#omnisearch-results` com suporte a navegação por teclado (`ArrowDown`, `ArrowUp`, `Enter`, `Escape`).
  - Badges cromáticas por categoria:
    - 🧙‍♂️ **Ficha**: Navega para a ficha do herói (`openPlayerSheetModal` / foca ficha).
    - 🐉 **Monstro**: Abre modal do monstro (`openMonsterModal`).
    - ✨ **Magia**: Abre resumo tátil da magia (`openSpellQuickView`).
    - 🛡️ **Equipamento**: Abre resumo tátil do item (`openItemQuickView`).
    - 📜 **Condição**: Abre modal explicativo de regras de condição (`openConditionInfoModal`).
- **Disparadores**:
  - Atalhos globais `Ctrl+K`, `Cmd+K` e `/` (quando o foco não estiver em inputs de texto).
  - Botão de busca rápida no cabeçalho principal da aplicação (desktop e mobile).

---

### 2. ⚔️ Aba Tática de Economia de Ações na Ficha (Ação, Bônus, Reação)
- **Arquivos**: `src/ui/ui.html`, `src/styles/head_css.html`, `src/js/players.js`.
- **Classificação Dinâmica**:
  - **🟢 Ação Padrão**:
    - Ataques físicos e armas equipadas (`p.attacks` e itens equipados).
    - Magias com tempo de conjuração de `"1 ação"`.
    - Ações Básicas Universais da 5E: *Atacar*, *Conjurar Magia*, *Esquivar* (desvantagem em ataques contra você), *Desengajar* (sem ataques de oportunidade), *Disparada* (dobra deslocamento), *Ajudar* (concede vantagem), *Esconder-se* (teste de Furtividade), *Procurar* (Percepção/Investigação), *Usar Objeto*.
  - **🟡 Ação Bônus**:
    - Magias preparadas com tempo `"1 ação bônus"` (ex: *Passo Nebuloso*, *Palavra de Cura*, *Raio de Bruxa*, *Santuário*, etc.).
    - Habilidades de classe (ex: *Retomar o Fôlego* do Guerreiro, *Fúria* do Bárbaro, *Ação Astuta* do Ladino, *Inspiração de Bardo*).
    - Ataque com arma na mão secundária (combate com duas armas).
  - **🔴 Reação**:
    - Magias preparadas com tempo `"1 reação"` (ex: *Escudo Arcano*, *Absorver Elementos*, *Contra-Feitiço*, *Queda Suave*, *Repreensão Infernal*).
    - Ação universal: *Ataque de Oportunidade*.
  - **⚪ Ação Livre / Interação**:
    - Interações de cenário: sacar/guardar 1 arma, abrir/fechar porta, largar objeto sem custo.
- **Integração na Ficha**:
  - Sub-aba dedicada `"⚡ Ações"` na visualização Roll20 e Portal do Jogador.
  - Cada card tático possui botões de 1 clique para rolar o ataque, conjurar a magia ou registrar no chat de combate.

---

### 3. 🐉 Mini-Ações dos Monstros Direto na Fila de Iniciativa
- **Arquivos**: `src/styles/head_css.html`, `src/js/combat.js`.
- **Funcionamento**:
  - Ao renderizar combatentes do tipo `'monster'` em `renderCombat()`, localiza as ações em `c.actions` ou consulta o bestiário (`MONSTERS_DATA`) correspondente.
  - Adiciona uma mini-barra retrátil ou expansor `.combatant-monster-actions` na linha do combatente.
  - Gera chips de ação clicáveis `.mini-monster-action-chip` (ex: `🗡️ Cimitarra +4 (1d6+2)`, `🏹 Arco Curto +4 (1d6+2)`).
  - O clique no chip executa a rolagem instantânea com parsing da fórmula, computa acertos críticos, envia ao log de combate com SFX e preenche o despachante de dano.

---

### 4. 🕹️ Token Action HUD no Grid VTT
- **Arquivos**: `src/ui/ui.html`, `src/styles/head_css.html`, `src/js/vtt_grid.js`.
- **Funcionamento**:
  - Elemento flutuante `#vtt-token-action-hud` posicionado dinamicamente sobre o token selecionado (`selectedTokenId` no tabuleiro).
  - Botões rápidos com micro-animação e feedback visual:
    - 💥 **Ataque Rápido**: Rola a arma principal ou ação prioritária do token.
    - 🩸 **Dano (-)** e 💚 **Cura (+)**: Steppers rápidos para alterar PV com 1 toque.
    - 🛡️ **CA**: Badge com a Classe de Armadura atual.
    - ⚡ **Condição**: Abre menu contextual de condições táticas.
    - 📜 **Ficha**: Abre a ficha do personagem ou modal do monstro correspondente.
  - Suporta gestos de toque no mobile e clique no desktop, fechando com clique fora ou desseleção.

---

## 📁 Arquivos Afetados

| Arquivo | Modificações Planejadas |
|---|---|
| `src/ui/ui.html` | Estrutura do modal `#modal-omnisearch` e template do `#vtt-token-action-hud`. |
| `src/styles/head_css.html` | Estilos para Omnisearch, abas de Economia de Ações, chips de ações de monstros no combate e HUD de tokens no VTT. |
| `src/js/core.js` | Listener global de teclado (`Ctrl+K`), mecanismo de busca indexada e navegação por teclado. |
| `src/js/players.js` | Agrupamento tático de economia de ações (Ação, Bônus, Reação) e renderização nas fichas. |
| `src/js/combat.js` | Renderização e rolagem das mini-ações de monstros direto na Ordem de Iniciativa. |
| `src/js/vtt_grid.js` | Integração do Token Action HUD ao selecionar tokens no tabuleiro. |
| `test_runner.js` | Inclusão da **Bateria 114** para testar as 4 novas funcionalidades. |
| `issues/README.md` | Registro formal da **ISSUE-145**. |

---

## 🛡️ Riscos, Compatibilidade e Mitigações

1. **Prevenção de Colisões de Atalhos**:
   - `Ctrl+K` não deve interferir quando o usuário estiver digitando em campos de anotação de texto extenso; verificação de `target.matches('input, textarea')` quando for tecla sem modificador.
2. **Performance do Omnisearch**:
   - Indexação leve dos nomes de monstros, magias e itens em memória para resultados instantâneos (< 10ms).
3. **Preservação de Layout e Responsividade**:
   - Garantir `flex-shrink: 0`, `min-width: 0` e ausência de sobreposição visual nos novos chips e no HUD do VTT.
4. **100% de Testes Verdes**:
   - Manter os 1987 testes existentes passando com sucesso antes de integrar novos testes.

---

## ✅ Estratégia de Validação

1. **Compilação**: Executar `node builder.js`.
2. **Testes Automatizados**: Criar e rodar a **Bateria 114** em `test_runner.js`.
3. **Simulador Multi-Agente**: Executar `node test_playtest_simulator.js` para assegurar integridade no fluxo de combate e auditoria de layout.
4. **Verificação no Navegador**: Testar o acionamento de `Ctrl+K`, o Token Action HUD no VTT, as mini-ações no combate e a aba tática na ficha.
