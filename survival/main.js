import { makeDirection } from "./makeDirection";

const canvas = document.getElementById("theCanvas");
const ctx = canvas.getContext("2d");

world = {
  width: 2535,
  height: 1300,
};
const player = {
  pos: {
    x: world.width / 2,
    y: world.height / 2,
  },
  vel: {
    x: 0,
    y: 0,
  },
  speed: 1,
  radius: 40,
  color: "blue",
};

// const onMouseMove = (event) => {
//   const { clientX, clientY } = event;
//   console.log(clientX, clientY);

//   return {
//     clientX,
//     clientY,
//   };
// };

setInterval(() => {
  ctx.beginPath();
  ctx.globalAlpha = 1;
  ctx.clearRect(0, 0, world.width, world.height);
  ctx.fillStyle = "white";
  ctx.fill();

  makeDirection(player, mousePos);

  // mousePos = onMouseMove(mouse);

  player.pos.x += player.vel.x;
  player.pos.y += player.vel.y;

  ctx.beginPath();
  ctx.arc(clientX - 7.5, clientY - 7.5, 15, 0, 2 * Math.PI);
  ctx.fillStyle = player.color;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(player.pos.x, player.pos.y, player.radius, 0, 2 * Math.PI);
  ctx.fillStyle = player.color;
  ctx.fill();
}, 10);

document.addEventListener("mousemove", (event) => {
  return {
    const: (mousePos = {
      pos: {
        clientX: event,
        clientY: event,
      },
    }),
  };
});

document.addEventListener("keydown", (event) => {
  // Moment
  if (event.code === "KeyW") {
    player.vel.y -= player.speed;
  }
  if (event.code === "KeyA") {
    player.vel.x -= player.speed;
  }
  if (event.code === "KeyS") {
    player.vel.y += player.speed;
  }
  if (event.code === "KeyD") {
    player.vel.x += player.speed;
  }
});
