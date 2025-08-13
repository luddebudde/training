import { bullets } from "../../../arrays";
import { center, world } from "../../../basics";
import { createBullet } from "../../../createBullet";
import { divVar, sub } from "../../../math";
import { Deiat } from "../deiatBoss";

// const saveTime = 0.1;
export const enterArena = (deiat: Deiat, saveTime: number) => {
  const totalTime = 7500 * saveTime;
  const intervalTime = 5;
  const loopCount = totalTime / intervalTime;

  const bulletRadius = 30;
  const bulletStep = 40; // hur mycket de flyttas närmare mitten per salva
  const damage = 5;
  const speed = 35;

  let bulletCooldownReset = 50;
  let bulletCooldown = bulletCooldownReset;
  let offsetFromEdge = 0; // start längst ut

  let currentPos = { x: center.x, y: world.height + deiat.radius * 8 };
  const distanceToGoal = sub(currentPos, { x: center.x, y: deiat.radius });
  for (let i = 0; i < loopCount; i++) {
    setTimeout(() => {
      currentPos = sub(currentPos, divVar(distanceToGoal, loopCount));

      deiat.pos = currentPos;

      bulletCooldown--;
      if (bulletCooldown < 0) {
        createBullet(
          bullets,
          deiat,
          undefined,
          damage,
          0,
          {},
          {
            bulletRadius,
            startPos: {
              x: offsetFromEdge + bulletRadius,
              y: world.height - bulletRadius,
            },
            vel: { x: 0, y: -speed },
            color: "orange",
          }
        );

        // Höger kula
        createBullet(
          bullets,
          deiat,
          undefined,
          damage,
          0,
          {},
          {
            bulletRadius,
            startPos: {
              x: world.width - offsetFromEdge - bulletRadius,
              y: world.height - bulletRadius,
            },
            vel: { x: 0, y: -speed },
            color: "orange",
          }
        );

        // Flytta närmare mitten
        offsetFromEdge += bulletStep;

        // Om vi har nått mitten, börja om från kanten
        if (
          offsetFromEdge >=
          world.width / 2 - bulletRadius - deiat.radius * 4
        ) {
          offsetFromEdge = 0;
        }
        bulletCooldownReset = Math.max(bulletCooldownReset * 0.955, 0);
        bulletCooldown = bulletCooldownReset;
      }
    }, intervalTime * i);
  }

  setTimeout(() => {
    deiat.phaseCounter++;
    deiat.collision = true;
    deiat.transitionShield = false;
    deiat.attackDelay = 80;
  }, intervalTime * loopCount);
};
