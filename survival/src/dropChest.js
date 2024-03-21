import { chests, entities } from "./main.js";

export const dropChest = (locX, locY) => {
  const chest = {
    pos: {
      x: locX,
      y: locY,
    },
    radius: 50,
  };

  chests.push(chest);
};
