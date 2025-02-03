import { bullets, entities, liveBosses } from "../arrays";
import { world } from "../basics";
import { createBullet, createWaveShoot } from "../createBullet";
import { player } from "../createPlayer";
import { makeDirection } from "../makeDirection";
import { multVar } from "../math";

const ourakHealth = 500;
const ourakRadius = 80;
const ourakCounterReset = 5;

const selberHealth = 500;
const selberRadius = 60;
const selberCounterReset = 15;

let turnIndex = 0;

export const createTwinBoss = () => {
  const ourak = {
    maxHealth: ourakHealth,
    health: ourakHealth,
    contactDamage: 60,
    pos: {
      x: ourakRadius + 1,
      y: ourakRadius + 1,
    },
    vel: {
      x: 0,
      y: 0,
    },
    radius: ourakRadius,
    color: "red",
    speed: 0,
    team: "enemy",
    mass: 1000,

    // Pahses
    phaseCounter: ourakCounterReset,
    airFriction: false,

    aiMovement: () => {},
    update: (ctx): void => {
      if (turnIndex % 2 === 1) {
        return;
      }
      ourak.aiMovement();

      ourak.phaseCounter--;

      if (ourak.phaseCounter < 0) {
        const direction = makeDirection(ourak.pos, player.pos);

        ourak.vel = multVar(direction, ourak.speed);

        console.log("go");

        // ourak.phaseCounter = 10000;

        ourak.phaseCounter = 10;
        turnIndex++;
      }
    },
    onWallBounce: () => {
      ourak.phaseCounter = ourakCounterReset;

      ourak.vel = { x: 0, y: 0 };

      turnIndex++;
    },
  };

  entities.push(ourak);
  liveBosses.push(ourak);

  const selber = {
    maxHealth: selberHealth,
    health: selberHealth,
    contactDamage: 60,
    // pos: {
    //   x: world.width - selberRadius,
    //   y: selberRadius,
    // },
    pos: {
      x: world.width / 3,
      y: world.height / 3,
    },
    vel: {
      x: 0,
      y: 0,
    },
    radius: selberRadius,
    color: "purple",
    speed: 50,
    team: "enemy",
    mass: 1000,

    // Pahses
    phaseCounter: selberCounterReset,
    shootValue: 1,

    aiMovement: () => {},
    update: (ctx): void => {
      if (turnIndex % 2 === 0) {
        return;
      }

      selber.aiMovement();

      selber.phaseCounter--;

      if (selber.phaseCounter < 0) {
        const direction = makeDirection(ourak.pos, player.pos);

        console.log("go");

        // createBullet(bullets, selber, player.pos, 40, 20);
        for (let i = 0; i < Math.floor(selber.shootValue / 10); i++) {
          setTimeout(() => {
            createWaveShoot(
              bullets,
              selber,
              player.pos,
              4,
              10,
              Math.PI / 4,
              selber.shootValue % 11
            );
          }, 50 * i);
        }

        selber.phaseCounter = selberCounterReset;
        turnIndex++;
        selber.shootValue += 2;
      }
    },
  };

  entities.push(selber);
  liveBosses.push(selber);

  //   const twins = [ourak, selber];

  //   const ai = (ctx) => {
  //     // twins.forEach((twin) => {
  //     //   twin.update(ctx);
  //     // });
  //     console.log(twins[turnIndex % 2]);

  //     twins[turnIndex % twins.length].update(ctx);
  //   };

  //   return ai;
};
