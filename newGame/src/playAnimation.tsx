import {
  playerAnimationQueue,
  checkNextPlayerAnimation,
  idleAnimation,
} from "./playerAnimations";

// const canvas = document.getElementById("myCanvas");
// const ctx = canvas.getContext("2d");

// export const playAnimation = (
//   picture: string,
//   parts: number,
//   frameRate: number,
//   loopTimes: number,
//   canvasId: string,
//   pos: {
//     x: number;
//     y: number;
//   },
//   size: {
//     x: number;
//     y: number;
//   },
//   entity: object,
//   whenDone?: () => void
// ) => {
//   let loopsLeft = loopTimes;
//   // const canvas = document.getElementById(canvasId);
//   if (!canvas) {
//     console.error(`Canvas element with id ${canvasId} not found.`);
//     return;
//   }
//   const ctx = canvas.getContext("2d");
//   if (!ctx) {
//     console.error("Failed to get 2D context.");
//     return;
//   }

//   const spriteImage = new Image();
//   spriteImage.src = picture;

//   let currentFrame = 0;
//   let frameWidth = 0;
//   let animationTimeout = null;

//   spriteImage.onload = () => {
//     frameWidth = spriteImage.width / parts;

//     canvas.width = Math.max(
//       frameWidth + Math.abs(pos.x),
//       canvas.width + size.x
//     );
//     canvas.height = Math.max(
//       spriteImage.height + Math.abs(pos.y),
//       canvas.height + size.y
//     );

//     const animate = () => {
//       ctx.clearRect(0, 0, canvas.width, canvas.height);

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

//         if (typeof whenDone === "function" && loopsLeft === 0) {
//           whenDone();
//           stopAnimation(animationTimeout);
//           return;
//         }
//       }
//       animationTimeout = setTimeout(animate, 1000 / frameRate);
//     };

//     animate();
//   };

//   // const stopAnimation = () => {
//   //   if (animationTimeout !== null) {
//   //     clearTimeout(animationTimeout);
//   //     animationTimeout = null;
//   //   }
//   //   ctx.clearRect(0, 0, canvas.width, canvas.height);
//   // };

//   // return stopAnimation;
// };

// export const stopPlayerAnimation = () => {
//   const playerAnimation = animations.find();
//   stopAnimation(player);
// };

// export const stopAnimation = (animationTimeout) => {
//   if (animationTimeout !== null) {
//     clearTimeout(animationTimeout);
//     animationTimeout = null;
//   }
//   ctx.clearRect(0, 0, canvas.width, canvas.height);
// };

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const resizeCanvas = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};

// Kalla resizeCanvas när sidan laddas
window.addEventListener("load", resizeCanvas);

// Kalla resizeCanvas när fönsterstorleken ändras
window.addEventListener("resize", resizeCanvas);

const animationsRegistry = {}; // För att hålla reda på aktiva animationer

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
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext("2d");

  if (!canvas || !ctx) {
    console.error("Canvas or context not found.");
    return;
  }

  const spriteImage = new Image();
  spriteImage.src = picture;

  let currentFrame = 0;
  let frameWidth = 0;
  let animationTimeout = null;

  spriteImage.onload = () => {
    frameWidth = spriteImage.width / parts;

    const animate = () => {
      // Rensa endast det område där animationen ritas
      ctx.clearRect(
        pos.x - size.x / 2,
        pos.y - size.y / 2,
        frameWidth + size.x,
        spriteImage.height + size.y
      );

      ctx.drawImage(
        spriteImage,
        currentFrame * frameWidth,
        0,
        frameWidth,
        spriteImage.height,
        pos.x - size.x / 2,
        pos.y - size.y / 2,
        frameWidth + size.x,
        spriteImage.height + size.y
      );

      currentFrame = (currentFrame + 1) % parts;

      if (currentFrame === 0) {
        loopsLeft--;

        if (loopsLeft === 0) {
          stopAnimation(entityId, whenDone);
          return;
        }
      }

      animationsRegistry[entityId] = {
        timeoutId: setTimeout(animate, 1000 / frameRate),
        whenDone,
      };
    };

    animate();
  };
};

export const stopAnimation = (entityId, whenDone = () => {}) => {
  if (animationsRegistry[entityId]) {
    clearTimeout(animationsRegistry[entityId].timeoutId);
    delete animationsRegistry[entityId]; // Ta bort animationen från registret
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Kalla på whenDone om det är en funktion
  if (typeof whenDone === "function") {
    whenDone();
  }
};
