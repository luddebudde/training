import { aimBullet } from "./weapons.js/createAimBullet.js";
import { world } from "./world.js";

import { createWalker } from "./enemies/createWalker.js";
import { doCirclesOverlap } from "./doCirlceOverlap.js";
import { spawnEnemy } from "./spawnEnemy.js";
import { loopPerSecond } from "./basic.js";
import { shootWeapons } from "./shootWeapons.js";
import { createShotgun, shotgun } from "./weapons.js/createShotgun.js";
import { keyDownTracker, oneTimeKeyPress } from "./keyDownTracker.js";
import { createPlayer } from "./createPlayer.js";
import { getRandomSpawnPos } from "./getRandomSpawnPos.js";
import { createXp } from "./createXP.js";
import { createCharger } from "./enemies/createCharger.js";
import { holyArea, holyAreaBody } from "./weapons.js/createHolyArea.js";
import { vector } from "./vectors.js";
import { stats } from "./stats.js";
import { drawHealthBar } from "./draw/drawHealthbar.js";
import { drawXpBar } from "./draw/drawXpBar.js";
import {
  playLevelUp as playLevelUp,
  playLevelUpSpecial,
  universalVolume,
} from "./sounds.js";
import { drawText } from "./draw/drawText.js";
import { drawObject } from "./draw/drawObject.js";
import { levelUpSelection } from "./levelUpSelection.js";
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
// import { assets } from "./assets.js";

export const canvas = document.getElementById("theCanvas");
export const ctx = canvas.getContext("2d");

// export let entities = [player];
// export let entities = [];
export let enemies = [];
export let entities = [];

export const createEnemies = [createWalker];

// export let bullets = [];
// export let bullets = [];

export let xps = [];

export let bullets = [];
export let explosions = [];

export let weapons = [
  aimBullet,
  // holyArea,
  // minigun,
  // wiper,
  // randomAimBullet,
  // axe,
  // airstrike,
  selfImpaler,
];
export let printWeapons = [
  // holyArea.body
];

export const maximumAmountOfWeapons = 6;

let levelUp = false;

export const buttons = [];

export const player = createPlayer();

entities.push(player);

// export const worldObjects = [[], [], []];
export let worldObjects = [printWeapons, entities, bullets, xps, explosions];
const worldObjectsLenght = worldObjects.length;

// worldObjects[0].push(entities);
// worldObjects[1].push(bullets);
// worldObjects[2].push(xps);

let oldHealth = player.health;
let oldTime = Date.now();

// worldObjects.push(entities);
// worldObjects.push(bullets);
// worldObjects.push(xps);

const worldArrays = [entities, worldObjects, bullets];

// worldObjects.push(player);

// worldObjects.push(holyAreaBody);

export let mousePos = {
  x: 0,
  y: 0,
};

// createWalker(100, 100);

export const assets = {
  // astronaut: loadImage("/ships/player/astronaut.png"),
  blue: await loadImage("/public/sprites/blue.png"),
  // assault: loadImage(`/ships/player/large/assault.png`),
  // fighter: loadImage(`/ships/player/large/green.png`),
  rhino: await loadImage(`/public/ships/player/large/green-rhino.png`),
  jet: await loadImage("/public/animations/jet-even.png"),
  explosion: await loadImage("/public/animations/explosion.png"),
  comet: await loadImage("/public/animations/comet.png"),
};

canvas.addEventListener("mousemove", (event) => {
  mousePos = {
    x: event.offsetX,
    y: event.offsetY,
  };
});

const myButton = document.getElementById("myButton");

// Lägg till en händelsedetektor för musklick
document.addEventListener("click", function (event) {
  const mouseX = event.clientX;
  const mouseY = event.clientY;

  const x = checkButtonPress(mouseX, mouseY);
  // console.log(x);
  // console.log(buttons);
  // console.log(click);
  // xps.push(createXp(1000, 1000, 100));
});

let currentMusicIndex = 0;

let spawnRate = 50 / stats.curse;
let spawnCooldown = spawnRate;

const currentWave = () => {
  // const spawnPos = 0;
  for (let i = 0; i < 5 * stats.curse; i++) {
    const spawnPos = getRandomSpawnPos(player);
    createWalker(spawnPos.x, spawnPos.y);
    createCharger(spawnPos.x, spawnPos.y);

    // console.log(enemies.length);
    // console.log("Fiende");
  }
  // console.log(enemies);
};

export let moveCtx = {
  x: 0,
  y: 0,
};

let isPause = false;

export const pause = () => {
  isPause = true;
};
export const start = () => {
  isPause = false;
};
export const reverse = () => {
  isPause = !isPause;
};

document.body.addEventListener("mousemove", playMusic);

let timer = 0;

// setInterval(() => {

// }, 500);

let canChangeMusic = true;

