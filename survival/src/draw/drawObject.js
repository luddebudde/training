export const drawObject = (ctx, moveCtx, object) => {
  ctx.beginPath();
  ctx.arc(
    object.pos.x + moveCtx.x,
    object.pos.y + moveCtx.y,
    object.radius,
    0,
    2 * Math.PI
  );
  ctx.fillStyle = object.color;
  ctx.fill();
};
