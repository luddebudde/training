import { mapBlocks } from "./main";

export const checkNeighbors = (target) => {

  const foundBlockLeft = mapBlocks.find(block => 
     block.row === target.row && block.column === target.column - 1
  );

  // console.log(foundBlockLeft, "foundBlockLeft", target);
  
  const foundBlockRight = mapBlocks.find(block => 
    block.row === target.row && block.column === target.column + 1
  );

  // console.log(foundBlockRight, "foundBlockRight", target,);

  
  const foundBlockAbove = mapBlocks.find(block => 
    block.row === target.row - 1 && block.column === target.column
  );

  // console.log(foundBlockAbove, "foundBlockAbove", target,);

  const foundBlockBelow = mapBlocks.find(block => 
    block.row === target.row + 1 && block.column === target.column
  );

  // console.log(foundBlockBelow, "foundBlockBelow", target,);

  return [foundBlockLeft, foundBlockRight, foundBlockAbove, foundBlockBelow];
}