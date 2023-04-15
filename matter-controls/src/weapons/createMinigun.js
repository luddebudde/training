import { throttle } from 'throttle-debounce'
import { playMini } from '../audio.js'
import { miniBullet } from '../miniBullet.js'

export const createMinigun = () =>
  throttle(60, (spawnPos, dir, addObject) => {
    const newBullet = miniBullet(spawnPos, dir)
    addObject(newBullet)
    playMini(0.3)
  },
  {
    noTrailing: true,
  },
  )
