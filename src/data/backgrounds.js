// ============================================================================
// 🎭 D&D 5ª EDIÇÃO - BASE DE DADOS OFICIAL DE ANTECEDENTES (BACKGROUNDS)
// Extraído e estruturado a partir de Antecedentes.pdf e Guia de Xanathar (PT-BR)
// ============================================================================

const BACKGROUNDS_DATA = [
  {
    id: 'acolito',
    name: 'Acólito',
    icon: '🙏',
    summary: 'Você passou sua vida a serviço de um templo de algum deus específico ou panteão, atuando como intermediário entre o reino divino e o reino dos mortais.',
    skillProficiencies: ['Intuição', 'Religião'],
    toolProficiencies: 'Nenhuma',
    languages: 'Dois idiomas à sua escolha',
    equipment: 'Um símbolo sagrado (um presente dado quando você entrou no templo), um livro de preces ou uma roda de oração, 5 varetas de incenso, vestimentas, um conjunto de roupas comuns e uma algibeira contendo 15 PO.',
    startingGold: 15,
    featureName: 'Abrigo dos Fiéis',
    featureDesc: 'Como um acólito, você detém o respeito daqueles que compartilham de sua fé e pode realizar cerimônias religiosas de sua divindade. Você e seus companheiros de aventura podem esperar receber cura gratuita e cuidados em um templo, santuário ou outro posto de sua fé (embora devam fornecer quaisquer componentes materiais necessários para as magias). Aqueles que compartilham de sua religião irão sustentá-lo (mas apenas você) em um estilo de vida modesto.',
    personalityTraits: [
      'Eu idolatro um herói particular da minha fé, e constantemente me refiro a seus feitos e exemplos.',
      'Eu consigo encontrar semelhanças mesmo entre os inimigos mais violentos, com empatia e sempre trabalhando pela paz.',
      'Eu vejo presságios em cada evento e ação. Os deuses estão falando conosco, nós apenas temos de ouvi-los.',
      'Nada pode abalar minha atitude otimista.',
      'Eu cito (corretamente ou não) textos sagrados e provérbios em quase qualquer situação.',
      'Eu sou tolerante (ou intolerante) a qualquer outra fé, e respeito (ou condeno) a adoração a outros deuses.',
      'Eu aprecio comida requintada, bebidas e a elite entre o alto escalão de meu templo. Uma vida dura me irrita.',
      'Eu passei tanto tempo no templo que possuo pouca prática em lidar com as pessoas mundo afora.'
    ],
    ideals: [
      'Tradição. As tradições ancestrais de adoração e sacrifício devem ser preservadas e perpetradas. (Leal)',
      'Caridade. Eu sempre tento ajudar aqueles em necessidade, não importando o custo pessoal. (Bom)',
      'Mudança. Nós devemos ajudar a conduzir as mudanças que os deuses estão constantemente trabalhando para o mundo. (Caótico)',
      'Poder. Eu espero que um dia eu consiga chegar ao topo na hierarquia da minha religião. (Leal)',
      'Fé. Eu acredito que minha divindade guia minhas ações. Eu tenho fé que, se eu trabalhar duro, coisas boas acontecerão. (Leal)',
      'Aspiração. Eu busco ser digno da graça do meu deus ao corresponder minhas ações aos seus ensinamentos. (Qualquer)'
    ],
    bonds: [
      'Eu morreria para recuperar uma relíquia ancestral de minha fé, perdida há muito tempo.',
      'Eu ainda terei minha vingança contra o templo corrupto que me acusou de heresia.',
      'Eu devo minha vida ao sacerdote que me acolheu quando meus pais morreram.',
      'Tudo o que faço, faço pelo povo comum.',
      'Eu farei qualquer coisa para proteger o templo onde sirvo.',
      'Eu busco guardar um texto sagrado que meus inimigos dizem ser herético e tentam destruir.'
    ],
    flaws: [
      'Eu julgo os outros severamente, e a mim mesmo mais ainda.',
      'Eu deposito muita confiança naqueles que detêm o poder na hierarquia de meu templo.',
      'Minha devoção muitas vezes me cega perante aqueles que professam a fé do meu deus.',
      'Meu pensamento é inflexível.',
      'Eu suspeito de estranhos e sempre espero o pior deles.',
      'Depois de escolher um objetivo, eu fico obcecado em cumpri-lo, até mesmo em detrimento de qualquer outra coisa em minha vida.'
    ]
  },
  {
    id: 'artesao_guilda',
    name: 'Artesão de Guilda',
    icon: '🔨',
    summary: 'Você é membro de uma guilda de artesãos, hábil em um campo particular e intimamente associado com outros mestres do ofício no mundo mercantil.',
    skillProficiencies: ['Intuição', 'Persuasão'],
    toolProficiencies: 'Um tipo de ferramenta de artesão',
    languages: 'Um idioma à sua escolha',
    equipment: 'Um conjunto de ferramentas de artesão (de sua escolha), uma carta de apresentação da sua guilda, um conjunto de roupas de viajante e uma algibeira contendo 15 PO.',
    startingGold: 15,
    featureName: 'Associado da Guilda',
    featureDesc: 'Como um membro estabelecido e respeitado de uma guilda, você pode contar com certos benefícios que a sociedade garante. Seus companheiros de guilda irão provê-lo com hospedagem e comida se necessário, e pagarão pelo seu funeral se preciso for. Em algumas cidades e vilas, um salão da guilda oferece um local central para encontrar outros membros, potenciais patrões, aliados ou contratados.',
    personalityTraits: [
      'Eu acredito que tudo que valha a pena fazer, vale a pena ser bem feito. Eu não consigo evitar – sou perfeccionista.',
      'Eu sou um esnobe que olha de cima a baixo para aqueles que não sabem apreciar artes requintadas.',
      'Eu sempre quero saber como as coisas funcionam e o que faz as pessoas serem motivadas.',
      'Eu sou cheio de aforismos espirituosos e tenho um provérbio para cada ocasião.',
      'Eu sou grosso com as pessoas que não têm o mesmo comprometimento que eu com o trabalho duro e honesto.',
      'Eu gosto de falar longamente sobre minha profissão.',
      'Eu não gasto meu dinheiro facilmente e pechincho incansavelmente para conseguir o melhor acordo possível.',
      'Eu sou bem conhecido pelo meu trabalho, e quero ter certeza de que todos o apreciam.'
    ],
    ideals: [
      'Comunidade. É dever de todas as pessoas civilizadas fortalecer os elos da comunidade e a segurança da civilização. (Leal)',
      'Generosidade. Meus talentos me foram dados para que eu pudesse usá-los para beneficiar o mundo. (Bom)',
      'Liberdade. Todos deveriam ser livres para perseguir seu próprio sustento. (Caótico)',
      'Ganância. Eu só estou aqui pelo dinheiro. (Mau)',
      'Povo. Eu sou cometido com as pessoas com quem me importo, não com ideais. (Neutro)',
      'Aspiração. Eu trabalho duro para ser o melhor no meu ofício. (Qualquer)'
    ],
    bonds: [
      'A oficina onde aprendi meu ofício é o local mais importante do mundo para mim.',
      'Eu criei um ótimo trabalho para alguém, e então descobri que ele não era digno de recebê-lo. Ainda estou à procura de alguém que seja digno.',
      'Eu devo muito à minha guilda por forjar quem eu sou hoje.',
      'Eu busco riqueza para assegurar o amor de alguém.',
      'Um dia eu voltarei para a minha guilda e provarei que sou o maior artesão dentre eles.',
      'Eu irei me vingar das forças malignas que destruíram meu local de negócios e arruinaram meu estilo de vida.'
    ],
    flaws: [
      'Eu farei de tudo para pôr minhas mãos em algo raro ou inestimável.',
      'Eu rapidamente presumo que alguém está tentando me trapacear.',
      'Ninguém nunca poderá saber que eu certa vez roubei dos cofres da guilda.',
      'Eu nunca estou satisfeito com o que tenho – eu sempre quero mais.',
      'Eu mataria para adquirir um título de nobreza.',
      'Eu sou horrivelmente invejoso com qualquer um que possa ofuscar meu trabalho manual.'
    ]
  },
  {
    id: 'artista',
    name: 'Artista',
    icon: '🎭',
    summary: 'Você prospera na frente de uma plateia. Você sabe como arrebatá-los, entretê-los e até inspirá-los com música, dança, poesia ou acrobacias.',
    skillProficiencies: ['Acrobacia', 'Atuação'],
    toolProficiencies: 'Kit de disfarce, um tipo de instrumento musical',
    languages: 'Nenhum adicional',
    equipment: 'Um instrumento musical (à sua escolha), o favor de um admirador (carta de amor, mecha de cabelo ou bugiganga), uma fantasia e uma algibeira contendo 15 PO.',
    startingGold: 15,
    featureName: 'Pela Demanda Popular',
    featureDesc: 'Você sempre pode encontrar um lugar para atuar, geralmente em uma estalagem ou taverna, mas possivelmente em um circo, em um teatro ou mesmo na corte de um nobre. Em tal lugar, você recebe alojamento e comida modesta ou confortável de graça (dependendo da qualidade do estabelecimento), desde que você atue a cada noite. Além disso, sua atuação torna você uma figura local.',
    personalityTraits: [
      'Eu conheço uma história relevante para praticamente todas as situações.',
      'Sempre que eu chego em um lugar novo, eu coleto os rumores locais e espalho fofocas.',
      'Eu sou um romântico incorrigível, sempre em busca daquele "alguém especial".',
      'Ninguém fica com raiva de mim ou perto de mim por muito tempo, já que eu posso acabar com qualquer tipo de tensão.',
      'Eu amo um bom insulto, até mesmo os direcionados a mim.',
      'Eu fico ressentido quando não sou o centro das atenções.',
      'Eu me contento apenas com a perfeição.',
      'Eu mudo de ânimo ou de pensamento tão rápido quanto mudo a nota de uma canção.'
    ],
    ideals: [
      'Beleza. Quando eu atuo, eu torno o mundo melhor do que ele era. (Bom)',
      'Tradição. As histórias, lendas e canções do passado nunca devem ser esquecidas, pois elas nos ensinam quem somos. (Leal)',
      'Criatividade. O mundo precisa de novas ideias e ações ousadas. (Caótico)',
      'Ganância. Eu só estou aqui pelo dinheiro e pela fama. (Mau)',
      'Povo. Eu gosto de ver os sorrisos nos rostos das pessoas quando eu atuo. Isso é tudo que importa. (Neutro)',
      'Honestidade. A arte deve refletir a alma; ela deve vir de dentro e revelar quem realmente somos. (Qualquer)'
    ],
    bonds: [
      'Meu instrumento é meu bem mais valioso e ele me lembra de alguém que eu amo.',
      'Alguém roubou meu precioso instrumento e, algum dia, eu vou pegá-lo de volta.',
      'Eu quero ser famoso, custe o que custar.',
      'Eu idolatro um herói dos contos antigos e mensuro meus feitos Pelos dele.',
      'Eu farei qualquer coisa para provar que sou superior ao meu odiado rival.',
      'Eu faria qualquer coisa pelos outros membros da minha antiga trupe.'
    ],
    flaws: [
      'Eu farei de tudo para ganhar fama e renome.',
      'Eu viro um idiota quando vejo um rosto bonito.',
      'Um escândalo impede que eu volte para casa novamente. Esse tipo de problema parece me perseguir por aí.',
      'Eu certa vez satirizei um nobre que ainda quer minha cabeça. Foi um erro que eu adoraria repetir.',
      'Eu tenho problemas em esconder meus verdadeiros sentimentos. Minha língua afiada sempre me mete em confusão.',
      'Apesar dos meus melhores esforços, meus amigos não me consideram confiável.'
    ]
  },
  {
    id: 'charlatao',
    name: 'Charlatão',
    icon: '🃏',
    summary: 'Você sempre teve jeito com as pessoas, sabendo exatamente o que promete seus desejos e usando disfarces, lábia e truques para tirar vantagem.',
    skillProficiencies: ['Enganação', 'Prestidigitação'],
    toolProficiencies: 'Kit de disfarce, kit de falsificação',
    languages: 'Nenhum adicional',
    equipment: 'Um conjunto de roupas finas, um kit de disfarce, ferramentas de trapaça (como dados viciados ou cartas marcadas) e uma algibeira contendo 15 PO.',
    startingGold: 15,
    featureName: 'Identidade Falsa',
    featureDesc: 'Você criou uma segunda identidade que inclui documentação, conhecimentos estabelecidos e disfarces que possibilitam que você assuma essa persona. Além disso, você pode forjar documentos, incluindo papéis oficiais e cartas pessoais, contanto que tenha visto um exemplo do tipo de documento ou a caligrafia de quem você está tentando copiar.',
    personalityTraits: [
      'Eu me apaixono e desapaixono facilmente, e estou sempre em busca de alguém.',
      'Eu tenho uma piada para cada ocasião, especialmente ocasiões em que o humor é inapropriado.',
      'Bajulação é meu truque predileto para conseguir o que eu quero.',
      'Eu sou um jogador nato que não consegue resistir a se arriscar por uma possível recompensa.',
      'Eu minto sobre quase tudo, mesmo quando não existe qualquer boa razão para fazê-lo.',
      'Sarcasmo e insultos são minhas armas prediletas.',
      'Eu tenho vários símbolos sagrados comigo, e invoco qualquer divindade que seja mais útil em um dado momento.',
      'Eu furto qualquer coisa que eu veja que possa ter algum valor.'
    ],
    ideals: [
      'Independência. Sou um espírito livre – ninguém me diz o que fazer. (Caótico)',
      'Justiça. Eu nunca roubo de pessoas que não podem perder algumas moedas. (Leal)',
      'Caridade. Eu distribuo o dinheiro que adquiro para as pessoas que realmente precisam. (Bom)',
      'Criatividade. Eu nunca faço a mesma trapaça duas vezes. (Caótico)',
      'Amizade. Bens materiais vêm e vão. Os laços de amizade duram para sempre. (Bom)',
      'Aspiração. Eu vou fazer de mim mesmo alguém importante. (Qualquer)'
    ],
    bonds: [
      'Eu extorqui a pessoa errada e devo trabalhar para que esse indivíduo nunca mais cruze meu caminho ou o das pessoas com quem me importo.',
      'Eu devo tudo ao meu mentor – uma pessoa horrível que, provavelmente, está apodrecendo na cadeia em algum lugar.',
      'Em algum lugar por aí, eu tenho um filho que não me conhece. Eu estou tornando o mundo melhor para ele.',
      'Eu vim de uma família nobre e, um dia, irei reivindicar minhas terras e título daqueles que os roubaram de mim.',
      'Uma pessoa poderosa matou alguém que eu amava. Algum dia, em breve, terei minha vingança.',
      'Eu enganei e arruinei a vida de uma pessoa que não merecia. Eu busco reparar meus erros, mas talvez nunca seja capaz de me perdoar.'
    ],
    flaws: [
      'Não consigo resistir a um rostinho bonito.',
      'Estou sempre com dívidas. Eu gasto meus lucros ilícitos com luxúrias decadentes mais rápido do que os ganho.',
      'Estou convencido que ninguém pode me enganar da forma que eu engano os outros.',
      'Eu sou ganancioso demais para o meu próprio bem. Não consigo evitar me arriscar se tiver dinheiro envolvido.',
      'Eu não resisto a enganar pessoas que são mais poderosas que eu.',
      'Eu odeio admitir isso e vou me odiar por isso, mas eu vou correr e preservar minha própria pele se as coisas engrossarem.'
    ]
  },
  {
    id: 'criminoso',
    name: 'Criminoso',
    icon: '🗡️',
    summary: 'Você é um criminoso experiente com um histórico de contravenções, mantendo contatos no submundo dos ladrões, contrabandistas e espiões.',
    skillProficiencies: ['Enganação', 'Furtividade'],
    toolProficiencies: 'Um tipo de kit de jogo, ferramentas de ladrão',
    languages: 'Nenhum adicional',
    equipment: 'Um pé de cabra, um conjunto de roupas escuras comuns com capuz e uma algibeira contendo 15 PO.',
    startingGold: 15,
    featureName: 'Contato Criminal',
    featureDesc: 'Você possui contatos de confiança que agem como seus informantes em uma rede criminosa. Você sabe como se comunicar com eles mesmo a grandes distâncias; especificamente, você conhece os mensageiros locais, mestres de caravana corruptos e marinheiros escusos que podem transmitir mensagens para você.',
    personalityTraits: [
      'Eu sempre tenho um plano para quando as coisas dão errado.',
      'Eu estou sempre calmo, não importa a situação. Eu nunca levanto minha voz ou deixo minhas emoções me controlarem.',
      'A primeira coisa que faço ao chegar a um novo local é decorar a localização de tudo que é valioso – ou onde essas coisas podem estar escondidas.',
      'Eu prefiro fazer um novo amigo a um novo inimigo.',
      'Eu sou incrivelmente lento em confiar. Aqueles que parecem os mais justos geralmente têm mais a esconder.',
      'Eu não prezo pelos riscos de uma situação. Nunca me diga as probabilidades.',
      'A melhor maneira de me fazer realizar algo é dizendo que eu não posso fazer.',
      'Eu explodo ao menor insulto.'
    ],
    ideals: [
      'Honra. Eu não roubo de outros ladrões da profissão. (Leal)',
      'Liberdade. Correntes foram feitas para serem partidas, assim como aqueles que as forjaram. (Caótico)',
      'Caridade. Eu roubo dos ricos para poder ajudar aqueles que realmente precisam. (Bom)',
      'Ganância. Eu farei qualquer coisa necessária para me tornar rico. (Mau)',
      'Povo. Eu sou leal aos meus amigos, não a qualquer ideal, e todos sabem que posso viajar até o Estige por aqueles com quem me importo. (Neutro)',
      'Redenção. Há uma centelha de bondade em todo mundo. (Bom)'
    ],
    bonds: [
      'Eu estou tentando quitar uma dívida antiga que tenho com um generoso benfeitor.',
      'Meus ganhos honestos ou desonestos são para sustentar minha família.',
      'Algo importante foi tirado de mim, e eu busco recuperá-lo.',
      'Eu me tornarei o maior ladrão que já existiu.',
      'Eu sou culpado por um terrível crime. Eu espero algum dia poder me redimir por isso.',
      'Alguém que amava morreu por causa de um erro que cometi. Isso nunca acontecerá novamente.'
    ],
    flaws: [
      'Quando vejo algo valioso, não consigo pensar em mais nada além de como roubá-lo.',
      'Quando confrontado com uma escolha entre dinheiro e meus amigos, eu bem que escolho o dinheiro.',
      'Se há um plano, eu vou esquecê-lo. Se eu não esquecê-lo, vou ignorá-lo.',
      'Eu tenho um "tique" que revela quando estou mentindo.',
      'Eu viro as costas e corro quando as coisas começam a ficar ruins.',
      'Uma pessoa inocente está na prisão por um crime que eu cometi. E eu não me importo com isso.'
    ]
  },
  {
    id: 'eremita',
    name: 'Eremita',
    icon: '🧘',
    summary: 'Você viveu em reclusão — em uma comunidade monástica ou totalmente sozinho — onde contemplou os grandes mistérios do cosmos.',
    skillProficiencies: ['Medicina', 'Religião'],
    toolProficiencies: 'Kit de herbalismo',
    languages: 'Um idioma à sua escolha',
    equipment: 'Um estojo de pergaminho cheio de notas dos seus estudos ou orações, um cobertor de inverno, um conjunto de roupas comuns, um kit de herbalismo e 5 PO.',
    startingGold: 5,
    featureName: 'Descoberta',
    featureDesc: 'A calma reclusão de seu eremitério prolongado lhe deu acesso a uma descoberta única e poderosa. A natureza exata dessa revelação depende da natureza de sua reclusão: pode ser uma grande verdade sobre o cosmos, os deuses, os poderosos seres de outros planos ou as forças da natureza.',
    personalityTraits: [
      'Eu fiquei isolado por tanto tempo que raramente falo, preferindo gestos e grunhidos ocasionais.',
      'Eu sou absurdamente sereno, mesmo em face do desespero.',
      'O líder da minha comunidade tinha algo sábio a dizer sobre tudo, e estou ansioso para compartilhar essa sabedoria.',
      'Eu sinto uma tremenda empatia por todos os que sofrem.',
      'Eu sou alheio à etiqueta e expectativas sociais.',
      'Eu relaciono tudo o que acontece comigo a um grande plano cósmico.',
      'Eu muitas vezes me perco em meus próprios pensamentos e contemplação, tornando-me alheio ao meu redor.',
      'Eu estou trabalhando em uma grande teoria filosófica e adoro compartilhar minhas ideias.'
    ],
    ideals: [
      'Bem Maior. Meus dons devem ser compartilhados com todos, não usados para meu próprio benefício. (Bom)',
      'Lógica. Emoções não devem nublar nosso senso do que é certo e verdadeiro, ou nossa habilidade de pensar logicamente. (Leal)',
      'Pensamento Livre. Questionamentos e curiosidade são os pilares do progresso. (Caótico)',
      'Poder. Isolamento e contemplação são caminhos para poderes místicos ou mágicos. (Mau)',
      'Viva e Deixe Viver. Se intrometer nos assuntos dos outros só traz problemas. (Neutro)',
      'Autoconhecimento. Se você conhece a si mesmo, não há mais nada para saber. (Qualquer)'
    ],
    bonds: [
      'Nada é mais importante do que os outros membros do meu eremitério, ordem ou associação.',
      'Eu entrei em reclusão para me esconder daqueles que ainda devem estar me caçando. Algum dia terei que confrontá-los.',
      'Eu ainda busco o esclarecimento que perseguia em minha reclusão, e ele ainda me ilude.',
      'Eu entrei em reclusão porque eu amava alguém que eu não podia ter.',
      'Se minha descoberta vier à tona, ela poderá trazer destruição ao mundo.',
      'Meu isolamento me deu grande discernimento sobre um grande mal que apenas eu posso destruir.'
    ],
    flaws: [
      'Agora que voltei ao mundo, eu desfruto de seus prazeres um pouco demais.',
      'Eu escondo pensamentos sombrios e sanguinários que meu isolamento e meditação não conseguiram apagar.',
      'Eu sou dogmático em meus pensamentos e filosofia.',
      'Eu deixo minha necessidade de vencer discussões ofuscar amizades e harmonia.',
      'Eu arrisco muito para descobrir um pouco de conhecimento perdido.',
      'Eu gosto de guardar segredos e não os compartilho com ninguém.'
    ]
  },
  {
    id: 'forasteiro',
    name: 'Forasteiro',
    icon: '🌲',
    summary: 'Você cresceu nas terras selvagens, longe da civilização e dos confortos da cidade, conhecendo a sobrevivência nos ermos como ninguém.',
    skillProficiencies: ['Atletismo', 'Sobrevivência'],
    toolProficiencies: 'Um tipo de instrumento musical',
    languages: 'Um idioma à sua escolha',
    equipment: 'Um bordão, uma armadilha de caça, um fetiche de um animal que você matou, um conjunto de roupas de viajante e uma algibeira contendo 10 PO.',
    startingGold: 10,
    featureName: 'Andarilho',
    featureDesc: 'Você tem uma memória excelente para mapas e geografia, e pode sempre recordar o layout geral de terrenos, assentamentos e outras características ao seu redor. Além disso, você pode encontrar comida e água fresca para si mesmo e até outras cinco pessoas a cada dia, desde que a terra ofereça bagas, caça pequena, água e similares.',
    personalityTraits: [
      'Eu sou guiado por uma vontade de viajar que me levou para longe de casa.',
      'Eu cuido dos meus amigos como se eles fossem uma ninhada de filhotes recém-nascidos.',
      'Certa vez corri quarenta quilômetros sem parar para avisar meu clã da aproximação de uma horda orc. Eu faria de novo se fosse necessário.',
      'Eu tenho uma lição para cada situação, tirada da observação da natureza.',
      'Eu não vejo lugar para o povo rico e educado. Dinheiro e modos não vão salvá-lo de um urso-coruja faminto.',
      'Eu estou sempre pegando coisas, distraidamente brincando com elas e, às vezes, quebrando-as acidentalmente.',
      'Eu me sinto muito mais confortável entre animais do que entre pessoas.',
      'Eu fui, de fato, criado por lobos.'
    ],
    ideals: [
      'Mudança. A vida é como as estações, em constante mudança, e nós devemos mudar com ela. (Caótico)',
      'Bem Maior. É responsabilidade de cada pessoa trazer a maior felicidade para toda a tribo. (Bom)',
      'Honra. Se eu me desonrar, eu desonro todo o meu clã. (Leal)',
      'Força. Os mais fortes devem governar. (Mau)',
      'Natureza. O mundo natural é mais importante que todas as construções da civilização. (Neutro)',
      'Glória. Eu devo ganhar glória em batalha, para mim e para o meu clã. (Qualquer)'
    ],
    bonds: [
      'Minha família, clã ou tribo é a coisa mais importante na minha vida, mesmo quando estão longe.',
      'Uma agressão à natureza intocada do meu lar é uma agressão a mim.',
      'Eu trarei uma fúria terrível sobre os malfeitores que destruíram minha terra natal.',
      'Eu sou o último da minha tribo e cabe a mim garantir que seus nomes entrem para as lendas.',
      'Eu sofro de visões horríveis de um desastre iminente e farei qualquer coisa para impedi-lo.',
      'É meu dever prover filhos para sustentar minha tribo.'
    ],
    flaws: [
      'Eu sou apaixonado demais por cerveja, vinho e outras bebidas inebriantes.',
      'Não há espaço para cautela em uma vida vivida ao máximo.',
      'Eu lembro de cada insulto que já recebi e nutro um ressentimento silencioso contra qualquer um que já tenha me ofendido.',
      'Eu demoro a confiar em membros de outras raças, tribos ou sociedades.',
      'A violência é minha resposta para quase todos os desafios.',
      'Não espere que eu salve aqueles que não conseguem se salvar. É a maneira da natureza que os fortes prosperem e os fracos pereçam.'
    ]
  },
  {
    id: 'heroi_popular',
    name: 'Herói Popular',
    icon: '🌾',
    summary: 'Você veio de uma camada humilde da sociedade, mas ergueu-se para defender o povo comum contra tiranos ou monstros, tornando-se uma lenda local.',
    skillProficiencies: ['Adestrar Animais', 'Sobrevivência'],
    toolProficiencies: 'Um tipo de ferramenta de artesão, veículos (terrestres)',
    languages: 'Nenhum adicional',
    equipment: 'Um conjunto de ferramentas de artesão (à sua escolha), uma pá, um pote de ferro, um conjunto de roupas comuns e uma algibeira contendo 10 PO.',
    startingGold: 10,
    featureName: 'Hospitalidade Rústica',
    featureDesc: 'Já que você veio das fileiras do povo comum, você se mistura a eles com facilidade. Você pode encontrar um lugar para se esconder, descansar ou se recuperar entre outras pessoas comuns, a menos que tenha se mostrado um perigo para elas. Elas o esconderão da lei ou de qualquer um que esteja procurando por você, embora não arrisquem suas vidas por você.',
    personalityTraits: [
      'Eu julgo as pessoas por suas ações, não por suas palavras.',
      'Se alguém está em apuros, eu estou sempre pronto para prestar ajuda.',
      'Quando eu fixo minha mente em algo, eu sigo esse caminho, não importa o que fique no meu caminho.',
      'Eu tenho um forte senso de justiça e sempre tento encontrar a solução mais equilibrada para as discussões.',
      'Eu sou confiante em minhas próprias habilidades e faço o que posso para instilar confiança nos outros.',
      'Pensar é para os outros. Eu prefiro a ação.',
      'Eu uso palavras grandes na tentativa de parecer mais inteligente.',
      'Eu me entedio facilmente. Quando vou seguir com meu destino?'
    ],
    ideals: [
      'Respeito. As pessoas merecem ser tratadas com dignidade e respeito. (Bom)',
      'Justiça. Ninguém deve receber tratamento preferencial perante a lei, e ninguém está acima da lei. (Leal)',
      'Liberdade. Tiranos não devem ter permissão para oprimir o povo. (Caótico)',
      'Força. Se eu ficar forte, eu posso pegar o que eu quiser – o que eu mereço. (Mau)',
      'Sinceridade. Não há nada de bom em fingir ser algo que não sou. (Neutro)',
      'Destino. Nada e ninguém pode me afastar do meu chamado superior. (Qualquer)'
    ],
    bonds: [
      'Eu tenho uma família, mas não faço ideia de onde eles estão. Um dia, espero vê-los novamente.',
      'Eu trabalhei a terra, eu amo a terra, e eu vou proteger a terra.',
      'Um nobre orgulhoso certa vez me deu uma surra terrível, e eu vou me vingar de qualquer valentão que encontrar.',
      'Minhas ferramentas são símbolos de minha vida passada, e eu as carrego para nunca esquecer minhas raízes.',
      'Eu protejo aqueles que não podem se proteger.',
      'Eu gostaria que meu amor de infância tivesse vindo comigo para perseguir meu destino.'
    ],
    flaws: [
      'O tirano que governa minha terra não vai parar por nada até me ver morto.',
      'Estou convencido da importância do meu destino e cego para minhas falhas e o risco de fracasso.',
      'As pessoas que me conheceram quando eu era jovem conhecem meu vergonhoso segredo, então eu nunca posso voltar para casa.',
      'Eu tenho uma fraqueza pelos vícios da cidade, especialmente a bebida forte.',
      'Secretamente, eu acredito que as coisas estariam melhores se eu fosse um tirano governando a terra.',
      'Eu tenho dificuldade em confiar em meus aliados.'
    ]
  },
  {
    id: 'marinheiro',
    name: 'Marinheiro',
    icon: '⚓',
    summary: 'Você navegou em uma embarcação marítima por anos, enfrentando tempestades ferozes, monstros das profundezas e piratas.',
    skillProficiencies: ['Atletismo', 'Percepção'],
    toolProficiencies: 'Ferramentas de navegador, veículos (aquáticos)',
    languages: 'Nenhum adicional',
    equipment: 'Uma malagueta (clava), 15 metros de corda de seda, um amuleto da sorte como um pé de coelho ou uma pequena pedra com um furo no centro, um conjunto de roupas comuns e uma algibeira contendo 10 PO.',
    startingGold: 10,
    featureName: 'Passagem de Navio',
    featureDesc: 'Quando você precisar, você pode conseguir passagem de graça em um navio para você e seus companheiros de aventura. Você pode viajar no navio em que você mesmo serviu, ou em outro navio com o qual você tenha boas relações. Em troca, espera-se que você e seus companheiros ajudem a tripulação durante a viagem.',
    personalityTraits: [
      'Meus amigos sabem que podem contar comigo, não importa o quê.',
      'Eu trabalho duro para que possa me divertir muito quando o trabalho estiver feito.',
      'Eu gosto de navegar para novos portos e fazer novos amigos acompanhado de uma jarra de cerveja.',
      'Eu estico a verdade para o bem de uma boa história.',
      'Para mim, uma briga de taverna é uma ótima maneira de conhecer uma nova cidade.',
      'Eu nunca deixo passar uma aposta amigável.',
      'Minha linguagem é tão suja quanto o covil de um otyugh.',
      'Eu gosto de um trabalho bem feito, especialmente se eu puder convencer outra pessoa a fazê-lo.'
    ],
    ideals: [
      'Respeito. A coisa que mantém um navio unido é o respeito mútuo entre capitão e tripulação. (Bom)',
      'Justiça. Todos nós fazemos o trabalho, então todos compartilhamos a recompensa. (Leal)',
      'Liberdade. O mar é liberdade – a liberdade de ir a qualquer lugar e fazer qualquer coisa. (Caótico)',
      'Domínio. Eu sou um predador, e os outros navios no mar são minhas presas. (Mau)',
      'Povo. Eu sou comprometido com minha tripulação, não com um ideal. (Neutro)',
      'Aspiração. Algum dia eu serei dono do meu próprio navio e traçarei meu próprio destino. (Qualquer)'
    ],
    bonds: [
      'Eu sou leal ao meu capitão primeiro, tudo o mais vem em segundo.',
      'O navio é o mais importante – tripulantes e capitães vêm e vão.',
      'Eu sempre me lembrarei do meu primeiro navio.',
      'Em uma cidade portuária, eu tenho um amante cujos olhos quase me roubaram do mar.',
      'Eu fui enganado na divisão da minha parte do saque e quero o que me é devido.',
      'Piratas impiedosos mataram meu capitão e companheiros de tripulação, saquearam nosso navio e me deixaram para morrer. A vingança será minha.'
    ],
    flaws: [
      'Eu sigo ordens, mesmo que eu ache que estão erradas.',
      'Eu direi qualquer coisa para evitar ter que trabalhar mais.',
      'Certa vez alguém questionou minha coragem, eu nunca recuo, não importa o quão perigosa seja a situação.',
      'Quando começo a beber, é muito difícil para mim parar.',
      'Eu não consigo resistir a embolsar moedas soltas e outras bugigangas que encontro.',
      'Meu orgulho provavelmente levará à minha destruição.'
    ]
  },
  {
    id: 'morador_rua',
    name: 'Morador de Rua',
    icon: '🐀',
    summary: 'Você cresceu nas ruas, órfão e pobre, aprendendo a sobreviver nos becos escuros das grandes cidades através de astúcia e velocidade.',
    skillProficiencies: ['Furtividade', 'Prestidigitação'],
    toolProficiencies: 'Kit de disfarce, ferramentas de ladrão',
    languages: 'Nenhum adicional',
    equipment: 'Uma faca pequena, um mapa da cidade em que você cresceu, um rato de estimação, um pequeno objeto para lembrar dos seus pais, um conjunto de roupas comuns e uma algibeira contendo 10 PO.',
    startingGold: 10,
    featureName: 'Segredos da Cidade',
    featureDesc: 'Você conhece os padrões secretos e o fluxo das cidades e pode encontrar passagens através da expansão urbana que os outros deixariam passar. Quando você não está em combate, você (e os companheiros que você guia) pode viajar entre quaisquer dois locais na cidade duas vezes mais rápido do que sua velocidade normalmente permitiria.',
    personalityTraits: [
      'Eu escondo pedaços de comida e bugigangas em meus bolsos.',
      'Eu faço um monte de perguntas.',
      'Eu gosto de me espremer em pequenos espaços onde ninguém possa me alcançar.',
      'Eu durmo com minhas costas para um muro ou árvore, com tudo o que possuo abraçado em um pacote entre meus braços.',
      'Eu como feito um porco e tenho maus modos.',
      'Eu acho que qualquer um que seja gentil comigo está escondendo intenções malignas.',
      'Eu não gosto de tomar banho.',
      'Eu digo na cara o que outros apenas insinuam ou escondem.'
    ],
    ideals: [
      'Respeito. Todas as pessoas, ricas ou pobres, merecem respeito. (Bom)',
      'Comunidade. Nós temos que tomar conta uns dos outros, porque ninguém mais o fará. (Leal)',
      'Mudança. Os baixos se erguerão e os altos e poderosos cairão. A mudança é a natureza das coisas. (Caótico)',
      'Retribuição. Os ricos precisam que lhes mostrem como a vida e a morte são nas sarjetas. (Mau)',
      'Povo. Eu ajudo as pessoas que me ajudam – é isso que nos mantém vivos. (Neutro)',
      'Aspiração. Eu vou provar que sou digno de uma vida melhor. (Qualquer)'
    ],
    bonds: [
      'Minha cidade ou vila é meu lar, e eu lutarei para defendê-la.',
      'Eu patroci-no um orfanato para que outros não passem pelo que fui forçado a passar.',
      'Eu devo minha sobrevivência a outro morador de rua que me ensinou a viver nos becos.',
      'Eu tenho uma dívida que nunca poderei pagar com a pessoa que teve pena de mim.',
      'Eu escapei da minha vida de pobreza roubando uma pessoa importante, e sou procurado por isso.',
      'Ninguém deveria ter que suportar as dificuldades pelas quais passei.'
    ],
    flaws: [
      'Se eu estiver em desvantagem numérica, vou correr para salvar minha pele.',
      'Ouro parece ser muito dinheiro para mim, e eu farei quase qualquer coisa por mais dele.',
      'Eu nunca vou confiar plenamente em ninguém além de mim mesmo.',
      'Eu prefiro matar alguém enquanto dorme do que em uma luta justa.',
      'Não é roubo se eu preciso mais do que a outra pessoa.',
      'As pessoas que não conseguem se virar sozinhas têm o que merecem.'
    ]
  },
  {
    id: 'nobre',
    name: 'Nobre',
    icon: '👑',
    summary: 'Você entende de riqueza, poder e privilégio. Você carrega um título de nobreza e sua família exerce influência política e social significativa.',
    skillProficiencies: ['História', 'Persuasão'],
    toolProficiencies: 'Um tipo de kit de jogo',
    languages: 'Um idioma à sua escolha',
    equipment: 'Um conjunto de trajes finos, um anel de sinete, um pergaminho de linhagem e uma algibeira contendo 25 PO.',
    startingGold: 25,
    featureName: 'Posição de Privilégio',
    featureDesc: 'Graças ao seu nascimento nobre, as pessoas estão inclinadas a pensar o melhor de você. Você é bem-vindo na alta sociedade, e as pessoas assumem que você tem o direito de estar onde quer que esteja. O povo comum faz todos os esforços para acomodá-lo e evitar seu desprazer, e outras pessoas de berço nobre o tratam como um membro da mesma esfera social. Você pode conseguir uma audiência com um nobre local se precisar.',
    personalityTraits: [
      'Minha bajulação eloquente faz com que qualquer pessoa com quem eu converse se sinta a pessoa mais maravilhosa e importante do mundo.',
      'O povo comum me ama por minha bondade e generosidade.',
      'Ninguém pode duvidar, olhando para o meu porte real, que estou acima da plebe.',
      'Eu tenho grande cuidado de sempre estar no meu melhor e seguir as últimas modas.',
      'Eu não gosto de sujar minhas mãos, e não vou ser pego em acomodações inadequadas.',
      'Apesar do meu nascimento nobre, eu não me coloco acima das outras pessoas. Todos temos o mesmo sangue.',
      'Meu favor, uma vez perdido, é perdido para sempre.',
      'Se você me ferir, eu irei esmagá-lo, arruinar seu nome e salgar seus campos.'
    ],
    ideals: [
      'Respeito. O respeito a mim é devido por causa da minha posição, mas todas as pessoas, independentemente da posição, merecem ser tratadas com dignidade. (Bom)',
      'Responsabilidade. É o meu dever respeitar a autoridade daqueles acima de mim, assim como aqueles abaixo de mim devem me respeitar. (Leal)',
      'Independência. Devo provar que posso lidar com as coisas sem o mimo da minha família. (Caótico)',
      'Poder. Se eu puder alcançar mais poder, ninguém vai me dizer o que fazer. (Mau)',
      'Família. O sangue corre mais grosso que a água. (Qualquer)',
      'Obrigação Nobre. É o meu dever proteger e cuidar das pessoas abaixo de mim. (Bom)'
    ],
    bonds: [
      'Eu vou encarar qualquer desafio para ganhar a aprovação da minha família.',
      'A aliança da minha casa com outra família nobre deve ser mantida a todo custo.',
      'Nada é mais importante do que os outros membros da minha família.',
      'Eu sou apaixonado pela herdeira de uma família que a minha família despreza.',
      'Minha lealdade ao meu soberano é inabalável.',
      'O povo comum deve me ver como um herói do povo.'
    ],
    flaws: [
      'Eu secretamente acredito que todos estão abaixo de mim.',
      'Eu escondo um segredo verdadeiramente escandaloso que poderia arruinar minha família para sempre.',
      'Eu muitas vezes ouço insultos e ameaças veladas em cada palavra dirigida a mim, e me irrito rapidamente.',
      'Eu tenho um desejo insaciável por prazeres carnais.',
      'De fato, o mundo gira ao meu redor.',
      'Por minhas palavras e ações, muitas vezes trago vergonha para minha família.'
    ]
  },
  {
    id: 'sabio',
    name: 'Sábio',
    icon: '📜',
    summary: 'Você passou anos aprendendo sobre o conhecimento do multiverso, devorando manuscritos, estudando pergaminhos e ouvindo grandes especialistas.',
    skillProficiencies: ['Arcanismo', 'História'],
    toolProficiencies: 'Nenhuma',
    languages: 'Dois idiomas à sua escolha',
    equipment: 'Um vidro de tinta escura, uma pena, uma faca pequena, uma carta de um falecido colega perguntando algo que você ainda não foi capaz de responder, um conjunto de roupas comuns e uma algibeira contendo 10 PO.',
    startingGold: 10,
    featureName: 'Pesquisador',
    featureDesc: 'Quando você tentar aprender ou recordar um fragmento de conhecimento, se você não souber a informação, você frequentemente sabe onde e de quem pode obtê-la. Geralmente, essa informação vem de uma biblioteca, scriptorium, universidade ou de um sábio ou outra pessoa ou criatura instruída.',
    personalityTraits: [
      'Eu uso palavras polissilábicas que transmitem a impressão de grande erudição.',
      'Eu já li todos os livros das maiores bibliotecas do mundo – ou gosto de me gabar que li.',
      'Eu estou acostumado a ajudar os outros que não são tão inteligentes quanto eu, e pacientemente explico tudo várias e várias vezes.',
      'Não há nada que eu goste mais do que um bom mistério.',
      'Eu voluntariamente ouço todos os lados de uma discussão antes de fazer meu próprio julgamento.',
      'Eu... falo... lentamente... ao... conversar... com... idiotas... que... quase... todo... mundo... é... comparado... a... mim.',
      'Eu fico horrivelmente, terrivelmente embaraçado em situações sociais.',
      'Estou convencido de que as pessoas estão sempre tentando roubar meus segredos.'
    ],
    ideals: [
      'Conhecimento. O caminho para o poder e o autoaperfeiçoamento é através do conhecimento. (Neutro)',
      'Beleza. O que é belo nos aponta para além de si mesmo em direção ao que é verdadeiro. (Bom)',
      'Lógica. Emoções não devem nublar nosso pensamento lógico. (Leal)',
      'Sem Limites. Nada deve impedir a possibilidade infinita inerente a toda existência. (Caótico)',
      'Poder. O conhecimento é o caminho para o poder e a dominação. (Mau)',
      'Autoaperfeiçoamento. O objetivo de uma vida de estudos é a melhoria de si mesmo. (Qualquer)'
    ],
    bonds: [
      'É meu dever proteger meus alunos.',
      'Eu tenho um texto ancestral que guarda terríveis segredos que não podem cair em mãos erradas.',
      'Eu trabalho para preservar uma biblioteca, universidade, scriptorium ou monastério.',
      'O trabalho da minha vida é uma série de tomos relacionados a um campo de conhecimento específico.',
      'Eu venho procurando a minha vida inteira pela resposta de certa questão.',
      'Eu vendi minha alma por conhecimento. Espero realizar grandes feitos para ganhá-la de volta.'
    ],
    flaws: [
      'Eu me distraio facilmente com a promessa de informação.',
      'A maioria das pessoas grita e corre quando vê um demônio. Eu paro e tomo notas sobre sua anatomia.',
      'Desvendar um mistério ancestral vale o preço de uma civilização.',
      'Eu ignoro soluções óbvias em favor de outras complicadas.',
      'Eu falo sem realmente pensar através de minhas palavras, invariavelmente insultando os outros.',
      'Eu não consigo guardar um segredo para salvar minha vida, ou a de qualquer outra pessoa.'
    ]
  },
  {
    id: 'soldado',
    name: 'Soldado',
    icon: '⚔️',
    summary: 'A guerra esteve na sua vida desde que você se recorda. Você estudou o uso das armas e armaduras e sobreviveu ao sangue dos campos de batalha.',
    skillProficiencies: ['Atletismo', 'Intimidação'],
    toolProficiencies: 'Um tipo de kit de jogo, veículos (terrestres)',
    languages: 'Nenhum adicional',
    equipment: 'Uma insígnia de patente, um fetiche obtido de um inimigo caído (uma adaga, lâmina partida ou tira de estandarte), um conjunto de dados de osso ou baralho, um conjunto de roupas comuns e uma algibeira contendo 10 PO.',
    startingGold: 10,
    featureName: 'Patente Militar',
    featureDesc: 'Você possui uma patente militar da sua carreira como soldado. Soldados leais à sua antiga organização militar ainda reconhecem sua autoridade e influência, e se prestam a você se forem de uma patente mais baixa. Você pode invocar sua patente para exercer influência sobre outros soldados e requisitar equipamentos simples ou cavalos para uso temporário, além de ter acesso a acampamentos militares aliados e fortalezas.',
    personalityTraits: [
      'Eu sou sempre polido e respeitoso.',
      'Eu sou assombrado pelas memórias da guerra. Não consigo tirar as imagens da violência da minha mente.',
      'Eu perdi muitos amigos, e sou muito lento para fazer novos.',
      'Eu sou cheio de histórias inspiradoras e cautelosas da minha experiência militar relevantes para quase todas as situações de combate.',
      'Eu posso encarar um cão infernal sem vacilar.',
      'Eu gosto de ser forte e gosto de quebrar coisas.',
      'Eu tenho um senso de humor grosseiro.',
      'Eu enfrento os problemas de frente. Uma solução simples e direta é o melhor caminho para o sucesso.'
    ],
    ideals: [
      'Bem Maior. Nosso destino é dar nossas vidas em defesa dos outros. (Bom)',
      'Responsabilidade. Eu faço o que devo e obedeço a autoridade justa. (Leal)',
      'Independência. Quando as pessoas seguem ordens cegamente, elas abraçam um tipo de tirania. (Caótico)',
      'Força. A vida é como a guerra, o mais forte vence. (Mau)',
      'Viva e Deixe Viver. Ideais não valem a pena matar ou ir à guerra por eles. (Neutro)',
      'Nação. Minha cidade, nação ou povo são tudo o que importa. (Qualquer)'
    ],
    bonds: [
      'Eu ainda daria a minha vida pelas pessoas com quem servi.',
      'Alguém salvou minha vida no campo de batalha. Até hoje, eu nunca deixarei um amigo para trás.',
      'Minha honra é minha vida.',
      'Eu nunca esquecerei a derrota esmagadora que minha companhia sofreu ou os inimigos que a causaram.',
      'Aqueles que lutam ao meu lado são aqueles por quem vale a pena morrer.',
      'Eu luto por aqueles que não podem lutar por si mesmos.'
    ],
    flaws: [
      'O inimigo monstruoso que enfrentamos em batalha ainda me deixa tremendo de medo.',
      'Eu tenho pouco respeito por qualquer um que não seja um guerreiro comprovado.',
      'Eu cometi um erro terrível em batalha que custou muitas vidas – e eu faria qualquer coisa para manter esse erro em segredo.',
      'Meu ódio por meus inimigos é cego e irracional.',
      'Eu obedeço a lei, mesmo se a lei trouxer miséria.',
      'Eu prefiro comer minha armadura a admitir que estou errado.'
    ]
  }
];

