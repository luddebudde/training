import { bullets, obstacles, player, units, worldObjects } from "./main.js";
import { enemy, thirdPhase } from "./src/enemy.js";
import { world } from "./world.js";

export let playerCopy1 = {
  xPos: 0,
  yPos: 0,
  vel: {
    x: 0,
    y: 0,
  },
  color: "blue",
  radius: 20,
  health: 100,
  damage: 1,
  type: "playerCopy",
};

export let playerCopy2 = {
  xPos: 0,
  yPos: 0,
  vel: {
    x: 0,
    y: 0,
  },
  color: "blue",
  radius: 20,
  health: 100,
  damage: 1,
  type: "playerCopy",
};

export const transitionToPhase3 = (currentPhase) => {
  obstacles.length = 0;

  enemy.xPos = world.width / 2;
  enemy.yPos = enemy.radius;
  enemy.vel.x = -20;
  enemy.vel.y = 0;

  player.xPos = world.width / 2;
  player.yPos = world.height - enemy.radius * 2.5;
  player.vel.x = 0;
  player.vel.y = 0;

  playerCopy1.xPos = player.xPos - world.width / 3;
  playerCopy1.yPos = player.yPos;
  playerCopy2.xPos = player.xPos + world.width / 3;
  playerCopy2.yPos = player.yPos;

  // units.push(playerCopy1, playerCopy2);
  worldObjects.push(playerCopy1, playerCopy2);

  // console.log("hufaiu");
  //   console.log((currentPhase = thirdPhase));
  // return (currentPhase = thirdPhase);
};
