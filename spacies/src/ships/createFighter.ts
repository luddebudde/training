import { Vector } from 'matter-js'
import { createShip } from './createShip'
import { sprites } from '../sprites'
import { createRifle } from '../weapons/createRifle'
import { GameObject } from '../GameObject'

export const createFighter = (
  postion: Vector,
  addObject: (obj: GameObject) => void,
  getPlayers: () => void,
  color: string,
) => {
  return createShip(
    postion,
    sprites.fighterWithoutJet(color),
    sprites.fighterWithJet(color),
    addObject,
    getPlayers,
    {
      radius: 30,
      torque: 0.2,
      thrust: 1,
      health: 200,
      mass: 500,
      weapon: createRifle(),
    },
  )
}
