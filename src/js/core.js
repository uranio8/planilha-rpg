// Fallback seguro para efeitos sonoros caso AudioEngine não esteja presente
if (typeof playFX === 'undefined') {
  var playFX = function(type) {};
}

// src_js_core.js - State, Constants, Storage and Core Utilities

const CONDITIONS_LIST = [
  { id: 'envenenado', name: '🤢 Envenenado', desc: 'Desvantagem em ataques e testes de atributo.' },
  { id: 'cego', name: '👁️ Cego', desc: 'Falha automática em testes visuais. Ataques contra têm vantagem.' },
  { id: 'caido', name: '🛡️ Caído', desc: 'Ataques corpo a corpo a 1,5m contra têm vantagem; gasta metade do deslocamento para levantar.' },
  { id: 'paralisado', name: '⚡ Paralisado', desc: 'Incapacitado. Ataques a 1,5m são críticos automáticos.' },
  { id: 'atordoado', name: '💫 Atordoado', desc: 'Incapacitado, não pode se mover e fala vacilante.' },
  { id: 'agarrado', name: '🕸️ Agarrado', desc: 'Deslocamento reduzido a 0.' },
  { id: 'invisivel', name: '👻 Invisível', desc: 'Impossível de ser visto sem magia. Vantagem em ataques.' },
  { id: 'assustado', name: '😱 Aterrorizado', desc: 'Desvantagem em testes e ataques enquanto a fonte do medo estiver visível.' },
  { id: 'enfeiticado', name: '💖 Enfeitiçado', desc: 'Não pode atacar o conjurador; o conjurador tem vantagem em testes sociais.' },
  { id: 'incapacitado', name: '😵 Incapacitado', desc: 'Não pode realizar ações nem reações.' },
  { id: 'inconsciente', name: '💤 Inconsciente', desc: 'Incapacitado, larga itens, cai prostrado. Ataques a 1,5m são críticos.' },
  { id: 'petrificado', name: '🗿 Petrificado', desc: 'Transformado em pedra sólida. Resistência a todo dano.' },
  { id: 'concentracao', name: '🧠 Concentração', desc: 'Mantendo magia ativa. Deve fazer teste de CON ao levar dano.' },
  { id: 'sangrando', name: '🩸 Sangrando', desc: 'Menos de 50% dos PVs máximos ou sofrendo sangramento contínuo.' }
];

const PUZZLES = [
  // --- CLÁSSICOS & MASMORRAS ---
  { q: "Tenho cidades, mas não casas. Tenho montanhas, mas não árvores. Tenho água, mas não peixes. O que sou eu?", a: "Um mapa." },
  { q: "Quanto mais você tira de mim, maior eu fico. O que sou eu?", a: "Um buraco." },
  { q: "Falo sem boca e ouço sem ouvidos. Não tenho corpo, mas ganho vida com o vento. O que sou eu?", a: "O eco." },
  { q: "Se você me tem, quer me compartilhar. Se me compartilha, não me tem mais. O que sou eu?", a: "Um segredo." },
  { q: "Sou leve como uma pluma, mas nem o guerreiro mais forte consegue me segurar por mais de cinco minutos. O que sou?", a: "A respiração / O fôlego." },
  { q: "Ando de quatro patas pela manhã, duas patas à tarde e três patas à noite. O que sou?", a: "O ser humano (infância engatinhando, idade adulta e velhice com bengala)." },
  { q: "O que pertence a você, mas os outros usam muito mais do que você?", a: "O seu nome." },
  { q: "Tenho chaves mas não abro portas. Tenho espaço mas não quartos. Você pode entrar, mas não pode sair. O que sou?", a: "Um teclado." },

  // --- ELEMENTOS DA NATUREZA & CLIMA ---
  { q: "Alimento-me de tudo e cresço sem parar, mas dê-me uma gota d'água e eu irei expirar. O que sou?", a: "O fogo." },
  { q: "Não tenho asas mas posso voar; não tenho olhos mas posso chorar; onde piso a escuridão se faz. O que sou?", a: "Uma nuvem de tempestade." },
  { q: "Sempre corro, mas nunca ando. Tenho leito, mas nunca durmo. Tenho boca, mas nunca falo. O que sou?", a: "Um rio." },
  { q: "Sem voz eu grito, sem asas eu voo, sem dentes eu mordo, sem boca eu sussurro. O que sou?", a: "O vento." },
  { q: "Nasço branca na montanha fria, danço no ar e me desfaço com a luz do dia. O que sou?", a: "A neve." },
  { q: "Venho do céu em flechas brilhantes, faço o céu rugir como um gigante e quebro carvalhos em um instante. O que sou?", a: "O raio / relâmpago." },
  { q: "Caminho pelo deserto em ondas douradas, posso engolir cidades e mudar com o sopro das fadas. O que sou?", a: "A areia (as dunas)." },
  { q: "Sou duro como ferro no inverno, mas quando o calor chega, torno-me lágrimas líquidas. O que sou?", a: "O gelo." },
  { q: "Trago sete cores em arco no céu após a tormenta, mas ninguém jamais consegue tocar em minhas pontas. O que sou?", a: "O arco-íris." },
  { q: "Nasço da terra líquida e fervente, cuspo cinzas e fogo para aterrorizar toda gente. O que sou?", a: "Um vulcão." },
  { q: "Pela manhã cubro a relva com pérolas brilhantes que nenhum joalheiro consegue guardar. O que sou?", a: "O orvalho." },
  { q: "Puxo os mares sem cordas, mudo de rosto a cada semana e ilumino os ladrões na noite escura. O que sou?", a: "A lua." },
  { q: "Queimo sem lenha, fico no centro do mundo de dia e me escondo nas sombras à noite. O que sou?", a: "O sol." },
  { q: "Somos milhares à noite mas desaparecemos com o sol, guiamos marinheiros sem nunca nos movermos do lugar. O que somos?", a: "As estrelas." },

  // --- OBJETOS MÁGICOS, ITENS & ARTEFATOS ---
  { q: "Olho para você e você olha para mim. Se você sorri, eu sorrio, mas se você falar, nada direi. O que sou?", a: "Um espelho." },
  { q: "Sou jovem e alta no início da noite, mas no final da vigília fico velha e pequena, chorando cera até morrer. O que sou?", a: "Uma vela." },
  { q: "Tenho dentes afiados, mas não consigo morder. Minha função é ordenar o que está desgrenhado. O que sou?", a: "Um pente." },
  { q: "Tenho gargalo mas não tenho cabeça, guardo venenos, elixires e águas mágicas. O que sou?", a: "Um frasco / Uma poção." },
  { q: "Guardo mil histórias e feitiços sem nunca falar uma palavra em voz alta. Minhas folhas não dão frutos nem sombra. O que sou?", a: "Um livro / Grimório." },
  { q: "Sou feito de metal e madeira, tenho cordas mas não toco música. Se me esticar, cuspo a morte à distância. O que sou?", a: "Um arco de guerra." },
  { q: "Tenho dois gumes mas nenhuma boca. Quanto mais afiado fico, mais sangue posso provar. O que sou?", a: "Uma espada." },
  { q: "Recebo golpes sem reclamar, protejo o peito do bravo cavaleiro e ostento o brasão do reino. O que sou?", a: "Um escudo." },
  { q: "Fico no alto da torre, tenho língua de bronze e quando falo toda a vila ouve o chamado. O que sou?", a: "Um sino." },
  { q: "Meus grãos caem sem parar em um túnel de vidro. Não posso ser acelerada nem parada. O que sou?", a: "Uma ampulheta." },
  { q: "Sou pequeno e feito de ouro ou ferro, giro em segredos para abrir tesouros trancados. O que sou?", a: "Uma chave." },
  { q: "Quem me faz não me quer; quem me compra não me usa; quem me usa não sabe que está usando. O que sou?", a: "Um caixão." },
  { q: "Tenho copa mas não tenho raízes; abrigo viajantes da chuva mas fecho minhas asas quando o sol brilha. O que sou?", a: "Um guarda-chuva / Sombrinha." },
  { q: "Voo sem asas, pico sem bico e sangro sem ter sangue. Se acertar o alvo, faço a presa tombar. O que sou?", a: "Uma flecha." },
  { q: "Entro na água e não me molho, atravesso o vidro sem quebrá-lo. O que sou?", a: "A luz / O raio de sol." },
  { q: "Fui ave um dia nas alturas, hoje mergulho na tinta escura para assinar a paz ou decretar a guerra. O que sou?", a: "A pena de escrever." },
  { q: "Tenho coroa mas não sou rei, tenho escamas mas não sou peixe, sou ouro por fora e doce por dentro. O que sou?", a: "Um abacaxi." },
  { q: "Brilho no bolso dos nobres e nos baús dos dragões, compro reinos e traições, mas não posso comprar o tempo. O que sou?", a: "Uma moeda de ouro." },

  // --- ARQUITETURA DE MASMORRA, ARMADILHAS & PORTAS ---
  { q: "Subo e desço sem nunca sair do lugar; levo você ao topo da torre ou às profundezas da masmorra. O que sou?", a: "Uma escadaria." },
  { q: "Uno duas margens sobre o abismo mortal. Se eu cair, ninguém passa; se eu ficar em pé, todos pisam em mim. O que sou?", a: "Uma ponte." },
  { q: "Fico em pé na parede escura, não tenho olhos mas posso ser aberta com a palavra certa. O que sou?", a: "Uma porta secreta." },
  { q: "Feito de fios de prata invisíveis no escuro, guardo o covil da criatura de oito patas e prendo os desavisados. O que sou?", a: "Uma teia de aranha." },
  { q: "Estou sempre atrás de você na luz, fujo de você no escuro e imito cada passo seu sem fazer barulho. O que sou?", a: "A sua sombra." },
  { q: "Bata em mim e eu fico mais forte; esfrie-me na água e eu fico mais dura; queime-me no fogo e eu tomo forma. O que sou?", a: "Uma lâmina na forja / O aço." },
  { q: "Fico no chão de pedra escondida sob uma laje falsa. Se você pisar em mim, dardos voam da parede. O que sou?", a: "Uma placa de pressão / Gatilho de armadilha." },
  { q: "Tenho fechadura mas não tenho porta; guardo o ouro dos piratas e os ossos dos avarentos. O que sou?", a: "Um baú de tesouro." },
  { q: "Sou uma rocha esculpida com asas de morcego e garras afiadas. De dia vigio a catedral como pedra, de noite ganho vida. O que sou?", a: "Uma gárgula." },

  // --- FILOSOFIA, CONCEITOS & O TEMPO ---
  { q: "Devoro tudo neste mundo: pássaros, feras, árvores e flores; mastigo o ferro e mordo o aço; reduzo montanhas a poeira e reis a cinzas. O que sou?", a: "O tempo." },
  { q: "Estou sempre à sua frente, mas você nunca consegue me alcançar hoje. O que sou?", a: "O futuro / O amanhã." },
  { q: "Você me quebra assim que pronuncia meu nome. O que sou eu?", a: "O silêncio." },
  { q: "Sou doce quando bem contada, amarga quando descoberta e perigosa quando acreditada. O que sou?", a: "Uma mentira." },
  { q: "Posso ser dada com palavras, mas se for quebrada, a honra é perdida para sempre. O que sou?", a: "Uma promessa." },
  { q: "Vivo apenas na sua mente enquanto você dorme; posso torná-lo um rei vitorioso ou fazê-lo fugir apavorado. O que sou?", a: "Um sonho / Um pesadelo." },
  { q: "Quanto mais você aprende sobre mim, mais percebe que sabe pouco. Guio magos e filósofos pela vida toda. O que sou?", a: "A sabedoria / O conhecimento." },
  { q: "Não peso um grama sequer, mas consigo afundar o navio mais forte se estiver dentro do seu casco. O que sou?", a: "Um rombo / Um furo." },
  { q: "Custa nada para dar, mas vale muito para quem recebe; abre portas trancadas pela raiva e derrete corações de pedra. O que sou?", a: "O perdão / Um sorriso." },
  { q: "Sou invisível aos olhos, mas congelo a espinha do guerreiro mais forte diante da criatura ancestral. O que sou?", a: "O medo." },
  { q: "Todos os homens me temem, os mortos me conhecem e os deuses me observam. O fim de todas as jornadas. O que sou?", a: "A morte." },
  { q: "Nunca existi, mas sempre serei; ninguém nunca me viu, mas todos esperam por mim. O que sou?", a: "O amanhã." },
  { q: "Posso ser criada em um instante de carinho, guardada por cem anos e perdida em um golpe na cabeça. O que sou?", a: "Uma lembrança / memória." },
  { q: "Fico no meio da verdade e da dúvida; se você me alimentar com provas, eu morro; se me alimentar com mistério, eu cresço. O que sou?", a: "A dúvida / suspeita." },
  { q: "Sou a única coisa que quanto mais você gasta com os amigos, mais você ganha em retorno. O que sou?", a: "A amizade / A confiança." },

  // --- CRIATURAS, MONSTROS & MAGIA D&D ---
  { q: "Durmo sobre montanhas de ouro que nunca gasto; meu sopro incendeia florestas e minhas escamas repelem lanças. O que sou?", a: "Um dragão vermelho." },
  { q: "Quando envelheço, queimo em chamas douradas até virar cinzas; das cinzas renasço jovem e imortal. O que sou?", a: "Uma fênix." },
  { q: "Tenho corpo de leão, asas de águia e cabeça de mulher; faço perguntas difíceis e devoro quem erra. O que sou?", a: "Uma esfinge." },
  { q: "Meu olhar transforma carne em pedra; se você olhar diretamente nos meus olhos, sua jornada termina aqui. O que sou?", a: "Um basilisco / Medusa." },
  { q: "Não tenho pulso nem calor no peito; saio da tumba quando a noite cai e fujo da luz sagrada do clérigo. O que sou?", a: "Um morto-vivo / Zumbi." },
  { q: "Bebo a essência da vida em taças de sangue, fujo do alho e da luz do sol, e durmo na terra de meu caixão. O que sou?", a: "Um vampiro." },
  { q: "Vivo nos pântanos e esgotos; se cortar meu braço ele nasce de novo; somente o fogo e o ácido podem me destruir. O que sou?", a: "Um troll." },
  { q: "Não sou pássaro nem morcego, mas tenho penas negras e inteligência afiada. Acompanho necromantes e conto segredos. O que sou?", a: "Um corvo." },
  { q: "Cresço nas florestas arcanas; sou verde por fora mas posso soltar esporos venenosos ou brilhar no escuro sem fogo. O que sou?", a: "Um cogumelo bioluminescente." },
  { q: "Tenho galhos que alcançam as nuvens e raízes que abraçam o abismo; falo em sussurros lentos que levam dias para terminar. O que sou?", a: "Um Ent / Guardião das Árvores." },
  { q: "Pareço uma criatura viva e respiro ilusão, mas se você tocar em mim com a mão de ferro, desapareço no ar. O que sou?", a: "Uma ilusão arcana." },
  { q: "Sou um rasgo no tecido do espaço; quem entra por mim em Faerûn pode sair no Plano Astral ou nos Nove Infernos. O que sou?", a: "Um portal planar." },

  // --- CHARADAS DE TAVERNA, LOGICA & MATEMATICA ---
  { q: "Se você me olhar no 6, sou um número; se você me virar de cabeça para baixo, aumento 3 unidades. Que número sou?", a: "O número 6 (que vira 9)." },
  { q: "O pai de Mary tem 5 filhas: Dadá, Dedé, Didí, Dodó e... qual é o nome da quinta?", a: "Mary." },
  { q: "Um fazendeiro tem 17 ovelhas. Todas morreram, exceto 9. Quantas ovelhas sobraram?", a: "9 ovelhas." },
  { q: "O que fica mais molhado quanto mais você seca?", a: "Uma toalha." },
  { q: "O que tem pescoço mas não tem cabeça, e veste uma camisa sem mangas?", a: "Uma garrafa." },
  { q: "Tenho um olho mas não consigo enxergar nada. Ajudo a costurar capas de magos e tapeçarias reais. O que sou?", a: "Uma agulha." },
  { q: "Tenho quatro pernas mas não consigo andar; sobre minhas costas descansam banquetes de reis e poções de alquimistas. O que sou?", a: "Uma mesa." },
  { q: "Quanto mais você corre atrás de mim, mais fico para trás. Deixo marcas no chão para quem quiser me seguir. O que sou?", a: "As pegadas." },
  { q: "Subo quando a chuva cai; desço quando o tempo firma. O que sou?", a: "O guarda-chuva." },
  { q: "Subo a colina sem pernas, desço o vale sem rodas e entro na taverna sem pedir licença. O que sou?", a: "A fumaça." },
  { q: "Tenho chifres mas não sou touro; levo minha casa nas costas por onde passo. O que sou?", a: "Um caracol." },
  { q: "Tenho asas mas não voo; tenho dentes mas não mordo; fico no moinho girando com o vento. O que sou?", a: "As pás do moinho de vento." },
  { q: "Sou branca como o leite, doce como o mel, mas derreto se cair no café quente. O que sou?", a: "O açúcar." },
  { q: "Sou transparente como o ar, mas posso ser cortado como o gelo para enfeitar o anel da rainha. O que sou?", a: "Um diamante." },
  { q: "Quantos meses do ano têm 28 dias?", a: "Todos os 12 meses (todos têm pelo menos 28 dias)." },
  { q: "O que pode preencher uma sala inteira sem ocupar espaço algum?", a: "A luz (ou a escuridão/música)." },
  { q: "Se dois guerreiros jogam xadrez e jogam 5 partidas, e cada um ganha 3 vezes sem empates, como isso é possível?", a: "Eles não estavam jogando um contra o outro." },
  { q: "O que tem polegar e quatro dedos, mas não tem carne nem ossos?", a: "Uma luva." },
  { q: "O que corre em volta de todo o castelo sem nunca dar um único passo?", a: "A muralha / A cerca." },
  { q: "O que tem um coração que não bate e folhas que não caem na floresta?", a: "Uma alcachofra (ou um livro de botânica)." },
  { q: "O que tem cabeça, rabo, é dourado, mas não tem corpo?", a: "Uma moeda de ouro." },
  { q: "O que você pode quebrar com apenas um olhar de desaprovação ou manter firme mesmo em meio à tempestade?", a: "A compostura / O foco." },
  { q: "Sou fácil de levantar, mas difícil de atirar longe. O que sou?", a: "Uma pluma / pena de ganso." },
  { q: "Tenho raízes que ninguém vê, sou mais alta que os pinheiros, subo até o céu e nunca cresço. O que sou?", a: "Uma montanha." },
  { q: "Uma caixa sem gonzos, tampa ou chave, mas dentro há um tesouro dourado escondido. O que sou?", a: "Um ovo." },
  { q: "Sem pernas eu me arrasto; sem asas eu me elevo no ar; choro sem olhos e mato de sede quem se perde em mim. O que sou?", a: "O deserto." },
  { q: "Tenho espinhas mas não tenho ossos; tenho escamas de tinta e nado em mares de imaginação. O que sou?", a: "Um conto / livro sobre monstros marinhos." },
  { q: "O que entra na floresta de dia e sai à noite sem tocar nas árvores?", a: "A sombra da montanha." },
  { q: "Se me chamar pelo meu nome eu fico furioso e fujo; se me esquecer, eu domino o salão. O que sou?", a: "O pânico." },
  { q: "Trago a vitória para quem tem paciência e a derrota para quem tem pressa no tabuleiro. O que sou?", a: "A estratégia." },
  { q: "Tenho 52 irmãos divididos em 4 famílias com 2 reis e 2 rainhas de cada cor. Quem somos nós?", a: "As cartas de um baralho." },
  { q: "Tenho seis faces pintadas de pontos, rolo na mesa dos taverneiros e decido o destino dos heróis. O que sou?", a: "Um dado de seis lados (d6)." },
  { q: "Tenho vinte faces numeradas de 1 a 20; quando mostro o 20 trago a glória, quando mostro o 1 trago o desastre. O que sou?", a: "Um dado d20 de D&D." },
  { q: "Sou preto quando me compram, vermelho quando me usam e cinza quando me jogam fora. O que sou?", a: "O carvão." },
  { q: "O que é que quanto mais seca, mais encharcada fica a toalha?", a: "A água / O corpo molhado." },
  { q: "O que é que sobe quando a maré sobe e desce quando a maré desce, mas nunca se afoga?", a: "Um barco / Uma âncora com boia." },
  { q: "Tenho boca de ferro e língua de chumbo; cuspo fogo e fumaça e quebro portões de castelos. O que sou?", a: "Um canhão de cerco." },
  { q: "O que pode viajar pelo mundo inteiro ficando sempre preso no mesmo canto?", a: "Um selo postal / Uma estampa de carta." },
  { q: "Tenho olhos mas não posso ver nada; fico no fundo da terra e sou o alimento preferido dos anões na sopa. O que sou?", a: "A batata." },
  { q: "Tenho barba macia, dentes dourados cobertos por palha e fico na plantação esperando a colheita. O que sou?", a: "Uma espiga de milho." },
  { q: "Caminho no teto sem cair, teço armadilhas sem ferramentas e tenho oito olhos que brilham na lanterna. O que sou?", a: "Uma aranha." },
  { q: "O que é que você tira para fora quando precisa usar e guarda para dentro quando termina de usar?", a: "Uma âncora." },
  { q: "Nunca digo a verdade e nunca minto; apenas repito exatamente o que você acabou de falar. O que sou?", a: "O papagaio / O eco das cavernas." },
  { q: "O que é que anda com a cabeça para baixo?", a: "O prego no sapato." },
  { q: "O que tem asa de couro, dorme de cabeça para baixo e voa na escuridão sem trombar nas paredes?", a: "Um morcego." },
  { q: "O que corre o campo todo de dia e dorme embaixo da cama à noite com a língua de fora?", a: "O sapato / A bota de couro." },
  { q: "Sou invisível até que me desenhem na terra; guardo círculos de proteção contra demônios e mortos-vivos. O que sou?", a: "Um círculo mágico / Runa de proteção." },
  { q: "Quando mais se tira, mais sobra para os outros dividirem em um mistério. O que sou?", a: "As pistas de um enigma." }
];

