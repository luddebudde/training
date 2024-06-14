// Must fix bug where weapons gets infinitly stronger when restarting the game
// Make the start and "startgame" function better
// Fix text when movement and other stats are below 5 and multiplies by 100 for %
// Remove objects from all arrays, and not just some
// Make background
// Make world specific waves
// More characters & way to unlock them

// Text above defeated bosses, counting down to the final
// Make enemies collide with eachother
// Chest menu fix
// Upgrade selection menu fix
// Fix bug where "health nerfers" will kill you even if you get revived or restarting without getting hit

// Add thunder weapon which will increase fear for all enemies
import { aimBullet } from "./weapons/createAimBullet.js";
import {
  screenSizeMultipler as screenSizeMultiplier,
  world,
  worldsizeMultiplier as worldsizeMultiplier,
} from "./world.js";

import { createWalker } from "./enemies/createWalker.js";
import { doCirclesOverlap } from "./doCirlceOverlap.js";
import { spawnEnemy } from "./spawnEnemy.js";
import { loopPerSecond } from "./basic.js";
import { shootWeapons } from "./shootWeapons.js";
import { createShotgun, shotgun } from "./weapons/createShotgun.js";
import { keyDownTracker, oneTimeKeyPress } from "./keyDownTracker.js";
import { createPlayer, currentCharacter } from "./createPlayer.js";
import { getRandomSpawnPos } from "./getRandomSpawnPos.js";
import { createXp } from "./createXP.js";
import { createCharger } from "./enemies/createCharger.js";
import { holyArea, holyAreaBody } from "./weapons/createHolyArea.js";
import { vector } from "./vectors.js";
import { resetStats, stats } from "./stats.js";
import { drawHealthBar } from "./draw/drawHealthbar.js";
import { drawXpBar } from "./draw/drawXpBar.js";
import {
  playBossDefeat,
  playDeathSound,
  playLevelUp as playLevelUp,
  playLevelUpSpecial,
  universalVolume,
} from "./sounds.js";
import { drawText } from "./draw/drawText.js";
import { drawObject } from "./draw/drawObject.js";
import { levelUpSelection, totalWeapons } from "./menu/levelUpSelection.js";
import { checkButtonPress } from "./checkButtonPress.js";
import { minigun } from "./weapons/createMinigun.js";
import { loadImage } from "./image.js";
import { drawSquare } from "./draw/drawSquare.js";
import { isPointInsideArea } from "./isInsideRectangle.js";
import { wiper } from "./weapons/wiper.js";
import { randomAimBullet } from "./weapons/spreader.js";
import { axe } from "./weapons/createAxe.js";
import { createExplosion } from "./createExplosion.js";
import {
  changeMusic,
  changeVolume,
  fadeOutMusic,
  gameMusicList,
  musicAudio,
  normalMusic,
  playMusic,
  restoreMusicVolume,
  startMusicOver,
  stopMusic,
} from "./changeMusic.js";
import { createSumXp } from "./createSumXP.js";
import { airstrike } from "./weapons/createAirstrike.js";
import { selfImpaler } from "./weapons/selfImpaler.js";
import { checkRegen } from "./checkRegen.js";
import { drawShieldbar } from "./draw/drawShieldbar.js";
import { dealDamage } from "./dealDamage.js";
import { levelUp } from "./levelUp.js";
import { deathMenu } from "./menu/deathMenu.js";
import { getNextElement } from "./getNextElement.js";
import { statistics } from "./statistics.js";
import { showStatistics } from "./menu/showStatistics.js";
import { cherry } from "./weapons/cherry.js";
import { createCollector } from "./pickups/collector.js";
import { createBlank } from "./pickups/blank.js";
import { createTank } from "./enemies/createTank.js";
import { createNerfer } from "./enemies/createNerfer.js";
import { createPickupWeapon } from "./pickups/pickupWeapon.js";
import { createWalkerBoss } from "./enemies/createWalkerBoss.js";
import { dropChest } from "./dropChest.js";
import { chestMenu } from "./menu/chestMenu.js";
import {
  bossType,
  bossWaves,
  enemyAmountMultiplier,
  wave1,
  wave2,
  wave3,
  wave4,
  wave5,
  wavesList,
} from "./waves.js";
import { drawPointingArrow } from "./drawPointingArrow.js";
import { createEgg } from "./createEgg.js";
import { placeEggMap } from "./eggMap.js";
import { droper } from "./weapons/createDroper.js";
import { createShooterBoss } from "./enemies/createShooterBoss.js";
import { mainMenu } from "./menu/mainMenu.js";
import { showGameStatistics } from "./menu/showGameStatistics.js";
import { characterSelection } from "./menu/characterSelection.js";
import { mapSelection } from "./menu/mapSelection.js";
import {
  changeCurrentMap,
  currentMap,
  drawBackground,
  hardMap,
} from "./maps/standardMap.js";
import { removeFromArrays } from "./removeFromArrays.js";
import { createMarcherBoss } from "./enemies/createMarcherBoss.js";
import {
  burningAnimation,
  burningAnimationStat,
  flamethrower,
} from "./weapons/flameThrower.js";
import { devistator } from "./weapons/devistator.js";
import { stunner } from "./weapons/stunner.js";
import { bouncer } from "./weapons/bouncer.js";
import {
  applyKnockback,
  checkKnockbackCounter,
  knockbackEnemies,
} from "./applyKnockback.js";
import { createDemonBoss } from "./enemies/createDemonBoss.js";
import { createBlueCompute } from "./enemies/computes/createBlueCompute.js";
import { createBlueComputeBoss } from "./enemies/computes/createBlueComputeBoss.js";
import { createGreyComputeBoss } from "./enemies/computes/createGreyComputeBoss.js";
import { createRedComputeBoss } from "./enemies/computes/createRedComputeBoss.js";
import { getDistance } from "./makeDirection.js";
import { pusher } from "./weapons/pusher.js";

