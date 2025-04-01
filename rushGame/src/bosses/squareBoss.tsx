import {
  bossPool,
  bullets,
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
  shootFromCorners: (ctx, cubeBoss) => {
    rect1.attackCounter--;

    if (rect1.attackCounter < 0) {
      const rectPos = {
        x: rect1.x + rect1.width / 2,
        y: rect1.y + rect1.height / 2,
      };

      const bullet = createWaveShoot(
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
  gatherUp: (ctx, cubeBoss, rectPos: Vec2) => {
    rect1.attackCounter--;

    if (rect1.attackCounter < 0) {
      createBullet(
        bullets,
        rect1,
        player.pos,
        2,
        20,
        {},
        { startPos: rectPos }
      );

      rect1.attackCounter = 25;
    }
  },
  rotationPhase: (ctx, cubeBoss, rectPos: Vec2) => {
    rect1.attackCounter--;

    if (rect1.attackCounter <= 0) {
      createBullet(
        bullets,
        cubeBoss,
        player.pos,
        10,
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
  shootFromCorners: (ctx, cubeBoss) => {
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
              changeStandardPlayerCopy("speed", "*", 0.5, 1000); // Ändrar speed
            },
            color: "purple",
            team: "enemy",
          }
        );
      }, 1000);

      rect2.attackCounter = 50;
    }
  },
  gatherUp: (ctx, cubeBoss) => {
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
  rotationPhase: (ctx, cubeBoss, rectPos: Vec2) => {
    rect2.attackCounter--;

    if (rect2.attackCounter <= 0) {
      createWaveShoot(
        bullets,
        cubeBoss,
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
  shootFromCorners: (ctx, cubeBoss) => {
    rect3.attackCounter--;
    if (rect3.attackCounter < 0) {
      const randomRect = randomArrayElement(cubeBoss.rectangles);

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

      goTo(bullet, randomRectPos, 50, () => (cubeBoss.health += 20));

      rect3.attackCounter = 50;
    }
  },
  gatherUp: (ctx, cubeBoss) => {
    rect3.attackCounter--;

    if (rect3.attackCounter < 0) {
      cubeBoss.rectangles.forEach((rect) => {
        rect.health += 8;
      });

      rect3.attackCounter = 25;
    }
  },
  rotationPhase: (ctx, cubeBoss, rectPos: Vec2) => {
    rect3.attackCounter--;

    if (rect3.attackCounter <= 0) {
      createBullet(
        bullets,
        cubeBoss,
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
    }
  },
};

// Light Attacker / Attack support
const rect4 = {
  name: "Support attacker",
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
  shootFromCorners: (ctx, cubeBoss) => {
    rect4.attackCounter--;
    const rectPos = {
      x: rect4.x + rect4.width / 2,
      y: rect4.y + rect4.height / 2,
    };

    if (rect4.attackCounter < 0) {
      rect4.attackCounter = 500;

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
  gatherUpMeter: 0,
  gatherUp: (ctx, cubeBoss) => {
    rect4.gatherUpMeter++;
    console.log(rect4.gatherUpMeter);
  },
  rotationPhase: (ctx, cubeBoss, rectPos: Vec2) => {
    rect4.attackCounter--;

    if (rect4.attackCounter <= 0) {
      createBullet(
        bullets,
        cubeBoss,
        player.pos,
        10,
        -25,
        {
          bounceable: true,
          bounceDamageLoss: 0.5 + rect4.gatherUpMeter / 2000,
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

// Phases
const moveToCorners = (ctx, cubeBoss) => {
  cubeBoss.currentPhase = "moveToCorners";
  const endPoseList = [
    // Top Left
    { x: 0, y: 0 },
    // Top Right
    { x: world.width - width, y: 0 },
    // Bottom Left
    { x: 0, y: world.height - height },
    // Bottom Right
    { x: world.width - width, y: world.height - height },
  ];

  let rectsReady = 0;

  for (let i = 0; i < cubeBoss.rectangles.length; i++) {
    const rect = cubeBoss.rectangles[i];
    const target = endPoseList[i];

    goTo(rect, target, 100, () => rectsReady++);
  }

  setTimeout(() => {
    shootFromCorners(ctx, cubeBoss);
  }, 1500);
};

const shootFromCorners = (ctx, cubeBoss) => {
  cubeBoss.currentPhase = "shootFromCorners";
  const shootCornerMaxCount = 1000;
  // const shootCornerMaxCount = 100;
  for (let frameLoops = 0; frameLoops < shootCornerMaxCount; frameLoops++) {
    setTimeout(() => {
      for (let i = 0; i < cubeBoss.rectangles.length; i++) {
        const rect = cubeBoss.rectangles[i];
        rect.shootFromCorners(ctx, cubeBoss);
      }

      if (frameLoops === shootCornerMaxCount - 1) {
        gatherUp(ctx, cubeBoss);
      }
    }, 10 * frameLoops);
  }
};

const gatherUp = (ctx, cubeBoss) => {
  cubeBoss.currentPhase = "gatherUp";

  cubeBoss.rectangles.forEach((rect) => {
    goTo(rect, rect.gatherPos, 100);
  });

  cubeBoss.rectangles.forEach((rect) => {
    rect.attackCounter = 10;
  });

  const drawLineToClosestRect = (ctx, closestRect, closestRectPos: Vec2) => {
    drawLine(ctx, player.pos, closestRectPos, closestRect.color);
    if (
      cubeBoss.currentPhase === "gatherUp" &&
      cubeBoss.closestRect === closestRect
    ) {
      requestAnimationFrame(() =>
        drawLineToClosestRect(ctx, closestRect, closestRectPos)
      );
    }
  };

  const shootCornerMaxCount = 1000;
  // const shootCornerMaxCount = 10;
  const loopDelay = 10;
  setTimeout(() => {
    for (let frameLoops = 0; frameLoops < shootCornerMaxCount; frameLoops++) {
      setTimeout(() => {
        // Idea: The closest rectangle applies an effect or attack, depending on which one it is.
        // Heavy attacker: Shoots violently
        // Debuffer: Makes the player either larger, slower or deal less damage every X seconds
        // Healer: Increases health of the others
        // Support damager: Attacks during the next phase (either faster or do it too)

        // After these the next phase as the big square in the middle starts, with the effects above applied (except heavy attacker)

        const closestRect = getClosestOfArray(player.pos, cubeBoss.rectangles);
        const closestRectPos = {
          x: closestRect.x + closestRect.width / 2,
          y: closestRect.y + closestRect.height / 2,
        };

        if (cubeBoss.closestRect !== closestRect) {
          cubeBoss.closestRect = closestRect;
          drawLineToClosestRect(ctx, closestRect, closestRectPos);
        }

        cubeBoss.rectangles.forEach((rect) => {
          if (rect === closestRect) {
            rect.gatherUp(ctx, cubeBoss, closestRectPos);
          }
        });
        // console.log(frameLoops);
      }, loopDelay * frameLoops);
    }
    setTimeout(() => {
      rotatePhase(ctx, cubeBoss, 0.01);
    }, shootCornerMaxCount * loopDelay);
  }, 2000);
};

const rotatePhase = (ctx, cubeBoss, angle) => {
  cubeBoss.currentPhase = "rotationPhase";
  let centerX = 0,
    centerY = 0;
  const n = cubeBoss.rectangles.length;
  cubeBoss.rectangles.forEach((rect) => {
    centerX += rect.x + rect.width / 2;
    centerY += rect.y + rect.height / 2;
  });
  centerX /= n;
  centerY /= n;

  const centerPos = {
    x: centerX,
    y: centerY,
  };

  for (let i = 0; i < 5000; i++) {
    setTimeout(() => {
      cubeBoss.rectangles.forEach((rect) => {
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

        rect.rotationPhase(ctx, cubeBoss, rectCenter);
      });
      cubeBoss.largeAttackCounter--;
      if (cubeBoss.largeAttackCounter <= 0) {
        createBlackhole(
          centerPos,
          // origo,
          multVar(makeDirection(centerPos, player.pos), 3),
          50,
          250
        );
        cubeBoss.largeAttackCounter = 350;
      }
    }, 10 * i);
  }
};

export const createLargeSquareBoss = () => {
  const cubeBoss = {
    maxHealth: health,
    health: health,
    contactDamage: 0,
    pos: {
      x: world.width / 2,
      y: 400,
    },
    vel: {
      x: 0,
      y: 0,
    },
    radius: 1.2,
    color: "purple",
    speed: 50,
    team: "enemy",
    mass: 1000,

    damageConflicted: 0,
    absorbedDamage: 0,

    collision: false,
    airFriction: 1,

    // Pahses
    rectangles: [rect1, rect2, rect3, rect4],
    phaseCounter: 0,

    // phaseList: [moveToCorners],
    phaseList: [gatherUp],
    currentPhase: "",
    closestRect: "",
    largeAttackCounter: 0,

    update: (ctx): void => {
      cubeBoss.rectangles.forEach((cube) => {
        cube.x = cube.x + cube.vel.x;
        cube.y = cube.y + cube.vel.y;
      });

      cubeBoss.rectangles = cubeBoss.rectangles.filter(
        (square) => square.health >= 0
      );
      cubeBoss.phaseCounter--;
      if (cubeBoss.phaseCounter < 0) {
        const nextPhase = randomArrayElement(cubeBoss.phaseList);

        nextPhase(ctx, cubeBoss);

        cubeBoss.phaseCounter = 10000;
      }
    },
    // deathAnimation: (ctx, liveBosses, bossIndex) => {},
  };

  entities.push(cubeBoss);
  // liveBosses.push(cubeBoss);

  cubeBoss.rectangles.forEach((rect) => {
    squares.push(rect);
    liveBosses.push(rect);

    rect.rotationAxis = {
      x: rect.x + rect.width / 2,
      y: rect.y + rect.height / 2,
    };
  });

  //   }
};
