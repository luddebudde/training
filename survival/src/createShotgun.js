import { getRandomInRange } from "./getRandomInRange.js";
import { bullets, enemies, player, worldObjects } from "./main.js";
import { entities } from "./main.js";
import { makeDirection } from "./makeDirection.js";

const bulletSpeed = 10;
const cooldown = 100;
const bulletSpread = 0.3;

let previusPosDifference = {
  pos: {
    x: 0,
    y: 0,
  },
};
let direction = {
  x: 0,
  y: 0,
};
// array.forEach((element) => {});

export const createShotgun = () => {
  enemies.forEach((enemy) => {
    const posDifferance = {
      x: Math.abs(player.pos.x + enemy.pos.x),
      y: Math.abs(player.pos.y + enemy.pos.y),
    };

    if (
      previusPosDifference.pos.x + previusPosDifference.pos.y <
      posDifferance.x + posDifferance.y
    ) {
      direction = makeDirection(player, enemy);
      previusPosDifference.pos.x = posDifferance.x;
      previusPosDifference.pos.y = posDifferance.y;
    }
  });

  for (let i = 0; i < 10; i++) {
    const spreadX = getRandomInRange(-bulletSpread, bulletSpread);
    const spreadY = getRandomInRange(-bulletSpread, bulletSpread);

    const finalDirection = {
      x: direction.x + spreadX,
      y: direction.y + spreadY,
    };

    const bullet = {
      radius: 15,
      attackIntervall: cooldown,
      cooldown: cooldown,
      pos: {
        x: player.pos.x,
        y: player.pos.y,
      },
      vel: {
        x: finalDirection.x * bulletSpeed,
        y: finalDirection.y * bulletSpeed,
      },
      damage: 40,
      color: "black",
      team: "player",
    };
    // console.log(direction);
    bullets.push(bullet);
    worldObjects.push(bullet);
  }

  previusPosDifference.pos.x = 0;
  previusPosDifference.pos.y = 0;
};

export const shotgun = {
  attackIntervall: cooldown,
  cooldown: cooldown,
  attack: createShotgun,
};
