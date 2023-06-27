import { throttle } from 'throttle-debounce'
import { bullet } from '../bullet'

export const createRifle = () =>
  throttle(300, (spawnPos, dir, addObject) => {
    const newBullet = bullet(spawnPos, dir)
    addObject(newBullet)
    const audio = new Audio('audio/player-rifle.mp3')
    audio.play()
  },
  {
    noTrailing: true,
  },
  )
