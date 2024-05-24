import {
  getRandomAngle,
  getRandomDistance,
  randomDirection,
} from "../getRandomMeasurements.js";
import { loadImage } from "../image.js";
import {
  assets,
  bullets,
  enemies,
  mousePos,
  player,
  worldObjects,
} from "../main.js";
import { makeDirection } from "../makeDirection.js";
import { stats } from "../stats.js";

const bulletSpeed = 20 * stats.speed;
// const cooldown = 25;

const randomAimBulletStats = {
  area: 20,
  speed: 20,
  damage: 20,
  cooldown: 12,
  pierce: 0,
  special: 0,
  knockback: 1,
};

export const createRandomAimBullet = () => {
  // console.log(aimBullet.area);
  const area = stats.area * randomAimBulletStats.area;
  const speed = stats.speed * randomAimBulletStats.speed;
  const damage = stats.damage * randomAimBulletStats.damage;
  const cooldown = stats.cooldown * randomAimBulletStats.cooldown;

  // if (randomAimBulletStats.special === 0) {

  const direction = randomDirection(player, area);

  const bullet = {
    radius: area,
    attackIntervall: cooldown,
    cooldown: cooldown,
    destroy: false,
    pos: {
      x: player.pos.x,
      y: player.pos.y,
    },
    vel: {
      x: direction.x * speed,
      y: direction.y * speed,
    },
    damage: damage,
    knockback: randomAimBulletStats.knockback,
    color: "green",
    team: "player",
    priority: 5,
    enemiesHit: [],
    pierce: randomAimBulletStats.pierce,
    weapon: randomAimBullet,
  };
  bullets.push(bullet);
};

export const randomAimBullet = {
  name: "spreader",
  timesTaken: 0,
  unlockRequirement: () => {},
  image: await loadImage(`public/sprites/aimBulletSprite.png`),
  attackIntervall: randomAimBulletStats.cooldown * stats.cooldown,
  cooldown: randomAimBulletStats.cooldown * stats.cooldown,
  attack: createRandomAimBullet,

  update: () => {
    randomAimBullet.attackIntervall =
      randomAimBulletStats.cooldown * stats.cooldown;
  },

  statistics: {
    kills: 0,
    damage: 0,
    timeExisted: 0,
  },

  stats: randomAimBulletStats,

  upgrades: {
    level: 5,
    statsOrder: [
      ["cooldown"],
      ["speed"],
      ["damage"],
      ["area"],
      ["speed"],
      ["special"],
    ],
    amountOrder: [[-6], [1], [1], [5], [5], [1]],
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
