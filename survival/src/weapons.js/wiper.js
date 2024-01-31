import { doCirclesOverlap } from "../doCirlceOverlap.js";
import { enemies, player, worldObjects } from "../main.js";
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
        enemy.health = 0;
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
      console.log(player.xp.amount);
    }, 1500); // 1000 millisekunder motsvarar 1 sekund
    // player.xp.amount +=
    //   amountOfEnemies * 25 * stats.growth * wiper.stats.finalLevel;
    // player.gold += amountOfEnemies * 25 * stats.greed * wiper.stats.finalLevel;
    // // amountOfEnemies = 0
    // console.log(amountOfEnemies);
  },

  update: () => {
    // wiperBody.radius += 10;
  },

  stats: wiperStats,

  upgrades: {
    level: 5,
    statsOrder: [
      "cooldown",
      "cooldown",
      "cooldown",
      "damage",
      "damage",
      "finalLevel",
    ],
    amountOrder: [50, 50, 100, 0, 0, 1],
  },

  body: wiperBody,
};
