export const playBum = () => {
  new Audio('audio/bum.mp3').play()
}
export const playExplosion = (volume: number) => {
  const audio = new Audio('audio/bang.mp3')
  audio.volume = volume
  audio.play()
}

export const playPlayerDeath = () => {
  const audio = new Audio('audio/wilhelm.mp3')
  audio.volume = 1
  audio.play()
}

export const playMini = (volume: number) => {
  const audio = new Audio('audio/player-rifle.mp3')
  audio.volume = volume
  audio.play()
}
