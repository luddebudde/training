import { createEnemies, enemyBullets } from "./main.js";
import { loopPerSecond } from "./basic.js";
import { world } from "./world.js";

const spawnInterval = 1;
const spawnChance = loopPerSecond * spawnInterval;

let spawnWidth = 0;
let spawnHeight = 0;

export const spawnEnemy = () => {
  const spawnRandomizer = Math.random();
  if (spawnRandomizer <= 0.25) {
    spawnWidth = Math.random() * (world.width * 1.2) - 100;
    spawnHeight = -70;
  } else if (spawnRandomizer <= 0.5) {
    spawnWidth = world.width + 70;
    spawnHeight = Math.random() * (world.height * 1.2) - 100;
  } else if (spawnRandomizer <= 0.75) {
    spawnWidth = Math.random() * (world.width * 1.2) - 100;
    spawnHeight = world.height + 70;
  } else {
    spawnWidth = -70;
    spawnHeight = Math.random() * (world.height * 1.2) - 100;
  }

  const chosenNumber = Math.random() * spawnChance + 1;
  if (chosenNumber >= spawnChance) {
    createEnemies[Math.floor(Math.random() * createEnemies.length)](
      spawnWidth,
      spawnHeight
    );
  }
};
