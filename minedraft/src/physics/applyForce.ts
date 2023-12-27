import { Body, Vector } from 'matter-js'

export const applyForce = (body: Body, direction: Vector) =>
  Body.applyForce(body, body.position, direction)

export const applyImpulse = (body: Body, impulse: Vector, dt: number) =>
  applyForce(body, Vector.mult(impulse, 1 / dt))
