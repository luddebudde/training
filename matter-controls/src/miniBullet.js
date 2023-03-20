import { Bodies, Body, Vector } from 'matter-js'
import { angle } from './angle'
import { direction } from './direction'
import { sprites } from './sprites'
import { right } from './vectors'
import { collisionCategories } from './collision.js'
import { setLookForward } from './setLookForward.js'

const bulletSpeed = 30

export const setBulletDirection = (body, direction) => {
  Body.setVelocity(body, Vector.mult(Vector.normalise(direction), bulletSpeed))
  setLookForward(body)
}

export const miniBullet = (pos, direction) => {
  const bulletRadius = 10
  // const pos = Vector.add(Vector.mult (direction(player.body), playerRadius + bulletRadius), player.body.position)
  const p = Vector.add(pos, Vector.mult(direction, bulletRadius))
  const body = Bodies.circle(p.x, p.y, bulletRadius, {
    mass: 0.001,
    friction: 0,
    frictionAir: 0,
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
  }
}
