import { Vector } from 'matter-js'

export const distance = (aPos, bPos) => Vector.magnitude(Vector.sub(aPos, bPos))
export const distanceSquared = (aPos, bPos) =>
  Vector.magnitudeSquared(Vector.sub(aPos, bPos))
