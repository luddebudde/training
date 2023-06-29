import { throttle } from 'throttle-debounce'
import { bullet } from '../bullet'
import { Vector } from 'matter-js'
import { GameObject } from '../GameObject'
import { Weapon } from './Weapon'

export const createRifle = (): Weapon =>
  throttle(
    300,
    (spawnPos: Vector, dir: Vector, addObject: (obj: GameObject) => void) => {
      const newBullet = bullet(spawnPos, dir)
      addObject(newBullet)
      const audio = new Audio('audio/player-rifle.mp3')
      audio.play()
    },
    {
      noTrailing: true,
    },
  )
