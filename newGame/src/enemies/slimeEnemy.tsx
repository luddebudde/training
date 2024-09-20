import { checkAlive, Enemy } from "./enemyTypes";
import {
  animationsRegistry,
  playAnimation,
  stopAnimation,
} from "../playAnimation";
import { player } from "../player";

export const blueSlimeIdle = (enemy) => {
  playAnimation(
    "/Slime Enemy/blue/idle.png",
    7,
    10,
    2,
    "myCanvas",
    enemy.pos,
    enemy.size,
    `slime-${enemy.id}`, // Unik id för varje fiende
    () => {
      if (!checkAlive) return;
      if (Math.random() > 0.5) {
        // console.log("idle");

        blueSlimeIdle(enemy);
        // for (let i = 0; i < 100; i++) {
        //   setTimeout(() => {
        //     enemy.pos.x -= 1;
        //     console.log(enemy.pos);
        //   }, i * 10);
        // }
      } else {
        // console.log("attack");

        slimeAttack(enemy);
      }
    }
  );
};

export const blueSlimeHurt = (enemy) => {
  playAnimation(
    "/Slime Enemy/blue/hurt.png",
    6,
    5,
    1,
    "myCanvas",
    enemy.pos,
    enemy.size,
    `slime-${enemy.id}`, // Unik id för varje fiende
    () => {
      if (!checkAlive) return;
      blueSlimeIdle(enemy);
    }
  );
};
export const blueSlimeDeath = (enemy) => {
  playAnimation(
    "/Slime Enemy/blue/death.png",
    14,
    5,
    1,
    "myCanvas",
    enemy.pos,
    enemy.size,
    `slime-${enemy.id}`, // Unik id för varje fiende
    () => {
      console.log(animationsRegistry, "1");

      // Stoppa och ta bort animationen korrekt
      stopAnimation(`slime-${enemy.id}`, () => {
        console.log(animationsRegistry, "2");
        // Nästa steg efter att animationen är stoppad, exempelvis byta till en skadad animation
        blueSlimeHurt(enemy);
      });
    }
  );
};

export const slimeAttack = (enemy) => {
  const blueSlimeFirstAttack = () => {
    playAnimation(
      "/Slime Enemy/blue/attack-firstNew.png",
      9,
      10,
      1,
      "myCanvas",
      enemy.pos,
      enemy.size,
      `slime-${enemy.id}`, // Unik id för varje fiende
      () => {
        if (!checkAlive) return;
        // console.log("HIT!");
        blueSlimeSecondAttack(enemy);
        // blueSlimeIdle(enemy);
      }
    );
  };

  const blueSlimeSecondAttack = () => {
    playAnimation(
      "/Slime Enemy/blue/attack-second.png",
      6,
      10,
      1,
      "myCanvas",
      enemy.pos,
      enemy.size,
      `slime-${enemy.id}`, // Unik id för varje fiende
      () => {
        // console.log("second attakc ht");
        if (!checkAlive) return;
        blueSlimeIdle(enemy);
      }
    );
  };

  blueSlimeFirstAttack();
};

export const blueSlimeAttack = (enemy) => {
  playAnimation(
    "/Slime Enemy/blue/hurt.png",
    6,
    5,
    1,
    "myCanvas",
    enemy.pos,
    enemy.size,
    `slime-${enemy.id}`, // Unik id för varje fiende
    () => {
      if (!checkAlive) return;
      blueSlimeIdle(enemy);
    }
  );
};

const slimeMaxHP = 100;

export const slimeEnemy: Enemy = {
  maxHealth: slimeMaxHP,
  health: slimeMaxHP,
  name: "Slime",

  possibleTargets: player,
  target: player,

  pos: {
    x: 0,
    y: 0,
  },
  size: {
    x: 50,
    y: 50,
  },
  id: 0,

  startAnimation: blueSlimeIdle,
};
