# Plano de Implementação - Correção de Sobreposição de Ícones e Varredura Visual (ISSUE-135)

## 1. Contexto e Diagnóstico

O usuário enviou uma captura de tela demonstrando sobreposição de ícones na linha de itens do inventário da ficha (`Espada Longa (Longsword) • 1,5 kgkg`), onde o botão "🛡️ Equipado", os botões de quantidade (`−`, `1x`, `+`), o botão do Baú (`📦 Baú`), o balão de fala (`💬`) e o botão de exclusão (`🗑️`) colidiram visualmente. Além disso, o usuário solicitou uma varredura para identificar e corrigir quaisquer outras funcionalidades com riscos semelhantes de sobreposição de ícones.

### 1.1 Causa-Raiz 1: Sobreposição no Inventário
- No CSS (`src/styles/head_css.html`), a classe `.roll20-item-equipped-toggle` possuía regras legadas de um checkbox redondo minúsculo:
  ```css
  .roll20-item-equipped-toggle {
    width: 14px;
    height: 14px;
    border-radius: 50%;
  }
  ```
- Ao implementar o badge tátil com texto (`🛡️ Equipado` / `Equipar`), a classe combinada herdava essa largura de apenas 14px. O texto (que requer ~75px) extravasava a caixa do botão. Como o container flex posiciona o próximo elemento logo após os 14px da caixa, os botões `−`, `1x` e `+` foram renderizados **diretamente sobre as letras de "Equipado"**.
- Adicionalmente, quando o título do item era longo, a ausência de `flex-shrink: 0` no bloco de ações causava compressão horizontal.

### 1.2 Causa-Raiz 2: Duplicação de Unidade de Peso (`kgkg`)
- Quando `it.weight` já continha a unidade `"kg"` vinda do compêndio (ex: `"1.5 kg"`), a concatenação direta `${it.weight}kg` gerava `"1,5 kgkg"`.

### 1.3 Varredura em Outras Funcionalidades
1. **Ações na Tabela de Ataques (`attack-actions-cell`)**:
   - Os botões `💥` (dano) e `💬` (chat) precisavam de alinhamento flex com `gap: 4px` e `flex-shrink: 0` explícitos para evitar sobreposição em telas estreitas.
2. **Chips de Magia (`player-spell-card-tactile`)**:
   - O título `.spell-chip-name` em flex row necessita de `min-width: 0` com `text-overflow: ellipsis` para que nomes longos de magias não empurrem o balão `💬` e o badge de círculo para fora do card.
3. **Linhas de Itens no Inventário (`inventory-item-row`)**:
   - `.inventory-item-info` deve ter `min-width: 0; flex: 1;` com truncamento elegante (`ellipsis`), e `.inventory-item-actions` deve ter `flex-shrink: 0; display: inline-flex; gap: 4px; align-items: center;` impedindo qualquer quebra ou colisão.

---

## 2. Modificações Propostas

### 2.1 Estilos CSS (`src/styles/head_css.html`)
- Atualizar `.btn-item-equip-badge` e anular qualquer herança restritiva de `width: 14px` ou `height: 14px`:
  ```css
  .btn-item-equip-badge {
    width: auto !important;
    height: auto !important;
    min-width: 68px;
    min-height: 22px;
    max-height: 26px;
    padding: 2px 8px !important;
    border-radius: 4px !important;
    white-space: nowrap;
    flex-shrink: 0;
  }
  ```
- Blindar a classe `.attack-actions-cell`:
  ```css
  .attack-actions-cell {
    display: inline-flex;
    align-items: center;
    justify-content: flex-end;
    gap: 4px;
    flex-shrink: 0;
    white-space: nowrap;
  }
  ```
- Blindar `.spell-chip-name` com `min-width: 0` e `text-overflow: ellipsis`.

### 2.2 Lógica e Renderização das Fichas (`src/js/players.js`)
- Sanitizar formatação de peso com helper dedicado `formatCleanItemWeight(weight)`, removendo unidades duplicadas (`replace(/\s*kg/gi, '').trim() + ' kg'`).
- Garantir que `.inventory-item-actions` utilize `flex-shrink: 0; display: inline-flex; gap: 4px; align-items: center;`.
- Proteger escopo de variáveis auxiliares (ex: `isConsumable`, `cat`, `damageOrAc`).

### 2.3 Compilação e Testes Automatizados
- Compilar via `node builder.js`.
- Adicionar testes em `test_runner.js` validando:
  - Formatação correta de peso (sem `kgkg`).
  - `.btn-item-equip-badge` com largura livre (`width: auto`) e `flex-shrink: 0`.
  - `.attack-actions-cell` com flex container e gap ativo.
  - Ausência de quebra ou sobreposição em itens com nomes longos.
- Executar `node test_runner.js` garantindo 100% de testes aprovados.

---

## 3. Plano de Verificação

1. **Testes Automatizados**: `node test_runner.js` (validando bateria 103 + todas as baterias existentes).
2. **Validação Visual no Navegador**:
   - Abrir a ficha no navegador.
   - Conferir a aba Inventário: verificar o botão `🛡️ Equipado`, botões `−`, `1x`, `+`, `📦 Baú`, `💬`, `🗑️` perfeitamente alinhados e espaçados.
   - Conferir texto de peso: `1,5 kg` sem repetição de `kgkg`.
   - Conferir tabela de ataques e chips de magias em resoluções padrão e mobile.
