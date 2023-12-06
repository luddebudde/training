import { bullets } from "./main.js";
import { player } from "./player.js";

const bulletSpeed = 20;

export const createAimBullet = (direction) => {
  const bullet = {
    radius: 20,
    bulletHealth: 10,
    pos: {
      x: player.pos.x,
      y: player.pos.y,
    },
    vel: {
      x: direction.x * bulletSpeed,
      y: direction.y * bulletSpeed,
    },
    damage: 20,
    color: "blue",
  };

  bullets.push(bullet);
};
