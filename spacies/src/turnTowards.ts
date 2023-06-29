import { direction } from './direction'
import { Body, Vector } from 'matter-js'
import { applyTorque } from './applyTorque'
export const turnTowards = (self: Body, other: Body, factor = 1) => {
  const dirToOther = Vector.normalise(Vector.sub(other.position, self.position))
  const lookDir = direction(self)
  const torque = factor * Vector.cross(dirToOther, lookDir)
  applyTorque(self, torque)
}
