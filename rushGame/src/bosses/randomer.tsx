import { bullets, entities, liveBosses } from "../arrays";
import { world } from "../basics";
import { createBullet, createWaveShoot } from "../createBullet";
import { player } from "../createPlayer";
import { makeDirection } from "../geometry/makeDirection";
import { multVar } from "../math";
import { randomAcceptedPos } from "../randomAcceptedPos";
import { randomArrayElement } from "../randomArrayElement";
import { getRandomColor } from "../randomColor";

const health = Math.random() * 2000 + 1000;

const shootShotgun = (randomer) => {
  const multValue = randomer.reachedHalfway === true ? 2 : 1;

  for (let i = 0; i < (Math.random() * 2 + 1) * multValue; i++) {
    setTimeout(() => {
      createWaveShoot(
        bullets,
        randomer,
        player.pos,
        Math.random() * 8 + 3, // Damage
        Math.random() * 20, // Speed
        Math.random() * Math.PI + 0.1, // Width
        Math.random() * 7 + 1, // Amount of Bullets
        {},
        { color: getRandomColor() }
      );
    }, (Math.random() * 5 + 2) * i * 50);
  }
};

const shootMachinegun = (randomer) => {
  const multValue = randomer.reachedHalfway === true ? 0.75 : 1;

  for (let i = 0; i < (Math.random() * 45 + 5) / multValue; i++) {
    setTimeout(() => {
      createBullet(
        bullets,
        randomer,
        player.pos,
        Math.random() * 3, // Damage
        Math.random() * 20 + 1, // Speed
        {
          bounceable: Math.random() > 0.95 ? true : false,
          bounceDamageLoss: Math.random() * 0.6 + 0.2,
        },
        { bulletRadius: Math.random() * 18 + 12, color: getRandomColor }
      );
    }, (Math.random() * 5 + 2) * i * 50) * multValue;
  }
};

const shootRandomDirection = (randomer) => {
  const multValue = randomer.reachedHalfway === true ? 0.5 : 1;

  for (let i = 0; i < (Math.random() * 45 + 5) / multValue; i++) {
    setTimeout(() => {
      const angle = Math.random() * 2 * Math.PI; // slumpvinkel
      const target = {
        x: randomer.pos.x + Math.cos(angle) * 100,
        y: randomer.pos.y + Math.sin(angle) * 100,
      };

      createBullet(
        bullets,
        randomer,
        target,
        Math.random() * 15,
        Math.random() * 25 + 5,
        {},
        { color: getRandomColor() }
      );
    }, (Math.random() * 5 + 2) * i * 50 * multValue);
  }
};

type randomer = {
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

  collision: boolean;
  airFriction: false;

  // Movement
  movementCounter: number;

  // Attack
  attackCounter: number;
  attackList: any[];

  reachedHalfway: boolean;
  update: () => void;
  // deathAnimation: (ctx, liveBosses, bossIndex) => void;
  onWallBounce: () => void;
};

export const createRandomerBoss = () => {
  const randomer: randomer = {
    name: "Randomer",
    maxHealth: health,
    health: health,
    contactDamage: Math.random() * 5,
    pos: {
      x: Math.random() * world.width,
      y: Math.random() * world.height,
    },
    vel: {
      x: 0,
      y: 0,
    },
    radius: Math.random() * 40 + 60,
    color: "red",
    speed: 40,
    team: "enemy",
    mass: 1000,

    damageConflicted: 0,
    damageAbsorbed: 0,
    bulletsShot: 0,
    timesDefeated: 0,

    collision: true,
    airFriction: false,

    // Movement
    movementCounter: 100,

    // Attack
    attackCounter: Math.random() * 150,
    attackList: [shootShotgun, shootMachinegun, shootRandomDirection],
    // attackList: [shootRandomDirection],

    reachedHalfway: false,
    update: (): void => {
      randomer.movementCounter--;
      randomer.attackCounter--;

      if (randomer.maxHealth / 2 >= randomer.health) {
        randomer.reachedHalfway = true;
      }

      if (randomer.movementCounter < 0) {
        const multValue = randomer.reachedHalfway === true ? 1.5 : 1;
        randomer.vel = {
          x: Math.random() * 30 * (Math.random() > 0.5 ? 1 : -1) * multValue,
          y: Math.random() * 30 * (Math.random() > 0.5 ? 1 : -1) * multValue,
        };

        randomer.movementCounter = (Math.random() * 200 + 50) / multValue;
      }

      if (randomer.attackCounter < 0) {
        const multValue = randomer.reachedHalfway === true ? 0.75 : 1;
        const randomMovement = randomArrayElement(randomer.attackList);
        randomMovement(randomer);

        randomer.attackCounter = (Math.random() * 250 + 50) * multValue;
      }
    },
  };

  randomer.pos = randomAcceptedPos(
    randomer.pos,
    player.pos,
    randomer.radius * 2
  );

  entities.push(randomer);
  liveBosses.push(randomer);

  return randomer;
};
