import { drawSquare } from "./draw/drawSquare.js";
import { drawText } from "./draw/drawText.js";
import { getNextElement } from "./getNextElement.js";
import { buttons, ctx, entities, player, start, startGame } from "./main.js";
import { showStatistics } from "./showStatistics.js";
import { stats } from "./stats.js";

import { squareSizeMultipler, world, worldsizeMultiplier } from "./world.js";

let chosenWeapon = 0;

const revivePlayer = () => {
  player.health = stats.maxHealth;
  entities.push(player);
  stats.revives -= 1;
  start();
};

export const deathMenu = () => {
  const buttonFunctions = [
    stats.revives > 0 ? revivePlayer : undefined,
    startGame,
    showStatistics,
  ];
  const buttonTexts = [
    stats.revives > 0 ? "REVIVE" : "OUT OF REVIVES",
    "RESTART",
    "STATISTIC",
    "MAIN MENU",
  ];

  const loopAmount = 4;

  for (let i = 0; i < loopAmount; i++) {
    const buttonName = getNextElement(buttonTexts, i - 1);
    const act = buttonFunctions[i % buttonFunctions.length];

    const buttonNameInfo = ctx.measureText(buttonName);

    const square = {
      x: world.width / 2 - (buttonNameInfo.width / 2) * squareSizeMultipler.x,
      y: (250 * i + 150) * squareSizeMultipler.y,
      width: buttonNameInfo.width + 80 * squareSizeMultipler.x,

      height: 200 * squareSizeMultipler.y,
      color: "black",
    };

    drawSquare(square);

    document.createElement("button");

    const button = {
      number: i,
      image: chosenWeapon?.image,

      weapon: chosenWeapon,
      x: square.x,
      y: square.y,
      width: square.width,
      height: square.height,
      function: () => {
        act();
        // console.log("gick");
        // console.log(button.number);

        buttons.length = 0;
      },
    };
    // console.log(button.function);

    if (button.weapon !== undefined) {
      // Rita vapennamnet
      drawText(
        buttonName,
        square.x + 40 * squareSizeMultipler.x,
        // (i * loopAmount * square.height + square.y) / loopAmount + 100,
        square.y + 100 * squareSizeMultipler.y,
        // ((i + 1) * square.y) / loopAmount,
        "red",
        worldsizeMultiplier
      );

      // if (button.image !== undefined) {
      //   ctx.drawImage(button.image, button.x + 20, button.y + 90, 100, 100);
      // }

      buttons.push(button);
      // console.log(buttons);
    }
    // console.log(act);
  }
  // buttons.forEach((button) => {
  //   console.log(button.function);
  // });
};
