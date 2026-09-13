// ==========================================
// 🐉 D&D 5E / 2024 - BASE DE DADOS EXPANDIDA DO BESTIÁRIO
// Catálogo completo com 600+ monstros e criaturas (Pocket DM / SRD 5.1 & 5.2)
// ==========================================
const BESTIARY_DATA = [
  {
    "name": "Aboleth",
    "source": "MM 2024",
    "cr": "10",
    "ac": 17,
    "hp": 150,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O aboleth realiza três ataques com tentáculos. Tentáculo . Ataque com Arma Corpo a Corpo: +9 para acertar , alcance 3 m (10 ft), um alvo. Acerto: 12 (2d6 + 5) de dano de concussão. Se o alvo for uma criatura, ele deve ser bem-sucedido em uma salvaguarda de Constituição CD 14 ou ficará doente. A doença não tem efeito por 1 minuto e pode ser removida por qualquer magia que cure ..."
  },
  {
    "name": "Abominação Yeti",
    "source": "MM 2024",
    "cr": "12",
    "ac": 17,
    "hp": 250,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O yeti pode usar seu Olhar Hediondo e faz três ataques de garra. Garra . Ataque Corpo a Corpo com Arma: +11 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 14 (2d6 + 7) de dano cortante mais 7 (2d6) de dano necrótico. Heinous Gaze . O yeti mira uma criatura que pode ver a até 9 m (30 ft) dele. O alvo deve ser bem-sucedido em uma salvaguarda de Constituição CD 18 contra e..."
  },
  {
    "name": "Abutre",
    "source": "MM 2024",
    "cr": "0",
    "ac": 10,
    "hp": 5,
    "speed": "9m",
    "attack": "Bico . Ataque com Arma Corpo a Corpo: +2 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 2 (1d4) de dano perfurante."
  },
  {
    "name": "Abutre Gigante",
    "source": "MM 2024",
    "cr": "1",
    "ac": 10,
    "hp": 25,
    "speed": "9m",
    "attack": "Perfurar . Ataque Corpo a Corpo: +4 , alcance 1,5 m (5 ft). 9 (2d6 + 2) de dano perfurante, e o alvo fica com a condição Envenenado ( Poisoned ) até o fim do próximo turno dele."
  },
  {
    "name": "Acólito",
    "source": "MM 2024",
    "cr": "1/4",
    "ac": 10,
    "hp": 9,
    "speed": "9m",
    "attack": "Clava . Ataque com Arma Corpo a Corpo: +2 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 2 (1d4) de dano de concussão."
  },
  {
    "name": "Afogado do Pântano",
    "source": "MM 2024",
    "cr": "2",
    "ac": 11,
    "hp": 39,
    "speed": "9m",
    "attack": "Garra . Ataque Corpo a Corpo com Arma: +5 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 5 (1d6 + 3) de dano perfurante e o alvo fica imobilizado (CD de escape 16). Drag Down . O afogado do pântano tenta arrastar uma criatura que está agarrando para o fundo do pântano. A criatura deve fazer uma salvaguarda de Força CD 16 ou ser puxada 3 m (10 ft) para dentro do pântano."
  },
  {
    "name": "Águia",
    "source": "MM 2024",
    "cr": "0",
    "ac": 12,
    "hp": 4,
    "speed": "9m",
    "attack": "Garras . Ataque Corpo a Corpo com Arma: +4 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 4 (1d4 + 2) de dano cortante."
  },
  {
    "name": "Águia Gigante",
    "source": "MM 2024",
    "cr": "1",
    "ac": 13,
    "hp": 26,
    "speed": "9m",
    "attack": "Ataque Múltiplo . A águia faz dois ataques de Dilacerar. Dilacerar . Ataque Corpo a Corpo: +5 , alcance 1,5 m (5 ft). 5 (1d4 + 3) de dano cortante mais 3 (1d6) de dano radiante."
  },
  {
    "name": "Ahuizotl",
    "source": "MM 2024",
    "cr": "6",
    "ac": 15,
    "hp": 153,
    "speed": "9m",
    "attack": "Garra . Ataque com Arma Corpo a Corpo: +7 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 14 (3d6 + 4) de dano cortante. Cauda . Ataque com Arma Corpo a Corpo: +7 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 11 (2d6 + 4) de dano de concussão. Se o alvo for uma criatura Média ou menor, ele fica imobilizado (CD de escape 15). Até que esse agarrão termine, o alvo está contido e o ah..."
  },
  {
    "name": "Akhlut",
    "source": "MM 2024",
    "cr": "1",
    "ac": 15,
    "hp": 30,
    "speed": "9m",
    "attack": "Azagaia . Ataque Corpo a Corpo ou à Distância com Arma: +5 para acertar , alcance 1,5 m (5 ft) ou distância 9/36 m (30/120 ft), um alvo. Acerto: 6 (1d6 + 3) de dano perfurante."
  },
  {
    "name": "Akupara",
    "source": "MM 2024",
    "cr": "26",
    "ac": 25,
    "hp": 838,
    "speed": "9m",
    "attack": "Ataque Múltiplo . Akupara faz um ataque de mordida e dois ataques de pisoteio. Mordida . Ataque Corpo a Corpo com Arma: +18 para acertar , alcance 3 m (10 ft), um alvo. Acerto: 26 (3d10 + 10) de dano perfurante e o alvo fica imobilizado (CD de escape 20). Até o agarrão terminar, o alvo está contido e o akupara não pode morder outro alvo. Pisotear . Ataque Corpo a Corpo com Arma: +18 para acerta..."
  },
  {
    "name": "Alce",
    "source": "MM 2024",
    "cr": "1/4",
    "ac": 10,
    "hp": 11,
    "speed": "9m",
    "attack": "Aríete . Ataque Corpo a Corpo: +5 , alcance 1,5 m (5 ft). 6 (1d6 + 3) de dano de concussão. Se o alvo for uma criatura Grande ou menor e o alce tiver se movido 6 m (20 ft) ou mais em linha reta na direção dele imediatamente antes do acerto, o alvo sofre 3 (1d6) de dano de concussão extra e fica com a condição Caído ( Prone ) ."
  },
  {
    "name": "Alce Gigante",
    "source": "MM 2024",
    "cr": "2",
    "ac": 14,
    "hp": 42,
    "speed": "9m",
    "attack": "Aríete . Ataque Corpo a Corpo: +6 , alcance 3 m (10 ft). 11 (2d6 + 4) de dano de concussão mais 5 (2d4) de dano radiante. Se o alvo for uma criatura Enorme ou menor e o alce tiver se movido 6 m (20 ft) ou mais em linha reta na direção dele imediatamente antes do acerto, o alvo sofre 5 (2d4) de dano de concussão extra e fica com a condição Caído ( Prone ) ."
  },
  {
    "name": "Alossauro",
    "source": "MM 2024",
    "cr": "2",
    "ac": 13,
    "hp": 51,
    "speed": "9m",
    "attack": "Mordida . Ataque Corpo a Corpo: +6 , alcance 1,5 m (5 ft). 15 (2d10 + 4) de dano Perfurante. Garras . Ataque Corpo a Corpo: +6 , alcance 1,5 m (5 ft). 8 (1d8 + 4) de dano Cortante. Se o alvo for uma criatura Grande ou menor e o alossauro tiver se movido 9+ m (30+ ft) em linha reta em direção a ele imediatamente antes do acerto, o alvo fica com a condição Derrubado, e o alossauro pode fazer um a..."
  },
  {
    "name": "Amalthalda, a Exorcista",
    "source": "MM",
    "cr": "15",
    "ac": 20,
    "hp": 289,
    "speed": "9m",
    "attack": "Ataque Múltiplo . Amalthalda faz três ataques corpo a corpo. Sun Shard . Ataque com Arma Corpo a Corpo: +13 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 15 (2d6 + 8) de dano de concussão, perfurante ou cortante (escolha de Amalthalda) mais 4 (1d8) de dano radiante. Holy Nova (Recharges after a Long Rest) . Amalthalda invoca a luz de Pelor em um raio de 9 m (30 ft) ao redor dela. Qualqu..."
  },
  {
    "name": "Ancião Pigmeu",
    "source": "MM 2024",
    "cr": "2",
    "ac": 12,
    "hp": 82,
    "speed": "9m",
    "attack": "Blowgun . Ataque à Distância com Arma: +4 para acertar , alcance 7,5/30 m (25/100 ft), um alvo. Acerto: 1 de dano perfurante mais 5 (2d4) de dano de veneno. Bordão . Ataque Corpo a Corpo com Arma: +2 para acertar ( +5 para acertar com shillelagh), alcance 1,5 m (5 ft), um alvo. Acerto: 3 (1d6) de dano de concussão, 4 (1d8) de dano de concussão se empunhado com duas mãos, ou 7 (1d8 + 3) de dano ..."
  },
  {
    "name": "Ancião Tortle",
    "source": "MM",
    "cr": "4",
    "ac": 17,
    "hp": 91,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O tortle faz dois ataques corpo a corpo. Garras . Ataque Corpo a Corpo com Arma: +5 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 5 (1d4 + 3) de dano cortante. Bordão . Ataque Corpo a Corpo com Arma: +5 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 6 (1d6 + 3) de dano contundente, ou 7 (1d8 + 3) de dano contundente se usado com duas mãos. Elemental Attunement ...."
  },
  {
    "name": "Androesfinge",
    "source": "MM 2024",
    "cr": "17",
    "ac": 17,
    "hp": 199,
    "speed": "9m",
    "attack": "Ataque Múltiplo . A esfinge faz dois ataques de garra. Garra . Ataque com Arma Corpo a Corpo: +12 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 17 (2d10 + 6) de dano cortante. Rugido (3/Dia) . A esfinge emite um rugido mágico. Cada vez que ela ruge antes de completar um descanso longo, o rugido é mais alto e o efeito é diferente, conforme detalhado abaixo. Cada criatura a até 150 m (500..."
  },
  {
    "name": "Anjo Caído",
    "source": "MM 2024",
    "cr": "10",
    "ac": 17,
    "hp": 136,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O anjo faz dois ataques. Cimitarra . Ataque Corpo a Corpo com Arma: +8 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 7 (1d6 + 4) de dano cortante mais 18 (4d8) de dano necrótico. Vampiric Touch (3/Day) . Ataque Corpo a Corpo com Magia: +8 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 18 (4d8) de dano necrótico, e o anjo recupera pontos de vida iguais à metade d..."
  },
  {
    "name": "Ankheg",
    "source": "MM 2024",
    "cr": "2",
    "ac": 14,
    "hp": 45,
    "speed": "9m",
    "attack": "Mordida . Ataque com Arma Corpo a Corpo: +5 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 10 (2d6 + 3) de dano cortante mais 3 (1d6) de dano ácido. Se o alvo for uma criatura Grande ou menor, ele fica imobilizado (CD de escape 13). Até que esse agarrão termine, o ankheg pode morder apenas a criatura imobilizada e tem vantagem nas jogadas de ataque para fazê-lo. Jato Ácido ( Recarga 6 ) ..."
  },
  {
    "name": "Anquilossauro",
    "source": "MM 2024",
    "cr": "3",
    "ac": 15,
    "hp": 68,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O anquilossauro faz dois ataques de Cauda. Cauda . Ataque Corpo a Corpo: +6 , alcance 3 m (10 ft). 9 (1d10 + 4) de dano de Concussão. Se o alvo for uma criatura Grande ou menor, ele fica com a condição Derrubado."
  },
  {
    "name": "Aparição",
    "source": "MM 2024",
    "cr": "5",
    "ac": 13,
    "hp": 67,
    "speed": "9m",
    "attack": "Dreno Vital . Ataque Corpo a Corpo com Arma: +6 para acertar , alcance 1,5 m (5 ft), uma criatura. Acerto: 21 (4d8 + 3) de dano necrótico. O alvo deve ser bem-sucedido em uma salvaguarda de Constituição CD 14 ou seu máximo de pontos de vida é reduzido em uma quantidade igual ao dano sofrido. Essa redução dura até o alvo completar um descanso longo. O alvo morre se esse efeito reduzir seu máximo..."
  },
  {
    "name": "Aquamante",
    "source": "MM",
    "cr": "6",
    "ac": 13,
    "hp": 149,
    "speed": "9m",
    "attack": "Bordão . Ataque Corpo a Corpo com Arma: +3 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 3 (1d6) de dano de concussão, ou 4 (1d8) de dano de concussão se empunhado com duas mãos. Dessicate ( Recharge 6 ) . O aquamante tenta drenar a água de uma criatura. Uma criatura a até 9 m (30 ft) do aquamante deve ser bem-sucedida em uma salvaguarda de Constituição CD 15 ou sofrerá 45 (10d8) de dan..."
  },
  {
    "name": "Aranha",
    "source": "MM 2024",
    "cr": "0",
    "ac": 12,
    "hp": 1,
    "speed": "9m",
    "attack": "Mordida . Ataque Corpo a Corpo com Arma: +4 para acertar , alcance 1,5 m (5 ft), uma criatura. Acerto: 1 de dano perfurante, e o alvo deve ser bem-sucedido em uma salvaguarda de Constituição CD 9 ou sofrer 2 (1d4) de dano de veneno."
  },
  {
    "name": "Aranha da Neve",
    "source": "MM 2024",
    "cr": "3",
    "ac": 13,
    "hp": 65,
    "speed": "9m",
    "attack": "Mordida . Ataque com Arma Corpo a Corpo: +5 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 8 (1d10 + 3) de dano perfurante, e a criatura deve fazer uma salvaguarda de Constituição CD 11, sofrendo 18 (4d8) de dano de frio em uma falha, ou metade desse dano em um sucesso. Se o dano de frio reduzir o alvo a 0 pontos de vida, o alvo fica congelado. Uma criatura congelada fica paralisada e po..."
  },
  {
    "name": "Aranha Etérea",
    "source": "MM 2024",
    "cr": "3",
    "ac": 14,
    "hp": 45,
    "speed": "9m",
    "attack": "Ataque Múltiplo . A aranha realiza dois ataques de Mordida. Mordida . Ataque Corpo a Corpo: +5 , alcance 1,5 m (5 ft). 8 (1d10 + 3) de dano perfurante mais 9 (2d8) de dano de veneno. Se esse dano reduzir o alvo a 0 Pontos de Vida, o alvo fica Estável e fica com a condição Envenenado ( Poisoned ) por 1 hora. Enquanto Envenenado , o alvo também fica com a condição Paralisado ( Paralyzed ) ."
  },
  {
    "name": "Aranha Gigante",
    "source": "MM 2024",
    "cr": "1",
    "ac": 14,
    "hp": 26,
    "speed": "9m",
    "attack": "Mordida . Ataque Corpo a Corpo: +5 , alcance 1,5 m (5 ft). 7 (1d8 + 3) de dano perfurante mais 7 (2d6) de dano de veneno. Teia ( Recarga 5-6 ) . Salvaguarda de Destreza: CD 13, uma criatura que a aranha possa ver a até 18 m (60 ft). Falha: O alvo fica com a condição Contido ( Restrained ) até a teia ser destruída (CA 10; PV 5; Vulnerabilidade a dano de fogo; Imunidade a dano de veneno e psíquico)."
  },
  {
    "name": "Aranha Tecelã-de-Coroas",
    "source": "MM 2024",
    "cr": "1",
    "ac": 13,
    "hp": 40,
    "speed": "9m",
    "attack": "Mordida . Ataque Corpo a Corpo com Arma: +5 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 5 (1d4 + 3) de dano perfurante, e o alvo deve ser bem-sucedido em uma salvaguarda de Constituição CD 13 ou ficará envenenado por 1 hora. Enquanto estiver envenenado dessa forma, o alvo também estará enfeitiçado pela aranha."
  },
  {
    "name": "Aranha-Lobo Gigante",
    "source": "MM 2024",
    "cr": "1/4",
    "ac": 13,
    "hp": 11,
    "speed": "9m",
    "attack": "Mordida . Ataque Corpo a Corpo: +5 , alcance 1,5 m (5 ft). 5 (1d4 + 3) de dano perfurante mais 5 (2d4) de dano de veneno."
  },
  {
    "name": "Arbusto Desperto",
    "source": "MM 2024",
    "cr": "0",
    "ac": 9,
    "hp": 10,
    "speed": "9m",
    "attack": "Dilacerar . Ataque Corpo a Corpo com Arma: +1 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 1 (1d4 - 1) de dano cortante."
  },
  {
    "name": "Arbusto Emboscador",
    "source": "MM 2024",
    "cr": "1",
    "ac": 8,
    "hp": 65,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O arbusto emboscador faz dois ataques de cipó constritor. Mordida . Ataque Corpo a Corpo com Arma: +4 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 5 (1d6 + 2) de dano perfurante. Se o alvo for uma criatura Média ou menor, ele é ingerido. Enquanto ingerida, a criatura está cega e contida , tem cobertura total contra ataques e outros efeitos de fora do arbusto emboscado..."
  },
  {
    "name": "Arcanamito",
    "source": "MM 2024",
    "cr": "1",
    "ac": 15,
    "hp": 27,
    "speed": "9m",
    "attack": "Mordida . Ataque Corpo a Corpo com Arma: +4 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 4 (1d4 + 2) de dano perfurante, e o arcanamito pode se prender ao alvo. O arcanamito pode ser removido se uma criatura usar uma ação e for bem-sucedida em um teste de Força CD 15 contra ele. O arcanamito se solta se sofrer dano de fogo. Até que o arcanamito se solte, ele não pode morder outro alvo...."
  },
  {
    "name": "Arconte Lanterna",
    "source": "MM 2024",
    "cr": "2",
    "ac": 12,
    "hp": 21,
    "speed": "9m",
    "attack": "Light Ray . Ataque Mágico à Distância: +4 para acertar , alcance 9 m (30 ft), um alvo. Acerto: 11 (2d10) de dano radiante."
  },
  {
    "name": "Armadilha Animada",
    "source": "MM 2024",
    "cr": "7",
    "ac": 15,
    "hp": 156,
    "speed": "9m",
    "attack": "Ficha de Armadilha Animada (regras 2014): Pequeno constructo, CA 15, PV 156, CR 7. Role direto na mesa com o rolador de dados grátis. Bestiário D&D 5e."
  },
  {
    "name": "Armadilha-de-Moscas Cadavérica",
    "source": "MM 2024",
    "cr": "2",
    "ac": 12,
    "hp": 97,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O cadáver faz dois ataques: um com sua garra e um com sua armadilha-de-moscas. Garra . Ataque Corpo a Corpo com Arma: +5 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 6 (1d6 + 3) de dano cortante. Fly-Trap . Ataque Corpo a Corpo com Arma: +5 para acertar , alcance 3 m (10 ft), uma criatura. Acerto: 5 (1d4 + 3) de dano perfurante mais 5 (2d4) de dano ácido. Se o alvo fo..."
  },
  {
    "name": "Armadura Animada",
    "source": "MM 2024",
    "cr": "1",
    "ac": 18,
    "hp": 33,
    "speed": "9m",
    "attack": "Ataque Múltiplo . A armadura faz dois ataques corpo a corpo. Golpe . Ataque com Arma Corpo a Corpo: +4 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 5 (1d6 + 2) de dano de concussão."
  },
  {
    "name": "Arqueiro Infernal",
    "source": "MM 2024",
    "cr": "7",
    "ac": 15,
    "hp": 130,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O hellbug faz dois ataques. Ele pode usar Cuspir no lugar de qualquer ataque corpo a corpo. Garra . Ataque Corpo a Corpo com Arma: +5 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 6 (1d8 + 2) de dano perfurante. Spit . O hellbug expele uma bola combustível de muco que explode em um ponto que ele possa ver a até 18 m (60 ft) dele. Cada criatura em uma esfera de 1,5 m (5..."
  },
  {
    "name": "Arquimago",
    "source": "MM 2024",
    "cr": "12",
    "ac": 17,
    "hp": 170,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O arquimago realiza quatro ataques de Rajada Arcana. Explosão Arcana . Ataque Corpo a Corpo ou à Distância: +9 , alcance 1,5 m (5 ft) ou distância de 45 m (150 ft). 27 (4d10 + 5) de dano de força."
  },
  {
    "name": "Árvore Desperta",
    "source": "MM 2024",
    "cr": "2",
    "ac": 13,
    "hp": 59,
    "speed": "9m",
    "attack": "Golpe . Ataque Corpo a Corpo: +6 , alcance 3 m (10 ft). 13 (2d8 + 4) de dano de concussão."
  },
  {
    "name": "Árvore do Enforcamento",
    "source": "MM 2024",
    "cr": "10",
    "ac": 16,
    "hp": 207,
    "speed": "9m",
    "attack": "Ataque Múltiplo . A árvore-forca faz três ataques de cipó-laço. Vine Noose . Ataque Corpo a Corpo com Arma: +8 para acertar , alcance 9 m (30 ft), um alvo. Acerto: 11 (2d6 + 4) de dano de concussão, e o alvo fica imobilizado (CD de escape 16). A criatura imobilizada não consegue respirar, está contida e sofre 11 (2d6 + 4) de dano de concussão no início de cada turno da árvore-forca. Voice of th..."
  },
  {
    "name": "Assassino",
    "source": "MM 2024",
    "cr": "8",
    "ac": 16,
    "hp": 97,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O assassino faz dois ataques com espada curta. Espada Curta . Ataque Corpo a Corpo: +7 , alcance 1,5 m (5 ft). 7 (1d6 + 4) de dano perfurante mais 17 (5d6) de dano de veneno, e o alvo fica com a condição Envenenado ( Poisoned ) até o início do próximo turno do assassino. Besta Leve . Ataque à Distância: +7 , alcance 24/96 m (80/320 ft). 8 (1d8 + 4) de dano perfurante mais 21 (..."
  },
  {
    "name": "Aswang",
    "source": "MM",
    "cr": "9",
    "ac": 16,
    "hp": 127,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O aswang faz três ataques: dois com suas garras e um com sua língua. Garra . Ataque com Arma Corpo a Corpo: +7 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 12 (2d8 + 3) de dano cortante. Tongue . Ataque com Arma Corpo a Corpo: +9 para acertar , alcance 3 m (10 ft), uma criatura. Acerto: 8 (1d6 + 5) de dano perfurante, e o alvo deve ser bem-sucedido em uma salvaguarda ..."
  },
  {
    "name": "Atormentador",
    "source": "MM 2024",
    "cr": "9",
    "ac": 16,
    "hp": 204,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O atormentador faz quatro ataques de garra. Alternativamente, ele faz dois ataques com seu cajado de almas. Garra . Ataque Corpo a Corpo com Arma: +8 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 11 (2d6 + 4) de dano cortante. Soulstaff . Ataque à Distância com Magia: +6 para acertar , distância 36 m (120 ft), um alvo. Acerto: 21 (3d12 + 2) de dano necrótico, e o alvo ..."
  },
  {
    "name": "Avatar da Máscara da Terra",
    "source": "MM",
    "cr": "7",
    "ac": 14,
    "hp": 202,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O avatar faz seis ataques de vínculo. Ele pode usar murchar duas vezes no lugar de três ataques de vínculo. Wither . Ataque Corpo a Corpo com Magia: +6 para acertar , alcance 1,5 m (5 ft), uma criatura ou planta. Acerto: 12 (2d8 + 3) de dano necrótico. &nbsp;&nbsp; Se o alvo for uma criatura planta ou planta mágica, este ataque causa dano máximo a ele. &nbsp;&nbsp; Se o alvo f..."
  },
  {
    "name": "Avatar da Máscara de Fogo",
    "source": "MM",
    "cr": "7",
    "ac": 15,
    "hp": 161,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O avatar faz três ataques com sua espada longa ou seis ataques com seu ignitar. Ele pode usar ignitar duas vezes no lugar de um ataque com espada longa. Espada Longa . Ataque Corpo a Corpo com Arma: +6 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 12 (2d8 + 3) de dano cortante, ou 14 (2d10 + 3) se empunhada com as duas mãos. Ignite . Ataque à Distância com Magia: +5 pa..."
  },
  {
    "name": "Aven Invocador de Tempestades",
    "source": "MM 2024",
    "cr": "11",
    "ac": 18,
    "hp": 175,
    "speed": "9m",
    "attack": "Ficha de Aven Invocador de Tempestades (regras 2014): Médio humanoide, CA 18, PV 175, CR 11. Role direto na mesa com o rolador de dados grátis. Bestiário…"
  },
  {
    "name": "Avolakia",
    "source": "MM 2024",
    "cr": "10",
    "ac": 18,
    "hp": 178,
    "speed": "9m",
    "attack": "Ataque Múltiplo . A avolakia faz cinco ataques: um com sua mordida e quatro com suas garras. Mordida . Ataque Corpo a Corpo com Arma: +8 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 11 (2d6 + 4) de dano perfurante mais 14 (4d6) de dano de veneno. Garra . Ataque Corpo a Corpo com Arma: +8 para acertar , alcance 3 m (10 ft), um alvo. Acerto: 6 (1d4 + 4) de dano cortante."
  },
  {
    "name": "Azer",
    "source": "MM 2024",
    "cr": "2",
    "ac": 17,
    "hp": 39,
    "speed": "9m",
    "attack": "Martelo de Guerra . Ataque Corpo a Corpo com Arma: +5 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 7 (1d8 + 3) de dano de concussão, ou 8 (1d10 + 3) de dano de concussão se usado com duas mãos para realizar um ataque corpo a corpo, mais 3 (1d6) de dano de fogo."
  },
  {
    "name": "Babuíno",
    "source": "MM 2024",
    "cr": "0",
    "ac": 12,
    "hp": 3,
    "speed": "9m",
    "attack": "Mordida . Ataque Corpo a Corpo com Arma: +1 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 1 (1d4 - 1) de dano perfurante."
  },
  {
    "name": "Balbuciador Feral",
    "source": "MM 2024",
    "cr": "3",
    "ac": 13,
    "hp": 32,
    "speed": "9m",
    "attack": "Mordida . Ataque Corpo a Corpo com Arma: +5 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 8 (2d4 + 3) de dano perfurante."
  },
  {
    "name": "Balor",
    "source": "MM 2024",
    "cr": "19",
    "ac": 19,
    "hp": 287,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O balor realiza dois ataques: um com sua espada longa e um com seu chicote. Chicote Flamejante . Ataque Corpo a Corpo: +14 , alcance 9 m (30 ft). 18 (3d6 + 8) de dano de força mais 17 (5d6) de dano de fogo. Se o alvo for uma criatura Enorme ou menor, o balor puxa o alvo até 7,5 m (25 ft) em linha reta em sua direção, e o alvo fica com a condição Caído ( Prone ) . Lâmina Elétri..."
  },
  {
    "name": "Bandido",
    "source": "MM 2024",
    "cr": "1/8",
    "ac": 12,
    "hp": 11,
    "speed": "9m",
    "attack": "Cimitarra . Ataque com Arma Corpo a Corpo: +3 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 4 (1d6 + 1) de dano cortante. Besta Leve . Ataque com Arma à Distância: +3 para acertar , alcance 24 m (80 ft)/96 m (320 ft), um alvo. Acerto: 5 (1d8 + 1) de dano perfurante."
  },
  {
    "name": "Bárbaro Arauto da Tempestade",
    "source": "MM",
    "cr": "9",
    "ac": 17,
    "hp": 127,
    "speed": "9m",
    "attack": "Ficha de Bárbaro Arauto da Tempestade (regras 2014): Médio humanoide, CA 17, PV 127, CR 9. Role direto na mesa com o rolador de dados grátis. Bestiário D&D…"
  },
  {
    "name": "Bárbaro Guardião Ancestral",
    "source": "MM",
    "cr": "5",
    "ac": 17,
    "hp": 90,
    "speed": "9m",
    "attack": "Ficha de Bárbaro Guardião Ancestral (regras 2014): Médio humanoide, CA 17, PV 90, CR 5. Role direto na mesa com o rolador de dados grátis. Bestiário D&D 5e."
  },
  {
    "name": "Bárbaro Zelote",
    "source": "MM 2024",
    "cr": "13",
    "ac": 17,
    "hp": 180,
    "speed": "9m",
    "attack": "Ficha de Bárbaro Zelote (regras 2014): Médio humanoide, CA 17, PV 180, CR 13. Role direto na mesa com o rolador de dados grátis. Bestiário D&D 5e."
  },
  {
    "name": "Bardo do Colégio das Espadas",
    "source": "MM 2024",
    "cr": "6",
    "ac": 19,
    "hp": 48,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O bardo faz um ataque com cimitarra e usa floreio de lâmina uma vez. Cimitarra . Ataque Corpo a Corpo com Arma: +5 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 7 (1d6 + 4) de dano cortante. Blade Flourish . O bardo pode fazer um ataque com cimitarra, e seu deslocamento aumenta em 3 m (10 ft) até o final do turno atual. &nbsp; Sempre que o bardo usa esta ação, ele tamb..."
  },
  {
    "name": "Bardo do Colégio do Glamour",
    "source": "MM",
    "cr": "9",
    "ac": 14,
    "hp": 67,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O bardo faz um ataque com rapieira e conjura Zombaria Perversa. Rapieira . Ataque Corpo a Corpo com Arma: +6 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 6 (1d8 + 2) de dano perfurante."
  },
  {
    "name": "Bardo do Colégio dos Sussurros",
    "source": "MM",
    "cr": "4",
    "ac": 19,
    "hp": 48,
    "speed": "9m",
    "attack": "Adaga . Ataque Corpo a Corpo ou à Distância com Arma: +5 para acertar , alcance 1,5 m (5 ft) ou distância 6/18 m (20/60 ft), um alvo. Acerto: 4 (1d4 + 2) de dano perfurante."
  },
  {
    "name": "Basilisco",
    "source": "MM 2024",
    "cr": "3",
    "ac": 15,
    "hp": 52,
    "speed": "9m",
    "attack": "Mordida . Ataque com Arma Corpo a Corpo: +5 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 10 (2d6 + 3) de dano perfurante mais 7 (2d6) de dano de veneno."
  },
  {
    "name": "Batedor",
    "source": "MM 2024",
    "cr": "1/2",
    "ac": 13,
    "hp": 16,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O batedor realiza dois ataques corpo a corpo ou dois ataques à distância. Espada Curta . Ataque Corpo a Corpo com Arma: +4 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 5 (1d6 + 2) de dano perfurante. Arco Longo . Ataque à Distância com Arma: +4 para acertar , alcance 45/180 m (150/600 ft), um alvo. Acerto: 6 (1d8 + 2) de dano perfurante."
  },
  {
    "name": "Batedor Combatente",
    "source": "MM 2024",
    "cr": "2",
    "ac": 14,
    "hp": 40,
    "speed": "9m",
    "attack": "Ficha de Batedor Combatente (regras 2014): Pequeno humanoide, CA 14, PV 40, CR 2. Role direto na mesa com o rolador de dados grátis. Bestiário D&D 5e."
  },
  {
    "name": "Bêbado",
    "source": "MM",
    "cr": "3",
    "ac": 12,
    "hp": 127,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O bêbado faz dois ataques desarmados. Ataque Desarmado . Ataque Corpo a Corpo com Arma: +6 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 6 (1d4 + 4) de dano de concussão."
  },
  {
    "name": "Behir",
    "source": "MM 2024",
    "cr": "11",
    "ac": 17,
    "hp": 168,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O behir realiza dois ataques: um com sua mordida e um para constringir. Mordida . Ataque Corpo a Corpo: +10 , alcance 3 m (10 ft). 19 (2d12 + 6) de dano perfurante mais 11 (2d10) de dano elétrico. Constrição . Salvaguarda de Força: CD 18, uma criatura Grande ou menor que o behir possa ver a até 1,5 m (5 ft). Falha: 28 (5d8 + 6) de dano de concussão. O alvo fica com a condição ..."
  },
  {
    "name": "Beholder Nauseante",
    "source": "MM 2024",
    "cr": "10",
    "ac": 18,
    "hp": 170,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O beholder faz oito ataques de pedúnculo. Stalk . Ataque Corpo a Corpo com Arma: +7 para acertar , alcance 3 m (10 ft), um alvo. Acerto: 9 (1d12 + 3) de dano de concussão."
  },
  {
    "name": "Berrador",
    "source": "MM 2024",
    "cr": "2",
    "ac": 13,
    "hp": 45,
    "speed": "9m",
    "attack": "Mordida . Ataque Corpo a Corpo com Arma: +6 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 13 (2d8 + 4) de dano perfurante. Screech ( Recharge 5-6 ) . Cada criatura a até 18 m (60 ft) do berrador que possa ouvi-lo deve ser bem-sucedida em uma salvaguarda de Constituição CD 12 ou ficará atordoada até o final do próximo turno do berrador."
  },
  {
    "name": "Berserker",
    "source": "MM 2024",
    "cr": "2",
    "ac": 13,
    "hp": 67,
    "speed": "9m",
    "attack": "Machado Grande . Ataque com Arma de Corpo a Corpo: +5 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 9 (1d12 + 3) de dano cortante."
  },
  {
    "name": "Besouro Bombardeiro Gigante",
    "source": "MM 2024",
    "cr": "2",
    "ac": 13,
    "hp": 52,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O besouro faz dois ataques: um com sua mordida e um com seu líquido cáustico. Mordida . Ataque Corpo a Corpo com Arma: +5 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 7 (1d8 + 3) de dano perfurante. Caustic Liquid . Ataque à Distância com Arma: +4 para acertar , alcance 9/18 m (30/60 ft), um alvo. Acerto: 5 (2d4) de dano ácido mais 5 (2d4) de dano de fogo. O alvo deve..."
  },
  {
    "name": "Besouro Bombardeiro Gigante",
    "source": "MM 2024",
    "cr": "17",
    "ac": 19,
    "hp": 315,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O besouro faz três ataques corpo a corpo: um com sua mordida e dois com seu pisoteio. Ele pode usar Líquido Cáustico no lugar de qualquer ataque corpo a corpo. Mordida . Ataque com Arma Corpo a Corpo: +13 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 25 (4d8 + 7) de dano perfurante. Pisotear . Ataque com Arma Corpo a Corpo: +13 para acertar , alcance 1,5 m (5 ft), um a..."
  },
  {
    "name": "Besouro de Fogo Gigante",
    "source": "MM 2024",
    "cr": "0",
    "ac": 13,
    "hp": 4,
    "speed": "9m",
    "attack": "Mordida . Ataque Corpo a Corpo com Arma: +1 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 2 (1d6 - 1) de dano cortante."
  },
  {
    "name": "Besouro-Veado Gigante",
    "source": "MM 2024",
    "cr": "4",
    "ac": 16,
    "hp": 85,
    "speed": "9m",
    "attack": "Ataque Múltiplo . If it can, the beetle makes two attacks with its vice grip against a creature it is grappling. Mandible . Ataque Corpo a Corpo com Arma: +7 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 12 (2d6 + 5) de dano de concussão. Se o alvo for uma criatura Grande ou menor, ele fica imobilizado (CD de escape 14) enquanto o besouro não estiver agarrando outro alvo. Até que essa c..."
  },
  {
    "name": "Besta das Cinzas",
    "source": "MM 2024",
    "cr": "1/2",
    "ac": 14,
    "hp": 22,
    "speed": "9m",
    "attack": "Headbutt . Ataque Corpo a Corpo com Arma: +4 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 6 (1d8 + 2) de dano de concussão. Arco Curto . Ataque à Distância com Arma: +4 para acertar , alcance 24/96 m (80/320 ft), um alvo. Acerto: 5 (1d6 + 2) de dano perfurante."
  },
  {
    "name": "Bicho-Papão",
    "source": "MM 2024",
    "cr": "11",
    "ac": 17,
    "hp": 220,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O bicho-papão faz três ataques de pancada. Golpe . Ataque Corpo a Corpo com Arma: +11 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 12 (2d6 + 5) de dano de concussão mais 7 (2d6) de dano necrótico. Spew Insects ( Recharge 5-6 ) . O bicho-papão libera um cone de 6 m (20 ft) de insetos em enxame de seu corpo em forma de saco. Cada criatura na área deve fazer uma salvagua..."
  },
  {
    "name": "Bico de Machado",
    "source": "MM 2024",
    "cr": "1/4",
    "ac": 11,
    "hp": 19,
    "speed": "9m",
    "attack": "Bico . Ataque Corpo a Corpo: +4 , alcance 1,5 m (5 ft). 5 (1d6 + 2) de dano cortante."
  },
  {
    "name": "Boggle de Turfa",
    "source": "MM 2024",
    "cr": "1",
    "ac": 14,
    "hp": 44,
    "speed": "9m",
    "attack": "Willow Staff . Ataque Corpo a Corpo com Arma: +1 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 3 (1d8 - 1) de dano perfurante. Peat Pelting ( Recharge 5-6 ) . O boggle arremessa uma bola de turfa molhada em um ponto que ele possa ver a até 18 m (60 ft) dele. Cada criatura em uma esfera de 3 m (10 ft) de raio centrada naquele ponto deve realizar uma salvaguarda de Destreza CD 12, sofrend..."
  },
  {
    "name": "Boneca Maligna",
    "source": "MM 2024",
    "cr": "2",
    "ac": 14,
    "hp": 21,
    "speed": "9m",
    "attack": "Giggle . Uma criatura à escolha da boneca dentro de 9 m (30 ft) dela deve ser bem-sucedida em uma salvaguarda de Sabedoria CD 14 ou sofrer 7 (2d6) de dano psíquico e ficar amedrontada por 1 minuto. O alvo pode repetir a salvaguarda no final de cada um de seus turnos, com desvantagem se a boneca estiver em linha de visão, encerrando o efeito sobre si em caso de sucesso."
  },
  {
    "name": "Boticário do Culto",
    "source": "MM 2024",
    "cr": "2",
    "ac": 13,
    "hp": 39,
    "speed": "9m",
    "attack": "Ficha de Boticário do Culto (regras 2014): Médio humanoide, CA 13, PV 39, CR 2. Role direto na mesa com o rolador de dados grátis. Bestiário D&D 5e."
  },
  {
    "name": "Bruxa das Areias",
    "source": "MM",
    "cr": "7",
    "ac": 16,
    "hp": 104,
    "speed": "9m",
    "attack": "Ataque Múltiplo . A bruxa faz três ataques de chicote de areia. Sand Whip . Ataque Corpo a Corpo com Arma: +5 para acertar , alcance 3 m (10 ft), um alvo. Acerto: 4 (1d4 + 2) de dano cortante mais 9 (2d8) de dano de fogo."
  },
  {
    "name": "Bruxa do Mar",
    "source": "MM 2024",
    "cr": "2",
    "ac": 14,
    "hp": 52,
    "speed": "9m",
    "attack": "Garra . Ataque Corpo a Corpo: +5 , alcance 1,5 m (5 ft). 10 (2d6 + 3) de dano cortante. Olhar Mortal ( Recarga 5-6 ) . Salvaguarda de Sabedoria: CD 11, uma criatura Amedrontada que a bruxa possa ver a até 9 m (30 ft). Falha: Se o alvo tiver 20 Pontos de Vida ou menos, ele cai a 0 Pontos de Vida. Caso contrário, o alvo sofre 13 (3d8) de dano psíquico."
  },
  {
    "name": "Bruxa do Pântano",
    "source": "MM",
    "cr": "11",
    "ac": 18,
    "hp": 170,
    "speed": "9m",
    "attack": "Ataque Múltiplo . A bruxa faz dois ataques de garra. Garra . Ataque Corpo a Corpo com Arma: +8 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 17 (3d8 + 4) de dano cortante mais 9 (2d8) de dano de veneno. Aparência Ilusória . A bruxa cobre a si mesma e qualquer coisa que esteja vestindo ou carregando com uma ilusão mágica que a faz parecer outra criatura de tamanho semelhante e forma huma..."
  },
  {
    "name": "Bruxa do Saco",
    "source": "MM 2024",
    "cr": "2",
    "ac": 13,
    "hp": 90,
    "speed": "9m",
    "attack": "Ficha de Bruxa do Saco (regras 2014): Médio feérico, CA 13, PV 90, CR 2. Role direto na mesa com o rolador de dados grátis. Bestiário D&D 5e."
  },
  {
    "name": "Bruxa Noturna",
    "source": "MM 2024",
    "cr": "5",
    "ac": 17,
    "hp": 112,
    "speed": "9m",
    "attack": "Ataque Múltiplo . A bruxa realiza dois ataques de Garra. Garra . Ataque Corpo a Corpo: +7 , alcance 1,5 m (5 ft). 13 (2d8 + 4) de dano cortante."
  },
  {
    "name": "Bruxa Verde",
    "source": "MM 2024",
    "cr": "3",
    "ac": 17,
    "hp": 82,
    "speed": "9m",
    "attack": "Ataque Múltiplo . A bruxa realiza dois ataques de Garra. Garra . Ataque Corpo a Corpo: +6 , alcance 1,5 m (5 ft). 8 (1d8 + 4) de dano cortante mais 3 (1d6) de dano de veneno."
  },
  {
    "name": "Bruxo da Rainha Corvo",
    "source": "MM",
    "cr": "4",
    "ac": 14,
    "hp": 91,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O bruxo faz dois ataques com seu Raio Místico ou sua adaga. Eldritch Blast . Ataque Mágico à Distância: +5 para acertar , alcance 90 m (300 ft), um alvo. Acerto: 9 (1d10 + 3) de dano de força. Se o alvo for uma criatura, ele deve ser bem-sucedido em uma salvaguarda de Força CD 13 ou ser empurrado 3 m (10 ft) para longe do bruxo em linha reta. Adaga . Ataque Corpo a Corpo com A..."
  },
  {
    "name": "Bruxo, Buscador",
    "source": "MM 2024",
    "cr": "2",
    "ac": 13,
    "hp": 52,
    "speed": "9m",
    "attack": "Adaga . Ataque com Arma Corpo a Corpo: +4 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 4 (1d4 + 2) de dano perfurante. Call to the Wave (Recharges after a Long Rest) . O bruxo pode conjurar a magia Criar ou Destruir Água como uma magia de 2º nível."
  },
  {
    "name": "Bruxo, Lâmina Maldita",
    "source": "MM",
    "cr": "9",
    "ac": 15,
    "hp": 195,
    "speed": "9m",
    "attack": "Ficha de Bruxo, Lâmina Maldita (regras 2014): Médio humanoide, CA 15, PV 195, CR 9. Role direto na mesa com o rolador de dados grátis. Bestiário D&D 5e."
  },
  {
    "name": "Bugbear",
    "source": "MM 2024",
    "cr": "1",
    "ac": 16,
    "hp": 27,
    "speed": "9m",
    "attack": "Estrela Matinal . Ataque com Arma de Corpo a Corpo: +4 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 11 (2d8 + 2) de dano perfurante. Azagaia . Ataque com Arma de Corpo a Corpo ou à Distância: +4 para acertar , alcance 1,5 m (5 ft) ou alcance 9/36 m (30/120 ft), um alvo. Acerto: 9 (2d6 + 2) de dano perfurante em corpo a corpo ou 5 (1d6 + 2) de dano perfurante à distância."
  },
  {
    "name": "Bugbear Capanga",
    "source": "MM",
    "cr": "4",
    "ac": 15,
    "hp": 112,
    "speed": "9m",
    "attack": "Ficha de Bugbear Capanga (regras 2014): Médio humanoide, CA 15, PV 112, CR 4. Role direto na mesa com o rolador de dados grátis. Bestiário D&D 5e."
  },
  {
    "name": "Bugbear Totêmico",
    "source": "MM 2024",
    "cr": "2",
    "ac": 14,
    "hp": 91,
    "speed": "9m",
    "attack": "Totem Greatclub . Ataque Corpo a Corpo com Arma: +4 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 12 (3d6 + 2) de dano de concussão. Azagaia . Ataque Corpo a Corpo ou à Distância com Arma: +4 para acertar , alcance 1,5 m (5 ft) ou distância 9/36 m (30/120 ft), um alvo. Acerto: 9 (2d6 + 2) de dano perfurante corpo a corpo, ou 5 (1d6 + 2) de dano perfurante à distância. Summon Totem ( Rec..."
  },
  {
    "name": "Bulette",
    "source": "MM 2024",
    "cr": "5",
    "ac": 17,
    "hp": 94,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O bulette realiza dois ataques de Mordida. Mordida . Ataque Corpo a Corpo: +7 , alcance 1,5 m (5 ft). 17 (2d12 + 4) de dano perfurante. Salto Mortal . A bulette gasta 1,5 m (5 ft) de movimento para saltar até um espaço a até 4,5 m (15 ft) que contenha uma ou mais criaturas Grandes ou menores. Salvaguarda de Destreza: CD 15, cada criatura no espaço de destino da bulette. Falha:..."
  },
  {
    "name": "Cabra",
    "source": "MM 2024",
    "cr": "0",
    "ac": 10,
    "hp": 4,
    "speed": "9m",
    "attack": "Aríete . Ataque Corpo a Corpo: +2 , alcance 1,5 m (5 ft). 1 de dano de concussão, ou 2 (1d4) de dano de concussão se a cabra tiver se movido 6 m (20 ft) ou mais em linha reta na direção do alvo imediatamente antes do acerto."
  },
  {
    "name": "Cabra Gigante",
    "source": "MM 2024",
    "cr": "1/2",
    "ac": 11,
    "hp": 19,
    "speed": "9m",
    "attack": "Aríete . Ataque Corpo a Corpo: +5 , alcance 1,5 m (5 ft). 6 (1d6 + 3) de dano de concussão. Se o alvo for uma criatura Grande ou menor e a cabra tiver se movido 6 m (20 ft) ou mais em linha reta na direção dele imediatamente antes do acerto, o alvo sofre 5 (2d4) de dano de concussão extra e fica com a condição Caído ( Prone ) ."
  },
  {
    "name": "Caçador Pigmeu",
    "source": "MM",
    "cr": "1/2",
    "ac": 13,
    "hp": 45,
    "speed": "9m",
    "attack": "Blowgun . Ataque à Distância com Arma: +5 para acertar , alcance 7,5/30 m (25/100 ft), um alvo. Acerto: 1 de dano perfurante mais 5 (2d4) de dano de veneno."
  },
  {
    "name": "Caco",
    "source": "MM 2024",
    "cr": "8",
    "ac": 12,
    "hp": 187,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O caco faz dois ataques com porrete grande. Clava Grande . Ataque Corpo a Corpo com Arma: +10 para acertar , alcance 4,5 m (15 ft), um alvo. Acerto: 26 (3d12 + 7) de dano de concussão. Rocha . Ataque à Distância com Arma: +10 para acertar , alcance 18/72 m (60/240 ft), um alvo. Acerto: 29 (4d10 + 7) de dano de concussão. Ataques de Sopro ( Recarga 5-6 ) . O caco usa uma das se..."
  },
  {
    "name": "Camelo",
    "source": "MM 2024",
    "cr": "1/8",
    "ac": 10,
    "hp": 17,
    "speed": "9m",
    "attack": "Mordida . Ataque Corpo a Corpo: +4 , alcance 1,5 m (5 ft). 4 (1d4 + 2) de dano de concussão."
  },
  {
    "name": "Caminhante Amaldiçoado",
    "source": "MM 2024",
    "cr": "6",
    "ac": 14,
    "hp": 112,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O wight faz dois ataques com machado de batalha. Ele pode usar seu Drenar Vida no lugar de um ataque com machado de batalha. Machado de Batalha . Ataque com Arma Corpo a Corpo: +6 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 7 (1d8 + 3) de dano cortante mais 7 (2d6) de dano de frio, ou 8 (1d10 + 3) de dano cortante mais 7 (2d6) de dano de frio se usado com duas mãos. ..."
  },
  {
    "name": "Cão da Morte",
    "source": "MM 2024",
    "cr": "1",
    "ac": 12,
    "hp": 39,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O cão faz dois ataques de mordida. Mordida . Ataque Corpo a Corpo: +4 , alcance 1,5 m (5 ft). 4 (1d4 + 2) de dano perfurante. Se o alvo for uma criatura, ele é submetido ao efeito a seguir. Salvaguarda de Constituição: CD 12. Primeira Falha: O alvo fica com a condição Envenenado ( Poisoned ) . Enquanto Envenenado , o máximo de Pontos de Vida do alvo não volta ao normal ao term..."
  },
  {
    "name": "Cão da Névoa",
    "source": "MM 2024",
    "cr": "5",
    "ac": 14,
    "hp": 136,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O cão da névoa faz dois ataques de mordida. Mordida . Ataque Corpo a Corpo com Arma: +6 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 11 (2d8 + 3) de dano perfurante. Se o alvo for uma criatura, ele deve ser bem-sucedido em uma salvaguarda de Força CD 14 ou será derrubado."
  },
  {
    "name": "Cão Infernal",
    "source": "MM 2024",
    "cr": "3",
    "ac": 15,
    "hp": 58,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O cão realiza dois ataques de Mordida. Mordida . Ataque Corpo a Corpo: +5 , alcance 1,5 m (5 ft). 7 (1d8 + 3) de dano perfurante mais 3 (1d6) de dano de fogo. Sopro Ígneo ( Recarga 5-6 ) . Salvaguarda de Destreza: CD 12, cada criatura em um Cone de 4,5 m (15 ft). Falha: 17 (5d6) de dano de fogo. Sucesso: Metade do dano."
  },
  {
    "name": "Cão Pata-de-Prata",
    "source": "MM 2024",
    "cr": "1",
    "ac": 14,
    "hp": 32,
    "speed": "9m",
    "attack": "Mordida . Ataque Corpo a Corpo com Arma: +5 para acertar , alcance 1,5 m (5 ft), uma criatura. Acerto: 8 (2d4 + 3) de dano perfurante. Se o alvo for uma criatura, deve ser bem-sucedido em uma salvaguarda de Força CD 13 ou ser derrubado."
  },
  {
    "name": "Cão Piscante",
    "source": "MM 2024",
    "cr": "1/4",
    "ac": 13,
    "hp": 22,
    "speed": "9m",
    "attack": "Mordida . Ataque Corpo a Corpo: +5 , alcance 1,5 m (5 ft). 5 (1d4 + 3) de dano perfurante."
  },
  {
    "name": "Cão Rúnico",
    "source": "MM 2024",
    "cr": "5",
    "ac": 15,
    "hp": 136,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O cão rúnico faz dois ataques de mordida. Mordida . Ataque Corpo a Corpo com Arma: +7 para acertar , alcance 3 m (10 ft), um alvo. Acerto: 11 (2d6 + 4) de dano perfurante. Vile Spew ( Recharge 5-6 ) . O cão rúnico cospe ácido em um cone de 4,5 m (15 ft). Cada criatura nessa área deve fazer uma salvaguarda de Destreza CD 13, recebendo 21 (6d6) de dano ácido em uma falha, ou met..."
  },
  {
    "name": "Capanga",
    "source": "MM 2024",
    "cr": "1/2",
    "ac": 11,
    "hp": 32,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O capanga faz dois ataques corpo a corpo. Maça . Ataque Corpo a Corpo com Arma: +4 para acertar , alcance 1,5 m (5 ft), uma criatura. Acerto: 5 (1d6 + 2) de dano de concussão. Besta Pesada . Ataque à Distância com Arma: +2 para acertar , alcance 30/120 m (100/400 ft), um alvo. Acerto: 5 (1d10) de dano perfurante."
  },
  {
    "name": "Capitão Bandido",
    "source": "MM 2024",
    "cr": "2",
    "ac": 15,
    "hp": 52,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O capitão faz três ataques corpo a corpo: dois com sua cimitarra e um com sua adaga. Ou o capitão faz dois ataques à distância com suas adagas. Cimitarra . Ataque com Arma Corpo a Corpo: +5 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 6 (1d6 + 3) de dano cortante. Pistola . Ataque à Distância: +5 , distância 9/27 m (30/90 ft). 8 (1d10 + 3) de dano perfurante."
  },
  {
    "name": "Capitão Hobgoblin",
    "source": "MM 2024",
    "cr": "3",
    "ac": 17,
    "hp": 58,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O hobgoblin faz dois ataques, usando Greatsword ou Longbow em qualquer combinação. Espada Grande . Ataque Corpo a Corpo: +4 , alcance 1,5 m (5 ft). 9 (2d6 + 2) de dano Cortante mais 3 (1d6) de dano de Veneno. Arco Longo . Ataque à Distância: +4 , alcance 45/180 m (150/600 ft). 6 (1d8 + 2) de dano Perfurante mais 5 (2d4) de dano de Veneno."
  },
  {
    "name": "Capitribus",
    "source": "MM 2024",
    "cr": "13",
    "ac": 17,
    "hp": 253,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O capitribus faz três ataques de pancada. Golpe . Ataque Corpo a Corpo com Arma: +11 para acertar , alcance 3 m (10 ft), um alvo. Acerto: 24 (4d8 + 6) de dano de concussão. Rocha . Ataque à Distância com Arma: +11 para acertar , alcance 18/72 m (60/240 ft), um alvo. Acerto: 33 (5d10 + 6) de dano de concussão."
  },
  {
    "name": "Caranguejo",
    "source": "MM 2024",
    "cr": "0",
    "ac": 11,
    "hp": 3,
    "speed": "9m",
    "attack": "Garra . Ataque Corpo a Corpo: +2 , alcance 1,5 m (5 ft). 1 de dano de concussão."
  },
  {
    "name": "Caranguejo Gigante",
    "source": "MM 2024",
    "cr": "1/8",
    "ac": 15,
    "hp": 13,
    "speed": "9m",
    "attack": "Garra . Ataque Corpo a Corpo com Arma: +3 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 4 (1d6 + 1) de dano de concussão, e o alvo fica imobilizado (CD 11 para escapar). O caranguejo tem duas garras, cada uma das quais pode agarrar apenas um alvo."
  },
  {
    "name": "Caranguejo-Elmo",
    "source": "MM 2024",
    "cr": "3",
    "ac": 14,
    "hp": 93,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O caranguejo faz dois ataques de garra. Garra . Ataque Corpo a Corpo com Arma: +5 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 7 (1d8 + 3) de dano cortante mais 5 (2d4) de dano ácido. Corroding Claw ( Recharge 6 ) . O caranguejo corrói um objeto metálico ferroso não mágico que possa tocar. Se o objeto não estiver sendo vestido ou carregado, o toque destrói um cubo de ..."
  },
  {
    "name": "Carniçal",
    "source": "MM 2024",
    "cr": "1",
    "ac": 12,
    "hp": 22,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O carniçal realiza dois ataques de Mordida. Mordida . Ataque Corpo a Corpo: +4 , alcance 1,5 m (5 ft). 5 (1d6 + 2) de dano perfurante mais 3 (1d6) de dano necrótico. Garra . Ataque Corpo a Corpo: +4 , alcance 1,5 m (5 ft). 4 (1d4 + 2) de dano cortante. Se o alvo for uma criatura que não seja um Morto-Vivo ou elfo, ele fica sujeito ao seguinte efeito. Salvaguarda de Constituiçã..."
  },
  {
    "name": "Carniceiro da Ninhada",
    "source": "MM 2024",
    "cr": "9",
    "ac": 14,
    "hp": 184,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O carniceiro faz dois ataques de garra. Garra . Ataque Corpo a Corpo com Arma: +10 para acertar , alcance 3 m (10 ft), um alvo. Acerto: 22 (3d10 + 6) de dano cortante. Constrição . Ataque Corpo a Corpo com Arma: +10 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 19 (3d8 + 6) de dano de concussão, e o alvo fica imobilizado (CD de escape 16). Até que essa condição de agar..."
  },
  {
    "name": "Carnífero",
    "source": "MM 2024",
    "cr": "12",
    "ac": 16,
    "hp": 138,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O carnífero faz dois ataques: um com sua raiz e um com seu golpe. Root . Ataque Corpo a Corpo com Arma: +10 para acertar , todos os alvos no chão em um raio de 9 m (30 ft). Acerto: 9 (1d6 + 6) de dano de concussão, e o alvo fica imobilizado (CD de escape 16). Até que esse agarrão termine, cada alvo sofre 9 (1d6 + 6) de dano de concussão no final de seu turno. Golpe . Ataque Co..."
  },
  {
    "name": "Cavaleiro",
    "source": "MM 2024",
    "cr": "3",
    "ac": 18,
    "hp": 52,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O cavaleiro faz dois ataques corpo a corpo. Espada Grande . Ataque Corpo a Corpo: +5 , alcance 1,5 m (5 ft). 10 (2d6 + 3) de dano cortante mais 4 (1d8) de dano radiante. Besta Pesada . Ataque à Distância: +2 , alcance 30/120 m (100/400 ft). 11 (2d10) de dano perfurante mais 4 (1d8) de dano radiante."
  },
  {
    "name": "Cavaleiro Cervo",
    "source": "MM",
    "cr": "11",
    "ac": 16,
    "hp": 225,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O cavaleiro faz três ataques corpo a corpo ou três ataques à distância. Ele pode usar Saraivada no lugar de um ataque com arco de espinheiro, se estiver disponível. Briarthorn Bow . Ataque com Arma à Distância: +9 para acertar , alcance 24/96 m (80/320 ft), um alvo. Acerto: 14 (2d8 + 5) de dano perfurante. Se o alvo for uma criatura, ele fica imobilizado (CD de escape 17) pela..."
  },
  {
    "name": "Cavaleiro Insone",
    "source": "MM",
    "cr": "13",
    "ac": 18,
    "hp": 190,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O cavaleiro faz três ataques de areias do sono. Ele pode usar Onda de Exaustão ( Exhaustion ) no lugar de um ataque, se estiver disponível. Sands of Slumber . Ataque com Arma à Distância: +12 para acertar , alcance 3/6 m (10/20 ft), um alvo. Acerto: 22 (3d10 + 6) de dano de concussão. Se o alvo for uma criatura, ele deve ser bem-sucedido em uma salvaguarda de Constituição CD 1..."
  },
  {
    "name": "Cavaleiro Sem Cabeça",
    "source": "MM 2024",
    "cr": "8",
    "ac": 15,
    "hp": 153,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O cavaleiro faz dois ataques corpo a corpo. Vorpal Longsword . Ataque com Arma Corpo a Corpo: +7 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 17 (3d8 + 4) de dano cortante. Quando o cavaleiro rola um 20 na jogada de ataque, se o dano reduziria a criatura a 0 pontos de vida, o cavaleiro decapita a criatura. Jack-o'-lantern ( Recharge 6 ) . Ranged Weapon Attack: +7 to h..."
  },
  {
    "name": "Cavaleiro Silencioso",
    "source": "MM",
    "cr": "10",
    "ac": 19,
    "hp": 225,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O cavaleiro faz três ataques de malho trovejante. Thundermaul . Ataque com Arma Corpo a Corpo ou à Distância: +9 para acertar , alcance 1,5 m (5 ft) ou alcance 9/36 m (30/120 ft), um alvo. Acerto: 12 (2d6 + 5) de dano de concussão mais 10 (3d6) de dano de trovão. Steps of Thunder ( Recharge 6 ) . Os passos do cavaleiro repentinamente ecoam como trovão. O cavaleiro se move até ..."
  },
  {
    "name": "Cavalo de Carga",
    "source": "MM 2024",
    "cr": "1/4",
    "ac": 10,
    "hp": 15,
    "speed": "9m",
    "attack": "Cascos . Ataque Corpo a Corpo: +6 , alcance 1,5 m (5 ft). 6 (1d4 + 4) de dano de concussão."
  },
  {
    "name": "Cavalo de Guerra",
    "source": "MM 2024",
    "cr": "1/2",
    "ac": 11,
    "hp": 19,
    "speed": "9m",
    "attack": "Cascos . Ataque Corpo a Corpo: +6 , alcance 1,5 m (5 ft). 9 (2d4 + 4) de dano de concussão. Se o alvo for uma criatura Grande ou menor e o cavalo tiver se movido 6 m (20 ft) ou mais em linha reta na direção dele imediatamente antes do acerto, o alvo sofre 5 (2d4) de dano de concussão extra e fica com a condição Caído ( Prone ) ."
  },
  {
    "name": "Cavalo de Madeira",
    "source": "MM 2024",
    "cr": "1",
    "ac": 11,
    "hp": 39,
    "speed": "9m",
    "attack": "Cascos . Ataque com Arma Corpo a Corpo: +6 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 8 (1d8 + 4) de dano de concussão."
  },
  {
    "name": "Cavalo de Montaria",
    "source": "MM 2024",
    "cr": "1/4",
    "ac": 11,
    "hp": 13,
    "speed": "9m",
    "attack": "Cascos . Ataque Corpo a Corpo: +5 , alcance 1,5 m (5 ft). 7 (1d8 + 3) de dano de concussão."
  },
  {
    "name": "Cavalo-Marinho",
    "source": "MM 2024",
    "cr": "0",
    "ac": 11,
    "hp": 1,
    "speed": "9m",
    "attack": "Ficha de Cavalo-Marinho (regras 2014): Minúsculo fera, CA 11, PV 1, CR 0. Role direto na mesa com o rolador de dados grátis. Bestiário D&D 5e."
  },
  {
    "name": "Cavalo-Marinho Gigante",
    "source": "MM 2024",
    "cr": "1/2",
    "ac": 13,
    "hp": 16,
    "speed": "9m",
    "attack": "Aríete . Ataque Corpo a Corpo com Arma: +3 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 4 (1d6 + 1) de dano de concussão."
  },
  {
    "name": "Centauro",
    "source": "MM 2024",
    "cr": "2",
    "ac": 12,
    "hp": 45,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O centauro realiza dois ataques: um com sua lança e um com seus cascos, ou dois com seu arco longo. Pique . Ataque com Arma de Corpo a Corpo: +6 para acertar , alcance 3 m (10 ft), um alvo. Acerto: 9 (1d10 + 4) de dano perfurante. Cascos . Ataque com Arma de Corpo a Corpo: +6 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 11 (2d6 + 4) de dano de concussão. Arco Longo . ..."
  },
  {
    "name": "Centopeia Gigante",
    "source": "MM 2024",
    "cr": "1/4",
    "ac": 14,
    "hp": 9,
    "speed": "9m",
    "attack": "Mordida . Ataque Corpo a Corpo com Arma: +4 para acertar , alcance 1,5 m (5 ft), uma criatura. Acerto: 4 (1d4 + 2) de dano perfurante, e o alvo deve ser bem-sucedido em uma salvaguarda de Constituição CD 11 ou sofrer 10 (3d6) de dano de veneno. Se o dano de veneno reduzir o alvo a 0 pontos de vida, o alvo fica estável mas envenenado por 1 hora, mesmo após recuperar pontos de vida, e fica parali..."
  },
  {
    "name": "Cervo",
    "source": "MM 2024",
    "cr": "0",
    "ac": 13,
    "hp": 4,
    "speed": "9m",
    "attack": "Aríete . Ataque Corpo a Corpo: +2 , alcance 1,5 m (5 ft). 2 (1d4) de dano de concussão."
  },
  {
    "name": "Chacal",
    "source": "MM 2024",
    "cr": "0",
    "ac": 12,
    "hp": 3,
    "speed": "9m",
    "attack": "Mordida . Ataque Corpo a Corpo com Arma: +1 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 1 (1d4 - 1) de dano perfurante."
  },
  {
    "name": "Chefe Goblin",
    "source": "MM 2024",
    "cr": "1",
    "ac": 17,
    "hp": 21,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O goblin faz dois ataques, usando Cimitarra ou Arco Curto em qualquer combinação. Cimitarra . Ataque Corpo a Corpo: +4 , alcance 1,5 m (5 ft). 5 (1d6 + 2) de dano Cortante, mais 2 (1d4) de dano Cortante se a jogada de ataque teve Vantagem. Arco Curto . Ataque à Distância: +4 , alcance 24/96 m (80/320 ft). 5 (1d6 + 2) de dano Perfurante, mais 2 (1d4) de dano Perfurante se a jog..."
  },
  {
    "name": "Chocalho Animado",
    "source": "MM 2024",
    "cr": "5",
    "ac": 11,
    "hp": 142,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O chocalho faz dois ataques de pancada. Golpe . Ataque com Arma Corpo a Corpo: +8 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 16 (2d10 + 5) de dano de concussão. Se o alvo for uma criatura, ele deve ser bem-sucedido em uma salvaguarda de Força CD 15 ou ser derrubado."
  },
  {
    "name": "Chuul",
    "source": "MM 2024",
    "cr": "4",
    "ac": 16,
    "hp": 76,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O chuul faz dois ataques com suas pinças. Se o chuul estiver agarrando uma criatura, ele também pode usar seus tentáculos uma vez. Pinça . Ataque Corpo a Corpo: +6 , alcance 3 m (10 ft). 9 (1d10 + 4) de dano de concussão. Se o alvo for uma criatura Grande ou menor, ele fica com a condição Imobilizado ( Grappled ) (CD 14 para escapar) por uma das duas pinças. Tentáculos Paralis..."
  },
  {
    "name": "Ciclope de Olho Pétreo",
    "source": "MM 2024",
    "cr": "8",
    "ac": 16,
    "hp": 172,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O ciclope faz três ataques de porrete grande. O ciclope pode usar raio petrificante no lugar de um ataque de porrete grande. Clava Grande . Ataque Corpo a Corpo com Arma: +9 para acertar , alcance 3 m (10 ft), um alvo. Acerto: 19 (3d8 + 6) de dano de concussão. Rocha . Ataque à Distância com Arma: +9 para acertar , distância 9/36 m (30/120 ft), um alvo. Acerto: 28 (4d10 + 6) d..."
  },
  {
    "name": "Cisto Colossal",
    "source": "MM 2024",
    "cr": "16",
    "ac": 17,
    "hp": 136,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O cisto colossal faz dois ataques de garra. Garra . Ataque Corpo a Corpo com Arma: +11 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 15 (2d8 + 6) de dano cortante mais 9 (2d8) de dano necrótico. Tentacle Barrage ( Recharge 6 ) . Ataque Corpo a Corpo com Arma: +11 para acertar , alcance 3 m (10 ft), todas as criaturas no alcance. Acerto: 19 (3d8 + 6) de dano perfurante ..."
  },
  {
    "name": "Cisto Furtivo",
    "source": "MM 2024",
    "cr": "4",
    "ac": 14,
    "hp": 123,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O cisto faz dois ataques de laço intestinal. Ele pode usar Drenar Sangue no lugar de um ataque. Intestine Loop . Ataque Corpo a Corpo com Arma: +6 para acertar , alcance 3 m (10 ft), um alvo. Acerto: 7 (1d6 + 4) de dano de concussão mais 2 (1d4) de dano necrótico, e se o alvo for uma criatura Média ou menor, fica imobilizado (CD de escape 14). O cisto só pode agarrar uma criat..."
  },
  {
    "name": "Cleavergaunt",
    "source": "MM 2024",
    "cr": "13",
    "ac": 17,
    "hp": 212,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O cleavergaunt faz quatro ataques de cutelo. Cleaver . Ataque Corpo a Corpo com Arma: +10 para acertar , alcance 3 m (10 ft), um alvo. Acerto: 18 (2d12 + 5) de dano cortante."
  },
  {
    "name": "Clérigo do Domínio da Cidade",
    "source": "MM",
    "cr": "9",
    "ac": 18,
    "hp": 117,
    "speed": "9m",
    "attack": "Besta de Mão . Ataque à Distância com Arma: +7 para acertar , distância 9/36 m (30/120 ft), um alvo. Acerto: 6 (1d6 + 3) de dano perfurante, mais 4 (1d8) de dano psíquico. Rapieira . Ataque Corpo a Corpo com Arma: +7 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 7 (1d8 + 3) de dano perfurante, mais 4 (1d8) de dano psíquico."
  },
  {
    "name": "Clérigo do Domínio da Forja",
    "source": "MM 2024",
    "cr": "6",
    "ac": 19,
    "hp": 71,
    "speed": "9m",
    "attack": "Ficha de Clérigo do Domínio da Forja (regras 2014): Pequeno humanoide, CA 19, PV 71, CR 6. Role direto na mesa com o rolador de dados grátis. Bestiário D&D…"
  },
  {
    "name": "Clérigo do Domínio da Proteção",
    "source": "MM",
    "cr": "3",
    "ac": 20,
    "hp": 44,
    "speed": "9m",
    "attack": "Azagaia . Ataque Corpo a Corpo ou à Distância com Arma: +4 para acertar , alcance 1,5 m (5 ft) ou distância 9/36 m (30/120 ft), um alvo. Acerto: 5 (ld6 + 2) de dano perfurante. Radiant Defense (3/Day) . O clérigo canaliza energia abençoada em um aliado que possa ver a até 9 m (30 ft). Na primeira vez que esse aliado for atingido por um ataque no próximo minuto, o atacante sofre 18 (2d10 + 7) de..."
  },
  {
    "name": "Clérigo do Domínio do Túmulo",
    "source": "MM 2024",
    "cr": "12",
    "ac": 20,
    "hp": 150,
    "speed": "9m",
    "attack": "Sickle . Ataque Corpo a Corpo com Arma: +6 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 4 (1d4 + 2) de dano cortante, mais 9 (2d8) de dano necrótico. Healing Hands (Recharges after a Long Rest) . O clérigo pode tocar uma criatura e fazer com que ela recupere 17 pontos de vida. Necrotic Shroud. (Recharges after a Long Rest) . O clérigo libera a energia divina dentro de si, fazendo seus ..."
  },
  {
    "name": "Cobra Constritora",
    "source": "MM 2024",
    "cr": "1/4",
    "ac": 13,
    "hp": 13,
    "speed": "9m",
    "attack": "Mordida . Ataque Corpo a Corpo: +4 , alcance 1,5 m (5 ft). 6 (1d8 + 2) de dano perfurante. Constrição . Salvaguarda de Força: CD 12, uma criatura Média ou menor que a cobra possa ver a até 1,5 m (5 ft). Falha: 7 (3d4) de dano de concussão, e o alvo fica com a condição Imobilizado ( Grappled ) (CD 12 para escapar)."
  },
  {
    "name": "Cobra Constritora Gigante",
    "source": "MM 2024",
    "cr": "2",
    "ac": 12,
    "hp": 60,
    "speed": "9m",
    "attack": "Ataque Múltiplo . A cobra realiza um ataque de Mordida e usa Constrição. Mordida . Ataque Corpo a Corpo com Arma: +6 para acertar , alcance 3 m (10 ft), uma criatura. Acerto: 11 (2d6 + 4) de dano perfurante. Constrição . Salvaguarda de Força: CD 14, uma criatura Grande ou menor que a cobra possa ver a até 3 m (10 ft). Falha: 13 (2d8 + 4) de dano de concussão, e o alvo fica com a condição Imobil..."
  },
  {
    "name": "Cobra Venenosa",
    "source": "MM 2024",
    "cr": "1/8",
    "ac": 13,
    "hp": 2,
    "speed": "9m",
    "attack": "Mordida . Ataque Corpo a Corpo com Arma: +5 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 1 de dano perfurante, e o alvo deve realizar uma salvaguarda de Constituição CD 10, sofrendo 5 (2d4) de dano por veneno em caso de falha, ou metade desse dano em caso de sucesso."
  },
  {
    "name": "Cobra Venenosa Gigante",
    "source": "MM 2024",
    "cr": "1/4",
    "ac": 14,
    "hp": 11,
    "speed": "9m",
    "attack": "Mordida . Ataque Corpo a Corpo com Arma: +6 para acertar , alcance 3 m (10 ft), um alvo. Acerto: 6 (1d4 + 4) de dano perfurante, e o alvo deve realizar uma salvaguarda de Constituição CD 11, sofrendo 10 (3d6) de dano de veneno em uma falha, ou metade desse dano em um sucesso."
  },
  {
    "name": "Cobra Voadora",
    "source": "MM 2024",
    "cr": "1/8",
    "ac": 14,
    "hp": 5,
    "speed": "9m",
    "attack": "Mordida . Ataque Corpo a Corpo: +4 , alcance 1,5 m (5 ft). 1 de dano perfurante mais 5 (2d4) de dano de veneno."
  },
  {
    "name": "Cocatriz",
    "source": "MM 2024",
    "cr": "1/2",
    "ac": 11,
    "hp": 22,
    "speed": "9m",
    "attack": "Mordida Petrificante . Ataque Corpo a Corpo: +3 , alcance 1,5 m (5 ft). 3 (1d4 + 1) de dano perfurante. Se o alvo for uma criatura, ele fica sujeito ao seguinte efeito. Salvaguarda de Constituição: CD 11. Primeira Falha: O alvo fica com a condição Contido ( Restrained ) . O alvo repete o teste no fim de seu próximo turno se ainda estiver Contido , encerrando o efeito sobre si mesmo em um sucess..."
  },
  {
    "name": "Coletor de Cadáveres",
    "source": "MM 2024",
    "cr": "15",
    "ac": 19,
    "hp": 199,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O coletor faz três ataques de pancada. O coletor pode usar Empalar no lugar de dois ataques de pancada. Golpe . Ataque Corpo a Corpo com Arma: +11 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 17 (2d10 + 6) de dano de concussão. Se o alvo for uma criatura Média ou menor, ele fica imobilizado (CD de escape 19). O coletor tem duas mãos, cada uma podendo agarrar apenas um..."
  },
  {
    "name": "Colmeia Ambulante",
    "source": "MM 2024",
    "cr": "5",
    "ac": 16,
    "hp": 115,
    "speed": "9m",
    "attack": "Ataque Múltiplo . A colmeia ambulante faz dois ataques de pancada. Golpe . Ataque Corpo a Corpo com Arma: +6 para acertar , alcance 3 m (10 ft), um alvo. Acerto: 12 (2d8 + 3) de dano contundente. Release Swarm . A colmeia ambulante libera até 2 enxames de besouros, insetos ou vespas. Os enxames aparecem em espaços desocupados a até 1,5 m (5 ft) da colmeia ambulante, agem como aliados da colmeia..."
  },
  {
    "name": "Constritora de Enfeites",
    "source": "MM 2024",
    "cr": "4",
    "ac": 15,
    "hp": 82,
    "speed": "9m",
    "attack": "Mordida . Ataque Corpo a Corpo com Arma: +6 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 16 (2d10 + 5) de dano perfurante. Puncturing Wrap . Ataque Corpo a Corpo com Arma: +6 para acertar , alcance 1,5 m (5 ft), uma criatura. Acerto: 13 (2d8 + 4) de dano perfurante, e o alvo fica imobilizado (CD 16 para escapar). Até que esse agarrão termine, a criatura está contida , e a constritora n..."
  },
  {
    "name": "Corguia",
    "source": "MM 2024",
    "cr": "1/8",
    "ac": 12,
    "hp": 7,
    "speed": "9m",
    "attack": "Garras . Ataque Corpo a Corpo com Arma: +4 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 4 (1d4 + 2) de dano cortante."
  },
  {
    "name": "Corpo Seco de Poeira",
    "source": "MM",
    "cr": "8",
    "ac": 15,
    "hp": 161,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O wight faz dois ataques de toque desagregador. Crumbling Touch . Ataque Corpo a Corpo com Arma: +9 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 25 (4d8 + 6) de dano necrótico. O alvo deve ser bem-sucedido em uma salvaguarda de Constituição CD 14 ou seu máximo de pontos de vida é reduzido em uma quantidade igual ao dano recebido. Essa redução dura até o alvo completar..."
  },
  {
    "name": "Coruja",
    "source": "MM 2024",
    "cr": "0",
    "ac": 11,
    "hp": 1,
    "speed": "9m",
    "attack": "Garras . Ataque Corpo a Corpo com Arma: +3 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 1 de dano cortante."
  },
  {
    "name": "Coruja Gigante",
    "source": "MM 2024",
    "cr": "1/4",
    "ac": 12,
    "hp": 19,
    "speed": "9m",
    "attack": "Garras . Ataque Corpo a Corpo: +4 , alcance 1,5 m (5 ft). 7 (1d10 + 2) de dano cortante."
  },
  {
    "name": "Corvo",
    "source": "MM 2024",
    "cr": "0",
    "ac": 12,
    "hp": 2,
    "speed": "9m",
    "attack": "Bico . Ataque Corpo a Corpo com Arma: +4 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 1 de dano perfurante."
  },
  {
    "name": "Corvomante",
    "source": "MM 2024",
    "cr": "1/2",
    "ac": 13,
    "hp": 10,
    "speed": "9m",
    "attack": "Mind Pierce . Ataque à Distância com Magia: +4 para acertar , alcance 18/36 m (60/120 ft), uma criatura. Acerto: 7 (1d10 + 2) de dano psíquico."
  },
  {
    "name": "Couatl",
    "source": "MM 2024",
    "cr": "4",
    "ac": 19,
    "hp": 60,
    "speed": "9m",
    "attack": "Mordida . Ataque Corpo a Corpo: +7 , alcance 1,5 m (5 ft). 11 (1d12 + 5) de dano perfurante, e o alvo fica com a condição Envenenado ( Poisoned ) até o fim do próximo turno do couatl. Constrição . Salvaguarda de Força: CD 15, uma criatura Média ou menor que o couatl possa ver a até 1,5 m (5 ft). Falha: 8 (1d6 + 5) de dano de concussão. O alvo fica com a condição Imobilizado ( Grappled ) (CD 13 ..."
  },
  {
    "name": "Crânio Aranha",
    "source": "MM 2024",
    "cr": "1/2",
    "ac": 13,
    "hp": 13,
    "speed": "9m",
    "attack": "Mordida . Ataque Corpo a Corpo com Arma: +5 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 5 (1d4 + 3) de dano perfurante, e o crânio se prende ao alvo. Se o alvo for Médio ou menor e o crânio tiver vantagem na jogada de ataque, ele se prende ao rosto do alvo, e o alvo também fica cego enquanto o crânio estiver preso dessa forma. Enquanto preso ao alvo, o crânio não pode atacar outra cri..."
  },
  {
    "name": "Crânio Flamejante Metaleiro",
    "source": "MM 2024",
    "cr": "4",
    "ac": 14,
    "hp": 90,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O crânio flamejante faz três ataques de raio de fogo. Fire Ray . Ataque Mágico à Distância: +5 para acertar , alcance 9 m (30 ft), um alvo. Acerto: 10 (3d6) de dano de fogo."
  },
  {
    "name": "Cria da Agonia",
    "source": "MM 2024",
    "cr": "3",
    "ac": 13,
    "hp": 120,
    "speed": "9m",
    "attack": "Bonespear . Ataque Corpo a Corpo ou à Distância com Arma: +5 para acertar , alcance 1,5 m (5 ft) ou distância 6/18 m (20/60 ft), um alvo. Acerto: 7 (1d8 + 3) de dano perfurante, e o alvo deve ser bem-sucedido em uma salvaguarda de Constituição CD 13 ou sofre 10 (3d6) de dano necrótico e fica envenenado até o final de seu próximo turno enquanto é tomado por uma dor excruciante. Garra . Ataque Co..."
  },
  {
    "name": "Cria Vampírica",
    "source": "MM 2024",
    "cr": "5",
    "ac": 16,
    "hp": 90,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O vampiro faz dois ataques, sendo que apenas um deles pode ser um ataque de mordida. Garra . Ataque Corpo a Corpo: +6 , alcance 1,5 m (5 ft). 8 (2d4 + 3) de dano cortante. Se o alvo for uma criatura Média ou menor, ele fica com a condição Imobilizado ( Grappled ) (CD de fuga 13) de uma de duas garras. Mordida . Salvaguarda de Constituição: CD 14, uma criatura a até 1,5 m (5 ft..."
  },
  {
    "name": "Crocodilo",
    "source": "MM 2024",
    "cr": "1/2",
    "ac": 12,
    "hp": 13,
    "speed": "9m",
    "attack": "Mordida . Ataque Corpo a Corpo: +4 , alcance 1,5 m (5 ft). 6 (1d8 + 2) de dano perfurante. Se o alvo for uma criatura Média ou menor, ele fica com a condição Imobilizado ( Grappled ) (CD 12 para escapar). Enquanto Imobilizado , o alvo fica com a condição Contido ( Restrained ) ."
  },
  {
    "name": "Crocodilo Gigante",
    "source": "MM 2024",
    "cr": "5",
    "ac": 14,
    "hp": 85,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O crocodilo faz dois ataques: um com sua mordida e um com sua cauda. Mordida . Ataque Corpo a Corpo: +8 , alcance 1,5 m (5 ft). 21 (3d10 + 5) de dano perfurante. Se o alvo for uma criatura Grande ou menor, ele fica com a condição Imobilizado ( Grappled ) (CD 15 para escapar). Enquanto estiver Imobilizado , o alvo fica com a condição Contido ( Restrained ) e não pode ser alvo d..."
  },
  {
    "name": "Cronocoruja",
    "source": "MM",
    "cr": "13",
    "ac": 14,
    "hp": 198,
    "speed": "9m",
    "attack": "Ataque Múltiplo . A cronocoruja faz três ataques: um com seu bico e dois com suas garras. Bico . Ataque Corpo a Corpo com Arma: +9 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 13 (2d8 + 4) de dano perfurante. Garra . Ataque Corpo a Corpo com Arma: +9 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 11 (2d6 + 4) de dano cortante."
  },
  {
    "name": "Cronomante Ancião",
    "source": "MM 2024",
    "cr": "7",
    "ac": 16,
    "hp": 67,
    "speed": "9m",
    "attack": "Unmake . O cronomante escolhe uma criatura que ele possa ver a até 18 m (60 ft) dele, fazendo com que a carne do alvo envelheça e se decomponha rapidamente. O alvo deve fazer uma salvaguarda de Constituição CD 14, sofrendo 16 (3d10) de dano necrótico em uma falha, ou metade desse dano em um sucesso."
  },
  {
    "name": "Cronomante Atemporal",
    "source": "MM",
    "cr": "14",
    "ac": 18,
    "hp": 150,
    "speed": "9m",
    "attack": "Expose Paradox ( Recharge 5-6 ) . O cronomante escolhe uma criatura que ele possa ver a até 18 m (60 ft) dele, revelando a ela um paradoxo no contínuo espaço-tempo. O alvo deve realizar uma salvaguarda de Sabedoria CD 18, sofrendo 42 (12d6) de dano psíquico em uma falha, ou metade desse dano em um sucesso."
  },
  {
    "name": "Cubo Gelatinoso",
    "source": "MM 2024",
    "cr": "2",
    "ac": 6,
    "hp": 63,
    "speed": "9m",
    "attack": "Pseudópode . Ataque Corpo a Corpo: +4 , alcance 1,5 m (5 ft). 12 (3d6 + 2) de dano ácido. Envolver . O cubo se move até seu Deslocamento sem provocar Ataques de Oportunidade. O cubo pode se mover pelos espaços de criaturas Grandes ou menores se tiver espaço dentro de si para contê-las (veja o traço Cubo de Gosma). Salvaguarda de Destreza: CD 12, cada criatura em cujo espaço o cubo entra pela pr..."
  },
  {
    "name": "Cultista",
    "source": "MM 2024",
    "cr": "1/8",
    "ac": 12,
    "hp": 9,
    "speed": "9m",
    "attack": "Foice Ritual . Ataque Corpo a Corpo: +3 , alcance 1,5 m (5 ft). 3 (1d4 + 1) de dano cortante mais 1 de dano necrótico."
  },
  {
    "name": "Cultista Lançador de Pragas",
    "source": "MM",
    "cr": "7",
    "ac": 14,
    "hp": 136,
    "speed": "9m",
    "attack": "Scythe . Ataque Corpo a Corpo com Arma: +5 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 5 (1d6 + 2) de dano cortante. Plague of Locusts ( Recharge 6 ) . O cultista conjura Praga de Insetos, sem necessidade de componentes materiais."
  },
  {
    "name": "Cuspidor de Sanguessugas",
    "source": "MM 2024",
    "cr": "1",
    "ac": 10,
    "hp": 71,
    "speed": "9m",
    "attack": "Mordida . Ataque Corpo a Corpo com Arma: +5 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 10 (2d6 + 3) de dano perfurante e o alvo fica imobilizado (CD 13 para escapar). Até que esse agarrão termine, o cuspidor não pode usar Cuspe de Sanguessuga e não pode usar sua mordida contra outro alvo. A criatura ou um de seus aliados pode usar uma ação para fazer um teste de Força (Atletismo) CD ..."
  },
  {
    "name": "Dádiva de Aldanach",
    "source": "MM 2024",
    "cr": "11",
    "ac": 16,
    "hp": 169,
    "speed": "9m",
    "attack": "Ataque Múltiplo . A dádiva faz dois ataques com sua adaga. Adaga . Ataque Corpo a Corpo com Arma: +10 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 11 (2d4 + 6) de dano cortante. Se o alvo for uma criatura que não seja um morto-vivo ou um constructo, ele deve ser bem-sucedido em uma salvaguarda de Constituição CD 17 ou perder 10 (3d6) pontos de vida no início de cada um de seus turnos d..."
  },
  {
    "name": "Demônio da Bile",
    "source": "MM 2024",
    "cr": "5",
    "ac": 14,
    "hp": 152,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O demônio faz dois ataques corpo a corpo. Estrela Matinal . Ataque Corpo a Corpo com Arma: +6 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 12 (2d8 + 3) de dano perfurante. Bile Missile ( Recharge 5-6 ) . O demônio cospe bile volátil em um ponto a até 18 m (60 ft). Cada criatura em um raio de 3 m (10 ft) deve fazer uma salvaguarda de Destreza CD 15. Um alvo recebe 16 (..."
  },
  {
    "name": "Destruidor",
    "source": "MM 2024",
    "cr": "11",
    "ac": 16,
    "hp": 157,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O destruidor faz dois ataques de bola de demolição. Wrecking Ball . Ataque Corpo a Corpo com Arma: +10 para acertar , alcance 3 m (10 ft), um alvo. Acerto: 24 (4d8 + 6) de dano de concussão. Se o alvo for um objeto, estrutura ou constructo, o ataque causa dano máximo a ele. Clockwork Gnomes ( Recharge 6 ) . O destruidor dispara pequenos gnomos mecânicos explosivos em um ponto ..."
  },
  {
    "name": "Deva",
    "source": "MM 2024",
    "cr": "10",
    "ac": 17,
    "hp": 229,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O deva faz dois ataques corpo a corpo. Maça Sagrada . Ataque Corpo a Corpo: +8 , alcance 1,5 m (5 ft). 7 (1d6 + 4) de dano de concussão mais 18 (4d8) de dano radiante."
  },
  {
    "name": "Devorador de Sonhos",
    "source": "MM 2024",
    "cr": "10",
    "ac": 17,
    "hp": 133,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O devorador de sonhos realiza dois ataques de garra. Garra . Ataque Corpo a Corpo com Arma: +9 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 13 (3d8) de dano psíquico, e o alvo deve ser bem-sucedido em uma salvaguarda de Constituição CD 14 ou ganhar um nível de exaustão . Terrorize ( Recharge 5-6 ) . O devorador de sonhos emite visões de pesadelo. Cada criatura a até 3..."
  },
  {
    "name": "Diabo Barbado",
    "source": "MM 2024",
    "cr": "3",
    "ac": 13,
    "hp": 58,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O diabo realiza dois ataques: um com sua barba e um com sua glaive. Barba . Ataque Corpo a Corpo: +5 , alcance 1,5 m (5 ft). 7 (1d8 + 3) de dano perfurante, e o alvo fica com a condição Envenenado ( Poisoned ) até o início do próximo turno do diabo. Até esse veneno acabar, o alvo não consegue recuperar Pontos de Vida. Glávia Infernal . Ataque Corpo a Corpo: +5 , alcance 3 m (1..."
  },
  {
    "name": "Diabo Cornudo",
    "source": "MM 2024",
    "cr": "11",
    "ac": 18,
    "hp": 199,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O diabo faz três ataques corpo a corpo: dois com seu forcado e um com sua cauda. Ele pode usar Arremessar Chamas no lugar de qualquer ataque corpo a corpo. Forcado Escaldante . Ataque Corpo a Corpo: +10 , alcance 3 m (10 ft). 15 (2d8 + 6) de dano perfurante mais 9 (2d8) de dano de fogo. Arremessar Chama . Ataque à Distância: +8 , alcance 45 m (150 ft). 26 (5d8 + 4) de dano de ..."
  },
  {
    "name": "Diabo das Correntes",
    "source": "MM 2024",
    "cr": "8",
    "ac": 15,
    "hp": 85,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O diabo realiza dois ataques com suas correntes. Corrente . Ataque com Arma de Corpo a Corpo: +8 para acertar , alcance 3 m (10 ft), um alvo. Acerto: 11 (2d6 + 4) de dano cortante. O alvo fica imobilizado (CD de escape 14) se o diabo ainda não estiver agarrando uma criatura. Enquanto esse agarrão durar, o alvo fica contido e sofre 7 (2d6) de dano perfurante no início de cada u..."
  },
  {
    "name": "Diabo de Espinhos",
    "source": "MM 2024",
    "cr": "8",
    "ac": 17,
    "hp": 184,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O diabo faz dois ataques de espinho. Quill . Ataque com Arma à Distância: +7 para acertar , alcance 9/36 m (30/120 ft), um alvo. Acerto: 13 (2d8 + 4) de dano perfurante. Spiked Sphere . O diabo entra em uma posição defensiva onde se enrola, protegendo-se com seus espinhos. Qualquer dano causado por seu traço Espinhos é dobrado e ele pode usar Barragem de Espinhos como uma ação..."
  },
  {
    "name": "Diabo de Gelo",
    "source": "MM 2024",
    "cr": "14",
    "ac": 18,
    "hp": 228,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O diabo faz três ataques de Lança de Gelo. Ele pode substituir um ataque por um ataque de Cauda. Lança de Gelo . Ataque Corpo a Corpo ou à Distância: +10 , alcance 1,5 m (5 ft) ou distância 9/36 m (30/120 ft). 14 (2d8 + 5) de dano perfurante mais 10 (3d6) de dano de frio. Até o final do próximo turno dele, o alvo não pode realizar uma Ação Bônus ou Reação, seu Deslocamento dim..."
  },
  {
    "name": "Diabo do Fosso",
    "source": "MM 2024",
    "cr": "20",
    "ac": 21,
    "hp": 337,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O diabo do fosso faz um ataque de Mordida, dois ataques de Garra Diabólica e um ataque de Maça Ígnea. Mordida . Ataque Corpo a Corpo: +14 , alcance 3 m (10 ft). 18 (3d6 + 8) de dano perfurante. Se o alvo for uma criatura, ele deve fazer a salvaguarda a seguir. Salvaguarda de Constituição: CD 21. Falha: O alvo fica com a condição Envenenado ( Poisoned ) . Enquanto Envenenado , ..."
  },
  {
    "name": "Diabo dos Ossos",
    "source": "MM 2024",
    "cr": "9",
    "ac": 16,
    "hp": 161,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O diabo realiza três ataques: dois com suas garras e um com seu ferrão. Garra . Ataque Corpo a Corpo: +8 , alcance 3 m (10 ft). 13 (2d8 + 4) de dano cortante. Ferrão Infernal . Ataque Corpo a Corpo: +8 , alcance 3 m (10 ft). 15 (2d10 + 4) de dano perfurante mais 18 (4d8) de dano de veneno, e o alvo fica com a condição Envenenado ( Poisoned ) até o início do próximo turno do di..."
  },
  {
    "name": "Diabo Espinhoso",
    "source": "MM 2024",
    "cr": "5",
    "ac": 15,
    "hp": 110,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O diabo faz três ataques corpo a corpo: um com sua cauda e dois com suas garras. Alternativamente, ele pode usar Arremessar Chamas duas vezes. Garras . Ataque Corpo a Corpo: +6 , alcance 1,5 m (5 ft). 10 (2d6 + 3) de dano perfurante. Se o alvo for uma criatura Grande ou menor, ele fica com a condição Imobilizado ( Grappled ) (CD para escapar 13) por ambas as garras. Cauda . At..."
  },
  {
    "name": "Diabrete",
    "source": "MM 2024",
    "cr": "1",
    "ac": 13,
    "hp": 21,
    "speed": "9m",
    "attack": "Ferrão . Ataque Corpo a Corpo: +5 , alcance 1,5 m (5 ft). 6 (1d6 + 3) de dano perfurante mais 7 (2d6) de dano de veneno. Metamorfosear . O diabrete se transforma para se parecer com um rato (Deslocamento 6 m (20 ft)), um corvo (6 m (20 ft), Voo 18 m (60 ft)) ou uma aranha (6 m (20 ft), Escalada 6 m (20 ft)), ou retorna à sua verdadeira forma. Suas estatísticas são as mesmas em cada forma, excet..."
  },
  {
    "name": "Djinni",
    "source": "MM 2024",
    "cr": "11",
    "ac": 17,
    "hp": 218,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O djinni realiza três ataques com cimitarra. Lâmina Tempestuosa . Ataque Corpo a Corpo: +9 , alcance 1,5 m (5 ft). 12 (2d6 + 5) de dano cortante mais 7 (2d6) de dano elétrico. Raio Tempestuoso . Ataque à Distância: +9 , alcance 36 m (120 ft). 13 (3d8) de dano trovejante. Se o alvo for uma criatura Grande ou menor, ele fica com a condição Caído ( Prone ) . Criar Redemoinho . O ..."
  },
  {
    "name": "Dolgrim",
    "source": "MM 2024",
    "cr": "1",
    "ac": 15,
    "hp": 44,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O dolgrim faz dois ataques: um com sua estrela da manhã e um com sua besta leve. Estrela Matinal . Ataque Corpo a Corpo com Arma: +4 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 6 (1d8 + 2) de dano contundente. Besta Leve . Ataque à Distância com Arma: +4 para acertar , distância 24/96 m (80/320 ft), um alvo. Acerto: 6 (1d8 + 2) de dano perfurante."
  },
  {
    "name": "Doninha",
    "source": "MM 2024",
    "cr": "0",
    "ac": 13,
    "hp": 1,
    "speed": "9m",
    "attack": "Mordida . Ataque Corpo a Corpo com Arma: +5 para acertar , alcance 1,5 m (5 ft), uma criatura. Acerto: 1 de dano perfurante."
  },
  {
    "name": "Doninha Gigante",
    "source": "MM 2024",
    "cr": "1/8",
    "ac": 13,
    "hp": 9,
    "speed": "9m",
    "attack": "Mordida . Ataque Corpo a Corpo com Arma: +5 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 5 (1d4 + 3) de dano perfurante."
  },
  {
    "name": "Doppelganger",
    "source": "MM 2024",
    "cr": "3",
    "ac": 14,
    "hp": 52,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O doppelganger realiza dois ataques corpo a corpo. Golpe . Ataque Corpo a Corpo: +6 (com Vantagem durante a primeira rodada de cada combate), alcance 1,5 m (5 ft). 11 (2d6 + 4) de dano de concussão. Semblante Perturbador ( Recarga 6 ) . Salvaguarda de Sabedoria: CD 12, cada criatura em uma Emanação de 4,5 m (15 ft) originada do doppelganger que possa ver o doppelganger. Falha:..."
  },
  {
    "name": "Dragão Azul Adulto",
    "source": "MM 2024",
    "cr": "16",
    "ac": 19,
    "hp": 212,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O dragão faz três ataques de Dilacerar. Ele pode substituir um ataque por um uso de Conjuração para lançar Estilhaçar. Dilacerar . Ataque Corpo a Corpo: +12 , alcance 3 m (10 ft). 16 (2d8 + 7) de dano cortante mais 5 (1d10) de dano elétrico. Sopro Elétrico ( Recarga 5-6 ) . Salvaguarda de Destreza: CD 19, cada criatura em uma Linha de 27 m (90 ft) de comprimento por 1,5 m (5 f..."
  },
  {
    "name": "Dragão Azul Ancião",
    "source": "MM 2024",
    "cr": "23",
    "ac": 22,
    "hp": 481,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O dragão faz três ataques de Dilacerar. Ele pode substituir um ataque por um uso de Conjuração para lançar Despedaçar (versão de nível 3). Dilacerar . Ataque Corpo a Corpo: +16 , alcance 4,5 m (15 ft). 18 (2d8 + 9) de dano cortante mais 11 (2d10) de dano elétrico. Sopro Elétrico ( Recarga 5-6 ) . O dragão exala relâmpagos em uma linha de 36 m (120 ft) com 3 m (10 ft) de largur..."
  },
  {
    "name": "Dragão Azul Jovem",
    "source": "MM 2024",
    "cr": "9",
    "ac": 18,
    "hp": 152,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O dragão faz três ataques de Dilacerar. Dilacerar . Ataque Corpo a Corpo: +9 , alcance 3 m (10 ft). 12 (2d6 + 5) de dano cortante mais 5 (1d10) de dano elétrico. Sopro Elétrico ( Recarga 5-6 ) . O dragão exala relâmpagos em uma linha de 18 m (60 ft) de comprimento e 1,5 m (5 ft) de largura. Cada criatura nessa linha deve fazer uma salvaguarda de Destreza CD 16, sofrendo 55 (10..."
  },
  {
    "name": "Dragão Branco Adulto",
    "source": "MM 2024",
    "cr": "13",
    "ac": 18,
    "hp": 200,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O dragão faz três ataques de Dilacerar. Dilacerar . Ataque Corpo a Corpo: +11 , alcance 3 m (10 ft). 13 (2d6 + 6) de dano cortante mais 4 (1d8) de dano de frio. Sopro Gélido ( Recarga 5-6 ) . O dragão exala uma rajada gelada em um cone de 18 m (60 ft). Cada criatura nessa área deve fazer uma salvaguarda de Constituição CD 19, sofrendo 54 (12d8) de dano de frio em caso de falha..."
  },
  {
    "name": "Dragão Branco Ancião",
    "source": "MM 2024",
    "cr": "20",
    "ac": 20,
    "hp": 333,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O dragão faz três ataques de Dilacerar. Dilacerar . Ataque Corpo a Corpo: +14 , alcance 4,5 m (15 ft). 17 (2d8 + 8) de dano cortante mais 7 (2d6) de dano de frio. Sopro Gélido ( Recarga 5-6 ) . Salvaguarda de Constituição: CD 22, cada criatura em um Cone de 27 m (90 ft). Falha: 63 (14d8) de dano de frio. Sucesso: Metade do dano."
  },
  {
    "name": "Dragão Branco Jovem",
    "source": "MM 2024",
    "cr": "6",
    "ac": 17,
    "hp": 123,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O dragão faz três ataques de Dilacerar. Dilacerar . Ataque Corpo a Corpo: +7 , alcance 3 m (10 ft). 9 (2d4 + 4) de dano cortante mais 2 (1d4) de dano de frio. Sopro Gélido ( Recarga 5-6 ) . Salvaguarda de Constituição: CD 15, cada criatura em um Cone de 9 m (30 ft). Falha: 40 (9d8) de dano de frio. Sucesso: Metade do dano."
  },
  {
    "name": "Dragão Cristalino",
    "source": "MM 2024",
    "cr": "18",
    "ac": 20,
    "hp": 270,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O dragão pode usar sua Presença Aterrorizante. Em seguida, faz três ataques: um com sua mordida e dois com suas garras. Mordida . Ataque Corpo a Corpo com Arma: +15 para acertar , alcance 3 m (10 ft), um alvo. Acerto: 20 (2d10 + 9) de dano perfurante. Garra . Ataque Corpo a Corpo com Arma: +15 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 16 (2d6 + 9) de dano cortante...."
  },
  {
    "name": "Dragão da Sorte",
    "source": "MM 2024",
    "cr": "1/4",
    "ac": 12,
    "hp": 7,
    "speed": "9m",
    "attack": "Mordida . Ataque Corpo a Corpo com Arma: +4 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 4 (1d4 + 2) de dano perfurante."
  },
  {
    "name": "Dragão de Bronze Adulto",
    "source": "MM 2024",
    "cr": "15",
    "ac": 18,
    "hp": 212,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O dragão faz três ataques de Dilacerar. Ele pode substituir um ataque por um uso de (A) Sopro de Repulsão ou (B) Conjuração para lançar Raio Guia (versão de nível 2). Dilacerar . Ataque Corpo a Corpo: +12 , alcance 3 m (10 ft). 16 (2d8 + 7) de dano cortante mais 5 (1d10) de dano elétrico. Sopro Elétrico ( Recarga 5-6 ) . Salvaguarda de Destreza: CD 19, cada criatura em uma Lin..."
  },
  {
    "name": "Dragão de Bronze Ancião",
    "source": "MM 2024",
    "cr": "22",
    "ac": 22,
    "hp": 444,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O dragão faz três ataques de Dilacerar. Ele pode substituir um ataque por um uso de (A) Sopro de Repulsão ou (B) Conjuração para lançar Raio Guia (versão de nível 2). Dilacerar . Ataque Corpo a Corpo: +16 , alcance 4,5 m (15 ft). 18 (2d8 + 9) de dano cortante mais 9 (2d8) de dano elétrico. Sopro Elétrico ( Recarga 5-6 ) . Salvaguarda de Destreza: CD 23, cada criatura em uma Li..."
  },
  {
    "name": "Dragão de Bronze Jovem",
    "source": "MM 2024",
    "cr": "8",
    "ac": 17,
    "hp": 142,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O dragão faz três ataques de Dilacerar. Ele pode substituir um ataque por um uso de Sopro de Repulsão. Dilacerar . Ataque Corpo a Corpo: +8 , alcance 3 m (10 ft). 16 (2d10 + 5) de dano cortante. Sopro Elétrico ( Recarga 5-6 ) . Salvaguarda de Destreza: CD 15, cada criatura em uma Linha de 18 m (60 ft) de comprimento e 1,5 m (5 ft) de largura. Falha: 49 (9d10) de dano elétrico...."
  },
  {
    "name": "Dragão de Cobre Adulto",
    "source": "MM 2024",
    "cr": "14",
    "ac": 18,
    "hp": 184,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O dragão faz três ataques de Dilacerar. Ele pode substituir um ataque por um uso de (A) Sopro Lentificante ou (B) Conjuração para lançar Espinho Mental (versão de nível 4). Dilacerar . Ataque Corpo a Corpo: +11 , alcance 3 m (10 ft). 17 (2d10 + 6) de dano cortante mais 4 (1d8) de dano ácido. Sopro Ácido ( Recarga 5-6 ) . Salvaguarda de Destreza: CD 18, cada criatura em uma Lin..."
  },
  {
    "name": "Dragão de Cobre Ancião",
    "source": "MM 2024",
    "cr": "21",
    "ac": 21,
    "hp": 367,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O dragão faz três ataques de Dilacerar. Ele pode substituir um ataque por um uso de (A) Sopro Lentificante ou (B) Conjuração para lançar Espinho Mental (versão de nível 5). Dilacerar . Ataque Corpo a Corpo: +15 , alcance 4,5 m (15 ft). 19 (2d10 + 8) de dano cortante mais 9 (2d8) de dano ácido. Sopro Ácido ( Recarga 5-6 ) . Salvaguarda de Destreza: CD 22, cada criatura em uma L..."
  },
  {
    "name": "Dragão de Cobre Jovem",
    "source": "MM 2024",
    "cr": "7",
    "ac": 17,
    "hp": 119,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O dragão faz três ataques de Dilacerar. Ele pode substituir um ataque por um uso de Sopro Lentificante. Dilacerar . Ataque Corpo a Corpo: +7 , alcance 3 m (10 ft). 15 (2d10 + 4) de dano cortante. Sopro Ácido ( Recarga 5-6 ) . Salvaguarda de Destreza: CD 14, cada criatura em uma Linha de 12 m (40 ft) de comprimento e 1,5 m (5 ft) de largura. Falha: 40 (9d8) de dano ácido. Suces..."
  },
  {
    "name": "Dragão de Latão Adulto",
    "source": "MM 2024",
    "cr": "13",
    "ac": 18,
    "hp": 172,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O dragão faz três ataques de Dilacerar. Ele pode substituir um ataque por um uso de (A) Sopro Sonífero ou (B) Conjuração para lançar Raio Ardente. Dilacerar . Ataque Corpo a Corpo: +11 , alcance 3 m (10 ft). 17 (2d10 + 6) de dano cortante mais 4 (1d8) de dano de fogo. Sopro Ígneo ( Recarga 5-6 ) . Salvaguarda de Destreza: CD 18, cada criatura em uma Linha de 18 m (60 ft) de co..."
  },
  {
    "name": "Dragão de Latão Ancião",
    "source": "MM 2024",
    "cr": "20",
    "ac": 20,
    "hp": 332,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O dragão faz três ataques de Dilacerar. Ele pode substituir um ataque por um uso de (A) Sopro Sonífero ou (B) Conjuração para lançar Raio Ardente (versão de nível 3). Dilacerar . Ataque Corpo a Corpo: +14 , alcance 4,5 m (15 ft). 19 (2d10 + 8) de dano cortante mais 7 (2d6) de dano de fogo. Sopro Ígneo ( Recarga 5-6 ) . Salvaguarda de Destreza: CD 21, cada criatura em uma Linha..."
  },
  {
    "name": "Dragão de Latão Jovem",
    "source": "MM 2024",
    "cr": "6",
    "ac": 17,
    "hp": 110,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O dragão faz três ataques de Dilacerar. Ele pode substituir dois ataques por um uso de Sopro Sonífero. Dilacerar . Ataque Corpo a Corpo: +7 , alcance 3 m (10 ft). 15 (2d10 + 4) de dano cortante. Sopro Ígneo ( Recarga 5-6 ) . Salvaguarda de Destreza: CD 14, cada criatura em uma Linha de 12 m (40 ft) de comprimento e 1,5 m (5 ft) de largura. Falha: 38 (11d6) de dano de fogo. Suc..."
  },
  {
    "name": "Dragão de Ouro Adulto",
    "source": "MM 2024",
    "cr": "17",
    "ac": 19,
    "hp": 243,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O dragão faz três ataques de Dilacerar. Ele pode substituir um ataque por um uso de (A) Conjuração para lançar Raio Guia (versão de nível 2) ou (B) Sopro Enfraquecedor. Dilacerar . Ataque Corpo a Corpo: +14 , alcance 3 m (10 ft). 17 (2d8 + 8) de dano cortante mais 4 (1d8) de dano de fogo. Sopro Ígneo ( Recarga 5-6 ) . Salvaguarda de Destreza: CD 21, cada criatura em um Cone de..."
  },
  {
    "name": "Dragão de Ouro Ancião",
    "source": "MM 2024",
    "cr": "24",
    "ac": 22,
    "hp": 546,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O dragão faz três ataques de Dilacerar. Ele pode substituir um ataque por um uso de (A) Conjuração para lançar Raio Guia (versão de nível 4) ou (B) Sopro Enfraquecedor. Dilacerar . Ataque Corpo a Corpo: +17 para acertar , alcance 4,5 m (15 ft). 19 (2d8 + 10) de dano cortante mais 9 (2d8) de dano de fogo. Sopro Ígneo ( Recarga 5-6 ) . Salvaguarda de Destreza: CD 24, cada criatu..."
  },
  {
    "name": "Dragão de Prata Adulto",
    "source": "MM 2024",
    "cr": "16",
    "ac": 19,
    "hp": 216,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O dragão faz três ataques de Dilacerar. Ele pode substituir um ataque por um uso de (A) Sopro Paralisante ou (B) Conjuração para lançar Faca de Gelo. Dilacerar . Ataque Corpo a Corpo: +13 , alcance 3 m (10 ft). 17 (2d8 + 8) de dano cortante mais 4 (1d8) de dano de frio. Sopro Gélido ( Recarga 5-6 ) . Salvaguarda de Constituição: CD 20, cada criatura em um Cone de 18 m (60 ft)...."
  },
  {
    "name": "Dragão Dourado Jovem",
    "source": "MM 2024",
    "cr": "10",
    "ac": 18,
    "hp": 178,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O dragão faz três ataques de Dilacerar. Ele pode substituir um ataque por um uso de Sopro Enfraquecedor. Dilacerar . Ataque Corpo a Corpo: +10 , alcance 3 m (10 ft). 17 (2d10 + 6) de dano cortante. Sopro Ígneo ( Recarga 5-6 ) . Salvaguarda de Destreza: CD 17, cada criatura em um Cone de 9 m (30 ft). Falha: 55 (10d10) de dano de fogo. Sucesso: Metade do dano. Sopro Enfraquecedo..."
  },
  {
    "name": "Dragão Espiritual",
    "source": "MM 2024",
    "cr": "19",
    "ac": 19,
    "hp": 243,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O dragão faz três ataques: um com sua mordida e dois com suas garras. Mordida . Ataque com Arma Corpo a Corpo: +13 para acertar , alcance 3 m (10 ft), um alvo. Acerto: 18 (2d10 + 7) de dano perfurante mais 9 (2d8) de dano. Garra . Ataque com Arma Corpo a Corpo: +13 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 14 (2d6 + 7) de dano cortante mais 9 (2d8) de dano. Cauda ...."
  },
  {
    "name": "Dragão Mecânico",
    "source": "MM 2024",
    "cr": "14",
    "ac": 18,
    "hp": 184,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O dragão faz três ataques: um com sua mordida e dois com suas garras. Mordida . Ataque Corpo a Corpo com Arma: +11 para acertar , alcance 3 m (10 ft), um alvo. Acerto: 17 (2d10 + 6) de dano perfurante. Garra . Ataque Corpo a Corpo com Arma: +11 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 13 (2d6 + 6) de dano cortante. Cauda . Ataque Corpo a Corpo com Arma: +11 para a..."
  },
  {
    "name": "Dragão Negro Adulto",
    "source": "MM 2024",
    "cr": "14",
    "ac": 19,
    "hp": 195,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O dragão faz três ataques de Dilacerar. Ele pode substituir um ataque por um uso de Conjuração para lançar Flecha Ácida de Melf (versão de nível 3). Dilacerar . Ataque Corpo a Corpo: +11 , alcance 3 m (10 ft). 13 (2d6 + 6) de dano cortante mais 4 (1d8) de dano de ácido. Sopro Ácido ( Recarga 5-6 ) . O dragão expele ácido em uma linha de 18 m (60 ft) com 1,5 m (5 ft) de largura..."
  },
  {
    "name": "Dragão Negro Ancião",
    "source": "MM 2024",
    "cr": "21",
    "ac": 22,
    "hp": 367,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O dragão faz três ataques de Dilacerar. Ele pode substituir um ataque por um uso de Conjuração para lançar Flecha Ácida de Melf (versão de nível 4). Dilacerar . Ataque Corpo a Corpo: +15 , alcance 4,5 m (15 ft). 17 (2d8 + 8) de dano cortante mais 9 (2d8) de dano ácido. Sopro Ácido ( Recarga 5-6 ) . O dragão exala ácido em uma linha de 27 m (90 ft) com 3 m (10 ft) de largura. C..."
  },
  {
    "name": "Dragão Negro Jovem",
    "source": "MM 2024",
    "cr": "7",
    "ac": 18,
    "hp": 127,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O dragão faz três ataques de Dilacerar. Dilacerar . Ataque Corpo a Corpo: +7 , alcance 3 m (10 ft). 9 (2d4 + 4) de dano cortante mais 3 (1d6) de dano ácido. Sopro Ácido ( Recarga 5-6 ) . Salvaguarda de Destreza: CD 14, cada criatura em uma Linha de 9 m (30 ft) de comprimento por 1,5 m (5 ft) de largura. Falha: 49 (14d6) de dano ácido. Sucesso: Metade do dano."
  },
  {
    "name": "Dragão Prateado Ancião",
    "source": "MM 2024",
    "cr": "23",
    "ac": 22,
    "hp": 468,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O dragão faz três ataques de Dilacerar. Ele pode substituir um ataque por um uso de (A) Sopro Paralisante ou (B) Conjuração para lançar Faca de Gelo (versão de nível 2). Dilacerar . Ataque Corpo a Corpo: +17 , alcance 4,5 m (15 ft). 19 (2d8 + 10) de dano cortante mais 9 (2d8) de dano de frio. Sopro Gélido ( Recarga 5-6 ) . Salvaguarda de Constituição: CD 24, cada criatura em u..."
  },
  {
    "name": "Dragão Prateado Jovem",
    "source": "MM 2024",
    "cr": "9",
    "ac": 18,
    "hp": 168,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O dragão faz três ataques de Dilacerar. Ele pode substituir um ataque por um uso de Sopro Paralisante. Dilacerar . Ataque Corpo a Corpo: +10 , alcance 3 m (10 ft). 15 (2d8 + 6) de dano cortante. Sopro Gélido ( Recarga 5-6 ) . Salvaguarda de Constituição: CD 17, cada criatura em um Cone de 9 m (30 ft). Falha: 49 (11d8) de dano de frio. Sucesso: Metade do dano. Sopro Paralisante..."
  },
  {
    "name": "Dragão Rouba-Cérebros de Duas Cabeças",
    "source": "MM 2024",
    "cr": "18",
    "ac": 19,
    "hp": 297,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O dragão faz quatro ataques: dois com suas garras e dois com seus tentáculos. Garra . Ataque Corpo a Corpo com Arma: +13 para acertar , alcance 3 m (10 ft), um alvo. Acerto: 17 (3d6 + 7) de dano cortante. Cauda . Ataque Corpo a Corpo com Arma: +13 para acertar , alcance 4,5 m (15 ft), um alvo. Acerto: 23 (3d10 + 7) de dano de concussão. Tentáculos . Ataque Corpo a Corpo com Ar..."
  },
  {
    "name": "Dragão Verde Adulto",
    "source": "MM 2024",
    "cr": "15",
    "ac": 19,
    "hp": 207,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O dragão faz três ataques de Dilacerar. Ele pode substituir um ataque por um uso de Conjuração para lançar Espinho Mental (versão de nível 3). Dilacerar . Ataque Corpo a Corpo: +11 , alcance 3 m (10 ft). 15 (2d8 + 6) de dano cortante mais 7 (2d6) de dano de veneno. Sopro Venenoso ( Recarga 5-6 ) . O dragão expele gás venenoso em um cone de 18 m (60 ft). Cada criatura na área d..."
  },
  {
    "name": "Dragão Verde Ancião",
    "source": "MM 2024",
    "cr": "22",
    "ac": 21,
    "hp": 402,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O dragão faz três ataques de Dilacerar. Ele pode substituir um ataque por um uso de Conjuração para lançar Espinho Mental (versão de nível 5). Dilacerar . Ataque Corpo a Corpo: +15 , alcance 4,5 m (15 ft). 17 (2d8 + 8) de dano cortante mais 10 (3d6) de dano de veneno. Sopro Venenoso ( Recarga 5-6 ) . O dragão exala gás venenoso em um cone de 27 m (90 ft). Cada criatura nessa á..."
  },
  {
    "name": "Dragão Verde Jovem",
    "source": "MM 2024",
    "cr": "8",
    "ac": 18,
    "hp": 136,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O dragão faz três ataques de Dilacerar. Dilacerar . Ataque Corpo a Corpo: +7 , alcance 3 m (10 ft). 11 (2d6 + 4) de dano cortante mais 7 (2d6) de dano de veneno. Sopro Venenoso ( Recarga 5-6 ) . O dragão exala gás venenoso em um cone de 9 m (30 ft). Cada criatura nessa área deve fazer uma salvaguarda de Constituição CD 14, sofrendo 42 (12d6) de dano de veneno em uma falha, ou ..."
  },
  {
    "name": "Dragão Vermelho Adulto",
    "source": "MM 2024",
    "cr": "17",
    "ac": 19,
    "hp": 256,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O dragão faz três ataques de Dilacerar. Ele pode substituir um ataque por um uso de Conjuração para lançar Raio Ardente. Dilacerar . Ataque Corpo a Corpo: +14 , alcance 3 m (10 ft). 13 (1d10 + 8) de dano cortante mais 5 (2d4) de dano de fogo. Sopro Ígneo ( Recarga 5-6 ) . Salvaguarda de Destreza: CD 21, cada criatura em um Cone de 18 m (60 ft). Falha: 59 (17d6) de dano de fogo..."
  },
  {
    "name": "Dragão Vermelho Ancião",
    "source": "MM 2024",
    "cr": "24",
    "ac": 22,
    "hp": 507,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O dragão faz três ataques de Dilacerar. Ele pode substituir um ataque por um uso de Conjuração para lançar Raio Ardente (versão de nível 3). Dilacerar . Ataque Corpo a Corpo: +17 , alcance 4,5 m (15 ft). 19 (2d8 + 10) de dano cortante mais 10 (3d6) de dano de fogo. Sopro Ígneo ( Recarga 5-6 ) . O dragão exala fogo em um cone de 27 m (90 ft). Cada criatura nessa área deve fazer..."
  },
  {
    "name": "Dragão Vermelho Jovem",
    "source": "MM 2024",
    "cr": "10",
    "ac": 18,
    "hp": 178,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O dragão faz três ataques de Dilacerar. Dilacerar . Ataque Corpo a Corpo: +10 , alcance 3 m (10 ft). 13 (2d6 + 6) de dano cortante mais 3 (1d6) de dano de fogo. Sopro Ígneo ( Recarga 5-6 ) . O dragão exala fogo em um cone de 9 m (30 ft). Cada criatura nessa área deve fazer uma salvaguarda de Destreza CD 17, sofrendo 56 (16d6) de dano de fogo em uma falha, ou metade desse dano ..."
  },
  {
    "name": "Dragão-Sapo",
    "source": "MM 2024",
    "cr": "17",
    "ac": 19,
    "hp": 234,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O dragão pode usar sua Aura de Decomposição. Ele então faz três ataques, um com sua língua e dois com suas patas. Aura of Decay . Cada criatura à escolha do dragão que esteja a até 36 m (120 ft) do dragão e ciente de sua presença deve ser bem-sucedida em uma salvaguarda de Constituição CD 14 ou ficará envenenada por 1 minuto. Uma criatura pode repetir a salvaguarda no final de..."
  },
  {
    "name": "Dragonete do Pântano",
    "source": "MM 2024",
    "cr": "3",
    "ac": 15,
    "hp": 78,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O dragonete faz dois ataques: um com sua mordida e um com seu cuspe ácido. Mordida . Ataque com Arma Corpo a Corpo: +5 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 6 (1d6 + 3) de dano perfurante. Acid Spit . Ataque com Arma à Distância: +3 para acertar , alcance 9/18 m (30/60 ft), um alvo. Acerto: 8 (2d6 + 1) de dano ácido."
  },
  {
    "name": "Dretch",
    "source": "MM 2024",
    "cr": "1/4",
    "ac": 11,
    "hp": 18,
    "speed": "9m",
    "attack": "Dilacerar . Ataque Corpo a Corpo: +3 , alcance 1,5 m (5 ft). 4 (1d6 + 1) de dano cortante. Nuvem Fétida (1/Dia) . Um raio de 3 m (10 ft) de gás verde repugnante se estende a partir do dretch. O gás se espalha ao redor de cantos, e sua área é levemente obscurecida. Ele dura 1 minuto ou até que um vento forte o disperse. Qualquer criatura que iniciar seu turno nessa área deve ser bem-sucedida em ..."
  },
  {
    "name": "Dreyfus, o Historiador",
    "source": "MM 2024",
    "cr": "15",
    "ac": 12,
    "hp": 286,
    "speed": "9m",
    "attack": "Ghost Grip . Dreyfus tenta esmagar aqueles em sua garra telecinética. Cada criatura atualmente contida pela magia Telecinese de Dreyfus deve ser bem-sucedida em uma salvaguarda de Força CD 18 ou sofrer 27 (6d8) de dano de concussão. Violent Thrust . Dreyfus targets one creature or object currently affected by his telekinesis spell. A creature must be Large or smaller to be affected by this acti..."
  },
  {
    "name": "Dríade",
    "source": "MM 2024",
    "cr": "1",
    "ac": 16,
    "hp": 22,
    "speed": "9m",
    "attack": "Ataque Múltiplo . A dríade realiza um ataque de Chicote de Vinha ou Rajada de Espinhos, e pode usar Conjuração para conjurar Enfeitiçar Monstro. Chicotada de Vinha . Ataque Corpo a Corpo: +6 , alcance 3 m (10 ft). 8 (1d8 + 4) de dano cortante. Explosão de Espinhos . Ataque à Distância: +6 , alcance 18 m (60 ft). 7 (1d6 + 4) de dano perfurante."
  },
  {
    "name": "Dríade de Terracota",
    "source": "MM",
    "cr": "7",
    "ac": 18,
    "hp": 165,
    "speed": "9m",
    "attack": "Ficha de Dríade de Terracota (regras 2014): Médio feérico, CA 18, PV 165, CR 7. Role direto na mesa com o rolador de dados grátis. Bestiário D&D 5e."
  },
  {
    "name": "Drider",
    "source": "MM 2024",
    "cr": "6",
    "ac": 19,
    "hp": 123,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O drider faz três ataques, usando Pata Dianteira ou Explosão Venenosa em qualquer combinação. Pata Dianteira . Ataque Corpo a Corpo: +7 , alcance 3 m (10 ft). 13 (2d8 + 4) de dano perfurante. Explosão Venenosa . Ataque à Distância: +6 , alcance 36 m (120 ft). 13 (3d6 + 3) de dano de veneno."
  },
  {
    "name": "Drow",
    "source": "MM 2024",
    "cr": "1/4",
    "ac": 15,
    "hp": 13,
    "speed": "9m",
    "attack": "Espada Curta . Ataque Corpo a Corpo com Arma: +4 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 5 (1d6 + 2) de dano perfurante. Besta de Mão . Ataque à Distância com Arma: +4 para acertar , alcance 9/36 m (30/120 ft), um alvo. Acerto: 5 (1d6 + 2) de dano perfurante, e o alvo deve ser bem-sucedido em uma salvaguarda de Constituição CD 13 ou ficará envenenado por 1 hora. Se a salvaguarda f..."
  },
  {
    "name": "Druida",
    "source": "MM 2024",
    "cr": "2",
    "ac": 13,
    "hp": 44,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O druida realiza dois ataques, usando Bordão de Vinha ou Fagulha Verdejante em qualquer combinação. Bordão de Vinhas . Ataque Corpo a Corpo: +5 , alcance 1,5 m (5 ft). 7 (1d8 + 3) de dano de concussão mais 2 (1d4) de dano de veneno. Fogo-Fátuo Verdejante . Ataque à Distância: +5 , alcance 27 m (90 ft). 10 (3d6) de dano radiante."
  },
  {
    "name": "Druida do Círculo do Pastor",
    "source": "MM 2024",
    "cr": "2",
    "ac": 15,
    "hp": 65,
    "speed": "9m",
    "attack": "Machado Grande . Ataque Corpo a Corpo com Arma: +3 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 7 (1d12 + 1) de dano cortante. Mudar de Forma (2/Dia) . O druida se transforma magicamente em uma besta com nível de desafio 1/2 ou menor que não possua deslocamento de voo, e pode permanecer nessa forma por até 2 horas. O druida pode escolher se seu equipamento cai no chão, se funde com a n..."
  },
  {
    "name": "Duergar",
    "source": "MM 2024",
    "cr": "1",
    "ac": 16,
    "hp": 26,
    "speed": "9m",
    "attack": "Aumentar (Recarrega após um Descanso Curto ou Longo) . Por 1 minuto, o duergar aumenta magicamente de tamanho, junto com qualquer coisa que esteja vestindo ou carregando. Enquanto ampliado, o duergar é Grande, dobra seus dados de dano em ataques com arma baseados em Força (incluído nos ataques) e faz testes de Força e salvaguardas de Força com vantagem. Se o duergar não tiver espaço para se tor..."
  },
  {
    "name": "Efreeti",
    "source": "MM 2024",
    "cr": "11",
    "ac": 17,
    "hp": 212,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O efreeti faz dois ataques de cimitarra ou usa Arremessar Chama duas vezes. Lâmina Aquecida . Ataque Corpo a Corpo: +10 , alcance 1,5 m (5 ft). 13 (2d6 + 6) de dano cortante mais 13 (2d12) de dano de fogo. Arremessar Chama . Ataque à Distância: +8 , alcance 36 m (120 ft). 24 (7d6) de dano de fogo."
  },
  {
    "name": "Elasmotherium",
    "source": "MM 2024",
    "cr": "7",
    "ac": 15,
    "hp": 172,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O elasmotherium faz dois ataques: um com seu chifre e um com sua pisada. Chifre . Ataque Corpo a Corpo com Arma: +10 para acertar , alcance 3 m (10 ft), um alvo. Acerto: 20 (2d12 + 7) de dano perfurante. Pisotear . Ataque Corpo a Corpo com Arma: +10 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 23 (3d10 + 7) de dano de concussão."
  },
  {
    "name": "Elefante",
    "source": "MM 2024",
    "cr": "4",
    "ac": 12,
    "hp": 76,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O elefante realiza dois ataques de Chifrada. Chifrada . Ataque Corpo a Corpo: +8 , alcance 1,5 m (5 ft). 15 (2d8 + 6) de dano perfurante. Se o alvo for uma criatura Enorme ou menor e o elefante tiver se movido 6 m (20 ft) ou mais em linha reta na direção dele imediatamente antes do acerto, o alvo fica com a condição Caído ( Prone ) ."
  },
  {
    "name": "Elefante Infernal",
    "source": "MM 2024",
    "cr": "11",
    "ac": 15,
    "hp": 187,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O elefante infernal faz dois ataques de chifrada. Chifrada . Ataque com Arma Corpo a Corpo: +12 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 30 (4d10 + 8) de dano perfurante, e o alvo deve ser bem-sucedido em uma salvaguarda de Constituição CD 13 ou ficará envenenado por 1 minuto. Enquanto envenenado dessa forma, o alvo não pode recuperar pontos de vida. O alvo pode r..."
  },
  {
    "name": "Elemental da Água",
    "source": "MM 2024",
    "cr": "5",
    "ac": 14,
    "hp": 114,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O elemental faz dois ataques de pancada. Golpe . Ataque Corpo a Corpo com Arma: +7 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 13 (2d8 + 4) de dano de concussão. Submergir ( Recarga 4-6 ) . Salvaguarda de Força: CD 15, cada criatura no espaço do elemental. Falha: 22 (4d8 + 4) de dano de concussão. Se o alvo for uma criatura Grande ou menor, ele fica com a condição Im..."
  },
  {
    "name": "Elemental da Tempestade de Areia",
    "source": "MM 2024",
    "cr": "14",
    "ac": 16,
    "hp": 210,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O elemental faz três ataques de pancada. Golpe . Ataque Corpo a Corpo com Arma: +11 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 19 (2d12 + 6) de dano cortante mais 13 (2d12) de dano de concussão. Sandstorm ( Recharge 5-6 ) . O elemental e a área ao seu redor se tornam uma massa giratória de areia e detritos. Cada criatura dentro do espaço do elemental ou a 9 m (30 ft..."
  },
  {
    "name": "Elemental da Terra",
    "source": "MM 2024",
    "cr": "5",
    "ac": 17,
    "hp": 147,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O elemental faz dois ataques de pancada. Golpe . Ataque Corpo a Corpo com Arma: +8 para acertar , alcance 3 m (10 ft), um alvo. Acerto: 14 (2d8 + 5) de dano de concussão. Lançar Rocha . Ataque à Distância: +8 , alcance 18 m (60 ft). 8 (1d6 + 5) de dano de concussão. Se o alvo for uma criatura Grande ou menor, ele fica com a condição Caído ( Prone ) ."
  },
  {
    "name": "Elemental de Cristal",
    "source": "MM 2024",
    "cr": "3",
    "ac": 15,
    "hp": 57,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O elemental faz dois ataques com sua lança de cristal. Crystal Spear . Ataque Corpo a Corpo com Arma: +5 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 12 (2d8 + 3) de dano perfurante."
  },
  {
    "name": "Elemental de Fumaça Tóxica",
    "source": "MM 2024",
    "cr": "6",
    "ac": 15,
    "hp": 135,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O elemental faz dois ataques de pancada. Golpe . Ataque Corpo a Corpo com Arma: +8 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 14 (2d8 + 5) de dano de concussão mais 4 (1d8) de dano de veneno. Acid Rain ( Recharge 6 ) . Chuva ácida cai sobre o elemental e a área ao seu redor. Cada criatura dentro do espaço do elemental ou a até 9 m (30 ft) dele deve fazer uma salvagu..."
  },
  {
    "name": "Elemental de Fusão",
    "source": "MM 2024",
    "cr": "15",
    "ac": 17,
    "hp": 250,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O elemental faz dois ataques de pancada. Golpe . Ataque Corpo a Corpo com Arma: +14 para acertar , alcance 3 m (10 ft), um alvo. Acerto: 20 (2d10 + 9) de dano de concussão mais 9 (2d8) de dano de um tipo escolhido aleatoriamente entre os seguintes: ácido, elétrico, fogo ou frio. Hurl Energy . Ataque à Distância com Arma: +14 para acertar , alcance 18/72 m (60/240 ft), um alvo...."
  },
  {
    "name": "Elemental de Gelo",
    "source": "MM 2024",
    "cr": "8",
    "ac": 16,
    "hp": 187,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O elemental faz dois ataques de pancada. Golpe . Ataque Corpo a Corpo com Arma: +8 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 16 (2d10 + 5) de dano de concussão mais 11 (2d10) de dano de frio, e o alvo deve ser bem-sucedido em uma salvaguarda de Constituição CD 14 ou ficará contido até o final de seu próximo turno. Sleetstorm ( Recharge 5-6 ) . Chuva congelante e gr..."
  },
  {
    "name": "Elemental do Ar",
    "source": "MM 2024",
    "cr": "5",
    "ac": 15,
    "hp": 90,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O elemental realiza dois ataques de Pancada Trovejante. Golpe Trovejante . Ataque Corpo a Corpo: +8 , alcance 3 m (10 ft). 14 (2d8 + 5) de dano trovejante. Redemoinho ( Recarga 4-6 ) . Salvaguarda de Força: CD 13, uma criatura Média ou menor no espaço do elemental. Falha: 24 (4d10 + 2) de dano trovejante, e o alvo é empurrado até 6 m (20 ft) em linha reta para longe do element..."
  },
  {
    "name": "Elemental do Fogo",
    "source": "MM 2024",
    "cr": "5",
    "ac": 13,
    "hp": 93,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O elemental faz dois ataques de toque. Queimar . Ataque Corpo a Corpo: +6 , alcance 1,5 m (5 ft). 10 (2d6 + 3) de dano de fogo. Se o alvo for uma criatura ou um objeto inflamável, ele começa a queimar."
  },
  {
    "name": "Elfos da Oficina",
    "source": "MM 2024",
    "cr": "2",
    "ac": 14,
    "hp": 49,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O elfo faz dois ataques desarmados. Ataque Desarmado . Ataque Corpo a Corpo com Arma: +6 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 6 (1d4 + 4) de dano de concussão. Delightful Visage . Cada criatura a até 18 m (60 ft) do elfo que possa vê-lo deve ser bem-sucedida em uma salvaguarda de Carisma CD 13 ou ser afetada como se pela magia Acalmar Emoções."
  },
  {
    "name": "Encapotador",
    "source": "MM 2024",
    "cr": "8",
    "ac": 14,
    "hp": 91,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O cloaker faz um ataque de Fixar-se e dois ataques de Cauda. Fixar-se . Ataque Corpo a Corpo: +6 , alcance 1,5 m (5 ft). 13 (3d6 + 3) de dano perfurante. Se o alvo for uma criatura Grande ou menor, o cloaker se prende a ele. Enquanto o cloaker estiver preso, o alvo fica com a condição Cego ( Blinded ) , e o cloaker não pode fazer ataques de Prender contra outros alvos. Além di..."
  },
  {
    "name": "Ent",
    "source": "MM 2024",
    "cr": "9",
    "ac": 16,
    "hp": 138,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O ent faz dois ataques de pancada. Golpe . Ataque Corpo a Corpo com Arma: +10 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 16 (3d6 + 6) de dano de concussão. Saraivada de Casca . Ataque à Distância: +10 , alcance 54 m (180 ft). 28 (4d10 + 6) de dano perfurante. Animar Árvores (1/Dia) . O ent anima magicamente uma ou duas árvores que ele possa ver dentro de 18 m (60 ft..."
  },
  {
    "name": "Ent Arremessador",
    "source": "MM 2024",
    "cr": "10",
    "ac": 16,
    "hp": 138,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O ent faz dois ataques de pancada. Throw Anything . O ent arremessa uma criatura ou objeto que esteja agarrando no momento. &nbsp;&nbsp; Se o alvo for uma criatura, o ent faz um teste de Força contestado pelo teste de Força ou Destreza do alvo. Se o ent vencer a disputa, ele arremessa o alvo até 45 m (150 ft) em qualquer direção, incluindo para cima. Se o alvo então entrar em ..."
  },
  {
    "name": "Enxame de Aranhas",
    "source": "MM 2024",
    "cr": "1/2",
    "ac": 12,
    "hp": 22,
    "speed": "9m",
    "attack": "Mordidas . Ataque Corpo a Corpo com Arma: +3 para acertar , alcance 0 m (0 ft), um alvo no espaço do enxame. Acerto: 10 (4d4) de dano perfurante, ou 5 (2d4) de dano perfurante se o enxame tiver metade de seus pontos de vida ou menos."
  },
  {
    "name": "Enxame de Besouros",
    "source": "MM 2024",
    "cr": "1/2",
    "ac": 12,
    "hp": 22,
    "speed": "9m",
    "attack": "Mordidas . Ataque com Arma Corpo a Corpo: +3 para acertar , alcance 0 m (0 ft), um alvo no espaço do enxame. Acerto: 10 (4d4) de dano perfurante, ou 5 (2d4) de dano perfurante se o enxame estiver com metade de seus pontos de vida ou menos."
  },
  {
    "name": "Enxame de Centopéias",
    "source": "MM 2024",
    "cr": "1/2",
    "ac": 12,
    "hp": 22,
    "speed": "9m",
    "attack": "Mordidas . Ataque com Arma Corpo a Corpo: +3 para acertar , alcance 0 m (0 ft), um alvo no espaço do enxame. Acerto: 10 (4d4) de dano perfurante, ou 5 (2d4) de dano perfurante se o enxame estiver com metade de seus pontos de vida ou menos. Uma criatura reduzida a 0 pontos de vida por um enxame de centopéias fica estável mas envenenada por 1 hora, mesmo após recuperar pontos de vida, e fica para..."
  },
  {
    "name": "Enxame de Cobras Peçonhentas",
    "source": "MM 2024",
    "cr": "2",
    "ac": 14,
    "hp": 36,
    "speed": "9m",
    "attack": "Mordidas . Ataque Corpo a Corpo com Arma: +6 para acertar , alcance 0 m (0 ft), uma criatura no espaço do enxame. Acerto: 7 (2d6) de dano perfurante, ou 3 (1d6) de dano perfurante se o enxame tiver metade de seus pontos de vida ou menos. O alvo deve fazer uma salvaguarda de Constituição CD 10, sofrendo 14 (4d6) de dano de veneno em uma falha, ou metade desse dano em um sucesso."
  },
  {
    "name": "Enxame de Corvos",
    "source": "MM 2024",
    "cr": "1/4",
    "ac": 12,
    "hp": 11,
    "speed": "9m",
    "attack": "Bicos . Ataque Corpo a Corpo: +4 , alcance 1,5 m (5 ft). 5 (1d6 + 2) de dano perfurante, ou 2 (1d4) de dano perfurante se o bando estiver Ferido. Cacofonia ( Recarga 6 ) . Salvaguarda de Sabedoria: CD 10, uma criatura no espaço do enxame. Falha: O alvo fica com a condição Surdo ( Deafened ) até o início do próximo turno do enxame. Enquanto estiver Surdo , o alvo também tem Desvantagem em testes..."
  },
  {
    "name": "Enxame de Esquilos",
    "source": "MM 2024",
    "cr": "2",
    "ac": 14,
    "hp": 36,
    "speed": "9m",
    "attack": "Mordidas . Ataque Corpo a Corpo com Arma: +6 para acertar , alcance 0 m (0 ft), uma criatura no espaço do enxame. Acerto: 14 (4d6) de dano perfurante, ou 7 (2d6) de dano perfurante se o enxame tiver metade de seus pontos de vida ou menos. O alvo deve ser bem-sucedido em uma salvaguarda de Constituição CD 10 ou cairá no chão, ficando incapacitado de tanto rir e incapaz de se levantar até o final..."
  },
  {
    "name": "Enxame de Glaucos Azuis",
    "source": "MM 2024",
    "cr": "2",
    "ac": 11,
    "hp": 28,
    "speed": "9m",
    "attack": "Ferrão . Ataque Corpo a Corpo com Arma: +3 para acertar , alcance 1,5 m (5 ft), uma criatura. Acerto: 14 (4d6) de dano perfurante, ou 7 (2d6) de dano perfurante se o enxame estiver com metade de seus pontos de vida ou menos. O alvo deve realizar uma salvaguarda de Constituição CD 10, sofrendo 36 (8d8) de dano de veneno em uma falha, ou metade desse dano em um sucesso."
  },
  {
    "name": "Enxame de Infestação",
    "source": "MM",
    "cr": "4",
    "ac": 14,
    "hp": 44,
    "speed": "9m",
    "attack": "Mordidas . Ataque Corpo a Corpo com Arma: +6 para acertar , alcance 0 m (0 ft), uma criatura no espaço do enxame. Acerto: 21 (6d6) de dano perfurante, ou 10 (3d6) de dano perfurante se o enxame tiver metade dos seus pontos de vida ou menos. Infest ( Recharge 6 ) . One creature in the swarm's space must succeed on a DC 14 Constitution saving throw or become infested by the swarm; the swarm then ..."
  },
  {
    "name": "Enxame de Insetos",
    "source": "MM 2024",
    "cr": "1/2",
    "ac": 11,
    "hp": 19,
    "speed": "9m",
    "attack": "Mordidas . Ataque Corpo a Corpo: +3 , alcance 1,5 m (5 ft). 6 (2d4 + 1) de dano de veneno, ou 3 (1d4 + 1) de dano de veneno se o bando estiver Ferido."
  },
  {
    "name": "Enxame de Moedas Mordedoras",
    "source": "MM 2024",
    "cr": "1",
    "ac": 12,
    "hp": 49,
    "speed": "9m",
    "attack": "Mordidas . Ataque Corpo a Corpo com Arma: +3 para acertar , alcance 0 m (0 ft), um alvo no espaço do enxame. Acerto: 15 (4d6 + 1) de dano perfurante, ou 8 (2d6 + 1) de dano perfurante se o enxame estiver com metade ou menos de seus pontos de vida."
  },
  {
    "name": "Enxame de Morcegos",
    "source": "MM 2024",
    "cr": "1/4",
    "ac": 12,
    "hp": 11,
    "speed": "9m",
    "attack": "Mordidas . Ataque com Arma Corpo a Corpo: +4 para acertar , alcance 0 m (0 ft), uma criatura no espaço do enxame. Acerto: 5 (2d4) de dano perfurante, ou 2 (1d4) de dano perfurante se o enxame estiver com metade de seus pontos de vida ou menos."
  },
  {
    "name": "Enxame de Piranhas",
    "source": "MM 2024",
    "cr": "1",
    "ac": 13,
    "hp": 28,
    "speed": "9m",
    "attack": "Mordidas . Ataque Corpo a Corpo com Arma: +5 para acertar , alcance 0 m (0 ft), uma criatura no espaço do enxame. Acerto: 14 (4d6) de dano perfurante, ou 7 (2d6) de dano perfurante se o enxame tiver metade de seus pontos de vida ou menos."
  },
  {
    "name": "Enxame de Ratos",
    "source": "MM 2024",
    "cr": "1/4",
    "ac": 10,
    "hp": 14,
    "speed": "9m",
    "attack": "Mordidas . Ataque Corpo a Corpo: +2 , alcance 1,5 m (5 ft). 5 (2d4) de dano perfurante, ou 2 (1d4) de dano perfurante se o bando estiver Ferido."
  },
  {
    "name": "Enxame de Vespas",
    "source": "MM 2024",
    "cr": "1/2",
    "ac": 12,
    "hp": 22,
    "speed": "9m",
    "attack": "Mordidas . Ataque Corpo a Corpo com Arma: +3 para acertar , alcance 0 m (0 ft), um alvo no espaço do enxame. Acerto: 10 (4d4) de dano perfurante, ou 5 (2d4) de dano perfurante se o enxame tiver metade de seus pontos de vida ou menos."
  },
  {
    "name": "Erínias",
    "source": "MM 2024",
    "cr": "12",
    "ac": 18,
    "hp": 178,
    "speed": "9m",
    "attack": "Ataque Múltiplo . A erínias faz três ataques. Espada Fulminante . Ataque Corpo a Corpo: +8 , alcance 1,5 m (5 ft). 13 (2d8 + 4) de dano cortante mais 11 (2d10) de dano necrótico. Corda Enredante (Exige Corda Mágica) . Salvaguarda de Força: CD 16, uma criatura que a erínia possa ver a até 36 m (120 ft). Falha: 14 (4d6) de dano de força, e o alvo fica com a condição Contido ( Restrained ) até que..."
  },
  {
    "name": "Escorpião",
    "source": "MM 2024",
    "cr": "0",
    "ac": 11,
    "hp": 1,
    "speed": "9m",
    "attack": "Ferrão . Ataque Corpo a Corpo: +2 , alcance 1,5 m (5 ft). 1 de dano perfurante mais 3 (1d6) de dano de veneno."
  },
  {
    "name": "Escorpião Gigante",
    "source": "MM 2024",
    "cr": "3",
    "ac": 15,
    "hp": 52,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O escorpião faz três ataques: dois com suas garras e um com seu ferrão. Garra . Ataque Corpo a Corpo: +5 , alcance 1,5 m (5 ft). 6 (1d6 + 3) de dano de concussão. Se o alvo for uma criatura Grande ou menor, ele fica com a condição Imobilizado ( Grappled ) (CD 13 para escapar) por uma das duas garras. Ferrão . Ataque Corpo a Corpo: +5 , alcance 1,5 m (5 ft). 7 (1d8 + 3) de dano..."
  },
  {
    "name": "Espada Fantasmagórica",
    "source": "MM",
    "cr": "3",
    "ac": 17,
    "hp": 70,
    "speed": "9m",
    "attack": "Ataque Múltiplo . A espada faz um ataque. Se ela tiver um portador ilusório, também pode usar Golpe Ilusório. Espada Longa . Ataque Corpo a Corpo com Arma: +4 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 6 (1d8 + 2) de dano perfurante. Illusory Slam . Uma criatura que a espada possa ver a até 3 m (10 ft) dela deve ser bem-sucedida em uma salvaguarda de Inteligência CD 14 ou sofrer 1d6 ..."
  },
  {
    "name": "Espada Voadora",
    "source": "MM 2024",
    "cr": "1/4",
    "ac": 17,
    "hp": 17,
    "speed": "9m",
    "attack": "Espada Longa . Ataque com Arma Corpo a Corpo: +3 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 5 (1d8 + 1) de dano cortante."
  },
  {
    "name": "Espectro",
    "source": "MM 2024",
    "cr": "1",
    "ac": 12,
    "hp": 22,
    "speed": "9m",
    "attack": "Dreno Vital . Ataque Corpo a Corpo: +4 , alcance 1,5 m (5 ft). 7 (2d6) de dano necrótico. Se o alvo for uma criatura, o máximo de Pontos de Vida dele diminui em um valor igual ao dano sofrido."
  },
  {
    "name": "Espião",
    "source": "MM 2024",
    "cr": "1",
    "ac": 12,
    "hp": 27,
    "speed": "9m",
    "attack": "Espada Curta . Ataque Corpo a Corpo: +4 , alcance 1,5 m (5 ft). 5 (1d6 + 2) de dano perfurante mais 7 (2d6) de dano de veneno. Besta de Mão . Ataque à Distância: +4 , alcance 9/36 m (30/120 ft). 5 (1d6 + 2) de dano perfurante mais 7 (2d6) de dano de veneno."
  },
  {
    "name": "Espinheira Voraz",
    "source": "MM 2024",
    "cr": "5",
    "ac": 15,
    "hp": 136,
    "speed": "9m",
    "attack": "Ataque Múltiplo . A espinheira voraz faz três ataques: dois com suas vinhas constritoras e um com sua mordida, se possível. Mordida . Ataque Corpo a Corpo com Arma: +7 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 13 (2d8 + 4) de dano de concussão. Se o alvo for uma criatura Média ou menor imobilizada pela espinheira voraz, essa criatura é engolida e o agarrão termina. Enquanto engolida..."
  },
  {
    "name": "Espírito",
    "source": "MM 2024",
    "cr": "1/2",
    "ac": 11,
    "hp": 16,
    "speed": "9m",
    "attack": "Toque Fulminante . Ataque Corpo a Corpo com Arma: +4 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 9 (2d6 + 2) de dano necrótico. Etereidade . O espírito entra no Plano Etéreo a partir do Plano Material, ou vice-versa. Ele é visível no Plano Material enquanto está na Borda Etérea, e vice-versa, mas não pode afetar nem ser afetado por nada no outro plano. Assustar (1/Dia) . One creature ..."
  },
  {
    "name": "Espreitador Silvestre",
    "source": "MM 2024",
    "cr": "8",
    "ac": 15,
    "hp": 78,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O espreitador faz três ataques à distância. Arco Longo . Ataque à Distância com Arma: +7 para acertar , distância 45/180 m (150/600 ft), um alvo. Acerto: 17 (3d8 + 4) de dano perfurante."
  },
  {
    "name": "Esqueleto",
    "source": "MM 2024",
    "cr": "1/4",
    "ac": 14,
    "hp": 13,
    "speed": "9m",
    "attack": "Espada Curta . Ataque Corpo a Corpo: +5 , alcance 1,5 m (5 ft). 6 (1d6 + 3) de dano perfurante. Arco Curto . Ataque à Distância: +5 , alcance 24/96 m (80/320 ft). 6 (1d6 + 3) de dano perfurante."
  },
  {
    "name": "Esqueleto Armado",
    "source": "MM 2024",
    "cr": "1",
    "ac": 13,
    "hp": 26,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O esqueleto faz quatro ataques corpo a corpo. Garra . Ataque Corpo a Corpo com Arma: +3 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 3 (1d4 + 1) de dano cortante."
  },
  {
    "name": "Esqueleto Cabeça-de-Metal",
    "source": "MM 2024",
    "cr": "1/2",
    "ac": 14,
    "hp": 22,
    "speed": "9m",
    "attack": "Headbutt . Ataque Corpo a Corpo com Arma: +4 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 6 (1d8 + 2) de dano de concussão. Arco Curto . Ataque à Distância com Arma: +4 para acertar , alcance 24/96 m (80/320 ft), um alvo. Acerto: 5 (1d6 + 2) de dano perfurante."
  },
  {
    "name": "Esqueleto de Cavalo de Guerra",
    "source": "MM 2024",
    "cr": "1/2",
    "ac": 13,
    "hp": 22,
    "speed": "9m",
    "attack": "Cascos . Ataque Corpo a Corpo: +6 , alcance 1,5 m (5 ft). 7 (1d6 + 4) de dano de concussão. Se o alvo for uma criatura Grande ou menor e o esqueleto tiver se movido 6 m (20 ft) ou mais em linha reta na direção dele imediatamente antes do acerto, o alvo fica com a condição Caído ( Prone ) ."
  },
  {
    "name": "Esqueleto de Minotauro",
    "source": "MM 2024",
    "cr": "2",
    "ac": 12,
    "hp": 45,
    "speed": "9m",
    "attack": "Chifrada . Ataque Corpo a Corpo: +6 , alcance 1,5 m (5 ft). 11 (2d6 + 4) de dano perfurante. Se o alvo for uma criatura Grande ou menor e o esqueleto tiver se movido 6 m (20 ft) ou mais em linha reta na direção dele imediatamente antes do acerto, o alvo sofre 9 (2d8) de dano perfurante extra e fica com a condição Caído ( Prone ) . Golpe . Ataque Corpo a Corpo: +6 , alcance 1,5 m (5 ft). 15 (2d1..."
  },
  {
    "name": "Esqueleto Flamejante",
    "source": "MM 2024",
    "cr": "1",
    "ac": 15,
    "hp": 26,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O esqueleto faz dois ataques corpo a corpo. Espada Curta . Ataque com Arma Corpo a Corpo: +4 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 5 (1d6 + 2) de dano perfurante mais 3 (1d6) de dano de fogo. Arco Curto . Ataque com Arma à Distância: +4 para acertar , alcance 24/96 m (80/320 ft), um alvo. Acerto: 5 (1d6 + 2) de dano perfurante mais 3 (1d6) de dano de fogo."
  },
  {
    "name": "Estame",
    "source": "MM 2024",
    "cr": "4",
    "ac": 14,
    "hp": 112,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O estame faz três ataques corpo a corpo. Ataque Desarmado . Ataque Corpo a Corpo com Arma: +7 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 7 (1d8 + 3) de dano de concussão."
  },
  {
    "name": "Estirge",
    "source": "MM 2024",
    "cr": "1/8",
    "ac": 13,
    "hp": 5,
    "speed": "9m",
    "attack": "Probóscide . Ataque Corpo a Corpo: +5 , alcance 1,5 m (5 ft). 6 (1d6 + 3) de dano perfurante, e o stirge se prende ao alvo. Enquanto estiver preso, o stirge não pode realizar ataques de Probóscide, e o alvo sofre 5 (2d4) de dano necrótico no início de cada turno do stirge. O stirge pode se soltar gastando 1,5 m (5 ft) de seu movimento. O alvo ou uma criatura a até 1,5 m (5 ft) dele pode soltar ..."
  },
  {
    "name": "Estrige de Pedra",
    "source": "MM 2024",
    "cr": "8",
    "ac": 16,
    "hp": 147,
    "speed": "9m",
    "attack": "Ataque Múltiplo . A estrige faz dois ataques: um com seu bico e um com suas garras. Bico . Ataque Corpo a Corpo com Arma: +7 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 22 (4d8 + 4) de dano perfurante. Garras . Ataque Corpo a Corpo com Arma: +7 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 18 (4d6 + 4) de dano cortante."
  },
  {
    "name": "Ettercap",
    "source": "MM 2024",
    "cr": "2",
    "ac": 13,
    "hp": 44,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O ettercap faz dois ataques: um com sua mordida e um com suas garras. Mordida . Ataque Corpo a Corpo: +4 , alcance 1,5 m (5 ft). 5 (1d6 + 2) de dano perfurante mais 2 (1d4) de dano de veneno, e o alvo fica com a condição Envenenado ( Poisoned ) até o início do próximo turno do ettercap. Garra . Ataque Corpo a Corpo: +4 , alcance 1,5 m (5 ft). 7 (2d4 + 2) de dano cortante. Fio ..."
  },
  {
    "name": "Ettin",
    "source": "MM 2024",
    "cr": "4",
    "ac": 12,
    "hp": 85,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O ettin faz dois ataques: um com seu machado de batalha e um com sua estrela da manhã. Machado de Batalha . Ataque Corpo a Corpo com Arma: +7 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 14 (2d8 + 5) de dano cortante. Estrela Matinal . Ataque Corpo a Corpo com Arma: +7 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 14 (2d8 + 5) de dano perfurante."
  },
  {
    "name": "Ettin Favorecido de Demogorgon",
    "source": "MM 2024",
    "cr": "12",
    "ac": 15,
    "hp": 262,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O ettin faz quatro ataques: dois com seu machado de batalha e dois com seu bastão curto. Machado de Batalha . Ataque com Arma Corpo a Corpo: +9 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 21 (3d10 + 5) de dano cortante. Shortstaff . Ataque com Arma Corpo a Corpo: +9 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 15 (3d6 + 5) de dano de concussão."
  },
  {
    "name": "Excremental",
    "source": "MM 2024",
    "cr": "8",
    "ac": 13,
    "hp": 148,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O excremental faz dois ataques de pancada. Golpe . Ataque Corpo a Corpo com Arma: +10 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 14 (2d6 + 7) de dano de concussão mais 7 (2d6) de dano de veneno. Lob Excrement ( Recharge 6 ) . O excremental arremessa um pedaço de si mesmo em um ponto que possa ver dentro de 15 m (50 ft). Cada criatura em uma esfera de 6 m (20 ft) de ..."
  },
  {
    "name": "Falcão",
    "source": "MM 2024",
    "cr": "0",
    "ac": 13,
    "hp": 1,
    "speed": "9m",
    "attack": "Garras . Ataque Corpo a Corpo com Arma: +5 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 1 de dano cortante."
  },
  {
    "name": "Falcão das Ondas",
    "source": "MM 2024",
    "cr": "5",
    "ac": 12,
    "hp": 105,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O falcão das ondas faz três ataques: um com seu bico e dois com suas garras. Ele pode usar Dádiva do Oceano no lugar de qualquer ataque. Bico . Ataque Corpo a Corpo com Arma: +5 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 6 (1d8 + 2) de dano perfurante. Garra . Ataque Corpo a Corpo com Arma: +5 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 5 (1d6 + 2) de dano..."
  },
  {
    "name": "Falcão de Magma",
    "source": "MM 2024",
    "cr": "7",
    "ac": 15,
    "hp": 97,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O falcão de magma faz três ataques: um com seu bico e dois com suas garras. Ele pode usar Plumagem Derretida no lugar de um ataque corpo a corpo. Bico . Ataque Corpo a Corpo com Arma: +8 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 9 (1d8 + 5) de dano perfurante. Garra . Ataque Corpo a Corpo com Arma: +8 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 8 (1d6 + 5..."
  },
  {
    "name": "Falcão Prismático",
    "source": "MM 2024",
    "cr": "14",
    "ac": 18,
    "hp": 228,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O falcão prismático faz três ataques: um com seu bico e dois com suas garras. Em seguida, usa Refratar se estiver disponível. Bico . Ataque Corpo a Corpo com Arma: +7 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 13 (2d12 + 2) de dano perfurante. Garra . Ataque Corpo a Corpo com Arma: +7 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 15 (2d10 + 2) de dano cortan..."
  },
  {
    "name": "Falcão Sanguinário",
    "source": "MM 2024",
    "cr": "1/8",
    "ac": 12,
    "hp": 7,
    "speed": "9m",
    "attack": "Bico . Ataque Corpo a Corpo: +4 , alcance 1,5 m (5 ft). 4 (1d4 + 2) de dano perfurante, ou 6 (1d8 + 2) de dano perfurante se o alvo estiver Ferido."
  },
  {
    "name": "Falcão-Trovão",
    "source": "MM 2024",
    "cr": "2",
    "ac": 15,
    "hp": 47,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O falcão-trovão faz dois ataques de garra. Ele pode usar Asas do Trovão no lugar de um ataque de garra. Garra . Ataque Corpo a Corpo com Arma: +2 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 2 (1d4) de dano cortante. Wings of Thunder ( Recharge 6 ) . O falcão-trovão usa uma das seguintes habilidades. Clap . O falcão-trovão bate suas asas uma contra a outra. O falcão-t..."
  },
  {
    "name": "Fanático de Culto",
    "source": "MM 2024",
    "cr": "2",
    "ac": 13,
    "hp": 33,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O fanático faz dois ataques corpo a corpo. Adaga . Ataque Corpo a Corpo ou à Distância com Arma: +4 para acertar , alcance 1,5 m (5 ft) ou distância 6/18 m (20/60 ft), uma criatura. Acerto: 4 (1d4 + 2) de dano perfurante."
  },
  {
    "name": "Fantasma",
    "source": "MM 2024",
    "cr": "4",
    "ac": 11,
    "hp": 45,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O fantasma realiza dois ataques de Toque Definhante. Toque Fulminante . Ataque Corpo a Corpo: +5 , alcance 1,5 m (5 ft). 19 (3d10 + 3) de dano necrótico. Semblante Horrendo . Salvaguarda de Sabedoria: CD 13, cada criatura em um Cone de 18 m (60 ft) que possa ver o fantasma e não seja um Morto-Vivo. Falha: 10 (2d6 + 3) de dano psíquico, e o alvo fica com a condição Amedrontado ..."
  },
  {
    "name": "Fear Gorta",
    "source": "MM 2024",
    "cr": "0",
    "ac": 10,
    "hp": 4,
    "speed": "9m",
    "attack": "Bless . Se o fear gorta receber qualquer tipo de gentileza, seja uma moeda, comida, suprimentos, hospitalidade ou mesmo uma palavra amável, ele concede boa fortuna à criatura. Curse . Se o fear gorta for tratado de forma hostil, seja com violência, grosseria ou hostilidade, ele escolhe uma criatura amedrontada que possa ver a até 36 m (120 ft). O alvo deve ser bem-sucedido em uma salvaguarda de..."
  },
  {
    "name": "Feiote",
    "source": "MM 2024",
    "cr": "1/4",
    "ac": 12,
    "hp": 11,
    "speed": "9m",
    "attack": "Mordida . Ataque Corpo a Corpo com Arma: +3 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 4 (1d6 + 1) de dano perfurante. Se o alvo for uma criatura, ele deve ser bem-sucedido em uma salvaguarda de Força CD 11 ou será derrubado."
  },
  {
    "name": "Feiticeiro, Fênix",
    "source": "MM 2024",
    "cr": "6",
    "ac": 12,
    "hp": 135,
    "speed": "9m",
    "attack": "Ficha de Feiticeiro, Fênix (regras 2014): Médio humanoide, CA 12, PV 135, CR 6. Role direto na mesa com o rolador de dados grátis. Bestiário D&D 5e."
  },
  {
    "name": "Feiticeiro, Mar",
    "source": "MM",
    "cr": "9",
    "ac": 12,
    "hp": 171,
    "speed": "9m",
    "attack": "Ficha de Feiticeiro, Mar (regras 2014): Médio humanoide, CA 12, PV 171, CR 9. Role direto na mesa com o rolador de dados grátis. Bestiário D&D 5e."
  },
  {
    "name": "Feiticeiro, Pedra",
    "source": "MM 2024",
    "cr": "3",
    "ac": 18,
    "hp": 98,
    "speed": "9m",
    "attack": "Ficha de Feiticeiro, Pedra (regras 2014): Médio humanoide, CA 18, PV 98, CR 3. Role direto na mesa com o rolador de dados grátis. Bestiário D&D 5e."
  },
  {
    "name": "Fenrir",
    "source": "MM 2024",
    "cr": "10",
    "ac": 14,
    "hp": 210,
    "speed": "9m",
    "attack": "Ataque Múltiplo . Na forma gigante, o fenrir faz dois ataques de porrete grande ou dois ataques de pedra. Na forma híbrida, ele faz dois ataques, um com sua mordida e um com suas garras. Na forma de lobo, ele faz dois ataques de mordida. Bite (Wolf or Hybrid Form Only . Melee Weapon Attack: +10 to hit , reach 3 m (10 ft), one target. Hit: 22 (3d10 + 6) piercing damage. If the target is a giant ..."
  },
  {
    "name": "Fera das Vinhas",
    "source": "MM 2024",
    "cr": "1",
    "ac": 14,
    "hp": 39,
    "speed": "9m",
    "attack": "Mordida . Ataque Corpo a Corpo com Arma: +4 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 7 (1d8 + 3) de dano perfurante. Se o alvo for uma criatura, ele deve ser bem-sucedido em uma salvaguarda de Força CD 13 ou será derrubado."
  },
  {
    "name": "Fera do Mau Agouro",
    "source": "MM 2024",
    "cr": "2",
    "ac": 14,
    "hp": 45,
    "speed": "9m",
    "attack": "Mordida . Ataque Corpo a Corpo com Arma: +6 para atingir, alcance 1,5 m (5 ft), um alvo. Acerto: 11 (2d6 + 4) de dano perfurante."
  },
  {
    "name": "Filhote de Dragão Azul",
    "source": "MM 2024",
    "cr": "3",
    "ac": 17,
    "hp": 65,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O dragão realiza dois ataques de Dilaceração. Dilacerar . Ataque Corpo a Corpo: +5 , alcance 1,5 m (5 ft). 8 (1d10 + 3) de dano cortante mais 3 (1d6) de dano elétrico. Sopro Elétrico ( Recarga 5-6 ) . Salvaguarda de Destreza: CD 12, cada criatura em uma Linha de 9 m (30 ft) de comprimento por 1,5 m (5 ft) de largura. Falha: 21 (6d6) de dano elétrico. Sucesso: Metade do dano."
  },
  {
    "name": "Filhote de Dragão Branco",
    "source": "MM 2024",
    "cr": "2",
    "ac": 16,
    "hp": 32,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O dragão realiza dois ataques de Dilaceração. Dilacerar . Ataque Corpo a Corpo: +4 , alcance 1,5 m (5 ft). 6 (1d8 + 2) de dano cortante mais 2 (1d4) de dano de frio. Sopro Gélido ( Recarga 5-6 ) . O dragão exala uma rajada gélida de granizo em um cone de 4,5 m (15 ft). Cada criatura nessa área deve fazer uma salvaguarda de Constituição CD 12, sofrendo 22 (5d8) de dano de frio ..."
  },
  {
    "name": "Filhote de Dragão de Bronze",
    "source": "MM 2024",
    "cr": "2",
    "ac": 15,
    "hp": 39,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O dragão realiza dois ataques de Dilaceração. Dilacerar . Ataque Corpo a Corpo: +5 , alcance 1,5 m (5 ft). 8 (1d10 + 3) de dano cortante. Sopro Elétrico ( Recarga 5-6 ) . Salvaguarda de Destreza: CD 12, cada criatura em uma Linha de 12 m (40 ft) de comprimento e 1,5 m (5 ft) de largura. Falha: 16 (3d10) de dano elétrico. Sucesso: Metade do dano. Sopro de Repulsão . Salvaguarda..."
  },
  {
    "name": "Filhote de Dragão de Bronze Dourado",
    "source": "MM 2024",
    "cr": "1",
    "ac": 15,
    "hp": 22,
    "speed": "9m",
    "attack": "Dilacerar . Ataque Corpo a Corpo: +4 , alcance 1,5 m (5 ft). 7 (1d10 + 2) de dano cortante. Sopro Ígneo ( Recarga 5-6 ) . Salvaguarda de Destreza: CD 11, cada criatura em uma Linha de 6 m (20 ft) de comprimento e 1,5 m (5 ft) de largura. Falha: 14 (4d6) de dano de fogo. Sucesso: Metade do dano. Sopro Sonífero . Salvaguarda de Constituição: CD 11, cada criatura em um Cone de 4,5 m (15 ft). Falha..."
  },
  {
    "name": "Filhote de Dragão de Cobre",
    "source": "MM 2024",
    "cr": "1",
    "ac": 16,
    "hp": 22,
    "speed": "9m",
    "attack": "Dilacerar . Ataque Corpo a Corpo: +4 , alcance 1,5 m (5 ft). 7 (1d10 + 2) de dano cortante. Sopro Ácido ( Recarga 5-6 ) . Salvaguarda de Destreza: CD 11, cada criatura em uma Linha de 6 m (20 ft) de comprimento e 1,5 m (5 ft) de largura. Falha: 18 (4d8) de dano ácido. Sucesso: Metade do dano. Sopro Lentificante . Salvaguarda de Constituição: CD 11, cada criatura em um Cone de 4,5 m (15 ft). Fal..."
  },
  {
    "name": "Filhote de Dragão Dourado",
    "source": "MM 2024",
    "cr": "3",
    "ac": 17,
    "hp": 60,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O dragão realiza dois ataques de Dilaceração. Dilacerar . Ataque Corpo a Corpo: +6 , alcance 1,5 m (5 ft). 9 (1d10 + 4) de dano cortante. Sopro Ígneo ( Recarga 5-6 ) . Salvaguarda de Destreza: CD 13, cada criatura em um Cone de 4,5 m (15 ft). Falha: 22 (4d10) de dano de fogo. Sucesso: Metade do dano. Sopro Enfraquecedor . Salvaguarda de Força: CD 13, cada criatura que não este..."
  },
  {
    "name": "Filhote de Dragão Negro",
    "source": "MM 2024",
    "cr": "2",
    "ac": 17,
    "hp": 33,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O dragão realiza dois ataques de Dilaceração. Dilacerar . Ataque Corpo a Corpo: +4 , alcance 1,5 m (5 ft). 5 (1d6 + 2) de dano cortante mais 2 (1d4) de dano ácido. Sopro Ácido ( Recarga 5-6 ) . O dragão exala ácido em uma linha de 4,5 m (15 ft) com 1,5 m (5 ft) de largura. Cada criatura nessa linha deve realizar uma salvaguarda de Destreza CD 11, sofrendo 22 (5d8) de dano ácid..."
  },
  {
    "name": "Filhote de Dragão Prateado",
    "source": "MM 2024",
    "cr": "2",
    "ac": 17,
    "hp": 45,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O dragão realiza dois ataques de Dilaceração. Dilacerar . Ataque Corpo a Corpo: +6 , alcance 1,5 m (5 ft). 9 (1d10 + 4) de dano perfurante. Sopro Gélido ( Recarga 5-6 ) . Salvaguarda de Constituição: CD 13, cada criatura em um Cone de 4,5 m (15 ft). Falha: 18 (4d8) de dano de frio. Sucesso: Metade do dano. Sopro Paralisante . Salvaguarda de Constituição: CD 13, cada criatura e..."
  },
  {
    "name": "Filhote de Dragão Verde",
    "source": "MM 2024",
    "cr": "2",
    "ac": 17,
    "hp": 38,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O dragão realiza dois ataques de Dilaceração. Dilacerar . Ataque Corpo a Corpo: +4 , alcance 1,5 m (5 ft). 7 (1d10 + 2) de dano cortante mais 3 (1d6) de dano de veneno. Sopro Venenoso ( Recarga 5-6 ) . O dragão exala gás venenoso em um cone de 4,5 m (15 ft). Cada criatura nessa área deve fazer uma salvaguarda de Constituição CD 11, sofrendo 21 (6d6) de dano de veneno em uma fa..."
  },
  {
    "name": "Filhote de Dragão Vermelho",
    "source": "MM 2024",
    "cr": "4",
    "ac": 17,
    "hp": 75,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O dragão realiza dois ataques de Dilaceração. Dilacerar . Ataque Corpo a Corpo: +6 , alcance 1,5 m (5 ft). 9 (1d10 + 4) de dano cortante mais 3 (1d6) de dano de fogo. Sopro Ígneo ( Recarga 5-6 ) . O dragão exala fogo em um cone de 4,5 m (15 ft). Cada criatura nessa área deve realizar uma salvaguarda de Destreza CD 13, sofrendo 24 (7d6) de dano de fogo em uma falha, ou metade d..."
  },
  {
    "name": "Filhote de Urso Coruja",
    "source": "MM 2024",
    "cr": "1/4",
    "ac": 13,
    "hp": 17,
    "speed": "9m",
    "attack": "Bico . Ataque Corpo a Corpo com Arma: +5 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 5 (1d4 + 3) de dano perfurante. Garras . Ataque Corpo a Corpo com Arma: +5 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 6 (1d6 + 3) de dano cortante."
  },
  {
    "name": "Firbolg Porta-Voz dos Cogumelos",
    "source": "MM",
    "cr": "9",
    "ac": 14,
    "hp": 90,
    "speed": "9m",
    "attack": "Bordão . Ataque Corpo a Corpo com Arma: +3 para acertar ( +8 para acertar com shillelagh), alcance 1,5 m (5 ft), um alvo. Acerto: 2 (1d6 - 1) de dano de concussão, 3 (1d8 - 1) de dano de concussão se empunhado com duas mãos, ou 8 (1d8 + 4) de dano de concussão com shillelagh. Symbiotic Entity (2/Day) . O druida canaliza magia em seus esporos, despertando-os. Ele ganha 36 pontos de vida temporár..."
  },
  {
    "name": "Fogo-Fátuo",
    "source": "MM 2024",
    "cr": "2",
    "ac": 19,
    "hp": 27,
    "speed": "9m",
    "attack": "Choque . Ataque Corpo a Corpo: +4 , alcance 1,5 m (5 ft). 11 (2d8 + 2) de dano elétrico."
  },
  {
    "name": "Fungo Violeta",
    "source": "MM 2024",
    "cr": "1/4",
    "ac": 5,
    "hp": 18,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O fungo faz 1d4 ataques de Toque Putrefante. Toque Apodrecedor . Ataque com Arma Corpo a Corpo: +2 para acertar , alcance 3 m (10 ft), uma criatura. Acerto: 4 (1d8) de dano necrótico."
  },
  {
    "name": "Gárgula",
    "source": "MM 2024",
    "cr": "2",
    "ac": 15,
    "hp": 67,
    "speed": "9m",
    "attack": "Ataque Múltiplo . A gárgula faz dois ataques de Garra. Garra . Ataque Corpo a Corpo: +4 , alcance 1,5 m (5 ft). 7 (2d4 + 2) de dano cortante."
  },
  {
    "name": "Gashadokuro",
    "source": "MM 2024",
    "cr": "16",
    "ac": 17,
    "hp": 390,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O gashadokuro faz três ataques. Mordida . Ataque Corpo a Corpo com Arma: +15 para acertar , alcance 1,5 m (5 ft), um alvo imobilizado pelo gashadokuro. Acerto: 29 (3d12 + 10) de dano perfurante. Grasp . Ataque Corpo a Corpo com Arma: +15 para acertar , alcance 3 m (10 ft), um alvo. Acerto: 19 (2d8 + 10) de dano de concussão. Se o alvo for Enorme ou menor, ele fica imobilizado ..."
  },
  {
    "name": "Gato",
    "source": "MM 2024",
    "cr": "0",
    "ac": 12,
    "hp": 2,
    "speed": "9m",
    "attack": "Arranhão . Ataque Corpo a Corpo: +4 , alcance 1,5 m (5 ft). 1 de dano cortante."
  },
  {
    "name": "Gato Infernal",
    "source": "MM 2024",
    "cr": "5",
    "ac": 15,
    "hp": 119,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O gato infernal faz dois ataques de garra. Mordida . Ataque Corpo a Corpo com Arma: +8 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 14 (2d8 + 5) de dano perfurante. Garra . Ataque Corpo a Corpo com Arma: +8 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 12 (2d6 + 5) de dano cortante."
  },
  {
    "name": "Geist Encadeado",
    "source": "MM 2024",
    "cr": "4",
    "ac": 11,
    "hp": 45,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O Geist realiza dois ataques com suas correntes. Corrente . Ataque Corpo a Corpo com Arma: +5 para atingir, alcance 3 m (10 ft), um alvo. Acerto: 10 (2d6 + 3) de dano por concussão. O alvo fica Imobilizado ( Grappled ) (CD 13 para escapar) se o Geist não estiver já Imobilizando uma criatura. Enquanto esse Imobilizado durar, o alvo fica Contido ( Restrained ) e sofre 3 (1d6) de..."
  },
  {
    "name": "Geleia Ocre",
    "source": "MM 2024",
    "cr": "2",
    "ac": 8,
    "hp": 52,
    "speed": "9m",
    "attack": "Pseudópode . Ataque Corpo a Corpo: +4 , alcance 1,5 m (5 ft). 12 (3d6 + 2) de dano ácido."
  },
  {
    "name": "Geleia Real",
    "source": "MM 2024",
    "cr": "10",
    "ac": 8,
    "hp": 153,
    "speed": "9m",
    "attack": "Ataque Múltiplo . A geleia faz dois ataques de pseudópode. Pseudópode . Ataque Corpo a Corpo com Arma: +8 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 13 (2d8 + 4) de dano de concussão mais 21 (6d6) de dano ácido. Envolver (Só na Forma Inflated and Normal) . A geleia se move até seu deslocamento. Ao fazer isso, ela pode entrar nos espaços de criaturas Médias ou menores. Sempre que a ge..."
  },
  {
    "name": "Geriviar",
    "source": "MM 2024",
    "cr": "18",
    "ac": 19,
    "hp": 337,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O geriviar faz quatro ataques de pancada. O gigante pode usar Nódulos Explosivos no lugar de dois ataques de pancada. Golpe . Ataque com Arma Corpo a Corpo: +14 para acertar , alcance 3 m (10 ft), um alvo. Acerto: 30 (4d10 + 8) de dano de concussão. Rocha . Ataque com Arma à Distância: +14 para acertar , alcance 18/72 m (60/240 ft), um alvo. Acerto: 41 (6d10 + 8) de dano de co..."
  },
  {
    "name": "Ghast",
    "source": "MM 2024",
    "cr": "2",
    "ac": 13,
    "hp": 36,
    "speed": "9m",
    "attack": "Mordida . Ataque Corpo a Corpo: +5 , alcance 1,5 m (5 ft). 7 (1d8 + 3) de dano perfurante mais 9 (2d8) de dano necrótico. Garra . Ataque Corpo a Corpo: +5 , alcance 1,5 m (5 ft). 10 (2d6 + 3) de dano cortante. Se o alvo for uma criatura que não seja um Morto-Vivo, ele fica sujeito ao seguinte efeito. Salvaguarda de Constituição: CD 10. Falha: O alvo fica com a condição Paralisado ( Paralyzed ) ..."
  },
  {
    "name": "Gigante da Colina",
    "source": "MM 2024",
    "cr": "5",
    "ac": 13,
    "hp": 105,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O gigante faz dois ataques com o porrete grande. Clava de Árvore . Ataque Corpo a Corpo: +8 , alcance 3 m (10 ft). 18 (3d8 + 5) de dano de concussão. Se o alvo for uma criatura Grande ou menor, ele fica com a condição Caído ( Prone ) . Arremesso de Entulho . Ataque à Distância: +8 , distância 18/72 m (60/240 ft). 16 (2d10 + 5) de dano de concussão, e o alvo fica com a condição..."
  },
  {
    "name": "Gigante da Tempestade",
    "source": "MM 2024",
    "cr": "13",
    "ac": 16,
    "hp": 230,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O gigante faz dois ataques com montante. Espada Tempestuosa . Ataque Corpo a Corpo: +14 , alcance 3 m (10 ft). 23 (4d6 + 9) de dano cortante mais 13 (3d8) de dano elétrico. Raio Trovejante . Ataque à Distância: +14 , alcance 150 m (500 ft). 22 (2d12 + 9) de dano elétrico, e o alvo fica com as condições Cego ( Blinded ) e Surdo ( Deafened ) até o início do próximo turno do giga..."
  },
  {
    "name": "Gigante da Tempestade Portador das Águas",
    "source": "MM 2024",
    "cr": "16",
    "ac": 18,
    "hp": 287,
    "speed": "9m",
    "attack": "Ficha de Gigante da Tempestade Portador das Águas (regras 2014): Enorme gigante, CA 18, PV 287, CR 16. Role direto na mesa com o rolador de dados grátis…"
  },
  {
    "name": "Gigante das Nuvens",
    "source": "MM 2024",
    "cr": "9",
    "ac": 14,
    "hp": 200,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O gigante faz dois ataques com sua maça estrelada. Maça Trovejante . Ataque Corpo a Corpo: +12 , alcance 3 m (10 ft). 21 (3d8 + 8) de dano de concussão mais 7 (2d6) de dano trovejante. Nuvem Trovejante . Ataque à Distância: +12 , alcance 72 m (240 ft). 18 (3d6 + 8) de dano trovejante, e o alvo fica com a condição Incapacitado ( Incapacitated ) até o fim de seu próximo turno."
  },
  {
    "name": "Gigante de Fogo",
    "source": "MM 2024",
    "cr": "9",
    "ac": 18,
    "hp": 162,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O gigante faz dois ataques com montante. Espada Flamejante . Ataque Corpo a Corpo: +11 , alcance 3 m (10 ft). 21 (4d6 + 7) de dano cortante mais 10 (3d6) de dano de fogo. Arremesso de Martelo . Ataque à Distância: +11 , alcance 18/72 m (60/240 ft). 23 (3d10 + 7) de dano de concussão mais 4 (1d8) de dano de fogo, e o alvo é empurrado até 4,5 m (15 ft) em linha reta para longe d..."
  },
  {
    "name": "Gigante de Fogo Carcereiro",
    "source": "MM 2024",
    "cr": "10",
    "ac": 17,
    "hp": 162,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O gigante faz um ataque de corrente pesada e dois ataques de martelo de guerra. O gigante pode usar cadeia de comando no lugar de um ataque de martelo de guerra."
  },
  {
    "name": "Gigante de Pedra",
    "source": "MM 2024",
    "cr": "7",
    "ac": 17,
    "hp": 126,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O gigante faz dois ataques com grande clava. Clava de Pedra . Ataque Corpo a Corpo: +9 , alcance 4,5 m (15 ft). 22 (3d10 + 6) de dano de concussão. Pedregulho . Ataque à Distância: +9 , alcance 18/72 m (60/240 ft). 15 (2d8 + 6) de dano de concussão. Se o alvo for uma criatura Grande ou menor, ele fica com a condição Caído ( Prone ) ."
  },
  {
    "name": "Gigante de Pedra Caçador de Colossos",
    "source": "MM 2024",
    "cr": "8",
    "ac": 16,
    "hp": 184,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O gigante faz dois ataques corpo a corpo ou dois ataques à distância. Machado Grande . Ataque Corpo a Corpo com Arma: +9 para acertar , alcance 4,5 m (15 ft), um alvo. Acerto: 25 (3d12 + 6) de dano cortante. Mighty Longbow . Ataque à Distância com Arma: +9 para acertar , alcance 75/300 m (250/1000 ft), um alvo. Acerto: 28 (5d8 + 6) de dano perfurante. Se o alvo for uma criatur..."
  },
  {
    "name": "Gigante do Gelo",
    "source": "MM 2024",
    "cr": "8",
    "ac": 15,
    "hp": 149,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O gigante faz dois ataques com machado grande. Machado Gélido . Ataque Corpo a Corpo: +9 , alcance 3 m (10 ft). 19 (2d12 + 6) de dano cortante mais 9 (2d8) de dano de frio. Arco Grande . Ataque à Distância: +9 , alcance 45/180 m (150/600 ft). 17 (2d10 + 6) de dano perfurante mais 7 (2d6) de dano de frio, e o Deslocamento do alvo diminui em 3 m (10 ft) até o final do seu próxim..."
  },
  {
    "name": "Ginoesfinge",
    "source": "MM 2024",
    "cr": "11",
    "ac": 17,
    "hp": 136,
    "speed": "9m",
    "attack": "Ataque Múltiplo . A esfinge faz dois ataques de garra. Garra . Ataque Corpo a Corpo com Arma: +8 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 13 (2d8 + 4) de dano cortante."
  },
  {
    "name": "Girallon Dorso-Prateado",
    "source": "MM 2024",
    "cr": "6",
    "ac": 15,
    "hp": 152,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O dorso-prateado faz cinco ataques: um com sua mordida e quatro com suas garras. Em seguida, usa Liderar o Bando, se estiver disponível. Mordida . Ataque Corpo a Corpo com Arma: +8 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 9 (1d8 + 5) de dano perfurante. Garra . Ataque Corpo a Corpo com Arma: +8 para acertar , alcance 3 m (10 ft), um alvo. Acerto: 8 (1d6 + 5) de da..."
  },
  {
    "name": "Glabrezu",
    "source": "MM 2024",
    "cr": "9",
    "ac": 17,
    "hp": 189,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O glabrezu realiza quatro ataques: dois com suas pinças e dois com seus punhos. Alternativamente, realiza dois ataques com suas pinças e conjura uma magia. Pinça . Ataque Corpo a Corpo com Arma: +9 para acertar , alcance 3 m (10 ft), um alvo. Acerto: 16 (2d10 + 5) de dano de concussão. Se o alvo for uma criatura Média ou menor, fica imobilizado (CD de escape 15). O glabrezu po..."
  },
  {
    "name": "Gladiador",
    "source": "MM 2024",
    "cr": "5",
    "ac": 16,
    "hp": 112,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O gladiador realiza três ataques corpo a corpo ou dois ataques à distância. Lança . Ataque Corpo a Corpo ou à Distância com Arma: +7 para acertar , alcance 1,5 m (5 ft) ou distância 6/18 m (20/60 ft), um alvo. Acerto: 11 (2d6 + 4) de dano perfurante, ou 13 (2d8 + 4) de dano perfurante se usado com duas mãos para realizar um ataque corpo a corpo. Pancada de Escudo . Ataque Corp..."
  },
  {
    "name": "Glauco Azul",
    "source": "MM 2024",
    "cr": "0",
    "ac": 11,
    "hp": 1,
    "speed": "9m",
    "attack": "Ferrão . Ataque Corpo a Corpo com Arma: +3 para acertar , alcance 1,5 m (5 ft), uma criatura. Acerto: 1 de dano perfurante, e o alvo deve realizar uma salvaguarda de Constituição CD 10, sofrendo 4 (1d8) de dano de veneno em uma falha, ou metade desse dano em um sucesso."
  },
  {
    "name": "Gnoll",
    "source": "MM 2024",
    "cr": "1/2",
    "ac": 15,
    "hp": 22,
    "speed": "9m",
    "attack": "Mordida . Ataque Corpo a Corpo com Arma: +4 para acertar , alcance 1,5 m (5 ft), uma criatura. Acerto: 4 (1d4 + 2) de dano perfurante. Lança . Ataque Corpo a Corpo ou à Distância com Arma: +4 para acertar , alcance 1,5 m (5 ft) ou distância 6/18 m (20/60 ft), um alvo. Acerto: 5 (1d6 + 2) de dano perfurante, ou 6 (1d8 + 2) de dano perfurante se usado com duas mãos para realizar um ataque corpo a..."
  },
  {
    "name": "Gnoll Berserker",
    "source": "MM 2024",
    "cr": "3",
    "ac": 15,
    "hp": 65,
    "speed": "9m",
    "attack": "Ficha de Gnoll Berserker (regras 2014): Médio humanoide, CA 15, PV 65, CR 3. Role direto na mesa com o rolador de dados grátis. Bestiário D&D 5e."
  },
  {
    "name": "Gnoll Bruxa Ressequida",
    "source": "MM 2024",
    "cr": "4",
    "ac": 14,
    "hp": 117,
    "speed": "9m",
    "attack": "Ataque Múltiplo . A bruxa ressequida faz três ataques: um com sua mordida e dois com seu cajado-mandíbula. A bruxa ressequida pode conjurar uma magia no lugar de quaisquer dois ataques. Mordida . Ataque Corpo a Corpo com Arma: +4 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 4 (1d4 + 2) de dano perfurante. Jawstaff . Ataque Corpo a Corpo com Arma: +1 para acertar , alcance 1,5 m (5 ft),..."
  },
  {
    "name": "Gnoll Lança-Imundície",
    "source": "MM",
    "cr": "1",
    "ac": 13,
    "hp": 22,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O gnoll faz dois ataques: um com sua mordida e um com seu bordão. Mordida . Ataque Corpo a Corpo com Arma: +4 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 4 (1d4 + 2) de dano perfurante. Bordão . Ataque Corpo a Corpo com Arma: +1 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 2 (1d6 - 1) de dano contundente, ou 3 (1d8 - 1) de dano contundente se usado com duas ..."
  },
  {
    "name": "Gnomo das Profundezas (Svirfneblin)",
    "source": "MM 2024",
    "cr": "1/2",
    "ac": 15,
    "hp": 16,
    "speed": "9m",
    "attack": "Picareta de Guerra . Ataque Corpo a Corpo com Arma: +4 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 6 (1d8 + 2) de dano perfurante. Dardo Envenenado . Ataque à Distância com Arma: +4 para acertar , alcance 9/36 m (30/120 ft), uma criatura. Acerto: 4 (1d4 + 2) de dano perfurante, e o alvo deve ser bem-sucedido em uma salvaguarda de Constituição CD 12 ou ficará envenenado por 1 minuto. O..."
  },
  {
    "name": "Goblin",
    "source": "MM 2024",
    "cr": "1/4",
    "ac": 15,
    "hp": 7,
    "speed": "9m",
    "attack": "Cimitarra . Ataque com Arma Corpo a Corpo: +4 para acertar , alcance 1,5 m (5 ft), um alvo. 5 (1d6 + 2) de dano cortante. Arco Curto . Ataque com Arma à Distância: +4 para acertar , alcance 24/96 m (80/320 ft), um alvo. 5 (1d6 + 2) de dano perfurante."
  },
  {
    "name": "Golem de Argila",
    "source": "MM 2024",
    "cr": "9",
    "ac": 14,
    "hp": 123,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O golem faz dois ataques de soco. Golpe . Ataque Corpo a Corpo: +9 , alcance 1,5 m (5 ft). 10 (1d10 + 5) de dano de concussão mais 6 (1d12) de dano ácido, e o máximo de Pontos de Vida do alvo diminui em um valor igual ao dano ácido sofrido."
  },
  {
    "name": "Golem de Cabelo",
    "source": "MM 2024",
    "cr": "7",
    "ac": 18,
    "hp": 189,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O golem faz dois ataques. Hair Tentacle . Ataque Corpo a Corpo com Arma: +8 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 15 (3d6 + 5) de dano de concussão, e o alvo fica imobilizado (CD 16 para escapar). Até que esse agarrão termine, o alvo está contido . O golem de cabelo pode formar seis tentáculos de cabelo, cada um dos quais pode agarrar um alvo."
  },
  {
    "name": "Golem de Carne",
    "source": "MM 2024",
    "cr": "5",
    "ac": 9,
    "hp": 127,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O golem faz dois ataques de pancada. Golpe . Ataque Corpo a Corpo: +7 , alcance 1,5 m (5 ft). 13 (2d8 + 4) de dano de concussão mais 4 (1d8) de dano elétrico."
  },
  {
    "name": "Golem de Carvão",
    "source": "MM 2024",
    "cr": "9",
    "ac": 16,
    "hp": 95,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O golem faz dois ataques de pancada ou um ataque de pancada e usa sua habilidade de fornalha. Golpe . Ataque Corpo a Corpo com Arma: +8 para acertar , alcance 3 m (10 ft), um alvo. Acerto: 11 (2d6 + 4) de dano perfurante mais 7 (2d6) de dano de fogo. Furnace ( Recharge 4-6 ) . O golem abre sua fornalha, exalando cinzas ardentes e os gritos de almas aprisionadas em um cone de 4..."
  },
  {
    "name": "Golem de Cinzas",
    "source": "MM 2024",
    "cr": "12",
    "ac": 16,
    "hp": 154,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O golem faz dois ataques de pancada ou um ataque de pancada e usa sua habilidade engolfar. Golpe . Ataque Corpo a Corpo com Arma: +8 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 15 (2d6 + 8) de dano de concussão mais 7 (2d6) de dano de fogo. Envolver . O golem se move até seu deslocamento. Ao fazer isso, ele pode entrar no espaço de criaturas Grande ou menores. Sempre..."
  },
  {
    "name": "Golem de Escudo",
    "source": "MM 2024",
    "cr": "8",
    "ac": 20,
    "hp": 21,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O golem faz dois ataques de golpe de escudo. Shield Slam . Ataque Corpo a Corpo com Arma: +7 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 15 (2d10 + 4) de dano contundente."
  },
  {
    "name": "Golem de Ferro",
    "source": "MM 2024",
    "cr": "16",
    "ac": 20,
    "hp": 252,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O golem realiza dois ataques corpo a corpo. Braço Lâmina . Ataque Corpo a Corpo: +12 , alcance 3 m (10 ft). 20 (3d8 + 7) de dano cortante mais 10 (3d6) de dano de fogo. Raio Ígneo . Ataque à Distância: +10 , distância 36 m (120 ft). 36 (8d8) de dano de fogo. Sopro Venenoso ( Recarga 6 ) . Salvaguarda de Constituição: CD 18, cada criatura em um Cone de 18 m (60 ft). Falha: 55 (..."
  },
  {
    "name": "Golem de Gelo",
    "source": "MM 2024",
    "cr": "8",
    "ac": 16,
    "hp": 152,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O golem faz dois ataques de pancada. Golpe . Ataque com Arma Corpo a Corpo: +8 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 18 (3d8 + 5) de dano de concussão mais 4 (1d8) de dano de frio."
  },
  {
    "name": "Golem de Madeira de Ferro",
    "source": "MM 2024",
    "cr": "11",
    "ac": 16,
    "hp": 152,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O golem faz dois ataques de pancada. Golpe . Ataque Corpo a Corpo com Arma: +9 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 16 (2d10 + 5) de dano de concussão."
  },
  {
    "name": "Golem de Marshmallow",
    "source": "MM 2024",
    "cr": "12",
    "ac": 17,
    "hp": 195,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O golem faz três ataques de pancada. Golpe . Ataque Corpo a Corpo com Arma: +11 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 20 (2d12 + 7) de dano de concussão."
  },
  {
    "name": "Golem de Marshmallow Descomunal",
    "source": "MM 2024",
    "cr": "19",
    "ac": 19,
    "hp": 315,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O golem faz três ataques de pancada. Golpe . Ataque com Arma Corpo a Corpo: +15 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 28 (3d12 + 9) de dano de concussão. Cada criatura a até 3 m (10 ft) do alvo deve fazer uma salvaguarda de Destreza CD 23. Em uma falha, a criatura sofre 9 (2d8) de dano de concussão e fica derrubada. Se o solo nessa área for terra solta ou pedra..."
  },
  {
    "name": "Golem de Moedas",
    "source": "MM 2024",
    "cr": "4",
    "ac": 12,
    "hp": 127,
    "speed": "9m",
    "attack": "Golpe . Ataque Corpo a Corpo com Arma: +5 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 5 (1d6 + 2) de dano de concussão. Projectile Vomit . Ataque à Distância com Arma: +5 para acertar , alcance 6/18 m (20/60 ft), um alvo. Acerto: 12 (3d6 + 2) de dano ácido. Acid Reflux ( Recharge 6 ) . O zumbi expele uma bolha de ácido que respinga em um ponto que ele possa ver a até 18 m (60 ft) dele..."
  },
  {
    "name": "Golem de Obsidiana",
    "source": "MM",
    "cr": "14",
    "ac": 18,
    "hp": 189,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O golem faz dois ataques de obsidiana dentada. Jagged Obsidian . Ataque com Arma Corpo a Corpo: +11 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 19 (3d8 + 6) de dano cortante."
  },
  {
    "name": "Golem de Osso",
    "source": "MM 2024",
    "cr": "9",
    "ac": 14,
    "hp": 133,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O golem realiza dois ataques de golpe. Golpe . Ataque Corpo a Corpo com Arma: +8 para atingir, alcance 1,5 m (5 ft), um alvo. Acerto: 18 (3d8 + 5) de dano por concussão. Bone Prison . O golem escolhe uma criatura que possa ver a até 18 m (60 ft) dele. Uma prisão de ossos mágicos envolve a criatura. O alvo deve fazer uma salvaguarda de Destreza CD 15 ou ficar Contido ( Restrain..."
  },
  {
    "name": "Golem de Pedra",
    "source": "MM 2024",
    "cr": "10",
    "ac": 18,
    "hp": 220,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O golem faz dois ataques de pancada. Golpe . Ataque Corpo a Corpo: +10 , alcance 1,5 m (5 ft). 15 (2d8 + 6) de dano de concussão mais 9 (2d8) de dano de força. Raio Energético . Ataque à Distância: +9 , alcance 36 m (120 ft). 22 (4d10) de dano de força."
  },
  {
    "name": "Golem de Sucata Metálica",
    "source": "MM 2024",
    "cr": "15",
    "ac": 18,
    "hp": 210,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O golem faz dois ataques de pancada. Golpe . Ataque Corpo a Corpo com Arma: +10 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 19 (3d8 + 6) de dano de concussão. Scrap Storm . O golem libera sua sucata metálica, que se torna uma massa giratória de destroços de metal. Cada criatura no espaço do golem ou a 9 m (30 ft) dele deve fazer uma salvaguarda de Destreza CD 18, sof..."
  },
  {
    "name": "Golem de Treinamento",
    "source": "MM 2024",
    "cr": "4",
    "ac": 15,
    "hp": 105,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O golem faz três ataques com espada longa. Espada Longa . Ataque com Arma Corpo a Corpo: +5 para acertar , alcance 3 m (10 ft), um alvo. Acerto: 7 (1d8 + 3) de dano cortante, ou 8 (1d10 + 3) de dano cortante se empunhada com duas mãos."
  },
  {
    "name": "Górgon",
    "source": "MM 2024",
    "cr": "5",
    "ac": 19,
    "hp": 114,
    "speed": "9m",
    "attack": "Chifrada . Ataque Corpo a Corpo: +8 , alcance 1,5 m (5 ft). 18 (2d12 + 5) de dano perfurante. Se o alvo for uma criatura Grande ou menor e o górgone tiver se movido 6 m (20 ft) ou mais em linha reta na direção dele imediatamente antes do acerto, o alvo fica com a condição Caído ( Prone ) . Sopro Petrificante ( Recarga 5-6 ) . Salvaguarda de Constituição: CD 15, cada criatura em um Cone de 9 m (..."
  },
  {
    "name": "Gorila",
    "source": "MM 2024",
    "cr": "1/2",
    "ac": 12,
    "hp": 19,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O gorila faz dois ataques de punho. Punho . Ataque Corpo a Corpo: +5 , alcance 1,5 m (5 ft). 5 (1d4 + 3) de dano de concussão. Rocha ( Recarga 6 ) . Ataque à Distância: +5 , alcance 7,5/15 m (25/50 ft). 10 (2d6 + 3) de dano de concussão."
  },
  {
    "name": "Gorila Gigante",
    "source": "MM 2024",
    "cr": "7",
    "ac": 12,
    "hp": 168,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O gorila faz dois ataques de punho. Punho . Ataque Corpo a Corpo com Arma: +9 para acertar , alcance 3 m (10 ft), um alvo. Acerto: 22 (3d10 + 6) de dano de concussão. Arremesso de Pedregulho ( Recarga 6 ) . O gorila arremessa uma rocha em um ponto que possa ver a até 27 m (90 ft). Salvaguarda de Destreza: CD 17, cada criatura em uma Esfera de raio de 1,5 m (5 ft) centrada ness..."
  },
  {
    "name": "Gosma Alcoólica",
    "source": "MM 2024",
    "cr": "6",
    "ac": 7,
    "hp": 82,
    "speed": "9m",
    "attack": "Pseudópode . Ataque Corpo a Corpo com Arma: +7 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 7 (1d6 + 4) de dano contundente mais 22 (5d8) de dano ácido."
  },
  {
    "name": "Gosma Cinzenta",
    "source": "MM 2024",
    "cr": "1/2",
    "ac": 9,
    "hp": 22,
    "speed": "9m",
    "attack": "Pseudópode . Ataque Corpo a Corpo: +3 , alcance 1,5 m (5 ft). 10 (2d8 + 1) de dano ácido. A armadura não mágica vestida pelo alvo recebe uma penalidade de -1 na CA que oferece. A armadura é destruída se a penalidade reduzir sua CA a 10. A penalidade pode ser removida lançando a magia Reparar sobre a armadura."
  },
  {
    "name": "Gosma Devoradora de Magias",
    "source": "MM 2024",
    "cr": "4",
    "ac": 8,
    "hp": 120,
    "speed": "9m",
    "attack": "Pseudópode . Ataque Corpo a Corpo com Arma: +5 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 6 (1d6 + 3) de dano de concussão mais 18 (4d8) de dano ácido. Siphon . A gosma tenta drenar a magia de um item mágico que ela possa alcançar a até 1,5 m (5 ft) dela. Se o item estiver sendo vestido ou carregado por uma criatura, essa criatura pode fazer uma salvaguarda de Destreza CD 13, preveni..."
  },
  {
    "name": "Gosma Negra",
    "source": "MM 2024",
    "cr": "4",
    "ac": 7,
    "hp": 68,
    "speed": "9m",
    "attack": "Pseudópode Dissolvente . Ataque Corpo a Corpo: +5 , alcance 3 m (10 ft). 17 (4d6 + 3) de dano ácido. A armadura não mágica usada pelo alvo recebe uma penalidade de -1 na CA que oferece. A armadura é destruída se a penalidade reduzir sua CA para 10. A penalidade pode ser removida ao conjurar a magia Reparar na armadura."
  },
  {
    "name": "Granderhobb",
    "source": "MM 2024",
    "cr": "14",
    "ac": 18,
    "hp": 253,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O granderhobb faz três ataques: dois com sua mordida e um com sua língua. Mordida . Ataque Corpo a Corpo com Arma: +11 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 28 (5d10 + 6) de dano perfurante, e o alvo fica imobilizado (CD 17 para escapar) se for uma criatura de tamanho Enorme ou menor. Até que este agarrão termine, o alvo está contido , e o granderhobb não pode ..."
  },
  {
    "name": "Greblin",
    "source": "MM 2024",
    "cr": "2",
    "ac": 15,
    "hp": 50,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O greblin pode fazer um ataque de mordida e usar sua habilidade Sifonar uma vez. Mordida . Ataque Corpo a Corpo com Arma: +5 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 5 (1d4 + 3) de dano perfurante. Siphon . O greblin drena magia de um glifo ou item mágico que ele possa ver a até 1,5 m (5 ft) dele. Se o objeto não estiver sendo vestido ou carregado, o toque drena a..."
  },
  {
    "name": "Gremlin",
    "source": "MM 2024",
    "cr": "2",
    "ac": 14,
    "hp": 71,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O gremlin faz 2 ataques de garra. Garra . Ataque Corpo a Corpo com Arma: +4 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 7 (2d4 + 2) de dano cortante. Mordida . Ataque Corpo a Corpo com Arma: +4 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 11 (2d8 + 2) de dano perfurante e o gremlin recupera pontos de vida iguais à metade do dano causado (arredondado para cim..."
  },
  {
    "name": "Grick",
    "source": "MM 2024",
    "cr": "2",
    "ac": 14,
    "hp": 54,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O grick faz um ataque com seus tentáculos. Se esse ataque acertar, o grick pode fazer um ataque de bico contra o mesmo alvo. Bico . Ataque Corpo a Corpo: +4 , alcance 1,5 m (5 ft). 9 (2d6 + 2) de dano perfurante. Tentáculos . Ataque Corpo a Corpo: +4 , alcance 1,5 m (5 ft). 7 (1d10 + 2) de dano cortante. Se o alvo for uma criatura Média ou menor, ele fica com a condição Imobil..."
  },
  {
    "name": "Grifo",
    "source": "MM 2024",
    "cr": "2",
    "ac": 12,
    "hp": 59,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O grifo faz dois ataques de Dilacerar. Dilacerar . Ataque Corpo a Corpo: +6 , alcance 1,5 m (5 ft). 8 (1d8 + 4) de dano perfurante. Se o alvo for uma criatura Média ou menor, ele fica com a condição Imobilizado ( Grappled ) (CD de fuga 14) por ambas as garras dianteiras do grifo."
  },
  {
    "name": "Grifo de Batalha Blindado",
    "source": "MM 2024",
    "cr": "3",
    "ac": 14,
    "hp": 85,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O grifo faz dois ataques: um com seu bico e um com suas garras. Bico . Ataque Corpo a Corpo com Arma: +6 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 8 (1d8 + 4) de dano perfurante. Garras . Ataque Corpo a Corpo com Arma: +6 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 11 (2d6 + 4) de dano cortante."
  },
  {
    "name": "Grimlock",
    "source": "MM 2024",
    "cr": "1/4",
    "ac": 11,
    "hp": 11,
    "speed": "9m",
    "attack": "Porrete de Osso . Ataque Corpo a Corpo: +5 , alcance 1,5 m (5 ft). 6 (1d6 + 3) de dano de concussão mais 2 (1d4) de dano psíquico."
  },
  {
    "name": "Grimório Vivo",
    "source": "MM 2024",
    "cr": "10",
    "ac": 14,
    "hp": 90,
    "speed": "9m",
    "attack": "Paper Cut . Ataque à Distância com Arma: +8 para acertar , alcance 9/18 m (30/60 ft), uma criatura. Acerto: 13 (3d8) de dano cortante. Mana Burn ( Recharge 5-6 ) . O grimório pode gastar um espaço de magia para causar dano de força a um alvo a até 18 m (60 ft) dele. O dano é 18 (4d8) para um espaço de magia de 1º nível, mais 9 (2d8) para cada nível de magia acima do 1º. O alvo deve fazer uma sa..."
  },
  {
    "name": "Grinch",
    "source": "MM",
    "cr": "12",
    "ac": 17,
    "hp": 201,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O grinch faz cinco ataques corpo a corpo com arma. Garra . Ataque Corpo a Corpo com Arma: +9 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 12 (2d6 + 5) de dano cortante."
  },
  {
    "name": "Grito Azul da Morte",
    "source": "MM 2024",
    "cr": "6",
    "ac": 13,
    "hp": 130,
    "speed": "9m",
    "attack": "Toque Corruptor . Ataque Corpo a Corpo com Magia: +6 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 13 (3d6 + 3) de dano necrótico mais 7 (2d6) de dano de frio. Semblante Aterrorizante . Cada criatura não-morta-viva em até 18 m (60 ft) do grito azul da morte que possa vê-la deve ser bem-sucedida em uma salvaguarda de Sabedoria CD 15 ou ficará amedrontada por 1 minuto. Um alvo amedrontado..."
  },
  {
    "name": "Grootslang",
    "source": "MM 2024",
    "cr": "23",
    "ac": 19,
    "hp": 350,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O grootslang faz quatro ataques: um com sua chifrada, dois com seu pisoteio e um com constrição ou golpe de cauda. Chifrada . Ataque Corpo a Corpo com Arma: +17 para acertar , alcance 6 m (20 ft), um alvo. Acerto: 32 (5d8 + 10) de dano perfurante. Constrição . Ataque Corpo a Corpo com Arma: +17 para acertar , alcance 6 m (20 ft), um alvo. Acerto: 20 (3d6 + 10) de dano de concu..."
  },
  {
    "name": "Guarda",
    "source": "MM 2024",
    "cr": "1/8",
    "ac": 16,
    "hp": 11,
    "speed": "9m",
    "attack": "Lança . Ataque Corpo a Corpo ou à Distância com Arma: +3 para acertar , alcance 1,5 m (5 ft) ou distância 6/18 m (20/60 ft), um alvo. Acerto: 4 (1d6 + 1) de dano perfurante ou 5 (1d8 + 1) de dano perfurante se usado com duas mãos para fazer um ataque corpo a corpo."
  },
  {
    "name": "Guardião Ancestral do Templo",
    "source": "MM 2024",
    "cr": "12",
    "ac": 17,
    "hp": 209,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O guardião faz seis ataques com cimitarra. Cimitarra . Ataque Corpo a Corpo com Arma: +9 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 8 (1d6 + 5) de dano cortante. Arrow Spray ( Recharge 5-6 ) . As bocas das muitas faces de pedra no guardião se abrem, revelando seteiras antes de cuspir flechas em todas as direções. Cada criatura a até 7,5 m (25 ft) dele deve fazer uma..."
  },
  {
    "name": "Guardião de Escudo",
    "source": "MM 2024",
    "cr": "7",
    "ac": 17,
    "hp": 142,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O guardião faz dois ataques de punho. Punho . Ataque Corpo a Corpo: +7 , alcance 3 m (10 ft). 11 (2d6 + 4) de dano de concussão mais 7 (2d6) de dano de força."
  },
  {
    "name": "Guardião do Bosque",
    "source": "MM",
    "cr": "5",
    "ac": 15,
    "hp": 71,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O guardião faz dois ataques de mordida. Mordida . Ataque Corpo a Corpo com Arma: +6 para acertar , alcance 1,5 m (5 ft), uma criatura. Acerto: 10 (2d6 + 3) de dano perfurante. Se o alvo for uma criatura, deve ser bem-sucedido em uma salvaguarda de Força CD 13 ou ser derrubado."
  },
  {
    "name": "Guardião do Cemitério",
    "source": "MM 2024",
    "cr": "6",
    "ac": 13,
    "hp": 136,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O guardião faz dois ataques de mordida e usa sua habilidade de latido se possível. Mordida . Ataque Corpo a Corpo com Arma: +5 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 15 (3d8 + 2) de dano necrótico, e o alvo deve fazer um"
  },
  {
    "name": "Guerreiro Arqueiro Arcano",
    "source": "MM 2024",
    "cr": "5",
    "ac": 15,
    "hp": 82,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O guerreiro faz dois ataques de tiro certeiro ou arco longo. Called Shot . Ataque com Arma à Distância: +4 para acertar , alcance 24/96 m (80/320 ft), um alvo. Acerto: 17 (1d6 + 14) de dano perfurante Arco Longo . Ataque com Arma à Distância: +9 para acertar , alcance 24/96 m (80/320 ft), um alvo. Acerto: 7 (1d6 + 4) de dano perfurante. Grovel, Cower, and Beg (Recharges after ..."
  },
  {
    "name": "Guerreiro Caçador de Monstros",
    "source": "MM",
    "cr": "5",
    "ac": 16,
    "hp": 130,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O guerreiro faz dois ataques. Besta de Mão . Ataque com Arma à Distância: +7 para acertar , alcance 9/36 m (30/120 ft), um alvo. Acerto: 7 (1d6 + 4) de dano perfurante. Rapieira . Ataque com Arma Corpo a Corpo: +7 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 8 (1d8 + 4) de dano perfurante."
  },
  {
    "name": "Guerreiro Cavaleiro",
    "source": "MM 2024",
    "cr": "8",
    "ac": 20,
    "hp": 175,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O guerreiro faz três ataques: dois com sua espada longa e um com sua pancada de escudo. Espada Longa . Ataque com Arma Corpo a Corpo: +7 para acertar , alcance 3 m (10 ft), um alvo. Acerto: 8 (1d8 + 4) de dano cortante. Pancada de Escudo . Ataque com Arma Corpo a Corpo: +7 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 7 (1d6 + 4) de dano de concussão, e o alvo deve faz..."
  },
  {
    "name": "Guerreiro Cavaleiro",
    "source": "MM",
    "cr": "4",
    "ac": 19,
    "hp": 75,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O guerreiro faz dois ataques com lança montada ou rapieira. Lance . Ataque Corpo a Corpo com Arma: +6 para acertar , alcance 3 m (10 ft), um alvo. Acerto: 10 (1d12 + 4) de dano perfurante. Rapieira . Ataque Corpo a Corpo com Arma: +6 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 10 (1d8 + 4) de dano perfurante."
  },
  {
    "name": "Guerreiro Infernal",
    "source": "MM 2024",
    "cr": "8",
    "ac": 16,
    "hp": 153,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O hellbug faz três ataques de mordida. Mordida . Ataque Corpo a Corpo com Arma: +7 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 15 (2d10 + 4) de dano perfurante. Se o alvo for uma criatura Grande ou menor, fica imobilizado (CD 15 para escapar). Até que esse agarrão termine, o hellbug pode morder apenas a criatura imobilizada e tem vantagem nas jogadas de ataque para f..."
  },
  {
    "name": "Guerreiro Samurai",
    "source": "MM 2024",
    "cr": "13",
    "ac": 18,
    "hp": 255,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O guerreiro faz quatro ataques com seu montante ou faz quatro golpes selvagens. Espada Grande . Ataque com Arma Corpo a Corpo: +10 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 12 (2d6 + 5) de dano cortante. Savage Strike . Ataque com Arma Corpo a Corpo: +5 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 22 (2d6 + 15) de dano cortante. Breath Weapon (Recharges af..."
  },
  {
    "name": "Guerreiro Tribal",
    "source": "MM 2024",
    "cr": "1/8",
    "ac": 12,
    "hp": 11,
    "speed": "9m",
    "attack": "Lança . Ataque Corpo a Corpo ou à Distância com Arma: +3 para acertar , alcance 1,5 m (5 ft) ou distância 6/18 m (20/60 ft), um alvo. Acerto: 4 (1d6 + 1) de dano perfurante, ou 5 (1d8 + 1) de dano perfurante se usado com duas mãos para fazer um ataque corpo a corpo."
  },
  {
    "name": "Guinchador",
    "source": "MM 2024",
    "cr": "0",
    "ac": 5,
    "hp": 13,
    "speed": "9m",
    "attack": "Ficha de Guinchador (regras 2014): Médio planta, CA 5, PV 13, CR 0. Role direto na mesa com o rolador de dados grátis. Bestiário D&D 5e."
  },
  {
    "name": "Hadozee Marinheiro",
    "source": "MM 2024",
    "cr": "2",
    "ac": 15,
    "hp": 71,
    "speed": "9m",
    "attack": "Ficha de Hadozee Marinheiro (regras 2014): Médio humanoide, CA 15, PV 71, CR 2. Role direto na mesa com o rolador de dados grátis. Bestiário D&D 5e."
  },
  {
    "name": "Hamster Espacial Gigante",
    "source": "MM 2024",
    "cr": "1/2",
    "ac": 14,
    "hp": 22,
    "speed": "9m",
    "attack": "Headbutt . Ataque Corpo a Corpo com Arma: +4 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 6 (1d8 + 2) de dano de concussão. Arco Curto . Ataque à Distância com Arma: +4 para acertar , alcance 24/96 m (80/320 ft), um alvo. Acerto: 5 (1d6 + 2) de dano perfurante."
  },
  {
    "name": "Hamster Espacial Gigante Blindado",
    "source": "MM 2024",
    "cr": "1/2",
    "ac": 14,
    "hp": 22,
    "speed": "9m",
    "attack": "Headbutt . Ataque Corpo a Corpo com Arma: +4 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 6 (1d8 + 2) de dano de concussão. Arco Curto . Ataque à Distância com Arma: +4 para acertar , alcance 24/96 m (80/320 ft), um alvo. Acerto: 5 (1d6 + 2) de dano perfurante."
  },
  {
    "name": "Hamster Espacial Gigante com Chifres",
    "source": "MM 2024",
    "cr": "1/2",
    "ac": 14,
    "hp": 22,
    "speed": "9m",
    "attack": "Headbutt . Ataque Corpo a Corpo com Arma: +4 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 6 (1d8 + 2) de dano de concussão. Arco Curto . Ataque à Distância com Arma: +4 para acertar , alcance 24/96 m (80/320 ft), um alvo. Acerto: 5 (1d6 + 2) de dano perfurante."
  },
  {
    "name": "Hamster Espacial Gigante de Almíscar Amarelo",
    "source": "MM 2024",
    "cr": "1/2",
    "ac": 14,
    "hp": 22,
    "speed": "9m",
    "attack": "Headbutt . Ataque Corpo a Corpo com Arma: +4 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 6 (1d8 + 2) de dano de concussão. Arco Curto . Ataque à Distância com Arma: +4 para acertar , alcance 24/96 m (80/320 ft), um alvo. Acerto: 5 (1d6 + 2) de dano perfurante."
  },
  {
    "name": "Hamster Espacial Gigante Dentes-de-Sabre",
    "source": "MM 2024",
    "cr": "1/2",
    "ac": 14,
    "hp": 22,
    "speed": "9m",
    "attack": "Headbutt . Ataque Corpo a Corpo com Arma: +4 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 6 (1d8 + 2) de dano de concussão. Arco Curto . Ataque à Distância com Arma: +4 para acertar , alcance 24/96 m (80/320 ft), um alvo. Acerto: 5 (1d6 + 2) de dano perfurante."
  },
  {
    "name": "Hamster Espacial Gigante Invisível",
    "source": "MM 2024",
    "cr": "1/2",
    "ac": 14,
    "hp": 22,
    "speed": "9m",
    "attack": "Headbutt . Ataque Corpo a Corpo com Arma: +4 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 6 (1d8 + 2) de dano de concussão. Arco Curto . Ataque à Distância com Arma: +4 para acertar , alcance 24/96 m (80/320 ft), um alvo. Acerto: 5 (1d6 + 2) de dano perfurante."
  },
  {
    "name": "Hamster Espacial Gigante Miniatura",
    "source": "MM 2024",
    "cr": "1/2",
    "ac": 14,
    "hp": 22,
    "speed": "9m",
    "attack": "Headbutt . Ataque Corpo a Corpo com Arma: +4 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 6 (1d8 + 2) de dano de concussão. Arco Curto . Ataque à Distância com Arma: +4 para acertar , alcance 24/96 m (80/320 ft), um alvo. Acerto: 5 (1d6 + 2) de dano perfurante."
  },
  {
    "name": "Hamster Espacial Gigante Voador Carnívoro",
    "source": "MM 2024",
    "cr": "1/2",
    "ac": 14,
    "hp": 22,
    "speed": "9m",
    "attack": "Headbutt . Ataque Corpo a Corpo com Arma: +4 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 6 (1d8 + 2) de dano de concussão. Arco Curto . Ataque à Distância com Arma: +4 para acertar , alcance 24/96 m (80/320 ft), um alvo. Acerto: 5 (1d6 + 2) de dano perfurante."
  },
  {
    "name": "Harpia",
    "source": "MM 2024",
    "cr": "1",
    "ac": 11,
    "hp": 38,
    "speed": "9m",
    "attack": "Garra . Ataque Corpo a Corpo: +3 , alcance 1,5 m (5 ft). 6 (2d4 + 1) de dano cortante. Canção Atraente . A harpia canta uma melodia mágica. Todo humanoide e gigante a até 90 m (300 ft) da harpia que possa ouvir a canção deve ser bem-sucedido em uma salvaguarda de Sabedoria CD 11 ou ficará enfeitiçado até a canção terminar. A harpia deve usar uma ação bônus em seus turnos subsequentes para conti..."
  },
  {
    "name": "Harpia do Pesadelo",
    "source": "MM 2024",
    "cr": "3",
    "ac": 12,
    "hp": 71,
    "speed": "9m",
    "attack": "Ataque Múltiplo . A harpia faz dois ataques: um com suas garras e um com sua clava. Garras . Ataque Corpo a Corpo com Arma: +3 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 11 (3d6 + 1) de dano cortante. Clava . Ataque Corpo a Corpo com Arma: +3 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 3 (1d4 + 1) de dano de concussão. Canção Atraente . A harpia entoa uma melodia mágica. To..."
  },
  {
    "name": "Hellion Infernal",
    "source": "MM 2024",
    "cr": "12",
    "ac": 19,
    "hp": 241,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O hellbug faz três ataques corpo a corpo e usa Investida Esmagadora. Mordida . Ataque Corpo a Corpo com Arma: +9 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 16 (2d10 + 5) de dano perfurante, e o alvo é engolido se for uma criatura Média ou menor. Uma criatura engolida fica cega e contida , tem cobertura total contra ataques e outros efeitos fora do hellbug, e sofre 1..."
  },
  {
    "name": "Hemogoblin",
    "source": "MM",
    "cr": "3",
    "ac": 15,
    "hp": 44,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O hemogoblin faz dois ataques com cimitarra. Cimitarra . Ataque Corpo a Corpo com Arma: +5 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 5 (1d6 + 2) de dano cortante. Blood Sense . O hemogoblin aguça seus sentidos. Ele pode sentir a presença e a localização de qualquer criatura com sangue em um raio de 4,5 m (15 ft), independentemente de barreiras interpostas."
  },
  {
    "name": "Herbalista",
    "source": "MM 2024",
    "cr": "2",
    "ac": 14,
    "hp": 71,
    "speed": "9m",
    "attack": "Ficha de Herbalista (regras 2014): Médio humanoide, CA 14, PV 71, CR 2. Role direto na mesa com o rolador de dados grátis. Bestiário D&D 5e."
  },
  {
    "name": "Hezrou",
    "source": "MM 2024",
    "cr": "8",
    "ac": 18,
    "hp": 157,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O hezrou faz três ataques de Dilacerar. Dilacerar . Ataque Corpo a Corpo: +7 , alcance 1,5 m (5 ft). 6 (1d4 + 4) de dano cortante mais 9 (2d8) de dano de veneno."
  },
  {
    "name": "Hidra",
    "source": "MM 2024",
    "cr": "8",
    "ac": 15,
    "hp": 184,
    "speed": "9m",
    "attack": "Ataque Múltiplo . A hidra faz tantos ataques de mordida quanto cabeças tiver. Mordida . Ataque Corpo a Corpo com Arma: +8 para acertar , alcance 3 m (10 ft), um alvo. Acerto: 10 (1d10 + 5) de dano perfurante."
  },
  {
    "name": "Hiena",
    "source": "MM 2024",
    "cr": "0",
    "ac": 11,
    "hp": 5,
    "speed": "9m",
    "attack": "Mordida . Ataque Corpo a Corpo com Arma: +2 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 3 (1d6) de dano perfurante."
  },
  {
    "name": "Hiena Demoníaca",
    "source": "MM 2024",
    "cr": "2",
    "ac": 12,
    "hp": 45,
    "speed": "9m",
    "attack": "Mordida . Melee Weapon Attack: +6 to hit , reach 1,5 m (5 ft), one creature. Hit 13 (2d8 + 4) piercing damage. G GNOLLS Goblins Goblins are small, black-hearted, selfish humanoids that lair in caves, abandoned mines, despoiled dungeons, and other dismal settings. Individually weak, goblins gather in large─sometimes overwhelming─numbers. They crave power and regularly abuse whatever authority th..."
  },
  {
    "name": "Hiena Gigante",
    "source": "MM 2024",
    "cr": "1",
    "ac": 12,
    "hp": 45,
    "speed": "9m",
    "attack": "Mordida . Ataque Corpo a Corpo com Arma: +5 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 10 (2d6 + 3) de dano perfurante."
  },
  {
    "name": "Hipogrifo",
    "source": "MM 2024",
    "cr": "1",
    "ac": 11,
    "hp": 26,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O hipogrifo faz dois ataques de Dilacerar. Dilacerar . Ataque Corpo a Corpo: +5 , alcance 1,5 m (5 ft). 7 (1d8 + 3) de dano cortante."
  },
  {
    "name": "Hobgoblin",
    "source": "MM 2024",
    "cr": "1/2",
    "ac": 18,
    "hp": 11,
    "speed": "9m",
    "attack": "Espada Longa . Ataque Corpo a Corpo com Arma: +3 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 5 (1d8 + 1) de dano cortante, ou 6 (1d10 + 1) de dano cortante se usado com duas mãos. Arco Longo . Ataque à Distância com Arma: +3 para acertar , alcance 45/180 m (150/600 ft), um alvo. Acerto: 5 (1d8 + 1) de dano perfurante."
  },
  {
    "name": "Hobgoblin Falangista",
    "source": "MM 2024",
    "cr": "2",
    "ac": 20,
    "hp": 32,
    "speed": "9m",
    "attack": "Azagaia . Ataque Corpo a Corpo ou à Distância com Arma: +3 para acertar , alcance 1,5 m (5 ft) ou distância 9/36 m (30/120 ft), um alvo. Acerto: 4 (1d6 + 1) de dano perfurante. Pancada de Escudo . Ataque Corpo a Corpo com Arma: +3 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 4 (1d6 + 1) de dano de concussão. Se o alvo for Grande ou menor, ele deve ser bem-sucedido em uma salvaguarda de..."
  },
  {
    "name": "Hobgoblin Garra de Pedra",
    "source": "MM",
    "cr": "7",
    "ac": 16,
    "hp": 120,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O hobgoblin faz quatro ataques corpo a corpo, dos quais apenas um pode ser com seu punho atordoante. Stoneclaw . Ataque Corpo a Corpo com Arma: +7 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 7 (1d6 + 4) de dano de concussão. Stunning Fist . Ataque Corpo a Corpo com Arma: +7 para acertar , alcance 1,5 m (5 ft), uma criatura. Acerto: 7 (1d6 + 4) de dano de concussão e ..."
  },
  {
    "name": "Homem-Brânquia",
    "source": "MM 2024",
    "cr": "6",
    "ac": 16,
    "hp": 102,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O gill-man faz dois ataques com suas garras. Garra . Ataque Corpo a Corpo com Arma: +8 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 14 (2d8 + 5) de dano cortante."
  },
  {
    "name": "Homem-Lagarto Brutamontes",
    "source": "MM",
    "cr": "3",
    "ac": 16,
    "hp": 91,
    "speed": "9m",
    "attack": "Multiattacks . O homem-lagarto faz dois ataques corpo a corpo. Mordida . Ataque Corpo a Corpo com Arma: +5 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 6 (1d6 + 3) de dano perfurante. Azagaia . Ataque Corpo a Corpo ou à Distância com Arma: +5 para acertar , alcance 1,5 m (5 ft) ou distância 9/36 m (30/120 ft), um alvo. Acerto: 6 (1d6 + 3) de dano perfurante. Martelo de Guerra . Ataque ..."
  },
  {
    "name": "Homúnculo",
    "source": "MM 2024",
    "cr": "0",
    "ac": 13,
    "hp": 4,
    "speed": "9m",
    "attack": "Mordida . Ataque Corpo a Corpo: +4 , alcance 1,5 m (5 ft). 1 de dano perfurante, e o alvo é submetido ao efeito a seguir. Salvaguarda de Constituição: CD 12. Falha: O alvo fica com a condição Envenenado ( Poisoned ) até o fim do próximo turno do homúnculo. Falha por 5 ou mais: O alvo fica com a condição Envenenado por 1 minuto. Enquanto Envenenado , o alvo fica com a condição Inconsciente ( Unc..."
  },
  {
    "name": "Horror do Conclave",
    "source": "MM 2024",
    "cr": "9",
    "ac": 15,
    "hp": 123,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O horror pode usar seu Olhar. Em seguida, realiza dois ataques de garra. Garra . Ataque Corpo a Corpo com Arma: +9 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 14 (2d8 + 5) de dano cortante. Gaze . O horror faz um olhar aleatório, escolhendo um alvo que ele possa ver a até 18 m (60 ft) dele. 1. Olhar de Agonia. A criatura alvo deve realizar uma salvaguarda de Carisma ..."
  },
  {
    "name": "Ilifante",
    "source": "MM 2024",
    "cr": "6",
    "ac": 14,
    "hp": 131,
    "speed": "9m",
    "attack": "Chifrada . Ataque Corpo a Corpo com Arma: +9 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 19 (3d8 + 6) de dano perfurante. Pisotear . Ataque Corpo a Corpo com Arma: +9 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 22 (3d10 + 6) de dano de concussão. Tentáculos . Ataque Corpo a Corpo com Arma: +9 para acertar , alcance 3 m (10 ft), uma criatura. Acerto: 13 (2d10 + 2) de dano psí..."
  },
  {
    "name": "Íncubo",
    "source": "MM 2024",
    "cr": "4",
    "ac": 15,
    "hp": 66,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O íncubo faz dois ataques de Toque Inquieto. Toque Inquieto . Ataque Corpo a Corpo: +7 , alcance 1,5 m (5 ft). 15 (3d6 + 5) de dano Psíquico, e o alvo é amaldiçoado por 24 horas ou até o íncubo morrer. Até a maldição terminar, o alvo não obtém benefício ao completar Descansos Curtos."
  },
  {
    "name": "Inferninseto Rastejante",
    "source": "MM 2024",
    "cr": "4",
    "ac": 14,
    "hp": 88,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O inferninseto faz dois ataques de mordida. Mordida . Ataque com Arma Corpo a Corpo: +5 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 12 (2d8 + 3) de dano perfurante."
  },
  {
    "name": "Iniciado do Culto",
    "source": "MM",
    "cr": "1",
    "ac": 13,
    "hp": 22,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O cultista faz dois ataques corpo a corpo. Adaga . Ataque com Arma Corpo a Corpo ou à Distância: +4 para acertar , alcance 1,5 m (5 ft) ou distância 6/18 m (20/60 ft), um alvo. Acerto: 4 (1d4 + 2) de dano perfurante."
  },
  {
    "name": "Jack Pés de Mola",
    "source": "MM",
    "cr": "10",
    "ac": 14,
    "hp": 299,
    "speed": "9m",
    "attack": "Ataque Múltiplo . Jack faz três ataques de garra. Garra . Ataque Corpo a Corpo com Arma: +8 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 11 (2d6 + 4) de dano cortante, e o alvo deve ser bem-sucedido em uma salvaguarda de Sabedoria CD 15 ou ficar amedrontado até o final de seu próximo turno. Blue and White Flame Breath ( Recharge 6 ) . Jack sopra uma rajada de chamas azuis e brancas em ..."
  },
  {
    "name": "Jack, na Caixa",
    "source": "MM 2024",
    "cr": "9",
    "ac": 13,
    "hp": 157,
    "speed": "9m",
    "attack": "Cruel Teasing . Jack escolhe até duas criaturas que ele possa ver a até 18 m (60 ft) dele. Cada criatura deve ser bem-sucedida em uma salvaguarda de Carisma CD 16 ou sofrer 14 (4d4 + 4) de dano psíquico."
  },
  {
    "name": "Jararaca-da-Mata",
    "source": "MM 2024",
    "cr": "3",
    "ac": 14,
    "hp": 63,
    "speed": "9m",
    "attack": "Mordida . Ataque Corpo a Corpo com Arma: +6 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 8 (1d8 + 4) de dano perfurante mais 18 (4d8) de dano de veneno. Se o alvo for uma criatura, ele deve ser bem-sucedido em uma salvaguarda de Constituição CD 14 ou ficará envenenado por 1 semana. Enquanto envenenada dessa forma, a criatura não pode se beneficiar de descansos curtos e sofre 36 (8d8) d..."
  },
  {
    "name": "Jarl Gigante de Gelo",
    "source": "MM 2024",
    "cr": "11",
    "ac": 16,
    "hp": 187,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O jarl faz dois ataques de machado grande. Machado Grande . Ataque com Arma Corpo a Corpo: +11 para acertar , alcance 3 m (10 ft), um alvo. Acerto: 26 (3d12 + 7) de dano cortante mais 4 (1d8) de dano de frio. Rocha . Ataque com Arma à Distância: +11 para acertar , alcance 18/72 m (60/240 ft), um alvo. Acerto: 29 (4d10 + 7) de dano de concussão. Flash Freeze ( Recharge 5-6 ) . ..."
  },
  {
    "name": "Javali",
    "source": "MM 2024",
    "cr": "1/4",
    "ac": 11,
    "hp": 13,
    "speed": "9m",
    "attack": "Chifrada . Ataque Corpo a Corpo: +3 , alcance 1,5 m (5 ft). 4 (1d6 + 1) de dano perfurante. Se o alvo for uma criatura Média ou menor e o javali tiver se movido 6+ m (20+ ft) em linha reta em direção a ele imediatamente antes do acerto, o alvo sofre 3 (1d6) de dano perfurante adicional e fica com a condição Caído ( Prone ) ."
  },
  {
    "name": "Javali Gigante",
    "source": "MM 2024",
    "cr": "2",
    "ac": 13,
    "hp": 42,
    "speed": "9m",
    "attack": "Chifrada . Ataque Corpo a Corpo: +5 , alcance 1,5 m (5 ft). 10 (2d6 + 3) de dano perfurante. Se o alvo for uma criatura Grande ou menor e o javali tiver se movido 6+ m (20+ ft) em linha reta em direção a ele imediatamente antes do acerto, o alvo sofre 7 (2d6) de dano perfurante adicional e fica com a condição Caído ( Prone ) ."
  },
  {
    "name": "Javali Troll",
    "source": "MM 2024",
    "cr": "3",
    "ac": 13,
    "hp": 57,
    "speed": "9m",
    "attack": "Presa . Ataque Corpo a Corpo com Arma: +6 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 13 (2d8 + 4) de dano cortante."
  },
  {
    "name": "Javali-Crocodilo",
    "source": "MM 2024",
    "cr": "7",
    "ac": 14,
    "hp": 85,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O crocodilo faz três ataques: um com suas garras e dois com sua cauda. Mordida . Ataque Corpo a Corpo com Arma: +8 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 27 (4d10 + 5) de dano perfurante. Se o alvo for uma criatura Média ou menor, ele fica imobilizado (CD 16 para escapar). Até que esse agarrão termine, o alvo está contido , e o crocodilo não pode morder outro al..."
  },
  {
    "name": "Javali-Licantropo",
    "source": "MM 2024",
    "cr": "4",
    "ac": 15,
    "hp": 97,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O javali-licantropo faz dois ataques, usando Javelin ou Presa em qualquer combinação. Ele pode substituir um ataque por um ataque de Chifrada. Chifrada (Só na Forma de Javali ou Híbrida) . Ataque Corpo a Corpo: +5 , alcance 1,5 m (5 ft). 12 (2d8 + 3) de dano Perfurante. Se o alvo for um Humanoide, ele é submetido ao seguinte efeito. con CD 12. Falha: O alvo é amaldiçoado. Se o..."
  },
  {
    "name": "Kelxie",
    "source": "MM 2024",
    "cr": "1/4",
    "ac": 15,
    "hp": 1,
    "speed": "9m",
    "attack": "Ficha de Kelxie (regras 2014): Minúsculo feérico, CA 15, PV 1, CR 1/4. Role direto na mesa com o rolador de dados grátis. Bestiário D&D 5e."
  },
  {
    "name": "Khalkotauroi",
    "source": "MM 2024",
    "cr": "10",
    "ac": 19,
    "hp": 171,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O khalkotauroi faz dois ataques corpo a corpo. Chifrada . Ataque Corpo a Corpo com Arma: +9 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 18 (2d12 + 5) de dano perfurante mais 10 (3d6) de dano de fogo. Cascos . Ataque Corpo a Corpo com Arma: +9 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 16 (2d10 + 5) de dano de concussão mais 10 (3d6) de dano de fogo. Sopro ..."
  },
  {
    "name": "Khenra Dervixe",
    "source": "MM 2024",
    "cr": "3",
    "ac": 14,
    "hp": 97,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O khenra faz dois ataques com khopesh. Khopesh . Ataque Corpo a Corpo com Arma: +5 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 7 (1d8 + 3) de dano cortante, ou 8 (1d10 + 3) de dano cortante se empunhado com duas mãos. Dervish Whirl . O khenra realiza a ação Esquivar. Na próxima vez que o khenra fizer um ataque corpo a corpo antes do final de seu próximo turno, ele po..."
  },
  {
    "name": "Kobold",
    "source": "MM 2024",
    "cr": "1/8",
    "ac": 12,
    "hp": 5,
    "speed": "9m",
    "attack": "Adaga . Ataque Corpo a Corpo com Arma: +4 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 4 (1d4 + 2) de dano perfurante. Funda . Ataque à Distância com Arma: +4 para acertar , alcance 9/36 m (30/120 ft), um alvo. Acerto: 4 (1d4 + 2) de dano de concussão."
  },
  {
    "name": "Kobold Arremessa-Buracos",
    "source": "MM 2024",
    "cr": "2",
    "ac": 12,
    "hp": 77,
    "speed": "9m",
    "attack": "Adaga . Ataque Corpo a Corpo ou à Distância com Arma: +4 para acertar , alcance 1,5 m (5 ft) ou distância 6/18 m (20/60 ft), um alvo. Acerto: 4 (1d4 + 2) de dano perfurante. Bordão . Ataque Corpo a Corpo com Arma: +0 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 1 (1d6 - 2) de dano de concussão, ou 2 (1d8 - 2) de dano de concussão se empunhado com duas mãos. Create Hole ( Recharge 6 ) ...."
  },
  {
    "name": "Kobold Desbravador",
    "source": "MM",
    "cr": "3",
    "ac": 14,
    "hp": 45,
    "speed": "9m",
    "attack": "Adaga . Ataque Corpo a Corpo ou à Distância com Arma: +5 para acertar , alcance 1,5 m (5 ft) ou distância 6/18 m (20/60 ft), um alvo. Acerto: 5 (1d4 + 3) de dano perfurante. Explosive Rune . Ataque à Distância com Arma: +5 para acertar , distância 9/27 m (30/90 ft), um alvo. Acerto: 12 (2d8 + 3) de dano de fogo."
  },
  {
    "name": "Kobold Escama de Chamas",
    "source": "MM",
    "cr": "4",
    "ac": 15,
    "hp": 99,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O kobold faz dois ataques corpo a corpo. Flamefist . Ataque Corpo a Corpo com Arma: +6 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 6 (1d6 + 3) de dano contundente mais 3 (1d6) de dano de fogo. Fire Within ( Recharge 6 ) . O kobold sofre 13 (3d8) de dano de fogo e conjura Queimadura de Aganazzar sem nenhum componente. Sua habilidade de conjuração é Sabedoria (CD de re..."
  },
  {
    "name": "Kraken",
    "source": "MM 2024",
    "cr": "23",
    "ac": 18,
    "hp": 481,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O kraken faz três ataques de tentáculo, cada um dos quais pode substituir por um uso de Arremessar. Tentáculo . Ataque Corpo a Corpo: +17 , alcance 9 m (30 ft). 24 (4d6 + 10) de dano de concussão. O alvo fica com a condição Imobilizado ( Grappled ) (CD 20 para escapar) por um dos dez tentáculos, e com a condição Contido ( Restrained ) até a imobilização terminar. Arremessar . ..."
  },
  {
    "name": "Kuo-Toa Escolhido de Blibdoolpoolp",
    "source": "MM 2024",
    "cr": "6",
    "ac": 15,
    "hp": 120,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O kuo-toa realiza dois ataques: um com sua mordida e um com sua garra. Mordida . Ataque Corpo a Corpo com Arma: +7 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 8 (1d8 + 4) de dano perfurante. Garra . Ataque Corpo a Corpo com Arma: +7 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 13 (2d8 + 4) de dano de concussão, e o alvo fica imobilizado (CD 15 para escapar)...."
  },
  {
    "name": "Kuo-Toa Marinheiro",
    "source": "MM 2024",
    "cr": "2",
    "ac": 14,
    "hp": 71,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O kuo-toa faz dois ataques. Gutting Knife . Ataque Corpo a Corpo com Arma: +4 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 4 (1d4 + 2) de dano cortante. Arpão . Ataque Corpo a Corpo ou à Distância com Arma: +4 para acertar , alcance 1,5 m (5 ft) ou distância 7,5/15 m (25/50 ft), um alvo. Acerto: 5 (1d6 + 2) de dano perfurante, ou 6 (1d8 + 2) de dano perfurante quando ..."
  },
  {
    "name": "Ladino Batedor",
    "source": "MM 2024",
    "cr": "1",
    "ac": 14,
    "hp": 26,
    "speed": "9m",
    "attack": "Azagaia . Ataque à Distância com Arma: +5 para acertar , distância 9/36 m (30/120 ft), um alvo. Acerto: 6 (1d6 + 3) de dano perfurante. Cimitarra . Ataque Corpo a Corpo com Arma: +5 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 6 (1d6 + 3) de dano cortante."
  },
  {
    "name": "Ladino Inquisitivo",
    "source": "MM 2024",
    "cr": "5",
    "ac": 15,
    "hp": 88,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O ladino faz três ataques com sua espada curta ou dois com seu arco longo. Arco Longo . Ataque à Distância com Arma: +6 para acertar , distância 45/180 m (150/600 ft), um alvo. Acerto: 7 (1d8 + 3) de dano perfurante. Espada Curta . Ataque Corpo a Corpo com Arma: +6 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 6 (1d6 + 3) de dano cortante. Insightful Fighting . O ladin..."
  },
  {
    "name": "Ladino Mentor",
    "source": "MM",
    "cr": "9",
    "ac": 15,
    "hp": 195,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O ladino faz dois ataques com sua rapieira e um com sua adaga, ou dois com seu arco longo. Adaga . Ataque Corpo a Corpo ou à Distância com Arma: +8 para acertar , alcance 1,5 m (5 ft) ou distância 6/18 m (20/60 ft), um alvo. Acerto: 6 (1d4 + 4) de dano perfurante. Rapieira . Ataque Corpo a Corpo com Arma: +8 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 8 (1d8 + 4) de ..."
  },
  {
    "name": "Ladrão de Alegria",
    "source": "MM",
    "cr": "6",
    "ac": 15,
    "hp": 130,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O ladrão de alegria faz um ataque com adaga de espinho de rosa e usa seu Drenar Emoções. Rosethorn Dagger . Ataque Corpo a Corpo com Arma: +6 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 10 (3d4 + 3) de dano perfurante mais 7 (2d6) de dano de veneno. Drain Emotions . O ladrão de alegria escolhe uma criatura viva que ele possa ver a até 3 m (10 ft) dele que tenha Caris..."
  },
  {
    "name": "Lagarto",
    "source": "MM 2024",
    "cr": "0",
    "ac": 10,
    "hp": 2,
    "speed": "9m",
    "attack": "Mordida . Ataque Corpo a Corpo: +2 , alcance 1,5 m (5 ft). 1 de dano perfurante."
  },
  {
    "name": "Lagarto Gigante",
    "source": "MM 2024",
    "cr": "1/4",
    "ac": 12,
    "hp": 19,
    "speed": "9m",
    "attack": "Mordida . Ataque Corpo a Corpo com Arma: +4 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 6 (1d8 + 2) de dano perfurante."
  },
  {
    "name": "Lagarto-Samambaia",
    "source": "MM 2024",
    "cr": "1/2",
    "ac": 12,
    "hp": 14,
    "speed": "9m",
    "attack": "Cauda . Ataque com Arma Corpo a Corpo: +4 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 4 (1d4 + 2) de dano perfurante. Venomous Spittle ( Recharge 5-6 ) . O lagarto cospe um glóbulo de veneno em uma criatura que ele possa ver a até 4,5 m (15 ft) dele. O alvo deve ser bem-sucedido em uma salvaguarda de Destreza CD 12 ou ficará cego até o final do próximo turno do lagarto."
  },
  {
    "name": "Lâmia",
    "source": "MM 2024",
    "cr": "4",
    "ac": 13,
    "hp": 97,
    "speed": "9m",
    "attack": "Ataque Múltiplo . A lâmia faz dois ataques: um com suas garras e um com sua adaga ou Toque Intoxicante. Garra . Ataque Corpo a Corpo: +5 , alcance 1,5 m (5 ft). 7 (1d8 + 3) de dano cortante mais 7 (2d6) de dano psíquico. Toque Corruptor . Salvaguarda de Sabedoria: CD 13, uma criatura que a lamia possa ver a até 1,5 m (5 ft). Falha: 13 (3d8) de dano psíquico, e o alvo fica amaldiçoado por 1 hora..."
  },
  {
    "name": "Latkenku",
    "source": "MM",
    "cr": "7",
    "ac": 18,
    "hp": 189,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O golem faz dois ataques. Hair Tentacle . Ataque Corpo a Corpo com Arma: +8 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 15 (3d6 + 5) de dano de concussão, e o alvo fica imobilizado (CD 16 para escapar). Até que esse agarrão termine, o alvo está contido . O golem de cabelo pode formar seis tentáculos de cabelo, cada um dos quais pode agarrar um alvo."
  },
  {
    "name": "Leão",
    "source": "MM 2024",
    "cr": "1",
    "ac": 12,
    "hp": 22,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O leão realiza dois ataques de Dilaceração. Ele pode substituir um ataque por um uso de Rugido. Dilacerar . Ataque Corpo a Corpo: +5 , alcance 1,5 m (5 ft). 7 (1d8 + 3) de dano cortante. Rugido . Salvaguarda de Sabedoria: CD 11, uma criatura a até 4,5 m (15 ft). Falha: O alvo fica com a condição Amedrontado ( Frightened ) até o início do próximo turno do leão."
  },
  {
    "name": "Leão-Dente-de-Leão",
    "source": "MM 2024",
    "cr": "1",
    "ac": 12,
    "hp": 65,
    "speed": "9m",
    "attack": "Mordida . Ataque Corpo a Corpo com Arma: +5 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 7 (1d8 + 3) de dano contundente. Garra . Ataque Corpo a Corpo com Arma: +5 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 6 (1d6 + 3) de dano cortante. Blowball ( Recharge 6 ) . O leão dá uma sacudida digna de sua cauda e libera uma nuvem densa de sementes flutuantes em um cubo de 3 m (10 ft..."
  },
  {
    "name": "Lêmure",
    "source": "MM 2024",
    "cr": "0",
    "ac": 9,
    "hp": 9,
    "speed": "9m",
    "attack": "Limo Vil . Ataque Corpo a Corpo: +2 , alcance 1,5 m (5 ft). 2 (1d4) de dano de veneno."
  },
  {
    "name": "Licantropo-Urso",
    "source": "MM 2024",
    "cr": "5",
    "ac": 15,
    "hp": 135,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O licantropo-urso faz dois ataques, usando Machadinha ou Dilacerar em qualquer combinação. Ele pode substituir um ataque por um ataque de Mordida. Mordida (Só na Forma de Urso ou Híbrida) . Ataque Corpo a Corpo: +7 , alcance 1,5 m (5 ft). 17 (2d12 + 4) de dano perfurante. Se o alvo for um Humanoide, ele é submetido ao efeito a seguir. Salvaguarda de Constituição: CD 14. Falha:..."
  },
  {
    "name": "Lich",
    "source": "MM 2024",
    "cr": "21",
    "ac": 20,
    "hp": 315,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O lich realiza três ataques, usando Explosão Mística ou Toque Paralisante em qualquer combinação. Explosão Bruxológica . Ataque Corpo a Corpo ou à Distância: +12 , alcance 1,5 m (5 ft) ou distância 36 m (120 ft). 31 (4d12 + 5) de dano de força. Toque Paralisante . Ataque Corpo a Corpo: +12 , alcance 1,5 m (5 ft). 15 (3d6 + 5) de dano de frio, e o alvo fica com a condição Paral..."
  },
  {
    "name": "Livro Zombeteiro",
    "source": "MM",
    "cr": "3",
    "ac": 13,
    "hp": 63,
    "speed": "9m",
    "attack": "Golpe . Ataque Corpo a Corpo com Arma: +1 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 2 (1d6 - 1) de dano de concussão. Copy Spell ( Recharge 5-6 ) . O livro zombeteiro imita uma magia com componente verbal que ele ouviu ser conjurada na última rodada, incluindo uma que ele tenha anulado com contramágica. O livro zombeteiro conjura a magia no nível mais baixo possível, sem necessidade..."
  },
  {
    "name": "Lobisomem",
    "source": "MM 2024",
    "cr": "3",
    "ac": 15,
    "hp": 71,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O lobisomem realiza dois ataques, usando Arranhão ou Arco Longo em qualquer combinação. Ele pode substituir um ataque por um ataque de Mordida. Mordida (Só na Forma de Lobo ou Híbrida) . Ataque Corpo a Corpo: +5 , alcance 1,5 m (5 ft). 12 (2d8 + 3) de dano perfurante. Se o alvo for um Humanoide, ele é submetido ao efeito a seguir. Salvaguarda de Constituição: CD 12. Falha: O a..."
  },
  {
    "name": "Lobo",
    "source": "MM 2024",
    "cr": "1/4",
    "ac": 12,
    "hp": 11,
    "speed": "9m",
    "attack": "Mordida . Ataque Corpo a Corpo: +4 , alcance 1,5 m (5 ft). 5 (1d6 + 2) de dano perfurante. Se o alvo for uma criatura Média ou menor, ele fica com a condição Caído ( Prone ) ."
  },
  {
    "name": "Lobo do Inverno",
    "source": "MM 2024",
    "cr": "3",
    "ac": 13,
    "hp": 75,
    "speed": "9m",
    "attack": "Mordida . Ataque Corpo a Corpo com Arma: +6 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 11 (2d6 + 4) de dano perfurante. Se o alvo for uma criatura, ele deve ser bem-sucedido em uma salvaguarda de Força CD 14 ou será derrubado. Sopro Gélido ( Recarga 5-6 ) . O lobo exala uma rajada de vento congelante em um cone de 4,5 m (15 ft). Cada criatura nessa área deve fazer uma salvaguarda de ..."
  },
  {
    "name": "Lobo Gigante",
    "source": "MM 2024",
    "cr": "1",
    "ac": 14,
    "hp": 22,
    "speed": "9m",
    "attack": "Mordida . Ataque Corpo a Corpo: +5 , alcance 1,5 m (5 ft). 8 (1d10 + 3) de dano perfurante. Se o alvo for uma criatura Grande ou menor, ele fica com a condição Caído ( Prone ) ."
  },
  {
    "name": "Macaco Alado",
    "source": "MM 2024",
    "cr": "2",
    "ac": 13,
    "hp": 39,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O macaco faz dois ataques: um com seu punho e um com sua montante. Punho . Ataque com Arma Corpo a Corpo: +5 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 6 (1d6 + 3) de dano de concussão. Espada Grande . Ataque com Arma Corpo a Corpo: +5 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 10 (2d6 + 3) de dano cortante. Rocha . Ataque com Arma à Distância: +5 para ac..."
  },
  {
    "name": "Macgrifo Escarlate",
    "source": "MM 2024",
    "cr": "1",
    "ac": 13,
    "hp": 27,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O macgrifo escarlate faz dois ataques: um com seu bico e um com suas garras. Bico . Ataque Corpo a Corpo com Arma: +5 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 5 (1d4 + 3) de dano perfurante. Garra . Ataque Corpo a Corpo com Arma: +5 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 8 (2d4 + 3) de dano cortante."
  },
  {
    "name": "Magmin",
    "source": "MM 2024",
    "cr": "1/2",
    "ac": 14,
    "hp": 13,
    "speed": "9m",
    "attack": "Toque . Ataque Corpo a Corpo: +4 , alcance 1,5 m (5 ft). 7 (2d4 + 2) de dano de fogo. Se o alvo for uma criatura ou um objeto inflamável que não esteja sendo vestido ou carregado, ele começa a queimar."
  },
  {
    "name": "Mago",
    "source": "MM 2024",
    "cr": "6",
    "ac": 15,
    "hp": 81,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O mago realiza três ataques de Rajada Arcana. Explosão Arcana . Ataque Corpo a Corpo ou à Distância: +6 , alcance 1,5 m (5 ft) ou distância de 36 m (120 ft). 16 (3d8 + 3) de dano de força."
  },
  {
    "name": "Mago, Maestria do Conhecimento",
    "source": "MM",
    "cr": "6",
    "ac": 15,
    "hp": 136,
    "speed": "9m",
    "attack": "Ficha de Mago, Maestria do Conhecimento (regras 2014): Médio humanoide, CA 15, PV 136, CR 6. Role direto na mesa com o rolador de dados grátis. Bestiário…"
  },
  {
    "name": "Mago, Magia de Guerra",
    "source": "MM",
    "cr": "4",
    "ac": 11,
    "hp": 97,
    "speed": "9m",
    "attack": "Ficha de Mago, Magia de Guerra (regras 2014): Médio humanoide, CA 11, PV 97, CR 4. Role direto na mesa com o rolador de dados grátis. Bestiário D&D 5e."
  },
  {
    "name": "Mago, Teurgia",
    "source": "MM",
    "cr": "9",
    "ac": 12,
    "hp": 148,
    "speed": "9m",
    "attack": "Ficha de Mago, Teurgia (regras 2014): Médio humanoide, CA 12, PV 148, CR 9. Role direto na mesa com o rolador de dados grátis. Bestiário D&D 5e."
  },
  {
    "name": "Mamute",
    "source": "MM 2024",
    "cr": "6",
    "ac": 13,
    "hp": 126,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O mamute realiza dois ataques de Chifrada. Chifrada . Ataque Corpo a Corpo: +10 , alcance 3 m (10 ft). 18 (2d10 + 7) de dano perfurante. Se o alvo for uma criatura Enorme ou menor e o mamute tiver se movido 6 m (20 ft) ou mais em linha reta na direção dele imediatamente antes do acerto, o alvo fica com a condição Caído ( Prone ) ."
  },
  {
    "name": "Mantícora",
    "source": "MM 2024",
    "cr": "3",
    "ac": 14,
    "hp": 68,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O mantícora faz três ataques, usando Dilacerar ou Espinho de Cauda em qualquer combinação. Dilacerar . Ataque Corpo a Corpo: +5 , alcance 1,5 m (5 ft). 7 (1d8 + 3) de dano cortante. Espinho de Cauda . Ataque à Distância com Arma: +5 para acertar , alcance 30/60 m (100/200 ft), um alvo. Acerto: 7 (1d8 + 3) de dano perfurante."
  },
  {
    "name": "Manto Sombrio",
    "source": "MM 2024",
    "cr": "1/2",
    "ac": 11,
    "hp": 22,
    "speed": "9m",
    "attack": "Esmagar . Ataque Corpo a Corpo com Arma: +5 para acertar , alcance 1,5 m (5 ft), uma criatura. Acerto: 6 (1d6 + 3) de dano de concussão, e o manto sombrio se prende ao alvo. Se o alvo for Médio ou menor e o manto sombrio tiver vantagem na jogada de ataque, ele se prende envolvendo a cabeça do alvo, e o alvo também fica cego e incapaz de respirar enquanto o manto sombrio estiver preso dessa form..."
  },
  {
    "name": "Marilith",
    "source": "MM 2024",
    "cr": "16",
    "ac": 16,
    "hp": 220,
    "speed": "9m",
    "attack": "Ataque Múltiplo . A marilith faz seis ataques de Lâmina do Pacto e usa Constrição. Lâmina do Pacto . Ataque Corpo a Corpo: +10 , alcance 1,5 m (5 ft). 10 (1d10 + 5) de dano cortante mais 7 (2d6) de dano necrótico. Constrição . Salvaguarda de Força: CD 17, uma criatura Média ou menor que a marilith possa ver a até 1,5 m (5 ft). Falha: 15 (2d10 + 4) de dano de concussão. O alvo fica com a condiçã..."
  },
  {
    "name": "Marionete",
    "source": "MM 2024",
    "cr": "8",
    "ac": 16,
    "hp": 161,
    "speed": "9m",
    "attack": "Ataque Múltiplo . A marionete faz três ataques: um com seu fio da cabeça e dois com seus fios das mãos. Se ambos os fios das mãos acertarem o mesmo alvo, o alvo fica imobilizado (CD 13 para escapar), e ela pode usar seu Titereiro. Head String . Ataque com Arma Corpo a Corpo: +7 para acertar , alcance 9 m (30 ft), um alvo. Acerto: 20 (3d10 + 4) de dano cortante. Hand String . Ataque com Arma Cor..."
  },
  {
    "name": "Mastim",
    "source": "MM 2024",
    "cr": "1/8",
    "ac": 12,
    "hp": 5,
    "speed": "9m",
    "attack": "Mordida . Ataque Corpo a Corpo com Arma: +3 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 4 (1d6 + 1) de dano perfurante. Se o alvo for uma criatura, ele deve ser bem-sucedido em uma salvaguarda de Força CD 11 ou será derrubado."
  },
  {
    "name": "Matrona Urso Coruja",
    "source": "MM 2024",
    "cr": "5",
    "ac": 14,
    "hp": 114,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O corujurso faz três ataques: um com seu bico e dois com suas garras. Bico . Ataque com Arma Corpo a Corpo: +8 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 10 (1d10 + 5) de dano perfurante. Garra . Ataque com Arma Corpo a Corpo: +8 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 14 (2d8 + 5) de dano cortante. Piercing Screech (1/Day) . Cada criatura a até 18 m (..."
  },
  {
    "name": "Medusa",
    "source": "MM 2024",
    "cr": "6",
    "ac": 15,
    "hp": 127,
    "speed": "9m",
    "attack": "Ataque Múltiplo . A medusa realiza três ataques corpo a corpo — um com seu cabelo de serpentes e dois com sua espada curta — ou dois ataques à distância com seu arco longo. Garra . Ataque Corpo a Corpo: +6 , alcance 1,5 m (5 ft). 10 (2d6 + 3) de dano cortante. Cabelos de Serpente . Ataque Corpo a Corpo: +6 , alcance 1,5 m (5 ft). 5 (1d4 + 3) de dano perfurante mais 14 (4d6) de dano de veneno. R..."
  },
  {
    "name": "Mefite de Gelo",
    "source": "MM 2024",
    "cr": "1/2",
    "ac": 11,
    "hp": 21,
    "speed": "9m",
    "attack": "Garra . Ataque Corpo a Corpo: +3 , alcance 1,5 m (5 ft). 3 (1d4 + 1) de dano cortante mais 2 (1d4) de dano de frio. Sopro Congelante ( Recarga 6 ) . Salvaguarda de Constituição: CD 10, cada criatura em um Cone de 4,5 m (15 ft). Falha: 7 (3d4) de dano de frio. Sucesso: Metade do dano."
  },
  {
    "name": "Mefite de Magma",
    "source": "MM 2024",
    "cr": "1/2",
    "ac": 11,
    "hp": 18,
    "speed": "9m",
    "attack": "Garra . Ataque Corpo a Corpo: +3 , alcance 1,5 m (5 ft). 3 (1d4 + 1) de dano cortante mais 3 (1d6) de dano de fogo. Sopro Ígneo ( Recarga 6 ) . O mefite exala um cone de fogo de 4,5 m (15 ft). Cada criatura nessa área deve fazer uma salvaguarda de Destreza CD 11, sofrendo 7 (2d6) de dano de fogo em uma falha, ou metade desse dano em um sucesso."
  },
  {
    "name": "Mefite de Poeira",
    "source": "MM 2024",
    "cr": "1/2",
    "ac": 12,
    "hp": 17,
    "speed": "9m",
    "attack": "Garra . Ataque Corpo a Corpo: +4 , alcance 1,5 m (5 ft). 4 (1d4 + 2) de dano cortante. Sopro Cegante ( Recarga 6 ) . O mefite exala um cone de 4,5 m (15 ft) de poeira cegante. Cada criatura nessa área deve ser bem-sucedida em uma salvaguarda de Destreza CD 10 ou ficará cega por 1 minuto. Uma criatura pode repetir a salvaguarda no final de cada um de seus turnos, encerrando o efeito sobre si mes..."
  },
  {
    "name": "Mefite de Vapor",
    "source": "MM 2024",
    "cr": "1/4",
    "ac": 10,
    "hp": 17,
    "speed": "9m",
    "attack": "Garra . Ataque Corpo a Corpo: +2 , alcance 1,5 m (5 ft). 2 (1d4) de dano cortante mais 2 (1d4) de dano de fogo. Sopro de Vapor ( Recarga 6 ) . Salvaguarda de Constituição: CD 10, cada criatura em um Cone de 4,5 m (15 ft). Falha: 5 (2d4) de dano de fogo, e o Deslocamento do alvo diminui em 3 m (10 ft) até o fim do próximo turno do mefita. Sucesso: Apenas metade do dano. Falha ou Sucesso: Estar d..."
  },
  {
    "name": "Megalodon",
    "source": "MM 2024",
    "cr": "19",
    "ac": 18,
    "hp": 332,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O megalodon faz três ataques: dois com sua mordida e um com sua investida. Mordida . Ataque Corpo a Corpo com Arma: +12 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 32 (4d12 + 6) de dano perfurante. Se o alvo for uma criatura Grande ou menor, ele é engolido. Enquanto engolida, a criatura fica cega e contida , tem cobertura total contra ataques e outros efeitos de fora..."
  },
  {
    "name": "Meganisóptera",
    "source": "MM 2024",
    "cr": "3",
    "ac": 14,
    "hp": 67,
    "speed": "9m",
    "attack": "Ataque Múltiplo . A meganisóptera faz dois ataques de mordida. Mordida . Ataque Corpo a Corpo com Arma: +6 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 11 (2d6 + 4) de dano perfurante."
  },
  {
    "name": "Merrow",
    "source": "MM 2024",
    "cr": "2",
    "ac": 13,
    "hp": 45,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O merrow faz dois ataques: um com sua mordida e um com suas garras ou arpão. Mordida . Ataque Corpo a Corpo: +6 , alcance 1,5 m (5 ft). 6 (1d4 + 4) de dano perfurante, e o alvo fica com a condição Envenenado ( Poisoned ) até o fim do próximo turno do merrow. Garra . Ataque Corpo a Corpo: +6 , alcance 1,5 m (5 ft). 9 (2d4 + 4) de dano cortante. Arpão . Ataque Corpo a Corpo ou à..."
  },
  {
    "name": "Mestre Duelista",
    "source": "MM 2024",
    "cr": "8",
    "ac": 17,
    "hp": 169,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O duelista pode usar Duelo de Astúcia e, em seguida, faz dois ataques com rapieira. Rapieira . Ataque Corpo a Corpo com Arma: +7 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 10 (1d8 + 6) de dano cortante. Battle of Wits . O duelista tenta intimidar uma criatura a até 9 m (30 ft) dele que possa ouvi-lo e compreendê-lo. O duelista faz um teste de Carisma (Intimidação) c..."
  },
  {
    "name": "Mestre Trapaceiro",
    "source": "MM",
    "cr": "14",
    "ac": 21,
    "hp": 108,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O mestre faz dois ataques. DM's Fist . Ataque Corpo a Corpo com Arma: +10 para acertar , alcance 30 m (100 ft), um alvo. Acerto: 26 (2d20 + 5) de dano de concussão, perfurante ou cortante (escolha do mestre). Rockfall . Cada criatura à escolha do mestre dentro de 30 m (100 ft) dele recebe 3 (1d6) de dano de concussão e deve ser bem-sucedida em uma salvaguarda de Constituição C..."
  },
  {
    "name": "Miconídeo Fedor",
    "source": "MM 2024",
    "cr": "4",
    "ac": 14,
    "hp": 65,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O miconídeo usa seus Esporos Fétidos ou seus Esporos Lacrimejantes e, em seguida, faz um ataque de punho. Punho . Ataque Corpo a Corpo com Arma: +2 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 7 (2d4 + 2) de dano de concussão mais 10 (4d4) de dano de veneno. Stink Spores . O miconídeo se sacode vigorosamente e ejeta esporos em uma explosão. Esses esporos caem em um ra..."
  },
  {
    "name": "Miconídeo Guinchador",
    "source": "MM 2024",
    "cr": "1",
    "ac": 13,
    "hp": 17,
    "speed": "9m",
    "attack": "Punho . Ataque Corpo a Corpo com Arma: +3 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 6 (2d4 + 1) de dano de concussão mais 5 (2d4) de dano de veneno. Guincho . O miconídeo emite um grito agudo, desde que não esteja sob luz solar. Esse grito não tem efeito sobre constructos e mortos-vivos. Todas as outras criaturas a até 9 m (30 ft) do miconídeo que possam ouvi-lo devem fazer uma salv..."
  },
  {
    "name": "Miconídeo Portobello",
    "source": "MM 2024",
    "cr": "3",
    "ac": 13,
    "hp": 71,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O miconídeo faz dois ataques de punho. Punho . Ataque Corpo a Corpo com Arma: +4 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 7 (2d4 + 2) de dano de concussão mais 7 (3d4) de dano de veneno. Rapport Spores . Um raio de 9 m (30 ft) de esporos se estende a partir do miconídeo. Esses esporos podem contornar cantos e afetam apenas criaturas com Inteligência 2 ou superior ..."
  },
  {
    "name": "Miconídeo Vidente",
    "source": "MM 2024",
    "cr": "3",
    "ac": 12,
    "hp": 38,
    "speed": "9m",
    "attack": "Punho . Ataque Corpo a Corpo com Arma: +1 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 4 (2d4 - 1) de dano de concussão mais 5 (2d4) de dano de veneno. Hallucination Spores . O miconídeo ejeta esporos em uma criatura que ele pode ver a até 1,5 m (5 ft) dele. O alvo deve ser bem-sucedido em uma salvaguarda de Constituição CD 13 ou ficará envenenado por 1 minuto. O alvo envenenado fica i..."
  },
  {
    "name": "Mímico",
    "source": "MM 2024",
    "cr": "2",
    "ac": 12,
    "hp": 58,
    "speed": "9m",
    "attack": "Mordida . Ataque Corpo a Corpo: +5 (com Vantagem se o alvo estiver Imobilizado ( Grappled ) pelo mímico), alcance 1,5 m (5 ft). 7 (1d8 + 3) de dano perfurante — ou 12 (2d8 + 3) de dano perfurante se o alvo estiver Imobilizado pelo mímico — mais 4 (1d8) de dano ácido. Pseudópode . Ataque Corpo a Corpo: +5 , alcance 1,5 m (5 ft). 7 (1d8 + 3) de dano de concussão mais 4 (1d8) de dano ácido. Se o a..."
  },
  {
    "name": "Mímico",
    "source": "MM",
    "cr": "9",
    "ac": 16,
    "hp": 162,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O mímico faz três ataques corpo a corpo ou três ataques à distância. Como parte do ataque, o mímico conjura uma arma de acessório em sua mão vazia que dura até o final de seu turno. Melee Prop . Ataque com Arma Corpo a Corpo: +9 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 20 (2d10 + 9) de dano de força. Ranged Prop . Ataque com Arma à Distância: +9 para acertar , alc..."
  },
  {
    "name": "Minotauro",
    "source": "MM 2024",
    "cr": "3",
    "ac": 14,
    "hp": 76,
    "speed": "9m",
    "attack": "Machado Grande . Ataque Corpo a Corpo com Arma: +6 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 17 (2d12 + 4) de dano cortante. Chifrada . Ataque Corpo a Corpo com Arma: +6 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 13 (2d8 + 4) de dano perfurante."
  },
  {
    "name": "Minotauro Berserker de Ferro Sangrento",
    "source": "MM 2024",
    "cr": "10",
    "ac": 17,
    "hp": 171,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O minotauro faz três ataques corpo a corpo. Blood-Iron Greataxe . Ataque Corpo a Corpo com Arma: +11 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 13 (1d12 + 7) de dano cortante. Chifrada . Ataque Corpo a Corpo com Arma: +10 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 15 (2d8 + 6) de dano perfurante."
  },
  {
    "name": "Moeda Mordedora",
    "source": "MM 2024",
    "cr": "1/8",
    "ac": 12,
    "hp": 3,
    "speed": "9m",
    "attack": "Mordida . Ataque Corpo a Corpo com Arma: +3 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 4 (1d6 + 1) de dano perfurante."
  },
  {
    "name": "Monge do Caminho da Tranquilidade",
    "source": "MM",
    "cr": "9",
    "ac": 19,
    "hp": 143,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O monge faz quatro ataques corpo a corpo, dos quais apenas um pode ser com seu punho atordoante. Stunning Fist . Ataque Corpo a Corpo com Arma: +8 para acertar , alcance 1,5 m (5 ft), uma criatura. Acerto: 8 (1d8 + 4) de dano de concussão e o alvo deve ser bem-sucedido em uma salvaguarda de Constituição CD 17 ou ficará atordoado até o final do próximo turno do monge. Unarmed ...."
  },
  {
    "name": "Monge do Caminho do Kensei",
    "source": "MM",
    "cr": "4",
    "ac": 17,
    "hp": 65,
    "speed": "9m",
    "attack": "Ficha de Monge do Caminho do Kensei (regras 2014): Médio humanoide, CA 17, PV 65, CR 4. Role direto na mesa com o rolador de dados grátis. Bestiário D&D 5e."
  },
  {
    "name": "Monitor da Ninhada",
    "source": "MM 2024",
    "cr": "7",
    "ac": 12,
    "hp": 126,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O monitor faz dois ataques de punho. Punho . Ataque com Arma Corpo a Corpo: +8 para acertar , alcance 3 m (10 ft), um alvo. Acerto: 21 (3d10 + 5) de dano de concussão. Constrição . Ataque com Arma Corpo a Corpo: +8 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 18 (3d8 + 5) de dano de concussão, e o alvo fica imobilizado (CD 16 para escapar). Até o agarrão terminar, a c..."
  },
  {
    "name": "Monstro dos Biscoitos",
    "source": "MM 2024",
    "cr": "3",
    "ac": 13,
    "hp": 110,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O monstro dos biscoitos faz seis ataques de mordida e pode agarrar a criatura como uma ação bônus. Mordida . Ataque Corpo a Corpo com Arma: +4 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 4 (1d4 + 2) de dano de concussão."
  },
  {
    "name": "Monstro Ferrugem",
    "source": "MM 2024",
    "cr": "1/2",
    "ac": 14,
    "hp": 33,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O rust monster realiza um ataque de Mordida e usa Antenas duas vezes. Mordida . Ataque Corpo a Corpo com Arma: +3 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 5 (1d8 + 1) de dano perfurante. Antenas . O monstro ferrugem corrói um objeto não mágico de metal ferroso que ele possa ver a até 1,5 m (5 ft) dele. Se o objeto não estiver sendo vestido ou carregado, o toque de..."
  },
  {
    "name": "Monte Cambaleante",
    "source": "MM 2024",
    "cr": "5",
    "ac": 15,
    "hp": 110,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O monte cambaleante faz dois ataques de pancada. Se ambos os ataques atingirem um alvo Médio ou menor, o alvo fica imobilizado (CD de escape 14), e o monte cambaleante usa seu Engolfar nele. Tentáculo Carregado . Ataque Corpo a Corpo: +7 , alcance 3 m (10 ft). 7 (1d6 + 4) de dano de concussão mais 5 (2d4) de dano elétrico. Se o alvo for uma criatura Média ou menor, o amontoado..."
  },
  {
    "name": "Morcego",
    "source": "MM 2024",
    "cr": "0",
    "ac": 12,
    "hp": 1,
    "speed": "9m",
    "attack": "Mordida . Ataque Corpo a Corpo: +4 para acertar , alcance 1,5 m (5 ft). 1 de dano perfurante."
  },
  {
    "name": "Morcego Gigante",
    "source": "MM 2024",
    "cr": "1/4",
    "ac": 13,
    "hp": 22,
    "speed": "9m",
    "attack": "Mordida . Ataque Corpo a Corpo: +5 , alcance 1,5 m (5 ft). 6 (1d6 + 3) de dano perfurante."
  },
  {
    "name": "Morcego Infernal",
    "source": "MM 2024",
    "cr": "6",
    "ac": 15,
    "hp": 144,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O morcego infernal faz dois ataques de mordida. Mordida . Ataque Corpo a Corpo com Arma: +6 para acertar , alcance 1,5 m (5 ft), uma criatura. Acerto: 10 (2d6 + 3) de dano perfurante, e o morcego infernal recupera 3 (1d6) pontos de vida."
  },
  {
    "name": "Morphlit",
    "source": "MM 2024",
    "cr": "2",
    "ac": 14,
    "hp": 18,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O morphlit realiza dois ataques de mordida. Mordida . Ataque Corpo a Corpo com Arma: +6 para atingir, alcance 1,5 m (5 ft), um alvo. Acerto: 6 (1d4 + 4) de dano perfurante mais 4 (1d8) de dano do tipo escolhido pela habilidade Defensive Adaptation."
  },
  {
    "name": "Muddle",
    "source": "MM 2024",
    "cr": "2",
    "ac": 8,
    "hp": 39,
    "speed": "9m",
    "attack": "Pseudópode . Ataque Corpo a Corpo com Arma: +4 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 9 (2d6 + 2) de dano de concussão mais 3 (1d6) de dano ácido. Expel Gunk (1/Day) . A torta faz um ataque de arremesso de lodo contra todas as criaturas em um raio de 9 m (30 ft)."
  },
  {
    "name": "Mula",
    "source": "MM 2024",
    "cr": "1/8",
    "ac": 10,
    "hp": 11,
    "speed": "9m",
    "attack": "Cascos . Ataque Corpo a Corpo com Arma: +2 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 4 (1d4 + 2) de dano de concussão."
  },
  {
    "name": "Múmia",
    "source": "MM 2024",
    "cr": "3",
    "ac": 11,
    "hp": 58,
    "speed": "9m",
    "attack": "Ataque Múltiplo . A múmia pode usar seu Olhar Aterrorizante e faz um ataque com seu punho apodrecido. Punho Apodrecedor . Ataque Corpo a Corpo: +5 , alcance 1,5 m (5 ft). 8 (1d10 + 3) de dano de concussão mais 10 (3d6) de dano necrótico. Se o alvo for uma criatura, ele fica amaldiçoado. Enquanto amaldiçoado, o alvo não consegue recuperar Pontos de Vida, o máximo de Pontos de Vida dele não volta..."
  },
  {
    "name": "Musgópede",
    "source": "MM 2024",
    "cr": "6",
    "ac": 14,
    "hp": 115,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O musgópede faz dois ataques de mordida. Mordida . Ataque com Arma Corpo a Corpo: +5 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 5 (1d4 + 3) de dano perfurante, e o alvo deve ser bem-sucedido em uma salvaguarda de Sabedoria CD 13, ou não pode usar reações até o final de seu próximo turno. Em seu turno, o alvo usa sua ação para fazer um ataque corpo a corpo ou à distâ..."
  },
  {
    "name": "Naga Espiritual",
    "source": "MM 2024",
    "cr": "8",
    "ac": 17,
    "hp": 135,
    "speed": "9m",
    "attack": "Ataque Múltiplo . A naga realiza três ataques, usando Mordida ou Raio Necrótico em qualquer combinação. Mordida . Ataque Corpo a Corpo: +7 , alcance 3 m (10 ft). 7 (1d6 + 4) de dano perfurante mais 14 (4d6) de dano de veneno. Raio Necrótico . Ataque à Distância: +6 , alcance 18 m (60 ft). 21 (6d6) de dano necrótico."
  },
  {
    "name": "Naga Guardiã",
    "source": "MM 2024",
    "cr": "10",
    "ac": 18,
    "hp": 136,
    "speed": "9m",
    "attack": "Ataque Múltiplo . A naga realiza dois ataques de Mordida. Ela pode substituir qualquer ataque por um uso de Cuspe Venenoso. Mordida . Ataque Corpo a Corpo: +8 , alcance 3 m (10 ft). 17 (2d12 + 4) de dano perfurante mais 22 (4d10) de dano de veneno. Cuspe Venenoso . Salvaguarda de Constituição: CD 16, uma criatura que a naga possa ver a até 18 m (60 ft). Falha: 31 (7d8) de dano de veneno, e o al..."
  },
  {
    "name": "Nalfeshnee",
    "source": "MM 2024",
    "cr": "13",
    "ac": 18,
    "hp": 184,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O nalfeshnee faz três ataques de Dilacerar. Dilacerar . Ataque Corpo a Corpo: +10 , alcance 3 m (10 ft). 16 (2d10 + 5) de dano cortante mais 11 (2d10) de dano de força. Teleportar . O nalfeshnee se teletransporta magicamente, junto com qualquer equipamento que esteja vestindo ou carregando, até 36 m (120 ft) para um espaço desocupado que ele possa ver."
  },
  {
    "name": "Necrodançarino",
    "source": "MM",
    "cr": "10",
    "ac": 15,
    "hp": 117,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O necrodançarino faz um ataque de rapieira e conjura Zombaria Perversa. Rapieira . Ataque com Arma Corpo a Corpo: +7 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 8 (1d8 + 3) de dano perfurante."
  },
  {
    "name": "Nergalee, a Mestra da Guilda",
    "source": "MM",
    "cr": "15",
    "ac": 16,
    "hp": 227,
    "speed": "9m",
    "attack": "Ficha de Nergalee, a Mestra da Guilda (regras 2014): Médio humanoide, CA 16, PV 227, CR 15. Role direto na mesa com o rolador de dados grátis. Bestiário D&D…"
  },
  {
    "name": "Ningen",
    "source": "MM 2024",
    "cr": "13",
    "ac": 16,
    "hp": 263,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O ningen faz três ataques de garras. Garras . Ataque Corpo a Corpo com Arma: +8 para acertar , alcance 4,5 m (15 ft), um alvo. Acerto: 25 (4d10 + 3) de dano cortante. Psychic Blast ( Recharge 4-6 ) . O ningen emite magicamente energia psíquica em um cone de 18 m (60 ft). Cada criatura nessa área deve ser bem-sucedida em uma salvaguarda de Inteligência CD 18 ou sofrer 27 (5d8 +..."
  },
  {
    "name": "Nobre",
    "source": "MM 2024",
    "cr": "1/8",
    "ac": 15,
    "hp": 9,
    "speed": "9m",
    "attack": "Rapieira . Ataque com Arma Corpo a Corpo: +3 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 5 (1d8 + 1) de dano perfurante."
  },
  {
    "name": "O Dreidrill",
    "source": "MM 2024",
    "cr": "5",
    "ac": 15,
    "hp": 84,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O troll faz três ataques: um com sua mordida e dois com suas garras. Mordida . Ataque Corpo a Corpo com Arma: +7 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 7 (1d6 + 4) de dano perfurante. Garra . Ataque Corpo a Corpo com Arma: +7 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 11 (2d6 + 4) de dano cortante."
  },
  {
    "name": "O Holofrenes Sem Cabeça",
    "source": "MM",
    "cr": "10",
    "ac": 18,
    "hp": 170,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O observador faz oito ataques de pedúnculo. Stalk . Ataque Corpo a Corpo com Arma: +7 para acertar , alcance 3 m (10 ft), um alvo. Acerto: 9 (1d12 + 3) de dano de concussão."
  },
  {
    "name": "Oculoide",
    "source": "MM 2024",
    "cr": "5",
    "ac": 15,
    "hp": 136,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O oculoide faz dois ataques corpo a corpo. Pisotear . Ataque Corpo a Corpo com Arma: +7 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 11 (2d6 + 4) de dano de concussão. O alvo deve fazer uma salvaguarda de Força CD 15 ou será derrubado. Se o alvo já estiver caído , ele ficará imobilizado (CD de escape 15). Até que esse agarrão termine, o oculoide não pode usar seu pisã..."
  },
  {
    "name": "Ogro",
    "source": "MM 2024",
    "cr": "2",
    "ac": 11,
    "hp": 68,
    "speed": "9m",
    "attack": "Clava Grande . Ataque com Arma Corpo a Corpo: +6 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 13 (2d8 + 4) de dano de concussão. Azagaia . Ataque com Arma Corpo a Corpo ou à Distância: +6 para acertar , alcance 1,5 m (5 ft) ou distância 9/36 m (30/120 ft), um alvo. Acerto: 11 (2d6 + 4) de dano perfurante."
  },
  {
    "name": "Ogro da Montanha do Gancho",
    "source": "MM 2024",
    "cr": "8",
    "ac": 16,
    "hp": 189,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O ogro faz dois ataques com seu gancho. Se ambos os ataques acertarem o mesmo alvo, ele pode usar Dilacerar como uma ação bônus. Hook . Ataque com Arma Corpo a Corpo: +7 para acertar , alcance 3 m (10 ft), um alvo. Acerto: 17 (3d8 + 4) de dano perfurante. Dilacerar . Ataque com Arma Corpo a Corpo: +7 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 31 (5d10 + 4) de dano c..."
  },
  {
    "name": "Oni",
    "source": "MM 2024",
    "cr": "7",
    "ac": 17,
    "hp": 119,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O oni faz dois ataques, com suas garras ou com seu glaive. Garra . Ataque Corpo a Corpo: +7 , alcance 3 m (10 ft). 10 (1d12 + 4) de dano cortante mais 9 (2d8) de dano necrótico. Raio de Pesadelo . Ataque à Distância: +5 , alcance 18 m (60 ft). 9 (2d6 + 2) de dano psíquico, e o alvo fica com a condição Amedrontado ( Frightened ) até o início do próximo turno do oni. Metamorfose..."
  },
  {
    "name": "Orador do Culto",
    "source": "MM",
    "cr": "3",
    "ac": 13,
    "hp": 52,
    "speed": "9m",
    "attack": "Ficha de Orador do Culto (regras 2014): Médio humanoide, CA 13, PV 52, CR 3. Role direto na mesa com o rolador de dados grátis. Bestiário D&D 5e."
  },
  {
    "name": "Orc",
    "source": "MM 2024",
    "cr": "1/2",
    "ac": 13,
    "hp": 15,
    "speed": "9m",
    "attack": "Machado Grande . Ataque com Arma Corpo a Corpo: +5 para acertar , alcance 1,5 m (5 ft), um alvo. 9 (1d12 + 3) de dano cortante. Azagaia . Ataque com Arma Corpo a Corpo ou à Distância: +5 para acertar , alcance 1,5 m (5 ft) ou 9/36 m (30/120 ft), um alvo. 6 (1d6 + 3) de dano perfurante."
  },
  {
    "name": "Orc Akhitar",
    "source": "MM",
    "cr": "1",
    "ac": 15,
    "hp": 30,
    "speed": "9m",
    "attack": "Azagaia . Ataque Corpo a Corpo ou à Distância com Arma: +5 para acertar , alcance 1,5 m (5 ft) ou distância 9/36 m (30/120 ft), um alvo. Acerto: 6 (1d6 + 3) de dano perfurante."
  },
  {
    "name": "Orc Arauto Cístico de Yurtrus",
    "source": "MM",
    "cr": "16",
    "ac": 19,
    "hp": 315,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O orc realiza três ataques de toque infeccioso. Infectious Touch . Ataque Corpo a Corpo com Magia: +10 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 18 (4d8) de dano necrótico e o alvo é afetado pela magia necrotic cyst. Vile Regurgitation ( Recharge 6 ) . O orc cospe uma torrente de bile necrótica sanguinolenta em um cone de 9 m (30 ft). Cada criatura na área deve rea..."
  },
  {
    "name": "Orc Cístide de Yurtrus",
    "source": "MM 2024",
    "cr": "5",
    "ac": 15,
    "hp": 123,
    "speed": "9m",
    "attack": "Infectious Touch . Ataque Corpo a Corpo com Magia: +6 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 9 (2d8) de dano necrótico e o alvo é afetado pela magia necrotic cyst. Vile Spew ( Recharge 6 ) . O orc vomita uma torrente de bile necrótica sanguinolenta em uma linha de 6 m (20 ft) de comprimento e 1,5 m (5 ft) de largura. Cada criatura na área deve fazer uma salvaguarda de Destreza CD..."
  },
  {
    "name": "Orc Levanta-Horda",
    "source": "MM",
    "cr": "14",
    "ac": 17,
    "hp": 345,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O orc faz três ataques corpo a corpo. Bladed Gauntlet . Ataque Corpo a Corpo com Arma: +7 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 5 (1d6 + 2) de dano cortante. Bordão . Ataque Corpo a Corpo com Arma: +7 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 5 (1d6 + 2) de dano contundente, ou 6 (1d8 + 2) de dano contundente se usado com duas mãos. Army of Darkness..."
  },
  {
    "name": "Orca",
    "source": "MM 2024",
    "cr": "3",
    "ac": 12,
    "hp": 90,
    "speed": "9m",
    "attack": "Mordida . Ataque Corpo a Corpo com Arma: +6 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 21 (5d6 + 4) de dano perfurante."
  },
  {
    "name": "Ornamental",
    "source": "MM 2024",
    "cr": "2",
    "ac": 13,
    "hp": 50,
    "speed": "9m",
    "attack": "Golpe . Ataque Corpo a Corpo com Arma: +5 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 8 (2d4 + 3) de dano de concussão mais 2 (1d4) de dano de frio."
  },
  {
    "name": "Otyugh",
    "source": "MM 2024",
    "cr": "5",
    "ac": 14,
    "hp": 104,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O otyugh faz três ataques: um com sua mordida e dois com seus tentáculos. Mordida . Ataque Corpo a Corpo com Arma: +6 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 12 (2d8 + 3) de dano perfurante. Se o alvo for uma criatura, ele deve ser bem-sucedido em uma salvaguarda de Constituição CD 15 contra doença ou ficará envenenado até que a doença seja curada. A cada 24 hora..."
  },
  {
    "name": "Ovelha Negra",
    "source": "MM 2024",
    "cr": "0",
    "ac": 10,
    "hp": 5,
    "speed": "9m",
    "attack": "Gnaw . Ataque Corpo a Corpo com Arma: +2 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 2 (1d4) de dano perfurante."
  },
  {
    "name": "Paladino do Juramento de Conquista",
    "source": "MM",
    "cr": "9",
    "ac": 20,
    "hp": 135,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O paladino faz três ataques com espada longa. Espada Longa . Ataque Corpo a Corpo com Arma: +8 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 8 (1d8 + 4) de dano cortante mais 4 (1d8) de dano radiante. Divine Sense (3/Day) . O paladino abre seus sentidos ao divino. Até o final de seu próximo turno, ele sabe a localização de qualquer celestial, corruptor ou morto-vivo a ..."
  },
  {
    "name": "Paladino do Juramento de Traição",
    "source": "MM 2024",
    "cr": "5",
    "ac": 18,
    "hp": 135,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O paladino faz dois ataques com rapieira. Rapieira . Ataque Corpo a Corpo com Arma: +7 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 8 (1d8 + 4) de dano perfurante. Divine Sense (2/Day) . O paladino abre seus sentidos ao divino. Até o final de seu próximo turno, ele sabe a localização de qualquer celestial, corruptor ou morto-vivo a até 18 m (60 ft) que não esteja atrá..."
  },
  {
    "name": "Pantera",
    "source": "MM 2024",
    "cr": "1/4",
    "ac": 13,
    "hp": 13,
    "speed": "9m",
    "attack": "Dilacerar . Ataque Corpo a Corpo: +5 , alcance 1,5 m (5 ft). 6 (1d6 + 3) de dano cortante."
  },
  {
    "name": "Parasita Ladrão de Corpos",
    "source": "MM 2024",
    "cr": "4",
    "ac": 14,
    "hp": 99,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O parasita faz um ataque de mordida e usa seu Drenar Vontade. Mordida . Ataque Corpo a Corpo com Arma: +2 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 5 (2d4) de dano perfurante. Drain Will . O parasita tenta drenar a vontade de uma criatura viva à qual está preso que tenha Inteligência 3 ou superior. O alvo deve ser bem-sucedido em uma salvaguarda de Sabedoria CD 12 ..."
  },
  {
    "name": "Partícula de Relâmpago",
    "source": "MM 2024",
    "cr": "1",
    "ac": 12,
    "hp": 31,
    "speed": "9m",
    "attack": "Choque . Ataque à Distância com Arma: +4 para acertar , alcance 4,5 m (15 ft), um alvo. Acerto: 6 (1d8 + 2) de dano elétrico, e se o alvo for uma criatura Grande ou menor, deve ser bem-sucedido em uma salvaguarda de CD 11 Constituição ou ficará atordoado até o final de seu próximo turno."
  },
  {
    "name": "Pastor do Véu",
    "source": "MM 2024",
    "cr": "13",
    "ac": 17,
    "hp": 195,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O pastor faz dois ataques com foice. Scythe . Ataque com Arma Corpo a Corpo: +10 para acertar , alcance 3 m (10 ft), um alvo. Acerto: 22 (5d6 + 5) de dano cortante mais 18 (4d8) de dano radiante."
  },
  {
    "name": "Patrulheiro Andarilho do Horizonte",
    "source": "MM 2024",
    "cr": "2",
    "ac": 14,
    "hp": 54,
    "speed": "9m",
    "attack": "Ficha de Patrulheiro Andarilho do Horizonte (regras 2014): Pequeno humanoide, CA 14, PV 54, CR 2. Role direto na mesa com o rolador de dados grátis…"
  },
  {
    "name": "Patrulheiro Caçador de Monstros",
    "source": "MM 2024",
    "cr": "5",
    "ac": 16,
    "hp": 117,
    "speed": "9m",
    "attack": "Ficha de Patrulheiro Caçador de Monstros (regras 2014): Médio humanoide, CA 16, PV 117, CR 5. Role direto na mesa com o rolador de dados grátis. Bestiário…"
  },
  {
    "name": "Patrulheiro Guardião Primevo",
    "source": "MM 2024",
    "cr": "9",
    "ac": 15,
    "hp": 182,
    "speed": "9m",
    "attack": "Ficha de Patrulheiro Guardião Primevo (regras 2014): Médio humanoide, CA 15, PV 182, CR 9. Role direto na mesa com o rolador de dados grátis. Bestiário D&D…"
  },
  {
    "name": "Pedreiro",
    "source": "MM 2024",
    "cr": "3",
    "ac": 15,
    "hp": 110,
    "speed": "9m",
    "attack": "Martelo de Guerra . Ataque Corpo a Corpo com Arma: +5 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 7 (1d8 + 3) de dano de concussão, ou 8 (1d10 + 3) de dano de concussão se usado com duas mãos."
  },
  {
    "name": "Pégaso",
    "source": "MM 2024",
    "cr": "2",
    "ac": 12,
    "hp": 59,
    "speed": "9m",
    "attack": "Cascos . Ataque Corpo a Corpo: +6 , alcance 1,5 m (5 ft). 7 (1d6 + 4) de dano de concussão mais 5 (2d4) de dano radiante."
  },
  {
    "name": "Penumbra de Espíritos",
    "source": "MM",
    "cr": "7",
    "ac": 15,
    "hp": 110,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O enxame faz dois ataques corpo a corpo. Toque Fulminante . Ataque Corpo a Corpo com Magia: +6 para acertar , alcance 1,5 m (5 ft), uma criatura. Acerto: 24 (6d6 + 3) de dano necrótico, ou 13 (3d6 + 3) de dano necrótico se o enxame estiver com metade dos seus pontos de vida ou menos. Etereidade . O enxame entra no Plano Etéreo a partir do Plano Material, ou vice-versa. O enxam..."
  },
  {
    "name": "Percevejo-Escudo",
    "source": "MM 2024",
    "cr": "1/2",
    "ac": 13,
    "hp": 38,
    "speed": "9m",
    "attack": "Mordida . Ataque Corpo a Corpo com Arma: +3 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 5 (1d8 + 1) de dano perfurante. Foul Discharge ( Recharge 6 ) . O inseto dispara um cone de 3 m (10 ft) de líquido amarelo e nauseante. Cada criatura na área deve fazer uma salvaguarda de Constituição CD 12 contra veneno. Em uma falha, a criatura gasta sua ação no próximo turno vomitando e cambalea..."
  },
  {
    "name": "Peregrifo",
    "source": "MM 2024",
    "cr": "5",
    "ac": 13,
    "hp": 178,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O peregrifo faz três ataques: um com seu bico e dois com suas garras. Bico . Ataque Corpo a Corpo com Arma: +6 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 8 (1d8 + 4) de dano perfurante. Garra . Ataque Corpo a Corpo com Arma: +6 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 11 (2d6 + 4) de dano cortante."
  },
  {
    "name": "Perseguidor Invisível",
    "source": "MM 2024",
    "cr": "6",
    "ac": 14,
    "hp": 97,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O perseguidor realiza dois ataques de pancada. Golpe de Vento . Ataque Corpo a Corpo: +7 , alcance 1,5 m (5 ft). 11 (2d6 + 4) de dano de força. Vórtice . Salvaguarda de Constituição: CD 14, uma criatura Grande ou menor no espaço do espreitador. Falha: 7 (1d8 + 3) de dano trovejante, e o alvo fica com a condição Imobilizado ( Grappled ) (CD de escapada 13). Até o agarrão termin..."
  },
  {
    "name": "Pesadelo",
    "source": "MM 2024",
    "cr": "3",
    "ac": 13,
    "hp": 68,
    "speed": "9m",
    "attack": "Cascos . Ataque Corpo a Corpo: +6 , alcance 1,5 m (5 ft). 13 (2d8 + 4) de dano de concussão mais 10 (3d6) de dano de fogo. Passo Etéreo . O pesadelo e até três criaturas voluntárias a até 1,5 m (5 ft) dele entram magicamente no Plano Etéreo a partir do Plano Material, ou vice-versa."
  },
  {
    "name": "Pietr, o Exsangue",
    "source": "MM 2024",
    "cr": "15",
    "ac": 18,
    "hp": 238,
    "speed": "9m",
    "attack": "Ficha de Pietr, o Exsangue (regras 2014): Médio morto-vivo, CA 18, PV 238, CR 15. Role direto na mesa com o rolador de dados grátis. Bestiário D&D 5e."
  },
  {
    "name": "Pigasus Javali Infernal",
    "source": "MM 2024",
    "cr": "2",
    "ac": 14,
    "hp": 85,
    "speed": "9m",
    "attack": "Presa . Ataque com Arma Corpo a Corpo: +7 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 8 (1d6 + 5) de dano cortante."
  },
  {
    "name": "Pigasus Miniatura",
    "source": "MM 2024",
    "cr": "1/4",
    "ac": 13,
    "hp": 7,
    "speed": "9m",
    "attack": "Act Adorable . O pigasus grunhe, fuça e sacode suas asinhas emplumadas na tentativa de conquistar afeto. Uma criatura que o pigasus possa ver a até 9 m (30 ft) dele deve ser bem-sucedida em uma salvaguarda de Sabedoria CD 11 ou ficará enfeitiçada por 1 hora. Se o pigasus for um familiar e seu mestre estiver a até 1,5 m (5 ft), o alvo também fica enfeitiçado por essa criatura. Mordida . Ataque c..."
  },
  {
    "name": "Pilar Esquelético",
    "source": "MM 2024",
    "cr": "3",
    "ac": 13,
    "hp": 68,
    "speed": "9m",
    "attack": "Golpe . Ataque Corpo a Corpo com Arma: +6 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 11 (2d6 + 4) de dano de concussão. Reabsorb Skeleton . O pilar esquelético se move 1,5 m (5 ft) até o espaço de um esqueleto que ele criou e o destrói, recebendo 12 (2d8 + 3) pontos de vida temporários."
  },
  {
    "name": "Piranha",
    "source": "MM 2024",
    "cr": "0",
    "ac": 13,
    "hp": 1,
    "speed": "9m",
    "attack": "Mordida . Ataque Corpo a Corpo com Arma: +5 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 1 de dano perfurante."
  },
  {
    "name": "Planador de Asas Ósseas",
    "source": "MM 2024",
    "cr": "2",
    "ac": 14,
    "hp": 68,
    "speed": "9m",
    "attack": "Ficha de Planador de Asas Ósseas (regras 2014): Grande monstruosidade, CA 14, PV 68, CR 2. Role direto na mesa com o rolador de dados grátis. Bestiário D&D…"
  },
  {
    "name": "Planetar",
    "source": "MM 2024",
    "cr": "16",
    "ac": 19,
    "hp": 262,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O planetar faz dois ataques corpo a corpo. Espada Radiante . Ataque Corpo a Corpo: +12 , alcance 3 m (10 ft). 14 (2d6 + 7) de dano cortante mais 18 (4d8) de dano radiante. Explosão Sagrada . Salvaguarda de Destreza: CD 20, cada inimigo em uma Esfera de 6 m (20 ft) de raio centrada em um ponto que o planetar possa ver a até 36 m (120 ft). Falha: 24 (7d6) de dano radiante. Suces..."
  },
  {
    "name": "Plebeu",
    "source": "MM 2024",
    "cr": "0",
    "ac": 10,
    "hp": 4,
    "speed": "9m",
    "attack": "Clava . Ataque Corpo a Corpo com Arma: +2 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 2 (1d4) de dano de concussão."
  },
  {
    "name": "Plesiossauro",
    "source": "MM 2024",
    "cr": "2",
    "ac": 13,
    "hp": 68,
    "speed": "9m",
    "attack": "Mordida . Ataque Corpo a Corpo: +6 , alcance 3 m (10 ft). 11 (2d6 + 4) de dano perfurante."
  },
  {
    "name": "Polvo",
    "source": "MM 2024",
    "cr": "0",
    "ac": 12,
    "hp": 3,
    "speed": "9m",
    "attack": "Tentáculos . Ataque com Arma Corpo a Corpo: +4 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 1 de dano de concussão, e o alvo fica imobilizado (CD 10 para escapar). Até que essa condição de agarrão termine, o polvo não pode usar seus tentáculos em outro alvo. Nuvem de Tinta (Recarrega após um Descanso Curto ou Longo) . Uma nuvem de tinta com raio de 1,5 m (5 ft) se estende ao redor do p..."
  },
  {
    "name": "Polvo Gigante",
    "source": "MM 2024",
    "cr": "1",
    "ac": 11,
    "hp": 45,
    "speed": "9m",
    "attack": "Tentáculos . Ataque Corpo a Corpo: +5 , alcance 3 m (10 ft). 10 (2d6 + 3) de dano de concussão. Se o alvo for uma criatura Média ou menor, ele fica com a condição Imobilizado ( Grappled ) (CD 13 para escapar) pelos oito tentáculos. Enquanto Imobilizado , o alvo fica com a condição Contido ( Restrained ) ."
  },
  {
    "name": "Pônei",
    "source": "MM 2024",
    "cr": "1/8",
    "ac": 10,
    "hp": 11,
    "speed": "9m",
    "attack": "Cascos . Ataque Corpo a Corpo: +4 , alcance 1,5 m (5 ft). 4 (1d4 + 2) de dano de concussão."
  },
  {
    "name": "Potrifo",
    "source": "MM 2024",
    "cr": "1/8",
    "ac": 12,
    "hp": 7,
    "speed": "9m",
    "attack": "Bico . Ataque Corpo a Corpo com Arma: +4 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 4 (1d4 + 2) de dano perfurante."
  },
  {
    "name": "Povo-Lagarto",
    "source": "MM 2024",
    "cr": "1/2",
    "ac": 15,
    "hp": 22,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O povo-lagarto faz dois ataques corpo a corpo, cada um com uma arma diferente. Mordida . Ataque Corpo a Corpo com Arma: +4 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 5 (1d6 + 2) de dano perfurante. Clava Pesada . Ataque Corpo a Corpo com Arma: +4 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 5 (1d6 + 2) de dano contundente. Azagaia . Ataque Corpo a Corpo ou ..."
  },
  {
    "name": "Praga Mecânica",
    "source": "MM 2024",
    "cr": "1/4",
    "ac": 14,
    "hp": 7,
    "speed": "9m",
    "attack": "Ferrão . Ataque com Arma Corpo a Corpo: +5 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 1 de dano perfurante, e o alvo deve fazer uma salvaguarda de Constituição CD 10, recebendo 5 (2d4) de dano de veneno em uma falha, ou metade do dano em um sucesso. C CLOCKWORK PEST Coven Horror"
  },
  {
    "name": "Pseudodragão",
    "source": "MM 2024",
    "cr": "1/4",
    "ac": 14,
    "hp": 10,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O pseudodragão realiza dois ataques de Mordida. Mordida . Ataque Corpo a Corpo com Arma: +4 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 4 (1d4 + 2) de dano perfurante. Ferrão . Salvaguarda de Constituição: CD 12, uma criatura que o pseudodragão possa ver a até 1,5 m (5 ft). Falha: 5 (2d4) de dano de veneno, e o alvo fica com a condição Envenenado ( Poisoned ) por 1 h..."
  },
  {
    "name": "Pteranodonte",
    "source": "MM 2024",
    "cr": "1/4",
    "ac": 13,
    "hp": 13,
    "speed": "9m",
    "attack": "Mordida . Ataque Corpo a Corpo: +4 , alcance 1,5 m (5 ft). 6 (1d8 + 2) de dano Perfurante."
  },
  {
    "name": "Pústula Necrótica",
    "source": "MM 2024",
    "cr": "1/2",
    "ac": 5,
    "hp": 1,
    "speed": "9m",
    "attack": "Toque . Ataque Corpo a Corpo com Arma: -1 para acertar, alcance 1,5 m (5 ft), um alvo. Acerto: 1 de dano necrótico."
  },
  {
    "name": "Quasit",
    "source": "MM 2024",
    "cr": "1",
    "ac": 13,
    "hp": 25,
    "speed": "9m",
    "attack": "Dilacerar . Ataque Corpo a Corpo: +5 , alcance 1,5 m (5 ft). 5 (1d4 + 3) de dano cortante, e o alvo fica com a condição Envenenado ( Poisoned ) até o início do próximo turno do quasit. Assustar (1/Dia) . Uma criatura à escolha do quasit a até 6 m (20 ft) dele deve ser bem-sucedida em uma salvaguarda de Sabedoria CD 10 ou ficará amedrontada por 1 minuto. O alvo pode repetir a salvaguarda no fina..."
  },
  {
    "name": "Quickling Saltador",
    "source": "MM 2024",
    "cr": "5",
    "ac": 17,
    "hp": 112,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O quickling faz quatro ataques com adaga. Adaga . Ataque com Arma Corpo a Corpo: +10 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 9 (1d4 + 7) de dano cortante."
  },
  {
    "name": "Quimera",
    "source": "MM 2024",
    "cr": "6",
    "ac": 14,
    "hp": 114,
    "speed": "9m",
    "attack": "Ataque Múltiplo . A quimera faz um ataque de Aríete, um de Mordida e um de Garra. Ela pode substituir o ataque de Garra por um uso de Sopro Ígneo, se estiver disponível. Mordida . Ataque Corpo a Corpo: +7 , alcance 1,5 m (5 ft). 11 (2d6 + 4) de dano perfurante, ou 18 (4d6 + 4) de dano perfurante se a quimera tinha Vantagem na jogada de ataque. Garra . Ataque Corpo a Corpo: +7 , alcance 1,5 m (5..."
  },
  {
    "name": "Rã",
    "source": "MM 2024",
    "cr": "0",
    "ac": 11,
    "hp": 1,
    "speed": "9m",
    "attack": "Mordida . Ataque Corpo a Corpo: +3 , alcance 1,5 m (5 ft). 1 de dano perfurante."
  },
  {
    "name": "Rã Gigante",
    "source": "MM 2024",
    "cr": "1/4",
    "ac": 11,
    "hp": 18,
    "speed": "9m",
    "attack": "Mordida . Ataque Corpo a Corpo: +3 , alcance 1,5 m (5 ft). 5 (1d6 + 2) de dano perfurante. Se o alvo for uma criatura Média ou menor, ele fica com a condição Imobilizado ( Grappled ) (CD 11 para escapar). Engolir . A rã faz um ataque de mordida contra um alvo Pequeno ou menor que esteja agarrando. Se o ataque acertar, o alvo é engolido e o agarrão termina. O alvo engolido está cego e contido , ..."
  },
  {
    "name": "Raia Celeste",
    "source": "MM 2024",
    "cr": "1",
    "ac": 13,
    "hp": 45,
    "speed": "9m",
    "attack": "Aríete . Ataque Corpo a Corpo com Arma: +4 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 8 (1d12 + 2) de dano de concussão. Ferrão . Ataque Corpo a Corpo com Arma: +4 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 5 (1d6 + 2) de dano perfurante mais 4 (1d8) de dano ácido."
  },
  {
    "name": "Rakshasa",
    "source": "MM 2024",
    "cr": "13",
    "ac": 17,
    "hp": 221,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O rakshasa faz três ataques de Toque Amaldiçoado. Toque Amaldiçoado . Ataque Corpo a Corpo: +10 , alcance 1,5 m (5 ft). 12 (2d6 + 5) de dano cortante mais 19 (3d12) de dano necrótico. Se o alvo for uma criatura, ele fica amaldiçoado. Enquanto amaldiçoado, o alvo não obtém benefício ao concluir um Descanso Curto ou Longo. Comando Funesto ( Recarga 5-6 ) . Salvaguarda de Sabedor..."
  },
  {
    "name": "Raposa-Falcão",
    "source": "MM 2024",
    "cr": "2",
    "ac": 13,
    "hp": 38,
    "speed": "9m",
    "attack": "Ataque Múltiplo . A raposa-falcão faz um ataque de mordida e um ataque de garras. Mordida . Ataque Corpo a Corpo com Arma: +5 para acertar , alcance 1,5 m (5 ft), uma criatura. Acerto: 7 (1d8 + 3) de dano perfurante. Garras . Melee Weapon Attack: +5 to hit , reach 1,5 m (5 ft), one creature. Hit 8 (2d4 + 3) piercing damage. H HAWKFOX Headless Horseman Also known as \"Dullahan\", these fiends wand..."
  },
  {
    "name": "Rastejante Cáustico",
    "source": "MM 2024",
    "cr": "4",
    "ac": 14,
    "hp": 102,
    "speed": "9m",
    "attack": "Garras . Melee Weapon Attack: +5 to hit , reach 1,5 m (5 ft), one target. Hit 12 (2d8 + 3) slashing damage plus 7 (2d6) acid damage. Jato Ácido ( Recarga 6 ) . The crawler spits acid in a line that is 9 m (30 ft) long and 1,5 m (5 ft) wide. Each creature in that line must make a DC 14 Dexterity saving throw, taking 28 (8d6) acid damage on a failed save, or half as much damage on a successful on..."
  },
  {
    "name": "Rastejante do Pântano",
    "source": "MM 2024",
    "cr": "6",
    "ac": 15,
    "hp": 152,
    "speed": "9m",
    "attack": "Ficha de Rastejante do Pântano (regras 2014): Grande elemental, CA 15, PV 152, CR 6. Role direto na mesa com o rolador de dados grátis. Bestiário D&D 5e."
  },
  {
    "name": "Rato",
    "source": "MM 2024",
    "cr": "0",
    "ac": 10,
    "hp": 1,
    "speed": "9m",
    "attack": "Mordida . Ataque Corpo a Corpo: +2 , alcance 1,5 m (5 ft). 1 de dano perfurante."
  },
  {
    "name": "Rato “Do Tamanho de um Campo”",
    "source": "MM 2024",
    "cr": "7",
    "ac": 16,
    "hp": 162,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O rato realiza dois ataques: um com a mordida e outro com o rabo. Ele não pode fazer ambos os ataques contra o mesmo alvo. Mordida . Ataque Corpo a Corpo com Arma: +7 para atingir, alcance 1,5 m (5 ft), um alvo. Acerto: 24 (6d6 + 4) de dano perfurante. Cauda . Ataque Corpo a Corpo com Arma: +7 para atingir, alcance 9 m (30 ft), um alvo. Acerto: 24 (6d6 + 4) de dano por concussão."
  },
  {
    "name": "Rato Gigante",
    "source": "MM 2024",
    "cr": "1/8",
    "ac": 13,
    "hp": 7,
    "speed": "9m",
    "attack": "Mordida . Ataque Corpo a Corpo: +5 , alcance 1,5 m (5 ft). 5 (1d4 + 3) de dano perfurante."
  },
  {
    "name": "Rato Mecânico",
    "source": "MM 2024",
    "cr": "1/8",
    "ac": 12,
    "hp": 9,
    "speed": "9m",
    "attack": "Mordida . Ataque Corpo a Corpo com Arma: +1 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 1 (1d4 - 1) de dano perfurante."
  },
  {
    "name": "Rato-Licantropo",
    "source": "MM 2024",
    "cr": "2",
    "ac": 13,
    "hp": 60,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O rato-licantropo faz dois ataques, usando Arranhão ou Besta de Mão em qualquer combinação. Ele pode substituir um ataque por um ataque de Mordida. Mordida (Só na Forma de Rato ou Híbrida) . Ataque Corpo a Corpo: +5 , alcance 1,5 m (5 ft). 8 (2d4 + 3) de dano perfurante. Se o alvo for um Humanoide, ele é submetido ao efeito a seguir. Salvaguarda de Constituição: CD 11. Falha: ..."
  },
  {
    "name": "Rebento Eldrazi",
    "source": "MM 2024",
    "cr": "1",
    "ac": 12,
    "hp": 45,
    "speed": "9m",
    "attack": "Tentáculos . Melee Weapon Attack: +5 to hit , reach 3 m (10 ft), one target. Hit: 10 (2d6 + 3) bludgeoning damage.If the target is a creature, it is grappled (escape DC 16). Until the grapple ends, the target is restrained, and the scion can't use its tentacles on another target."
  },
  {
    "name": "Rei Abóbora",
    "source": "MM 2024",
    "cr": "13",
    "ac": 17,
    "hp": 225,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O rei faz dois ataques de pancada. Golpe . Ataque com Arma Corpo a Corpo: +11 para acertar , alcance 3 m (10 ft), um alvo. Acerto: 17 (2d10 + 6) de dano de concussão. Squash . Ataque com Arma Corpo a Corpo: +11 para acertar , alcance 3 m (10 ft), um alvo. Acerto: 15 (2d8 + 6) de dano de concussão. O alvo deve ser bem-sucedido em uma salvaguarda de Força CD 19 ou será derrubado..."
  },
  {
    "name": "Remorhaz",
    "source": "MM 2024",
    "cr": "11",
    "ac": 17,
    "hp": 195,
    "speed": "9m",
    "attack": "Mordida . Ataque Corpo a Corpo: +11 , alcance 3 m (10 ft). 18 (2d10 + 7) de dano perfurante mais 14 (4d6) de dano de fogo. Se o alvo for uma criatura Grande ou menor, ele fica com a condição Imobilizado ( Grappled ) (CD 17 para escapar) e com a condição Contido ( Restrained ) até a imobilização terminar."
  },
  {
    "name": "Revenant Cabeça-de-Metal",
    "source": "MM 2024",
    "cr": "5",
    "ac": 13,
    "hp": 153,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O revenant faz dois ataques de punho. Punho . Ataque Corpo a Corpo com Arma: +7 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 11 (2d6 + 4) de dano de concussão. Se o alvo for uma criatura contra a qual o revenant jurou vingança, o alvo sofre 14 (4d6) de dano de concussão extra. Em vez de causar dano, o revenant pode agarrar o alvo (CD de escape 14), desde que o alvo se..."
  },
  {
    "name": "Rex Marinho",
    "source": "MM 2024",
    "cr": "1",
    "ac": 12,
    "hp": 19,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O rex marinho faz dois ataques, um com sua mordida e um com sua cauda. Mordida . Ataque Corpo a Corpo com Arma: +6 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 9 (1d10 + 4) de dano perfurante. Se o alvo for uma criatura Miúda, ele fica imobilizado (CD de escape 14). Até esse agarrão terminar, o alvo está contido , e o rex marinho não pode morder outro alvo. Cauda . At..."
  },
  {
    "name": "Rinoceronte",
    "source": "MM 2024",
    "cr": "2",
    "ac": 13,
    "hp": 45,
    "speed": "9m",
    "attack": "Chifrada . Ataque Corpo a Corpo: +7 , alcance 1,5 m (5 ft). 14 (2d8 + 5) de dano perfurante. Se o alvo for uma criatura Grande ou menor e o rinoceronte tiver se movido 6 m (20 ft) ou mais em linha reta na direção dele imediatamente antes do acerto, o alvo sofre 9 (2d8) de dano perfurante extra e fica com a condição Caído ( Prone ) ."
  },
  {
    "name": "Roc",
    "source": "MM 2024",
    "cr": "11",
    "ac": 15,
    "hp": 248,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O roc faz dois ataques: um com seu bico e um com suas garras. Bico . Ataque Corpo a Corpo: +13 , alcance 3 m (10 ft). 28 (3d12 + 9) de dano perfurante. Garras . Ataque Corpo a Corpo com Arma: +13 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 23 (4d6 + 9) de dano cortante, e o alvo fica imobilizado (CD 19 para escapar). Até que esse agarrão termine, o alvo está contido ..."
  },
  {
    "name": "Roper",
    "source": "MM 2024",
    "cr": "5",
    "ac": 20,
    "hp": 93,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O roper faz quatro ataques com seus tentáculos, usa Puxar e faz um ataque com sua mordida. Mordida . Ataque Corpo a Corpo: +7 , alcance 1,5 m (5 ft). 17 (3d8 + 4) de dano perfurante. Tentáculo . Ataque Corpo a Corpo: +7 , alcance 18 m (60 ft). O alvo fica com a condição Imobilizado ( Grappled ) (CD de escapada 14) por um de seis tentáculos, e o alvo fica com a condição Envenen..."
  },
  {
    "name": "Rupert Lanoso, Hamster Espacial Gigante do Mau Agouro",
    "source": "MM 2024",
    "cr": "1/2",
    "ac": 14,
    "hp": 22,
    "speed": "9m",
    "attack": "Headbutt . Ataque Corpo a Corpo com Arma: +4 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 6 (1d8 + 2) de dano de concussão. Arco Curto . Ataque à Distância com Arma: +4 para acertar , alcance 24/96 m (80/320 ft), um alvo. Acerto: 5 (1d6 + 2) de dano perfurante."
  },
  {
    "name": "Rusalka",
    "source": "MM 2024",
    "cr": "4",
    "ac": 17,
    "hp": 97,
    "speed": "9m",
    "attack": "Encanto . Um humanoide que a rusalka possa ver a até 30 m (100 ft) dela deve ser bem-sucedido em uma salvaguarda de Sabedoria CD 15 ou ficará magicamente enfeitiçado por 1 hora. O alvo enfeitiçado deve gastar seus turnos tentando se mover o mais perto possível da rusalka. O alvo não pode usar reações, e como ação, pode usar apenas a ação Disparada. Se o alvo sofrer qualquer dano, pode repetir a..."
  },
  {
    "name": "Sacerdote",
    "source": "MM 2024",
    "cr": "2",
    "ac": 13,
    "hp": 38,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O sacerdote realiza dois ataques, usando Maça ou Chama Radiante em qualquer combinação. Maça . Ataque Corpo a Corpo: +5 , alcance 1,5 m (5 ft). 6 (1d6 + 3) de dano de concussão mais 5 (2d4) de dano radiante. Chama Radiante . Ataque à Distância: +5 , alcance 18 m (60 ft). 11 (2d10) de dano radiante."
  },
  {
    "name": "Sacerdote Vodu Homem-Lagarto",
    "source": "MM",
    "cr": "4",
    "ac": 14,
    "hp": 84,
    "speed": "9m",
    "attack": "Multiattacks . O homem-lagarto faz três ataques corpo a corpo. Adaga . Ataque com Arma Corpo a Corpo ou à Distância: +3 para acertar , alcance 1,5 m (5 ft) ou distância 6/18 m (20/60 ft), um alvo. Acerto: 3 (1d4 + 1) de dano perfurante Vampiric Touch . Ataque Corpo a Corpo com Magia: +6 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 10 (3d6) de dano necrótico, e o homem-lagarto recupera ..."
  },
  {
    "name": "Sahuagin",
    "source": "MM 2024",
    "cr": "1/2",
    "ac": 12,
    "hp": 22,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O sahuagin faz dois ataques corpo a corpo: um com sua mordida e um com suas garras ou lança. Mordida . Ataque Corpo a Corpo com Arma: +3 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 3 (1d4 + 1) de dano perfurante. Garras . Ataque Corpo a Corpo com Arma: +3 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 3 (1d4 + 1) de dano cortante. Lança . Ataque Corpo a Corpo ..."
  },
  {
    "name": "Salamandra",
    "source": "MM 2024",
    "cr": "5",
    "ac": 15,
    "hp": 90,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O salamandra faz dois ataques de Lança Flamejante. Ele pode substituir um ataque por um uso de Constrição. Lança Flamejante . Ataque Corpo a Corpo ou à Distância: +7 , alcance 1,5 m (5 ft) ou distância 6/18 m (20/60 ft). 13 (2d8 + 4) de dano perfurante mais 7 (2d6) de dano de fogo. Acerto ou Erro: A lança retorna magicamente à mão da salamandra imediatamente após um ataque à d..."
  },
  {
    "name": "Sangue de Yurtrus",
    "source": "MM 2024",
    "cr": "5",
    "ac": 15,
    "hp": 123,
    "speed": "9m",
    "attack": "Infectious Touch . Ataque Corpo a Corpo com Magia: +6 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 9 (2d8) de dano necrótico e o alvo é afetado pela magia necrotic cyst. Vile Spew ( Recharge 6 ) . O orc cospe uma torrente de bile necrótica sanguinolenta em uma linha de 6 m (20 ft) de comprimento e 1,5 m (5 ft) de largura. Cada criatura na área deve realizar uma salvaguarda de Destreza ..."
  },
  {
    "name": "Santacap",
    "source": "MM 2024",
    "cr": "5",
    "ac": 15,
    "hp": 121,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O santacap faz três ataques com machado perverso. Se dois ataques com machado perverso atingirem o mesmo alvo, ele pode usar seu ataque de saco contra esse alvo. Wicked Axe . Ataque Corpo a Corpo com Arma: +8 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 18 (2d12 + 5) de dano cortante. Sack . O santacap balança seu saco em direção a uma criatura que ele possa alcançar...."
  },
  {
    "name": "Sapo Gigante",
    "source": "MM 2024",
    "cr": "1",
    "ac": 11,
    "hp": 39,
    "speed": "9m",
    "attack": "Mordida . Ataque Corpo a Corpo: +4 , alcance 1,5 m (5 ft). 5 (1d6 + 2) de dano perfurante mais 5 (2d4) de dano de veneno. Se o alvo for uma criatura Média ou menor, ele fica com a condição Imobilizado ( Grappled ) (CD 12 para escapar). Engolir . O sapo faz um ataque de mordida contra um alvo Médio ou menor que esteja agarrando. Se o ataque acertar, o alvo é engolido e o agarrão termina. O alvo ..."
  },
  {
    "name": "Sapocarniçal",
    "source": "MM 2024",
    "cr": "2",
    "ac": 14,
    "hp": 27,
    "speed": "9m",
    "attack": "Mordida . Ataque Corpo a Corpo com Arma: +3 para acertar , alcance 1,5 m (5 ft), uma criatura. Acerto: 4 (2d8 + 3) de dano perfurante. O sapocarniçal tem vantagem neste ataque se o alvo estiver imobilizado por ele. Tounge . Ataque Corpo a Corpo com Arma: +5 para acertar , alcance 4,5 m (15 ft), uma criatura. Acerto: 7 (1d8 + 3) de dano de concussão e o alvo fica imobilizado (CD 13 para escapar)..."
  },
  {
    "name": "Sarça Rastejante",
    "source": "MM 2024",
    "cr": "3",
    "ac": 16,
    "hp": 39,
    "speed": "9m",
    "attack": "Ataque Múltiplo . A sarça rastejante faz três ataques: um com sua mordida e dois com suas vinhas. Mordida . Ataque Corpo a Corpo com Arma: +6 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 11 (2d6 + 4) de dano perfurante. Vines . Ataque Corpo a Corpo com Arma: +6 para acertar , alcance 12 m (40 ft), um alvo. Acerto: 10 (1d10 + 4) de dano de concussão. Se o alvo for Médio ou menor, ele fi..."
  },
  {
    "name": "Sátiro",
    "source": "MM 2024",
    "cr": "1/2",
    "ac": 13,
    "hp": 31,
    "speed": "9m",
    "attack": "Cascos . Ataque Corpo a Corpo: +5 , alcance 1,5 m (5 ft). 5 (1d4 + 3) de dano de concussão. Se o alvo for uma criatura Média ou menor, o sátiro empurra o alvo até 3 m (10 ft) em linha reta para longe de si. Escárnio . Salvaguarda de Sabedoria: CD 12, uma criatura que o sátiro possa ver a até 27 m (90 ft). Falha: 5 (1d6 + 2) de dano psíquico."
  },
  {
    "name": "Senhor da Estagnação",
    "source": "MM 2024",
    "cr": "17",
    "ac": 18,
    "hp": 310,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O senhor faz quatro ataques de punho. Punho . Ataque Corpo a Corpo com Arma: +13 para acertar , alcance 4,5 m (15 ft), um alvo. Acerto: 20 { 2d12 + 7 } de dano de concussão. Maddening Roar ( Recharge 6 ) . O senhor emite um rugido devastador para a mente. Cada criatura à escolha do senhor a até 30 m (100 ft) dele e que possa ouvir o rugido deve fazer uma salvaguarda de Sabedor..."
  },
  {
    "name": "Senhor das Múmias Metaleiro",
    "source": "MM 2024",
    "cr": "16",
    "ac": 17,
    "hp": 120,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O senhor das múmias pode usar seu Olhar Aterrorizante e faz um ataque com seu punho apodrecido. Punho Apodrecedor . Ataque Corpo a Corpo com Arma: +9 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 14 (3d6 + 4) de dano de concussão mais 21 (6d6) de dano necrótico. Se o alvo for uma criatura, ele deve ser bem-sucedido em uma salvaguarda de Constituição CD 16 ou será amald..."
  },
  {
    "name": "Senhor Múmia",
    "source": "MM 2024",
    "cr": "15",
    "ac": 17,
    "hp": 187,
    "speed": "9m",
    "attack": "Ataque Múltiplo . A múmia pode usar seu Olhar Aterrorizante e faz um ataque com seu punho apodrecido. Punho Apodrecedor . Ataque Corpo a Corpo: +9 , alcance 1,5 m (5 ft). 15 (2d10 + 4) de dano de concussão mais 10 (3d6) de dano necrótico. Se o alvo for uma criatura, ele fica amaldiçoado. Enquanto amaldiçoado, o alvo não consegue recuperar Pontos de Vida, não obtém benefício algum ao terminar um..."
  },
  {
    "name": "Senhora Sombria",
    "source": "MM 2024",
    "cr": "5",
    "ac": 14,
    "hp": 110,
    "speed": "9m",
    "attack": "Ataque Múltiplo . A senhora faz três ataques corpo a corpo. Garra . Ataque com Arma Corpo a Corpo: +7 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 13 (2d8 + 4) de dano cortante. Chicote . Ataque com Arma Corpo a Corpo: +7 para acertar , alcance 3 m (10 ft), um alvo. Acerto: 11 (3d4 + 4) de dano cortante."
  },
  {
    "name": "Sereiano",
    "source": "MM 2024",
    "cr": "1/8",
    "ac": 11,
    "hp": 11,
    "speed": "9m",
    "attack": "Lança . Ataque Corpo a Corpo ou à Distância com Arma: +2 para acertar , alcance 1,5 m (5 ft) ou distância 6/18 m (20/60 ft), um alvo. Acerto: 3 (1d6) de dano perfurante, ou 4 (1d8) de dano perfurante se usado com duas mãos para realizar um ataque corpo a corpo."
  },
  {
    "name": "Seukothi",
    "source": "MM 2024",
    "cr": "1",
    "ac": 16,
    "hp": 55,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O seukothi faz dois ataques: um com sua espada longa e um com sua lança. Espada Longa . Ataque Corpo a Corpo com Arma: +5 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 7 (1d8 + 3) de dano cortante. Lança . Ataque Corpo a Corpo ou à Distância com Arma: +5 para acertar , alcance 1,5 m (5 ft) ou distância 6/18 m (20/60 ft), um alvo. Acerto: 7 (1d8 + 3) de dano perfurante."
  },
  {
    "name": "Sir Hunter Von Huntington III",
    "source": "MM",
    "cr": "15",
    "ac": 19,
    "hp": 187,
    "speed": "9m",
    "attack": "Ficha de Sir Hunter Von Huntington III (regras 2014): Médio humanoide, CA 19, PV 187, CR 15. Role direto na mesa com o rolador de dados grátis. Bestiário…"
  },
  {
    "name": "Skuz",
    "source": "MM",
    "cr": "9",
    "ac": 16,
    "hp": 189,
    "speed": "9m",
    "attack": "Ficha de Skuz (regras 2014): Grande morto-vivo, CA 16, PV 189, CR 9. Role direto na mesa com o rolador de dados grátis. Bestiário D&D 5e."
  },
  {
    "name": "Snull",
    "source": "MM 2024",
    "cr": "3",
    "ac": 14,
    "hp": 99,
    "speed": "9m",
    "attack": "Headbutt . Ataque Corpo a Corpo com Arma: +2 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 1 (1d4 + 1) de dano de concussão mais 9 (2d8) de dano necrótico. Withdraw . O snull se recolhe dentro de seu crânio. Até que ele emerja, ele ganha um bônus de +4 na CA e tem vantagem em testes de Destreza (Furtividade). Enquanto estiver dentro de seu crânio, seu deslocamento é 0 e não pode aumenta..."
  },
  {
    "name": "Solar",
    "source": "MM 2024",
    "cr": "21",
    "ac": 21,
    "hp": 297,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O solar faz dois ataques com montante. Espada Voadora . Ataque Corpo a Corpo ou à Distância: +15 , alcance 3 m (10 ft) ou alcance 36 m (120 ft). 22 (4d6 + 8) de dano cortante mais 36 (8d8) de dano radiante. Acerto ou Erro: A espada retorna magicamente à mão do solar ou paira a até 1,5 m (5 ft) dele imediatamente depois de um ataque à distância. Arco Matador . Salvaguarda de De..."
  },
  {
    "name": "Soldado de Estanho",
    "source": "MM 2024",
    "cr": "1/4",
    "ac": 14,
    "hp": 13,
    "speed": "9m",
    "attack": "Espada Curta . Ataque com Arma Corpo a Corpo: +3 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 4 (1d6 + 1) de dano cortante."
  },
  {
    "name": "Sombra",
    "source": "MM 2024",
    "cr": "1/2",
    "ac": 12,
    "hp": 27,
    "speed": "9m",
    "attack": "Golpe Dreno . Ataque Corpo a Corpo: +4 , alcance 1,5 m (5 ft). 5 (1d6 + 2) de dano necrótico, e o valor de Força do alvo diminui em 1d4 . O alvo morre se isso reduzir esse valor a 0. Se um Humanoide for morto por este ataque, uma Sombra se ergue do cadáver 1d4 horas depois."
  },
  {
    "name": "Spellskite",
    "source": "MM 2024",
    "cr": "5",
    "ac": 14,
    "hp": 102,
    "speed": "9m",
    "attack": "Mordida . Ataque Corpo a Corpo com Arma: +4 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 10 (2d8 + 1) de dano perfurante."
  },
  {
    "name": "Sprite",
    "source": "MM 2024",
    "cr": "1/4",
    "ac": 15,
    "hp": 10,
    "speed": "9m",
    "attack": "Espada-Agulha . Ataque Corpo a Corpo: +6 , alcance 1,5 m (5 ft). 6 (1d4 + 4) de dano perfurante. Arco Encantador . Ataque à Distância: +6 , alcance 12/48 m (40/160 ft). 1 de dano perfurante, e o alvo fica com a condição Enfeitiçado ( Charmed ) até o início do próximo turno do sprite. Ver o Coração . Salvaguarda de Carisma: CD 10, uma criatura a até 1,5 m (5 ft) que o sprite possa ver (Celestiai..."
  },
  {
    "name": "Sprite Invernal",
    "source": "MM 2024",
    "cr": "1",
    "ac": 15,
    "hp": 7,
    "speed": "9m",
    "attack": "Icesickle . Ataque com Arma Corpo a Corpo: +7 para acertar , alcance 1,5 m (5 ft), uma criatura. Acerto: 1 de dano cortante, e o alvo deve ser bem-sucedido em uma salvaguarda de Constituição CD 10 ou sofrer 3 (1d6) de dano de frio e ficar paralisado até o final do próximo turno do sprite."
  },
  {
    "name": "Súcubo",
    "source": "MM 2024",
    "cr": "4",
    "ac": 15,
    "hp": 71,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O súcubo faz um ataque de Toque Demoníaco e usa Encantar ou Beijo Drenante. Toque Infernal . Ataque Corpo a Corpo: +7 , alcance 1,5 m (5 ft). 16 (2d10 + 5) de dano Psíquico. Encanto . A súcubo conjura Dominar Pessoa (versão de nível 8), não exigindo componentes de magia e usando Carisma como habilidade de conjuração (CD de resistência de magia 15). Beijo Dreno . Salvaguarda de..."
  },
  {
    "name": "Sufganiyooze",
    "source": "MM 2024",
    "cr": "9",
    "ac": 16,
    "hp": 95,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O golem faz dois ataques de pancada ou um ataque de pancada e usa sua habilidade de fornalha. Golpe . Ataque Corpo a Corpo com Arma: +8 para acertar , alcance 3 m (10 ft), um alvo. Acerto: 11 (2d6 + 4) de dano perfurante mais 7 (2d6) de dano de fogo. Furnace ( Recharge 4-6 ) . O golem abre sua fornalha, exalando cinzas ardentes e os gritos de almas aprisionadas em um cone de 4..."
  },
  {
    "name": "Sussurrador Delirante",
    "source": "MM 2024",
    "cr": "2",
    "ac": 9,
    "hp": 52,
    "speed": "9m",
    "attack": "Mordida . Ataque Corpo a Corpo: +2 , alcance 1,5 m (5 ft). 7 (2d6) de dano perfurante. Se o alvo for uma criatura Média ou menor, ele fica com a condição Caído ( Prone ) . O alvo morre se for reduzido a 0 Pontos de Vida por este ataque. O corpo dele é então absorvido pelo devorador, deixando para trás apenas o equipamento. Cuspe Cegante ( Recarga 5-6 ) . Salvaguarda de Destreza: CD 10, cada cri..."
  },
  {
    "name": "Taena Morae",
    "source": "MM",
    "cr": "4",
    "ac": 19,
    "hp": 117,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O seukothi faz dois ataques: um com seu ratash'ta e um com sua lança. Ratash'ta . Ataque Corpo a Corpo com Arma: +6 para acertar , alcance 4,5 m (15 ft), um alvo. Acerto: 9 (1d10 + 4) de dano cortante. Lança . Ataque Corpo a Corpo ou à Distância com Arma: +6 para acertar , alcance 1,5 m (5 ft) ou distância 6/18 m (20/60 ft), um alvo. Acerto: 8 (1d8 + 4) de dano perfurante."
  },
  {
    "name": "Tamboril Gigante",
    "source": "MM 2024",
    "cr": "5",
    "ac": 13,
    "hp": 105,
    "speed": "9m",
    "attack": "Mordida . Ataque Corpo a Corpo com Arma: +8 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 21 (3d10 + 5) de dano perfurante. Se o alvo for uma criatura Enorme ou menor, essa criatura é engolida. Enquanto engolida, a criatura está cega e contida , tem cobertura total contra ataques e outros efeitos de fora do tamboril, e sofre 17 (5d6) de dano ácido no início de cada turno do tamboril. O ..."
  },
  {
    "name": "Tapete Sufocante",
    "source": "MM 2024",
    "cr": "2",
    "ac": 12,
    "hp": 33,
    "speed": "9m",
    "attack": "Sufocar . Ataque Corpo a Corpo com Arma: +5 para acertar , alcance 1,5 m (5 ft), uma criatura Média ou menor. Acerto: A criatura fica imobilizada (CD 13 para escapar). Até que esse agarrão termine, o alvo está contido , cego e em risco de sufocamento, e o tapete não pode sufocar outro alvo. Além disso, no início de cada turno do alvo, o alvo sofre 10 (2d6 + 3) de dano de concussão."
  },
  {
    "name": "Tardígrado Gigante",
    "source": "MM 2024",
    "cr": "4",
    "ac": 14,
    "hp": 54,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O tardígrado faz dois ataques de garra. Garra . Ataque Corpo a Corpo com Arma: +6 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 13 (2d8 + 4) de dano cortante, e o alvo fica imobilizado . Mordida . Ataque Corpo a Corpo com Arma: +6 para acertar , alcance 1,5 m (5 ft), uma criatura Grande ou menor imobilizada pelo tardígrado. Acerto: 23 (3d12 + 4) de dano perfurante, e o..."
  },
  {
    "name": "Tarrasque",
    "source": "MM 2024",
    "cr": "30",
    "ac": 25,
    "hp": 697,
    "speed": "9m",
    "attack": "Ataque Múltiplo . A tarrasque faz um ataque de Mordida e três outros ataques, usando Garra ou Cauda em qualquer combinação. Mordida . Ataque Corpo a Corpo: +19 , alcance 4,5 m (15 ft). 36 (4d12 + 10) de dano perfurante, e o alvo fica com a condição Imobilizado ( Grappled ) (CD 20 para escapar). Até a imobilização terminar, o alvo fica com a condição Contido ( Restrained ) e não consegue se tele..."
  },
  {
    "name": "Tartaruga-Dragão",
    "source": "MM 2024",
    "cr": "17",
    "ac": 20,
    "hp": 356,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O dragão faz três ataques de Mordida. Ele pode substituir um ataque por um ataque de Cauda. Mordida . Ataque Corpo a Corpo: +13 , alcance 4,5 m (15 ft). 23 (3d10 + 7) de dano perfurante mais 7 (2d6) de dano de fogo. Estar debaixo d'água não concede Resistência a esse dano de fogo. Cauda . Ataque Corpo a Corpo: +13 , alcance 4,5 m (15 ft). 18 (2d10 + 7) de dano de concussão. Se..."
  },
  {
    "name": "Tatu-Bola Gigante",
    "source": "MM 2024",
    "cr": "2",
    "ac": 14,
    "hp": 44,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O tatu faz dois ataques de garra. Garra . Ataque Corpo a Corpo com Arma: +4 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 6 (1d8 + 2) de dano cortante. Se o alvo for uma criatura, ele deve ser bem-sucedido em uma salvaguarda de Constituição CD 11 ou ter seu deslocamento reduzido pela metade até terminar um descanso longo ou receber cura mágica. Roll Up . Até o início d..."
  },
  {
    "name": "Tentaghoul",
    "source": "MM 2024",
    "cr": "3",
    "ac": 13,
    "hp": 76,
    "speed": "9m",
    "attack": "Tentáculo . Ataque Corpo a Corpo com Arma: +6 para atingir, alcance 3 m (10 ft), um alvo. Acerto: 13 (2d8 + 4) de dano por concussão. Se o alvo for uma criatura que não seja morto-vivo, deve ser bem-sucedido em uma salvaguarda de Constituição CD 12 ou ficar Paralisado ( Paralyzed ) por 1 minuto. O alvo pode repetir a salvaguarda no final de cada um de seus turnos, terminando o efeito em si mesm..."
  },
  {
    "name": "Terragavião",
    "source": "MM 2024",
    "cr": "2",
    "ac": 15,
    "hp": 90,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O terragavião faz dois ataques de garra. Ele pode usar Tremores no lugar de um ataque de garra. Garra . Ataque Corpo a Corpo com Arma: +4 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 4 (1d4 + 2) de dano cortante. Tremors ( Recharge 5-6 ) . O terragavião usa uma das seguintes habilidades se estiver sobre ou sob o solo. Quake . O terragavião desencadeia um pequeno terre..."
  },
  {
    "name": "Texugo",
    "source": "MM 2024",
    "cr": "0",
    "ac": 11,
    "hp": 5,
    "speed": "9m",
    "attack": "Mordida . Ataque Corpo a Corpo com Arma: +2 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 1 de dano perfurante."
  },
  {
    "name": "Texugo Gigante",
    "source": "MM 2024",
    "cr": "1/4",
    "ac": 13,
    "hp": 15,
    "speed": "9m",
    "attack": "Mordida . Ataque Corpo a Corpo: +3 , alcance 1,5 m (5 ft). 6 (2d4 + 1) de dano perfurante."
  },
  {
    "name": "Tigre",
    "source": "MM 2024",
    "cr": "1",
    "ac": 13,
    "hp": 30,
    "speed": "9m",
    "attack": "Dilacerar . Ataque Corpo a Corpo: +5 , alcance 1,5 m (5 ft). 10 (2d6 + 3) de dano cortante. Se o alvo for uma criatura Grande ou menor, ele fica com a condição Caído ( Prone ) ."
  },
  {
    "name": "Tigre-Dentes-de-Sabre",
    "source": "MM 2024",
    "cr": "2",
    "ac": 13,
    "hp": 52,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O tigre realiza dois ataques de Dilaceração. Dilacerar . Ataque Corpo a Corpo: +6 , alcance 1,5 m (5 ft). 11 (2d6 + 4) de dano cortante."
  },
  {
    "name": "Tigre-Licantropo",
    "source": "MM 2024",
    "cr": "4",
    "ac": 12,
    "hp": 120,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O tigre-licantropo faz dois ataques, usando Arranhão ou Arco Longo em qualquer combinação. Ele pode substituir um ataque por um ataque de Mordida. Mordida (Só na Forma de Tigre ou Híbrida) . Ataque Corpo a Corpo: +5 , alcance 1,5 m (5 ft). 12 (2d8 + 3) de dano perfurante. Se o alvo for um Humanoide, ele é submetido ao efeito a seguir. Salvaguarda de Constituição: CD 13. Falha:..."
  },
  {
    "name": "Tiranossauro Rex",
    "source": "MM 2024",
    "cr": "8",
    "ac": 13,
    "hp": 136,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O tiranossauro faz dois ataques: um com sua mordida e um com sua cauda. Ele não pode fazer ambos os ataques contra o mesmo alvo. Mordida . Ataque Corpo a Corpo com Arma: +10 para acertar , alcance 3 m (10 ft), um alvo. Acerto: 33 (4d12 + 7) de dano perfurante. Se o alvo for uma criatura Média ou menor, ele fica imobilizado (CD 17 para escapar). Até esse agarrão terminar, o alv..."
  },
  {
    "name": "Titã Tumular",
    "source": "MM",
    "cr": "10",
    "ac": 14,
    "hp": 200,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O titã faz dois ataques de montante. Espada Grande . Ataque Corpo a Corpo com Arma: +12 para acertar , alcance 3 m (10 ft), um alvo. Acerto: 29 (6d6 + 8) de dano cortante. Hurl Zombies . Ataque à Distância com Arma: +12 para acertar , alcance 18/72 m (60/240 ft), um alvo. Acerto: 30 (4d10 + 8) de dano de concussão. Após o ataque acertar ou errar, 1d4 + 1 zumbis surgem adjacent..."
  },
  {
    "name": "Torta de Lama",
    "source": "MM 2024",
    "cr": "2",
    "ac": 8,
    "hp": 39,
    "speed": "9m",
    "attack": "Pseudópode . Ataque Corpo a Corpo com Arma: +4 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 9 (2d6 + 2) de dano de concussão mais 3 (1d6) de dano ácido. Expel Gunk (1/Day) . A torta faz um ataque de arremesso de lodo contra todas as criaturas em um raio de 9 m (30 ft)."
  },
  {
    "name": "Triceratops",
    "source": "MM 2024",
    "cr": "5",
    "ac": 14,
    "hp": 114,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O triceratops realiza dois ataques de Chifrada. Chifrada . Ataque Corpo a Corpo: +9 , alcance 1,5 m (5 ft). 19 (2d12 + 6) de dano perfurante. Se o alvo for Enorme ou menor e o tricerátops tiver se movido 6 m (20 ft) ou mais em linha reta na direção dele imediatamente antes do acerto, o alvo sofre 9 (2d8) de dano perfurante extra e fica com a condição Caído ( Prone ) ."
  },
  {
    "name": "Troll",
    "source": "MM 2024",
    "cr": "5",
    "ac": 15,
    "hp": 94,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O troll faz três ataques de Dilacerar. Dilacerar . Ataque Corpo a Corpo: +7 , alcance 3 m (10 ft). 11 (2d6 + 4) de dano cortante."
  },
  {
    "name": "Troll Amaldiçoado",
    "source": "MM 2024",
    "cr": "9",
    "ac": 15,
    "hp": 189,
    "speed": "9m",
    "attack": "Ficha de Troll Amaldiçoado (regras 2014): Grande gigante, CA 15, PV 189, CR 9. Role direto na mesa com o rolador de dados grátis. Bestiário D&D 5e."
  },
  {
    "name": "Troll Boca-Grande",
    "source": "MM 2024",
    "cr": "10",
    "ac": 16,
    "hp": 243,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O troll faz quatro ataques: dois com sua mordida e dois com suas garras. Mordida . Ataque Corpo a Corpo com Arma: +9 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 24 (3d12 + 5) de dano perfurante, e se for uma criatura Grande ou menor, ela fica imobilizada (CD de escape 17). Até que esse agarrão termine, o alvo fica contido , e o troll não pode usar seu ataque de mordi..."
  },
  {
    "name": "Troll da Iniciativa",
    "source": "MM 2024",
    "cr": "5",
    "ac": 15,
    "hp": 84,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O troll faz três ataques: um com sua mordida e dois com suas garras. Mordida . Ataque Corpo a Corpo com Arma: +7 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 7 (1d6 + 4) de dano perfurante. Garra . Ataque Corpo a Corpo com Arma: +7 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 11 (2d6 + 4) de dano cortante."
  },
  {
    "name": "Troll Punho de Osso",
    "source": "MM 2024",
    "cr": "9",
    "ac": 15,
    "hp": 175,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O troll faz três ataques de pancada. Golpe . Ataque Corpo a Corpo com Arma: +9 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 14 (2d8 + 5) de dano de concussão. Trollfall . O troll pode abrir mão de sua própria segurança ao usar Salto de Impulso e se transformar em um projétil. O troll usa Salto de Impulso para saltar até um espaço a até 18 m (60 ft) dele, e cada criatu..."
  },
  {
    "name": "Tubarão Caçador",
    "source": "MM 2024",
    "cr": "2",
    "ac": 12,
    "hp": 45,
    "speed": "9m",
    "attack": "Mordida . Ataque Corpo a Corpo: +6 (com Vantagem se o alvo não estiver com todos os seus Pontos de Vida), alcance 1,5 m (5 ft). 14 (3d6 + 4) de dano perfurante."
  },
  {
    "name": "Tubarão do Recife",
    "source": "MM 2024",
    "cr": "1/2",
    "ac": 12,
    "hp": 22,
    "speed": "9m",
    "attack": "Mordida . Ataque Corpo a Corpo: +4 , alcance 1,5 m (5 ft). 7 (2d4 + 2) de dano perfurante."
  },
  {
    "name": "Tubarão Fantasma",
    "source": "MM 2024",
    "cr": "6",
    "ac": 12,
    "hp": 102,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O tubarão faz dois ataques de mordida. Mordida . Ataque Corpo a Corpo com Arma: +5 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 20 (4d8 + 2) de dano necrótico. Etereidade . O tubarão entra no Plano Etéreo a partir do Plano Material, ou vice-versa. Ele é visível no Plano Material enquanto está na Fronteira Etérea, e vice-versa, mas não pode afetar nem ser afetado por n..."
  },
  {
    "name": "Tubarão Gigante",
    "source": "MM 2024",
    "cr": "5",
    "ac": 13,
    "hp": 92,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O tubarão realiza dois ataques de Mordida. Mordida . Ataque Corpo a Corpo com Arma: +9 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 22 (3d10 + 6) de dano perfurante."
  },
  {
    "name": "Tubarão-Licantropo",
    "source": "MM",
    "cr": "7",
    "ac": 12,
    "hp": 170,
    "speed": "9m",
    "attack": "Ataque Múltiplo (Só na Forma Humanoide ou Híbrida) . O tubarão-licantropo faz três ataques, dos quais apenas um pode ser uma mordida. Mordida (Só na Forma Shark ou Híbrida) . Ataque Corpo a Corpo com Arma: +7 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 15 (2d10 + 4) de dano perfurante. Se o alvo for um humanoide, ele deve ser bem-sucedido em uma salvaguarda de Constituição CD 15 ou se..."
  },
  {
    "name": "Tubarão-Preguiça",
    "source": "MM 2024",
    "cr": "2",
    "ac": 13,
    "hp": 65,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O tubarão-preguiça faz dois ataques de garra. Garra . Ataque Corpo a Corpo com Arma: +5 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 6 (1d6 + 3) de dano cortante."
  },
  {
    "name": "Tuskaloth",
    "source": "MM 2024",
    "cr": "10",
    "ac": 14,
    "hp": 198,
    "speed": "9m",
    "attack": "Chifrada . Ataque Corpo a Corpo com Arma: +13 para acertar , alcance 3 m (10 ft), um alvo. Acerto: 22 (3d8 + 9) de dano perfurante. Pisotear . Ataque Corpo a Corpo com Arma: +13 para acertar , alcance 3 m (10 ft), um alvo. Acerto: 31 (4d10 + 9) de dano perfurante. Earthshake ( Recharge 5-6 ) . O tuskaloth golpeia o chão com força incrível, causando um tremor. Cada criatura no chão a até 9 m (30..."
  },
  {
    "name": "Tyrannohamsterus Rex",
    "source": "MM 2024",
    "cr": "1/2",
    "ac": 14,
    "hp": 22,
    "speed": "9m",
    "attack": "Headbutt . Ataque Corpo a Corpo com Arma: +4 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 6 (1d8 + 2) de dano de concussão. Arco Curto . Ataque à Distância com Arma: +4 para acertar , alcance 24/96 m (80/320 ft), um alvo. Acerto: 5 (1d6 + 2) de dano perfurante."
  },
  {
    "name": "Unicórnio",
    "source": "MM 2024",
    "cr": "5",
    "ac": 12,
    "hp": 97,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O unicórnio faz dois ataques: um com seus cascos e um com seu chifre. Cascos . Ataque Corpo a Corpo com Arma: +7 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 11 (2d6 + 4) de dano de concussão. Chifre Radiante . Ataque Corpo a Corpo: +7 , alcance 1,5 m (5 ft). 9 (1d10 + 4) de dano radiante."
  },
  {
    "name": "Urso Coruja",
    "source": "MM 2024",
    "cr": "3",
    "ac": 13,
    "hp": 59,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O urso coruja faz dois ataques de Dilacerar. Dilacerar . Ataque Corpo a Corpo: +7 , alcance 1,5 m (5 ft). 14 (2d8 + 5) de dano cortante."
  },
  {
    "name": "Urso de Magma",
    "source": "MM 2024",
    "cr": "3",
    "ac": 13,
    "hp": 75,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O urso faz dois ataques: um com sua mordida e um com suas garras. Mordida . Ataque Corpo a Corpo com Arma: +7 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 9 (1d8 + 5) de dano perfurante mais 3 (1d6) de dano de fogo. Garras . Ataque Corpo a Corpo com Arma: +7 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 12 (2d6 + 5) de dano cortante. Sopro Ígneo ( Recarga 5-6 ..."
  },
  {
    "name": "Urso Negro",
    "source": "MM 2024",
    "cr": "1/2",
    "ac": 11,
    "hp": 19,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O urso faz dois ataques de Dilacerar. Dilacerar . Ataque Corpo a Corpo: +4 , alcance 1,5 m (5 ft). 5 (1d6 + 2) de dano cortante."
  },
  {
    "name": "Urso Pardo",
    "source": "MM 2024",
    "cr": "1",
    "ac": 11,
    "hp": 22,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O urso realiza dois ataques: um com sua mordida e um com suas garras. Mordida . Ataque Corpo a Corpo: +5 , alcance 1,5 m (5 ft). 7 (1d8 + 3) de dano perfurante. Garra . Ataque Corpo a Corpo: +5 , alcance 1,5 m (5 ft). 5 (1d4 + 3) de dano cortante. Se o alvo for uma criatura Grande ou menor, ele fica com a condição Caído ( Prone ) ."
  },
  {
    "name": "Urso Polar",
    "source": "MM 2024",
    "cr": "2",
    "ac": 12,
    "hp": 42,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O urso faz dois ataques de Dilacerar. Dilacerar . Ataque Corpo a Corpo: +7 , alcance 1,5 m (5 ft). 9 (1d8 + 5) de dano cortante."
  },
  {
    "name": "Urso-das-Alturas",
    "source": "MM 2024",
    "cr": "1/2",
    "ac": 13,
    "hp": 55,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O urso-das-alturas faz dois ataques: um ataque com sua queda e um com sua mordida. Drop . Ataque Corpo a Corpo com Arma: +3 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 4 (1d6 + 1) de dano de concussão. O urso-das-alturas deve cair pelo menos 4,5 m (15 ft) antes do ataque. Se o alvo é Médio ou menor e o urso-das-alturas tem vantagem na jogada de ataque, a criatura alv..."
  },
  {
    "name": "Urso-Tubarão",
    "source": "MM 2024",
    "cr": "5",
    "ac": 14,
    "hp": 136,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O urso-tubarão faz três ataques: um com sua mordida e dois com suas garras. Mordida . Ataque Corpo a Corpo com Arma: +7 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 13 (2d8 + 4) de dano perfurante. Garra . Ataque Corpo a Corpo com Arma: +7 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 11 (2d6 + 4) de dano cortante."
  },
  {
    "name": "Valquíria",
    "source": "MM 2024",
    "cr": "6",
    "ac": 16,
    "hp": 142,
    "speed": "9m",
    "attack": "Ataque Múltiplo . A valquíria faz dois ataques corpo a corpo. Espada Grande . Ataque Corpo a Corpo com Arma: +6 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 10 (2d6 + 3) de dano cortante mais 9 (2d8) de dano radiante. Toque Curativo (2/Dia) . A valquíria toca outra criatura. O alvo recupera magicamente 13 (2d8 + 4) pontos de vida e é libertado de qualquer maldição, doença, veneno, cegu..."
  },
  {
    "name": "Valravn",
    "source": "MM 2024",
    "cr": "12",
    "ac": 19,
    "hp": 162,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O valravn faz quatro ataques de lâmina sombria. Mordida . Ataque Corpo a Corpo com Arma: +7 para acertar , alcance 1,5 m (5 ft), uma criatura que esteja imobilizada pelo valravn, incapacitada ou contida . Acerto: 12 (2d8 + 3) de dano perfurante mais 22 (5d8) de dano necrótico. O máximo de pontos de vida do alvo é reduzido em um valor igual ao dano necrótico recebido, e o valra..."
  },
  {
    "name": "Vampiro",
    "source": "MM 2024",
    "cr": "13",
    "ac": 16,
    "hp": 195,
    "speed": "9m",
    "attack": "Ataque Múltiplo (Só na Forma de Vampiro) . O vampiro realiza dois ataques, sendo que apenas um deles pode ser um ataque de mordida. Golpe Sepulcral (Só na Forma de Vampiro) . Ataque Corpo a Corpo: +9 , alcance 1,5 m (5 ft). 8 (1d8 + 4) de dano de concussão mais 7 (2d6) de dano necrótico. Se o alvo for uma criatura Grande ou menor, ele fica com a condição Imobilizado ( Grappled ) (CD de fuga 14)..."
  },
  {
    "name": "Ventrúnculo",
    "source": "MM",
    "cr": "3",
    "ac": 13,
    "hp": 97,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O ventrúnculo faz dois ataques de mordida. Mordida . Ataque Corpo a Corpo com Arma: +5 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 10 (2d6 + 3) de dano perfurante, e o alvo fica imobilizado (CD de escape 13) se for uma criatura Enorme ou menor. Engolir . O ventrúnculo faz um ataque de mordida contra uma criatura que esteja agarrando. Se o ataque acertar, o alvo é eng..."
  },
  {
    "name": "Verdalin",
    "source": "MM 2024",
    "cr": "1/2",
    "ac": 13,
    "hp": 18,
    "speed": "9m",
    "attack": "Mordida . Ataque Corpo a Corpo com Arma: +5 para acertar , alcance 1,5 m (5 ft), uma criatura. Acerto: 5 (1d4 + 3) de dano perfurante."
  },
  {
    "name": "Verme Púrpura",
    "source": "MM 2024",
    "cr": "15",
    "ac": 18,
    "hp": 247,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O verme faz dois ataques: um com sua mordida e um com seu ferrão. Mordida . Ataque Corpo a Corpo: +14 , alcance 3 m (10 ft). 22 (3d8 + 9) de dano perfurante. Se o alvo for uma criatura Grande ou menor, ele fica com a condição Imobilizado ( Grappled ) (CD 19 para escapar) e com a condição Contido ( Restrained ) até a imobilização terminar. Ferrão de Cauda . Ataque Corpo a Corpo..."
  },
  {
    "name": "Vespa Gigante",
    "source": "MM 2024",
    "cr": "1/2",
    "ac": 13,
    "hp": 22,
    "speed": "9m",
    "attack": "Ferrão . Ataque Corpo a Corpo: +4 , alcance 1,5 m (5 ft). 5 (1d6 + 2) de dano perfurante mais 5 (2d4) de dano de veneno."
  },
  {
    "name": "Veterano",
    "source": "MM 2024",
    "cr": "3",
    "ac": 17,
    "hp": 58,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O veterano faz dois ataques com espada longa. Se ele tiver uma espada curta em mãos, também pode fazer um ataque com espada curta. Espada Longa . Ataque com Arma Corpo a Corpo: +5 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 7 (1d8 + 3) de dano cortante, ou 8 (1d10 + 3) de dano cortante se usado com duas mãos. Espada Curta . Ataque com Arma Corpo a Corpo: +5 para acer..."
  },
  {
    "name": "Veterano Meio-Dragão Vermelho",
    "source": "MM 2024",
    "cr": "5",
    "ac": 18,
    "hp": 65,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O veterano faz dois ataques de espada longa. Se ele tiver uma espada curta desembainhada, ele também pode fazer um ataque de espada curta. Espada Longa . Ataque Corpo a Corpo com Arma: +5 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 7 (1d8 + 3) de dano cortante, ou 8 (1d10 + 3) de dano cortante se usado com duas mãos. Espada Curta . Ataque Corpo a Corpo com Arma: +5 p..."
  },
  {
    "name": "Viúva da Morte",
    "source": "MM 2024",
    "cr": "3",
    "ac": 14,
    "hp": 60,
    "speed": "9m",
    "attack": "Mordida . Melee Weapon Attack: +5 to hit , reach 1,5 m (5 ft), one target. Hit 8 (1d10 + 3) piercing damage, and the target must succeed on a DC 13 Constitution saving throw or become poisoned. While poisoned in this way, the target is incapacitated and takes 13 (3d8) poison damage at the start of each of its turns. The target can repeat the saving throw at the end of each of its turns, ending ..."
  },
  {
    "name": "Vodyanoy",
    "source": "MM 2024",
    "cr": "5",
    "ac": 16,
    "hp": 119,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O vodyanoy faz dois ataques de pancada. Se ambos os ataques acertarem um alvo Médio ou menor, o alvo fica imobilizado (CD de escape 15). Até o agarrão terminar, o alvo está contido e tem desvantagem em testes de Força e salvaguardas de Força, o vodyanoy tenta afogá-lo, e o vodyanoy não pode usar pancada em outro alvo. Golpe . Ataque Corpo a Corpo com Arma: +7 para acertar , al..."
  },
  {
    "name": "Vrock",
    "source": "MM 2024",
    "cr": "6",
    "ac": 15,
    "hp": 152,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O vrock faz dois ataques de Estraçalhar. Estraçalhar . Ataque Corpo a Corpo: +6 , alcance 1,5 m (5 ft). 10 (2d6 + 3) de dano perfurante mais 10 (3d6) de dano de veneno. Esporos ( Recarga 6 ) . Salvaguarda de Constituição: CD 15, cada criatura em uma Emanação de 6 m (20 ft) originada do vrock. Falha: O alvo fica com a condição Envenenado ( Poisoned ) e repete a salvaguarda no f..."
  },
  {
    "name": "Wendigo",
    "source": "MM 2024",
    "cr": "6",
    "ac": 15,
    "hp": 114,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O wendigo faz dois ataques de garra. Se ambos os ataques acertarem um único alvo, o wendigo pode fazer um ataque de mordida contra o mesmo alvo como uma ação bônus. Garra . Ataque Corpo a Corpo com Arma: +6 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 12 (2d8 + 3) de dano cortante. Mordida . Ataque Corpo a Corpo com Arma: +6 para acertar , alcance 1,5 m (5 ft), um alv..."
  },
  {
    "name": "Wight",
    "source": "MM 2024",
    "cr": "3",
    "ac": 14,
    "hp": 82,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O wight faz dois ataques com espada longa ou dois ataques com arco longo. Ele pode usar seu Drenar Vida no lugar de um ataque com espada longa. Espada Necrótica . Ataque Corpo a Corpo: +4 , alcance 1,5 m (5 ft). 6 (1d8 + 2) de dano cortante mais 4 (1d8) de dano necrótico. Arco Necrótico . Ataque à Distância: +4 , alcance 45/180 m (150/600 ft). 6 (1d8 + 2) de dano perfurante ma..."
  },
  {
    "name": "Worg",
    "source": "MM 2024",
    "cr": "1/2",
    "ac": 13,
    "hp": 26,
    "speed": "9m",
    "attack": "Mordida . Ataque Corpo a Corpo: +5 , alcance 1,5 m (5 ft). 7 (1d8 + 3) de dano perfurante, e a próxima jogada de ataque feita contra o alvo antes do início do próximo turno do worg tem Vantagem."
  },
  {
    "name": "Wyvern",
    "source": "MM 2024",
    "cr": "6",
    "ac": 14,
    "hp": 127,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O wyvern faz um ataque de Mordida e um ataque de Ferrão. Mordida . Ataque Corpo a Corpo: +7 , alcance 1,5 m (5 ft). 13 (2d8 + 4) de dano perfurante. Ferrão . Ataque Corpo a Corpo: +7 , alcance 3 m (10 ft). 11 (2d6 + 4) de dano perfurante mais 24 (7d6) de dano de veneno, e o alvo fica com a condição Envenenado ( Poisoned ) até o início do próximo turno do wyvern."
  },
  {
    "name": "Wyvern Pestilento",
    "source": "MM 2024",
    "cr": "7",
    "ac": 14,
    "hp": 133,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O wyvern faz dois ataques de mordida. Em seguida, usa Vômito Tóxico se estiver disponível. Enquanto estiver voando, pode usar suas garras no lugar de uma mordida. Mordida . Ataque Corpo a Corpo com Arma: +9 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 12 (2d6 + 5) de dano perfurante mais 2 (1d4) de dano de veneno. Garras . Ataque Corpo a Corpo com Arma: +9 para acerta..."
  },
  {
    "name": "Xanmu",
    "source": "MM 2024",
    "cr": "7",
    "ac": 16,
    "hp": 153,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O xanmu faz dois ataques de Aperto Cobiçoso. Ele pode usar Descartar no lugar de um ataque. Covetous Grasp . Ataque com Arma Corpo a Corpo: +7 para acertar , alcance 3 m (10 ft), uma criatura. Acerto: 14 (3d6 + 4) de dano de concussão e o alvo deve fazer uma salvaguarda de Força CD 15. Em uma falha, o alvo é desarmado de sua arma ou escudo, e o xanmu passa a segurar o item. &n..."
  },
  {
    "name": "Xorn",
    "source": "MM 2024",
    "cr": "5",
    "ac": 19,
    "hp": 84,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O xorn faz três ataques com garras e um ataque com mordida. Mordida . Ataque Corpo a Corpo: +6 , alcance 1,5 m (5 ft). 17 (4d6 + 3) de dano perfurante. Garra . Ataque Corpo a Corpo: +6 , alcance 1,5 m (5 ft). 8 (1d10 + 3) de dano cortante."
  },
  {
    "name": "Yuan-Ti Ignan",
    "source": "MM 2024",
    "cr": "8",
    "ac": 16,
    "hp": 133,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O yuan-ti faz dois ataques: um com sua chifrada e um com sua maça pesada. Ele pode usar sua cauda no lugar de um ataque corpo a corpo. Chifrada . Ataque com Arma Corpo a Corpo: +8 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 9 (1d8 + 5) de dano perfurante mais 3 (1d6) de dano de fogo. Heavy Mace . Ataque com Arma Corpo a Corpo: +8 para acertar , alcance 1,5 m (5 ft), ..."
  },
  {
    "name": "Zombesta Remendada",
    "source": "MM",
    "cr": "9",
    "ac": 16,
    "hp": 189,
    "speed": "9m",
    "attack": "Ataque Múltiplo . A zombesta faz quatro ataques: um com sua mordida, um com suas presas, um com suas garras e um com seu ferrão. Mordida . Ataque Corpo a Corpo com Arma: +9 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 12 (2d6 + 5) de dano perfurante. Presas . Ataque Corpo a Corpo com Arma: +9 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 12 (2d6 + 5) de dano perfurante. Garra ...."
  },
  {
    "name": "Zumbi",
    "source": "MM 2024",
    "cr": "1/4",
    "ac": 8,
    "hp": 15,
    "speed": "9m",
    "attack": "Golpe . Ataque Corpo a Corpo: +3 , alcance 1,5 m (5 ft). 5 (1d8 + 1) de dano de concussão."
  },
  {
    "name": "Zumbi Cabeça-de-Metal",
    "source": "MM 2024",
    "cr": "1/2",
    "ac": 8,
    "hp": 26,
    "speed": "9m",
    "attack": "Headbutt . Ataque Corpo a Corpo com Arma: +3 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 6 (1d8 + 2) de dano de concussão. Metal Claw . Ataque Corpo a Corpo com Arma: +3 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 5 (1d6 + 2) de dano de concussão. Se o alvo for Médio ou menor, ele fica imobilizado (CD de escape 12)."
  },
  {
    "name": "Zumbi Cuspidor de Ácido",
    "source": "MM 2024",
    "cr": "4",
    "ac": 12,
    "hp": 127,
    "speed": "9m",
    "attack": "Golpe . Ataque Corpo a Corpo com Arma: +5 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 5 (1d6 + 2) de dano de concussão. Projectile Vomit . Ataque à Distância com Arma: +5 para acertar , alcance 6/18 m (20/60 ft), um alvo. Acerto: 12 (3d6 + 2) de dano ácido. Acid Reflux ( Recharge 6 ) . O zumbi expele uma bolha de ácido que respinga em um ponto que ele possa ver a até 18 m (60 ft) dele..."
  },
  {
    "name": "Zumbi de Hera",
    "source": "MM 2024",
    "cr": "1/2",
    "ac": 11,
    "hp": 30,
    "speed": "9m",
    "attack": "Mordida . Ataque Corpo a Corpo com Arma: +2 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 7 (2d6) de dano perfurante. Ivylash . Ataque Corpo a Corpo com Arma: +3 para acertar , alcance 4,5 m (15 ft), um alvo. Acerto: 4 (1d4 + 2) de dano cortante mais 3 (1d6) de dano de veneno. Se o alvo for uma criatura, ele deve ser bem-sucedido em uma salvaguarda de Constituição CD 13 ou ficará envene..."
  },
  {
    "name": "Zumbi Ogro",
    "source": "MM 2024",
    "cr": "2",
    "ac": 8,
    "hp": 85,
    "speed": "9m",
    "attack": "Golpe . Ataque Corpo a Corpo: +6 , alcance 1,5 m (5 ft). 13 (2d8 + 4) de dano de concussão."
  },
  {
    "name": "Zumbinseto",
    "source": "MM 2024",
    "cr": "9",
    "ac": 16,
    "hp": 199,
    "speed": "9m",
    "attack": "Ataque Múltiplo . O zumbinseto faz três ataques de pancada. Golpe . Ataque Corpo a Corpo com Arma: +9 para acertar , alcance 1,5 m (5 ft), um alvo. Acerto: 16 (2d10 + 5) de dano de concussão mais 7 (2d6) de dano de trovão."
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { BESTIARY_DATA };
}
