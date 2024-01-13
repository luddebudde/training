import { stats } from "./stats.js";
import { world } from "./world.js";

export const createPlayer = () => {
  return {
    health: stats.maxHealth,
    pos: {
      x: world.width / 2,
      y: world.height / 2,
    },
    vel: {
      x: 0,
      y: 0,
    },
    speed: stats.movementSpeed,
    radius: 40,
    health: 100,
    color: "blue",
    team: "player",
    priority: 100,
  };
};
