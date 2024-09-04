import { Enemy } from "./main";
import { playAnimation } from "./playAnimation";

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
      // console.log(enemy);
      console.log("reset");

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
    2,
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
    1,
    2,
    "myCanvas",
    enemy.pos,
    enemy.size,
    `slime-${enemy.id}`, // Unik id för varje fiende
    () => {
      console.log("HIT!");
      blueSlimeSecondAttack(enemy);
    }
  );
};

export const blueSlimeSecondAttack = (enemy) => {
  playAnimation(
    "/Slime Enemy/blue/attack-second.png",
    6,
    5,
    2,
    "myCanvas",
    enemy.pos,
    enemy.size,
    `slime-${enemy.id}`, // Unik id för varje fiende
    () => {
      blueSlimeIdle(enemy);
    }
  );
};

const enemyPrototype: Enemy = {
  health: 100,
  name: "Prototype",
  pos: {
    x: 0,
    y: 0,
  },
  size: {
    x: 50,
    y: 50,
  },
  animations: [blueSlimeIdle],
};
const runAway: Enemy = {
  health: 50,
  name: "Runaway",
  pos: {
    x: 0,
    y: 0,
  },
  animations: [],
};
const giganian: Enemy = {
  health: 50,
  name: "giganian",
  pos: {
    x: 0,
    y: 0,
  },
  animations: [],
};
const basher: Enemy = {
  health: 50,
  name: "basher",
  pos: {
    x: 0,
    y: 0,
  },
  animations: [],
};

export const enemyTypesOnFloor = [enemyPrototype];
export const bossTypesOnFloor = [giganian, basher];

export const randomEnemy = () => {
  return enemyTypesOnFloor[
    Math.floor(Math.random() * enemyTypesOnFloor.length)
  ];
};
export const randomBoss = () => {
  return bossTypesOnFloor[Math.floor(Math.random() * bossTypesOnFloor.length)];
};
