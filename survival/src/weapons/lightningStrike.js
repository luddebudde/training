import { loopPerSecond } from "../basic.js";
import { closestObject } from "../closestObject.js";
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

const lightningStats = {
  area: 20,
  speed: 20,
  damage: 0,
  duration: 0.5,
  cooldown: 300,
  pierce: 10,
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

const lightningStrikes = [];

export const createLightningStrike = () => {
  const area = stats.area * lightningStats.area;
  const speed = stats.speed * lightningStats.speed;
  const damage = stats.damage * lightningStats.damage;
  const cooldown = stats.cooldown * lightningStats.cooldown;

  const targetIndex = Math.floor(Math.random() * enemies.length);
  const target = enemies[targetIndex];
  const targetPos = target.pos;

  dealDamage(target, "electric", damage);

  const strike = {
    radius: area,
    destroy: false,
    pos: {
      x: targetPos.x,
      y: targetPos.y,
    },
    vel: {
      x: 0,
      y: 0,
    },
    currentTarget: target,
    attackCounter: 0,
    damage: damage,
    knockback: lightningStats.knockback,
    color: "blue",
    team: "player",
    priority: 5,

    enemiesHit: [target],
    pierce: lightningStats.pierce,
    weapon: lightningStriker,
  };
  lightningStrikes.push(strike);

  //   target.statusEffects.slow = 1;

  //   setTimeout(() => {
  //     target.statusEffects.slow = 0;
  //   }, lightningStats.duration * 1000);

  createSplatter(
    lightningStriker,
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

export const lightningStriker = {
  name: "lightningStriker",
  timesTaken: 0,
  unlockRequirement: () => {},
  image: await loadImage(`public/sprites/aimBulletSprite.png`),
  attackIntervall: lightningStats.cooldown * stats.cooldown,
  cooldown: lightningStats.cooldown * stats.cooldown,
  attack: createLightningStrike,

  update: () => {
    lightningStriker.attackIntervall = lightningStats.cooldown * stats.cooldown;

    lightningStrikes.forEach((strike) => {
      if ((strike.attackCounter % loopPerSecond) / 3) {
        const nextTarget = closestObject(enemies, strike, strike.currentTarget);

        strike.pos = nextTarget.pos;
        strike.enemiesHit.push(nextTarget);

        // console.log(strike);

        createSplatter(
          lightningStriker,
          strike.x + strike.radius / 2,
          strike.y,
          50,
          lightningStats.damage * stats.damage + 100,
          () => {},
          stunnerAnimation,
          20,
          assets.slice,
          false
        );

        const strikea = {
          radius: 20,
          destroy: false,
          pos: {
            x: nextTarget.pos.x,
            y: nextTarget.pos.y,
          },
          vel: {
            x: 0,
            y: 0,
          },
          attackCounter: 0,
          damage: 0,
          knockback: 0,
          color: "blue",
          team: "player",
          priority: 5,

          enemiesHit: [],
          pierce: lightningStats.pierce,
          weapon: lightningStriker,
        };
        bullets.push(strikea);
      }

      strike.attackCounter++;
    });
  },

  stats: lightningStats,

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
