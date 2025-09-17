import { bullets, entities, liveBosses } from "../arrays";
import { world } from "../basics";
import { createBullet } from "../createBullet";
import { player } from "../createPlayer";
import { drawCircle } from "../draw/drawCircle";
import { doCirclesOverlap } from "../geometry/doCirlceOverlap";

import { getDistance, makeDirection } from "../geometry/makeDirection";
import { goTo } from "../goTo";
import { add, multVar, origo, randomNumber, Vec2 } from "../math";
import { randomAcceptedPos } from "../randomAcceptedPos";

const health = 4000;

type ShrapnelStats = {
  count: number;
  speed: number;
};

type Grenade = {
  radius: number;
  pos: Vec2;
  vel: Vec2;
  color: string;
  timer: number;
  timeLimit: number;
  shrapnelStats: ShrapnelStats;
};

type Grenadier = {
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

  collision: false;
  airFriction: boolean;

  activeGrenades: Grenade[];

  // Pahses
  phaseCounter: number;
  activityMult: number;

  update: (ctx) => void;
};

const createGrenade = (
  grenadier: Grenadier,
  stats = {
    pos: grenadier.pos,
    vel: origo,
    timeLimit: 100,
  },
  shrapnelStats = { count: 10, speed: 15 }
) => {
  const grenade = {
    radius: grenadier.radius / 2,
    pos: stats.pos,
    vel: stats.vel,
    color: "orange",
    timer: 0,
    timeLimit: stats.timeLimit,
    shrapnelStats: shrapnelStats,
  };

  // console.log(stats.vel);

  grenadier.activeGrenades.push(grenade);
};

const placeGrenades = (grenadier: Grenadier, loopTimes) => {
  const coefficient = 500 * grenadier.activityMult;
  let fakeCircle;

  for (let i = 0; i < loopTimes; i++) {
    setTimeout(() => {
      const margin = 120;
      let chosenPos;
      const maxTries = 20;
      let tries = 0;
      const timeToTarget = Math.round(25 * grenadier.activityMult);
      console.log(timeToTarget);

      do {
        chosenPos = {
          x: randomNumber(margin, world.width - margin),
          y: randomNumber(margin, world.height - margin),
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

      goTo(grenadier, chosenPos, timeToTarget, () => {
        createGrenade(grenadier, {
          pos: grenadier.pos,
          timeLimit: 100 * grenadier.activityMult,
          vel: origo,
        });
      });
    }, coefficient * i);
  }
  setTimeout(() => {
    grenadier.phaseCounter = 50 * grenadier.activityMult;
  }, coefficient * loopTimes);
};

const throwGrenades = (grenadier) => {
  const grenadeCount = 4;
  const timeLimit = 50 * grenadier.activityMult;
  const shrapnelCount = 5;
  const timeCoefficient = Math.min(15 * grenadier.activityMult, 15);
  for (let i = 0; i < grenadeCount; i++) {
    setTimeout(() => {
      createGrenade(
        grenadier,
        {
          pos: grenadier.pos,
          vel: multVar(
            makeDirection(grenadier.pos, player.pos),
            getDistance(grenadier.pos, player.pos) / timeLimit
          ),
          timeLimit: timeLimit,
        },
        { count: shrapnelCount, speed: 20 }
      );
    }, timeLimit * timeCoefficient * i);
  }

  setTimeout(() => {
    grenadier.phaseCounter = 25 * grenadier.activityMult;
  }, timeLimit * timeCoefficient * grenadeCount);
};

const spreadCluster = (grenadier) => {
  const grenadeCount = 8;
  const shrapnelCount = 5;
  // const coefficient = 15;
  const distancAway = grenadier.radius * 8;
  let angleValue = Math.random() * Math.PI * 2;
  const angleStep = (Math.PI * 2) / grenadeCount;

  const delay = 100 * grenadier.activityMult;
  setTimeout(() => {
    for (let i = 0; i < grenadeCount; i++) {
      const time = 40 * grenadier.activityMult;

      const startPos = grenadier.pos;
      const destination = {
        x: Math.cos(angleValue) * distancAway + grenadier.pos.x,
        y: Math.sin(angleValue) * distancAway + grenadier.pos.y,
      };

      const velocity = {
        x: (destination.x - startPos.x) / time,
        y: (destination.y - startPos.y) / time,
      };

      createGrenade(
        grenadier,
        {
          pos: startPos,
          vel: velocity,
          timeLimit: time,
        },
        {
          count: shrapnelCount,
          speed: 20 * ((1 / grenadier.activityMult) * 0.67),
        }
      );

      angleValue += angleStep;
    }
  }, delay);
  setTimeout(() => {
    grenadier.phaseCounter = 75 * grenadier.activityMult;
  }, delay * grenadeCount);
};

export const createGrenadier = () => {
  const radius = 80;

  const grenadier: Grenadier = {
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
    activityMult: 1,

    activeGrenades: [],

    update: (ctx): void => {
      grenadier.phaseCounter--;

      grenadier.activityMult = Math.max(
        grenadier.health / grenadier.maxHealth + 0.5,
        0.8
      );

      if (grenadier.phaseCounter < 0) {
        const randomValue = Math.random();
        // const randomValue = 1;
        console.log(randomValue);

        const amountOfAttacks = 3;

        // console.log(randomValue < (1 / amountOfAttacks) * 2);

        if (randomValue < 1 / amountOfAttacks) {
          placeGrenades(grenadier, 5);
        } else if (randomValue < (1 / amountOfAttacks) * 2) {
          throwGrenades(grenadier);
        } else {
          console.log("cluster");

          spreadCluster(grenadier);
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

          const bulletCount = grenade.shrapnelStats.count;
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
              7,
              grenade.shrapnelStats.speed,
              {},
              { startPos: grenade.pos, bulletRadius: 15 }
            );
          }
        }

        grenade.pos = add(grenade.pos, grenade.vel);
        drawCircle(ctx, grenade);
      });
    },
  };

  grenadier.pos = randomAcceptedPos(
    grenadier.pos,
    player.pos,
    grenadier.radius * 2
  );

  entities.push(grenadier);
  liveBosses.push(grenadier);

  return grenadier;
};
