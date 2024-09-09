import { createCredits } from "./createCredits.tsx";
import { createMenu } from "./createMenu.tsx";
import { randomBoss, randomEnemy } from "./enemies/enemyTypes.tsx";
import { slimeEnemy } from "./enemies/slimeEnemy.tsx";
import { player } from "./player.tsx";
import { changeDivStatus } from "./changeDivStatus.tsx";
import {
  currentlyWalking,
  walkTowardsMapBlock,
} from "./walkTowardsMapBlock.tsx";
import { playAnimation, stopAnimation } from "./playAnimation.tsx";
import { loopPerSecond, startFight } from "./startFight.tsx";
import {
  playerAnimationQueue,
  attackAnimation,
  protectAnimation,
  runAnimation,
  overwritePlayerAnimation,
} from "./playerAnimations.tsx";
import { prototype } from "stats.js";
import { spawnEnemy } from "./spawnEnemy.tsx";

// Rewrite map generation but with pathBlocks.includes(neighbor) instead, maybe.

// const deletion = `
//   <ul>
//     <li>BANANANA</li>
//     <li>APPPLEEE</li>
//   </ul>`;

// const a = `
// <button
//   style="
//     background-color: red;
//     color: green;
//     font-size: 30px;
//     padding: 50px;
//     padding-bottom: 20px;
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//   "
//   onclick="deleteList()"
// >
//   DELETE
// </button>
// `;

// document.body.insertAdjacentHTML('beforeend', deletion);
// document.body.insertAdjacentHTML('beforeend', a);

export type Enemy = {
  health: number;
  name: string;
  pos: {
    x: number;
    y: number;
  };
  size: {
    x: number;
    y: number;
  };
  id: number;
  animations: [];
};

export type Block = {
  row: number;
  column: number;
  color: string;
  text: string;
  image: string;
  infested: boolean | Enemy;
};

export const mapBlocks: Block[] = [];
export const pathBlocks: Block[] = [];

export const generateMap = () => {
  (async () => {
    for (let row = 0; row <= 5; row++) {
      for (let column = 0; column <= 8; column++) {
        let colorHex: string = "#009900";
        let blockText: string = "";

        if (row === 5 && column === 4) {
          colorHex = "#FFB266";
        }

        // const colorRgb = hexToRgb(colorHex);

        const currentBlock: Block = {
          row: row,
          column: column,
          color: colorHex,
          text: blockText,
          image: "",
          infested: false,
        };

        if (row === 5 && column === 4) {
          pathBlocks.push(currentBlock);
        }

        mapBlocks.push(currentBlock);
      }
    }

    changeDivStatus("mapDiv", "display", "flex");

    const module = await import("./handleBlocks");
    const chosePathGeneration = module.chosePathGeneration;

    for (let row = 0; row <= 50; row++) {
      setTimeout(() => {
        player.currentBlock = pathBlocks[0];

        const contestantNeighbors: Block[] = chosePathGeneration(
          pathBlocks[pathBlocks.length - 1]
        );

        const chosenNeighbor =
          contestantNeighbors[
            Math.floor(Math.random() * contestantNeighbors.length)
          ];

        const div = document.getElementById("mapDiv");
        if (div) {
          div.innerHTML = "";
        }

        if (
          chosenNeighbor === undefined ||
          pathBlocks.includes(chosenNeighbor)
        ) {
          const lastElement: Block = pathBlocks[pathBlocks.length - 1];
          lastElement.color = "#FF0000";
          lastElement.infested = randomBoss();
          drawmap();
          return;
        } else {
          if (Math.random() > 0.3) {
            chosenNeighbor.color = `#FFB266`;
          } else {
            chosenNeighbor.color = `#FF8000`;
            chosenNeighbor.infested = randomEnemy();
          }
          drawmap();

          pathBlocks.push(chosenNeighbor);
        }
      }, 0 * row);
    }
  })();
};

const animationCheck = [];

(async () => {
  createMenu();
  // createCredits();
  // generateMap();
  // startFight(prototype);

  // runAnimation();
  // spawnEnemy([slimeEnemy]);
})();

export const drawmap = () => {
  const div = document.getElementById("mapDiv");
  if (!div) return;
  div.innerHTML = "";

  mapBlocks.forEach((block) => {
    if (block === player.currentBlock) {
      block.image = `/ringo starr.jpg`;
    } else if (block.color === "#009900") {
      block.image = "/map/fog.webp";
    } else if (block.color === "#FF8000") {
      block.image = "/paul mcartney.jpg";
    } else if (block.color === "#FF0000") {
      block.image = "/george harrison.jpg";
    } else {
      block.image = `/john lennon.jpg`;
    }

    const button = document.createElement("button");
    button.style.backgroundColor = block.color;
    button.style.fontSize = "30px";
    button.style.padding = "0px";
    button.style.margin = "0px";
    button.style.border = "none";

    const img = document.createElement("img");
    img.src = block.image;
    // img.style.width = "160px";
    // img.style.height = "160px";
    img.style.width = "6.25vw";
    img.style.height = "6.25vw";
    img.style.display = "block";
    img.style.margin = "0";
    img.style.padding = "0";
    img.style.border = "none";
    img.style.outline = "none";

    button.appendChild(img);

    button.addEventListener("click", () => {
      if (pathBlocks.includes(block) && !currentlyWalking) {
        // playerAnimationQueue.length = 0;
        // stopAnimation("player");
        // playerAnimationQueue.push(runAnimation);
        // processAnimationQueue();
        overwritePlayerAnimation(runAnimation);

        walkTowardsMapBlock(player.currentBlock, block);
      }
    });

    div.appendChild(button);
  });
};

//const gameLoop = setInterval(() => {}, 1000 / loopPerSecond);
document.addEventListener("keydown", function (event) {
  if (event.code === "Enter") {
    // playerAnimationQueue.length = 0; // Rensa animationskön
    // stopAnimation("player"); // Stopp den nuvarande animationen
    // playerAnimationQueue.push(attackAnimation); // Lägg till ny animation
    // processAnimationQueue(); // Processa den nya animationen
    overwritePlayerAnimation(attackAnimation);
  }
  if (event.code === "Space") {
    // playerAnimationQueue.length = 0; // Rensa animationskön
    // stopAnimation("player"); // Stopp den nuvarande animationen
    // playerAnimationQueue.push(protectAnimation); // Lägg till ny animation
    // processAnimationQueue(); // Processa den nya animationen
    overwritePlayerAnimation(protectAnimation);
  }
});

// const processAnimationQueue = () => {
//   if (playerAnimationQueue.length > 0) {
//     const nextAnimation = playerAnimationQueue.shift(); // Hämta och ta bort den första animationen i kön
//     nextAnimation(); // Kör animationen
//   }
// };
