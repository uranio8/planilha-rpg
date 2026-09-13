// ==========================================
// 🧬 D&D 5E 2024 - BASE DE DADOS DE ESPÉCIES E LINHAGENS
// ==========================================
const SPECIES_DATA = [
  {
    id: 'aasimar',
    name: 'Aasimar',
    icon: '✨',
    type: 'Humanoide',
    size: 'Médio ou Pequeno (escolhido ao criar o personagem)',
    speed: '9 metros',
    description: 'Seres mortais tocados pela centelha dos Planos Superiores, os Aasimar carregam bênçãos celestiais em sua alma e manifestam a luz sagrada de guardiões celestiais.',
    traits: [
      {
        name: 'Mãos que Curam',
        type: 'Ação',
        description: 'Como uma Ação, você pode tocar uma criatura e rolar um número de dados d4 igual ao seu Bônus de Proficiência. A criatura recupera uma quantidade de Pontos de Vida igual ao total rolado. Você pode usar esta característica uma vez e recupera seu uso após terminar um Descanso Longo.'
      },
      {
        name: 'Portador da Luz',
        type: 'Truque',
        description: 'Você conhece o truque Luz. O Carisma é a sua habilidade de conjuração para este truque.'
      },
      {
        name: 'Resistência Celestial',
        type: 'Passiva',
        description: 'Você tem resistência a dano Necrótico e dano Radiante.'
      },
      {
        name: 'Visão no Escuro (18m)',
        type: 'Sentido',
        description: 'Você pode enxergar na penumbra a até 18 metros como se fosse luz plena, e na escuridão como se fosse penumbra. Você discerne cores na escuridão apenas como tons de cinza.'
      },
      {
        name: 'Revelação Celestial (3º Nível)',
        type: 'Ação Bônus / Transformação',
        description: 'Ao atingir o 3º nível de personagem, você escolhe uma das seguintes revelações celestiais para manifestar como Ação Bônus por 1 minuto (ou até você a encerrar com uma Ação Bônus). Uma vez usada, você recupera o uso após um Descanso Longo ou gastando um espaço de magia de qualquer nível.'
      }
    ],
    lineagesTitle: 'Revelações Celestiais (3º Nível)',
    lineages: [
      {
        name: 'Brilho Interno (Inner Radiance)',
        icon: '☀️',
        description: 'Luz abrasadora emana de seus olhos e boca. Você projeta luz plena em um raio de 3 metros e penumbra por mais 3 metros adicionais. No final de cada um de seus turnos, cada criatura a até 3 metros de você sofre dano Radiante igual ao seu Bônus de Proficiência. Além disso, uma vez em cada um de seus turnos ao causar dano a uma criatura com ataque ou magia, você pode causar dano Radiante extra igual ao seu Bônus de Proficiência.'
      },
      {
        name: 'Asas Celestiais (Heavenly Wings)',
        icon: '🪽',
        description: 'Duas asas de luz translúcida ou penas celestiais brotam de suas costas. Você adquire deslocamento de Voo igual ao seu Deslocamento de caminhada. Além disso, uma vez em cada um de seus turnos ao causar dano com ataque ou magia, você pode causar dano Radiante extra igual ao seu Bônus de Proficiência.'
      },
      {
        name: 'Véu Necrótico (Necrotic Shroud)',
        icon: '🌑',
        description: 'Seus olhos se tornam poços de trevas e asas esqueléticas ou fantasmagóricas surgem. Outras criaturas a até 3 metros que possam vê-lo devem ser bem-sucedidas em um teste de resistência de Carisma (CD 8 + Bônus de Proficiência + mod. Carisma) ou ficarão Amedrontadas por você até o final do seu próximo turno. Além disso, uma vez em cada um de seus turnos ao causar dano com ataque ou magia, você causa dano Necrótico extra igual ao seu Bônus de Proficiência.'
      }
    ]
  },
  {
    id: 'anao',
    name: 'Anão (Dwarf)',
    icon: '🛡️',
    type: 'Humanoide',
    size: 'Médio (cerca de 1,20m a 1,50m de altura, corpo robusto e denso)',
    speed: '9 metros',
    description: 'Forjados na rocha e nas profundezas das montanhas, os anões são renomados por sua resistência incomparável, maestria no trabalho com pedra e ferro, e ligação ancestral com a terra.',
    traits: [
      {
        name: 'Firmeza Enânica (Dwarven Toughness)',
        type: 'Passiva',
        description: 'Seu máximo de Pontos de Vida aumenta em 1 ponto por nível de personagem, e aumenta em mais 1 sempre que você sobe de nível.'
      },
      {
        name: 'Ligação com a Pedra (Stonecunning)',
        type: 'Ação Bônus / Sentido Sísmico',
        description: 'Como uma Ação Bônus, enquanto estiver tocando uma superfície de pedra, você adquire Sentido Sísmico em um raio de 18 metros durante 10 minutos. Este sentido permite perceber a localização exata de qualquer criatura ou objeto em movimento em contato com a mesma rocha. Você pode usar esta característica um número de vezes igual ao seu Bônus de Proficiência, recuperando todos os usos após um Descanso Longo.'
      },
      {
        name: 'Resiliência Enânica (Dwarven Resilience)',
        type: 'Passiva',
        description: 'Você tem resistência a dano de Veneno e possui Vantagem em testes de resistência para evitar ou encerrar a condição Envenenado.'
      },
      {
        name: 'Visão no Escuro Aprimorada (18m)',
        type: 'Sentido',
        description: 'Você tem visão no escuro com alcance de 18 metros.'
      }
    ],
    lineagesTitle: 'Tradições Enânicas',
    lineages: [
      {
        name: 'Anão da Colina / Montanha',
        icon: '⛰️',
        description: 'Com as novas regras 2024, as sub-raças de anões foram unificadas no chassi principal da espécie, incorporando a lendária Firmeza Enânica e o Sentido Sísmico de Ligação com a Pedra para todos os anões.'
      }
    ]
  },
  {
    id: 'draconato',
    name: 'Draconato (Dragonborn)',
    icon: '🐲',
    type: 'Humanoide',
    size: 'Médio',
    speed: '9 metros',
    description: 'Herdeiros do poder e da majestade dos dragões ancestrais, os draconatos empunham o sopro elemental devastador e podem despertar asas draconianas à medida que seu poder amadurece.',
    traits: [
      {
        name: 'Ancestralidade Dracônica',
        type: 'Passiva / Escolha',
        description: 'Você escolhe um tipo de ancestral dracônico. Sua escolha determina o tipo de dano e a forma da sua Arma de Sopro, bem como sua Resistência a Dano elemental.'
      },
      {
        name: 'Arma de Sopro (Breath Weapon)',
        type: 'Ataque Substitutivo',
        description: 'Quando você realiza a ação de Atacar no seu turno, pode substituir um de seus ataques pela sua Arma de Sopro. Ela pode ser liberada em um Cone de 4,5 metros ou em uma Linha de 9 metros por 1,5m de largura. Criaturas na área devem fazer um teste de resistência de Destreza ou Constituição (conforme a ancestralidade, CD 8 + Bônus de Proficiência + mod. Constituição). Uma criatura sofre 1d10 de dano do tipo dracônico se falhar, ou metade se passar. O dano aumenta para 2d10 no 5º nível, 3d10 no 11º nível e 4d10 no 17º nível. Você pode usar sua Arma de Sopro um número de vezes igual ao seu Bônus de Proficiência, recuperando os usos em Descanso Longo.'
      },
      {
        name: 'Resistência a Dano',
        type: 'Passiva',
        description: 'Você tem resistência ao tipo de dano associado à sua Ancestralidade Dracônica.'
      },
      {
        name: 'Visão no Escuro (18m)',
        type: 'Sentido',
        description: 'Você enxerga na penumbra e escuridão até 18 metros.'
      },
      {
        name: 'Voo Dracônico (5º Nível)',
        type: 'Ação Bônus / Voo',
        description: 'A partir do 5º nível, você pode manifestar asas espectrais ou escamosas como uma Ação Bônus. Você ganha deslocamento de Voo igual ao seu deslocamento de caminhada durante 10 minutos. Você pode usar esta característica uma vez e recupera seu uso após um Descanso Longo.'
      }
    ],
    lineagesTitle: 'Tabela de Ancestralidade Dracônica',
    lineages: [
      {
        name: 'Dragão Negro / Cobre (Ácido)',
        icon: '🧪',
        description: 'Dano: Ácido | Forma: Linha de 9m (1,5m de largura) | Teste de Resistência: Destreza | Resistência a Ácido.'
      },
      {
        name: 'Dragão Azul / Bronze (Eletricidade)',
        icon: '⚡',
        description: 'Dano: Elétrico | Forma: Linha de 9m (1,5m de largura) | Teste de Resistência: Destreza | Resistência a Eletricidade.'
      },
      {
        name: 'Dragão Latão / Ouro / Vermelho (Fogo)',
        icon: '🔥',
        description: 'Dano: Fogo | Forma: Cone de 4,5m (ou Linha de 9m para Latão) | Teste de Resistência: Destreza | Resistência a Fogo.'
      },
      {
        name: 'Dragão Branco / Prata (Frio)',
        icon: '❄️',
        description: 'Dano: Frio | Forma: Cone de 4,5m | Teste de Resistência: Constituição | Resistência a Frio.'
      },
      {
        name: 'Dragão Verde (Veneno)',
        icon: '☣️',
        description: 'Dano: Veneno | Forma: Cone de 4,5m | Teste de Resistência: Constituição | Resistência a Veneno.'
      }
    ]
  },
  {
    id: 'elfo',
    name: 'Elfo (Elf)',
    icon: '🏹',
    type: 'Humanoide',
    size: 'Médio',
    speed: '9 metros (10,5m para Elfo da Floresta)',
    description: 'Povo longevo e gracioso do Reino das Fadas e das florestas ancestrais, os elfos vivem em profunda harmonia com a magia natural e o cosmos, guiados por visões oníricas em seu transe meditativo.',
    traits: [
      {
        name: 'Ancestralidade Feérica (Fey Ancestry)',
        type: 'Passiva',
        description: 'Você tem Vantagem em testes de resistência para evitar ou encerrar a condição Enfeitiçado em si mesmo.'
      },
      {
        name: 'Sentidos Afiados (Keen Senses)',
        type: 'Perícia',
        description: 'Você tem proficiência na perícia Percepção (Perception).'
      },
      {
        name: 'Transe (Trance)',
        type: 'Passiva / Descanso',
        description: 'Você não precisa dormir e magia não pode colocá-lo para dormir. Você pode completar um Descanso Longo em apenas 4 horas se passar esse tempo em meditação profunda e consciente.'
      },
      {
        name: 'Visão no Escuro (18m / 36m)',
        type: 'Sentido',
        description: 'Você tem visão no escuro com alcance de 18 metros (36 metros para Linhagem Drow).'
      }
    ],
    lineagesTitle: 'Linhagens Élficas (Escolha 1)',
    lineages: [
      {
        name: 'Drow (Elfo Negro)',
        icon: '🕷️',
        description: 'Origem do Subterrâneo. Sua Visão no Escuro aumenta para 36 metros. Você conhece o truque Globos de Luz. No 3º nível você aprende Fogo das Fadas (Fey Fire), e no 5º nível aprende Escuridão (Darkness). Você pode conjurar cada uma dessas magias 1x ao dia sem gastar espaços de magia (ou usando seus espaços normais de magia). Atributo de conjuração: Inteligência, Sabedoria ou Carisma (escolhido ao criar o personagem).'
      },
      {
        name: 'Alto Elfo (High Elf)',
        icon: '🔮',
        description: 'Herdeiro da alta magia arcana. Você conhece um truque da lista de Magias de Mago de sua escolha; sempre que terminar um Descanso Longo, você pode trocar esse truque por outro truque de mago. No 3º nível você aprende Passo Nebuloso (Misty Step), podendo conjurá-la 1x ao dia sem gastar espaço (ou usando espaços normais).'
      },
      {
        name: 'Elfo da Floresta (Wood Elf)',
        icon: '🍃',
        description: 'Guardião dos bosques veloz e furtivo. Seu deslocamento base de caminhada aumenta para 10,5 metros (35 pés). Você conhece o truque Artifício (Druidcraft). No 3º nível você aprende Passos sem Pegadas (Pass without Trace), podendo conjurá-la 1x ao dia sem gastar espaço (ou usando espaços normais).'
      }
    ]
  },
  {
    id: 'gnomo',
    name: 'Gnomo (Gnome)',
    icon: '⚙️',
    type: 'Humanoide',
    size: 'Pequeno (cerca de 0,90m a 1,20m de altura)',
    speed: '9 metros',
    description: 'Pequenos em estatura mas gigantes em curiosidade e intelecto, os gnomos combinam inventividade, entusiasmo mágico e uma mente afiada capaz de repelir influências mágicas.',
    traits: [
      {
        name: 'Esperteza Gnômica (Gnomish Cunning)',
        type: 'Passiva',
        description: 'Você tem Vantagem em todos os testes de resistência de Inteligência, Sabedoria e Carisma.'
      },
      {
        name: 'Visão no Escuro (18m)',
        type: 'Sentido',
        description: 'Você tem visão no escuro com alcance de 18 metros.'
      }
    ],
    lineagesTitle: 'Linhagens Gnômicas (Escolha 1)',
    lineages: [
      {
        name: 'Gnomo da Floresta (Forest Gnome)',
        icon: '🐿️',
        description: 'Você conhece o truque Ilusão Menor (Minor Illusion). Além disso, você pode conjurar a magia Falar com Animais (Speak with Animals) um número de vezes igual ao seu Bônus de Proficiência sem gastar espaços de magia (recupera em Descanso Longo). Atributo de conjuração: Inteligência, Sabedoria ou Carisma.'
      },
      {
        name: 'Gnomo das Rochas / Engenhoqueiro (Rock Gnome)',
        icon: '🔧',
        description: 'Você conhece os truques Consertar (Mending) e Prestidigitação (Prestidigitation). Com 10 minutos de trabalho e 10 PO de materiais, você pode criar um mecanismo em miniatura (como um brinquedo mecânico, acendedor de fogo ou caixa de música mágica) que funciona por 8 horas ou até ser desmontado.'
      }
    ]
  },
  {
    id: 'golias',
    name: 'Golias (Goliath)',
    icon: '🪨',
    type: 'Humanoide (Sangue de Gigante)',
    size: 'Médio (2,10m a 2,40m de altura)',
    speed: '10,5 metros (35 pés)',
    description: 'Descendentes dos gigantes das mais altas montanhas e tempestades, os Golias possuem força colossal, passos largos e a capacidade mágica de canalizar os poderes ancestrais de seus clãs gigantescos.',
    traits: [
      {
        name: 'Passo Grande (Large Stride)',
        type: 'Passiva',
        description: 'Seu deslocamento de caminhada base é de 10,5 metros.'
      },
      {
        name: 'Forma Imensa (5º Nível)',
        type: 'Ação Bônus / Transformação',
        description: 'A partir do 5º nível, como uma Ação Bônus, você pode aumentar dramaticamente seu tamanho para o tamanho Grande durante 10 minutos. Enquanto durar: você tem Vantagem em testes de Força e seu deslocamento de caminhada aumenta em +3 metros (10 pés). Você pode usar esta habilidade 1 vez por Descanso Longo.'
      },
      {
        name: 'Herança de Gigante (Giant Ancestry)',
        type: 'Escolha de Linhagem',
        description: 'Você carrega as bênçãos e a magia natural de um dos grandes tipos de gigantes. Você pode usar o poder de sua herança um número de vezes igual ao seu Bônus de Proficiência, recuperando todos os usos em um Descanso Longo.'
      }
    ],
    lineagesTitle: 'Linhagens de Gigantes (Herança Sobrenatural)',
    lineages: [
      {
        name: 'Gigante da Nuvem (Cloud Giant - Passo Nebuloso)',
        icon: '☁️',
        description: 'Como uma Ação Bônus, você pode se teletransportar magicamente até 9 metros para um espaço desocupado que você possa ver.'
      },
      {
        name: 'Gigante do Fogo (Fire Giant - Golpe Ígneo)',
        icon: '🔥',
        description: 'Quando você atinge um alvo com um ataque e causa dano, pode adicionar 1d10 de dano de Fogo extra a esse dano.'
      },
      {
        name: 'Gigante do Gelo (Frost Giant - Golpe Congelante)',
        icon: '❄️',
        description: 'Quando você atinge um alvo com um ataque e causa dano, pode adicionar 1d6 de dano de Frio e reduzir o deslocamento do alvo em 3 metros até o início do seu próximo turno.'
      },
      {
        name: 'Gigante da Colina (Hill Giant - Tombo Sísmico)',
        icon: '🥋',
        description: 'Quando você atinge uma criatura de tamanho Grande ou menor com um ataque e causa dano, pode forçar a criatura a cair Prostrada imediatamente.'
      },
      {
        name: 'Gigante da Pedra (Stone Giant - Resistência da Rocha)',
        icon: '🪨',
        description: 'Como uma Reação quando você sofre dano, você pode rolar 1d12 + seu modificador de Constituição e reduzir o dano sofrido por essa quantidade total.'
      },
      {
        name: 'Gigante da Tempestade (Storm Giant - Retribuição do Trovão)',
        icon: '⚡',
        description: 'Como uma Reação quando você sofre dano de uma criatura a até 18 metros que você possa ver, você faz com que ela sofra 1d8 de dano Elétrico imediatamente.'
      }
    ]
  },
  {
    id: 'halfling',
    name: 'Halfling',
    icon: '🍀',
    type: 'Humanoide',
    size: 'Pequeno (cerca de 0,90m de altura)',
    speed: '9 metros',
    description: 'Povo corajoso, caloroso e incrivelmente afortunado, os Halflings navegam pelos perigos do mundo com graça sobrenatural, pés leves e uma sorte inexplicável que dobra o destino a seu favor.',
    traits: [
      {
        name: 'Sortudo (Lucky)',
        type: 'Passiva',
        description: 'Quando você rola um 1 no d20 para uma jogada de ataque, teste de habilidade ou teste de resistência, você pode jogar o dado novamente e deve usar o novo resultado.'
      },
      {
        name: 'Corajoso (Brave)',
        type: 'Passiva',
        description: 'Você tem Vantagem em testes de resistência para evitar ou encerrar a condição Amedrontado em si mesmo.'
      },
      {
        name: 'Agilidade Halfling (Halfling Nimbleness)',
        type: 'Passiva',
        description: 'Você pode se mover através do espaço de qualquer criatura que seja de um tamanho maior do que o seu.'
      },
      {
        name: 'Furtividade Natural (Naturally Stealthy)',
        type: 'Passiva',
        description: 'Você pode tentar se Esconder mesmo quando estiver obscurecido apenas por uma criatura que seja de tamanho pelo menos uma categoria maior do que você.'
      }
    ],
    lineagesTitle: 'Características de Estilo de Vida',
    lineages: [
      {
        name: 'Pés-Leves / Robustos (Unificados)',
        icon: '🥾',
        description: 'Nas regras D&D 2024, as qualidades essenciais dos Halflings (Sortudo, Coragem e Furtividade Natural) foram consolidadas como pilares universais da espécie.'
      }
    ]
  },
  {
    id: 'humano',
    name: 'Humano (Human)',
    icon: '👑',
    type: 'Humanoide',
    size: 'Médio ou Pequeno (escolhido ao criar o personagem)',
    speed: '9 metros',
    description: 'A mais adaptável, ambiciosa e resiliente das espécies mortais, os humanos compensam a falta de sentidos mágicos inatos com versatilidade sem limites, inspiração contagiante e maestria em qualquer ofício.',
    traits: [
      {
        name: 'Engenhoso (Resourceful)',
        type: 'Passiva / Inspiração',
        description: 'Sua determinação inabalável alimenta sua sorte. Sempre que você terminar um Descanso Longo, você ganha Inspiração Heroica (Heroic Inspiration).'
      },
      {
        name: 'Perito (Skillful)',
        type: 'Perícia',
        description: 'Você ganha proficiência em uma perícia à sua escolha.'
      },
      {
        name: 'Versátil (Versatile)',
        type: 'Talento Extra',
        description: 'Você ganha um Talento de Origem (Origin Feat) adicional de 1º nível à sua escolha (como Alerta, Sortudo, Iniciado em Magia, Duro na Queda, etc.).'
      }
    ],
    lineagesTitle: 'Origens Humanas',
    lineages: [
      {
        name: 'Tradição Adaptativa Universal',
        icon: '🌍',
        description: 'Humanos prosperam em todas as culturas dos multiversos com flexibilidade suprema, permitindo construir qualquer arquétipo de herói desde o nível 1 com talentos customizados.'
      }
    ]
  },
  {
    id: 'orc',
    name: 'Orc',
    icon: '🪓',
    type: 'Humanoide',
    size: 'Médio',
    speed: '9 metros',
    description: 'Guerreiros indomáveis com energia vital inextinguível, os orcs canalizam a adrenalina nas batalhas para avançar ferozmente e recusam-se a cair mesmo perante golpes fatais.',
    traits: [
      {
        name: 'Adrenalina (Adrenaline Rush)',
        type: 'Ação Bônus / Defesa',
        description: 'Você pode usar a Ação Disparada (Dash) como uma Ação Bônus. Quando faz isso, você ganha um número de Pontos de Vida Temporários igual ao seu Bônus de Proficiência. Você pode usar esta característica um número de vezes igual ao seu Bônus de Proficiência, recuperando todos os usos em um Descanso Curto ou Longo.'
      },
      {
        name: 'Resistência Implacável (Relentless Endurance)',
        type: 'Reação / Sobrevivência',
        description: 'Quando você é reduzido a 0 Pontos de Vida mas não é morto instantaneamente, você pode cair para 1 Ponto de Vida em vez disso. Uma vez usada esta característica, você não pode usá-la novamente até terminar um Descanso Longo.'
      },
      {
        name: 'Visão no Escuro Superior (36m)',
        type: 'Sentido',
        description: 'Você tem visão no escuro com alcance estendido de 36 metros (120 pés).'
      }
    ],
    lineagesTitle: 'Tradições de Tribo Orc',
    lineages: [
      {
        name: 'Fúria & Foco Ancestrais',
        icon: '⚔️',
        description: 'Orcs em 2024 são personagens jogáveis completos que combinam agilidade tática superior com extrema sobrevivência marcial.'
      }
    ]
  },
  {
    id: 'tiefling',
    name: 'Tiefling',
    icon: '😈',
    type: 'Humanoide (Sangue Inferior/Planar)',
    size: 'Médio ou Pequeno (escolhido ao criar o personagem)',
    speed: '9 metros',
    description: 'Carregando a herança mágica e as marcas físicas dos Planos Inferiores (o Abismo dos demônios, Carceri/Hades ou os Nove Infernos dos diabos), os tieflings empunham feitiçarias sombrias e resistência elemental.',
    traits: [
      {
        name: 'Visão no Escuro (18m)',
        type: 'Sentido',
        description: 'Você tem visão no escuro com alcance de 18 metros.'
      },
      {
        name: 'Legado Sobrenatural (Otherworldly Presence)',
        type: 'Escolha de Legado',
        description: 'Você escolhe um Legado dos Planos Inferiores: Abissal, Ctônico ou Infernal. Sua escolha concede resistência a dano e magias conhecidas adicionais que usam Inteligência, Sabedoria ou Carisma como atributo de conjuração.'
      }
    ],
    lineagesTitle: 'Legados dos Planos Inferiores (Escolha 1)',
    lineages: [
      {
        name: 'Legado Abissal (Abyssal - Caos & Veneno)',
        icon: '🩸',
        description: 'Ligação com o Abismo e demônios. Resistência a dano de Veneno. Você conhece o truque Veneno (Poison Spray). No 3º nível aprende Raio de Enfraquecimento (Ray of Sickness), e no 5º nível aprende Imobilizar Pessoa (Hold Person). Você pode conjurar as magias de 3º e 5º nível 1x ao dia sem espaço de magia.'
      },
      {
        name: 'Legado Ctônico (Chthonic - Morte & Hades)',
        icon: '💀',
        description: 'Ligação com Carceri, Gehenna e Hades. Resistência a dano Necrótico. Você conhece o truque Toque Arrepiante (Chill Touch). No 3º nível aprende Falsa Vida (False Life), e no 5º nível aprende Raio de Enfraquecimento / Toque Vampírico (Ray of Enfeeblement). Você pode conjurar as magias de 3º e 5º nível 1x ao dia sem espaço de magia.'
      },
      {
        name: 'Legado Infernal (Infernal - Fogo & Diabos)',
        icon: '🔥',
        description: 'Ligação com os Nove Infernos de Baator. Resistência a dano de Fogo. Você conhece o truque Taumaturgia (Thaumaturgy). No 3º nível aprende Repreensão Infernal (Hellish Rebuke), e no 5º nível aprende Escuridão (Darkness). Você pode conjurar as magias de 3º e 5º nível 1x ao dia sem espaço de magia.'
      }
    ]
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SPECIES_DATA };
}
