# 📋 Plano de Implementação: Correção de Seleção Recorrente de Subclasses, Sistema de Aumento no Valor de Atributo (ASI / D&D 5E) e Preservação de Estado

Este plano detalha o diagnóstico completo, as causas raízes e as soluções para:
1. **Eliminar a necessidade de re-escolher a subclasse repetidas vezes** (garantindo que escolhas já feitas com base na evolução da classe permaneçam salvas e não sejam sobrescritas em subidas de nível ou edição de fichas).
2. **Implementar o Sistema de Aumento no Valor de Atributo (ASI / D&D 5E)** nos níveis canônicos de cada classe no Assistente de Evolução de Nível, com seleção interativa (+2 em um atributo, +1 em dois atributos, ou Talento).
3. **Respeito aos Atributos Atuais de Fichas Nv 4+**: Conforme diretriz do usuário, as fichas que já foram criadas e estão no nível 4 ou superior **já tiveram seus atributos aumentados manualmente** pelo mestre. Portanto, o sistema **não** aplicará nenhum aumento retroativo automático para não duplicar os valores existentes. O fluxo interativo de ASI funcionará quando as demais fichas evoluírem para o nível 4 e em todas as futuras subidas de nível nos marcos de ASI (4, 6, 8, 10, 12, etc.).
4. **Mapear e corrigir todos os outros pontos do sistema onde ocorrem falhas semelhantes** (modal de edição da ficha, sincronização na nuvem Firebase e gerenciador de multiclasse).

---

## 🔍 1. Diagnóstico Profundo dos Problemas

### 1.1 Por que a subclasse precisava ser escolhida novamente?
Investigamos o ciclo de vida da subclasse nos arquivos `src/js/players.js`, `src/js/firebase_sync.js`, `src/js/core.js` e `src/ui/ui.html`. Foram identificadas **três causas raízes críticas combinadas**:

1. **Condição Incorreta no Assistente de Level Up (`renderLevelUpWizardStep`, Passo 2)**:
   - O código verificava: `if (targetLvl >= reqSubLvl && clsData && clsData.subclasses)`.
   - Como `targetLvl >= reqSubLvl` é verdadeiro para **todos os níveis a partir do nível de desbloqueio** (ex: Nv 3, Nv 4, Nv 5, Nv 6...), o seletor `<select onchange="selectLevelUpSubclass(...)">` era exibido **em todas as subidas de nível**.
   - Em D&D 5E, a subclasse é escolhida **uma única vez** no nível de desbloqueio (`reqSubLvl`):
     - Clérigo, Bruxo, Feiticeiro: Nível 1.
     - Druida, Mago: Nível 2.
     - Bárbaro, Bardo, Guerreiro, Ladino, Monge, Paladino, Patrulheiro: Nível 3.
   - Pior: o estado inicial da subclasse no assistente era populado com `levelUpWizardState.selectedSubclassIdx = primaryClass.subclassIdx || 0`. Se o personagem tinha subclasse armazenada como texto (ex: `p.subclass = 'Mestre da Batalha'`) ou se `subclassIdx` vinha nulo/indefinido, o assistente **revertia silenciosamente para o índice 0 (ex: 'Campeão')**, forçando o usuário a re-selecionar ou sobrescrevendo sua especialização original!

2. **Sobrescrita Acidental no Modal de Edição da Ficha (`savePlayerSheet` & `onPlayerModalClassOrLevelChange`)**:
   - Em `openPlayerModal`, se o personagem possui multiclasse ou formato `"Guerreiro 4 / Bárbaro 1"`, o dropdown `pm-class-select` era definido como `'custom'`.
   - `onPlayerModalClassOrLevelChange` buscava `findClassData("Guerreiro 4 / Bárbaro 1")`, que retornava `null`.
   - Como consequência, o seletor `pm-subclass-select` era limpo para `<option value="0">Padrão / Sem Subclasse</option>` e desabilitado (`disabled`).
   - Ao clicar em "Salvar Ficha", `savePlayerSheet` lia `parseInt(subclassSel.value) || 0`, **gravando `subclassIdx = 0` na ficha**, corrompendo a subclasse existente.

3. **Vulnerabilidade no Smart Merge de Sincronização na Nuvem (`firebase_sync.js`)**:
   - Em `applyCloudDataToLocal`, o objeto de mesclagem do jogador (`Object.assign({}, remoteP, { ... })`) **não continha proteções explícitas para `subclass` nem `subclassIdx`**.
   - Se um snapshot remoto continha dados de subclasse vazios ou índice defasado, ele sobrescrevia a escolha local do jogador.

---

