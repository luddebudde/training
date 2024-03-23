import { doCirclesOverlap } from "./doCirlceOverlap.js";
import { mapObjects, player } from "./main.js";
import { stats } from "./stats.js";
import { worldsizeMultiplier } from "./world.js";

export const createEgg = (spawnWidth, spawnHeight) => {
  const egg = {
    name: "egg",
    radius: 40 * worldsizeMultiplier,
    pos: {
      x: spawnWidth,
      y: spawnHeight,
    },
    vel: {
      x: 0,
      y: 0,
    },
    color: "grey",
    team: "enemy",
    priority: 10,
    shouldPoint: false,
    arrowColor: "green",

    update: () => {
      if (doCirclesOverlap(player, egg)) {
        const index = mapObjects.indexOf(egg);
        mapObjects.splice(index, 1);
        console.log("egg");
        // player.speed += 10;
        stats.curse += 1;
        player.eggCount += 1;
      }
    },

    draw: (ctx, assets, gameObject) => {
      ctx.drawImage(
        assets.egg,
        egg.pos.x - egg.radius,
        egg.pos.y - egg.radius,
        egg.radius * 2,
        egg.radius * 2
      );
    },
  };

  mapObjects.push(egg);
};
