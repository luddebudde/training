import { bullets, entities, liveBosses, squares } from "../arrays";
import { world } from "../basics";
import { createBullet } from "../createBullet";
import { player } from "../createPlayer";
import { dealDamage } from "../dealDamage";
import { drawLineBetween as drawLine } from "../drawLine";
import { isPointInsideArea } from "../geometry/isInsideRectangle";
import { isPlayerBetweenEnemies } from "../geometry/isPlayerBetweenEnemies";
import { lineBetween } from "../geometry/lineBetween";
import { makeDirection } from "../geometry/makeDirection";
import { goTo } from "../goTo";
import { fps } from "../main";
import { add, multVar } from "../math";
import { randomArrayElement } from "../randomArrayElement";

const health = 150;
const radius = 80;

const XLine = {
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

const YLine = {
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

// type Charger = {
//   maxHealth: number;
//   health: number;
//   contactDamage: number;
//   pos: {
//     x: number;
//     y: number;
//   };
//   vel: {
//     x: number;
//     y: number;
//   };
//   radius: number;
//   color: string;
//   speed: number;
//   team: string;
//   mass: number;
//   collision: true;
//   airFriction: boolean;

//   // Pahses
//   phaseCounter: number;

//   update: () => void;
//   // deathAnimation: (ctx, liveBosses, bossIndex) => void;
//   onWallBounce: () => void;
// };

const aimAi = (ctx, braker) => {
  XLine.pos.x = player.pos.x;
  YLine.pos.y = player.pos.y;

  braker.shootVecs.forEach((position) => {
    drawLine(ctx, add(braker.pos, position), player.pos);
  });
};

const YLineAi = (ctx, braker) => {
  // const currentLine = braker.YLine;
  YLine.pos.y += YLine.speed;

  XLine.pos.x = player.pos.x;

  drawLine(ctx, YLine.pos, {
    x: world.width,
    y: YLine.pos.y,
  });
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
    braker.ai = aimAi;

    // if (braker.hasShot === false) {
    console.log(braker.hasShot);
    braker.hasShot === true;

    setTimeout(() => {
      for (let i = 0; i < 120; i++) {
        setTimeout(() => {
          createBullet(bullets, braker, player.pos, 10, 40);
          console.log(250 * i - i * 6);
        }, 150 * i);
      }
    }, 1000);
    // }
  }
};

const XLineAi = (ctx, braker) => {
  // const currentLine = braker.XLine;
  XLine.pos.x += XLine.speed;

  // drawLine(ctx, XLine.pos, {
  //   x: XLine.pos.x,
  //   y: world.height,
  // });
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
    braker.ai = YLineAi;
  }
};

const shootPhase = (ctx, braker, fps) => {
  goTo(braker, { x: world.width / 2, y: world.height / 2 }, 10, fps);
};

export const createLineBreakerBoss = () => {
  const braker = {
    maxHealth: health,
    health: health,
    contactDamage: 0,
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
    speed: 50,
    team: "enemy",
    mass: 1000,
    collision: false,
    airFriction: false,

    // Pahses
    phaseCounter: 10,
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
    hasShot: false,
    phaseList: [shootPhase],

    ai: (ctx, braker) => {},
    update: (ctx, fps): void => {
      braker.phaseCounter--;

      braker.ai(ctx, braker);

      braker.lines.forEach((line) => {
        drawLine(ctx, line.pos, add(line.endPos, line.pos));
      });

      if (braker.phaseCounter < 0) {
        randomArrayElement(braker.phaseList)(ctx, braker, fps);

        // braker.ai = XLineAi;
        // nextPhase(ctx, braker);
        braker.phaseCounter = 1000000000;
      }
    },

    // deathAnimation: (ctx, liveBosses, bossIndex) => {},
    // onWallBounce: () => {
    //   //   charger.vel = { x: 0, y: 0 };
    //   braker.airFriction = true;

    //   braker.phaseCounter = 100;
    // },
  };

  entities.push(braker);
  liveBosses.push(braker);

  return braker;
};
