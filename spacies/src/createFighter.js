import { createShip } from './createShip'
import { sprites } from './sprites'
import { createRifle } from './weapons/createRifle'

export const createFighter = (addObject, color) => {
  return createShip(
    sprites.fighterWithoutJet(color),
    sprites.fighterWithJet(color),
    addObject,
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
