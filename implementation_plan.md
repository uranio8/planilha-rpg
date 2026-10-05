# 📋 Plano de Implementação: Correção do Modal no Canto Inferior Esquerdo e Otimização Completa do Grimório / Seletor de Magias

Este plano aborda e resolve os dois problemas relatados pelo usuário:
1. **Bug visual no canto inferior esquerdo** ("Teste de Concentração" aparecendo estático e cortado no rodapé).
2. **Experiência e visualização ruim no modal de magias** ("Grimório & Magias Preparadas" espremido, ocupando pouco espaço vertical útil, com banners redundantes empurrando a lista e exibindo apenas 1 magia por vez).

---

## 🔍 1. Diagnóstico dos Problemas e Causas Raízes

### 1.1 Bug do Canto Inferior Esquerdo (Modal de Concentração e Salvaguardas)
- **Causa**: Em `src/ui/ui.html` (linhas 3827 e 3872), `#modal-concentration-check` e `#modal-death-saves` foram estruturados com as classes `class="modal"` e `class="modal-content"`.
- **Efeito**: Não existia regra CSS para `.modal` no projeto. Por padrão, o navegador os renderizou como blocos normais (`display: block`) no final do documento HTML. Com isso, o card do Teste de Concentração fica visível e cortado no rodapé/canto inferior da tela o tempo todo, mesmo sem sofrer dano.
- **Solução**: Padronizar para `class="modal-overlay"` e `class="modal-body"`, além de blindar o CSS para que `.modal` também seja tratado como overlay oculto (`display: none`).

### 1.2 Dificuldade de Visualização das Magias no Grimório / Seletor
- **Causas**:
  1. **Layout e Altura do Modal**: O modal `#modal-spell-picker` usa `max-width: 650px` e depende do `.modal-body` padrão com `max-height: 90vh; overflow-y: auto; display: flex; flex-direction: column; gap: 16px;`.
  2. **Empilhamento Excessivo de Banners**:
     - No modo de transcrição (`copy`), aparecem 3 banners informativos simultâneos empilhados:
       - `picker-prep-meter-box`: 3 linhas explicando a oficina de transcrição.
       - `picker-copy-banner`: 2 linhas explicando custo e ouro.
       - Banner de dica estático: 2 linhas de "Como funciona: Clique em qualquer magia para marcá-la...".
     - Barra de filtros com 5 selects que quebram em 2 linhas.
  3. **Efeito Espremido**: Os cabeçalhos e banners somados aos espaçamentos de 16px consomem mais de 450px da altura. Em telas comuns de notebook (768px a 900px), a altura útil restante para a lista de magias é de quase zero (~30px a 50px). Isso faz com que apenas 1 magia (ou meia magia) apareça visível, gerando um scroll duplo (um no modal e outro na lista de magias).
  4. **Modo de Transcrição Inadequado**: No modo "Transcrever Nova Magia", o banner de dica diz para "marcar a caixinha e salvar", o que confunde o usuário, pois na transcrição clica-se no botão "Transcrever" diretamente em cada magia.

---

## 🛠️ 2. Arquitetura da Solução Proposta

### 2.1 Correção do Canto Inferior Esquerdo (`src/ui/ui.html` e `src/styles/head_css.html`)
1. Em `src/ui/ui.html`:
   - Mudar `<div id="modal-concentration-check" class="modal">` para `<div id="modal-concentration-check" class="modal-overlay">` e o card interno para `class="modal-body"`.
   - Mudar `<div id="modal-death-saves" class="modal">` para `<div id="modal-death-saves" class="modal-overlay">` e o card interno para `class="modal-body"`.
2. Em `src/styles/head_css.html`:
   - Vincular `.modal` à mesma regra de `.modal-overlay`:
     ```css
     .modal-overlay, .modal { display: none; position: fixed; inset: 0; ... }
     .modal-overlay.open, .modal.open { display: flex; }
     ```

### 2.2 Redesenho do Modal de Grimório & Magias Preparadas (`src/ui/ui.html`, `src/styles/head_css.html`, `src/js/players.js`)
1. **Expansão e Layout Flexível com Rolagem Única**:
   - Ampliar a largura do modal para `max-width: 960px; width: 95vw;` (aproveitando o espaço horizontal da tela).
   - Definir altura fixa e estruturada no card: `height: 88vh; max-height: 88vh; display: flex; flex-direction: column; overflow: hidden; padding: 18px 22px; gap: 10px;`.
   - Elementos superiores (header, abas, banner compacto, filtros) com `flex-shrink: 0;`.
   - Rodapé com botões de ação com `flex-shrink: 0;`.
   - O container da lista (`#picker-spells-list`) passa a ter `flex: 1; min-height: 0; max-height: none; overflow-y: auto;` — ele **ocupa 100% de todo o espaço vertical disponível**, permitindo visualizar confortavelmente 6 a 10 magias simultaneamente sem quebras de layout.

2. **Consolidação dos Banners de Informação**:
   - No modo **Transcrever Nova Magia** (`copy`):
     - Unificar a mensagem em um único banner moderno, horizontal e compacto:
       `🖋️ Oficina de Transcrição: Custo de 50 PO e 2h por círculo (25 PO / 1h para Tradição Arcana) | 🪙 Saldo: X PO | 📖 Grimório: Y magias`
     - Ocultar a dica redundante de "clique na caixinha para salvar".
   - No modo **Magias Preparadas** (`prep`):
     - Manter o medidor compacto de preparação diária (`🔮 Preparadas: X / Y | ✨ Truques: A / B`).
     - Dica discreta integrada ao cabeçalho ou à barra de filtros.

3. **Barra de Filtros Otimizada**:
   - Disposição horizontal harmoniosa: Campo de busca ágil + Selects de Classe, Círculo, Escola e Ação + Botão de "⭐ Selecionadas".
   - Inputs com altura e espaçamento consistentes (`padding: 6px 10px; font-size: 12px;`).

4. **Cards de Magia Aprimorados e Mais Legíveis**:
   - Com 960px de largura, o card de cada magia distribui perfeitamente:
     - Checkbox + Nome da Magia + Badge de Círculo + Tipo de Ação (Bônus, Reação, Ritual).
     - Escola, Alcance, Tempo de Conjuração.
     - Botão "ℹ️ Detalhes" para expansão da descrição completa.
     - No modo transcrição: Badge de custo `💰 X PO`, tempo `⏱️ Yh`, botão `🖋️ Transcrever` e botão `✨ Grátis` alinhados e sem cortes.

---

## 🧪 3. Plano de Verificação

1. **Compilação**:
   - Rodar `node builder.js` gerando a build final do HTML standalone.
2. **Testes Automatizados**:
   - Executar `node test_runner.js` garantindo que todos os 1.245 testes continuam passando com 100% de êxito.
3. **Verificação Visual e Funcional**:
   - Inspecionar a ausência do card de concentração no canto inferior esquerdo no estado normal de tela.
   - Abrir o modal de magias e verificar a ampla área de exibição da lista com rolagem suave, banners compactos e sem scrollbars duplas.
   - Testar a troca entre as abas "⭐ Magias Preparadas", "📖 Meu Grimório" e "🖋️ Transcrever Nova Magia".
