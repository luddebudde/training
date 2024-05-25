import { animation } from "../../animation.js";
import { loopPerSecond } from "../../basic.js";
import { closestObject } from "../../closestObject.js";
import { dealDamage } from "../../dealDamage.js";
import { doCirclesOverlap } from "../../doCirlceOverlap.js";
import {
  enemies,
  entities,
  player,
  targetables,
  updateables,
  worldObjects,
} from "../../main.js";
import { makeDirection } from "../../makeDirection.js";
import { playHurt } from "../../sounds.js";
import { stats } from "../../stats.js";
import { vector } from "../../vectors.js";
import { worldsizeMultiplier } from "../../world.js";

export const createBlueCompute = (spawnWidth, spawnHeight) => {
  const compute = {
    health: 10,
    // startRadius: 40,
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
    speed: 5 * stats.curse * worldsizeMultiplier,
    knockback: {
      counter: 0,
      mult: 0.5,
    },
    resistance: {
      fire: 1,
    },
    // speed: 0,
    damage: 0.5,
    // damage: 0,
    color: "black",
    team: "enemy",
    xp: Math.random() * 2 * stats.growth,
    priority: 10,

    update: () => {
      if (doCirclesOverlap(compute, player)) {
        playHurt();
        dealDamage(player, "contact", compute.damage);
        compute.health = 0;
      }
      const target = closestObject(targetables, compute);
      const newVel = makeDirection(compute.pos, target.pos);
      compute.vel.x = newVel.x * compute.speed;
      compute.vel.y = newVel.y * compute.speed;
    },
    draw: (ctx, assets, gameObject) => {
      ctx.save();

      if (compute.pos.x < player.pos.x) {
        ctx.translate(compute.pos.x, compute.pos.y);
        ctx.scale(-1, 1);
        ctx.translate(-compute.pos.x, -compute.pos.y);
      }

      ctx.drawImage(
        assets.blueCompute,
        compute.pos.x - compute.radius,
        compute.pos.y - compute.radius,
        compute.radius * 2,
        compute.radius * 2
      );
      ctx.restore();
    },
  };

  entities.push(compute);
  enemies.push(compute);
  updateables.push(compute);
};
