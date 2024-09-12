import { Enemy } from "../main";
import { slimeEnemy } from "./slimeEnemy";

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

export const enemyTypesOnFloor = [[slimeEnemy, slimeEnemy]];
export const bossTypesOnFloor = [giganian, basher];

export const randomEnemy = () => {
  return enemyTypesOnFloor[
    Math.floor(Math.random() * enemyTypesOnFloor.length)
  ];
};
export const randomBoss = () => {
  return bossTypesOnFloor[Math.floor(Math.random() * bossTypesOnFloor.length)];
};

export const enemies = [];
