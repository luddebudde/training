import { Vec2 } from "../math";

export const drawSquare = (ctx, square) => {
  ctx.beginPath();
  ctx.rect(square.x, square.y, square.width, square.height);
  ctx.fillStyle = square.color;
  ctx.fill();
};
