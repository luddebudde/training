import { bullets, entities, liveBosses } from "../arrays";
import { world } from "../basics";
import { createBullet, createWaveShoot } from "../createBullet";
import { player } from "../createPlayer";
import { Enemy } from "../enemies/chaser";
import { goTo } from "../goTo";
import { makeDirection } from "../makeDirection";
import { add, mult, multVar, sub, Vec2 } from "../math";
import { randomArrayElement } from "../randomArrayElement";

const cornerDelay = 50;
const health = 15;

export const createChargerBoss = () => {
  const charger = {
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

    // Pahses
    phaseCounter: 100,

    aiMovement: () => {},
    update: (ctx): void => {
      charger.aiMovement();

      charger.phaseCounter--;

      if (charger.phaseCounter < 0) {
        charger.airFriction = false;
        const direction = makeDirection(charger.pos, player.pos);

        charger.vel = multVar(direction, charger.speed);

        charger.phaseCounter = 10000;
      }
    },
    deathAnimation: (ctx, liveBosses, bossIndex) => {},
    onWallBounce: () => {
      //   charger.vel = { x: 0, y: 0 };
      charger.airFriction = true;

      charger.phaseCounter = 100;
    },
    airFriction: false,
  };

  entities.push(charger);
  liveBosses.push(charger);

  return charger;
  // entities.push(sprayer);
  // liveBosses.push(sprayer);
};
