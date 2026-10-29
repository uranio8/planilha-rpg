# 📋 Plano de Implementação: Integração do Acervo de 8 Livros D&D 5E (ISSUE-159)

## 📌 Contexto & Objetivos

Com os **8 livros de D&D 5E** (1.658 páginas) indexados localmente em `books/index/`, vamos integrar os **4 pilares de conteúdo oficial** diretamente na **Planilha RPG**:

1. **🎭 Pilar 1 — Antecedentes Oficiais Interativos (`Antecedentes.pdf` + `Guia de Xanathar.pdf`)**:
   - Criar a base oficial `src/data/backgrounds.js` (`BACKGROUNDS_DATA`) contendo os **13 Antecedentes Clássicos** (*Acólito, Artesão de Guilda, Artista, Charlatão, Criminoso, Eremita, Forasteiro, Herói Popular, Marinheiro, Morador de Rua, Nobre, Sábio e Soldado*) extraídos de `Antecedentes.pdf`, cada um com:
     - `skillProficiencies` (as 2 perícias oficiais, ex.: *Intuição* e *Religião* para Acólito).
     - `toolProficiencies` e `languages`.
     - `equipment` e `gold` inicial.
     - `featureName` e `featureDesc` (Característica de Antecedente, ex.: *Abrigo dos Fiéis*, *Contato Criminal*, *Patente Militar*).
     - Tabelas oficiais completas de `personalityTraits` (d8), `ideals` (d6), `bonds` (d6) e `flaws` (d6).
   - No modal de criação/edição de ficha (`#modal-player` em `src/ui/ui.html` e `src/js/players.js`):
     - Adicionar seletor/autocomplete dos 13 Antecedentes em `#pm-background` + barra interativa com botões **`🎲 Sortear Personalidade/Ideal/Vínculo/Defeito`** (`rollBackgroundTraitsModal()`) e **`✨ Aplicar Perícias & Característica do Antecedente`** (`applyBackgroundBenefitsModal()`), além de botões individuais `🎲` ao lado de Personalidade, Ideal, Vínculo e Defeito.
     - Exibir a Característica do Antecedente também na aba de **Traços / Sobre** da ficha do jogador.

2. **💎 Pilar 2 — Gerador Oficial de Tesouros, Gemas, Objetos de Arte & Catálogo de Itens Mágicos (`Guia do Mestre` + `Guia de Xanathar`)**:
   - **Catálogo de Itens Mágicos & Gemas/Artes (`src/data/equipment.js`)**:
     - Expandir `EQUIPMENT_DATA` com os principais **Itens Mágicos Oficiais do DMG e Xanathar** (incluindo *Espada da Vingança, Armas +1/+2/+3, Escudo +1/+2/+3, Armaduras +1/+2/+3, Poções de Cura Maior/Superior/Suprema, Poção de Invisibilidade, Poção de Voo, Pergaminhos de Magia 1º ao 5º Círculo, Bolsa de Carga, Manto Élfico, Botas Élficas, Anel de Proteção, Amuleto de Saúde, Manoplas de Força do Ogro, Cajado do Poder, Varinha de Mísseis Mágicos, Capa de Deslocamento, Pedra Ioun*, além de Itens Mágicos Comuns de Xanathar como *Manto de Muitas Modas, Chapéu de Mago, Armadura Fumegante*) e as **Gemas (10 a 5.000 PO)** e **Objetos de Arte (25 a 7.500 PO)**.
   - **Tabelas do Gerador de Tesouro do DMG (`DMG_TREASURE_TABLES` em `src/js/campaigns.js`)**:
     - Adicionar no painel do **Baú Coletivo & Suprimentos** (`src/ui/ui.html` e `#modal-party-stash-view`) uma barra **`🎲 Gerador Oficial de Saque (Guia do Mestre)`** com botões de 1-clique:
       - `💎 +Gema Aleatória (10 / 50 / 100 / 500 / 1000 PO)`
       - `🎨 +Objeto de Arte (25 / 250 / 750 / 2500 PO)`
       - `✨ +Item Mágico Aleatório (Comum / Incomum / Raro)`
       - `🏆 Rolar Pilha de Tesouro por ND (ND 0–4 | ND 5–10 | ND 11–16 | ND 17+)`: sorteia automaticamente o ouro, gemas, objetos de arte e itens mágicos segundo o Capítulo 7 do Guia do Mestre e deposita tudo no Baú Coletivo registrando no histórico!