(function normalizeBackgroundsData() {
  const skillKeyMap = {
    'atletismo': 'atletismo',
    'acrobacia': 'acrobacia',
    'furtividade': 'furtividade',
    'prestidigitacao': 'prestidigitacao',
    'arcanismo': 'arcanismo',
    'historia': 'historia',
    'investigacao': 'investigacao',
    'natureza': 'natureza',
    'religiao': 'religiao',
    'adestrar animais': 'adestramento',
    'adestramento': 'adestramento',
    'intuicao': 'intuicao',
    'medicina': 'medicina',
    'percepcao': 'percepcao',
    'sobrevivencia': 'sobrevivencia',
    'atuacao': 'atuacao',
    'enganacao': 'enganacao',
    'intimidacao': 'intimidacao',
    'persuasao': 'persuasao'
  };
  BACKGROUNDS_DATA.forEach(bg => {
    bg.skillLabels = Array.isArray(bg.skillProficiencies) ? [...bg.skillProficiencies] : [];
    bg.skills = bg.skillLabels.map(lbl => {
      const norm = String(lbl).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
      return skillKeyMap[norm] || norm;
    });
  });
})();

if (typeof window !== 'undefined') {
  window.BACKGROUNDS_DATA = BACKGROUNDS_DATA;
}
if (typeof global !== 'undefined') {
  global.BACKGROUNDS_DATA = BACKGROUNDS_DATA;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { BACKGROUNDS_DATA };
}
