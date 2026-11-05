# Plano de Implementação - VTT Battle Grid Épico com Sincronização Online em Tempo Real (Firebase) [ISSUE-176]

## 1. Contexto e Objetivos

O usuário solicitou um grande overhaul do mapa VTT tático inspirado em **Owlbear Rodeo, Foundry VTT, Roll20 e D&D Beyond**, com o requisito fundamental de que **o VTT seja sincronizado e salvo online via Firebase para que todos os jogadores possam acompanhar o mapa juntos ao mesmo tempo em tempo real**.

Hoje, a planilha possui sincronização em nuvem via Firebase (`firebase_sync.js`) para fichas e combate, porém:
1. O `#tab-grid` fica bloqueado por CSS no portal do jogador (`body.mode-player-portal #tab-grid { display: none !important; }`), impedindo que jogadores vejam o mapa em seus celulares/computadores.
2. O método de persistência do grid (`broadcastGridState()`) apenas disparava `BroadcastChannel` local (mesmo navegador), sem sincronizar ativamente as movimentações do grid para o Firebase em tempo real.
3. Os jogadores não tinham um botão de acesso direto ao mapa de batalha (`🗺️ Mapa VTT`) no portal do jogador.

---

## 2. Pilares de Inovação e Escopo Técnico

### Pilar 0: Sincronização Online em Tempo Real do VTT via Firebase (Jogadores + Mestre)
1. **Disparo Imediato para a Nuvem**:
   - Toda alteração no grid feita pelo Mestre (movimentação de token, névoa de guerra, troca de mapa de fundo, mudança de iluminação ambiente, adição/remoção de tokens) aciona `syncLocalChangesToFirebase(true)` para gravar em tempo real no Firebase Realtime Database (`dnd_rooms/{roomId}/gridState`).
2. **Acesso do Jogador ao Mapa VTT no Portal (`body.mode-player-portal`)**:
   - Inclusão do chip `🗺️ Mapa VTT` no banner de navegação do jogador (`#portal-nav-chips`) e na barra de ferramentas móvel.
   - Liberação do `#tab-grid` para visualização no Portal do Jogador em modo seguro de jogador:
     - Ocultação dos controles restritos do Mestre (ferramentas de desenhar névoa, mudar mapa, apagar fichas).
     - O jogador visualiza o mapa com a **Névoa de Guerra estrita** ativa (áreas não exploradas permanecem escuras).
     - Tokens marcados com `hidden: true` (monstros escondidos em emboscada) permanecem 100% invisíveis para os jogadores.
     - Pings táteis disparados pelo Mestre ou companheiros pulsam na tela do jogador com animação sonora/visual.
3. **Movimentação do Próprio Token pelo Jogador**:
   - O jogador pode selecionar e movimentar o token do seu próprio herói (com snap ao grid), transmitindo a nova posição online instantaneamente para o Mestre e demais jogadores.
4. **Recepção e Renderização em Tempo Real**:
   - Quando novos dados chegam via Firebase (`on('value')`), o `gridState` local é atualizado e o mapa renderizado suavemente com `renderBattleGrid()`, sem travar a navegação.

### Pilar 1: Dock Flutuante de Ferramentas Glassmorphism (`#vtt-floating-dock`)
*(Inspirado no Owlbear Rodeo 2.0 & Foundry VTT)*
- Barra flutuante translúcida com glassmorphism no topo do mapa.
- Ferramentas táteis de 1 clique com atalhos de teclado:
  - 🖱️ **Mover/Selecionar** (`V`)
  - 📏 **Régua Tátil com Snap e Waypoints** (`M` ou `R`) - Medição dupla (Metros & Pés).
  - 🌫️ **Névoa de Guerra Avançada** (`F`) - Pincel, Revelar Sala (Retângulo) e Revelar Círculo.
  - 🎨 **Desenho Tático** (`D`)
  - 💡 **Iluminação de Cena & Shaders** (`L`) - Dia, Ocaso, Noite, Masmorra, Pântano Místico.
  - 🎯 **Ping Tático Rápido** (`P` ou Alt+Clique) - Transmitido online a todos os jogadores conectados.
  - 👁️ **Alternar Visão de Jogador / Mestre** (`J`)
  - 🖼️ **Mapa de Fundo**

