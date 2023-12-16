import { createObstacle } from "./createObstacle.js";
import { bullets, player, worldObjects } from "./main.js";
import { enemy } from "./src/enemy.js";
import { world } from "./world.js";

export const transitionToPhase4 = () => {
  enemy.xPos = world.width / 2;
  enemy.yPos = enemy.radius;
  enemy.vel.x = -20;
  enemy.vel.y = 0;

  player.xPos = world.width / 2;
  player.yPos = world.height - enemy.radius * 2.5;
  player.vel.x = 0;
  player.vel.y = 0;

  // Side obstacles
  createObstacle(
    enemy.radius * 2,
    enemy.radius * 2,
    enemy.radius * 2 + 10,

    world.height - enemy.radius * 2,
    "red",
    true
  );

  createObstacle(
    world.width - enemy.radius * 2,
    enemy.radius * 2,
    world.width - enemy.radius * 2 + 10,

    world.height - enemy.radius * 2,
    "red",
    true
  );

  // Bottom obstacles
  createObstacle(
    enemy.radius * 2,
    enemy.radius * 2 + 10,
    world.width - enemy.radius * 2,

    enemy.radius * 2,
    "red",
    true
  );

  createObstacle(
    enemy.radius * 2,
    world.height - enemy.radius * 2 - 10,
    world.width - enemy.radius * 2,

    world.height - enemy.radius * 2,
    "red",
    true
  );

  return worldObjects.filter(
    (worldObject) => worldObject.type !== "playerCopy"
  );
};
