import { makeDirection } from "../makeDirection.js";
import { drawLine } from "../drawLine.js";
import { bullets, obstacles, phaseMoves, player } from "../main.js";
import { world } from "../world.js";
import { createMovingObstacle, createObstacle } from "../createObstacle.js";
import { shootEnemyBullet } from "../shootEnemyBullet.js";
import { shoot } from "../shoot.js";
import { blackholes, createBlackhole } from "../createBlackhole.js";
import { createWalker } from "../createWalker.js";
import { getRandomInRange } from "../getRandomInRange.js";

export const enemyMaxHealth = 3000;

let enemyLoadPhase = true;

let hasDecidedDirection = false;
let goingDown = true;

// Phase 2
let shouldStop = false;

export const firstPhase = {
  // cooldown: 200,
  cooldown: 400,
  shouldPreCharge: true,
};

export const secondPhase = {
  // cooldown: 75,
  cooldown: 150,
};
export const thirdPhase = {
  // cooldown: 6,
  cooldown: 12,
  hasTurned: false,
};
export const fourthPhase = {
  // cooldown: 1,
  cooldown: 2,
  // hasSpawnedHole: false,
};
export let fifthPhase = {
  // cooldown: 100,
  cooldown: 200,

  bulletSpread: 0.3,

  bulletRainDelayRemaining: 100,
  bulletRainDelay: 100,
  pushFrequency: 4,

  hasPushed: false,
  hasSpawedObstacle: false,
  hasSpawnedHole: false,

  hasRegainedHealth: false,
};

export let firstPhaseHard = {
  hasSpawnedObstacle: false,
};

const obstacleSpawnPos = [];

let i = 0;
i < 5;
i++;
{
  obstacleSpawnPos.push((world.width / 6) * i);
}
export let currentPhase = firstPhase;

let oldVel = 0;
let randomNumber = 0;

// Enemy stats
let contactDamage = 30;
let speed = 25;
let hasDecreasedRainDelay = true;

// Increase blackhole stats
let pullRadiusIncreasement = 0;
let pullForceIncreasement = 0;
let hasIncreasedBlackhole = 0;

