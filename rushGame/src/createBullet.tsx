import { player } from "./createPlayer";
import { makeDirection } from "./geometry/makeDirection";
import { multVar, Vec2 } from "./math";

type Bullet = {
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
    startPos: { x: 0, y: 0 },
    team: "",
    bulletRadius: 20,
    targetVec: {
      x: player.pos.x,
      y: player.pos.y,
    },
    onHit: () => {},
    ...advanced,
  };

  const finalMods: Mods = {
    bounceable: false,
    airFriction: 0,
    bounceDamageLoss: 0.3,
    ...mods,
  };

  const startPos = shooter !== undefined ? shooter.pos : finalAdvanced.startPos;
  const bulletTeam = shooter !== undefined ? shooter.team : finalAdvanced.team;
  const bulletRadius =
    finalAdvanced.bulletRadius !== undefined ? finalAdvanced.bulletRadius : 20;

  if (bulletTeam === player.team) {
    bulletsShot++;
  }

  const targetPos = target !== undefined ? target : finalAdvanced.targetVec;
  const direction = makeDirection(startPos, targetPos);
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
    airFriction: finalMods.airFriction,
    bounceable: finalMods.bounceable,
    bounceDamageLoss: finalMods.bounceDamageLoss,

    onHit: (entity, bullet) => {
      finalAdvanced.onHit(entity, bullet);
    },
  };
  bullets.push(bullet);
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
    startPos: { x: 0, y: 0 },
    team: "",
    bulletRadius: 20,
    targetVec: {
      x: player.pos.x,
      y: player.pos.y,
    },
    onHit: () => {},
    ...advanced,
  };

  const finalMods: Mods = {
    bounceable: false,
    airFriction: 0,
    bounceDamageLoss: 0.3,
    ...mods,
  };

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
      airFriction: finalMods.airFriction,
      bounceable: finalMods.bounceable,
      bounceDamageLoss: finalMods.bounceDamageLoss,

      onHit: (entity, bullet) => {
        finalAdvanced.onHit(entity, bullet);
      },
    };

    bullets.push(bullet);
  }
};
