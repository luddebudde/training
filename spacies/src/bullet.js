import { Bodies, Body, Vector } from 'matter-js'
import { angle } from './angle'
import { direction } from './direction'
import { sprites } from './sprites'
import { right } from './vectors'
import { collisionCategories } from './collision.js'
import { setLookForward } from './setLookForward.js'
import { playExplosion, playPlayerDeath } from './audio'

const bulletSpeed = 30

export const setBulletDirection = (body) => {
  setLookForward(body)
}

export const bullet = (pos, direction) => {
  const bulletRadius = 20
  const p = Vector.add(pos, Vector.mult(direction, bulletRadius))
  const body = Bodies.circle(p.x, p.y, bulletRadius, {
    mass: 0.01,
    friction: 0,
    restitution: 1,
    frictionAir: 0, 
    isSensor: true, 
    render: {
      sprite: {
        texture: sprites.bullet.texture,
        xScale: (2 * bulletRadius) / sprites.bullet.width,
        yScale: (2 * bulletRadius) / sprites.bullet.width,
      },
    },
    collisionFilter: {
      category: collisionCategories.bullets,
      mask: ~collisionCategories.bullets,
    },
  })
  Body.setVelocity(body, Vector.mult(Vector.normalise(direction), bulletSpeed))
  setBulletDirection(body)
  return {
    body: body,
    update: () => {
      // setBulletDirection(body)
    },
    isBullet: true,
    health: 0,
    damage: 20,
    
    onDestroy: () => {
      playExplosion(1)
    }
  }
}
