import { animation } from "../animation.js";
import { loopPerSecond } from "../basic.js";
import { closestObject } from "../closestObject.js";
import { dealDamage } from "../dealDamage.js";
import { doCirclesOverlap } from "../doCirlceOverlap.js";
import { getRandomInRange } from "../getRandomInRange.js";
import { getRandomSpawnPos } from "../getRandomSpawnPos.js";
import {
  assets,
  bosses,
  enemies,
  entities,
  player,
  targetables,
  updateables,
  worldObjects,
} from "../main.js";
import { makeDirection } from "../makeDirection.js";
import { playHurt, playMinigunOverheat } from "../sounds.js";
import { stats } from "../stats.js";
import { vector } from "../vectors.js";
import { world, worldsizeMultiplier } from "../world.js";
import { createBlueCompute } from "./computes/createBlueCompute.js";
import { createWisp } from "./createWisp.js";
import { createEnemyBullet } from "./shootEnemyBullet.js";

function generateRandomPosition(
  worldWidth,
  worldHeight,
  minDistance,
  maxDistanceFromEdge
) {
  let posX, posY;
  const margin = minDistance;

  do {
    posX =
      Math.random() * (worldWidth - 2 * maxDistanceFromEdge) -
      (worldWidth / 2 - maxDistanceFromEdge);
    posY =
      Math.random() * (worldHeight - 2 * maxDistanceFromEdge) -
      (worldHeight / 2 - maxDistanceFromEdge);
  } while (getDistance({ x: posX, y: posY }, { x: 0, y: 0 }) < margin);

  return { x: posX, y: posY };
}

function getDistance(pos1, pos2) {
  const dx = pos1.x - pos2.x;
  const dy = pos1.y - pos2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

const appearAndDeathSlowdown = 10;

let randomPosition;

const demonAttackAnimation = {
  animation: animation({
    imageCount: 8,
    slowDown: 40,
    reverse: false,
    repeat: false,
    vertical: false,
  }),
  asset: "attack",
};
const demonDeathAnimation = {
  animation: animation({
    imageCount: 7,
    slowDown: appearAndDeathSlowdown,
    reverse: false,
    repeat: false,
    vertical: false,
  }),
  asset: "death",
};
const demonFyingAnimation = {
  animation: animation({
    imageCount: 4,
    slowDown: 25,
    reverse: false,
    repeat: true,
    vertical: false,
  }),
  asset: "flying",
};
const demonIdleAnimation = {
  animation: animation({
    imageCount: 4,
    slowDown: 40,
    reverse: false,
    repeat: true,
    vertical: false,
  }),
  asset: "idle",
};
const demonAppearAnimation = {
  animation: animation({
    imageCount: 7,
    slowDown: appearAndDeathSlowdown,
    reverse: false,
    repeat: false,
    vertical: false,
  }),
  asset: "appear",
};

const shotSpread = 0.7;

export const createDemonBoss = () => {
  randomPosition = {
    x: Math.random() * world.width,
    y: Math.random() * world.height,
  };
  let currentDemonAnimation = demonAppearAnimation;

  const demon = {
    health: 2000,
    radius: 200 * worldsizeMultiplier,
    pos: {
      x: randomPosition.x,
      y: randomPosition.x,
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
      mult: 0.5,
    },
    actionCounter: 0,
    damage: 5,
    color: "red",
    team: "enemy",
    xp: Math.random() * 500 * stats.growth,
    priority: 10,

    update: () => {
      const target = closestObject(targetables, demon);

      // demon.pos.x = randomPosition.x + player.pos.x;
      // demon.pos.y = randomPosition.y + player.pos.y;

      // console.log(randomPosition);

      if (demon.actionCounter % (loopPerSecond * 2) === 0) {
        const randomActionNumber = Math.ceil(Math.random() * 10);
        console.log(randomActionNumber);

        if (randomActionNumber > 7) {
          currentDemonAnimation = demonDeathAnimation;
          currentDemonAnimation.animation.restoreCounter();
          setTimeout(() => {
            const worldWidth = world.width;
            const worldHeight = world.height;
            const minDistance = 400;
            const maxDistanceFromEdge = 100;

            randomPosition = generateRandomPosition(
              worldWidth,
              worldHeight,
              minDistance,
              maxDistanceFromEdge
            );
            demon.pos.x = randomPosition.x + player.pos.x;
            demon.pos.y = randomPosition.y + player.pos.y;

            currentDemonAnimation = demonAppearAnimation;
            currentDemonAnimation = demonAppearAnimation;
            currentDemonAnimation.animation.restoreCounter();
          }, appearAndDeathSlowdown * 14);
        } else if (randomActionNumber > 2) {
          if (Math.random() > 0.5) {
            for (let i = 0; i < 30; i++) {
              setTimeout(() => {
                const direction = makeDirection(demon.pos, player.pos);
                const spreadX = getRandomInRange(-shotSpread, shotSpread);
                const spreadY = getRandomInRange(-shotSpread, shotSpread);

                const finalDirection = {
                  x: direction.x + spreadX,
                  y: direction.y + spreadY,
                };

                createEnemyBullet(demon, finalDirection, {
                  area: 10,
                  speed: 10,
                  damage: 4,
                  asset: assets.bigFireball,
                });
              }, 100);
            }
          } else {
            const direction = makeDirection(demon.pos, player.pos);

            createEnemyBullet(demon, direction, {
              area: 30,
              speed: 15,
              damage: 30,
              asset: assets.bigFireball,
            });
          }
        } else {
          for (let i = 0; i < 40; i++) {
            const spawnPos = getRandomSpawnPos(player);
            createWisp(spawnPos.x, spawnPos.y);
          }
        }
      }

      demon.actionCounter++;
    },
    draw: (ctx, assets, gameObject) => {
      ctx.save();

      if (demon.pos.x < player.pos.x) {
        ctx.translate(demon.pos.x, demon.pos.y);
        ctx.scale(-1, 1);
        ctx.translate(-demon.pos.x, -demon.pos.y);
      }

      currentDemonAnimation.animation.step();
      currentDemonAnimation.animation.draw(
        ctx,
        assets.demon[currentDemonAnimation.asset],
        demon.pos.x - demon.radius / 1.2,
        demon.pos.y - demon.radius / 2,
        demon.radius * 2,
        demon.radius
      );

      ctx.restore();
      const stepInfo = currentDemonAnimation.animation.step();

      if (stepInfo) {
        if (demon.health > 200) {
          currentDemonAnimation = demonFyingAnimation;

          currentDemonAnimation.animation.restoreCounter();
        } else {
          currentDemonAnimation = demonDeathAnimation;
          setTimeout(() => {
            demon.health = 0;
          }, appearAndDeathSlowdown * 14);
          currentDemonAnimation.animation.hasExpired = true;
        }
      }
    },

    ability: () => {},
  };

  entities.push(demon);
  enemies.push(demon);
  updateables.push(demon);
  bosses.push(demon);
};
