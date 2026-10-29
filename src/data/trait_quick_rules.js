// ============================================================================
// ⚡ D&D 5ª EDIÇÃO - DICIONÁRIO DE REGRAS DIRETAS E OBJETIVAS DE TRAÇOS (ISSUE-163)
// Transforma descrições extensas de livro em resumos táticos diretos com
// economia de ação (Ação / Bônus / Reação / Passivo), frequência de recarga
// e valores calculados dinamicamente para a ficha do personagem.
// ============================================================================

const TRAIT_QUICK_RULES = {
  // ==========================================================================
  // 1. BÁRBARO (BARBARIAN)
  // ==========================================================================
  'furia': {
    tag: 'Ação Bônus',
    usage: '{rageUses}×/Descanso Longo',
    summary: 'Por 1 min (sem armadura pesada): Vantagem em testes/salvaguardas de FOR, {rageDmg} dano corpo a corpo (FOR) e Resistência a concussão, cortante e perfurante.'
  },
  'defesa sem armadura': {
    tag: 'Passivo',
    usage: 'Contínuo',
    summary: 'Sem armadura: sua CA é {unarmoredAc} (permite escudo).'
  },
  'ataque descuidado': {
    tag: 'No Ataque',
    usage: '1º ataque do turno',
    summary: 'Ganha Vantagem nos ataques corpo a corpo com FOR neste turno, mas ataques contra você têm Vantagem até seu próximo turno.'
  },
  'sentido de perigo': {
    tag: 'Passivo',
    usage: 'Contínuo',
    summary: 'Vantagem em salvaguardas de DES contra efeitos visíveis (armadilhas e magias).'
  },
  'caminho primitivo': {
    tag: 'Passivo',
    usage: 'Subclasse',
    summary: 'Especialização de Fúria ativa: {subclassName}.'
  },
  'ataque extra': {
    tag: 'Passivo',
    usage: 'Ação de Ataque',
    summary: 'Realiza 2 ataques (em vez de 1) sempre que usar a ação de Ataque no seu turno.'
  },
  'movimento rapido': {
    tag: 'Passivo',
    usage: 'Sem armadura pesada',
    summary: 'Seu deslocamento aumenta em +3 metros.'
  },
  'instinto feral': {
    tag: 'Passivo',
    usage: 'Iniciativa',
    summary: 'Vantagem na Iniciativa. Se surpreendido, age normalmente no 1º turno se entrar em Fúria primeiro.'
  },
  'critico brutal': {
    tag: 'Passivo',
    usage: 'Acerto Crítico',
    summary: 'Rola +{brutalDice} dado(s) de dano extra da arma em acertos críticos corpo a corpo.'
  },
  'furia implacavel': {
    tag: 'Reação / 0 PV',
    usage: 'Em Fúria (CD 10 + 5/uso)',
    summary: 'Ao cair a 0 PV em Fúria, faça salvaguarda de CON (CD 10) para ficar com 1 PV.'
  },
  'frenesi': {
    tag: 'Ação Bônus',
    usage: 'Em Fúria (+1 Exaustão ao fim)',
    summary: 'Durante a Fúria, pode fazer 1 ataque corpo a corpo com Ação Bônus em cada turno.'
  },
  'furia irracional': {
    tag: 'Passivo',
    usage: 'Em Fúria',
    summary: 'Imune a ser Amedrontado ou Enfeitiçado enquanto estiver em Fúria.'
  },
  'espirito totemico': {
    tag: 'Passivo',
    usage: 'Em Fúria',
    summary: 'Urso: Resistência a todos os danos (exceto psíquico) • Águia: Oportunidade com Desvantagem e Disparada Bônus • Lobo: Aliados têm Vantagem corpo a corpo.'
  },

  // ==========================================================================
  // 2. BARDO (BARD)
  // ==========================================================================
  'inspiracao bardica': {
    tag: 'Ação Bônus',
    usage: '{bardicUses}×/{bardicRest} ({bardicDie})',
    summary: 'Aliado a até 18m recebe 1 dado {bardicDie} para somar em 1 teste de habilidade, ataque ou salvaguarda (dura 10 min).'
  },
  'pau para toda obra': {
    tag: 'Passivo',
    usage: 'Testes sem proficiência',
    summary: 'Soma +{halfProf} (metade da proficiência) em qualquer teste de atributo sem proficiência (inclui Iniciativa).'
  },
  'cancao de descanso': {
    tag: 'Descanso Curto',
    usage: '1×/Descanso Curto',
    summary: 'Aliados que gastarem Dados de Vida no descanso curto recuperam +{songOfRestDie} PV extras.'
  },
  'colegio bardico': {
    tag: 'Passivo',
    usage: 'Subclasse',
    summary: 'Tradição Bárdica ativa: {subclassName}.'
  },
  'aptidao': {
    tag: 'Passivo',
    usage: 'Perícias Especializadas',
    summary: 'Dobro do bônus de proficiência (+{doubleProf}) em 2 perícias escolhidas.'
  },
  'fonte de inspiracao': {
    tag: 'Passivo',
    usage: 'Descanso Curto',
    summary: 'Recupera todos os usos de Inspiração Bárdica em um Descanso Curto ou Longo.'
  },
  'contra-encantamento': {
    tag: 'Ação',
    usage: 'Até o fim do próximo turno',
    summary: 'Aliados a até 9m têm Vantagem em salvaguardas contra ser Amedrontado ou Enfeitiçado.'
  },
  'palavras cortantes': {
    tag: 'Reação',
    usage: 'Gasta 1 Inspiração ({bardicDie})',
    summary: 'Criatura a até 18m: subtrai {bardicDie} da rolagem de ataque, teste de atributo ou dano dela.'
  },
  'inspiracao de combate': {
    tag: 'Passivo',
    usage: 'Inspiração Bárdica',
    summary: 'O aliado pode somar o dado {bardicDie} ao dano de um ataque ou à própria CA (como Reação).'
  },

  // ==========================================================================
  // 3. BRUXO (WARLOCK)
  // ==========================================================================
  'patrono transcendente': {
    tag: 'Passivo',
    usage: 'Subclasse',
    summary: 'Pacto firmado com {subclassName}. Expande magias de pacto e concede poderes patronais.'
  },
  'magia de pacto': {
    tag: 'Conjuração',
    usage: '{pactSlots} espaço(s) de {pactCircle}º círc. • Descanso Curto',
    summary: 'CD {spellDc} • Ataque {spellAtk} (Carisma). Todas as magias são lançadas no {pactCircle}º círculo e recuperam em Descanso Curto.'
  },
  'invocacoes misticas': {
    tag: 'Passivo / Ativo',
    usage: '{invocationsCount} invocações ativas',
    summary: 'Poderes arcanos permanentes (ex.: Explosão Agonizante soma +{chaModNum} ao dano de Rajada Mística; Visão Diabólica enxerga na escuridão mágica 36m).'
  },
  'dadiva do pacto': {
    tag: 'Passivo / Ação',
    usage: 'Pacto de Nv 3',
    summary: 'Corrente (Familiar especial) • Lâmina (Conjura arma mágica proficiente) • Tomo (Livro das Sombras com +3 truques de qualquer classe).'
  },
  'bencao do obscuro': {
    tag: 'Passivo',
    usage: 'Ao reduzir hostil a 0 PV',
    summary: 'Recebe imediatamente +{tempHpObscuro} PV temporários (mod. CAR {chaModSigned} + nível {level}).'
  },
  'sorte do obscuro': {
    tag: 'Livre (no teste)',
    usage: '1×/Descanso Curto ou Longo',
    summary: 'Adiciona +1d10 a um teste de habilidade ou salvaguarda (após ver a rolagem).'
  },
  'resistencia diabolica': {
    tag: 'Passivo',
    usage: 'Troca em Descanso Curto/Longo',
    summary: 'Escolhe 1 tipo de dano para ter Resistência (exceto armas mágicas/prateadas).'
  },
  'presenca feerica': {
    tag: 'Ação',
    usage: '1×/Descanso Curto ou Longo',
    summary: 'Cubo de 3m: criaturas fazem salvaguarda de SAB (CD {spellDc}) ou ficam Enfeitiçadas/Amedrontadas até o fim do seu próximo turno.'
  },
  'nevoa de fuga': {
    tag: 'Reação (ao sofrer dano)',
    usage: '1×/Descanso Curto ou Longo',
    summary: 'Fica Invisível e teleporta até 18m (invisibilidade dura até o início do seu próximo turno ou até atacar/lançar magia).'
  },
  'mente desperta': {
    tag: 'Passivo',
    usage: 'Telepatia 9m',
    summary: 'Comunica-se telepaticamente com qualquer criatura que veja a até 9m.'
  },
  'protecao entropica': {
    tag: 'Reação',
    usage: '1×/Descanso Curto ou Longo',
    summary: 'Impõe Desvantagem em um ataque contra você; se errar, seu próximo ataque contra o alvo tem Vantagem.'
  },

  // ==========================================================================
  // 4. CLÉRIGO (CLERIC)
  // ==========================================================================
  'dominio divino': {
    tag: 'Passivo',
    usage: 'Subclasse',
    summary: 'Domínio ativo: {subclassName} (magias de domínio sempre preparadas).'
  },
  'canalizar divindade': {
    tag: 'Ação',
    usage: '{channelUses}×/Descanso Curto ou Longo',
    summary: 'Expulsar Mortos-Vivos: mortos-vivos a até 9m fazem salvaguarda de SAB (CD {spellDc}) ou fogem por 1 min (destrói ND ≤ {destroyUndeadCr}).'
  },
  'discipulo da vida': {
    tag: 'Passivo',
    usage: 'Magias de Cura (1º+ círc.)',
    summary: 'Suas magias de cura restauram PV adicionais iguais a 2 + círculo da magia.'
  },
  'canalizar divindade: preservar a vida': {
    tag: 'Ação',
    usage: 'Gasta Canalizar Divindade',
    summary: 'Distribui até {preserveLifePool} PV (5 × nível) entre criaturas a até 9m (até metade do PV máximo de cada).'
  },
  'curandeiro abencoado': {
    tag: 'Passivo',
    usage: 'Ao curar outro com magia',
    summary: 'Você também recupera PV iguais a 2 + círculo da magia de cura lançada.'
  },
  'fulgor da aurora': {
    tag: 'Ação',
    usage: 'Gasta Canalizar Divindade',
    summary: 'Raio 9m: dissipa escuridão mágica e causa 2d10 + {level} dano radiante em inimigos (Salv. CON CD {spellDc} reduz à metade).'
  },
  'labareda protetora': {
    tag: 'Reação',
    usage: '{wisUses}×/Descanso Longo',
    summary: 'Quando você é atacado por inimigo a até 9m, impõe Desvantagem na jogada de ataque.'
  },
  'sacerdote da guerra': {
    tag: 'Ação Bônus',
    usage: '{wisUses}×/Descanso Longo',
    summary: 'Quando usa a ação de Ataque, faz 1 ataque adicional com arma como Ação Bônus.'
  },
  'canalizar divindade: ataque guiado': {
    tag: 'No Ataque',
    usage: 'Gasta Canalizar Divindade',
    summary: 'Soma +10 à sua jogada de ataque (pode decidir após ver o dado).'
  },
  'ira da tempestade': {
    tag: 'Reação (ao ser atingido)',
    usage: '{wisUses}×/Descanso Longo',
    summary: 'Inimigo a até 1,5m sofre 2d8 dano elétrico ou trovejante (Salv. DES CD {spellDc} reduz à metade).'
  },
  'canalizar divindade: ira destrutiva': {
    tag: 'No Dano',
    usage: 'Gasta Canalizar Divindade',
    summary: 'Ao rolar dano elétrico ou trovejante, causa o dano máximo possível em vez de rolar os dados.'
  },

  // ==========================================================================
  // 5. DRUIDA (DRUID)
  // ==========================================================================
  'druidaico': {
    tag: 'Passivo',
    usage: 'Idioma Secreto',
    summary: 'Fala e deixa mensagens ocultas em Druídico (CD 15 Percepção para não-druidas notarem).'
  },
  'forma selvagem': {
    tag: 'Ação (ou Bônus na Lua)',
    usage: '2×/Descanso Curto ou Longo',
    summary: 'Transforma-se em fera vista antes (dura {wildShapeHours}h). Assume os PV e atributos físicos da fera.'
  },
  'circulo druidico': {
    tag: 'Passivo',
    usage: 'Subclasse',
    summary: 'Círculo ativo: {subclassName}.'
  },
  'recuperacao natural': {
    tag: 'Descanso Curto',
    usage: '1×/Descanso Longo',
    summary: 'Recupera espaços de magia somando até {arcaneRecoveryLevels} níveis (máx 5º círculo).'
  },
  'forma selvagem de combate': {
    tag: 'Ação Bônus',
    usage: 'Círculo da Lua',
    summary: 'Usa Forma Selvagem como Ação Bônus. Na forma de fera, pode gastar 1 espaço de magia (Ação Bônus) para curar 1d8 PV por círculo.'
  },
  'formas de circulo': {
    tag: 'Passivo',
    usage: 'Círculo da Lua',
    summary: 'Pode assumir feras com ND até {moonDruidCr}.'
  },

  // ==========================================================================
  // 6. FEITICEIRO (SORCERER)
  // ==========================================================================
  'origem de feiticeiro': {
    tag: 'Passivo',
    usage: 'Subclasse',
    summary: 'Linhagem mágica ativa: {subclassName}.'
  },
  'fonte de magia': {
    tag: 'Ação Bônus',
    usage: '{level} Pontos de Feitiçaria / Descanso Longo',
    summary: 'Converte Pontos de Feitiçaria em espaços de magia (1º=2, 2º=3, 3º=5, 4º=6, 5º=7 pts) ou queima espaços por pontos.'
  },
  'metamagia': {
    tag: 'Na Conjuração',
    usage: 'Gasta Pontos de Feitiçaria',
    summary: 'Modifica magias (ex.: Magia Acelerada 2 pts = lança como Bônus; Magia Gêmea = duplica alvo único; Magia Sutil 1 pt = sem V/S).'
  },
  'resiliencia draconica': {
    tag: 'Passivo',
    usage: 'Contínuo',
    summary: '+{level} PV máximos (1/nível). Sem armadura, sua CA base é {draconicAc} (13 + DES).'
  },
  'afinidade elemental': {
    tag: 'Passivo',
    usage: 'Magias do elemento dracônico',
    summary: 'Soma +{chaModNum} (mod. CAR) a uma rolagem de dano da magia. Pode gastar 1 pt de feitiçaria para ganhar Resistência ao elemento por 1h.'
  },
  'mares do caos': {
    tag: 'Livre',
    usage: '1×/Descanso Longo (ou Surto Selvagem)',
    summary: 'Ganha Vantagem em 1 jogada de ataque, teste de atributo ou salvaguarda.'
  },

  // ==========================================================================
  // 7. GUERREIRO (FIGHTER)
  // ==========================================================================
  'estilo de luta': {
    tag: 'Passivo',
    usage: 'Contínuo',
    summary: '{fightingStyleSummary}'
  },
  'retomar o folego': {
    tag: 'Ação Bônus',
    usage: '1×/Descanso Curto ou Longo',
    summary: 'Recupera 1d10 + {level} PV imediatamente.'
  },
  'surto de acao': {
    tag: 'Livre (no seu turno)',
    usage: '{actionSurgeUses}×/Descanso Curto ou Longo',
    summary: 'Realiza 1 Ação adicional completa neste turno.'
  },
  'arquetipo marcial': {
    tag: 'Passivo',
    usage: 'Subclasse',
    summary: 'Especialização marcial ativa: {subclassName}.'
  },
  'indomavel': {
    tag: 'Reação / Salvaguarda',
    usage: '{indomitableUses}×/Descanso Longo',
    summary: 'Rerrola uma salvaguarda em que falhou (deve usar o novo resultado).'
  },
  'critico aprimorado': {
    tag: 'Passivo',
    usage: 'Ataques com arma',
    summary: 'Seus ataques com arma atingem acerto crítico com 19 ou 20 no d20.'
  },
  'atleta notavel': {
    tag: 'Passivo',
    usage: 'Testes físicos sem proficiência',
    summary: 'Soma +{halfProfCeil} em testes de FOR, DES ou CON sem proficiência. Salto em distância aumenta +{strModNum} pés.'
  },
  'superioridade em combate': {
    tag: 'No Ataque / Bônus / Reação',
    usage: '4 Dados d8 / Descanso Curto',
    summary: '3 Manobras de Mestre de Batalha (CD {maneuverDc}). Gasta 1d8 para aplicar efeito tático e somar ao ataque/dano.'
  },

  // ==========================================================================
  // 8. LADINO (ROGUE)
  // ==========================================================================
  'ataque furtivo': {
    tag: '1× por Turno',
    usage: 'Arma de Acuidade ou Distância',
    summary: 'Causa +{sneakDice} de dano extra se tiver Vantagem OU se houver um aliado ativo a 1,5m do alvo (sem Desvantagem).'
  },
  'giria de ladrao': {
    tag: 'Passivo',
    usage: 'Código Secreto',
    summary: 'Oculta mensagens em conversas normais e compreende símbolos secretos do submundo.'
  },
  'acao ardilosa': {
    tag: 'Ação Bônus',
    usage: 'Todo turno (1×/turno)',
    summary: 'Usa Disparada (Dash), Desengajar (Disengage) ou Esconder-se (Hide) como Ação Bônus.'
  },
  'arquetipo de ladino': {
    tag: 'Passivo',
    usage: 'Subclasse',
    summary: 'Especialização furtiva ativa: {subclassName}.'
  },
  'esquiva sobrenatural': {
    tag: 'Reação',
    usage: 'Ao sofrer ataque de atacante visível',
    summary: 'Reduz o dano do ataque contra você pela metade.'
  },
  'evasao': {
    tag: 'Passivo',
    usage: 'Salvaguardas de DES (área)',
    summary: 'Em salvaguardas de DES para metade do dano: não sofre dano algum no sucesso, e apenas metade na falha.'
  },
  'maos rapidas': {
    tag: 'Ação Bônus',
    usage: 'Ação Ardilosa',
    summary: 'Usa Ação Bônus para Prestidigitação, usar ferramentas de ladrão (desarmar armadilha/abrir fechadura) ou Usar um Objeto.'
  },
  'andarilho de telhados': {
    tag: 'Passivo',
    usage: 'Contínuo',
    summary: 'Escalar não custa movimento extra. Salto com corrida aumenta +{dexModNum} pés.'
  },
  'assassinar': {
    tag: '1º Turno de Combate',
    usage: 'Contra alvos surpresos',
    summary: 'Vantagem contra quem ainda não agiu na Iniciativa. Qualquer acerto contra criatura surpresa é Crítico automático.'
  },

  // ==========================================================================
  // 9. MAGO (WIZARD)
  // ==========================================================================
  'recuperacao arcana': {
    tag: 'Descanso Curto',
    usage: '1×/Descanso Longo',
    summary: 'Recupera espaços de magia somando até {arcaneRecoveryLevels} níveis (máx 5º círculo).'
  },
  'tradicao arcana': {
    tag: 'Passivo',
    usage: 'Subclasse',
    summary: 'Escola de Magia ativa: {subclassName}.'
  },
  'esculpir magias': {
    tag: 'Na Conjuração',
    usage: 'Magias de Evocação',
    summary: 'Escolhe até 1 + círculo da magia criaturas: elas passam automaticamente na salvaguarda e não sofrem dano da magia.'
  },
  'truque potente': {
    tag: 'Passivo',
    usage: 'Truques de dano',
    summary: 'Inimigos que passarem na salvaguarda contra seus truques ainda sofrem metade do dano.'
  },
  'protecao arcana': {
    tag: 'Passivo',
    usage: 'Ao lançar magia de Abjuração (1º+)',
    summary: 'Cria escudo mágico com {arcaneWardHp} PV (2 × nível + INT) que absorve dano; recarrega 2× círculo a cada magia de Abjuração.'
  },
  'portento': {
    tag: 'Livre (antes da rolagem)',
    usage: '2 dados d20 / Descanso Longo',
    summary: 'Ao acordar, rola 2d20 e anota. Pode substituir qualquer ataque, salvaguarda ou teste seu ou de criatura visível por um desses valores.'
  },

  // ==========================================================================
  // 10. MONGE (MONK)
  // ==========================================================================
  'artes marciais': {
    tag: 'Ação Bônus / Passivo',
    usage: 'Sem armadura / sem escudo',
    summary: 'Usa DES em vez de FOR, dado desarmado/monge é {martialDie}, e faz 1 golpe desarmado como Ação Bônus após atacar.'
  },
  'ki': {
    tag: 'Ação Bônus',
    usage: '{level} Pontos de Ki / Descanso Curto (CD {kiDc})',
    summary: '1 pt de Ki (Ação Bônus): Rajada de Golpes (+2 ataques desarmados), Defesa Paciente (Esquiva) ou Passo do Vento (Disparada/Desengajar + salto 2×).'
  },
  'pontos de ki': {
    tag: 'Ação Bônus',
    usage: '{level} Pontos de Ki / Descanso Curto (CD {kiDc})',
    summary: '1 pt de Ki (Ação Bônus): Rajada de Golpes (+2 ataques desarmados), Defesa Paciente (Esquiva) ou Passo do Vento (Disparada/Desengajar + salto 2×).'
  },
  'movimento sem armadura': {
    tag: 'Passivo',
    usage: 'Sem armadura / sem escudo',
    summary: 'Seu deslocamento aumenta em +{monkSpeedBonus} metros.'
  },
  'tradicao monastica': {
    tag: 'Passivo',
    usage: 'Subclasse',
    summary: 'Tradição Monástica ativa: {subclassName}.'
  },
  'defletir projéteis': {
    tag: 'Reação',
    usage: 'Ao ser atingido por ataque à distância',
    summary: 'Reduz o dano em 1d10 + {dexModNum} + {level}. Se zerar o dano, pode gastar 1 Ki para arremessar de volta (alcance 6/18m).'
  },
  'defletir projeteis': {
    tag: 'Reação',
    usage: 'Ao ser atingido por ataque à distância',
    summary: 'Reduz o dano em 1d10 + {dexModNum} + {level}. Se zerar o dano, pode gastar 1 Ki para arremessar de volta (alcance 6/18m).'
  },
  'queda lenta': {
    tag: 'Reação',
    usage: 'Ao cair',
    summary: 'Reduz o dano de queda em {slowFallRed} PV (5 × nível).'
  },
  'ataque atordoante': {
    tag: 'No Acerto Corpo a Corpo',
    usage: 'Gasta 1 Ponto de Ki',
    summary: 'Alvo faz salvaguarda de CON (CD {kiDc}) ou fica Atordoado até o fim do seu próximo turno.'
  },
  'golpes potenciados por ki': {
    tag: 'Passivo',
    usage: 'Ataques desarmados',
    summary: 'Seus ataques desarmados contam como mágicos para superar resistências e imunidades.'
  },
  'tecnica da mao aberta': {
    tag: 'Na Rajada de Golpes',
    usage: 'Ao acertar com Rajada de Golpes',
    summary: 'Impõe 1 efeito ao alvo: Derrubar (Salv. DES CD {kiDc}), Empurrar 4,5m (Salv. FOR CD {kiDc}) ou impedir Reações até seu próximo turno.'
  },

  // ==========================================================================
  // 11. PALADINO (PALADIN)
  // ==========================================================================
  'sentido divino': {
    tag: 'Ação',
    usage: '{divineSenseUses}×/Descanso Longo',
    summary: 'Detecta a localização de celestiais, corruptores e mortos-vivos a até 18m até o fim do seu próximo turno.'
  },
  'cura pelas maos': {
    tag: 'Ação',
    usage: 'Reserva de {layOnHands} PV / Descanso Longo',
    summary: 'Toque: restaura até {layOnHands} PV totais, ou gasta 5 PV da reserva para curar 1 doença ou neutralizar 1 veneno.'
  },
  'destruicao divina': {
    tag: 'No Acerto Corpo a Corpo',
    usage: 'Gasta 1 Espaço de Magia',
    summary: 'Causa +2d8 dano radiante (1º círc.) +1d8 por círculo acima (máx 5d8). Causa +1d8 extra contra mortos-vivos e corruptores.'
  },
  'saude divina': {
    tag: 'Passivo',
    usage: 'Contínuo',
    summary: 'Você é imune a doenças.'
  },
  'juramento sagrado': {
    tag: 'Passivo',
    usage: 'Subclasse',
    summary: 'Juramento Sagrado ativo: {subclassName}.'
  },
  'aura de protecao': {
    tag: 'Passivo',
    usage: 'Aura de 3 metros',
    summary: 'Você e aliados conscientes a até 3m recebem +{auraBonus} em todas as salvaguardas.'
  },
  'aura de coragem': {
    tag: 'Passivo',
    usage: 'Aura de 3 metros',
    summary: 'Você e aliados a até 3m não podem ser Amedrontados.'
  },

  // ==========================================================================
  // 12. PATRULHEIRO (RANGER)
  // ==========================================================================
  'inimigo favorito': {
    tag: 'Passivo',
    usage: 'Contínuo',
    summary: 'Vantagem em Sobrevivência para rastrear seus inimigos favoritos e em testes de Inteligência para lembrar informações sobre eles.'
  },
  'explorador natural': {
    tag: 'Passivo',
    usage: 'Terreno Favorito',
    summary: 'Dobro de proficiência em testes de INT/SAB no terreno; terreno difícil não atrasa o grupo; encontra o dobro de suprimentos.'
  },
  'consciencia primitiva': {
    tag: 'Ação',
    usage: 'Gasta 1 Espaço de Magia',
    summary: 'Sente a presença de aberrações, celestiais, dragões, elementais, fadas, corruptores e mortos-vivos a até 1,5 km (9 km no terreno favorito).'
  },
  'arquetipo de patrulheiro': {
    tag: 'Passivo',
    usage: 'Subclasse',
    summary: 'Conclave ativo: {subclassName}.'
  },
  'presa do cacador': {
    tag: 'Passivo / Reação',
    usage: '1× por Turno',
    summary: 'Assassino de Colossos: +1d8 dano se o alvo já estiver ferido (1×/turno) • Matador de Gigantes: Reação para atacar Grande+ que erre você • Destruidor de Hordas: +1 ataque em 2º alvo a 1,5m.'
  },

  // ==========================================================================
  // 13. CONJURAÇÃO GERAL (SPELLCASTING)
  // ==========================================================================
  'conjuracao': {
    tag: 'Conjuração',
    usage: 'CD {spellDc} • Ataque {spellAtk}',
    summary: 'Habilidade-chave: {spellAttrLabel} (CD {spellDc}, Ataque {spellAtk}). Recupera espaços de magia em Descanso Longo.'
  },

  // ==========================================================================
  // 14. TRAÇOS RACIAIS (SPECIES / RACES)
  // ==========================================================================
  'visao no escuro': {
    tag: 'Passivo',
    usage: 'Alcance 18m',
    summary: 'Enxerga na penumbra a até 18m como luz plena e na escuridão como penumbra (tons de cinza).'
  },
  'visao no escuro superior': {
    tag: 'Passivo',
    usage: 'Alcance 36m',
    summary: 'Enxerga na penumbra e escuridão a até 36m.'
  },
  'resiliencia ana': {
    tag: 'Passivo',
    usage: 'Contínuo',
    summary: 'Vantagem em salvaguardas contra veneno e Resistência a dano de veneno.'
  },
  'treinamento anao em combate': {
    tag: 'Passivo',
    usage: 'Proficiência',
    summary: 'Proficiência com machado de batalha, machadinha, martelo leve e martelo de guerra.'
  },
  'especializacao em rochas': {
    tag: 'Passivo',
    usage: 'História (Pedra)',
    summary: 'Soma +{doubleProf} (dobro da proficiência) em testes de História sobre trabalhos em pedra.'
  },
  'tenacidade ana': {
    tag: 'Passivo',
    usage: 'Contínuo',
    summary: '+{level} PV máximos (+1 PV por nível).'
  },
  'sentidos agucados': {
    tag: 'Passivo',
    usage: 'Perícia',
    summary: 'Proficiência na perícia Percepção.'
  },
  'ancestralidade feerica': {
    tag: 'Passivo',
    usage: 'Contínuo',
    summary: 'Vantagem em salvaguardas contra ser Enfeitiçado e imune a sono mágico.'
  },
  'transe': {
    tag: 'Descanso Longo',
    usage: '4 horas',
    summary: 'Medita por 4h (em vez de dormir 8h) para obter o benefício completo de um Descanso Longo.'
  },
  'sortudo': {
    tag: 'Livre (ao rolar 1)',
    usage: 'Ataque, Teste ou Salvaguarda',
    summary: 'Quando rolar 1 natural no d20, pode rerrolar o dado (deve usar o novo resultado).'
  },
  'bravura': {
    tag: 'Passivo',
    usage: 'Contínuo',
    summary: 'Vantagem em salvaguardas contra ficar Amedrontado.'
  },
  'agilidade halfling': {
    tag: 'Passivo',
    usage: 'Movimento',
    summary: 'Pode mover-se pelo espaço de qualquer criatura de tamanho Médio ou maior.'
  },
  'ancestralidade draconica': {
    tag: 'Passivo',
    usage: 'Linhagem Dracônica',
    summary: 'Define o tipo elemental da sua Arma de Sopro e sua Resistência a Dano.'
  },
  'arma de sopro': {
    tag: 'Ação',
    usage: '1×/Descanso Curto ou Longo',
    summary: 'Exala energia dracônica: causa {breathDamage} de dano (Salvaguarda CD {breathSaveDc} reduz à metade).'
  },
  'resistencia a dano': {
    tag: 'Passivo',
    usage: 'Contínuo',
    summary: 'Resistência ao tipo de dano da sua Ancestralidade Dracônica.'
  },
  'esperteza gnomica': {
    tag: 'Passivo',
    usage: 'Contínuo',
    summary: 'Vantagem em todas as salvaguardas de INT, SAB e CAR contra magia.'
  },
  'versatilidade em pericias': {
    tag: 'Passivo',
    usage: 'Perícias',
    summary: 'Proficiência em 2 perícias à sua escolha.'
  },
  'ameacador': {
    tag: 'Passivo',
    usage: 'Perícia',
    summary: 'Proficiência na perícia Intimidação.'
  },
  'resistencia implacavel': {
    tag: 'Reação / 0 PV',
    usage: '1×/Descanso Longo',
    summary: 'Quando reduzido a 0 PV (sem morrer na hora), cai para 1 PV em vez disso.'
  },
  'ataques selvagens': {
    tag: 'Passivo',
    usage: 'Acerto Crítico Corpo a Corpo',
    summary: 'Ao conseguir um crítico com arma corpo a corpo, rola +1 dado de dano adicional da arma.'
  },
  'resistencia infernal': {
    tag: 'Passivo',
    usage: 'Contínuo',
    summary: 'Você possui Resistência a dano de Fogo.'
  },
  'legado infernal': {
    tag: 'Ação / Reação',
    usage: 'Magias Inatas (CAR • CD {chaSpellDc})',
    summary: '{infernalLegacySummary}'
  },
  'resistencia da pedra': {
    tag: 'Reação (ao sofrer dano)',
    usage: '1×/Descanso Curto ou Longo',
    summary: 'Reduz o dano sofrido em 1d12 + {conModNum} (mod. CON).'
  },
  'maos curativas': {
    tag: 'Ação',
    usage: '1×/Descanso Longo',
    summary: 'Toque: restaura {level} PV (igual ao seu nível).'
  },
  'agilidade felina': {
    tag: 'Livre (no Movimento)',
    usage: 'Recarrega ao ficar 1 turno sem mover',
    summary: 'Dobra seu deslocamento até o fim do turno.'
  }
};

if (typeof window !== 'undefined') {
  window.TRAIT_QUICK_RULES = TRAIT_QUICK_RULES;
}
if (typeof global !== 'undefined') {
  global.TRAIT_QUICK_RULES = TRAIT_QUICK_RULES;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TRAIT_QUICK_RULES };
}

