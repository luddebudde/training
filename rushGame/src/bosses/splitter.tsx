import { bullets, entities, liveBosses } from "../arrays";
import { world } from "../basics";
import { createBullet } from "../createBullet";
import { player } from "../createPlayer";
import { makeDirection } from "../geometry/makeDirection";
import { goTo } from "../goTo";
import { addVar, mult, multVar, origo } from "../math";

const health = 1800;
const speed = 50;
const radius = 120;
const bounceThreashold = 10;

type Splitter = {
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
  airFriction: false;

  // Pahses
  phaseCounter: number;
  bounceCounter: number;

  onWallBounce: () => void;
};

let splitters = [];

const createSplitter = ({
  generation,
  health,
  radius,
  speed,
  mass,
  damageMult,
  pos,
  attackCounter,
}) => {
  if (generation > 7) {
    return;
  }
  const splitter = {
    name: "Splitter",
    maxHealth: health,
    health: health,
    damageMult: damageMult,
    contactDamage: 40 * damageMult,
    pos: pos,
    vel: {
      x: 0,
      y: 0,
    },
    radius: radius,
    color: "black",
    speed: speed,
    team: "enemy",
    mass: mass,
    generation: generation,

    damageConflicted: 0,
    damageAbsorbed: 0,
    bulletsShot: 0,
    timesDefeated: 0,

    collision: true,
    airFriction: 0.3,

    // Pahses
    attackCounter: attackCounter,
    resetAttackCounter: attackCounter,

    update: () => {
      // splitterBoss.health = Math.max(
      //   splitters.reduce((sum, s) => sum + s.health, 0),
      //   10
      // );

      if (splitter.attackCounter <= 0) {
        const direction = makeDirection(splitter.pos, player.pos);

        splitter.vel = multVar(direction, splitter.speed);

        splitter.attackCounter = splitter.resetAttackCounter;
      }
      splitter.attackCounter--;
    },

    onDeath: () => {
      for (let i = 0; i < 2; i++) {
        const value = i % 2 ? 1 : -1;
        createSplitter({
          generation: splitter.generation + 1,
          health: health / 2,
          radius: radius / 1.42,
          speed: splitter.speed,
          mass: splitter.mass / 2,
          damageMult: splitter.damageMult * 0.5,
          pos: addVar(splitter.pos, (radius / 1.42) * value),
          attackCounter: Math.random() * 80 + 50,
        });
      }
    },
  };

  splitters.push(splitter);
  entities.push(splitter);
};

const splitterBoss = {
  name: "Splitter",
  maxHealth: 1000,
  health: 1000,
  damageConflicted: 0,
  damageAbsorbed: 0,
  bulletsShot: 0,
  timesDefeated: 0,
};

export const createSplitterBoss = () => {
  createSplitter({
    generation: 1,
    health: splitterBoss.maxHealth,
    radius: 160,
    speed: 20,
    mass: 0.3,
    damageMult: 1,
    pos: { x: world.width / 2, y: world.height / 8 },
    attackCounter: 120,
  });

  const splitterHealthLoop = setInterval(() => {
    splitterBoss.health = Math.max(
      splitters.reduce((sum, s) => sum + s.health, 0),
      10
    );

    splitters.forEach((splitter) => {
      splitterBoss.damageConflicted += splitter.damageConflicted;
      splitter.damageConflicted = 0;

      splitterBoss.damageAbsorbed += splitter.damageAbsorbed;
      splitter.damageAbsorbed = 0;
    });

    splitters = splitters.filter((splitter) => splitter.health > 0);

    if (splitters.length === 0) {
      splitterBoss.health = 0;
      clearInterval(splitterHealthLoop);
    }
  }, 16);

  liveBosses.push(splitterBoss);
};
