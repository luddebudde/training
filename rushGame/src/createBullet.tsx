import { player, Player } from "./createPlayer";
import { Enemy } from "./enemies/chaser";
import { makeDirection } from "./makeDirection";
import { multVar, Vec2 } from "./math";

type Bullet = {
  shooter: Enemy | Player;
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
  airFriction: number | false;
  bounceDamageLoss: number;
};

type Advanced = {
  startPos: Vec2;
  team: string;
  bulletRadius: number;
  onHit: (entity, bullet) => {};
};

export let bulletsShot = 0;

export const createBullet = (
  bullets: Bullet[],
  shooter: Enemy | Player,
  target: Vec2,
  damage: number,
  speed: number,
  mods: Mods = {
    bounceable: false,
    airFriction: 0,
    bounceDamageLoss: 0.3,
  },
  advanced: Advanced | undefined = {
    startPos: {
      x: 0,
      y: 0,
    },
    team: "",
    bulletRadius: 20,
    onHit: (entity, bullet) => {},
  }
) => {
  const startPos = shooter !== undefined ? shooter.pos : advanced.startPos;
  const bulletTeam = shooter !== undefined ? shooter.team : advanced.team;
  const bulletRadius =
    advanced.bulletRadius !== undefined ? advanced.bulletRadius : 20;

  if (bulletTeam === player.team) {
    bulletsShot++;
  }
  const direction = makeDirection(startPos, target);
  const newVel = multVar(direction, speed);

  const bullet: Bullet = {
    shooter: shooter,
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
    radius: bulletRadius,
    color: "green",
    team: bulletTeam,
    airFriction: mods.airFriction,
    bounceable: mods.bounceable,
    bounceDamageLoss: mods.bounceDamageLoss,

    onHit: (entity, bullet) => {
      advanced.onHit(entity, bullet);
    },
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
  },
  advanced: Advanced = {
    onHit: (entity, bullet) => {},
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
      shooter: shooter,
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

      onHit: (entity, bullet) => {
        advanced.onHit(entity, bullet);
      },
    };

    bullets.push(bullet);
  }
};
