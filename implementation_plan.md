# Plano de Implementação — ISSUE-168: Overhaul Supremo da Tabela de Ataques e Armas Calculadas (D&D 5E / 2024)

## 1. Contexto & Objetivos

O usuário solicitou um pacote completo de melhorias de alto nível para a tabela **ARMA / ATAQUE** e para o sistema de combate das fichas de personagens, abrangendo 5 pilares estratégicos:

1. **Dano Versátil Interativo (1 Mão vs 2 Mãos)**: Suporte para armas versáteis (*Espada Longa, Machado de Batalha, Martelo de Guerra, Bordão, Lança, Tridente*), exibindo ambos os danos (`1d8+MOD` e `2 Mãos: 1d10+MOD`) e fornecendo botões dedicados de rolagem de dano (`💥 1M` e `💥 2M`).
2. **Mais Habilidades Especiais Ofensivas & Ataque Extra**:
   - *Marca do Caçador (Hunter's Mark)* (`+1d6` dano da arma, Patrulheiro).
   - *Bruxaria (Hex)* (`+1d6` necrótico, Bruxo).
   - *Maldição da Lâmina Maldita (Hexblade's Curse)* (`+PB` ao dano, crítico 19-20).
   - *Golpe Divino (Divine Strike)* (`+1d8` ou `+2d8` dano elemental/radiante, Clérigo Nv 8+).
   - *Indicador de Ataque Extra (Extra Attack)*: Badge no cabeçalho da tabela informando quantos ataques o herói desfere por Ação (ex: `⚔️ 2 Ataques / Ação`).
3. **Rolagens de Ataque com Vantagem / Normal / Desvantagem**: Modos contextuais de rolagem rápida (Normal, Vantagem [2d20 maior] e Desvantagem [2d20 menor]).
4. **Rolagem Conjunta de Ataque + Dano em 1 só Clique (Estilo Roll20 / D&D Beyond)**:
   - Ao rolar o ataque, já calcula e apresenta o acerto e o dano simultaneamente no feed/chat.
   - Em caso de **Acerto Crítico (20 natural)**: dobra automaticamente a quantidade de dados de dano e aciona banner dourado épico.
   - Botão de 1 clique no chat para enviar o dano direto para o despachante de combate.
5. **Controle e Rastreamento de Munição para Armas à Distância**:
   - Detecta flechas, virotes e balas no inventário do personagem.
   - Exibe a contagem de munição restante na linha da arma (ex: `24/96m • 🏹 20 flechas`).
   - Ao disparar, desconta automaticamente 1 projétil e avisa no chat (com alerta se o estoque estiver zerado).

---

## 2. Arquivos e Módulos Afetados

| Arquivo | Modificações Previstas |
|---|---|
| `src/js/players.js` | Suporte a armas versáteis em `getPlayerCalculatedAttacks` e `rollWeaponDamageOnly`, novas habilidades de classe em `getPlayerSpecialClassAttacks`, indicador de Ataque Extra, desconto de munição em inventário e rolagem de ataque com modos (normal, vantagem, desvantagem). |
| `src/js/dice_roller.js` / `src/js/combat.js` | Rolagem conjunta de acerto + dano integrado no chat/feed da mesa, duplicação automática de dados no 20 natural e registro de eventos. |
| `src/styles/head_css.html` | Estilos CSS para botões versáteis (`.btn-versatile-1h`, `.btn-versatile-2h`), badges de munição (`.ammo-chip`), novos badges de habilidades (`.badge-hunter`, `.badge-hex`, `.badge-divine-strike`) e menu popover de vantagem/desvantagem. |
| `src/ui/ui.html` | Inclusão do badge indicador de Ataque Extra e melhorias na estrutura da tabela de ataques. |
| `test_runner.js` | Adição da **Bateria 137** validando: cálculo versátil 1M/2M, novas habilidades ofensivas, ataque extra, desconto de munição e rolagens conjuntas. |
| `issues/README.md` | Documentação oficial da **ISSUE-168**. |

---

## 3. Detalhamento da Implementação

### 3.1 Dano Versátil (1 Mão vs 2 Mãos)
- Se a nota/propriedade da arma contiver `Versátil (1d10)` ou `Versátil (1d8)`:
  - `atk.isVersatile = true`
  - `atk.versatileDice = '1d10'` (ou `'1d8'`)
  - `atk.versatileDamage = '1d10+MOD'`
- Na renderização da tabela:
  - Célula de dano: `<b style="color: #fbbf24;">${atk.damage}</b> <span style="color: #94a3b8;">${atk.damageType}</span> <div class="roll20-versatile-subtext">(2 Mãos: <b style="color: #f59e0b;">${atk.versatileDamage}</b>)</div>`
  - Célula de ações: exibe botões `💥 1M` e `💥 2M`, permitindo rolar qualquer uma das opções instantaneamente.

### 3.2 Expansão das Habilidades Especiais Ofensivas
- **Marca do Caçador**: Patrulheiro Nv 1+ ou herói com a magia `Hunter's Mark` adiciona linha de bônus `+1d6` no acerto.
- **Bruxaria (Hex)**: Bruxo Nv 1+ ou herói com a magia `Hex` adiciona linha de bônus `+1d6` necrótico.
- **Maldição da Lâmina Maldita**: Adiciona `+PB` de dano e margem de crítico expandida.
- **Golpe Divino (Clérigo Nv 8+)**: Adiciona `+1d8` (Nv 8-13) ou `+2d8` (Nv 14+) de dano extra.
- **Cálculo de Ataque Extra**:
  - Função `getPlayerExtraAttacksCount(p)`: retorna 1, 2, 3 ou 4 ataques por Ação.
  - Badge renderizado no topo da tabela: `<span class="extra-attack-badge">⚔️ ${extraAttacks} Ataques / Ação</span>`.

### 3.3 Rolagens Rápidas de Acerto (Normal, Vantagem, Desvantagem)
- Atualização em `rollPlayerAttack(playerId, rawAttackText, rollMode = 'normal')`:
  - `normal`: Rola `1d20 + MOD`.
  - `adv`: Rola `2d20` (destaca o maior resultado) `+ MOD`.
  - `dis`: Rola `2d20` (destaca o menor resultado) `+ MOD`.
- Botão interativo `🎲 +MOD`: clique simples rola normal; clique com botão direito ou clique longo abre seletor rápido com `Normal`, `Vantagem` e `Desvantagem`.

### 3.4 Rolagem Conjunta de Ataque + Dano (Estilo Roll20 / D&D Beyond)
- Quando o jogador clica para rolar o ataque, a mensagem no chat exibe:
  - Resultado da jogada de ataque (ex: `🎲 18 (13 + 5)` vs CA).
  - Dano total calculado da arma (ex: `💥 9 (1d8+5 cortante)`).
  - Se tirar **20 Natural**: exibe `✨ ACERTO CRÍTICO!`, dobra os dados de dano (`2d8+5`) e toca o SFX `'crit'`.
  - Se tirar **1 Natural**: exibe `💀 FALHA CRÍTICA!`.
  - Botão `💥 Aplicar Dano` embutido no feed para transferir direto ao combate.

### 3.5 Controle de Munição para Armas à Distância
- Mapeamento de munições por tipo de arma:
  - Arcos (Arco Curto, Arco Longo) ➔ `Flechas` / `Arrows`
  - Bestas (Besta Leve, Besta Pesada, Besta de Mão) ➔ `Virotes` / `Crossbow Bolts`
  - Fundas ➔ `Balas de Funda` / `Sling Bullets`
  - Zarabatanas ➔ `Agulhas de Zarabatana`
- Quando o herói ataca com a arma:
  - Localiza o item no inventário `p.inventory`.
  - Se quantidade > 0: desconta 1, salva em `localStorage`, sincroniza e notifica `(Munição restante: X)`.
  - Se quantidade == 0: emite aviso `⚠️ Sem munição no inventário!` sem impedir a rolagem.

---

## 4. Estratégia de Verificação e Testes

1. **Testes Unitários Automatizados (`test_runner.js`)**:
   - Adicionar **Bateria 137**:
     - Arma versátil calcula dano de 1 mão e 2 mãos corretamente.
     - Patrulheiro Nv 1+ calcula Marca do Caçador com `+1d6`.
     - Clérigo Nv 8+ calcula Golpe Divino com `+1d8` e Nv 14+ com `+2d8`.
     - Ataque Extra computa 2 ataques para Guerreiro Nv 5, 3 ataques no Nv 11 e 4 no Nv 20.
     - Rolagem de ataque com vantagem rola 2d20 e adota o maior.
     - Rolagem de ataque com desvantagem rola 2d20 e adota o menor.
     - Disparo com arco consome 1 flecha do inventário.
2. **Auditoria de UI (`node test_ui_integrity.js`)**:
   - Garantir 100% de integridade nos 617+ cliques e 11 abas.
3. **Compilação (`node builder.js`)**:
   - Gerar `planilha do rpg.html` e `index.html` standalone sem erros.
4. **Governança de Git**:
   - Commit atômico e push seguro sem comandos destrutivos.
