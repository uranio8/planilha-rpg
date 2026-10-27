# Plano de Implementação - Botão de Download de Ficha ao Lado do Lápis (ISSUE-147)

## 🎯 Contexto e Objetivos

O usuário solicitou:
> *"vamos colocar o botão de donwload de ficha ao lado do lapis"*
> (enviando captura da toolbar dos cards de personagens: `[ ✏️ ] [ 📱 ] [ 📏 ] | [ 🗑️ ]`)

O objetivo é disponibilizar o botão de **download de ficha** posicionado imediatamente à direita do botão de edição (lápis ✏️) em cada card de personagem, proporcionando acesso direto e intuitivo para baixar/salvar a ficha canônica oficial D&D 5E em PDF (A4) ou exportar os dados em arquivo JSON.

---

## 🔍 Análise e Posicionamento na Interface

Atualmente, na barra de ferramentas do card de personagem (`.player-actions-group` em `src/js/players.js`):
```html
<div class="player-actions-group" onclick="event.stopPropagation();">
  <button type="button" class="btn-micro roll20-btn-tool" onclick="openPlayerModal('${p.id}')" title="Editar Ficha Completa">✏️</button>
  <!-- POSIÇÃO DO NOVO BOTÃO DE DOWNLOAD AQUI -->
  <button type="button" class="btn-micro roll20-btn-tool" onclick="openSharePlayerModal('${p.id}')" title="Compartilhar Link/QR Code">📱</button>
  <button type="button" class="btn-micro roll20-btn-tool" onclick="togglePlayerCardCompact('${p.id}')" title="Alternar Modo Compacto">📏</button>
  <span class="roll20-tool-divider"></span>
  <button type="button" class="btn-micro roll20-btn-tool roll20-btn-tool-del" onclick="deletePlayer('${p.id}')" title="Excluir Personagem">🗑️</button>
</div>
```

---

## 🛠️ Modificações Propostas

### 1. `src/js/players.js`
- **Inserção do Botão de Download na Toolbar**:
  Posicionar entre o lápis (✏️) e o celular (📱):
  ```html
  <button type="button" class="btn-micro roll20-btn-tool" onclick="printPlayerSheet('${p.id}')" title="Baixar Ficha / Salvar em PDF (A4 Oficial D&D 5E)">📥</button>
  ```
  *(Utilizando o ícone semântico `📥` de download para clareza máxima e correspondência com a instrução do usuário).*
- **Função de Exportação Individual em JSON (`exportSinglePlayerJson(id)`)**:
  Permitir também baixar o arquivo JSON individual da ficha do herói (ex: `ficha_thorin_dnd5e.json`), útil para backup ou transferência de personagens específicos.

### 2. `src/ui/ui.html`
- No modal de exportação (`#modal-print`), incluir na barra de ferramentas superior:
  - Botão principal: `📥 Baixar PDF / Imprimir`
  - Botão secundário de dados: `💾 Baixar Ficha (.JSON)`
  - Botão de fechar: `✕ Fechar`

### 3. `test_runner.js`
- Adicionar nova bateria de testes automatizados:
  - Validar que a toolbar do card contém o botão com ícone `📥` e chamada `printPlayerSheet`.
  - Validar que o botão está posicionado entre o botão de editar (`openPlayerModal`) e o de compartilhar (`openSharePlayerModal`).
  - Validar a exportação das funções no escopo global (`printPlayerSheet`, `exportSinglePlayerJson`).

---

## 🔒 Critérios de Aceite e Verificação

1. O botão `📥` aparece no card do herói imediatamente ao lado do botão de lápis `✏️`.
2. Ao clicar no botão `📥`, o modal de download/impressão A4 em alta definição é aberto exibindo a ficha completa em 2 páginas.
3. No modal, o usuário pode clicar em `📥 Baixar PDF / Imprimir` para salvar o PDF ou em `💾 Baixar Ficha (.JSON)` para obter o arquivo estruturado.
4. Compilação executada com sucesso (`node builder.js`).
5. Suíte de testes 100% aprovada (`node test_runner.js`).
