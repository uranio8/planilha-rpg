# Plano de Implementação - ISSUE-123: Automação e Interligação Dinâmica na Ficha de Personagem

## 🎯 Objetivo e Contexto
O usuário solicitou melhorias no modal de criação e edição de fichas de personagens (`#modal-player`) para interligar informações que se repetem ou dependem umas das outras:
> *"vamos aplicar melhorias nessa aba, e linkar informações que se repetem ou são interligadas com outras, como por exemplo as armas ali, o jogador deve escolher apenas o equipamento, e o proprio sistema configura o ataque e acerto"*

Atualmente, o modal possui várias desconexões mecânicas:
1. **Ataques & Armas Principais**: O campo `#pm-attacks` é um campo de texto bruto ou depende de um modal externo que não recalcula dinamicamente se o jogador alterar seus atributos (FOR/DES), nível ou classe.
2. **Raça vs. Deslocamento (Speed)**: Ao selecionar a Raça (ex: Anão, Halfling, Elfo), o deslocamento permanece estático em `9m`, ignorando o padrão D&D 5E (ex: Anão e Pequeninos = 7,5m, Elfo dos Bosques = 10,5m, etc.) e bônus de classe (Bárbaro Nv 5+ ou Monge Nv 2+).
3. **Classe / Nível / CON vs. PV Máximo**: Ao criar o personagem ou alterar classe/CON/nível, o PV não oferece cálculo assistido de 1º nível (`Dado de Vida Máximo + CON`) nem cálculo por progressão de níveis.
4. **Fórmula de CA (Classe de Armadura)**: Embora a CA seja calculada, não há indicação visual de qual regra está ativa (ex: Defesa sem Armadura do Bárbaro `10 + DES + CON`, Armadura Leve `12 + DES`, Armadura Pesada, etc.).
5. **Espaços de Magia para Classes Não-Conjuradoras**: Classes como Bárbaro, Guerreiro (não-místico) e Ladino exibem uma grade de 9 círculos zerados sem distinção de classes conjuradoras.

---

## 🛠️ Detalhamento das Melhorias e Módulos Afetados

### 1. Seletor Integrado de Armas com Cálculo Automático de Acerto e Dano
- **UI (`src/ui/ui.html`)**:
  - Na seção **Ataques & Armas Principais**, adicionar um seletor rápido com dropdown categorizado das armas do compêndio D&D 5E (`EQUIPMENT_DATA`) e botão `➕ Equipar Arma`.
  - Exibição de cards visuais interativos para cada arma equipada contendo:
    - Nome da arma e propriedades (ex: *Versátil, Acuidade, Pesada*).
    - **Bônus de Acerto calculado em tempo real** (ex: `🎯 +4`, combinando atributo chave FOR/DES + Bônus de Proficiência da classe).
    - **Fórmula de Dano calculada em tempo real** (ex: `💥 1d12+2 cortante`).
    - Botão de remoção rápida (`🗑️`).
  - Sincronização bidirecional com o campo `#pm-attacks` e inclusão de um botão sutil `✏️ Editar Texto Livre` para mestres que desejam armas customizadas/homebrew.
  - Ao salvar a ficha (`savePlayerSheet`), as armas selecionadas são salvas automaticamente no inventário do jogador com `equipped: true` e `category: 'Armas'`.

### 2. Recálculo Reativo em Tempo Real de Atributos e Bônus
- **Lógica (`src/js/players.js`)**:
  - Função auxiliar `getModalSimulatedPlayer()`: reconstrói um objeto de jogador virtual com base nos valores instantâneos do formulário (`#pm-str`, `#pm-dex`, `#pm-con`, `#pm-class-select`, `#pm-level`, `#pm-armor-select`, etc.).
  - Ao alterar qualquer atributo (FOR, DES, CON, INT, SAB, CAR), nível ou classe:
    - Todos os ataques equipados recalculam imediatamente acerto e dano.
    - A CA Resultante é recalculada e atualizada.
    - Os modificadores de atributo (`#pm-mod-str`, etc.) são atualizados.

