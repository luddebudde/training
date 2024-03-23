import { loopPerSecond } from "../basic.js";
import { closestObject } from "../closestObject.js";
import { dealDamage } from "../dealDamage.js";
import { doCirclesOverlap } from "../doCirlceOverlap.js";
import {
  enemies,
  entities,
  player,
  targetables,
  worldObjects,
} from "../main.js";
import { getDistance, makeDirection } from "../makeDirection.js";
import { playHurt } from "../sounds.js";
import { stats } from "../stats.js";
import { origo, vector } from "../vectors.js";
import { worldsizeMultiplier } from "../world.js";
import { createEnemyBullet } from "./enemyShoot.js";

let lastCallTime = 0;

// function createEnemyBulletWithCooldown(shooter, direction) {
//   const currentTime = Date.now();
//   const timeSinceLastCall = currentTime - lastCallTime;

//   if (timeSinceLastCall >= 1000) {
//     // 1000 millisekunder = 1 sekund
//     createEnemyBullet(shooter, direction);
//     lastCallTime = currentTime;
//   }
// }

export const createShooter = (spawnWidth, spawnHeight) => {
  const shooter = {
    health: 60,
    radius: 40 * worldsizeMultiplier,
    pos: {
      x: spawnWidth,
      y: spawnHeight,
    },
    vel: {
      x: 0,
      y: 0,
    },
    attackCounter: 0,
    attackCooldown: loopPerSecond,
    slowEffect: 0,
    speed: 3 * stats.curse * worldsizeMultiplier,
    damage: 0,
    color: "green",
    team: "enemy",
    xp: Math.random() * 25 * stats.growth,
    priority: 10,

    update: () => {
      if (doCirclesOverlap(shooter, player)) {
        playHurt();
        dealDamage(player, "contact", shooter.damage);
      }
      const target = closestObject(targetables, shooter);
      const direction = makeDirection(shooter.pos, target.pos);

      const dist = getDistance(player.pos, shooter.pos);
      if (dist < 500 + player.radius + shooter.radius) {
        shooter.vel = {
          x: 0,
          y: 0,
        };
        shooter.attackCounter++;
        if (shooter.attackCounter >= shooter.attackCooldown) {
          shooter.attackCounter = 0;
          // createEnemyBulletWithCooldown(shooter, direction);
          createEnemyBullet(shooter, direction, {
            area: 20,
            speed: 5,
            damage: 2,
          });
        }
        if (dist < 400 + player.radius + shooter.radius) {
          shooter.vel.x = -direction.x * (shooter.speed / 2);
          shooter.vel.y = -direction.y * (shooter.speed / 2);
        }
      } else {
        shooter.vel.x = direction.x * shooter.speed;
        shooter.vel.y = direction.y * shooter.speed;
      }
    },
  };

  entities.push(shooter);
  enemies.push(shooter);
};
