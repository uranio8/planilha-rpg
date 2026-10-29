# Plano de Implementação — ISSUE-163: Ficha Oficial em PDF (Modelo `ficha.pdf`) + Traços Diretos e Objetivos

## 1. Diagnóstico

### 1.1 PDF Editável atual
- [`generateEditableDnd5ePdf`](file:///c:/Users/wesle/.gemini/antigravity-ide/scratch/Planilha%20RPG/src/js/pdf_export.js#L117) **desenha a ficha do zero** com `pdf-lib` (retângulos + campos criados manualmente). O visual é genérico e não segue a ficha oficial.
- O arquivo [`books/pdfs/ficha.pdf`](file:///c:/Users/wesle/.gemini/antigravity-ide/scratch/Planilha%20RPG/books/pdfs/ficha.pdf) é a **ficha oficial PT-BR de 3 páginas** e **já tem 330 campos de formulário (AcroForm)** prontos:

| Página | Campos já existentes no modelo |
|---|---|
| 1 | Nome, Classe e Nível, Raça, Antecedente, Jogador, Tendência, XP, 6 atributos + mods, Inspiração, Bônus de Proficiência, 6 salvaguardas (valor + marcador), 18 perícias (valor + marcador), Percepção Passiva, CA, Iniciativa, Deslocamento, PV (máx/atual/temp), Dados de Vida, 6 marcadores de Teste contra a Morte, 3 armas (nome/bônus/dano), Ataques e Magias, Idiomas e Proficiências, Equipamento, Traços/Ideais/Ligações/Defeitos, **Características e Habilidades** |
| 2 | Idade, Altura, Peso, Olhos, Pele, Cabelos, Aliados e Organizações, Facção, História, **Outras Características e Habilidades**, Tesouro |
| 3 | Classe de Conjurador, Habilidade-Chave, CD, Bônus de Ataque, 8 linhas de Truques, **9 círculos** com Total/Usados de espaços + 92 linhas de magia com marcador de "preparada" |

### 1.2 Traços na ficha (o problema principal)
Exemplo real — **Claker (Bruxo 5 / Tiefling)** gera hoje **11 traços com 2.590 caracteres**:
- Texto de livro genérico: *"No 1º nível, você firma um pacto com uma entidade..."* e lista as **3 opções** de Patrono e de Dádiva do Pacto, em vez da escolhida.
- Fórmulas não resolvidas: *"PV temporários iguais ao mod. de Carisma + nível de bruxo"* (deveria dizer **"+10 PV temp."**).
- Traços de marco sem informação útil: *"Aumento no Valor de Habilidade (4º Nível)"* com o texto da regra inteira.
- Duplicidade: a linha personalizada `Bênção do Obscuro, Sorte do Obscuro` repete um traço oficial.
- Não diz **quando usar** (Ação / Bônus / Reação / Passivo) nem **quantas vezes** (por descanso curto/longo).

Isso afeta igualmente a ficha virtual, a [impressão A4](file:///c:/Users/wesle/.gemini/antigravity-ide/scratch/Planilha%20RPG/src/js/players.js#L10293-L10316) e o PDF editável, pois todos usam [`getPlayerAllFeaturesAndTraits`](file:///c:/Users/wesle/.gemini/antigravity-ide/scratch/Planilha%20RPG/src/js/players.js#L9819-L9891).

---

## 2. Proposta

### 2.1 Novo formato "direto ao ponto" dos traços
Cada traço passa a ter uma estrutura padronizada e curta:

```
✦ Bênção do Obscuro — Passivo
  Ao reduzir um inimigo a 0 PV: ganha +10 PV temporários.

✦ Magia de Pacto — 2 espaços de 3º círc. • recarrega em Descanso Curto
  CD 16 • Ataque +8 (Carisma).

✦ Legado Infernal — Ação • 1×/Descanso Longo cada
  Taumaturgia (à vontade); Repreensão Infernal (2º círc.); Escuridão.
```

- Novo helper `getPlayerTraitQuickSummary(feature, p)` que retorna `{ name, tag, usage, summary }`:
  - **`tag`**: Ação / Ação Bônus / Reação / Passivo (reutiliza [`getFeatureActionType`](file:///c:/Users/wesle/.gemini/antigravity-ide/scratch/Planilha%20RPG/src/js/players.js#L714)).
  - **`usage`**: usos e recarga (ex.: `3×/Descanso Longo`, `recarrega em Descanso Curto`).
  - **`summary`**: 1–2 frases com **números já calculados para o personagem** (reaproveita a resolução de fórmulas de [`formatPlayerFeatureForDisplay`](file:///c:/Users/wesle/.gemini/antigravity-ide/scratch/Planilha%20RPG/src/js/players.js#L6362)).
- Novo dicionário `TRAIT_QUICK_RULES` em `src/data/trait_quick_rules.js` com resumos curados e diretos para os traços mais usados: **todas as 12 classes (Nv 1–10)** e **raças do Livro do Jogador** + as raças da mesa (Tiefling, Draconato, Orc/Meio-Orc, Elfo, Humano etc.).
- **Fallback automático** para traços sem resumo curado: remove frases de abertura ("No Xº nível...", "A partir do..."), corta no 1º parágrafo e limita a ~180 caracteres.
- **Limpeza de ruído**:
  - Oculta marcos de ASI já resolvidos (mostra só a escolha, ex.: `ASI Nv 4: +2 Carisma`).
  - Mostra apenas a **subclasse / dádiva / estilo escolhidos**, não a lista de opções.
  - Oculta benefícios raciais de níveis ainda não atingidos.
  - Remove duplicatas de linhas personalizadas que repetem traços oficiais.
  - "Idiomas" sai dos traços e vai para o campo **Idiomas e Proficiências**.

### 2.2 PDF Editável usando a ficha oficial `ficha.pdf`
- `builder.js` lê `books/pdfs/ficha.pdf` e gera embutido em base64 (`DND5E_OFFICIAL_SHEET_B64`), mantendo o app **100% standalone** (funciona em `file://` e offline).
- Nova função `fillOfficialDnd5eSheetPdf(p)` em [`src/js/pdf_export.js`](file:///c:/Users/wesle/.gemini/antigravity-ide/scratch/Planilha%20RPG/src/js/pdf_export.js) carrega o modelo com `PDFDocument.load` e **preenche os campos existentes** (mapa nome do campo → dado da ficha), incluindo:
  - Página 1: identidade, atributos/mods, salvaguardas e perícias com marcadores de proficiência, CA, Iniciativa, Deslocamento, PV, Dados de Vida, Testes contra a Morte, 3 ataques principais, demais ataques/magias, idiomas/proficiências, equipamento, traços de personalidade e **Características e Habilidades no novo formato curto**.
  - Página 2: aparência, aliados/organizações, história, **continuação dos traços** em "Outras Características e Habilidades" quando não couberem na página 1, e tesouro/moedas.
  - Página 3: conjuração (classe, habilidade, CD, ataque), truques, espaços total/usados por círculo e magias por círculo com o marcador de **preparada** marcado.
- Ajuste automático do tamanho da fonte nos campos de texto longo para não cortar conteúdo.
- O PDF continua **editável** (campos não são achatados).
- O gerador antigo é mantido como **fallback** caso o modelo falhe ao carregar.

### 2.3 Ficha A4 impressa ("PDF normal")
- A coluna "Características de Classe & Talentos" de [`printPlayerSheet`](file:///c:/Users/wesle/.gemini/antigravity-ide/scratch/Planilha%20RPG/src/js/players.js#L9895) passa a usar o mesmo formato curto (nome + tag + uso + resumo), agrupado por **Classe / Raça / Talentos**, com mais espaço útil e menos texto.

### 2.4 Ficha virtual
- Os cards de traços na aba **📜 Traços** mostram o resumo curto por padrão, com a descrição completa do livro disponível ao expandir (o acordeão atual é mantido).

---

## 3. Arquivos Afetados

| Arquivo | Alteração |
|---|---|
| `src/data/trait_quick_rules.js` *(novo)* | Dicionário `TRAIT_QUICK_RULES` com resumos curados |
| `src/js/players.js` | `getPlayerTraitQuickSummary`, limpeza em `getPlayerAllFeaturesAndTraits`, novo layout da coluna de traços no A4, resumo nos cards |
| `src/js/pdf_export.js` | `fillOfficialDnd5eSheetPdf` com o modelo oficial + fallback para o gerador atual |
| `builder.js` | Embutir `trait_quick_rules.js` e o modelo `ficha.pdf` em base64 |
| `src/styles/head_css.html` | Estilos das tags (Ação/Bônus/Reação/Passivo) e uso na ficha A4 |
| `src/js/core.js` | Versão **minor** (nova funcionalidade) |
| `test_runner.js` / `test_pdf_and_print_session.js` | **Bateria 132** |
| `issues/README.md` | Registro da ISSUE-163 |

---

## 4. Impactos
- **Persistência:** nenhuma mudança no schema do `localStorage`/Firebase; os resumos são calculados na hora.
- **Tamanho da build:** +~685 KB (modelo PDF embutido em base64); de ~3,6 MB para ~4,3 MB.
- **Compatibilidade:** botões e funções de exportação existentes (`exportPlayerEditablePdf`, `printPlayerSheet`) mantêm os mesmos nomes.

---

## 5. Verificação
1. `node builder.js` e `node test_runner.js` (Bateria 132):
   - O PDF gerado carrega com **3 páginas** e os campos do modelo oficial (`Nome do Personagem`, `STR`, `AC`, `Caracteristicas e Habilidades`, `Magia0`…).
   - Valores preenchidos corretos (atributos, mods, perícias proficientes marcadas, PV, CD de magia, espaços por círculo).
   - Traços do Claker: **sem** as 3 opções de Patrono, **com** "+10 PV temporários" calculado, com tag de ação e sem duplicatas.
   - Traços longos transbordam para "Outras Características e Habilidades" sem perder conteúdo.
   - Fallback para o gerador antigo funciona se o modelo estiver ausente.
2. Verificação manual: gerar o PDF do Claker e de um não-conjurador (Deraravely) e abrir no leitor de PDF para conferir o alinhamento visual.
