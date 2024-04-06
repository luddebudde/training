import { characters } from "../characters.js/characterInfo.js";
import { currentCharacter } from "../createPlayer.js";
import { drawSquare } from "../draw/drawSquare.js";
import { drawText } from "../draw/drawText.js";
import { getNextElement } from "../getNextElement.js";
import {
  assets,
  buttons,
  ctx,
  maxAmountOfWeapons,
  player,
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

const drawStatistics = (type, value, x, y, color = "red") => {
  const margin = (x + 10) * screenSizeMultipler.x;

  const keyHeight = y * overallStatAmount * screenSizeMultipler.x;
  const keyLenght = ctx.measureText(type);

  // console.log(value);

  drawText(
    type,
    x * screenSizeMultipler.x,
    keyHeight,
    "red",
    worldsizeMultiplier
  );
  drawText(
    ":",
    keyLenght.width + margin,
    keyHeight,
    color,
    worldsizeMultiplier
  );
  drawText(
    value,
    keyLenght.width + margin + 20 * screenSizeMultipler.x,
    keyHeight,
    color,
    worldsizeMultiplier
  );
};

export const showGameStatistics = () => {
  Object.keys(statistics).forEach((key) => {
    loopAmount++;
  });

  const square = {
    x: 0,
    y: 0,
    width: world.width,
    height: world.height,
    color: "black",
  };

  drawSquare(square);

  const playerSquarePos = {
    x: world.width - 25,
    y: world.height - 25,
    width: -650 * screenSizeMultipler.x,
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

  // const numbers = [10, 5, 20, 15];
  // const timesTakenArray = characters.map((character) => character.timesPicked);
  // const mostPopularCharacter = Math.max(...timesTakenArray);
  // console.log(mostPopularCharacter); // Output: 20

  const mostPopularCharacter = characters.reduce((prev, current) => {
    return prev.timesPicked > current.timesPicked ? prev : current;
  });
  console.log(mostPopularCharacter); // Output: Objektet för den mest populära karaktären

  drawText(
    "Most played character:" + mostPopularCharacter.fullname,
    world.width - 675,
    world.height - 700,
    "red",
    0.8
  );

  ctx.drawImage(
    assets[mostPopularCharacter.sprite],
    playerSquarePos.x - 500,
    playerSquarePos.y - 500,
    400,
    400
  );

  // draw

  const objectKeys = Object.keys(statistics.game);

  for (const key of objectKeys) {
    overallStatAmount++;

    const value = statistics.game[key];
    drawStatistics(key, value, 40, 100);
  }

  totalWeapons.forEach((weapon, index) => {
    drawStatistics(
      weapon.name,
      weapon.timesTaken,
      600 + 500 * Math.round(index / 3),
      20 + ((25 * index) % 75),
      "green"
    );
  });

  overallStatAmount = 0;

  const buttonWidth = 400;
  const buttonHeight = 200;

  const backButton = {
    x: world.width / 2 - buttonWidth / 2,
    y: world.height - buttonHeight * 1.2,
    width: buttonWidth,
    height: buttonHeight,
    color: "purple",
    function: () => {
      console.log("back");
      buttons.length = 0;
      mainMenu();
    },
    text: "BACK",
  };

  drawSquare(backButton);
  drawText(
    backButton.text,
    backButton.x + 90,
    backButton.y + backButton.height * 0.6,
    "red",
    1.5
  );
  buttons.push(backButton);
};
