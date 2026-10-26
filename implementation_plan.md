# 📋 Plano de Implementação - ISSUE-142: Discriminação de Atributos Base, Bônus Raciais Automáticos e Valor Final no Modal de Personagem

---

## 🎯 1. Contexto e Objetivo

O usuário solicitou um aprimoramento na aba/modal de criação de personagem:
> *"na aba de criação de personagem podemos manter os valores tirados do dado e embaixo ficaria o valor final, indicando onde teria o bonus de raça por exemplo e outras cateracteristicas de classe."*

Atualmente, o modal possui apenas um campo direto por atributo (`pm-str`, `pm-dex`, etc.), onde o usuário precisa calcular de cabeça a soma dos bônus raciais (ex: Draconato ganha +2 Força e +1 Carisma). Isso causa dúvidas sobre onde os bônus raciais foram aplicados e se os valores inseridos já continham ou não os bônus.

---

## 🛠️ 2. Arquitetura da Solução

### A. Mapeamento Canônico de Bônus Raciais (`getRacialAbilityBonuses(raceName)`)
Criar uma função utilitária em `src/js/players.js` que identifica a raça selecionada e retorna os bônus de habilidade oficiais D&D 5E:
* **Draconato (*Dragonborn*)**: `+2 Força`, `+1 Carisma`
* **Anão (*Dwarf*)**: `+2 Constituição` (Montanha: `+2 Força`; Colina: `+1 Sabedoria`)
* **Elfo (*Elf*)**: `+2 Destreza` (Alto Elfo: `+1 Inteligência`; Floresta: `+1 Sabedoria`; Drow: `+1 Carisma`)
* **Halfling**: `+2 Destreza` (Pés-Leves: `+1 Carisma`; Robusto: `+1 Constituição`)
* **Humano (*Human*)**: `+1 em Todos os 6 Atributos`
* **Gnomo (*Gnome*)**: `+2 Inteligência` (Rocha: `+1 Constituição`; Floresta: `+1 Destreza`)
* **Meio-Orc (*Half-Orc*)**: `+2 Força`, `+1 Constituição`
* **Tiefling**: `+2 Carisma`, `+1 Inteligência`
* **Meio-Elfo (*Half-Elf*)**: `+2 Carisma`, `+1 em dois atributos` (padrão: +1 Destreza, +1 Constituição)
* **Custom / Outra**: `0` nos bônus automáticos, com opção de ajuste livre.

### B. Novo Design Visual do Editor de Atributos (`.stat-box-editor`)
Em `src/ui/ui.html` e `src/styles/head_css.html`, remodelar cada uma das 6 caixas de atributos (`FOR`, `DES`, `CON`, `INT`, `SAB`, `CAR`) para exibir três camadas transparentes:
1. **Atributo & Dado Base (`pm-base-str`)**:
   - Label com nome do atributo (`FOR`)
   - Input editável para o valor tirado no dado / Array Padrão (ex: `15`) com tooltip *"Valor bruto tirado no dado ou array padrão"*
2. **Badge de Bônus Racial / Origem (`pm-race-bonus-str`)**:
   - Tag visual temática colorida (ex: `🐉 +2 Raça` para Draconato em Força, `🧬 +1 Raça` em Carisma, ou `--` se zero)
   - Atualiza reativamente no exato momento em que o usuário troca a Raça no dropdown `pm-race-select`.
3. **Resultado Final & Modificador (`pm-final-str` e `pm-mod-str`)**:
   - `Valor Final = Base + Bônus Racial` (ex: `15 + 2 = 17`)
   - Modificador D&D 5E oficial: `(Final - 10) / 2` (ex: `+3`)
   - Input de compatibilidade `pm-str` mantido sincronizado para que todo o restante da aplicação continue recebendo o valor final sem quebras.

### C. Integração com as Ferramentas de Criação
1. **`🎲 Rolar 4d6 (Drop Lowest)`**:
   - As rolagens de dados preenchem os inputs de **Base**.
   - O sistema soma automaticamente os bônus raciais e atualiza os valores finais e modificadores.
2. **`📊 Array Padrão (15, 14, 13, 12, 10, 8)`**:
   - Distribui o array padrão na **Base** e soma os bônus raciais no final.
3. **`⚡ Otimizar p/ Classe`**:
   - Reordena as bases conforme a prioridade da classe, aplica os bônus raciais e atualiza os finais.
4. **Troca de Raça no Modal (`pm-race-select`)**:
   - Recalcula instantaneamente os bônus de cada atributo sem apagar as rolagens base feitas pelo jogador.

---

## 🏗️ 3. Módulos Afetados

| Arquivo | Responsabilidade |
| :--- | :--- |
| **`src/ui/ui.html`** | Estrutura HTML das caixas de atributo em `#modal-player`, com campos de Base, Badge de Bônus Racial, Valor Final e Modificador. |
| **`src/styles/head_css.html`** | Estilização das 3 camadas do `.stat-box-editor`, badges raciais iluminados e destaques numéricos. |
| **`src/js/players.js`** | Implementar `getRacialAbilityBonuses`, atualizar `updateModalAttributeModifiers`, `rollAttributes4d6Modal`, `applyStandardArrayModal`, `optimizeAttributesForClassModal` e `onPlayerModalClassOrLevelChange`. |
| **`builder.js`** | Compilar a nova versão para `planilha do rpg.html` e `index.html`. |
| **`test_runner.js`** | Adicionar a **Bateria 110** validando cálculo de bônus raciais, persistência dos valores finais e reatividade na troca de raça. |
| **`issues/README.md`** | Registrar a documentação completa da **ISSUE-142**. |

---

## 🛡️ 4. Compatibilidade e Segurança

- **Zero Breaking Changes**: Os IDs canônicos `pm-str`, `pm-dex`, etc., serão preservados e manterão sempre o valor final calculado, garantindo que `savePlayerSheet()`, `calculatePlayerAcFromEquipment()`, `calculateLevel1Hp()` e todos os 1913 testes existentes permaneçam 100% verdes.
- **Edição de Fichas Existentes**: Ao abrir uma ficha já criada, o sistema decompõe ou preenche o valor base e bônus de forma coerente.

---

## 📋 5. Lista de Tarefas (Tasks)

- [ ] **Task 1**: Adicionar a função `getRacialAbilityBonuses(raceName)` e atualizar a lógica de cálculo de atributos em `src/js/players.js`.
- [ ] **Task 2**: Atualizar o markup HTML das caixas de atributos em `src/ui/ui.html` com campos Base, Bônus Racial e Valor Final.
- [ ] **Task 3**: Adicionar estilos CSS em `src/styles/head_css.html` para os novos badges e disposição vertical ergonômica.
- [ ] **Task 4**: Executar compilação com `node builder.js`.
- [ ] **Task 5**: Adicionar a **Bateria 110** em `test_runner.js` e validar 100% de sucesso da suíte de testes.
- [ ] **Task 6**: Registrar a documentação da ISSUE-142 em `issues/README.md`.
- [ ] **Task 7**: Git commit semântico e push para `origin/main`.
