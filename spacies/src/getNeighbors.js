import { isCircle } from './isCircle'
import { closestPointOnCircle } from './createBomber'
import { isDistanceLessThan } from './isDistanceLessThan'

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
