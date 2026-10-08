# 📋 Plano de Implementação: Overhaul de Intuitividade, Responsividade e Ergonomia (Mestre & Jogador)

## 📌 Contexto & Objetivos

Com a estabilização das mecânicas de persistência, 9 círculos de magias, upcasting e sincronização na nuvem (ISSUE-107), o sistema necessita de uma evolução substancial em **intuitividade de uso** e **responsividade tátil**, tanto no uso presencial/celular pelos alunos quanto na gestão ágil de mesa pelo Mestre.

Com base na seleção completa dos 4 pilares estratégicos pelo usuário, este plano estrutura as melhorias em:
1. **Foco Mobile-First no Celular dos Jogadores/Alunos**: Touch targets ampliados (≥ 44-48px), cards táteis de magias com popover informativo e conjuração de 1 toque, barra inferior fixa ergonômica e botoeira de vitalidade fluida.
2. **Painel de Combate do Mestre Ágil & Tático**: Ações com 1 clique para ½ dano (salvaguardas), dano crítico dobrado, popover de condições rápidas e indicador visual de "Próximo a Agir" (*On Deck*).
3. **Design & Estética Dark Fantasy Premium**: Micro-animações cromáticas (impacto vermelho ao sofrer dano, brilho verde ao receber cura, cintilação nas gemas de magia), glassmorphism refinado e toasts contextuais.
4. **Grid Tático VTT Mais Fluido & HUD Retrátil**: Botão para recolher o HUD e gavetas laterais em smartphones/tablets, liberando 100% da área do mapa.

---

## 🏗️ Pilares de Implementação & Detalhamento Técnico

### 📱 Pilar 1: Celular dos Jogadores/Alunos (Mobile-First)
- **Barra de Navegação Inferior Fixa (`#player-mobile-dock`)**:
  - Transformar o dock em uma barra ergonômica de navegação por abas com rolagem suave entre seções da ficha:
    - `❤️ Vida` (scroll imediato para vitalidade e atributos)
    - `✨ Magias` (scroll imediato para slots e grimório)
    - `⚔️ Ataques` (scroll para armas e ações)
    - `🎒 Mochila` (scroll para inventário, moedas e baú coletivo)
    - `🎲 d20` (abre rolador rápido)
  - Touch targets de pelo menos 48px de altura com ícones destacados e labels legíveis.
- **Cards Táteis de Magias & Popover de 1 Toque (`.player-spell-card-tactile`)**:
  - Transformar as magias preparadas e do grimório em cards ergonômicos contendo:
    - Ícone temático da escola/estilo arcano.
    - Badges táteis de economia de ação (`⚡ Bônus`, `⚔️ Ação`, `🛡️ Reação`).
    - Alcance e duração.
    - Botão de 1 toque `[✨ Conjurar]` com feedback imediato.
    - Toque no corpo do card abre um modal/bottom sheet leve (`#modal-spell-quick-view`) exibindo a descrição completa da magia, dano/cura, CD e componentes sem sair da ficha.
- **Botoeira de Vitalidade & PV Ergonômica**:
  - Ampliar botões `+1`, `-1`, `+5`, `-5` e botões de dano rápido com espaçamento confortável para dedos em telas de smartphone (evitando toques acidentais).

---

### ⚔️ Pilar 2: Painel de Combate do Mestre Ágil & Tático
- **Despachante Rápido de Dano no Combate**:
  - Adicionar botão **`½ Dano`** no despachante (`#btn-half-damage`): ao digitar o dano (ex: 28 de uma *Bola de Fogo*), 1 clique divide por 2 arredondando para baixo (14) e aplica nos combatentes que passaram na salvaguarda.
  - Adicionar botão **`💥 Crítico (x2)`** para dobrar rapidamente o dano em acertos críticos.
- **Indicador de "Próximo a Agir" (*On Deck / Next Up*)**:
  - No rastreador de iniciativa, adicionar um badge e destaque visual refinado (`.combatant-on-deck`) no herói ou monstro que agirá no próximo turno, facilitando ao mestre avisar o jogador com antecedência ("*Fulano, você é o próximo!*").
- **Popover de Condições Rápidas de 1 Clique**:
  - Botão direto `[⚡ Condição]` no card do combatente que abre um popover rápido com as condições mais comuns D&D 5E (Caído, Atordoado, Envenenado, Cego, Imobilizado, Agarrado, Invisível) para aplicar ou remover com 1 toque.

---

