import { Vector } from 'matter-js'
import { GameObject } from '../GameObject'
import { createShip } from './createShip'
import { createMinigun } from '../weapons/createMinigun'

export const createAssault = (
  postion: Vector,
  addObject: (obj: GameObject) => void,
  getPlayers: () => void,
  assets: any,
) => {
  return createShip(postion, assets.assault, addObject, getPlayers, {
    radius: 25,
    torque: 0.3,
    thrust: 1,
    health: 100,
    mass: 300,
    weapon: createMinigun(),
  })
}
