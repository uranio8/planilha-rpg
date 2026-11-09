# 📋 Plano de Implementação: Visual Épico de Upgrade de Bastião (Roadmap & Pré-Requisitos) e Correção do Empty State de Instalações (ISSUE-182)

## 📌 Contexto & Solicitação do Usuário

O usuário enviou uma captura de tela do painel de Bastiões e solicitou duas melhorias essenciais:
> *"vamos adicionar ao plano de implementação melhorias na questão visual do upgrade de basstião, pra q eles possam ter ideia de quando poderão evoluir e os pre-requisitos do proximo nivel. com base no print q enviei, vamos corrigir esse modal de construir a primeira instalação, deixando mais bonito e quando apertar ele me redirecionar para construir a primeira construção."*

### 🔍 Diagnóstico e Problemas Identificados:
1. **Botão Quebrado no Empty State (Bug Crítico)**:
   * No print (`media_1794243588546_ee34c1db.png`), o botão `[ 🏗️ Construir Primeira Instalação ]` possui `onclick="openAddBastionFacilityModal()"`. No entanto, a função real declarada no código é `openBastionAddFacilityModal()`. Ao clicar, ocorre um erro silencioso no console e **nada acontece**, impedindo o usuário de adicionar sua primeira instalação por esse atalho direto.
2. **Estilo Quebrado e Destoante (Botão Branco Plano)**:
   * O botão utiliza `class="btn-primary"`, uma classe inexistente no CSS do projeto. O navegador aplicava a estilização padrão do sistema operacional (fundo branco/cinza plano `buttonface` com texto preto e cantos retos), criando uma quebra visual abrupta na atmosfera dark fantasy.
3. **Falta de Clareza Visual sobre Quando e Como Evoluir o Bastião**:
   * Atualmente, o painel exibe apenas uma barra de porcentagem de Renome (`25 / 60 Renome`).
   * No entanto, a evolução de estágio de assentamento (ex: de *Fazenda* para *Aldeia*) exige **4 pilares de pré-requisitos**:
     1. ⏳ **Tempo / Semanas Ativas** (ex: 4 semanas de administração).
     2. 🏛️ **Salas Construídas** (ex: 2 salas especiais ativas).
     3. 👑 **Renome Acumulado** (ex: 60 pontos de prestígio).
     4. 🪙 **Ouro / Custo de Obra** (ex: 500 PO disponíveis no Cofre ou Baú).
   * Os jogadores atualmente não conseguem ver de imediato quais desses 4 requisitos já foram cumpridos e o que ainda falta alcançar.

---

## 🎯 Objetivos da Implementação (ISSUE-182)

### 1. 🏰 Redesign Hero & Correção do Empty State de Instalações
* **Correção da Ação de Clique**:
  * Substituir a chamada para `openBastionAddFacilityModal()`, garantindo que ao clicar no botão o modal oficial de seleção de instalações especiais (`#modal-bastion-add-facility`) seja aberto imediatamente.
  * Criar alias defensivo no escopo global (`window.openAddBastionFacilityModal = openBastionAddFacilityModal`).
* **Visual Dark Fantasy Épico**:
  * Substituir o botão branco por um botão estilizado `.btn-action` com gradiente dourado (`linear-gradient(135deg, #f59e0b, #d97706)`), texto em alto contraste, cantos arredondados, ícone vibrante e micro-sombra iluminada (`box-shadow: 0 4px 14px rgba(245, 158, 11, 0.35)`).
  * Enriquecer o container do empty state com:
    * Borda suave com gradiente âmbar pontilhado e fundo radial profundo.
    * Ícone de fortaleza iluminado.
    * Chips informativos preview das opções iniciais (ex: `⚔️ Forja`, `🧪 Alquimia`, `🌿 Jardim & Estufa`, `📚 Biblioteca`, `⛪ Santuário`).
    * Frase encorajadora destacando os benefícios da primeira sala.

---

