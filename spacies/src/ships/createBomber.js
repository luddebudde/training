import { Bodies, Vector } from 'matter-js'
import { applyForce } from '../physics'
import { sum, radiansToCartesian, closestPointOnCircle } from '../math'
import { random } from '../math'
import { sprites } from '../sprites'
import { setLookForward } from '../setLookForward'
import { collisionCategories } from '../collision'
import { closestPlayer } from '../closestPlayer'
import { isCircle } from '../isCircle'
import { getNeighbors } from '../getNeighbors'
import { isDistanceLessThan } from '../isDistanceLessThan'

const engineStrength = 0.5
const turboStrengh = engineStrength * 5
export const bomberRadius = 15
export const createBomber = (getPlayers, getGameObjects, position) => {
  const body = Bodies.circle(position.x, position.y, bomberRadius, {
    mass: 100,
    frictionAir: 0.1,
    angle: random(0, 2 * Math.PI),
    render: {
      sprite: {
        texture: sprites.bomber.texture,
        xScale: (2 * bomberRadius) / sprites.bomber.width,
        yScale: (2 * bomberRadius) / sprites.bomber.height,
      },
    },
    collisionFilter: {
      category: collisionCategories.bomber,
      mask: ~collisionCategories.bomber,
    },
  })
  applyForce(body, radiansToCartesian(random(0, 2 * Math.PI), random(0, 20)))
  return {
    body: body,
    update: () => {
      const player = closestPlayer(body.position, getPlayers())
      if (!player) {
        return
      }
      const dirToPlayer = Vector.normalise(
        Vector.sub(player.body.position, body.position),
      )

      const bomberBodies = getGameObjects()
        .filter((obj) => obj.type === 'bomber')
        .map((obj) => obj.body)
        .filter((body) => body)
      const allBodies = getGameObjects()
        .filter((obj) => obj.type !== 'player')
        .map((obj) => obj.body)
        .filter((body) => body)
      const neighbors = getNeighbors(body, allBodies, 100)
      const bomberNeighbors = getNeighbors(body, bomberBodies, 100)

      const neighborRepulsion = sum(
        ...neighbors.map((neighbor) => {
          const p = isCircle(neighbor)
            ? closestPointOnCircle(
                body.position,
                neighbor.position,
                neighbor.circleRadius,
              )
            : neighbor.position
          return electricForce(neighbor.position, p, -neighbor.mass, 1)
        }),
      )

      const neighborDirection = averageNeighborDirection(bomberNeighbors)

      const isTurboOn = isDistanceLessThan(
        player.body.position,
        body.position,
        300,
      )
      const forceMagnitude = isTurboOn ? turboStrengh : engineStrength

      const forceDir = Vector.normalise(
        sum(
          Vector.mult(neighborRepulsion, 1),
          Vector.mult(neighborDirection, 1),
          Vector.mult(dirToPlayer, 0.3),
        ),
      )
      const force = Vector.mult(forceDir, forceMagnitude)
      applyForce(body, force)
      setLookForward(body)
    },
    isBullet: true,
    health: 1,
    maxHealth: 1,
    damage: 20,
    type: 'bomber',
    points: 5,
  }
}

export const averageNeighborDirection = (neighbors) =>
  Vector.normalise(
    sum(...neighbors.map((neighbor) => Vector.normalise(neighbor.velocity))),
  )

export const electricForce = (r1, r2, q1, q2) => {
  const r = Vector.sub(r1, r2)
  const rSquare = Vector.magnitudeSquared(r)
  if (rSquare === 0) {
    return Vector.create(0, 0)
  }
  return Vector.mult(Vector.normalise(r), (q1 * q2) / rSquare)
}
