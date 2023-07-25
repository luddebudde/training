import { blackholes } from "./blackhole.js";
import { canvas } from "./canvas.js";
import { pullAcceleration } from "./pullAcceleration.js";
import { drawCircle } from "./drawBlackhole.js";
import { world } from "./world.js";
import { attack, enemy, preCharge } from "./src/enemy.js";
import { airFriction } from "./airFriction.js";
import { shoot } from "./shoot.js";
import { playerBullet } from "./playerBullet.js";
import { checkCollsion } from "./checkCollsion.js";

export const ctx = canvas.getContext("2d");
export let mousePos = { x: 0, y: 0 };

let attackCounter = 0;
let enemyPhaseTime = 200;
let enemyLoadPhase = true;
export let hasDecidedDirection = false;

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
export const bullets = [playerBullet];
export const worldObjects = [player, enemy, playerBullet];

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

  worldObjects.forEach((object) => {
    object.xPos += object.vel.x;
    object.yPos += object.vel.y;
  });
  bullets.forEach((bullet) => {
    bullet.xPos += bullet.vel.x;
    bullet.yPos += bullet.vel.y;
  });
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

  if (!enemyLoadPhase) {
    attack();
    hasDecidedDirection = true;
  } else {
    preCharge();
    hasDecidedDirection = false;
  }
  attackCounter += 1;
  if (attackCounter % enemyPhaseTime === 0 && enemyLoadPhase) {
    enemyLoadPhase = false;
    // hasDecidedDirection = false;
    attackCounter = 0;
  } else if (attackCounter % (enemyPhaseTime * 2) === 0 && !enemyLoadPhase) {
    enemyLoadPhase = true;
    // hasDecidedDirection = false;
    attackCounter = 0;
  }

  worldObjects.forEach((objectA) => {
    worldObjects.forEach((objectB) => {
      checkCollsion(objectA, objectB);
    });
  });

  // draw circles
  bullets.forEach((bullet) => {
    drawCircle(bullet.xPos, bullet.yPos, bullet.radius, bullet.color);
  });
  drawCircle(player.xPos, player.yPos, player.radius, "blue");
  drawCircle(playerCopy1.xPos, player.yPos, player.radius, "blue");
  drawCircle(playerCopy2.xPos, player.yPos, player.radius, "blue");

  drawCircle(enemy.xPos, enemy.yPos, enemy.radius, "red");
}, delay);

window.addEventListener("mousemove", (event) => {
  mousePos = { x: event.clientX, y: event.clientY };
});

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
  if (event.code === "KeyQ") {
    shoot(player, playerBullet);
  }
});
