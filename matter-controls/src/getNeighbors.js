import { isCircle } from './isCircle.js'
import { closestPointOnCircle } from './createBomber.js'
import { isDistanceLessThan } from './isDistanceLessThan.js'

export const getNeighbors = (selfBody, bodies, neighborMaxDistance) =>
  bodies.filter(
    (body) =>
      body !== selfBody &&
      isDistanceLessThan(
        selfBody.position,
        isCircle(body)
          ? closestPointOnCircle(
              selfBody.position,
              body.position,
              body.circleRadius,
            )
          : body.position,
        neighborMaxDistance,
      ),
  )
