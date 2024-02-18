export const drawShieldbar = (ctx, x, y, width, height, health, maxHealth) => {
  ctx.beginPath();
  ctx.rect(x, y, width, height);
  ctx.fillStyle = "#38b000";
  ctx.fill();
  ctx.beginPath();
  ctx.rect(x, y, (width * Math.max(health, 0)) / maxHealth, height);
  ctx.fillStyle = "blue";
  ctx.fill();
};
