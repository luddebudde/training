import { direction } from '../math'
import { Body, Vector } from 'matter-js'
export const applyThrust = (body: Body, thrust: number) => {
  Body.applyForce(body, body.position, Vector.mult(direction(body), thrust))
}
