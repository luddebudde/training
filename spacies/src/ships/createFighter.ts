import { Vector } from 'matter-js'
import { createShip } from './createShip'
import { createRifle } from '../weapons/createRifle'
import { GameObject } from '../GameObject'

export const createFighter = (
  postion: Vector,
  addObject: (obj: GameObject) => void,
  getPlayers: () => void,
  assets: any,
) => {
  return createShip(postion, assets.fighter, addObject, getPlayers, {
    radius: 30,
    torque: 0.2,
    thrust: 1,
    health: 200,
    mass: 500,
    weapon: createRifle(),
  })
}
