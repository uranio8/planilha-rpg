// src/data/invocations.js - Catálogo Oficial de Invocações Místicas do Bruxo (D&D 5E)
// Fontes: Livro do Jogador (PHB), Guia de Xanathar sobre Todas as Coisas (XGE) e Caldeirão de Todas as Coisas de Tasha (TCE)

const WARLOCK_INVOCATIONS_DATA = [
  {
    id: "agonizing_blast",
    name: "Rajada Agonizante",
    originalName: "Agonizing Blast",
    source: "PHB",
    minLevel: 1,
    cantripRequired: "Rajada Mística",
    pactRequired: null,
    type: "Modificador de Rajada",
    summary: "Adiciona seu modificador de Carisma ao dano de cada raio de Rajada Mística.",
    description: "Quando você conjura a magia Rajada Mística, adicione seu modificador de Carisma ao dano causado por cada feixe que atingir o alvo."
  },
  {
    id: "armor_of_shadows",
    name: "Armadura das Sombras",
    originalName: "Armor of Shadows",
    source: "PHB",
    minLevel: 1,
    cantripRequired: null,
    pactRequired: null,
    type: "Magia à Vontade",
    spellGranted: "Armadura Arcana",
    summary: "Conjure Armadura Arcana em si mesmo à vontade, sem gastar espaços de magia ou componentes.",
    description: "Você pode conjurar Armadura Arcana em si mesmo à vontade, sem gastar um espaço de magia ou componentes materiais."
  },
  {
    id: "devils_sight",
    name: "Visão Diabólica",
    originalName: "Devil's Sight",
    source: "PHB",
    minLevel: 1,
    cantripRequired: null,
    pactRequired: null,
    type: "Sentido Sobrenatural",
    summary: "Enxerga normalmente na escuridão mágica e não-mágica até 36 metros (120 pés).",
    description: "Você pode ver normalmente na escuridão, tanto mágica quanto não-mágica, a uma distância de até 36 metros."
  },
  {
    id: "eldritch_sight",
    name: "Visão do Reino Oculto",
    originalName: "Eldritch Sight",
    source: "PHB",
    minLevel: 1,
    cantripRequired: null,
    pactRequired: null,
    type: "Magia à Vontade",
    spellGranted: "Detectar Magia",
    summary: "Conjure Detectar Magia à vontade, sem gastar espaços de magia.",
    description: "Você pode conjurar Detectar Magia à vontade, sem gastar um espaço de magia."
  },
  {
    id: "eyes_of_the_rune_keeper",
    name: "Olhos do Guardião das Runas",
    originalName: "Eyes of the Rune Keeper",
    source: "PHB",
    minLevel: 1,
    cantripRequired: null,
    pactRequired: null,
    type: "Passivo",
    summary: "Você pode ler todas as formas de escrita e símbolos mágicos.",
    description: "Você pode ler todas as formas de escrita, sejam elas linguagens esquecidas, runas secretas ou idiomas exóticos."
  },
  {
    id: "fiendish_vigor",
    name: "Vigor Bestial",
    originalName: "Fiendish Vigor",
    source: "PHB",
    minLevel: 1,
    cantripRequired: null,
    pactRequired: null,
    type: "Magia à Vontade",
    spellGranted: "Vitalidade Falsa",
    summary: "Conjure Vitalidade Falsa em si mesmo à vontade (concede 1d4+4 PV temporários).",
    description: "Você pode conjurar Vitalidade Falsa em si mesmo à vontade como uma magia de 1º círculo, sem gastar um espaço de magia ou componentes materiais."
  },
  {
    id: "gaze_of_two_minds",
    name: "Olhar de Duas Mentes",
    originalName: "Gaze of Two Minds",
    source: "PHB",
    minLevel: 1,
    cantripRequired: null,
    pactRequired: null,
    type: "Ação",
    summary: "Toque um humanoide voluntário para perceber o mundo através dos sentidos dele.",
    description: "Você pode usar uma ação para tocar um humanoide voluntário e perceber através dos seus sentidos até o final do seu próximo turno. Enquanto estiver usando os sentidos dele, você ganha os benefícios de quaisquer sentidos especiais que ele possua, mas fica cego e surdo em relação aos seus próprios arredores."
  },
  {
    id: "mask_of_many_faces",
    name: "Máscara das Muitas Faces",
    originalName: "Mask of Many Faces",
    source: "PHB",
    minLevel: 1,
    cantripRequired: null,
    pactRequired: null,
    type: "Magia à Vontade",
    spellGranted: "Disfarçar-se",
    summary: "Conjure Disfarçar-se à vontade, sem gastar espaços de magia.",
    description: "Você pode conjurar Disfarçar-se à vontade, sem gastar um espaço de magia."
  },
  {
    id: "misty_visions",
    name: "Visões Nebulosas",
    originalName: "Misty Visions",
    source: "PHB",
    minLevel: 1,
    cantripRequired: null,
    pactRequired: null,
    type: "Magia à Vontade",
    spellGranted: "Imagem Silenciosa",
    summary: "Conjure Imagem Silenciosa à vontade, sem gastar espaços de magia ou componentes.",
    description: "Você pode conjurar Imagem Silenciosa à vontade, sem gastar um espaço de magia ou componentes materiais."
  },
  {
    id: "eldritch_spear",
    name: "Lança Mística",
    originalName: "Eldritch Spear",
    source: "PHB",
    minLevel: 1,
    cantripRequired: "Rajada Mística",
    pactRequired: null,
    type: "Modificador de Rajada",
    summary: "O alcance da sua Rajada Mística aumenta de 36m para 90m (300 pés).",
    description: "Quando você conjura Rajada Mística, o alcance da magia aumenta para 90 metros."
  },
  {
    id: "repelling_blast",
    name: "Rajada Repulsiva",
    originalName: "Repelling Blast",
    source: "PHB",
    minLevel: 1,
    cantripRequired: "Rajada Mística",
    pactRequired: null,
    type: "Modificador de Rajada",
    summary: "Ao atingir uma criatura com Rajada Mística, você pode empurrá-la até 3m em linha reta.",
    description: "Quando você atingir uma criatura com Rajada Mística, você pode empurrá-la até 3 metros em linha reta para longe de você com cada feixe que acertar."
  },
  {
    id: "lance_of_lethargy",
    name: "Lança da Letargia",
    originalName: "Lance of Lethargy",
    source: "XGE",
    minLevel: 1,
    cantripRequired: "Rajada Mística",
    pactRequired: null,
    type: "Modificador de Rajada",
    summary: "1×/turno, atingir com Rajada Mística reduz o deslocamento do alvo em 3m.",
    description: "Uma vez em cada um dos seus turnos, quando você acertar uma criatura com sua Rajada Mística, você pode reduzir o deslocamento daquela criatura em 3 metros até o final do seu próximo turno."
  },
  {
    id: "grasp_of_hadar",
    name: "Abraço de Hadar",
    originalName: "Grasp of Hadar",
    source: "XGE",
    minLevel: 1,
    cantripRequired: "Rajada Mística",
    pactRequired: null,
    type: "Modificador de Rajada",
    summary: "1×/turno, acertar com Rajada Mística puxa o alvo 3m em linha reta em sua direção.",
    description: "Uma vez em cada um dos seus turnos quando você acertar uma criatura com sua Rajada Mística, você pode puxá-la até 3 metros em linha reta em sua direção."
  },
  {
    id: "eldritch_mind",
    name: "Mente Vigorosa",
    originalName: "Eldritch Mind",
    source: "TCE",
    minLevel: 1,
    cantripRequired: null,
    pactRequired: null,
    type: "Passivo",
    summary: "Vantagem em salvaguardas de Constituição para manter a concentração em magias.",
    description: "Você ganha vantagem em testes de resistência de Constituição que você fizer para manter a concentração em uma magia."
  },
  {
    id: "thief_of_five_fates",
    name: "Ladrão das Cinco Vidas",
    originalName: "Thief of Five Fates",
    source: "PHB",
    minLevel: 1,
    cantripRequired: null,
    pactRequired: null,
    type: "1×/Descanso Longo",
    spellGranted: "Perdição",
    summary: "Conjure Perdição 1×/dia usando um espaço de magia de bruxo.",
    description: "Você pode conjurar a magia Perdição uma vez usando um espaço de magia de bruxo. Você não pode fazer isso novamente até terminar um descanso longo."
  },
  {
    id: "book_of_ancient_secrets",
    name: "Livro dos Segredos Antigos",
    originalName: "Book of Ancient Secrets",
    source: "PHB",
    minLevel: 1,
    cantripRequired: null,
    pactRequired: "tome",
    type: "Ritualista",
    summary: "Inscreva e conjure rituais de qualquer classe em seu Livro das Sombras.",
    description: "Você pode agora inscrever rituais mágicos no seu Livro das Sombras. Escolha duas magias de 1º círculo com o descritor ritual de qualquer lista de magias. As magias devem ser conjuradas como rituais. Você pode transcrever outros rituais cujo nível seja menor ou igual à metade do seu nível de bruxo."
  },
  {
    id: "voice_of_the_chain_master",
    name: "Voz do Mestre das Correntes",
    originalName: "Voice of the Chain Master",
    source: "PHB",
    minLevel: 1,
    cantripRequired: null,
    pactRequired: "chain",
    type: "Comunicação Telepática",
    summary: "Comunique-se telepaticamente com seu familiar e fale com sua própria voz através dele em qualquer lugar no mesmo plano.",
    description: "Você pode se comunicar telepaticamente com seu familiar e perceber através dos sentidos dele contanto que estejam no mesmo plano de existência. Além disso, enquanto estiver percebendo através dos sentidos dele, você pode falar através dele com a sua própria voz."
  },
  {
    id: "investment_of_the_chain_master",
    name: "Investidura do Mestre das Correntes",
    originalName: "Investment of the Chain Master",
    source: "TCE",
    minLevel: 1,
    cantripRequired: null,
    pactRequired: "chain",
    type: "Aprimoramento de Familiar",
    summary: "Seu familiar ganha voo/natação 12m, ataca com sua Ação Bônus e usa sua CD de magia para efeitos.",
    description: "Quando você conjura Encontrar Familiar, ele ganha deslocamento de voo ou natação de 12 metros. Como ação bônus, você pode ordenar que ele ataque. Os ataques dele contam como mágicos e, se ele forçar uma salvaguarda, você pode substituir a CD pela sua CD de conjuração de bruxo."
  },
  {
    id: "improved_pact_weapon",
    name: "Arma do Pacto Aprimorada",
    originalName: "Improved Pact Weapon",
    source: "XGE",
    minLevel: 1,
    cantripRequired: null,
    pactRequired: "blade",
    type: "Aprimoramento de Arma",
    summary: "Arma de pacto ganha +1 no ataque e dano, serve como foco arcano e pode ser arco ou besta.",
    description: "Você pode usar qualquer arma que conjurar com sua habilidade de Pacto da Lâmina como foco de conjuração. A arma recebe bônus de +1 nas jogadas de ataque e dano (a menos que já possua bônus mágico maior). Além disso, a arma pode assumir a forma de um arco curto, arco longo, besta leve ou besta pesada."
  },
  {
    id: "thirsting_blade",
    name: "Lâmina Sedenta",
    originalName: "Thirsting Blade",
    source: "PHB",
    minLevel: 5,
    cantripRequired: null,
    pactRequired: "blade",
    type: "Ataque Extra",
    summary: "Você pode atacar duas vezes em vez de uma na ação Atacar com sua arma de pacto.",
    description: "Você pode atacar com sua arma de pacto duas vezes, em vez de uma, sempre que realizar a ação Atacar no seu turno."
  },
  {
    id: "eldritch_smite",
    name: "Destruição Sobrenatural",
    originalName: "Eldritch Smite",
    source: "XGE",
    minLevel: 5,
    cantripRequired: null,
    pactRequired: "blade",
    type: "Golpe Extra",
    summary: "Ao acertar com arma de pacto, gaste 1 slot para causar 1d8 de força + 1d8/círculo e derrubar caído.",
    description: "Uma vez por turno ao acertar uma criatura com sua arma de pacto, você pode gastar um espaço de magia de bruxo para causar 1d8 de dano de força extra ao alvo, mais 1d8 por círculo do espaço de magia. Se o alvo for de tamanho Enorme ou menor, você também pode derrubá-lo no chão caído."
  },
  {
    id: "cloak_of_flies",
    name: "Manto de Moscas",
    originalName: "Cloak of Flies",
    source: "XGE",
    minLevel: 5,
    cantripRequired: null,
    pactRequired: null,
    type: "Ação Bônus",
    summary: "Aura de moscas que causa dano de veneno = Mod CAR a criaturas a 1,5m e dá Vantagem em Intimidação.",
    description: "Como ação bônus, você manifesta uma aura de moscas vorazes a 1,5m ao seu redor. Você tem vantagem em testes de Intimidação, mas desvantagem em outros testes de Carisma. Qualquer criatura que comece seu turno na aura sofre dano de veneno igual ao seu modificador de Carisma (mínimo 0). Permanece até ser dissipada ou ficar incapacitado (1×/descanso curto ou longo)."
  },
  {
    id: "tomb_of_levistus",
    name: "Túmulo de Levistus",
    originalName: "Tomb of Levistus",
    source: "XGE",
    minLevel: 5,
    cantripRequired: null,
    pactRequired: null,
    type: "Reação",
    summary: "Como reação a sofrer dano, ganha 10 PV temporários por nível envolto em gelo protetor.",
    description: "Como reação quando sofrer dano, você se envolve em gelo protetor sólido, ganhando 10 pontos de vida temporários por nível de bruxo que absorvem o dano do gatilho. Imediatamente após sofrer o dano você ganha vulnerabilidade a dano de fogo, seu deslocamento se torna 0 e você fica incapacitado até o fim do seu próximo turno (1×/descanso curto ou longo)."
  },
  {
    id: "one_with_shadows",
    name: "Um com as Sombras",
    originalName: "One with Shadows",
    source: "PHB",
    minLevel: 5,
    cantripRequired: null,
    pactRequired: null,
    type: "Ação",
    summary: "Em penumbra ou escuridão, use uma ação para ficar invisível até se mover ou realizar ações.",
    description: "Quando você estiver em uma área de penumbra ou escuridão, você pode usar sua ação para ficar invisível até se mover, realizar uma ação ou reação."
  },
  {
    id: "sign_of_ill_omen",
    name: "Sinais de Mau Agouro",
    originalName: "Sign of Ill Omen",
    source: "PHB",
    minLevel: 5,
    cantripRequired: null,
    pactRequired: null,
    type: "1×/Descanso Longo",
    spellGranted: "Rogar Maldição",
    summary: "Conjure Rogar Maldição 1×/dia usando um espaço de magia de bruxo.",
    description: "Você pode conjurar Rogar Maldição uma vez usando um espaço de magia de bruxo. Você não pode fazer isso novamente até terminar um descanso longo."
  },
  {
    id: "sculptor_of_flesh",
    name: "Escultor de Carne",
    originalName: "Sculptor of Flesh",
    source: "PHB",
    minLevel: 7,
    cantripRequired: null,
    pactRequired: null,
    type: "1×/Descanso Longo",
    spellGranted: "Metamorfose",
    summary: "Conjure Metamorfose 1×/dia usando um espaço de magia de bruxo.",
    description: "Você pode conjurar Metamorfose uma vez usando um espaço de magia de bruxo. Você não pode fazer isso novamente até terminar um descanso longo."
  },
  {
    id: "dreadful_word",
    name: "Palavra Aterrorizante",
    originalName: "Dreadful Word",
    source: "PHB",
    minLevel: 7,
    cantripRequired: null,
    pactRequired: null,
    type: "1×/Descanso Longo",
    spellGranted: "Confusão",
    summary: "Conjure Confusão 1×/dia usando um espaço de magia de bruxo.",
    description: "Você pode conjurar Confusão uma vez usando um espaço de magia de bruxo. Você não pode fazer isso novamente até terminar um descanso longo."
  },
  {
    id: "ghostly_gaze",
    name: "Olhar Fantasmagórico",
    originalName: "Ghostly Gaze",
    source: "XGE",
    minLevel: 7,
    cantripRequired: null,
    pactRequired: null,
    type: "Ação",
    summary: "Enxergue através de paredes e matéria sólida até 9 metros por 1 minuto.",
    description: "Como ação, você ganha a habilidade de ver através de objetos sólidos até um alcance de 9 metros por até 1 minuto. Você ganha visão no escuro nesse alcance se não possuir. O efeito termina se você perder a concentração (1×/descanso curto ou longo)."
  },
  {
    id: "tricksters_escape",
    name: "Fuga do Trapaceiro",
    originalName: "Trickster's Escape",
    source: "TCE",
    minLevel: 7,
    cantripRequired: null,
    pactRequired: null,
    type: "1×/Descanso Longo",
    spellGranted: "Movimentação Livre",
    summary: "Conjure Movimentação Livre em si mesmo 1×/dia sem gastar espaço de magia.",
    description: "Você pode conjurar Movimentação Livre em si mesmo uma vez sem gastar um espaço de magia. Você recupera o uso desta invocação ao terminar um descanso longo."
  },
  {
    id: "bewitching_whispers",
    name: "Sussurros Encantadores",
    originalName: "Bewitching Whispers",
    source: "PHB",
    minLevel: 7,
    cantripRequired: null,
    pactRequired: null,
    type: "1×/Descanso Longo",
    spellGranted: "Compulsão",
    summary: "Conjure Compulsão 1×/dia usando um espaço de magia de bruxo.",
    description: "Você pode conjurar Compulsão uma vez usando um espaço de magia de bruxo. Você não pode fazer isso novamente até terminar um descanso longo."
  },
  {
    id: "otherworldly_leap",
    name: "Salto Sobrenatural",
    originalName: "Otherworldly Leap",
    source: "PHB",
    minLevel: 9,
    cantripRequired: null,
    pactRequired: null,
    type: "Magia à Vontade",
    spellGranted: "Salto",
    summary: "Conjure Salto em si mesmo à vontade, sem gastar espaços de magia ou componentes.",
    description: "Você pode conjurar Salto em si mesmo à vontade, sem gastar um espaço de magia ou componentes materiais."
  },
  {
    id: "whispers_of_the_grave",
    name: "Sussurros da Sepultura",
    originalName: "Whispers of the Grave",
    source: "PHB",
    minLevel: 9,
    cantripRequired: null,
    pactRequired: null,
    type: "Magia à Vontade",
    spellGranted: "Falar com os Mortos",
    summary: "Conjure Falar com os Mortos à vontade, sem gastar espaços de magia.",
    description: "Você pode conjurar Falar com os Mortos à vontade, sem gastar um espaço de magia."
  },
  {
    id: "minions_of_chaos",
    name: "Servos do Caos",
    originalName: "Minions of Chaos",
    source: "PHB",
    minLevel: 9,
    cantripRequired: null,
    pactRequired: null,
    type: "1×/Descanso Longo",
    spellGranted: "Conjurar Elemental",
    summary: "Conjure Conjurar Elemental 1×/dia usando um espaço de magia de bruxo.",
    description: "Você pode conjurar Conjurar Elemental uma vez usando um espaço de magia de bruxo. Você não pode fazer isso novamente até terminar um descanso longo."
  },
  {
    id: "ascendant_step",
    name: "Visão da Lua Ascendente",
    originalName: "Ascendant Step",
    source: "PHB",
    minLevel: 9,
    cantripRequired: null,
    pactRequired: null,
    type: "Magia à Vontade",
    spellGranted: "Levitação",
    summary: "Conjure Levitação em si mesmo à vontade, sem gastar espaços de magia ou componentes.",
    description: "Você pode conjurar Levitação em si mesmo à vontade, sem gastar um espaço de magia ou componentes materiais."
  },
  {
    id: "lifedrinker",
    name: "Lâmina Devoradora",
    originalName: "Lifedrinker",
    source: "PHB",
    minLevel: 12,
    cantripRequired: null,
    pactRequired: "blade",
    type: "Modificador de Dano",
    summary: "Seus ataques com a arma de pacto causam dano necrótico extra igual ao seu modificador de Carisma.",
    description: "Quando você acertar uma criatura com sua arma de pacto, a criatura sofre dano necrótico adicional igual ao seu modificador de Carisma (mínimo 1)."
  },
  {
    id: "master_of_myriad_forms",
    name: "Mestre das Formas Miríades",
    originalName: "Master of Myriad Forms",
    source: "PHB",
    minLevel: 15,
    cantripRequired: null,
    pactRequired: null,
    type: "Magia à Vontade",
    spellGranted: "Alterar-se",
    summary: "Conjure Alterar-se à vontade, sem gastar espaços de magia.",
    description: "Você pode conjurar Alterar-se à vontade, sem gastar um espaço de magia."
  },
  {
    id: "visions_of_distant_realms",
    name: "Visões de Reinos Distantes",
    originalName: "Visions of Distant Realms",
    source: "PHB",
    minLevel: 15,
    cantripRequired: null,
    pactRequired: null,
    type: "Magia à Vontade",
    spellGranted: "Olho Arcano",
    summary: "Conjure Olho Arcano à vontade, sem gastar espaços de magia.",
    description: "Você pode conjurar Olho Arcano à vontade, sem gastar um espaço de magia."
  },
  {
    id: "witch_sight",
    name: "Olhar da Bruxa",
    originalName: "Witch Sight",
    source: "PHB",
    minLevel: 15,
    cantripRequired: null,
    pactRequired: null,
    type: "Sentido Sobrenatural",
    summary: "Enxerga a verdadeira forma de metamorfos ou criaturas ocultadas por ilusão/transmutação até 9 metros.",
    description: "Você pode ver a verdadeira forma de qualquer metamorfo ou criatura oculta por magia de ilusão ou transmutação enquanto ela estiver a até 9 metros de você e dentro de sua linha de visão."
  },
  {
    id: "chains_of_carceri",
    name: "Cadeias de Cárceri",
    originalName: "Chains of Carceri",
    source: "PHB",
    minLevel: 15,
    cantripRequired: null,
    pactRequired: "chain",
    type: "Magia à Vontade",
    spellGranted: "Imobilizar Monstro",
    summary: "Conjure Imobilizar Monstro à vontade contra celestiais, corruptores ou elementais sem gastar espaços de magia.",
    description: "Você pode conjurar Imobilizar Monstro à vontade – tendo como alvo um celestial, corruptor ou elemental – sem gastar um espaço de magia ou componentes materiais. Você deve terminar um descanso longo antes de poder usar esta invocação na mesma criatura novamente."
  }
];