const DND5E_SKILLS = [
  { key: 'atletismo', name: 'Atletismo', attr: 'str', label: 'FOR' },
  { key: 'acrobacia', name: 'Acrobacia', attr: 'dex', label: 'DES' },
  { key: 'furtividade', name: 'Furtividade', attr: 'dex', label: 'DES' },
  { key: 'prestidigitacao', name: 'Prestidigitação', attr: 'dex', label: 'DES' },
  { key: 'arcanismo', name: 'Arcanismo', attr: 'int', label: 'INT' },
  { key: 'historia', name: 'História', attr: 'int', label: 'INT' },
  { key: 'investigacao', name: 'Investigação', attr: 'int', label: 'INT' },
  { key: 'natureza', name: 'Natureza', attr: 'int', label: 'INT' },
  { key: 'religiao', name: 'Religião', attr: 'int', label: 'INT' },
  { key: 'adestramento', name: 'Adestrar Animais', attr: 'wis', label: 'SAB' },
  { key: 'intuicao', name: 'Intuição', attr: 'wis', label: 'SAB' },
  { key: 'medicina', name: 'Medicina', attr: 'wis', label: 'SAB' },
  { key: 'percepcao', name: 'Percepção', attr: 'wis', label: 'SAB' },
  { key: 'sobrevivencia', name: 'Sobrevivência', attr: 'wis', label: 'SAB' },
  { key: 'atuacao', name: 'Atuação', attr: 'cha', label: 'CAR' },
  { key: 'enganacao', name: 'Enganação', attr: 'cha', label: 'CAR' },
  { key: 'intimidacao', name: 'Intimidação', attr: 'cha', label: 'CAR' },
  { key: 'persuasao', name: 'Persuasão', attr: 'cha', label: 'CAR' }
];

const DND5E_XP_TABLE = [
  0, 300, 900, 2700, 6500, 14000, 23000, 34000, 48000, 64000,
  85000, 100000, 120000, 140000, 165000, 195000, 225000, 265000, 305000, 355000
];

