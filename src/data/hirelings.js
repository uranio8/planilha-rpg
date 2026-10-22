// src/data/hirelings.js - Catálogo de Contratação D&D 5E adaptado do Old Dragon 2 (100% em Ouro / PO)

const HIRELINGS_CATALOG = {
  currency: "PO",
  categories: {
    helpers: {
      name: "Ajudantes & Braçais",
      description: "Mão de obra barata para serviços braçais, carregar tochas e transportar cargas. Não entram em combate por vontade própria e fogem se o moral falhar.",
      periodUnit: "semana",
      items: [
        {
          id: "helper_torchbearer",
          name: "Carregador de Tocha & Braçal",
          type: "helper",
          cost: 1, // 1 PO por semana
          costPeriod: "semana",
          foodCost: 0,
          hp: 4,
          maxHp: 4,
          ac: 10,
          speed: "9m (30ft)",
          attacks: [
            { name: "Porrete / Adaga Improvizada", bonus: 0, damage: "1d4", type: "impacto" }
          ],
          morale: 7, // CD 10 no d20
          moraleDc: 10,
          defaultMission: "Carregar tochas na frente e carregar espólios",
          description: "Camponês ou carregador contratado para iluminar masmorras e transportar peso."
        },
        {
          id: "helper_porter",
          name: "Estivador / Carregador de Cargas",
          type: "helper",
          cost: 1,
          costPeriod: "semana",
          foodCost: 0,
          hp: 5,
          maxHp: 5,
          ac: 10,
          speed: "9m (30ft)",
          attacks: [
            { name: "Pancada com Caixa / Barra", bonus: +1, damage: "1d4+1", type: "impacto" }
          ],
          morale: 7,
          moraleDc: 10,
          defaultMission: "Cuidar das montarias e transportar a carga pesada",
          description: "Homem forte para carregar baús, caixas e suprimentos do grupo."
        }
      ]
    },

    mercenaries: {
      name: "Mercenários Militares",
      description: "Combatentes armados contratados para segurança, patrulha e apoio bélico. Menor prazo de contratação é 1 mês. Grupos com mais de 6 homens requerem um Sargento (+50% no soldo).",
      periodUnit: "mês",
      foodCostMonthly: 1, // +1 PO por mês por homem para alimentação e estadia
      items: [
        {
          id: "merc_soldier_light",
          name: "Soldado Leve",
          type: "mercenary",
          cost: 2, // 2 PO / mês (+ 1 PO comida)
          costPeriod: "mês",
          foodCost: 1,
          hp: 11,
          maxHp: 11,
          ac: 13, // Couro + Escudo
          speed: "9m (30ft)",
          attacks: [
            { name: "Espada Curta", bonus: 3, damage: "1d6+1", type: "perfurante" }
          ],
          morale: 8,
          moraleDc: 10,
          defaultMission: "Vigiar o acampamento e patrulhar o perímetro",
          description: "Guarda treinado com espada curta, escudo e armadura de couro."
        },
        {
          id: "merc_soldier_heavy",
          name: "Soldado Pesado",
          type: "mercenary",
          cost: 3,
          costPeriod: "mês",
          foodCost: 1,
          hp: 12,
          maxHp: 12,
          ac: 16, // Cota de Malha
          speed: "9m (30ft)",
          attacks: [
            { name: "Espada Longa", bonus: 3, damage: "1d8+1", type: "cortante" }
          ],
          morale: 8,
          moraleDc: 10,
          defaultMission: "Linha de frente defensiva e guarda de honra",
          description: "Veterano com cota de malha pesada e espada longa."
        },
        {
          id: "merc_pikeman",
          name: "Piqueiro",
          type: "mercenary",
          cost: 3,
          costPeriod: "mês",
          foodCost: 1,
          hp: 10,
          maxHp: 10,
          ac: 12,
          speed: "9m (30ft)",
          attacks: [
            { name: "Pique", bonus: 3, damage: "1d10+1", type: "perfurante" },
            { name: "Espada Curta", bonus: 3, damage: "1d6+1", type: "perfurante" }
          ],
          morale: 8,
          moraleDc: 10,
          defaultMission: "Formação defensiva anti-carga em corredores estreitos",
          description: "Especialista em lanças longas para barrar criaturas grandes e cavalaria."
        },
        {
          id: "merc_archer",
          name: "Arqueiro",
          type: "mercenary",
          cost: 4,
          costPeriod: "mês",
          foodCost: 1,
          hp: 9,
          maxHp: 9,
          ac: 12,
          speed: "9m (30ft)",
          attacks: [
            { name: "Arco Curto", bonus: 3, damage: "1d6+1", type: "perfurante" },
            { name: "Espada Curta", bonus: 3, damage: "1d6+1", type: "perfurante" }
          ],
          morale: 8,
          moraleDc: 10,
          defaultMission: "Vigia em postos elevados e suporte com flechas",
          description: "Arqueiro experiente com arco curto e flechas afiadas."
        },
        {
          id: "merc_crossbowman",
          name: "Besteiro",
          type: "mercenary",
          cost: 5,
          costPeriod: "mês",
          foodCost: 1,
          hp: 9,
          maxHp: 9,
          ac: 13,
          speed: "9m (30ft)",
          attacks: [
            { name: "Besta Leve", bonus: 3, damage: "1d8+1", type: "perfurante" },
            { name: "Espada Curta", bonus: 3, damage: "1d6+1", type: "perfurante" }
          ],
          morale: 8,
          moraleDc: 10,
          defaultMission: "Tiroteio de cobertura e perfuração de armaduras",
          description: "Atirador com besta pesada e armadura de couro batido."
        },
        {
          id: "merc_cavalry_light",
          name: "Cavaleiro Leve (Montado)",
          type: "mercenary",
          cost: 10,
          costPeriod: "mês",
          foodCost: 1,
          hp: 11,
          maxHp: 11,
          ac: 14,
          speed: "18m (60ft) montado",
          attacks: [
            { name: "Lança Longa de Montaria", bonus: 3, damage: "1d8+1", type: "perfurante" },
            { name: "Espada Longa", bonus: 3, damage: "1d8+1", type: "cortante" }
          ],
          morale: 9,
          moraleDc: 9,
          defaultMission: "Batedor rápido, patrulha de estradas e escolta",
          description: "Cavaleiro veloz com cavalo de montaria e armas de cavaleiro."
        },
        {
          id: "merc_cavalry_heavy",
          name: "Cavaleiro de Guerra (Cavalaria Pesada)",
          type: "mercenary",
          cost: 20,
          costPeriod: "mês",
          foodCost: 1,
          hp: 18,
          maxHp: 18,
          ac: 17,
          speed: "16m (50ft) montado",
          attacks: [
            { name: "Lança de Justa", bonus: 4, damage: "1d8+2", type: "perfurante" },
            { name: "Espada Bastarda", bonus: 4, damage: "1d10+2", type: "cortante" }
          ],
          morale: 9,
          moraleDc: 9,
          defaultMission: "Investida de choque e escolta de honra",
          description: "Elite montada com armadura de placas e cavalo de guerra blindado."
        }
      ]
    },

    apprentices: {
      name: "Aprendizes (Estagiários de Aventureiro)",
      description: "Futuros heróis que acompanham veteranos para aprender o ofício. Não cobram salário fixo, mas recebem uma parte dos tesouros (normalmente 3d6×10 PO ao final da aventura) e entram na cota de divisão de XP (sem acumular para si). São leais e não fogem facilmente.",
      periodUnit: "aventura",
      items: [
        {
          id: "appr_fighter",
          name: "Aprendiz de Guerreiro",
          type: "apprentice",
          cost: 0,
          treasureShareFormula: "3d6*10 PO",
          costPeriod: "aventura",
          foodCost: 0,
          hp: 6,
          maxHp: 6,
          ac: 11,
          speed: "9m (30ft)",
          attacks: [
            { name: "Espada Curta de Treino", bonus: 1, damage: "1d6", type: "cortante" }
          ],
          specialFeature: "⚔️ Foco Marcial: +1 no acerto no seu primeiro ataque em cada combate.",
          morale: 10,
          moraleDc: 8,
          defaultMission: "Apoiar a infantaria e aprender táticas de combate",
          description: "Jovem espadachim focado em aprender a disciplina e a força das armas."
        },
        {
          id: "appr_cleric",
          name: "Aprendiz de Clérigo",
          type: "apprentice",
          cost: 0,
          treasureShareFormula: "3d6*10 PO",
          costPeriod: "aventura",
          foodCost: 0,
          hp: 5,
          maxHp: 5,
          ac: 11,
          speed: "9m (30ft)",
          attacks: [
            { name: "Maça Simples", bonus: 0, damage: "1d4", type: "impacto" }
          ],
          specialFeature: "✨ Toque Restaurador: 1x ao dia, toca um aliado e cura 1 PV.",
          morale: 10,
          moraleDc: 8,
          defaultMission: "Primeiros socorros, preces de proteção e carregar pergaminhos",
          description: "Noviço devoto que estuda os dogmas sagrados e os primeiros milagres divinos."
        },
        {
          id: "appr_rogue",
          name: "Aprendiz de Ladino",
          type: "apprentice",
          cost: 0,
          treasureShareFormula: "3d6*10 PO",
          costPeriod: "aventura",
          foodCost: 0,
          hp: 5,
          maxHp: 5,
          ac: 11,
          speed: "9m (30ft)",
          attacks: [
            { name: "Adaga Rápida", bonus: 1, damage: "1d4", type: "perfurante" }
          ],
          specialFeature: "🗝️ Olhar de Gatuno: Ajuda a encontrar armadilhas e abrir fechaduras (concede auxílio).",
          morale: 10,
          moraleDc: 8,
          defaultMission: "Batedor silencioso e detecção de fechaduras",
          description: "Ágil pungista de taverna que busca se tornar um batedor profissional."
        },
        {
          id: "appr_wizard",
          name: "Aprendiz de Mago",
          type: "apprentice",
          cost: 0,
          treasureShareFormula: "3d6*10 PO",
          costPeriod: "aventura",
          foodCost: 0,
          hp: 4,
          maxHp: 4,
          ac: 10,
          speed: "9m (30ft)",
          attacks: [
            { name: "Bordão de Madeira", bonus: 0, damage: "1d4", type: "impacto" }
          ],
          specialFeature: "🔮 Faísca Arcana: 1x ao dia realiza um truque menor inofensivo emulando efeito de 1º círculo por 1 rodada.",
          morale: 10,
          moraleDc: 8,
          defaultMission: "Auxiliar na transcrição de pergaminhos e segurar o grimório",
          description: "Estudante da academia de magia que decifra alfabetos arcanos básicos."
        }
      ]
    },

    specialists: {
      name: "Especialistas Civis",
      description: "Profissionais técnicos e eruditos com conhecimento aprofundado em uma área específica. Não lutam em combate.",
      periodUnit: "semana",
      items: [
        {
          id: "spec_alchemist",
          name: "Alquimista",
          type: "specialist",
          cost: 250, // 250 PO por semana
          costPeriod: "semana",
          foodCost: 0,
          hp: 4,
          maxHp: 4,
          ac: 10,
          speed: "9m (30ft)",
          morale: 7,
          moraleDc: 10,
          specialFeature: "🧪 Produção: Réplicas de poções não-mágicas e venenos pela metade do preço.",
          defaultMission: "Fabricar antídotos e estudar amostras coletadas na masmorra",
          description: "Especialista em destilação, óleos, ácidos e substâncias alquímicas."
        },
        {
          id: "spec_engineer",
          name: "Engenheiro & Arquiteto",
          type: "specialist",
          cost: 185,
          costPeriod: "semana",
          foodCost: 0,
          hp: 4,
          maxHp: 4,
          ac: 10,
          speed: "9m (30ft)",
          morale: 7,
          moraleDc: 10,
          specialFeature: "🏰 Alvenaria: Projetos de fortificações, pontes, torres e escavações.",
          defaultMission: "Analisar a estabilidade de ruínas e fortificar o acampamento",
          description: "Mestre de obras e desenhista de plantas arquitetônicas e defensivas."
        },
        {
          id: "spec_spy",
          name: "Espião & Informante",
          type: "specialist",
          cost: 125,
          costPeriod: "semana",
          foodCost: 0,
          hp: 6,
          maxHp: 6,
          ac: 12,
          speed: "9m (30ft)",
          morale: 6,
          moraleDc: 11,
          specialFeature: "🕵️ Infiltração: Intercepta correspondências, vigia alvos e coleta boatos.",
          defaultMission: "Infiltrar-se na taverna local e mapear as tropas do barão rival",
          description: "Agente disfarçado que atua nas sombras em troca de ouro vivo."
        },
        {
          id: "spec_sage",
          name: "Sábio & Erudito",
          type: "specialist",
          cost: 100, // Custo base de referência por dia de pesquisa
          costPeriod: "semana",
          foodCost: 0,
          hp: 4,
          maxHp: 4,
          ac: 10,
          speed: "9m (30ft)",
          morale: 7,
          moraleDc: 10,
          specialFeature: "📜 Pesquisa: Responde perguntas simples (50 PO/hora), gerais (100 PO/dia) ou específicas (500 PO/semana).",
          defaultMission: "Pesquisar o nome do lich antigo na biblioteca arcana",
          description: "Pesquisador histórico, linguista e mestre em geografia antiga."
        },
        {
          id: "spec_captain",
          name: "Capitão de Navio / Navegador",
          type: "specialist",
          cost: 70,
          costPeriod: "semana",
          foodCost: 0,
          hp: 12,
          maxHp: 12,
          ac: 13,
          speed: "9m (30ft)",
          morale: 8,
          moraleDc: 10,
          specialFeature: "⛵ Navegação: Comanda embarcações por rios e mares conhecendo todas as rotas.",
          defaultMission: "Manter a embarcação pronta para fuga rápida no porto",
          description: "Comandante experiente com conhecimento de correntes marítimas e portos."
        },
        {
          id: "spec_sailor",
          name: "Marinheiro",
          type: "specialist",
          cost: 1,
          costPeriod: "semana",
          foodCost: 0,
          hp: 6,
          maxHp: 6,
          ac: 11,
          speed: "9m (30ft)",
          morale: 7,
          moraleDc: 10,
          defaultMission: "Operar as velas e vigiar o convés",
          description: "Membro da tripulação capacitado para manusear cordas e velas."
        }
      ]
    }
  }
};

// Funções utilitárias de regras D&D 5E
function calculateHirelingCharismaLimit(chaScore) {
  const score = parseInt(chaScore, 10) || 10;
  if (score <= 8) return 0; // Regra expressa do livro: CAR 8 ou menor não pode contratar ajudantes
  const mod = Math.floor((score - 10) / 2);
  return Math.max(0, mod + 1);
}

if (typeof module !== 'undefined') {
  module.exports = {
    HIRELINGS_CATALOG,
    calculateHirelingCharismaLimit
  };
}
