# 📋 Plano de Implementação - ISSUE-139: Correção de Erros Visuais, Z-Index, Estouro de Tabelas e Layout no Modo Dispositivo Móvel

---

## 🎯 1. Contexto e Diagnóstico dos Problemas Visuais

Após a implementação da suíte mobile anterior, uma inspeção minuciosa dos layouts e das regras `@media` em viewport de smartphone (390px a 412px) identificou 6 problemas visuais específicos que impactam a usabilidade:

1. **Sobreposição de Z-Index nos Modais e Bottom Sheets**:
   - `.modal-overlay` possui `z-index: 2000;`.
   - A dock móvel (`.player-mobile-dock`) tem `z-index: 10000;` e o Thumb HUD (`#mobile-vital-thumb-hud`) tem `z-index: 9999;`.
   - **Problema**: Ao abrir qualquer modal (como o resumo de magias com o balão 💬, detalhes de itens do inventário, rolador de dados ou painel de vida), a barra do rodapé e a pílula de PV continuam flutuando por cima do modal e do overlay escuro, cobrindo os botões do rodapé (`Equipar`, `Fechar`, `Enviar ao Chat`).
   - **Solução**: Elevar `.modal-overlay` para `z-index: 12000 !important;` (acima de dock e hud) e garantir que modais fiquem completamente visíveis e acessíveis em tela cheia no mobile.

2. **Espaçamento e Prevenção de Oclusão no Rodapé da Ficha**:
   - A soma do rodapé móvel (Dock 56px + Thumb HUD 46px) ocupa ~102px na base.
   - **Problema**: O conteúdo final da ficha (último item da mochila ou notas) encosta ou fica parcialmente cortado sob o Thumb HUD.
   - **Solução**: Garantir `padding-bottom: calc(120px + env(safe-area-inset-bottom, 0px)) !important;` em `.roll20-sheet`, no container principal e no `#grid-players`.

3. **Espaço Vazio ("Buraco Preto") na Barra de Atributos e CA (`.roll20-abilities-bar`)**:
   - Em smartphones (larguras ≤ 500px), a regra ativa é `grid-template-columns: repeat(2, 1fr);`.
   - O container possui 7 itens (6 atributos + 1 bloco lateral de CA/Speed).
   - **Problema**: Como 7 é ímpar, os atributos ocupam 3 linhas de 2 colunas e o bloco de CA/Speed ocupa apenas a coluna esquerda da 4ª linha, deixando a coluna direita completamente vazia.
   - **Solução**: Aplicar `@media (max-width: 500px) { .roll20-ac-speed-box { grid-column: 1 / -1; display: flex; flex-direction: row; justify-content: space-around; align-items: center; } }`, expandindo o card de CA e Deslocamento para preencher harmoniosamente a largura total.

4. **Estouro Horizontal na Tabela de Ataques (`.roll20-attacks-table`)**:
   - A tabela possui 5 colunas fixas sem invólucro responsivo.
   - **Problema**: Em telas de 390px, armas com textos e fórmulas longas estouram a largura útil de 358px do card Roll20.
   - **Solução**: Envolver a tabela em um container `.table-responsive-wrap` com `overflow-x: auto; -webkit-overflow-scrolling: touch; width: 100%;` e ajustar espaçamentos de padding em telas móveis.

5. **Aperto e Desalinhamento no Cabeçalho do Portal do Jogador (`.portal-hero-row`)**:
   - **Problema**: Em 390px, o avatar, o nome, o badge de sincronização e os botões `🔼 Upar` e `🔄 Trocar` disputam uma única linha rígida sem quebra.
   - **Solução**: Permitir quebra responsiva suave (`flex-wrap: wrap; gap: 8px;`) para que os botões de ação e status se ajustem em linha dedicada caso o nome do herói seja extenso.

6. **Duplicação de ID no Botão de Modo Foco**:
   - **Problema**: `id="btn-toggle-combat-focus"` existe tanto em `src/ui/ui.html` linha 210 (Mestre) quanto na linha 4365 (Thumb HUD do Aluno).
   - **Solução**: Diferenciar o botão do Thumb HUD para `id="btn-thumb-hud-focus"`.