let PLAYERS = [
  {
    "ac": 16,
    "actionEconomyFilter": "all",
    "actionLogs": [],
    "activeCardTab": "skills",
    "attacks": "Espada Longa (+4, 1d8+2 cortante)",
    "avatar": "👤",
    "background": "Aventureiro",
    "backstory": "",
    "badges": [
      "⭐ Presença 100%"
    ],
    "bond": "Minha lealdade inabalável aos companheiros de mesa",
    "cha": 18,
    "className": "Paladino",
    "coins": {
      "cp": 0,
      "ep": 0,
      "gp": 15,
      "pp": 0,
      "sp": 0
    },
    "con": 14,
    "deathSaves": {
      "fail": 0,
      "success": 0
    },
    "dex": 10,
    "featureCharges": [
      {
        "icon": "🤲",
        "id": "lay_on_hands",
        "max": 25,
        "name": "Cura pelas Mãos (PV)",
        "restType": "long",
        "used": 0
      },
      {
        "icon": "✨",
        "id": "channel_divinity",
        "max": 1,
        "name": "Canalizar Divindade",
        "restType": "short",
        "used": 0
      }
    ],
    "features": "Retomar o Fôlego (1d10+1 PV)",
    "fightingStyle": "",
    "flaw": "Às vezes ajo antes de planejar cautelosamente",
    "gold": 15,
    "hitDice": "5d10",
    "hp": 43,
    "id": "p_1788965925056",
    "ideal": "Proteger os inocentes e defender a justiça",
    "inspiration": false,
    "int": 13,
    "level": 5,
    "maxHp": 43,
    "multiclass": [
      {
        "className": "Paladino",
        "level": 5,
        "subclassIdx": 0
      }
    ],
    "name": "Yoshigake Kira",
    "playerNotes": "",
    "preparedSpells": [
      "Auxílio Divino",
      "Bênção",
      "Escudo da Fé",
      "Convocar Montaria",
      "Zona da Verdade",
      "Curar Ferimentos"
    ],
    "present": true,
    "race": "Humano (Human)",
    "saveProficiencies": [
      "wis",
      "cha"
    ],
    "skillProficiencies": [
      "atletismo",
      "intimidacao",
      "intuicao",
      "medicina"
    ],
    "slots": [
      4,
      2,
      0,
      0,
      0
    ],
    "slotsUsed": [
      0,
      0,
      0,
      0,
      0
    ],
    "speed": "9m",
    "spells": "Preparadas: Auxílio Divino, Bênção, Escudo da Fé, Convocar Montaria, Zona da Verdade, Curar Ferimentos",
    "spentHitDice": 0,
    "str": 14,
    "student": "Gustavo",
    "subclass": "Juramento de Devoção (Devotion)",
    "subclassIdx": 0,
    "tempHp": 0,
    "updatedAt": 1790177357973,
    "wis": 15,
    "xp": 0,
    "inventory": [],
    "conditions": []
  },
  {
    "ac": 19,
    "actionLogs": [],
    "activeCardTab": "skills",
    "attacks": "Espada Longa (+6, 1d10+24cortante)",
    "avatar": "👤",
    "background": "Aventureiro",
    "backstory": "",
    "badges": [
      "⭐ Presença 100%"
    ],
    "bond": "Minha lealdade inabalável aos companheiros de mesa",
    "cha": 11,
    "className": "Guerreiro",
    "coins": {
      "cp": 0,
      "ep": 0,
      "gp": 15,
      "pp": 0,
      "sp": 0
    },
    "con": 16,
    "deathSaves": {
      "fail": 0,
      "success": 0
    },
    "dex": 16,
    "featureCharges": [
      {
        "icon": "💨",
        "id": "second_wind",
        "max": 1,
        "name": "Retomar o Fôlego",
        "restType": "short",
        "used": 0
      },
      {
        "icon": "⚡",
        "id": "action_surge",
        "max": 1,
        "name": "Surto de Ação",
        "restType": "short",
        "used": 0
      }
    ],
    "features": "Retomar o Fôlego (1d10+1 PV)",
    "fightingStyle": "defense",
    "flaw": "Às vezes ajo antes de planejar cautelosamente",
    "gold": 15,
    "hitDice": "5d10",
    "hp": 43,
    "id": "p_1788966076171",
    "ideal": "Proteger os inocentes e defender a justiça",
    "inspiration": false,
    "int": 15,
    "level": 5,
    "maxHp": 43,
    "name": "Deraravely",
    "playerNotes": "",
    "present": true,
    "race": "Orc",
    "slots": [
      0,
      0,
      0,
      0,
      0
    ],
    "slotsUsed": [
      0,
      0,
      0,
      0,
      0
    ],
    "speed": "9m",
    "spells": "Armadura de Couro, Escudo, Mochila",
    "spentHitDice": 0,
    "str": 18,
    "student": "Samuel",
    "subclass": "Campeão (Champion)",
    "subclassIdx": 0,
    "tempHp": 0,
    "updatedAt": 1790178648395,
    "wis": 10,
    "xp": 0,
    "skillProficiencies": [],
    "saveProficiencies": [],
    "inventory": [],
    "conditions": []
  },
  {
    "ac": 11,
    "actionLogs": [],
    "activeCardTab": "inventory",
    "attacks": "Espada Longa (+4, 1d8+2 cortante)",
    "avatar": "🧙‍♀️",
    "background": "Aventureiro",
    "backstory": "",
    "badges": [
      "⭐ Presença 100%"
    ],
    "bond": "Minha lealdade inabalável aos companheiros de mesa",
    "cha": 11,
    "className": "Mago",
    "coins": {
      "cp": 0,
      "ep": 0,
      "gp": 0,
      "pp": 0,
      "sp": 0
    },
    "con": 13,
    "deathSaves": {
      "fail": 0,
      "success": 0
    },
    "dex": 13,
    "features": "Retomar o Fôlego (1d10+1 PV)",
    "fightingStyle": "",
    "flaw": "Às vezes ajo antes de planejar cautelosamente",
    "gold": 0,
    "hitDice": "1d6",
    "hp": 6,
    "id": "p_1788966196301",
    "ideal": "Proteger os inocentes e defender a justiça",
    "inspiration": false,
    "int": 16,
    "level": 1,
    "maxHp": 6,
    "name": "Arkhalis",
    "playerNotes": "",
    "preparedSpells": [
      "Amizade",
      "Ataque Certeiro"
    ],
    "present": true,
    "race": "Elfo (Elf)",
    "slots": [
      2,
      0,
      0,
      0,
      0
    ],
    "slotsUsed": [
      0,
      0,
      0,
      0,
      0
    ],
    "speed": "9m",
    "spells": "Truques: Amizade, Ataque Certeiro",
    "spentHitDice": 0,
    "str": 7,
    "student": "Ademar",
    "subclassIdx": 0,
    "tempHp": 0,
    "updatedAt": 1789764256187,
    "wis": 11,
    "xp": 0,
    "skillProficiencies": [],
    "saveProficiencies": [],
    "inventory": [],
    "conditions": [],
    "featureCharges": []
  },
  {
    "ac": 15,
    "actionLogs": [],
    "activeCardTab": "features",
    "attacks": "Espada Longa (+6, 1d6+4 cortante), Adaga (+6, 1d4+4 perfurante), arco curto (+6, 1d6+4)",
    "avatar": "👤",
    "background": "Aventureiro",
    "backstory": "",
    "badges": [
      "⭐ Presença 100%"
    ],
    "bond": "Minha lealdade inabalável aos companheiros de mesa",
    "cha": 14,
    "className": "Ladino",
    "coins": {
      "cp": 0,
      "ep": 0,
      "gp": 15,
      "pp": 0,
      "sp": 0
    },
    "con": 12,
    "deathSaves": {
      "fail": 0,
      "success": 0
    },
    "dex": 19,
    "features": "",
    "flaw": "Às vezes ajo antes de planejar cautelosamente",
    "gold": 15,
    "hitDice": "2d8",
    "hp": 17,
    "id": "p_1789139150496",
    "ideal": "Proteger os inocentes e defender a justiça",
    "inspiration": false,
    "int": 13,
    "level": 2,
    "maxHp": 17,
    "multiclass": [
      {
        "className": "Ladino",
        "level": 2,
        "subclassIdx": 0
      }
    ],
    "name": "Marc Hiroshi",
    "playerNotes": "",
    "present": true,
    "race": "Elfo (Elf)",
    "slots": [
      0,
      0,
      0,
      0,
      0
    ],
    "slotsUsed": [
      0,
      0,
      0,
      0,
      0
    ],
    "speed": "9m",
    "spells": "",
    "str": 14,
    "student": "Andressa",
    "subclassIdx": 0,
    "tempHp": 0,
    "updatedAt": 1789764457703,
    "wis": 11,
    "xp": 0,
    "skillProficiencies": [],
    "saveProficiencies": [],
    "inventory": [],
    "conditions": [],
    "featureCharges": []
  },
  {
    "ac": 15,
    "actionLogs": [],
    "activeCardTab": "spells",
    "attacks": "Espada Curta (+6, 1d6+4 cortante), Adaga (+6, 1d4+4), Arco curto (+6, 1d6+4)",
    "avatar": "👤",
    "background": "Aventureiro",
    "backstory": "",
    "badges": [
      "⭐ Presença 100%"
    ],
    "bond": "Minha lealdade inabalável aos companheiros de mesa",
    "cha": 7,
    "className": "Ladino",
    "coins": {
      "cp": 0,
      "ep": 0,
      "gp": 15,
      "pp": 0,
      "sp": 0
    },
    "con": 12,
    "deathSaves": {
      "fail": 0,
      "success": 0
    },
    "dex": 19,
    "features": "",
    "flaw": "Às vezes ajo antes de planejar cautelosamente",
    "gold": 15,
    "hitDice": "3d8",
    "hp": 19,
    "id": "p_1789139310556",
    "ideal": "Proteger os inocentes e defender a justiça",
    "inspiration": false,
    "int": 14,
    "level": 3,
    "maxHp": 19,
    "multiclass": [
      {
        "className": "Ladino",
        "level": 3,
        "subclassIdx": 2
      }
    ],
    "name": "Lalw",
    "playerNotes": "",
    "preparedSpells": [
      "Mãos Mágicas",
      "Disfarçar-se",
      "Enfeitiçar Pessoa",
      "Rajada de Veneno",
      "Proteção contra Lâminas"
    ],
    "present": true,
    "race": "Elfo (Elf)",
    "slots": [
      0,
      0,
      0,
      0,
      0
    ],
    "slotsUsed": [
      0,
      0,
      0,
      0,
      0
    ],
    "speed": "9m",
    "spells": "Truques: Mãos Mágicas, Rajada de Veneno, Proteção contra Lâminas\nPreparadas: Disfarçar-se, Enfeitiçar Pessoa",
    "str": 14,
    "student": "Luis Guilherme",
    "subclassIdx": 0,
    "tempHp": 0,
    "updatedAt": 1789997672391,
    "wis": 12,
    "xp": 0,
    "skillProficiencies": [],
    "saveProficiencies": [],
    "inventory": [],
    "conditions": [],
    "featureCharges": []
  },
  {
    "ac": 14,
    "actionLogs": [],
    "activeCardTab": "skills",
    "attacks": "Espada curta (+5, 1d6+3 perfurante), Adaga curta (+5, 1d4+3 perfurante)",
    "avatar": "👤",
    "background": "Aventureiro",
    "backstory": "",
    "badges": [
      "⭐ Presença 100%"
    ],
    "bond": "Minha lealdade inabalável aos companheiros de mesa",
    "cha": 18,
    "className": "Bruxo",
    "coins": {
      "cp": 0,
      "ep": 0,
      "gp": 15,
      "pp": 0,
      "sp": 0
    },
    "con": 13,
    "deathSaves": {
      "fail": 0,
      "success": 0
    },
    "dex": 16,
    "features": "",
    "flaw": "Às vezes ajo antes de planejar cautelosamente",
    "gold": 15,
    "hitDice": "3d8",
    "hp": 22,
    "id": "p_1789143431458",
    "ideal": "Proteger os inocentes e defender a justiça",
    "inspiration": false,
    "int": 15,
    "level": 3,
    "maxHp": 22,
    "multiclass": [
      {
        "className": "Bruxo",
        "level": 3,
        "subclassIdx": 0
      }
    ],
    "name": "Caim Vonsilford",
    "playerNotes": "",
    "preparedSpells": [
      "Rajada Mística",
      "Toque Arrepiante",
      "Bruxaria",
      "Mãos Flamejantes",
      "Invisibilidade",
      "Patas de Aranha"
    ],
    "present": true,
    "race": "Draconato (Dragonborn)",
    "saveProficiencies": [
      "wis",
      "cha"
    ],
    "skillProficiencies": [
      "atletismo",
      "furtividade",
      "percepcao",
      "religiao"
    ],
    "slots": [
      0,
      2,
      0,
      0,
      0
    ],
    "slotsUsed": [
      0,
      0,
      0,
      0,
      0
    ],
    "speed": "9m",
    "spells": "Truques: Rajada Mística, Toque Arrepiante\nPreparadas: Bruxaria, Mãos Flamejantes, Invisibilidade, Patas de Aranha",
    "str": 17,
    "student": "Pedro Arthur",
    "subclassIdx": 0,
    "tempHp": 0,
    "updatedAt": 1789997068586,
    "wis": 13,
    "xp": 0,
    "inventory": [],
    "conditions": [],
    "featureCharges": []
  },
  {
    "ac": 12,
    "actionLogs": [],
    "activeCardTab": "spells",
    "attacks": "Adaga Curta (+3, 1d4+1), Cajado (+3, 1d4+1), Besta (+3, 1d8+1)",
    "avatar": "👤",
    "background": "Aventureiro",
    "backstory": "",
    "badges": [
      "⭐ Presença 100%"
    ],
    "bond": "Minha lealdade inabalável aos companheiros de mesa",
    "cha": 20,
    "className": "Bruxo",
    "coins": {
      "cp": 0,
      "ep": 0,
      "gp": 15,
      "pp": 0,
      "sp": 0
    },
    "con": 14,
    "deathSaves": {
      "fail": 0,
      "success": 0
    },
    "dex": 14,
    "features": "",
    "fightingStyle": "",
    "flaw": "Às vezes ajo antes de planejar cautelosamente",
    "gold": 15,
    "hitDice": "5d8",
    "hp": 37,
    "id": "p_1789144892638",
    "ideal": "Proteger os inocentes e defender a justiça",
    "inspiration": false,
    "int": 14,
    "level": 5,
    "maxHp": 37,
    "multiclass": [
      {
        "className": "Bruxo",
        "level": 5,
        "subclassIdx": 0
      }
    ],
    "name": "Claker",
    "playerNotes": "",
    "preparedSpells": [
      "Proteção contra Lâminas",
      "Rajada Mística",
      "Raio de Bruxa",
      "Proteção contra o Bem e Mal",
      "Mãos Flamejantes",
      "Contramágica",
      "Despedaçar",
      "Invisibilidade",
      "Mãos Mágicas"
    ],
    "present": true,
    "race": "Tiefling",
    "slots": [
      0,
      0,
      2,
      0,
      0
    ],
    "slotsUsed": [
      0,
      0,
      0,
      0,
      0
    ],
    "speed": "9m",
    "spells": "Truques: Proteção contra Lâminas, Rajada Mística, Mãos Mágicas\nPreparadas: Raio de Bruxa, Proteção contra o Bem e Mal, Mãos Flamejantes, Contramágica, Despedaçar, Invisibilidade",
    "spentHitDice": 0,
    "str": 6,
    "student": "Anna Julia",
    "subclass": "Patrono Corruptor (The Fiend)",
    "subclassIdx": 0,
    "tempHp": 0,
    "updatedAt": 1790177907160,
    "wis": 10,
    "xp": 0,
    "skillProficiencies": [],
    "saveProficiencies": [],
    "inventory": [],
    "conditions": [],
    "featureCharges": []
  },
  {
    "ac": 12,
    "actionLogs": [],
    "activeCardTab": "skills",
    "attacks": "Espada curta (+4, 1d6+2 cortante), Adaga (+4, 1d6+2)",
    "avatar": "👤",
    "background": "Aventureiro",
    "backstory": "",
    "badges": [
      "⭐ Presença 100%"
    ],
    "bond": "Minha lealdade inabalável aos companheiros de mesa",
    "cha": 13,
    "className": "Ladino",
    "coins": {
      "cp": 0,
      "ep": 0,
      "gp": 15,
      "pp": 0,
      "sp": 0
    },
    "con": 11,
    "deathSaves": {
      "fail": 0,
      "success": 0
    },
    "dex": 14,
    "features": "",
    "fightingStyle": "",
    "flaw": "Às vezes ajo antes de planejar cautelosamente",
    "gold": 15,
    "hitDice": "1d8",
    "hp": 7,
    "id": "p_1789395282873",
    "ideal": "Proteger os inocentes e defender a justiça",
    "inspiration": false,
    "int": 12,
    "level": 1,
    "maxHp": 7,
    "name": "Koichi",
    "playerNotes": "",
    "present": true,
    "race": "Humano (Human)",
    "saveProficiencies": [
      "dex",
      "int"
    ],
    "skillExpertises": [
      "furtividade",
      "prestidigitacao"
    ],
    "skillProficiencies": [
      "acrobacia",
      "enganacao",
      "furtividade",
      "prestidigitacao"
    ],
    "slots": [
      0,
      0,
      0,
      0,
      0
    ],
    "slotsUsed": [
      0,
      0,
      0,
      0,
      0
    ],
    "speed": "9m",
    "spells": "",
    "str": 10,
    "student": "Arthur Guilherme",
    "subclassIdx": 0,
    "tempHp": 0,
    "wis": 11,
    "xp": 0,
    "inventory": [],
    "conditions": [],
    "featureCharges": []
  },
  {
    "ac": 14,
    "actionLogs": [],
    "activeCardTab": "skills",
    "attacks": "Besta Leve (+2, 1d8+2)",
    "avatar": "👤",
    "background": "Aventureiro",
    "backstory": "",
    "badges": [
      "⭐ Presença 100%"
    ],
    "bond": "Minha lealdade inabalável aos companheiros de mesa",
    "cha": 20,
    "className": "Feiticeiro 4 / Bruxo",
    "coins": {
      "cp": 0,
      "ep": 0,
      "gp": 15,
      "pp": 0,
      "sp": 0
    },
    "con": 16,
    "deathSaves": {
      "fail": 0,
      "success": 0
    },
    "dex": 12,
    "featureCharges": [
      {
        "icon": "🔮",
        "id": "sorcery_points",
        "max": 5,
        "name": "Pontos de Feitiçaria",
        "restType": "long",
        "used": 0
      }
    ],
    "features": "",
    "fightingStyle": "",
    "flaw": "Às vezes ajo antes de planejar cautelosamente",
    "gold": 15,
    "hitDice": "4d6 + 1d8",
    "hp": 36,
    "id": "p_1789398594305",
    "ideal": "Proteger os inocentes e defender a justiça",
    "inspiration": false,
    "int": 9,
    "level": 5,
    "maxHp": 36,
    "multiclass": [
      {
        "className": "Feiticeiro",
        "level": 4,
        "subclassIdx": 0
      },
      {
        "className": "Bruxo",
        "level": 1,
        "subclassIdx": 0
      }
    ],
    "name": "Zenit",
    "playerNotes": "",
    "preparedSpells": [
      "Mãos Flamejantes",
      "Mísseis Mágicos",
      "Toque Chocante",
      "Proteção contra Lâminas",
      "Ilusão Menor",
      "Mensagem",
      "Bruxaria",
      "Espirro Ácido",
      "Coroa da Loucura",
      "Escuridão",
      "Raio Ardente"
    ],
    "present": true,
    "race": "Draconato (Dragonborn)",
    "saveProficiencies": [
      "cha",
      "con"
    ],
    "skillProficiencies": [
      "arcanismo",
      "adestramento",
      "persuasao",
      "sobrevivencia"
    ],
    "slots": [
      5,
      3,
      0,
      0,
      0
    ],
    "slotsUsed": [
      0,
      0,
      0,
      0,
      0
    ],
    "speed": "9m",
    "spells": "Truques: Toque Chocante, Proteção contra Lâminas, Ilusão Menor, Mensagem, Espirro Ácido\nPreparadas: Mãos Flamejantes, Mísseis Mágicos, Bruxaria, Coroa da Loucura, Escuridão, Raio Ardente",
    "spentHitDice": 0,
    "str": 16,
    "student": "Diogo",
    "subclass": "Feitiçaria Dracônica (Draconic Sorcery)",
    "subclassIdx": 0,
    "tempHp": 0,
    "updatedAt": 1790016740629,
    "wis": 12,
    "xp": 0,
    "inventory": [],
    "conditions": []
  }
];

