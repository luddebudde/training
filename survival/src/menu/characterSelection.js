import { characters } from "../characters.js/characterInfo.js";
import { changeCurrentCharacter, currentCharacter } from "../createPlayer.js";
import { drawSquare } from "../draw/drawSquare.js";
import { drawText } from "../draw/drawText.js";
import { getNextElement } from "../getNextElement.js";
import {
  assets,
  buttons,
  ctx,
  handleMouseWheel,
  maxAmountOfWeapons,
  player,
  scrollChange,
  weapons,
} from "../main.js";
import { statistics } from "../statistics.js";
import { resetStats } from "../stats.js";
import { aimBullet } from "../weapons/createAimBullet.js";
import { shotgun } from "../weapons/createShotgun.js";
import { wiper } from "../weapons/wiper.js";
import { screenSizeMultipler, world, worldsizeMultiplier } from "../world.js";
import { totalWeapons } from "./levelUpSelection.js";
import { mainMenu } from "./mainMenu.js";
import { mapSelection } from "./mapSelection.js";

let loopAmount = 0;
let overallStatAmount = 0;
let weaponStatisticAmount = 0;

const drawCharacterStats = (
  type,
  value,
  x,
  y,
  color = "red",
  sizeMultplier = 1
) => {
  const margin = (x + 10) * screenSizeMultipler.x;

  const keyHeight = y * overallStatAmount * screenSizeMultipler.x;
  const keyLenght = ctx.measureText(type);

  drawText(
    type,
    x * screenSizeMultipler.x,
    keyHeight,
    "red",
    worldsizeMultiplier * sizeMultplier
  );
  drawText(
    ":",
    keyLenght.width + margin,
    keyHeight,
    color,
    worldsizeMultiplier * sizeMultplier
  );
  drawText(
    value < 5 ? value * 100 + "%" : value,
    keyLenght.width + margin + 20 * screenSizeMultipler.x,
    keyHeight,
    color,
    worldsizeMultiplier * sizeMultplier
  );
};

export const drawSidebar = (sideBar) => {
  // White player square
  const playerSquarePos = {
    x: sideBar.x,
    y: world.height,
    width: world.width - sideBar.x * screenSizeMultipler.x,
    height: -650 * screenSizeMultipler.y,
  };

  const playerSquare = {
    x: playerSquarePos.x,
    y: playerSquarePos.y,
    width: playerSquarePos.width,
    height: playerSquarePos.height,
    color: "white",
  };

  drawSquare(playerSquare);

  // Player Sprite
  const playerRadius = 200;
  ctx.drawImage(
    assets[currentCharacter.sprite],
    playerSquarePos.x + playerSquarePos.width / 2 - playerRadius,
    playerSquarePos.y - 600,
    playerRadius * 2,
    playerRadius * 2
  );

  // Play button
  const playButtonWidth = playerRadius * 2 - 100;
  const playButtonHeight = 150;

  const playButton = {
    x: playerSquarePos.x + playerSquarePos.width / 2 - playButtonWidth / 2,
    y: world.height - playButtonHeight - 10,
    width: playButtonWidth,
    height: playButtonHeight,
    color: "green",
    text: "PLAY",
    function: () => {
      buttons.length = 0;
      resetStats(currentCharacter);
      mapSelection();
    },
  };

  drawSquare(playButton);
  drawText(
    playButton.text,
    playButton.x + playButton.width / 15,
    playButton.y + playButton.height / 1.5,
    "red",
    2
  );
  buttons.push(playButton);

  // Statistics

  const objectKeys = Object.keys(currentCharacter.stats);

  for (const key of objectKeys) {
    overallStatAmount++;

    const value = currentCharacter.stats[key];
    drawCharacterStats(key, value, sideBar.x + 40, 50, "red", 0.75);
  }
  overallStatAmount = 0;
};

export const characterSelection = () => {
  const square = {
    x: 0,
    y: 0,
    width: world.width,
    height: world.height,
    color: "black",
  };

  drawSquare(square);

  const backButton = {
    x: 20,
    y: world.height - 150,
    width: 160,
    height: 100,
    color: "purple",
    function: () => {
      buttons.length = 0;
      mainMenu();
    },
    text: "BACK",
  };

  buttons.push(backButton);
  drawSquare(backButton);
  drawText(
    backButton.text,
    backButton.x + 10,
    backButton.y + (backButton.height / 5) * 3,
    "red"
  );

  scrollChange.y = 0;

  const sideBar = {
    x: (world.width / 6) * 4.5,
    width: 20,
  };
  ctx.beginPath();
  ctx.globalAlpha = 1;
  ctx.clearRect(sideBar.x, 0, sideBar.width, world.height);
  ctx.fillStyle = "white";
  ctx.fill();

  characters.forEach((character, index) => {
    const playerSquarePos = {
      x: 20 + 250 * (index % 7),
      y: 20 + 250 * Math.floor(index / 7) + scrollChange.y,
      width: 200 * screenSizeMultipler.x,
      height: 200 * screenSizeMultipler.y,
    };

    const playerSquare = {
      character: character,
      x: playerSquarePos.x,
      y: playerSquarePos.y,
      width: playerSquarePos.width,
      height: playerSquarePos.height,
      color: "white",
      function: () => {
        const square = {
          x: sideBar.x + sideBar.width,
          y: 0,
          width: world.width - sideBar.x,
          height: world.height,
          color: "black",
        };

        drawSquare(square);

        changeCurrentCharacter(playerSquare.character);
        playerSquare.character.timesPicked += 1;
        drawSidebar(sideBar);
      },
    };

    drawSquare(playerSquare);

    ctx.drawImage(
      assets[character.sprite],
      playerSquarePos.x + 30,
      playerSquarePos.y + 30,
      (playerSquarePos.width / 3) * 2,
      (playerSquarePos.height / 3) * 2
    );
    drawText(
      character.fullname,
      playerSquarePos.x,
      playerSquarePos.y + playerSquarePos.height - 7,
      "red",
      0.5
    );

    buttons.push(playerSquare);
  });
};
