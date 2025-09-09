import { visualWorld, visualWorldScale } from "../basics";

export const drawCircle = (ctx, entity) => {
  ctx.beginPath();
  ctx.arc(entity.pos.x / visualWorld.x, entity.pos.y/ visualWorld.y, entity.radius / visualWorldScale, 0, 2 * Math.PI);
  ctx.fillStyle = entity.color;
  ctx.fill();
};
