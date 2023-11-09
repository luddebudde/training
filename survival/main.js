import { makeDirection } from "./makeDirection.js";
import { createBullet } from "./createBullet.js";
import { world } from "./world.js";
import { player } from "./player.js";
import {
  enemies,
  enemyBullets,
  kindsOfBullets,
  playerBullets,
  worldObjects,
} from "./arrays.js";
import { createWalker } from "./createWalker.js";

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

  // worldObject.forEach((worldObject) => {});

  // mousePos = onMouseMove(mouse);

  enemies.forEach((enemy) => {
    const directionToPlayerFromEnemy = makeDirection(enemy, player);
    enemy.vel.x = directionToPlayerFromEnemy.x * enemy.speed;
    enemy.vel.y = directionToPlayerFromEnemy.y * enemy.speed;
  });

  ctx.beginPath();
  ctx.arc(mousePos.pos.x - 7.5, mousePos.pos.y - 7.5, 15, 0, 2 * Math.PI);
  ctx.fillStyle = player.color;
  ctx.fill();

  playerBullets.forEach((bullet) => {
    enemies.forEach((enemy) => {
      if (bullet.pos.x - enemy.pos.x < bullet.radius + enemy.radius) {
        console.log("Träffad");
      }
    });
  });

  worldObjects.forEach((worldObject) => {
    worldObject.forEach((object) => {
      object.forEach((object) => {
        object.pos.x += object.vel.x;
        object.pos.y += object.vel.y;

        ctx.beginPath();
        ctx.arc(object.pos.x, object.pos.y, object.radius, 0, 2 * Math.PI);
        ctx.fillStyle = object.color;
        ctx.fill();
      });
    });
  });
}, 10);

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
