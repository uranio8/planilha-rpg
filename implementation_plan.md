# Plano de Implementação — ISSUE-165: Suíte Completa de Integridade de UI (`test_ui_integrity.js`), Correção de Botões Órfãos e Agente QA Tester

## 1. Contexto & Diagnóstico
Para garantir que **todas as funcionalidades do sistema sejam testadas sempre que fizermos mudanças nele**, realizamos uma auditoria em larga escala em todos os 617 elementos com ações de clique (`onclick`) declarados em `src/ui/ui.html`.

A varredura revelou pequenos pontos de vulnerabilidade onde certas chamadas de botão causavam erros silenciosos no console ou referências indefinidas:
1. O botão `#btn-batch-reward-select-camp` chamava `selectCurrentCampaignBatchRewardHeroes()`, que não estava implementada no código (`is not defined`).
2. O botão `#btn-modal-print-editable-pdf` chamava `exportCurrentModalPlayerEditablePdf()`, cujo módulo `pdf_export.js` não estava sendo importado no simulador de cliques.
3. A função `setBastionActionFilter` tentava acessar `btnEl.classList.add()` sem verificar se `btnEl` e `classList` existiam.
4. O botão de salvar monstro customizado (`saveCustomMonsterToBestiary`) e o modo de transcrição de magias (`switchPickerMode('copy')`) careciam de verificações defensivas quando chamados fora de contexto.

---

## 2. Objetivos da Implementação

### 2.1 Agente QA Tester Especializado (`qa-tester`)
- Subagente autônomo já registrado no sistema (`qa-tester`) com ferramentas de inspeção, execução de comandos e diagnóstico para rodar as suítes e verificar a integridade da aplicação após qualquer mudança.

### 2.2 Suíte Completa de Testes de Integridade de UI (`test_ui_integrity.js`)
- Criar o script independente `test_ui_integrity.js` que:
  1. Carrega todos os módulos de dados (`src/data/*`) e scripts (`src/js/*`), incluindo `pdf_export.js`, `trait_quick_rules.js`, `bastions.js`, `hirelings.js` e `feats.js`.
  2. Inicializa o estado completo da aplicação (`initApp()`, `renderPlayers()`, `renderCombat()`, `renderCampaigns()`, `renderBestiary()`, etc.).
  3. Testa a alternância de **todas as 11 abas do sistema** (`switchTab`) garantindo renderização limpa.
  4. Executa **todas as 617+ ações `onclick` de `ui.html`**, verificando se alguma função quebra ou gera exceção não tratada.
  5. Testa a abertura e fechamento de **todos os 25+ modais** do sistema.
  6. Valida que `console.error` não registre erros fatais durante as execuções.

### 2.3 Correções Defensivas nos Módulos `src/`
- `src/js/players.js`: Implementar `selectCurrentCampaignBatchRewardHeroes()` para selecionar apenas os heróis da campanha ativa no modal de recompensas em lote.
- `src/js/players.js`: Adicionar guarda defensiva em `switchPickerMode` caso nenhum herói de magia esteja selecionado.
- `src/js/campaigns.js`: Adicionar verificação opcional `btnEl && btnEl.classList` em `setBastionActionFilter`.
- `src/js/compendium.js`: Adicionar tratamento defensivo em `saveCustomMonsterToBestiary` para validar campos do formulário antes de ler propriedades.

---

## 3. Arquivos Afetados

| Arquivo | Descrição das Alterações |
|---|---|
| `test_ui_integrity.js` *(novo/atualizado)* | Script de auditoria global de integridade de UI, cliques, abas e modais. |
| `src/js/players.js` | Implementação de `selectCurrentCampaignBatchRewardHeroes` e blindagem em `switchPickerMode`. |
| `src/js/campaigns.js` | Blindagem defensiva em `setBastionActionFilter`. |
| `src/js/compendium.js` | Validação defensiva em `saveCustomMonsterToBestiary`. |
| `test_runner.js` | **Bateria 134**: Integração da validação de integridade de UI na suíte principal. |
| `issues/README.md` | Registro formal da ISSUE-165. |

---

## 4. Validação e Testes
- Executar `node test_ui_integrity.js` (validando 100% de aprovação nas 617+ ações sem falhas).
- Executar `node builder.js`.
- Executar `node test_runner.js` (validando aprovação de todas as baterias).
- Invocação de teste com o subagente `qa-tester`.
