import { loopPerSecond } from "../basic.js";
import { closestObject } from "../closestObject.js";
import { dealDamage } from "../dealDamage.js";
import { doCirclesOverlap } from "../doCirlceOverlap.js";
import {
  enemies,
  entities,
  player,
  stealthMode,
  targetables,
  updateables,
  worldObjects,
} from "../main.js";
import { makeDirection } from "../makeDirection.js";
import { playHurt } from "../sounds.js";
import { stats } from "../stats.js";
import { vector } from "../vectors.js";
import { worldsizeMultiplier } from "../world.js";

const stealthDamage = 0.3;
const stealthSpeed = 4;

export const createStealth = (spawnWidth, spawnHeight) => {
  const stealth = {
    name: "stealth",
    health: 80,
    radius: 40 * worldsizeMultiplier,
    invincible: false,
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
      courage: 100,
    },
    fearMult: 1,
    speed: (stealthSpeed / 2) * stats.curse * worldsizeMultiplier,
    knockback: {
      counter: 0,
      mult: 1.5,
    },
    damage: stealthDamage,
    color: "black",
    team: "enemy",
    xp: Math.random() * 25 * stats.growth,
    priority: 10,

    update: () => {
      stealth.stealthCounter++;
      if (doCirclesOverlap(stealth, player)) {
        playHurt();
        dealDamage(player, "contact", stealth.damage);
        stealth.health += stealth.damage;
      }

      stealth.invincible = stealthMode;

      const target = closestObject(targetables, stealth);
      const newVel = makeDirection(stealth.pos, target.pos);
      stealth.vel.x = newVel.x * stealth.speed * stealth.fearMult;
      stealth.vel.y = newVel.y * stealth.speed * stealth.fearMult;

      if (stealth.invincible === true) {
        stealth.color = "red";
        stealth.damage = 0;
        stealth.speed = stealthSpeed;
      } else {
        stealth.color = "black";
        stealth.damage = stealthDamage;
        stealth.speed = stealthSpeed * 0.5;
      }
    },
  };

  entities.push(stealth);
  enemies.push(stealth);
  updateables.push(stealth);
};
