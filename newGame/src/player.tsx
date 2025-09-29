import { world } from "./basics";
import { Block } from "./main";
import { Enemy } from "./enemies/enemyTypes";

export type Player = {
  name: string;

  maxHealth: number;
  health: number;
  maxMana: number;
  mana: number;

  isBlocking: boolean;
  attackDelay: number;

  currentBlock: Block;
  pos: {
    x: number;
    y: number;
  };
  id: string;
  size: {
    x: number;
    y: number;
  };
  targetId: number;
  target: Enemy | undefined;
  possibleTargets: Enemy[];

  sword: {
    damage: number;
  };
};

const playerSize = {
  x: 200,
  y: 200,
};

export const players = [];

export const player: Player = {
  name: "player",

  maxHealth: 150,
  health: 150,
  maxMana: 100,
  mana: 100,

  isBlocking: false,
  attackDelay: 0,

  currentBlock: {
    row: 0,
    column: 0,
    color: "",
    text: "",
    image: "",
    infested: false,
  },
  // pos: {
  //   x: -playerSize.x * 1.5,
  //   y: world.height / 2,
  // },
  pos: {
    x: 500,
    y: world.height / 2,
  },
  // id: generateUniqueId(),
  id: "player",
  // deathAnimation: runAnimation(),
  possibleTargets: null,
  target: null,
  targetId: 0,
  size: {
    x: playerSize.x,
    y: playerSize.y,
  },
  sword: {
    // damage: 25,
    damage: 250,
  },
};

console.log("player");

// players.push(player);
