# 📋 Plano de Implementação: Auditoria e Correção de Traços Raciais/Classes e Espaços de Magia (Claker e Demais Heróis) - ISSUE-173

## 📌 Contexto & Diagnóstico

O usuário solicitou:
> *"verifique se o traço dos personagens estão de acordo com os traços das classes e raças, vi que os slots de magias de um dos personagens (o claker) está errado. Entre na planilha e verifique se esta com problema"*

Após auditoria detalhada nos dados padrão (`src/js/core.js`), nas bases oficiais (`src/data/classes.js`, `src/data/species.js`, `src/data/trait_quick_rules.js`) e nos módulos de renderização (`src/js/players.js`), foram identificadas as seguintes inconsistências:

### 1. Diagnóstico dos Espaços de Magia (Slots) do Claker:
- **Classe & Nível**: Claker é Bruxo (Warlock) Nível 5, Patrono Corruptor (The Fiend), Tiefling.
- **Regra Oficial D&D 5E (Pact Magic)**:
  - Um Bruxo Nível 5 possui **2 Espaços de Magia de 3º Círculo** (`[0, 0, 2, 0, 0, 0, 0, 0, 0]`).
  - No D&D 5E, o Bruxo **não possui slots de 1º nem de 2º círculo**. Todas as suas magias aprendidas (como *Raio de Bruxa*, *Mãos Flamejantes*, *Despedaçar*) são conjuradas no 3º círculo (*upcasting*), gastando 1 dos seus 2 slots de pacto de 3º círculo, que recarregam em Descanso Curto (Short Rest).
