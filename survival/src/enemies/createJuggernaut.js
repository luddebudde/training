import { loopPerSecond } from "../basic.js";
import { closestObject } from "../closestObject.js";
import { dealDamage } from "../dealDamage.js";
import { doCirclesOverlap } from "../doCirlceOverlap.js";
import { drawText } from "../draw/drawText.js";
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

export const createJuggernaut = (spawnWidth, spawnHeight) => {
  const juggernaut = {
    health: 800,
    // startRadius: 45,
    radius: 45 * worldsizeMultiplier,
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
    speed: 0.75 * stats.curse * worldsizeMultiplier,
    knockback: {
      counter: 0,
      mult: 0.05,
    },
    damage: 1 * stats.curse,
    color: "purple",
    team: "enemy",
    xp: Math.random() * 10 * stats.growth,
    priority: 10,

    update: () => {
      if (doCirclesOverlap(juggernaut, player)) {
        playHurt();
        dealDamage(player, "contact", juggernaut.damage);
      }

      const newVel = makeDirection(juggernaut.pos, player.pos);
      juggernaut.vel.x = newVel.x * juggernaut.speed * juggernaut.fearMult;
      juggernaut.vel.y = newVel.y * juggernaut.speed * juggernaut.fearMult;
    },
    hit: () => {
      if (Math.random() > 0.95) {
        juggernaut.health += 200;
      }
    },
  };

  entities.push(juggernaut);
  enemies.push(juggernaut);
  updateables.push(juggernaut);
};
