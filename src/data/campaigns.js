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
      gold: 0,
      items: [],
      history: []
    },
    sessions: []
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