### 3. Vínculo Automático: Raça & Bônus de Classe ➔ Deslocamento
- **Lógica (`src/js/players.js`)**:
  - Função `getRacialAndClassSpeed(raceName, className, level, armorKey)`:
    - Identifica a velocidade base a partir de `SPECIES_DATA` (Anão = 7,5m; Halfling = 7,5m; Gnomo = 7,5m; Elfo da Floresta = 10,5m; demais = 9m).
    - Aplica bônus de Bárbaro (*Movimento Rápido* +3m no Nível 5+ se não usar armadura pesada).
    - Aplica bônus de Monge (*Movimento sem Armadura* +3m no Nível 2+, progressivo, sem armadura/escudo).
  - Atualiza o campo `#pm-speed` automaticamente quando a Raça ou Classe/Nível muda, respeitando caso o usuário insira um valor customizado.

### 4. Vínculo Automático: Classe, CON e Nível ➔ Sugestão de PV Máximo
- **Lógica (`src/js/players.js`)**:
  - Ao alterar Constituição, Classe ou Nível, exibe um botão/chip de ajuda rápida ao lado de `#pm-maxhp`: `Sugerido: X PV (Aplicar)`.
  - Fórmula oficial 5E:
    - Nível 1: `Dado de Vida Máximo + Modificador de CON` (mínimo 1).
    - Nível N: `Nível 1 + ((Dado Médio + Modificador de CON) * (Nível - 1))`.
  - Para novas fichas, preenche automaticamente o PV inicial de Nível 1 correto com base na classe e CON.

### 5. Indicador Visual da Fórmula de CA
- **UI & Lógica (`src/ui/ui.html` e `src/js/players.js`)**:
  - Adicionar um subtítulo/badge dinâmico abaixo de CA Resultante:
    - Ex: `Defesa sem Armadura (Bárbaro): 10 + DES (+1) + CON (+2) = 13`
    - Ex: `Cota de Malha: 16 (Pesada, sem mod DES)`
    - Ex: `Couro Batido + Escudo: 12 + DES (+2) + Escudo (+2) = 16`

### 6. Tratamento de Espaços de Magia para Não-Conjuradores
- **UI (`src/ui/ui.html`)**:
  - Para classes sem conjuração (Bárbaro, Guerreiro sem Cavaleiro Arcano, Ladino sem Trapaceiro Arcano, Monge sem subclasse mágica):
    - Exibir uma mensagem discreta: `⚔️ Esta classe não utiliza espaços de magia.` com opção de expansão se desejado.
    - Para conjuradores, destaca os círculos que possuem slots disponíveis (> 0).

---

## 🔒 Garantias de Segurança e Não-Regressão
- **Compatibilidade com Dados Existentes**: Fichas já salvas mantêm seus valores intactos sem perda de informações.
- **Respeito às Regras Oficiais D&D 5E**: Cálculo rigoroso de proficiência em armas (marciais vs. simples, acuidade, alcance, etc.).
- **Zero Frameworks**: Mantém CSS Vanilla puro com variáveis de design do sistema.
- **Suíte de Testes Automatizada**: Criação da **Bateria 91** em `test_runner.js` cobrindo o cálculo dinâmico de armas no modal, velocidade racial e sugestão de PV.

---

## 📋 Checklist de Validação
- [ ] Criação do seletor de armas e cards interativos no modal.
- [ ] Recálculo reativo em tempo real de bônus de acerto e fórmula de dano ao alterar atributos/nível/classe.
- [ ] Sincronização de armas equipadas com `#pm-attacks` e com o inventário da ficha.
- [ ] Vínculo de Raça e Classe ao Deslocamento (`#pm-speed`).
- [ ] Sugestão automática de PV com cálculo oficial 5E.
- [ ] Badge explicativo da fórmula de CA ativa.
- [ ] Compilação via `node builder.js`.
- [ ] Execução da suíte completa de testes automatizados (`node test_runner.js`) com 100% de sucesso.
