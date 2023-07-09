import { ctx } from "./main.js";
import { blackhole } from "./blackhole.js";

export const drawBlackhole = () => {
  ctx.beginPath();
  ctx.globalAlpha = 1;
  ctx.arc(blackhole.xPos, blackhole.yPos, blackhole.radius, 0, 2 * Math.PI);
  ctx.fillStyle = "black";
  ctx.fill();
};
