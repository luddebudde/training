import { Enemy } from "./main";

const enemyPrototype: Enemy = {
  health: 100,
  name: "Prototype",
  pos: {
    x: 0,
    y: 0,
  },
};
const runAway: Enemy = {
  health: 50,
  name: "Runaway",
  pos: {
    x: 0,
    y: 0,
  },
};
const giganian: Enemy = {
  health: 50,
  name: "giganian",
  pos: {
    x: 0,
    y: 0,
  },
};
const basher: Enemy = {
  health: 50,
  name: "basher",
  pos: {
    x: 0,
    y: 0,
  },
};

export const enemyTypesOnFloor = [enemyPrototype, runAway];
export const bossTypesOnFloor = [giganian, basher];

export const randomEnemy = () => {
  return enemyTypesOnFloor[
    Math.floor(Math.random() * enemyTypesOnFloor.length)
  ];
};
export const randomBoss = () => {
  return bossTypesOnFloor[Math.floor(Math.random() * bossTypesOnFloor.length)];
};
