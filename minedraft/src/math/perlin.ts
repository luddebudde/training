import { zeros2 } from './zeros.ts'
import { randomUnitVector } from './random.ts'
import { Vector } from 'matter-js'
import { mapMat } from './matrix.ts'

export const perlin = (
  width: number,
  height: number,
  gridColumns: number,
  gridRows: number,
) => {
  const gridWidth = width / gridColumns
  const gridHeight = height / gridRows
  const gradients = mapMat(
    zeros2(gridColumns + 1, gridRows + 1),
    randomUnitVector,
    // randomVectorOf4,
  )
  const step2 = mapMat(zeros2(width, height), (_, x, y) => {
    const gridLeftColumn = Math.floor(x / gridWidth)
    const gridRightColum = gridLeftColumn + 1
    const gridTopRow = Math.floor(y / gridHeight)
    const gridBottomRow = gridTopRow + 1

    const gradientTopLeft = gradients[gridLeftColumn][gridTopRow]
    const gradientTopRight = gradients[gridRightColum][gridTopRow]
    const gradientBottomLeft = gradients[gridLeftColumn][gridBottomRow]
    const gradientBottomRight = gradients[gridRightColum][gridBottomRow]

    // Coordinates relative to the square top-left corner; a value between 0 and 1
    const xf = x / gridWidth - gridLeftColumn
    const yf = y / gridHeight - gridTopRow
    const n = Vector.normalise
    // const n = (it) => it
    const dirTopLeft = n(Vector.create(xf, yf))
    const dirTopRight = n(Vector.create(xf - 1, yf))
    const dirBottomLeft = n(Vector.create(xf, yf - 1))
    const dirBottomRight = n(Vector.create(xf - 1, yf - 1))

    const dotTopLeft = Vector.dot(gradientTopLeft, dirTopLeft)
    const dotTopRight = Vector.dot(gradientTopRight, dirTopRight)
    const dotBottomLeft = Vector.dot(gradientBottomLeft, dirBottomLeft)
    const dotBottomRight = Vector.dot(gradientBottomRight, dirBottomRight)

    const u = fade(xf)
    const v = fade(yf)
    // Fade interpolation
    return linearInterpolation(
      u,
      linearInterpolation(v, dotTopLeft, dotBottomLeft),
      linearInterpolation(v, dotTopRight, dotBottomRight),
    )
  })
  return step2
}
const linearInterpolation = (t: number, a1: number, a2: number): number =>
  a1 + t * (a2 - a1)

/**
 * Smooth step between 0 and 1
 * @param t a value between 0 and 1
 */
const fade = (t: number): number => ((6 * t - 15) * t + 10) * t * t * t
