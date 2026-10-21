# 📋 Plano de Implementação: Overhaul da Ficha de Personagem no Estilo Roll20 (D&D 5E 2024 Sheet)

## 📌 Contexto & Objetivos

Com base no layout oficial do **Roll20 (D&D 5E 2024 Sheet)** compartilhado pelo usuário, este plano estrutura a modernização integral da visualização da ficha do jogador (`src/js/players.js` e `src/styles/head_css.html`).

O objetivo é transformar a ficha em uma experiência intuitiva, altamente organizada, responsiva e reativa, onde:
1. **Atributos & Salvaguardas (*Abilities*)** são apresentados unificados lado a lado com Modificador e Salvaguarda (com destaque de proficiência).
2. **Hero Header & Vitalidade Imediata**: Bloco do herói com avatar e nível, inspiração e botão de iniciativa destacado; card de PV no estilo Roll20 com display grande, stepper numérico para dano/cura rápida, Dados de Vida (`Hit Dice`) e descansos.
3. **Layout em 3 Colunas com Abas Centrais**:
   - **Coluna 1 (Perícias & Proficiências)**: Tabela vertical limpa das 18 perícias com atributo base, bônus calculado e indicador visual de proficiência/expertise; tags de ferramentas, armas, armaduras e idiomas.
   - **Coluna 2 (Coração da Ficha por Abas)**:
     - `[ COMBATE ]`: Tabela de ataques (Arma, Alcance, Acerto, Dano) com automação de itens equipados + seções organizadas por economia de ações D&D (**Ações**, **Ações Bônus**, **Reações**, **Ações Livres**).
     - `[ MAGIAS ]`: Slots de magia, matriz de círculos, magias conhecidas/preparadas e grimório.
     - `[ INVENTÁRIO ]`: Moedas completas (PC, PP, PE, PO, PL), cálculo em tempo real de peso total vs Capacidade de Carga ($\text{FOR} \times 7{,}5\text{ kg}$) com status de Carga (*Desimpedido / Sobrecarregado*), e lista de itens com toggle `[Equipado]` e stepper `[ - ] Qtd [ + ]`.
     - `[ CARACTERÍSTICAS & TRAÇOS ]`: Lista expansível de habilidades de classe, raça e talentos com botão de balãozinho de fala `💬` para enviar para o log/feed da mesa e badges de ação bônus/reação.
     - `[ NOTAS & SOBRE ]`: Bloco de notas privado, histórico de ações e biografia.
   - **Coluna 3 (Defesas & Sentidos Passivos)**: CA e Deslocamento, Defesas (Resistências, Vulnerabilidades, Imunidades), Condições ativas e Sentidos Passivos (Percepção, Investigação e Intuição passivas).
4. **Automação Reativa de Equipamentos**: Equipar armas na aba de inventário gera/atualiza a linha correspondente na tabela de ataques de combate calculando o acerto (FOR/DES + proficiência) e o dano base + mod.
5. **Zero Perda de Dados & Compatibilidade Total**: Manter 100% dos dados existentes no `localStorage`, sincronização em tempo real Firebase RTDB e suíte de testes automatizados.

---

## 🏗️ Módulos Afetados & Detalhamento Técnico

### 1. `src/styles/head_css.html` (Design System Roll20 Dark Fantasy)
- Estilização do grid de 3 colunas da ficha (`.roll20-sheet-container`):
  - Desktop (≥ 1080px): Layout panorâmico em 3 colunas harmoniosas (Coluna 1: ~240px, Coluna 2: 1fr flexível, Coluna 3: ~240px).
  - Tablet (768px - 1079px): Layout adaptativo de 2 colunas com abas centrais e gaveta de apoio.
  - Mobile (≤ 767px): Coluna única empilhada com navegação via dock rápido e abas fluidas sem rolagem horizontal.
- Estilos dos cards Roll20:
  - `.roll20-hero-header`: Card de perfil com badge de nível no avatar, classe, raça, XP e botão chamativo de iniciativa.
  - `.roll20-hp-card`: Display de PV `Current / Max` com barra dinâmica, PV Temporário, stepper de dano/cura e bloco de Dados de Vida (`Hit Dice`).
  - `.roll20-abilities-row`: Grade de 6 colunas para atributos com valor base no topo e sub-cards lado a lado para `Mod` e `Save`.
  - `.roll20-skills-table`: Tabela vertical de perícias com bolinha indicadora de proficiência/expertise.
  - `.roll20-attacks-table`: Tabela de ataques com colunas Arma, Alcance, Acerto e Dano.
  - `.roll20-inventory-row`: Lista de itens com toggle de equipado, peso e stepper de quantidade.
  - `.roll20-action-section`: Seções de combate agrupadas por Ações, Ações Bônus e Reações.

### 2. `src/js/players.js` (Lógica de Renderização e Automação de Ataques)
- Atualização da função `renderPlayers()` para adotar a nova estrutura HTML/CSS Roll20.
- Implementação de `getPlayerCalculatedAttacks(p)`:
  - Varre o inventário do herói (`p.inventory`); para cada arma equipada (`item.equipped === true`), calcula automaticamente o bônus de acerto com base em proficiência + atributo chave (FOR, DES, ou o maior entre FOR/DES se tiver propriedade *Finesse/Acuidade*) e fórmula de dano.
  - Faz merge inteligente com armas personalizadas já cadastradas pelo usuário em `p.attacks`.
- Implementação de `togglePlayerItemEquipped(playerId, itemIndex)`:
  - Alterna o status de equipado de um item do inventário.
  - Se for arma: atualiza a lista de ataques ativos da aba Combate.
  - Se for armadura ou escudo: recalcula a CA automaticamente (`calculatePlayerAcFromEquipment`).
  - Salva no `localStorage`, sincroniza com combate e nuvem.
- Implementação de `sharePlayerTraitToFeed(playerId, traitName, traitDesc, category)`:
  - Botão de balão de fala `💬` que envia o traço formatado com destaque visual diretamente para o log de combate (`addLog`), feed de ações e sincronização com o telão/mestre.
- Gestão de Carga em tempo real:
  - Exibição do peso somado dos itens vs limite D&D 5E com badge de status (*Desimpedido* / *Sobrecarregado*).

### 3. Preservação de Compatibilidade
- A estrutura de dados de `p` no `localStorage` e Firebase permanece 100% preservada.
- Todos os seletores de classe, roladores de dados 3D, descansos curtos/longos, magias preparadas e portal do jogador continuam plenamente operacionais.

---

## 🧪 Estratégia de Verificação e Testes

1. **Compilação**:
   - `node builder.js` para compilar o HTML standalone sem erros de sintaxe ou referências quebradas.
2. **Suíte de Testes Automatizados**:
   - `node test_runner.js`: validação de que todos os 1314 testes existentes continuam passando com 100% de sucesso.
   - Adição de novos testes automatizados na Suíte 79 cobrindo:
     - Renderização da barra de atributos com Mod e Save unificados.
     - Automação de armas equipadas refletindo em ataques calculados.
     - Toggle de item equipado recalculando CA e peso.
     - Existência das abas Roll20 (Combate, Magias, Inventário, Características, Notas, Sobre).
3. **Verificação Manual e Responsiva**:
   - Teste nos breakpoints Desktop (> 1080px), Tablet (768px a 1024px) e Mobile (390px a 600px).
