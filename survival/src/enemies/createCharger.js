import { doCirclesOverlap } from "../doCirlceOverlap.js";
import { enemies, entities, player, worldObjects } from "../main.js";
import { makeDirection } from "../makeDirection.js";
import { stats } from "../stats.js";
import { vector } from "../vectors.js";

export const createCharger = (spawnWidth, spawnHeight) => {
  const charger = {
    health: 10,
    radius: 40,
    pos: {
      x: spawnWidth,
      y: spawnHeight,
    },
    vel: {
      x: 0,
      y: 0,
    },
    speed: 5 * stats.curse,
    damage: 10,
    // damage: 0,
    color: "black",
    team: "enemy",
    xp: Math.random() * 25 * stats.growth,
    priority: 10,

    update: () => {
      if (doCirclesOverlap(charger, player)) {
        charger.health = 0;
        player.health -= charger.damage;
      }

      const newVel = makeDirection(charger.pos, player.pos);
      // console.log(makeDirection(walker, player));
      charger.vel.x = newVel.x * charger.speed;
      charger.vel.y = newVel.y * charger.speed;
    },
  };

  entities.push(charger);
  enemies.push(charger);
  worldObjects.push(charger);
};
