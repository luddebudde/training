import { blackholes } from "./blackhole.js";
import { canvas } from "./canvas.js";
import { pullAcceleration } from "./pullAcceleration.js";
import { drawCircle } from "./drawBlackhole.js";
import { world } from "./world.js";
import {
  charge,
  enemy,
  enemyMaxHealth,
  firstPhase,
  preCharge,
} from "./src/enemy.js";
import { airFriction } from "./airFriction.js";
import { shoot } from "./shoot.js";
import { doCirclesOverlap } from "./doCirclesOverlap.js";
import { checkCollisions } from "./checkCollison.js";
import { checkHealth } from "./checkHealth.js";
import { drawHealthBar } from "./drawHealthBar.js";
import { createObstacle } from "./createObstacle.js";
import { transitionToPhase2 } from "./transisionToPhase.js";

export const ctx = canvas.getContext("2d");
export let mousePos = { x: 0, y: 0 };

let shouldPreCharge = true;
let enemyPhaseTime = 200;

let attackCounter = 0;
export let phaseMoves = 0;

export let hasDecidedDirection = false;

let hasTransitionedToPhase2 = false;

const playerMaxHealth = 100;

export const obstacles = [];

export let player = {
  xPos: world.width * 0.5,
  yPos: world.height * 0.9,
  radius: 20,
  acc: {
    x: 2,
    y: 2,
  },
  vel: {
    x: 0,
    y: 0,
  },
  color: "blue",
  airFrictionPercentage: 1.02,
  health: playerMaxHealth,
  mass: 100,
  color: "blue",
  alive: true,
  type: "player",
};

let units = [player, enemy];
export const bullets = [];
export let worldObjects = [player, enemy];
// const pernamentWorldObjects = [player, enemy];

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

  // playerCopy1.xPos = player.xPos + world.width * 2;
  // playerCopy1.yPos = player.yPos;
  // playerCopy2.xPos = player.xPos - world.width * 2;
  // playerCopy2.yPos = player.yPos;

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

  attackCounter += 1;

  if (attackCounter % firstPhase.cooldown === 0) {
    phaseMoves += 1;
    console.log(phaseMoves);
  }

  if (enemy.health > 400) {
    enemy.phaseOneAttack(phaseMoves);
  } else {
    if (!hasTransitionedToPhase2) {
      transitionToPhase2();
    }
    enemy.phaseTwoAttack(phaseMoves);
    hasTransitionedToPhase2 = true;
  }

  worldObjects.forEach((object) => {
    worldObjects.forEach((otherObject) => {
      checkCollisions(object, otherObject);
    });
  });

  // draw circles

  drawHealthBar(
    ctx,
    player.xPos - player.radius * 1.1,
    player.yPos + player.radius * 1.2,
    player.radius * 2.2,
    7,
    player.health,
    playerMaxHealth
  );

  // units = units.filter((unit) => unit.health > 0);
  worldObjects = worldObjects.filter((worldObject) => worldObject.health > 0);

  // deadUnits = units.filter((unit) => unit.health <= 0);
  // units = units.filter((unit) => deadUnits.includes(unit));

  worldObjects.forEach((object) => {
    drawCircle(object.xPos, object.yPos, object.radius, object.color);
  });
  obstacles.forEach((obstacle) => {
    ctx.beginPath();
    ctx.rect(
      obstacle.startPos.x,
      obstacle.startPos.y,
      obstacle.endPos.x,
      obstacle.endPos.y
    );
    ctx.fillStyle = obstacle.color;
    ctx.fill();
  });

  // worldObjects = pernamentWorldObjects;
  // console.log(worldObjects);
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
  if (event.code === "Space") {
    if (player.health >= 0) {
      shoot(player);
    }
  }
  if (event.code === "KeyX") {
    createObstacle(0, 0, 400, 400, "black");
  }
});
