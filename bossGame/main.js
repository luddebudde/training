import { blackholes } from "./createBlackhole.js";
import { canvas } from "./canvas.js";
import { pullAcceleration } from "./pullAcceleration.js";
import { drawCircle } from "./drawBlackhole.js";
import { world } from "./world.js";
import {
  charge,
  currentPhase,
  enemy,
  enemyMaxHealth,
  fifthPhase,
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
import { transitionToPhase2 } from "./transisionToPhase2.js";
import {
  checkRectangleCollison,
  checkRectangleCollisonForBullet,
} from "./checkRectangleCollision.js";
import {
  playerCopy1,
  playerCopy2,
  transitionToPhase3,
} from "./transisionToPhase3.js";
import { keyDownTracker } from "./keyDownTracker.js";
import { transitionToPhase4 } from "./transisionToPhase4.js";
import { makeDirection } from "./makeDirection.js";
import { transitionToPhase5 } from "./transisionToPhase5.js";

export const ctx = canvas.getContext("2d");
export let mousePos = { x: 0, y: 0 };

let shouldPreCharge = true;
let enemyPhaseTime = 200;

export let attackCounter = 0;
export let phaseMoves = 0;

export let hasDecidedDirection = false;

let hasTransitionedToPhase2 = false;
let hasTransitionedToPhase3 = false;
let hasTransitionedToPhase4 = false;
let hasTransitionedToPhase5 = false;

let oldAttackCounter = 0;

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
  damage: 1,
  mass: 100,
  color: "blue",
  alive: true,
  type: "player",
  team: "player",
};

export let units = [player, enemy];
export let bullets = [];
export let worldObjects = [player, enemy];
// const pernamentWorldObjects = [player, enemy];

