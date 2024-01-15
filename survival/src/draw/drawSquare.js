import { ctx } from "../main.js";

export const drawSquare = (object) => {
  ctx.beginPath();
  ctx.rect(object.x, object.y, object.width, object.height);
  ctx.fillStyle = object.color;
  ctx.fill();
};
