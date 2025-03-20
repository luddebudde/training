import { world } from "./basics";
import { createChargerBoss } from "./bosses/charger";
import { createSprayerBoss } from "./bosses/sprayer";
import { createTwinBoss } from "./bosses/twins";
import { player } from "./createPlayer";
import { drawHealthBar } from "./drawHealthbar";
import { createChaser } from "./enemies/chaser";
import { createChargerEnemy } from "./enemies/chargerEnemy";
import { createSniper } from "./enemies/sniper";
import { generateRewards } from "./generateRewards";
import { randomArrayElementSplice } from "./randomArrayElement";
import { createBonkerBoss } from "./bosses/bonker";
import { createRainerBoss } from "./bosses/rainer";
import { createLineBreakerBoss } from "./bosses/lineBreaker";
import { createLargeSquareBoss } from "./bosses/squareBoss";

export let entities = [];
export let bullets = [];
export const squares = [];

const firstWave = [
  // createSprayerBoss,
  // createChargerBoss,
  // createRainerBoss,
  // createBonkerBoss,
  // createTwinBoss,
  // createLineBreakerBoss,
  createLargeSquareBoss,
];
const secondWave = [
  createSprayerBoss,
  // createChargerBoss,
  // createRainerBoss, createBonkerBoss
];
const thirdWave = [
  // createTwinBoss
];
const fourthWave = [];
const waveOrder = [firstWave, secondWave, thirdWave, fourthWave];

let currentWaveIndex = 0;
export let bossPool = [...waveOrder[currentWaveIndex]];
export let liveBosses = [];

export const spawnDelay = 1500;

export let bossesKilled = 0;

export const nextBoss = () => {
  console.log(player.health, player.maxHealth);

  // generateRewards();
  let boss = randomArrayElementSplice(bossPool);

  if (boss === undefined) {
    nextFloorBoss();
  }

  const abilities = player.unlockedAbilities;

  abilities.bonusLifeCount +=
    abilities.bonusLife === true && abilities.bonusLifeCount === 0 ? 1 : 0;

  boss();
};

const nextFloorBoss = () => {
  currentWaveIndex++;

  bossPool = [...waveOrder[currentWaveIndex]];

  if (bossPool === undefined) {
    console.log("YOU WON");

    player.size = 154;
    player.speed = -player.speed;
  }

  generateRewards();
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
        entities = entities.filter((entity) => entity.team === "player");

        console.log("splcie");

        bossesKilled++;

        player.health = player.maxHealth;

        setTimeout(() => {
          nextBoss();
        }, spawnDelay);
      }
    }
  });
};

// goTo.tsx:29 timeToReach 100
// goTo.tsx:30 newSpeed 9.859287146093175
// goTo.tsx:31 Time in sek 100000

// timeToReach 100
// goTo.tsx:30 newSpeed 5.8
// goTo.tsx:31 Time in sek 100000
