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

const droperStats = {
  area: 20,
  damage: 20,
  cooldown: 75,
  pierce: 3,
  special: 0,
};

export const createDroper = () => {
  const area = stats.area * droperStats.area;
  const speed = stats.speed * droperStats.speed;
  const damage = stats.damage * droperStats.damage;
  const cooldown = stats.cooldown * droperStats.cooldown;

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
      x: 0,
      y: 0,
    },
    damage: damage,
    color: "blue",
    team: "player",
    priority: 5,

    enemiesHit: [],
    pierce: droperStats.pierce,
    weapon: droper,
  };
  bullets.push(bullet);
};

export const droper = {
  name: "droper",
  image: await loadImage(`public/sprites/egg.png`),
  attackIntervall: droperStats.cooldown * stats.cooldown,
  cooldown: droperStats.cooldown * stats.cooldown,
  attack: createDroper,

  update: () => {
    droper.attackIntervall = droperStats.cooldown * stats.cooldown;
  },

  stats: droperStats,

  statistics: {
    kills: 0,
    damage: 0,
    timeExisted: 0,
  },

  upgrades: {
    level: 0,
    statsOrder: [
      ["cooldown", "damage"],
      ["area", "pierce"],
      ["damage"],
      ["area", "pierce"],
      ["coolddown, damage"],
      ["special", "damage"],
    ],
    amountOrder: [[-25, 10], [5, 1], [10], [5, 1], [-25, 20], [1, 20]],

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
