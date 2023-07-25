import { Vector } from 'matter-js'
import { GameObject } from '../GameObject.ts'
import { createShip } from './createShip.ts'

export const createAstronaut = (
  postion: Vector,
  addObject: (obj: GameObject) => void,
  getPlayers: () => GameObject,
  assets: any,
) => {
  return createShip(postion, assets.astronaut, addObject, getPlayers, {
    radius: 20,
    torque: 0.02,
    thrust: 0.005,
    mass: 100,
    health: -1,
    weapon: () => {},
  })
}