### Pilar 2: HUD Contextual de Token Flutuante (`#vtt-token-hud`)
*(Inspirado no Foundry VTT & D&D Beyond)*
Ao selecionar um token, exibe HUD acoplado:
1. **Ajuste Instantâneo de PV**: botões rápidos `[-5]`, `[-1]`, `[+1]`, `[+5]`, barra de vida com gradiente, sincronizado com a ficha (`PLAYERS`) e combate (`COMBAT_STATE`).
2. **Badge de CA (Classe de Armadura)** sempre visível.
3. **Condições D&D 5E em 1 Clique**: seletor com ícones das 15 condições oficiais (Caído, Cego, Agarrado, Invisível, etc.).
4. **Tocha & Emissão de Luz**: alternador de tocha com raio luminoso que perfura a escuridão da cena.
5. **Auras de Alcance / Ameaça**: anéis translúcidos de 1.5m (ameaça corpo a corpo), 3m (alcance) e 9m (deslocamento).
6. **Ocultar Token (GM Stealth)**: botão de olho para esconder monstros dos jogadores no Firebase/VTT.
7. **Atalho de Ficha**: abre a ficha do herói ou ficha de monstro.

### Pilar 3: Movimentação por Teclado e Snap Magnético ao Grid
*(Inspirado no Roll20 & Foundry VTT)*
1. Controle por teclas de direção (**Setas ↑, ↓, ←, →** ou **W, A, S, D**) para o token selecionado.
2. Snap magnético automático ao centro das células do grid.
3. **Rastreador de Deslocamento do Turno (Breadcrumbs)** com exibição em metros percorridos.

### Pilar 4: Névoa de Guerra Avançada: Revelar Sala Retangular & Círculo
*(Inspirado no Owlbear Rodeo)*
- **Revelar Retângulo (Sala Completa)**: arrasta um retângulo para revelar um cômodo ou masmorra inteira com 1 gesto.
- **Revelar Círculo**: desvenda área circular para explosões ou fogueiras.

### Pilar 5: Shaders de Iluminação Atmosférica da Cena
*(Inspirado no Foundry VTT)*
- Presets de ambientação: **☀️ Dia Claro**, **🌇 Ocaso/Pôr do Sol**, **🌙 Noite Fechada**, **🏰 Masmorra Sombria**, **🧪 Pântano Místico**.
- Slider de intensidade da escuridão. Tokens com tocha acesa perfuram a escuridão.

### Pilar 6: Drag & Drop Direto de Imagens de Mapa
*(Inspirado no Owlbear Rodeo)*
- Arraste qualquer imagem do computador diretamente sobre a tela do mapa para carregar o novo mapa de batalha instantaneamente.
- Suporte a colar imagem da área de transferência (`Ctrl + V`).

---

## 3. Arquivos e Módulos Afetados

- `src/ui/ui.html`:
  - Adição do chip `🗺️ Mapa VTT` no banner do jogador (`#portal-nav-chips`).
  - Container `#vtt-floating-dock` e `#vtt-token-hud` no `#tab-grid`.
- `src/styles/head_css.html`:
  - Liberação do `#tab-grid` para jogadores no portal (`body.mode-player-portal #tab-grid`), escondendo apenas a barra de ferramentas administrativa de mestre (`.vtt-dm-only-tool`).
  - Estilos de dock flutuante glassmorphism, Token Action HUD, auras de alcance e shaders de cena.
- `src/js/vtt_grid.js`:
  - Integração com `syncLocalChangesToFirebase(true)` no `broadcastGridState()` e nas ações de movimentação, névoa e tokens.
  - Implementação do Token HUD, movimentação WASD/Setas, névoa retangular/circular, shaders de cena e drag & drop de mapas.
  - Permissão para jogadores movimentarem seus próprios tokens online no portal.
- `src/js/firebase_sync.js`:
  - Garantia de transmissão e recepção em tempo real de `gridState` com atualização fluida sem perda de estado.
- `test_vtt_enhancements.js`:
  - Nova suíte de testes com testes de sincronização online, permissões de tokens de jogadores, névoa e mecânicas VTT.
- `test_runner.js`:
  - Inclusão da Bateria 145.

---

## 4. Estratégia de Verificação e Testes

1. Execução de `node builder.js`.
2. Execução da nova suíte `node test_vtt_enhancements.js`.
3. Execução de `node test_ui_integrity.js`.
4. Execução de `node test_runner.js` garantindo 100% de sucesso nos 2.636+ testes.
5. Verificação da sincronização online e atualização do `issues/README.md`.
