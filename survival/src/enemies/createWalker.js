import { doCirclesOverlap } from "../doCirlceOverlap.js";
import { enemies, entities, player, worldObjects } from "../main.js";
import { makeDirection } from "../makeDirection.js";
import { stats } from "../stats.js";
import { vector } from "../vectors.js";

export const createWalker = (spawnWidth, spawnHeight) => {
  const walker = {
    health: 100,
    radius: 40,
    pos: {
      x: spawnWidth,
      y: spawnHeight,
    },
    vel: {
      x: 0,
      y: 0,
    },
    speed: 1,
    damage: 20,
    color: "red",
    team: "enemy",
    xp: Math.random() * 50 * stats.growth,
    priority: 10,

    update: () => {
      const newVel = makeDirection(walker.pos, player.pos);
      // console.log(makeDirection(walker, player));
      walker.vel.x = newVel.x * walker.speed;
      walker.vel.y = newVel.y * walker.speed;
      if (doCirclesOverlap(walker, player)) {
        walker.health = 0;
        player.health -= walker.damage;
      }
    },
  };

  entities.push(walker);
  enemies.push(walker);
  worldObjects.push(walker);
};
