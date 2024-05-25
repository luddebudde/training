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

const bigCheck = (compute) => {
  for (let i = -1; i < 1; i++) {
    createGreyComputeBoss({
      spawnWidth: compute.pos.x - 100 + 200 * i,
      spawnHeight: compute.pos.y,
      health: 2000,
      radius: 60,
      knockbackMult: 0.8,
      speed: 2,
      deathCheck: computeBossDeathChecksGrey[1],
    });
  }
};

const computeBossDeathChecksGrey = [
  bigCheck,
  // mediumCheck,
  // smallCheck,
  // verySmallCheck,
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
    xp: Math.random() * 500 * stats.growth,
    priority: 10,

    update: () => {
      const target = closestObject(targetables, compute);
      const newVel = makeDirection(compute.pos, target.pos);

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
      deathCheck(compute);
    },
    ability: () => {},
  };

  entities.push(compute);
  enemies.push(compute);
  updateables.push(compute);
  bosses.push(compute);
};
