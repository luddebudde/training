import { Vector } from 'matter-js'
import { angle } from './math'

export const drawOffScreenArrow = (
  ctx: CanvasRenderingContext2D,
  gamePosition: Vector,
  canvas: HTMLCanvasElement,
  cameraPos: Vector,
  color: string,
  size: number = 20,
) => {
  const halfSize = size / 2
  const arrowPos = Vector.create(
    Math.min(
      Math.max(gamePosition.x, cameraPos.x - canvas.width / 2 + size),
      cameraPos.x + canvas.width / 2 - size,
    ),
    Math.min(
      Math.max(gamePosition.y, cameraPos.y - canvas.height / 2 + size),
      cameraPos.y + canvas.height / 2 - size,
    ),
  )

  if (arrowPos.x === gamePosition.x && arrowPos.y === gamePosition.y) {
    return
  }

  const diff = Vector.sub(gamePosition, cameraPos)
  const scale = Math.max(Math.min(1000 / Vector.magnitude(diff), 1), 0.5)
  const cometAngle = angle(Vector.normalise(diff))

  ctx.fillStyle = color
  ctx.strokeStyle = 'white'
  ctx.translate(-cameraPos.x, -cameraPos.y)
  ctx.translate(canvas.width / 2, canvas.height / 2)
  ctx.translate(arrowPos.x, arrowPos.y)
  ctx.rotate(cometAngle)

  ctx.scale(scale, scale)
  ctx.beginPath()
  ctx.moveTo(-halfSize, -halfSize)
  ctx.lineTo(-halfSize, +halfSize)
  ctx.lineTo(+halfSize, 0)
  ctx.closePath()
  ctx.fill()
  ctx.lineWidth = 1
  ctx.stroke()

  ctx.setTransform(1, 0, 0, 1, 0, 0)
}
