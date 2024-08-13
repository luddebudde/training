// import { hexToRgb } from "./hexToRgb";
// import { mapBlocks } from "./main";


// let neighboringBlocks: array = [];
// let adjacentToNeighboringBlocks: array = [];

// export const checkCloseMapBlocks = (block) => {
//   //   const neighboringBlocks = [];
  

//   const neighboringGreenBlocks = findCloseGreenMapBlocks(block)

//   console.log(neighboringGreenBlocks, "greenlist");
  

//   neighboringGreenBlocks.forEach((greenBlock, index) => {
//     // console.log(findCloseGreenMapBlocks(greenBlock));
//     console.log(index);
    
    

//     if (findCloseMapBlocks(greenBlock, '#FFB266').length < 3) {
//       // console.log("once");
//       neighboringBlocks.splice(block, 1);
//     } else {
//       console.log("returning", greenBlock);
//       return greenBlock;
//     }
//   });

//   adjacentToNeighboringBlocks.length = 0
//   neighboringBlocks.length = 0
// };

// let currentTestingBlock

// const findCloseGreenMapBlocks = (pathBlock, searchingColor = `#009900`) => {
//   let neighboringGreenBlocksCount = 0;

//   //   Right block
//   currentTestingBlock = mapBlocks[pathBlock.index];
//   if (
//     currentTestingBlock !== undefined &&
//     currentTestingBlock.color === hexToRgb(searchingColor)
//   ) {
//     neighboringGreenBlocksCount++;
//     adjacentToNeighboringBlocks.push(currentTestingBlock);
//   }

//   //   Left block
//   currentTestingBlock = mapBlocks[pathBlock.index - 2];
//   if (
//     currentTestingBlock !== undefined &&
//     currentTestingBlock.color === hexToRgb(searchingColor)
//   ) {
//     neighboringGreenBlocksCount++;
//     adjacentToNeighboringBlocks.push(currentTestingBlock);
//   }

//   //   Above block
//   currentTestingBlock = mapBlocks[pathBlock.index - 10];
//   if (
//     currentTestingBlock !== undefined &&
//     currentTestingBlock.color === hexToRgb(searchingColor)
//   ) {
//     neighboringGreenBlocksCount++;
//     adjacentToNeighboringBlocks.push(currentTestingBlock);
//   }

//   //   Below block
//   currentTestingBlock = mapBlocks[pathBlock.index + 8];
//   if (
//     currentTestingBlock !== undefined &&
//     currentTestingBlock.color === hexToRgb(searchingColor)
//   ) {
//     neighboringGreenBlocksCount++;
//     adjacentToNeighboringBlocks.push(currentTestingBlock);
//   }

//   return adjacentToNeighboringBlocks;
// };

// const findCloseMapBlocks = (pathBlock, searchingColor = `#009900`) => {
//   let neighboringGreenBlocksCount = 0;

//   //   Right block
//   currentTestingBlock = mapBlocks[pathBlock.index];
//   if (
//     currentTestingBlock !== undefined &&
//     currentTestingBlock.color === hexToRgb(searchingColor)
//   ) {
//     neighboringGreenBlocksCount++;
//     adjacentToNeighboringBlocks.push(currentTestingBlock);
//   }

//   //   Left block
//   currentTestingBlock = mapBlocks[pathBlock.index - 2];
//   if (
//     currentTestingBlock !== undefined &&
//     currentTestingBlock.color === hexToRgb(searchingColor)
//   ) {
//     neighboringGreenBlocksCount++;
//     adjacentToNeighboringBlocks.push(currentTestingBlock);
//   }

//   //   Above block
//   currentTestingBlock = mapBlocks[pathBlock.index - 10];
//   if (
//     currentTestingBlock !== undefined &&
//     currentTestingBlock.color === hexToRgb(searchingColor)
//   ) {
//     neighboringGreenBlocksCount++;
//     adjacentToNeighboringBlocks.push(currentTestingBlock);
//   }

