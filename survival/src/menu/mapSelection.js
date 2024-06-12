import {
  changeMusic,
  changeVolume,
  fadeOutMusic,
  gameMusicList,
  musicAudio,
  normalMusic,
  restoreMusicVolume,
} from "../changeMusic.js";
import { drawSquare } from "../draw/drawSquare.js";
import { drawText } from "../draw/drawText.js";
import {
  assets,
  backgrounds,
  buttons,
  ctx,
  scrollChange,
  startGame,
} from "../main.js";
import { changeCurrentMap, maps } from "../maps/standardMap.js";

import { screenSizeMultipler, world, worldsizeMultiplier } from "../world.js";
import { characterSelection } from "./characterSelection.js";

export const mapSelection = () => {
  scrollChange.y = 0;
  fadeOutMusic(3000);
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
      characterSelection();
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

  maps.forEach((map, index) => {
    const mapIconWidth = 800;
    const mapScreenHeight = 400;

    const mapSquarePos = {
      x: world.width / 2 - mapIconWidth / 2,
      y: 20 + mapScreenHeight * 1.1 * index + scrollChange.y,
      width: mapIconWidth * screenSizeMultipler.x,
      height: mapScreenHeight * screenSizeMultipler.y,
    };

    const playButton = {
      map: map,
      x: mapSquarePos.x,
      y: mapSquarePos.y,
      width: mapSquarePos.width,
      height: mapSquarePos.height,
      function: () => {
        // drawMapStats();
        drawMapSidebar(playButton.map);
      },
    };

    buttons.push(playButton);

    ctx.drawImage(
      backgrounds[map.texture],
      mapSquarePos.x,
      mapSquarePos.y,
      mapSquarePos.width,
      mapSquarePos.height
    );

    const mapSquare = {
      x: mapSquarePos.x + (mapSquarePos.width / 5) * 3,
      y: mapSquarePos.y,
      width: (mapSquarePos.width / 5) * 2,
      height: mapSquarePos.height,
      color: "green",
    };

    drawSquare(mapSquare);
    buttons.push(mapSquare);

    const textSizeDiv = 1;
    const lineHeight = 50;
    const maxDescriptionWidth = 65; // Adjust padding as needed

    const words = map.description.split(" ");
    let wrappedDescription = "";
    let currentLine = "";

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const testLine = currentLine === "" ? word : currentLine + " " + word;
      const testWidth = ctx.measureText(testLine).width;

      if (testWidth <= maxDescriptionWidth * textSizeDiv) {
        currentLine = testLine;
      } else {
        wrappedDescription +=
          (wrappedDescription === "" ? "" : "\n") + currentLine;
        currentLine = word;
      }
    }

    // Add the last line
    wrappedDescription += (wrappedDescription === "" ? "" : "\n") + currentLine;

    // Split the wrapped description into lines based on newline character
    const descriptionLines = wrappedDescription.split("\n");

    // Draw each line of the description
    descriptionLines.forEach((line, index) => {
      drawText(
        line,
        mapSquare.x + 10, // Adjust padding as needed
        mapSquare.y + 50 + index * lineHeight, // Adjust vertical spacing as needed
        "red",
        1 / textSizeDiv
      );
    });

    // buttons.push(playerSquare);
  });
};

let overallStatAmount = 0;

const drawMapSidebar = (map) => {
  const sideBar = {
    x: (world.width / 6) * 4.5,
    width: 20,
  };

  ctx.beginPath();
  ctx.globalAlpha = 1;
  ctx.clearRect(sideBar.x, 0, sideBar.width, world.height);
  ctx.fillStyle = "white";
  ctx.fill();

  // Definiera bakgrundsbredden och höjden
  const backgroundWidth = backgrounds[map.texture].width * 1.3;
  const backgroundHeight = backgrounds[map.texture].height * 1.3;

  // Rita ut bakgrunden upprepade gånger för att täcka hela canvasen
  for (
    let x = sideBar.x + sideBar.width;
    x < world.width;
    x += backgroundWidth
  ) {
    for (let y = 0; y < world.height; y += backgroundHeight) {
      ctx.drawImage(
        backgrounds[map.texture],
        x,
        y,
        Math.min(backgroundWidth, world.width - x), // Anpassa bredden för att undvika överlappning
        Math.min(backgroundHeight, world.height - y) // Anpassa höjden för att undvika överlappning
      );
    }
  }

  // White player square
  const playerSquarePos = {
    x: sideBar.x,
    y: world.height,
    width: world.width - sideBar.x * screenSizeMultipler.x,
    height: -650 * screenSizeMultipler.y,
  };

  // Player Sprite
  const playerRadius = 200;

  // Play button
  const playButtonWidth = playerRadius * 2 - 100;
  const playButtonHeight = 150;

  const playButton = {
    map: map,
    x: playerSquarePos.x + playerSquarePos.width / 2 - playButtonWidth / 2,
    y: world.height - playButtonHeight - 10,
    width: playButtonWidth,
    height: playButtonHeight,
    color: "green",
    text: "PLAY",
    function: () => {
      buttons.length = 0;
      changeCurrentMap(playButton.map);
      // backgroundElement = document.findElementById("background");
      // backgroundElement.style.backgroud = "url(images/background.jpg)";

      // console.log(musicAudio.src);

      startGame();
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

  const objectKeys = Object.keys(map.info);

  for (const key of objectKeys) {
    overallStatAmount++;

    const value = map.info[key];
    drawMapStats(key, value, sideBar.x + 40, 50, "red", 0.75);
  }
  overallStatAmount = 0;

  gameMusicList.forEach((song, index) => {
    const songName = ctx.measureText(song.name);
    const musicButton = {
      song: song,
      x: 75 + songName.width,
      y: 10 + 75 * index,
      width: 50,
      height: 50,
      color: "green",
      function: () => {
        changeMusic(song.fileName);
        changeVolume(song.volume);
      },
    };

    buttons.push(musicButton);

    ctx.drawImage(
      assets.playButton,
      musicButton.x,
      musicButton.y,
      musicButton.width,
      musicButton.height
    );

    drawText(song.name, 50, 50 + 75 * index, "red", 1.2);
  });
};

const drawMapStats = (type, value, x, y, color = "red", sizeMultplier = 1) => {
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
    value,
    keyLenght.width + margin + 20 * screenSizeMultipler.x,
    keyHeight,
    color,
    worldsizeMultiplier * sizeMultplier
  );
};
