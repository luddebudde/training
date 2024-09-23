import { Player } from "../player";
import { slimeEnemy } from "./slimeEnemy";

export type Enemy = {
  maxHealth: number;
  health: number;
  damage: number;
  name: string;
  pos: {
    x: number;
    y: number;
  };
  size: {
    x: number;
    y: number;
  };

  target: Player | undefined;
  possibleTargets: Player;

  id: number;
  startAnimation: Function;
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

export const checkAlive = (entity: Enemy) => {
  if (entity.health > 0) {
    // whenDone();
    // return true;
  } else {
    console.log("dead");

    // return false;
  }
};

export const changeEnemyArray = (oldArray, newArray) => {
  oldArray = newArray;
};

export const enemies = [];
export const bosses = [];
export const entities = [];
