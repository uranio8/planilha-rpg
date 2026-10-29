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
  },
  // ==========================================================================
  // 🐾 RAÇAS DE VOLO'S GUIDE, TOME OF FOES & MONSTERS OF THE MULTIVERSE
  // ==========================================================================
  {
    id: 'tabaxi',
    name: 'Tabaxi',
    icon: '🐆',
    type: 'Humanoide',
    size: 'Médio',
    speed: '9 metros (Escalada 9 metros)',
    abilityScoreSummary: '+2 Destreza, +1 Carisma',
    description: 'Humanoides felinos originários de terras distantes e exóticas, movidos por uma curiosidade insaciável por relíquias, histórias e segredos esquecidos (Guia de Volo / Multiverse).',
    traits: [
      { name: 'Aumento no Valor de Habilidade', type: 'Atributo', description: 'Seu valor de **Destreza aumenta em +2** e seu valor de **Carisma aumenta em +1**.' },
      { name: 'Visão no Escuro (18 metros)', type: 'Sentido', description: 'Você enxerga na penumbra a até 18m como se fosse luz plena, e na escuridão como se fosse penumbra.' },
      { name: 'Agilidade Felina', type: 'Movimento Explosivo', description: 'Seus reflexos e agilidade permitem que você **dobre seu deslocamento no seu turno** (custo 0 de ação). Uma vez usado, você não pode usar novamente até passar um turno inteiro movendo 0 metros.' },
      { name: 'Garras de Gato', type: 'Arma Natural & Escalada', description: 'Você possui **deslocamento de escalada de 9m** e suas garras causam **1d6 + mod de Força de dano cortante** em ataques desarmados.' },
      { name: 'Talento Felino', type: 'Perícias', description: 'Você possui proficiência nas perícias **Percepção** e **Furtividade**.' },
      { name: 'Idiomas', type: 'Comunicação', description: 'Você pode falar, ler e escrever **Comum** e um outro idioma à sua escolha.' }
    ],
    lineagesTitle: 'Linhagem & Obsessão Tabaxi',
    lineages: [
      { name: 'Andarilho de Maztica (Volo\'s Guide)', icon: '🐆', description: '• **Obsessão Felina**: Guiado pelo Senhor Gato para colecionar lendas, relíquias perdidas e segredos de terras distantes.\n• **Atributos Clássicos (Volo)**: +2 Destreza e +1 Carisma.' },
      { name: 'Tabaxi do Multiverso (Monsters of the Multiverse)', icon: '🐾', description: '• **Atributos Flexíveis**: +2 em um atributo e +1 em outro (ou +1 em três).\n• **Garras Aprimoradas**: Causam 1d6 + Força cortante e concedem escalada de 9m igual à caminhada.' }
    ]
  },
  {
    id: 'kenku',
    name: 'Kenku',
    icon: '🐦‍⬛',
    type: 'Humanoide',
    size: 'Médio ou Pequeno',
    speed: '9 metros',
    abilityScoreSummary: '+2 Destreza, +1 Sabedoria',
    description: 'Povo-corvo bípede dotado de memória auditiva perfeita e talento inigualável para imitar vozes, sons e falsificar obras (Guia de Volo / Multiverse).',
    traits: [
      { name: 'Aumento no Valor de Habilidade', type: 'Atributo', description: 'Seu valor de **Destreza aumenta em +2** e seu valor de **Sabedoria aumenta em +1**.' },
      { name: 'Especialista em Falsificação', type: 'Perícia', description: 'Você pode duplicar a escrita e o trabalho artesanal de outras criaturas. Você tem **Vantagem em todos os testes feitos para produzir falsificações ou duplicatas** de objetos existentes.' },
      { name: 'Recordação Kenku', type: 'Perícias', description: 'Você ganha proficiência em duas perícias à sua escolha e pode usar Reação para ganhar **Vantagem** em um teste de perícia que tenha proficiência (usos iguais ao bônus de proficiência).' },
      { name: 'Mimetismo', type: 'Imitação Perfeita', description: 'Você pode imitar com perfeição quaisquer sons que já tenha ouvido, incluindo vozes humanas (teste de Intuição resistido por sua Enganação para perceber que é imitação).' }
    ],
    lineagesTitle: 'Linhagem & Origem Kenku',
    lineages: [
      { name: 'Bando das Sombras (Volo\'s Guide)', icon: '🐦‍⬛', description: '• **Comunicação por Ecos**: Comunica-se combinando sons, vozes e ruídos memorizados com precisão sobrenatural.\n• **Atributos Clássicos (Volo)**: +2 Destreza e +1 Sabedoria.' },
      { name: 'Kenku Liberto (Monsters of the Multiverse)', icon: '🪶', description: '• **Recordação Kenku**: Pode usar Reação para receber Vantagem em testes de perícia nos quais possui proficiência.' }
    ]
  },
  {
    id: 'firbolg',
    name: 'Firbolg',
    icon: '🌿',
    type: 'Humanoide (Parente de Gigante)',
    size: 'Médio (entre 2,10m e 2,40m)',
    speed: '9 metros',
    abilityScoreSummary: '+2 Sabedoria, +1 Força',
    description: 'Guardiões gentis e reclusos das florestas ancestrais, dotados de magia druídica inata e da capacidade de desaparecer entre as árvores (Guia de Volo / Multiverse).',
    traits: [
      { name: 'Aumento no Valor de Habilidade', type: 'Atributo', description: 'Seu valor de **Sabedoria aumenta em +2** e seu valor de **Força aumenta em +1**.' },
      { name: 'Magia Firbolg', type: 'Magia Inata', description: 'Você pode conjurar *Detectar Magia* e *Disfarçar-se* (podendo parecer até 90cm mais baixo) sem gastar espaço de magia (recupera em descanso curto ou longo).' },
      { name: 'Passo Oculto (Hidden Step)', type: 'Ação Bônus / Invisibilidade', description: 'Com uma **Ação Bônus**, você fica magicamente **Invisível** até o início do seu próximo turno ou até atacar, causar dano ou forçar uma salvaguarda.' },
      { name: 'Constituição Poderosa', type: 'Capacidade de Carga', description: 'Você conta como uma categoria de tamanho maior (Grande) para determinar sua capacidade de carga e o peso que pode empurrar, arrastar ou erguer.' },
      { name: 'Fala da Fera e da Folha', type: 'Comunicação Natural', description: 'Você pode comunicar ideias simples para feras e plantas, e tem **Vantagem em testes de Carisma** para influenciá-las.' }
    ],
    lineagesTitle: 'Linhagem & Clãs Firbolg',
    lineages: [
      { name: 'Guardião da Floresta Antiga (Volo\'s Guide)', icon: '🌲', description: '• **Código da Floresta**: Vive em harmonia invisível com a natureza, usando Passo Oculto e Disfarçar-se para proteger os bosques.\n• **Atributos Clássicos**: +2 Sabedoria e +1 Força.' }
    ]
  },
  {
    id: 'povo_lagarto',
    name: 'Povo-Lagarto (Lizardfolk)',
    icon: '🦎',
    type: 'Humanoide',
    size: 'Médio',
    speed: '9 metros (Natação 9 metros)',
    abilityScoreSummary: '+2 Constituição, +1 Sabedoria',
    description: 'Sobreviventes reptilianos pragmáticos dos pântanos, equipados com escamas resistentes, mandíbulas ferozes e artesanato de ossos (Guia de Volo / Multiverse).',
    traits: [
      { name: 'Aumento no Valor de Habilidade', type: 'Atributo', description: 'Seu valor de **Constituição aumenta em +2** e seu valor de **Sabedoria aumenta em +1**.' },
      { name: 'Mordida & Mandíbulas Famintas', type: 'Arma Natural / PV Temp', description: 'Sua mordida causa **1d6 + mod de Força de dano perfurante**. Além disso, com uma **Ação Bônus**, você pode desferir um ataque especial de mordida; se acertar, ganha **PV temporários iguais ao seu bônus de proficiência** (ou mod de Constituição).' },
      { name: 'Armadura Natural', type: 'Defesa Escamosa', description: 'Quando não estiver usando armadura, sua **CA é 13 + seu modificador de Destreza** (você ainda pode usar escudo).' },
      { name: 'Prender a Respiração & Natação', type: 'Anfíbio', description: 'Você tem deslocamento de natação de 9m e pode prender a respiração por até **15 minutos**.' },
      { name: 'Intuição da Natureza', type: 'Perícias', description: 'Você ganha proficiência em duas perícias entre Adestrar Animais, Natureza, Percepção, Furtividade e Sobrevivência.' }
    ],
    lineagesTitle: 'Linhagem Povo-Lagarto',
    lineages: [
      { name: 'Caçador do Pântano (Volo\'s Guide)', icon: '🦎', description: '• **Artesão Astuto**: Fabrica escudos, dardos e clavas a partir de ossos e carcaças durante descansos curtos.\n• **Mandíbulas Famintas**: Mordida em Ação Bônus que concede PV temporários.' }
    ]
  },
  {
    id: 'tritao',
    name: 'Tritão (Triton)',
    icon: '🔱',
    type: 'Humanoide Anfíbio',
    size: 'Médio',
    speed: '9 metros (Natação 9 metros)',
    abilityScoreSummary: '+1 Força, +1 Constituição, +1 Carisma',
    description: 'Nobres protetores das fossas abissais oceânicas que emergiram para combater ameaças elementais na superfície (Guia de Volo / Multiverse).',
    traits: [
      { name: 'Aumento no Valor de Habilidade', type: 'Atributo', description: 'Seus valores de **Força, Constituição e Carisma aumentam em +1 cada**.' },
      { name: 'Anfíbio & Guardião das Profundezas', type: 'Defesa Abissal', description: 'Você respira ar e água, e possui **Resistência a dano de frio**.' },
      { name: 'Controle do Ar e da Água', type: 'Magia Inata', description: 'Você pode conjurar *Névoa Obscurecente* (1º nv), *Lufada de Vento* (3º nv) e *Muralha de Água* (5º nv) 1x por descanso longo.' },
      { name: 'Emissário do Mar', type: 'Comunicação', description: 'Você pode comunicar ideias simples para feras que respiram na água.' }
    ],
    lineagesTitle: 'Linhagem Tritão',
    lineages: [
      { name: 'Protetor dos Protetorados Abissais', icon: '🔱', description: '• **Nobreza Submarina**: Guardiões juramentados contra krakens e fendas do Plano Elemental da Água (+1 FOR, +1 CON, +1 CAR).' }
    ]
  },
  {
    id: 'aarakocra',
    name: 'Aarakocra',
    icon: '🦅',
    type: 'Humanoide Alado',
    size: 'Médio',
    speed: '9 metros (Voo 9m a 15m)',
    abilityScoreSummary: '+2 Destreza, +1 Sabedoria',
    description: 'Povo-pássaro originário do Plano Elemental do Ar, patrulhando os picos mais altos com voo ágil e garras afiadas (Monsters of the Multiverse).',
    traits: [
      { name: 'Aumento no Valor de Habilidade', type: 'Atributo', description: 'Seu valor de **Destreza aumenta em +2** e seu valor de **Sabedoria aumenta em +1**.' },
      { name: 'Voo', type: 'Movimento Aéreo', description: 'Graças às suas asas, você possui **deslocamento de voo** desde que não esteja vestindo armadura média ou pesada.' },
      { name: 'Garras (Talons)', type: 'Arma Natural', description: 'Suas garras causam **1d6 + mod de Força de dano cortante** em ataques desarmados.' },
      { name: 'Chamado do Vento', type: 'Magia Inata', description: 'A partir do 3º nível, você pode conjurar a magia *Lufada de Vento* sem componentes materiais.' }
    ],
    lineagesTitle: 'Linhagem Aarakocra',
    lineages: [
      { name: 'Sentinela dos Ventos (Plano do Ar)', icon: '🦅', description: '• **Patrulheiro Celeste**: Domina as correntes térmicas com deslocamento de voo e invocação de *Lufada de Vento*.' }
    ]
  },
  {
    id: 'genasi',
    name: 'Genasi',
    icon: '🔥',
    type: 'Humanoide Elemental',
    size: 'Médio',
    speed: '9 metros',
    abilityScoreSummary: '+2 Constituição, +1 Atributo da Sub-raça',
    description: 'Mortais tocados pelo poder dos gênios e dos Planos Elementais do Ar, Terra, Fogo e Água (Monsters of the Multiverse).',
    traits: [
      { name: 'Aumento no Valor de Habilidade', type: 'Atributo', description: 'Seu valor de **Constituição aumenta em +2**, além do bônus da sua herança elemental.' },
      { name: 'Visão no Escuro (18 metros)', type: 'Sentido', description: 'Você enxerga na penumbra a até 18m como luz plena e na escuridão como penumbra.' }
    ],
    lineagesTitle: 'Heranças Elementais Genasi',
    lineages: [
      { name: 'Genasi do Ar', icon: '💨', description: '• **+1 Destreza**.\n• **Fôlego Infinito**: Pode prender a respiração indefinidamente.\n• **Misturar-se ao Vento**: Conhece *Toque Chocante*, *Queda Suave* (3º nv) e *Levitação* (5º nv), além de **Resistência a dano elétrico**.' },
      { name: 'Genasi da Terra', icon: '🪨', description: '• **+1 Força**.\n• **Caminhar na Terra**: Ignora terreno difícil de terra ou pedra.\n• **Fundir-se à Pedra**: Conhece *Proteção contra Lâminas* (como Ação Bônus!) e *Passos sem Pegadas* (5º nv).' },
      { name: 'Genasi do Fogo', icon: '🔥', description: '• **+1 Inteligência**.\n• **Resistência a Fogo**: Você tem **Resistência a dano de fogo**.\n• **Alcançar o Labareda**: Conhece *Produzir Chamas*, *Mãos Flamejantes* (3º nv) e *Lâmina Flamejante* (5º nv).' },
      { name: 'Genasi da Água', icon: '🌊', description: '• **+1 Sabedoria**.\n• **Anfíbio & Resistência a Ácido**: Respira na água, nada 9m e tem **Resistência a dano ácido**.\n• **Chamar a Onda**: Conhece *Esporro Ácido*, *Criar ou Destruir Água* (3º nv) e *Caminhar na Água* (5º nv).' }
    ]
  },
  {
    id: 'gith',
    name: 'Gith (Githyanki & Githzerai)',
    icon: '🪐',
    type: 'Humanoide Astral',
    size: 'Médio',
    speed: '9 metros',
    abilityScoreSummary: '+1 Inteligência, +2 Força (Githyanki) ou +2 Sabedoria (Githzerai)',
    description: 'Povo ancestral libertado da escravidão dos Devoradores de Mentes, dividido entre os guerreiros astrais Githyanki e os monges psíquicos Githzerai (Tome of Foes / Multiverse).',
    traits: [
      { name: 'Aumento no Valor de Habilidade', type: 'Atributo', description: 'Seu valor de **Inteligência aumenta em +1**, mais +2 Força (Githyanki) ou +2 Sabedoria (Githzerai).' },
      { name: 'Resistência Psíquica', type: 'Defesa Mental', description: 'Você tem **Resistência a dano psíquico**.' }
    ],
    lineagesTitle: 'Sub-raças Gith',
    lineages: [
      { name: 'Githyanki', icon: '⚔️', description: '• **+2 Força**.\n• **Prodígio Astral**: Proficiência em 1 perícia e 1 ferramenta/arma que pode trocar a cada descanso longo.\n• **Psiônicos Githyanki**: Conhece *Mão Mágica* (invisível), *Salto* (3º nv) e *Passo Nebuloso* (5º nv).' },
      { name: 'Githzerai', icon: '🧘', description: '• **+2 Sabedoria**.\n• **Disciplina Mental**: **Vantagem em salvaguardas contra ser Enfeitiçado e Amedrontado**.\n• **Psiônicos Githzerai**: Conhece *Mão Mágica* (invisível), *Escudo Arcano* (3º nv) e *Detectar Pensamentos* (5º nv).' }
    ]
  },
  {
    id: 'tortle',
    name: 'Tortle (Povo-Tartaruga)',
    icon: '🐢',
    type: 'Humanoide',
    size: 'Médio',
    speed: '9 metros',
    abilityScoreSummary: '+2 Força, +1 Sabedoria',
    description: 'Aventureiros nômades que carregam seu próprio lar e proteção nas costas na forma de uma carapaça quase impenetrável (Monsters of the Multiverse).',
    traits: [
      { name: 'Aumento no Valor de Habilidade', type: 'Atributo', description: 'Seu valor de **Força aumenta em +2** e seu valor de **Sabedoria aumenta em +1**.' },
      { name: 'Carapaça Natural (CA 17)', type: 'Defesa Suprema', description: 'Sua carapaça fornece uma **Classe de Armadura base de 17** (modificador de Destreza não afeta esse número; você não pode vestir armaduras, mas **pode usar escudo para chegar a CA 19+**).' },
      { name: 'Defesa no Casco', type: 'Ação Defensiva', description: 'Com uma Ação, recolha-se no casco: **+4 de bônus na CA** e **Vantagem em salvaguardas de Força e Constituição**.' },
      { name: 'Garras & Fôlego', type: 'Natural', description: 'Garras causam 1d6 + Força cortante e você pode prender a respiração por até **1 hora**.' }
    ],
    lineagesTitle: 'Linhagem Tortle',
    lineages: [
      { name: 'Nômade da Península do Focinho', icon: '🐢', description: '• **Carapaça Impenetrável**: CA base fixa de 17 (+2 com escudo = CA 19) e Defesa no Casco (+4 CA).' }
    ]
  },
  {
    id: 'harengon',
    name: 'Harengon (Povo-Coelho)',
    icon: '🐇',
    type: 'Humanoide Feérico',
    size: 'Médio ou Pequeno',
    speed: '9 metros',
    abilityScoreSummary: '+2 Destreza, +1 Sabedoria',
    description: 'Originários da Faéria, os Harengon possuem reflexos relâmpago, sorte feérica e saltos prodigiosos que ignoram o perigo (Monsters of the Multiverse).',
    traits: [
      { name: 'Aumento no Valor de Habilidade', type: 'Atributo', description: 'Seu valor de **Destreza aumenta em +2** e seu valor de **Sabedoria aumenta em +1**.' },
      { name: 'Gatilho de Lebre (Hare-Trigger)', type: 'Iniciativa Superior', description: 'Você adiciona seu **bônus de proficiência às suas rolagens de Iniciativa**!' },
      { name: 'Pés da Sorte', type: 'Reação', description: 'Quando falhar em uma salvaguarda de Destreza, use sua **Reação para rolar 1d4 e somar ao resultado**.' },
      { name: 'Salto de Coelho', type: 'Ação Bônus', description: 'Com uma **Ação Bônus**, salte uma distância em metros igual a **1,5 × seu bônus de proficiência sem provocar ataques de oportunidade**.' }
    ],
    lineagesTitle: 'Linhagem Harengon',
    lineages: [
      { name: 'Viajante de Prismeer (Faéria)', icon: '🐇', description: '• **Espírito Livre da Faéria**: Soma o bônus de proficiência à Iniciativa e salta em Ação Bônus sem provocar ataques de oportunidade.' }
    ]
  },
  {
    id: 'fada',
    name: 'Fada (Fairy)',
    icon: '🧚',
    type: 'Fada',
    size: 'Pequeno',
    speed: '9 metros (Voo 9 metros)',
    abilityScoreSummary: '+2 Destreza, +1 Carisma',
    description: 'Criaturas aladas nativas da Faéria imbuídas com magia cintilante e voo natural (Monsters of the Multiverse).',
    traits: [
      { name: 'Aumento no Valor de Habilidade', type: 'Atributo', description: 'Seu valor de **Destreza aumenta em +2** e seu valor de **Carisma aumenta em +1**.' },
      { name: 'Voo Feérico', type: 'Voo', description: 'Por causa de suas asas, você possui **deslocamento de voo igual ao seu deslocamento de caminhada** (sem armadura média ou pesada).' },
      { name: 'Magia de Fada', type: 'Magia Inata', description: 'Você conhece o truque *Druidismo*, *Fogo das Fadas* (3º nv) e *Aumentar/Reduzir* (5º nv).' }
    ],
    lineagesTitle: 'Linhagem Fada',
    lineages: [
      { name: 'Corte Seelie / Unseelie (Faéria)', icon: '🧚', description: '• **Asas Cintilantes**: Tipo de criatura Fada (imune a *Imobilizar Pessoa*), Voo de 9m e magias *Fogo das Fadas* e *Aumentar/Reduzir*.' }
    ]
  },
  {
    id: 'metamorfo',
    name: 'Metamorfo (Changeling)',
    icon: '🎭',
    type: 'Fada / Humanoide',
    size: 'Médio ou Pequeno',
    speed: '9 metros',
    abilityScoreSummary: '+2 Carisma, +1 Destreza',
    description: 'Mestres da transformação física capazes de alterar seu rosto, voz, altura e aparência com um pensamento (Monsters of the Multiverse).',
    traits: [
      { name: 'Aumento no Valor de Habilidade', type: 'Atributo', description: 'Seu valor de **Carisma aumenta em +2** e seu valor de **Destreza aumenta em +1**.' },
      { name: 'Mudar Forma (Shapechanger)', type: 'Ação', description: 'Com uma Ação, você muda sua aparência e sua voz (incluindo altura, peso, traços faciais, cabelo e tamanho entre Médio e Pequeno).' },
      { name: 'Instinto de Metamorfo', type: 'Perícias Sociais', description: 'Você ganha proficiência em **duas perícias** entre Atuação, Enganação, Intimidação, Intuição e Persuasão.' }
    ],
    lineagesTitle: 'Linhagem Metamorfo',
    lineages: [
      { name: 'Viajante de Mil Rostos', icon: '🎭', description: '• **Identidade Fluida**: Altera rosto, voz e porte físico (Médio ou Pequeno) com uma Ação, mantendo suas estatísticas de jogo.' }
    ]
  },
  {
    id: 'yuan_ti',
    name: 'Yuan-ti',
    icon: '🐍',
    type: 'Humanoide Ofídio',
    size: 'Médio',
    speed: '9 metros',
    abilityScoreSummary: '+2 Carisma, +1 Inteligência',
    description: 'Descendentes de um antigo império que fundiu sua linhagem à das serpentes, adquirindo resistência mágica e imunidade a venenos (Volo\'s Guide / Multiverse).',
    traits: [
      { name: 'Aumento no Valor de Habilidade', type: 'Atributo', description: 'Seu valor de **Carisma aumenta em +2** e seu valor de **Inteligência aumenta em +1**.' },
      { name: 'Resistência à Magia', type: 'Defesa Arcana', description: 'Você possui **Vantagem em testes de resistência contra magias** e outros efeitos mágicos.' },
      { name: 'Resiliência a Veneno', type: 'Defesa', description: 'Você tem **Vantagem em salvaguardas contra ser Envenenado** e **Resistência (ou Imunidade) a dano de veneno**.' },
      { name: 'Conjuração Ofídia', type: 'Magia Inata', description: 'Você conhece o truque *Rajada de Veneno*, pode conjurar *Amizade Animal* (sem limite em cobras) e *Sugestão* (3º nv).' }
    ],
    lineagesTitle: 'Linhagem Yuan-ti',
    lineages: [
      { name: 'Puro-Sangue Ofídio (Volo / Multiverse)', icon: '🐍', description: '• **Sangue Serpentino**: Aparência humana com traços sutis (olhos fendidos, língua bifurcada ou escamas), dotado de Resistência à Magia e Resiliência a Veneno.' }
    ]
  }
];

