import {
  changeMusic,
  changeVolume,
  gameMusicList,
  goodMusic,
} from "../changeMusic.js";
import { characters } from "../characters.js/characterInfo.js";
import { drawSquare } from "../draw/drawSquare.js";
import { drawText } from "../draw/drawText.js";
import { buttons, ctx } from "../main.js";
import { playAirstrikeCall, playLevelUp, playWilhelm } from "../sounds.js";
import { world } from "../world.js";
import { mainMenu } from "./mainMenu.js";

export const leaderboard = () => {
  ctx.beginPath();
  ctx.globalAlpha = 1;
  ctx.clearRect(0, 0, world.width, world.height);
  ctx.fillStyle = "white";
  ctx.fill();

  characters.forEach((character, index) => {
    drawText(index + 1, 50, 100 + 100 * index, "black");

    drawText(character.fullname, 100, 100 + 100 * index, "black");

    const button = {
      index: index,
      pressCounter: 0,
      x: 50,
      y: 100 + 100 * index,
      width: 10,
      height: 10,
      function: () => {
        if (button.index === 0) {
          button.pressCounter += 1;
          console.log(button.pressCounter);
          if (button.pressCounter % 20 === 0) {
            // playWilhelm();
            // music goodMusic
            gameMusicList.push(goodMusic);
            changeMusic(goodMusic.fileName);
            changeVolume(goodMusic.volume);
          }
        } else if (button.index === 1) {
          playAirstrikeCall();
        } else if (button.index === 2) {
          playLevelUp();
        }
      },
    };

    buttons.push(button);
  });

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
