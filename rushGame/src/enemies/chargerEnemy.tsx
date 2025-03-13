import { makeDirection } from "../makeDirection";
import { multVar, Vec2 } from "../math";
import { player } from "../createPlayer";
import { entities } from "../arrays";

const health = 100;

type ChargerEnemy = {
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
  airFriction: false;
  collision: true;
  chargeMeter: number;
  update: () => void;
};

export const createChargerEnemy = (pos) => {
  const enemy: ChargerEnemy = {
    health: health,
    maxHealth: health,
    contactDamage: 40,
    pos: {
      x: pos.x,
      y: pos.y,
    },
    vel: {
      x: 0,
      y: 0,
    },
    radius: 50,
    color: "purple",
    speed: 0.5,
    team: "enemy",
    mass: 100,
    airFriction: false,
    collision: true,

    chargeMeter: 100,
    update: () => {
      enemy.chargeMeter--;

      if (enemy.chargeMeter < 0) {
        const direction = makeDirection(enemy.pos, player.pos);
        enemy.vel = multVar(direction, 50);
        enemy.chargeMeter = 100;
      }
    },
  };

  entities.push(enemy);
};
