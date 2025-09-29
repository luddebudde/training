import { checkNeighbors } from "./checkNeighbors"
import { Block } from "./main"

// export type Block = {
//   row: number,
//   column: number,
//   color: string;
//   text: string;
// }

const targetColors = [`#FFB266`, `#FF8000`, "#FF0000"];

export const chosePathGeneration = (startingBlock: Block) => {
  const targetColor = (color: string) => {
    return targetColors.includes(color)
  }
  // const targetColor: string = startingBlock.color
  const neighboringBlocks = checkNeighbors(startingBlock)
  
  const contestantNeighbors: Block[] = []

    for (const neighBlock of neighboringBlocks) {
    if (neighBlock !== undefined && !targetColor(neighBlock.color)) {
      let secondNeighborBlocks = checkNeighbors(neighBlock)

      // secondNeighborBlocks = secondNeighborBlocks.filter((block: Block) => block !== undefined);
      // const matchingBlocks = secondNeighborBlocks.filter((block: Block) => block.color === targetColor);
 
      secondNeighborBlocks = secondNeighborBlocks.filter((block): block is Block => block !== undefined);
      const matchingBlocks = secondNeighborBlocks.filter((block): block is Block => targetColor(block.color));

      
   

     if (matchingBlocks.length <= 1){
        contestantNeighbors.push(neighBlock)
     }
    } 
  };
  return contestantNeighbors
}