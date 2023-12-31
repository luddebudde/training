import { Bodies, Body, Vector } from 'matter-js'
import { vectorFromAngle } from './math'
import { matterJsSprite } from './main'
import { sprites } from './sprites'
import { playBang } from './sounds'
import { animation } from './animation'
import { assets } from './assets'

export const createGrenade = (spawnPos: Vector, direction, addGameObject) => {
  const grenadeRadius = 15
  const realSpawnPos = Vector.add(
    spawnPos,
    Vector.mult(direction, grenadeRadius),
  )
  const explosionRadius = 100

  const body = Bodies.circle(spawnPos.x, spawnPos.y, grenadeRadius, {
    render: {
      sprite: matterJsSprite(grenadeRadius, sprites.grenadeRed),
    },
  })
  Body.setVelocity(body, Vector.mult(direction, 30))

  let isExploded = false
  let timeSinceCreation = 0

  const explosionDelay = 3000

  const explosionAnimation = animation({
    imageCount: 7,
    slowDown: 10,
    repeat: true,
    reverse: false,
  })
  return {
    tag: 'grenade',
    body,

    render: (ctx: CanvasRenderingContext2D, dt: number) => {
      explosionAnimation.step()
      explosionAnimation.draw(
        ctx,
        assets.explosion,
        body.position.x - explosionRadius / 2,
        body.position.y - explosionRadius / 2,
        explosionRadius,
        explosionRadius,
      )
    },

    update: (dt: number) => {
      timeSinceCreation += dt
      if (timeSinceCreation >= explosionDelay && !isExploded) {
        const explosionDetector = Bodies.circle(
          body.position.x,
          body.position.y,
          explosionRadius,
          {
            isSensor: true,
            // isStatic: true,
            render: {
              opacity: 0.5,
            },
          },
        )

        // const explosionAnimation = animation({
        //   imageCount: 7,
        //   slowDown: 10,
        //   repeat: false,
        //   reverse: false,
        // })
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
