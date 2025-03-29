import { entities, liveBosses } from "../arrays";
import { world } from "../basics";
import { player } from "../createPlayer";
import { drawSquare } from "../draw/drawSquare";

import { makeDirection } from "../geometry/makeDirection";
import { multVar } from "../math";

const health = 15;

export const createLargeSquareBoss = () => {
  //   for (let i = 0; i < 4; i++) {
  const smallCube = {
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
    absorbedDamage: 0,

    collision: true,
    airFriction: false,

    // Pahses
    phaseCounter: 100,

    update: (ctx): void => {
      // smallCube.phaseCounter--;
      // if (smallCube.phaseCounter < 0) {
      //   smallCube.airFriction = false;
      //   const direction = makeDirection(smallCube.pos, player.pos);
      //   smallCube.vel = multVar(direction, smallCube.speed);
      //   smallCube.phaseCounter = 10000;
      // }
    },
    // deathAnimation: (ctx, liveBosses, bossIndex) => {},
    onWallBounce: () => {
      // smallCube.airFriction = true;
      // smallCube.phaseCounter = 50;
    },
  };

  entities.push(smallCube);
  liveBosses.push(smallCube);
  //   }
};
