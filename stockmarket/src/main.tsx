const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

type Vector = {
  x: number;
  y: number;
};

let points: Vector[] = [];

const maxNodes = 20;

const world = {
  width: 4000,
  height: 2000,
};

let xOffSet = 0;
const distance = world.width / maxNodes;

for (let i = 0; i < maxNodes; i++) {
  const point: Vector = {
    x: i * distance + 50,
    y: Math.random() * 300,
  };
  points.push(point);
}

const drawPoints = () => {
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

    // console.log(point, previusPoint, index);
    //   console.log(points[index - 1]);
  });
};

drawPoints();

export let speedModifier = 1;
const standardxOffsetIncrease = 15;
let xOffSetIncrease = standardxOffsetIncrease * speedModifier;

{
  /* <body>worldDiv.setSpeedOne.onClick = () => {
  speedModifier = 3;
}; </body> */
}

let speedButton = document.getElementById("setSpeedOne");

speedButton.onclick = () => {
  speedModifier = 1;
  console.log("speeeeeeeeeeding", speedModifier);
  xOffSetIncrease = standardxOffsetIncrease * speedModifier;
};

speedButton = document.getElementById("setSpeedTwo");

speedButton.onclick = () => {
  speedModifier = 2;
  console.log("speeeeeeeeeeding", speedModifier);
  xOffSetIncrease = standardxOffsetIncrease * speedModifier;
};

speedButton = document.getElementById("setSpeedThree");

speedButton.onclick = () => {
  speedModifier = 3;
  console.log("speeeeeeeeeeding", speedModifier);
  xOffSetIncrease = standardxOffsetIncrease * speedModifier;
};

setInterval(() => {
  ctx.clearRect(0, 0, 5000, 4000);
  //   if (xOffSet % distance === 0) {
  if (xOffSet % distance < xOffSetIncrease) {
    const point: Vector = {
      x: points[points.length - 1].x + distance,
      //   x: points[0].x + world.width,
      y: points[points.length - 1].y * (Math.random() + 0.6),
    };

    points.push(point);
  }

  xOffSet += xOffSetIncrease;

  if (points.length > maxNodes + 1 || points[0].x < 0 - xOffSet) {
    points.shift();
  }

  drawPoints();
  //   console.log(points);
}, 15);
