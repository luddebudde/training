import { world } from "./world.js";

const maxHealth = 100;

export const createPlayer = () => {
  return {
    health: maxHealth,
    pos: {
      x: world.width / 2,
      y: world.height / 2,
    },
    vel: {
      x: 0,
      y: 0,
    },
    speed: 5,
    radius: 40,
    health: 100,
    color: "blue",
    team: "player",
  };
};
