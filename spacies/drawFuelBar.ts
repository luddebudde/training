export const drawFuelBar = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  fuel: number,
  maxHealth: number,
) => {
  ctx.beginPath()
  ctx.rect(x, y, width * 0.9, height)
  ctx.fillStyle = '#fd151b'
  ctx.fill()
  ctx.beginPath()
  ctx.rect(x, y, (width * Math.max(fuel, 0) * 0.9) / maxHealth, height)
  ctx.fillStyle = 'yellow'
  ctx.fill()
}
