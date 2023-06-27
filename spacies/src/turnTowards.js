import { direction } from './direction.js'
import { Vector } from 'matter-js'
import { applyTorque } from './applyTorque.js'
export const turnTowards = (selfBody, otherBody, factor = 1) => {
  const dirToOther = Vector.normalise(
    Vector.sub(otherBody.position, selfBody.position),
  )
  const lookDir = direction(selfBody)
  const torque = factor * Vector.cross(dirToOther, lookDir)
  applyTorque(selfBody, torque)
}
