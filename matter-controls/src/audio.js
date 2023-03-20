export const playBum = () => {
  new Audio('audio/bum.mp3').play()
}
export const playExplosion = () => {
  const audio = new Audio('audio/bang.mp3')
  audio.volume = 0.5
  audio.play()
}
