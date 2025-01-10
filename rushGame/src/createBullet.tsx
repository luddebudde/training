import { Player } from "./createPlayer";
import { Enemy } from "./enemies/chaser";
import { makeDirection } from "./makeDirection";
import { multVar, Vec2 } from "./math";

type Bullet = {
  damage: number;
  pos: {
    x: number;
    y: number;
  };
  vel: {
    x: number;
    y: number;
  };
  mass: number;
  radius: number;
  color: string;
  team: number;
  airFriction: boolean;
  bouncable: boolean;
};

type Mods = {
  bounceable: boolean;
  airFriction: boolean;
};

export const createBullet = (
  bullets: Bullet[],
  shooter: Enemy | Player,
  target: Vec2,
  damage: number,
  speed: number,
  mods: Mods = {
    bounceable: false,
    airFriction: false,
  }
) => {
  //   if (shooter.pos.x >) {
  //     return;
  //   }

  const direction = makeDirection(shooter.pos, target);
  const newVel = multVar(direction, speed);

  console.log(shooter.pos);

  const bullet: Bullet = {
    damage: damage,
    pos: {
      x: shooter.pos.x,
      y: shooter.pos.y,
    },
    vel: {
      x: newVel.x,
      y: newVel.y,
    },
    mass: 1,
    radius: 10,
    color: "green",
    team: shooter.team,
    airFriction: mods.airFriction,
    bounceable: mods.bounceable,
  };

  // console.log(bullet);

  bullets.push(bullet);
};
