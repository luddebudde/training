import { drawSquare } from "./draw/drawSquare.js";
import { drawText } from "./draw/drawText.js";
import { getNextElement } from "./getNextElement.js";
import { buttons, ctx, entities, player, start, startGame } from "./main.js";

import { world } from "./world.js";

let chosenWeapon = 0;

const revivePlayer = () => {
  player.health = 100;
  entities.push(player);
};

export const deathMenu = () => {
  const buttonFuncions = [revivePlayer, startGame];
  const buttonTexts = [
    "REVIVE",
    "RESTART",
    "MAIN MENU",
    "nhiuhrtggsehyesgyuhbrgv",
  ];

  const loopAmount = 4;

  for (let i = 0; i < loopAmount; i++) {
    const buttonName = getNextElement(buttonTexts, i - 1);
    const act = buttonFuncions[i % buttonFuncions.length];

    const buttonNameInfo = ctx.measureText(buttonName);

    const square = {
      x: world.width / 2 - buttonNameInfo.width / 2,
      y: 250 * i + 150,
      width: buttonNameInfo.width + 80,

      height: 200,
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
        console.log(act);

        start();
      },
    };
    // console.log(button.function);

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

      buttons.push(button);
      // console.log(buttons);
    }
  }
};
