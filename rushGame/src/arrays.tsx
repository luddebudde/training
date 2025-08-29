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
} from "./react/practiceMenu";
import App from "./react/mainMenu";
import { useMenu } from "./react/reactContext";
import { foughtBosses, statistics } from "./loseScreen";
import { createSplitterBoss } from "./bosses/splitter";
import { createEncirclerBoss } from "./bosses/encircler";
import { createCentralBaseBoss } from "./bosses/centralBase";
import { createSideSweeper } from "./bosses/sideSweeper";
import { createWanderer } from "./bosses/wanderer";
import { createLevelSeekerBoss } from "./bosses/levelSeeker";
import { createGrenadier } from "./bosses/grenadier";
import { createCentralDividerBoss } from "./bosses/centralDivider";
import { createDeiat } from "./bosses/deiat/deiatBoss";
import { winAnimation } from "./winAnimation";

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

const splitterArray = ["Splitter", "", createSplitterBoss];
const encirclerArray = ["Encircler", "", createEncirclerBoss];
const createCentralBaseArray = ["Central Base", "", createCentralBaseBoss];
const sideSweeperArray = ["Side <= Sweeper", "", createSideSweeper];
const wandererArray = ["Wanderer", "", createWanderer];
const levelSeekerArray = ["Level Seeker", "", createLevelSeekerBoss];
const grenadierArray = ["Grenadier", "", createGrenadier];
const centralDividerArray = ["Central Divider", "", createCentralDividerBoss];
const deiatArray = ["The Deiat", "", createDeiat];

const firstWave = [
  // deiatArray,
  // squareArray,
  // sideSweeperArray,
  // splitterArray,
  // encirclerArray,
  // createCentralBaseArray,
  // levelSeekerArray,
  // createNewRainerArray,
  // wandererArray,
  // levelSeekerArray,
  // grenadierArray,
  // centralDividerArray,
  // squareArray,
  // sprayerArray,
  // wandererArray,
  // squareArray,
  // sprayerArray,
  // chargerArray,
  // pacificArray,
  // twinArray,
  // lineBreakerArray,
  // randomerArray,
  // pacificArray,
  // rainerArray,
  // squareArray,
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
  // sprayerArray,
  // chargerArray,
  // pacificArray,
  // createTwinBoss,
  // createBonkerBoss,
  // createRainerBoss,
  // createBonkerBoss,
];
const thirdWave = [
  // twinArray, squareArray
];
const fourthWave = [deiatArray];
export const waveOrder = [firstWave, secondWave, thirdWave, fourthWave];

let waveIndex = 0;
export let bossPool = [...waveOrder[waveIndex]];
export let liveBosses = [];

// export const spawnDelay = 1500;
export const spawnDelay = 15;

export const nextBoss = (ctx) => {
  const abilities = player.unlockedAbilities;

  abilities.bonusLifeCount +=
    abilities.bonusLife === true && abilities.bonusLifeCount === 0 ? 1 : 0;

  let boss = randomArrayElementSplice(bossPool);

  if (boss === undefined) {
    nextFloorBoss(ctx);
  } else {
    setTimeout(() => {
      boss[2](ctx);
      bullets = bullets.filter((bullet) => bullet.team === "player");

      liveBosses.forEach((boss) => {
        if (!foughtBosses.includes(boss)) {
          foughtBosses.push(boss);
        }
      });

      // }, 2000);
    }, 20);
  }
};

const nextFloorBoss = (ctx) => {
  waveIndex++;

  if (waveOrder.length < waveIndex + 1) {
    setTimeout(() => {
      alert("You won... thank you for freeing us. Thank you");
      setTimeout(() => {
        winAnimation(player);
      }, 4500);
    }, 6000);
  } else {
    bossPool = [...waveOrder[waveIndex]];

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

    // console.log(metBossIndex);

    if (boss.health <= 0) {
      boss.timesDefeated += 1;
      boss?.deathAnimation?.(ctx, liveBosses, index);

      liveBosses.splice(index, 1);

      if (liveBosses.length === 0) {
        if (practiceBoss === true) {
          setTimeout(() => {
            if (window.changeMenu) {
              window.changeMenu("practice");
            }
          }, 3000);
          return;
        }

        bullets = bullets.filter((bullet) => bullet.team === "player");
        entities = entities.filter((entity) => entity.team === "player");
        blackholes.length = 0;

        // console.log("splcie");

        statistics.bossesKilled++;

        player.health = player.maxHealth;

        setTimeout(() => {
          nextBoss(ctx);
        }, spawnDelay);
      }
    }
  });
};

export const changeWaveIndex = (value: number) => {
  waveIndex = value;
  bossPool = [...waveOrder[waveIndex]];
};

// goTo.tsx:29 timeToReach 100
// goTo.tsx:30 newSpeed 9.859287146093175
// goTo.tsx:31 Time in sek 100000

// timeToReach 100
// goTo.tsx:30 newSpeed 5.8
// goTo.tsx:31 Time in sek 100000