- **Problema na Interface & Ficha**:
  1. **Ausência de Bolhas Interativas nos Círculos 1 e 2**: Na aba de Magias de Claker, como `slots[0] = 0` e `slots[1] = 0`, o cabeçalho exibe apenas o texto informativo `🔮 Espaços de Pacto (2/2 de 3º Círc.)`, **mas nenhuma bolha de slot clicável**. Se o jogador ou mestre quiser marcar o gasto do slot diretamente no bloco do 1º ou 2º círculo onde a magia está listada, não há controle interativo, dando a forte impressão visual de que os slots estão "zerados/quebrados" para aquelas magias.
  2. **Modal de Edição (#modal-player)**: O modal exibe campos numéricos diretos para 1º ao 9º círculo. Claker aparece com 1º Círc = 0, 2º Círc = 0, 3º Círc = 2. Para jogadores ou mestres habituados com conjuradores tradicionais (Mago/Clérigo/Bardo), ver "0" no 1º e 2º círculo parece um erro evidente.
  3. **Array de Slots Truncado**: Em `core.js`, o array de slots de Claker possui apenas 5 elementos `[0, 0, 2, 0, 0]` em vez dos 9 elementos canônicos do D&D 5E.
  4. **Suporte Flexível de Mesa (Regra Oficial de Pacto vs Conjurador Clássico)**: Caso a mesa jogue com conjuração tradicional para o Bruxo (`[4, 3, 2, 0, 0, 0, 0, 0, 0]`) ou mantenha a regra oficial de Pact Magic (`[0, 0, 2, 0, 0, 0, 0, 0, 0]`), a ficha deve exibir gemas de pacto clicáveis em todos os círculos válidos com identificação clara `🔮 Espaço de Pacto (3º Círculo)`.

### 2. Diagnóstico dos Traços de Classe e Raça de Todos os Personagens:
- **Yoshigake Kira (Paladino Nv 5, Humano)**:
  - `p.features` atual possui `"Retomar o Fôlego (1d10+1 PV)"` $\rightarrow$ **ERRO GRAVE**: *Retomar o Fôlego* é característica exclusiva de Guerreiro (Fighter), não existe em Paladino!
  - Correção: Substituir pelas características canônicas de Paladino: *Sentido Divino (5/dia)*, *Cura pelas Mãos (25 PV)*, *Estilo de Luta*, *Destruição Divina*, *Saúde Divina*, *Canalizar Divindade (Arma Sagrada / Expulsar o Profano)*, *Ataque Extra*. Raça Humano: *Versatilidade Humana*.
- **Deraravely (Guerreiro 4 / Bárbaro 1 Nv 5, Orc)**:
  - `p.features` possui `"Fúria (2/dia, +2 Dano)"`. O parser atual de `getPlayerAllFeaturesAndTraits()` faz split cego por vírgula e quebra o texto em `Fúria (2/dia` e `+2 Dano)`, gerando um traço quebrado e solto.
  - Traços de Orc incompletos: Faltam os traços raciais canônicos de Orc (*Visão no Escuro 18m*, *Ameaçador / Intimidação*, *Resistência Implacável*, *Ataques Selvagens*).
- **Caim Vonsilford (Bruxo Nv 3, Draconato)**:
  - `p.features` possui `"Invocações Ocultas (Agonia Mística, Armadura das Sombras)"`, quebrado pela vírgula interna.
  - Faltam no registro textual os traços de Draconato (*Ancestral Dracônico*, *Arma de Sopro*, *Resistência a Dano*) e *Dádiva do Pacto*.
- **Claker (Bruxo Nv 5, Tiefling)**:
  - `p.features` possui apenas `"Bênção do Obscuro, Sorte do Obscuro"`.
  - Faltam os traços oficiais de Tiefling: *Visão no Escuro (18m)*, *Resistência Infernal (Resistência a Fogo)*, *Legado Infernal* (*Taumaturgia*, *Repreensão Infernal* 1×/dia como 2º círculo, *Escuridão* 1×/dia como 2º círculo).
  - Faltam as 3 Invocações Sobrenaturais canônicas de nível 5 (*Rajada Agonizante*, *Armadura das Sombras*, *Visão Diabólica*) e a *Dádiva do Pacto* (Pacto do Tomo / Corrente / Lâmina).
- **Zenit (Feiticeiro 4 / Bruxo 1 Nv 5, Draconato)**:
  - `p.features` possui `"Metamagia (Acelerar Magia, Magia Duplicada)"`, quebrado pela vírgula interna.
  - Faltam traços explícitos de Draconato e Pontos de Feitiçaria (4 Pontos).
- **Bug no Parser de Características (`src/js/players.js` linha 11132)**:
  - `cleanLine.split(',')` não respeita parênteses balanceados, destruindo expressões como `"Fúria (2/dia, +2 Dano)"` ou `"Metamagia (A, B)"`.

---

## 🎯 Escopo das Modificações

### 1. `src/js/core.js` (Bancos Padrão de Personagens `PLAYERS`):
- Atualizar a ficha de **Claker**:
  - Garantir array canônico de 9 círculos: `slots: [0, 0, 2, 0, 0, 0, 0, 0, 0]`, `slotsUsed: [0, 0, 0, 0, 0, 0, 0, 0, 0]`.
  - Adicionar as magias inatas raciais de Tiefling em suas magias conhecidas/preparadas (*Taumaturgia*, *Repreensão Infernal*, *Escuridão*).
  - Enriquecer `features` com as características oficiais completas de Bruxo 5 e Tiefling:
    `"Bênção do Obscuro (10 PV temp ao matar), Sorte do Obscuro (+1d10), Invocações Sobrenaturais (Rajada Agonizante, Armadura das Sombras, Visão Diabólica), Dádiva do Pacto (Pacto do Tomo), Visão no Escuro (18m), Resistência Infernal (Fogo), Legado Infernal (Taumaturgia, Repreensão Infernal, Escuridão)"`.
- Corrigir a ficha de **Yoshigake Kira**:
  - Remover `"Retomar o Fôlego (1d10+1 PV)"` (característica errônea de guerreiro).
  - Atualizar para características oficiais de Paladino Nv 5:
    `"Sentido Divino (5/dia), Cura pelas Mãos (25 PV), Destruição Divina, Saúde Divina (Imune a Doenças), Canalizar Divindade (Arma Sagrada, Expulsar o Profano), Ataque Extra, Versatilidade Humana"`.
  - Normalizar `slots` para 9 círculos: `[4, 2, 0, 0, 0, 0, 0, 0, 0]`.
- Corrigir a ficha de **Deraravely**:
  - Corrigir `features` para não conter quebras de vírgula:
    `"Retomar o Fôlego (1d10+4 PV), Surto de Ação, Crítico Aprimorado (19-20), Fúria (2/dia - +2 Dano), Defesa sem Armadura, Visão no Escuro (18m), Ameaçador, Resistência Implacável, Ataques Selvagens"`.
  - Normalizar `slots` para 9 círculos: `[0, 0, 0, 0, 0, 0, 0, 0, 0]`.
- Corrigir e normalizar **Caim Vonsilford**, **Arkhalis**, **Marc Hiroshi**, **Lalw**, **Koichi** e **Zenit**:
  - Garantir arrays de 9 círculos em `slots` e `slotsUsed`.
  - Ajustar `features` com traços corretos de classe e raça sem parênteses corrompidos por vírgulas.

### 2. `src/js/players.js`:
- **Parser Inteligente de Traços Personalizados (`getPlayerAllFeaturesAndTraits`)**:
  - Implementar divisor seguro que não separa vírgulas que estejam dentro de parênteses (ex: `"Fúria (2/dia, +2 Dano)"` permanece uma única habilidade íntegra).
- **Interatividade & Bolhas de Slots de Pacto nos Círculos Inferiores (`renderPlayers`)**:
  - Quando um Bruxo (ou conjurador de pacto) possui círculos inferiores com `maxSlots === 0` e um círculo superior de pacto disponível (ex: 3º círculo com 2 slots), renderizar bolhas ativas de atalho direto no cabeçalho do 1º e 2º círculo (`🔮 Espaço de Pacto: 2/2 de 3º Círc. [●][●]`).
  - Clicar nessas bolhas alterna diretamente o slot de pacto correspondente (`togglePlayerCircleSlot(p.id, pactSlotIdx, slotIdx)`), permitindo que o jogador consuma ou restaure seus slots de magia diretamente ao lado de suas magias de 1º e 2º círculo!
- **Alerta / Helper no Modal de Edição (`#modal-player`)**:
  - Quando a classe for Bruxo, exibir badge explicativo temático ao lado dos slots: `🔮 Magia de Pacto (D&D 5E): Os slots de Bruxo ficam concentrados no círculo máximo (3º Círculo no Nv 5) e recarregam em Descanso Curto. Se sua mesa usa regras da casa com slots graduais, você pode preenchê-los livremente nos campos abaixo.`

### 3. `src/styles/head_css.html` & `src/ui/ui.html`:
- Estilização suave para as gemas de pacto compartilhadas nos círculos inferiores (`.pact-shared-slot-bubble`).
- Badge explicativo de Pact Magic no `#modal-player`.

---

## 🧪 Estratégia de Verificação e Testes Automatizados

1. **Script de Auditoria de Personagens (`test_characters_audit.js`)**:
   - Valida cada um dos 9 personagens em `core.js`:
     - Slots com 9 posições canônicas.
     - Claker com slots canônicos `[0, 0, 2, 0, 0, 0, 0, 0, 0]` e gemas interativas acessíveis nos círculos 1, 2 e 3.
     - Yoshigake Kira sem traços de guerreiro (sem "Retomar o Fôlego") e com traços canônicos de Paladino.
     - Deraravely sem traços mutilados (`+2 Dano)`) e com traços canônicos de Orc e Campeão.
     - Todos os traços raciais de espécies presentes e resolvidos corretamente.
2. **Nova Bateria 142 no `test_runner.js`**:
   - Teste de integridade de traços de raça e classe.
   - Teste de slots de pacto de Bruxo (interação nos círculos 1, 2 e 3).
   - Teste do parser de características com vírgulas protegidas dentro de parênteses.
3. **Execução de Toda a Suíte**:
   - `node builder.js`
   - `node test_characters_audit.js`
   - `node test_ui_integrity.js`
   - `node test_runner.js` (alcançando 100% de aprovação em todos os testes).

---

## 📋 Confirmação do Usuário
Você aprova este plano de implementação para prosseguirmos com as alterações nos arquivos fonte e compilação da build?
