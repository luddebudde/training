import { animation } from "../animation.js";
import { loopPerSecond } from "../basic.js";
import { closestObject } from "../closestObject.js";
import { dealDamage } from "../dealDamage.js";
import { doCirclesOverlap } from "../doCirlceOverlap.js";
import {
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
import { worldsizeMultiplier } from "../world.js";

const walkerAnimations = animation({
  imageCount: 9,
  slowDown: 4,
  reverse: false,
  repeat: true,
});

export const createWalker = (spawnWidth, spawnHeight) => {
  const walker = {
    health: 100,
    radius: 40 * worldsizeMultiplier,
    pos: {
      x: spawnWidth,
      y: spawnHeight,
    },
    vel: {
      x: 0,
      y: 0,
    },
    slowEffect: 0,
    speed: 2 * stats.curse * worldsizeMultiplier,

    damage: 0.3 * 0,

    color: "red",
    team: "enemy",
    xp: Math.random() * 50 * stats.growth,
    priority: 10,

    update: () => {
      const target = closestObject(targetables, walker);

      const newVel = makeDirection(walker.pos, target.pos);

      walker.vel.x = newVel.x * walker.speed;
      walker.vel.y = newVel.y * walker.speed;
      if (doCirclesOverlap(walker, player)) {
        playHurt();
        dealDamage(player, "contact", walker.damage);
      }
    },
    draw: (ctx, assets, gameObject) => {
      ctx.drawImage(
        assets.blue,
        walker.pos.x - walker.radius,
        walker.pos.y - walker.radius,
        walker.radius * 2,
        walker.radius * 2
      );
    },
  };

  entities.push(walker);
  enemies.push(walker);
  updateables.push(walker);
};
