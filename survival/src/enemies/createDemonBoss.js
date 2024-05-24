import { animation } from "../animation.js";
import { loopPerSecond } from "../basic.js";
import { closestObject } from "../closestObject.js";
import { dealDamage } from "../dealDamage.js";
import { doCirclesOverlap } from "../doCirlceOverlap.js";
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
import { createEnemyBullet } from "./shootEnemyBullet.js";

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
    slowDown: 40,
    reverse: false,
    repeat: false,
    vertical: false,
  }),
  asset: "death",
};
const demonFyingAnimation = {
  animation: animation({
    imageCount: 4,
    slowDown: 40,
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
    slowDown: 20,
    reverse: false,
    repeat: false,
    vertical: false,
  }),
  asset: "appear",
};

const shotSpread = 0.7;

export const createDemonBoss = () => {
  const chosenPos = {
    x: Math.random() * world.width,
    y: Math.random() * world.height,
  };
  let currentDemonAnimation = demonAppearAnimation;

  const demon = {
    health: 1000000,
    radius: 100 * worldsizeMultiplier,
    pos: {
      x: chosenPos,
      y: chosenPos,
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

      if ((demon.actionCounter % loopPerSecond) * 5 === 0) {
        const randomActionNumber = Math.ceil(Math.random() * 10);

        if (randomActionNumber > 3) {
          demon.pos.x = Math.random() * world.width;
          demon.pos.y = Math.random() * world.height;
        } else if (randomActionNumber > 8) {
          for (let i = 0; i < 30; i++) {
            setTimeout(() => {
              const spreadX = getRandomInRange(-shotSpread, shotSpread);
              const spreadY = getRandomInRange(-shotSpread, shotSpread);

              const finalDirection = {
                x: direction.x + spreadX,
                y: direction.y + spreadY,
              };

              createEnemyBullet(demon, finalDirection, {
                area: 10,
                speed: 10,
                damage: 10,
              });
            }, 100);
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
        if (demon.health > 0) {
          currentDemonAnimation = demonFyingAnimation;
        } else {
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
