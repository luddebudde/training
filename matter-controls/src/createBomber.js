import {Bodies, Body, Vector} from "matter-js"
import {angle} from "./angle"
import {applyForceTo} from "./applyForceTo"
import {applyTorque} from "./applyTorque"
import {direction} from "./direction"
import {angleBetween, sum} from "./math"
import {radiansToCartesian} from "./radianstToCartesian"
import {random} from "./random"
import {sprites} from "./sprites"
import {left, right, up} from "./vectors"

const engineStrength = 5
const turboStrengh = engineStrength * 3
export const BomberRadius = 15
export const createBomber = (player, getGameObjects, position) => {
  const body = Bodies.circle(position.x, position.y, BomberRadius, {
    mass: 500,
    frictionAir: 0.1,
    angle: random(0, 2 * Math.PI),
    render: {
      sprite: {
        texture: sprites.bomber.texture,
        xScale: 2 * BomberRadius / sprites.bomber.width,
        yScale: 2 * BomberRadius / sprites.bomber.height,
      },
    },
  })
  applyForceTo(body, radiansToCartesian(random(0, 2 * Math.PI), random(0, 20)))
  return {
    body: body,
    update: () => {
      const dirToPlayer = Vector.normalise(Vector.sub(player.body.position, body.position))

      const allBodies = getGameObjects().map(obj => obj.body).filter(body => body)
      const neighbors = getNeighbors(body, allBodies, 100)

      const neighborRepulsion = sum(
        ...neighbors.map(neighbor => {
          const p = isCircle(neighbor) ? closestPointOnCircle(body.position, neighbor.position, neighbor.circleRadius) : neighbor.position
          return electricForce(neighbor.position, p, -neighbor.mass, 1)
        })
      )

      const neighborDirection = averageNeighborDirection(neighbors)

      const isTurboOn = isDistanceGreaterThan(player.body.position, body.position, 300)
      const forceMagnitude = isTurboOn ? turboStrengh : engineStrength

      const forceDir = Vector.normalise(
        sum(
          Vector.mult(neighborRepulsion, 0.5),
          Vector.mult(neighborDirection, 1),
          Vector.mult(dirToPlayer, 0.5),
        )
      )
      const force = Vector.mult(forceDir, forceMagnitude)
      applyForceTo(body, force)
      Body.setAngle(body, angle(body.velocity))
    },
    isBullet: true,
    health: 0,
    damage: 20,
    type: 'bomber',
  }

}

export const getNeighbors = (selfBody, bodies, neighborMaxDistance) => (
  bodies.filter(body => body !== selfBody && isDistanceGreaterThan(selfBody.position, isCircle(body) ? closestPointOnCircle(selfBody.position, body.position, body.circleRadius) : body.position, neighborMaxDistance))
)

export const averageNeighborDirection = (neighbors) => Vector.normalise(
  sum(
    ...neighbors.map(neighbor => Vector.normalise(neighbor.velocity))
  )
)

const isCircle = (body) => typeof body.circleRadius !== 'undefined'

/**
 * Whether the distance between two points `aPos` and `bPos` are greater than `distance`.
 * @param aPos
 * @param bPos
 * @param distance
 * @returns {boolean}
 */
export const isDistanceGreaterThan = (aPos, bPos, distance) =>
  Vector.magnitudeSquared(Vector.sub(aPos, bPos)) < distance * distance

export const electricForce = (r1, r2, q1, q2) => {
  const r = Vector.sub(r1, r2)
  const rSquare = Vector.magnitudeSquared(r)
  if (rSquare === 0) {
    return Vector.create(0, 0)
  }
  return Vector.mult(Vector.normalise(r), q1 * q2 / rSquare)
}

export const closestPointOnCircle = (pos, circlePos, radius) => {
  const r = Vector.sub(pos, circlePos)
  const dist = Vector.magnitude(r)
  if (dist < 0.0001) {
    return circlePos
  }
  return sum(circlePos, Vector.mult(r, radius / dist))
}