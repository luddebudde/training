import {
  bossPool,
  bullets,
  clearArray,
  entities,
  lines,
  liveBosses,
  squares,
} from "../arrays";
import { world } from "../basics";
import { createBlackhole } from "../createBlackHole";
import { createBullet, createWaveShoot } from "../createBullet";
import { player, standardPlayer } from "../createPlayer";
import { dealDamage } from "../dealDamage";
import { drawCircle } from "../draw/drawCircle";
import { drawLine } from "../draw/drawLine";
import { drawSquare } from "../draw/drawSquare";
import { getClosestOfArray } from "../geometry/getClosestOfArray";
import { isPlayerBetweenEnemies } from "../geometry/isPlayerBetweenEnemies";
import { lineBetween } from "../geometry/lineBetween";
import { makeDirection } from "../geometry/makeDirection";
import { goTo } from "../goTo";
import { multVar, origo, Vec2 } from "../math";
import { randomArrayElement } from "../randomArrayElement";
import { createSprayerBoss } from "./sprayer";

const health = 150;

const width = 200;
const height = width;

const startPos = {
  x: world.width / 2 - width / 2,
  y: world.height / 2 - height / 2,
};

let standardPlayerCopy;

setTimeout(() => {
  standardPlayerCopy = structuredClone(standardPlayer);
}, 10);

const changeStandardPlayerCopy = (
  element: keyof typeof standardPlayer | number,
  op: string,
  value: number,
  timePassedOut: number
) => {
  let key = (
    typeof element === "string"
      ? element
      : Object.keys(standardPlayer).find(
          (k) => standardPlayer[k as keyof typeof standardPlayer] === element
        )
  ) as keyof typeof standardPlayer;

  if (!key) return console.error("Egenskap hittades inte.");

  const operations: Record<string, (a: number, b: number) => number> = {
    "+": (a, b) => a + b,
    "-": (a, b) => a - b,
    "*": (a, b) => a * b,
    "/": (a, b) => (b !== 0 ? a / b : a),
  };

  if (!operations[op]) return console.error("Ogiltig operation.");

  standardPlayer[key] = operations[op](standardPlayer[key], value);

  setTimeout(() => {
    standardPlayer[key] = standardPlayerCopy[key];
  }, timePassedOut);
};

// Heavy attacker
const rect1 = {
  name: "Damage dealer",
  cornerPos: {
    x: 0,
    y: 0,
  },
  gatherPos: {
    x: startPos.x - width / 2,
    y: startPos.y - height / 2,
  },
  rotationAxis: {
    x: 0,
    y: 0,
  },
  // x: startPos.x - width / 2,
  // y: startPos.y - height / 2,
  x: 0,
  y: 0,
  width: width,
  height: height,
  color: "red",
  rotation: 0 * Math.PI,

  vel: {
    x: 0,
    y: 0,
  },

  team: "enemy",

  attackCounter: 50,
  maxHealth: 100,
  health: 100,

  // Phases
  shootFromCorners: () => {
    rect1.attackCounter--;

    if (rect1.attackCounter < 0) {
      const rectPos = {
        x: rect1.x + rect1.width / 2,
        y: rect1.y + rect1.height / 2,
      };

      createWaveShoot(
        bullets,
        rect1,
        player.pos,
        10,
        20,
        1,
        3,
        {},
        {
          startPos: {
            x: rectPos.x,
            y: rectPos.y,
          },
          color: "darkred",
          team: "enemy",
        }
      );

      rect1.attackCounter = 25;
    }
  },
  gatherUp: () => {
    rect1.attackCounter--;

    if (rect1.attackCounter < 0) {
      createBullet(
        bullets,
        rect1,
        player.pos,
        2,
        20,
        {},
        { startPos: { x: rect1.x, y: rect1.y } }
      );

      rect1.attackCounter = 25;
    }
  },
  rotationPhase: (ctx, rectList, rectPos: Vec2) => {
    rect1.attackCounter--;

    if (rect1.attackCounter <= 0) {
      createBullet(
        bullets,
        rect1,
        player.pos,
        5,
        25,
        {},
        {
          startPos: rectPos,
          color: "darkred",
        }
      );
      rect1.attackCounter = 10;
    }
  },
};

