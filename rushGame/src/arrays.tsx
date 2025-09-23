import { world } from "./basics";
import { createChargerBoss } from "./bosses/charger";
import { createSprayerBoss } from "./bosses/sprayer";
import { createTwinBoss } from "./bosses/twins";
import { player } from "./createPlayer";
import { drawHealthBar } from "./draw/drawHealthbar";
import { generateRewards } from "./generateRewards";
import { randomArrayElementSplice } from "./randomArrayElement";
import { createRainerBoss } from "./bosses/rainer";
import { createLineBreakerBoss } from "./bosses/lineBreaker";
import { createSquareBosses } from "./bosses/squareBoss";
import { createRandomerBoss } from "./bosses/randomer";
import { createPacificBoss } from "./bosses/pacific";
import {
  // changeMenuState,
  practiceBoss,
} from "./react/practiceMenu";
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

export type BossArray = [string, string, (ctx) => void];

// 1st is name
// 2nd is image
// 3rd is function
const sprayerArray: BossArray = ["Sprayer", "", createSprayerBoss];
const chargerArray: BossArray = ["Charger", "", createChargerBoss];
const lineBreakerArray: BossArray = ["Line-breaker", "", createLineBreakerBoss];
const randomerArray: BossArray = ["Randomer", "", createRandomerBoss];
const pacificArray: BossArray = ["Pacific", "", createPacificBoss];
const rainerArray: BossArray = ["Rainer", "", createRainerBoss];
const twinArray: BossArray = ["The Twin Bros", "", createTwinBoss];
const squareArray: BossArray = ["Squa's gang", "", createSquareBosses];

const splitterArray: BossArray = ["Splitter", "", createSplitterBoss];
const encirclerArray: BossArray = ["Encircler", "", createEncirclerBoss];
const createCentralBaseArray: BossArray = [
  "Central Base",
  "",
  createCentralBaseBoss,
];
const sideSweeperArray: BossArray = ["Side <= Sweeper", "", createSideSweeper];
const wandererArray: BossArray = ["Wanderer", "", createWanderer];
const levelSeekerArray: BossArray = ["Level Seeker", "", createLevelSeekerBoss];
const grenadierArray: BossArray = ["Grenadier", "", createGrenadier];
const centralDividerArray: BossArray = [
  "Central Divider",
  "",
  createCentralDividerBoss,
];
const deiatArray: BossArray = ["The Deiat", "", createDeiat];

const firstWave = [chargerArray, sprayerArray, wandererArray, rainerArray];
// const firstWave = [centralDividerArray];
const secondWave = [
  lineBreakerArray,
  levelSeekerArray,
  createCentralBaseArray,
  splitterArray,
];
const thirdWave = [twinArray, encirclerArray, pacificArray];
const fourthWave = [centralDividerArray, sideSweeperArray];
const fifthWave = [squareArray, grenadierArray, randomerArray];
const sixthWave = [deiatArray];
export const waveOrder = [
  firstWave,
  secondWave,
  thirdWave,
  fourthWave,
  fifthWave,
  sixthWave,
];

let waveIndex = 0;
export let bossPool = [...waveOrder[waveIndex]];
export let liveBosses = [];

export const spawnDelay = 1500;
// export const spawnDelay = 15;

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
