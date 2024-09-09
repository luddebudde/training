import { world } from "./basics";
import { generateUniqueId } from "./generateAnimationId";
import { Block, pathBlocks } from "./main";

type Player = {
  health: number;
  currentBlock: Block;
  pos: {
    x: number;
    y: number;
  };
  id: number;
  size: {
    x: number;
    y: number;
  };
};

export const player: Player = {
  health: 100,
  currentBlock: {
    row: 0,
    column: 0,
    color: "",
    text: "",
    image: "",
    infested: false,
  },
  pos: {
    x: 150,
    y: world.height / 2,
  },
  id: generateUniqueId(),
  size: {
    //x: 200,
    //y: 200,
    x: 100,
    y: 100,
  },
};
