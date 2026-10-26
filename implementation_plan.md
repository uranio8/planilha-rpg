# Plano de Implementação: Simulador de Mesa com Agentes de Testes (Mestre e Jogadores)

## 📌 Contexto e Objetivos

Implementar um framework de **Simulação de Mesa Multi-Agente (Multi-Agent Tabletop Simulator)** para o **Planilha RPG**, permitindo que agentes automatizados assumam os papéis de **Mestre (Dungeon Master)** e **Jogadores (Player Characters)** com personas específicas. Esse sistema executará rodadas completas de jogo, validando a integridade das regras do D&D 5E, a sincronização em tempo real de estado (PV, slots de magia, baú, combate) e a ausência de colisões de layout.

---

## 🏗️ Arquitetura Proposta

O framework será composto por 3 módulos principais:

### 1. `DMAgent` (Agente Mestre de Masmorras)
- **Orquestração de Encontros**: Carrega monstros do bestiário (`MONSTERS_DATA`), adiciona ao combate em lote e rola iniciativas.
- **Aplicação de Danos e Condições**: Consegue mirar em alvos únicos ou aplicar efeitos em área (ex: dano de Baforada de Dragão ou Bola de Fogo).
- **Gestão de Recompensas e Campanha**: Concede experiência e ouro em lote para aventureiros da mesa e envia itens especiais para o Baú do Grupo.
- **Avanço de Turnos**: Conclui rodadas no gerenciador de iniciativa e monitora a derrota de inimigos.

### 2. `PlayerAgent` (Agente Jogador com Personas Canônicas)
- **Persona Conjurador (Mago)**:
  - Gerencia o limite de magias preparadas (`Mod INT + Nível`).
  - Gasta e restaura espaços de magia de 1º a 9º círculo.
  - Testa estados de concentração (evita concentração simultânea) e utiliza o Grimório permanente.
- **Persona Guerreiro (Vanguarda/Min-Maxer)**:
  - Equipa armas e armaduras no inventário, atualizando CA e bônus de ataque automaticamente.
  - Consome poções de cura em momentos críticos (PV < 30%).
  - Utiliza ações adicionais e talentos (ex: *Alerta*, *Robusto*).

### 3. `PlaytestSimulator` (Orquestrador de Sessão de Jogo)
- Conecta o `DMAgent` com múltiplos `PlayerAgent` em um loop de rodadas cronometradas.
- Simula a sincronização bidirecional de estado (Mestre ⇄ Jogador).
- **Auditoria Visual & Sanitização**:
  - Verifica ausência de termos anômalos no DOM gerado (`kgkg`, `undefined`, `NaN`).
  - Audita integridade dos botões de ação e ausência de sobreposição.
- Gera relatório estruturado ao final da simulação com estatísticas de combate (dano total causado, recursos consumidos, rodadas decorridas).

---

## 📁 Arquivos Afetados / Criados

1. **`test_playtest_simulator.js` (Novo)**:
   - Script standalone executável via `node test_playtest_simulator.js`.
   - Contém as classes `DMAgent`, `PlayerAgent` e `PlaytestSimulator` com simulações completas de cenários (Dungeon Crawl, Combate de Chefe e Descanso Longo).
2. **`test_runner.js`**:
   - Inclusão da **Bateria 113**, validando a inicialização dos agentes, a resolução de ações do Mestre, a resposta dos Jogadores e o relatório de auditoria.
3. **`issues/README.md`**:
   - Registro da **ISSUE-144** documentando a arquitetura do simulador de agentes e as métricas de qualidade.

---

## 🛡️ Riscos e Mitigações

- **Impacto em Dados Existentes**: Nenhum. Os agentes operam em sandboxes isoladas de teste ou criam entidades efêmeras identificadas por prefixo `test-agent-*`, sem afetar campanhas reais dos usuários.
- **Performance**: O simulador é executado em memória de forma assíncrona ultra-rápida, completando cenários de 5 rodadas em milissegundos.

---

## ✅ Estratégia de Validação

1. Executar `node test_playtest_simulator.js` e validar a aprovação de todos os cenários simulados.
2. Executar `node test_runner.js` e garantir 100% de aprovação (todas as baterias anteriores + Bateria 113).
3. Verificar integridade do bundle com `node builder.js`.
