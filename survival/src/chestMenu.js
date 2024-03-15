import { drawObject } from "./draw/drawObject.js";
import { drawSquare } from "./draw/drawSquare.js";
import { drawText } from "./draw/drawText.js";
import { getNextElement } from "./getNextElement.js";
import {
  buttons,
  ctx,
  entities,
  movable,
  player,
  drawingSquares,
  start,
  startGame,
  weapons,
  pause,
} from "./main.js";
import { makeDirection } from "./makeDirection.js";
import { showStatistics } from "./showStatistics.js";
import { stats } from "./stats.js";
import { vector } from "./vectors.js";
import { selfImpaler } from "./weapons.js/selfImpaler.js";
import { wiper } from "./weapons.js/wiper.js";

import { world } from "./world.js";

const animationMoveSpeed = 10;

const animationDuration = (world.width / animationMoveSpeed) * 1; // Tid i millisekunder för att röra sig till mitten
// const animationDuration = 10000;

// const squareWidth = 200;
// const squareHeight = 240;

const squareWidth = 400;
const squareHeight = 500;

export const chestMenu = () => {
  const loopAmount = 4;

  const squares = [];

  for (let i = 0; i < loopAmount; i++) {
    const center = {
      x: world.width / 2,
      y: world.height / 2,
    };
    const pos = {
      x: i % 2 === 0 ? 0 : world.width,
      y: i < 2 ? 0 : world.height,
    };
    const posMargin = i % 2 === 0 ? squareWidth * 1.5 : -squareWidth * 1.5;

    const finalPos = {
      x: center.x + posMargin,
      y: center.y,
    };
    const dir = makeDirection(pos, finalPos);
    const vel = {
      x: dir.x * animationMoveSpeed,
      y: dir.y * animationMoveSpeed,
    };

    const square = {
      x: pos.x,
      y: pos.y,
      vel: vel,
      width: i % 2 === 0 ? squareWidth : -squareWidth,
      height: i < 2 ? squareWidth : -squareHeight,
      color: "black",
      startTime: Date.now(),
    };

    squares.push(square);

    drawSquare(square);

    document.createElement("button");

    const startTime = Date.now();

    const button = {
      square: square,
      number: i,
      x: square.x,
      y: square.y,
      width: square.width,
      height: square.height,
      function: () => {
        stats.curse += 10;

        buttons.length = 0;
      },
      update: () => {
        ctx.beginPath();
        ctx.globalAlpha = 1;
        ctx.clearRect(0, 0, world.width, world.height);
        ctx.fillStyle = "white";
        ctx.fill();

        animateSquares(button.square);
      },
    };

    if (button.weapon !== undefined) {
      drawText(
        buttonName,
        square.x + 40,
        (i * loopAmount * square.height + square.y) / loopAmount + 180,
        "red"
      );

      if (button.image !== undefined) {
        ctx.drawImage(button.image, button.x + 20, button.y + 90, 100, 100);
      }
    }

    buttons.push(button);
    drawingSquares.push(square);
  }
  pause();
};

const targetX = world.width / 2 - squareWidth / 2;
const targetY = world.height / 2 - squareHeight / 2;

// let animationStartTime;

// let squareTime =
// squareTime = square.startTime !== undefined ? square.startTime : squareTime;;

function animateSquares(square) {
  // squareTime = square.startTime
  const currentTime = Date.now();
  const elapsedTime = currentTime - square.startTime;

  // console.log(elapsedTime, animationDuration);
  // console.log(currentTime, square.startTime);
  drawingSquares.forEach((square) => {
    drawSquare(square);
    ctx.beginPath();
    ctx.arc(square.x, square.y, 10, 0, 2 * Math.PI);
    ctx.fillStyle = "red";
    ctx.fill();
  });
  if (elapsedTime < animationDuration) {
    drawingSquares.forEach((square) => {
      square.x += square.vel.x;
      square.y += square.vel.y;
      // }
    });

    requestAnimationFrame(animateSquares);
  } else {
    chestReward();
  }
}

let chosenWeapon;
const maxLevel = 5;

let hasDecidedWeapon = false;
let shouldEvolve = false;

const chestReward = () => {
  const evolutionWeapons = weapons.filter(
    (weapon) => weapon.upgrades.level >= maxLevel
  );

  const availableWeapons = weapons.filter(
    (weapon) => weapon.upgrades.level <= maxLevel
  );

  // Uppdatera chosenWeapon om det tidigare valda vapnet inte längre är giltigt
  if (evolutionWeapons.length > 0) {
    chosenWeapon =
      evolutionWeapons[Math.floor(Math.random() * evolutionWeapons.length)];
    hasDecidedWeapon = true;
    shouldEvolve = true;
  } else if (!hasDecidedWeapon || !availableWeapons.includes(chosenWeapon)) {
    chosenWeapon =
      availableWeapons[Math.floor(Math.random() * availableWeapons.length)];
    hasDecidedWeapon = true;
  }

  console.log(evolutionWeapons.length);

  const square = {
    weapon: chosenWeapon,
    evolve: shouldEvolve,
    x: world.width / 2 - 200,
    y: world.height / 2 - 200,
    width: 400,
    height: 400,
    color: "blue",
  };

  // console.log(square.weapon);

  const button = {
    text: "OK",
    x: square.x + 50,
    y: square.y + 425,
    width: 300,
    height: 100,
    color: "red",

    function: () => {
      buttons.length = 0;
      drawingSquares.length = 0;
      hasDecidedWeapon = false;
      console.log("start");

      if (!button.evolve) {
        const weaponUpgrades = square.weapon.upgrades;
        const level = weaponUpgrades.level;

        const statTypes = weaponUpgrades.statsOrder[level];
        const upgradeAmounts = weaponUpgrades.amountOrder[level];

        statTypes.forEach((statType, index) => {
          const amount = upgradeAmounts[index];

          square.weapon.stats[statType] += amount;

          console.log(square.weapon.stats);
        });

        if (!weapons.includes(square.weapon)) {
          weapons.push(square.weapon);
        }

        square.weapon.upgrades.level += 1;

        console.log(square.weapon.name, square.weapon.upgrades.level, "chest");
      } else {
        weapons.splice(weapons.indexOf(square.chosenWeapon));
        weapons.push(selfImpaler);
      }
      start();
    },
  };

  buttons.push(button);

  // Draw weapon
  drawSquare(square);
  if (square.weapon.image !== undefined) {
    ctx.drawImage(
      square.weapon.image,
      square.x + square.width / 2 - 100,
      square.y + square.height / 2 - 100,
      200,
      200
    );
  }

  const weaponTextWidth = ctx.measureText(square.weapon.name).width;
  const weaponTextX = square.x + (square.width - weaponTextWidth) / 2;

  // Rita texten
  drawText(
    square.weapon.name,
    weaponTextX,
    square.y + square.height / 2 + 150,
    "red"
  );

  // Draw button
  const buttonTextWidth = ctx.measureText(button.text).width;
  const buttonTextX = button.x + (button.width - buttonTextWidth) / 2;

  drawSquare(button);
  drawText(button.text, buttonTextX, button.y + 60, "black");
};
