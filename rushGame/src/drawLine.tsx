import { Vec2 } from "./math";

export const drawLineBetween = (ctx, startPos: Vec2, endPos: Vec2) => {
  ctx.beginPath();
  ctx.moveTo(startPos.x, startPos.y);
  ctx.lineTo(endPos.x, endPos.y);
  ctx.stroke();
};
