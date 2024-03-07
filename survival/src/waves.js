import { createCharger } from "./enemies/createCharger.js";
import { createJuggernaut } from "./enemies/createJuggernaut.js";
import { createTank } from "./enemies/createTank.js";
import { createWalker } from "./enemies/createWalker.js";
import { getRandomSpawnPos } from "./getRandomSpawnPos.js";
import { player } from "./main.js";
import { stats } from "./stats.js";

export const wave1 = () => {
  for (let i = 0; i < 5 * stats.curse; i++) {
    const spawnPos = getRandomSpawnPos(player);
    createWalker(spawnPos.x, spawnPos.y);
    createCharger(spawnPos.x, spawnPos.y);
    createTank(spawnPos.x, spawnPos.y + 100);
    // createNerfer(spawnPos.x, spawnPos.y);
  }
};

export const wave2 = () => {
  for (let i = 0; i < 5 * stats.curse; i++) {
    const spawnPos = getRandomSpawnPos(player);
    // createWalker(spawnPos.x, spawnPos.y);
    createCharger(spawnPos.x, spawnPos.y);
    // createTank(spawnPos.x, spawnPos.y + 100);
    // createNerfer(spawnPos.x, spawnPos.y);
  }
};

export const wave3 = () => {
  for (let i = 0; i < 5 * stats.curse; i++) {
    const spawnPos = getRandomSpawnPos(player);
    // createWalker(spawnPos.x, spawnPos.y);
    //   createCharger(spawnPos.x, spawnPos.y);
    // createTank(spawnPos.x, spawnPos.y + 100);
    createJuggernaut(spawnPos.x, spawnPos.y + 100);
    // createNerfer(spawnPos.x, spawnPos.y);
  }
};
