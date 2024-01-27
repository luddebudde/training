import { doCirclesOverlap } from "../doCirlceOverlap.js";
import { enemies, player, worldObjects } from "../main.js";
import { playWiper } from "../sounds.js";
import { stats } from "../stats.js";
import { vector } from "../vectors.js";

// const bulletSpeed = 20;
const cooldown = 300;

const wiperStats = {
  area: 0,
  speed: 0,
  damage: 0,
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
    playWiper();
    console.log("wiperAtatck");
    // Vänta en sekund
    setTimeout(() => {
      enemies.forEach((enemy) => {
        enemy.health = 0;
      });
    }, 1500); // 1000 millisekunder motsvarar 1 sekund
  },

  update: () => {
    // wiperBody.radius += 10;
  },

  stats: wiperStats,

  upgrades: {
    level: 0,
    statsOrder: ["area", "area", "area", "area", "area", "area"],
    amountOrder: [0.1, 0.1, 0.1, 0.1, 0.1, 0.1],
  },

  body: wiperBody,
};
