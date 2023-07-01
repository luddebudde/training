import {
  applyAngularFriction,
  applyTorque,
  applyThrust,
  turnTowards,
} from '../physics'
import { Bodies, Vector } from 'matter-js'
import { direction } from '../math'
import { collisionCategories } from '../collision'
import { playPlayerDeath } from '../audio'
import { Sprite } from '../sprites'
import { GameObject } from '../GameObject'
import { Weapon } from '../weapons/Weapon'
import { closestPlayer } from '../closestPlayer'
import { isFacing } from '../isFacing'

type ShipOptions = {
  radius: number
  torque: number
  thrust: number
  health: number
  mass: number
  weapon: Weapon
}

export const createShip = (
  postion: Vector,
  spriteWithoutJet: Sprite,
  spriteWithJet: Sprite,
  addObject: (obj: GameObject) => void,
  getPlayers: () => void,
  options: ShipOptions,
) => {
  const { radius, torque, thrust, health, mass, weapon } = options

  const sprite = {
    texture: spriteWithoutJet.texture,
    xScale: (2 * radius) / spriteWithoutJet.width,
    yScale: (2 * radius) / spriteWithoutJet.height,
  }

  const body = Bodies.circle(postion.x, postion.y, radius, {
    mass,
    frictionAir: 0.08,
    label: 'Fighter',
    render: {
      sprite: sprite,
    },
    collisionFilter: {
      category: collisionCategories.player,
    },
  })

  let useAI = true

  return {
    body: body,
    worldObjects: [body],
    health,
    maxHealth: health,
    score: 0,
    type: 'player',
    update: () => {
      if (useAI) {
        const player = closestPlayer(body.position, getPlayers())
        if (!player) {
          return
        }
        turnTowards(body, player.body, torque)

        if (
          Vector.magnitude(Vector.sub(player.body.position, body.position)) <
          250
        ) {
          useAI = false
        } else if (isFacing(body, player.body)) {
          applyThrust(body, thrust)
        }
      }

      applyAngularFriction(body, 5)
    },
    thrust: () => {
      applyThrust(body, thrust)
      body.render.sprite!.texture = spriteWithJet.texture
    },
    dontThrust: () => {
      body.render.sprite!.texture = spriteWithoutJet.texture
    },
    back: () => {
      applyThrust(body, -thrust * 0.3)
    },
    turnLeft: () => {
      applyTorque(body, torque)
    },
    turnRight: () => {
      applyTorque(body, -torque)
    },
    fire: () => {
      const spawnPos = Vector.add(
        body.position,
        Vector.mult(direction(body), radius),
      )
      weapon(spawnPos, direction(body), addObject)
    },
    onDestroy: () => {
      playPlayerDeath()
    },
  }
}
