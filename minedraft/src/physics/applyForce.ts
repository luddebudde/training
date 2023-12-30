import { Body, Vector } from 'matter-js'

export const applyForce = (body: Body, direction: Vector) =>
  Body.applyForce(body, body.position, direction)

export const applyImpulse = (body: Body, impulse: Vector, dt: number) =>
  applyForce(body, Vector.mult(impulse, 1 / dt))

export const applyImpulse2 = (body: Body, impulse: Vector) => {
  const oldInertia = Vector.mult(body.velocity, body.mass)
  const newInertia = Vector.add(oldInertia, impulse)
  const newVelocity = Vector.div(newInertia, body.mass)

  Body.setVelocity(body, newVelocity)

  // To do: handle zero and infinit mass
}
