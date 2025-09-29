import { bullets, mousePos, player, worldObjects } from "../main.js";
import { makeDirection } from "../makeDirection.js";
import { totalWeapons } from "../menu/levelUpSelection.js";
import { playMinigun, playMinigunOverheat } from "../sounds.js";
import { statistics } from "../statistics.js";
import { stats, upgradeStats } from "../stats.js";
import { vector } from "../vectors.js";

const bulletSpeed = 20 * stats.speed;

const minigunStats = {
  area: 5,
  speed: 10,
  damage: 20,
  cooldown: 300,
  bulletCount: 100,
  fireRate: 10,
  pierce: 0,
  knockback: 0.2,
  applyEffect: {
    // fear: 5,
  },
};

export const createMinigun = () => {
  const area = stats.area * minigunStats.area;
  const speed = stats.speed * minigunStats.speed;
  const damage = stats.damage * minigunStats.damage;
  const cooldown = stats.cooldown * minigunStats.cooldown;
  const bulletCount = minigunStats.bulletCount;
  const fireRate = minigunStats.fireRate;

  for (let i = 0; i < bulletCount; i++) {
    setTimeout(() => {
      if (i % 10 == 0) {
        playMinigun();
      }
      if (i === bulletCount - 1) {
        playMinigunOverheat();
      }
      const angle =
        (i / (bulletCount / Math.floor(bulletCount / 50))) * 2 * Math.PI;

      const posX = player.pos.x + area * Math.cos(angle);
      const posY = player.pos.y + area * Math.sin(angle);

      const bullet = {
        radius: area,
        attackIntervall: cooldown,
        cooldown: cooldown,
        destroy: false,
        pos: {
          x: posX,
          y: posY,
        },
        vel: {
          x: Math.cos(angle) * speed,
          y: Math.sin(angle) * speed,
        },
        damage: damage,
        knockback: minigunStats.knockback,
        color: "red",
        team: "player",
        priority: 5,
        enemiesHit: [],
        pierce: 0,
        weapon: minigun,

        attack: () => {
          bullets.push(bullet);
        },
      };

      bullets.push(bullet);
    }, i * fireRate);
  }
};

export const minigun = {
  name: "minigun",
  timesTaken: 0,
  unlockRequirement: () => {
    if (statistics.game.kills > 1000) {
      return true;
    }
  },
  unlockRequirementText: "total 1K kills",
  attackIntervall: minigunStats.cooldown * stats.cooldown,
  cooldown: minigunStats.cooldown * stats.cooldown,
  attack: createMinigun,

  update: () => {
    minigun.attackIntervall = minigunStats.cooldown * stats.cooldown;
  },

  statistics: {
    kills: 0,
    damage: 0,
    timeExisted: 0,
  },

  stats: minigunStats,

  upgrades: {
    level: 0,
    statsOrder: [
      ["bulletCount"],
      ["area"],
      ["cooldown"],
      ["fireRate"],
      ["damage"],
      ["bulletCount"],
    ],
    amountOrder: [[100], [5], [250], [-5], [10], [200]],
  },
};
