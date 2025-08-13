import { blackholes, bullets } from "../../../arrays";
import { center } from "../../../basics";
import { createBlackhole } from "../../../createBlackhole";
import { createBullet } from "../../../createBullet";
import { player } from "../../../createPlayer";
import { getDistance } from "../../../geometry/makeDirection";
import { goTo } from "../../../goTo";
import { origo } from "../../../math";
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

  alert("third attack");

  //   if (chosenAttack === 0) {
  if (true) {
    const originalRadius = 1;
    const orignalStrength = 0;
    const blackhole = {
      pos: center,
      vel: origo,
      strength: orignalStrength,
      radius: originalRadius,
      mass: 400,
      color: "black",
    };

    blackholes.push(blackhole);

    goTo(deiat, { x: center.x, y: deiat.radius * 4 }, 100, () => {
      const targetRadius = 120;
      const targetStrength = 250;

      const intervalTime = 50;
      const loopTimes = targetRadius - originalRadius;

      for (let i = 0; i < loopTimes; i++) {
        setTimeout(() => {
          blackhole.radius++;
          blackhole.strength += (targetStrength - orignalStrength) / loopTimes;
        }, intervalTime * i);
      }

      setTimeout(() => {
        for (let i = 0; i < 500; i++) {
          setTimeout(() => {
            const randomAngle = Math.random() * Math.PI * 2;

            console.log(Math.cos(randomAngle), randomAngle);

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
          }, 50 * i);
        }
      }, intervalTime * loopTimes);
    });
  } else if (chosenAttack === 1) {
  }
};
