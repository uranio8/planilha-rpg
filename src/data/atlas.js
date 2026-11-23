// src/data/atlas.js - Atlas e Guia de Viagem da Costa da Espada (Forgotten Realms D&D 5E - ISSUE-186)

const ATLAS_TRAVEL_MODES = {
  foot: { key: 'foot', label: 'A pé', icon: '🚶', kmPerDay: 38, desc: 'Ritmo normal de marcha D&D 5e (~38 km/dia)' },
  horse: { key: 'horse', label: 'A cavalo', icon: '🐎', kmPerDay: 55, desc: 'Montaria em estrada (~55 km/dia)' },
  ship: { key: 'ship', label: 'Navio', icon: '⛵', kmPerDay: 75, desc: 'Navegação costeira no Mar das Espadas (~75 km/dia)' }
};

const ATLAS_REGIONS = [
  {
    id: 'costa_central',
    name: 'Costa da Espada Central',
    climate: 'Temperado Marítimo (brisa costeira, verões amenos e chuvas no outono)',
    dangerLevel: 'Moderado — estradas patrulhadas perto das grandes cidades, mas sujeitas a bandidos, Zhentarim e cultistas.',
    summary: 'O coração comercial da Costa da Espada, ligando Águas Profundas ao Portão de Baldur pela Estrada da Costa e rotas marítimas do Mar das Espadas.'
  },
  {
    id: 'norte_selvagem',
    name: 'O Norte Selvagem & Costa Norte',
    climate: 'Frio e Úmido (neblina costeira frequente e invernos rigorosos)',
    dangerLevel: 'Alto — ermos pouco policiados, tribos orcs, monstros marinhos e intrigas piratas.',
    summary: 'Terras antigas de reino fragmentado onde cidades-estado resilientes como Inverno Remoto e a perigosa Luskan enfrentam o mar revolto e as florestas densas.'
  },
  {
    id: 'fronteiras_prateadas',
    name: 'Fronteiras Prateadas (Silver Marches)',
    climate: 'Alpino / Continental Frio (neves pesadas no inverno e vales verdejantes no verão)',
    dangerLevel: 'Alto — incursões de orcs da Espinha do Mundo, gigantes e dragões brancos ou vermelhos.',
    summary: 'Confederação histórica de cidades civilizadas, enclaves élficos e fortalezas anãs cercadas por montanhas imponentes e florestas ancestrais.'
  },
  {
    id: 'vale_vento_gelido',
    name: 'Vale do Vento Gélido (Icewind Dale)',
    climate: 'Ártico Extremo (nevascas constantes, vento cortante e noites polares)',
    dangerLevel: 'Severo — hipotermia, yetis, remorhazes e isolamento quase total.',
    summary: 'A fronteira congelada ao norte da Espinha do Mundo, lar das resistentes Dez-Cidades e de caçadores de trutas-cabeça-de-osso.'
  },
  {
    id: 'costa_sul',
    name: 'Costa da Espada Sul & Terras Centrais',
    climate: 'Ameno a Quente (planícies férteis ao norte e clima mediterrâneo em Amn)',
    dangerLevel: 'Moderado a Alto — intrigas mercantis, ladrões das sombras e monstros das planícies.',
    summary: 'Rota vital para o comércio de especiarias, tomos antigos do Forte da Vela e riquezas dos reinos mercantis do sul.'
  }
];