// Normalização de campos de compatibilidade (desc, prerequisite)
WARLOCK_INVOCATIONS_DATA.forEach(inv => {
  inv.desc = inv.description || inv.desc;
  inv.description = inv.desc;
  if (!inv.prerequisite) {
    const parts = [];
    if (inv.minLevel && inv.minLevel > 1) parts.push(`Bruxo Nível ${inv.minLevel}`);
    if (inv.cantripRequired) parts.push(`Truque ${inv.cantripRequired}`);
    if (inv.pactRequired) {
      const pLabel = inv.pactRequired === 'blade' ? 'Pacto da Lâmina' : (inv.pactRequired === 'tome' ? 'Pacto do Tomo' : 'Pacto da Corrente');
      parts.push(pLabel);
    }
    inv.prerequisite = parts.join(', ');
  }
});

// Utilitários de pesquisa e acesso rápido
function findWarlockInvocationData(query) {
  if (!query) return null;
  const qNorm = String(query).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  return WARLOCK_INVOCATIONS_DATA.find(inv => {
    const idNorm = inv.id.toLowerCase();
    const nameNorm = inv.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const origNorm = inv.originalName.toLowerCase();
    return idNorm === qNorm || nameNorm === qNorm || origNorm === qNorm || nameNorm.includes(qNorm) || origNorm.includes(qNorm);
  }) || null;
}