### 1.2 Por que os níveis com Aumento de Atributo (ASI) não mostram a opção de upgrade?
- Em D&D 5E, o **Aumento no Valor de Atributo (Ability Score Improvement - ASI)** é concedido nos seguintes níveis de classe:
  - **Guerreiro**: Níveis **4, 6, 8, 12, 14, 16, 19**
  - **Ladino**: Níveis **4, 8, 10, 12, 16, 19**
  - **Demais Classes**: Níveis **4, 8, 12, 16, 19**
- No código atual de `renderLevelUpWizardStep`:
  - **Não existia interface nem lógica de seleção de atributos**.
  - O assistente apenas listava o texto plano `"Aumento no Valor de Atributo"` na prévia de características.
  - Ao confirmar a subida de nível em `applyLevelUpConfirm`, nenhum ponto de atributo era acrescido à ficha (`p.str`, `p.dex`, `p.con`, `p.int`, `p.wis`, `p.cha` permaneciam intocados).
  - Bônus decorrentes de aumento de Constituição (regra oficial D&D 5E: se o mod de CON aumenta, o PV Máximo aumenta retroativamente em $+1$ por nível) também não eram calculados.

---

### 1.3 Outras funções do sistema que apresentam o mesmo problema mapeado
1. **`getPlayerClassesList(p)`**: Retornava apenas `className` e `level`, sem resolver ou associar o nome canônico `subclass`.
2. **`openPlayerClassesModal` / `savePlayerClassesModal`**: Ao alterar níveis de classes no gerenciador de multiclasse, a correspondência entre nome de subclasse e índice numérico dependia de ordenação estrita.
3. **`core.js` (Auto-migração no carregamento)**: Ao sincronizar dados legados com a lista canônica, a subclasse pré-existente podia ser sobrescrita por registros canônicos caso `canonical` tivesse campos vazios.

---

## 🛠️ 2. Arquitetura da Solução

### 2.1 Preservação Definitiva de Subclasses (Zero Re-seleção)
1. **Criar Helper Universal de Resolução de Subclasse (`resolveSubclassIndex`)**:
   - `resolveSubclassIndex(className, subclassIdx, subclassName)`:
     - Localiza a classe em `CLASSES_DATA`.
     - Se `subclassName` estiver preenchido, localiza o índice exato pelo nome (ignorando maiúsculas/minúsculas e variações em inglês/português, ex: `"Campeão (Champion)"`).
     - Garante que o índice numérico seja sempre fidedigno ao nome da especialização.
2. **Refatorar o Passo 2 do Assistente de Level Up (`renderLevelUpWizardStep`)**:
   - Identificar se a classe evoluída já possui uma subclasse registrada (`currentSubclassName` ou `existingClassItem.subclass`).
   - **Caso 1: Nível inferior ao desbloqueio (`targetLvl < reqSubLvl`)**: Não exibe seleção de subclasse.
   - **Caso 2: Nível exato de desbloqueio (`targetLvl === reqSubLvl`) OU classe sem subclasse definida**:
     - Exibe o seletor interativo com destaque: `🌟 Escolha sua Especialização / Subclasse (Desbloqueada no Nível ${reqSubLvl})`.
   - **Caso 3: Nível superior ao desbloqueio (`targetLvl > reqSubLvl`) e subclasse já escolhida anteriormente**:
     - **NÃO EXIBE O SELETOR DE ESCOLHA**.
     - Exibe um card elegante e seguro:
       `🌟 Subclasse Ativa: ${subName} (Especialização do Nível ${reqSubLvl})`
       com um botão discreto `[🔄 Alterar Subclasse]` caso o mestre/jogador deseje propositalmente realizar um *respec*.
3. **Persistência Completa em `applyLevelUpConfirm`**:
   - Salva `subclass: subName` e `subclassIdx: subIdx` tanto no item correspondente em `p.multiclass` quanto no nível raiz da ficha (`p.subclass` e `p.subclassIdx`).
4. **Proteção no Modal da Ficha (`savePlayerSheet` & `onPlayerModalClassOrLevelChange`)**:
   - Se `subclassSel` estiver desabilitado ou se a classe for multiclasse/customizada, preserva incondicionalmente `existing.subclass` e `existing.subclassIdx`.
5. **Proteção no Smart Merge (`firebase_sync.js`)**:
   - Inclui `subclass`, `subclassIdx` e os atributos `str, dex, con, int, wis, cha` no objeto de propriedades protegidas contra snapshots remotos atrasados.

---

### 2.2 Sistema Completo de Aumento de Atributos (ASI) no Level Up
1. **Diretriz de Segurança para Fichas Existentes**:
   - **Zero Alteração Automática nas Fichas Nv 4+ Existentes**: Como o mestre já ajustou os atributos dessas fichas manualmente, nenhuma rotina automática irá re-alterar seus atributos ao carregar o aplicativo.
   - O fluxo de ASI é acionado exclusivamente quando o personagem sobe de nível através do Assistente de Evolução (seja subindo para o Nv 4 ou em futuros marcos de ASI como 6, 8, 10, 12, etc.).