// Debuffer
const rect2 = {
  name: "Debuffer",
  cornerPos: {
    x: world.width - width,
    y: 0,
  },
  gatherPos: {
    x: startPos.x + width / 2,
    y: startPos.y - height / 2,
  },
  rotationAxis: {
    x: 0,
    y: 0,
  },
  // x: startPos.x + width / 2,
  // y: startPos.y - height / 2,
  x: world.width - width,
  y: 0,
  width: width,
  height: height,
  color: "blue",
  rotation: 0 * Math.PI,

  vel: {
    x: 0,
    y: 0,
  },

  team: "enemy",

  attackCounter: 50,
  maxHealth: 100,
  health: 100,

  // Phases
  shootFromCorners: () => {
    rect2.attackCounter--;

    const rectPos = {
      x: rect2.x + rect2.width / 2,
      y: rect2.y + rect2.height / 2,
    };

    if (rect2.attackCounter < 0) {
      setTimeout(() => {
        createBullet(
          bullets,
          rect2,
          player.pos,
          0,
          40,
          {},
          {
            bulletRadius: 5,
            startPos: rectPos,
            onHit: (entity, bullet) => {
              changeStandardPlayerCopy("speed", "*", 0.5, 1000);
            },
            color: "purple",
            team: "enemy",
          }
        );
      }, 1000);

      rect2.attackCounter = 50;
    }
  },
  gatherUp: () => {
    rect2.attackCounter--;

    if (rect2.attackCounter < 0) {
      const randomNumber = Math.random();

      if (randomNumber <= 0.33) {
        changeStandardPlayerCopy("speed", "*", 0.8, 12000);
        console.log("speed", player.speed);
      } else if (randomNumber <= 0.66) {
        changeStandardPlayerCopy("attackDelay", "*", 1.2, 12000);
        console.log("attackDelay", player.attackDelay);
      } else {
        changeStandardPlayerCopy("radius", "+", 5, 12000);
        console.log("radius", player.radius);
      }

      rect2.attackCounter = 75;
    }
  },
  rotationPhase: (ctx, rectList, rectPos: Vec2) => {
    rect2.attackCounter--;

    if (rect2.attackCounter <= 0) {
      createWaveShoot(
        bullets,
        rect2,
        player.pos,
        10,
        25,
        0.5,
        4,
        {},
        {
          startPos: rectPos,
          bulletRadius: 30,
          color: "darkblue",
          team: "enemy",
        }
      );
      rect2.attackCounter = 150;
    }
  },
};

// Passive Support
const rect3 = {
  name: "Healer",
  cornerPos: {
    x: 0,
    y: world.height - height,
  },
  gatherPos: {
    x: startPos.x - width / 2,
    y: startPos.y + height / 2,
  },
  rotationAxis: {
    x: 0,
    y: 0,
  },
  // x: startPos.x - width / 2,
  // y: startPos.y + height / 2,
  x: 0,
  y: world.height - height,
  width: width,
  height: height,
  color: "green",
  rotation: 0 * Math.PI,

  vel: {
    x: 0,
    y: 0,
  },

  team: "enemy",

  attackCounter: 50,
  maxHealth: 100,
  health: 100,

  // Phases
  shootFromCorners: (ctx, rectList) => {
    rect3.attackCounter--;
    if (rect3.attackCounter < 0) {
      const randomRect = randomArrayElement(rectList);

      const rectPos = {
        x: rect3.x + rect3.width / 2,
        y: rect3.y + rect3.height / 2,
      };

      const randomRectPos = {
        x: randomRect.x + randomRect.width / 2,
        y: randomRect.y + randomRect.height / 2,
      };

      const bullet = createBullet(
        bullets,
        rect3,
        player.pos,
        -10,
        0,
        {},
        {
          bulletRadius: 20,
          startPos: rectPos,
          team: "enemy",
        }
      );

      goTo(bullet, randomRectPos, 50, () => (randomRect.health += 20));

      rect3.attackCounter = 50;
    }
  },
  gatherUp: (ctx, rectList) => {
    rect3.attackCounter--;

    if (rect3.attackCounter < 0) {
      rectList.forEach((rect) => {
        rect.health += 8;
        player.health += 3;
      });

      rect3.attackCounter = 75;
    }
  },
  rotatePhaseHealCounter: 0,
  rotationPhase: (ctx, rectList, rectPos: Vec2) => {
    rect3.attackCounter--;

    if (rect3.attackCounter <= 0) {
      createBullet(
        bullets,
        rect3,
        player.pos,
        -10,
        -25,
        { bounceable: true, bounceDamageLoss: 1.05 },
        {
          startPos: rectPos,
          color: "lime",
        }
      );
      rect3.attackCounter = 200;

      rect3.rotatePhaseHealCounter++;

      if (rect3.rotatePhaseHealCounter % 2 === 0) {
        rectList.forEach((rect) => {
          rect.health += 20;
        });
      }
    }
  },
};

