"use strict";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");


const worldDim = {
  height: 500,
  width: 500,
};

const player = {
  dim: {
    height: 60,
    width: 60,
  },
  pos: {
    x: 50,
    y: 100,
  },
  vel: {
    x: 0,
    y: 0,
  },
  color: "black",
};


const enemy1 = {
  dim: {
    height: 100,
    width: 100,
  },
  pos: {
    x: 5,
    y: 10,
  },
  vel: {
    x: 5,
    y: 5,
  },
  color: "blue",
};

const enemy2 = {
  dim: {
    height: 100,
    width: 100,
  },
  pos: {
    x: 200,
    y: 200,
  },
  vel: {
    x: 5,
    y: 5,
  },
  color: "red",
};

// const sayHi = () => {
//     console.log("Hej!")
// }
// sayHi()s

const circles = [enemy1, enemy2, player]

const fps = 30;
const delay = 1000 / fps;

const i = setInterval(() => {
  circles.forEach((box) => {
    if (box.pos.y + box.dim.height > worldDim.height) {
      box.vel.y = -box.vel.y;
      box.pos.y = worldDim.height - box.dim.height
    }

    if (box.pos.y < 0) {
      box.vel.y = -box.vel.y;
      box.pos.y = 0
    }
    if (box.pos.x + box.dim.width > worldDim.width) {
      box.vel.x = -box.vel.x;
      box.pos.x = worldDim.width - box.dim.width
    }
    if (box.pos.x < 0) {
      box.vel.x = -box.vel.x;
      box.pos.x = 0
    }

    box.pos.y = box.pos.y + box.vel.y;
    box.pos.x = box.pos.x + box.vel.x;
  });

  ctx.beginPath();
  ctx.rect(0, 0, worldDim.width, worldDim.height);
  ctx.fillStyle = "white";
  ctx.fill();

  circles.forEach((box) => {
    ctx.beginPath();
    ctx.rect(box.pos.x, box.pos.y, box.dim.width, box.dim.height);
    ctx.fillStyle = box.color;
    ctx.fill(); 
  });
}, delay);

document.addEventListener(
  'keydown',
  (event)=>{
    console.log(event.key)
    if(event.key === "w"){
      player.vel.y = -15
      player.vel.x = 0
    }
    if(event.key === "s"){
      player.vel.y = 15
      player.vel.x = 0
    } 
    if(event.key === "a"){
      player.vel.x = -15
      player.vel.y = 0
    }
    if(event.key === "d"){
    player.vel.x = 15
    player.vel.y = 0
  }
  }
)

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }