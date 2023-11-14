import { makeDirection } from "./makeDirection.js";
import { createAimBullet } from "./createAimBullet.js";
import { world } from "./world.js";
import { player } from "./player.js";
import { createWalker } from "./createWalker.js";
import { doCirclesOverlap } from "./doCirlceOverlap.js";
import { spawnEnemy } from "./spawnEnemy.js";
import { loopPerSecond } from "./basic.js";
import { shootWeapons } from "./shootWeapons.js";
import { createShotgun } from "./createClosestAimingBullet.js";

export const canvas = document.getElementById("theCanvas");
export const ctx = canvas.getContext("2d");

export let allies = [player];
export let enemies = [];
export let deadEnemies = [];
export let entities = [allies, enemies];

export const createEnemies = [createWalker];

export let playerBullets = [];
export let enemyBullets = [];
export let kindsOfBullets = [playerBullets, enemyBullets];

export let worldObjects = [kindsOfBullets, entities];

export const weapons = [createShotgun];

let mousePos = {
  pos: {
    x: 0,
    y: 0,
  },
};

createWalker(100, 100);

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
  // createWalker(100, 100);

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

        playerBullets = playerBullets.filter((bullet) => bullet.health > 0);
        playerBullets.splice(0, 1);
        kindsOfBullets.push(playerBullets);
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

        bulletKind = bulletKind.filter((bullet) => bullet.health > 0);
        bulletKind.splice(0, 1);
        kindsOfBullets.push(bulletKind);

        // bulletKind = bulletKind.filter((bullet) => bullet.health > 0);
        // bulletKind.splice(0, 1);
        // entities.push(bulletKind);
      }
    });
  });

  ctx.beginPath();
  ctx.arc(mousePos.pos.x - 10, mousePos.pos.y, 15, 0, 2 * Math.PI);
  ctx.fillStyle = player.color;
  ctx.fill();

  // console.log(worldObjects);

  // deadEnemies = enemies.filter((enemy) => enemy.health <= 0);
  // enemies = enemies.filter((enemy) => !deadEnemies.includes(enemy));
  // entities = entities.filter((entity) => !deadEnemies.includes(entity));
  // worldObjects = worldObjects.filter((object) => !deadEnemies.includes(object));

  enemies = enemies.filter((enemy) => enemy.health > 0);
  allies = allies.filter((ally) => ally.health > 0);
  entities.splice(0, 2);
  entities.push(enemies);
  entities.push(allies);

  worldObjects.forEach((worldObject) => {
    worldObject.forEach((firstObject) => {
      firstObject.forEach((object) => {
        object.pos.x += object.vel.x;
        object.pos.y += object.vel.y;

        ctx.beginPath();
        ctx.arc(object.pos.x, object.pos.y, object.radius, 0, 2 * Math.PI);
        ctx.fillStyle = object.color;
        ctx.fill();
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
    createWalker(100, 100);
  }
  if (event.code === "KeyZ") {
    shootWeapons();
  }
});
