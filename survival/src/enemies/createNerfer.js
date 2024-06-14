import { loopPerSecond } from "../basic.js";
import { closestObject } from "../closestObject.js";
import { dealDamage } from "../dealDamage.js";
import { doCirclesOverlap } from "../doCirlceOverlap.js";
import {
  enemies,
  entities,
  player,
  targetables,
  updateables,
  worldObjects,
} from "../main.js";
import { makeDirection } from "../makeDirection.js";
import { playHurt } from "../sounds.js";
import { stats } from "../stats.js";
import { vector } from "../vectors.js";
import { worldsizeMultiplier } from "../world.js";

let enemyType;
let nerfamount;
let enemyColor;

export const createNerfer = (spawnWidth, spawnHeight) => {
  const randomNumber = Math.floor(Math.random() * 3);

  if (randomNumber === 0) {
    enemyType = "maxHealth";
    nerfamount = 5;
    enemyColor = "red";
  } else if (randomNumber === 1) {
    enemyType = "area";
    nerfamount = 0.05;
    enemyColor = "yellow";
  } else if (randomNumber === 2) {
    enemyType = "speed";
    nerfamount = 0.05;
    enemyColor = "green";
  }

  const nerfer = {
    health: 10,
    // startRadius: 40,
    radius: 40 * worldsizeMultiplier,
    pos: {
      x: spawnWidth,
      y: spawnHeight,
    },
    vel: {
      x: 0,
      y: 0,
    },
    nerfType: enemyType,
    nerfamount: nerfamount,
    statusEffects: {
      slow: 0,
      courage: 10,
    },
    fearMult: 1,
    speed: 4 * stats.curse * worldsizeMultiplier,
    knockback: {
      counter: 0,
      mult: 1,
    },
    // speed: 0,
    damage: 0.5,
    // damage: 0,
    color: enemyColor,
    team: "enemy",
    xp: Math.random() * 35 * stats.growth,
    priority: 10,

    update: () => {
      if (doCirclesOverlap(nerfer, player)) {
        if (nerfer.nerfType === "maxHealth" && player.maxHealth > 20) {
          const newMaxHealth = player.maxHealth - nerfer.nerfamount;
          // stats[nerfer.nerfType] -= nerfer.nerfamount;
          if (newMaxHealth > 20) {
            player.maxHealth = newMaxHealth;
            console.log(player.maxHealth);
          }
        } else if (stats[nerfer.nerfType] > 0.5) {
          stats[nerfer.nerfType] -= nerfer.nerfamount;
        }

        nerfer.health = 0;
      }

      // targetables.forEach((target) => {
      // const diff = {
      //   x: target.x - charger.x,
      //   y: target.y - charger.y,
      // };
      // const dist = Math.sqrt(diff.x * diff.x + diff.y * diff.y);
      // if (dist > pre)
      // });
      const target = closestObject(targetables, nerfer);
      // console.log(target);
      const newVel = makeDirection(nerfer.pos, target.pos);
      // console.log(charger.vel.x);
      nerfer.vel.x = newVel.x * nerfer.speed * nerfer.fearMult;
      nerfer.vel.y = newVel.y * nerfer.speed * nerfer.fearMult;
    },
  };

  entities.push(nerfer);
  enemies.push(nerfer);
  updateables.push(nerfer);
  // worldObjects.push(charger);
};