let state = {
  "combatants": [
    {
      "ac": 19,
      "actions": "Espada Longa (+6, 1d10+4 cortante)",
      "hp": 43,
      "id": "c_1789399293810_mle9",
      "init": 19,
      "maxHp": 43,
      "name": "Deraravely (Samuel)",
      "playerId": "p_1788966076171",
      "type": "player"
    },
    {
      "ac": 12,
      "actions": "Adaga . Ataque Corpo a Corpo com Arma: +4 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 4 (1d4 + 2) de dano perfurante. Funda . Ataque à Distância com Arma: +4 para acertar , alcance 9/36 m (30/120 ft), um alvo. Acerto: 4 (1d4 + 2) de dano de concussão.",
      "hp": 5,
      "id": "c_1789401151692_pkeh_3",
      "init": 19,
      "maxHp": 5,
      "name": "Kobold #3",
      "type": "monster"
    },
    {
      "ac": 14,
      "actions": "Besta Leve (+2, 1d8+2)",
      "hp": 36,
      "id": "c_1789399332339_r327",
      "init": 16,
      "maxHp": 36,
      "name": "Zenit (Diogo)",
      "playerId": "p_1789398594305",
      "type": "player"
    },
    {
      "ac": 11,
      "actions": "Espada Longa (+4, 1d8+2 cortante)",
      "hp": 6,
      "id": "c_1789399354643_odnr",
      "init": 15,
      "maxHp": 6,
      "name": "Arkhalis (Ademar)",
      "playerId": "p_1788966196301",
      "type": "player"
    },
    {
      "ac": 12,
      "actions": "Adaga Curta (+3, 1d4+1), Cajado (+3, 1d4+1), Besta (+3, 1d8+1)",
      "hp": 37,
      "id": "c_1789399237312_u1h3",
      "init": 12,
      "maxHp": 37,
      "name": "Claker (Anna Julia)",
      "playerId": "p_1789144892638",
      "type": "player"
    },
    {
      "ac": 15,
      "actions": "Ataque padrão (+4, 1d6+2 físico)",
      "hp": 17,
      "id": "c_1789401314732",
      "init": 12,
      "maxHp": 27,
      "name": "Kobold Mago",
      "type": "monster"
    },
    {
      "ac": 12,
      "actions": "Espada curta (+4, 1d6+2 cortante), Adaga (+4, 1d6+2)",
      "hp": 7,
      "id": "c_1789399271052_hke3",
      "init": 10,
      "maxHp": 7,
      "name": "Koichi (Arthur Guilherme)",
      "playerId": "p_1789395282873",
      "type": "player"
    },
    {
      "ac": 16,
      "actions": "Espada Longa (+4, 1d8+2 cortante)",
      "hp": 43,
      "id": "c_1789399377590_wwib",
      "init": 10,
      "maxHp": 43,
      "name": "Yoshigake Kira (Gustavo)",
      "playerId": "p_1788965925056",
      "type": "player"
    },
    {
      "ac": 12,
      "actions": "Adaga . Ataque Corpo a Corpo com Arma: +4 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 4 (1d4 + 2) de dano perfurante. Funda . Ataque à Distância com Arma: +4 para acertar , alcance 9/36 m (30/120 ft), um alvo. Acerto: 4 (1d4 + 2) de dano de concussão.",
      "hp": 5,
      "id": "c_1789401151692_15o6_1",
      "init": 5,
      "maxHp": 5,
      "name": "Kobold #1",
      "type": "monster"
    },
    {
      "ac": 12,
      "actions": "Adaga . Ataque Corpo a Corpo com Arma: +4 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 4 (1d4 + 2) de dano perfurante. Funda . Ataque à Distância com Arma: +4 para acertar , alcance 9/36 m (30/120 ft), um alvo. Acerto: 4 (1d4 + 2) de dano de concussão.",
      "hp": 5,
      "id": "c_1789401151692_d6fq_2",
      "init": 3,
      "maxHp": 5,
      "name": "Kobold #2",
      "type": "monster"
    }
  ],
  "logs": [
    {
      "time": "12:09:52",
      "text": "👥 <b>Heróis Atualizados:</b> 3 heróis vinculados à campanha \"Mesa Qui-Sex\"."
    },
    {
      "time": "12:09:35",
      "text": "📜 <b>Campanha:</b> \"Mesa Qui-Sex\" salva com sucesso."
    },
    {
      "text": "🗑️ <b>Sessão Excluída:</b> Sessão 1.",
      "time": "08:20:20"
    },
    {
      "text": "🧹 <b>Baú do Grupo:</b> Histórico de movimentações resetado pelo mestre.",
      "time": "21:02:33"
    },
    {
      "text": "🗑️ <b>Baú do Grupo:</b> \"Poção de Cura Pequena\" removido.",
      "time": "20:12:56"
    },
    {
      "text": "🗑️ <b>Baú do Grupo:</b> \"Poção de Cura Pequena\" removido.",
      "time": "20:12:54"
    },
    {
      "text": "🗑️ <b>Baú do Grupo:</b> \"Poção de Cura Pequena\" removido.",
      "time": "20:12:52"
    },
    {
      "text": "🗑️ <b>Baú do Grupo:</b> \"Poção de Cura Pequena\" removido.",
      "time": "20:12:50"
    },
    {
      "text": "🗑️ <b>Baú do Grupo:</b> \"Poção de Cura Pequena\" removido.",
      "time": "20:12:49"
    },
    {
      "text": "🗑️ <b>Baú do Grupo:</b> \"Poção de Cura Pequena\" removido.",
      "time": "20:12:46"
    },
    {
      "text": "🗑️ <b>Baú do Grupo:</b> \"Poção de Cura Pequena\" removido.",
      "time": "20:12:43"
    },
    {
      "text": "🗑️ <b>Baú do Grupo:</b> \"Poção de Cura Pequena\" removido.",
      "time": "20:12:41"
    },
    {
      "text": "🗑️ <b>Baú do Grupo:</b> \"Poção de Cura Pequena\" removido.",
      "time": "20:12:38"
    },
    {
      "text": "🗑️ <b>Baú do Grupo:</b> \"Poção de Cura Pequena\" removido.",
      "time": "20:12:36"
    },
    {
      "text": "🗑️ <b>Baú do Grupo:</b> \"Poção de Cura Pequena\" removido.",
      "time": "20:12:33"
    },
    {
      "text": "🗑️ <b>Baú do Grupo:</b> \"Poção de Cura Pequena\" removido.",
      "time": "20:12:31"
    },
    {
      "text": "📱 <b>Link Copiado:</b> Link de acesso com dados do personagem copiado para a área de transferência.",
      "time": "19:20:03"
    },
    {
      "text": "💻 <b>Link Curto Copiado:</b> Link simplificado para computador copiado com sucesso.",
      "time": "19:19:47"
    },
    {
      "text": "💻 <b>Link Curto Copiado:</b> Link simplificado para computador copiado com sucesso.",
      "time": "19:19:42"
    },
    {
      "text": "💚 <b>Koichi</b> recuperou 1 PV (0 ➔ 1 PV)",
      "time": "19:08:30"
    },
    {
      "text": "💻 <b>Link Curto Copiado:</b> Link simplificado para computador copiado com sucesso.",
      "time": "19:06:01"
    },
    {
      "text": "💻 <b>Link Curto Copiado:</b> Link simplificado para computador copiado com sucesso.",
      "time": "19:05:44"
    },
    {
      "text": "💻 <b>Link Curto Copiado:</b> Link simplificado para computador copiado com sucesso.",
      "time": "19:03:37"
    },
    {
      "text": "💚 [R3] <b>Yoshigake Kira (Gustavo)</b> curou <b>1</b> PV em <b>Kobold #1</b> (5 ➔ 5 PV)",
      "time": "15:44:57"
    },
    {
      "text": "💀 <b>Koichi (Arthur Guilherme)</b> caiu a 0 PV!",
      "time": "15:44:20"
    },
    {
      "text": "⚔️ <b>Koichi (Arthur Guilherme)</b> sofreu 1 de dano rápido (1 ➔ 0 PV)",
      "time": "15:44:20"
    },
    {
      "text": "📖 <b>Zenit</b> atualizou suas magias preparadas (6 magias salvas com sucesso).",
      "time": "15:43:16"
    },
    {
      "text": "📱 <b>Link Copiado:</b> Link de acesso com dados do personagem copiado para a área de transferência.",
      "time": "15:37:50"
    },
    {
      "text": "⚔️ <b>Koichi</b> sofreu 1 de dano (2 ➔ 1 PV)",
      "time": "12:59:26"
    },
    {
      "text": "⚔️ <b>Koichi</b> sofreu 5 de dano (7 ➔ 2 PV)",
      "time": "12:59:25"
    },
    {
      "text": "[R3] ⚔️ <b>Kobold Mago</b> causou <b>2</b> de dano em <b>Deraravely (Samuel)</b> (2 ➔ 0 PV)<br><span style=\"color: var(--accent-red); font-weight: bold;\">💀 Deraravely (Samuel) caiu a 0 PV!</span>",
      "time": "12:59:06"
    },
    {
      "text": "[R3] ⚔️ <b>Kobold Mago</b> causou <b>4</b> de dano em <b>Yoshigake Kira (Gustavo)</b> (4 ➔ 0 PV)<br><span style=\"color: var(--accent-red); font-weight: bold;\">💀 Yoshigake Kira (Gustavo) caiu a 0 PV!</span>",
      "time": "12:57:47"
    },
    {
      "text": "[R3] ⚔️ <b>Kobold Mago</b> causou <b>2</b> de dano em <b>Claker (Anna Julia)</b> (2 ➔ 0 PV)<br><span style=\"color: var(--accent-red); font-weight: bold;\">💀 Claker (Anna Julia) caiu a 0 PV!</span>",
      "time": "12:57:38"
    },
    {
      "text": "[R3] ⚔️ <b>Claker (Anna Julia)</b> causou <b>10</b> de dano em <b>Kobold Mago</b> (27 ➔ 17 PV)",
      "time": "12:55:32"
    },
    {
      "text": "🐉 <b>3x Kobold</b> foram adicionados ao combate (Iniciativas roladas individualmente).",
      "time": "12:52:31"
    },
    {
      "text": "🚩 <b>Início da Rodada 3</b>",
      "time": "12:42:59"
    },
    {
      "text": "🐉 <b>Mímico</b> foi adicionado ao combate (Iniciativas roladas individualmente).",
      "time": "12:35:40"
    },
    {
      "text": "🚩 <b>Início da Rodada 2</b>",
      "time": "12:30:58"
    },
    {
      "text": "⚔️ <b>Claker</b> sofreu 1 de dano (3 ➔ 2 PV)",
      "time": "12:25:39"
    },
    {
      "text": "⚔️ <b>Claker</b> sofreu 1 de dano (4 ➔ 3 PV)",
      "time": "12:25:39"
    },
    {
      "text": "⚔️ <b>Claker</b> sofreu 1 de dano (5 ➔ 4 PV)",
      "time": "12:25:39"
    },
    {
      "text": "⚔️ <b>Claker</b> sofreu 1 de dano (6 ➔ 5 PV)",
      "time": "12:25:38"
    },
    {
      "text": "⚔️ <b>Zenit</b> sofreu 1 de dano (4 ➔ 3 PV)",
      "time": "12:25:22"
    },
    {
      "text": "⚔️ <b>Zenit</b> sofreu 1 de dano (5 ➔ 4 PV)",
      "time": "12:25:22"
    },
    {
      "text": "⚔️ <b>Zenit</b> sofreu 1 de dano (6 ➔ 5 PV)",
      "time": "12:25:21"
    },
    {
      "text": "⚔️ <b>Yoshigake Kira</b> entrou no combate (Iniciativa: 10, PV: 4/8)",
      "time": "12:22:57"
    },
    {
      "text": "⚔️ <b>Arkhalis</b> entrou no combate (Iniciativa: 15, PV: 4/5)",
      "time": "12:22:34"
    },
    {
      "text": "⚔️ <b>Zenit</b> entrou no combate (Iniciativa: 16, PV: 6/6)",
      "time": "12:22:12"
    },
    {
      "text": "⚔️ <b>Deraravely</b> entrou no combate (Iniciativa: 19, PV: 2/6)",
      "time": "12:21:33"
    },
    {
      "text": "⚔️ <b>Koichi</b> entrou no combate (Iniciativa: 10, PV: 7/7)",
      "time": "12:21:11"
    },
    {
      "text": "⚔️ <b>Claker</b> entrou no combate (Iniciativa: 12, PV: 6/6)",
      "time": "12:20:37"
    },
    {
      "text": "👥 <b>Heróis Atualizados:</b> 5 heróis vinculados à campanha \"Mesa Seg-Qua\".",
      "time": "11:14:59"
    },
    {
      "text": "📜 <b>Gancho de Missão Gerado:</b> Missão: Roubar um tomo proibido de necromancia do cof...",
      "time": "23:16:11"
    },
    {
      "text": "📜 <b>Gancho de Missão Gerado:</b> Missão: Escoltar com segurança uma caravana de refugi...",
      "time": "23:16:10"
    },
    {
      "text": "🎨 <b>Arkhalis</b> atualizou seu avatar para 🧙‍♀️.",
      "time": "22:35:40"
    },
    {
      "text": "🎨 <b>Arkhalis</b> atualizou seu avatar para 👑.",
      "time": "22:35:37"
    },
    {
      "text": "✨ <b>Ficha Sincronizada:</b> Ficha de <b>Arkhalis</b> (Ademar) carregada e salva com sucesso neste dispositivo!",
      "time": "22:34:26"
    },
    {
      "text": "✨ <b>Ficha Sincronizada:</b> Ficha de <b>Arkhalis</b> (Ademar) carregada e salva com sucesso neste dispositivo!",
      "time": "22:21:02"
    }
  ],
  "round": 3,
  "turnIndex": 8
};

const CANONICAL_INITIAL_PLAYERS = JSON.parse(JSON.stringify(PLAYERS));

let puzzleIdx = 0;
let managingCondCombatantId = null;

// ===================================================
// 🌐 UTILITÁRIO CANÔNICO PARA LINKS E QR CODE
// ===================================================
const OFFICIAL_CANONICAL_HOST = 'https://uranio8.github.io/planilha-rpg/';

function getCanonicalPublicUrl(pathOrParams = '') {
  const query = pathOrParams ? (pathOrParams.startsWith('?') ? pathOrParams : `?${pathOrParams}`) : '';
  if (typeof window !== 'undefined' && window.location) {
    const proto = window.location.protocol;
    const host = window.location.hostname;
    // Se estiver rodando localmente (file:/// ou localhost), direciona para o GitHub Pages oficial da turma
    if (proto === 'file:' || host === 'localhost' || host === '127.0.0.1' || host === '0.0.0.0') {
      return `${OFFICIAL_CANONICAL_HOST}${query}`;
    }
    // Caso contrário (produção ou servidor remoto), usa a URL base atual
    const base = window.location.href.split('?')[0].split('#')[0];
    return `${base}${query}`;
  }
  return `${OFFICIAL_CANONICAL_HOST}${query}`;
}

if (typeof window !== 'undefined') {
  window.OFFICIAL_CANONICAL_HOST = OFFICIAL_CANONICAL_HOST;
  window.getCanonicalPublicUrl = getCanonicalPublicUrl;
}

// ===================================================
// 🏛️ CAMADA DE BANCO DE DADOS ROBUSTA (INDEXEDDB - COFRE RESILIENTE)
// ===================================================
const IDB_DB_NAME = 'dnd5e_vtt_database';
const IDB_DB_VERSION = 1;
const IDB_STORE_NAME = 'campaign_vault';

let dndIndexedDB = null;
let isIdbInitialized = false;

function initIndexedDB() {
  if (typeof window === 'undefined' || !window.indexedDB) {
    return Promise.resolve(null);
  }
  if (dndIndexedDB) return Promise.resolve(dndIndexedDB);

  return new Promise((resolve) => {
    try {
      const req = window.indexedDB.open(IDB_DB_NAME, IDB_DB_VERSION);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(IDB_STORE_NAME)) {
          db.createObjectStore(IDB_STORE_NAME, { keyPath: 'key' });
        }
      };
      req.onsuccess = (e) => {
        dndIndexedDB = e.target.result;
        isIdbInitialized = true;
        resolve(dndIndexedDB);
      };
      req.onerror = (e) => {
        console.warn('⚠️ Falha ao abrir IndexedDB:', e);
        resolve(null);
      };
    } catch (err) {
      console.warn('⚠️ Exceção ao inicializar IndexedDB:', err);
      resolve(null);
    }
  });
}

function idbSet(key, value) {
  if (!dndIndexedDB) {
    if (typeof window !== 'undefined' && window.indexedDB && !isIdbInitialized) {
      return initIndexedDB().then(db => {
        if (!db) return false;
        return idbSet(key, value);
      });
    }
    return Promise.resolve(false);
  }
  return new Promise((resolve) => {
    try {
      const tx = dndIndexedDB.transaction(IDB_STORE_NAME, 'readwrite');
      const store = tx.objectStore(IDB_STORE_NAME);
      store.put({ key, value, updatedAt: Date.now() });
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    } catch (e) {
      resolve(false);
    }
  });
}

function idbGet(key) {
  if (!dndIndexedDB) {
    if (typeof window !== 'undefined' && window.indexedDB && !isIdbInitialized) {
      return initIndexedDB().then(db => {
        if (!db) return null;
        return idbGet(key);
      });
    }
    return Promise.resolve(null);
  }
  return new Promise((resolve) => {
    try {
      const tx = dndIndexedDB.transaction(IDB_STORE_NAME, 'readonly');
      const store = tx.objectStore(IDB_STORE_NAME);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result ? req.result.value : null);
      req.onerror = () => resolve(null);
    } catch (e) {
      resolve(null);
    }
  });
}

async function checkAndRestoreFromIndexedDB() {
  try {
    const db = await initIndexedDB();
    if (!db) return false;

    // Se PLAYERS local já contém heróis reais (não apenas mocks p1..p5 vazios), apenas espelha no IDB
    const hasCustomLocalPlayers = (typeof PLAYERS !== 'undefined' && Array.isArray(PLAYERS) && PLAYERS.length > 0 && PLAYERS.some(p => !['p1','p2','p3','p4','p5'].includes(p.id)));

    if (!hasCustomLocalPlayers) {
      // Tenta recuperar do cofre IndexedDB
      const idbPayload = await idbGet(STORAGE_KEY);
      const idbSnap = await idbGet('dnd5e_prisco_safety_snapshot_latest');
      const candidate = (idbPayload && idbPayload.players && idbPayload.players.length > 0)
        ? idbPayload
        : (idbSnap && idbSnap.players && idbSnap.players.length > 0 ? idbSnap : null);

      if (candidate && Array.isArray(candidate.players) && candidate.players.length > 0) {
        PLAYERS = candidate.players.map(p => {
          if (!p.skillProficiencies) p.skillProficiencies = [];
          if (!p.saveProficiencies) p.saveProficiencies = [];
          if (!p.actionLogs) p.actionLogs = [];
          if (p.playerNotes === undefined) p.playerNotes = '';
          return p;
        });

        if (candidate.state && Array.isArray(candidate.state.combatants)) {
          state = candidate.state;
        }

        if (candidate.campaignsState && typeof CAMPAIGNS_STATE !== 'undefined') {
          CAMPAIGNS_STATE = candidate.campaignsState;
          if (typeof saveCampaignsState === 'function') saveCampaignsState();
          if (typeof renderCampaigns === 'function') renderCampaigns();
        }

        saveToLocalStorage();
        if (typeof renderPlayers === 'function') renderPlayers();
        if (typeof renderCombat === 'function') renderCombat();
        if (typeof showToast === 'function') {
          showToast(`🛡️ ${PLAYERS.length} ficha(s) restaurada(s) do Cofre IndexedDB com sucesso!`, 'success');
        }
        return true;
      }
    } else {
      // Espelha estado atual robusto no IDB
      if (typeof PLAYERS !== 'undefined') {
        idbSet('dnd_tracker_players_v3', PLAYERS);
        idbSet(STORAGE_KEY, {
          state,
          players: PLAYERS,
          gridState: (typeof gridState !== 'undefined' ? gridState : null),
          campaignsState: (typeof CAMPAIGNS_STATE !== 'undefined' ? CAMPAIGNS_STATE : null)
        });
        if (typeof CAMPAIGNS_STATE !== 'undefined') {
          idbSet('dnd5e_prisco_campaigns_v1', CAMPAIGNS_STATE);
          idbSet('dnd_tracker_campaigns_v1', CAMPAIGNS_STATE);
        }
      }
    }

    // Auto-restaura PIN se ausente no localStorage
    if (typeof localStorage !== 'undefined' && !localStorage.getItem(MASTER_PIN_KEY)) {
      const idbPin = await idbGet(MASTER_PIN_KEY);
      if (idbPin && typeof idbPin === 'string' && idbPin.trim().length === 4) {
        localStorage.setItem(MASTER_PIN_KEY, idbPin.trim());
      }
    }
  } catch (err) {
    console.warn('⚠️ Erro na checagem do cofre IndexedDB:', err);
  }
  return false;
}

// --- LOCAL STORAGE AUTO-SAVE ---
const STORAGE_KEY = 'dnd5e_prisco_sheet_state_v2';
let lastSafetySnapshotTime = 0;
let isStorageLoaded = false;

