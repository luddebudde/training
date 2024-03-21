import { loopPerSecond } from "../basic.js";
import { closestObject } from "../closestObject.js";
import { dealDamage } from "../dealDamage.js";
import { doCirclesOverlap } from "../doCirlceOverlap.js";
import {
  enemies,
  entities,
  player,
  targetables,
  worldObjects,
} from "../main.js";
import { makeDirection } from "../makeDirection.js";
import { playHurt } from "../sounds.js";
import { stats } from "../stats.js";
import { vector } from "../vectors.js";
import { worldsizeMultiplier } from "../world.js";

export const createCharger = (spawnWidth, spawnHeight) => {
  const charger = {
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
    speed: 5 * stats.curse * worldsizeMultiplier,
    // speed: 0,
    // damage: 0.5,
    damage: 0,
    color: "black",
    team: "enemy",
    xp: Math.random() * 25 * stats.growth,
    priority: 10,

    update: () => {
      if (doCirclesOverlap(charger, player)) {
        // charger.health = 0;
        playHurt();
        // player.health -= charger.damage / (1000 / loopPerSecond);
        dealDamage(player, "contact", charger.damage);
      }

      // targetables.forEach((target) => {
      // const diff = {
      //   x: target.x - charger.x,
      //   y: target.y - charger.y,
      // };
      // const dist = Math.sqrt(diff.x * diff.x + diff.y * diff.y);
      // if (dist > pre)
      // });
      const target = closestObject(targetables, charger);
      // console.log(target);
      const newVel = makeDirection(charger.pos, target.pos);
      // console.log(charger.vel.x);
      charger.vel.x = newVel.x * charger.speed;
      charger.vel.y = newVel.y * charger.speed;
    },
  };

  entities.push(charger);
  enemies.push(charger);
  // worldObjects.push(charger);
};
