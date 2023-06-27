import { createShip } from './createShip.js'
import { sprites } from './sprites.js'
import { createRifle } from './weapons/createRifle.js'

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
