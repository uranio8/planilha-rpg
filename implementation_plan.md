# 📋 Plano de Execução: Teste Integral do Sistema com Agentes de Simulação Multi-Agente (Playtesting E2E)

## 🎯 Objetivo
Executar uma bateria de testes exaustiva de **todas as funcionalidades do sistema** utilizando nossos **Agentes de Simulação Multi-Agente** (`DMAgent`, `PlayerAgent` e `PlaytestSimulator` em `test_playtest_simulator.js`), complementando a suíte automatizada `test_runner.js`.

---

## 🤖 Escopo de Atuação dos Agentes de Teste

### 1. 🧙‍♂️ Agentes Jogadores (`PlayerAgent` & Fichas Roll20 D&D 5E)
- **Criação & Atributos**: Rolar 4d6 Drop Lowest, aplicar Array Padrão e otimização por classe.
- **Bônus Raciais Canônicos**: Aplicação automática dos bônus de espécie (Humano, Anão, Elfo, Tiefling, etc.).
- **Cálculo de Defesa & Vida**: CA dinâmica (armaduras, escudo, monge, bárbaro) e PV nível 1.
- **Evolução & Marcos de ASI / Talentos**: Subir de nível e escolher marcos de ASI (+2 em atributo ou talentos como *Alerta* e *Robusto* com PV retroativo).
- **Grimório & Magias**: Preparar magias, conjuração com consumo de slots de 1º a 9º círculo, teste de concentração e quebra por dano.
- **Descansos D&D 5E**: Execução de Descanso Curto (gasto de Dados de Vida) e Descanso Longo (recuperação de PV total e 100% dos spell slots).
- **Mochila & Inventário**: Equipar armas/armaduras com badges táteis (`.btn-item-equip-badge`), sanitização de peso (`cleanWeight` sem 'kgkg') e transferência de itens para o Baú do Grupo (`sendPlayerItemToPartyStash`).

### 2. 🏰 Agente Mestre (`DMAgent` & Combat Tracker)
- **Bestiário & Invocação em Lote**: Spawn de criaturas (`MONSTERS_DATA`) com numeração sequencial e iniciativa individual.
- **Ordem de Iniciativa & Rodadas**: Gestão da fila, avanço de turnos (`nextTurn`) e contadores de rodada.
- **Rastreador de Economia de Ações**: Uso de chips táteis para `⚔️ Ação`, `⚡ Bônus` e `🛡️ Reação`, e auto-reset no início do turno do combatente.
- **Ações Rápidas de Monstros**: Rolar ataques diretamente dos cards de iniciativa (`⚔️ Mordida +5`, etc.).
- **Dano & Cura Arbitrários**: Aplicação de dano e cura rápidos com sincronização bidirecional instantânea na ficha do jogador e no combate.
- **Condições D&D 5E**: Aplicação e remoção de status (Caído, Envenenado, Cego, etc.).
- **Distribuição de Saques**: Divisão justa de XP e Peças de Ouro (PO) e depósito no Baú do Grupo.

### 3. 👥 Campanhas, NPCs & Baú Coletivo (`CampaignEngine`)
- **Baú do Grupo (Party Stash)**: Depósito e retirada de PO e itens, com sincronização em tempo real.
- **Contratação de Lacaios / Mercenários**: Teste diário de moral e liquidação de salários da tropa.

### 4. 🏰 Bastiões & Fortaleza (`BastionEngine`)
- **Instalações Especiais**: Criação de cômodos e designação de NPCs supervisores exclusivos (`managerNpcId`).
- **Evolução de Especialistas**: Maestria de 1 a 5 estrelas com redução de prazos de ordens.
- **Cofre do Banco da Fortaleza**: Depósitos, saques e cobrança semanal de salários debitando do banco no avanço de turno (`advanceBastionTurn`).

### 5. 🎯 VTT Grid Tático (`VttEngine`)
- **Tokens no Grid**: Posicionamento, seleção e movimentação de combatentes.
- **Action HUD Flutuante**: Interação com a barra flutuante ancorada sobre o token para ajuste instantâneo de PV (dano -1/-5, cura +1/+5), condições e atalho para a ficha.

### 6. 🔍 Spotlight Omnisearch Global (`OmnisearchEngine`)
- **Busca Unificada (Ctrl+K)**: Pesquisa por monstros, magias, itens, talentos, fichas de alunos, condições canônicas e abas do sistema.

### 7. 🛡️ Auditoria Visual & Sanitização Contínua
- Verificação de ausência de literal `"undefined"`, `"NaN"`, `"kgkg"`.
- Verificação de containers estruturados flexíveis sem colisão de largura fixa ou sobreposição de texto.

---

## 🧪 Estratégia de Verificação
1. Executar o simulador multi-agente expandido:
   ```bash
   node test_playtest_simulator.js
   ```
2. Executar a suíte de testes unitários e de integração:
   ```bash
   node test_runner.js
   ```
3. Confirmar que 100% dos testes e todas as fases da simulação foram concluídos com sucesso.
