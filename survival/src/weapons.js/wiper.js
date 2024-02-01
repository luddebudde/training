import { doCirclesOverlap } from "../doCirlceOverlap.js";
import { enemies, player, worldObjects, xps } from "../main.js";
import { playWiper } from "../sounds.js";
import { stats } from "../stats.js";
import { vector } from "../vectors.js";

// const bulletSpeed = 20;
const cooldown = 500;

const wiperStats = {
  area: 0,
  speed: 0,
  damage: 0,
  finalLevel: 0,

  keepXpChance: 10,
  killAmount: 25,
};

export const createWiper = () => {
  const area = stats.area * wiperStats.area;
  // const speed = stats.speed + holyAreaStats.speed;
  // const damage = stats.damage + holyAreaStats.damage;

  const wiperBullet = {
    radius: 1 * area,
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
  attackIntervall: cooldown,
  cooldown: cooldown,
  attack: () => {
    let amountOfEnemies = 0;
    playWiper();
    console.log("wiperAtatck");
    // Vänta en sekund
    setTimeout(() => {
      enemies.forEach((enemy) => {
        amountOfEnemies += 1;
        if (Math.random() * 100 < wiperStats.killAmount) {
          enemy.health = 0;
          // console.log(wiperStats.killAmount);
        }
      });
      player.xp.amount +=
        amountOfEnemies *
        12 *
        // * stats.growth
        wiper.stats.finalLevel;
      player.gold +=
        amountOfEnemies *
        12 *
        //  * stats.greed
        wiper.stats.finalLevel;
      // amountOfEnemies = 0
      console.log(wiperStats);
      if (Math.random() * 100 < wiperStats.keepXpChance) xps.lenght = 0;
    }, 1500);
  },

  update: () => {
    // wiperBody.radius += 10;
  },

  stats: wiperStats,

  upgrades: {
    level: 0,
    statsOrder: [
      "cooldown",
      "killAmount",
      "cooldown",
      "keepXpChance",
      "killAmount",
      "finalLevel",
    ],
    amountOrder: [-50, 25, -100, 100, 50, 1],
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