export const canvas = document.getElementById("theCanvas");
export const ctx = canvas.getContext("2d");

export let enemies = [];
export let entities = [];
export const bosses = [];
export const blankImmune = [];

export const createEnemies = [createWalker];

export let xps = [];
export const chests = [];

export let bullets = [];
export let areaEffects = [];

export let updateables = [];

export let weapons = [
  // aimBullet,
  // holyArea,
  // minigun,
  // wiper,
  // randomAimBullet,
  // axe,
  // airstrike,
  // selfImpaler,
];
export let printWeapons = [
  // holyAreaBody
];

export let maxAmountOfWeapons = 6;

export const buttons = [];
export const drawingSquares = [];

export let player = 0;

export const players = [];

// entities.push(player);

export const targetables = [];
export const movable = [];

export const pickupTypes = [];
export const pickups = [];

export const mapObjects = [];

export const drawingCircles = [
  // holyAreaBody
];

export let worldObjects = [
  printWeapons,
  entities,
  bullets,
  xps,
  areaEffects,
  targetables,
  pickups,
  chests,
  mapObjects,
  drawingCircles,
];
const worldObjectsLenght = worldObjects.length;

let oldHealth = player.health;

// let oldTime = Date.now();

let burningEntities = [];

export const allArrays = [
  enemies,
  entities,
  targetables,
  pickups,
  mapObjects,
  drawingSquares,
  buttons,
  bullets,
  areaEffects,
  bosses,
  xps,
  chests,
  burningEntities,
  updateables,
];

// const worldArrays = [entities, worldObjects, bullets];

export let mousePos = {
  x: 0,
  y: 0,
};

