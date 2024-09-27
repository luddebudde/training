import { checkAlive, Enemy } from "./enemyTypes";
import {
  animationsRegistry,
  playAnimation,
  stopAnimation,
} from "../playAnimation";
import { player, players } from "../player";
import { attack } from "../attack";

export const skeletonIdle = (enemy) => {
  playAnimation(
    "/enemies/slime-blue/idle.png",
    7,
    10,
    2,
    "myCanvas",
    enemy.pos,
    enemy.size,
    `slime-${enemy.id}`,
    () => {
      if (!checkAlive) return;
      if (Math.random() > 0.5) {
        skeletonIdle(enemy);
      } else {
        skeletonAttack(enemy);
      }
    }
  );
};

// export const skeletonRun = (enemy) => {
//   playAnimation(
//     "/enemies/skeletonAttack.png",
//     7,
//     3,
//     2,
//     "myCanvas",
//     enemy.pos,
//     enemy.size,
//     `slime-${enemy.id}`,
//     () => {
//       skeletonRun(enemy);
//     }
//   );
// };

export const skeletonHurt = (enemy) => {
  playAnimation(
    "/enemies/slime-blue/hurt.png",
    6,
    5,
    1,
    "myCanvas",
    enemy.pos,
    enemy.size,
    `slime-${enemy.id}`,
    () => {
      if (!checkAlive) return;
      skeletonIdle(enemy);
    }
  );
};
export const skeletonDeath = (enemy) => {
  playAnimation(
    "/enemies/slime-blue/death.png",
    14,
    5,
    1,
    "myCanvas",
    enemy.pos,
    enemy.size,
    `slime-${enemy.id}`,
    () => {
      console.log(animationsRegistry, "1");

      stopAnimation(`slime-${enemy.id}`, () => {
        console.log(animationsRegistry, "2");
        skeletonHurt(enemy);
      });
    }
  );
};

export const skeletonAttack = (enemy) => {
  const skeletonFirstAttack = () => {
    playAnimation(
      "/enemies/skeletonAttack.png",
      7,
      5,
      1,
      "myCanvas",
      enemy.pos,
      enemy.size,
      `slime-${enemy.id}`,
      () => {
        skeletonSecondAttack();
      }
    );
  };

  const skeletonSecondAttack = () => {
    playAnimation(
      "/enemies/secondSkeletonAttack.png",
      6,
      5,
      1,
      "myCanvas",
      enemy.pos,
      enemy.size,
      `slime-${enemy.id}`,
      () => {
        // skeletonIdle(enemy);
        skeletonAttack(enemy);
      }
    );
  };

  skeletonFirstAttack();
};

const slimeMaxHP = 100;

export const skeleton: Enemy = {
  maxHealth: slimeMaxHP,
  health: slimeMaxHP,
  damage: 40,
  name: "Slime",

  possibleTargets: player,
  target: player,

  pos: {
    x: 0,
    y: 0,
  },
  size: {
    x: 200,
    y: 200,
  },
  id: 0,

  startAnimation: skeletonAttack,
  deathAnimation: (enemy) => {
    skeletonDeath(enemy);
  },
};
