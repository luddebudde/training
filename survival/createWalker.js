import { enemies } from "./main.js";

export const createWalker = (spawnWidth, spawnHeight) => {
  const walker = {
    health: 100,
    radius: 40,
    pos: {
      x: spawnWidth,
      y: spawnHeight,
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
