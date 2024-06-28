import { animation } from "../animation.js";
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
import { removeFromArrays } from "../removeFromArrays.js";
import { drawImageBetweenPoints } from "../rotateDrawingObject.js";
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
  pierce: 3,
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
const struckEnemies = [];
let nonStruckEnemies = [];

const lightningArrays = [lightningStrikes, struckEnemies, nonStruckEnemies];

export const createLightningStrike = () => {
  const area = stats.area * lightningStats.area;
  const speed = stats.speed * lightningStats.speed;
  const damage = stats.damage * lightningStats.damage;
  const cooldown = stats.cooldown * lightningStats.cooldown;

  const targetIndex = Math.floor(Math.random() * enemies.length);
  const target = enemies[targetIndex];
  const targetPos = target.pos;

  dealDamage(target, "electric", damage);

  const lightningAnimation = animation({
    imageCount: 8,
    slowDown: 30,
    reverse: false,
    repeat: false,
    vertical: false,
  });

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
    animation: lightningAnimation,
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

  // createSplatter(
  //   lightningStriker,
  //   targetPos.x + target.radius / 2,
  //   targetPos.y,
  //   target.radius * 2,
  //   damage,
  //   () => {},
  //   stunnerAnimation,
  //   20,
  //   assets.slice,
  //   false
  // );
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
    // Exempel på användning
    // const point1 = { x: 0, y: 500 };
    // const point2 = { x: world.width / 2, y: world.height / 2 };
    // const imageWidth = 100; // Bredden på bilden

    // drawImageBetweenPoints(ctx, assets.lightning, point1, point2, imageWidth, {
    //   imageCountX: 8,
    // });

    lightningStriker.attackIntervall = lightningStats.cooldown * stats.cooldown;

    lightningStrikes.forEach((strike) => {
      if (strike.attackCounter % (loopPerSecond * 0.5) === 0) {
        if (nonStruckEnemies.length === 0) {
          nonStruckEnemies = enemies;
        }

        const nextTarget = closestObject(nonStruckEnemies, strike);

        strike.pos = nextTarget.pos;
        strike.enemiesHit.push(nextTarget);

        struckEnemies.push(nextTarget);
        nonStruckEnemies = enemies.filter(
          (enemy) => !struckEnemies.includes(enemy)
        );

        createSplatter(
          lightningStriker,
          strike.pos.x + strike.radius / 2,
          strike.pos.y,
          50,
          lightningStats.damage * stats.damage + 100,
          () => {},
          stunnerAnimation,
          20,
          assets.slice,
          false
        );

        nextTarget.speed = 0;

        if (strike.enemiesHit.length > lightningStats.pierce) {
          removeFromArrays(strike, lightningArrays);
        }
      }

      // ctx.save();

      // if (strike.pos.x > player.pos.x) {
      //   ctx.translate(strike.pos.x, strike.pos.y);
      //   ctx.scale(-1, 1);
      //   ctx.translate(-strike.pos.x, -strike.pos.y);
      // }

      // const startPoint = { x: strike.pos.x, y: strike.pos.y };
      // const endPoint = { x: player.pos.x, y: player.pos.y };
      // const rectWidth = 10;

      // const Math.sqrt(vector.eachOther.dot(startPoint, endPoint));

      // strike.animation.step();
      // strike.animation.draw(
      //   ctx,
      //   assets.lightning,
      //   strike.pos.x - wisp.radius / 1.2,
      //   strike.pos.y - wisp.radius / 2,
      //   strike.radius * 2,
      //   strike.radius
      // );

      // ctx.restore();

      // const stepInfo = strike.animation.step();

      // if (stepInfo) {
      //   strike.animation.hasExpired = true;
      // }

      // // Exempel på användning
      // const point1 = { x: strike.pos.x, y: strike.pos.y };
      // const point2 = { x: player.pos.x, y: player.pos.y };
      // const imageWidth = 10; // Bredden på bilden

      // drawImageBetweenPoints(ctx, assets.lightning, point1, point2, imageWidth);

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
