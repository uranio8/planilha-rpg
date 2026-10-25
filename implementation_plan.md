# 📋 Plano de Implementação - ISSUE-137: Blindagem de Conexão, Fila de Mutação Offline Persistida e Multi-Path Updates Atômicos no Firebase

---

## 🎯 1. Contexto e Objetivos

Ao jogar RPG de mesa com múltiplos participantes conectados (Mestre no PC e Alunos em celulares), flutuações de rede móvel (3G/4G/5G) ou quedas transitórias de Wi-Fi podem fazer com que dados sofram atrasos, timeouts ou colisões de concorrência (*Last-Write-Wins* destrutivo).

A pesquisa de melhores práticas na web e nas diretrizes oficiais do Firebase identificou três oportunidades cruciais de engenharia para atingir **zero perda de dados**:
1. **Fila de Mutação Offline Persistida (`offline_mutation_queue`)**: Gravação atômica em `localStorage` de todas as operações pendentes (alteração de vida, slots de magia, itens, anotações). Mesmo se o navegador do aluno for fechado ou recarregado sem sinal, a fila é preservada e descarregada em sequência assim que a conexão voltar.
2. **Telemetria de Conexão com `.info/connected`**: Monitoramento nativo do WebSocket do Firebase Realtime Database para detecção instantânea de queda e retorno de sinal, com feedback visual em tempo real no badge da interface.
3. **Multi-Path Updates Atômicos**: Atualizações cirúrgicas apenas no nó do herói ativo (`players/${heroIndex}`), impedindo que modificações feitas pelo Mestre na campanha sobrescrevam alterações simultâneas feitas pelo aluno na sua vida/magias.
4. **Reconexão com Exponential Backoff & Jitter**: Algoritmo anti-*thundering herd* para distribuir as tentativas de reconexão entre 1s e 15s de forma suave.

---

## 🏗️ 2. Módulos Afetados

| Módulo / Arquivo | Modificações Planejadas |
| :--- | :--- |
| **`src/js/firebase_sync.js`** | 1. Implementar gerenciador da fila offline `dnd_offline_mutation_queue_v1` (`enqueueOfflineMutation`, `flushOfflineMutationQueue`, `peekOfflineMutationQueue`).<br>2. Configurar listener reativo para `.info/connected` no Realtime Database.<br>3. Integrar *exponential backoff* com *jitter* no processamento da fila e nas tentativas de salvamento.<br>4. Implementar *Multi-Path Updates* granulares no `executePlayerCloudSave` e `executeCloudSave`.<br>5. Garantir resiliência bidirecional com Firestore e Realtime DB. |
| **`src/styles/head_css.html`** | Adicionar classes visuais para estados da fila offline no badge: `.sync-queued` (âmbar suave com indicador de pendências `🟡 Sincronizando (X pendentes)`) e animação suave de pulso. |
| **`test_runner.js`** | Adicionar a **Bateria 105** validando enfileiramento, esvaziamento sequencial, tolerância a desconexões simuladas, preservação da fila no `localStorage` e multi-path updates atômicos. |
| **`issues/README.md`** | Registrar a documentação completa da **ISSUE-137**. |

---

## 🛡️ 3. Impacto em Persistência, Combate e Compatibilidade

- **Persistência (`localStorage`)**: A fila será salva sob a chave isolada `dnd_offline_mutation_queue_v1`, não alterando a estrutura das 4 chaves oficiais (`dnd_tracker_state_v3`, `dnd_tracker_players_v3`, `dnd_tracker_grid_v3`, `dnd_tracker_campaigns_v1`).
- **Combate e VTT**: Aceleração das sincronizações: cada combatente tem suas mutações (PV, condições, slots) despachadas de forma atômica, eliminando micro-travamentos na mesa.
- **Segurança de Dados**: Zero descarte acidental de dados em recargas de página no celular.

---

## 🧪 4. Estratégia de Validação

1. **Testes Automatizados (`node test_runner.js`)**:
   - Criação da **Bateria 105** no `test_runner.js`.
   - Teste de enfileiramento e descarregamento offline.
   - Teste de recarga de página simulada com itens na fila pendente.
   - Teste de concorrência com Multi-Path Updates sem perda de campos colaterais.
   - Manutenção de 100% de testes aprovados (1836+ testes verdes).
2. **Compilação**:
   - Execução de `node builder.js` para atualizar `planilha do rpg.html` e `index.html`.
3. **Simulação Ao Vivo**:
   - Validação com o script de simulação em tempo real (`simulate_dm_and_player_live.js`) contra o servidor Firebase real.
4. **Git Seguro**:
   - Commit atômico e semântico, `git push origin main` sem comandos destrutivos.
