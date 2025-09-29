import { loopPerSecond } from "../basic.js";
import { createExplosion } from "../createExplosion.js";
import { dealDamage } from "../dealDamage.js";
import { doCirclesOverlap } from "../doCirlceOverlap.js";
import { drawObject } from "../draw/drawObject.js";
import { ctx, drawingCircles, enemies, player, worldObjects } from "../main.js";

import { stats } from "../stats.js";
import { vector } from "../vectors.js";

const bulletSpeed = 20;
const cooldown = 25;

const holyAreaStats = {
  area: 150,
  speed: 0,
  damage: 0,
  effect: 5,
  special: 0,
  applyEffect: {
    fear: 0,
  },
};

export const createHolyArea = () => {
  const area = stats.area * holyAreaStats.area;

  const holyAreaBody = {
    radius: area,
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
    color: "yellow",
    team: "player",
    priority: 1,
  };

  return holyAreaBody;
};

export const holyAreaBody = createHolyArea();

export const holyArea = {
  name: "holyArea",
  timesTaken: 0,
  unlockRequirement: () => {},
  attackIntervall: cooldown,
  cooldown: cooldown,

  update: () => {
    holyAreaBody.pos = player.pos;
    holyAreaBody.radius = stats.area * holyAreaStats.area;

    // console.log(stats.area *);

    enemies.forEach((enemy) => {
      if (doCirclesOverlap(holyAreaBody, enemy)) {
        dealDamage(
          enemy,
          "divinity",
          holyAreaStats.damage / loopPerSecond,
          holyArea
        );
        enemy.slowEffect = holyAreaStats.effect / 10;

        if (holyAreaStats.special > 0 && Math.random() < 0.05 / loopPerSecond) {
          // playDivinity();
          createExplosion(
            holyArea,
            enemy.pos.x,
            enemy.pos.y,
            enemy.radius * 3,
            50
          );
        }
      }
    });

    // drawObject(ctx, holyAreaBody);
  },

  statistics: {
    kills: 0,
    damage: 0,
    timeExisted: 0,
  },

  stats: holyAreaStats,

  upgrades: {
    level: 5,
    statsOrder: [
      ["area"],
      ["area", "effect"],
      ["damage"],
      ["damage", "area"],
      ["area", "effect"],
      ["special"],
    ],
    amountOrder: [[50], [50, 1], [5], [5, 50], [50, 2], [0.1]],
  },

  body: holyAreaBody,
};
