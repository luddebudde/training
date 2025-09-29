export const drawShieldbar = (ctx, x, y, width, height, shield, maxShield) => {
  ctx.beginPath();
  ctx.rect(x, y, width, height);
  ctx.fillStyle = "#38b000";
  ctx.fill();
  ctx.beginPath();
  ctx.rect(x, y, (width * Math.max(shield, 0)) / maxShield, height);
  ctx.fillStyle = "blue";
  ctx.fill();
};
