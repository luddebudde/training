import { drawSquare } from "../draw/drawSquare.js";
import { drawText } from "../draw/drawText.js";
import { getNextElement } from "../getNextElement.js";
import {
  buttons,
  ctx,
  entities,
  player,
  start,
  startGame,
  timer,
} from "../main.js";
import { showStatistics } from "./showStatistics.js";
import { stats } from "../stats.js";

import { screenSizeMultipler, world, worldsizeMultiplier } from "../world.js";
import { mainMenu } from "./mainMenu.js";
import { statistics } from "../statistics.js";

let chosenWeapon = 0;

const revivePlayer = () => {
  statistics.game.deaths -= 1;

  player.health = stats.maxHealth;
  entities.push(player);

  stats.revives -= 1;

  statistics.game.revivesUsed += 1;
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
        statistics.game.deaths += 1;
        console.log(timer);
        statistics.timeLivedSeconds += Math.floor(timer);
        const timeLived = statistics.timeLivedSeconds;

        const averageTimeLived = Math.floor(
          statistics.game.deaths > 0
            ? timeLived / statistics.game.deaths
            : timeLived / 1
        );

        console.log(averageTimeLived);

        // statistics.game.averageTimeLived =
        //   averageTimeLived / 60 + " : " + (averageTimeLived % 60);

        const averageMinutes = Math.floor(averageTimeLived / 60);
        const averageSeconds = Math.floor(averageTimeLived % 60);

        const averageFormattedSeconds =
          averageSeconds < 10 ? "0" + averageSeconds : averageSeconds;

        const averageTimerText = averageMinutes + ":" + averageFormattedSeconds;

        statistics.game.averageTimeLived = averageTimerText;

        console.log(statistics.game.averageTimeLived);

        const minutes = Math.floor(timeLived / 60);
        const seconds = Math.floor(statistics.timeLivedSeconds % 60);

        const formattedSeconds = seconds < 10 ? "0" + seconds : seconds;

        const timerText = minutes + ":" + formattedSeconds;

        statistics.game.timeLived = timerText;

        // statistics.game.deaths += 1;
        buttons.length = 0;

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
