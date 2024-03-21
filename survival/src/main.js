// Must fix bug where weapons gets infinitly stronger when restarting the game
// Make the start and "startgame" function better

// Text above defeated bosses, counting down to the final
import { aimBullet } from "./weapons.js/createAimBullet.js";
import {
  squareSizeMultipler,
  world,
  worldsizeMultiplier as worldsizeMultiplier,
} from "./world.js";

import { createWalker } from "./enemies/createWalker.js";
import { doCirclesOverlap } from "./doCirlceOverlap.js";
import { spawnEnemy } from "./spawnEnemy.js";
import { loopPerSecond } from "./basic.js";
import { shootWeapons } from "./shootWeapons.js";
import { createShotgun, shotgun } from "./weapons.js/createShotgun.js";
import { keyDownTracker, oneTimeKeyPress } from "./keyDownTracker.js";
import { createPlayer, currentCharacter } from "./createPlayer.js";
import { getRandomSpawnPos } from "./getRandomSpawnPos.js";
import { createXp } from "./createXP.js";
import { createCharger } from "./enemies/createCharger.js";
import { holyArea, holyAreaBody } from "./weapons.js/createHolyArea.js";
import { vector } from "./vectors.js";
import { stats } from "./stats.js";
import { drawHealthBar } from "./draw/drawHealthbar.js";
import { drawXpBar } from "./draw/drawXpBar.js";
import {
  playBossDefeat,
  playLevelUp as playLevelUp,
  playLevelUpSpecial,
  universalVolume,
} from "./sounds.js";
import { drawText } from "./draw/drawText.js";
import { drawObject } from "./draw/drawObject.js";
import { levelUpSelection, totalWeapons } from "./levelUpSelection.js";
import { checkButtonPress } from "./checkButtonPress.js";
import { minigun } from "./weapons.js/createMinigun.js";
import { loadImage } from "./image.js";
import { drawSquare } from "./draw/drawSquare.js";
import { isPointInsideArea } from "./isInsideRectangle.js";
import { wiper } from "./weapons.js/wiper.js";
import { randomAimBullet } from "./weapons.js/createRandomAimBullet.js";
import { axe } from "./weapons.js/createAxe.js";
import { createExplosion } from "./createExplosion.js";
import {
  changeMusic,
  changeVolume,
  musicList,
  playMusic,
  stopMusic,
} from "./changeMusic.js";
import { createSumXp } from "./createSumXP.js";
import { airstrike } from "./weapons.js/createAirstrike.js";
import { selfImpaler } from "./weapons.js/selfImpaler.js";
import { checkRegen } from "./checkRegen.js";
import { drawShieldbar } from "./draw/drawShieldbar.js";
import { dealDamage } from "./dealDamage.js";
import { levelUp } from "./levelUp.js";
import { deathMenu } from "./deathMenu.js";
import { getNextElement } from "./getNextElement.js";
import { statistics } from "./statistics.js";
import { showStatistics } from "./showStatistics.js";
import { cherry } from "./weapons.js/cherry.js";
import { createCollector } from "./pickups/collector.js";
import { createBlank } from "./pickups/blank.js";
import { createTank } from "./enemies/createTank.js";
import { createNerfer } from "./enemies/createNerfer.js";
import { createPickupWeapon } from "./pickups/pickupWeapon.js";
import { createWalkerBoss } from "./enemies/createWalkerBoss.js";
import { dropChest } from "./dropChest.js";
import { chestMenu } from "./chestMenu.js";
import {
  bossType,
  bossWaves,
  wave1,
  wave2,
  wave3,
  wave4,
  wave5,
} from "./waves.js";

export const canvas = document.getElementById("theCanvas");
export const ctx = canvas.getContext("2d");

export let enemies = [];
export let entities = [];
export const bosses = [];

export const createEnemies = [createWalker];

export let xps = [];
export const chests = [];

export let bullets = [];
export let explosions = [];

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
  // holyArea.body
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

