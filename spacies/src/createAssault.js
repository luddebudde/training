import { createShip } from './createShip.js'
import { sprites } from './sprites.js'
import { createMinigun } from './weapons/createMinigun.js'

export const createAssault = (addObject) => {
  return createShip(sprites.assault, sprites.assault, addObject, {
    radius: 25,
    torque: 0.3,
    thrust: 1,
    health: 100,
    mass: 300,
    weapon: createMinigun(),
  })
}
