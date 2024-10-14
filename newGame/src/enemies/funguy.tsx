import { checkAlive, Enemy } from "./enemyTypes";
import {
  animationsRegistry,
  playAnimation,
  stopAnimation,
} from "../playAnimation";
import { player } from "../player";
import { attack } from "../attack";
import { loopPerSecond } from "../startFight";

const startFunguy = (enemy) => {
  (enemy.loopTimes = Math.floor(Math.random() * 3 + 1)), funguyIdle(enemy);
};

export const funguyIdle = (enemy) => {
  playAnimation(
    "/enemies/funguy/Mushroom-Idle.png",
    7,
    10,
    enemy.loopTimes,
    "myCanvas",
    enemy.pos,
    enemy.size,
    `slime-${enemy.id}`,
    false,
    () => {
      if (!checkAlive) return;
      if (enemy.attackDelay < 0) {
        funguyAttack(enemy);
      } else {
        funguyIdle(enemy);
      }
    }
  );
};

export const funguyHurt = (enemy) => {
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
      funguyIdle(enemy);
    }
  );
};
export const funguyDeath = (enemy) => {
  playAnimation(
    "/enemies/funguy/Mushroom-Die.png",
    15,
    7,
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
        funguyHurt(enemy);
      });
    }
  );
};

export const funguyAttack = (enemy) => {
  playAnimation(
    "/enemies/funguy/Mushroom-Attack.png",
    10,
    8,
    1,
    "myCanvas",
    enemy.pos,
    enemy.size,
    `slime-${enemy.id}`,
    false,
    () => {
      // enemy.attackDelay = Math.random() * loopPerSecond * 2 + loopPerSecond;
      enemy.loopTimes = Math.floor(Math.random() * 3 + 1);
      console.log(enemy.attackDelay);

      attack(enemy, funguy.target, funguy.damage);
      funguyIdle(enemy);
    }
  );
};

const slimeMaxHP = 100;

export const funguy: Enemy = {
  maxHealth: slimeMaxHP,
  health: slimeMaxHP,
  damage: 10,
  name: "Funguy",

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
  attackDelay: Math.random() * 100,
  loopTimes: Math.floor(Math.random() * 3 + 1),

  startAnimation: startFunguy,
  deathAnimation: (enemy) => {
    funguyDeath(enemy);
  },
  attackAnimation: funguyAttack,
};
