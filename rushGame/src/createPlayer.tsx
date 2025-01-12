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
  attackDelay: number;
  team: string;
  unlockedAbilities: {
    dash: boolean;
    bounceable: boolean;
  };
  airFriction: true;
};

const health = 100;

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
    speed: 1,
    team: "player",
    attackDelay: 50,
    unlockedAbilities: {
      dash: true,
      bounceable: false,
    },
    airFriction: true,
  };

  entities.push(player);
  return player;
};

export const player = createPlayer();