const ATLAS_CITIES = [
  {
    id: 'portoreal_bastiao',
    name: 'PortoReal Bastião',
    regionId: 'costa_central',
    regionName: 'Costa da Espada Central',
    isStartingPoint: true,
    hasSeaRoute: true,
    coords: { x: 0, y: 0 },
    bastionDistanceKm: 0,
    description: 'Cidade portuária erguida em uma enseada abrigada a meio caminho entre Águas Profundas e o Portão de Baldur. Nos seus arredores elevados ergue-se o Bastião dos Jogadores, servindo como farol de segurança para caravanas da Estrada da Costa e navios mercantes.',
    factions: ['Aliança dos Lordes', 'Ordem da Manopla', 'Harpistas'],
    attractions: {
      forjas: 'Forja Real do Cais e a ferraria do Bastião, supridas com minério vindo do norte.',
      magia: 'Torre do Farol Arcano, onde navegantes compram pergaminhos de vento favorável e poções de cura.',
      livros: 'Arquivo do Bastião e cartório do porto com cartas náuticas da Costa da Espada.',
      cultura: 'Taverna Âncora Dourada e os Festivais da Maré Alta celebrados junto à guarnição local.'
    }
  },
  {
    id: 'adaga',
    name: 'Adaga (Daggerford)',
    regionId: 'costa_central',
    regionName: 'Costa da Espada Central',
    isStartingPoint: false,
    hasSeaRoute: true,
    coords: { x: -20, y: 240 },
    bastionDistanceKm: 241,
    description: 'Cidade murada próspera às margens do rio Delimbiyr, famosa como entreposto agrícola e parada obrigatória para viajantes que seguem rumo a Águas Profundas.',
    factions: ['Aliança dos Lordes', 'Harpistas', 'Enclave Esmeralda'],
    attractions: {
      forjas: 'Forja dos Irmãos Derval, respeitada pela têmpera de espadas longas e escudos anões.',
      magia: 'Enclave do Mago Delfen Ondabarba, que oferece identificação de relíquias e componentes raros.',
      livros: 'Salão Ducal e registros históricos do antigo reino de Delimbiyr.',
      cultura: 'Estalagem da Senhora da Sorte e feiras semanais de grãos e montarias.'
    }
  },
  {
    id: 'aguas_profundas',
    name: 'Águas Profundas (Waterdeep)',
    regionId: 'costa_central',
    regionName: 'Costa da Espada Central',
    isStartingPoint: false,
    hasSeaRoute: true,
    coords: { x: -45, y: 357 },
    bastionDistanceKm: 360,
    description: 'A Cidade dos Esplendores. Metrópole cosmopolita erguida junto ao Monte Águas Profundas, governada pelos Lordes Mascarados e movida pelo comércio continental, guildas poderosas e magia de alto nível.',
    factions: ['Aliança dos Lordes', 'Harpistas', 'Zhentarim', 'Ordem da Manopla', 'Enclave Esmeralda'],
    attractions: {
      forjas: 'Distrito dos Artesãos e Guilda dos Ferreiros e Armeiros, capazes de forjar ligas raras e obras-primas.',
      magia: 'Ordem Vigilante dos Magistas e Protetores e a Loja de Itens Mágicos de Aurora (Aurora’s Whole Realms).',
      livros: 'Templo de Oghma (Fonte do Conhecimento) e a livraria Tomos de Sabedoria no Distrito do Castelo.',
      cultura: 'Taverna Portal Bocejante (Yawning Portal) sobre a entrada de Undermountain e o Festival de Ahghairon.'
    }
  },
  {
    id: 'portao_baldur',
    name: 'Portão de Baldur (Baldur\'s Gate)',
    regionId: 'costa_sul',
    regionName: 'Costa da Espada Sul & Terras Centrais',
    isStartingPoint: false,
    hasSeaRoute: true,
    coords: { x: 40, y: -438 },
    bastionDistanceKm: 440,
    description: 'Grande cidade portuária envolta em neblina às margens do rio Chionthar. Dividida entre a Cidade Alta aristocrática, a Cidade Baixa mercantil e a Cidade Externa, é policiada pelos mercenários do Punho Flamejante.',
    factions: ['Punho Flamejante', 'Zhentarim', 'Harpistas', 'Guilda de Ladrões'],
    attractions: {
      forjas: 'Fundição do Martelo de Ferro na Cidade Baixa, especializada em armas navais e armaduras pesadas.',
      magia: 'Empório de Feitiçaria (Sorcerous Sundries), famoso pela cúpula colorida e estoque arcano vasto.',
      livros: 'Salão das Maravilhas (templo-museu de Gond) e arquivos mercantis do Conselho dos Quatro.',
      cultura: 'Taverna Canção Élfica (Elfsong Tavern), onde um espírito canta baladas antigas todas as noites.'
    }
  },
  {
    id: 'forte_vela',
    name: 'Forte da Vela (Candlekeep)',
    regionId: 'costa_sul',
    regionName: 'Costa da Espada Sul & Terras Centrais',
    isStartingPoint: false,
    hasSeaRoute: true,
    coords: { x: 15, y: -590 },
    bastionDistanceKm: 590,
    description: 'A maior fortaleza-biblioteca de Faerûn, erguida sobre penhascos vulcânicos voltados para o Mar das Espadas. A entrada exige a doação de um livro ou tomo raro que os monges Avowed ainda não possuam.',
    factions: ['Ordem dos Avowed', 'Harpistas', 'Ordem da Manopla'],
    attractions: {
      forjas: 'Oficinas de encadernação em prata e bronze para proteger grimórios contra fogo e umidade.',
      magia: 'Câmaras internas protegidas por campos anti-teletransporte e guardiões arcanos antigos.',
      livros: 'Grande Biblioteca com dezenas de milhares de pergaminhos, tratados planares e profecias de Alaundo.',
      cultura: 'Corte do Sossego e a Estalagem da Lareira, onde sábios de todo o mundo debatem em voz baixa.'
    }
  },
  {
    id: 'triboar',
    name: 'Triboar',
    regionId: 'fronteiras_prateadas',
    regionName: 'Fronteiras Prateadas (Silver Marches)',
    isStartingPoint: false,
    hasSeaRoute: false,
    coords: { x: 260, y: 518 },
    bastionDistanceKm: 580,
    description: 'Movimentado cruzamento comercial onde a Estrada Longa encontra a Trilha de Evermoor. Famosa pelo comércio de cavalos, guias experientes e histórias de ataques de gigantes.',
    factions: ['Aliança dos Lordes', 'Harpistas', 'Zhentarim'],
    attractions: {
      forjas: 'Ferraria de Ghelryn Foehammer, anão veterano que forja machados e ferraduras reforçadas.',
      magia: 'Santuário da Lança de Fogo e venda ocasional de talismãs de viagem por mercadores itinerantes.',
      livros: 'Mapas atualizados de trilhas do Norte mantidos pelos batedores do Protetorado.',
      cultura: 'Feira Anual de Cavalos de Triboar e a taverna O Javali Saltitante.'
    }
  },
  {
    id: 'yartar',
    name: 'Yartar',
    regionId: 'fronteiras_prateadas',
    regionName: 'Fronteiras Prateadas (Silver Marches)',
    isStartingPoint: false,
    hasSeaRoute: false,
    coords: { x: 320, y: 622 },
    bastionDistanceKm: 700,
    description: 'Cidade fortificada na confluência dos rios Dessarin e Surbrin, conhecida por seus estaleiros fluviais, a barcaça cassino Grande Dama e a influência oculta da Sociedade Kraken.',
    factions: ['Aliança dos Lordes', 'Zhentarim', 'Sociedade Kraken'],
    attractions: {
      forjas: 'Estaleiros e ferrarias fluviais especializados em arpões, ganchos e armaduras leves.',
      magia: 'Adornos e amuletos aquáticos negociados discretamente nos becos próximos ao cais.',
      livros: 'Registros portuários e mapas das rotas fluviais do Vale do Dessarin.',
      cultura: 'O famoso cassino flutuante Grande Dama (Grand Dame) e o Festival da Colheita Fluvial.'
    }
  },
  {
    id: 'inverno_remoto',
    name: 'Inverno Remoto (Neverwinter)',
    regionId: 'norte_selvagem',
    regionName: 'O Norte Selvagem & Costa Norte',
    isStartingPoint: false,
    hasSeaRoute: true,
    coords: { x: -100, y: 733 },
    bastionDistanceKm: 740,
    description: 'A Joia do Norte. Aquecida naturalmente pelo rio Neverwinter que corre próximo ao vulcão Monte Hotenow, a cidade se reergueu sob o governo de Lorde Dagult Neverember entre jardins floridos e muralhas reconstruídas.',
    factions: ['Aliança dos Lordes', 'Ordem da Manopla', 'Enclave Esmeralda', 'Harpistas'],
    attractions: {
      forjas: 'Oficinas de Mestres Relojoeiros e a Casa do Conhecimento de Oghma reconstruída.',
      magia: 'O Enclave do Protetor e os círculos antigos da Torre do Manto (Cloak Tower).',
      livros: 'Salão da Justiça e arquivos reais das antigas linhagens de Neverwinter.',
      cultura: 'Taverna Máscara da Pedra Lunar (Moonstone Mask) e os Jardins de Inverno que florescem o ano inteiro.'
    }
  },
  {
    id: 'athkatla',
    name: 'Athkatla (Amn)',
    regionId: 'costa_sul',
    regionName: 'Costa da Espada Sul & Terras Centrais',
    isStartingPoint: false,
    hasSeaRoute: true,
    coords: { x: 45, y: -919 },
    bastionDistanceKm: 920,
    description: 'A Cidade da Moeda, capital mercante de Amn. Aqui o ouro dita a lei, grandes casas comerciais financiam expedições além-mar e os Magos Encapuzados controlam rigidamente toda conjuração arcana.',
    factions: ['Magos Encapuzados', 'Ladrões das Sombras', 'Zhentarim'],
    attractions: {
      forjas: 'Passeio de Waukeen, repleto de armeiros exóticos, joalheiros e mercadores de armas de Maztica.',
      magia: 'Mercado clandestino controlado sob o olhar severo dos Magos Encapuzados.',
      livros: 'Grande Templo de Waukeen e casas bancárias com tomos de contratos continentais.',
      cultura: 'Arena do Distrito das Pontes e a estalagem Cinco Canecas (Five Flagons).'
    }
  },
  {
    id: 'luskan',
    name: 'Luskan',
    regionId: 'norte_selvagem',
    regionName: 'O Norte Selvagem & Costa Norte',
    isStartingPoint: false,
    hasSeaRoute: true,
    coords: { x: -130, y: 951 },
    bastionDistanceKm: 960,
    description: 'A Cidade das Velas, na foz gélida do rio Mirar. Governada na prática pelos cinco Altos Capitães piratas e pela temida Irmandade Arcana instalada na Torre Hosttower.',
    factions: ['Irmandade Arcana', 'Bregan D\'aerthe', 'Zhentarim'],
    attractions: {
      forjas: 'Estaleiros da Ilha do Sangue e ferrarias especializadas em armas de abordagem naval.',
      magia: 'Hosttower of the Arcane — pináculo de magia obscura e pesquisas planares da Irmandade Arcana.',
      livros: 'Bibliotecas trancadas da Hosttower contendo segredos proibidos do Norte.',
      cultura: 'Taverna Cutelo Enferrujado (Cutlass) e tavernas portuárias movimentadas por corsários.'
    }
  },
  {
    id: 'lua_argentea',
    name: 'Lua Argêntea (Silverymoon)',
    regionId: 'fronteiras_prateadas',
    regionName: 'Fronteiras Prateadas (Silver Marches)',
    isStartingPoint: false,
    hasSeaRoute: false,
    coords: { x: 580, y: 790 },
    bastionDistanceKm: 980,
    description: 'A Joia das Fronteiras Prateadas. Cidade encantada onde humanos, elfos e anões convivem sob a proteção da Ponte Lunar invisível e das mais respeitadas academias de magia e música do Norte.',
    factions: ['Harpistas', 'Aliança dos Lordes', 'Enclave Esmeralda'],
    attractions: {
      forjas: 'Forjas élfico-anãs que trabalham mithral e arcos compostos de madeira lunar.',
      magia: 'Conclave de Lua Argêntea e o Mythall protetor que envolve e defende a cidade.',
      livros: 'Cofre dos Sábios (Vault of the Sages), rivalizando com o Forte da Vela em conhecimento do Norte.',
      cultura: 'Conservatório de Música de Lua Argêntea e festivais noturnos sob a Ponte Lunar.'
    }
  },
  {
    id: 'mirabar',
    name: 'Mirabar',
    regionId: 'fronteiras_prateadas',
    regionName: 'Fronteiras Prateadas (Silver Marches)',
    isStartingPoint: false,
    hasSeaRoute: false,
    coords: { x: 340, y: 1025 },
    bastionDistanceKm: 1080,
    description: 'Principal centro minerador e metalúrgico do Norte, com uma superfície murada humana e vastos salões subterrâneos habitados por clãs anões ligados às minas da Espinha do Mundo.',
    factions: ['Aliança dos Lordes', 'Ordem da Manopla', 'Zhentarim'],
    attractions: {
      forjas: 'Grandes Forjas da Cidade Subterrânea — fonte de aço anão, mithral e armas de cerco de alta qualidade.',
      magia: 'Runas de forja e encantamentos utilitários para mineração e resistência ao fogo.',
      livros: 'Mapas geológicos profundos das passagens da Espinha do Mundo e do Subterrâneo.',
      cultura: 'Feira Anual do Machado e cantos de martelo nos salões de pedra.'
    }
  },
  {
    id: 'dez_cidades',
    name: 'Dez-Cidades / Bryn Shander (Icewind Dale)',
    regionId: 'vale_vento_gelido',
    regionName: 'Vale do Vento Gélido (Icewind Dale)',
    isStartingPoint: false,
    hasSeaRoute: false,
    coords: { x: -180, y: 1368 },
    bastionDistanceKm: 1380,
    description: 'Bryn Shander é o coração murado da liga das Dez-Cidades na tundra gelada do Vale do Vento Gélido. Ponto final das caravanas do sul, cercado por nevascas e lagos congelados.',
    factions: ['Harpistas', 'Irmandade Arcana', 'Zhentarim', 'Enclave Esmeralda'],
    attractions: {
      forjas: 'Forja de Blackiron Blades, produzindo armas e equipamentos térmicos contra o frio extremo.',
      magia: 'Vendedores de amuletos contra geada e estudiosos investigando o Glaciar Reghed.',
      livros: 'Casa da Oradora Duvessa Shane e crônicas das expedições às ruínas de Netheril.',
      cultura: 'Taverna Northlook e a corrida de trenós entre as dez vilas pesqueiras.'
    }
  }
];

if (typeof window !== 'undefined') {
  window.ATLAS_TRAVEL_MODES = ATLAS_TRAVEL_MODES;
  window.ATLAS_REGIONS = ATLAS_REGIONS;
  window.ATLAS_CITIES = ATLAS_CITIES;
}
if (typeof global !== 'undefined') {
  global.ATLAS_TRAVEL_MODES = ATLAS_TRAVEL_MODES;
  global.ATLAS_REGIONS = ATLAS_REGIONS;
  global.ATLAS_CITIES = ATLAS_CITIES;
}
