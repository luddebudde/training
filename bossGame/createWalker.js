import { player, units, worldObjects } from "./main.js";
import { makeDirection } from "./makeDirection.js";

export const createWalker = () => {
  const walker = {
    xPos: 0,
    yPos: 0,
    vel: {
      x: 0,
      y: 0,
    },
    radius: 20,
    damage: 3,
    health: 40,
    color: "red",
    type: "enemy",
    team: "enemy",

    attack: () => {
      const direction = makeDirection(walker, player);
      walker.vel.x = direction.x * 10;
      walker.vel.y = direction.y * 10;
    },
  };
  units.push(walker);
  worldObjects.push(walker);
};
