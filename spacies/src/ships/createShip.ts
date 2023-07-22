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
import { Game } from '../Game.ts'

export type ShipOptions = {
  radius: number
  torque: number
  thrust: number
  health: number
  mass: number
  weapon: Weapon
}

export const createShip = (
  postion: Vector,
  asset: any,
  addObject: (obj: GameObject) => void,
  getPlayers: () => GameObject,
  options: ShipOptions,
) => {
  const { radius, torque, thrust, health, mass, weapon } = options

  const body = Bodies.circle(postion.x, postion.y, radius, {
    mass,
    frictionAir: 0.08,
    label: 'Fighter',
    render: { visible: false },
    collisionFilter: {
      category: collisionCategories.player,
    },
  })

  let useAI = true
  const jetImageSlowDown = 4
  let jetImageIndex = 0
  let isThrusting = false

  return {
    // render: () => {
    //
    // }
    body: body,
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

      applyAngularFriction(body, radius / 6)
    },
    thrust: () => {
      applyThrust(body, thrust)
      isThrusting = true
      // body.render.sprite!.texture = spriteWithJet.texture
    },
    dontThrust: () => {
      isThrusting = false
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
      const spawnPos = Vector.add(
        body.position,
        Vector.mult(direction(body), radius),
      )
      weapon(spawnPos, direction(body), addObject)
    },
    onDestroy: () => {
      playPlayerDeath()
      isThrusting = false
      return true
    },
    draw: (
      ctx: CanvasRenderingContext2D,
      assets: any,
      gameObject: GameObject,
    ) => {
      ctx.globalAlpha = gameObject.health > 0 ? 1 : 0.5

      const jetWidth = 1426
      const jetHeight = 4374
      if (isThrusting) {
        jetImageIndex += 1
        if (jetImageIndex === 9 * jetImageSlowDown) {
          jetImageIndex = 0
        }
        ctx.drawImage(
          assets.jet,
          0,
          (Math.floor(jetImageIndex / jetImageSlowDown) * jetHeight) / 9,
          jetWidth,
          jetHeight / 9,
          -radius * 2.6,
          -radius / 2,
          radius * 2,
          radius,
        )
      }
      ctx.drawImage(
        asset,
        -body.circleRadius,
        -body.circleRadius,
        body.circleRadius * 2,
        body.circleRadius * 2,
      )
      ctx.globalAlpha = 1
      // ctx.drawImage(
      //   assets.astronaut,
      //   -body.circleRadius * 0.5,
      //   -body.circleRadius * 1.5 * 0.5,
      //   body.circleRadius,
      //   body.circleRadius * 1.5,
      // )
    },
  }
}