const update = () => {
  ctx.beginPath();
  ctx.globalAlpha = 1;
  ctx.clearRect(0, 0, world.width, world.height);
  ctx.fillStyle = "white";
  ctx.fill();

  spawnRate = 50 / stats.curse;
  // const maxEnemyCount = (250 * stats.curse) / s3;
  const maxEnemyCount = (20 * stats.curse) / 3;

  // createExplosion(
  //   Math.random() * world.width - world.width / 2 + player.pos.x,
  //   Math.random() * world.height - world.height / 2 + player.pos.y,
  // 100,
  // 16,
  // 100
  // );
  const currentTime = Date.now();
  timer = (currentTime - oldTime) / 1000;

  drawText(Math.floor(timer), world.width / 2, 100, "red");

  // oldTime = Date.now();

  // console.log(enemies);

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
    currentMusicIndex += 1;

    const listIndex = currentMusicIndex % musicList.length;

    const nextElement = musicList[listIndex];
    console.log(nextElement);

    changeMusic(nextElement.fileName);
    changeVolume(nextElement.volume);

    // Sätt flaggan till false och använd setTimeout för att återställa den efter 1000 ms (1 sekund)
    canChangeMusic = false;
    setTimeout(() => {
      canChangeMusic = true;
    }, 1000);
  }

  if (isKeyDown("ArrowUp")) {
    const totalAmount = xps.reduce((sum, xp) => sum + xp.amount, 0);

    xps.length = 0;

    player.xp.amount += totalAmount;
  }

  weapons.forEach((weapon, index) => {
    weapon.cooldown -= 1;
    weapon.update?.();

    if (weapon.cooldown <= 0) {
      weapon.cooldown = weapon.attackIntervall;
      weapon.attack?.();
    }

    drawText(weapon.name, 20, 50 * (index + 2), "green");
  });

  // console.log(spawnCooldown);
  // spawnCooldown -= 1;
  if (enemies.length <= maxEnemyCount) {
    currentWave();
    // spawnCooldown = spawnRate;
  }

  // console.log(enemies.length);

  // console.log(bullets);

  // console.log(wiper.upgrades);

  entities.forEach((entity) => {
    entity.update?.();

    if (entity.health <= 0) {
      createXp(entity.pos.x, entity.pos.y, entity.xp);
    }

    if (
      doCirclesOverlap(holyAreaBody, entity) &&
      holyAreaBody.team !== entity.team
    ) {
      // const aVel = entity.vel;
      // console.log(entity.vel);
      entity.vel = vector.alone.div(entity.vel, 4);
    }
  });

  xps.forEach((xp) => {
    if (doCirclesOverlap(xp, player)) {
      player.xp.amount += xp.amount;
      // indexOf;
      // console.log("hej");

      xp.destroy = true;
      // playBang();
    }
  });

  const amountOfXp = 100; // Ange ditt tröskelvärde här

  if (xps.length > amountOfXp + 1) {
    // const totalAmount = xps.reduce((sum, xp) => sum + xp.amount, 0);

    let totalAmount = 0;

    xps.forEach((xp, index) => {
      if (index > amountOfXp) {
        totalAmount += xp.amount;
      }
    });

    // const chosenXp = xps[amountOfXp]

    const chosenXp = {
      radius: xps[0].radius,
      amount: totalAmount,
      // color: "red",
      pos: {
        x: xps[0].pos.x,
        y: xps[0].pos.y,
      },
    };

    xps.length = amountOfXp;
    createSumXp(chosenXp.pos.x, chosenXp.pos.y, totalAmount, chosenXp.radius);
    // xps[0] = chosenXp;
    // xps.push(chosenXp);
    // console.log(totalAmount);
  }

  if (player.xp.amount >= player.xp.nextLevel) {
    player.xp.level++;
    player.xp.amount -= player.xp.nextLevel;
    player.xp.nextLevel += player.xp.levelIncrease;

    if (Math.random() <= 0.9995) {
      playLevelUp();
    } else {
      playLevelUpSpecial();
      console.log("levelUp");
    }

    levelUpSelection();

    isPause = true;
  }

  enemies.forEach((enemy) => {
    if (
      !isPointInsideArea(
        enemy.pos.x,
        enemy.pos.y,
        player.pos.x - world.width * 0.7,
        player.pos.y - world.height * 0.7,
        world.width * 2,
        world.height * 2
      )
    ) {
      enemy.health = 0;
      // Tar bort fienden
    }
  });

  entities = entities.filter((entity) => entity.health > 0);
  enemies = enemies.filter((enemy) => enemy.health > 0);
  bullets = bullets.filter((bullet) => !bullet.destroy);
  explosions = explosions.filter((explosion) => !explosion.hasExpired);

  xps = xps.filter((xp) => !doCirclesOverlap(player, xp));

  explosions.forEach((explosion) => {
    enemies.forEach((enemy) => {
      if (doCirclesOverlap(explosion, enemy)) {
        enemy.health -= explosion.damage;
      }
    });
  });

  // console.log(explosions);

  bullets.forEach((bullet) => {
    entities.forEach((entity) => {
      if (doCirclesOverlap(entity, bullet) && bullet.team !== entity.team) {
        // bullet.enemiesHit.forEach((enemyHit) => {
        //   if (enemyHit !== entity) {

        //     console.log(bullet);
        //   }
        // });

        if (!bullet.enemiesHit.includes(entity)) {
          entity.health -= bullet.damage;
          bullet.enemiesHit.push(entity);
          // console.log(entity.health);
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
        drawObject(ctx, vector.alone.neg(player.pos), object);
      } else {
        object.draw?.(ctx, assets, object);
        // drawText("helkl", object.x, object.y, "red");
      }
    });
  });

  ctx.setTransform(1, 0, 0, 1, 0, 0);

  drawXpBar(0, 0, world.width, 50, player.xp.amount, player.xp.nextLevel);
  drawText(player.xp.level, world.width - 80, 40, "green");

  drawText(player.gold, world.width - 80, 100, "#ECF500");

  drawHealthBar(
    ctx,
    world.width / 2 - player.radius * 1.25,
    world.height / 2 + player.radius * 1.25,
    player.radius * 2.5,
    15,
    player.health,
    stats.maxHealth
  );

  oldHealth = player.health;

  worldObjects = [entities, bullets, xps, printWeapons, explosions];
};

setInterval(() => {
  if (!(player.health <= 0)) {
    if (!isPause) {
      update();
    }
  }
}, 1000 / loopPerSecond);

const isKeyDown = keyDownTracker();
