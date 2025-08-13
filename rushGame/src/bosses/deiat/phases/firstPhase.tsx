import { bullets } from "../../../arrays";
import { createBullet } from "../../../createBullet";
import { player } from "../../../createPlayer";
import { makeDirection } from "../../../geometry/makeDirection";
import { add, multVar, numberIsWithinMargin } from "../../../math";
import { Deiat } from "../deiatBoss";

export const firstPhase = (deiat: Deiat) => {
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
