# Plano de Implementação - Correção da Sobreposição de Ícones no Inventário, Duplicação de Unidades ('kgkg') e Blindagem de Layout Flexível (ISSUE-135)

## 📌 Contexto e Diagnóstico

O usuário enviou uma captura de tela evidenciando um bug visual no inventário da ficha do personagem:
1. **Sobreposição de Ícones e Botões no Inventário**:
   - Na linha do item (ex: *Espada Longa (Longsword)*), o botão de status de equipamento (`🛡️ Equipado`), os botões de quantidade (`−`, `1x`, `+`), o botão de baú (`📦 Baú`), o balão (`💬`) e a lixeira (`🗑️`) aparecem amassados e colidindo uns por cima dos outros.
   - **Causa Raiz**:
     Em `src/styles/head_css.html` (linhas 10352-10362), a classe `.roll20-item-equipped-toggle` possuía regras legadas:
     ```css
     .roll20-item-equipped-toggle {
       width: 14px;
       height: 14px;
       border-radius: 50%;
       ...
     }
     ```
     Como o botão em `src/js/players.js` combinava as classes:
     `class="btn-item-equip-badge roll20-item-equipped-toggle equipped active"`
     o elemento foi forçado a uma largura fixa de apenas **14px**. O texto `"🛡️ Equipado"` (que necessita de ~80px) extravasou a caixa, e os elementos seguintes no flex container (`−`, `1x`, `+`) foram desenhados a partir da posição de 14px, **sobrepondo diretamente o texto e o ícone do botão de equipar**.

2. **Unidade Duplicada de Peso (`1,5 kgkg`)**:
   - Na mesma captura de tela, o texto exibe `1,5 kgkg`.
   - **Causa Raiz**: Em `src/js/players.js`, a linha de renderização continha:
     `${it.weight ? ' • ' + it.weight + 'kg' : ''}`.
     Quando `it.weight` vindo do compêndio de equipamentos já possui a unidade (ex.: `"1.5 kg"`), a concatenação resultava na unidade duplicada `"1,5 kgkg"`.

---

## 🔍 Varredura de Outras Funcionalidades com Risco de Sobreposição / Colisão

Realizamos uma análise completa no layout das fichas e módulos adjacentes e identificamos 4 pontos adicionais com vulnerabilidade semelhante de sobreposição ou esmagamento:

1. **Ataques & Conjuração na Ficha (`table.roll20-attacks-table td`)**:
   - Os botões de ataque (`💥`) e balão explicativo (`💬`) são renderizados na célula com `display: inline` sem flex container e sem gap explícito. Em colunas estreitas ou telas menores, eles sofrem quebra de linha desordenada ou colidem com o texto do alcance.
   - **Solução**: Envolver as ações da tabela de ataques em um container `.attack-actions-cell` com `display: inline-flex; align-items: center; gap: 4px; flex-shrink: 0;`.

2. **Chips e Cards de Magia (`player-spell-card-tactile`)**:
   - No cabeçalho da magia, o título não possuía `min-width: 0; flex: 1;`. Magias com nomes longos (como *"Proteção contra o Bem e o Mal"* ou *"Restauração Menor"*) empurravam o balão `💬`, a tag do nível da magia e o botão de conjurar para fora do card ou provocavam quebra de linha indesejada.
   - **Solução**: Adicionar `min-width: 0; flex: 1;` com truncamento elegante (`overflow: hidden; text-overflow: ellipsis; white-space: nowrap;`) no título da magia e atribuir `flex-shrink: 0;` a todos os botões de ação adjacentes.

3. **Controles de Quantidade e Ações do Inventário**:
   - A coluna de ações do item no inventário não tinha `flex-shrink: 0;` explícito, permitindo que os botões `−`, `+`, `📦` e `🗑️` fossem espremidos quando o nome do item ou suas propriedades fossem muito extensos.
   - **Solução**: Garantir que a área de ações tenha `flex-shrink: 0; display: inline-flex; gap: 6px; align-items: center;` e a área do nome do item tenha `min-width: 0; flex: 1; overflow: hidden; text-overflow: ellipsis;`.

4. **Barra de Capacidade de Carga (`roll20-encumbrance-bar`)**:
   - Em telas estreitas, o texto da carga e o badge de porcentagem (`2% ✅`) podiam colidir com a barra de progresso.
   - **Solução**: Ajustar o container para `display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;` garantindo respiro em qualquer largura de tela.

---

## 🎯 Proposta de Modificações Detalhada

