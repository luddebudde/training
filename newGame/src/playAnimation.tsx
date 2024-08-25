export const playAnimation = (
  picture: string,
  parts: number,
  frameRate: number,
  loopTimes: number,
  canvasId: string,
  pos: {
    x: number;
    y: number;
  },
  size: {
    x: number;
    y: number;
  },
  whenDone?: () => void
) => {
  let loopsLeft = loopTimes;
  const canvas = document.getElementById(canvasId);
  if (!canvas) {
    console.error(`Canvas element with id ${canvasId} not found.`);
    return;
  }
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    console.error("Failed to get 2D context.");
    return;
  }

  const spriteImage = new Image();
  spriteImage.src = picture;

  let currentFrame = 0;
  let frameWidth = 0;
  let animationTimeout = null;

  spriteImage.onload = () => {
    frameWidth = spriteImage.width / parts;

    // Justera canvas storlek för att rymma hela bilden plus eventuell flytt
    canvas.width = Math.max(
      frameWidth + Math.abs(pos.x),
      canvas.width + size.x
    );
    canvas.height = Math.max(
      spriteImage.height + Math.abs(pos.y),
      canvas.height + size.y
    );

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Rensa hela canvasen

      // Ritar bilden på canvasen med justerade koordinater
      ctx.drawImage(
        spriteImage,
        currentFrame * frameWidth, // Source x
        0, // Source y
        frameWidth, // Source width
        spriteImage.height, // Source height
        pos.x - size.x / 2, // Destination x
        pos.y - size.y / 2, // Destination y
        frameWidth + size.x, // Destination width
        spriteImage.height + size.y // Destination height
      );

      currentFrame = (currentFrame + 1) % parts;

      if (currentFrame === 0) {
        loopsLeft--;

        if (typeof whenDone === "function" && loopsLeft === 0) {
          whenDone();
          stopAnimation();
          return;
        }
      }

      animationTimeout = setTimeout(animate, 1000 / frameRate);
    };

    animate();
  };

  const stopAnimation = () => {
    if (animationTimeout !== null) {
      clearTimeout(animationTimeout);
      animationTimeout = null;
    }

    // Rensa canvasen
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return stopAnimation;
};
