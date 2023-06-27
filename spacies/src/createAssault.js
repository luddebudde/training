import { createShip } from './createShip'
import { sprites } from './sprites'
import { createMinigun } from './weapons/createMinigun'

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
