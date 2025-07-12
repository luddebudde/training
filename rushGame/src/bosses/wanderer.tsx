import { bullets, entities, liveBosses } from "../arrays";
import { world } from "../basics";
import { createBullet } from "../createBullet";
import { player } from "../createPlayer";
import { getDistance } from "../geometry/makeDirection";
import { multVar, origo, Vec2 } from "../math";
import { randomArrayElement } from "../randomArrayElement";

const health = 150;

type Blade = {
  damage: number;
  shooter: Wanderer;
  mass: number;
  pos: Vec2;
  vel: Vec2;
  offset: Vec2;
  color: string;
  radius: number;
  angle: number;
  team: string;
  collision: false;
  airFriction: false;
  indestructible: true;
  distance: number;
  onHit: () => void;
};

type Wanderer = {
  name: string;
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
  team: string;
  mass: number;

  damageConflicted: number;
  damageAbsorbed: number;
  bulletsShot: number;
  timesDefeated: number;

  collision: true;
  airFriction: boolean;

  // Pahses
  phaseCounter: number;

  reacheadHalfPoint: boolean;

  blade: Blade;
  bladeActivated: boolean;
  rageMode: boolean;

  update: (ctx) => void;
};

const swingBlade = (boss) => {
  const blade: Blade = {
    damage: 40,
    shooter: boss,
    mass: 500,
    pos: boss.pos,
    vel: origo,
    offset: origo,
    color: "black",
    radius: 20,
    angle: 0,
    team: "enemy",
    collision: false,
    airFriction: false,
    indestructible: true,
    distance: 0,
    onHit: () => {},
  };

  const angleStep = 0.05;
  const distanceStep = 8;
  const sizeStep = 4;
  const swingSpeed = 5;
  const bladeSize = 60;
  const distanceAway = boss.radius * 2.67;

  const swingDuration = ((Math.PI * 2) / angleStep) * swingSpeed;

  boss.blade = blade;
  bullets.push(blade);

  for (let i = 0; i < distanceAway / distanceStep; i++) {
    setTimeout(() => {
      blade.distance += distanceStep;
    }, 7 * i);
  }

  const expandDelay = 2 * boss.radius;
  for (let i = 0; i < bladeSize / sizeStep; i++) {
    setTimeout(() => {
      blade.radius += sizeStep;
    }, expandDelay + swingSpeed * i);
  }

  const rotateDelay = expandDelay + swingSpeed * 60;
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

  const destroyDelay = retractDelay + 4 * boss.radius;
  setTimeout(() => {
    bullets.splice(bullets.indexOf(blade), 1);
    boss.blade = undefined;

    setTimeout(() => {
      boss.bladeActivated = false;
    }, 750);
  }, destroyDelay);
};

const bulletRadius = 15;

const turretSpots: Vec2[] = [
  { x: bulletRadius, y: bulletRadius },
  { x: world.width - bulletRadius, y: bulletRadius },
  { x: bulletRadius, y: world.height - bulletRadius },
  { x: world.width - bulletRadius, y: world.height - bulletRadius },
];

export const createWanderer = () => {
  const wanderer: Wanderer = {
    name: "Wanderer",
    maxHealth: health,
    health: health,
    contactDamage: 2,
    pos: {
      x: Math.random() * world.width,
      y: Math.random() * world.height,
    },
    vel: {
      x: 10,
      y: 5,
    },
    radius: 120,
    color: "darkcyan",
    speed: 50,
    team: "enemy",
    mass: 1,

    damageConflicted: 0,
    damageAbsorbed: 0,
    bulletsShot: 0,
    timesDefeated: 0,

    collision: true,
    airFriction: false,

    // Pahses
    phaseCounter: 10,
    reacheadHalfPoint: false,

    blade: undefined,
    bladeActivated: false,
    rageMode: false,

    update: (): void => {
      bullets.forEach((bullet) => {
        if (bullet.shooter === player) {
          bullet.damage = player.bulletDamage * 0.0;
        }
      });

      if (
        wanderer.health < wanderer.maxHealth / 2 &&
        !wanderer.reacheadHalfPoint
      ) {
        const maxI = 25;
        const angleStep = (Math.PI * 2) / maxI;
        const speed = 25;

        // for (let x = 0; x < 500; x++) {
        setTimeout(() => {
          if (wanderer.health < 0) {
            return;
          }
          for (let i = 0; i < maxI; i++) {
            const angle = i * angleStep;
            const target = {
              x: Math.cos(angle) * 100 + wanderer.pos.x,
              y: Math.sin(angle) * 100 + wanderer.pos.y,
            };

            createBullet(bullets, wanderer, target, 10, speed);
          }
          wanderer.reacheadHalfPoint = false;
        }, 2500);
        wanderer.reacheadHalfPoint = true;
        // }
      }

      // console.log(boss.blade);

      if (wanderer.blade !== undefined) {
        const blade = wanderer.blade;

        blade.pos.x = Math.cos(blade.angle) * blade.distance + wanderer.pos.x;
        blade.pos.y = Math.sin(blade.angle) * blade.distance + wanderer.pos.y;
      }
      if (wanderer.phaseCounter < 0) {
        if (
          getDistance(wanderer.pos, player.pos) <
            (wanderer.radius * 2 + player.radius) * 2 &&
          wanderer.bladeActivated === false
        ) {
          swingBlade(wanderer);

          wanderer.bladeActivated = true;
        }

        if (
          wanderer.rageMode === false &&
          wanderer.health < wanderer.maxHealth / 2
        ) {
          wanderer.vel = multVar(wanderer.vel, 1.5);
          wanderer.rageMode = true;
        }
        createBullet(
          bullets,
          wanderer,
          player.pos,
          5,
          20,
          {},
          {
            team: "none",
            startPos: randomArrayElement(turretSpots),
            bulletRadius: bulletRadius,
            rememberShooter: false,
          }
        );

        wanderer.phaseCounter = 20;
      }

      wanderer.phaseCounter--;
    },
  };

  entities.push(wanderer);
  liveBosses.push(wanderer);
  return wanderer;
};
