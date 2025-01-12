import { world } from "./basics";
import { createChargerBoss } from "./bosses/charger";
import { createSprayerBoss } from "./bosses/sprayer";
import { drawHealthBar } from "./drawHealthbar";
import { createChaser } from "./enemies/chaser";
import { createRamper } from "./enemies/ramper";
import { createSniper } from "./enemies/shooter";
import { generateRewards } from "./generateRewards";
import {
  randomArrayElement,
  randomArrayElementSplice,
} from "./randomArrayElement";

export let entities = [];
export let bullets = [];

// const firstWave = [createSprayerBoss];
const firstWave = [createChargerBoss];
const secondWave = [createChaser, createSniper];
const waveOrder = [firstWave, secondWave];

let currentWaveIndex = 0;
export let bossPool = [...waveOrder[currentWaveIndex]];
// console.log(waveOrder[currentWaveIndex]);

export let liveBosses = [];

export const spawnDelay = 30000;

export const checkArrayRemoval = (ctx) => {
  liveBosses.forEach((boss, index) => {
    drawHealthBar(
      ctx,
      0,
      0 + 40 * index,
      world.width,
      30,
      boss.health,
      boss.maxHealth
    );

    if (boss.health <= 0) {
      boss?.deathAnimation?.(ctx, liveBosses, index);

      bullets = bullets.filter((bullet) => bullet.team === "player");

      console.log("splcie");

      liveBosses.splice(index, 1);

      setTimeout(() => {
        entities = entities.filter((entity) => entity.health > 0);
        spawnBoss();
      }, spawnDelay);
    }
  });
};

export const spawnBoss = () => {
  const nextboss = randomArrayElementSplice(bossPool);

  if (nextboss === undefined) {
    currentWaveIndex++;
    console.log("rteun");

    bossPool = [...waveOrder[currentWaveIndex]];
    console.log(bossPool);

    generateRewards();
  }

  const boss = nextboss();

  entities.push(boss);
  liveBosses.push(boss);
};