export let worldObjects = [
  printWeapons,
  entities,
  bullets,
  xps,
  explosions,
  targetables,
  pickups,
  chests,
];
const worldObjectsLenght = worldObjects.length;

let oldHealth = player.health;
// let oldTime = Date.now();

// const worldArrays = [entities, worldObjects, bullets];

export let mousePos = {
  x: 0,
  y: 0,
};

export const assets = {
  // astronaut: loadImage("/ships/player/astronaut.png"),
  skull: await loadImage("public/sprites/skull.png"),
  goldBag: await loadImage("public/sprites/goldbag.png"),
  blue: await loadImage("public/sprites/blue.png"),
  marcher: await loadImage("public/animations/marcher_rotated.png"),
  // assault: loadImage(`ships/player/large/assault.png`),
  // fighter: loadImage(`ships/player/large/green.png`),
  rhino: await loadImage(`public/ships/player/large/green-rhino.png`),
  jet: await loadImage("public/animations/jet-even.png"),
  explosion: await loadImage("public/animations/explosion.png"),
  comet: await loadImage("public/animations/comet.png"),
};

canvas.addEventListener("mousemove", (event) => {
  mousePos = {
    x: event.offsetX,
    y: event.offsetY,
  };
});

createPickupWeapon(100, 100, randomAimBullet);

const myButton = document.getElementById("myButton");

// Lägg till en händelsedetektor för musklick
document.addEventListener("click", function (event) {
  const mouseX = event.clientX;
  const mouseY = event.clientY;

  const x = checkButtonPress(mouseX, mouseY);
});

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

let isPause = false;

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

const wavesList = [wave1, wave2, wave3, wave4, wave5];

document.body.addEventListener("mousemove", playMusic);

let timer = 0;

let canChangeMusic = true;

let oldTime;

let maxEnemyCount = (20 * stats.curse) / 3;
const enemyFactor = 200;

let weaponKills;

export const startGame = () => {
  console.log(worldsizeMultiplier);
  // stats = currentCharacter.stats;
  (stats.growth = currentCharacter.stats.growth),
    (stats.greed = currentCharacter.stats.growth),
    (stats.movementSpeed = currentCharacter.stats.movementSpeed),
    (stats.maxHealth = currentCharacter.stats.maxHealth),
    (stats.regeneration = currentCharacter.stats.regen),
    (stats.armor = currentCharacter.stats.armor),
    (stats.damage = currentCharacter.stats.damage),
    (stats.area = currentCharacter.stats.area * worldsizeMultiplier),
    (stats.speed = currentCharacter.stats.speed * worldsizeMultiplier),
    (stats.curse = currentCharacter.stats.curse),
    (stats.cooldown = currentCharacter.stats.cooldown),
    (oldTime = Date.now());

  player = createPlayer();
  targetables.push(player);
  players.push(player);

  enemies.length = 0;
  entities.length = 0;
  entities.push(player);

  maxAmountOfWeapons = 6;
  weaponKills = 0;

  currentWave = wavesList[0];

  pickupTypes.push(createCollector, createBlank);

  // currentWave = () => {
  //   // const spawnPos = 0;
  //   for (let i = 0; i < 5 * stats.curse; i++) {
  //     const spawnPos = getRandomSpawnPos(player);
  //     createWalker(spawnPos.x, spawnPos.y);
  //     createCharger(spawnPos.x, spawnPos.y);
  //     createTank(spawnPos.x, spawnPos.y + 100);
  //     // createNerfer(spawnPos.x, spawnPos.y);
  //   }
  // };
  // maxEnemyCount = 3;
  createXp(-400, -400, 100000);

  maxEnemyCount = (enemyFactor * stats.curse) / 3;
  weapons = [
    // currentCharacter.startingWeapon,
    aimBullet,
    // holyArea,
    // minigun,
    // wiper,
    // randomAimBullet,
    // axe,
    airstrike,
    // selfImpaler,
    cherry,
  ];

  createCollector(100, 100);

  totalWeapons.forEach((weapon) => {
    weapon.upgrades.level = 0;
  });

  start();
};

