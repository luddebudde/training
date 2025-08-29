import { bullets, entities, squares } from "../../../arrays";
import { center, world } from "../../../basics";
import { createBullet } from "../../../createBullet";
import { player, standardPlayer } from "../../../createPlayer";
import { dealDamage } from "../../../dealDamage";
import { makeDirection } from "../../../geometry/makeDirection";
import { goTo } from "../../../goTo";
import { add, multVar, origo, Vec2 } from "../../../math";
import { Deiat } from "../deiatBoss";

export const deathScene = (deiat: Deiat, saveTime: number) => {
  const deiatBaseRadius = deiat.radius;
  const deiatEndRadius = 60;
  const deiatDistToSize = Math.abs(deiatBaseRadius - deiatEndRadius);

  deiat.phaseCounter++;
  deiat.collision = false;
  deiat.transitionShield = false;
  deiat.attackDelay = 200;
  deiat.speed = 45;
  deiat.pickedAttack = 0;
  deiat.contactDamage = 10;
  deiat.collision = true;

  const playerBaseRadius = player.radius;
  const playerEndRadius = 50;

  const baseSpeed = player.speed;
  const baseBulletSize = player.bulletSize;
  const baseBulletSpeed = player.bulletSpeed;
  const baseBulletDamage = player.bulletDamage;

  const playerDistToSize = Math.abs(playerEndRadius - playerBaseRadius);

  squares.length = 0;

  let delay = 25;

  goTo(deiat, { x: center.x, y: center.y }, 10, () => {
    for (let i = 0; i < 100; i++) {
      setTimeout(() => {
        // deiat.radius =
        //   ((deiat.radius + i) % (60 + Math.floor(i * 5))) + deiatBaseRadius;
        deiat.radius += 5;

        for (let x = 0; x < Math.ceil(i / 5); x++) {
          setTimeout(() => {
            // if (Math.random() < 1 / Math.ceil(i % 20))
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
          }, x * 10);
        }
      }, 120 * i);
    }
    setTimeout(() => {
      const stepValue = 50;
      for (let i = 0; i < deiat.radius / stepValue; i++) {
        setTimeout(() => {
          deiat.radius = Math.max(deiat.radius - stepValue, 0);
        }, i * 15);
      }

      setTimeout(() => {
        dealDamage(player, deiat, deiat.health);
      }, (deiat.radius / stepValue) * 150);
    }, 120 * 100);
  });
};
