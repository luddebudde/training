import { bullets, entities, liveBosses } from "../arrays";
import { world } from "../basics";
import { createBullet } from "../createBullet";
import { player } from "../createPlayer";
import { origo, Vec2 } from "../math";
import { randomAcceptedPos } from "../randomAcceptedPos";
import { randomArrayElement } from "../randomArrayElement";

const health: number = 3200;
const speed: number = 35;
const radius: number = 120;
const bulletRadius: number = 20;
const spawnInterval: number = 5;

const randomXPos = () => {
  return world.width * Math.random();
};
const randomYPos = () => {
  return world.width * Math.random();
};

const possibleDirections: Array<() => Vec2> = [
  // Up
  () => ({ x: randomXPos(), y: bulletRadius }),
  // Left
  () => ({ x: bulletRadius, y: randomYPos() }),
  // Down
  () => ({ x: randomXPos(), y: world.height - bulletRadius }),
  // Right
  () => ({ x: world.width - bulletRadius, y: randomYPos() }),
];

type Rainer = {
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
  airFriction: false;

  // Pahses
  phaseCounter: number;
  spawnInterval: number;
  directionCounter: number;
  unlockedDirections: Vec2[] | [];
  aimAtPlayerMode: boolean;

  update: () => void;
  // deathAnimation: (ctx, liveBosses, bossIndex) => void;
};

export const createRainerBoss = () => {
  const rainer: Rainer = {
    name: "Rainer",
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

    damageConflicted: 0,
    damageAbsorbed: 0,
    bulletsShot: 0,
    timesDefeated: 0,

    collision: true,
    airFriction: false,

    // Pahses
    phaseCounter: 0,
    spawnInterval: spawnInterval,
    directionCounter: 0,
    unlockedDirections: [origo],
    aimAtPlayerMode: false,

    // aiMovement: () => {},
    update: (): void => {
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
          rainer.unlockedDirections.push(possibleDirections[i]());

          rainer.spawnInterval *= 0.9;
        }

        for (let i = 0; i < Math.floor(1 / rainer.spawnInterval) + 1; i++) {
          const startWay = randomArrayElement(rainer.unlockedDirections);

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
            rainer,
            undefined,
            4,
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
    // deathAnimation: (ctx, liveBosses, bossIndex) => {},
  };

  entities.push(rainer);
  liveBosses.push(rainer);

  return rainer;
};