startGame();

// showStatistics();

// createWalkerBoss(400, 400);
// pause();

let canChangeWave = true;
let waveIndex = -1;

dropChest(200, 200);

const update = () => {
  ctx.beginPath();
  ctx.globalAlpha = 1;
  ctx.clearRect(0, 0, world.width, world.height);
  ctx.fillStyle = "white";
  ctx.fill();

  spawnRate = 50 / stats.curse;
  maxEnemyCount = (enemyFactor * stats.curse) / 3;

  checkRegen();

  const currentTime = Date.now();
  timer = (currentTime - oldTime - menuTime) / 1000;

  if (Math.floor(timer) % 5 === 0 && canChangeWave) {
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

  drawText(
    Math.floor(timer),
    world.width / 2,
    100 * squareSizeMultipler.y,
    "red",
    worldsizeMultiplier
  );

  if (isKeyDown("KeyW")) {
    player.pos.y -= player.speed;
    // moveCtx.y += player.speed;
  }
  if (isKeyDown("KeyS")) {
    player.pos.y += player.speed;
    // moveCtx.y -= player.speed;
  }
  if (isKeyDown("KeyA")) {
    player.pos.x -= player.speed;
    // moveCtx.x += player.speed;
  }
  if (isKeyDown("KeyD")) {
    player.pos.x += player.speed;
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

  if (isKeyDown("KeyX") && canChangeMusic) {
    const nextElement = getNextElement(musicList, currentMusicIndex);
    currentMusicIndex += 1;

    changeMusic(nextElement.fileName);
    changeVolume(nextElement.volume);

    canChangeMusic = false;
    setTimeout(() => {
      canChangeMusic = true;
    }, 500);
    chestMenu();
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

    if (weapon.cooldown <= 0) {
      weapon.cooldown = weapon.attackIntervall;
      weapon.attack?.();
    }

    drawText(
      weapon.name,
      80 * squareSizeMultipler.x,
      52.5 * (index + 2) * squareSizeMultipler.y,
      "green",
      worldsizeMultiplier
    );

    const buttonTextWidth = ctx.measureText(weapon.name).width;
    drawText(
      weapon.upgrades.level,
      buttonTextWidth + 100 * squareSizeMultipler.x,
      52.5 * (index + 2) * squareSizeMultipler.y,
      "black",
      worldsizeMultiplier
    );

    if (weapon.image !== undefined) {
      ctx.drawImage(
        weapon.image,
        20 * squareSizeMultipler.x,
        (65 + 55 * index) * squareSizeMultipler.y,
        50 * squareSizeMultipler.x,
        50 * squareSizeMultipler.y
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

    if (
      doCirclesOverlap(holyAreaBody, entity) &&
      holyAreaBody.team !== entity.team
    ) {
      entity.vel = vector.alone.div(entity.vel, 4);
    }
  });

  xps.forEach((xp) => {
    if (doCirclesOverlap(xp, player)) {
      player.xp.amount += xp.amount;

      xp.destroy = true;
    }
  });

  const amountOfXp = 100;

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
    // console.log(chest.pos.x);
    if (doCirclesOverlap(player, chest)) {
      // player.xp.amount *= 100000;
      chestMenu();
      // pause();
      // console.log(chest);
      chests.splice(index, 1);
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
      enemy.health = 0;
      // Tar bort fienden
    }
  });

  bosses.forEach((boss, index) => {
    boss.ability();
    if (boss.health <= 0) {
      playBossDefeat();
      bosses.splice(index, 1);

      dropChest(boss.pos.x, boss.pos.y);
    }
  });

  if (Math.random() * loopPerSecond * 300 < loopPerSecond) {
    const spawnPos = getRandomSpawnPos(player);

    const chosenPickupType =
      pickupTypes[Math.floor(Math.random() * pickupTypes.length)];

    chosenPickupType(spawnPos.x, spawnPos.y);
  }

  entities = entities.filter((entity) => entity.health > 0);
  enemies = enemies.filter((enemy) => enemy.health > 0);
  bullets = bullets.filter((bullet) => !bullet.destroy);
  explosions = explosions.filter((explosion) => !explosion.hasExpired);

  xps = xps.filter((xp) => !doCirclesOverlap(player, xp));

  explosions.forEach((explosion) => {
    enemies.forEach((enemy) => {
      if (doCirclesOverlap(explosion, enemy)) {
        // enemy.health -= explosion.damage;
        dealDamage(enemy, "explosion", explosion.damage, explosion.weapon);
      }
    });
  });

  // console.log(explosions);

  bullets.forEach((bullet) => {
    entities.forEach((entity) => {
      if (doCirclesOverlap(entity, bullet) && bullet.team !== entity.team) {
        if (!bullet.enemiesHit.includes(entity)) {
          dealDamage(entity, "contact", bullet.damage, bullet.weapon);

          entity.hit?.();

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

  // Sikte
  ctx.beginPath();
  ctx.arc(mousePos.x, mousePos.y, 15, 0, 2 * Math.PI);
  ctx.fillStyle = player.color;
  ctx.fill();

  ctx.translate(-player.pos.x, -player.pos.y);
  ctx.translate(world.width / 2, world.height / 2);

  worldObjects.length = worldObjectsLenght;

  // console.log(worldObjects);
  // console.log(worldObjects);
  worldObjects.forEach((gameObjects) => {
    // gameObjects.sort((a, b) => a.priority - b.priority);

    gameObjects.forEach((object) => {
      if (object.vel !== undefined) {
        object.pos.x += object.vel.x;
        object.pos.y += object.vel.y;
      }

      // console.log(gameObjects);
      if (object.draw === undefined) {
        drawObject(ctx, object);
      } else {
        object.draw?.(ctx, assets, object);
        // drawText("helkl", object.x, object.y, "red");
      }
    });
  });

  ctx.setTransform(1, 0, 0, 1, 0, 0);

  const UIStatistics = {
    goldKillYMargin: 100 * squareSizeMultipler.y,
  };

  drawXpBar(0, 0, world.width, 50, player.xp.amount, player.xp.nextLevel);
  drawText(
    player.xp.level,
    world.width - 80 * squareSizeMultipler.x,
    40 * squareSizeMultipler.y,
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
    goldtextX - 60 * squareSizeMultipler.x,
    60 * squareSizeMultipler.y,
    50 * squareSizeMultipler.x,
    50 * squareSizeMultipler.x
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
    (world.width / 5) * 4 - 50 * squareSizeMultipler.x,
    60 * squareSizeMultipler.y,
    40 * squareSizeMultipler.x,
    50 * squareSizeMultipler.y
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
    world.width / 2 - player.radius * 1.25 * squareSizeMultipler.x,
    world.height / 2 +
      player.radius +
      player.radius * 0.25 * squareSizeMultipler.y,
    player.radius * 2.5 * squareSizeMultipler.x,
    15 * squareSizeMultipler.y,
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
      world.width / 2 - player.radius * 1.25 * squareSizeMultipler.x,
      world.height / 2 +
        player.radius +
        player.radius * 0.25 * squareSizeMultipler.y,
      player.radius * 2.5 * squareSizeMultipler.x,
      15 * squareSizeMultipler.y,
      player.health,
      stats.maxHealth
    );
  }

  if (player.health <= 0) {
    pause();
    deathMenu();
  }

  oldHealth = player.health;

  worldObjects = [
    entities,
    bullets,
    xps,
    printWeapons,
    explosions,
    targetables,
    pickups,
    chests,
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

const isKeyDown = keyDownTracker();
