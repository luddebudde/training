// Johannes hjälplista:

// Fixa bugg där man saknar liv men lever
// Fixa bugg där knappar får konstig form && text konstig position
// Fixa backgrund som rör på sig

import { drawSquare } from "../draw/drawSquare.js";
import { drawText } from "../draw/drawText.js";
import { getNextElement } from "../getNextElement.js";
import {
  backgrounds,
  buttons,
  ctx,
  entities,
  player,
  start,
  startGame,
} from "../main.js";
import { screenSizeMultipler, world, worldsizeMultiplier } from "../world.js";
import { drawObject } from "../draw/drawObject.js";
import { deathMenu } from "./deathMenu.js";
import { showGameStatistics } from "./showGameStatistics.js";
import { characterSelection } from "./characterSelection.js";
import { leaderboard } from "./leaderboard.js";
import {
  changeMusic,
  changeVolume,
  musicAudio,
  playMusic,
  restoreMusicVolume,
  synthMusic,
} from "../changeMusic.js";

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
    buttons.length = 0;
    characterSelection();
    // console.log("character");
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
    // console.log("feat");
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
    // console.log("weapon");
  },
};

let buttonYPos;
let buttonXPos;

const buttonFunctions = [];

export const mainMenu = () => {
  if (musicAudio.volume === 0) {
    changeMusic(synthMusic.fileName);
    // changeVolume(synthMusic.volume);
    restoreMusicVolume();
    playMusic();
  }
  // ctx.beginPath();
  // ctx.globalAlpha = 1;
  // ctx.clearRect(0, 0, world.width, world.height);
  // ctx.fillStyle = "white";
  // ctx.fill();

  ctx.drawImage(backgrounds.forest, 0, 0, world.width, world.height);

  const menuButtons = [statistics, feats, weapons, playGame];

  menuButtons.forEach((button) => {
    buttonFunctions.push(button.function);
  });

  const loopAmount = menuButtons.length;

  for (let i = 1; i < loopAmount + 1; i++) {
    const currentButton = getNextElement(menuButtons, i - 2);
    const buttonText = currentButton.text;
    const sizeMult = currentButton.sizeMult;

    const act = currentButton.function;

    const buttonNameInfo = ctx.measureText(buttonText);
    const buttonNameWidth = buttonNameInfo.width;

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
      y: buttonYPos - (squareHeight / 2) * sizeMult.y,

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
      },
    };

    drawText(
      buttonText,
      square.x + 40 * screenSizeMultipler.x * 1 * sizeMult.textOffSetX,
      square.y + 100 * screenSizeMultipler.y * 1 * sizeMult.textOffSetY,
      "red",
      worldsizeMultiplier * sizeMult.text
    );

    buttons.push(button);
  }

  const leaderboardButton = {
    x: 0,
    y: 0,
    width: 200,
    height: 100,
    color: "green",
    text: "LEADERBOARD",
    function: () => {
      buttons.length = 0;
      leaderboard();
    },
  };

  drawSquare(leaderboardButton);
  drawText(
    leaderboardButton.text,
    10,
    leaderboardButton.height / 2,
    "black",
    0.5
  );
  buttons.push(leaderboardButton);
};
