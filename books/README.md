# 📚 Biblioteca & Indexador de Livros D&D 5E (`books/`)

Esta pasta armazena os livros de referência em PDF e seus respectivos índices estruturados em JSON e texto puro (página por página) para consulta instantânea e extração de dados para a **Planilha RPG**.

## 📁 Estrutura de Diretórios

- [`books/sync_and_index_books.js`](file:///c:/Users/wesle/.gemini/antigravity-ide/scratch/Planilha%20RPG/books/sync_and_index_books.js): Script automatizado que baixa os PDFs do Google Drive (com tratamento de confirmação de arquivos grandes), extrai metadados e indexa página por página.
- [`books/index/catalog.json`](file:///c:/Users/wesle/.gemini/antigravity-ide/scratch/Planilha%20RPG/books/index/catalog.json): Catálogo mestre contendo metadados, contagem de páginas, tamanho e caminhos de todos os livros indexados.
- `books/pdfs/*.pdf`: Arquivos PDF originais baixados localmente (ignorados no Git via `.gitignore` para não sobrecarregar o repositório com ~240 MB de binários).
- `books/index/*_pages.json`: Array JSON estruturado `[{ page, text }]` de cada livro para busca e extração programática.
- `books/index/*_full.txt`: Texto integral sequencial demarcado por `=== PÁGINA X ===`.

---

## 📖 Acervo Indexado (8 Livros — 1.658 Páginas)

| # | Arquivo Original | Páginas | Tamanho | Índice JSON | Conteúdo Principal |
|---|---|---|---|---|---|
| **1** | **D&D 5E - Guia do Mestre (DMG PT-BR).pdf** | 322 | 19.85 MB | `d_d_5e_-_guia_do_mestre_dungeon_masters_guide_pt-br_pages.json` | Criação de mundos, aventuras, PdMs, ambientes, armadilhas, tempo livre, **Tesouros (Gemas, Objetos de Arte, Tabelas de Pilha e Itens Mágicos A–Z)**, venenos, doenças e loucura. |
| **2** | **Tome of Foes.pdf** (*Tomo de Mordenkainen sobre Inimigos* PT-BR) | 258 | 47.39 MB | `tome_of_foes_pages.json` | Lore da Guerra do Sangue, Elfos, Anões/Duergares, Gith, Halflings/Gnomos, Sub-raças jogáveis e **Bestiário de Nível Alto** (Lordes Demônios, Arquidiabos, Eladrin, Oblex, Cadáver Estelar). |
| **3** | **Monsters of the Universe.pdf** (*Mordenkainen Presents: Monsters of the Multiverse* EN) | 289 | 28.67 MB | `monsters_of_the_universe_pages.json` | **33 Raças Fantásticas Revisadas** (Aarakocra, Changeling, Eladrin, Fairy, Firbolg, Genasi, Gith, Goliath, Harengon, Kenku, Kobold, Satyr, Shadar-kai, Tabaxi, Tortle, Yuan-ti...) e **+250 Monstros Revisados**. |
| **4** | **manual dos monstros.pdf** (*Monster Manual* PT-BR) | 352 | 20.87 MB | `manual_dos_monstros_pages.json` | Bestiário clássico oficial de D&D 5E em português de A a Z (Aarakocra a Zumbi), covis, ações lendárias, animais (Apêndice A) e PdMs genéricos (Apêndice B). |
| **5** | **Guia de Xanathar.pdf** (*Xanathar's Guide to Everything* PT-BR) | 195 | 42.61 MB | `guia_de_xanathar_pages.json` | **31 Subclasses Clássicas**, gerador de história de vida (*"Essa é Sua Vida"*), **Talentos Raciais**, regras expandidas de **Ferramentas**, **Armadilhas Complexas**, **Atividades de Tempo Livre (Downtime)**, **Itens Mágicos Comuns** e **95 Magias**. |
| **6** | **Antecedentes.pdf** (PT-BR) | 13 | 0.52 MB | `antecedentes_pages.json` | Compêndio detalhado dos **13 Antecedentes Clássicos** (Acólito, Artesão de Guilda, Artista, Charlatão, Criminoso, Eremita, Forasteiro, Herói do Povo, Marinheiro, Morador de Rua, Nobre, Sábio, Soldado) com perícias, equipamentos e tabelas d8/d6 de traços, ideais, vínculos e defeitos. |
| **7** | **Volo's Guide.pdf** (*Guia de Volo para Monstros* PT-BR) | 226 | 80.78 MB | `volo_s_guide_pages.json` | Ecologia profunda e covis (Bruxas, Devoradores de Mentes, Gigantes, Gnolls, Goblinoides, Kobolds, Observadores, Orcs, Yuan-ti), **Raças Jogáveis** (Aasimar, Firbolg, Golias, Kenku, Povo-Lagarto, Tabaxi, Tritão e Monstros Aventureiros) e **Bestiário Expandido**. |
| **8** | **ficha.pdf** (PT-BR) | 3 | 0.49 MB | `ficha_pages.json` | Ficha oficial clássica de D&D 5E em 3 páginas em português (Página 1: Atributos, Perícias, Combate e Características; Página 2: Aparência, História, Aliados e Tesouro; Página 3: Folha de Conjuração de Truques ao 9º Círculo). |