function saveToLocalStorage() {
  try {
    // Proteção essencial: Nunca sobrescreva o localStorage com valores default da memória
    // antes de tentar carregar os dados salvos existentes
    if (!isStorageLoaded) {
      loadFromLocalStorage();
    }

    const isPlayer = (typeof clientRole !== 'undefined' && clientRole === 'player') || 
      (typeof document !== 'undefined' && document.body && document.body.classList.contains('mode-player-portal')) ||
      (typeof activePortalPlayerId !== 'undefined' && !!activePortalPlayerId);

    let payload;
    if (isPlayer) {
      // Cliente jogador: preserva o combate e grid existentes para não corromper a mesa do Mestre
      try {
        const existingRaw = localStorage.getItem(STORAGE_KEY);
        const existingParsed = existingRaw ? JSON.parse(existingRaw) : {};
        payload = {
          state: (existingParsed.state && Array.isArray(existingParsed.state.combatants) && existingParsed.state.combatants.length > 0) ? existingParsed.state : state,
          players: PLAYERS,
          gridState: existingParsed.gridState || (typeof gridState !== 'undefined' ? gridState : null),
          campaignsState: existingParsed.campaignsState || (typeof CAMPAIGNS_STATE !== 'undefined' ? CAMPAIGNS_STATE : null)
        };
      } catch(e) {
        payload = {
          state,
          players: PLAYERS,
          gridState: (typeof gridState !== 'undefined' ? gridState : null),
          campaignsState: (typeof CAMPAIGNS_STATE !== 'undefined' ? CAMPAIGNS_STATE : null)
        };
      }
    } else {
      payload = {
        state,
        players: PLAYERS,
        gridState: (typeof gridState !== 'undefined' ? gridState : null),
        campaignsState: (typeof CAMPAIGNS_STATE !== 'undefined' ? CAMPAIGNS_STATE : null)
      };
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));

    // Sincroniza chaves de compatibilidade v3
    try {
      localStorage.setItem('dnd_tracker_players_v3', JSON.stringify(PLAYERS));
      if (!isPlayer) {
        localStorage.setItem('dnd_tracker_state_v3', JSON.stringify(state));
      }
    } catch (e) {}

    // Espelhamento assíncrono redundante no Cofre IndexedDB
    try {
      if (typeof idbSet === 'function') {
        idbSet(STORAGE_KEY, payload);
        idbSet('dnd_tracker_players_v3', PLAYERS);
        if (!isPlayer) {
          idbSet('dnd_tracker_state_v3', state);
        }
        if (typeof CAMPAIGNS_STATE !== 'undefined') {
          idbSet('dnd5e_prisco_campaigns_v1', CAMPAIGNS_STATE);
          idbSet('dnd_tracker_campaigns_v1', CAMPAIGNS_STATE);
        }
      }
    } catch (e) {}

    if (typeof saveCampaignsState === 'function') saveCampaignsState();
    if (typeof syncLocalChangesToFirebase === 'function') syncLocalChangesToFirebase();
    if (typeof broadcastStateSync === 'function') broadcastStateSync();

    // Snapshot periódico de segurança a cada 5 minutos de atividade
    const now = Date.now();
    if (now - lastSafetySnapshotTime > 5 * 60 * 1000) {
      lastSafetySnapshotTime = now;
      if (typeof saveSafetySnapshot === 'function') {
        saveSafetySnapshot('Backup Automático de Sessão');
      }
    }

    showSaveStatus();
  } catch (e) {
    console.warn('Erro ao salvar no localStorage:', e);
  }
}

function saveGridStatePermanently() {
  saveToLocalStorage();
  try {
    if (typeof gridState !== 'undefined') {
      localStorage.setItem('dnd5e_prisco_live_grid', JSON.stringify(gridState));
      localStorage.setItem('dnd_tracker_grid_v3', JSON.stringify(gridState));
    }
  } catch (e) {}
  if (typeof broadcastGridState === 'function') broadcastGridState();
  if (typeof playFX === 'function') playFX('crit');
  if (typeof addLog === 'function') addLog(`💾 <b>Grid de Batalha:</b> Mapa e posições dos combatentes foram salvos com sucesso!`);
  alert('Mapa e posições salvos com sucesso!');
}

function loadFromLocalStorage() {
  isStorageLoaded = true;
  try {
    if (typeof loadCampaignsState === 'function') loadCampaignsState();
    
    let loadedPlayers = null;
    let loadedState = null;
    let loadedGrid = null;
    let loadedFromFallback = false;

    // 1. Tenta carregar da chave principal v2
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const data = JSON.parse(raw);
        if (data && data.players && Array.isArray(data.players) && data.players.length > 0) {
          const onlyOldMocks = data.players.every(p => ['p1','p2','p3','p4','p5'].includes(p.id));
          if (!onlyOldMocks) loadedPlayers = data.players;
        }
        if (data && data.state && Array.isArray(data.state.combatants)) {
          const onlyOldCombat = data.state.combatants.every(c => ['c1','c2','c3'].includes(c.id));
          if (!onlyOldCombat) loadedState = data.state;
        }
        if (data && data.gridState) {
          loadedGrid = data.gridState;
        }
      } catch (e) {}
    }

    // 2. Fallback: Se não encontrou jogadores na chave v2, busca na chave v3 legada (dnd_tracker_players_v3)
    if (!loadedPlayers) {
      try {
        const rawPlayersV3 = localStorage.getItem('dnd_tracker_players_v3');
        if (rawPlayersV3) {
          const list = JSON.parse(rawPlayersV3);
          if (Array.isArray(list) && list.length > 0 && !list.every(p => ['p1','p2','p3','p4','p5'].includes(p.id))) {
            loadedPlayers = list;
            loadedFromFallback = true;
          }
        }
      } catch (e) {}
    }

    // 3. Fallback: Se não encontrou jogadores, busca no último snapshot de segurança
    if (!loadedPlayers) {
      try {
        const rawSnapLatest = localStorage.getItem('dnd5e_prisco_safety_snapshot_latest');
        if (rawSnapLatest) {
          const snap = JSON.parse(rawSnapLatest);
          if (snap && snap.players && Array.isArray(snap.players) && snap.players.length > 0) {
            loadedPlayers = snap.players;
            if (!loadedState && snap.state) loadedState = snap.state;
            if (!loadedGrid && snap.gridState) loadedGrid = snap.gridState;
            loadedFromFallback = true;
          }
        }
      } catch (e) {}
    }

    if (!loadedPlayers) {
      try {
        const rawHistory = localStorage.getItem(SAFETY_SNAPSHOTS_KEY);
        if (rawHistory) {
          const historyList = JSON.parse(rawHistory);
          if (Array.isArray(historyList) && historyList.length > 0) {
            for (const snap of historyList) {
              if (snap && snap.players && Array.isArray(snap.players) && snap.players.length > 0) {
                loadedPlayers = snap.players;
                if (!loadedState && snap.state) loadedState = snap.state;
                if (!loadedGrid && snap.gridState) loadedGrid = snap.gridState;
                loadedFromFallback = true;
                break;
              }
            }
          }
        }
      } catch (e) {}
    }

    // 4. Fallback: Chave v1
    if (!loadedPlayers) {
      try {
        const rawV1 = localStorage.getItem('dnd5e_prisco_sheet_state_v1');
        if (rawV1) {
          const dataV1 = JSON.parse(rawV1);
          if (dataV1 && dataV1.players && Array.isArray(dataV1.players) && dataV1.players.length > 0) {
            loadedPlayers = dataV1.players;
            loadedFromFallback = true;
          }
        }
      } catch (e) {}
    }

    // Aplica os jogadores carregados com auto-migração contra caches locais defasados
    if (loadedPlayers && Array.isArray(loadedPlayers)) {
      const canonicalList = (typeof CANONICAL_INITIAL_PLAYERS !== 'undefined' && Array.isArray(CANONICAL_INITIAL_PLAYERS) && CANONICAL_INITIAL_PLAYERS.length > 0)
        ? CANONICAL_INITIAL_PLAYERS
        : (Array.isArray(PLAYERS) ? PLAYERS : []);
      PLAYERS = loadedPlayers.map(p => {
        if (!p.skillProficiencies) p.skillProficiencies = [];
        if (!p.saveProficiencies) p.saveProficiencies = [];
        if (!p.actionLogs || !Array.isArray(p.actionLogs)) {
          p.actionLogs = [];
        } else {
          // Remove resquícios de testes em logs de alunos
          p.actionLogs = p.actionLogs.filter(log => {
            const txt = (log && log.text) ? log.text : '';
            if (txt.includes('Sofreu 1 de dano') || txt.includes('Sofreu 5 de dano') || txt.includes('Recuperou 1 PV (0 ➔ 1 PV)')) return false;
            if (txt.includes('Subiu de Nível: Mago 2') && (p.level || 1) < 2) return false;
            return true;
          });
        }
        if (p.playerNotes === undefined) p.playerNotes = "";

        // Se o cache local estiver defasado no Nível 1 e canonicamente o herói já evoluiu para Nível superior
        const canonical = canonicalList.find(c => c.id === p.id || (c.name && p.name && c.name.toLowerCase() === p.name.toLowerCase()));
        if (canonical && (canonical.level || 1) > (p.level || 1)) {
          return Object.assign({}, canonical, p, {
            level: canonical.level,
            maxHp: Math.max(canonical.maxHp || 1, p.maxHp || 1),
            hp: (p.hp && p.hp > 0) ? Math.min(canonical.maxHp, Math.max(p.hp, canonical.maxHp)) : canonical.maxHp,
            className: canonical.className,
            slots: canonical.slots || p.slots,
            spells: canonical.spells || p.spells,
            features: canonical.features || p.features,
            hitDice: canonical.hitDice || p.hitDice
          });
        }
        return p;
      });

      if (typeof calculatePlayerAcFromEquipment === 'function') {
        PLAYERS.forEach(p => {
          if (!p.ac) p.ac = calculatePlayerAcFromEquipment(p);
        });
      }
    }

    // Se state foi carregado ou busca em dnd_tracker_state_v3
    if (loadedState && Array.isArray(loadedState.combatants)) {
      state = loadedState;
    } else {
      try {
        const rawStateV3 = localStorage.getItem('dnd_tracker_state_v3');
        if (rawStateV3) {
          const sV3 = JSON.parse(rawStateV3);
          if (sV3 && Array.isArray(sV3.combatants)) state = sV3;
        }
      } catch (e) {}
    }

    if (state && Array.isArray(state.logs)) {
      state.logs = state.logs.filter(l => {
        const txt = (l && l.text) ? l.text : '';
        return !txt.includes('Valerius Martelo Negro');
      });
    }

    // Garante que combatentes de jogadores no state reflitam o PV e maxHp reais
    if (state && Array.isArray(state.combatants)) {
      state.combatants.forEach(comb => {
        if (comb.type === 'player') {
          const matched = PLAYERS.find(p => (comb.playerId && comb.playerId === p.id) || p.id === comb.id || (comb.name && p.name && comb.name.includes(p.name)));
          if (matched && matched.maxHp && (comb.maxHp || 0) < matched.maxHp) {
            comb.maxHp = matched.maxHp;
            comb.hp = matched.maxHp;
          }
        }
      });
    }

    if (loadedGrid && typeof gridState !== 'undefined') {
      gridState = loadedGrid;
    }

    // Se recuperou de fallback, persiste no formato atual v2
    if (loadedFromFallback) {
      saveToLocalStorage();
    }
    return true;
  } catch (e) {
    return false;
  }
}

function showSaveStatus() {
  const el = document.getElementById('save-status');
  if (!el) return;
  el.style.opacity = '1';
  el.innerText = '💾 Salvo';
  if (typeof setTimeout !== 'undefined') {
    setTimeout(() => { if (el) el.style.opacity = '0.7'; }, 1000);
  }
}

function normalizeStr(str) {
  return (str || '')
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

// --- NAVEGAÇÃO ENTRE ABAS ---
const PLAYER_ALLOWED_TABS = ['players', 'spells', 'equipment', 'classes', 'species'];

function switchTab(tabId) {
  const isPortalMode = (typeof document !== 'undefined' && document.body && document.body.classList.contains('mode-player-portal')) || (typeof activePortalPlayerId !== 'undefined' && !!activePortalPlayerId);

  // Trava de segurança: jogadores em modo portal só acessam suas fichas e compêndios
  if (isPortalMode && !PLAYER_ALLOWED_TABS.includes(tabId)) {
    tabId = 'players';
  }

  if (!isPortalMode && typeof localStorage !== 'undefined' && tabId) {
    try {
      localStorage.setItem('dnd5e_active_tab', tabId);
    } catch(e) {}
  }

  document.querySelectorAll('.tab-pane').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.portal-nav-btn').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.portal-chip').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.drawer-item').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.dropdown-item').forEach(el => el.classList.remove('active'));

  const targetPane = document.getElementById('tab-' + tabId);
  if (targetPane) targetPane.classList.add('active');

  const activeBtn = Array.from(document.querySelectorAll('.tab-btn, .dropdown-item')).find(b => b.getAttribute('onclick')?.includes(tabId));
  if (activeBtn) {
    activeBtn.classList.add('active');
    const parentDropdown = activeBtn.closest('.nav-dropdown');
    if (parentDropdown) {
      const parentBtn = parentDropdown.querySelector('.nav-dropdown-btn');
      if (parentBtn) parentBtn.classList.add('active');
    }
  }

  const activePortalBtn = document.getElementById('pnav-' + tabId);
  if (activePortalBtn) activePortalBtn.classList.add('active');

  const activeDrawerBtn = document.getElementById('drawer-btn-' + tabId);
  if (activeDrawerBtn) activeDrawerBtn.classList.add('active');

  // Atualiza label contextual do FAB
  const fabTurnLabel = document.getElementById('fab-turn-label');
  if (fabTurnLabel) {
    if (tabId === 'combat') {
      fabTurnLabel.textContent = 'Próximo Turno';
    } else {
      fabTurnLabel.textContent = 'Ir ao Combate';
    }
  }

  // Fecha o drawer automaticamente se estiver aberto
  closeNavDrawer();

  // Fecha qualquer dropdown de navegação aberto
  document.querySelectorAll('.nav-dropdown.open').forEach(d => d.classList.remove('open'));

  if (tabId === 'combat' && typeof renderCombat === 'function') renderCombat();
  else if (tabId === 'players' && typeof renderPlayers === 'function') renderPlayers();
  else if (tabId === 'grid') {
    if (typeof syncCombatantsToGrid === 'function') syncCombatantsToGrid();
    if (typeof renderBattleGrid === 'function') renderBattleGrid();
    if (typeof renderVttCombatHud === 'function') renderVttCombatHud();
    if (typeof fitBattleGridToView === 'function') {
      setTimeout(fitBattleGridToView, 50);
    }
  }
  else if (tabId === 'grid-config') {
    if (typeof renderGridConfig === 'function') renderGridConfig();
  }
  else if (tabId === 'spells' && typeof renderSpells === 'function') {
    if (!renderedTabs['spells']) {
      renderSpells();
      renderedTabs['spells'] = true;
    }
  }
  else if (tabId === 'bestiary' && typeof renderBestiary === 'function') {
    if (!renderedTabs['bestiary']) {
      renderBestiary();
      renderedTabs['bestiary'] = true;
    }
  }
  else if (tabId === 'equipment' && typeof renderEquipment === 'function') {
    if (!renderedTabs['equipment']) {
      renderEquipment();
      renderedTabs['equipment'] = true;
    }
  }
  else if (tabId === 'classes' && typeof renderClasses === 'function') {
    if (!renderedTabs['classes']) {
      renderClasses();
      renderedTabs['classes'] = true;
    }
  }
  else if (tabId === 'species' && typeof renderSpecies === 'function') {
    if (!renderedTabs['species']) {
      renderSpecies();
      renderedTabs['species'] = true;
    }
  }
  else if (tabId === 'campaigns' && typeof renderCampaigns === 'function') renderCampaigns();
}

// --- TOGGLE DE DROPDOWNS DO CABEÇALHO (COMPÊNDIO, MESTRE, MAIS) ---
function toggleNavDropdown(btn, event) {
  if (event && event.stopPropagation) event.stopPropagation();
  const parent = (btn && typeof btn.closest === 'function')
    ? btn.closest('.nav-dropdown')
    : (btn && btn.parentElement ? btn.parentElement : null);
  if (!parent || !parent.classList) return;
  const isOpen = parent.classList.contains('open');
  document.querySelectorAll('.nav-dropdown').forEach(d => {
    if (d !== parent) d.classList.remove('open');
  });
  if (isOpen) {
    parent.classList.remove('open');
  } else {
    parent.classList.add('open');
  }
}

// Fechamento automático de dropdowns de navegação ao clicar fora
if (typeof document !== 'undefined' && typeof document.addEventListener === 'function') {
  document.addEventListener('click', (e) => {
    if (!e.target || typeof e.target.closest !== 'function') return;
    if (!e.target.closest('.nav-dropdown')) {
      document.querySelectorAll('.nav-dropdown.open').forEach(d => d.classList.remove('open'));
    }
  });
}

