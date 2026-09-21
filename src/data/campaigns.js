// src/data/campaigns.js - Dados oficiais de Campanhas, Diários e Inventário Compartilhado

const INITIAL_CAMPAIGNS = [
  {
    id: "camp_1",
    name: "A Mina Perdida de Phandelver",
    desc: "Aventuras nas fronteiras selvagens de Faerûn, explorando as ruínas da antiga Mina do Pacto de Phandelver e enfrentando a conspiração do Aranha Negra.",
    createdDate: "2026-03-01",
    status: "active", // active, paused, finished
    playerIds: [
      "p_1788965925056",
      "p_1788966076171",
      "p_1788966196301",
      "p_1789144892638",
      "p_1789395282873",
      "p_1789398594305"
    ],
    partyStash: {
      gold: 320,
      items: [
        { id: "it_1", name: "Poção de Cura Maior (4d4+4)", qty: 2, category: "Poções", carrier: "Baú do Grupo", desc: "Recupera 4d4+4 PV ao ser ingerida." },
        { id: "it_2", name: "Corda de Cânhamo (15m)", qty: 3, category: "Equipamento de Aventura", carrier: "Mochila Coletiva", desc: "Corda resistente com 15 metros." },
        { id: "it_3", name: "Tochas", qty: 8, category: "Equipamento de Aventura", carrier: "Baú do Grupo", desc: "Ilumina raio de 6m por 1 hora." },
        { id: "it_4", name: "Varinha de Mísseis Mágicos", qty: 1, category: "Itens Mágicos", carrier: "Baú do Grupo", desc: "Possui 7 cargas. Permite lançar Mísseis Mágicos sem gastar espaço." },
        { id: "it_5", name: "Mapa Antigo de Wave Echo Cave", qty: 1, category: "Documentos & Pistas", carrier: "Baú do Grupo", desc: "Pergaminho em élfico arcaico mostrando as passagens subterrâneas." }
      ],
      history: [
        { date: "2026-03-05", text: "+200 PO recompensa resgate de Gundren Rockseeker", type: "gold_in" },
        { date: "2026-03-08", text: "+120 PO tesouro encontrado no Esconderijo dos Redbrands", type: "gold_in" },
        { date: "2026-03-08", text: "+2x Poção de Cura Maior encontradas no laboratório", type: "item_in" }
      ]
    },
    sessions: [
      {
        id: "sess_1",
        number: 1,
        date: "2026-03-01",
        title: "Emboscada na Trilha Triboar",
        xpAwarded: 150,
        notes: "Os aventureiros foram contratados por Gundren Rockseeker para escoltar uma carroça de suprimentos até Phandalin. No caminho, encontraram dois cavalos mortos e foram emboscados por 4 goblins. Após derrotá-los, seguiram o rastro dos captores até a Caverna dos Cragmaw.",
        keyNpcs: "Gundren Rockseeker, Sildar Hallwinter",
        location: "Trilha Triboar & Esconderijo Cragmaw"
      },
      {
        id: "sess_2",
        number: 2,
        date: "2026-03-08",
        title: "Chegada a Phandalin & O Confronto com os Redbrands",
        xpAwarded: 200,
        notes: "O grupo chegou à vila de Phandalin e descobriu que uma gangue de rufiões chamada Redbrands estava aterrorizando os moradores. Os heróis invadiram a Mansão Tresendar, enfrentaram os bandidos e descobriram que o líder deles, Glasstaff, fugiu por uma passagem secreta.",
        keyNpcs: "Iarno Albrek (Glasstaff), Harbin Wester (Prefeito), Toblen Stonehill",
        location: "Vila de Phandalin & Mansão Tresendar"
      }
    ]
  },
  {
    id: "camp_1789657775554",
    name: "Mesa Qui-Sex",
    desc: "Campanha Quinta e Sexta com o grupo secundário.",
    createdDate: "2026-09-17",
    status: "active",
    playerIds: [
      "p_1789139150496",
      "p_1789139310556",
      "p_1789143431458"
    ],
    partyStash: {
      gold: 0,
      items: [],
      history: []
    },
    sessions: []
  }
];
