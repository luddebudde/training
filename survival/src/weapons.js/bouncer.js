import { loopPerSecond } from "../basic.js";
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
import { stats, upgradeStats } from "../stats.js";
import { vector } from "../vectors.js";
import { world } from "../world.js";

const bulletSpeed = 20 * stats.speed;
// const cooldown = 25;

const bouncerStats = {
  area: 20,
  speed: 20,
  damage: 20,
  cooldown: 50,
  lifeTime: loopPerSecond * 1,
  pierce: 9999,
  special: 0,
};

export const createBounceBullet = () => {
  const area = stats.area * bouncerStats.area;
  const speed = stats.speed * bouncerStats.speed;
  const damage = stats.damage * bouncerStats.damage;
  const cooldown = stats.cooldown * bouncerStats.cooldown;

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
      x: -direction.x * speed,
      y: -direction.y * speed,
    },
    lifeTime: bouncerStats.lifeTime,
    damage: damage,
    color: "lime",
    team: "player",
    priority: 5,

    enemiesHit: [],
    pierce: bouncerStats.pierce,
    weapon: bouncer,
  };
  bullets.push(bullet);
};

export const bouncer = {
  name: "bouncer",
  timesTaken: 0,
  unlockRequirement: () => {},
  image: await loadImage(`public/sprites/goldbag.png`),
  attackIntervall: bouncerStats.cooldown * stats.cooldown,
  cooldown: bouncerStats.cooldown * stats.cooldown,
  attack: createBounceBullet,

  update: () => {
    bouncer.attackIntervall = bouncerStats.cooldown * stats.cooldown;

    bullets.forEach((bullet) => {
      if (bullets.includes(bullet)) {
        bullet.lifeTime--;
        if (bullet.lifeTime < 0) {
          bullet.destroy = true;
        }

        if (bullet.pos.x + bullet.radius >= world.width / 2 + player.pos.x) {
          bullet.vel.x = -bullet.vel.x;
          // console.log("höger");
        }
        if (bullet.pos.x - bullet.radius <= -world.width / 2 + player.pos.x) {
          bullet.vel.x = -bullet.vel.x;
          // console.log("vänster");
        }
        if (bullet.pos.y - bullet.radius <= -world.height / 2 + player.pos.y) {
          bullet.vel.y = -bullet.vel.y;
          // console.log("upp");
        }
        if (bullet.pos.y + bullet.radius >= world.height / 2 + player.pos.y) {
          bullet.vel.y = -bullet.vel.y;
          // console.log("ned");
        }

        // console.log(player.pos);
      }
    });
  },

  stats: bouncerStats,

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
