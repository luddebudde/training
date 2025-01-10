import { world } from "../basics";
import { makeDirection } from "../makeDirection";
import { add, multVar } from "../math";
import { player } from "../createPlayer";
import { bullets, entities } from "../arrays";
import { Enemy } from "./chaser";
import { createBullet } from "../createBullet";

export const createSniper = () => {
  const enemy: Enemy = {
    health: 40,
    damage: 10,
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
    update: (): void => {
      enemy.vel = add(
        enemy.vel,
        multVar(makeDirection(enemy.pos, player.pos), enemy.speed)
      );

      //   console.log(enemy.attackDelay);

      enemy.attackDelay--;

      if (enemy.attackDelay < 0) {
        createBullet(bullets, enemy, player.pos, 30, 10);

        enemy.attackDelay = 100;
      }
    },
    airFriction: true,
  };

  entities.push(enemy);
};
