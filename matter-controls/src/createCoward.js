import { Bodies, Vector } from 'matter-js'
import { applyForce } from './applyForce.js'
import { sum } from './math'
import { radiansToCartesian } from './radianstToCartesian'
import { random } from './random'
import { sprites } from './sprites'
import { setLookForward } from './setLookForward.js'
import { collisionCategories } from './collision.js'
import { closestPlayer } from './closestPlayer.js'
import { isCircle } from './isCircle.js'
import { getNeighbors } from './getNeighbors.js'

const engineStrength = 0.2
const turboStrengh = engineStrength * 5
export const cowardRadius = 25
export const createCoward = (players, getGameObjects, position, homePos) => {
  const body = Bodies.circle(position.x, position.y, cowardRadius, {
    mass: 100,
    frictionAir: 0.015,
    angle: random(0, 2 * Math.PI),
    render: {
      sprite: {
        texture: sprites.coward.texture,
        xScale: (2 * cowardRadius) / sprites.coward.width,
        yScale: (2 * cowardRadius) / sprites.coward.height,
      },
    },
    collisionFilter: {
      mask: ~collisionCategories.eBullets,
    },
  })
  applyForce(body, radiansToCartesian(random(0, 2 * Math.PI), random(0, 20)))
  return {
    body: body,
    update: () => {
      const player = closestPlayer(body.position, players)
      const dirToPlayer = Vector.normalise(
        Vector.sub(player.body.position, body.position),
      )
      const dirToHome = Vector.normalise(Vector.sub(homePos, body.position))

      const cowardBodies = getGameObjects()
        .filter((obj) => obj.type === 'coward')
        .map((obj) => obj.body)
        .filter((body) => body)
      const allBodies = getGameObjects()
        .filter((obj) => obj.type !== 'player')
        .map((obj) => obj.body)
        .filter((body) => body)
      const neighbors = getNeighbors(body, allBodies, 100)
      const cowardNeighbors = getNeighbors(body, cowardBodies, 100)

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

      const isTurboOn = isDistanceLessThan(
        player.body.position,
        body.position,
        300,
      )
      const forceMagnitude = isTurboOn ? turboStrengh : engineStrength

      const isClose = isDistanceLessThan(
        player.body.position,
        body.position,
        500,
      )

      const forceDir = Vector.normalise(
        sum(
          Vector.mult(dirToHome, 0.1),
          Vector.mult(neighborRepulsion, 1.3),
          Vector.mult(dirToPlayer, isClose ? -0.3 : 0),
        ),
      )
      const force = Vector.mult(forceDir, forceMagnitude)
      applyForce(body, force)
      setLookForward(body)
    },
    isBullet: true,
    health: 60,
    damage: 0,
    type: 'coward',
    points: 150,
  }
}

export const averageNeighborDirection = (neighbors) =>
  Vector.normalise(
    sum(...neighbors.map((neighbor) => Vector.normalise(neighbor.velocity))),
  )

/**
 * Whether the distance between two points `aPos` and `bPos` are greater than `distance`.
 * @param aPos
 * @param bPos
 * @param distance
 * @returns {boolean}
 */
export const isDistanceLessThan = (aPos, bPos, distance) =>
  Vector.magnitudeSquared(Vector.sub(aPos, bPos)) < distance * distance

export const distance = (aPos, bPos) => Vector.magnitude(Vector.sub(aPos, bPos))
export const distanceSquared = (aPos, bPos) =>
  Vector.magnitudeSquared(Vector.sub(aPos, bPos))

export const electricForce = (r1, r2, q1, q2) => {
  const r = Vector.sub(r1, r2)
  const rSquare = Vector.magnitudeSquared(r)
  if (rSquare === 0) {
    return Vector.create(0, 0)
  }
  return Vector.mult(Vector.normalise(r), (q1 * q2) / rSquare)
}

export const closestPointOnCircle = (pos, circlePos, radius) => {
  const r = Vector.sub(pos, circlePos)
  const dist = Vector.magnitude(r)
  if (dist < 0.0001) {
    return circlePos
  }
  return sum(circlePos, Vector.mult(r, radius / dist))
}
