// ============================================================================
// 📚 D&D 5ª EDIÇÃO (2014) - BASE DE DADOS OFICIAL DE CLASSES E HABILIDADES
// Baseado nas referências oficiais de regras do portal Orbe dos Dragões
// (https://orbedosdragoes.com/)
// ============================================================================

const CLASSES_DATA = [
  // --------------------------------------------------------------------------
  // 1. BÁRBARO
  // --------------------------------------------------------------------------
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
    progression: [
      { level: 1, prof: "+2", features: "Fúria, Defesa sem Armadura", rages: "2", rageDmg: "+2" },
      { level: 2, prof: "+2", features: "Ataque Descuidado, Sentido de Perigo", rages: "2", rageDmg: "+2" },
      { level: 3, prof: "+2", features: "Caminho Primitivo (Subclasse)", rages: "3", rageDmg: "+2" },
      { level: 4, prof: "+2", features: "Aumento no Valor de Atributo", rages: "3", rageDmg: "+2" },
      { level: 5, prof: "+3", features: "Ataque Extra, Movimento Rápido (+3m)", rages: "3", rageDmg: "+2" },
      { level: 6, prof: "+3", features: "Habilidade do Caminho Primitivo", rages: "4", rageDmg: "+2" },
      { level: 7, prof: "+3", features: "Instinto Feral (Vantagem em Iniciativa)", rages: "4", rageDmg: "+2" },
      { level: 8, prof: "+3", features: "Aumento no Valor de Atributo", rages: "4", rageDmg: "+2" },
      { level: 9, prof: "+4", features: "Crítico Brutal (1 dado adicional)", rages: "4", rageDmg: "+3" },
      { level: 10, prof: "+4", features: "Habilidade do Caminho Primitivo", rages: "4", rageDmg: "+3" },
      { level: 11, prof: "+4", features: "Fúria Implacável", rages: "4", rageDmg: "+3" },
      { level: 12, prof: "+4", features: "Aumento no Valor de Atributo", rages: "5", rageDmg: "+3" },
      { level: 13, prof: "+5", features: "Crítico Brutal (2 dados adicionais)", rages: "5", rageDmg: "+3" },
      { level: 14, prof: "+5", features: "Habilidade do Caminho Primitivo", rages: "5", rageDmg: "+3" },
      { level: 15, prof: "+5", features: "Fúria Persistente", rages: "5", rageDmg: "+3" },
      { level: 16, prof: "+5", features: "Aumento no Valor de Atributo", rages: "5", rageDmg: "+4" },
      { level: 17, prof: "+6", features: "Crítico Brutal (3 dados adicionais)", rages: "6", rageDmg: "+4" },
      { level: 18, prof: "+6", features: "Poder Indomável", rages: "6", rageDmg: "+4" },
      { level: 19, prof: "+6", features: "Aumento no Valor de Atributo", rages: "6", rageDmg: "+4" },
      { level: 20, prof: "+6", features: "Campeão Primevo (+4 Força e +4 Constituição, máx 24)", rages: "Ilimitado", rageDmg: "+4" }
    ],
    features: [
      {
        level: 1,
        name: "Fúria (Rage)",
        type: "Ação Bônus",
        desc: "Em combate, você luta com ferocidade primitiva. Com uma **Ação Bônus**, você entra em fúria por 1 minuto se não estiver vestindo armadura pesada:\n• **Vantagem em Testes e Salvaguardas de Força**.\n• **Dano Adicional na Fúria**: Adiciona seu bônus de dano de fúria (+2 a +4) em jogadas de dano com armas corpo a corpo usando Força.\n• **Resistência a Danos**: Resistência a dano de concussão, cortante e perfurante.\n• A fúria cessa prematuramente se você cair inconsciente ou se o seu turno terminar sem que você tenha atacado uma criatura hostil ou sofrido dano desde o seu último turno.\n• Você recupera todos os usos de Fúria ao terminar um Descanso Longo."
      },
      {
        level: 1,
        name: "Defesa sem Armadura (Unarmored Defense)",
        type: "Passiva",
        desc: "Enquanto não estiver vestindo qualquer armadura, sua Classe de Armadura (CA) é igual a **10 + modificador de Destreza + modificador de Constituição**. Você pode usar um escudo e continuar recebendo este benefício."
      },
      {
        level: 2,
        name: "Ataque Descuidado (Reckless Attack)",
        type: "Ação / Ataque",
        desc: "A partir do 2º nível, você pode abrir mão de toda a defesa para atacar com ferocidade desmedida. Quando realizar seu primeiro ataque no seu turno, você pode optar por atacar descuidadamente, ganhando **Vantagem em todas as jogadas de ataque corpo a corpo com Força** durante aquele turno. Em contrapartida, todas as jogadas de ataque contra você têm Vantagem até o início do seu próximo turno."
      },
      {
        level: 2,
        name: "Sentido de Perigo (Danger Sense)",
        type: "Passiva",
        desc: "No 2º nível, você adquire um sentido aguçado para perigos iminentes. Você possui **Vantagem em salvaguardas de Destreza** contra efeitos que possa ver, como armadilhas e magias, desde que não esteja cego, surdo ou incapacitado."
      },
      {
        level: 3,
        name: "Caminho Primitivo (Subclasse)",
        type: "Especialização",
        desc: "No 3º nível, você escolhe um caminho que molda a natureza da sua fúria: o sanguinário *Caminho do Furioso (Berserker)* ou o espiritual *Caminho do Guerreiro Totêmico*. Sua escolha concede características no 3º, 6º, 10º e 14º níveis."
      },
      {
        level: 5,
        name: "Ataque Extra (Extra Attack)",
        type: "Passiva / Ataque",
        desc: "A partir do 5º nível, você pode atacar duas vezes, em vez de uma, sempre que realizar a ação de Ataque no seu turno."
      },
      {
        level: 5,
        name: "Movimento Rápido (Fast Movement)",
        type: "Deslocamento",
        desc: "A partir do 5º nível, seu deslocamento básico de caminhada aumenta em **+3 metros** enquanto você não estiver usando armadura pesada."
      },
      {
        level: 7,
        name: "Instinto Feral (Feral Instinct)",
        type: "Iniciativa",
        desc: "No 7º nível, seus instintos se tornam tão aguçados que você possui **Vantagem em todas as jogadas de Iniciativa**. Além disso, se você for surpreendido no início do combate e não estiver incapacitado, pode agir normalmente no seu primeiro turno desde que entre em fúria antes de realizar qualquer outra ação."
      },
      {
        level: 9,
        name: "Crítico Brutal (Brutal Critical)",
        type: "Crítico",
        desc: "A partir do 9º nível, você pode rolar **um dado de dano adicional da arma** ao determinar o dano extra de um acerto crítico com um ataque corpo a corpo. O bônus aumenta para **dois dados no 13º nível** e **três dados no 17º nível**."
      },
      {
        level: 11,
        name: "Fúria Implacável (Relentless Rage)",
        type: "Sobrevivência",
        desc: "A partir do 11º nível, sua fúria pode mantê-lo lutando mesmo diante de ferimentos mortais. Se você cair a 0 Pontos de Vida enquanto estiver em Fúria e não for morto instantaneamente, pode realizar uma **salvaguarda de Constituição CD 10**. Se obtiver sucesso, você cai para 1 PV em vez disso. Cada vez que usar esta característica após a primeira, a CD aumenta em 5 (15, 20, 25...). A CD reseta para 10 após terminar um Descanso Curto ou Longo."
      },
      {
        level: 15,
        name: "Fúria Persistente (Persistent Rage)",
        type: "Passiva",
        desc: "A partir do 15º nível, sua fúria é tão feroz que ela só termina prematuramente se você cair inconsciente ou se você decidir encerrá-la voluntariamente."
      },
      {
        level: 18,
        name: "Poder Indomável (Indomitable Might)",
        type: "Passiva",
        desc: "A partir do 18º nível, se o total de um teste de Força que você fizer for menor do que o seu valor de Força, você pode usar o seu **valor de atributo Força** no lugar do resultado total rolado."
      },
      {
        level: 20,
        name: "Campeão Primevo (Primal Champion)",
        type: "Ápice Épico",
        desc: "No 20º nível, você incorpora o poder das feras da terra. Seus valores de **Força e Constituição aumentam em +4**, e o seu valor máximo para esses atributos passa a ser **24**."
      }
    ],
    subclasses: [
      {
        name: "Caminho do Furioso (Berserker)",
        icon: "🩸",
        desc: "Bárbaros que canalizam sua ira em um frenesi sangrento incontrolável, desferindo golpes devastadores com fúria violenta.",
        features: [
          {
            level: 3,
            name: "Frenesi (Frenzy)",
            desc: "A partir do 3º nível, você pode entrar em frenesi quando entrar em fúria. Pela duração da fúria, você pode desferir um **ataque corpo a corpo adicional com arma como Ação Bônus** em cada um dos seus turnos após o primeiro. Ao término da fúria, você sofre um nível de Exaustão."
          },
          {
            level: 6,
            name: "Fúria Insensível (Mindless Rage)",
            desc: "A partir do 6º nível, você não pode ser **Enfeitiçado** nem **Amedrontado** enquanto estiver em fúria. Se você já estiver sob tais efeitos ao entrar em fúria, os efeitos são suspensos pela duração da fúria."
          },
          {
            level: 10,
            name: "Presença Intimidadora (Intimidating Presence)",
            desc: "No 10º nível, você pode usar sua Ação para aterrorizar uma criatura a até 9 metros que possa vê-lo ou ouvi-lo. O alvo deve ser bem-sucedido em uma salvaguarda de Sabedoria (CD 8 + proficiência + mod Carisma) ou ficará **Amedrontado** por você até o fim do seu próximo turno. Em turnos subsequentes, você pode usar sua Ação para estender a duração por mais um turno."
          },
          {
            level: 14,
            name: "Retaliação (Retaliation)",
            desc: "A partir do 14º nível, quando sofrer dano de uma criatura a até 1,5 metro de você, você pode usar sua **Reação** para desferir um ataque corpo a corpo com arma contra ela."
          }
        ]
      },
      {
        name: "Caminho do Guerreiro Totêmico (Totem Warrior)",
        icon: "🐻",
        desc: "Bárbaros que abraçam os espíritos animais sagrados como guias, protetores e fontes de poder sobrenatural.",
        features: [
          {
            level: 3,
            name: "Espírito Totêmico (Totem Spirit)",
            desc: "No 3º nível, você escolhe um espírito totêmico animal para receber suas bênçãos na fúria:\n• **Urso**: Enquanto estiver em fúria, você tem **Resistência a todos os tipos de dano, exceto psíquico**.\n• **Águia**: Enquanto estiver em fúria e sem armadura pesada, outras criaturas têm Desvantagem em ataques de oportunidade contra você, e você pode usar a ação de Disparada como Ação Bônus.\n• **Lobo**: Enquanto estiver em fúria, seus aliados têm **Vantagem em jogadas de ataque corpo a corpo** contra qualquer criatura hostil a até 1,5 metro de você."
          },
          {
            level: 6,
            name: "Aspecto da Fera (Aspect of the Beast)",
            desc: "No 6º nível, você ganha um benefício místico permanente:\n• **Urso**: Sua capacidade de carga (incluindo peso máximo) é dobrada, e você tem Vantagem em testes de Força para empurrar, puxar, erguer ou quebrar objetos.\n• **Águia**: Você pode enxergar até 1,5 km sem dificuldade e não sofre desvantagem em testes de Percepção na penumbra.\n• **Lobo**: Você pode rastrear outras criaturas enquanto viaja em ritmo rápido e pode se mover furtivamente em ritmo normal."
          },
          {
            level: 10,
            name: "Andarilho Espiritual (Spirit Walker)",
            desc: "No 10º nível, você pode conjurar as magias *Comunhão com a Natureza* e *Sentido Bestial*, mas apenas como rituais."
          },
          {
            level: 14,
            name: "Sintonia Totêmica (Totemic Attunement)",
            desc: "No 14º nível, você recebe uma dádiva suprema do seu totem:\n• **Urso**: Enquanto estiver em fúria, qualquer criatura hostil a até 1,5 metro de você tem Desvantagem em jogadas de ataque contra qualquer alvo que não seja você.\n• **Águia**: Enquanto estiver em fúria, você adquire deslocamento de Voo igual ao seu deslocamento de caminhada (caindo se terminar o turno no ar).\n• **Lobo**: Enquanto estiver em fúria, se você acertar uma criatura Grande ou menor com ataque corpo a corpo com arma, você pode usar uma Ação Bônus para **derrubá-la no chão**."
          }
        ]
      }
    ]
  },

  // --------------------------------------------------------------------------
  // 2. BARDO
  // --------------------------------------------------------------------------
  {
    id: "bardo",
    name: "Bardo",
    icon: "🎶",
    role: "Conjurador Versátil / Suporte Inspirador",
    summary: "Mestres da música, da oratória e da magia arcana, tecendo palavras de poder para inspirar aliados, desmoralizar inimigos e manipular o destino.",
    hitDie: "d8 (1d8 ou 5 PV por nível)",
    primaryAbility: "Carisma",
    savingThrows: ["Destreza", "Carisma"],
    armorProficiencies: "Armaduras Leves",
    weaponProficiencies: "Armas Simples, Bestas de Mão, Espadas Longas, Rapieiras, Espadas Curtas",
    skillProficiencies: "Escolha quaisquer 3 perícias à sua escolha",
    progression: [
      { level: 1, prof: "+2", features: "Conjurador, Inspiração de Bardo (d6)", cantrips: "2", slots: "2 (1º)" },
      { level: 2, prof: "+2", features: "Pau pra Toda Obra, Canção de Descanso (d6)", cantrips: "2", slots: "3 (1º)" },
      { level: 3, prof: "+2", features: "Colégio de Bardo (Subclasse), Especialização (2)", cantrips: "2", slots: "4/2 (1º/2º)" },
      { level: 4, prof: "+2", features: "Aumento no Valor de Atributo", cantrips: "3", slots: "4/3 (1º/2º)" },
      { level: 5, prof: "+3", features: "Inspiração de Bardo (d8), Fonte de Inspiração", cantrips: "3", slots: "4/3/2 (1º-3º)" },
      { level: 6, prof: "+3", features: "Contra-Encanto, Habilidade do Colégio", cantrips: "3", slots: "4/3/3 (1º-3º)" },
      { level: 7, prof: "+3", features: "Magias de 4º Círculo", cantrips: "3", slots: "4/3/3/1 (1º-4º)" },
      { level: 8, prof: "+3", features: "Aumento no Valor de Atributo", cantrips: "3", slots: "4/3/3/2 (1º-4º)" },
      { level: 9, prof: "+4", features: "Canção de Descanso (d8), Magias de 5º Círculo", cantrips: "3", slots: "4/3/3/3/1 (1º-5º)" },
      { level: 10, prof: "+4", features: "Inspiração de Bardo (d10), Especialização (2), Segredos Mágicos (2)", cantrips: "4", slots: "4/3/3/3/2 (1º-5º)" },
      { level: 11, prof: "+4", features: "Magias de 6º Círculo", cantrips: "4", slots: "4/3/3/3/2/1 (1º-6º)" },
      { level: 12, prof: "+4", features: "Aumento no Valor de Atributo", cantrips: "4", slots: "4/3/3/3/2/1 (1º-6º)" },
      { level: 13, prof: "+5", features: "Canção de Descanso (d10), Magias de 7º Círculo", cantrips: "4", slots: "4/3/3/3/2/1/1 (1º-7º)" },
      { level: 14, prof: "+5", features: "Habilidade do Colégio, Segredos Mágicos (2)", cantrips: "4", slots: "4/3/3/3/2/1/1 (1º-7º)" },
      { level: 15, prof: "+5", features: "Inspiração de Bardo (d12), Magias de 8º Círculo", cantrips: "4", slots: "4/3/3/3/2/1/1/1 (1º-8º)" },
      { level: 16, prof: "+5", features: "Aumento no Valor de Atributo", cantrips: "4", slots: "4/3/3/3/2/1/1/1 (1º-8º)" },
      { level: 17, prof: "+6", features: "Canção de Descanso (d12), Magias de 9º Círculo", cantrips: "4", slots: "4/3/3/3/2/1/1/1/1" },
      { level: 18, prof: "+6", features: "Segredos Mágicos (2)", cantrips: "4", slots: "4/3/3/3/3/1/1/1/1" },
      { level: 19, prof: "+6", features: "Aumento no Valor de Atributo", cantrips: "4", slots: "4/3/3/3/3/2/1/1/1" },
      { level: 20, prof: "+6", features: "Inspiração Superior", cantrips: "4", slots: "4/3/3/3/3/2/2/1/1" }
    ],
    features: [
      {
        level: 1,
        name: "Inspiração de Bardo (Bardic Inspiration)",
        type: "Ação Bônus",
        desc: "Você pode inspirar os outros através de palavras ou música. Como **Ação Bônus**, você escolhe uma criatura a até 18 metros que possa ouvi-lo. A criatura ganha um dado de Inspiração de Bardo (**1d6** no Nv 1, d8 no Nv 5, d10 no Nv 10, d12 no Nv 15).\n• Uma vez nos próximos 10 minutos, a criatura pode rolar o dado e somar o resultado a uma jogada de ataque, teste de habilidade ou salvaguarda.\n• Você pode usar esta característica um número de vezes igual ao seu **modificador de Carisma** (mínimo 1). Você recupera os usos após um Descanso Longo (ou Descanso Curto a partir do 5º nível)."
      },
      {
        level: 1,
        name: "Conjurador (Spellcasting)",
        type: "Magia Arcana",
        desc: "Você aprendeu a desvendar a música da criação para conjurar magias arcanas.\n• **Atributo de Conjuração**: Carisma.\n• **CD de Salvaguarda**: 8 + Bônus de Proficiência + mod Carisma.\n• **Modificador de Ataque Mágico**: Bônus de Proficiência + mod Carisma.\n• **Rituais**: Você pode conjurar qualquer magia de bardo que conheça como ritual se ela possuir o descritor ritual."
      },
      {
        level: 2,
        name: "Pau pra Toda Obra (Jack of All Trades)",
        type: "Passiva",
        desc: "A partir do 2º nível, você pode adicionar **metade do seu bônus de proficiência** (arredondado para baixo) a qualquer teste de habilidade que você fizer que ainda não inclua o seu bônus de proficiência (incluindo testes de Iniciativa e testes de atributo puro)."
      },
      {
        level: 2,
        name: "Canção de Descanso (Song of Rest)",
        type: "Cura / Suporte",
        desc: "A partir do 2º nível, você pode usar música relaxante para ajudar a curar aliados feridos durante um descanso curto. Se você ou qualquer criatura amigável recuperar PV gastando Dados de Vida no final do descanso curto, cada criatura recupera **1d6 PV adicionais** (aumentando para 1d8 no 9º, 1d10 no 13º e 1d12 no 17º nível)."
      },
      {
        level: 3,
        name: "Especialização (Expertise)",
        type: "Perícias",
        desc: "No 3º nível, escolha duas das suas perícias proficientes. Seu bônus de proficiência é **dobrado** em qualquer teste de habilidade que faça uso de qualquer uma das perícias escolhidas. No 10º nível, você pode escolher mais duas perícias para receber este benefício."
      },
      {
        level: 5,
        name: "Fonte de Inspiração (Font of Inspiration)",
        type: "Recarga",
        desc: "A partir do 5º nível, você recupera todos os seus usos gastos de Inspiração de Bardo ao terminar um **Descanso Curto ou Longo**."
      },
      {
        level: 6,
        name: "Contra-Encanto (Countercharm)",
        type: "Ação / Proteção",
        desc: "No 6º nível, você adquire a habilidade de usar notas musicais ou palavras de poder para romper efeitos que influenciem a mente. Como uma Ação, você inicia uma performance que dura até o fim do seu próximo turno. Durante esse tempo, você e qualquer criatura amigável a até 9 metros têm **Vantagem em salvaguardas contra ser Amedrontado ou Enfeitiçado**."
      },
      {
        level: 10,
        name: "Segredos Mágicos (Magical Secrets)",
        type: "Magia Ampla",
        desc: "No 10º nível, você aprende **duas magias à sua escolha de qualquer classe** (incluindo magias de paladino ou patrulheiro), desde que sejam de um círculo que você possa conjurar. Elas contam como magias de bardo para você. Você aprende mais duas magias adicionais no 14º nível e mais duas no 18º nível."
      },
      {
        level: 20,
        name: "Inspiração Superior (Superior Inspiration)",
        type: "Recuperação",
        desc: "No 20º nível, quando você rolar Iniciativa e não tiver nenhum uso restante de Inspiração de Bardo, você recupera **1 uso imediatamente**."
      }
    ],
    subclasses: [
      {
        name: "Colégio do Conhecimento (College of Lore)",
        icon: "📖",
        desc: "Bardos que buscam a verdade em antigos tomos e segredos arcanos de todas as disciplinas do multiverso.",
        features: [
          {
            level: 3,
            name: "Proficiências Bônus",
            desc: "Quando você adere ao Colégio do Conhecimento no 3º nível, você ganha proficiência em **três perícias à sua escolha**."
          },
          {
            level: 3,
            name: "Palavras Cortantes (Cutting Words)",
            desc: "Também no 3º nível, você aprende como usar sua sagacidade para distrair e confundir inimigos. Quando uma criatura a até 18 metros que você possa ver fizer uma jogada de ataque, teste de habilidade ou rolagem de dano, você pode usar sua **Reação** e gastar um dado de Inspiração de Bardo para **subtrair o número rolado** do resultado da criatura."
          },
          {
            level: 6,
            name: "Segredos Mágicos Adicionais",
            desc: "No 6º nível, você aprende **duas magias à sua escolha de qualquer classe** de até 3º círculo. Elas contam como magias de bardo para você e não contam no seu limite de magias conhecidas."
          },
          {
            level: 14,
            name: "Perícia Incomparável (Peerless Skill)",
            desc: "A partir do 14º nível, quando fizer um teste de habilidade próprio, você pode gastar um dado de Inspiração de Bardo e adicioná-lo ao seu resultado após rolar o d20."
          }
        ]
      },
      {
        name: "Colégio da Bravura (College of Valor)",
        icon: "⚔️",
        desc: "Bardos guerreiros que cantam os grandes feitos dos heróis do passado e lideram a vanguarda das batalhas.",
        features: [
          {
            level: 3,
            name: "Proficiências Bônus",
            desc: "Ao ingressar no Colégio da Bravura no 3º nível, você adquire proficiência com **Armaduras Médias, Escudos e Armas Marciais**."
          },
          {
            level: 3,
            name: "Inspiração em Combate (Combat Inspiration)",
            desc: "No 3º nível, uma criatura que possua um dado de Inspiração de Bardo seu pode adicioná-lo à jogada de dano de uma arma, ou pode rolá-lo como **Reação** para somar o valor à sua Classe de Armadura contra um ataque que a acertaria."
          },
          {
            level: 6,
            name: "Ataque Extra (Extra Attack)",
            desc: "A partir do 6º nível, você pode atacar duas vezes, em vez de uma, sempre que realizar a ação de Ataque no seu turno."
          },
          {
            level: 14,
            name: "Magia de Batalha (Battle Magic)",
            desc: "No 14º nível, quando você usar sua Ação para conjurar uma magia de bardo, você pode desferir um **ataque com arma como Ação Bônus**."
          }
        ]
      }
    ]
  },

  // --------------------------------------------------------------------------
  // 3. BRUXO
  // --------------------------------------------------------------------------
  {
    id: "bruxo",
    name: "Bruxo",
    icon: "👁️",
    role: "Conjurador Ocultista / Dano à Distância",
    summary: "Barganhadores arcanos vinculados por pactos ancestrais a patronos de poder titânico além da compreensão mortal.",
    hitDie: "d8 (1d8 ou 5 PV por nível)",
    primaryAbility: "Carisma",
    savingThrows: ["Sabedoria", "Carisma"],
    armorProficiencies: "Armaduras Leves",
    weaponProficiencies: "Armas Simples",
    skillProficiencies: "Escolha 2 entre: Arcanismo, Enganação, História, Intimidação, Investigação, Natureza e Religião",
    progression: [
      { level: 1, prof: "+2", features: "Patrono Transcendente, Magia de Pacto", cantrips: "2", pactSlots: "1 (1º círculo)", invocations: "-" },
      { level: 2, prof: "+2", features: "Invocações Sobrenaturais (2)", cantrips: "2", pactSlots: "2 (1º círculo)", invocations: "2" },
      { level: 3, prof: "+2", features: "Dádiva do Pacto", cantrips: "2", pactSlots: "2 (2º círculo)", invocations: "2" },
      { level: 4, prof: "+2", features: "Aumento no Valor de Atributo", cantrips: "3", pactSlots: "2 (2º círculo)", invocations: "2" },
      { level: 5, prof: "+3", features: "Invocações (3), Slots de 3º", cantrips: "3", pactSlots: "2 (3º círculo)", invocations: "3" },
      { level: 6, prof: "+3", features: "Habilidade do Patrono", cantrips: "3", pactSlots: "2 (3º círculo)", invocations: "3" },
      { level: 7, prof: "+3", features: "Invocações (4), Slots de 4º", cantrips: "3", pactSlots: "2 (4º círculo)", invocations: "4" },
      { level: 8, prof: "+3", features: "Aumento no Valor de Atributo", cantrips: "3", pactSlots: "2 (4º círculo)", invocations: "4" },
      { level: 9, prof: "+4", features: "Invocações (5), Slots de 5º", cantrips: "3", pactSlots: "2 (5º círculo)", invocations: "5" },
      { level: 10, prof: "+4", features: "Habilidade do Patrono", cantrips: "4", pactSlots: "2 (5º círculo)", invocations: "5" },
      { level: 11, prof: "+4", features: "Arcana Mística (6º círculo)", cantrips: "4", pactSlots: "3 (5º círculo)", invocations: "5" },
      { level: 12, prof: "+4", features: "Aumento no Valor de Atributo, Invocações (6)", cantrips: "4", pactSlots: "3 (5º círculo)", invocations: "6" },
      { level: 13, prof: "+5", features: "Arcana Mística (7º círculo)", cantrips: "4", pactSlots: "3 (5º círculo)", invocations: "6" },
      { level: 14, prof: "+5", features: "Habilidade do Patrono", cantrips: "4", pactSlots: "3 (5º círculo)", invocations: "6" },
      { level: 15, prof: "+5", features: "Arcana Mística (8º círculo), Invocações (7)", cantrips: "4", pactSlots: "3 (5º círculo)", invocations: "7" },
      { level: 16, prof: "+5", features: "Aumento no Valor de Atributo", cantrips: "4", pactSlots: "3 (5º círculo)", invocations: "7" },
      { level: 17, prof: "+6", features: "Arcana Mística (9º círculo), 4 Slots de Pacto", cantrips: "4", pactSlots: "4 (5º círculo)", invocations: "7" },
      { level: 18, prof: "+6", features: "Invocações (8)", cantrips: "4", pactSlots: "4 (5º círculo)", invocations: "8" },
      { level: 19, prof: "+6", features: "Aumento no Valor de Atributo", cantrips: "4", pactSlots: "4 (5º círculo)", invocations: "8" },
      { level: 20, prof: "+6", features: "Mestre do Culto", cantrips: "4", pactSlots: "4 (5º círculo)", invocations: "8" }
    ],
    features: [
      {
        level: 1,
        name: "Patrono Transcendente (Otherworldly Patron)",
        type: "Subclasse no Nível 1",
        desc: "No 1º nível, você firma um pacto com uma entidade de outro mundo: *O Corruptor (The Fiend)*, *A Arquifada (The Archfey)* ou *O Grande Antigo (The Great Old One)*. Sua escolha concede características no 1º, 6º, 10º e 14º níveis."
      },
      {
        level: 1,
        name: "Magia de Pacto (Pact Magic)",
        type: "Magia Oculta",
        desc: "Sua pesquisa e a dádiva de seu patrono conferem a você facilidade com magias.\n• **Slots de Pacto**: Todos os seus espaços de magia possuem o mesmo círculo (sempre o mais alto que puder conjurar, até o 5º círculo).\n• **Recarga Rápida**: Você recupera todos os seus espaços de magia de pacto gastos após terminar um **Descanso Curto ou Longo**!\n• **Atributo de Conjuração**: Carisma (CD 8 + prof + mod CAR; ataque mágico = prof + mod CAR)."
      },
      {
        level: 2,
        name: "Invocações Sobrenaturais (Eldritch Invocations)",
        type: "Poder Oculto",
        desc: "No 2º nível, você descobre invocações sobrenaturais, fragmentos de conhecimento proibido que conferem a você habilidades mágicas permanentes (ex: *Rajada Agonizante* somando mod CAR ao dano de Rajada Mística, *Armadura de Sombras* conjurando Armadura Arcana à vontade, *Visão Diabólica* enxergando na escuridão mágica a até 36m). Você ganha mais invocações conforme sobe de nível."
      },
      {
        level: 3,
        name: "Dádiva do Pacto (Pact Boon)",
        type: "Dádiva do Patrono",
        desc: "No 3º nível, seu patrono concede a você uma dádiva especial pelo seu serviço leal:\n• **Pacto da Lâmina**: Você pode usar sua ação para criar uma arma de pacto corpo a corpo mágica em sua mão vazia. Você é proficiente com ela.\n• **Pacto do Tomo**: Seu patrono concede a você um grimório chamado Livro das Sombras contendo três truques de qualquer classe à sua escolha.\n• **Pacto da Corrente**: Você aprende a magia *Localizar Familiar* e pode conjurá-la como ritual, podendo escolher formas aprimoradas como Diabrete, Pseudodragão, Quasit ou Sprite."
      },
      {
        level: 11,
        name: "Arcana Mística (Mystic Arcanum)",
        type: "Altos Círculos",
        desc: "No 11º nível, seu patrono confere a você um segredo mágico chamado arcana. Escolha uma magia de 6º círculo da lista de bruxo como esta arcana. Você pode conjurá-la uma vez sem gastar espaço de magia, recuperando o uso em um Descanso Longo. Você ganha arcanas adicionais de 7º círculo (Nv 13), 8º círculo (Nv 15) e 9º círculo (Nv 17)."
      },
      {
        level: 20,
        name: "Mestre do Culto (Eldritch Master)",
        type: "Ápice Épico",
        desc: "No 20º nível, você pode suplicar ao seu patrono para recuperar todo o seu poder mágico. Você pode gastar **1 minuto** entoando súplicas para recuperar todos os seus espaços de magia de pacto gastos. Uma vez usada, você deve terminar um Descanso Longo antes de usar esta característica novamente."
      }
    ],
    subclasses: [
      {
        name: "O Corruptor (The Fiend)",
        icon: "🔥",
        desc: "Bruxos que firmaram pacto com lordes dos Nove Infernos ou príncipes abissais do Abismo, como Asmodeus, Demogorgon ou Graz'zt.",
        features: [
          {
            level: 1,
            name: "Bênção do Obscuro (Dark One's Blessing)",
            desc: "A partir do 1º nível, quando você reduzir uma criatura hostil a 0 Pontos de Vida, você ganha **Pontos de Vida temporários** iguais ao seu **modificador de Carisma + seu nível de bruxo** (mínimo 1)."
          },
          {
            level: 6,
            name: "Sorte do Obscuro (Dark One's Own Luck)",
            desc: "A partir do 6º nível, você pode invocar seu patrono para alterar o destino a seu favor. Quando fizer um teste de habilidade ou salvaguarda, você pode adicionar **+1d10** ao seu resultado. Você pode usar esta característica uma vez por Descanso Curto ou Longo."
          },
          {
            level: 10,
            name: "Resiliência Demoníaca (Fiendish Resilience)",
            desc: "A partir do 10º nível, você pode escolher um tipo de dano ao término de cada descanso curto ou longo. Você ganha **Resistência a esse tipo de dano** até escolher um diferente (dano de armas mágicas ou de prata ignoram esta resistência)."
          },
          {
            level: 14,
            name: "Atirar no Inferno (Hurl Through Hell)",
            desc: "No 14º nível, quando você acertar uma criatura com um ataque, você pode instantaneamente transportar o alvo através dos planos inferiores. O alvo desaparece e ressurge no final do seu próximo turno, sofrendo **10d10 de dano psíquico** pelo choque traumático. Uma vez usada, recupera o uso em um Descanso Longo."
          }
        ]
      },
      {
        name: "A Arquifada (The Archfey)",
        icon: "🌸",
        desc: "Seu patrono é um nobre feérico de Faéria (Feywild), mestre dos segredos do encanto, do medo e da beleza sobrenatural.",
        features: [
          {
            level: 1,
            name: "Presença Feérica (Fey Presence)",
            desc: "No 1º nível, como uma Ação, você pode fazer com que cada criatura em um cubo de 3 metros centrado em você faça uma salvaguarda de Sabedoria. Se falharem, ficam **Enfeitiçadas ou Amedrontadas** por você até o fim do seu próximo turno (1x/descanso curto)."
          },
          {
            level: 6,
            name: "Fuga Nebulosa (Misty Escape)",
            desc: "No 6º nível, quando você sofrer dano, você pode usar sua **Reação** para ficar invisível e se teletransportar até 18 metros para um espaço desocupado que possa ver. Você permanece invisível até o início do seu próximo turno (1x/descanso curto)."
          },
          {
            level: 10,
            name: "Defesa Sedutora (Beguiling Defenses)",
            desc: "A partir do 10º nível, você se torna **imune a ser Enfeitiçado**. Além disso, quando uma criatura tentar enfeitiçá-lo, você pode usar sua reação para virar o encanto contra ela."
          },
          {
            level: 14,
            name: "Delírio Sombrio (Dark Delirium)",
            desc: "No 14º nível, você pode mergulhar uma criatura a até 18m em um reino ilusório aterrador por 1 minuto se ela falhar em salvaguarda de Sabedoria (1x/descanso longo)."
          }
        ]
      },
      {
        name: "O Grande Antigo (The Great Old One)",
        icon: "🐙",
        desc: "Seu patrono é uma entidade inominável que habita o Reino Distante ou os confins do vácuo cósmico, como Cthulhu ou Dendar.",
        features: [
          {
            level: 1,
            name: "Mente Desperta (Awakened Mind)",
            desc: "No 1º nível, você pode se comunicar telepaticamente com qualquer criatura que possa ver a até **9 metros de você**. A criatura não precisa compartilhar um idioma com você, mas precisa ser capaz de compreender pelo menos um idioma."
          },
          {
            level: 6,
            name: "Escudo Entrópico (Entropic Ward)",
            desc: "No 6º nível, quando uma criatura fizer uma jogada de ataque contra você, você pode usar sua **Reação** para impor **Desvantagem** naquela jogada de ataque. Se o ataque errar, sua próxima jogada de ataque contra aquela criatura tem Vantagem (1x/descanso curto)."
          },
          {
            level: 10,
            name: "Escudo de Pensamentos (Thought Shield)",
            desc: "No 10º nível, seus pensamentos não podem ser lidos por telepatia. Além disso, você tem **Resistência a dano psíquico**, e sempre que sofrer dano psíquico, o atacante sofre a mesma quantidade de dano."
          },
          {
            level: 14,
            name: "Criar Lacaio (Create Thrall)",
            desc: "No 14º nível, você pode usar sua ação para tocar um humanoide incapacitado. A criatura fica encantada por você até que a magia *Remover Maldição* seja conjurada sobre ela, e você pode se comunicar telepaticamente com ela a qualquer distância no mesmo plano."
          }
        ]
      }
    ]
  },

  // --------------------------------------------------------------------------
  // 4. CLÉRIGO
  // --------------------------------------------------------------------------
  {
    id: "clerigo",
    name: "Clérigo",
    icon: "✝️",
    role: "Conjurador Divino / Guardião da Fé",
    summary: "Intermediários sagrados entre o reino mortal e os deuses, canalizando poder milagroso para curar, proteger e julgar com fúria divina.",
    hitDie: "d8 (1d8 ou 5 PV por nível)",
    primaryAbility: "Sabedoria",
    savingThrows: ["Sabedoria", "Carisma"],
    armorProficiencies: "Armaduras Leves, Armaduras Médias e Escudos",
    weaponProficiencies: "Armas Simples",
    skillProficiencies: "Escolha 2 entre: História, Intuição, Medicina, Persuasão e Religião",
    progression: [
      { level: 1, prof: "+2", features: "Conjurador, Domínio Divino", cantrips: "3", slots: "2 (1º)" },
      { level: 2, prof: "+2", features: "Canalizar Divindade (1/descanso), Habilidade de Domínio", cantrips: "3", slots: "3 (1º)" },
      { level: 3, prof: "+2", features: "Magias de 2º Círculo", cantrips: "3", slots: "4/2 (1º/2º)" },
      { level: 4, prof: "+2", features: "Aumento no Valor de Atributo", cantrips: "4", slots: "4/3 (1º/2º)" },
      { level: 5, prof: "+3", features: "Destruir Mortos-Vivos (ND 1/2)", cantrips: "4", slots: "4/3/2 (1º-3º)" },
      { level: 6, prof: "+3", features: "Canalizar Divindade (2/descanso), Habilidade de Domínio", cantrips: "4", slots: "4/3/3 (1º-3º)" },
      { level: 7, prof: "+3", features: "Magias de 4º Círculo", cantrips: "4", slots: "4/3/3/1 (1º-4º)" },
      { level: 8, prof: "+3", features: "Aumento no Valor de Atributo, Destruir Mortos-Vivos (ND 1), Golpe Divino", cantrips: "4", slots: "4/3/3/2 (1º-4º)" },
      { level: 9, prof: "+4", features: "Magias de 5º Círculo", cantrips: "4", slots: "4/3/3/3/1 (1º-5º)" },
      { level: 10, prof: "+4", features: "Intervenção Divina", cantrips: "5", slots: "4/3/3/3/2 (1º-5º)" },
      { level: 11, prof: "+4", features: "Destruir Mortos-Vivos (ND 2), Magias de 6º Círculo", cantrips: "5", slots: "4/3/3/3/2/1 (1º-6º)" },
      { level: 12, prof: "+4", features: "Aumento no Valor de Atributo", cantrips: "5", slots: "4/3/3/3/2/1 (1º-6º)" },
      { level: 13, prof: "+5", features: "Magias de 7º Círculo", cantrips: "5", slots: "4/3/3/3/2/1/1 (1º-7º)" },
      { level: 14, prof: "+5", features: "Destruir Mortos-Vivos (ND 3)", cantrips: "5", slots: "4/3/3/3/2/1/1 (1º-7º)" },
      { level: 15, prof: "+5", features: "Magias de 8º Círculo", cantrips: "5", slots: "4/3/3/3/2/1/1/1 (1º-8º)" },
      { level: 16, prof: "+5", features: "Aumento no Valor de Atributo", cantrips: "5", slots: "4/3/3/3/2/1/1/1 (1º-8º)" },
      { level: 17, prof: "+6", features: "Destruir Mortos-Vivos (ND 4), Magias de 9º Círculo, Habilidade de Domínio", cantrips: "5", slots: "4/3/3/3/2/1/1/1/1" },
      { level: 18, prof: "+6", features: "Canalizar Divindade (3/descanso)", cantrips: "5", slots: "4/3/3/3/3/1/1/1/1" },
      { level: 19, prof: "+6", features: "Aumento no Valor de Atributo", cantrips: "5", slots: "4/3/3/3/3/2/1/1/1" },
      { level: 20, prof: "+6", features: "Intervenção Divina Aprimorada (Sucesso Automático)", cantrips: "5", slots: "4/3/3/3/3/2/2/1/1" }
    ],
    features: [
      {
        level: 1,
        name: "Domínio Divino (Divine Domain)",
        type: "Subclasse no Nível 1",
        desc: "No 1º nível, você escolhe um domínio relacionado à sua divindade: *Vida*, *Luz*, *Guerra*, *Tempestade*, *Enganação*, *Natureza* ou *Conhecimento*. Sua escolha concede magias de domínio e características adicionais já no 1º nível, e novamente no 2º, 6º, 8º e 17º níveis."
      },
      {
        level: 1,
        name: "Conjurador (Spellcasting)",
        type: "Magia Divina",
        desc: "Como canalizador de poder divino, você pode conjurar magias de clérigo.\n• **Preparação de Magias**: Você prepara a lista de magias após cada descanso longo. O número de magias preparadas é igual ao seu **modificador de Sabedoria + seu nível de clérigo** (mínimo de 1 magia).\n• **Rituais**: Você pode conjurar qualquer magia de clérigo preparada como ritual se ela tiver o descritor ritual.\n• **Atributo de Conjuração**: Sabedoria (CD 8 + prof + mod SAB; ataque = prof + mod SAB)."
      },
      {
        level: 2,
        name: "Canalizar Divindade (Channel Divinity)",
        type: "Poder Divino",
        desc: "No 2º nível, você ganha a habilidade de canalizar energia divina diretamente de sua divindade. Você começa com dois efeitos: *Expulsar Mortos-Vivos* e um efeito determinado pelo seu domínio.\n• **Expulsar Mortos-Vivos**: Como uma Ação, você ergue seu símbolo sagrado. Cada morto-vivo a até 9 metros deve fazer uma salvaguarda de Sabedoria. Se falhar, é expulso por 1 minuto ou até sofrer dano.\n• Você recupera seus usos de Canalizar Divindade em um **Descanso Curto ou Longo**."
      },
      {
        level: 5,
        name: "Destruir Mortos-Vivos (Destroy Undead)",
        type: "Expulsão Letal",
        desc: "A partir do 5º nível, quando um morto-vivo falhar na salvaguarda contra sua característica Expulsar Mortos-Vivos, a criatura é **instantaneamente destruída** se seu Nível de Desafio (ND) for igual ou menor ao limite do seu nível (ND 1/2 no Nv 5, ND 1 no Nv 8, ND 2 no Nv 11, ND 3 no Nv 14 e ND 4 no Nv 17)."
      },
      {
        level: 10,
        name: "Intervenção Divina (Divine Intervention)",
        type: "Milagre Divino",
        desc: "No 10º nível, você pode implorar pela ajuda de sua divindade. Como uma Ação, descreva a ajuda que procura e role **1d100**. Se rolar um número **menor ou igual ao seu nível de clérigo**, sua divindade intervém diretamente. Se for bem-sucedido, você não pode usar esta característica novamente por 7 dias. No 20º nível, sua intervenção é **automaticamente bem-sucedida**."
      }
    ],
    subclasses: [
      {
        name: "Domínio da Vida (Life Domain)",
        icon: "💖",
        desc: "O domínio da vida foca na energia positiva vibrante que nutre toda a criação no multiverso, curando e preservando os seres vivos.",
        features: [
          {
            level: 1,
            name: "Proficiência Bônus",
            desc: "No 1º nível, você adquire proficiência com **Armaduras Pesadas**."
          },
          {
            level: 1,
            name: "Discípulo da Vida (Disciple of Life)",
            desc: "A partir do 1º nível, suas magias de cura são mais eficazes. Sempre que você conjurar uma magia de 1º círculo ou superior para restaurar Pontos de Vida a uma criatura, ela recupera **PV adicionais iguais a 2 + o círculo da magia**."
          },
          {
            level: 2,
            name: "Canalizar Divindade: Preservar a Vida",
            desc: "No 2º nível, você pode usar Canalizar Divindade para curar os gravemente feridos. Como uma Ação, você pode restaurar um total de Pontos de Vida igual a **5 vezes o seu nível de clérigo**, distribuindo essa cura entre quaisquer criaturas a até 9 metros de você (não pode curar uma criatura para mais da metade de seu máximo de PV)."
          },
          {
            level: 6,
            name: "Curandeiro Abençoado (Blessed Healer)",
            desc: "A partir do 6º nível, quando você conjurar uma magia de 1º círculo ou superior que restaure PV a outra criatura, você recupera PV iguais a **2 + o círculo da magia** para si mesmo."
          },
          {
            level: 8,
            name: "Golpe Divino (Divine Strike)",
            desc: "No 8º nível, uma vez em cada um de seus turnos ao acertar um ataque com arma, você causa **+1d8 de dano radiante extra** (aumentando para **+2d8 no 14º nível**)."
          },
          {
            level: 17,
            name: "Cura Suprema (Supreme Healing)",
            desc: "A partir do 17º nível, quando você normalmente rolaria um ou mais dados para restaurar PV com uma magia, você usa o **valor mais alto possível de cada dado** em vez de rolar."
          }
        ]
      },
      {
        name: "Domínio da Luz (Light Domain)",
        icon: "☀️",
        desc: "Clérigos da luz promovem a verdade, a vigília e a beleza do alvorecer, queimando a escuridão e as mentiras com fogo sagrado.",
        features: [
          {
            level: 1,
            name: "Truque Bônus",
            desc: "No 1º nível, você aprende o truque *Luz* se ainda não o conhecer."
          },
          {
            level: 1,
            name: "Lampejo Protetor (Warding Flare)",
            desc: "Também no 1º nível, você pode interpor luz brilhante entre você e um atacante. Quando for atacado por uma criatura a até 9 metros, você pode usar sua **Reação** para impor **Desvantagem** na jogada de ataque dela. Você pode usar esta característica um número de vezes igual ao seu modificador de Sabedoria por descanso longo."
          },
          {
            level: 2,
            name: "Canalizar Divindade: Radiação do Alvorecer",
            desc: "No 2º nível, como uma Ação, você dissipa qualquer escuridão mágica a até 9 metros de você e força cada criatura hostil na área a realizar uma salvaguarda de Constituição, sofrendo **2d10 + nível de clérigo de dano radiante** em uma falha (metade em sucesso)."
          },
          {
            level: 6,
            name: "Clarão Aperfeiçoado (Improved Flare)",
            desc: "A partir do 6º nível, você pode usar sua reação de Lampejo Protetor quando uma criatura a até 9m atacar outro aliado."
          },
          {
            level: 8,
            name: "Conjuração Poderosa (Potent Spellcasting)",
            desc: "No 8º nível, você adiciona seu **modificador de Sabedoria** ao dano que você causar com qualquer truque de clérigo."
          },
          {
            level: 17,
            name: "Coroa de Luz (Corona of Light)",
            desc: "No 17º nível, você pode usar sua ação para emitir uma aura de luz plena de 18 metros. Inimigos na luz têm desvantagem em salvaguardas contra magias que causem dano de fogo ou radiante."
          }
        ]
      },
      {
        name: "Domínio da Guerra (War Domain)",
        icon: "⚔️",
        desc: "Deuses da guerra recompensam a bravura marcial, abençoando guerreiros justos com aço infalível e disciplina tática.",
        features: [
          {
            level: 1,
            name: "Proficiência Bônus",
            desc: "No 1º nível, você ganha proficiência com **Armaduras Pesadas e Armas Marciais**."
          },
          {
            level: 1,
            name: "Sacerdote da Guerra (War Priest)",
            desc: "A partir do 1º nível, quando você usar a ação de Ataque, você pode realizar **um ataque adicional com arma como Ação Bônus**. Você pode usar esta característica um número de vezes igual ao seu modificador de Sabedoria por descanso longo."
          },
          {
            level: 2,
            name: "Canalizar Divindade: Golpe Guiado",
            desc: "No 2º nível, você pode usar Canalizar Divindade para atingir com precisão sobrenatural. Quando fizer uma jogada de ataque, você pode conceder a si mesmo um **bônus de +10 no ataque**."
          },
          {
            level: 6,
            name: "Canalizar Divindade: Bênção da Guerra",
            desc: "No 6º nível, quando uma criatura a até 9m fizer uma jogada de ataque, você pode usar sua reação para conceder a ela um **bônus de +10 no ataque**."
          },
          {
            level: 8,
            name: "Golpe Divino (Divine Strike)",
            desc: "No 8º nível, uma vez em cada turno ao acertar ataque com arma, causa **+1d8 de dano físico extra da arma** (+2d8 no 14º nível)."
          },
          {
            level: 17,
            name: "Cruzado Avatar (Avatar of Battle)",
            desc: "No 17º nível, você adquire **Resistência a dano de concussão, cortante e perfurante de armas não-mágicas**."
          }
        ]
      }
    ]
  },

  // --------------------------------------------------------------------------
  // 5. DRUIDA
  // --------------------------------------------------------------------------
  {
    id: "druida",
    name: "Druida",
    icon: "🌿",
    role: "Conjurador da Natureza / Metamorfo",
    summary: "Guardiões do equilíbrio primordial do cosmos, conjurando a fúria dos elementos e metamorfoseando-se em bestas ferozes.",
    hitDie: "d8 (1d8 ou 5 PV por nível)",
    primaryAbility: "Sabedoria",
    savingThrows: ["Inteligência", "Sabedoria"],
    armorProficiencies: "Armaduras Leves e Médias (não-metálicas), Escudos (não-metálicos)",
    weaponProficiencies: "Clavas, Adagas, Dardos, Azagaias, Maças, Bordões, Cimitarras, Foices, Fundas, Lanças",
    skillProficiencies: "Escolha 2 entre: Adestrar Animais, Arcanismo, Intuição, Medicina, Natureza, Percepção, Religião e Sobrevivência",
    progression: [
      { level: 1, prof: "+2", features: "Druídico, Conjurador", cantrips: "2", slots: "2 (1º)" },
      { level: 2, prof: "+2", features: "Forma Selvagem, Círculo Druídico", cantrips: "2", slots: "3 (1º)" },
      { level: 3, prof: "+2", features: "Magias de 2º Círculo", cantrips: "2", slots: "4/2 (1º/2º)" },
      { level: 4, prof: "+2", features: "Aumento no Valor de Atributo, Forma Selvagem (ND 1/2)", cantrips: "3", slots: "4/3 (1º/2º)" },
      { level: 5, prof: "+3", features: "Magias de 3º Círculo", cantrips: "3", slots: "4/3/2 (1º-3º)" },
      { level: 6, prof: "+3", features: "Habilidade do Círculo Druídico", cantrips: "3", slots: "4/3/3 (1º-3º)" },
      { level: 7, prof: "+3", features: "Magias de 4º Círculo", cantrips: "3", slots: "4/3/3/1 (1º-4º)" },
      { level: 8, prof: "+3", features: "Aumento no Valor de Atributo, Forma Selvagem (ND 1, Voo)", cantrips: "3", slots: "4/3/3/2 (1º-4º)" },
      { level: 9, prof: "+4", features: "Magias de 5º Círculo", cantrips: "3", slots: "4/3/3/3/1 (1º-5º)" },
      { level: 10, prof: "+4", features: "Habilidade do Círculo Druídico", cantrips: "4", slots: "4/3/3/3/2 (1º-5º)" },
      { level: 11, prof: "+4", features: "Magias de 6º Círculo", cantrips: "4", slots: "4/3/3/3/2/1 (1º-6º)" },
      { level: 12, prof: "+4", features: "Aumento no Valor de Atributo", cantrips: "4", slots: "4/3/3/3/2/1 (1º-6º)" },
      { level: 13, prof: "+5", features: "Magias de 7º Círculo", cantrips: "4", slots: "4/3/3/3/2/1/1 (1º-7º)" },
      { level: 14, prof: "+5", features: "Habilidade do Círculo Druídico", cantrips: "4", slots: "4/3/3/3/2/1/1 (1º-7º)" },
      { level: 15, prof: "+5", features: "Magias de 8º Círculo", cantrips: "4", slots: "4/3/3/3/2/1/1/1 (1º-8º)" },
      { level: 16, prof: "+5", features: "Aumento no Valor de Atributo", cantrips: "4", slots: "4/3/3/3/2/1/1/1 (1º-8º)" },
      { level: 17, prof: "+6", features: "Magias de 9º Círculo", cantrips: "4", slots: "4/3/3/3/2/1/1/1/1" },
      { level: 18, prof: "+6", features: "Corpo Atemporal, Magias de Fera", cantrips: "4", slots: "4/3/3/3/3/1/1/1/1" },
      { level: 19, prof: "+6", features: "Aumento no Valor de Atributo", cantrips: "4", slots: "4/3/3/3/3/2/1/1/1" },
      { level: 20, prof: "+6", features: "Arquidruida (Formas Selvagens Ilimitadas)", cantrips: "4", slots: "4/3/3/3/3/2/2/1/1" }
    ],
    features: [
      {
        level: 1,
        name: "Druídico (Druidic)",
        type: "Idioma Secreto",
        desc: "Você conhece o Druídico, a linguagem secreta dos druidas. Você pode falar o idioma e usá-lo para deixar mensagens ocultas que apenas outros druidas decifram."
      },
      {
        level: 1,
        name: "Conjurador (Spellcasting)",
        type: "Magia Primordial",
        desc: "Você canaliza o poder da natureza para conjurar magias.\n• **Preparação de Magias**: Você prepara a lista após descanso longo. O total de magias preparadas é igual ao seu **modificador de Sabedoria + seu nível de druida**.\n• **Atributo de Conjuração**: Sabedoria (CD 8 + prof + mod SAB; ataque = prof + mod SAB).\n• **Rituais**: Você pode conjurar qualquer magia preparada como ritual se ela tiver o descritor ritual."
      },
      {
        level: 2,
        name: "Forma Selvagem (Wild Shape)",
        type: "Metamorfose",
        desc: "No 2º nível, você pode usar uma Ação para se transformar magicamente em uma fera que você já tenha visto. Você pode usar esta característica **duas vezes por Descanso Curto ou Longo**.\n• **Nível 2**: ND máx 1/4 (sem voo nem natação, ex: Lobo).\n• **Nível 4**: ND máx 1/2 (sem voo, natação permitida, ex: Crocodilo).\n• **Nível 8**: ND máx 1 (voo permitido, ex: Águia Gigante).\n• Você assume os PV e a CA da fera. Ao cair a 0 PV na forma de fera, você reverte à sua forma original e o dano excedente passa para os seus PV normais."
      },
      {
        level: 2,
        name: "Círculo Druídico (Druid Circle)",
        type: "Subclasse no Nível 2",
        desc: "No 2º nível, você escolhe se identificar com um círculo druídico: o conjurador *Círculo da Terra* ou o combatente feroz *Círculo da Lua*. Sua escolha concede habilidades no 2º, 6º, 10º e 14º níveis."
      },
      {
        level: 18,
        name: "Corpo Atemporal (Timeless Body)",
        type: "Longevidade",
        desc: "No 18º nível, a magia primordial que você comanda faz com que você envelheça mais lentamente. Para cada 10 anos que passam, seu corpo envelhece apenas 1 ano."
      },
      {
        level: 18,
        name: "Magias de Fera (Beast Spells)",
        type: "Conjuração em Fera",
        desc: "A partir do 18º nível, você pode conjurar a maioria das suas magias de druida enquanto estiver em Forma Selvagem, fornecendo os componentes verbais e somáticos na forma de fera."
      },
      {
        level: 20,
        name: "Arquidruida (Archdruid)",
        type: "Ápice Épico",
        desc: "No 20º nível, você pode usar a Forma Selvagem um número **ilimitado de vezes**. Além disso, você pode ignorar os componentes verbais e somáticos de suas magias de druida, bem como componentes materiais sem custo em PO."
      }
    ],
    subclasses: [
      {
        name: "Círculo da Lua (Circle of the Moon)",
        icon: "🌕",
        desc: "Druidas ferozes da noite que assumem formas de feras temíveis e elementais destruidores no calor do combate.",
        features: [
          {
            level: 2,
            name: "Forma Selvagem de Combate",
            desc: "No 2º nível, você adquire a habilidade de usar a Forma Selvagem no seu turno como uma **Ação Bônus** em vez de uma Ação. Além disso, enquanto estiver transformado, você pode usar uma Ação Bônus para gastar um espaço de magia e **recuperar 1d8 Pontos de Vida por círculo do espaço de magia gasto**."
          },
          {
            level: 2,
            name: "Formas de Círculo",
            desc: "Os ritos do seu círculo permitem que você se transforme em feras muito mais perigosas: você pode se transformar em uma fera com **ND de até 1** já no 2º nível (ex: Urso-Pardo). A partir do 6º nível, o ND máximo de fera é igual ao seu **nível de druida dividido por 3** (ND 2 no Nv 6, ND 3 no Nv 9, ND 4 no Nv 12...)."
          },
          {
            level: 6,
            name: "Golpe Primitivo (Primal Strike)",
            desc: "A partir do 6º nível, seus ataques na forma de fera passam a ser considerados **mágicos** para o propósito de sobrepujar resistência e imunidade a ataques e danos não-mágicos."
          },
          {
            level: 10,
            name: "Forma Selvagem Elemental",
            desc: "No 10º nível, você pode gastar dois usos de Forma Selvagem ao mesmo tempo para se transformar em um **Elemental do Ar, Elemental da Terra, Elemental do Fogo ou Elemental da Água**."
          },
          {
            level: 14,
            name: "Mil Formas (Thousand Forms)",
            desc: "No 14º nível, você aprende a alterar sua forma física à vontade. Você pode conjurar a magia *Alterar-se* à vontade sem gastar espaços de magia."
          }
        ]
      },
      {
        name: "Círculo da Terra (Circle of the Land)",
        icon: "🌲",
        desc: "Místicos e sábios que preservam a sabedoria ancestral da terra, recebendo comunhão mágica profunda com os biomas naturais.",
        features: [
          {
            level: 2,
            name: "Truque Bônus",
            desc: "No 2º nível, você aprende um truque de druida adicional à sua escolha."
          },
          {
            level: 2,
            name: "Recuperação Natural (Natural Recovery)",
            desc: "A partir do 2º nível, você pode recuperar parte de sua energia mágica através da meditação. Durante um descanso curto, você escolhe espaços de magia gastos para recuperar, cujo nível combinado seja igual ou menor que **metade do seu nível de druida** (nenhum espaço pode ser de 6º círculo ou superior, 1x/descanso longo)."
          },
          {
            level: 3,
            name: "Magias de Círculo",
            desc: "Sua conexão com a terra infunde você com magias. No 3º, 5º, 7º e 9º níveis, você ganha acesso a magias de círculo baseadas no bioma ecológico que você escolher: *Ártico*, *Costa*, *Deserto*, *Floresta*, *Montanha*, *Pântano*, *Pradaria* ou *Subterrâneo*. Essas magias estão sempre preparadas e não contam no seu limite."
          },
          {
            level: 6,
            name: "Caminho da Terra (Land's Stride)",
            desc: "No 6º nível, mover-se através de terreno difícil não-mágico não custa movimento adicional para você. Você também pode passar através de plantas sem sofrer dano de espinhos."
          },
          {
            level: 10,
            name: "Proteção da Natureza (Nature's Ward)",
            desc: "No 10º nível, você não pode ser **Enfeitiçado nem Amedrontado por elementais ou fadas**, e se torna **imune a venenos e doenças**."
          },
          {
            level: 14,
            name: "Santuário da Natureza (Nature's Sanctuary)",
            desc: "No 14º nível, quando uma criatura do tipo fera ou planta atacar você, ela deve fazer uma salvaguarda de Sabedoria contra a CD de suas magias. Em uma falha, a criatura deve escolher outro alvo ou errar automaticamente."
          }
        ]
      }
    ]
  },

  // --------------------------------------------------------------------------
  // 6. FEITICEIRO
  // --------------------------------------------------------------------------
  {
    id: "feiticeiro",
    name: "Feiticeiro",
    icon: "⚡",
    role: "Conjurador Inato / Manipulador de Metamagia",
    summary: "Conjuradores dotados de magia congênita pulsando em suas veias, moldando os feitiços com poder bruto através de metamagia.",
    hitDie: "d6 (1d6 ou 4 PV por nível)",
    primaryAbility: "Carisma",
    savingThrows: ["Constituição", "Carisma"],
    armorProficiencies: "Nenhuma",
    weaponProficiencies: "Adagas, Dardos, Fundas, Bordões, Bestas Leves",
    skillProficiencies: "Escolha 2 entre: Arcanismo, Enganação, Intuição, Intimidação, Persuasão e Religião",
    progression: [
      { level: 1, prof: "+2", features: "Conjurador, Origem de Feitiçaria", cantrips: "4", sp: "-", slots: "2 (1º)" },
      { level: 2, prof: "+2", features: "Fonte de Magia (Pontos de Feitiçaria)", cantrips: "4", sp: "2", slots: "3 (1º)" },
      { level: 3, prof: "+2", features: "Metamagia (2 opções)", cantrips: "4", sp: "3", slots: "4/2 (1º/2º)" },
      { level: 4, prof: "+2", features: "Aumento no Valor de Atributo", cantrips: "5", sp: "4", slots: "4/3 (1º/2º)" },
      { level: 5, prof: "+3", features: "Magias de 3º Círculo", cantrips: "5", sp: "5", slots: "4/3/2 (1º-3º)" },
      { level: 6, prof: "+3", features: "Habilidade de Origem", cantrips: "5", sp: "6", slots: "4/3/3 (1º-3º)" },
      { level: 7, prof: "+3", features: "Magias de 4º Círculo", cantrips: "5", sp: "7", slots: "4/3/3/1 (1º-4º)" },
      { level: 8, prof: "+3", features: "Aumento no Valor de Atributo", cantrips: "5", sp: "8", slots: "4/3/3/2 (1º-4º)" },
      { level: 9, prof: "+4", features: "Magias de 5º Círculo", cantrips: "5", sp: "9", slots: "4/3/3/3/1 (1º-5º)" },
      { level: 10, prof: "+4", features: "Metamagia (3ª opção)", cantrips: "6", sp: "10", slots: "4/3/3/3/2 (1º-5º)" },
      { level: 11, prof: "+4", features: "Magias de 6º Círculo", cantrips: "6", sp: "11", slots: "4/3/3/3/2/1 (1º-6º)" },
      { level: 12, prof: "+4", features: "Aumento no Valor de Atributo", cantrips: "6", sp: "12", slots: "4/3/3/3/2/1 (1º-6º)" },
      { level: 13, prof: "+5", features: "Magias de 7º Círculo", cantrips: "6", sp: "13", slots: "4/3/3/3/2/1/1 (1º-7º)" },
      { level: 14, prof: "+5", features: "Habilidade de Origem", cantrips: "6", sp: "14", slots: "4/3/3/3/2/1/1 (1º-7º)" },
      { level: 15, prof: "+5", features: "Magias de 8º Círculo", cantrips: "6", sp: "15", slots: "4/3/3/3/2/1/1/1 (1º-8º)" },
      { level: 16, prof: "+5", features: "Aumento no Valor de Atributo", cantrips: "6", sp: "16", slots: "4/3/3/3/2/1/1/1 (1º-8º)" },
      { level: 17, prof: "+6", features: "Metamagia (4ª opção), Magias de 9º Círculo", cantrips: "6", sp: "17", slots: "4/3/3/3/2/1/1/1/1" },
      { level: 18, prof: "+6", features: "Habilidade de Origem", cantrips: "6", sp: "18", slots: "4/3/3/3/3/1/1/1/1" },
      { level: 19, prof: "+6", features: "Aumento no Valor de Atributo", cantrips: "6", sp: "19", slots: "4/3/3/3/3/2/1/1/1" },
      { level: 20, prof: "+6", features: "Restauração de Feiticeiro (Recupera 4 Pontos)", cantrips: "6", sp: "20", slots: "4/3/3/3/3/2/2/1/1" }
    ],
    features: [
      {
        level: 1,
        name: "Origem de Feitiçaria (Sorcerous Origin)",
        type: "Subclasse no Nível 1",
        desc: "No 1º nível, você escolhe uma origem que explica a fonte de seu poder mágico inato: *Linhagem Dracônica (Draconic Bloodline)* ou *Magia Selvagem (Wild Magic)*. Sua escolha concede características no 1º, 6º, 14º e 18º níveis."
      },
      {
        level: 1,
        name: "Conjurador (Spellcasting)",
        type: "Magia Inata",
        desc: "Uma fonte ancestral de magia infundida em você confere a habilidade de conjurar magias.\n• **Magias Conhecidas**: Você conhece um número fixo de magias da lista de feiticeiro.\n• **Atributo de Conjuração**: Carisma (CD 8 + prof + mod CAR; ataque = prof + mod CAR)."
      },
      {
        level: 2,
        name: "Fonte de Magia (Font of Magic)",
        type: "Pontos de Feitiçaria",
        desc: "No 2º nível, você alcança um poço profundo de magia dentro de si mesmo. Você possui uma reserva de **Pontos de Feitiçaria** igual ao seu nível de feiticeiro que recarrega em um Descanso Longo.\n• **Criar Espaços de Magia**: Você pode gastar pontos de feitiçaria como ação bônus para criar slots de magia adicionais (1º círculo = 2 pontos, 2º = 3, 3º = 5, 4º = 6, 5º = 7).\n• **Converter Espaços**: Como ação bônus, você pode gastar um espaço de magia para ganhar pontos de feitiçaria iguais ao círculo do espaço."
      },
      {
        level: 3,
        name: "Metamagia (Metamagic)",
        type: "Manipulação de Magia",
        desc: "No 3º nível, você adquire a habilidade de dobrar as magias aos seus caprichos. Você escolhe duas opções de Metamagia (e mais uma no 10º e 17º níveis):\n• **Acelerar Magia (2 Pontos)**: Muda o tempo de conjuração de uma magia de 1 Ação para **1 Ação Bônus**.\n• **Duplicar Magia (Pontos = Círculo)**: Permite que uma magia que tenha como alvo apenas uma criatura atinja uma segunda criatura ao mesmo tempo.\n• **Magia Sutil (1 Ponto)**: Conjura uma magia sem precisar fornecer componentes verbais ou somáticos (imune a Contramágica e furtiva).\n• **Magia Potencializada (1 Ponto)**: Rerrola um número de dados de dano da magia até o seu modificador de Carisma.\n• **Magia Estendida (1 Ponto)**: Dobra a duração de uma magia (até no máximo 24 horas)."
      },
      {
        level: 20,
        name: "Restauração de Feiticeiro (Sorcerous Restoration)",
        type: "Recuperação",
        desc: "No 20º nível, você recupera **4 pontos de feitiçaria gastos** sempre que terminar um **Descanso Curto**."
      }
    ],
    subclasses: [
      {
        name: "Linhagem Dracônica (Draconic Bloodline)",
        icon: "🐉",
        desc: "Sua magia inata vem do sangue de dragão que se misturou aos seus antepassados ou de um pacto dracônico ancestral.",
        features: [
          {
            level: 1,
            name: "Ancestral Dracônico",
            desc: "No 1º nível, você escolhe um tipo de dragão como seu ancestral (Vermelho/Ouro/Latão para Fogo, Azul/Bronze para Elétrico, Branco/Prata para Frio, Preto/Cobre para Ácido, Verde para Veneno). Você pode falar, ler e escrever Dracônico."
          },
          {
            level: 1,
            name: "Resiliência Dracônica",
            desc: "Conforme a magia flui pelo seu corpo, traços físicos de seus ancestrais emergem. Seu máximo de Pontos de Vida aumenta em **+1 PV por nível de feiticeiro**. Além disso, enquanto não estiver usando armadura, sua CA base é igual a **13 + modificador de Destreza**."
          },
          {
            level: 6,
            name: "Afinidade Elemental",
            desc: "A partir do 6º nível, quando você conjurar uma magia que cause o tipo de dano associado ao seu ancestral dracônico, adicione o seu **modificador de Carisma a uma rolagem de dano** daquela magia. Você também pode gastar 1 ponto de feitiçaria para ganhar **Resistência** a esse tipo de dano por 1 hora."
          },
          {
            level: 14,
            name: "Asas de Dragão (Dragon Wings)",
            desc: "No 14º nível, você adquire a habilidade de fazer brotar um par de asas de dragão das suas costas como Ação Bônus, ganhando deslocamento de **Voo igual ao seu deslocamento atual** enquanto não estiver vestindo armadura."
          },
          {
            level: 18,
            name: "Presença Dracônica (Draconic Presence)",
            desc: "No 18º nível, você pode canalizar a presença aterradora de seu ancestral. Como uma Ação, gaste 5 pontos de feitiçaria para emanar uma aura de 18 metros por 1 minuto. Inimigos na área que falharem em salvaguarda de Sabedoria ficam **Amedrontados ou Enfeitiçados** por você."
          }
        ]
      },
      {
        name: "Magia Selvagem (Wild Magic)",
        icon: "🎲",
        desc: "Seu poder inato brota das forças do caos do multiverso, desatando efeitos mágicos imprevisíveis e imprevisibilidade cósmica.",
        features: [
          {
            level: 1,
            name: "Surto de Magia Selvagem (Wild Magic Surge)",
            desc: "A partir do 1º nível, sua conjuração pode desencadear surtos de magia caótica. Uma vez por turno, imediatamente após você conjurar uma magia de feiticeiro de 1º círculo ou superior, o mestre pode pedir para você rolar 1d20. Se rolar um **1 natural**, você rola na Tabela de Surto de Magia Selvagem para criar um efeito mágico aleatório."
          },
          {
            level: 1,
            name: "Marés do Caos (Tides of Chaos)",
            desc: "No 1º nível, você pode manipular as forças do acaso para ganhar **Vantagem em uma jogada de ataque, teste de habilidade ou salvaguarda**. Você recupera o uso após um Descanso Longo. Qualquer momento antes de você recuperá-la, o mestre pode fazer você rolar na tabela de magia selvagem para você recuperar o uso imediatamente."
          },
          {
            level: 6,
            name: "Curvar a Sorte (Bend Luck)",
            desc: "A partir do 6º nível, quando outra criatura que você possa ver fizer uma jogada de ataque, teste ou salvaguarda, você pode usar sua **Reação** e gastar 2 pontos de feitiçaria para rolar **1d4 e aplicar como bônus ou penalidade** à rolagem daquela criatura."
          },
          {
            level: 14,
            name: "Caos Controlado (Controlled Chaos)",
            desc: "No 14º nível, você adquire maior controle sobre os surtos caóticos. Sempre que rolar na tabela de magia selvagem, você pode **rolar duas vezes e escolher qualquer um dos dois efeitos**."
          },
          {
            level: 18,
            name: "Bombardeio Mágico (Spell Bombardment)",
            desc: "No 18º nível, quando rolar o dano máximo em pelo menos um dado de uma magia, você pode rolar aquele dado mais uma vez e adicionar o resultado ao dano total."
          }
        ]
      }
    ]
  },

  // --------------------------------------------------------------------------
  // 7. GUERREIRO
  // --------------------------------------------------------------------------
  {
    id: "guerreiro",
    name: "Guerreiro",
    icon: "⚔️",
    role: "Combatente Marcial Supremo / Mestre em Armas",
    summary: "Mestres absolutos do combate armado e das táticas marciais, treinados com todas as armas e armaduras sob o sol.",
    hitDie: "d10 (1d10 ou 6 PV por nível)",
    primaryAbility: "Força ou Destreza",
    savingThrows: ["Força", "Constituição"],
    armorProficiencies: "Todas as armaduras (Leves, Médias, Pesadas) e Escudos",
    weaponProficiencies: "Armas Simples e Armas Marciais",
    skillProficiencies: "Escolha 2 entre: Acrobacia, Adestrar Animais, Atletismo, História, Intuição, Intimidação, Percepção e Sobrevivência",
    progression: [
      { level: 1, prof: "+2", features: "Estilo de Luta, Retomar o Fôlego" },
      { level: 2, prof: "+2", features: "Surto de Ação (1 uso)" },
      { level: 3, prof: "+2", features: "Arquétipo Marcial (Subclasse)" },
      { level: 4, prof: "+2", features: "Aumento no Valor de Atributo" },
      { level: 5, prof: "+3", features: "Ataque Extra (1 ataque adicional)" },
      { level: 6, prof: "+3", features: "Aumento no Valor de Atributo" },
      { level: 7, prof: "+3", features: "Habilidade do Arquétipo Marcial" },
      { level: 8, prof: "+3", features: "Aumento no Valor de Atributo" },
      { level: 9, prof: "+4", features: "Indomável (1 uso)" },
      { level: 10, prof: "+4", features: "Habilidade do Arquétipo Marcial" },
      { level: 11, prof: "+4", features: "Ataque Extra (2 ataques adicionais - 3 total)" },
      { level: 12, prof: "+4", features: "Aumento no Valor de Atributo" },
      { level: 13, prof: "+5", features: "Indomável (2 usos)" },
      { level: 14, prof: "+5", features: "Aumento no Valor de Atributo" },
      { level: 15, prof: "+5", features: "Habilidade do Arquétipo Marcial" },
      { level: 16, prof: "+5", features: "Aumento no Valor de Atributo" },
      { level: 17, prof: "+6", features: "Surto de Ação (2 usos), Indomável (3 usos)" },
      { level: 18, prof: "+6", features: "Habilidade do Arquétipo Marcial" },
      { level: 19, prof: "+6", features: "Aumento no Valor de Atributo" },
      { level: 20, prof: "+6", features: "Ataque Extra (3 ataques adicionais - 4 total!)" }
    ],
    features: [
      {
        level: 1,
        name: "Estilo de Luta (Fighting Style)",
        type: "Especialização Marcial",
        desc: "Você adota um estilo de combate particular como sua especialidade:\n• **Arquearia**: Você ganha um bônus de **+2 em jogadas de ataque** com armas de ataque à distância.\n• **Defesa**: Enquanto estiver vestindo uma armadura, você ganha um bônus de **+1 na Classe de Armadura**.\n• **Duelo**: Quando estiver empunhando uma arma corpo a corpo em uma mão e nenhuma outra arma, você ganha um bônus de **+2 nas jogadas de dano** com aquela arma.\n• **Combate com Armas Grandes**: Quando você rolar um 1 ou 2 em um dado de dano com uma arma empunhada com as duas mãos, você pode rolar o dado novamente e deve usar o novo resultado.\n• **Proteção**: Quando uma criatura atacar um alvo que não seja você que esteja a até 1,5m, você pode usar sua **Reação** para impor **Desvantagem** na jogada de ataque dela se estiver usando escudo.\n• **Combate com Duas Armas**: Ao lutar com duas armas, você pode adicionar seu modificador de habilidade ao dano do segundo ataque."
      },
      {
        level: 1,
        name: "Retomar o Fôlego (Second Wind)",
        type: "Ação Bônus / Cura",
        desc: "Você possui uma reserva limitada de vigor que você pode puxar para se proteger contra danos. No seu turno, você pode usar uma **Ação Bônus** para recuperar Pontos de Vida iguais a **1d10 + seu nível de guerreiro**. Uma vez usada, você deve terminar um **Descanso Curto ou Longo** antes de usar esta característica novamente."
      },
      {
        level: 2,
        name: "Surto de Ação (Action Surge)",
        type: "Ação Adicional",
        desc: "A partir do 2º nível, você pode ultrapassar seus limites normais por um instante. No seu turno, você pode realizar **uma ação adicional** além da sua ação regular e de uma possível ação bônus. Uma vez usada, recupera o uso em um **Descanso Curto ou Longo** (ganha um 2º uso no 17º nível)."
      },
      {
        level: 3,
        name: "Arquétipo Marcial (Subclasse)",
        type: "Subclasse no Nível 3",
        desc: "No 3º nível, você escolhe o arquétipo marcial que define sua abordagem em combate: o implacável *Campeão*, o disciplinado *Mestre da Batalha* ou o arcano *Cavaleiro Místico*. Sua escolha concede características no 3º, 7º, 10º, 15º e 18º níveis."
      },
      {
        level: 5,
        name: "Ataque Extra (Extra Attack)",
        type: "Ataque Múltiplo",
        desc: "A partir do 5º nível, você pode atacar duas vezes, em vez de uma, sempre que realizar a ação de Ataque no seu turno. O número de ataques aumenta para **três ataques no 11º nível** e para **quatro ataques no 20º nível**."
      },
      {
        level: 9,
        name: "Indomável (Indomitable)",
        type: "Salvaguarda",
        desc: "A partir do 9º nível, você pode **rolar novamente uma salvaguarda que tenha falhado**. Se o fizer, você deve usar o novo resultado. Uma vez usada, recupera o uso em um Descanso Longo (2 usos no Nv 13 e 3 usos no Nv 17)."
      }
    ],
    subclasses: [
      {
        name: "Campeão (Champion)",
        icon: "🏆",
        desc: "Guerreiros que desenvolvem poder físico bruto refinado até a perfeição mortal, atingindo golpes críticos devastadores.",
        features: [
          {
            level: 3,
            name: "Crítico Aprimorado (Improved Critical)",
            desc: "A partir do 3º nível, suas jogadas de ataque com armas conseguem um **acerto crítico em uma rolagem de 19 ou 20** no d20."
          },
          {
            level: 7,
            name: "Atleta Notável (Remarkable Athlete)",
            desc: "A partir do 7º nível, você pode adicionar metade do seu bônus de proficiência a qualquer teste de Força, Destreza ou Constituição que ainda não inclua o bônus. Além disso, a distância que você pode cobrir em um salto em distância com corrida aumenta em um número de metros igual ao seu mod Força."
          },
          {
            level: 10,
            name: "Estilo de Luta Adicional",
            desc: "No 10º nível, você pode escolher um segundo Estilo de Luta da lista de guerreiro."
          },
          {
            level: 15,
            name: "Crítico Superior (Superior Critical)",
            desc: "A partir do 15º nível, suas jogadas de ataque com armas conseguem um acerto crítico em uma rolagem de **18, 19 ou 20** no d20."
          },
          {
            level: 18,
            name: "Sobrevivente (Survivor)",
            desc: "No 18º nível, no início de cada um de seus turnos, você recupera um número de Pontos de Vida igual a **5 + seu modificador de Constituição** se tiver menos da metade de seus PV máximos (não funciona se estiver com 0 PV)."
          }
        ]
      },
      {
        name: "Mestre da Batalha (Battle Master)",
        icon: "🛡️",
        desc: "Estrategistas marciais refinados que veem o combate como uma arte, empregando manobras e dados de superioridade.",
        features: [
          {
            level: 3,
            name: "Superioridade em Combate (Combat Superiority)",
            desc: "No 3º nível, você aprende manobras que são alimentadas por dados especiais chamados dados de superioridade:\n• **Dados**: Você tem **quatro dados de superioridade d8** (aumentando para d10 no Nv 10 e d12 no Nv 18). Você recupera todos os dados gastos em um **Descanso Curto ou Longo**.\n• **3 Manobras Iniciais**: Escolha 3 manobras (ex: *Ataque Preciso* somando o dado ao acerto, *Derrubar* forçando salvaguarda de FOR para deitar o alvo, *Desarmar* arrancando a arma, *Riposta* usando reação ao errar ataque para contra-atacar)."
          },
          {
            level: 3,
            name: "Estudioso da Guerra (Student of War)",
            desc: "No 3º nível, você adquire proficiência com uma ferramenta de artesão à sua escolha."
          },
          {
            level: 7,
            name: "Conhecer o Inimigo (Know Your Enemy)",
            desc: "A partir do 7º nível, se você passar pelo menos 1 minuto observando ou interagindo com outra criatura fora de combate, o mestre informa como ela se compara a você (CA, PV, FOR, DES, CON...)."
          },
          {
            level: 15,
            name: "Implacável (Relentless)",
            desc: "No 15º nível, quando você rolar Iniciativa e não tiver nenhum dado de superioridade restante, você recupera **1 dado imediatamente**."
          }
        ]
      },
      {
        name: "Cavaleiro Místico (Eldritch Knight)",
        icon: "✨",
        desc: "Guerreiros que combinam maestria em armas com a magia arcana de evocação e abjuração de mago.",
        features: [
          {
            level: 3,
            name: "Conjurador (1/3 Caster de Mago)",
            desc: "No 3º nível, você aprende a conjurar magias de Mago focadas primariamente em Abjuração e Evocação.\n• **Atributo de Conjuração**: Inteligência (CD 8 + prof + mod INT; ataque = prof + mod INT)."
          },
          {
            level: 3,
            name: "Vínculo com Arma (Weapon Bond)",
            desc: "No 3º nível, você aprende um ritual para criar um vínculo mágico com até duas armas. Uma vez vinculada, você não pode ser desarmado daquela arma a menos que esteja incapacitado, e pode convocá-la instantaneamente para a sua mão como **Ação Bônus** em qualquer lugar do mesmo plano."
          },
          {
            level: 7,
            name: "Magia de Guerra (War Magic)",
            desc: "A partir do 7º nível, quando você usar sua Ação para conjurar um truque, você pode realizar **um ataque com arma como Ação Bônus**."
          },
          {
            level: 10,
            name: "Golpe Místico (Eldritch Strike)",
            desc: "No 10º nível, quando você acertar uma criatura com um ataque com arma, ela tem **Desvantagem na próxima salvaguarda** que fizer contra uma magia que você conjurar antes do fim do seu próximo turno."
          },
          {
            level: 15,
            name: "Investida Arcana (Arcane Charge)",
            desc: "No 15º nível, quando você usar seu Surto de Ação, você pode se teletransportar até 9 metros para um espaço desocupado que possa ver antes ou depois da ação adicional."
          },
          {
            level: 18,
            name: "Magia de Guerra Aprimorada",
            desc: "No 18º nível, quando você usar sua Ação para conjurar qualquer magia, você pode realizar um ataque com arma como Ação Bônus."
          }
        ]
      }
    ]
  },

  // --------------------------------------------------------------------------
  // 8. LADINO
  // --------------------------------------------------------------------------
  {
    id: "ladino",
    name: "Ladino",
    icon: "🗡️",
    role: "Especialista em Furtividade / Dano Crítico",
    summary: "Mestres da precisão, da infiltração e da audácia, encontrando as fraquezas dos oponentes para desferir golpes mortais.",
    hitDie: "d8 (1d8 ou 5 PV por nível)",
    primaryAbility: "Destreza",
    savingThrows: ["Destreza", "Inteligência"],
    armorProficiencies: "Armaduras Leves",
    weaponProficiencies: "Armas Simples, Bestas de Mão, Espadas Longas, Rapieiras, Espadas Curtas, Ferramentas de Ladrão",
    skillProficiencies: "Escolha 4 entre: Acrobacia, Atletismo, Enganação, Furtividade, Intimidação, Intuição, Investigação, Percepção, Atuação, Persuasão e Prestidigitação",
    progression: [
      { level: 1, prof: "+2", features: "Especialização (2), Ataque Furtivo (1d6), Gíria de Ladrão", sneak: "1d6" },
      { level: 2, prof: "+2", features: "Ação Astuta (Correr/Desengajar/Esconder)", sneak: "1d6" },
      { level: 3, prof: "+2", features: "Arquétipo de Ladino (Subclasse)", sneak: "2d6" },
      { level: 4, prof: "+2", features: "Aumento no Valor de Atributo", sneak: "2d6" },
      { level: 5, prof: "+3", features: "Esquiva Sobrenatural", sneak: "3d6" },
      { level: 6, prof: "+3", features: "Especialização (2 adicionais)", sneak: "3d6" },
      { level: 7, prof: "+3", features: "Evasão (Dano zero em salvaguarda de DES)", sneak: "4d6" },
      { level: 8, prof: "+3", features: "Aumento no Valor de Atributo", sneak: "4d6" },
      { level: 9, prof: "+4", features: "Habilidade do Arquétipo", sneak: "5d6" },
      { level: 10, prof: "+4", features: "Aumento no Valor de Atributo", sneak: "5d6" },
      { level: 11, prof: "+4", features: "Talento Confiável (Mínimo 10 no d20)", sneak: "6d6" },
      { level: 12, prof: "+4", features: "Aumento no Valor de Atributo", sneak: "6d6" },
      { level: 13, prof: "+5", features: "Habilidade do Arquétipo", sneak: "7d6" },
      { level: 14, prof: "+5", features: "Sentido Cego (3m)", sneak: "7d6" },
      { level: 15, prof: "+5", features: "Mente Escorregadia (Proficiência em Sabedoria)", sneak: "8d6" },
      { level: 16, prof: "+5", features: "Aumento no Valor de Atributo", sneak: "8d6" },
      { level: 17, prof: "+6", features: "Habilidade do Arquétipo", sneak: "9d6" },
      { level: 18, prof: "+6", features: "Elusivo (Sem Vantagem contra você)", sneak: "9d6" },
      { level: 19, prof: "+6", features: "Aumento no Valor de Atributo", sneak: "10d6" },
      { level: 20, prof: "+6", features: "Golpe de Sorte (Acerto garantido 1x/descanso)", sneak: "10d6" }
    ],
    features: [
      {
        level: 1,
        name: "Especialização (Expertise)",
        type: "Perícias",
        desc: "No 1º nível, escolha duas de suas perícias proficientes ou uma perícia e as ferramentas de ladrão. Seu bônus de proficiência é **dobrado** em qualquer teste de habilidade com elas. No 6º nível, escolha outras duas para receber o mesmo benefício."
      },
      {
        level: 1,
        name: "Ataque Furtivo (Sneak Attack)",
        type: "Dano de Precisão",
        desc: "A partir do 1º nível, você sabe como golpear sutilmente e explorar a distração de um inimigo. Uma vez por turno, você pode causar um dano extra de **1d6** a uma criatura que acertar com um ataque usando uma arma de acuidade (finesse) ou de ataque à distância, se tiver **Vantagem na jogada de ataque**.\n• Você não precisa de Vantagem se outro oponente do alvo estiver a até 1,5m dele, desde que esse aliado não esteja incapacitado e você não tenha Desvantagem.\n• O dano aumenta com seu nível: 2d6 no Nv 3, 3d6 no Nv 5, 4d6 no Nv 7... até **10d6 no Nv 19**."
      },
      {
        level: 1,
        name: "Gíria de Ladrão (Thieves' Cant)",
        type: "Comunicação",
        desc: "Durante seu treinamento, você aprendeu a gíria de ladrão, uma mistura secreta de dialeto, jargões e códigos que permite ocultar mensagens em conversas aparentemente normais e identificar sinais secretos de esconderijos."
      },
      {
        level: 2,
        name: "Ação Astuta (Cunning Action)",
        type: "Ação Bônus",
        desc: "A partir do 2º nível, sua agilidade mental e pés ligeiros permitem que você se mova rapidamente. Você pode usar uma **Ação Bônus** em cada um de seus turnos em combate para realizar uma das seguintes ações: **Correr (Dash)**, **Desengajar (Disengage)** ou **Esconder-se (Hide)**."
      },
      {
        level: 3,
        name: "Arquétipo de Ladino (Subclasse)",
        type: "Subclasse no Nível 3",
        desc: "No 3º nível, você escolhe um arquétipo que reflete suas habilidades ladinas: o ágil *Ladrão (Thief)*, o letal *Assassino (Assassin)* ou o mágico *Trapaceiro Arcano (Arcane Trickster)*. Sua escolha concede características no 3º, 9º, 13º e 17º níveis."
      },
      {
        level: 5,
        name: "Esquiva Sobrenatural (Uncanny Dodge)",
        type: "Reação / Defesa",
        desc: "A partir do 5º nível, quando um atacante que você possa ver acertar você com um ataque, você pode usar sua **Reação** para **reduzir o dano daquele ataque pela metade**."
      },
      {
        level: 7,
        name: "Evasão (Evasion)",
        type: "Defesa de Área",
        desc: "A partir do 7º nível, você pode desviar agilmente de certos efeitos em área. Quando for submetido a um efeito que permita fazer uma salvaguarda de Destreza para sofrer apenas metade do dano (como uma Bola de Fogo ou sopro de dragão), você **não sofre dano algum se for bem-sucedido**, e sofre apenas metade do dano se falhar."
      },
      {
        level: 11,
        name: "Talento Confiável (Reliable Talent)",
        type: "Consistência",
        desc: "No 11º nível, você refinou suas perícias até a quase perfeição. Sempre que você fizer um teste de habilidade que inclua o seu bônus de proficiência, qualquer resultado de **9 ou menos no d20 é tratado como um 10**!"
      },
      {
        level: 14,
        name: "Sentido Cego (Blindsense)",
        type: "Percepção",
        desc: "A partir do 14º nível, se você for capaz de ouvir, você está ciente da localização de qualquer criatura invisível ou escondida a até **3 metros de você**."
      },
      {
        level: 15,
        name: "Mente Escorregadia (Slippery Mind)",
        type: "Salvaguarda",
        desc: "No 15º nível, você adquire uma força mental formidável. Você ganha proficiência em **salvaguardas de Sabedoria**."
      },
      {
        level: 18,
        name: "Elusivo (Elusive)",
        type: "Esquiva Passiva",
        desc: "A partir do 18º nível, você é tão sagaz que os oponentes raramente conseguem uma vantagem contra você. Nenhuma jogada de ataque possui Vantagem contra você enquanto você não estiver incapacitado."
      },
      {
        level: 20,
        name: "Golpe de Sorte (Stroke of Luck)",
        type: "Ápice Épico",
        desc: "No 20º nível, você possui um dom inacreditável para ter sucesso quando mais precisa. Se o seu ataque errar um alvo dentro de alcance, você pode transformar o erro em um acerto. Alternativamente, se falhar em um teste de habilidade, pode tratar o d20 como um 20. Uma vez usada, recupera o uso em um Descanso Curto ou Longo."
      }
    ],
    subclasses: [
      {
        name: "Ladrão (Thief)",
        icon: "🪙",
        desc: "Especialistas em arrombamento, agilidade acrobática e infiltração rápida em cofres e fortalezas impenetráveis.",
        features: [
          {
            level: 3,
            name: "Mãos Rápidas (Fast Hands)",
            desc: "A partir do 3º nível, você pode usar a ação bônus concedida por sua Ação Astuta para fazer um teste de Destreza (Prestidigitação), usar suas ferramentas de ladrão para desarmar uma armadilha ou abrir uma fechadura, ou realizar a ação de Usar um Objeto."
          },
          {
            level: 3,
            name: "Gatuno (Second-Story Work)",
            desc: "No 3º nível, você adquire a habilidade de escalar mais rápido que o normal; escalar não custa mais movimento adicional para você. Além disso, a distância que você pode cobrir em um salto com corrida aumenta pelo seu modificador de Destreza em metros."
          },
          {
            level: 9,
            name: "Furtividade Suprema (Supreme Sneak)",
            desc: "No 9º nível, você tem **Vantagem em testes de Destreza (Furtividade)** se você não se mover mais do que a metade do seu deslocamento no mesmo turno."
          },
          {
            level: 13,
            name: "Usar Dispositivo Mágico (Use Magic Device)",
            desc: "No 13º nível, você aprendeu tanto sobre magia que pode improvisar o uso de itens mágicos. Você **ignora todas as exigências de classe, raça e nível** para usar ou se sintonizar com qualquer item mágico."
          },
          {
            level: 17,
            name: "Reflexos de Ladrão (Thief's Reflexes)",
            desc: "No 17º nível, você pode realizar **dois turnos completos** durante a primeira rodada de qualquer combate (um na sua iniciativa normal e outro na sua iniciativa menos 10)."
          }
        ]
      },
      {
        name: "Assassino (Assassin)",
        icon: "🩸",
        desc: "Mestres do veneno, do disfarce e do homicídio premeditado com golpes críticos devastadores contra alvos surpresos.",
        features: [
          {
            level: 3,
            name: "Proficiências Bônus",
            desc: "Ao escolher este arquétipo no 3º nível, você ganha proficiência com o **kit de disfarce** e o **kit de venenos**."
          },
          {
            level: 3,
            name: "Assassinar (Assassinate)",
            desc: "A partir do 3º nível, você é mais mortal contra inimigos desprevenidos:\n• Você tem **Vantagem em jogadas de ataque** contra qualquer criatura que ainda não tenha agido no combate.\n• Além disso, qualquer acerto que você desferir contra uma criatura que esteja **Surpresa** é automaticamente um **Acerto Crítico**!"
          },
          {
            level: 9,
            name: "Especialista em Infiltração",
            desc: "No 9º nível, você pode criar identidades falsas infalíveis com 7 dias de preparação e 25 PO em despesas."
          },
          {
            level: 13,
            name: "Impostor (Impostor)",
            desc: "No 13º nível, você adquire a habilidade de imitar a fala, a escrita e o comportamento de outra pessoa quase perfeitamente após 3 horas de observação."
          },
          {
            level: 17,
            name: "Golpe Mortal (Death Strike)",
            desc: "No 17º nível, quando você acertar uma criatura surpresa, ela deve fazer uma salvaguarda de Constituição (CD 8 + prof + mod DES). Em uma falha, **o dano do seu ataque é dobrado**!"
          }
        ]
      },
      {
        name: "Trapaceiro Arcano (Arcane Trickster)",
        icon: "✨",
        desc: "Ladinos astutos que mesclam suas trapaças com ilusões e encantamentos da magia arcana de mago.",
        features: [
          {
            level: 3,
            name: "Conjurador (1/3 Caster de Mago)",
            desc: "No 3º nível, você aprende a conjurar magias de Mago focadas em Encantamento e Ilusão.\n• **Atributo de Conjuração**: Inteligência (CD 8 + prof + mod INT; ataque = prof + mod INT)."
          },
          {
            level: 3,
            name: "Mãos Mágicas Furtivas (Mage Hand Legerdemain)",
            desc: "No 3º nível, quando você conjurar o truque *Mãos Mágicas*, a mão espectral é invisível e você pode controlá-la como Ação Bônus para colocar ou retirar objetos do bolso de outros ou usar ferramentas de ladrão à distância (até 9m)."
          },
          {
            level: 9,
            name: "Emboscada Mágica (Magical Ambush)",
            desc: "A partir do 9º nível, se você estiver escondido de uma criatura quando conjurar uma magia nela, a criatura tem **Desvantagem em qualquer salvaguarda** que fizer contra a magia naquele turno."
          },
          {
            level: 13,
            name: "Trapaça Versátil (Versatile Trickster)",
            desc: "No 13º nível, você pode usar uma Ação Bônus para fazer com que sua mão mágica distraia um alvo a até 1,5m dela, concedendo Vantagem em seus ataques contra ele até o fim do turno."
          },
          {
            level: 17,
            name: "Roubar Magia (Spell Thief)",
            desc: "No 17º nível, quando uma criatura conjurar uma magia com você como alvo, você pode usar sua **Reação** para forçá-la a fazer uma salvaguarda de conjuração. Em uma falha, você anula o efeito da magia e rouba o conhecimento dela por 8 horas (1x/descanso longo)."
          }
        ]
      }
    ]
  },

  // --------------------------------------------------------------------------
  // 9. MAGO
  // --------------------------------------------------------------------------
  {
    id: "mago",
    name: "Mago",
    icon: "🧙‍♂️",
    role: "Conjurador Erudito Supremo / Mestre dos Rituais",
    summary: "Eruditos supremos da magia arcana, estudando grimórios milenares para dobrar o tempo, o espaço e a realidade com feitiços lendários.",
    hitDie: "d6 (1d6 ou 4 PV por nível)",
    primaryAbility: "Inteligência",
    savingThrows: ["Inteligência", "Sabedoria"],
    armorProficiencies: "Nenhuma",
    weaponProficiencies: "Adagas, Dardos, Fundas, Bordões, Bestas Leves",
    skillProficiencies: "Escolha 2 entre: Arcanismo, História, Intuição, Investigação, Medicina e Religião",
    progression: [
      { level: 1, prof: "+2", features: "Conjurador, Recuperação Arcana", cantrips: "3", slots: "2 (1º)" },
      { level: 2, prof: "+2", features: "Tradição Arcana (Subclasse)", cantrips: "3", slots: "3 (1º)" },
      { level: 3, prof: "+2", features: "Magias de 2º Círculo", cantrips: "3", slots: "4/2 (1º/2º)" },
      { level: 4, prof: "+2", features: "Aumento no Valor de Atributo", cantrips: "4", slots: "4/3 (1º/2º)" },
      { level: 5, prof: "+3", features: "Magias de 3º Círculo", cantrips: "4", slots: "4/3/2 (1º-3º)" },
      { level: 6, prof: "+3", features: "Habilidade de Tradição Arcana", cantrips: "4", slots: "4/3/3 (1º-3º)" },
      { level: 7, prof: "+3", features: "Magias de 4º Círculo", cantrips: "4", slots: "4/3/3/1 (1º-4º)" },
      { level: 8, prof: "+3", features: "Aumento no Valor de Atributo", cantrips: "4", slots: "4/3/3/2 (1º-4º)" },
      { level: 9, prof: "+4", features: "Magias de 5º Círculo", cantrips: "4", slots: "4/3/3/3/1 (1º-5º)" },
      { level: 10, prof: "+4", features: "Habilidade de Tradição Arcana", cantrips: "5", slots: "4/3/3/3/2 (1º-5º)" },
      { level: 11, prof: "+4", features: "Magias de 6º Círculo", cantrips: "5", slots: "4/3/3/3/2/1 (1º-6º)" },
      { level: 12, prof: "+4", features: "Aumento no Valor de Atributo", cantrips: "5", slots: "4/3/3/3/2/1 (1º-6º)" },
      { level: 13, prof: "+5", features: "Magias de 7º Círculo", cantrips: "5", slots: "4/3/3/3/2/1/1 (1º-7º)" },
      { level: 14, prof: "+5", features: "Habilidade de Tradição Arcana", cantrips: "5", slots: "4/3/3/3/2/1/1 (1º-7º)" },
      { level: 15, prof: "+5", features: "Magias de 8º Círculo", cantrips: "5", slots: "4/3/3/3/2/1/1/1 (1º-8º)" },
      { level: 16, prof: "+5", features: "Aumento no Valor de Atributo", cantrips: "5", slots: "4/3/3/3/2/1/1/1 (1º-8º)" },
      { level: 17, prof: "+6", features: "Magias de 9º Círculo", cantrips: "5", slots: "4/3/3/3/2/1/1/1/1" },
      { level: 18, prof: "+6", features: "Maestria em Magia (Magias à vontade)", cantrips: "5", slots: "4/3/3/3/3/1/1/1/1" },
      { level: 19, prof: "+6", features: "Aumento no Valor de Atributo", cantrips: "5", slots: "4/3/3/3/3/2/1/1/1" },
      { level: 20, prof: "+6", features: "Assinatura de Magia (2 magias de 3º grátis)", cantrips: "5", slots: "4/3/3/3/3/2/2/1/1" }
    ],
    features: [
      {
        level: 1,
        name: "Grimório & Conjurador (Spellbook)",
        type: "Magia Arcana",
        desc: "Como estudante da magia arcana, você possui um grimório contendo as fórmulas de suas magias.\n• **Grimório**: No 1º nível, contém 6 magias de 1º círculo. Cada vez que sobe de nível de mago, você adiciona 2 magias de mago gratuitamente ao grimório.\n• **Copiar Magias**: Você pode adicionar qualquer magia que encontrar gastando 2 horas e 50 PO por círculo da magia.\n• **Preparação de Magias**: Você prepara magias iguais ao seu **modificador de Inteligência + seu nível de mago**.\n• **Rituais**: Você pode conjurar qualquer magia de mago do seu grimório como ritual mesmo se **NÃO** a tiver preparado!\n• **Atributo de Conjuração**: Inteligência (CD 8 + prof + mod INT; ataque = prof + mod INT)."
      },
      {
        level: 1,
        name: "Recuperação Arcana (Arcane Recovery)",
        type: "Recarga Mágica",
        desc: "Você aprendeu a recuperar parte de sua energia mágica através do estudo de seu grimório. Uma vez por dia, ao terminar um **Descanso Curto**, você pode recuperar espaços de magia gastos cujo nível combinado seja igual ou menor que a **metade do seu nível de mago** (arredondado para cima), e nenhum espaço pode ser de 6º círculo ou superior."
      },
      {
        level: 2,
        name: "Tradição Arcana (Arcane Tradition)",
        type: "Subclasse no Nível 2",
        desc: "No 2º nível, você escolhe uma tradição arcana que molda sua escola de magia: *Escola de Evocação*, *Abjuração*, *Adivinhação*, *Encantamento*, *Ilusão*, *Necromancia*, *Transmutação* ou *Conjuração*. Sua escolha concede habilidades no 2º, 6º, 10º e 14º níveis."
      },
      {
        level: 18,
        name: "Maestria em Magia (Spell Mastery)",
        type: "Altíssima Magia",
        desc: "No 18º nível, você alcança um domínio tão profundo sobre certas magias que pode conjurá-las à vontade. Escolha **uma magia de 1º círculo e uma magia de 2º círculo** de seu grimório. Você pode conjurar essas duas magias em seu menor círculo **sem gastar qualquer espaço de magia** quando as tiver preparado!"
      },
      {
        level: 20,
        name: "Assinatura de Magia (Signature Spells)",
        type: "Ápice Épico",
        desc: "No 20º nível, você adquire mestria sobre duas poderosas magias. Escolha **duas magias de mago de 3º círculo** em seu grimório. Elas estão sempre preparadas, não contam no seu limite de magias preparadas, e você pode conjurar cada uma delas uma vez no 3º círculo sem gastar espaço de magia a cada Descanso Curto ou Longo."
      }
    ],
    subclasses: [
      {
        name: "Escola de Evocação (School of Evocation)",
        icon: "🔥",
        desc: "Magos que dominam o poder bruto dos elementos, criando explosões fulminantes de fogo, relâmpagos e gelo protegendo seus aliados.",
        features: [
          {
            level: 2,
            name: "Especialista em Evocação",
            desc: "No 2º nível, o ouro e o tempo que você precisa gastar para copiar uma magia de evocação para o seu grimório são reduzidos pela metade."
          },
          {
            level: 2,
            name: "Esculpir Magias (Sculpt Spells)",
            desc: "A partir do 2º nível, você pode criar bolsões de segurança relativa em meio aos seus feitiços de evocação. Quando você conjurar uma magia de evocação que afete outras criaturas que você possa ver, você pode escolher um número de criaturas igual a **1 + o círculo da magia**. As criaturas escolhidas são automaticamente bem-sucedidas em suas salvaguardas e **não sofrem qualquer dano** se normalmente sofreriam metade."
          },
          {
            level: 6,
            name: "Truque Potente (Potent Cantrip)",
            desc: "A partir do 6º nível, seus truques que exigem salvaguarda afetam até alvos resilientes. Quando uma criatura for bem-sucedida em uma salvaguarda contra um truque seu, ela sofre **metade do dano do truque** (se houver) em vez de não sofrer dano."
          },
          {
            level: 10,
            name: "Potencializar Evocação (Empowered Evocation)",
            desc: "A partir do 10º nível, você pode adicionar seu **modificador de Inteligência** a uma jogada de dano de qualquer magia de evocação de mago que você conjurar."
          },
          {
            level: 14,
            name: "Sobrecarga (Overchannel)",
            desc: "A partir do 14º nível, você pode aumentar o poder das suas magias mais simples. Quando conjurar uma magia de mago de 1º a 5º círculo que cause dano, você pode causar o **dano máximo possível** naquela magia. Na primeira vez não há custo; se usar novamente antes de um descanso longo, você sofre 2d12 de dano necrótico por círculo da magia imediatamente."
          }
        ]
      },
      {
        name: "Escola de Abjuração (School of Abjuration)",
        icon: "🛡️",
        desc: "Magos dedicados à proteção mágica, erguendo barreiras arcanas impenetráveis e anulando as magias de inimigos.",
        features: [
          {
            level: 2,
            name: "Especialista em Abjuração",
            desc: "No 2º nível, copiar magias de abjuração custa metade do ouro e do tempo."
          },
          {
            level: 2,
            name: "Projeção Arcana (Arcane Ward)",
            desc: "No 2º nível, quando você conjurar uma magia de abjuração de 1º círculo ou superior, você cria uma barreira protetora mágica com PV máximos iguais a **2 x seu nível de mago + seu mod Inteligência**. Sempre que você sofrer dano, a barreira sofre o dano no seu lugar. Sempre que conjurar uma abjuração, a barreira recupera PV iguais ao dobro do círculo da magia."
          },
          {
            level: 6,
            name: "Projeção Projetada (Projected Ward)",
            desc: "No 6º nível, quando uma criatura que você possa ver a até 9 metros sofrer dano, você pode usar sua **Reação** para fazer sua Projeção Arcana absorver aquele dano."
          },
          {
            level: 10,
            name: "Abjuração Aprimorada (Improved Abjuration)",
            desc: "A partir do 10º nível, sempre que fizer um teste de habilidade como parte de uma magia (como *Contramágica* e *Dissipar Magia*), adicione o seu **Bônus de Proficiência** ao teste."
          },
          {
            level: 14,
            name: "Resistência à Magia (Spell Resistance)",
            desc: "No 14º nível, você tem **Vantagem em salvaguardas contra magias** e possui **Resistência contra o dano causado por qualquer magia**."
          }
        ]
      },
      {
        name: "Escola de Adivinhação (School of Divination)",
        icon: "🔮",
        desc: "Magos videntes que desvelam os véus do tempo e do espaço, manipulando o destino antes que os eventos aconteçam.",
        features: [
          {
            level: 2,
            name: "Portento (Portent)",
            desc: "A partir do 2º nível, vislumbres do futuro pairam sobre você. Ao terminar um descanso longo, **role dois d20 e anote os resultados**. Você pode substituir qualquer jogada de ataque, teste de habilidade ou salvaguarda feita por você ou por uma criatura que você veja por um desses dados de portento. Cada dado só pode ser usado uma vez por dia."
          },
          {
            level: 6,
            name: "Adivinho Experiente (Expert Divination)",
            desc: "No 6º nível, quando você conjurar uma magia de adivinhação de 2º círculo ou superior, você recupera um espaço de magia gasto de um círculo inferior ao da magia conjurada."
          },
          {
            level: 10,
            name: "O Terceiro Olho (The Third Eye)",
            desc: "No 10º nível, você pode usar uma ação para adquirir visão no escuro (18m), visão etérea, capacidade de ler qualquer idioma ou visão do invisível até ficar incapacitado."
          },
          {
            level: 14,
            name: "Portento Maior (Greater Portent)",
            desc: "No 14º nível, suas visões se aprofundam. Você passa a rolar **três dados d20** para a sua característica de Portento a cada descanso longo."
          }
        ]
      }
    ]
  },

  // --------------------------------------------------------------------------
  // 10. MONGE
  // --------------------------------------------------------------------------
  {
    id: "monge",
    name: "Monge",
    icon: "🥋",
    role: "Lutador Desarmado / Mestre do Ki",
    summary: "Mestres ascéticos da energia vital cósmica (Ki), transformando seus corpos em armas letais velozes como o vento.",
    hitDie: "d8 (1d8 ou 5 PV por nível)",
    primaryAbility: "Destreza e Sabedoria",
    savingThrows: ["Força", "Destreza"],
    armorProficiencies: "Nenhuma",
    weaponProficiencies: "Armas Simples, Espadas Curtas",
    skillProficiencies: "Escolha 2 entre: Acrobacia, Atletismo, História, Intuição, Religião e Furtividade",
    progression: [
      { level: 1, prof: "+2", features: "Defesa sem Armadura, Artes Marciais (1d4)", martialArts: "1d4", ki: "-", speed: "-" },
      { level: 2, prof: "+2", features: "Ki (2 pontos), Movimento sem Armadura (+3m)", martialArts: "1d4", ki: "2", speed: "+3m" },
      { level: 3, prof: "+2", features: "Tradição Monástica, Defletir Projéteis", martialArts: "1d4", ki: "3", speed: "+3m" },
      { level: 4, prof: "+2", features: "Aumento no Valor de Atributo, Queda Suave", martialArts: "1d4", ki: "4", speed: "+3m" },
      { level: 5, prof: "+3", features: "Ataque Extra, Ataque Atordoante (Stunning Strike)", martialArts: "1d6", ki: "5", speed: "+3m" },
      { level: 6, prof: "+3", features: "Golpes de Ki (Mágicos), Habilidade de Tradição", martialArts: "1d6", ki: "6", speed: "+4,5m" },
      { level: 7, prof: "+3", features: "Evasão, Mente Tranquila", martialArts: "1d6", ki: "7", speed: "+4,5m" },
      { level: 8, prof: "+3", features: "Aumento no Valor de Atributo", martialArts: "1d6", ki: "8", speed: "+4,5m" },
      { level: 9, prof: "+4", features: "Movimento sem Armadura Aprimorado (Paredes/Água)", martialArts: "1d6", ki: "9", speed: "+4,5m" },
      { level: 10, prof: "+4", features: "Pureza Corporal (Imunidade a Doenças e Venenos)", martialArts: "1d6", ki: "10", speed: "+6m" },
      { level: 11, prof: "+4", features: "Habilidade de Tradição Monástica", martialArts: "1d8", ki: "11", speed: "+6m" },
      { level: 12, prof: "+4", features: "Aumento no Valor de Atributo", martialArts: "1d8", ki: "12", speed: "+6m" },
      { level: 13, prof: "+5", features: "Língua do Sol e da Lua (Todos os Idiomas)", martialArts: "1d8", ki: "13", speed: "+6m" },
      { level: 14, prof: "+5", features: "Alma de Diamante (Proficiência em Todas Salvaguardas)", martialArts: "1d8", ki: "14", speed: "+7,5m" },
      { level: 15, prof: "+5", features: "Corpo Atemporal", martialArts: "1d8", ki: "15", speed: "+7,5m" },
      { level: 16, prof: "+5", features: "Aumento no Valor de Atributo", martialArts: "1d8", ki: "16", speed: "+7,5m" },
      { level: 17, prof: "+6", features: "Habilidade de Tradição Monástica", martialArts: "1d10", ki: "17", speed: "+7,5m" },
      { level: 18, prof: "+6", features: "Corpo Vazio (Invisibilidade & Resistências)", martialArts: "1d10", ki: "18", speed: "+9m" },
      { level: 19, prof: "+6", features: "Aumento no Valor de Atributo", martialArts: "1d10", ki: "19", speed: "+9m" },
      { level: 20, prof: "+6", features: "Auto-Perfeição (Recupera 4 Ki na Iniciativa)", martialArts: "1d10", ki: "20", speed: "+9m" }
    ],
    features: [
      {
        level: 1,
        name: "Defesa sem Armadura (Unarmored Defense)",
        type: "Passiva",
        desc: "Enquanto não estiver usando qualquer armadura nem empunhando um escudo, sua Classe de Armadura (CA) é igual a **10 + modificador de Destreza + modificador de Sabedoria**."
      },
      {
        level: 1,
        name: "Artes Marciais (Martial Arts)",
        type: "Ataque Desarmado",
        desc: "Seu treinamento nas artes marciais confere a você mestria em combate desarmado e com armas de monge (espadas curtas e armas simples corpo a corpo que não tenham a propriedade de duas mãos ou pesadas):\n• Você pode usar **Destreza em vez de Força** para jogadas de ataque e dano.\n• Você pode rolar um **d4** no lugar do dano normal do seu ataque desarmado (o dado escala para d6 no Nv 5, d8 no Nv 11 e d10 no Nv 17).\n• Quando você usar a ação de Ataque com um ataque desarmado ou arma de monge no seu turno, você pode desferir **um ataque desarmado adicional como Ação Bônus**."
      },
      {
        level: 2,
        name: "Ki (Energia Vital)",
        type: "Poder Místico",
        desc: "A partir do 2º nível, seu treinamento permite que você canalize a energia mística do Ki. Você possui um número de **Pontos de Ki igual ao seu nível de monge** que recarregam ao terminar um **Descanso Curto ou Longo** (CD de salvaguarda do Ki = 8 + prof + mod SAB):\n• **Rajada de Golpes (Flurry of Blows)**: Imediatamente após realizar a ação de Ataque, gaste 1 ponto de Ki para desferir **dois ataques desarmados como Ação Bônus**.\n• **Defesa Paciente (Patient Defense)**: Gaste 1 ponto de Ki para realizar a ação de **Esquivar (Dodge) como Ação Bônus** no seu turno.\n• **Passo do Vento (Step of the Wind)**: Gaste 1 ponto de Ki para realizar a ação de **Desengajar ou Correr como Ação Bônus**, e sua distância de salto é dobrada naquele turno."
      },
      {
        level: 2,
        name: "Movimento sem Armadura (Unarmored Movement)",
        type: "Velocidade",
        desc: "A partir do 2º nível, seu deslocamento aumenta em **+3 metros** enquanto não estiver vestindo armadura nem empunhando escudo (+4,5m no Nv 6, +6m no Nv 10, +7,5m no Nv 14 e +9m no Nv 18). No 9º nível, você adquire a habilidade de correr ao longo de superfícies verticais e através de líquidos sem afundar."
      },
      {
        level: 3,
        name: "Defletir Projéteis (Deflect Missiles)",
        type: "Reação",
        desc: "No 3º nível, você pode usar sua **Reação** para defletir ou apanhar o projétil quando for atingido por um ataque com arma de ataque à distância. O dano que você sofrer é reduzido em **1d10 + seu modificador de Destreza + seu nível de monge**. Se o dano for reduzido a 0, você pode apanhar o projétil e gastar 1 ponto de Ki para arremessá-lo de volta imediatamente."
      },
      {
        level: 5,
        name: "Ataque Atordoante (Stunning Strike)",
        type: "Controle em Ataque",
        desc: "A partir do 5º nível, você pode interferir no fluxo de Ki do corpo dos seus oponentes. Quando acertar outra criatura com um ataque corpo a corpo com arma, você pode gastar **1 ponto de Ki**. O alvo deve ser bem-sucedido em uma **salvaguarda de Constituição** ou ficará **Atordoado (Stunned)** até o fim do seu próximo turno!"
      },
      {
        level: 6,
        name: "Golpes de Ki (Ki-Empowered Strikes)",
        type: "Ataque Mágico",
        desc: "A partir do 6º nível, seus ataques desarmados contam como **mágicos** com o propósito de sobrepujar resistência e imunidade a ataques e danos não-mágicos."
      },
      {
        level: 7,
        name: "Evasão (Evasion)",
        type: "Defesa",
        desc: "No 7º nível, seu reflexo agilíssimo permite esquivar de efeitos em área. Se for alvo de efeito com salvaguarda de DES para sofrer metade do dano, você sofre **dano zero se passar**, e apenas metade do dano se falhar."
      },
      {
        level: 14,
        name: "Alma de Diamante (Diamond Body)",
        type: "Mestria em Salvaguardas",
        desc: "A partir do 14º nível, sua mestria de Ki concede a você **proficiência em TODAS as salvaguardas**! Além disso, sempre que falhar em uma salvaguarda, você pode gastar 1 ponto de Ki para jogá-la novamente."
      },
      {
        level: 20,
        name: "Auto-Perfeição (Empty Body)",
        type: "Ápice Épico",
        desc: "No 20º nível, quando você rolar Iniciativa e não tiver nenhum ponto de Ki restante, você recupera **4 pontos de Ki imediatamente**."
      }
    ],
    subclasses: [
      {
        name: "Caminho da Mão Aberta (Way of the Open Hand)",
        icon: "✋",
        desc: "Mestres supremos das técnicas de combate desarmado, empurrando, derrubando e desferindo a lendária Palma Trêmula.",
        features: [
          {
            level: 3,
            name: "Técnica da Mão Aberta",
            desc: "A partir do 3º nível, sempre que você acertar uma criatura com um dos ataques da sua Rajada de Golpes, você pode impor um dos seguintes efeitos ao alvo:\n• Ele deve ser bem-sucedido em salvaguarda de Destreza ou é **derrubado no chão**.\n• Ele deve ser bem-sucedido em salvaguarda de Força ou é **empurrado até 4,5 metros** para longe de você.\n• Ele não pode realizar reações até o fim do seu próximo turno."
          },
          {
            level: 6,
            name: "Totalidade Corporal (Wholeness of Body)",
            desc: "No 6º nível, você adquire a habilidade de se curar. Como uma Ação, você pode recuperar um número de Pontos de Vida igual a **3 vezes o seu nível de monge** (1x/descanso longo)."
          },
          {
            level: 11,
            name: "Mente Serena (Tranquility)",
            desc: "No 11º nível, ao término de um descanso longo, você ganha o efeito da magia *Santuário* que dura até o início do seu próximo descanso longo ou até você atacar."
          },
          {
            level: 17,
            name: "Palma Trêmula (Quivering Palm)",
            desc: "No 17º nível, você adquire a habilidade de criar vibrações letais no corpo de uma criatura. Ao acertar com ataque desarmado, gaste 3 pontos de Ki para iniciar as vibrações imperceptíveis. Dias depois, você pode usar sua Ação para forçar o alvo a realizar uma salvaguarda de Constituição: se falhar, **cai instantaneamente para 0 PV**; se passar, sofre **10d10 de dano necrótico**."
          }
        ]
      },
      {
        name: "Caminho da Sombra (Way of Shadow)",
        icon: "🌑",
        desc: "Guerreiros silenciosos que canalizam as sombras como ninjas e assassinos furtivos.",
        features: [
          {
            level: 3,
            name: "Artes das Sombras (Shadow Arts)",
            desc: "No 3º nível, você pode gastar 2 pontos de Ki para conjurar as magias *Escuridão*, *Visão no Escuro*, *Passo sem Rastros* ou *Silêncio* sem componentes materiais. Você também aprende o truque *Ilusão Menor*."
          },
          {
            level: 6,
            name: "Passo das Sombras (Shadow Step)",
            desc: "No 6º nível, quando você estiver na penumbra ou na escuridão, você pode usar uma **Ação Bônus para se teletransportar até 18 metros** para outro espaço desocupado que também esteja na penumbra ou escuridão, ganhando Vantagem no seu primeiro ataque corpo a corpo antes do fim do turno."
          },
          {
            level: 11,
            name: "Manto de Sombras (Cloak of Shadows)",
            desc: "No 11º nível, quando estiver na penumbra ou escuridão, você pode usar sua Ação para se tornar **completamente invisível** até atacar ou conjurar uma magia."
          },
          {
            level: 17,
            name: "Oportunista (Opportunist)",
            desc: "No 17º nível, quando uma criatura a até 1,5m for acertada por um ataque de alguém que não seja você, você pode usar sua **Reação** para desferir um ataque corpo a corpo contra ela."
          }
        ]
      }
    ]
  },

  // --------------------------------------------------------------------------
  // 11. PALADINO
  // --------------------------------------------------------------------------
  {
    id: "paladino",
    name: "Paladino",
    icon: "🛡️",
    role: "Guerreiro Santo / Linha de Frente / Suporte",
    summary: "Cavaleiros juramentados a causas nobres e divinas, infundindo suas lâminas com destruição radiante e emanando auras protetoras.",
    hitDie: "d10 (1d10 ou 6 PV por nível)",
    primaryAbility: "Força e Carisma",
    savingThrows: ["Sabedoria", "Carisma"],
    armorProficiencies: "Todas as armaduras (Leves, Médias, Pesadas) e Escudos",
    weaponProficiencies: "Armas Simples e Armas Marciais",
    skillProficiencies: "Escolha 2 entre: Atletismo, Intuição, Intimidação, Medicina, Persuasão e Religião",
    progression: [
      { level: 1, prof: "+2", features: "Sentido Divino, Cura pelas Mãos" },
      { level: 2, prof: "+2", features: "Estilo de Luta, Conjurador, Destruição Divina (Divine Smite)", slots: "2 (1º)" },
      { level: 3, prof: "+2", features: "Saúde Divina, Juramento Sagrado (Subclasse), Canalizar Divindade", slots: "3 (1º)" },
      { level: 4, prof: "+2", features: "Aumento no Valor de Atributo", slots: "3 (1º)" },
      { level: 5, prof: "+3", features: "Ataque Extra, Magias de 2º Círculo", slots: "4/2 (1º/2º)" },
      { level: 6, prof: "+3", features: "Aura de Proteção (+mod CAR em todas salvaguardas)", slots: "4/2 (1º/2º)" },
      { level: 7, prof: "+3", features: "Habilidade de Juramento Sagrado", slots: "4/3 (1º/2º)" },
      { level: 8, prof: "+3", features: "Aumento no Valor de Atributo", slots: "4/3 (1º/2º)" },
      { level: 9, prof: "+4", features: "Magias de 3º Círculo", slots: "4/3/2 (1º-3º)" },
      { level: 10, prof: "+4", features: "Aura de Coragem (Imunidade a Amedrontado)", slots: "4/3/2 (1º-3º)" },
      { level: 11, prof: "+4", features: "Destruição Divina Aprimorada (+1d8 radiante passivo)", slots: "4/3/3 (1º-3º)" },
      { level: 12, prof: "+4", features: "Aumento no Valor de Atributo", slots: "4/3/3 (1º-3º)" },
      { level: 13, prof: "+5", features: "Magias de 4º Círculo", slots: "4/3/3/1 (1º-4º)" },
      { level: 14, prof: "+5", features: "Toque Purificador (Encerra Magias)", slots: "4/3/3/1 (1º-4º)" },
      { level: 15, prof: "+5", features: "Habilidade de Juramento Sagrado", slots: "4/3/3/2 (1º-4º)" },
      { level: 16, prof: "+5", features: "Aumento no Valor de Atributo", slots: "4/3/3/2 (1º-4º)" },
      { level: 17, prof: "+6", features: "Magias de 5º Círculo", slots: "4/3/3/3/1 (1º-5º)" },
      { level: 18, prof: "+6", features: "Auras Aprimoradas (Raio de 9 metros)", slots: "4/3/3/3/1 (1º-5º)" },
      { level: 19, prof: "+6", features: "Aumento no Valor de Atributo", slots: "4/3/3/3/2 (1º-5º)" },
      { level: 20, prof: "+6", features: "Campeão Sagrado (Transformação Suprema)", slots: "4/3/3/3/2 (1º-5º)" }
    ],
    features: [
      {
        level: 1,
        name: "Sentido Divino (Divine Sense)",
        type: "Detecção Sagrada",
        desc: "A presença do mal poderoso ressoa em seus sentidos como um odor nocivo. Como uma Ação, você pode expandir sua consciência para detectar a localização de qualquer celestial, corruptor ou morto-vivo a até **18 metros de você** que não esteja sob cobertura total. Você pode usar esta característica um número de vezes igual a **1 + seu modificador de Carisma** (recupera todos os usos em um Descanso Longo)."
      },
      {
        level: 1,
        name: "Cura pelas Mãos (Lay on Hands)",
        type: "Toque Curativo",
        desc: "Seu toque abençoado pode curar ferimentos. Você possui uma reserva de poder curativo que se restaura após um Descanso Longo. Com essa reserva, você pode restaurar um número total de Pontos de Vida igual ao seu **nível de paladino x 5**.\n• Como uma Ação, você pode tocar uma criatura e drenar poder da sua reserva para restaurar PV.\n• Alternativamente, você pode gastar **5 pontos** de cura para curar o alvo de uma doença ou neutralizar um veneno que o afete."
      },
      {
        level: 2,
        name: "Estilo de Luta (Fighting Style)",
        type: "Especialização",
        desc: "No 2º nível, você adota um estilo de combate: *Defesa* (+1 CA com armadura), *Duelo* (+2 no dano com arma de uma mão), *Combate com Armas Grandes* (rerrola 1 e 2 no dano) ou *Proteção* (impõe desvantagem em ataque contra aliado usando reação e escudo)."
      },
      {
        level: 2,
        name: "Conjurador (Spellcasting)",
        type: "Magia Divina",
        desc: "A partir do 2º nível, você aprende a canalizar magia divina através de preces e convicção.\n• **Preparação de Magias**: Você prepara um número de magias igual ao seu **modificador de Carisma + metade do seu nível de paladino** (mínimo 1).\n• **Atributo de Conjuração**: Carisma (CD 8 + prof + mod CAR; ataque = prof + mod CAR)."
      },
      {
        level: 2,
        name: "Destruição Divina (Divine Smite)",
        type: "Dano Sagrado em Ataque",
        desc: "A partir do 2º nível, quando você acertar uma criatura com um ataque corpo a corpo com arma, você pode gastar um espaço de magia de paladino para causar **dano radiante extra**, além do dano normal da arma:\n• O dano extra é de **2d8 para um espaço de 1º círculo**, mais **1d8 para cada círculo de magia acima do 1º** (até um máximo de 5d8).\n• O dano aumenta em **+1d8 adicional** se o alvo for um morto-vivo ou um corruptor (fiend)!\n• **D&D 5E Canônico**: Destruição Divina **NÃO consome Ação nem Ação Bônus**; você decide usá-la imediatamente após confirmar que o ataque acertou!"
      },
      {
        level: 3,
        name: "Saúde Divina (Divine Health)",
        type: "Imunidade",
        desc: "No 3º nível, a magia divina flui tão intensamente através de você que você é **imune a todas as doenças**."
      },
      {
        level: 3,
        name: "Juramento Sagrado (Sacred Oath)",
        type: "Subclasse no Nível 3",
        desc: "No 3º nível, você faz o juramento que o vincula para sempre como um paladino sagrado: o clássico *Juramento de Devoção*, o verdejante *Juramento dos Anciões* ou o implacável *Juramento de Vingança*. Sua escolha concede magias de juramento e características no 3º, 7º, 15º e 20º níveis."
      },
      {
        level: 3,
        name: "Canalizar Divindade (Channel Divinity)",
        type: "Poder de Juramento",
        desc: "No 3º nível, seu juramento concede a você a habilidade de canalizar energia divina para alimentar efeitos mágicos. Você recupera seu uso de Canalizar Divindade ao terminar um **Descanso Curto ou Longo**."
      },
      {
        level: 5,
        name: "Ataque Extra (Extra Attack)",
        type: "Ataque",
        desc: "A partir do 5º nível, você pode atacar duas vezes, em vez de uma, sempre que realizar a ação de Ataque no seu turno."
      },
      {
        level: 6,
        name: "Aura de Proteção (Aura of Protection)",
        type: "Aura Sagrada",
        desc: "A partir do 6º nível, sempre que você ou uma criatura amigável a até **3 metros de você** tiver que fazer uma salvaguarda, a criatura ganha um bônus na salvaguarda igual ao seu **modificador de Carisma** (com um bônus mínimo de +1). O alcance aumenta para 9 metros no 18º nível."
      },
      {
        level: 10,
        name: "Aura de Coragem (Aura of Courage)",
        type: "Aura de Coragem",
        desc: "A partir do 10º nível, você e criaturas amigáveis a até **3 metros de você** não podem ser **Amedrontadas** enquanto você estiver consciente. O alcance aumenta para 9 metros no 18º nível."
      },
      {
        level: 11,
        name: "Destruição Divina Aprimorada (Improved Divine Smite)",
        type: "Dano Passivo",
        desc: "No 11º nível, você está tão transbordante de virtude justa que todos os seus golpes carregam poder divino. Sempre que você acertar uma criatura com um ataque corpo a corpo com arma, a criatura sofre **1d8 de dano radiante adicional** (passivo em todos os ataques, sem gastar slots!)."
      },
      {
        level: 14,
        name: "Toque Purificador (Cleansing Touch)",
        type: "Purificação",
        desc: "A partir do 14º nível, você pode usar sua Ação para encerrar uma magia em si mesmo ou em uma criatura voluntária que você tocar. Você pode usar esta característica um número de vezes igual ao seu modificador de Carisma por descanso longo."
      }
    ],
    subclasses: [
      {
        name: "Juramento de Devoção (Oath of Devotion)",
        icon: "⚔️",
        desc: "O ideal do cavaleiro de armadura brilhante, comprometido com a honra, a justiça, a coragem e a compaixão.",
        features: [
          {
            level: 3,
            name: "Canalizar Divindade: Arma Sagrada",
            desc: "Como Ação, você imbui uma arma que esteja segurando com energia positiva por 1 minuto. Você adiciona seu **modificador de Carisma em todas as jogadas de ataque** com aquela arma e ela emite luz plena em um raio de 6 metros."
          },
          {
            level: 3,
            name: "Canalizar Divindade: Expulsar o Profano",
            desc: "Como uma Ação, você ergue seu símbolo sagrado e força cada corruptor (fiend) e morto-vivo a até 9m a realizar uma salvaguarda de Sabedoria. Se falharem, são expulsos por 1 minuto."
          },
          {
            level: 7,
            name: "Aura de Devoção (Aura of Devotion)",
            desc: "A partir do 7º nível, você e criaturas amigáveis a até 3m (9m no 18º nível) **não podem ser Enfeitiçadas** enquanto você estiver consciente."
          },
          {
            level: 15,
            name: "Pureza de Espírito (Purity of Spirit)",
            desc: "No 15º nível, você está sempre sob os efeitos da magia *Proteção contra o Bem e Mal*."
          },
          {
            level: 20,
            name: "Auréola Sagrada (Holy Nimbus)",
            desc: "No 20º nível, como uma Ação, você pode emanar uma aura de luz solar de 9m por 1 minuto. Criaturas hostis na luz sofrem **10 de dano radiante** no início de seus turnos, e você tem Vantagem em salvaguardas contra magias conjuradas por fiends ou mortos-vivos (1x/descanso longo)."
          }
        ]
      },
      {
        name: "Juramento dos Anciões (Oath of the Ancients)",
        icon: "🍃",
        desc: "Cavaleiros verdes que amam a beleza, a luz e a preservação da vida selvagem contra o desespero e a escuridão.",
        features: [
          {
            level: 3,
            name: "Canalizar Divindade: Fúria da Natureza",
            desc: "Como uma Ação, você faz com que vinhas fantasmagóricas brotem do chão e tentem prender uma criatura a até 3m (salvaguarda de Força ou Destreza ou fica Contida)."
          },
          {
            level: 3,
            name: "Canalizar Divindade: Expulsar os Infiéis",
            desc: "Como uma Ação, cada fada e corruptor a até 9 metros deve fazer salvaguarda de Sabedoria ou é expulso por 1 minuto."
          },
          {
            level: 7,
            name: "Aura de Proteção Mágica (Aura of Warding)",
            desc: "A partir do 7º nível, a magia antiga é tão forte ao seu redor que você e criaturas amigáveis na sua aura têm **Resistência a dano causado por magias**!"
          },
          {
            level: 15,
            name: "Sentinela Imorredouro (Undying Sentinel)",
            desc: "A partir do 15º nível, quando você for reduzido a 0 PV mas não morto, pode optar por ficar com 1 PV (1x/descanso longo). Além disso, você não sofre os efeitos prejudiciais da idade e não pode ser envelhecido magicamente."
          },
          {
            level: 20,
            name: "Campeão Ancião (Elder Champion)",
            desc: "No 20º nível, você pode assumir a forma de uma força viva da natureza por 1 minuto: recupera 10 PV no início de cada turno, pode conjurar magias de paladino com tempo de 1 Ação como Ação Bônus, e inimigos a até 3m têm desvantagem em salvaguardas contra suas magias (1x/descanso longo)."
          }
        ]
      },
      {
        name: "Juramento de Vingança (Oath of Vengeance)",
        icon: "⚖️",
        desc: "Uma promessa solene de punir aqueles que cometeram atrocidades hediondas, perseguindo os culpados com justiça implacável.",
        features: [
          {
            level: 3,
            name: "Canalizar Divindade: Voto de Inimizade (Vow of Enmity)",
            desc: "Como uma **Ação Bônus**, você profere um voto contra uma criatura a até 9 metros. Você ganha **Vantagem em todas as jogadas de ataque contra aquela criatura por 1 minuto** ou até ela cair a 0 PV."
          },
          {
            level: 3,
            name: "Canalizar Divindade: Abjurar Inimigo",
            desc: "Como uma Ação, você aterroriza uma criatura a até 18m. Em uma falha na salvaguarda de Sabedoria, ela fica amedrontada e sua velocidade cai para 0 por 1 minuto."
          },
          {
            level: 7,
            name: "Vingador Implacável (Relentless Avenger)",
            desc: "A partir do 7º nível, quando você acertar uma criatura com um ataque de oportunidade, você pode se mover até metade do seu deslocamento imediatamente como parte da mesma reação, sem provocar ataques de oportunidade."
          },
          {
            level: 15,
            name: "Alma Vingativa (Soul of Vengeance)",
            desc: "No 15º nível, quando uma criatura sob o seu Voto de Inimizade fizer um ataque, você pode usar sua **Reação** para desferir um ataque corpo a corpo com arma contra ela se estiver ao alcance."
          },
          {
            level: 20,
            name: "Anjo Vingador (Avenging Angel)",
            desc: "No 20º nível, você assume a forma de um anjo vingador alado por 1 hora: asas brotam dando deslocamento de Voo de 18m, e você emana uma aura de terror de 9m que força salvaguardas de Sabedoria contra amedrontado (1x/descanso longo)."
          }
        ]
      }
    ]
  },

  // --------------------------------------------------------------------------
  // 12. PATRULHEIRO
  // --------------------------------------------------------------------------
  {
    id: "patrulheiro",
    name: "Patrulheiro",
    icon: "🏹",
    role: "Rastreador Selvagem / Combatente Especialista",
    summary: "Guerreiros implacáveis das fronteiras selvagens, especializados em caçar monstros terríveis e dominar o terreno inóspito.",
    hitDie: "d10 (1d10 ou 6 PV por nível)",
    primaryAbility: "Destreza e Sabedoria",
    savingThrows: ["Força", "Destreza"],
    armorProficiencies: "Armaduras Leves, Armaduras Médias e Escudos",
    weaponProficiencies: "Armas Simples e Armas Marciais",
    skillProficiencies: "Escolha 3 entre: Adestrar Animais, Atletismo, Furtividade, Intuição, Investigação, Natureza, Percepção e Sobrevivência",
    progression: [
      { level: 1, prof: "+2", features: "Inimigo Favorito, Explorador Natural" },
      { level: 2, prof: "+2", features: "Estilo de Luta, Conjurador", slots: "2 (1º)" },
      { level: 3, prof: "+2", features: "Arquétipo de Patrulheiro (Subclasse), Prontidão Primeva", slots: "3 (1º)" },
      { level: 4, prof: "+2", features: "Aumento no Valor de Atributo", slots: "3 (1º)" },
      { level: 5, prof: "+3", features: "Ataque Extra, Magias de 2º Círculo", slots: "4/2 (1º/2º)" },
      { level: 6, prof: "+3", features: "Melhorias de Inimigo Favorito e Explorador Natural", slots: "4/2 (1º/2º)" },
      { level: 7, prof: "+3", features: "Habilidade do Arquétipo", slots: "4/3 (1º/2º)" },
      { level: 8, prof: "+3", features: "Aumento no Valor de Atributo, Passo da Terra", slots: "4/3 (1º/2º)" },
      { level: 9, prof: "+4", features: "Magias de 3º Círculo", slots: "4/3/2 (1º-3º)" },
      { level: 10, prof: "+4", features: "Esconder-se em Plena Vista, Melhoria de Terreno", slots: "4/3/2 (1º-3º)" },
      { level: 11, prof: "+4", features: "Habilidade do Arquétipo", slots: "4/3/3 (1º-3º)" },
      { level: 12, prof: "+4", features: "Aumento no Valor de Atributo", slots: "4/3/3 (1º-3º)" },
      { level: 13, prof: "+5", features: "Magias de 4º Círculo", slots: "4/3/3/1 (1º-4º)" },
      { level: 14, prof: "+5", features: "Desaparecer, Melhoria de Inimigo Favorito", slots: "4/3/3/1 (1º-4º)" },
      { level: 15, prof: "+5", features: "Habilidade do Arquétipo", slots: "4/3/3/2 (1º-4º)" },
      { level: 16, prof: "+5", features: "Aumento no Valor de Atributo", slots: "4/3/3/2 (1º-4º)" },
      { level: 17, prof: "+6", features: "Magias de 5º Círculo", slots: "4/3/3/3/1 (1º-5º)" },
      { level: 18, prof: "+6", features: "Sentidos Ferais", slots: "4/3/3/3/1 (1º-5º)" },
      { level: 19, prof: "+6", features: "Aumento no Valor de Atributo", slots: "4/3/3/3/2 (1º-5º)" },
      { level: 20, prof: "+6", features: "Matador de Inimigos (+mod SAB no ataque/dano)", slots: "4/3/3/3/2 (1º-5º)" }
    ],
    features: [
      {
        level: 1,
        name: "Inimigo Favorito (Favored Enemy)",
        type: "Especialidade",
        desc: "A partir do 1º nível, você possui profunda experiência estudando e caçando um tipo de criatura específico (como aberrações, dragões, mortos-vivos, feras, gigantes ou dois tipos de humanoides):\n• Você tem **Vantagem em testes de Sabedoria (Sobrevivência)** para rastrear seus inimigos favoritos.\n• Você tem **Vantagem em testes de Inteligência** para recordar informações sobre eles.\n• Você aprende um idioma falado por esses inimigos. Você escolhe inimigos adicionais no 6º e 14º níveis."
      },
      {
        level: 1,
        name: "Explorador Natural (Natural Explorer)",
        type: "Sobrevivência",
        desc: "Você é mestre em navegar um tipo específico de terreno natural (Ártico, Costa, Deserto, Floresta, Montanha, Pântano, Pradaria ou Subterrâneo):\n• Terreno difícil não atrasa a viagem do seu grupo.\n• Seu grupo não pode se perder exceto por meios mágicos.\n• Você permanece alerta ao perigo mesmo quando estiver engajado em outra atividade enquanto viaja (como forragear ou rastrear).\n• Ao forragear, encontra o dobro de comida que o normal.\n• Ao rastrear, aprende o número exato, tamanhos e há quanto tempo as criaturas passaram."
      },
      {
        level: 2,
        name: "Estilo de Luta (Fighting Style)",
        type: "Especialização",
        desc: "No 2º nível, você adota um estilo de combate: *Arquearia* (+2 no ataque à distância), *Defesa* (+1 CA com armadura), *Duelo* (+2 no dano com arma de uma mão) ou *Combate com Duas Armas* (adiciona modificador de habilidade no dano do segundo ataque)."
      },
      {
        level: 2,
        name: "Conjurador (Spellcasting)",
        type: "Magia Selvagem",
        desc: "A partir do 2º nível, você aprende a canalizar a magia da natureza para conjurar magias de patrulheiro.\n• **Atributo de Conjuração**: Sabedoria (CD 8 + prof + mod SAB; ataque = prof + mod SAB)."
      },
      {
        level: 3,
        name: "Prontidão Primeva (Primeval Awareness)",
        type: "Sentido Primitivo",
        desc: "No 3º nível, você pode usar uma ação e gastar um espaço de magia de patrulheiro para focar sua percepção. Por 1 minuto por círculo de espaço gasto, você sente se há aberrações, celestiais, dragões, elementais, fadas, corruptores ou mortos-vivos a até 1,5 km de você (ou 9 km se estiver em seu terreno favorito)."
      },
      {
        level: 3,
        name: "Arquétipo de Patrulheiro (Subclasse)",
        type: "Subclasse no Nível 3",
        desc: "No 3º nível, você escolhe um arquétipo que molda sua técnica de caça: o versátil *Caçador (Hunter)* ou o aliado das feras *Mestre das Feras (Beast Master)*. Sua escolha concede características no 3º, 7º, 11º e 15º níveis."
      },
      {
        level: 5,
        name: "Ataque Extra (Extra Attack)",
        type: "Ataque",
        desc: "A partir do 5º nível, você pode atacar duas vezes, em vez de uma, sempre que realizar a ação de Ataque no seu turno."
      },
      {
        level: 8,
        name: "Passo da Terra (Land's Stride)",
        type: "Deslocamento",
        desc: "A partir do 8º nível, mover-se através de terreno difícil não-mágico não custa movimento extra. Você também pode passar por plantas não-mágicas sem ser retardado ou sofrer dano de espinhos."
      },
      {
        level: 10,
        name: "Esconder-se em Plena Vista (Hide in Plain Sight)",
        type: "Camuflagem",
        desc: "No 10º nível, você pode gastar 1 minuto criando uma camuflagem com lama, folhas e materiais naturais. Enquanto permanecer imóvel encostado em uma superfície sólida, você ganha um **bônus de +10 em testes de Destreza (Furtividade)**."
      },
      {
        level: 14,
        name: "Desaparecer (Vanish)",
        type: "Furtividade",
        desc: "A partir do 14º nível, você pode usar a ação de **Esconder-se como Ação Bônus** no seu turno. Além disso, você não pode ser rastreado por meios não-mágicos a menos que deseje deixar rastros."
      },
      {
        level: 20,
        name: "Matador de Inimigos (Foe Slayer)",
        type: "Ápice Épico",
        desc: "No 20º nível, você se torna um caçador incomparável. Uma vez em cada um de seus turnos, você pode adicionar o seu **modificador de Sabedoria à jogada de ataque ou à jogada de dano** de um ataque que fizer contra um de seus inimigos favoritos."
      }
    ],
    subclasses: [
      {
        name: "Caçador (Hunter)",
        icon: "🏹",
        desc: "Especialistas letais em combate adaptativo contra hordas de monstros, feras gigantescas e ameaças colossais.",
        features: [
          {
            level: 3,
            name: "Presa do Caçador (Hunter's Prey)",
            desc: "No 3º nível, escolha uma das seguintes táticas:\n• **Presa do Colosso (Colossus Slayer)**: Uma vez por turno, ao acertar uma criatura com ataque de arma que esteja abaixo do seu máximo de PV, causa **+1d8 de dano extra**.\n• **Quebrador de Hordas (Giant Killer)**: Ao acertar com ataque de arma, pode desferir outro ataque contra uma criatura diferente a até 1,5m do alvo inicial.\n• **Matador de Gigantes**: Quando uma criatura Grande ou maior errar um ataque contra você a até 1,5m, use sua **Reação** para atacá-la imediatamente."
          },
          {
            level: 7,
            name: "Táticas Defensivas (Defensive Tactics)",
            desc: "No 7º nível, escolha uma opção defensiva:\n• **Escapar da Horda**: Ataques de oportunidade contra você têm Desvantagem.\n• **Defesa contra Ataques Múltiplos**: Quando uma criatura acertar você com um ataque, ganhe **+4 de CA** contra todos os ataques subsequentes daquela criatura pelo resto do turno.\n• **Vontade de Aço**: Vantagem em salvaguardas contra ficar amedrontado."
          },
          {
            level: 11,
            name: "Ataque Múltiplo (Multiattack)",
            desc: "No 11º nível, escolha uma das seguintes manobras em área:\n• **Saraivada (Volley)**: Como uma Ação, você pode disparar um ataque à distância contra qualquer número de criaturas a até 3 metros de um ponto que você possa ver dentro do alcance da arma.\n• **Ataque Giratório (Whirlwind Attack)**: Como uma Ação, você pode realizar um ataque corpo a corpo contra qualquer número de criaturas a até 1,5 metro de você."
          },
          {
            level: 15,
            name: "Defesa Superior do Caçador",
            desc: "No 15º nível, escolha entre **Evasão** (zero dano em sucesso de salvaguarda de DES), **Postura de Esquiva** (reação para impor desvantagem em ataque contra você) ou **Desviar o Golpe** (reação ao ser atingido para redirecionar o ataque para outra criatura a até 1,5m)."
          }
        ]
      },
      {
        name: "Mestre das Feras (Beast Master)",
        icon: "🐺",
        desc: "Patrulheiros que formam um elo místico inseparável com um companheiro animal leal que luta ao seu lado.",
        features: [
          {
            level: 3,
            name: "Companheiro do Guarda (Ranger's Companion)",
            desc: "No 3º nível, você ganha um companheiro animal leal (fera de tamanho Médio ou menor com ND 1/4 ou menor, como Lobo, Pantera, Javali ou Falcão). Adicione o seu **bônus de proficiência à CA, jogadas de ataque, dano, perícias e salvaguardas** do animal. Os PV máximos dele são o normal ou 4 x seu nível de patrulheiro. Você pode comandá-lo com sua Ação para atacar, correr, desengajar ou esquivar."
          },
          {
            level: 7,
            name: "Treinamento Excepcional",
            desc: "A partir do 7º nível, em qualquer turno que você não comandar seu animal para atacar, você pode usar uma **Ação Bônus** para comandá-lo a Correr, Desengajar ou Esquivar no turno dele."
          },
          {
            level: 11,
            name: "Fúria Bestial (Bestial Fury)",
            desc: "A partir do 11º nível, quando você comandar seu companheiro animal a atacar, ele pode desferir **dois ataques**."
          },
          {
            level: 15,
            name: "Compartilhar Magias (Share Spells)",
            desc: "No 15º nível, quando você conjurar uma magia com você mesmo como alvo, a magia também afeta o seu companheiro animal se ele estiver a até 9 metros de você."
          }
        ]
      }
    ]
  }
];

// Exportação universal para compatibilidade com o sistema
if (typeof window !== 'undefined') {
  window.CLASSES_DATA = CLASSES_DATA;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CLASSES_DATA };
}
