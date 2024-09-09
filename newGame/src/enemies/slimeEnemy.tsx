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

        blueSlimeFirstAttack(enemy);
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

export const blueSlimeFirstAttack = (enemy) => {
  playAnimation(
    "/Slime Enemy/blue/attack-first.png",
    9,
    5,
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

export const blueSlimeSecondAttack = (enemy) => {
  playAnimation(
    "/Slime Enemy/blue/attack-secondOld.png",
    6,
    5,
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

export const slimeEnemy: Enemy = {
  health: 100,
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
  animations: [blueSlimeIdle],
};
