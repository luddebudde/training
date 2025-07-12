import { bullets, entities, liveBosses } from "../arrays";
import { allCorners } from "../basics";
import { createBullet } from "../createBullet";
import { player } from "../createPlayer";
import { Vec2 } from "../math";

const health = 2400;

type LevelSeeker = {
  name: string;
  maxHealth: number;
  health: number;
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

  damageConflicted: number;
  damageAbsorbed: number;
  bulletsShot: number;
  timesDefeated: number;

  collision: true;
  airFriction: boolean;

  cornerArray: ((additionalValue: number) => Vec2)[];

  // Pahses
  phaseCounter: number;
  rageMode: boolean;

  update: () => void;
  // deathAnimation: (ctx, liveBosses, bossIndex) => void;
  onWallBounce: () => void;
};

export const createLevelSeekerBoss = () => {
  const radius = 120;
  const speed = 20;

  // let color = "lightgrey";

  const levelSeeker: LevelSeeker = {
    name: "Level seeker",
    maxHealth: health,
    health: health,
    contactDamage: 10,
    pos: {
      x: radius,
      y: radius,
    },
    vel: {
      x: speed,
      y: 0,
    },
    radius: radius,
    // color: "#fcfcfc",
    // color: "#fafafa",
    color: "lightgrey",
    speed: speed,
    team: "enemy",
    mass: 1000,

    damageConflicted: 0,
    damageAbsorbed: 0,
    bulletsShot: 0,
    timesDefeated: 0,

    collision: true,
    airFriction: false,

    cornerArray: allCorners,

    // Pahses
    phaseCounter: 0,
    rageMode: false,

    update: (): void => {
      // levelSeeker.phaseCounter--;

      // Over
      if (
        Math.abs(player.pos.x - levelSeeker.pos.x) <
        player.radius + levelSeeker.radius
      ) {
        const direction = player.pos.y < levelSeeker.pos.y ? -1 : 1;
        levelSeeker.vel = { x: 0, y: direction * levelSeeker.speed * 1.5 };
      }

      if (
        levelSeeker.vel.x === 0 &&
        levelSeeker.phaseCounter <= 0 &&
        levelSeeker.health < levelSeeker.maxHealth * 0.67
      ) {
        for (let i = 0; i < 2; i++) {
          createBullet(
            bullets,
            levelSeeker,
            undefined,
            10,
            10,
            {},
            { vel: { x: i % 2 ? 10 : -10, y: 0 }, color: levelSeeker.color }
          );

          levelSeeker.phaseCounter = 15;
        }
      }

      if (
        !levelSeeker.rageMode &&
        levelSeeker.health < levelSeeker.maxHealth / 2
      ) {
        levelSeeker.color = "#fafafa";
        levelSeeker.rageMode = true;
      }
      levelSeeker.phaseCounter--;
    },
    onWallBounce: () => {
      levelSeeker.vel = {
        x: Math.random() > 0.5 ? speed : -speed,
        y: 0,
      };
      console.log("wall");
    },
  };

  entities.push(levelSeeker);
  liveBosses.push(levelSeeker);

  return levelSeeker;
};
