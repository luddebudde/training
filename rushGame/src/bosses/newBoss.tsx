import { bullets, entities, liveBosses } from "../arrays";
import { world } from "../basics";
import { createBullet } from "../createBullet";
import { player } from "../createPlayer";
import { doCirclesOverlap } from "../geometry/doCirlceOverlap";

import { getDistance, makeDirection } from "../geometry/makeDirection";
import { goTo } from "../goTo";
import { multVar, origo, Vec2 } from "../math";

const health = 1500;
const radius = 120;

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

const shotSprayAttack = (boss) => {
  const bulletCount = 10;
  const spreadRadians = (120 * Math.PI) / 180; // 120 degrees in radians
  const startAngle = -spreadRadians / 2;

  const angleToPlayer = Math.atan2(
    player.pos.y - boss.pos.y,
    player.pos.x - boss.pos.x
  );

  for (let i = 0; i < bulletCount; i++) {
    setTimeout(() => {
      // Sprid jämnt över 120°

      const angleOffset = startAngle + (i / (bulletCount - 1)) * spreadRadians;
      const finalAngle = angleToPlayer + angleOffset;

      const target: Vec2 = {
        x: boss.pos.x + Math.cos(finalAngle) * 100,
        y: boss.pos.y + Math.sin(finalAngle) * 100,
      };

      createBullet(bullets, boss, target, 5, 20, {});
    }, 25 * i);
  }
  setTimeout(() => {
    // shotSprayAttack(boss);
    boss.phaseCounter = 50;
  }, 25 * bulletCount);
};

// const fieldAttack = (boss, bulletCount: number, delay: number): void => {
//   // shotSprayAttack(boss);
//   console.log(bulletCount);

//   for (let i = 0; i < bulletCount; i++) {
//     setTimeout(() => {
//       const startPos = { x: (world.width / bulletCount) * i, y: 40 };
//       const targetPos = { x: startPos.x, y: startPos.y + world.height };

//       createBullet(bullets, boss, targetPos, 5, 20, {}, { startPos: startPos });
//     }, delay * i);
//   }

//   setTimeout(() => {
//     shotSprayAttack(boss);
//   }, delay * bulletCount);
// };

const sidePosArray = [
  { x: radius, y: radius },
  { x: world.width - radius, y: radius },
];
let timesSideSwitched = 0;
let bulletRainDirection = 1;

const switchSide = (boss, whenDone) => {
  goTo(boss, sidePosArray[timesSideSwitched % 2], 50, () => {
    whenDone(boss);

    const bulletCount = 5 - 2;
    for (let i = -2; i < bulletCount; i++) {
      createBullet(
        bullets,
        boss,
        undefined,
        10,
        undefined,
        {},
        {
          bulletRadius: radius / 5,
          startPos: { x: boss.pos.x + ((radius * 2) / 5) * i, y: boss.pos.y },
          vel: { x: 0, y: 15 },
          color: "red",
        }
      );
    }
  });

  timesSideSwitched++;
};

const fieldAttack = (boss, bulletCount: number, delay: number): void => {
  const spaces = [];
  const spacing = (world.width - boss.radius * 2) / bulletCount;

  // const startPos = { x: boss.pos.x < world.width ? 0 : world.width, y: radius };

  bulletRainDirection = timesSideSwitched % 2 ? -1 : 1;
  const startLoc = timesSideSwitched % 2 ? world.width : 0;

  for (let i = 0; i < bulletCount; i++) {
    spaces.push(spacing * i);
    // console.log(spaces);

    setTimeout(() => {
      createBullet(
        bullets,
        boss,
        undefined,
        5,
        20,
        {},
        {
          startPos: { x: startLoc + spaces[i] * bulletRainDirection, y: 40 },
          vel: { x: 0, y: 20 },
        }
      );
    }, delay * i);
  }

  setTimeout(() => {
    shotSprayAttack(boss);
  }, delay * bulletCount);
};

export const createNewBoss = () => {
  const boss = {
    name: "Charger",
    maxHealth: health,
    health: health * 0.51,
    contactDamage: 20,
    pos: {
      x: world.width / 2,
      y: world.height / 2,
    },
    vel: {
      x: 0,
      y: 0,
    },
    radius: radius,
    color: "purple",
    speed: 20,
    team: "enemy",
    mass: 1000,

    damageConflicted: 0,
    damageAbsorbed: 0,
    bulletsShot: 0,
    timesDefeated: 0,

    collision: true,
    airFriction: false,

    // Pahses
    phaseCounter: 100,
    rageMode: false,

    cheatedBullets: [],

    update: (): void => {
      boss.phaseCounter--;

      const bossShield = {
        pos: boss.pos,
        radius: boss.radius * 2,
      };

      if (
        (player.pos.x < boss.pos.x - boss.radius &&
          bulletRainDirection === 1) ||
        (player.pos.x > boss.pos.x + boss.radius && bulletRainDirection === -1)
      ) {
        boss.cheatedBullets = bullets
          .filter((bullet) => bullet.team === "player")
          .map((bullet) => {
            // Infallsvinkel = skillnad mellan rörelse och normal
            // const incidence = motionAngle - normalAngle;

            // const distance = getDistance(bullet.pos, bossShield.pos);
            // bullet.angle = normalAngle;
            bullet.angle = Math.atan2(
              bullet.pos.y - bossShield.pos.y,
              bullet.pos.x - bossShield.pos.x
            );

            bullet.indestructible = true;

            return bullet;
          });
      }

      boss.cheatedBullets.forEach((bullet) => {
        if (doCirclesOverlap(bullet, bossShield)) {
          bullet.vel = boss.vel;
          const distance = getDistance(bullet.pos, bossShield.pos);

          if (bullet.angle === undefined) {
            bullet.angle = 0;
            bullet.indestructible = true;
          }

          bullet.angle += 0.05;
          bullet.pos.x = Math.cos(bullet.angle) * distance + bossShield.pos.x;
          bullet.pos.y = Math.sin(bullet.angle) * distance + bossShield.pos.y;

          console.log(bullet.angle);

          // createBullet(bullets, boss, undefined, bullet.damage, bullet.speed, {}, {vel: multVar(bullet.vel, -1)})
        }
      });

      if (boss.phaseCounter < 0) {
        if (boss.health > boss.maxHealth / 2) {
          const bulletCount = Math.floor(world.width / 200);
          switchSide(boss, () =>
            fieldAttack(boss, bulletCount, (world.width / bulletCount) * 0.5)
          );
        } else {
          const bulletCount = Math.floor(world.width / 50);
          switchSide(boss, () =>
            fieldAttack(boss, bulletCount, (world.width / bulletCount) * 0.5)
          );
        }

        // if (!boss.rageMode) {
        //   goTo(boss, { x: world.width / 2, y: radius }, 40, () => {
        //     boss.vel = { x: 0, y: boss.speed };
        //     boss.phaseCounter = 30;
        //   });
        //   boss.rageMode = true;
        // }
        // for (let i = 0; i < 2; i++) {
        //   createBullet(
        //     bullets,
        //     boss,
        //     undefined,
        //     10,
        //     20,
        //     {},
        //     { vel: { x: 20 * (i % 2 ? 1 : -1), y: 0 } }
        //   );
        //   boss.phaseCounter = 30;
        // }
        // }
        boss.phaseCounter = 30000;
      }
    },
    // onWallBounce: () => {
    // charger.airFriction = true;

    // boss.vel = origo;

    // console.log("bounce");

    // charger.phaseCounter = 100;
    // },
  };

  entities.push(boss);
  liveBosses.push(boss);

  return boss;
};
