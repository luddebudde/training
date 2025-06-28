import { bullets, entities, liveBosses } from "../arrays";
import { world } from "../basics";
import { createBullet } from "../createBullet";
import { player } from "../createPlayer";
import { debuffPlayer } from "../debuffPlayer";
import { drawCircle } from "../draw/drawCircle";

import { getDistance, makeDirection } from "../geometry/makeDirection";
import { add, multVar, origo, Vec2 } from "../math";
import {
  randomArrayElement,
  randomArrayElementSplice,
} from "../randomArrayElement";

const health = 150;

type Charger = {
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

  update: () => void;
  // deathAnimation: (ctx, liveBosses, bossIndex) => void;
  onWallBounce: () => void;
};

const swingBlade = (ctx, boss) => {
  const blade = {
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
    onHit: () => {},
  };

  boss.blade = blade;

  bullets.push(blade);

  for (let i = 0; i < boss.radius; i++) {
    setTimeout(() => {
      // console.log("blade", boss.blade.pos);

      boss.blade.offset.y--;

      // drawCircle(ctx, bladePoint);
    }, 7 * i);
  }

  setTimeout(() => {
    for (let i = 0; i < 60; i++) {
      setTimeout(() => {
        boss.blade.radius++;
        boss.blade.radius;
      }, 15 * i);
    }
  }, 7 * boss.radius * 1.2);

  setTimeout(() => {
    // blade.angle += 0.05;
  }, 7 * boss.radius * 1.2 + 15 * 60);
};

const bulletRadius = 15;

const turretSpots: Vec2[] = [
  { x: bulletRadius, y: bulletRadius },
  { x: world.width - bulletRadius, y: bulletRadius },
  { x: bulletRadius, y: world.height - bulletRadius },
  { x: world.width - bulletRadius, y: world.height - bulletRadius },
];

export const createNewBoss = () => {
  const boss = {
    name: "Boss",
    maxHealth: health,
    health: health * 0.45,
    contactDamage: 20,
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
    mass: 1000,

    damageConflicted: 0,
    damageAbsorbed: 0,
    bulletsShot: 0,
    timesDefeated: 0,

    collision: false,
    airFriction: false,

    // Pahses
    phaseCounter: 10,
    reacheadHalfPoint: false,

    launchBlade: true,
    blade: undefined,

    update: (ctx): void => {
      bullets.forEach((bullet) => {
        if (bullet.shooter === player) {
          bullet.damage = 0;
        }
      });

      if (boss.health < boss.maxHealth / 2 && !boss.reacheadHalfPoint) {
        const maxI = 25; // Antal kulor
        const angleStep = (Math.PI * 2) / maxI; // Steg mellan vinklar för att täcka en cirkel
        const speed = 25; // Hastighet för kulorna

        // for (let x = 0; x < 500; x++) {
        setTimeout(() => {
          for (let i = 0; i < maxI; i++) {
            const angle = i * angleStep; // Vinkel för den aktuella kulan
            const target = {
              x: Math.cos(angle) * 100 + boss.pos.x, // Punkt utåt baserad på vinkel
              y: Math.sin(angle) * 100 + boss.pos.y,
            };

            createBullet(
              bullets,
              boss, // Ingen specifik "shooter"
              target, // Målet baserat på vinkeln
              10, // Skadevärde
              speed // Hastighet
            );
          }
          boss.reacheadHalfPoint = false;
        }, 2500);
        boss.reacheadHalfPoint = true;
        // }
      }

      // console.log(boss.blade);

      if (boss.blade !== undefined) {
        const blade = boss.blade;
        const distance = getDistance(boss.pos, blade.pos);

        // console.log(blade.angle, distance, boss.pos);
        // console.log(blade.pos, boss.pos, blade.pos.x - boss.pos.x);
        console.log(distance);

        // blade.pos.x = Math.cos(blade.angle) * distance + boss.pos.x;
        blade.pos = boss.pos;
        // + blade.offset.x;
        blade.pos.y = Math.sin(blade.angle) * distance;
        // + boss.pos.y + blade.offset.y;
        // add(boss.pos, boss.blade.offset);
      }
      if (boss.phaseCounter < 0) {
        // createBullet(
        //   bullets,
        //   boss,
        //   player.pos,
        //   5,
        //   20,
        //   {},
        //   {
        //     team: "none",
        //     startPos: randomArrayElement(turretSpots),
        //     bulletRadius: bulletRadius,
        //     rememberShooter: false,
        //   }
        // );

        if (
          getDistance(boss.pos, player.pos) <
            (boss.radius * 2 + player.radius * 2) * 2 &&
          boss.launchBlade === true
        ) {
          swingBlade(ctx, boss);
          console.log("laucning blade");

          boss.launchBlade = false;
        }
        boss.phaseCounter = 10;
      }

      boss.phaseCounter--;
    },
  };

  entities.push(boss);
  liveBosses.push(boss);
  // entities.push(boss.blade);
  return boss;
};