export const assets = {
  // astronaut: loadImage("/ships/player/astronaut.png"),
  playButton: await loadImage("public/sprites/playButton1.png"),
  skull: await loadImage("public/sprites/skull.png"),
  goldBag: await loadImage("public/sprites/goldbag.png"),
  blue: await loadImage("public/sprites/blue.png"),
  red: await loadImage("public/sprites/red.png"),
  shooter: await loadImage("public/sprites/shooters.png"),
  limbots: await loadImage("public/sprites/limbot.png"),
  blueCompute: await loadImage("public/sprites/compute.png"),
  redCompute: await loadImage("public/sprites/redCompute.png"),
  greyCompute: await loadImage("public/sprites/greyCompute.png"),
  wisp: await loadImage("public/animations/wisp.png"),
  egg: await loadImage("public/sprites/egg.png"),
  oilStain: await loadImage("public/sprites/oil_stain1.png"),
  cherry: await loadImage("public/sprites/cherry.png"),
  collector: await loadImage("public/sprites/collector.png"),
  // assault: loadImage(`ships/player/large/assault.png`),
  // fighter: loadImage(`ships/player/large/green.png`),
  rhino: await loadImage(`public/ships/player/large/green-rhino.png`),
  jet: await loadImage("public/animations/jet-even.png"),
  explosion: await loadImage("public/animations/explosion.png"),
  fire: await loadImage("public/animations/fireAnimation.gif"),
  flame: await loadImage("public/animations/flaming.png"),
  slice: await loadImage("public/animations/slice.png"),
  comet: await loadImage("public/animations/comet.png"),
  marcher: await loadImage("public/animations/marcher_rotated.png"),
  bigFireball: await loadImage("public/sprites/bigFireball.png"),
  lasers: {
    small: await loadImage("public/sprites/chargedShot_Small.gif"),
    medium: await loadImage("public/sprites/chargedShot_Medium.gif"),
    large: await loadImage("public/sprites/chargedShot_Large.gif"),
    huge: await loadImage("public/sprites/chargedShot_Huge.gif"),
  },
  demon: {
    attack: await loadImage("public/animations/demon/ATTACK.png"),
    death: await loadImage("public/animations/demon/DEATH.png"),
    flying: await loadImage("public/animations/demon/FLYING.png"),
    idle: await loadImage("public/animations/demon/IDLE.png"),
    appear: await loadImage("public/animations/demon/APPEAR.png"),
  },
};
export const backgrounds = {
  rocks: await loadImage("public/background/rocks.png"),
  castle: await loadImage("public/background/castle.png"),
  forest: await loadImage("public/background/forest.png"),
};

canvas.addEventListener("mousemove", (event) => {
  mousePos = {
    x: event.offsetX,
    y: event.offsetY,
  };
});

// createPickupWeapon(100, 100, randomAimBullet);

// const myButton = document.getElementById("myButton");

// Lägg till en händelsedetektor för musklick
document.addEventListener("click", function (event) {
  const mouseX = event.clientX;
  const mouseY = event.clientY;

  const x = checkButtonPress(mouseX, mouseY);
});

export let scrollChange = {
  x: 0,
  y: 0,
};

export const handleMouseWheel = (event) => {
  // Hämta scrollhastigheten från eventet
  const scrollSpeed = event.deltaY;

  scrollChange.y += scrollSpeed;
};

document.addEventListener("wheel", handleMouseWheel);

export let isMouseDown = false;

document.onmousedown = function (event) {
  // Kontrollera om vänsterknappen trycks ned
  if (event.button === 0) {
    isMouseDown = true;
  }
};

document.onmouseup = function (event) {
  // Kontrollera om vänsterknappen släpps
  if (event.button === 0) {
    isMouseDown = false;
  }
};
let currentMusicIndex = 0;

let spawnRate = 50 / stats.curse;
let spawnCooldown = spawnRate;

let currentWave;

// const waveOne = () => {
//   for (let i = 0; i < 5 * stats.curse; i++) {
//     const spawnPos = getRandomSpawnPos(player);
//     createWalker(spawnPos.x, spawnPos.y);
//     createCharger(spawnPos.x, spawnPos.y);
//   }
// };

// let currentWave = () => {};

let isPause = true;

let menuTime = 0;
let startMenuTime = Date.now();
let stopMenuTime = 0;

export const pause = () => {
  isPause = true;
  startMenuTime = Date.now();
};

export const start = () => {
  isPause = false;
  stopMenuTime = Date.now();
  menuTime += stopMenuTime - startMenuTime;
};
export const reverse = () => {
  isPause = !isPause;
};

// const wavesList = [wave1, wave2, wave3, wave4, wave5];

// document.body.addEventListener("mousemove", playMusic);

export let timer = 0;

let canChangeMusic = true;
let canFlamethrowerMode = true;

let oldTime;

let maxEnemyCount = (20 * stats.curse) / 3;
const enemyFactor = 200;

