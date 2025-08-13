import { bullets } from "../../../arrays";
import { center, world } from "../../../basics";
import { createBullet } from "../../../createBullet";
import { player } from "../../../createPlayer";
import { getDistance, makeDirection } from "../../../geometry/makeDirection";
import { multVar, origo, Vec2, add } from "../../../math";
import { Deiat } from "../deiatBoss";

export const secondPhase = (deiat: Deiat) => {
  deiat.attackDelay = 10000;

  const firstAttackWeight = 1;
  const secondAttackWeight = 2;
  const thirdAttackWeight = 1;

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

  // console.log(chosenAttack);
  if (chosenAttack === 0) {
    // if (false) {
    if (deiat.secondPhase.pickedAttack === 0) {
      secondPhase(deiat);
      return;
    }
    deiat.secondPhase.pickedAttack = 0;

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
  } else if (chosenAttack === 1) {
    // } else if (false) {
    // Second option
    // if (deiat.secondPhase.pickedAttack === 1) {
    //   // alert("STOp");
    //   secondPhase(deiat);
    //   return;
    // }
    deiat.secondPhase.pickedAttack = 1;
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

    const expandDelay = 2 * deiat.radius + (distanceAway / distanceStep) * 4;
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
  } else if (chosenAttack === 2) {
    // Third option
    if (deiat.secondPhase.pickedAttack === 2) {
      secondPhase(deiat);
      return;
    }

    deiat.secondPhase.pickedAttack = 2;

    const delay = 75;
    const totalTime = 20000;

    const bulletCount = totalTime / delay;
    const bulletSize = 15;
    const spacing = world.height / bulletCount;

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

    setTimeout(() => {
      deiat.attackDelay = 250;
    }, bulletCount * delay);

    deiat.pickedAttack = 3;

    console.log("3");
  }
};
