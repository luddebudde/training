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
import { playHurt } from "../sounds.js";
import { stats } from "../stats.js";
import { vector } from "../vectors.js";
import { worldsizeMultiplier } from "../world.js";

export const createWisp = (spawnWidth, spawnHeight) => {
  const wispAnimation = animation({
    imageCount: 10,
    slowDown: 15,
    reverse: false,
    repeat: true,
    vertical: false,
  });

  const wisp = {
    health: 80,
    // startRadius: 40,
    radius: 80 * worldsizeMultiplier,
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
    speed: 3 * stats.curse * worldsizeMultiplier,
    knockback: {
      counter: 0,
      mult: 3,
    },
    resistance: {
      fire: 1,
    },
    // speed: 0,
    damage: 1,
    // damage: 0,
    color: "black",
    team: "enemy",
    xp: Math.random() * 25 * stats.growth,
    priority: 10,

    update: () => {
      if (doCirclesOverlap(wisp, player)) {
        playHurt();
        dealDamage(player, "contact", wisp.damage);
      }
      const target = closestObject(targetables, wisp);
      const newVel = makeDirection(wisp.pos, target.pos);
      wisp.vel.x = newVel.x * wisp.speed;
      wisp.vel.y = newVel.y * wisp.speed;
    },
    draw: (ctx, assets, gameObject) => {
      ctx.save();

      if (wisp.pos.x > player.pos.x) {
        ctx.translate(wisp.pos.x, wisp.pos.y);
        ctx.scale(-1, 1);
        ctx.translate(-wisp.pos.x, -wisp.pos.y);
      }

      wispAnimation.step();
      wispAnimation.draw(
        ctx,
        assets.wisp,
        wisp.pos.x - wisp.radius / 1.2,
        wisp.pos.y - wisp.radius / 2,
        wisp.radius * 2,
        wisp.radius
      );

      // Återställ tillståndet för canvas-kontetexten
      ctx.restore();
      const stepInfo = wispAnimation.step();

      if (stepInfo) {
        wispAnimation.hasExpired = true;
      }
    },
  };

  entities.push(wisp);
  enemies.push(wisp);
  updateables.push(wisp);
};
