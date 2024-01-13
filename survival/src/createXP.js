import { worldObjects, xps } from "./main.js";

export const createXp = (xPos, yPos, xpAmount) => {
  const xp = {
    amount: xpAmount,

    radius: xpAmount * 0.5 + 5,
    color: "#aaffff",
    pos: {
      x: xPos,
      y: yPos,
    },
    destroy: false,
    priority: 1,
    // vel: {
    //   x: 0,
    //   y: 0,
    // },
  };

  worldObjects.push(xp);
  xps.push(xp);
};
