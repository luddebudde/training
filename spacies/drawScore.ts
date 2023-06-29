export const drawScore = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  score: number,
) => {
  ctx.fillStyle = 'yellow'
  ctx.font = '48px serif'
  ctx.fillText(score.toString(), x, y)
}
