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
  team: string;
  airFriction: boolean;
  bounceable: boolean;
  bounceDamageLoss: number;
};

type Mods = {
  bounceable: boolean;
  airFriction: boolean;
  bounceDamageLoss: number;
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
    bounceDamageLoss: 0.3,
  },
  advanced = {
    startPos: {
      x: 0,
      y: 0,
    },
    team: "",
  }
) => {
  const startPos = shooter !== undefined ? shooter.pos : advanced.startPos;
  const bulletTeam = shooter !== undefined ? shooter.team : advanced.team;

  const direction = makeDirection(startPos, target);

  const newVel = multVar(direction, speed);

  const bullet: Bullet = {
    damage: damage,
    pos: {
      x: startPos.x,
      y: startPos.y,
    },
    vel: {
      x: newVel.x,
      y: newVel.y,
    },
    mass: 1,
    radius: 10,
    color: "green",
    team: bulletTeam,
    airFriction: mods.airFriction,
    bounceable: mods.bounceable,
    bounceDamageLoss: mods.bounceDamageLoss,
  };
  bullets.push(bullet);
};

export const createWaveShoot = (
  bullets: Bullet[],
  shooter: Enemy | Player,
  target: Vec2,
  damage: number,
  speed: number,
  waveWidth: number,
  bulletsCount: number,
  mods: Mods = {
    bounceable: false,
    airFriction: false,
    bounceDamageLoss: 0.3,
  }
) => {
  const baseDirection = makeDirection(shooter.pos, target);
  const baseAngle = Math.atan2(baseDirection.y, baseDirection.x);

  const stepAngle = waveWidth / (bulletsCount - 1);

  for (let i = 0; i < bulletsCount; i++) {
    const waveOffset = -waveWidth / 2 + i * stepAngle;
    const shootAngle = baseAngle + waveOffset;
    const direction = {
      x: Math.cos(shootAngle),
      y: Math.sin(shootAngle),
    };
    const newVel = multVar(direction, speed);

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
      bounceDamageLoss: mods.bounceDamageLoss,
    };

    bullets.push(bullet);
  }
};
