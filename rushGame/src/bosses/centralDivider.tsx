import { bullets, entities, lines, liveBosses } from "../arrays";
import { topLeftCorner, topRightCorner, world } from "../basics";
import { createBullet } from "../createBullet";
import { player } from "../createPlayer";
import { drawCircle } from "../draw/drawCircle";
import { drawLine } from "../draw/drawLine";
import { doCirclesOverlap } from "../geometry/doCirlceOverlap";

import { getDistance, makeDirection } from "../geometry/makeDirection";
import { goTo } from "../goTo";
import { fps } from "../main";
import { add, addVar, multVar, origo, randomNumberMargin, sub } from "../math";
import { createCentralBaseBoss } from "./centralBase";

const health = 15000;

type Charger = {
  name: string;
  maxHealth: number;
  health: number;
  contactDamage: number;
  pos: {
    x: number;
    y: number;
  };
  vel: {
    x: number;
    y: number;
  };
  radius: number;
  color: string;
  speed: number;
  team: string;
  mass: number;

  damageConflicted: number;
  damageAbsorbed: number;
  bulletsShot: number;
  timesDefeated: number;

  collision: true;
  airFriction: boolean;

  // Pahses
  phaseCounter: number;

  update: () => void;
  // deathAnimation: (ctx, liveBosses, bossIndex) => void;
  onWallBounce: () => void;
};

const createRepetableBullet = (centralDivider) => {
  console.log("hit!, Greataing new bulelt");
  const spawnPos = {
    x: world.width * Math.random(),
    y: world.height * Math.random(),
    // x: 500,
    // y: 500,
  };

  // console.log(spawnPos);

  createBullet(
    bullets,
    centralDivider,
    undefined,
    -15,
    undefined,
    {},
    {
      color: "lime",
      vel: origo,
      startPos: spawnPos,

      onHit: (entity, bullet) => {
        if (centralDivider.ai === makeMiniWalls) {
          createBullet(bullets, player, centralDivider.pos, 500, 40);
          createRepetableBullet(centralDivider);
        }
      },
    }
  );
};

const makeMiniWalls = (centralDivider) => {
  centralDivider.miniWallCounter--;

  if (centralDivider.miniWallCounter > 0) {
    return;
  }

  const wallCount = 7;
  const spacing = { x: world.width / wallCount, y: world.height / wallCount };

  for (let i = 0; i < wallCount; i++) {
    const damage = 15;
    const speed = 10;
    const bulletRadius = 10;
    createBullet(
      bullets,
      centralDivider,
      undefined,
      damage,
      undefined,
      {},
      {
        startPos: { x: spacing.x * i, y: bulletRadius + 20 },
        bulletRadius: bulletRadius,
        vel: { x: 0, y: speed },
        color: "red",
      }
    );
    createBullet(
      bullets,
      centralDivider,
      undefined,
      damage,
      undefined,
      {},
      {
        startPos: { x: bulletRadius + 20, y: spacing.x * i },
        bulletRadius: bulletRadius,
        vel: { x: speed, y: 0 },
        color: "red",
      }
    );
  }
  centralDivider.miniWallCounter = 50;
};

const wallMargin = 200;

const holdWall = (ctx, centralDivider) => {
  console.log("building...");

  const time = 15000;
  // const time = 150;
  const delay = 10;
  const maxI = time / delay;

  console.log(maxI);

  for (let i = 0; i <= maxI; i++) {
    setTimeout(() => {
      if (centralDivider.wallActive === false) {
        return;
      }

      // redAi(centralDivider);
      // console.log(i);

      const bulletRadius = Math.random() * 15 + 15;

      const speed = 10;

      createBullet(
        bullets,
        centralDivider,
        undefined,
        10,
        speed,
        {},
        {
          color: "red",
          vel: { x: 0, y: Math.min(speed * (i / 100), speed * 2) },
          bulletRadius: bulletRadius,
          startPos: {
            x: randomNumberMargin(world.width / 2, wallMargin),
            y: bulletRadius,
          },
        }
      );
    }, delay * i);
  }

  setTimeout(() => {
    if (player.pos.x < world.width / 2) {
      centralDivider.ai = redAi;
    } else {
      centralDivider.ai = blueAi;
    }

    setTimeout(() => {
      // bullets.length = 0;
      bullets.map((bullet) => {
        if (bullet.color === "red") {
          bullet.vel.y += 15;
        }
      });

      lines.length = 0;
      centralDivider.ai = () => {};

      centralDivider.vel.x = randomNumberMargin(0, 10);
      centralDivider.vel.y = randomNumberMargin(0, 10);
      setTimeout(() => {
        centralDivider.wallActive = false;

        centralDivider.ai = makeMiniWalls;
        createRepetableBullet(centralDivider);
      }, 1500);
    }, delay * maxI);
  }, 3000);
};

