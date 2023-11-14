import { createEnemies, enemyBullets } from "./main.js";
import { loopPerSecond } from "./basic.js";
import { world } from "./world.js";

const spawnInterval = 1;
const spawnChance = loopPerSecond * spawnInterval;

let spawnWidth = 0;
let spawnHeight = 0;

// Möjligen -100 på (world.height * 1.1)

export const spawnEnemy = () => {
  const spawnRandomizer = Math.random();
  if (spawnRandomizer <= 0.25) {
    spawnWidth = Math.random() * (world.width * 1.1);
    spawnHeight = -70;
  } else if (spawnRandomizer <= 0.5) {
    spawnWidth = world.width + 70;
    spawnHeight = Math.random() * (world.height * 1.1);
  } else if (spawnRandomizer <= 0.75) {
    spawnWidth = Math.random() * (world.width * 1.1);
    spawnHeight = world.height + 70;
  } else {
    spawnWidth = -70;
    spawnHeight = Math.random() * (world.height * 1.1);
  }
  // console.log(spawnWidth);

  const chosenNumber = Math.random() * spawnChance + 1;
  if (chosenNumber >= spawnChance) {
    console.log("hejs");
    createEnemies[Math.floor(Math.random() * createEnemies.length)](
      spawnWidth,
      spawnHeight
    );
  }
};
