# Plano de Implementação — ISSUE-169: Overhaul Visual de Modais/Pop-ups, Correção de Instalações não Solicitadas do Bastião e Suíte de Simulação E2E por Agentes (Mestre, Jogador e Sincronização)

## 1. Contexto & Diagnóstico

O usuário solicitou 3 melhorias estratégicas para o sistema:

1. **🎨 Deixar as caixas de pop-up e modais mais bonitas**:
   - Atualmente, as caixas de modais (`.modal-box`, `.modal-body`, `.modal-content`) possuem um visual escuro básico e plano (`#0f1524`, sem gradientes de profundidade, sombras simples e transições abruptas).
   - Melhorar para uma estética **Dark Fantasy Premium**:
     - Fundo com gradiente suave multicamadas (`linear-gradient(180deg, #131c31 0%, #0c1220 100%)`).
     - Borda acetinada com iluminação periférica dourada/âmbar (`box-shadow: 0 25px 70px rgba(0, 0, 0, 0.85), 0 0 0 1px rgba(245, 158, 11, 0.2), 0 0 40px rgba(245, 158, 11, 0.08)`).
     - Animação de entrada suave com efeito spring pop (`animation: modalSpringPop 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards`).
     - Cabeçalhos de modais com tipografia Cinzel, divisores com gradiente dourado e botões `✕` com feedback tátil aprimorado.
     - Botões de rodapé/ação com micro-brilho e estados `:hover` de alto contraste.

2. **🏰 Correção do Bastião (Construções não Solicitadas)**:
   - **Diagnóstico da Causa-Raiz**: Em `src/js/campaigns.js:3240`, a função `getCampaignBastion(camp)` continha construções hardcoded no array inicial `specialFacilities`:
     ```javascript
     specialFacilities: [
       { key: "workshop", name: "Oficina de Artesanato", ... },
       { key: "garden", name: "Jardim de Ervas", ... }
     ]
     ```
   - Toda vez que uma campanha era inicializada ou o bastião era criado, o sistema injetava automaticamente a *Oficina de Artesanato* e o *Jardim de Ervas*, mesmo que o usuário não as tivesse solicitado.
   - **Solução**:
     - Inicializar `specialFacilities: []` como array vazio.
     - O bastião só terá instalações especiais quando o usuário decidir construí-las clicando em **"+ Adicionar Instalação"**.
     - Blindagem da renderização para exibir um card informativo convidativo quando a fortaleza não possuir instalações.

3. **🤖 Suíte de Testes Automatizados por Agentes (Mestre, Jogador e Sincronização)**:
   - Criação da suíte `test_agent_simulation.js` simulando uma sessão completa com múltiplos agentes:
     - **Agente Mestre**: Cria campanha, gerencia bastião limpo, recruta heróis, despacha para combate, aplica dano/cura, distribui XP/ouro e sincroniza via nuvem/broadcast.
     - **Agente Jogador**: Conecta via Portal do Jogador, recebe dados do mestre em tempo real sem regressões, ataca com armas versáteis (1M/2M) ou à distância (consumindo munição), gasta slots de magia e sincroniza.
     - **Auditor de Sincronização**: Valida se todas as alterações feitas pelo Mestre aparecem no Jogador e se ações do Jogador aparecem no Combate e no Grid do Mestre.
   - Integração da **Bateria 138** no `test_runner.js`.

---

## 2. Arquivos e Módulos Afetados

| Arquivo | Modificações Planejadas |
|---|---|
| `src/styles/head_css.html` | Design System dos Modais: `.modal-overlay`, `.modal-box`, `.modal-body`, `.modal-header`, botões de fechar, divisores com glow dourado e animação `modalSpringPop`. |
| `src/js/campaigns.js` | Inicialização limpa de `specialFacilities: []` em `getCampaignBastion`, prevenindo a inserção automática de instalações não solicitadas. |
| `test_agent_simulation.js` | Novo script de teste autônomo simulando jornadas completas de Mestre, Jogadores e Auditoria de Sincronização em tempo real. |
| `test_runner.js` | Adição da **Bateria 138** validando a integridade do Bastião vazio e executando a simulação E2E de agentes. |
| `issues/README.md` | Registro oficial da **ISSUE-169**. |

---

## 3. Estratégia de Verificação e Testes

1. Executar `node test_agent_simulation.js` validando 100% das etapas dos agentes Mestre e Jogador e a sincronização bidirecional.
2. Executar `node test_ui_integrity.js` garantindo integridade nos 617 cliques e 11 abas.
3. Executar `node builder.js` para compilar o HTML standalone atualizado.
4. Executar `node test_runner.js` garantindo 100% de sucesso em todas as baterias (2.462+ testes).
5. Commit e push seguro no Git seguindo as diretrizes de `AGENTS.md`.
