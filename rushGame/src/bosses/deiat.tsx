import { bullets, entities, liveBosses } from "../arrays";
import { center, world } from "../basics";
import { createBullet, createWaveShoot } from "../createBullet";
import { player } from "../createPlayer";

import { makeDirection } from "../geometry/makeDirection";
import { goTo } from "../goTo";
import { add, multVar, numberIsWithinMargin, origo } from "../math";
import { createSprayerBoss } from "./sprayer";

const health = 15000;

let phaseCounter = 0;
let transitionCounter = 0;

const firstPhase = (deiat) => {
  deiat.attackCounter = 10000;

  deiat.airFriction = false;
  const direction = makeDirection(deiat.pos, player.pos);

  createBullet(
    bullets,
    deiat,
    player.pos,
    20,
    120,
    {},
    {
      bulletRadius: 50,
      color: "yellow",
      onWallBounce(bullet, newVel) {
        createBullet(
          bullets,
          deiat,
          undefined,
          10,
          0,
          {},
          {
            startPos: add(bullet.pos, newVel),
            vel: multVar(makeDirection(bullet.pos, player.pos), 15),
            bulletRadius: 40,
            // color: "red",
          }
        );
      },
    }
  );

  const bulletCount = 40;
  const waveLenght = Math.PI * 0.8;
  const baseDirection = makeDirection(deiat.pos, player.pos);

  const baseAngle = Math.atan2(baseDirection.y, baseDirection.x);

  const stepAngle = waveLenght / bulletCount;

  const skipMargin = 2;
  for (let i = 0; i < bulletCount; i++) {
    if (!numberIsWithinMargin(Math.floor(bulletCount / 2), i, skipMargin)) {
      const waveOffset = -waveLenght / 2 + i * stepAngle;
      const shootAngle = baseAngle + waveOffset;
      const direction = {
        x: Math.cos(shootAngle),
        y: Math.sin(shootAngle),
      };
      const newVel = multVar(direction, 15);

      createBullet(
        bullets,
        deiat,
        undefined,
        5,
        0,
        {},
        {
          vel: newVel,
          startPos: { x: deiat.pos.x, y: deiat.pos.y },
          color: "red",
        }
      );
    }
  }

  deiat.vel = multVar(direction, deiat.speed);
};

