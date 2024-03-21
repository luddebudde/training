import { ctx } from "../main.js";
import { squareSizeMultipler } from "../world.js";

export const drawXpBar = (x, y, width, height, health, maxHealth) => {
  const newHeight = height * squareSizeMultipler.y;

  ctx.beginPath();
  ctx.rect(x, y, width, newHeight);
  ctx.fillStyle = "red";
  ctx.fill();
  ctx.beginPath();
  ctx.rect(x, y, (width * Math.max(health, 0)) / maxHealth, newHeight);
  ctx.fillStyle = "#11ff11";
  ctx.fill();
};
