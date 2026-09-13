# 🔍 Diagnóstico e Rastreamento de Problemas

Guia de diagnóstico rápido para investigar comportamentos inesperados no **Planilha RPG**.

---

## 1. Problemas Frequentes e Resoluções

### O Combate não atualiza visualmente após uma ação
- **Causa**: Falta de chamada explícita para `renderCombat()`.
- **Solução**: Sempre invoque `renderCombat()` e `saveToLocalStorage()` após modificar `state.combatants` ou o turno ativo.

### O PV do jogador no combate difere da ficha
- **Causa**: Falta de amarração via `playerId` ou ausência de sincronização no `applyCombatAction`.
- **Solução**: Certifique-se de que o objeto de combatente possui `playerId: p.id` e que `applyCombatAction` atualiza `PLAYERS` e chama `renderPlayers()`.

### Alterações nos arquivos fonte não aparecem no navegador
- **Causa**: O compilador `builder.js` não foi executado após a alteração dos arquivos `src_*`.
- **Solução**: Execute `node builder.js` e recarregue a página no navegador.

---

## 2. Inspeção no Console do Navegador (F12)

- Verifique erros de sintaxe ou referências não declaradas.
- Inspecione as variáveis globais:
  - `state`: Objeto de combate, rodada, turnos e logs.
  - `PLAYERS`: Array contendo todas as fichas de personagens cadastradas.
  - `localStorage.getItem('dnd_tracker_state_v3')` / `localStorage.getItem('dnd_tracker_players_v3')`.