//   //   Below block
//   currentTestingBlock = mapBlocks[pathBlock.index + 8];
//   if (
//     currentTestingBlock !== undefined &&
//     currentTestingBlock.color === hexToRgb(searchingColor)
//   ) {
//     neighboringGreenBlocksCount++;
//     adjacentToNeighboringBlocks.push(currentTestingBlock);
//   }

//   return adjacentToNeighboringBlocks;
// };

import { hexToRgb } from "./hexToRgb";
import { mapBlocks } from "./main";

let neighboringBlocks = [];
let adjacentToNeighboringBlocks = [];

export const checkCloseMapBlocks = (block) => {
  // Find nearby green blocks around the given block
  const neighboringGreenBlocks = findCloseGreenMapBlocks(block, '#009900');
  
  console.log(neighboringGreenBlocks, "greenlist");

  neighboringGreenBlocks.forEach((greenBlock) => {
    // Check if there are fewer than 3 adjacent blocks with the specified color
    if (findCloseMapBlocks(greenBlock, '#FFB266').length < 3) {
      // Remove greenBlock from neighboringBlocks if criteria met
      const index = neighboringBlocks.indexOf(greenBlock);
      if (index > -1) {
        neighboringBlocks.splice(index, 1);
      }
    } else {
      console.log("Returning", greenBlock);
      return greenBlock;
    }
  });

  // Clear the arrays
  adjacentToNeighboringBlocks.length = 0;
  neighboringBlocks.length = 0;
};

const findCloseMapBlocks = (pathBlock, searchingColor) => {
  let nearbyBlocks = [];
  let nearbyBlocksCount = 0;
  
  const colorToCompare = hexToRgb(searchingColor);

  // Right block
  let currentTestingBlock = mapBlocks[pathBlock.index + 1];
  if (currentTestingBlock && currentTestingBlock.color === colorToCompare) {
    nearbyBlocksCount++;
    nearbyBlocks.push(currentTestingBlock);
  }

  // Left block
  currentTestingBlock = mapBlocks[pathBlock.index - 1];
  if (currentTestingBlock && currentTestingBlock.color === colorToCompare) {
    nearbyBlocksCount++;
    nearbyBlocks.push(currentTestingBlock);
  }

  // Above block
  currentTestingBlock = mapBlocks[pathBlock.index - 10];
  if (currentTestingBlock && currentTestingBlock.color === colorToCompare) {
    nearbyBlocksCount++;
    nearbyBlocks.push(currentTestingBlock);
  }

  // Below block
  currentTestingBlock = mapBlocks[pathBlock.index + 10];
  if (currentTestingBlock && currentTestingBlock.color === colorToCompare) {
    nearbyBlocksCount++;
    nearbyBlocks.push(currentTestingBlock);
  }

  return nearbyBlocks;
};

const findCloseGreenMapBlocks = (pathBlock, searchingColor) => {
  let adjacentBlocks = [];
  
  const colorToCompare = hexToRgb(searchingColor);

  // Check neighboring blocks
  const rightBlock = mapBlocks[pathBlock.index + 1];
  if (rightBlock && rightBlock.color === colorToCompare) {
    adjacentBlocks.push(rightBlock);
  }

  const leftBlock = mapBlocks[pathBlock.index - 1];
  if (leftBlock && leftBlock.color === colorToCompare) {
    adjacentBlocks.push(leftBlock);
  }

  const aboveBlock = mapBlocks[pathBlock.index - 10];
  if (aboveBlock && aboveBlock.color === colorToCompare) {
    adjacentBlocks.push(aboveBlock);
  }

  const belowBlock = mapBlocks[pathBlock.index + 10];
  if (belowBlock && belowBlock.color === colorToCompare) {
    adjacentBlocks.push(belowBlock);
  }

  return adjacentBlocks;
};