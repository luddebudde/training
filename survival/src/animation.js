export const animation = ({
  imageCount,
  slowDown,
  reverse,
  repeat,
  vertical = true,
  // switchLayer = false,
  // firstLayerCount = undefined,
  // layerCount = undefined,
}) => {
  // const { imageCount, slowDown, reverse, repeat } = options;
  let counter = 0;

  let counterDirection = 1;

  return {
    step: () => {
      counter += counterDirection;
      if (!repeat) {
        return counter >= imageCount * slowDown;
      }
      if (reverse) {
        if (counter >= imageCount * slowDown || counter < 0) {
          counterDirection = -counterDirection;
          counter += counterDirection;
        }
      } else {
        if (counter >= imageCount * slowDown) {
          counter = 0;
        }
      }
      return false;
    },
    draw: (ctx, image, x, y, width, height, newCounter = counter) => {
      const imageIndex = Math.floor(newCounter / slowDown);

      // const canvas = document.getElementById("myCanvas");
      // const ctx = canvas.getContext("2d");
      // const img = document.getElementById("scream");
      // ctx.drawImage(img, 90, 130, 50, 60, 10, 10, 50, 60);

      if (vertical === true) {
        const spriteHeight = image.height / imageCount;
        ctx.drawImage(
          image,
          0,
          imageIndex * spriteHeight,
          image.width,
          spriteHeight,
          x,
          y,
          width,
          height
        );
      } else {
        const spriteWidth = image.width / imageCount;
        ctx.drawImage(
          image,
          imageIndex * spriteWidth,
          0,
          spriteWidth,
          image.height,
          x,
          y,
          width,
          height
        );
      }
    },
    counter: () => {
      return counter;
    },
    restoreCounter: () => {
      counter = 0;
    },
  };
};
