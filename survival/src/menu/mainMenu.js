import { drawSquare } from "../draw/drawSquare.js";
import { drawText } from "../draw/drawText.js";
import { getNextElement } from "../getNextElement.js";
import { buttons, ctx, entities, player, start, startGame } from "../main.js";
import { screenSizeMultipler, world, worldsizeMultiplier } from "../world.js";
import { drawObject } from "../draw/drawObject.js";
import { deathMenu } from "./deathMenu.js";
import { showGameStatistics } from "./showGameStatistics.js";

let chosenWeapon = 0;

const playGame = {
  text: "PLAY",
  sizeMult: {
    x: 2,
    y: 1.2,
    text: 2,
    textOffSetX: 1,
    textOffSetY: 1.7,
  },

  function: () => {
    // characterSelection();
    console.log("character");
  },
};
const statistics = {
  text: "STATISTICS",
  sizeMult: {
    x: 1,
    y: 1,
    text: 1,
    textOffSetX: 1,
    textOffSetY: 1,
  },
  function: () => {
    buttons.length = 0;
    showGameStatistics();
    // console.log("stat");
  },
};
const feats = {
  text: "FEATS",
  sizeMult: {
    x: 1.2,
    y: 1,
    text: 1,
    textOffSetX: 1,
    textOffSetY: 1,
  },
  function: () => {
    // showFeats();
    console.log("feat");
  },
};
const weapons = {
  text: "WEAPONS",
  sizeMult: {
    x: 1,
    y: 1,
    text: 1,
    textOffSetX: 1,
    textOffSetY: 1,
  },
  function: () => {
    // shotUnlockedWeapons();
    console.log("weapon");
  },
};

let buttonYPos;
let buttonXPos;

const buttonFunctions = [];

export const mainMenu = () => {
  ctx.beginPath();
  ctx.globalAlpha = 1;
  ctx.clearRect(0, 0, world.width, world.height);
  ctx.fillStyle = "white";
  ctx.fill();

  //   const buttonFunctions = [startGame, showStatistics];
  const menuButtons = [statistics, feats, weapons, playGame];

  menuButtons.forEach((button) => {
    buttonFunctions.push(button.function);
  });

  const loopAmount = menuButtons.length;

  //   console.log(buttonFunctions);

  for (let i = 1; i < loopAmount + 1; i++) {
    const currentButton = getNextElement(menuButtons, i - 2);
    const buttonText = currentButton.text;
    const sizeMult = currentButton.sizeMult;
    // const buttonName = getNextElement(buttonTexts, i - 1);
    // const act = currentButton.function;
    // const act = buttonFunctions[i % buttonFunctions.length];
    const act = buttonFunctions[i % buttonFunctions.length];

    // console.log(act);

    const buttonNameInfo = ctx.measureText(buttonText);
    const buttonNameWidth = buttonNameInfo.width;

    // console.log(buttonNameWidth);
    // console.log(buttonNameInfo);

    if (currentButton === playGame) {
      buttonYPos = world.height / 2;
      buttonXPos = world.width / 2;
    } else {
      buttonYPos = (world.height / 5) * 4;
      buttonXPos = (world.width / loopAmount) * i;
    }

    const squareWidth =
      buttonNameWidth * 1.3 * screenSizeMultipler.x * sizeMult.x * 1;

    const squareHeight = 200 * screenSizeMultipler.y * sizeMult.y;

    const square = {
      x: buttonXPos - squareWidth / 2,
      //  - (buttonNameWidth / 2) * screenSizeMultipler.x * sizeMult.x,
      y: buttonYPos - (squareHeight / 2) * sizeMult.y,
      //   * screenSizeMultipler.y * sizeMult.y,

      width: squareWidth,
      height: squareHeight * sizeMult.y,
      color: "black",
    };

    drawSquare(square);

    document.createElement("button");

    const button = {
      number: i,
      x: square.x,
      y: square.y,
      width: square.width,
      height: square.height,
      function: () => {
        act();

        // start();

        // buttons.length = 0;
      },
    };

    // console.log(button);

    drawText(
      buttonText,
      square.x + 40 * screenSizeMultipler.x * 1 * sizeMult.textOffSetX,
      square.y + 100 * screenSizeMultipler.y * 1 * sizeMult.textOffSetY,
      "red",
      worldsizeMultiplier * sizeMult.text
    );

    buttons.push(button);
    console.log(buttons, 3);
  }
  const circle = {
    pos: {
      x: world.width / 2,
      y: world.height / 2,
    },
    radius: 15,

    color: "green",
  };
  drawObject(ctx, circle);
};
