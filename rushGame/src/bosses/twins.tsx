import { bullets, entities, liveBosses } from "../arrays";
import { world } from "../basics";
import { createBullet, createWaveShoot } from "../createBullet";
import { player } from "../createPlayer";
import { dealDamage } from "../dealDamage";
import { makeDirection } from "../makeDirection";
import { addVar, mult, multVar } from "../math";

const ourakHealth = 500;
const ourakRadius = 80;
const attackerCounterReset = 50;

const shooterTwinHealth = 500;
const shooterTwinRadius = 60;
const shooterCounterReset = 50;

let turnIndex = 0;

export const createTwinBoss = () => {
  const attackerTwin = {
    maxHealth: ourakHealth,
    health: ourakHealth,
    contactDamage: 0,
    pos: {
      x: ourakRadius + 1,
      y: ourakRadius + 1,
    },
    vel: {
      x: 0,
      y: 0,
    },
    radius: ourakRadius,
    color: "red",
    speed: 25,
    team: "enemy",
    mass: 10000,

    // Pahses
    phaseCounter: attackerCounterReset,
    airFriction: false,

    bulletOnHit: (entity, bullet) => {
      if (entity.team === bullet.team) {
        console.log("same team");
      } else {
        console.log("not same team");

        attackerTwin.phaseCounter = 100;

        const direction = makeDirection(attackerTwin.pos, shooterTwin.pos);
        attackerTwin.vel = multVar(direction, attackerTwin.speed * 2);
      }
    },

    aiMovement: () => {},
    update: (ctx): void => {
      ctx.beginPath();
      ctx.moveTo(attackerTwin.pos.x, attackerTwin.pos.y);
      ctx.lineTo(shooterTwin.pos.x, shooterTwin.pos.y);
      ctx.stroke();

      if (turnIndex % 2 === 1) {
        return;
      }
      attackerTwin.aiMovement();

      attackerTwin.phaseCounter--;

      if (attackerTwin.phaseCounter < 0) {
        const direction = makeDirection(attackerTwin.pos, player.pos);

        attackerTwin.vel = multVar(direction, attackerTwin.speed);

        // console.log("go");

        // ourak.phaseCounter = 10000;

        attackerTwin.phaseCounter = 1000;
        turnIndex++;
      }
    },
    onWallBounce: () => {
      attackerTwin.phaseCounter = attackerCounterReset;

      attackerTwin.vel = { x: 0, y: 0 };

      createBullet(
        bullets,
        attackerTwin,
        shooterTwin.pos,
        -20,
        20,
        {},
        {
          bulletRadius: 20,
          onHit: (entity, bullet) => {
            attackerTwin.bulletOnHit(entity, bullet);
          },
        }
      );

      attackerTwin.phaseCounter = 50;

      //   turnIndex++;
    },
  };

  entities.push(attackerTwin);
  liveBosses.push(attackerTwin);

  const shooterTwin = {
    maxHealth: shooterTwinHealth,
    health: shooterTwinHealth,
    contactDamage: 60,
    // pos: {
    //   x: world.width - selberRadius,
    //   y: selberRadius,
    // },
    pos: {
      x: world.width / 3,
      y: world.height / 3,
    },
    vel: {
      x: 0,
      y: 0,
    },
    radius: shooterTwinRadius,
    color: "purple",
    speed: 50,
    team: "enemy",
    mass: 100,
    airFriction: 0.5,

    // Pahses
    phaseCounter: shooterCounterReset,
    shootValue: 1,
    attackIndex: 0,

    mineDelay: 0,

    aiMovement: () => {},
    update: (ctx): void => {
      if (shooterTwin.vel.x > 10 || shooterTwin.vel.y > 10) {
        if (shooterTwin.mineDelay < 0) {
          createBullet(
            bullets,
            shooterTwin,
            shooterTwin.pos,
            5,
            0,
            {},
            { bulletRadius: 10, onHit: (entity, bullet) => {} }
          );

          shooterTwin.mineDelay = 5;
        }
      }
      shooterTwin.mineDelay--;
      if (turnIndex % 2 === 0) {
        return;
      }

      shooterTwin.aiMovement();

      shooterTwin.phaseCounter--;

      if (shooterTwin.phaseCounter < 0) {
        const direction = makeDirection(attackerTwin.pos, player.pos);

        if (shooterTwin.attackIndex % 2 === 0) {
          console.log("go");

          // createBullet(bullets, selber, player.pos, 40, 20);
          for (
            let i = 0;
            i < Math.floor(shooterTwin.shootValue / 10 + 1);
            i++
          ) {
            setTimeout(() => {
              createWaveShoot(
                bullets,
                shooterTwin,
                player.pos,
                4,
                10,
                Math.PI / 4,
                shooterTwin.shootValue % 11,
                {},
                {
                  onHit: (entity, bullet) => {
                    // console.log(entity, bullet);
                  },
                }
              );
            }, 50 * i);
          }
          shooterTwin.shootValue += 2;
        } else if (shooterTwin.attackIndex % 2 === 1) {
          createBullet(
            bullets,
            shooterTwin,
            player.pos,
            40,
            10,
            {},
            {
              bulletRadius: 20,
              onHit: (entity, bullet) => {
                attackerTwin.bulletOnHit(entity, bullet);
              },
            }
          );
        }

        shooterTwin.attackIndex++;
        shooterTwin.phaseCounter = shooterCounterReset;
        turnIndex++;
      }
    },
  };

  entities.push(shooterTwin);
  liveBosses.push(shooterTwin);
};
