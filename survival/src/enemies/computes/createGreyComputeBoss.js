import { closestObject } from "../../closestObject.js";
import { dealDamage } from "../../dealDamage.js";
import { doCirclesOverlap } from "../../doCirlceOverlap.js";
import { getRandomSpawnPos } from "../../getRandomSpawnPos.js";
import {
  assets,
  blankImmune,
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
import { computeBossShake } from "./computeBossShake.js";
import { createBlueCompute } from "./createBlueCompute.js";

const generateSpawnPositions = (basePos, computeRadius, gridSize) => {
  const offsets = Array.from(
    { length: gridSize },
    (_, i) => i - Math.floor(gridSize / 2)
  );
  const positions = [];

  for (let i = 0; i < offsets.length; i++) {
    for (let j = 0; j < offsets.length; j++) {
      positions.push({
        x: basePos.x + computeRadius * offsets[i] * 3,
        y: basePos.y + computeRadius * offsets[j] * 3,
      });
    }
  }

  return positions;
};

const bigCheck = (compute) => {
  const computeRadius = 80;

  for (let i = -1; i < 1; i++) {
    createGreyComputeBoss(
      compute.pos.x - computeRadius * 2 + computeRadius * 4 * i,
      compute.pos.y,
      2000,
      2,
      computeRadius,
      1.2,
      Math.random() * 2 + 1,
      computeBossDeathChecksGrey[1]
    );
  }
};

const mediumCheck = (compute) => {
  const computeRadius = 50;
  const positions = generateSpawnPositions(compute.pos, computeRadius, 2);

  positions.forEach((pos) => {
    createGreyComputeBoss(
      pos.x,
      pos.y,
      1000,
      0.5,
      computeRadius,
      2.0,
      Math.random() * 3 + 1,
      computeBossDeathChecksGrey[2]
    );
  });
};

const smallCheck = (compute) => {
  const computeRadius = 30;
  const positions = generateSpawnPositions(compute.pos, computeRadius, 3);

  positions.forEach((pos) => {
    createGreyComputeBoss(
      pos.x,
      pos.y,
      55,
      1,
      computeRadius,
      1.5,
      Math.random() * 4 + 1,
      computeBossDeathChecksGrey[3]
    );
  });
};

const verySmallCheck = (compute) => {
  const computeRadius = 15;
  const positions = generateSpawnPositions(compute.pos, computeRadius, 4);

  positions.forEach((pos) => {
    createGreyComputeBoss(
      pos.x,
      pos.y,
      4,
      0.2,
      computeRadius,
      2.5,
      Math.random() * 5 + 1,
      () => {
        if (
          !blankImmune.some(
            (item) => item.type === "compute" && item.health > 0
          )
        ) {
          bosses.push(compute);
        }
      }
    );
  });
};

const computeBossDeathChecksGrey = [
  bigCheck,
  mediumCheck,
  smallCheck,
  verySmallCheck,
];
const computeBossDeathChecks = [];

// let spawnWidth = 10,
// let spawnHeight = 10,
// let health = 4000,
// damage = 5,
// radius = 100,
// knockbackMult = 0.1,
// speed = 1,
// deathCheck = computeBossDeathChecksGrey[0],

export const createGreyComputeBoss = (
  spawnWidth = getRandomSpawnPos().x,
  spawnHeight = getRandomSpawnPos().y,
  // health = 4000,
  health = 500,
  damage = 5,
  radius = 100,
  knockbackMult = 0.1,
  speed = 1,
  deathCheck = computeBossDeathChecksGrey[0]
) => {
  const compute = {
    name: "grey",
    asset: assets.greyCompute,
    health: health,
    radius: radius * worldsizeMultiplier,
    lookDirection: 1,
    type: "compute",
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
    speed: speed * stats.curse * worldsizeMultiplier,
    knockback: {
      counter: 0,
      mult: knockbackMult,
    },
    damage: damage,
    color: "red",
    team: "enemy",
    xp: Math.random() * 10 * stats.growth,
    priority: 10,
    blankImmune: true,

    update: () => {
      const newVel = makeDirection(compute.pos, player.pos);

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
        assets.greyCompute,
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
        computeBossShake(compute, deathCheck, compute);
        // deathCheck(compute);
      }
    },
    ability: () => {},
  };

  console.log(compute);

  entities.push(compute);
  enemies.push(compute);
  updateables.push(compute);
  // bosses.push(compute);
  blankImmune.push(compute);
};
