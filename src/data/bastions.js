// src/data/bastions.js - Catálogo Oficial de Bastiões D&D 2024 / 5.5 adaptado em Peças de Ouro (PO)

// 29 Instalações Especiais oficiais por nível de desbloqueio
const BASTION_SPECIAL_FACILITIES_CATALOG = {
  // === NÍVEL 5 (Instalações Iniciais) ===
  workshop: {
    key: "workshop",
    name: "Oficina de Artesanato",
    icon: "🔨",
    levelReq: 5,
    desc: "Bancadas de trabalho equipadas com ferramentas para confeccionar itens mundanos, ferramentas ou receber inspiração.",
    orders: ["craft_mundane", "empower_inspiration"],
    hirelingsCount: 1
  },
  smithy: {
    key: "smithy",
    name: "Ferraria do Bastião",
    icon: "⚔️",
    levelReq: 5,
    desc: "Forjas e bigornas para produzir armaduras pesadas e armas de metal por 50% do valor de tabela em PO.",
    orders: ["craft_metal", "equip_garrison", "craft_magic_arms"],
    hirelingsCount: 1
  },
  garden: {
    key: "garden",
    name: "Jardim de Ervas",
    icon: "🌿",
    levelReq: 5,
    desc: "Canteiros protegidos para cultivo de ervas medicinais, poções de cura e ingredientes de venenos.",
    orders: ["harvest_healing", "harvest_poison"],
    hirelingsCount: 1
  },
  arcane_study: {
    key: "arcane_study",
    name: "Estudo Arcano",
    icon: "🔮",
    levelReq: 5,
    desc: "Aposento repleto de círculos arcanos para identificar artefatos e, em níveis avançados, criar itens mágicos.",
    orders: ["identify_relics", "arcane_attunement", "craft_magic_arcana"],
    hirelingsCount: 1
  },
  barrack: {
    key: "barrack",
    name: "Quartel da Guarnição",
    icon: "🛡️",
    levelReq: 5,
    desc: "Alojamento militar para treinar e manter defensores da fortaleza (até 12 guardas).",
    orders: ["recruit_defenders", "patrol_perimeter"],
    hirelingsCount: 1
  },
  armory: {
    key: "armory",
    name: "Armaria & Arsenal",
    icon: "🏹",
    levelReq: 5,
    desc: "Depósito reforçado de armas e escudos que aprimora o treinamento e sobrevivência dos defensores.",
    orders: ["stock_armory"],
    hirelingsCount: 1
  },
  library: {
    key: "library",
    name: "Biblioteca de Sabedoria",
    icon: "📚",
    levelReq: 5,
    desc: "Estantes repletas de tomos históricos, bestiários e mapas de masmorras para pesquisas aprofundadas.",
    orders: ["research_lore"],
    hirelingsCount: 1
  },
  sanctuary: {
    key: "sanctuary",
    name: "Santuário Sagrado",
    icon: "✨",
    levelReq: 5,
    desc: "Altar consagrado às divindades ou forças da natureza para abençoar aventureiros e consagrar água benta.",
    orders: ["sanctuary_prayer", "craft_holy_water"],
    hirelingsCount: 1
  },
  storehouse: {
    key: "storehouse",
    name: "Depósito Comercial",
    icon: "📦",
    levelReq: 5,
    desc: "Galpão seguro para estocagem e comércio de grãos, especiarias e minérios com caravanas regionais.",
    orders: ["trade_commodities"],
    hirelingsCount: 1
  },

  // === NÍVEL 9 (Instalações Avançadas) ===
  laboratory: {
    key: "laboratory",
    name: "Laboratório Alquímico",
    icon: "🧪",
    levelReq: 9,
    desc: "Alambiques e retortas para destilar poções potentes, óleos mágicos e ácidos refinados.",
    orders: ["distill_potion", "craft_alchemist_fire"],
    hirelingsCount: 2
  },
  scriptorium: {
    key: "scriptorium",
    name: "Scriptorium de Pergaminhos",
    icon: "📜",
    levelReq: 9,
    desc: "Mesas de copistas com tintas mágicas e pergaminhos para transcrever pergaminhos de magias.",
    orders: ["scribe_scroll", "forge_documents"],
    hirelingsCount: 2
  },
  teleportation_circle: {
    key: "teleportation_circle",
    name: "Círculo de Teletransporte",
    icon: "🌀",
    levelReq: 9,
    desc: "Sigilos rúnicos gravados no piso de pedra permitindo viagens instantâneas para o Bastião de qualquer lugar.",
    orders: ["tune_circle", "summon_guest_caster"],
    hirelingsCount: 1
  },
  training_area: {
    key: "training_area",
    name: "Área de Treinamento",
    icon: "🎯",
    levelReq: 9,
    desc: "Pátio tático com alvos, bonecos de palha e ringue para aperfeiçoar domínios de armas e defesas.",
    orders: ["train_weapon_mastery", "train_resilience"],
    hirelingsCount: 1
  },
  gaming_hall: {
    key: "gaming_hall",
    name: "Salão de Jogos & Cassino",
    icon: "🎲",
    levelReq: 9,
    desc: "Mesas de cartas, dados e roleta que atraem nobres e viajantes, gerando renda contínua em PO.",
    orders: ["run_gambling_night"],
    hirelingsCount: 3
  },
  greenhouse: {
    key: "greenhouse",
    name: "Estufa Encantada",
    icon: "🌱",
    levelReq: 9,
    desc: "Ambiente com controle térmico e luz solar mágica para plantas raras e flores exóticas.",
    orders: ["grow_rare_herbs"],
    hirelingsCount: 2
  },
  sacristy: {
    key: "sacristy",
    name: "Sacristia Relíquia",
    icon: "🕯️",
    levelReq: 9,
    desc: "Câmara de preparação litúrgica para criar amuletos sagrados e focar energias celestiais.",
    orders: ["craft_holy_relic"],
    hirelingsCount: 1
  },
  stable: {
    key: "stable",
    name: "Estábulo Nobre",
    icon: "🐎",
    levelReq: 9,
    desc: "Baias amplas para cavalos de guerra, grifos ou outras montarias leais com cuidadores especializados.",
    orders: ["train_mounts"],
    hirelingsCount: 2
  },
  theater: {
    key: "theater",
    name: "Teatro & Anfiteatro",
    icon: "🎭",
    levelReq: 9,
    desc: "Palco com acústica refinada onde bardos e atores ensaiam peças que inspiram façanhas heróicas.",
    orders: ["rehearse_epic"],
    hirelingsCount: 3
  },
  trophy_room: {
    key: "trophy_room",
    name: "Sala de Troféus",
    icon: "🏆",
    levelReq: 9,
    desc: "Galeria de cabeças de monstros empalhadas, estandartes de exércitos derrotados e armas lendárias.",
    orders: ["display_trophies"],
    hirelingsCount: 1
  },

  // === NÍVEL 13 (Instalações Heróicas) ===
  pub: {
    key: "pub",
    name: "Taberna do Bastião",
    icon: "🍺",
    levelReq: 13,
    desc: "Taverna aconchegante com barris de cervejas e elixires mágicos que concedem bravura e força inigualáveis.",
    orders: ["brew_titan_ale", "brew_brave_ale"],
    hirelingsCount: 3
  },
  meditation_chamber: {
    key: "meditation_chamber",
    name: "Câmara de Meditação",
    icon: "🧘",
    levelReq: 13,
    desc: "Espaço silencioso cercado de incensos para alcançar paz mental absoluta e antecipar o destino.",
    orders: ["meditate_harmony", "foresee_destiny"],
    hirelingsCount: 1
  },
  observatory: {
    key: "observatory",
    name: "Observatório Astral",
    icon: "🔭",
    levelReq: 13,
    desc: "Cúpula giratória com telescópio de lentes de cristal estelar para ler profecias e vidências dos cosmos.",
    orders: ["astral_divination"],
    hirelingsCount: 2
  },
  reliquary: {
    key: "reliquary",
    name: "Relicário dos Ancestrais",
    icon: "🏺",
    levelReq: 13,
    desc: "Câmara protegida onde relíquias sagradas permitem milagres de ressurreição sem consumo de diamantes.",
    orders: ["bless_restoration"],
    hirelingsCount: 1
  },
  archive: {
    key: "archive",
    name: "Arquivo Ancestral",
    icon: "📜",
    levelReq: 13,
    desc: "Abóbada subterrânea contendo segredos perdidos de impérios arcaicos e lendas de deuses antigos.",
    orders: ["consult_lost_tomes"],
    hirelingsCount: 2
  },
  menagerie: {
    key: "menagerie",
    name: "Menagerie (Zoológico Mágico)",
    icon: "🦁",
    levelReq: 13,
    desc: "Jaulas mágicas e habitats adaptados para manter criaturas monstruosas sob contenção segura.",
    orders: ["house_rare_beasts"],
    hirelingsCount: 3
  },

  // === NÍVEL 17 (Instalações Épicas) ===
  sanctum: {
    key: "sanctum",
    name: "Sanctum Divino",
    icon: "⛩️",
    levelReq: 17,
    desc: "Câmara transcendental onde emanações de cura milagrosa e auras de proteção eterna envolvem os heróis.",
    orders: ["sanctum_heal", "sanctum_aura"],
    hirelingsCount: 2
  },
  demiplane: {
    key: "demiplane",
    name: "Semiplano Dimensional",
    icon: "🌌",
    levelReq: 17,
    desc: "Refúgio extraplanar atemporal onde um descanso revigora a mente e fornece vitality transcendental.",
    orders: ["demiplane_retreat"],
    hirelingsCount: 1
  },
  guildhall: {
    key: "guildhall",
    name: "Sede de Guilda",
    icon: "🏛️",
    levelReq: 17,
    desc: "Grande salão corporativo que sedia guildas regionais (Padeiros, Cervejeiros, Maçons ou Ladrões).",
    orders: ["guild_trade_revenue", "guild_mason_walls"],
    hirelingsCount: 5
  },
  war_room: {
    key: "war_room",
    name: "Sala de Guerra & Comando",
    icon: "⚔️",
    levelReq: 17,
    desc: "Mesa tática com mapas em relevo encantados para comandar legiões de soldados e cerco.",
    orders: ["mobilize_army"],
    hirelingsCount: 4
  }
};

