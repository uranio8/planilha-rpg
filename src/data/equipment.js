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
  },
  // ==========================================================================
  // 💎 GEMAS E OBJETOS DE ARTE OFICIAIS (GUIA DO MESTRE CAP. 7 - PÁG. 134-135)
  // ==========================================================================
  {
    "name": "Azurita (Gema de 10 PO)",
    "category": "Tesouros & Gemas",
    "cost": "10 PO",
    "damage": "Valor 10 PO",
    "weight": "0,01 kg",
    "prop": "Pedra preciosa azul escuro mosqueado opaco (Guia do Mestre, p. 134)."
  },
  {
    "name": "Lápis-Lazúli (Gema de 10 PO)",
    "category": "Tesouros & Gemas",
    "cost": "10 PO",
    "damage": "Valor 10 PO",
    "weight": "0,01 kg",
    "prop": "Pedra preciosa azul claro e escuro opaco com manchas amarelas (Guia do Mestre, p. 134)."
  },
  {
    "name": "Olho de Tigre (Gema de 10 PO)",
    "category": "Tesouros & Gemas",
    "cost": "10 PO",
    "damage": "Valor 10 PO",
    "weight": "0,01 kg",
    "prop": "Pedra preciosa marrom translúcido com centro dourado (Guia do Mestre, p. 134)."
  },
  {
    "name": "Turquesa (Gema de 10 PO)",
    "category": "Tesouros & Gemas",
    "cost": "10 PO",
    "damage": "Valor 10 PO",
    "weight": "0,01 kg",
    "prop": "Pedra preciosa azul esverdeado claro opaco (Guia do Mestre, p. 134)."
  },
  {
    "name": "Pedra de Sangue (Gema de 50 PO)",
    "category": "Tesouros & Gemas",
    "cost": "50 PO",
    "damage": "Valor 50 PO",
    "weight": "0,01 kg",
    "prop": "Pedra preciosa cinza escuro opaco com manchas vermelhas (Guia do Mestre, p. 134)."
  },
  {
    "name": "Ônix (Gema de 50 PO)",
    "category": "Tesouros & Gemas",
    "cost": "50 PO",
    "damage": "Valor 50 PO",
    "weight": "0,01 kg",
    "prop": "Faixas opacas de preto e branco, ou preto ou branco puro (Guia do Mestre, p. 134)."
  },
  {
    "name": "Quartzo Estrela Rosa (Gema de 50 PO)",
    "category": "Tesouros & Gemas",
    "cost": "50 PO",
    "damage": "Valor 50 PO",
    "weight": "0,01 kg",
    "prop": "Pedra translúcida rosa leitosa com centro branco em forma de estrela."
  },
  {
    "name": "Âmbar (Gema de 100 PO)",
    "category": "Tesouros & Gemas",
    "cost": "100 PO",
    "damage": "Valor 100 PO",
    "weight": "0,01 kg",
    "prop": "Resina fóssil transparente de ouro aquoso a ouro rico (Guia do Mestre, p. 134)."
  },
  {
    "name": "Ametista (Gema de 100 PO)",
    "category": "Tesouros & Gemas",
    "cost": "100 PO",
    "damage": "Valor 100 PO",
    "weight": "0,01 kg",
    "prop": "Cristal transparente de púrpura profundo (Guia do Mestre, p. 134)."
  },
  {
    "name": "Jade (Gema de 100 PO)",
    "category": "Tesouros & Gemas",
    "cost": "100 PO",
    "damage": "Valor 100 PO",
    "weight": "0,01 kg",
    "prop": "Pedra translúcida verde claro, verde escuro ou branco."
  },
  {
    "name": "Pérola (Gema de 100 PO)",
    "category": "Tesouros & Gemas",
    "cost": "100 PO",
    "damage": "Valor 100 PO",
    "weight": "0,01 kg",
    "prop": "Pérola opaca e brilhante branca, amarela ou rosa (Componente de Identificação)."
  },
  {
    "name": "Água-Marinha (Gema de 500 PO)",
    "category": "Tesouros & Gemas",
    "cost": "500 PO",
    "damage": "Valor 500 PO",
    "weight": "0,01 kg",
    "prop": "Gema transparente azul esverdeado pálido."
  },
  {
    "name": "Pérola Negra (Gema de 500 PO)",
    "category": "Tesouros & Gemas",
    "cost": "500 PO",
    "damage": "Valor 500 PO",
    "weight": "0,01 kg",
    "prop": "Pérola rara opaca de preto puro reluzente."
  },
  {
    "name": "Topázio (Gema de 500 PO)",
    "category": "Tesouros & Gemas",
    "cost": "500 PO",
    "damage": "Valor 500 PO",
    "weight": "0,01 kg",
    "prop": "Gema transparente amarelo dourado."
  },
  {
    "name": "Esmeralda (Gema de 1000 PO)",
    "category": "Tesouros & Gemas",
    "cost": "1000 PO",
    "damage": "Valor 1000 PO",
    "weight": "0,01 kg",
    "prop": "Gema preciosa transparente de verde profundo brilhante."
  },
  {
    "name": "Safira Azul (Gema de 1000 PO)",
    "category": "Tesouros & Gemas",
    "cost": "1000 PO",
    "damage": "Valor 1000 PO",
    "weight": "0,01 kg",
    "prop": "Gema preciosa transparente de azul claro a médio (Componente de Revivificar/Invocação)."
  },
  {
    "name": "Opala de Fogo (Gema de 1000 PO)",
    "category": "Tesouros & Gemas",
    "cost": "1000 PO",
    "damage": "Valor 1000 PO",
    "weight": "0,01 kg",
    "prop": "Gema translúcida vermelho fogo intenso."
  },
  {
    "name": "Diamante (Gema de 5000 PO)",
    "category": "Tesouros & Gemas",
    "cost": "5000 PO",
    "damage": "Valor 5000 PO",
    "weight": "0,01 kg",
    "prop": "Diamante puro transparente azul-branco, canário, rosa ou azul (Componente de Ressurreição)."
  },
  {
    "name": "Rubi (Gema de 5000 PO)",
    "category": "Tesouros & Gemas",
    "cost": "5000 PO",
    "damage": "Valor 5000 PO",
    "weight": "0,01 kg",
    "prop": "Rubi transparente de carmesim claro a profundo."
  },
  {
    "name": "Jarro de Prata Finamente Trabalhado (Arte 25 PO)",
    "category": "Tesouros & Gemas",
    "cost": "25 PO",
    "damage": "Valor 25 PO",
    "weight": "0,5 kg",
    "prop": "Objeto de arte de 25 PO (Guia do Mestre, p. 134)."
  },
  {
    "name": "Estatueta Esculpida em Osso (Arte 25 PO)",
    "category": "Tesouros & Gemas",
    "cost": "25 PO",
    "damage": "Valor 25 PO",
    "weight": "0,2 kg",
    "prop": "Objeto de arte de 25 PO esculpido com detalhes minuciosos."
  },
  {
    "name": "Bracelete de Ouro Pequeno (Arte 25 PO)",
    "category": "Tesouros & Gemas",
    "cost": "25 PO",
    "damage": "Valor 25 PO",
    "weight": "0,1 kg",
    "prop": "Objeto de arte de 25 PO em ouro polido."
  },
  {
    "name": "Cálice de Prata com Pedras da Lua (Arte 250 PO)",
    "category": "Tesouros & Gemas",
    "cost": "250 PO",
    "damage": "Valor 250 PO",
    "weight": "0,5 kg",
    "prop": "Objeto de arte de 250 PO cravejado com pedras da lua."
  },
  {
    "name": "Anel de Ouro Cravejado de Pedras de Sangue (Arte 250 PO)",
    "category": "Tesouros & Gemas",
    "cost": "250 PO",
    "damage": "Valor 250 PO",
    "weight": "0,05 kg",
    "prop": "Objeto de arte de 250 PO (Guia do Mestre, p. 135)."
  },
  {
    "name": "Colar de Pérolas Finas (Arte 250 PO)",
    "category": "Tesouros & Gemas",
    "cost": "250 PO",
    "damage": "Valor 250 PO",
    "weight": "0,1 kg",
    "prop": "Objeto de arte de 250 PO com pérolas pequenas perfeitas."
  },
  {
    "name": "Cálice de Ouro Cravejado de Esmeraldas (Arte 750 PO)",
    "category": "Tesouros & Gemas",
    "cost": "750 PO",
    "damage": "Valor 750 PO",
    "weight": "0,5 kg",
    "prop": "Objeto de arte nobre avaliado em 750 PO (Guia do Mestre, p. 135)."
  },
  {
    "name": "Harpa de Madeira Exótica com Marfim e Zircônio (Arte 750 PO)",
    "category": "Tesouros & Gemas",
    "cost": "750 PO",
    "damage": "Valor 750 PO",
    "weight": "1,5 kg",
    "prop": "Instrumento e obra de arte avaliado em 750 PO."
  },
  {
    "name": "Corrente de Ouro Fina com Safira de Fogo (Arte 2500 PO)",
    "category": "Tesouros & Gemas",
    "cost": "2500 PO",
    "damage": "Valor 2500 PO",
    "weight": "0,2 kg",
    "prop": "Objeto de arte real avaliado em 2.500 PO."
  },
  {
    "name": "Coroa de Ouro Cravejada de Joias (Arte 7500 PO)",
    "category": "Tesouros & Gemas",
    "cost": "7500 PO",
    "damage": "Valor 7500 PO",
    "weight": "1 kg",
    "prop": "Tesouro imperial avaliado em 7.500 PO (Guia do Mestre, p. 135)."
  },
  // ==========================================================================
  // ✨ ITENS MÁGICOS OFICIAIS (GUIA DO MESTRE CAP. 7 & GUIA DE XANATHAR)
  // ==========================================================================
  {
    "name": "Poção de Cura Maior",
    "category": "Poções e Elixires",
    "cost": "150 PO",
    "damage": "Cura 4d4 + 4 PV",
    "weight": "0,25 kg",
    "prop": "Item Mágico Incomum. Líquido vermelho cintilante que recupera 4d4 + 4 pontos de vida ao beber."
  },
  {
    "name": "Poção de Cura Superior",
    "category": "Poções e Elixires",
    "cost": "450 PO",
    "damage": "Cura 8d4 + 8 PV",
    "weight": "0,25 kg",
    "prop": "Item Mágico Raro. Recupera 8d4 + 8 pontos de vida ao beber."
  },
  {
    "name": "Poção de Cura Suprema",
    "category": "Poções e Elixires",
    "cost": "1350 PO",
    "damage": "Cura 10d4 + 20 PV",
    "weight": "0,25 kg",
    "prop": "Item Mágico Muito Raro. Recupera 10d4 + 20 pontos de vida ao beber."
  },
  {
    "name": "Poção de Invisibilidade",
    "category": "Poções e Elixires",
    "cost": "500 PO",
    "damage": "Invisível por 1h",
    "weight": "0,25 kg",
    "prop": "Item Mágico Muito Raro. Você fica invisível por 1 hora ou até atacar ou conjurar uma magia."
  },
  {
    "name": "Poção de Voo",
    "category": "Poções e Elixires",
    "cost": "500 PO",
    "damage": "Voo por 1h",
    "weight": "0,25 kg",
    "prop": "Item Mágico Muito Raro. Concede deslocamento de voo igual ao seu deslocamento de caminhada por 1 hora (flutuar)."
  },
  {
    "name": "Poção de Força do Gigante da Colina",
    "category": "Poções e Elixires",
    "cost": "200 PO",
    "damage": "Força 21 por 1h",
    "weight": "0,25 kg",
    "prop": "Item Mágico Incomum. Seu valor de Força muda para 21 (+5) durante 1 hora."
  },
  {
    "name": "Poção de Resistência",
    "category": "Poções e Elixires",
    "cost": "150 PO",
    "damage": "Resistência por 1h",
    "weight": "0,25 kg",
    "prop": "Item Mágico Incomum. Concede resistência a um tipo de dano (Ácido, Frio, Fogo, Força, Elétrico, Necrótico, Veneno, Psíquico, Radiante ou Trovejante) por 1 hora."
  },
  {
    "name": "Pergaminho de Magia (1º Círculo)",
    "category": "Itens Mágicos",
    "cost": "75 PO",
    "damage": "CD 13 / Ataque +5",
    "weight": "0,05 kg",
    "prop": "Item Mágico Comum. Contém uma magia de 1º círculo pronta para ser conjurada sem gastar espaço de magia."
  },
  {
    "name": "Pergaminho de Magia (2º Círculo)",
    "category": "Itens Mágicos",
    "cost": "150 PO",
    "damage": "CD 13 / Ataque +5",
    "weight": "0,05 kg",
    "prop": "Item Mágico Incomum. Contém uma magia de 2º círculo pronta para ser conjurada."
  },
  {
    "name": "Pergaminho de Magia (3º Círculo)",
    "category": "Itens Mágicos",
    "cost": "300 PO",
    "damage": "CD 15 / Ataque +7",
    "weight": "0,05 kg",
    "prop": "Item Mágico Incomum. Contém uma magia de 3º círculo pronta para ser conjurada."
  },
  {
    "name": "Pergaminho de Magia (4º Círculo)",
    "category": "Itens Mágicos",
    "cost": "600 PO",
    "damage": "CD 15 / Ataque +7",
    "weight": "0,05 kg",
    "prop": "Item Mágico Raro. Contém uma magia de 4º círculo pronta para ser conjurada."
  },
  {
    "name": "Pergaminho de Magia (5º Círculo)",
    "category": "Itens Mágicos",
    "cost": "1500 PO",
    "damage": "CD 17 / Ataque +9",
    "weight": "0,05 kg",
    "prop": "Item Mágico Raro. Contém uma magia de 5º círculo pronta para ser conjurada."
  },
  {
    "name": "Espada da Vingança",
    "category": "Itens Mágicos",
    "cost": "400 PO",
    "damage": "+1 Acerto e Dano (1d8+1)",
    "weight": "1,5 kg",
    "prop": "Item Mágico Incomum (Requer Sintonização). Você ganha +1 nas jogadas de ataque e dano. Maldição: Ao sofrer dano em combate, deve passar em salvaguarda de Sabedoria CD 15 ou atacará quem o feriu até que um dos dois caia a 0 PV (Guia do Mestre, p. 171)."
  },
  {
    "name": "Arma +1 (Espada Longa / Qualquer)",
    "category": "Itens Mágicos",
    "cost": "500 PO",
    "damage": "+1 Acerto e Dano",
    "weight": "1,5 kg",
    "prop": "Item Mágico Incomum. Você recebe +1 de bônus nas jogadas de ataque e de dano feitas com esta arma mágica."
  },
  {
    "name": "Arma +2",
    "category": "Itens Mágicos",
    "cost": "2500 PO",
    "damage": "+2 Acerto e Dano",
    "weight": "1,5 kg",
    "prop": "Item Mágico Raro. Você recebe +2 de bônus nas jogadas de ataque e de dano feitas com esta arma mágica."
  },
  {
    "name": "Arma +3",
    "category": "Itens Mágicos",
    "cost": "10000 PO",
    "damage": "+3 Acerto e Dano",
    "weight": "1,5 kg",
    "prop": "Item Mágico Muito Raro. Você recebe +3 de bônus nas jogadas de ataque e de dano feitas com esta arma mágica."
  },
  {
    "name": "Espada Língua Flamejante (Flame Tongue)",
    "category": "Itens Mágicos",
    "cost": "3000 PO",
    "damage": "1d8 cortante + 2d6 fogo",
    "weight": "1,5 kg",
    "prop": "Item Mágico Raro (Requer Sintonização). Com uma ação bônus, chamas irrompem da lâmina (luz plena 12m) e causam +2d6 de dano de fogo extra em cada acerto."
  },
  {
    "name": "Espada Marca Gélida (Frost Brand)",
    "category": "Itens Mágicos",
    "cost": "5000 PO",
    "damage": "1d8 cortante + 1d6 frio",
    "weight": "1,5 kg",
    "prop": "Item Mágico Muito Raro (Requer Sintonização). Causa +1d6 de dano de frio extra e concede resistência a dano de fogo."
  },
  {
    "name": "Lâmina do Sol (Sun Blade)",
    "category": "Itens Mágicos",
    "cost": "4000 PO",
    "damage": "+2 (1d8+2 radiante)",
    "weight": "1 kg",
    "prop": "Item Mágico Raro (Requer Sintonização). Lâmina de pura luz radiante com propriedade Acuidade (+2 ataque e dano, +1d8 extra contra mortos-vivos)."
  },
  {
    "name": "Vingadora Sagrada (Holy Avenger)",
    "category": "Itens Mágicos",
    "cost": "25000 PO",
    "damage": "+3 (+2d10 radiante vs Corruptor/Morto-Vivo)",
    "weight": "1,5 kg",
    "prop": "Item Mágico Lendário (Requer Sintonização por um Paladino). Aura de 3m (ou 9m no nv 17+) concede vantagem em salvaguardas contra magias para você e aliados."
  },
  {
    "name": "Escudo +1",
    "category": "Itens Mágicos",
    "cost": "500 PO",
    "damage": "CA +3 (+2 base +1 mágico)",
    "weight": "3 kg",
    "prop": "Item Mágico Incomum. Enquanto empunhar este escudo, você ganha +1 de bônus na CA além do bônus normal do escudo."
  },
  {
    "name": "Armadura +1",
    "category": "Itens Mágicos",
    "cost": "1500 PO",
    "damage": "CA Base + 1",
    "weight": "10 kg",
    "prop": "Item Mágico Raro. Você recebe +1 de bônus na Classe de Armadura enquanto vestir esta armadura."
  },
  {
    "name": "Armadura de Mitral",
    "category": "Itens Mágicos",
    "cost": "800 PO",
    "damage": "Sem Desvantagem Furtividade",
    "weight": "8 kg",
    "prop": "Item Mágico Incomum. Armadura média ou pesada leve e flexível: não impõe desvantagem em Furtividade nem exige requisito de Força."
  },
  {
    "name": "Armadura de Adamante",
    "category": "Itens Mágicos",
    "cost": "800 PO",
    "damage": "Imune a Críticos",
    "weight": "15 kg",
    "prop": "Item Mágico Incomum. Qualquer acerto crítico contra você se torna um acerto normal."
  },
  {
    "name": "Bolsa de Carga (Bag of Holding)",
    "category": "Itens Mágicos",
    "cost": "500 PO",
    "damage": "Capacidade 250 kg",
    "weight": "7,5 kg",
    "prop": "Item Mágico Incomum. O interior é um espaço extradimensional que comporta até 250 kg (1,8 m³), mas a bolsa sempre pesa apenas 7,5 kg."
  },
  {
    "name": "Manto de Proteção (Cloak of Protection)",
    "category": "Itens Mágicos",
    "cost": "500 PO",
    "damage": "+1 CA e Salvaguardas",
    "weight": "0,5 kg",
    "prop": "Item Mágico Incomum (Requer Sintonização). Você ganha +1 de bônus na CA e em todos os testes de resistência."
  },
  {
    "name": "Anel de Proteção (Ring of Protection)",
    "category": "Itens Mágicos",
    "cost": "1500 PO",
    "damage": "+1 CA e Salvaguardas",
    "weight": "0,05 kg",
    "prop": "Item Mágico Raro (Requer Sintonização). Você ganha +1 de bônus na CA e em todos os testes de resistência."
  },
  {
    "name": "Manto Élfico (Cloak of Elvenkind)",
    "category": "Itens Mágicos",
    "cost": "500 PO",
    "damage": "Vantagem em Furtividade",
    "weight": "0,5 kg",
    "prop": "Item Mágico Incomum (Requer Sintonização). Testes de Percepção para vê-lo têm desvantagem, e você tem vantagem em Furtividade para se esconder."
  },
  {
    "name": "Botas Élficas (Boots of Elvenkind)",
    "category": "Itens Mágicos",
    "cost": "500 PO",
    "damage": "Passos Silenciosos",
    "weight": "0,5 kg",
    "prop": "Item Mágico Incomum. Seus passos não fazem som e você tem vantagem em testes de Furtividade para se mover silenciosamente."
  },
  {
    "name": "Botas Aladas (Winged Boots)",
    "category": "Itens Mágicos",
    "cost": "800 PO",
    "damage": "Voo por até 4h",
    "weight": "0,5 kg",
    "prop": "Item Mágico Incomum (Requer Sintonização). Concede deslocamento de voo igual ao seu deslocamento de caminhada."
  },
  {
    "name": "Manoplas de Força do Ogro",
    "category": "Itens Mágicos",
    "cost": "600 PO",
    "damage": "Força = 19 (+4)",
    "weight": "0,5 kg",
    "prop": "Item Mágico Incomum (Requer Sintonização). Seu valor de Força é 19 enquanto você usar estas manoplas."
  },
  {
    "name": "Amuleto de Saúde (Amulet of Health)",
    "category": "Itens Mágicos",
    "cost": "2000 PO",
    "damage": "Constituição = 19 (+4)",
    "weight": "0,1 kg",
    "prop": "Item Mágico Raro (Requer Sintonização). Seu valor de Constituição é 19 enquanto você usar este amuleto."
  },
  {
    "name": "Tiara do Intelecto (Headband of Intellect)",
    "category": "Itens Mágicos",
    "cost": "600 PO",
    "damage": "Inteligência = 19 (+4)",
    "weight": "0,1 kg",
    "prop": "Item Mágico Incomum (Requer Sintonização). Seu valor de Inteligência é 19 enquanto você usar esta tiara."
  },
  {
    "name": "Capa de Deslocamento (Cloak of Displacement)",
    "category": "Itens Mágicos",
    "cost": "2500 PO",
    "damage": "Desvantagem em Ataques contra você",
    "weight": "0,5 kg",
    "prop": "Item Mágico Raro (Requer Sintonização). Projeta uma ilusão fazendo atacantes terem desvantagem nas jogadas de ataque contra você."
  },
  {
    "name": "Varinha de Mísseis Mágicos",
    "category": "Itens Mágicos",
    "cost": "500 PO",
    "damage": "7 Cargas (Mísseis Mágicos)",
    "weight": "0,5 kg",
    "prop": "Item Mágico Incomum. Possui 7 cargas para conjurar Mísseis Mágicos (recupera 1d6+1 cargas ao amanhecer)."
  },
  {
    "name": "Varinha de Bolas de Fogo",
    "category": "Itens Mágicos",
    "cost": "3000 PO",
    "damage": "7 Cargas (8d6 fogo CD 15)",
    "weight": "0,5 kg",
    "prop": "Item Mágico Raro (Requer Sintonização por Conjurador). Possui 7 cargas para conjurar Bola de Fogo (CD 15)."
  },
  {
    "name": "Cajado do Poder (Staff of Power)",
    "category": "Itens Mágicos",
    "cost": "15000 PO",
    "damage": "+2 Ataque/CA/Salvaguardas/Magia (20 cargas)",
    "weight": "2 kg",
    "prop": "Item Mágico Muito Raro (Requer Sintonização por Bruxo, Feiticeiro ou Mago). +2 na CA, salvaguardas e ataques mágicos; conjura Bola de Fogo, Relâmpago, Muralha de Força e mais."
  },
  {
    "name": "Colar de Bolas de Fogo",
    "category": "Itens Mágicos",
    "cost": "1200 PO",
    "damage": "8d6 fogo por conta (CD 15)",
    "weight": "0,2 kg",
    "prop": "Item Mágico Raro. Contas destacáveis que podem ser arremessadas a até 18m explodindo como uma Bola de Fogo (8d6 de dano de fogo, CD 15)."
  },
  {
    "name": "Manto de Muitas Modas (Xanathar)",
    "category": "Itens Mágicos",
    "cost": "50 PO",
    "damage": "Item Mágico Comum",
    "weight": "0,5 kg",
    "prop": "Guia de Xanathar. Com uma ação bônus, você muda o estilo, cor e aparência qualidade deste manto."
  },
  {
    "name": "Armadura Fumegante (Xanathar)",
    "category": "Itens Mágicos",
    "cost": "75 PO",
    "damage": "Item Mágico Comum",
    "weight": "10 kg",
    "prop": "Guia de Xanathar. Fios de fumaça inofensiva e inodora se elevam constantemente desta armadura enquanto ela é vestida."
  },
  {
    "name": "Arma Tocada pela Lua (Moon-Touched Sword - Xanathar)",
    "category": "Itens Mágicos",
    "cost": "100 PO",
    "damage": "Luz Plena 4,5m (Mágica)",
    "weight": "1,5 kg",
    "prop": "Guia de Xanathar (Item Mágico Comum). Na escuridão, a lâmina desembainhada emite luz plena num raio de 4,5m e penumbra por mais 4,5m."
  },
  // ==========================================================================
  // 🧪 VENENOS OFICIAIS (GUIA DO MESTRE CAP. 8 - PÁG. 258)
  // ==========================================================================
  {
    "name": "Veneno de Serpente (DMG)",
    "category": "Poções e Elixires",
    "cost": "200 PO",
    "damage": "3d6 veneno (CON CD 11)",
    "weight": "0,1 kg",
    "prop": "Veneno de Ferimento (Guia do Mestre, p. 258). O alvo deve fazer salvaguarda de Constituição CD 11, sofrendo 10 (3d6) de dano de veneno ou metade no sucesso."
  },
  {
    "name": "Sangue de Assassino (DMG)",
    "category": "Poções e Elixires",
    "cost": "150 PO",
    "damage": "1d12 veneno + Envenenado 24h (CD 10)",
    "weight": "0,1 kg",
    "prop": "Veneno de Ingestão (Guia do Mestre, p. 258). Salvaguarda de Constituição CD 10 ou sofre 6 (1d12) de dano de veneno e fica Envenenado por 24 horas."
  },
  {
    "name": "Veneno de Wyvern (DMG)",
    "category": "Poções e Elixires",
    "cost": "1200 PO",
    "damage": "7d6 veneno (CON CD 15)",
    "weight": "0,1 kg",
    "prop": "Veneno de Ferimento (Guia do Mestre, p. 258). Salvaguarda de Constituição CD 15, sofrendo 24 (7d6) de dano de veneno na falha ou metade no sucesso."
  },
  {
    "name": "Lágrimas da Meia-Noite (DMG)",
    "category": "Poções e Elixires",
    "cost": "1500 PO",
    "damage": "9d6 veneno à meia-noite (CON CD 17)",
    "weight": "0,1 kg",
    "prop": "Veneno de Ingestão (Guia do Mestre, p. 258). Não faz efeito até o soar da meia-noite, quando causa 31 (9d6) de dano de veneno (CON CD 17 reduz à metade)."
  }
];

