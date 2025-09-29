import { Body } from 'matter-js'
import { applyTorque } from './applyTorque'

export const applySpringTorque = (body: Body) => {
  const torque = 0.5 * body.angle
  applyTorque(body, torque)
}
