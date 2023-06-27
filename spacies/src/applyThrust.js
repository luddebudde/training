import { direction } from './direction'
import { Body, Vector } from 'matter-js'
export const applyThrust = (body, thrust) => {
  Body.applyForce(body, body.position, Vector.mult(direction(body), thrust))
}