7. **Aba do Mestre no Mobile (Modo Geral)**:
   - **Problema**: Ao usar a planilha como mestre em smartphones, as 9 abas quebram em várias linhas.
   - **Solução**: Aplicar `overflow-x: auto; flex-wrap: nowrap; -webkit-overflow-scrolling: touch;` na barra `nav#navbar` em `@media (max-width: 768px)`, permitindo navegação touch horizontal limpa.

---

## 🏗️ 2. Módulos Afetados

| Módulo / Arquivo | Modificações Planejadas |
| :--- | :--- |
| **`src/styles/head_css.html`** | 1. Elevar o `z-index` de `.modal-overlay` para `12000` (acima de dock e hud móvel).<br>2. Adicionar `grid-column: 1 / -1;` para `.roll20-ac-speed-box` em telas ≤ 500px com layout horizontal balanceado.<br>3. Adicionar `.table-responsive-wrap` com `overflow-x: auto; -webkit-overflow-scrolling: touch;`.<br>4. Ajustar `.portal-hero-row` para `flex-wrap: wrap; gap: 8px;`.<br>5. Otimizar `nav#navbar` em telas ≤ 768px para rolagem horizontal suave sem quebra excessiva.<br>6. Ajustar padding inferior de segurança na ficha Roll20. |
| **`src/ui/ui.html`** | 1. Renomear o ID duplicado no Thumb HUD para `id="btn-thumb-hud-focus"`. |
| **`src/js/players.js`** | 1. Envolver a tabela de ataques `.roll20-attacks-table` no container `.table-responsive-wrap`.<br>2. Atualizar eventuais referências de ID do botão de foco no Thumb HUD. |
| **`test_runner.js`** | Adicionar a **Bateria 107** validando z-index de modais superior ao HUD, span de 2 colunas do bloco AC/Speed no mobile, container responsivo da tabela de ataques e ausência de IDs duplicados. |
| **`issues/README.md`** | Registrar a documentação completa da **ISSUE-139**. |

---

## 🛡️ 3. Impactos em Persistência, Combate e Sincronização

- **Persistência (`localStorage`)**: Zero impacto. Nenhuma chave do schema é alterada.
- **Sincronização em Nuvem (Firebase)**: Zero impacto. O protocolo de rede e offline queue continuam idênticos.
- **Desktop e Computadores**: As melhorias de CSS são isoladas por media queries (`@media (max-width: 768px)` e `@media (max-width: 500px)`), preservando 100% da integridade visual no desktop.

---

## 📋 4. Lista de Tarefas (Tasks)

- [x] **Task 1**: Atualizar `src/styles/head_css.html` corrigindo o `z-index` dos modais (12000), o span do bloco AC/Speed em 2 colunas, o wrapper de tabela responsivo e o wrap da barra de topo do portal.
- [x] **Task 2**: Ajustar em `src/ui/ui.html` o ID duplicado do botão de foco no Thumb HUD para `btn-thumb-hud-focus`.
- [x] **Task 3**: Atualizar em `src/js/players.js` a renderização da tabela de ataques envolvendo-a em `.table-responsive-wrap`.
- [x] **Task 4**: Compilar com `node builder.js`.
- [x] **Task 5**: Adicionar a **Bateria 107** em `test_runner.js` e validar 100% dos testes verdes (`node test_runner.js`).
- [x] **Task 6**: Registrar a ISSUE-139 em `issues/README.md`.
- [ ] **Task 7**: Executar commits atômicos e push para `origin/main`.
- [ ] **Task 8**: Apresentar resultado detalhado ao usuário.

---

## 🧪 5. Estratégia de Verificação

1. Execução de `node builder.js` para garantir compilação standalone sem erros de sintaxe.
2. Execução de `node test_runner.js` validando a aprovação de todas as baterias anteriores (1878 testes) + novos testes da Bateria 107.
3. Teste em simulação DOM verificando dimensões, classes e integridade em viewport móvel de 390px.
