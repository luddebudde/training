import { Bodies, Vector } from 'matter-js'
import { applyTorque, applyForce } from './physics'
import { radiansToCartesian } from './math'
import { random } from './math'
import { sprites } from './sprites'

export const asteroid = (position: Vector) => {
  const asteroidRadius = random(30, 150)

  const body = Bodies.circle(position.x, position.y, asteroidRadius, {
    density: 1,
    frictionAir: 0,
    render: {
      sprite: {
        texture: sprites.asteroid.texture,
        xScale: ((2 * asteroidRadius) / sprites.asteroid.width) * 1.23,
        yScale: ((2 * asteroidRadius) / sprites.asteroid.height) * 1.23,
      },
    },
  })
  applyTorque(body, 1)
  applyForce(body, radiansToCartesian(random(0, 2 * Math.PI), random(0, 20)))

  return {
    type: 'asteroid',
    body: body,
    health: 9999999,
    points: 99999999,
    // damage: 100,
    // isBullet: true,
  }
}
