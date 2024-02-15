import { doCirclesOverlap } from "../doCirlceOverlap.js";
import { enemies, player, worldObjects } from "../main.js";
import { stats } from "../stats.js";
import { vector } from "../vectors.js";

const bulletSpeed = 20;
const cooldown = 25;

const holyAreaStats = {
  area: 0,
  speed: 0,
  damage: 0,
};

export const createHolyArea = () => {
  const area = stats.area * holyAreaStats.area;
  // const speed = stats.speed + holyAreaStats.speed;
  // const damage = stats.damage + holyAreaStats.damage;

  const holyAreaBody = {
    radius: 300 * area,
    // bulletHealth: 10,
    attackIntervall: cooldown,
    cooldown: cooldown,
    pos: {
      x: 0,
      y: 0,
    },
    vel: {
      x: 0,
      y: 0,
    },
    damage: 20,
    color: "green",
    team: "player",
    priority: 1,
    // enemiesHit: [],
  };

  return holyAreaBody;
};

export const holyAreaBody = createHolyArea();

export const holyArea = {
  name: "holyArea",
  attackIntervall: cooldown,
  cooldown: cooldown,
  // attack: () => {

  // },
  update: () => {
    holyAreaBody.pos = player.pos;
    holyAreaBody.radius = 300 * (holyAreaStats.area + stats.area);
  },

  stats: holyAreaStats,

  upgrades: {
    level: 0,
    statsOrder: [["area"], ["area"], ["area"], ["area"], ["area"], ["area"]],
    amountOrder: [[0.1], [0.1], [0.1], [0.1], [0.1], [0.1]],
  },

  body: holyAreaBody,
};
