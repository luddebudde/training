import { createExplosion } from "../createExplosion.js";
import { createSplatter } from "../createOilSplater.js";
import { dealDamage } from "../dealDamage.js";
import { loadImage } from "../image.js";
import {
  assets,
  bullets,
  ctx,
  enemies,
  mousePos,
  player,
  worldObjects,
} from "../main.js";
import { makeDirection } from "../makeDirection.js";
import { stats, upgradeStats } from "../stats.js";
import { vector } from "../vectors.js";
import { world } from "../world.js";

const bulletSpeed = 20 * stats.speed;
// const cooldown = 25;

const stunnerStats = {
  area: 20,
  speed: 20,
  damage: 0,
  duration: 0.5,
  cooldown: 50,
  pierce: 1,
  special: 0,
  applyEffect: {
    fear: 0,
  },
};

const stunnerAnimation = {
  imageCount: 7,
  slowDown: 13,
  reverse: false,
  repeat: false,
  vertical: false,
};

export const createSlash = () => {
  // console.log(aimBullet.area);
  const area = stats.area * stunnerStats.area;
  const speed = stats.speed * stunnerStats.speed;
  const damage = stats.damage * stunnerStats.damage;
  const cooldown = stats.cooldown * stunnerStats.cooldown;

  const targetIndex = Math.floor(Math.random() * enemies.length);
  const target = enemies[targetIndex];
  const targetPos = target.pos; // Hämta pos från det slumpmässigt valda fiendeelementet

  dealDamage(target, "contact", damage);
  if (target.health < 0 && stunnerStats.special > 0) {
    createExplosion(stunner, targetPos.x, targetPos.y, target.radius * 2.5, 10);
  }
  target.statusEffects.slow = 1;

  setTimeout(() => {
    target.statusEffects.slow = 0;
  }, stunnerStats.duration * 1000);

  createSplatter(
    stunner,
    targetPos.x + target.radius / 2,
    targetPos.y,
    target.radius * 2,
    damage,
    () => {},
    stunnerAnimation,
    20,
    assets.slice,
    false
  );
};

export const stunner = {
  name: "stunner",
  timesTaken: 0,
  unlockRequirement: () => {},
  // image: assets.rhino,
  image: await loadImage(`public/sprites/aimBulletSprite.png`),
  // newCooldown: aimBulletStats.cooldown * stats.cooldown,
  attackIntervall: stunnerStats.cooldown * stats.cooldown,
  cooldown: stunnerStats.cooldown * stats.cooldown,
  attack: createSlash,

  update: () => {
    stunner.attackIntervall = stunnerStats.cooldown * stats.cooldown;
  },

  stats: stunnerStats,

  statistics: {
    kills: 0,
    damage: 0,
    timeExisted: 0,
  },

  upgrades: {
    level: 0,
    statsOrder: [
      ["cooldown"],
      ["duration"],
      ["duration"],
      ["cooldown"],
      ["cooldown", "duration"],
      ["special"],
    ],
    amountOrder: [[-10], [0.25], [0.25], [-10], [-20, 0.5], [1]],

    description: [
      "Decreases cooldown",
      "Increasement of stun duration",
      "Increasement of stun duration even more",
      "Decreases the cooldown",
      "Decrease in cooldown and increases stun duration",
      "Adds special ability",
    ],
  },
};
