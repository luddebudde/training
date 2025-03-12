import { bullets, entities, liveBosses } from "../arrays";
import { world } from "../basics";
import { createBullet, createWaveShoot } from "../createBullet";
import { player } from "../createPlayer";
import { dealDamage } from "../dealDamage";
import { Enemy } from "../enemies/chaser";
import { goTo } from "../goTo";
import { makeDirection } from "../makeDirection";
import { add, div, divVar, mult, multVar, origo, sub, Vec2 } from "../math";
import { randomArrayElement } from "../randomArrayElement";

const health = 1600;
const speed = 35;
const radius = 120;
const bounceThreashold = 10;
const bulletRadius = 20;
const spawnInterval = 5;

const randomXPos = () => {
  return world.width * Math.random();
};
const randomYPos = () => {
  return world.width * Math.random();
};

const possibleDirections = [
  // Up
  () => ({ x: randomXPos(), y: bulletRadius }),
  // Left
  () => ({ x: bulletRadius, y: randomYPos() }),
  // Down
  () => ({ x: randomXPos(), y: world.height - bulletRadius }),
  // Right
  () => ({ x: world.width - bulletRadius, y: randomYPos() }),
];

export const createRainerBoss = () => {
  const rainer = {
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
    color: "grey",
    speed: speed,
    team: "enemy",
    mass: 1000,
    collision: true,

    // Pahses
    phaseCounter: 0,
    spawnInterval: spawnInterval,

    directionCounter: 0,
    unlockedDirections: [],

    aimAtPlayerMode: false,

    // aiMovement: () => {},
    update: (ctx): void => {
      rainer.phaseCounter++;
      // dealDamage(player, rainer, 0.02);
      if (Math.random() > 0.9999) {
        rainer.aimAtPlayerMode = true;
        rainer.spawnInterval = 10000;
        setTimeout(() => {
          rainer.spawnInterval = spawnInterval;
          setTimeout(() => {
            rainer.aimAtPlayerMode = false;
          }, 5000);
        }, 1000);
      }

      if (rainer.phaseCounter % Math.round(rainer.spawnInterval) === 0) {
        rainer.unlockedDirections = [];
        rainer.spawnInterval = spawnInterval;

        for (
          let i = 0;
          i <=
          Math.min(
            possibleDirections.length -
              Math.ceil(rainer.health / (rainer.maxHealth * 0.25)),
            3
          );
          i++
        ) {
          rainer.unlockedDirections.push(possibleDirections[i]);

          rainer.spawnInterval *= 0.9;
        }

        // console.log(rainer.health, rainer.unlockedDirections.length);
        console.log(rainer.spawnInterval);

        for (let i = 0; i < Math.floor(1 / rainer.spawnInterval) + 1; i++) {
          const startWay = randomArrayElement(rainer.unlockedDirections)();

          // const startWay = origo;
          const isXFixed =
            startWay.x === bulletRadius ||
            startWay.x === world.width - bulletRadius;

          let targetVec;
          if (!rainer.aimAtPlayerMode) {
            targetVec = isXFixed
              ? { x: world.width - startWay.x, y: startWay.y }
              : { x: startWay.x, y: world.height - startWay.y };
          } else {
            targetVec = player.pos;
          }

          createBullet(
            bullets,
            undefined,
            undefined,
            2,
            10,
            {
              bounceable: Math.random() > 0.9 ? true : false,
              bounceDamageLoss: 0.1,
            },
            {
              startPos: { x: startWay.x, y: startWay.y },
              targetVec: targetVec,
              bulletRadius: bulletRadius,
              team: "enemy",
            }
          );
        }
      }
    },
    deathAnimation: (ctx, liveBosses, bossIndex) => {},
    // onWallBounce: () => {

    // },
    airFriction: false,
  };

  entities.push(rainer);
  liveBosses.push(rainer);

  return rainer;
  // entities.push(sprayer);
  // liveBosses.push(sprayer);
};
