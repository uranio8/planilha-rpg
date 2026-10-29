# Plano de Implementação — ISSUE-166: Localização dos Atributos D&D 5E para Português (FOR, DES, CON, INT, SAB, CAR) com Nomes Completos e Tooltips Intuitivos

## 1. Contexto & Diagnóstico
Atualmente, nos cards de personagens da aba **Fichas** (`renderPlayers()` em `src/js/players.js`), a barra superior de habilidades (`.roll20-abilities-bar`) exibe as siglas em inglês herdadas do D&D original:
- `STR` (Strength)
- `DEX` (Dexterity)
- `CON` (Constitution)
- `INT` (Intelligence)
- `WIS` (Wisdom)
- `CHA` (Charisma)
Além disso, os botões de rolagem utilizam labels e tooltips em inglês como `Save`, `Rolar Teste de STR (+3)` e `Rolar Salvaguarda de STR (+5)`.

Isso causa atrito e dificuldade de compreensão imediata para mestres e jogadores (especialmente iniciantes ou mesas em língua portuguesa), que conhecem os atributos pelas siglas canônicas nacionais da 5ª Edição:
- **FOR** — Força
- **DES** — Destreza
- **CON** — Constituição
- **INT** — Inteligência
- **SAB** — Sabedoria
- **CAR** — Carisma

---

## 2. Objetivos da Implementação

### 2.1 Tradução e Padronização das Siglas e Nomes Canônicos
Substituir as siglas em inglês por siglas e nomes em português nas caixas de atributos (`.roll20-ability-box`) da ficha:
- `str` ➔ Sigla: **FOR** | Nome Completo: **Força**
- `dex` ➔ Sigla: **DES** | Nome Completo: **Destreza**
- `con` ➔ Sigla: **CON** | Nome Completo: **Constituição**
- `int` ➔ Sigla: **INT** | Nome Completo: **Inteligência**
- `wis` ➔ Sigla: **SAB** | Nome Completo: **Sabedoria**
- `cha` ➔ Sigla: **CAR** | Nome Completo: **Carisma**

### 2.2 Clareza Visual e Tooltips Explicativos
- Exibir a sigla canônica em destaque com título/tooltip do nome completo correspondente (ex: `title="Força (FOR)"`).
- Atualizar os chips de rolagem rápida:
  - `Mod` ➔ Rola teste de atributo com tooltip claro: `"Rolar Teste de Força (FOR: +3)"`.
  - `Save` ➔ Atualizado para **`Salva`** (Salvaguarda / Teste de Resistência) com indicação `"Rolar Salvaguarda de Força (FOR: +5) • Proficiente"`.
- Manter total retrocompatibilidade com as chaves internas de dados (`p.str`, `p.dex`, etc.) e funções de rolagem (`rollPlayerAttr`, `rollPlayerSavingThrow`), alterando apenas a camada de apresentação visual.

---

## 3. Arquivos e Módulos Afetados

| Arquivo | Modificação Planejada |
|---|---|
| `src/js/players.js` | Atualizar o mapeamento de habilidades em `renderPlayers()` para `{ key, label: 'FOR'|'DES'|'CON'|'INT'|'SAB'|'CAR', fullName: 'Força'|... }`, tooltips em português e chip `Salva`. |
| `src/styles/head_css.html` | Ajustes visuais finos (se necessário) para a tipografia e espaçamento dos headers de atributos. |
| `test_runner.js` | Adicionar **Bateria 135** validando a presença e renderização das siglas em português (FOR, DES, CON, INT, SAB, CAR), tooltips e o chip `Salva` nos cards de jogadores. |
| `issues/README.md` | Registrar a conclusão da **ISSUE-166**. |

---

## 4. Estratégia de Verificação e Testes
1. Executar `node test_ui_integrity.js` para garantir que os 617 cliques e 11 abas permaneçam 100% íntegros.
2. Executar `node builder.js` para compilar o `planilha do rpg.html` e `index.html`.
3. Executar `node test_runner.js` garantindo que todos os 2.421+ testes aprovem sem regressões.
4. Validar visualmente a clareza e legibilidade dos novos rótulos na interface.
