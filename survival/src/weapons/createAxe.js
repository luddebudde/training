import { drawObject } from "../draw/drawObject.js";
import { loadImage } from "../image.js";
import {
  assets,
  bullets,
  ctx,
  mousePos,
  player,
  worldObjects,
} from "../main.js";
import { makeDirection } from "../makeDirection.js";
import { stats } from "../stats.js";
import { world } from "../world.js";

const axeStats = {
  area: 80,
  speed: 10,
  damage: 160,
  cooldown: 300,
  special: 0,
  knockback: 1,
  applyEffect: {
    fear: 0,
  },
};

let axeBullet = {};

export const createAxe = () => {
  const area = axeStats.area + stats.area;
  const speed = 5;
  const damage = stats.damage * axeStats.damage;
  const cooldown = stats.cooldown * axeStats.cooldown;

  axeBullet = {
    angle: 4,
    radius: area,
    attackIntervall: cooldown,
    cooldown: cooldown,
    destroy: false,
    pos: {
      x: player.pos.x,
      y: player.pos.y - player.radius * 4 + area,
    },
    vel: {
      x: speed,
      y: speed,
    },
    speed: speed,
    damage: damage,
    knockback: axeStats.knockback,
    color: "green",
    team: "player",
    priority: 5,
    laps: 0,
    enemiesHit: [],
    pierce: 10000,
    weapon: axe,
  };

  bullets.push(axeBullet);
};

function moveAroundCircle(circle) {
  circle.angle += circle.speed * 0.01;
  // if () {
  if (circle.angle * 36 > 360) {
    if (axeStats.special === 1) {
      circle.laps += 1;
    }
    if (circle.laps % 2 === 0) {
      circle.destroy = true;
    } else if (axeStats.special) {
      circle.radius = axeStats.area * 1.5;
      circle.speed = axeStats.speed * 1.3;

      circle.angle = circle.angle - 6;
    }
  }

  circle.pos.x = player.pos.x + circle.radius * Math.cos(circle.angle);
  circle.pos.y = player.pos.y + circle.radius * Math.sin(circle.angle);
}

export const axe = {
  name: "Giant Axe",
  timesTaken: 0,
  unlockRequirement: () => {},
  image: await loadImage(`public/sprites/aimBulletSprite.png`),
  attackIntervall: axeStats.cooldown * stats.cooldown,
  cooldown: axeStats.cooldown * stats.cooldown,
  attack: createAxe,

  update: () => {
    axe.attackIntervall = axeStats.cooldown * stats.cooldown;

    if (axeBullet.pos !== undefined) {
      moveAroundCircle(axeBullet);
    }
  },

  statistics: {
    kills: 0,
    damage: 0,
    timeExisted: 0,
  },

  stats: axeStats,

  upgrades: {
    level: 0,
    statsOrder: [
      ["cooldown"],
      ["speed"],
      ["damage"],
      ["area"],
      ["speed"],
      ["special"],
    ],
    amountOrder: [[-10], [1], [1], [5], [5], [1]],
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
