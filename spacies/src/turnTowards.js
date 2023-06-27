import { direction } from './direction'
import { Vector } from 'matter-js'
import { applyTorque } from './applyTorque'
export const turnTowards = (selfBody, otherBody, factor = 1) => {
  const dirToOther = Vector.normalise(
    Vector.sub(otherBody.position, selfBody.position),
  )
  const lookDir = direction(selfBody)
  const torque = factor * Vector.cross(dirToOther, lookDir)
  applyTorque(selfBody, torque)
}