// Adiciona Sub-raças Clássicas de Tome of Foes (Duergar em Anão, Eladrin e Shadar-kai em Elfo)
(function enrichExistingSpeciesLineages() {
  const anao = SPECIES_DATA.find(s => s.id === 'anao');
  if (anao && Array.isArray(anao.lineages) && !anao.lineages.some(l => l.name.includes('Duergar'))) {
    anao.lineages.push({
      name: 'Duergar (Anão Cinzento - Tome of Foes)',
      icon: '⛏️',
      description: '• **Aumento no Valor de Habilidade**: **+1 Força**.\n• **Visão no Escuro Superior**: Alcance de **36 metros**.\n• **Resiliência Duergar**: Vantagem contra ilusões, ser Enfeitiçado ou Paralisado.\n• **Magia Duergar**: Conjura *Aumentar/Reduzir* (3º nv) e *Invisibilidade* (5º nv) em si mesmo sem gastar slot.'
    });
  }
  const elfo = SPECIES_DATA.find(s => s.id === 'elfo');
  if (elfo && Array.isArray(elfo.lineages)) {
    if (!elfo.lineages.some(l => l.name.includes('Eladrin'))) {
      elfo.lineages.push({
        name: 'Eladrin (Elfo das Estações - Tome of Foes)',
        icon: '🍂',
        description: '• **Aumento no Valor de Habilidade**: **+1 Carisma**.\n• **Passo Feérico (Fey Step)**: Com uma **Ação Bônus**, teletransporte-se até **9 metros** com efeito adicional da sua estação atual (*Outono*: encanta 2 criaturas; *Inverno*: amedronta 1 alvo; *Primavera*: teletransporta aliado; *Verão*: causa dano de fogo).'
      });
    }
    if (!elfo.lineages.some(l => l.name.includes('Shadar-kai'))) {
      elfo.lineages.push({
        name: 'Shadar-kai (Elfo da Umbra - Tome of Foes)',
        icon: '🐦‍⬛',
        description: '• **Aumento no Valor de Habilidade**: **+1 Constituição**.\n• **Resistência Necrótica**: Você tem **Resistência a dano necrótico**.\n• **Bênção da Rainha Corvo**: Com uma **Ação Bônus**, teletransporte-se até **9 metros** e ganhe **Resistência a TODO tipo de dano** até o início do seu próximo turno!'
      });
    }
  }
})();

// Exportação universal para compatibilidade com o sistema
if (typeof window !== 'undefined') {
  window.SPECIES_DATA = SPECIES_DATA;
  window.RACES_DATA = SPECIES_DATA;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SPECIES_DATA, RACES_DATA: SPECIES_DATA };
}
