import { doCirclesOverlap } from "../doCirlceOverlap.js";
import { blankImmune, enemies, player, worldObjects, xps } from "../main.js";
import { playWiper } from "../sounds.js";
import { stats } from "../stats.js";
import { vector } from "../vectors.js";

const wiperStats = {
  area: 0,
  speed: 0,
  damage: 0,
  finalLevel: 0,
  cooldown: 500,
  keepXpChance: 10,
  killAmount: 25,
  applyEffect: {
    fear: 0,
  },
};

export const createWiper = () => {
  const area = stats.area * wiperStats.area;
  // const speed = stats.speed + holyAreaStats.speed;
  // const damage = stats.damage + holyAreaStats.damage;

  const wiperBullet = {
    radius: 1 * area,
    // bulletHealth: 10,
    attackIntervall: wiperStats.cooldown,
    cooldown: wiperStats.cooldown,
    pos: {
      x: 0,
      y: 0,
    },
    vel: {
      x: 0,
      y: 0,
    },
    damage: 9999,
    color: "green",
    team: "player",
    priority: 1,
  };

  return wiperBullet;
};

export const wiperBody = createWiper();

export const wiper = {
  name: "wiper",
  timesTaken: 0,
  unlockRequirement: () => {},
  attackIntervall: wiperStats.cooldown,
  cooldown: wiperStats.cooldown,
  attack: () => {
    let amountOfEnemies = 0;
    playWiper();
    setTimeout(() => {
      let totalEnemyHealth = 0;
      enemies.forEach((enemy) => {
        if (
          Math.random() * 100 < wiperStats.killAmount &&
          !blankImmune.includes(enemy)
        ) {
          amountOfEnemies += 1;
          totalEnemyHealth += enemy.health;
          enemy.health = 0;

          player.xp.amount += amountOfEnemies * 12 * wiper.stats.finalLevel;
          player.gold += amountOfEnemies * 12 * wiper.stats.finalLevel;

          wiper.statistics.damage += totalEnemyHealth;
          wiper.statistics.killCount += amountOfEnemies;
        }
      });

      if (Math.random() * 100 < wiperStats.keepXpChance) xps.lenght = 0;
    }, 1500);
  },

  update: () => {
    wiper.attackIntervall = wiperStats.cooldown * stats.cooldown;
  },

  statistics: {
    kills: 0,
    damage: 0,
    timeExisted: 0,
  },

  stats: wiperStats,

  upgrades: {
    level: 0,
    statsOrder: [
      ["cooldown"],
      ["killAmount"],
      ["cooldown"],
      ["keepXpChance"],
      ["killAmount"],
      ["finalLevel"],
    ],
    amountOrder: [[-50], [25], [-100], [100], [50], [1]],
    description: [
      "Decreases the cooldown",
      "Kill",
      "Decreases the cooldown even more",
      "Xp",
      "Kill",
      "Adds special ability",
    ],
  },

  body: wiperBody,
};
