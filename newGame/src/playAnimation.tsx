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
  whenDone,
  isPlayer = false // Om det är en spelar-unik animation
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
      isPlayer, // Flagga för om det är en spelaranimation
      active: true, // För att hantera om animationen ska fortsätta
      lastFrameTime: performance.now(), // Initialtidsstämpling för FPS-hantering
    };
  };

  spriteImage.onerror = () => {
    console.error(`Failed to load image: ${picture}`);
  };
};

export const stopAnimation = (entityId, whenDone = () => {}) => {
  if (animationsRegistry[entityId]) {
    const animation = animationsRegistry[entityId];
    const { pos, size, frameWidth, spriteHeight } = animation;

    // Rensa det område där animationen var ritad
    // setTimeout(() => {
    //   ctx.clearRect(
    //     pos.x - size.x / 2,
    //     pos.y - size.y / 2,
    //     frameWidth + size.x,
    //     spriteHeight + size.y
    //   );
    // }, 100);

    // delete animationsRegistry[entityId]; // Ta bort animationen från registret

    if (typeof whenDone === "function") {
      whenDone();
    }
  }
};

// export const playAnimation = (
//   picture,
//   parts,
//   frameRate,
//   loopTimes,
//   canvasId,
//   pos,
//   size,
//   entityId,
//   whenDone
// ) => {
//   let loopsLeft = loopTimes;
//   const canvas = document.getElementById(canvasId);
//   const ctx = canvas.getContext("2d");

//   if (!canvas || !ctx) {
//     console.error("Canvas or context not found.");
//     return;
//   }

//   const spriteImage = new Image();
//   spriteImage.src = picture;

//   let currentFrame = 0;
//   let frameWidth = 0;
//   let animationTimeout = null;

//   spriteImage.onload = () => {
//     frameWidth = spriteImage.width / parts;

//     // Om det redan finns en animation för detta ID, rensa det tidigare området
//     if (animationsRegistry[entityId]) {
//       const prevAnimation = animationsRegistry[entityId];
//       ctx.clearRect(
//         prevAnimation.pos.x - prevAnimation.size.x / 2,
//         prevAnimation.pos.y - prevAnimation.size.y / 2,
//         prevAnimation.frameWidth + prevAnimation.size.x,
//         prevAnimation.spriteHeight + prevAnimation.size.y
//       );
//     }

//     const animate = () => {
//       ctx.clearRect(
//         pos.x - size.x / 2,
//         pos.y - size.y / 2,
//         frameWidth + size.x,
//         spriteImage.height + size.y
//       );

//       ctx.drawImage(
//         spriteImage,
//         currentFrame * frameWidth,
//         0,
//         frameWidth,
//         spriteImage.height,
//         pos.x - size.x / 2,
//         pos.y - size.y / 2,
//         frameWidth + size.x,
//         spriteImage.height + size.y
//       );

//       currentFrame = (currentFrame + 1) % parts;

//       if (currentFrame === 0) {
//         loopsLeft--;

//         if (loopsLeft === 0) {
//           stopAnimation(entityId, whenDone);
//           return;
//         }
//       }

//       animationsRegistry[entityId] = {
//         timeoutId: setTimeout(animate, 1000 / frameRate),
//         pos,
//         size,
//         frameWidth,
//         spriteHeight: spriteImage.height,
//         whenDone,
//         active: true, // Markera animationen som aktiv
//       };
//     };

//     animate();
//   };
// };

// export const stopAnimation = (entityId, whenDone = () => {}) => {
//   if (animationsRegistry[entityId]) {
//     const animation = animationsRegistry[entityId];
//     const { pos, size, frameWidth, spriteHeight } = animation;

//     ctx.clearRect(
//       pos.x - size.x / 2,
//       pos.y - size.y / 2,
//       frameWidth + size.x,
//       spriteHeight + size.y
//     );

//     delete animationsRegistry[entityId]; // Ta bort animationen från registret

//     if (typeof whenDone === "function") {
//       whenDone();
//     }
//   }
// };
