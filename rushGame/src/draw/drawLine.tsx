import { visualWorld } from "../basics";
import { Vec2 } from "../math";

export const drawLine = (
  ctx,
  startPos: Vec2,
  endPos: Vec2,
  color = "black"
) => {
  ctx.beginPath();
  ctx.moveTo(startPos.x/ visualWorld.x, startPos.y/ visualWorld.y);
  ctx.lineTo(endPos.x/ visualWorld.x, endPos.y/ visualWorld.y);
  ctx.strokeStyle = color;
  ctx.stroke();
};
