export const keyDownTracker = () => {
  const keysDown = new Set()

  document.addEventListener('keydown', (event) => {
    if (!event.repeat) {
      keysDown.add(event.code)
    }
  })

  document.addEventListener('keyup', (event) => {
    keysDown.delete(event.code)
  })

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      keysDown.clear()
    }
  })

  return (keyCode: string) => keysDown.has(keyCode)
}
