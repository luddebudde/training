import { playerBullets } from "./arrays.js";
import { player } from "./player.js";

const bulletSpeed = 20;

export const createBullet = (direction) => {
  const bullet = {
    radius: 20,
    pos: {
      x: player.pos.x,
      y: player.pos.y,
    },
    vel: {
      x: direction.x * bulletSpeed,
      y: direction.y * bulletSpeed,
    },
    damage: 20,
  };

  playerBullets.push(bullet);
};
