import { createObstacle } from "./createObstacle.js";
import {
  attackCounter,
  bullets,
  obstacles,
  phaseMoves,
  player,
  units,
  worldObjects,
} from "./main.js";
import { currentPhase, enemy, secondPhase } from "./src/enemy.js";
import { world } from "./world.js";

export const transitionToPhase2 = (currentPhase) => {
  enemy.xPos = world.width / 2;
  enemy.yPos = enemy.radius;
  enemy.vel.x = 0;
  enemy.vel.y = 0;

  player.xPos = world.width / 2;
  player.yPos = world.height - enemy.radius * 2.5;
  player.vel.x = 0;
  player.vel.y = 0;

  obstacles.length = 0;
  units.lenght = 2;
  bullets.lenght = 0;
  worldObjects.length = 2;

  createObstacle(
    0,
    enemy.radius * 2 + 100,
    500,

    world.height - enemy.radius * 3,
    "red",
    false
  );

  createObstacle(
    world.width / 2 + enemy.radius,
    enemy.radius * 2 + 100,
    world.width,
    world.height - enemy.radius * 3,
    "red",
    false
  );

  createObstacle(0, 0, 500, enemy.radius * 2, "red", false);

  createObstacle(
    world.width / 2 + enemy.radius,
    0,
    world.width,
    enemy.radius * 2,
    "red",
    false
  );

  createObstacle(
    0,
    world.height - enemy.radius * 2,
    world.width / 2 - enemy.radius,

    world.height,
    "red",
    false
  );
  createObstacle(
    world.width / 2 + enemy.radius,
    world.height - enemy.radius * 2,
    world.width,

    world.height,
    "red",
    false
  );
  //
  // return (currentPhase = secondPhase);
};
