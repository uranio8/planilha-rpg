const fs = require('fs');
const path = require('path');

// Update build_classes_dataset.js with full comprehensive feature sets for all 12 classes

const CLASSES_DATA = [
  {
    id: "barbaro",
    name: "Bárbaro",
    icon: "🪓",
    role: "Combatente Feroz / Linha de Frente",
    summary: "Combatentes brutais definidos por sua fúria primordial, resistência formidável e ataques devastadores em combate corpo a corpo.",
    hitDie: "d12 (1d12 ou 7 PV por nível)",
    primaryAbility: "Força",
    savingThrows: ["Força", "Constituição"],
    armorProficiencies: "Armaduras Leves, Armaduras Médias e Escudos",
    weaponProficiencies: "Armas Simples e Armas Marciais",
    skillProficiencies: "Escolha 2 entre: Adestrar Animais, Atletismo, Intimidação, Natureza, Percepção e Sobrevivência",
    weaponMastery: "2 armas à sua escolha (trocadas em descanso longo)",
    progression: [
      { level: 1, prof: "+2", features: "Fúria, Defesa sem Armadura, Maestria em Armas", rages: "2", rageDmg: "+2", mastery: "2" },
      { level: 2, prof: "+2", features: "Ataque Descuidado, Sentido de Perigo", rages: "2", rageDmg: "+2", mastery: "2" },
      { level: 3, prof: "+2", features: "Subclasse de Bárbaro, Conhecimento Primevo", rages: "3", rageDmg: "+2", mastery: "2" },
      { level: 4, prof: "+2", features: "Aumento no Valor de Atributo / Talento", rages: "3", rageDmg: "+2", mastery: "3" },
      { level: 5, prof: "+3", features: "Ataque Extra, Movimento Rápido (+3m)", rages: "3", rageDmg: "+2", mastery: "3" },
      { level: 6, prof: "+3", features: "Habilidade de Subclasse", rages: "4", rageDmg: "+2", mastery: "3" },
      { level: 7, prof: "+3", features: "Instinto Feral, Bote Instintivo", rages: "4", rageDmg: "+2", mastery: "3" },
      { level: 8, prof: "+3", features: "Aumento no Valor de Atributo / Talento", rages: "4", rageDmg: "+2", mastery: "3" },
      { level: 9, prof: "+4", features: "Golpe Brutal (1d10)", rages: "4", rageDmg: "+3", mastery: "3" },
      { level: 10, prof: "+4", features: "Habilidade de Subclasse", rages: "4", rageDmg: "+3", mastery: "4" },
      { level: 11, prof: "+4", features: "Fúria Implacável", rages: "4", rageDmg: "+3", mastery: "4" },
      { level: 12, prof: "+4", features: "Aumento no Valor de Atributo / Talento", rages: "5", rageDmg: "+3", mastery: "4" },
      { level: 13, prof: "+5", features: "Crítico Melhorado / Golpe Brutal Aprimorado", rages: "5", rageDmg: "+3", mastery: "4" },
      { level: 14, prof: "+5", features: "Habilidade de Subclasse", rages: "5", rageDmg: "+3", mastery: "4" },
      { level: 15, prof: "+5", features: "Fúria Persistente", rages: "5", rageDmg: "+3", mastery: "4" },
      { level: 16, prof: "+5", features: "Aumento no Valor de Atributo / Talento", rages: "5", rageDmg: "+4", mastery: "4" },
      { level: 17, prof: "+6", features: "Golpe Brutal Adicional (2d10)", rages: "6", rageDmg: "+4", mastery: "4" },
      { level: 18, prof: "+6", features: "Poder Indomável", rages: "6", rageDmg: "+4", mastery: "4" },
      { level: 19, prof: "+6", features: "Talento Épico", rages: "6", rageDmg: "+4", mastery: "4" },
      { level: 20, prof: "+6", features: "Campeão Primevo (+4 Força e +4 Constituição, máx 25)", rages: "Ilimitado", rageDmg: "+4", mastery: "4" }
    ],
    features: [
      {
        level: 1,
        name: "Fúria (Rage)",
        type: "Ação Bônus",
        desc: "Com uma Ação Bônus, você entra em fúria. Enquanto estiver em fúria e sem armadura pesada:\n• **Vantagem em Testes de Força e Salvaguardas de Força**.\n• **Bônus de Dano na Fúria**: Adiciona o bônus de dano de fúria (+2 a +4) em ataques corpo a corpo usando Força.\n• **Resistência a Danos**: Resistência a dano de concussão, cortante e perfurante.\n• **Duração**: Dura 10 minutos ou até ficar inconsciente. Pode ser mantida gastando uma ação bônus, atacando, forçando uma salvaguarda ou sofrendo dano.\n• Você recupera 1 uso de Fúria em Descanso Curto e todos em Descanso Longo."
      },
      {
        level: 1,
        name: "Defesa sem Armadura (Unarmored Defense)",
        type: "Passiva",
        desc: "Enquanto não estiver vestindo armadura, sua Classe de Armadura (CA) é igual a **10 + modificador de Destreza + modificador de Constituição**. Você ainda pode usar um escudo e manter este benefício."
      },
      {
        level: 1,
        name: "Maestria em Armas (Weapon Mastery)",
        type: "Passiva",
        desc: "Você aprende a utilizar as propriedades de maestria de 2 tipos de armas (como *Derrubar*, *Golpear*, *Empurrar*, *Rasgar*, etc.). Sempre que terminar um Descanso Longo, você pode trocar as armas escolhidas."
      },
      {
        level: 2,
        name: "Ataque Descuidado (Reckless Attack)",
        type: "Ação / Ataque",
        desc: "No seu primeiro ataque do turno, você pode atacar de forma descuidada. Você ganha **Vantagem em todas as jogadas de ataque com Força** até o início do seu próximo turno, mas as jogadas de ataque contra você também têm Vantagem até lá."
      },
      {
        level: 2,
        name: "Sentido de Perigo (Danger Sense)",
        type: "Passiva",
        desc: "Você tem **Vantagem em salvaguardas de Destreza** contra efeitos que possa ver, como armadilhas e magias, desde que não esteja incapacitado."
      },
      {
        level: 3,
        name: "Conhecimento Primevo (Primal Knowledge)",
        type: "Perícia / Fúria",
        desc: "Você ganha proficiência em outra perícia da lista do bárbaro. Além disso, enquanto sua Fúria estiver ativa, você pode realizar testes de Acrobacia, Furtividade, Intimidação, Percepção e Sobrevivência usando seu modificador de **Força** no lugar do atributo padrão."
      },
      {
        level: 5,
        name: "Ataque Extra (Extra Attack)",
        type: "Ação de Ataque",
        desc: "Você pode atacar **duas vezes**, em vez de uma, sempre que realizar a ação de Ataque no seu turno."
      },
      {
        level: 5,
        name: "Movimento Rápido (Fast Movement)",
        type: "Passiva",
        desc: "Seu deslocamento aumenta em **+3 metros (+10 ft)** enquanto você não estiver vestindo armadura pesada."
      },
      {
        level: 7,
        name: "Instinto Feral (Feral Instinct) & Bote Instintivo",
        type: "Iniciativa / Reação",
        desc: "Seus instintos são tão aguçados que você tem **Vantagem em jogadas de Iniciativa**. Além disso, ao entrar em Fúria com uma Ação Bônus, você pode se mover até metade do seu deslocamento imediatamente como parte da mesma ação bônus."
      },
      {
        level: 9,
        name: "Golpe Brutal (Brutal Strike)",
        type: "Modificador de Ataque",
        desc: "Ao usar Ataque Descuidado, você pode abrir mão da Vantagem no ataque para desferir um Golpe Brutal. Se o ataque acertar, o alvo sofre **+1d10 de dano extra** e você pode aplicar um efeito especial: *Quebrar Força* (desvantagem na próxima salvaguarda e -1,5m de deslocamento) ou *Arremesso Cambaleante* (empurra o alvo 4,5m sem teste)."
      },
      {
        level: 11,
        name: "Fúria Implacável (Relentless Rage)",
        type: "Sobrevivência / Reação",
        desc: "Se você cair a 0 pontos de vida enquanto estiver em Fúria e não morrer imediatamente, você pode fazer uma salvaguarda de Constituição CD 10. Se passar, você cai para um número de PV igual a **2x o seu nível de bárbaro**. A cada uso subsequente antes de um descanso curto/longo, a CD aumenta em +5."
      },
      {
        level: 15,
        name: "Fúria Persistente (Persistent Rage)",
        type: "Passiva",
        desc: "Sua Fúria dura os 10 minutos completos sem a necessidade de gastar ações bônus ou atacar para mantê-la. Além disso, uma vez por descanso longo, ao rolar Iniciativa sem nenhum uso de Fúria restante, você recupera 1 uso imediatamente."
      },
      {
        level: 18,
        name: "Poder Indomável (Indomitable Might)",
        type: "Passiva",
        desc: "Se o total de um teste de Força ou salvaguarda de Força for menor do que o seu valor de Força, você pode usar o seu **valor de atributo Força** no lugar do resultado do dado."
      },
      {
        level: 20,
        name: "Campeão Primevo (Primal Champion)",
        type: "Ápice Épico",
        desc: "Você incorpora o poder da natureza selvagem. Seus valores de **Força e Constituição aumentam em +4**, e o seu valor máximo para esses atributos passa a ser **25**."
      }
    ],
    subclasses: [
      {
        name: "Caminho do Furioso (Berserker)",
        icon: "🩸",
        desc: "Bárbaros que canalizam sua ira em um frenesi sangrento incontrolável, desferindo golpes devastadores adicionais.",
        features: [
          { level: 3, name: "Frenesi (Frenzy)", desc: "Ao usar Ataque Descuidado durante a Fúria, você pode causar dano extra igual a 1d6 por nível de fúria no primeiro alvo acertado no turno." },
          { level: 6, name: "Fúria Insensível (Mindless Rage)", desc: "Enquanto estiver em Fúria, você se torna imune às condições Enfeitiçado e Amedrontado. Se entrar em fúria enquanto estiver sob tais efeitos, eles são suspensos." },
          { level: 10, name: "Retaliação (Retaliation)", desc: "Quando sofrer dano de uma criatura a até 1,5m de você, você pode usar sua Reação para desferir um ataque corpo a corpo com arma contra ela." },
          { level: 14, name: "Presença Intimidadora (Intimidating Presence)", desc: "Como ação bônus, você ruge aterrorizando criaturas a até 9 metros. Alvos que falharem em salvaguarda de Sabedoria ficam Amedrontados por 1 minuto." }
        ]
      },
      {
        name: "Coração Selvagem (Wild Heart)",
        icon: "🐻",
        desc: "Sintonizados com espíritos animais como o Urso, a Águia e o Lobo, recebendo atributos xamânicos e totêmicos.",
        features: [
          { level: 3, name: "Fúria Animal (Rage of the Wilds)", desc: "Escolha um aspecto animal ao entrar em fúria:\n• **Urso**: Resistência a todos os tipos de dano (exceto psíquico).\n• **Águia**: Disparada e Desengajar como Ação Bônus e desvantagem em ataques de oportunidade contra você.\n• **Lobo**: Seus aliados têm Vantagem em ataques contra inimigos adjacentes a você." },
          { level: 6, name: "Aspecto da Fera (Aspect of the Wilds)", desc: "Ganha bônus utilitários como visão no escuro ampliada, capacidade de carga dobrada ou natação e escalada com deslocamento integral." },
          { level: 10, name: "Comunhão com a Natureza (Nature Speaker)", desc: "Você pode conjurar as magias *Falar com Animais* e *Sentido Bestial* como rituais." },
          { level: 14, name: "Sintonia Totêmica Suprema", desc: "Seus aspectos animais evoluem: o Urso força inimigos a te atacarem, a Águia ganha voo durante a fúria e o Lobo derruba oponentes no chão." }
        ]
      },
      {
        name: "Árvore do Mundo (World Tree)",
        icon: "🌲",
        desc: "Conectados a Yggdrasil, a grande árvore cósmica, canalizando raízes astrais para teleportar e conceder pontos de vida temporários a aliados.",
        features: [
          { level: 3, name: "Vitalidade da Árvore", desc: "Ao entrar em Fúria e no início de cada um de seus turnos, você ou um aliado visível a até 9 metros ganha PV Temporários iguais ao seu bônus de proficiência + modificador de Constituição." },
          { level: 6, name: "Galhos da Árvore do Mundo", desc: "Com uma reação quando um inimigo iniciar o turno a até 9 metros, você manifesta vinhas espectrais que o puxam para perto de você e reduzem seu deslocamento a 0." },
          { level: 10, name: "Bater de Raízes", desc: "Ao usar Golpe Brutal, você pode atingir todos os inimigos ao redor do alvo com galhos pesados que causam dano de força." },
          { level: 14, name: "Caminho pelas Raízes (Travel Along the Tree)", desc: "Você pode se teleportar junto com aliados através dos galhos dimensionais de Yggdrasil até 18 metros como ação bônus." }
        ]
      },
      {
        name: "Guerreiro Zelote (Zealot)",
        icon: "⚡",
        desc: "Guerreiros sagrados inflamados pela fúria de uma divindade, infundindo seus golpes com luz radiante ou poder necrótico.",
        features: [
          { level: 3, name: "Fúria Divina (Divine Fury)", desc: "O primeiro alvo que você acertar com uma arma no seu turno durante a Fúria sofre 1d6 + metade do seu nível de bárbaro de dano Radiante ou Necrótico." },
          { level: 6, name: "Fã do Fanático (Fanatical Focus)", desc: "Se falhar em uma salvaguarda durante a Fúria, você pode rolar o dado novamente uma vez por uso de fúria." },
          { level: 10, name: "Presença Zelosa (Zealous Presence)", desc: "Como ação bônus, você solta um grito sagrado concedendo Vantagem em jogadas de ataque e salvaguardas para até 10 aliados a até 18 metros." },
          { level: 14, name: "Fúria Além da Morte (Rage Beyond Death)", desc: "Estar com 0 pontos de vida não te deixa inconsciente enquanto estiver em Fúria. Você só morre por falhas de salvaguarda se a Fúria acabar antes de você recuperar PV." }
        ]
      }
    ]
  },
  {
    id: "guerreiro",
    name: "Guerreiro",
    icon: "🛡️",
    role: "Mestre das Armas e Estrategista Marcial",
    summary: "Especialistas incomparáveis em todas as disciplinas de combate, táticas de guerra, manobras e maestria com qualquer armamento.",
    hitDie: "d10 (1d10 ou 6 PV por nível)",
    primaryAbility: "Força ou Destreza",
    savingThrows: ["Força", "Constituição"],
    armorProficiencies: "Todas as armaduras (Leves, Médias, Pesadas) e Escudos",
    weaponProficiencies: "Armas Simples e Armas Marciais",
    skillProficiencies: "Escolha 2 entre: Acrobacia, Adestrar Animais, Atletismo, História, Intuição, Intimidação, Percepção e Sobrevivência",
    weaponMastery: "3 armas à sua escolha no Nv 1 (aumenta para 4 no Nv 4, 5 no Nv 10 e 6 no Nv 16)",
    progression: [
      { level: 1, prof: "+2", features: "Estilo de Luta, Retomar o Fôlego (Second Wind), Maestria em Armas (3)", mastery: "3" },
      { level: 2, prof: "+2", features: "Surto de Ação (Action Surge), Mente Tática", mastery: "3" },
      { level: 3, prof: "+2", features: "Subclasse de Guerreiro", mastery: "3" },
      { level: 4, prof: "+2", features: "Aumento no Valor de Atributo / Talento", mastery: "4" },
      { level: 5, prof: "+3", features: "Ataque Extra (2 ataques), Mudança Tática", mastery: "4" },
      { level: 6, prof: "+3", features: "Aumento no Valor de Atributo / Talento", mastery: "4" },
      { level: 7, prof: "+3", features: "Habilidade de Subclasse", mastery: "4" },
      { level: 8, prof: "+3", features: "Aumento no Valor de Atributo / Talento", mastery: "4" },
      { level: 9, prof: "+4", features: "Indomável (1 uso), Maestria Tática", mastery: "4" },
      { level: 10, prof: "+4", features: "Habilidade de Subclasse", mastery: "5" },
      { level: 11, prof: "+4", features: "Ataque Extra (3 ataques)", mastery: "5" },
      { level: 12, prof: "+4", features: "Aumento no Valor de Atributo / Talento", mastery: "5" },
      { level: 13, prof: "+5", features: "Indomável (2 usos), Especialista em Maestria", mastery: "5" },
      { level: 14, prof: "+5", features: "Aumento no Valor de Atributo / Talento", mastery: "5" },
      { level: 15, prof: "+5", features: "Habilidade de Subclasse", mastery: "5" },
      { level: 16, prof: "+5", features: "Aumento no Valor de Atributo / Talento", mastery: "6" },
      { level: 17, prof: "+6", features: "Surto de Ação (2 usos), Indomável (3 usos)", mastery: "6" },
      { level: 18, prof: "+6", features: "Habilidade de Subclasse", mastery: "6" },
      { level: 19, prof: "+6", features: "Talento Épico", mastery: "6" },
      { level: 20, prof: "+6", features: "Ataque Extra (4 ataques)", mastery: "6" }
    ],
    features: [
      {
        level: 1,
        name: "Estilo de Luta (Fighting Style)",
        type: "Passiva",
        desc: "Você adota uma especialidade marcial como talento: *Arquearia* (+2 ataque à distância), *Defesa* (+1 CA com armadura), *Duelo* (+2 dano com 1 arma), *Grandes Armas* (rola novamente 1 e 2 no dano), *Proteção* (desvantagem em ataques contra aliados adjacentes) ou *Armas Duplas*."
      },
      {
        level: 1,
        name: "Retomar o Fôlego (Second Wind)",
        type: "Ação Bônus",
        desc: "Você possui uma reserva de vigor limitada. Com uma Ação Bônus, você recupera pontos de vida iguais a **1d10 + seu nível de guerreiro**. Você possui 2 usos no nível 1 (aumentando para 4 no nível 10) e recupera 1 uso em Descanso Curto e todos em Descanso Longo."
      },
      {
        level: 1,
        name: "Maestria em Armas (Weapon Mastery)",
        type: "Passiva",
        desc: "Você domina propriedades táticas avançadas de 3 armas no nível 1 (podendo trocar a cada descanso longo). Permite derrubar inimigos (*Topple*), empurrar (*Push*), causar dano de raspão em erro (*Graze*), ou ter vantagem após acerto (*Vex*)."
      },
      {
        level: 2,
        name: "Surto de Ação (Action Surge)",
        type: "Recurso Especial",
        desc: "Você pode ultrapassar seus limites normais por um instante. No seu turno, você pode realizar **uma Ação adicional** além da sua ação padrão e possível ação bônus. Recupera em Descanso Curto ou Longo (ganha 2º uso no Nível 17)."
      },
      {
        level: 2,
        name: "Mente Tática (Tactical Mind)",
        type: "Perícia / Retomar o Fôlego",
        desc: "Ao falhar em um teste de perícia, você pode gastar 1 uso de *Retomar o Fôlego* para adicionar **+1d10** ao resultado. Se o teste ainda assim falhar, o uso do Retomar o Fôlego **não é gasto**!"
      },
      {
        level: 5,
        name: "Ataque Extra (Extra Attack)",
        type: "Ação de Ataque",
        desc: "Você pode atacar **duas vezes** na ação de Ataque. No Nível 11 aumenta para **3 ataques**, e no Nível 20 você atinge o ápice lendário atacando **4 vezes** por turno!"
      },
      {
        level: 5,
        name: "Mudança Tática (Tactical Shift)",
        type: "Movimento / Ação Bônus",
        desc: "Sempre que usar Retomar o Fôlego, você pode se mover até metade do seu deslocamento imediatamente sem provocar ataques de oportunidade."
      },
      {
        level: 9,
        name: "Indomável (Indomitable)",
        type: "Salvaguarda",
        desc: "Se falhar em uma salvaguarda, você pode rolar o teste novamente com um **bônus igual ao seu nível de guerreiro**, garantindo uma chance altíssima de sucesso. Você ganha usos adicionais nos níveis 13 e 17."
      }
    ],
    subclasses: [
      {
        name: "Campeão (Champion)",
        icon: "🏆",
        desc: "O epítome da perfeição física e do combate direto, focado em acertos críticos devastadores e atletismo heroico.",
        features: [
          { level: 3, name: "Crítico Aprimorado (Improved Critical)", desc: "Seus ataques com armas obtêm acerto crítico em rolagens de 19 ou 20 no d20." },
          { level: 3, name: "Atleta Notável (Remarkable Athlete)", desc: "Você tem Vantagem em testes de Iniciativa e em testes de Atletismo. Além disso, ao conseguir um acerto crítico, você pode se mover metade do seu deslocamento sem ataques de oportunidade." },
          { level: 7, name: "Estilo de Luta Adicional", desc: "Você escolhe um segundo Estilo de Luta da lista de guerreiro." },
          { level: 10, name: "Guerreiro Heroico", desc: "No início de cada um de seus turnos em combate, se não tiver Inspiração Heroica, você a ganha automaticamente." },
          { level: 15, name: "Crítico Superior", desc: "Seus ataques com armas conseguem acerto crítico em rolagens de 18, 19 ou 20." },
          { level: 18, name: "Sobrevivente (Survivor)", desc: "No início de cada turno, se estiver com menos da metade dos seus PV máximos, você recupera 5 + modificador de Constituição PV." }
        ]
      },
      {
        name: "Mestre de Batalha (Battle Master)",
        icon: "⚔️",
        desc: "Guerreiros estrategistas que encaram o combate como uma ciência, utilizando dados de superioridade e manobras precisas.",
        features: [
          { level: 3, name: "Superioridade em Combate (Combat Superiority)", desc: "Você ganha 4 Dados de Superioridade (d8) para executar Manobras como: *Ataque de Desarme*, *Golpe de Empurrão*, *Finta*, *Riposte*, *Manobra de Distração*, *Comando Tático* e *Ataque de Precisão*." },
          { level: 7, name: "Conheça seu Inimigo (Know Your Enemy)", desc: "Ao observar um oponente por 1 minuto ou após acertá-lo em combate, você descobre suas imunidades, resistências, vulnerabilidades e valores de CA/Salvaguardas." },
          { level: 10, name: "Dados de Superioridade Aprimorados", desc: "Seus dados de superioridade tornam-se d10 (e d12 no nível 18)." },
          { level: 15, name: "Implacável (Relentless)", desc: "Uma vez por turno, ao executar uma manobra, você pode rolar 1d8 no lugar de gastar um dado de superioridade da sua reserva." }
        ]
      },
      {
        name: "Cavaleiro Místico (Eldritch Knight)",
        icon: "🔮",
        desc: "Guerreiros arcanos que combinam maestria em combate marcial com feitiços evocativos e defensivos da lista de Mago.",
        features: [
          { level: 3, name: "Conjuração Arcana (Spellcasting)", desc: "Você aprende truques e magias de 1º a 4º círculo da lista de Mago, utilizando Inteligência como atributo de conjuração." },
          { level: 3, name: "Vínculo com Arma (Weapon Bond)", desc: "Você cria um elo mágico com até 2 armas. Você não pode ser desarmado delas e pode invocá-las para sua mão instantaneamente como ação bônus de qualquer distância no mesmo plano." },
          { level: 7, name: "Magia de Guerra (War Magic)", desc: "Ao realizar a ação de Ataque, você pode substituir um dos seus ataques pelo lançamento de um Truque ou magia de 1º círculo." },
          { level: 15, name: "Investida Arcana", desc: "Ao usar Surto de Ação, você pode se teleportar até 9 metros antes ou depois da ação adicional." }
        ]
      },
      {
        name: "Guerreiro Psiônico (Psi Warrior)",
        icon: "🧠",
        desc: "Combatentes que despertam poderes telecinéticos e telepatia pura para impulsionar suas armas e proteger aliados.",
        features: [
          { level: 3, name: "Poder Psiônico", desc: "Você possui uma reserva de Dados de Energia Psiônica (d6 a d12) baseados no dobro do seu bônus de proficiência. Pode usá-los para:\n• **Golpe Telecinético**: Causa dano de Força extra ao acertar um ataque.\n• **Campo Protetor**: Reduz o dano sofrido por você ou um aliado adjacente.\n• **Movimento Telecinético**: Move objetos ou criaturas a até 9 metros." },
          { level: 7, name: "Salto Psiônico & Golpe Telecinético", desc: "Você pode voar com o dobro do seu deslocamento por 1 turno e derrubar alvos com a mente." },
          { level: 10, name: "Mente Blindada", desc: "Resistência a dano psíquico e encerramento de efeitos de Enfeitiçado/Amedrontado no início do turno." },
          { level: 15, name: "Bastião de Vigor", desc: "Concede meia cobertura e bônus de CA para você e aliados ao seu redor." }
        ]
      }
    ]
  },
  {
    id: "ladino",
    name: "Ladino",
    icon: "🗡️",
    role: "Especialista em Furtividade e Precisão Crítica",
    summary: "Mestres da dissimulação, infiltração, perícias refinadas e ataques furtivos letais nos pontos fracos dos inimigos.",
    hitDie: "d8 (1d8 ou 5 PV por nível)",
    primaryAbility: "Destreza",
    savingThrows: ["Destreza", "Inteligência"],
    armorProficiencies: "Armaduras Leves",
    weaponProficiencies: "Armas Simples e Armas Marciais com propriedade Acuidade ou Leve (como Rapieiras, Espadas Curtas, Bestas de Mão)",
    skillProficiencies: "Escolha 4 entre: Acrobacia, Atletismo, Atuação, Enganação, Furtividade, Intimidação, Intuição, Investigação, Percepção, Persuasão e Prestidigitação",
    weaponMastery: "2 armas à sua escolha",
    progression: [
      { level: 1, prof: "+2", features: "Especialização (2 perícias), Ataque Furtivo (1d6), Gíria de Ladrão, Maestria", sneak: "1d6" },
      { level: 2, prof: "+2", features: "Ação Astuta (Cunning Action)", sneak: "1d6" },
      { level: 3, prof: "+2", features: "Subclasse de Ladino, Mira Firme", sneak: "2d6" },
      { level: 4, prof: "+2", features: "Aumento no Valor de Atributo / Talento", sneak: "2d6" },
      { level: 5, prof: "+3", features: "Esquiva Sobrenatural (Uncanny Dodge), Golpe Sagaz", sneak: "3d6" },
      { level: 6, prof: "+3", features: "Especialização (mais 2 perícias)", sneak: "3d6" },
      { level: 7, prof: "+3", features: "Evasão (Evasion), Ação Astuta Aprimorada", sneak: "4d6" },
      { level: 8, prof: "+3", features: "Aumento no Valor de Atributo / Talento", sneak: "4d6" },
      { level: 9, prof: "+4", features: "Habilidade de Subclasse", sneak: "5d6" },
      { level: 10, prof: "+4", features: "Aumento no Valor de Atributo / Talento", sneak: "5d6" },
      { level: 11, prof: "+4", features: "Talento Confiável (Reliable Talent)", sneak: "6d6" },
      { level: 12, prof: "+4", features: "Aumento no Valor de Atributo / Talento", sneak: "6d6" },
      { level: 13, prof: "+5", features: "Habilidade de Subclasse", sneak: "7d6" },
      { level: 14, prof: "+5", features: "Sentido Cego (Blindsense 3m)", sneak: "7d6" },
      { level: 15, prof: "+5", features: "Mente Escorregadia (Proficiência em Sabedoria e Carisma)", sneak: "8d6" },
      { level: 16, prof: "+5", features: "Aumento no Valor de Atributo / Talento", sneak: "8d6" },
      { level: 17, prof: "+6", features: "Habilidade de Subclasse", sneak: "9d6" },
      { level: 18, prof: "+6", features: "Elusivo (Inimigos não ganham Vantagem contra você)", sneak: "9d6" },
      { level: 19, prof: "+6", features: "Talento Épico", sneak: "9d6" },
      { level: 20, prof: "+6", features: "Golpe de Sorte (Transforma erro em acerto ou teste em 20)", sneak: "10d6" }
    ],
    features: [
      {
        level: 1,
        name: "Ataque Furtivo (Sneak Attack)",
        type: "Dano Extra",
        desc: "Uma vez por turno, você pode causar **+1d6 de dano extra** (aumentando a cada 2 níveis até 10d6) a uma criatura que acertar com uma arma de acuidade ou à distância, caso tenha **Vantagem na jogada de ataque** ou se um aliado estiver a até 1,5m do alvo e você não tiver Desvantagem."
      },
      {
        level: 1,
        name: "Especialização (Expertise)",
        type: "Perícias",
        desc: "Escolha duas de suas perícias com proficiência (ou uma perícia e Ferramentas de Ladrão). Seu bônus de proficiência é **dobrado** em qualquer teste de atributo que use as proficiências escolhidas. No nível 6, você escolhe mais duas perícias."
      },
      {
        level: 2,
        name: "Ação Astuta (Cunning Action)",
        type: "Ação Bônus",
        desc: "Sua rapidez de pensamento permite que você realize uma **Ação Bônus** em cada um dos seus turnos de combate para: **Correr (Dash)**, **Desengajar (Disengage)** ou **Esconder-se (Hide)**."
      },
      {
        level: 3,
        name: "Mira Firme (Steady Aim)",
        type: "Ação Bônus",
        desc: "Como Ação Bônus, você mira cuidadosamente e ganha **Vantagem na sua próxima jogada de ataque** neste turno, desde que não tenha se movido neste turno (seu deslocamento torna-se 0 até o fim do turno)."
      },
      {
        level: 5,
        name: "Esquiva Sobrenatural (Uncanny Dodge)",
        type: "Reação",
        desc: "Quando um atacante que você possa ver acertar você com um ataque, você pode usar sua **Reação para reduzir pela metade o dano** daquele ataque contra você."
      },
      {
        level: 5,
        name: "Golpe Sagaz (Cunning Strike)",
        type: "Manobra de Ataque Furtivo",
        desc: "Você pode sacrificar dados de Ataque Furtivo para aplicar efeitos táticos nos inimigos:\n• *Derrubar* (gasta 1d6, CD Des para não cair prostrado).\n• *Desarmar* (gasta 1d6, força soltar item).\n• *Envenenar* (gasta 1d6, envenena por 1 minuto).\n• *Retirada Rápida* (gasta 1d6, move-se sem ataques de oportunidade)."
      },
      {
        level: 7,
        name: "Evasão (Evasion)",
        type: "Salvaguarda",
        desc: "Quando for alvo de um efeito que exija uma salvaguarda de Destreza para sofrer apenas metade do dano (como uma *Bola de Fogo* ou sopro de dragão), você **não sofre dano algum se passar** e sofre apenas **metade do dano se falhar**."
      },
      {
        level: 11,
        name: "Talento Confiável (Reliable Talent)",
        type: "Passiva",
        desc: "Sempre que fizer um teste de atributo que use seu bônus de proficiência, qualquer resultado no d20 de **9 ou menor é tratado como um 10**."
      }
    ],
    subclasses: [
      {
        name: "Assassino (Assassin)",
        icon: "🩸",
        desc: "Especialistas na arte da morte súbita, disfarces perfeitos, venenos letais e emboscadas fulminantes.",
        features: [
          { level: 3, name: "Emboscada Mortal (Assassinate)", desc: "Você tem Vantagem em ataques contra criaturas que ainda não agiram no combate e seus acertos causam dano crítico garantido em alvos Surpresos." },
          { level: 9, name: "Infiltração e Disfarces", desc: "Você cria identidades falsas impecáveis e imita vozes com perfeição absoluta." },
          { level: 13, name: "Golpe do Impostor", desc: "Vantagem em ataques e testes contra alvos enganados por seus disfarces." },
          { level: 17, name: "Golpe Mortal (Death Strike)", desc: "Ao atingir uma criatura surpresa, ela deve passar em Salvaguarda de Constituição ou terá todo o dano do seu ataque dobrado!" }
        ]
      },
      {
        name: "Ladrão (Thief)",
        icon: "🗝️",
        desc: "Ágeis arrombadores e punguistas que usam itens mágicos de qualquer classe e escalam qualquer obstáculo.",
        features: [
          { level: 3, name: "Mãos Rápidas (Fast Hands)", desc: "Você pode usar sua Ação Astuta para usar Ferramentas de Ladrão, desarmar armadilhas ou usar a ação Utilizar Objeto." },
          { level: 3, name: "Trabalho de Segundo Andar", desc: "Escalar não custa movimento extra e seu salto em distância é aumentado." },
          { level: 9, name: "Furtividade Suprema", desc: "Vantagem em testes de Furtividade caso se mova até metade do deslocamento." },
          { level: 13, name: "Usar Item Mágico (Use Magic Device)", desc: "Você ignora todos os requisitos de classe, raça e nível para sintonizar e usar qualquer item mágico!" }
        ]
      },
      {
        name: "Trapaceiro Arcano (Arcane Trickster)",
        icon: "✨",
        desc: "Ladinos que mesclam ilusões arcanas e encantamentos com mãos mágicas invisíveis para roubar e iludir.",
        features: [
          { level: 3, name: "Conjuração de Trapaceiro", desc: "Aprende truques e magias das escolas de Ilusão e Encantamento da lista de Mago." },
          { level: 3, name: "Mãos Mágicas Trapaceiras", desc: "Seu truque Mãos Mágicas fica invisível e pode arrombar fechaduras e guardar/pegar itens de terceiros à distância." },
          { level: 9, name: "Emboscada Mágica", desc: "Se estiver escondido ao lançar uma magia, os alvos têm Desvantagem nas salvaguardas contra ela." },
          { level: 13, name: "Trapaceiro Versátil", desc: "Usa a Mão Mágica para distrair alvos e ganhar Ataque Furtivo garantido." }
        ]
      },
      {
        name: "Lâmina Espiritual (Soulknife)",
        icon: "🗡️",
        desc: "Guerreiros psíquicos que materializam adagas de pura energia mental para perfurar a mente de seus alvos.",
        features: [
          { level: 3, name: "Lâminas Psíquicas", desc: "Materializa adagas psíquicas mágicas que causam dano Psíquico (1d6) e permitem um segundo ataque bônus (1d4)." },
          { level: 3, name: "Poder Psiônico da Mente", desc: "Ganha dados de energia psiônica para adicionar a testes de perícia falhos (*Perícia Guiada*) e criar comunicação telepática com o grupo." },
          { level: 9, name: "Arremesso Telecinético", desc: "Adiciona dados psiônicos para acertar ataques à distância com as lâminas mentais." },
          { level: 13, name: "Voo Psíquico e Invisibilidade", desc: "Fica invisível por 1 hora e teleporta-se através de suas lâminas." }
        ]
      }
    ]
  },
  {
    id: "mago",
    name: "Mago",
    icon: "🧙‍♂️",
    role: "Supremo Mestre Arcano e Conjurador Erudito",
    summary: "Estudiosos supremos do cosmos e do tecido da magia, com o grimório mais versátil e devastador de todo o multiverso.",
    hitDie: "d6 (1d6 ou 4 PV por nível)",
    primaryAbility: "Inteligência",
    savingThrows: ["Inteligência", "Sabedoria"],
    armorProficiencies: "Nenhuma",
    weaponProficiencies: "Armas Simples (Adagas, Dardos, Fundas, Bordões, Bestas Leves)",
    skillProficiencies: "Escolha 2 entre: Arcanismo, História, Intuição, Investigação, Medicina e Religião",
    progression: [
      { level: 1, prof: "+2", features: "Grimório de Magias, Recuperação Arcana, Rituais", cantrips: "3", slots: "2 (1º)" },
      { level: 2, prof: "+2", features: "Especialização do Erudito (Arcana/História)", cantrips: "3", slots: "3 (1º)" },
      { level: 3, prof: "+2", features: "Subclasse de Mago (Escola de Magia)", cantrips: "3", slots: "4 (1º), 2 (2º)" },
      { level: 4, prof: "+2", features: "Aumento no Valor de Atributo / Talento", cantrips: "4", slots: "4 (1º), 3 (2º)" },
      { level: 5, prof: "+3", features: "Magias de 3º Círculo", cantrips: "4", slots: "4 (1º), 3 (2º), 2 (3º)" },
      { level: 6, prof: "+3", features: "Habilidade de Subclasse", cantrips: "4", slots: "4 (1º), 3 (2º), 3 (3º)" },
      { level: 7, prof: "+3", features: "Magias de 4º Círculo", cantrips: "4", slots: "4 (1º), 3 (2º), 3 (3º), 1 (4º)" },
      { level: 8, prof: "+3", features: "Aumento no Valor de Atributo / Talento", cantrips: "4", slots: "4 (1º), 3 (2º), 3 (3º), 2 (4º)" },
      { level: 9, prof: "+4", features: "Magias de 5º Círculo", cantrips: "4", slots: "4 (1º), 3 (2º), 3 (3º), 3 (4º), 1 (5º)" },
      { level: 10, prof: "+4", features: "Habilidade de Subclasse", cantrips: "5", slots: "4 (1º), 3 (2º), 3 (3º), 3 (4º), 2 (5º)" },
      { level: 11, prof: "+4", features: "Magias de 6º Círculo", cantrips: "5", slots: "4 (1º), 3 (2º), 3 (3º), 3 (4º), 2 (5º), 1 (6º)" },
      { level: 12, prof: "+4", features: "Aumento no Valor de Atributo / Talento", cantrips: "5", slots: "4 (1º), 3 (2º), 3 (3º), 3 (4º), 2 (5º), 1 (6º)" },
      { level: 13, prof: "+5", features: "Magias de 7º Círculo", cantrips: "5", slots: "4 (1º), 3 (2º), 3 (3º), 3 (4º), 2 (5º), 1 (6º), 1 (7º)" },
      { level: 14, prof: "+5", features: "Habilidade de Subclasse", cantrips: "5", slots: "4 (1º), 3 (2º), 3 (3º), 3 (4º), 2 (5º), 1 (6º), 1 (7º)" },
      { level: 15, prof: "+5", features: "Magias de 8º Círculo", cantrips: "5", slots: "4 (1º), 3 (2º), 3 (3º), 3 (4º), 2 (5º), 1 (6º), 1 (7º), 1 (8º)" },
      { level: 16, prof: "+5", features: "Aumento no Valor de Atributo / Talento", cantrips: "5", slots: "4 (1º), 3 (2º), 3 (3º), 3 (4º), 2 (5º), 1 (6º), 1 (7º), 1 (8º)" },
      { level: 17, prof: "+6", features: "Magias de 9º Círculo (Desejo, Chuva de Meteoros)", cantrips: "5", slots: "4 (1º), 3 (2º), 3 (3º), 3 (4º), 2 (5º), 1 (6º), 1 (7º), 1 (8º), 1 (9º)" },
      { level: 18, prof: "+6", features: "Maestria em Magia (Spell Mastery - Truque de 1º e 2º à vontade)", cantrips: "5", slots: "Slots Padrão" },
      { level: 19, prof: "+6", features: "Talento Épico", cantrips: "5", slots: "Slots Padrão" },
      { level: 20, prof: "+6", features: "Assinatura Mágica (Duas magias de 3º sempre preparadas)", cantrips: "5", slots: "Slots Padrão" }
    ],
    features: [
      {
        level: 1,
        name: "Grimório de Magias (Spellbook)",
        type: "Conjurador Essencial",
        desc: "Você possui um tomo arcano contendo suas fórmulas mágicas. Começa com 6 magias de 1º círculo e ganha **+2 magias gratuitas a cada novo nível de mago**, além de poder copiar qualquer pergaminho ou grimório encontrado gastando 50 PO e 2 horas por círculo de magia."
      },
      {
        level: 1,
        name: "Recuperação Arcana (Arcane Recovery)",
        type: "Descanso Curto",
        desc: "Uma vez por dia ao terminar um Descanso Curto, você pode recuperar espaços de magia gastos cujo círculo combinado seja igual ou inferior a **metade do seu nível de mago** (arredondado para cima, máx 5º círculo)."
      },
      {
        level: 1,
        name: "Conjuração de Rituais (Ritual Casting)",
        type: "Passiva",
        desc: "Você pode conjurar qualquer magia do seu grimório como ritual sem precisar gastar um espaço de magia, desde que a magia tenha o descritor Ritual (não precisa nem mesmo tê-la preparada no dia!)."
      },
      {
        level: 2,
        name: "Erudito (Scholar)",
        type: "Especialização",
        desc: "Você ganha Especialização (dobro de bônus de proficiência) em uma perícia de conhecimento: *Arcanismo*, *História*, *Investigação*, *Medicina*, *Natureza* ou *Religião*."
      },
      {
        level: 18,
        name: "Maestria em Magias (Spell Mastery)",
        type: "Ápice Arcano",
        desc: "Você escolhe uma magia de 1º círculo e uma de 2º círculo do seu grimório. Você pode conjurar ambas no seu círculo mais baixo **à vontade, sem gastar espaços de magia**!"
      },
      {
        level: 20,
        name: "Assinatura Mágica (Signature Spells)",
        type: "Poder Supremo",
        desc: "Escolha duas magias de 3º círculo do seu grimório como suas assinaturas. Elas estão sempre preparadas, não contam no seu limite diário e você pode conjurar cada uma uma vez no 3º círculo sem gastar espaços entre descansos curtos."
      }
    ],
    subclasses: [
      {
        name: "Escola de Evocação (Evoker)",
        icon: "🔥",
        desc: "Mestres de magias elementais devastadoras, esculpindo fendas seguras em explosões para proteger aliados.",
        features: [
          { level: 3, name: "Esculpir Magias (Sculpt Spells)", desc: "Ao conjurar magias de evocação em área (como Bola de Fogo), você escolhe até 1 + círculo da magia criaturas que passam automaticamente na salvaguarda e não sofrem dano algum!" },
          { level: 6, name: "Truque Potente (Potent Cantrip)", desc: "Criaturas que passarem na salvaguarda contra seus truques ainda sofrem metade do dano normal." },
          { level: 10, name: "Evocação Empoderada", desc: "Adiciona seu modificador de Inteligência em todas as rolagens de dano de magias de evocação." },
          { level: 14, name: "Sobrecarga Mágica (Overchannel)", desc: "Maximiza o dano total de magias de 1º a 5º círculo sem rolar dados (dano total máximo)." }
        ]
      },
      {
        name: "Escola de Abjuração (Abjurer)",
        icon: "🛡️",
        desc: "Defensores místicos que projetam barreiras de força arcana impenetráveis e anulam feitiços inimigos.",
        features: [
          { level: 3, name: "Proteção Arcana (Arcane Ward)", desc: "Ao conjurar uma magia de abjuração, você cria uma barreira protetora com PV iguais a 2x nível de mago + Inteligência que absorve dano antes dos seus PV." },
          { level: 6, name: "Proteção Projetada", desc: "Com uma reação, sua Proteção Arcana se desloca para absorver o dano recebido por um aliado a até 9 metros." },
          { level: 10, name: "Abjuração Aprimorada", desc: "Adiciona seu bônus de proficiência em testes de Contramagia e Dissipar Magia." },
          { level: 14, name: "Resistência a Magias", desc: "Vantagem em salvaguardas contra todas as magias e resistência ao dano delas." }
        ]
      },
      {
        name: "Escola de Adivinhação (Diviner)",
        icon: "👁️",
        desc: "Videntes que enxergam as linhas do destino e manipulam a sorte e o tempo antes que os acontecimentos ocorram.",
        features: [
          { level: 3, name: "Presságio (Portent)", desc: "Ao terminar um Descanso Longo, você rola 2d20 e anota os resultados. Pode substituir qualquer d20 de ataque, salvaguarda ou teste seu ou de outra criatura por um desses números!" },
          { level: 6, name: "Adivinho Especialista", desc: "Conjurar magias de adivinhação devolve espaços de magia de círculos inferiores." },
          { level: 10, name: "Terceiro Olho (The Third Eye)", desc: "Ganha Visão no Escuro (36m), Visão Etérea, Ler Qualquer Idioma ou Ver o Invisível à sua escolha." },
          { level: 14, name: "Presságio Maior", desc: "Você agora rola 3d20 de Presságio a cada descanso longo." }
        ]
      },
      {
        name: "Escola de Ilusão (Illusionist)",
        icon: "🎭",
        desc: "Artistas do engano que dobram a percepção da realidade, tornando ilusões em matéria física palpável.",
        features: [
          { level: 3, name: "Ilusão Aprimorada", desc: "Aprende Ilusão Menor com som e imagem simultâneos como Ação Bônus." },
          { level: 6, name: "Maleabilidade Ilusória", desc: "Altera a natureza e o visual de uma ilusão já criada sem precisar reconjurá-la." },
          { level: 10, name: "Dublê Ilusório", desc: "Com uma reação ao ser atacado, uma cópia ilusória absorve o golpe, fazendo o ataque errar automaticamente." },
          { level: 14, name: "Realidade Ilusória (Illusory Reality)", desc: "Você pode tornar um objeto inanimado não mágico de uma ilusão em matéria real e física por 1 minuto!" }
        ]
      }
    ]
  },
  {
    id: "clerigo",
    name: "Clérigo",
    icon: "✝️",
    role: "Campeão Divino, Curandeiro e Guia Espiritual",
    summary: "Condutores diretos do poder dos deuses, capazes de canalizar energia divina, erguer aliados e aniquilar mortos-vivos.",
    hitDie: "d8 (1d8 ou 5 PV por nível)",
    primaryAbility: "Sabedoria",
    savingThrows: ["Sabedoria", "Carisma"],
    armorProficiencies: "Armaduras Leves, Médias e Escudos (Pesadas na Ordem Protetora)",
    weaponProficiencies: "Armas Simples (Marciais na Ordem Protetora)",
    skillProficiencies: "Escolha 2 entre: História, Intuição, Medicina, Persuasão e Religião",
    progression: [
      { level: 1, prof: "+2", features: "Conjuração Divina, Ordem Divina (Protetor ou Taumaturgo)", cantrips: "3", slots: "2 (1º)" },
      { level: 2, prof: "+2", features: "Canalizar Divindade (2 usos), Expulsar Mortos-Vivos, Centelha Divina", cantrips: "3", slots: "3 (1º)" },
      { level: 3, prof: "+2", features: "Subclasse de Clérigo (Domínio Divino)", cantrips: "3", slots: "4 (1º), 2 (2º)" },
      { level: 4, prof: "+2", features: "Aumento no Valor de Atributo / Talento", cantrips: "4", slots: "4 (1º), 3 (2º)" },
      { level: 5, prof: "+3", features: "Destruir Mortos-Vivos (ND 1/2 ou menor)", cantrips: "4", slots: "4 (1º), 3 (2º), 2 (3º)" },
      { level: 6, prof: "+3", features: "Habilidade de Subclasse, Canalizar Divindade (3 usos)", cantrips: "4", slots: "4 (1º), 3 (2º), 3 (3º)" },
      { level: 7, prof: "+3", features: "Golpe Abençoado ou Conjuração Potente", cantrips: "4", slots: "4 (1º), 3 (2º), 3 (3º), 1 (4º)" },
      { level: 8, prof: "+3", features: "Aumento no Valor de Atributo / Talento", cantrips: "4", slots: "4 (1º), 3 (2º), 3 (3º), 2 (4º)" },
      { level: 9, prof: "+4", features: "Magias de 5º Círculo", cantrips: "4", slots: "4 (1º), 3 (2º), 3 (3º), 3 (4º), 1 (5º)" },
      { level: 10, prof: "+4", features: "Intervenção Divina (Sucesso garantido)", cantrips: "5", slots: "4 (1º), 3 (2º), 3 (3º), 3 (4º), 2 (5º)" },
      { level: 11, prof: "+4", features: "Destruir Mortos-Vivos (ND 2)", cantrips: "5", slots: "4 (1º), 3 (2º), 3 (3º), 3 (4º), 2 (5º), 1 (6º)" },
      { level: 12, prof: "+4", features: "Aumento no Valor de Atributo / Talento", cantrips: "5", slots: "4 (1º), 3 (2º), 3 (3º), 3 (4º), 2 (5º), 1 (6º)" },
      { level: 13, prof: "+5", features: "Magias de 7º Círculo", cantrips: "5", slots: "4 (1º), 3 (2º), 3 (3º), 3 (4º), 2 (5º), 1 (6º), 1 (7º)" },
      { level: 14, prof: "+5", features: "Destruir Mortos-Vivos (ND 3)", cantrips: "5", slots: "4 (1º), 3 (2º), 3 (3º), 3 (4º), 2 (5º), 1 (6º), 1 (7º)" },
      { level: 15, prof: "+5", features: "Magias de 8º Círculo", cantrips: "5", slots: "4 (1º), 3 (2º), 3 (3º), 3 (4º), 2 (5º), 1 (6º), 1 (7º), 1 (8º)" },
      { level: 16, prof: "+5", features: "Aumento no Valor de Atributo / Talento", cantrips: "5", slots: "4 (1º), 3 (2º), 3 (3º), 3 (4º), 2 (5º), 1 (6º), 1 (7º), 1 (8º)" },
      { level: 17, prof: "+6", features: "Habilidade de Subclasse, Destruir Mortos-Vivos (ND 4)", cantrips: "5", slots: "4 (1º), 3 (2º), 3 (3º), 3 (4º), 2 (5º), 1 (6º), 1 (7º), 1 (8º), 1 (9º)" },
      { level: 18, prof: "+6", features: "Canalizar Divindade (4 usos)", cantrips: "5", slots: "Slots Padrão" },
      { level: 19, prof: "+6", features: "Talento Épico", cantrips: "5", slots: "Slots Padrão" },
      { level: 20, prof: "+6", features: "Intervenção Divina Maior (Conjura magia de até 9º círculo)", cantrips: "5", slots: "Slots Padrão" }
    ],
    features: [
      {
        level: 1,
        name: "Conjuração Divina (Spellcasting)",
        type: "Conjurador Sagrado",
        desc: "Você conjura preces e milagres da lista de magias de Clérigo, utilizando **Sabedoria** como atributo de conjuração. Você prepara um número de magias diariamente e pode conjurar magias com o descritor Ritual."
      },
      {
        level: 1,
        name: "Ordem Divina (Divine Order)",
        type: "Especialização Sagrada",
        desc: "Escolha uma vocação sagrada:\n• **Protetor**: Ganha proficiência com Armaduras Pesadas e Armas Marciais.\n• **Taumaturgo**: Ganha um truque adicional da lista de Clérigo e adiciona seu modificador de Sabedoria em testes de Arcanismo e Religião."
      },
      {
        level: 2,
        name: "Canalizar Divindade (Channel Divinity)",
        type: "Poder Sagrado",
        desc: "Você canaliza o poder do seu deus para produzir efeitos milagrosos:\n• **Expulsar Mortos-Vivos**: Mortos-vivos a até 9m devem passar em salvaguarda de Sabedoria ou ficam Amedrontados e fogem.\n• **Centelha Divina**: Cura um aliado ou causa dano radiante/necrótico em 1d8 + Sabedoria."
      },
      {
        level: 5,
        name: "Destruir Mortos-Vivos (Destroy Undead)",
        type: "Julgamento Sagrado",
        desc: "Quando um morto-vivo falhar na salvaguarda contra o seu *Expulsar Mortos-Vivos*, ele é **instantaneamente destruído e transformado em cinzas** se seu Nível de Desafio (ND) for igual ou inferior ao limite do seu nível de clérigo (ND 1/2 no Nv 5, ND 1 no Nv 8, ND 2 no Nv 11, ND 3 no Nv 14, ND 4 no Nv 17)."
      },
      {
        level: 7,
        name: "Golpes Abençoados (Blessed Strikes)",
        type: "Dano Sagrado",
        desc: "Uma vez por turno ao acertar um ataque com arma ou causar dano com um truque de clérigo, você adiciona **+1d8 de dano Radiante ou Necrótico**."
      },
      {
        level: 10,
        name: "Intervenção Divina (Divine Intervention)",
        type: "Milagre",
        desc: "Como ação, você implora pelo auxílio direto da sua divindade. Você escolhe qualquer magia de clérigo de 5º círculo ou menor e ela é **conjurada instantaneamente sem gastar espaços de magia ou componentes materiais**. Recupera após um Descanso Longo."
      },
      {
        level: 20,
        name: "Intervenção Divina Maior (Greater Divine Intervention)",
        type: "Ápice Sagrado",
        desc: "Sua conexão com o panteão atinge a perfeição cósmica. Sua Intervenção Divina pode conjurar qualquer magia de clérigo de **até 9º círculo** ou a magia *Desejo*."
      }
    ],
    subclasses: [
      {
        name: "Domínio da Vida (Life Domain)",
        icon: "💖",
        desc: "O pináculo da cura sagrada e restauração de almas e corpos caídos em batalha.",
        features: [
          { level: 3, name: "Discípulo da Vida", desc: "Sempre que usar uma magia de 1º círculo ou superior para restaurar PV, a criatura recupera 2 + círculo da magia PV adicionais." },
          { level: 3, name: "Preservar a Vida (Canalizar Divindade)", desc: "Cura um total de 5x seu nível de clérigo distribuído entre aliados a até 9m com menos da metade da vida." },
          { level: 6, name: "Curandeiro Abençoado", desc: "Ao curar um aliado com magia, você também recupera PV iguais a 2 + círculo da magia." },
          { level: 17, name: "Cura Suprema", desc: "Todas as suas magias de cura curam o valor máximo possível nos dados sem rolar." }
        ]
      },
      {
        name: "Domínio da Luz (Light Domain)",
        icon: "☀️",
        desc: "Canalizadores do sol e das chamas purificadoras que banem as trevas e queimam heresias.",
        features: [
          { level: 3, name: "Clarão Protetor (Warding Flare)", desc: "Com uma reação ao ser atacado por criatura a até 9m, você emite uma luz ofuscante impondo Desvantagem no ataque." },
          { level: 3, name: "Raios da Aurora (Canalizar Divindade)", desc: "Dissipa qualquer escuridão mágica e causa 2d10 + nível de clérigo de dano Radiante a todos os inimigos a até 9m." },
          { level: 6, name: "Clarão Aprimorado", desc: "Você pode usar o Clarão Protetor quando um aliado for atacado." },
          { level: 17, name: "Corona de Luz", desc: "Emite uma aura de 18m de luz solar impondo desvantagem nas salvaguardas contra suas magias de fogo e radiantes." }
        ]
      },
      {
        name: "Domínio da Trapaça (Trickery Domain)",
        icon: "🎭",
        desc: "Devotos de deuses ardilosos que utilizam ilusões, duplicatas e furtividade divina para enganar opositores.",
        features: [
          { level: 3, name: "Bênção do Trapaceiro", desc: "Concede Vantagem em testes de Furtividade para uma criatura tocada." },
          { level: 3, name: "Invocar Duplicata (Canalizar Divindade)", desc: "Cria uma cópia ilusória perfeita que se move até 9m e através da qual você pode conjurar magias com Vantagem." },
          { level: 6, name: "Capa de Sombras", desc: "Fica invisível como reação ao ser atacado ou como ação bônus." },
          { level: 17, name: "Duplicata Suprema", desc: "Você cria até 4 duplicatas ilusórias simultâneas no campo de batalha." }
        ]
      },
      {
        name: "Domínio da Guerra (War Domain)",
        icon: "⚔️",
        desc: "Guerreiros sagrados abençoados pelo deus das batalhas para liderar cruzadas e aniquilar exércitos.",
        features: [
          { level: 3, name: "Sacerdote da Guerra", desc: "Ao usar a ação de Ataque, você pode desferir um ataque extra com arma como Ação Bônus." },
          { level: 3, name: "Golpe Guiado (Canalizar Divindade)", desc: "Concede +10 de bônus na jogada de ataque para garantir o acerto." },
          { level: 6, name: "Bênção do Deus da Guerra", desc: "Você pode conceder o bônus de +10 no ataque para um aliado a até 9m." },
          { level: 17, name: "Avatar da Batalha", desc: "Resistência permanente a dano de concussão, cortante e perfurante não mágico." }
        ]
      }
    ]
  },
  {
    id: "paladino",
    name: "Paladino",
    icon: "🛡️",
    role: "Guerreiro Sagrado, Bastião de Justiça e Destruidor do Mal",
    summary: "Guerreiros juramentados a um ideal sagrado inquebrantável, combinando proeza militar, Auras protetoras e o Golpe Divino (Divine Smite).",
    hitDie: "d10 (1d10 ou 6 PV por nível)",
    primaryAbility: "Força e Carisma",
    savingThrows: ["Sabedoria", "Carisma"],
    armorProficiencies: "Todas as armaduras e Escudos",
    weaponProficiencies: "Armas Simples e Armas Marciais",
    skillProficiencies: "Escolha 2 entre: Atletismo, Intuição, Intimidação, Medicina, Persuasão e Religião",
    weaponMastery: "2 armas à sua escolha",
    progression: [
      { level: 1, prof: "+2", features: "Imposição das Mãos (Lay on Hands), Conjuração, Sentido Divino", slots: "2 (1º)" },
      { level: 2, prof: "+2", features: "Estilo de Luta, Golpe Divino (Divine Smite)", slots: "2 (1º)" },
      { level: 3, prof: "+2", features: "Subclasse de Paladino (Juramento Sagrado), Canalizar Divindade", slots: "3 (1º)" },
      { level: 4, prof: "+2", features: "Aumento no Valor de Atributo / Talento", slots: "3 (1º)" },
      { level: 5, prof: "+3", features: "Ataque Extra, Encontrar Montaria (Gratuita 1x/dia)", slots: "4 (1º), 2 (2º)" },
      { level: 6, prof: "+3", features: "Aura de Proteção (Adiciona Carisma a todas as salvaguardas)", slots: "4 (1º), 2 (2º)" },
      { level: 7, prof: "+3", features: "Habilidade de Juramento (Aura de Subclasse)", slots: "4 (1º), 3 (2º)" },
      { level: 8, prof: "+3", features: "Aumento no Valor de Atributo / Talento", slots: "4 (1º), 3 (2º)" },
      { level: 9, prof: "+4", features: "Magias de 3º Círculo", slots: "4 (1º), 3 (2º), 2 (3º)" },
      { level: 10, prof: "+4", features: "Aura de Coragem (Imunidade a Amedrontado)", slots: "4 (1º), 3 (2º), 2 (3º)" },
      { level: 11, prof: "+4", features: "Golpe Divino Radiante (+1d8 permanente em todo ataque)", slots: "4 (1º), 3 (2º), 3 (3º)" },
      { level: 12, prof: "+4", features: "Aumento no Valor de Atributo / Talento", slots: "4 (1º), 3 (2º), 3 (3º)" },
      { level: 13, prof: "+5", features: "Magias de 4º Círculo", slots: "4 (1º), 3 (2º), 3 (3º), 1 (4º)" },
      { level: 14, prof: "+5", features: "Toque Purificador (Remove condições como ação bônus)", slots: "4 (1º), 3 (2º), 3 (3º), 1 (4º)" },
      { level: 15, prof: "+5", features: "Habilidade de Juramento", slots: "4 (1º), 3 (2º), 3 (3º), 2 (4º)" },
      { level: 16, prof: "+5", features: "Aumento no Valor de Atributo / Talento", slots: "4 (1º), 3 (2º), 3 (3º), 2 (4º)" },
      { level: 17, prof: "+6", features: "Magias de 5º Círculo", slots: "4 (1º), 3 (2º), 3 (3º), 3 (4º), 1 (5º)" },
      { level: 18, prof: "+6", features: "Auras Expandidas (Raio aumenta para 9 metros)", slots: "4 (1º), 3 (2º), 3 (3º), 3 (4º), 1 (5º)" },
      { level: 19, prof: "+6", features: "Talento Épico", slots: "4 (1º), 3 (2º), 3 (3º), 3 (4º), 2 (5º)" },
      { level: 20, prof: "+6", features: "Campeão do Juramento (Transformação Avatar Suprema)", slots: "4 (1º), 3 (2º), 3 (3º), 3 (4º), 2 (5º)" }
    ],
    features: [
      {
        level: 1,
        name: "Imposição das Mãos (Lay on Hands)",
        type: "Cura Sagrada",
        desc: "Você possui uma reserva de cura igual a **5x seu nível de paladino**. Como ação bônus, você pode tocar uma criatura e restaurar qualquer quantidade dessa reserva, ou gastar 5 pontos para curar a condição Envenenado."
      },
      {
        level: 1,
        name: "Sentido Divino (Divine Sense)",
        type: "Ação Bônus",
        desc: "Com uma ação bônus, você expande sua consciência sagrada. Até o fim do seu próximo turno, você sabe a localização de qualquer celestial, corruptor ou morto-vivo a até 18 metros de você."
      },
      {
        level: 2,
        name: "Golpe Divino (Divine Smite)",
        type: "Ação Bônus / Acerto",
        desc: "Ao acertar uma criatura com uma arma corpo a corpo ou ataque desarmado, você pode gastar 1 espaço de magia para causar dano Radiante extra igual a **2d8 para 1º círculo + 1d8 para cada círculo superior** (máximo 5d8), aumentando em +1d8 se o alvo for morto-vivo ou corruptor."
      },
      {
        level: 5,
        name: "Encontrar Montaria Sagrada (Find Steed)",
        type: "Magia Inata",
        desc: "Você pode conjurar a magia *Encontrar Montaria* uma vez por descanso longo gratuitamente sem gastar espaços de magia, invocando um corcel celestial leal com habilidades aprimoradas."
      },
      {
        level: 6,
        name: "Aura de Proteção (Aura of Protection)",
        type: "Aura Sagrada",
        desc: "Você e todos os aliados a até 3 metros de você (aumenta para 9m no nível 18) recebem um **bônus igual ao seu modificador de Carisma em TODAS as salvaguardas** enquanto você estiver consciente."
      },
      {
        level: 10,
        name: "Aura de Coragem (Aura of Courage)",
        type: "Aura Sagrada",
        desc: "Você e aliados a até 3 metros (9m no nível 18) são completamente **imunes à condição Amedrontado**."
      },
      {
        level: 11,
        name: "Golpes Radiantes (Radiant Strikes)",
        type: "Passiva",
        desc: "Você é tão impregnado com virtude sagrada que todos os seus ataques com armas causam **+1d8 de dano Radiante permanentemente** sem gastar recursos!"
      },
      {
        level: 14,
        name: "Toque Purificador (Cleansing Touch)",
        type: "Ação Bônus",
        desc: "Como ação bônus, você encerra uma condição de Cegueira, Surdez, Paralisia, Envenenamento ou Atordoamento em si mesmo ou em um aliado voluntário tocado."
      }
    ],
    subclasses: [
      {
        name: "Juramento de Devoção (Devotion)",
        icon: "☀️",
        desc: "O arquétipo clássico do cavaleiro da luz, honra, justiça e proteção dos inocentes contra as trevas.",
        features: [
          { level: 3, name: "Arma Sagrada (Canalizar Divindade)", desc: "Adiciona seu modificador de Carisma em todas as jogadas de ataque com a arma e emite luz mágica por 1 minuto." },
          { level: 7, name: "Aura de Devoção", desc: "Você e aliados na aura são imunes à condição Enfeitiçado." },
          { level: 15, name: "Golpe Purificador", desc: "Seus ataques dissipam magias de encantamento e possessão nos alvos." },
          { level: 20, name: "Halo Sagrado", desc: "Transforma-se em um anjo de luz causando dano radiante contínuo e ganhando Vantagem em salvaguardas." }
        ]
      },
      {
        name: "Juramento de Vingança (Vengeance)",
        icon: "⚔️",
        desc: "Guerreiros implacáveis que punem transgressores supremos sem qualquer piedade ou hesitação.",
        features: [
          { level: 3, name: "Voto de Inimizade (Vow of Enmity)", desc: "Como ação bônus, você ganha Vantagem garantida em todas as jogadas de ataque contra um alvo a até 9m por 1 minuto!" },
          { level: 7, name: "Vingador Implacável", desc: "Ao acertar um ataque de oportunidade, você pode se mover até metade do seu deslocamento como parte da reação." },
          { level: 15, name: "Alma Vingativa", desc: "Sempre que a criatura sob o Voto de Inimizade atacar, você pode desferir um ataque corpo a corpo contra ela como reação." },
          { level: 20, name: "Anjo Vingador", desc: "Ganha asas com deslocamento de voo de 18m e emite uma aura de pavor aterrorizante." }
        ]
      },
      {
        name: "Juramento dos Anciões (Ancients)",
        icon: "🌿",
        desc: "Cavaleiros verdes que protegem a luz da vida, a beleza do mundo natural e as canções ancestrais.",
        features: [
          { level: 3, name: "Ira da Natureza (Canalizar Divindade)", desc: "Gera vinhas espectrais que prendem e impedem um oponente a até 9m." },
          { level: 7, name: "Aura de Proteção Arcana", desc: "Você e aliados na aura têm Resistência ao dano de todas as magias!" },
          { level: 15, name: "Sentinela Imortal", desc: "Ao cair a 0 PV, você retorna a 1 PV uma vez por descanso longo e não pode sofrer envelhecimento mágico." },
          { level: 20, name: "Campeão Ancião", desc: "Regenera 10 PV por turno e conjura magias de paladino com Ação Bônus." }
        ]
      },
      {
        name: "Juramento de Glória (Glory)",
        icon: "🏅",
        desc: "Heróis épicos focados no heroísmo lendário, feitos atléticos sem precedentes e inspiração dos companheiros.",
        features: [
          { level: 3, name: "Atleta Incomparável", desc: "Vantagem em testes de Força e Atletismo e saltos aumentados por 10 minutos." },
          { level: 7, name: "Aura de Rapidez", desc: "Seu deslocamento e o de seus aliados na aura aumenta em +3 metros (+10 ft)." },
          { level: 15, name: "Defesa Gloriosa", desc: "Com uma reação, concede bônus de CA para um aliado e desfere um contra-ataque imediato." },
          { level: 20, name: "Lenda Viva", desc: "Vantagem em testes de Carisma, transforma erro em acerto e ganha re-rolagem de salvaguardas." }
        ]
      }
    ]
  },
  {
    id: "bardo",
    name: "Bardo",
    icon: "🎶",
    role: "Conjurador Versátil, Músico Mágico e Especialista",
    summary: "Artistas e contadores de histórias que moldam a realidade através da música e da retórica, inspirando heróis e conjurando qualquer feitiço.",
    hitDie: "d8 (1d8 ou 5 PV por nível)",
    primaryAbility: "Carisma",
    savingThrows: ["Destreza", "Carisma"],
    armorProficiencies: "Armaduras Leves",
    weaponProficiencies: "Armas Simples",
    skillProficiencies: "Escolha quaisquer 3 perícias à sua escolha",
    progression: [
      { level: 1, prof: "+2", features: "Inspiração Bárdica (d6), Conjuração", die: "d6", slots: "2 (1º)" },
      { level: 2, prof: "+2", features: "Especialização (2 perícias), Pau pra Toda Obra (Jack of All Trades)", die: "d6", slots: "3 (1º)" },
      { level: 3, prof: "+2", features: "Subclasse de Bardo (Colégio Bárdico)", die: "d6", slots: "4 (1º), 2 (2º)" },
      { level: 4, prof: "+2", features: "Aumento no Valor de Atributo / Talento", die: "d6", slots: "4 (1º), 3 (2º)" },
      { level: 5, prof: "+3", features: "Inspiração Bárdica (d8), Fonte de Inspiração (Recupera em Descanso Curto)", die: "d8", slots: "4 (1º), 3 (2º), 2 (3º)" },
      { level: 6, prof: "+3", features: "Habilidade de Subclasse, Contra-encanto", die: "d8", slots: "4 (1º), 3 (2º), 3 (3º)" },
      { level: 7, prof: "+3", features: "Magias de 4º Círculo", die: "d8", slots: "4 (1º), 3 (2º), 3 (3º), 1 (4º)" },
      { level: 8, prof: "+3", features: "Aumento no Valor de Atributo / Talento", die: "d8", slots: "4 (1º), 3 (2º), 3 (3º), 2 (4º)" },
      { level: 9, prof: "+4", features: "Especialização (mais 2 perícias)", die: "d8", slots: "4 (1º), 3 (2º), 3 (3º), 3 (4º), 1 (5º)" },
      { level: 10, prof: "+4", features: "Segredos Mágicos (Aprende magias de Clerigo, Druida ou Mago!)", die: "d10", slots: "4 (1º), 3 (2º), 3 (3º), 3 (4º), 2 (5º)" },
      { level: 11, prof: "+4", features: "Magias de 6º Círculo", die: "d10", slots: "4 (1º), 3 (2º), 3 (3º), 3 (4º), 2 (5º), 1 (6º)" },
      { level: 12, prof: "+4", features: "Aumento no Valor de Atributo / Talento", die: "d10", slots: "4 (1º), 3 (2º), 3 (3º), 3 (4º), 2 (5º), 1 (6º)" },
      { level: 13, prof: "+5", features: "Magias de 7º Círculo", die: "d10", slots: "4 (1º), 3 (2º), 3 (3º), 3 (4º), 2 (5º), 1 (6º), 1 (7º)" },
      { level: 14, prof: "+5", features: "Habilidade de Subclasse", die: "d10", slots: "4 (1º), 3 (2º), 3 (3º), 3 (4º), 2 (5º), 1 (6º), 1 (7º)" },
      { level: 15, prof: "+5", features: "Inspiração Bárdica (d12)", die: "d12", slots: "4 (1º), 3 (2º), 3 (3º), 3 (4º), 2 (5º), 1 (6º), 1 (7º), 1 (8º)" },
      { level: 16, prof: "+5", features: "Aumento no Valor de Atributo / Talento", die: "d12", slots: "4 (1º), 3 (2º), 3 (3º), 3 (4º), 2 (5º), 1 (6º), 1 (7º), 1 (8º)" },
      { level: 17, prof: "+6", features: "Magias de 9º Círculo", die: "d12", slots: "4 (1º), 3 (2º), 3 (3º), 3 (4º), 2 (5º), 1 (6º), 1 (7º), 1 (8º), 1 (9º)" },
      { level: 18, prof: "+6", features: "Inspiração Superior", die: "d12", slots: "Slots Padrão" },
      { level: 19, prof: "+6", features: "Talento Épico", die: "d12", slots: "Slots Padrão" },
      { level: 20, prof: "+6", features: "Palavras da Criação (Recupera inspiração e maximiza cura/dano)", die: "d12", slots: "Slots Padrão" }
    ],
    features: [
      {
        level: 1,
        name: "Inspiração Bárdica (Bardic Inspiration)",
        type: "Ação Bônus",
        desc: "Com uma Ação Bônus, você concede um Dado de Inspiração (d6 a d12) a um aliado a até 18m. Pelos próximos 10 minutos, o aliado pode somar esse dado a uma jogada de ataque, salvaguarda, teste de perícia ou dano/cura."
      },
      {
        level: 1,
        name: "Conjuração Bárdica (Spellcasting)",
        type: "Conjurador Artístico",
        desc: "Você conjura magias da lista de Bardo através de instrumentos musicais ou palavras de poder, usando **Carisma** como atributo chave."
      },
      {
        level: 2,
        name: "Pau pra Toda Obra (Jack of All Trades)",
        type: "Passiva",
        desc: "Você pode adicionar metade do seu bônus de proficiência (arredondado para baixo) em **qualquer teste de atributo** que ainda não inclua sua proficiência (incluindo Iniciativa!)."
      },
      {
        level: 2,
        name: "Especialização (Expertise)",
        type: "Perícias",
        desc: "Escolha duas de suas perícias com proficiência. Seu bônus de proficiência é **dobrado** nelas. Você escolhe mais duas perícias no Nível 9."
      },
      {
        level: 5,
        name: "Fonte de Inspiração (Font of Inspiration)",
        type: "Descanso Curto",
        desc: "Você recupera todos os seus usos gastos de Inspiração Bárdica ao terminar um **Descanso Curto ou Longo**."
      },
      {
        level: 6,
        name: "Contra-encanto (Countercharm)",
        type: "Reação / Música",
        desc: "Com uma reação quando você ou um aliado a até 9m falhar em uma salvaguarda contra efeito de Enfeitiçado ou Amedrontado, você pode conceder uma nova rolagem imediata com Vantagem."
      },
      {
        level: 10,
        name: "Segredos Mágicos (Magical Secrets)",
        type: "Conjurador Supremo",
        desc: "Sua erudição musical penetra em outras tradições. Você pode escolher magias das listas de **Clérigo, Druida e Mago** sempre que aprender ou trocar magias, tratando-as como magias de bardo!"
      },
      {
        level: 20,
        name: "Palavras da Criação (Words of Creation)",
        type: "Ápice Bárdico",
        desc: "Você domina a canção que criou o multiverso. Quando rolar Iniciativa sem nenhum uso de Inspiração Bárdica, recupera 2 usos. Além disso, suas magias de cura e dano maximizam os dados de inspiração."
      }
    ],
    subclasses: [
      {
        name: "Colégio do Conhecimento (Lore)",
        icon: "📖",
        desc: "Eruditos que desvendam segredos arcanos precoces e zombam de inimigos com palavras cortantes.",
        features: [
          { level: 3, name: "Palavras Cortantes (Cutting Words)", desc: "Com uma reação, usa a Inspiração Bárdica para subtrair do ataque, dano ou teste de um oponente." },
          { level: 6, name: "Segredos Mágicos Adicionais", desc: "Aprende 2 magias adicionais de qualquer classe já no nível 6." },
          { level: 14, name: "Habilidade Incomparável", desc: "Soma o dado de inspiração em seus próprios testes de perícia." }
        ]
      },
      {
        name: "Colégio da Bravura (Valor)",
        icon: "🛡️",
        desc: "Bardos marciais que empunham escudos e espadas e inspiram aliados a causar dano de combate devastador.",
        features: [
          { level: 3, name: "Proficiências Marciais", desc: "Ganha proficiência com Armaduras Médias, Escudos e Armas Marciais." },
          { level: 3, name: "Inspiração de Combate", desc: "Aliados podem somar o dado de inspiração diretamente no dano de suas armas ou na CA como reação." },
          { level: 6, name: "Ataque Extra (com Truque)", desc: "Pode atacar duas vezes ou substituir um ataque por um Truque." },
          { level: 14, name: "Magia de Batalha", desc: "Ao conjurar uma magia com sua ação, pode desferir um ataque com arma como ação bônus." }
        ]
      },
      {
        name: "Colégio do Glamour (Glamour)",
        icon: "✨",
        desc: "Artistas tocados pela beleza sobrenatural de Faéria, hipnotizando multidões com majestade feérica.",
        features: [
          { level: 3, name: "Manto de Inspiração", desc: "Concede PV Temporários e movimento imediato sem ataques de oportunidade para até 5 aliados." },
          { level: 6, name: "Manto de Majestade", desc: "Conjura Comando como Ação Bônus sem gastar espaços de magia a cada turno." },
          { level: 14, name: "Majestade Inabalável", desc: "Inimigos precisam passar em Salvaguarda de Carisma antes de conseguirem atacar você." }
        ]
      },
      {
        name: "Colégio da Dança (Dance)",
        icon: "💃",
        desc: "Dançarinos ágeis que lutam desarmados, desviam de golpes graciosamente e conduzem aliados pelo campo de batalha.",
        features: [
          { level: 3, name: "Acrobata Desarmado", desc: "Usa Carisma para CA sem armadura e ataca desarmado usando o dado de Inspiração Bárdica." },
          { level: 6, name: "Passos Inspiradores", desc: "Ao gastar inspiração, você e aliados adjacentes podem se mover sem provocar ataques de oportunidade." },
          { level: 14, name: "Dança da Evasão Total", desc: "Concede Evasão compartilhada para aliados próximos contra magias em área." }
        ]
      }
    ]
  },
  {
    id: "druida",
    name: "Druida",
    icon: "🐺",
    role: "Guardião da Natureza, Metamorfo e Conjurador Primitivo",
    summary: "Protetores do equilíbrio natural que assumem a Forma Selvagem de bestas terríveis e invocam a fúria dos elementos.",
    hitDie: "d8 (1d8 ou 5 PV por nível)",
    primaryAbility: "Sabedoria",
    savingThrows: ["Inteligência", "Sabedoria"],
    armorProficiencies: "Armaduras Leves, Médias e Escudos",
    weaponProficiencies: "Armas Simples",
    skillProficiencies: "Escolha 2 entre: Adestrar Animais, Arcanismo, Intuição, Medicina, Natureza, Percepção, Religião e Sobrevivência",
    progression: [
      { level: 1, prof: "+2", features: "Conjuração Primitiva, Ordem Primitiva (Mago ou Protetor)", cantrips: "2", slots: "2 (1º)" },
      { level: 2, prof: "+2", features: "Forma Selvagem (Wild Shape - 2 usos), Companheiro Selvagem", cantrips: "2", slots: "3 (1º)" },
      { level: 3, prof: "+2", features: "Subclasse de Druida (Círculo Druídico)", cantrips: "2", slots: "4 (1º), 2 (2º)" },
      { level: 4, prof: "+2", features: "Aumento no Valor de Atributo / Talento", cantrips: "3", slots: "4 (1º), 3 (2º)" },
      { level: 5, prof: "+3", features: "Forma Selvagem (Natação / Ataque Mágico)", cantrips: "3", slots: "4 (1º), 3 (2º), 2 (3º)" },
      { level: 6, prof: "+3", features: "Habilidade de Subclasse", cantrips: "3", slots: "4 (1º), 3 (2º), 3 (3º)" },
      { level: 7, prof: "+3", features: "Golpes Elementais ou Conjurador Potente", cantrips: "3", slots: "4 (1º), 3 (2º), 3 (3º), 1 (4º)" },
      { level: 8, prof: "+3", features: "Forma Selvagem (Voo)", cantrips: "3", slots: "4 (1º), 3 (2º), 3 (3º), 2 (4º)" },
      { level: 9, prof: "+4", features: "Magias de 5º Círculo", cantrips: "3", slots: "4 (1º), 3 (2º), 3 (3º), 3 (4º), 1 (5º)" },
      { level: 10, prof: "+4", features: "Habilidade de Subclasse", cantrips: "4", slots: "4 (1º), 3 (2º), 3 (3º), 3 (4º), 2 (5º)" },
      { level: 11, prof: "+4", features: "Magias de 6º Círculo", cantrips: "4", slots: "4 (1º), 3 (2º), 3 (3º), 3 (4º), 2 (5º), 1 (6º)" },
      { level: 12, prof: "+4", features: "Aumento no Valor de Atributo / Talento", cantrips: "4", slots: "4 (1º), 3 (2º), 3 (3º), 3 (4º), 2 (5º), 1 (6º)" },
      { level: 13, prof: "+5", features: "Magias de 7º Círculo", cantrips: "4", slots: "4 (1º), 3 (2º), 3 (3º), 3 (4º), 2 (5º), 1 (6º), 1 (7º)" },
      { level: 14, prof: "+5", features: "Habilidade de Subclasse", cantrips: "4", slots: "4 (1º), 3 (2º), 3 (3º), 3 (4º), 2 (5º), 1 (6º), 1 (7º)" },
      { level: 15, prof: "+5", features: "Magias de 8º Círculo", cantrips: "4", slots: "4 (1º), 3 (2º), 3 (3º), 3 (4º), 2 (5º), 1 (6º), 1 (7º), 1 (8º)" },
      { level: 16, prof: "+5", features: "Aumento no Valor de Atributo / Talento", cantrips: "4", slots: "4 (1º), 3 (2º), 3 (3º), 3 (4º), 2 (5º), 1 (6º), 1 (7º), 1 (8º)" },
      { level: 17, prof: "+6", features: "Magias de 9º Círculo (Tempestade da Vingança, Forma de Dragão)", cantrips: "4", slots: "4 (1º), 3 (2º), 3 (3º), 3 (4º), 2 (5º), 1 (6º), 1 (7º), 1 (8º), 1 (9º)" },
      { level: 18, prof: "+6", features: "Corpo Atemporal, Magia de Fera", cantrips: "4", slots: "Slots Padrão" },
      { level: 19, prof: "+6", features: "Talento Épico", cantrips: "4", slots: "Slots Padrão" },
      { level: 20, prof: "+6", features: "Arquidruida (Forma Selvagem ilimitada e conversão em cura)", cantrips: "4", slots: "Slots Padrão" }
    ],
    features: [
      {
        level: 1,
        name: "Conjuração Primitiva (Spellcasting)",
        type: "Conjurador Natural",
        desc: "Você canaliza o poder dos elementos e da vida primitiva usando **Sabedoria** como atributo de conjuração e pode conjurar rituais da natureza."
      },
      {
        level: 1,
        name: "Ordem Primitiva (Primal Order)",
        type: "Especialização Druídica",
        desc: "Escolha uma vocação da natureza:\n• **Mago**: Ganha um truque adicional de druida e adiciona Sabedoria em testes de Natureza e Medicina.\n• **Protetor**: Ganha proficiência com Armaduras Médias e Armas Marciais."
      },
      {
        level: 2,
        name: "Forma Selvagem (Wild Shape)",
        type: "Metamorfose",
        desc: "Com uma Ação Bônus, você se transforma magicamente na forma de uma besta que já tenha visto. Você assume os PV temporários da besta, suas habilidades físicas e ataques, mantendo sua mente, Sabedoria e salvaguardas."
      },
      {
        level: 2,
        name: "Companheiro Selvagem (Wild Companion)",
        type: "Invocação",
        desc: "Você pode gastar 1 uso de Forma Selvagem para conjurar a magia *Encontrar Familiar* instantaneamente sem componentes materiais."
      },
      {
        level: 7,
        name: "Golpes Elementais (Elemental Strikes)",
        type: "Dano Primitivo",
        desc: "Seus ataques de besta na Forma Selvagem e seus ataques com armas infundidas com a natureza causam **+1d8 de dano elemental** (frio, fogo, elétrico ou ácido)."
      },
      {
        level: 18,
        name: "Magia de Fera (Beast Spells)",
        type: "Passiva",
        desc: "Você pode conjurar a maioria das suas magias de druida enquanto estiver transformado em Forma Selvagem."
      },
      {
        level: 20,
        name: "Arquidruida (Archdruid)",
        type: "Ápice Primitivo",
        desc: "Você pode usar a Forma Selvagem um número ilimitado de vezes. Além disso, pode converter usos de forma em recuperação de PV e espaços de magia."
      }
    ],
    subclasses: [
      {
        name: "Círculo da Lua (Circle of the Moon)",
        icon: "🌙",
        desc: "Mestres absolutos da Forma Selvagem, transformando-se em predadores elementais de ND altíssimo como ação bônus.",
        features: [
          { level: 3, name: "Formas de Combate", desc: "Transforma-se em bestas de ND superior com CA aumentada (13 + Sabedoria) e PV Temporários extras de 3x nível de druida." },
          { level: 6, name: "Golpes Lunares Primordiais", desc: "Seus ataques de besta causam dano Radiante e superam resistências a armas não mágicas." },
          { level: 10, name: "Teleporte Luz da Lua", desc: "Teleporta-se até 9 metros como ação bônus após acertar um ataque na Forma Selvagem." }
        ]
      },
      {
        name: "Círculo da Terra (Circle of the Land)",
        icon: "🌍",
        desc: "Conjuradores primitivos ligados aos biomas do mundo (Ártico, Costa, Deserto, Floresta, Montanha, Pântano).",
        features: [
          { level: 3, name: "Magias da Terra & Recuperação Natural", desc: "Aprende magias adicionais do seu bioma e recupera espaços de magia em descanso curto." },
          { level: 6, name: "Passo da Terra", desc: "Imunidade a terreno difícil e resistência a veneno/doença." },
          { level: 10, name: "Santuário da Natureza", desc: "Criaturas do tipo besta e planta hesitam antes de atacá-lo." }
        ]
      },
      {
        name: "Círculo das Estrelas (Circle of the Stars)",
        icon: "✨",
        desc: "Navegadores astrais que utilizam cartas celestes para assumir formas estelares brilhantes (Arqueiro, Cálice, Dragão).",
        features: [
          { level: 3, name: "Forma Estelar", desc: "Assume constelações brilhantes que disparam flechas de luz (*Arqueiro*), amplificam curas (*Cálice*) ou garantem concentração (*Dragão*)." },
          { level: 6, name: "Presságio Cósmico (Weal & Woe)", desc: "Rola dados no início do dia para adicionar bônus a aliados ou subtrair de inimigos." },
          { level: 10, name: "Estrelas Cintilantes", desc: "Ganha deslocamento de voo e resistência a danos físicos na Forma Estelar." }
        ]
      },
      {
        name: "Círculo do Mar (Circle of the Sea)",
        icon: "🌊",
        desc: "Guardiões dos oceanos e tempestades que manifestam correntes marítimas, neblinas e relâmpagos ao redor do corpo.",
        features: [
          { level: 3, name: "Fúria das Ondas", desc: "Cria uma tempestade ao redor de si causando dano elétrico e empurrando inimigos." },
          { level: 6, name: "Afinidade Aquática", desc: "Deslocamento de natação e respiração sob a água contínua." },
          { level: 10, name: "Correnteza Protetora", desc: "Resistência a dano de frio, elétrico e trovejante." }
        ]
      }
    ]
  },
  {
    id: "feiticeiro",
    name: "Feiticeiro",
    icon: "⚡",
    role: "Conjurador Inato e Mestre da Metamagia",
    summary: "Conjuradores cujo poder mágico não vem de livros ou deuses, mas corre em seu próprio sangue através de linhagens dracônicas ou do caos primordial.",
    hitDie: "d6 (1d6 ou 4 PV por nível)",
    primaryAbility: "Carisma",
    savingThrows: ["Constituição", "Carisma"],
    armorProficiencies: "Nenhuma",
    weaponProficiencies: "Armas Simples (Adagas, Dardos, Fundas, Bordões, Bestas Leves)",
    skillProficiencies: "Escolha 2 entre: Arcanismo, Enganação, Intuição, Intimidação, Persuasão e Religião",
    progression: [
      { level: 1, prof: "+2", features: "Feitiçaria Inata (Innate Sorcery), Conjuração", sp: "0", slots: "2 (1º)" },
      { level: 2, prof: "+2", features: "Fonte de Magia (Pontos de Feitiçaria), Metamagia (2 opções)", sp: "2", slots: "3 (1º)" },
      { level: 3, prof: "+2", features: "Subclasse de Feiticeiro (Origem Mágica)", sp: "3", slots: "4 (1º), 2 (2º)" },
      { level: 4, prof: "+2", features: "Aumento no Valor de Atributo / Talento", sp: "4", slots: "4 (1º), 3 (2º)" },
      { level: 5, prof: "+3", features: "Feitiçaria Inata Aprimorada", sp: "5", slots: "4 (1º), 3 (2º), 2 (3º)" },
      { level: 6, prof: "+3", features: "Habilidade de Subclasse", sp: "6", slots: "4 (1º), 3 (2º), 3 (3º)" },
      { level: 7, prof: "+3", features: "Magias de 4º Círculo, Metamagia Adicional", sp: "7", slots: "4 (1º), 3 (2º), 3 (3º), 1 (4º)" },
      { level: 8, prof: "+3", features: "Aumento no Valor de Atributo / Talento", sp: "8", slots: "4 (1º), 3 (2º), 3 (3º), 2 (4º)" },
      { level: 9, prof: "+4", features: "Magias de 5º Círculo", sp: "9", slots: "4 (1º), 3 (2º), 3 (3º), 3 (4º), 1 (5º)" },
      { level: 10, prof: "+4", features: "Habilidade de Subclasse", sp: "10", slots: "4 (1º), 3 (2º), 3 (3º), 3 (4º), 2 (5º)" },
      { level: 11, prof: "+4", features: "Magias de 6º Círculo", sp: "11", slots: "4 (1º), 3 (2º), 3 (3º), 3 (4º), 2 (5º), 1 (6º)" },
      { level: 12, prof: "+4", features: "Aumento no Valor de Atributo / Talento", sp: "12", slots: "4 (1º), 3 (2º), 3 (3º), 3 (4º), 2 (5º), 1 (6º)" },
      { level: 13, prof: "+5", features: "Magias de 7º Círculo, Metamagia Adicional", sp: "13", slots: "4 (1º), 3 (2º), 3 (3º), 3 (4º), 2 (5º), 1 (6º), 1 (7º)" },
      { level: 14, prof: "+5", features: "Habilidade de Subclasse", sp: "14", slots: "4 (1º), 3 (2º), 3 (3º), 3 (4º), 2 (5º), 1 (6º), 1 (7º)" },
      { level: 15, prof: "+5", features: "Magias de 8º Círculo", sp: "15", slots: "4 (1º), 3 (2º), 3 (3º), 3 (4º), 2 (5º), 1 (6º), 1 (7º), 1 (8º)" },
      { level: 16, prof: "+5", features: "Aumento no Valor de Atributo / Talento", sp: "16", slots: "4 (1º), 3 (2º), 3 (3º), 3 (4º), 2 (5º), 1 (6º), 1 (7º), 1 (8º)" },
      { level: 17, prof: "+6", features: "Magias de 9º Círculo", sp: "17", slots: "4 (1º), 3 (2º), 3 (3º), 3 (4º), 2 (5º), 1 (6º), 1 (7º), 1 (8º), 1 (9º)" },
      { level: 18, prof: "+6", features: "Habilidade de Subclasse", sp: "18", slots: "Slots Padrão" },
      { level: 19, prof: "+6", features: "Talento Épico", sp: "19", slots: "Slots Padrão" },
      { level: 20, prof: "+6", features: "Apoteose Feiticeira (Recupera 4 pontos de feitiçaria em descanso curto)", sp: "20", slots: "Slots Padrão" }
    ],
    features: [
      {
        level: 1,
        name: "Feitiçaria Inata (Innate Sorcery)",
        type: "Ação Bônus / Estado de Poder",
        desc: "Como Ação Bônus, você libera a magia pura do seu corpo por 1 minuto. Enquanto estiver ativo:\n• A CD das suas magias de feiticeiro **aumenta em +1**.\n• Você tem **Vantagem em jogadas de ataque com magias de feiticeiro**.\n• Pode usar 2 vezes por descanso longo."
      },
      {
        level: 1,
        name: "Conjuração Inata (Spellcasting)",
        type: "Conjurador Inato",
        desc: "Você conjura magias da lista de Feiticeiro utilizando **Carisma** como atributo de conjuração, canalizando energia através de seu próprio corpo ou foco arcano."
      },
      {
        level: 2,
        name: "Fonte de Magia (Font of Magic)",
        type: "Pontos de Feitiçaria",
        desc: "Você possui uma reserva de Pontos de Feitiçaria iguais ao seu nível de feiticeiro. Pode usá-los para criar espaços de magia adicionais ou converter espaços em pontos."
      },
      {
        level: 2,
        name: "Metamagia (Metamagic)",
        type: "Moldar Magia",
        desc: "Você molda suas magias gastando Pontos de Feitiçaria:\n• **Magia Acelerada (Quicken)**: Conjura uma magia de 1 Ação como Ação Bônus.\n• **Magia Gêmea (Twinned)**: Adiciona um segundo alvo na magia.\n• **Magia Sutil (Subtle)**: Conjura sem componentes Verbais ou Somáticos.\n• **Magia Cuidadosa (Careful)**: Protege aliados de efeitos em área.\n• **Magia Distante (Distant)**: Dobra o alcance."
      },
      {
        level: 5,
        name: "Feitiçaria Inata Aprimorada",
        type: "Passiva",
        desc: "Enquanto sua Feitiçaria Inata estiver ativa, você pode aplicar duas opções de Metamagia na mesma magia conjurada!"
      },
      {
        level: 20,
        name: "Apoteose Feiticeira (Sorcerous Restoration)",
        type: "Ápice Arcano",
        desc: "Ao terminar um Descanso Curto ou rolar Iniciativa sem Pontos de Feitiçaria, você recupera **4 Pontos de Feitiçaria** imediatamente."
      }
    ],
    subclasses: [
      {
        name: "Feitiçaria Dracônica (Draconic Sorcery)",
        icon: "🐉",
        desc: "Herdeiros do sangue de dragões nobres, desenvolvendo escamas blindadas, asas funcionais e sopro elemental.",
        features: [
          { level: 3, name: "Resiliência Dracônica", desc: "Sua CA sem armadura é 13 + Des e você ganha +1 PV máximo por nível de feiticeiro." },
          { level: 6, name: "Afinidade Elemental", desc: "Adiciona Carisma no dano do elemento do seu dragão e ganha resistência a esse elemento." },
          { level: 14, name: "Asas de Dragão", desc: "Manifesta asas dracônicas com deslocamento de voo de 18m." }
        ]
      },
      {
        name: "Magia Selvagem (Wild Magic)",
        icon: "🎲",
        desc: "Condutores do caos puro que desencadeiam surtos de magia imprevisíveis com efeitos cósmicos.",
        features: [
          { level: 3, name: "Surto de Magia Selvagem & Marés de Caos", desc: "Ganha Vantagem imediata em qualquer rolagem e rola na Tabela de Surto Selvagem." },
          { level: 6, name: "Dobrar a Sorte", desc: "Gasta pontos de feitiçaria para adicionar ou subtrair 1d4 de rolagens de outras criaturas." },
          { level: 14, name: "Caos Controlado", desc: "Rola duas vezes na tabela de surto e escolhe qual resultado prefere aplicar." }
        ]
      },
      {
        name: "Feitiçaria Aberrante (Aberrant Sorcery)",
        icon: "🐙",
        desc: "Mentes tocadas pelo Reino Distante e aberrações astrais, empunhando poderes psíquicos e tentáculos mentais.",
        features: [
          { level: 3, name: "Magias Psiônicas & Telepatia", desc: "Comunicação mental com criaturas e conjuração sutil psíquica sem componentes." },
          { level: 6, name: "Defesas Psíquicas", desc: "Resistência a dano Psíquico e Vantagem contra ser Enfeitiçado/Amedrontado." },
          { level: 14, name: "Carne Revelada", desc: "Transforma o corpo em tentáculos que voam, nadam e atravessam frestas minúsculas." }
        ]
      },
      {
        name: "Feitiçaria do Relógio (Clockwork Sorcery)",
        icon: "⚙️",
        desc: "Agentes da ordem cósmica de Mechanus que neutralizam o acaso e erguem escudos protetores perfeitos.",
        features: [
          { level: 3, name: "Restaurar o Equilíbrio", desc: "Com uma reação, anula qualquer Vantagem ou Desvantagem em uma rolagem a até 18m." },
          { level: 6, name: "Bastião da Lei", desc: "Cria um escudo de força que reduz dano sofrido por você ou aliados." },
          { level: 14, name: "Transe da Ordem", desc: "Qualquer rolagem sua no d20 de 9 ou menor se torna automaticamente um 10." }
        ]
      }
    ]
  },
  {
    id: "bruxo",
    name: "Bruxo",
    icon: "👁️",
    role: "Pactuário Sobrenatural e Conjurador de Rajadas Místicas",
    summary: "Barganhadores de segredos ocultos juramentados a patronos cósmicos, conjurando com Magia de Pacto sempre no círculo máximo.",
    hitDie: "d8 (1d8 ou 5 PV por nível)",
    primaryAbility: "Carisma",
    savingThrows: ["Sabedoria", "Carisma"],
    armorProficiencies: "Armaduras Leves",
    weaponProficiencies: "Armas Simples",
    skillProficiencies: "Escolha 2 entre: Arcanismo, Enganação, História, Intimidação, Investigação, Natureza e Religião",
    progression: [
      { level: 1, prof: "+2", features: "Magia de Pacto, Patrono Sobrenatural, Truque Rajada Mística", cantrips: "2", pactSlots: "1 (1º)" },
      { level: 2, prof: "+2", features: "Invocações Místicas (2 invocações)", cantrips: "2", pactSlots: "2 (1º)" },
      { level: 3, prof: "+2", features: "Subclasse de Bruxo, Dádiva do Pacto (Lâmina, Tomo ou Corrente)", cantrips: "2", pactSlots: "2 (2º)" },
      { level: 4, prof: "+2", features: "Aumento no Valor de Atributo / Talento", cantrips: "3", pactSlots: "2 (2º)" },
      { level: 5, prof: "+3", features: "Invocações Místicas (3 invocações)", cantrips: "3", pactSlots: "2 (3º)" },
      { level: 6, prof: "+3", features: "Habilidade de Subclasse", cantrips: "3", pactSlots: "2 (3º)" },
      { level: 7, prof: "+3", features: "Invocações Místicas (4 invocações)", cantrips: "3", pactSlots: "2 (4º)" },
      { level: 8, prof: "+3", features: "Aumento no Valor de Atributo / Talento", cantrips: "3", pactSlots: "2 (4º)" },
      { level: 9, prof: "+4", features: "Invocações Místicas (5 invocações)", cantrips: "3", pactSlots: "2 (5º)" },
      { level: 10, prof: "+4", features: "Habilidade de Subclasse", cantrips: "4", pactSlots: "2 (5º)" },
      { level: 11, prof: "+4", features: "Arcano Secreto (Magia de 6º Círculo 1x/dia)", cantrips: "4", pactSlots: "3 (5º)" },
      { level: 12, prof: "+4", features: "Aumento no Valor de Atributo / Talento, Invocações (6)", cantrips: "4", pactSlots: "3 (5º)" },
      { level: 13, prof: "+5", features: "Arcano Secreto (Magia de 7º Círculo 1x/dia)", cantrips: "4", pactSlots: "3 (5º)" },
      { level: 14, prof: "+5", features: "Habilidade de Subclasse", cantrips: "4", pactSlots: "3 (5º)" },
      { level: 15, prof: "+5", features: "Arcano Secreto (Magia de 8º Círculo 1x/dia), Invocações (7)", cantrips: "4", pactSlots: "3 (5º)" },
      { level: 16, prof: "+5", features: "Aumento no Valor de Atributo / Talento", cantrips: "4", pactSlots: "3 (5º)" },
      { level: 17, prof: "+6", features: "Arcano Secreto (Magia de 9º Círculo 1x/dia), 4 Slots de Pacto", cantrips: "4", pactSlots: "4 (5º)" },
      { level: 18, prof: "+6", features: "Invocações Místicas (8 invocações)", cantrips: "4", pactSlots: "4 (5º)" },
      { level: 19, prof: "+6", features: "Talento Épico", cantrips: "4", pactSlots: "4 (5º)" },
      { level: 20, prof: "+6", features: "Mestre do Pacto (Recupera todos os espaços de pacto em 1 minuto)", cantrips: "4", pactSlots: "4 (5º)" }
    ],
    features: [
      {
        level: 1,
        name: "Magia de Pacto (Pact Magic)",
        type: "Conjurador de Recarga Rápida",
        desc: "Diferente de outras classes, seus espaços de magia são sempre conjurados no **círculo mais alto possível** (até 5º círculo) e são **100% recuperados em Descansos Curtos**!"
      },
      {
        level: 1,
        name: "Patrono Sobrenatural (Otherworldly Patron)",
        type: "Pacto Oculto",
        desc: "Você firma um contrato místico com um ser de poder incomensurável, ganhando magias preparadas adicionais e dons temáticos."
      },
      {
        level: 2,
        name: "Invocações Místicas (Eldritch Invocations)",
        type: "Customização Oculta",
        desc: "Você desbloqueia talentos permanentes como: *Rajada Agonizante* (+Carisma no dano), *Armadura de Sombras* (Armadura Arcana à vontade), *Visão Diabólica* (enxerga na escuridão mágica 36m), *Lâmina Sedenta* (Ataque Extra com arma do pacto)."
      },
      {
        level: 3,
        name: "Dádiva do Pacto (Pact Boon)",
        type: "Dádiva Mística",
        desc: "Seu patrono lhe concede um presente exclusivo:\n• **Pacto da Lâmina**: Materializa qualquer arma corpo a corpo mágica usando Carisma para atacar.\n• **Pacto do Tomo**: Um grimório das sombras com truques e rituais de qualquer classe.\n• **Pacto da Corrente**: Um familiar especial poderoso (Imp, Pseudodragão, Sprite ou Quasit)."
      },
      {
        level: 11,
        name: "Arcano Secreto (Mystic Arcanum)",
        type: "Magia Épica",
        desc: "Seu patrono revela segredos arcanos superiores. Você escolhe uma magia de 6º círculo (e depois de 7º, 8º e 9º nos níveis seguintes) para conjurar **uma vez por descanso longo sem gastar espaços de magia**."
      },
      {
        level: 20,
        name: "Mestre do Pacto (Eldritch Master)",
        type: "Ápice Oculto",
        desc: "Você pode implorar a seu patrono para recuperar **todos os seus espaços de Magia de Pacto gastos** em apenas 1 minuto de concentração uma vez por descanso longo."
      }
    ],
    subclasses: [
      {
        name: "Patrono Corruptor (The Fiend)",
        icon: "😈",
        desc: "Pactuários de arquidemônios dos Nove Infernos, ganhando vitalidade ao matar inimigos e invocando a sorte do diabo.",
        features: [
          { level: 3, name: "Bênção do Obscuro", desc: "Ao reduzir um inimigo a 0 PV, você ganha PV Temporários iguais ao seu Carisma + nível de bruxo." },
          { level: 6, name: "Sorte do Próprio Diabo", desc: "Adiciona 1d10 em uma salvaguarda ou teste de atributo que falharia." },
          { level: 10, name: "Resiliência Diabólica", desc: "Escolhe um tipo de dano a cada descanso para ter Resistência garantida." },
          { level: 14, name: "Arremessar no Inferno (Hurl Through Hell)", desc: "Ao acertar um ataque, bane o alvo por 1 rodada pelos Nove Infernos, causando 10d10 de dano psíquico!" }
        ]
      },
      {
        name: "Patrono Arquifada (The Archfey)",
        icon: "🌸",
        desc: "Servos de rainhas feéricas da corte do Crepúsculo, teleportando-se pelo campo de batalha em névoas ilusórias.",
        features: [
          { level: 3, name: "Presença Feérica & Passo Nebuloso", desc: "Pode conjurar Passo Nebuloso sem gastar espaços de magia várias vezes ao dia e encanta/amedronta alvos ao surgir." },
          { level: 6, name: "Fuga Nebulosa", desc: "Com uma reação ao sofrer dano, fica invisível e se teleporta 18 metros." },
          { level: 10, name: "Mente Sedutora", desc: "Imunidade a ser Enfeitiçado e reflete o encanto de volta no conjurador inimigo." }
        ]
      },
      {
        name: "Patrono Grande Antigo (The Great Old One)",
        icon: "👁️",
        desc: "Acólitos de entidades cósmicas como Cthulhu e Yog-Sothoth, despertando telepatia e loucura incompreensível.",
        features: [
          { level: 3, name: "Mente Desperta", desc: "Comunicação telepática universal com qualquer criatura a até 9 metros." },
          { level: 6, name: "Escudo Psíquico", desc: "Imunidade a leitura de pensamentos e reflete metade do dano psíquico no atacante." },
          { level: 14, name: "Criar Servo Mental", desc: "Toca uma criatura incapacitada e a transforma em um servo telepático leal a você." }
        ]
      },
      {
        name: "Patrono Celestial (The Celestial)",
        icon: "👼",
        desc: "Emissários de serafins e solares da luz, concedendo cura radiante e chamas sagradas aos seus aliados.",
        features: [
          { level: 3, name: "Luz Curativa", desc: "Reserva de dados d6 iguais a 1 + nível de bruxo para curar aliados como ação bônus a até 18m." },
          { level: 6, name: "Alma Radiante", desc: "Resistência a dano Radiante e adiciona Carisma em magias de fogo e radiantes." },
          { level: 14, name: "Ressurreição Radiante", desc: "Ao cair a 0 PV, explode em luz radiante causando dano nos inimigos e retornando com metade da vida." }
        ]
      }
    ]
  },
  {
    id: "monge",
    name: "Monge",
    icon: "🥋",
    role: "Mestre das Artes Marciais e Energia do Foco (Ki)",
    summary: "Guerreiros ascetas que transformam seus corpos na arma perfeita, manipulando a energia mística do Foco para desferir rajadas de golpes estonteantes.",
    hitDie: "d8 (1d8 ou 5 PV por nível)",
    primaryAbility: "Destreza e Sabedoria",
    savingThrows: ["Força", "Destreza"],
    armorProficiencies: "Nenhuma",
    weaponProficiencies: "Armas Simples e Armas Marciais com a propriedade Leve",
    skillProficiencies: "Escolha 2 entre: Acrobacia, Atletismo, História, Intuição, Religião e Furtividade",
    progression: [
      { level: 1, prof: "+2", features: "Artes Marciais (1d6), Defesa sem Armadura", die: "1d6", focus: "0" },
      { level: 2, prof: "+2", features: "Pontos de Foco (Ki), Rajada de Golpes, Defesa Paciente, Passo do Vento", die: "1d6", focus: "2" },
      { level: 3, prof: "+2", features: "Subclasse de Monge, Defletir Ataques", die: "1d6", focus: "3" },
      { level: 4, prof: "+2", features: "Aumento no Valor de Atributo / Talento, Queda Lenta", die: "1d6", focus: "4" },
      { level: 5, prof: "+3", features: "Ataque Extra, Golpe Atordoante (Stunning Strike)", die: "1d8", focus: "5" },
      { level: 6, prof: "+3", features: "Habilidade de Subclasse, Golpes Fortalecidos por Foco (Dano de Força)", die: "1d8", focus: "6" },
      { level: 7, prof: "+3", features: "Evasão (Evasion)", die: "1d8", focus: "7" },
      { level: 8, prof: "+3", features: "Aumento no Valor de Atributo / Talento", die: "1d8", focus: "8" },
      { level: 9, prof: "+4", features: "Movimento sem Armadura Aprimorado (Anda em paredes e água)", die: "1d8", focus: "9" },
      { level: 10, prof: "+4", features: "Habilidade de Subclasse, Auto-Restauração", die: "1d8", focus: "10" },
      { level: 11, prof: "+4", features: "Artes Marciais (1d10)", die: "1d10", focus: "11" },
      { level: 12, prof: "+4", features: "Aumento no Valor de Atributo / Talento", die: "1d10", focus: "12" },
      { level: 13, prof: "+5", features: "Defletir Energia (Deflete qualquer tipo de ataque à distância)", die: "1d10", focus: "13" },
      { level: 14, prof: "+5", features: "Alma de Diamante (Proficiência em TODAS as salvaguardas!)", die: "1d10", focus: "14" },
      { level: 15, prof: "+5", features: "Corpo Perfeito", die: "1d10", focus: "15" },
      { level: 16, prof: "+5", features: "Aumento no Valor de Atributo / Talento", die: "1d10", focus: "16" },
      { level: 17, prof: "+6", features: "Artes Marciais (1d12)", die: "1d12", focus: "17" },
      { level: 18, prof: "+6", features: "Corpo Vazio (Invisibilidade e resistência a quase todos os danos)", die: "1d12", focus: "18" },
      { level: 19, prof: "+6", features: "Talento Épico", die: "1d12", focus: "19" },
      { level: 20, prof: "+6", features: "Poder do Foco Perfeito (Recupera foco e +4 Sabedoria/Destreza)", die: "1d12", focus: "20" }
    ],
    features: [
      {
        level: 1,
        name: "Artes Marciais (Martial Arts)",
        type: "Combate Desarmado",
        desc: "Você pode usar **Destreza no lugar de Força** para ataques e danos desarmados. O dado de dano começa em 1d6 e sobe até 1d12. Sempre que atacar com arma de monge ou desarmado, você pode desferir um **Ataque Desarmado adicional com Ação Bônus**."
      },
      {
        level: 1,
        name: "Defesa sem Armadura (Unarmored Defense)",
        type: "Passiva",
        desc: "Enquanto não estiver vestindo armadura e sem escudo, sua Classe de Armadura (CA) é igual a **10 + Destreza + Sabedoria**."
      },
      {
        level: 2,
        name: "Pontos de Foco (Focus Points / Ki)",
        type: "Energia Mística",
        desc: "Você tem pontos de foco iguais ao seu nível de monge (recuperados em Descanso Curto). Pode gastar foco para:\n• **Rajada de Golpes (Flurry of Blows)**: Dois ataques desarmados com Ação Bônus.\n• **Defesa Paciente (Patient Defense)**: Desengajar e Esquivar como Ação Bônus.\n• **Passo do Vento (Step of the Wind)**: Desengajar e Correr com dobro de salto como Ação Bônus."
      },
      {
        level: 3,
        name: "Defletir Ataques (Deflect Attacks)",
        type: "Reação",
        desc: "Com uma reação ao ser atingido por um ataque corpo a corpo ou à distância, você reduz o dano em **1d10 + Destreza + nível de monge**. Se reduzir o dano a 0, pode arremessar o projétil ou contra-atacar imediatamente!"
      },
      {
        level: 4,
        name: "Queda Lenta (Slow Fall)",
        type: "Reação",
        desc: "Ao cair, você pode usar sua reação para reduzir o dano de queda sofrido em um valor igual a **5x o seu nível de monge**."
      },
      {
        level: 5,
        name: "Golpe Atordoante (Stunning Strike)",
        type: "Controle de Combate",
        desc: "Ao acertar uma criatura com ataque desarmado ou arma de monge, você pode gastar 1 ponto de foco para forçá-la a uma salvaguarda de Constituição. Se falhar, o alvo fica **Atordoado (Stunned)** até o início do seu próximo turno."
      },
      {
        level: 14,
        name: "Alma de Diamante (Diamond Soul)",
        type: "Sobrevivência Suprema",
        desc: "Você ganha **proficiência em TODAS as salvaguardas**. Além disso, se falhar em uma salvaguarda, pode gastar 1 ponto de foco para rolar o teste novamente!"
      }
    ],
    subclasses: [
      {
        name: "Guerreiro da Mão Aberta (Open Hand)",
        icon: "✋",
        desc: "Mestres absolutos do combate desarmado puro, derrubando, empurrando e paralisando corações com a Palma Trêmula.",
        features: [
          { level: 3, name: "Técnica da Mão Aberta", desc: "Ao acertar a Rajada de Golpes, impõe um efeito no alvo: derruba no chão, empurra 4,5m ou impede reações." },
          { level: 6, name: "Completude Corporal", desc: "Cura a si mesmo em 3x nível de monge como ação bônus 1x ao dia." },
          { level: 11, name: "Tranquilidade", desc: "Ganha o efeito da magia Santuário permanentemente após descansos." },
          { level: 17, name: "Palma Trêmula (Quivering Palm)", desc: "Implanta vibrações letais no corpo do alvo; ao ativá-las, o alvo deve passar em salvaguarda de Constituição ou cai a 0 PV imediatamente!" }
        ]
      },
      {
        name: "Guerreiro das Sombras (Shadow)",
        icon: "🌑",
        desc: "Ninjas místicos que manipulam as trevas, teleportando-se de sombra em sombra para assassinar alvos silenciosamente.",
        features: [
          { level: 3, name: "Artes das Sombras", desc: "Conjura Escuridão, Visão no Escuro, Passos sem Pegadas e Silêncio gastando pontos de foco." },
          { level: 6, name: "Passo das Sombras", desc: "Teleporta-se até 18 metros de uma sombra para outra como ação bônus e ganha Vantagem no próximo ataque." },
          { level: 17, name: "Oportunista", desc: "Desfere um ataque de reação imediato sempre que uma criatura a até 1,5m for atacada por outro aliado." }
        ]
      },
      {
        name: "Guerreiro dos Elementos (Elements)",
        icon: "🔥",
        desc: "Monges que canalizam fogo, água, terra e ar através de seus golpes marciais como batedores elementais.",
        features: [
          { level: 3, name: "Sintonia Elemental", desc: "Seus ataques desarmados ganham alcance de 4,5m e causam dano elemental (fogo, frio, elétrico ou ácido)." },
          { level: 6, name: "Explosão Elemental", desc: "Dispara esferas de fogo ou cones de gelo em área gastando pontos de foco." },
          { level: 17, name: "Forma Elemental Suprema", desc: "Ganha deslocamento de voo e natação e resistência a danos elementais." }
        ]
      },
      {
        name: "Guerreiro da Misericórdia (Mercy)",
        icon: "🎭",
        desc: "Médicos mascarados que manipulam o fluxo vital de cura e as mãos sombrias do dano necrótico aflitivo.",
        features: [
          { level: 3, name: "Mãos da Cura & Mãos do Dano", desc: "Cura aliados com toque de foco ou causa dano necrótico extra que envenena sem teste no nível 6." },
          { level: 11, name: "Toque Restaurador", desc: "Cura condições de Cegueira, Surdez, Paralisia, Envenenamento e Atordoamento." },
          { level: 17, name: "Mão da Ressurreição Suprema", desc: "Toca uma criatura morta nas últimas 24 horas e a ressuscita sem gastar componentes materiais!" }
        ]
      }
    ]
  },
  {
    id: "patrulheiro",
    name: "Patrulheiro",
    icon: "🏹",
    role: "Explorador da Natureza, Rastreador e Franco-Atirador",
    summary: "Guerreiros da fronteira selvagem especialistas em rastreamento, magias de caça (*Marca do Caçador*), furtividade e companheiros animais.",
    hitDie: "d10 (1d10 ou 6 PV por nível)",
    primaryAbility: "Destreza e Sabedoria",
    savingThrows: ["Força", "Destreza"],
    armorProficiencies: "Armaduras Leves, Médias e Escudos",
    weaponProficiencies: "Armas Simples e Armas Marciais",
    skillProficiencies: "Escolha 3 entre: Adestrar Animais, Atletismo, Furtividade, Intuição, Investigação, Natureza, Percepção e Sobrevivência",
    weaponMastery: "2 armas à sua escolha",
    progression: [
      { level: 1, prof: "+2", features: "Marca do Caçador (Hunter's Mark gratuita), Conjuração, Maestria", slots: "2 (1º)" },
      { level: 2, prof: "+2", features: "Estilo de Luta, Inimigo Favorito Aprimorado", slots: "2 (1º)" },
      { level: 3, prof: "+2", features: "Subclasse de Patrulheiro (Arquétipo), Conhecimento Primevo", slots: "3 (1º)" },
      { level: 4, prof: "+2", features: "Aumento no Valor de Atributo / Talento", slots: "3 (1º)" },
      { level: 5, prof: "+3", features: "Ataque Extra", slots: "4 (1º), 2 (2º)" },
      { level: 6, prof: "+3", features: "Andarilho (Deslocamento +3m, natação e escalada)", slots: "4 (1º), 2 (2º)" },
      { level: 7, prof: "+3", features: "Habilidade de Subclasse", slots: "4 (1º), 3 (2º)" },
      { level: 8, prof: "+3", features: "Aumento no Valor de Atributo / Talento", slots: "4 (1º), 3 (2º)" },
      { level: 9, prof: "+4", features: "Especialista em Perícias (Expertise)", slots: "4 (1º), 3 (2º), 2 (3º)" },
      { level: 10, prof: "+4", features: "Desaparecer (Fica invisível como ação bônus)", slots: "4 (1º), 3 (2º), 2 (3º)" },
      { level: 11, prof: "+4", features: "Habilidade de Subclasse", slots: "4 (1º), 3 (2º), 3 (3º)" },
      { level: 12, prof: "+4", features: "Aumento no Valor de Atributo / Talento", slots: "4 (1º), 3 (2º), 3 (3º)" },
      { level: 13, prof: "+5", features: "Magias de 4º Círculo", slots: "4 (1º), 3 (2º), 3 (3º), 1 (4º)" },
      { level: 14, prof: "+5", features: "Sentidos Ferais (Não sofre desvantagem contra invisíveis)", slots: "4 (1º), 3 (2º), 3 (3º), 1 (4º)" },
      { level: 15, prof: "+5", features: "Habilidade de Subclasse", slots: "4 (1º), 3 (2º), 3 (3º), 2 (4º)" },
      { level: 16, prof: "+5", features: "Aumento no Valor de Atributo / Talento", slots: "4 (1º), 3 (2º), 3 (3º), 2 (4º)" },
      { level: 17, prof: "+6", features: "Magias de 5º Círculo", slots: "4 (1º), 3 (2º), 3 (3º), 3 (4º), 1 (5º)" },
      { level: 18, prof: "+6", features: "Marca Precisa (Vantagem em ataques contra a presa marcada)", slots: "4 (1º), 3 (2º), 3 (3º), 3 (4º), 1 (5º)" },
      { level: 19, prof: "+6", features: "Talento Épico", slots: "4 (1º), 3 (2º), 3 (3º), 3 (4º), 2 (5º)" },
      { level: 20, prof: "+6", features: "Matador de Inimigos (Soma Sabedoria no dano de todos os ataques)", slots: "4 (1º), 3 (2º), 3 (3º), 3 (4º), 2 (5º)" }
    ],
    features: [
      {
        level: 1,
        name: "Marca do Caçador (Hunter's Mark)",
        type: "Magia Inata de Caça",
        desc: "Você pode conjurar a magia *Marca do Caçador* várias vezes ao dia **sem gastar espaços de magia**. Ela adiciona **+1d6 de dano de força** sempre que você acertar o alvo marcado e concede Vantagem em testes para rastreá-lo."
      },
      {
        level: 1,
        name: "Conjuração de Patrulheiro (Spellcasting)",
        type: "Conjurador da Natureza",
        desc: "Você conjura magias de exploração, suporte e combate da lista de Patrulheiro usando **Sabedoria** como atributo de conjuração."
      },
      {
        level: 1,
        name: "Maestria em Armas (Weapon Mastery)",
        type: "Passiva",
        desc: "Você aprende as propriedades de maestria de 2 armas à sua escolha (trocadas em descanso longo)."
      },
      {
        level: 2,
        name: "Estilo de Luta (Fighting Style)",
        type: "Passiva",
        desc: "Você adota uma especialidade marcial como Arquearia (+2 em ataques à distância), Luta com Duas Armas, Defesa ou Duelo."
      },
      {
        level: 6,
        name: "Andarilho da Fronteira (Roving)",
        type: "Passiva",
        desc: "Seu deslocamento aumenta em **+3 metros (+10 ft)** e você ganha deslocamento de **escalada e natação** iguais ao seu deslocamento terrestre."
      },
      {
        level: 9,
        name: "Especialista em Perícias (Expertise)",
        type: "Perícias",
        desc: "Escolha duas de suas perícias com proficiência (como Furtividade e Sobrevivência). Seu bônus de proficiência é **dobrado** nelas."
      },
      {
        level: 10,
        name: "Camuflagem / Desaparecer (Tireless & Nature's Veil)",
        type: "Ação Bônus",
        desc: "Ganha PV Temporários iguais a 1d8 + Sabedoria e pode ficar completamente **Invisível até o fim do seu próximo turno como Ação Bônus**."
      },
      {
        level: 20,
        name: "Matador de Inimigos (Foe Slayer)",
        type: "Ápice do Caçador",
        desc: "O dado de dano da sua Marca do Caçador se torna **1d10** e você adiciona seu modificador de Sabedoria no dano de cada ataque acertado."
      }
    ],
    subclasses: [
      {
        name: "Mestre das Feras (Beast Master)",
        icon: "🦅",
        desc: "Patrulheiros acompanhados por um poderoso companheiro animal mágico (Fera da Terra, do Céu ou do Mar).",
        features: [
          { level: 3, name: "Companheiro Primevo", desc: "Invoca uma besta mágica leal que ataca no seu turno com sua ação bônus ou substituindo um dos seus ataques." },
          { level: 7, name: "Treinamento Excepcional", desc: "A besta pode Disparar, Desengajar ou Esquivar como ação bônus e seus ataques contam como mágicos." },
          { level: 11, name: "Ataque da Fera Duplo", desc: "Sua besta pode atacar duas vezes por turno." }
        ]
      },
      {
        name: "Caçador (Hunter)",
        icon: "🏹",
        desc: "Especialistas na caça de monstros colossais e hordas de inimigos, adaptando suas táticas para cada presa.",
        features: [
          { level: 3, name: "Presa do Caçador", desc: "Escolha uma especialidade: *Matador de Gigantes* (contra-ataque imediato), *Destruidor de Colossos* (+1d8 dano) ou *Ceifador de Hordas* (ataque extra gratuito em alvo adjacente)." },
          { level: 7, name: "Táticas Defensivas", desc: "Ganha Esquiva Sobrenatural ou Evasão." },
          { level: 11, name: "Ataque Múltiplo (Volley / Whirlwind)", desc: "Ataca todos os inimigos em uma área de 3 metros de raio com um único golpe." }
        ]
      },
      {
        name: "Andarilho do Horizonte (Gloom Stalker)",
        icon: "🌑",
        desc: "Caçadores do Subterrâneo e das trevas profundas, invisíveis a criaturas com visão no escuro e letais no 1º turno.",
        features: [
          { level: 3, name: "Emboscador do Terror", desc: "Soma Sabedoria na Iniciativa, ganha +3m de movimento no 1º turno e desfere um ataque extra com +1d8 de dano." },
          { level: 3, name: "Visão Umbral", desc: "Visão no escuro 18m e invisibilidade total contra criaturas que dependem de visão no escuro." },
          { level: 11, name: "Rajada do Perseguidor", desc: "Se errar um ataque com arma, pode realizar outro ataque imediatamente." }
        ]
      },
      {
        name: "Guardião Fey (Fey Wanderer)",
        icon: "🧚",
        desc: "Patrulheiros abençoados com o charme e as ilusões de Faéria, somando Sabedoria em testes de Carisma e encantando inimigos.",
        features: [
          { level: 3, name: "Golpes Temerosos", desc: "Causa +1d4 de dano Psíquico extra em cada criatura diferente que acertar no turno." },
          { level: 3, name: "Graça de Faéria", desc: "Soma seu modificador de Sabedoria em todos os testes de Carisma." },
          { level: 7, name: "Torção Feérica", desc: "Ao passar em salvaguarda contra encanto ou amedrontamento, reflete o efeito em outra criatura!" }
        ]
      }
    ]
  }
];

// Write file to src/data/classes.js
const code = `// src/data/classes.js - D&D 5E (Edição 2024 / Segredos de Alancia)
// Árvores de Habilidades, Tabelas de Nível 1 a 20 e Subclasses das 12 Classes Oficiais

const CLASSES_DATA = ${JSON.stringify(CLASSES_DATA, null, 2)};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CLASSES_DATA };
}
`;

fs.writeFileSync(path.join(__dirname, '../src/data/classes.js'), code, 'utf8');
console.log('✅ Generated src/data/classes.js successfully with all 12 classes enriched!');
