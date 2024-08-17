import { Block, drawmap, pathBlocks } from "./main"
import { player } from "./player";
import { startFight } from "./startFight";

const findBlockIndex = (block: Block): number => {
    return pathBlocks.findIndex(b => b.row === block.row && b.column === block.column);
  };


let canWalk = 1

const checkCurrentBlock = (block) => {
    if (block.infested !== false){
        canWalk = false
        startFight()
    }
}



export const walkTowardsMapBlock = (startBlock: Block, endBlock: Block) => {
    const startIndex = findBlockIndex(startBlock);
    const endIndex = findBlockIndex(endBlock);
  
    if (startIndex === -1 || endIndex === -1) {
      console.error("One or both blocks are not in the pathBlocks array.");
      return;
    }

    console.log(startIndex, endIndex);
    

    if (startIndex < endIndex){
    for (let i = 0; i < endIndex - startIndex; i++) {
        setTimeout(() => {
            console.log(i, "i");
        const currentBlock = pathBlocks[i + startIndex + 1]

        checkCurrentBlock(currentBlock)
        player.currentBlock = currentBlock
        drawmap();
        }, 500 * i);
        
    }
} else {
    if (startIndex > endIndex){
        for (let i = 0; i > endIndex - startIndex; i--) {
            setTimeout(() => {
            console.log(i, "i");
            
            const currentBlock = pathBlocks[startIndex + i -1]

            checkCurrentBlock(currentBlock) 
            player.currentBlock = currentBlock
            drawmap();
            }, 500 * (i * -1));
            
        }
    }
}
  };