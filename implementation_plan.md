# Plano de Implementação — ISSUE-164: Ataques Especiais de Classe e Modificadores de Dano na Tabela de Ataques

## 1. Contexto & Diagnóstico
Atualmente, a tabela **ARMA / ATAQUE** da ficha de personagem calcula apenas:
1. Armas e itens equipados no inventário (`p.inventory`);
2. Ataques textuais declarados manualmente em `p.attacks`.

Habilidades de classe clássicas do D&D 5E que aumentam dano ou concedem ataques especiais (como **Ataque Furtivo / Sneak Attack** do Ladino, **Destruição Divina / Divine Smite** e **Canalizar Divindade / Arma Sagrada** do Paladino, **Dano em Fúria** do Bárbaro, **Golpe Desarmado de Artes Marciais** do Monge, **Arma de Sopro** do Draconato e truques ofensivos como **Rajada Mística**) ficam dispersas apenas na aba de características ou no grimório, exigindo que o jogador role manualmente ou procure as regras durante o turno de combate.

---

## 2. Objetivos da Implementação

Incluir automaticamente na lista calculada de ataques (`getPlayerCalculatedAttacks(p)`) as mecânicas de ataque e dano especial das classes e raças:

### 2.1 Habilidades e Ataques a Implementar:
1. **Ladino (Rogue) — Ataque Furtivo (Sneak Attack)**:
   - **Gatilho**: Personagem com classe Ladino (nível >= 1).
   - **Escala de Dano**: `Math.ceil(level / 2) + 'd6'` (ex.: Nv 1–2: `+1d6`, Nv 3–4: `+2d6`, Nv 5–6: `+3d6` ... até `+10d6` no Nv 19–20).
   - **Dano & Tipo**: `+Xd6` (Igual à arma).
   - **Alcance / Acerto**: `Arma Acuidade/Dist.` | Acerto `—` (Dano Adicional no Acerto).
   - **Ação Rápida**: Botão dedicado de rolagem de dano extra direto para o chat com 1 clique (💥).
   - **Notas**: `1× por turno se tiver Vantagem ou aliado adjacente (1,5m)`.

2. **Paladino (Paladin) — Destruição Divina (Divine Smite)**:
   - **Gatilho**: Personagem com classe Paladino (nível >= 2).
   - **Dano**: `+2d8` Radiante (+1d8 por círculo de espaço de magia acima do 1º, até 5d8; +1d8 vs Mortos-Vivos/Corruptores).
   - **Acerto**: `—` (Ao acertar ataque C.a.C.).
   - **Notas**: `Consome 1 espaço de magia no acerto (+1d8 vs Morto-Vivo/Corruptor)`.
   
3. **Paladino (Paladin) — Canalizar Divindade (Arma Sagrada / Ataque Guiado)**:
   - **Gatilho**: Paladino nível >= 3 (Devoção / Conquista / Vingança).
   - **Bônus de Acerto**: Exibe a opção de bônus mágico de acerto (ex.: `+CAR` no acerto por 1 min com *Arma Sagrada* ou `+10` no acerto com *Ataque Guiado*).

4. **Bárbaro (Barbarian) — Fúria (Rage Damage)**:
   - **Gatilho**: Classe Bárbaro (nível >= 1).
   - **Bônus de Dano**: `+2` (Nv 1–8), `+3` (Nv 9–15), `+4` (Nv 16–20).
   - **Tipo & Notas**: Dano extra da arma para ataques corpo a corpo usando FOR.

5. **Monge (Monk) — Golpe Desarmado (Artes Marciais)**:
   - **Gatilho**: Classe Monge (nível >= 1).
   - **Dado Marcial**: `1d4` (Nv 1–4), `1d6` (Nv 5–10), `1d8` (Nv 11–16), `1d10` (Nv 17–20) + Modificador de Destreza.
   - **Acerto**: Bônus de Proficiência + Des.
   - **Notas**: `Ação Bônus ao atacar com arma de monge ou desarmado`.

6. **Draconato (Dragonborn) — Arma de Sopro**:
   - **Gatilho**: Raça Draconato / Dragonborn.
   - **Dano**: `2d6` (Nv 1–5), `3d6` (Nv 6–10), `4d6` (Nv 11–15), `5d6` (Nv 16–20).
   - **Acerto / Salvaguarda**: `CD 8 + Prof + Mod CON` (DES ou CON).
   - **Notas**: Cone de 4,5m ou Linha de 9m conforme ancestralidade.

7. **Bruxo (Warlock) — Rajada Mística (Eldritch Blast)** *(se conhecida)*:
   - **Gatilho**: Possui o truque `Rajada Mística`.
   - **Dano**: `1d10` de Energia por feixe (1 no Nv 1, 2 no Nv 5, 3 no Nv 11, 4 no Nv 17) + Modificador de Carisma se possuir a Invocação *Rajada Agonizante*.
   - **Alcance**: 36m (ou 90m com Lança Mística).

---

## 3. Experiência Visual e Interações (UI/UX)

- **Badge de Destaque**: Entradas especiais terão um badge visual elegante (`specialBadge`) para diferenciar armas comuns de habilidades/dano extra:
  - `🗡️ Furtivo` (Ladino)
  - `✨ Divino` (Paladino)
  - `💢 Fúria` (Bárbaro)
  - `🥋 Marcial` (Monge)
  - `🔥 Sopro` (Draconato)
  - `⚡ Truque` (Rajada Mística)
- **Botões de Ação Inteligentes**:
  - Para ataques com rolagem de acerto (ex.: Golpe Desarmado, Rajada Mística): botão `🎲 +Acerto` + botão `💥 Dano`.
  - Para bônus/dano puro (ex.: Ataque Furtivo, Destruição Divina, Dano da Fúria): botão com ícone de dados e texto claro `🎲 Rolar Dano Extra`, rolando os dados da habilidade e formatando no chat com os detalhes da regra D&D 5E.
- **Sincronização**:
  - Exportação para PDF Oficial (`fillOfficialDnd5eSheetPdf`) e Impressão A4 (`printPlayerSheet`) continuam exibindo as armas principais no topo e os ataques especiais formatados corretamente.

---

## 4. Arquivos Afetados

| Arquivo | Descrição das Alterações |
|---|---|
| `src/js/players.js` | Expandir `getPlayerCalculatedAttacks(p)` para calcular e anexar as habilidades de classe/raça com flag `isSpecialAttack: true`, fórmulas dinâmicas de acerto e dados escalonados por nível. |
| `src/js/players.js` | Atualizar renderização da tabela `ARMA / ATAQUE` (`renderPlayerCombatAttacksTable` / bloco Roll20) para exibir badges e ações de dano extra. |
| `src/styles/head_css.html` | Estilos para os badges e botões de dano extra de ataques especiais na tabela. |
| `test_runner.js` | Adicionar testes na suíte automatizada (**Bateria 133**) verificando escalonamento de Ataque Furtivo, Destruição Divina, Artes Marciais, etc. |
| `issues/README.md` | Registro formal da ISSUE-164. |

---

## 5. Validação e Testes Automatizados
- Executar `node builder.js`.
- Executar `node test_runner.js`.
- Testar cálculo para:
  1. Ladino Nv 1 (`1d6`), Ladino Nv 5 (`3d6`), Ladino Nv 9 (`5d6`).
  2. Paladino Nv 2 (`2d8` radiante) e Juramento com Canalizar Divindade.
  3. Bárbaro Nv 1 (`+2` dano em Fúria), Monge Nv 1 (`1d4+DES`), Draconato Nv 1 (`2d6`).
  4. Garantir que armas normais continuem sendo computadas sem duplicidade.