export let enemy = {
  hardMode: false,
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
        charge(speed);
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
    if (enemy.health <= enemyMaxHealth / 20 && !fifthPhase.hasRegainedHealth) {
      enemy.health += 1000;
      enemy.enemyMaxHealth += 1000;
      fifthPhase.hasRegainedHealth = true;
    }
    // if (phaseMoves !== oldVel) {
    //   randomNumber = Math.random();
    // }
    // if (enemy.radius <= 125) {
    //   enemy.radius += 1;
    // }

    if (phaseMoves % 2 === 0) {
      if (phaseMoves >= 10 && !hasIncreasedBlackhole) {
        pullRadiusIncreasement += 200;
        pullForceIncreasement += 500;
        hasIncreasedBlackhole = true;

        // obstacles.forEach((obstacle) => {
        //   obstacle.endPos.x += 10;
        //   obstacle.endPos.y += 10;
        // });
      }
      // console.log(pullRadiusIncreasement, pullForceIncreasement);
      // if (randomNumber * 2 > 0.5) {
      // console.log(randomNumber);
      const direction = makeDirection(player, enemy);

      // if (oldVel.y !== enemy.vel.y) {
      //   console.log(oldVel);
      // }

      if (phaseMoves >= 4) {
        // console.log("hej");
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

        // bullets.forEach((bullet) => {
        //   console.log(bullet);
        // });
        // console.log(bullets);
      }

      // }
      // oldPlayerPos.x = player.xPos;
      // oldPlayerPos.y = player.yPos;
      preCharge();
    } else {
      charge(speed * 0.9);
      // hasIncreasedBlackhole = false;
    }

    // if (phaseMoves >= 0 && !currentPhase.hasSpawnedHole) {
    //   createBlackhole(enemy.xPos, enemy.yPos, 0, 0, 0, 0);
    //   currentPhase.hasSpawnedHole = true;
    // }
    // blackholes.forEach((blackhole) => {
    //   blackhole.xPos = enemy.xPos;
    //   blackhole.yPos = enemy.yPos;
    //   blackhole.pullRadius = pullRadiusIncreasement;
    //   blackhole.pullForce = pullForceIncreasement;
    // });

    if (phaseMoves >= 6) {
      if (fifthPhase.bulletRainDelayRemaining <= 0) {
        const bulletRadius = 20;
        shootEnemyBullet(
          Math.random() * world.width,
          -bulletRadius,
          0,
          15,
          5,
          bulletRadius,
          "red"
        );
        fifthPhase.bulletRainDelayRemaining = fifthPhase.bulletRainDelay;
        // hasDecreasedRainDelay = false;
      } else if (
        phaseMoves % 2 == 0 &&
        !hasDecreasedRainDelay &&
        fifthPhase.bulletRainDelay >= 10
      ) {
        fifthPhase.bulletRainDelay = fifthPhase.bulletRainDelay * 0.8;
        hasDecreasedRainDelay = true;
      } else if (phaseMoves % 2) {
        hasDecreasedRainDelay = false;
      }
    }
    fifthPhase.bulletRainDelayRemaining -= 1;

    // console.log(fifthPhase.bulletRainDelay);

    // if (phaseMoves >= 10) {
    //   if (
    //     phaseMoves % fifthPhase.pushFrequency === 0 &&
    //     !fifthPhase.hasPushed
    //   ) {
    //     const direction = makeDirection(player, enemy);
    //     player.vel.x -= direction.x * 5;
    //     player.vel.y -= direction.y * 5;
    //     fifthPhase.hasPushed = true;
    //   } else if (phaseMoves % fifthPhase.pushFrequency) {
    //     fifthPhase.hasPushed = false;
    //   }
    //   if (phaseMoves <= 15) {
    //     fifthPhase.pushFrequency = 4;
    //   } else if (phaseMoves <= 25) {
    //     fifthPhase.pushFrequency = 3;
    //   } else if (phaseMoves >= 40) {
    //     fifthPhase.pushFrequency = 2;
    //   }
    //   // fifthPhase.hasPushed = false;
    // }
    // console.log(fifthPhase.hasPushed);

    if (phaseMoves >= 16) {
      if (world.width >= 1000) {
        // createObstacle(
        // world.width, 0, canvas.width, world.height, "black", false;
        // );

        // createObstacle(0, 0, world.startX, world.height, "black", false);
        // createObstacle(
        //   world.startX - 1,
        //   world.height,
        //   0,
        //   world.height,
        //   "black",
        //   false
        // );
        world.width -= 1;
        world.startX += 1;
      }
    }

    if (
      phaseMoves >= 50 &&
      enemy.yPos <= enemy.radius * 1 &&
      !fifthPhase.hasRainedBulletRow
    ) {
      // fifthPhase.hasRainedBulletRow = true
      // Gör detta 5 gånger
      for (let i = 0; i < 25; i++) {
        // Kalla på funktionen och skicka med nödvändiga argument
        shootEnemyBullet(world.startX + i * 60, 0, 0, 20, 20, 30, "red");
      }
    }
    // if (phaseMoves >= 4 && !fifthPhase.hasSpawedObstacle) {
    //   createObstacle(0, 0, 0, world.height, "black", false);
    // }

    // oldVel = enemy.vel;

    // if (phaseMoves % 3 === 0 && !currentPhase.hasSpawnedHole) {
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
    // } else if (phaseMoves % 3) {
    //   currentPhase.hasSpawnedHole = false;
    // }
  },
  phaseOneAttackHardMode: (phaseMoves) => {
    if (phaseMoves % 3) {
      if (!hasDecidedDirection) {
        charge(speed);
        hasDecidedDirection = true;
      }
    } else {
      preCharge();
    }
    if (phaseMoves % 2 && !firstPhaseHard.hasSpawnedObstacle) {
      // const amountOfObstacles = Math.round(Math.random() * 5);
      // for (let i = 0; i < 6; i++) {
      //   const randomNumber = Math.floor(Math.random() * 6) * (world.width / 6);

      // createMovingObstacle(
      //   randomNumber,
      //   -300,
      //   randomNumber + world.width / 6,
      //   0,
      //   "black",
      //   false,
      //   0,
      //   10
      // );
      // }

      const randomNumber = Math.random() * (world.width - 200);
      // (world.width / 6)
      //  * Math.round(Math.random() * 5);

      createMovingObstacle(0, -300, randomNumber, 0, "black", false, 0, 5);
      createMovingObstacle(
        world.width,
        -300,
        randomNumber + 200,
        0,
        "black",
        false,
        0,
        5
      );

      firstPhaseHard.hasSpawnedObstacle = true;
    } else if (phaseMoves % 2 === 0) {
      firstPhaseHard.hasSpawnedObstacle = false;
    }
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

export const charge = (chargeSpeed) => {
  if (!hasDecidedDirection) {
    const direction = makeDirection(enemy, oldPlayerPos);
    enemy.vel.x -= direction.x * chargeSpeed;
    enemy.vel.y -= direction.y * chargeSpeed;

    hasDecidedDirection = true;

    setInterval(() => {
      firstPhase.shouldPreCharge = !firstPhase.shouldPreCharge;
    }, firstPhase.cooldown * 2);
  }
};