let weaponKills;

let canChangeWave = true;
let waveIndex = -1;

export const startGame = () => {
  // console.log(worldsizeMultiplier);
  // stats = currentCharacter.stats;
  // (stats.growth = currentCharacter.stats.growth),
  //   (stats.greed = currentCharacter.stats.growth),
  //   (stats.movementSpeed = currentCharacter.stats.movementSpeed),
  //   (stats.maxHealth = currentCharacter.stats.maxHealth),
  //   (stats.regeneration = currentCharacter.stats.regen),
  //   (stats.armor = currentCharacter.stats.armor),
  //   (stats.damage = currentCharacter.stats.damage),
  //   (stats.area = currentCharacter.stats.area * worldsizeMultiplier),
  //   (stats.speed = currentCharacter.stats.speed * worldsizeMultiplier),
  //   (stats.curse = currentCharacter.stats.curse),
  //   (stats.cooldown = currentCharacter.stats.cooldown),
  resetStats(currentCharacter);
  oldTime = Date.now();

  bullets.length = 0;
  entities.length = 0;
  enemies.length = 0;
  targetables.length = 0;

  player = createPlayer();
  targetables.push(player);
  players.push(player);

  for (let i = 0; i < 3; i++) {
    const maxDistance = 10000;
    const spawnWidth = -maxDistance + Math.random() * (2 * maxDistance);
    const spawnHeight = -maxDistance + Math.random() * (2 * maxDistance);

    createEgg(spawnWidth, spawnHeight);
  }

  placeEggMap(0, -5000);

  enemies.length = 0;
  entities.length = 0;
  entities.push(player);

  player.speedMult = 1;

  maxAmountOfWeapons = 6;
  weaponKills = 0;

  currentWave = wavesList[0];
  waveIndex = -1;

  pickupTypes.push(createCollector, createBlank);

  for (const key in statistics.overall) {
    if (Object.hasOwnProperty.call(statistics.overall, key)) {
      const value = statistics.overall[key];
      // Gör något med varje egenskap och dess värde
      statistics.overall[key] = 0;
      // console.log(key + ": " + value);
    }
  }

  maxEnemyCount = (enemyFactor * stats.curse) / 3;
  weapons = [
    // currentCharacter.startingWeapon,
    aimBullet,
    holyArea,
    minigun,
    // wiper,
    randomAimBullet,
    // axe,
    // airstrike,
    // selfImpaler,
    cherry,
    // droper,
    // flamethrower,
    stunner,
    // devistator,
    // bouncer,
    pusher,
  ];

  // createCollector(100, 100);

  totalWeapons.forEach((weapon) => {
    weapon.upgrades.level = 0;
  });

  // mainMenu();
  // characterSelection();
  // mapSelection();
  // deathMenu();
  // showGameStatistics();
  // pause();

  // console.log(musicAudio.name);
  // if (musicAudio.name === ) {
  // changeMusic(normalMusic.fileName);
  restoreMusicVolume();
  // }
  startMusicOver();

  start();
  menuTime = 0;
};

// const startPlaying = () => {
//   mainMenu();
// };

// startPlaying();
// startGame();

const startMode = () => {
  changeVolume(0);
  // mainMenu();
  // showStatistics();
  // deathMenu();
  startGame();
  // chestMenu();
  // mapSelection();
  // showGameStatistics();
  // createShooterBoss();
  // createMarcherBoss();
};

startMode();
// showStatistics();

// createWalkerBoss(400, 400);
// createDemonBoss();
// createBlueComputeBoss();
// createRedComputeBoss();
// console.log(player);
// createGreyComputeBoss({ player });

// pause();

// dropChest(200, 200);

const deathAnimationTime = 3000;
// const deathAnimationTime = 0;

let stealthCounter = 0;
export let stealthMode = false;

