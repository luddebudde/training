import { checkAlive, Enemy } from "./enemyTypes";
import {
  animationsRegistry,
  playAnimation,
  stopAnimation,
} from "../playAnimation";
import { player, players } from "../player";
import { attack } from "../attack";
import { skeletonRun } from "./skeleton";

export const nightbornIdle = (enemy) => {
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
        nightbornIdle(enemy);
      } else {
        nightbornAttack(enemy);
      }
    }
  );
};

export const nightbornRun = (enemy) => {
  playAnimation(
    "/enemies/NightBorne-run.png",
    7,
    10,
    2,
    "myCanvas",
    enemy.pos,
    enemy.size,
    `slime-${enemy.id}`,
    () => {
      nightbornRun(enemy);
    }
    // nightbornRun
    // }
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
    () => {
      if (!checkAlive) return;
      nightbornIdle(enemy);
    }
  );
};
export const nightbornDeath = (enemy) => {
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
        blueSlimeHurt(enemy);
      });
    }
  );
};

export const nightbornAttack = (enemy) => {
  const nightbornFirstAttack = () => {
    playAnimation(
      "/enemies/slime-blue/attack-firstNew.png",
      9,
      10,
      1,
      "myCanvas",
      enemy.pos,
      enemy.size,
      `slime-${enemy.id}`,
      () => {
        if (!checkAlive) return;
        nightbornSecondAttack(enemy);
      }
    );
  };

  const nightbornSecondAttack = () => {
    playAnimation(
      "/enemies/slime-blue/attack-second.png",
      6,
      10,
      1,
      "myCanvas",
      enemy.pos,
      enemy.size,
      `slime-${enemy.id}`,
      () => {
        if (!checkAlive) return;

        enemy.target = player;
        // console.log("enemy:", enemy.target, "damage", enemy.damage);

        attack(enemy, enemy.target, enemy.damage);

        // console.log("enemy:", enemy.target, "damage", enemy.damage);

        nightbornIdle(enemy);
      }
    );
  };

  nightbornFirstAttack();
};

export const nightbornHurt = (enemy) => {
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
      nightbornIdle(enemy);
    }
  );
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
    x: 300,
    y: 300,
  },
  id: 0,

  startAnimation: nightbornRun,
  deathAnimation: (enemy) => {
    nightbornDeath(enemy);
  },
};
