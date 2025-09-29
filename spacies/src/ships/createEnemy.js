import { Bodies, Vector } from 'matter-js'
import { throttle } from 'throttle-debounce'
import { direction } from '../math'
import { ebullet } from '../eBullet'
import { sprites } from '../sprites'
import { turnTowards } from '../physics'
import { applyThrust } from '../physics'
import { isFacing } from '../isFacing'
import { closestPlayer } from '../closestPlayer'

export const engineStrength = 0.3
export const enemyRadius = 45
export const createEnemy = (getPlayers, addObject, position) => {
  const body = Bodies.circle(position.x, position.y, enemyRadius, {
    mass: 500,
    frictionAir: 0.05,
    render: {
      sprite: {
        texture: sprites.enemy.texture,
        xScale: (2 * enemyRadius) / sprites.enemy.width,
        yScale: (2 * enemyRadius) / sprites.enemy.height,
      },
    },
  })
  const gunPosition = () => {
    return Vector.add(
      body.position,
      Vector.mult(direction(body), enemyRadius * 1.1),
    )
  }
  const fire = throttle(
    1000,
    () => {
      const newEBullet = ebullet(gunPosition(), direction(body), 10, 15, 10)
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
      turnTowards(body, player.body, 0.1)

      if (
        Vector.magnitude(Vector.sub(player.body.position, body.position)) < 500
      ) {
        fire()
      } else if (isFacing(body, player.body)) {
        applyThrust(body, engineStrength)
      }
    },
    health: 40,
    maxHealth: 40,
    points: 50,
  }
}
