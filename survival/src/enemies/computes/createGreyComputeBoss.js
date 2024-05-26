import { closestObject } from "../../closestObject.js";
import { dealDamage } from "../../dealDamage.js";
import { doCirclesOverlap } from "../../doCirlceOverlap.js";
import { getRandomSpawnPos } from "../../getRandomSpawnPos.js";
import {
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
    createGreyComputeBoss({
      player: player,
      spawnWidth: compute.pos.x - computeRadius * 2 + computeRadius * 4 * i,
      spawnHeight: compute.pos.y,
      health: 2000,
      damage: 2,
      radius: computeRadius,
      knockbackMult: 1.2,
      speed: Math.random() * 2 + 1,
      deathCheck: computeBossDeathChecksGrey[1],
    });
  }
};

const mediumCheck = (compute) => {
  const computeRadius = 50;
  const positions = generateSpawnPositions(compute.pos, computeRadius, 2);

  positions.forEach((pos) => {
    createGreyComputeBoss({
      player: player,
      spawnWidth: pos.x,
      spawnHeight: pos.y,
      health: 1000,
      damage: 0.5,
      radius: computeRadius,
      knockbackMult: 2.0,
      speed: Math.random() * 3 + 1,
      deathCheck: computeBossDeathChecksGrey[2],
    });
  });
};

const smallCheck = (compute) => {
  const computeRadius = 30;
  const positions = generateSpawnPositions(compute.pos, computeRadius, 3);

  positions.forEach((pos) => {
    createGreyComputeBoss({
      player: player,
      spawnWidth: pos.x,
      spawnHeight: pos.y,
      health: 55,
      damage: 1,
      radius: computeRadius,
      knockbackMult: 1.5,
      speed: Math.random() * 4 + 1,
      deathCheck: computeBossDeathChecksGrey[3],
    });
  });
};

const verySmallCheck = (compute) => {
  const computeRadius = 15;
  const positions = generateSpawnPositions(compute.pos, computeRadius, 4);

  positions.forEach((pos) => {
    createGreyComputeBoss({
      player: player,
      spawnWidth: pos.x,
      spawnHeight: pos.y,
      health: 4,
      damage: 0.2,
      radius: computeRadius,
      knockbackMult: 2.5,
      speed: Math.random() * 5 + 1,
      deathCheck: () => {
        if (
          !blankImmune.some(
            (item) => item.type === "compute" && item.health > 0
          )
        ) {
          bosses.push(compute);
        }
      },
    });
  });
};

const computeBossDeathChecksGrey = [
  bigCheck,
  mediumCheck,
  smallCheck,
  verySmallCheck,
];
const computeBossDeathChecks = [];

let playerClone = {
  pos: {
    x: 0,
    y: 0,
  },
};

export const createGreyComputeBoss = ({
  player,
  spawnWidth = getRandomSpawnPos(player).x,
  spawnHeight = getRandomSpawnPos(player).y,
  health = 4000,
  damage = 5,
  radius = 100,
  knockbackMult = 0.1,
  speed = 1,
  deathCheck = computeBossDeathChecksGrey[0],
}) => {
  const compute = {
    health: health,
    radius: radius * worldsizeMultiplier,
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

      playerClone = player;

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
        deathCheck(compute);
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
