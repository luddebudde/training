import { blackhole } from "./blackhole.js";
import { canvas } from "./canvas.js";
import { dragObject } from "./dragObject.js";
import { drawBlackhole } from "./drawBlackhole.js";
import { world } from "./world.js";

export const ctx = canvas.getContext("2d");

let player = {
  xPos: world.width / 2,
  yPos: world.height * 0.9,
  radius: 20,
  acc: {
    x: 1,
    y: 1,
  },
  vel: {
    x: 0,
    y: 0,
  },
  color: "blue",
  airFrictionPercentage: 1.02,
};

let playerCopy1 = {
  xPos: 0,
  yPos: 0,
};

let playerCopy2 = {
  xPos: 0,
  yPos: 0,
};

const fps = 60;
const delay = 1000 / fps;
const dt = 1 / fps;

ctx.beginPath();
ctx.globalAlpha = 0.6;
ctx.arc(player.xPos, player.yPos, player.radius, 0, 2 * Math.PI);
ctx.fillStyle = player.color;
ctx.fill();

setInterval(() => {
  ctx.beginPath();
  ctx.globalAlpha = 1;
  ctx.clearRect(0, 0, world.width, world.height);
  ctx.fillStyle = "white";
  ctx.fill();

  playerCopy1.xPos = player.xPos + world.width;
  playerCopy1.yPos = player.yPos;
  playerCopy2.xPos = player.xPos - world.width;
  playerCopy2.yPos = player.yPos;

  if (player.xPos - player.radius >= world.width) {
    player.xPos = player.radius;
  }
  if (player.xPos + player.radius <= 0) {
    player.xPos = world.width - player.radius;
  }
  if (player.yPos - player.radius <= 0) {
    player.yPos = player.radius;
    player.vel.y = -player.vel.y;
  }
  if (player.yPos + player.radius >= world.height) {
    player.yPos = world.height - player.radius;
    player.vel.y = -player.vel.y;
  }

  player.xPos = player.xPos + player.vel.x;
  player.yPos = player.yPos + player.vel.y;

  if (player.vel.x >= 1) {
    player.vel.x = player.vel.x / player.airFrictionPercentage;
  } else {
    if (player.vel.x <= -1) {
      player.vel.x = player.vel.x / player.airFrictionPercentage;
    }
  }
  if (player.vel.y >= 1) {
    player.vel.y = player.vel.y / player.airFrictionPercentage;
  } else {
    if (player.vel.y <= -1) {
      player.vel.y = player.vel.y / player.airFrictionPercentage;
    }
  }

  dragObject(blackhole, player.xPos, player.yPos);

  drawBlackhole();
  ctx.beginPath();
  ctx.globalAlpha = 1;
  ctx.arc(player.xPos, player.yPos, player.radius, 0, 2 * Math.PI);
  ctx.fillStyle = player.color;
  ctx.fill();

  ctx.beginPath();
  ctx.globalAlpha = 1;
  ctx.arc(playerCopy1.xPos, playerCopy1.yPos, player.radius, 0, 2 * Math.PI);
  ctx.fillStyle = player.color;
  ctx.fill();

  ctx.beginPath();
  ctx.globalAlpha = 1;
  ctx.arc(playerCopy2.xPos, playerCopy2.yPos, player.radius, 0, 2 * Math.PI);
  ctx.fillStyle = player.color;
  ctx.fill();
}, delay);

document.addEventListener("keydown", (event) => {
  // Moment
  if (event.code === "KeyW") {
    player.vel.y = player.vel.y - player.acc.y;
  }
  if (event.code === "KeyA") {
    player.vel.x = player.vel.x - player.acc.x;
  }
  if (event.code === "KeyS") {
    player.vel.y = player.vel.y + player.acc.y;
  }
  if (event.code === "KeyD") {
    player.vel.x = player.vel.x + player.acc.x;
  }
});
