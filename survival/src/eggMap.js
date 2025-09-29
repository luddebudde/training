import { doCirclesOverlap } from "./doCirlceOverlap.js";
import { chests, entities, mapObjects, player, updateables } from "./main.js";
import { world, worldsizeMultiplier } from "./world.js";

export const placeEggMap = (xPos, yPos) => {
  const map = {
    pos: {
      x: xPos,
      y: yPos,
    },
    radius: 50,
    name: "map",
    radius: 40 * worldsizeMultiplier,

    color: "purple",
    priority: 10,
    shouldPoint: false,

    update: () => {
      if (doCirclesOverlap(player, map)) {
        const index = mapObjects.indexOf(map);
        mapObjects.splice(index);

        mapObjects.forEach((mapObject) => {
          if (mapObject.name === "egg") {
            mapObject.shouldPoint = true;
          }
        });
      }
    },

    draw: (ctx, assets, gameObject) => {
      ctx.drawImage(
        assets.egg,
        map.pos.x - map.radius,
        map.pos.y - map.radius,
        map.radius * 2,
        map.radius * 2
      );
    },
  };

  mapObjects.push(map);
  updateables.push(map);
};
