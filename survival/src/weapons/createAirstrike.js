import { createExplosion } from "../createExplosion.js";
import { loadImage } from "../image.js";
import {
  assets,
  bullets,
  enemies,
  areaEffects,
  mousePos,
  player,
  worldObjects,
} from "../main.js";
import { makeDirection } from "../makeDirection.js";
import { playAirstrikeCall, playAirstrikeExplosion } from "../sounds.js";
import { statistics } from "../statistics.js";
import { stats, upgradeStats } from "../stats.js";
import { vector } from "../vectors.js";
import { world } from "../world.js";

const bulletSpeed = 20 * stats.speed;
// const cooldown = 25;

const airstrikeStats = {
  area: 20,
  speed: 20,
  damage: 10,
  cooldown: 600,
  // cooldown: 200,
  amount: 20,
  special: 0,
  applyEffect: {
    fear: 0,
  },
};

export const createAirstrike = () => {
  // console.log(aimBullet.area);
  const area = stats.area * airstrikeStats.area;
  const speed = stats.speed * airstrikeStats.speed;
  const damage = stats.damage * airstrikeStats.damage;
  const cooldown = stats.cooldown * airstrikeStats.cooldown;

  // console.log(mousePos);

  // console.log(direction);
  const explosion = {
    hasExpired: false,
    radius: area,
    // bulletHealth: 10,
    attackIntervall: cooldown,
    cooldown: cooldown,
    pos: {
      x: player.pos.x - world.width / 2 + Math.random() * world.width,
      y: player.pos.y - world.height / 2 + Math.random() * world.height,
    },
    vel: {
      x: 0,
      y: 0,
    },
    damage: damage,
    color: "blue",
    team: "player",
    priority: 5,

    attack: () => {
      bullets.push(explosion);
      // worldObjects.push(bullet);
    },
    enemiesHit: [],
    pierce: airstrikeStats.pierce,
  };
  createExplosion(
    airstrike,
    explosion.pos.x - explosion.radius * 4,
    explosion.pos.y - explosion.radius * 2,
    explosion.radius * 4,
    explosion.damage
  );
  //   explosions.push(explosion);
  // worldObjects.push(bullet);

  // return cooldown;
};

let attackCounter = 0;

export const airstrike = {
  name: "airstrike",
  timesTaken: 0,
  unlockRequirement: () => {
    if (statistics.overall.damage > 1000000) {
      return true;
    }
  },
  unlockRequirementText: "total 1M damage",
  // image: assets.rhino,
  //   image: await loadImage(`/public/sprites/aimBulletSprite.png`),
  // newCooldown: aimBulletStats.cooldown * stats.cooldown,
  // image: await loadImage(`public/sprites/aimBulletSprite.png`),
  attackIntervall: airstrikeStats.cooldown * stats.cooldown,
  cooldown: airstrikeStats.cooldown * stats.cooldown,
  //   attack: createAirstrike,

  update: () => {
    attackCounter += 1;

    if (attackCounter % airstrike.attackIntervall === 0) {
      playAirstrikeCall();
      setTimeout(() => {
        for (let i = 0; i < airstrikeStats.amount; i++) {
          setTimeout(() => {
            if (i % 5 === 0) {
              playAirstrikeExplosion();
            }
            createAirstrike();
          }, i * 50); // Varje iteration ökar fördröjningen med 1500 ms
        }
      }, 3000);
    }

    airstrike.attackIntervall = airstrikeStats.cooldown * stats.cooldown;
  },

  statistics: {
    kills: 0,
    damage: 0,
    timeExisted: 0,
  },

  stats: airstrikeStats,

  upgrades: {
    level: 0,
    statsOrder: [
      ["cooldown, amount"],
      ["area"],
      ["amount"],
      ["area"],
      ["amount"],
      ["special"],
    ],
    amountOrder: [[-10, 5], [20], [5], [20], [10], [1]],

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
