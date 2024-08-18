import { Block, pathBlocks } from "./main";

type Player = {
    health: number,
    currentBlock: Block
}

export const player: Player = {
    health: 100,
    currentBlock: {
        row: 0,
        column: 0,
        color: "",
        text: "",
        image: "",
        infested: false,
      }
}