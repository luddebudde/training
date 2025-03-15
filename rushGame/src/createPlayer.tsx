import { entities } from "./arrays";
import { world } from "./basics";

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
  standardspeed: number;
  attackDelay: number;
  standardAttackDelay: number;
  bulletDamage: number;
  team: string;
  unlockedAbilities: {
    dash: boolean;
    bounceable: boolean;
    bounceDamageLoss: number;
    bonusLife: boolean;
    bonusLifeCount: number;
    adrenaline: number;
    autoDamage: number;
  };
  airFriction: true;
  collision: true;
};

const health = 100;

const playerSpeed = 1;

const playerAttackDelay = 10;

export const createPlayer = (): any => {
  const player: Player = {
    name: "player",
    health: health,
    maxHealth: health,
    contactDamage: 0,
    pos: {
      x: world.width / 2,
      y: world.height / 2,
    },
    vel: {
      x: 0,
      y: 0,
    },
    radius: 50,
    color: "blue",
    mass: 0.1,
    speed: playerSpeed,
    standardspeed: playerSpeed,
    team: "player",
    attackDelay: playerAttackDelay,
    standardAttackDelay: playerAttackDelay,
    bulletDamage: 10,
    unlockedAbilities: {
      dash: true,
      bounceable: false,
      adrenaline: 0,
      autoDamage: 0,
      bounceDamageLoss: 0.3,
      bonusLife: false,
      bonusLifeCount: 0,
    },
    airFriction: true,
    collision: true,
  };

  entities.push(player);
  return player;
};

export const player = createPlayer();
