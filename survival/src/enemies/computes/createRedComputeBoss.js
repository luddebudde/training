import { animation } from "../../animation.js";
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
import { getDistance, makeDirection } from "../../makeDirection.js";
import { removeFromArrays } from "../../removeFromArrays.js";
import { playHurt } from "../../sounds.js";
import { stats } from "../../stats.js";
import { cherry } from "../../weapons/cherry.js";
import { world, worldsizeMultiplier } from "../../world.js";
import {
  computeBossRotationAngle,
  computeBossRotationSpeed,
  computeBossShake,
} from "./computeBossShake.js";
import { createBlueCompute } from "./createBlueCompute.js";

let explosionRadius = 0;
let activeExplosions = [];

let startTime = true;

const radiusIncrease = 2;
const explosionDuration = radiusIncrease * loopPerSecond * 5;

let explosionAnimation = animation({
  imageCount: 7,
  slowDown: 40,
  reverse: false,
  repeat: true,
});

const createDeathBomb = (entity, { rotationSpeed, rotationAngle }) => {
  const bomb = {
    pos: {
      x: entity.pos.x,
      y: entity.pos.y,
    },
    radius: 10,
    health: 1,
    update: () => {
      bomb.radius += radiusIncrease;
      rotationAngle += rotationSpeed;

      ctx.save();
      ctx.translate(world.width / 2, world.height / 2);
      ctx.translate(entity.pos.x - player.pos.x, entity.pos.y - player.pos.y);

      ctx.drawImage(
        assets.explosion,
        0,
        (assets.explosion.height / 7) * 4,
        assets.explosion.width,
        assets.explosion.height / 7,
        bomb.pos.x - bomb.radius,
        bomb.pos.y - bomb.radius,
        bomb.radius * 2,
        bomb.radius * 2
      );

      ctx.restore();

      if (bomb.radius > explosionDuration) {
        removeFromArrays(entity);
        console.log(updateables);
      } else {
      }

      if (doCirclesOverlap(player, bomb)) {
        dealDamage(player, "explosion", 0.1);
      }
    },
  };
  console.log("pushing");
  updateables.push(bomb);
};

export const createRedComputeBoss = (
  spawnWidth = getRandomSpawnPos().x,
  spawnHeight = getRandomSpawnPos().y
) => {
  const compute = {
    name: "red",
    asset: assets.redCompute,
    health: 100,
    radius: 100 * worldsizeMultiplier,
    lookDirection: 1,
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
      }
    },
    draw: (ctx, assets, gameObject) => {
      ctx.save();

      if (compute.pos.x < player.pos.x) {
        ctx.translate(compute.pos.x, compute.pos.y);
        ctx.scale(-1, 1);
        compute.lookDirection = -1;
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
        computeBossShake(compute, createDeathBomb, {
          rotationSpeed: computeBossRotationSpeed,
          rotationAngle: computeBossRotationAngle,
        });
      }
    },
    ability: () => {},
  };

  entities.push(compute);
  enemies.push(compute);
  updateables.push(compute);
  bosses.push(compute);
};
