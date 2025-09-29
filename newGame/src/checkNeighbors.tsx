import { Block, mapBlocks } from "./main";

export const checkNeighbors = (target: Block) => {

  const foundBlockLeft = mapBlocks.find(block => 
     block.row === target.row && block.column === target.column - 1
  );
  
  const foundBlockRight = mapBlocks.find(block => 
    block.row === target.row && block.column === target.column + 1
  );
  
  const foundBlockAbove = mapBlocks.find(block => 
    block.row === target.row - 1 && block.column === target.column
  );

  const foundBlockBelow = mapBlocks.find(block => 
    block.row === target.row + 1 && block.column === target.column
  );

  return [foundBlockLeft, foundBlockRight, foundBlockAbove, foundBlockBelow];
}