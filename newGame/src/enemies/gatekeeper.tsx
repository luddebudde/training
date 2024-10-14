import { checkAlive, Enemy } from "./enemyTypes";
import {
  animationsRegistry,
  playAnimation,
  stopAnimation,
} from "../playAnimation";
import { player } from "../player";
import { attack } from "../attack";
import { loopPerSecond } from "../startFight";
import { world } from "../basics";

const startGatekeeper = (enemy) => {
  // (enemy.loopTimes = Math.floor(Math.random() * 3 + 1)), gatekeeperIdle(enemy);
  gatekeeperAttack(enemy);
};

export const gatekeeperIdle = (enemy) => {
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
        gatekeeperAttack(enemy);
      } else {
        gatekeeperIdle(enemy);
      }
    }
  );
};

export const gatekeeperHurt = (enemy) => {
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
      gatekeeperIdle(enemy);
    }
  );
};
export const gatekeeperDeath = (enemy) => {
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
        gatekeeperHurt(enemy);
      });
    }
  );
};

export const gatekeeperAttack = (enemy) => {
  const gatekeeperAttackFirst = () => {
    playAnimation(
      "/enemies/bringer of doom/gatekeeperAttackFirst.png",
      5,
      5,
      1,
      "myCanvas",
      enemy.pos,
      enemy.size,
      `slime-${enemy.id}`,
      false,
      () => {
        attack(enemy, gatekeeper.target, gatekeeper.damage);
        gatekeeperAttackSecond();
      }
    );
  };

  const gatekeeperAttackSecond = () => {
    playAnimation(
      "/enemies/bringer of doom/gatekeeperAttackSecond.png",
      5,
      5,
      1,
      "myCanvas",
      enemy.pos,
      enemy.size,
      `slime-${enemy.id}`,
      false,
      () => {
        gatekeeperAttack(enemy);
      }
    );
  };

  gatekeeperAttackFirst();
};

const gatekeeperHealth = 100;

const gateKeeperSize = 600;

export const gatekeeper: Enemy = {
  maxHealth: gatekeeperHealth,
  health: gatekeeperHealth,
  damage: 80,
  name: "Gatekeepr",

  possibleTargets: player,
  target: player,

  pos: {
    x: world.width / 3 + gateKeeperSize / 2,
    y: world.height / 2 - gateKeeperSize / 2,
  },
  size: {
    x: gateKeeperSize,
    y: gateKeeperSize,
  },
  id: 0,
  attackDelay: Math.random() * 100,
  loopTimes: Math.floor(Math.random() * 3 + 1),

  startAnimation: startGatekeeper,
  deathAnimation: (enemy) => {
    gatekeeperDeath(enemy);
  },
  attackAnimation: gatekeeperAttack,
};
