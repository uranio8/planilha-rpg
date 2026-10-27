# Plano de Implementação - Ficha D&D 5E em PDF Editável com Auto-Cálculo (ISSUE-150)

## 🎯 Contexto e Objetivos

O usuário solicitou:
> *"a ficha em pdf que geramos, ela poderia depois de ser baixada, o jogador poder editar? tipo aqueles pdfs editaveis, mas vinculando a parte de modificadores para as pericias, CD e tal. Também um cálculo rapido de "tenho 18 de força" e automaticamente calcular o modificador? acho que a opção 1 é melhor"*

Atualmente, o botão de download de ficha utiliza `window.print()`, que gera uma renderização estática visual para impressão em folha A4 física.

O objetivo desta melhoria é fornecer a opção de **Baixar Ficha PDF Editável Interativa** (padrão oficial D&D 5E com *AcroForms* e scripts de cálculo embutidos). Quando o jogador abrir o PDF no Adobe Acrobat Reader, Foxit Reader ou navegadores compatíveis:
1. **Campos Editáveis**: O jogador pode clicar e alterar qualquer valor diretamente no PDF baixado.
2. **Cálculo Automático de Modificadores**: Ao digitar um valor de atributo (ex: `18` em Força), o modificador recalcula imediatamente para `+4` (fórmula: `Math.floor((valor - 10) / 2)`).
3. **Vinculação de Perícias e Salvaguardas**: Cada perícia e salvaguarda é vinculada ao modificador de atributo base correspondente, somando automaticamente o Bônus de Proficiência caso a caixinha de proficiência esteja marcada.
4. **Cálculo Automático de CD e Ataque Mágico**: A Classe de Dificuldade de Magia (`8 + Prof + Mod Conjurador`) e Bônus de Ataque Mágico (`Prof + Mod Conjurador`) recalculam em tempo real.
5. **Preenchimento Inicial Inteligente**: O PDF já é exportado preenchido com todos os dados atuais da ficha do jogador no Planilha RPG (Nome, Classe, Raça, Nível, PV, Atributos, Perícias, Equipamento, Magias).

---

## 🏗️ Arquitetura e Engenharia da Solução

### 1. Motor de Geração de PDF Interativo (Client-Side)
- O Planilha RPG opera 100% no navegador (offline-first).
- Incorporamos o motor de geração de formulários PDF (utilizando o padrão aberto `pdf-lib` via CDN com suporte autônomo), capaz de criar documentos PDF com especificações ISO-32000 (PDF Forms / AcroForm) diretamente na memória do navegador sem necessidade de backend.

### 2. Especificação dos Campos AcroForm e Scripts de Cálculo
Cada campo terá um nome padronizado D&D 5E e scripts de cálculo embutidos (Acrobat JavaScript):

* **Atributos**: `FOR`, `DES`, `CON`, `INT`, `SAB`, `CAR`
* **Modificadores (Auto-calculados)**:
  - `FOR_MOD` = `Math.floor((FOR - 10) / 2)`
  - `DES_MOD` = `Math.floor((DES - 10) / 2)`
  - `CON_MOD` = `Math.floor((CON - 10) / 2)`
  - `INT_MOD` = `Math.floor((INT - 10) / 2)`
  - `SAB_MOD` = `Math.floor((SAB - 10) / 2)`
  - `CAR_MOD` = `Math.floor((CAR - 10) / 2)`
* **Salvaguardas / Testes de Resistência**:
  - `SAV_FOR` = `FOR_MOD + (CHK_SAV_FOR ? PROF_BONUS : 0)`
  - etc. para DES, CON, INT, SAB, CAR.
* **Perícias**:
  - `SKILL_ATLETISMO` = `FOR_MOD + (CHK_ATLETISMO ? PROF_BONUS : 0)`
  - `SKILL_ACROBACIA` = `DES_MOD + (CHK_ACROBACIA ? PROF_BONUS : 0)`
  - `SKILL_PERCEPCAO` = `SAB_MOD + (CHK_PERCEPCAO ? PROF_BONUS : 0)`
  - (Todas as 18 perícias oficiais vinculadas aos respectivos atributos).
* **Percepção Passiva**:
  - `PASSIVE_PERCEPTION` = `10 + SKILL_PERCEPCAO`
