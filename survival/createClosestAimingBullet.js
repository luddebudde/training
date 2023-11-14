import { playerBullets } from "./main.js";
import { enemies } from "./main.js";
import { makeDirection } from "./makeDirection.js";
import { player } from "./player.js";

const bulletSpeed = 30;
let previusPosDifferance = {
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
      x: player.pos.x - enemy.pos.x,
      y: player.pos.y - enemy.pos.x,
    };
    // console.log(posDifferance);
    if (
      previusPosDifferance.pos.x + previusPosDifferance.pos.y <
      posDifferance.x + posDifferance.y
    ) {
      //   previusPosDifferance = posDifferance;
      previusPosDifferance.pos.x = posDifferance.x;
      previusPosDifferance.pos.y = posDifferance.y;
      direction = makeDirection(player, previusPosDifferance);
    }
    console.log(direction);
    // console.log(makeDirection(player, previusPosDifferance));
    // console.log(direction);
  });

  const bullet = {
    radius: 15,
    pos: {
      x: player.pos.x,
      y: player.pos.y,
    },
    vel: {
      x: direction.x * bulletSpeed,
      y: direction.y * bulletSpeed,
    },
    damage: 0,
    color: "black",
  };

  playerBullets.push(bullet);
};
