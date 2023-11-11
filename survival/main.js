import { makeDirection } from "./makeDirection.js";
import { createAimBullet } from "./createAimBullet.js";
import { world } from "./world.js";
import { player } from "./player.js";
import { createWalker } from "./createWalker.js";
import { doCirclesOverlap } from "./doCirlceOverlap.js";
import { spawnEnemy } from "./spawnEnemy.js";
import { loopPerSecond } from "./basic.js";
import { shootWeapons } from "./shootWeapons.js";
import { createClosestAimingBullet } from "./createClosestAimingBullet.js";

export const canvas = document.getElementById("theCanvas");
export const ctx = canvas.getContext("2d");

export const allies = [player];
export let enemies = [];
export const entities = [allies, enemies];

export const createEnemies = [createWalker];

export const playerBullets = [];
export const enemyBullets = [];
export const kindsOfBullets = [playerBullets, enemyBullets];

export const worldObjects = [kindsOfBullets, entities];

export const weapons = [createClosestAimingBullet];

let mousePos = {
  pos: {
    x: 0,
    y: 0,
  },
};

createWalker();

document.addEventListener("mousemove", (event) => {
  // clientX = event;
  // clientY = event;

  mousePos = {
    pos: {
      x: event.clientX,
      y: event.clientY,
    },
  };
});

setInterval(() => {
  ctx.beginPath();
  ctx.globalAlpha = 1;
  ctx.clearRect(0, 0, world.width, world.height);
  ctx.fillStyle = "white";
  ctx.fill();

  spawnEnemy();

  enemies.forEach((enemy) => {
    const directionToPlayerFromEnemy = makeDirection(enemy, player);
    enemy.vel.x = directionToPlayerFromEnemy.x * enemy.speed;
    enemy.vel.y = directionToPlayerFromEnemy.y * enemy.speed;
  });

  playerBullets.forEach((bullet) => {
    enemies.forEach((enemy) => {
      // console.log(doCirclesOverlap(enemy, bullet));
      if (doCirclesOverlap(enemy, bullet) === true) {
        enemy.health -= bullet.damage;
        playerBullets.pop(bullet);
      }
    });
  });

  kindsOfBullets.forEach((bulletKind) => {
    bulletKind.forEach((bullet) => {
      // console.log(bulletKind.indexOf(bullet));
      if (
        bullet.pos.x > player.pos.x + world.width ||
        bullet.pos.x < player.pos.x - world.width ||
        bullet.pos.y > player.pos.y + world.width ||
        bullet.pos.y < player.pos.y - world.width
      ) {
        bulletKind.splice(
          bulletKind.indexOf(bullet),
          bulletKind.indexOf(bullet)
        );
      }
    });
  });

  ctx.beginPath();
  ctx.arc(mousePos.pos.x - 10, mousePos.pos.y, 15, 0, 2 * Math.PI);
  ctx.fillStyle = player.color;
  ctx.fill();

  enemies = enemies.filter((enemy) => enemy.health > 0);

  console.log(enemies);

  worldObjects.forEach((worldObject) => {
    worldObject.forEach((firstObject) => {
      firstObject.forEach((object) => {
        object.pos.x += object.vel.x;
        object.pos.y += object.vel.y;

        // if (object.health >= 0 || object.health === undefined) {

        ctx.beginPath();
        ctx.arc(object.pos.x, object.pos.y, object.radius, 0, 2 * Math.PI);
        ctx.fillStyle = object.color;
        ctx.fill();

        // ctx.beginPath();
        // ctx.arc(100, 100, object.radius, 0, 2 * Math.PI);
        // ctx.fillStyle = object.color;
        // ctx.fill();

        // } else {
      });
    });
  });
}, 1000 / loopPerSecond);

document.addEventListener("keydown", (event) => {
  // Moment
  if (event.code === "KeyW") {
    player.vel.y -= player.speed;
  }
  if (event.code === "KeyA") {
    player.vel.x -= player.speed;
  }
  if (event.code === "KeyS") {
    player.vel.y += player.speed;
  }
  if (event.code === "KeyD") {
    player.vel.x += player.speed;
  }
  if (event.code === "Space") {
    createAimBullet(makeDirection(player, mousePos));
  }
  if (event.code === "KeyQ") {
    spawnEnemy();
  }
  if (event.code === "KeyZ") {
    shootWeapons();
  }
});