* **Conjurador**:
  - `SPELL_DC` = `8 + PROF_BONUS + SPELL_CASTING_MOD`
  - `SPELL_ATTACK` = `PROF_BONUS + SPELL_CASTING_MOD`

### 3. Integração na Interface do Usuário (UI/UX)
- No **Modal de Impressão da Ficha** (`#modal-print`), adicionaremos duas opções claras de ação:
  1. 🖨️ **Imprimir em Papel / A4 Estilizado**: Mantém o fluxo visual customizado da arte nobre A4 do Planilha RPG.
  2. 📥 **Baixar Ficha PDF Editável (Auto-Cálculo)**: Gera e faz o download imediato do arquivo `.pdf` interativo nomeado (ex: `Ficha_DND5E_Aragorn.pdf`).
- Na listagem de personagens e no painel do jogador, inclusão de atalho rápido direto para baixar o PDF editável com 1 clique.

---

## 🛠️ Arquivos e Módulos Afetados

1. **`src/ui/ui.html`**:
   - Inclusão dos botões de ação "📄 Baixar PDF Editável" no cabeçalho do `#modal-print` e nas ações de ferramentas do jogador.
2. **`src/js/players.js`**:
   - Função `exportEditablePlayerPdf(playerId)`: coleta os dados do jogador (`PLAYERS.find(p => p.id === playerId)`), calcula os valores iniciais e chama o gerador do documento PDF com os campos AcroForm e scripts de cálculo acoplados.
   - Integração com a UI e atalhos de clique.
3. **`builder.js`**:
   - Inclusão do script auxiliar `pdf-lib` no `<head>` de `planilha do rpg.html` e `index.html`.
4. **`test_runner.js`**:
   - **Bateria 119**:
     - Validação da existência da função `exportEditablePlayerPdf`.
     - Validação do mapeamento correto dos atributos, modificadores e fórmulas das 18 perícias.
     - Validação de que valores vazios ou não definidos no jogador não quebram a geração.
     - Validação da preservação de todos os 2091+ testes anteriores.
5. **`issues/README.md`**:
   - Registro da **ISSUE-150** com escopo, arquivos alterados e critérios de verificação.

---

## 🔒 Impacto em Persistência e Compatibilidade

- **Persistência (`localStorage`)**: Nenhuma alteração estrutural no schema existente (`dnd_tracker_players_v3`), compatibilidade total retroativa garantida.
- **Sincronização / Combate**: Zero impacto colateral no combate ou grid VTT.
- **Leitores de PDF suportados**: Adobe Acrobat Reader (Desktop/Mobile), Foxit Reader, Google Chrome, Microsoft Edge e visualizadores PDF modernos.

---

## 📋 Critérios de Aceite

1. O usuário clica em "Baixar Ficha PDF Editável" e recebe um arquivo `.pdf` salvo diretamente no computador/celular.
2. Ao abrir o PDF em um leitor de PDF (ex: Adobe Reader ou navegador):
   - Os campos de texto (Nome, Classe, Nível, Pontos de Vida, Equipamentos, Magias) estão liberados para digitação.
   - Ao alterar o valor de **Força** de 10 para 18, o modificador de Força atualiza automaticamente para **+4**.
   - As perícias vinculadas (como Atletismo) atualizam seu valor automaticamente com base no novo modificador.
3. Suíte de testes automatizados executada via `node test_runner.js` com 100% de sucesso.
4. Compilação executada via `node builder.js` sem falhas.

---

## ✅ Status de Execução

- [x] Motor client-side de geração PDF com AcroForms implementado em `src/js/pdf_export.js`.
- [x] Fórmulas e scripts de auto-cálculo Acrobat JS embutidos para Modificadores, Salvaguardas, Perícias e CD de Magia.
- [x] Ordem oficial de cálculo (`/CO`) registrada no catálogo do formulário PDF.
- [x] Botão de ação `[📄 Baixar PDF Editável (Auto-Cálculo)]` adicionado no modal de impressão em `src/ui/ui.html`.
- [x] Integração de compilação em `builder.js` incluindo `pdf-lib` e `pdf_export.js`.
- [x] Compilação executada via `node builder.js` gerando `planilha do rpg.html` e `index.html`.
- [x] Bateria 119 de testes automatizados adicionada em `test_runner.js` (2114/2114 testes aprovados - 100% de sucesso).
- [x] Registro efetuado no Quadro Geral de Issues em `issues/README.md` (ISSUE-150).