const redAi = (centralDivider) => {
  centralDivider.attackCounter--;

  lines.length = 0;
  const circleSides = [
    // Up
    { x: 0, y: -centralDivider.radius },
    // Right
    { x: centralDivider.radius, y: 0 },
    // Down
    { x: centralDivider.radius, y: 0 },
    // Left
    { x: -centralDivider.radius, y: 0 },
  ];

  for (let i = 0; i < circleSides.length; i++) {
    const sidePos = circleSides[i];

    const line = {
      startPos: add(sidePos, centralDivider.pos),
      endPos: player.pos,
      color: "red",
    };

    lines.push(line);
  }

  if (centralDivider.attackCounter < 0) {
    const delayToNextAttack = 200;

    centralDivider.sideIndex++;

    const sides = [
      { x: centralDivider.radius, y: centralDivider.radius },
      {
        x: world.width / 2 - wallMargin - centralDivider.radius,
        y: centralDivider.radius,
      },
    ];

    goTo(centralDivider, sides[centralDivider.sideIndex % 2], 15, () => {
      const firstBulletRadius = 15;

      setTimeout(() => {
        const precisionCount = 8;
        let totalTime = delayToNextAttack * 5;
        for (let i = 0; i < precisionCount; i++) {
          setTimeout(() => {
            if (centralDivider.health < 0) {
              return;
            }
            if (i !== precisionCount - 1) {
              createBullet(bullets, centralDivider, player.pos, 20, 15);
            } else {
              createBullet(
                bullets,
                centralDivider,
                player.pos,
                -10,
                15,
                {},
                {
                  color: "lime",
                  bulletRadius: 20,
                  onHit: (entity, bullet) => {
                    if (entity === player) {
                      const bulletRadius = 40;
                      createBullet(
                        bullets,
                        undefined,
                        centralDivider.pos,
                        2000,
                        15,
                        {},
                        {
                          startPos: player.pos,
                          bulletRadius: bulletRadius,
                          team: "player",
                        }
                      );
                    }
                  },
                }
              );
            }
          }, (totalTime / precisionCount) * i);
        }

        const sprayCount = 40;
        const playerDirection = Math.atan2(
          player.pos.y - centralDivider.pos.y,
          player.pos.x - centralDivider.pos.x
        );

        // Startvinklar (radianer)
        const startAngleRight = playerDirection + Math.PI / 2;
        const startAngleLeft = playerDirection - Math.PI / 2;

        // Slutvinklar (radianer)
        const endAngle = 25;
        const endAngleRight = playerDirection + (endAngle * Math.PI) / 180;
        const endAngleLeft = playerDirection - (endAngle * Math.PI) / 180;

        for (let i = 0; i < sprayCount; i++) {
          setTimeout(() => {
            if (centralDivider.health < 0) {
              return;
            }
            const t = i / (sprayCount - 1);

            const currentAngleRight =
              startAngleRight + t * (endAngleRight - startAngleRight);
            const currentAngleLeft =
              startAngleLeft + t * (endAngleLeft - startAngleLeft);

            const targetRight = {
              x: Math.cos(currentAngleRight) * 50 + centralDivider.pos.x,
              y: Math.sin(currentAngleRight) * 50 + centralDivider.pos.y,
            };
            createBullet(bullets, centralDivider, targetRight, 5, 20);

            const targetLeft = {
              x: Math.cos(currentAngleLeft) * 50 + centralDivider.pos.x,
              y: Math.sin(currentAngleLeft) * 50 + centralDivider.pos.y,
            };
            createBullet(bullets, centralDivider, targetLeft, 5, 20);
          }, (totalTime / sprayCount) * i);
        }

        setTimeout(() => {
          if (centralDivider.health < 0) {
            return;
          }
          createBullet(
            bullets,
            centralDivider,
            player.pos,
            0,
            100,
            {},
            {
              bulletRadius: 40,
              onHit: (entity, bullet) => {
                if (entity === player) {
                  const direction = makeDirection(
                    player.pos,
                    centralDivider.pos
                  );

                  player.vel = add(player.vel, multVar(direction, -30));
                }
              },
            }
          );
        }, delayToNextAttack * 10);
      }, 500);
    });

    centralDivider.attackCounter = delayToNextAttack;
  }
};

