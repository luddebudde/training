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

  const body = Bodies.circle(spawnPos.x, spawnPos.y, grenadeRadius, {
    render: {
      sprite: matterJsSprite(grenadeRadius, sprites.grenadeRed),
    },
  })
  Body.setVelocity(body, Vector.mult(direction, 35))

  let isExploded = false
  let timeSinceCreation = 0

  const explosionDelay = 2500

  return {
    tag: 'grenade',
    body,

    update: (dt: number) => {
      timeSinceCreation += dt
      if (timeSinceCreation >= explosionDelay && !isExploded) {
        // const explosionAnimation = animation({
        //   imageCount: 7,
        //   slowDown: 10,
        //   repeat: false,
        //   reverse: false,
        // })
        addGameObject(createExplosion(body.position, body))

        isExploded = true
        playBang()
      }
    },
  }
}

const createExplosion = (pos: Vector, source: Body) => {
  const explosionAnimation = animation({
    imageCount: 7,
    slowDown: 8,
    repeat: false,
    reverse: false,
  })
  const explosionRadius = 350

  const explosionDetector = Bodies.circle(pos.x, pos.y, explosionRadius, {
    isSensor: true,
    // isStatic: true,
    render: {
      visible: false,
    },
  })

  return {
    tag: 'explosion',
    body: explosionDetector,
    source: source,

    render: (ctx: CanvasRenderingContext2D, dt: number) => {
      explosionAnimation.step()
      explosionAnimation.draw(
        ctx,
        assets.explosion,
        explosionDetector.position.x - explosionRadius,
        explosionDetector.position.y - explosionRadius,
        explosionRadius * 2,
        explosionRadius * 2,
      )
    },
  }
}
