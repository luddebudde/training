import { applyKnockback } from "../applyKnockback.js";
import { closestObject } from "../closestObject.js";
import { createExplosion } from "../createExplosion.js";
import { createSplatter } from "../createOilSplater.js";
import { dealDamage } from "../dealDamage.js";
import { loadImage } from "../image.js";
import {
  assets,
  bullets,
  chests,
  ctx,
  enemies,
  entities,
  mousePos,
  player,
  targetables,
  worldObjects,
} from "../main.js";
import { getDistance, makeDirection } from "../makeDirection.js";
import { stats, upgradeStats } from "../stats.js";
import { vector } from "../vectors.js";
import { world } from "../world.js";

const bulletSpeed = 20 * stats.speed;
// const cooldown = 25;

const pusherStats = {
  speed: 20,
  damage: 0,
  cooldown: 50,
  pierce: 1,
  duration: 0.1,
  knockback: 0.5,
  special: 1,
  applyEffect: {
    fear: 0,
  },
};

const pusherAnimation = {
  imageCount: 7,
  slowDown: 13,
  reverse: false,
  repeat: false,
  vertical: false,
};

export const createPush = () => {
  const speed = stats.speed * pusherStats.speed;
  const damage = stats.damage * pusherStats.damage;
  const cooldown = stats.cooldown * pusherStats.cooldown;

  //   const closest

  const target = closestObject(enemies, player);
  // const targetPos = target.pos; // Hämta pos från det slumpmässigt valda fiendeelementet

  // console.log(closestObject(targetables, player));

  // const targetIndex = Math.floor(Math.random() * enemies.length);
  // const target = enemies[targetIndex];
  // const targetPos = target.pos; // Hämta pos från det slumpmässigt valda fiendeelementet

  // console.log(target, enemies);

  dealDamage(target, "contact", damage);

  if (pusherStats.special > 0) {
    const force =
      (pusherStats.knockback * 500) / getDistance(player.pos, target.pos);
    console.log(force);

    applyKnockback(
      target,
      pusherStats.duration * (force / 10),
      pusherStats.knockback + force
    );
  } else {
    applyKnockback(target, pusherStats.duration, pusherStats.knockback);
  }
};

export const pusher = {
  name: "pusher",
  timesTaken: 0,
  unlockRequirement: () => {},
  // image: assets.rhino,
  image: await loadImage(`public/sprites/aimBulletSprite.png`),
  // newCooldown: aimBulletStats.cooldown * stats.cooldown,
  attackIntervall: pusherStats.cooldown * stats.cooldown,
  cooldown: pusherStats.cooldown * stats.cooldown,
  attack: createPush,

  update: () => {
    pusher.attackIntervall = pusherStats.cooldown * stats.cooldown;
  },

  stats: pusherStats,

  statistics: {
    kills: 0,
    damage: 0,
    timeExisted: 0,
  },

  upgrades: {
    level: 0,
    statsOrder: [
      // 1
      ["cooldown"],
      // 2
      ["knockback"],
      // 3
      ["cooldown"],
      // 4
      ["knockback, duration"],
      // 5
      ["cooldown, damage"],
      // 6
      ["knockback, duration"],
      // 7
      ["cooldown, damage"],
      // 8
      ["special"],
    ],
    amountOrder: [
      // 1
      [-5],
      // 2
      [0.3],
      // 3
      [-10],
      // 3
      [0.5, 0.05],
      // 4
      [-15, 20],
      // 5
      [1, 0.05],
      // 7
      [-15, 20],
      // 8
      [1],
    ],

    description: [
      "Decreases the cooldown between each shot",
      "Increases the speed",
      "Increases the damage",
      "Increases the area",
      "Increases the speed even further",
      "Adds special ability",
    ],
  },
};
