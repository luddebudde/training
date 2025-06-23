import { bullets, entities, liveBosses } from "../arrays";
import { world } from "../basics";
import { createBullet } from "../createBullet";
import { player } from "../createPlayer";
import { makeDirection } from "../geometry/makeDirection";
import { multVar, origo } from "../math";

const health = 1800;
const speed = 50;
const radius = 120;
const bounceThreashold = 10;

type Bonker = {
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

  collision: true;
  airFriction: false;

  // Pahses
  phaseCounter: number;
  bounceCounter: number;

  onWallBounce: () => void;
};

export const createBonkerBoss = () => {
  const bonker: Bonker = {
    name: "Bonker",
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

    damageConflicted: 0,
    damageAbsorbed: 0,
    bulletsShot: 0,

    collision: true,
    airFriction: false,

    // Pahses
    phaseCounter: 100,
    bounceCounter: -1,

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
      }
    },
  };

  entities.push(bonker);
  liveBosses.push(bonker);

  return bonker;
  // entities.push(sprayer);
  // liveBosses.push(sprayer);
};
