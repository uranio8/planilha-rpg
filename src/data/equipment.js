// src/data/equipment.js - D&D 5E Equipment Compendium (pt-BR)
// Mapeado com base no acervo oficial (Segredos de Alancia & SRD 5E)
// Preços integralmente convertidos e expressos em Peças de Ouro (PO)

const EQUIPMENT_DATA = [
  {
    "name": "Armadura Acolchoada",
    "category": "Armaduras e Escudos",
    "cost": "5 PO",
    "damage": "CA 11 + Des",
    "weight": "4 kg",
    "prop": "Desvantagem em Furtividade. Armadura Leve."
  },
  {
    "name": "Armadura de Couro",
    "category": "Armaduras e Escudos",
    "cost": "10 PO",
    "damage": "CA 11 + Des",
    "weight": "5 kg",
    "prop": "Armadura Leve flexível e silenciosa."
  },
  {
    "name": "Armadura de Couro Batido",
    "category": "Armaduras e Escudos",
    "cost": "45 PO",
    "damage": "CA 12 + Des",
    "weight": "6,5 kg",
    "prop": "Reforçada com rebites de metal. Armadura Leve."
  },
  {
    "name": "Armadura de Placas Completa",
    "category": "Armaduras e Escudos",
    "cost": "1500 PO",
    "damage": "CA 18",
    "weight": "32,5 kg",
    "prop": "Força 15 necessária. Desvantagem em Furtividade. Proteção máxima de placas de aço."
  },
  {
    "name": "Camisão de Cota de Malha",
    "category": "Armaduras e Escudos",
    "cost": "50 PO",
    "damage": "CA 13 + Des (máx 2)",
    "weight": "10 kg",
    "prop": "Camisa de anéis de metal. Armadura Média."
  },
  {
    "name": "Cota de Anéis",
    "category": "Armaduras e Escudos",
    "cost": "30 PO",
    "damage": "CA 14",
    "weight": "20 kg",
    "prop": "Desvantagem em Furtividade. Armadura Pesada básica."
  },
  {
    "name": "Cota de Escamas",
    "category": "Armaduras e Escudos",
    "cost": "50 PO",
    "damage": "CA 14 + Des (máx 2)",
    "weight": "22,5 kg",
    "prop": "Desvantagem em Furtividade. Armadura Média."
  },
  {
    "name": "Cota de Malha",
    "category": "Armaduras e Escudos",
    "cost": "75 PO",
    "damage": "CA 16",
    "weight": "27,5 kg",
    "prop": "Força 13 necessária. Desvantagem em Furtividade. Armadura Pesada."
  },
  {
    "name": "Cota de Talas",
    "category": "Armaduras e Escudos",
    "cost": "200 PO",
    "damage": "CA 17",
    "weight": "30 kg",
    "prop": "Força 15 necessária. Desvantagem em Furtividade. Armadura Pesada."
  },
  {
    "name": "Escudo",
    "category": "Armaduras e Escudos",
    "cost": "10 PO",
    "damage": "+2 CA",
    "weight": "3 kg",
    "prop": "Empunhado em uma das mãos. Concede +2 de bônus na CA."
  },
  {
    "name": "Gibão de Peles",
    "category": "Armaduras e Escudos",
    "cost": "10 PO",
    "damage": "CA 12 + Des (máx 2)",
    "weight": "6 kg",
    "prop": "Peles grossas e couro rústico. Armadura Média."
  },
  {
    "name": "Meia-Armadura (Half Plate)",
    "category": "Armaduras e Escudos",
    "cost": "750 PO",
    "damage": "CA 15 + Des (máx 2)",
    "weight": "20 kg",
    "prop": "Desvantagem em Furtividade. Armadura Média de alta proteção."
  },
  {
    "name": "Peitoral de Aço",
    "category": "Armaduras e Escudos",
    "cost": "400 PO",
    "damage": "CA 14 + Des (máx 2)",
    "weight": "10 kg",
    "prop": "Placa de peito esculpida. Sem penalidade de furtividade. Armadura Média."
  },
  {
    "name": "Alabarda (Halberd)",
    "category": "Armas Marciais",
    "cost": "20 PO",
    "damage": "1d10 cortante",
    "weight": "3 kg",
    "prop": "Pesada, alcance (3m), duas mãos."
  },
  {
    "name": "Arco Longo (Longbow)",
    "category": "Armas Marciais",
    "cost": "50 PO",
    "damage": "1d8 perfurante",
    "weight": "1 kg",
    "prop": "Pesada, munição (distância 45/180m), duas mãos."
  },
  {
    "name": "Besta de Mão (Hand Crossbow)",
    "category": "Armas Marciais",
    "cost": "75 PO",
    "damage": "1d6 perfurante",
    "weight": "1,5 kg",
    "prop": "Leve, munição (distância 9/36m), recarga."
  },
  {
    "name": "Besta Pesada (Heavy Crossbow)",
    "category": "Armas Marciais",
    "cost": "50 PO",
    "damage": "1d10 perfurante",
    "weight": "8 kg",
    "prop": "Pesada, munição (distância 30/120m), recarga, duas mãos."
  },
  {
    "name": "Chicote (Whip)",
    "category": "Armas Marciais",
    "cost": "2 PO",
    "damage": "1d4 cortante",
    "weight": "1,5 kg",
    "prop": "Acuidade, alcance (3m)."
  },
  {
    "name": "Cimitarra (Scimitar)",
    "category": "Armas Marciais",
    "cost": "25 PO",
    "damage": "1d6 cortante",
    "weight": "1,5 kg",
    "prop": "Acuidade, leve."
  },
  {
    "name": "Espada Curta (Shortsword)",
    "category": "Armas Marciais",
    "cost": "10 PO",
    "damage": "1d6 perfurante",
    "weight": "1 kg",
    "prop": "Acuidade, leve."
  },
  {
    "name": "Espada Grande (Greatsword)",
    "category": "Armas Marciais",
    "cost": "50 PO",
    "damage": "2d6 cortante",
    "weight": "3 kg",
    "prop": "Pesada, duas mãos."
  },
  {
    "name": "Espada Longa (Longsword)",
    "category": "Armas Marciais",
    "cost": "15 PO",
    "damage": "1d8 cortante",
    "weight": "1,5 kg",
    "prop": "Versátil (1d10)."
  },
  {
    "name": "Espadim / Rapieira (Rapier)",
    "category": "Armas Marciais",
    "cost": "25 PO",
    "damage": "1d8 perfurante",
    "weight": "1 kg",
    "prop": "Acuidade."
  },
  {
    "name": "Glaive (Glaive)",
    "category": "Armas Marciais",
    "cost": "20 PO",
    "damage": "1d10 cortante",
    "weight": "3 kg",
    "prop": "Pesada, alcance (3m), duas mãos."
  },
  {
    "name": "Grande Machado (Greataxe)",
    "category": "Armas Marciais",
    "cost": "30 PO",
    "damage": "1d12 cortante",
    "weight": "3,5 kg",
    "prop": "Pesada, duas mãos."
  },
  {
    "name": "Lança de Montaria (Lance)",
    "category": "Armas Marciais",
    "cost": "10 PO",
    "damage": "1d12 perfurante",
    "weight": "3 kg",
    "prop": "Alcance (3m), especial (desvantagem a 1,5m, duas mãos desmontado)."
  },
  {
    "name": "Lança Longa (Pike)",
    "category": "Armas Marciais",
    "cost": "5 PO",
    "damage": "1d10 perfurante",
    "weight": "9 kg",
    "prop": "Pesada, alcance (3m), duas mãos."
  },
  {
    "name": "Maça Estrela (Morningstar)",
    "category": "Armas Marciais",
    "cost": "15 PO",
    "damage": "1d8 perfurante",
    "weight": "2 kg",
    "prop": "Esfera de ferro com pontas."
  },
  {
    "name": "Machado de Batalha (Battleaxe)",
    "category": "Armas Marciais",
    "cost": "10 PO",
    "damage": "1d8 cortante",
    "weight": "2 kg",
    "prop": "Versátil (1d10)."
  },
  {
    "name": "Malho (Maul)",
    "category": "Armas Marciais",
    "cost": "10 PO",
    "damage": "2d6 concussão",
    "weight": "5 kg",
    "prop": "Pesada, duas mãos."
  },
  {
    "name": "Mangual (Flail)",
    "category": "Armas Marciais",
    "cost": "10 PO",
    "damage": "1d8 concussão",
    "weight": "1 kg",
    "prop": "Esfera de impacto em corrente."
  },
  {
    "name": "Martelo de Guerra (Warhammer)",
    "category": "Armas Marciais",
    "cost": "15 PO",
    "damage": "1d8 concussão",
    "weight": "1 kg",
    "prop": "Versátil (1d10)."
  },
  {
    "name": "Picareta de Guerra (War Pick)",
    "category": "Armas Marciais",
    "cost": "5 PO",
    "damage": "1d8 perfurante",
    "weight": "1 kg",
    "prop": "Pontas perfurantes de armadura."
  },
  {
    "name": "Rede (Net)",
    "category": "Armas Marciais",
    "cost": "1 PO",
    "damage": "Especial",
    "weight": "1,5 kg",
    "prop": "Especial, arremesso (distância 1,5/4,5m). Deixa o alvo impedido."
  },
  {
    "name": "Tridente (Trident)",
    "category": "Armas Marciais",
    "cost": "5 PO",
    "damage": "1d6 perfurante",
    "weight": "2 kg",
    "prop": "Arremesso (distância 6/18m), versátil (1d8)."
  },
  {
    "name": "Zarabatana (Blowgun)",
    "category": "Armas Marciais",
    "cost": "10 PO",
    "damage": "1 perfurante",
    "weight": "0,5 kg",
    "prop": "Munição (distância 7,5/30m), recarga."
  },
  {
    "name": "Adaga (Dagger)",
    "category": "Armas Simples",
    "cost": "2 PO",
    "damage": "1d4 perfurante",
    "weight": "0,5 kg",
    "prop": "Acuidade, leve, arremesso (distância 6/18m)."
  },
  {
    "name": "Arco Curto (Shortbow)",
    "category": "Armas Simples",
    "cost": "25 PO",
    "damage": "1d6 perfurante",
    "weight": "1 kg",
    "prop": "Munição (distância 24/96m), duas mãos."
  },
  {
    "name": "Azagaia (Javelin)",
    "category": "Armas Simples",
    "cost": "0,5 PO",
    "damage": "1d6 perfurante",
    "weight": "1 kg",
    "prop": "Arremesso (distância 9/36m)."
  },
  {
    "name": "Besta Leve (Light Crossbow)",
    "category": "Armas Simples",
    "cost": "25 PO",
    "damage": "1d8 perfurante",
    "weight": "2,5 kg",
    "prop": "Munição (distância 24/96m), recarga, duas mãos."
  },
  {
    "name": "Bordão (Quarterstaff)",
    "category": "Armas Simples",
    "cost": "0,2 PO",
    "damage": "1d6 concussão",
    "weight": "2 kg",
    "prop": "Versátil (1d8)."
  },
  {
    "name": "Clava (Club)",
    "category": "Armas Simples",
    "cost": "0,1 PO",
    "damage": "1d4 concussão",
    "weight": "1 kg",
    "prop": "Leve."
  },
  {
    "name": "Clava Grande (Greatclub)",
    "category": "Armas Simples",
    "cost": "2 PO",
    "damage": "1d8 concussão",
    "weight": "5 kg",
    "prop": "Duas mãos."
  },
  {
    "name": "Dardo (Dart)",
    "category": "Armas Simples",
    "cost": "0,05 PO",
    "damage": "1d4 perfurante",
    "weight": "0,1 kg",
    "prop": "Acuidade, arremesso (distância 6/18m)."
  },
  {
    "name": "Foice Curta (Sickle)",
    "category": "Armas Simples",
    "cost": "1 PO",
    "damage": "1d4 cortante",
    "weight": "1 kg",
    "prop": "Leve."
  },
  {
    "name": "Funda (Sling)",
    "category": "Armas Simples",
    "cost": "0,1 PO",
    "damage": "1d4 concussão",
    "weight": "—",
    "prop": "Munição (distância 9/36m)."
  },
  {
    "name": "Lança (Spear)",
    "category": "Armas Simples",
    "cost": "1 PO",
    "damage": "1d6 perfurante",
    "weight": "1,5 kg",
    "prop": "Arremesso (distância 6/18m), versátil (1d8)."
  },
  {
    "name": "Maça (Mace)",
    "category": "Armas Simples",
    "cost": "5 PO",
    "damage": "1d6 concussão",
    "weight": "2 kg",
    "prop": "Arma de impacto simples."
  },
  {
    "name": "Machadinha (Handaxe)",
    "category": "Armas Simples",
    "cost": "5 PO",
    "damage": "1d6 cortante",
    "weight": "1 kg",
    "prop": "Leve, arremesso (distância 6/18m)."
  },
  {
    "name": "Martelo Leve (Light Hammer)",
    "category": "Armas Simples",
    "cost": "2 PO",
    "damage": "1d4 concussão",
    "weight": "1 kg",
    "prop": "Leve, arremesso (distância 6/18m)."
  },
  {
    "name": "Caneca de Cerveja da Taverna",
    "category": "Comida e Serviços",
    "cost": "0,04 PO",
    "damage": "Bebida",
    "weight": "0,5 kg",
    "prop": "Cerveja artesanal servida na caneca de estanho."
  },
  {
    "name": "Estalagem - Acomodação Aristocrática (Diária)",
    "category": "Comida e Serviços",
    "cost": "4 PO /dia",
    "damage": "Luxo",
    "weight": "—",
    "prop": "Suíte nobre com banquete, criados e segurança privada."
  },
  {
    "name": "Estalagem - Acomodação Confortável (Diária)",
    "category": "Comida e Serviços",
    "cost": "0,8 PO /dia",
    "damage": "Hospedagem",
    "weight": "—",
    "prop": "Quarto privado limpo, cama com lençóis, água quente e refeição."
  },
  {
    "name": "Garrafa de Vinho Comum",
    "category": "Comida e Serviços",
    "cost": "0,2 PO",
    "damage": "Bebida",
    "weight": "1 kg",
    "prop": "Garrafa de vinho de mesa encorpado."
  },
  {
    "name": "Garrafa de Vinho Fino da Nobreza",
    "category": "Comida e Serviços",
    "cost": "10 PO",
    "damage": "Bebida Rara",
    "weight": "1 kg",
    "prop": "Safra élfica envelhecida em barris de carvalho."
  },
  {
    "name": "Passagem em Carruagem (Por km)",
    "category": "Comida e Serviços",
    "cost": "0,03 PO",
    "damage": "Transporte",
    "weight": "—",
    "prop": "Transporte regular de passageiros entre vilarejos."
  },
  {
    "name": "Refeição Simples e Farta",
    "category": "Comida e Serviços",
    "cost": "0,3 PO",
    "damage": "Alimento",
    "weight": "—",
    "prop": "Pão quente, queijo, cozido de carne e legumes."
  },
  {
    "name": "Serviço de Conjurador de Magia (Círculo 1-2)",
    "category": "Comida e Serviços",
    "cost": "25 PO",
    "damage": "Magia Sob Contrato",
    "weight": "—",
    "prop": "Contratação de sacerdote ou mago para conjurar magia básica (ex: Curar Ferimentos, Identificação)."
  },
  {
    "name": "Ábaco",
    "category": "Equipamento de Aventura",
    "cost": "2 PO",
    "damage": "—",
    "weight": "1 kg",
    "prop": "Instrumento de cálculo aritmético e contabilidade."
  },
  {
    "name": "Algemas de Aço",
    "category": "Equipamento de Aventura",
    "cost": "2 PO",
    "damage": "—",
    "weight": "3 kg",
    "prop": "Acompanha chave. CD 20 de Força ou CD 15 de Destreza para escapar."
  },
  {
    "name": "Antídoto (Frasco)",
    "category": "Equipamento de Aventura",
    "cost": "50 PO",
    "damage": "Cura / Suporte",
    "weight": "—",
    "prop": "Garante vantagem em testes de resistência contra veneno por 1 hora."
  },
  {
    "name": "Apito de Sinalização",
    "category": "Equipamento de Aventura",
    "cost": "0,05 PO",
    "damage": "—",
    "weight": "—",
    "prop": "Som agudo audível a mais de 200 metros."
  },
  {
    "name": "Arpéu (Gancho de Escalada)",
    "category": "Equipamento de Aventura",
    "cost": "2 PO",
    "damage": "—",
    "weight": "2 kg",
    "prop": "Gancho de ferro para fixação de cordas em muros e penhascos."
  },
  {
    "name": "Balança de Mercador",
    "category": "Equipamento de Aventura",
    "cost": "5 PO",
    "damage": "—",
    "weight": "1,5 kg",
    "prop": "Inclui balança e conjunto de pesos para medir até 1 kg com precisão."
  },
  {
    "name": "Balde",
    "category": "Equipamento de Aventura",
    "cost": "0,05 PO",
    "damage": "—",
    "weight": "1 kg",
    "prop": "Capacidade para 12 litros de líquido ou 0,5 m³ de sólidos."
  },
  {
    "name": "Barraca de Acampamento (2 pessoas)",
    "category": "Equipamento de Aventura",
    "cost": "2 PO",
    "damage": "—",
    "weight": "10 kg",
    "prop": "Lona impermeável e estacas de montagem para 2 pessoas."
  },
  {
    "name": "Bolinhas de Gude (Saco de 1.000)",
    "category": "Equipamento de Aventura",
    "cost": "1 PO",
    "damage": "Controle de Terreno",
    "weight": "1 kg",
    "prop": "Cobre 3x3m. Teste de Destreza CD 10 ou cai no chão."
  },
  {
    "name": "Bolsa de Componentes de Magia",
    "category": "Equipamento de Aventura",
    "cost": "25 PO",
    "damage": "Foco Mágico",
    "weight": "1 kg",
    "prop": "Contém todos os componentes materiais sem custo em PO de magias."
  },
  {
    "name": "Cadeado de Ferro com Chave",
    "category": "Equipamento de Aventura",
    "cost": "10 PO",
    "damage": "—",
    "weight": "0,5 kg",
    "prop": "Tranca robusta. CD 15 de Ladinagem para arrombar."
  },
  {
    "name": "Caixa de Fogo (Pederneira e Isqueiro)",
    "category": "Equipamento de Aventura",
    "cost": "0,5 PO",
    "damage": "—",
    "weight": "0,5 kg",
    "prop": "Pederneira, isca e ferro para acender fogueiras em 1 minuto."
  },
  {
    "name": "Campainha / Sino de Alarme",
    "category": "Equipamento de Aventura",
    "cost": "1 PO",
    "damage": "—",
    "weight": "—",
    "prop": "Sino de latão com som claro para armadilhas e alarmes."
  },
  {
    "name": "Caneca de Metal",
    "category": "Equipamento de Aventura",
    "cost": "0,02 PO",
    "damage": "—",
    "weight": "0,5 kg",
    "prop": "Caneca de estanho para beber cerveja ou água."
  },
  {
    "name": "Cantil de Couro",
    "category": "Equipamento de Aventura",
    "cost": "0,2 PO",
    "damage": "—",
    "weight": "2,5 kg",
    "prop": "Capacidade para 2 litros de água ou vinho."
  },
  {
    "name": "Corda de Cânhamo (15 metros)",
    "category": "Equipamento de Aventura",
    "cost": "1 PO",
    "damage": "—",
    "weight": "5 kg",
    "prop": "Possui 2 PV e pode ser arrebentada com teste de Força CD 17."
  },
  {
    "name": "Corda de Seda (15 metros)",
    "category": "Equipamento de Aventura",
    "cost": "10 PO",
    "damage": "—",
    "weight": "2,5 kg",
    "prop": "Mais leve e resistente que cânhamo. CD 17 de Força."
  },
  {
    "name": "Corrente de Ferro (3 metros)",
    "category": "Equipamento de Aventura",
    "cost": "5 PO",
    "damage": "—",
    "weight": "5 kg",
    "prop": "Possui 5 PV e CD 20 de Força para quebrar."
  },
  {
    "name": "Espelho de Aço",
    "category": "Equipamento de Aventura",
    "cost": "5 PO",
    "damage": "—",
    "weight": "0,25 kg",
    "prop": "Espelho polido útil para espiar cantos e emitir reflexos."
  },
  {
    "name": "Giz (1 pedaço)",
    "category": "Equipamento de Aventura",
    "cost": "0,01 PO",
    "damage": "—",
    "weight": "—",
    "prop": "Para marcação de passagens, mapas e símbolos."
  },
  {
    "name": "Kit de Escalada",
    "category": "Equipamento de Aventura",
    "cost": "25 PO",
    "damage": "—",
    "weight": "6 kg",
    "prop": "Inclui pítons especiais, ganchos de bota, luvas e cinto de ancoragem."
  },
  {
    "name": "Kit de Primeiros Socorros (10 usos)",
    "category": "Equipamento de Aventura",
    "cost": "5 PO",
    "damage": "Suporte",
    "weight": "1,5 kg",
    "prop": "Estabiliza uma criatura com 0 PV sem necessidade de teste de Medicina."
  },
  {
    "name": "Lanterna Coberta",
    "category": "Equipamento de Aventura",
    "cost": "5 PO",
    "damage": "Iluminação",
    "weight": "1 kg",
    "prop": "Luz plena em 9m e penumbra em +9m por 6 horas por frasco de óleo."
  },
  {
    "name": "Lanterna Furta-Fogo (Olho de Boi)",
    "category": "Equipamento de Aventura",
    "cost": "10 PO",
    "damage": "Iluminação",
    "weight": "1 kg",
    "prop": "Cone de luz plena de 18m e penumbra por +18m. Permite ocultar feixe."
  },
  {
    "name": "Luneta de Longo Alcance",
    "category": "Equipamento de Aventura",
    "cost": "1000 PO",
    "damage": "—",
    "weight": "0,5 kg",
    "prop": "Amplia visão de objetos e criaturas distantes em 2x."
  },
  {
    "name": "Manto / Capa de Viagem",
    "category": "Equipamento de Aventura",
    "cost": "0,5 PO",
    "damage": "—",
    "weight": "2 kg",
    "prop": "Vestimenta rústica com capuz para proteção contra chuva e frio."
  },
  {
    "name": "Martelo de Ferreiro / Aventureiro",
    "category": "Equipamento de Aventura",
    "cost": "1 PO",
    "damage": "1d4 concussão",
    "weight": "1,5 kg",
    "prop": "Para fixar pítons ou trabalhos manuais."
  },
  {
    "name": "Mochila de Couro (Capacidade 30L / 15kg)",
    "category": "Equipamento de Aventura",
    "cost": "2 PO",
    "damage": "—",
    "weight": "2,5 kg",
    "prop": "Armazena até 30 litros ou 15 kg de carga."
  },
  {
    "name": "Óleo (Frasco de 0,5L)",
    "category": "Equipamento de Aventura",
    "cost": "0,1 PO",
    "damage": "5 de dano de fogo",
    "weight": "0,5 kg",
    "prop": "Combustível de lanterna ou arma de arremesso que queima por 2 rodadas."
  },
  {
    "name": "Pé de Cabra",
    "category": "Equipamento de Aventura",
    "cost": "2 PO",
    "damage": "1d4 concussão",
    "weight": "2,5 kg",
    "prop": "Concede vantagem em testes de Força para arrombar portas ou baús."
  },
  {
    "name": "Pítons de Ferro (10 unidades)",
    "category": "Equipamento de Aventura",
    "cost": "0,05 PO",
    "damage": "—",
    "weight": "1,25 kg",
    "prop": "Cravos de ferro para fixação de cordas na rocha."
  },
  {
    "name": "Poção de Cura (2d4 + 2 PV)",
    "category": "Equipamento de Aventura",
    "cost": "50 PO",
    "damage": "Cura 2d4+2 PV",
    "weight": "0,25 kg",
    "prop": "Ação para beber ou administrar em um aliado inconsciente."
  },
  {
    "name": "Rações de Viagem (1 dia)",
    "category": "Equipamento de Aventura",
    "cost": "0,5 PO",
    "damage": "Sustento",
    "weight": "1 kg",
    "prop": "Comida desidratada, frutas secas e pão duro nutritivo."
  },
  {
    "name": "Saco de Dormir",
    "category": "Equipamento de Aventura",
    "cost": "1 PO",
    "damage": "—",
    "weight": "2,5 kg",
    "prop": "Forro térmico e acolchoado para descanso em acampamento."
  },
  {
    "name": "Tocha (Iluminação 6m)",
    "category": "Equipamento de Aventura",
    "cost": "0,01 PO",
    "damage": "1 de fogo",
    "weight": "0,5 kg",
    "prop": "Queima por 1 hora. Luz plena em 6m e penumbra em +6m."
  },
  {
    "name": "Vela de Cera (Iluminação 1,5m)",
    "category": "Equipamento de Aventura",
    "cost": "0,01 PO",
    "damage": "—",
    "weight": "—",
    "prop": "Queima por 1 hora. Luz plena em 1,5m e penumbra por +1,5m."
  },
  {
    "name": "Alaúde (Lute)",
    "category": "Ferramentas e Kits",
    "cost": "35 PO",
    "damage": "Instrumento Musical",
    "weight": "1 kg",
    "prop": "Instrumento de cordas tradicional de bardos e trovadores."
  },
  {
    "name": "Baralho de Três Dragões",
    "category": "Ferramentas e Kits",
    "cost": "1 PO",
    "damage": "Jogo de Cartas",
    "weight": "—",
    "prop": "Popular jogo de estratégia e blefe nas estalagens."
  },
  {
    "name": "Conjunto de Dados de Osso",
    "category": "Ferramentas e Kits",
    "cost": "1 PO",
    "damage": "Jogo de Azar",
    "weight": "—",
    "prop": "Dados talhados para apostas em tavernas."
  },
  {
    "name": "Ferramentas de Alquimista",
    "category": "Ferramentas e Kits",
    "cost": "50 PO",
    "damage": "—",
    "weight": "4 kg",
    "prop": "Tubos de ensaio, almofariz, pós químicos para fabricar compostos e ácidos."
  },
  {
    "name": "Ferramentas de Carpinteiro",
    "category": "Ferramentas e Kits",
    "cost": "8 PO",
    "damage": "—",
    "weight": "3 kg",
    "prop": "Serras, formões, plaina e pregos para construção em madeira."
  },
  {
    "name": "Ferramentas de Cartógrafo",
    "category": "Ferramentas e Kits",
    "cost": "15 PO",
    "damage": "—",
    "weight": "3 kg",
    "prop": "Compasso, réguas, tintas finas e pergaminhos para desenhar mapas precisos."
  },
  {
    "name": "Ferramentas de Cervejeiro",
    "category": "Ferramentas e Kits",
    "cost": "20 PO",
    "damage": "—",
    "weight": "4,5 kg",
    "prop": "Barril de fermentação, sifão e lúpulo para produção de cervejas artesanais."
  },
  {
    "name": "Ferramentas de Ferreiro",
    "category": "Ferramentas e Kits",
    "cost": "20 PO",
    "damage": "—",
    "weight": "4 kg",
    "prop": "Martelos pesados, tenazes, bigorneta portátil para forjar e reparar armas e armaduras."
  },
  {
    "name": "Ferramentas de Ladrão (Thieves' Tools)",
    "category": "Ferramentas e Kits",
    "cost": "25 PO",
    "damage": "—",
    "weight": "0,5 kg",
    "prop": "Gazua, pequenas alavancas e limas para desarmar armadilhas e abrir fechaduras."
  },
  {
    "name": "Flauta de Pã",
    "category": "Ferramentas e Kits",
    "cost": "12 PO",
    "damage": "Instrumento Musical",
    "weight": "1 kg",
    "prop": "Tubos de cana afinados com melodia encantadora."
  },
  {
    "name": "Kit de Disfarce",
    "category": "Ferramentas e Kits",
    "cost": "25 PO",
    "damage": "—",
    "weight": "1,5 kg",
    "prop": "Maquiagens, perucas, tintas de pele e adereços para mudar de identidade."
  },
  {
    "name": "Kit de Falsificação",
    "category": "Ferramentas e Kits",
    "cost": "15 PO",
    "damage": "—",
    "weight": "2,5 kg",
    "prop": "Sinetes de cera, pergaminhos especiais, tintas raras para forjar decretos reais e documentos."
  },
  {
    "name": "Kit de Herbalismo",
    "category": "Ferramentas e Kits",
    "cost": "5 PO",
    "damage": "—",
    "weight": "1,5 kg",
    "prop": "Bolsa de coleta, podador e almofariz para colher ervas medicinais e fabricar Poções de Cura."
  },
  {
    "name": "Kit of Envenenador (Poisoner's Kit)",
    "category": "Ferramentas e Kits",
    "cost": "50 PO",
    "damage": "—",
    "weight": "1 kg",
    "prop": "Frascos graduados, extratores e ingredientes para sintetizar venenos mortais."
  },
  {
    "name": "Lira Élfica",
    "category": "Ferramentas e Kits",
    "cost": "30 PO",
    "damage": "Instrumento Musical",
    "weight": "1 kg",
    "prop": "Instrumento clássico de cordas finas."
  },
  {
    "name": "Tambor de Guerra",
    "category": "Ferramentas e Kits",
    "cost": "6 PO",
    "damage": "Instrumento Musical",
    "weight": "1,5 kg",
    "prop": "Ritmo compassado e potente para incentivo em batalha."
  },
  {
    "name": "Amuleto Sagrado",
    "category": "Focos e Itens Arcanos",
    "cost": "5 PO",
    "damage": "Símbolo Sagrado",
    "weight": "0,5 kg",
    "prop": "Símbolo de divindade para clérigos e paladinos."
  },
  {
    "name": "Cajado Arcano",
    "category": "Focos e Itens Arcanos",
    "cost": "5 PO",
    "damage": "1d6 concussão (Versátil 1d8)",
    "weight": "2 kg",
    "prop": "Pode ser usado como bordão e foco arcano."
  },
  {
    "name": "Cristal Arcano",
    "category": "Focos e Itens Arcanos",
    "cost": "10 PO",
    "damage": "Foco Mágico",
    "weight": "0,5 kg",
    "prop": "Foco arcano para magos, feiticeiros e bruxos."
  },
  {
    "name": "Emblema Sagrado em Escudo",
    "category": "Focos e Itens Arcanos",
    "cost": "5 PO",
    "damage": "Símbolo Sagrado",
    "weight": "—",
    "prop": "Gravado diretamente na face de um escudo ou armadura."
  },
  {
    "name": "Orbe de Vidro / Quartzo",
    "category": "Focos e Itens Arcanos",
    "cost": "20 PO",
    "damage": "Foco Mágico",
    "weight": "1,5 kg",
    "prop": "Foco arcano em forma de esfera perfeita."
  },
  {
    "name": "Ramo de Visco (Foco Druídico)",
    "category": "Focos e Itens Arcanos",
    "cost": "1 PO",
    "damage": "Foco Druídico",
    "weight": "—",
    "prop": "Colhido sagradamente para conjuração druídica."
  },
  {
    "name": "Relicário com Relíquia Divina",
    "category": "Focos e Itens Arcanos",
    "cost": "5 PO",
    "damage": "Símbolo Sagrado",
    "weight": "1 kg",
    "prop": "Pequena caixa contendo fragmento sagrado ou escritura."
  },
  {
    "name": "Totem de Madeira Druídico",
    "category": "Focos e Itens Arcanos",
    "cost": "1 PO",
    "damage": "Foco Druídico",
    "weight": "—",
    "prop": "Esculpido com feições animais ou elementos da natureza."
  },
  {
    "name": "Varinha Arcana",
    "category": "Focos e Itens Arcanos",
    "cost": "10 PO",
    "damage": "Foco Mágico",
    "weight": "0,5 kg",
    "prop": "Varinha de madeira entalhada ou osso."
  },
  {
    "name": "Camelo do Deserto",
    "category": "Montarias e Animais",
    "cost": "50 PO",
    "damage": "Mordida 1d4",
    "weight": "400 kg",
    "prop": "Deslocamento 15m. Aguenta dias sem água no calor escaldante."
  },
  {
    "name": "Cavalo de Guerra",
    "category": "Montarias e Animais",
    "cost": "400 PO",
    "damage": "Ataque Cascos 2d6+4",
    "weight": "540 kg",
    "prop": "Deslocamento 18m. Treinado para suportar o caos e barulho do combate."
  },
  {
    "name": "Cavalo de Montaria",
    "category": "Montarias e Animais",
    "cost": "75 PO",
    "damage": "Ataque Cascos 2d4+3",
    "weight": "450 kg",
    "prop": "Deslocamento 18m. Capacidade de carga de até 240 kg."
  },
  {
    "name": "Mastim (Cão de Guarda)",
    "category": "Montarias e Animais",
    "cost": "25 PO",
    "damage": "Mordida 1d6+3",
    "weight": "50 kg",
    "prop": "Deslocamento 12m. Faro e audição aguçados com vantagem em Percepção."
  },
  {
    "name": "Mula de Carga",
    "category": "Montarias e Animais",
    "cost": "8 PO",
    "damage": "Ataque Cascos 1d4+2",
    "weight": "300 kg",
    "prop": "Deslocamento 12m. Animal resistente com capacidade de carga de 210 kg."
  },
  {
    "name": "Pônei",
    "category": "Montarias e Animais",
    "cost": "30 PO",
    "damage": "Ataque Cascos 1d4+2",
    "weight": "220 kg",
    "prop": "Deslocamento 12m. Montaria dócil ideal para halflings e gnomos."
  },
  {
    "name": "Agulhas de Zarabatana (50 unidades)",
    "category": "Munições",
    "cost": "1 PO",
    "damage": "Munição",
    "weight": "0,5 kg",
    "prop": "Agulhas finas para zarabatana."
  },
  {
    "name": "Balas de Funda (20 unidades)",
    "category": "Munições",
    "cost": "0,04 PO",
    "damage": "Munição",
    "weight": "0,75 kg",
    "prop": "Esferas de chumbo para funda."
  },
  {
    "name": "Flechas (20 unidades)",
    "category": "Munições",
    "cost": "1 PO",
    "damage": "Munição",
    "weight": "0,5 kg",
    "prop": "Para arco curto e arco longo."
  },
  {
    "name": "Virotes de Besta (20 unidades)",
    "category": "Munições",
    "cost": "1 PO",
    "damage": "Munição",
    "weight": "0,75 kg",
    "prop": "Para bestas leves, pesadas e de mão."
  },
  {
    "name": "Pacote de Aventureiro (Dungeon's Pack)",
    "category": "Pacotes de Equipamento",
    "cost": "12 PO",
    "damage": "Kit Completo",
    "weight": "27 kg",
    "prop": "Mochila, pé de cabra, martelo, 10 pítons, 10 tochas, caixa de fogo, 10 dias de ração, cantil e 15m de corda."
  },
  {
    "name": "Pacote de Diplomata (Scholar's Pack)",
    "category": "Pacotes de Equipamento",
    "cost": "39 PO",
    "damage": "Kit Diplomático",
    "weight": "18 kg",
    "prop": "Baú elegante, estojos para mapas, roupas finas, frasco de tinta, pena, 10 folhas de pergaminho e perfume."
  },
  {
    "name": "Pacote de Explorador (Explorer's Pack)",
    "category": "Pacotes de Equipamento",
    "cost": "10 PO",
    "damage": "Kit Completo",
    "weight": "25 kg",
    "prop": "Mochila, saco de dormir, kit de refeição, caixa de fogo, 10 tochas, 10 dias de ração, cantil e 15m de corda."
  },
  {
    "name": "Pacote de Sacerdote (Priest's Pack)",
    "category": "Pacotes de Equipamento",
    "cost": "19 PO",
    "damage": "Kit Religioso",
    "weight": "12 kg",
    "prop": "Mochila, cobertor, 10 velas, caixa de fogo, caixa de esmolas, incenso, incensário, vestes e 2 dias de ração."
  },
  {
    "name": "Ácido (Frasco de Arremesso)",
    "category": "Poções e Alquimia",
    "cost": "25 PO",
    "damage": "2d6 de ácido",
    "weight": "0,5 kg",
    "prop": "Ataque à distância improvisado com alcance 6m."
  },
  {
    "name": "Água Benta (Frasco Sagrado)",
    "category": "Poções e Alquimia",
    "cost": "25 PO",
    "damage": "2d6 dano radiante",
    "weight": "0,5 kg",
    "prop": "Causa 2d6 dano radiante contra mortos-vivos e ínferos."
  },
  {
    "name": "Fogo Alquímico (Frasco)",
    "category": "Poções e Alquimia",
    "cost": "50 PO",
    "damage": "1d4 dano de fogo / rodada",
    "weight": "0,5 kg",
    "prop": "Incendeia o alvo. O alvo deve gastar uma ação e teste de Destreza CD 10 para apagar."
  },
  {
    "name": "Poção de Força do Gigante da Colina",
    "category": "Poções e Alquimia",
    "cost": "300 PO",
    "damage": "Força 21",
    "weight": "0,25 kg",
    "prop": "Aumenta o valor de Força para 21 (+5) durante 1 hora."
  },
  {
    "name": "Poção de Invisibilidade (Rara)",
    "category": "Poções e Alquimia",
    "cost": "250 PO",
    "damage": "Magia / Furtividade",
    "weight": "0,25 kg",
    "prop": "Torna quem bebe invisível por até 1 hora."
  },
  {
    "name": "Veneno Básico (Frasco de 3 doses)",
    "category": "Poções e Alquimia",
    "cost": "100 PO",
    "damage": "1d4 veneno (CD 10 Con)",
    "weight": "—",
    "prop": "Aplica em armas ou munições. Dura 1 minuto antes de secar."
  },
  {
    "name": "Bote a Remo",
    "category": "Veículos e Arreios",
    "cost": "50 PO",
    "damage": "Capacidade 4 pessoas",
    "weight": "50 kg",
    "prop": "Deslocamento 3 km/h. Embarcação fluvial para travessias."
  },
  {
    "name": "Carroça de Madeira (2 rodas)",
    "category": "Veículos e Arreios",
    "cost": "15 PO",
    "damage": "Capacidade 1 Tonelada",
    "weight": "100 kg",
    "prop": "Puxada por 1 cavalo ou mula. Ideal para transportar espólios de masmorra."
  },
  {
    "name": "Carruagem Confortável (4 rodas)",
    "category": "Veículos e Arreios",
    "cost": "100 PO",
    "damage": "Transporta 4 pessoas",
    "weight": "300 kg",
    "prop": "Cabine fechada estofada puxada por 2 cavalos."
  },
  {
    "name": "Sela de Montaria Comum",
    "category": "Veículos e Arreios",
    "cost": "5 PO",
    "damage": "—",
    "weight": "12,5 kg",
    "prop": "Assento de couro com estribos para cavalgada diária."
  },
  {
    "name": "Sela Militar de Batalha",
    "category": "Veículos e Arreios",
    "cost": "20 PO",
    "damage": "Vantagem em Equitação",
    "weight": "15 kg",
    "prop": "Encosto alto que concede vantagem para não cair da montaria se sofrer dano."
  },
  {
    "name": "Veleiro Costeiro",
    "category": "Veículos e Arreios",
    "cost": "10000 PO",
    "damage": "Tripulação 20",
    "weight": "10 Toneladas",
    "prop": "Deslocamento 8 km/h. Navio mercante resistente para viagens marítimas."
  }
];
