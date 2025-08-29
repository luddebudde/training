import { bullets } from "./arrays";
import { center, world } from "./basics";
import { createBullet } from "./createBullet";
import { Player, standardPlayer } from "./createPlayer";
import { goTo } from "./goTo";
import { loseScreen, statistics } from "./loseScreen";
import { randomArrayElement } from "./randomArrayElement";
import { getRandomColor } from "./randomColor";

export const winAnimation = (player: Player) => {
  const totalTime = 20000;
  const intervalTime = 5;
  const loopCount = totalTime / intervalTime;

  const bulletRadius = 30;
  const bulletStep = 40; // hur mycket de flyttas närmare mitten per salva
  const speed = 15;

  let bulletCooldownReset = 50;
  let bulletCooldown = bulletCooldownReset;
  let offsetFromEdge = 0; // start längst ut

  player.airFriction = false;
  standardPlayer.speed = 0;
  goTo(player, center, 50, () => {
    for (let i = 0; i < loopCount; i++) {
      setTimeout(() => {
        const currentPos = center;

        const chosenColor = getRandomColor();

        bulletCooldown--;
        if (bulletCooldown < 0) {
          createBullet(
            bullets,
            player,
            undefined,
            0,
            0,
            {},
            {
              bulletRadius,
              startPos: {
                x: offsetFromEdge + bulletRadius,
                y: world.height - bulletRadius,
              },
              vel: { x: 0, y: -speed },
              color: chosenColor,
            }
          );

          // Höger kula
          createBullet(
            bullets,
            player,
            undefined,
            0,
            0,
            {},
            {
              bulletRadius,
              startPos: {
                x: world.width - offsetFromEdge - bulletRadius,
                y: world.height - bulletRadius,
              },
              vel: { x: 0, y: -speed },
              color: chosenColor,
            }
          );

          createBullet(
            bullets,
            player,
            undefined,
            0,
            0,
            {},
            {
              bulletRadius,
              startPos: {
                x: bulletRadius,
                y: world.height * Math.random(),
              },
              vel: { x: speed, y: 0 },
              color: chosenColor,
            }
          );

          // Flytta närmare mitten
          offsetFromEdge += bulletStep;

          // Om vi har nått mitten, börja om från kanten
          if (
            offsetFromEdge >=
            world.width / 2 - bulletRadius - player.radius * 4
          ) {
            offsetFromEdge = 0;
          }
          bulletCooldownReset = Math.max(bulletCooldownReset * 0.955, 2);
          bulletCooldown = bulletCooldownReset;
          console.log(bulletCooldownReset);
        }
      }, intervalTime * i);
    }
    setTimeout(() => {
      window.changeMenu("gameOver");
    }, intervalTime * loopCount);
  });
};