3. **⚔️ Pilar 3 — Subclasses do Guia de Xanathar & Raças de Volo / Mordenkainen (`src/data/classes.js` & `src/data/species.js`)**:
   - **Subclasses de Xanathar (`src/data/classes.js`)**:
     - Adicionar às 12 classes em `CLASSES_DATA` as subclasses clássicas do *Guia de Xanathar* com suas habilidades de nível 3, 6, 10, 14/15/17/18 em português:
       - **Bárbaro**: *Caminho do Guardião Ancestral*, *Caminho do Arauto da Tempestade*.
       - **Bardo**: *Colégio das Espadas*, *Colégio dos Sussurros*.
       - **Bruxo**: *O Lâmina Maldita (Hexblade)*, *O Celestial*.
       - **Clérigo**: *Domínio da Forja*, *Domínio da Sepultura*.
       - **Druida**: *Círculo dos Sonhos*, *Círculo do Pastor*.
       - **Feiticeiro**: *Alma Favorecida (Divine Soul)*, *Adepto das Sombras*, *Feiticeiro da Tempestade*.
       - **Guerreiro**: *Samurai*, *Cavaleiro*, *Arqueiro Arcano*.
       - **Ladino**: *Espadachim (Swashbuckler)*, *Inquiridor*, *Batedor*.
       - **Mago**: *Mago de Guerra (War Magic)*.
       - **Monge**: *Estilo do Kensei*, *Estilo do Mestre Bêbado*, *Estilo da Alma Solar*.
       - **Paladino**: *Juramento da Conquista*, *Juramento da Redenção*.
       - **Patrulheiro**: *Andarilho do Horizonte*, *Exterminador de Monstros*.
   - **Raças Jogáveis de Volo & Mordenkainen (`src/data/species.js`)**:
     - Expandir `SPECIES_DATA` com as raças de `Volo's Guide.pdf`, `Tome of Foes.pdf` e `Monsters of the Universe.pdf` (e seus bônus raciais em `src/js/players.js`):
       - **Tabaxi**, **Kenku**, **Firbolg**, **Povo-Lagarto (Lizardfolk)**, **Tritão**, **Aarakocra**, **Genasi (Ar, Terra, Fogo, Água)**, **Gith (Githyanki & Githzerai)**, **Tortle**, **Harengon**, **Fada (Fairy)**, ** Metamórfo (Changeling)** e **Yuan-ti**, além das linhagens élficas/anãs (*Eladrin, Shadar-kai, Duergar*).

4. **🐉 Pilar 4 — Expansão do Bestiário com Criaturas e PdMs de Volo, Tome of Foes e Manual dos Monstros (`src/data/monsters.js` & `src/js/compendium.js`)**:
   - Adicionar ao `BESTIARY_DATA` (`src/data/monsters.js`) as criaturas icônicas e os **PdMs Especialistas** de *Volo's Guide* e *Mordenkainen's Tome of Foes* em português:
     - **PdMs de Volo**: *Abjurador (ND 9), Adivinho (ND 8), Aprendiz de Mago (ND 1/4), Arqueiro (ND 3), Arquidruida (ND 12), Bardo (ND 2), Campeão (ND 9), Conjurador (ND 6), Encantador (ND 5), Evocador (ND 9), Ilusionista (ND 3), Mestre em Artes Marciais (ND 3), Mestre Ladrão (ND 5), Necromante (ND 9), Esgrimista / Swashbuckler (ND 3), Senhor da Guerra / Warlord (ND 12), Sacerdote de Guerra (ND 9), Guarda Negro / Blackguard (ND 8)*.
     - **Monstros de Volo & Tome of Foes**: *Alhoon (ND 10), Cérebros Anciãos / Elder Brain (ND 14), Devorador (ND 13), Bodak (ND 6), Banderhobb (ND 5), Barghest (ND 4), Catoblepas (ND 5), Caveira Flamejante, Flind (ND 9), Leucrotta (ND 3), Neothelid (ND 13), Oblex Adulto (ND 5) & Ancião (ND 10), Cadáver Estelar Mangler/Hulk/Seer/Larva Mage, Eladrin (Outono, Inverno, Primavera, Verão - ND 10), Marut (ND 25), Leviatã (ND 20), Fênix (ND 16), Tempestade Anciã (ND 23), Zariel (ND 26), Demogorgon (ND 26), Orcus (ND 26), Graz'zt (ND 24), Baphomet (ND 23), Yeenoghu (ND 24), Juiblex (ND 23), Zuggtmoy (ND 23)*.
   - Atualizar o filtro de fontes do Bestiário (`#filter-monster-source` em `src/ui/ui.html`) para permitir filtrar também por `Volo's Guide` e `Tome of Foes`.

