export const loadImage = (file: string): Promise<HTMLImageElement> =>
  new Promise<HTMLImageElement>((resolve, _reject) => {
    const img = new Image()
    img.onload = function () {
      resolve(img)
    }
    img.src = file
  })
