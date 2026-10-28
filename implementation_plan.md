# 📋 Plano de Implementação: Overhaul de Navegação da Planilha e Visualização Avançada de Traços e Magias (ISSUE-157)

## 📌 Contexto & Objetivos

A usabilidade da Central do Mestre e Fichas dos Personagens depende criticamente da facilidade de navegação entre heróis e da clareza visual com que regras, magias e características são apresentadas em mesa de jogo.

A solicitação do usuário visa aprimorar dois pilares essenciais:
1. **Navegação da Planilha e das Fichas**:
   - Tornar o trânsito entre múltiplos heróis imediato e intuitivo na aba de Fichas (`#tab-players`), eliminando a necessidade de rolar exaustivamente a tela para encontrar personagens específicos.
   - Modernizar a barra de abas internas do card do herói (`roll20-tabs-header`) com contadores visuais táteis (ex: `✨ Magias (12)`, `🎒 Inventário (15)`, `📜 Traços (8)`) e melhor usabilidade em dispositivos móveis e desktops.
2. **Visualização de Traços & Características (Traits)**:
   - Eliminar a sobrecarga visual da aba "📜 Traços": atualmente todas as habilidades de classe, raça e talentos aparecem em uma lista vertical sem agrupamento por tipo ou filtros.
   - Implementar **Filtros Rápidos por Categoria** (`[🌐 Todos]`, `[🧬 Espécie / Raça]`, `[🌳 Classe & Subclasse]`, `[⭐ Talentos & ASI]`, `[📝 Outros]`).
   - Implementar **Busca Instantânea de Traços** (`🔍 Filtrar características...`) para localização imediata em meio a combates e explorações.
   - Adicionar **Modo Acordeão / Expansão Direta no Card** (`[⊞ Expandir Todos] / [⊟ Recolher]`) com revelação do texto completo no próprio card sem obrigar a abrir popovers ou modais.
   - Badges cromáticas refinadas para economia de ação (`⚔️ Ação`, `⚡ Bônus`, `🛡️ Reação`, `✨ Passiva`) e recarga (`Descanso Curto / Longo`).
3. **Visualização e Organização de Magias (Spells)**:
   - **Agrupamento Canônico por Círculo de Magia**: substituir a grade única misturada por blocos organizados por círculo D&D 5E:
     - ✨ **Truques (Círculo 0)**
     - 🔮 **1º Círculo** (com indicador de slots disponíveis e atalhos rápidos)
     - 🔮 **2º Círculo**, **3º Círculo** etc.
   - **Badges de Metadados e Alertas Essenciais**:
     - `[C] Concentração` em destaque âmbar (vital para conjuradores não quebrarem concentração por descuido).
     - `[R] Ritual` em badge roxa.
     - Tempo de conjuração (`1 Ação`, `1 Bônus`, `Reação`), alcance e componentes (`V, S, M`).
   - **Busca e Filtro por Círculo no Grimório do Herói**:
     - Filtros rápidos por círculo (`Todos`, `Truques`, `1º`, `2º`, `3º`...) e campo de busca instantânea de magia.
     - Manter o filtro de preparação (`Todas as Conhecidas` vs `Apenas Preparadas`).

---

## 🎯 Proposta de Modificações e Módulos Afetados

### 1. `src/styles/head_css.html` (Design System & Responsividade)
- Estilos para a **Barra de Acesso Rápido a Heróis** (`.hero-quick-nav-bar`, `.hero-quick-chip`, `.hero-quick-avatar`, `.hero-quick-hp-mini`):
  - Barra horizontal deslizável fixa ou destacada no topo de `#tab-players` com visual glassmorphism épico.
  - Efeito `:hover` e animação de pulso/highlight (`.hero-card-highlight`) ao saltar para o herói selecionado.
- Estilos para a **Navegação de Abas da Ficha Roll20**:
  - Abas em formato pill moderno com badges numéricos (`.tab-badge-pill`), rolagem suave e indicador ativo dourado D&D.
- Estilos para a **Visualização de Traços**:
  - Chips de filtro por categoria (`.feature-category-chip.active`).
  - Barra de busca integrada (`.feature-search-input`).
  - Acordeão expansível com animação sutil (`.feature-collapsible-body`, `.btn-feature-expand`).
