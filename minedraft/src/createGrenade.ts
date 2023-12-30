import { Bodies, Body, Vector } from 'matter-js'
import { vectorFromAngle } from './math'
import { matterJsSprite } from './main'
import { sprites } from './sprites'
import { playBang } from './sounds'

export const createGrenade = (spawnPos: Vector, direction, addGameObject) => {
  const grenadeRadius = 15
  const realSpawnPos = Vector.add(
    spawnPos,
    Vector.mult(direction, grenadeRadius),
  )

  const body = Bodies.circle(spawnPos.x, spawnPos.y, grenadeRadius, {
    render: {
      sprite: matterJsSprite(grenadeRadius, sprites.grenadeRed),
    },
  })
  Body.setVelocity(body, Vector.mult(direction, 30))

  let isExploded = false
  let timeSinceCreation = 0

  const explosionDelay = 3000

  return {
    tag: 'grenade',
    body,

    update: (dt: number) => {
      timeSinceCreation += dt
      if (timeSinceCreation >= explosionDelay && !isExploded) {
        const explosionDetector = Bodies.circle(
          body.position.x,
          body.position.y,
          500,
          {
            isSensor: true,
            // isStatic: true,
            render: {
              opacity: 0.5,
            },
          },
        )

        addGameObject({
          tag: 'explosion',
          body: explosionDetector,
          source: body,
        })

        isExploded = true
        playBang()
      }
    },
  }
}
