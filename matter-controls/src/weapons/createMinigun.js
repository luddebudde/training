import { throttle } from 'throttle-debounce'
import { miniBullet } from '../miniBullet.js'

export const createMinigun = () =>
  throttle(60, (spawnPos, dir, addObject) => {
    const newBullet = miniBullet(spawnPos, dir)
    addObject(newBullet)
    const audio = new Audio('audio/player-rifle.mp3')
    audio.play()
  },
  {
    noTrailing: true,
  },
  )