// Expor globalmente para chamadas inline no HTML
if (typeof window !== 'undefined') {
  window.toggleNavDropdown = toggleNavDropdown;
}

// --- SISTEMA DE NOTIFICAÇÕES TOAST ---
function showToast(message, type = 'info', duration = 3000) {
  if (typeof document === 'undefined' || typeof document.createElement !== 'function') return null;
  let container = typeof document.getElementById === 'function' ? document.getElementById('toast-container') : null;
  if (!container && document.body) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.setAttribute('aria-live', 'polite');
    if (document.body && typeof document.body.appendChild === 'function') {
      document.body.appendChild(container);
    }
  }
  if (!container || typeof container.appendChild !== 'function') return null;

  const toast = document.createElement('div');
  toast.className = `toast-notification toast-${type}`;

  const iconMap = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };
  const icon = iconMap[type] || 'ℹ️';

  toast.innerHTML = `
    <div class="toast-content">
      <span class="toast-icon">${icon}</span>
      <span class="toast-msg">${message}</span>
    </div>
    <button class="toast-close" title="Fechar">✕</button>
  `;

  container.appendChild(toast);

  let timer = setTimeout(() => {
    toast.classList.add('hide');
    setTimeout(() => {
      if (toast.parentElement) toast.remove();
    }, 250);
  }, duration);

  const closeBtn = toast.querySelector('.toast-close');
  if (closeBtn) {
    closeBtn.onclick = () => {
      clearTimeout(timer);
      toast.classList.add('hide');
      setTimeout(() => {
        if (toast.parentElement) toast.remove();
      }, 250);
    };
  }

  return toast;
}

// --- DRAWER LATERAL DE NAVEGAÇÃO ---
function toggleNavDrawer() {
  if (typeof document === 'undefined' || !document.getElementById) return;
  const drawer = document.getElementById('nav-drawer');
  if (!drawer || !drawer.classList) return;
  if (drawer.classList.contains('open')) {
    closeNavDrawer();
  } else {
    openNavDrawer();
  }
}

function openNavDrawer() {
  if (typeof document === 'undefined' || !document.getElementById) return;
  const drawer = document.getElementById('nav-drawer');
  const backdrop = document.getElementById('nav-drawer-backdrop');
  if (!drawer) return;
  if (drawer.classList) drawer.classList.add('open');
  if (backdrop && backdrop.classList) backdrop.classList.add('open');
  if (document.body && document.body.style) {
    document.body.style.overflow = 'hidden';
  }
  updateDrawerBadges();
}

function closeNavDrawer() {
  if (typeof document === 'undefined' || !document.getElementById) return;
  const drawer = document.getElementById('nav-drawer');
  const backdrop = document.getElementById('nav-drawer-backdrop');
  if (drawer && drawer.classList) drawer.classList.remove('open');
  if (backdrop && backdrop.classList) backdrop.classList.remove('open');
  if (document.body && document.body.style) {
    document.body.style.overflow = '';
  }
}

function updateDrawerBadges() {
  if (typeof document === 'undefined' || !document.getElementById) return;
  const pairs = [
    ['cnt-players', 'drawer-cnt-players'],
    ['cnt-bestiary', 'drawer-cnt-bestiary'],
    ['cnt-spells', 'drawer-cnt-spells'],
    ['cnt-equip', 'drawer-cnt-equip']
  ];
  for (const [srcId, dstId] of pairs) {
    const src = document.getElementById(srcId);
    const dst = document.getElementById(dstId);
    if (src && dst) dst.textContent = src.textContent;
  }
}

// --- FAB SPEED DIAL ---
function toggleFabMenu() {
  if (typeof document === 'undefined' || !document.getElementById) return;
  const fab = document.getElementById('fab-speed-dial');
  if (!fab || !fab.classList) return;
  fab.classList.toggle('open');
}

function openFabMenu() {
  if (typeof document === 'undefined' || !document.getElementById) return;
  const fab = document.getElementById('fab-speed-dial');
  if (fab && fab.classList) fab.classList.add('open');
}

function closeFabMenu() {
  if (typeof document === 'undefined' || !document.getElementById) return;
  const fab = document.getElementById('fab-speed-dial');
  if (fab && fab.classList) fab.classList.remove('open');
}

function handleFabQuickAction(action) {
  closeFabMenu();
  if (action === 'dice') {
    if (typeof openDiceModal === 'function') openDiceModal();
  } else if (action === 'turn') {
    const activeCombatTab = document.getElementById('tab-combat')?.classList.contains('active');
    if (activeCombatTab && typeof nextTurn === 'function') {
      nextTurn();
    } else {
      switchTab('combat');
    }
  } else if (action === 'players') {
    switchTab('players');
  } else if (action === 'dmscreen') {
    const isPortalMode = (typeof document !== 'undefined' && document.body && document.body.classList.contains('mode-player-portal')) || (typeof activePortalPlayerId !== 'undefined' && !!activePortalPlayerId);
    if (isPortalMode && typeof openPartyStashModal === 'function') {
      openPartyStashModal();
    } else {
      switchTab('dmscreen');
    }
  } else if (action === 'notes') {
    if (typeof toggleDMNotesDrawer === 'function') toggleDMNotesDrawer();
  } else if (action === 'login') {
    if (typeof openPlayerLoginModal === 'function') openPlayerLoginModal();
  } else if (action === 'cloud') {
    if (typeof openFirebaseModal === 'function') openFirebaseModal();
  }
}

// --- CONTROLES DE COMBATE & MODO FOCO (CLEAN UI) ---
function toggleCombatOptionsDropdown(e) {
  if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
  const menu = document.getElementById('combat-options-menu');
  if (!menu) return;
  const parent = menu.closest('.combat-dropdown');
  const controlsBar = menu.closest('.controls-bar');
  if (parent) {
    const isOpen = parent.classList.toggle('open');
    if (controlsBar) controlsBar.classList.toggle('has-open-dropdown', isOpen);
  }
}

function closeCombatOptionsDropdown() {
  if (typeof document === 'undefined') return;
  const menus = document.querySelectorAll('.combat-dropdown.open');
  menus.forEach(m => m.classList.remove('open'));
  const bars = document.querySelectorAll('.controls-bar.has-open-dropdown');
  bars.forEach(b => b.classList.remove('has-open-dropdown'));
}

function toggleCombatFocusMode() {
  if (typeof document === 'undefined') return;
  const grid = document.querySelector('.grid-3col');
  const btn = document.getElementById('btn-toggle-combat-focus');
  const lbl = document.getElementById('lbl-toggle-focus');
  if (!grid) return;
  const isFocus = grid.classList.toggle('focus-mode');
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('dnd_combat_focus_mode', isFocus ? 'true' : 'false');
    }
  } catch (err) {}
  if (btn) {
    btn.classList.toggle('active', isFocus);
  }
  if (lbl) {
    lbl.textContent = isFocus ? '👁️ Exibir Painel' : '👁️ Modo Foco';
  }
  if (typeof showToast === 'function') {
    showToast(isFocus ? '👁️ Modo Foco Ativado (Histórico Oculto)' : '👁️ Painel Completo Visível', 'info');
  }
}

function initCombatFocusMode() {
  if (typeof localStorage === 'undefined' || typeof document === 'undefined') return;
  try {
    const saved = localStorage.getItem('dnd_combat_focus_mode');
    if (saved === 'true') {
      const grid = document.querySelector('.grid-3col');
      const btn = document.getElementById('btn-toggle-combat-focus');
      const lbl = document.getElementById('lbl-toggle-focus');
      if (grid) grid.classList.add('focus-mode');
      if (btn) btn.classList.add('active');
      if (lbl) lbl.textContent = '👁️ Exibir Painel';
    }
  } catch (e) {}
}

// Fechamento de dropdowns ao clicar fora
if (typeof document !== 'undefined') {
  document.addEventListener('click', (e) => {
    if (!e.target || typeof e.target.closest !== 'function') return;
    if (!e.target.closest('.combat-dropdown')) {
      closeCombatOptionsDropdown();
    }
    if (!e.target.closest('.nav-dropdown')) {
      document.querySelectorAll('.nav-dropdown.open').forEach(d => d.classList.remove('open'));
    }
  });
}

// --- NAVEGAÇÃO POR GESTOS DE SWIPE (COM BLINDAGEM DO VTT GRID) ---
function initSwipeNavigation() {
  if (typeof document === 'undefined') return;

  let touchStartX = 0;
  let touchStartY = 0;
  let touchStartTime = 0;
  let isSwipeIgnored = false;

  const MASTER_TABS_ORDER = ['combat', 'grid', 'players', 'campaigns', 'bestiary', 'spells', 'equipment', 'classes', 'species', 'dmscreen', 'generators'];
  const PORTAL_TABS_ORDER = ['players', 'spells', 'equipment', 'classes', 'species'];

  document.addEventListener('touchstart', (e) => {
    if (!e.touches || e.touches.length !== 1) {
      isSwipeIgnored = true;
      return;
    }

    // Blindagem de segurança: NUNCA capturar swipes se estiver na aba Grid ou sobre elementos interativos do mapa/formulários/modais
    const gridTab = document.getElementById('tab-grid');
    const isGridActive = gridTab && gridTab.classList.contains('active');

    const target = e.target;
    const isInteractive = target && (
      target.closest('#vtt-container') ||
      target.closest('#grid-canvas') ||
      target.closest('#vtt-hud') ||
      target.closest('.canvas-container') ||
      target.closest('.modal-overlay') ||
      target.closest('.modal-body') ||
      target.closest('input') ||
      target.closest('textarea') ||
      target.closest('select') ||
      target.closest('button') ||
      target.closest('.audio-top-widget') ||
      target.closest('.nav-drawer') ||
      target.closest('.fab-speed-dial-container')
    );

    if (isGridActive || isInteractive) {
      isSwipeIgnored = true;
      return;
    }

    isSwipeIgnored = false;
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    touchStartTime = Date.now();
  }, { passive: true });

  document.addEventListener('touchend', (e) => {
    if (isSwipeIgnored || !e.changedTouches || e.changedTouches.length === 0) return;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    const elapsed = Date.now() - touchStartTime;

    // Apenas se o gesto for rápido (< 650ms), com amplitude horizontal mínima (70px) e predominantemente horizontal
    if (elapsed < 650 && Math.abs(deltaX) > 70 && Math.abs(deltaX) > Math.abs(deltaY) * 1.7) {
      const isPortalMode = (document.body && document.body.classList.contains('mode-player-portal')) || (typeof activePortalPlayerId !== 'undefined' && !!activePortalPlayerId);
      const tabOrder = isPortalMode ? PORTAL_TABS_ORDER : MASTER_TABS_ORDER;

      // Encontrar aba ativa atual
      let currentTabId = 'combat';
      for (const t of tabOrder) {
        const pane = document.getElementById('tab-' + t);
        if (pane && pane.classList.contains('active')) {
          currentTabId = t;
          break;
        }
      }

      const currentIndex = tabOrder.indexOf(currentTabId);
      if (currentIndex === -1) return;

      if (deltaX < 0) {
        // Swipe para a esquerda ➔ Próxima aba
        if (currentIndex < tabOrder.length - 1) {
          const nextTab = tabOrder[currentIndex + 1];
          switchTab(nextTab);
          showToast(`Navegando: ${getTabTitle(nextTab)}`, 'info', 1200);
        }
      } else {
        // Swipe para a direita ➔ Aba anterior
        if (currentIndex > 0) {
          const prevTab = tabOrder[currentIndex - 1];
          switchTab(prevTab);
          showToast(`Navegando: ${getTabTitle(prevTab)}`, 'info', 1200);
        }
      }
    }
  }, { passive: true });

  // Fechamento defensivo com tecla Escape e clique fora do FAB
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeNavDrawer();
      closeFabMenu();
    }
  });

  document.addEventListener('click', (e) => {
    const fab = document.getElementById('fab-speed-dial');
    if (fab && fab.classList.contains('open')) {
      if (!fab.contains(e.target)) {
        closeFabMenu();
      }
    }
  });
}

function getTabTitle(tabId) {
  const map = {
    combat: '⚔️ Combate',
    grid: '🗺️ Mapa VTT',
    players: '👤 Fichas',
    campaigns: '👑 Campanhas',
    bestiary: '🐉 Bestiário',
    spells: '✨ Grimório',
    equipment: '🛡️ Itens',
    classes: '🌳 Classes',
    species: '🧬 Raças',
    dmscreen: '🛡️ Escudo',
    generators: '🎲 Geradores',
    'grid-config': '⚙️ Config. Grid'
  };
  return map[tabId] || tabId;
}

const renderedTabs = {};
function invalidateTabRender(tabId) {
  if (tabId) {
    delete renderedTabs[tabId];
  } else {
    for (const k in renderedTabs) delete renderedTabs[k];
  }
}

function getProfBonus(level) {
  return Math.floor((level - 1) / 4) + 2;
}

function getMod(val) {
  const m = Math.floor((val - 10) / 2);
  return m >= 0 ? `+${m}` : `${m}`;
}

function nextPuzzle() {
  puzzleIdx = (puzzleIdx + 1) % PUZZLES.length;
  const qEl = document.getElementById('lbl-puzzle-q');
  const aEl = document.getElementById('lbl-puzzle-a');
  if (qEl) qEl.innerText = PUZZLES[puzzleIdx].q;
  if (aEl) {
    aEl.innerText = '💡 Solução: ' + PUZZLES[puzzleIdx].a;
    aEl.style.display = 'none';
  }
}

function togglePuzzle() {
  const aEl = document.getElementById('lbl-puzzle-a');
  if (aEl) {
    if (aEl.style.display === 'none' || !aEl.style.display) {
      aEl.style.display = 'block';
    } else {
      aEl.style.display = 'none';
    }
  }
}

function highlightInlineRules(text) {
  if (!text) return '';
  return text
    // Remove marcadores markdown bold e aplica destaque
    .replace(/\*\*(.*?)\*\*/g, '<strong class="hl-keyword">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em style="color:#e2e8f0;">$1</em>')
    // Dados de dano/cura (ex: 1d6, 2d8+3, 1d20)
    .replace(/\b(\d+d\d+(?:\s*[\+\-]\s*\d+)?)\b/gi, '<span class="hl-dice">🎲 $1</span>')
    // Moedas D&D (ex: 50 PO, 100 PL, 5 PC)
    .replace(/\b(\d+[\.,]?\d*\s*(?:PO|PP|PC|PE|PL))\b/g, '<span class="hl-gold">🪙 $1</span>')
    // Distâncias (ex: 9m, 18 metros, 30 ft, 6 quadrados)
    .replace(/\b(\d+(?:[\.,]\d+)?\s*(?:m|metros|ft|pés|quadrados))\b/gi, '<span class="hl-dist">📏 $1</span>')
    // Tempos e Ações (ex: 2 horas, 1 minuto, 1 ação bônus, descanso curto)
    .replace(/\b(\d+\s*(?:horas?|minutos?|segundos?|turnos?|rodadas?|dias?))\b/gi, '<span class="hl-time">⏱️ $1</span>')
    .replace(/\b(Ação Bônus|Ação bônus|Reação|Ação Padrão|Ação Livre|Descanso Curto|Descanso Longo|Ação de Movimento)\b/gi, '<span class="hl-time">⏱️ $1</span>')
    // Círculos de magia (ex: 1º círculo, 2º círculo)
    .replace(/\b(\d+º\s*(?:círculo|circulo|nível|nivel))\b/gi, '<span class="hl-circle">🔮 $1</span>');
}

function getTopicIconForText(text) {
  const t = (text || '').toLowerCase();
  if (t.includes('ouro') || t.includes(' po') || t.includes('custo') || t.includes('gasta') || t.includes('gasto') || t.includes('preço') || t.includes('preco')) return '💰';
  if (t.includes('hora') || t.includes('minuto') || t.includes('descanso') || t.includes('turno') || t.includes('rodada') || t.includes('ação') || t.includes('acao') || t.includes('reação') || t.includes('reacao')) return '⏱️';
  if (t.includes('magia') || t.includes('grimório') || t.includes('grimorio') || t.includes('pergaminho') || t.includes('círculo') || t.includes('circulo') || t.includes('truque') || t.includes('slot') || t.includes('arcano') || t.includes('divin')) return '✨';
  if (t.includes('ataque') || t.includes('dano') || t.includes('arma') || t.includes('acerto') || t.includes('crítico') || t.includes('critico') || t.includes('combate') || t.includes('golpe')) return '⚔️';
  if (t.includes('ca ') || t.includes('armadura') || t.includes('escudo') || t.includes('defesa') || t.includes('resiste') || t.includes('salvaguarda') || t.includes('pv ') || t.includes('vida')) return '🛡️';
  if (t.includes('começa') || t.includes('comeca') || t.includes('ganha') || t.includes('nível') || t.includes('nivel') || t.includes('+') || t.includes('evolu')) return '🎲';
  if (t.includes('metro') || t.includes('distân') || t.includes('distan') || t.includes('alcance') || t.includes('deslocamento') || t.includes('área') || t.includes('area') || t.includes('raio')) return '📏';
  if (t.includes('tomo') || t.includes('livro') || t.includes('estudo') || t.includes('conhecimento') || t.includes('saber')) return '📜';
  return '💡';
}

