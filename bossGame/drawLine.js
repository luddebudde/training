import { ctx } from "./main.js";

export const drawLine = (startPosX, startPosY, endPosX, endPosY) => {
  ctx.beginPath();
  ctx.moveTo(startPosX, startPosY);
  ctx.lineTo(endPosX, endPosY);
  ctx.stroke();
};
