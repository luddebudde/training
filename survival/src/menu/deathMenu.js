import { drawSquare } from "../draw/drawSquare.js";
import { drawText } from "../draw/drawText.js";
import { getNextElement } from "../getNextElement.js";
import { buttons, ctx, entities, player, start, startGame } from "../main.js";
import { showStatistics } from "./showStatistics.js";
import { stats } from "../stats.js";

import { screenSizeMultipler, world, worldsizeMultiplier } from "../world.js";
import { mainMenu } from "./mainMenu.js";

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
    mainMenu,
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
      x: world.width / 2 - (buttonNameInfo.width / 2) * screenSizeMultipler.x,
      y: (250 * i + 150) * screenSizeMultipler.y,

      width: buttonNameInfo.width + 80 * screenSizeMultipler.x,
      height: 200 * screenSizeMultipler.y,
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
        console.log(buttons, 1);
        buttons.length = 0;
        console.log(buttons, 2);

        act();
      },
    };

    if (button.weapon !== undefined) {
      // Rita vapennamnet
      drawText(
        buttonName,
        square.x + 40 * screenSizeMultipler.x,
        // (i * loopAmount * square.height + square.y) / loopAmount + 100,
        square.y + 100 * screenSizeMultipler.y,
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