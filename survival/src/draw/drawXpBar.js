import { ctx } from "../main.js";

export const drawXpBar = (x, y, width, height, health, maxHealth) => {
  ctx.beginPath();
  ctx.rect(x, y, width, height);
  ctx.fillStyle = "red";
  ctx.fill();
  ctx.beginPath();
  ctx.rect(x, y, (width * Math.max(health, 0)) / maxHealth, height);
  ctx.fillStyle = "#11ff11";
  ctx.fill();
};
