export const drawHealthBar = (ctx, x, y, width, height, health, maxHealth) => {
  ctx.beginPath()
  ctx.rect(x, y, width, height)
  ctx.fillStyle = 'red'
  ctx.fill()
  ctx.beginPath()
  ctx.rect(x, y, (width * Math.max(health, 0)) / maxHealth, height)
  ctx.fillStyle = 'green'
  ctx.fill()
}
