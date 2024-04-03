import { drawObject } from "../draw/drawObject.js";
import { drawSquare } from "../draw/drawSquare.js";
import { drawText } from "../draw/drawText.js";
import { getNextElement } from "../getNextElement.js";
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
} from "../main.js";
import { makeDirection } from "../makeDirection.js";
import { showStatistics } from "./showStatistics.js";
import { stats } from "../stats.js";
import { vector } from "../vectors.js";
import { selfImpaler } from "../weapons.js/selfImpaler.js";
import { wiper } from "../weapons.js/wiper.js";

import { world } from "../world.js";

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

function animateSquares(square) {
  const currentTime = Date.now();
  const elapsedTime = currentTime - square.startTime;

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

let lootAmount;
let setLootAmount;

let hasDecidedWeapon = false;
const chosenWeapons = [];
let shouldEvolve = false;

const chestReward = () => {
  const lootValue = Math.floor(Math.random() * 100 * stats.luck);

  if (lootValue > 90) {
    lootAmount = 10;
    // lootAmount = 3;
  } else if (lootValue > 60) {
    lootAmount = 5;
    // lootAmount = 3;
  } else if (lootValue > 30) {
    lootAmount = 3;
  } else {
    lootAmount = 1;
    // lootAmount = 3;
  }

  // lootAmount = 5;

  if (!hasDecidedWeapon) {
    setLootAmount = lootAmount;
    for (let i = 0; i < lootAmount; i++) {
      const availableWeapons = weapons.filter(
        (weapon) =>
          weapon.upgrades.level <= weapon.upgrades.amountOrder.length - 1
      );

      if (availableWeapons.length > 0) {
        chosenWeapon =
          availableWeapons[Math.floor(Math.random() * availableWeapons.length)];

        // console.log(chosenWeapon);
        chosenWeapons.push(chosenWeapon);
      } else {
        chosenWeapon = wiper;
      }
      console.log(availableWeapons);

      hasDecidedWeapon = true;
    }
  }

  const square = {
    weapon: chosenWeapon,
    evolve: shouldEvolve,
    x: world.width / 2 - 200,
    y: world.height / 2 - 200,
    width: 400,
    height: 400,
    color: "blue",
  };

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

      chosenWeapons.forEach((chosenWeapon) => {
        const weaponUpgrades = chosenWeapon.upgrades;
        const level = weaponUpgrades.level;

        const statTypes = weaponUpgrades.statsOrder[level];
        const upgradeAmounts = weaponUpgrades.amountOrder[level];

        statTypes.forEach((statType, index) => {
          const amount = upgradeAmounts[index];

          chosenWeapon.stats[statType] += amount;
        });

        if (!weapons.includes(chosenWeapon)) {
          weapons.push(chosenWeapon);
        }

        chosenWeapon.upgrades.level += 1;
      });

      chosenWeapons.length = 0;
      start();
    },
  };

  buttons.push(button);

  drawWeapons(square, setLootAmount);

  // Draw button
  const buttonTextWidth = ctx.measureText(button.text).width;
  const buttonTextX = button.x + (button.width - buttonTextWidth) / 2;

  drawSquare(button);
  drawText(button.text, buttonTextX, button.y + 60, "black");
};

const drawWeapons = (square, lootAmount) => {
  const halfLootAmount =
    lootAmount % 2 === 0 ? lootAmount / 2 : Math.ceil(lootAmount / 2);
  const otherHalfLootAmount = lootAmount - halfLootAmount;

  const weaponTextWidth = ctx.measureText(square.weapon.name).width;
  const weaponTextX = square.x + (square.width - weaponTextWidth) / 2;
  const weaponTextY = square.y + square.height / 2 + 150;

  // Rita ut första vapnet
  drawSquare(square);

  for (let i = 0; i < lootAmount; i++) {
    const drawChosenWeapon = chosenWeapons[i];

    if (square.weapon.image !== undefined) {
      if (i < halfLootAmount) {
        // Övre delen

        const imageWidth = square.weapon.image.width;
        const finalImageWidth = (imageWidth / 20) * (2 / halfLootAmount);
        const startX = halfLootAmount > 1 ? 325 : 0;

        ctx.drawImage(
          drawChosenWeapon.image,
          square.x +
            (square.width / (halfLootAmount + 1)) * (i + 1) -
            finalImageWidth / 2,

          square.y + square.height / 2 - 125,
          finalImageWidth,
          finalImageWidth
        );

        drawText(square.weapon.name, weaponTextX, weaponTextY, "red");
      } else {
        // Undre delen
        const imageWidth = square.weapon.image.width;
        const finalImageWidth = (imageWidth / 20) * (2 / halfLootAmount);
        const startX = halfLootAmount > 1 ? 325 : 0;

        ctx.drawImage(
          drawChosenWeapon.image,
          square.x +
            (square.width / (otherHalfLootAmount + 1)) *
              (i - halfLootAmount + 1) -
            finalImageWidth / 2,
          square.y + square.height / 2 - 25,
          finalImageWidth,
          finalImageWidth
        );
      }
    }
  }
};
