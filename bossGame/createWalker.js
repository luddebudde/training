import { player, units, worldObjects } from "./main.js";
import { makeDirection } from "./makeDirection.js";
import { world } from "./world.js";

export const createWalker = (xPos, yPos, velX, velY) => {
  const walker = {
    xPos: xPos,
    yPos: yPos,
    vel: {
      x: velX,
      y: velY,
    },
    radius: world.width / ((world.width / Math.random()) * 20) + 20,
    damage: 10,
    health: 40,
    color: "red",
    type: "walker",
    team: "enemy",
  };
  units.push(walker);
  worldObjects.push(walker);
};
