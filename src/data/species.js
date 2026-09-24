// ============================================================================
// 🧬 D&D 5ª EDIÇÃO (2014) - BASE DE DADOS OFICIAL DE RAÇAS E SUB-RAÇAS
// Baseado nas referências oficiais de regras do portal Orbe dos Dragões
// (https://orbedosdragoes.com/)
// ============================================================================

const SPECIES_DATA = [
  {
    id: 'anao',
    name: 'Anão',
    icon: '🛡️',
    type: 'Humanoide',
    size: 'Médio (cerca de 1,20m a 1,50m de altura, pesados e robustos)',
    speed: '7,5 metros (não é reduzido pelo uso de armaduras pesadas)',
    abilityScoreSummary: '+2 Constituição',
    description: 'Reinos ricos de antiga grandeza, salões esculpidos nas raízes das montanhas, ecos de picaretas e martelos nas minas profundas e forjas ardentes. Os anões são audazes e resistentes, moldados pelo trabalho duro na pedra e pelo orgulho inabalável de seus clãs e tradições ancestrais.',
    traits: [
      {
        name: 'Aumento no Valor de Habilidade',
        type: 'Atributo',
        description: 'Seu valor de **Constituição aumenta em +2**.'
      },
      {
        name: 'Visão no Escuro (18 metros)',
        type: 'Sentido',
        description: 'Acostumado à vida subterrânea, você enxerga na penumbra a até 18 metros como se fosse luz plena, e na escuridão como se fosse penumbra. Você não pode discernir cores na escuridão, apenas tons de cinza.'
      },
      {
        name: 'Resiliência Anã',
        type: 'Defesa / Sobrevivência',
        description: 'Você possui **Vantagem em salvaguardas contra veneno** e tem **Resistência a dano de veneno**.'
      },
      {
        name: 'Treinamento Anão em Combate',
        type: 'Proficiência em Armas',
        description: 'Você tem proficiência com o *machado de batalha*, *machadinha*, *martelo leve* e *martelo de guerra*.'
      },
      {
        name: 'Proficiência com Ferramentas',
        type: 'Ofício',
        description: 'Você ganha proficiência em uma ferramenta de artesão à sua escolha: *ferramentas de ferreiro*, *suprimentos de cervejeiro* ou *ferramentas de pedreiro*.'
      },
      {
        name: 'Especialização em Rochas',
        type: 'Conhecimento',
        description: 'Sempre que você realizar um teste de Inteligência (História) relacionado à origem de trabalhos em pedra, você é considerado proficiente na perícia e **adiciona o dobro do seu bônus de proficiência** ao teste.'
      },
      {
        name: 'Idiomas',
        type: 'Comunicação',
        description: 'Você pode falar, ler e escrever **Comum** e **Anão**.'
      }
    ],
    lineagesTitle: 'Sub-raças de Anão',
    lineages: [
      {
        name: 'Anão da Colina',
        icon: '🏔️',
        description: 'Como um anão da colina, você tem sentidos aguçados, intuição profunda e uma resistência física ainda mais notável.\n\n• **Aumento no Valor de Habilidade**: Seu valor de **Sabedoria aumenta em +1**.\n• **Tenacidade Anã**: Seu máximo de Pontos de Vida aumenta em **+1 PV**, e aumenta em **+1 PV adicional cada vez que você sobe de nível**.'
      },
      {
        name: 'Anão da Montanha',
        icon: '⛰️',
        description: 'Como um anão da montanha, você é forte e robusto, acostumado a uma vida difícil em terrenos acidentados.\n\n• **Aumento no Valor de Habilidade**: Seu valor de **Força aumenta em +2**.\n• **Treinamento Anão com Armaduras**: Você tem proficiência com **Armaduras Leves e Médias**.'
      }
    ]
  },
  {
    id: 'elfo',
    name: 'Elfo',
    icon: '🍃',
    type: 'Humanoide',
    size: 'Médio (cerca de 1,50m a 1,80m de altura, esguios e graciosos)',
    speed: '9 metros',
    abilityScoreSummary: '+2 Destreza',
    description: 'Um povo de graça sobrenatural e beleza etérea, os elfos vivem no mundo sem pertencer inteiramente a ele. Amantes da arte, da magia e da natureza selvagem, possuem vidas que se estendem por séculos, desenvolvendo uma perspectiva paciente e profunda sobre o cosmos.',
    traits: [
      {
        name: 'Aumento no Valor de Habilidade',
        type: 'Atributo',
        description: 'Seu valor de **Destreza aumenta em +2**.'
      },
      {
        name: 'Visão no Escuro (18 metros)',
        type: 'Sentido',
        description: 'Acostumado às florestas crepusculares e ao céu noturno, você enxerga na penumbra a até 18 metros como se fosse luz plena, e na escuridão como se fosse penumbra.'
      },
      {
        name: 'Sentidos Aguçados',
        type: 'Perícia',
        description: 'Você tem proficiência na perícia **Percepção**.'
      },
      {
        name: 'Ancestralidade Feérica',
        type: 'Proteção Mágica',
        description: 'Você tem **Vantagem em salvaguardas para não ser enfeitiçado**, e a magia não pode colocar você para dormir.'
      },
      {
        name: 'Transe',
        type: 'Descanso Místico',
        description: 'Elfos não precisam dormir. Em vez disso, meditam profundamente em transe por **4 horas por dia**, obtendo o mesmo benefício que um humano obtém com 8 horas de sono.'
      },
      {
        name: 'Idiomas',
        type: 'Comunicação',
        description: 'Você pode falar, ler e escrever **Comum** e **Élfico**.'
      }
    ],
    lineagesTitle: 'Sub-raças de Elfo',
    lineages: [
      {
        name: 'Alto Elfo',
        icon: '✨',
        description: 'Como um alto elfo, você possui uma mente aguçada e domínio sobre a magia primordial.\n\n• **Aumento no Valor de Habilidade**: Seu valor de **Inteligência aumenta em +1**.\n• **Treinamento com Armas Élficas**: Proficiência com *espada longa*, *espada curta*, *arco curto* e *arco longo*.\n• **Truque**: Você conhece um truque à sua escolha da lista de magias de Mago (Inteligência é a sua habilidade para este truque).\n• **Idioma Adicional**: Você pode falar, ler e escrever um idioma extra à sua escolha.'
      },
      {
        name: 'Elfo da Floresta',
        icon: '🏹',
        description: 'Como um elfo da floresta, você possui sentidos aguçados e intuição, além de deslocamento rápido pelas matas.\n\n• **Aumento no Valor de Habilidade**: Seu valor de **Sabedoria aumenta em +1**.\n• **Treinamento com Armas Élficas**: Proficiência com *espada longa*, *espada curta*, *arco curto* e *arco longo*.\n• **Pés Velozes**: Seu deslocamento básico de caminhada aumenta para **10,5 metros**.\n• **Máscara da Natureza**: Você pode tentar se esconder mesmo quando estiver apenas levemente obscurecido por folhagem, chuva forte, névoa ou outro fenômeno natural.'
      },
      {
        name: 'Elfo Negro (Drow)',
        icon: '🕷️',
        description: 'Descendentes de uma linhagem élfica ancestral dos reinos subterrâneos do Subterrâneo (Underdark).\n\n• **Aumento no Valor de Habilidade**: Seu valor de **Carisma aumenta em +1**.\n• **Visão no Escuro Superior**: Sua visão no escuro tem alcance de **36 metros**.\n• **Sensibilidade à Luz Solar**: Você tem desvantagem em jogadas de ataque e testes de Percepção que dependem da visão quando você ou o alvo estiverem sob luz solar direta.\n• **Magia Drow**: Conhece o truque *Globos de Luz*. No 3º nível, pode conjurar *Fogo das Fadas* 1x/descanso longo. No 5º nível, pode conjurar *Escuridão* 1x/descanso longo (Carisma é a sua habilidade para estas magias).\n• **Treinamento com Armas Drow**: Proficiência com *rapieira*, *espada curta* e *besta de mão*.'
      }
    ]
  },
  {
    id: 'halfling',
    name: 'Halfling',
    icon: '🍀',
    type: 'Humanoide',
    size: 'Pequeno (cerca de 0,90m de altura, pesando cerca de 20 kg)',
    speed: '7,5 metros',
    abilityScoreSummary: '+2 Destreza',
    description: 'Os halflings são um povo pacífico, alegre e caloroso que aprecia os prazeres simples da comida, da amizade e do lar acolhedor. Apesar de sua aversão ao conflito desnecessário, possuem uma coragem surpreendente e uma sorte quase sobrenatural diante do perigo.',
    traits: [
      {
        name: 'Aumento no Valor de Habilidade',
        type: 'Atributo',
        description: 'Seu valor de **Destreza aumenta em +2**.'
      },
      {
        name: 'Sortudo',
        type: 'Característica Rara',
        description: 'Quando você rolar um **1 natural** em uma jogada de ataque, teste de habilidade ou salvaguarda, você pode **rolar novamente o dado** e deve usar o novo resultado.'
      },
      {
        name: 'Bravo',
        type: 'Bravura',
        description: 'Você tem **Vantagem em salvaguardas contra ficar amedrontado**.'
      },
      {
        name: 'Agilidade Halfling',
        type: 'Movimento Tático',
        description: 'Você pode se mover através do espaço de qualquer criatura que seja de um tamanho maior que o seu.'
      },
      {
        name: 'Idiomas',
        type: 'Comunicação',
        description: 'Você pode falar, ler e escrever **Comum** e **Halfling**.'
      }
    ],
    lineagesTitle: 'Sub-raças de Halfling',
    lineages: [
      {
        name: 'Pés-Leves',
        icon: '👣',
        description: 'Como um halfling pés-leves, você é capaz de se esconder facilmente e passar despercebido por outros.\n\n• **Aumento no Valor de Habilidade**: Seu valor de **Carisma aumenta em +1**.\n• **Furtividade Natural**: Você pode tentar se esconder mesmo quando estiver obscurecido apenas por uma criatura que seja pelo menos um tamanho maior que você.'
      },
      {
        name: 'Robusto',
        icon: '🍺',
        description: 'Dizem que os robustos possuem sangue anão correndo em suas veias, sendo mais fortes e resistentes a toxinas.\n\n• **Aumento no Valor de Habilidade**: Seu valor de **Constituição aumenta em +1**.\n• **Resiliência dos Robustos**: Você tem **Vantagem em salvaguardas contra veneno** e tem **Resistência a dano de veneno**.'
      }
    ]
  },
  {
    id: 'humano',
    name: 'Humano',
    icon: '👑',
    type: 'Humanoide',
    size: 'Médio (variando amplamente de 1,50m a mais de 1,90m de altura)',
    speed: '9 metros',
    abilityScoreSummary: '+1 em Todos os Atributos (ou +1 em dois + Talento)',
    description: 'A mais jovem, dinâmica e ambiciosa das raças clássicas. Os humanos são os inovadores, conquistadores e desbravadores dos reinos mortais, construindo grandes impérios e adaptando-se a qualquer ambiente com perseverança e espírito indomável.',
    traits: [
      {
        name: 'Versatilidade Humana',
        type: 'Adaptabilidade',
        description: 'Humanos se adaptam rapidamente a qualquer cultura, profissão ou estilo de combate, não possuindo limitações congênitas.'
      },
      {
        name: 'Idiomas',
        type: 'Comunicação',
        description: 'Você pode falar, ler e escrever **Comum** e um idioma adicional à sua escolha.'
      }
    ],
    lineagesTitle: 'Variantes de Humano',
    lineages: [
      {
        name: 'Humano Padrão',
        icon: '⭐',
        description: 'O ser humano com ampla capacidade física e mental em todas as áreas.\n\n• **Aumento no Valor de Habilidade**: Todos os seus seis valores de atributo (**Força, Destreza, Constituição, Inteligência, Sabedoria e Carisma**) aumentam em **+1**.\n• **Idioma Adicional**: Um idioma à sua escolha.'
      },
      {
        name: 'Humano Variante (Opcional do Livro do Jogador)',
        icon: '🎖️',
        description: 'Uma variante comum em mesas de RPG focada em especialização e talentos heroicos precoces.\n\n• **Aumento no Valor de Habilidade**: Dois valores de atributo diferentes à sua escolha aumentam em **+1**.\n• **Perícia**: Você ganha proficiência em **uma perícia à sua escolha**.\n• **Talento**: Você ganha **um Talento à sua escolha** de D&D 5E à criação do personagem.'
      }
    ]
  },
  {
    id: 'draconato',
    name: 'Draconato',
    icon: '🐉',
    type: 'Humanoide',
    size: 'Médio (altos e encorpados, frequentemente ultrapassando 1,90m e 110 kg)',
    speed: '9 metros',
    abilityScoreSummary: '+2 Força, +1 Carisma',
    description: 'Nascidos de dragões, como seu nome proclama, os draconatos andam orgulhosamente por um mundo que os saúda com temor e respeito. Moldados por deuses dracônicos ou pelos próprios dragões, carregam escamas reluzentes e a fúria dos elementos em seu sopro.',
    traits: [
      {
        name: 'Aumento no Valor de Habilidade',
        type: 'Atributo',
        description: 'Seu valor de **Força aumenta em +2** e seu valor de **Carisma aumenta em +1**.'
      },
      {
        name: 'Ancestral Dracônico',
        type: 'Herança Elemental',
        description: 'Você possui um ancestral dracônico. Escolha um tipo de dragão da tabela. Isso determina o tipo de dano e a área de efeito da sua Arma de Sopro, bem como a sua Resistência a Dano.'
      },
      {
        name: 'Arma de Sopro',
        type: 'Ação / Dano em Área',
        description: 'Você pode usar sua Ação para exalar energia destrutiva. O tamanho, forma e tipo de salvaguarda dependem do seu ancestral.\n• **Dano**: Causa **2d6 de dano** em uma falha na salvaguarda, ou metade em um sucesso. O dano aumenta para **3d6 no 6º nível**, **4d6 no 11º nível** e **5d6 no 16º nível**.\n• **CD da Salvaguarda**: 8 + seu modificador de Constituição + seu Bônus de Proficiência.\n• **Recarga**: Você pode usar esta característica uma vez e recupera seu uso após terminar um Descanso Curto ou Longo.'
      },
      {
        name: 'Resistência a Dano',
        type: 'Defesa Passiva',
        description: 'Você tem **Resistência ao tipo de dano** associado ao seu ancestral dracônico (ex: Fogo, Frio, Ácido, Elétrico ou Veneno).'
      },
      {
        name: 'Idiomas',
        type: 'Comunicação',
        description: 'Você pode falar, ler e escrever **Comum** e **Dracônico**.'
      }
    ],
    lineagesTitle: 'Ancestrais Dracônicos (Tipos de Dragão)',
    lineages: [
      {
        name: 'Dragão Vermelho / Ouro / Latão (Fogo)',
        icon: '🔥',
        description: '• **Tipo de Dano**: Fogo.\n• **Resistência**: Dano de Fogo.\n• **Arma de Sopro**: Vermelho/Ouro: Cone de 4,5m (Salvaguarda de Destreza); Latão: Linha de 9m por 1,5m (Salvaguarda de Destreza).'
      },
      {
        name: 'Dragão Azul / Bronze (Elétrico)',
        icon: '⚡',
        description: '• **Tipo de Dano**: Elétrico.\n• **Resistência**: Dano Elétrico.\n• **Arma de Sopro**: Azul: Linha de 9m por 1,5m (Salvaguarda de Destreza); Bronze: Linha de 9m por 1,5m (Salvaguarda de Destreza).'
      },
      {
        name: 'Dragão Branco / Prata (Frio)',
        icon: '❄️',
        description: '• **Tipo de Dano**: Frio.\n• **Resistência**: Dano de Frio.\n• **Arma de Sopro**: Cone de 4,5m (Salvaguarda de Constituição).'
      },
      {
        name: 'Dragão Preto / Cobre (Ácido)',
        icon: '🧪',
        description: '• **Tipo de Dano**: Ácido.\n• **Resistência**: Dano Ácido.\n• **Arma de Sopro**: Linha de 9m por 1,5m (Salvaguarda de Destreza).'
      },
      {
        name: 'Dragão Verde (Veneno)',
        icon: '☠️',
        description: '• **Tipo de Dano**: Veneno.\n• **Resistência**: Dano de Veneno.\n• **Arma de Sopro**: Cone de 4,5m (Salvaguarda de Constituição).'
      }
    ]
  },
  {
    id: 'gnomo',
    name: 'Gnomo',
    icon: '⚙️',
    type: 'Humanoide',
    size: 'Pequeno (cerca de 0,90m a 1,20m de altura, pesando cerca de 20 kg)',
    speed: '7,5 metros',
    abilityScoreSummary: '+2 Inteligência',
    description: 'Uma energia vibrante e curiosidade insaciável pulsam através de cada fibra do corpo de um gnomo. Mestres da engenhosidade mecânica, da ilusão e da magia sutil, enfrentam a vida com entusiasmo contagiante e mente brilhante.',
    traits: [
      {
        name: 'Aumento no Valor de Habilidade',
        type: 'Atributo',
        description: 'Seu valor de **Inteligência aumenta em +2**.'
      },
      {
        name: 'Visão no Escuro (18 metros)',
        type: 'Sentido',
        description: 'Acostumado à vida subterrânea e tocas escuras, você enxerga na penumbra a até 18 metros como se fosse luz plena, e na escuridão como se fosse penumbra.'
      },
      {
        name: 'Esperteza Gnômica',
        type: 'Defesa Arcana',
        description: 'Você tem **Vantagem em todas as salvaguardas de Inteligência, Sabedoria e Carisma contra magias**.'
      },
      {
        name: 'Idiomas',
        type: 'Comunicação',
        description: 'Você pode falar, ler e escrever **Comum** e **Gnômico**.'
      }
    ],
    lineagesTitle: 'Sub-raças de Gnomo',
    lineages: [
      {
        name: 'Gnomo das Rochas',
        icon: '🔧',
        description: 'Como um gnomo das rochas, você possui uma inventividade natural e precisão para aparelhos mágicos e mecânicos.\n\n• **Aumento no Valor de Habilidade**: Seu valor de **Constituição aumenta em +1**.\n• **Conhecimento de Artífice**: Sempre que fizer um teste de História sobre itens mágicos, objetos alquímicos ou mecanismos tecnológicos, adicione o **dobro do seu bônus de proficiência**.\n• **Engenhoca**: Usando ferramentas de funileiro, 1 hora de trabalho e 10 PO em materiais, você pode construir um dispositivo mecânico Pequeno (AC 5, 1 PV) que dura 24 horas: *Brinquedo Mecânico*, *Isqueiro Mecânico* ou *Caixa de Música*.'
      },
      {
        name: 'Gnomo da Floresta',
        icon: '🍄',
        description: 'Como um gnomo da floresta, você possui um talento inato para a ilusão e furtividade natural entre os bosques.\n\n• **Aumento no Valor de Habilidade**: Seu valor de **Destreza aumenta em +1**.\n• **Ilusionista Nato**: Você conhece o truque *Ilusão Menor* (Inteligência é a sua habilidade para conjurá-lo).\n• **Falar com Feras Pequenas**: Através de sons e gestos, você pode comunicar ideias simples para feras Pequenas ou menores (como esquilos, texugos, coelhos e pássaros).'
      }
    ]
  },
  {
    id: 'meio-elfo',
    name: 'Meio-Elfo',
    icon: '🎭',
    type: 'Humanoide',
    size: 'Médio (cerca de 1,50m a 1,80m de altura, combinando traços de ambas as linhagens)',
    speed: '9 metros',
    abilityScoreSummary: '+2 Carisma, +1 em Dois Outros Atributos',
    description: 'Caminhando entre dois mundos mas não pertencendo inteiramente a nenhum, os meio-elfos combinam o que alguns dizem ser as melhores qualidades de seus pais elfos e humanos: a curiosidade, inventividade e ambição humanas temperadas pelos sentidos refinados, amor pela arte e graça mágica dos elfos.',
    traits: [
      {
        name: 'Aumento no Valor de Habilidade',
        type: 'Atributo',
        description: 'Seu valor de **Carisma aumenta em +2**, e **dois outros valores de habilidade à sua escolha aumentam em +1**.'
      },
      {
        name: 'Visão no Escuro (18 metros)',
        type: 'Sentido',
        description: 'Graças ao seu sangue élfico, você tem visão superior no escuro e na penumbra a até 18 metros.'
      },
      {
        name: 'Ancestralidade Feérica',
        type: 'Proteção Mágica',
        description: 'Você tem **Vantagem em salvaguardas para não ser enfeitiçado**, e a magia não pode colocar você para dormir.'
      },
      {
        name: 'Versatilidade em Perícias',
        type: 'Treinamento Amplo',
        description: 'Você ganha proficiência em **duas perícias à sua escolha**.'
      },
      {
        name: 'Idiomas',
        type: 'Comunicação',
        description: 'Você pode falar, ler e escrever **Comum**, **Élfico** e um idioma adicional à sua escolha.'
      }
    ],
    lineagesTitle: 'Heranças de Meio-Elfo',
    lineages: [
      {
        name: 'Meio-Elfo Clássico (Versatilidade)',
        icon: '🌟',
        description: 'A linhagem tradicional dotada de grande carisma social e adaptabilidade incomparável em qualquer terra.\n\n• **Bônus Flexíveis**: +2 Carisma e +1 em outros dois atributos.\n• **2 Perícias Extras**: Escolha livre entre qualquer uma das 18 perícias do jogo.'
      },
      {
        name: 'Herança Silvestre / Drow (Variante de Cenário)',
        icon: '🌲',
        description: 'Meio-elfos criados diretamente entre comunidades élficas que trocam a Versatilidade em Perícias por características élficas específicas:\n\n• *Herança da Floresta*: Deslocamento 10,5m ou Máscara da Natureza.\n• *Herança Drow*: Magia Drow (truques e magias inatas).'
      }
    ]
  },
  {
    id: 'meio-orc',
    name: 'Meio-Orc',
    icon: '⚔️',
    type: 'Humanoide',
    size: 'Médio (geralmente entre 1,75m e 2,10m, pesados e musculosos)',
    speed: '9 metros',
    abilityScoreSummary: '+2 Força, +1 Constituição',
    description: 'Quer estejam unidos sob os estandartes de uma horda militar ou lutando para encontrar seu espaço nas cidades civilizadas, os meio-orcs combinam a força bruta e fúria indômita dos orcs com a determinação inabalável dos humanos. Marcados por cicatrizes de batalha, não desistem enquanto houver fôlego em seus pulmões.',
    traits: [
      {
        name: 'Aumento no Valor de Habilidade',
        type: 'Atributo',
        description: 'Seu valor de **Força aumenta em +2** e seu valor de **Constituição aumenta em +1**.'
      },
      {
        name: 'Visão no Escuro (18 metros)',
        type: 'Sentido',
        description: 'Graças ao seu sangue orc, você enxerga na penumbra a até 18 metros como se fosse luz plena, e na escuridão como se fosse penumbra.'
      },
      {
        name: 'Ameaçador',
        type: 'Perícia',
        description: 'Você ganha proficiência na perícia **Intimidação**.'
      },
      {
        name: 'Resistência Implacável',
        type: 'Superação Heroica',
        description: 'Quando você for reduzido a **0 Pontos de Vida** mas não for morto instantaneamente, você pode optar por **cair para 1 Ponto de Vida** em vez disso. Uma vez usada, você recupera esta habilidade após terminar um Descanso Longo.'
      },
      {
        name: 'Ataques Selvagens',
        type: 'Crítico Devastador',
        description: 'Quando você acertar um **acerto crítico com uma arma corpo a corpo**, você pode rolar **um dos dados de dano da arma mais uma vez** e adicioná-lo ao dano extra do acerto crítico.'
      },
      {
        name: 'Idiomas',
        type: 'Comunicação',
        description: 'Você pode falar, ler e escrever **Comum** e **Orc**.'
      }
    ],
    lineagesTitle: 'Origens de Meio-Orc',
    lineages: [
      {
        name: 'Guerreiro das Tribos Fronteiriças',
        icon: '🛡️',
        description: 'Criado nas duras estepes e terras ermas, onde a força física e a resistência contra intempéries e monstros determinam a sobrevivência do clã.'
      },
      {
        name: 'Campeão dos Reinos Civilizados',
        icon: '🏰',
        description: 'Treinado como gladiador, cavaleiro mercenário ou guarda veterano, canalizando sua fúria natural em disciplina marcial implacável.'
      }
    ]
  },
  {
    id: 'tiefling',
    name: 'Tiefling',
    icon: '🔥',
    type: 'Humanoide',
    size: 'Médio (semelhante aos humanos em altura e peso)',
    speed: '9 metros',
    abilityScoreSummary: '+2 Carisma, +1 Inteligência',
    description: 'Herdeiros de um pacto ancestral que infundiu a essência dos Nove Infernos em sua linhagem de sangue. Os tieflings possuem chifres imponentes, cauda preênsil e olhos de cores sólidas. Embora frequentemente temidos por preconceito, possuem astúcia, encanto magnético e poder mágico ardente.',
    traits: [
      {
        name: 'Aumento no Valor de Habilidade',
        type: 'Atributo',
        description: 'Seu valor de **Carisma aumenta em +2** e seu valor de **Inteligência aumenta em +1**.'
      },
      {
        name: 'Visão no Escuro (18 metros)',
        type: 'Sentido',
        description: 'Graças à sua herança infernal, você enxerga na penumbra a até 18 metros como se fosse luz plena, e na escuridão como se fosse penumbra.'
      },
      {
        name: 'Resistência Infernal',
        type: 'Proteção Elemental',
        description: 'Você tem **Resistência a dano de Fogo**.'
      },
      {
        name: 'Legado Infernal',
        type: 'Magia Inata',
        description: 'Você conhece o truque *Taumaturgia*.\n• No **3º nível**, você pode conjurar a magia *Repreensão Infernal* como uma magia de 2º círculo uma vez por Descanso Longo.\n• No **5º nível**, você pode conjurar a magia *Escuridão* uma vez por Descanso Longo.\n• **Carisma** é a sua habilidade de conjuração para estas magias.'
      },
      {
        name: 'Idiomas',
        type: 'Comunicação',
        description: 'Você pode falar, ler e escrever **Comum** e **Infernal**.'
      }
    ],
    lineagesTitle: 'Linhagens Infernais',
    lineages: [
      {
        name: 'Linhagem de Asmodeus (Clássica do Livro do Jogador)',
        icon: '👑',
        description: 'A linhagem tradicional abençoada pelo Senhor dos Nove Infernos.\n\n• **Bônus**: +2 Carisma, +1 Inteligência.\n• **Magias**: *Taumaturgia*, *Repreensão Infernal* (2º nível) e *Escuridão* (3º nível).\n• **Resistência**: Dano de Fogo.'
      },
      {
        name: 'Tiefling Alado (Variante de Cenário)',
        icon: '🪽',
        description: 'Alguns tieflings manifestam asas coriáceas de morcego ou gárgula, trocando o Legado Infernal por deslocamento de **Voo de 9 metros** enquanto não vestirem armadura pesada.'
      }
    ]
  },
  {
    id: 'aasimar',
    name: 'Aasimar',
    icon: '✨',
    type: 'Humanoide',
    size: 'Médio',
    speed: '9 metros',
    abilityScoreSummary: '+2 Carisma',
    description: 'Seres mortais tocados pela centelha dos Planos Superiores. Descendentes de humanos com sangue celestial, carregam bênçãos divinas em sua alma e a luz sagrada de guardiões celestiais.',
    traits: [
      {
        name: 'Aumento no Valor de Habilidade',
        type: 'Atributo',
        description: 'Seu valor de **Carisma aumenta em +2**.'
      },
      {
        name: 'Visão no Escuro (18 metros)',
        type: 'Sentido',
        description: 'Você enxerga na penumbra a até 18 metros como se fosse luz plena, e na escuridão como se fosse penumbra.'
      },
      {
        name: 'Resistência Celestial',
        type: 'Defesa Divina',
        description: 'Você tem **Resistência a dano Necrótico e dano Radiante**.'
      },
      {
        name: 'Mãos que Curam',
        type: 'Ação / Cura',
        description: 'Como uma Ação, você pode tocar uma criatura e fazer com que ela recupere uma quantidade de Pontos de Vida igual ao seu **Nível de Personagem**. Você recupera o uso desta habilidade após um Descanso Longo.'
      },
      {
        name: 'Portador da Luz',
        type: 'Truque Inato',
        description: 'Você conhece o truque *Luz* (Carisma é a sua habilidade para este truque).'
      },
      {
        name: 'Idiomas',
        type: 'Comunicação',
        description: 'Você pode falar, ler e escrever **Comum** e **Celestial**.'
      }
    ],
    lineagesTitle: 'Sub-raças de Aasimar',
    lineages: [
      {
        name: 'Aasimar Protetor',
        icon: '🪽',
        description: '• **Aumento no Valor de Habilidade**: Seu valor de **Sabedoria aumenta em +1**.\n• **Alma Radiante (3º Nível)**: Como Ação Bônus por 1 minuto, asas cintilantes brotam de suas costas concedendo deslocamento de Voo de 9m. Uma vez por turno ao causar dano, causa dano Radiante extra igual ao seu nível.'
      },
      {
        name: 'Aasimar Flagelo',
        icon: '☀️',
        description: '• **Aumento no Valor de Habilidade**: Seu valor de **Constituição aumenta em +1**.\n• **Consumo Radiante (3º Nível)**: Como Ação Bônus por 1 minuto, queima com luz divina cegante. Criaturas a até 3m sofrem dano Radiante igual a metade do seu nível no final de seus turnos, e você causa dano Radiante extra igual ao seu nível 1x/turno.'
      },
      {
        name: 'Aasimar Caído',
        icon: '🌑',
        description: '• **Aumento no Valor de Habilidade**: Seu valor de **Força aumenta em +1**.\n• **Mortalha Necrótica (3º Nível)**: Como Ação Bônus, manifesta asas esqueléticas aterrorizantes. Criaturas a até 3m devem ser bem-sucedidas em salvaguarda de Carisma ou ficam Amedrontadas até o fim do seu próximo turno. Causa dano Necrótico extra igual ao seu nível 1x/turno.'
      }
    ]
  }
];

// Exportação universal para compatibilidade com o sistema
if (typeof window !== 'undefined') {
  window.SPECIES_DATA = SPECIES_DATA;
  window.RACES_DATA = SPECIES_DATA;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SPECIES_DATA, RACES_DATA: SPECIES_DATA };
}