- Estilos para a **Visualização de Magias por Círculo**:
  - Cabeçalho de círculo (`.spell-circle-group-header`, `.spell-circle-title`, `.spell-circle-slot-pills`).
  - Badges de Concentração (`.spell-tag-conc`), Ritual (`.spell-tag-ritual`), Tempo e Alcance.
  - Grade compacta e harmoniosa de magias por círculo.

### 2. `src/js/players.js` (Lógica de Apresentação e Interação)
- **Barra de Acesso Rápido aos Heróis (`renderHeroQuickNav`)**:
  - Renderiza mini-chips de cada herói visível (respeitando filtros de campanha ativos) com avatar, nome, classe, nível e barra/porcentagem de PV.
  - Função `jumpToPlayerCard(playerId)`: executa scroll suave (`scrollIntoView({ behavior: 'smooth', block: 'start' })`) e aplica classe de destaque temporário.
- **Contadores Dinâmicos nas Abas Roll20**:
  - Atualizar os rótulos de abas para incluir badges reais:
    - `✨ Magias (${allKnownCount})`
    - `🎒 Inventário (${itemCount})`
    - `📜 Traços (${totalFeaturesCount})`
- **Overhaul da Aba "📜 Traços"**:
  - Incluir barra superior com campo de busca `inp-trait-search-${p.id}` e chips de categoria (`all`, `species`, `class`, `feats`).
  - Adicionar botão alternador `[⊞ Expandir / ⊟ Recolher Todos]`.
  - Permitir que cada item de característica abra/feche seu texto explicativo inline, mantendo a opção de abrir o modal detalhado com 1 clique.
- **Overhaul da Aba "✨ Magias"**:
  - Agrupar magias conhecidas/preparadas em um dicionário canônico por círculo (0 = Truques, 1 = 1º Círculo, etc.).
  - Para cada círculo que possuir magias, renderizar um container `.spell-circle-group` com cabeçalho temático, quantidade de magias e rastreador de slots correspondente (com botões de gastar/recuperar slot ali mesmo).
  - Incluir badges visuais de metadados (`[C] Concentração`, `[R] Ritual`, tempo de conjuração) extraídos de `SPELLS_DATA`.
  - Filtros rápidos por círculo (`all`, `0`, `1`, `2`, `3`...) e busca em tempo real.

### 3. `src/ui/ui.html` (Estrutura da Aba de Fichas)
- Inserir o container ancorado `#hero-quick-nav-container` no topo da seção de heróis em `#tab-players`.

---

## 🧪 Estratégia de Verificação e Testes Automatizados

### Bateria 126 em `test_runner.js`:
1. **Navegação e Barra Rápida de Heróis**:
   - Validar que `jumpToPlayerCard` e a estrutura de mini-chips de heróis são gerados corretamente com IDs únicos.
   - Validar que os badges contadores nas abas da ficha Roll20 calculam com exatidão a quantidade de magias, itens e traços.
2. **Visualização e Filtragem de Traços**:
   - Validar que o agrupamento de traços separa corretamente Traços de Espécie/Raça, Habilidades de Classe/Subclasse e Talentos.
   - Validar que o filtro por categoria (`species`, `class`, `feats`) e a busca por texto filtram os itens esperados.
   - Validar que as badges de economia de ação (`action`, `bonus`, `reaction`, `passive`) são atribuídas com precisão.
3. **Visualização e Agrupamento de Magias por Círculo**:
   - Validar que o agrupador de magias separa corretamente Truques (nível 0) de magias de 1º, 2º e 3º círculos.
   - Validar que os metadados canônicos (Concentração, Ritual, Tempo de Conjuração) são detectados e formatados.
   - Validar que a filtragem por círculo específico e a busca de magias retornam os subconjuntos corretos.
4. **Integridade de Compilação e Sintaxe**:
   - Executar `node builder.js` e verificar integridade do bundle standalone.
   - Executar `node test_runner.js` garantindo 100% de aprovação em todos os testes existentes e novos.

---

## 📋 Checklist de Entrega
- [x] Plano de Implementação aprovado pelo usuário.
- [x] Implementação dos estilos e layout em `src/styles/head_css.html`.
- [x] Implementação da navegação e visualização em `src/js/players.js` e `src/ui/ui.html`.
- [x] Compilação standalone realizada com `node builder.js`.
- [x] 100% de aprovação na suíte de testes (`node test_runner.js`).
- [x] Registro detalhado no Quadro de Issues (`issues/README.md`).
- [x] Commit semântico e push no Git.