function formatFeatureToTopics(rawDesc, options = {}) {
  if (!rawDesc) return '<div class="skill-concept-box">Nenhuma descrição disponível.</div>';

  // Normalização do texto
  let cleanDesc = rawDesc.trim();

  // Dividir por quebras de linha ou por marcadores de tópicos
  let rawChunks = [];
  if (cleanDesc.includes('\n') || cleanDesc.includes('•') || cleanDesc.includes('- ')) {
    rawChunks = cleanDesc.split(/(?:\r?\n)+|[•\-]\s+/).map(s => s.trim()).filter(Boolean);
  } else {
    // Tenta dividir por sentenças terminadas em ponto que introduzem novas regras ou cláusulas
    // Ex: "Você possui um tomo arcano contendo suas fórmulas mágicas. Começa com 6 magias de 1º círculo e ganha +2 magias gratuitas a cada novo nível de mago, além de poder copiar qualquer pergaminho ou grimório encontrado gastando 50 PO e 2 horas por círculo de magia."
    const sentences = cleanDesc.split(/(?<=[.!?])\s+(?=[A-ZÀ-Ú0-9"“\*\+])/g).map(s => s.trim()).filter(Boolean);
    
    // Se tiver apenas 1 sentença mas tiver cláusula conectiva forte como ", além de poder " ou ", você também ", separa
    if (sentences.length === 1 && cleanDesc.includes(', além de ')) {
      const parts = cleanDesc.split(/,\s+(?=além de )/i);
      rawChunks = parts.map(p => p.trim()).filter(Boolean);
    } else {
      // Caso uma das sentenças tenha ", além de "
      sentences.forEach(sent => {
        if (sent.includes(', além de ')) {
          const subParts = sent.split(/,\s+(?=além de )/i);
          subParts.forEach(sp => rawChunks.push(sp.trim()));
        } else {
          rawChunks.push(sent);
        }
      });
    }
  }

  if (rawChunks.length === 0) {
    return `<div class="skill-concept-box">${highlightInlineRules(cleanDesc)}</div>`;
  }

  let html = '';
  let startIndex = 0;

  // Se tiver 2 ou mais partes, a primeira serve como Conceito Geral se for puramente descritiva
  if (rawChunks.length > 1) {
    const firstChunk = rawChunks[0];
    const isConcept = !firstChunk.toLowerCase().startsWith('começa') && 
                      !firstChunk.toLowerCase().startsWith('ganha') && 
                      !firstChunk.toLowerCase().startsWith('custo');
    if (isConcept) {
      html += `<div class="skill-concept-box">${highlightInlineRules(firstChunk)}</div>`;
      startIndex = 1;
    }
  }

  html += '<div class="skill-topics-list">';
  for (let i = startIndex; i < rawChunks.length; i++) {
    const chunk = rawChunks[i];
    if (!chunk) continue;
    const icon = getTopicIconForText(chunk);
    const formatted = highlightInlineRules(chunk);
    html += `
      <div class="skill-topic-card">
        <div class="skill-topic-icon">${icon}</div>
        <div class="skill-topic-content">${formatted}</div>
      </div>
    `;
  }
  html += '</div>';

  return html;
}

// --- SISTEMA DE BACKUP, SNAPSHOTS DE SEGURANÇA & RESTAURAÇÃO TOTAL (JSON) ---
const SAFETY_SNAPSHOTS_KEY = 'dnd5e_safety_snapshots_history_v1';

function saveSafetySnapshot(reason = 'Backup Automático') {
  try {
    const now = new Date();
    const dateStr = now.toLocaleDateString('pt-BR') + ' ' + now.toLocaleTimeString('pt-BR');
    const snapshot = {
      id: 'snap_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      timestamp: Date.now(),
      dateStr: dateStr,
      reason: reason,
      playersCount: (typeof PLAYERS !== 'undefined' && Array.isArray(PLAYERS)) ? PLAYERS.length : 0,
      players: (typeof PLAYERS !== 'undefined' && Array.isArray(PLAYERS)) ? JSON.parse(JSON.stringify(PLAYERS)) : [],
      state: (typeof state !== 'undefined') ? JSON.parse(JSON.stringify(state)) : null,
      gridState: (typeof gridState !== 'undefined') ? JSON.parse(JSON.stringify(gridState)) : null,
      campaignsState: (typeof CAMPAIGNS_STATE !== 'undefined') ? JSON.parse(JSON.stringify(CAMPAIGNS_STATE)) : null,
      dmNotes: (typeof localStorage !== 'undefined') ? (localStorage.getItem('dnd_tracker_dm_notes_v3') || '') : ''
    };

    let history = [];
    try {
      const raw = localStorage.getItem(SAFETY_SNAPSHOTS_KEY);
      if (raw) history = JSON.parse(raw);
    } catch (e) {}

    // Mantém os últimos 15 snapshots
    history.unshift(snapshot);
    if (history.length > 15) history = history.slice(0, 15);

    localStorage.setItem(SAFETY_SNAPSHOTS_KEY, JSON.stringify(history));
    localStorage.setItem('dnd5e_prisco_safety_snapshot_latest', JSON.stringify(snapshot));

    // Espelhamento no Cofre IndexedDB
    try {
      if (typeof idbSet === 'function') {
        idbSet(SAFETY_SNAPSHOTS_KEY, history);
        idbSet('dnd5e_prisco_safety_snapshot_latest', snapshot);
      }
    } catch (e) {}

    return true;
  } catch (e) {
    console.warn('Erro ao salvar snapshot de segurança:', e);
    return false;
  }
}

function getSafetySnapshots() {
  try {
    const raw = localStorage.getItem(SAFETY_SNAPSHOTS_KEY);
    if (raw) {
      const list = JSON.parse(raw);
      if (Array.isArray(list)) return list;
    }
  } catch (e) {}
  return [];
}

function restoreSafetySnapshot(snapshotId) {
  const list = getSafetySnapshots();
  const target = list.find(s => s.id === snapshotId);
  if (!target) {
    alert('Ponto de restauração não encontrado.');
    return false;
  }

  const pCount = target.playersCount || (target.players ? target.players.length : 0);
  if (confirm(`Deseja restaurar o backup de "${target.dateStr}" (${target.reason})?\nContém: ${pCount} ficha(s).\nIsso atualizará a planilha com os dados salvos neste ponto.`)) {
    // Salva snapshot de segurança do estado atual antes de reverter
    saveSafetySnapshot('Antes de reverter para ponto de restauração');

    if (target.players && Array.isArray(target.players)) {
      PLAYERS = target.players.map(p => {
        if (!p.skillProficiencies) p.skillProficiencies = [];
        if (!p.saveProficiencies) p.saveProficiencies = [];
        if (!p.actionLogs) p.actionLogs = [];
        if (p.playerNotes === undefined) p.playerNotes = '';
        return p;
      });
    }

    if (target.state && Array.isArray(target.state.combatants)) {
      state = target.state;
    }

    if (target.gridState && typeof gridState !== 'undefined') {
      gridState = target.gridState;
    }

    if (target.campaignsState && typeof CAMPAIGNS_STATE !== 'undefined') {
      CAMPAIGNS_STATE = target.campaignsState;
      if (typeof saveCampaignsState === 'function') saveCampaignsState();
    }

    if (target.dmNotes && typeof localStorage !== 'undefined') {
      localStorage.setItem('dnd_tracker_dm_notes_v3', target.dmNotes);
      const notesTextarea = document.getElementById('inp-dm-quick-notes');
      if (notesTextarea) notesTextarea.value = target.dmNotes;
    }

    saveToLocalStorage();
    if (typeof renderPlayers === 'function') renderPlayers();
    if (typeof renderCombat === 'function') renderCombat();
    if (typeof renderBattleGrid === 'function') renderBattleGrid();
    if (typeof renderCampaigns === 'function') renderCampaigns();
    if (typeof broadcastGridState === 'function') broadcastGridState();

    if (typeof playFX === 'function') playFX('crit');
    if (typeof addLog === 'function') {
      addLog(`🛡️ <b>Backup Restaurado:</b> Dados recuperados com sucesso do ponto de [${target.dateStr}]!`);
    }

    closeSnapshotsModal();
    alert(`Backup restaurado com sucesso! (${pCount} fichas recuperadas)`);
    return true;
  }
  return false;
}

function openSnapshotsModal() {
  const modal = document.getElementById('modal-safety-snapshots');
  if (modal) {
    renderSnapshotsModal();
    modal.classList.add('active');
  }
}

function closeSnapshotsModal() {
  const modal = document.getElementById('modal-safety-snapshots');
  if (modal) modal.classList.remove('active');
}

function renderSnapshotsModal() {
  const container = document.getElementById('snapshots-list-container');
  if (!container) return;

  const list = getSafetySnapshots();
  if (list.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 25px 15px; color: var(--text-muted);">
        <div style="font-size: 32px; margin-bottom: 8px;">🛡️</div>
        <div style="font-size: 13px; font-weight: 700; color: #cbd5e1;">Nenhum Ponto de Restauração Automático Encontrado</div>
        <div style="font-size: 11px; margin-top: 4px;">Os snapshots são criados automaticamente sempre que você edita fichas ou antes de sincronizações com a nuvem.</div>
      </div>
    `;
    return;
  }

  container.innerHTML = list.map((snap, idx) => {
    const pCount = snap.playersCount || (snap.players ? snap.players.length : 0);
    const pNames = snap.players ? snap.players.slice(0, 3).map(p => p.name || p.student).join(', ') + (snap.players.length > 3 ? '...' : '') : 'Nenhuma ficha';
    const cCount = snap.campaignsState && snap.campaignsState.campaigns ? snap.campaignsState.campaigns.length : 0;
    const isLatest = idx === 0;

    return `
      <div style="background: ${isLatest ? 'rgba(59, 130, 246, 0.1)' : 'rgba(0,0,0,0.25)'}; border: 1px solid ${isLatest ? 'var(--primary)' : 'var(--border-color)'}; border-radius: 8px; padding: 10px 12px; display: flex; justify-content: space-between; align-items: center; gap: 12px;">
        <div style="flex: 1;">
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="font-weight: 800; font-size: 13px; color: #fff;">📅 ${snap.dateStr}</span>
            ${isLatest ? '<span class="badge badge-lvl" style="font-size: 9px; padding: 1px 6px;">Mais Recente</span>' : ''}
          </div>
          <div style="font-size: 11px; color: var(--primary-light); margin-top: 2px;">
            Motivo: <strong>${snap.reason || 'Backup Automático'}</strong>
          </div>
          <div style="font-size: 10px; color: var(--text-muted); margin-top: 2px;">
            👥 ${pCount} Fichas (${pNames}) • 👑 ${cCount} Campanhas/Mesas
          </div>
        </div>
        <div>
          <button class="btn-action" style="font-size: 11px; padding: 6px 12px; white-space: nowrap;" onclick="restoreSafetySnapshot('${snap.id}')">
            🔄 Restaurar Este
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function exportCompleteBackupJson() {
  try {
    const backupData = {
      appName: 'Planilha RPG D&D 5E Assistant & VTT',
      version: '3.8',
      exportDate: new Date().toISOString(),
      players: typeof PLAYERS !== 'undefined' ? PLAYERS : [],
      combatState: typeof state !== 'undefined' ? state : { round: 1, turnIndex: 0, combatants: [] },
      gridState: typeof gridState !== 'undefined' ? gridState : null,
      scenesState: typeof scenesState !== 'undefined' ? scenesState : null,
      campaignsState: typeof CAMPAIGNS_STATE !== 'undefined' ? CAMPAIGNS_STATE : (typeof campaignsState !== 'undefined' ? campaignsState : null),
      dmNotes: typeof localStorage !== 'undefined' ? localStorage.getItem('dnd_tracker_dm_notes_v3') || '' : '',
      customMonsters: typeof CUSTOM_MONSTERS !== 'undefined' ? CUSTOM_MONSTERS : [],
      customSpells: typeof CUSTOM_SPELLS !== 'undefined' ? CUSTOM_SPELLS : [],
      customEquipment: typeof CUSTOM_EQUIPMENT !== 'undefined' ? CUSTOM_EQUIPMENT : []
    };

    const jsonStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const now = new Date();
    const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
    const filename = `backup_rpg_dnd5e_${dateStr}.json`;

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    if (typeof playFX === 'function') playFX('heal');
    if (typeof addLog === 'function') {
      addLog(`💾 <b>Backup Concluído:</b> Todos os dados do RPG (Fichas, Mesas e Campanhas) foram salvos no arquivo [${filename}]!`);
    }
  } catch (e) {
    console.error('Erro ao exportar backup:', e);
    alert('Erro ao gerar arquivo de backup: ' + e.message);
  }
}

function exportData() {
  exportCompleteBackupJson();
}

function importBackupJson() {
  const inp = document.getElementById('inp-import-backup');
  if (inp) {
    inp.value = '';
    inp.click();
  } else {
    alert('Elemento de importação de arquivo não encontrado.');
  }
}

function importData() {
  importBackupJson();
}

function handleBackupFileSelected(input) {
  if (!input || !input.files || input.files.length === 0) return;
  const file = input.files[0];

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const raw = e.target.result;
      const data = JSON.parse(raw);

      if (!data || typeof data !== 'object') {
        throw new Error('Arquivo JSON inválido ou vazio.');
      }

      // Validação de estrutura mínima
      const hasPlayers = Array.isArray(data.players) || Array.isArray(data.PLAYERS);
      const hasCombat = data.combatState || data.state;
      const hasGrid = data.gridState || data.scenesState;
      const hasCampaigns = data.campaignsState || data.campaigns || data.CAMPAIGNS_STATE;

      if (!hasPlayers && !hasCombat && !hasGrid && !hasCampaigns) {
        throw new Error('O arquivo não contém dados reconhecidos da Planilha RPG.');
      }

      if (confirm(`Deseja restaurar o backup de "${file.name}" gerado em ${data.exportDate || 'data desconhecida'}? Isso atualizará fichas, mesas de campanhas, combate, mapa e notas.`)) {
        // Salva snapshot de segurança antes de sobrescrever com o arquivo
        saveSafetySnapshot(`Antes de importar arquivo ${file.name}`);

        // Restaura jogadores
        if (hasPlayers) {
          const importedPlayers = data.players || data.PLAYERS || [];
          PLAYERS = importedPlayers.map(p => {
            if (!p.skillProficiencies) p.skillProficiencies = [];
            if (!p.saveProficiencies) p.saveProficiencies = [];
            if (!p.actionLogs) p.actionLogs = [];
            if (p.playerNotes === undefined) p.playerNotes = '';
            return p;
          });
        }

        // Restaura combate
        if (data.combatState) {
          state = data.combatState;
        } else if (data.state) {
          state = data.state;
        }

        // Restaura grid e cenas
        if (data.gridState && typeof gridState !== 'undefined') {
          gridState = data.gridState;
        }
        if (data.scenesState && typeof scenesState !== 'undefined') {
          scenesState = data.scenesState;
        }

        // Restaura campanhas e mesas
        if (hasCampaigns) {
          const importedCamps = data.campaignsState || data.campaigns || data.CAMPAIGNS_STATE;
          if (typeof CAMPAIGNS_STATE !== 'undefined') {
            CAMPAIGNS_STATE = importedCamps;
            if (typeof saveCampaignsState === 'function') saveCampaignsState();
          }
        }

        // Restaura notas do mestre
        if (data.dmNotes && typeof localStorage !== 'undefined') {
          localStorage.setItem('dnd_tracker_dm_notes_v3', data.dmNotes);
          const notesTextarea = document.getElementById('inp-dm-quick-notes');
          if (notesTextarea) notesTextarea.value = data.dmNotes;
        }

        // Salva e atualiza visual
        saveToLocalStorage();
        if (typeof renderPlayers === 'function') renderPlayers();
        if (typeof renderCombat === 'function') renderCombat();
        if (typeof renderBattleGrid === 'function') renderBattleGrid();
        if (typeof renderCampaigns === 'function') renderCampaigns();
        if (typeof broadcastGridState === 'function') broadcastGridState();

        if (typeof playFX === 'function') playFX('crit');
        if (typeof addLog === 'function') {
          addLog(`📂 <b>Backup Restaurado:</b> Dados carregados com sucesso a partir de [${file.name}]!`);
        }
        alert('Backup carregado e restaurado com sucesso!');
      }
    } catch (err) {
      console.error('Erro ao importar backup:', err);
      alert('Falha ao processar arquivo de backup: ' + err.message);
    }
  };

  reader.readAsText(file);
}

// --- UTILITÁRIOS DE LOOKUP ROBUSTO (COMBATENTE ↔ FICHA DE JOGADOR) ---
function findCombatantForPlayer(p, combatantsList = (typeof state !== 'undefined' && state ? state.combatants : [])) {
  if (!p || !Array.isArray(combatantsList)) return null;
  // 1. Chave primária exata por ID
  let match = combatantsList.find(c => c.playerId && c.playerId === p.id);
  if (match) return match;
  // 2. Correspondência exata por nome com aluno ou nome puro
  match = combatantsList.find(c => c.name === `${p.name} (${p.student})` || c.name === p.name);
  if (match) return match;
  // 3. Fallback defensivo com startsWith ou includes
  match = combatantsList.find(c => c.name && p.name && (c.name.startsWith(p.name + ' ') || c.name.includes(p.name)));
  if (match && typeof console !== 'undefined' && console.warn) {
    console.warn(`[Lookup Warning] Combatente encontrado por includes em vez de playerId: "${match.name}" para ficha "${p.name}" (ID: ${p.id})`);
  }
  return match;
}

function findPlayerForCombatant(c, playersList = (typeof PLAYERS !== 'undefined' ? PLAYERS : [])) {
  if (!c || !Array.isArray(playersList)) return null;
  // 1. Chave primária exata por playerId
  if (c.playerId) {
    const byId = playersList.find(p => p.id === c.playerId);
    if (byId) return byId;
  }
  // 2. Correspondência exata por nome com aluno ou nome puro
  let match = playersList.find(p => c.name === `${p.name} (${p.student})` || c.name === p.name);
  if (match) return match;
  // 3. Fallback defensivo
  match = playersList.find(p => p.name && c.name && (c.name.startsWith(p.name + ' ') || c.name.includes(p.name)));
  if (match && typeof console !== 'undefined' && console.warn) {
    console.warn(`[Lookup Warning] Jogador encontrado por includes em vez de playerId: "${match.name}" para combatente "${c.name}" (playerId: ${c.playerId || 'não definido'})`);
  }
  return match;
}

// ===================================================
// 🔐 SISTEMA DE PROTEÇÃO POR PIN DO MESTRE & CONTROLE DE SESSÃO
// ===================================================

const MASTER_PIN_KEY = 'dnd5e_master_pin';
const MASTER_SESSION_KEY = 'dnd5e_master_session_exp';
const MASTER_ROLE_KEY = 'dnd5e_session_role';
const DEFAULT_MASTER_SESSION_HOURS = 8;
const OFFICIAL_MASTER_PIN = '3276';

let currentPinDigits = '';
let isPinChangeMode = false;
let tempPinConfirmation = '';
let activePinSuccessCb = null;
let activePinCancelCb = null;

function computeSimplePinHash(str) {
  if (!str) return '';
  let hash = 0;
  const salted = 'dnd5e_pin_salt_v1_' + String(str).trim();
  for (let i = 0; i < salted.length; i++) {
    const char = salted.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return 'pinhash_' + Math.abs(hash).toString(36);
}

function getMasterPinHash() {
  try {
    if (typeof localStorage !== 'undefined') {
      const pin = localStorage.getItem(MASTER_PIN_KEY);
      if (pin && pin.trim().length === 4) {
        return computeSimplePinHash(pin.trim());
      }
    }
  } catch (e) {}
  return computeSimplePinHash(OFFICIAL_MASTER_PIN);
}

function isMasterPinConfigured() {
  try {
    if (typeof localStorage === 'undefined') return false;
    const pin = localStorage.getItem(MASTER_PIN_KEY);
    if (pin && pin.trim().length === 4) return true;
    const cloudHash = localStorage.getItem('dnd5e_cloud_master_pin_hash');
    if (cloudHash && cloudHash.trim().length > 0) return true;
    return false;
  } catch (e) {
    return false;
  }
}

function isMasterAuthorized() {
  try {
    if (typeof localStorage === 'undefined') return false;

    const role = localStorage.getItem(MASTER_ROLE_KEY) || (typeof sessionStorage !== 'undefined' ? sessionStorage.getItem(MASTER_ROLE_KEY) : null);
    if (role !== 'master') return false;

    const expStr = localStorage.getItem(MASTER_SESSION_KEY) || (typeof sessionStorage !== 'undefined' ? sessionStorage.getItem(MASTER_SESSION_KEY) : null);
    if (!expStr) return false;
    const expTime = parseInt(expStr, 10);
    return !isNaN(expTime) && expTime > Date.now();
  } catch (e) {
    return false;
  }
}

function grantMasterSession(hours = DEFAULT_MASTER_SESSION_HOURS) {
  try {
    const expTime = Date.now() + (hours * 3600 * 1000);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(MASTER_SESSION_KEY, String(expTime));
      localStorage.setItem(MASTER_ROLE_KEY, 'master');
    }
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(MASTER_SESSION_KEY, String(expTime));
      sessionStorage.setItem(MASTER_ROLE_KEY, 'master');
    }
    if (typeof clientRole !== 'undefined') clientRole = 'master';
    if (typeof setClientRole === 'function') setClientRole('master');
    return true;
  } catch (e) {
    return false;
  }
}

function lockMasterSession() {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(MASTER_SESSION_KEY);
      localStorage.removeItem(MASTER_ROLE_KEY);
    }
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem(MASTER_SESSION_KEY);
      sessionStorage.removeItem(MASTER_ROLE_KEY);
    }
    if (typeof clientRole !== 'undefined') clientRole = 'player';
    if (typeof setClientRole === 'function') setClientRole('player');
  } catch (e) {}

  if (typeof showToast === 'function') {
    showToast('🔒 Painel do Mestre bloqueado com sucesso.', 'info');
  }

  // Se houver tela de boas-vindas disponível, exibe-a
  if (typeof openWelcomeScreen === 'function') {
    openWelcomeScreen();
  }
}

