import { Body, Vector } from 'matter-js'

export const applyForce = (body: Body, direction: Vector) =>
  Body.applyForce(body, body.position, Vector.mult(direction, 0.1))
