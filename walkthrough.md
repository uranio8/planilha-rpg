# Walkthrough - Implementação de Subclasses Mágicas (Trapaceiro Arcano e Cavaleiro Místico - ISSUE-84)

Implementação do suporte completo para subclasses arcanas e terço-conjuradores (1/3 Casters) de D&D 5E: **Trapaceiro Arcano (Ladino)** e **Cavaleiro Místico (Guerreiro)**.

---

## 🎯 Problema Resolvido
O usuário reportou que ao jogar com o **Trapaceiro Arcano do Ladino**, a ficha não indicava quantas magias ele podia ter nem calculava seus espaços de magia (*spell slots*), exibindo "Sem conjuração de classe".

### 🔍 Causa Raiz
1. `getMaxPreparedSpells(p)` avaliava apenas `p.className` (que continha `"Ladino"` ou `"Guerreiro"`). Sem inspecionar a subclasse (`p.subclassIdx === 2` ou `p.subclass`), retornava `type: 'none'`.
2. `calculateSpellSlots(className, level)` não recebia a subclasse e não possuía a progressão de terço-conjuradores (1/3 casters), gerando `[0, 0, 0, 0, 0]`.
3. O seletor de magias (`getCompatibleClassKey`) não mapeava Trapaceiro Arcano e Cavaleiro Místico para a lista de **Mago (Wizard)**.

---

## 🛠️ Alterações Realizadas

### 1. Detecção Precisa de Subclasses Mágicas
- Criada a função `isMagicalSubclass(className, subclassIdx, subclassName)` em [`src/js/players.js`](file:///c:/Users/wesle/.gemini/antigravity-ide/scratch/Planilha%20RPG/src/js/players.js):
  - Ladino com `subclassIdx === 2` ou subclasse contendo "Trapaceiro", "Arcano" ou "Trickster".
  - Guerreiro com `subclassIdx === 2` ou subclasse contendo "Cavaleiro Místico", "Eldritch Knight" ou "Arcano".
  - Suporte a classes compostas como "Ladino (Trapaceiro Arcano)".

### 2. Tabela Oficial de Espaços de Magia (D&D 5E 1/3 Casters)
- Atualizada `calculateSpellSlots(className, level, subclassIdx)`:
  - **Níveis 1-2**: `[0, 0, 0, 0, 0]` (sem conjuração até o 3º nível)
  - **Nível 3**: `[2, 0, 0, 0, 0]` (2 espaços de 1º círculo)
  - **Níveis 4-6**: `[3, 0, 0, 0, 0]`
  - **Níveis 7-9**: `[4, 2, 0, 0, 0]` (libera 2º círculo)
  - **Níveis 10-12**: `[4, 3, 0, 0, 0]`
  - **Níveis 13-15**: `[4, 3, 2, 0, 0]` (libera 3º círculo)
  - **Níveis 16-18**: `[4, 3, 3, 0, 0]`
  - **Níveis 19-20**: `[4, 3, 3, 1, 0]` (libera 4º círculo)

### 3. Magias Conhecidas e Truques
- Em `getMaxPreparedSpells(p)`:
  - Retorna `type: 'known'` e `isKnownCaster: true`.
  - Integrado a `DND5E_KNOWN_SPELLS_TABLE`: 3 a 13 magias conhecidas.
  - Integrado a `DND5E_CANTRIPS_KNOWN_TABLE`: 3 a 4 truques (Trapaceiro Arcano) e 2 a 3 truques (Cavaleiro Místico).
  - Atributo chave de conjuração: `INT` (Inteligência).

### 4. Estatísticas de Conjuração
- Em `getPlayerSpellcastingStats(p)`:
  - CD de Resistência de Magia: $8 + \text{Proficiência} + \text{Modificador de INT}$.
  - Bônus de Ataque Mágico: $+\text{Proficiência} + \text{Modificador de INT}$.

### 5. Seletor de Magias e Filtro do Grimório
- Em `getCompatibleClassKey(className, subclassIdx, subclassName)`:
  - Redireciona automaticamente para **Mago**, permitindo que o Trapaceiro Arcano e o Cavaleiro Místico escolham magias da lista de Mago.

### 6. Modal de Ficha e Assistente de Level Up
- `openPlayerModal(id)` e `onPlayerModalClassOrLevelChange(preserveSlotsIfSet)`:
  - Preserva e inicializa `subclassSel.dataset.pendingSubIdx` para selecionar a subclasse correta do herói.
  - Recalcula e preenche os espaços de magia automaticamente ao escolher a subclasse mágica.
- `savePlayerSheet()`:
  - Grava `subclassIdx` e `subclass` (`Trapaceiro Arcano (Arcane Trickster)`).
  - Auto-calcula espaços de magia se a tela estiver zerada.
- `calculateMulticlassSpellSlots(player)`:
  - Trata classe única pura preservando a tabela de terço-conjurador.
  - Para multiclasse com múltiplos conjuradores, soma $\lfloor \text{nível}/3 \rfloor$ ao nível de conjurador efetivo.
- `applyLevelUpConfirm()`:
  - Atualiza `p.subclassIdx` e `p.subclass` no nível raiz do herói quando a classe principal sobe de nível.

---

## 🧪 Validação Automatizada (`test_runner.js`)
Adicionada a **SUÍTE 57** cobrindo:
1. Identificação de subclasses mágicas (`isMagicalSubclass`).
2. Cálculo de espaços de magia de nível 1 a 20 para Trapaceiro Arcano e Cavaleiro Místico.
3. Quantidade de magias conhecidas, truques e atributo INT via `getMaxPreparedSpells`.
4. CD e bônus de ataque mágico via `getPlayerSpellcastingStats`.
5. Compatibilidade no catálogo de magias via `getCompatibleClassKey`.
6. Assistente de Level Up (`applyLevelUpConfirm`) evoluindo Ladino Nv 2 para Nv 3 Trapaceiro Arcano com `[2, 0, 0, 0, 0]` espaços gerados automaticamente.

### Resultado:
```bash
node test_runner.js
📊 RESULTADO DOS TESTES: 845/845 passaram
🎉 TODOS OS TESTES PASSARAM COM SUCESSO! 🚀
```
