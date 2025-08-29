import { entities, squares } from "../../../arrays";
import { center, world } from "../../../basics";
import { player, standardPlayer } from "../../../createPlayer";
import { makeDirection } from "../../../geometry/makeDirection";
import { goTo } from "../../../goTo";
import { multVar, origo, Vec2 } from "../../../math";
import { Deiat } from "../deiatBoss";

export const transitionToFifthPhase = (deiat: Deiat, saveTime: number) => {
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

  goTo(deiat, { x: center.x, y: center.y }, 50, () => {
    for (let i = 0; i < deiatDistToSize * saveTime; i++) {
      setTimeout(() => {
        deiat.radius -= 1 / saveTime;
        // deiat.radius += 1 / saveTime;

        standardPlayer.radius +=
          //   Math.max(
          playerDistToSize / deiatDistToSize / saveTime;
        // );

        standardPlayer.speed -=
          playerDistToSize / deiatDistToSize / deiatDistToSize;

        player.bulletSize -=
          playerDistToSize / deiatDistToSize / deiatDistToSize;

        standardPlayer.speed = baseSpeed * (player.radius / playerBaseRadius);
        player.bulletSize = baseBulletSize * (player.radius / playerBaseRadius);
        player.bulletSpeed =
          baseBulletSpeed * (player.radius / playerBaseRadius);
        player.bulletDamage =
          baseBulletDamage * (player.radius / playerBaseRadius);
      }, 20 * i);
    }
    setTimeout(() => {
      deiat.collision = true;

      const top = {
        x: 0,
        y: 0,
        width: world.width,
        height: 0,
        expansion: {
          width: 0,
          height: 0.5,
        },
        moveInstead: false, // växer nedåt
        color: "red",
      };

      const bottom = {
        x: 0,
        y: world.height,
        width: world.width,
        height: world.height,
        expansion: {
          width: 0,
          height: -0.5,
        },
        moveInstead: true, // ska flytta uppåt
        color: "red",
      };

      const left = {
        x: 0,
        y: 0,
        width: 0,
        height: world.height,
        expansion: {
          width: 1,
          height: 0,
        },
        moveInstead: false, // växer åt höger
        color: "red",
      };

      const right = {
        x: world.width,
        y: 0,
        width: world.width,
        height: world.height,
        expansion: {
          width: -1,
          height: 0,
        },
        moveInstead: true, // ska flytta vänster
        color: "red",
      };

      const rectangles = [top, bottom, left, right];
      squares.push(...rectangles);

      const endValue = world.width / 8;
      const step = 2;
      for (let i = 0; i < endValue / step; i++) {
        setTimeout(() => {
          rectangles.forEach((rect) => {
            if (rect.moveInstead) {
              // flytta istället för att ändra size
              rect.x += rect.expansion.width * step;
              rect.y += rect.expansion.height * step;
            } else {
              // ändra storlek som vanligt
              rect.width += rect.expansion.width * step;
              rect.height += rect.expansion.height * step;
            }
          });
        }, i * 15);
      }

      setTimeout(() => {
        deiat.phaseCounter++;
        deiat.collision = false;
        deiat.transitionShield = false;
        deiat.attackDelay = 50;
        deiat.speed = 45;
        deiat.pickedAttack = 0;
        deiat.contactDamage = 0;
      }, (endValue / step) * 15);
    }, deiatDistToSize);
  });
};
