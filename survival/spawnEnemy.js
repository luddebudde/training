import { createEnemies } from "./arrays.js";
import { loopPerSecond } from "./basic.js";

const spawnInterval = 3;
const spawnChance = loopPerSecond * spawnInterval;

export const spawnEnemy = () => {
  const chosenNumber = Math.random() * spawnChance + 1;
  if (chosenNumber >= spawnChance) {
    createEnemies[Math.floor(Math.random() * createEnemies.length)]();
  }
};
