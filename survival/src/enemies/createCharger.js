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
    statusEffects: {
      slow: 0,
      courage: 10,
    },
    fearMult: 1,
    speed: 5 * stats.curse * worldsizeMultiplier,
    knockback: {
      counter: 0,
      mult: 1,
    },
    // speed: 0,
    damage: 0.5,
    // damage: 0,
    color: "black",
    team: "enemy",
    xp: Math.random() * 25 * stats.growth,
    priority: 10,

    update: () => {
      if (doCirclesOverlap(charger, player)) {
        playHurt();
        dealDamage(player, "contact", charger.damage);
      }

      const fearMult = -charger.statusEffects.fear + 1;

      const target = closestObject(targetables, charger);
      const newVel = makeDirection(charger.pos, target.pos);
      charger.vel.x = newVel.x * charger.speed * charger.fearMult;
      charger.vel.y = newVel.y * charger.speed * charger.fearMult;
    },
  };

  entities.push(charger);
  enemies.push(charger);
  updateables.push(charger);
};
