import { worldObjects, xps } from "./main.js";

export const createSumXp = (xPos, yPos, xpAmount, radius) => {
  const xp = {
    amount: xpAmount,

    radius: radius,
    color: "red",
    pos: {
      x: xPos,
      y: yPos,
    },
    vel: {
      x: 0,
      y: 0,
    },
    destroy: false,
    priority: 1,
  };

  xps.push(xp);
};
