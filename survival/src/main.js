import { makeDirection } from "./makeDirection.js";
import { aimBullet, createAimBullet } from "./createAimBullet.js";
import { world } from "./world.js";

import { createWalker } from "./createWalker.js";
import { doCirclesOverlap } from "./doCirlceOverlap.js";
import { spawnEnemy } from "./spawnEnemy.js";
import { loopPerSecond } from "./basic.js";
import { shootWeapons } from "./shootWeapons.js";
import { createShotgun, shotgun } from "./createShotgun.js";
import { keyDownTracker } from "./keyDownTracker.js";
import { createPlayer } from "./createPlayer.js";
import { getRandomSpawnPos } from "./getRandomSpawnPos.js";
import { createXp } from "./createXP.js";

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
export const weapons = [aimBullet, shotgun];

const worldArrays = [entities, worldObjects, bullets];

export const player = createPlayer();

entities.push(player);
worldObjects.push(player);

export let mousePos = {
  pos: {
    x: 0,
    y: 0,
  },
};

createWalker(100, 100);

document.addEventListener("mousemove", (event) => {
  mousePos = {
    pos: {
      x: event.clientX,
      y: event.clientY,
    },
  };
});

const spawnRate = 100;

let spawnCooldown = spawnRate;

const currentWave = () => {
  // const spawnPos = getRandomSpawnPos();
  // const spawnPos = 0;
  for (let i = 0; i < 1; i++) {
    // createWalker(spawnPos.x + i * 50, spawnPos.y);
    createWalker(Math.random() * world.width + i * 50, 100);
  }
};

setInterval(() => {
  ctx.beginPath();
  ctx.globalAlpha = 1;
  ctx.clearRect(0, 0, world.width, world.height);
  ctx.fillStyle = "white";
  ctx.fill();

  // console.log(enemies);

  if (isKeyDown("KeyW")) {
    player.pos.y -= player.speed;
  }
  if (isKeyDown("KeyS")) {
    player.pos.y += player.speed;
  }
  if (isKeyDown("KeyA")) {
    player.pos.x -= player.speed;
  }
  if (isKeyDown("KeyD")) {
    player.pos.x += player.speed;
  }

  if (isKeyDown("Space")) {
    // if ()
    createAimBullet();
    // createAimBullet(makeDirection(player.pos, mousePos));
    // console.log(makeDirection(player, mousePos));
  }
  if (isKeyDown("KeyQ")) {
    createWalker(100, 100);
  }
  if (isKeyDown("KeyZ")) {
    shootWeapons();
  }

  weapons.forEach((weapon) => {
    weapon.cooldown -= 1;

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
  });

  xps.forEach((xp) => {
    if (doCirclesOverlap(xp, player)) {
      player.radius += 1;
      indexOf;
    }
  });

  entities = entities.filter((entity) => entity.health >= 0);
  enemies = enemies.filter((enemy) => enemy.health >= 0);
  bullets = bullets.filter((bullet) => !bullet.destroy);

  worldObjects = worldObjects.filter(
    (entity) => entity.health === undefined || entity.health >= 0
  );
  worldObjects = worldObjects.filter(
    (bullet) => bullet.destroy === undefined || !bullet.destroy
  );

  worldObjects = worldObjects;

  bullets.forEach((bullet) => {
    entities.forEach((entity) => {
      if (
        doCirclesOverlap(entity, bullet) === true &&
        bullet.team !== entity.team
      ) {
        // console.log("obi ladai");
        entity.health -= bullet.damage;

        bullet.destroy = true;
      }
    });
    if (bullet.pos.x + bullet.radius >= world.width + 400) {
      bullet.destroy = true;
    }
    if (bullet.pos.x - bullet.radius <= -400) {
      bullet.destroy = true;
    }
    if (bullet.pos.y - bullet.radius <= -400) {
      bullet.destroy = true;
    }
    if (bullet.pos.y + bullet.radius >= world.height + 50) {
      bullet.destroy = true;
    }
  });

  ctx.beginPath();
  ctx.arc(mousePos.pos.x - 10, mousePos.pos.y, 15, 0, 2 * Math.PI);
  ctx.fillStyle = player.color;
  ctx.fill();

  worldObjects.forEach((object) => {
    if (object.vel !== undefined) {
      object.pos.x += object.vel.x;
      object.pos.y += object.vel.y;
    }

    ctx.beginPath();
    ctx.arc(object.pos.x, object.pos.y, object.radius, 0, 2 * Math.PI);
    ctx.fillStyle = object.color;
    ctx.fill();
  });
}, 1000 / loopPerSecond);

const isKeyDown = keyDownTracker();
