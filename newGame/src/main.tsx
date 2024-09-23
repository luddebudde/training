// Fix enemy targeting
// Rewrite map generation but with pathBlocks.includes(neighbor) instead, maybe.

import { createMenu } from "./createMenu.tsx";
import {
  enemies,
  Enemy,
  entities as entities,
  randomBoss,
  randomEnemy,
} from "./enemies/enemyTypes.tsx";
import { changeDivStatus } from "./changeDivStatus.tsx";
import {
  currentlyWalking,
  walkTowardsMapBlock,
} from "./walkTowardsMapBlock.tsx";
import { animationsRegistry, stopAnimation } from "./playAnimation.tsx";
import { loopPerSecond } from "./startFight.tsx";
import {
  attackAnimation,
  protectAnimation,
  runAnimation,
  overwritePlayerAnimation,
  playerAppearance,
} from "./playerAnimations.tsx";
import { drawHealthBar } from "./draw/drawHealthbar.tsx";
import { attack } from "./attack.tsx";
import { player } from "./player.tsx";

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

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

export const canvas = document.getElementById("myCanvas");
export const ctx = canvas.getContext("2d");

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
    // initializePlayerTarget();
    // console.log("playertarget", player);

    entities.push(player);
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
  playerAppearance();
  // createCredits();
  // generateMap();
  // startFight(prototype);

  // runAnimation();
  // spawnEnemy([slimeEnemy, slimeEnemy]);
})();

export const drawmap = () => {
  const div = document.getElementById("mapDiv");
  if (!div) return;
  div.innerHTML = "";

  // idleAnimation();
  // runAnimation();
  // playerAppearance();

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
        overwritePlayerAnimation(runAnimation);

        walkTowardsMapBlock(player.currentBlock, block);
      }
    });

    div.appendChild(button);
  });
};

export let attackDelay = 0;

document.addEventListener("keydown", function (event) {
  // console.log(event.code);

  if (attackDelay <= 0) {
    if (event.code === "KeyD") {
      overwritePlayerAnimation(attackAnimation);
      attackDelay = loopPerSecond;

      attack(player, player.target, player.sword.damage);
    }
    if (event.code === "Space") {
      overwritePlayerAnimation(protectAnimation);
      attackDelay = loopPerSecond * 1.5;
    }
  }

  if (event.code === "ArrowUp") {
    player.target = player.possibleTargets[player.targetId + 1];
    console.log(player.target);
  }
  if (event.code === "ArrowDown") {
    player.target = player.possibleTargets[player.targetId];
    console.log(player.target);
  }
});

const gameLoop = () => {
  const now = performance.now();

  attackDelay--;

  for (const entityId in animationsRegistry) {
    const animation = animationsRegistry[entityId];
    if (!animation.active && animation.loopsLeft <= 0) {
      continue;
    }

    const {
      spriteImage,
      currentFrame,
      frameWidth,
      spriteHeight,
      pos,
      size,
      parts,
      frameRate,
      isPlayer,
    } = animation;

    if (!spriteImage.complete) continue;

    const frameDuration = 1000 / frameRate;
    if (now - animation.lastFrameTime >= frameDuration) {
      animation.lastFrameTime = now;

      if (animation.oldPos.x !== pos.x || animation.oldPos.y !== pos.y) {
        ctx.clearRect(
          animation.oldPos.x - size.x / 2,
          animation.oldPos.y - size.y / 2,
          frameWidth + size.x,
          spriteHeight + size.y
        );
        // Uppdatera den gamla positionen till den nya
        animation.oldPos = { ...pos };
      }

      // Clear area
      ctx.clearRect(pos.x, pos.y, size.x, size.y);

      // Draw sprite
      ctx.drawImage(
        spriteImage,
        currentFrame * frameWidth,
        0,
        frameWidth,
        spriteHeight,
        pos.x, // Centrerar bilden horisontellt
        pos.y, // Centrerar bilden vertikalt
        size.x, // Använd `size.x` för bildens bredd
        size.y // Använd `size.y` för bildens höjd
      );

      ctx.rect(pos.x, pos.y, size.x, size.y);
      ctx.stroke();

      animation.currentFrame = (animation.currentFrame + 1) % parts;

      // Done
      if (animation.currentFrame === 0) {
        animation.loopsLeft--;

        if (animation.loopsLeft === 0 && !animation.isPlayer) {
          stopAnimation(entityId);

          if (animation.whenDone) {
            animation.whenDone();
          }
          continue;
        }
      }
    }
  }

  enemies.forEach((enemy) => {
    const sizeX = enemy.size.x;
    const sizeY = enemy.size.y;
    const xPos = enemy.pos.x;
    const yPos = enemy.pos.y;

    drawHealthBar(
      ctx,
      xPos,
      yPos + sizeY * 1.2,
      sizeX,
      sizeY / 4,
      enemy.health,
      enemy.maxHealth
    );

    if (enemy === player.target) {
      ctx.rect(enemy.pos.x, enemy.pos.y, enemy.size.x, enemy.size.y);
      ctx.strokeStyle = "red";
      ctx.stroke();
      ctx.strokeStyle = "black";
    }
  });

  // console.log("player", player.health, player.maxHealth, player.id);

  // console.log(player);

  // Rita ut spelarens hälsomätare separat
  drawHealthBar(
    ctx,
    player.pos.x,
    player.pos.y + player.size.y,
    player.size.x,
    player.size.y / 10,
    player.health,
    player.maxHealth
  );

  requestAnimationFrame(gameLoop);
};

gameLoop();
