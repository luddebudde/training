import {
  playerAnimationQueue,
  checkNextPlayerAnimation,
  idleAnimation,
} from "./playerAnimations";

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

      // Spara all relevant information om animationen i animationsRegistry
      animationsRegistry[entityId] = {
        timeoutId: setTimeout(animate, 1000 / frameRate),
        pos, // Fiendens position
        size, // Fiendens storlek
        frameWidth, // Bredden på varje sprite
        spriteHeight: spriteImage.height, // Höjden på sprite
        whenDone, // Callback när animationen är klar
      };
    };

    animate();
  };
};

export const stopAnimation = (entityId, whenDone = () => {}) => {
  if (animationsRegistry[entityId]) {
    clearTimeout(animationsRegistry[entityId].timeoutId);

    // Hämta information om den aktiva animationen (t.ex. position och storlek)
    // console.log(animationsRegistry[entityId]);

    const animation = animationsRegistry[entityId];
    const { pos, size, frameWidth, spriteHeight } = animation;

    // Rensa endast det område där animationen finns
    ctx.clearRect(
      pos.x - size.x / 2,
      pos.y - size.y / 2,
      frameWidth + size.x,
      spriteHeight + size.y
    );

    delete animationsRegistry[entityId]; // Ta bort animationen från registret
  }

  // Kalla på whenDone om det är en funktion
  if (typeof whenDone === "function") {
    whenDone();
  }
};
