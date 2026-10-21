# Plano de Implementação - ISSUE-115

## 🎯 Objetivo e Contexto
O modal de edição de ficha de personagem (**`#modal-player`** - "EDITAR FICHA: ARKHALLIS") apresenta problemas críticos de ergonomia visual, legibilidade e aproveitamento de espaço:
1. **Truncamento agressivo e ilegível de Habilidades Desbloqueadas**: a seção `#pm-features-preview` trunca o texto arbitrariamente com `substring(0, 90) + '...'` em um container minúsculo de `max-height: 110px`, gerando linhas espremidas onde o mestre/jogador não consegue ler as regras das características (ex: *Portento*, *Tradição Arcana*).
2. **Atributos sem Modificadores**: a seção de 6 Atributos D&D (FOR, DES, CON, INT, SAB, CAR) exibe apenas inputs numéricos brutos sem os modificadores calculados (ex: INT 18 -> `+4`, FOR 7 -> `-2`), dificultando a visualização de bônus em mesa.
3. **Largura Restrita e Espaço Desperdiçado**: o modal tem largura fixa estreita (`max-width: 740px`), deixando grande margem vazia nas laterais em monitores modernos.
4. **Espaços de Magia e Seções Homogêneas**: os 9 círculos de magia e os campos de combate carecem de hierarquia visual e acabamento Dark Fantasy no padrão Roll20/D&D 5E.

---

## 🛠️ Módulos e Arquivos Afetados
- **`src/ui/ui.html`**:
  - Ampliação da largura do modal para `max-width: 880px`.
  - Inclusão dos badges visuais de modificadores nos 6 blocos de atributos D&D (`#pm-mod-str`, `#pm-mod-dex`, etc.).
  - Aprimoramento da hierarquia com seções visualmente consolidadas e títulos dourados expressivos.
  - Expansão do container `#pm-features-preview` com altura confortável (`max-height: 240px`) e rolagem suave.
- **`src/styles/head_css.html`**:
  - Estilos modernos para os cards de preview de habilidades (`.pm-feature-card`, `.pm-feature-title`, `.pm-feature-desc`, `.pm-feature-badge`).
  - Estilização refinada das caixas de atributos no modal (`.stat-box-editor`, `.stat-mod-pill`).
  - Estilização dos slots de magia no modal (`.pm-slot-box`, `.pm-slot-active`).
- **`src/js/players.js`**:
  - Em `onPlayerModalClassOrLevelChange`: eliminação do truncamento `substring(0, 90)` e adoção de formatação rica via `formatFeatureSnippet` com badges de nível e subclasse.
  - Implementação de `updateModalAttributeModifiers()` para recalcular os modificadores dinamicamente conforme o usuário digita nos inputs de atributos.
  - Chamada automática de `updateModalAttributeModifiers()` em `openPlayerModal`.
- **`test_runner.js`**:
  - Criação da **Suíte 83** validando a renderização dos modificadores dinâmicos, a ausência de truncamentos artificiais e a presença das novas classes do modal de edição no standalone compilado.
- **`issues/README.md`**:
  - Registro detalhado da **ISSUE-115**.

---

## 🔒 Garantias de Segurança e Não-Regressão
- **Compatibilidade Total**: Nenhuma alteração de schema nos campos de persistência de `PLAYERS` ou `localStorage`.
- **Preservação de Dados**: Todas as funções de salvamento (`savePlayerSheet`), exclusão e recálculo de CA/PV/Slots continuam 100% íntegras.
- **100% Testes Aprovados**: Todos os 1381 testes atuais devem permanecer passando, com a adição de novos testes para a Suíte 83.

---

## 📋 Checklist de Validação
- [ ] Modal de edição expandido para 880px, proporcionando visual arejado e confortável.
- [ ] Atributos FOR, DES, CON, INT, SAB, CAR exibem seus modificadores calculados (ex: `+4`, `-2`) que se atualizam em tempo real.
- [ ] Seção de Habilidades Desbloqueadas sem texto cortado com `...`, exibindo nome, nível, subclasse e regras completas com quebras e destaques.
- [ ] Compilação com `node builder.js` bem-sucedida.
- [ ] Bateria completa de testes automatizados com 100% de sucesso (`node test_runner.js`).
- [ ] Commit e push seguros no Git.
