export const animation = (options: {
  imageCount: number
  slowDown: number
  reverse: boolean
  repeat: boolean
}) => {
  const { imageCount, slowDown, reverse, repeat } = options
  let counter = 0

  let counterDirection = 1

  return {
    step: (): boolean => {
      counter += counterDirection
      if (!repeat) {
        return counter >= imageCount * slowDown
      }
      if (reverse) {
        if (counter >= imageCount * slowDown || counter < 0) {
          counterDirection = -counterDirection
          counter += counterDirection
        }
      } else {
        if (counter >= imageCount * slowDown) {
          counter = 0
        }
      }
      return false
    },
    draw: (
      ctx: CanvasRenderingContext2D,
      image: HTMLImageElement,
      x: number,
      y: number,
      width: number,
      height: number,
    ) => {
      const imageIndex = Math.floor(counter / slowDown)
      const spriteHeight = image.height / imageCount
      ctx.drawImage(
        image,
        0,
        imageIndex * spriteHeight,
        image.width,
        spriteHeight,
        x,
        y,
        width,
        height,
      )
    },
  }
}
