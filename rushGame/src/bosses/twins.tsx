import { bullets, entities, liveBosses } from "../arrays";
import { world } from "../basics";
import { createBullet, createWaveShoot } from "../createBullet";
import { player } from "../createPlayer";
import { dealDamage } from "../dealDamage";
import { doCirclesOverlap } from "../doCirlceOverlap";
import { createChargerEnemy } from "../enemies/chargerEnemy";
import { createChaser } from "../enemies/chaser";
import { makeDirection } from "../makeDirection";
import { add, addVar, div, divVar, mult, multVar } from "../math";
import { createChargerBoss } from "./charger";
import { isPlayerBetweenEnemies } from "../isPlayerBetweenEnemies";

const attackerHealth = 12;
const attackerRadius = 80;
let attackerCounterReset = 50;

const shooterHealth = 8;
const shooterRadius = 60;
let shooterCounterReset = 50;

let turnIndex = 0;

const lineBetween = (ctx, attackerTwin, shooterTwin) => {
  ctx.beginPath();
  ctx.moveTo(attackerTwin.pos.x, attackerTwin.pos.y);
  ctx.lineTo(shooterTwin.pos.x, shooterTwin.pos.y);
  ctx.stroke();

  if (isPlayerBetweenEnemies(attackerTwin, shooterTwin, player)) {
    const direction = makeDirection(attackerTwin.pos, shooterTwin.pos);

    attackerTwin.vel = multVar(direction, attackerTwin.speed * 2);
    attackerTwin.phaseCounter = 10000;
  }
};

const attackerCollideShooter = (attackerTwin, shooterTwin) => {
  if (
    doCirclesOverlap(attackerTwin, shooterTwin) &&
    Math.abs(shooterTwin.vel.x) + Math.abs(shooterTwin.vel.y) <
      shooterTwin.speed / 5 &&
    shooterTwin.health > 0 &&
    attackerTwin.health > 0
  ) {
    console.log("colldiering atacker and shooteert win");

    const maxI = 10;
    const angleStep = (Math.PI * 2) / maxI;
    const speed = 20;

    for (let i = 0; i < maxI; i++) {
      const angle = i * angleStep;
      const target = {
        x: Math.cos(angle) * 100 + shooterTwin.pos.x,
        y: Math.sin(angle) * 100 + shooterTwin.pos.y,
      };

      createBullet(bullets, shooterTwin, target, 3, speed, {
        bounceable: false,
        airFriction: false,
        bounceDamageLoss: 0.3,
      });
    }
  }
};

