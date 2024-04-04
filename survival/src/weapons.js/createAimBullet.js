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
import { stats, upgradeStats } from "../stats.js";
import { vector } from "../vectors.js";
import { world } from "../world.js";

const bulletSpeed = 20 * stats.speed;
// const cooldown = 25;

const aimBulletStats = {
  area: 20,
  speed: 20,
  damage: 20,
  cooldown: 25,
  pierce: 1,
  special: 0,
};

export const createAimBullet = () => {
  // console.log(aimBullet.area);
  const area = stats.area * aimBulletStats.area;
  const speed = stats.speed * aimBulletStats.speed;
  const damage = stats.damage * aimBulletStats.damage;
  const cooldown = stats.cooldown * aimBulletStats.cooldown;

  // console.log(mousePos);

  const direction = makeDirection(
    mousePos,
    // vector.add(mousePos, realMousPos)
    {
      x: world.width / 2,
      y: world.height / 2,
    }
  );
  // console.log(direction);
  const bullet = {
    radius: area,
    // bulletHealth: 10,
    attackIntervall: cooldown,
    cooldown: cooldown,
    destroy: false,
    pos: {
      x: player.pos.x,
      y: player.pos.y,
    },
    vel: {
      x: -direction.x * speed,
      y: -direction.y * speed,
    },
    damage: damage,
    color: "blue",
    team: "player",
    priority: 5,

    attack: () => {
      bullets.push(bullet);
      // worldObjects.push(bullet);
    },
    enemiesHit: [],
    pierce: aimBulletStats.pierce,
    weapon: aimBullet,
  };
  bullets.push(bullet);
  // worldObjects.push(bullet);

  // return cooldown;
};

export const aimBullet = {
  name: "aimBullet",
  timesTaken: 0,
  // image: assets.rhino,
  image: await loadImage(`public/sprites/aimBulletSprite.png`),
  // newCooldown: aimBulletStats.cooldown * stats.cooldown,
  attackIntervall: aimBulletStats.cooldown * stats.cooldown,
  cooldown: aimBulletStats.cooldown * stats.cooldown,
  attack: createAimBullet,

  update: () => {
    aimBullet.attackIntervall = aimBulletStats.cooldown * stats.cooldown;
  },

  stats: aimBulletStats,

  statistics: {
    kills: 0,
    damage: 0,
    timeExisted: 0,
  },

  upgrades: {
    level: 0,
    statsOrder: [
      ["cooldown", "speed"],
      ["speed"],
      ["damage"],
      ["area"],
      ["speed"],
      ["special"],
    ],
    amountOrder: [[-10, 5], [1], [1], [5], [5], [1]],

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
