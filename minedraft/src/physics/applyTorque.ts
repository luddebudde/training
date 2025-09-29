import { Body, Vector } from 'matter-js'
import { down, left, right, up } from '../math'

export const applyTorque = (body: Body, torque: number) => {
  Body.applyForce(
    body,
    Vector.add(body.position, up),
    Vector.mult(left, torque),
  )
  Body.applyForce(
    body,
    Vector.add(body.position, down),
    Vector.mult(right, torque),
  )
}

export const applyAngularImpulse = (body: Body, torque: number, dt: number) => {
  applyTorque(body, torque / dt)
}
