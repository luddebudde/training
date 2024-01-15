import { ctx, player } from "../main.js";
import { world } from "../world.js";

export const drawText = (text, x, y, color) => {
  // const ctx = document.getElementById("canvas").getContext("2d");
  ctx.font = "48px serif";
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
};