const secondPhase = (deiat) => {
  deiat.attackCounter = 10000;
  const number = Math.random();
  const numberOfAttacks = 1;

  console.log("running second attack");

  // if (number > (1 / numberOfAttacks) * 1) {
  if (false) {
    const rounds = 5;
    const bulletCount = 50; // hur många "bursts"
    const delay = 100; // ms mellan varje burst
    const bulletsPerBurst = 8; // 4 skott per gång
    // let rotationSpeed = Math.PI / 36; // hur mycket hela mönstret vrids per burst (~5 grader)
    let rotationSpeed = Math.PI / 36; // hur mycket hela mönstret vrids per burst (~5 grader)

    // console.log(Math.PI / 20 / (Math.PI / 36));

    let rotationOffset = 0;

    for (let i = 0; i < bulletCount * rounds; i++) {
      setTimeout(() => {
        rotationOffset += rotationSpeed; // vrid hela mönstret lite
        rotationSpeed = rotationSpeed * 1.0035;

        for (let j = 0; j < bulletsPerBurst; j++) {
          const shootAngle =
            rotationOffset + j * ((Math.PI * 2) / bulletsPerBurst);
          const direction = {
            x: Math.cos(shootAngle),
            y: Math.sin(shootAngle),
          };
          const newVel = multVar(direction, 15);

          createBullet(
            bullets,
            deiat,
            undefined,
            2, // damage
            0,
            {},
            {
              bulletRadius: Math.max(20 - Math.floor(i / bulletCount) * 5, 10),
              vel: newVel,
              startPos: { x: deiat.pos.x, y: deiat.pos.y },
              color: "red",
            }
          );
        }
      }, i * delay);
    }
    // } else if (number > (1 / numberOfAttacks) * 2) {
  } else if (true) {
    // Second option
    const blade = {
      damage: 40,
      shooter: deiat,
      mass: 500,
      pos: deiat.pos,
      vel: origo,
      offset: origo,
      color: "black",
      radius: 20,
      angle: 0,
      team: "enemy",
      collision: false,
      airFriction: false,
      indestructible: true,
      distance: 0,
      onHit: () => {},
    };
    let removeBlade = false;

    const angleStep = 0.01;
    const distanceStep = 8;
    const sizeStep = 4;
    const swingSpeed = 5;
    const bladeSize = 320;
    const distanceAway = deiat.radius * 3.5;
    console.log(distanceAway);

    const swingDuration = ((Math.PI * 2) / angleStep) * swingSpeed;

    // deiat.blade = blade;
    bullets.push(blade);

    const updateBlade = () => {
      if (blade !== undefined) {
        blade.pos.x = Math.cos(blade.angle) * blade.distance + deiat.pos.x;
        blade.pos.y = Math.sin(blade.angle) * blade.distance + deiat.pos.y;
        // console.log(blade);
      }

      if (!removeBlade) {
        requestAnimationFrame(updateBlade);
      }
    };

    requestAnimationFrame(updateBlade);

    for (let i = 0; i < distanceAway / distanceStep; i++) {
      setTimeout(() => {
        blade.distance += distanceStep;
      }, 7 * i);
    }

    const expandDelay = 2 * deiat.radius;
    for (let i = 0; i < bladeSize / sizeStep; i++) {
      setTimeout(() => {
        blade.radius += sizeStep;
      }, expandDelay + swingSpeed * i);
    }

    const rotateDelay = expandDelay + swingSpeed * 60;
    for (let i = 0; i < (Math.PI * 2) / angleStep; i++) {
      setTimeout(() => {
        blade.angle += angleStep;
      }, rotateDelay + swingSpeed * i);
    }

    const shrinkDelay = rotateDelay + swingDuration;
    for (let i = 0; i < bladeSize / sizeStep; i++) {
      setTimeout(() => {
        blade.radius -= sizeStep;
      }, shrinkDelay + swingSpeed * i);
    }

    const retractDelay = shrinkDelay + swingSpeed * 60;
    for (let i = 0; i < distanceAway / distanceStep; i++) {
      setTimeout(() => {
        blade.distance -= distanceStep;
      }, retractDelay + 7 * i);
    }

    const destroyDelay = retractDelay + 4 * deiat.radius;
    setTimeout(() => {
      bullets.splice(bullets.indexOf(blade), 1);
      removeBlade = true;
    }, destroyDelay);
  } else {
    // Third option
    console.log("3");
  }

  // deiat.attackCounter = 100;
};

const transitionToSecondPhase = (deiat) => {
  goTo(deiat, center, 80, () => {
    for (let i = 0; i < 80; i++) {
      setTimeout(() => {
        deiat.radius++;
      }, 20 * i);
    }
    setTimeout(() => {
      phaseCounter++;

      // console.log(phaseCounter, phaseList[phaseCounter]);

      deiat.attackCounter = 0;
    }, 80 * 20);
  });
};

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
  attackCounter: number;

  update: () => void;
  // deathAnimation: (ctx, liveBosses, bossIndex) => void;
  onWallBounce: () => void;
};

const phaseList = [firstPhase, secondPhase];
const transitionList = [transitionToSecondPhase];
const healthCheckpoints = [1.1, 0.0];

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
    attackCounter: 100,

    update: (): void => {
      deiat.attackCounter--;
      // console.log(phaseCounter);
      if (
        deiat.health <
        deiat.maxHealth * healthCheckpoints[transitionCounter]
      ) {
        transitionList[transitionCounter](deiat);

        deiat.attackCounter = 1000;
        transitionCounter++;
      }

      // console.log(deiat.attackCounter);

      if (deiat.attackCounter <= 0) {
        // firstPhase(deiat);

        // console.log("attack", phaseList[phaseCounter]);

        phaseList[phaseCounter](deiat);
      }
    },
    onWallBounce: () => {
      deiat.vel = origo;
      deiat.attackCounter = 60;
    },
  };

  entities.push(deiat);
  liveBosses.push(deiat);
};
