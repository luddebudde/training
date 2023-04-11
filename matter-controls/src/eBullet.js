import { Bodies, Body, Vector } from 'matter-js'
import { direction } from './direction'
import { sprites } from './sprites'
import { right } from './vectors'
import { collisionCategories } from './collision.js'
import { setLookForward } from './setLookForward.js'

const eBulletSpeed = 10

export const setBulletDirection = (body, direction) => {
  Body.setVelocity(body, Vector.mult(Vector.normalise(direction), eBulletSpeed))
  setLookForward(body)
}

export const ebullet = (pos, direction, damage) => {
  const eBulletRadius = 15
  // const pos = Vector.add(Vector.mult (direction(player.body), playerRadius + bulletRadius), player.body.position)
  const p = Vector.add(pos, Vector.mult(direction, eBulletRadius))
  const body = Bodies.circle(p.x, p.y, eBulletRadius, {
    mass: 1,
    friction: 0,
    frictionAir: 0,
    isSensor: true,
    label: 'Enemy Bullet',
    render: {
      sprite: {
        texture: sprites.eBullet.texture,
        xScale: (2 * eBulletRadius) / sprites.eBullet.width,
        yScale: (2 * eBulletRadius) / sprites.eBullet.width,
      },
    },
    collisionFilter: {
      category: collisionCategories.eBullets,
      mask: ~(collisionCategories.eBullets | collisionCategories.eBullets),
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
    damage,
  }
}
