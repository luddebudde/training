import { aimBullet, createAimBullet } from "./weapons.js/createAimBullet.js";
import { world } from "./world.js";

import { createWalker } from "./enemies/createWalker.js";
import { doCirclesOverlap } from "./doCirlceOverlap.js";
import { spawnEnemy } from "./spawnEnemy.js";
import { loopPerSecond } from "./basic.js";
import { shootWeapons } from "./shootWeapons.js";
import { createShotgun, shotgun } from "./weapons.js/createShotgun.js";
import { keyDownTracker } from "./keyDownTracker.js";
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

let oldStats = stats;

export const canvas = document.getElementById("theCanvas");
export const ctx = canvas.getContext("2d");

// export let entities = [player];
// export let entities = [];
export let enemies = [];
export let entities = [];

export const createEnemies = [createWalker];

// export let bullets = [];
// export let bullets = [];
export let worldObjects = [];
export let xps = [];

export let bullets = [];
export let weapons = [
  aimBullet,
  // shotgun, holyArea
];

export const buttons = [];

const worldArrays = [entities, worldObjects, bullets];

export const player = createPlayer();

entities.push(player);
worldObjects.push(player);

worldObjects.push(holyAreaBody);

export let mousePos = {
  x: 0,
  y: 0,
};

createWalker(100, 100);

document.addEventListener("mousemove", (event) => {
  mousePos = {
    x: event.clientX,
    y: event.clientY,
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

const spawnRate = 100 / stats.curse;

let spawnCooldown = spawnRate;

const currentWave = () => {
  // const spawnPos = getRandomSpawnPos();
  // const spawnPos = 0;
  for (let i = 0; i < 5 * stats.curse; i++) {
    // createWalker(spawnPos.x + i * 50, spawnPos.y);
    // createWalker(Math.random() * world.width + i * 50, 100);
    // createCharger(Math.random() * world.width + i * 50, 100);
  }
};

export let moveCtx = {
  x: 0,
  y: 0,
};

let isPause = false;
const shouldPlayMusic = true;

const musicAudio = new Audio("/public/sounds/gameMusic.mp3");
musicAudio.loop = true;
musicAudio.volume = 0.7 * universalVolume;
const playMusic = () => {
  if (!shouldPlayMusic) {
    return;
  }
  const response = musicAudio.play();
  response
    .then((e) => {
      document.body.removeEventListener("mousemove", playMusic);
    })
    .catch((e) => {});
};

document.body.addEventListener("mousemove", playMusic);

const update = () => {
  ctx.beginPath();
  ctx.globalAlpha = 1;
  ctx.clearRect(0, 0, world.width, world.height);
  ctx.fillStyle = "white";
  ctx.fill();

  // console.log(enemies);

  if (isKeyDown("KeyW")) {
    player.pos.y -= player.speed;
    moveCtx.y += player.speed;
  }
  if (isKeyDown("KeyS")) {
    player.pos.y += player.speed;
    moveCtx.y -= player.speed;
  }
  if (isKeyDown("KeyA")) {
    player.pos.x -= player.speed;
    moveCtx.x += player.speed;
  }
  if (isKeyDown("KeyD")) {
    player.pos.x += player.speed;
    moveCtx.x -= player.speed;
  }

  if (isKeyDown("Escape")) {
    isPause = !isPause;
  }

  if (isKeyDown("Space")) {
    isPause = !isPause;
  }
  if (isKeyDown("KeyQ")) {
    createWalker(100, 100);
  }
  if (isKeyDown("KeyZ")) {
    shootWeapons();
  }

  weapons.forEach((weapon) => {
    weapon.cooldown -= 1;
    weapon.update?.();

    if (weapon.cooldown <= 0) {
      weapon.cooldown = weapon.attackIntervall;
      weapon.attack();
    }
    // console.log(weapon.attack);
  });

  // console.log(spawnCooldown);
  spawnCooldown -= 1;
  if (spawnCooldown <= 0) {
    currentWave();
    spawnCooldown = spawnRate;
  }

  // console.log(bullets);

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

      if (player.xp.amount >= player.xp.nextLevel) {
        player.xp.level++;
        player.xp.amount -= player.xp.nextLevel;
        player.xp.nextLevel += player.xp.levelIncrease;
        // stats.cooldown *= 0.5;
        // stats.curse *= 1.1;
        // stats.growth *= 10;
        // stats.damage *= 1.1;
        // console.log(player.xp.nextLevel);

        weapons.forEach((weapon) => {
          (weapon.attackIntervall = weapon.newCooldown * stats.cooldown),
            (weapon.cooldown = weapon.newCooldown * stats.cooldown);

          weapon.body = weapon.body;
        });

        if (Math.random() <= 0.9995) {
          playLevelUp();
        } else {
          playLevelUpSpecial();
          console.log("levelUp");
        }

        levelUpSelection();
        isPause = true;
      }
    }
  });

  // if (stats !== oldStats) {
  // }
  // console.log(weapons);

  // console.log(enemies);

  entities = entities.filter((entity) => entity.health > 0);
  enemies = enemies.filter((enemy) => enemy.health > 0);
  bullets = bullets.filter((bullet) => !bullet.destroy);

  worldObjects = worldObjects.filter(
    (entity) => entity.health === undefined || entity.health > 0
  );
  worldObjects = worldObjects.filter(
    (bullet) => bullet.destroy === undefined || !bullet.destroy
  );

  xps = xps.filter((xp) => !doCirclesOverlap(player, xp));
  // worldObjects = worldObjects.filter((xp) => doCirclesOverlap(player, xp));

  // worldObjects = worldObjects;

  bullets.forEach((bullet) => {
    entities.forEach((entity) => {
      if (doCirclesOverlap(entity, bullet) && bullet.team !== entity.team) {
        // console.log("obi ladai");
        entity.health -= bullet.damage;

        bullet.destroy = true;
      }
    });
    if (bullet.pos.x + bullet.radius >= player.pos.x + world.width + 400) {
      bullet.destroy = true;
    }
    if (bullet.pos.x - bullet.radius <= -world.width + player.pos.x) {
      bullet.destroy = true;
    }
    if (bullet.pos.y - bullet.radius <= -world.height + player.pos.y) {
      bullet.destroy = true;
    }
    if (bullet.pos.y + bullet.radius >= player.pos.y + world.height + 50) {
      bullet.destroy = true;
    }
  });

  ctx.beginPath();
  ctx.arc(mousePos.x - 10, mousePos.y - 30, 15, 0, 2 * Math.PI);
  ctx.fillStyle = player.color;
  ctx.fill();

  worldObjects.sort((a, b) => a.priority - b.priority);

  worldObjects.forEach((object) => {
    if (object.vel !== undefined) {
      object.pos.x += object.vel.x;
      object.pos.y += object.vel.y;
    }

    drawObject(ctx, moveCtx, object);
  });

  drawXpBar(0, 0, world.width, 50, player.xp.amount, player.xp.nextLevel);
  drawText(player.xp.level, world.width - 80, 40, "green");

  drawHealthBar(
    ctx,
    player.pos.x - player.radius * 1.25 + moveCtx.x,
    player.pos.y + player.radius * 1.25 + moveCtx.y,
    player.radius * 2.5,
    15,
    player.health,
    stats.maxHealth
  );
  oldStats = stats;
};

setInterval(() => {
  if (!(player.health > 0) || !isPause) {
    update();
  }
}, 1000 / loopPerSecond);

const isKeyDown = keyDownTracker();
