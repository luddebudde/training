export const drawSquare = (ctx, rect) => {
  // ctx.save();
  // ctx.translate(square.x + square.width / 2, square.y + square.height / 2);
  // ctx.rotate(square.rotation * Math.PI);

  // ctx.beginPath();
  // ctx.rect(-square.width / 2, -square.height / 2, square.width, square.height);
  // ctx.fillStyle = "purple";
  // ctx.fill();

  // ctx.restore();

  ctx.save();
  ctx.translate(rect.x + rect.width / 2, rect.y + rect.height / 2);
  ctx.rotate(-rect.rotation); // Rotation i radianer, utan att multiplicera med Math.PI / 180

  ctx.beginPath();
  ctx.rect(-rect.width / 2, -rect.height / 2, rect.width, rect.height);
  ctx.fillStyle = rect.color;
  ctx.fill();

  ctx.restore();
};
