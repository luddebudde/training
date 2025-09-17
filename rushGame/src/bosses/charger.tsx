import { entities, liveBosses } from "../arrays";
import { world } from "../basics";
import { player } from "../createPlayer";

import { makeDirection } from "../geometry/makeDirection";
import { multVar } from "../math";
import { randomAcceptedPos } from "../randomAcceptedPos";

const health = 1500;

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

export const createChargerBoss = () => {
  const charger: Charger = {
    name: "Charger",
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
    color: "purple",
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
      charger.phaseCounter--;

      if (charger.phaseCounter < 0) {
        charger.airFriction = false;
        const direction = makeDirection(charger.pos, player.pos);

        charger.vel = multVar(direction, charger.speed);

        charger.phaseCounter = 10000;
      }
    },
    onWallBounce: () => {
      charger.airFriction = true;

      charger.phaseCounter = 100;
    },
  };

  charger.pos = randomAcceptedPos(charger.pos, player.pos, charger.radius * 2);

  entities.push(charger);
  liveBosses.push(charger);

  return charger;
};
