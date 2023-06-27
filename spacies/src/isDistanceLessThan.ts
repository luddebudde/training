import { Vector } from 'matter-js'

/**
 * Whether the distance between two points `aPos` and `bPos` are greater than `distance`.
 * @param aPos
 * @param bPos
 * @param distance
 * @returns {boolean}
 */
export const isDistanceLessThan = (aPos: Vector, bPos: Vector, distance: number) =>
  Vector.magnitudeSquared(Vector.sub(aPos, bPos)) < distance * distance
