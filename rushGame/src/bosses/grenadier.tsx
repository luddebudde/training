import { bullets, entities, liveBosses } from "../arrays";
import { world } from "../basics";
import { createBullet } from "../createBullet";
import { player } from "../createPlayer";
import { drawCircle } from "../draw/drawCircle";
import { doCirclesOverlap } from "../geometry/doCirlceOverlap";

import { getDistance, makeDirection } from "../geometry/makeDirection";
import { goTo } from "../goTo";
import { add, multVar, origo, randomValue } from "../math";

const health = 1500;

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

const createGrenade = (
  grenadier,
  stats = {
    pos: grenadier.pos,
    vel: origo,
    timeLimit: 100,
    shrapnelCount: 15,
  }
) => {
  const grenade = {
    radius: grenadier.radius / 2,
    pos: stats.pos,
    vel: stats.vel,
    color: "orange",
    timer: 0,
    timeLimit: stats.timeLimit,
    shrapnelCount: stats.shrapnelCount,
  };

  // console.log(stats.vel);

  grenadier.activeGrenades.push(grenade);
};

const placeGrenades = (grenadier, loopTimes) => {
  const coefficient = 500;
  let fakeCircle;
  for (let i = 0; i < loopTimes; i++) {
    setTimeout(() => {
      const margin = 120;
      let chosenPos;
      const maxTries = 20;
      let tries = 0;

      do {
        chosenPos = {
          x: randomValue(margin, world.width - margin),
          y: randomValue(margin, world.height - margin),
        };
        fakeCircle = {
          pos: chosenPos,
          radius: grenadier.radius * 4,
        };
        tries++;
      } while (doCirclesOverlap(player, fakeCircle) && tries < maxTries);

      if (tries >= maxTries) {
        console.log("Kunde inte hitta plats utan overlap.");
        return;
      }

      goTo(grenadier, chosenPos, 25, () => {
        createGrenade(grenadier);
      });
    }, coefficient * i);
  }
  setTimeout(() => {
    grenadier.phaseCounter = 50;
  }, coefficient * loopTimes);
};

const throwGrenades = (grenadier) => {
  const grenadeCount = 4;
  const timeLimit = 50;
  const shrapnelCount = 5;
  const coefficient = 15;
  for (let i = 0; i < grenadeCount; i++) {
    setTimeout(() => {
      createGrenade(grenadier, {
        pos: grenadier.pos,
        vel: multVar(
          makeDirection(grenadier.pos, player.pos),
          getDistance(grenadier.pos, player.pos) / timeLimit
        ),
        timeLimit: timeLimit,
        shrapnelCount: shrapnelCount,
      });
    }, timeLimit * coefficient * i);

    setTimeout(() => {
      grenadier.phaseCounter = 50;
    }, timeLimit * coefficient * grenadeCount);
  }
};

export const createGrenadier = () => {
  const radius = 80;

  const grenadier = {
    name: "Grenadier",
    maxHealth: health,
    health: health,
    contactDamage: 0,
    pos: {
      x: Math.random() * world.width,
      y: Math.random() * world.height,
    },
    vel: {
      x: 0,
      y: 0,
    },
    radius: radius,
    color: "orange",
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

    activeGrenades: [],

    update: (ctx): void => {
      grenadier.phaseCounter--;
      // console.log(grenadier.phaseCounter);

      if (grenadier.phaseCounter < 0) {
        const randomValue = Math.random();
        // const randomValue = 0.5;
        const amountOfAttacks = 2;

        // console.log(randomValue < (1 / amountOfAttacks) * 2);

        if (randomValue < 1 / amountOfAttacks) {
          placeGrenades(grenadier, 5);
        } else if (randomValue < (1 / amountOfAttacks) * 2) {
          throwGrenades(grenadier);
        }

        grenadier.phaseCounter = 10000;
      }

      grenadier.activeGrenades.forEach((grenade, index) => {
        grenade.timer++;

        if (doCirclesOverlap(grenade, player)) {
          grenade.timer = grenade.timeLimit;
        }

        if (grenade.timer >= grenade.timeLimit) {
          grenadier.activeGrenades.splice(index, 1);

          const bulletCount = grenade.shrapnelCount;
          const angleStep = (Math.PI * 2) / bulletCount;
          const randomStartAngle = Math.random() * 2 * Math.PI;
          for (let i = 0; i < bulletCount; i++) {
            const angle = i * angleStep + randomStartAngle;
            const target = {
              x: Math.cos(angle) * 100 + grenade.pos.x,
              y: Math.sin(angle) * 100 + grenade.pos.y,
            };

            createBullet(
              bullets,
              grenadier,
              target,
              10,
              20,
              {},
              { startPos: grenade.pos, bulletRadius: 15 }
            );
          }
        }

        grenade.pos = add(grenade.pos, grenade.vel);
        drawCircle(ctx, grenade);
      });
    },
    // onWallBounce: () => {
    //   grenadier.airFriction = true;

    //   grenadier.phaseCounter = 100;
    // },
  };

  entities.push(grenadier);
  liveBosses.push(grenadier);

  return grenadier;
};
