# 📋 Plano de Implementação: Correção de Incompatibilidades dos Jogadores e Blindagem do Portal do Jogador (ISSUE-155)

## 📌 Contexto & Objetivos
Após auditoria minuciosa simulando a experiência do **Jogador** através do **Portal do Jogador** (`initPlayerPortalMode`), foram identificadas duas frentes de incompatibilidades críticas que afetam a integridade das mesas de RPG:

1. **Incompatibilidades de Regras e Dados nos Heróis Padrão (`src/js/core.js`)**:
   - **Perícias e Salvaguardas Ausentes**: 5 heróis (`Deraravely`, `Arkhalis`, `Marc Hiroshi`, `Lalw`, `Claker`) estavam com arrays vazios de perícias (`skillProficiencies: []`) e salvaguardas (`saveProficiencies: []`), impedindo a aplicação do Bônus de Proficiência canônico de D&D 5E em testes e resistências.
   - **Divergências de Classe de Armadura (CA)**: 4 heróis (`Yoshigake Kira`, `Marc Hiroshi`, `Lalw`, `Caim Vonsilford`) possuíam CA declarada divergente da CA calculada por falta de armadura equipada (`equipped: true`) no inventário.
   - **Inconsistência de Classe/Magia em Lalw**: O herói Lalw (Ladino Nv 3) possui magias e slots de 1º círculo, porém sua subclasse não estava configurada como *Trapaceiro Arcano* (*Arcane Trickster*).
   - **Armamento Incompatível em Arkhalis**: O Mago Nv 1 (Força 7) possuía apenas ataque de Espada Longa com modificador `-2`, sem armas de conjurador (Bordão/Cajado) nem truques mágicos de ataque.
   - **Traços de Personalidade Vazios**: Todos os 9 personagens estavam com `personality: ""` vazio.

2. **Brecha de Segurança no Portal do Jogador (`src/styles/head_css.html`)**:
   - O botão de exclusão de ficha (`.roll20-btn-tool-del`) permanecia visível para os alunos logados no celular ou computador devido ao seletor CSS mirar apenas classes legadas, permitindo a exclusão acidental da própria ficha pelo jogador.
   - O botão de edição completa (`openPlayerModal`) também ficava acessível sem restrição no Portal do Jogador.

---

## 🎯 Proposta de Modificações e Módulos Afetados

### 1. `src/js/core.js` (Bases Canônicas dos 9 Heróis)
- **Deraravely** (Guerreiro 4 / Bárbaro 1):
  - `saveProficiencies`: `['str', 'con']`
  - `skillProficiencies`: `['atletismo', 'sobrevivencia', 'intimidacao', 'percepcao']`
  - `personality`: "Falo pouco e prefiro resolver problemas com ações diretas e coragem."
- **Arkhalis** (Mago 1):
  - `saveProficiencies`: `['int', 'wis']`
  - `skillProficiencies`: `['arcanismo', 'historia', 'investigacao', 'intuicao']`
  - `attacks`: `"Cajado Arcano (+1, 1d6-1 contundente) | Raio de Gelo (+5, 1d8 congelante)"`
  - `personality`: "Curioso e metódico; anoto cada detalhe arcanamente fascinante em meu tomo."
- **Marc Hiroshi** (Ladino 2):
  - `saveProficiencies`: `['dex', 'int']`
  - `skillProficiencies`: `['furtividade', 'prestidigitacao', 'enganacao', 'acrobacia']`
  - `skillExpertises`: `['furtividade', 'prestidigitacao']`
  - `inventory`: Equipa *Armadura de Couro Batido* (`equipped: true`) para sincronizar CA 15 (11 + Des +4).
  - `personality`: "Sempre procuro uma rota de fuga rápida e conto piadas irônicas sob pressão."
- **Lalw** (Ladino 3 - Trapaceiro Arcano):
  - `subclassName`: `"Trapaceiro Arcano"`
  - `subclassIdx`: `2`
  - `saveProficiencies`: `['dex', 'int']`
  - `skillProficiencies`: `['furtividade', 'percepcao', 'investigacao', 'enganacao']`
  - `skillExpertises`: `['furtividade', 'investigacao']`
  - `inventory`: Equipa *Armadura de Couro Batido* (`equipped: true`) para sincronizar CA 15.
  - `personality`: "Fascinado por truques de ilusão e reflexos de luz; nunca recuso um enigma."
- **Claker** (Bruxo 5):
  - `saveProficiencies`: `['wis', 'cha']`
  - `skillProficiencies`: `['arcanismo', 'enganacao', 'religiao', 'intimidacao']`
  - `personality`: "Voz mansa e olhar penetrante; meu pacto sobrenatural é meu maior segredo."
- **Yoshigake Kira** (Paladino 5):
  - `inventory`: Equipa *Cota de Malha* (`equipped: true`) e *Escudo* (`equipped: true`) para sincronizar CA 18 (ou 16 base da armadura).
  - `personality`: "Inflexível na busca pela ordem e proteção absoluta dos fracos."
- **Caim Vonsilford** (Bruxo 3):
  - `inventory`: Equipa *Armadura de Couro* (`equipped: true`) para sincronizar CA 14 (11 + Des +3).
  - `personality`: "Orgulho dracônico inabalável e postura de liderança nata."
- **Koichi** (Ladino 1):
  - `personality`: "Sempre alerta a perigos invisíveis e dedicado a provar seu valor aos veteranos."
- **Zenit** (Feiticeiro 4 / Bruxo 1):
  - `personality`: "Sentindo a centelha mágica arder no peito, protejo meus amigos a qualquer preço."

### 2. `src/styles/head_css.html` (Blindagem do Modo Portal do Jogador)
- Ocultar estritamente o botão de excluir personagem `.roll20-btn-tool-del` e qualquer botão `button[onclick*="deletePlayer"]` sob `body.mode-player-portal`.
- Ocultar o botão de editar ficha estrutural `.roll20-btn-tool[onclick*="openPlayerModal"]` sob `body.mode-player-portal`, mantendo os botões de Rest, Magias, Inventário, Ataques, Rolagens, Diário, A4 e Level-Up totalmente funcionais.

---

## 🧪 Estratégia de Verificação e Testes Automatizados

1. [x] **Bateria 124 em `test_runner.js`**:
   - [x] Validar que todos os 9 heróis possuem `saveProficiencies.length >= 2` e `skillProficiencies.length >= 2`.
   - [x] Validar que a CA calculada pelo inventário equipado bate rigorosamente com a CA da ficha em todos os 9 personagens.
   - [x] Validar que Lalw está configurado como Trapaceiro Arcano.
   - [x] Validar que todos os 9 heróis possuem `personality` preenchido.
   - [x] Validar que o CSS do Portal do Jogador bloqueia `.roll20-btn-tool-del` e botões de exclusão.
   - [x] Validar auto-migração de salvaguardas, perícias e personalidade em `loadFromLocalStorage()`.
2. [x] **Execução de `node builder.js` e `node test_runner.js`** (2210/2210 testes aprovados, 100% de sucesso).
3. [x] **Registro no quadro geral de issues** (`issues/README.md`).
4. [ ] **Commit semântico e push no Git**.
