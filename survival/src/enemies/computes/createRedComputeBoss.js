import { loopPerSecond } from "../../basic.js";
import { closestObject } from "../../closestObject.js";
import { createExplosion } from "../../createExplosion.js";
import { dealDamage } from "../../dealDamage.js";
import { doCirclesOverlap } from "../../doCirlceOverlap.js";
import { getRandomSpawnPos } from "../../getRandomSpawnPos.js";
import {
  assets,
  bosses,
  canvas,
  ctx,
  enemies,
  entities,
  player,
  targetables,
  updateables,
} from "../../main.js";
import { makeDirection } from "../../makeDirection.js";
import { playHurt } from "../../sounds.js";
import { stats } from "../../stats.js";
import { cherry } from "../../weapons/cherry.js";
import { world, worldsizeMultiplier } from "../../world.js";
import { createBlueCompute } from "./createBlueCompute.js";

let explosionRadius = 0;
let activeExplosions = [];

let startTime = true;

let rotationSpeed = 1;

let rotationAngle = 0;

const redDeathExplosion = (compute) => {
  const animate = () => {
    rotationAngle += rotationSpeed;

    ctx.save();

    // ctx.translate(compute.pos.x, compute.pos.y);
    // ctx.rotate((rotationAngle * Math.PI) / 180);

    ctx.drawImage(
      assets.redCompute,
      world.width / 2 - player.pos.x - compute.radius,
      world.height / 2 - player.pos.y - compute.radius,
      compute.radius * 2,
      compute.radius * 2
    );

    ctx.beginPath();
    ctx.arc(
      world.width / 2 - player.pos.x,
      world.height / 2 - player.pos.y,
      100,
      0,
      2 * Math.PI
    );
    ctx.fillStyle = "red";
    ctx.fill();

    ctx.restore();

    // if (rotationAngle > 1 || rotationAngle < -1) rotationSpeed = -rotationSpeed;
    requestAnimationFrame(animate);
  };
  requestAnimationFrame(animate);
};

const handleRedComputeBomb = (compute) => {
  ctx.save();

  ctx.restore();
  explosionRadius++;

  // requestAnimationFrame(handleRedComputeBomb);
  createExplosion(cherry, compute.pos.x, compute.pos.x, 100, 0);
};

export const createRedComputeBoss = (
  spawnWidth = getRandomSpawnPos(player).x,
  spawnHeight = getRandomSpawnPos(player).y
) => {
  const compute = {
    health: 100,
    radius: 100 * worldsizeMultiplier,
    pos: {
      x: 100,
      y: 100,
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
        // dealDamage(player, "contact", compute.damage);
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
        assets.redCompute,
        compute.pos.x - compute.radius,
        compute.pos.y - compute.radius,
        compute.radius * 2,
        compute.radius * 2
      );

      ctx.restore();
    },
    hit: () => {
      if (compute.health <= 0) {
        // redDeathExplosion(compute);
        redDeathExplosion(compute);
        // createExplosion(
        //   cherry,
        //   compute.pos.x,
        //   compute.pos.y,
        //   500,
        //   0.5,
        //   100,
        //   assets.explosion,
        //   "enemy"
        // );
      }
    },
    ability: () => {},
  };

  entities.push(compute);
  enemies.push(compute);
  updateables.push(compute);
  bosses.push(compute);
};
