import { dealDamage } from "../dealDamage.js";
import { doCirclesOverlap } from "../doCirlceOverlap.js";
import { enemies, player, worldObjects } from "../main.js";
import { playAirstrikeCall, playLevelUpSpecial, playSlice } from "../sounds.js";
import { statistics } from "../statistics.js";
import { stats } from "../stats.js";
import { vector } from "../vectors.js";

const bulletSpeed = 20;
const cooldown = 1000;

const selfImpalerStats = {
  growth: 0,
  greed: 0,

  damage: 20,
  curse: 0,
  speed: 0,
  area: 0,

  effects: 1,
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
  timesTaken: 0,
  unlockRequirement: () => {
    statistics.game.damageTaken > 1000000;
  },
  unlockRequirementText: "total 1M dmg taken",
  attackIntervall: cooldown,
  cooldown: cooldown,
  // attack: () => {

  // },
  update: () => {
    attackCounter += 1;
    if (attackCounter % selfImpaler.attackIntervall === 0) {
      const effects = selfImpalerStats.effects;

      dealDamage(
        player,
        "masochism",
        selfImpalerStats.damage * effects,
        selfImpaler
      );
      selfImpaler.statistics.damage += selfImpalerStats.damage;

      // Messes with stats
      stats.growth -= selfImpalerStats.growth * effects;
      stats.greed -= selfImpalerStats.greed * effects;

      stats.speed -= selfImpalerStats.speed * effects;
      stats.area -= selfImpalerStats.area * effects;

      stats.curse += selfImpalerStats.curse * effects;
      playSlice();

      // console.log(stats.curse);
    }
  },

  statistics: {
    kills: 0,
    damage: 0,
    timeExisted: 0,
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
      ["effects"],
    ],
    amountOrder: [
      [0.05, 0.05],
      [-0.05, -0.05],
      [0.05],
      [10, 0.5],
      [0.05, 0.05, 0.1],
      [-1],
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
