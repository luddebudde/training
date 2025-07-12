import { bullets, entities, liveBosses } from "../arrays";
import { world } from "../basics";
import { createBullet } from "../createBullet";
import { player } from "../createPlayer";

import { makeDirection } from "../geometry/makeDirection";
import { multVar } from "../math";

const health = 1500;

type Encircler = {
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
  degree: number;
  degreeStepCounter: number;

  rageMode: boolean;

  update: () => void;
  // deathAnimation: (ctx, liveBosses, bossIndex) => void;
  onWallBounce: () => void;
};

const maxDistanceAway = 600;
let distanceAway = maxDistanceAway * 0.6;
let distaneAwayStepDirection = 3;

export const createEncirclerBoss = () => {
  const encircler: Encircler = {
    name: "Encircler",
    maxHealth: health,
    health: health * 0.6,
    contactDamage: 20,
    pos: {
      x: Math.random() * world.width,
      y: Math.random() * world.height,
    },
    vel: {
      x: 0,
      y: 0,
    },
    radius: 40,
    color: "#450696",
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
    degree: 0,
    degreeStepCounter: 20,

    rageMode: false,

    update: (): void => {
      // encircler.phaseCounter--;

      encircler.degree += encircler.degreeStepCounter / distanceAway;

      encircler.pos.x =
        Math.cos(encircler.degree) * distanceAway + player.pos.x;
      encircler.pos.y =
        Math.sin(encircler.degree) * distanceAway + player.pos.y;

      if (Math.random() * 365 > 350) {
        createBullet(bullets, encircler, player.pos, 7, 5);
      }

      if (!encircler.rageMode && encircler.health < encircler.maxHealth / 2) {
        encircler.rageMode = true;
        encircler.degreeStepCounter *= 1.25;
      }

      if (encircler.rageMode) {
        distanceAway += distaneAwayStepDirection;

        if (distanceAway >= maxDistanceAway && distaneAwayStepDirection > 0) {
          distaneAwayStepDirection = -distaneAwayStepDirection;
        } else if (
          distanceAway <= (player.radius + encircler.radius) * 1.5 &&
          distaneAwayStepDirection < 0
        ) {
          distaneAwayStepDirection = -distaneAwayStepDirection;
        }
      }
    },
    // deathAnimation: (ctx, liveBosses, bossIndex) => {},
    onWallBounce: () => {
      encircler.degreeStepCounter = -encircler.degreeStepCounter;

      encircler.degree += (encircler.degreeStepCounter / distanceAway) * 2;
      distaneAwayStepDirection = -distaneAwayStepDirection;
    },
  };

  entities.push(encircler);
  liveBosses.push(encircler);

  return encircler;
};
