import { Bodies, Vector } from 'matter-js'
import { room } from '../main'
import { applyForce } from './applyForce'
import { applyTorque } from './applyTorque'
import { radiansToCartesian } from './radianstToCartesian'
import { random } from './random'
import { sprites } from './sprites'
import { moveCameraTo } from '../moveCameraTo'
import { average } from './math'

import { distance } from './distance'

export const createCamera = () => {
  const averagePos = (ships) => {
    const livePlayers = ships.filter((player) => {
      return player.health > 0
    })
    return average(
      ...livePlayers.map((player) => {
        return player.body.position
      }),
    )
  }

  const body = Bodies.circle(0, 0, 10, {
    mass: 1,
    frictionAir: 1,
    render: {
      visible: false,
    },
    collisionFilter: { mask: 0 },
  })

  return {
    body: body,
    update: (game) => {
      const equilibriumPoint = averagePos([game.playerA, game.playerB])
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