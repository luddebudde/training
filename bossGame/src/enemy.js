import { makeDirection } from "../makeDirection.js";
import { drawLine } from "../drawLine.js";
import { phaseMoves, player } from "../main.js";
import { world } from "../world.js";
import { createObstacle } from "../createObstacle.js";
import { shootEnemyBullet } from "../shootEnemyBullet.js";
import { shoot } from "../shoot.js";
import { blackholes, createBlackhole } from "../createBlackhole.js";
import { createWalker } from "../createWalker.js";
import { getRandomInRange } from "../getRandomInRange.js";

export const enemyMaxHealth = 600;

let enemyLoadPhase = true;

let hasDecidedDirection = false;
let goingDown = true;

// Phase 2
let shouldStop = false;

export const firstPhase = {
  cooldown: 200,
  shouldPreCharge: true,
};

export const secondPhase = {
  cooldown: 100,
};
export const thirdPhase = {
  cooldown: 6,
  hasTurned: false,
};
export const fourthPhase = {
  cooldown: 1,
  // hasSpawnedHole: false,
};
export const fifthPhase = {
  cooldown: 100,
  hasSpawnedHole: false,
  bulletSpread: 0.3,
};

export let currentPhase = firstPhase;

let oldPhaseMoves = 0;
let randomNumber = 0;

// Enemy stats
let contactDamage = 30;
let speed = 30;

export let enemy = {
  radius: 100,
  xPos: world.width / 2,
  yPos: world.height / 2,
  vel: {
    x: 0,
    y: 0,
  },
  // attackSpeed: 100,
  damage: contactDamage,
  health: enemyMaxHealth,
  mass: 1000,
  color: "red",
  alive: true,
  type: "enemy",
  team: "enemy",

  currentPhase: 1,
  phaseOneAttack: () => {
    if (phaseMoves % 3) {
      if (!hasDecidedDirection) {
        charge();
        hasDecidedDirection = true;
      }
    } else {
      preCharge();
    }
  },

  phaseTwoAttack: (phaseMoves) => {
    if (phaseMoves % 2 === 0) {
      shouldStop = false;
    }
    currentPhase = secondPhase;

    // Charge
    if (phaseMoves % 2 && enemy.yPos === enemy.radius && !shouldStop) {
      enemy.yPos += 1;
      enemy.vel.y = speed;

      // Shoot bullets
      shootEnemyBullet(
        world.width / 2 - enemy.radius,
        enemy.radius * 2.5,
        -5,
        0,
        300,
        70,
        "red"
      );
      shootEnemyBullet(
        world.width / 2 + enemy.radius,
        enemy.radius * 2.5,
        5,
        0,
        300,
        70,
        "red"
      );

      shouldStop = true;
    } else if (
      phaseMoves % 2 &&
      enemy.yPos === world.height - enemy.radius &&
      !shouldStop
    ) {
      enemy.yPos -= 1;
      enemy.vel.y = -speed;

      // Shoot bullets
      shootEnemyBullet(
        world.width / 2 - enemy.radius,
        world.height - enemy.radius * 2.5,
        -5,
        0,
        300,
        70,
        "red"
      );
      shootEnemyBullet(
        world.width / 2 + enemy.radius,
        world.height - enemy.radius * 2.5,
        5,
        0,
        300,
        70,
        "red"
      );

      shouldStop = true;

      // Stop enemy
    } else if (enemy.yPos >= world.height - enemy.radius && shouldStop) {
      enemy.yPos = world.height - enemy.radius;

      enemy.vel.y = 0;
    } else if (enemy.yPos <= enemy.radius && shouldStop) {
      enemy.yPos = enemy.radius;
      enemy.vel.y = 0;
    }
  },
  phaseThreeAttack: (phaseMoves, attackCounter) => {
    // if (phaseMoves % 2 && !thirdPhase.hasTurned) {
    //   enemy.vel.x = -enemy.vel.x;
    //   thirdPhase.hasTurned = true;
    // }

    currentPhase = thirdPhase;
    // console.log(currentPhase.cooldown);
    if (attackCounter % currentPhase.cooldown === 0) {
      const bulletSize = Math.random() * 20;
      shootEnemyBullet(
        Math.random() * world.width,
        -bulletSize,
        0,
        100 / bulletSize,
        bulletSize,
        bulletSize,
        "red"
      );
    }
  },
  phaseFourAttack: (phaseMoves) => {
    currentPhase = fourthPhase;
    // enemy.damage = 0;

    if (phaseMoves % 60 === 0) {
      createWalker(enemy.xPos, enemy.yPos, 0, 10);
      console.log("createWalker");
    }
    // if (phaseMoves % 50 === 0 && !currentPhase.hasSpawnedHole) {
    //   const blackholeRadius = Math.random() * 60 + 40;
    //   createBlackhole(
    //     Math.random() * world.width,
    //     -blackholeRadius,
    //     0,
    //     2,
    //     blackholeRadius,
    //     blackholeRadius * 10,
    //     blackholeRadius * 300
    //   );
    //   currentPhase.hasSpawnedHole = true;
    // } else if (phaseMoves % 50) {
    //   currentPhase.hasSpawnedHole = false;
    // }

    if (enemy.xPos <= enemy.radius && enemy.yPos <= enemy.radius) {
      enemy.vel.x = 0;
      enemy.vel.y = -speed;
    } else if (
      enemy.xPos <= enemy.radius &&
      enemy.yPos >= world.height - enemy.radius
    ) {
      enemy.vel.x = -speed;
      enemy.vel.y = 0;
    } else if (
      enemy.xPos >= world.width - enemy.radius &&
      enemy.yPos >= world.height - enemy.radius
    ) {
      enemy.vel.x = 0;
      enemy.vel.y = speed;
    } else if (
      enemy.xPos >= world.width - enemy.radius &&
      enemy.yPos <= enemy.radius
    ) {
      enemy.vel.x = speed;
      enemy.vel.y = 0;
    }
  },
  phaseFiveAttack: (phaseMoves) => {
    currentPhase = fifthPhase;
    if (phaseMoves !== oldPhaseMoves) {
      randomNumber = Math.random();
    }

    if (phaseMoves % 2 === 0) {
      if (randomNumber * 2 > 0.5) {
        console.log(randomNumber);
        const direction = makeDirection(player, enemy);

        const spreadX = getRandomInRange(
          -fifthPhase.bulletSpread,
          fifthPhase.bulletSpread
        );
        const spreadY = getRandomInRange(
          -fifthPhase.bulletSpread,
          fifthPhase.bulletSpread
        );

        const finalDirection = {
          x: direction.x + spreadX,
          y: direction.y + spreadY,
        };

        shootEnemyBullet(
          enemy.xPos,
          enemy.yPos,
          finalDirection.x * 15,
          finalDirection.y * 15,
          2.5,
          15,
          "red"
        );
      }
      // oldPlayerPos.x = player.xPos;
      // oldPlayerPos.y = player.yPos;
      preCharge();
    } else {
      charge();
    }
    oldPhaseMoves = phaseMoves;

    // if (phaseMoves % 20 === 0 && !currentPhase.hasSpawnedHole) {
    //   const blackholeRadius = Math.random() * 60 + 40;
    //   createBlackhole(
    //     Math.random() * world.width,
    //     -blackholeRadius,
    //     0,
    //     2,
    //     blackholeRadius,
    //     blackholeRadius * 10,
    //     blackholeRadius * 300
    //   );
    //   currentPhase.hasSpawnedHole = true;
    // } else if (phaseMoves % 50) {
    //   currentPhase.hasSpawnedHole = false;
    // }
  },
};

