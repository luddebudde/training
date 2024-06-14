import { createCharger } from "./enemies/createCharger.js";
import { createBlueCompute } from "./enemies/computes/createBlueCompute.js";
import { createJuggernaut } from "./enemies/createJuggernaut.js";
import { createLimbots } from "./enemies/createLimbots.js";
import { createMarcher } from "./enemies/createMarcher.js";
import { createMarcherBoss } from "./enemies/createMarcherBoss.js";
import { createNerfer } from "./enemies/createNerfer.js";
import { createShooter } from "./enemies/createShooter.js";
import { createShooterBoss } from "./enemies/createShooterBoss.js";
import { createTank } from "./enemies/createTank.js";
import { createWalker } from "./enemies/createWalker.js";
import { createWalkerBoss } from "./enemies/createWalkerBoss.js";
import { createWisp } from "./enemies/createWisp.js";
import { getRandomSpawnPos } from "./getRandomSpawnPos.js";
import { bosses, player } from "./main.js";
import { createCollector } from "./pickups/collector.js";
import { stats } from "./stats.js";
import { createGreyComputeBoss } from "./enemies/computes/createGreyComputeBoss.js";
import { createRedComputeBoss } from "./enemies/computes/createRedComputeBoss.js";
import { createBlueComputeBoss } from "./enemies/computes/createBlueComputeBoss.js";
import { createStealth } from "./enemies/createStealth.js";

const computeBossList = [
  createBlueComputeBoss,
  createGreyComputeBoss,
  createRedComputeBoss,
];
const randomComputeBoss =
  computeBossList[Math.floor(Math.random() * computeBossList.length)];

console.log(randomComputeBoss);

export const bossWaves = [2, 4, 5, 1];
export const bossType = [
  // createShooterBoss,
  randomComputeBoss,
  // createWalkerBoss,
  // createMarcherBoss,
  // createShooterBoss,
];

export let enemyAmountMultiplier = 1;

export const wave1 = () => {
  for (let i = 0; i < 5 * stats.curse; i++) {
    const spawnPos = getRandomSpawnPos();
    createWalker(spawnPos.x, spawnPos.y);

    createCharger(spawnPos.x, spawnPos.y);
    createTank(spawnPos.x, spawnPos.y + 100);
    // createNerfer(spawnPos.x, spawnPos.y);

    createWisp(spawnPos.x, spawnPos.y);
    // createBlueCompute(spawnPos.x, spawnPos.y);

    createJuggernaut(spawnPos.x, spawnPos.y);

    createStealth(spawnPos.x, spawnPos.y);
  }
  // const spawnPos = getRandomSpawnPos(player);

  // createShooter(spawnPos.x, spawnPos.y);
  enemyAmountMultiplier = 10;
};

export const wave2 = () => {
  for (let i = 0; i < 4 * stats.curse; i++) {
    const spawnPos = getRandomSpawnPos();

    createWalker(spawnPos.x, spawnPos.y);

    // createTank(spawnPos.x, spawnPos.y + 100);
    // createNerfer(spawnPos.x, spawnPos.y);
  }
  const spawnPos = getRandomSpawnPos();
  createCharger(spawnPos.x, spawnPos.y);
};

export const wave3 = () => {
  for (let i = 0; i < 5 * stats.curse; i++) {
    const spawnPos = getRandomSpawnPos();
    // createWalker(spawnPos.x, spawnPos.y);
    //   createCharger(spawnPos.x, spawnPos.y);
    createTank(spawnPos.x, spawnPos.y + 100);

    // createNerfer(spawnPos.x, spawnPos.y);
  }
  const spawnPos = getRandomSpawnPos();

  createJuggernaut(spawnPos.x, spawnPos.y + 100);

  enemyAmountMultiplier = 1;
};

export const wave4 = () => {
  if (bosses.length === 0) {
    for (let i = 0; i < 1 * stats.curse; i++) {
      const spawnPos = getRandomSpawnPos();
      // createWalker(spawnPos.x, spawnPos.y);
      //   createCharger(spawnPos.x, spawnPos.y);
      createTank(spawnPos.x, spawnPos.y + 100);

      // createJuggernaut(spawnPos.x, spawnPos.y + 100);
      // createJuggernaut(spawnPos.x, spawnPos.y + 200);
      // createNerfer(spawnPos.x, spawnPos.y);
    }
    const spawnPos = getRandomSpawnPos();
    createMarcher(spawnPos.x, spawnPos.y);
    enemyAmountMultiplier = 0.5;
  }
};

export const wave5 = () => {
  if (bosses.length > 0) {
    for (let i = 0; i < 10 * stats.curse; i++) {
      const spawnPos = getRandomSpawnPos();
      // createWalker(spawnPos.x, spawnPos.y);
      //   createCharger(spawnPos.x, spawnPos.y);
      createTank(spawnPos.x, spawnPos.y + 100);

      // createJuggernaut(spawnPos.x, spawnPos.y + 100);
      // createJuggernaut(spawnPos.x, spawnPos.y + 200);
      createNerfer(spawnPos.x, spawnPos.y);

      // createMarcher(spawnPos.x + i * 25, spawnPos.y);
    }
  } else {
    const spawnPos = getRandomSpawnPos();
    // createShooter(spawnPos.x, spawnPos.y);
  }
  enemyAmountMultiplier = 1;
};

export const wave6 = () => {
  for (let i = 0; i < 10 * stats.curse; i++) {
    const spawnPos = getRandomSpawnPos();
    createWalker(spawnPos.x, spawnPos.y);
    createCharger(spawnPos.x, spawnPos.y);
    createTank(spawnPos.x, spawnPos.y + 100);

    createJuggernaut(spawnPos.x, spawnPos.y + 100);
    // createJuggernaut(spawnPos.x, spawnPos.y + 200);
    // createNerfer(spawnPos.x, spawnPos.y);

    // createMarcher(spawnPos.x + i * 25, spawnPos.y);
  }
  enemyAmountMultiplier = 3;
};

export const wave7 = () => {
  for (let i = 0; i < 10 * stats.curse; i++) {
    const spawnPos = getRandomSpawnPos();
    createWalker(spawnPos.x, spawnPos.y);
    // createCharger(spawnPos.x, spawnPos.y);
    // createTank(spawnPos.x, spawnPos.y + 100);

    // createJuggernaut(spawnPos.x, spawnPos.y + 100);
    // createJuggernaut(spawnPos.x, spawnPos.y + 200);
    // createNerfer(spawnPos.x, spawnPos.y);

    // createMarcher(spawnPos.x + i * 25, spawnPos.y);
  }
  enemyAmountMultiplier = 0;
};

export const wavesList = [wave1, wave2, wave3, wave4, wave5, wave6, wave7];
