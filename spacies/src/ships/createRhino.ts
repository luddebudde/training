import { Bodies, Vector } from 'matter-js'
import { GameObject } from '../GameObject'
import { ShipOptions } from './createShip'
import { collisionCategories } from '../collision'
import { closestPlayer } from '../closestPlayer'
import {
  applyAngularFriction,
  applyThrust,
  applyTorque,
  turnTowards,
} from '../physics'
import { isFacing } from '../isFacing'

import { playPlayerDeath } from '../audio'

export const createRhino = (
  postion: Vector,
  addObject: (obj: GameObject) => void,
  getPlayers: () => void,
  assets: any,
) => {
  const { radius, torque, thrust, health, mass } = {
    health: 1000,
    radius: 70,
    torque: 0.5,
    thrust: 3,
    mass: 2000,
  } satisfies Partial<ShipOptions>

  const body = Bodies.circle(postion.x, postion.y, radius, {
    mass,
    frictionAir: 0.08,
    friction: 0,
    label: 'Fighter',
    render: {
      visible: false,
    },
    collisionFilter: {
      category: collisionCategories.rhino,
    },
  })

  let useAI = true
  let fuel = 1000
  let speed = body.speed

  return {
    body: body,
    health,
    maxHealth: health,
    score: 0,
    type: 'player',
    maxFuel: fuel,
    fuel: () => fuel,
    speed: () => speed,
    update: () => {
      speed = body.speed
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
      // body.render.sprite!.texture = sprites.rhino.texture
    },
    dontThrust: () => {
      // body.render.sprite!.texture = spriteWithoutJet.texture
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
      if (fuel >= 0) {
        applyThrust(body, thrust * 2)
        fuel = fuel - 1
      }
    },
    onDestroy: () => {
      playPlayerDeath()
    },
    draw: (
      ctx: CanvasRenderingContext2D,
      assets: any,
      gameObject: GameObject,
    ) => {
      if (gameObject.health > 0) {
        ctx.drawImage(
          assets.rhino,
          -body.circleRadius,
          -body.circleRadius,
          body.circleRadius * 2,
          body.circleRadius * 2,
        )
      } else {
        ctx.drawImage(
          assets.astronaut,
          -body.circleRadius * 0.5,
          -body.circleRadius * 1.5 * 0.5,
          body.circleRadius,
          body.circleRadius * 1.5,
        )
      }
    },
  }
}
