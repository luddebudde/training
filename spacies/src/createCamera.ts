import { Bodies, Body, Vector } from 'matter-js'
import { applyForce } from './physics'
import { average } from './math'

import { distance } from './distance'

type Player = {
  health: number
  body: Body
}

export const createCamera = () => {
  const averagePos = (players: Player[]) => {
    const livePlayers = players.filter((player: Player) => {
      return player.health > 0
    })
    return average(
      ...livePlayers.map((player: Player) => {
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
