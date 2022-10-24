export const keyDownTracker = () => {
  const keysDown = new Set();

  document.addEventListener("keydown", event => {
    keysDown.add(event.code);
  })

  document.addEventListener("keyup", event => {
    keysDown.delete(event.code);
  })

  return (keyCode) => keysDown.has(keyCode)
}