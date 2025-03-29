export const drawSquare = (ctx, square) => {
  // ctx.save();
  // ctx.translate(square.x + square.width / 2, square.y + square.height / 2);
  // ctx.rotate(square.rotation * Math.PI);

  ctx.beginPath();
  ctx.rect(-square.width / 2, -square.height / 2, square.width, square.height);
  ctx.fillStyle = "purple";
  ctx.fill();

  // ctx.restore();
};
