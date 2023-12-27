import {Body, Vector} from 'matter-js'

export const direction = (body: Body): Vector => Vector.create(
  Math.cos(body.angle),
  Math.sin(body.angle),
)
