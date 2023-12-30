import { Bodies, Body, Vector } from 'matter-js'
import { vectorFromAngle } from './math'

export const createGrenade = (spawnPos: Vector, direction, addGameObject) => {
  const grenadeRadius = 10
  const realSpawnPos = Vector.add(
    spawnPos,
    Vector.mult(direction, grenadeRadius),
  )

  const body = Bodies.circle(spawnPos.x, spawnPos.y, grenadeRadius, {})
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
          100,
          {
            isSensor: true,
            // isStatic: true,
            render: {
              opacity: 0.5,
            },
          },
        )

        addGameObject({ tag: 'explosion', body: explosionDetector })

        isExploded = true
      }
    },
  }
}
