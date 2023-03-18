export const drawHealthBar = (canvas, x, y, width, height, health) => {
  const maxHealth = 200
  const ctx = canvas.getContext("2d");
  ctx.beginPath();
  ctx.rect(x, y, width, height);
  ctx.fillStyle = "red"
  ctx.fill()
  ctx.beginPath();
  ctx.rect(x, y, width * health / maxHealth, height)
  ctx.fillStyle = "green"
  ctx.fill()
}