# 📋 Plano de Implementação: Sincronização Completa entre Ficha Virtual, Ficha Impressa A4 e PDF Editável (ISSUE-153)

Este plano atende à auditoria de divergências identificadas entre a **Ficha Virtual** (painel do jogador/mestre), a **Ficha Impressa A4** (`printPlayerSheet`) e o **PDF Editável com AcroForms** (`generateEditableDnd5ePdf`), garantindo que tanto o **Mestre** quanto o **Jogador** tenham fidelidade total de dados e regras D&D 5E em todas as saídas de impressão e download.

---

## 🎯 Escopo das Alterações e Módulos Afetados

### 1. `src/js/pdf_export.js` (Exportação PDF Editável Oficial D&D 5E)
- **Normalização Robusta de Perícias (Resolução de Bug Crítico)**:
  - Expandir o mapeamento de perícias em `DND_SKILLS_MAPPING` e no verificador de proficiências `isProf` para suportar aliases canônicos em português e inglês:
    - `animalHandling` ⇄ `adestramento`, `adestrar animais`
    - `deception` ⇄ `enganacao`, `enganação`, `blefar`
    - `sleightOfHand` ⇄ `prestidigitacao`, `prestidigitação`
    - Normalizador de strings (remover acentos, pontuações e caixa baixa) para prevenir falhas de correspondência em qualquer origem de dados.
- **Sincronização de Salvaguardas Contra a Morte (Death Saves)**:
  - Pré-marcar os checkboxes `DeathSave_S1..S3` e `DeathSave_F1..F3` com base no estado atual de `p.deathSaves` (`p.deathSaves.success` e `p.deathSaves.fail`).
- **Dados de Vida Gastos vs Totais**:
  - Exibir no campo `Hit_Dice` tanto a fórmula/total (`p.hitDice || '4d10'`) quanto os dados disponíveis se houver dados gastos (`p.spentHitDice`), no formato: `4d10 (Disp: 2/4)`.
- **Sentidos Passivos para o Mestre**:
  - Adicionar campos AcroForm e rótulos para **Investigação Passiva** (10 + INT) e **Intuição Passiva** (10 + SAB), além da já existente **Percepção Passiva**.
- **Multiclasse e Subclasse no Cabeçalho**:
  - Utilizar a descrição completa de multiclasse (`p.multiclass` ou formatação composta `Guerreiro 3 / Mago 1 (Nv 4)`) no campo `ClassLevel`.
- **Rastreador de Espaços de Magia (Spell Slots 1º ao 9º nível)**:
  - Adicionar campos AcroForm para Total e Gastos de cada círculo de magia (`Slot_Lvl_X_Total`, `Slot_Lvl_X_Used`) na Página 2 do PDF, permitindo que o conjurador acompanhe seus slots diretamente no Adobe Reader ou Foxit.
- **Condições Ativas**:
  - Pré-carregar na área de anotações/status as condições ativas na sessão (`p.conditions`, ex: *Envenenado*, *Incapacitado*).

### 2. `src/js/players.js` (Ficha Impressa A4 `printPlayerSheet`)
- **Salvaguardas Contra a Morte Dinâmicas**:
  - Preencher dinamicamente os círculos de sucessos e falhas (`● ● ○`) com base em `p.deathSaves.success` e `p.deathSaves.fail`, em vez de manter círculos fixos vazios.
- **Dados de Vida Atuais**:
  - Exibir claramente os dados disponíveis vs totais (`Total: 4 dados | Restantes: 2`).
- **Sentidos Passivos Completos**:
  - Exibir na coluna esquerda os 3 sentidos passivos do D&D 5E:
    - Percepção Passiva (10 + Sab + Prof se proficiente)
    - Investigação Passiva (10 + Int + Prof se proficiente)
    - Intuição Passiva (10 + Sab + Prof se proficiente)
- **Círculos Visuais de Espaços de Magia**:
  - Renderizar para cada círculo de magia os marcadores visuais de slots disponíveis (`○`) e gastos (`●`), facilitando a marcação a lápis ou visualização do estado atual da mesa.
- **Multiclasse e Condições Ativas**:
  - Refletir multiclasse completa e exibir banner discreto de condições ativas (ex: `⚠️ Condições Ativas: Envenenado`) caso o herói esteja sob efeito de algum status.

### 3. `src/styles/head_css.html` (Estilos A4)
- Estilizar os blocos de sentidos passivos múltiplos e círculos de dados de vida/slots de magia para garantir diagramação limpa, preservando a quebra perfeita em **exatamente 2 páginas A4**.

---

## 🧪 Estratégia de Verificação e Testes Automatizados

1. **Testes E2E Automatizados (`test_pdf_and_print_session.js`)**:
   - Validar personagem com `adestramento` e `enganacao`: verificar se o PDF editável gerado marca com `true` os checkboxes correspondentes.
   - Validar personagem ferido com `deathSaves = { success: 2, fail: 1 }` e `spentHitDice = 2`: verificar se os checkboxes e círculos do A4 e PDF refletem exatamente 2 sucessos, 1 falha e 2 dados gastos.
   - Validar conjurador com magias gastas: verificar renderização dos marcadores de slots.
   - Validar presença dos sentidos passivos (Percepção, Investigação e Intuição).
2. **Nova Bateria 122 em `test_runner.js`**:
   - Garantir 100% de aprovação de toda a suíte de testes.
3. **Build e Verificação Final**:
   - Executar `node builder.js` e validar bundle `planilha do rpg.html`.

---

## 🔒 Critérios de Aceite

- [ ] Checkboxes de perícias no PDF editável reconhecem todas as formas de chaves (`adestramento`, `enganacao`, `animalHandling`, etc.) e marcam corretamente com proficiência e bônus calculado.
- [ ] O PDF editável e a folha impressa A4 preenchem as Salvaguardas Contra a Morte com base em `p.deathSaves`.
- [ ] Ambos os modelos exibem os 3 Sentidos Passivos essenciais para o Mestre (Percepção, Investigação e Intuição).
- [ ] Ambos os modelos exibem os Dados de Vida disponíveis vs gastos e rastreadores de Espaços de Magia.
- [ ] Multiclasse e condições ativas refletem com precisão o estado da Ficha Virtual.
- [ ] 100% dos testes aprovados em `node test_runner.js`.
