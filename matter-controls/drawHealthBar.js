export const drawHealthBar = (ctx, x, y, width, height, health, maxHealth) => {
  ctx.beginPath()
  ctx.rect(x, y, width, height)
  ctx.fillStyle = 'red'
  ctx.fill()
  ctx.beginPath()
  ctx.rect(x, y, (width * health) / maxHealth, height)
  ctx.fillStyle = 'green'
  ctx.fill()
}
