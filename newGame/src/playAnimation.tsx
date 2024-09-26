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

export const animationsRegistry = {};

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
      oldPos: { ...pos },
    };
  };

  spriteImage.onerror = () => {
    console.error(`Failed to load image: ${picture}`);
  };
};

export const stopAnimation = (entityId, whenDone = () => {}) => {
  // console.log(animationsRegistry[0]);
  // console.log(animationsRegistry[entityId]);
  // console.log(animationsRegistry);

  if (animationsRegistry[entityId]) {
    const animation = animationsRegistry[entityId];

    animation.active = false;
    delete animationsRegistry[entityId];

    if (typeof whenDone === "function") {
      whenDone();
    }

    // console.log(entityId, "2");
  }
};
