import { ctx } from "./main.js";

export const drawCircle = (xPos, yPos, radius, color) => {
  ctx.beginPath();
  ctx.globalAlpha = 1;
  ctx.arc(xPos, yPos, radius, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
};
