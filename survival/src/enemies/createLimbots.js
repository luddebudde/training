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

export const createLimbots = (spawnWidth, spawnHeight) => {
  const limbots = {
    health: 50,
    // startRadius: 45,
    radius: 30 * worldsizeMultiplier,
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
    },
    speed: 1.5 * stats.curse * worldsizeMultiplier,
    knockback: {
      counter: 0,
      mult: 1,
    },
    // speed: 0,
    damage: 10 * stats.curse,
    // damage: 0,
    color: "purple",
    team: "enemy",
    xp: Math.random() * 10 * stats.growth,
    priority: 10,

    update: () => {
      if (doCirclesOverlap(limbots, player)) {
        limbots.health = 0;
        playHurt();
        player.vel.x = 0.5;
        player.vel.y = 0.5;
        // player.health -= charger.damage / (1000 / loopPerSecond);
        dealDamage(player, "contact", limbots.damage);
      }

      const newVel = makeDirection(limbots.pos, player.pos);
      limbots.vel.x = newVel.x * limbots.speed;
      limbots.vel.y = newVel.y * limbots.speed;
    },
    draw: (ctx, assets, gameObject) => {
      ctx.drawImage(
        assets.limbots,
        limbots.pos.x - limbots.radius,
        limbots.pos.y - limbots.radius,
        limbots.radius * 2,
        limbots.radius * 2
      );
    },
    // hit: () => {
    //   if (Math.random() > 0.95) {
    //     limbots.health += 200;
    //   }
    // },
  };

  entities.push(limbots);
  enemies.push(limbots);
  updateables.push(limbots);
};
