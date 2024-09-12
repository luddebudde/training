import { Enemy } from "../main";
import { playAnimation } from "../playAnimation";

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
      if (Math.random() > 0.5) {
        console.log("idle");

        blueSlimeIdle(enemy);
      } else {
        console.log("attack");

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
      blueSlimeIdle(enemy);
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
        console.log("HIT!");
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
        console.log("second attakc ht");

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
      blueSlimeIdle(enemy);
    }
  );
};

const slimeMaxHP = 100;

export const slimeEnemy: Enemy = {
  maxHealth: slimeMaxHP,
  health: slimeMaxHP,
  name: "Slime",
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
