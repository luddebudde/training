import { playAnimation, stopAnimation } from "./playAnimation";
import { player } from "./player";
import { currentlyWalking } from "./walkTowardsMapBlock";

export const playerAnimationQueue = [];

export const checkNextPlayerAnimation = () => {
  // console.log(animationQueue);

  if (playerAnimationQueue[0] === undefined) {
    // console.log("tjena");

    idleAnimation();
    return;
  } else {
    // console.log("benfh");

    playerAnimationQueue[0]();
    playerAnimationQueue.splice(0);
  }
};

// playAnimation(
//   "sprite.png",
//   10, // parts
//   24, // frameRate
//   5, // loopTimes
//   "myCanvas",
//   { x: 100, y: 100 }, // pos
//   { x: 50, y: 50 }, // size
//   "player1" // unique entityId
// );

export const checkWalking = () => {
  if (currentlyWalking) {
    playerAnimationQueue.push(runAnimation);
  }
  checkNextPlayerAnimation();
};

export const runAnimation = () => {
  playAnimation(
    "/runNew.png",
    7,
    10,
    1,
    "myCanvas",
    player.pos,
    player.size,
    "player",
    checkWalking
  );
};

export const idleAnimation = () => {
  playAnimation(
    "/Idle.png",
    4,
    0.4,
    1,
    "myCanvas",
    player.pos,
    player.size,
    "player",
    checkNextPlayerAnimation
  );
};

export const attackAnimation = () => {
  playAnimation(
    "/attack.png",
    5,
    5,
    1,
    "myCanvas",
    player.pos,
    player.size,
    "player", // unique entityId
    checkNextPlayerAnimation
  );
};

export const protectAnimation = () => {
  playAnimation(
    "/Protect.png",
    2,
    2,
    1,
    "myCanvas",
    player.pos,
    player.size,
    "player", // unique entityId
    checkNextPlayerAnimation
  );
};

const processAnimationQueue = () => {
  if (playerAnimationQueue.length > 0) {
    const nextAnimation = playerAnimationQueue.shift(); // Hämta och ta bort den första animationen i kön
    nextAnimation(); // Kör animationen
  }
};

export const overwritePlayerAnimation = (playAnimation) => {
  playerAnimationQueue.length = 0; // Rensa animationskön
  stopAnimation("player"); // Stopp den nuvarande animationen
  playerAnimationQueue.push(playAnimation); // Lägg till ny animation
  processAnimationQueue(); // Processa den nya animationen
};
