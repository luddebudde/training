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

  collision: true;
  airFriction: false;

  // Pahses
  phaseCounter: number;
  bounceCounter: number;

  onWallBounce: () => void;
};

const splitters = [];

const createSplitter = ({
  health,
  radius,
  speed,
  mass,
  damageMult,
  pos,
  attackCounter,
}) => {
  if (health < player.bulletDamage / 2) {
    return;
  }
  const splitter = {
    name: "Splitter",
    maxHealth: health,
    health: health,
    damageMult: damageMult,
    contactDamage: 80 * damageMult,
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

    damageConflicted: 0,
    damageAbsorbed: 0,
    bulletsShot: 0,

    collision: true,
    airFriction: 0.3,

    // Pahses
    attackCounter: attackCounter,
    resetAttackCounter: attackCounter,

    update: () => {
      splitterBoss.health = Math.max(
        splitters.reduce((sum, s) => sum + s.health, 0),
        10
      );

      if (splitter.attackCounter <= 0) {
        const direction = makeDirection(splitter.pos, player.pos);

        splitter.vel = multVar(direction, splitter.speed);

        splitter.attackCounter = splitter.resetAttackCounter;
      }
      splitter.attackCounter--;
    },
    // onWallBounce: () => {
    //   splitter.bounceCounter++;

    //   if (splitter.bounceCounter % bounceThreashold !== 0) {
    //     if (splitter.maxHealth / 2 > splitter.health) {
    //       createBullet(
    //         bullets,
    //         splitter,
    //         player.pos,
    //         15,
    //         10,
    //         {},
    //         {
    //           bulletRadius:
    //             40 + 2.5 * (splitter.bounceCounter % bounceThreashold),
    //         }
    //       );
    //     }
    //   } else {
    //     splitter.vel = origo;

    //     setTimeout(() => {
    //       const direction = makeDirection(splitter.pos, player.pos);

    //       splitter.vel = multVar(direction, splitter.speed);
    //     }, 1000);
    //   }
    // },
    onDeath: () => {
      for (let i = 0; i < 2; i++) {
        const value = i % 2 ? 1 : -1;
        createSplitter({
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

  console.log("creating splitter");

  splitters.push(splitter);
  entities.push(splitter);
};

const splitterBoss = {
  maxHealth: 1000,
  health: 1000,
};

export const createSplitterBoss = () => {
  createSplitter({
    health: 1000,
    radius: 160,
    speed: 20,
    mass: 0.3,
    damageMult: 1,
    pos: { x: world.width / 2, y: world.height / 8 },
    attackCounter: 120,
  });
  const splitterHealthLoop = setInterval(() => {
    if (splitters.length === 0) {
      splitterBoss.health = 0;
      clearInterval(splitterHealthLoop);
    }
  }, 16);

  liveBosses.push(splitterBoss);
};
