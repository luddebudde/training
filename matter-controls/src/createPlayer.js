import { Bodies, Body, Constraint, Vector } from 'matter-js'
import { createEnemy } from './createEnemy'
import { sprites } from './sprites'
import { collisionCategories } from './collision.js'
import { applyAngularFriction } from './applyAngularFriction.js'
import { thrust } from './thrust.js'
import { applyTorque } from './applyTorque.js'
import { direction } from './direction.js'
import { bullet } from './bullet.js'
import { throttle } from 'throttle-debounce'
import { miniBullet } from './miniBullet'

export const playerRadius = 30
const playerTorque = 0.2
const playerThrust = 1
export const createPlayer = (sprite, spriteWithJet, addObject) => {
  const playerBody = Bodies.circle(0, 0, playerRadius, {
    mass: 500,
    frictionAir: 0.08,
    label: 'Player',
    render: {
      sprite: {
        texture: sprite.texture,
        xScale: (2 * playerRadius) / sprite.width,
        yScale: (2 * playerRadius) / sprite.height,
      },
    },
    collisionFilter: {
      category: collisionCategories.player,
    },
  })
  const playerBody2 = Bodies.circle(0, 0, playerRadius, {
    mass: 500,
    frictionAir: 0.08,
    label: 'Player',
    render: {
      sprite: {
        texture: sprite.texture,
        xScale: (2 * playerRadius) / sprite.width,
        yScale: (2 * playerRadius) / sprite.height,
      },
    },
    collisionFilter: {
      category: collisionCategories.player,
    },
  })
  
  const cameraBody = Bodies.circle(playerRadius, 0, 10, {
    mass: 1,
    frictionAir: 0.05,
    label: 'Camera',
    isSensor: true,
    render: {
      visible: false,
    },
    collisionFilter: {
      mask: 0,
    },
  })

  const cameraConstraint = Constraint.create({
    bodyA: playerBody,
    bodyB: cameraBody,
    length: 0,
    stiffness: 0.0005,
    damping: 0.1,
    render: {
      visible: false,
    },
  })
  const cannon = throttle(300, () => {
    const spawnPos = Vector.add(
      playerBody.position,
      Vector.mult(direction(playerBody), playerRadius),
    )
    const newBullet = bullet(spawnPos, direction(playerBody))
    addObject(newBullet)
    const audio = new Audio('audio/player-rifle.mp3')
    audio.play()
  })

  let miniAmmo = 100
  const minigun = throttle(60, () => {
    if (miniAmmo > 0) {
      const spawnPos = Vector.add(
        playerBody.position,
        Vector.mult(direction(playerBody), playerRadius),
      )
      const newBullet = miniBullet(spawnPos, direction(playerBody))
      addObject(newBullet)
      const audio = new Audio('audio/player-rifle.mp3')
      audio.play()
      miniAmmo = miniAmmo - 1
    } else {
      currentWeapon = cannon
    }
  })

  let currentWeapon = minigun
  return {
    body: playerBody,
    worldObjects: [playerBody, cameraBody, cameraConstraint],
    camera: cameraBody,
    health: 200,
    score: 0,
    type: 'player',
    update: () => {
      applyAngularFriction(playerBody, 5)
    },
    thrust: () => {
      thrust(playerBody, playerThrust)
      playerBody.render.sprite.texture = spriteWithJet.texture
    },
    dontThrust: () => {
      playerBody.render.sprite.texture = sprite.texture
    },
    back: () => {
      thrust(playerBody, -playerThrust * 0.3)
    },
    turnLeft: () => {
      applyTorque(playerBody, playerTorque)
    },
    turnRight: () => {
      applyTorque(playerBody, -playerTorque)
    },
    fire: () => {
      currentWeapon()
    },
  }
}
