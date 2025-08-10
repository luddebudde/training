import { bullets, entities, liveBosses } from "../arrays";
import { center, world } from "../basics";
import { createBullet, createWaveShoot } from "../createBullet";
import { player } from "../createPlayer";

import { getDistance, makeDirection } from "../geometry/makeDirection";
import { goTo } from "../goTo";
import { add, multVar, numberIsWithinMargin, origo, Vec2 } from "../math";
import { createSprayerBoss } from "./sprayer";

const health = 15000;

let phaseCounter = 0;
let transitionCounter = 0;

const firstPhase = (deiat) => {
  deiat.attackDelay = 10000;

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
  deiat.attackDelay = 10000;
  const number = Math.random();
  const numberOfAttacks = 3;

  console.log("running second attack");

  if (number > (1 / numberOfAttacks) * 1) {
    // if (false) {
    if (deiat.pickedAttack === 1) {
      secondPhase(deiat);
      return;
    }
    deiat.pickedAttack = 1;

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

    setTimeout(() => {
      deiat.attackDelay = 50;
    }, bulletCount * rounds * delay);
  } else if (number > (1 / numberOfAttacks) * 2) {
    // } else if (false) {
    // Second option
    // if (deiat.pickedAttack === 2) {
    //   // alert("STOp");
    //   secondPhase(deiat);

    //   return;
    // }
    deiat.pickedAttack = 2;
    const blade = {
      damage: 40,
      shooter: deiat,
      mass: 500,
      pos: deiat.pos,
      vel: origo,
      offset: origo,
      color: "black",
      radius: 20,
      angle: Math.random() * Math.PI * 2,
      team: "enemy",
      collision: false,
      airFriction: false,
      indestructible: true,
      distance: 0,
      onHit: () => {},
    };
    let removeBlade = false;

    const angleStep = 0.01;
    const distanceStep = 6;
    const sizeStep = 2;
    const swingSpeed = 2;
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
      }

      const randomSide: number = Math.random();
      const randomPos: number =
        Math.random() *
        (center.x - distanceAway - bladeSize + player.radius * 2);
      let finalXPos: Vec2;
      const bulletRadius = 15;

      if (randomSide > 0.5) {
        finalXPos = {
          x: randomPos,
          y: bulletRadius,
        };
      } else {
        finalXPos = {
          x: world.width - randomPos,
          y: bulletRadius,
        };
      }

      createBullet(
        bullets,
        deiat,
        undefined,
        15,
        30,
        {},
        {
          color: "red",
          startPos: finalXPos,
          vel: { x: 0, y: 30 },
        }
      );

      // if (
      //   player.pos.x < deiat.pos.x - distanceAway - bladeSize - player.radius ||
      //   player.pos.x > deiat.pos.x + distanceAway + bladeSize + player.radius
      // ) {
      //   console.log("too far");
      // }
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

    const expandDelay = 2 * deiat.radius + (distanceAway / distanceStep) * 6;
    for (let i = 0; i < bladeSize / sizeStep; i++) {
      setTimeout(() => {
        blade.radius += sizeStep;
      }, expandDelay + swingSpeed * i);
    }

    const rotateDelay =
      expandDelay + swingSpeed * 60 + (bladeSize / sizeStep) * 4;
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

      deiat.attackDelay = 30;
    }, destroyDelay);
  } else {
    // Third option
    // if (deiat.pickedAttack === 3) {
    //   secondPhase(deiat);
    //   return;
    // }

    const delay = 75;
    const totalTime = 20000;

    const bulletCount = totalTime / delay;
    // const bulletSpacing = world.width / bulletCount;
    const bulletSize = 15;

    const spacing = world.height / bulletCount; // avstånd mellan kulor
    // const moveStep = 30;

    const speed = 30;
    const damage = 1.2;

    for (let i = 0; i < bulletCount / 2; i++) {
      setTimeout(() => {
        for (let k = 0; k < center.y / spacing; k++) {
          setTimeout(() => {
            const shootPos = {
              x: i % 2 ? bulletSize : world.width - bulletSize,
              y: k % 2 ? center.y + spacing * k : center.y - spacing * k,
            };
            for (let dirIn = 0; dirIn < 2; dirIn++) {
              const targetPos =
                dirIn % 2
                  ? { x: center.x, y: -(world.height - shootPos.y) - 250 }
                  : { x: center.x, y: world.height + shootPos.y + 250 };

              // console.log(targetPos);

              createBullet(
                bullets,
                deiat,
                targetPos,
                damage,
                speed,
                {},
                {
                  bulletRadius: bulletSize,
                  startPos: shootPos,
                  color: "red",
                }
              );
            }
          }, k * delay);
        }
      }, i * delay);
    }

    let bulletCounter = 10;
    for (let i = 0; i < bulletCount; i++) {
      setTimeout(() => {
        const distance = getDistance(player.pos, deiat.pos);
        const direction = makeDirection(player.pos, deiat.pos);

        player.vel = add(
          player.vel,
          multVar(direction, -(1 / distance) * 1500)
        );
        bulletCounter--;

        if (bulletCounter < 0) {
          const randomAngle = Math.random() * Math.PI * 2;

          console.log(Math.cos(randomAngle), randomAngle);

          createBullet(
            bullets,
            deiat,
            {
              x: Math.cos(randomAngle) + deiat.pos.x,
              y: Math.sin(randomAngle) + deiat.pos.y,
            },
            15,
            10,
            {},
            { color: "purple" }
          );

          bulletCounter = 2;
        }
      }, i * delay);
    }

    // for (let side = 0; side < 2; side++) {
    //   // 0 = vänster, 1 = höger
    //   for (let i = 0; i < bulletCount; i++) {
    //     const startY = bulletSpacing / 2 + i * bulletSpacing; // jämn fördelning
    //     const startX = side === 0 ? bulletSize : world.width - bulletSize;

    //     const startPos = { x: startX, y: startY };

    //     // Sätt riktning snett mot mitten
    //     const targetX = center.x;
    //     const targetY =
    //       i % 0
    //         ? 0 // från vänster, sikta lite uppåt
    //         : world.height; // från höger, sikta lite nedåt

    //     const direction = makeDirection(startPos, { x: targetX, y: targetY });
    //     // const velocity = multVar(direction, speed);

    //     createBullet(
    //       bullets,
    //       deiat,
    //       { x: targetX, y: targetY },
    //       damage,
    //       speed,
    //       {},
    //       {
    //         bulletRadius: bulletSize,
    //         startPos,
    //         // vel: velocity,
    //         color: "red",
    //       }
    //     );
    //   }
    // }

    setTimeout(() => {
      deiat.attackDelay = 250;
    }, bulletCount * delay);

    deiat.pickedAttack = 3;

    console.log("3");
  }

  // deiat.attackDelay = 100;
};

