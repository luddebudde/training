import { createShip } from './createShip.js'
import { sprites } from './sprites.js'
import { createRifle } from './weapons/createRifle.js'

export const createFighter = (addObject) => {
  return createShip(
    sprites.fighterWithoutJet('green'),
    sprites.fighterWithJet('green'),
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
