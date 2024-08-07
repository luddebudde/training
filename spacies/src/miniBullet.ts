import { Bodies, Body, Vector } from 'matter-js'
import { sprites } from './sprites'
import { collisionCategories } from './collision'
import { setLookForward } from './setLookForward'
import { playExplosion } from './audio'

const bulletSpeed = 30

export const setBulletDirection = (body: Body, direction: Vector) => {
  Body.setVelocity(body, Vector.mult(Vector.normalise(direction), bulletSpeed))
  setLookForward(body)
}

export const miniBullet = (pos: Vector, direction: Vector) => {
  const bulletRadius = 10
  // const pos = Vector.add(Vector.mult (direction(player.body), playerRadius + bulletRadius), player.body.position)
  const p = Vector.add(pos, Vector.mult(direction, bulletRadius))
  const body = Bodies.circle(p.x, p.y, bulletRadius, {
    mass: 0,
    friction: 0,
    frictionAir: 0,
    isSensor: true,
    render: {
      sprite: {
        texture: sprites.miniBullet.texture,
        xScale: (2 * bulletRadius) / sprites.miniBullet.width,
        yScale: (2 * bulletRadius) / sprites.miniBullet.width,
      },
    },
    collisionFilter: {
      category: collisionCategories.bullets,
      mask: ~collisionCategories.bullets,
    },
  })
  setBulletDirection(body, direction)
  return {
    body: body,
    update: () => {
      setBulletDirection(body, body.velocity)
    },
    isBullet: true,
    health: 0,
    damage: 5,
    onDestroy: () => {
      playExplosion(0.3)
    },
  }
}
