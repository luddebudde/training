import { createObstacle } from "./createObstacle.js";
import { bullets, obstacles, player, units, worldObjects } from "./main.js";
import { enemy, enemySpeed } from "./src/enemy.js";
import { world } from "./world.js";

export const transitionToPhase4 = () => {
  enemy.xPos = world.width / 2;
  enemy.yPos = enemy.radius;
  enemy.vel.x = -enemySpeed;
  enemy.vel.y = 0;

  player.xPos = world.width / 2;
  player.yPos = world.height - enemy.radius * 2.5;
  player.vel.x = 0;
  player.vel.y = 0;

  obstacles.length = 0;
  units.lenght = 2;
  bullets.lenght = 0;
  worldObjects.length = 2;

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
