import { getRandomInRange } from "../getRandomInRange.js";
import { bullets, enemies, player, worldObjects } from "../main.js";
import { entities } from "../main.js";
import { makeDirection } from "../makeDirection.js";
import { playShotgun } from "../sounds.js";
import { stats } from "../stats.js";

// const bulletSpeed = 10 * stats.speed;
const cooldown = 100;
const bulletSpread = 0.5;
// const bulletSpread = 0;

let previusPosDifference = {
  pos: {
    x: 100000000,
    y: 100000000,
  },
};
let direction = {
  x: 0,
  y: 0,
};

const shotgunBulletStats = {
  area: 15,
  speed: 10,
  damage: 40,
  cooldown: 100,
  spread: 0.5,
};

export const createShotgun = () => {
  const area = stats.area * shotgunBulletStats.area;
  const speed = stats.speed * shotgunBulletStats.speed;
  const damage = stats.damage * shotgunBulletStats.damage;
  const cooldown = stats.cooldown - shotgunBulletStats.cooldown;

  const spread = shotgunBulletStats.spread;

  enemies.forEach((enemy) => {
    const posDifference = {
      x: player.pos.x - enemy.pos.x,
      y: player.pos.y - enemy.pos.y,
    };

    const previusPosDifferenceRoot = {
      x: previusPosDifference.pos.x * previusPosDifference.pos.x,
      y: previusPosDifference.pos.y * previusPosDifference.pos.y,
    };

    const currentPosDifferenceRoot = {
      x: posDifference.x * posDifference.x,
      y: posDifference.y * posDifference.y,
    };

    if (
      previusPosDifferenceRoot.x + previusPosDifferenceRoot.y >
      currentPosDifferenceRoot.x + currentPosDifferenceRoot.y
    ) {
      direction = makeDirection(player.pos, enemy.pos);
      previusPosDifference.pos.x = posDifference.x;
      previusPosDifference.pos.y = posDifference.y;
      // previusEnemy = enemy;
    }
  });

  previusPosDifference.pos.x = 100000000;
  previusPosDifference.pos.y = 100000000;

  for (let i = 0; i < 10; i++) {
    const spreadX = getRandomInRange(-spread, spread);
    const spreadY = getRandomInRange(-spread, spread);

    const finalDirection = {
      x: direction.x + spreadX,
      y: direction.y + spreadY,
    };

    const bullet = {
      radius: area,
      // attackIntervall: cooldown,
      cooldown: cooldown,
      pos: {
        x: player.pos.x,
        y: player.pos.y,
      },
      vel: {
        x: finalDirection.x * speed,
        y: finalDirection.y * speed,
      },
      damage: damage,
      // damage: 0,
      color: "black",
      team: "player",
      priority: 5,
    };

    // console.log(previusPosDifference);

    bullets.push(bullet);
    worldObjects.push(bullet);
  }
  playShotgun();
};

export const shotgun = {
  name: "shotgun",
  newCooldown: cooldown * stats.cooldown,
  attackIntervall: cooldown * stats.cooldown,
  cooldown: cooldown * stats.cooldown,
  attack: createShotgun,

  update: () => {
    shotgun.attackIntervall = shotgunBulletStats.cooldown * stats.cooldown;
  },

  stats: shotgunBulletStats,

  upgrades: {
    level: 0,
    statsOrder: ["spread", "speed", "damage", "area", "speed", "damage"],
    amountOrder: [-0.4, 1, 1, 5, 5, 5],
  },
};