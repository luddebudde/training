import { bullets, entities, lines, liveBosses, squares } from "../arrays";
import { world } from "../basics";
import { createBullet, createWaveShoot } from "../createBullet";
import { player } from "../createPlayer";
import { dealDamage } from "../dealDamage";
import { drawCircle } from "../draw/drawCircle";
import { drawLine } from "../draw/drawLine";
import { getClosestOfArray } from "../geometry/getClosestOfArray";
import { isPlayerBetweenEnemies } from "../geometry/isPlayerBetweenEnemies";
import { lineBetween } from "../geometry/lineBetween";
import { goTo } from "../goTo";
import { origo, Vec2 } from "../math";
import { randomArrayElement } from "../randomArrayElement";

const health = 150;

const width = 200;
const height = width;

const startPos = {
  x: world.width / 2 - width / 2,
  y: world.height / 2 - height / 2,
};

// Heavy attacker
const rect1 = {
  name: "Damage dealer",
  gatherPos: {
    x: startPos.x - width / 2,
    y: startPos.y - height / 2,
  },
  x: startPos.x - width / 2,
  y: startPos.y - height / 2,
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

      rect1.attackCounter = 100;
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
  x: startPos.x + width / 2,
  y: startPos.y - height / 2,
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
              player.standardSpeed *= 0.5;

              setTimeout(() => {
                player.standardSpeed *= 2;
              }, 1000);
            },
            color: "purple",
            team: "enemy",
          }
        );
      }, 1000);

      rect2.attackCounter = 200;
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
  x: startPos.x - width / 2,
  y: startPos.y + height / 2,
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
  x: startPos.x + width / 2,
  y: startPos.y + height / 2,
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
  health: 100,

  // Phases
  shootFromCorners: (ctx, cubeBoss) => {
    rect4.attackCounter--;
    const rectPos = {
      x: rect4.x + rect4.width / 2,
      y: rect4.y + rect4.height / 2,
    };

    if (rect4.attackCounter < 0) {
      rect4.attackCounter = 2000;

      const maxI = 50;

      for (let i = 0; i < maxI; i++) {
        setTimeout(() => {
          const angle = (i / maxI) * Math.PI * 2; // 0 till 90 grader
          const target: Vec2 = {
            x: rect4.x + Math.cos(angle) * 100, // Ökad radie för bättre rörelse
            y: rect4.y - Math.sin(angle) * 100, // Minus för att röra sig uppåt
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
        }, 100 * i);
      }
    }
  },
};

// Phases
const moveToCorners = (ctx, cubeBoss) => {
  console.log("corner phase");

  // cubeBoss.rectangles.forEach((rect) => {
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

  for (let i = 0; i < cubeBoss.rectangles.length; i++) {
    const rect = cubeBoss.rectangles[i];
    const target = endPoseList[i];

    goTo(rect, target, 10, () => shootFromCorners(ctx, cubeBoss));
  }
};

const shootFromCorners = (ctx, cubeBoss) => {
  const shootCornerMaxCount = 100;
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
  const shootCornerMaxCount = 1000;
  cubeBoss.rectangles.forEach((rect) => {
    goTo(rect, rect.gatherPos, 100);
  });

  setTimeout(() => {
    for (let frameLoops = 0; frameLoops < shootCornerMaxCount; frameLoops++) {
      setTimeout(() => {
        const rectPos = {
          x: rect4.x + rect4.width / 2,
          y: rect4.y + rect4.height / 2,
        };

        // Idea: The closest rectangle applies an effect or attack, depending on which one it is.
        // Heavy attacker: Shoots violently
        // Debuffer: Makes the player either larger, slower or deal less damage every X seconds
        // Healer: Increases health of the others
        // Support damager: Attacks during the next phase (either faster or do it too)

        // After these the next phase as the big square in the middle starts, with the effects above applied (except heavy attacker)

        const closestRect = getClosestOfArray(player.pos, cubeBoss.rectangles);

        console.log(closestRect.name);
      }, 100 * frameLoops);

      // console.log(closestRect.name);
    }
  }, 1000);
};

export const createLargeSquareBoss = () => {
  const cubeBoss = {
    maxHealth: health,
    health: health,
    contactDamage: 20,
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

    collision: true,
    airFriction: false,

    // Pahses
    rectangles: [rect1, rect2, rect3, rect4],
    phaseCounter: 0,

    phaseList: [moveToCorners],

    update: (ctx): void => {
      cubeBoss.rectangles.forEach((cube) => {
        cube.x = cube.x + cube.vel.x;
        cube.y = cube.y + cube.vel.y;
      });

      // smallCube.x = smallCube.pos.x;
      // smallCube.y = smallCube.pos.y;
      cubeBoss.phaseCounter--;
      if (cubeBoss.phaseCounter < 0) {
        const nextPhase = randomArrayElement(cubeBoss.phaseList);

        nextPhase(ctx, cubeBoss);

        cubeBoss.phaseCounter = 10000;
      }
    },
    // deathAnimation: (ctx, liveBosses, bossIndex) => {},
    onWallBounce: () => {
      // smallCube.airFriction = true;
      // smallCube.phaseCounter = 50;
    },
  };

  entities.push(cubeBoss);
  liveBosses.push(cubeBoss);

  cubeBoss.rectangles.forEach((rect) => {
    squares.push(rect);
  });

  //   }
};
