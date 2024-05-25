import { closestObject } from "../../closestObject.js";
import { dealDamage } from "../../dealDamage.js";
import { doCirclesOverlap } from "../../doCirlceOverlap.js";
import { getRandomSpawnPos } from "../../getRandomSpawnPos.js";
import {
  bosses,
  enemies,
  entities,
  player,
  targetables,
  updateables,
  worldObjects,
} from "../../main.js";
import { makeDirection } from "../../makeDirection.js";
import { playHurt, playMinigunOverheat } from "../../sounds.js";
import { stats } from "../../stats.js";
import { vector } from "../../vectors.js";
import { worldsizeMultiplier } from "../../world.js";
import { createBlueCompute } from "./createBlueCompute.js";

// const walkerAnimations = animation({
//   imageCount: 9,
//   slowDown: 4,
//   reverse: false,
//   repeat: true,
// });

export const createBlueComputeBoss = (
  spawnWidth = getRandomSpawnPos(player).x,
  spawnHeight = getRandomSpawnPos(player).y
) => {
  const compute = {
    health: 1000,
    radius: 100 * worldsizeMultiplier,
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
    speed: 1 * stats.curse * worldsizeMultiplier,
    knockback: {
      counter: 0,
      mult: 0.1,
    },
    damage: 5,
    color: "red",
    team: "enemy",
    xp: Math.random() * 500 * stats.growth,
    priority: 10,

    update: () => {
      const target = closestObject(targetables, compute);
      const newVel = makeDirection(compute.pos, target.pos);

      compute.vel.x = newVel.x * compute.speed;
      compute.vel.y = newVel.y * compute.speed;
      if (doCirclesOverlap(compute, player)) {
        playHurt();
        dealDamage(player, "contact", compute.damage);
      }
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
    hit: () => {
      console.log(compute.health);
      if (compute.health <= 0) {
        console.log("compute dead");
        for (let i = 0; i < 2000; i++) {
          setTimeout(() => {
            console.log("spawningCompute");
            const spawnPos = getRandomSpawnPos(player);
            createBlueCompute(spawnPos.x, spawnPos.y);
          }, 10 * i);
        }
      }
    },
    ability: () => {},
  };

  entities.push(compute);
  enemies.push(compute);
  updateables.push(compute);
  bosses.push(compute);
};
