import { closestPointOnCircle, origo, scale } from '../math'
import { Body, Vector } from 'matter-js'
import { applyForce } from './applyForce'
import { isDistanceLessThan } from '../isDistanceLessThan'

export const applyGravitationalWellForce = (
  body: Body,
  radius: number,
  scalar: number,
) => {
  if (!isDistanceLessThan(body.position, origo, radius)) {
    applyForce(
      body,
      scale(
        Vector.sub(
          closestPointOnCircle(body.position, origo, radius),
          body.position,
        ),
        scalar,
      ),
    )
  }
}
