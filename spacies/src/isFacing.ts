import { Body, Vector } from 'matter-js'
import { direction } from './direction'

export const isFacing = (self: Body, other: Body) => {
  return (
    Vector.dot(direction(self), Vector.sub(other.position, self.position)) > 0
  )
}
