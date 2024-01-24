export const animation = ({ imageCount, slowDown, reverse, repeat }) => {
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
    draw: (ctx, image, x, y, width, height) => {
      const imageIndex = Math.floor(counter / slowDown);
      const spriteHeight = image.height / imageCount;

      // const canvas = document.getElementById("myCanvas");
      // const ctx = canvas.getContext("2d");
      // const img = document.getElementById("scream");
      // ctx.drawImage(img, 90, 130, 50, 60, 10, 10, 50, 60);
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
    },
  };
};
