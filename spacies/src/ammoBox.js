import { Bodies } from 'matter-js'
import { applyForce } from './applyForce'
import { applyTorque } from './applyTorque'
import { radiansToCartesian } from './radianstToCartesian'
import { random } from './random'
import { sprites } from './sprites'

export const miniBox = (position) => {
  const radius = 20

  const body = Bodies.circle(position.x, position.y, radius, {
    frictionAir: 0,
    mass: 200,
    render: {
      sprite: {
        texture: sprites.ammoBox.texture,
        xScale: ((2 * radius) / sprites.ammoBox.width) * 1.23,
        yScale: ((2 * radius) / sprites.ammoBox.height) * 1.23,
      },
    },
  })
  applyTorque(body, random(-0.1, 0.1))
  applyForce(body, radiansToCartesian(random(0, 2 * Math.PI), random(0, 20)))

  return {
    body: body,
    points: 0,
    isBullet: false,
  }
}
