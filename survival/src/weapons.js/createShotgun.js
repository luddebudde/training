import { getRandomInRange } from "../getRandomInRange.js";
import { bullets, enemies, player, worldObjects } from "../main.js";
import { entities } from "../main.js";
import { makeDirection } from "../makeDirection.js";
import { stats } from "../stats.js";

const bulletSpeed = 10 * stats.speed;
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
// array.forEach((element) => {});

export const createShotgun = () => {
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
    const spreadX = getRandomInRange(-bulletSpread, bulletSpread);
    const spreadY = getRandomInRange(-bulletSpread, bulletSpread);

    const finalDirection = {
      x: direction.x + spreadX,
      y: direction.y + spreadY,
    };

    const bullet = {
      radius: 15 * stats.area,
      // attackIntervall: cooldown,
      cooldown: cooldown,
      pos: {
        x: player.pos.x,
        y: player.pos.y,
      },
      vel: {
        x: finalDirection.x * bulletSpeed,
        y: finalDirection.y * bulletSpeed,
      },
      damage: 40 * stats.damage,
      // damage: 0,
      color: "black",
      team: "player",
      priority: 5,
    };

    // console.log(previusPosDifference);

    bullets.push(bullet);
    worldObjects.push(bullet);
  }
};

export const shotgun = {
  newCooldown: cooldown * stats.cooldown,
  attackIntervall: cooldown * stats.cooldown,
  cooldown: cooldown * stats.cooldown,
  attack: createShotgun,
};
