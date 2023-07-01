import { Vector } from 'matter-js'

export const sum = (...terms: Vector[]) =>
  terms.reduce((accumulation, term) => {
    accumulation.x += term.x
    accumulation.y += term.y
    return accumulation
  }, Vector.create(0, 0))

export const scale = (vector: Vector, scalar: number) =>
  Vector.mult(vector, scalar)

export const average = (...terms: Vector[]) =>
  terms.length > 0 ? Vector.div(sum(...terms), terms.length) : undefined

export const angleBetween = (angle1: number, angle2: number) =>
  180 - Math.abs(Math.abs(angle1 - angle2) - 180)
