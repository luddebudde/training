import { Body } from 'matter-js'
import { applyTorque } from './applyTorque'

export const applyAngularFriction = (body: Body, amplitude: number) => {
  applyTorque(body, amplitude * body.angularVelocity)
}
