import { bullets, entities, lines, liveBosses } from "../arrays";
import { world } from "../basics";
import { createBlackhole } from "../createBlackhole";
import { createBullet } from "../createBullet";
import { player } from "../createPlayer";
import { drawCircle } from "../draw/drawCircle";
import { drawLine } from "../draw/drawLine";
import { doCirclesOverlap } from "../geometry/doCirlceOverlap";

import { getDistance, makeDirection } from "../geometry/makeDirection";
import { add, addVar, multVar, origo } from "../math";

const health = 600;

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
  satellites: any[];
  phaseCounter: number;

  update: () => void;
  // deathAnimation: (ctx, liveBosses, bossIndex) => void;
};

const centralBaseRadius = 200;

const satelittesStats = [
  {
    radius: 40,
    distance: 100 + centralBaseRadius,
    degree: 0.3,
    degreeStepCounterMult: 1,
  },
  {
    radius: 40,
    distance: 250 + centralBaseRadius,
    degree: 1.8,
    degreeStepCounterMult: -1,
  },
  {
    radius: 40,
    distance: 450 + centralBaseRadius,
    degree: 3.5,
    degreeStepCounterMult: 1,
  },
  {
    radius: 40,
    distance: 450 + centralBaseRadius,
    degree: 7,
    degreeStepCounterMult: -1,
  },
];

const createSatellite = (centralBase, i: number) => {
  const selectedStats = satelittesStats[i];

  // const satelliteRadius = Math.random() * 20 + 20;
  // const satelliteRadius = 40;

  // const distanceToPlanet =
  //   Math.random() * 400 + centralBase.radius + satelliteRadius * 2;

  const satelliteHealth = 200;
  const satellite = {
    name: "Satellite",
    maxHealth: satelliteHealth,
    health: satelliteHealth,
    contactDamage: 0.2,
    pos: {
      x: world.width,
      y: world.height,
    },
    vel: {
      x: 0,
      y: 0,
    },
    radius: selectedStats.radius,
    color: "grey",
    speed: 50,
    team: "enemy",
    mass: 1000,

    damageConflicted: 0,
    damageAbsorbed: 0,
    bulletsShot: 0,
    timesDefeated: 0,

    collision: true,
    airFriction: false,

    // Phases
    degree: selectedStats.degree,
    // degreeStepCounter: 0.05,
    degreeStepCounter: 20 * selectedStats.degreeStepCounterMult,
    distance: selectedStats.distance,

    update: () => {},
  };

  // console.log(centralBase);

  entities.push(satellite);
  centralBase.satellites.push(satellite);
};

let oldPlayerPos = origo;
const baseColor = { r: 165, g: 42, b: 42 };
const centralBasePos = {
  x: world.width / 2,
  y: world.height / 2,
};

const blackholeStrength = 500;

export const createCentralBaseBoss = () => {
  const centralBase = {
    name: "The Central Base",
    maxHealth: health,
    health: health,
    contactDamage: 20,
    pos: centralBasePos,
    vel: {
      x: 0,
      y: 0,
    },
    radius: centralBaseRadius,
    color: "baseColor",
    speed: 50,
    team: "enemy",
    mass: 30000000,

    damageConflicted: 0,
    damageAbsorbed: 0,
    bulletsShot: 0,
    timesDefeated: 0,

    collision: true,
    airFriction: false,

    // Pahses
    satellites: [],
    blackhole: createBlackhole(centralBasePos, origo, 40, blackholeStrength),

    superCounter: 0,
    superHitCounter: 0,
    superHitCounterMax: 150,

    hasCreatedSatellites: false,

    update: (ctx): void => {
      if (!centralBase.hasCreatedSatellites) {
        for (let i = 0; i < 4; i++) {
          createSatellite(centralBase, i);
        }

        centralBase.hasCreatedSatellites = true;
      }

      const healthRatio = Math.max(
        0.1,
        centralBase.health / centralBase.maxHealth
      );

      centralBase.color = `rgb(${Math.floor(
        baseColor.r * healthRatio
      )}, ${Math.floor(baseColor.g * healthRatio)}, ${Math.floor(
        baseColor.b * healthRatio
      )})`;

      centralBase.blackhole.strength = blackholeStrength * (1 - healthRatio);

      lines.length = 0;
      centralBase.satellites.forEach((satellite) => {
        if (Math.random() > 0.999) {
          satellite.degreeStepCounter = -satellite.degreeStepCounter;
        }
        satellite.degree += satellite.degreeStepCounter / satellite.distance;

        satellite.pos.x =
          Math.cos(satellite.degree) * satellite.distance + centralBase.pos.x;
        satellite.pos.y =
          Math.sin(satellite.degree) * satellite.distance + centralBase.pos.y;

        if (Math.random() > 0.99) {
          createBullet(
            bullets,
            satellite,
            centralBase.pos,
            -20,
            5,
            {},
            {
              onHit(entity, bullet) {
                if (entity === centralBase) {
                  centralBase.superCounter += 10;
                  // console.log(centralBase.superCounter);
                }
              },
              team: "player",
            }
          );
        }
        if (Math.random() > 0.99) {
          createBullet(
            bullets,
            satellite,
            player.pos,
            5,
            15,
            {},
            { color: "red", bulletRadius: 10 }
          );
        }

        if (centralBase.superCounter >= 100) {
          if (centralBase.health < 0) {
            return;
          }
          const newPlayerPos = player.pos;

          let lineColor = "black";

          if (
            centralBase.superHitCounter >
            centralBase.superHitCounterMax / 2
          ) {
            lineColor = "red";
          }

          lines.push({
            startPos: centralBase.pos,
            endPos: add(player.pos, player.vel),
            color: lineColor,
          });

          if (
            doCirclesOverlap(
              { radius: player.radius * 3, pos: oldPlayerPos },
              player
            )
          ) {
            centralBase.superHitCounter++;
          } else {
            centralBase.superHitCounter = 0;
            oldPlayerPos = newPlayerPos;
          }

          if (centralBase.superHitCounter > centralBase.superHitCounterMax) {
            createBullet(
              bullets,
              centralBase,
              player.pos,
              34,
              80,
              {},
              { bulletRadius: 40 }
            );
            centralBase.superHitCounter = 0;
          }

          if (centralBase.superCounter < centralBase.superHitCounterMax * 1.1) {
            setTimeout(() => {
              // console.log("reset");

              centralBase.superCounter = 0;
            }, 8000);
          }
        }
      });
    },
  };

  entities.push(centralBase);
  liveBosses.push(centralBase);

  return centralBase;
};
