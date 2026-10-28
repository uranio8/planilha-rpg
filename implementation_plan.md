# 📋 Plano de Implementação: Restauração e Enriquecimento Completo da Aba "Traços" na Ficha Virtual (ISSUE-154)

## 📌 Contexto & Causa Raiz do Bug
O usuário reportou: *"os traços da ficha sumiram"*. Após diagnóstico aprofundado, identificamos duas causas raízes interligadas na Ficha Virtual (`renderPlayerCardRoll20` em `src/js/players.js`):

1. **Vazamento do Filtro de Economia de Ações do Combate para a Aba "📜 Traços"**:
   - No card Roll20, a variável `actionFilter` recebia `p.actionEconomyFilter || 'all'`.
   - Se o usuário ou mestre clicou nos filtros de combate (ex: `⚔️ Ação`, `⚡ Bônus` ou `🛡️ Reação`) na aba de Ações, o valor ficava gravado no jogador (`p.actionEconomyFilter = 'reaction'`, etc.).
   - Ao navegar para a aba **"📜 Traços"**, a função `renderPlayerUnlockedFeatures(p, actionFilter)` era chamada com esse filtro herdado do combate.
   - Como 95%+ das características de classe são passivas (`actType === 'passive'`), nenhuma característica correspondia ao filtro de ação/reação. O sistema exibia apenas: *"Nenhuma característica de classe com custo de Reação."*, fazendo todas as características, talentos e poderes sumirem da visão do usuário.

2. **Ausência dos Traços Raciais da Espécie na Aba "📜 Traços"**:
   - Apesar do comentário no código indicar `<!-- CARACTERÍSTICAS DE CLASSE E RAÇA -->`, a função `renderPlayerUnlockedFeatures` só iterava sobre as classes (`classesList.forEach`).
   - Os **Traços Raciais canônicos do D&D 5E** (ex: *Visão no Escuro*, *Ancestral Feérico*, *Resiliência dos Anões*, *Fôlego Dracônico*, *Furtividade Natural*, etc. definidos em `src/data/species.js`) não eram renderizados na aba da ficha virtual.

3. **Ausência de "Traços de Personalidade" na Edição e na Aba Sobre**:
   - O campo `p.personality` (*Traços de Personalidade* canônico do D&D 5E) não possuía campo de edição no modal `ui.html` nem exibição na aba 6 ("Sobre & História") do card, aparecendo apenas como fallback na folha de impressão e no PDF.

---

## 🎯 Proposta de Modificações e Módulos Afetados

### 1. `src/js/players.js`
- **Desacoplar o Filtro de Combate da Aba "📜 Traços"**:
  - Na chamada da aba de traços (`roll20-tab-panel` de traits), chamar a renderização sempre com filtro `'all'` para exibir todas as características sem ocultar nada acidentalmente: `${renderPlayerUnlockedFeatures(p, 'all')}` ou com seletor independente interno.
- **Integrar Traços Raciais da Espécie (`species.js`)**:
  - Atualizar `renderPlayerUnlockedFeatures(p, filter)` (ou componente complementar) para renderizar uma seção destacada: **🧬 Traços Raciais: [Nome da Raça]** com todos os traços canônicos da espécie (`sp.traits`), com badges e descrições detalhadas.
- **Integrar Características Customizadas (`p.features`)**:
  - Exibir de forma visualmente limpa as anotações e características personalizadas preenchidas pelo mestre ou jogador.
- **Aba 6 "Sobre & História"**:
  - Adicionar o bloco visual de **🎭 Traço de Personalidade** (`p.personality`) ao lado de Ideal, Vínculo e Defeito.
- **Modal de Edição do Personagem (`openPlayerModal` / `savePlayerModal`)**:
  - Carregar `p.personality` no campo `pm-personality` ao abrir o modal e salvar de volta no objeto `p`.

### 2. `src/ui/ui.html`
- Adicionar o campo `<label>Traço de Personalidade</label><input type="text" id="pm-personality">` na seção de Antecedente & Personalidade do modal de edição de jogador.

### 3. `src/styles/head_css.html`
- Estilizar o bloco de traços raciais e chips visuais dentro da aba "📜 Traços" do card Roll20, mantendo a estética dark fantasy e alta legibilidade.

---

## 🧪 Estratégia de Verificação e Testes Automatizados

1. **Teste Automatizado de Isolamento e Renderização**:
   - Criar teste em `test_runner.js` (Bateria 123) que:
     - Configura um personagem com `actionEconomyFilter = 'reaction'`.
     - Executa a renderização do card Roll20 na aba de traços e valida que todas as habilidades de classe, traços raciais (ex: Visão no Escuro para Elfo/Anão) e talentos são renderizados com sucesso (sem sumir).
     - Valida a persistência e carregamento de `personality` no formulário e no card.
2. **Execução da Suíte Completa**:
   - `node test_runner.js` (garantir aprovação de 100% dos testes existentes).
3. **Compilação**:
   - `node builder.js` para atualizar `planilha do rpg.html`.
4. **Git**:
   - Commit atômico e push seguro sem perda de código.
