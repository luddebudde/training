export const drawCircle = (ctx, entity) => {
  ctx.beginPath();
  ctx.arc(entity.pos.x, entity.pos.y, entity.radius, 0, 2 * Math.PI);
  ctx.fillStyle = entity.color;
  ctx.fill();
};
