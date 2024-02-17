import { doCirclesOverlap } from "../doCirlceOverlap.js";
import { enemies, player, worldObjects } from "../main.js";
import { playAirstrikeCall, playLevelUpSpecial } from "../sounds.js";
import { stats } from "../stats.js";
import { vector } from "../vectors.js";

const bulletSpeed = 20;
const cooldown = 1000;

const selfImpalerStats = {
  growth: 0,
  greed: 0,

  damage: 10,
  curse: 0,
  speed: 0,
  area: 0,
};

export const createSelfImpaler = () => {
  const area = stats.area * selfImpalerStats.area;
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

let attackCounter = 0;

export const selfImpalerBody = createSelfImpaler();

export const selfImpaler = {
  name: "selfImpaler",
  attackIntervall: cooldown,
  cooldown: cooldown,
  // attack: () => {

  // },
  update: () => {
    attackCounter += 1;
    if (attackCounter % selfImpaler.attackIntervall === 0) {
      player.health -= selfImpalerStats.damage;

      // Messes with stats
      stats.growth -= selfImpalerStats.growth;
      stats.greed -= selfImpalerStats.greed;

      stats.speed -= selfImpalerStats.speed;
      stats.area -= selfImpalerStats.area;

      stats.curse += selfImpalerStats.curse;
      playAirstrikeCall();

      console.log(stats.curse);
    }
  },

  stats: selfImpalerStats,

  upgrades: {
    level: 0,
    statsOrder: [
      ["curse", "growth"],
      ["speed", "area"],
      ["curse"],
      ["damage", "movementSpeed"],
      ["speed", "area", "greed"],
      ["special"],
    ],
    amountOrder: [
      [0.05, 0.05],
      [-0.05, -0.05],
      [0.5],
      [10, 0.5],
      [0.05, 0.05, 0.1],
      [1],
    ],
    description: [
      "Decreases the growth and increases the curse for each attack",
      "Decreases speed and area",
      "Increases curse",
      "Increases damage to self",
      "Decreases the speed, area and greed",
      "Resets all upgrades",
    ],
  },

  body: selfImpalerBody,
};