### 2. 🗺️ Roadmap Visual de Evolução & Checklist de Pré-Requisitos
* **No Painel Principal do Bastião (`renderBastionsTab`)**:
  * Adicionar um **Card de Progresso para o Próximo Estágio** com exibição clara:
    * **Título da Próxima Era**: Ex: `🏡 Próxima Evolução: Aldeia Fortificada (Tier 2)`.
    * **Checklist Dinâmico de 4 Pilares** com status visual:
      * ⏳ **Tempo de Gestão**: `Semana X / Y` (badge verde ✅ quando cumprido, ou âmbar ⏳ com semanas restantes).
      * 🏛️ **Ocupação de Salas**: `X / Y Instalações` (badge verde ✅ quando atingido, ou âmbar ⏳ informando quantas salas faltam construir).
      * 👑 **Renome do Domínio**: `X / Y Renome` (badge verde ✅ quando atingido, ou âmbar ⏳ informando quanto renome falta acumular).
      * 🪙 **Custo de Expansão**: `X / Y PO` (somatório de Cofre + Baú, com badge verde ✅ se o grupo possui o valor, ou âmbar ⏳ com o déficit em moedas de ouro).
    * **Texto Resumo Inteligente**: Linha explicativa informando o estado atual, ex:  
      `"Faltam: 3 semanas, 2 salas e 350 PO para que sua Fazenda possa se transformar em uma Aldeia."`  
      ou quando todos os requisitos estiverem cumpridos:  
      `"🎉 Todos os pré-requisitos foram conquistados! Sua fortaleza está pronta para evoluir!"`
    * **Destaque no Botão de Evoluir**: Animação sutil de pulso dourado no botão `✨ Evoluir Assentamento` quando 100% dos requisitos estiverem prontos para a cerimônia.

* **No Modal de Evolução (`#modal-bastion-settlement-upgrade`)**:
  * Incluir barras de progresso individuais (0 a 100%) para cada um dos 4 pré-requisitos, permitindo aos jogadores ver visualmente o quão perto estão em cada frente.
  * Adicionar uma seção comparativa **"Ganhos do Próximo Nível"**:
    * 🏛️ Limite de Instalações: `Atual ➔ Novo` (ex: `2 salas ➔ 4 salas`)
    * 🛡️ Guarnição de Defensores: `Atual ➔ Novo` (ex: `4 soldados ➔ 8 soldados`)
    * 💰 Renda Semanal Territorial: `Atual ➔ Novo` (ex: `+10 PO/sem ➔ +25 PO/sem`)
  * Timeline de eras com destaque diferenciado entre **Concluído**, **Era Atual**, **Próxima Meta** e **Eras Futuras**.

---

## 📁 Arquivos e Módulos Afetados

| Arquivo | Componente / Responsabilidade |
|---|---|
| `src/js/campaigns.js` | Correção do `onclick` para `openBastionAddFacilityModal()`, novo template HTML rico para o empty state, lógica de cálculo do checklist de pré-requisitos do próximo estágio, registro de alias defensivo |
| `src/ui/ui.html` | Atualização do modal `#modal-bastion-settlement-upgrade` com barras de progresso individuais e grid comparativo de ganhos de nível |
| `src/styles/head_css.html` | Estilos para o card hero do empty state, chips de instalações, checklist de pré-requisitos, barras de progresso dos pilares e animação de pulso no botão pronto para evoluir |
| `test_runner.js` | Bateria 149 com testes automatizados para o empty state de bastiões, chamada correta de abertura de modal e validação do checklist de pré-requisitos |
| `issues/README.md` | Registro oficial da ISSUE-182 |

---

## ⚠️ Possíveis Impactos & Riscos Mitigados

* **Zero Quebra de Compatibilidade**: O cálculo de pré-requisitos é puramente reativo com base no estado existente de `bastion` (`turnCount`, `specialFacilities`, `renown`, `bank.gold` e `partyStash.gold`).
* **Proteção Contra Erros de Script**: Alias global `window.openAddBastionFacilityModal` assegura que nenhum evento legado falhe.
* **Preservação de Layout e Performance**: Os novos elementos utilizam flexbox puro e CSS vanilla otimizado, sem injeção de bibliotecas pesadas.
* **Governança de Código**: Nenhuma alteração em `src/` será feita sem autorização explícita do usuário.

---

## 🧪 Estratégia de Verificação

1. **Testes Automatizados (`node test_runner.js`)**:
   * Criação da Bateria 149 testando:
     - Renderização do empty state e presença da função `openBastionAddFacilityModal`.
     - Presença do botão estilizado com classe de ação e sem estilo padrão nulo.
     - Cálculo exato dos 4 pilares de pré-requisitos para cada tier.
     - Status correto (verde ✅ vs pendente ⏳) com base no estado do bastião.
2. **Compilação**:
   * `node builder.js` validando o HTML final standalone gerado.
3. **Verificação Visual e Funcional**:
   * Confirmação de que o botão abre diretamente o modal `#modal-bastion-add-facility`.
   * Verificação visual do checklist de pré-requisitos no painel do bastião e no modal de upgrade.

---

> ⚠️ **Aguardando sua aprovação explícita para iniciar a implementação nos arquivos `src/` conforme as diretrizes de governança (`AGENTS.md`).**
