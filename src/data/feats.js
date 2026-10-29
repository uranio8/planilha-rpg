// ============================================================================
// 📜 D&D 5E FEATS (TALENTOS) - COMPÊNDIO OFICIAL E INTUITIVO
// Baseado no Livro do Jogador (PHB 5E) e adaptado com tópicos diretos e visuais.
// ============================================================================

const FEATS_DATA = [
  {
    id: "adepto_elemental",
    name: "Adepto Elemental",
    nameEn: "Elemental Adept",
    icon: "🔥",
    category: "Magia",
    prereq: "Capacidade de conjurar pelo menos uma magia",
    summary: "Seus feitiços de um elemento escolhido perfuram resistências e causam mais dano consistente.",
    statBonus: null,
    benefits: [
      "Escolha um elemento ao adquirir este talento: Ácido, Elétrico, Fogo, Frio ou Trovão.",
      "As magias que você conjurar **ignoram resistência** ao tipo de dano escolhido.",
      "Ao rolar dano de magia desse tipo, qualquer resultado **1** no dado é tratado como **2**.",
      "Pode ser escolhido múltiplas vezes, escolhendo um tipo de elemento diferente a cada vez."
    ]
  },
  {
    id: "adepto_marcial",
    name: "Adepto Marcial",
    nameEn: "Martial Adept",
    icon: "⚔️",
    category: "Combate",
    prereq: "Nenhum",
    summary: "Aprenda manobras táticas de guerreiro Mestre de Batalha para dominar o campo de luta.",
    statBonus: null,
    benefits: [
      "Aprende **2 manobras** à sua escolha da lista do Mestre de Batalha (Guerreiro).",
      "Ganha **1 Dado de Superioridade (d6)** (ou +1 dado extra se já possuir a habilidade).",
      "O dado é recuperado após um **Descanso Curto ou Longo**.",
      "CD da salvaguarda das manobras = 8 + Bônus de Proficiência + mod de Força ou Destreza."
    ]
  },
  {
    id: "alerta",
    name: "Alerta",
    nameEn: "Alert",
    icon: "👁️",
    category: "Percepção / Combate",
    prereq: "Nenhum",
    summary: "Reflexos instantâneos contra emboscadas e bônus massivo em iniciativa.",
    statBonus: null,
    initiativeBonus: 5,
    benefits: [
      "Recebe **+5 de bônus fixo na Iniciativa**.",
      "Você **não pode ser surpreendido** enquanto estiver consciente.",
      "Inimigos ocultos ou invisíveis **não ganham vantagem** nas jogadas de ataque contra você."
    ]
  },
  {
    id: "ambidestro",
    name: "Ambidestro",
    nameEn: "Dual Wielder",
    icon: "🗡️",
    category: "Combate",
    prereq: "Nenhum",
    summary: "Domínio no combate com duas armas, aumentando sua defesa e permitindo armas maiores.",
    statBonus: null,
    acBonus: 1,
    benefits: [
      "Ganha **+1 na Classe de Armadura (CA)** enquanto empunhar uma arma corpo a corpo em cada mão.",
      "Pode usar Combater com Duas Armas mesmo com armas que **não possuam a propriedade Leve** (ex: duas Espadas Longas ou Rapieiras).",
      "Pode sacar ou embainhar duas armas de uma mão simultaneamente (em vez de apenas uma)."
    ]
  },
  {
    id: "atacante_bestial",
    name: "Atacante Bestial",
    nameEn: "Savage Attacker",
    icon: "🩸",
    category: "Combate",
    prereq: "Nenhum",
    summary: "Golpes brutais que permitem rerrolar dados de dano baixos em combate corporal.",
    statBonus: null,
    benefits: [
      "Uma vez por turno, ao rolar o dano de um ataque corpo a corpo com arma, você pode **rerrolar os dados de dano** e escolher o melhor resultado."
    ]
  },
  {
    id: "atirador_agucado",
    name: "Atirador Aguçado",
    nameEn: "Sharpshooter",
    icon: "🎯",
    category: "Combate à Distância",
    prereq: "Nenhum",
    summary: "Disparos de longa distância cirúrgicos que ignoram cobertura e causam dano devastador.",
    statBonus: null,
    benefits: [
      "Disparar no alcance longo de armas à distância **não impõe desvantagem**.",
      "Seus ataques à distância ignoram **Meia Cobertura (+2 CA)** e **Três-Quartos de Cobertura (+5 CA)**.",
      "Poder de Disparo: Antes de atacar, pode aceitar **–5 no teste de acerto** para somar **+10 no dano** se atingir."
    ]
  },
  {
    id: "atirador_de_magia",
    name: "Atirador de Magia",
    nameEn: "Spell Sniper",
    icon: "⚡",
    category: "Magia",
    prereq: "Capacidade de conjurar pelo menos uma magia",
    summary: "Amplie o alcance dos seus feitiços de ataque e ignore obstáculos no caminho.",
    statBonus: null,
    benefits: [
      "O alcance de qualquer magia sua que exija jogada de ataque é **dobrado**.",
      "Seus ataques mágicos à distância ignoram **Meia Cobertura** e **Três-Quartos de Cobertura**.",
      "Aprende **1 truque** adicional com ataque à distância da lista de Bardo, Bruxo, Clérigo, Druida, Feiticeiro ou Mago."
    ]
  },
  {
    id: "atleta",
    name: "Atleta",
    nameEn: "Athlete",
    icon: "🏃",
    category: "Físico",
    prereq: "Força ou Destreza 13 ou maior",
    summary: "Condicionamento físico superior para mobilidade ágil em escaladas, quedas e saltos.",
    statBonus: { choice: ["str", "dex"], amount: 1 },
    benefits: [
      "Aumenta sua **Força** ou **Destreza** em +1 (até o máximo de 20).",
      "Levantar-se do chão caído consome apenas **1,5 metro** de deslocamento (em vez da metade).",
      "Escalar superfícies **não custa movimento adicional**.",
      "Pode realizar saltos em distância ou altura com impulso movendo apenas 1,5m em vez de 3m."
    ]
  },
  {
    id: "ator",
    name: "Ator",
    nameEn: "Actor",
    icon: "🎭",
    category: "Social / Perícia",
    prereq: "Nenhum",
    summary: "Mestre em disfarces, interpretação dramática e imitação de vozes e sons.",
    statBonus: { choice: ["cha"], amount: 1 },
    benefits: [
      "Aumenta seu **Carisma** em +1 (até o máximo de 20).",
      "Ganha **vantagem** em testes de Atuação e Enganação ao fingir ser outra pessoa.",
      "Pode **imitar com perfeição** a fala de uma pessoa ou sons de uma criatura que tenha ouvido por pelo menos 1 minuto."
    ]
  },
  {
    id: "combatente_montado",
    name: "Combatente Montado",
    nameEn: "Mounted Combatant",
    icon: "🐎",
    category: "Combate",
    prereq: "Nenhum",
    summary: "Supremacia tática enquanto estiver a cavalo ou sobre qualquer montaria de combate.",
    statBonus: null,
    benefits: [
      "Ganha **vantagem** em ataques corpo a corpo contra alvos desmontados menores que sua montaria.",
      "Pode redirecionar ataques direcionados à sua montaria para você mesmo.",
      "Concede Evasão à sua montaria: se ela passar em teste de DES para metade do dano, sofre **zero dano** (e metade se falhar)."
    ]
  },
  {
    id: "conjurador_de_guerra",
    name: "Conjurador de Guerra",
    nameEn: "War Caster",
    icon: "🛡️",
    category: "Magia / Combate",
    prereq: "Capacidade de conjurar pelo menos uma magia",
    summary: "Mantenha a concentração em batalha e conjure magias com armas empunhadas ou como reação.",
    statBonus: null,
    benefits: [
      "Ganha **vantagem em testes de Constituição** para manter a concentração em magias ao sofrer dano.",
      "Pode realizar componentes somáticos de magias mesmo empunhando armas ou escudo em ambas as mãos.",
      "Reação Agressiva: quando um inimigo provocar ataque de oportunidade, pode conjurar uma magia de ação única nele em vez de golpear."
    ]
  },
  {
    id: "conjurador_de_ritual",
    name: "Conjurador de Ritual",
    nameEn: "Ritual Caster",
    icon: "📖",
    category: "Magia",
    prereq: "Inteligência ou Sabedoria 13 ou maior",
    summary: "Aprenda um livro de rituais para lançar utilidades mágicas sem gastar espaços de magia.",
    statBonus: null,
    benefits: [
      "Recebe um **Livro de Rituais** com 2 magias de 1º círculo com a tag [Ritual] da classe escolhida.",
      "Pode conjurar essas magias como rituais (adicionando 10 minutos ao tempo) sem gastar slots de magia.",
      "Pode transcrever novos pergaminhos ou grimórios com rituais que encontrar pelo caminho (2 horas e 50 PO por círculo)."
    ]
  },
  {
    id: "curandeiro",
    name: "Curandeiro",
    nameEn: "Healer",
    icon: "🩹",
    category: "Suporte",
    prereq: "Nenhum",
    summary: "Transforme kits de primeiros socorros em ferramentas de cura tática rápida.",
    statBonus: null,
    benefits: [
      "Ao usar um Kit de Primeiros Socorros para estabilizar um aliado à beira da morte, ele recupera **1 PV** imediatamente.",
      "Como uma ação, pode gastar 1 uso do kit para curar **1d6 + 4 PV + número de Dados de Vida do alvo** (1x por criatura por descanso)."
    ]
  },
  {
    id: "duelista_defensivo",
    name: "Duelista Defensivo",
    nameEn: "Defensive Duelist",
    icon: "🤺",
    category: "Combate",
    prereq: "Destreza 13 ou maior",
    summary: "Aparar golpes corpo a corpo com a ponta de uma arma leve ou rapieira.",
    statBonus: null,
    benefits: [
      "Ao empunhar uma arma de acuidade e ser atingido corpo a corpo, use sua reação para **somar seu Bônus de Proficiência na CA** contra o ataque, podendo fazê-lo errar."
    ]
  },
  {
    id: "especialista_em_besta",
    name: "Especialista em Besta",
    nameEn: "Crossbow Expert",
    icon: "🏹",
    category: "Combate à Distância",
    prereq: "Nenhum",
    summary: "Recarga instantânea e disparos mortais à queima-roupa com bestas.",
    statBonus: null,
    benefits: [
      "Ignora a propriedade de **Recarga** de bestas com as quais seja proficiente.",
      "Estar a até 1,5m de um inimigo **não impõe desvantagem** em seus ataques à distância.",
      "Ao atacar com arma de uma mão, pode usar uma **Ação Bônus** para disparar com uma besta de mão carregada."
    ]
  },
  {
    id: "especialista_em_briga",
    name: "Especialista em Briga",
    nameEn: "Tavern Brawler",
    icon: "🍺",
    category: "Combate / Desarmado",
    prereq: "Nenhum",
    summary: "Lute com garrafas, cadeiras e punhos, agarrando oponentes no mesmo fluxo.",
    statBonus: { choice: ["str", "con"], amount: 1 },
    benefits: [
      "Aumenta sua **Força** ou **Constituição** em +1 (até o máximo de 20).",
      "Seus ataques desarmados causam **1d4 + mod** de dano de contusão.",
      "Proficiência com armas improvisadas (cadeiras, tochas, mesas).",
      "Ao acertar um ataque desarmado ou improvisado no seu turno, use uma **Ação Bônus para Agarrar** o alvo."
    ]
  },
  {
    id: "explorador_de_cavernas",
    name: "Explorador de Cavernas",
    nameEn: "Dungeon Delver",
    icon: "🔦",
    category: "Exploração",
    prereq: "Nenhum",
    summary: "Sentidos apurados para masmorras: portas secretas, armadilhas e proteção contra perigos.",
    statBonus: null,
    benefits: [
      "Vantagem em Percepção e Investigação para encontrar portas secretas.",
      "Vantagem em testes de resistência para evitar armadilhas.",
      "**Resistência** a qualquer dano provocado por armadilhas.",
      "Pode procurar armadilhas em ritmo normal de viagem."
    ]
  },
  {
    id: "imobilizador",
    name: "Imobilizador",
    nameEn: "Grappler",
    icon: "🤼",
    category: "Combate",
    prereq: "Força 13 ou maior",
    summary: "Luta agarrada corpo a corpo para subjugar e imobilizar oponentes totalmente.",
    statBonus: null,
    benefits: [
      "Você tem **vantagem em ataques** contra qualquer criatura que você esteja agarrando.",
      "Pode usar sua ação para tentar imobilizar o alvo: se passar, ambos ficam **Impedidos** até o fim do agarre."
    ]
  },
  {
    id: "iniciado_em_magia",
    name: "Iniciado em Magia",
    nameEn: "Magic Initiate",
    icon: "🔮",
    category: "Magia",
    prereq: "Nenhum",
    summary: "Aprenda truques e uma magia de 1º círculo de outra tradição arcana ou divina.",
    statBonus: null,
    benefits: [
      "Escolha uma classe: Bardo, Bruxo, Clérigo, Druida, Feiticeiro ou Mago.",
      "Aprende **2 Truques** da lista dessa classe.",
      "Aprende **1 magia de 1º círculo**, que pode conjurar 1 vez gratuitamente por Descanso Longo."
    ]
  },
  {
    id: "investida_poderosa",
    name: "Investida Poderosa",
    nameEn: "Charger",
    icon: "🦬",
    category: "Combate",
    prereq: "Nenhum",
    summary: "Corra em linha reta e descarregue um golpe devastador ou empurre o adversário.",
    statBonus: null,
    benefits: [
      "Ao usar a ação de Disparada, pode usar uma **Ação Bônus** para realizar um ataque ou empurrar uma criatura.",
      "Se tiver se movido pelo menos 3 metros em linha reta, ganha **+5 no dano** do golpe ou empurra o alvo até 3 metros."
    ]
  },
  {
    id: "lider_inspirador",
    name: "Líder Inspirador",
    nameEn: "Inspiring Leader",
    icon: "👑",
    category: "Social / Suporte",
    prereq: "Carisma 13 ou maior",
    summary: "Discursos motivacionais que concedem pontos de vida temporários a todo o grupo.",
    statBonus: null,
    benefits: [
      "Discurse por 10 minutos para inspirar até **6 aliados** a até 9 metros.",
      "Cada aliado recebe PVs Temporários iguais a: **seu Nível + seu mod de Carisma**.",
      "Pode ser usado novamente após um Descanso Curto ou Longo."
    ]
  },
  {
    id: "maestria_em_arma_de_haste",
    name: "Maestria em Arma de Haste",
    nameEn: "Polearm Master",
    icon: "🔱",
    category: "Combate",
    prereq: "Nenhum",
    summary: "Ataques adicionais com o cabo e controle de espaço ameaçador contra quem se aproxima.",
    statBonus: null,
    benefits: [
      "Ao atacar com Glaive, Alabarda, Lança ou Bordão, pode usar uma **Ação Bônus** para golpear com a outra ponta (1d4 contundente + mod).",
      "Criaturas provocam **ataque de oportunidade** de você no momento exato em que entrarem no seu alcance de alcance da arma."
    ]
  },
  {
    id: "maestria_em_armadura_media",
    name: "Maestria em Armadura Média",
    nameEn: "Medium Armor Master",
    icon: "🥋",
    category: "Equipamento",
    prereq: "Proficiência em armadura média",
    summary: "Movimente-se em silêncio com armaduras médias e aproveite até +3 de Destreza na CA.",
    statBonus: null,
    benefits: [
      "Vestir armadura média **não impõe desvantagem** em testes de Furtividade.",
      "O bônus máximo de Destreza somado à CA em armaduras médias sobe de **+2 para +3** (caso tenha DES 16+)."
    ]
  },
  {
    id: "maestria_em_armadura_pesada",
    name: "Maestria em Armadura Pesada",
    nameEn: "Heavy Armor Master",
    icon: "🛡️",
    category: "Equipamento / Defesa",
    prereq: "Proficiência em armadura pesada",
    summary: "Defesa couraçada que reduz o impacto de ataques físicos não-mágicos.",
    statBonus: { choice: ["str"], amount: 1 },
    damageReduction: 3,
    benefits: [
      "Aumenta sua **Força** em +1 (até o máximo de 20).",
      "Enquanto vestir armadura pesada, **reduz em 3** todo dano de Contusão, Cortante e Perfurante de ataques não-mágicos."
    ]
  },
  {
    id: "matador_de_conjuradores",
    name: "Matador de Conjuradores",
    nameEn: "Mage Slayer",
    icon: "✨",
    category: "Combate",
    prereq: "Nenhum",
    summary: "Punição imediata para magos e feiticeiros que tentarem conjurar perto de você.",
    statBonus: null,
    benefits: [
      "Quando uma criatura a até 1,5m conjurar uma magia, use sua reação para desferir um ataque corpo a corpo nela.",
      "Ao causar dano a quem se concentra em magia, o alvo tem **desvantagem** no teste de concentração.",
      "Ganha **vantagem** em qualquer salvaguarda contra magias conjuradas a até 1,5m de você."
    ]
  },
  {
    id: "mente_afiada",
    name: "Mente Afiada",
    nameEn: "Keen Mind",
    icon: "🧠",
    category: "Mental",
    prereq: "Nenhum",
    summary: "Memória fotográfica perfeita, senso de direção infalível e cronômetro mental.",
    statBonus: { choice: ["int"], amount: 1 },
    benefits: [
      "Aumenta sua **Inteligência** em +1 (até o máximo de 20).",
      "Sempre sabe com precisão absoluta a direção do Norte.",
      "Sempre sabe quantas horas faltam para o nascer ou pôr do sol.",
      "Pode recordar qualquer coisa vista ou ouvida no último mês com riqueza de detalhes."
    ]
  },
  {
    id: "mestre_de_armas",
    name: "Mestre de Armas",
    nameEn: "Weapon Master",
    icon: "🗡️",
    category: "Combate",
    prereq: "Nenhum",
    summary: "Treinamento intensivo para dominar quatro armas marciais ou simples à sua escolha.",
    statBonus: { choice: ["str", "dex"], amount: 1 },
    benefits: [
      "Aumenta sua **Força** ou **Destreza** em +1 (até o máximo de 20).",
      "Ganha proficiência com **4 armas** simples ou marciais à sua escolha."
    ]
  },
  {
    id: "mestre_de_armas_grandes",
    name: "Mestre de Armas Grandes",
    nameEn: "Great Weapon Master",
    icon: "🪓",
    category: "Combate",
    prereq: "Nenhum",
    summary: "Golpes colossais com armas pesadas: ataque extra no crítico/abate e troca de acerto por dano.",
    statBonus: null,
    benefits: [
      "Ao acertar um **Crítico** ou **reduzir um inimigo a 0 PV**, pode realizar um ataque corpo a corpo extra como Ação Bônus.",
      "Poder de Golpe: com armas pesadas, pode aceitar **–5 no acerto** para somar **+10 de dano** no impacto."
    ]
  },
  {
    id: "mestre_de_escudo",
    name: "Mestre de Escudo",
    nameEn: "Shield Master",
    icon: "🛡️",
    category: "Combate / Defesa",
    prereq: "Nenhum",
    summary: "Use seu escudo ofensivamente para derrubar inimigos e defletir magias de área como fogo.",
    statBonus: null,
    benefits: [
      "Ao realizar a ação de Ataque, use uma **Ação Bônus para empurrar/derrubar** uma criatura a até 1,5m com o escudo.",
      "Soma o bônus de CA do seu escudo aos testes de resistência de Destreza contra magias de alvo único.",
      "Se for alvo de efeito de área (como Bola de Fogo), use a reação para sofrer **zero dano** se passar no teste de DES."
    ]
  },
  {
    id: "mobilidade",
    name: "Mobilidade",
    nameEn: "Mobile",
    icon: "👟",
    category: "Movimento / Combate",
    prereq: "Nenhum",
    summary: "Velocidade acelerada, corrida através de terrenos difíceis e esquiva de golpes de oportunidade.",
    statBonus: null,
    speedBonus: 3,
    benefits: [
      "Seu deslocamento aumenta em **+3 metros**.",
      "Ao usar a ação de Disparada, terrenos difíceis **não custam movimento extra**.",
      "Ao desferir um ataque corpo a corpo contra um inimigo, ele **não pode fazer ataques de oportunidade** contra você pelo resto do turno (mesmo se você errar o golpe)."
    ]
  },
  {
    id: "observador",
    name: "Observador",
    nameEn: "Observant",
    icon: "🔍",
    category: "Percepção",
    prereq: "Nenhum",
    summary: "Percepção e dedução sobre-humanas: leitura labial e bônus passivo massivo.",
    statBonus: { choice: ["int", "wis"], amount: 1 },
    passiveBonus: 5,
    benefits: [
      "Aumenta sua **Inteligência** ou **Sabedoria** em +1 (até o máximo de 20).",
      "Pode fazer **leitura labial** de criaturas que falem idiomas conhecidos a até alcance visual.",
      "Recebe **+5 de bônus fixo na Percepção Passiva** e na **Investigação Passiva**."
    ]
  },
  {
    id: "perito",
    name: "Perito",
    nameEn: "Skilled",
    icon: "🛠️",
    category: "Perícia",
    prereq: "Nenhum",
    summary: "Versatilidade e especialização técnica em três novas perícias ou ferramentas.",
    statBonus: null,
    benefits: [
      "Ganha proficiência imediata em **3 perícias ou ferramentas** à sua escolha."
    ]
  },
  {
    id: "poliglota",
    name: "Poliglota",
    nameEn: "Linguist",
    icon: "📜",
    category: "Social / Idiomas",
    prereq: "Nenhum",
    summary: "Fluência em múltiplos idiomas e criação de cifras indecifráveis por meios comuns.",
    statBonus: { choice: ["int"], amount: 1 },
    benefits: [
      "Aumenta sua **Inteligência** em +1 (até o máximo de 20).",
      "Aprende **3 idiomas** adicionais à sua escolha.",
      "Pode criar criptogramas escritos que ninguém consegue decifrar sem teste resistido ou magia."
    ]
  },
  {
    id: "protecao_leve",
    name: "Proteção Leve",
    nameEn: "Lightly Armored",
    icon: "🦺",
    category: "Equipamento",
    prereq: "Nenhum",
    summary: "Treinamento para vestir armaduras de couro e acolchoadas sem penalidades.",
    statBonus: { choice: ["str", "dex"], amount: 1 },
    benefits: [
      "Aumenta sua **Força** ou **Destreza** em +1 (até o máximo de 20).",
      "Ganha proficiência com **Armaduras Leves**."
    ]
  },
  {
    id: "protecao_moderada",
    name: "Proteção Moderada",
    nameEn: "Moderately Armored",
    icon: "🛡️",
    category: "Equipamento",
    prereq: "Proficiência em armadura leve",
    summary: "Domínio de armaduras médias e escudos para maior proteção em combate.",
    statBonus: { choice: ["str", "dex"], amount: 1 },
    benefits: [
      "Aumenta sua **Força** ou **Destreza** em +1 (até o máximo de 20).",
      "Ganha proficiência com **Armaduras Médias** e **Escudos**."
    ]
  },
  {
    id: "protecao_pesada",
    name: "Proteção Pesada",
    nameEn: "Heavily Armored",
    icon: "🦾",
    category: "Equipamento",
    prereq: "Proficiência em armadura média",
    summary: "Capacidade de trajar cotas de malha e placas de metal pesadas.",
    statBonus: { choice: ["str"], amount: 1 },
    benefits: [
      "Aumenta sua **Força** em +1 (até o máximo de 20).",
      "Ganha proficiência com **Armaduras Pesadas**."
    ]
  },
  {
    id: "resiliente",
    name: "Resiliente",
    nameEn: "Resilient",
    icon: "💎",
    category: "Defesa",
    prereq: "Nenhum",
    summary: "Fortifique um atributo fraco e adquira proficiência em seus testes de salvaguarda.",
    statBonus: { choice: ["str", "dex", "con", "int", "wis", "cha"], amount: 1 },
    benefits: [
      "Escolha um atributo: Força, Destreza, Constituição, Inteligência, Sabedoria ou Carisma.",
      "Aumenta o atributo escolhido em **+1** (até o máximo de 20).",
      "Ganha **proficiência nas Salvaguardas** (testes de resistência) desse atributo."
    ]
  },
  {
    id: "resistente",
    name: "Resistente",
    nameEn: "Durable",
    icon: "❤️",
    category: "Físico / Sobrevivência",
    prereq: "Nenhum",
    summary: "Resiliência física que garante recuperação acelerada e mínima em descansos curtos.",
    statBonus: { choice: ["con"], amount: 1 },
    benefits: [
      "Aumenta sua **Constituição** em +1 (até o máximo de 20).",
      "Ao rolar um Dado de Vida em descanso curto, o valor mínimo recuperado no dado é igual a **2x seu mod de CON** (mínimo 2)."
    ]
  },
  {
    id: "robusto",
    name: "Robusto",
    nameEn: "Tough",
    icon: "💖",
    category: "Físico / Sobrevivência",
    prereq: "Nenhum",
    summary: "Aumento massivo de vida (+2 PV por nível) para suportar os golpes mais letais.",
    statBonus: null,
    hpPerLevel: 2,
    benefits: [
      "Seu PV Máximo aumenta imediatamente em **2x seu nível atual**.",
      "A cada novo nível que você avançar, seu PV Máximo ganha **+2 PV adicionais**."
    ]
  },
  {
    id: "sentinela",
    name: "Sentinela",
    nameEn: "Sentinel",
    icon: "⛓️",
    category: "Combate / Controle",
    prereq: "Nenhum",
    summary: "Trava inimigos no lugar, corta desengajamentos e pune quem ousar atacar seus aliados.",
    statBonus: null,
    benefits: [
      "Ao acertar um ataque de oportunidade, o **deslocamento da criatura cai para 0** pelo resto do turno.",
      "Inimigos provocam ataques de oportunidade mesmo se usarem a ação **Desengajar**.",
      "Se um inimigo a até 1,5m atacar um aliado ao seu lado, use sua reação para **contra-atacar o agressor** imediatamente."
    ]
  },
  {
    id: "sorrateiro",
    name: "Sorrateiro",
    nameEn: "Skulker",
    icon: "🥷",
    category: "Furtividade",
    prereq: "Destreza 13 ou maior",
    summary: "Mestre em espreitar pelas sombras, atacar à distância sem se revelar e ver na penumbra.",
    statBonus: null,
    benefits: [
      "Pode tentar se Esconder mesmo estando apenas levemente obscurecido.",
      "Errar um ataque à distância enquanto estiver oculto **não revela sua posição**.",
      "A penumbra **não impõe desvantagem** em seus testes de Percepção baseados em visão."
    ]
  },
  {
    id: "sortudo",
    name: "Sortudo",
    nameEn: "Lucky",
    icon: "🍀",
    category: "Destino",
    prereq: "Nenhum",
    summary: "Três pontos de sorte por descanso longo para dobrar o destino e evitar falhas críticas.",
    statBonus: null,
    luckPoints: 3,
    benefits: [
      "Possui **3 Pontos de Sorte** recuperados em Descanso Longo.",
      "Ao fazer um ataque, teste de perícia ou salvaguarda, pode gastar 1 ponto para **rolar 1d20 adicional** e escolher o resultado.",
      "Quando um inimigo atacar você, gaste 1 ponto para rolar 1d20 e forçar o atacante a usar o seu dado se for menor."
    ]
  },
  // ==========================================================================
  // 📜 TALENTOS RACIAIS EXCLUSIVOS (GUIA DE XANATHAR - ISSUE-161)
  // ==========================================================================
  {
    id: "precisao_elfica",
    name: "Precisão Élfica",
    nameEn: "Elven Accuracy",
    source: "Xanathar's Guide",
    icon: "🏹",
    category: "Talento Racial",
    prereq: "Elfo ou Meio-Elfo",
    racePrereq: ["elfo", "meio-elfo", "drow", "eladrin", "shadar-kai"],
    summary: "A mira infalível dos elfos permite rolar um terceiro d20 sempre que tiver vantagem.",
    statBonus: { options: ["dex", "int", "wis", "cha"], amount: 1 },
    benefits: [
      "Aumente sua **Destreza, Inteligência, Sabedoria ou Carisma em +1** (até o máximo de 20).",
      "Sempre que você tiver **Vantagem** em uma jogada de ataque usando Destreza, Inteligência, Sabedoria ou Carisma, você pode **rerrolar um dos dados d20** uma vez (super-vantagem com 3d20)."
    ]
  },
  {
    id: "sorte_abundante",
    name: "Sorte Abundante",
    nameEn: "Bountiful Luck",
    source: "Xanathar's Guide",
    icon: "🍀",
    category: "Talento Racial",
    prereq: "Halfling",
    racePrereq: ["halfling"],
    summary: "Compartilhe a sorte lendária do seu povo com seus aliados em momentos críticos.",
    statBonus: null,
    benefits: [
      "Quando um aliado que você possa ver a até **9 metros (30 pés)** rolar um **1** no d20 em uma jogada de ataque, teste de atributo ou salvaguarda, você pode usar sua **Reação** para permitir que o aliado rerrole o dado.",
      "Quando você usa essa habilidade, não pode usar seu traço racial *Sortudo* até o final do seu próximo turno."
    ]
  },
  {
    id: "chamas_de_phlegethos",
    name: "Chamas de Phlegethos",
    nameEn: "Flames of Phlegethos",
    source: "Xanathar's Guide",
    icon: "🔥",
    category: "Talento Racial",
    prereq: "Tiefling",
    racePrereq: ["tiefling"],
    summary: "Domine o fogo infernal dos Nove Infernos, envolvendo seu corpo em chamas retaliatórias.",
    statBonus: { options: ["int", "cha"], amount: 1 },
    benefits: [
      "Aumente sua **Inteligência ou Carisma em +1** (até o máximo de 20).",
      "Ao rolar dano de **Fogo** com uma magia que você conjurar, você pode **rerrolar qualquer resultado 1** nos dados de dano de fogo.",
      "Sempre que conjurar uma magia que cause dano de fogo, chamas envolvem você até o fim do seu próximo turno (luz plena a 9m, e qualquer criatura a até 1,5m que o atinja corpo a corpo sofre **1d4 de dano de fogo**)."
    ]
  },
  {
    id: "constituicao_infernal",
    name: "Constituição Infernal",
    nameEn: "Infernal Constitution",
    source: "Xanathar's Guide",
    icon: "😈",
    category: "Talento Racial",
    prereq: "Tiefling",
    racePrereq: ["tiefling"],
    summary: "Sangue abissal espesso que protege contra o frio congelante e venenos mortais.",
    statBonus: { options: ["con"], amount: 1 },
    benefits: [
      "Aumente sua **Constituição em +1** (até o máximo de 20).",
      "Você adquire **Resistência a dano de Frio e de Veneno**.",
      "Você tem **Vantagem em salvaguardas** para evitar ou encerrar a condição **Envenenado**."
    ]
  },
  {
    id: "fortitude_enanica",
    name: "Fortitude Enânica",
    nameEn: "Dwarven Fortitude",
    source: "Xanathar's Guide",
    icon: "🛡️",
    category: "Talento Racial",
    prereq: "Anão",
    racePrereq: ["anao", "anão", "duergar"],
    summary: "O sangue de pedra dos anões permite recuperar fôlego e vida ao se esquivar em combate.",
    statBonus: { options: ["con"], amount: 1 },
    benefits: [
      "Aumente sua **Constituição em +1** (até o máximo de 20).",
      "Sempre que você realizar a ação **Esquivar (Dodge)** em combate, você pode gastar **um Dado de Vida** para se curar imediatamente (role o dado + seu modificador de Constituição)."
    ]
  },
  {
    id: "furia_orc",
    name: "Fúria Orc",
    nameEn: "Orcish Fury",
    source: "Xanathar's Guide",
    icon: "🪓",
    category: "Talento Racial",
    prereq: "Meio-Orc ou Orc",
    racePrereq: ["orc", "meio-orc"],
    summary: "Canalize a fúria implacável de Gruumsh em golpes devastadores e contra-ataques à beira da morte.",
    statBonus: { options: ["str", "con"], amount: 1 },
    benefits: [
      "Aumente sua **Força ou Constituição em +1** (até o máximo de 20).",
      "Quando atingir com um ataque usando uma arma simples ou marcial, você pode rolar **um dado de dano adicional da arma** e somá-lo como dano extra (1x por descanso curto ou longo).",
      "Imediatamente após usar seu traço *Resistência Implacável*, você pode usar sua **Reação** para realizar um ataque com arma."
    ]
  },
  {
    id: "prodigio",
    name: "Prodígio",
    nameEn: "Prodigy",
    source: "Xanathar's Guide",
    icon: "🎓",
    category: "Talento Racial",
    prereq: "Humano, Meio-Elfo ou Meio-Orc",
    racePrereq: ["humano", "meio-elfo", "meio-orc", "orc"],
    summary: "Facilidade inata para dominar novas perícias, ferramentas, idiomas e Especialização.",
    statBonus: null,
    benefits: [
      "Você ganha proficiência em **uma Perícia** à sua escolha, **uma Ferramenta** à sua escolha e fluência em **um Idioma** à sua escolha.",
      "**Especialização (Expertise):** Escolha uma perícia na qual você tenha proficiência. Seu bônus de proficiência é **dobrado** para qualquer teste que use essa perícia."
    ]
  },
  {
    id: "segunda_chance",
    name: "Segunda Chance",
    nameEn: "Second Chance",
    source: "Xanathar's Guide",
    icon: "🎲",
    category: "Talento Racial",
    prereq: "Halfling",
    racePrereq: ["halfling"],
    summary: "A sorte favorece você quando um inimigo tenta acertá-lo, forçando-o a rerrolar o ataque.",
    statBonus: { options: ["dex", "con", "cha"], amount: 1 },
    benefits: [
      "Aumente sua **Destreza, Constituição ou Carisma em +1** (até o máximo de 20).",
      "Quando uma criatura que você possa ver atingir você com uma jogada de ataque, você pode usar sua **Reação** para forçar aquela criatura a **rerrolar o ataque** (1x por combate ou descanso curto)."
    ]
  },
  {
    id: "agachamento_agil",
    name: "Agachamento Ágil",
    nameEn: "Squat Nimbleness",
    source: "Xanathar's Guide",
    icon: "🥾",
    category: "Talento Racial",
    prereq: "Anão ou uma raça Pequena (Halfling, Gnomo, Goblin, Kobold)",
    racePrereq: ["anao", "anão", "duergar", "halfling", "gnomo", "goblin", "kobold", "fada", "harengon"],
    summary: "Passos surpreendentemente velozes e facilidade para escapar de agarrões.",
    statBonus: { options: ["str", "dex"], amount: 1 },
    benefits: [
      "Aumente sua **Força ou Destreza em +1** (até o máximo de 20).",
      "Aumente seu **Deslocamento de caminhada em +1,5 metro (+5 pés)**.",
      "Você ganha proficiência na perícia **Acrobacia ou Atletismo** (à sua escolha).",
      "Você tem **Vantagem** em qualquer teste de Força (Atletismo) ou Destreza (Acrobacia) para escapar de estar **Agarrado (Grappled)**."
    ]
  },
  {
    id: "alta_magia_drow",
    name: "Alta Magia Drow",
    nameEn: "Drow High Magic",
    source: "Xanathar's Guide",
    icon: "🕷️",
    category: "Talento Racial",
    prereq: "Elfo (Drow)",
    racePrereq: ["elfo", "drow"],
    summary: "Desbloqueie os segredos místicos mais profundos da nobreza de Menzoberranzan.",
    statBonus: null,
    benefits: [
      "Você aprende a magia *Detectar Magia* e pode conjurá-la **à vontade**, sem gastar espaço de magia.",
      "Você também aprende *Levitação* e *Dissipar Magia*, podendo conjurar cada uma delas 1x por descanso longo sem gastar espaço de magia (Carisma é o atributo de conjuração)."
    ]
  },
  {
    id: "teletransporte_feerico",
    name: "Teletransporte Feérico",
    nameEn: "Fey Teleportation",
    source: "Xanathar's Guide",
    icon: "✨",
    category: "Talento Racial",
    prereq: "Elfo (Alto Elfo ou Eladrin)",
    racePrereq: ["elfo", "eladrin"],
    summary: "Estudos sobre a Agrestia das Fadas permitem que você atravesse o espaço num piscar de olhos.",
    statBonus: { options: ["int", "cha"], amount: 1 },
    benefits: [
      "Aumente sua **Inteligência ou Carisma em +1** (até o máximo de 20).",
      "Você aprende a falar, ler e escrever **Silvestre**.",
      "Você aprende a magia *Passo Nebuloso (Misty Step)* e pode conjurá-la 1x sem gastar espaço de magia, recuperando o uso após um **Descanso Curto ou Longo**."
    ]
  },
  {
    id: "magia_da_floresta",
    name: "Magia da Floresta",
    nameEn: "Wood Elf Magic",
    source: "Xanathar's Guide",
    icon: "🌿",
    category: "Talento Racial",
    prereq: "Elfo (Elfo da Floresta)",
    racePrereq: ["elfo"],
    summary: "Harmonia mística com as matas antigas, concedendo truques druídicos e furtividade em grupo.",
    statBonus: null,
    benefits: [
      "Você aprende **um truque de Druida** à sua escolha.",
      "Você aprende as magias *Passos Largos (Longstrider)* e *Passos sem Pegadas (Pass without Trace)*, podendo conjurar cada uma 1x por descanso longo sem gastar espaço de magia (Sabedoria é o atributo de conjuração)."
    ]
  },
  {
    id: "couro_de_dragao",
    name: "Couro de Dragão",
    nameEn: "Dragon Hide",
    source: "Xanathar's Guide",
    icon: "🐲",
    category: "Talento Racial",
    prereq: "Draconato",
    racePrereq: ["draconato"],
    summary: "Escamas endurecidas e garras retráteis manifestam a herança dos dragões ancestrais.",
    statBonus: { options: ["str", "con", "cha"], amount: 1 },
    benefits: [
      "Aumente sua **Força, Constituição ou Carisma em +1** (até o máximo de 20).",
      "Enquanto não estiver vestindo armadura, sua **CA base é 13 + seu modificador de Destreza** (você ainda pode usar escudo).",
      "Você possui **garras retráteis** que causam **1d4 + seu modificador de Força** de dano cortante em ataques desarmados."
    ]
  },
  {
    id: "temor_draconico",
    name: "Temor Dracônico",
    nameEn: "Dragon Fear",
    source: "Xanathar's Guide",
    icon: "🦁",
    category: "Talento Racial",
    prereq: "Draconato",
    racePrereq: ["draconato"],
    summary: "Canalize seu Sopro de Dragão em um rugido aterrorizante que paralisa o coração dos inimigos.",
    statBonus: { options: ["str", "con", "cha"], amount: 1 },
    benefits: [
      "Aumente sua **Força, Constituição ou Carisma em +1** (até o máximo de 20).",
      "Em vez de exalar energia destrutiva, você pode gastar um uso do seu *Sopro de Dragão* para rugir. Cada criatura à sua escolha a até **9 metros (30 pés)** deve passar em uma salvaguarda de Sabedoria (**CD 8 + Bônus de Proficiência + mod Carisma**) ou ficará **Amedrontada** por 1 minuto."
    ]
  },
  {
    id: "desvanecer",
    name: "Desvanecer",
    nameEn: "Fade Away",
    source: "Xanathar's Guide",
    icon: "💨",
    category: "Talento Racial",
    prereq: "Gnomo",
    racePrereq: ["gnomo"],
    summary: "Ilusões gnômicas reflexivas tornam você invisível imediatamente após sofrer dano.",
    statBonus: { options: ["dex", "int"], amount: 1 },
    benefits: [
      "Aumente sua **Destreza ou Inteligência em +1** (até o máximo de 20).",
      "Imediatamente após sofrer dano, você pode usar sua **Reação** para se tornar magicamente **Invisível** até o final do seu próximo turno (ou até atacar, causar dano ou forçar uma salvaguarda). Recupera após um **Descanso Curto ou Longo**."
    ]
  }
];