const fps = 60;
let delay = 1000 / fps;
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

  // playerCopy1.xPos = player.xPos + world.width / 3;
  // playerCopy1.yPos = player.yPos;
  // playerCopy2.xPos = player.xPos - world.width / 3;
  // playerCopy2.yPos = player.yPos;

  playerCopy1.vel.x = player.vel.x;
  playerCopy1.vel.y = player.vel.y;
  playerCopy2.vel.x = player.vel.x;
  playerCopy2.vel.y = player.vel.y;

  units.forEach((unit) => {
    if (unit.xPos + unit.radius >= world.width) {
      // unit.xPos = unit.radius;
      unit.xPos = world.width - unit.radius;
      unit.vel.x = -unit.vel.x;
    }
    if (unit.xPos - unit.radius <= world.startX) {
      // unit.xPos = world.width - unit.radius;
      unit.xPos = world.startX + unit.radius;
      unit.vel.x = -unit.vel.x;
    }
    if (unit.yPos - unit.radius <= world.startY) {
      unit.yPos = world.startY + unit.radius;
      unit.vel.y = -unit.vel.y;
    }
    if (unit.yPos + unit.radius >= world.height) {
      unit.yPos = world.height - unit.radius;
      unit.vel.y = -unit.vel.y;
    }
    // obstacles.forEach((obstacle) => {
    //   if (unit !== enemy) {
    //     checkRectangleCollison(unit, obstacle);
    //   }
    // });
    if (unit.type === "walker") {
      const direction = makeDirection(unit, player);

      // console.log(unit);
      unit.vel.x = -direction.x * 3;
      unit.vel.y = -direction.y * 3;
    }
  });

  bullets.forEach((bullet) => {
    if (bullet.xPos + bullet.radius >= world.width + 400) {
      // unit.xPos = unit.radius;
      bullet.destroy = true;
    }
    if (bullet.xPos - bullet.radius <= -400) {
      // unit.xPos = world.width - unit.radius;
      bullet.destroy = true;
    }
    if (bullet.yPos - bullet.radius <= -400) {
      bullet.destroy = true;
    }
    if (bullet.yPos + bullet.radius >= world.height + 50) {
      bullet.destroy = true;
    }
    obstacles.forEach((obstacle) => {
      if (bullet.team !== "enemy") {
        checkRectangleCollisonForBullet(bullet, obstacle);
      }
    });
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

  blackholes.forEach((blackhole) => {
    const acc = pullAcceleration(blackhole, player.xPos, player.yPos);
    player.vel.y += acc.y;
    player.vel.x += acc.x;

    // drawCircle(
    //   blackhole.xPos,
    //   blackhole.yPos,
    //   Math.sqrt(Math.abs(blackhole.pullForce)) * 0.5,
    //   "black"
    // );
  });

  attackCounter += 1;

  if (attackCounter % currentPhase.cooldown === 0) {
    phaseMoves += 1;
    console.log(phaseMoves);
    // console.log(currentPhase);
  }

  if (enemy.health > (enemyMaxHealth / 5) * 4) {
    // Fas 1
    enemy.phaseOneAttack(phaseMoves);

    // Fas 2
  } else if (enemy.health >= (enemyMaxHealth / 5) * 2.5) {
    if (!hasTransitionedToPhase2) {
      transitionToPhase2(currentPhase);
      phaseMoves = 0;
      attackCounter = 0;
      // console.log("hej");
    }
    enemy.phaseTwoAttack(phaseMoves);
    hasTransitionedToPhase2 = true;

    // Fas 3
  } else if (enemy.health > (enemyMaxHealth / 5) * 1.5) {
    if (!hasTransitionedToPhase3) {
      transitionToPhase3(currentPhase);
      phaseMoves = 0;
      attackCounter = 0;
    }
    enemy.phaseThreeAttack(phaseMoves, attackCounter);
    hasTransitionedToPhase3 = true;
  }
  // if (enemy.health > enemyMaxHealth / 5)
  else if (
    enemy.health > (enemyMaxHealth / 5) * 0.8 &&
    !fifthPhase.hasRegainedHealth
  ) {
    if (!hasTransitionedToPhase4) {
      worldObjects = transitionToPhase4(currentPhase);
      phaseMoves = 0;
      attackCounter = 0;
    }
    enemy.phaseFourAttack(phaseMoves);
    hasTransitionedToPhase4 = true;
  }
  // if (enemy.health > enemyMaxHealth / 5)
  else {
    if (!hasTransitionedToPhase5) {
      transitionToPhase5(currentPhase);
      phaseMoves = 0;
      attackCounter = 0;
    }
    enemy.phaseFiveAttack(phaseMoves);

    hasTransitionedToPhase5 = true;
  }
  // console.log(currentPhase);

  worldObjects.forEach((object) => {
    worldObjects.forEach((otherObject) => {
      checkCollisions(object, otherObject);
      // console.log(object.destroy);
    });
  });

  // console.log(units);

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

  worldObjects = worldObjects.filter(
    (worldObject) => worldObject.health > 0 || worldObject.health === undefined
  );
  worldObjects = worldObjects.filter(
    (worldObject) =>
      worldObject.destroy === false || worldObject.destroy === undefined
  );

  units = units.filter((unit) => unit.health >= 0 || unit.health === undefined);

  bullets = bullets.filter((bullet) => !bullet.destroy);

  // draw objects
  worldObjects.forEach((object) => {
    drawCircle(object.xPos, object.yPos, object.radius, object.color);
  });

  if (playerCopy1.health <= 0) {
    player.health = -100;
    playerCopy2.health = 0;
  } else if (playerCopy2.health <= 0) {
    player.health = 0;
    playerCopy1.health = 0;
  }

  obstacles.forEach((obstacle) => {
    ctx.beginPath();
    ctx.rect(
      obstacle.startPos.x,
      obstacle.startPos.y,
      obstacle.endPos.x - obstacle.startPos.x,
      obstacle.endPos.y - obstacle.startPos.y
    );
    ctx.fillStyle = obstacle.color;
    ctx.fill();

    units.forEach((unit) => {
      if (unit !== enemy) {
        checkRectangleCollison(unit, obstacle);
      }
    });
  });

  ctx.beginPath();
  ctx.rect(0, 0, world.startX, world.height);
  ctx.fillStyle = "black";
  ctx.fill();

  ctx.beginPath();
  ctx.rect(world.width, 0, canvas.width, world.height);
  ctx.fillStyle = "black";
  ctx.fill();
}, delay);

window.addEventListener("mousemove", (event) => {
  mousePos = { x: event.clientX, y: event.clientY };
});

const isKeyDown = keyDownTracker();

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
    if (player.health <= 0) {
      player.health = 100;
      worldObjects.push(player);
      units.push(player);
    } else {
      player.health = 100;
    }

    // createObstacle(0, 0, 400, 800, "black", true);
  }
});
