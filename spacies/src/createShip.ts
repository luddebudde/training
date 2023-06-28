import { applyAngularFriction } from './applyAngularFriction'
import { applyThrust } from './applyThrust'
import { applyTorque } from './applyTorque'
import { Bodies, Vector } from 'matter-js'
import { direction } from './direction'
import { collisionCategories } from './collision'
import { playPlayerDeath } from './audio'
import { Sprite } from './sprites'
import { GameObject } from './GameObject'
import { Weapon } from './weapons/Weapon'

type ShipOptions = {
  radius: number,
  torque: number,
  thrust: number,
  health: number,
  mass: number,
  weapon: Weapon,
}

export const createShip = (spriteWithoutJet: Sprite, spriteWithJet: Sprite, addObject: (obj: GameObject) => void, options: ShipOptions) => {
  const { radius, torque, thrust, health, mass, weapon } = options

  const sprite = {
      texture: spriteWithoutJet.texture,
      xScale: (2 * radius) / spriteWithoutJet.width,
      yScale: (2 * radius) / spriteWithoutJet.height,
  }

  const playerBody = Bodies.circle(0, 0, radius, {
    mass,
    frictionAir: 0.08,
    label: 'Fighter',
    render: {
      sprite: sprite
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
      playerBody.render.sprite!.texture = spriteWithJet.texture
    },
    dontThrust: () => {
      playerBody.render.sprite!.texture = spriteWithoutJet.texture
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
