import { Bodies, Body, Vector } from 'matter-js'
import { sprites } from './sprites'
import { collisionCategories } from './collision'
import { setLookForward } from './setLookForward'
import { playExplosion } from './audio'

export const setBulletDirection = (body: Body) => {
  setLookForward(body)
}

export const ebullet = (
  pos: Vector,
  direction: Vector,
  damage: number,
  radius: number,
  speed: number,
) => {
  const eBulletRadius = radius
  // const pos = Vector.add(Vector.mult (direction(player.body), playerRadius + bulletRadius), player.body.position)
  const p = Vector.add(pos, Vector.mult(direction, eBulletRadius))
  const body = Bodies.circle(p.x, p.y, eBulletRadius, {
    mass: 1,
    friction: 0,
    restitution: 1,
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
      mask: ~(collisionCategories.eBullets | collisionCategories.bullets),
    },
  })
  Body.setVelocity(body, Vector.mult(Vector.normalise(direction), speed))
  setBulletDirection(body)
  return {
    body: body,
    update: () => {
      // setBulletDirection(body, body.velocity)
    },
    isBullet: true,
    health: 0,
    damage,
    onDestroy: () => {
      playExplosion(0.8)
    },
  }
}
