import { world } from "../basics";
import { makeDirection } from "../makeDirection";
import { add, multVar } from "../math";
import { player } from "../createPlayer";
import { entities } from "../arrays";

export type Enemy = {
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
  speed: number;
  team: string;
  mass: number;
  update: () => void;
  airFriction: boolean;
};

const health = 100;

export const createChaser = () => {
  const enemy: Enemy = {
    health: health,
    maxHealth: health,
    contactDamage: 10,
    pos: {
      x: Math.random() * world.width,
      y: Math.random() * world.height,
    },
    vel: {
      x: 0,
      y: 0,
    },
    radius: 50,
    color: "red",
    speed: 0.5,
    team: "enemy",
    mass: 1,
    update: (): void => {
      enemy.vel = add(
        enemy.vel,
        multVar(makeDirection(enemy.pos, player.pos), enemy.speed)
      );
    },
    airFriction: true,
  };

  return enemy;

  // entities.push(enemy);
};
