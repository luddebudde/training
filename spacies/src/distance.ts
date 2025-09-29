import { Vector } from 'matter-js'

export const distance = (aPos: Vector, bPos: Vector) =>
  Vector.magnitude(Vector.sub(aPos, bPos))
export const distanceSquared = (aPos: Vector, bPos: Vector) =>
  Vector.magnitudeSquared(Vector.sub(aPos, bPos))
export const distanceToCircle = (
  thisPos: Vector,
  cirlcePos: Vector,
  radius: number,
) => Vector.magnitude(Vector.sub(thisPos, cirlcePos)) - radius
