import { entities } from "./arrays";
import { changeIsPaused, world } from "./basics";

export type Player = {
  name: string;
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
  mass: number;
  speed: number;
  // standardSpeed: number;
  attackDelay: number;
  // standardAttackDelay: number;
  bulletDamage: number;
  bulletSpeed: number;

  team: string;

  damageConflicted: number;
  damageAbsorbed: number;
  bulletsShot: number;

  unlockedAbilities: {
    dash: boolean;
    bounceable: boolean;
    bounceDamageLoss: number;

    bonusLife: boolean;
    bonusLifeCount: number;

    adrenaline: number;
    autoDamage: number;
    spreadShotCount: number;
  };

  airFriction: true;
  collision: true;
  blackholeEffected: boolean;
};

const health = 100;

const playerSpeed = 1;

const playerAttackDelay = 10;

export let player: Player;
export let standardPlayer: Player;

export const createPlayer = (): any => {
  player = {
    name: "player",
    health: health,
    maxHealth: health,
    contactDamage: 0,
    // pos: {
    //   x: world.width / 2,
    //   y: world.height / 2,
    // },
    pos: {
      x: world.width / 2,
      y: (world.height / 5) * 4,
    },
    vel: {
      x: 0,
      y: 0,
    },
    radius: 50,
    color: "blue",
    mass: 0.1,
    speed: playerSpeed,
    // standardSpeed: playerSpeed,
    team: "player",
    attackDelay: playerAttackDelay,
    // standardAttackDelay: playerAttackDelay,
    bulletDamage: 20,
    bulletSpeed: 50,

    damageConflicted: 0,
    damageAbsorbed: 0,
    bulletsShot: 0,

    unlockedAbilities: {
      dash: false,
      bounceable: false,
      bounceDamageLoss: 0.3,

      bonusLife: false,
      bonusLifeCount: 0,

      adrenaline: 0,
      autoDamage: 0,
      spreadShotCount: 0,
    },

    airFriction: true,
    collision: true,
    blackholeEffected: true,
  };

  entities.push(player);
  // return player;

  standardPlayer = structuredClone(player);
};

createPlayer();
