import { bullets, entities, liveBosses } from "../arrays";
import { world } from "../basics";
import { createBullet } from "../createBullet";
import { player } from "../createPlayer";

import { makeDirection } from "../geometry/makeDirection";
import { multVar } from "../math";

const health = 15000;

type Deiat = {
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

export const createDeiat = () => {
  const deiat = {
    name: "The Deiat",
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
    radius: 120,
    color: "yellow",
    speed: 50,
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

    update: (): void => {
      deiat.phaseCounter--;

      if (deiat.phaseCounter < 0) {
        deiat.airFriction = false;
        const direction = makeDirection(deiat.pos, player.pos);

        createBullet(
          bullets,
          deiat,
          player.pos,
          40,
          120,
          {},
          { bulletRadius: 50, color: "yellow" }
        );
        deiat.vel = multVar(direction, deiat.speed);

        deiat.phaseCounter = 100;
      }
    },
  };

  entities.push(deiat);
  liveBosses.push(deiat);
};
