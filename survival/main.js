import { makeDirection } from "./makeDirection.js";
import { createBullet } from "./createBullet.js";
import { world } from "./world.js";
import { player } from "./player.js";
import {
  enemies,
  kindsOfBullets,
  playerBullets,
  worldObjects,
} from "./arrays.js";
import { createWalker } from "./createWalker.js";
import { doCirclesOverlap } from "./doCirlceOverlap.js";
import { spawnEnemy } from "./spawnEnemy.js";
import { loopPerSecond } from "./basic.js";

const canvas = document.getElementById("theCanvas");
const ctx = canvas.getContext("2d");

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

  console.log(world.width);
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
      console.log(bullet.pos.x);
      if (
        bullet.pos.x > player.pos.x + world.width ||
        bullet.pos.x < player.pos.x - world.width ||
        bullet.pos.y > player.pos.y + world.width ||
        bullet.pos.y < player.pos.y - world.width
      ) {
        bulletKind.pop(bullet);
      }
    });
  });

  ctx.beginPath();
  ctx.arc(mousePos.pos.x - 10, mousePos.pos.y, 15, 0, 2 * Math.PI);
  ctx.fillStyle = player.color;
  ctx.fill();

  worldObjects.forEach((worldObject) => {
    worldObject.forEach((firstObject) => {
      firstObject.forEach((object) => {
        object.pos.x += object.vel.x;
        object.pos.y += object.vel.y;

        if (object.health >= 0 || object.health === undefined) {
          ctx.beginPath();
          ctx.arc(object.pos.x, object.pos.y, object.radius, 0, 2 * Math.PI);
          ctx.fillStyle = object.color;
          ctx.fill();
        } else {
          firstObject.pop(object);
        }
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
    createBullet(makeDirection(player, mousePos));
  }
  if (event.code === "KeyQ") {
    createWalker();
  }
});
