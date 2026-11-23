# 📋 Plano de Implementação: Atlas e Guia de Viagem da Costa da Espada (ISSUE-186)

## 📌 Contexto & Solicitação do Usuário

O usuário solicitou a criação de um módulo completo de **"Atlas e Guia de Viagem da Costa da Espada"** integrado ao sistema de RPG, com foco em lore fiel de *Forgotten Realms (D&D 5e)* em português do Brasil, tendo como ponto de partida central o **Bastião dos Jogadores** nos arredores de **PortoReal Bastião**.

---

## 🧭 Posicionamento Geográfico Escolhido (Ponto Zero)

* **PortoReal Bastião & Bastião dos Jogadores (`0 km`)**:
  * Localizado na **Costa da Espada Central**, em uma enseada abrigada a meio caminho entre **Águas Profundas** (~360 km ao norte pela Estrada da Costa) e o **Portão de Baldur** (~440 km ao sul pela Estrada da Costa), próximo às falésias costeiras de onde partem tanto rotas terrestres quanto rotas marítimas pelo Mar das Espadas.
* **Ritmos de Viagem (D&D 5e)**:
  * **🚶 A pé**: `38 km/dia`
  * **🐎 A cavalo**: `55 km/dia`
  * **⛵ Navio**: `75 km/dia` (disponível apenas para cidades com porto/rota marítima `hasSeaRoute: true`; cidades interiores exibem rota terrestre recomendada).

---

## 🎯 Objetivos da Implementação (ISSUE-186)

### 1. 🗺️ Banco de Dados Geográfico & Lore (`src/data/atlas.js`)
* **Regiões de Faerûn (`ATLAS_REGIONS`)**:
  1. **Costa da Espada Central** (Clima temperado marítimo, estradas patrulhadas mas visadas por salteadores e cultos).
  2. **O Norte Selvagem & Costa Norte** (Clima frio/chuvoso, perigo alto nas estradas entre Luskan e Inverno Remoto).
  3. **Fronteiras Prateadas (Silver Marches)** (Clima alpino/rigoroso, patrulhas élficas e anãs contra orcs e gigantes).
  4. **Vale do Vento Gélido (Icewind Dale)** (Tundra ártica extrema, nevascas constantes e perigo severo).
  5. **Costa da Espada Sul & Terras Centrais Ocidentais** (Clima ameno a quente, comércio intenso e intrigas políticas).