2. **Função Mecânica Canônica D&D 5E (`isClassAsiLevel`)**:
   ```javascript
   function isClassAsiLevel(className, classLevel) {
     const norm = (className || '').toLowerCase();
     if (norm.includes('guerreiro') || norm.includes('fighter')) {
       return [4, 6, 8, 12, 14, 16, 19].includes(classLevel);
     }
     if (norm.includes('ladino') || norm.includes('rogue')) {
       return [4, 8, 10, 12, 16, 19].includes(classLevel);
     }
     return [4, 8, 12, 16, 19].includes(classLevel);
   }
   ```
3. **Interface Interativa de ASI no Passo 2 do Level Up**:
   - Quando `isClassAsiLevel(selectedClass, targetClassLevel)` for verdadeiro, renderizar o card `.levelup-asi-card`:
     - **Opção 1: +2 em um único Atributo**:
       - Botões/pills para: Força, Destreza, Constituição, Inteligência, Sabedoria, Carisma.
       - Prévia visual em tempo real: ex. `💪 Força: 16 (Mod +3) ➔ 18 (Mod +4)`.
     - **Opção 2: +1 em dois Atributos distintos**:
       - Seletores para Atributo 1 e Atributo 2 (impedindo selecionar o mesmo).
       - Prévia visual em tempo real: ex. `🎯 Destreza: 14 (+2) ➔ 15 (+2)` e `🛡️ Constituição: 15 (+2) ➔ 16 (+3)`.
     - **Opção 3: Talento D&D 5E (Feat)**:
       - Dropdown com talentos clássicos (Robustez, Sentinela, Atirador Aguçado, Especialista, etc.) ou digitação livre.
4. **Execução e Bônus Retroativos em `applyLevelUpConfirm`**:
   - Aplica os acréscimos aos atributos numéricos da ficha (`p.str`, `p.dex`, etc.).
   - **Regra Oficial de Constituição**: Se o modificador de CON aumentar, aplica automaticamente o ganho retroativo de PV:
     $$\Delta \text{PV} = (\text{novoModCON} - \text{antigoModCON}) \times \text{nívelTotal}$$
     acrescentando aos PVs máximos e atuais do herói.
   - **Regra de Destreza/Armadura**: Se DES ou CON aumentarem, dispara `ensurePlayerCalculatedAc(p)` para atualizar a CA da ficha.
   - Registra no log de ações e no log geral: `📈 ${p.name} aprimorou seus atributos: Força 16 ➔ 18 (+2)`.

---

## 📁 3. Arquivos e Módulos Afetados

| Arquivo | Modificações Planejadas |
|---|---|
| `src/js/players.js` | Implementação de `isClassAsiLevel`, `resolveSubclassIndex`, renderização interativa do ASI e card de subclasse ativa no Passo 2 do Level Up, aplicação dos atributos no `applyLevelUpConfirm` com PV retroativo de CON, e proteção no `savePlayerSheet`. |
| `src/styles/head_css.html` | Estilos visuais dark fantasy para `.levelup-asi-card`, `.subclass-locked-card`, seletores de atributos e prévias de modificadores. |
| `src/js/firebase_sync.js` | Proteção explícita de `subclass`, `subclassIdx` e dos 6 atributos (`str, dex, con, int, wis, cha`) no Smart Merge. |
| `src/js/core.js` | Garantia de integridade da subclasse na auto-migração de `loadFromLocalStorage` (sem tocar nos atributos já customizados). |
| `test_runner.js` | Adição da Suíte 73 com testes automatizados para validação de retenção de subclasse, ativação do ASI nos níveis corretos de guerreiro/ladino/outros, cálculo de atributos e PV retroativo. |
| `issues/README.md` | Documentação formal da ISSUE-104. |

---

## 🧪 4. Estratégia de Verificação e Testes

1. **Testes Automatizados (`node test_runner.js`) - Suíte 73**:
   - Validar que um guerreiro Nv 3 com subclasse "Campeão" ao subir para o Nv 4 **NÃO** exibe o dropdown de escolha e mantém a subclasse.
   - Validar que o Nível 4 ativa o card de ASI para todas as classes, Nível 6 ativa para Guerreiro, Nível 10 ativa para Ladino, etc.
   - Validar aplicação da opção $+2$ (ex: Força de 16 para 18).
   - Validar aplicação da opção $+1/+1$ (ex: DES de 14 para 15 e CON de 15 para 16).
   - Validar recálculo retroativo de PV ao aumentar CON.
   - Validar que salvar a ficha via modal não corrompe a subclasse de personagens multiclasse.
   - Validar que fichas existentes Nv 4+ carregam preservando exatamente os atributos customizados pelo mestre.
2. **Compilação**:
   - `node builder.js`
3. **Taxa de Sucesso Alvo**: 100% dos testes aprovados (mínimo 1195+ testes).
