import { bullets, entities, liveBosses } from "../arrays";
import { topRightCorner, world } from "../basics";
import { createBullet } from "../createBullet";
import { player } from "../createPlayer";
import { drawCircle } from "../draw/drawCircle";
import { doCirclesOverlap } from "../geometry/doCirlceOverlap";

import { makeDirection } from "../geometry/makeDirection";
import { goTo } from "../goTo";
import { add, multVar, origo, randomNumberMargin } from "../math";

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

const wallMargin = 200;

const holdWall = (ctx, centralDivider) => {
  console.log("building...");

  // const time = 15000;
  const time = 150000;
  const delay = 10;
  const maxI = time / delay;

  for (let i = 0; i <= maxI; i++) {
    setTimeout(() => {
      if (centralDivider.wallActive === false) {
        return;
      }
      if (player.pos.x < world.width / 2) {
        centralDivider.color = "darkred";
      } else {
        centralDivider.color = "darkblue";
      }

      redAi(centralDivider);
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
    centralDivider.wallActive = false;
  }, delay * maxI);
};

const redAi = (centralDivider) => {
  centralDivider.attackCounter--;

  if (centralDivider.attackCounter < 0) {
    centralDivider.sideIndex++;

    const sides = [
      { x: centralDivider.radius, y: centralDivider.radius },
      {
        x: world.width / 2 - wallMargin - centralDivider.radius,
        y: centralDivider.radius,
      },
    ];

    // console.log(sides[cendtralDivider.sideIndex % 2].x);

    goTo(centralDivider, sides[centralDivider.sideIndex % 2], 15, () => {
      const firstBulletRadius = 15;

      const bulletCount = 5;

      for (let i = 0; i < bulletCount; i++) {
        const ignoreBulletIndex = Math.ceil(Math.random() * bulletCount);
        console.log(ignoreBulletIndex);

        if (i !== ignoreBulletIndex) {
          const space = world.width / 2 - wallMargin;
          const spacing = space / bulletCount;

          createBullet(
            bullets,
            centralDivider,
            undefined,
            10,
            undefined,
            {},
            {
              startPos: { x: spacing * (i + 1), y: spacing },
              vel: { x: 0, y: 15 },
            }
          );
        }
      }

      createBullet(
        bullets,
        centralDivider,
        undefined,
        -10,
        undefined,
        {},
        {
          startPos: {
            x: (world.width / 2 - wallMargin) / 2,
            y: firstBulletRadius,
          },
          color: "lime",
          vel: { x: 0, y: 5 },
          onHit: (entity, bullet) => {
            if (doCirclesOverlap(bullet, entity) && entity === player) {
              const bulletRadius = 100;
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
    });

    centralDivider.attackCounter = 250;
  }
};

export const createCentralDividerBoss = () => {
  const centralDivider = {
    name: "Central Divider",
    maxHealth: health,
    health: health,
    contactDamage: 20,
    pos: {
      x: Math.random() * world.width,
      y: Math.random() * world.height,
    },
    vel: {
      x: 0,
      y: 0,
    },
    radius: 80,
    color: "darkred",
    speed: 2,
    team: "enemy",
    mass: 1000,

    damageConflicted: 0,
    damageAbsorbed: 0,
    bulletsShot: 0,
    timesDefeated: 0,

    collision: true,
    airFriction: false,

    // Pahses
    wallCounter: 100,
    wallActive: false,

    attackCounter: 0,

    // Red Phase
    sideIndex: 0,

    // targetPos: player.pos,

    // angle: Math.PI * 0.5,
    // angelVel: 0,

    update: (ctx): void => {
      centralDivider.wallCounter--;

      if (centralDivider.wallCounter < 0) {
        centralDivider.wallActive = true;
        // centralDivider.airFriction = false;
        // const direction = makeDirection(centralDivider.pos, player.pos);

        // centralDivider.vel = multVar(direction, centralDivider.speed);

        console.log("BUILD THE WALL");

        holdWall(ctx, centralDivider);

        centralDivider.wallCounter = 1000;
      }

      centralDivider.currentAi();

      const distanceAway = 400;

      // centralDivider.pos.x =
      //   Math.cos(centralDivider.angle) * distanceAway + player.pos.x;
      // centralDivider.pos.y =
      //   Math.sin(centralDivider.angle) * distanceAway + player.pos.y;
    },
    currentAi: () => {},
    // onWallBounce: () => {
    //   centralDivider.airFriction = true;

    //   centralDivider.wallCounter = 100;
    // },
  };

  entities.push(centralDivider);
  liveBosses.push(centralDivider);

  return centralDivider;
};
