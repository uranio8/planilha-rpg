# Plano de Implementação - Blindagem & Otimização Definitiva do LocalStorage (ISSUE-126)

## 📌 Contexto e Diagnóstico

O sistema de persistência local da aplicação depende do `localStorage` e do espelhamento secundário no `IndexedDB`. Identificamos vulnerabilidades críticas que causam perda de dados ou comportamento errático:

### 1. ⚠️ Fragmentação e Descompasso de Chaves
- `saveToLocalStorage()` em `src/js/core.js` gravava apenas no envelope `dnd5e_prisco_sheet_state_v2` e em `dnd_tracker_players_v3` / `dnd_tracker_state_v3`.
- As chaves oficiais canônicas definidas nas diretrizes do projeto (`dnd_tracker_campaigns_v1` e `dnd_tracker_grid_v3`) eram gravadas separadamente em outros arquivos (`campaigns.js`, `vtt_grid.js`), gerando descompassos onde campanhas e grid ficavam dessincronizados do estado principal.

### 2. 💥 Risco de `QuotaExceededError` (Limite de 5MB do Navegador)
- O navegador impõe limite rígido de ~5MB para o `localStorage` por origem.
- O salvamento de imagens base64 de mapas no grid somado aos múltiplos snapshots de segurança (`dnd5e_safety_snapshots_history_v1`) acumulava centenas de kilobytes a megabytes, podendo estourar a cota silenciosamente.
- Quando ocorria `QuotaExceededError`, o salvamento falhava em silêncio dentro do `catch (e)`, e o usuário continuava usando a planilha acreditando que estava salvando.

### 3. 🔄 Sobrescrita de Modificações no `loadFromLocalStorage()`
- No boot (`core.js`), `loadFromLocalStorage()` é invocado antes de `campaigns.js` ser avaliado no bundle concatenado, podendo gravar `campaignsState: null` no envelope `STORAGE_KEY`.
- Durante a sanitização e migração de heróis no carregamento, propriedades legítimas modificadas pelo usuário (como ouro, PV e campos personalizados) podiam ser revertidas para valores padrão de `CANONICAL_INITIAL_PLAYERS`.
- Faltava sanitização proativa contra dados corrompidos ou chaves legadas inúteis (`v1`, drafts antigos) que ocupam espaço desnecessário.

---

## 🏗️ Módulos e Arquivos Afetados

1. **`src/js/core.js`**:
   - **`saveToLocalStorage()`**:
     - Gravação unificada e atômica de todas as chaves canônicas: `STORAGE_KEY`, `dnd_tracker_players_v3`, `dnd_tracker_state_v3`, `dnd_tracker_grid_v3` e `dnd_tracker_campaigns_v1`.
     - Tratamento defensivo de `QuotaExceededError`: expurgo automático de caches legados (`v1`, backups antigos de snapshots, logs muito longos) e re-tentativa imediata.
     - Preservação estrita de `campaignsState` existente mesmo se `CAMPAIGNS_STATE` ainda não estiver no escopo no momento da chamada.
   - **`loadFromLocalStorage()`**:
     - Priorização e unificação resiliente: lê do envelope `STORAGE_KEY` e das chaves canônicas `v3` com fallback ordenado.
     - Proteção contra reversão de dados: preservar incondicionalmente alterações de PV, moedas/ouro, notas, magias, talentos e inventário, sem que `CANONICAL_INITIAL_PLAYERS` reverta dados mais recentes.
   - **`saveSafetySnapshot()`**:
     - Limitar o histórico a no máximo 3 snapshots e excluir cópias redundantes de mapas pesados do VTT no payload do localStorage (delegando o mapa ao IndexedDB).
2. **`src/js/campaigns.js`**:
   - Garantir sincronização bidirecional entre `CAMPAIGNS_STATE`, `dnd5e_prisco_campaigns_v1` e `dnd_tracker_campaigns_v1` em `saveCampaignsState()` e `loadCampaignsState()`.
3. **`src/js/vtt_grid.js`**:
   - Compactação e guarda contra estouro de quota em `saveGridStatePermanently()`.
4. **`builder.js`**:
   - Recompilação do arquivo standalone `planilha do rpg.html` e `index.html`.
5. **`test_runner.js`**:
   - Criação da **Bateria 94** com testes específicos para:
     - Persistência e integridade das 4 chaves canônicas no `saveToLocalStorage()`;
     - Recuperação automática em caso de `QuotaExceededError`;
     - Preservação de moedas, anotações, PV e itens após reload;
     - Retenção do histórico de campanhas e grid.
6. **`issues/README.md`**:
   - Registro detalhado da **ISSUE-126**.

---

## 🧪 Estratégia de Verificação

1. **Testes Automatizados**:
   - Executar `node test_runner.js` garantindo que todos os 1634+ testes existentes e os novos da Bateria 94 passem com 100% de sucesso.
2. **Teste em Navegador Real com Simulação de Quota e F5**:
   - Executar script em Chrome Headless via CDP simulando modificações reais (PV, ouro, combate, baú e grid), forçando reload da página e conferindo se 100% das alterações são mantidas sem perdas.
3. **Compilação**:
   - Executar `node builder.js`.

---

## 📋 Protocolo de Governança (AGENTS.md)

Conforme a Regra 1 de governança do projeto, solicitamos a aprovação prévia deste plano antes de iniciar a alteração dos arquivos fonte sob `src/`.