// Light Attacker / Attack support
const rect4 = {
  name: "Support attacker",
  cornerPos: {
    x: world.width - width,
    y: world.height - height,
  },
  gatherPos: {
    x: startPos.x + width / 2,
    y: startPos.y + height / 2,
  },
  rotationAxis: {
    x: 0,
    y: 0,
  },
  // x: startPos.x + width / 2,
  // y: startPos.y + height / 2,
  x: world.width - width,
  y: world.height - height,
  width: width,
  height: height,
  color: "yellow",
  rotation: 0 * Math.PI,

  vel: {
    x: 0,
    y: 0,
  },

  team: "enemy",

  attackCounter: 50,
  maxHealth: 100,
  health: 100,

  // Phases
  shootFromCorners: () => {
    rect4.attackCounter--;

    if (rect4.attackCounter < 0) {
      rect4.attackCounter = 500;

      const rectPos = {
        x: rect4.x + rect4.width / 2,
        y: rect4.y + rect4.height / 2,
      };

      const maxI = 50;

      for (let i = 0; i < maxI; i++) {
        setTimeout(() => {
          const angle = (i / maxI) * Math.PI * 2;
          const target: Vec2 = {
            x: rect4.x + Math.cos(angle) * 100,
            y: rect4.y - Math.sin(angle) * 100,
          };

          createBullet(
            bullets,
            rect4,
            target,
            5,
            20,
            {},
            { startPos: rectPos }
          );
        }, 60 * i);
      }
    }
  },
  gatherUp: () => {
    rect4.attackCounter--;

    if (rect4.attackCounter < 0) {
      createWaveShoot(
        bullets,
        rect3,
        player.pos,
        5,
        15,
        Math.PI * 0.5,
        5,
        {},
        { startPos: { x: rect4.x, y: rect4.y }, team: rect4.team }
      );

      rect4.attackCounter = 75;
    }
  },
  rotationPhase: (ctx, rectList, rectPos: Vec2) => {
    rect4.attackCounter--;

    if (rect4.attackCounter <= 0) {
      createBullet(
        bullets,
        rect4,
        player.pos,
        10,
        -25,
        {
          bounceable: true,
          bounceDamageLoss: 0.5,
        },
        {
          startPos: rectPos,
          color: "#c2ab19",
        }
      );

      rect4.attackCounter = 100;
    }
  },
};

let rectList = [rect1, rect2, rect3, rect4];

const updateRectList = () => {
  rectList.forEach((cube) => {
    cube.x = cube.x + cube.vel.x;
    cube.y = cube.y + cube.vel.y;
  });

  rectList = rectList.filter((square) => square.health >= 0);

  if (rectList.length > 0) {
    requestAnimationFrame(updateRectList);
  }
};

updateRectList();

// Phases
const moveToCorners = (ctx) => {
  currentPhase = "gatherUp";
  let rectsReady = 0;

  for (let i = 0; i < rectList.length; i++) {
    const rect = rectList[i];
    goTo(rect, rect.cornerPos, 100, () => rectsReady++);
  }

  setTimeout(() => {
    // if (liveBosses.length === 0) {
    shootFromCorners(ctx);
    // }
  }, 1500);
};

const shootFromCorners = (ctx) => {
  const shootCornerMaxCount = 1000;
  // const shootCornerMaxCount = 100;
  for (let frameLoops = 0; frameLoops < shootCornerMaxCount; frameLoops++) {
    setTimeout(() => {
      for (let i = 0; i < rectList.length; i++) {
        const rect = rectList[i];
        rect.shootFromCorners(ctx, rectList);
      }

      if (frameLoops === shootCornerMaxCount - 1) {
        gatherUp(ctx);
      }
    }, 10 * frameLoops);
  }
};

let currentPhase = "";
let previusClosestRect;

const gatherUp = (ctx) => {
  currentPhase = "gatherUp";
  rectList.forEach((rect) => {
    goTo(rect, rect.gatherPos, 100);
    // });
    // rectList.forEach((rect) => {
    rect.attackCounter = 10;
  });

  const drawLineToClosestRect = (ctx, closestRect, closestRectPos: Vec2) => {
    drawLine(ctx, player.pos, closestRectPos, closestRect.color);

    if (
      (currentPhase === "gatherUp" && closestRect === previusClosestRect) ||
      previusClosestRect === undefined
    ) {
      requestAnimationFrame(() =>
        drawLineToClosestRect(ctx, closestRect, closestRectPos)
      );
    }
  };

  const loopCount = 100;
  const loopDelay = 10;
  setTimeout(() => {
    for (let frameLoops = 0; frameLoops < loopCount; frameLoops++) {
      if (liveBosses.length === 0) {
        console.log("All cubes are dead");

        return;
      } else {
        console.log(rectList.length);
      }
      setTimeout(() => {
        // Idea: The closest rectangle applies an effect or attack, depending on which one it is.
        // Heavy attacker: Shoots violently
        // Debuffer: Makes the player either larger, slower or deal less damage every X seconds
        // Healer: Increases health of the others
        // Support damager: Same as heavy

        // After these the next phase as the big square in the middle starts, with the effects above applied (except heavy attacker)

        const newClosestRect = getClosestOfArray(player.pos, rectList);
        const newClosestRectPos = {
          x: newClosestRect.x + newClosestRect.width / 2,
          y: newClosestRect.y + newClosestRect.height / 2,
        };

        if (previusClosestRect !== newClosestRect) {
          previusClosestRect = newClosestRect;
          drawLineToClosestRect(ctx, newClosestRect, newClosestRectPos);
        }

        rectList.forEach((rect) => {
          if (rect === previusClosestRect) {
            rect.gatherUp(ctx, rectList);
          }
        });
        // console.log(frameLoops);
      }, loopDelay * frameLoops);
    }
    setTimeout(() => {
      rotatePhase(ctx);
    }, loopCount * loopDelay);
  }, 2000);
};

