import { bullets, entities, liveBosses } from "../arrays";
import { world } from "../basics";
import { Bullet, createBullet } from "../createBullet";
import { player } from "../createPlayer";
import { makeDirection } from "../geometry/makeDirection";
import { multVar, origo, Vec2 } from "../math";

const health = 1500;

type pacific = {
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
  absorbedDamage: number;

  collision: true;
  airFriction: boolean;

  // Pahses
  changedBullets: Bullet[];

  update: () => void;
  onWallBounce: () => void;
};

export const createPacificBoss = () => {
  const pacific: pacific = {
    maxHealth: health,
    health: health,
    contactDamage: 20,
    pos: {
      x: Math.random() * world.width,
      y: Math.random() * world.height,
    },
    vel: {
      x: 25,
      y: 5,
    },
    radius: 80,
    color: "purple",
    speed: 50,
    team: "enemy",
    mass: 1000,

    damageConflicted: 0,
    absorbedDamage: 0,

    collision: true,
    airFriction: false,

    // Pahses
    // phaseCounter: 100,
    changedBullets: [],

    update: (): void => {
      const skipSet = new Set(pacific.changedBullets);

      bullets.forEach((bullet) => {
        if (skipSet.has(bullet)) return;

        // if (Math.random() > 0.5) {
        bullet.bounceable = true;
        bullet.onWallBounce = function (bullet, calculatedVec) {
          if (bullet.hasBounced) return;

          // createBullet(
          //   bullets,
          //   pacific,
          //   undefined,
          //   bullet.damage / 4,
          //   0,
          //   {},
          //   {
          //     bulletRadius: bullet.radius,
          //     color: "red",
          //     startPos: {
          //       x: bullet.pos.x + calculatedVec.x,
          //       y: bullet.pos.y + calculatedVec.y,
          //     },
          //     vel: multVar(calculatedVec, 0.5),
          //   }
          // );

          bullet.team = "enemy";
          bullet.color = "red";
          // bullet.vel =

          // Ta bort funktionen
          bullet.onWallBounce = () => {};
        };
        // }

        pacific.changedBullets.push(bullet);
      });
    },
    // deathAnimation: (ctx, liveBosses, bossIndex) => {},
    // onWallBounce: () => {
    //   //   charger.vel = { x: 0, y: 0 };
    //   charger.airFriction = true;

    //   charger.phaseCounter = 100;
    // },
  };

  entities.push(pacific);
  liveBosses.push(pacific);

  return pacific;
};