* **Cidades Principais (`ATLAS_CITIES`, 12 cidades canônicas + PortoReal Bastião)**:
  1. **PortoReal Bastião** (`0 km` — Ponto de Partida / Selo Especial do Bastião).
  2. **Águas Profundas (Waterdeep)** (`360 km` Norte — Porto + Estrada da Costa).
  3. **Adaga (Daggerford)** (`240 km` Norte — Estrada da Costa / Rio Delimbiyr).
  4. **Portão de Baldur (Baldur's Gate)** (`440 km` Sul — Porto + Estrada da Costa).
  5. **Forte da Vela (Candlekeep)** (`590 km` Sul — Fortaleza-biblioteca costeira).
  6. **Inverno Remoto (Neverwinter)** (`740 km` Norte — Porto + Estrada Alta).
  7. **Luskan** (`960 km` Norte — Porto dos Piratas / Foz do Rio Mirar).
  8. **Triboar** (`580 km` Nordeste — Interior, sem rota marítima).
  9. **Yartar** (`700 km` Nordeste — Interior, rio navegável apenas localmente).
  10. **Lua Argêntea (Silverymoon)** (`980 km` Nordeste — Fronteiras Prateadas, interior).
  11. **Mirabar** (`1.080 km` Norte-Nordeste — Montanhas da Espinha do Mundo, interior).
  12. **Dez-Cidades / Bryn Shander (Icewind Dale)** (`1.380 km` Norte — Extremo Norte, rota terrestre/caravana).
  13. **Athkatla (Amn)** (`920 km` Sul — Costa Sul, grande porto mercante).
* Cada cidade incluirá:
  * Nome, Região, Descrição Atmosférica fiel a *Forgotten Realms* (PT-BR), `distanceKm`, `hasSeaRoute`, `isStartingPoint`.
  * **Facções atuantes** (Harpistas, Aliança dos Lordes, Zhentarim, Ordem da Manopla, Enclave Esmeralda, Irmandade Arcana, Punho Flamejante, etc.).
  * **Atrações & Pontos de Interesse (4 categorias)**:
    * ⚔️ *Forjas e Artesanato*
    * 🔮 *Magia e Itens Mágicos*
    * 📚 *Livros e Conhecimento*
    * 🎭 *Festas, Eventos e Cultura*

---

### 2. 🖥️ Interface Interativa (`src/js/atlas.js`, `src/ui/ui.html`, `src/styles/head_css.html`)
* **Aba `🧭 Atlas & Viagens`** acessível na barra superior (para Mestre) e no **Portal do Jogador** (`#pnav-atlas` + `PLAYER_ALLOWED_TABS`).
* **Destaque Permanente para PortoReal Bastião**: Exibido com selo **"🏰 Ponto de Partida / Bastião"** no topo da lista.
* **Seletor de Meio de Transporte**: Toggle visual (`🚶 A pé — 38 km/dia` | `🐎 A cavalo — 55 km/dia` | `⛵ Navio — 75 km/dia`) que recalcula instantaneamente os dias de viagem em todos os cards.
* **Filtros & Busca**:
  * Filtro por **Região**, filtro por **Facção** e busca textual instantânea por **nome da cidade ou atração** (ex.: `"forja"`, `"livros"`, `"harpistas"`).
* **Cards + Modal Detalhado (`#modal-atlas-city`)**:
  * Cards resumidos com Região, Clima/Perigo, Distância em km, Tempo de viagem em dias e badges de Facções.
  * Ao clicar, abre o modal detalhado com lore completo, clima da região, facções, as **4 abas/seções de atrações** e (para o Mestre) um botão opcional **`⏳ Viajar até aqui (+X dias)`** que avança o Relógio de Dias da Campanha (`advanceCampaignDays`)!

---

## 📁 Arquivos e Módulos Afetados

| Arquivo | Componente / Responsabilidade |
|---|---|
| `src/data/atlas.js` | Novo dataset `ATLAS_REGIONS`, `ATLAS_CITIES` e `ATLAS_TRAVEL_MODES` |
| `src/js/atlas.js` | Novo módulo de renderização, filtros, cálculo de viagem e modal de detalhes `#modal-atlas-city` |
| `builder.js` | Inclusão de `src/data/atlas.js` e `src/js/atlas.js` no bundle standalone |
| `src/ui/ui.html` | Botão da aba `🧭 Atlas`, seção `#tab-atlas`, chip `#pnav-atlas` no Portal e modal `#modal-atlas-city` |
| `src/js/core.js` | Inclusão de `'atlas'` em `PLAYER_ALLOWED_TABS`, `MASTER_TABS_ORDER`, `PORTAL_TABS_ORDER` e hook de renderização em `switchTab` |
| `src/styles/head_css.html` | Estilos do Atlas, seletor de transporte, cards de cidade, selo de ponto de partida e seções de atrações |
| `test_runner.js` | Bateria 153 validando regiões, cidades, cálculo de dias por transporte (38/55/75 km/dia), filtros por região/facção/busca e integridade de UI |
| `issues/README.md` | Registro oficial da ISSUE-186 |

---

## ⚠️ Possíveis Impactos & Riscos Mitigados

* **Compatibilidade com `test_runner.js` e `test_ui_integrity.js`**: `builder.js` e `test_runner.js` serão atualizados para carregar `atlas.js` no sandbox de testes e validar os pares de modal `openAtlasCityModal` / `closeAtlasCityModal`.
* **Zero Impacto em `localStorage`**: O Atlas é um módulo de referência geográfica estática que apenas consulta e opcionalmente aciona `advanceCampaignDays`.

---

> ⚠️ **Aguardando sua aprovação explícita conforme a Regra 1 do `AGENTS.md` para iniciar a implementação nos arquivos sob `src/`.**
