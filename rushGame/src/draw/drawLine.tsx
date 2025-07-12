import { Vec2 } from "../math";

export const drawLine = (
  ctx,
  startPos: Vec2,
  endPos: Vec2,
  color = "black"
) => {
  ctx.beginPath();
  ctx.moveTo(startPos.x, startPos.y);
  ctx.lineTo(endPos.x, endPos.y);
  ctx.strokeStyle = color;
  ctx.stroke();
};