const oldPlayerPos = {
  x: 0,
  y: 0,
};

export const preCharge = () => {
  oldPlayerPos.x = player.xPos;
  oldPlayerPos.y = player.yPos;
  enemy.vel.x = 0;
  enemy.vel.y = 0;
  const lineX1 = enemy.xPos - enemy.radius;
  const lineX2 = enemy.xPos + enemy.radius;
  const lineY1 = enemy.yPos - enemy.radius;
  const lineY2 = enemy.yPos + enemy.radius;

  drawLine(lineX1, enemy.yPos, oldPlayerPos.x, oldPlayerPos.y);
  drawLine(lineX2, enemy.yPos, oldPlayerPos.x, oldPlayerPos.y);
  drawLine(enemy.xPos, lineY1, oldPlayerPos.x, oldPlayerPos.y);
  drawLine(enemy.xPos, lineY2, oldPlayerPos.x, oldPlayerPos.y);

  hasDecidedDirection = false;
};

export const charge = () => {
  if (!hasDecidedDirection) {
    const direction = makeDirection(enemy, oldPlayerPos);
    enemy.vel.x -= direction.x * speed;
    enemy.vel.y -= direction.y * speed;

    hasDecidedDirection = true;

    setInterval(() => {
      firstPhase.shouldPreCharge = !firstPhase.shouldPreCharge;
    }, firstPhase.cooldown * 2);
  }
};
