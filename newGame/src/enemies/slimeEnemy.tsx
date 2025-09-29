import { checkAlive, Enemy } from "./enemyTypes";
import {
  animationsRegistry,
  playAnimation,
  stopAnimation,
} from "../playAnimation";
import { player, players } from "../player";
import { attack } from "../attack";

export const blueSlimeIdle = (enemy) => {
  playAnimation(
    "/enemies/slime-blue/idle.png",
    7,
    10,
    2,
    "myCanvas",
    enemy.pos,
    enemy.size,
    `slime-${enemy.id}`,
    false,
    () => {
      if (!checkAlive) return;
      if (Math.random() > 0.5) {
        blueSlimeIdle(enemy);
      } else {
        slimeAttack(enemy);
      }
    }
  );
};

export const blueSlimeHurt = (enemy) => {
  playAnimation(
    "/enemies/slime-blue/hurt.png",
    6,
    5,
    1,
    "myCanvas",
    enemy.pos,
    enemy.size,
    `slime-${enemy.id}`,
    false,
    () => {
      if (!checkAlive) return;
      blueSlimeIdle(enemy);
    }
  );
};
export const blueSlimeDeath = (enemy) => {
  playAnimation(
    "/enemies/slime-blue/death.png",
    14,
    5,
    1,
    "myCanvas",
    enemy.pos,
    enemy.size,
    `slime-${enemy.id}`,
    false,
    () => {
      console.log(animationsRegistry, "1");

      stopAnimation(`slime-${enemy.id}`, () => {
        console.log(animationsRegistry, "2");
        blueSlimeHurt(enemy);
      });
    }
  );
};

export const slimeAttack = (enemy) => {
  const blueSlimeFirstAttack = () => {
    playAnimation(
      "/enemies/slime-blue/attack-firstNew.png",
      9,
      10,
      1,
      "myCanvas",
      enemy.pos,
      enemy.size,
      `slime-${enemy.id}`,
      false,
      () => {
        if (!checkAlive) return;
        blueSlimeSecondAttack(enemy);
      }
    );
  };

  const blueSlimeSecondAttack = () => {
    playAnimation(
      "/enemies/slime-blue/attack-second.png",
      6,
      10,
      1,
      "myCanvas",
      enemy.pos,
      enemy.size,
      `slime-${enemy.id}`,
      false,
      () => {
        if (!checkAlive) return;

        enemy.target = player;
        // console.log("enemy:", enemy.target, "damage", enemy.damage);

        attack(enemy, enemy.target, enemy.damage);

        // console.log("enemy:", enemy.target, "damage", enemy.damage);

        blueSlimeIdle(enemy);
      }
    );
  };

  blueSlimeFirstAttack();
};

const slimeMaxHP = 100;

export const slimeEnemy: Enemy = {
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
    x: 100,
    y: 100,
  },
  id: 0,
  attackDelay: 0,

  startAnimation: blueSlimeIdle,
  deathAnimation: (enemy) => {
    blueSlimeDeath(enemy);
  },
  attackAnimation: slimeAttack,
};
