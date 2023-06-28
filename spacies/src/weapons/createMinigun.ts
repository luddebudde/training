import { throttle } from 'throttle-debounce'
import { playMini } from '../audio'
import { miniBullet } from '../miniBullet'
import { Vector } from 'matter-js'
import { GameObject } from '../GameObject'
import { Weapon } from './Weapon'

export const createMinigun = (): Weapon =>
  throttle(60, (spawnPos: Vector, dir: Vector, addObject: (obj: GameObject) => void ) => {
    const newBullet = miniBullet(spawnPos, dir)
    addObject(newBullet)
    playMini(0.3)
  },
  {
    noTrailing: true,
  },
  )