// Catálogo de Ações / Ordens detalhadas com custo em PO, tempo em dias e benefícios
const BASTION_ACTIONS_CATALOG = {
  // --- Nível 5 ---
  craft_mundane: {
    key: "craft_mundane",
    facilityKey: "workshop",
    name: "Fabricar Item Mundano ou Ferramenta",
    levelReq: 5,
    costPO: 0, // variável pelo item selecionado
    costType: "item_base",
    durationDays: 7,
    hasItemSelector: true,
    category: "equipment",
    rewardDesc: "O item escolhido é confeccionado e colocado diretamente no Baú Coletivo do Grupo."
  },
  empower_inspiration: {
    key: "empower_inspiration",
    facilityKey: "workshop",
    name: "Inspirar Artesãos & Heróis",
    levelReq: 5,
    costPO: 0,
    durationDays: 7,
    rewardDesc: "O herói gestor e 1 aliado ganham Inspiração Heróica para usar na próxima sessão de jogo."
  },
  craft_metal: {
    key: "craft_metal",
    facilityKey: "smithy",
    name: "Forjar Armas & Armaduras de Metal",
    levelReq: 5,
    costPO: 0, // 50% do valor do item selecionado
    costType: "metal_half",
    durationDays: 7,
    hasItemSelector: true,
    category: "metal_arms",
    rewardDesc: "Forja o equipamento marcial escolhido por 50% do preço de tabela em PO e envia para o Baú."
  },
  equip_garrison: {
    key: "equip_garrison",
    facilityKey: "smithy",
    name: "Equipar e Afiar Armas da Guarnição",
    levelReq: 5,
    costPO: 50,
    durationDays: 7,
    rewardDesc: "Melhora a defesa da fortaleza, concedendo bônus nos testes contra eventos de ataque invasor."
  },
  harvest_healing: {
    key: "harvest_healing",
    facilityKey: "garden",
    name: "Cultivar Poção de Cura Básica",
    levelReq: 5,
    costPO: 25,
    durationDays: 7,
    rewardItem: { name: "Poção de Cura", type: "consumable", desc: "Recupera 2d4 + 2 Pontos de Vida." },
    rewardDesc: "Produz 1x Poção de Cura (2d4+2) depositada automaticamente no Baú Coletivo."
  },
  harvest_poison: {
    key: "harvest_poison",
    facilityKey: "garden",
    name: "Extrair Frasco de Veneno Básico",
    levelReq: 5,
    costPO: 20,
    durationDays: 7,
    rewardItem: { name: "Frasco de Veneno Básico", type: "consumable", desc: "Aplica em arma: +1d4 de dano de veneno (CD 10)." },
    rewardDesc: "Produz 1x Frasco de Veneno Básico para revestir armas ou flechas."
  },
  identify_relics: {
    key: "identify_relics",
    facilityKey: "arcane_study",
    name: "Identificar & Decifrar Artefatos",
    levelReq: 5,
    costPO: 0,
    durationDays: 7,
    rewardDesc: "Revela todas as propriedades mágicas, comandos e eventuais maldições de itens do Baú."
  },
  arcane_attunement: {
    key: "arcane_attunement",
    facilityKey: "arcane_study",
    name: "Sintonização Arcana",
    levelReq: 5,
    costPO: 0,
    durationDays: 7,
    rewardDesc: "Concede Vantagem em testes de Inteligência (Arcanismo ou História) por 7 dias."
  },
  recruit_defenders: {
    key: "recruit_defenders",
    facilityKey: "barrack",
    name: "Recrutar Defensores para a Fortaleza",
    levelReq: 5,
    costPO: 10,
    durationDays: 7,
    rewardDefenders: 4,
    rewardDesc: "Recruta +4 guardas para a guarnição permanente do Bastião (máx. 12 defensores)."
  },
  patrol_perimeter: {
    key: "patrol_perimeter",
    facilityKey: "barrack",
    name: "Patrulha dos Arredores",
    levelReq: 5,
    costPO: 0,
    durationDays: 7,
    rewardDesc: "Guarnição patrulha as estradas vizinhas, reduzindo riscos de invasões inimigas."
  },
  stock_armory: {
    key: "stock_armory",
    facilityKey: "armory",
    name: "Guarnecer e Blindar o Arsenal",
    levelReq: 5,
    costPO: 50,
    durationDays: 7,
    rewardDesc: "Aumenta a resistência dos defensores contra ataques de criaturas e saqueadores."
  },
  research_lore: {
    key: "research_lore",
    facilityKey: "library",
    name: "Pesquisa Histórica e Monstruosa",
    levelReq: 5,
    costPO: 10,
    durationDays: 7,
    rewardDesc: "Descobre lendas, fraquezas ou segredos de uma criatura ou masmorra da campanha."
  },
  sanctuary_prayer: {
    key: "sanctuary_prayer",
    facilityKey: "sanctuary",
    name: "Prece dos Protetores",
    levelReq: 5,
    costPO: 0,
    durationDays: 7,
    rewardDesc: "Concede o feitiço Palavra de Cura (1d4+Mod) gratuito 1x para um herói na próxima aventura."
  },
  craft_holy_water: {
    key: "craft_holy_water",
    facilityKey: "sanctuary",
    name: "Consagrar Água Benta",
    levelReq: 5,
    costPO: 25,
    durationDays: 7,
    rewardItem: { name: "Frasco de Água Benta", qty: 2, type: "consumable", desc: "2d6 de dano radiante contra mortos-vivos e ínferos." },
    rewardDesc: "Produz 2x Frascos de Água Benta colocados no Baú Coletivo."
  },
  trade_commodities: {
    key: "trade_commodities",
    facilityKey: "storehouse",
    name: "Comércio Regional de Mercadorias",
    levelReq: 5,
    costPO: 50,
    durationDays: 7,
    rewardDesc: "Investe em caravanas locais com retorno comercial de 50 a 150 PO creditados direto no Baú."
  },

  // --- Nível 9 ---
  craft_magic_arms: {
    key: "craft_magic_arms",
    facilityKey: "smithy",
    name: "Forjar Armamento Mágico (+1 / Mithral)",
    levelReq: 9,
    costPO: 200,
    durationDays: 14,
    hasItemSelector: true,
    category: "magic_arms",
    rewardDesc: "Forja a arma mágica +1, escudo +1 ou armadura de mithral selecionada para o Baú."
  },
  distill_potion: {
    key: "distill_potion",
    facilityKey: "laboratory",
    name: "Destilar Poção ou Elixir Alquímico",
    levelReq: 9,
    costPO: 100,
    durationDays: 7,
    hasItemSelector: true,
    category: "potions",
    rewardDesc: "Destila a poção escolhida (Poção Maior de Cura, Força do Gigante, etc.) e envia para o Baú."
  },
  craft_alchemist_fire: {
    key: "craft_alchemist_fire",
    facilityKey: "laboratory",
    name: "Fabricar Frascos de Fogo Alquímico",
    levelReq: 9,
    costPO: 40,
    durationDays: 7,
    rewardItem: { name: "Frasco de Fogo Alquímico", qty: 2, type: "consumable", desc: "1d4 de dano de fogo no início de cada turno do alvo até apagar." },
    rewardDesc: "Produz 2x Frascos de Fogo Alquímico no Baú Coletivo."
  },
  scribe_scroll: {
    key: "scribe_scroll",
    facilityKey: "scriptorium",
    name: "Copiar Pergaminho de Magia (Círculo 1 a 3)",
    levelReq: 9,
    costPO: 50, // 50 PO por círculo
    costType: "spell_circle",
    durationDays: 7,
    hasItemSelector: true,
    category: "spells",
    rewardDesc: "Transcreve a magia selecionada em um Pergaminho de Magia colocado no Baú."
  },
  forge_documents: {
    key: "forge_documents",
    facilityKey: "scriptorium",
    name: "Falsificar Documentos & Selos Reais",
    levelReq: 9,
    costPO: 20,
    durationDays: 7,
    rewardDesc: "Produz salvo-condutos ou decretos nobres autênticos para infiltrações do grupo."
  },
  tune_circle: {
    key: "tune_circle",
    facilityKey: "teleportation_circle",
    name: "Sintonizar Ponto de Retorno de Teletransporte",
    levelReq: 9,
    costPO: 50,
    durationDays: 0,
    rewardDesc: "Registra os glifos do Bastião para que magias como Teletransporte e Círculo de Teletransporte cheguem sem desvios."
  },
  summon_guest_caster: {
    key: "summon_guest_caster",
    facilityKey: "teleportation_circle",
    name: "Convocar Conjurador Visitante",
    levelReq: 9,
    costPO: 100,
    durationDays: 7,
    rewardDesc: "Um mago viajante visita a fortaleza e conjura um feitiço de utilidade (Adivinhação, Moldar Rocha, etc.)."
  },
  train_weapon_mastery: {
    key: "train_weapon_mastery",
    facilityKey: "training_area",
    name: "Treino de Domínio de Arma (Weapon Mastery)",
    levelReq: 9,
    costPO: 0,
    durationDays: 7,
    rewardDesc: "Concede 1 Propriedade de Domínio de Arma temporária para um herói durante 7 dias."
  },
  train_resilience: {
    key: "train_resilience",
    facilityKey: "training_area",
    name: "Treino de Resiliência Física",
    levelReq: 9,
    costPO: 0,
    durationDays: 7,
    rewardDesc: "O herói treinado pode usar sua Reação para reduzir dano sofrido em 1d4 durante 7 dias."
  },
  run_gambling_night: {
    key: "run_gambling_night",
    facilityKey: "gaming_hall",
    name: "Noite de Jogatina & Apostas no Forte",
    levelReq: 9,
    costPO: 0,
    durationDays: 7,
    rewardDesc: "Fatura da casa: gera entre +30 e +120 PO depositados diretamente no Baú Coletivo."
  },
  grow_rare_herbs: {
    key: "grow_rare_herbs",
    facilityKey: "greenhouse",
    name: "Cultivar Ervas Exóticas e Ingredientes de Veneno",
    levelReq: 9,
    costPO: 50,
    durationDays: 7,
    rewardItem: { name: "Poção Maior de Cura", type: "consumable", desc: "Recupera 4d4 + 4 Pontos de Vida." },
    rewardDesc: "Produz 1x Poção Maior de Cura ou venenos exóticos no Baú."
  },
  craft_magic_arcana: {
    key: "craft_magic_arcana",
    facilityKey: "arcane_study",
    name: "Criar Item Mágico Arcano Incomum",
    levelReq: 9,
    costPO: 200,
    durationDays: 14,
    hasItemSelector: true,
    category: "magic_arcana",
    rewardDesc: "Fabrica o artefato arcano selecionado (Varinha +1, Pérola do Poder, etc.) para o Baú."
  },
  craft_holy_relic: {
    key: "craft_holy_relic",
    facilityKey: "sacristy",
    name: "Fabricar Símbolo Sagrado Encantado",
    levelReq: 9,
    costPO: 150,
    durationDays: 7,
    rewardDesc: "Cria um item de fé sagrado (ex: Amuleto de Devoção +1 ou Óleo Abençoado) no Baú."
  },
  train_mounts: {
    key: "train_mounts",
    facilityKey: "stable",
    name: "Adestramento de Montarias de Guerra",
    levelReq: 9,
    costPO: 10,
    durationDays: 14,
    rewardDesc: "Montarias ganham Vantagem permanente em testes de adestramento e +5 Pontos de Vida."
  },
  rehearse_epic: {
    key: "rehearse_epic",
    facilityKey: "theater",
    name: "Ensaiar Peça Heroica com os Aventureiros",
    levelReq: 9,
    costPO: 20,
    durationDays: 14,
    rewardDesc: "Concede 1 Dado de Teatro (1d6) para cada herói do grupo usar em qualquer teste d20 na próxima aventura."
  },
  display_trophies: {
    key: "display_trophies",
    facilityKey: "trophy_room",
    name: "Exibir Despojos e Cabeças de Monstros",
    levelReq: 9,
    costPO: 0,
    durationDays: 7,
    rewardDesc: "Concede Vantagem em testes de Carisma (Intimidação ou Persuasão) com visitantes da fortaleza."
  },

  // --- Nível 13 ---
  brew_titan_ale: {
    key: "brew_titan_ale",
    facilityKey: "pub",
    name: "Servir Cerveja 'Força dos Titãs'",
    levelReq: 13,
    costPO: 25,
    durationDays: 7,
    rewardDesc: "Bebida mágica: concede Vantagem em testes de Força e dano corpo a corpo para o grupo por 24 horas."
  },
  brew_brave_ale: {
    key: "brew_brave_ale",
    facilityKey: "pub",
    name: "Servir Cerveja 'Coração Valente'",
    levelReq: 13,
    costPO: 25,
    durationDays: 7,
    rewardDesc: "Bebida mágica: concede Imunidade à condição Amedrontado para o grupo por 24 horas."
  },
  meditate_harmony: {
    key: "meditate_harmony",
    facilityKey: "meditation_chamber",
    name: "Harmonização Interior dos Sentidos",
    levelReq: 13,
    costPO: 0,
    durationDays: 7,
    rewardDesc: "O herói gestor ganha Vantagem em todos os Testes de Resistência durante o primeiro combate da aventura."
  },
  foresee_destiny: {
    key: "foresee_destiny",
    facilityKey: "meditation_chamber",
    name: "Previsão do Destino do Bastião",
    levelReq: 13,
    costPO: 0,
    durationDays: 7,
    rewardDesc: "Permite rolar 2 vezes na Tabela de Eventos de Bastião e escolher o resultado mais favorável!"
  },
  astral_divination: {
    key: "astral_divination",
    facilityKey: "observatory",
    name: "Adivinhação das Estrelas Celestiais",
    levelReq: 13,
    costPO: 100,
    durationDays: 7,
    rewardDesc: "Concede o efeito das magias Comunhão ou Vidência sem gastar espaços de magia."
  },
  bless_restoration: {
    key: "bless_restoration",
    facilityKey: "reliquary",
    name: "Bênção de Restauração Maior e Reviver",
    levelReq: 13,
    costPO: 100,
    durationDays: 7,
    rewardDesc: "Concede o poder de conjurar Restauração Maior ou Reviver sem gastar diamantes da mochila!"
  },
  consult_lost_tomes: {
    key: "consult_lost_tomes",
    facilityKey: "archive",
    name: "Consultar Tomos Arcanos Perdidos",
    levelReq: 13,
    costPO: 50,
    durationDays: 7,
    rewardDesc: "Revela segredos lendários com efeito da magia Lendas e Histórias sobre itens e vilões."
  },
  house_rare_beasts: {
    key: "house_rare_beasts",
    facilityKey: "menagerie",
    name: "Acomodar Bestas Mágicas e Monstros",
    levelReq: 13,
    costPO: 100,
    durationDays: 7,
    rewardDesc: "Permite manter criaturas exóticas sob vigilância para defesa do forte ou extração de materiais."
  },

  // --- Nível 17 ---
  sanctum_heal: {
    key: "sanctum_heal",
    facilityKey: "sanctum",
    name: "Bênção da Cura Milagrosa (Heal)",
    levelReq: 17,
    costPO: 0,
    durationDays: 7,
    rewardDesc: "Concede 1 uso da magia Cura Completa (recupera 70 PV e cura todas as doenças) sem gastar slots."
  },
  sanctum_aura: {
    key: "sanctum_aura",
    facilityKey: "sanctum",
    name: "Aura Protetora do Bastião",
    levelReq: 17,
    costPO: 0,
    durationDays: 7,
    rewardDesc: "Concede +25 Pontos de Vida Temporários que renovam após cada descanso longo durante 7 dias."
  },
  demiplane_retreat: {
    key: "demiplane_retreat",
    facilityKey: "demiplane",
    name: "Retiro Dimensional Extraplanar",
    levelReq: 17,
    costPO: 0,
    durationDays: 7,
    rewardDesc: "Descanso atemporal: concede +35 Pontos de Vida Temporários que duram 7 dias consecutivos."
  },
  guild_trade_revenue: {
    key: "guild_trade_revenue",
    facilityKey: "guildhall",
    name: "Operação Mercantil de Guilda Semanal",
    levelReq: 17,
    costPO: 0,
    durationDays: 7,
    rewardDesc: "Faturamento fixo semanal: +500 PO creditados diretamente no Baú Coletivo do Grupo."
  },
  guild_mason_walls: {
    key: "guild_mason_walls",
    facilityKey: "guildhall",
    name: "Construção de Muralhas de Pedra Grátis (Maçons)",
    levelReq: 17,
    costPO: 0,
    durationDays: 14,
    rewardDesc: "A Guilda dos Maçons ergue muralhas de pedra permanentes ao redor da fortaleza sem custo em ouro!"
  },
  mobilize_army: {
    key: "mobilize_army",
    facilityKey: "war_room",
    name: "Mobilizar Batalhão de Infantaria",
    levelReq: 17,
    costPO: 100,
    durationDays: 7,
    rewardDesc: "Convoca até 100 soldados e guardas armados para defender a fortaleza ou apoiar em cercos."
  }
};

