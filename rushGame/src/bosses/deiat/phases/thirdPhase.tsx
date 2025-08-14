import { blackholes, bullets, liveBosses } from "../../../arrays";
import { center } from "../../../basics";
import { createBlackhole } from "../../../createBlackhole";
import { createBullet } from "../../../createBullet";
import { player } from "../../../createPlayer";
import { getDistance, makeDirection } from "../../../geometry/makeDirection";
import { goTo } from "../../../goTo";
import { multVar, origo, Vec2 } from "../../../math";
import { Deiat } from "../deiatBoss";

export const thirdPhase = (deiat: Deiat) => {
  deiat.attackDelay = 10000;

  const firstAttackWeight = 1;
  const secondAttackWeight = 0;
  const thirdAttackWeight = 0;

  const weights = [firstAttackWeight, secondAttackWeight, thirdAttackWeight];
  const weightSum = weights.reduce((a, b) => a + b, 0);

  const rand = Math.random() * weightSum; // slump i vikt-summan

  let cumulative = 0;
  let chosenAttack = 0;

  for (let i = 0; i < weights.length; i++) {
    cumulative += weights[i];
    if (rand < cumulative) {
      chosenAttack = i;
      break;
    }
  }

  // alert("third attack");

  if (deiat.blackhole === undefined) {
    deiat.blackhole = {
      pos: center,
      vel: origo,
      strength: 0,
      radius: 0,
      mass: 400,
      color: "black",
    };
  }

  if (true) {
    // if (deiat.pickedAttack % 2 === 0) {
    goTo(deiat, { x: center.x, y: deiat.radius * 4 }, 100, () => {
      const blackhole = deiat.blackhole;

      blackholes.splice(0, blackholes.length);
      blackholes.push(blackhole);
      const originalRadius = blackhole.radius;
      const orignalStrength = blackhole.strength;

      const targetRadius = originalRadius + 50;
      const targetStrength = originalRadius + 120;

      const totalTime = 5000;
      const intervalTime = 25;
      const loopTimes = targetRadius - originalRadius;

      for (let i = 0; i < loopTimes; i++) {
        setTimeout(() => {
          blackhole.radius++;
          blackhole.strength += (targetStrength - orignalStrength) / loopTimes;
        }, intervalTime * i);
      }

      const bulletDelay = 150;
      setTimeout(() => {
        for (let i = 0; i < totalTime / bulletDelay; i++) {
          setTimeout(() => {
            if (!blackholes.includes(blackhole)) {
              return;
            }
            const randomAngle = Math.random() * Math.PI * 2;

            createBullet(
              bullets,
              deiat,
              {
                x: Math.cos(randomAngle) + blackhole.pos.x,
                y: Math.sin(randomAngle) + blackhole.pos.y,
              },
              15,
              10,
              {},
              { color: "purple", startPos: blackhole.pos }
            );
          }, bulletDelay * i);
        }
      }, intervalTime * loopTimes);

      setTimeout(() => {
        deiat.attackDelay = 40;
      }, totalTime + intervalTime * loopTimes);
    });
  }
  // else {
  //   const intervalDelay = 750;

  //   const bulletCount = 10;
  //   const spreadRadians = (120 * Math.PI) / 180;
  //   const startAngle = -spreadRadians / 2;

  //   for (let i = 0; i < 1500; i++) {
  //     setTimeout(() => {
  //       const angleToPlayer = Math.atan2(
  //         player.pos.y - deiat.pos.y,
  //         player.pos.x - deiat.pos.x
  //       );

  //       for (let i = 0; i < bulletCount; i++) {
  //         setTimeout(() => {
  //           const angleOffset =
  //             startAngle + (i / (bulletCount - 1)) * spreadRadians;
  //           const finalAngle = angleToPlayer + angleOffset;

  //           const target: Vec2 = {
  //             x: deiat.pos.x + Math.cos(finalAngle) * 100,
  //             y: deiat.pos.y + Math.sin(finalAngle) * 100,
  //           };

  //           createBullet(bullets, deiat, target, 5, 20, {});
  //         }, 25 * i);
  //       }
  //     }, intervalDelay * i);
  //   }
  // }
};
