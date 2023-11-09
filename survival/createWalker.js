import { enemies } from "./arrays.js";

export const createWalker = () => {
  const walker = {
    health: 100,
    radius: 60,
    pos: {
      x: 1000,
      y: 1000,
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
