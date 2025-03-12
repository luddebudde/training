import { bullets, entities, liveBosses } from "../arrays";
import { world } from "../basics";
import { createBullet, createWaveShoot } from "../createBullet";
import { player } from "../createPlayer";
import { Enemy } from "../enemies/chaser";
import { goTo } from "../goTo";
import { makeDirection } from "../makeDirection";
import { add, div, divVar, mult, multVar, origo, sub, Vec2 } from "../math";
import { randomArrayElement } from "../randomArrayElement";

const health = 150;
const speed = 35;
const radius = 120;
const bounceThreashold = 10;

export const createBonkerBoss = () => {
  const bonker = {
    maxHealth: health,
    health: health,
    contactDamage: 10,
    pos: {
      x: world.width / 2,
      y: radius - 1,
    },
    vel: {
      x: 0,
      y: 0,
    },
    radius: radius,
    color: "black",
    speed: speed,
    team: "enemy",
    mass: 1000,
    collision: true,

    // Pahses
    phaseCounter: 100,
    bounceCounter: -1,

    aiMovement: () => {},
    update: (ctx): void => {},
    deathAnimation: (ctx, liveBosses, bossIndex) => {},
    onWallBounce: () => {
      bonker.bounceCounter++;

      if (bonker.bounceCounter % bounceThreashold !== 0) {
        if (bonker.maxHealth / 2 > bonker.health) {
          createBullet(
            bullets,
            bonker,
            player.pos,
            15,
            10,
            {},
            {
              bulletRadius:
                40 + 2.5 * (bonker.bounceCounter % bounceThreashold),
            }
          );
        }
      } else {
        bonker.vel = origo;

        // setTimeout(() => {}, 500);
        setTimeout(() => {
          const direction = makeDirection(bonker.pos, player.pos);

          bonker.vel = multVar(direction, bonker.speed);
        }, 1000);

        console.log("irogo");
      }
    },
    airFriction: false,
  };

  entities.push(bonker);
  liveBosses.push(bonker);

  return bonker;
  // entities.push(sprayer);
  // liveBosses.push(sprayer);
};
