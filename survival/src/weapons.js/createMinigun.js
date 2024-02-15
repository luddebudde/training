import { bullets, mousePos, moveCtx, player, worldObjects } from "../main.js";
import { makeDirection } from "../makeDirection.js";
import { playMinigun, playMinigunOverheat } from "../sounds.js";
import { stats, upgradeStats } from "../stats.js";
import { vector } from "../vectors.js";

const bulletSpeed = 20 * stats.speed;
// const cooldown = 25;

const aimBulletStats = {
  area: 5,
  speed: 10,
  damage: 20,
  cooldown: 300,
  bulletCount: 100,
  fireRate: 10,
  pierce: 0,
};

export const createMinigun = () => {
  // console.log(aimBullet.area);
  const area = stats.area * aimBulletStats.area;
  const speed = stats.speed * aimBulletStats.speed;
  const damage = stats.damage * aimBulletStats.damage;
  const cooldown = stats.cooldown * aimBulletStats.cooldown;
  const bulletCount = aimBulletStats.bulletCount;
  const fireRate = aimBulletStats.fireRate;

  for (let i = 0; i < bulletCount; i++) {
    setTimeout(() => {
      if (i % 10 == 0) {
        playMinigun();
        // playMinigunOverheat();
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
        color: "red",
        team: "player",
        priority: 5,
        enemiesHit: [],
        pierce: 0,

        attack: () => {
          bullets.push(bullet);
          // worldObjects.push(bullet);
        },
      };

      bullets.push(bullet);
      // worldObjects.push(bullet);
    }, i * fireRate);
  }

  //   return cooldown;
};

export const minigun = {
  name: "minigun",

  attackIntervall: aimBulletStats.cooldown * stats.cooldown,
  cooldown: aimBulletStats.cooldown * stats.cooldown,
  attack: createMinigun,

  update: () => {
    minigun.attackIntervall = aimBulletStats.cooldown * stats.cooldown;
    // console.log(minigun.stats.fireRate);
  },

  stats: aimBulletStats,

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
