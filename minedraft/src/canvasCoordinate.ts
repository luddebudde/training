import { sum } from './math'
import { Vector } from 'matter-js'

export const canvasCoordinate = (
  position: Vector,
  cameraPosition: Vector,
  canvas: HTMLCanvasElement,
) =>
  sum(
    position,
    Vector.neg(cameraPosition),
    Vector.create(canvas.width / 2, canvas.height / 2),
  )
