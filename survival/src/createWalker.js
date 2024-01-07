import { enemies, entities, player, worldObjects } from "./main.js";
import { makeDirection } from "./makeDirection.js";

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
    xp: 100,

    update: () => {
      const newVel = makeDirection(walker, player);
      // console.log(makeDirection(walker, player));
      walker.vel.x = newVel.x * walker.speed;
      walker.vel.y = newVel.y * walker.speed;
    },
  };

  entities.push(walker);
  enemies.push(walker);
  worldObjects.push(walker);
};
