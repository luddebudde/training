export const playBang = () => {
  const audio = new Audio('sounds/bang.mp3')
  audio.volume = 1
  audio.play()
}
