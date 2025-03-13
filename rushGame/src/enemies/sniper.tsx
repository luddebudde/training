import { world } from "../basics";
import { makeDirection } from "../makeDirection";
import { add, multVar, Vec2 } from "../math";
import { player } from "../createPlayer";
import { bullets, entities, liveBosses } from "../arrays";
import { createBullet } from "../createBullet";

const health = 100;

type SniperEnemy = {
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
  attackDelay: number;
  airFriction: boolean;
  collision: boolean;
  update: () => void;
};

export const createSniper = () => {
  const enemy: SniperEnemy = {
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
    color: "green",
    speed: 0.1,
    team: "enemy",
    mass: 1,
    attackDelay: 10,
    airFriction: true,
    collision: true,

    update: (): void => {
      enemy.vel = add(
        enemy.vel,
        multVar(makeDirection(enemy.pos, player.pos), enemy.speed)
      );

      enemy.attackDelay--;

      if (enemy.attackDelay < 0) {
        createBullet(bullets, enemy, player.pos, 30, 10);

        enemy.attackDelay = 100;
      }
    },
  };

  entities.push(enemy);
  liveBosses.push(enemy);
};
