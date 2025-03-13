import { world } from "../basics";
import { makeDirection } from "../makeDirection";
import { add, multVar, Vec2 } from "../math";
import { player } from "../createPlayer";
import { entities, liveBosses } from "../arrays";

type ChaserEnemy = {
  health: number;
  maxHealth: number;
  contactDamage: number;
  pos: Vec2;
  vel: Vec2;
  radius: number;
  color: string;
  speed: number;
  team: string;
  mass: number;
  airFriction: boolean;
  collision: boolean;
  update: () => void;
};

const health = 100;

export const createChaser = (
  pos = { x: Math.random() * world.width, y: Math.random() * world.height },
  collision = true
) => {
  const enemy: ChaserEnemy = {
    health: health,
    maxHealth: health,
    contactDamage: 2,
    pos: {
      x: pos.x,
      y: pos.y,
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
    collision: collision,
  };

  entities.push(enemy);
  liveBosses.push(enemy);
};
