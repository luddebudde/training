export const drawScore = (canvas, x, y, score) => {
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = 'yellow'
  ctx.font = "48px serif";
  ctx.fillText(score, x, y);
}