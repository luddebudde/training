import { Bodies, Body, Vector } from 'matter-js'
import { applyTorque } from './physics'
import { random } from './math'
import { GameObject } from './GameObject.ts'
import { setLookForward } from './setLookForward.ts'

export const comet = (position: Vector, initVel: Vector): GameObject => {
  const radius = random(10, 20)

  const body = Bodies.circle(position.x, position.y, radius, {
    mass: 1000,
    frictionAir: 0,
    frictionStatic: 0,
    friction: 0,
    restitution: 1,
    render: {
      // visible: false,
    },
  })
  applyTorque(body, 1)
  Body.setVelocity(body, initVel)
  const speed = Vector.magnitude(initVel)
  // applyForce(body, radiansToCartesian(random(0, 2 * Math.PI), random(0, 20)))

  const width = radius * 2 * 5
  const height = radius * 2 * 2
  let imageState = 0
  let imageCount = 5
  let imageSlowDown = 3
  let imageDirection = 1

  return {
    type: 'comet',
    body: body,
    health: 9999999,
    points: 99999999,
    update: () => {
      setLookForward(body)
    },
    speed: () => {
      return speed
    },
    // damage: 100,
    // isBullet: true,
    draw: (ctx, assets, thisObject) => {
      imageState += imageDirection
      if (imageState >= imageCount * imageSlowDown || imageState < 0) {
        imageDirection = -imageDirection
        imageState += imageDirection
      }
      const currentImage = Math.floor(imageState / imageSlowDown)
      ctx.drawImage(
        assets.comet,
        0,
        (currentImage * assets.comet.height) / imageCount,
        assets.comet.width,
        assets.comet.height / 5,
        -width * 0.82,
        -height * 0.5,
        width,
        height,
      )
    },
  }
}
