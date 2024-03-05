import { worldObjects, xps } from "./main.js";

export const createXp = (xPos, yPos, xpAmount) => {
  const xp = {
    amount: xpAmount,

    radius: Math.sqrt(xpAmount) / 2 + 10,
    color: "#aaffff",
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