// ============================================================================
// 🔍 FUNÇÕES AUXILIARES DE BUSCA E VALIDAÇÃO DE PRÉ-REQUISITOS
// ============================================================================

function findFeatById(featId) {
  if (!featId) return null;
  const target = String(featId).toLowerCase().trim();
  return FEATS_DATA.find(f => 
    f.id.toLowerCase() === target || 
    (f.nameEn && f.nameEn.toLowerCase() === target)
  ) || null;
}

function findFeatByName(name) {
  if (!name) return null;
  const target = String(name).toLowerCase().trim();
  return FEATS_DATA.find(f => 
    f.name.toLowerCase() === target || 
    (f.nameEn && f.nameEn.toLowerCase() === target) ||
    f.id.toLowerCase() === target
  ) || null;
}

function checkFeatPrerequisites(player, feat) {
  if (!feat) return { met: true, reason: 'Nenhum' };
  const f = typeof feat === 'string' ? (findFeatById(feat) || findFeatByName(feat)) : feat;
  if (!f) return { met: true, reason: 'Nenhum' };
  if (!f.prereq || f.prereq.toLowerCase() === 'nenhum' || f.prereq.trim() === '') {
    return { met: true, reason: 'Nenhum' };
  }

  if (!player) return { met: true, reason: f.prereq };

  const prereqLower = f.prereq.toLowerCase();

  // 0. Força ou Destreza 13 ou maior
  if (prereqLower.includes('força ou destreza 13') || prereqLower.includes('for ou des 13')) {
    const strVal = player.str !== undefined ? player.str : 10;
    const dexVal = player.dex !== undefined ? player.dex : 10;
    if (strVal < 13 && dexVal < 13) {
      return { met: false, reason: `Exige Força ou Destreza 13 ou maior (FOR: ${strVal}, DES: ${dexVal})` };
    }
  } else {
    // 1. Força 13 ou maior
    if (prereqLower.includes('força 13') || prereqLower.includes('for 13') || prereqLower.includes('strength 13')) {
      const val = player.str !== undefined ? player.str : 10;
      if (val < 13) return { met: false, reason: `Exige Força 13 ou maior (atual: ${val})` };
    }

    // 2. Destreza 13 ou maior
    if (prereqLower.includes('destreza 13') || prereqLower.includes('des 13') || prereqLower.includes('dexterity 13')) {
      const val = player.dex !== undefined ? player.dex : 10;
      if (val < 13) return { met: false, reason: `Exige Destreza 13 ou maior (atual: ${val})` };
    }
  }

  // 3. Inteligência ou Sabedoria 13 ou maior
  if (prereqLower.includes('inteligência ou sabedoria 13') || prereqLower.includes('int ou sab 13')) {
    const intVal = player.int !== undefined ? player.int : 10;
    const wisVal = player.wis !== undefined ? player.wis : 10;
    if (intVal < 13 && wisVal < 13) {
      return { met: false, reason: `Exige Inteligência ou Sabedoria 13 ou maior (INT: ${intVal}, SAB: ${wisVal})` };
    }
  }

  // 4. Carisma 13 ou maior
  if (prereqLower.includes('carisma 13') || prereqLower.includes('car 13') || prereqLower.includes('charisma 13')) {
    const val = player.cha !== undefined ? player.cha : 10;
    if (val < 13) return { met: false, reason: `Exige Carisma 13 ou maior (atual: ${val})` };
  }

  // 5. Capacidade de conjurar magias
  if (prereqLower.includes('conjurar pelo menos uma magia') || prereqLower.includes('conjurador') || prereqLower.includes('spellcasting')) {
    const isCasterClass = (player.className || '').toLowerCase().match(/(mago|bruxo|feiticeiro|clerigo|bardo|druida|paladino|guardiao|patrulheiro|artifice)/);
    const hasSpells = (player.preparedSpells && player.preparedSpells.length > 0) || (player.slots && player.slots.some(s => s > 0));
    if (!isCasterClass && !hasSpells) {
      return { met: false, reason: 'Exige capacidade de conjurar pelo menos uma magia' };
    }
  }

  // 6. Pré-requisito Racial (Talentos Raciais de Xanathar)
  if (Array.isArray(f.racePrereq) && f.racePrereq.length > 0 && player.race) {
    const normPlayerRace = String(player.race).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const raceMatch = f.racePrereq.some(r => {
      const normReq = String(r).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      return normPlayerRace.includes(normReq) || normReq.includes(normPlayerRace);
    });
    if (!raceMatch) {
      return { met: false, reason: `Exige Raça/Espécie: ${f.prereq} (atual: ${player.race})` };
    }
  }

  return { met: true, reason: f.prereq };
}

if (typeof window !== "undefined") {
  window.FEATS_DATA = FEATS_DATA;
  window.findFeatById = findFeatById;
  window.findFeatByName = findFeatByName;
  window.checkFeatPrerequisites = checkFeatPrerequisites;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = { FEATS_DATA, findFeatById, findFeatByName, checkFeatPrerequisites };
}
