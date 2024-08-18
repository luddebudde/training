import { Enemy } from "./main";

const enemyPrototype: Enemy = {
  health: 100,
  name: "Prototype"
};
const runAway: Enemy = {
  health: 50,
  name: "Runaway"
};
const giganian: Enemy = {
  health: 50,
  name: "giganian"
};
const basher: Enemy = {
  health: 50,
  name: "basher"
};

export const enemyTypesOnFloor = [enemyPrototype, runAway];
export const bossTypesOnFloor = [giganian, basher];

export const randomEnemy = () => {
  return enemyTypesOnFloor[Math.floor(Math.random() * enemyTypesOnFloor.length)];
};
export const randomBoss = () => {
  return bossTypesOnFloor[Math.floor(Math.random() * bossTypesOnFloor.length)];
};