---

## 🛠️ Arquivos Afetados
- `src/data/backgrounds.js` *(novo arquivo de dados incluído no `builder.js`)*
- `src/data/equipment.js` *(expansão com Itens Mágicos DMG/Xanathar, Gemas e Objetos de Arte)*
- `src/data/classes.js` *(adição das subclasses de Xanathar nas 12 classes)*
- `src/data/species.js` *(adição das raças de Volo e Mordenkainen)*
- `src/data/monsters.js` *(adição dos PdMs e monstros de Volo e Tome of Foes)*
- `src/js/players.js` *(integração de Antecedentes, sorteio de traços d8/d6 e bônus raciais das novas espécies)*
- `src/js/campaigns.js` *(Gerador Oficial de Tesouros, Gemas, Objetos de Arte e Pilhas por ND no Baú Coletivo)*
- `src/ui/ui.html` *(seletor/sorteador de Antecedentes no modal de ficha, barra de Gerador de Saque DMG no Baú Coletivo e filtro de fonte no Bestiário)*
- `src/styles/head_css.html` *(estilos visuais para a barra de Gerador de Tesouro DMG e seletor de Antecedentes)*
- `builder.js` *(inclusão de `src/data/backgrounds.js` na compilação)*
- `test_runner.js` *(nova **Bateria 128** validando todos os 4 pilares)*
- `issues/README.md` *(documentação da **ISSUE-159**)*

---

## 🛡️ Impactos em Persistência e Compatibilidade
- 100% retrocompatível com `localStorage` (`dnd_tracker_state_v3`, `dnd_tracker_players_v3`, `dnd_tracker_campaigns_v1`) e sincronização Firebase.
- Fichas existentes preservam seus antecedentes e subclasses atuais (`subclassIdx` existentes permanecem nos mesmos índices, pois novas subclasses são adicionadas ao final do array `subclasses` de cada classe).

---

## 🧪 Estratégia de Verificação (`node test_runner.js`)
- **Bateria 128**:
  1. Validar `BACKGROUNDS_DATA` (13 antecedentes completos, sorteio de traços d8/d6 e aplicação de perícias na ficha).
  2. Validar `EQUIPMENT_DATA` expandido (Itens Mágicos, Gemas, Objetos de Arte) e as funções do Gerador de Tesouro do DMG (`rollDmgGemToStash`, `rollDmgArtToStash`, `rollDmgMagicItemToStash`, `rollDmgTreasureHoardToStash`).
  3. Validar as novas subclasses de Xanathar em `CLASSES_DATA` e as novas raças de Volo/Mordenkainen em `SPECIES_DATA`.
  4. Validar os novos PdMs e criaturas de Volo/Tome of Foes em `BESTIARY_DATA`.
  5. Compilar via `node builder.js` e executar `node test_runner.js` com 100% de aprovação.

---

## 📋 Checklist de Entrega
- [x] Plano de Implementação aprovado pelo usuário (`implementation_plan.md`).
- [x] Pilar 1 implementado: `src/data/backgrounds.js` + integração no modal e ficha (`src/js/players.js`, `src/ui/ui.html`).
- [x] Pilar 2 implementado: Itens Mágicos, Gemas e Objetos de Arte em `src/data/equipment.js` + Gerador de Saque DMG em `src/js/campaigns.js` e `src/ui/ui.html`.
- [x] Pilar 3 implementado: Subclasses de Xanathar em `src/data/classes.js` + Raças de Volo/Mordenkainen em `src/data/species.js`.
- [x] Pilar 4 implementado: PdMs e Monstros de Volo e Tome of Foes em `src/data/monsters.js`.
- [x] Compilação (`node builder.js`) e testes (`node test_runner.js` - Bateria 128) 100% aprovados.
- [x] Documentação atualizada em `issues/README.md`.
