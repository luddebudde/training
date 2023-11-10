import { enemies } from "./arrays.js";
import { world } from "./world.js";

let widthSpawn = 0;
let heightSpawn = 0;

export const createWalker = () => {
  if (Math.random() >= 0.5) {
    widthSpawn = 100;
  } else {
    widthSpawn = -100;
  }

  if (Math.random() >= 0.5) {
    heightSpawn = 1.1;
  } else {
    heightSpawn = -0.07;
  }
  const walker = {
    health: 100,
    radius: 60,
    pos: {
      x: Math.random() * world.width + widthSpawn,
      y: (Math.random() + world.height) * heightSpawn,
    },
    vel: {
      x: 0,
      y: 0,
    },
    speed: 1.5,
    damage: 20,
    color: "red",
  };

  enemies.push(walker);
};
