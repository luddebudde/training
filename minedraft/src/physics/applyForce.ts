import { Body, Vector } from 'matter-js'

export const applyForce = (body: Body, direction: Vector) =>
  Body.applyForce(body, body.position, Vector.mult(direction, 0.1))

export const applyImpulse = (body: Body, impulse: Vector, dt: number) =>
  Body.applyForce(body, body.position, Vector.mult(impulse, 1 / dt))
