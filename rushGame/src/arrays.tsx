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

export const spawnDelay = 1000;

export let bossesKilled = 0;

export const spawnBoss = () => {
  let nextboss = randomArrayElementSplice(bossPool);
  console.log(waveOrder[currentWaveIndex], "jhas");

  if (nextboss === undefined) {
    currentWaveIndex++;
    console.log(currentWaveIndex, waveOrder[currentWaveIndex]);

    bossPool = [...waveOrder[currentWaveIndex]];
    console.log(bossPool);

    nextboss = randomArrayElementSplice(bossPool);
  }

  // setTimeout(() => {
  const boss = nextboss();
  console.log(nextboss);
  // }, spawnDelay);
  // nextboss();

  // entities.push(boss);
  // liveBosses.push(boss);
};

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

      liveBosses.splice(index, 1);

      if (liveBosses.length === 0) {
        bullets = bullets.filter((bullet) => bullet.team === "player");

        console.log("splcie");

        bossesKilled++;

        player.health = player.maxHealth;

        setTimeout(() => {
          generateRewards();
        }, spawnDelay);
      }
    }
  });

  // if (liveBosses.length === 0) {
  //   bullets = bullets.filter((bullet) => bullet.team === "player");

  //   console.log("splcie");

  //   bossesKilled++;

  //   player.health = player.maxHealth;

  //   setTimeout(() => {
  //     spawnBoss();
  //   }, spawnDelay);
  // }
};
