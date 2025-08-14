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

type SideSweeper = {
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

const shotSprayAttack = (boss: SideSweeper) => {
  const bulletCount = 10;
  const spreadRadians = (120 * Math.PI) / 180;
  const startAngle = -spreadRadians / 2;

  const angleToPlayer = Math.atan2(
    player.pos.y - boss.pos.y,
    player.pos.x - boss.pos.x
  );

  for (let i = 0; i < bulletCount; i++) {
    setTimeout(() => {
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
    boss.phaseCounter = 50;
  }, 25 * bulletCount);
};

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

const fieldAttack = (
  sweeper: SideSweeper,
  bulletCount: number,
  delay: number
): void => {
  const spaces = [];
  const spacing = (world.width - sweeper.radius * 2) / bulletCount;

  sweeper.bulletRainDirection = sweeper.timesSideSwitched % 2 ? -1 : 1;
  const startLoc = sweeper.timesSideSwitched % 2 ? world.width : 0;

  for (let i = 0; i < bulletCount; i++) {
    spaces.push(spacing * i);

    setTimeout(() => {
      createBullet(
        bullets,
        sweeper,
        undefined,
        8,
        20,
        {},
        {
          startPos: {
            x: startLoc + spaces[i] * sweeper.bulletRainDirection,
            y: 40,
          },
          vel: { x: 0, y: 20 },
        }
      );
    }, delay * i);
  }

  setTimeout(() => {
    shotSprayAttack(sweeper);
  }, delay * bulletCount);
};

const chargeMode = (boss) => {
  const direction = makeDirection(boss.pos, player.pos);

  boss.vel = add(boss.vel, multVar(direction, boss.speed));
};

export const createSideSweeper = () => {
  const sideSweeper: SideSweeper = {
    name: "Side <= Sweeper",
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
      sideSweeper.phaseCounter--;

      const bossShield = {
        pos: sideSweeper.pos,
        radius: sideSweeper.radius * 4,
      };

      if (
        ((player.pos.x < sideSweeper.pos.x - sideSweeper.radius &&
          sideSweeper.bulletRainDirection === 1) ||
          (player.pos.x > sideSweeper.pos.x + sideSweeper.radius &&
            sideSweeper.bulletRainDirection === -1)) &&
        sideSweeper.rageMode === false
      ) {
        const newCheated = bullets.filter(
          (bullet) =>
            bullet.team === "player" &&
            !sideSweeper.cheatedBullets.includes(bullet)
        );

        newCheated.forEach((bullet) => {
          if (doCirclesOverlap(bullet, bossShield)) {
            bullet.angle = Math.atan2(
              bullet.pos.y - bossShield.pos.y,
              bullet.pos.x - bossShield.pos.x
            );
            bullet.distance =
              Math.random() * sideSweeper.radius * 2 + sideSweeper.radius * 2;
            bullet.team = "enemy";
            bullet.shooter = sideSweeper;
            bullet.damage = bullet.damage * 0.3;
            bullet.indestructible = true;

            // console.log("bullet cheated");
            sideSweeper.cheatedBullets.push(bullet);
          }
        });
      }

      sideSweeper.cheatedBullets.forEach((bullet) => {
        if (doCirclesOverlap(bullet, bossShield)) {
          bullet.vel = sideSweeper.vel;

          const distance = bullet.distance;

          if (bullet.angle === undefined) {
            bullet.angle = 0;
            bullet.indestructible = true;
          }

          bullet.angle += 0.05;
          bullet.pos.x = Math.cos(bullet.angle) * distance + bossShield.pos.x;
          bullet.pos.y = Math.sin(bullet.angle) * distance + bossShield.pos.y;
        }
      });

      if (sideSweeper.phaseCounter < 0) {
        if (
          sideSweeper.rageMode === false &&
          sideSweeper.health < sideSweeper.maxHealth / 10
        ) {
          sideSweeper.rageMode = true;
          sideSweeper.health = 500;
          sideSweeper.airFriction = 0.3;
          sideSweeper.resetCounterValue = 0;
        }

        if (sideSweeper.rageMode) {
          chargeMode(sideSweeper);
        } else if (sideSweeper.health > sideSweeper.maxHealth / 2) {
          const bulletCount = Math.floor(world.width / 200);
          switchSide(sideSweeper, () =>
            fieldAttack(
              sideSweeper,
              bulletCount,
              (world.width / bulletCount) * 0.67
            )
          );
        } else {
          const bulletCount = Math.floor(world.width / 50);
          switchSide(sideSweeper, () =>
            fieldAttack(
              sideSweeper,
              bulletCount,
              (world.width / bulletCount) * 0.33
            )
          );
        }
        sideSweeper.phaseCounter = sideSweeper.resetCounterValue;
      }
    },
  };

  entities.push(sideSweeper);
  liveBosses.push(sideSweeper);

  return sideSweeper;
};
