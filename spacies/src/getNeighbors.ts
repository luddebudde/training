import { isCircle } from './isCircle'
import { closestPointOnCircle } from './math'
import { isDistanceLessThan } from './isDistanceLessThan'
import { Body } from 'matter-js'

export const getNeighbors = (self: Body, bodies: Body[], neighborMaxDistance: number) =>
  bodies.filter(
    (body) =>
      body !== self &&
      isDistanceLessThan(
        self.position,
        isCircle(body)
          ? closestPointOnCircle(
              self.position,
              body.position,
              body.circleRadius,
            )
          : body.position,
        neighborMaxDistance,
      ),
  )
