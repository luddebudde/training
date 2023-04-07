import { Bodies, Vector } from 'matter-js'
import { room } from '../main.js'
import { applyForce } from './applyForce.js'
import { applyTorque } from './applyTorque'
import { radiansToCartesian } from './radianstToCartesian.js'
import { random } from './random.js'
import { sprites } from './sprites.js'
import { moveCameraTo } from '../moveCameraTo.js'
import { average } from './math.js'

import { distance } from './distance.js'

export const createCamera = (players) => {
  const averagePos = () => {
    const livePlayers = players.filter((player) => {
      return player.health > 0
    })
    return average(
      ...livePlayers.map((player) => {
        return player.body.position
      }),
    )
  }

  const body = Bodies.circle(averagePos().x, averagePos().y, 10, {
    mass: 1,
    frictionAir: 1,
    render: {
      visible: false,
    },
    collisionFilter: { mask: 0 },
  })
  applyTorque(body, 1)
  applyForce(body, radiansToCartesian(random(0, 2 * Math.PI), random(0, 20)))

  return {
    body: body,
    update: () => {
      const equilibriumPoint = averagePos()
      if (equilibriumPoint !== undefined) {
        const force = Vector.mult(
          Vector.normalise(Vector.sub(equilibriumPoint, body.position)),
          0.004 * distance(equilibriumPoint, body.position),
        )
        applyForce(body, force)
      }
    },
  }
}