// Limites oficiais de invocações por nível de Bruxo (D&D 5E)
function getWarlockMaxInvocations(warlockLevel) {
  const lvl = parseInt(warlockLevel) || 1;
  if (lvl < 2) return 0;
  if (lvl <= 4) return 2;
  if (lvl <= 6) return 3;
  if (lvl <= 8) return 4;
  if (lvl <= 11) return 5;
  if (lvl <= 14) return 6;
  if (lvl <= 17) return 7;
  return 8;
}

// Verificação de pré-requisitos para uma invocação
function checkInvocationPrerequisites(inv, heroOrContext) {
  if (!inv) return { met: false, eligible: false, reason: "Invocação inválida", unmetPrereqs: ["Invocação inválida"] };
  const ctx = heroOrContext || {};
  const lvl = parseInt(ctx.warlockLevel || ctx.level) || 1;
  const pact = (ctx.pactBoon || "").toLowerCase();
  const spells = ctx.spells || ctx.preparedSpells || [];

  // Checagem de nível
  if (inv.minLevel && lvl < inv.minLevel) {
    const reason = `Requer Bruxo Nível ${inv.minLevel} (atual: Nv ${lvl})`;
    return { met: false, eligible: false, reason, unmetPrereqs: [reason] };
  }

  // Checagem de truque
  if (inv.cantripRequired) {
    const hasCantrip = Array.isArray(spells)
      ? spells.some(s => String(s).toLowerCase().includes(inv.cantripRequired.toLowerCase()))
      : String(spells).toLowerCase().includes(inv.cantripRequired.toLowerCase());
    if (!hasCantrip) {
      const reason = `Requer truque "${inv.cantripRequired}" conhecido`;
      return { met: false, eligible: false, reason, unmetPrereqs: [reason] };
    }
  }

  // Checagem de Dádiva do Pacto
  if (inv.pactRequired) {
    const pactNames = {
      tome: ["tomo", "tome", "livro"],
      blade: ["lâmina", "lamina", "blade", "espada"],
      chain: ["corrente", "chain"]
    };
    const validTerms = pactNames[inv.pactRequired] || [];
    const featStr = (ctx.features || "").toLowerCase() + " " + (ctx.subclass || "").toLowerCase();
    const hasPact = validTerms.some(term => pact.includes(term) || featStr.includes(term));
    if (!hasPact) {
      const pactLabel = inv.pactRequired === "tome" ? "Pacto do Tomo" : (inv.pactRequired === "blade" ? "Pacto da Lâmina" : "Pacto da Corrente");
      const reason = `Requer Dádiva do ${pactLabel}`;
      return { met: false, eligible: false, reason, unmetPrereqs: [reason] };
    }
  }

  return { met: true, eligible: true, reason: "Pré-requisitos atendidos", unmetPrereqs: [] };
}

// Exportações globais e modulares
if (typeof window !== "undefined") {
  window.WARLOCK_INVOCATIONS_DATA = WARLOCK_INVOCATIONS_DATA;
  window.findWarlockInvocationData = findWarlockInvocationData;
  window.getWarlockMaxInvocations = getWarlockMaxInvocations;
  window.checkInvocationPrerequisites = checkInvocationPrerequisites;
}

if (typeof global !== "undefined") {
  global.WARLOCK_INVOCATIONS_DATA = WARLOCK_INVOCATIONS_DATA;
  global.findWarlockInvocationData = findWarlockInvocationData;
  global.getWarlockMaxInvocations = getWarlockMaxInvocations;
  global.checkInvocationPrerequisites = checkInvocationPrerequisites;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    WARLOCK_INVOCATIONS_DATA,
    findWarlockInvocationData,
    getWarlockMaxInvocations,
    checkInvocationPrerequisites
  };
}
