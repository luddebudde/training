import { animation } from "../animation.js";
import { loopPerSecond } from "../basic.js";
import { closestObject } from "../closestObject.js";
import { dealDamage } from "../dealDamage.js";
import { doCirclesOverlap } from "../doCirlceOverlap.js";
import { getRandomSpawnPos } from "../getRandomSpawnPos.js";
import {
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
import { worldsizeMultiplier } from "../world.js";

const walkerAnimations = animation({
  imageCount: 9,
  slowDown: 4,
  reverse: false,
  repeat: true,
});

export const createWalkerBoss = (
  spawnWidth = getRandomSpawnPos().x,
  spawnHeight = getRandomSpawnPos().y
) => {
  const walker = {
    health: 1000,
    // startRadius: 100,
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
      courage: 1000000,
    },
    fearMult: 1,
    speed: 1 * stats.curse * worldsizeMultiplier,
    knockback: {
      counter: 0,
      mult: 0.5,
    },
    // speed: 0,
    damage: 5,
    // damage: 0,
    color: "red",
    team: "enemy",
    xp: Math.random() * 500 * stats.growth,
    priority: 10,

    update: () => {
      // console.log(walker.pos);
      const target = closestObject(targetables, walker);
      // console.log(target.pos);
      const newVel = makeDirection(walker.pos, target.pos);

      // const newVel = makeDirection(walker.pos, player.pos);
      // console.log(makeDirection(walker, player));
      walker.vel.x = newVel.x * walker.speed * walker.fearMult;
      walker.vel.y = newVel.y * walker.speed * walker.fearMult;
      if (doCirclesOverlap(walker, player)) {
        // walker.health = 0;
        playHurt();
        // player.health -= walker.damage / loopPerSecond;
        dealDamage(player, "contact", walker.damage);
      }
    },
    draw: (ctx, assets, gameObject) => {
      ctx.drawImage(
        assets.blue,
        walker.pos.x - walker.radius,
        walker.pos.y - walker.radius,
        // 100,
        // 100,
        walker.radius * 2,
        walker.radius * 2
      );
    },
    ability: () => {
      // const direction = makeDirection(walker.pos, player.pos);
      // player.pos.x -= direction.x * 1;
      // player.pos.y -= direction.y * 1;
    },
  };

  entities.push(walker);
  enemies.push(walker);
  updateables.push(walker);
  bosses.push(walker);
  // worldObjects.push(walker);
};
