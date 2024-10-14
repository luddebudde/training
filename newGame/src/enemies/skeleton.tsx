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
    "/enemies/skeleton/skeletonIdle.png",
    4,
    3,
    2,
    "myCanvas",
    enemy.pos,
    enemy.size,
    `slime-${enemy.id}`,
    true,
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
    true,
    () => {
      if (!checkAlive) return;
      skeletonIdle(enemy);
    }
  );
};
export const skeletonDeath = (enemy) => {
  playAnimation(
    "/enemies/skeleton/skeletonDeath.png",
    13,
    7,
    1,
    "myCanvas",
    enemy.pos,
    enemy.size,
    `slime-${enemy.id}`,
    true,
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
      "/enemies/skeleton/firstAttack.png",
      7,
      5,
      1,
      "myCanvas",
      enemy.pos,
      enemy.size,
      `slime-${enemy.id}`,
      true,
      () => {
        attack(enemy, skeleton.target, skeleton.attacks.first);
        skeletonSecondAttack();
      }
    );
  };

  const skeletonSecondAttack = () => {
    playAnimation(
      "/enemies/skeleton/secondAttack.png",
      6,
      5,
      1,
      "myCanvas",
      enemy.pos,
      enemy.size,
      `slime-${enemy.id}`,
      true,
      () => {
        attack(enemy, skeleton.target, skeleton.attacks.second);
        skeletonIdle(enemy);
      }
    );
  };

  skeletonFirstAttack();

  // playAnimation(
  //   "/enemies/skeleton/allSkeletonAttack.png",
  //   13,
  //   5,
  //   1,
  //   "myCanvas",
  //   enemy.pos,
  //   enemy.size,
  //   `slime-${enemy.id}`,
  //   true,
  //   () => {
  //     skeletonIdle(enemy);
  //   }
  // );
};

const slimeMaxHP = 100;

export const skeleton: Enemy = {
  maxHealth: slimeMaxHP,
  health: slimeMaxHP,
  // damage: 40,
  attacks: {
    first: 20,
    second: 40,
  },
  name: "Skeleton",

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
  attackDelay: 0,

  startAnimation: skeletonIdle,
  deathAnimation: (enemy) => {
    skeletonDeath(enemy);
  },
  attackAnimation: skeletonAttack,
};
