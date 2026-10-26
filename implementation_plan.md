# 📋 Plano de Implementação: Cards de Aumento de Habilidade / Talento (ASI) por Nível e Escolhas Individualizadas (ISSUE-143)

## 📌 Contexto & Diagnóstico

O usuário relatou:
> *"nos traços, não está mostrando o 'aprimorar habilidade ou talento' do lv 4, está como se fosse geral, ai no lv 8 ele n conseguirar adicionar +2 em outro, pq vai ficar bugando, vamos deixar como se fosse uma escolha q ele pudesse fazer nos niveis indicados em cada classe"*

### Causa-Raiz Técnica:
1. **Ausência nos Traços Desbloqueados**:
   - Em `CLASSES_DATA` (`src/data/classes.js`), as tabelas de progressão indicam "Aumento no Valor de Atributo" no 4º, 8º, 12º, 16º e 19º níveis (e 6º/14º para Guerreiro e 10º para Ladino). No entanto, o array `features` de cada classe não continha objetos para esses marcos.
   - Como resultado, `getUnlockedClassFeatures` e `renderPlayerUnlockedFeatures` nunca renderizavam o card de ASI na aba de Características/Traços da Ficha.
2. **Falta de Isolamento por Marco de Nível**:
   - `saveAsiChoiceModal` aplicava aumentos diretamente nos atributos do herói (`p.str += 2`) ou concedia talentos, mas **não registrava a qual marco de nível aquela escolha pertencia**.
   - Ao atingir o Nível 8, o jogador não tinha como saber o que já havia escolhido no Nível 4, nem conseguia fazer outra escolha independente sem conflito ou descontrole histórico.

---

## 🎯 Objetivos da Implementação

1. **Injeção Canônica de ASI nos Traços Desbloqueados (`getUnlockedClassFeatures`)**:
   - Cruzar os níveis de ASI de cada classe via `getClassAsiLevels(className)`.
   - Gerar dinamicamente para cada marco atingido ($\le \text{nível da classe}$) uma característica oficial:
     - Exemplo: `Aumento no Valor de Habilidade ou Talento (4º Nível)`.
2. **Card Interativo de Escolha de ASI (`renderPlayerUnlockedFeatures`)**:
   - Renderizar no card da habilidade um box temático interativo (`.feature-asi-box`), similar ao box marcial de *Estilo de Luta*:
     - **Status Pendente**: `⚠️ Escolha Pendente (Nível 4)` com botão chamativo `[📈 Escolher Atributo ou Talento]`.
     - **Status Concluído**: `✅ Escolhido: +2 em Força` ou `✅ Escolhido: Talento "Alerta"` com botão `[✏️ Alterar Escolha]`.
3. **Mecanismo de Escolha Individualizada por Marco (`p.asiChoices`)**:
   - Estrutura de dados persistente no herói:
     ```javascript
     p.asiChoices = {
       "guerreiro_lvl_4": { type: "stats", distType: "single", stat1: "str", gain1: 2, label: "+2 em Força", level: 4, classKey: "guerreiro" },
       "guerreiro_lvl_6": { type: "feat", featId: "alerta", featName: "Alerta", label: "Talento: Alerta", level: 6, classKey: "guerreiro" },
       "guerreiro_lvl_8": { type: "stats", distType: "dual", stat1: "con", stat2: "dex", gain1: 1, gain2: 1, label: "+1 em Constituição, +1 em Destreza", level: 8, classKey: "guerreiro" }
     };
     ```
   - Ao alterar uma escolha existente em um nível específico, reverter cirurgicamente os atributos ou o talento daquele nível antes de aplicar a nova escolha, **sem afetar os demais níveis**.
4. **Preservação e Sincronização**:
   - Garantir que `p.asiChoices` seja retido em `savePlayerSheet()` e transmitido via Firebase / LocalStorage.

---

## 🛠️ Arquivos e Módulos Afetados

| Arquivo | Modificações Planejadas |
|---|---|
| `src/js/players.js` | Injeção dinâmica de ASI em `getUnlockedClassFeatures`; formatação em `formatPlayerFeatureForDisplay`; renderização interativa em `renderPlayerUnlockedFeatures`; vinculação atômica por marco em `openAsiChoiceModal` e `saveAsiChoiceModal`; reversão segura ao editar; retenção em `savePlayerSheet`. |
| `src/styles/head_css.html` | Estilos para `.feature-asi-box`, `.feature-asi-header`, `.feature-asi-status-badge`, `.feature-asi-btn` e micro-animações. |
| `test_runner.js` | Bateria 111 de testes automatizados validando presença dos cards de ASI nos níveis indicados, isolamento de escolhas no Nv 4 e Nv 8, e reversão segura. |
| `issues/README.md` | Registro oficial da ISSUE-143. |

---

## 🧪 Estratégia de Testes Automatizados (Bateria 111)

1. Validação de que `getUnlockedClassFeatures` inclui ASI no nível 4 para qualquer classe.
2. Validação de que Guerreiro possui ASI no nível 4 e 6, e Ladino no nível 4, 8 e 10.
3. Validação de renderização do card com botão de escolha interativa quando a escolha estiver pendente.
4. Escolha de +2 em Força no nível 4 registrada em `p.asiChoices['guerreiro_lvl_4']`.
5. Escolha de +2 em Constituição no nível 8 registrada em `p.asiChoices['guerreiro_lvl_8']`, preservando ambos os aumentos independentemente.
6. Alteração da escolha do nível 4 (troca de +2 FOR para Talento "Alerta"), revertendo os 2 pontos de Força sem mexer na Constituição do nível 8.
7. Preservação de `p.asiChoices` em `savePlayerSheet()`.

---

## 📋 Checklist de Entrega

- [ ] Aprovação do usuário deste plano de implementação (`implementation_plan.md`).
- [ ] Implementação das funções e renderizadores em `src/js/players.js`.
- [ ] Implementação dos estilos visuais em `src/styles/head_css.html`.
- [ ] Compilação com `node builder.js`.
- [ ] Execução da suíte completa de testes (`node test_runner.js`), garantindo 100% dos testes verdes.
- [ ] Registro em `issues/README.md`.
- [ ] Commit semântico e `git push origin main`.
