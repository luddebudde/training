export const drawHealthBar = (
  ctx,
  x,
  y,
  width,
  height,
  health,
  maxHealth,
  options = {}
) => {
  const { emptyColor = "#fd151b", filledColor = "#38b000" } = options;

  ctx.beginPath();
  ctx.rect(x, y, width, height);
  ctx.fillStyle = emptyColor;
  ctx.fill();
  ctx.beginPath();
  ctx.rect(x, y, (width * Math.max(health, 0)) / maxHealth, height);
  ctx.fillStyle = filledColor;
  ctx.fill();
};
