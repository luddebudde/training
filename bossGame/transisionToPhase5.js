import { bullets, obstacles, player, units, worldObjects } from "./main.js";
import { enemy } from "./src/enemy.js";
import { world } from "./world.js";

export const transitionToPhase5 = () => {
  obstacles.length = 0;
  units.lenght = 2;
  bullets.lenght = 0;
  worldObjects.length = 2;

  enemy.xPos = world.width / 2;
  enemy.yPos = enemy.radius;
  enemy.vel.x = 0;
  enemy.vel.y = 0;

  player.xPos = world.width / 2;
  player.yPos = world.height - enemy.radius * 2.5;
  player.vel.x = 0;
  player.vel.y = 0;
};
