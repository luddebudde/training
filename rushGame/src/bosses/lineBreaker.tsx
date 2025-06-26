import { bullets, entities, liveBosses } from "../arrays";
import { world } from "../basics";
import { createBullet } from "../createBullet";
import { player } from "../createPlayer";
import { drawLine as drawLine } from "../draw/drawLine";
import { isPlayerBetweenEnemies } from "../geometry/isPlayerBetweenEnemies";

import { add, Vec2 } from "../math";
import { randomArrayElement } from "../randomArrayElement";

const health = 1500;
const radius = 80;

type Line = {
  pos: Vec2;
  endPos: Vec2;
  color: string;
  speed: number;
};

const XLine: Line = {
  pos: {
    x: 0,
    y: 0,
  },
  endPos: {
    x: 0,
    y: world.height,
  },
  color: "black",
  speed: 5,
};

const YLine: Line = {
  pos: {
    x: 0,
    y: 0,
  },
  endPos: {
    x: world.width,
    y: 0,
  },
  color: "black",
  speed: 5,
};

type LineBreaker = {
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

  // Pahses
  phaseCounter: number;
  linePhase: {
    counter: number;
  };
  lines: Line[];
  shootVecs: Vec2[];
  shootingPhaseActive: boolean;
  phaseList: [linePhase, patternPhase];
  rageMode: boolean;
  rageModeBulletCounter: number;

  ai: (ctx, braker) => void;
  update: (ctx) => void;
  // deathAnimation: (ctx, liveBosses, bossIndex) => void;
  onWallBounce: () => void;
};

const linePhase = (ctx, braker): void => {
  braker.lines.splice(0, braker.lines.length);

  const newXLine = { ...XLine };
  const newYLine = { ...YLine };
  braker.lines.push(newXLine);
  braker.lines.push(newYLine);

  braker.ai = () => {
    const counter = braker.linePhase.counter;
    if (counter === 0) {
      // X Line
      XLine.pos.x += XLine.speed;
      if (
        isPlayerBetweenEnemies(
          XLine.pos,
          {
            x: XLine.pos.x,
            y: world.height,
          },
          player
        )
      ) {
        braker.linePhase.counter++;
      }
    } else if (counter === 1) {
      // Y Line
      YLine.pos.y += YLine.speed;
      XLine.pos.x = player.pos.x;

      if (
        isPlayerBetweenEnemies(
          YLine.pos,
          {
            x: world.width,
            y: YLine.pos.y,
          },
          player
        )
      ) {
        braker.linePhase.counter++;
      }
    } else if (counter === 2) {
      // Shooting Phase
      XLine.pos.x = player.pos.x;
      YLine.pos.y = player.pos.y;

      braker.shootVecs.forEach((position) => {
        drawLine(ctx, add(braker.pos, position), player.pos, "black");
      });

      if (!braker.shootingPhaseActive) {
        setTimeout(() => {
          for (let i = 0; i < 20; i++) {
            setTimeout(() => {
              createBullet(bullets, braker, player.pos, 10, 40);

              if (i === 19) {
                XLine.pos.x = 0;
                YLine.pos.y = 0;

                braker.linePhase.counter = 0;
                braker.ai = () => {};

                setTimeout(() => {
                  braker.phaseCounter = 0;
                  braker.shootingPhaseActive = false;
                }, 1000);
              }
            }, 150 * i);
          }
        }, 1000);
      }
      braker.shootingPhaseActive = true;
    }
  };
};

const patternPhase = (ctx, braker): void => {
  // goTo(braker, { x: world.width / 2, y: world.height / 2 }, 100);
  braker.lines.splice(0, braker.lines.length);

  const scale = world.height / world.width;

  const widthCount = 10;
  const heightCount = widthCount * scale;

  for (let x = 0; x < world.width / widthCount; x++) {
    const newXLine = { ...XLine };
    newXLine.pos = { x: (world.width / widthCount) * x, y: 0 };

    braker.lines.push(newXLine);
  }

  for (let y = 0; y < world.height / heightCount; y++) {
    const newYLine = { ...YLine };
    newYLine.pos = { x: 0, y: (world.height / heightCount) * y };

    braker.lines.push(newYLine);
  }

  const bulletSpeed = 21;

  setTimeout(() => {
    braker.lines.forEach((line) => {
      createBullet(
        bullets,
        braker,
        add(line.pos, line.endPos),
        30,
        bulletSpeed,
        {},
        {
          startPos: {
            x: line.pos.x > 0 ? line.pos.x : 0,
            y: line.pos.y > 0 ? line.pos.y : 0,
          },
        }
      );
    });

    setTimeout(() => {
      braker.phaseCounter = 0;
    }, (world.width / bulletSpeed) * 15);
  }, 1000);
};

export const createLineBreakerBoss = () => {
  const lineBreaker: LineBreaker = {
    name: "Line-breaker",
    maxHealth: health,
    health: health,
    contactDamage: 5,
    pos: {
      x: world.width / 2,
      y: radius,
    },
    vel: {
      x: 0,
      y: 0,
    },
    radius: radius,
    color: "purple",
    speed: 25,
    team: "enemy",
    mass: 1000,

    damageConflicted: 0,
    damageAbsorbed: 0,
    bulletsShot: 0,
    timesDefeated: 0,

    collision: true,
    airFriction: false,

    // Pahses
    phaseCounter: 0,
    linePhase: {
      counter: 0,
    },
    lines: [XLine, YLine],
    shootVecs: [
      // Up
      { x: 0, y: -radius },
      // Left
      { x: radius, y: 0 },
      // Down
      { x: 0, y: radius },
      // Right
      { x: -radius, y: 0 },
    ],
    shootingPhaseActive: false,
    phaseList: [linePhase, patternPhase],
    rageMode: false,
    rageModeBulletCounter: 0,

    ai: (ctx, braker) => {},
    update: (ctx): void => {
      lineBreaker.ai(ctx, lineBreaker);

      if (lineBreaker.health < lineBreaker.maxHealth / 2) {
        if (!lineBreaker.rageMode) {
          lineBreaker.vel.x = lineBreaker.speed;
          lineBreaker.rageMode = true;
        }

        lineBreaker.rageModeBulletCounter++;
        if (lineBreaker.rageModeBulletCounter % 10 === 0) {
          createBullet(
            bullets,
            lineBreaker,
            { x: lineBreaker.pos.x, y: world.height },
            6,
            10
          );
        }
      }

      lineBreaker.lines.forEach((line) => {
        drawLine(ctx, line.pos, add(line.endPos, line.pos), "black");
      });

      if (lineBreaker.phaseCounter <= 0) {
        randomArrayElement(lineBreaker.phaseList)(ctx, lineBreaker);

        lineBreaker.phaseCounter = 100;
      }
    },
    onWallBounce: () => {},
  };

  entities.push(lineBreaker);
  liveBosses.push(lineBreaker);

  return lineBreaker;
};
