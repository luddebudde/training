import { createCanvasElement } from "three";
import {
  allCurrencies,
  bankAccount,
  Cryptalon,
  currencies,
  IronMark,
  modifiers,
} from "./bank";
import { updateUI } from "./stockSell";
import { createSpeedButtons, xOffSetIncrease } from "./createButtons";
import { updateIronmarkText } from "./updateIronmarkText";
import { updateDayCounter } from "./updateDayCounter";
import { calculateStockIncrease } from "./calculateStockIncrease";
import {
  eventAdd,
  eventMult,
  printEventSelections,
  selectEvent,
} from "./events";
import { minStockValueAdd } from "./upgrades";
import { PointToPointConstraint } from "cannon";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

ctx.translate(0, canvas.clientHeight); // Flyttar origo till botten av canvasen
ctx.scale(1, -1); // Inverterar y-axeln så att den går uppåt

export type Vector = {
  x: number;
  y: number;
};

export let points = [[]];
const pointsColor = ["black", "blue"];

const maxNodes = 20;

export const graphBox = {
  width: canvas.clientWidth,
  height: canvas.clientHeight,
};

console.log(graphBox);

let xOffSet = 0;
export const distance = graphBox.width / maxNodes;

export let highestPoint: Vector = {
  x: 0,
  y: 0,
};

// points.forEach((pointArray, index) => {
//   console.log(points);

//   // if (currencies === undefined) {
//   //   return;
//   // }
//   // console.log(currencies);

//   // const currentCurrency = currencies[index];
//   for (let i = 0; i < maxNodes; i++) {
//     const point: Vector = {
//       x: i * distance + 50,
//       y: 50,
//     };
//     pointArray.push(point);
//   }
//   // console.log(points);
// });

const drawGraph = () => {
  points.forEach((pointsArray, arrayIndex) => {
    // console.log(points);

    pointsArray.forEach((point, index) => {
      let previusPoint: Vector = {
        x: 0,
        y: 0,
      };

      // console.log("hihge");

      if (index !== 0) {
        previusPoint = pointsArray[index - 1];
      }

      // const xShift = index * distance;
      const xShift = point.x - xOffSet;

      const lineColor = pointsColor[arrayIndex];

      // Line Between Points
      ctx.beginPath();
      ctx.moveTo(previusPoint.x - xOffSet, previusPoint.y);
      ctx.lineTo(xShift, point.y);
      ctx.strokeStyle = lineColor;
      ctx.stroke();

      // console.log(lineColor);

      // Circle
      ctx.beginPath();
      ctx.arc(xShift, point.y, 10, 0, 2 * Math.PI);
      ctx.fillStyle = lineColor;
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(0, highestPoint.y);
      ctx.lineTo(graphBox.width, highestPoint.y);
      ctx.strokeStyle = "red";

      // Draw the Path
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, 10);
      ctx.lineTo(graphBox.width, 10);
      ctx.strokeStyle = "green";

      // Draw the Path
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, minStockValueAdd);
      ctx.lineTo(graphBox.width, minStockValueAdd);
      ctx.strokeStyle = "purple";

      // Draw the Path
      ctx.stroke();
      ctx.strokeStyle = "black";
    });
  });
};

drawGraph();
// Reset
let speedButton = document.getElementById("resetPoint");
speedButton.onclick = () => {
  highestPoint = points[points.length - 1];
};

export const pushCurrency = () => {
  const newCurrency = allCurrencies[currencies.length];

  console.log(newCurrency);

  const point: Vector = {
    x: 100 + 50,
    y: 50,
  };

  currencies.push(newCurrency);
  points.push([point]);

  // updateUI(currencies);
};

let updateButtons;

pushCurrency();

points.forEach((pointArray, index) => {
  console.log(points);

  // if (currencies === undefined) {
  //   return;
  // }
  // console.log(currencies);

  // const currentCurrency = currencies[index];
  for (let i = 0; i < maxNodes; i++) {
    const point: Vector = {
      x: i * distance + 50,
      y: 50,
    };
    pointArray.push(point);
  }
  // console.log(points);
});

setTimeout(() => {
  createSpeedButtons();
  // for (let i = 0; i < 100; i++) {
  // selectEvent();
  // }
  // printEventSelections();
  updateButtons = () => {
    updateIronmarkText();
    // updateMoneyText();

    // Money
    const moneyElement = document.getElementById("bank");
    moneyElement.textContent = `MONEY: ${bankAccount.value}`;

    // Sell
    const sellElement = document.getElementById("sellMax");
    sellElement.textContent = `SELL: ${Math.round(
      IronMark.owned * IronMark.currentValue * modifiers.taxes
    )}$`;

    // Buy
    const buyElement = document.getElementById("buyMax");
    buyElement.textContent = `BUY: ${Math.floor(
      bankAccount.value / IronMark.currentValue
    )}st`;
  };
}, 5);

setInterval(() => {
  ctx.clearRect(0, 0, graphBox.width, graphBox.height);
  // selectEvent();

  xOffSet += xOffSetIncrease;
  points.forEach((pointArray, index) => {
    if (xOffSet % distance < xOffSetIncrease) {
      updateDayCounter();
      const oldP = pointArray[pointArray.length - 1];

      const currentCurrency = currencies[index];
      const middleP = currentCurrency.middlePoint;
      const distToMiddle = middleP - oldP.y;
      const strenghtToMiddle = currentCurrency.strenghtToMiddle;

      const point: Vector = {
        x: oldP.x + distance,
        y:
          oldP.y -
          (0.5 - Math.random()) * 100 * IronMark.stability * eventMult +
          eventAdd,
        //  +
        // distToMiddle * strenghtToMiddle,
      };

      // console.log(point.y);

      const lowestValue = currentCurrency.lowestPoint + minStockValueAdd;

      // console.log(lowestValue);

      if (point.y < lowestValue) {
        point.y = lowestValue;
      }

      if (point.y > graphBox.height - 50) {
        point.y = graphBox.height - 50;
      }

      if (point.y > highestPoint.y) {
        highestPoint = point;
      }

      currentCurrency.currentValue = point.y / 10;

      pointArray.push(point);
    }

    if (pointArray[0].x - xOffSet < 0) {
      pointArray.shift();
    }
  });

  // updateIronmarkText();
  // updateMoneyText();
  updateButtons();
  // updateIronmarkText();
  drawGraph();
  updateUI(currencies);
}, 15);
