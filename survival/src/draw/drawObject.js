export const drawObject = (ctx, object) => {
  ctx.beginPath();
  ctx.arc(object.pos.x, object.pos.y, object.radius, 0, 2 * Math.PI);
  ctx.fillStyle = object.color;
  ctx.fill();
};
