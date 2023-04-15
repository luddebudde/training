import { Bodies, Body, Vector } from 'matter-js'
import { throttle } from 'throttle-debounce'
import { direction } from './direction'
import { ebullet } from './eBullet'
import { sprites } from './sprites'
import { turnTowards } from './turnTowards.js'
import { applyThrust } from './applyThrust.js'
import { closestPlayer } from './closestPlayer.js'
import { collisionCategories } from './collision.js'

import { isDistanceLessThan } from './isDistanceLessThan.js'

export const engineStrength = 3
export const enemyRadius = 80
const torque = 0.3
const fireDist = 700
export const createB2 = (getPlayers, addObject, position) => {
  const body = Bodies.circle(position.x, position.y, enemyRadius, {
    mass: 5000,
    frictionAir: 0.05,
    render: {
      sprite: {
        texture: sprites.b2.texture,
        xScale: (2 * enemyRadius) / sprites.b2.width,
        yScale: (2 * enemyRadius) / sprites.b2.height,
      },
    },
    collisionFilter: {
      mask: collisionCategories.bullets,
    },
  })
  const gunPosition = () => {
    return Vector.add(
      body.position,
      Vector.mult(direction(body), enemyRadius * 1.1),
    )
  }
  const fire = throttle(
    100,
    () => {
      const newEBullet = ebullet(gunPosition(), direction(body), 8.5, 35, 15)
      addObject(newEBullet)
      const audio = new Audio('audio/enemy-rifle.mp3')
      audio.play()
    },
    {
      noTrailing: true,
    },
  )
  return {
    body: body,
    update: () => {
      const player = closestPlayer(body.position, getPlayers())
      if (!player) {
        return
      }
      turnTowards(body, player.body, torque)
      applyThrust(body, engineStrength)

      const projection = Vector.dot(
        direction(body),
        Vector.normalise(Vector.sub(player.body.position, body.position)),
      )
      const isFacing = projection > 0.8

      const isClose = isDistanceLessThan(
        body.position,
        player.body.position,
        fireDist,
      )
      if (isClose && isFacing) {
        fire()
      }
    },
    health: 200,
    maxHealth: 200,
    points: 300,
  }
}
