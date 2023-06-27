import { throttle } from 'throttle-debounce'
import { playMini } from '../audio'
import { miniBullet } from '../miniBullet'

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
