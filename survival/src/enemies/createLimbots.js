import { loopPerSecond } from "../basic.js";
import { closestObject } from "../closestObject.js";
import { dealDamage } from "../dealDamage.js";
import { doCirclesOverlap } from "../doCirlceOverlap.js";
import { drawText } from "../draw/drawText.js";
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

export const createLimbots = (spawnWidth, spawnHeight) => {
  const limbot = {
    health: 50,
    // startRadius: 45,
    radius: 30 * worldsizeMultiplier,
    pos: {
      x: spawnWidth,
      y: spawnHeight,
    },
    vel: {
      x: 0,
      y: 0,
    },
    statusEffects: {
      courage: 100,
    },
    fearMult: 1,
    speed: 1.5 * stats.curse * worldsizeMultiplier,
    knockback: {
      counter: 0,
      mult: 1,
    },
    // speed: 0,
    damage: 10 * stats.curse,
    // damage: 0,
    color: "purple",
    team: "enemy",
    xp: Math.random() * 10 * stats.growth,
    priority: 10,

    update: () => {
      if (doCirclesOverlap(limbot, player)) {
        limbot.health = 0;
        playHurt();
        player.vel.x = 0.5;
        player.vel.y = 0.5;
        // player.health -= charger.damage / (1000 / loopPerSecond);
        dealDamage(player, "contact", limbot.damage);
      }

      const newVel = makeDirection(limbot.pos, player.pos);
      limbot.vel.x = newVel.x * limbot.speed * limbot.fearMult;
      limbot.vel.y = newVel.y * limbot.speed * limbot.fearMult;
    },
    draw: (ctx, assets, gameObject) => {
      ctx.drawImage(
        assets.limbots,
        limbot.pos.x - limbot.radius,
        limbot.pos.y - limbot.radius,
        limbot.radius * 2,
        limbot.radius * 2
      );
    },
    // hit: () => {
    //   if (Math.random() > 0.95) {
    //     limbots.health += 200;
    //   }
    // },
  };

  entities.push(limbot);
  enemies.push(limbot);
  updateables.push(limbot);
};
