import { bullets, entities, liveBosses } from "../arrays";
import { world } from "../basics";
import { createBullet, createWaveShoot } from "../createBullet";
import { player } from "../createPlayer";
import { doCirclesOverlap } from "../geometry/doCirlceOverlap";
import { createChaser } from "../enemies/chaser";
import { makeDirection } from "../geometry/makeDirection";
import { multVar } from "../math";
import { lineBetween } from "../geometry/lineBetween";
import { drawLineBetween } from "../drawLine";
import { isPlayerBetweenEnemies } from "../geometry/isPlayerBetweenEnemies";

const attackerHealth: number = 1200;
const shooterHealth: number = 800;

const attackerRadius: number = 80;
const shooterRadius: number = 60;

let attackerCounterReset: number = 50;
let shooterCounterReset: number = 50;

let turnIndex: number = 0;

const attackerCollideShooter = (attackerTwin, shooterTwin) => {
  if (
    doCirclesOverlap(attackerTwin, shooterTwin) &&
    Math.abs(shooterTwin.vel.x) + Math.abs(shooterTwin.vel.y) <
      shooterTwin.speed * 10 &&
    shooterTwin.health > 0 &&
    attackerTwin.health > 0
  ) {
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

type AttackerTwin = {
  maxHealth: number;
  health: number;
  contactDamage: number;
  pos: {
    x: number;
    y: number;
  };
  vel: {
    x: number;
    y: number;
  };
  radius: number;
  color: string;
  speed: number;
  team: String;
  mass: number;
  collision: true;
  airFriction: false;

  // Pahses
  phaseCounter: number;
  activatedSmallObject: boolean;
  rageMode: boolean;

  smallObject: {
    health: number;
    maxHealth: number;
    contactDamage: number;
    pos: {
      x: number;
      y: number;
    };
    vel: {
      x: number;
      y: number;
    };
    radius: number;
    color: string;
    speed: number;
    team: string;
    mass: number;
    airFriction: false;
    collision: true;
    // update: () => void;
  };

  aiMovement: () => void;
  update: (ctx) => void;
  // deathAnimation: (ctx, liveBosses, bossIndex) => void;
  onWallBounce: () => void;
};

type ShooterTwin = {
  maxHealth: number;
  health: number;
  contactDamage: number;
  pos: {
    x: number;
    y: number;
  };
  vel: {
    x: number;
    y: number;
  };
  radius: number;
  color: string;
  speed: number;
  team: String;
  mass: number;
  collision: true;
  airFriction: number | boolean;

  // Pahses
  phaseCounter: number;
  shootValue: number;
  attackIndex: number;
  bullet: {
    shotgun: {
      damage: number;
      speed: number;
    };
    normal: {
      damage: number;
      speed: number;
    };
  };
  changedPhase: boolean;

  mineDelay: number;
  mineDelayReset: number;

  chargerSpawnDelay: number;
  chargerSpawnDelayReset: number;

  aiMovement: () => void;
  update: (ctx) => void;
  // deathAnimation: (ctx, liveBosses, bossIndex) => void;
  onWallBounce: () => void;
};

export const createTwinBoss = () => {
  const attackerTwin: AttackerTwin = {
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
    },

    aiMovement: () => {},
    update: (ctx): void => {
      if (shooterTwin.health > 0) {
        drawLineBetween(ctx, attackerTwin.pos, shooterTwin.pos);

        if (isPlayerBetweenEnemies(attackerTwin.pos, shooterTwin.pos, player)) {
          const direction = makeDirection(attackerTwin.pos, attackerTwin.pos);
          attackerTwin.vel = multVar(direction, attackerTwin.speed * 2);
          attackerTwin.phaseCounter = 10000;
        }
      } else if (!attackerTwin.rageMode) {
        attackerTwin.rageMode = true;
        attackerTwin.speed *= 2;
        attackerTwin.radius *= 1.5;
        attackerTwin.color = "#9e1919";
        attackerCounterReset *= 0.3;

        const smallObject = attackerTwin.smallObject;

        const direction = makeDirection(smallObject.pos, player.pos);
        // smallObject.speed *= 2;
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

  const shooterTwin: ShooterTwin = {
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
    update: (): void => {
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

        const unitVectorX = diff.x / dist;
        const unitVectorY = diff.y / dist;

        player.vel.x += unitVectorX * force;
        player.vel.y += unitVectorY * force;
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
                shooterTwin.shootValue % 11
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
