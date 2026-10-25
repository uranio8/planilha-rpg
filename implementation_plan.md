# Plano de Implementação - Responsividade Mobile no Combate, Correção de Overflow e Slots de Magia Visíveis (ISSUE-130)

## 📌 Diagnóstico da Imagem Enviada pelo Usuário

Na captura de tela enviada pelo usuário da lista de **ORDEM DE INICIATIVA** no combate móvel, identificamos problemas críticos de ergonomia e layout:

1. **Corte e Overflow Horizontal do Botão `⚡ Dano/Cura`**:
   - A linha de atributos do combatente (`CA: 19`, `PV: 43/43 ✏️`, `-5`, `-1`, `+1`, `+5` e `⚡ Dano/Cura`) está configurada com `display: flex; justify-content: space-between; align-items: center;` sem `flex-wrap: wrap`.
   - Em telas de smartphones (360px a 412px de largura útil), a soma dos elementos (~330px) ultrapassa a largura interna do card (~315px).
   - O botão `⚡ Dano/Cura` vaza pela margem direita do card e fica cortado pela borda/scrollbar.

2. **Ausência de Visualização dos Slots de Magia na Ordem de Iniciativa**:
   - Na lista de iniciativa, os cards de combatentes não exibiam o status de espaços de magia de heróis conjuradores.
   - O Mestre não conseguia ver quantos slots o aluno tinha ou se ele havia acabado de gastar um slot em outro dispositivo, a não ser quando chegava a vez dele como Combatente Ativo.

3. **Espremimento no Cabeçalho do Card em Telas Estreitas**:
   - O nome do herói (`Deraravely (Samuel)`) concorre em uma linha rígida com a iniciativa, badge de classe e quatro botões de ação à direita (`⚡ Status`, `🎲`, `🏷️`, `✕`), quebrando em duas linhas e esmagando os botões.

4. **Alvos Táteis Excessivamente Pequenos nos Ajustadores de PV**:
   - Botões de ajuste rápido `-5`, `-1`, `+1`, `+5` tinham tamanho minúsculo (`20px x 20px`), dificultando o toque no celular e causando cliques acidentais.

---

## 🏗️ Proposta de Solução

### 1. Refatoração Responsiva do Card de Combatente (`src/js/combat.js` e `src/styles/head_css.html`)
- **Linha de Vida e Dano Flexível com Quebra Harmoniosa**:
  - Transformar o container de status em grid/flex responsivo com `flex-wrap: wrap; gap: 6px;`.
  - Agrupar `CA` e `PV` em um bloco de leitura com alto contraste (`🛡️ CA: 19 • ❤️ PV: 43/43`).
  - Agrupar os botões de ajuste de PV (`-5`, `-1`, `+1`, `+5`, `⚡ Dano/Cura`) em uma pílula de ações rápidas alinhada com quebra automática, garantindo que o botão `⚡ Dano/Cura` nunca seja cortado.
  - Aumentar a ergonomia dos botões rápidos para dimensões táteis confortáveis (`24px` a `28px` com espaçamento).
- **Cabeçalho com Distribuição Inteligente**:
  - Permitir que o nome e badges do combatente ocupem o espaço flexível sem esmagamento, agrupando os botões de ação em container tátil limpo.

### 2. Indicador em Tempo Real de Slots de Magia no Card de Iniciativa (`src/js/combat.js`)
- Para combatentes que são jogadores e possuem slots de magia (`playerObj.slots.some(s => s > 0)`):
  - Adicionar uma barra compacta e elegante de slots no card:
    `🔮 Magias: 1º: 3/4 | 2º: 1/2 ...`
  - Com gemas visuais ou pílulas coloridas destacando slots disponíveis vs gastos.
  - Quando o aluno conjurar uma magia no celular, o Mestre verá instantaneamente a atualização visual do slot no próprio card de iniciativa!

### 3. Modal Tátil Elegante de Dano/Cura Rápida (`src/js/combat.js` e `src/ui/ui.html`)
- Substituir o diálogo nativo `prompt()` e `confirm()` por um modal dark fantasy dedicado `#modal-combat-damage-heal` com botões rápidos de Dano e Cura diretos, eliminando travamentos de teclado virtual no celular.

### 4. Responsividade Global de Controles do Combate (`src/styles/head_css.html`)
- Ajustar `.controls-bar` do combate em telas `< 600px`:
  - Botão `Próximo Turno` em destaque central de fácil alcance com o polegar.
  - Dropdowns e opções organizados sem cortes.

---

## 🧪 Estratégia de Testes e Validação
1. **Compilação**: Executar `node builder.js`.
2. **Suíte Automatizada**: Adicionar a **Bateria 98** em `test_runner.js`:
   - Validar que o HTML compilado contém a estrutura responsiva sem overflow nos cards de combate;
   - Validar que combatentes conjuradores exibem seus slots de magia no card de iniciativa;
   - Validar que o recálculo e sincronização de slots refletem na lista de combatentes.
3. **Validação Visual Headless (CDP)**:
   - Capturar screenshot no Chrome Headless em viewport mobile (375x667 e 390x844) verificando que o botão `⚡ Dano/Cura` e os slots de magia estão 100% visíveis, alinhados e sem cortes.

---

## 📋 Governança (AGENTS.md)
Solicitamos a aprovação prévia deste plano antes de iniciar as alterações no código fonte sob `src/`.
