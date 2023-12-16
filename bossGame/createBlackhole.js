import { units, worldObjects } from "./main.js";
import { world } from "./world.js";

export const blackholes = [];

export const createBlackhole = (
  xPos,
  yPos,
  velX,
  velY,
  radius,
  pullRadius,
  pullForce
) => {
  const blackhole = {
    radius: radius,
    xPos: xPos,
    yPos: yPos,
    vel: {
      x: velX,
      y: velY,
    },
    pullRadius: pullRadius,
    pullForce: pullForce,
    color: "black",
    type: "blackhole",
    team: "enemy",
  };
  blackholes.push(blackhole);
  worldObjects.push(blackhole);
};
