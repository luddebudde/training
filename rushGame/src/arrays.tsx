import { world } from "./basics";
import { createChargerBoss } from "./bosses/charger";
import { createSprayerBoss } from "./bosses/sprayer";
import { createTwinBoss } from "./bosses/twins";
import { player } from "./createPlayer";
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
const firstWave = [
  createTwinBoss,
  // createSprayerBoss, createChargerBoss
];
const secondWave = [createChaser, createSniper];
const waveOrder = [firstWave, secondWave];

let currentWaveIndex = 0;
export let bossPool = [...waveOrder[currentWaveIndex]];
export let liveBosses = [];

export const spawnDelay = 30;

export let bossesKilled = 0;

export const checkArrayRemoval = (ctx) => {
  entities = entities.filter((entity) => entity.health > 0);

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
      bossesKilled++;

      player.health = player.maxHealth;

      setTimeout(() => {
        spawnBoss();
      }, spawnDelay);
    }
  });
};

export const spawnBoss = () => {
  const nextboss = randomArrayElementSplice(bossPool);

  console.log(nextboss);

  if (nextboss === undefined) {
    currentWaveIndex++;
    console.log("rteun");

    bossPool = [...waveOrder[currentWaveIndex]];
    console.log(bossPool);

    generateRewards();
  }

  const boss = nextboss();

  // entities.push(boss);
  // liveBosses.push(boss);
};