export const createTwinBoss = () => {
  const attackerTwin = {
    maxHealth: attackerHealth,
    health: attackerHealth,
    contactDamage: 30,
    pos: {
      x: attackerRadius + 1,
      y: attackerRadius + 1,
    },
    vel: {
      x: 0,
      y: 0,
    },
    radius: attackerRadius,
    color: "red",
    speed: 15,
    team: "enemy",
    mass: 1000,
    collision: true,

    // Pahses
    phaseCounter: attackerCounterReset,
    airFriction: false,
    activatedSmallObject: false,
    rageMode: false,

    smallObject: {
      health: 10000,
      maxHealth: 10000,
      contactDamage: 5,
      pos: {
        x: world.width / 2,
        y: world.height / 2,
      },
      vel: {
        x: 0,
        y: 0,
      },
      radius: 30,
      color: "purple",
      speed: 40,
      team: "enemy",
      mass: 150,
      airFriction: false,
      collision: true,
      // smallObjects: [],
      update: () => {
        const smallObject = attackerTwin.smallObject;
        if (
          (Math.abs(smallObject.vel.x) + Math.abs(smallObject.vel.y) <
            smallObject.speed) *
          1.5
        ) {
          const direction = makeDirection(attackerTwin.pos, player.pos);
          smallObject.vel = multVar(direction, smallObject.speed);
        }
      },
    },

    aiMovement: () => {},
    update: (ctx): void => {
      if (shooterTwin.health > 0) {
        lineBetween(ctx, attackerTwin, shooterTwin);
      } else if (!attackerTwin.rageMode) {
        attackerTwin.rageMode = true;
        attackerTwin.speed *= 2;
        attackerTwin.radius *= 1.5;
        attackerTwin.color = "#9e1919";
        attackerCounterReset *= 0.3;

        const smallObject = attackerTwin.smallObject;

        const direction = makeDirection(smallObject.pos, player.pos);
        smallObject.speed *= 2;
        smallObject.vel = multVar(direction, smallObject.speed);
      }

      attackerCollideShooter(attackerTwin, shooterTwin);

      if (
        attackerTwin.health <= attackerTwin.maxHealth / 2 &&
        !attackerTwin.activatedSmallObject
      ) {
        const smallObject = attackerTwin.smallObject;

        smallObject.pos = {
          x: world.width / 2,
          y: world.height / 2,
        };
        const direction = makeDirection(smallObject.pos, player.pos);
        smallObject.vel = multVar(direction, smallObject.speed);

        entities.push(smallObject);

        attackerTwin.color = "#a80000";

        attackerTwin.activatedSmallObject = true;
      }

      // if (turnIndex % liveBosses.length === 1) {
      //   return;
      // }
      attackerTwin.aiMovement();

      attackerTwin.phaseCounter--;

      if (attackerTwin.phaseCounter < 0) {
        const direction = makeDirection(attackerTwin.pos, player.pos);

        attackerTwin.vel = multVar(direction, attackerTwin.speed);

        attackerTwin.phaseCounter = 10000;
        turnIndex++;
      }
    },
    onWallBounce: () => {
      attackerTwin.phaseCounter = attackerCounterReset;

      attackerTwin.vel = { x: 0, y: 0 };
    },
  };

  entities.push(attackerTwin);
  liveBosses.push(attackerTwin);

  const shooterTwin = {
    maxHealth: shooterHealth,
    health: shooterHealth,
    contactDamage: 20,
    pos: {
      x: world.width / 3,
      y: world.height / 3,
    },
    vel: {
      x: 0,
      y: 0,
    },
    radius: shooterRadius,
    color: "purple",
    speed: 0.5,
    team: "enemy",
    mass: 100,
    airFriction: 0.5,
    collision: true,

    // Pahses
    phaseCounter: shooterCounterReset,
    shootValue: 1,
    attackIndex: 0,
    bullet: {
      shotgun: {
        damage: 2,
        speed: 10,
      },
      normal: {
        damage: 20,
        speed: 10,
      },
    },
    changedPhase: false,

    mineDelay: 0,
    mineDelayReset: 8,

    chargerSpawnDelay: 150,
    chargerSpawnDelayReset: 300,

    aiMovement: () => {},
    update: (ctx): void => {
      if (shooterTwin.vel.x > 10 || shooterTwin.vel.y > 10) {
        if (shooterTwin.mineDelay < 0) {
          createBullet(bullets, shooterTwin, shooterTwin.pos, 3, 0);

          shooterTwin.mineDelay = shooterTwin.mineDelayReset;
        }
      }

      if (attackerTwin.health <= 0) {
        shooterTwin.chargerSpawnDelay--;

        if (shooterTwin.chargerSpawnDelay <= 0) {
          createChaser(shooterTwin.pos, false);
          shooterTwin.chargerSpawnDelay = shooterTwin.chargerSpawnDelayReset;
        }
      }

      if (
        !shooterTwin.changedPhase &&
        shooterTwin.health <= shooterTwin.maxHealth / 2
      ) {
        shooterTwin.color = "#4a014a";

        shooterTwin.changedPhase = true;
      }

      const force = 0.5;

      if (shooterTwin.changedPhase) {
        const diff = {
          x: shooterTwin.pos.x - player.pos.x,
          y: shooterTwin.pos.y - player.pos.y,
        };
        const dist = Math.sqrt(diff.x * diff.x + diff.y * diff.y);
        const direction = {
          x: -diff.x / (dist + 0.001),
          y: -diff.y / (dist + 0.001),
        };

        const unitVectorX = diff.x / dist;
        const unitVectorY = diff.y / dist;

        player.vel.x += unitVectorX * force;
        player.vel.y += unitVectorY * force;

        console.log(unitVectorX);
      }

      shooterTwin.mineDelay--;

      shooterTwin.aiMovement();

      shooterTwin.phaseCounter--;

      if (shooterTwin.phaseCounter < 0) {
        const bulletsStat = shooterTwin.bullet;
        if (shooterTwin.attackIndex % 2 === 0) {
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
                bulletsStat.shotgun.damage,
                bulletsStat.shotgun.speed,
                Math.PI / 4,
                shooterTwin.shootValue % 11,
                {},
                {
                  onHit: (entity, bullet) => {},
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
            bulletsStat.normal.damage,
            bulletsStat.normal.speed
          );
        }

        shooterTwin.attackIndex++;
        shooterTwin.phaseCounter = shooterCounterReset;
        turnIndex++;
      }
    },
    onWallBounce: () => {},
  };

  entities.push(shooterTwin);
  liveBosses.push(shooterTwin);
};
