import { createCanvasElement } from "three";
import { IronMark } from "./bank";
import { createSpeedButtons, xOffSetIncrease } from "./createButtons";
import { updateIronmarkText, updateMoneyText } from "./updateIronmarkText";
import { updateDayCounter } from "./updateDayCounter";
import { calculateStockIncrease } from "./calculateStockIncrease";
import {
  eventAdd,
  eventMult,
  printEventSelections,
  selectEvent,
} from "./events";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

ctx.translate(0, canvas.height); // Flyttar origo till botten av canvasen
ctx.scale(1, -1); // Inverterar y-axeln så att den går uppåt

export type Vector = {
  x: number;
  y: number;
};

export let points: Vector[] = [];

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

for (let i = 0; i < maxNodes; i++) {
  const point: Vector = {
    x: i * distance + 50,
    y: IronMark.currentValue,
  };
  points.push(point);
}

const drawGraph = () => {
  points.forEach((point, index) => {
    let previusPoint: Vector = {
      x: 0,
      y: 0,
    };

    // console.log("hihge");

    if (index !== 0) {
      previusPoint = points[index - 1];
    }

    // const xShift = index * distance;
    const xShift = point.x - xOffSet;

    ctx.beginPath();
    ctx.moveTo(previusPoint.x - xOffSet, previusPoint.y);
    ctx.lineTo(xShift, point.y);

    // Draw the Path
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(xShift, point.y, 10, 0, 2 * Math.PI);
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
    ctx.strokeStyle = "black";
  });
};

drawGraph();
// Reset
let speedButton = document.getElementById("resetPoint");
speedButton.onclick = () => {
  highestPoint = points[points.length - 1];
};

setTimeout(() => {
  createSpeedButtons();
  // for (let i = 0; i < 100; i++) {
  // selectEvent();
  // }
  // printEventSelections();
}, 100);

setInterval(() => {
  ctx.clearRect(0, 0, graphBox.width, graphBox.height);
  // selectEvent();
  if (xOffSet % distance < xOffSetIncrease) {
    updateDayCounter();

    const oldP = points[points.length - 1];

    // const point = calculateStockIncrease(IronMark);
    // points.push(point);
    const distanceToMiddle = graphBox.height / 2 - points[points.length - 1].y;

    const stability = IronMark.stability / 5;

    const point: Vector = {
      x: oldP.x + distance,
      // y: points[points.length - 1].y * (Math.random() + 0.6),
      // y: points[points.length - 1].y * (0.5 + stability + Math.random()),
      y:
        oldP.y -
        (0.5 - Math.random()) * 100 * IronMark.stability * eventMult +
        eventAdd,
    };

    if (point.y < 50) {
      point.y = 50;
    }

    if (point.y > highestPoint.y) {
      highestPoint = point;
    }

    // IronMark.currentValue = Math.round((graphBox.height - point.y) / 100);
    IronMark.currentValue = Math.round(point.y / 100);

    points.push(point);
  }

  xOffSet += xOffSetIncrease;

  if (points[0].x - xOffSet < 0) {
    points.shift();
  }

  updateIronmarkText();
  updateMoneyText();

  drawGraph();
}, 15);