// Tabela de Eventos de Bastião (d100) adaptada do DMG 2024
const BASTION_EVENTS_TABLE = [
  {
    range: [1, 50],
    title: "Tudo em Paz",
    icon: "🕊️",
    desc: "A semana transcorre com total serenidade na fortaleza. Os serviçais cuidam das tarefas, os guardas mantêm a vigília e a comunidade local prospera.",
    effect: "none"
  },
  {
    range: [51, 60],
    title: "Ataque Invasor / Criaturas Errantes!",
    icon: "⚔️",
    desc: "Um bando de monstros ou saqueadores ataca o perímetro do Bastião tentando invadir as instalações!",
    effect: "attack"
  },
  {
    range: [61, 68],
    title: "Mercador Viajante & Itens Raros",
    icon: "🐪",
    desc: "Uma caravana exótica com tapeçarias, gemas e poções monta acampamento em frente aos portões.",
    effect: "merchant"
  },
  {
    range: [69, 75],
    title: "Recrutas & Refugiados",
    icon: "👥",
    desc: "Trabalhadores e plebeus leais pedem abrigo na fortaleza oferecendo mão de obra dedicada.",
    effect: "recruits"
  },
  {
    range: [76, 82],
    title: "Disputa Nobre / Enviado Oficial",
    icon: "📜",
    desc: "Um arauto de um barão ou magistrado local chega com uma petição diplomática ou proposta de aliança.",
    effect: "diplomacy"
  },
  {
    range: [83, 89],
    title: "Descoberta Secreta nas Fundações",
    icon: "🗝️",
    desc: "Durante obras na fortaleza, os operários encontram uma passagem antiga contendo um baú esquecido (+150 PO no Baú).",
    effect: "treasure"
  },
  {
    range: [90, 95],
    title: "Clima Severo / Tempestade Mágica",
    icon: "⛈️",
    desc: "Ventos uivantes e raios atingem a região. Se houver muralhas, a fortaleza não sofre qualquer impacto.",
    effect: "weather"
  },
  {
    range: [96, 100],
    title: "Bonança & Bênção Extraordinária!",
    icon: "🌟",
    desc: "Um cometa dourado ou bênção divina ilumina o castelo. Todos os heróis recuperam energias e os lucros da semana dobram (+300 PO no Baú).",
    effect: "blessing"
  }
];

// Opções de Muralhas Defensivas em PO
const BASTION_WALL_OPTIONS = {
  none: {
    key: "none",
    name: "Sem Muralhas Externas",
    costPO: 0,
    desc: "A fortaleza fica aberta ao terreno natural. Ataques rolam 6d6 contra os defensores.",
    defenseDice: 6
  },
  wood: {
    key: "wood",
    name: "Paliçada de Madeira Reforçada",
    costPO: 250,
    desc: "Paliçada de troncos pontiagudos com fossos que desaceleram invasores.",
    defenseDice: 5
  },
  stone: {
    key: "stone",
    name: "Muralhas de Pedra com Ameias",
    costPO: 1000,
    desc: "Muralhas altas de alvenaria maciça e portão levadiço de ferro. Reduz o ataque inimigo de 6d6 para 4d6!",
    defenseDice: 4
  }
};
