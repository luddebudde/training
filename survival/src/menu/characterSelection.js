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
import { aimBullet } from "../weapons.js/createAimBullet.js";
import { shotgun } from "../weapons.js/createShotgun.js";
import { wiper } from "../weapons.js/wiper.js";
import { screenSizeMultipler, world, worldsizeMultiplier } from "../world.js";
import { totalWeapons } from "./levelUpSelection.js";
import { mainMenu } from "./mainMenu.js";

let loopAmount = 0;
let overallStatAmount = 0;
let weaponStatisticAmount = 0;

const drawStatistics = (
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

  const playerRadius = 200;
  ctx.drawImage(
    assets[currentCharacter.sprite],
    playerSquarePos.x + playerSquarePos.width / 2 - playerRadius,
    playerSquarePos.y - 500,
    playerRadius * 2,
    playerRadius * 2
  );

  const objectKeys = Object.keys(currentCharacter.stats);

  for (const key of objectKeys) {
    overallStatAmount++;

    const value = currentCharacter.stats[key];
    drawStatistics(key, value, sideBar.x + 40, 50, "red", 0.75);
  }
  overallStatAmount = 0;
};

export const characterSelection = () => {
  scrollChange.y = 0;
  const square = {
    x: 0,
    y: 0,
    width: world.width,
    height: world.height,
    color: "black",
  };

  drawSquare(square);

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
        // ctx.beginPath();
        // ctx.globalAlpha = 1;
        // ctx.clearRect(
        //   sideBar.x,
        //   0,
        //   world.width - sideBar.x,
        //   world.height - 1000
        // );
        // ctx.fillStyle = "black";
        // ctx.fill();

        const square = {
          x: sideBar.x + sideBar.width,
          y: 0,
          width: world.width - sideBar.x,
          height: world.height,
          color: "black",
        };

        drawSquare(square);

        changeCurrentCharacter(playerSquare.character);
        drawSidebar(sideBar);
      },
      //   update: () => {
      //     handleMouseWheel();
      //   },
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

  const playButton = {
    x: 1000,
    y: 1000,
    width: 100,
    height: 100,
    color: "green",
    text: "PLAY",
    function: () => {},
  };

  drawSquare(playButton);
  buttons.push(playButton);
};
