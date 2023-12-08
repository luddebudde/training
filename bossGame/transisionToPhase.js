import { createObstacle } from "./createObstacle.js";
import { enemy } from "./src/enemy.js";
import { world } from "./world.js";

export const transitionToPhase2 = () => {
  enemy.xPos = world.width / 2;
  enemy.yPos = enemy.radius;
  createObstacle(
    0,
    enemy.radius * 2 + 100,
    500,

    world.height - enemy.radius * 5 - 100,
    "red"
  );

  createObstacle(
    world.width / 2 + enemy.radius,
    enemy.radius * 2 + 100,
    world.width,
    world.height - enemy.radius * 5 - 100,
    "red"
  );

  createObstacle(0, 0, 500, enemy.radius * 2, "red");

  createObstacle(
    world.width / 2 + enemy.radius,
    0,
    world.width,
    enemy.radius * 2,
    "red"
  );

  createObstacle(
    0,
    world.height - enemy.radius * 2,
    world.width / 2 - enemy.radius,

    enemy.radius * 2,
    "red"
  );
  createObstacle(
    world.width / 2 + enemy.radius,
    world.height - enemy.radius * 2,
    world.width,

    enemy.radius * 2,
    "red"
  );
};