// const saveTime = 1
const saveTime = 0.1;
const transitionToSecondPhase = (deiat) => {
  goTo(deiat, center, 80 * saveTime, () => {
    for (let i = 0; i < 80 * saveTime; i++) {
      setTimeout(() => {
        deiat.radius += 1 / saveTime;
      }, 20 * i);
    }
    setTimeout(() => {
      phaseCounter++;

      // console.log(phaseCounter, phaseList[phaseCounter]);

      deiat.attackDelay = 0;
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
    attackDelay: 20,

    secondPhase: {
      pickedAttack: undefined,
    },

    update: (): void => {
      deiat.attackDelay--;
      // console.log(phaseCounter);
      if (
        deiat.health <
        deiat.maxHealth * healthCheckpoints[transitionCounter]
      ) {
        transitionList[transitionCounter](deiat);

        deiat.attackDelay = 1000;
        transitionCounter++;
      }

      // console.log(deiat.attackDelay);

      if (deiat.attackDelay <= 0) {
        // firstPhase(deiat);

        // console.log("attack", phaseList[phaseCounter]);

        phaseList[phaseCounter](deiat);
      }
    },
    onWallBounce: () => {
      deiat.vel = origo;
      deiat.attackDelay = 60;
    },
  };

  entities.push(deiat);
  liveBosses.push(deiat);
};
