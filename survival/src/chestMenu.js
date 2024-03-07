import { drawSquare } from "./draw/drawSquare.js";
import { drawText } from "./draw/drawText.js";
import { getNextElement } from "./getNextElement.js";
import {
  buttons,
  ctx,
  entities,
  movable,
  player,
  drawingSquares,
  start,
  startGame,
} from "./main.js";
import { showStatistics } from "./showStatistics.js";
import { stats } from "./stats.js";

import { world } from "./world.js";

const animationDuration = 50000; // Tid i millisekunder för att röra sig till mitten

// const squareWidth = 200;
// const squareHeight = 240;

const squareWidth = 300;
const squareHeight = 300;

export const chestMenu = () => {
  //   const buttonFunctions = [revivePlayer, startGame, showStatistics];
  //   const buttonTexts = ["REVIVE", "RESTART", "STATISTIC", "MAIN MENU"];

  const loopAmount = 4;

  //   for (let i = 0; i < loopAmount; i++) {
  //     // const buttonName = getNextElement(buttonTexts, i - 1);
  //     // const act = buttonFunctions[i % buttonFunctions.length];

  //     // const buttonNameInfo = ctx.measureText(buttonName);

  //     const square = {
  //       x: (i % 2) * (world.width - 480),
  //       y: (i % 2) * (world.height - 200),
  //       width: 400 + 80,
  //       height: 200,

  //       color: "black",
  //     };

  const squares = [];

  for (let i = 0; i < loopAmount; i++) {
    const square = {
      x: i % 2 === 0 ? 20 : world.width - squareWidth,
      y: i < 2 ? 20 : world.height - squareHeight,
      width: squareWidth,
      height: squareHeight,
      color: "black",
      startTime: Date.now(),
    };

    squares.push(square);

    drawSquare(square);

    document.createElement("button");

    const startTime = Date.now();

    const button = {
      square: square,
      number: i,
      x: square.x,
      y: square.y,
      width: square.width,
      height: square.height,
      function: () => {
        stats.curse += 10;

        buttons.length = 0;
      },
      update: () => {
        animateSquares(square);
      },
    };

    if (button.weapon !== undefined) {
      // Rita vapennamnet
      drawText(
        buttonName,
        square.x + 40,
        (i * loopAmount * square.height + square.y) / loopAmount + 180,
        "red"
      );

      if (button.image !== undefined) {
        ctx.drawImage(button.image, button.x + 20, button.y + 90, 100, 100);
      }
    }

    buttons.push(button);
    drawingSquares.push(square);
  }
};

// function animateSquares(square) {
//   const currentTime = Date.now();
//   const elapsedTime = currentTime - square.startTime;

//   //   console.log("då");

//   if (elapsedTime < animationDuration) {
//     // Fortsätt animationen
//     console.log("hej");
//     drawingSquares.forEach((square) => {
//       square.x +=
//         ((world.width / 2 - square.x) / animationDuration) * elapsedTime;
//       square.y +=
//         ((world.height / 2 - square.y) / animationDuration) * elapsedTime;
//       drawSquare(square);
//     });

//     // Uppdatera animationen
//     requestAnimationFrame(animateSquares);
//   }
// }

const targetX = world.width / 2 - squareWidth / 2;
const targetY = world.height / 2 - squareHeight / 2;

// let animationStartTime;

function animateSquares(square) {
  const currentTime = Date.now();
  const elapsedTime = currentTime - square.startTime;

  if (elapsedTime < animationDuration) {
    // Rörelse mot mitten
    drawingSquares.forEach((square) => {
      const deltaX = targetX - square.x;
      const deltaY = targetY - square.y;
      const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);

      // Kontrollera om fyrkanterna nuddar varandra
      if (distance > 0) {
        const movementFactor = Math.min(0.01, distance / animationDuration);
        square.x += deltaX * movementFactor;
        square.y += deltaY * movementFactor;
      }

      drawSquare(square);
    });

    // Uppdatera animationen
    requestAnimationFrame(animateSquares);
  } else {
    // Animationen har avslutats, utför din funktion här
    yourCustomFunction();

    // Lägg till eventuella andra logiker eller funktioner som du vill exekvera efter animationen
  }
}

function yourCustomFunction() {
  console.log("Igenom");
  // Denna funktion kommer att köras när animationen är klar
  // Lägg till din egna logik här
}
