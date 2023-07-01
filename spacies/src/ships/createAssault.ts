import { Vector } from 'matter-js'
import { GameObject } from '../GameObject'
import { createShip } from './createShip'
import { sprites } from '../sprites'
import { createMinigun } from '../weapons/createMinigun'

export const createAssault = (
  postion: Vector,
  addObject: (obj: GameObject) => void,
  getPlayers: () => void,
  color: 'green' | 'blue',
) => {
  return createShip(
    postion,
    sprites.assault(color),
    sprites.assault(color),
    addObject,
    getPlayers,
    {
      radius: 25,
      torque: 0.3,
      thrust: 1,
      health: 100,
      mass: 300,
      weapon: createMinigun(),
    },
  )
}
