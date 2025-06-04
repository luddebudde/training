import { player } from "./createPlayer";
import { makeDirection } from "./geometry/makeDirection";
import { multVar, Vec2 } from "./math";

export type Bullet = {
  shooter: any;
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
  airFriction: boolean | number;
  bounceable: boolean;
  bounceDamageLoss: number;
  onHit: (entity, bullet: Bullet) => void;
  onWallBounce: (bullet: Bullet, calculatedVec: Vec2) => void;
};

type Mods = {
  bounceable: boolean;
  airFriction: number | false;
  bounceDamageLoss: number;
};

type Advanced = {
  startPos: Vec2;
  targetVec: Vec2;
  team: string;
  bulletRadius: number;
  color: string;
  vel: Vec2;
  onHit: (entity, bullet) => void;
};

export let bulletsShot = 0;

export const createBullet = (
  bullets: Bullet[],
  shooter: any,
  target: Vec2 | undefined,
  damage: number,
  speed: number,
  mods: Mods | {} = {},
  advanced: Advanced | {} = {}
) => {
  const finalAdvanced = {
    startPos: undefined,
    team: undefined,
    bulletRadius: 20,
    color: "green",
    targetVec: {
      x: player.pos.x,
      y: player.pos.y,
    },
    vel: {
      x: undefined,
      y: undefined,
    },
    onHit: () => {},
    onWallBounce: () => {},
    ...advanced,
  };

  const finalMods: Mods = {
    bounceable: false,
    airFriction: 0,
    bounceDamageLoss: 0.3,
    ...mods,
  };

  const startPos =
    finalAdvanced.startPos === undefined ? shooter.pos : finalAdvanced.startPos;
  const bulletTeam =
    finalAdvanced.team === undefined ? shooter.team : finalAdvanced.team;
  const bulletRadius =
    finalAdvanced.bulletRadius !== undefined ? finalAdvanced.bulletRadius : 20;

  const targetPos = target !== undefined ? target : finalAdvanced.targetVec;

  const direction = makeDirection(startPos, targetPos);
  const newVel = multVar(direction, speed);

  const xVel =
    finalAdvanced.vel.x !== undefined ? finalAdvanced.vel.x : undefined;
  const yVel =
    finalAdvanced.vel.y !== undefined ? finalAdvanced.vel.y : undefined;

  if (shooter.team === "player") {
    bulletsShot++;
  }

  const bullet: Bullet = {
    shooter: shooter,
    damage: damage,
    pos: {
      x: startPos.x,
      y: startPos.y,
    },
    vel: {
      x: xVel !== undefined ? xVel : newVel.x,
      y: yVel !== undefined ? yVel : newVel.y,
    },
    mass: 1,
    radius: bulletRadius,
    color: finalAdvanced.color,
    team: bulletTeam,
    airFriction: finalMods.airFriction,
    bounceable: finalMods.bounceable,
    bounceDamageLoss: finalMods.bounceDamageLoss,

    onHit: (entity, bullet) => {
      finalAdvanced.onHit(entity, bullet);
    },
    onWallBounce: (bullet, newVec) => {
      finalAdvanced.onHit(bullet, newVec);
    },
  };

  bullets.push(bullet);

  return bullet;
};

export const createWaveShoot = (
  bullets: Bullet[],
  shooter: any,
  target: Vec2,
  damage: number,
  speed: number,
  waveWidth: number,
  bulletsCount: number,
  mods: Mods | {} = {},
  advanced: Advanced | {} = {}
) => {
  const finalAdvanced = {
    startPos: undefined,
    team: undefined,
    bulletRadius: 20,
    color: "green",
    targetVec: {
      x: player.pos.x,
      y: player.pos.y,
    },
    onHit: () => {},
    onWallBounce: () => {},
    ...advanced,
  };

  const finalMods: Mods = {
    bounceable: false,
    airFriction: 0,
    bounceDamageLoss: 0.3,
    ...mods,
  };

  let bulletArray = [];

  const startPos =
    finalAdvanced.startPos === undefined ? shooter.pos : finalAdvanced.startPos;
  const bulletTeam =
    finalAdvanced.team === undefined ? shooter.team : finalAdvanced.team;
  const bulletRadius =
    finalAdvanced.bulletRadius !== undefined ? finalAdvanced.bulletRadius : 10;

  const baseDirection = makeDirection(startPos, target);

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
        x: startPos.x,
        y: startPos.y,
      },
      vel: {
        x: newVel.x,
        y: newVel.y,
      },
      mass: 1,
      radius: bulletRadius,
      color: finalAdvanced.color,
      team: bulletTeam,
      airFriction: finalMods.airFriction,
      bounceable: finalMods.bounceable,
      bounceDamageLoss: finalMods.bounceDamageLoss,

      onHit: (entity, bullet) => {
        finalAdvanced.onHit(entity, bullet);
      },
      onWallBounce: (bullet, newVec) => {},
    };

    bullets.push(bullet);
    bulletArray.push(bullet);
  }

  return bulletArray;
};

export const handleBulletBounce = (
  bullets: Bullet[],
  bullet: Bullet,
  newVel: Vec2 = bullet.vel,
  index: number
) => {
  bullet?.onWallBounce?.(bullet, newVel);

  if (bullet.bounceable) {
    bullet.vel = newVel;
    bullet.damage *= 1 - bullet.bounceDamageLoss;

    if (Math.abs(bullet.damage) < 0.5) {
      bullets.splice(index, 1);
    }
  } else {
    bullets.splice(index, 1);
  }
};