// Tabelas Estruturadas para o Gerador Oficial de Tesouros (Guia do Mestre Cap. 7)
const DMG_TREASURE_TABLES = {
  gems: {
    10: [
      { name: 'Azurita (Gema 10 PO)', desc: 'Pedra azul escuro mosqueado opaco (10 PO)' },
      { name: 'Ágata Malhada (Gema 10 PO)', desc: 'Pedra translúcida listrada marrom e azul (10 PO)' },
      { name: 'Quartzo Azul (Gema 10 PO)', desc: 'Cristal azul claro transparente (10 PO)' },
      { name: 'Hematita (Gema 10 PO)', desc: 'Pedra cinza escuro metálica opaca (10 PO)' },
      { name: 'Lápis-Lazúli (Gema 10 PO)', desc: 'Pedra azul opaca com pintas douradas (10 PO)' },
      { name: 'Malaquita (Gema 10 PO)', desc: 'Pedra estriada verde claro e escuro (10 PO)' },
      { name: 'Obsidiana (Gema 10 PO)', desc: 'Vidro vulcânico preto polido (10 PO)' },
      { name: 'Olho de Tigre (Gema 10 PO)', desc: 'Gema marrom translúcida com centro dourado (10 PO)' },
      { name: 'Turquesa (Gema 10 PO)', desc: 'Gema azul-esverdeada clara opaca (10 PO)' }
    ],
    50: [
      { name: 'Pedra de Sangue (Gema 50 PO)', desc: 'Cinza escuro opaco com manchas vermelhas (50 PO)' },
      { name: 'Cornalina (Gema 50 PO)', desc: 'Gema laranja avermelhada (50 PO)' },
      { name: 'Crisoprásio (Gema 50 PO)', desc: 'Gema verde translúcida (50 PO)' },
      { name: 'Citrino (Gema 50 PO)', desc: 'Cristal amarelo-acastanhado pálido (50 PO)' },
      { name: 'Jaspe (Gema 50 PO)', desc: 'Pedra opaca azul, preta ou marrom (50 PO)' },
      { name: 'Pedra da Lua (Gema 50 PO)', desc: 'Branco translúcido com brilho azul pálido (50 PO)' },
      { name: 'Ônix (Gema 50 PO)', desc: 'Faixas opacas de preto e branco (50 PO)' },
      { name: 'Quartzo Estrela Rosa (Gema 50 PO)', desc: 'Rosa translúcido com estrela branca no centro (50 PO)' }
    ],
    100: [
      { name: 'Âmbar (Gema 100 PO)', desc: 'Resina dourada transparente (100 PO)' },
      { name: 'Ametista (Gema 100 PO)', desc: 'Cristal púrpura profundo transparente (100 PO)' },
      { name: 'Coral (Gema 100 PO)', desc: 'Coral carmesim polido opaco (100 PO)' },
      { name: 'Granada (Gema 100 PO)', desc: 'Gema vermelha-violeta transparente (100 PO)' },
      { name: 'Jade (Gema 100 PO)', desc: 'Pedra verde imperial translúcida (100 PO)' },
      { name: 'Pérola (Gema 100 PO)', desc: 'Pérola branca cintilante pura (100 PO)' },
      { name: 'Turmalina (Gema 100 PO)', desc: 'Cristal verde pálido transparente (100 PO)' }
    ],
    500: [
      { name: 'Alexandrita (Gema 500 PO)', desc: 'Gema verde escuro transparente rara (500 PO)' },
      { name: 'Água-Marinha (Gema 500 PO)', desc: 'Gema azul-esverdeada cristalina (500 PO)' },
      { name: 'Pérola Negra (Gema 500 PO)', desc: 'Pérola negra pura reluzente (500 PO)' },
      { name: 'Topázio Dourado (Gema 500 PO)', desc: 'Cristal amarelo-ouro intenso (500 PO)' }
    ],
    1000: [
      { name: 'Esmeralda (Gema 1000 PO)', desc: 'Gema verde profundo brilhante (1.000 PO)' },
      { name: 'Opala de Fogo (Gema 1000 PO)', desc: 'Gema translúcida vermelho-fogo (1.000 PO)' },
      { name: 'Safira Azul (Gema 1000 PO)', desc: 'Gema azul real transparente (1.000 PO)' },
      { name: 'Rubi Estrela (Gema 1000 PO)', desc: 'Rubi translúcido com estrela branca central (1.000 PO)' }
    ]
  },
  artObjects: {
    25: [
      { name: 'Jarro de Prata Finamente Trabalhado (25 PO)', desc: 'Objeto de arte de 25 PO (Guia do Mestre, p. 134)' },
      { name: 'Estatueta Esculpida em Osso (25 PO)', desc: 'Objeto de arte de 25 PO' },
      { name: 'Bracelete de Ouro Pequeno (25 PO)', desc: 'Objeto de arte de 25 PO' },
      { name: 'Vestimenta de Veludo Bordada com Fios de Ouro (25 PO)', desc: 'Objeto de arte de 25 PO' },
      { name: 'Máscara de Veludo Negro Costurada com Prata (25 PO)', desc: 'Objeto de arte de 25 PO' },
      { name: 'Cálice de Cobre com Filigrana Prateada (25 PO)', desc: 'Objeto de arte de 25 PO' },
      { name: 'Par de Dados de Osso Gravados (25 PO)', desc: 'Objeto de arte de 25 PO' },
      { name: 'Pequeno Espelho em Moldura de Madeira Pintada (25 PO)', desc: 'Objeto de arte de 25 PO' }
    ],
    250: [
      { name: 'Anel de Ouro Cravejado de Pedras de Sangue (250 PO)', desc: 'Objeto de arte de 250 PO (Guia do Mestre, p. 135)' },
      { name: 'Estatueta Esculpida em Marfim (250 PO)', desc: 'Objeto de arte de 250 PO' },
      { name: 'Bracelete de Ouro Largo e Trabalhado (250 PO)', desc: 'Objeto de arte de 250 PO' },
      { name: 'Colar de Prata com Pingente de Pedra Preciosa (250 PO)', desc: 'Objeto de arte de 250 PO' },
      { name: 'Coroa de Bronze Antiga (250 PO)', desc: 'Objeto de arte de 250 PO' },
      { name: 'Robe de Seda com Bordados de Ouro (250 PO)', desc: 'Objeto de arte de 250 PO' },
      { name: 'Cálice de Prata Cravejado com Pedras da Lua (250 PO)', desc: 'Objeto de arte de 250 PO' }
    ],
    750: [
      { name: 'Cálice de Ouro Cravejado de Esmeraldas (750 PO)', desc: 'Objeto de arte nobre avaliado em 750 PO' },
      { name: 'Tapa-olho Fino com Olho Falso de Safira e Pedra da Lua (750 PO)', desc: 'Objeto de arte de 750 PO' },
      { name: 'Harpa de Madeira Exótica com Marfim e Zircônio (750 PO)', desc: 'Objeto de arte de 750 PO' },
      { name: 'Pequeno Ídolo de Ouro Maciço (750 PO)', desc: 'Objeto de arte de 750 PO' },
      { name: 'Pente de Ouro em Forma de Dragão com Olhos de Granada (750 PO)', desc: 'Objeto de arte de 750 PO' }
    ]
  },
  magicItems: {
    minor: [
      { name: 'Poção de Cura Menor', category: 'Poções', weight: 0.25, desc: 'Recupera 2d4 + 2 PV ao beber.' },
      { name: 'Pergaminho de Magia (1º Círculo)', category: 'Documentos & Pistas', weight: 0.05, desc: 'Contém magia de 1º círculo (CD 13, Ataque +5).' },
      { name: 'Poção de Escalada', category: 'Poções', weight: 0.25, desc: 'Deslocamento de escalada igual ao de caminhada e vantagem em Atletismo por 1h.' },
      { name: 'Manto de Muitas Modas', category: 'Itens Mágicos', weight: 0.5, desc: 'Item Mágico Comum (Xanathar). Muda estilo e cor com ação bônus.' },
      { name: 'Arma Tocada pela Lua (Espada)', category: 'Armas', weight: 1.5, desc: 'Item Mágico Comum (Xanathar). Lâmina brilha com luz plena 4,5m e conta como arma mágica.' },
      { name: 'Bolsa de Carga (Bag of Holding)', category: 'Itens Mágicos', weight: 7.5, desc: 'Espaço extradimensional comporta até 250 kg pesando apenas 7,5 kg.' }
    ],
    uncommon: [
      { name: 'Poção de Cura Maior', category: 'Poções', weight: 0.25, desc: 'Recupera 4d4 + 4 PV ao beber.' },
      { name: 'Pergaminho de Magia (2º Círculo)', category: 'Documentos & Pistas', weight: 0.05, desc: 'Contém magia de 2º círculo (CD 13, Ataque +5).' },
      { name: 'Pergaminho de Magia (3º Círculo)', category: 'Documentos & Pistas', weight: 0.05, desc: 'Contém magia de 3º círculo (CD 15, Ataque +7).' },
      { name: 'Arma +1', category: 'Armas', weight: 1.5, desc: '+1 nas jogadas de ataque e dano.' },
      { name: 'Escudo +1', category: 'Armaduras', weight: 3, desc: '+1 de bônus adicional na CA além do escudo normal.' },
      { name: 'Espada da Vingança', category: 'Armas', weight: 1.5, desc: '+1 ataque/dano (Requer Sintonização; maldição de vingança CD 15).' },
      { name: 'Manto de Proteção', category: 'Itens Mágicos', weight: 0.5, desc: '+1 na CA e em todos os testes de resistência (Sintonização).' },
      { name: 'Manto Élfico', category: 'Itens Mágicos', weight: 0.5, desc: 'Vantagem em Furtividade para se esconder e desvantagem para ser percebido.' },
      { name: 'Botas Élficas', category: 'Itens Mágicos', weight: 0.5, desc: 'Passos silenciosos; vantagem em Furtividade para mover-se em silêncio.' },
      { name: 'Manoplas de Força do Ogro', category: 'Itens Mágicos', weight: 0.5, desc: 'Define sua Força para 19 (+4) enquanto equipadas (Sintonização).' },
      { name: 'Varinha de Mísseis Mágicos', category: 'Itens Mágicos', weight: 0.5, desc: '7 cargas para conjurar Mísseis Mágicos.' }
    ],
    rare: [
      { name: 'Poção de Cura Superior', category: 'Poções', weight: 0.25, desc: 'Recupera 8d4 + 8 PV ao beber.' },
      { name: 'Arma +2', category: 'Armas', weight: 1.5, desc: '+2 nas jogadas de ataque e dano.' },
      { name: 'Armadura +1', category: 'Armaduras', weight: 10, desc: '+1 de bônus mágico na CA.' },
      { name: 'Anel de Proteção', category: 'Itens Mágicos', weight: 0.05, desc: '+1 na CA e em todos os testes de resistência (Sintonização).' },
      { name: 'Espada Língua Flamejante', category: 'Armas', weight: 1.5, desc: '+2d6 de dano de fogo extra em cada acerto (Sintonização).' },
      { name: 'Lâmina do Sol (Sun Blade)', category: 'Armas', weight: 1, desc: '+2 ataque/dano radiante com Acuidade (+1d8 vs mortos-vivos).' },
      { name: 'Amuleto de Saúde', category: 'Itens Mágicos', weight: 0.1, desc: 'Define sua Constituição para 19 (+4) enquanto equipado (Sintonização).' },
      { name: 'Capa de Deslocamento', category: 'Itens Mágicos', weight: 0.5, desc: 'Atacantes têm desvantagem nas jogadas de ataque contra você (Sintonização).' },
      { name: 'Varinha de Bolas de Fogo', category: 'Itens Mágicos', weight: 0.5, desc: '7 cargas para conjurar Bola de Fogo (8d6 fogo, CD 15).' }
    ]
  }
};