const rotatePhase = (ctx) => {
  currentPhase = "rotationPhase";
  let centerX = 0,
    centerY = 0;
  const n = rectList.length;
  rectList.forEach((rect) => {
    centerX += rect.x + rect.width / 2;
    centerY += rect.y + rect.height / 2;
  });
  centerX /= n;
  centerY /= n;

  const centerPos = {
    x: centerX,
    y: centerY,
  };

  let blackholeCounter = 0;

  const angle = 0.04;
  const turns = 2;

  const fullRotation = 2 * Math.PI;
  const totalRotation = fullRotation * turns;
  const requiredLoops = totalRotation / angle;

  const delayPerLoop = 10; // ms
  for (let i = 0; i < requiredLoops; i++) {
    setTimeout(() => {
      if (rectList.length <= 0) {
        console.log("All cubes are dead");

        return;
      }

      rectList.forEach((rect) => {
        const rectCenter = {
          x: rect.x + rect.width / 2,
          y: rect.y + rect.height / 2,
        };

        const offsetX = rectCenter.x - centerPos.x;
        const offsetY = rectCenter.y - centerPos.y;
        const rotatedOffsetX =
          offsetX * Math.cos(angle) - offsetY * Math.sin(angle);
        const rotatedOffsetY =
          offsetX * Math.sin(angle) + offsetY * Math.cos(angle);
        const newCenterX = centerPos.x + rotatedOffsetX;
        const newCenterY = centerPos.y + rotatedOffsetY;
        rect.x = newCenterX - rect.width / 2;
        rect.y = newCenterY - rect.height / 2;
        rect.rotation += angle;

        rect.rotationPhase(ctx, rectList, rectCenter);
      });

      blackholeCounter--;
      if (blackholeCounter <= 0) {
        createBlackhole(
          centerPos,
          multVar(makeDirection(centerPos, player.pos), 3),
          50,
          250
        );
        blackholeCounter = 350;
      }
    }, delayPerLoop * i);
  }

  setTimeout(() => {
    moveToCorners(ctx);
  }, delayPerLoop * requiredLoops);
};

export const createLargeSquareBoss = (ctx) => {
  // const cubeBoss = {
  //   maxHealth: health,
  //   health: health,
  //   contactDamage: 0,
  //   pos: {
  //     x: world.width / 2,
  //     y: 400,
  //   },
  //   vel: {
  //     x: 0,
  //     y: 0,
  //   },
  //   radius: 1.2,
  //   color: "purple",
  //   speed: 50,
  //   team: "enemy",
  //   mass: 1000,

  //   damageConflicted: 0,
  //   absorbedDamage: 0,

  //   collision: false,
  //   airFriction: 1,

  //   // Pahses
  //   rectangles: [rect1, rect2, rect3, rect4],
  //   phaseCounter: -1,

  //   // phaseList: [moveToCorners],
  //   phaseList: [gatherUp],
  //   currentPhase: "",
  //   closestRect: "",
  //   largeAttackCounter: 0,
  //   rectanglesLive: true,

  // update: (ctx): void => {
  //   rectList.forEach((cube) => {
  //     cube.x = cube.x + cube.vel.x;
  //     cube.y = cube.y + cube.vel.y;
  //   });

  //   console.log("!Dlkopösfxjvi9öoesyeflinwsuy3wl bku");

  //   rectList = rectList.filter((square) => square.health >= 0);

  //   if (cubeBoss.phaseCounter < 0) {
  //     const nextPhase = randomArrayElement(cubeBoss.phaseList);

  //     nextPhase(ctx, cubeBoss);

  //     cubeBoss.phaseCounter = 10000;
  //   }
  // },
  //   // deathAnimation: (ctx, liveBosses, bossIndex) => {},
  // };

  // entities.push(cubeBoss);
  // liveBosses.push(cubeBoss);

  rectList.forEach((rect) => {
    squares.push(rect);
    liveBosses.push(rect);

    rect.rotationAxis = {
      x: rect.x + rect.width / 2,
      y: rect.y + rect.height / 2,
    };
  });
  gatherUp(ctx);
};
