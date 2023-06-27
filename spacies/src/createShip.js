import { applyAngularFriction } from './applyAngularFriction'
import { applyThrust } from './applyThrust'
import { applyTorque } from './applyTorque'
import { Bodies, Vector } from 'matter-js'
import { direction } from './direction'
import { collisionCategories } from './collision'
import { playPlayerDeath } from './audio'

export const createShip = (sprite, spriteWithJet, addObject, options) => {
  const { radius, torque, thrust, health, mass, weapon } = options
  const playerBody = Bodies.circle(0, 0, radius, {
    mass,
    frictionAir: 0.08,
    label: 'Fighter',
    render: {
      sprite: {
        texture: sprite.texture,
        xScale: (2 * radius) / sprite.width,
        yScale: (2 * radius) / sprite.height,
      },
    },
    collisionFilter: {
      category: collisionCategories.player,
    },
  })

  return {
    body: playerBody,
    worldObjects: [playerBody],
    health,
    maxHealth: health,
    score: 0,
    type: 'player',
    update: () => {
      applyAngularFriction(playerBody, 5)
    },
    thrust: () => {
      applyThrust(playerBody, thrust)
      playerBody.render.sprite.texture = spriteWithJet.texture
    },
    dontThrust: () => {
      playerBody.render.sprite.texture = sprite.texture
    },
    back: () => {
      applyThrust(playerBody, -thrust * 0.3)
    },
    turnLeft: () => {
      applyTorque(playerBody, torque)
    },
    turnRight: () => {
      applyTorque(playerBody, -torque)
    },
    fire: () => {
      const spawnPos = Vector.add(
        playerBody.position,
        Vector.mult(direction(playerBody), radius),
      )
      weapon(spawnPos, direction(playerBody), addObject)
    },
    onDestroy: () => {
      playPlayerDeath()
    }
  }
}
