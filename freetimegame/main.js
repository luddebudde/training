import { blackholes } from "./blackhole.js";
import { canvas } from "./canvas.js";
import { pullAcceleration } from "./pullAcceleration.js";
import { drawCircle } from "./drawBlackhole.js";
import { world } from "./world.js";
import { attack, enemy } from "./src/enemy.js";
import { airFriction } from "./airFriction.js";

export const ctx = canvas.getContext("2d");

export let player = {
  xPos: world.width * 0.5,
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

const units = [player, enemy];

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

  playerCopy1.xPos = player.xPos + world.width * 2;
  playerCopy1.yPos = player.yPos;
  playerCopy2.xPos = player.xPos - world.width * 2;
  playerCopy2.yPos = player.yPos;

  units.forEach((unit) => {
    if (unit.xPos + unit.radius >= world.width) {
      // unit.xPos = unit.radius;
      unit.xPos = world.width - unit.radius;
      unit.vel.x = -unit.vel.x;
    }
    if (unit.xPos - unit.radius <= 0) {
      // unit.xPos = world.width - unit.radius;
      unit.xPos = unit.radius;
      unit.vel.x = -unit.vel.x;
    }
    if (unit.yPos - unit.radius <= 0) {
      unit.yPos = unit.radius;
      unit.vel.y = -unit.vel.y;
    }
    if (unit.yPos + unit.radius >= world.height) {
      unit.yPos = world.height - unit.radius;
      unit.vel.y = -unit.vel.y;
    }
  });

  const airFrictionOnBody = airFriction(
    player.vel.x,
    player.vel.y,
    player.airFrictionPercentage
  );
  player.vel.x = player.vel.x - airFrictionOnBody.x / 70;
  player.vel.y = player.vel.y - airFrictionOnBody.y / 70;

  player.xPos += player.vel.x;
  player.yPos += player.vel.y;
  enemy.xPos += enemy.vel.x;
  enemy.yPos += enemy.vel.y;

  blackholes.forEach((blackhole) => {
    const acc = pullAcceleration(blackhole, player.xPos, player.yPos);
    player.vel.y += acc.y;
    player.vel.x += acc.x;

    drawCircle(
      blackhole.xPos,
      blackhole.yPos,
      Math.sqrt(Math.abs(blackhole.pullForce)) * 0.5,
      "black"
    );
  });

  attack();

  // draw player/player copies
  drawCircle(player.xPos, player.yPos, player.radius, "blue");
  drawCircle(playerCopy1.xPos, player.yPos, player.radius, "blue");
  drawCircle(playerCopy2.xPos, player.yPos, player.radius, "blue");

  drawCircle(enemy.xPos, enemy.yPos, enemy.radius, "red");
}, delay);

document.addEventListener("keydown", (event) => {
  // Moment
  if (event.code === "KeyW") {
    player.vel.y -= player.acc.y;
  }
  if (event.code === "KeyA") {
    player.vel.x -= player.acc.x;
  }
  if (event.code === "KeyS") {
    player.vel.y += player.acc.y;
  }
  if (event.code === "KeyD") {
    player.vel.x += player.acc.x;
  }
});
