# 📋 Plano de Implementação - ISSUE-141: Correção de Armaduras/Escudos em Ataques, Desduplicação de Armas e Blindagem de Magias Preparadas do Mago

---

## 🎯 1. Contexto e Diagnóstico dos Problemas

Dois problemas críticos foram reportados pelo usuário:
1. **Armaduras e Escudos aparecendo como armas de ataque e armas duplicadas na tabela "Ações / Ataques & Armas Calculadas"**:
   - Conforme captura de tela, a **Cota de Malha** aparecia com acerto `+7` e dano `CA 16+5 Concussão`, e o **Escudo** com acerto `+7` e dano `+2 CA+5 Concussão`. Além disso, a **Espada Longa** e a **Besta Leve** apareciam duplicadas na lista.
2. **Magias preparadas do Mago sumindo**:
   - O jogador configura as magias preparadas da sessão no grimório, mas elas não salvam ou somem ao atualizar ou ao sincronizar com a nuvem/Mestre, voltando a exibir `0/9` preparadas.

---

### 🔍 Causa-Raiz Técnica

1. **Cota de Malha e Escudo como Armas (`getPlayerCalculatedAttacks`)**:
   - Em `src/js/players.js` (linha 1094), a verificação para itens equipados continha:
     `if (dmgRaw || equipMatch || it.name.includes('espada') ...)`
   - Como a Cota de Malha e o Escudo existem em `EQUIPMENT_DATA`, `equipMatch` era verdadeiro. Como não possuíam dano de arma, a string de defesa (`CA 16`, `+2 CA`) era usada como dado base, somando o modificador de Força (`+5`) e o tipo `Concussão`.
   - Na etapa seguinte (linha 1142), as armas anotadas em `p.attacks` eram adicionadas sem verificar se a mesma arma já havia sido calculada a partir do inventário equipado, gerando duplicatas de Espada Longa e Besta Leve.

2. **Perda/Sumiço das Magias Preparadas do Mago (`preparedSpells` e `spellbookSpells`)**:
   - Em `togglePlayerSpellPrepared` e `saveSpellPickerSelection`, ao alterar as magias preparadas, `p.updatedAt = Date.now()` e `p.updatedBy = localClientId` não eram carimbados diretamente no herói local antes do salvamento.
   - Em `firebase_sync.js` (`applyCloudUpdate`), quando o Mestre publica atualizações (ou quando snapshots chegam com dados onde `remoteP.preparedSpells` está vazio), o merge adotava o snapshot da nuvem como prioritário (`remoteUpdated > localUpdated`), sobrescrevendo o array de magias preparadas do jogador por `[]`.
   - Falta de blindagem de autoridade do jogador: para o herói ativo do aluno (`p.id === activePortalPlayerId`), a seleção de magias preparadas e do grimório do aluno deve prevalecer sobre snapshots remotos vazios do Mestre.

---

## 🛠️ 2. Soluções Planejadas

### Solução 1: Filtro Estrito de Armas e Desduplicação em `getPlayerCalculatedAttacks`
- Em `src/js/players.js`:
  - Ignorar expressamente armaduras, vestimentas e escudos na tabela de ataques (`isArmorItem(it.name)`, categoria `'Armaduras'`, categoria `'Escudos'`, ou itens com `ac`).
  - Exigir que o item seja classificado como arma (`it.category === 'Armas'`, `isWeaponItem(it.name)` ou fórmula de dano válida `/^\d+d\d+/i.test(dmgRaw)`).
  - Na leitura de `p.attacks`, desduplicar armas já adicionadas a partir do inventário equipado, comparando nomes normalizados para impedir que a mesma arma apareça duas vezes.

### Solução 2: Blindagem Definitiva de Magias Preparadas do Mago (`preparedSpells` & Nuvem)
- Em `src/js/players.js`:
  - Em `togglePlayerSpellPrepared(playerId, spellName)` e `saveSpellPickerSelection()`:
    - Carimbar `p.updatedAt = Date.now()` e `p.updatedBy = (typeof localClientId !== 'undefined' ? localClientId : 'local')`.
    - Garantir que `p.spellbookSpells` e `p.preparedSpells` sejam persistidos no `localStorage` e despachados imediatamente para a nuvem via `executeDirectCloudSaveForPlayer`.
- Em `src/js/firebase_sync.js`:
  - No merge de `applyCloudUpdate`:
    - Para o herói ativo (`p.id === activePortalPlayerId`), se o jogador local já possuir magias preparadas (`localChar.preparedSpells && localChar.preparedSpells.length > 0`), nunca sobrescrever por um array remoto vazio (`remoteP.preparedSpells.length === 0`).
    - Mesclar repertório do grimório (`spellbookSpells`) unindo os dois conjuntos sem perdas.

---

## 🏗️ 3. Módulos Afetados

| Módulo / Arquivo | Modificações Planejadas |
| :--- | :--- |
| **`src/js/players.js`** | 1. Filtrar estritamente armas em `getPlayerCalculatedAttacks` (ignorando armaduras e escudos) e desduplicar ataques.<br>2. Carimbar `updatedAt`/`updatedBy` e sincronizar mutações atômicas de magias em `togglePlayerSpellPrepared` e `saveSpellPickerSelection`. |
| **`src/js/firebase_sync.js`** | Proteger `preparedSpells` e `spellbookSpells` contra sobrescrita por snapshots vazios da nuvem no merge do portal do jogador. |
| **`test_runner.js`** | Adicionar a **Bateria 109** validando que Cota de Malha e Escudo não geram ataques, ausência de duplicatas na tabela de combate e persistência/resiliência de `preparedSpells`. |
| **`issues/README.md`** | Registrar a documentação completa da **ISSUE-141**. |

---

## 🛡️ 4. Impactos em Persistência e Outras Telas

- **Cálculo de CA**: Sem impacto. Armaduras e escudos continuam calculando normalmente a CA em `calculatePlayerAcFromEquipment`.
- **Combate e VTT**: Nenhum impacto negativo. Monstros e combatentes continuam com seus ataques intactos.
- **Outras Classes (Clérigo, Druida, Paladino, Bardo)**: Beneficiam-se igualmente da proteção de magias preparadas e da limpeza de ataques.

---

## 📋 5. Lista de Tarefas (Tasks)

- [ ] **Task 1**: Atualizar `getPlayerCalculatedAttacks` em `src/js/players.js` para filtrar estritamente armas e desduplicar ataques.
- [ ] **Task 2**: Blindar persistência e sincronização de `preparedSpells` em `src/js/players.js` e `src/js/firebase_sync.js`.
- [ ] **Task 3**: Executar compilação com `node builder.js`.
- [ ] **Task 4**: Adicionar a **Bateria 109** em `test_runner.js` e rodar a suíte completa garantindo 100% de sucesso.
- [ ] **Task 5**: Documentar a ISSUE-141 em `issues/README.md`.
- [ ] **Task 6**: Git commit semântico e push para `origin/main`.
- [ ] **Task 7**: Apresentar resultado ao usuário.
