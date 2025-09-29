export const drawArrow = (
  context: CanvasRenderingContext2D,
  fromx: number,
  fromy: number,
  tox: number,
  toy: number,
) => {
  var headlen = 10 // length of head in pixels
  var dx = tox - fromx
  var dy = toy - fromy
  var angle = Math.atan2(dy, dx)

  context.beginPath()
  context.moveTo(fromx, fromy)
  context.lineTo(tox, toy)
  context.lineTo(
    tox - headlen * Math.cos(angle - Math.PI / 6),
    toy - headlen * Math.sin(angle - Math.PI / 6),
  )
  context.moveTo(tox, toy)
  context.lineTo(
    tox - headlen * Math.cos(angle + Math.PI / 6),
    toy - headlen * Math.sin(angle + Math.PI / 6),
  )
  context.stroke()
}