### 🔮 Pilar 3: Estética Dark Fantasy Premium & Micro-interações
- **Feedback Visual de Vitalidade**:
  - Ao sofrer dano: efeito de impacto carmesim suave (`.damage-pulse`) piscando na barra de vida do card.
  - Ao receber cura: efeito de brilho esmeralda suave (`.heal-pulse`).
- **Gemas de Magia Vivas (`.spell-gem-pip`)**:
  - Estilização em ametista translúcida brilhante (`#a855f7` / `#06b6d4`) com micro-animação de escala ao gastar e restaurar.
- **Glassmorphism e Contraste**:
  - Refinamento das superfícies com `backdrop-filter: blur(12px)` e bordas douradas sutis (`rgba(255, 215, 0, 0.18)`), garantindo alto contraste e leitura sem cansaço visual.

---

### 🗺️ Pilar 4: Grid Tático VTT Mais Fluido & HUD Retrátil
- **Modo Foco Tático / HUD Retrátil (`toggleVttHudCollapse`)**:
  - Adicionar botão flutuante `[👁️ Ocultar Controles / Modo Foco]` na toolbar do VTT que recolhe suavemente as gavetas de combatentes e painéis de configuração.
  - No celular/tablet, o mapa passa a ocupar 100% da viewport útil, com botão discreto para reabrir os controles com 1 toque.
- **Sensibilidade Touch no Canvas**:
  - Ajustar limiares de toque para medição de régua e arraste de tokens, prevenindo saltos bruscos no smartphone.

---

## 📂 Arquivos Afetados

1. [`src/styles/head_css.html`](file:///c:/Users/wesle/.gemini/antigravity-ide/scratch/Planilha%20RPG/src/styles/head_css.html):
   - Estilização da barra fixa mobile com touch targets de 48px e safe area insets.
   - Estilização dos cards táteis de magias (`.player-spell-card-tactile`), bottom sheet e popover de resumo.
   - Classes de micro-interações (`.damage-pulse`, `.heal-pulse`, `.combatant-on-deck`, `.spell-gem-pip.pulse`).
   - Classes de HUD retrátil no VTT (`.vtt-hud-collapsed`).
2. [`src/ui/ui.html`](file:///c:/Users/wesle/.gemini/antigravity-ide/scratch/Planilha%20RPG/src/ui/ui.html):
   - Inclusão dos botões `½ Dano` e `Crítico` na barra do despachante de combate.
   - Scaffolding do Modal/Popover de Resumo Rápido de Magia (`#modal-spell-quick-view`).
   - Botão de colapso de HUD no VTT Grid.
   - Popover de condições rápidas no combate.
3. [`src/js/combat.js`](file:///c:/Users/wesle/.gemini/antigravity-ide/scratch/Planilha%20RPG/src/js/combat.js):
   - Implementação de `applyHalfDamage()` e `applyCriticalDamageMultiplier()`.
   - Lógica do indicador visual de "Próximo a Agir" no `renderCombat()`.
   - Atalho de condições rápidas por combatente (`toggleQuickCondition`).
4. [`src/js/players.js`](file:///c:/Users/wesle/.gemini/antigravity-ide/scratch/Planilha%20RPG/src/js/players.js):
   - Atualização do renderizador de magias para o formato de cards táteis com 1-toque e detalhes via popover (`openSpellQuickView`).
   - Integração das micro-animações de impacto/cura em `adjustPlayerHp()`.
   - Navegação por seções via `#player-mobile-dock`.
5. [`src/js/vtt_grid.js`](file:///c:/Users/wesle/.gemini/antigravity-ide/scratch/Planilha%20RPG/src/js/vtt_grid.js):
   - Implementação de `toggleVttHudCollapse()` com persistência de estado.
6. [`test_runner.js`](file:///c:/Users/wesle/.gemini/antigravity-ide/scratch/Planilha%20RPG/test_runner.js):
   - Criação da **Suíte 76 (ISSUE-108)** cobrindo todas as novas funções, classes CSS compiladas e integridade do builder.

---

## 🧪 Estratégia de Verificação e Testes

1. **Compilação**: Executar `node builder.js` para atualizar `planilha do rpg.html` e `index.html`.
2. **Suíte Automatizada**: Executar `node test_runner.js` validando que 100% dos testes passem (incluindo a nova Suíte 76).
3. **Simulação Live**: Executar `node test_online_live_sync.js` e `node simulate_dm_and_player_live.js` assegurando que todas as novas ações sincronizem perfeitamente entre dispositivos.
4. **Governança**: Registrar a conclusão da ISSUE-108 no [`issues/README.md`](file:///c:/Users/wesle/.gemini/antigravity-ide/scratch/Planilha%20RPG/issues/README.md).
