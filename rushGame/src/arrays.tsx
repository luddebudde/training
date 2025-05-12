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
import { createSquareBosses } from "./bosses/squareBoss";

export let entities = [];
export let bullets = [];
export let squares = [];
export const lines = [];
export const blackholes = [];

const firstWave = [
  // createSprayerBoss,
  // createChargerBoss,
  // createLineBreakerBoss,

  // createRainerBoss,

  // createRainerBoss,
  // createBonkerBoss,
  // createTwinBoss,
  createBonkerBoss,

  // createCreateSquareBosses,
];
const secondWave = [
  // createSprayerBoss,
  // createChargerBoss,
  createTwinBoss,
  createBonkerBoss,
  createRainerBoss,
  // createBonkerBoss
];
const thirdWave = [createTwinBoss, createSquareBosses];
const fourthWave = [];
const waveOrder = [firstWave, secondWave, thirdWave, fourthWave];

let currentWaveIndex = 0;
export let bossPool = [...waveOrder[currentWaveIndex]];
export let liveBosses = [];

export const spawnDelay = 1500;

export let bossesKilled = 0;

export const nextBoss = (ctx) => {
  console.log(player.health, player.maxHealth);

  // generateRewards();
  let boss = randomArrayElementSplice(bossPool);

  if (boss === undefined) {
    nextFloorBoss(ctx);
  }

  const abilities = player.unlockedAbilities;

  abilities.bonusLifeCount +=
    abilities.bonusLife === true && abilities.bonusLifeCount === 0 ? 1 : 0;

  boss(ctx);
};

const nextFloorBoss = (ctx) => {
  currentWaveIndex++;

  bossPool = [...waveOrder[currentWaveIndex]];

  if (bossPool === undefined) {
    console.log("YOU WON");

    player.size = 154;
    player.speed = -player.speed;
  }

  generateRewards(ctx);
};

export const checkArrayRemoval = (ctx) => {
  entities = entities.filter((entity) => entity.health > 0);
  squares = squares.filter(
    (square) => square.health > 0 || square.health === undefined
  );

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
          nextBoss(ctx);
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