const update = () => {
  ctx.beginPath();
  ctx.globalAlpha = 1;
  ctx.clearRect(0, 0, world.width, world.height);
  ctx.fillStyle = "white";
  ctx.fill();

  // ctx.drawImage(
  // backgrounds[currentMap.texture],
  //   -player.pos.x / 1,
  //   -player.pos.y / 1,
  //   world.width,
  //   world.height
  // );

  // ctx.drawImage(
  //   backgrounds[currentMap.textures],
  //   0,
  //   0,
  //   world.width,
  //   world.height
  // );

  drawBackground(ctx, player, world, backgrounds);

  spawnRate = 50 / stats.curse;
  maxEnemyCount = ((enemyFactor * stats.curse) / 3) * enemyAmountMultiplier;

  checkRegen();

  const currentTime = Date.now();
  timer = (currentTime - oldTime - menuTime) / 1000;

  // console.log(wavesList);

  if (Math.floor(timer) % 60 === 0 && canChangeWave) {
    canChangeWave = false;
    setTimeout(() => {
      if (wavesList[waveIndex + 1] !== undefined) {
        canChangeWave = true;
        waveIndex += 1;

        currentWave = wavesList[waveIndex];

        if (bossWaves[waveIndex - 1] !== undefined) {
          bossType[waveIndex - 1]();
        }
      }
    }, 1000);
  }

  const minutes = Math.floor(timer / 60);
  const seconds = Math.floor(timer % 60);

  const formattedSeconds = seconds < 10 ? "0" + seconds : seconds;

  const timerText = minutes + ":" + formattedSeconds;

  drawText(
    timerText,
    world.width / 2,
    100 * screenSizeMultiplier.y,
    "red",
    worldsizeMultiplier
  );

  // console.log(enemies.length);

  if (enemies.some((enemy) => enemy.name === "stealth")) {
    stealthCounter++;

    if (stealthCounter % (loopPerSecond * 15) > loopPerSecond * 7) {
      // console.log("stealth enable");
      stealthMode = true;
    } else {
      // console.log("stealth disable");
      stealthMode = false;
    }
  }

  if (isKeyDown("KeyW")) {
    player.pos.y -= player.speed * player.speedMult;
    // moveCtx.y += player.speed;
  }
  if (isKeyDown("KeyS")) {
    player.pos.y += player.speed * player.speedMult;
    // moveCtx.y -= player.speed;
  }
  if (isKeyDown("KeyA")) {
    player.pos.x -= player.speed * player.speedMult;
    // moveCtx.x += player.speed;
  }
  if (isKeyDown("KeyD")) {
    player.pos.x += player.speed * player.speedMult;
    // moveCtx.x -= player.speed;
  }

  if (isKeyDown("Escape")) {
    isPause = !isPause;
  }

  if (isKeyDown("Space")) {
    isPause = true;
  }
  if (isKeyDown("KeyQ")) {
    xps.length = 0;
  }
  if (isKeyDown("KeyZ")) {
    stopMusic();
  }
  if (isKeyDown("KeyL")) {
    changeCurrentMap(hardMap);
  }

  if (isKeyDown("KeyX") && canChangeMusic) {
    const nextElement = getNextElement(gameMusicList, currentMusicIndex);
    currentMusicIndex += 1;

    console.log(nextElement);

    changeMusic(nextElement.fileName);
    changeVolume(nextElement.volume);

    canChangeMusic = false;
    setTimeout(() => {
      canChangeMusic = true;
    }, 500);
  }

  if (isKeyDown("KeyR")) {
    if (weapons.includes(flamethrower) && canFlamethrowerMode) {
      // console.log("flaame!");
      flamethrower.modeValue++;

      canFlamethrowerMode = false;
      setTimeout(() => {
        canFlamethrowerMode = true;
      }, 500);
    }
  }

  if (isKeyDown("ArrowUp")) {
    const totalAmount = xps.reduce((sum, xp) => sum + xp.amount, 0);

    xps.length = 0;

    player.xp.amount += totalAmount;
  }

  // weaponKills = 0;
  weapons.forEach((weapon, index) => {
    weapon.cooldown -= 1;
    weapon.update?.();

    if (weapon.cooldown <= 0 && player.health > 0) {
      weapon.cooldown = weapon.attackIntervall;
      weapon.attack?.();
    }

    drawText(
      weapon.name,
      80 * screenSizeMultiplier.x,
      52.5 * (index + 2) * screenSizeMultiplier.y,
      "green",
      worldsizeMultiplier
    );

    const buttonTextWidth = ctx.measureText(weapon.name).width;
    drawText(
      weapon.upgrades.level,
      buttonTextWidth + 100 * screenSizeMultiplier.x,
      52.5 * (index + 2) * screenSizeMultiplier.y,
      "black",
      worldsizeMultiplier
    );

    if (weapon.image !== undefined) {
      ctx.drawImage(
        weapon.image,
        20 * screenSizeMultiplier.x,
        (65 + 55 * index) * screenSizeMultiplier.y,
        50 * screenSizeMultiplier.x,
        50 * screenSizeMultiplier.y
      );
    }

    // weaponKills += weapon.statistics.killCount;
  });
  // statistics.overall.killCount = weaponKills;
  if (enemies.length <= maxEnemyCount) {
    currentWave();
  }

  entities.forEach((entity) => {
    entity.update?.();

    if (entity.health <= 0) {
      createXp(entity.pos.x, entity.pos.y, entity.xp);
    }

    // entities.forEach((entity2) => {
    //   if (doCirclesOverlap(entity, entity2)) {
    //     const force = {
    //       x: (entity.pos.x - entity2.pos.x) / 10,
    //       y: (entity.pos.y - entity2.pos.y) / 10,
    //     };
    //     console.log(force);
    //     entity.pos.x += force.x;
    //     entity.pos.y += force.y;

    //     entity2.pos.x -= force.x;
    //     entity2.pos.y -= force.y;
    //   }
    // });
  });

  xps.forEach((xp) => {
    if (doCirclesOverlap(xp, player)) {
      player.xp.amount += xp.amount;

      xp.destroy = true;
    }
  });

  const amountOfXp = 500;

  if (xps.length > amountOfXp) {
    let totalAmount = 0;

    xps.forEach((xp, index) => {
      if (index > amountOfXp) {
        totalAmount += xp.amount;
      }
    });

    const chosenXp = {
      name: "chosenXp",
      radius: xps[0].radius,
      amount: totalAmount,
      // color: "red",
      pos: {
        x: xps[0].pos.x,
        y: xps[0].pos.y,
      },
    };

    xps.length = amountOfXp;
    xps.splice(amountOfXp, 1);
    createSumXp(chosenXp.pos.x, chosenXp.pos.y, totalAmount, chosenXp.radius);
    // xps[0] = chosenXp;
    // xps.push(chosenXp);
    // console.log(totalAmount);
  }

  if (player.xp.amount >= player.xp.nextLevel) {
    levelUp();
    pause();
  }

  chests.forEach((chest, index) => {
    // drawPointingArrow(ctx, player, chest, "black");
    // console.log(chest.pos.x);
    if (doCirclesOverlap(player, chest)) {
      chestMenu();
      // chests.splice(index, 1);
      removeFromArrays(chest);
    }
  });

  // Make explosion.foreach more smooth in here
  enemies.forEach((enemy) => {
    if (
      !isPointInsideArea(
        enemy.pos.x,
        enemy.pos.y,
        player.pos.x - world.width / 2 - 200,
        player.pos.y - world.height / 2 - 200,
        world.width + 400,
        world.height + 400
      )
    ) {
      if (!bosses.includes(enemy) && !blankImmune.includes(enemy)) {
        // enemy.health = 0;
        dealDamage(enemy, "instant", enemy.health);
        // Tar bort fienden
      } else {
        const spawnPos = getRandomSpawnPos();
        enemy.pos = spawnPos;
      }
    }
  });

  bosses.forEach((boss, index) => {
    drawPointingArrow(ctx, player, boss);
    boss.ability();
    if (boss.health <= 0) {
      playBossDefeat();
      bosses.splice(index, 1);

      dropChest(boss.pos.x, boss.pos.y);
    }
  });

  if (Math.random() * loopPerSecond * 300 < loopPerSecond) {
    const spawnPos = getRandomSpawnPos();

    const chosenPickupType =
      pickupTypes[Math.floor(Math.random() * pickupTypes.length)];

    chosenPickupType(spawnPos.x, spawnPos.y);
  }

  entities = entities.filter((entity) => entity.health > 0);
  enemies = enemies.filter((enemy) => enemy.health > 0);
  burningEntities = burningEntities.filter((entity) => entity.health > 0);
  updateables = updateables.filter((updateable) => updateable?.health > 0);
  bullets = bullets.filter((bullet) => !bullet.destroy);
  areaEffects = areaEffects.filter((explosion) => !explosion.hasExpired);

  xps = xps.filter((xp) => !doCirclesOverlap(player, xp));

  areaEffects.forEach((areaEffect) => {
    entities.forEach((entity) => {
      if (
        doCirclesOverlap(areaEffect, entity) &&
        areaEffect.team !== entity.team
      ) {
        areaEffect.onHit(areaEffect, entity);
      }
    });
  });

  bullets.forEach((bullet) => {
    entities.forEach((entity) => {
      if (doCirclesOverlap(entity, bullet) && bullet.team !== entity.team) {
        if (!bullet.enemiesHit.includes(entity)) {
          dealDamage(
            entity,
            bullet.damageType !== undefined ? bullet.damageType : "kinetic",
            bullet.damage,
            bullet.weapon
          );

          if (!knockbackEnemies.includes(entity)) {
            // console.log(entity);
            applyKnockback(entity, 0.1, bullet.knockback);
          }
          entity.hit?.();
          bullet.hit?.();

          bullet.enemiesHit.push(entity);
        }

        if (bullet.enemiesHit?.length >= bullet.pierce + 1) {
          bullet.destroy = true;
        }
      }
    });
    if (bullet.pos.x + bullet.radius >= player.pos.x + world.width) {
      bullet.destroy = true;
    }
    if (bullet.pos.x - bullet.radius <= -world.width + player.pos.x) {
      bullet.destroy = true;
    }
    if (bullet.pos.y - bullet.radius <= -world.height + player.pos.y) {
      bullet.destroy = true;
    }
    if (bullet.pos.y + bullet.radius >= player.pos.y + world.height) {
      bullet.destroy = true;
    }
  });

  targetables.forEach((targetable, index) => {
    targetable.update?.(index);
    // target
  });

  updateables.forEach((object) => {
    object.update();
  });

  pickups.forEach((pickup, indexU) => {
    players.forEach((player, indexP) => {
      // console.log(player);
      if (doCirclesOverlap(pickup, player)) {
        pickup.effect(player);
        pickups.splice(indexU, 1);
      }
    });
  });

  drawingSquares.forEach((square) => {
    drawSquare(square);
  });

  if (weapons.includes(aimBullet)) {
    // Sikte
    ctx.beginPath();
    ctx.arc(mousePos.x, mousePos.y, 15, 0, 2 * Math.PI);
    ctx.fillStyle = player.color;
    ctx.fill();
  }

  ctx.translate(-player.pos.x, -player.pos.y);
  ctx.translate(world.width / 2, world.height / 2);

  worldObjects.length = worldObjectsLenght;

  // console.log(worldObjects);
  // console.log(worldObjects);
  // updateables.forEach((object) => {
  //   object?.update();
  // });

  worldObjects.forEach((gameObjects) => {
    // gameObjects.sort((a, b) => a.priority - b.priority);

    gameObjects.forEach((object) => {
      if (object.vel !== undefined) {
        const slowdownFactor =
          object.statusEffects !== undefined
            ? 1 - object.statusEffects.slow
            : 1;
        object.pos.x += object.vel.x * slowdownFactor;
        object.pos.y += object.vel.y * slowdownFactor;
      }

      // console.log(gameObjects);
      if (object.draw === undefined) {
        drawObject(ctx, object);
      } else {
        object.draw?.(ctx, assets, object);
        // drawText("helkl", object.x, object.y, "red");
      }
      if (object.statusEffects !== undefined) {
        if (object.statusEffects.oiled) {
          ctx.drawImage(
            assets.oilStain,
            object.pos.x - object.radius,
            object.pos.y - object.radius,
            object.radius * 2,
            object.radius * 2
          );
        }
        if (object.statusEffects.burning && !burningEntities.includes(object)) {
          burningEntities.push(object);

          object.counter = 0;
          object.animation = burningAnimation;
        }
      }
    });
  });

  burningEntities.forEach((entity) => {
    // entity.animation.step();

    let counterDirection = 1;

    // let counter = ;
    entity.counter += counterDirection;

    if (
      entity.counter >=
      burningAnimationStat.imageCount * burningAnimationStat.slowDown
    ) {
      entity.counter = 0;
    }

    entity.animation.draw(
      ctx,
      assets.fire,
      entity.pos.x - entity.radius / 1.2,
      entity.pos.y + entity.radius,
      entity.radius * 2,
      -entity.radius * 2,
      entity.counter
    );

    // console.log(animation);

    // const stepInfo = burningAnimation.step();

    // if (stepInfo) {
    //   burningAnimation.hasExpired = true;
    // }

    // entity.health -= 0.2;
  });

  knockbackEnemies.forEach((enemy, i) => {
    checkKnockbackCounter(enemy, i);
  });

  ctx.setTransform(1, 0, 0, 1, 0, 0);

  mapObjects.forEach((object) => {
    object.update?.();
    drawPointingArrow(ctx, player, object, object.arrowColor);
  });

  const UIStatistics = {
    goldKillYMargin: 100 * screenSizeMultiplier.y,
  };

  drawXpBar(0, 0, world.width, 50, player.xp.amount, player.xp.nextLevel);
  drawText(
    player.xp.level,
    world.width - 80 * screenSizeMultiplier.x,
    40 * screenSizeMultiplier.y,
    "green",
    worldsizeMultiplier
  );

  const goldtextX = world.width - 80;

  ctx.drawImage(
    assets.goldBag,
    0,
    0,
    211,
    239,
    goldtextX - 60 * screenSizeMultiplier.x,
    60 * screenSizeMultiplier.y,
    50 * screenSizeMultiplier.x,
    50 * screenSizeMultiplier.x
  );
  drawText(
    player.gold,
    goldtextX,
    UIStatistics.goldKillYMargin,
    "#ECF500",
    worldsizeMultiplier
  );

  ctx.drawImage(
    assets.skull,
    0,
    0,
    136,
    160,
    (world.width / 5) * 4 - 50 * screenSizeMultiplier.x,
    60 * screenSizeMultiplier.y,
    40 * screenSizeMultiplier.x,
    50 * screenSizeMultiplier.y
  );
  drawText(
    statistics.overall.kills,
    (world.width / 5) * 4,
    UIStatistics.goldKillYMargin,
    "black",
    worldsizeMultiplier
  );

  drawHealthBar(
    ctx,
    world.width / 2 - player.radius * 1.25,
    world.height / 2 +
      player.radius +
      player.radius * 0.25 * screenSizeMultiplier.y,
    player.radius * 2.5,
    15 * screenSizeMultiplier.y,
    player.health,
    stats.maxHealth
  );

  if (player.shield > 0) {
    // drawShieldbar(
    //   ctx,
    //   world.width / 2 - player.radius * 1.25,
    //   world.height / 2 + player.radius * 1.25,
    //   player.radius * 2.5,
    //   7,
    //   player.shield,
    //   player.maxShield
    // );
    drawShieldbar(
      ctx,
      world.width / 2 - player.radius * 1.25,
      world.height / 2 +
        player.radius +
        player.radius * 0.25 * screenSizeMultiplier.y,
      player.radius * 2.5,
      15 * screenSizeMultiplier.y,
      player.shield,
      player.maxShield
    );
  }

  if (player.health <= 0 && player.speedMult > 0) {
    player.speedMult = 0;

    playDeathSound();

    setTimeout(() => {
      fadeOutMusic(deathAnimationTime);
    }, 1000);

    setTimeout(() => {
      pause();
      deathMenu();
    }, deathAnimationTime);
  }

  oldHealth = player.health;

  worldObjects = [
    drawingCircles,
    entities,
    bullets,
    xps,
    printWeapons,
    areaEffects,
    targetables,
    pickups,
    chests,
    mapObjects,
  ];
};

setInterval(() => {
  if (!isPause) {
    update();
  }

  buttons.forEach((button) => {
    button.update?.();
  });
}, 1000 / loopPerSecond);

export const isKeyDown = keyDownTracker();
