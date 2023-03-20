import { Vector } from 'matter-js'
import { direction } from './direction.js'

export const isFacing = (selfBody, otherBody) => {
  return (
    Vector.dot(
      direction(selfBody),
      Vector.sub(otherBody.position, selfBody.position),
    ) > 0
  )
}
