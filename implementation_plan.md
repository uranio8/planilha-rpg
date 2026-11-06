# 📋 Plano de Implementação: Resolução Definitiva de Páginas A4 na Impressão/PDF (ISSUE-178)

## 📌 Contexto & Diagnóstico dos Problemas Relatados

O usuário reportou:
> *"piorou a questão do arquivo gerado, verifique pois agora está é com 4 páginas, fora outros problemas"*

### 🔍 Diagnóstico Detalhado:

1. **Por que o arquivo gerado passou para 4 páginas no Chrome Print ("Salvar como PDF")?**
   * Ao imprimir no Google Chrome, as configurações padrão do diálogo de impressão são:
     * `Margens`: **Padrão** (adiciona ~12mm no topo, rodapé, esquerda e direita).
     * `Opções`: `[x] Cabeçalhos e rodapés` (reserva ~15mm no topo para data/título e ~15mm no rodapé para URL).
   * A folha física A4 tem 297mm de altura e 210mm de largura. Com as margens e cabeçalhos padrão do Chrome, a área útil imprimível é de apenas **~186mm de largura × ~245mm de altura**.
   * No commit anterior, `.a4-print-page` foi fixada em `width: 210mm` e `height: 297mm`.
   * Como 297mm excede 245mm em mais de 50mm, o Chrome renderizou os primeiros 245mm da Página 1 na Folha 1 e transbordou os 52mm restantes para a Folha 2. Em seguida, a Página 2 (também de 297mm) renderizou 245mm na Folha 3 e transbordou seus 52mm restantes para a Folha 4.
   * **Resultado**: Exatamente **4 páginas**, com quebras no meio das tabelas e partes inferiores flutuando no topo de páginas extras.
   * Além disso, `width: 210mm` em uma área útil de 186mm gerou overflow horizontal de 24mm, cortando a borda direita da folha.

2. **Diagnóstico dos "Outros Problemas" Revelados pela Auditoria:**
   * **Equipamentos listados como Magias (Deraravely)**: No banco inicial `DEFAULT_PLAYERS`, o campo `spells` de Deraravely continha `"Armadura de Cota de Malha, Escudo, Mochila"`. Por isso, na Página 2 sob "Grimório & Magias Conhecidas", apareciam Cota de Malha e Mochila como se fossem feitiços.
   * **Atributos de Conjuração Falsos para Não-Conjuradores**: Para classes marciais puras (como Guerreiro/Bárbaro com INT 15), o código assumia `spellAttrKey = 'int'` por padrão e calculava `Habilidade Chave: INT`, `CD Resistência: 13`, `Bônus de Ataque: +5`, exibindo dados de conjuração para quem não possui magia.
   * **Tabela de Espaços de Magia Vazia na Página 1**: Guerreiros e Bárbaros sem espaços de magia ainda geravam o container de spell slots ("Nv 1: — | Nv 2: — | Nv 3: —"), ocupando espaço vertical valioso que empurrava as características de classe para baixo.
   * **Texto do Diário/Grimório transbordando sobre o Rodapé na Página 2**: As larguras fixas `56mm 66mm 1fr` espremiam a coluna 3 quando a folha sofria contração de margens no Chrome, forçando quebras excessivas de linha que invadiam o rodapé.
   * **Duplicação de Nível no PDF Editável (AcroForm)**: `ClassLevel` concatenava `charLevel` ao final de `charClass` mesmo quando este já continha os níveis (ex: `"Guerreiro 4 / Bárbaro 1 5"`).

---

## 🎯 Objetivos da Modificação

1. **Garantir Paginação Estrita em Exatamente 2 Páginas em Qualquer Navegador / Configuração de Impressão**:
   * O layout A4 deve caber confortavelmente na área útil do Chrome com `Margens: Padrão` e `Cabeçalhos e rodapés` ativados (~248mm de altura máxima e ~184mm de largura máxima), sem transbordar para uma 3ª ou 4ª folha.
   * Com `Margens: Nenhuma`, o layout manterá margens brancas elegantes e continuará em exatamente 2 páginas.
2. **Correção dos Dados Canônicos e Supressão de Magias para Não-Conjuradores**:
   * Limpar o campo `spells` de Deraravely e adicionar auto-higienização retroativa no `loadFromLocalStorage()`.
   * Em `printPlayerSheet()`, se o personagem for puramente marcial sem capacidade de conjuração, exibir `Habilidade Chave: — | CD: — | Ataque Mágico: —` e a indicação `Personagem marcial (sem conjuração de magias)` no Grimório, sem gerar espaços de magia na Página 1.
3. **Prevenção de Transbordo de Texto sobre Rodapés na Página 2**:
   * Usar colunas fluidas (`29% 34% 37%` ou `52mm 62mm 1fr`) com `gap: 3.5mm` e `overflow: hidden; flex: 1; min-height: 0;` em `.a4-page2-columns`, garantindo que o Diário de Missões e o Grimório nunca toquem ou colidam com o rodapé.
4. **Correção de Duplicação de Nível no PDF Editável**:
   * Sanitizar a formatação de `ClassLevel` em `src/js/pdf_export.js`.

---

## 📁 Arquivos e Módulos Afetados

| Arquivo | Componente / Responsabilidade |
|---|---|
| `src/styles/head_css.html` | Regras `@media print` e dimensões de `.a4-print-page`, `@page { margin: 6mm 8mm; }`, contenção estrita em `max-height: 248mm; max-width: 184mm;` e colunas fluidas |
| `src/js/players.js` | Função `printPlayerSheet()`: verificação estrita de conjuradores, exibição contextual de atributos de magia, higienização de spells para marciais e diagramação compacta |
| `src/js/core.js` | Correção em `DEFAULT_PLAYERS` (Deraravely `spells: ""`) e auto-migração defensiva em `loadFromLocalStorage()` |
| `src/js/pdf_export.js` | Correção na formatação de `ClassLevel` para multiclasse sem duplicar o nível |
| `issues/README.md` | Registro formal da ISSUE-178 |

---

## ⚠️ Possíveis Impactos & Riscos Mitigados

* **Persistência (`localStorage`)**: Totalmente seguro. Apenas limpa a string de equipamento indevidamente gravada no campo `spells` de fichas legadas do Deraravely via auto-migração não-destrutiva.
* **Combate e VTT Grid**: Nenhum impacto negativo.
* **Suíte de Testes**: As asserções existentes de `test_runner.js` (como Bateria 121 e Baterias de A4) serão preservadas e validadas.

---

## 🧪 Estratégia de Verificação Automatizada e Manual

1. **Automatizada**:
   * Compilação com `node builder.js`.
   * Execução de `node test_runner.js` garantindo 100% de sucesso (todas as 2.716+ asserções).
   * Script de validação que simula a renderização de `printPlayerSheet` para todos os 9 heróis padrão e calcula a altura/largura e estrutura das 2 páginas.
2. **Manual**:
   * Teste no navegador Google Chrome via `window.print()` e visualização no `#modal-print` verificando:
     * Deraravely: Exatamente 2 páginas, sem 3ª ou 4ª folha, sem equipamentos no Grimório e sem dados falsos de conjuração.
     * Arkhalis: Exatamente 2 páginas.
     * Nenhum corte lateral ou transbordo sobre rodapé.

---

> ⚠️ **Aguardando aprovação explícita do usuário conforme a Regra 1 de `AGENTS.md` para iniciar as alterações no código sob `src/`.**
