import { world } from "./basics";
import { enemies } from "./enemies/enemyTypes";
import { generateUniqueId } from "./generateAnimationId";
import { Block, pathBlocks } from "./main";
import { Enemy } from "./enemies/enemyTypes";

export type Player = {
  maxHealth: number;
  health: number;
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

export const player: Player = {
  maxHealth: 150,
  health: 150,
  currentBlock: {
    row: 0,
    column: 0,
    color: "",
    text: "",
    image: "",
    infested: false,
  },
  pos: {
    x: -playerSize.x * 1.5,
    y: world.height / 2,
  },
  id: generateUniqueId(),
  possibleTargets: null,
  target: null,
  targetId: 0,
  size: {
    x: playerSize.x,
    y: playerSize.y,
  },
  sword: {
    damage: 25,
  },
};

// export const initializePlayerTarget = () => {
//   // if (enemies.length > 0) {
//   player.possibleTargets = enemies;
//   player.target = player.possibleTargets[0];
//   // }
// };
