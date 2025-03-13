import { entities, liveBosses } from "../arrays";
import { world } from "../basics";
import { player } from "../createPlayer";

import { makeDirection } from "../makeDirection";
import { multVar } from "../math";

const health = 15;

type Charger = {
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
    // deathAnimation: (ctx, liveBosses, bossIndex) => {},
    onWallBounce: () => {
      //   charger.vel = { x: 0, y: 0 };
      charger.airFriction = true;

      charger.phaseCounter = 100;
    },
  };

  entities.push(charger);
  liveBosses.push(charger);

  return charger;
};
