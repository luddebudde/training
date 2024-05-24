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
import { getDistance, makeDirection } from "../makeDirection.js";
import { playHurt } from "../sounds.js";
import { stats } from "../stats.js";
import { origo, vector } from "../vectors.js";
import { minigun } from "../weapons.js/createMinigun.js";
import { worldsizeMultiplier } from "../world.js";
import { createEnemyBullet } from "./shootEnemyBullet.js";

let shootCooldown = 1000;

const shooterAttacks = {
  shotgun: {
    attackCooldown: loopPerSecond / 1,
    pellets: 5,
    area: 25,
    speed: 10,
    damage: 20,
    spreadAngle: Math.PI / 6,
  },
  minigun: {
    attackCooldown: loopPerSecond / 15,
    area: 15,
    speed: 15,
    damage: 2.5,
  },
  sniper: {
    attackCooldown: loopPerSecond,
    area: 35,
    speed: 25,
    damage: 20,
  },
};
const shotgunStats = shooterAttacks.shotgun;

const shootEnemyBullet = (shooter, direction, { area, speed, damage }) => {
  shooter.attackCounter = 0;
  createEnemyBullet(shooter, direction, {
    // area: 20,
    // speed: 10,
    // damage: 5,
    area: area,
    speed: speed,
    damage: damage,
  });
};

export const createShooterBoss = (
  spawnWidth = getRandomSpawnPos(player).x,
  spawnHeight = getRandomSpawnPos(player).y
) => {
  const shooter = {
    health: 600,
    radius: 80 * worldsizeMultiplier,
    pos: {
      x: spawnWidth,
      y: spawnHeight,
    },
    vel: {
      x: 0,
      y: 0,
    },
    attackCounter: shootCooldown,
    // attackCooldown: shootCooldown,
    statusEffects: {
      slow: 0,
    },
    speed: 2 * stats.curse * worldsizeMultiplier,
    knockback: {
      counter: 0,
      mult: 1,
    },
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
      // const target = closestObject(targetables, shooter);
      const direction = makeDirection(shooter.pos, player.pos);
      // console.log(shooter);

      const dist = getDistance(player.pos, shooter.pos);

      shooter.vel = {
        x: 0,
        y: 0,
      };
      shooter.attackCounter++;

      if (dist < 500 + player.radius + shooter.radius) {
        shooter.vel.x = -direction.x * (shooter.speed / 2);
        shooter.vel.y = -direction.y * (shooter.speed / 2);

        player.vel.x = player.vel.x;
        player.vel.y = player.vel.y;
      } else {
        shooter.vel.x = direction.x * shooter.speed;
        shooter.vel.y = direction.y * shooter.speed;
      }

      if (shooter.attackCounter >= shootCooldown) {
        if (dist > 800 + player.radius + shooter.radius) {
          const sniperStats = shooterAttacks.sniper;
          shootCooldown = sniperStats.attackCooldown;
          shootEnemyBullet(shooter, direction, {
            area: sniperStats.area,
            speed: sniperStats.speed,
            damage: sniperStats.damage,
          });
        } else if (dist > 450 + player.radius + shooter.radius) {
          const minigunStats = shooterAttacks.minigun;
          shootCooldown = minigunStats.attackCooldown;
          shootEnemyBullet(shooter, direction, {
            area: minigunStats.area,
            speed: minigunStats.speed,
            damage: minigunStats.damage,
          });
        } else if (dist < 450 + player.radius + shooter.radius) {
          shootCooldown = shotgunStats.attackCooldown;

          for (let i = 0; i < shotgunStats.pellets; i++) {
            const angleOffset =
              (i - (shotgunStats.pellets - 1) / 2) * shotgunStats.spreadAngle;
            const angle = Math.atan2(direction.y, direction.x) + angleOffset;
            const shotgunDirection = {
              x: Math.cos(angle),
              y: Math.sin(angle),
            };
            shootEnemyBullet(shooter, shotgunDirection, {
              area: shotgunStats.area,
              speed: shotgunStats.speed,
              damage: shotgunStats.damage,
            });
          }
        }
      }
    },
    ability: () => {
      // if (dist < 400 + player.radius + shooter.radius)
    },
    draw: (ctx, assets, gameObject) => {
      ctx.drawImage(
        assets.shooter,
        shooter.pos.x - shooter.radius,
        shooter.pos.y - shooter.radius,
        shooter.radius * 2,
        shooter.radius * 2
      );
    },
  };

  entities.push(shooter);
  enemies.push(shooter);
  updateables.push(shooter);
  bosses.push(shooter);
};
