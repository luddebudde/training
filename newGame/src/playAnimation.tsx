import { canvas, ctx } from "./main";
import {
  playerAnimationQueue,
  checkNextPlayerAnimation,
  idleAnimation,
} from "./playerAnimations";
import { loopPerSecond } from "./startFight";

const resizeCanvas = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};

window.addEventListener("load", resizeCanvas);
window.addEventListener("resize", resizeCanvas);

export const animationsRegistry = {}; // För att hålla reda på aktiva animationer
const fps = 60; // Antalet gånger loopen ska köras per sekund

export const playAnimation = (
  picture,
  parts,
  frameRate,
  loopTimes,
  canvasId,
  pos,
  size,
  entityId,
  whenDone
) => {
  let loopsLeft = loopTimes;
  const spriteImage = new Image();
  spriteImage.src = picture;

  let currentFrame = 0;
  let frameWidth = 0;

  spriteImage.onload = () => {
    frameWidth = spriteImage.width / parts;

    animationsRegistry[entityId] = {
      pos,
      size,
      frameWidth,
      spriteHeight: spriteImage.height,
      spriteImage,
      currentFrame,
      loopsLeft,
      parts,
      frameRate,
      whenDone,
      active: true,
      lastFrameTime: performance.now(),
      oldPos: { ...pos }, // Lagra den gamla positionen
    };
  };

  spriteImage.onerror = () => {
    console.error(`Failed to load image: ${picture}`);
  };
};

// export const stopAnimation = (entityId, whenDone = () => {}) => {
//   if (animationsRegistry[entityId]) {
//     // console.log(animationsRegistry);

//     const animation = animationsRegistry[entityId];
//     const { pos, size, frameWidth, spriteHeight } = animation;

//     // delete animationsRegistry[entityId]; // Ta bort animationen från registret

//     if (typeof whenDone === "function") {
//       whenDone();
//     }
//   }
// };

export const stopAnimation = (entityId, whenDone = () => {}) => {
  if (animationsRegistry[entityId]) {
    const animation = animationsRegistry[entityId];
    const { pos, size, frameWidth, spriteHeight } = animation;

    // Rensa det område där animationen var ritad
    // ctx.clearRect(
    //   pos.x - size.x / 2,
    //   pos.y - size.y / 2,
    //   frameWidth + size.x,
    //   spriteHeight + size.y
    // );

    // Avaktivera animationen och ta bort den från registret
    animation.active = false;
    delete animationsRegistry[entityId]; // Ta bort animationen från registret

    if (typeof whenDone === "function") {
      whenDone();
    }
  }
};
