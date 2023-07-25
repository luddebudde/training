import { Bodies, Body, Vector } from 'matter-js'
import { applyTorque } from './physics'
import { random } from './math'
import { GameObject } from './GameObject.ts'
import { setLookForward } from './setLookForward.ts'
import { animation } from './animation.ts'

export const comet = (position: Vector, initVel: Vector): GameObject => {
  const radius = random(10, 20)

  const body = Bodies.circle(position.x, position.y, radius, {
    mass: 1000,
    frictionAir: 0,
    frictionStatic: 0,
    friction: 0,
    restitution: 1,
    render: {
      visible: false,
    },
  })
  applyTorque(body, 1)
  Body.setVelocity(body, initVel)
  const speed = Vector.magnitude(initVel)

  const width = radius * 2 * 5
  const height = radius * 2 * 2

  const spriteAnimation = animation({
    repeat: true,
    reverse: true,
    slowDown: 3,
    imageCount: 5,
  })

  return {
    type: 'comet',
    body: body,
    health: 1000,
    points: 0,
    update: () => {
      setLookForward(body)
    },
    speed: () => {
      return speed
    },
    // damage: 100,
    // isBullet: true,
    draw: (ctx, assets, thisObject) => {
      spriteAnimation.step()
      spriteAnimation.draw(
        ctx,
        assets.comet,
        -width * 0.82,
        -height * 0.5,
        width,
        height,
      )
    },
  }
}
