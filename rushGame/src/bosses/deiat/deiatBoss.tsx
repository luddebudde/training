import { bullets, entities, liveBosses } from "../../arrays";
import { center } from "../../basics";
import { origo } from "../../math";
import { enterArena } from "./transitions/enterArena";
import { firstPhase } from "./phases/firstPhase";
import { secondPhase } from "./phases/secondPhase";
import { transitionToSecondPhase } from "./transitions/transitionToSecondPhase";
import { transistionToThirdPhase } from "./transitions/transistionToThirdPhase";
import { thirdPhase } from "./phases/thirdPhase";
import { transistionToFourthPhase } from "./transitions/transistionToFourthPhase";
import { fourthPhase } from "./phases/fourthPhase";

const radius = 120;
const health = 15000;

export type Deiat = any;

const saveTime: number = 1;
// const saveTime: number = 0.1;

const phaseList: ((deiat: Deiat) => void)[] = [
  firstPhase,
  secondPhase,
  thirdPhase,
  fourthPhase,
];
const transitionList = [
  enterArena,
  transitionToSecondPhase,
  transistionToThirdPhase,
  transistionToFourthPhase,
];

const healthCheckpoints = [1.1, 0.8, 0.5, 0.33];
// const healthCheckpoints = [1.1, 0.00999, 0.0];

// const transitionList = [transistionToFourthPhase];
// const phaseList: ((deiat: Deiat) => void)[] = [fourthPhase];
export const createDeiat = () => {
  const deiat: Deiat = {
    name: "The Deiat",
    maxHealth: health,
    health: health,
    contactDamage: 20,
    // contactDamage: 0,
    pos: {
      x: center.x,
      y: radius,
    },
    vel: {
      x: 0,
      y: 0,
    },
    radius: radius,
    color: "yellow",
    speed: 50,
    team: "enemy",
    mass: 9999999,

    damageConflicted: 0,
    damageAbsorbed: 0,
    bulletsShot: 0,
    timesDefeated: 0,

    collision: false,
    airFriction: false,

    // Pahses
    attackDelay: 0,

    phaseCounter: -1,
    transitionCounter: 0,
    transitionShield: false,

    pickedAttack: 10000,
    blackhole: undefined,

    solarCharge: false,
    interval: () => {},

    update: (): void => {
      deiat.attackDelay--;

      // console.log(deiat.pos, deiat.vel);

      if (deiat.transitionShield) {
        bullets.forEach((bullet) => {
          if (bullet.team !== deiat.team) {
            bullet.damage = 0;
          }
        });
      }

      if (deiat.attackDelay <= 0) {
        if (
          deiat.health <
          deiat.maxHealth * healthCheckpoints[deiat.transitionCounter]
        ) {
          transitionList[deiat.transitionCounter](deiat, saveTime);

          deiat.transitionShield = true;
          deiat.attackDelay = 100000;
          deiat.transitionCounter++;

          return;
        }

        phaseList[deiat.phaseCounter](deiat);
      }
    },
    onWallBounce: () => {
      if (phaseList[deiat.phaseCounter] === firstPhase) {
        deiat.vel = origo;
        deiat.attackDelay = 60;
      }
    },
  };

  entities.push(deiat);
  liveBosses.push(deiat);
};
