import { createCanvasElement } from "three";
import { IronMark } from "./bank";
import { createSpeedButtons, xOffSetIncrease } from "./createSpeedButtons";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

type Vector = {
  x: number;
  y: number;
};

let points: Vector[] = [];

const maxNodes = 20;

const graphBox = {
  width: canvas.clientWidth,
  height: canvas.clientHeight,
};

console.log(graphBox);

let xOffSet = 0;
const distance = graphBox.width / maxNodes;

export let highestPoint: Vector = {
  x: 100000,
  y: 100000,
};

for (let i = 0; i < maxNodes; i++) {
  const point: Vector = {
    x: i * distance + 50,
    y: graphBox.height - IronMark.currentValue,
  };
  points.push(point);
}

const drawGraph = () => {
  points.forEach((point, index) => {
    let previusPoint: Vector = {
      x: 0,
      y: 0,
    };

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
    ctx.strokeStyle = "black";
  });
};

drawGraph();
// Reset
let speedButton = document.getElementById("resetPoint");
speedButton.onclick = () => {
  highestPoint = points[points.length - 1];
  console.log("his");
};

const ironmarkElement = document.getElementById("ironmark");

// Lägg till värdet direkt efter texten
ironmarkElement.textContent += ` ${IronMark.currentValue}`;

// Skapa en lista för att lägga till poster under "Ironmark"
const subList = document.createElement("ul");
ironmarkElement.appendChild(subList);

function updateIronmarkText() {
  ironmarkElement.textContent = `Ironmark ${Math.round(
    graphBox.height - IronMark.currentValue
  )}`;

  for (const [key, value] of Object.entries(IronMark)) {
    const listItem = document.createElement("li");
    listItem.textContent = `${key}: ${value}`;
    // subList.appendChild(listItem);
    console.log("key:", key, "value:", value);
  }

  // Lägg till listan tillbaka (eftersom `textContent` rensar innehållet)
  ironmarkElement.appendChild(subList);
  updateSubList();
}

function updateSubList() {
  subList.innerHTML = ""; // Rensa tidigare lista
  for (const [key, value] of Object.entries(IronMark)) {
    const listItem = document.createElement("li");
    listItem.textContent = `${key}: ${Math.round(value)}`;
    subList.appendChild(listItem);
    console.log("key:", key, "value:", value);
  }
}

for (const [key, value] of Object.entries(IronMark)) {
  const listItem = document.createElement("li");
  listItem.textContent = `${key}: ${value}`;
  subList.appendChild(listItem);
  console.log("key:", key, "value:", value);
}

setTimeout(() => {
  createSpeedButtons();
}, 100);

setInterval(() => {
  ctx.clearRect(0, 0, graphBox.width, graphBox.height);
  if (xOffSet % distance < xOffSetIncrease) {
    const point: Vector = {
      x: points[points.length - 1].x + distance,
      y: points[points.length - 1].y * (Math.random() + 0.6),
    };

    if (point.y < highestPoint.y) {
      highestPoint = point;
    }

    if (point.y > graphBox.height) {
      point.y = graphBox.height - 50;
    }

    IronMark.currentValue = graphBox.height - point.y;

    points.push(point);
  }

  xOffSet += xOffSetIncrease;

  if (points[0].x - xOffSet < 0) {
    points.shift();
  }

  updateIronmarkText();

  drawGraph();
}, 15);
