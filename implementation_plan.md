# Plano de Implementação - Sincronização Bidirecional Integral de Armas, Ataques e Inventário (ISSUE-129)

## 📌 Contexto e Diagnóstico

O usuário enviou duas capturas de tela demonstrando que:
1. No modal de edição de personagem (`#modal-player`), a arma **Espada Curta** está adicionada em *ATAQUES & ARMAS EQUIPADAS* com estatísticas calculadas (`Acerto: +3`, `Dano: 1d6+3 perfurante`).
2. Na ficha Roll20, a aba **INVENTÁRIO (0)** está completamente vazia e a tabela de **ATAQUES & ARMAS CALCULADAS** na aba *Ações* exibe apenas `Ataque Desarmado ★`, sem exibir a Espada Curta ou qualquer outra arma equipada.

### Causas Raiz Identificadas no Código:
1. **Checagem errônea de tipo em `getPlayerCalculatedAttacks(p)` (Linha 1084 de `src/js/players.js`)**:
   - O código verificava `if (p.attacks && Array.isArray(p.attacks))`.
   - No entanto, no D&D Tracker e no modal de edição (`savePlayerSheet`), `p.attacks` é armazenado como uma **string** (ex: `"Espada Curta (+3, 1d6+3 perfurante)"`).
   - Por ser string e não array, a condição falhava silenciosamente e todas as armas cadastradas em `p.attacks` eram ignoradas, caindo no fallback que exibe apenas o *Ataque Desarmado*.
2. **Desconexão no `selectWeaponForPlayer(weaponName)` (Linha 3350 de `src/js/players.js`)**:
   - Ao adicionar uma arma pelo botão rápido `⚔️ + Arma` na ficha Roll20, a função apenas concatenava texto na string `p.attacks`, mas **não inseria o item no `p.inventory`**.
   - Como resultado, a arma não entrava na mochila, o contador do inventário continuava em `(0)` e a tabela de ataques não a encontrava como item equipado.
3. **Ausência de Reconciliação no Carregamento e no Toggle**:
   - Se um item do tipo arma está no inventário com `equipped: true`, mas não está em `p.attacks`, ou vice-versa, não havia reconciliação automática para manter ambos 100% espelhados.
   - Ao desequipar uma arma no modal (`removeModalWeapon`), ela não era desequipada no inventário ao salvar.

---

## 🏗️ Proposta de Solução

### 1. Suporte a String e Array em `getPlayerCalculatedAttacks(p)` (`src/js/players.js`)
- Alterar o parser para suportar tanto `p.attacks` como Array quanto como String (tokenizada por `|`, `,` ou quebras de linha).
- Extrair nome da arma, acerto e dano e calcular os modificadores baseados em FOR/DES e PB do herói caso a string não possua valores fixos.

### 2. Sincronização Automática em `selectWeaponForPlayer` e `openWeaponPickerModal` (`src/js/players.js`)
- Ao selecionar uma arma no catálogo pelo botão `⚔️ + Arma`:
  - Se a arma não existir em `p.inventory`, adicioná-la com `{ id: 'item_wpn_' + Date.now(), name: weaponName, category: 'Armas', qty: 1, equipped: true, ... }`.
  - Se já existir no inventário, marcar `equipped: true`.
  - Atualizar `p.attacks` de forma consistente.
  - Sincronizar reativamente e re-renderizar a ficha Roll20 (atualizando `INVENTÁRIO (X)` e a tabela de ataques).

### 3. Reconciliação Bidirecional no `savePlayerSheet()` e `renderPlayers()`
- Ao salvar a ficha pelo modal (`savePlayerSheet`):
  - Armas em `modalEquippedWeapons` são adicionadas ou marcadas como `equipped: true` em `currentInv`.
  - Armas que foram desequipadas no modal são marcadas como `equipped: false` no inventário.
- Função auxiliar `ensurePlayerWeaponsSynced(p)`:
  - Garante que qualquer arma em `p.attacks` tenha seu correspondente em `p.inventory` com `equipped: true`, e vice-versa.

---

## 🧪 Estratégia de Testes e Validação
1. **Compilação**: Executar `node builder.js`.
2. **Bateria de Testes Automatizados**: Criar a **Bateria 96** em `test_runner.js`:
   - Validar que `getPlayerCalculatedAttacks` extrai ataques tanto de `p.inventory` equipado quanto de `p.attacks` em formato string;
   - Validar que adicionar arma pelo modal ou pelo botão `+ Arma` adiciona o item ao `p.inventory` com `equipped: true`;
   - Validar que a contagem do inventário reflete as armas equipadas;
   - Validar que desequipar uma arma atualiza tanto a tabela de ataques quanto o inventário.
3. **Validação Visual e Funcional**: Teste com Chrome Headless verificando que ao equipar a Espada Curta, ela aparece imediatamente na aba de Ações e na aba de Inventário com contagem correta.

---

## 📋 Governança e Status de Execução (AGENTS.md)
- [x] Plano aprovado pelo usuário.
- [x] Código fonte implementado sob `src/js/players.js`.
- [x] Standalone compilado via `node builder.js`.
- [x] Suíte de testes aprovada: **1677/1677 testes passando (100% de sucesso)** com a **Bateria 96**.
- [x] Issue registrada em `issues/README.md` como **ISSUE-129**.
- [x] Status: **Concluído e Validado com Sucesso ✅**.
