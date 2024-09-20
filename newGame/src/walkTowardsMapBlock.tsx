import { enemyTypesOnFloor } from "./enemies/enemyTypes";
import { Block, drawmap, generateMap, mapBlocks, pathBlocks } from "./main";
import { player } from "./player";
import { startFight } from "./startFight";

const findBlockIndex = (block: Block): number => {
  return pathBlocks.findIndex(
    (b) => b.row === block.row && b.column === block.column
  );
};

export let currentlyWalking = false;

export const changeIsWalking = (mode: boolean) => {
  currentlyWalking = mode;
};

const timeouts = [];

const walk = (speed: number, startIndex: number, endIndex: number) => {
  const walkCheck = endIndex - startIndex - speed;

  timeouts.forEach((timeoutId) => clearTimeout(timeoutId));
  timeouts.length = 0;

  currentlyWalking = true;

  let delay = 500;

  for (let i = 0; speed > 0 ? i <= walkCheck : i >= walkCheck; i += speed) {
    const timeoutId = setTimeout(() => {
      const currentBlock = pathBlocks[startIndex + i + speed];
      player.currentBlock = currentBlock;

      if (currentBlock.infested) {
        timeouts.forEach((timeout) => clearTimeout(timeout));
        currentlyWalking = false;

        if (enemyTypesOnFloor.includes(currentBlock.infested)) {
          // console.log("ENEMEY FIHGHT!", currentBlock.infested);
          // currentBlock.color = '#FFB266'
          // currentBlock.infested = false
          console.log(currentBlock.infested);

          startFight(currentBlock.infested);
          // drawmap()
        } else {
          console.log("BOSS FIGHT", currentBlock.infested);

          const div = document.getElementById("mapDiv");
          div.innerHTML = "";

          pathBlocks.splice(0, pathBlocks.length);
          mapBlocks.splice(0, mapBlocks.length);

          generateMap();
        }
        // console.log("Walking interrupted due to infestation, currentlyWalking:", currentlyWalking);
      }

      drawmap();

      if (i === walkCheck) {
        setTimeout(() => {
          currentlyWalking = false;
          // console.log("Walking finished, currentlyWalking:", currentlyWalking);
        }, 500);
      }
    }, delay * Math.abs(i / speed));

    timeouts.push(timeoutId);
  }
};

export const walkTowardsMapBlock = (startBlock: Block, endBlock: Block) => {
  if (!currentlyWalking) {
    currentlyWalking = true;

    const startIndex = findBlockIndex(startBlock);
    const endIndex = findBlockIndex(endBlock);

    if (startIndex < endIndex) {
      walk(1, startIndex, endIndex);
    } else if (startIndex > endIndex) {
      walk(-1, startIndex, endIndex);
    } else {
      currentlyWalking = false;
    }
  }
};
