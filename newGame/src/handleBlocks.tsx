import { checkCloseMapBlocks } from "./checkCloseMapBlocks";
import { pathBlocks } from "./main";

export const handleBlocks = () => {
  setTimeout(() => {
    pathBlocks.forEach(block => {
      // Get neighboring green blocks
      const greenNeighboringBlocks = checkCloseMapBlocks(block);

      console.log(greenNeighboringBlocks, "hi");

      // Choose a random block if there are any
      if (greenNeighboringBlocks.length > 0) {
        if (Math.random() < 0.3) {
          const chosenBlock = greenNeighboringBlocks[Math.floor(Math.random() * greenNeighboringBlocks.length)];
          chosenBlock.color = `#FFB266`;
          pathBlocks.push(chosenBlock);
        }

        const chosenBlock = greenNeighboringBlocks[Math.floor(Math.random() * greenNeighboringBlocks.length)];
        console.log("chosenBlock", chosenBlock);
        chosenBlock.color = `#FFB266`;
        pathBlocks.push(chosenBlock);
      }
    });
  }, 10);
};
