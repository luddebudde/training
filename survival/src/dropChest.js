import { chests, entities, mapObjects } from "./main.js";

export const dropChest = (locX, locY) => {
  const chest = {
    pos: {
      x: locX,
      y: locY,
    },
    radius: 50,
    arrowColor: "black",
  };
  chests.push(chest);
  mapObjects.push(chest);
};
