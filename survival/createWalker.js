import { entities } from "./main.js";

export const createWalker = (spawnWidth, spawnHeight) => {
  const walker = {
    health: 100,
    radius: 40,
    pos: {
      x: spawnWidth,
      y: spawnHeight,
    },
    vel: {
      x: 1,
      y: 1,
    },
    speed: 1.5,
    damage: 20,
    color: "red",
  };

  entities.push(walker);
};
