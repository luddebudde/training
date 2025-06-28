import { bullets, entities, liveBosses } from "../arrays";
import { world } from "../basics";
import { Bullet, createBullet } from "../createBullet";
import { player } from "../createPlayer";
import { doCirclesOverlap } from "../geometry/doCirlceOverlap";

import { getDistance, makeDirection } from "../geometry/makeDirection";
import { goTo } from "../goTo";
import { add, multVar, origo, Vec2 } from "../math";

const health = 1500;
const radius = 120;

type Boss = {
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
  airFriction: boolean | number;

  // Pahses
  phaseCounter: number;
  resetCounterValue: number;
  rageMode: boolean;

  timesSideSwitched: number;
  bulletRainDirection: number;

  cheatedBullets: Bullet[];

  update: () => void;
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

const switchSide = (boss, whenDone) => {
  goTo(boss, sidePosArray[boss.timesSideSwitched % 2], 50, () => {
    whenDone(boss);

    if (boss.health < boss.maxHealth * 0.75) {
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
    }
  });

  boss.timesSideSwitched++;
};

const fieldAttack = (boss, bulletCount: number, delay: number): void => {
  const spaces = [];
  const spacing = (world.width - boss.radius * 2) / bulletCount;

  // const startPos = { x: boss.pos.x < world.width ? 0 : world.width, y: radius };

  boss.bulletRainDirection = boss.timesSideSwitched % 2 ? -1 : 1;
  const startLoc = boss.timesSideSwitched % 2 ? world.width : 0;

  for (let i = 0; i < bulletCount; i++) {
    spaces.push(spacing * i);
    // console.log(spaces);

    setTimeout(() => {
      createBullet(
        bullets,
        boss,
        undefined,
        8,
        20,
        {},
        {
          startPos: {
            x: startLoc + spaces[i] * boss.bulletRainDirection,
            y: 40,
          },
          vel: { x: 0, y: 20 },
        }
      );
    }, delay * i);
  }

  setTimeout(() => {
    shotSprayAttack(boss);
  }, delay * bulletCount);
};

const chargeMode = (boss) => {
  const direction = makeDirection(boss.pos, player.pos);

  boss.vel = add(boss.vel, multVar(direction, boss.speed));
};

export const createNewRainer = () => {
  const boss: Boss = {
    name: "Boss",
    maxHealth: health,
    health: health,
    contactDamage: 10,
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
    speed: 0.45,
    team: "enemy",
    mass: 1000,

    damageConflicted: 0,
    damageAbsorbed: 0,
    bulletsShot: 0,
    timesDefeated: 0,

    collision: true,
    airFriction: false,

    // Pahses
    phaseCounter: 20,
    resetCounterValue: 3000,
    rageMode: false,

    timesSideSwitched: 0,
    bulletRainDirection: 1,

    cheatedBullets: [],

    update: (): void => {
      boss.phaseCounter--;

      const bossShield = {
        pos: boss.pos,
        radius: boss.radius * 4,
      };

      if (
        ((player.pos.x < boss.pos.x - boss.radius &&
          boss.bulletRainDirection === 1) ||
          (player.pos.x > boss.pos.x + boss.radius &&
            boss.bulletRainDirection === -1)) &&
        boss.rageMode === false
      ) {
        const newCheated = bullets.filter(
          (bullet) =>
            bullet.team === "player" && !boss.cheatedBullets.includes(bullet)
        );

        newCheated.forEach((bullet) => {
          if (doCirclesOverlap(bullet, bossShield)) {
            bullet.angle = Math.atan2(
              bullet.pos.y - bossShield.pos.y,
              bullet.pos.x - bossShield.pos.x
            );
            bullet.distance = Math.random() * boss.radius * 2 + boss.radius * 2;
            // getDistance(bullet.pos, bossShield.pos);
            bullet.team = "enemy";
            bullet.shooter = boss;
            bullet.damage = bullet.damage * 0.3;
            bullet.indestructible = true;

            // console.log("bullet cheated");
            boss.cheatedBullets.push(bullet);
          }
        });

        // Slå ihop gamla + nya

        //  = boss.cheatedBullets.concat(newCheated);
      }

      boss.cheatedBullets.forEach((bullet) => {
        if (doCirclesOverlap(bullet, bossShield)) {
          bullet.vel = boss.vel;

          const distance = bullet.distance;

          if (bullet.angle === undefined) {
            bullet.angle = 0;
            bullet.indestructible = true;
          }

          bullet.angle += 0.05;
          bullet.pos.x = Math.cos(bullet.angle) * distance + bossShield.pos.x;
          bullet.pos.y = Math.sin(bullet.angle) * distance + bossShield.pos.y;

          // console.log(bullet.angle);

          // createBullet(bullets, boss, undefined, bullet.damage, bullet.speed, {}, {vel: multVar(bullet.vel, -1)})
        }
      });

      if (boss.phaseCounter < 0) {
        if (boss.rageMode === false && boss.health < boss.maxHealth / 10) {
          boss.rageMode = true;
          boss.health = 500;
          boss.airFriction = 0.3;
          boss.resetCounterValue = 0;
        }

        if (boss.rageMode) {
          chargeMode(boss);
        } else if (boss.health > boss.maxHealth / 2) {
          const bulletCount = Math.floor(world.width / 200);
          switchSide(boss, () =>
            fieldAttack(boss, bulletCount, (world.width / bulletCount) * 0.67)
          );
        } else {
          const bulletCount = Math.floor(world.width / 50);
          switchSide(boss, () =>
            fieldAttack(boss, bulletCount, (world.width / bulletCount) * 0.33)
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
        boss.phaseCounter = boss.resetCounterValue;
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
