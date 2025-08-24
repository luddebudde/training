import { bullets, entities, squares } from "../../../arrays";
import { center, world } from "../../../basics";
import { createBullet } from "../../../createBullet";
import { player, standardPlayer } from "../../../createPlayer";
import { makeDirection } from "../../../geometry/makeDirection";
import { goTo } from "../../../goTo";
import { add, multVar, origo, Vec2 } from "../../../math";
import { Deiat } from "../deiatBoss";

export const deathScene = (deiat: Deiat, saveTime: number) => {
  const deiatBaseRadius = deiat.radius;
  const deiatEndRadius = 60;
  const deiatDistToSize = Math.abs(deiatBaseRadius - deiatEndRadius);

  const playerBaseRadius = player.radius;
  const playerEndRadius = 50;

  const baseSpeed = player.speed;
  const baseBulletSize = player.bulletSize;
  const baseBulletSpeed = player.bulletSpeed;
  const baseBulletDamage = player.bulletDamage;

  const playerDistToSize = Math.abs(playerEndRadius - playerBaseRadius);

  squares.length = 0;

  let delay = 25;

  goTo(deiat, { x: center.x, y: center.y }, 25, () => {
    for (let i = 0; i < deiatDistToSize * saveTime; i++) {
      setTimeout(() => {
        deiat.radius = ((deiat.radius + i) % 60) + deiatBaseRadius;
        // deiat.radius += 1 / saveTime;

        // standardPlayer.radius +=
        //   //   Math.max(
        //   playerDistToSize / deiatDistToSize / saveTime;
        // // );

        // standardPlayer.speed -=
        //   playerDistToSize / deiatDistToSize / deiatDistToSize;

        // player.bulletSize -=
        //   playerDistToSize / deiatDistToSize / deiatDistToSize;

        // standardPlayer.speed = baseSpeed * (player.radius / playerBaseRadius);
        // player.bulletSize = baseBulletSize * (player.radius / playerBaseRadius);
        // player.bulletSpeed =
        //   baseBulletSpeed * (player.radius / playerBaseRadius);
        // player.bulletDamage =
        //   baseBulletDamage * (player.radius / playerBaseRadius);
      }, 120 * i);
    }
    setTimeout(() => {
      //   deiat.phaseCounter++;
      //   deiat.collision = false;
      //   deiat.transitionShield = false;
      //   deiat.attackDelay = 200;
      //   deiat.speed = 45;
      //   deiat.pickedAttack = 0;
      //   deiat.contactDamage = 10;
      //   deiat.collision = true;

      for (let i = 0; i < 1000; i++) {
        setTimeout(() => {
          createBullet(
            bullets,
            deiat,
            undefined,
            0,
            0,
            {},
            {
              color: "yellow",
              vel: {
                x: (Math.random() - 0.5) * 80,
                y: (Math.random() - 0.5) * 80,
              },
            }
          );
        }, i * 10);
      }

      //   const rounds = 3;
      //   const timeTaken = 5000;
      //   //   const delay = 250;
      //   // ELLER 250;
      //   const baseDirection = makeDirection(deiat.pos, player.pos);
      //   const baseAngle = Math.atan2(baseDirection.y, baseDirection.x);

      //   let totalAngleStep = 0;
      //   const angleStep = (Math.PI * 2 * rounds) / timeTaken;

      //   const bulletCount = timeTaken;
      //   console.log(bulletCount);

      //   let rotationOffset = 0;
      //   let rotationSpeed = Math.PI / 36; // hur mycket hela mönstret vrids per burst (~5 grader)
      //   const bulletsPerBurst = 8;

      //   for (let i = 0; i < bulletCount * rounds; i++) {
      //     delay = Math.max(delay - 50, 5);
      //     setTimeout(() => {
      //       rotationOffset += rotationSpeed; // vrid hela mönstret lite

      //       for (let j = 0; j < bulletsPerBurst; j++) {
      //         const shootAngle =
      //           rotationOffset + j * ((Math.PI * 2) / bulletsPerBurst);
      //         const direction = {
      //           x: Math.cos(shootAngle),
      //           y: Math.sin(shootAngle),
      //         };
      //         const newVel = multVar(direction, 60);

      //         createBullet(
      //           bullets,
      //           deiat,
      //           undefined,
      //           0, // damage
      //           0,
      //           {},
      //           {
      //             vel: newVel,
      //             startPos: { x: deiat.pos.x, y: deiat.pos.y },
      //             color: "red",
      //           }
      //         );
      //       }

      //       player.vel = add(
      //         player.vel,
      //         multVar(makeDirection(player.pos, deiat.pos), -0.25)
      //       );
      //     }, i * delay);
      //   }

      //   for (let i = 0; i < bulletCount; i++) {
      //     setTimeout(() => {
      //       totalAngleStep += angleStep;
      //       const waveOffset = i * angleStep;
      //       const shootAngle = baseAngle + waveOffset;
      //       const direction = {
      //         x: Math.cos(shootAngle),
      //         y: Math.sin(shootAngle),
      //       };
      //       const newVel = multVar(direction, 15);

      //       createBullet(
      //         bullets,
      //         deiat,
      //         undefined,
      //         0,
      //         0,
      //         {},
      //         {
      //           vel: newVel,
      //           startPos: { x: deiat.pos.x, y: deiat.pos.y },
      //           color: "red",
      //         }
      //       );
      //     }, delay * ((i % 3) + 1));
      //   }
      //   setTimeout(() => {}, 1500);
    }, deiatDistToSize);
  });
};
