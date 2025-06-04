import { bullets, entities, liveBosses } from "../arrays";
import { world } from "../basics";
import { Bullet, createBullet } from "../createBullet";
import { player } from "../createPlayer";
import { makeDirection } from "../geometry/makeDirection";
import { multVar, origo, Vec2 } from "../math";

const health = 15;

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
  reachedHalfway: boolean;

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
    reachedHalfway: false,

    update: (): void => {
      const skipSet = new Set(pacific.changedBullets);

      if (
        pacific.reachedHalfway === false &&
        pacific.health < pacific.maxHealth / 2
      ) {
        pacific.vel = multVar(pacific.vel, 1.5);
        pacific.reachedHalfway = true;
      }

      bullets.forEach((bullet) => {
        if (skipSet.has(bullet) || bullet.team === "enemy") return;

        bullet.vel =
          Math.random() < 0.1 ? multVar(bullet.vel, 0.5) : bullet.vel;

        let damageNumber;
        let colorString;

        bullet.bounceable = true;
        bullet.bounceDamageLoss = 1;

        if (Math.random() > 0.8) {
          damageNumber = -bullet.damage;
          colorString = "lime";
        } else {
          damageNumber = bullet.damage;
          colorString = "red";
        }

        // Ta bort funktionen
        bullet.onWallBounce = (bullet, newVel) => {
          bullet.color = "purple";
          createBullet(
            bullets,
            pacific,
            undefined,
            damageNumber * 0.8,
            bullet.speed,
            { bounceDamageLoss: 0.3, bounceable: true },
            {
              startPos: {
                x: bullet.pos.x + newVel.x,
                y: bullet.pos.y + newVel.y,
              },
              vel: multVar(newVel, 0.5),
              color: colorString,
              team: "enemy",
            }
          );

          // bullets.splice(index, 1);
        };
        // };
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
