import { checkNeighbors } from "./checkNeighbors"
import { hexToRgb } from "./hexToRgb";
import { pathBlocks } from "./main";

type Block = {
  row: number,
  column: number,
  color: string;
  text: string;
}

export const chosePathGeneration = (startingBlock: Block) => {
  const targetColor: string = startingBlock.color
  const neighboringBlocks = checkNeighbors(startingBlock)
  
  const contestantNeighbors: Block[] = []

  neighboringBlocks.forEach((neighBlock: Block) => {
    // console.log(neighBlock);
    
    if (neighBlock === undefined || neighBlock.color === targetColor) {
      return
    }
    let secondNeighborBlocks = checkNeighbors(neighBlock)

     secondNeighborBlocks = secondNeighborBlocks.filter((block: Block) => block !== undefined);
    const matchingBlocks = secondNeighborBlocks.filter((block: Block) => block.color === targetColor);


    


    if (matchingBlocks.length <= 1){
       contestantNeighbors.push(neighBlock)
       console.log(matchingBlocks, "matchingBlocks");
    }
  });


  const chosenNeighbor = contestantNeighbors[Math.floor(Math.random() * contestantNeighbors.length)]

  console.log(chosenNeighbor, "contestantNeighbors");
  
  
  chosenNeighbor.color = targetColor

  
  return chosenNeighbor
}