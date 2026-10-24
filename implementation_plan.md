# Plano de Implementação - Correção Visual dos Cards de Talentos (Overflow) & Blindagem de Sincronização (ISSUE-125)

## 📌 Contexto e Diagnóstico

### 1. 🐛 Bug Visual nos Cards de Talentos (`.feat-catalog-card`)
- **Problema Relatado e Identificado**: Na aba do Compêndio de Talentos, o badge de pré-requisitos (`.feat-prereq-badge`, ex: `⚠️ Exige: Capacidade de conjurar pelo menos uma magia`) transborda e vaza para fora do card, invadindo o card adjacente.
- **Causa Raiz**:
  - Em `src/styles/head_css.html`, `.feat-prereq-badge` possui `white-space: nowrap;` sem `max-width`.
  - Em `src/js/compendium.js`, `.feat-prereq-badge` está dentro de `.feat-card-top` em layout flex horizontal lado a lado com `.feat-card-header`.
  - Como textos de pré-requisito podem ter mais de 50 caracteres (ex: *Adepto Elemental* exige 52 caracteres), a largura combinada com o título ultrapassa a largura do card (~320px), forçando o badge para fora da borda.
- **Solução Visual**:
  - Reestruturar o topo do card em `src/js/compendium.js`: o cabeçalho (ícone + nome + categoria) ocupa a primeira linha e o badge de pré-requisito é posicionado em um container dedicado `.feat-card-prereq-box`.
  - Em `src/styles/head_css.html`:
    - Adicionar `overflow: hidden; min-width: 0;` a `.feat-catalog-card`.
    - Ajustar `.feat-prereq-badge` com `white-space: normal; line-height: 1.35; max-width: 100%; word-break: break-word; display: inline-flex; align-items: center; gap: 4px;`.
    - Criar `.feat-card-prereq-box` com margem adequada para visualização limpa e integrada.

### 2. 🛡️ Blindagem de Sincronização e Anti-Perda de Talentos
- **`src/js/players.js`**:
  - Em `savePlayerSheet()`: Adicionar `feats: (existing && Array.isArray(existing.feats)) ? existing.feats : []` no objeto `data` salvo, impedindo que edições gerais no modal da ficha apaguem os talentos do herói.
  - Em `grantFeatToPlayer()`, `removeFeatFromPlayer()` e `saveAsiChoiceModal()`: Adicionar `if (typeof touchPlayer === 'function') touchPlayer(p);` para carimbar `p.updatedAt = Date.now()`, garantindo que o snapshot seja reconhecido como mais recente e adotado nos clientes dos jogadores.
- **`src/js/firebase_sync.js`**:
  - Em `applyCloudDataToLocal()` (seção do jogador, linhas ~560-605): Garantir explicitamente a resolução e adoção de `feats` na ficha do jogador ao receber dados remotos do mestre:
    ```javascript
    feats: (isLocalNewer && localChar.feats && localChar.feats.length > 0)
      ? localChar.feats
      : (remoteP.feats || localChar.feats || [])
    ```

---

## 🏗️ Módulos e Arquivos Afetados

1. **`src/styles/head_css.html`**:
   - Ajuste em `.feat-catalog-card`, `.feat-card-top`, `.feat-card-header`, `.feat-prereq-badge` e adição de `.feat-card-prereq-box`.
2. **`src/js/compendium.js`**:
   - Atualização do template HTML dos cards em `renderFeatsTab()`.
3. **`src/js/players.js`**:
   - Preservação de `feats` em `savePlayerSheet()`.
   - Adição de `touchPlayer(p)` em `grantFeatToPlayer()`, `removeFeatFromPlayer()` e `saveAsiChoiceModal()`.
4. **`src/js/firebase_sync.js`**:
   - Resolução explícita de `feats` no merge do jogador em `applyCloudDataToLocal()`.
5. **`test_runner.js`**:
   - Atualização e adição de asserções da Bateria 93 cobrindo a formatação sem overflow dos cards e a blindagem de persistência.

---

## 🧪 Estratégia de Verificação

1. Executar `node builder.js` para compilar o HTML final.
2. Executar `node test_runner.js` garantindo 100% de aprovação na suíte de testes.
3. Testar a renderização dos cards com Chrome CDP / subagent para validar visualmente que o badge não corta nem ultrapassa a borda do card.
4. Testar a sincronização Mestre ➔ Jogador confirmando que talentos persistem após edições da ficha.

---

## 📌 Status de Implementação

- [x] **Ajuste de CSS em `src/styles/head_css.html`**: `.feat-catalog-card` com `overflow: hidden`, `.feat-prereq-badge` com `white-space: normal; line-height: 1.35; max-width: 100%; word-break: break-word` e nova classe `.feat-card-prereq-box`.
- [x] **Template em `src/js/compendium.js`**: Badge de pré-requisitos posicionado em container dedicado abaixo do título.
- [x] **Preservação de Talentos em `src/js/players.js`**: `savePlayerSheet()` agora copia `existing.feats` incondicionalmente no objeto salvo.
- [x] **Carimbos de Tempo em `src/js/players.js`**: `touchPlayer(p)` adicionado em `grantFeatToPlayer`, `removeFeatFromPlayer` e `saveAsiChoiceModal`.
- [x] **Merge Inteligente em `src/js/firebase_sync.js`**: Resolução e adoção explícita de `feats` na ficha do jogador ao sincronizar com o mestre.
- [x] **Bateria 93 de Testes Automatizados (`test_runner.js`)**: 1634/1634 testes aprovados com 100% de sucesso.
- [x] **Compilação (`builder.js`)**: HTML standalone gerado com sucesso.
- [x] **Validação Visual**: Captura de tela confirmou alinhamento impecável sem overflow.