const blueAi = (centralDivider) => {
  centralDivider.attackCounter--;
  player.vel.x -= player.speed * 0.35;

  const direction = makeDirection(centralDivider.pos, player.pos);

  if (getDistance(centralDivider.pos, player.pos) > centralDivider.minDist) {
    // Loneliness
    centralDivider.vel = add(
      centralDivider.vel,
      multVar(direction, centralDivider.attractionSpeed / 2)
    );

    centralDivider.health -= centralDivider.aloneDamage;
  } else {
    // Companionship
    centralDivider.vel = add(
      centralDivider.vel,
      multVar(direction, -centralDivider.attractionSpeed)
    );

    player.health -= centralDivider.companionDamage;
  }

  if (centralDivider.attackCounter < 0) {
    const delayToNextAttack = 200;
    centralDivider.attackCounter = delayToNextAttack;
  }
};

export const createCentralDividerBoss = () => {
  const radius = 80;
  const centralDivider = {
    name: "Central Divider",
    maxHealth: health,
    health: health,
    contactDamage: 20,
    pos: {
      x: world.width / 2,
      y: radius * 1.2,
    },
    vel: {
      x: 0,
      y: 0,
    },
    radius: radius,
    color: "darkred",
    speed: 2,
    team: "enemy",
    mass: 1000,

    damageConflicted: 0,
    damageAbsorbed: 0,
    bulletsShot: 0,
    timesDefeated: 0,

    collision: true,
    airFriction: 0,

    // Pahses
    wallCounter: 100,
    wallActive: false,

    attackCounter: 0,

    // Red Phase
    sideIndex: 0,

    // Blue Phase
    minDist: 300,
    attractionSpeed: 1,
    aloneDamage: 5,
    companionDamage: 0.05,

    // Mini Walls
    miniWallCounter: 0,
    bounceSpeed: 5,
    bounceCounter: 0,

    update: (ctx): void => {
      centralDivider.ai(centralDivider);
      if (centralDivider.wallActive) {
        return;
      }

      centralDivider.wallCounter--;

      if (player.pos.x < world.width / 2) {
        centralDivider.color = "darkred";
      } else {
        centralDivider.color = "darkblue";
      }

      if (centralDivider.wallCounter < 0) {
        centralDivider.wallActive = true;

        console.log("BUILD THE WALL");

        holdWall(ctx, centralDivider);

        centralDivider.wallCounter = 1000;
      }
    },
    ai: (centralDivider) => {},
    onWallBounce: () => {
      // const edgeVelocities = [
      //   { x: centralDivider.bounceSpeed, y: 0 }, // höger
      //   { x: 0, y: centralDivider.bounceSpeed }, // ner
      //   { x: -centralDivider.bounceSpeed, y: 0 }, // vänster
      //   { x: 0, y: -centralDivider.bounceSpeed }, // upp
      // ];
      // // I din väggkollision:
      // centralDivider.bounceCounter = (centralDivider.bounceCounter + 1) % 4;
      // centralDivider.vel = edgeVelocities[centralDivider.bounceCounter];
    },
  };

  entities.push(centralDivider);
  liveBosses.push(centralDivider);

  return centralDivider;
};