### 1. `src/styles/head_css.html`
- **Isolar e Corrigir o Botão de Equipar**:
  ```css
  .btn-item-equip-badge {
    width: auto !important;
    min-width: fit-content;
    height: auto !important;
    min-height: 24px;
    padding: 2px 8px !important;
    border-radius: 4px !important;
    font-size: 11px !important;
    font-weight: 700 !important;
    display: inline-flex !important;
    align-items: center;
    gap: 4px;
    flex-shrink: 0 !important;
    white-space: nowrap !important;
  }
  ```
- **Desacoplar `.roll20-item-equipped-toggle`**:
  Garantir que regras legadas de `width: 14px; height: 14px;` não sobrescrevam `.btn-item-equip-badge`.
- **Blindagem de Layout Flexível em Itens e Magias**:
  - Adicionar `.inventory-item-row { display: flex; align-items: center; justify-content: space-between; gap: 10px; width: 100%; }`.
  - Adicionar `.inventory-item-info { flex: 1; min-width: 0; display: flex; align-items: center; gap: 6px; overflow: hidden; }`.
  - Adicionar `.inventory-item-actions { display: inline-flex; align-items: center; gap: 6px; flex-shrink: 0; }`.
  - Adicionar `.attack-actions-cell { display: inline-flex; align-items: center; gap: 4px; flex-shrink: 0; }`.

### 2. `src/js/players.js`
- **Sanitização de Peso**:
  - Utilizar formatação de peso limpa:
    ```javascript
    const cleanWeight = String(it.weight || '').replace(/\s*kg/gi, '').trim();
    const weightDisplay = cleanWeight ? ` • ${cleanWeight} kg` : '';
    ```
    Elimina definitivamente a duplicação `1,5 kgkg`.
- **Estruturação Robusta do HTML do Inventário**:
  - Atualizar o botão de equipar para usar estritamente `.btn-item-equip-badge` e as classes de estado `.equipped` e `.unequipped`.
  - Garantir que o grupo de botões `−`, `1x`, `+` fique agrupado em um container `.item-qty-control` sem invadir a área do botão de equipar.
- **Tabela de Ataques e Magias**:
  - Envolver os botões `💥` e `💬` em `.attack-actions-cell`.
  - Adicionar classes e proteções de `flex-shrink: 0` nos botões de magia.

---

## 🧪 Estratégia de Verificação

1. **Compilação**: `node builder.js`.
2. **Nova Bateria de Testes Automatizados (Bateria 103 em `test_runner.js`)**:
   - Validação da ausência da unidade duplicada `kgkg` em itens com peso formatado.
   - Verificação de que `.btn-item-equip-badge` possui `width: auto` / `min-width` adequado e não herda `14px`.
   - Verificação de estrutura de layout flexível sem sobreposição nas linhas de inventário, ataques e magias.
   - Teste de regressão para garantir que todas as 102 baterias anteriores continuem 100% aprovadas.
3. **Registro**: Registrar a **ISSUE-135** em `issues/README.md`.

---

## ✅ Status de Execução e Checklist de Entrega

- [x] **Diagnóstico da Causa Raiz**: Identificado que `.roll20-item-equipped-toggle` impunha `width: 14px; height: 14px;`, forçando o botão de texto a 14px e fazendo os botões vizinhos colidirem por cima do texto `🛡️ Equipado`.
- [x] **Isolamento de Estilos no CSS (`head_css.html`)**:
  - [x] `.roll20-item-equipped-toggle` desacoplado com seletor `:not(.btn-item-equip-badge)`.
  - [x] `.btn-item-equip-badge` blindado com `width: auto !important`, `min-width: fit-content` e `flex-shrink: 0 !important`.
  - [x] `.attack-actions-cell` e `.inventory-item-actions` criadas com `display: inline-flex` e `flex-shrink: 0`.
  - [x] `.spell-chip-name` atualizado com `min-width: 0; flex: 1; text-overflow: ellipsis;` para evitar empurrão de botões em títulos longos.
  - [x] `.roll20-weight-status-bar` com `flex-wrap: wrap; gap: 6px;`.
- [x] **Eliminação de "kgkg" e Layout no JS (`players.js`)**:
  - [x] Sanitização de peso `cleanWeight` removendo `kg` residual antes da formatação.
  - [x] Criação de `.inventory-item-info` e agrupador visual para os botões de quantidade (`−`, `x`, `+`).
  - [x] Ações da tabela de ataques envolvidas em `.attack-actions-cell`.
- [x] **Compilação**: `node builder.js` executado com sucesso (HTML standalone gerado).
- [x] **Bateria de Testes Automatizados**: Bateria 103 adicionada a `test_runner.js` e aprovada com **1822/1822 testes passando (100% de sucesso)**.
- [x] **Documentação**: ISSUE-135 documentada no Quadro Geral em `issues/README.md`.
