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
  spread: 0.7,
  pellets: 10,
  pierce: 0,
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
    }
  });

  previusPosDifference.pos.x = 100000000;
  previusPosDifference.pos.y = 100000000;

  for (let i = 0; i < shotgunBulletStats.pellets; i++) {
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
      enemiesHit: [],
      pierce: 0,
      weapon: shotgun,
    };

    // console.log(previusPosDifference);

    bullets.push(bullet);
    // worldObjects.push(bullet);
  }
  playShotgun();
};

export const shotgun = {
  name: "shotgun",
  timesTaken: 0,
  newCooldown: cooldown * stats.cooldown,
  attackIntervall: cooldown * stats.cooldown,
  cooldown: cooldown * stats.cooldown,
  attack: createShotgun,

  update: () => {
    shotgun.attackIntervall = shotgunBulletStats.cooldown * stats.cooldown;
  },

  statistics: {
    kills: 0,
    damage: 0,
    timeExisted: 0,
  },

  stats: shotgunBulletStats,

  upgrades: {
    level: 0,
    statsOrder: [
      ["spread"],
      ["speed", "pierce"],
      ["damage"],
      ["area"],
      ["spread", "pierce"],
      ["pellets"],
    ],
    amountOrder: [[-0.2], [1, 1], [1], [5], [-0.3, 2], [10]],
    description: [
      "Decreases the spread of the weapon",
      "Increases the speed",
      "Increases the damage",
      "Increases the area",
      "Decreases the spread even more",
      "Increases the amount of pellets",
    ],
  },
};
