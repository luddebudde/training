import { worldObjects, xps } from "./main.js";

export const createXp = (xPos, yPos, xpAmount) => {
  const xp = {
    amount: xpAmount,
    radius: xpAmount * 1 + 20,
    color: "#aaffff",
    pos: {
      x: xPos,
      y: yPos,
    },
    // vel: {
    //   x: 0,
    //   y: 0,
    // },
  };

  worldObjects.push(xp);
  xps.push(xp);
};
