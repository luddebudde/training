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
import { createRandomerBoss } from "./bosses/randomer";
import { createPacificBoss } from "./bosses/pacific";
import practiceMenu, {
  // changeMenuState,
  practiceBoss,
  showMenu,
} from "./react/practiceMenu";
import App from "./react/mainMenu";
import { useMenu } from "./react/reactContext";
import { meetBossIndex, statistics } from "./loseScreen";

export let entities = [];
export let bullets = [];
export let squares = [];
export const lines = [];
export const blackholes = [];

// 1st is name
// 2nd is image
// 3rd is function
const sprayerArray = ["Sprayer", "", createSprayerBoss];
const chargerArray = ["Charger", "", createChargerBoss];
const lineBreakerArray = ["Line-breaker", "", createLineBreakerBoss];
const randomerArray = ["Randomer", "", createRandomerBoss];
const pacificArray = ["Pacific", "", createPacificBoss];
const rainerArray = ["Rainer", "", createRainerBoss];
const twinArray = ["The Twin Bros", "", createTwinBoss];
const squareArray = ["Squa's gang", "", createSquareBosses];

const firstWave = [
  sprayerArray,

  lineBreakerArray,
  randomerArray,
  rainerArray,
  // createChargerBoss,
  // createLineBreakerBoss,
  // createRandomerBoss,
  // createPacificBoss,

  // createRainerBoss,

  // createRainerBoss,
  // createBonkerBoss,
  // createTwinBoss,
  // createBonkerBoss,

  // createCreateSquareBosses,
];
const secondWave = [
  // createSprayerBoss,
  sprayerArray,
  chargerArray,
  pacificArray,

  // createTwinBoss,
  // createBonkerBoss,
  // createRainerBoss,
  // createBonkerBoss,
];
const thirdWave = [twinArray, squareArray];
// const fourthWave = [];
export const waveOrder = [firstWave, secondWave, thirdWave];

let currentWaveIndex = 0;
export let bossPool = [...waveOrder[currentWaveIndex]];
export let liveBosses = [];

export const spawnDelay = 1500;

export const nextBoss = (ctx) => {
  const abilities = player.unlockedAbilities;

  abilities.bonusLifeCount +=
    abilities.bonusLife === true && abilities.bonusLifeCount === 0 ? 1 : 0;

  console.log(player.health, player.maxHealth);

  // generateRewards();
  let boss = randomArrayElementSplice(bossPool);

  if (boss === undefined) {
    nextFloorBoss(ctx);
  } else {
    setTimeout(() => {
      boss[2](ctx);

      liveBosses.forEach((boss) => {
        if (!meetBossIndex.includes(boss)) {
          meetBossIndex.push(boss);
        }
      });

      // }, 2000);
    }, 20);
  }
};

const nextFloorBoss = (ctx) => {
  currentWaveIndex++;

  if (waveOrder.length < currentWaveIndex + 1) {
    console.log("YOU WON");

    player.radius = 154;
    player.speed = -player.speed;
  } else {
    bossPool = [...waveOrder[currentWaveIndex]];

    generateRewards(ctx);
  }
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

    console.log(meetBossIndex);

    if (boss.health <= 0) {
      boss?.deathAnimation?.(ctx, liveBosses, index);

      liveBosses.splice(index, 1);

      if (liveBosses.length === 0) {
        if (practiceBoss === true) {
          setTimeout(() => {
            if (window.onBossDeath) {
              window.onBossDeath();
            }
          }, 3000);
          return;
        }

        bullets = bullets.filter((bullet) => bullet.team === "player");
        entities = entities.filter((entity) => entity.team === "player");

        console.log("splcie");

        statistics.bossesKilled++;

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