function updatePinDotsUi() {
  if (typeof document === 'undefined') return;
  for (let i = 0; i < 4; i++) {
    const dot = document.getElementById('pin-dot-' + i);
    if (dot) {
      if (i < currentPinDigits.length) {
        dot.classList.add('filled');
      } else {
        dot.classList.remove('filled');
      }
    }
  }
}

function showPinError(msg) {
  if (typeof document === 'undefined') return;
  const el = document.getElementById('pin-error-msg');
  const modalBody = (typeof document.querySelector === 'function')
    ? document.querySelector('#modal-master-pin .modal-body')
    : document.getElementById('modal-master-pin');
  if (el) {
    el.innerText = msg || 'PIN incorreto. Tente novamente.';
    el.classList.add('visible');
  }
  if (modalBody && modalBody.classList) {
    modalBody.classList.remove('pin-shake');
    void modalBody.offsetWidth; // trigger reflow
    modalBody.classList.add('pin-shake');
  }
}

function hidePinError() {
  if (typeof document === 'undefined') return;
  const el = document.getElementById('pin-error-msg');
  if (el) {
    el.classList.remove('visible');
    el.innerText = '';
  }
}

function openMasterPinModal(onSuccessCallback = null, onCancelCallback = null, forceChange = false) {
  if (typeof document === 'undefined') return;
  const modal = document.getElementById('modal-master-pin');
  if (!modal) return;

  activePinSuccessCb = onSuccessCallback;
  activePinCancelCb = onCancelCallback;
  currentPinDigits = '';
  tempPinConfirmation = '';
  isPinChangeMode = forceChange;

  const titleEl = document.getElementById('master-pin-modal-title');
  const subEl = document.getElementById('master-pin-modal-sub');
  const btnSubmit = document.getElementById('btn-submit-pin');

  if (isPinChangeMode) {
    if (titleEl) titleEl.innerText = '🔑 Definir PIN do Mestre';
    if (subEl) subEl.innerText = 'Crie uma senha de 4 dígitos para proteger as ferramentas do mestre neste navegador:';
    if (btnSubmit) btnSubmit.innerText = 'Avançar ➔';
  } else {
    if (titleEl) titleEl.innerText = '🔐 Acesso do Mestre';
    if (subEl) subEl.innerText = 'Digite seu PIN de 4 dígitos para acessar o painel do Dungeon Master:';
    if (btnSubmit) btnSubmit.innerText = 'Entrar ➔';
  }

  hidePinError();
  updatePinDotsUi();
  modal.classList.add('open');
}

function closeMasterPinModal() {
  if (typeof document === 'undefined') return;
  const modal = document.getElementById('modal-master-pin');
  if (modal) modal.classList.remove('open');

  currentPinDigits = '';
  tempPinConfirmation = '';
  isPinChangeMode = false;
  hidePinError();

  if (typeof activePinCancelCb === 'function') {
    activePinCancelCb();
  }
  activePinSuccessCb = null;
  activePinCancelCb = null;
}

function handlePinDigit(digit) {
  if (currentPinDigits.length >= 4) return;
  currentPinDigits += String(digit).trim();
  hidePinError();
  updatePinDotsUi();

  // Dispara submissão automática se preencheu os 4 dígitos
  if (currentPinDigits.length === 4) {
    setTimeout(() => {
      submitMasterPin();
    }, 120);
  }
}

function handlePinBackspace() {
  if (currentPinDigits.length > 0) {
    currentPinDigits = currentPinDigits.slice(0, -1);
    hidePinError();
    updatePinDotsUi();
  }
}

function handlePinClear() {
  currentPinDigits = '';
  hidePinError();
  updatePinDotsUi();
}

function submitMasterPin() {
  if (currentPinDigits.length !== 4) {
    showPinError('Por favor, digite os 4 dígitos do PIN.');
    return;
  }

  // MODO 1: CRIAÇÃO OU ALTERAÇÃO DE PIN
  const needsPinSetup = isPinChangeMode && (!isMasterPinConfigured() || !!tempPinConfirmation);
  if (needsPinSetup) {
    if (!tempPinConfirmation) {
      // Primeiro passo concluído: pede confirmação
      tempPinConfirmation = currentPinDigits;
      currentPinDigits = '';
      updatePinDotsUi();
      const subEl = document.getElementById('master-pin-modal-sub');
      if (subEl) subEl.innerText = '🔄 Digite os 4 dígitos novamente para confirmar:';
      return;
    }

    // Segundo passo: valida confirmação
    if (currentPinDigits === tempPinConfirmation) {
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(MASTER_PIN_KEY, currentPinDigits);
        }
        if (typeof idbSet === 'function') {
          idbSet(MASTER_PIN_KEY, currentPinDigits);
        }
      } catch (e) {}

      isPinChangeMode = false;
      tempPinConfirmation = '';
      grantMasterSession();
      const successCb = activePinSuccessCb;
      closeMasterPinModal();

      if (typeof closeWelcomeScreen === 'function') {
        closeWelcomeScreen();
      }
      if (typeof showToast === 'function') {
        showToast('✅ PIN do Mestre configurado e protegido no cofre!', 'success');
      }
      if (typeof syncLocalChangesToFirebase === 'function') {
        syncLocalChangesToFirebase();
      }
      if (typeof successCb === 'function') {
        successCb();
      }
      return;
    } else {
      // Confirmação não bateu
      showPinError('Os dígitos não conferem. Vamos recomeçar.');
      tempPinConfirmation = '';
      currentPinDigits = '';
      updatePinDotsUi();
      const subEl = document.getElementById('master-pin-modal-sub');
      if (subEl) subEl.innerText = 'Crie uma senha de 4 dígitos para proteger as ferramentas do mestre:';
      return;
    }
  }

  // MODO 2: AUTENTICAÇÃO NORMAL DE ACESSO DO MESTRE
  let savedPin = OFFICIAL_MASTER_PIN;
  let hasConfiguredPin = true;
  try {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem(MASTER_PIN_KEY);
      if (stored && stored.trim().length === 4) {
        savedPin = stored.trim();
      }
    }
  } catch (e) {}

  let isAuthorized = (currentPinDigits === savedPin || currentPinDigits === OFFICIAL_MASTER_PIN);

  // Auto-cura e verificação remota pelo hash sincronizado da sala
  if (!isAuthorized) {
    try {
      if (typeof localStorage !== 'undefined') {
        const cloudHash = localStorage.getItem('dnd5e_cloud_master_pin_hash');
        if (cloudHash && computeSimplePinHash(currentPinDigits) === cloudHash) {
          isAuthorized = true;
          localStorage.setItem(MASTER_PIN_KEY, currentPinDigits);
          if (typeof idbSet === 'function') {
            idbSet(MASTER_PIN_KEY, currentPinDigits);
          }
        }
      }
    } catch (e) {}
  }

  if (isAuthorized) {
    grantMasterSession();
    if (typeof clientRole !== 'undefined') clientRole = 'master';
    if (typeof setClientRole === 'function') setClientRole('master');
    isPinChangeMode = false;
    tempPinConfirmation = '';
    const successCb = activePinSuccessCb;
    closeMasterPinModal();

    if (typeof closeWelcomeScreen === 'function') {
      closeWelcomeScreen();
    }
    if (typeof showToast === 'function') {
      showToast('👑 Acesso concedido! Bom jogo, Mestre.', 'success');
    }
    if (typeof syncLocalChangesToFirebase === 'function') {
      syncLocalChangesToFirebase();
    }
    if (typeof successCb === 'function') {
      successCb();
    }
  } else {
    showPinError('PIN incorreto. Tente novamente.');
    currentPinDigits = '';
    setTimeout(() => {
      updatePinDotsUi();
    }, 450);
  }
}

function requestMasterAccess(onSuccess = null) {
  if (isMasterAuthorized()) {
    if (typeof onSuccess === 'function') onSuccess();
    return true;
  }
  openMasterPinModal(onSuccess);
  return false;
}

// Suporte para digitação física no teclado
if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
  window.addEventListener('keydown', (e) => {
    const modal = document.getElementById('modal-master-pin');
    if (!modal || !modal.classList.contains('open')) return;

    if (e.key >= '0' && e.key <= '9') {
      handlePinDigit(e.key);
    } else if (e.key === 'Backspace') {
      handlePinBackspace();
    } else if (e.key === 'Escape') {
      closeMasterPinModal();
    } else if (e.key === 'Enter') {
      submitMasterPin();
    }
  });
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    isMasterPinConfigured,
    isMasterAuthorized,
    grantMasterSession,
    lockMasterSession,
    openMasterPinModal,
    closeMasterPinModal,
    handlePinDigit,
    handlePinBackspace,
    handlePinClear,
    submitMasterPin,
    requestMasterAccess,
    highlightInlineRules,
    getTopicIconForText,
    formatFeatureToTopics,
    exportCompleteBackupJson,
    exportData,
    importBackupJson,
    importData,
    handleBackupFileSelected,
    saveSafetySnapshot,
    getSafetySnapshots,
    restoreSafetySnapshot,
    openSnapshotsModal,
    closeSnapshotsModal,
    renderSnapshotsModal,
    loadFromLocalStorage,
    saveToLocalStorage,
    findCombatantForPlayer,
    findPlayerForCombatant,
    showToast,
    toggleNavDrawer,
    openNavDrawer,
    closeNavDrawer,
    toggleFabMenu,
    openFabMenu,
    closeFabMenu,
    handleFabQuickAction,
    initSwipeNavigation,
    toggleCombatOptionsDropdown,
    closeCombatOptionsDropdown,
    toggleCombatFocusMode,
    initCombatFocusMode,
    initIndexedDB,
    idbSet,
    idbGet,
    checkAndRestoreFromIndexedDB,
    computeSimplePinHash,
    getMasterPinHash,
    toggleNavDropdown
  };
} else {
  // Execução síncrona imediata no navegador para garantir que PLAYERS e state sejam carregados antes de qualquer render
  try {
    if (typeof localStorage !== 'undefined') {
      loadFromLocalStorage();
    }
    if (typeof document !== 'undefined') {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          initSwipeNavigation();
          initCombatFocusMode();
          if (typeof checkAndRestoreFromIndexedDB === 'function') {
            checkAndRestoreFromIndexedDB();
          }
        });
      } else {
        initSwipeNavigation();
        initCombatFocusMode();
        if (typeof checkAndRestoreFromIndexedDB === 'function') {
          checkAndRestoreFromIndexedDB();
        }
      }
    }
  } catch (e) {
    console.warn('Erro ao carregar dados no início de core.js:', e);
  }
}


