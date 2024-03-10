import { createCharger } from "./enemies/createCharger.js";
import { createJuggernaut } from "./enemies/createJuggernaut.js";
import { createMarcher } from "./enemies/createMarcher.js";
import { createMarcherBoss } from "./enemies/createMarcherBoss.js";
import { createNerfer } from "./enemies/createNerfer.js";
import { createTank } from "./enemies/createTank.js";
import { createWalker } from "./enemies/createWalker.js";
import { createWalkerBoss } from "./enemies/createWalkerBoss.js";
import { getRandomSpawnPos } from "./getRandomSpawnPos.js";
import { player } from "./main.js";
import { stats } from "./stats.js";

export const bossWaves = [2, 4];
export const bossType = [createWalkerBoss, createMarcherBoss];

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
    // createCharger(spawnPos.x, spawnPos.y);

    // createWalker(spawnPos.x, spawnPos.y);

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

export const wave4 = () => {
  // for (let i = 0; i < 10 * stats.curse; i++) {
  // const spawnPos = getRandomSpawnPos(player);
  // createWalker(spawnPos.x, spawnPos.y);
  //   createCharger(spawnPos.x, spawnPos.y);
  // // createTank(spawnPos.x, spawnPos.y + 100);
  // createJuggernaut(spawnPos.x, spawnPos.y + 100);
  // createJuggernaut(spawnPos.x, spawnPos.y + 200);
  // createNerfer(spawnPos.x, spawnPos.y);
  // createMarcher(spawnPos.x + i * 25, spawnPos.y);
  // }
};

export const wave5 = () => {
  for (let i = 0; i < 10 * stats.curse; i++) {
    const spawnPos = getRandomSpawnPos(player);
    // createWalker(spawnPos.x, spawnPos.y);
    //   createCharger(spawnPos.x, spawnPos.y);
    // // createTank(spawnPos.x, spawnPos.y + 100);

    // createJuggernaut(spawnPos.x, spawnPos.y + 100);
    // createJuggernaut(spawnPos.x, spawnPos.y + 200);
    // createNerfer(spawnPos.x, spawnPos.y);

    createMarcher(spawnPos.x + i * 25, spawnPos.y);
  }
};
